# Review zgodności dużego oka v3 z założeniami: Opus 5.5

26.10.2026. Brief: `2026-10-26-zgodnosc-v3-brief.md`. Materiał z commitu `ca3b376`. Pracowałem tylko na odczyt; raportu Astry nie czytałem.

**Jak mierzyłem.** Własnym skryptem Python (`-I`, numpy) czytałem siatki 3MF z `40-cad/3mf/Duze oko v3/`: obrys, liczbę brył, pole podstawy, pole nawisów > 45°, promienie i średnice otworów. Osobno w OpenSCAD wykonałem `include` modelu `duze-oko-v3.scad` i liczyłem przecięcia brył serw. Korpusy serw zbudowałem tak samo jak skrypt przemiatania. Własnym rachunkiem odległości punkt–trójkąt, na siatce gałki z kinematyką projektanta, powtórzyłem luz prętów L–P i G–D na całej siatce położeń: 15 × 11, co 5°, razem z narożnikami. Wymiary podane niżej pochodzą z siatek albo z SCAD, nie z deklaracji w `duze-oko-v3-montaz.md`.

## 1. Zgodność z decyzją PM

| # | Punkt | Werdykt | Dowód |
|---|---|---|---|
| 1 | Płyta pozioma za końcem tuby, słupki zawiasu i kardana integralne, ramiona do przodu | **ZGODNE** | Płyta y −20…−15, z −97…−49, x ±42. Przód płyty leży 2 mm za tylną ścianą kołnierza Tuby 50 (z −47). Ramiona zawiasu x 34,7…37,2, y ±5, sięgają do z +4. Wychodzą z podpór x 33,2…37,2, z −53…−49. Słupek kardana Ø12 z klockiem 12 × 20 × 6 na płycie. Wszystko to jedna bryła `Plyta.3mf` (1 obiekt). |
| 2 | Zaczepy powiek ok. 34 i ok. 31–32, przy x ≈ 0 | **ZGODNE** | `zaczG = [5; 34,0]`, `zaczD = [−5; 31,5]`, otwór Ø1,3 leży 1,6 przed płaszczyzną osi. Na siatce uszko górnej sięga y 35,6, a dolnej −33,1. Płaszczyzny x = ±5 uznaję za „przy x ≈ 0”. |
| 3 | Klej zamiast M3 | **ZGODNE** | W SCAD nie ma żadnego otworu M3. Lista śrub w montażu: 2 × M5 × 8, 2 × M4 kardana, 4 wkręty orczyków, 4 wkręty do drewna. Moduł jest wklejany na gorąco w szczeliny słupek–tuba (krok 10). |
| 4 | 3 tuby 30 / 40 / 50 o rzeczywistej długości | **ZGODNE** | Siatki Tuba 30/40/50 mają wysokość 33 / 43 / 53, czyli tubę L plus kołnierz 3. Kołnierz leży L za rantem z = +6, więc długość tuby równa się grubości ściany. Moduł jest ustawiany względem rantu (czoło słupków 2 mm za rantem), a nie opierany o koniec tuby. Płyta stoi 2 mm za Tubą 50, a w Tubach 30 i 40 dalej. |
| 5 | Jedna centralna piasta bez 3 żeber | **ZGODNE** | Piasta Ø14 biegnie od wewnętrznego bieguna do z = +14, w czole ma gniazdo łba Ø9,5 × 5,2. Żeber nie ma. Pod czołem piasty w druku jest podpora drzewiasta, opisana w montażu §1. |
| 6a | Słupki z zewnętrznym profilem R37,2 | **ZGODNE** | Na siatce płyty największy promień przy z > −47 wynosi 37,20. Do ścianki tuby R38,15 zostaje 0,95 na całej szerokości ramienia. |
| 6b | Kolizja pręta L–P z krawędzią czaszy | **ZGODNE** | Krawędź czaszy przesunięta z −15 na −12, czyli z ok. 120° na ok. 114° od przodu. Ustalenie 3 dopuszcza płytszą czaszę, gdy zaczepy się nie mieszczą. Przemiatanie: PretLP–Gałka 1,25, PretGD–Gałka 2,15. Mój rachunek (punkt–trójkąt, krok 0,5, ten sam wycinek 6 mm wokół zaczepu): PretLP–Gałka min. 1,59 przy psi +35 / theta −25, w tym samym miejscu (9,8; 1,7; −17,8); PretGD–Gałka min. 2,55. Przemiatanie projektanta jest ostrożniejsze o ok. 0,3–0,4. |
| 6c | Montaż wkrętu M4 tylnej piasty | **ZGODNE** | Nowa kolejność: kardan najpierw na słupek, wkręt dociskowy tylnej piasty (z −9,1, skierowany do góry) dokręcany z góry przed założeniem gałki. Nad nim nic nie ma, a długie ramię klucza obraca się na y ≈ 20, ponad korpusem G–D (wierzch y 7,8). Przednią piastę (wkręt z +9,1 w −x) dokręca się kluczem przez otwór tylny. Na x ≈ −19 klucz ma ok. ±34–38° ruchu na jedno przełożenie, potem przekłada się go o 60°. Da się, choć pracuje się krótkimi ruchami. |
| 6d | Światło otworu tylnego | **ZGODNE** | Siatka: wewnętrzny promień krawędzi 25,03 (wielokąt), czyli światło Ø50,1, a nominalnie Ø50,6. Montaż liczy drogi narzędzi na Ø50,6. Różnica 0,5 nie zmienia żadnej drogi. |
| 6e | Osie powiek ≥ Ø2,4, drut zabezpieczony | **ZGODNE z uwagą** | Otwór w uszach Ø2,4: na siatce promień wierzchołków 1,20, między ściankami wielokąta 1,18, czyli luz 0,18–0,2 na stronę przy drucie Ø2. Otwór w słupku Ø1,9 na wcisk z CA. Wcisk jest jednak niewykonalny w kolejności z instrukcji (uwaga W2). |
| 6f | Luz drut dolnej powieki–gałka | **ZGODNE** | Przemiatanie: DrutD–Gałka 1,31 (wymóg 0,5). |
| 6g | Gniazdo łba M5 | **ZGODNE częściowo** | Gniazdo Ø9,5 × 5,2 zrobiono pod ISO 4762 Ø8,5 × 5, z 0,5 na klej (zgodnie z tabelą). Rzeczywistego łba nikt nie zmierzył: montaż §7 przenosi pomiar na wydruk. |
| 6h | Przemiatanie narożników L–P i G–D na siatkach | **ZGODNE z zastrzeżeniem** | Siatka 15 × 11 obejmuje narożniki. Przemiatanie nie sprawdza jednak par nieruchomych serwo–serwo, a jedna z nich koliduje (uwaga K1, §4). |

