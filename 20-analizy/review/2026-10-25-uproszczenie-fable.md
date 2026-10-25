# Uproszczenie mechanizmu dużego oka – analiza Fable

25.10.2026, analityk Fable, tylko odczyt. Brief: `2026-10-25-uproszczenie-mechanizmu-brief.md`. Nie czytałem raportów Opusa ani Astry z tej rundy.
Oznaczenia: **[F]** fakt (z pliku, strony albo zdjęcia), **[O]** obliczenie, **[Z]** założenie.

## Streszczenie

Referencja The Face maker101 to otwarta rama w kształcie U na płaskiej płycie: gałka siedzi na drukowanym przegubie krzyżowym na słupku, serwa stoją za nią na tej samej płycie, pręty to spinacze w luźnych otworach, a każde oko ma **jedną** powiekę (górną) zawieszoną na ramionach tej ramy. Nie ma tam tuby, dolnej powieki ani sprzężenia dwóch powiek na jednym serwie; „dwie powieki” z opisu to po jednej na oko. Nasz model dodał do tego: tubę w otworze z kołnierzem, 3 ramiona, maskownicę, osie powiek w podkładkach tuby, rowek T z podłogą i okno w słupku, widełki z oczkami i sworzniami w gałce, dwie powieki na jednym serwie, druty z Z, V i koszulkami, próbkę i przyrząd.

Kaskada bierze się z jednej liczby: gałka Ø60 w otworze Ø80 zostawia **10 mm** promieniowo, a tuba (1,6 + 0,5 luzu) i stos osi powiek (8,1 mm) zjadają z tego wszystko. Stąd dźwignia powieki **r 7** (1 mm drutu = **8,2°** powieki) i stąd cała walka o ±2 mm na drutach; przy dwóch powiekach na jednym serwie kalibracja ESP32 tego nie naprawi. Drugi łańcuch: kardan w środku kuli plus „nic nie widać” dały rowek T, okno słupka, podporę pod stożkiem i widełki w gałce.

Rekomendacja: **rama U bez tuby** (jedna drukowana rama = płyta serw + słupek kardana + dwa słupki osi powiek + łapy), płaski pierścień z przodu zamiast tuby i maskownicy, **dźwignia powieki jako przedłużenie czaszy** (ramię ok. 24 mm → **2,4°/mm**), pręty gałki na posiadanych kardanach 2/2 z drutu Ø2 (długość ustawia wkręt piasty, zero ustawia ESP32), kardan 5/5 na studzie M5 wkręconym w bossę gałki zamiast rowka T. Jeśli użytkownik przyjmie zatwierdzony z góry wariant B (dolna powieka nieruchoma), znika jedyna para, której nie da się skalibrować programowo; wariant A da się zbudować tak, żeby w razie potrzeby zdegradował się do B jedną śrubą.

## Słownik

| Termin | Znaczenie |
|---|---|
| gałka | kula oka Ø60 |
| kardan 5/5 | metalowy przegub krzyżowy z warsztatu, Ø11 × 25,5, otwory Ø5, wkręty M4 |
| kardan 2/2 | mniejszy przegub z warsztatu, Ø9 × 23,5, otwory Ø2, wkręty M3 |
| S1, S2, S3 | serwa MG90S: lewo–prawo, góra–dół, powieki |
| orczyk | ramię na wałku serwa |
| tuba / Pierścień | rura Ø79 w otworze dyni z kołnierzem i łapami (część `Pierscien` w modelu) |
| rowek T | rowek w gałce, w który wsuwa się łeb śruby M5 czopa kardana |
| widełki, oczko, sworzeń | ucho w gałce (dwa policzki), na drucie zwinięte kółko, kawałek drutu jako oś |
| Z, V, koszulka | zagięcie końca drutu, przegięcie do regulacji długości, kawałek izolacji blokujący drut |
| rama U | płyta z dwoma słupkami po bokach gałki (jak w referencji) |
| stud | śruba z odciętym łbem albo gwintowany kołek |

