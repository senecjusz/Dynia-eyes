// Test auto-wyłączania powerbanku: ESP32-C3 SuperMini + PCA9685 + 1 × SG90 (kanał 0), moduł oka złożony.
// Szukamy najdłuższej przerwy między ruchami, przy której powerbank nie gaśnie (22.10: przy samym
// trzymaniu środka Baseus odcinał prąd co ok. 12–15 s).
// Ruch: płynnie 1500 → 1610 → 1500 µs, po RUCH_MS w każdą stronę. Przerwa liczona od końca ruchu.
// Przerwy rosną co POZIOM_MS: 5, 8, 10, 12, 15, 20 s. Po zgaśnięciu następne włączenie wraca do
// poprzedniej przerwy (tej, przy której jeszcze nie gasło) i trzyma ją do końca – potwierdzenie.
// Co 1 s zapis w pamięci flash (NVS): przebieg, przyczyna startu, poziom, czas, liczba ruchów.
// Przyczyna startu mówi, czemu skończył się poprzedni przebieg: "zasilanie" = zanik prądu (powerbank),
// "spadek napiecia" = reset ESP przy niskim napięciu (brownout).
// Start bez skoku: ostatni zadany impuls jest w NVS ("us"); po włączeniu serwo dostaje najpierw
// ten impuls (tam oko stoi, bo bez prądu się nie rusza), potem płynnie wraca na środek.
// Odczyt: podłącz płytkę do komputera i w ciągu 3 s od startu wyślij dowolny znak (np. '?') –
// płytka wypisze wszystkie przebiegi i nie zacznie testu ('r' + Enter kasuje zapis).
// Sam otwarty port nie wystarcza: na powerbanku warunek `if (Serial)` też bywał prawdziwy.
// Kompilacja: arduino-cli compile -b esp32:esp32:esp32c3:CDCOnBoot=cdc 50-elektronika/test-powerbank

#include <Wire.h>
#include <esp_system.h>
#include <Preferences.h>
#include <Adafruit_PWMServoDriver.h>

const int PIN_SDA = 8, PIN_SCL = 9;
const uint8_t KANAL = 0;
const int SRODEK_US = 1500, RUCH_US = 110;   // ok. 10°
const uint32_t RUCH_MS = 1000, KROK_MS = 20;  // czas przejścia w jedną stronę, krok rampy
const int ZAPIS_CO_KROKOW = 5;                // impuls do NVS co 5 kroków (100 ms, ok. 11 µs)
const int MIN_US = 1200, MAX_US = 1800;       // bezpieczny zakres modułu (kalibracja ±300 µs)
const uint32_t POZIOM_MS = 120000, ZAPIS_MS = 1000;
const int N_POZ = 6;
const uint32_t PRZERWA_MS[N_POZ] = {5000, 8000, 10000, 12000, 15000, 20000};

Adafruit_PWMServoDriver pca(0x40);
Preferences nvs;
int poziom, przebieg, ruchy;
bool potwierdzenie;                            // true = trzymaj poziom do końca
int us;                                        // ostatni zadany impuls
const char *powod;                             // przyczyna tego startu

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
uint32_t tStartPoz, tOstZapis, tKoniecRuchu, tStart;

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
  char w[128];
  snprintf(w, sizeof w, "start: %s, przerwa %lu s%s, %lu s na poziomie, %lu s razem, ruchow %d", powod,
           PRZERWA_MS[poziom] / 1000, potwierdzenie ? " (potwierdzenie)" : "",
           (millis() - tStartPoz) / 1000, (millis() - tStart) / 1000, ruchy);
  nvs.putString(klucz, w);
  nvs.putInt("poz", poziom);         // ostatni poziom, na którym płytka żyła
}

void ustawPoziom(int p) {
  poziom = p;
  tStartPoz = millis();
  zapisz();
}

void odczyt() {
  Serial.println("\n=== test-powerbank: ODCZYT ===");
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
  nvs.begin("pbtest", false);
  uint32_t t0 = millis();
  while (millis() - t0 < 3000) {                  // znak z komputera = tryb odczytu
    if (Serial.available()) { Serial.read(); odczyt(); }
    delay(10);
  }

  Wire.begin(PIN_SDA, PIN_SCL);
  pca.begin();
  pca.setOscillatorFrequency(27000000);
  pca.setPWMFreq(50);

  us = constrain(nvs.getInt("us", SRODEK_US), MIN_US, MAX_US);
  przebieg = nvs.getInt("n", 0) + 1;
  nvs.putInt("n", przebieg);
  potwierdzenie = przebieg > 1;                   // po zgaśnięciu: poziom niżej i do końca
  int start = potwierdzenie ? max((int)nvs.getInt("poz", 0) - 1, 0) : 0;
  tStart = millis();

  pca.writeMicroseconds(KANAL, us);               // tam, gdzie oko stoi
  if (us != SRODEK_US) plynnie(us, SRODEK_US);
  tKoniecRuchu = millis();
  ustawPoziom(start);
}

void loop() {
  uint32_t t = millis();
  if (t - tKoniecRuchu >= PRZERWA_MS[poziom]) {
    plynnie(SRODEK_US, SRODEK_US + RUCH_US);
    plynnie(SRODEK_US + RUCH_US, SRODEK_US);
    ruchy++;
    tKoniecRuchu = millis();
  }
  if (t - tOstZapis >= ZAPIS_MS) { tOstZapis = t; zapisz(); }
  if (!potwierdzenie && poziom < N_POZ - 1 && t - tStartPoz >= POZIOM_MS) ustawPoziom(poziom + 1);
  delay(20);
}
