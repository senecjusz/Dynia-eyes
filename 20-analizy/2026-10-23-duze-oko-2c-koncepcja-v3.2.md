# Duże oko 2c – koncepcja v3.2 (E6.1e, 23.10)

Autor: Opus (realizator v1–v3.1). Zlecenie orkiestratora z 23.10, wąskie, po weryfikacji v3.1 przez Astrę (NIE). Pięć punktów: kolizja piasty M2 Y ze Słupkiem, typ `ann` we wszystkich parach i punkt Astry jako przypadek kontrolny, poprawka `prism_d()`, bryły istniejące w CAD, krok ruchu. W trakcie doszły wiadomości orkiestratora:
- rant Ramy po sferze R152 i kołnierz od z 6;
- B4 zamknięte (rysunek MG90S, M2 + nakrętka w uszach, kanał kabla z obu stron);
- B1 nieblokujące (wymiary przegubów jako zmienne z przedziałami poprawności, próbka P4 jako pierwszy wydruk etapu 2);
- **końcówek kulowych RC nie ma**: pręty z przegubami krzyżowymi zamiast S–S;
- zmiany CAD: nadlewy Gałki, ucha Ramy, kieszeń kardana Ø11,6;
- słupki stopu powiek: pomiar wykonawcy CAD, pary stała–stała.

Metoda według decyzji orkiestratora: model analityczny jest narzędziem projektowym, a końcowa kontrola kolizji pójdzie na siatkach z CAD. Nie dowodzę formalnie dolnego ograniczenia dla ruchu ciągłego. Krok ruchu dobieram tak, żeby punkt na R30 przesuwał się między próbkami o ≤ 0,05 mm przy minimach.

V3.2 jest samowystarczalna: wykonawca CAD nie musi czytać v1–v3.1. W repo zapisałem ten plik i katalog `40-cad/narzedzia/e6-przemiatanie/` (skrypty v3.1 przeniesione do `v3.1/`). Bez commitów, bez prognoz czasu, bez zakupów modelarskich.

Oznaczenia: **[F]** fakt (źródło, pomiar, plik), **[R]** rachunek skryptem z katalogu wyżej, **[Z]** założenie, **[A]** własna adaptacja, niesprawdzona.

**Układ współrzędnych:**
- O = środek kuli i krzyżaka kardana 5/5;
- **+z** z dyni na zewnątrz, **+y** w górę, **+x** w prawo patrząc na dynię z zewnątrz;
- ψ+ = spojrzenie w prawo, **θ+ = spojrzenie w górę**, obrót gałki R = Rx(−θ)·Ry(ψ);
- układ gałki (indeks b) obraca się z gałką; w zerze pokrywa się ze światem;
- kąty powiek to kąt krawędzi przedniej od +z ku +y (pkt 5).

## Korekta 23.10 (po weryfikacji Astry v3.2 i uwagach wykonawcy CAD) – co się zmieniło

Ten plik nadpisuje pierwszą wersję v3.2. Zmiany:

| # | Skąd | Zmiana | Wynik [R] |
|---|---|---|---|
| K1 | Astra pkt 1 (KRYT.) | filar stopu D otwarcia wchodzi w słupek do jego środka; płytka 2 mm przy czole klatki S_PG dla słupka G zamknięcia (gałąź `klatka` w `stop_posts()`); słupek G otwarcia przechodzi przez tarczę | przekroje połączeń 35,4 / ok. 30 / 33,6 mm² (pkt 5.2); pary stała–stała ≥ 0,556 |
| K2 | Astra pkt 2 (KRYT.), wykonawca (a) | łapy pod nadlewy jako osobne części L × 2, żeberko 5 × 5; **DIN 7991 M3×6 od tyłu** w nadlew (wejście 4,0, do dna 1,4), DIN 7991 M3×8 od wierzchu płyty w żeberko | pkt 3.5 |
| K3 | Astra pkt 3 | luz zwrotny z pełnej macierzy dwóch prętów i z przesuwem krzyżaka między policzkami; `luzOs` 0,125 na stronę (0,25 razem); kryterium P4 na luz długości ≤ 0,64 mm | luz gałki w pracy 3,8° / 2,8° (c 0,03) … 5,1° / 3,9° (c 0,05) |
| K4 | Astra pkt 4 | kontrola wnętrza przegubów w 3D (`przeguby_3d.py`) zamiast płaskich przekrojów; przy gałce rS 2,6 → 1,9 (łby DIN 7985 na widełkach stałych), a1 = −y | odstęp ≥ 0,634, zapas kąta ≥ 3,5° |
| K5 | Astra pkt 5, orkiestrator | długości sworzni i głębokości otworów w jednej tabeli (gałka M2×4, a2 skrócone do 3,7; orczyk M2×5; otwory = wejście + 0,25); `rP` gałki 2,3 (pogłębienie Ø3,8, ścianka 0,4); krążek gałki Ø5,75; zginanie sworznia i wyrwanie policzone | pkt 3.3 |
| K6 | Astra pkt 6 | przemiatanie i `przeguby_akceptacja.py` na aktualnym modelu (skrót e549b91f9f229d26); narzędzie sprawdza komplet wymiarów, pary stała–stała i wnętrze 3D; pary obrotowe i ucho/mostek – rura liczone dokładnie; progi bez zmian | ⟦brak⟧ |
| K7 | orkiestrator (C1) | kołnierz Ramy bez wycięcia; Powieka górna z CAD: mostek 56–95°, ucho G R5,5 | ucho G – rura 0,500, mostek G – rura 0,496 |
| K8 | orkiestrator (B9) | otwory sworzni podwymiarowe, rozwiercane ręcznie do c ≈ 0,03–0,05 | pkt 3.3 |
| K9 | wykonawca (P4) | podstawa widełek pręta przy orczyku walec Ø8; trójkąty 45° pod podstawą widełek pręta przy gałce (DFAM); czop obrotnicy Ø4,4 | w przemiataniu i w 3D; koniec Ramienia zwężony do 6 na 10 mm (bez tego Ramię Y – podstawa Ø8: −0,31) |
| K10 | wykonawca (Uchwyt b–e) | wsporniki widełek płaskie, 46° do poziomu, do ściany tulei; tuleja przednia zamknięta do z_b 19,75; węzły żebra co 2,5°; a1 = −y | pkt 3.5 |

## 0. Wynik

1. **Kolizja piasty M2 Y ze Słupkiem (zlecenie pkt 1) usunięta zmianą przegubów, Słupek bez zmian.** Kulek M2 i piast nie ma. Środek przegubu Y przy gałce: (0; 20; −6). Pręt trzymają widełki stałe Uchwytu nad płytą okna, z policzkami w y_b 15,0…17,0 i 23,0…25,0. Bryły przegubu Y mają do Słupka z tuleją i kardana dolnego **≥ 1,50 mm** w całym zakresie; cały Uchwyt ≥ 1,09 mm (łapy). Szczegóły pkt 3.5.
2. **Pręty U–R–U z 4 przegubami krzyżowymi drukowanymi (wariant a).** Obrotnica M3 wzdłuż pręta przy orczyku daje dokładnie jeden więz, jak S–S, bez jałowego obrotu pręta (pkt 3.2). Kardan 2/2 przy gałce (wariant b) odrzuciłem liczbami. Wymiary przegubów są zmiennymi z zakresami (pkt 3.3); wnętrze przegubów w 3D ≥ 0,634 mm, zapas kąta ≥ 3,5°.
3. **Model:** `ann` we wszystkich parach i przypadki kontrolne (punkt Astry −0,803, stara piasta −0,859), `prism_d` (−20; 0; −2) → 2,5, bryły z CAD, kable 3,6 × 1,2, krok 0,05° (0,026 mm na R30) przy minimach, pary stała–stała i Uchwyt–Gałka, wnętrze przegubów 3D.
4. **Wynik pełnego przemiatania:** najmniej w pracy **0,479 mm** (G ucho – rura), w całym zakresie **0,147 mm** (Y Ramię – Y widełki pręta), bez styków zamierzonych i par obrotowych. Okno – Słupek 0,5605 w pracy. Pary stała–stała ≥ 0,556. Akceptacja przegubów: ⟦brak⟧. Obie listy 10 minimów są w pkt 10.
5. **Zmiany istniejących części CAD** (pkt 10, C2–C6): wycięcie czaszy G przy uchu D; zmienne wycięć Gałki `rimX` 98 / ±30 i `rimY` 102 / ±40; `wyciecieG` 82,5° w pasie x −14…24; Uchwyt dopasowany do nadlewów (kieszeń w płycie i łapy). Kołnierz Ramy bez zmian.
6. **Słupki stopu:** tabela do CAD z podparciami i przekrojami połączeń (pkt 5.2). Słupki D leżą w x −22,5…−16,6, poza S_X.
7. **B4 zamknięte**, **B1 nie blokuje**: rozstrzyga `przeguby_akceptacja.py` i próbka **P4 jako pierwszy wydruk etapu 2**.
8. **Najsłabszy punkt: luz zwrotny drukowanych przegubów.** Przy rozwierconych otworach (c 0,03–0,05, decyzja B9) gałka ma w pracy 3,8° / 2,8° … 5,1° / 3,9° luzu (ψ / θ, najgorsze ułożenie obu prętów). Potwierdza to P4.

## 1. Co zmieniłem względem v3.1

| Obszar | v3.1 | v3.2 | Skąd |
|---|---|---|---|
| Przeguby prętów | kulki RC M2 (gałka) i M5 (Ramię), S–S | **U–R–U: 4 przeguby krzyżowe drukowane**, sworznie M2×5, obrotnica M3 wzdłuż pręta przy orczyku; wszystkie wymiary jako zmienne z przedziałami (pkt 3.3) | końcówek RC nie ma (orkiestrator 23.10) |
| Punkt przegubu przy gałce | X i Y (19,5; −6) | **X (21,25; 0; −6), Y (0; 20; −6)** (`pktR` 21,25, `pktRY` 20) | miejsce na krzyżak i widełki; czasza gałki (pkt 3.4) |
| Ramiona X/Y | r13 / r15, czop M5 pochylony | **r14,7 / r15,4**, widełki stałe przegubu na Ramieniu, bez czopu i gniazda M5 | kąty nacisku jak w v3.1 przy nowych punktach |
| Piasta M2 Y | Ø6 wzdłuż −y gałki, 5 mm do środka; wchodzi w tuleję Słupka od θ ≈ 12° (Astra) | **nie ma** – widełki stałe Y nad płytą okna, ≥ 1,50 mm od Słupka w całym zakresie (pkt 3.5) | Astra v3.1 pkt 2 |
| Pary | bez typu `ann` (tuleje) | `ann` we wszystkich listach par; punkt Astry (0,0077; 6,8469; −11,1521) jako przypadek kontrolny: −0,803 mm | Astra pkt 2–3 |
| `prism_d()` | punkt nad płytą dawał 3,0 | dokładna odległość do graniastosłupa: (−20; 0; −2) nad płytą z −7,5…−4,5 → **2,5** (przypadek kontrolny) | Astra pkt 4 |
| Bryły z CAD | brak | mostek G R4,5–8 (x 30,95–36,25, 56–95° od krawędzi przedniej), ucho G R5,5 (x 33,85–36,25), ucho D R4 (x 30,95–33,6), boki osi Ramy R5 (x ±36,5–38,5), Uchwyt z płytą, łącznikami, nadlewami, tuleją przednią i żebrem w parach z powiekami; kable jako pełny prostokąt 3,6 × 1,2 | zlecenie v3.2 pkt 4 |
| Krok ruchu | gałka 1°, zagęszczenie ±0,25° co 0,05° | to samo, policzone na R30: 0,05° = **0,026 mm** między próbkami przy minimach (pkt 10) | zlecenie pkt 5 |
| Gałka – CAD | stożek 115° | płaskie cięcie z_b −12,68 (jak w CAD), nadlewy M3 φ 210°/330°, R23,5, Ø7, z −12,68…−6,68 | Astra pkt 10, CAD 23.10 |
| Rama | ucha R30,5–37,75 | ucha R4 na R34,5, z −33…−27, gwint M3 Ø2,5 × 6 na R33, fazka 3 × 45° pod uchem; słupki Płyty ze stożkowym końcem 45°; rant po sferze R152, kołnierz R35,2 od z 6 | CAD 23.10 |
| Słupek | kieszeń Ø11,3 | **Ø11,6** (`luzKieszeni` 0,3) | CAD 23.10, Astra pkt 10 |
| MG90S | M2,5 z podkładką, B4 otwarte | **M2×10 + nakrętka M2 w kieszeni bloku**; kanał kabla z obu krótszych ścian (w modelu obie trasy); B4 zamknięte | orkiestrator 23.10 |
| Słupki stopu powiek | 6 × 6 przy ściance klatki, bez par stała–stała | położenia przeliczone na styk boku ramienia, podparcia (klatka, łącznik do ramienia 200°, filar z tarczy), pary stała–stała policzone (pkt 5.2) | pomiar wykonawcy CAD |
| Płyta okna | R zewn. 27 | **R26,6** (przy z_b −7,5 do czaszy R28 zostaje 0,36) | kontrola Uchwyt–Gałka (nowa) |

