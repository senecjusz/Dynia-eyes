// Ruch małych oczu dyni: ESP32-C3 SuperMini + PCA9685 (0x40) + SG90 na kanałach 0..N_OCZU-1.
// Wzorowane na ServoPumpkin (pythoncader, CC0), ale bez blokowania: każde oko ma własny stan.
// Ruch oka = sakada (szybki ruch z rozpędem i hamowaniem) + fiksacja (postój 0,6–3 s),
// czasem mała poprawka o kilka stopni. Najwyżej MAX_RUCHOW oczu rusza się naraz.
// Tryby: SPOCZYNEK (co ok. 5 s jedno oko) i AKTYWNY (ktoś blisko: częściej, czasem wszystkie
// patrzą w tę samą stronę). Tryb ustawia czujnik zbliżenia na PIN_CZUJNIK albo komenda z portu.
// Komendy (port szeregowy, 115200): a = aktywny, s = spoczynek, c = wszystkie na środek (stop),
// r = wznow ruch, k<nr> <us> = środek oka nr w µs (np. "k0 1520").
// Kompilacja: arduino-cli compile -b esp32:esp32:esp32c3:CDCOnBoot=cdc 50-elektronika/oczy-ruch

#include <Wire.h>
#include <Adafruit_PWMServoDriver.h>

const int PIN_SDA = 8, PIN_SCL = 9;
const int PIN_CZUJNIK = -1;          // np. 3 dla czujnika z wyjściem cyfrowym (HIGH = ktoś blisko); -1 = brak
const int N_OCZU = 1;                // na teście jeden moduł; docelowo do 16 na jednym PCA9685
const int MAX_RUCHOW = 2;            // ile oczu naraz w ruchu
const float US_NA_STOPIEN = 2000.0 / 180.0;
const float ZAKRES_DEG = 25;         // ±25° serwa = ±278 µs; kalibracja 21.10: ±300 µs wokół 1500 bez oporu
const uint32_t KROK_MS = 20;         // 50 Hz aktualizacji

Adafruit_PWMServoDriver pca(0x40);

struct Oko {
  int srodekUs = 1500;               // kalibracja środka (docelowo z telefonu)
  float kat = 0, start = 0, cel = 0; // stopnie względem środka
  uint32_t tStart = 0, czasRuchu = 0, tNastepny = 0;
  bool wRuchu = false;
  float nastCel = NAN;               // cel narzucony przez rutynę grupową
};
Oko oczy[N_OCZU];

bool aktywny = false, stop = false;
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

void komendy() {
  static String linia;
  while (Serial.available()) {
    char c = Serial.read();
    if (c != '\n' && c != '\r') { linia += c; continue; }
    if (linia == "a") aktywny = true;
    else if (linia == "s") aktywny = false;
    else if (linia == "c") { stop = true; for (int i = 0; i < N_OCZU; i++) ruszOko(i, 0); }
    else if (linia == "r") stop = false;
    else if (linia.startsWith("k")) {
      int sp = linia.indexOf(' ');
      int nr = linia.substring(1, sp).toInt(), us = linia.substring(sp + 1).toInt();
      if (nr >= 0 && nr < N_OCZU && us > 1000 && us < 2000) { oczy[nr].srodekUs = us; ustaw(nr); }
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
  for (int i = 0; i < N_OCZU; i++) { ustaw(i); oczy[i].tNastepny = millis() + random(500, 3000); }
}

void loop() {
  static uint32_t tKrok = 0;
  uint32_t t = millis();
  komendy();
  if (PIN_CZUJNIK >= 0) aktywny = digitalRead(PIN_CZUJNIK) == HIGH;
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