## 1. Inwentarz

Referencja [F]: strona PCBWay i zdjęcia na niej (5 × MG90S na dwoje oczu, „paperclip wires”, `joint_v1.stl`, `center-joint_v1.stl`, `eye_holder_main.stl`, `eyelid.stl` × 2 na dwoje oczu, `bars_v1.stl`, montaż uchwytu na klej na gorąco). Na zdjęciach: płaska płyta, dwa widełkowe uchwyty U, gałka na przegubie między ramionami U, po jednej górnej powiece na oko, serwa stojące za gałkami, serwo powiek w środkowym słupku. Średnica gałki nie jest podana; ze zdjęcia w dłoni **ok. 40 mm [Z]**.

| # | Element | W referencji | Wymaga PRD | Ocena |
|---|---|---|---|---|
| 1 | Kardan 5/5 w środku gałki | tak (drukowany przegub krzyżowy) | tak (zasada: kardan, nieruchome serwa, pręty) | potrzebny |
| 2 | Słupek pod tylną piastę | tak | tak | potrzebny |
| 3 | **Rowek T, podłoga 5,5, stożek, podpora drzewiasta w gałce** | nie | nie | dodatek: wynik „łeb M5 musi wejść bokiem”. Blokada obrotu gałki tylko tarciem (raport nocny). Znika przy studzie M5 wkręconym w bossę (p. 4) |
| 4 | **Okno łba M5 × 16 w słupku** | nie | nie | dodatek z tego samego powodu; znika przy studzie |
| 5 | **Tuba Ø79 w otworze** | nie | **tak** (PRD 4: „tuba w otworze, kołnierz z łapami”, decyzja użytkownika 24.10) | wymóg, ale pierwotnym celem było mocowanie od środka i zakrycie krawędzi. Tuba nie trzyma oka (oko trzyma słupek). Zjada 2,1 mm z 10 mm promieniowo |
| 6 | Kołnierz z 3 łapami, wkręty do drewna | nie (klej na gorąco) | tak | potrzebny: nasz zamiennik kleju |
| 7 | **3 ramiona Pierścień–Uchwyt + 3 × M3** | nie | nie | dodatek: skutek podziału na dwie części (tuba osobno, uchwyt serw osobno), bo długość tuby zależy od ścianki. Przy jednej ramie drukowanej po pomiarze ścianki – zbędne |
| 8 | **Maskownica Ø84/Ø79 na wcisk** | nie | tak („maskownica krawędzi otworu ≤ 2 mm”) | wymóg; ale jako płaski pierścień przykręcony do skórki może zastąpić tubę (zakrywa krawędź i szczelinę Ø69–Ø80) |
| 9 | **Podkładki osi powiek w tubie, ślepe otwory M2** | nie (powieka na ramionach U) | nie | dodatek wymuszony przez tubę: 7,9 mm między gałką a wnętrzem tuby, stos osi 8,1 mm [O: 0,5 + 1,6 + 0,2 + 1,5 + 0,2 + 1,5 + 0,2 + 2,4] – otwór wchodzi w ściankę tuby |
| 10 | Osie powiek M2 × 6 bez nakrętki | nie (spinacz / kołek) | nie (zasada repo: M3 z nakrętką) | dodatek z braku miejsca (M3 się nie mieści – raport nocny). Bez tuby jest 10 mm i M3 wchodzi |
| 11 | Powieki jako czasze kuliste współśrodkowe z gałką | tak (górna) | tak (górna i dolna) | potrzebne; czasza dolna to wymóg PRD, nie referencji |
| 12 | **Dolna powieka ruchoma, obie na jednym serwie** | **nie** (jedna powieka na oko) | wariant A; **B zatwierdzony z góry 24.10** | to jedyne połączenie, którego kalibracja ESP32 nie naprawi; źródło całej precyzji drutów |
| 13 | **Dźwignie powiek r 7 przy osi** | nie (spinacz do krawędzi powieki) | nie | dodatek wymuszony: w tubie dźwignia w kierunku ±y mieści się do r ≈ 14 [O: √(37,9² − 34²)]; wybrano 7 ze względu na drut i ogon Z. Daje 8,2°/mm |
| 14 | Kieszeń w czaszy górnej, koszulki, noga L 3,5 mm | nie | nie | łaty na skutek 13 |
| 15 | V w drutach powiek, gięcie w parze | nie | nie | łaty na skutek 12 + 13 |
| 16 | **Widełki S1/S2 w gałce, oczka, sworznie, mostek S2, podpory pod policzkami** | nie (spinacz w otworze gałki) | nie | dodatek: skutek wymagania przechyłu ±38° w dwóch osiach bez luzu. Referencja ma ten sam problem i rozwiązuje go luzem spinacza. Decyzja 23.10 dopuszcza pręty na kardanach 2/2 – niewykorzystana |
| 17 | Z przy orczykach S1/S2 | tak (spinacz) | tak (drut dopuszczony) | potrzebne |
| 18 | Próbka drutu, przyrząd do gięcia | nie | nie | narzędzia do walki ze skutkami 12–16 |
| 19 | Uchwyt serw z ramkami pod 3 MG90S | tak (eye_holder) | tak | potrzebny; może być jedną częścią z ramą |
| 20 | Solver kinematyki, przemiatanie kolizji | – | zasada repo | zostają jako narzędzia |

