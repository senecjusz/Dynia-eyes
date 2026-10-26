# Duże oko v3: druk, montaż i kontrola (OpenSCAD, noc 25/26.10)

Model: `duze-oko-v3.scad` (parametry na górze). Eksport: `bash eksport-v3.sh <katalog STL>` → `40-cad/3mf/Duze oko v3/`. Przemiatanie: `blender -b -P ../narzedzia/duze-oko-v3-przemiatanie.py -- <katalog STL> <wynik.txt>`. Render: `bash render-v3.sh <katalog STL>` → `podglad/duze-oko-v3/`.

Podstawa: koncepcja `20-analizy/2026-10-26-duze-oko-koncepcja-referencja.md`, decyzja PM `20-analizy/review/2026-10-26-odstepstwa-koncepcji-decyzja-pm.md` i review zgodności v3 (`20-analizy/review/2026-10-26-zgodnosc-v3-{opus,astra}.md`).

Odstępstwa bez zgody obu recenzentów są zrobione zgodnie z wymaganiami:
- płyta pozioma za tubą;
- zaczepy powiek 34 / 31,5 od osi przy x = ±5;
- moduł wklejany w tubę na gorąco;
- trzy rzeczywiste tuby 30/40/50;
- jedna centralna piasta gałki.

Układ: 0 = środek kuli, z do przodu, y w górę, x w prawo patrząc od przodu. **[Z]** = założenie na rano: P4 (źrenica Ø20), P5 (gałka 24 mm przed rantem) oraz czasza 114° zamiast ok. 120° (wygląd).

## 1. Części do druku (każda ≤ 180 mm, 1 bryła, 0 błędów siatki)

| Plik 3MF | Szt. | Wymiar | Orientacja i podpory |
|---|---|---|---|
| `Plyta` | 1 | 84 × 109 × 26 (z ramionami i słupkiem) | Spód płyty na stole. **Podpory pod ramionami zawiasu i słupkiem kardana** w części przed płytą, wiszą 14–26 mm nad stołem. Płyty poziomej nie da się wydrukować bez nich, bo ramiona w tubie muszą leżeć przy osi (y ±5). Podpory malujesz w slicerze tylko tam |
| `Galka` | 1 | Ø60, krawędź tylna na z = −12 | Krawędzią na stole. **Podpory drzewiaste pod czołem piasty** (z = +14, nad pustką) i **pod wewnętrznymi końcami obu języczków** (7,2 mm wysięgu od podparcia 45°, 5 mm nad stołem). Podpory zdejmujesz przez otwór tylny |
| `Powieka gorna` | 1 | R33,2–34,4 | Krawędzią tylną (z = −3) na stole, z brimem (pasek 1,2 mm). Mostek 10 mm nad wycięciem przy uszku drutu. Ewentualnie podpora wewnątrz pod szczytem kopułki |
| `Powieka dolna` | 1 | R31,0–32,2 | jak górna |
| `Przedluzenie orczyka (druk x2)` | 2 | 33 × 10 × 2,5 | płasko |
| `Tuba 30`, `Tuba 40`, `Tuba 50` | po 1 | Ø79,5 / Ø76,3, kołnierz Ø92 × 3, 4 łapy; wysokość 33 / 43 / 53 | Kołnierzem na stole. Drukujesz wszystkie trzy, przy składaniu wybierasz tę, która pasuje do ściany dyni |
| `Maskownica` | 1 | Ø84 / Ø76,3 × 2 | płasko |
| `Duze oko v3 - wszystkie czesci` | – | wszystkie powyższe jako osobne obiekty | Do rozłożenia na kilka stołów: obiekty zajmują ok. 233 × 399 mm |

Kolor: mechanizm pomarańczowy, gałka biała.

## 2. Części posiadane

| Co | Ilość | Gdzie |
|---|---|---|
| MG90S z orczykiem jednoramiennym i wkrętem | 4 | L–P, G–D, powieka górna, powieka dolna |
| Kardan 5/5 z 2 wkrętami M4 | 1 | środek gałki |
| Śruba M5 × 8, łeb walcowy imbusowy (ISO 4762, Ø8,5 × 5) | 2 | Trzpienie kardana, łby wklejone (gniazdo Ø9,5 × 5,2, 0,5 na klej). Wkręcenie w piastę: 6,3–6,55 przy otworze 7 |
| Drut sprężynowy Ø1,0 | 4 odcinki, cięcie ok. 72 / 66 / 99 / 74 mm | pręty L–P i G–D, druty powiek górnej i dolnej; końce w „Z” (odsadzenie 1,75) |
| Drut Ø2,0 | 2 × 5,6 mm | osie powiek, w luźnych otworach Ø2,4 słupka i uszu; w słupku kropla CA |
| Wkręty do drewna 4 × 30–40 | 4 | łapy kołnierza (PRD) |
| Klej: epoksyd albo CA; klej na gorąco | – | łby M5, przedłużenia orczyków, osie w słupkach, serwa w gniazdach, moduł w tubie |

