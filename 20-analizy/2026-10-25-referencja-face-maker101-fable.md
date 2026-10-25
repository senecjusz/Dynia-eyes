# Analiza referencji „The Face” (Maker 101, PCBWay) jako wzoru dużego oka – Fable

25.10.2026. Brief: `30-projekt/brief-analiza-referencji-face-maker101.md`. Tylko odczyt; niczego nie pobierano.

## 0. Źródła i ich oznaczenia

| Ozn. | Źródło | Uwagi |
|---|---|---|
| **S** | Opis projektu na stronie PCBWay (kroki 1–6, lista komponentów, komentarze) | tekst w całości przeczytany (WebFetch + przeglądarka) |
| **Z1** | zdjęcie główne galerii `…/24/09/29/0024423018883.png` (546×390) | maska na ścianie, oczy widoczne |
| **Z2–Z4** | galeria `0030564956230`, `0031231671023`, `0031576298615` | tylko PCB i elektronika, bez mechaniki |
| **Z5** | galeria `…/24/09/30/2031046517705.png` (600×524) | **mechanizm oczu z góry, najlepsze ujęcie** |
| **Z6** | galeria `2030554872177` | maska z przodu |
| **Z7** | galeria `2031256628135` | maska od tyłu, moduł wklejony |
| **K1** | krok 1 `…/project/24/09/30/2041515117168.png` (600×350) | wszystkie części drukowane na płasko |
| **K2a** | krok 2 `2044393288413.png` | moduł w rękach + narzędzia + spinacze |
| **K2b** | krok 2 `2045331334555.png` (9 kadrów) | **kolejność montażu oczu** |
| **K6a, K6b** | krok 6 `2059569142033.png`, `2100110176625.png` | montaż w masce |
| **V** | film YouTube `H712Cc5Ca94` „The Face: DIY Animatronic Eyes…”, 7:32, rozdziały: 0:00 montaż, 3:27 kod serw, 3:46 PCB, 4:28 demonstracja | oglądany w przeglądarce kadrami co 10–20 s; narracji brak (napisy to „[Music]”), opis filmu odsyła do strony PCBWay |

Nie oglądałem zdjęć kroków 3–5 (`2048052808735`, `2051021693800`, `2051245640002`, `2056217857265`): wg opisu to płytka stykowa, PCB i kod. Zdjęcia na stronie mają 600 px szerokości, więc szczegóły poniżej ~1 mm są nieczytelne; wszystko, co z nich wnioskuję o wymiarach, jest **[Z]**.

**Czego na stronie nie ma:** żadnego wymiaru mechaniki (średnica gałki, długość prętów, kąty ruchu), żadnej śruby w opisie, rysunków. Pliki STL są wymienione, ale ich nie pobierałem (wymaga zgody użytkownika).

**Pliki dostępne do pobrania (S):**

| Grupa | Plik | Pobrań |
|---|---|---|
| Kod | `servo_motor_code.ino` (test serw), `the_face_code.ino` (główny) | 154 / 143 |
| Schemat | `Schematic_Nano_DFPlayer_PIR_Servo_Board_2024-09-16.png`, BOM `Ekran Resmi 2024-09-16 13.33.59.png` | 131 / 91 |
| Dźwięk | `1.mp3` („I see you”) | 103 |
| STL | `joint_v1.stl` (Universal Joint), `center-joint_v1.stl` (Universal Joint), `face_main.stl`, `eyeball.stl`, `eyelid.stl`, `eye_holder_main.stl` (Eye Holder = uchwyt serw, potwierdzone w komentarzu autora 08.01.2025), `bars_v1.stl`, `backside.stl` | 116–131 |
| PCB | Gerber (ZIP), BOM (CSV) | 215 |

## 1. Fakty z referencji

### 1.1 Lista części

