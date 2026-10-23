# Duże oko 2c – koncepcja v3.1 (E6.1d, 23.10)

Autor: Opus (realizator v1–v3). Zlecenie orkiestratora z 23.10: naprawić model kontrolny po weryfikacji v3 (Astra NIE: K1, K2, W1–W6; Fable TAK PO POPRAWKACH: W1–W5, D1–D9), dać narzędzie akceptacji B1 i poprawić W2, W4, W5, W6 oraz drobne. Wariant odniesienia według decyzji orkiestratora: `kulkaM5H` 7 i obudowa M5 Ø12.

V3.1 jest samowystarczalna: wykonawca CAD nie musi czytać v1–v3. W repo zapisałem ten plik i katalog `40-cad/narzedzia/e6-przemiatanie/` (skrypty v3 przeniesione do `v3/`). Bez commitów, bez prognoz czasu, bez zakupów modelarskich.

Oznaczenia: **[F]** fakt (źródło, pomiar, plik), **[R]** rachunek skryptem z katalogu wyżej, **[Z]** założenie, **[A]** własna adaptacja, niesprawdzona.

**Układ współrzędnych:**
- O = środek kuli i krzyżaka kardana;
- **+z** z dyni na zewnątrz, **+y** w górę, **+x** w prawo patrząc na dynię z zewnątrz;
- ψ+ = spojrzenie w prawo, **θ+ = spojrzenie w górę**, obrót gałki R = Rx(−θ)·Ry(ψ);
- kąty powiek to kąt krawędzi przedniej od +z ku +y (patrz pkt 5).

## 0. Wynik

1. **Model kontrolny jest przebudowany** (`e6model.py`, `okno.py`, `przemiatanie.py`).
   - Każda bryła ma dokładną funkcję odległości punktu. Druga bryła pary jest próbkowana na powierzchni (albo na osi, dla kapsuły).
   - Wynik to dolne ograniczenie: minimum minus promień pokrycia próbek.
   - Sprawdziłem funkcję odległości czaszy powieki na gęstej siatce powierzchni (10⁶ punktów): błąd ≤ 0,03 mm, zawsze po stronie bezpiecznej. Czaszę gałki, walec i prostopadłościan sprawdziłem losowymi punktami brył: odległość z funkcji nigdy nie przekracza odległości z próbek.
   - Macierz par jest jawna (pkt 10), zakres jeden: gałka do rzeczywistej granicy okna, powieki do ograniczników.
2. **Okno ogranicznika z dokładnych przekrojów** Słupka (z −33…−5,5) i dolnej połówki kardana, przez całą grubość płyty 3 mm (Astra K1).
   - Do CAD idzie splajn przez punkty co 5° (tabela pkt 4), a kontrole liczą na tym samym splajnie.
   - Zapas w pracy **0,56 mm** przy (0; −15). Zakres mechaniczny ψ ±28,03°, θ ±18,05°, przekątna (28,03; 18,02).
   - Styk na Słupku: z −10,4…−13,9. Do krawędzi otworu M4 na ±x zostaje **1,37 mm**.
3. **Wariant odniesienia** (h 7, obudowa M5 Ø12, wymiary gniazd założone do B1), narzędzie B1: **TAK**.
   - W zakresie pracy najmniej **0,617 mm** (drut G – gałka).
   - W całym zakresie najmniej **0,551 mm** (obudowa M2 Y – płyta okna).
   - Nie liczę tu styków zamierzonych.
4. **Zmiany geometrii wymuszone pełnym modelem** (pkt 1):
   - obudowy przegubów jako gniazdo i trzon;
   - gniazdo czopu M5 w Ramieniu: cokół pod kołnierzem, fazka i obniżony mostek;
   - czop X zlicowany od spodu, Y z wystawaniem ≤ 0,5;
   - pręt Ø4,5 z końcówką Ø8 drukowany pionowo;
   - ramiona powiek węższe, z zaokrąglonym końcem;
   - słupki stopu 6 × 6;
   - przycięcia tylnych krawędzi powiek przy zaczepach;
   - kable według `e6-pomiary.md`.
5. **Rozruch:** fizycznie gałka nie wyjdzie poza okno, a powieki poza zęby. Przemiatanie obejmuje cały ten zbiór. Każdy skok, przy dowolnym postępie serw, kończy się więc najwyżej na styku zamierzonym (okno–Słupek, ramię–słupek stopu).
   - Pozycja w NVS jest zapisywana jako jeden rekord z sumą kontrolną w dwóch przemiennych slotach (pkt 6).
6. **Najsłabszy punkt:** wymiary przegubów z warsztatu nadal nie są znane.
   - Wariant odniesienia przechodzi tylko przy założonych gniazdach obudów.
   - Rozstrzyga pomiar B1 wpisany do `b1_akceptacja.py`.

## 1. Co zmieniłem względem v3

| Obszar | v3 | v3.1 | Uwaga recenzenta |
|---|---|---|---|
| Okno | próbki Słupka co 0,47 mm w z, bez przecięć z płaszczyznami płyty, tabela co 15° | dokładne krzywe brzegowe przekroju (co 0,125° obwodu), Słupek i kardan dolny, tabela co 5°, kontrola na splajnie | Astra K1, Fable W3 |
| Funkcje odległości | pole czaszy przy stałym x, próbki osi 0,3–0,5 mm bez granicy błędu | dokładne odległości do bloków czasz (gałka, powieki), walców, tulei, prostopadłościanów, rury, graniastosłupów; dolne ograniczenie z promieniem pokrycia | Astra K2, Fable D6 |
| Przegub kulowy | walec Ø14 wzdłuż pręta | **gniazdo** (walec wzdłuż czopu, gD × gH) + **trzon** (walec wzdłuż pręta, sD × L); obudowa wobec własnego Ramienia i własnej piasty jest sprawdzana | Fable W1, R4 |
| Gniazdo M5 w Ramieniu | „płaskie Ramię 6 mm” | gniazdo Ø9 wzdłuż czopu z fazką 1 × 45°, cokół Ø8 × 1 pod kołnierzem, mostek 4 mm (wierzch 2 mm niżej) na ostatnich 7 mm przed gniazdem, czop przelotowy | Astra W2 |
| Pręt | Ø5 z płaską stroną, końcówka Ø9 × 5 | **Ø4,5, końcówka Ø8 × 5, druk pionowo** (końcówką na stole) | Astra W2, Fable W2 |
| Ramiona powiek | prostokąt 8 mm z końcem +4 | G szer. 6, D szer. 5, koniec zaokrąglony (R = ½ szer.) | wynik przemiatania (D – ramię wspornika) |
| Słupki stopu | „ząb na piaście” | słupki 6 × 6 przy ściance klatki, styk boku ramienia 0,75° za położeniem programowym | Fable W5 |
| Powieki przy zaczepach | — | tylna krawędź przycięta w pasie x −31…−17: G do 96,5° za krawędzią przednią, D do 76° | wynik przemiatania (drut – własna czasza) |
| Wycięcie gałki Y | φ 80 ±30 | φ 80 ±35 do 106° | pręt Y – czasza gałki |
| Kable MG90S | strona wałka | strona przeciwna do wałka, nisko (e6-pomiary.md); S_PG pętlą wzdłuż spodu | Fable W4 |
| Słupek | walec do z −5,5 | walec do −12,75 + tuleja Ø11,6/Ø15,3 do −5,5 | rachunek kardana |
| Uszy MG90S | otwór, M2,5 | otwarte wycięcia: śruba M2,5 z podkładką Ø6 dociska ucho do bloku | Fable W4 |
| Rozruch | 1000 losowych skoków | dowód z ograniczników fizycznych + spójny zapis NVS | Astra W4 |
| T1 i plan B | progi wspólne | progi osobno dla każdego napędu i wariantu, przypadek braku przedziału poślizgu, wymiary sprzęgła | Astra W5 |
| B5 | `glebokoscSrodka` +Δ (zły znak) | wolne ≥ 73,63 + g − w + 2 | Astra W6 |

## 2. Wymiary i miejsce

| Wielkość | Wartość | Status |
|---|---|---|
| Gałka | Ø60, ścianka 2 (R28–30), krawędź 115° od osi, wycięcia φ 0° ±25° do 104° i φ 80° ±35° do 106° (pełna głębokość w pasie, przejście 5° poza pasem); biała, front gładki | [F] decyzje 22.10, [R] |
| Zakres gałki | praca ψ ±25°, θ ±15°; okno na ±28°/±18° (`zapasOgr` 3°), mechanicznie ±28,03°/±18,05° | [R] okno.py |
| Powieka górna (G) | krawędź przednia: zamknięta −8,5°, otwarta +42°, z podążaniem +47°; ograniczniki −9,25° i +47,75° | [R] |
| Powieka dolna (D) | zamknięta −11,5°, otwarta −38°, z podążaniem −43°; ograniczniki −10,75° i −43,75° | [R] |
| Środek kuli za powierzchnią dyni | g = 10 mm (`glebokoscSrodka`) | [Z] |
| Obwiednia przejścia | walec Ø79,5 od z +10 do z −73,63; poza nim tylko rant Ø84 | [R] |
| Tył modułu | słupek stopu otwarcia G z −73,63 (ramię G −73,27) | [R] |
| Głębokość za wewnętrzną ścianką | 73,63 + g − w; przy g 10, w 15: **68,6 mm** + kable bokiem | [R], B5 |
| Masa | ok. 220 g ±20 %; części kupne ok. 103 g, więc 130–150 g jest nieosiągalne przy 4 MG90S | [R] |

