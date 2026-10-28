# Duże oko v3: druk, montaż i kontrola (OpenSCAD, noc 25/26.10)

Model: `duze-oko-v3.scad` (parametry na górze). Eksport: `bash eksport-v3.sh <katalog STL>` → `40-cad/3mf/Duze oko v3/`. Przemiatanie: `blender -b -P ../narzedzia/duze-oko-v3-przemiatanie.py -- <katalog STL> <wynik.txt>`. Render: `bash render-v3.sh <katalog STL>` → `podglad/duze-oko-v3/`.

Podstawa: koncepcja `20-analizy/2026-10-26-duze-oko-koncepcja-referencja.md`, decyzja PM `20-analizy/review/2026-10-26-odstepstwa-koncepcji-decyzja-pm.md` i review zgodności v3 (`20-analizy/review/2026-10-26-zgodnosc-v3-{opus,astra}.md`).

Odstępstwa bez zgody obu recenzentów są zrobione zgodnie z wymaganiami:
- płyta pozioma za tubą;
- zaczepy powiek 34 / 32,4 od osi przy x = ±5;
- moduł wklejany w tubę na gorąco;
- trzy rzeczywiste tuby 30/40/50;
- jedna centralna piasta gałki.

Układ: 0 = środek kuli, z do przodu, y w górę, x w prawo patrząc od przodu. Źrenica (czarny środek) najwyżej Ø20, gałka 24 mm przed rantem tuby i czasza ok. 111° od przodu to decyzje użytkownika z 26.10 (P4, P5, czasza). Pytania P1–P5 są zamknięte.

## 1. Części do druku (każda ≤ 180 mm, 1 bryła, 0 błędów siatki)

| Plik 3MF | Szt. | Wymiar | Orientacja i podpory |
|---|---|---|---|
| `Plyta` | 1 | 84 × 109 × 26 (z ramionami i słupkiem) | Płyta leży płasko. **Do druku pod kątem 45° (decyzja użytkownika 26.10) służy `Plyta + podpora (druk 45)`**; szczegóły pod tabelą |
| `Galka` | 1 | Ø60, krawędź tylna na z = −11 | Krawędzią na stole. **Podpory drzewiaste:** pod czołem piasty (z = +14, nad pustką), pod wewnętrznym końcem języczka L–P (7,2 mm wysięgu od podparcia 45°, 4 mm nad stołem) i pod spodem słupka zaczepu G–D (3 × 2 mm, 4 mm nad stołem). Słupek wisi na przedniej czaszy, ma nasadę ze skosem 45° od z = +4 i kończy się 1 mm pod otworem, bo niżej pracuje pręt. Podpory zdejmujesz przez otwór tylny |
| `Powieka gorna` | 1 | R33,2–34,4 | Krawędzią tylną (z = −3) na stole, z brimem (pasek 1,2 mm). **Podpora pod uszkiem drutu:** uszko (blok 2,8 wzdłuż otworu × 4 promieniowo × 4,3, ścianki wokół otworu ≥ 1,1) zaczyna się 2,6 mm nad stołem; pod nim podpora ze slicera. Otwór Ø1,4 leży poziomo, z daszkiem 45° do góry (bez podpory w otworze). Nad wycięciem przy uszku jest mostek 10 mm. Ewentualnie podpora wewnątrz pod szczytem kopułki |
| `Powieka dolna` | 1 | R31,0–32,2 | jak górna, także podpora pod uszkiem drutu |
| `Przedluzenie orczyka (druk x2)` | 2 | 33 × 10 × 3,7 (listwa 2,5 + ścianki rowka 1,2) | płasko, ściankami rowka do góry, bez podpór |
| `Tuba 30`, `Tuba 40`, `Tuba 50` | 1 (ta, która pasuje do ściany dyni) | Ø79,5 / Ø76,3, kołnierz Ø92 × 3, 8 łap co 45° (łapę w miejscu kolizji pomijasz); wysokość 33 / 43 / 53; w tylnym końcu ścianka 2,5 zamykająca dół otworu do 26 pod osią (wycięcie x −12…+2 na drut powieki dolnej) | Kołnierzem na stole, ścianka też na stole. Po bokach (x ±) szczeliny 5,0 przez ściankę od tylnego końca do osi powiek: przejście łbów wkrętów osi M2 |
| `Wspornik plyty 30/40/50 (druk x2)` | 2 (lewy i prawy, w jednym pliku), numer jak tuby | L ze wzmocnieniem 45° i zaczepem na górnej krawędzi ścianki tuby, szer. 14, noga i półka gr. 4; półka 34 / 24 / 14 (tuba 30 / 40 / 50), 12 pod spodem płyty | Na boku (profil L na stole), bez podpór |
| `Maskownica` | 1 | Ø84 / Ø76,3 × 2 | płasko |
| `Trzpien kardana M3 (2 + 2 zapas + warianty)` | 2 (+2 zapasowe) | kołnierz Ø9,3 × 5,2, trzpień Ø4,95 × 7,25, razem 12,45 | Pionowo, kołnierzem na stole, warstwa 0,12, bez podpór. W pliku 7 obiektów: 4 × T4.95 K9.3 (nominalne) i warianty do przymiarki T4.9 K9.3, T5.0 K9.3, T4.95 K9.2 (T = trzpień, K = kołnierz) |
| `Plyta + podpora (druk 45)` | 1 | płyta pod 45° z projektowaną podporą, 2 obiekty | **To jest plik do druku płyty** (opis pod tabelą); `Podpora plyty (druk 45)` osobno |
| `Duze oko v3 - wszystkie czesci` | – | wszystkie powyższe jako osobne obiekty, bez podpory płyty (ta tylko w pliku z płytą pod 45°) i bez trzpieni kardana (osobny plik) | Do rozłożenia na kilka stołów: obiekty zajmują ok. 233 × 399 mm |

