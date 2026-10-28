// dynia-v2, etap 1 (zakres PM 27.10): 8 małych oczu, PIR, przycisk blokady, duże oko, podtrzymanie powerbanku.
// Wymagania: 30-projekt/PRD.md §5–6; plan: 50-elektronika/dynia-v2-plan.md; połączenia: 50-elektronika/polaczenia.md.
//
// Zachowanie:
//   spoczynek  – duże oko zamknięte (gałka na środku), co 4–6 s rusza się jedno małe oko;
//   aktywny    – PIR wykrył ruch: małe oczy rozglądają się (najwyżej 2 naraz), duże oko otwiera się i rozgląda;
//                30 s bez ruchu = powrót do spoczynku; pierwsze 60 s po starcie PIR jest ignorowany;
//   blokada    – przycisk przytrzymany 5 s: duże oko na środek, powieki otwarte, wszystkie oczy na środek i stop;
//                ponowne 5 s = powrót do pracy. Po włączeniu prądu zawsze zwykła praca (blokada nie jest zapamiętywana).
// Ruch płynny (smoothstep). Po dojściu do celu impuls kanału jest wyłączany (serwo trzyma tarciem, nie buczy).
// Start bez skoku: ostatnia pozycja każdego kanału w NVS; po starcie impuls z NVS, potem wolny dojazd na środek.
// Punkt dostępu Wi-Fi (ukryty, bez strony) włączony stale: obciążenie podtrzymujące powerbank Baseus.
// Port szeregowy 115200 (komenda + Enter): a = aktywny, s = spoczynek, b = blokada wł./wył., ? = stan,
//   g <x> <y> = gałka w punkt (−100…100 % zakresu, przechodzi w blokadę), z <min> <max> = sprzężenie osi w µs (do restartu).
// Kompilacja: arduino-cli compile -b esp32:esp32:esp32c3:CDCOnBoot=cdc 50-elektronika/dynia-v2

#include <Wire.h>
#include <WiFi.h>
#include <Preferences.h>
#include <Adafruit_PWMServoDriver.h>
#include "kalibracja.h"

// ===== Piny i stałe =====
const int PIN_SDA = 8, PIN_SCL = 9, PIN_PIR = 10, PIN_PRZYCISK = 4;
const uint8_t PCA_ADR = 0x40;
const uint32_t OSC_HZ = 27000000;
const uint8_t PRESCALE_50HZ = 131;
const char *AP_SSID = "dynia", *AP_HASLO = "dynia-wystawa-2026";

const uint32_t KROK_MS = 20;              // aktualizacja impulsów
const int US_KROK_MAX = 80;               // największa zmiana impulsu na krok
const uint32_t CISZA_MS = 400;            // po dojściu do celu: tyle czekamy i wyłączamy impuls
const uint32_t ROZRUCH_KANAL_MS = 150;    // rozruch: pierwszy impuls co 150 ms na kanał
const uint32_t ROZRUCH_RUCH_MS = 1500;    // rozruch: wolny dojazd na środek
const uint32_t PIR_IGNORUJ_MS = 60000;    // HC-SR501 stabilizuje się po włączeniu
const uint32_t AKTYWNY_MS = 30000;        // tyle po ostatnim ruchu PIR dynia jest aktywna
const uint32_t PRZYCISK_MS = 5000;        // przytrzymanie przycisku
const int MAX_MALYCH_W_RUCHU = 2;
const uint32_t ZAPIS_KANAL_MS = 2000, ZAPIS_ODSTEP_MS = 500;   // NVS: najwyżej co 2 s na kanał, 0,5 s ogólnie

// ===== Serwa =====
// Indeksy: 0–7 małe oczy, 8 gałka X (L–P), 9 gałka Y (G–D), 10 powieka górna, 11 powieka dolna.
const int I_GX = 8, I_GY = 9, I_PG = 10, I_PD = 11;
const int N_SERW = GALKA_GOTOWA ? (POWIEKI_GOTOWE ? 12 : 10) : 8;
int16_t sprzMin = SPRZ_GY_PRZY_X_MIN, sprzMax = SPRZ_GY_PRZY_X_MAX;   // sprzężenie osi, zmieniane komendą z