## 2. Wymiary i miejsce

| Wielkość | Wartość | Status |
|---|---|---|
| Gałka | Ø60, ścianka 2 (R28–30), tył płaski z_b −12,68 (CAD), wycięcia φ 0° ±30° od 98° i φ 80° ±40° od 102° (kąt od osi patrzenia), biała, front gładki | [F] CAD, [R] |
| Zakres gałki | praca ψ ±25°, θ ±15°; okno na ±28°/±18° (`zapasOgr` 3°); granica mechaniczna pkt 4 | [R] okno.py |
| Powieka górna (G) | krawędź przednia: zamknięta −8,5°, otwarta +42°, z podążaniem +47°; ograniczniki −9,25° i +47,75° | [R] |
| Powieka dolna (D) | zamknięta −11,5°, otwarta −38°, z podążaniem −43°; ograniczniki −10,75° i −43,75° | [R] |
| Środek kuli za powierzchnią dyni | g = 10 mm (`glebokoscSrodka`) | [Z] |
| Obwiednia przejścia | walec Ø79,5 od z +10 do z −74,40; poza nim tylko rant Ø84 | [R] |
| Tył modułu | słupek stopu otwarcia G do z −74,40 (ramię G −73,27) | [R] |
| Głębokość za wewnętrzną ścianką | 74,40 + g − w; przy g 10, w 15: **69,4 mm** + kable bokiem | [R], B5 |

## 3. Napęd gałki

### 3.1 Kardan 5/5 i Słupek (bez zmian poza kieszenią)

- **Pomiar [F]:** Ø11 × 25,5, krzyżak 12,75 od czoła, otwory Ø5 głębokości 7, wkręt M4 9,1 od osi sworznia, zgięcie > 90°.
- **B2 [F, e6-pomiary.md, pewność średnia]:** oś wkrętu M4 równoległa do sworznia tej samej piasty; tylny sworzeń na x, otwór M4 w Słupku na ±x. Potwierdzić zdjęciem przed drukiem Słupka.
- **Słupek:** walec R7,65 od z −33 (wierzch piasty wspornika) do −12,75; tuleja Ø**11,6**/Ø15,3 do z −5,5 (kieszeń tylnej piasty kardana, `luzKieszeni` 0,3); otwór Ø4,2 na ±x w osi z −9,1 dla M4 bez łba.
- **Trzpień:** DIN 7991 M5×30 od spodu piasty wspornika (łeb w gnieździe stożkowym z −37…−34,2), nakrętka M5 w kieszeni Słupka (z −20…−16), koniec na z −7,0.
- **Blokada obrotu:** spłaszczenie 0,6 mm spodu Słupka w kieszeni piasty.
- **Przednia piasta kardana** w tulei Uchwytu Ø11,6/Ø15,3 od z_b +7,0 do +12,75, M5×12 z nakrętką w kieszeni, M4 przez ściankę.
- Wnętrza kardana (połówka górna wobec dolnej) nie sprawdzam: zgięcie > 90° [F].

### 3.2 Pręty U–R–U: dlaczego tak i który wariant

**Liczenie stopni swobody.** Pręt S–S ma 3 + 3 = 6 stopni swobody względnych, z czego jeden to obrót pręta wokół własnej osi: jałowy, a ruch gałki określa jedno równanie długości. Pręt z dwoma przegubami krzyżowymi (U–U) ma tylko 2 + 2 = 4, czyli nakłada **dwa** więzy zamiast jednego i przy dwóch prętach i dwóch serwach zakleszcza kulę. Dlatego jeden koniec dostaje obrotnicę wzdłuż pręta: **U–R–U** ma 2 + 1 + 2 = 5 stopni swobody i nakłada dokładnie jeden więz (stała odległość środków krzyżaków), jak S–S.
- Oś obrotnicy przechodzi przez środek krzyżaka H, więc trzy osie (a1, a2, obrotnica) przecinają się w H: zespół działa jak przegub kulisty w H. **Kinematyka jest identyczna z S–S**, a środek krzyżaka jest punktem przegubu (wzór IK pkt 3.4).
- **Obrotu jałowego nie ma:** obrót pręta wokół osi jest wyznaczony przez położenie obu widełek (U przy gałce nie pozwala na obrót wokół pręta, a obrotnica przy orczyku przenosi go na widełki orczyka). Pręt nie ma więc stopnia swobody, który mógłby grzechotać. Zostają tylko luzy sworzni i obrotnicy (pkt 3.3, luz zwrotny).

**Wybór wariantu (liczby):**

| Wariant | Co | Wynik | Decyzja |
|---|---|---|---|
| (a) 4 przeguby drukowane | krążek-krzyżak Ø5,75 / Ø8 × 4, sworznie M2, obrotnica M3 | wszystkie pary ≥ 0,147 mm w całym zakresie poza stykami zamierzonymi i parami obrotowymi; wnętrze przegubów w 3D ≥ 0,634 mm, zapas kąta ≥ 3,5° (pkt 3.3); luz zwrotny zależny od pasowania sworzni (pkt 3.3) | **wybrany** |
| (b) kardan 2/2 przy gałce + drukowany przy orczyku | kardan Ø9 × 23,5, połowa od krzyżaka 11,75 | szybkie przemiatanie (`pktR` 22): kardan Y – czasza gałki **0**, kardan Y – czasza górnej **0** (θ ±, G otwarta), pręt Y – czasza górnej **0**, kardan X – czasza gałki 0,013, kardan Y – płyta 0,43, kardan X – żebro 0,49; usunięcie tego wymaga głębszych wycięć gałki i powieki G w pasie pręta Y | odrzucony: większy kardan niż miejsce przy krawędzi gałki |
| (c) zapasowy kardan 5/5 | Ø11 × 25,5 | większy od 2/2 w każdym wymiarze, więc kolizje z (b) rosną | odrzucony |

Kardany 2/2 zostają w warsztacie jako zapas, gdyby próbka P4 nie zaliczyła luzu zwrotnego przy orczyku (pkt 15).

### 3.3 Przeguby krzyżowe drukowane

**Budowa [A] (oba końce tak samo, różnią się wymiarami):**
- **krzyżak:** krążek Do × Hr, oś krążka wzdłuż pręta; cztery promieniowe otwory Ø2,0 (drukowane Ø1,8 i **rozwiercane ręcznie wiertłem Ø2,0**), dwa na osi a1 i dwa na osi a2, w jednej płaszczyźnie, więc osie się przecinają;
- **widełki stałe** (na Uchwycie albo na Ramieniu): dwa policzki o grubości `policzek` w odległości Do/2 + `luzOs` od środka, zakończone łukiem o promieniu rS wokół osi a1, podstawa o grubości pS w odległości cS od środka;
- **widełki pręta:** to samo wokół osi a2, z promieniem rP, podstawą w cP i grubością pP. Przy orczyku podstawa jest dodatkowo **walcem Ø8 (`podstawaD`) współosiowym z prętem**, bo 2·rP = 5,2 nie mieści pogłębienia łba M3 (uwaga wykonawcy do P4). Przy gałce pod podstawą są **trójkąty 45°** od ±ho do pręta Ø4,5 (wysokość ho − 2,25 = 2,75 wzdłuż pręta), bo pręt drukuje się pionowo, widełkami do góry (DFAM, uwaga wykonawcy). Obie bryły są w przemiataniu i w kontroli wnętrza przegubu 3D;
- **sworznie:** wkręt M2 wkręcony w policzek (otwór Ø1,6, łeb dociska wkręt do policzka), obraca się w otworze krążka;
- **obrotnica przy orczyku:** wkręt M3×12 wkręcony w tulejkę pręta Ø7 × 6 (otwór Ø2,6); łeb (dk 5,5, k 3) w pogłębieniu Ø6 × 3,2 podstawy widełek pręta; podstawa obraca się na czopie tulejki **Ø4,4 (`czopD`)** przez długość 3,3, czop ma 3,4, więc luz osiowy s = 0,1 wynika z wymiarów, bez regulacji nakrętką (przy Ø5 łeb zachodził na stopień Ø5,4 tylko 0,05; uwaga wykonawcy);
- **luz osiowy krzyżak – policzki:** `luzOs` **0,125 na stronę**, razem 0,25 (tabela AGENTS: luz osiowy 0,2–0,3).

**Sworznie, długości i otwory** (L – długość wkręta, dla DIN 7991 całkowita, dla DIN 7985 pod łbem; wejście w krążek = L − `policzek` − `luzOs`; `otwGl` = wejście + 0,25):

| Miejsce | Wkręt | Wejście w krążek | Koniec wkręta od środka | `otwGl` | Dno otworu od środka |
|---|---|---|---|---|---|
| gałka, widełki pręta (a2) | DIN 7991 M2×4 **skrócony do 3,7**, łeb w pogłębieniu 90° Ø3,8 | 1,575 | 1,30 | 1,825 | 1,05 |
| gałka, widełki stałe (a1) | DIN 7985 M2×4 (łeb Ø4 × 1,6 na zewnątrz policzka) | 1,875 | 1,00 | 2,125 | 0,75 |
| orczyk, widełki stałe (a1) | DIN 7991 M2×5 w pogłębieniu Ø3,8 | 2,875 | 1,125 | 3,125 | 0,875 |
| orczyk, widełki pręta (a2) | DIN 7985 M2×5 | 2,875 | 1,125 | 3,125 | 0,875 |

Końce wkrętów a1 i a2 się nie stykają: walec wkręta a1 zajmuje x ≥ 1,00, |y| ≤ 1, a wkręta a2 y ≥ 1,30, |x| ≤ 1 (orczyk: oba od 1,125). Dna sąsiednich otworów przy orczyku i przy gałce (a1) zachodzą na siebie w narożniku do 0,25 × 0,25 – to tylko otwory, wkręty tam nie sięgają.

**Wymiary odniesienia (mm) i zakresy poprawności:**