Z 20 pozycji **9 (3, 4, 7, 9, 10, 13, 14, 15, 16, 18) to łaty na skutki trzech decyzji**: tuba (5), dwie powieki na jednym serwie (12) i łeb M5 w gałce (3).

## 2. Referencja: co robi i co wziąć wprost

[F] The Face maker101:
- **Gałka:** na drukowanym przegubie krzyżowym (`joint_v1` + `center-joint_v1`) osadzonym na słupku między ramionami U. Środek obrotu = środek gałki. Nic nie zasłania gałki od boków – jest otwarta.
- **Serwa:** 2 na oko, stoją pionowo za gałką na płaskiej płycie (`eye_holder_main`), wałki do góry. Pręty = spinacze gięte kombinerkami, zagięcia w luźnych otworach gałki i orczyka. Zero ustawia się „serwa na 90°” przed montażem, czyli programowo.
- **Powieka:** jedna górna czasza na oko, zawieszona na ramionach U (oś przez środek gałki), ciągnięta spinaczem przez jedno serwo (jedno na oboje oczu). Dolnej powieki nie ma – zakrywa ją maska.
- **Mocowanie:** dwie listwy przyklejone do maski, uchwyt serw przyklejony do listew.

Will Cogley V2 Simplified [F z `whitepaper.md` i opisów]: gałka na pionowej osi w widełkach, cała podstawa z serwem kołysze się na dwóch śrubach M3 (druga oś), sztywne drukowane popychacze, powieki na osobnych serwach. Kołyska dla nas odpada: osie pionowe przez bieguny gałki wypadają tam, gdzie są czasze powiek.

Co przenieść wprost:
1. **Otwarta rama U zamiast tuby.** Oś powiek na ramionach ramy, gałka na słupku tej samej ramy.
2. **Jedna płyta na wszystko:** słupek kardana, słupki powiek, okna serw, łapy.
3. **Zero programowe** – to w referencji zastępuje każdą precyzję długości prętów.
4. **Powieka ciągnięta za krawędź czaszy**, nie za krótką dźwignię przy osi (patrz p. 4).

Czego nie da się przenieść: jedna powieka na oko (PRD wymaga dolnej czaszy; może być nieruchoma = wariant B) i klej na gorąco (zasada repo: wkręty).

## 3. Łańcuch przyczyn

