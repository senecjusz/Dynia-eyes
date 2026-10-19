# Połączenia

## Stanowisko testowe E3.4 (19.10): ESP32-C3 SuperMini + PCA9685 + 1 × SG90

Płytka stykowa, widok z góry: ESP32-C3 USB w prawo, złącze sterujące PCA9685 po lewej (od góry GND, OE, SCL, SDA, VCC, V+).

| Przewód | PCA9685 | ESP32-C3 SuperMini | Uwagi |
|---|---|---|---|
| 1 | GND | G | |
| 2 | SCL | GPIO9 | |
| 3 | SDA | GPIO8 | GPIO8 to też niebieska dioda na płytce |
| 4 | VCC | 3V3 | logika 3,3 V; nie 5 V, bo pull-upy I²C na PCA ciągną do VCC |
| 5 | V+ | 5V | zasilanie serw z USB, tylko przy jednym serwie |
| – | OE | – | wolne |

Serwo SG90 w kanale 0: pomarańczowy → PWM, czerwony → V+, brązowy → GND.

Adresy I²C ze skanu: 0x40 (PCA9685), 0x70 (adres „all call” PCA9685).

## Szkice

Kompilacja i wgrywanie (arduino-cli, rdzeń esp32 3.3.12, biblioteka Adafruit PWM Servo Driver):

```bash
arduino-cli compile -b esp32:esp32:esp32c3:CDCOnBoot=cdc 50-elektronika/test-serwa
arduino-cli upload -p /dev/ttyACM0 -b esp32:esp32:esp32c3:CDCOnBoot=cdc 50-elektronika/test-serwa
```

- `blink/`: dioda na GPIO8 (świeci stanem niskim), co 0,5 s.
- `skan-i2c/`: skan magistrali co 2 s.
- `test-serwa/`: kanał 0, środek 1500 µs i 5 s postoju (ustawienie dźwigienki), potem ±30° (1167–1833 µs) w pętli, 60° w ok. 3,3 s.

Linux: port `/dev/ttyACM0` należy do grupy `uucp`. Bez ponownego logowania wgrywa się przez `newgrp uucp`. Każdy szkic ma `Serial.setTxTimeoutMs(0)`, bo bez tego wypisywanie na port USB, którego nikt nie czyta, spowalnia pętlę (Blink migał co ok. 5 s).