## 2. Elementy nowe (spoza referencji, koncepcji i decyzji PM)

| Element | Werdykt | Liczba, która go wymusza |
|---|---|---|
| Wycięcie paska tylnej krawędzi obu powiek, 8 × 4 mm przy uszku drutu (mostek 3 mm nad stołem) | **NIEZBĘDNE** | Otwór uszka leży na r = 34,0 (górna) i 31,5 (dolna) od osi, a więc wewnątrz pasa czaszy (33,2–34,4 i 31,0–32,2). Drut idzie od otworu do tyłu przez pas czaszy z +1,6…−3. Bez wycięcia przechodziłby przez ściankę. |
| Wycięcie w powiece górnej wokół ucha dolnej (walec r 4,6, \|x\| 31,6…33,2) | **NIEZBĘDNE** | Przy x = 33,0 wewnętrzna powierzchnia górnej czaszy (R33,2) leży 3,6 od osi, a ucho dolnej ma r 3. Przy x = 33,2 odstęp spada do zera. Po wycięciu narożnik podstawy ucha dolnej (r 4,24) ma 0,36 promieniowo. |
| Podpory ramion zawiasu (pion x 33,2…37,2, z −53…−49) | **NIEZBĘDNE** | Ramię zaczyna się na y −5, a wierzch płyty leży na y −15: 10 mm przerwy. Podpora jest tym, co czyni słupki integralnymi z płytą. |
| Klocek słupka kardana 12 × 20 × 6 | **NIEZBĘDNE** | Spód słupka Ø12 leży na y −6, wierzch płyty na −15: 9 mm przerwy. |
| Nowe położenia serw, G–D, PG, PD stojące na końcu korpusu z dolnym uchem w szczelinie 2,4 × 12,9, L–P pionowo na wylot | **NIEZBĘDNE** co do zasady | Wynikają z płyty poziomej (decyzja PM 1). Konkretny układ ma jednak kolizję L–P z PG (K1). |
| Wnęki 1 mm pod wieżyczkami PG i PD | **NIEZBĘDNE** | Wałek leży 5,5 nad płytą, a wieżyczka ma r 5,9: schodzi 0,4 poniżej wierzchu płyty. |
| Szczelina 8 × 37 w płycie na orczyk powieki dolnej | **NIEZBĘDNE** | Orczyk 25 na wałku y −9,5 sięga do y −32,5 i przechodzi przez płytę (y −20…−15). |
| Czasza do z −12 (ok. 114°) zamiast −15 (120°) | **NIEZBĘDNE**, w granicach ustalenia 3 | Przy −15 pręt L–P wchodził w krawędź (−0,3, poprzednia recenzja). Przy −12 ma 1,25. Wynik do pokazania użytkownikowi, bo dotyczy wyglądu: otwór tylny zewnętrznie Ø55,0, w świetle Ø50,6 (było „ok. Ø52”). |
| Orczyk G–D 11,5 zamiast 15,5, długości prętów 61,5 / 55,5 / 82,5 / 63,3 | parametry, nie elementy | Pochodna nowego położenia serw. |
| Kołki ustalające przedłużenia: 2 otwory Ø1,2 i 2 kawałki drutu Ø1,0 w otworach 5,5 i 17,5 orczyka | **NADMIAROWE** (DROBNE) | Geometria ich nie wymusza. Przedłużenie z PRD trzyma się na kleju, a położenie radialne wyznacza otwór Ø7 na piastę. Koszt jest mały: 2 odcinki drutu i 2 otwory. |
| Uwaga do firmware'u o sprzężeniu osi (+4,4° / +1,5°) | nie jest elementem | Informacja do kalibracji. Nic nie dodaje do mechaniki. |

