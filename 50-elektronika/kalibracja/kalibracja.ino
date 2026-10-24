// Kalibracja modułów oczu: ESP32-C3 + PCA9685. Komendy z portu (115200), każda zakończona Enterem:
//   k <n>   = wybór kanału 0..15: poprzedni kanał bez impulsu, nowy od razu trzyma 1500 µs (nasadzanie orczyka)
//   <liczba> = impuls w µs, + / - = ±10 µs, ++ / -- = ±50 µs, g <cel> <ms> = płynny ruch do celu
//   s / min / max = zapis bieżącego impulsu jako środek / kraniec mniejszy / kraniec większy (NVS, przetrwa wyłączenie);
//   min i max zapisuj 20–30 µs przed oporem (serwo nie buczy) – program docelowy używa ich wprost
//   Impuls liczbą przy trzymanym serwie najwyżej ±150 µs od bieżącego; dalej przez g.
//   t = tabela wszystkich kanałów w Markdown (do 50-elektronika/kalibracja-oczu.md), ? = stan, off = bez impulsu
// Nowa komenda w trakcie g zatrzymuje ruch w bieżącym miejscu i wykonuje się normalnie (np. off).
// Po włączeniu żadne serwo nie dostaje impulsu, dopóki nie przyjdzie komenda k.
// Po off albo błędzie I2C pozycja serwa jest nieznana: +, -, g, s, min, max czekają na k albo impuls podany liczbą.
// Przeliczanie µs na ticki: 27 MHz, 50 Hz, prescale 131, ticki = floor(µs / (1e6 * (prescale + 1) / 27e6) + 0.5); dynia-v2 liczy tak samo.
// Kompilacja: arduino-cli compile -b esp32:esp32:esp32c3:CDCOnBoot=cdc 50-elektronika/kalibracja

#include <Wire.h>
#include <Preferences.h>
#include <Adafruit_PWMServoDriver.h>

const int US_MIN = 600, US_MAX = 2400;   // granica bezpieczeństwa impulsu
const int G_MS_MAX = 20000;              // najdłuższy ruch g
const int SKOK_MAX = 150;                // najdalszy skok impulsem podanym liczbą przy trzymanym serwie
const int LINIA_MAX = 40;                // dłuższa linia jest odrzucana w całości
const uint32_t OSC_HZ = 27000000;
const uint8_t PCA_ADR = 0x40;
Adafruit_PWMServoDriver pca(PCA_ADR);
Preferences nvs;
bool nvsOk = false;
const uint8_t PRESCALE_50HZ = 131;      // round(27e6 / (4096 · 50)) − 1; inny odczyt = błąd startu
float usNaTick = 0;    // z prescale odczytanego z PCA9685; 0 = PCA niezainicjowany, sterowanie zablokowane
bool niepewny = false; // ostatnia transakcja I2C zawiodła: kanał może nadal mieć stary impuls
int kanal = -1;        // -1 = nie wybrano kanału
bool aktywny = false;  // kanał dostaje impuls i us to impuls potwierdzony przez I2C
int us = 1500;

// Liczba całkowita w całym tokenie, bez śmieci na końcu i bez przepełnienia.
bool liczba(const String &t, long &v) {
  if (!t.length() || t.length() > 6) return false;
  for (int i = 0; i < (int)t.length(); i++)
    if (!isDigit(t[i]) && !(i == 0 && t[i] == '-' && t.length() > 1)) return false;
  v = t.toInt();
  return true;
}

int odczyt(char co, int ch) { char k[6]; snprintf(k, sizeof k, "%c%d", co, ch); return nvs.getInt(k, 0); }

void zapis(char co, int ch, const char *nazwa) {
  if (!aktywny) { Serial.println("serwo bez potwierdzonego impulsu: najpierw k <n> albo impuls liczbą"); return; }
  if (!nvsOk) { Serial.println("BŁĄD: NVS nie działa, nic nie zapisano"); return; }
  char k[6]; snprintf(k, sizeof k, "%c%d", co, ch);
  if (nvs.putInt(k, us) != sizeof(int32_t) || nvs.getInt(k, -1) != us) {
    Serial.printf("BŁĄD zapisu %s w NVS\n", nazwa); return;
  }
  Serial.printf("zapisano %s = %d us (kanał %d)\n", nazwa, us, ch);
}

void stan() {
  if (kanal < 0) { Serial.println("brak kanału: k <n>"); return; }
  Serial.printf("kanał %d, %s %d us | zapisane: środek %d, min %d, max %d\n", kanal,
                aktywny ? "impuls" : niepewny ? "impuls NIEPOTWIERDZONY (błąd I2C), ostatnio" : "BEZ impulsu, ostatnio", us,
                odczyt('s', kanal), odczyt('n', kanal), odczyt('x', kanal));
}

bool czytajRej(uint8_t reg, uint8_t &v);