| # | Część | Fakt / założenie | Źródło |
|---|---|---|---|
| 1 | Maska (face_main) | [F] drukowana PLA, low-poly | S krok 1, K1 |
| 2 | Gałki ×2 | [F] każda z **dwóch połówek**: przednia z tęczówką (żółta) i tylna czasza; na K1 leżą 4 połówki | K1 (dolny kadr), K2b kadr 7 (czasza leży obok zamontowanej przedniej połówki) |
| 3 | Powieki ×2 | [F] jedna na oko, kształt sierpa/czaszy ćwiartkowej | S krok 1, K1 |
| 4 | Uchwyt serw (eye_holder_main) | [F] jedna płaska płyta z gniazdami na 5 serw i **4 słupkami** (po 2 na oko) wystającymi z tylnej krawędzi | S krok 1, K1, K2b kadr 1 |
| 5 | Przeguby uniwersalne (joint_v1, center-joint_v1) | [F] małe fioletowe wydruki, na K1 widać 2 sztuki (jedna na oko); [Z] joint_v1 to widełki/klocek między słupkami, center-joint_v1 to krzyżak/czop do gałki | K1, K2b kadr 1 i 5 (fioletowy element z 2 otworami stoi między słupkami prawego oka) |
| 6 | Listwy ×2 (bars_v1) | [F] fioletowe, płaskie, ~2 grubości wklejane w maskę; na nich klei się uchwyt | K1, S krok 6, Z7 |
| 7 | Płyta tylna (backside) | [F] ramka z kratą | K1, K6b |
| 8 | Serwa MG90S ×5 | [F] 2 na oko (lewo–prawo, góra–dół) + 1 na obie powieki | S krok 2 |
| 9 | Druty | [F] **spinacze biurowe** prostowane i gięte kombinerkami, jako pręty i – [Z] – jako sworznie przegubów | S krok 2 („a few paperclips”), K2a (kadr: spinacze + 2 kombinerki), K2b kadr 2 |
| 10 | Śruby | [F] w opisie **nie ma żadnej śruby**; na zdjęciach nie widać łbów śrub poza [Z] jasnymi punktami na szczytach słupków (Z5), które mogą być końcami drutu-sworznia; orczyki na serwach – [Z] standardowe śrubki orczyka | S, Z5 |
| 11 | Klej na gorąco | [F] uchwyt serw do listew; [Z] serwa w gniazdach (brak śrub, luźno włożone na K2b kadr 1) | S krok 6, K2b |
| 12 | Elektronika | [F] Nano, DFPlayer, PIR HC-SR505, głośnik, PCB, 9 V | S, Z2–Z4 |

### 1.2 Gałka

| Cecha | Fakt / założenie | Źródło |
|---|---|---|
| Średnica | [Z] **ok. 32–40 mm**. Szacunek: na K1 (płaski kadr) gałka ≈ 0,28 szerokości uchwytu; uchwyt mieści 5 MG90S w rzędzie, więc ma ok. 110–120 mm → ~31–34 mm. Na Z5 (perspektywa, gałki bliżej obiektywu) wychodzi ~42 mm. Strona nie podaje liczby. | K1, Z5 |
| Na czym siedzi | [F] na przegubie uniwersalnym między dwoma słupkami uchwytu; gałka jest **kopułą otwartą od tyłu** (na stole: od dołu), przegub wchodzi w ten otwór | Z5 (ciemny klocek pod kopułą między słupkami), K2b kadr 1, 5, 9 |
| Osie | [F] 2 osie: pozioma (przez oba słupki) i druga w przegubie; [Z] obie na sworzniach z prostowanego spinacza: w K2b kadr 7 długi prosty drut jest wsuwany przez słupki z pomocą wkrętaka; w V 1:40 z przegubu prawego oka sterczy pionowy drut | K2b kadr 7, V 1:40 |
| Położenie przegubu | [Z] przegub leży **przy tylnej ścianie gałki, nie w jej środku**: słupki sięgają mniej więcej do dolnej krawędzi kopuły, gałka siedzi „na” przegubie. Odsunięcie osi od środka gałki szacuję na 0,3–0,5 średnicy. | Z5, K2b kadr 9 |
| Liczba przegubów | [F] 1 przegub uniwersalny (2 osie) na gałkę; **zero przegubów w prętach** | S krok 1–2, Z5 |
| Podparcie | [F] dwustronne: oś pozioma w dwóch słupkach, gałka między nimi | Z5, K2b |

### 1.3 Napęd gałki

