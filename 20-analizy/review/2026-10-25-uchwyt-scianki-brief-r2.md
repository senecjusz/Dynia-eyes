# Brief: review Uchwytu serw (duże oko v13) – runda 2 z 2 (ostatnia)

Jesteś recenzentem, tylko do odczytu, bez commitów i `git pull`. Piszesz po polsku. **Zgłaszaj tylko uwagi PSUJE działanie albo druk** (według `30-projekt/PRD.md`). Brzegowych nie wypisuj. To ostatnia runda.

Brief rundy 1: `20-analizy/review/2026-10-25-uchwyt-scianki-brief.md` (kontekst i lista zmian v12). Raporty rundy 1: `2026-10-25-uchwyt-scianki-opus.md`, `2026-10-25-uchwyt-scianki-astra.md`.

## Zmiana v13 wobec v12

- Ścianka słupek–wieża 3 obniżona do `hScianyW3` = 3,5 mm nad płytą, czyli do z −62,5 (płyta z −66, dno korpusów serw z −61,3). W rundzie 1 obaj recenzenci wskazali, że ta ścianka blokuje wsuwanie S1 i SD (Opus) i wchodzi w przedłużenie orczyka SD o 1,25 mm (Astra).
- Reszta bez zmian.

## Dowody

- `40-cad/openscad/kolizje-kardany-v12.txt` i `kolizje-powieki-v12.txt` (wyniki na siatkach v13):
  - serwa–uchwyt 0,30;
  - orczyk SD–uchwyt 2,62;
  - orczyk S1–serwo S2 1,39.
- STL v13: `C:/Users/Karol/AppData/Local/Temp/v13/stl` (UchwytSerw.stl w układzie złożenia).

## Zadanie obowiązkowe

1. **Symulacja wsuwania wszystkich 4 serw (S1, S2, SG, SD) w okna ramek na siatce v13**, całą drogą montażu. Podaj dla każdego serwa: wolna droga albo od ilu mm kolizja i z czym.
2. Kolizja przedłużenia orczyka SD (rzeczywista siatka „Przedluzenie orczyka”) z uchwytem.
3. Serwo S2 przy słupku (Opus, runda 1, PSUJE 2): potwierdź albo obal na v13. Jeśli kolizja jest, oceń wariant „ramka S2 po drugiej stronie uszu, serwo wsuwane wieżą od +x” (czy się mieści, co koliduje).

## Raport

Lista PSUJE (miejsce, liczba, poprawka) i werdykt jednym zdaniem: czy Uchwyt v13 może iść do druku.

- Astra → `20-analizy/review/2026-10-25-uchwyt-scianki-astra-r2.md` (odpowiedź końcowa).
- Opus → `20-analizy/review/2026-10-25-uchwyt-scianki-opus-r2.md`.