struct Serwo {
  uint8_t ch; int16_t mn, sr, mx;
  float us = 0, od = 0, cel = 0;
  uint32_t t0 = 0, czas = 1, tKonca = 0, tZapisu = 0, tNastepny = 0;
  bool ruch = false, pwm = false, doZapisu = false;
  int16_t zapisane = -1;
};
Serwo S[12];

Adafruit_PWMServoDriver pca(PCA_ADR);
Preferences nvs;
bool nvsOk = false, pcaOk = false;
float usNaTick = 0;
uint32_t tZapisuOgolny = 0;

enum Tryb : uint8_t { ROZRUCH, SPOCZYNEK, AKTYWNY, BLOKADA };
Tryb tryb = ROZRUCH;
uint32_t tStartu = 0, tOstRuchuPir = 0, tNastepnySpoczynek = 0;
uint32_t tWcisniecia = 0; bool wcisniety = false, przyciskObsluzony = false;
int rozruchKanal = 0; uint32_t tRozruchu = 0; bool rozruchDojazd = false;

uint32_t losuj(uint32_t a, uint32_t b) { return a + esp_random() % (b - a + 1); }
float losujF(float a, float b) { return a + (b - a) * (esp_random() / 4294967295.0f); }

// ===== PCA9685 =====
bool czytajRej(uint8_t reg, uint8_t &v) {
  Wire.beginTransmission(PCA_ADR); Wire.write(reg);
  if (Wire.endTransmission(false) != 0 || Wire.requestFrom(PCA_ADR, (uint8_t)1) != 1) return false;
  v = Wire.read(); return true;
}

bool pcaStart() {
  // Po restarcie samego ESP PCA9685 pamięta stare impulsy: najpierw ALL_LED_OFF_H = FULL_OFF dla wszystkich kanałów.
  Wire.beginTransmission(PCA_ADR); Wire.write(0xFD); Wire.write(0x10);
  if (Wire.endTransmission() != 0 || !pca.begin()) return false;
  pca.setOscillatorFrequency(OSC_HZ);
  pca.setPWMFreq(50);
  uint8_t pre = 0, mode1 = 0;
  if (!czytajRej(0xFE, pre) || pre != PRESCALE_50HZ || !czytajRej(0x00, mode1) || (mode1 & 0x10) || !(mode1 & 0x20)) {
    Serial.printf("BŁĄD startu PCA9685 (prescale %d, MODE1 0x%02X)\n", pre, mode1);
    return false;
  }
  usNaTick = 1e6f * (pre + 1) / OSC_HZ;
  for (int ch = 0; ch < 16; ch++) pca.setPWM(ch, 0, 4096);
  return true;
}

// Sprzężenie osi: poprawka impulsu G–D zależna od położenia L–P (kwadrat wychylenia, osobno dla strony min i max).
float sprzezenieGY() {
  const Serwo &x = S[I_GX];
  float d = x.us - x.sr;
  float n = d < 0 ? d / (x.sr - x.mn) : d / (x.mx - x.sr);
  return (d < 0 ? sprzMin : sprzMax) * n * n;
}

// s.us to pozycja „logiczna” (ruch, NVS); do PCA idzie z poprawką sprzężenia, gdy to kanał G–D gałki.
void impuls(Serwo &s, float v) {
  v = constrain(v, (float)s.mn, (float)s.mx);
  s.us = v;
  if (!pcaOk) return;
  if (GALKA_GOTOWA && &s == &S[I_GY]) v = constrain(v + sprzezenieGY(), (float)s.mn, (float)s.mx);
  pca.setPWM(s.ch, 0, (uint16_t)(v / usNaTick + 0.5f));
  s.pwm = true;
}

void bezImpulsu(Serwo &s) {
  if (pcaOk) pca.setPWM(s.ch, 0, 4096);
  s.pwm = false;
}

// ===== Ruch =====
void ruch(int i, float cel, uint32_t czas) {
  Serwo &s = S[i];
  cel = constrain(cel, (float)s.mn, (float)s.mx);
  if (!s.pwm) impuls(s, s.us);              // impuls wraca od zapamiętanej pozycji, bez skoku
  s.od = s.us; s.cel = cel; s.t0 = millis(); s.czas = max<uint32_t>(czas, KROK_MS); s.ruch = true;
}

