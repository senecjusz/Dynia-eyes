# Duże oko v2 – druk, montaż i kalibracja

Model: [`duze-oko-v2.scad`](duze-oko-v2.scad) (OpenSCAD, zmienne na górze pliku). Eksport: `bash eksport.sh` → `40-cad/3mf/Duze oko v2/`: jeden 3MF na część (nazwa = moduł w .scad) i zbiorczy „Duze oko v2 - wszystkie czesci.3mf” z **8 osobnymi obiektami nazwanymi jak części** (składa go `40-cad/narzedzia/zbiorczy_3mf.js`). Zbiorczy służy do przeglądu i rozdzielenia na stoły w Bambu Studio; całość nie mieści się na jednym stole A1 mini. Druty: [`../druty/duze-oko-v2-druty-1do1.svg`](../druty/duze-oko-v2-druty-1do1.svg). Kinematyka: `node ../narzedzia/duze-oko-kinematyka.js`.

## Druk (A1 mini, PLA, warstwa 0,2, 3 obrysy)

| Kolejność | Plik 3MF | Kolor | Orientacja | Podpory | Uwagi |
|---|---|---|---|---|---|
| 1 | Probka drutu | dowolny | płytką na stole | brak | 2 kostki z otworami Ø2,2 i Ø2,3 (jak w gałce): sprawdzasz, w który kołek Ø2 wchodzi z luzem pod klej i czy piasta kardana 2/2 nasuwa się na kołek; ok. 10 min |
| 2 | Pierscien | pomarańcz | kołnierzem na stole | brak | długość tuby = `scianka` + 2. **Drukować po zmierzeniu dyni** (zmienna `scianka`, domyślnie 40) |
| 3 | Uchwyt serw | pomarańcz | płytą na stole | brak | ramiona = 84 − `scianka`, więc też po pomiarze dyni |
| 4 | Galka | **biały** | krawędzią (tył, z = −4) na stole | **drzewiaste malowane** pod wierzchołkiem stożka w środku i pod obiema kostkami kardanów | podpory wyjąć przez tylny otwór; otwór kołka w kostce przetrzeć wiertłem Ø2,2 |
| 5 | Powieka gorna, Powieka dolna | pomarańcz | uszami na stole, czaszą do góry | **drzewiaste pod wewnętrzną stroną czaszy i pod uszkiem drutu** na tylnej krawędzi (tylko od stołu) | ślady zostają po stronie gałki, niewidoczne; otwór uszka przepchnąć drutem Ø1 |
| 5 | Przedluzenie orczyka x2 | dowolny | pogłębieniem na stole, rowkiem do góry | brak | nakłada się wgłębieniem na fabryczny orczyk serwa powieki; 2 kołki z drutu Ø1 przez otwory orczyka 13,5 i 17,5 mm (końce zagiąć), wkręt orczyka przez środek |
| 6 | Maskownica | pomarańcz | płasko | brak | wcisk na tubę Ø79; za luźna → klej, za ciasna → papier ścierny |

Po druku rozwiercić (wiertło albo przekręcany drut):
- otwory orczyków S1 (17,5) i S2 (13,5) Ø2,5 na pręt Ø2;
- uszka powiek Ø1,4;
- otwory na końcu przedłużeń orczyków (25) i kołki (13,5 / 17,5) Ø1,4;
- serwa powiek: fabryczne otwory orczyka 13,5 i 17,5 na kołki Ø1 (bez rozwiercania, jeśli drut wchodzi).

**Mosty bez podpór** (Bambu mostkuje je bez problemu, sprawdzić po wydruku):
- Uchwyt: nad oknami serw 13,1 mm i strop okna łba M5 w słupku 10,5 mm. Zwis > 0,3 mm zebrać nożykiem, bo przeszkadza we wsuwaniu korpusu i łba.
- Powieki: płaskie stopki 0,6 mm pod uszami na stole, czasze na podporach drzewiastych.

## Druty: gięcie ręczne (dokładność ±2 mm, ±10°, poprawiasz doginaniem)

Narzędzia: płaskie kombinerki, obcinaczki, marker, klucz imbusowy do wkrętów M3 kardanów 2/2, klej (CA albo epoksyd).
Materiał:
- drut sprężynowy Ø1,0, ok. 35 cm;
- kilka kawałków izolacji po 1,5–2 mm (**koszulki**), zsuniętej z przewodu o żyle ok. 1 mm (AWG 18–20). Koszulka wchodzi na drut z oporem.

