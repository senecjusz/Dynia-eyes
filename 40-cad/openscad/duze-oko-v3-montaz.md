# Duże oko v3: druk, montaż i kontrola (OpenSCAD, noc 25/26.10)

Model: `duze-oko-v3.scad` (parametry na górze). Eksport: `bash eksport-v3.sh <katalog STL>` → `40-cad/3mf/Duze oko v3/`. Przemiatanie: `blender -b -P ../narzedzia/duze-oko-v3-przemiatanie.py -- <katalog STL> <wynik.txt>`. Render: `bash render-v3.sh <katalog STL>` → `podglad/duze-oko-v3/`.

Podstawa: koncepcja `20-analizy/2026-10-26-duze-oko-koncepcja-referencja.md` i decyzja PM `20-analizy/review/2026-10-26-odstepstwa-koncepcji-decyzja-pm.md`. Odstępstwa bez zgody obu recenzentów są zrobione zgodnie z wymaganiami:
- płyta pozioma za tubą;
- zaczepy powiek ok. 34 / 31,5 przy x = ±5;
- moduł wklejany w tubę na gorąco;
- trzy rzeczywiste tuby 30/40/50;
- jedna centralna piasta gałki.

Układ: 0 = środek kuli, z do przodu, y w górę, x w prawo patrząc od przodu. **[Z]** = założenie na rano: P4 (źrenica Ø20) i P5 (gałka 24 mm przed rantem).

## 1. Części do druku (każda ≤ 180 mm, 1 bryła, 0 błędów siatki)

| Plik 3MF | Szt. | Wymiar | Orientacja i podpory |
|---|---|---|---|
| `Plyta` | 1 | 84 × 101 × 26 (z ramionami i słupkiem) | spód płyty na stole. **Podpory pod ramionami zawiasu i słupkiem kardana** w części przed płytą (wiszą 15–26 mm nad stołem): płyty poziomej nie da się wydrukować bez nich, bo ramiona w tubie muszą leżeć przy osi (y ±5). Podpory tylko tam (malowane w slicerze) |
| `Galka` | 1 | Ø60, krawędź tylna na z = −12 | krawędzią na stole. **Podpora drzewiasta tylko pod piastą** (czoło na z = +14 zaczyna się nad pustką), przez otwór tylny Ø50,6; języczki mają własne podparcie 45° |
| `Powieka gorna` | 1 | R33,2–34,4 | krawędzią tylną (z = −3) na stole; mostek 8 mm nad wycięciem przy uszku drutu; ewentualnie podpora wewnątrz pod szczytem (szczyt kopułki) |
| `Powieka dolna` | 1 | R31,0–32,2 | jak górna |
| `Przedluzenie orczyka (druk x2)` | 2 | 33 × 10 × 2,5 | płasko |
| `Tuba 30`, `Tuba 40`, `Tuba 50` | po 1 | Ø79,5 / Ø76,3, kołnierz Ø92 × 3, 4 łapy; wysokość 33 / 43 / 53 | kołnierzem na stole; drukujesz wszystkie trzy, przy składaniu wybierasz tę, która pasuje do ściany dyni |
| `Maskownica` | 1 | Ø84 / Ø76,3 × 2 | płasko |
| `Duze oko v3 - wszystkie czesci` | – | wszystkie powyższe jako osobne obiekty | – |

Kolor: mechanizm pomarańczowy, gałka biała.

## 2. Części posiadane

| Co | Ilość | Gdzie |
|---|---|---|
| MG90S z orczykiem jednoramiennym i wkrętem | 4 | L–P, G–D, powieka górna, powieka dolna |
| Kardan 5/5 z 2 wkrętami M4 | 1 | środek gałki |
| Śruba M5 × 8, łeb walcowy imbusowy (ISO 4762, Ø8,5 × 5) | 2 | trzpienie kardana, łby wklejone (gniazdo Ø9,5 × 5,2, 0,5 na klej) |
| Drut sprężynowy Ø1,0 | 4 odcinki, cięcie ok. 72 / 66 / 93 / 74 mm | pręty L–P i G–D, druty powiek; końce w „Z” (odsadzenie 1,75) |
| Drut Ø2,0 | 2 × 5,6 mm | osie powiek, wciśnięte w słupki (otwór Ø1,9) i zabezpieczone klejem |
| Wkręty do drewna 4 × 30–40 | 4 | łapy kołnierza (PRD) |
| Klej: epoksyd albo CA; klej na gorąco | – | łby M5, przedłużenia orczyków, serwa w gniazdach, moduł w tubie |