**Łańcuch 1 (miejsce):** otwornica Ø80 → gałka Ø60 (PRD) → pierścień wolnego miejsca **10 mm** na promieniu [O: 40 − 30] → moduł od środka z tubą w otworze (24.10) → tuba 1,6 + luz 0,5 = **2,1 mm** → zostaje 7,9 mm → stos osi powiek 8,1 mm nie mieści się → M2 zamiast M3, ślepe otwory w podkładkach, luzy 0,18–0,20 → dźwignie powiek r 7 w kierunku ±y (większe trafiają w tubę albo w drut) → **8,2°/mm** [O: 1/7 rad] → wymaganie ±0,25 mm na drucie przy tolerancji ręcznej ±2 mm → V, gięcie w parze, koszulki, kieszeń w czaszy, przyrząd do gięcia, dwie rundy review.

**Łańcuch 2 (powieki na jednym serwie):** wariant A (PRD) → dwa druty do jednego otworu orczyka → różnica długości PG–PD nie do skalibrowania (jedno serwo) → cały błąd ±2 mm przechodzi na powieki: przy r 7 to **±17° na 51,5° skoku** [O: 2/7 rad]. W referencji tego sprzężenia nie ma.

**Łańcuch 3 (kardan w kuli):** gałka gładka, nic z zewnątrz → kardan w środku, czop z przodu → łeb M5 nie przechodzi przez piastę → rowek T + podłoga + stożek → podpora drzewiasta pod stożkiem, blokada obrotu gałki tylko tarciem → to samo z tyłu: okno łba w słupku. Analogicznie: druty przyczepione wewnątrz kuli → ucha w kuli → ±38° przechyłu w dwóch osiach → widełki, oczka, sworznie, mostek, podpory, próbka.

**Nie jest przyczyną:** kardan 5/5 (mieści się, zgina > 90°), serwa MG90S, otwór Ø80 sam w sobie, czasze powiek.

## 4. Prostsze architektury

Wspólne dla W1 i W2 (opis liczbowy):

**Rama U** (1 część, drukowana po pomiarze ścianki, jak dziś Pierścień):
- płyta ok. 100 × 55 × 4 na z ≈ −69 (jak dziś `zPlyta`) z trzema oknami serw jak w `UchwytSerw` (ta geometria zostaje);
- słupek kardana Ø16 do z = −12,75 (zostaje), bez okna: **stud M5** (M5 × 16 z odciętym łbem albo odcinek gwintu) wkręcony w otwór Ø4,2 w słupku, 7 mm wystaje w piastę, wkręt M4 piasty blokuje [Z: PLA przyjmuje gwint M5 w Ø4,2; obciążenie < 5 N];
- dwa słupki osi powiek: płytki 4 × 20 mm na x = ±(35,7…39,7), od płyty do z = +5; grubość 3,8–4 mieści nakrętkę M3 w kieszeni od tyłu (2,4 + ścianka 1,4) [O]. Ugięcie słupka 73 mm przy 1 N ≈ 0,4 mm [O: I = 20·4³/12 = 107 mm⁴, E 3 GPa], a wkręt w ściance dyni skraca wysięg do ≤ 25 mm;
- 3 łapy na wkręty do drewna 4 × 40 na promieniu 47 (jak dziś), na wysokości wewnętrznej ścianki (zmienna `scianka`).

**Gałka:** skorupa jak dziś (R 30, tył do z = −8, otwór tylny), w środku **bossa** Ø12 z otworem Ø4,2 od z = 28 do 16,25; stud M5 wkręcony od tyłu, wystaje 7 mm w przednią piastę. Bez rowka T, podłogi, okna. Zostaje jedna podpora drzewiasta pod bossą (każdy element w osi kuli drukowanej rantem na stole zaczyna się w powietrzu – K2 Astry; bez zmiany). Dwa **zaczepy prętów**: kostki 6 × 6 × 8 przy skorupie na (20, 0, −4) i (0, 20, −4) z otworem Ø1,9 wzdłuż z na kołek z drutu Ø2.

