# Opis projektu

Dynia na Halloween z ruszającymi się oczami, robiona razem z synem.

## Założenia

- Ma działać przez **1–2 tygodnie** w okolicach Halloween, nie miesiącami. Wilgoć ma znaczenie drugorzędne, wystarczy podstawowe zabezpieczenie elektroniki.
- Projekt realizujemy etapami: dochodzimy tak daleko, jak się uda. Każdy poziom ma być samodzielnie działającą, pokazywalną dynią.
- Mechanikę projektujemy w Onshape i drukujemy w 3D (doświadczenie w druku i projektowaniu jest).

## Poziomy

Poziomy opisują **złożoność** (co dynia potrafi), a nie konkretny mechanizm. Mechanizmy dobieramy osobno w `20-analizy/`.

### Poziom 1 – małe oczy
- Pojedyncze oko = **piłeczka pingpongowa**, bez powieki.
- Każde oko poruszane **serwem**, w sposób trochę losowy.
- Wiele oczu jednocześnie.

### Poziom 2 – duże oko z powiekami
Duże oko budujemy stopniowo; każdy podpoziom to działające oko:

| Podpoziom | Powieki | Ruch oka | Serwa |
|---|---|---|---|
| **2a** | 1 powieka | lewo–prawo | 2 |
| **2b** | 1 powieka | lewo–prawo + góra–dół | 3 |
| **2c** | 2 powieki, najlepiej **z jednego serwa** (sprzężone) | lewo–prawo + góra–dół | 3 |

- 2a → 2b: dochodzi tylko oś góra–dół.
- 2b → 2c: dochodzi dolna powieka, sprzężona z górną na tym samym serwie.
- Serwa: 4 × MG90S wystarczą na każdy podpoziom (1 zapasowe).

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
