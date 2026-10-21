// Kalibracja oka: ESP32-C3 + PCA9685, serwo na kanale KANAL. Ustawia impuls z komend z portu (115200):
//   <liczba>  = impuls w µs (np. 1520), g <cel> <ms> = płynny ruch do celu w zadanym czasie, +  / - = ±10 µs, ++ / -- = ±50 µs, ? = stan, off = bez impulsu.
// Po włączeniu serwo jest BEZ impulsu (nie rusza się), dopóki nie przyjdzie pierwsza komenda.
// Kompilacja: arduino-cli compile -b esp32:esp32:esp32c3:CDCOnBoot=cdc 50-elektronika/kalibracja

#include <Wire.h>
#include <Preferences.h>
#include <Adafruit_PWMServoDriver.h>

const int KANAL = 0;
Adafruit_PWMServoDriver pca(0x40);
Preferences nvs;
int us = 1500;

void ustaw() {
  us = constrain(us, 600, 2400);
  pca.writeMicroseconds(KANAL, us);
  nvs.putInt("us", us);
  Serial.printf("impuls %d us\n", us);
}

void setup() {
  Serial.begin(115200);
  Serial.setTxTimeoutMs(0);
  nvs.begin("kalib", false);
  us = 1500;
  Wire.begin(8, 9);
  pca.begin();
  pca.setOscillatorFrequency(27000000);
  pca.setPWMFreq(50);
  pca.setPWM(KANAL, 0, 4096);
  Serial.println("start bez impulsu");
}

void loop() {
  static String l;
  while (Serial.available()) {
    char c = Serial.read();
    if (c != '\n' && c != '\r') { l += c; continue; }
    l.trim();
    if (l == "+") us += 10; else if (l == "-") us -= 10;
    else if (l == "++") us += 50; else if (l == "--") us -= 50;
    else if (l == "off") { pca.setPWM(KANAL, 0, 4096); Serial.println("bez impulsu"); l = ""; continue; }
    else if (l.startsWith("g ")) {
      int sp = l.indexOf(' ', 2);
      int cel = l.substring(2, sp).toInt(), ms = l.substring(sp + 1).toInt();
      int od = us; uint32_t t0 = millis();
      while (millis() - t0 < (uint32_t)ms) {
        float u = (float)(millis() - t0) / ms;
        pca.writeMicroseconds(KANAL, od + (int)((cel - od) * u));
        delay(20);
      }
      us = cel; ustaw(); l = ""; continue;
    }
    else if (l == "?") { Serial.printf("impuls %d us\n", us); l = ""; continue; }
    else if (l.length() && isDigit(l[0])) us = l.toInt();
    if (l.length()) ustaw();
    l = "";
  }
}