**Śruby razem:**
- 2 × M5 × 8;
- elementy, które przychodzą z kardanem i serwami: 2 × M4 kardana i 4 wkręty orczyków;
- 4 wkręty do drewna z PRD.

Żadnych M3.

## 3. Najważniejsze wymiary

| Co | Wartość |
|---|---|
| Rant tuby | z = +6 (gałka wystaje 24 [Z], zamknięte powieki 28,4) |
| Krawędź czaszy | z = −12 (ok. 114° od przodu, otwór wewnątrz Ø50,6). Przy −15 pręt L–P przechodził przez krawędź (rachunek 3D, także narożniki). Ustalenie 3 dopuszcza płytszą czaszę |
| Piasta gałki | Ø14 od przedniego bieguna do z = +14; trzpień M5 wchodzi w piastę kardana na 6,55 (otwór 7) |
| Zaczepy gałki | języczki z = −4,5, otwór Ø1,3 na r = 14: L–P x = +14 (płytka w płaszczyźnie XZ), G–D y = +14 (płytka w YZ) |
| Słupek kardana | Ø12, z −51 … −14,25, trzpień wchodzi 6,5 |
| Płyta | wierzch y = −15, grubość 5, z −49 … −97, x ±42; przód 2 mm za kołnierzem tuby 50 |
| Słupki zawiasu | x 34,7 … łuk R37,2 (0,95 do tuby na całej szerokości), y ±5, z do +4; oś na z = 0 |
| Powieki | luz 1,0 do gałki i między powiekami; uszy górnej x ±(33,2…34,4), dolnej ±(31,8…33,0), otwór Ø2,4; luz osiowy 0,2 ucho–ucho i 0,3 ucho–słupek |
| Zaczepy drutów powiek | górna x = +5, 34,0 od osi zawiasu; dolna x = −5, 31,5 od osi; otwór 1,6 nad płaszczyzną osi |
| Wałki serw | L–P (31,5; 0; −66) pionowo · G–D (0; 2,3; −60) · powieka górna (·; −9,5; −87) · powieka dolna (·; −9,5; −76) |
| Orczyki | L–P otwór 17,5, G–D 11,5, powieki 25 (przedłużenie) |
| Długość prętów między osiami otworów | L–P 61,5; G–D 55,5; powieka górna 82,5; dolna 63,3 |

## 4. Zakres ruchu (kinematyka `narzedzia/duze_oko_v3_kinematyka.py`)

| Oś | Zakres | Serwo | Uwagi |
|---|---|---|---|
| L–P | ±35° | +30,5° / −23,1° | przenoszenie ≥ 58° (rachunek 2D) |
| G–D | ±25° | +33,8° / −28,4° | przenoszenie ≥ 54° |
| Powieka górna | 0 → 51,5° | 20° → −51,2° (71°) | przenoszenie ≥ 50° |
| Powieka dolna | 0 → 51,5° | 35° → −23,1° (58°) | przenoszenie ≥ 54° |

- **Sprzężenie osi, do firmware'u:**
  - przy L–P ±35° serwo G–D musi dodać +4,4°, inaczej gałka pochyli się o ok. 3,5°;
  - przy G–D ±25° serwo L–P musi dodać +1,5°;
  - poprawka jest mała i liniowa w kwadracie kąta; można ją zignorować albo wpisać w kalibrację.
- **Źrenica Ø20 [Z]:** przy spojrzeniu +25° jej krawędź jest na 44,5°, a otwarta powieka na 51,5°, czyli zapas 7°.

## 5. Kolejność montażu (na stole; tylko krok 10 w dyni)

Wymiary otworów i dróg narzędzi: otwór tylny gałki Ø50,6 (światło), klucz imbusowy 2 mm (wkręty M4 kardana), wkrętak PH1 (wkręty orczyków).

1. **Łby M5 × 8:** wklej epoksydem w gniazdo na czole słupka kardana (trzpień do przodu) i w gniazdo piasty gałki (trzpień do tyłu). Gałkę kładziesz otworem do góry, a śrubę wkładasz palcami albo pęsetą.
2. **Serwa G–D, powieki górnej i powieki dolnej:** każde stawiasz na płycie, dolne ucho w szczelinie, wieżyczka powiek nad wnęką 1 mm. Klej na gorąco. Serwa L–P jeszcze nie wkładasz.
3. **Kardan na słupek:** piasta tylna na trzpień słupka, wkręt dociskowy M4 do góry. Dokręcasz imbusem 2 z góry; gałki jeszcze nie ma, wszystko otwarte.
4. **Gałka na kardan:**
   - wsuwasz gałkę od przodu, trzpień gałki wchodzi w piastę przednią;
   - wkręt M4 piasty przedniej patrzy w −x (sworzeń piasty poziomo);
   - dokręcasz go imbusem 2: krótkie ramię promieniowo, długie wychodzi do tyłu przez otwór tylny Ø50,6 na x ≈ −18;
   - po tej stronie nie ma języczków, a ramię zawiasu jest na x = −35.

   *Ten krok zastępuje przechylenie gałki o 70–90°, które Astra wykazała jako niewykonalne.*