**Śruby razem:**
- 2 × M5 × 8;
- elementy, które przychodzą z kardanem i serwami: 2 × M4 kardana i 4 wkręty orczyków;
- 4 wkręty do drewna z PRD.

Żadnych M3, kołków ani innych dodatków.

## 3. Najważniejsze wymiary

| Co | Wartość |
|---|---|
| Rant tuby | z = +6 (gałka wystaje 24 [Z], zamknięte powieki 28,4) |
| Krawędź czaszy | z = −12, czyli ok. 114° od przodu. Otwór zewnętrznie Ø55,0, w świetle samej czaszy Ø50,6; wspólne wolne światło z podparciami języczków Ø50,0. Przy −15 pręt L–P przechodził przez krawędź. Ustalenie 3 dopuszcza płytszą czaszę |
| Piasta gałki | Ø14 od przedniego bieguna do z = +14 |
| Zaczepy gałki | języczki z = −4,5, otwór Ø1,3 na r = 14: L–P x = +14 (płytka w płaszczyźnie XZ), G–D y = +14 (płytka w YZ) |
| Słupek kardana | Ø12, z −51 … −14,25 |
| Płyta | wierzch y = −15, grubość 5, z −49 … −105, x ±42; przód 2 mm za kołnierzem tuby 50 |
| Słupki zawiasu | x 34,7 … łuk R37,2 (0,95 do tuby na całej szerokości), y ±5, z do +4; oś na z = 0 |
| Powieki | luz 1,0 do gałki i między powiekami; uszy górnej x ±(33,2…34,4), dolnej ±(31,8…33,0); luz osiowy 0,2 ucho–ucho i 0,3 ucho–słupek |
| Otwory osi | uszy i słupki: światło Ø2,4 (wielokąt 32-boczny opisany na Ø2,4), drut Ø2 |
| Zaczepy drutów powiek | górna x = +5, 34,0 od osi zawiasu; dolna x = −5, 31,5 od osi; otwór 1,6 nad płaszczyzną osi |
| Wałki serw | L–P (31,5; 0; −66) pionowo · G–D (0; 2,3; −60) · powieka górna (·; −9,5; −95) · powieka dolna (·; −9,5; −76) |
| Odstęp serw L–P i powieki górnej | przód korpusu powieki górnej −88,75, tylne ucho L–P −87,8 (0,95) |
| Orczyki | L–P otwór 17,5, G–D 11,5, powieki 25 (przedłużenie na zewnętrznej stronie ramienia, otwór na x = ±1,75) |
| Długość prętów między osiami otworów | L–P 61,5; G–D 55,5; powieka górna 88,6; dolna 63,4 |
| Przejścia w płycie | szczelina orczyka powieki dolnej x −9,5…+1,5 (orczyk, przedłużenie, „Z”); kabel G–D x −33,7…−25,5 pod końcem korpusu |

## 4. Zakres ruchu (kinematyka `narzedzia/duze_oko_v3_kinematyka.py`)

| Oś | Zakres | Serwo | Uwagi |
|---|---|---|---|
| L–P | ±35° | +30,5° / −23,1° | przenoszenie ≥ 58° (rachunek 2D) |
| G–D | ±25° | +33,8° / −28,4° | przenoszenie ≥ 54° |
| Powieka górna | 0 → 51,5° | 25° → −45,8° (71°) | przenoszenie ≥ 50°; wyboczenie drutu 88,6 mm przy 12,3 N wobec 8,6 N z serwa |
| Powieka dolna | 0 → 51,5° | 35° → −23,1° (58°) | przenoszenie ≥ 54° |

- **Sprzężenie osi, do firmware'u:**
  - przy L–P ±35° serwo G–D musi dodać +4,4°, inaczej gałka pochyli się o ok. 3,5°;
  - przy G–D ±25° serwo L–P musi dodać +1,5°;
  - poprawka jest mała; można ją zignorować albo wpisać w kalibrację.
- **Źrenica Ø20 [Z]:** przy spojrzeniu +25° jej krawędź jest na 44,5°, a otwarta powieka na 51,5°, czyli zapas 7°. W samych narożnikach (±35° i ±25° naraz) krawędź źrenicy chowa się ok. 1° pod powieką; PRD dopuszcza mniejszy zakres w narożnikach.

## 5. Kolejność montażu (na stole; tylko krok 10 w dyni)

Narzędzia: klucz imbusowy 2 mm (wkręty M4 kardana), wkrętak PH1 (wkręty orczyków), kombinerki (drut), pęseta. Światło otworu tylnego gałki to Ø50,0.