**Druk płyty pod kątem 45°:**
- **Obrót:** wokół osi x o 45°, wierzchem (strona serw) i przodem (słupki) do góry. Tył płyty stoi na stopce: ścięcie 45° tylnej dolnej krawędzi (przyprostokątne 3 mm), płaski pas 4,24 × 84 mm. W pliku obie bryły stoją na Z = 0. Osie zawiasu Ø2,4 zostają równoległe do stołu. Nie obracać wierzchem w dół, bo skosy nasad dałyby wtedy nawisy poziome.
- **Drukarka:** X1C, bo wysokość wynosi ok. 93 mm, a stół A1 mini jeździ w Y. Z brimem.
- **Wypełnienie płyty: 100 %** (albo co najmniej 5 ścianek). Zapasy wytrzymałości słupków są policzone dla przekroju pełnego; przy domyślnych 2 ściankach i 15 % słupek kardana traci ok. połowę sztywności. Wartości dla 5 ścianek bez wypełnienia są w raporcie wytrzymałości.
- **Podpora projektowana** (decyzja użytkownika 26.10, wzór z filmu): plik `Plyta + podpora (druk 45).3mf` zawiera płytę już pod 45° i osobny obiekt `Podpora plyty (druk 45)` w położeniu na stole, razem ok. 84 × 70 × 93 mm.
  - **Budowa:** płetwa równoległa do spodu płyty, w odstępie 0,8 (grubość 1,2), pięć pionowych żeber 1,2 i podstawa 1 mm na stole, wysunięta ok. 21 mm przed żebra. Środek masy płyty (ok. 40 mm przed stopką) wypada nad podstawą, więc część się nie przewraca.
  - **Pod wystającymi elementami** (użytkownik 26.10: „zawsze bezpieczniejszy wydruk”):
    - pionowe ścianki pod spodami obu ramion zawiasu (x ±36,2, gr. 1,6, od z −32 do przodu) i pod spodem słupka kardana (x 0, gr. 3, od z −24 do −16);
    - ścianki połączone czterema skośnymi zastrzałami 45° (po dwa na stronę, od ścianki ramienia do środkowej i z powrotem), bez mostów;
    - bliżej płyty linia w dół trafiałaby w płytę albo w klocek nasady, więc te odcinki (45°) zostają bez podpory.
  - **Łączniki:** stożkowe, Ø1,6 przy podporze, karb Ø0,7 przy części. 32 pod płytą, tylko tam, gdzie spód płyty jest pełny, każdy ≥ 2 mm od gniazd i szczelin, oraz co 6 mm pod ramionami i słupkiem. Poza łącznikami podpora nie dotyka części: najmniejszy odstęp 0,69 (z boku ścianki przy żebrze nasady), pod spodami 0,8, bez przenikania (sprawdzone w Blenderze, BVH).
  - **W slicerze:** wczytaj plik z oboma obiektami bez przesuwania (jeden pod drugim, jak w pliku), **wyłącz automatyczne podpory**, daj brim (płyta i podpora) i drukuj na X1C. Osobno jest też sama `Podpora plyty (druk 45).3mf`; ma ona sens tylko z płytą ustawioną identycznie.
  - **Odłamywanie** (ramię zawiasu jest słabe na zginanie w x, czyli na boki):
    1. Przetnij szczypcami cztery zastrzały przy ściankach ramion: ścianki przestają się ze sobą wiązać.
    2. Łączniki pod każdym ramieniem odcinaj pojedynczo szczypcami do cięcia przy płycie, trzymając ramię palcami. **Ścianki pod ramionami nie odchylaj na boki**, bo dźwignia przez kilka łączników zgina ramię w słabym kierunku.
    3. Ściankę pod słupkiem kardana odcinasz tak samo (słupek Ø12 jest sztywny, ale nie trzeba go zginać).
    4. Podporę płyty odchylasz od spodu ruchem wzdłuż żeber (od przodu do tyłu); łączniki pękają przy płycie, a spód płyty jest pełny i sztywny. Nie podważać od strony stopki, bo tam płetwa jest najbliżej stołu i najsztywniejsza.
    5. Ślady zbierasz nożykiem.