5. **Pręt G–D:**
   - „Z” wkładasz kombinerkami w języczek G–D przez otwór tylny, zagięcie po stronie −x;
   - drugi koniec do otworu 11,5 zdjętego orczyka;
   - serwo ustawiasz na 1500 µs, orczyk nasadzasz ramieniem do góry;
   - wkręt orczyka wkrętakiem z prawej, wzdłuż −x; serwo L–P jeszcze nie przeszkadza.
6. **Serwo L–P:** wkładasz z góry w gniazdo na wylot, ucha leżą na płycie, klej. Pręt L–P montujesz jak pręt G–D: otwór orczyka 17,5, orczyk ramieniem w −x, wkręt z góry.
7. **Powieki:**
   - najpierw dolna, potem górna; uszy wsuwasz od przodu między słupki (0,3 luzu na stronę);
   - drut Ø2 × 5,6 wciskasz od zewnątrz przez słupek w oba uszy, kombinerkami;
   - na zewnątrz kropla CA.
8. **Druty powiek:**
   - przedłużenia 25 przyklejasz CA na ramiona orczyków; kołki z drutu Ø1,0 w otworach 5,5 i 17,5 ustawiają przedłużenie;
   - „Z” wkładasz w uszko powieki (zagięcie górnej na +x, dolnej na −x), drugi koniec w otwór 25 przedłużenia;
   - orczyk nasadzasz przy zamkniętej powiece: górna 20° od pionu ku przodowi, dolna 35°;
   - wkręt orczyka powieki górnej z lewej, dolnej z prawej; orczyk dolnej przechodzi przez szczelinę w płycie.
9. **Test ruchu i kalibracja** na stole (ESP, strona w telefonie).
10. **W dyni:**
    - tubę z kołnierzem mocujesz od środka czterema wkrętami do drewna, maskownicę przyklejasz z zewnątrz (PRD);
    - moduł wkładasz przez wieczko, słupki z gałką wsuwasz w tubę od środka;
    - ustawienie: czoło słupków 2 mm za rantem tuby (gałka 24 przed rantem);
    - klej na gorąco w szczelinach słupek–tuba (0,95) od tyłu tuby; ścianka tuby trzyma też druty osi przed wysunięciem.

## 6. Kontrola

- **Siatki:** `sprawdz_siatki.js` daje 0 błędów dla każdej części i pliku zbiorczego. `skladowe_siatki.js` daje 1 bryłę na część i 9 brył w zbiorczym. Gałka ma po eksporcie 8 zdegenerowanych trójkątów z CGAL; usuwa je `napraw_siatki.js` w `eksport-v3.sh`.
- **Przemiatanie:** wynik w `przemiatanie-v3.txt`, opis metody w nagłówku skryptu. Przeszukane są wszystkie pary ruchome i nieruchome: gałka, powieki, płyta ze słupkami, tuba 50, piasta tylna kardana, korpusy serw, 2 pręty, 2 druty i 4 orczyki.
  - Ruch: gałka w siatce 15 × 11 położeń co 5°, z narożnikami; powieki 0–51,5°.
  - Wymóg: 0,5, a na osi zawiasu 0,2 osiowo.
- **Styki zamierzone, bez kontroli:** drut z „Z” leży obok własnego języczka albo uszka (odsadzenie 1,75); serwa stoją na płycie.

## 7. Do sprawdzenia na wydruku

- Łby M5: pomiar rzeczywistego łba; gniazdo jest pod ISO 4762 Ø8,5 × 5 z 0,5 na klej.
- Szczyt kopułki gałki i powiek przy druku krawędzią w dół (Bambu zwykle drukuje R30 ze ścianką 2 bez podpór, ostatni ok. 1 mm z lekkim zwisem).
- Wcisk drutu Ø2 w otwór Ø1,9 słupka.
- Uszy MG90S na całą szerokość korpusu [Z, rysunek Miuzei]; szczeliny uszu mają 2,4 × 12,9.