| Cecha | Fakt / założenie | Źródło |
|---|---|---|
| Serwa na oko | [F] 2: jedno **leży płasko** na płycie (wałek prostopadle do płyty, orczyk w płaszczyźnie płyty = płaszczyźnie twarzy), drugie **stoi** na krótszym boku (wałek równolegle do płyty, orczyk w płaszczyźnie prostopadłej) | Z5 (lewe oko: płaskie serwo z lewej, stojące pod gałką), K2b kadr 1 |
| Które co robi | [Z] płaskie serwo: orczyk przesuwa koniec pręta na boki w płaszczyźnie twarzy → lewo–prawo; stojące: pręt pcha/ciągnie wzdłuż osi patrzenia → góra–dół | Z5 (kierunki ruchu orczyków) |
| Pręty | [F] prosty drut ze spinacza, jeden na serwo, od otworu orczyka do gałki; **bez przegubów**, bez oczek; końce [Z] zagięte w „Z” w otwór orczyka (K2b kadr 2 pokazuje gięcie końcówki) i [Z] w otwór/zaczep na tylnej krawędzi kopuły | S krok 2, K2b kadr 2, Z5 (druty wchodzą pod dolną krawędź kopuły) |
| Kąt prętów | [F] pręty nie są równoległe do osi: na Z5 pręt stojącego serwa biegnie skośnie ~30° od pionu, pręt powiek biegnie po przekątnej przez pół uchwytu | Z5 |
| Zakres ruchu | **brak danych na stronie.** Kod (`servo_motor_code.ino`) definiuje kąty, ale go nie pobierałem. [Z] z kadrów V 4:28–5:30 ruch gałek jest wyraźnie mniejszy niż ±30°, oceniam ±10–20°. | S, V |
| Pozycja startowa serw | [F] wszystkie na 90° przed montażem prętów | S krok 2 |

### 1.4 Powieki

| Cecha | Fakt / założenie | Źródło |
|---|---|---|
| Liczba | [F] 2 (jedna na oko, górna) | S krok 1, K1 |
| Napęd | [F] **jedno serwo** (środkowe gniazdo uchwytu) na obie powieki, „the same wire and paperclip method”; na Z5 ze środkowego orczyka wychodzą dwa druty w stronę obu par słupków | S krok 2, Z5 |
| Podparcie | [Z] powieka obraca się na sworzniach w szczytach słupków (tych samych, które niosą oś gałki); na stole (Z5, K2b) powiek **nie ma**, pojawiają się dopiero w V 2:50–3:10 i w masce (Z1, Z6). Nie widzę, czy oś powieki pokrywa się z osią gałki. | V 2:52, 3:08; Z1 |
| Zakres | [F] od zamknięcia do otwarcia („blink or close its eyes”), liczby brak | S |

### 1.5 Mocowanie i kolejność montażu

| Krok | Fakt | Źródło |
|---|---|---|
| 1 | Serwa (wycentrowane na 90°) wkłada się w gniazda płyty; na K2b kadr 1 wszystkie 5 siedzi w gniazdach bez prętów i bez gałek | S krok 2, K2b 1 |
| 2 | Spinacze prostuje się i tnie; końcówki gnie się kombinerkami | K2b 2 |
| 3 | Przegub (fioletowy) stawia się między słupkami; długi drut-sworzeń wsuwa się przez słupki (wkrętak jako popychacz) [Z] | K2b 1, 5, 7 |
| 4 | Przednia połówka gałki nakłada się na przegub; tylna czasza leży obok, zakładana później [Z klejona] | K2b 7, 9 |
| 5 | Pręty: koniec w otwór orczyka, koniec w gałkę; orczyki na serwach | K2b 3–6, 8, 9; Z5 |
| 6 | Powieki na słupki, drut od środkowego serwa | V 2:50–3:10 |
| 7 | Listwy w maskę; uchwyt (z serwami i oczami) **na klej na gorąco** do listew; PIR w wywiercony otwór 6–8 mm; głośnik, PCB; płyta tylna; maska na ścianę na taśmę | S krok 6, Z7, K6b |

Narzędzia widoczne: kombinerki, szczypce tnące, wkrętak krzyżakowy (K2a, K2b, V). Żadnego klucza imbusowego.

### 1.6 Co w referencji jest proste i dlaczego działa