Długość i zero ustawia kalibracja w ESP32, więc długość cięcia nie musi być dokładna: cięcie = rozstaw + 25 mm.

**S1 i S2 (gałka) – kardany 2/2 i pręty Ø2:**
1. **Kołek.** Utnij 2 kawałki drutu ocynkowanego Ø2 po ok. 16 mm. Każdy wklej na 8 mm w kostkę w gałce (otwór Ø2,2, klej). Druga połowa wystaje w stronę tylnego otworu.
2. **Kardan na kołek.** Nasuń piastę kardana 2/2 na kołek i dokręć jej wkręt M3. **Ustawienie krzyżaka:** sworzeń krzyżaka bliższy pręta ustaw równolegle do osi serwa (S1 i S2: wzdłuż x). Wtedy pręt w orczyku przechyla się najmniej.
3. **Pręt.** Drut ocynkowany Ø2 ok. 50 mm. Na jednym końcu zagięcie: noga ok. 6 mm przez otwór orczyka, a koniec nogi za orczykiem zagięty o 90° jako ogon, żeby nie wypadła.
   - S1: zagięcie ok. 90°, otwór Ø2,5. Sprawdź próbą: noga wchodzi w otwór bez napinania pręta.
   - S2: zagięcie ok. 105° (pręt S2 schodzi do orczyka pod kątem), otwór Ø2,5. Sprawdź próbą: noga wchodzi w otwór bez napinania pręta.
4. **Długość.** Serwo na 1500 µs, orczyk w zerze, gałka na wprost. Prosty koniec pręta wsuń w drugą piastę kardana, ustaw gałkę na wprost i dokręć wkręt M3. Resztę wyrówna kalibracja.
5. **Test ręką.** Przeprowadź gałkę po czterech narożnikach (±35° / ±25°). Nic nie może się zacinać.

**Druty powiek (górna → serwo SG, dolna → serwo SD), każdy osobno:**
1. Drut Ø1,0, ok. 45 mm. Na jednym końcu L (noga ok. 6 mm), na oko.
2. Noga L w otwór **uszka na tylnej krawędzi powieki**; na koniec nogi nasuń koszulkę (albo zagnij koniec), żeby L nie wysunęło się z otworu.
3. Serwo powieki na 1500 µs, przedłużenie na orczyku ramieniem na zewnątrz (górne serwo w górę, dolne w dół), powieka w połowie otwarcia. Zaznacz markerem drut przy otworze przedłużenia (25 mm), zegnij tam L, włóż i zabezpiecz koszulką jak w p. 2.
4. Kalibracja każdego serwa osobno: zero = powieka zamknięta, kraniec = otwarta. Błąd długości ±2 mm kasuje ustawienie serwa – nic nie doginasz.

## Części kupne (z warsztatu)

- kardan 5/5 (bez oryginalnych wkrętów M4 – zostają);
- M5 × 12 (czop przedni, łeb krzyżakowy), M5 × 16 (czop tylny);
- M2 × 6 × 2 (osie powiek; do potwierdzenia, zapas: wkręt fabryczny MG90S – raport nocny);
- M3 × 16 × 3 (kołnierz–ramiona, w plastik Ø2,6);
- MG90S × 3 z orczykami jednoramiennymi i wkrętami fabrycznymi;
- drut sprężynowy Ø1,0, ok. 15 cm (druty powiek) i drut ocynkowany Ø2,0, ok. 15 cm (kołki i pręty S1/S2);
- 2 × kardan 2/2 (z warsztatu);
- izolacja z przewodu o żyle ok. 1 mm (koszulki: 4 końce L drutów powiek);
- klej CA albo epoksyd (kołki kardanów);
- wkręty do drewna 4 × 30–40 × 3.

## Montaż (na stole)