- **Nawisy** (sprawdzone na normalnych siatki):
  - stromiej niż 45° tylko góry otworów osi zawiasu Ø2,4 (9,4 mm², mostki otworów);
  - żebra i skosy nasad rosną pionowo albo w górę, bez nawisów;
  - spód płyty, spody ramion i tylne ściany leżą dokładnie pod 45°;
  - podpory pod ramionami i słupkiem kardana są przy tej orientacji zbędne.
- **Do sprawdzenia na sucho po druku:** szczeliny uszu serw (2,4 × 12,9), gniazdo L–P (12,9 × 23,2) i wnęki wieżyczek mają ścianki pod 45° do warstw. Wsuń serwa przed klejeniem.
- **Druk na płasko** (`Plyta.3mf`, jeśli jednak): podpory pod ramionami i słupkiem kardana przed płytą (14–26 mm nad stołem); nasady są wtedy słabszym kierunkiem, zapasy w raporcie wytrzymałości.

Kolor: mechanizm pomarańczowy, gałka biała.

## 2. Części posiadane

| Co | Ilość | Gdzie |
|---|---|---|
| MG90S z orczykiem jednoramiennym i wkrętem | 4 | L–P, G–D, powieka górna, powieka dolna. Otwory orczyków zostają fabryczne (ok. Ø1,3): drut Ø1 przechyla się w nich do ok. 10°, wymagane jest do ok. 8° (L–P 17,5, G–D 11,5; druty powiek wchodzą w drukowane przedłużenia) |
| Kardan 5/5 z 2 wkrętami M4 | 1 | środek gałki |
| Wkręt M3 × 10, łeb grzybkowy ISO 7380 (łeb ok. Ø5,7 × 1,65, razem 12) | 2 | Rdzeń drukowanych trzpieni kardana: wkręcony od czoła kołnierza w otwór pilotowy Ø2,5, łeb w kieszeni kołnierza. Stal sięga w kardan 5,65 (gałka) / 5,4 (słupek) od czoła piasty, czyli przez strefę wkrętu dociskowego (3,65 ±0,2), i kończy się 0,35 przed czubkiem trzpienia. Otwór kardana Ø5,05–5,1 jest gładki; trzpień trzyma wkręt dociskowy |
| Drut sprężynowy Ø1 (użytkownik 26.10: jest w warsztacie) | 4 odcinki, gotowe ok. 77 / 71 / 104 / 79 mm; tnij ok. 5 mm dłużej, nadmiar ogona skracasz po zgięciu | pręty L–P i G–D, druty powiek górnej i dolnej; oba końce w „Z” gięte kombinerkami: noga ok. 7 między zagięciami (6,5–7,5; przy 6 ogon przy gałce ociera o płytkę zaczepu G–D w skrajnym położeniu), promień gięcia ok. 1, ogon po zgięciu skrócony do ok. 2; otwór wypada na środku nogi; ogon w uszku powieki 2 mm zagięty w przeciwną stronę: równolegle do drutu, ku serwu (przemiatanie 28.10: do gałki 0,95 / 3,03, powieki bez kolizji) |
| Wkręt M2 × 6 z łbem (użytkownik 27.10: ma M2 × 5 i M2 × 6; łeb do Ø4 × 2) | 2 | osie powiek: od zewnątrz słupka, luźno w słupku i uchu górnej (Ø2,4), gwint wkręcony w powiekę dolną (Ø1,6, ok. 2 mm gwintu); koniec 1,2 przed gałką; łeb przechodzi w szczelinie tuby. Wkręt obraca się z powieką dolną; nie dokręcać do słupka |
| Wkręty do drewna 4 × 30–40 | 4 | łapy kołnierza (PRD) |
| Klej: epoksyd albo CA; klej na gorąco | – | kołnierze trzpieni kardana (CA), przedłużenia orczyków, osie w słupkach, serwa w gniazdach, moduł w tubie |

