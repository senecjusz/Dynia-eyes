// Test auto-wyłączania powerbanku: ESP32-C3 SuperMini + PCA9685 + 1 × SG90 (kanał 0).
// Fazy obciążenia po 3 min. Co 5 s zapis w pamięci flash (NVS): przebieg, faza, czas.
// Gdy powerbank odetnie zasilanie, następne włączenie zaczyna od NASTĘPNEJ fazy.
// Odczyt: podłącz płytkę do komputera i otwórz port szeregowy w ciągu 3 s od startu –
// płytka wypisze wszystkie przebiegi i nie zacznie testu ('r' + Enter kasuje zapis).
// Kompilacja: arduino-cli compile -b esp32:esp32:esp32c3:CDCOnBoot=cdc 50-elektronika/test-powerbank

#include <Wire.h>
#include <WiFi.h>
#include <Preferences.h>
#include <Adafruit_PWMServoDriver.h>

const int PIN_SDA = 8, PIN_SCL = 9;
const uint8_t KANAL = 0;
const int SRODEK_US = 1500, RUCH_US = 110;   // ok. ±10°
const uint32_t FAZA_MS = 180000, ZAPIS_MS = 5000;
const int N_FAZ = 7;
const char *OPIS[N_FAZ] = {
  "1 sam ESP, Wi-Fi wyl., serwo bez PWM",
  "2 ESP + Wi-Fi AP, serwo bez PWM",
  "3 Wi-Fi wyl., serwo trzyma srodek",
  "4 serwo: krotki ruch co 10 s",
  "5 serwo: krotki ruch co 20 s",
  "6 serwo: krotki ruch co 30 s",
  "7 serwo: krotki ruch co 60 s (do konca)",
};
const uint32_t RUCH_CO_MS[N_FAZ] = {0, 0, 0, 10000, 20000, 30000, 60000};

Adafruit_PWMServoDriver pca(0x40);
Preferences nvs;
int faza, przebieg;
uint32_t tStartFazy, tOstZapis, tOstRuch, tStart;

void zapisz(bool koniec) {
  char klucz[8];
  snprintf(klucz, sizeof klucz, "p%d", przebieg);
  char w[64];
  snprintf(w, sizeof w, "faza %d, %lu s w fazie, %lu s razem%s", faza + 1,
           (millis() - tStartFazy) / 1000, (millis() - tStart) / 1000, koniec ? ", KONIEC" : "");
  nvs.putString(klucz, w);
  nvs.putInt("faza", faza);          // ostatnia faza, w której płytka żyła
}

void ustawFaze(int f) {
  faza = f;
  tStartFazy = tOstRuch = millis();
  if (f == 1) WiFi.softAP("dynia-test"); else { WiFi.softAPdisconnect(true); WiFi.mode(WIFI_OFF); }
  if (f <= 1) pca.setPWM(KANAL, 0, 4096);            // bez impulsów
  else pca.writeMicroseconds(KANAL, SRODEK_US);
  zapisz(false);
}

void odczyt() {
  Serial.println("\n=== test-powerbank: ODCZYT ===");
  int n = nvs.getInt("n", 0);
  for (int i = 1; i <= n; i++) {
    char k[8]; snprintf(k, sizeof k, "p%d", i);
    Serial.printf("przebieg %d: %s\n", i, nvs.getString(k, "-").c_str());
  }
  if (n == 0) Serial.println("brak zapisanych przebiegow");
  for (int i = 0; i < N_FAZ; i++) Serial.printf("  %s\n", OPIS[i]);
  Serial.println("'r' + Enter = kasuj zapis");
  while (true) {
    if (Serial.available() && Serial.read() == 'r') { nvs.clear(); Serial.println("skasowane"); }
    delay(50);
  }
}

void setup() {
  Serial.begin(115200);
  Serial.setTxTimeoutMs(0);
  nvs.begin("pbtest", false);
  uint32_t t0 = millis();
  while (millis() - t0 < 3000) { if (Serial) odczyt(); delay(10); }  // komputer = tryb odczytu

  Wire.begin(PIN_SDA, PIN_SCL);
  pca.begin();
  pca.setOscillatorFrequency(27000000);
  pca.setPWMFreq(50);

  przebieg = nvs.getInt("n", 0) + 1;
  nvs.putInt("n", przebieg);
  int start = (przebieg == 1) ? 0 : nvs.getInt("faza", -1) + 1;   // następna po fazie, w której zgasło
  if (start >= N_FAZ) start = N_FAZ - 1;
  tStart = millis();
  ustawFaze(start);
}

void loop() {
  uint32_t t = millis();
  if (RUCH_CO_MS[faza] && t - tOstRuch >= RUCH_CO_MS[faza]) {
    tOstRuch = t;
    pca.writeMicroseconds(KANAL, SRODEK_US + RUCH_US); delay(300);
    pca.writeMicroseconds(KANAL, SRODEK_US);
  }
  if (t - tOstZapis >= ZAPIS_MS) { tOstZapis = t; zapisz(false); }
  if (faza < N_FAZ - 1 && t - tStartFazy >= FAZA_MS) ustawFaze(faza + 1);
  delay(20);
}
