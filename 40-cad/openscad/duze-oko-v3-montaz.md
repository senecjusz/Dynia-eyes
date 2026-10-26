# Duże oko v3: druk, montaż i kontrola (OpenSCAD, noc 25/26.10)

Model: `duze-oko-v3.scad` (parametry na górze). Eksport: `bash eksport-v3.sh <katalog STL>` → `40-cad/3mf/Duze oko v3/`. Przemiatanie: `blender -b -P ../narzedzia/duze-oko-v3-przemiatanie.py -- <katalog STL> <wynik.txt>`. Render: `bash render-v3.sh <katalog STL>` → `podglad/duze-oko-v3/`.

Podstawa: koncepcja `20-analizy/2026-10-26-duze-oko-koncepcja-referencja.md`, decyzja PM `20-analizy/review/2026-10-26-odstepstwa-koncepcji-decyzja-pm.md` i review zgodności v3 (`20-analizy/review/2026-10-26-zgodnosc-v3-{opus,astra}.md`).

Odstępstwa bez zgody obu recenzentów są zrobione zgodnie z wymaganiami:
- płyta pozioma za tubą;
- zaczepy powiek 34 / 31,5 od osi przy x = ±5;
- moduł wklejany w tubę na gorąco;
- trzy rzeczywiste tuby 30/40/50;
- jedna centralna piasta gałki.

Układ: 0 = środek kuli, z do przodu, y w górę, x w prawo patrząc od przodu. Źrenica (czarny środek) najwyżej Ø20, gałka 24 mm przed rantem tuby i czasza ok. 111° od przodu to decyzje użytkownika z 26.10 (P4, P5, czasza). Pytania P1–P5 są zamknięte.

## 1. Części do druku (każda ≤ 180 mm, 1 bryła, 0 błędów siatki)

| Plik 3MF | Szt. | Wymiar | Orientacja i podpory |
|---|---|---|---|
| `Plyta` | 1 | 84 × 109 × 26 (z ramionami i słupkiem) | Spód płyty na stole. **Podpory pod ramionami zawiasu i słupkiem kardana** w części przed płytą, wiszą 14–26 mm nad stołem. Płyty poziomej nie da się wydrukować bez nich, bo ramiona w tubie muszą leżeć przy osi (y ±5). Podpory malujesz w slicerze tylko tam |
| `Galka` | 1 | Ø60, krawędź tylna na z = −11 | Krawędzią na stole. **Podpory drzewiaste:** pod czołem piasty (z = +14, nad pustką), pod wewnętrznym końcem języczka L–P (7,2 mm wysięgu od podparcia 45°, 4 mm nad stołem) i pod spodem słupka zaczepu G–D (3 × 2 mm, 4 mm nad stołem). Słupek wisi na przedniej czaszy, ma nasadę ze skosem 45° od z = +4 i kończy się 1 mm pod otworem, bo niżej pracuje pręt. Podpory zdejmujesz przez otwór tylny |
| `Probka zaczepu galki` | 1 | 28 × 10 × 12 | **Drukujesz przed gałką** (zasada „najpierw próbka”), stopką na stole, płytka pionowo jak języczek w gałce. Oba otwory są pod drut Ø1,2. Otwór A: Ø2,2 × gardziel 0,8, jak w gałce (rachunek 39°). Otwór B: Ø2,3 × 0,6, do porównania, po stronie ściętego rogu (45°). Sprawdzasz: drut Ø1,2 z nogą „Z” przechyla się w otworze A o ≥ 34° w każdą stronę bez zacinania, a luz jest akceptowalny. Jeśli A się zacina, a B nie, zgłoś to: gałkę trzeba przestawić na B |
| `Powieka gorna` | 1 | R33,2–34,4 | Krawędzią tylną (z = −3) na stole, z brimem (pasek 1,2 mm). **Podpora pod uszkiem drutu:** uszko 2 × 2,7 mm zaczyna się 3,0 mm nad stołem i do 5,6 mm nie ma pod sobą nic. Nad wycięciem przy uszku jest mostek 10 mm. Ewentualnie podpora wewnątrz pod szczytem kopułki |
| `Powieka dolna` | 1 | R31,0–32,2 | jak górna, także podpora pod uszkiem drutu |
| `Przedluzenie orczyka (druk x2)` | 2 | 33 × 10 × 2,5 | płasko |
| `Tuba 30`, `Tuba 40`, `Tuba 50` | po 1 | Ø79,5 / Ø76,3, kołnierz Ø92 × 3, 4 łapy; wysokość 33 / 43 / 53 | Kołnierzem na stole. Drukujesz wszystkie trzy, przy składaniu wybierasz tę, która pasuje do ściany dyni |
| `Maskownica` | 1 | Ø84 / Ø76,3 × 2 | płasko |
| `Duze oko v3 - wszystkie czesci` | – | wszystkie powyższe jako osobne obiekty | Do rozłożenia na kilka stołów: obiekty zajmują ok. 233 × 399 mm |

