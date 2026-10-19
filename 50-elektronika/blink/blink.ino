// E3.4 krok 1: Blink na ESP32-C3 SuperMini. Niebieska dioda na GPIO8, świeci stanem niskim.
// Kompilacja: arduino-cli compile -b esp32:esp32:esp32c3:CDCOnBoot=cdc 50-elektronika/blink

const int PIN_LED = 8;

void setup() {
  Serial.begin(115200);
  Serial.setTxTimeoutMs(0);  // bez czytającego portu USB println nie blokuje pętli
  pinMode(PIN_LED, OUTPUT);
}

void loop() {
  digitalWrite(PIN_LED, LOW);
  Serial.println("LED on");
  delay(500);
  digitalWrite(PIN_LED, HIGH);
  Serial.println("LED off");
  delay(500);
}