| Zmienna | Opis | Gałka (`uGal`) | Orczyk (`uOrcz`) | Zakres i co zmienić poza nim [R] |
|---|---|---|---|---|
| `Do` | średnica krążka | 5,75 | 8,0 | gałka: ho = Do/2 + `luzOs` + `policzek` = 5,0; widełki pręta X – czasza gałki ma zapas 0,12 ponad 0,5, każde +0,1 ho zjada go 1:1 → więcej: `rimX` głębiej (0,5° na 0,25 mm). Mniej niż 5,6: końce wkrętów a1/a2 zaczynają się stykać (pkt wyżej). Orczyk: widełki orczyka X – rura zapas 0,46 |
| `Hr` | wysokość krążka | 4,0 | 4,0 | ≥ 4,0 (po 1,0 nad otworem Ø2 do czół – wyrwanie); więcej: krzyżak X – żebro mostka |
| `luzOs` | luz osiowy krzyżak – policzek, na stronę | 0,125 | 0,125 | 0,1–0,15 (tabela AGENTS 0,2–0,3 razem); więcej podnosi luz zwrotny o 2·Δ·sin β |
| `policzek` | grubość policzka | 2,0 | 2,0 | ≥ 2,0 (pogłębienie DIN 7991 1,1 + gwint 0,9); więcej jak `Do` |
| `rP` | ½ szerokości widełek pręta = promień końca | **2,3** | 2,6 | gałka ≥ 2,3 (ścianka 0,4 przy pogłębieniu Ø3,8) i **rP + rS ≤ 4,3** (wnętrze 3D: przy 4,2 odstęp 0,61, 4,3 – 0,55, 4,4 – 0,53, 4,6 – 0,39); orczyk: widełki pręta Y – Ramię Y (koniec Ramienia zwężony do 6) |
| `cP` | lico podstawy widełek pręta | 5,5 | 5,5 | ≥ 4,25 (krzyżak – podstawa przy β do 40°); dłuższe: `przeguby_akceptacja.py` |
| `pP` | grubość podstawy widełek pręta | 2,0 | 6,5 | orczyk ≥ 6,5 (pogłębienie łba M3 3,2 + łożysko 3,3) |
| `rS` | ½ szerokości widełek stałych = promień końca | **1,9** | 2,6 | gałka: jak `rP` (bez pogłębienia, łeb DIN 7985 na licu); orczyk: widełki orczyka X – rura |
| `cS`, `pS` | lico i grubość podstawy widełek stałych | 7,0; 2,0 | 8,25; 1,5 | orczyk: cS + pS ≤ 9,75 + 1,0 (podstawa X – tarcza ≥ 1,5 przy `katWidelekX` −12) |
| `lebH` / `lebHP` | wystawanie łbów a1 / a2 | 1,6 / 0 | 0 / 1,6 | gałka: łeb widełek pręta musi być w pogłębieniu (zapas do czaszy); łby widełek stałych Y – czasza 0,71 ≥ 0,3 |
| `L` | długość wkręta sworznia | 3,7 (a2), 4 (a1) | 5 | wejście = L − policzek − luzOs; końce a1/a2 nie mogą się zejść (Do/2 − wejście ≥ 1,0 i suma ≥ 2,3) |
| `otwGl` | głębokość otworów krążka | 1,825 (a2), 2,125 (a1) | 3,125 | = wejście + 0,25 |
| `podstawaD` | Ø podstawy walcowej widełek pręta | – | 8,0 | mieści pogłębienie Ø6 (ścianka 1,0) |
| `czopD` | Ø czopu obrotnicy | – | 4,4 | łeb M3 dk 5,5 opiera się na stopniu 0,55 |
| `katWidelekX` / `Y` | obrót osi widełek orczyka wokół a1 | – | −12° / 0° | X 0° → zakres γ −56,7…+32,5° i podstawa w tarczy |
| `a1X`, `a1Y` | oś sworznia widełek stałych przy gałce (układ gałki) | (0; −1; 0) | – | rozstrzyga `przeguby_3d.py` |
| `pretD`, `tulejaD` × `tulejaL` | pręt, tulejka obrotnicy | 4,5 | 7 × 6 | pręt Y – czasza G zapas 0,03 |

Ograniczenia obwiedni liczę jako „zapas pary − 0,5 przenosi się 1:1 na wymiar”; rozstrzyga `przeguby_akceptacja.py` (przemiatanie + wnętrze 3D + pary stała–stała). Architektura (U–R–U, położenie przegubów, serwa) zostaje w tych zakresach bez zmian.

**Wnętrze przegubu w 3D [R] (`przeguby_3d.py`, uwaga Astry pkt 4).** Dla każdego z 4 przegubów i każdego położenia gałki (siatka 1° + 360 położeń granicy okna) skrypt liczy rzeczywiste kąty (γ wokół a1, β wokół a2) i najmniejszy odstęp brył strony pręta (policzki z końcami, podstawa, trójkąty, walec Ø8, łby, tulejka, pręt) od brył strony stałej (policzki, podstawa, łby, przejście w Ramię) oraz krzyżaka od podstaw. Pary sworzniowe (krzyżak – własne policzki) mają luz osiowy `luzOs` i nie wchodzą. Zapas kąta to największe Δ, o które można jednocześnie powiększyć |γ| i |β| w 60 skrajnych położeniach przy odstępie ≥ 0,5:

| Przegub | γ (wokół a1) wymagane | β (wokół a2) wymagane | najmniejszy odstęp | gdzie (ψ; θ; γ; β) | para | zapas kąta |
|---|---|---|---|---|---|---|
| przy gałce X | −28,5…37,0° | −23,8…23,0° | **0,634** | (28,0; 18,0; 37,0; −23,4) | policzek pręta – policzek stały | 3,5° |
| przy gałce Y | −32,0…35,6° | −17,4…24,1° | **0,654** | (28,0; −18,0; 35,6; 24,1) | policzek pręta – policzek stały | 4,0° |
| przy orczyku X | −42,1…42,8° | −8,9…0,6° | **1,446** | (28,1; 14,6; 42,8; −8,9) | policzek pręta – policzek stały | 17,0° |
| przy orczyku Y | −40,8…25,1° | −12,0…3,9° | **1,452** | (28,0; −18,0; −40,8; −12,0) | policzek pręta – policzek stały | 14,0° |

Płaskie przekroje `u_zakres()` (v3.2 przed korektą: gałka 112° / 39,25°) zawyżały zapas, bo nie łączą obrotu wokół obu osi (Astra: 7,4° zamiast 15,6°). Przy dawnych wymiarach (rP 1,8, rS 2,6, a1 dobrane) przestrzenny odstęp policzków spadał do 0,31 mm. Po korekcie (rS 1,9 przy łbach DIN 7985 na widełkach stałych, a1 = −y) odstęp w całym zakresie wynosi ≥ 0,634 mm, a zapas kąta ≥ 3,5°.

**Oś a1 przy gałce = −y gałki** dla X i Y (propozycja wykonawcy, widełki na płaszczyznach Front/Right); oś widełek m to kierunek pręta w zerze rzutowany na płaszczyznę ⊥ a1. Kąty wymagane (`kinematyka.py`): przy gałce X γ −28,5…37,0°, β −23,8…23,0°; Y γ −32,0…35,6°, β −17,4…24,1°; przy orczyku X γ −42,1…42,8° (widełki obrócone o `katWidelekX` −12°, bez tego −56,7…+32,5° i podstawa w tarczy), β −8,9…0,6°; Y γ −40,8…25,1°, β −12,0…3,9°.

**Luz zwrotny [R] (`kinematyka.py`, uwaga Astry pkt 3).** Luz długości pręta: Δl = 8c + s + 2·`luzOs`·(sin β_gałka + sin β_orczyk) – 4 sworznie z luzem średnicowym 2c, obrotnica s = 0,1 i przesuw krzyżaka między policzkami rzutowany na pręt przy wychyleniu β. Kąt gałki z obu prętów naraz: [δψ, δθ] = |J_L⁻¹|·[Δl_X, Δl_Y], J_L = ∂(L_X, L_Y)/∂(ψ, θ) przy stałych kątach serw, najgorsze ułożenie luzów:

| c (promieniowo) | Δl pręta X / Y (najwięcej) | luz ψ / θ w pracy | luz ψ / θ w całym zakresie |
|---|---|---|---|
| 0,03 | 0,48 / 0,49 mm | **3,8° / 2,8°** | 5,7° / 3,7° |
| 0,05 | 0,64 / 0,65 mm | **5,1° / 3,9°** | 7,7° / 5,1° |
| 0,2 | 1,84 / 1,85 mm | **15,3° / 11,8°** | 22,3° / 15,0° |

**Decyzja orkiestratora (23.10, B9):** otwory sworzni drukowane podwymiarowo (Ø1,8) i rozwiercane ręcznie wiertłem Ø2,0 do luzu **c ≈ 0,03–0,05**. Przy c 0,2 z tabeli AGENTS luz zwrotny byłby kilkunastostopniowy (wiersz c = 0,2 wyżej). Wartość po P4 trafia do tabeli luzów. Luz zwrotny nie wynika z obrotu jałowego (tego nie ma), tylko z luzów sworzni; przy wyłączonym PWM gałka może się w nim przestawiać – PWM wyłączany tylko w spoczynku (pkt 7a), a P4 mierzy luz rzeczywisty.

**Wytrzymałość [R]** (siły w pręcie X / Y: zablokowane serwo 17,3 / 20,2 N w pracy, 20,9 / 26,4 N w całym zakresie; ręka 0,5 N·m na gałce w dowolnym kierunku 58,8 / 43,0 N w pracy, 79,7 / 55,7 N w całym zakresie; na sworzeń połowa, 40 N):
- docisk sworznia w krążku: 40 / (2,0 × 1,575) = **12,7 MPa** (gałka, a2), 40 / (2,0 × 1,875) = 10,7 MPa (gałka, a1), 40 / (2,0 × 2,875) = 7,0 MPa (orczyk); PLA ok. 60 MPa na ściskanie [Z];
- **wyrwanie sworznia z krążka** (Astra): nad otworem Ø2 w krążku Hr 4 zostaje po 1,0 mm do czół; ścinanie dwóch pasm 1,0 × wejście: 40 / (2 × 1,0 × 1,575) = **12,7 MPa** na ścinanie międzywarstwowe (PLA ok. 20–30 MPa [Z]) – to sprawdza P4;
- **zginanie sworznia** (wspornik od lica policzka, ramię = `luzOs` + ½ wejścia, rdzeń Ø1,57, W = 0,378 mm³): gałka a2 40·0,91 / 0,378 = **96 MPa**, gałka a1 40·1,06 / 0,378 = 112 MPa, orczyk 40·1,56 / 0,378 = **165 MPa**; stal 4.8 R_e 320 MPa, A2-70 450 MPa [Z] – zapas ≥ 1,9;
- **policzek widełek pręta przy gałce po pogłębieniu:** szerokość 2·rP = 4,6, pogłębienie Ø3,8 → ścianka 0,4 na stronę przy licu (uwaga orkiestratora: `rP` ≥ 2,3); ścinanie od sworznia do końca policzka: 2 × (rP − 0,8) × (2,0 − ½·1,1) = 2 × 1,5 × 1,45 = 4,35 mm² → 40 / 4,35 = **9,2 MPa**; gwint wkręta w policzku po pogłębieniu ok. 0,9 mm – trzyma wkręt osiowo (bez obciążenia osiowego);
- policzek widełek stałych przy gałce (rS 1,9, szer. 3,8, bez pogłębienia, łeb DIN 7985 Ø4 opiera się na licu): ścianka przy otworze Ø1,6 1,1; docisk 40 / (2 × 2) = 10 MPa;
- pręt Ø4,5 drukowany pionowo: długość wolna X 18,1, Y 20,7; wyboczenie P_kr = π²·3500·20,1/20,7² ≈ 1620 N wobec 80 N.

### 3.4 Ramiona X/Y i kinematyka [R] (`kinematyka.py`)

| Element | X (ψ) | Y (θ) |
|---|---|---|
| Środek krzyżaka przy gałce P (zero, układ gałki) | (21,25; 0; −6) | (0; 20; −6) |
| Serwo | S_X: wałek (y −13; z −49), oś ∥ x, orczyk w +x, płaszczyzna orczyka x 18,013 | S_Y: wałek (y 3; z −49), płaszczyzna x 10,229 |
| Ramię | r**14,7**, w zerze w +y, 6 mm (x 17,0…23,0), szer. 8 | r**15,4**, x 9,2…15,2 |
| Środek krzyżaka przy orczyku H w zerze (h 7 nad wierzchem Ramienia) | (30,01; 1,69; −48,71) | (21,83; 18,49; −46,67) |
| Długość pręta (środki krzyżaków) | **43,635** | **46,179** |
| Zakres serwa: praca / do okna | −29,5…+40,4° / −32,2…+47,4° | −21,0…+31,7° / −24,5…+40,2° |
| Kąt nacisku przy orczyku (praca / całość) | 46,0 / 54,8° | 55,9 / 64,7° |
| Moment na wale przy 0,5 N·m na gałce, dowolny kierunek (praca) | **0,706 N·m** (4,0 × 0,177) | 0,569 N·m (3,2×) |

- **Ramię X/Y:** płytka 6 mm od wałka do widełek orczyka, piasta Ø14 na wałku z kieszenią na jednoramienny orczyk fabryczny (skierowany przeciwnie do widełek), wkręt środkowy M2 w pogłębieniu, dwa M2 przez otwory orczyka (Ø1,6). Widełki orczyka (sworzeń a1 ≈ oś wałka) wyrastają z Ramienia na wysokości H; podstawa widełek w cS 8,25 od H po stronie przeciwnej do pręta, oś widełek X obrócona wokół a1 o −12° względem kierunku pręta w zerze. Druk na płasko.
- **IK (firmware, wzór zamknięty):** dla serwa k ∈ {X, Y}: q = P − C, K = (|w|² + |q|² − L²)/2, A = q_y w_y + q_z w_z, B = q_z w_y − q_y w_z, **α = atan2(B, A) − acos((K − q_x w_x)/√(A² + B²))** (gałąź „−”, α = 0 w zerze, obrót wokół +x według prawej dłoni, 0 = ramię w +y).

