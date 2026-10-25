# Podstawka – weryfikacja poprawek (Opus), 25.10.2026

Zakres: brief `2026-10-25-podstawka-poprawki-brief.md`, model `40-cad/openscad/podstawka.scad` (02:21:50), siatki `40-cad/3mf/Podstawka v1/`. Tylko odczyt. Skrypty i świeże eksporty: `C:/Users/Karol/AppData/Local/Temp/opus-weryf/` (`skr/an.js` gabaryty, objętość, nawisy > 45°; `skr/pkt.js` punkt w bryle; `skr/gw.js` flanki i odległość tuleja–nakrętka).

**Zgodność siatek z kodem.** Świeży eksport STL z bieżącego `.scad` daje te same wartości co 3MF w repo: liczba trójkątów, gabaryty i objętość (lewa 516 tr., 89 661 mm³; prawa 288 tr.; X1C 312 tr.; kaseta 1500 tr.; osłonka 492 tr.). `sprawdz_siatki.js`: 9/9 OK. `skladowe_siatki.js`: 9 × 1 bryła.

## Najpierw: Szuflada lewa (A1 mini)

- Gabaryt **178,9 × 112,8 × 39,0** (x −9,5…169,4; y −11…101,8; z 0…39), czyli ≤ 180 × 180. Na stole A1 mini zostaje 0,55 mm na stronę, więc bez brimu i skirtu.
- Nawisy > 45° tylko w sklepieniach otworów M3 w żebrze (3 × 5,2 mm², z 7,2–7,65). Uchwyt ma dokładnie 45°. Dolna połowa otworu kopułki jest misą, a górę otwiera wycięcie, więc bez mostu. **Podpory zbędne.**
- Otwory M3 w żebrze: y 46,4 i 81,4, z 6, Ø3,3. Słupki kończą się na y 36,4 i zaczynają na 91,4. Łeb Ø5,5 zajmuje y 43,65–49,15 i 78,65–84,15, czyli 7,25 mm od słupka. Punkty (167,5; 46,4; 6) i (166; 46,4; 6) są puste, więc otwór jest drożny.
- PIR: pusto w (40; 1; 15), (40; 2,3; 15), (40; 10; 15) i (40; 24; 20), więc za płytką nie ma błony. Czoło ma Ø24 dookoła osi z 14 i wycięcie x 28…52 od z 14 do góry.

## Poprawki

**1. PIR – NAPRAWIONE, z jednym ryzykiem (niżej, P1).**
- Błona usunięta: kieszeń y 2,2…25 pusta.
- Płytka stoi na dnie (z 2…26), oś kopułki z = 14 = środek płytki (`pirZ` = 2 + 0 + 12).
- Wycięcie od góry ma szerokość 24 = Ø23 + 2 × 0,5.
- Szczelina 2,2 dla płytki 1,6 (0,3 na stronę), szerokość 32,6 dla 32. Prowadnice zachodzą 2,1 mm na krawędzie płytki od tyłu (y 2,2…4,6). Płytka opiera się o czoło pasami po 4 mm (x 24…28 i 52…56).

**2. Połówki A1 mini – NAPRAWIONE.**
- Otwory poza słupkami (liczby wyżej). Lewa połówka 178,9 × 112,8, prawa 55,9 × 104,8. Obie bez podpór.
- Łeb DIN 912 (3 mm) po lewej stronie żebra (x 166,4) sięga do x 163,4, czyli do czoła powerbanku. Powerbank opiera się wtedy o łeb, nie o słupek (164,4). Patrz B1.

**3. Gwint – NAPRAWIONE.**
- Siatka tulei w strefie r 36…38: normalne +45° (7428 mm²) i −45° (7063 mm²), poza tym tylko podstawa na stole. Rowek nakrętki ma ±45° (944 mm² na flankę). Pole przy ±65° (192 mm²) to fazki wejścia.
- Luz w kodzie: przesunięcie osiowe 0,2828 = 0,20 prostopadle do flank, dno rowka rc + 2,2 wobec wierzchołka rc + 2,0, otwór rc + 0,20 wobec rdzenia rc.
- Na siatkach nakrętka podniesiona o 45 mm (zgodnie z fazą): 810 wierzchołków w strefie gwintu, minimalna odległość ze znakiem **+0,190 mm**, 0 wierzchołków w materiale tulei. Kolizji brak.
- Kierunek zgodny: ta sama funkcja `zwoj`, helisa prawa w obu częściach.
- Drukowalność: flanki 45° bez podpór. Ząb nakrętki u otworu jest ostry (wierzchołek ok. 0,03 mm), bo przerwa u rdzenia tulei ma 0,2 mm. Próbka gwintu powie, czy to wystarcza.

**4. Tuleja – NAPRAWIONE.** `tulH` = 45 + 3 + 10 = 58, a siatka ma 120 × 120 × 58,00. Nad dnem wnętrza dyni zostaje 10 mm gwintu dla nakrętki 8 mm.

**5. Kaseta, wejście USB-C – NIE (P2).** Ramka jest, ale gniazdo patrzy do przodu, w szufladkę.

