# Brief: krytyczna analiza – co w mechanizmie dużego oka jest ponad potrzebę i jak to uprościć

Jesteś niezależnym analitykiem. Pracujesz tylko do odczytu: bez zmian w repo, bez commitów, bez `git pull`. Piszesz po polsku, prostym językiem. Każdy termin projektu tłumaczysz przy pierwszym użyciu.

## Dlaczego

Użytkownik (doświadczony konstruktor i drukarz 3D, projekt hobbystyczny z synem, dynia w szkole od 28.10) uważa, że obecny mechanizm dużego oka jest „szalenie skomplikowany”. Przygotowanie zajmuje wiele godzin, a niedoskonałości wykonania (ręcznie gięte druty, luzy, krótkie dźwignie powiek ok. 7 mm przy osi) zepsują ruch.

Pyta wprost:
- co zostało wprowadzone ponad potrzebę, „tylko żeby coś zrobić”;
- czy na przykład **pierścień** jest potrzebny, czy oko można trzymać w środku inaczej.

## Materiał

- **Wymagania:**
  - `30-projekt/PRD.md`, rozdział 4 „Duże oko” i 7 „Części”. PRD wskazuje **mechanizm referencyjny The Face maker101 (PCBWay)**: https://www.pcbway.com/project/shareproject/The_Face_maker101_c4124445.html. Zasada: każdy element spoza referencji wymaga uzasadnienia.
  - Decyzje: `30-projekt/decyzje.md`.
- **Obecny projekt:**
  - model `40-cad/openscad/duze-oko-v2.scad` (stan roboczy; moduły Galka, PowiekaGorna, PowiekaDolna, Pierscien, Maskownica, UchwytSerw);
  - montaż `40-cad/openscad/duze-oko-v2-montaz.md`;
  - koncepcja `20-analizy/2026-10-24-duze-oko-koncepcja-wstepna.md`;
  - raport `30-projekt/raport-nocny-2026-10-25.md`.
- **Historia problemów z ostatnich 24 h** (druty, ucha, powieki), w `20-analizy/review/`:
  - `2026-10-24-polaczenia-ciegien-*`, `2026-10-24-druty-v2-*`, `2026-10-24-ucho-oczko-*`, `2026-10-24-druty-v3-model-*`;
  - `20-analizy/2026-10-24-duze-oko-druty-v2.md`.
- **Inne referencje:** `10-inspiracje/mechanizmy-oka-zrodla.md` (Will Cogley V2 Simplified, EyeMech E31 i inne).

## Warunki, które zostają

- otwór w dyni ≤ Ø80, ścianka 28–50 mm, rant z zewnątrz ≤ 2 mm;
- gałka Ø60, biała, gładka, ruch ok. ±35° / ±25°;
- powieki: górna i dolna;
- serwa MG90S (3, najwyżej 4 za zgodą użytkownika);
- kardan 5/5 albo 2/2 z warsztatu;
- tylko posiadane części: śruby M3/M4/M5 z nakrętkami, drut sprężynowy Ø1,0/Ø1,2, ocynkowany Ø2,0, łożyska 608 i 6802;
- druk PLA na A1 mini (≤ 180 mm);
- montaż ręczny, dokładność ±2 mm na drutach, bez drobnych kruchych wydruków;
- ESP32 z kalibracją serw.

## Pytania

1. **Inwentarz:** lista elementów obecnego mechanizmu. Przy każdym:
   - czy jest w referencji The Face maker101;
   - czy wymaga go PRD;
   - czy jest dodatkiem projektanta i jakie ma uzasadnienie (prawdziwe czy wtórne).
   Szczególnie: pierścień z tubą, maskownica, podkładki osi powiek, rowek T, okno słupka, powieki na czaszach i ich osie M2 przy tubie, krótkie dźwignie powiek, ucha / widełki w gałce, druty z Z i V, koszulki.
2. **Referencja:** jak The Face maker101 (i Cogley V2 Simplified / E31, jeśli pomocne) trzyma gałkę i powieki, jak łączy serwa z gałką i jak rusza powiekami jednym serwem. Co z tego wprost przenieść?
3. **Źródła trudności:** które decyzje wywołały kaskadę problemów (np. moduł wkładany od środka w tubę Ø80 → mało miejsca → krótkie dźwignie → precyzja drutów)? Podaj łańcuch przyczyn.
4. **Prostsze architektury:** 2–3 warianty spełniające warunki. Dla każdego:
   - jak trzymana jest gałka i powieki (np. rama z boku zamiast pierścienia, oko mocowane od przodu, powieki na osi w ramie z długimi dźwigniami);
   - czym połączone są serwa;
   - liczba części drukowanych i kroków montażu, czas przygotowania;
   - wrażliwość na błąd ±2 mm (np. stopnie powieki na 1 mm);
   - główne ryzyko.
   Liczby zamiast opinii. Oddzielaj fakt, obliczenie i założenie.
5. **Rekomendacja:** który wariant i dlaczego. Co z obecnego modelu da się zachować?

## Raport

- Opus → `20-analizy/review/2026-10-25-uproszczenie-opus.md`
- Fable → `20-analizy/review/2026-10-25-uproszczenie-fable.md`
- Astra → `20-analizy/review/2026-10-25-uproszczenie-astra.md` (jako odpowiedź końcowa)

Zacznij od streszczenia w 3 akapitach po najwyżej 3 zdania (użytkownik nie czyta dłuższych), potem szczegóły. Nie czytaj raportów innych analityków tej rundy.
