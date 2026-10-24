# Duże oko v2 – druk, montaż i kalibracja

Model: [`duze-oko-v2.scad`](duze-oko-v2.scad) (OpenSCAD, zmienne na górze pliku). Eksport: `bash eksport.sh` → `40-cad/3mf/Duze oko v2/`: jeden 3MF na część (nazwa = moduł w .scad) i zbiorczy „Duze oko v2 - wszystkie czesci.3mf” z **8 osobnymi obiektami nazwanymi jak części** (składa go `40-cad/narzedzia/zbiorczy_3mf.js`). Zbiorczy służy do przeglądu i rozdzielenia na stoły w Bambu Studio; całość nie mieści się na jednym stole A1 mini. Druty: [`../druty/duze-oko-v2-druty-1do1.svg`](../druty/duze-oko-v2-druty-1do1.svg). Kinematyka: `node ../narzedzia/duze-oko-kinematyka.js`.

## Druk (A1 mini, PLA, warstwa 0,2, 3 obrysy)

| Kolejność | Plik 3MF | Kolor | Orientacja | Podpory | Uwagi |
|---|---|---|---|---|---|
| 1 | Przyrzad do giecia drutow | dowolny | płytą na stole | brak | płytka 65,6 × 56 × 6, drukować razem z próbką; gięcie: sekcja niżej |
| 1 | Probka drutu | dowolny | jak w pliku | brak | blaszka ucha 1:1 jak w gałce (klepsydra, szczelina pod spodem), dźwignia powieki, otwór orczyka S3, ok. 10 min |
| 2 | Pierscien | pomarańcz | kołnierzem na stole | brak | długość tuby = `scianka` + 2. **Drukować po zmierzeniu dyni** (zmienna `scianka`, domyślnie 40) |
| 3 | Uchwyt serw | pomarańcz | płytą na stole | brak | ramiona = 84 − `scianka`, więc też po pomiarze dyni |
| 4 | Galka | **biały** | kołnierzem (tył, z = −8) na stole | **jedna podpora drzewiasta** pod wierzchołkiem stożka w środku (malowanie podpór tylko tam) | podporę wyjąć przez tylny otwór. Ucha drutów (2 blaszki przy krawędzi) bez podpór: dolna krawędź schodzi pod 45° do stołu, pod otworem 4,5 mm płaskiego nawisu (2 mm szerokości) |
| 5 | Powieka gorna, Powieka dolna | pomarańcz | uszami na stole, czaszą do góry | **drzewiaste pod wewnętrzną stroną czaszy** (tylko od stołu) | ślady zostają po stronie gałki, niewidoczne |
| 6 | Maskownica | pomarańcz | płasko | brak | wcisk na tubę Ø79; za luźna → klej, za ciasna → papier ścierny |

Po druku rozwiercić (luz drutu Ø1 = 0,2 na stronę): talie klepsydr w uchach gałki Ø1,7, dźwignie powiek Ø1,4, otwory orczyków S1 (17,5) i S2 (13,5) Ø1,4, otwór orczyka S3 (7,5) Ø2,4 (dwa druty).

**Mosty bez podpór** (Bambu mostkuje je bez problemu, sprawdzić po wydruku):
- Uchwyt: nad oknami serw 13,1 mm i strop okna łba M5 w słupku 10,5 mm. Zwis > 0,3 mm zebrać nożykiem, bo przeszkadza we wsuwaniu korpusu i łba.
- Gałka: płaski nawis pod uszami 5,5 mm.
- Powieki: płaskie stopki 0,6 mm pod uszami na stole, czasze na podporach drzewiastych.

## Gięcie drutów na przyrządzie

Przyrząd `Przyrzad do giecia drutow.3mf` to płytka 65,6 × 56 × 6 z 4 torami: **S1**, **S2**, **PG** i **PD**. **PG i PD są jednakowe** (2 sztuki tego samego drutu). Przy każdym torze są wyryte długość korpusu i kąt. Model liczy je z tych samych zmiennych co ruch (`LdS1`, `LdS2`, `LdP`, `katS2`, `katP`, `przezUcha`, `przezDzw`, `przezOrcz`, `ogonDrut`).

