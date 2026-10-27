# Połączenia

## Dynia: połączenia docelowe (27.10)

Ustalone z użytkownikiem 26–27.10. Program: `dynia-v2/`. Rozmieszczenie na tacce: `40-cad/openscad/podstawka.scad` (kaseta elektroniki v2). Wszystkie połączenia w podstawce na wtykach Dupont, z wyjątkiem zacisku śrubowego PCA9685.

### Zasilanie

| Skąd | Dokąd | Uwagi |
|---|---|---|
| Gniazdo USB-C wkręcane, czerwony | zacisk PCA9685 V+ | gniazdo z 2 przewodami (5,1 kΩ na CC – sprawdzić pomiarem 5 V z powerbanku); kabel C–C z powerbanku w szufladzie |
| Gniazdo USB-C, czarny | zacisk PCA9685 GND | |
| Kondensator 470 µF / 10 V, „+” | PCA kanał 8, pin V+ | „−” (pasek) na pin GND kanału 8; zestaw użytkownika |
| ESP32-C3 5V | PCA kanał 9, pin V+ | nie zasilać jednocześnie z USB komputera |
| ESP32-C3 G | PCA kanał 9, pin GND | |
| Rezystor 47 Ω / 3 W (tylko gdy powerbank gaśnie) | zacisk V+ i GND | wisi na nóżkach na słupkach tacki; ok. 0,53 W |

Kanały 8–11 PCA nie sterują serwami: ich piny V+ i GND (wspólne szyny z zaciskiem) służą jako rozdzielacz 5 V. Kanał 11 wolny.

### ESP32-C3 SuperMini

| Pin ESP | Dokąd |
|---|---|
| GPIO8 (SDA) | PCA listwa boczna SDA |
| GPIO9 (SCL) | PCA listwa boczna SCL |
| 3V3 | PCA listwa boczna VCC (logika 3,3 V) |
| GPIO10 | PIR OUT |
| GPIO4 | przycisk, nóżka 1 (nóżka 2 → PCA listwa boczna GND); podciąganie w ESP |

ESP ma piny skierowane w dół i stoi na 2 słupkach tacki (klej); przewody Dupont od spodu. Piny startowe 2, 8, 9 nie są ciągnięte do masy.

### PIR HW-416A (klon HC-SR501)

| PIR | Dokąd |
|---|---|
| VCC | PCA kanał 10, pin V+ |
| GND | PCA kanał 10, pin GND |
| OUT | ESP GPIO10 (3,3 V przy ruchu) |

Piny patrząc od strony kopułki, potencjometry na dole: VCC, OUT, GND (od strony elementów odwrotnie, VCC przy diodzie). Zworka na H, potencjometr czasu (najpewniej bliżej zworki) w lewo do oporu, czułość na środku. PIR jest we froncie szufladki (bez ogranicznika, wysuw roboczy ≤ 100 mm): przewód bez złącza, opaska przy PIR i na tacce (uchwyt przy przednim prawym rogu), zapas ok. 150 mm zwinięty w pasie wtyku USB-C w korpusie i przypięty luźną opaską do ścianki, żeby nie spadł przed tackę i nie został przyszczypnięty przy domykaniu (ustalenie z montażem 27.10, trasa może się jeszcze zmienić).

### Przycisk

PBS-33B, chwilowy NO, otwór Ø12. Przytrzymanie 5 s = blokada (duże oko na środku, powieki otwarte, ruch stop – do rysowania tęczówek), ponowne 5 s = praca. Po włączeniu prądu zawsze praca.

### Kanały PCA9685

| Kanały | Co |
|---|---|
| 0–3 | małe oczy, strona lewa (patrząc od przodu) |
| 4–7 | małe oczy, strona prawa |
| 8, 9, 10 | rozdzielacz 5 V: kondensator, ESP, PIR |
| 11 | wolny |
| 12 | duże oko lewo–prawo |
| 13 | duże oko góra–dół |
| 14 | powieka górna |
| 15 | powieka dolna |

