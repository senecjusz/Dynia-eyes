# Opis projektu

Dynia na Halloween z ruszającymi się oczami, robiona razem z synem.

## Założenia

- Ma działać przez **1–2 tygodnie** w okolicach Halloween, nie miesiącami. Wilgoć ma znaczenie drugorzędne, wystarczy podstawowe zabezpieczenie elektroniki.
- Projekt realizujemy etapami: dochodzimy tak daleko, jak się uda. Każdy poziom ma być samodzielnie działającą, pokazywalną dynią.
- Mechanikę projektujemy w Onshape i drukujemy w 3D (doświadczenie w druku i projektowaniu jest).

## Poziomy

### Poziom 1 – minimum: wiele małych oczu
- Pojedyncze oko = **piłeczka pingpongowa**.
- Każde oko poruszane **serwem**, w sposób trochę losowy.
- Wiele oczu jednocześnie.

### Poziom 2 – jedno duże oko z powieką
- Dodatkowe **duże oko**, ruch w dwóch osiach: **lewo–prawo i góra–dół**.
- **Powieka** (mruganie).

### Poziom 3 – duże oko śledzi ruch
- Czujnik ruchu przed dynią.
- Duże oko **patrzy w stronę poruszającego się obiektu**.

## Uwagi techniczne (do potwierdzenia)

- **Pojedynczy PIR mówi tylko „jest ruch / nie ma ruchu”**, nie gdzie. Do śledzenia kierunku potrzebne będzie np.:
  - kilka PIR-ów, każdy patrzący w inny sektor (prosto, tanio, ruch zgrubny: lewo / środek / prawo), albo
  - radar mmWave z pozycją celu (np. HLK-LD2450, podaje współrzędne X/Y), albo
  - kamera z wykrywaniem ruchu (najbardziej złożone).
- **Wiele serw** → prawdopodobnie sterownik PWM (np. PCA9685, 16 kanałów po I²C) i **osobne zasilanie 5 V** dla serw o odpowiedniej wydajności prądowej, ze wspólną masą z kontrolerem.

## Sprzęt

### Mamy (zamówione 11.10.2026)

| Część | Ilość | Uwagi |
|---|---|---|
| Arduino Nano 3.0 (ATmega328, CH340, USB-C, zlutowany) | 1 | Na Windowsie może być potrzebny sterownik CH340 |
| Sterownik serw PCA9685, 16 kanałów, I²C | 1 | Steruje wszystkimi serwami, Nano wysyła tylko komendy |
| Serwo SG90 9 g | 8 | 4 szt. od MicroChipCompany + 4 szt. od OMEGA_ZONE |
| Czujnik ruchu PIR HC-SR501 | 1 | Wystarczy do „ktoś podszedł → oczy się budzą”, nie do śledzenia kierunku |

### Brakuje

| Część | Do czego | Poziom |
|---|---|---|
| Zasilacz 5 V, min. 3 A (np. z wtykiem DC + gniazdo, albo mocna ładowarka USB) | Zasilanie serw przez PCA9685 (zacisk V+); Nano nie uciągnie 8 serw z USB | 1 |
| Kondensator elektrolityczny 470–1000 µF / ≥10 V | Na zasilanie serw przy PCA9685 – tłumi spadki napięcia przy ruchu wielu serw | 1 |
| Przewody dupont (F-F, M-F), ewentualnie przedłużacze serw | Połączenia; serwa w dyni mogą być dalej od płytki | 1 |
| Piłeczki pingpongowe | Małe oczy | 1 |
| Coś na duże oko (np. większa piłka lub wydruk półkuli) | Duże oko | 2 |
| 2–3 dodatkowe PIR-y **albo** radar HLK-LD2450 | Kierunek ruchu przed dynią | 3 |

### Podział serw (propozycja)

- Duże oko: 2 serwa na ruch (lewo–prawo, góra–dół) + 1–2 na powiekę.
- Małe oczy: pozostałe 4–5 serw, czyli 4–5 małych oczu po 1 serwie (ruch na boki).
- Przy chęci większej liczby oczu: SG90 są tanie, a PCA9685 ma 16 kanałów.
