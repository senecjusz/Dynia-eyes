// E3.4 krok 2: skan I2C (SDA GPIO8, SCL GPIO9). Oczekiwany PCA9685 pod 0x40 (i 0x70 - adres "all call").
// Kompilacja: arduino-cli compile -b esp32:esp32:esp32c3:CDCOnBoot=cdc 50-elektronika/skan-i2c

#include <Wire.h>

const int PIN_SDA = 8;
const int PIN_SCL = 9;

void setup() {
  Serial.begin(115200);
  Serial.setTxTimeoutMs(0);  // bez czytającego portu USB println nie blokuje pętli
  Wire.begin(PIN_SDA, PIN_SCL);
}

void loop() {
  int n = 0;
  for (uint8_t a = 1; a < 127; a++) {
    Wire.beginTransmission(a);
    if (Wire.endTransmission() == 0) {
      Serial.printf("I2C: urządzenie 0x%02X\n", a);
      n++;
    }
  }
  Serial.printf("I2C: znaleziono %d\n", n);
  delay(2000);
}
