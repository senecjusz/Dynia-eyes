# Brief: review usztywnienia Uchwytu serw (duże oko v12) – runda 1 z 2

Jesteś recenzentem, tylko do odczytu, bez commitów i `git pull`. Piszesz po polsku. **Zgłaszaj tylko uwagi PSUJE**, czyli takie, przez które produkt nie zadziała według PRD (`30-projekt/PRD.md`). Brzegowych nie wypisuj. Najwyżej 2 rundy.

## Kontekst

Użytkownik wydrukował Uchwyt v9. Ramki serw powiek SG/SD nie wydrukowały się w całości, bo słupki miały ok. 2 mm. Poprosił, żeby wieże i ramki połączyć ściankami (szkic ze slicera: gwiazda od słupka do wież, ramki połączone). Uznał też, że lewej i prawej strony nie da się połączyć, a lewa (ramki SG/SD) będzie niestabilna w poprzek.

## Zmiany v12 wobec v9 (`40-cad/openscad/duze-oko-v2.scad`, moduł `UchwytSerw`, zmienne w linii ~76–78)

1. `polRamki` 10,5: słupki ramek mają ok. 4 mm.
2. Ścianki `tSciany` 2,5 mm (moduł `sciankaAB`):
   - słupek–wieża 2 (koniec przy dolnej krawędzi wieży, odsunięty od serwa SG);
   - słupek–wieża 3 (niższa, do `zOkno[0] − 1`);
   - wieża 1–ramki S1 i S2.
3. Ramki SG/SD połączone ścianą, a na jej końcach trójkątne żebra `zebroP` 14 mm w stronę −x (sztywność w poprzek).
4. Niskie żebro `hZebraS2` 6 mm od słupka do ramki S2 na y = 0.
5. Skośne podstawy wież 45° (`fazaWiezy` 5).

## Dowody

- Przemiatanie kardanów, serw i uchwytu: `40-cad/openscad/kolizje-kardany-v12.txt`:
  - serwa–uchwyt 0,30 (luz okna ramki);
  - piasta 2 S1–uchwyt 1,75;
  - orczyk S1–serwo S2 1,39.
- Powieki: `40-cad/openscad/kolizje-powieki-v12.txt` (wyliczone na v11; v12 tylko odejmuje materiał przy wieży 2 i żebrze S2):
  - orczyk SD–uchwyt 0,84;
  - orczyk SG–uchwyt 2,62.
- STL v12: `C:/Users/Karol/AppData/Local/Temp/v12/stl` (UchwytSerw.stl w układzie złożenia, Uchwyt serw.3mf w pozycji druku).

## Pytania

1. Czy któraś ścianka albo żebro blokuje montaż serwa (wsunięcie od góry lub z boku w okno ramki), dostęp do wkrętów serw albo przejście kabli serw?
2. Druk: czy uchwyt drukuje się bez podpór (płyta na stole), czy nowe elementy mają nawisy > 45°?
3. Czy usztywnienie realnie rozwiązuje słupki ~2 mm i sztywność lewej strony w poprzek? Liczby: grubości, wysokości.
4. Kolizje w ruchu (orczyki, pręty, powieki) w całym zakresie.

## Raport

Lista PSUJE (miejsce, liczba, poprawka) i werdykt jednym zdaniem: czy Uchwyt v12 może iść do druku.

- Astra → `20-analizy/review/2026-10-25-uchwyt-scianki-astra.md` (odpowiedź końcowa).
- Opus → `20-analizy/review/2026-10-25-uchwyt-scianki-opus.md`.