**6. Osłonka PIR – NAPRAWIONE.** Siatka y −14…15, czyli ścięcie 14 mm pod osią = `pirZ`. Dolna krawędź leży na poziomie stołu, nic pod nim.

## PSUJE DZIAŁANIE ALBO DRUK

**P1. Podstawa soczewki PIR a okrągła dolna połowa otworu w czole** (`szuflada()`, l. 167–168; dotyczy lewej połówki i wersji X1C)
- Soczewka HC-SR501 ma zwykle kwadratową podstawę ok. 23 × 23 mm i ok. 1 mm grubości, osadzoną płasko na płytce. To typowa budowa modułu: założenie, nie pomiar.
- Wycięcie w czole jest prostokątne tylko od osi w górę (z ≥ 14). Poniżej zostaje półokrąg R12. Narożniki kwadratu 23 × 23 leżą 16,3 mm od osi. Na siatce punkt (29; −1,5; 3) jest materiałem.
- Scenariusz porażki: podstawa soczewki opiera się o czoło i odsuwa płytkę o ok. 1 mm do tyłu. Płytka 1,6 + podstawa 1 = 2,6 mm nie mieści się w szczelinie 2,2 mm, więc PIR się nie wsunie.
- Poprawka (jedna zmiana): wycięcie prostokątne od dna, `translate([pirX - pirKop/2 - luzKop, -czoloT - 1, dnoSz]) cube([pirKop + 2*luzKop, czoloT + 2, czH])`. Okrągły otwór staje się wtedy zbędny. Płytka nadal opiera się o czoło pasami po 4 mm.
- Test bez CAD: przyłożyć moduł do kartki z okręgiem Ø24. Jeśli podstawa soczewki wychodzi poza okrąg, poprawka jest konieczna.
- Pewność: średnia co do kształtu podstawy, wysoka co do geometrii czoła.

**P2. Wejście zasilania USB-C w kasecie patrzy w tylną ściankę szufladki** (`kaseta()`, l. 207–212)
- Ramka leży w kasecie przy x 143,4…162 i y 0 (w podstawce x 185,8…204,4), wejście jest od przodu.
- Przód kasety (y 103,8 w podstawce) jest **2 mm** od tylnej ścianki szufladki (y 101,8). Wtyk ma 50 mm (decyzja 25.10), więc przy zamkniętej szufladce wtyk koliduje z jej tylną ścianką o ok. 48 mm. To ten sam błąd, który Opus 2 zgłosił dla ESP: poprawka go powtórzyła.
- Druga przeszkoda: przednia ścianka ramki (1,8 mm, otwór 7,5 mm) stoi przed gniazdem. Gniazdo USB-C ma 8,94 mm szerokości, a osłona wtyku ok. 12 × 6,5 mm, więc wtyk nie wejdzie do końca (szacunek, breakout niezmierzony).
- Poprawka: odsunąć gniazdo od przodu kasety tak, żeby czoło gniazda leżało na y ≥ `wtyk` (≈ 50–55 w kasecie, z wolnym przodem ramki). Kondensator stoi przy x 150, y 50, więc trzeba go przesunąć. Inna droga: zamiast gniazda zacisk śrubowy V+/GND na przeciętym kablu.
- Wolny pas z prawej strony kasety (x 212,4…236,8, 24,4 mm) jest za wąski na wtyk 50 mm skierowany w bok.
- Pewność: wysoka.

## BRZEGOWE

- B1. Łeb M3 DIN 912 po stronie powerbanku sięga do x 163,4 i odbiera 1 mm luzu powerbanku. Śruby wkładać od prawej (łeb na z 3,25–8,75, pod wtykiem), nakrętkę dać od lewej, śruba M3 × 8.
- B2. Lewa połówka ma 178,9 mm na stole 180 mm, więc bez brimu.
- B3. Fazka dolna otworu nakrętki: ok. 64° od pionu na wysokości 0,9 mm. Mały nawis przy stole, drukuje się.
- B4. Przyklejona osłonka blokuje wyjęcie PIR do góry: kopułka R11,5 w rurce R13. Regulacja potencjometrów wymaga wtedy zdjęcia osłonki.
- B5. Ramka ESP32-C3 ma otwór 9 mm na gniazdo 8,94 mm (0,03 mm na stronę). Przednia ścianka ramki stoi przed gniazdem, jak w P2.
- B6. Kieszeń PIR za płytką ma 22,8 mm. Dupont prosty (ok. 16,5 mm od płytki) plus gięcie przewodu mieści się na styk.

## Werdykt

Lewą połówkę szufladki można drukować dziś w nocy pod jednym warunkiem: podstawa soczewki posiadanego HC-SR501 mieści się w okręgu Ø24. Jeśli wychodzi poza niego (P1), trzeba najpierw przedłużyć wycięcie w czole do dna (jedna zmiana w kodzie i eksport). Prawa połówka, tuleja, nakrętka, próbki gwintu i osłonka są gotowe. Kaseta nie jest gotowa (P2).