Kolor: mechanizm pomarańczowy, gałka biała.

## 2. Części posiadane

| Co | Ilość | Gdzie |
|---|---|---|
| MG90S z orczykiem jednoramiennym i wkrętem | 4 | L–P, G–D, powieka górna, powieka dolna. **Otwory orczyków użyte przez druty rozwiercić do Ø1,6** (L–P 17,5, G–D 11,5; druty powiek wchodzą w drukowane przedłużenia). Fabryczny ok. Ø1,3 daje dla drutu Ø1,2 tylko 3,5° przechyłu, wymagane jest do 8° |
| Kardan 5/5 z 2 wkrętami M4 | 1 | środek gałki |
| Śruba M5 × 8, łeb walcowy imbusowy (ISO 4762, Ø8,5 × 5) | 2 | Trzpienie kardana, łby wklejone (gniazdo Ø9,5 × 5,2, 0,5 na klej). Wkręcenie w piastę: 6,3–6,55 przy otworze 7 |
| Drut sprężynowy Ø1,2 (Ø1,0 brak) | 4 odcinki, cięcie ok. 76 / 70 / 100 / 75 mm | pręty L–P i G–D, druty powiek górnej i dolnej; końce w „Z”: noga 4,0 przy gałce, 2,5 przy uszkach powiek, 1,75 przy orczykach |
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
| Rant tuby | z = +6 (gałka wystaje 24, zamknięte powieki 28,4 – decyzja użytkownika 26.10) |
| Krawędź czaszy | z = −11, czyli ok. 111° od przodu. Otwór zewnętrznie Ø55,8, w świetle samej czaszy Ø51,5; wspólne wolne światło z podparciem języczka L–P ok. Ø48. Przy −15 pręt L–P przechodził przez krawędź; przy −11,5 sztywny drut „Z” L–P miał 0,27 do krawędzi przy θ ±25. Ustalenie 3 dopuszcza płytszą czaszę, do ok. 10 mm za środkiem |
| Piasta gałki | Ø14 od przedniego bieguna do z = +14 |
| Zaczepy gałki | Oba otwory wzdłuż osi y gałki, na z = −4,5 i promieniu 15,5: L–P w języczku x = 15,5 (płytka w płaszczyźnie XZ, gr. 2), G–D w słupku y = 15,5 (płytka w płaszczyźnie XZ, 6,5 × 2, od z −7, czyli 1 mm pod otworem, do przedniej czaszy; od z = +4 nasada pogrubiona skosem 45° w ±y do grubości 14). Otwory dwustożkowe pod drut Ø1,2: gardziel w świetle Ø2,2 × 0,8, fazki 45° do obu ścian, wylot Ø3,4; mostek do końca języczka 1,0. Noga „Z” odsadzona 4,0: L–P w +y, G–D w −y (ku osi). Spód słupka G–D 1 mm pod wylotem fazki, narożniki ścięte 45° |
| Słupek kardana | Ø12, z −51 … −14,25 |
| Płyta | wierzch y = −15, grubość 5, z −49 … −105, x ±42; przód 2 mm za kołnierzem tuby 50 |
| Słupki zawiasu | x 34,7 … łuk R37,2 (0,95 do tuby na całej szerokości), y ±5, z do +4; oś na z = 0 |
| Powieki | luz 1,0 do gałki i między powiekami; uszy górnej x ±(33,2…34,4), dolnej ±(31,8…33,0); luz osiowy 0,2 ucho–ucho i 0,3 ucho–słupek |
| Otwory osi | uszy i słupki: światło Ø2,4 (wielokąt 32-boczny opisany na Ø2,4), drut Ø2 |
| Zaczepy drutów powiek | górna x = +5, 34,0 od osi zawiasu; dolna x = −5, 31,5 od osi; otwór Ø1,5 (drut Ø1,2) 1,6 nad płaszczyzną osi; otwór drutu w przedłużeniach orczyka też Ø1,5 |
| Wałki serw | L–P (33,0; 0; −66) pionowo · G–D (0; 2,3; −60) · powieka górna (·; −9,5; −95) · powieka dolna (·; −9,5; −76) |
| Odstęp serw L–P i powieki górnej | przód korpusu powieki górnej −88,75, tylne ucho L–P −87,8 (0,95) |
| Orczyki | L–P otwór 17,5, G–D 11,5, powieki 25 (przedłużenie na zewnętrznej stronie ramienia, otwór na x = ±1,75) |
| Długość prętów od zagięcia przy gałce do otworu orczyka | L–P 61,6; G–D 55,6; druty powiek 88,6 i 63,4 (między otworami) |
| Przejścia w płycie | szczelina orczyka powieki dolnej x −9,5…+1,5 (orczyk, przedłużenie, „Z”); kabel G–D x −33,7…−25,5 pod końcem korpusu |