**Pręty gałki na kardanach 2/2** (decyzja 23.10 to dopuszcza): kołek Ø2 × 16 w kostce (8 mm wcisk, 8 mm w piaście kardana 2/2, wkręt M3 piasty), drugi koniec kardana zaciska **pręt z drutu Ø2 ocynkowanego** (otwór piasty Ø2 [F decyzje]); pręt prosty, przy orczyku zagięcie L przez otwór orczyka rozwiercony do Ø2,5 (przechył 6–9° przy orczyku mieści się w luzie [O: atan(0,5/2) = 14°]), ogon zagięty jako zabezpieczenie. Długość: pręt wsuwa się w piastę i zaciska wkrętem – **błąd ±2 mm przestaje istnieć**, a zero i tak ustawia ESP32. Położenie: piasta na z −4…−12, krzyżak do −19, druga piasta do −27, pręt ~20 mm do orczyka na z −44 [O]. Odstępy: od słupka Ø16 ≥ 7 mm, od słupków powiek ≥ 11 mm, między kardanami ≥ 19 mm [O, w zerze; przemiatanie konieczne]. Orczyk S1 r 17,5 → 15,5 (szersze ramię pod otwór Ø2,5): skok ±12,6 mm wymaga ±54° serwa [O] – w zakresie.

**Powieka z dźwignią na czaszy:** czasza jak dziś (górna R 31,5–32,7, sektor 75°), ucha osi na x = ±33 jak dziś, ale otwór Ø3,3 na M3 × 10 w nakrętkę w słupku. Zamiast dźwigni r 7: **czasza przedłużona do tyłu o 25° jako język** (szerokość 8 mm, grubość 2,4) z otworem Ø1,4 na końcu, na promieniu 31,5–33,9, czyli w tej samej strefie, w której już leży czasza. Drut Ø1 z Z na obu końcach idzie od języka do orczyka S3 za gałką. Ramię skuteczne [O, język od 100° do 150° od przodu, drut wzdłuż z]: 31 mm przy zamkniętej, 16 mm przy otwartej, średnio ok. 24 mm → **2,4°/mm** (1,8–3,6°/mm na skoku). Język przy otwarciu sięga z ≈ −27, czyli za wewnętrzną ściankę dyni dla ścianki ≥ 28 [O] – bez tuby nic tam nie stoi. Do przemiatania: język vs pręt S2 (odstęp w zerze ok. 7 mm przy języku w x = 0 [O]; lepiej język przesunąć na x ≈ −15).

**Przód:** płaski pierścień Ø84/Ø70 × 2,5 na skórce, 3 wkręty do drewna 4 × 30 w pogłębieniach (zasada repo: wkręty, nie klej). Zakrywa krawędź cięcia i szczelinę między powiekami (Ø69) a otworem (Ø80). Rant 2 mm poza otwór = PRD.

### W1: rama U, wariant B (dolna powieka nieruchoma)