**Śruby razem:**
- 2 × M3 × 10 ISO 7380 (rdzenie trzpieni kardana);
- 2 × M2 × 6 z łbem do Ø4 × 2 (osie powiek);
- elementy, które przychodzą z kardanem i serwami: 2 × M4 kardana i 4 wkręty orczyków;
- 4 wkręty do drewna z PRD.

Do tego drut Ø1 na kołki przedłużeń orczyków. Wiertła: 1,0 (kołki) i 1,5 (otwory orczyków pod pręty i druty, fabryczne mają ok. Ø0,8).

## 3. Najważniejsze wymiary

| Co | Wartość |
|---|---|
| Rant tuby | z = +6 (gałka wystaje 24, zamknięte powieki 28,4 – decyzja użytkownika 26.10) |
| Krawędź czaszy | z = −11, czyli ok. 111° od przodu. Otwór zewnętrznie Ø55,8, w świetle samej czaszy Ø51,5; wspólne wolne światło z podparciem języczka L–P ok. Ø48. Przy −15 pręt L–P przechodził przez krawędź; przy −11,5 sztywny drut „Z” L–P miał 0,27 do krawędzi przy θ ±25. Ustalenie 3 dopuszcza płytszą czaszę, do ok. 10 mm za środkiem |
| Piasta gałki | Ø14 od przedniego bieguna do z = +14 |
| Zaczepy gałki | Oba otwory wzdłuż osi y gałki, na z = −4,5 i promieniu 15,5: L–P w języczku x = 15,5 (płytka w płaszczyźnie XZ, gr. 2), G–D w słupku y = 15,5 (płytka w płaszczyźnie XZ, 6,5 × 2, od z −7, czyli 1 mm pod otworem, do przedniej czaszy; od z = +4 nasada pogrubiona skosem 45° w ±y do grubości 14). Otwory dwustożkowe pod drut Ø1: gardziel w świetle Ø2,0 × 1,0, fazki 45° do obu ścian, wylot Ø3,0; mostek do końca języczka 1,2. Zagięcie „Z” 3,5 od środka otworu (połowa nogi 7): L–P w +y, G–D w −y (ku osi). Spód słupka G–D 1 mm pod wylotem fazki, narożniki ścięte 45° |
| Słupek kardana | Ø12, z −51 … −14,25; nasada: klocek do z = −40, skosy 45° po płycie do x ±14, żebro 5 mm pod słupkiem do z = −31 |
| Płyta | wierzch y = −15, grubość 5, z −49 … −105, x ±42; przód 2 mm za kołnierzem tuby 50 |
| Słupki zawiasu | x 34,7 … łuk R37,2 (0,95 do tuby na całej szerokości), y ±5, z do +4; oś na z = 0. Nasada: żebro po wewnętrznej stronie x 30…34,7, nad płytą y −20…+5, przed płytą do spodu płyty w r ≤ 37,2 (0,95 do tuby i kołnierza tuby 50, jak ramię), pełne do z = −38, dalej skos zwęża się w sposób ciągły do zera na ramieniu na z = −12 (bez uskoku przekroju) (wytrzymałość: `20-analizy/2026-10-26-duze-oko-v3-wytrzymalosc-slupkow.md`) |
| Powieki | luz 1,0 do gałki i między powiekami; uszy górnej x ±(33,2…34,4), dolnej ±(31,8…33,0); luz osiowy 0,2 ucho–ucho i 0,3 ucho–słupek |
| Otwory osi | uszy i słupki: światło Ø2,4 (wielokąt 32-boczny opisany na Ø2,4), oś: wkręt M2 × 6 (w powiece dolnej Ø1,6 pod gwint) |
| Zaczepy drutów powiek | górna x = +5, 34,0 od osi zawiasu; dolna x = −5, 32,4 od osi (28.10: z 31,5, ścianka od gałki 0,1 → 1,1); otwór Ø1,4 z daszkiem 45° (drut Ø1) 1,6 nad płaszczyzną osi; uszko gr. 2,8 wzdłuż otworu, ścianki ≥ 1,1, luz do gałki ≥ 0,8; otwór drutu w przedłużeniach orczyka Ø1,3 |
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
| Powieka górna | 0 → 51,5° | 25° → −45,8° (71°) | przenoszenie ≥ 50°; wyboczenie drutu Ø1 długości 88,6 przy 12,3 N wobec 8,6 N z serwa |
| Powieka dolna | 0 → 51,5° | 35° → −25,4° (60°) | przenoszenie ≥ 53° |