Listwa kanałów HW-170: od krawędzi płytki GND (czarny), V+ (czerwony), sygnał PWM (żółty).

### Skrętki do dyni (T568B na obu końcach)

Trzy skrętki: lewa (n = 0), prawa (n = 4), duże oko (n = 12). W podstawce każda żyła z wtykiem Dupont na pin PCA; w dyni keystone (gniazdo RJ45), do niego krótki odcinek skrętki z wtykiem RJ45 od strony oczu.

| Żyła | Kolor | PCA | Serwo |
|---|---|---|---|
| 1 | biało-pomarańczowy | sygnał kanału n | A: pomarańczowy |
| 2 | pomarańczowy | sygnał n+1 | B: pomarańczowy |
| 3 | biało-zielony | sygnał n+2 | C: pomarańczowy |
| 6 | zielony | sygnał n+3 | D: pomarańczowy |
| 4 | niebieski | V+ kanału n | A i B: czerwony |
| 5 | biało-niebieski | GND kanału n | A i B: brązowy |
| 7 | biało-brązowy | V+ kanału n+2 | C i D: czerwony |
| 8 | brązowy | GND kanału n+2 | C i D: brązowy |

Duże oko: A lewo–prawo, B góra–dół, C powieka górna, D powieka dolna. Po stronie oczu żyły lutowane do listew goldpin 3-pin (GND, V+, sygnał), po jednej na serwo; para serw dzieli żyły V+ i GND.

### Kolejność uruchomienia

1. Powerbank, bez ESP i serw: ok. 5 V na pinach V+/GND kanału 9.
2. ESP i PCA: `skan-i2c` pokazuje 0x40 i 0x70.
3. Skrętki i oczy: `kalibracja` (`k <n>`), oko po oku.
4. `dynia-v2`. Klej termiczny na wtyki dopiero po teście.

## Stanowisko testowe E3.4 (19.10): ESP32-C3 SuperMini + PCA9685 + 1 × SG90

Płytka stykowa, widok z góry: ESP32-C3 USB w prawo, złącze sterujące PCA9685 po lewej (od góry GND, OE, SCL, SDA, VCC, V+).

| Przewód | PCA9685 | ESP32-C3 SuperMini | Uwagi |
|---|---|---|---|
| 1 | GND | G | |
| 2 | SCL | GPIO9 | |
| 3 | SDA | GPIO8 | GPIO8 to też niebieska dioda na płytce |
| 4 | VCC | 3V3 | logika 3,3 V; nie 5 V, bo pull-upy I²C na PCA ciągną do VCC |
| 5 | V+ | 5V | zasilanie serw z USB płytki – najwyżej 2 × SG90; więcej serw: osobne 5 V na V+ (gniazdo USB-C z powerbanku), masa wspólna, kondensator 470–1000 µF przy PCA9685; nie zasilać ESP jednocześnie z USB komputera i z pinu 5V |
| – | OE | – | wolne |

Serwo SG90 w kanale 0 (drugi moduł do testu 24 h w kanale 1): pomarańczowy → PWM, czerwony → V+, brązowy → GND.

Adresy I²C ze skanu: 0x40 (PCA9685), 0x70 (adres „all call” PCA9685).

## Szkice

Kompilacja i wgrywanie (arduino-cli, rdzeń esp32 3.3.12, biblioteka Adafruit PWM Servo Driver):

```bash
arduino-cli compile -b esp32:esp32:esp32c3:CDCOnBoot=cdc 50-elektronika/test-serwa
arduino-cli upload -p /dev/ttyACM0 -b esp32:esp32:esp32c3:CDCOnBoot=cdc 50-elektronika/test-serwa
```

