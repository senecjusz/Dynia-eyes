// TEST 24 h: program oczy-ruch w trybie stale AKTYWNYM + dziennik w pamięci flash (NVS).
// Co 60 s zapisuje: łączny czas pracy, liczbę ruchów, liczbę startów i przyczynę ostatniego restartu.
// Komendy (port szeregowy, 115200): l = wypisz dziennik i środki, z = wyzeruj dziennik (przed startem testu),
// k<nr> <us> = środek oka nr w µs, zapisany w NVS (np. "k1 1520"), plus komendy z oczy-ruch
// (c = stop na środku, r = wznów, a/s = tryb aktywny/spoczynek).
// Restart w trakcie testu (zanik zasilania, zawieszenie, watchdog) widać jako wzrost licznika startów.
//
// PRZED TESTEM:
// 1. Każdy moduł skalibruj programem 50-elektronika/kalibracja na jego kanale (KANAL 0 i 1) i zapisz
//    środek w tabeli modułów (E5.4) albo w dzienniku.
// 2. Wgraj ten program, otwórz monitor i wyślij środki obu oczu: "k0 <us>", "k1 <us>" według kalibracji
//    każdego modułu (np. "k0 1500", "k1 1520"). Środki są zapisane w NVS i czytane po każdym starcie,
//    także po restarcie w trakcie testu; bez zapisu program przyjmuje 1500 µs.
// 3. Sprawdź "l" (wypisuje środki), potem "z" – zeruje dziennik, środków nie kasuje. Start testu.
// PO TEŚCIE: "l".
// Uwaga: po włączeniu serwa od razu dostają impuls środka (bez łagodnego rozruchu).
// Kompilacja: arduino-cli compile -b esp32:esp32:esp32c3:CDCOnBoot=cdc 50-elektronika/test-24h

#include <Wire.h>
#include <Adafruit_PWMServoDriver.h>
#include <Preferences.h>
#include <esp_system.h>

const int PIN_SDA = 8, PIN_SCL = 9;
const int PIN_CZUJNIK = -1;          // np. 3 dla czujnika z wyjściem cyfrowym (HIGH = ktoś blisko); -1 = brak
const int N_OCZU = 2;                // test 24 h: moduły na kanałach 0 i 1 (drugi kanał bez serwa nie szkodzi)
const int MAX_RUCHOW = 2;            // ile oczu naraz w ruchu
const float US_NA_STOPIEN = 2000.0 / 180.0;
const float ZAKRES_DEG = 25;         // ±25° serwa = ±278 µs; kalibracja 21.10: ±300 µs wokół 1500 bez oporu
const uint32_t KROK_MS = 20;         // 50 Hz aktualizacji

Adafruit_PWMServoDriver pca(0x40);

struct Oko {
  int srodekUs = 1500;               // środek z kalibracji; nadpisywany wartością z NVS ("sr0", "sr1")
  float kat = 0, start = 0, cel = 0; // stopnie względem środka
  uint32_t tStart = 0, czasRuchu = 0, tNastepny = 0;
  bool wRuchu = false;
  float nastCel = NAN;               // cel narzucony przez rutynę grupową
};
Oko oczy[N_OCZU];

bool aktywny = true, stop = false;   // test: stale aktywny
Preferences nvs;
uint32_t ruchy = 0, czasPrzed = 0, starty = 0; int przyczyna = 0;
uint32_t tOstZapis = 0, tZero = 0;
uint32_t tOstSpoczynek = 0, tOstGrupa = 0;

void ustaw(int i) {
  pca.writeMicroseconds(i, oczy[i].srodekUs + (int)(oczy[i].kat * US_NA_STOPIEN));
}

int ileWRuchu() { int n = 0; for (auto &o : oczy) n += o.wRuchu; return n; }

// Sakada: czas zależny od amplitudy, jak u ludzi (ok. 2–3 ms/°), plus czas reakcji serwa.
void ruszOko(int i, float cel) {
  Oko &o = oczy[i];
  cel = constrain(cel, -ZAKRES_DEG, ZAKRES_DEG);
  o.start = o.kat; o.cel = cel; o.tStart = millis();
  o.czasRuchu = 120 + (uint32_t)(fabs(cel - o.kat) * 6);   // SG90: ok. 0,1 s / 60° bez obciążenia
  o.wRuchu = true;
  ruchy++;
}

float losowyCel(Oko &o) {
  if (!isnan(o.nastCel)) { float c = o.nastCel; o.nastCel = NAN; return c; }
  if (random(100) < 25) return o.kat + random(-6, 7);      // mała poprawka
  return random(-(int)ZAKRES_DEG, (int)ZAKRES_DEG + 1);
}

void zaplanujFiksacje(Oko &o) {
  o.tNastepny = millis() + (aktywny ? random(400, 1800) : random(1500, 6000));
}

void krokOka(int i, uint32_t t) {
  Oko &o = oczy[i];
  if (!o.wRuchu) return;
  float u = (float)(t - o.tStart) / o.czasRuchu;
  if (u >= 1) { u = 1; o.wRuchu = false; zaplanujFiksacje(o); }
  float s = u * u * (3 - 2 * u);                            // smoothstep: rozpęd i hamowanie
  o.kat = o.start + (o.cel - o.start) * s;
  ustaw(i);
}