- **Przechył nogi „Z” w języczkach gałki:** wymagany ok. 30° (L–P i G–D), także w narożnikach, liczony co 1°. Dopuszczalny dla drutu Ø1 w otworze Ø2,0 × 1,0 wynosi 36,9° (warunek l·sinα + d ≤ D·cosα). Na orczykach sztywny drut wymaga do ok. 8°; fabryczny otwór ok. Ø1,3 przy ramieniu ok. 1,6 mm [Z] daje ok. 10°.
- **Sprzężenie osi, do firmware'u:**
  - przy L–P ±35° serwo G–D musi dodać +4,4°, inaczej gałka pochyli się o ok. 3,5°;
  - przy G–D ±25° serwo L–P musi dodać +1,5°;
  - poprawka jest mała; można ją zignorować albo wpisać w kalibrację.
- **Źrenica najwyżej Ø20 (decyzja użytkownika 26.10):** przy spojrzeniu +25° jej krawędź jest na 44,5°, a otwarta powieka na 51,5°, czyli zapas 7°. W samych narożnikach (±35° i ±25° naraz) krawędź źrenicy chowa się ok. 1° pod powieką; PRD dopuszcza mniejszy zakres w narożnikach.

## 5. Kolejność montażu (na stole; tylko krok 10 w dyni)

Narzędzia: klucz imbusowy 2 mm (wkręty M4 kardana), wkrętak PH1 (wkręty orczyków), kombinerki (drut), pęseta. Światło otworu tylnego gałki to ok. Ø48 przy podparciu języczka L–P, a po stronie −x (droga klucza) Ø51,5.

1. **Trzpienie kardana:**
   - w każdy trzpień wkręcasz od strony kołnierza wkręt M3 × 10 ISO 7380, aż łeb schowa się w kieszeni (nie dokręcaj na siłę, PLA się gwintuje);
   - przymierz trzpień w otworze kardana: ma wejść ręcznie, bez luzu na boki; za ciasny albo za luźny zamień na wariant T4.9 albo T5.0;
   - kołnierz wklejasz CA w gniazdo na czole słupka kardana (trzpień do przodu) i w gniazdo piasty gałki (trzpień do tyłu), łbem M3 do dna gniazda. Gałkę kładziesz otworem do góry; kołnierz ma wejść ręcznie, za ciasny zamień na wariant K9.2.