1. **Łby M5 × 8:** wklej epoksydem w gniazdo na czole słupka kardana (trzpień do przodu) i w gniazdo piasty gałki (trzpień do tyłu). Gałkę kładziesz otworem do góry, a śrubę wkładasz palcami albo pęsetą.
2. **Przedłużenia orczyków:** przyklej CA na zewnętrzną stronę ramion dwóch orczyków. Otwór Ø7 obejmuje piastę, a otwór 25 przedłużenia ma leżeć na przedłużeniu osi ramienia. Odstaw do związania.
3. **Serwa G–D, powieki górnej i powieki dolnej:**
   - każde stawiasz na płycie: dolne ucho w szczelinie, wieżyczki powiek nad wnękami 1 mm;
   - kabel G–D przeprowadzasz w dół przez przejście w płycie przy x ≈ −30, zanim serwo stanie;
   - klej na gorąco.

   Serwa L–P jeszcze nie wkładasz: jego gniazdo zostaje wolne, a z nim droga wkrętaka w krokach 6 i 8.
4. **Kardan na słupek:** piasta tylna na trzpień słupka, wkręt dociskowy M4 do góry. Dokręcasz imbusem 2 z góry; gałki jeszcze nie ma, wszystko otwarte.
5. **Gałka na kardan:**
   - wsuwasz gałkę od przodu, trzpień gałki wchodzi w piastę przednią;
   - wkręt M4 piasty przedniej patrzy w −x (sworzeń piasty poziomo);
   - dokręcasz go imbusem 2: krótkie ramię promieniowo, długie wychodzi do tyłu przez otwór tylny na x ≈ −18;
   - po tej stronie nie ma języczków, a ramię zawiasu jest na x = −35;
   - klucz przekładasz co ok. 60°.
6. **Pręt G–D:**
   - „Z” wkładasz kombinerkami w języczek G–D przez otwór tylny, zagięcie po stronie −x;
   - drugi koniec do otworu 11,5 zdjętego orczyka;
   - serwo ustawiasz na 1500 µs, orczyk nasadzasz ramieniem do góry;
   - wkręt orczyka wkrętakiem z prawej, wzdłuż −x na y 2,3, z −60. Droga jest wolna do x +60, bo gniazdo L–P jest jeszcze puste.
7. **Powieki:**
   - najpierw dolna, potem górna; uszy wsuwasz od przodu między słupki (0,3 luzu na stronę);
   - drut Ø2 × 5,6 wsuwasz od zewnątrz przez luźny otwór słupka w oba uszy, palcami albo pęsetą, bez siły;
   - na zewnątrz słupka kropla CA; nie zalewać uszu.
8. **Druty i orczyki powiek:**
   - „Z” wkładasz w uszko powieki (zagięcie górnej na +x, dolnej na −x), drugi koniec w otwór 25 przedłużenia;
   - powiekę zamykasz, serwo ustawiasz na wartość „zamknięte”, orczyk nasadzasz: górny 25° od pionu ku przodowi, dolny 35° od pionu w dół ku przodowi (dolny przechodzi przez szczelinę w płycie);
   - wkręt orczyka powieki górnej wkrętakiem z lewej, wzdłuż +x na y −9,5, z −95;
   - wkręt orczyka powieki dolnej wkrętakiem z prawej, wzdłuż −x na y −9,5, z −76: przez puste jeszcze miejsce serwa L–P, z zapasem ponad 10 mm.
9. **Serwo L–P:**
   - wkładasz z góry w gniazdo na wylot, ucha leżą na płycie, klej;
   - pręt L–P montujesz jak pręt G–D: otwór orczyka 17,5, orczyk ramieniem w −x, wkręt z góry (wzdłuż −y na x 31,5, z −66; nad nim nic nie ma).
10. **Test ruchu i kalibracja** na stole (ESP, strona w telefonie).
11. **W dyni:**
    - tubę z kołnierzem mocujesz od środka czterema wkrętami do drewna, maskownicę przyklejasz z zewnątrz (PRD);
    - moduł wkładasz przez wieczko, słupki z gałką wsuwasz w tubę od środka;
    - **ustawienie przed klejeniem:**
      - **Wzdłuż osi:** czoło słupków 2 mm za rantem tuby.
      - **Środek otworu:** szczelina gałka–tuba (8,15) ma być równa dookoła, przy powiekach zamkniętych też widać równy pierścień. Słupki stoją poziomo, a ich szczeliny przy tubie mają po 0,95 z obu stron i u góry, i u dołu.
      - Bez podparcia moduł opada w tubie do 4,8 mm, bo łuk R37,2 centruje tylko w x.
      - Jedna osoba trzyma płytę od środka dyni w tym położeniu, druga sprawdza pierścień od frontu.
    - **klejenie:** klej na gorąco w obu szczelinach słupek–tuba u góry i u dołu ramion, od tyłu tuby; trzymasz bez ruchu, aż klej zwiąże (ok. minuty). Potem dokładasz klej przy tylnym brzegu tuby. Ścianka tuby trzyma też druty osi przed wysunięciem;
    - opcjonalnie dla pewności położenia: paski papieru grubości ok. 0,9 mm wsunięte w szczeliny słupek–tuba na czas klejenia i wyjęte potem. To materiał pomocniczy, nie część.