## 4. Zakres ruchu (kinematyka `narzedzia/duze_oko_v3_kinematyka.py`)

| Oś | Zakres | Serwo | Uwagi |
|---|---|---|---|
| L–P | ±35° | +33,5° / −25,6° | przenoszenie ≥ 54° (rachunek 2D) |
| G–D | ±25° | +26,6° / −21,5° | przenoszenie ≥ 59° |
| Powieka górna | 0 → 51,5° | 25° → −45,8° (71°) | przenoszenie ≥ 50°; wyboczenie drutu Ø1,2 długości 88,6 przy 25,6 N wobec 8,6 N z serwa |
| Powieka dolna | 0 → 51,5° | 35° → −23,1° (58°) | przenoszenie ≥ 54° |

- **Przechył nogi „Z” w języczkach gałki:** wymagany 30,1° (L–P) i 29,6° (G–D), także w narożnikach, liczony co 1°. Dopuszczalny dla drutu Ø1,2 w otworze Ø2,2 × 0,8 wynosi 39,2° (warunek l·sinα + d ≤ D·cosα), czyli zapas 9,1°. Na orczykach sztywny drut wymaga do ok. 8°. Otwór orczyka rozwiercony do Ø1,6 przy ramieniu ok. 1,6 mm [Z] daje 13°; fabryczny ok. Ø1,3 tylko 3,5°.
- **Sprzężenie osi, do firmware'u:**
  - przy L–P ±35° serwo G–D musi dodać +4,4°, inaczej gałka pochyli się o ok. 3,5°;
  - przy G–D ±25° serwo L–P musi dodać +1,5°;
  - poprawka jest mała; można ją zignorować albo wpisać w kalibrację.
- **Źrenica najwyżej Ø20 (decyzja użytkownika 26.10):** przy spojrzeniu +25° jej krawędź jest na 44,5°, a otwarta powieka na 51,5°, czyli zapas 7°. W samych narożnikach (±35° i ±25° naraz) krawędź źrenicy chowa się ok. 1° pod powieką; PRD dopuszcza mniejszy zakres w narożnikach.

## 5. Kolejność montażu (na stole; tylko krok 10 w dyni)

Narzędzia: klucz imbusowy 2 mm (wkręty M4 kardana), wkrętak PH1 (wkręty orczyków), kombinerki (drut), pęseta. Światło otworu tylnego gałki to ok. Ø48 przy podparciu języczka L–P, a po stronie −x (droga klucza) Ø51,5.

1. **Łby M5 × 8:** wklej epoksydem w gniazdo na czole słupka kardana (trzpień do przodu) i w gniazdo piasty gałki (trzpień do tyłu). Gałkę kładziesz otworem do góry, a śrubę wkładasz palcami albo pęsetą.
2. **Orczyki i przedłużenia:** otwory orczyków L–P (17,5) i G–D (11,5), w które wchodzą pręty, rozwierć do Ø1,6; druty powiek wchodzą w drukowany otwór Ø1,5 przedłużenia. Przedłużenia przyklej CA na zewnętrzną stronę ramion dwóch orczyków. Otwór Ø7 obejmuje piastę, a otwór 25 przedłużenia ma leżeć na przedłużeniu osi ramienia. Odstaw do związania.
3. **Serwa G–D, powieki górnej i powieki dolnej:**
   - każde stawiasz na płycie: dolne ucho w szczelinie, wieżyczki powiek nad wnękami 1 mm;
   - kabel G–D przeprowadzasz w dół przez przejście w płycie przy x ≈ −30, zanim serwo stanie;
   - klej na gorąco; serwo powieki górnej kleisz tylko od tyłu i z boków. Przód jego korpusu i płyta przed nim (z −88,75…−87,8) zostają czyste, bo tam ląduje tylne ucho L–P (0,95 luzu); L–P przymierzasz na sucho.

   Serwa L–P jeszcze nie wkładasz: jego gniazdo zostaje wolne, a z nim droga wkrętaka w krokach 6 i 8.