2. **Orczyki i przedłużenia:** pręty wchodzą w fabryczne otwory orczyków L–P (17,5) i G–D (11,5); druty powiek wchodzą w drukowany otwór Ø1,3 przedłużenia. Przedłużenia kładziesz na płaską stronę ramion dwóch orczyków (tę od wkrętu, z dala od serwa): ramię wchodzi w rowek między ściankami, pierścień piasty (0,4 nad ramieniem) w otwór Ø7. Kołki z drutu Ø1 przez otwory przedłużenia 13,5 i 17,5 w otwory orczyka (gdy drut nie wchodzi, rozwiercić orczyk wiertłem 1,0), obciąć równo z obu stron. CA na styk ramienia z dnem rowka. Odstaw do związania.
3. **Serwa G–D, powieki górnej i powieki dolnej:**
   - kabel MG90S wychodzi z krótszej ściany po stronie wałka, przy spodzie (użytkownik 28.10; model zakładał stronę przeciwną);
   - G–D: wałek u góry (17,3 nad płytą), więc kabel też idzie górą; przejście w płycie przy x ≈ −30 zostaje puste;
   - serwa powiek: wałek na dole (5,5 nad płytą), więc kabel wychodzi w płytę. Przed klejeniem wycinasz w płycie wnęki na wylot 4 × 8 od zewnętrznej krawędzi: powieka dolna – środek 27 od przodu płyty, powieka górna – 46 od przodu (rysunek `podglad/duze-oko-v3/montaz/plyta-wneki-kabli.png`). Miejsce sprawdzasz serwem na sucho: znak markerem, gdzie kabel dotyka płyty; kabel wsuwasz w wnękę z boku;
   - każde stawiasz na płycie: dolne ucho w szczelinie, wieżyczki powiek nad wnękami 1 mm;
   - klej na gorąco; serwo powieki górnej kleisz tylko od tyłu i z boków. Przód jego korpusu i płyta przed nim (z −88,75…−87,8) zostają czyste, bo tam ląduje tylne ucho L–P (0,95 luzu); L–P przymierzasz na sucho.

   Serwo L–P możesz wkleić od razu: wkręty orczyków G–D i powieki dolnej (kroki 6 i 8) dokręcasz wkrętakiem pod skosem obok niego (sprawdzone przez użytkownika 28.10).
4. **Kardan na słupek:** piasta tylna na trzpień słupka, wkręt dociskowy M4 do góry. Dokręcasz imbusem 2 z góry; gałki jeszcze nie ma, wszystko otwarte.
5. **Gałka na kardan:**
   - wsuwasz gałkę od przodu, trzpień gałki wchodzi w piastę przednią;
   - wkręt M4 piasty przedniej patrzy w −x (sworzeń piasty poziomo);
   - dokręcasz go imbusem 2: krótkie ramię promieniowo, długie wychodzi do tyłu przez otwór tylny na x ≈ −18;
   - po tej stronie nie ma języczków, a ramię zawiasu jest na x = −35;
   - klucz przekładasz co ok. 60°.
6. **Pręt G–D:**
   - pręt G–D gniesz z zagięciami w płaszczyznach prostopadłych: noga przy gałce wzdłuż y gałki (otwór słupka), noga przy orczyku wzdłuż x (otwór orczyka);
   - „Z” wkładasz kombinerkami w otwór słupka G–D przez otwór tylny; noga 7, otwór na jej środku (§2), zagięcie do pręta od strony osi (−y), pręt biegnie pod słupkiem;
   - drugi koniec do otworu 11,5 zdjętego orczyka;
   - serwo ustawiasz na 1500 µs, orczyk nasadzasz ramieniem do góry;
   - wkręt orczyka wkrętakiem z prawej, wzdłuż −x na y 2,3, z −60. Wkrętak pod skosem obok serwa L–P.
7. **Powieki:**
   - najpierw dolna, potem górna; uszy wsuwasz od przodu między słupki (0,3 luzu na stronę);
   - oś: wkręt M2 × 6 od zewnątrz przez słupek i ucho górnej, wkręcony w ucho powieki dolnej, aż łeb dotknie słupka, potem cofnięty o pół obrotu (0,2 mm luzu osiowego; powieki chodzą lekko, bez luzu na boki). Bez kleju;
8. **Druty i orczyki powiek:**
   - „Z” wkładasz w uszko powieki (noga 7, otwór na jej środku, uszko gr. 2,8 mieści nogę 6,5–7,5; zagięcie do drutu górnej na +x, dolnej na −x), drugi koniec w otwór 25 przedłużenia;
   - ogon w uszku (2 mm) zaginasz w przeciwną stronę niż przy gałce: równolegle do drutu, w stronę serwa, nie do przodu (§8);
   - powiekę zamykasz, serwo ustawiasz na wartość „zamknięte”, orczyk nasadzasz: górny 25° od pionu ku przodowi, dolny 35° od pionu w dół ku przodowi (dolny przechodzi przez szczelinę w płycie);
   - wkręt orczyka powieki górnej wkrętakiem z lewej, wzdłuż +x na y −9,5, z −95;
   - wkręt orczyka powieki dolnej wkrętakiem z prawej, wzdłuż −x na y −9,5, z −76, pod skosem obok serwa L–P.