## 3. Napęd gałki

### 3.1 Kardan 5/5 i Słupek

- **Pomiar [F]:** Ø11 × 25,5, krzyżak 12,75 od czoła, otwory Ø5 głębokości 7, wkręt M4 9,1 od osi sworznia, zgięcie > 90°.
- **B2 [F, e6-pomiary.md, pewność średnia]:** oś wkrętu M4 jest równoległa do sworznia tej samej piasty.
  - Tylny sworzeń leży na x, więc otwór M4 w Słupku wypada na ±x, czyli tam, gdzie styk okna jest najniżej (pkt 4).
  - Potwierdzić zdjęciem przed drukiem Słupka.
- **Słupek:**
  - walec R7,65 od z −33 (wierzch piasty wspornika) do −12,75;
  - dalej tuleja Ø11,6/Ø15,3 do z −5,5 (kieszeń tylnej piasty kardana, luz 0,15/str.);
  - otwór Ø4,2 na ±x w osi z −9,1 dla M4 bez łba (dłuższy niż fabryczny, przez ściankę do gwintu piasty).
- **Trzpień:**
  - DIN 7991 M5×30 od spodu piasty wspornika, łeb w gnieździe stożkowym piasty (z −37…−34,2);
  - nakrętka M5 w kieszeni Słupka (z −20…−16);
  - koniec na z −7,0, w otworze kardana na 5,75 mm, 1,25 mm przed dnem.
- **Blokada obrotu:** spłaszczenie 0,6 mm spodu Słupka w kieszeni piasty.
- **Przednia piasta kardana** w tulei Uchwytu Ø11,6/Ø15,3 od z_b +6,3 do +12,75, M5×12 z nakrętką w kieszeni, M4 przez ściankę.
  - Tuleja przednia – kardan dolny: ≥ 0,5 w całym zakresie [R].
  - Wnętrza kardana (połówka górna wobec dolnej) nie sprawdzam, bo zgięcie > 90° [F].

### 3.2 Pręty S–S i Ramiona X/Y