1. **Jedna płaska płyta** niesie wszystko: gniazda serw i słupki łożysk. Zero ramek, zero wsporników. Serwa wkłada się od góry przy pełnym dostępie, zanim pojawi się gałka.
2. **Jeden przegub na gałkę**, z drutu i dwóch wydruków. Gałka waży kilka gramów (kopuła PLA ~35 mm → ~5–8 g [Z]), więc drut Ø1 w plastiku wystarcza i na nośność, i na luz.
3. **Pręty bez przegubów.** Drut w otworze orczyka (Ø1, pasowanie ciasne) i w zaczepie gałki tworzy przegub walcowy z luzem; skręcanie i boczne odchylenia bierze na siebie sprężystość drutu i luz w otworach. Działa, bo kąty są małe (szac. ±10–20°), siły małe, a pręty długie względem ramion (ok. 30–40 mm przy ramieniu orczyka ~10 mm).
4. **Nic nie jest „na milimetr”**: gałka stoi nad płytą, orczyki są poza obrysem gałki, pręty biegną w wolnym powietrzu (Z5).
5. **Montaż bez narzędzi precyzyjnych**: kombinerki, wkrętak, klej. Kalibracja przez start na 90° i gięcie drutu.
6. **Brak wymagań zakresu**: autor nie podaje kątów, przyjmuje to, co wyjdzie z ramion.

## 2. Adaptacja: gałka Ø60, otwór ≤ Ø80, 4 × MG90S, części z PRD §7

### 2.1 Czy podparcie z referencji wystarcza przy Ø60? Kardan: potrzebny, z jednego powodu

**Nośność:** nie jest problemem. Gałka Ø60 ze ścianką 1,5 mm: 4π·30²·1,5 ≈ 17 000 mm³ → ~21 g PLA; z zaślepką i uszkami ~30 g. Drut Ø2 jako sworzeń w plastiku przeniesie to z zapasem rzędu 100×.

**Obwiednia w otworze Ø80: to jest problem.** W referencji oś obrotu leży z tyłu gałki, nie w jej środku (1.2, [Z]). Gałka obracana o θ wokół punktu odsuniętego o d od środka przesuwa swój środek o d·sin θ w bok. Otwór musi mieć ≥ 60 + 2·d·sin θ:

| Odsunięcie osi d | Otwór przy ±35° | Otwór przy ±30° | Zakres mieszczący się w Ø80 |
|---|---|---|---|
| 30 mm (oś przy tylnym biegunie, jak w referencji przy d ≈ R) | 94 mm | 90 mm | ±19,5° |
| 20 mm | 83 mm | 80 mm | ±30° (minimum PRD, bez zapasu) |
| 17 mm | 79,5 mm | 77 mm | ±35° (cel PRD, zapas 0,25 mm na stronę) |
| **0 (oś w środku gałki)** | **60 mm** | **60 mm** | **dowolny; 10 mm zapasu promieniowo** |

Wniosek: żeby zmieścić minimum PRD (±30°) w Ø80, oś musi leżeć ≤ 20 mm za środkiem, czyli **wewnątrz gałki**; żeby mieć cel (±35°) z zapasem, oś ma być w środku. Przegub w środku gałki = „kardan w środku gałki” z briefu. **Kardan jest potrzebny**, ale jako jedyny dodatek; przeniesienie 1:1 (oś za gałką) daje ±19,5° – poniżej minimum PRD.

Dwie realizacje przegubu w środku, do wyboru użytkownika (różnica D1 w §3):

- **(A) Kardan 5/5 posiadany** (Ø11 × 25,5, otwory Ø5 głęb. 7, wkręty M4, zgięcie > 90° – `e6-pomiary.md`). Tylna piasta na trzpieniu Ø5 (= śruba M5) z płyty, przednia piasta na śrubie M5 wkręconej od środka w przednią półkulę. Zero słupków, zero szczelin w gałce, gałka gładka z przodu. Koszt: tylny otwór w gałce ~Ø48 (piasta Ø11 obracana o ±35° wokół środka: 30·sin 35° + 5,5 → promień 23; przyjąłem 24), dwie śruby M5, dwa wkręty M4 (są w kardanie).
- **(B) Przegub drukowany jak w referencji, przeniesiony do środka gałki**: słupki wchodzą do gałki przez szczeliny na równiku (3 i 9 godzina), oś pozioma z drutu Ø2 przez słupki i widełki, oś pionowa z drutu Ø2 widełki–gałka. 2 wydruki + 2 druty, zero śrub w gałce. Koszt: szczeliny ±35° (łuk 2·30·sin 35° = 34 mm) na bokach gałki dokładnie tam, gdzie są zawiasy powiek (2.3), więc kolizja słupków z powiekami do rozwiązania osobno; widoczne wydruki przegubu w szczelinach.

W dalszej części opisuję (A), bo nie dodaje części do wydruku i nie koliduje z powiekami.

### 2.2 Układ (A): lista części

**Drukowane (wszystko ≤ 110 mm, A1 mini):**