| | C (środek wierzchu Ramienia na osi wałka) | w = H0 − C | L |
|---|---|---|---|
| X | (23,013; −13,000; −49,000) | (6,994; 14,689; 0,286) | 43,635 |
| Y | (15,229; 3,000; −49,000) | (6,599; 15,487; 2,334) | 46,179 |

| (ψ; θ) | serwo X [°] | serwo Y [°] |
|---|---|---|
| (+25; 0) | −29,5 | +7,7 |
| (−25; 0) | +40,4 | −2,6 |
| (0; +15) | +1,1 | −18,4 |
| (0; −15) | +0,7 | +21,8 |
| (+25; +15) | −26,5 | −11,0 |
| (+25; −15) | −26,7 | +31,7 |
| (−25; +15) | +40,0 | −21,0 |
| (−25; −15) | +39,6 | +18,5 |

Kierunek µs ustala kalibracja (flaga znaku w NVS).

### 3.5 Uchwyt i poprawka kolizji ze Słupkiem (zlecenie pkt 1)

**Zmiana geometrii dla kolizji piasty M2 Y ze Słupkiem (zlecenie pkt 1) [R]:**
- **Było (v3.1):** kulka M2 Y w (0; 19,5; −6) z piastą Ø6 wzdłuż −y gałki na 5 mm do środka (koniec przy y_b 14,5). Przy θ > 12° piasta schodzi poniżej z −5,5 i wchodzi w tuleję Słupka (R5,65–7,65, z −12,75…−5,5): −0,80 mm w punkcie Astry przy (0; 15), −0,86 w przypadku kontrolnym.
- **Jest (v3.2):** piasty i kulki nie ma. Środek krzyżaka Y w **(0; 20; −6)** (`pktRY` 20, +0,5 na zewnątrz). Pręt trzymają **widełki stałe Uchwytu nad płytą okna**, wzdłuż m_Y (w stronę +z gałki, od pręta), policzki w y_b 15,0…17,0 i 23,0…25,0, od z_b ≈ −6 do +2; żadna bryła przegubu Y nie schodzi do środka bliżej niż y_b 15,0 w warstwie płyty, a pod płytę schodzą tylko widełki pręta, które obracają się z prętem na zewnątrz od okna.
- **Wynik:** bryły przegubu Y wobec Słupka (z tuleją) i kardana dolnego **≥ 1,50 mm** w całym zakresie (wartości ≥ 1,5 model podaje jako dolne ograniczenie z kul opisanych); najbliżej Słupka z całego Uchwytu są łapy pod nadlewy: 1,09 mm. **Słupek bez zmian** poza kieszenią Ø11,6 z CAD 23.10.
- Poprawka v3.1 w obrębie kulek (piasta skrócona do 2,8) przestała być potrzebna: zmiana przegubów usuwa piastę.

**Uchwyt (układ gałki) – wymiary dla CAD po korekcie:**
- **płyta okna** z_b −7,5…−4,5, R zewn. **26,6**, otwór = okno (pkt 4), wycięcia pod przeguby przy gałce po obwiedni krzyżaków i widełek prętów z luzem 0,6 (węzły i mostki w pkt 10), nad nadlewami kieszenie Ø7,6 od spodu na 1,1 (wierzch nadlewu −6,68 jest 0,82 nad spodem płyty);
- **żebro mostka X** z_b −4,5…−2,0 w sektorze ±17,5°, luz do obwiedni prętów 1,3; węzły zewnętrzne co 2,5° (pytanie wykonawcy d): −17,5°: R26,60; −15,0°: R26,60; −12,5°: R26,60; −10,0°: R15,14; −7,5°: R14,79; −5,0°: R14,62; −2,5°: R14,54; 0,0°: R14,54; 2,5°: R14,54; 5,0°: R14,62; 7,5°: R14,79; 10,0°: R15,14; 12,5°: R26,60; 15,0°: R26,60; 17,5°: R26,60; od środka żebro kończy się na splajnie okna;
- **widełki stałe X:** P (21,25; 0; −6), sworzeń a1 = −y, oś widełek m_X = (−0,201; 0; 0,980) (kierunek pręta w zerze rzutowany na płaszczyznę xz), policzki w płaszczyznach ⊥ y w |y| 3,0…5,0, szerokość 2·rS = 3,8, koniec R1,9 wokół a1, podstawa 2,0 w 7,0…9,0 wzdłuż m; łby DIN 7985 M2×4 na zewnątrz policzków (|y| 5,0…6,6);
- **widełki stałe Y:** P (0; 20; −6), a1 = −y, m_Y = (−0,473; 0; 0,881), policzki w y 15,0…17,0 i 23,0…25,0, łeb zewnętrzny do y 26,6 (do czaszy 0,71);
- **wsporniki widełek (pytania wykonawcy b, c):** płaskie, 4 × 4, **nachylone 46° do poziomu**, więc drukują się płytą w dół bez podpór, i poprowadzone nad drogą widełek pręta:
  - X: w płaszczyźnie y = 0 od środka podstawy widełek (19,64; 0; 1,84) do ściany tulei przedniej (7,65; 0; 14,26);
  - Y: w płaszczyźnie x = −3,78 od (−3,78; 20,00; 1,05) do ściany tulei (−3,78; 6,65; 14,87);
  - dawny wspornik X do (8,6; 9,0) miał 33° (nawis 57°), a wspornik pionowy z płyty musiałby stać w wycięciu płyty pod widełkami pręta X; płaski 46° omija oba problemy;
- **łączniki** do tulei przedniej: 3 pręty Ø4 na φ 135°, 225°, 315° od (r 15,5; z_b −4,5) do (r 9,2; z_b +7,0);
- **tuleja przednia** Ø11,6/Ø15,3, z_b +7,0…+12,75, **zamknięta nad kardanem do z_b 19,75** (pytanie wykonawcy e): DIN 7991 M5 + nakrętka, przelot Ø4,2 w ±y na wkręt M4 piasty kardana; do czaszy Gałki 6,82 [R];
- **łapy pod nadlewy Gałki (pytanie wykonawcy a)** – osobne części × 2, kształt L, druk na boku:
  - płytka R20–25 × 2,0 pod czołem nadlewu (z_b −14,68…−12,68), od −3,5 do +8,8 stycznie;
  - żeberko **5 × 5** (stycznie × promieniowo) obok nadlewu, po stronie φ 270°, od spodu płyty (−7,5) do spodu łapy (−14,68);
  - do Gałki: **DIN 7991 M3×6 od tyłu** przez płytkę 2,0 (pogłębienie 90° Ø6,3 na 1,7, łeb k 1,65 chowa się 0,05 pod licem) w otwór Ø2,6 nadlewu: wejście 4,0, do dna (głębokość 5,4) zostaje **1,4** (uwaga Astry pkt 2: M3×8 wystawałby 6,0 > 5,4);
  - do płyty: **DIN 7991 M3×8 od wierzchu płyty** (pogłębienie 90° Ø6,3 na 1,7 w płycie 3,0) w otwór Ø2,6 żeberka: wejście 5,0, otwór 6,6, dno 0,6 nad spodem łapy;
  - łeb na wierzchu płyty przy φ 210°/330°, R ≈ 22 jest równo z licem, więc nie zmienia obwiedni; w przemiataniu łapy mają najmniej 0,655 (D wypust zaczepu – łapa).

Wszystkie te bryły są w przemiataniu. Uchwyt wobec czaszy Gałki (sztywno skręcone) sprawdza `stale_pary.py`: płyta okna 0,36, łeb i nakrętka sworznia przy gałce Y 0,71, widełki przy gałce Y 2,00, łeb i nakrętka sworznia przy gałce X 3,03, widełki przy gałce X 3,50, wspornik widełek Y 5,66, wspornik widełek X 6,58, piasta przednia Uchwytu 6,82, łącznik Uchwytu 225 9,86, łącznik Uchwytu 315 9,86, łącznik Uchwytu 135 9,86, kardan górny 14,11; łapy dociśnięte do czoła nadlewu (styk montażowy).

### 3.6 Wycięcia gałki i powieki górnej

- **Gałka:** φ 0° ±30° od **98°** (widełki pręta X), φ 80° ±40° od 102° (pręt Y), pełna głębokość w pasie; tył płaski z_b −12,68. Wycięcia leżą za równikiem kuli. Przy ψ −25° krawędź wycięcia X widać na 73° od osi patrzenia (w v3.1: 79°), ok. 1,3 mm w głąb od sylwetki – kosmetyka, do oceny na P6.
- **Powieka górna:** w pasie x **−14…+24** tylna krawędź **82,5°** za przednią; w pasie x −31…−17 do 96,5°. Powieka dolna: x −31…−17 do 76°.
- **Przycięcie przy uszach** (pkt 10, C2): czasza G wokół ucha D; kołnierz Ramy bez zmian (mostek G 56–95°, ucho G R5,5).

## 4. Ogranicznik gałki: okno

Bez zmian geometrii względem v3.1 (`okno.json`, `okno_splajn.npy`). Okno nie zależy od przegubów. Dolną połówkę kardana model liczy teraz do z +4,0 zamiast +5,5, ale płyta okna przy największym pochyleniu sięga najwyżej z ≈ +0,6, więc okno wychodzi takie samo.

**Rachunek [R] (`okno.py`):**
- bryły nieruchome: Słupek R7,65 (z −33…−5,5, ostra krawędź czoła), kardan dolny R5,5;
- płyta okna w układzie gałki z_b −7,5…−4,5;
- przekrój bryły przez całą grubość płyty: przecięcia powierzchni bocznej z obiema płaszczyznami płyty i okręgi den walca, co 0,125° obwodu;
- okno wymagane = największy promień przekrojów na każdym z 1440 kierunków φ, z 736 położeń na granicy ±28/±18 (co 0,25°) i 551 wewnątrz (co 2°);
- tabela do CAD co 5°, wartość w węźle w górę do 0,01; okresowy splajn sześcienny o jednostajnym parametrze przez 72 węzły.

**Okno r(φ) [mm], φ od +x gałki ku +y, symetryczne względem osi x i y gałki** (zmienne `okno_r0`…`okno_r90`):

| φ | 0 | 5 | 10 | 15 | 20 | 25 | 30 | 35 | 40 | 45 |
|---|---|---|---|---|---|---|---|---|---|---|
| r | 12,66 | 12,71 | 12,86 | 13,12 | 13,47 | 13,75 | 13,92 | 13,97 | 13,90 | 13,72 |

| φ | 50 | 55 | 60 | 65 | 70 | 75 | 80 | 85 | 90 |
|---|---|---|---|---|---|---|---|---|---|
| r | 13,42 | 13,04 | 12,58 | 12,07 | 11,53 | 11,06 | 10,74 | 10,55 | 10,49 |

- **Zapas w pracy:** **0,5605 mm** przy (0; −15) (Astra potwierdziła 0,560518).
- **Granica mechaniczna** (bisekcja po 72 kierunkach): na osiach ψ 28,03°, θ 18,05°; **największe wartości poza osiami** ψ 28,083° przy θ 15,148° i θ 18,183° przy ψ 23,733° (Astra, drobne). W Assembly: ψ 28,0–28,3°, θ 18,0–18,3°.
- **Pas styku na Słupku:** ψ: z −13,71…−12,55; θ: z −11,33…−10,36. Do krawędzi otworu M4 (z −11,2…−7,0 na ±x) zostaje **1,37 mm**.
- **Siła na krawędzi okna** przy 0,5 N·m: ok. 42 N.
- **Jedna geometria od rachunku do CAD (Astra pkt 5):** przemiatanie bierze teraz co 20. punkt splajnu (720 wierzchołków zamiast 180). Profil CAD (spline przez 72 punkty) trzeba sprawdzić względem splajnu z `okno_splajn.npy` na siatce z CAD; tolerancja ±0,01 mm mieści się w zapasie 0,56 − 0,5. To część końcowej kontroli na siatkach.

## 5. Powieki