Tor ma 3 elementy:
- **rowek korpusu:** od osi zagięcia A do osi zagięcia B;
- **koniec B (orczyk), we wszystkich torach:** rowek odcinka „przez” (2,5 mm) pod kątem z toru i rowek ogona (2 mm) równoległy do korpusu, na zewnątrz. Cały Z leży w płaszczyźnie płytki;
- **koniec A:**
  - S2: taki sam Z w rowkach, w przeciwną stronę;
  - S1 (ucho gałki) i PG/PD (dźwignia): **otwór pionowy**. Jego dno leży 4,5 mm (S1) albo 4,0 mm (powieki) pod osią drutu w rowku, czyli odcinek „przez” + ogon 2 mm.

**Kołki:** przy każdym zagięciu w płaszczyźnie są 2 otwory na śruby M3 (wkręcasz od spodu w Ø2,6, łeb w pogłębieniu, trzpień wystaje nad płytkę):
- **wewnętrzna** w narożu: drut owija się wokół trzpienia;
- **oporowa** dalej: zatrzymuje odcinek „przez” pod kątem z toru + 5° przegięcia na sprężynowanie.

Potrzeba 8 śrub M3 × 12–16: S1 2, S2 4, powieki 2 (tory PG i PD są jednakowe, wystarczy obsadzić jeden). Narzędzia: płaskie kombinerki i obcinaczki. Płytkę można złapać brzegiem w imadle.

1. **Ucięcie.** Utnij drut Ø1,0 na długość L + 12 mm: S1 54, S2 55, PG i PD po 57.
2. **Koniec A.**
   - **S1, PG, PD:** włóż koniec drutu do dna otworu A. Kombinerkami połóż resztę w rowku korpusu: przy krawędzi otworu powstaje zagięcie w dół.
   - **S2:** włóż koniec w rowek ogona A, zagnij go w rowek odcinka „przez”, a potem do rowka korpusu.
3. **Korpus.** Dociśnij drut w rowku na całej długości.
4. **Koniec B.** Trzymając korpus w rowku, pchnij wolny koniec drutu wokół śruby wewnętrznej aż do oporu o śrubę oporową. Odcinek „przez” odmierz rowkiem (2,5 mm od naroża), tam kombinerkami zagnij ogon w rowek ogona. Nadmiar utnij.
5. **Sprężynowanie.** Drut sprężynowy odgina się po zwolnieniu. Każde zagięcie przegnij szczękami o ok. 5–10° ponad kształt rowka. **Kontrola:** po wyjęciu drut ma się wkładać z powrotem w cały tor **bez dociskania**. Jeśli nie wchodzi, popraw zagięcie kombinerkami.
6. **Ogon na końcu A (S1, PG, PD).** Wyjmij drut. Odcinek, który był w otworze, ma 4,5 mm (S1) albo 4,0 mm (powieki). Chwyć go kombinerkami 2 mm od końca i zagnij ogon o 90°, **równolegle do korpusu, na zewnątrz** (kształt Z). Tu kąt jest prosty, bo odcinek A jest prostopadły do korpusu.
7. **Gnij jak najciaśniej**, krawędzią szczęk przy samym zagięciu. Długości liczą się do osi zagięć i nie uwzględniają promienia, a ±0,5 mm ustawia kalibracja. Kolanka o promieniu wewnętrznym powyżej ok. 0,5 mm skracają odcinek „przez”. Sprawdź wtedy na próbce, czy Z mieści się w otworze, i najwyżej utnij ogon do 1,5 mm.

**Zużycie przyrządu:** po każdym drucie obejrzyj krawędzie rowka (0,7 mm) i dno otworu (1,3 mm pod S1). Jeśli krawędź jest wyrobiona albo dno przebite, wydrukuj przyrząd ponownie (10 min) albo gnij przy wyrobionym miejscu szczękami, a rowek traktuj tylko jako szablon do kontroli.

**S1** ma końce w prostopadłych płaszczyznach: A w dół (z otworu), B w bok (w płaszczyźnie). Tak ma być. Przy montażu wybierasz stronę blaszki ucha, z której wchodzi koniec A.

## Części kupne (z warsztatu)

- kardan 5/5 (bez oryginalnych wkrętów M4 – zostają);
- M5 × 12 (czop przedni, łeb krzyżakowy), M5 × 16 (czop tylny);
- M2 × 6 × 2 (osie powiek; do potwierdzenia, zapas: wkręt fabryczny MG90S – raport nocny);
- M3 × 16 × 3 (kołnierz–ramiona, w plastik Ø2,6);
- MG90S × 3 z orczykami jednoramiennymi i wkrętami fabrycznymi;
- drut sprężynowy Ø1,0, ok. 25 cm;
- wkręty do drewna 4 × 30–40 × 3.

## Montaż (na stole)

