# Review Uchwytu serw v13 – runda 2 z 2 (krytyk Opus), tylko PSUJE

25.10.2026, tylko odczyt. Siatka `…/v13/stl/UchwytSerw.stl`, parametry `…/v13/stl/parametry.json`. Skrypty w scratchpadzie (`wsuw.js`, `wsuw2.js`): bryła zastępcza MG90S (korpus 22,8 × 12,5 × 22,8, wieża r 6 / 12,2 mm, ucha 31,8 mm) przesuwana wzdłuż osi wałka co 1 mm, test „punkt wewnątrz siatki”.

## 1. Wsuwanie 4 serw (v13) [P]

| Serwo | Wynik |
|---|---|
| S1 | wolna droga (v12: kolizja od 13 mm – usunięta) |
| S2 | **kolizja od 6 mm z 18** – wieża wchodzi w słupek Ø16 (np. (6,8; 3,8; −41,9)) |
| SG | wolna droga |
| SD | wolna droga (v12: kolizja od 3 mm – usunięta) |

## 2. Przedłużenie orczyka SD i SG [P]

Płytka x 0…5 (orczyk + przedłużenie, z zapasem), obrys od piasty r 5,5 do końca r 3,6 na 25 mm, cały zakres α −31,2…+35,9° co 2°: **brak wnikania w uchwyt** (SD i SG). Najniższy punkt przedłużenia z ≈ −60,5 wobec ścianki obniżonej do z −62,5. Kolizja z rundy 1 (Astra, −1,25) jest usunięta.

## PSUJE

**1. Serwo S2 nie da się włożyć (potwierdzone na v13).** [P]
- Dno korpusu musi wejść w okno ramki (x 29,5) od strony wałka. Przy tym wieża przechodzi przez x −4…8,2 na y 3…15, a słupek Ø16 zajmuje y ≤ 8. Blokada od 6 mm z 18 mm drogi.
- **Poprawka: wariant „ramka S2 po drugiej stronie uszu, serwo wsuwane wieżą od +x”** – sprawdzony symulacją [P]:
  - ramka x 23,5…27,5 (`tRamki` 4 przed uchem w x 27,5), stara ramka usunięta. Droga 15 mm (od czubka wałka na x 27,5 do 12,5). Wieża i korpus przechodzą przez okno, ucha opierają się o ścianę +x ramki, wkręty wkręca się od +x. Po stronie +x jest wolno: korpus wystaje za płytę w powietrze, wieża 1 jest 1,15 mm obok w y;
  - **jedna kolizja w wariancie:** dolne ucho (z −65,8…) zahacza o skośną podstawę wieży 1 (`fazaWiezy` 5) przy x 37,5…43,5, y ≈ 3,3, od 9 mm drogi. Poprawka: przyciąć skos podstawy wieży 1 do y < 2,4 (poza pasem S2 y 2,75…15,25) albo dać w tym miejscu `fazaWiezy` 2;
  - wieża MG90S (góra z −38,0 przy r 6) przechodzi przez okno o górnej krawędzi z −38,2 → **0,2 mm wcisku**. Poprawka: w ramce S2 luz okna od góry 0,6 (albo wycięcie łukiem r 6,5 nad osią wałka);
  - ścianka wieża 1 – ramka S2 musi kończyć się na nowej ramce (x 23,5…27,5), a nie na x 31,5;
  - pozostałe położenie zamontowane bez zmian, więc przemiatania kardanów i powiek (orczyk S1 – serwo S2 1,39) obowiązują.

## Werdykt

Uchwyt v13 może iść do druku dopiero z ramką S2 przeniesioną przed ucha (serwo wsuwane wieżą od +x), z przyciętym skosem podstawy wieży 1 w pasie S2 i z luzem okna S2 od góry 0,6 mm. S1, SG, SD i przedłużenia orczyków są czyste.