- **Gałka i powieki:** jak wyżej; dolna powieka = czasza R 33,4–34,6 zrośnięta z przednim pierścieniem jednym wydrukiem (pierścień na z = 22–24,5 przechodzi płaskim sektorem R 25–35 w czaszę) [O: na z = 22 kula R 33,4 ma r 25,1]. Górna czasza (zewn. 32,7) chodzi pod dolną (wewn. 33,4) z luzem 0,7 jak dziś.
- **Serwa:** S1, S2 jak dziś (pręty na kardanach), S3 wałkiem poziomo za górnym językiem, jeden drut Ø1.
- **Części drukowane: 4** (Gałka, Rama, Powieka górna, Maska = pierścień + dolna powieka). Części kupne: kardan 5/5, 2 × kardan 2/2, 2 study M5, 2 × M3 × 10 + nakrętki, 3 × MG90S + wkręty fabryczne, 2 × drut Ø2 (ok. 2 × 40 mm pręty + 2 × 16 kołki), 1 × drut Ø1 ok. 70 mm, 6 wkrętów do drewna.
- **Kroki montażu: 8** (stud w słupek i w gałkę, gałka na kardanie, kołki + kardany 2/2 w gałce, górna powieka na M3, serwa w okna, pręty w piasty + L w orczyki, drut powieki, zero w ESP32). Gięcia: 2 × L (Ø2, kąt bez znaczenia), 2 × Z (Ø1, długość bez znaczenia). Żadnej pętli „gnij–przyłóż–dogiń”, bez próbki i przyrządu. Druk: 4 pliki, podpory tylko w Gałce (1 drzewo) i pod czaszą górną.
- **Wrażliwość na ±2 mm:** pręty gałki 0° (zacisk + zero programowe); drut powieki ±5° zera [O: 2 × 2,4], kasowane zerem S3. Luz kardana 2/2 nieznany: przy 0,3 mm [Z] to 0,8° gałki [O: 0,3/20,4 rad].
- **Główne ryzyko:** zmiana funkcji (dolna powieka nie mruga – ale B jest zatwierdzony z góry 24.10) i nieznany luz/zakres kardana 2/2 (pomiar: złapać kardan za obie piasty i zmierzyć ruch końca przy 20 mm).

### W2: rama U, wariant A (obie powieki na jednym S3)

- Jak W1, ale dolna powieka osobną czaszą na tej samej osi M3 (ucha w stosie jak dziś, luz 0,2), z własnym językiem u dołu; oba języki przy otwieraniu idą do tyłu, więc jeden orczyk S3 z wałkiem pionowym ciągnie oba druty jak dziś (symetria z raportu nocnego zostaje: 51,5° / 51,3°).
- **Części drukowane: 5** (+ Powieka dolna; Maska to sam pierścień). Kroki montażu: 9. Gięcia: 2 × L + 4 × Z.
- **Wrażliwość:** różnica długości PG–PD ±2 mm → **±5° między powiekami** [O: 2/24 rad] zamiast ±17°. To wciąż widać przy zamknięciu (zakładka 3°). Dwie poprawki bez precyzji:
  - a) **dolny język z 3 otworami co 2,5 mm** (ścianka między Ø1,4 ≥ 1,1) → krok 6° [O: 2,5/24], zostaje ±3°; albo
  - b) **drukowany zacisk** 10 × 10 × 8 na M3 przez język (obrót) z drugą M3 jako wkrętem dociskowym na drut Ø1 (odpowiednik złączki RC „EZ connector”) → regulacja ciągła, 2 × M3 + 2 nakrętki, nic drobnego ani kruchego.
- **Degradacja do B jedną śrubą:** jeśli po montażu dolna powieka nie domyka się razem z górną, wykręcić jej drut i przykręcić język M3 do słupka. W1 zostaje wtedy awaryjnie w środku W2.
- **Główne ryzyko:** zderzenie dwóch drutów powiek z prętami S1/S2 za gałką (dziś PD–Pierścień 0,44; bez tuby ta para znika, zostają druty–pręty) – przemiatanie jak dziś.

### W3: obecny model z trzema cięciami (gdy tuba ma zostać)

Jeśli decyzja 24.10 o tubie zostaje: zostawić Pierścień, Uchwyt, Maskownicę, osie M2, a zmienić tylko: (a) stud M5 w bossę zamiast rowka T i okna, (b) język czaszy zamiast dźwigni r 7 (w tubie ramię ograniczone: przy x = ±34 język jest na promieniu 31,5–33,9 od osi gałki, ale leży przy y = ±31 i x ≈ 0, więc od osi tuby ma 34 < 37,9 – mieści się [O]), (c) pręty S1/S2 na kardanach 2/2. Części drukowane 6 (bez próbki i przyrządu). Zysk: 8,2 → 2,4°/mm na powiece, koniec widełek i rowka T. Zostają: 3 ramiona, podkładki M2, wcisk maskownicy, dwie zmienne po pomiarze ścianki.

