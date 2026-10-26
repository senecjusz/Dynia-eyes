# Brief recenzji: odstępstwo „oczko zamiast Z” na języczkach gałki

26.10.2026, PM. Ten sam brief dostaje dwóch niezależnych recenzentów: Opus 5.5 i Astra. Pracujecie osobno i tylko na odczyt. Zapisujecie wyłącznie swój raport i nie czytacie raportu drugiego recenzenta. Reguła użytkownika: odstępstwo przechodzi tylko wtedy, gdy obaj uznają je za niezbędne.

## Materiał

Worktree `/home/rkp/Projects/010-Eye-pumpkin/Dynia-eyes/.claude/worktrees/duze-oko`, commit `871090f`:

- model i przemiatanie: `40-cad/openscad/duze-oko-v3.scad`, `40-cad/narzedzia/duze-oko-v3-przemiatanie.py`;
- opis problemu: `40-cad/openscad/duze-oko-v3-montaz.md` §8;
- ustalenie 1 w `30-projekt/brief-duze-oko-koncepcja-referencja.md`: „pręty z drutu bez przegubów, końce zagięte w Z, drut Ø1,0 jak spinacz”;
- PRD §4: zakres cel ±35° / ±25°, minimum ±30° / ±20°; PRD §9;
- referencja: `/home/rkp/Projects/010-Eye-pumpkin/Dynia-eyes/00-inbox/face-maker101/` (kod `.ino`: serwa ±10–20°).

## Problem według projektanta

Zaczep „Z” w otworze języczka działa jak przegub o jednej osi. Języczek obraca się też wokół drugiej osi kardana, więc pręt wychodzi z płaszczyzny otworu:

- G–D do 37,7°, w narożnikach do 40,9°;
- L–P do 26,8°.

W przemiataniu z rzeczywistym kształtem „Z” pręt wchodzi w język: −1,33 mm (G–D) i −0,99 mm (L–P).

Propozycje projektanta:

- **(a)** Przy gałce zamknięte oczko z tego samego drutu Ø1,0 przez otwór Ø2,4 w języczku, jak ogniwo łańcucha. Przy orczykach zostaje „Z”.
- **(b)** Otwór Ø1,6 z fazkami, czyli najwyżej ok. ±20°, za mało dla G–D.
- **(c)** Mniejszy zakres, co jest zmianą funkcji.

## Zadanie

1. **Czy problem istnieje?** Sprawdź sam kąt wyjścia pręta z płaszczyzny otworu przy pełnym zakresie PRD i przy minimum PRD. Nie przepisuj liczb projektanta.
2. **Czy (a) jest NIEZBĘDNE do spełnienia PRD, czy NADMIAROWE?** Czy istnieje rozwiązanie bez zmiany ustalenia, z lepiej dobranym otworem albo kształtem „Z”? Czy minimum PRD ±30° / ±20° przechodzi z wariantem (b)?
3. **Czy (a) dodaje część albo przegub?** Oczko z tego samego drutu: czy to „przegub” w rozumieniu PRD §9, czy zakończenie drutu? Jakie ryzyko: luz, wypadanie, gięcie, montaż palcami?

## Wynik

Raport: `20-analizy/review/2026-10-26-oczko-<opus|astra>.md`. Werdykt dla (a): **NIEZBĘDNE / NADMIAROWE / ZMIANA ZAŁOŻEŃ**, z dowodem liczbowym. Werdykt jednym zdaniem. Bez prognoz czasu.