| # | Część | Wymiary | Uwagi |
|---|---|---|---|
| P1 | Gałka: przednia półkula | Ø60, ścianka 1,5; od środka kieszeń sześciokątna na łeb M5 i otwór Ø5,3 w osi | druk równikiem na stole; przód gładki, bez otworu (dopuszczalne „zero” Ø3 wg PRD) |
| P2 | Gałka: tylny pierścień | strefa kulista od równika do otworu Ø48 (kąt 53° od tylnego bieguna) + **2 uszka** sięgające do promienia 20 (na 3 i 6 godzinie), otwór Ø1,5 (drut Ø1,0) | klejony do P1 na równiku, jak w referencji |
| P3 | Powieka górna | czasza kulista R wewn. 31,5 / R zewn. 33, ćwiartka + uszka zawiasu na osi Y (3 i 9 godz.) + uszko napędu wg PRD (34 mm od osi) | PRD §4 |
| P4 | Powieka dolna | jak P3, lustro | |
| P5 | Płyta serw | ~110 × 90 × 4, 4 gniazda MG90S (1 leżące, 3 stojące), otwór Ø5,3 w osi, 2 słupki zawiasu powiek do promienia 36 | odpowiednik eye_holder_main |
| P6 | Tuba z kołnierzem | Ø80 zewn., ścianka 2,5, długość = grubość ściany dyni (do pomiaru), kołnierz z 4 łapami pod wkręty 4 × 30–40 | PRD §4; łączona z P5 4 nóżkami (jeden wydruk albo 4 × M3, do CAD) |
| P7 | Maskownica | pierścień Ø84 × Ø78 × 2 | PRD §4 |

**Posiadane:** 4 × MG90S z orczykami jednoramiennymi i śrubkami orczyka; kardan 5/5 ×1 (z 2 wkrętami M4); M5 × 35 + nakrętka (trzpień z płyty), M5 × 16 (w gałce); 2 × M3 × 16 (zawiasy powiek, wkręcone w słupki, luźne Ø3,3 w uszkach powiek); drut sprężynowy Ø1,0 – 4 odcinki 35–50 mm; 4 wkręty 4 × 30–40; klej na gorąco (serwa w gniazdach), klej (P1–P2, maskownica).

**Liczba śrub w mechanizmie: 2 × M5, 2 × M3, 2 wkręty M4 (w kardanie), 4 śrubki orczyków.** Przegubów: 1 (kardan). Części drukowanych: 7.

### 2.3 Budżet promieniowy w otworze Ø80 (na stronę, od osi)

| Warstwa | od | do | Uwaga |
|---|---|---|---|
| Gałka | 0 | 30,0 | |
| Luz gałka–powieka | 30,0 | 31,5 | |
| Powieka (czasza) | 31,5 | 33,0 | |
| Luz powieka–słupek | 33,0 | 34,0 | |
| Słupek zawiasu (P5) z gwintem M3 | 34,0 | 36,5 | tylko na 3 i 9 godzinie |
| Luz słupek–tuba | 36,5 | 37,5 | **1 mm** |
| Ścianka tuby | 37,5 | 40,0 | |

Zapas między słupkiem a tubą to 1 mm, czyli „na milimetr”. Trzy wyjścia (różnica D7): zawias powiek w ściance tuby zamiast na słupkach (zyskuje 3,5 mm), tuba cieńsza (1,6 mm) albo bez tuby (sam kołnierz za ścianą dyni, otwór w dyni prowadzi gałkę – dokładnie jak w masce referencji). Wybór należy do użytkownika, bo tuba jest w PRD.

### 2.4 Dźwignie i zakres ruchu

Łącznik drutowy jak w referencji: koniec „Z” w otworze orczyka, koniec „Z” w uszku. Przybliżenie: a·sin φ ≈ r·sin θ (a – ramię orczyka = otwór 5,5…17,5 mm co 2 mm; φ – wychylenie serwa; r – promień uszka od osi obrotu; θ – kąt gałki).