4. **Kardan na słupek:** piasta tylna na trzpień słupka, wkręt dociskowy M4 do góry. Dokręcasz imbusem 2 z góry; gałki jeszcze nie ma, wszystko otwarte.
5. **Gałka na kardan:**
   - wsuwasz gałkę od przodu, trzpień gałki wchodzi w piastę przednią;
   - wkręt M4 piasty przedniej patrzy w −x (sworzeń piasty poziomo);
   - dokręcasz go imbusem 2: krótkie ramię promieniowo, długie wychodzi do tyłu przez otwór tylny na x ≈ −18;
   - po tej stronie nie ma języczków, a ramię zawiasu jest na x = −35;
   - klucz przekładasz co ok. 60°.
6. **Pręt G–D:**
   - pręt G–D gniesz z zagięciami w płaszczyznach prostopadłych: noga przy gałce wzdłuż y gałki (otwór słupka), noga przy orczyku wzdłuż x (otwór orczyka);
   - „Z” wkładasz kombinerkami w otwór słupka G–D przez otwór tylny; noga 4,0 od strony osi (−y), pręt biegnie pod słupkiem;
   - drugi koniec do otworu 11,5 zdjętego orczyka;
   - serwo ustawiasz na 1500 µs, orczyk nasadzasz ramieniem do góry;
   - wkręt orczyka wkrętakiem z prawej, wzdłuż −x na y 2,3, z −60. Droga jest wolna do x +60, bo gniazdo L–P jest jeszcze puste.
7. **Powieki:**
   - najpierw dolna, potem górna; uszy wsuwasz od przodu między słupki (0,3 luzu na stronę);
   - drut Ø2 × 5,6 wsuwasz od zewnątrz przez luźny otwór słupka w oba uszy, palcami albo pęsetą, bez siły;
   - na zewnątrz słupka kropla CA; nie zalewać uszu.
8. **Druty i orczyki powiek:**
   - „Z” wkładasz w uszko powieki (noga 2,5; zagięcie górnej na +x, dolnej na −x), drugi koniec w otwór 25 przedłużenia;
   - powiekę zamykasz, serwo ustawiasz na wartość „zamknięte”, orczyk nasadzasz: górny 25° od pionu ku przodowi, dolny 35° od pionu w dół ku przodowi (dolny przechodzi przez szczelinę w płycie);
   - wkręt orczyka powieki górnej wkrętakiem z lewej, wzdłuż +x na y −9,5, z −95;
   - wkręt orczyka powieki dolnej wkrętakiem z prawej, wzdłuż −x na y −9,5, z −76: przez puste jeszcze miejsce serwa L–P, z zapasem ponad 10 mm.
9. **Serwo L–P:**
   - wkładasz z góry w gniazdo na wylot, ucha leżą na płycie, klej;
   - pręt L–P montujesz jak pręt G–D: noga „Z” 4,0 w języczku L–P od strony +y, otwór orczyka 17,5, orczyk ramieniem w −x, wkręt z góry (wzdłuż −y na x 33,0, z −66; nad nim nic nie ma).
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
  - `skladowe_siatki.js`: 1 bryła na część, 10 brył w zbiorczym (razem z próbką zaczepu);
  - gałka ma po eksporcie 8 zdegenerowanych trójkątów z CGAL; usuwa je `napraw_siatki.js` w `eksport-v3.sh`.
- **Przemiatanie:** wynik w `przemiatanie-v3.txt`; metoda, wyłączenia i zakres w nagłówku skryptu.
  - **Pary nieruchome:** serwo–serwo, serwo–płyta, serwo–tuby, płyta–tuby.
  - **Pary ruchome:** gałka, obie powieki, płyta ze słupkami, tuby 30/40/50, piasta tylna kardana, 4 serwa w pełnej obwiedni (korpus, uszy, wieżyczka, wałek), 2 pręty i 2 druty jako łamane z nogami „Z” sztywnymi wzdłuż osi otworów, 4 orczyki.