1. **Serwa na zero.** Podłącz do sterownika i ustaw 1500 µs. Orczyki zakładaj dopiero w kroku 7.
2. **Powieki w pierścieniu.** Powieka górna wewnątrz, dolna na zewnątrz, ucha na osi x. M2 × 6 od środka tuby (łeb od strony gałki) przez oba ucha w podkładkę. **Wkręcić do dna otworu** (ślepy, 2,4 mm): luz osiowy ustawia się sam, nie dociągać dalej. Druty powiek zakładasz w kroku 7 (uszka na tylnej krawędzi powiek, sekcja „Druty”). Powieki zostawić **zamknięte** do kroku 6, bo otwarte zahaczają o gałkę przy nasuwaniu.
3. **Kardan.** Wyjąć wkręty M4 z obu piast i wkręcić je z powrotem po włożeniu czopów:
   - piasta przednia: M5 × 12 w otwór na pełne 7 mm;
   - piasta tylna: M5 × 16 wsunąć później (krok 5).
4. **Gałka.** M5 × 12 wsunąć w przednią piastę na ok. 6 mm (nie do dna), łeb bokiem w rowek T od dołu gałki, aż oprze się o koniec rowka. Docisnąć piastę do wierzchołka stożka, tak żeby łeb oparł się o podłogę 5,5 mm (trzpień wejdzie w piastę na 6,5 mm). **Trzymając docisk**, dokręcić wkręt M4 piasty kluczem L 2 mm. Podłoga jest wtedy ściśnięta między piastą a łbem, a tarcie blokuje obrót gałki na czopie: krótkie ramię w otworze M4 (od dołu, oś pionowa w gałce), długie wychodzi tylnym otworem. Kołki i kardany 2/2 w gałce (sekcja „Druty”, kroki 1–2), zanim gałka trafi na uchwyt.
5. **Gałka na uchwyt.** Tylną piastę postawić na słupku (oś sworznia poziomo). M5 × 16 wsunąć łbem w okno słupka i trzpieniem w górę do piasty. Piastę docisnąć do słupka i dokręcić jej M4 z boku (od −x, pod krawędzią gałki; gałkę odchylić w bok).
6. **Pierścień na uchwyt.** Nasunąć pierścień od przodu na gałkę (powieki zamknięte – otwarte zahaczą o gałkę), ramiona trafiają w otwory kołnierza. 3 × M3 × 16 od przodu kołnierza.
7. **Serwa w ramkach.** S1 (prawa, wałek w −x), S2 (prawa wyżej, wałek w −x), SG i SD (lewa, wałki w +x, górne i dolne). Wkręty fabryczne w ucha. Na orczykach przy 1500 µs założyć druty i nasadzić orczyk tak, żeby był:
   - S1: ramię w górę, obrócone o 6° **do tyłu** (od gałki);
   - S2: jak S1;
   - SG / SD: przedłużenie ramieniem na zewnątrz (SG w górę, SD w dół) przy powiece otwartej do połowy (25,75°). Zamknięcie przy ok. +36°, pełne otwarcie przy ok. −31°.
   Kąty wokół zera (solver, druty o stałej długości):
   - S1: −42…+38°;
   - S2: −46…+40°;
   - SG / SD: zamknięte +36°, otwarte −31° (przy drucie ±2 mm: do +42° / −38°).
8. **Kalibracja na stronie w telefonie.** Najpierw zero każdej osi (gałka na wprost, powieki zamknięte = krawędzie na środku), potem krańce: ±35° / ±25°, powieki do 50°. Sprzężenie osi (S1 zmienia się do ok. 10° przy pełnym góra–dół): tabela kątów `node ../narzedzia/duze-oko-kinematyka.js <katalog_stl>/parametry.json siatka` (plik `parametry.json` tworzy `bash eksport.sh <katalog_stl>`).

## W dyni

1. Otwór Ø80 nożem według szablonu (maskownica Ø84 przyłożona do skórki). Wokół otworu zestrugać płaskie gniazdo Ø86 pod maskownicę.
2. Zmierzyć ściankę przy otworze. Jeśli różni się od `scianka` = 40 o więcej niż ±3 mm, przedrukować Pierścień i Uchwyt z nową wartością.
3. Moduł włożyć od środka, tubą w otwór. 3 wkręty do drewna 4 × 40 przez łapy kołnierza w miąższ: dokręcić do oporu, nie ściskać kołnierza (wnętrze dyni jest wklęsłe, łapy stoją do ok. 7 mm od ścianki).
4. Z zewnątrz nasunąć maskownicę na wystający koniec tuby (2 mm).