void krokRuchu(uint32_t t) {
  for (int i = 0; i < N_SERW; i++) {
    Serwo &s = S[i];
    if (s.ruch) {
      float f = min(1.0f, (float)(t - s.t0) / s.czas);
      float u = s.od + (s.cel - s.od) * f * f * (3 - 2 * f);
      u = constrain(u, s.us - US_KROK_MAX, s.us + US_KROK_MAX);
      impuls(s, u);
      if (f >= 1 && fabsf(s.us - s.cel) < 1) { s.ruch = false; s.tKonca = t; s.doZapisu = true; }
    } else if (s.pwm && t - s.tKonca > CISZA_MS) {
      bezImpulsu(s);
    }
  }
  // L–P jedzie, a G–D stoi: G–D dostaje impuls z nową poprawką sprzężenia i trzyma go jeszcze CISZA_MS po końcu L–P.
  if (GALKA_GOTOWA && S[I_GX].ruch && !S[I_GY].ruch) { impuls(S[I_GY], S[I_GY].us); S[I_GY].tKonca = t; }
}

int malychWRuchu() { int n = 0; for (int i = 0; i < 8; i++) n += S[i].ruch; return n; }
bool wszystkieStoja() { for (int i = 0; i < N_SERW; i++) if (S[i].ruch) return false; return true; }

// Czas ruchu z odległości: spokojny w spoczynku, szybszy (sakada) w trybie aktywnym.
uint32_t czasRuchu(float d, bool szybko) {
  d = fabsf(d);
  return szybko ? 120 + (uint32_t)(d * 0.5f) : 300 + (uint32_t)(d * 1.0f);
}

// Małe oczy na środek, najwyżej MAX_MALYCH_W_RUCHU naraz.
void naSrodekPoKolei(uint32_t czas) {
  for (int i = 0; i < 8 && malychWRuchu() < MAX_MALYCH_W_RUCHU; i++)
    if (!S[i].ruch && fabsf(S[i].us - S[i].sr) >= 1) ruch(i, S[i].sr, czas);
}

void malyCel(int i, bool szybko, float zakres) {
  Serwo &s = S[i];
  float c = losujF(-zakres, zakres);
  float cel = c < 0 ? s.sr + c * (s.sr - s.mn) : s.sr + c * (s.mx - s.sr);
  ruch(i, cel, czasRuchu(cel - s.us, szybko));
}

// ===== Duże oko =====
float powUs(const KalPow &p, float otwarcie) { return p.zamk + (p.otw - p.zamk) * otwarcie; }
bool galkaNaSrodku() { return fabsf(S[I_GX].us - S[I_GX].sr) < 2 && fabsf(S[I_GY].us - S[I_GY].sr) < 2; }
bool powiekiNa(float otwarcie) {
  if (!POWIEKI_GOTOWE) return true;
  return fabsf(S[I_PG].us - powUs(POW_G, otwarcie)) < 2 && fabsf(S[I_PD].us - powUs(POW_D, otwarcie)) < 2;
}
bool duzeWRuchu() { return S[I_GX].ruch || S[I_GY].ruch || S[I_PG].ruch || S[I_PD].ruch; }

void galkaNaSrodek(uint32_t czas) { ruch(I_GX, S[I_GX].sr, czas); ruch(I_GY, S[I_GY].sr, czas); }
void powieki(float otwarcie, uint32_t czas) {
  if (!POWIEKI_GOTOWE) return;
  ruch(I_PG, powUs(POW_G, otwarcie), czas); ruch(I_PD, powUs(POW_D, otwarcie), czas);
}

// Zamknięte: najpierw gałka na środek, potem powieki.
void duzeZamknij() {
  if (!GALKA_GOTOWA || duzeWRuchu()) return;
  if (!galkaNaSrodku()) galkaNaSrodek(500);
  else if (!powiekiNa(0)) powieki(0, 400);
}

