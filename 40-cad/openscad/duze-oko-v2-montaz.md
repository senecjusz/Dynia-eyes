# Duże oko v2 – druk, montaż i kalibracja

Model: [`duze-oko-v2.scad`](duze-oko-v2.scad) (OpenSCAD, zmienne na górze pliku). Eksport: `bash eksport.sh` → `40-cad/3mf/Duze oko v2/`: jeden 3MF na część (nazwa = moduł w .scad) i zbiorczy „Duze oko v2 - wszystkie czesci.3mf” (do przeglądu, nie mieści się na jednym stole A1 mini). Druty: [`../druty/duze-oko-v2-druty-1do1.svg`](../druty/duze-oko-v2-druty-1do1.svg). Kinematyka: `node ../narzedzia/duze-oko-kinematyka.js`.

## Druk (A1 mini, PLA, warstwa 0,2, 3 obrysy)

| Kolejność | Plik 3MF | Kolor | Orientacja | Podpory | Uwagi |
|---|---|---|---|---|---|
| 1 | Probka drutu | dowolny | jak w pliku | brak | test klepsydry, ok. 10 min |
| 2 | Pierscien | pomarańcz | kołnierzem na stole | brak | długość tuby = `scianka` + 2. **Drukować po zmierzeniu dyni** (zmienna `scianka`, domyślnie 40) |
| 3 | Uchwyt serw | pomarańcz | płytą na stole | brak | ramiona = 84 − `scianka`, więc też po pomiarze dyni |
| 4 | Galka | **biały** | kołnierzem (tył, z = −8) na stole | **jedna podpora drzewiasta** pod wierzchołkiem stożka w środku (malowanie podpór tylko tam) | podporę wyjąć przez tylny otwór |
| 5 | Powieka gorna, Powieka dolna | pomarańcz | uszami na stole, czaszą do góry | **drzewiaste pod wewnętrzną stroną czaszy** (tylko od stołu) | ślady zostają po stronie gałki, niewidoczne |
| 6 | Maskownica | pomarańcz | płasko | brak | wcisk na tubę Ø79; za luźna → klej, za ciasna → papier ścierny |

Po druku rozwiercić: klepsydry w żebrach gałki Ø1,7, dźwignie powiek Ø1,2, otwory orczyków S1 (17,5) i S2 (13,5) Ø1,3, otwór orczyka S3 (7,5) Ø2,1.

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
2. **Powieki w pierścieniu.** Powieka górna wewnątrz, dolna na zewnątrz, ucha na osi x. M2 × 6 od środka tuby (łeb od strony gałki) przez oba ucha w podkładkę. **Wkręcić do dna otworu** (ślepy, 2,4 mm): luz osiowy ustawia się sam, nie dociągać dalej. Do dźwigni (lewa strona) założyć druty powiek (Z, rysunek 3): górny Z od zewnątrz dźwigni, dolny od strony gałki. Powieki zostawić **zamknięte**.
3. **Kardan.** Wyjąć wkręty M4 z obu piast i wkręcić je z powrotem po włożeniu czopów:
   - piasta przednia: M5 × 12 w otwór na pełne 7 mm;
   - piasta tylna: M5 × 16 wsunąć później (krok 5).
4. **Gałka.** Łeb M5 × 12 (z piastą i kardanem) wsunąć bokiem w rowek T od dołu gałki, aż oprze się o koniec rowka. Czoło piasty dosunąć do wierzchołka stożka. Wkręt M4 piasty dokręcić kluczem L 2 mm: krótkie ramię w otworze M4 (od dołu, oś pionowa w gałce), długie wychodzi tylnym otworem. Druty S1 i S2 (Z, rysunki 1–2) włożyć w klepsydry żeber.
5. **Gałka na uchwyt.** Tylną piastę postawić na słupku (oś sworznia poziomo). M5 × 16 wsunąć łbem w okno słupka i trzpieniem w górę do piasty. Piastę docisnąć do słupka i dokręcić jej M4 z boku (od −x, pod krawędzią gałki; gałkę odchylić w bok).
6. **Pierścień na uchwyt.** Nasunąć pierścień od przodu na gałkę (powieki zamknięte – otwarte zahaczą o gałkę), ramiona trafiają w otwory kołnierza. 3 × M3 × 16 od przodu kołnierza.
7. **Serwa w ramkach.** S1 (prawa, wałek w −x), S2 (prawa wyżej, wałek w −x), S3 (lewa, wałek w górę). Wkręty fabryczne w ucha. Na orczykach przy 1500 µs założyć druty i nasadzić orczyk tak, żeby był:
   - S1: ramię w górę, obrócone o 6° w stronę gałki;
   - S2: jak S1;
   - S3: ramię w +x (do środka).
   Kąty wokół zera (solver, druty o stałej długości):
   - S1: −46…+45°;
   - S2: −50…+52°;
   - S3: zamknięte +23°, otwarte −25°.
8. **Kalibracja na stronie w telefonie.** Najpierw zero każdej osi (gałka na wprost, powieki zamknięte = krawędzie na środku), potem krańce: ±35° / ±25°, powieki do 50°. Sprzężenie osi (S1 zmienia się do ok. 10° przy pełnym góra–dół) – tabela w `node ../narzedzia/duze-oko-kinematyka.js '{...}' siatka`.

## W dyni

1. Otwór Ø80 nożem według szablonu (maskownica Ø84 przyłożona do skórki). Wokół otworu zestrugać płaskie gniazdo Ø86 pod maskownicę.
2. Zmierzyć ściankę przy otworze. Jeśli różni się od `scianka` = 40 o więcej niż ±3 mm, przedrukować Pierścień i Uchwyt z nową wartością.
3. Moduł włożyć od środka, tubą w otwór. 3 wkręty do drewna 4 × 40 przez łapy kołnierza w miąższ: dokręcić do oporu, nie ściskać kołnierza (wnętrze dyni jest wklęsłe, łapy stoją do ok. 7 mm od ścianki).
4. Z zewnątrz nasunąć maskownicę na wystający koniec tuby (2 mm).