// Impuls na kanale; true dopiero po potwierdzonej transakcji I2C.
bool wyslij(int v) {
  if (usNaTick <= 0) { Serial.println("BŁĄD: PCA9685 nie zainicjowany, sterowanie zablokowane"); return false; }
  uint16_t t = (uint16_t)(constrain(v, US_MIN, US_MAX) / usNaTick + 0.5f);
  if (pca.setPWM(kanal, 0, t) != 0) { niepewny = true; Serial.println("BŁĄD I2C: impuls nie wysłany"); return false; }
  niepewny = false;
  return true;
}

// Ustawia impuls; przy błędzie I2C pozycja staje się nieznana i zapisy są zablokowane.
bool ustaw(int v) {
  v = constrain(v, US_MIN, US_MAX);
  if (!wyslij(v)) { aktywny = false; return false; }
  // PCA po zaniku własnego zasilania wraca w SLEEP bez auto-inkrementacji: ACK jest, impulsu nie ma.
  uint8_t mode1 = 0;
  if (!czytajRej(0x00, mode1) || (mode1 & 0x10) || !(mode1 & 0x20)) {
    usNaTick = 0; aktywny = false; niepewny = true;
    Serial.printf("BŁĄD: PCA9685 zrestartowany albo bez łączności (MODE1 0x%02X), sterowanie zablokowane; zrestartuj ESP\n", mode1);
    return false;
  }
  us = v; aktywny = true;
  Serial.printf("kanał %d, impuls %d us\n", kanal, us);
  return true;
}

bool wylacz(int ch) {
  if (usNaTick <= 0) { Serial.println("BŁĄD: PCA9685 nie zainicjowany, sterowanie zablokowane"); return false; }
  if (pca.setPWM(ch, 0, 4096) != 0) { niepewny = true; Serial.printf("BŁĄD I2C: kanał %d nie wyłączony\n", ch); return false; }
  niepewny = false;
  return true;
}

// Fragment eksportu; false, gdy port nie przyjął całości.
bool pisz(const char *s) { size_t n = strlen(s); return Serial.write((const uint8_t *)s, n) == n; }

void tabela() {
  Serial.setTxTimeoutMs(200);   // tabela nie mieści się w buforze TX: tu czekamy na odbiór
  if (!nvsOk) pisz("BŁĄD: NVS nie działa, tabela pusta\n");
  bool ok = pisz("| Kanał | Moduł | Środek µs | Min µs | Max µs | Min to | Uwagi |\n|---|---|---|---|---|---|---|\n");
  int wiersze = 0;
  char b[128];
  for (int ch = 0; ch < 16; ch++) {
    int s = odczyt('s', ch), n = odczyt('n', ch), x = odczyt('x', ch);
    if (!s && !n && !x) continue;
    bool dobry = s && n && x && n < s && s < x;
    snprintf(b, sizeof b, "| %d |  | %d | %d | %d |  | %s |\n", ch, s, n, x, dobry ? "" : "BRAK albo min/max nie po obu stronach środka");
    ok = pisz(b) && ok;
    wiersze++;
  }
  snprintf(b, sizeof b, "koniec tabeli: %d wierszy\n", wiersze);
  ok = pisz(b) && ok;
  Serial.flush();
  if (!ok) pisz("\nTABELA NIEKOMPLETNA: port nie przyjął całości, powtórz t\n");
  Serial.setTxTimeoutMs(0);
}

bool czytajRej(uint8_t reg, uint8_t &v) {
  Wire.beginTransmission(PCA_ADR); Wire.write(reg);
  if (Wire.endTransmission() != 0 || Wire.requestFrom(PCA_ADR, (uint8_t)1) != 1) return false;
  v = Wire.read();
  return true;
}

void setup() {
  Serial.begin(115200);
  Serial.setTxTimeoutMs(0);
  nvsOk = nvs.begin("kalib", false);
  Wire.begin(8, 9);
  // Po restarcie samego ESP PCA9685 pamięta stare impulsy: najpierw ALL_LED_OFF_H = FULL_OFF (rejestr 0xFD, bit 4)
  // dla wszystkich kanałów naraz, potem begin(). Każdy kanał zostaje FULL_OFF, aż k ustawi mu impuls.
  Wire.beginTransmission(PCA_ADR); Wire.write(0xFD); Wire.write(0x10);
  bool ok = Wire.endTransmission() == 0 && pca.begin();
  uint8_t pre = 0, mode1 = 0;
  if (ok) {
    pca.setOscillatorFrequency(OSC_HZ);
    pca.setPWMFreq(50);
    // Sprawdzenie startu: prescale 131 (50 Hz przy 27 MHz), MODE1 bez SLEEP (0x10), z auto-inkrementacją (0x20).
    ok = czytajRej(0xFE, pre) && pre == PRESCALE_50HZ && czytajRej(0x00, mode1) && !(mode1 & 0x10) && (mode1 & 0x20);
  }
  if (ok) {
    usNaTick = 1e6f * (pre + 1) / OSC_HZ;
    for (int ch = 0; ch < 16; ch++) ok = wylacz(ch) && ok;
  }
  if (ok) Serial.printf("start bez impulsu (prescale %d, %.3f us/tick); k <n> wybiera kanał\n", pre, usNaTick);
  else {
    usNaTick = 0;
    Serial.printf("BŁĄD startu PCA9685 (prescale %d, MODE1 0x%02X), sterowanie zablokowane; sprawdź połączenia i zrestartuj\n", pre, mode1);
  }
  if (!nvsOk) Serial.println("BŁĄD: NVS nie działa, zapis kalibracji niemożliwy");
}