1. **Serwa na zero.** Podłącz do sterownika i ustaw 1500 µs. Orczyki zakładaj dopiero w kroku 7.
2. **Powieki w pierścieniu.** Powieka górna wewnątrz, dolna na zewnątrz, ucha na osi x. M2 × 6 od środka tuby (łeb od strony gałki) przez oba ucha w podkładkę. **Wkręcić do dna otworu** (ślepy, 2,4 mm): luz osiowy ustawia się sam, nie dociągać dalej. Do dźwigni (lewa strona) założyć druty powiek (Z, rysunek 3): korpus górnego po zewnętrznej stronie dźwigni, dolnego od strony gałki. Powieki zostawić **zamknięte** do kroku 6, bo otwarte zahaczają o gałkę przy nasuwaniu.
3. **Kardan.** Wyjąć wkręty M4 z obu piast i wkręcić je z powrotem po włożeniu czopów:
   - piasta przednia: M5 × 12 w otwór na pełne 7 mm;
   - piasta tylna: M5 × 16 wsunąć później (krok 5).
4. **Gałka.** M5 × 12 wsunąć w przednią piastę na ok. 6 mm (nie do dna), łeb bokiem w rowek T od dołu gałki, aż oprze się o koniec rowka. Docisnąć piastę do wierzchołka stożka, tak żeby łeb oparł się o podłogę 5,5 mm (trzpień wejdzie w piastę na 6,5 mm). **Trzymając docisk**, dokręcić wkręt M4 piasty kluczem L 2 mm. Podłoga jest wtedy ściśnięta między piastą a łbem, a tarcie blokuje obrót gałki na czopie: krótkie ramię w otworze M4 (od dołu, oś pionowa w gałce), długie wychodzi tylnym otworem. Druty S1 i S2 (Z, rysunki 1–2) włożyć w klepsydry uszu (blaszki w gałce).
5. **Gałka na uchwyt.** Tylną piastę postawić na słupku (oś sworznia poziomo). M5 × 16 wsunąć łbem w okno słupka i trzpieniem w górę do piasty. Piastę docisnąć do słupka i dokręcić jej M4 z boku (od −x, pod krawędzią gałki; gałkę odchylić w bok).
6. **Pierścień na uchwyt.** Nasunąć pierścień od przodu na gałkę (powieki zamknięte – otwarte zahaczą o gałkę), ramiona trafiają w otwory kołnierza. 3 × M3 × 16 od przodu kołnierza.
7. **Serwa w ramkach.** S1 (prawa, wałek w −x), S2 (prawa wyżej, wałek w −x), S3 (lewa, wałek w górę). Wkręty fabryczne w ucha. Na orczykach przy 1500 µs założyć druty i nasadzić orczyk tak, żeby był:
   - S1: ramię w górę, obrócone o 6° **do tyłu** (od gałki);
   - S2: jak S1;
   - S3: ramię w +x (do środka) przy powiekach **otwartych do połowy** (25,75°). Zamknięcie wypada przy ok. +23°, pełne otwarcie przy ok. −25°.
   Kąty wokół zera (solver, druty o stałej długości):
   - S1: −42…+38°;
   - S2: −46…+40°;
   - S3: zamknięte +23°, otwarte −25°.
8. **Kalibracja na stronie w telefonie.** Najpierw zero każdej osi (gałka na wprost, powieki zamknięte = krawędzie na środku), potem krańce: ±35° / ±25°, powieki do 50°. Sprzężenie osi (S1 zmienia się do ok. 10° przy pełnym góra–dół): tabela kątów `node ../narzedzia/duze-oko-kinematyka.js <katalog_stl>/parametry.json siatka` (plik `parametry.json` tworzy `bash eksport.sh <katalog_stl>`).

## W dyni

1. Otwór Ø80 nożem według szablonu (maskownica Ø84 przyłożona do skórki). Wokół otworu zestrugać płaskie gniazdo Ø86 pod maskownicę.
2. Zmierzyć ściankę przy otworze. Jeśli różni się od `scianka` = 40 o więcej niż ±3 mm, przedrukować Pierścień i Uchwyt z nową wartością.
3. Moduł włożyć od środka, tubą w otwór. 3 wkręty do drewna 4 × 40 przez łapy kołnierza w miąższ: dokręcić do oporu, nie ściskać kołnierza (wnętrze dyni jest wklęsłe, łapy stoją do ok. 7 mm od ścianki).
4. Z zewnątrz nasunąć maskownicę na wystający koniec tuby (2 mm).