| Oś | r uszka | Cel PRD | Potrzebne a przy φ = ±45° | przy φ = ±60° | Minimum PRD przy ±45° |
|---|---|---|---|---|---|
| Lewo–prawo | 20 | ±35° | 16,2 → **otwór 17,5** (θ = ±37,6°) | 13,2 → otwór 13,5 | ±30°: a = 14,1 → otwór 15,5 |
| Góra–dół | 20 | ±25° | 12,0 → **otwór 11,5** (θ = ±24°) lub 13,5 (±28,5°) | 9,8 → otwór 9,5 | ±20°: a = 9,7 → otwór 9,5 |
| Lewo–prawo | 30 (uszko na obrzeżu otworu, bez wgięcia) | ±35° | 24,3 → **poza orczykiem** | 19,9 → poza | ±30°: 21,2 → poza |

Dlatego uszka P2 są wgięte do promienia 20 (różnica D5). Przy r = 20 cały zakres PRD (cel i minimum) mieści się w otworach standardowego orczyka przy ±45° serwa; MG90S ma 180° mechanicznie, więc jest też rezerwa na ±60°.

Sprzężenie osi (uszko lewo–prawo przy obrocie góra–dół i odwrotnie): uszko w (x = −18, y = ±20) przesuwa się przy ±25° góra–dół o 18·sin 25° = 7,6 mm w poprzek pręta; przy długości pręta 30 mm to 14,7° skosu. Uszko góra–dół przy ±35° lewo–prawo: 18·sin 35° = 10,3 mm → 19° skosu przy 30 mm, 14° przy 40 mm. Luz kątowy „Z” Ø1,0 w otworze Ø1,5 w uszku grubości 1,2: atan(0,5/1,2) = 23°; w orczyku (Ø1, gr. ~1,5) ~0°, więc skos bierze **sprężystość drutu** – tak samo jak w referencji (1.3, pręty skośne). Pręty ≥ 40 mm (serwa dalej od gałki) zmniejszają skos; w CAD do sprawdzenia przemiataniem.

Powieki: wg PRD (uszko 34 mm od osi, przedłużenie orczyka 25 mm, otwarcie 51,5°). Nie liczę ponownie.

Kolizje w otworze tylnym gałki (Ø48): trzpień M5 (promień 2,5) na osi; uszko lewo–prawo po obrocie o 35° trafia w (−26,2; 6,1) → 3,6 mm od trzpienia. Krawędź otworu po obrocie 35° najbliżej trzpienia w (−28,5; 9,3) → 6,8 mm. Piasta tylna kardana (x od −12,75 do 0, R 5,5) nie sięga uszek (promień 20).

### 2.5 Szkic

Widok z boku (oś X = kierunek patrzenia, w prawo = na zewnątrz dyni). Skala ok. 1 znak = 5 mm.

```
  wnętrze dyni                      ściana dyni (~30)        zewnątrz
                                   |###############|
  P5 płyta serw     nóżki  kołnierz|   P6 tuba     |  P7
  +----+                  łapa     |===============|  ||
  |    |----------------- [wkręt]  |               |  ||
  |serw|  <- stojące (góra-dół)    |      ___      |
  |G-D |   orczyk w płaszczyźnie XZ|   .-'   '-.   |
  |    |====drut Ø1 (30-45)====> u6|  /  P1/P2  \  |
  +----+                           | |     +     | |    + = środek gałki = krzyżak kardana
  |    |  M5x35 trzpień ---[kardan 5/5]--+--M5x16  |     tylny otwór Ø48 wokół trzpienia
  |    |===========================|  \         /  |
  |serw|  <- leżące (lewo-prawo), orczyk w płaszczyźnie YZ, poza obrysem gałki (y>35)
  |L-P |                           |   '-.___.-'   |
  +----+                           |   P3/P4 powieki R33, zawias na osi Y (w słupkach P5)
  |serw powieka G|  drut -> uszko powieki (34 od osi)
  |serw powieka D|
  +----+                           |###############|
```

Widok od tyłu (patrząc od wnętrza dyni na płytę P5, oś X w stronę patrzącego). Serwa leżą poza rzutem gałki Ø60 i otworu Ø48, orczyki dostępne z boku:

```
            Z ^
              |      [serwo powieki górnej, stojące]
              |         orczyk ↑ do uszka powieki G
    ----------+------------------------------------  y
   [serwo L-P |    .-'''''-.                          leżące, orczyk w płaszczyźnie
    leżące,   |   /  Ø60    \   u3 = uszko L-P (y=+20, x=-18)
    orczyk    |  |  ( Ø48 )  |  ← drut od orczyka L-P (po skosie ~40°)
    przy      |  |    (o)    |     (o) = trzpień M5 + nakrętka za płytą
    y=35..50] |   \   u6    /   u6 = uszko G-D (z=-20, x=-18)
              |    '-.___.-'    ↑ drut od stojącego serwa G-D
              |      [serwo G-D, stojące, pod gałką]
              |      [serwo powieki dolnej, stojące]
   słupki zawiasu powiek: na osi Y przy y = ±34..36,5, od płyty do x = 0
```