9. **Serwo L–P:**
   - kabel wychodzi z przedniej ściany przy spodzie, już pod płytą (do kołnierza tuby ok. 13): najpierw przekładasz kabel w dół przez gniazdo, potem wsuwasz serwo; gniazdo ma 0,2 luzu na stronę, przy oporze zeskrob ok. 1 mm z przedniej ścianki gniazda;
   - wkładasz z góry w gniazdo na wylot, ucha leżą na płycie, klej;
   - pręt L–P montujesz jak pręt G–D: noga „Z” 7 w języczku L–P (otwór na środku nogi), zagięcie do pręta od strony +y, otwór orczyka 17,5, orczyk ramieniem w −x, wkręt z góry (wzdłuż −y na x 33,0, z −66; nad nim nic nie ma).
10. **Test ruchu i kalibracja** na stole (ESP, strona w telefonie).
11. **W dyni:**
    - tubę z kołnierzem mocujesz od środka wkrętami do drewna w łapach (z 8 łap używasz tych, które nie kolidują, najmniej 4), maskownicę przyklejasz z zewnątrz (PRD);
    - **wsporniki na tubie (od środka dyni):** każdy wspornik zawieszasz zaczepem na górnej krawędzi ścianki w tylnym końcu tuby, 12–26 mm od środka (po obu stronach wycięcia na drut), półką do wnętrza dyni; noga przylega do ścianki i kołnierza – klej na gorąco na nodze. Zaczep ustala wysokość, ciężar modułu dociska go do ścianki;
    - moduł wkładasz przez wieczko: słupki z gałką wsuwasz w tubę od środka, płyta wjeżdża spodem na półki wsporników;
    - **ustawienie przed klejeniem:**
      - **Wzdłuż osi:** czoło słupków 2 mm za rantem tuby.
      - **Środek otworu:** szczelina gałka–tuba (8,15) ma być równa dookoła, przy powiekach zamkniętych też widać równy pierścień. Słupki stoją poziomo, a ich szczeliny przy tubie mają po 0,95 z obu stron i u góry, i u dołu.
      - Płyta leży na półkach (wierzch półki 20 pod osią tuby), łuki słupków opierają się o tubę po bokach: moduł nie opada.
    - **klejenie:** płyta do półek klejem na gorąco, potem klej w szczelinach słupek–tuba u góry i u dołu ramion, od tyłu tuby; trzymasz bez ruchu, aż klej zwiąże.
    - opcjonalnie dla pewności położenia: paski papieru grubości ok. 0,9 mm wsunięte w szczeliny słupek–tuba na czas klejenia i wyjęte potem. To materiał pomocniczy, nie część.

## 6. Kontrola

- **Siatki:**
  - `sprawdz_siatki.js`: 0 błędów dla każdej części i pliku zbiorczego;
  - `skladowe_siatki.js`: 1 bryła na część, 9 brył w zbiorczym (bez podpory płyty), 2 w `Plyta + podpora (druk 45)`;
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

- Trzpienie kardana: pasowanie trzpienia w kardanie (Ø5,05–5,1) i kołnierza w gnieździe Ø9,5; warianty T4.9 / T5.0 i K9.2 w tym samym pliku.
- **Słupek G–D na gałce:**
  - obejrzeć, czy wydrukował się prosto;
  - ręką sprawdzić jego ugięcie przy pręcie;
  - w programie nie dociskać serwa G–D do krańca.
  - Przy zablokowanym serwie (ok. 19 N) naprężenie przy nasadzie szacuję na ok. 19 MPa, wobec 59 bez nasady (Opus).
- Szczyt kopułki gałki i powiek przy druku krawędzią w dół; podpory pod piastą i końcem języczka L–P.
- Osie M2 × 6: gwint w powiece dolnej trzyma (pełny pierścień x 31,0…33,0), powieki chodzą lekko po pół obrotu w tył; łeb przechodzi w szczelinie tuby 5,0.
- Wyjście kabla posiadanego MG90S: po stronie wałka, przy spodzie (użytkownik 28.10). Przejście G–D w płycie zostaje puste, serwa powiek mają wnęki wycięte ręcznie (krok 3).
- Uszy MG90S na całą szerokość korpusu [Z, rysunek Miuzei]; szczeliny uszu mają 2,4 × 12,9.
- Ustawienie modułu w tubie: równy pierścień wokół gałki przed związaniem kleju.
- Słupki zawiasu przed wklejeniem w tubę: siła ok. 4 N w bok (x) ugina ramię o ok. 0,33 mm, więcej niż luz osiowy ucha (0,3); ramię wydrukowane pod 45° pęka przy ok. 15–21 N w bok. Nie dociskać ramion na boki przy montażu powiek.

