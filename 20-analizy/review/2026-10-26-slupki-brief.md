# Brief: sprawdzenie wytrzymałości słupków i podpory płyty (duże oko v3)

26.10.2026, PM. Dostają go Opus 5.5 i Astra, osobno, tylko na odczyt. Zapisujecie wyłącznie swój raport.

Worktree `/home/rkp/Projects/010-Eye-pumpkin/Dynia-eyes/.claude/worktrees/duze-oko`, commit `41c5140`. Zmiany wobec `881d818`:

- nasady słupków zawiasu i słupka kardana pogrubione żebrami i skosami 45°;
- płaska stopka do druku pod 45°;
- projektowana podpora jako osobna siatka.

Wejście:

- raport `20-analizy/2026-10-26-duze-oko-v3-wytrzymalosc-slupkow.md` i skrypt `40-cad/narzedzia/duze-oko-v3-slupki.py`;
- model `40-cad/openscad/duze-oko-v3.scad`, pliki 3MF, instrukcja `40-cad/openscad/duze-oko-v3-montaz.md` (§1 druk płyty);
- decyzje użytkownika z 26.10 w `30-projekt/decyzje.md`:
  - nasady pogrubione bez nowych części;
  - płyta drukowana pod 45°;
  - projektowana podpora jako osobna siatka.

Zadanie:

1. Sprawdźcie samodzielnie zapasy wytrzymałości u nasad wszystkich trzech słupków przy druku pod 45°: obciążenie z drutu przy zablokowanym serwie, siła ręki przy montażu, wpływ kleju w tubie. Przyjmijcie własne, podane wartości wytrzymałości PLA w poprzek warstw i wzdłuż nich. Czy najmniejszy zapas 2,9 jest policzony poprawnie i czy wystarcza?
2. Czy wzmocnienia nie odbierają luzów: ruch powiek i drutów, płyta wobec tuby 50 (0,55 mm), droga montażu.
3. Podpora: czy płyta postawiona na stopce i podporze drukuje się bez nawisów, czy podporę da się odłamać bez uszkodzenia słupków i czy łączniki nie są za mocne.
4. Czy cokolwiek wykracza poza decyzje użytkownika: nowa część, nowe śruby, przekombinowanie.

Raport: `20-analizy/review/2026-10-26-slupki-<opus|astra>.md`, krótki, z tabelą i wagami KRYTYCZNE / WAŻNE / DROBNE. Werdykt jednym zdaniem: czy płytę z podporą można drukować. Bez prognoz czasu.
