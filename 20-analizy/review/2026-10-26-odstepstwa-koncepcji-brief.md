# Brief recenzji: odstępstwa koncepcji dużego oka od referencji i ustaleń

26.10.2026, PM. Ten sam brief dostaje dwóch niezależnych recenzentów: **Opus 5.5** i **Astra** (Codex). Pracujecie osobno i nie czytacie nawzajem swoich raportów. Pracujecie tylko na odczyt. Zapisujecie wyłącznie swój raport.

## Po co ta recenzja

Duże oko przeszło trzy iteracje, w których projektanci rozbudowywali konstrukcję ponad wzór. Użytkownik ustalił, że wzorem jest referencja The Face maker101, a każde odstępstwo od niej i od ustaleń wymaga zgody. Użytkownik śpi. Według jego polecenia odstępstwo przechodzi do CAD **tylko wtedy, gdy obaj recenzenci uznają je za niezbędne**. W przeciwnym razie projektant robi zgodnie z wymaganiami.

## Materiał

Wszystko leży w worktree `/home/rkp/Projects/010-Eye-pumpkin/Dynia-eyes/.claude/worktrees/duze-oko`:

- koncepcja: `20-analizy/2026-10-26-duze-oko-koncepcja-referencja.md` i `.svg`;
- brief projektanta z 6 ustaleniami: `30-projekt/brief-duze-oko-koncepcja-referencja.md`;
- `30-projekt/PRD.md`, zwłaszcza §4 i **§9 „Prostota przed zakresem”**, oraz `30-projekt/decyzje.md` z wierszami z 26.10;
- synteza referencji: `20-analizy/2026-10-25-referencja-face-maker101-synteza.md`;
- pliki referencji: `/home/rkp/Projects/010-Eye-pumpkin/Dynia-eyes/00-inbox/face-maker101/` (STL do pomiaru skryptem i `.ino`).

## Zadanie

Dla **każdej** pozycji tabeli §6 koncepcji oraz każdej części albo śruby, której nie ma w referencji ani w 6 ustaleniach briefu, oceń jedno z trzech:

- **NIEZBĘDNE:** bez tego nie da się spełnić PRD albo ustaleń. Podaj liczbę albo geometrię, która to wymusza, i sprawdź ją sam, nie ufaj rachunkowi projektanta.
- **ZMIANA ZAŁOŻEŃ:** zmienia ustalenie albo funkcję. Decyzja należy do użytkownika.
- **NADMIAROWE:** overengineering. Da się prościej, bliżej referencji. Napisz jak.

Sprawdź w szczególności:

1. **Płyta pionowa zamiast poziomej.** Czy argument geometryczny jest prawdziwy: słupki zawiasu na x ±35–37 w tubie R38 przy płycie poziomej pod gałką? Czy istnieje prostszy wariant bliższy referencji?
2. **Zaczepy powiek 31,4 / 26,7 mm od osi zamiast ok. 34** (PRD §4). Czy wymusza to tuba? Czy funkcja, czyli pełne otwarcie 51,5° i źrenica nie zasłonięta, zostaje?
3. **Mocowanie modułu do tuby 2 × M3 × 10 z nakrętkami w uszach tuby** wobec kleju na gorąco jak w referencji.
4. **Tuba o stałej długości 54 z kołnierzem w 3 położeniach** wobec ustalenia: „tuba z kołnierzem w 3 długościach pod ścianę 30/40/50”. Czy to ta sama funkcja?
5. **Elementy wewnątrz gałki:** piasta na 3 żebrach i 2 języczki zaczepów. Słupek kardana Ø12. 2 × M5 × 8 wklejone łbem. Druty Ø2 jako osie powiek.
6. Czy gdziekolwiek konstrukcja wymaga luzu „na milimetr” poza zaakceptowanym 0,95 mm słupek–tuba?

## Wynik

Raport po polsku w `20-analizy/review/2026-10-26-odstepstwa-koncepcji-<opus|astra>.md`:

1. Tabela: pozycja | werdykt (NIEZBĘDNE / ZMIANA ZAŁOŻEŃ / NADMIAROWE) | dowód liczbowy | prostsza alternatywa, jeśli jest.
2. Werdykt jednym zdaniem: czy koncepcja może iść do CAD, a jeśli tak, z jakimi zmianami.

Bez prognoz czasu. Liczby zamiast opinii. Po zapisaniu raportu zatrzymaj się.