void ruchG(int cel, int ms) {
  int od = us; uint32_t t0 = millis();
  for (;;) {
    uint32_t dt = millis() - t0;   // jeden odczyt czasu na krok: pozycja nigdy nie wyjdzie za cel
    if (dt >= (uint32_t)ms) break;
    // Nowa komenda zatrzymuje ruch; jej znaki zostają w buforze i loop() wykona ją w całości.
    while (Serial.available() && (Serial.peek() == '\r' || Serial.peek() == '\n')) Serial.read();
    if (Serial.available()) { Serial.println("ruch przerwany"); ustaw(us); return; }
    int v = od + (int)((long)(cel - od) * (long)dt / ms);
    if (!wyslij(v)) { aktywny = false; return; }
    us = v;
    delay(20);
  }
  ustaw(cel);
}

void komenda(String cmd) {
  int sp = cmd.indexOf(' ');
  String a = sp < 0 ? cmd : cmd.substring(0, sp);
  String reszta = sp < 0 ? "" : cmd.substring(sp + 1); reszta.trim();
  long v, w;
  if (a == "k") {
    if (!liczba(reszta, v) || v < 0 || v > 15) { Serial.println("k <0..15>"); return; }
    if (usNaTick <= 0) { Serial.println("BŁĄD: PCA9685 nie zainicjowany, sterowanie zablokowane"); return; }
    if (kanal >= 0 && !wylacz(kanal)) { aktywny = false; Serial.println("kanał bez zmian, impuls niepotwierdzony"); return; }
    kanal = v; aktywny = false; us = 1500; ustaw(1500); stan();
    return;
  }
  if (cmd == "t") { tabela(); return; }
  if (cmd == "?") { stan(); return; }
  if (kanal < 0) { Serial.println("najpierw k <n>"); return; }
  if (cmd == "off") { if (wylacz(kanal)) Serial.println("bez impulsu; pozycja nieznana"); aktywny = false; return; }
  if (cmd == "s") { zapis('s', kanal, "środek"); return; }
  if (cmd == "min") { zapis('n', kanal, "min"); return; }
  if (cmd == "max") { zapis('x', kanal, "max"); return; }
  if (liczba(cmd, v)) {
    if (v < US_MIN || v > US_MAX) { Serial.printf("impuls %d..%d us\n", US_MIN, US_MAX); return; }
    // Literówka nie może rzucić serwem w opór: daleki skok tylko przez g.
    if (aktywny && abs(v - us) > SKOK_MAX) { Serial.printf("za daleko od %d us (> %d), użyj g\n", us, SKOK_MAX); return; }
    ustaw(v); return;
  }
  if (!aktywny) { Serial.println("serwo bez potwierdzonego impulsu: najpierw k <n> albo impuls liczbą"); return; }
  if (cmd == "+") ustaw(us + 10); else if (cmd == "-") ustaw(us - 10);
  else if (cmd == "++") ustaw(us + 50); else if (cmd == "--") ustaw(us - 50);
  else if (a == "g") {
    int sp2 = reszta.indexOf(' ');
    String c1 = sp2 < 0 ? reszta : reszta.substring(0, sp2), c2 = sp2 < 0 ? "" : reszta.substring(sp2 + 1);
    c2.trim();
    if (!liczba(c1, v) || !liczba(c2, w) || v < US_MIN || v > US_MAX || w < 1 || w > G_MS_MAX) {
      Serial.printf("g <%d..%d us> <1..%d ms>\n", US_MIN, US_MAX, G_MS_MAX); return;
    }
    ruchG(v, w);
  }
  else Serial.println("nieznana komenda");
}

void loop() {
  static String l;
  static bool zaDluga = false;
  while (Serial.available()) {
    char c = Serial.read();
    if (c != '\n' && c != '\r') {
      if (l.length() < LINIA_MAX) l += c; else zaDluga = true;
      continue;
    }
    if (zaDluga) Serial.printf("linia dłuższa niż %d znaków, odrzucona\n", LINIA_MAX);
    else { l.trim(); if (l.length()) komenda(l); }
    l = ""; zaDluga = false;
  }
}
