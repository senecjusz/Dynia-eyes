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

Lista posiadanych i brakujących części: [../50-elektronika/sprzet.md](../50-elektronika/sprzet.md).
