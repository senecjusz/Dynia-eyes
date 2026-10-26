# Brief recenzji: zgodność modelu dużego oka v3 z założeniami

26.10.2026, PM. Ten sam brief dostaje dwóch niezależnych recenzentów: **Opus 5.5** i **Astra**. Pracujecie osobno i tylko na odczyt. Zapisujecie wyłącznie swój raport i nie czytacie raportu drugiego recenzenta.

## Cel

Użytkownik chce mieć pewność, że gotowy model **nie odchodzi od założeń** i nie jest przekombinowany. Model powstał w nocy, bez jego udziału. Sprawdzacie zgodność, a nie szukacie ulepszeń. Każda propozycja dodatku albo rozbudowy jest błędem recenzji.

## Materiał

Wszystko w worktree `/home/rkp/Projects/010-Eye-pumpkin/Dynia-eyes/.claude/worktrees/duze-oko` (commit `ca3b376`):

- **Model i wyniki:** `40-cad/openscad/duze-oko-v3.scad`, `40-cad/3mf/Duze oko v3/`, `40-cad/openscad/przemiatanie-v3.txt`, `40-cad/openscad/duze-oko-v3-montaz.md`.
- **Założenia:**
  - `30-projekt/PRD.md` (§4 i §9);
  - `30-projekt/decyzje.md` (wiersze z 26.10);
  - `30-projekt/brief-duze-oko-koncepcja-referencja.md` (6 ustaleń);
  - **`20-analizy/review/2026-10-26-odstepstwa-koncepcji-decyzja-pm.md`** (decyzje PM po pierwszej recenzji i obowiązkowe poprawki).
- **Koncepcja:** `20-analizy/2026-10-26-duze-oko-koncepcja-referencja.md`.
- **Referencja:** `/home/rkp/Projects/010-Eye-pumpkin/Dynia-eyes/00-inbox/face-maker101/`.

Wymiary sprawdzajcie na siatkach 3MF albo na modelu SCAD (OpenSCAD jest zainstalowany), a nie na deklaracjach w raportach.

## Zadanie

1. **Zgodność z decyzją PM**, punkt po punkcie:
   - płyta pozioma;
   - zaczepy powiek ok. 34 i ok. 31–32 przy x ≈ 0;
   - klej zamiast M3;
   - 3 tuby 30/40/50 o rzeczywistej długości;
   - jedna centralna piasta bez 3 żeber;
   - obowiązkowe poprawki: słupki R37,2, kolizja pręta L–P, montaż wkrętu M4 tylnej piasty, światło otworu tylnego, osie Ø2,4, przemiatanie narożników.

   Dla każdego punktu: **ZGODNE / NIEZGODNE**, z dowodem.
2. **Elementy nowe:** każda część, śruba, wycięcie albo kształt, którego nie ma w referencji, w koncepcji ani w decyzji PM (np. wycięcia w powiekach, przesunięte serwa). Dla każdego: **NIEZBĘDNE** (wymusza je geometria, podaj liczbę) / **NADMIAROWE**.
3. **Montaż rękami:** czy każdy krok instrukcji v3 da się wykonać palcami i narzędziem w podanej kolejności. Czy jest miejsce „na milimetr” poza zaakceptowanym 1 mm przy tubie.
4. **Wystarczalność przemiatania:** czy obejmuje narożniki obu osi, obie powieki i druty.
5. **Druk:** każda część ≤ 180 mm, płaska podstawa, nawisy ≤ 45° albo opisane podpory.

## Wynik

Raport po polsku: `20-analizy/review/2026-10-26-zgodnosc-v3-<opus|astra>.md`.

- Tabela punktów z werdyktem i dowodem.
- Wagi uwag: KRYTYCZNE / WAŻNE / DROBNE.
- Werdykt jednym zdaniem: czy v3 jest zgodne z założeniami i nadaje się do wydruku testowego.

Bez prognoz czasu. Po zapisaniu raportu zatrzymaj się.