// Otwarte i rozgląda się: cel gałki w elipsie zakresów obu osi (bez rogów).
void duzeRozgladaj(uint32_t t) {
  if (!GALKA_GOTOWA || duzeWRuchu()) return;
  if (!powiekiNa(1)) { powieki(1, 500); S[I_GX].tNastepny = t + 300; return; }
  if ((int32_t)(t - S[I_GX].tNastepny) < 0) return;
  float a = losujF(0, 2 * PI), r = sqrtf(losujF(0, 1)) * 0.9f;
  float x = r * cosf(a), y = r * sinf(a);
  Serwo &gx = S[I_GX], &gy = S[I_GY];
  float cx = x < 0 ? gx.sr + x * (gx.sr - gx.mn) : gx.sr + x * (gx.mx - gx.sr);
  float cy = y < 0 ? gy.sr + y * (gy.sr - gy.mn) : gy.sr + y * (gy.mx - gy.sr);
  uint32_t cz = max(czasRuchu(cx - gx.us, true), czasRuchu(cy - gy.us, true));
  ruch(I_GX, cx, cz); ruch(I_GY, cy, cz);
  gx.tNastepny = t + cz + losuj(600, 2000);
}

// ===== Tryby =====
const char *nazwaTrybu() {
  switch (tryb) { case ROZRUCH: return "rozruch"; case SPOCZYNEK: return "spoczynek";
                  case AKTYWNY: return "aktywny"; default: return "blokada"; }
}

void ustawTryb(Tryb n) {
  if (n == tryb) return;
  tryb = n;
  Serial.printf("%lu s: tryb %s\n", millis() / 1000, nazwaTrybu());
  uint32_t t = millis();
  if (n == BLOKADA) {   // małe oczy jadą na środek w krokTrybu, po 2 naraz
    for (int i = 0; i < 8; i++) S[i].ruch = false;
    if (GALKA_GOTOWA) { galkaNaSrodek(600); powieki(1, 600); }
  } else if (n == SPOCZYNEK) {
    tNastepnySpoczynek = t + losuj(4000, 6000);
  } else if (n == AKTYWNY) {
    for (int i = 0; i < 8; i++) S[i].tNastepny = t + losuj(0, 1500);
    if (GALKA_GOTOWA) S[I_GX].tNastepny = t;
  }
}

void krokTrybu(uint32_t t) {
  if (tryb == ROZRUCH) {
    // Kanał po kanale impuls z NVS (tam serwo stoi), potem wolny dojazd: małe oczy i gałka na środek, na końcu powieki zamknięte.
    if (rozruchKanal < N_SERW) {
      if (t - tRozruchu >= ROZRUCH_KANAL_MS) { impuls(S[rozruchKanal], S[rozruchKanal].us); rozruchKanal++; tRozruchu = t; }
      return;
    }
    if (!rozruchDojazd) {
      naSrodekPoKolei(ROZRUCH_RUCH_MS);
      if (malychWRuchu() == 0) {
        bool wszystkie = true;
        for (int i = 0; i < 8; i++) if (fabsf(S[i].us - S[i].sr) >= 1) wszystkie = false;
        if (wszystkie) rozruchDojazd = true;
      }
      if (GALKA_GOTOWA && !duzeWRuchu() && !galkaNaSrodku()) galkaNaSrodek(ROZRUCH_RUCH_MS);
      return;
    }
    if (GALKA_GOTOWA && !(galkaNaSrodku() && powiekiNa(0))) { duzeZamknij(); return; }
    if (wszystkieStoja()) ustawTryb(SPOCZYNEK);
    return;
  }
  if (tryb == BLOKADA) { naSrodekPoKolei(600); return; }

  bool pirGotowy = t - tStartu > PIR_IGNORUJ_MS;
  if (pirGotowy && digitalRead(PIN_PIR) == HIGH) {
    tOstRuchuPir = t;
    if (tryb == SPOCZYNEK) ustawTryb(AKTYWNY);
  }

  if (tryb == SPOCZYNEK) {
    duzeZamknij();
    if ((int32_t)(t - tNastepnySpoczynek) >= 0) {
      int i = losuj(0, 7);
      if (!S[i].ruch) malyCel(i, false, 0.6f);
      tNastepnySpoczynek = t + losuj(4000, 6000);
    }
  } else {  // AKTYWNY
    if (t - tOstRuchuPir > AKTYWNY_MS) { ustawTryb(SPOCZYNEK); return; }
    for (int i = 0; i < 8; i++) {
      Serwo &s = S[i];
      if (s.ruch || (int32_t)(t - s.tNastepny) < 0 || malychWRuchu() >= MAX_MALYCH_W_RUCHU) continue;
      malyCel(i, true, 0.9f);
      s.tNastepny = t + s.czas + losuj(400, 1800);
    }
    duzeRozgladaj(t);
  }
}