Poza tą listą nie znalazłem w modelu dodatkowych śrub, części ani przegubów.

## 3. Montaż rękami (kroki z `duze-oko-v3-montaz.md` §5)

| Krok | Wykonalny? | Liczby |
|---|---|---|
| 1. Łby M5 w gniazda | tak | Gniazdo w piaście jest otwarte do tyłu, dostęp przez Ø50,6. |
| 2. Serwa G–D, PG, PD na płytę | **z uwagą W1** | Kabel G–D wychodzi z krótszej ściany po stronie przeciwnej do wałka, nisko przy spodzie (e6-pomiary). U G–D jest to ściana, która stoi na płycie (y −15) przy x ≈ −31. W płycie nie ma tam przejścia, jest tylko szczelina ucha na x −15,2…−12,8. |
| 3. Kardan na słupek, M4 z góry | tak | Droga wolna, patrz 6c. |
| 4. Gałka na kardan, M4 przedniej piasty przez otwór tylny | tak, drobnymi ruchami | Krótkie ramię klucza 2 mieści się wewnątrz kuli (promień wewnętrzny 26,5 na z +9,1). Długie ramię wychodzi przez krawędź na x ≈ −19, gdzie w świetle zostaje ±14–16 w y, czyli ok. ±35° obrotu na jedno przełożenie. |
| 5. Pręt G–D, wkręt orczyka wzdłuż −x | tak | Linia y 2,3, z −60 od +x jest wolna: serwa L–P jeszcze nie ma, a PG leży na z ≤ −80,75. |
| 6. Serwo L–P z góry w gniazdo | **NIE: K1** | Korpus L–P (x 25,25…37,75, y −33…−10,5, z −83,3…−60,5) przecina korpus PG (x 15,5…38, y −15…7,8, z −93,25…−80,75). Przecięcie z OpenSCAD: 12,5 × 4,5 × 2,55 mm. Tylne ucho L–P (z −87,8…−83,3, y −15…−13) leży w całości w korpusie PG. PG jest wklejone w kroku 2, więc L–P nie wejdzie. W odwrotnej kolejności PG nie stanie na płycie. |
| 7. Powieki od przodu, drut Ø2 wciskany kombinerkami | **NIE w tej formie: W2** | Ramię zawiasu ma 2,2–2,5 × 10 mm przekroju i wysięg ok. 49 mm od podpory do osi. Sztywność w x: k = 3EI/L³ ≈ 3 · 3500 · 12 / 49³ ≈ 1 N/mm. Wcisk Ø2 w otwór Ø1,9 (na siatce ok. Ø1,85 między ściankami wielokąta) wymaga kilkunastu–kilkudziesięciu N, czyli ugięcia ramienia o centymetry. Ramienia nie ma czym podeprzeć od środka: między ramieniem a uchem górnej powieki jest 0,3 mm. |
| 8. Druty powiek, wkręty orczyków | tak, z uwagą D1 | Wkręt PD wkręcany wzdłuż −x na y −9,5, z −76 przechodzi 1,0 mm nad wierzchem korpusu L–P (y −10,5). Grot PH1 ma Ø ok. 3–4,5, więc trzeba go pochylić o ≥ 3°. To miejsce „na milimetr”. Wkręt PG wzdłuż +x na z −87 ma 4,75 do korpusu PD: wolny. |
| 9. Test na stole | tak | – |
| 10. Moduł w tubie, klej na gorąco | **z uwagą W3** | Ramiona na łuku R37,2 w tubie R38,15 ustawiają moduł tylko w x. W y moduł opada pod własnym ciężarem do 4,84 mm (dolne narożniki ramion (36,86; −5) dochodzą do R38,15). Obrót wokół osi jest wolny, pochylenie ±4,2° w Tubie 50 i ±7,3° w Tubie 30. Do zastygnięcia kleju nic nie trzyma gałki w środku otworu. |