**Źródło [F]:** Cogley, [DIY Compact](https://www.instructables.com/DIY-Compact-3D-Printed-Animatronic-Eye-Mechanism/) (MG90S i popychacze na przegubach kulowych M2). Przegub kulowy na obu końcach to adaptacja [A] na przegubach z warsztatu: 2 × M2 i 2 × M5.

| Element | X (ψ) | Y (θ) |
|---|---|---|
| Kulka M2 (P w zerze, układ gałki) | (19,5; 0; −6), czop ∥ y gałki, piasta po stronie −y | (0; 19,5; −6), czop ∥ y gałki, piasta do środka |
| Serwo | S_X: wałek (y −13; z −49), oś ∥ x, orczyk w +x, płaszczyzna orczyka x 18,01 | S_Y: wałek (y 3; z −49), płaszczyzna orczyka x 10,23 |
| Ramię | r13, w zerze w +y, 6 mm (x 17,0…23,0), szer. 8 | r15, x 9,2…15,2 |
| Czop M5 (kierunek d w zerze) | (0,9967; 0; 0,0814), 4,7° od x ku +z | (0,9427; 0,0116; 0,3335), 19,5° |
| Środek kulki M5 w zerze (h 7) | (29,99; 0; −48,43) | (21,83; 18,08; −46,67) |
| Długość pręta (środki kulek) | **43,71** | **46,18** |
| Zakres serwa: praca / zakres okna | −28,8…+43,8° / −31,3…+52,9° | −21,1…+32,1° / −24,5…+40,8° |
| Wychylenie M5 (praca / całość) | 15,8 / 16,9° | 16,0 / 18,7° |
| Wychylenie M2 (całość) | 24,0° | 24,0° |
| Kąt nacisku przy orczyku | 53,5 / 64,7° | 56,3 / 65,3° |
| Moment na wale przy 0,5 N·m na gałce, dowolny kierunek (praca) | **0,767 N·m** (4,3 × 0,177) | 0,575 N·m (3,2×) |
| Siła w pręcie: zablokowane serwo / ręka 0,5 N·m (praca) | 23 / 71 N | 21 / 44 N |

- **Pochylenie czopu** zostaje prostopadłe do średniego kierunku pręta w zerze.
  - Większe pochylenie zmniejsza wychylenie (+6°: X 12,0°, Y 15,5°), ale podnosi kąt nacisku do 75° i moment o 5 % [R].
  - Wybieram przenoszenie.
- **Ramię X/Y** (Astra W2) to płytka 6 mm:
  - pełna grubość od wałka do 7 mm przed gniazdem;
  - dalej mostek 4 mm z wierzchem 2 mm niżej;
  - **gniazdo**: walec Ø9 osiowo z czopem, od tylnej płaszczyzny Ramienia do 1 mm pod płaszczyzną oporową, z fazką 1 × 45° na krawędzi;
  - na nim **cokół Ø8 × 1**, na którym siedzi kołnierz czopu.
  - Płaszczyzna oporowa jest prostopadła do czopu i leży w punkcie A na wierzchu Ramienia.
  - Gwint M5 przelotowy, prostopadle do płaszczyzny oporowej (otwór Ø4,2 nagwintowany śrubą stalową).
  - Długość gwintu czopu przez Ramię: X 1 + 6,02, **zlicowany od spodu** (kończy się 1,8 mm przed wierzchem Ramienia Y); Y 1 + 6,36 + **≤ 0,5 wystawania**, bo za Ramieniem Y biegnie kabel S_PG.
  - Czop skrócić: X do 7,0 mm, Y do 7,8 mm gwintu pod kołnierzem.
- **Piasta Ramienia** Ø14 na wałku: miejsce na sprzęgło z planu B.
  - Od spodu kieszeń na jednoramienny orczyk fabryczny skierowany przeciwnie do gniazda, żeby nie wchodził pod czop.
  - Mocowanie wkrętem środkowym M2 w otworze Ø4,5 z łbem w pogłębieniu, plus dwa M2 przez otwory orczyka rozwiercone do Ø1,6.
  - Najpierw Ramię Y, potem X.
- **Druk Ramienia:** na płasko. Otwór pochylony o 19,5° od pionu drukuje się bez podpór.

**Kinematyka odwrotna (firmware, wzór zamknięty) [R]:** dla serwa k ∈ {X, Y}:
- q = P − C,
- K = (|w|² + |q|² − L²)/2,
- A = q_y w_y + q_z w_z,
- B = q_z w_y − q_y w_z,
- **α = atan2(B, A) − acos((K − q_x w_x)/√(A² + B²))** (gałąź „−”, α = 0 w zerze; α to obrót wokół +x według reguły prawej dłoni, 0 = ramię w +y).

| h 7 | C (środek wierzchu Ramienia na osi wałka) | w = r·ŷ + h·d | L |
|---|---|---|---|
| X | (23,013; −13,000; −49,000) | (6,977; 13,000; 0,570) | 43,707 |
| Y | (15,229; 3,000; −49,000) | (6,599; 15,081; 2,334) | 46,175 |

`kulkaM5H` zmienia w i L, a C pozostaje. Znaki (h 7):

| (ψ; θ) | serwo X [°] | serwo Y [°] |
|---|---|---|
| (+25; 0) | −28,8 | +7,9 |
| (−25; 0) | +43,7 | −2,7 |
| (0; +15) | +1,0 | −18,3 |
| (0; −15) | +1,0 | +21,9 |
| (+25; +15) | −26,3 | −10,7 |
| (+25; −15) | −25,4 | +32,1 |
| (−25; +15) | +43,5 | −21,1 |
| (−25; −15) | +42,6 | +18,5 |

Kierunek µs ustala kalibracja (flaga znaku w NVS).

### 3.3 Pręty i ich zakończenia (Astra W2, Fable W2)

Od kulki M2 do kulki M5:

| Odcinek | Długość | Przekrój | Uwagi |
|---|---|---|---|
| obudowa M2 | trzon do 9 od środka kulki, gniazdo Ø7 × 6 [Z, B1] | trzon Ø5 | gwint żeński M2 |
| nakrętka kontrująca M2 | 1,6 | Ø4,6 | |
| pręt drukowany | X 12,1 / Y 14,6 | **Ø4,5** | szpilka M2×10 (bez łba) wkręcona 4 mm w otwór Ø1,6; ścianka 1,45 |
| końcówka | 5 | **Ø8** | gwint M5 nacięty śrubą w otworze Ø4,2; szpilka M5 wkręcona 5 mm do oporu |
| nakrętka kontrująca M5 | 4 | Ø9,2 | blokada obudowy na szpilce |
| obudowa M5 | trzon Ø8 do 12 od środka kulki, gniazdo Ø12 × 10 [Z, B1] | | szpilka wkręcona na ≥ 5 |

- **Druk pręta: pionowo, końcówką Ø8 na stole** (cały wydruk X 17,1 / Y 19,6 mm), bez podpór.
  - Warstwy są prostopadłe do osi, więc gwint M5 obejmują pełne pierścienie, a nie warstwy wzdłuż osi.
- **Końcówka Ø8 zamiast Ø9** (Fable W2: Ø9 dawała styk niezamierzony 0,31 mm z powieką). Ścianka wynosi 1,5 przy średnicy gwintu i 1,9 przy otworze Ø4,2 (Astra v2 K4 wymagała 2).
  - Rachunek obwodowy [R]: siła klinowa gwintu 60° przy 71 N to 0,58·71 = 41 N na pole π·5·5 = 79 mm², czyli p = 0,52 MPa i σ_obw = p·r/t = 0,52·2,5/1,5 ≈ **0,9 MPa** wobec ok. 50 MPa PLA.
  - Wyrwanie przy 5 mm gwintu: 0,5·π·5·5·20 MPa ≈ 790 N.
  - Ryzyko pęknięcia jest tylko przy nacinaniu gwintu, więc sprawdza je próbka P4.
- **Wyboczenie Ø4,5:** P_kr = π²·3500·20,1/14,6² ≈ 3200 N wobec 71 N.
- **Regulacja długości:** obrót obudowy M5 na szpilce, potem kontra M5. Pół obrotu = 0,4 mm ≈ 1,7° serwa X; dokładne zero idzie w µs.
- **M2:** obudowa wkręcona do kontry.
- **Kontrola** długości po teście 24 h na przyrządzie długości 43,71 / 46,18. Kołnierz czopu M5 dokręcony do oporu na cokole (Fable D2).

### 3.4 Wycięcia gałki i powieki górnej

- **Gałka:**
  - φ 0° ±25° do 104° (pręt X), φ 80° ±35° do 106° (pręt Y), pełna głębokość w pasie, przejście 5° poza pasem;
  - w modelu to bryła bez przejścia, czyli zachowawczo większa (więcej materiału przy pasie);
  - przy ψ −25° wycięcie X widać na 79° od osi patrzenia jako ciemną krawędź 0,6 mm wewnątrz sylwetki (Fable D5, kosmetyka).
- **Powieka górna:** w pasie x −2…+24 tylna krawędź 83,5° za przednią (75° przy zamknięciu nominalnym; R31,2·sin 75° = 30,14 > 30, więc kula zakryta).
- **Przycięcie przy zaczepach:** tylna krawędź w pasie x −31…−17 do 96,5° (G) i 76° (D) za krawędzią przednią.
  - Kulę dalej zakrywa: przy x −25 promień czaszy w yz to 18,7, a 18,7·sin 87,5° = 18,7 > 16,6 = sylwetka kuli.
  - Bez tego drut przy zaczepie miał do własnej czaszy 0,04 (G) i 0,26 mm (D).

## 4. Ogranicznik gałki: okno (Astra K1, Fable W3)

**Rachunek [R] (`okno.py`):**
- **Bryły nieruchome:** Słupek R7,65 (z −33…−5,5, ostra krawędź czoła) i kardan dolny R5,5 (z −12,75…+5,5).
- **Płyta okna** w układzie gałki: z_b −7,5…−4,5.
- **Przekrój:** dla każdego położenia gałki to otoczka wypukła krzywych brzegowych bryły ∩ warstwy płyty:
  - przecięcia powierzchni bocznej z obiema płaszczyznami płyty;
  - okręgi den walca w grubości płyty, próbkowane co 0,125° obwodu (strzałka cięciwy < 10⁻⁵ mm).
- **Okno wymagane** to największy promień przekrojów na każdym kierunku φ (1440 kierunków). Liczone dla 736 położeń na granicy ±28/±18 (co 0,25°) i 551 położeń wewnątrz (co 2°).
- **Tabela do CAD** co 5°: wartość obwiedni w węźle, w górę do 0,01. Okresowy splajn sześcienny przez 72 węzły jest od obwiedni większy o 0,002…0,045 mm.
- **Wszystkie dalsze kontrole liczą na tym splajnie** (wielokąt 14 400 wierzchołków).

**Okno r(φ) [mm], φ od +x gałki ku +y, symetryczne względem osi x i y gałki** (zmienne `okno_r0`…`okno_r90`):

| φ | 0 | 5 | 10 | 15 | 20 | 25 | 30 | 35 | 40 | 45 |
|---|---|---|---|---|---|---|---|---|---|---|
| r | 12,66 | 12,71 | 12,86 | 13,12 | 13,47 | 13,75 | 13,92 | 13,97 | 13,90 | 13,72 |

| φ | 50 | 55 | 60 | 65 | 70 | 75 | 80 | 85 | 90 |
|---|---|---|---|---|---|---|---|---|---|
| r | 13,42 | 13,04 | 12,58 | 12,07 | 11,53 | 11,06 | 10,74 | 10,55 | 10,49 |

Zgadza się z tabelą wykonawcy w `e6.2-plan-zmienne-layout.md` (12,65…13,95…10,48) do 0,02 mm. W Onshape: spline przez punkty, zamknięty.

**Wynik [R]:**
- **Zapas w pracy:** **0,560 mm** przy (0; −15) (siatka 0,5°, zagęszczenie 0,1° wokół 8 minimów).
  - Świadek Astry (−1; −15) ze starym oknem: 0,486. W tym oknie zapas wynosi ≥ 0,56.
- **Zakres mechaniczny** (bisekcja po 72 kierunkach w (ψ/28, θ/18)):

  | Kierunek | ψ [°] | θ [°] |
  |---|---|---|
  | 0° | 28,03 | 0 |
  | 30° | 28,05 | 10,41 |
  | 45° | 28,03 | 18,02 |
  | 60° | 16,28 | 18,12 |
  | 90° | 0 | 18,05 |

  Przemiatanie używa dokładnie tej granicy. W Assembly zakres ma wyjść 28,0–28,25° / 18,0–18,25°.
- **Pas styku na Słupku:**

  | Azymut | z |
  |---|---|
  | 0°/180° (ogranicznik ψ) | −13,71…−12,55 |
  | 90°/270° (ogranicznik θ) | −11,33…−10,36 |

  Otwór M4 Ø4,2 na ±x (z −11,2…−7,0) ma do najbliższego punktu styku **1,37 mm**.
- **Siła na krawędzi okna** przy 0,5 N·m: ok. 42 N (ramię 12 mm).

**Płyta okna i wycięcia na pręty [R]:**
- Płyta jest pełna od okna do R27, z wycięciem po obwiedni obudów M2 i prętów w całym zakresie mechanicznym, z luzem 0,6.
- Kontur zewnętrzny to łamana przez węzły co 5°, z wartością w węźle = minimum obwiedni w ±5°. Odcinki leżą wewnątrz.

| φ | −15 | −10 | −5 | 0 | 5 | 10 | 15 | 55 | 60 | 65 | 70 | 75 | 80 | 85 | 90 | 95 | 100 | 105 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| r zewn. | 15,48 | 14,72 | 14,72 | 14,80 | 14,81 | 14,81 | 15,47 | 15,96 | 15,02 | 14,68 | 14,66 | 14,66 | 14,74 | 14,82 | 14,83 | 14,90 | 15,00 | 15,48 |
| mostek | 2,36 | 1,86 | 2,01 | 2,14 | 2,10 | 1,95 | 2,35 | 2,92 | 2,44 | 2,61 | 3,13 | 3,60 | 4,00 | 4,27 | 4,34 | 4,35 | 4,26 | 4,42 |

- Poza tymi węzłami r zewn. = 27.
- **Mostek X** (1,86–2,36 mm) ma żebro nad płytą (z_b −4,5…−2,0). Pręty zostawiają tam szerokość 2,24–2,91 mm (w żebrze luz 0,5 od obwiedni).
- **Naprężenie** przy 42 N na mostku 7 mm z utwierdzonymi końcami:
  - M = 42·7/8 = 37 N·mm;
  - W = 3·1,86²/6 + 2,5·2,24²/6 = 1,73 + 2,09 = 3,8 mm³;
  - **σ ≈ 10 MPa**.

**Uchwyt:**
- **Piasty kulek M2:** Ø6 wzdłuż −y gałki. Kołnierz czopu M2 na cokole Ø4 × 1, poniżej piasta z fazką 0,75 × 45°.
- **Łączniki do tulei przedniej:** 3 pręty Ø4 na φ 135°, 225°, 315°, od (r 15,5; z_b −4,5) do (r 9,2; z_b +6,3).
- **Nadlewy Gałki:** Ø7 na φ 210° i 330°, R24, z_b −16…−10.

Wszystkie te bryły są w przemiataniu, łącznie z łącznikami wobec Słupka i kardana dolnego.

## 5. Powieki

**Źródła [F]:**
- Cogley Simplified ([Make](https://makezine.com/projects/simple-animatronic-eyes/)): powieki na osi pochylenia, osobne serwa;
- [EyeMech ε3.2](https://github.com/will-cogley/EyeMech_Epsilon): 4 kanały powiek.

Łącznik z drutu sprężynowego z zagięciami Z na powiece to adaptacja [A] (Fable W7). Dowodem będzie P3.

**Kąty:**
- t = obrót powieki od położenia odniesienia (G: krawędź przednia −9°, D: −11°);
- krawędź przednia G = −9° + t, D = −11° − t;
- G: t od −0,25 (ogranicznik zamknięcia) do 56,75 (ogranicznik otwarcia), praca 0,5…56,0;
- D: t od −0,25 do 32,75, praca 0,5…32,0.

Dokument i skrypt używają tych samych wartości (Astra, drobne).

| | Powieka górna (G) | Powieka dolna (D) |
|---|---|---|
| Czasza | R31,2–33,4, rant R34,7 w pasie 6,5° przy krawędzi przedniej, zakres 99,5° | jak G, zakres 79° |
| Wycięcia tylnej krawędzi | x −2…+24: 83,5°; x −31…−17: 96,5° | x −31…−17: 76° |
| Zaczep J (t = 0) | (−22,0; +25,6; −0,9), płytka 2,4 z otworem Ø1,6, wypust od krawędzi | (−22,0; −25,6; −0,9) |
| Serwo | S_PG: wałek (y 18; z −60), odwrócone, orczyk w −x, płaszczyzna x −30 | S_PD: wałek (y −27; z −49), orczyk w −x, płaszczyzna x −21 |
| Ramię serwa | drukowane r20, 3 × 6 mm, koniec R3, piasta Ø9 | drukowane r17,5, 2 × 5 mm, koniec R2,5, na orczyku fabrycznym |
| Łącznik (yz, między osiami zagięć) | 49,95 | 41,69 |
| Kąt ramienia b przy t −0,25 / 0,5 / praca maks. / ogranicznik | 134,69 / 135,62 / 209,91 / 210,89° | 30,36 / 29,29 / −18,62 / −19,87° |
| dα_serwa/dφ_powieki | 1,22–1,45 | 1,42–1,66 |
| Moment na wale przy 20 N na krawędzi (R33,4) | 0,546 N·m (3,1×) | 0,470 N·m (2,7×) |

### 5.1 Drut sprężynowy Ø1,2

- **Oś drutu:**
  - zagięcia Z z promieniem osi 1,8 (r_i 1,2), 8 odcinków na 90°;
  - nogi 1,9 od ścianek zaczepu i ramienia;
  - G: noga przy J x −25,1, przy H x −26,6 (strona +x ramienia), wykorbienie 1,5 mm na 40 % od J;
  - D: −25,1 / −23,9 (strona −x ramienia), 1,2 mm na 15 %;
  - wykorbienie jako łuk S: dwa łuki R1,8 o kącie 54° (G) / 49° (D);
  - ogony 2 mm wzdłuż nogi.
- **Otwory:** Ø1,6 (drukowane 1,5, przewiercone), luz 0,2/str.
- **Wytrzymałość:**
  - wyboczenie P_kr = 80 N przy L 50;
  - zginanie od wykorbienia przy 38 N: σ ≈ 340 MPa;
  - drut sprężynowy ok. 1500 MPa [Z].
- **Wpięcie po złożeniu** przez odgięcie końca o 3,6 mm (Astra W3):
  - σ = 3·E·δ·c/L² ≈ 520 MPa (G, L 49,95) i **750 MPa (D, L 41,69)**;
  - odginać cały drut od zaczepu, nie sam koniec: przy 30 mm wychodzi 1440 MPa (Fable R5).
  - Drut ocynkowany Ø2,0 wygiąłby się trwale i nie wejdzie w Ø1,6. To uzasadnia drut sprężysty.
- **Przyrząd do gięcia:** płytka z rowkiem R0,6, kołki Ø2,4 (trzpienie M2,5) w osiach zagięć i wykorbienia, długości ±0,3.

### 5.2 Ograniczniki powiek na ramionach serw (Fable W5)

- **Styk:** bok ramienia serwa opiera się o słupek stopu 6 × 6 mm.
  - Słupek wyrasta ze ściany klatki od strony orczyka (G: x −18,8…−32,0; D: −9,8…−22,5) i jest połączony ścianką z klatką.
- **Położenie:** środek słupka 8,5 mm od osi wałka wzdłuż ramienia w położeniu ogranicznika, odsunięty o ½ szer. ramienia + 3 w bok. Bok ramienia dotyka słupka dokładnie na ograniczniku.

| Słupek stopu | środek (x; y; z) | z |
|---|---|---|
| G zamknięcia | (−25,4; 16,3; −49,7) | −54,0…−45,5 |
| G otwarcia | (−25,4; 13,8; −69,5) | −73,6…−65,4 |
| D zamknięcia | (−16,2; −22,4; −40,0) | −44,1…−35,9 |
| D otwarcia | (−16,2; −20,9; −57,1) | −60,9…−53,2 |

- Żaden nie leży w sektorze ±46° od +y przy G. R_xy ≤ 38,0 za końcem rury (obwiednia 39,75).
- **Zapas w pracy:** ramię–słupek 0,03–0,06 mm (0,75° powieki = 0,9–1,1° serwa ≈ 10–12 µs; styk zamierzony).
  - Zamknięcie programowe ustawia kalibracja: dojazd do słupka, cofnięcie o 1,0° serwa.
- **Wytrzymałość:** przy 0,546 N·m na ramieniu i styku na r ≈ 9,4 siła wynosi 58 N.
  - Wspornik 6 × 6 o długości 13 mm: σ = 58·13/36 ≈ **21 MPa**.

### 5.3 Szczelina zamknięcia, kąciki, ucha

- **Szczelina krawędzi przednich na ogranicznikach:** 3° − 2·0,75° = 1,5° (0,82 mm na R31,2).
- **Przycięcie kącików:** δ(x) = max(0; (0,6/ρ(x) − 0,02618)/2) rad, ρ(x) = √(31,2² − x²).

  | x | 21,2 | 25 | 28 | 30 | 31 |
  |---|---|---|---|---|---|
  | δ | 0 | 0,17° | 0,50° | 1,25° | 4,1° |

  Najmniejsza szczelina to 0,60 mm (x 30,9), po luzie osi 0,4 zostaje 0,20 [R].
- **Kołnierz przodu R35,2 (od z 6) – rant powieki R34,7:** 1,02 mm (punkty sfery R34,7 przy z ≥ 6 mają ρ ≤ 34,18).
- **Osie powiek** (DIN 7991 M3×8 w gnieździe stożkowym boku Ramy):
  - stos: bok 3,25 + 0,25 + ucho G 2,4 + 0,25 + ucho D 2,4;
  - koniec śruby 0,55 przed wewnętrzną ścianą ucha D;
  - ruch do środka blokuje łeb, na zewnątrz ścianka otworu w dyni (0,25).
- **Mostek ucha G:** na zewnątrz ucha D, ρ ≥ r ucha D + 0,5; przy x 34 |y| ≤ 16,4.

## 6. Rozruch, NVS i skoki (Astra W4)

**Zapis pozycji:**
- jeden rekord {ψ, θ, t_G, t_D, numer, CRC16} w dwóch przemiennych slotach NVS;
- zapis po zakończeniu każdego ruchu, gdy pozycja się zmieniła i od poprzedniego zapisu minęło ≥ 2 s; przy ruchu ciągłym co 2 s;
- przy starcie czytany jest nowszy poprawny slot.

Zużycie flash przy ruchu co 2 s: 43 200 zapisów na dobę; 5 stron NVS po ok. 126 wpisów daje ok. 70 kasowań strony na dobę, przy wytrzymałości ≥ 10⁵ cykli [Z]. Zapis jest kątów gałki i powiek, a nie µs: pozycja odtwarza się przez kalibrację i IK, więc zmiana kalibracji nie przesuwa startu.

**Start:**
1. Impulsy z IK zapisanego rekordu, wszystkie 4 kanały w jednej ramce.
2. Rampa do celu w przestrzeni (ψ, θ): odcinek z wygładzeniem, krok 20 ms, w każdym kroku IK dla X i Y w tej samej ramce.
3. Powieki rampą we własnym kącie t.
4. Prostokąt pracy jest wypukły, więc tor zadany leży w zakresie „praca”.

**Kiedy rekord nie odpowiada położeniu:**
- zanik prądu w ruchu, do 2 s po ruchu albo ręczne przestawienie.
- Serwa jadą wtedy z różnym postępem.
- **Dowód bez założenia o postępie:**
  - gałka fizycznie nie wyjdzie poza okno, a powieki poza słupki stopu;
  - przemiatanie obejmuje każdy stan w tym zbiorze, każdą kombinację niezależnie;
  - niezależnie od drogi serw mechanizm może więc dotknąć tylko w stykach zamierzonych (okno–Słupek, ramię powieki–słupek stopu), a wszystkie inne pary mają ≥ 0,551 mm (pkt 10).
- Zablokowane serwo na oknie daje ok. 12 N na krawędzi okna (0,177 N·m · 0,5/0,767 / 0,012 m).
- Losowe skoki z v3 (999/1000 w zakresie okna) służą już tylko jako statystyka częstości styku z oknem.

**Podążanie powiek (θ+ = góra):**
- G: otwG + 0,33·θ dla θ > 0 (+47° przy θ +15, brzeg tęczówki Ø27 na +41,7°, zapas 5,3°);
- D: otwD − 0,33·|θ| dla θ < 0 (−43° przy θ −15, zapas 1,3° = 0,75 mm, kalibracja D z dokładnością ≤ 0,5°).

## 7. Ochrona przekładni MG90S (Astra W5, Fable W4)

**Moment wymagany** M_k, czyli największy moment na wale w zakresie pracy przy 0,5 N·m na gałce w dowolnym kierunku (Fable D1) albo 20 N na krawędzi powieki [R, wariant odniesienia]:

| Napęd | M_k [N·m] | × zablokowania 0,177 |
|---|---|---|
| X | 0,767 | 4,3 |
| Y | 0,575 | 3,2 |
| G | 0,546 | 3,1 |
| D | 0,470 | 2,7 |

Po B1 tabelę przelicza `b1_akceptacja.py` (moment zależy od h).

**(a) PWM tylko w ruchu:**
- impuls na czas ruchu + 0,3 s, potem `full off` w PCA9685;
- bez PWM serwo cofa się na tarciu przekładni i nie walczy prądem zablokowania;
- gałka pracuje pod PWM ok. 30 % czasu, powieki ok. 8 %;
- warunek: test „bez PWM” (25 g na 16 mm) przechodzi z zasilaniem i bez.
- **Zależność od E5.5:** Baseus PPAP20K odcina przy małym obciążeniu co ok. 15 s [F, commit c0e1bc0]. (a) wymaga źródła, które trzyma przy samym ESP z AP, albo obciążenia podtrzymującego. Po odcięciu start idzie z rekordu NVS (pkt 6).

**(b) T1 osobno dla każdego napędu** (MG90S w klatce próbki P2, ramię drukowane, waga bagażowa, wskazówka 100 mm):
- **Stopnie:** 0,18 / 0,25 / 0,35 / 0,50 / 0,65 / 0,80 N·m, po 10 s, 5 razy, z PWM; osobno bez PWM (moment cofania).
- **Zaliczenie stopnia:** wzrost luzu ≤ 0,5°, przesunięcie zera ≤ 1°, brak przeskoku. M_bezp = najwyższy zaliczony stopień, jeden dla egzemplarza.
- **Decyzja dla każdego napędu k:**
  - M_bezp ≥ M_k → bez planu B;
  - 0,23 ≤ M_bezp < M_k → sprzęgło k z poślizgiem w przedziale [0,23; M_bezp] (dolna granica = 1,3 × zablokowania, żeby serwo samo nie ślizgało);
  - **M_bezp < 0,23 → przedziału nie ma.** Napęd k zostaje bez ochrony mechanicznej, z (a), a decyzję podejmuje użytkownik (akceptacja ryzyka, inne serwo). To warunek odrzucenia przed drukiem całości.

**(c) Plan B jako próbki:**
1. **Sprzęgło cierne na wkręcie środkowym M2** (Fable; X, Y, G, D):
   - orczyk fabryczny przycięty do tarczy Ø10 z piastą;
   - Ramię z otworem Ø7,2 na piaście orczyka;
   - w pogłębieniu Ø12,5 × 1,0 piasty Ramienia dysk dociskowy PETG Ø12 × 1,0 z otworem Ø2,4, na nim podkładka M2 i łeb wkrętu (łeb w pogłębieniu: przy Y ma 1,8 mm do Ramienia X).
   - Dwie powierzchnie tarcia, pierścień Ø7,2…Ø10, r_ef = 4,34 mm, μ 0,25 [Z].
   - Moment poślizgu = 0,25·F·0,00434·2 = **0,00217·F**: 0,27 N·m przy F = 124 N, czyli wkręt M2 dokręcony ok. 0,05 N·m; nacisk 3,3 MPa.
   - Ustawienie wagą bagażową na kulce M5 (r13: poślizg przy 18–23 N).
   - Po poślizgu potrzebna kalibracja zera przyrządem. PLA pełznie, więc kontrola po 24 h.
2. **Bezpiecznik na kulce M2** (Opus):
   - działa tylko przy sile wypięcia 28–35 N (z B1);
   - siła w pręcie X od własnego zablokowanego serwa to do 23 N w pracy i 32 N w całym zakresie;
   - przy wypięciu 30 N wał X dostaje ≤ 0,39 N·m;
   - wpięcie z powrotem wymaga wyjęcia modułu.

**Prąd (T2, pomiar):**
- egzemplarze Miuzei przy realnym napięciu i okablowaniu: spoczynek, start, 4 napędy, zablokowanie 1 i 2 serw;
- mierzyć napięcie na V+ PCA9685 i restarty ESP;
- reakcja na `brownout`: rampa o połowę wolniej i wpis w dzienniku NVS.

## 8. Montaż

**(S)** = krok syna, bez narzędzi. Narzędzia obsługuje ojciec (O).

**Stół A – Rama z powiekami:**
1. (O) Powieki od tyłu w Ramę (dolna, potem górna), DIN 7991 M3×8 wkrętakiem.
2. (O) Druty gięte na przyrządzie.
3. **(S)** wkręca zagięcie Z każdego drutu w otwór zaczepu J obrotem drutu.
4. **(S)** przykleja zamknięte powieki taśmą do rantu, a druty taśmą do rury (G przy x −25, y ≈ 8; D przy x −25, y ≈ −15).

**Stół B – Płyta z gałką:**
5. (O) Serwa w klatki: M2,5×10 z podkładką Ø6 przez wycięcia uszu do bloków. **(S)** podaje śruby i układa kable: S_X, S_Y, S_PD prosto w tył, S_PG pętlą pod spodem.
6. (O) Słupek na piastę wspornika (DIN 7991 M5×30 od spodu, nakrętka w kieszeni), kardan na trzpień, M4 przez otwór na ±x.
7. (O) Uchwyt na przednią piastę, M5×12, M4. (O) wkręca czopy M2 w piasty do oporu na cokołach.
8. (O) Ramiona X/Y z czopami M5 (kołnierz do oporu na cokole, czop skrócony wg pkt 3.2) na orczyki i na wielowypusty w zerze:
   - program `kalibracja`, 1500 µs, przyrząd zera;
   - najpierw Y, potem X.
9. **(S)** zatrzaskuje pręty na kulkach. Pręty ustawione na przyrządzie 43,71 / 46,18.
10. **(S)** nakłada Gałkę na Uchwyt. (O) 2 × M3×8 od tyłu.
11. (O) Ramiona PG/PD na wielowypusty w położeniu „zamknięte”, bok ramienia przy słupku stopu.

**Złożenie:**
12. **(S)** z ojcem wsuwa Płytę z gałką od tyłu w Ramę, aż słupki Płyty oprą się o ucha Ramy. Gałka (|p| ≤ 30) wchodzi w zamknięte powieki (R31,2).
13. (O) 3 × M3×45 od tyłu tarczy przez słupki w gwint uch Ramy.
14. (O) Dopina druty w ramiona serw. **Wariant zalecany (Fable D4):** od boku, między końcem rury (z −37) a tarczą (z −68,3), zanim moduł trafi do dyni. Zapasowo przez okna tarczy:
    - G: x −35,5…−24,5, y −7…+14;
    - D: x −26…−17, y −21…−6.

    Szczypce, odgięcie całego drutu o 3,6 mm, zagięcie Z w otwór Ø1,6.
15. **(S)** w telefonie przesuwa suwaki. (O) zapisuje µs i ustawia zamknięcie powiek względem słupków stopu.
16. Test 24 h na stole.

**W dyni:**
1. (O) Otwór Ø80.
2. **(S)** wsuwa moduł z zewnątrz do oparcia rantu.
3. (O) Obejma od środka, M3×25 wkrętakiem.
4. **(S)** wpina wtyczki.

Obejma przechodzi nad tyłem modułu: za z −37 wszystko leży w R ≤ 39,75 (najdalej narożnik klatki S_PD R37,8).

**Próbka montażowa P3b (Astra W3):** atrapa tarczy, ramion i Ramy z PLA, oba druty z przyrządu, dopięcie obu wariantów kroku 14 wskazanym narzędziem. Zaliczona, gdy Z wchodzi bez trwałego odkształcenia drutu (porównanie z przyrządem po wyjęciu).

## 9. Mocowanie w dyni

- **Rama:**
  - rant Ø84 (2 mm poza otwór, spód po R150, 8 ząbków);
  - czoło rantu po sferze R152 (`dyniaR` 150 + `rantT` 2: stała grubość 2 nad dynią; decyzja orkiestratora 23.10);
  - rura Ø79,5/75,5 pełna od rantu do z −37, kołnierz przodu R35,2 od z 6 (`kolnierzZ` 6), boki osi powiek 3,25 z gniazdami stożkowymi;
  - 3 ucha wewnętrzne na 100°/200°/310° (R30,5–37,75, z −33…−27, gwint M3 Ø2,5 na 6).
  - Druk tyłem w dół, rant z fazką 45°.
- **Obejma:**
  - PETG, kształt C z uchem, kołnierz Ø96;
  - M3×25 z nakrętką samohamującą w kieszeni, dokręcana wkrętakiem przez wieczko (ojciec);
  - siedzi na rurze w pasie z −5…−35 (ścianka 15–35 mm);
  - dokręcenie powtórzyć po 24 h.
- **Obciążenia [R]:**
  - masa 220 g → 2,2 N;
  - środek ciężkości ok. z −29, moment 0,05 N·m;
  - pchnięcie gałki z boku 20 N na 35 mm daje 0,7 N·m.
- **P5:** wycinek dyni 15 i 35 mm, osiowo ±20 N, 0,7 N·m w 4 kierunkach, pomiar po 24 i 72 h, przed i po dokręceniu, owalizacja rury ≤ 0,2. Kryterium: przesunięcie ≤ 1 mm, obrót ≤ 2°.

## 10. Model kontrolny i przemiatanie (Astra K2, Fable pkt 4)

**Bryły** (`e6model.py`; S = próbki powierzchni albo osi, F = dokładna funkcja odległości):

| Grupa | Bryły |
|---|---|
| Pręt X/Y (ruchome z gałką) | gniazdo M2 (walec Ø7 × 6 wzdłuż czopu M2 pochylonego razem z prętem), trzon M2 Ø5 do 9, nakrętka M2, pręt Ø4,5, końcówka Ø8 × 5, nakrętka M5, trzon M5 Ø8 do 12, gniazdo M5 Ø12 × 10 |
| Ramię X/Y | płytka 6 × 8 (prostopadłościan), mostek 4 mm, gniazdo Ø9 z fazką (4 warstwy o promieniu górnym warstwy – zachowawczo), cokół z kołnierzem, piasta Ø14, czop M5 (walec, długość z pkt 3.2) |
| Gałka i Uchwyt | czasza R28–30 z wycięciami (kliny ≤ 120°, dokładnie), płyta okna (graniastosłup: kontur zewn. z pkt 4, otwór = splajn, wierzchołki co 2° na splajnie), piasty M2 z fazką, kołnierze M2 na cokole, łączniki, nadlewy, kardan górny, tuleja przednia |
| Powieki | czasza z blokami (pasy wycięć, rant), drut z łukami, zaczep (walec), wypust (prostopadłościan 2,4 × 3), ramię serwa (prostopadłościan + koniec R½ szer.), piasta Ø9 |
| Stałe | korpusy MG90S 22,4 × 12,5 (+0,4), klatki (+2 w y i z, bez dna od strony orczyka), uszy na 18–20 nad spodem, łby M2,5 z podkładką Ø6 × 2,5, wieżyczki R6, kable płaskie 3,6 × 1,2 (2 kapsuły R0,6) po trasach z pkt 8, Słupek z tuleją, kardan dolny, piasta i ramiona wspornika 5 × 4, słupki Płyty Ø6, ucha Ramy, tarcza z oknami, słupki stopu 6 × 6, rura (R37,75 do z −37, kołnierz R35,2 od z 6, obwiednia R39,75 za z −37); czoło rantu R152 leży przed kołnierzem i poza zasięgiem części ruchomych (czasze powiek przy z ≥ 6 mają ρ ≤ 34,18) |

**Macierz par:**
- części gałki × stałe;
- pręt X i Ramię X × pręt Y i Ramię Y;
- własne Ramię × własny pręt (obudowa M5 – Ramię);
- pręty × bryły gałki (także własna piasta i płyta);
- bryły gałki × Słupek, kardan, wspornik;
- stałe przy kuli × czasza gałki;
- części powiek × stałe, × kula R30 w dowolnym położeniu, drut × własna czasza;
- czasza powieki × stałe przy czaszy;
- G × D (części × części, części × czasza);
- części gałki × czasze i części obu powiek.

**Wykluczone z definicji:**
- przegub (czop i kołnierz wobec własnej obudowy);
- jedna bryła (czop w gwincie Ramienia);
- Ramię i ramię serwa na wieżyczce własnego serwa;
- wnętrze kardana.

Granica przegubu z kołnierzem i szyjką czopu to wychylenie do oporu z B1.

**Styki zamierzone (osobno):** okno–Słupek (okno.py) i ramię powieki–słupek stopu.

**Zakresy:**
- gałka w siatce 1° wewnątrz granicy okna + 360 położeń na samej granicy;
- powieki co 1° od ogranicznika do ogranicznika;
- wszystkie kombinacje gałka × G × D.

**Dokładność:**
- poniżej 1,5 mm: próbki 0,08 mm na osi kapsuł (błąd ≤ 0,04) i powierzchni walców/prostopadłościanów (promień pokrycia ≤ 0,06), odejmowane od wyniku;
- powyżej 1,5 mm: dolne ograniczenie z kapsuły opisanej;
- zagęszczenie położeń przy 30 najciaśniejszych parach: ±1° co 0,25°, potem ±0,25° co 0,05° (gałka i powieki).
- Rejestr trzyma minimum **każdej pary** z położeniem (Fable D3: koniec etykiet z argmin grupy).

**Wynik dla wariantu odniesienia** (h 7, gniazdo M5 Ø12 × 10, trzon Ø8, gniazdo M2 Ø7 × 6 przy h2 4,0; końcówka Ø8):

**10 najciaśniejszych par, zakres pracy** (gałka ±25/±15, powieki między położeniami programowymi):

| # | Para | mm | Gdzie |
|---|---|---|---|
| 1 | drut G – gałka R30 (dowolne położenie gałki) | **0,617** | G zamknięta (t 0,5) |
| 2 | drut D – ramię wspornika 200° | 0,648 | D t 5,35 |
| 3 | ramię serwa G – rura | 0,690 | G t 6,7 |
| 4 | obudowa M2 X – płyta okna | 0,730 | (25; −15) |
| 5 | obudowa M2 Y – płyta okna | 0,753 | (25; −15) |
| 6 | drut D – gałka R30 | 0,793 | D t 0,5 |
| 7 | pręt Y Ø4,5 – czasza górnej | 0,900 | (−24,25; −7,0), G t 56 |
| 8 | obudowa M2 Y – piasta M2 Y | 0,900 | (25; −14,85) |
| 9 | obudowa M2 X – piasta M2 X | 0,900 | (25; −14,55) |
| 10 | piasta ramienia G – rura | 0,934 | G t 0,5 |

**10 najciaśniejszych par, cały zakres** (gałka do granicy okna, powieki do ograniczników):

| # | Para | mm | Gdzie |
|---|---|---|---|
| 1 | obudowa M2 Y – płyta okna | **0,551** | (23,73; −18,18) |
| 2 | obudowa M2 X – płyta okna | 0,554 | (28,03; −18,02) |
| 3 | drut G – gałka R30 | 0,605 | G na ograniczniku zamknięcia |
| 4 | pręt Y Ø4,5 – czasza górnej | 0,627 | (−28,05; −8,79), G na ograniczniku otwarcia |
| 5 | drut D – ramię wspornika 200° | 0,648 | D t 5,35 |
| 6 | kardan dolny – piasta M2 Y | 0,688 | (0; 18,05) |
| 7 | ramię serwa G – rura | 0,690 | G t 6,7 |
| 8 | Słupek – piasta M2 Y | 0,696 | (0; 18,05) |
| 9 | obudowa M2 Y – piasta M2 Y | 0,778 | (28,03; −18,02) |
| 10 | drut D – gałka R30 | 0,779 | D na ograniczniku zamknięcia |

**Styki zamierzone:**
- okno–Słupek: zapas w pracy 0,560 (pkt 4);
- ramię powieki – słupek stopu: w pracy 0,032–0,063, na ograniczniku 0 (w wyniku −0,06 = promień pokrycia próbek).

**Analitycznie:**
- szczelina krawędzi przednich powiek na ogranicznikach ≥ 0,60 mm (po luzie osi 0,20);
- kołnierz rury (R35,2 od z 6) – rant powieki 1,02;
- gałka – powieki 1,20 (współśrodkowe).

**Poza modelem** (do sprawdzenia w Assembly):
- łby wkrętów orczyków (w pogłębieniach);
- kształt obudów przegubów poza gniazdem i trzonem;
- bloki uszu serw;
- kliny przejść 5° wycięć gałki (model ma więcej materiału);
- ostre krawędzie zamiast fazek (model ma więcej materiału).

Pary stałe–stałe nie są przemiatane, bo projektuje się je bez ruchu.

Wyniki pełne: `przemiatanie.json`, `b1_odniesienie_przemiatanie.json` (te same parametry).

## 11. Narzędzie akceptacji B1 (`b1_akceptacja.py`)

Wejście to plik JSON z pomiarami (wzór `b1_odniesienie.json`):
- **M2 i M5:** średnica kuli; h (środek kuli nad powierzchnią oporową kołnierza); gniazdo obudowy (Ø i wysokość wzdłuż czopu); trzon (Ø i długość od środka kuli do końca obudowy); głębokość gwintu żeńskiego; kąt do oporu; siła wypięcia (M2);
- **dla M5 dodatkowo:** znaczenie „M5” (gwint czy kula), gwint i długość czopu, Ø kołnierza.

Narzędzie wpisuje pomiary do modelu. Serwa zostają w stałych miejscach, a środki kulek M5 przesuwają się o h·d. Liczy pełne przemiatanie i daje **TAK**, gdy:
1. każda para poza stykiem zamierzonym ma ≥ 0,5 mm w całym zakresie (gałka do okna, powieki do ograniczników), w tym gniazdo M5 – własne Ramię i gniazdo M2 – własna piasta. To zastępuje regułę h ≥ R + 0,5 (Fable W1) i obejmuje wychylenie;
2. okno – Słupek ma zapas w pracy ≥ 0,5;
3. własny kąt do oporu przegubu (obudowa o szyjkę czopu, kulka w imadle) ≥ wymagane wychylenie + 2°. Wymagane przy h 7: M5 X 16,9°, Y 18,7°, M2 24,0°;
4. gwint obudowy M5 na szpilce ≥ 5 mm, M2 ≥ 3,5 mm; czop M5 nie dłuższy niż grubość gniazda + dopuszczalne wystawanie.

Wynik to TAK/NIE, lista naruszeń, 10 minimów w pracy i w całości, długości prętów i środki kulek M5 w zerze do CAD.

**Wynik dla wariantu odniesienia** (`b1_odniesienie.json`, wszystkie wymiary obudów [Z]): **TAK**.
- Najmniej w pracy 0,617, w całym zakresie 0,551, okno – Słupek 0,560.
- Wymagane wychylenia: M5 X 16,9°, M5 Y 18,7°, M2 24,0° (założone kąty do oporu 25° / 30° je spełniają).
- Pręty 43,71 / 46,18, kulki M5 w zerze X (29,99; 0; −48,43), Y (21,83; 18,08; −46,67).

**Czułość** (kontrolne przebiegi `--szybko` w trakcie projektu, z tą samą geometrią poza zmienianą wielkością):
- **gniazdo M2:**
  - przy h2 4,0 bez cokołu gniazdo Ø7 × 6 wchodzi w piastę (−0,18 mm);
  - cokół 1 mm pod kołnierzem (część przegubu) daje 0,78;
  - przy gnieździe wyższym niż 6 albo h2 < 4,0 wynik NIE jest prawdopodobny [Z].
- **gniazdo M5:** bez fazki i cokołu gniazdo Ø12 × 10 przy h 7 miało do własnego Ramienia 0,29 mm na ograniczniku. Z fazką 1 × 45° i cokołem 1 mm przechodzi.

Dlatego B1 musi podać wysokość gniazda wzdłuż czopu, a nie tylko średnicę.

## 12. Części i okucia

| Część | Funkcja i wymiary | Druk |
|---|---|---|
| **Rama** | pkt 9 | tyłem w dół |
| **Płyta** | tarcza z −68,3…−71,3 (pełna z oknami G i D; ażur poza strefami ruchu), 4 klatki (bez ścianki nośnej między S_X a S_PD: odstęp korpusów 1,1 mm; klatka S_Y bez dna od strony −x, bo drut G przechodzi 1,3 mm od korpusu), bloki uszu z wkładką albo gwintem M2,5, słupki stopu 6 × 6, 3 słupki R33 Ø6 do z −33, piasta wspornika z gniazdem stożkowym M5 i spłaszczeniem, ramiona 5 × 4 na 100°/200°/310° (z −37…−33), kanały kabli | tarczą w dół |
| **Słupek** | pkt 3.1 | pionowo |
| **Uchwyt** | płyta okna (pkt 4) z żebrem mostka X, piasty M2 z cokołem i fazką, łączniki, tuleja przednia, kieszeń M5, łuki do nadlewów | płytą w dół |
| **Gałka** | pkt 2, nadlewy M3 Ø7 (dno ≥ 0,6 przed frontem) | krawędzią tylną w dół; P6 (wnętrze o nawisie > 45° od Ø39,6), w razie potrzeby podpory drzewiaste tylko od środka |
| **Powieka górna / dolna** | pkt 5 | płaszczyzną krawędzi przedniej na stół, podpory od strony wklęsłej opisane w README |
| **Ramię X / Y** | pkt 3.2 | płasko |
| **Ramię PG / PD** | r20 / r17,5, otwór Ø1,6, kieszeń orczyka | płasko |
| **Pręt X / Y** | pkt 3.3 | pionowo, końcówką na stole |
| **Obejma** | pkt 9 | kołnierzem w dół |
| *Przyrządy* | zera gałki (czapka w rancie), długości prętów 43,71 / 46,18, do gięcia drutów | |

**Z warsztatu:**
- 4 × MG90S, kardan 5/5, przeguby 2 × M2 i 2 × M5, drut sprężynowy Ø1,2 (2 × ok. 60 mm);
- DIN 7991 M3×8 × 2, DIN 7991 M5×30 + nakrętka, M5×12 + nakrętka, 2 × M5×20 bez łba (szpilki) + 2 nakrętki M5;
- 2 × M2×10 bez łba + 2 nakrętki M2;
- 2 × M4 bez łba (docięte);
- 8 × M2,5×10 z podkładką Ø6;
- 3 × M3×45, 2 × M3×8, M3×25 z nakrętką samohamującą.

Łożyska 608-2RS i 6802-2RS nie dają przewagi: ucha 2,4 i bok 3,25 nie pomieszczą B 5–7.

## 13. Zmienne (Variable Studio) i test zginania K9

**Gałka i dynia:**
- `kulaD` 60, `kulaRin` 28, `kulaRim` 115;
- `rimX` 104 (φ 0, ±25), `rimY` 106 (φ 80, ±35);
- `glebokoscSrodka` 10, `otworD` 80, `obwiedniaR` 39,75, `rantD` 84, `dyniaR` 150, `rantT` 2 (czoło rantu po sferze R152), `kolnierzR` 35,2, `kolnierzZ` 6.

**Napęd:**
- `pktR` 19,5, `pktZ` −6;
- `walX` (y −13; z −49), `walY` (y 3; z −49), `ramieX_x` 18,013, `ramieY_x` 10,229 (płaszczyzny orczyków);
- `orczykX` 13, `orczykY` 15, `ramieT` 6, `ramieW` 8, `ramieHubR` 7;
- `gniazdoM5R` 4,5, `fazaGniazdaM5` 1, `cokolM5` 1 / Ø8, `mostekObnizenie` 2;
- `kulkaM5H` 7 (B1), `czopX` 4,7°, `czopY` 19,5°, `ogonCzopuX` 0, `ogonCzopuY` 0,5;
- `pretD` 4,5, `koncowkaM5D` 8, `koncowkaM5L` 5;
- `piastaM2R` 3, `fazaPiastyM2` 0,75, `cokolM2` 1 / Ø4, `kulkaM2H` 4 (B1).

**Okno:**
- `oknoZ` −6, `plytaOknaT` 3, `zapasOgr` 3;
- `okno_r0`…`okno_r90` co 5° (pkt 4), `plytaR_wezly` (pkt 4);
- `slupekR` 7,65, `slupekZ0` −33, `slupekZ1` −5,5.

**Powieki:**
- `luzPowieka` 1,2, `scPowieki` 2,2, `rantPowieki` 3,5 / 6,5°;
- `zakresG` 99,5, `zakresD` 79;
- `wyciecieG` 83,5 (x −2…24), `wyciecieZaczepG` 96,5, `wyciecieZaczepD` 76 (x −31…−17);
- `zamkG` −8,5, `zamkD` −11,5, `otwG` 42, `otwD` −38, `podazanie` 5, `zapasZamk` 0,75, `zapasOtw` 0,75, `szczelinaZamk` 3, `gMinKacik` 0,6;
- `zaczepX` −22, `zaczepRho` 25,6;
- `ramieG` 20 × 3 × 6, `ramieD` 17,5 × 2 × 5;
- `walPG` (−30; 18; −60), `walPD` (−21; −27; −49);
- `lacznikG` 49,95, `lacznikD` 41,69;
- `drutD` 1,2, `riDrutu` 1,2, `otworDrutu` 1,6;
- `slupekStopuA` 6, `slupekStopuRho` 8,5.

**Rama i Płyta:**
- `zArmWsp` −35 (z −37…−33), kąty 100/200/310, `slupekPlytyR` 33;
- `uchoRamy` R30,5–37,75, z −33…−27;
- `tarczaZ` −71,3…−68,3, okna tarczy (pkt 8).

**MG90S** [F, e6-pomiary.md]:
- korpus 22,4 × 12,5 × 22,8, czubek wałka 35 nad spodem;
- uszy 31,8 / rozstaw 27,7 / gr. 2 / 18 nad spodem, otwarte wycięcia;
- kabel po stronie przeciwnej do wałka.

**K9, oczekiwane efekty:**

| Zmienna (zakres) | Oczekiwany efekt |
|---|---|
| `kulkaM5H` 7 ↔ 6 | kulki M5 w x −1,0 (X) / −0,94 (Y), pręty 43,71 → 43,58 i 46,18 → 46,06; korpusy serw bez zmian |
| `pktR` 19,5 ↔ 19,0 | kulki M2 o 0,5 do środka, piasty i wycięcia płyty za nimi |
| `zapasOgr` 3 ↔ 2,5 | okno r −0,2…−0,3; zapas w pracy 0,56 → ok. 0,45 (ma pokazać zmianę, nie zaliczenie) |
| `wyciecieG` 83,5 ↔ 85,5 | krawędź tylna 75° → 77° |
| `zSerw` −49 ↔ −48 | serwa X/Y/PD +1 w z; dalej ucha serw wchodzą w ramiona wspornika (z −37), więc rezerwy z nie ma |

Dla każdej zmiany: featureStates = OK, wymiar bryły zgodny z oczekiwanym, powrót do wartości. Po zmianach geometrii trzeba powtórzyć `przemiatanie.py`.

## 14. Elektronika i firmware

- **Kanały:** 12 = X, 13 = Y, 14 = powieka górna, 15 = dolna; małe oczy 0–11.
- **Zasilanie:** decyzja 20.10, powerbank przez USB-C; źródło rozstrzyga E5.5.
- **Podtrzymanie:** z GPIO ESP przez tranzystor.
- **Kinematyka:** IK prętów wzorem z pkt 3.2. Powieki: tablica t → µs (16 punktów) z kalibracji, z zamknięciem względem słupków stopu.
- **Moment roboczy:** ok. 0,007–0,008 N·m na napęd (zapas 11–15× do zablokowania).

## 15. Ryzyka i próbki

| # | Miejsce | Test i kryterium |
|---|---|---|
| 1 | Przekładnie (do 4,3 × zablokowania) | **T1** dla każdego napędu (pkt 7b), decyzja o planie B przed drukiem całości |
| 2 | Przeguby z warsztatu | **B1 → `b1_akceptacja.py`**, potem **P4**: kulka M2 na wydrukowanej piaście z cokołem i M5 na wydrukowanym Ramieniu przy kącie wymaganym + 2°; wypięcie wagą bagażową; gwint M5 w końcówce Ø8 nacięty bez pęknięcia; długość pręta po 1000 cyklach |
| 3 | Druty i zaczepy | **P3** (1000 mrugnięć: wędrówka osi ≤ 0,2, szczelina w kącikach ≥ 0,5, siła przycięcia w 3 miejscach) i **P3b** (montaż Z) |
| 4 | Okno i Słupek | **P1**: zakres mechaniczny 28,0–28,25° / 18,0–18,25°, szczelinomierz 0,5 przy ±25/±15, dostęp klucza M4 |
| 5 | Obejma | **P5** (pkt 9) |
| 6 | Głębokość | **B5** |
| — | Prąd | **T2** |
| — | Gałka | **P6**: czasza 20 mm od szczytu |

## 16. Pytania blokujące

| # | Pytanie | Warunek przyjęcia |
|---|---|---|
| **B1** (pręty, Ramiona X/Y, piasty M2, wycięcia płyty, przyrząd długości) | Pomiary obu przegubów jak w pkt 11. Wpisać do kopii `b1_odniesienie.json` i uruchomić `b1_akceptacja.py` | **TAK narzędzia.** Przy NIE narzędzie podaje parę i położenie. Dźwignie: cokół wyższy (M2, M5), `pktR`, `kulkaM5H` przez podkładkę, przeliczenie układu serw |
| **B2** (Słupek) | Potwierdzić zdjęciem „M4 równolegle do sworznia” (e6-pomiary.md, pewność średnia) | prostopadle → kardan obrócony o 90°, R = Ry(ψ)·Rx(−θ), okno i przemiatanie od nowa (zmiana `Reye` w `e6model.py`); M4 i tak na ±x |
| **B4** (klatki) | Uszy MG90S to otwarte wycięcia: szerokość i głębokość wycięcia, strona i wysokość wyjścia kabla (zdjęcie), wysokość wieżyczki | M2,5 z podkładką Ø6 przy wycięciu ≥ 2,7; węższe → M2 z podkładką Ø5; kabel od strony wałka → `kabelStrona: "walek"` i powtórka przemiatania |
| **B5** (Płyta) | Wolna głębokość za wewnętrzną ścianką na wysokości oka (w, g) | wolne ≥ 73,63 + g − w + 2. Przy g 10, w 15: ≥ 70,6. Mniej → **zmniejszyć g** (oko bardziej wystaje) albo S_PG do przodu (`zSerwPG` −60 → −56, nowy czworobok G) – oba z powtórką przemiatania |
| B6 | Gałka wystaje 20 mm, zamknięte powieki 25 mm – OK? | karton Ø84 na dyni |
| B7 | Rozstaw: najbliższe małe oko ≥ 117 mm z prawej i ≥ 136 z lewej (po łuku R150). Czy „3–4 z każdej strony” może iść na boki dyni? | |
| B8 | Obejma z PETG, dokręcana wkrętakiem przez wieczko | |

## 17. Uwagi z weryfikacji v3 → co zrobiono

**Astra**

| ID | Uwaga | Co zrobiono |
|---|---|---|
| K1 | Okno z niepełnych przekrojów (brak przecięć z płaszczyznami płyty), tabela ≠ CAD | Dokładne krzywe brzegowe przekroju przez całą grubość, Słupek z tuleją i kardan; tabela co 5°; kontrole na splajnie z tabeli; zakres mechaniczny, pas styku i M4 przeliczone (pkt 4); otwór M4 tylko zmniejsza bryłę, więc okno z pełnego walca jest zachowawcze |
| K2 | Przemiatanie nie obejmuje deklarowanej geometrii, pole odległości zawyża | Nowy model: dokładne odległości (sprawdzone na gęstej siatce, błąd ≤ 0,03 na bezpieczną stronę), łuki drutu, płyta okna, piasty, łączniki, słupki stopu, ramiona 5 × 4 jako prostopadłościany, kable płaskie, łby śrub uszu; macierz par; jedna granica ruchu; minimum każdej pary (pkt 10) |
| W1 | B1 dopuszcza warianty bez luzu | Akceptacja wyłącznie przez przeliczenie kompletu (`b1_akceptacja.py`), ≥ 0,5 poza stykiem zamierzonym, obudowy jako gniazdo + trzon z pomiaru |
| W2 | Czop pochylony, pręt pogrubiony | Gniazdo Ø9 wzdłuż czopu z cokołem i fazką, długości czopów X 7,0 (zlicowany) / Y 7,8 (≤ 0,5 wystawania), pręt Ø4,5 z końcówką Ø8 drukowany pionowo, ścianka i naprężenie policzone (pkt 3.2–3.3) |
| W3 | Dopięcie Z bez dowodu | Wariant od boku przed włożeniem do dyni, P3b z kryterium, naprężenia obu drutów (520 / 750 MPa) i reguła „odginać cały drut” |
| W4 | NVS i rozruch | Rekord pozycji z CRC w dwóch slotach, zapis po ruchu (≥ 2 s), kąty zamiast µs; dowód bez założenia o postępie serw (pkt 6) |
| W5 | T1 i plan B nie domykają ochrony | M_k dla każdego napędu, decyzja dla każdego napędu, przypadek „brak przedziału” jako warunek odrzucenia, sprzęgło z wymiarami i dociskiem (pkt 7) |
| W6 | Znak B5 | wolne ≥ 73,63 + g − w + 2; zmniejszyć g albo przesunąć S_PG (pkt 16) |
| Drobne | 56,25/56,75; Słupek −41/−33; v3 odsyła do v2; brak `refine_pts.json` | Jedna definicja kąta t (pkt 5); Słupek −33…−5,5 wszędzie; v3.1 samowystarczalna; zagęszczenie wewnątrz `przemiatanie.py`, `odtworz.sh` odtwarza wszystko |

**Fable**

| ID | Uwaga | Co zrobiono |
|---|---|---|
| W1 | h 4 / Ø14 niemożliwe, B1 h ≥ R + 0,5 | Wariant odniesienia h 7 / Ø12 (decyzja orkiestratora); styk obudowy z własnym gniazdem liczony w modelu, zamiast reguły |
| W2 | Styki niezamierzone na ogranicznikach (końcówka Ø9, ramię piasty M2) | Końcówka Ø8 (rachunek ścianki pkt 3.3); piasta X bez ramienia, siedzi na płycie; wynik pkt 10 |
| W3 | Okno co 15° | Co 5°, splajn = kontrola (pkt 4) |
| W4 | B4 i klatki wg e6-pomiary.md | Uszy jako wycięcia z podkładką, kable po stronie przeciwnej do wałka, trasa S_PG w przemiataniu, B4 przeformułowane |
| W5 | Słupki stopu | 6 × 6 przy ściance, położenia i siły (pkt 5.2), w przemiataniu |
| D1 | moment z dowolnego kierunku | M_k z dowolnego kierunku (pkt 7) |
| D2 | czop M5 bez kontry | kołnierz do oporu na cokole, kontrola po 24 h |
| D3 | etykiety argmin | rejestr na parę |
| D4 | dopięcie od boku | wariant zalecany |
| D5 | wycięcie X widoczne | opisane (pkt 3.4) |
| D6 | `lid_d` | dokładna odległość |
| D7 | 4 × 4 / 5 × 4 | 5 × 4 wszędzie |
| D8 | klatka S_Y bez dna | wpisane (pkt 12) |
| D9 | B2 odpowiedziane | B2 tylko do potwierdzenia zdjęciem |

## Werdykt

V3.1 jest gotowa do weryfikacji modelu kontrolnego i do briefu CAD etapu 2. Pręty, Ramiona X/Y, piasty M2 i wycięcia płyty CAD rysuje dopiero po tym, jak pomiary B1 przejdą przez `b1_akceptacja.py`, a klatki po B4.
- **Wariant odniesienia przy założonych obudowach:**
  - wszystkie pary niezamierzone ≥ 0,55 mm w całym zakresie;
  - okno – Słupek 0,56 w pracy;
  - styk ze Słupkiem 1,37 mm od otworu M4.

**Najsłabszy punkt:** obudowy przegubów z warsztatu są nadal założone, a styk gniazda obudowy z własnym gniazdem czopu i z piastą M2 jest najbardziej czuły na ich wymiary. Drugi w kolejności: przekładnie MG90S do wyniku T1 (do 4,3 × momentu zablokowania na X).

---

## Załącznik: odtworzenie

```
cd 40-cad/narzedzia/e6-przemiatanie
./odtworz.sh          # okno.py → przemiatanie.py → b1_akceptacja.py b1_odniesienie.json
```

Python 3 + numpy, 10 rdzeni. Wyniki: `okno.json`, `okno_splajn.npy`, `przemiatanie.json` (każda para: minimum w pracy i w całym zakresie z położeniem), `b1_odniesienie_wynik.json`.

`--szybko` daje siatkę 2° do szybkiej kontroli. Wynik obowiązujący liczy się bez tej opcji.