// ===== Przycisk: przytrzymanie 5 s przełącza blokadę =====
void krokPrzycisku(uint32_t t) {
  bool w = digitalRead(PIN_PRZYCISK) == LOW;
  if (w && !wcisniety) { wcisniety = true; tWcisniecia = t; przyciskObsluzony = false; }
  if (!w) { wcisniety = false; return; }
  if (!przyciskObsluzony && t - tWcisniecia >= PRZYCISK_MS && tryb != ROZRUCH) {
    przyciskObsluzony = true;
    ustawTryb(tryb == BLOKADA ? SPOCZYNEK : BLOKADA);
  }
}

// ===== NVS pozycji =====
void krokZapisu(uint32_t t) {
  if (!nvsOk || t - tZapisuOgolny < ZAPIS_ODSTEP_MS) return;
  for (int i = 0; i < N_SERW; i++) {
    Serwo &s = S[i];
    if (!s.doZapisu || t - s.tZapisu < ZAPIS_KANAL_MS) continue;
    s.doZapisu = false;
    int16_t v = (int16_t)lroundf(s.us);
    if (v == s.zapisane) continue;
    char k[6]; snprintf(k, sizeof k, "p%d", s.ch);
    if (nvs.putShort(k, v) == sizeof(int16_t)) s.zapisane = v;
    s.tZapisu = tZapisuOgolny = t;
    return;   // najwyżej jeden zapis na wywołanie
  }
}

// ===== Port szeregowy =====
void wypiszStan() {
  Serial.printf("tryb %s, PIR %d (%s), przycisk %d, PCA %s, duże oko %s\n", nazwaTrybu(), digitalRead(PIN_PIR),
                millis() - tStartu > PIR_IGNORUJ_MS ? "czynny" : "ignorowany", digitalRead(PIN_PRZYCISK) == LOW,
                pcaOk ? "OK" : "BŁĄD", GALKA_GOTOWA ? (POWIEKI_GOTOWE ? "tak" : "gałka bez powiek") : "wyłączone (brak kalibracji)");
  if (GALKA_GOTOWA) Serial.printf("  sprzężenie G–D: %d / %d us, teraz %+d us\n", sprzMin, sprzMax, (int)lroundf(sprzezenieGY()));
  for (int i = 0; i < N_SERW; i++)
    Serial.printf("  kanał %2d: %4d us%s%s\n", S[i].ch, (int)lroundf(S[i].us), S[i].ruch ? " ruch" : "", S[i].pwm ? " impuls" : "");
}

// Gałka w punkt: x, y w % zakresu (−100…100, ujemne = strona min). Do ustalania sprzężenia na sprzęcie.
void galkaW(float x, float y) {
  if (!GALKA_GOTOWA) { Serial.println("gałka wyłączona (GALKA_GOTOWA = false)"); return; }
  if (tryb != BLOKADA) ustawTryb(BLOKADA);
  x = constrain(x, -100.0f, 100.0f) / 100; y = constrain(y, -100.0f, 100.0f) / 100;
  Serwo &gx = S[I_GX], &gy = S[I_GY];
  float cx = x < 0 ? gx.sr + x * (gx.sr - gx.mn) : gx.sr + x * (gx.mx - gx.sr);
  float cy = y < 0 ? gy.sr + y * (gy.sr - gy.mn) : gy.sr + y * (gy.mx - gy.sr);
  ruch(I_GX, cx, 800); ruch(I_GY, cy, 800);
  Serial.printf("gałka: L–P %d us, G–D %d us (+ sprzężenie przy celu %d us)\n", (int)lroundf(cx), (int)lroundf(cy),
                (int)lroundf((x < 0 ? sprzMin : sprzMax) * x * x));
}