Miejsca „na milimetr” poza zaakceptowanym 0,95 przy tubie: droga wkrętaka PD nad korpusem L–P (1,0, D1) oraz, po naprawie K1, cokolwiek wyjdzie między L–P a PG. Szczelina pod uszkiem powieki i luz 0,3 ucho–słupek to pasowania z tabeli, a nie przejścia montażowe.

## 4. Wystarczalność przemiatania (`przemiatanie-v3.txt`, skrypt `duze-oko-v3-przemiatanie.py`)

| Wymóg | Jest? | Uwagi |
|---|---|---|
| Narożniki obu osi | **tak** | psi −35…+35 × theta −25…+25 co 5°, 165 położeń. Mój niezależny rachunek prętów: L–P 1,59, G–D 2,55, najgorszy przypadek w narożniku psi +35 / theta −25, zgodnie z projektantem. |
| Obie powieki | **tak** | 0 / 17 / 34 / 51,5° wobec gałki w położeniach skrajnych i środkowych. Powieki wzajemnie i wobec części nieruchomych sprawdzone co 8–9° (7 × 7). |
| Druty | **tak** | Pręty L–P i G–D oraz druty powiek wobec gałki, powiek, płyty, Tuby 50 i serw. Wycinek 6 mm wokół własnego zaczepu jest wyłączony jako styk zamierzony. |
| Pary nieruchome | **NIE** | Pary serwo–serwo i serwo–płyta nie są liczone. Stąd brak kolizji L–P–PG (K1) w raporcie „0 z 83”. AGENTS §Proces wersji wymaga też par nieruchomych. |
| Pominięte w bryłach | częściowo | Bez uszu serw, kabli, piast orczyków i przedłużeń w pełnym kształcie: przedłużenie 6 × 2,5 z piastą Ø10 jest liczone jako pas r 2,5 na x = ±5. Przedłużenie PD przyklejone na wierzchu ramienia orczyka (wałek kończy się na x −3) leży ok. x −3…−0,5, a ścianka szczeliny płyty jest na x −1,5. Możliwe przenikanie ok. 1 mm, niesprawdzone (D2). |
| Tuby 30 i 40 | wystarcza Tuba 50 | Ścianki i kołnierz Tub 30 i 40 zajmują podzbiór obszaru Tuby 50 (r ≥ 38,15, z od rantu w tył). |

