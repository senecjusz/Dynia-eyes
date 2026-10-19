// E3.4 Test elektroniki: ESP32-C3 SuperMini + PCA9685 + 1 x SG90 na kanale 0.
// 1) skan I2C, 2) środek 1500 us i 5 s postoju (ustawienie dźwigienki),
// 3) wolny ruch ±30° w pętli.
// Kompilacja: arduino-cli compile -b esp32:esp32:esp32c3:CDCOnBoot=cdc 50-elektronika/test-serwa

#include <Wire.h>
#include <Adafruit_PWMServoDriver.h>

const int PIN_SDA = 8;
const int PIN_SCL = 9;
const uint8_t PCA_ADDR = 0x40;
const uint8_t KANAL = 0;

const int SRODEK_US = 1500;
const float US_NA_STOPIEN = 2000.0 / 180.0;  // SG90: ok. 500-2500 us na 180°
const int ZAKRES_DEG = 30;
const int KROK_US = 2;       // krok ruchu
const int KROK_MS = 10;      // co ile ms krok: ±30° w ok. 3,3 s w jedną stronę
const int POSTOJ_MS = 5000;

Adafruit_PWMServoDriver pca(PCA_ADDR);

void skanI2C() {
  int n = 0;
  for (uint8_t a = 1; a < 127; a++) {
    Wire.beginTransmission(a);
    if (Wire.endTransmission() == 0) {
      Serial.printf("I2C: urządzenie 0x%02X\n", a);
      n++;
    }
  }
  Serial.printf("I2C: znaleziono %d\n", n);
}

void setup() {
  Serial.begin(115200);
  Serial.setTxTimeoutMs(0);  // bez czytającego portu USB println nie blokuje pętli
  delay(1500);  // czas na otwarcie portu USB CDC
  Serial.println("\n=== test-serwa E3.4 ===");

  Wire.begin(PIN_SDA, PIN_SCL);
  skanI2C();

  pca.begin();
  pca.setOscillatorFrequency(27000000);
  pca.setPWMFreq(50);
  delay(10);

  pca.writeMicroseconds(KANAL, SRODEK_US);
  Serial.printf("Środek %d us, postój %d s\n", SRODEK_US, POSTOJ_MS / 1000);
  delay(POSTOJ_MS);
  Serial.println("Ruch ±30° w pętli");
}

void loop() {
  const int amp = (int)(ZAKRES_DEG * US_NA_STOPIEN + 0.5);
  static int us = SRODEK_US;
  static int kier = 1;

  us += kier * KROK_US;
  if (us >= SRODEK_US + amp) { us = SRODEK_US + amp; kier = -1; Serial.printf("+30° (%d us)\n", us); }
  if (us <= SRODEK_US - amp) { us = SRODEK_US - amp; kier = 1;  Serial.printf("-30° (%d us)\n", us); }

  pca.writeMicroseconds(KANAL, us);
  delay(KROK_MS);
}
