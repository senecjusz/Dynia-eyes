// Łagodny test gałki dużego oka: dwa serwa (lewo–prawo, góra–dół) na ESP32-C3 + PCA9685, bez kalibracji.
// Domyślnie kanały 12 (X, lewo–prawo) i 13 (Y, góra–dół), jak w dyni; na stole zmień komendą x / y.
// Po włączeniu żadne serwo nie dostaje impulsu. Komendy z portu (115200), każda zakończona Enterem:
//   start      = oba kanały na środek (1500 albo sx/sy) i ruch po kole; amplituda narasta od 0 przez pierwszy obieg
//   kolo       = ruch po elipsie (domyślnie)        losowo = płynne przejścia do losowych punktów w elipsie i postoje
//   a <µs>     = amplituda obu osi (domyślnie 100 µs ≈ 9°, najwyżej 400)   ax <µs> / ay <µs> = osobno
//   o <s>      = czas jednego obiegu koła (domyślnie 8 s, 3–60)
//   sx <µs> / sy <µs> = środek osi (domyślnie 1500)  x <n> / y <n> = kanał osi (tylko przy zatrzymanym ruchu)
//   stop       = płynnie na środek i trzymaj        off = bez impulsu       ? = stan
// Zmiana amplitudy, środka i okresu działa płynnie (wartości dochodzą do nowych przez ok. 2 s), bez skoku.
// Przeliczanie µs na ticki jak w kalibracja/ i dynia-v2: 27 MHz, 50 Hz, prescale 131.
// Kompilacja: arduino-cli compile -b esp32:esp32:esp32c3:CDCOnBoot=cdc 50-elektronika/test-galka

#include <Wire.h>
#include <Adafruit_PWMServoDriver.h>

const uint32_t OSC_HZ = 27000000;
const uint8_t PCA_ADR = 0x40, PRESCALE_50HZ = 131;
const int US_MIN = 900, US_MAX = 2100;    // granica bezpieczeństwa: środek ± amplituda nie wyjdzie poza nią
const int A_MAX = 400;
const uint32_t KROK_MS = 20;
Adafruit_PWMServoDriver pca(PCA_ADR);
float usNaTick = 0;

int kx = 12, ky = 13;
enum Tryb { WYL, STOP, KOLO, LOSOWO } tryb = WYL;
float axCel = 100, ayCel = 100, sxCel = 1500, syCel = 1500, okresCel = 8;   // nastawy
float ax = 0, ay = 0, sx = 1500, sy = 1500, okres = 8;                      // bieżące (dochodzą do nastaw)
float faza = 0;
// losowo: przejście od (p0) do (p1) w czasie tR, potem postój do tP
float p0x = 0, p0y = 0, p1x = 0, p1y = 0; uint32_t tR0 = 0, tR = 1, tP = 0;
float ux = 0, uy = 0;   // bieżące wychylenie w jednostkach amplitudy (−1..1)
String linia;

bool ustawUs(int ch, float us) {
  uint16_t t = (uint16_t)(constrain(us, US_MIN, US_MAX) / usNaTick + 0.5f);
  return pca.setPWM(ch, 0, t) == 0;
}
void wylacz(int ch) { pca.setPWM(ch, 0, 4096); }
float dojdz(float v, float cel, float krok) { return v < cel ? min(v + krok, cel) : max(v - krok, cel); }
float smooth(float t) { t = constrain(t, 0.0f, 1.0f); return t * t * (3 - 2 * t); }

void stan() {
  const char *n[] = {"bez impulsu", "stop (środek)", "koło", "losowo"};
  Serial.printf("tryb %s | X kanał %d środek %.0f ampl %.0f | Y kanał %d środek %.0f ampl %.0f | obieg %.0f s\n",
                n[tryb], kx, sxCel, axCel, ky, syCel, ayCel, okresCel);
}

void nowyCel() {
  p0x = ux; p0y = uy;
  float k = random(0, 6283) / 1000.0f, r = sqrtf(random(0, 1000) / 1000.0f);   // równomiernie w elipsie
  p1x = r * cosf(k); p1y = r * sinf(k);
  float d = hypotf(p1x - p0x, p1y - p0y);
  tR0 = millis(); tR = 600 + (uint32_t)(d * 900); tP = tR0 + tR + random(800, 2500);
}