## 8. Zaczepy „Z” na gałce (rozwiązane geometrią, decyzja PM 26.10)

Recenzenci odrzucili oczko jako dodatek, więc zostaje „Z” zgodnie z ustaleniem 1. Wcześniej otwór G–D szedł wzdłuż x gałki, a otwór Ø1,3 w języczku gr. 2,5 pozwalał drutowi przechylić się tylko o ok. 7°. Wymagane było do 40,9°. Zmiany:
- otwór G–D obrócony na oś y gałki, równolegle do L–P: wahanie L–P staje się obrotem wokół osi otworu, który „Z” przenosi swobodnie;
- otwory dwustożkowe z fazkami 45°: Ø2,0 × 1,0 dla drutu Ø1 (po epizodzie z Ø1,2 powrót na Ø1, użytkownik 26.10);
- „Z” jak gięte ręcznie: noga ok. 7 między zagięciami, otwór na środku nogi (zagięcie 3,5 od środka otworu, przesuw ±0,5), promień gięcia ok. 1, ogon ok. 2;
- słupek G–D kończy się 1 mm pod otworem, z narożnikami ściętymi pod 45°;
- zaczep na r 15,5, dzięki czemu mostek ma 1,0 mm.

Rachunek kąta (`duze_oko_v3_kinematyka.py`) daje wymagane ok. 30° wobec dopuszczalnych 36,9° (drut Ø1).

**Sztywny drut** (`z-sztywne-v3.txt`, uwaga Astry W3): pręt jako jeden drut o stałej długości i stałych zagięciach, przechylany w otworach, z nogą przy własnym otworze.

| Pręt | Przechył przy gałce | Przechył przy orczyku | Luz do gałki | Luz do płyty | Luz do piasty tylnej |
|---|---|---|---|---|---|
| L–P | 26,8° | 6,3° | 0,65 | 3,84 | 3,88 |
| G–D | 28,4° | 9,9° | 0,64 | 2,34 | 2,65 |

Drut Ø1, „Z”: noga 7 między zagięciami, otwór na środku nogi, ogon 2; luz liczony dla całego „Z”, także dla reszty nogi i ogona po drugiej stronie otworu. Dopuszczalne: 36,9° przy gałce (Ø2,0 × 1,0) i 10,1° przy fabrycznym otworze orczyka Ø1,3 (ramię ok. 1,6 [Z]). Żadne z 165 położeń nie ma luzu do gałki poniżej 0,5.
- **Przesuw nogi w otworze o ±0,5 (skrajne położenia):** luz do gałki spada do ok. 0,4 (L–P) i 0,17 (G–D, ogon przy płytce słupka, theta +25°). Przy styku drut sam przesuwa się w otworze na drugą stronę, gdzie luz jest.
- **Przy nodze 6:** ogon G–D zbliża się do płytki słupka na 0,22. Dlatego noga ma 7.

**Przemiatanie** (`przemiatanie-v3.txt`, 28.10 po zmianie uszek powiek, ogon w uszku ku serwu: `OGON_POW_KIER=-1`): 1 para ze 139 poniżej wymogu, przez model łamanej (niżej). Druty powiek: DrutG–PowiekaGorna 0,80, DrutD–PowiekaDolna 0,80 (noga „Z” za uszkiem do sufitu wycięcia krawędzi tylnej), DrutD–Galka 1,82, DrutG–Galka 3,03; Galka–PowiekaDolna 0,78 (uszko dolnej), PowiekaGorna–Tuba 1,45.
- **Wcześniej (ogon w uszku do przodu):** DrutG–PowiekaGorna −1,02, DrutD–PowiekaDolna −1,00, DrutD–Galka −0,65; ogon do przodu wchodził w krawędź tylną własnej powieki i w gałkę. Odrzucony (review Astry 28.10); ogon ku serwu to propozycja użytkownika 28.10.
- **PretGD–Galka:** 0,43 w modelu łamanej z nogą sztywno w osi otworu. Model sztywnego drutu, który przechyla nogę w otworze, daje 0,64.

Model nie obejmuje sprężystości drutu, rozrzutu kąta gięcia i łuku zagięcia (zagięcia są ostre); sprawdza się to przy pierwszym montażu.

