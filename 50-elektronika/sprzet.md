# Sprzęt

## Mamy (zamówione 11.10.2026)

| Część | Ilość | Uwagi |
|---|---|---|
| Arduino Nano 3.0 (ATmega328, CH340, USB-C, zlutowany) | 1 | Na Windowsie może być potrzebny sterownik CH340 |
| Sterownik serw PCA9685, 16 kanałów, I²C | 1 | Steruje wszystkimi serwami, Nano wysyła tylko komendy |
| Serwo SG90 9 g | 8 | 4 szt. od MicroChipCompany + 4 szt. od OMEGA_ZONE |
| Czujnik ruchu PIR HC-SR501 | 1 | Wystarczy do „ktoś podszedł → oczy się budzą”, nie do śledzenia kierunku |
| Piłeczki pingpongowe | ✓ | Małe oczy (Ø 40 mm) |
| Przegub 3 mm i 5 mm | ✓ | Do dużego oka – do doprecyzowania: przegub kulowy czy kardan, osobne sztuki czy jeden 3→5 mm |

## Brakuje

| Część | Do czego | Poziom |
|---|---|---|
| Zasilacz 5 V, min. 3 A (np. z wtykiem DC + gniazdo, albo mocna ładowarka USB) | Zasilanie serw przez PCA9685 (zacisk V+); Nano nie uciągnie 8 serw z USB | 1 |
| Kondensator elektrolityczny 470–1000 µF / ≥10 V | Na zasilanie serw przy PCA9685 – tłumi spadki napięcia przy ruchu wielu serw | 1 |
| Przewody dupont (F-F, M-F), ewentualnie przedłużacze serw | Połączenia; serwa w dyni mogą być dalej od płytki | 1 |
| Coś na duże oko (np. większa piłka lub wydruk półkuli) | Duże oko | 2 |
| 2–3 dodatkowe PIR-y **albo** radar HLK-LD2450 | Kierunek ruchu przed dynią | 3 |

## Podział serw (propozycja)

- Duże oko: 2 serwa na ruch (lewo–prawo, góra–dół) + 1–2 na powiekę.
- Małe oczy: pozostałe 4–5 serw, czyli 4–5 małych oczu po 1 serwie (ruch na boki).
- Przy chęci większej liczby oczu: SG90 są tanie, a PCA9685 ma 16 kanałów.
