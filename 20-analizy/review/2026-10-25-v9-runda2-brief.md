# Brief: runda 2 z 2 (ostatnia) – duże oko v9, tylko zmiany po rundzie 1

Jesteś recenzentem, tylko do odczytu. Piszesz po polsku. **Zgłaszaj tylko uwagi PSUJE**, czyli takie, przy których produkt nie zadziała według PRD. Brzegowych nie wypisuj. To ostatnia runda: po niej użytkownik dostaje pliki do druku testowego z listą znanych ryzyk.

## Zmiany v9 wobec rund 1

Raporty z rundy 1: `2026-10-25-kardany-{opus,astra}.md`, `2026-10-25-powieki-v3-{opus,astra}.md`.

1. **`przesS2` 5,5** (było 4): serwo S2 przesunięte, żeby orczyk S1 nie dotykał wieży S2. Przemiatanie `40-cad/openscad/kolizje-kardany-v9.txt`:
   - orczyk S1 – serwo S2: 1,39 mm;
   - kardany i pręty czyste (najmniej 0,49 mm, czyli zamierzony luz piasty w kostce).
2. **Pręt S2 w orczyku:** zagięcie ok. 105°, otwór Ø2,5. Instrukcja, sekcja „Druty”.
3. **Kostki kardanów:** podpory drzewiaste w tabeli druku. Kołek Ø2 wklejany w otwór Ø2,2 (klejenie dozwolone).
4. **Instrukcja** (`40-cad/openscad/duze-oko-v2-montaz.md`):
   - orientacja krzyżaka (sworzeń bliższy pręta równolegle do osi serwa);
   - ogon zagięcia za orczykiem;
   - koszulki na końcach L drutów powiek.
5. **Powieki** (z rundy 1 powiek):
   - podpora pod uszkiem;
   - pogłębienie Ø4,6 pod łeb wkrętu orczyka;
   - przedłużenie orczyka blokowane 2 kołkami Ø1 przez otwory fabrycznego orczyka (13,5 / 17,5), wgłębienie z zapasem 1 mm, bo orczyk MG90S nie jest płaski.
6. **Przemiatanie powiek na v9** liczy się. Wynik trafi do `C:/Users/Karol/AppData/Local/Temp/v9/p.txt`. Jeśli go nie ma, oceń ryzyko na podstawie v3 (`40-cad/openscad/kolizje-powieki-v3.txt`) i zmian geometrii.

Model: `40-cad/openscad/duze-oko-v2.scad`. STL i `parametry.json` v9: `C:/Users/Karol/AppData/Local/Temp/v9/stl`.

## Raport

Krótki: lista PSUJE (miejsce, liczba, poprawka) i werdykt jednym zdaniem: czy v9 może iść do druku testowego.

- Astra → `20-analizy/review/2026-10-25-v9-runda2-astra.md` (odpowiedź końcowa).
- Opus → `20-analizy/review/2026-10-25-v9-runda2-opus.md`.