## 5. Druk

Pomiar na siatkach 3MF: każda część to 1 bryła, plik zbiorczy ma 9 obiektów.

| Część | Obrys [mm] | ≤ 180 | Płaska podstawa | Nawisy > 45° | Ocena |
|---|---|---|---|---|---|
| Płyta | 84 × 101 × 26 | tak | 3392 mm² | 569 mm²: spody ramion i słupka kardana, 15–26 mm nad stołem | podpory opisane w montażu §1: **zgodne** |
| Gałka | 60 × 60 × 42 | tak | pierścień 364 mm² | 1390 mm²: sufit czaszy w promieniu ok. 45° od bieguna i czoło piasty | podpora pod piastą opisana; sufit bez podpór jak w referencji, opisany jako do sprawdzenia: **zgodne** |
| Powieka górna | 68,8 × 38,6 × 37,4 | tak | 125 mm² (pasek 1,2 mm) | 976 mm²: sufit kopułki | opisane („ewentualnie podpora pod szczytem”): **zgodne**, podstawa wąska (D3) |
| Powieka dolna | 66 × 36,1 × 35,2 | tak | 123 mm² | 854 mm² | jak górna |
| Przedłużenie ×2 | 33 × 10 × 2,5 | tak | płasko | 0 | zgodne |
| Tuba 30/40/50 | 92 × 92 × 33/43/53 | tak | kołnierz 2293 mm² | 0 | zgodne |
| Maskownica | 84 × 84 × 2 | tak | płasko | 0 | zgodne |

## 6. Uwagi

**KRYTYCZNE**

- **K1. Serwo L–P koliduje z serwem powieki górnej.** Miejsce: płyta za prawą częścią, x 25…38, z −88…−81. Pomiar (OpenSCAD, korpusy jak w przemiataniu): korpus ∩ korpus 12,5 × 4,5 × 2,55 mm, a tylne ucho L–P o długości 4,5 mm leży w całości w korpusie PG. Scenariusz porażki: krok 6 jest niewykonalny, a przy innej kolejności PG nie stanie w szczelinie. Poprawka: zmiana parametrów `PG_wal`/`LP_wal`/`pl_zT`, żeby przód korpusu PG był ≥ 0,5 za tylnym uchem L–P (dziś −80,75 wobec −87,8). Potem dopisać do przemiatania pary serwo–serwo i serwo–płyta, razem z uszami. Pewność: wysoka (wymiary serw z rysunku Miuzei, tak samo jak w modelu).

**WAŻNE**