### 2.6 Kolejność montażu rękami (dostęp w każdym kroku)

| # | Krok | Narzędzie | Dostęp |
|---|---|---|---|
| 1 | Serwa wycentrować na 90° (ESP32, strona kalibracji); orczyki przykręcić śrubkami w pozycji środkowej | wkrętak krzyżakowy | na stole, przed czymkolwiek |
| 2 | Serwa w gniazda P5 od przodu, zakleić kroplą kleju na gorąco (albo klips M3 – D6) | pistolet do kleju | płyta pusta, pełen dostęp |
| 3 | P1: M5 × 16 łbem w kieszeń od środka półkuli; kardan 5/5 przednią piastą na trzpień, wkręt M4 dokręcić | imbus (z kardana) | półkula otwarta od tyłu, wkręt na równiku |
| 4 | M5 × 35 w tylną piastę kardana, wkręt M4 | imbus | j.w. |
| 5 | P2 (pierścień z uszkami) nakleić na P1 na równiku; uszka ustawić: L-P na 3 godz., G-D na 6 godz. | klej | na stole |
| 6 | Gałkę z trzpieniem wsunąć przez otwór Ø5,3 płyty P5 od przodu, nakrętka M5 od tyłu płyty | klucz 8 | tył płyty wolny |
| 7 | Powieki P3, P4 na słupki: M3 × 16 przez uszka obu powiek w słupek (gwint w słupku) | wkrętak | słupki na zewnątrz gałki (y = 34–36,5), śruba od zewnątrz |
| 8 | Pręty Ø1,0: zagiąć „Z” z obu końców (długość zmierzyć na złożeniu: od otworu orczyka do uszka + 2 × zagięcie); włożyć w uszko gałki, potem w otwór orczyka | kombinerki | orczyki poza obrysem gałki, uszka przez otwór Ø48 widoczne od tyłu? **nie** – uszka są z przodu płyty; dostęp z boku między płytą a gałką: szczelina ≥ 15 mm (płyta x = −45, tył gałki x = −30) |
| 9 | Test ruchu na stole, kalibracja kątów w ESP32 | – | |
| 10 | P6 (tuba + kołnierz) do P5 (jeśli osobne: 4 × M3) | wkrętak | |
| 11 | Moduł od środka dyni w otwór Ø80; 4 wkręty 4 × 30–40 przez łapy w miąższ | wkrętak | ręka w dyni; **płyta 110 × 90 musi przejść przez otwór, którym wkłada się moduł do dyni – D9** |
| 12 | Maskownica P7 z zewnątrz, klej | | |

Krok 8 to jedyne miejsce z ograniczonym dostępem (szczelina 15 mm między tyłem gałki a płytą). Lekarstwo w CAD: płyta 10 mm dalej (x = −55) wydłuża pręty do 40–45 mm, co zmniejsza też skosy z 2.4. Nic nie przechodzi obok siebie na milimetr poza budżetem promieniowym 2.3 (1 mm słupek–tuba), który jest różnicą D7.

## 3. Różnice wobec referencji – pytania do użytkownika

