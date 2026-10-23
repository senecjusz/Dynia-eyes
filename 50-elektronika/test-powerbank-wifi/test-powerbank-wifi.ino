// Test podtrzymania powerbanku przez Wi-Fi: ESP32-C3 SuperMini + PCA9685 + 1 × SG90 (kanał 0), moduł oka złożony.
// Hipoteza (raport 20-analizy/2026-10-22-powerbank-a-obciazenie.md): stale włączony punkt dostępu Wi-Fi
// podnosi pobór ESP z ok. 20–30 mA do ok. 85–100 mA (dane ze źródeł, niezmierzone) i powerbank nie gaśnie.
// 22.10: bez Wi-Fi Baseus PPAP20K odcinał prąd co ok. 15 s (przyczyna startu: zasilanie).
// Wi-Fi: ukryta sieć z hasłem, nikt się nie podłącza – chodzi tylko o pobór prądu.
// Ruch: płynnie 1500 → 1610 → 1500 µs, po RUCH_MS w każdą stronę, co PRZERWA_MS (jak spoczynek na wystawie).
// Co 10 s zapis w pamięci flash (NVS): przebieg, przyczyna startu, czas od startu, liczba ruchów.
// Przebieg 2 i dalsze = powerbank odciął prąd (albo płytkę przełożono – zanotuj to).
// Start bez skoku: ostatni zadany impuls jest w NVS ("us"); po włączeniu serwo dostaje najpierw
// ten impuls (tam oko stoi, bo bez prądu się nie rusza), potem płynnie wraca na środek.
// Odczyt: podłącz płytkę do komputera i w ciągu 3 s od startu wyślij dowolny znak (np. '?') –
// płytka wypisze wszystkie przebiegi i nie zacznie testu ('r' + Enter kasuje zapis).
// Kompilacja: arduino-cli compile -b esp32:esp32:esp32c3:CDCOnBoot=cdc 50-elektronika/test-powerbank-wifi

#include <Wire.h>
#include <WiFi.h>
#include <esp_system.h>
#include <Preferences.h>
#include <Adafruit_PWMServoDriver.h>

const int PIN_SDA = 8, PIN_SCL = 9;
const uint8_t KANAL = 0;
const int SRODEK_US = 1500, RUCH_US = 110;   // ok. 10°
const uint32_t RUCH_MS = 1000, KROK_MS = 20;  // czas przejścia w jedną stronę, krok rampy
const int ZAPIS_CO_KROKOW = 5;                // impuls do NVS co 5 kroków (100 ms, ok. 11 µs)
const int MIN_US = 1200, MAX_US = 1800;       // bezpieczny zakres modułu (kalibracja ±300 µs)
const uint32_t PRZERWA_MS = 5000, ZAPIS_MS = 10000;
const char *AP_SSID = "dynia-test", *AP_HASLO = "dynia-test-2026";

Adafruit_PWMServoDriver pca(0x40);
Preferences nvs;
int przebieg;
uint32_t ruchy;
int us;                                        // ostatni zadany impuls
const char *powod;                             // przyczyna tego startu
uint32_t tOstZapis, tKoniecRuchu, tStart;

const char *przyczynaStartu() {
  switch (esp_reset_reason()) {
    case ESP_RST_POWERON:  return "zasilanie";
    case ESP_RST_BROWNOUT: return "spadek napiecia";
    case ESP_RST_PANIC:    return "blad programu";
    case ESP_RST_INT_WDT: case ESP_RST_TASK_WDT: case ESP_RST_WDT: return "watchdog";
    case ESP_RST_SW:       return "restart programowy";
    case ESP_RST_USB:      return "USB";
    case ESP_RST_EXT:      return "reset zewnetrzny";
    default:               return "inna";
  }
}

void plynnie(int od, int cel) {      // rampa liniowa, co KROK_MS
  int n = RUCH_MS / KROK_MS;
  for (int i = 1; i <= n; i++) {
    us = od + (cel - od) * i / n;
    pca.writeMicroseconds(KANAL, us);
    if (i % ZAPIS_CO_KROKOW == 0 || i == n) nvs.putInt("us", us);
    delay(KROK_MS);
  }
}

void zapisz() {
  char klucz[8];
  snprintf(klucz, sizeof klucz, "p%d", przebieg);
  char w[96];
  snprintf(w, sizeof w, "start: %s, %lu s od startu, ruchow %lu, wifi %s", powod,
           (millis() - tStart) / 1000, ruchy, WiFi.getMode() == WIFI_AP ? "AP" : "wyl");
  nvs.putString(klucz, w);
}

void odczyt() {
  Serial.println("\n=== test-powerbank-wifi: ODCZYT ===");
  int n = nvs.getInt("n", 0);
  for (int i = 1; i <= n; i++) {
    char k[8]; snprintf(k, sizeof k, "p%d", i);
    Serial.printf("przebieg %d: %s\n", i, nvs.getString(k, "-").c_str());
  }
  if (n == 0) Serial.println("brak zapisanych przebiegow");
  Serial.printf("ostatni impuls: %d us\n", nvs.getInt("us", SRODEK_US));
  Serial.println("'r' + Enter = kasuj zapis");
  while (true) {
    if (Serial.available() && Serial.read() == 'r') {   // kasuje przebiegi, zostawia ostatni impuls
      int u = nvs.getInt("us", SRODEK_US);
      nvs.clear(); nvs.putInt("us", u);
      Serial.println("skasowane");
    }
    delay(50);
  }
}

void setup() {
  powod = przyczynaStartu();
  Serial.begin(115200);
  Serial.setTxTimeoutMs(0);
  nvs.begin("pbwifi", false);
  uint32_t t0 = millis();
  while (millis() - t0 < 3000) {                  // znak z komputera = tryb odczytu
    if (Serial.available()) { Serial.read(); odczyt(); }
    delay(10);
  }

  WiFi.softAP(AP_SSID, AP_HASLO, 1, 1, 1);        // kanał 1, ukryta, najwyżej 1 klient

  Wire.begin(PIN_SDA, PIN_SCL);
  pca.begin();
  pca.setOscillatorFrequency(27000000);
  pca.setPWMFreq(50);

  us = constrain(nvs.getInt("us", SRODEK_US), MIN_US, MAX_US);
  przebieg = nvs.getInt("n", 0) + 1;
  nvs.putInt("n", przebieg);
  tStart = millis();

  pca.writeMicroseconds(KANAL, us);               // tam, gdzie oko stoi
  if (us != SRODEK_US) plynnie(us, SRODEK_US);
  tKoniecRuchu = millis();
  zapisz();
}

void loop() {
  uint32_t t = millis();
  if (t - tKoniecRuchu >= PRZERWA_MS) {
    plynnie(SRODEK_US, SRODEK_US + RUCH_US);
    plynnie(SRODEK_US + RUCH_US, SRODEK_US);
    ruchy++;
    tKoniecRuchu = millis();
  }
  if (t - tOstZapis >= ZAPIS_MS) { tOstZapis = t; zapisz(); }
  delay(20);
}