- **W1. Kabel serwa G–D jest przygnieciony płytą.** G–D stoi na ścianie, z której wychodzi kabel (przeciwnej do wałka), przy x ≈ −31, y −15. Scenariusz: serwo nie leży na płycie i podnosi się o grubość kabla (ok. 1–1,5 mm), albo kabel zostaje zgnieciony klejem. Poprawka albo test: sprawdzić wyjście kabla na posiadanym MG90S (e6-pomiary: pewność „niska – rysunek”) i dać kablowi przejście w płycie przy x ≈ −31. Pewność: średnia.
- **W2. Wcisk drutu osi Ø2 w słupek Ø1,9 jest niewykonalny kombinerkami.** Ramię ma sztywność ok. 1 N/mm i nie ma podparcia od środka (0,3 do ucha). Scenariusz: ramię ugina się i wpycha uszy w gałkę, albo pęka. Poprawka w granicach decyzji PM („wcisk albo klej”): otwór luźny w słupku (np. jak w uszach) i drut na CA. Tuba trzyma drut przed wysunięciem. Pewność: wysoka co do rzędu wielkości.
- **W3. Moduł nie jest wycentrowany w tubie podczas klejenia.** Luz w y do 4,84 mm (opada pod ciężarem), obrót wokół osi wolny, pochylenie ±4–7°. Przy przesunięciu do góry o 1,9 powieka górna dochodzi do tuby (przemiatanie: PowiekaGorna–Tuba50 1,92 przy module w środku). Scenariusz: gałka 4–5 mm za nisko w otworze, powieka górna ociera o tubę, oś pozioma oka przekrzywiona. Test: w kroku 10 trzymać moduł tak, żeby szczelina gałka–tuba (8,15) była równa dookoła, a ramiona poziomo, aż klej zastygnie. Wpisać to w instrukcję i do testu na wydruku. Pewność: wysoka (geometria łuku R37,2 w R38,15).

**DROBNE**

- **D1.** Wkręt orczyka PD wkręcany wzdłuż −x przechodzi 1,0 mm nad korpusem L–P. Trzeba pochylić wkrętak o ≥ 3° albo przykręcić orczyk PD przed wklejeniem L–P. Przy naprawie K1 sprawdzić ponownie.
- **D2.** Przedłużenie orczyka PD w szczelinie płyty: ścianka szczeliny na x −1,5, przedłużenie przyklejone na wierzchu ramienia leży ok. x −3…−0,5. Możliwe przenikanie ok. 1 mm, a przemiatanie modeluje tylko pas r 2,5 na x −5. Test: pomiar wysokości ramienia orczyka nad czubkiem wałka, pas przedłużenia 6 × 2,5 w przemiataniu. Pewność: średnia (brak pomiaru orczyka).
- **D3.** Powieki stoją na pasku 1,2 mm (123–125 mm² podstawy) i mają 35–37 mm wysokości przy ściance 1,2. Do wydruku testowego wystarczy brim.
- **D4.** Otwory osi Ø2,4 są wielokątem 18-bocznym: między ściankami Ø2,36, luz 0,18 na stronę wobec 0,2 z tabeli. Do sprawdzenia na wydruku.
- **D5.** W narożniku psi ±35°, theta ±25° środek źrenicy Ø20 [Z] leży 18,5° od krawędzi otwartej powieki, a półkąt źrenicy to 19,5°. Krawędź źrenicy chowa się ok. 1° pod powieką. PRD dopuszcza mniejszy zakres w narożnikach. Informacja do P4.
- **D6.** Czasza 114°, a nie ok. 120° (otwór Ø55 zewnętrznie): zmiana dotyczy wyglądu. Jest w granicach ustalenia 3, ale należy ją pokazać użytkownikowi rano razem z P4 i P5.
- **D7.** Kołki ustalające przedłużeń (2 × drut Ø1,0) to element nadmiarowy wobec koncepcji. Można je pominąć bez skutków dla geometrii.
- **D8.** Długość wkręcenia trzpienia M5 w piastę tylną: przy łbie dosuniętym do dna gniazda wychodzi 6,3, a nie deklarowane 6,5 (dno otworu 0,7 dalej). Bez skutków.

## Werdykt

v3 jest zgodne z decyzją PM we wszystkich pięciu decyzjach i w obowiązkowych poprawkach, a nowe elementy poza kołkami przedłużeń wymusza geometria, ale do wydruku testowego jeszcze się nie nadaje: serwo L–P koliduje z serwem powieki górnej (K1, 2,55 mm), a kroku 7 (wcisk osi) nie da się wykonać w tej formie (W2). Do wydruku potrzebne są: zmiana położenia serw L–P/PG, luźny otwór osi w słupku i ponowne przemiatanie z parami nieruchomymi.