void komenda(String c) {
  c.trim();
  int sp = c.indexOf(' ');
  String k = sp < 0 ? c : c.substring(0, sp);
  float v = sp < 0 ? NAN : c.substring(sp + 1).toFloat();
  if (k == "start") {
    if (usNaTick <= 0) { Serial.println("BŁĄD: PCA9685 nie działa"); return; }
    if (tryb == WYL) { ax = ay = 0; sx = sxCel; sy = syCel; ux = uy = 0; ustawUs(kx, sx); delay(150); ustawUs(ky, sy); }
    tryb = KOLO;
  }
  else if (k == "kolo") { if (tryb == WYL) { Serial.println("najpierw start"); return; } tryb = KOLO; }
  else if (k == "losowo") { if (tryb == WYL) { Serial.println("najpierw start"); return; } tryb = LOSOWO; nowyCel(); }
  else if (k == "stop") { if (tryb != WYL) tryb = STOP; }
  else if (k == "off") { tryb = WYL; wylacz(kx); wylacz(ky); }
  else if (k == "a" && !isnan(v)) axCel = ayCel = constrain(v, 0, A_MAX);
  else if (k == "ax" && !isnan(v)) axCel = constrain(v, 0, A_MAX);
  else if (k == "ay" && !isnan(v)) ayCel = constrain(v, 0, A_MAX);
  else if (k == "o" && !isnan(v)) okresCel = constrain(v, 3, 60);
  else if (k == "sx" && !isnan(v)) sxCel = constrain(v, US_MIN + A_MAX, US_MAX - A_MAX);
  else if (k == "sy" && !isnan(v)) syCel = constrain(v, US_MIN + A_MAX, US_MAX - A_MAX);
  else if ((k == "x" || k == "y") && !isnan(v)) {
    if (tryb != WYL) { Serial.println("najpierw off"); return; }
    int ch = constrain((int)v, 0, 15);
    if (k == "x") kx = ch; else ky = ch;
  }
  else if (k != "?") { Serial.println("komendy: start kolo losowo stop off a ax ay o sx sy x y ?"); return; }
  stan();
}

void setup() {
  Serial.begin(115200);
  Serial.setTxTimeoutMs(0);
  Wire.begin(8, 9);
  Wire.beginTransmission(PCA_ADR); Wire.write(0xFD); Wire.write(0x10);   // ALL_LED_OFF: po restarcie ESP żadnych starych impulsów
  bool ok = Wire.endTransmission() == 0 && pca.begin();
  if (ok) {
    pca.setOscillatorFrequency(OSC_HZ);
    pca.setPWMFreq(50);
    Wire.beginTransmission(PCA_ADR); Wire.write(0xFE);
    ok = Wire.endTransmission() == 0 && Wire.requestFrom(PCA_ADR, (uint8_t)1) == 1 && Wire.read() == PRESCALE_50HZ;
  }
  if (ok) { usNaTick = 1e6f * (PRESCALE_50HZ + 1) / OSC_HZ; for (int ch = 0; ch < 16; ch++) wylacz(ch); }
  randomSeed(esp_random());
  Serial.println(ok ? "test-galka: bez impulsu; start = ruch" : "BŁĄD startu PCA9685; sprawdź połączenia i zrestartuj");
  stan();
}

void loop() {
  while (Serial.available()) {
    char z = Serial.read();
    if (z == '\n' || z == '\r') { if (linia.length()) komenda(linia); linia = ""; }
    else if (linia.length() < 40) linia += z;
  }
  static uint32_t tOst = 0;
  uint32_t t = millis();
  if (t - tOst < KROK_MS || tryb == WYL || usNaTick <= 0) return;
  float dt = (t - tOst) / 1000.0f;
  tOst = t;

  // Nastawy dochodzą płynnie: amplituda i środek 100 µs/s, okres 4 s/s.
  bool stop = tryb == STOP;
  ax = dojdz(ax, stop ? 0 : axCel, 100 * dt); ay = dojdz(ay, stop ? 0 : ayCel, 100 * dt);
  sx = dojdz(sx, sxCel, 100 * dt);            sy = dojdz(sy, syCel, 100 * dt);
  okres = dojdz(okres, okresCel, 4 * dt);

  if (tryb == KOLO) {
    faza += 2 * PI * dt / okres;
    if (faza > 2 * PI) faza -= 2 * PI;
    // wychylenie dochodzi do koła płynnie (po przejściu z losowo nie ma skoku)
    ux = dojdz(ux, cosf(faza), 1.5f * dt); uy = dojdz(uy, sinf(faza), 1.5f * dt);
  } else if (tryb == LOSOWO) {
    if ((int32_t)(t - tP) >= 0) nowyCel();
    float s = smooth((t - tR0) / (float)tR);
    ux = p0x + (p1x - p0x) * s; uy = p0y + (p1y - p0y) * s;
  }
  ustawUs(kx, sx + ax * ux);
  ustawUs(ky, sy + ay * uy);
}
