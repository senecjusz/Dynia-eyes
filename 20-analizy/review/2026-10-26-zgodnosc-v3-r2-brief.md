# Brief: końcowe sprawdzenie zgodności dużego oka v3 (runda 2)

26.10.2026, PM. Dostają go Opus 5.5 i Astra, osobno, tylko na odczyt. Sprawdzacie tylko, czy uwagi z rundy 1 i decyzje PM są wykonane i czy nie doszły nowe odstępstwa. Nowych ulepszeń nie proponujecie.

Worktree `/home/rkp/Projects/010-Eye-pumpkin/Dynia-eyes/.claude/worktrees/duze-oko`, commit `d7a6dae`. Zmiany wobec rundy 1 to commity `871090f` i `d7a6dae` (`git diff ca3b376 d7a6dae`).

Wejście:

- Wasze raporty z rundy 1: `20-analizy/review/2026-10-26-zgodnosc-v3-{opus,astra}.md`. Własny czytasz w całości, drugi tylko w części KRYTYCZNE i WAŻNE.
- Decyzja w sprawie oczka: `20-analizy/review/2026-10-26-oczko-{opus,astra}.md`. Zostaje „Z” z poprawioną geometrią.
- Decyzja PM: `20-analizy/review/2026-10-26-odstepstwa-koncepcji-decyzja-pm.md`.
- Model, siatki, przemiatanie i instrukcja: `40-cad/openscad/duze-oko-v3.scad`, `40-cad/3mf/Duze oko v3/`, wynik przemiatania, `40-cad/openscad/duze-oko-v3-montaz.md`.

Zadanie:

1. Każda uwaga KRYTYCZNA i WAŻNA z rundy 1 obu recenzentów: **ZAMKNIĘTA / OTWARTA**, z dowodem na siatce albo w SCAD. Dotyczy to zwłaszcza kolizji serw L–P i powieki górnej, przemiatania par nieruchomych, kołków, osi powiek, drogi wkrętaka i kabla G–D.
2. Zaczepy „Z” przy gałce: czy wymagany przechył przy celu PRD i w narożnikach mieści się w dopuszczalnym, z zapasem. Zaczep G–D jest teraz słupkiem: czy to zmiana kształtu, czy nowa część.
3. Czy zmiany wprowadziły coś spoza referencji, koncepcji i decyzji PM. Każdą taką rzecz oznacz jako NIEZBĘDNE albo NADMIAROWE.
4. Czy jakikolwiek odstęp przy montażu jest „na milimetr” poza zaakceptowanym 1 mm przy tubie. Uwaga: 0,95 mm między serwem L–P a serwem powieki górnej to odstęp części nieruchomych. Oceń, czy przeszkadza przy wkładaniu serwa.

Raport: `20-analizy/review/2026-10-26-zgodnosc-v3-r2-<opus|astra>.md`, krótki, z tabelą. Werdykt jednym zdaniem: czy v3 (`d7a6dae`) nadaje się do wydruku testowego. Bez prognoz czasu.