void wszystkieWStrone(float kat) {          // rutyna grupowa: wszystkie kolejno patrzą w tę samą stronę
  for (auto &o : oczy) { o.nastCel = kat + random(-3, 4); o.tNastepny = 0; }   // limit MAX_RUCHOW dalej obowiązuje
}

void zapiszDziennik() {
  nvs.putUInt("czas", czasPrzed + (millis() - tZero) / 1000);
  nvs.putUInt("ruchy", ruchy);
}

String kluczSrodka(int i) { return String("sr") + i; }

void wypiszSrodki() {
  for (int i = 0; i < N_OCZU; i++)
    Serial.printf("srodek oka %d: %d us%s\n", i, oczy[i].srodekUs, nvs.isKey(kluczSrodka(i).c_str()) ? " (NVS)" : " (domyslny, brak zapisu)");
}

void wypiszDziennik() {
  uint32_t t = czasPrzed + (millis() - tZero) / 1000;
  Serial.printf("czas pracy %lu s (%.2f h), ruchy %lu, starty %lu, przyczyna ostatniego startu %d (1=zasilanie, 3=programowy, 4/5/6/7=watchdog/panika, 9=brownout)\n",
                t, t / 3600.0, ruchy, starty, przyczyna);
  wypiszSrodki();
}

void komendy() {
  static String linia;
  while (Serial.available()) {
    char c = Serial.read();
    if (c != '\n' && c != '\r') { linia += c; continue; }
    if (linia == "l") { wypiszDziennik(); linia = ""; continue; }
    if (linia == "z") {                      // kasuje tylko dziennik; środki oczu ("sr0", "sr1") zostają
      nvs.remove("czas"); nvs.remove("ruchy"); nvs.remove("przyczyna");
      ruchy = 0; czasPrzed = 0; tZero = millis(); starty = 1; nvs.putUInt("starty", 1);
      Serial.println("dziennik wyzerowany"); wypiszSrodki(); linia = ""; continue;
    }
    if (linia == "a") aktywny = true;
    else if (linia == "s") aktywny = false;
    else if (linia == "c") { stop = true; for (int i = 0; i < N_OCZU; i++) ruszOko(i, 0); }
    else if (linia == "r") stop = false;
    else if (linia.startsWith("k")) {
      int sp = linia.indexOf(' ');
      int nr = sp > 1 ? linia.substring(1, sp).toInt() : -1, us = sp > 1 ? linia.substring(sp + 1).toInt() : 0;
      if (nr >= 0 && nr < N_OCZU && us > 1000 && us < 2000) {
        oczy[nr].srodekUs = us; nvs.putInt(kluczSrodka(nr).c_str(), us); ustaw(nr);
        Serial.printf("srodek oka %d = %d us, zapisany w NVS\n", nr, us);
      } else Serial.println("blad: k<nr> <us>, nr 0..N_OCZU-1, us 1001..1999");
    }
    if (linia.length()) Serial.printf("tryb %s%s\n", aktywny ? "AKTYWNY" : "SPOCZYNEK", stop ? " (stop)" : "");
    linia = "";
  }
}

void setup() {
  Serial.begin(115200);
  Serial.setTxTimeoutMs(0);
  Wire.begin(PIN_SDA, PIN_SCL);
  pca.begin();
  pca.setOscillatorFrequency(27000000);
  pca.setPWMFreq(50);
  if (PIN_CZUJNIK >= 0) pinMode(PIN_CZUJNIK, INPUT);
  randomSeed(esp_random());
  nvs.begin("test24h", false);
  czasPrzed = nvs.getUInt("czas", 0);
  ruchy = nvs.getUInt("ruchy", 0);
  starty = nvs.getUInt("starty", 0) + 1;
  przyczyna = (int)esp_reset_reason();
  nvs.putUInt("starty", starty);
  nvs.putInt("przyczyna", przyczyna);
  for (int i = 0; i < N_OCZU; i++) {          // środki z NVS; bez zapisu 1500 µs
    String k = kluczSrodka(i);
    oczy[i].srodekUs = nvs.isKey(k.c_str()) ? nvs.getInt(k.c_str(), 1500) : 1500;
  }
  wypiszSrodki();
  for (int i = 0; i < N_OCZU; i++) { ustaw(i); oczy[i].tNastepny = millis() + random(500, 3000); }
}

void loop() {
  static uint32_t tKrok = 0;
  uint32_t t = millis();
  komendy();
  if (t - tOstZapis >= 60000) { tOstZapis = t; zapiszDziennik(); if ((t / 60000) % 10 == 0) wypiszDziennik(); }
  if (t - tKrok < KROK_MS) return;
  tKrok = t;

  for (int i = 0; i < N_OCZU; i++) krokOka(i, t);
  if (stop) return;

  if (aktywny && N_OCZU > 1 && t - tOstGrupa > 8000 && random(1000) < 5) {   // średnio co kilka s po 8 s
    tOstGrupa = t;
    wszystkieWStrone(random(-25, 26));
  }

  if (!aktywny && t - tOstSpoczynek < 5000) return;          // spoczynek: najwyżej jedno oko na ok. 5 s
  for (int i = 0; i < N_OCZU && ileWRuchu() < MAX_RUCHOW; i++) {
    int k = random(N_OCZU);                                   // losowa kolejność, nie 0→N
    Oko &o = oczy[k];
    if (o.wRuchu || t < o.tNastepny) continue;
    ruszOko(k, losowyCel(o));
    if (!aktywny) { tOstSpoczynek = t; break; }
  }
}
