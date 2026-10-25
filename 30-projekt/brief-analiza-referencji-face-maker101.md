# Brief: analiza referencji The Face maker101 jako wzoru dużego oka

25.10.2026, PM. Ten sam brief dostają trzej niezależni analitycy: **Fable**, **Opus 5.5** i **Astra** (Codex). Pracują osobno i nie czytają nawzajem swoich raportów.

## Rola

Jesteś analitykiem referencji. Pracujesz **tylko na odczyt**: nie zmieniasz plików w repo, nie robisz commitów i nie robisz CAD. Jedyny plik, który zapisujesz, to Twój raport (ścieżka niżej). Brief jest poleceniem i nie czekasz na potwierdzenie.

## Tło

Duże oko dyni przeszło trzy iteracje. Za każdym razem projektant rozbudowywał konstrukcję ponad referencję: kardany 2/2 przy gałce, ramki serw, w których serwa nie dało się wsunąć, odstępy liczone „na milimetr”. Wychodził potworek, którego nie da się złożyć rękami. Teraz zaczynamy od tego, jak zrobiono to w referencji, i tylko to przenosimy.

## Wejście

- Referencja: <https://www.pcbway.com/project/shareproject/The_Face_maker101_c4124445.html> (opis, zdjęcia, film, lista plików).
- `30-projekt/PRD.md`: §4 (Duże oko), §7 (części posiadane), §8 (poza zakresem), §9 (prostota przed zakresem).
- Pozostałe referencje: `10-inspiracje/` (zwłaszcza `mechanizmy-oka-zrodla.md`).
- Pomiary posiadanych części: `30-projekt/e6-pomiary.md` (kardan 5/5, MG90S, orczyk).
- **Nie korzystaj z modeli v1–v9** (`40-cad/openscad/duze-oko-v2.scad`, koncepcje dużego oka w `20-analizy/`). To właśnie rozbudowa, której unikamy.

**Plików z PCBWay nie pobieraj.** Wypisz, jakie pliki są dostępne (STL, kod, schemat). Pobranie wymaga zgody użytkownika. Jeśli strona się nie otwiera albo czegoś na niej nie widać, napisz to wprost i nie zgaduj.

## Zadanie

### Część 1: fakty z referencji

Każdy fakt ze źródłem (fragment opisu, numer zdjęcia, minuta filmu). Założenia oznaczaj **[Z]**, fakty **[F]**.

1. Lista części: drukowane, kupne, druty i spinacze, śruby.
2. Gałka: średnica, na czym siedzi i jak jest podparta, ile ma przegubów.
3. Napęd gałki: ile serw, gdzie stoją, jak pręty łączą się z orczykiem i z gałką (otwór, oczko, przegub), jaki jest zakres ruchu.
4. Powieki: czy są, ile ich, jak są napędzane i podparte.
5. Mocowanie całości (rama, płyta) i kolejność montażu: co, czym i w jakiej kolejności się przykręca.
6. Co w referencji jest proste i dlaczego działa.

### Część 2: adaptacja do naszych potrzeb

Przenieś referencję możliwie 1:1 na: gałkę Ø60, otwór w dyni ≤ Ø80, 4 × MG90S (lewo–prawo, góra–dół, powieka górna, powieka dolna), części posiadane z PRD §7.

1. **Jedyna dozwolona modyfikacja: kardan w środku gałki, i to tylko wtedy, gdy jest potrzebny.** Najpierw sprawdź, czy podparcie gałki z referencji wystarcza przy Ø60. Kardan proponujesz tylko wtedy, gdy nie wystarcza, z uzasadnieniem.
2. **Lista różnic wobec referencji:** każda różnica w osobnym wierszu (co, dlaczego, jakie są inne możliwości). Każda różnica i każdy dodatkowy przegub, część albo śruba to **pytanie do użytkownika**, a nie Twoja decyzja (PRD §9).
3. **Zakres ruchu:** jaki zakres daje adaptacja wobec PRD (cel ±35°/±25°, minimum ±30°/±20°). Jeśli referencja daje mniej, napisz ile i co by to zmieniło. Wybór między mniejszym zakresem a dodatkiem należy do użytkownika.
4. **Montaż rękami:** kolejność i dostęp palcami i narzędziem w każdym kroku. Nic, co przechodzi obok siebie „na milimetr”.
5. **Szkic:** prosty (ASCII albo SVG) widok z boku i od tyłu: gałka, podparcie, serwa, pręty, powieki.

## Wynik

Raport po polsku w `20-analizy/2026-10-25-referencja-face-maker101-<fable|opus|astra>.md`:

1. Fakty z referencji (część 1) w tabeli, ze źródłami.
2. Adaptacja: lista części, szkic, kolejność montażu.
3. Tabela różnic wobec referencji, z pytaniami do użytkownika.
4. Zakres ruchu wobec PRD.
5. Werdykt jednym zdaniem: czy adaptacja jest prostsza niż v9 i czy da się ją złożyć rękami.

Bez prognoz czasu. Liczby zamiast opinii. Po zapisaniu raportu zatrzymaj się.