**Źródła [F]:** Cogley Simplified ([Make](https://makezine.com/projects/simple-animatronic-eyes/)) – powieki na osi pochylenia, osobne serwa; [EyeMech ε3.2](https://github.com/will-cogley/EyeMech_Epsilon). Łącznik z drutu sprężynowego z zagięciami Z to adaptacja [A]; dowodem będzie P3.

**Kąty:** t = obrót powieki od położenia odniesienia (G: krawędź przednia −9°, D: −11°); krawędź przednia G = −9° + t, D = −11° − t. G: t od −0,25 (ogranicznik zamknięcia) do 56,75 (ogranicznik otwarcia), praca 0,5…56,0; D: t od −0,25 do 32,75, praca 0,5…32,0.

| | Powieka górna (G) | Powieka dolna (D) |
|---|---|---|
| Czasza | R31,2–33,4, rant R34,7 w pasie 6,5° przy krawędzi przedniej, zakres 99,5°, przycięta do \|x\| ≤ 30,95 | jak G, zakres 79° |
| Ucha i mostek (CAD) | ucho R5,5 (`uchoGR`), x ±(33,85…36,25); mostek R4,5–8 od x 30,95 do 36,25, 56–95° za krawędzią przednią (`mostekKat1/2`) | ucho R4, x ±(30,95…33,6) |
| Wycięcia tylnej krawędzi | x −14…+24: 82,5°; x −31…−17: 96,5° | x −31…−17: 76° |
| Zaczep J (t = 0) | (−22,0; +25,6; −0,9), płytka 2,4 z otworem Ø1,6 | (−22,0; −25,6; −0,9) |
| Serwo | S_PG: wałek (y 18; z −60), odwrócone, orczyk w −x, płaszczyzna x −30 | S_PD: wałek (y −27; z −49), orczyk w −x, płaszczyzna x −21 |
| Ramię serwa | drukowane r20, 3 × 6, koniec R3, piasta Ø9 | drukowane r17,5, 2 × 5, koniec R2,5, na orczyku fabrycznym |
| Łącznik (yz, między osiami zagięć) | 49,95 | 41,69 |
| Kąt ramienia b przy t −0,25 / 56,75 (G), −0,25 / 32,75 (D) | 134,69 / 210,89° | 30,36 / −19,87° |
| Moment na wale przy 20 N na krawędzi (R33,4) | 0,546 N·m (3,1×) | 0,470 N·m (2,7×) |

### 5.1 Drut sprężynowy Ø1,2

Bez zmian względem v3.1: zagięcia Z z promieniem osi 1,8, nogi 1,9 od ścianek, wykorbienie G 1,5 mm na 40 % od J, D 1,2 mm na 15 %; otwory Ø1,6 (drukowane 1,5, przewiercone); wpięcie po złożeniu przez odgięcie całego drutu o 3,6 mm (σ ≈ 520 MPa G, 750 MPa D wobec ok. 1500 MPa [Z]); przyrząd do gięcia z rowkiem R0,6 i kołkami Ø2,4.

### 5.2 Słupki stopu powiek (pomiar wykonawcy CAD, przeliczone)

**Co zgłosił wykonawca CAD (`e6model.stop_posts` v3.1):** słupek D otwarcia wchodził w korpus S_X (od x −15,99, od y −19,65), D zamknięcia ocierał narożnik S_X, a do wieżyczek R6 zostawało 0,26 (G) i 0,04 mm (D) przy wymaganiu ≥ 0,5. Przemiatanie v3.1 nie liczyło par stała–stała.

**Co zmieniłem:**
- **styk liczony na bok ramienia:** środek słupka = oś wałka + ρ·e(b_ogr) + (½ szer. ramienia + 3)·n, gdzie e to kierunek ramienia przy kącie ogranicznika, n normalna po stronie ruchu do ogranicznika. Bok ramienia dotyka słupka dokładnie przy kącie ogranicznika (styk zamierzony); słupek jest obrócony razem z kierunkiem ramienia;
- **słupki D tylko w x −22,5…−16,6** (wykonawca: −22,5…−16,49), czyli poza korpusem S_X (x od −15,99) i z luzem 0,6 do niego;
- **ρ:** G 10, D zamknięcia 14 (dalej od wałka, żeby ominąć wieżyczkę S_PD), D otwarcia 10;
- **podparcia:** G – oba słupki wyrastają ze ściany klatki S_PG przedłużonej do wierzchu korpusu (płytka 2 mm); D zamknięcia – **łącznik** 4 mm grubości w płaszczyźnie ramion wspornika Słupka (z −37…−33) do ramienia 200°, bo filar z tarczy przechodziłby przez wieżę S_PD; D otwarcia – **filar** z tarczy (z −68,3) do spodu słupka;
- **pary stała–stała** liczy `stale_pary.py`: słupki, podparcia, korpusy, uszy, łby śrub uszu, wieżyczki, kable, piasta i ramiona wspornika, słupki Płyty, ucha Ramy.

**Tabela słupków do CAD** (słupek 6 × 6 w przekroju yz, obrócony o kąt b ramienia przy ograniczniku; b mierzony w yz od +y ku +z):

| Słupek | wyrasta z / podparcie | najmniejszy przekrój połączenia | kąt b ramienia | środek (x; y; z) | x | y | z (obwiednia) |
|---|---|---|---|---|---|---|---|
| G zamknięcia (ρ 10) | **płytka 2 mm** przy czole klatki S_PG: x −20,8…−18,8, y 10,4…19,48, z −52,91…−40,70, łączy słupek z krawędziami ścianek klatki (y 10,4…11,35 i z −42,7…−40,7) | słupek–płytka 6 × 8,5 (cały przekrój słupka w x −20,8…−18,8); płytka–klatka ok. 0,95 × 12,2 + 2,0 × 9,1 ≈ 30 mm² | 134,69° | (−25,40; 15,23; −48,67) | −32,00…−18,80 | 10,99…19,48 | −52,91…−44,43 |
| G otwarcia (ρ 10) | **przechodzi przez tarczę** (z −71,3…−68,3) obok okna G | przekrój słupka w materiale tarczy: 33,6 mm² na licu −68,3, 52,6 w połowie grubości | 210,89° | (−25,40; 12,50; −70,28) | −32,00…−18,80 | 8,38…16,61 | −74,40…−66,17 |
| D zamknięcia (ρ 14) | **łącznik** 5,9 × 4 do ramienia wspornika 200° (z −37…−33): x −22,5…−16,6, y −19,20…−5,62, z −37,09…−33,09 | 5,9 × 4 = 23,6 mm² | 30,36° | (−19,55; −17,70; −37,18) | −22,50…−16,60 | −21,80…−13,59 | −41,28…−33,07 |
| D otwarcia (ρ 10) | **filar** 5,9 × 6 z tarczy (z −68,3) **wchodzący w słupek do jego środka** (z −57,57): y −22,46…−16,46 | **5,9 × 6 = 35,4 mm²** (cały przekrój filara leży w słupku; v3.2 przed korektą: styk linią, 0 mm² – Astra pkt 1) | −19,87° | (−19,55; −19,46; −57,57) | −22,50…−16,60 | −23,31…−15,62 | −61,41…−53,73 |

Przekrój słupka 6 × 6 (`slupekStopuA`), osie przekroju: wzdłuż ramienia (cos b; sin b) i prostopadle w stronę ruchu do ogranicznika. G otwarcia sięga z −74,40, czyli 3,1 za tył tarczy (−71,3), i wyznacza tył modułu (B5). Podparcia są w modelu (`stop_posts()`, gałąź `klatka` z płytką) i w parach stała–stała.

**Pary stała–stała [R]** (10 najmniejszych, wymaganie ≥ 0,5):

| # | Para | mm |
|---|---|---|
| 1 | S_X korpus – słupek stopu D otwarcia | **0,556** |
| 2 | S_X korpus – filar słupka D otwarcia | 0,557 |
| 3 | S_X korpus – S_PD korpus | 0,643 |
| 4 | S_X korpus – S_PD ucho | 0,643 |
| 5 | S_X ucho – S_PD korpus | 0,643 |
| 6 | S_PG łeb śruby ucha – płytka słupka G zamknięcia | 0,644 |
| 7 | S_PG łeb śruby ucha – słupek stopu G otwarcia | 0,663 |
| 8 | S_X kabel – S_Y korpus | 0,693 |
| 9 | S_X korpus – S_Y kabel | 0,693 |
| 10 | S_Y korpus – płytka słupka G zamknięcia | 0,693 |

Wieżyczki R6 do słupków: ≥ 1,3 (wykonawca v3.1: 0,26 i 0,04). Klatki sąsiednich serw mają wspólne ścianki, kable mogą leżeć obok siebie w kanale – tych par nie liczę; podparcia z własnym słupkiem i klatką są jedną bryłą.

- **Zapas w pracy:** ramię–słupek 0,057–0,148 mm (0,75° powieki = 0,9–1,1° serwa ≈ 10–12 µs; styk zamierzony). Zamknięcie programowe ustawia kalibracja: dojazd do słupka, cofnięcie o 1,0° serwa.
- **Wytrzymałość:** przy 0,546 N·m na ramieniu G i styku na r ≈ 10 siła wynosi ok. 55 N; słupek G 6 × 6 wysięgu 13 mm od płytki: σ = 55·13/36 ≈ **20 MPa**. Filar D otwarcia 5,9 × 6 przy 0,470 N·m / 10 mm = 47 N i ramieniu 10 (od tarczy do środka słupka): σ = 47·10·6/(5,9·6²) ≈ **13 MPa**. Łącznik D zamknięcia 4 × 5,9 przy 34 N i ramieniu 13: σ ≈ 34·13·6/(5,9·4²) ≈ 28 MPa – na granicy dla PLA w zginaniu długotrwałym [Z]; przy T1 obserwować, w razie potrzeby łącznik 5 mm.

### 5.3 Szczelina zamknięcia, kąciki, ucha

- **Szczelina krawędzi przednich na ogranicznikach:** 3° − 2·0,75° = 1,5° (0,82 mm na R31,2). Przycięcie kącików δ(x) = max(0; (0,6/ρ(x) − 0,02618)/2) rad, ρ(x) = √(31,2² − x²). Najmniejsza szczelina 0,60 mm (x 30,9), po luzie osi 0,4 zostaje 0,20 [R].
- **Kołnierz przodu R35,2 (od z 6) – rant powieki R34,7:** **1,008 mm** (najmniejsza odległość przestrzenna do sfery R34,7: √(35,2² + 6²) − 34,7; Astra, drobne).
- **Osie powiek** (DIN 7991 M3×8 w gnieździe stożkowym boku Ramy): stos bok 3,25 + 0,25 + ucho G 2,4 + 0,25 + ucho D 2,4.
- **Pary obrotowe** (ucho na osi, wymaganie 0,2): ucho G – bok osi Ramy, ucho G – ucho D, mostek G – bok osi Ramy, **ucho D – mostek G** (współosiowe; dopisane w v3.2).

## 6. Rozruch, NVS i skoki

Bez zmian względem v3.1:
- rekord {ψ, θ, t_G, t_D, numer, CRC16} w dwóch przemiennych slotach NVS, zapis po ruchu (≥ 2 s), kąty zamiast µs;
- start: impulsy z IK zapisanego rekordu, rampa w (ψ, θ) krok 20 ms, powieki rampą w t;
- przy rekordzie niezgodnym z położeniem gałka fizycznie nie wyjdzie poza okno, a powieki poza słupki stopu. Przemiatanie obejmuje każdy stan w tym zbiorze (każda kombinacja niezależnie), więc niezależnie od postępu serw mechanizm dotyka tylko w stykach zamierzonych. Warunkiem jest wynik pkt 10 (wszystkie pary niezamierzone ≥ 0,5).
- Podążanie powiek: G otwG + 0,33·θ dla θ > 0, D otwD − 0,33·|θ| dla θ < 0.

## 7. Ochrona przekładni MG90S

| Napęd | M_k [N·m] (praca, 0,5 N·m na gałce z dowolnego kierunku albo 20 N na krawędzi powieki) | × zablokowania 0,177 |
|---|---|---|
| X | 0,706 | 4,0 |
| Y | 0,569 | 3,2 |
| G | 0,546 | 3,1 |
| D | 0,470 | 2,7 |

Reszta bez zmian względem v3.1: (a) PWM tylko w ruchu + 0,3 s; (b) T1 osobno dla każdego napędu (stopnie 0,18…0,80 N·m, decyzja M_bezp ≥ M_k / sprzęgło / brak przedziału przy M_bezp < 0,23); (c) plan B – sprzęgło cierne na wkręcie środkowym M2.
- **Sprzęgło dla powiek (Astra v3.1 pkt 9):** pogłębienie Ø12,5 nie mieści się w piaście Ø9 ramion PG/PD. Wariant dla powiek: piasta ramienia Ø14 w zakresie z sprzęgła (dysk Ø12 × 1). Przed użyciem trzeba sprawdzić piastę Ø14 w przemiataniu: ramię G – rura ma dziś 0,650, więc piasta Ø14 jest możliwa tylko po stronie wnętrza. Zostaje jako zadanie po T1, jeśli T1 wskaże powieki.
- `przeguby_akceptacja.py` przelicza momenty X/Y przy każdej zmianie wymiarów przegubów (kinematyka w wyniku).

## 8. Montaż

**(S)** = krok syna, bez narzędzi; (O) = ojciec.

**Stół A – Rama z powiekami:**
1. (O) Powieki od tyłu w Ramę (dolna, potem górna), DIN 7991 M3×8.
2. (O) Druty gięte na przyrządzie. **(S)** wkręca zagięcie Z w otwór zaczepu J.
3. **(S)** przykleja zamknięte powieki taśmą do rantu, druty taśmą do rury.

**Stół B – Płyta z gałką:**
4. (O) Serwa w klatki: **M2×10 przez wycięcia uszu, nakrętki M2 w kieszeniach bloków**. **(S)** podaje śruby i układa kable w kanale (kanał przyjmuje kabel z dowolnej krótszej ściany).
5. (O) Słupek na piastę wspornika (DIN 7991 M5×30 od spodu, nakrętka w kieszeni), kardan na trzpień, M4 przez otwór na ±x.
6. (O) Uchwyt na przednią piastę kardana, M5×12, M4.
7. (O) Przeguby krzyżowe: otwory krążków rozwiercić Ø2,0; krzyżak w widełki, wkręty M2 w policzki do oporu łba (długości z tabeli pkt 3.3: przy gałce M2×4 – a2 skrócone do 3,7; przy orczyku M2×5); sprawdzić ręką ruch bez zacięć przy jednoczesnym wychyleniu obu osi. Obrotnica: M3×12 przez podstawę widełek pręta w tulejkę pręta, do oporu łba na czopie Ø4,4.
8. (O) Ramiona X/Y na orczyki i wielowypusty w zerze (program `kalibracja`, 1500 µs, przyrząd zera), najpierw Y, potem X; widełki orczyka z krzyżakiem pręta, DIN 7991 M2×5.
9. (O) Łapy do płyty Uchwytu: DIN 7991 M3×8 od wierzchu płyty w żeberka. **(S)** nakłada Gałkę na Uchwyt. (O) 2 × DIN 7991 M3×6 od tyłu przez łapy w nadlewy.
10. (O) Ramiona PG/PD na wielowypusty w położeniu „zamknięte”, bok ramienia przy słupku stopu.

**Złożenie:**
11. **(S)** z ojcem wsuwa Płytę z gałką od tyłu w Ramę, aż stożkowe końce słupków Płyty usiądą w fazkach uch Ramy.
12. (O) 3 × M3×45 od tyłu tarczy przez słupki w gwint uch Ramy (Ø2,5 × 6 na R33).
13. (O) Dopina druty w ramiona serw (od boku między z −37 a tarczą, albo przez okna tarczy).
14. **(S)** w telefonie przesuwa suwaki. (O) zapisuje µs i zamknięcie powiek względem słupków stopu.
15. Test 24 h na stole.

**W dyni:** otwór Ø80, **(S)** wsuwa moduł do oparcia rantu, (O) obejma M3×25 wkrętakiem, **(S)** wpina wtyczki.

Przyrząd długości prętów nie jest potrzebny: długość pręta jest stała z druku (43,611 / 46,179 między środkami krzyżaków); zero ustawia kalibracja µs.

## 9. Mocowanie w dyni i Rama

- **Rama:**
  - rant Ø84 (2 mm poza otwór, spód po R150, 8 ząbków), czoło rantu po sferze R152 (`dyniaR` 150 + `rantT` 2);
  - rura Ø79,5/75,5 od rantu do z −37, kołnierz przodu R35,2 od z 6 (`kolnierzZ` 6) **z wycięciem przy osiach powiek** (pkt 10, ustalenia CAD);
  - boki osi powiek R5, x ±(36,5…38,5), z gniazdami stożkowymi;
  - **3 ucha wewnętrzne na 100°/200°/310°:** R4 (pół-szerokość), środek R34,5, z −33…−27, gwint M3 Ø2,5 × 6 na R33, pod uchem fazka 3 × 45°; słupki Płyty R33 Ø6 zakończone stożkiem 45°, który centruje się w fazce;
  - druk tyłem w dół, rant z fazką 45°.
- **Obejma:** PETG, kształt C z uchem, M3×25 z nakrętką samohamującą w kieszeni, siedzi na rurze w pasie z −5…−35; dokręcenie powtórzyć po 24 h.
- **Obciążenia [R]:** masa ok. 220 g, środek ciężkości ok. z −29, pchnięcie gałki z boku 20 N na 35 mm daje 0,7 N·m. **P5** bez zmian (wycinek dyni 15 i 35 mm).

## 10. Model kontrolny i przemiatanie

**Zmiany w modelu v3.2** (`e6model.py`, `przemiatanie.py`):
- **typ `ann` (tuleje)** we wszystkich listach par: tuleja Słupka (R5,65–7,65, z −12,75…−5,5), tuleja przednia Uchwytu. Typy próbkowane: `cap`, `cyl`, `obb`, `ann`, `cwedge` (klin walcowy: mostek G);
- **przypadki kontrolne** (`kontrola()`, błąd = przerwanie biegu): (1) punkt Astry (0,007714; 6,846927; −11,152104) wobec tulei Słupka: **−0,803069** (zgodnie z Astrą); (2) tuleja jest na liście par; (3) geometria v3.1 (kulki RC, `pktR` 19,5, piasta M2 Y 5 mm) przy (0; 15): piasta M2 Y – Słupek **−0,859**, czyli model wykrywa kolizję, którą v3.1 pominęła; (4) `prism_d` dla (−20; 0; −2) nad płytą z −7,5…−4,5: **2,5**;
- **`prism_d()`:** dokładna odległość do graniastosłupa z otworem (wnętrze konturu: test gwiazdy na wielokącie, krawędzie w oknie kątowym, a przy braku trafienia pełna lista krawędzi); poprawny znak nad i pod płytą;
- **bryły z CAD:** mostek G (klin walcowy R4,5–8 wokół osi x, x ±(30,95…36,25), **56–95°** za krawędzią przednią – `mostekKat1/2` z CAD, obraca się z powieką), ucho G **R5,5** (`uchoGR`, x ±(33,85…36,25)), ucho D R4 (x ±(30,95…33,6)), boki osi Ramy R5 (x ±(36,5…38,5)), czasze przycięte do |x| ≤ 30,95; Gałka z płaskim tyłem z_b −12,68 i nadlewami; Uchwyt: płyta, żebro, widełki stałe, wsporniki, łączniki, tuleja przednia, łapy pod nadlewy – wszystko w parach z powiekami i bryłami stałymi; ucha Ramy R4 na R34,5; kieszeń Słupka Ø11,6;
- **przeguby krzyżowe** jako bryły: krzyżak (kula opisana na krążku), widełki pręta i widełki stałe (prostopadłościan policzków z podstawą + walec końca policzków wzdłuż osi sworznia), łby sworzni, pręt Ø4,5, tulejka obrotnicy;
- **kable** jako pełny prostokąt 3,6 × 1,2 (prostopadłościan wzdłuż trasy) po obu trasach wyjścia (tył i przód korpusu), bo kanał przyjmuje kabel z dowolnej krótszej ściany;
- **wycięcia z ustaleń CAD** jako różnica brył: odległość max(d_A, −d_B), czyli dolne ograniczenie odległości do A∖B.

**Wykluczone z definicji:**
- wnętrze każdego przegubu krzyżowego (krzyżak, policzki, łby wobec siebie); jego granicą jest zakres kątowy `u_zakres()` (pkt 3.3), sprawdzany przez `przeguby_akceptacja.py`;
- pręt z widełkami przy gałce i tulejką to jedna część; widełki stałe, wspornik i płyta to jedna część (Uchwyt);
- Ramię i ramię serwa na wieżyczce własnego serwa; wnętrze kardana 5/5.

Widełki pręta wobec wspornika widełek i płyty okna (ruchome wobec Uchwytu) są w parach.

**Styki zamierzone:** okno–Słupek (`okno.py`), bok ramienia powieki – słupek stopu. **Pary obrotowe** (wymaganie 0,2): ucho G – bok osi, ucho G – ucho D, mostek G – bok osi, ucho D – mostek G.

**Zakresy i krok ruchu:**
- gałka: siatka 1° wewnątrz granicy okna + 360 położeń na granicy; powieki co 1° od ogranicznika do ogranicznika; wszystkie kombinacje gałka × G × D;
- **zagęszczenie** przy 30 najciaśniejszych parach: ±1° co 0,25°, potem ±0,25° co **0,05°** (gałka i powieki). Na R30 krok 0,05° to **0,026 mm** między próbkami, czyli spełnia warunek ≤ 0,05 mm przy minimach (zlecenie pkt 5);
- próbki brył: 0,08 mm na osi kapsuł, powierzchnie walców i prostopadłościanów z promieniem pokrycia ≤ 0,06, odejmowanym od wyniku.

**Wynik pełnego przemiatania (`przemiatanie.json`, skrót e549b91f9f229d26):**

**10 najciaśniejszych par, zakres pracy** (gałka ±25/±15, powieki między położeniami programowymi; bez styków zamierzonych i par obrotowych):

| # | Para | mm | Gdzie |
|---|---|---|---|
| 1 | G ucho – rura | **0,479** | G t 0,50 |
| 2 | G mostek ucha – rura | 0,535 | G t 0,50 |
| 3 | D ucho – czasza górnej | 0,543 | G t 9,75, D t 0,50 |
| 4 | G drut – gałka R30 (dowolne położenie) | 0,617 | G t 0,50 |
| 5 | D drut – ramię wspornika 200 | 0,648 | D t 5,35 |
| 6 | X widełki pręta przy gałce – żebro mostka X | 0,650 | (−24,00; −1,25) |
| 7 | G ramię serwa – rura | 0,650 | G t 2,90 |
| 8 | Y Ramię – Y widełki pręta | 0,650 | (24,05; −14,75) |
| 9 | D wypust zaczepu – łapa Uchwytu 210 | 0,655 | (14,00; −4,55), D t 27,75 |
| 10 | Y widełki pręta przy gałce – płyta okna | 0,734 | (24,75; −15,00) |

**10 najciaśniejszych par, cały zakres** (gałka do granicy okna, powieki do ograniczników):

| # | Para | mm | Gdzie |
|---|---|---|---|
| 1 | Y Ramię – Y widełki pręta | **0,147** | (28,03; −18,02) |
| 2 | G ucho – rura | 0,479 | G t −0,25 |
| 3 | G mostek ucha – rura | 0,496 | G t −0,25 |
| 4 | D ramię serwa – łącznik słupka D zamknięcia | 0,510 | D t −0,25 |
| 5 | Y widełki pręta przy gałce – płyta okna | 0,517 | (28,03; −18,02) |
| 6 | Y pręt Ø4,5 – czasza górnej | 0,529 | (−28,05; −9,09), G t 56,75 |
| 7 | X widełki pręta przy gałce – żebro mostka X | 0,535 | (−28,03; −18,02) |
| 8 | D ucho – czasza górnej | 0,543 | G t 9,75, D t −0,25 |
| 9 | kardan dolny – piasta przednia Uchwytu | 0,597 | (28,03; −18,02) |
| 10 | G drut – gałka R30 (dowolne położenie) | 0,605 | G t −0,25 |

**Styki zamierzone i pary obrotowe:**

| Para | w pracy | cały zakres |
|---|---|---|
| G ramię serwa – słupek stopu G zamknięcia (styk zamierzony) | 0,057 | −0,057 |
| G ramię serwa – słupek stopu G otwarcia (styk zamierzony) | 0,063 | −0,057 |
| D ramię serwa – słupek stopu D otwarcia (styk zamierzony) | 0,095 | −0,057 |
| D ramię serwa – słupek stopu D zamknięcia (styk zamierzony) | 0,148 | −0,057 |
| G mostek ucha – bok osi Ramy (para obrotowa, wym. 0,2) | 0,250 | 0,250 |
| G ucho – bok osi Ramy (para obrotowa, wym. 0,2) | 0,250 | 0,250 |
| D ucho (para obrotowa, wym. 0,2) – G ucho | 0,250 | 0,250 |
| D ucho (para obrotowa, wym. 0,2) – G mostek ucha | 0,500 | 0,500 |

- Pary obrotowe na osi powiek i pary ucho/mostek G – rura liczę dokładnie jako pierścienie współosiowe z osią x (`rot_exact`, `tube_x_exact`, bez wycinka kątowego – ostrożnie), a nie z próbek: luz osiowy stosu 0,25 ≥ 0,2, ucho D – mostek G 0,5 promieniowo (Astra pkt 6: dawne 0,190–0,193 były promieniem pokrycia próbek). Ucho G – rura: **0,500** dokładnie (6 − 5,50, zgodnie z pomiarem CAD), czyli na progu; przy `uchoGR` 5,4 byłoby 0,6.
- Przypadki graniczne 0,40…0,50 przemiatanie dopróbkowuje krokiem 0,03 (promień pokrycia ok. 0,02).
- Ramię–słupek stopu na ograniczniku: 0 (w wyniku −0,057 = promień pokrycia).

**Analitycznie:** okno–Słupek 0,5605 w pracy; szczelina krawędzi przednich powiek ≥ 0,60 (po luzie osi 0,20); kołnierz–rant powieki 1,008; gałka–powieki 1,20 (współśrodkowe).

**Mostki płyty okna** (φ: r zewn. / szerokość mostka) −15°: 15,07 / 1,95; −10°: 14,89 / 2,03; −5°: 14,82 / 2,11; 0°: 14,82 / 2,16; 5°: 14,82 / 2,11; 10°: 14,88 / 2,02; 15°: 15,06 / 1,94; 55°: 15,45 / 2,41; 60°: 15,29 / 2,71; 65°: 15,26 / 3,19; 70°: 15,26 / 3,73; 75°: 15,28 / 4,22; 80°: 15,42 / 4,68; 85°: 15,64 / 5,09; 90°: 15,89 / 5,40; 95°: 15,89 / 5,34; 100°: 16,22 / 5,48; 105°: 16,40 / 5,34; 110°: 16,76 / 5,23. Najwęższy mostek ma żebro z_b −4,5…−2,0 (luz do obwiedni prętów 1,3 w warstwie żebra). Naprężenie przy 42 N na mostku 7 mm z utwierdzonymi końcami: M = 42·7/8 = 37 N·mm, W = 3·1,94²/6 + 2,5·b_ż²/6, σ ≤ 11 (żebro ≥ 1,88 szer., W = 3,4 mm³) MPa.

**Ustalenia dla CAD (z przemiatania; zmiany istniejących części):**

| # | Część | Problem bez zmiany [R] | Zmiana | Wynik po zmianie [R] |
|---|---|---|---|---|
| C2 | **Powieka górna: czasza przy uchu D** | ucho D – czasza G **0** (czasza R31,2 przy x 30,95 ma ρ_x 3,94 < 4) | wycięcie czaszy G walcem **R4,6 o osi x** dla \|x\| ≥ 30,35 | ucho D – czasza G 0,543 |
| C3 | **Gałka: wycięcie X** (zmienne CAD) | widełki pręta X przy gałce – czasza gałki 0 przy `rimX` 100 | `rimX` 104 → **98**, `rimXSzer` 25 → **30** | widełki pręta X – czasza gałki 0,618 (praca 0,891) |
| C4 | **Gałka: wycięcie Y** | (wariant z kardanem; utrzymane) | `rimY` 106 → **102**, `rimYSzer` 35 → **40**, `rimYSrodek` 80 | krzyżak Y – czasza gałki 3,617 |
| C5 | **Powieka górna: wycięcie tylnej krawędzi** | pręt Y – czasza G 0,187 (pełne otwarcie, ψ −28, θ −8,9; styk na krawędzi tylnej przy x 11,3) | pas `wyciecieG` x −2…24 → **−14…24**, 83,5° → **82,5°** (przy zamknięciu nominalnym krawędź tylna 74°: 31,2·sin 74° = 29,99 ≈ R30, kula nadal zakryta) | pręt Y – czasza G 0,529 (praca 0,770) |
| C6 | **Uchwyt przy nadlewach M3 Gałki** (Gałka bez zmian) | wierzch nadlewu z −6,68 jest nad spodem płyty okna (−7,5) o 0,82; otwór ślepy Ø2,6 × 5,4 od czoła z −12,68 wymaga śruby od tyłu | w płycie nad nadlewem kieszeń Ø7,6 od spodu na 1,1; **łapy osobne × 2** (L: płytka 2,0 pod czołem nadlewu, R20–25, z −14,68…−12,68 + żeberko 5 × 5 obok nadlewu po stronie φ 270° do spodu płyty); **DIN 7991 M3×6 od tyłu** w nadlew (wejście 4,0, do dna 1,4), DIN 7991 M3×8 od wierzchu płyty w żeberko (pkt 3.5) | łapy – powieka D i Słupek 0,655, łapa – Słupek 1,092 |

Zmiany C3–C5 to zmiany zmiennych w Variable Studio istniejących operacji (wycięcia już są w drzewie). C2 to nowa operacja usuwania materiału (Revolve albo Extrude REMOVE walcem wokół osi x). Kolejność i zgodę daje orkiestrator.

**Kołnierz Ramy przy uszach powiek (dawne C1) – bez zmiany Ramy.** Wycięcie kołnierza orkiestrator odrzucił (przebiłoby widoczne czoło rantu). W CAD Powieka górna ma teraz mostek 56–95° od krawędzi przedniej (`mostekKat1` 56, `mostekKat2` 95) i ucho G R5,5 (`uchoGR`); pomiar CAD: najwyżej z 5,40 (mostek) i 5,50 (ucho) wobec kołnierza od z 6. Model ma te wartości i kołnierz bez wycięcia: mostek G – rura 0,496, ucho G – rura 0,479 (cały zakres).

**Poza modelem** (do kontroli na siatkach CAD):
- zaokrąglenia i fazki (model ma więcej materiału);
- kształt widełek poza prostopadłościanem z końcem walcowym (np. fazki wejściowe krzyżaka);
- przejście 5° wycięć gałki (`rimFaza`), łby wkrętów orczyków w pogłębieniach;
- nawisy Uchwytu (wsporniki widełek, łapy) – druk.

## 11. Narzędzie akceptacji przegubów (`przeguby_akceptacja.py`)

Zastępuje `b1_akceptacja.py` (przeniesione do `v3.1/`). Wejście: plik JSON jak `przeguby_odniesienie.json` z polami `uGal`, `uOrcz` (wszystkie wymiary przegubów z pkt 3.3) i `hPrzegubu` (wysokość H nad wierzchem Ramienia). Brak pola = przerwanie, bez wartości zastępczych.

Narzędzie wymaga kompletu wymiarów w `uGal` i `uOrcz` (bez wartości domyślnych), wpisuje je do modelu, liczy pełne przemiatanie (albo bierze zapisane, jeśli **skrót** parametrów, trybu i plików `e6model.py`, `przemiatanie.py`, `okno.json` się zgadza – Astra pkt 6), `kinematyka.py`, `przeguby_3d.py` i `stale_pary.py`. Daje **TAK**, gdy:
1. każda para poza stykiem zamierzonym ≥ 0,5 mm w całym zakresie (pary obrotowe ≥ 0,2);
2. okno – Słupek ≥ 0,5 w pracy;
3. pary stała–stała ≥ 0,5;
4. wnętrze każdego z 4 przegubów w 3D ≥ 0,5 przy rzeczywistych kątach i zapas kąta > 0 (`przeguby_3d.py`).
Progów nie obniżam; przypadki graniczne rozstrzyga gęstsze próbkowanie albo rachunek dokładny (pierścienie współosiowe).

Wynik: TAK/NIE, lista naruszeń, 10 minimów w pracy i w całości, kinematyka (zakresy serw, momenty, L, H0, w) i kąty dopuszczalne. **Wynik dla `przeguby_odniesienie.json`:** ⟦brak⟧.

## 12. Części i okucia

| Część | Funkcja i wymiary | Druk |
|---|---|---|
| **Rama** | pkt 9 | tyłem w dół |
| **Płyta** | tarcza z −71,3…−68,3 z oknami G (x −35,5…−24,5, y −7…14) i D (x −26…−17, y −21…−6); 4 klatki z blokami uszu (kieszeń nakrętki M2, wycięcie ≥ 2,1) i kanałem kabla od obu krótszych ścian; słupki stopu z podparciami (pkt 5.2); 3 słupki R33 Ø6 do z −33 ze stożkiem 45°; piasta wspornika z gniazdem stożkowym M5 i spłaszczeniem; ramiona 5 × 4 na 100°/200°/310° (z −37…−33) | tarczą w dół |
| **Słupek** | pkt 3.1 (kieszeń Ø11,6) | pionowo |
| **Uchwyt** | pkt 3.5 | płytą w dół; widełki stałe i wsporniki do góry (nawisy ≤ 45° – sprawdzić w CAD) |
| **Gałka** | pkt 2, nadlewy M3 Ø7 (otwór Ø2,6, dno 0,6) | krawędzią tylną w dół |
| **Powieka górna / dolna** | pkt 5; przycięcia pkt 10 (ustalenia CAD) | płaszczyzną krawędzi przedniej na stół |
| **Ramię X / Y** | pkt 3.4, z widełkami orczyka; szer. 8, ostatnie 10 mm przed punktem A zwężone do 6 (miejsce na podstawę Ø8 widełek pręta Y) | płasko |
| **Pręt X / Y** | widełki przy gałce (z trójkątami 45° pod podstawą) + pręt Ø4,5 + tulejka obrotnicy Ø7 × 6 z czopem Ø4,4 × 3,4 – jedna część | pionowo, tulejką na stole; widełki u góry, bez podpór |
| **Widełki pręta przy orczyku X / Y** | pkt 3.3 (podstawa 6,5 z pogłębieniem łba M3) | podstawą na stole |
| **Krzyżak × 4** | krążek Ø5,75 × 4 (przy gałce), Ø8 × 4 (przy orczyku), 4 otwory promieniowe Ø1,8 → 2,0, głębokości z tabeli pkt 3.3 | na płasko, otwory poziome: rozwiercić |
| **Ramię PG / PD** | r20 / r17,5, otwór Ø1,6, kieszeń orczyka | płasko |
| **Obejma** | pkt 9 | kołnierzem w dół |
| *Przyrządy* | zera gałki (czapka w rancie), do gięcia drutów | |

**Z warsztatu (bez zakupów):**
- 4 × MG90S, kardan 5/5, drut sprężynowy Ø1,2 (2 × ok. 60 mm);
- DIN 7991 M3×8 × 2 (osie powiek), DIN 7991 M5×30 + nakrętka, DIN 7991 M5 + nakrętka (tuleja przednia), 2 × M4 bez łba (docięte);
- **sworznie przegubów: 4 × DIN 7991 M2×4 skrócone do 3,7 i 4 × DIN 7985 M2×4 (przy gałce), 4 × DIN 7991 M2×5 i 4 × DIN 7985 M2×5 (przy orczyku), 2 × M3×12 (obrotnice)**; łapy Uchwytu: 2 × DIN 7991 M3×6 (w nadlewy) i 2 × DIN 7991 M3×8 (z płyty) [Z: M2 tej długości w warsztacie; jeśli są tylko dłuższe – skrócić];
- 8 × M2×10 + 8 nakrętek M2 (uszy serw);
- 3 × M3×45, M3×25 z nakrętką samohamującą.
- Kardany 2/2 (2 szt.) i zapasowy 5/5 zostają jako zapas (pkt 3.2).

## 13. Zmienne (Variable Studio) i test zginania K9

**Gałka i dynia:** `kulaD` 60, `kulaRin` 28, `kulaZcut` −12,68; `rimX` 98 (φ 0, `rimXSzer` 30), `rimY` 102 (φ 80, `rimYSzer` 40); `glebokoscSrodka` 10, `otworD` 80, `obwiedniaR` 39,75, `rantD` 84, `dyniaR` 150, `rantT` 2, `kolnierzR` 35,2, `kolnierzZ` 6; `nadlewR` 3,5, `nadlewRpol` 23,5, `nadlewZ` −12,68…−6,68.

**Napęd:**
- `pktR` 21,25 (X), `pktRY` 20 (Y), `pktZ` −6;
- `walX` (y −13; z −49), `walY` (y 3; z −49), `ramieX_x` 18,013, `ramieY_x` 10,229;
- `orczykX` 14,7, `orczykY` 15,4, `ramieT` 6, `ramieW` 8, `ramieHubR` 7, `hPrzegubu` 7;
- `pretD` 4,5, `tulejaD` 7, `tulejaL` 6;
- przeguby `uGal_*` i `uOrcz_*` (pkt 3.3), osie `a1X`, `a1Y` (układ gałki), `katWidelekX` −12, wsporniki widełek `wsporKat` 46°, `wsporA` 4 (do ściany tulei R7,65), `piastaPrzodZ2` 19,75, `ramieWKoniec` 6 / `ramieLKoniec` 10.

**Okno i Uchwyt:** `oknoZ` −6, `plytaOknaT` 3, `plytaRout` 26,6, `zapasOgr` 3, `okno_r0`…`okno_r90`, węzły wycięć płyty (pkt 10); `slupekR` 7,65, `slupekZ0` −33, `slupekZ1` −5,5, `luzKieszeni` 0,3; `zebroZ1` −2; łapy R20–25 × 2,0, żeberko 2,5.

**Powieki:** jak v3.1 poza wycięciem G (`zakresG` 99,5, `zakresD` 79, `wyciecieG` 82,5 w x −14…24, `wyciecieZaczepG` 96,5, `wyciecieZaczepD` 76, `zamkG` −8,5, `zamkD` −11,5, `otwG` 42, `otwD` −38, `zapasZamk` 0,75, `zapasOtw` 0,75, …); słupki stopu pkt 5.2 (`slupekStopuA` 6, `rhoG` 10, `rhoDzam` 14, `rhoDotw` 10).

**Rama i Płyta:** `zArmWsp` −35, kąty 100/200/310, `slupekPlytyR` 33, ucha R4 na R34,5, z −33…−27, `tarczaZ` −71,3…−68,3; wycięcie kołnierza R8,6, \|x\| 30,35…36,85; wycięcie czaszy G R4,6, \|x\| ≥ 30,35.

**K9, oczekiwane efekty:**

| Zmienna (zakres) | Oczekiwany efekt |
|---|---|
| `uGal_cP` 5,5 ↔ 6,5 | widełki pręta przy gałce dłuższe o 1,0 wzdłuż pręta; pręt Ø4,5 zaczyna się 1 mm dalej |
| `uOrcz_cS` 8,25 ↔ 8,75 | podstawa widełek orczyka 0,5 dalej od H; obrót dopuszczalny wokół a1 rośnie, podstawa X bliżej tarczy o ok. 0,5 |
| `pktRY` 20 ↔ 20,5 | krzyżak Y o 0,5 na zewnątrz, widełki stałe Y za nim; L_Y zmienia się (IK z `kinematyka.py`) |
| `zapasOgr` 3 ↔ 2,5 | okno r −0,2…−0,3 |
| `plytaRout` 26,6 ↔ 26,0 | kontur zewnętrzny płyty, wycięcia bez zmian |

## 14. Elektronika i firmware

- Kanały: 12 = X, 13 = Y, 14 = powieka górna, 15 = dolna; małe oczy 0–11.
- IK prętów wzorem z pkt 3.4 (stałe C, w, L z tabeli). Powieki: tablica t → µs (16 punktów) z kalibracji.
- Zasilanie: decyzja 20.10 (powerbank przez USB-C), źródło rozstrzyga E5.5.

## 15. Ryzyka i próbki

| # | Miejsce | Test i kryterium |
|---|---|---|
| 1 | **Przeguby krzyżowe (pierwszy wydruk etapu 2)** | **P4:** jeden komplet pręta X (widełki przy gałce + pręt + tulejka, krzyżak Ø5,75, krzyżak Ø8, widełki pręta z podstawą Ø8 i wycinek Ramienia z widełkami orczyka, wycinek Uchwytu z widełkami stałymi), sworznie M2 i M3×12 jak w tabeli pkt 3.3, otwory rozwiercone Ø2,0. Kryteria: (a) obrót bez zacięć przy **jednoczesnym** γ i β w narożnikach zakresu z pkt 3.3 + 3° (kątomierz); (b) **luz długości pręta** pod ±5 N, w zerze i przy wychyleniu skrajnym: ≤ 0,64 mm (rachunek dla c 0,05; cel 0,48 przy c 0,03); (c) obciążenie osiowe ±80 N przez 10 s, 5 razy, **przy połączonym wychyleniu skrajnym**: bez pęknięć i rozwarstwienia krążka, bez wyrwania sworznia, trwałe wydłużenie ≤ 0,05, potem ponowny pomiar (b); (d) 1000 cykli ±40° na serwie: wzrost luzu ≤ 0,1. Po złożeniu mechanizmu: luz gałki w zerze i w 4 narożnikach pracy ≤ 5,1° / 3,9° (ψ / θ). Przy NIE w (b): mniejszy luz sworzni (ciaśniejsze rozwiercenie) albo kardan 2/2 przy orczyku – z przeliczeniem |
| 2 | Przekładnie (do 4,0 × zablokowania) | **T1** dla każdego napędu, decyzja o planie B przed drukiem całości |
| 3 | Druty i zaczepy | **P3** (1000 mrugnięć) i **P3b** (montaż Z) |
| 4 | Okno i Słupek | **P1**: zakres mechaniczny, szczelinomierz 0,5 przy ±25/±15, dostęp klucza M4 |
| 5 | Obejma | **P5** |
| 6 | Głębokość | **B5** |
| — | Prąd | **T2** |
| — | Gałka | **P6** |

## 16. Pytania otwarte

B1 nie jest blokujące (orkiestrator 23.10): wymiary przegubów są zmiennymi z przedziałami (pkt 3.3), akceptację daje `przeguby_akceptacja.py`, a dowodem fizycznym jest P4. B4 zamknięte (rysunek MG90S, M2 + nakrętka, kanał z obu stron).

| # | Pytanie | Warunek przyjęcia |
|---|---|---|
| B9 (rozstrzygnięte 23.10) | Pasowanie sworzni przegubów napędu gałki | orkiestrator: otwory podwymiarowe rozwiercane ręcznie do c ≈ 0,03–0,05 (luz zwrotny 1,6–2,7°); P4 potwierdza, wartość po P4 do tabeli luzów w AGENTS.md |
| **B2** (Słupek) | Potwierdzić zdjęciem „M4 równolegle do sworznia” | prostopadle → kardan obrócony o 90°, okno i przemiatanie od nowa |
| **B5** (Płyta) | Wolna głębokość za wewnętrzną ścianką | wolne ≥ 74,40 + g − w + 2 (przy g 10, w 15: ≥ 71,4); mniej → mniejsze g albo S_PG do przodu, z powtórką przemiatania |
| B6 | Gałka wystaje 20 mm, zamknięte powieki 25 mm – OK? | karton Ø84 na dyni |
| B7 | Rozstaw małych oczu | |
| B8 | Obejma z PETG | |

## 17. Weryfikacja v3.1 (Astra) → co zrobiono

| Pkt | Uwaga | Co zrobiono |
|---|---|---|
| 2 (KRYT.) | Tuleja Słupka poza kontrolą; piasta M2 Y w tulei od θ ≈ 12°, −0,80 przy (0; 15) | `ann` we wszystkich parach; punkt Astry i stara piasta jako przypadki kontrolne (−0,803 / −0,859); piasty M2 nie ma, przegub Y to widełki nad płytą: ≥ 1,50 mm od Słupka w całym zakresie (pkt 3.5); Słupek bez zmian poza kieszenią Ø11,6 |
| 3 (KRYT.) | Macierz i geometria nie obejmują całego mechanizmu | Bryły z CAD (mostek, ucha, boki osi, płaski tył Gałki, nadlewy, Uchwyt w parach z powiekami, żebro, ucha Ramy), kable jako prostokąt, pary stała–stała (`stale_pary.py`), Uchwyt–Gałka; ustalenia CAD C2–C6 (pkt 10) |
| 4 (KRYT.) | Nie każda odległość jest dolnym ograniczeniem (`prism_d`) | `prism_d` dokładne (przypadek kontrolny 2,5), wycięcia jako max(d_A, −d_B); zgodnie z decyzją orkiestratora formalnego ograniczenia dla ruchu ciągłego nie dowodzę: krok 0,05° (0,026 mm na R30) przy minimach, kontrola końcowa na siatkach CAD |
| 5 | Okno: 180 punktów w przemiataniu, splajn ≠ CAD | 720 punktów splajnu w przemiataniu; profil CAD do sprawdzenia na siatce względem `okno_splajn.npy` (pkt 4) |
| 6 | B1 TAK niewiarygodne (cache, wartości zastępcze) | `przeguby_akceptacja.py`: komplet pól wymagany, skrót parametrów, trybu i plików modelu, kinematyka i momenty w wyniku (pkt 11) |
| 7 | Czopy M5 i podstawa Ramion niespójne | nieaktualne: Ramiona bez czopu M5, widełki orczyka wyrastają z płaskiego Ramienia (pkt 3.4) |
| 8 | Końcówka Ø8, ścianka 1,5 | nieaktualne: pręt bez gwintu M5; pręt z widełkami i tulejką jedna część; obciążenie osiowe ±72 N w P4 (pkt 15) |
| 9 | Sprzęgło planu B nie mieści się w piastach powiek | opisane jako zadanie po T1 (pkt 7) |
| 10 | Wpływ na CAD: płaski tył Gałki, Ø11,6, mostek i ucha | tył z_b −12,68 i Ø11,6 w modelu; mostek 56–95° i ucho G R5,5 (CAD) w parach; zmiany CAD C2–C6 |
| drobne | granica okna poza osiami; kołnierz 1,023 | ψ 28,083° przy θ 15,148°, θ 18,183° przy ψ 23,733° (pkt 4); kołnierz 1,008 (pkt 5.3) |

## Werdykt

V3.2 po korekcie nadaje się do weryfikacji modelu kontrolnego i do briefu CAD etapu 2 przy dwóch warunkach:
- zmiany C2–C6 istniejących części wchodzą do CAD;
- P4 (przeguby z otworami rozwierconymi do c ≈ 0,03–0,05) drukuje się jako pierwsza i zalicza kryteria z pkt 15.

**W modelu:**
- wszystkie pary niezamierzone ≥ 0,147 mm w całym zakresie, pary stała–stała ≥ 0,556;
- okno – Słupek 0,56 w pracy;
- wnętrze przegubów w 3D ≥ 0,634 mm, zapas kąta ≥ 3,5°;
- kolizja piasty Y ze Słupkiem znika bez zmiany Słupka.

**Najsłabszy punkt:** luz zwrotny przegubów, 3,8° / 2,8° … 5,1° / 3,9° w pracy (pkt 3.3). Drugi w kolejności: przekładnie MG90S, do 4,0 × momentu zablokowania na X w pracy (T1).

---

## Załącznik: odtworzenie

```
cd 40-cad/narzedzia/e6-przemiatanie
./odtworz.sh   # okno.py → przemiatanie.py → stale_pary.py → kinematyka.py → przeguby_akceptacja.py --uzyj
```

Python 3 + numpy, 10 rdzeni. Wyniki: `okno.json`, `okno_splajn.npy`, `przemiatanie.json` + `.txt` (każda para: minimum w pracy i w całym zakresie z położeniem, skrót `skrot`), `stale_pary.txt`, `kinematyka.json`, `przeguby_odniesienie_wynik.json` + `.txt`. `--szybko` daje siatkę 2° do szybkiej kontroli; wynik obowiązujący liczy się bez tej opcji.
