# Review koncepcji podstawki v2 – Opus (25.10)

Recenzent adwersaryjny, tylko odczyt. Materiał: `20-analizy/2026-10-25-podstawka-koncepcja.md` + `.svg`, `30-projekt/PRD.md` §5, §7, §8, `AGENTS.md`, `50-elektronika/sprzet.md`, `polaczenia.md`, `dynia-v2-plan.md`, `20-analizy/2026-10-22-powerbank-a-obciazenie.md`. Brief: `2026-10-25-podstawka-koncepcja-brief.md`.

Układ współrzędnych jak w koncepcji: x w prawo, y od przodu (0) do tyłu (280), z od stołu. Rysunek z góry przeliczony z SVG (1,2 px/mm, x 700 = 0, y 620 = przód).

## Co sprawdziłem i się zgadza (bez uwag)

- **Wymagania PRD §5 i decyzje użytkownika:** powerbank wysuwa się do tyłu z otwartej lewej komory, dynia i elektronika stoją; mocowanie od środka; kable przez dno; szuflada drukowana z elektroniką; PIR z przodu, regulacja po wyjęciu uchwytu. Spełnione.
- **Łańcuch wymiarów (tabela cięcia = rysunek):** ścianki przednie 102 + 40 + 102 = 244 = 280 − 2 × 18; ścianka tylna x 172–262 = 90; otwór szuflady 154 przy szufladzie 150 (2 mm na stronę, wystarczy dla sklejki); ogranicznik x 20–92, y 98–116; szuflada y 116–280; powerbank y 130–290 (wystaje 10 mm); otwór Ø80 środek (140, 75), y 35–115, 17 mm od wewnętrznej strony ścianki przedniej; wtyki RJ45 przed szufladą y ≈ 94–116, pod tylną krawędzią otworu. Paski: 2 × 280 + 2 × 102 + 90 = 854 → „ok. 860” ✓; 146 + 72 = 218 → „ok. 220” ✓.
- **Wysokości:** wnętrze z 12–57; szuflada z dnem 2,4 → góra elementów z 46,4; luz pod płytą 10,6 ✓. Złącze RJ45 na dnie szuflady z 14,4–34,4 ✓. Wtyk poziomo + łuk skrętki R ≈ 25 do pionu mieści się w strefie przedniej (98 × 45) i wchodzi w otwór ✓.
- **Nośność:** płyta 18 mm, przęsło 244, 98 N w środku: ugięcie ok. 0,03 mm, naprężenie ok. 0,4 MPa (E ≈ 7 GPa). Pomijalne. Środek nad szufladą bez podpory to nie problem.
- **Przewracanie:** atan(140 / 225) = 32° ✓ (środek ciężkości 200–225 nad stołem, zależnie od kształtu).
- **Brzuch dyni nad PIR i nad tylną krawędzią:** model elipsoidy D 380 × H 300: przy r = 140 (krawędź podstawki) dynia jest ok. 50 mm nad płytą (z ≈ 125). Dłoń przy powerbanku (z 14–46) mieści się pod brzuchem; PIR (z ≈ 35) ma brzuch dopiero powyżej ok. 75° w górę, poza stożkiem ±55° ✓.
- **Druk:** szuflada 164 × 150 ≤ 180, dnem na stół; tuleja kołnierzem na stół; podkładki; uchwyt PIR kołnierzem na stół (rowki na płytkę pionowe, bez nawisów); osłonka. Okna na złącza RJ45 w pionowej ściance to mosty 16–20 mm – na Bambu bez podpór ✓.
- **Przypisanie żył T568B:** 5 V i masa w parach 1 (4/5) i 4 (7/8); w dużym oku sygnał powieki (3) z masą (6) w parze 3 ✓. Łączniki liniowe są zwykle 1:1, kontrola miernikiem wystarczy ✓. Liczba wtyków 12 (6 po uproszczeniu) i łączników 6 (3) ✓.
- **Rachunek spadków dla samego kabla:** sprawdzony, liczby się zgadzają (Cu 0,126 / 0,105 Ω przy 1,5 m; CCA ×1,79). Prąd na żyłę ≤ 0,38 A ciągle, 1,05 A chwilowo – OK.
- **Osłonka PIR:** wzór atan(14 / (L + 3)) jest spójny z założeniem, że element pyro leży ok. 3 mm za czołem kołnierza (L = 10 → 47°, L = 20 → 31°) ✓.

## Uwagi (od najpoważniejszej)

KRYTYCZNYCH brak.

**1. WAŻNE – prawa komora szuflady: wtyki za złączami kolidują z PCA9685 i kondensatorem (rysunek z góry).**
Miejsce: SVG, prawa komora. Złącza y 118–156 (x 101–157). Za nimi wtyki odcinków do PCA (ok. 22 mm) + wyjście żył: y 156–≈190. PCA9685 narysowany w x 105–130, y 165–227, kondensator w (150, 175) – oba w strefie wtyków. Scenariusz: przy rozmieszczeniu z rysunku wtyki się nie wepną albo PCA nie wejdzie na słupki. Poprawka: zwymiarowany układ komory (głębokość wewnętrzna ≈ 158): złącza 38 + wtyk 22 + rozejście żył 15 = 75, za tym PCA 62 wzdłuż osi y (do ≈ 137 od czoła), ESP32-C3 18 + kondensator + gniazdo USB-C obok PCA (70 − 25 = 45 szerokości). Mieści się, ale trzeba to narysować. Pewność: wysoka (kolizja na rysunku), średnia co do wymiarów wtyku.