- **Sztywny drut „Z”:** `narzedzia/duze-oko-v3-z-sztywne.py` → `z-sztywne-v3.txt`. Pręty gałki liczone jako jeden sztywny drut o stałej długości i stałych zagięciach 90°, ze stałym skrętem nóg (L–P równoległe, G–D prostopadłe). Noga przechyla się w otworze, a drut obraca się wokół odcinka głównego tak, by przechył był najmniejszy. Kąt orczyka wynika ze stałej długości. Wyniki są w §8.
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
- **Najpierw próbka zaczepu** (`Probka zaczepu galki`): przechył i luz drutu w otworze A, porównanie z B; martwy ruch gałki od luzu w otworze (szacunek 4–5°) do zmierzenia.
- **Słupek G–D na gałce:**
  - obejrzeć, czy wydrukował się prosto;
  - ręką sprawdzić jego ugięcie przy pręcie;
  - w programie nie dociskać serwa G–D do krańca.
  - Przy zablokowanym serwie (ok. 19 N) naprężenie przy nasadzie szacuję na ok. 19 MPa, wobec 59 bez nasady (Opus).
- Szczyt kopułki gałki i powiek przy druku krawędzią w dół; podpory pod piastą i końcem języczka L–P.
- Otwory osi Ø2,4 z drutem Ø2: luz na wydruku.
- Wyjście kabla posiadanego MG90S: przejście w płycie zakłada kabel z krótszej ściany przeciwnej do wałka, nisko przy spodzie (rysunek Miuzei, pewność niska).
- Uszy MG90S na całą szerokość korpusu [Z, rysunek Miuzei]; szczeliny uszu mają 2,4 × 12,9.
- Ustawienie modułu w tubie: równy pierścień wokół gałki przed związaniem kleju.

## 8. Zaczepy „Z” na gałce (rozwiązane geometrią, decyzja PM 26.10)

Recenzenci odrzucili oczko jako dodatek, więc zostaje „Z” zgodnie z ustaleniem 1. Wcześniej otwór G–D szedł wzdłuż x gałki, a otwór Ø1,3 w języczku gr. 2,5 pozwalał drutowi przechylić się tylko o ok. 7°. Wymagane było do 40,9°. Zmiany:
- otwór G–D obrócony na oś y gałki, równolegle do L–P: wahanie L–P staje się obrotem wokół osi otworu, który „Z” przenosi swobodnie;
- otwory dwustożkowe z fazkami 45°: Ø2,0 × 1,0 dla drutu Ø1,0, po zmianie na drut Ø1,2 (użytkownik 26.10) Ø2,2 × 0,8;
- noga „Z” odsadzona 4,0;
- słupek G–D kończy się 1 mm pod otworem, z narożnikami ściętymi pod 45°;
- zaczep na r 15,5, dzięki czemu mostek ma 1,0 mm.

Rachunek kąta (`duze_oko_v3_kinematyka.py`) daje wymagane 30,1° wobec dopuszczalnych 39,2° (drut Ø1,2).

**Sztywny drut** (`z-sztywne-v3.txt`, uwaga Astry W3): pręt jako jeden drut o stałej długości i stałych zagięciach, przechylany w otworach, z nogą przy własnym otworze.

| Pręt | Przechył przy gałce | Przechył przy orczyku | Luz do gałki | Luz do płyty | Luz do piasty tylnej |
|---|---|---|---|---|---|
| L–P | 28,9° | 7,2° | 0,54 | 3,76 | 4,02 |
| G–D | 28,8° | 9,2° | 0,69 | 1,78 | 2,05 |

Drut Ø1,2. Dopuszczalne: 39,2° przy gałce (Ø2,2 × 0,8) i 13,0° przy orczyku rozwierconym do Ø1,6 (ramię ok. 1,6 [Z]). Żadne z 165 położeń nie ma luzu do gałki poniżej 0,5. Przemiatanie łamanych z drutem Ø1,2 (`przemiatanie-v3.txt`): 0 par poniżej wymogu ze 139; pręty do gałki 0,64 i 0,77, druty powiek do własnej powieki 0,77 i 0,81.

Model nie obejmuje sprężystości drutu, rozrzutu kąta gięcia i luzu w otworze orczyka. To rozstrzyga **próbka zaczepu**: przechył ≥ 33° bez zacinania i martwy ruch.