### Porównanie

| | Dziś | W1 (B) | W2 (A) | W3 |
|---|---|---|---|---|
| Części drukowane | 6 + próbka + przyrząd | **4** | 5 | 6 |
| Części z podporami | 3 | 2 | 3 | 3 |
| Gięcia precyzyjne (wymagają doginania) | 8 Z + 2 V + 2 oczka | **0** | 0 (regulacja zaciskiem/otworami) | 0 |
| Gięcia dowolne | – | 2 L + 2 Z | 2 L + 4 Z | 2 L + 4 Z |
| Kroki montażu na stole | 8 + 9 (druty) + 5 (próbka) | **8** | 9 | 10 |
| ° powieki na 1 mm drutu | 8,2 | 2,4 (zero w ESP32) | 2,4 (różnica ±5°, regulowana) | 2,4 |
| Połączeń nie do skalibrowania programowo | 1 (PG–PD) | **0** | 1 (z regulacją) | 1 |
| Zmiennych po pomiarze dyni | 2 części | 1 część | 1 część | 2 części |
| Zgodność z PRD 4 „tuba w otworze” | tak | **nie** (zmiana decyzji 24.10) | nie | tak |
| Zgodność z A/B | A | **B** (zatwierdzony z góry) | A | A |

## 5. Rekomendacja

**W2 zbudowane tak, żeby degradowało się do W1**: rama U bez tuby, płaski pierścień z przodu, języki na czaszach, pręty gałki na kardanach 2/2, stud M5. Jeżeli użytkownik od razu wybierze B, budować W1 (4 części, zero pętli doginania). Powód liczbowy: jedyna rzecz, która wymagała precyzji ręcznej, to różnica długości dwóch drutów powiek przy ramieniu 7 mm; rama bez tuby pozwala wydłużyć ramię 3,4 razy, a B albo zacisk usuwają resztę. Pierścień-tuba nie trzyma oka i nie jest potrzebny do niczego poza wypełnieniem szczeliny Ø69–Ø80, którą wypełni płaski pierścień.

**To przeczy decyzji 24.10 („tuba w otworze, kołnierz z łapami”) i wymaga pytania do użytkownika.** Jeśli tuba ma zostać, W3 daje większość zysku w powiekach i gałce bez ruszania mocowania.

**Co zachować z obecnego modelu** (`duze-oko-v2.scad`): wszystkie zmienne BAZOWE (części kupne, luzy, Rg, ścianka, otwór), skorupę gałki z tylnym otworem, czasze powiek (promienie, sektor 75°, szczeliny 1,5 / 0,7, uszy na osi x), ramki serw z `UchwytSerw` (okna, otwory wkrętów, `zPlyta`, `zSerwoPrzod`), słupek kardana, położenia S1/S2 i solver `duze-oko-kinematyka.js`, przemiatanie `duze-oko-kolizje.js`, asercje GRANICE, skrypty eksportu i kontroli siatek. **Do wyrzucenia:** rowek T i podłoga, okno słupka, tuba, podkładki osi, 3 ramiona, maskownica na wcisk, widełki/oczka/sworznie/mostek, dźwignie r 7, kieszeń, koszulki, V, `ProbkaDrutu`, `PrzyrzadDrutow`.

**Do zmierzenia przed CAD** (fakty, które zna tylko warsztat): luz i zakres kardana 2/2 (ruch końca przy 20 mm), długość piasty 2/2 (założyłem 8 mm), czy M5 da się odciąć na 20 mm, czy orczyk MG90S zniesie otwór Ø2,5 przy r 13,5–15,5.

**Założenia tej analizy:** gałka referencji ok. 40 mm (zdjęcie); PLA przyjmuje gwint M5 w otworze Ø4,2; kardan 2/2 ma piasty po ok. 8 mm; drut Ø2 ocynkowany daje się zagiąć w L kombinerkami bez precyzji; luz kardana 2/2 ≤ 0,3 mm.