| # | Co | W referencji | W adaptacji | Dlaczego | Inne możliwości | Pytanie |
|---|---|---|---|---|---|---|
| D1 | Przegub gałki | drukowane widełki + krzyżak na drutach, oś za gałką | **kardan 5/5 w środku gałki** (2 × M5, 2 wkręty M4) | otwór Ø80: oś za gałką daje max ±19,5° (2.1) | (B) przegub drukowany w środku gałki na drutach Ø2 ze szczelinami w bokach gałki; albo zostać przy ±19,5° i przerobić PRD | **Kardan 5/5 czy drukowany przegub w środku (B)?** |
| D2 | Gałka | ~35 mm [Z], 2 połówki | Ø60, 2 części klejone | PRD | – | bez pytania (PRD) |
| D3 | Serwa | 5 na 2 oczy, 1 na obie powieki | 4 na 1 oko, 2 na powieki | PRD (decyzja 25.10) | – | bez pytania |
| D4 | Pręty | spinacz (~Ø0,9) | drut sprężynowy Ø1,0 (pasuje w otwory orczyka Ø1 jak spinacz) | posiadany, sztywniejszy, nie wymaga wiercenia orczyka | drut ocynk. Ø2,0 (miękki, łatwy w gięciu) z rozwierceniem otworów orczyka do Ø2,1; pręty drukowane | **Ø1,0 sprężynowy czy Ø2 z wierceniem orczyków?** |
| D5 | Uszka na gałce | [Z] zaczep na krawędzi kopuły (r ≈ R) | uszka wgięte do r = 20 | przy r = 30 orczyk 17,5 nie da ±30° (2.4) | uszka na obrzeżu r = 24–30 + przedłużenie orczyka drukowane (jak dla powiek w PRD) | **Uszka r = 20 czy przedłużenia orczyków?** |
| D6 | Mocowanie serw | gniazda, [Z] bez śrub, klej | gniazda + kropla kleju na gorąco | klej dozwolony (PRD), uszy MG90S mają otwarte wycięcia, M3 się nie mieści | mostek drukowany na M3 nad korpusem; wkręty M2 (brak w PRD §7) | **Klej czy mostek M3?** |
| D7 | Zawias powiek | [Z] drut w słupkach | M3 × 16 w słupkach P5 (zasada śrub z AGENTS); zapas do tuby 1 mm (2.3) | AGENTS: śruba tam, gdzie się obraca | zawias w ściance tuby (zysk 3,5 mm); sworzeń z drutu Ø2 jak w referencji; tuba 1,6 mm; bez tuby | **Słupki M3 z zapasem 1 mm, zawias w tubie, czy drut?** |
| D8 | Mocowanie do dyni | klej na gorąco do listew w masce | tuba Ø80 + kołnierz + 4 wkręty | PRD | – | bez pytania (PRD); długość tuby = grubość ściany dyni: **do zmierzenia** |
| D9 | Wielkość płyty | płyta 110–120 mm w masce otwartej od tyłu | płyta ~110 × 90 wkładana do dyni od środka | 4 serwa poza obrysem gałki | płyta dzielona; serwa ciaśniej (≤ Ø80, ale orczyki w cieniu gałki) | **Jakim otworem moduł wchodzi do dyni (pokrywa u góry? dno Ø80 nie wystarczy)?** |
| D10 | Oś powieki vs oś gałki | [Z] nie widać | obie na osi Y przez środek gałki (powieki współśrodkowe) | powieki mają przejść nad gałką z luzem 1,5 | – | bez pytania (technika) |
| D11 | Serwo przy ±60° zamiast ±45° | brak danych | opcja: krótsze ramię orczyka | 2.4 | – | technika, do kalibracji |

Każdy wiersz z pytaniem to decyzja użytkownika; do CAD idzie dopiero po odpowiedzi (PRD §9).

## 4. Zakres ruchu wobec PRD

| Oś | PRD cel | PRD min. | Adaptacja (A), r = 20, serwo ±45° | Referencja 1:1 (oś za gałką, d = 30) |
|---|---|---|---|---|
| Lewo–prawo | ±35° | ±30° | **±37,6°** (orczyk 17,5) / ±30° (15,5) | ±19,5° (limit otworu Ø80), poniżej minimum |
| Góra–dół | ±25° | ±20° | **±28,5°** (13,5) / ±24° (11,5) | ±19,5°, na granicy minimum |
| Narożniki | elastycznie | – | skos prętów 15–19° przy 30 mm; do przemiatania w CAD | – |
| Powieki | pełne otw.–zamkn. | – | wg PRD 51,5° (nie liczone ponownie) | tak, liczby brak |

Jeśli użytkownik odrzuci kardan (D1) i zostawi przegub za gałką: zakres ±19,5° w obu osiach albo większy otwór (±30° wymaga Ø90, ±35° Ø94).

## 5. Werdykt

Adaptacja (A) ma 7 wydruków, 1 przegub, 4 śruby plus 2 wkręty kardana i 4 druty bez oczek, wszystkie orczyki i śruby dostępne z boku poza obrysem gałki – jest prostsza niż konstrukcja z kardanami 2/2 przy gałce i ramkami serw i da się ją złożyć rękami, pod warunkiem rozstrzygnięcia zapasu 1 mm przy zawiasie powiek (D7) i otworu, którym moduł wchodzi do dyni (D9).