- `blink/`: dioda na GPIO8 (świeci stanem niskim), co 0,5 s.
- `skan-i2c/`: skan magistrali co 2 s.
- `test-serwa/`: kanał 0, środek 1500 µs i 5 s postoju, potem ±30° (1167–1833 µs) w pętli, 60° w ok. 3,3 s. **Nie do nasadzania dźwigienki** – po 5 s serwo rusza; do tego służy `kalibracja/` (komenda `k <n>`).
- `kalibracja/`: kalibracja modułów jeden po drugim; numer modułu = kanał w dyni. Po włączeniu wszystkie kanały **bez impulsu** (także po restarcie samego ESP). Komendy (115200): `k <n>` wybór kanału 0–15 (poprzedni bez impulsu, nowy od razu 1500 µs do nasadzenia orczyka), liczba = impuls w µs (600–2400), `+`/`-` ±10, `++`/`--` ±50, `g <cel> <ms>` płynny ruch (nowa komenda, np. `off`, zatrzymuje go i się wykonuje), `s`/`min`/`max` zapis środka i krańców w NVS, `t` tabela Markdown do `kalibracja-oczu.md`, `?` stan, `off` bez impulsu. Po `off` albo błędzie I²C pozycja jest nieznana: `+`, `-`, `g` i zapisy czekają na `k` albo impuls liczbą. Zanik zasilania samego PCA9685 blokuje sterowanie do restartu ESP. Tabela z `t` jest kompletna, gdy ma nagłówek, pełne wiersze i linię `koniec tabeli: N wierszy` ze zgodną liczbą; inaczej powtórz `t`. Sterowanie z terminala: `newgrp uucp`, potem `arduino-cli monitor -p /dev/ttyACM0 -c baudrate=115200`. Monitor zajmuje port – przed wgrywaniem zamknij go (Ctrl+C).
- `oczy-ruch/`: ruch oczu (sakada ze smoothstep, fiksacja 0,4–1,8 s aktywnie / 1,5–6 s w spoczynku, najwyżej 2 naraz), zakres ±25° serwa (±278 µs) wokół `srodekUs` 1500; `N_OCZU` 1; czujnik na `PIN_CZUJNIK` (−1 = brak). Komendy: `a` aktywny, `s` spoczynek, `c` stop na środku, `r` wznów, `k<nr> <µs>` środek oka (tylko do restartu; trwale – stała `srodekUs` w kodzie). Po włączeniu serwa od razu dostają impuls środka (bez łagodnego rozruchu).
- `test-powerbank/`: 7 faz po 3 min, zapis w NVS co 5 s; po zaniku zasilania następne włączenie zaczyna od następnej fazy. Przed testem: podłącz do komputera, w ciągu 3 s otwórz monitor, `r` + Enter kasuje stare przebiegi. Test: ESP zasilany z powerbanku kablem USB-C, serwo na kanale 0 (V+ z pinu 5V). Odczyt: monitor w ciągu 3 s od podłączenia do komputera; bez monitora płytka zacznie nowy przebieg, ale stare zapisy zostają.
- `test-24h/`: `oczy-ruch` stale aktywny na kanałach 0 i 1, dziennik w NVS co 60 s (czas pracy, ruchy, starty, przyczyna restartu: 1 zasilanie, 9 brownout, 4–7 watchdog/panika). Środek każdego oka: `k<nr> <µs>` zapisuje go w NVS i program czyta go po każdym starcie (bez zapisu 1500 µs). Przed startem `k0 <µs>`, `k1 <µs>` według kalibracji każdego modułu, `l` (sprawdza środki), potem `z` (zeruje dziennik, środków nie kasuje); po teście `l`. Zawieszenie bez restartu widać jako czas pracy krótszy niż czas testu (watchdog nie jest włączony).

Linux: port `/dev/ttyACM0` należy do grupy `uucp`. Bez ponownego logowania wgrywa się przez `newgrp uucp`. Każdy szkic ma `Serial.setTxTimeoutMs(0)`, bo bez tego wypisywanie na port USB, którego nikt nie czyta, spowalnia pętlę (Blink migał co ok. 5 s).