## 6. Kontrola

- **Siatki:**
  - `sprawdz_siatki.js`: 0 błędów dla każdej części i pliku zbiorczego;
  - `skladowe_siatki.js`: 1 bryła na część, 9 brył w zbiorczym;
  - gałka ma po eksporcie 8 zdegenerowanych trójkątów z CGAL; usuwa je `napraw_siatki.js` w `eksport-v3.sh`.
- **Przemiatanie:** wynik w `przemiatanie-v3.txt`; metoda, wyłączenia i zakres w nagłówku skryptu.
  - **Pary nieruchome:** serwo–serwo, serwo–płyta, serwo–tuby, płyta–tuby.
  - **Pary ruchome:** gałka, obie powieki, płyta ze słupkami, tuby 30/40/50, piasta tylna kardana, 4 serwa w pełnej obwiedni (korpus, uszy, wieżyczka, wałek), 2 pręty i 2 druty z zakończeniami „Z”, 4 orczyki.
  - **Ruch:** gałka w siatce 15 × 11 położeń co 5°, z narożnikami; powieki 0 / 17 / 34 / 51,5° wobec gałki i prętów we wszystkich położeniach gałki, a wobec siebie i części nieruchomych co 8,6°.
  - **Wymóg:** 0,5, a na osi zawiasu 0,2 osiowo.
- **Czego przemiatanie nie obejmuje:**
  - kabli serw, poza przejściem G–D w płycie;
  - rzeczywistego kształtu orczyków i łbów ich wkrętów (orczyk to pas r 2,5 wokół ramienia);
  - widełek i krzyżaka kardana (tylko walce Ø11);
  - luzów przegubów i ugięcia drutów;
  - położeń między krokami siatki.
  - Minimum krawędź–krawędź siatek jest przybliżone do ok. 0,5–1 mm kroku podziału.
- **Styki zamierzone, bez kontroli luzu:**
  - drut w otworze własnego zaczepu i 2,5 mm odcinka przy zagięciu, które opiera się o płytkę zaczepu;
  - serwa stojące na płycie, sprawdzane na przenikanie po zmniejszeniu o 0,05.

## 7. Do sprawdzenia na wydruku

- Łby M5: pomiar rzeczywistego łba; gniazdo jest pod ISO 4762 Ø8,5 × 5 z 0,5 na klej.
- Szczyt kopułki gałki i powiek przy druku krawędzią w dół; podpory pod piastą i końcami języczków.
- Otwory osi Ø2,4 z drutem Ø2: luz na wydruku.
- Wyjście kabla posiadanego MG90S: przejście w płycie zakłada kabel z krótszej ściany przeciwnej do wałka, nisko przy spodzie (rysunek Miuzei, pewność niska).
- Uszy MG90S na całą szerokość korpusu [Z, rysunek Miuzei]; szczeliny uszu mają 2,4 × 12,9.
- Ustawienie modułu w tubie: równy pierścień wokół gałki przed związaniem kleju.

## 8. Otwarte: zaczepy „Z” na języczkach gałki (blokada przed drukiem)

Zakończenie „Z” w otworze to przegub jednoosiowy (obrót wokół osi otworu). Na języczku gałki pręt wychodzi jednak z płaszczyzny zaczepu, bo języczek obraca się razem z gałką także wokół drugiej osi kardana. Rachunek `duze_oko_v3_kinematyka.py`:

| Zaczep | Wychylenie drutu z płaszczyzny otworu |
|---|---|
| Języczek G–D (otwór wzdłuż x gałki) przy L–P ±35° | do 37,7° (40,9° w narożnikach) |
| Języczek L–P (otwór wzdłuż y gałki) przy G–D ±25° | do 26,8° |
| Orczyki serw (oba pręty) | do 5,9° |
| Uszka powiek (druty powiek) | do 2,9° |

Przemiatanie z rzeczywistym kształtem „Z”: odcinek główny pręta przechodzi przez własny języczek (−1,33 G–D przy ψ +35 / θ +25, −0,99 L–P przy ψ +25 / θ −25). Pręt się zakleszczy albo zegnie. Referencja działa przy ruchu ±10–20° i luźnych otworach. Przy celu PRD ±35° / ±25° „Z” na gałce nie wystarcza. Rozwiązanie wymaga decyzji, bo dotyka ustalenia 1 („końce w Z”) albo zakresu ruchu – zgłoszone do PM.