**2. WAŻNE – zapas skrętek 20 cm nie wystarcza do wpięcia i wypięcia wtyków w szufladzie.**
Miejsce: „Jak to działa”, „Okablowanie”. Złącza są w przedniej ściance szuflady, zwrócone do przodu, czyli do wnętrza podstawki. Do wtyku można sięgnąć ręką dopiero, gdy czoło szuflady wyjdzie ok. 60–80 mm za tylną krawędź (y ≈ 340–360). Od normalnego położenia wtyku (y ≈ 94) to 250–270 mm drogi, przy 200 mm zapasu. Wysunięcie do serwisu PCA (115–160 mm) mieści się w 20 cm, ale wypięcie skrętki już nie (zatrzask wtyku jest wtedy pod płytą). Poprawka: zapas 30 cm na skrętkach i przewodzie PIR (kabel jest); w opisie montażu: pierwsze wpięcie przy szufladzie wyjętej, zanim dynia stanie na podstawce, a zapas po wsunięciu szuflady wciągnąć od środka dyni. Pewność: średnio-wysoka.

**3. WAŻNE – rachunek spadków pomija opór styków i wspólny tor zasilania; wniosek „ok. 4,6 V szczytowo” jest zawyżony.**
Miejsce: tabela „Prąd i spadek napięcia”. Na każdej żyle jest 4 × styk RJ45 (2 łączniki × 2 strony) + Dupont przy PCA, ok. 20–50 mΩ każdy, czyli 0,1–0,25 Ω na żyłę; przy 2–3 żyłach równolegle to dodatkowe 0,08–0,2 Ω pętli, tyle co sam kabel 1,1 m. Do tego wspólny kabel USB-C + gniazdo przy ok. 3 A szczytowo (2 SG90 + 3 MG90S): 0,3–0,6 V. Szacunek dla dużego oka na CCA: ok. 3,9–4,5 V na serwie chwilowo, a nie 4,6 V. MG90S raczej zadziała (wolniej), ale nie ma tego w rachunku. Poprawka: (a) uproszczenie „bez łącznika po stronie dyni” jako wariant **domyślny** (odpadają 2 z 4 styków na żyłę, mniej części); (b) test: pomiar napięcia (miernik min/max) na rozdzielaczu dużego oka przy starcie 3 MG90S naraz na docelowym okablowaniu i Baseusie, kryterium ≥ 4,3 V; poniżej – W1/W2 z koncepcji. Pewność: średnia (opór styków to typowe wartości, nie pomiar).

**4. WAŻNE – wkręty dynia → płyta: długość nie uwzględnia podkładki, a okrąg Ø140 to założenie, nie fakt.**
Miejsce: tabela założeń, M1, SVG (widok z boku). (a) Długość `t` + 15 przy podkładce 4 mm daje 11 mm w płycie, nie 15. Na rysunku wkręt ma już 60 mm (4 + 40 + 15 + 1) przy tekście „≈ 55”. Poprawnie: długość = `t` + 4 + 15 (najwyżej `t` + 4 + 17, żeby ostrze nie wyszło pod płytę; nawet wyjście 3 mm nie zahaczy szuflady przy luzie 10,6). (b) „Na okręgu Ø140 (tam dynia leży na płycie)”: dynia niekupiona. Przy zaokrąglonym dnie (elipsoida D 350–400) na r = 70 dno jest 9–12 mm nad płytą; wkręt przejdzie przez powietrze i dociągnięcie przechyli dynię albo zgniecie miąższ. Poprawka: położenie wkrętów wyznaczyć po postawieniu dyni (gdzie dotyka płyty), warunki: ≥ 25 mm od krawędzi otworu Ø80, wkręty rozłożone mniej więcej co 120°. Wkręty do drewna nie potrzebują otworów w płycie, więc koncepcja nic na tym nie traci. Pewność: wysoka (a), średnia (b).

**5. WAŻNE – kołnierz uchwytu PIR zachodzi na ścianki tylko po 5 mm; wkręt 3 × 12 trafia 2,5 mm od czoła sklejki.**
Miejsce: PIR, tabela druku. Kołnierz 50, przerwa 40 → 5 mm zakładki na stronę; oś wkrętu Ø3 2,5 mm od krawędzi, czyli ok. 1 mm materiału. Krawędź się wyłamie przy pierwszym albo drugim wykręceniu, a uchwyt wykręca się przy każdej regulacji. Poprawka: kołnierz szerszy, 64–70 (zakładka 12–15, wkręt ≥ 7 mm od krawędzi); wysokość 55 może zostać. Pewność: wysoka.