void wykonaj(char *l, uint32_t t) {
  char c = l[0];
  if (tryb == ROZRUCH && c != '?') return;
  if (c == 'a') { tOstRuchuPir = t; if (tryb == SPOCZYNEK) ustawTryb(AKTYWNY); }
  else if (c == 's') { if (tryb == AKTYWNY) ustawTryb(SPOCZYNEK); }
  else if (c == 'b') ustawTryb(tryb == BLOKADA ? SPOCZYNEK : BLOKADA);
  else if (c == '?') wypiszStan();
  else if (c == 'g') { float x = 0, y = 0; sscanf(l + 1, "%f %f", &x, &y); galkaW(x, y); }
  else if (c == 'z') {
    int a = sprzMin, b = sprzMax;
    if (sscanf(l + 1, "%d %d", &a, &b) >= 1) { sprzMin = constrain(a, -150, 150); sprzMax = constrain(b, -150, 150); }
    Serial.printf("sprzężenie G–D: %d us przy L–P min, %d us przy L–P max (do restartu; na stałe w kalibracja.h)\n", sprzMin, sprzMax);
    if (GALKA_GOTOWA && S[I_GY].pwm) impuls(S[I_GY], S[I_GY].us);
  }
}

void krokPortu(uint32_t t) {
  static char l[40]; static uint8_t n = 0;
  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\r' || c == '\n') { if (n) { l[n] = 0; wykonaj(l, t); n = 0; } }
    else if (n < sizeof l - 1) l[n++] = c;
  }
}

// ===== Start =====
void przygotujSerwa() {
  for (int i = 0; i < 8; i++) { S[i].ch = MALE[i].ch; S[i].mn = MALE[i].mn; S[i].sr = MALE[i].sr; S[i].mx = MALE[i].mx; }
  const Kal g[2] = {GALKA_X, GALKA_Y};
  for (int j = 0; j < 2; j++) { Serwo &s = S[I_GX + j]; s.ch = g[j].ch; s.mn = g[j].mn; s.sr = g[j].sr; s.mx = g[j].mx; }
  const KalPow p[2] = {POW_G, POW_D};
  for (int j = 0; j < 2; j++) {
    Serwo &s = S[I_PG + j]; s.ch = p[j].ch;
    s.mn = min(p[j].zamk, p[j].otw); s.mx = max(p[j].zamk, p[j].otw); s.sr = p[j].zamk;
  }
  // Pozycja startowa: wpis z NVS, jeśli jest i mieści się w [min, max]; inaczej środek (świadomy skok jednego serwa).
  for (int i = 0; i < 12; i++) {
    Serwo &s = S[i];
    char k[6]; snprintf(k, sizeof k, "p%d", s.ch);
    int16_t v = nvsOk ? nvs.getShort(k, -1) : -1;
    bool ok = v >= s.mn && v <= s.mx;
    s.us = ok ? v : s.sr; s.zapisane = ok ? v : -1;
  }
}

void setup() {
  Serial.begin(115200);
  Serial.setTxTimeoutMs(0);
  pinMode(PIN_PIR, INPUT_PULLDOWN);
  pinMode(PIN_PRZYCISK, INPUT_PULLUP);
  // Podtrzymanie powerbanku: punkt dostępu włączony przed rozruchem serw (test 22.10: bez Wi-Fi Baseus gasł co ok. 15 s).
  WiFi.mode(WIFI_AP);
  WiFi.softAP(AP_SSID, AP_HASLO, 1, 1, 1);
  Wire.begin(PIN_SDA, PIN_SCL);
  pcaOk = pcaStart();
  nvsOk = nvs.begin("dyniav2", false);
  przygotujSerwa();
  tStartu = tRozruchu = millis();
  Serial.printf("dynia-v2 etap 1: PCA %s, NVS %s, duże oko %s\n", pcaOk ? "OK" : "BŁĄD", nvsOk ? "OK" : "BŁĄD",
                GALKA_GOTOWA ? (POWIEKI_GOTOWE ? "tak" : "gałka bez powiek") : "wyłączone (brak kalibracji)");
}

void loop() {
  static uint32_t tKroku = 0;
  uint32_t t = millis();
  krokPortu(t);
  krokPrzycisku(t);
  if (t - tKroku >= KROK_MS) {
    tKroku = t;
    krokTrybu(t);
    krokRuchu(t);
    krokZapisu(t);
  }
}