**6. DROBNE – sprzeczność: wysokość PIR.**
Tekst: „40–60 mm nad stołem”. Z geometrii: wnętrze z 12–57, płytka 24 na środku → środek kopułki z ≈ 35, kopułka z 23–46. Dla działania bez znaczenia (stożek ±55° obejmuje ludzi przed stołem), ale trzeba poprawić liczbę. Pewność: wysoka.

**7. DROBNE – sprzeczność: listwa prowadząca na rysunku.**
Tabela: y 116–262 (146). SVG: y 146–262 (116 mm). Poprawić rysunek. Pewność: wysoka.

**8. DROBNE – wtyki Dupont na żyłach skrętki.**
Miejsce: tor po stronie PCA9685. Jeśli kabel użytkownika ma żyły drutowe (typowy kabel instalacyjny), zacisk Dupont na drucie 24 AWG pęka albo traci styk przy ruchach szuflady – tu płynie do 1 A na pin. Poprawka: odcinki w szufladzie z linki (patchcord) albo żyły przylutowane do listwy goldpin wpinanej w PCA. Wymaga pytania, jaki kabel ma użytkownik. Pewność: średnia.

**9. DROBNE – mocowanie złącza RJ45 w gnieździe szuflady nieokreślone.**
Złącze liniowe to gładki prostopadłościan. Wpięcie wtyku wciska je ok. 20–30 N do komory, wypięcie wyciąga. Poprawka: gniazdo z oporem z obu stron (kieszeń z progiem od środka + zatrzask albo dociskowa listewka), luz 0,25–0,3 wg tabeli. Pewność: wysoka (brak w opisie).

**10. DROBNE – tuleja z kołnierzem: wątpliwy zysk.**
Wtyki RJ45 (12 × 14) przechodzą przez sam otwór Ø80 bez tulei. Sok z przeciętego miąższu ścianek otworu i tak spływa po zewnętrznej stronie tulei (szczelina 2 mm) i kapie przez otwór płyty na wtyki (y 94–116 leży pod otworem). Kołnierz chroni tylko przed sokiem z dna wnętrza, a ten przy otworze 65 mm od środka spływa raczej do środka. Płaski kołnierz Ø100 na zakrzywionym dnie wnętrza będzie się kiwał. Od podkładki tylnego-bocznego wkrętu dzieli go 2,6 mm (wkręt (79, 105) jest 67,6 od osi otworu: 67,6 − 50 − 15). Poprawka: tuleję usunąć albo zostawić jako opcję; jeśli zostaje – wkręty dalej (wynika z p. 4). Pewność: średnia.

**11. DROBNE – PIR 20 cm od ESP32-C3 przy stale włączonym punkcie dostępu.**
Punkt dostępu działa stale (podtrzymanie powerbanku), a HC-SR501 bywa wyzwalany przez nadajnik 2,4 GHz z kilkunastu cm. Test „PIR 10 min bez ludzi” jest w planie. Tanio: ESP32-C3 na tył prawej komory (y ≈ 250–270, ok. 25 cm od PIR, antena od PIR). Pewność: średnia.

**12. DROBNE – gniazdo USB-C (breakout) w `sprzet.md` ma „sprawdzić, czy jest w warsztacie”.**
Koncepcja na nim opiera tor zasilania. Zgodnie z AGENTS.md: potwierdzić istnienie przed krokiem 2 (zapas: kabel USB-C z odciętym końcem do zacisku V+). Pewność: wysoka (fakt z repo).

**13. DROBNE – trasowanie otworu w dyni.**
Otwór w dyni musi trafić nad otwór w płycie (65 mm przed środkiem). W opisie montażu brakuje kroku: postawić dynię na samej płycie (przed przykręceniem do ścianek) i odrysować Ø80 od spodu przez otwór płyty. Pewność: średnia.

## Co można usunąć bez utraty wymagań (pkt 10 briefu)

- Wariant M2 (tuleja z łapami) – rekomendacja to M1; M2 tylko zaciemnia koncepcję.
- Łączniki i odcinki po stronie dyni – zrobić wariant domyślny (p. 3): −3 łączniki, −3 wtyki, −2 styki na żyłę.
- Tuleja z kołnierzem – opcja albo usunąć (p. 10).
- Stały okrąg Ø140 – zastąpić warunkiem położenia (p. 4).

## Werdykt

Tak, koncepcję można pokazać użytkownikowi do akceptacji po minimalnych poprawkach w tekście i rysunku: zwymiarować prawą komorę bez kolizji wtyków z PCA (p. 1), zapas skrętek 30 cm (p. 2), długość wkrętu `t` + 4 + 15 i położenie wkrętów wg styku dyni (p. 4), kołnierz PIR 64–70 (p. 5); spadek napięcia (p. 3) to test przy uruchomieniu, a nie zmiana koncepcji.

## Propozycje (poza zakresem)

- Złącza RJ45 w stałym gnieździe na dnie podstawki przy otworze, a z szuflady jeden krótki odcinek z zapasem: wpinanie przez otwór Ø80 przed postawieniem dyni, szuflada wychodzi bez rozpinania skrętek.
- 5 V do rozdzielaczy prosto z szyny gniazda USB-C (lutem), a nie przez piny V+ listew PCA9685.
