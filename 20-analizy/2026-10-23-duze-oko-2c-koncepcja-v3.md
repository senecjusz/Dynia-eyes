# Duże oko 2c – koncepcja v3 (E6.1c, 23.10)

Autor: Opus (realizator v1/v2). Wykonuję brief `30-projekt/brief-e6-duze-oko-koncepcja-v3.md` po drugiej rundzie review (Astra NIE, Fable i Opus TAK PO POPRAWKACH). V3 jest pełna: wykonawca CAD czyta tylko ją. Architektura z v2 zostaje bez zmian. Poprawiam geometrię i dokładam przemiatanie na pełnym modelu. W repo zapisałem tylko ten plik. Bez prognoz czasu i bez zakupów modelarskich.

Oznaczenia: **[F]** fakt (źródło, pomiar, plik), **[R]** rachunek (skrypty w zał. B), **[Z]** założenie, **[A]** własna adaptacja, niesprawdzona.

**Układ współrzędnych (zmiana znaku θ względem v2):**
- O = środek kuli i krzyżaka kardana; **+z** z dyni na zewnątrz, **+y** w górę, **+x** w prawo patrząc na dynię z zewnątrz;
- ψ dodatnie = spojrzenie w prawo (+x), **θ dodatnie = spojrzenie w górę**;
- obrót gałki R = Rx(−θ)·Ry(ψ), czyli oś pochylenia (x) zewnętrzna i nieruchoma (Astra W4, Opus D1, Fable: w v2 θ+ oznaczało dół).

## 0. Wynik

1. **Architektura bez zmian:**
   - gałka Ø60 na kardanie 5/5;
   - pręty S–S z kulką M2 przy gałce i M5 przy orczyku;
   - 4 × MG90S;
   - dwa czworoboki powiek z łącznikiem z drutu sprężynowego Ø1,2;
   - oś powiek wspólna z osią θ, Obejma.
2. **Przemiatanie pełnego modelu** obejmuje:
   - pręty w rzeczywistym przekroju z obudowami M2/M5, nakrętkami i końcówką Ø9;
   - ramiona 6 × 8, druty z zagięciami Z o r_i 1,2 i ogonami;
   - klatki serw z uszami, wieżyczkami i kablami, płytę okna i piasty Uchwytu;
   - słupki i wspornik Płyty, ucha Ramy.

   Liczę odległości do całych odcinków i powierzchni, na siatce 1° i 0,25° przy minimach. Wynik przy wysokości kulki M5 h = 4:
   - **zakres pracy: najmniej 0,52 mm** (okno – Słupek), wśród par ruchomych 0,61 mm;
   - **zakres ograniczników: najmniej 0,31 mm**. Poza zamierzonymi stykami okno–Słupek i ramię powieki–ogranicznik nic się nie dotyka.
3. **Ogranicznik gałki** (płyta okna 3 mm, Słupek do końca):
   - okno o kształcie biegunowym r(φ) = 10,42…13,69;
   - zapas w pracy 0,52 mm przy granicy 3° za pracą;
   - rzeczywisty zakres mechaniczny ψ ±28,2°, θ ±18,2°;
   - styk na Słupku na z −10,2…−13,8, a otwór M4 na ±x ma do niego 1,3 mm.
4. **Montaż jest wykonalny:**
   - wspornik Słupka jest w Płycie;
   - gałka przyjeżdża z Płytą od tyłu w zamknięte powieki;
   - druty, wpięte wcześniej w powieki, dopina się sprężynując zagięcie Z w ramię serwa przez okna tarczy;
   - ograniczniki powiek są na ramionach serw.
5. **Rozruch:**
   - rampa liczona w (ψ, θ) z kinematyką odwrotną w postaci zamkniętej, X i Y jednocześnie;
   - tor mieści się w sprawdzonym zakresie pracy;
   - przy skoku po zaniku prądu tor serw zostaje w zakresie okna (997–999 na 1000 losowych torów), a pozostałe kończą się oparciem gałki o Słupek.
6. **Przekładnie:**
   - (a) PWM tylko w ruchu;
   - (b) stopniowany T1 przed drukiem całości;
   - (c) plan B jako próbka: sprzęgło cierne na wkręcie orczyka, ustawiane na 0,23–0,30 N·m, albo bezpiecznik na kulce M2 po pomiarze siły wypięcia.

   Liczby w pkt 7.
7. **Najsłabszy punkt:** wszystko, co zależy od nieznanych wymiarów przegubów (B1).
   - Przy h = 7 i obudowie M5 Ø14 obudowy X i Y nachodzą na siebie w narożniku ograniczników (−0,63 mm).
   - Przy obudowie Ø12 przechodzi (0,16 mm na ogranicznikach).

## 1. Co zmieniłem względem v2

| Obszar | v2 | v3 | Dlaczego |
|---|---|---|---|
| Znak θ | θ+ = dół (R = Rx(θ)Ry(ψ)) | θ+ = góra (R = Rx(−θ)Ry(ψ)), znaki serw i podążanie powiek od nowa | Astra W4, Opus D1 |
| Punkty P | (18; 0; −6), (0; 18; −6) | **pktR 19,5**: (19,5; 0; −6), (0; 19,5; −6) | płyta okna – obudowa M2 ≥ 0,5 (Fable W5, Opus K1) |
| Kulki M5 | ∥ x, nakrętka po stronie serwa | **czop pochylony ⊥ do średniego kierunku pręta** (X 4,7°, Y 19,5° od x ku +z), wkręcony w Ramię 6 mm z gwintem M5, **bez nakrętki od strony serwa** | Fable K1, W2; Opus K2 |
| Położenie serw X/Y | ramieX_x 19, ramieY_x 8 | środek kulki M5 w zerze jako punkt odniesienia: X (27; 0; −48,67), Y (19; 18,05; −47,67); płaszczyzna orczyka X 18,0, Y 10,2 (S_Y o +2,2 w x) | rozwiązuje K1 Fable/K2 Opus i W1 Fable (drut G – S_Y) |
| Pręty | Ø6 z gwintem M5 (ścianka 0,5) | pręt Ø5 z płaską stroną, końcówka **Ø9 × 5** z gwintem M5, szpilka stalowa M5, nakrętki kontrujące | Astra K4, Fable W2, Opus W6.5 |
| Wycięcia gałki | brak | krawędź czaszy lokalnie: φ 0° ±25° do 104°, φ 80° ±30° do 106° (zamiast 115°) | Opus K1 |
| Wycięcie powieki górnej | 80° w pasie x 0…13 | **75° w pasie x −2…+24** (przy zamknięciu nominalnym) | Astra K1, Opus K1 |
| Ogranicznik gałki | elipsa 12,04 × 11,04 na ±27/±17 | okno biegunowe z pełnych brył na ±28/±18, płyta 3 mm | Astra K2, Opus W1 |
| Ograniczniki powiek | wypusty Ramy, 0,5° | **zęby na ramionach serw** o słupki klatki; 0,75° za zamknięciem i za otwarciem z podążaniem | Fable K2, Opus K3, W3 |
| Wspornik Słupka | w Ramie (250°, 290°) | **w Płycie**: piasta + 3 ramiona 100°/200°/310° na z −37…−33, słupki Płyty R33 do z −33, ucha Ramy na tych samych kątach z −33…−27 | Fable K2, Opus K3 |
| Druty powiek | ±1,2 w x, ogony poza modelem, wykorbienie 10 mm | strony nóg dobrane tak, że wykorbienie G = 1,5 mm, D = 1,2 mm; r_i 1,2; ogony 2 mm stycznie; otwory Ø1,6 | Opus W2, Astra W2, Fable W1 |
| Kable | „po zewnętrznej stronie klatki” | kanał po czołach korpusów do x 0, szczelina S_X–S_Y (y −5), potem do tyłu; S_PG prosto w tył | Opus W2, Fable W4 |
| Osie powiek | DIN 913 M3×8 | **DIN 7991 M3×8** (łeb stożkowy w gnieździe boku): ruch do środka zablokowany łbem, na zewnątrz – ścianką otworu w dyni | Astra W3, Opus O-W4 |
| Uszy MG90S | M3×10 | **M2,5×10** w otworze Ø2,1, wybór po B4 | Fable W6, Opus W7 |
| Tarcza Płyty | pełna | ażurowa, z oknami na ramię i druty obu powiek | Fable W3, Opus W5 |

## 2. Wymiary i miejsce

| Wielkość | Wartość | Status |
|---|---|---|
| Gałka | Ø60, ścianka 2 (R28–30), krawędź 115° od osi, lokalne wycięcia (pkt 3.4); biała, front gładki | [F] decyzje 22.10 |
| Zakres | praca ψ ±25°, θ ±15°; okno ustawione na ±28°/±18° (`zapasOgr` 3°), rzeczywisty zakres mechaniczny ±28,2°/±18,2° | [R] pkt 4 |
| Powieka górna (kąt krawędzi przedniej od +z ku +y) | zamknięta −8,5°, otwarta +42°, z podążaniem +47°; ograniczniki −9,25° i +47,75° | [R] |
| Powieka dolna | zamknięta −11,5°, otwarta −38°, z podążaniem −43°; ograniczniki −10,75° i −43,75° | [R] |
| Szczelina zamknięcia | 3° nominalnie (1,6 mm na R31,2), 1,5° na ogranicznikach (0,82 mm) | Opus W3 |
| Środek kuli za powierzchnią dyni | 10 mm (`glebokoscSrodka`) | [Z], karton (B6 z v2) |
| Obwiednia przejścia | walec Ø79,5 od z +10 do z −73,3 (koniec ramienia G); poza nim tylko rant Ø84 | [R] |
| Głębokość za zewnętrzną powierzchnią | **83,3 mm**, za wewnętrzną ścianką 68,3 przy w 15; kable wychodzą bokiem przed tarczą, nie przez nią | [R], B5 |
| Masa | ok. 225 g ±20 %, po odchudzeniu tarczy ok. 217 g; cel 130–150 g jest nieosiągalny przy 4 MG90S (części kupne 103 g) | [R], Astra W6, Opus D2 |

## 3. Napęd gałki

### 3.1 Kardan 5/5 i Słupek

- **Źródła [F]:**
  - Cogley, [Eye Mechanism on the Cheap](https://www.instructables.com/3D-Printed-Animatronic-Eye-Mechanism-on-the-Cheap/);
  - zasada środka oka na krzyżaku: [Stan Winston School](https://forums.stanwinstonschool.com/discussion/comment/6206).
- **Pomiar [F]:** Ø11 × 25,5, krzyżak 12,75 od czoła, otwory Ø5 głębokości 7, wkręty M4 9,1 od osi sworznia, zgięcie > 90°.
- **Tylna piasta** (z −12,75…−5,75) w kieszeni Słupka Ø11,3 (0,15/str.).
  - Trzpień: **DIN 7991 M5×30 (łeb stożkowy) od spodu piasty wspornika**, łeb w gnieździe stożkowym piasty (z −37…−34,2).
    - Łeb walcowy DIN 912 pod piastą (z −37…−42) wszedłby w klatkę S_Y (przód klatki z −41,1) i w kanał kabli na z −41,9.
  - Nakrętka M5 siedzi w kieszeni Słupka na z −20…−16. Koniec śruby wchodzi w otwór kardana na 5,75 mm (z −12,75…−7,0).
  - Rachunek długości: spód piasty z −37 + 30 → koniec na z −7,0, czyli 1,25 mm przed dnem otworu (−5,75). Wkręt M4 (z −9,1) trafia w trzpień.
- **M4 tylnej piasty:** M4 bez łba dłuższy niż fabryczny (z v2, W8), przez otwór Ø4,2 w ściance Słupka (z −11,2…−7,0) do gwintu piasty.
  - **Otwór musi leżeć na ±x** (azymut 0° albo 180°), bo tam styk okna jest najniżej (pkt 4).
  - Na ±y otwór wszedłby w pas styku. Wymaga to pytania B2.
- **Blokada obrotu Słupka** (Opus W6.4): spód Słupka ze spłaszczeniem 0,6 mm w kieszeni piasty wspornika. Moment 0,5 N·m wokół z idzie kształtem, nie tarciem.
- **Przednia piasta** (z +5,75…+12,75): kieszeń Uchwytu Ø11,3 od z_b +6,3, a nie +5,5.
  - Przy z_b +5,5 nieruchome ucha dolnej połówki kardana sięgają r 5,78 > 5,65 [R].
  - Mocowanie: M5×12 z nakrętką w kieszeni Uchwytu i M4 przez ściankę.
- **Kąt kardana:** do 33° na ogranicznikach (zgięcie > 90°, zapas duży).

### 3.2 Pręty S–S i ramiona

**Źródło [F]:** Cogley, [DIY Compact](https://www.instructables.com/DIY-Compact-3D-Printed-Animatronic-Eye-Mechanism/) (MG90S, popychacze na przegubach kulowych M2). Przegub kulowy na obu końcach to moja adaptacja [A] na przegubach z warsztatu.

| Element | X (ψ) | Y (θ) |
|---|---|---|
| Kulka M2 na Uchwycie (P w zerze) | (19,5; 0; −6), czop ∥ y gałki, piasta po stronie −y | (0; 19,5; −6), czop ∥ y gałki, piasta do środka |
| Serwo | S_X: wałek (y −13; z −49), oś ∥ x, orczyk w stronę +x, płaszczyzna orczyka x 18,0 | S_Y: wałek (y 3; z −49), płaszczyzna orczyka x 10,2 |
| Ramię | r13, w zerze w +y, 6 mm (x 17,0…23,0), szer. 8 | r15, w zerze w +y, x 9,2…15,2 |
| Czop M5 (kierunek, w zerze) | (0,997; 0; 0,081), 4,7° od x ku +z | (0,943; 0,012; 0,334), 19,5° |
| Środek kulki M5 w zerze (h 4) | (27,00; 0; −48,67) | (19,00; 18,05; −47,67) |
| Długość pręta (środki kulek) | **43,33** | **45,82** |
| Zakres serwa: praca / zakres okna | −30,5…+43,5° / −33,5…+52,8° | −20,7…+29,9° / −24,7…+37,2° |
| Wychylenie kulki M5 (praca / ograniczniki) | 11,9 / 13,0° | 11,6 / 13,7° |
| Wychylenie kulki M2 | 20,8 / **24,9°** | 19,2 / 23,1° |
| Kąt nacisku przy orczyku | 51,3 / 62,0° | 48,9 / 56,2° |
| Moment na wale przy 0,5 N·m na gałce (macierz pełna) | **0,614 N·m** | 0,495 N·m |
| Siła w pręcie: zablokowane serwo 0,177 N·m / ręka 0,5 N·m | 22 / 59 N (praca), 29 N przy ogranicznikach | 18 / 40 N |

**Pochylony czop** ustawia wychylenie kulki M5 na 12–14° przy h 4. Przy h 7 jest to 17–19°, bo przy stałych serwach kulka przesuwa się w x (Fable W2). Czop wkręca się w gwint M5 w Ramieniu 6 mm, a wolny koniec gwintu ≤ 6 mm skracam szlifierką. Od strony serwa nie ma nakrętki ani końca śruby:
- Ramię Y kończy się na x 9,2;
- korpus S_PG kończy się na x 4,0;
- obudowa M5 Y ma do klatki S_PG 2,3 mm [R].

**Ramię X/Y** to drukowana płytka 6 mm z gniazdem pochylonym o kąt czopu. Od spodu ma kieszeń na jednoramienny orczyk fabryczny (1,6 mm). Mocowanie:
- wkręt środkowy serwa M2 przez otwór Ø4,5 w Ramieniu;
- dwa wkręty M2 przez otwory orczyka rozwiercone do Ø1,6.

Kolejność mocowania:
- najpierw Ramię Y, potem X: wkrętak do wkrętu Y przechodzi przez miejsce Ramienia X (Opus W6.7);
- przy zmianie zęba Y zdejmuje się X.

**Druga gałąź kinematyki** (Astra W7) to Ramię odchylone o 143,5° (X) albo 127,9° (Y) od +y. Montaż z przyrządem zera wyklucza ją, bo w zerze ramię wskazuje w górę na znacznik klatki.

**Kinematyka odwrotna (firmware, wzór zamknięty) [R]:** dla serwa k ∈ {X, Y}:
- q = P − C,
- K = (|w|² + |q|² − L²)/2,
- A = q_y w_y + q_z w_z,
- B = q_z w_y − q_y w_z,
- **α = atan2(B, A) − acos((K − q_x w_x)/√(A² + B²))** (gałąź „−”, w zerze α = 0).

P to punkt kulki M2 = R(ψ, θ)·P0. Stałe dla h 4:

| | C (środek na powierzchni Ramienia) | w = r·ŷ + h·d | L |
|---|---|---|---|
| X | (23,013; −13,000; −49,000) | (3,987; 13,000; 0,326) | 43,328 |
| Y | (15,229; 3,000; −49,000) | (3,771; 15,047; 1,334) | 45,817 |

Błąd wzoru względem rozwiązania numerycznego w całym zakresie: < 10⁻¹³ rad. Kąt α to obrót wokół +x według reguły prawej dłoni; α = 0 oznacza ramię w +y.

**Znaki:**
- ψ +25 → serwo X −30,5° (koniec ramienia idzie do tyłu, −z);
- θ +15 → serwo Y −18,6°;
- sprzężenie: ψ +25 daje Y +7,0°, θ ±15 daje X +1,0°.

Tabela narożników:

| (ψ; θ) | X | Y |
|---|---|---|
| (+25; +15) | −28,1 | −11,7 |
| (+25; −15) | −27,0 | +29,9 |
| (−25; +15) | +43,3 | −20,6 |
| (−25; −15) | +42,4 | +19,1 |

Kierunek µs ustala kalibracja (flaga znaku w NVS).

### 3.3 Zakończenia prętów (Astra K4, Fable W2, Opus W6.5)

Pręt od kulki M2 do kulki M5:

| Odcinek (od środka kulki M2) | Długość | Przekrój | Uwagi |
|---|---|---|---|
| obudowa M2 (zakres od −1) | 9 [Z, B1] | Ø7 | gwint żeński M2 obudowy |
| nakrętka kontrująca M2 | 1,6 | Ø4,6 (r opisane) | blokada długości |
| pręt drukowany (część Ø5) | X 11,7 / Y 14,2 (cały wydruk z końcówką 16,7 / 19,2) | **Ø5 z płaską stroną 4,4** (druk na płaskiej) | szpilka M2 (M2×10 bez łba lub ścięte) wkręcona 4 mm w otwór Ø1,6; ścianka 1,7 |
| **końcówka M5** | **5** | **Ø9** | gwint M5 w otworze Ø4,2, ścianka 2,4 (≥ 2 wg Astry); szpilka M5 wkręcona 5 mm do oporu |
| nakrętka kontrująca M5 | 4 | Ø9,2 | blokada obudowy na szpilce |
| obudowa M5 (od środka kulki) | 12 + 1,5 za środkiem [Z, B1] | Ø14 (zachowawczo) | szpilka M5 wkręcona na ≥ 5 [B1] |

- **Szpilka M5:** śruba M5 ×20 z odciętym łbem, docięta do 5 + 4 + gwint obudowy (≈ 15–17 mm).
- **Wyrwanie [R]:** 5 mm gwintu M5 w PLA to ok. 0,5·π·5·5·20 MPa ≈ 790 N, wobec 59 N w pręcie.
- **Długość reguluje się tylko obudową M5:**
  - obrót obudowy na szpilce, potem kontra M5;
  - pół obrotu = 0,4 mm = ok. 1,8° serwa X; dokładne zero idzie w µs (Opus D1 z v1).
- **M2:** obudowa wkręcona do oporu w kontrę M2. Kontrola długości po teście 24 h na przyrządzie długości (Fable D5).

### 3.4 Wycięcia czaszy gałki i powieki górnej

- **Gałka:** krawędź czaszy obniżona lokalnie, z fazą przejścia 5°:
  - w sektorze φ = 0° ±25° (pręt X) do 104° od osi;
  - w sektorze φ = 80° ±30° (pręt Y) do 106°;
  - wszędzie indziej 115°.

  Wycięcia leżą za równikiem i są niewidoczne z przodu.
- **Powieka górna:** w pasie x −2…+24 tylna krawędź kończy się 83,5° za przednią, czyli na 75° przy zamknięciu nominalnym (poza pasem 99,5°). Krawędź nadal zakrywa kulę:
  - R31,2·sin 75° = 30,14 > 30 dla x = 0;
  - stosunek ten sam dla każdego x w pasie.

  Stopień 16° (91° → 75°) na szerokości 26 mm z tyłu powieki będzie widoczny przy zamkniętym oku tylko z góry. To kosmetyka (Fable D2).

## 4. Ogranicznik gałki: okno na pełnych bryłach (Astra K2, Opus W1)

**Model [R]:**
- Słupek jako walec R7,65 od z −33 do z −5,5 z ostrą krawędzią czoła (zachowawczo);
- płyta okna w układzie gałki na z_b −7,5…−4,5 (3 mm).

Okno to brzeg sumy przekrojów Słupka w grubości płyty, dla wszystkich położeń na granicy ±28°/±18° (196 położeń, przedziały 0,5° kąta biegunowego, zaokrąglenie w górę). Okno nie jest wypukłe. Otoczka wypukła tych samych przekrojów dawała zakres mechaniczny do θ ±20,6° przy ψ 0 (sprawdzone), więc ją odrzucam.

**Okno r(φ) w płycie (od osi gałki, φ od +x gałki ku +y):**

| φ | 0 | 15 | 30 | 45 | 60 | 75 | 90 |
|---|---|---|---|---|---|---|---|
| r [mm] | 12,62 | 13,08 | 13,69 | 13,61 | 12,59 | 10,98 | 10,42 |

Okno jest symetryczne względem osi x i y gałki. W CAD buduje się je jako spline przez punkty co 15° z tabeli (szkic na płaszczyźnie płyty, wymiary `#okno_r0`…`#okno_r90`). Wartości liczy skrypt `window.py` i przelicza się je przy każdej zmianie `zapasOgr`, `slupekR` albo `oknoZ`.

**Wynik [R]:**
- zapas w całym zakresie pracy ±25/±15: **0,52 mm** (najmniej przy (−1; −15));
- rzeczywisty zakres mechaniczny: ψ ±28,2°, θ ±18,2°, przekątna (28,0; 18,0). Przemiatanie „ograniczniki” liczy cały ten zakres;
- **styk na Słupku:**
  - azymut 0°/180° (ogranicznik ψ): z −13,6…−12,5;
  - azymut 90°/270° (ogranicznik θ): z −12,2…−10,2.

  Otwór M4 Ø4,2 na z −11,2…−7,0 na ±x ma do styku **1,3 mm**. Na ±y przeciąłby pas styku, stąd B2.
- **siła przy 0,5 N·m:** ok. 42 N na krawędzi okna (ramię 12 mm, Opus W1).

**Płyta okna i wycięcia na pręty:**
- płyta jest pełna od okna do R27 (wnętrze czaszy);
- wycina się w niej obwiednię prętów z obudowami M2 w całym zakresie mechanicznym + 0,5 mm;
- zostają mostki:
  - przy pręcie X (φ −15…+15) szerokość 2,0–3,2 mm;
  - przy pręcie Y (φ 55…105) 2,4–5,4 mm.
- **Mostek X** ma żebro 2,4 × 2,5 nad płytą (z_b −4,5…−2,0): tam pręty zostawiają 2,4 mm.
  - Naprężenie przy 42 N na mostku 7 mm (oba końce w pełnej płycie): M = 42·7/8 = 37 N·mm, W ≈ 4,4 mm³, **σ ≈ 8 MPa** (PLA ok. 50).
- **Kulka M2 do ramy okna ≥ 0,5** z definicji wycięcia. Najbliższa para przemiatania: obudowa M2 X – ramię piasty X 0,61 mm (praca), 0,44 (ograniczniki).

**Łączniki Uchwytu** (płyta → przednia piasta, Opus W6.6). Muszą leżeć poza nieruchomym materiałem (Słupek, dolna połówka kardana r5,5 do z +5,5) w całym zakresie, z luzem 0,5. Najmniejszy promień łącznika w zależności od z_b:

| z_b | −4,5 | −3 | −1,5 | 0 | +1,5 | +3 | +4,5 | +5,5 |
|---|---|---|---|---|---|---|---|---|
| r min | 12,7 | 11,7 | 10,7 | 7,2 | 8,2 | 7,8 | 7,1 | 6,3 |

**Nadlewy M3 Gałki** (Opus D4): na φ 210° i 330°, R 24, z_b −10…−16, gdzie nie ma prętów. Nadlew ≥ 6,1 mm (dno 0,6 przed frontem).

## 5. Powieki

**Źródła [F]:**
- Cogley Simplified ([Make](https://makezine.com/projects/simple-animatronic-eyes/)): powieki na osi pochylenia, osobne serwa;
- [EyeMech ε3.2](https://github.com/will-cogley/EyeMech_Epsilon): 4 kanały powiek.

Łącznik z drutu sprężynowego z zagięciami Z na powiece to **adaptacja [A]**, nie fakt (Fable W7). U Cogleya drut z haczykiem napędza gałkę, a nie powiekę. Dowodem będzie P3.

**Czworoboki:** synteza z v2, sprawdzona przez trzech recenzentów, bez zmian.

| | Powieka górna (G) | Powieka dolna (D) |
|---|---|---|
| Zaczep J (zamknięta wg v2) | (−22,0; +25,6; −0,9), wypust 2,4 × R2 | (−22,0; −25,6; −0,9) |
| Serwo | S_PG: wałek (y 18; z −60), odwrócone, orczyk w −x, płaszczyzna x −30; korpus x −18,8…+4,0, y 11,6…24,5 | S_PD: wałek (y −27; z −49), orczyk w −x, płaszczyzna x −21; korpus x −9,8…+13,0, y −33,5…−20,6 |
| Ramię | drukowane r20, 3 mm (x −31,5…−28,5), z zębem ogranicznika | **drukowane r17,5**, 2 mm (x −22…−20) na orczyku fabrycznym, z zębem ogranicznika |
| Łącznik (yz) | 49,95 | 41,69 |
| Ramię serwa od zamknięcia nominalnego | ogranicznik zamknięcia −0,93°, otwarta +67,4°, z podążaniem +74,3°, ogranicznik otwarcia **+75,3°** | +1,07° / −39,7° / −47,9° / **−49,2°** |
| dα_serwa/dφ_powieki | 1,24–1,36 | 1,42–1,66 |

### 5.1 Drut (Opus W2, Astra W2, Fable W1)

| | G | D |
|---|---|---|
| Noga przy J (x osi drutu) | −25,1 (strona −x zaczepu) | −25,1 |
| Noga przy H | −26,6 (strona +x ramienia) | −23,9 (strona −x ramienia) |
| Wykorbienie w x | **1,5 mm** na 40 % długości od J | **1,2 mm** na 15 % |
| Odległość nogi od ścianki | 0,1 + r_i 1,2 + 0,6 = 1,9 | jw. |
| Ogony Z | 2,0 mm, przy J wzdłuż nogi z drugiej strony zaczepu, przy H stycznie od J | jw. |

- **Otwory:** Ø1,6 w zaczepach i ramionach; drukowane Ø1,5 i przewiercone 1,6 (luz 0,2/str., Fable W5).
- **Wyboczenie:** P_kr = π²EI/L² = 80 N przy L 50.
- **Zginanie od wykorbienia** przy 38 N: M = 57 N·mm, σ ≈ 370 MPa.

  Drut sprężynowy ma granicę ok. 1500 MPa [Z]. Wykorbienie 10,5 mm z v2 dawało tu granicę plastyczności (Fable R3), a teraz jest zapas 4×.
- **Uzasadnienie drutu sprężystego** (brief v2):
  1. montaż: zagięcie Z wpina się w ramię, odginając koniec drutu o 3,6 mm. σ = 3·E·I·δ/L² · c/I ≈ 520 MPa, czyli sprężyście; ocynkowany Ø2,0 wygiąłby się trwale i nie wejdzie w Ø1,6;
  2. wyboczenie i zmęczenie przy 10⁵ mrugnięć.
- **Przyrząd do gięcia** (Fable W1a), drukowany:
  - płytka z rowkiem R0,6;
  - kołki Ø2,4 (trzpienie śrub M2,5) w miejscach obu zagięć Z i wykorbienia;
  - długości 49,95 / 41,69 ±0,3 między osiami nóg w yz.

  Oba zagięcia gnie się na stole. Tolerancja położenia wykorbienia: zapas do S_Y i rury ≥ 0,73 mm (pkt 9) przy błędzie ±0,5.

### 5.2 Ograniczniki powiek na ramionach serw (Opus W3)

- **Zęby na piastach ramion:**
  - ząb promieniowy na piaście Ramienia PG/PD (r 6…9 od wałka) opiera się o słupki stopu w klatce;
  - położenie słupków: na kątach ramienia z tabeli (G: −0,93° i +75,3°, D: +1,07° i −49,2° od zamknięcia nominalnego).
- **Droga siły:** powieka → drut → ramię → ząb → klatka, z pominięciem wielowypustu i przekładni.
- **Zapasy:**
  - 0,75° powieki za zamknięciem daje 0,93–1,07° serwa ≈ 10–12 µs (przy 11 µs/° [Z]), więcej niż martwa strefa MG90S (ok. 5 µs [Z]);
  - zamknięcie programowe ustawia kalibracja względem ogranicznika: dojazd do zęba, cofnięcie o 1,0° serwa.
- **Otwarcie:** 0,75° za podążaniem, a nie 2°.
  - Przy 2° (t 58) końcówka Ø9 pręta Y wchodzi w czaszę górnej o 0,9 mm.
  - Przy 0,75° zostaje 0,31 mm (pkt 9).
- **Zęby i słupki stopu** są poza przemiataniem (stałe względem klatki). Wykonawca sprawdza je w Assembly: ząb ↔ drut i ↔ kabel ≥ 0,5.

### 5.3 Szczelina zamknięcia i kąciki (Opus W3, Astra W3)

- **Szczelina na ogranicznikach:** 1,5° = 0,82 mm na R31,2.
- **Luz osi:** uch Ø3,4 na M3 to 0,2/str., więc względne przesunięcie powiek do 0,4. Wymaganie: ≥ 0,5 nominalnie i ≥ 0,2 po luzach, czyli szczelina nominalna g ≥ 0,6.
- **Przycięcie kącików:** każda krawędź przednia o δ(x) = max(0; (0,6/ρ(x) − 0,02618)/2) rad, gdzie ρ(x) = √(31,2² − x²). Przykłady:

| x | 21,2 | 25 | 28 | 30 | 31 |
|---|---|---|---|---|---|
| δ | 0 | 0,17° | 0,50° | 1,25° | 4,1° |
- **Pas uch:** przy uchach (ρ < 4) obowiązuje luz osiowy 0,25.
- **Szczelina powieka – kołnierz przodu R35,2:** 0,5 promieniowo na rancie, 1,8 na czaszy. Palec się w nią nie wsunie.
- **Siły przycięcia** z v2 (6,6–8,8 N na R33,4) dotyczą kontaktu stycznego. Astra W3: przy ramieniu 4 mm ten sam moment daje 64–74 N. Taki kontakt jest możliwy tylko przy uchach, w szczelinie ≤ 0,82 mm. P3 mierzy siłę w trzech miejscach każdej powieki i między powiekami.

### 5.4 Ucha i osie powiek

- **Stos:**
  - bok Ramy 3,25 (R36,5–39,75, gniazdo stożkowe 90° Ø6 × 1,65, gwint Ø2,5 na 1,6);
  - luz 0,25, ucho G 2,4 (x 33,85…36,25), luz 0,25, ucho D 2,4 (x 31,2…33,6);
  - **DIN 7991 M3×8** kończy się 0,55 przed wewnętrzną ścianą ucha D.
- **Blokada:** ruch do środka blokuje łeb, na zewnątrz – ścianka otworu Ø80 w dyni (0,25 mm). Na stole śrubę trzyma gwint.

  DIN 913 zostaje wariantem zapasowym. Wtedy wędrówkę mierzy P3 po teście 24 h (Opus D3).
- **Mostek ucha G** (Opus W6.3): od czaszy G do ucha G biegnie na zewnątrz ucha D, ρ ≥ r ucha D + 0,5. Musi zmieścić się w rurze: przy x 34 |y| ≤ 16,4.

## 6. Rozruch i skoki (Astra K3)

**Firmware:**
1. NVS trzyma ostatni zadany impuls każdego serwa, zapisywany po zakończeniu ruchu i co najwyżej raz na 10 s (zużycie flash).
2. Po włączeniu firmware wysyła ten impuls. Jeśli zgadza się z położeniem, nic się nie rusza.
3. Rampa do celu idzie w **przestrzeni (ψ, θ)**: odcinek z wygładzeniem, krok 20 ms, w każdym kroku IK z pkt 3.2 dla X i Y, oba kanały w tej samej ramce. Powieki rampą we własnym kącie, w każdym kroku z tablicy kalibracji.
4. Prostokąt pracy ±25/±15 jest wypukły, więc odcinek między dwiema pozycjami pracy nie wychodzi poza niego, a to jest zakres „praca” w przemiataniu (min 0,61 mm między częściami ruchomymi).
5. Powieki nie wymagają ograniczeń zależnych od gałki: przemiatanie objęło każdą kombinację gałka × G × D niezależnie.

**Podążanie powiek (θ+ = góra):**
- G: otwG + 0,33·θ dla θ > 0 (do +47° przy θ +15, brzeg tęczówki Ø27 na +41,7°, zapas 5,3°);
- D: otwD − 0,33·|θ| dla θ < 0 (do −43° przy θ −15, brzeg tęczówki −41,7°, zapas 1,3° = 0,75 mm; Opus D5: kalibracja D z dokładnością ≤ 0,5°).

**Skok po zaniku prądu albo ręcznym przestawieniu [R]:**
- Model: oba serwa jadą każde do swojego celu z tą samą prędkością kątową, niezależnie (tor w kątach serw to łamana).
- Obraz zakresu okna w kątach serw: X −33,5…+52,8°, Y −24,7…+37,2°. Jakobian ma stały znak (det 0,73…4,15), więc odwzorowanie nie składa się.
- Wyniki:
  - 1000 losowych skoków praca → praca: **999 zostaje w zakresie okna**, 1 dochodzi do okna;
  - 1000 skoków z dowolnego położenia ręcznego (cały zakres okna) → NVS: 997 / 3;
  - przykłady wyjścia: narożniki (+25; +15) → (−25; +15) i (−25; +15) → (+25; −15).
- **Skutek:** gałka nigdy nie wychodzi poza zakres okna, bo okno ją zatrzymuje.
  - W tym zakresie przemiatanie „ograniczniki” daje ≥ 0,31 mm między wszystkimi parami poza stykiem okno–Słupek.
  - Skok kończy się więc na Słupku albo w zakresie, nie na prętach i powiekach.
  - Siła na oknie od zablokowanego serwa: 0,177 / 0,614 · 0,5 / 0,012 ≈ 12 N.
- **Powieki:** zęby ograniczników zatrzymują je w ich zakresie, który jest przemieciony w całości.
- Rampa liniowa w kątach serw (zamiast w ψ, θ) wychodzi poza prostokąt pracy, ale nie poza zakres okna. Firmware jej nie używa.

## 7. Ochrona przekładni MG90S

**Obciążenie [R]:**
- moment zablokowania MG90S 0,177 N·m przy 4,8 V ([components101](https://components101.com/motors/mg90s-metal-gear-servo-motor));
- ręka 0,5 N·m na gałce w zakresie pracy daje na wale X 0,614 N·m (3,5×), Y 0,495 N·m;
- 20 N na krawędzi powieki daje do 0,567 N·m (G).

**(a) Firmware: PWM tylko w ruchu.**
- Impuls na czas ruchu + 0,3 s, potem kanał wyłączony (PCA9685 `full off`).
- Bez PWM serwo jest cofane momentem tarcia przekładni i nie walczy prądem zablokowania. Przy 1 sakadzie/s i mrugnięciu co 4 s gałka jest pod PWM ok. 30 % czasu, powieki ok. 8 % (Opus W4).
- Warunek: test „bez PWM” z v2 (25 g na 16 mm, 3,9·10⁻³ N·m) przechodzi z zasilaniem i bez.
- **Zależność od E5.5:**
  - mniejszy pobór pogarsza podtrzymanie powerbanku;
  - Baseus PPAP20K odcina zasilanie co ok. 15 s przy małym obciążeniu [F, commit c0e1bc0];
  - (a) działa tylko ze źródłem, które trzyma przy samym ESP z AP, albo z obciążeniem podtrzymującym z E5.5;
  - po każdym odcięciu ESP startuje z NVS i nic nie skacze, bo NVS = położenie.

**(b) T1 stopniowany na jednym serwie przed drukiem całości (Fable W4).**
- **Przyrząd:** MG90S w klatce próbki P2, ramię drukowane r13, waga bagażowa na kulce M5, wskazówka 100 mm (1° = 1,75 mm).
- **Stopnie momentu na wale:**

  | Moment [N·m] | 0,18 | 0,25 | 0,35 | 0,50 | 0,65 |
  |---|---|---|---|---|---|
  | Siła na r13 [N] | 13,8 | 19,2 | 26,9 | 38,5 | 50 |

  Każdy stopień po 10 s, 5 razy, z PWM (serwo trzyma środek); osobno bez PWM: moment cofania.
- **Pomiar:** luz wału ±1° przy 0,05 N·m przed i po każdym stopniu, położenie zera, trzask przeskoku.
- **Zaliczenie stopnia:** wzrost luzu ≤ 0,5°, przesunięcie zera ≤ 1° (≈ 11 µs), brak przeskoku. **M_bezp** = najwyższy zaliczony stopień.
- **Decyzja:**
  - M_bezp ≥ 0,65 → bez planu B;
  - 0,35 ≤ M_bezp < 0,65 → plan B na X i Y;
  - M_bezp < 0,35 → plan B także na powiekach.

**(c) Plan B jako próbka (wybór po T1 i B1):**
1. **Sprzęgło cierne na wkręcie M2 orczyka** (Fable), dla X i Y.
   - Budowa: fabryczny orczyk przycięty do piasty Ø7; Ramię z okrągłą piastą Ø10 (otwór Ø7,2) dociskane wkrętem środkowym M2 przez podkładkę M2 i podkładkę sprężystą.
   - Moment poślizgu: μ·F·r_ef·n, z μ 0,25 [Z] i r_ef 3,7 mm (pierścień Ø4…Ø10):
     - jedna powierzchnia: 0,23 N·m przy 250 N;
     - dwie: 0,46 N·m.
   - Cel: **0,23–0,30 N·m**, czyli powyżej 1,3 × zablokowania i poniżej M_bezp.
   - Ustawienie: poślizg przy 18–23 N wagi bagażowej na kulce M5 (r13).
   - Koszty:
     - po poślizgu zero ucieka, potrzebna kalibracja zera w telefonie z przyrządem zera;
     - PLA pod dociskiem pełznie, więc kontrola po 24 h.
   - Miejsce: piasta Ø10 mieści się w Ramieniu 6 mm, bez zmian w przemiataniu.
2. **Bezpiecznik na kulce M2** (Opus).
   - Siła w pręcie X od własnego zablokowanego serwa wynosi do 22 N w pracy (29 N na ogranicznikach). Wypięcie musi więc być ≥ 28 N, żeby kulka nie schodziła w pracy.
   - Przy wypięciu F wał X dostaje ≤ F·13 mm. Okno działania: F 28–35 N daje 0,36–0,46 N·m, czyli ochronę słabszą niż sprzęgło.
   - Wpięcie z powrotem wymaga wyjęcia modułu.
   - Pomiar siły wypięcia jest w B1. Wariant tylko wtedy, gdy B1 da 28–35 N.

**Prąd (Astra W8):**
- szacunki z v2 bez zmian: 4 zablokowane MG90S to 2,6–3,2 A;
- **T2 (pomiar):** egzemplarze Miuzei przy realnym napięciu i okablowaniu – spoczynek, start, 4 napędy w ruchu, zablokowanie 1 i 2 serw; napięcie na V+ PCA9685, restarty ESP;
- odstęp 150 ms przy starcie nie ogranicza prądu zablokowania, robi to dopiero (a);
- reakcja firmware na restart z przyczyną `brownout`: rampa wolniej (½ prędkości) i wpis w dzienniku NVS.

## 8. Montaż (Fable K2, Opus K3, Astra W7)

**(S)** = krok dla syna, bez narzędzi. Narzędzia obsługuje ojciec (O).

**Stół A – Rama z powiekami:**
1. (O) Powieki od tyłu w pustą Ramę (dolna, potem górna), osie DIN 7991 M3×8 wkrętakiem. Ojciec sprawdza zlicowanie łba linijką.
2. (O) Druty gięte na przyrządzie (pkt 5.1), z obydwoma zagięciami.
3. **(S)** wkręca zagięcie Z każdego drutu w otwór zaczepu J obrotem drutu. Drut wisi wolno.
4. **(S)** zamyka powieki i przykleja taśmą malarską do rantu. Druty przykleja taśmą do wnętrza rury w położeniu zbliżonym do docelowego (G przy x −25, y ≈ 8; D przy x −25, y ≈ −15), z dala od drogi gałki.

**Stół B – Płyta z gałką:**
5. (O) Serwa w klatki Płyty, 8 × M2,5×10 (B4). **(S)** podaje śruby według kolorów i układa kable w kanałach.
6. (O) Słupek na piastę wspornika:
   - DIN 7991 M5×30 od spodu (łeb w stożku piasty), nakrętka w kieszeni Słupka;
   - kardan na trzpień, M4 przez otwór Słupka na ±x (klucz od boku, droga wolna: na z −9 nie ma jeszcze prętów).
7. (O) Uchwyt na przednią piastę: M5×12 z nakrętką w kieszeni, M4 przez ściankę. (O) wkręca kulki M2 w piasty Uchwytu.
8. (O) Ramiona X/Y z kulkami M5 na orczyki, potem na wielowypusty w zerze:
   - program `kalibracja`, 1500 µs, przyrząd zera na gałce;
   - najpierw Y, potem X.
9. **(S)** zatrzaskuje pręty na kulkach. Pręty mają ustawioną długość na przyrządzie długości 43,33 / 45,82.
10. **(S)** nakłada Gałkę na Uchwyt. (O) wkręca 2 × M3×8 od tyłu.
11. (O) Ramiona PG i PD na wielowypusty, serwa w położeniu „zamknięte” (1500 µs + przesunięcie z tablicy). Zęby ograniczników w szczelinach słupków stopu.

**Złożenie:**
12. **(S)** z ojcem wsuwa Płytę z gałką od tyłu w Ramę, aż słupki Płyty oprą się o ucha Ramy. Gałka wchodzi w zamknięte powieki:
    - każdy punkt gałki o z ≥ 0 ma |p| ≤ 30 < 31,2 (Opus K3.4);
    - w Ramie nic nie sięga do R < 30,5 za z 0: ograniczniki są na ramionach, a ucha Ramy na R ≥ 30,5 na kątach słupków.
13. (O) 3 × M3×45 od tyłu tarczy przez słupki w gwint uch Ramy (6 mm gwintu, koniec 0,7 mm przed uchem na R33, gdzie nic się nie porusza).
14. (O) Przez okna tarczy dopina druty w ramiona:
    - G przez okno x −34,5…−25,5, y −5…+12,5, otwór ramienia ok. 22 mm przed tarczą;
    - D przez okno x −26…−17, y −21…−6;
    - sposób: szczypce, odgięcie końca drutu o 3,6 mm (sprężyście, pkt 5.1), zagięcie Z w otwór Ø1,6;
    - zdjęcie taśm.
15. **(S)** na stronie w telefonie przesuwa suwaki ±100 µs. (O) zapisuje µs dla ψ ±25, θ ±15 i powiek, a zamknięcie powiek ustawia względem zębów (pkt 5.2).
16. Test 24 h na stole.

**W dyni:** jak w v2 (wiercenie Ø80, (S) wsuwa moduł do oparcia rantu, (O) Obejma i M3×25, (S) wtyczki).

**Obejma przechodzi nad tyłem modułu:** za z −37 wszystko mieści się w R ≤ 39,75 (najdalej narożnik klatki S_PD R37,8 i ogon drutu G R34). Łby M3×45 są w tarczy.

## 9. Przemiatanie pełnego modelu (pkt 8 briefu)

**Model [R]:**
- pręty jako łańcuch kapsuł:
  - obudowa M2 Ø7 od −1 do +9 mm od środka kulki;
  - nakrętka M2 Ø4,6 × 1,6;
  - pręt Ø5;
  - końcówka Ø9 × 5;
  - nakrętka M5 Ø9,2 × 4;
  - obudowa M5 Ø14 od −12 do +1,5;
  - czop z kulą R5;
- Ramię 6 × 8 jako dwie kapsuły R3 (przekrój 6 × 8 z zaokrągleniem);
- drut R0,6: nogi na 1,9 od ścianek, wykorbienie, przejścia przez zaczep i ramię, ogony 2 mm; zaczep J i jego wypust R1,2 od krawędzi; ramię powieki R3 (G) / R2,5 (D);
- korpus MG90S 22,4 × 12,1 × 22,8 + 0,4 luzu, klatka +2 mm w y i z, ucho 31,8 × 2,0, wieżyczka jako walec R6 do płaszczyzny orczyka;
- kable jako kapsuły R1,0 po trasie z pkt 1, płasko po czole;
- czasza gałki R28–30 z wycięciami (pkt 3.4);
- czasze powiek R31,2–33,4, rant R34,7 w pasie 6,5° przy krawędzi przedniej, wycięcie G;
- rura R37,75 (z ≥ −37), kołnierz R35,2 (z ≥ 8), obwiednia R39,75;
- Słupek, płyta okna (wycięta po obwiedni prętów + 0,5, pkt 4), piasty kulek M2 Ø6 i ramię piasty X;
- słupki Płyty R33 Ø6 (100°, 200°, 310°, z −33…−68), ramiona wspornika 4 × 4 na z −35, ucha Ramy (R32,5–35,75, z −33…−27).

**Zakresy:**
- gałka co 1° w całym zakresie mechanicznym okna; „praca” = ±25/±15;
- powieka G co 1° od −0,75° do +56,25° obrotu (ograniczniki), D od −0,75° do +32,25°; „praca” = między położeniami programowymi;
- wszystkie kombinacje gałka × G × D niezależnie;
- zagęszczenie 0,25° (gałka) i 0,25° (powieki) w otoczeniu ±1° każdego minimum.

Liczę odległości odcinek–odcinek, punkt–prostopadłościan, punkt–walec i punkt–czasza (pole odległości), bez próbkowania prętów w kilku punktach.

**10 najciaśniejszych par, h 4, zakres pracy:**

| # | Para | mm | Gdzie |
|---|---|---|---|
| 1 | okno Uchwytu – Słupek | **0,52** | (−1; −15) |
| 2 | obudowa M2 X – ramię piasty M2 X (Uchwyt) | 0,61 | (25; −15) |
| 3 | ogon Z drutu G przy J – gałka R30 (dowolne położenie gałki) | 0,65 | G zamknięta |
| 4 | drut G – klatka S_Y | 0,73 | G +47° |
| 5 | ogon Z drutu D przy J – gałka R30 | 0,83 | D zamknięta |
| 6 | zaczep J (G i D) – gałka R30 | 1,00 | |
| 7 | pręt Ø5 Y – czasza górnej (wycięcie) | 1,09 | (−25; −8,75), G +47° |
| 8 | końcówka Ø9 Y – czasza górnej | 1,16 | (19,5; −15), G +47° |
| 9 | zaczep J (G i D) – rura | 1,21 | zamknięte |
| 10 | drut D przez ramię – klatka S_X | 1,51 | |

Dalej:
- obudowa M2 X – czasza gałki 1,61;
- obudowa M5 X – obudowa M5 Y 1,75;
- drut D – ramię wspornika 200° 1,71;
- drut G – rura **3,76** (v2: 0,52).

**10 najciaśniejszych par, h 4, zakres ograniczników** (gałka do okna, powieki do zębów):

| # | Para | mm | Gdzie |
|---|---|---|---|
| 1 | końcówka Ø9 Y – czasza górnej | **0,31** | (−25,25; −18,25), G na ograniczniku otwarcia |
| 2 | obudowa M2 X – ramię piasty M2 X | 0,44 | (28; −18) |
| 3 | obudowa M5 X – obudowa M5 Y | 0,60 | (25,25; −18,25) |
| 4 | ogon Z G przy J – gałka R30 | 0,64 | G na ograniczniku zamknięcia |
| 5 | drut G – klatka S_Y | 0,73 | G +47,5° |
| 6 | pręt Ø5 Y – czasza górnej | 0,80 | (−28; −7,75), G na ograniczniku |
| 7 | ogon Z D przy J – gałka R30 | 0,81 | |
| 8 | zaczepy J – gałka R30 | 1,00 | |
| 9 | obudowa M2 X – czasza gałki (wycięcie) | 1,08 | (28; −18) |
| 10 | obudowa M2 Y – czasza gałki | 1,11 | (28; 18) |

Zamierzone styki to okno–Słupek i ząb ramienia powieki–słupek stopu.

**Wrażliwość na B1 (h i obudowa M5), serwa w tych samych miejscach, kulki M5 przesunięte o h·d:**

| Wariant | Kulki M5 w zerze (x) | Moment X / Y przy 0,5 N·m | Praca min | Ograniczniki min |
|---|---|---|---|---|
| **h 4, obudowa Ø14** (wariant bazowy) | 27,0 / 19,0 | 0,614 / 0,495 | 0,52 (okno), 0,61 | 0,31 |
| h 7, obudowa Ø12 | 30,0 / 21,8 | 0,727 / 0,524 | 0,52 (okno), 0,64 | **0,16** (końcówka Y – czasza G) |
| h 7, obudowa Ø14 | 30,0 / 21,8 | 0,727 / 0,524 | 0,64 | **−0,63** (obudowa M5 X – Y, (28; −18)) |

Przy h 7 i Ø14 nie pomaga ani przesunięcie kulki Y (21,8 → 23,5: −1,24), ani fazka narożników okna (−0,55). Warunki odrzucenia są w B1.

**Odchylenia modelu od CAD:**
- zęby ograniczników powiek i słupki stopu;
- łby wkrętów orczyków;
- kable jako walce Ø2 (płaski kabel 3,6 × 1,2 leży na płask);
- kształt obudów przegubów: cylinder Ø7/Ø14 to obwiednia, prawdziwa obudowa jest węższa przy gwincie.

W Assembly sprawdza się pary 1–10 z obu tabel z pełnymi okuciami.

## 10. Części

| Część | Funkcja | Wymiary | Druk |
|---|---|---|---|
| **Rama** | rant Ø84, rura Ø79,5/75,5 z +10 do −37, kołnierz R35,2, boki osi 3,25 z gniazdami stożkowymi, **3 ucha wewnętrzne** na 100°/200°/310° (R30,5–37,75, z −33…−27, gwint M3 Ø2,5 na 6); bez wspornika i bez wypustów | Ø84 × 47 | tyłem w dół, ucha z fazą 45° |
| **Płyta** | tarcza ażurowa z −68,3…−71,3 (pierścień R30–39,5 + szprychy); okna G (x −34,5…−25,5, y −5…+12,5) i D (x −26…−17, y −21…−6); 4 klatki; słupki stopu powiek; 3 słupki R33 Ø6 do z −33 z otworem Ø3,3; piasta wspornika (z −37…−33, kieszeń łba M5 i spłaszczenie Słupka) z ramionami 5 × 4 do słupków; kanały kabli | Ø79 × 38 | tarczą w dół |
| **Słupek** | R7,65 od z −33 do −5,5, kieszeń Ø11,3 od −12,75, otwór M4 Ø4,2 na ±x (z −9,1), kieszeń nakrętki M5 (z −20…−16), spłaszczenie u dołu | Ø15,3 × 27,5 | pionowo |
| **Uchwyt** | płyta okna z_b −7,5…−4,5 (okno pkt 4, wycięcia na pręty, żebro mostka X), piasty kulek M2 Ø6 (X na −y, Y do środka), łączniki do piasty przedniej (r min z tabeli), kieszeń przedniej piasty od z_b +6,3, kieszeń M5, łuki do nadlewów Gałki | 54 × 50 × 22 | płytą w dół |
| **Gałka** | czasza R28–30, krawędź 115° z wycięciami, 2 nadlewy M3 (φ 210°, 330°) | Ø60 | krawędzią tylną w dół; wnętrze o nawisie > 45° od Ø39,6 (Astra W7): próbka P6, przy niepowodzeniu podpory drzewiaste tylko od środka |
| **Powieka górna** | czasza R31,2–33,4, rant 3,5, zakres 99,5°, wycięcie do 83,5° w pasie x −2…+24, ucha 2,4, zaczep J z otworem Ø1,6, przycięcie kącików (pkt 5.3), mostek ucha | 69 × 70 × 35 | płaszczyzną krawędzi przedniej na stół, podpory od strony wklęsłej opisane w README |
| **Powieka dolna** | jak górna, zakres 79°, bez wycięcia | 69 × 70 × 30 | jak wyżej |
| **Ramię X / Ramię Y** | 6 mm, r13 / r15, gniazdo M5 pochylone 4,7° / 19,5°, kieszeń orczyka od spodu, otwór Ø4,5 nad wkrętem | 22 × 8 × 6 | płasko |
| **Ramię PG / Ramię PD** | r20 / r17,5, otwór Ø1,6, ząb ogranicznika, kieszeń orczyka | 28 × 8 × 3 | płasko |
| **Pręt X / Pręt Y** | Ø5 z płaską stroną, końcówka Ø9 × 5 z gwintem M5, otwór Ø1,6 na szpilkę M2 | 43,33 / 45,82 między kulkami | na płaskiej |
| **Obejma** | bez zmian z v2 (PETG, M3×25) | Ø96 × 10 | kołnierzem w dół |
| *Przyrządy* | zera gałki, długości prętów (43,33 / 45,82), do gięcia drutów (pkt 5.1) | | |

**Z warsztatu:**
- 4 × MG90S, kardan 5/5, przeguby 2 × M2 i 2 × M5, drut sprężynowy Ø1,2 (2 × ok. 60 mm);
- DIN 7991 M3×8 × 2 (albo DIN 913 M3×8);
- M4 bez łba × 2 (docięte);
- DIN 7991 M5×30 + nakrętka, M5×12 + nakrętka, 2 × M5×20 bez łba na szpilki + 2 nakrętki M5;
- 2 × M2×10 bez łba + 2 nakrętki M2;
- 8 × M2,5×10 (B4), 3 × M3×45, 2 × M3×8, M3×25 z nakrętką samohamującą.

Łożyska 608-2RS i 6802-2RS nadal nie dają przewagi (v2, pkt 3.4).

**Ścianki klatki:**
- między S_X a S_PD odstęp korpusów wynosi 1,1 mm. To wspólna kieszeń bez ścianki nośnej, bo serwa trzymają się na uszach (Opus W6.1);
- S_X–S_Y 3,1 mm, S_Y–S_PG 2,1 mm.

## 11. Zmienne (Variable Studio) i test zginania K9

**Nowe lub zmienione względem v2:**
- `pktR` 19,5, `pktZ` −6;
- `kulkaM5H` 4 (B1);
- `kulkaM5X_X` = 23 + `kulkaM5H`·0,9967, `kulkaM5X_Y` = 15,23 + `kulkaM5H`·0,9427 (środki kulek w zerze; serwa stałe);
- `czopX` 4,7°, `czopY` 19,5°;
- `ramieX_x` 18,0, `ramieY_x` 10,2, `ramieGr` 6;
- `zSerw` −49, `zSerwPG` −60;
- `zapasOgr` 3, `oknoZ` −6, `plytaOknaT` 3, `okno_r0`…`okno_r90` (tabela pkt 4), `slupekR` 7,65, `slupekTop` −5,5;
- `wyciecieG` 83,5 (od krawędzi przedniej), `wyciecieX1` −2, `wyciecieX2` 24;
- `rimX` 104 (±25), `rimY` 106 (φ 80 ±30);
- `zapasZamk` 0,75, `zapasOtw` 0,75, `szczelinaZamk` 3, `gMinKacik` 0,6;
- `otworDrutu` 1,6, `riDrutu` 1,2;
- `koncowkaM5D` 9, `koncowkaM5L` 5, `pretD` 5;
- `srubaUcha` 2,5 (B4);
- `zArmWsp` −35, `slupekPlytyR` 33, kąty 100/200/310.

Pozostałe jak w v2 pkt 8.

**K9 (zginanie), oczekiwane efekty:**
- `kulkaM5H` 4 ↔ 7: kulki M5 w x +3,0 (X) / +2,8 (Y), pręty 43,33 → 43,71 i 45,82 → 46,17, korpusy serw bez zmian;
- `pktR` 19,5 ↔ 18,5: kulki M2 o 1 mm do środka, pręty +0,3…0,4, piasty M2 za nimi;
- `zSerw` −49 ↔ −48: korpusy, ramiona i kulki M5 X/Y/PD +1 w z. Dalej ucha serw (zSerw + 10,2) wchodzą w ramiona wspornika na z −37, więc rezerwy z (Fable W3) nie ma bez przeniesienia wspornika;
- `zapasOgr` 3 ↔ 2,5: okno r(φ) −0,2…−0,3; zapas w pracy 0,52 → ok. 0,43, test ma pokazać zmianę, nie zaliczenie;
- `wyciecieG` 83,5 ↔ 85,5: krawędź tylna 75° → 77°, odstęp końcówki Y na ograniczniku 0,31 → ok. −0,4;
- dla każdego: featureStates = OK, wymiar bryły zgodny z oczekiwanym, potem powrót.

Po każdej zmianie przemiatanie powtarza skrypt z zał. B.

## 12. Ryzyka i próbki

| # | Miejsce | Scenariusz | Test i kryterium |
|---|---|---|---|
| 1 | Przekładnie MG90S | ręka w zakresie pracy (do 3,5 × zablokowania) | **T1** (pkt 7b) przed drukiem całości, decyzja o planie B |
| 2 | Przeguby z warsztatu | wymiary inne niż założone | **B1**, potem **P4**: kulka M2 na piaście przy 25°, M5 przy 14°, wypięcie wagą bagażową, długość po 1000 cyklach |
| 3 | Druty i zaczepy | zagięcie wychodzi, drut trze | **P3**: wycinek Ramy, obie powieki, druty z przyrządu, ramiona z zębami na serwach, atrapa gałki; 1000 mrugnięć; wędrówka osi ≤ 0,2; szczelina w kącikach ≥ 0,5; siła przycięcia w 3 miejscach |
| 4 | Okno i Słupek | styk wewnątrz pracy, M4 w pasie styku | **P1**: Słupek, kardan, Uchwyt z płytą okna; styk przy ±28/±18, brak styku przy ±25/±15 (szczelinomierz 0,5), dostęp klucza M4 |
| 5 | Obejma w miąższu | luzowanie, kołysanie | **P5** (Astra W5): ścianki 15 i 35, osiowo ±20 N, 0,7 N·m w 4 kierunkach, pomiar po 24 i 72 h przed i po dokręceniu, owalizacja rury ≤ 0,2 |
| 6 | Głębokość 68,3 za ścianką 15 | moduł uderza w wieżę | **B5** |
| — | Prąd | brownout przy zablokowaniu | **T2** (pkt 7) |
| — | Gałka | nawis wnętrza | **P6**: czasza 20 mm od szczytu |

## 13. Pytania blokujące

| # | Pytanie | Przyjęte | Warunek odrzucenia i co wtedy |
|---|---|---|---|
| **B1** (blokuje pręty, Ramiona, Uchwyt) | Dla obu rozmiarów przegubów: (1) co znaczy „M5” i „M2”: gwint czopa czy Ø kuli; (2) Ø kuli; (3) **wysokość środka kuli nad powierzchnią oporową czopa (kołnierzem)**; (4) gwint i długość czopa, rozmiar kołnierza; (5) obudowa: Ø przy kuli, Ø przy gwincie, długość od środka kuli do końca, gwint żeński i jego głębokość; (6) kąt wychylenia do oporu; (7) siła wypięcia (waga bagażowa, 3 próby) | M2: kula Ø4,8, h2 3–4, obudowa ≤ Ø7 × 9, wychylenie ≥ ±25°. M5: h ≤ 5 przy obudowie ≤ Ø14 × 12 albo h ≤ 7 przy obudowie ≤ Ø12; wychylenie ≥ ±14° (h 4) / ±19° (h 7); gwint żeński ≥ 5 | (a) Wychylenie M2 < 25°: ogranicznik θ do ±17 (okno od nowa, zapas w pracy spada do ok. 0,3) albo przegub drukowany 2-DOF jako próbka. (b) h > 7, albo h 5–7 przy obudowie > Ø12: obudowy X i Y nachodzą na siebie na ogranicznikach; przeliczenie układu. (c) „M5” = kula Ø5 z gwintem M3: stosy na M3, końcówka Ø7, przemiatanie od nowa (prawdopodobnie luźniej). (d) Obudowa M2 > Ø7,5 albo > 9 długości: pręty – płyta okna; pktR o 0,5 mm na każde 0,5 nadmiaru |
| **B2** (blokuje Słupek) | Kardan: w którą stronę patrzy wkręt M4 każdej piasty względem jej sworznia, równolegle czy prostopadle? (zdjęcie z boku) | tylny M4 równolegle do sworznia, który leży na x | Prostopadle: obrót kardana o 90°, tylny sworzeń na y, czyli R = Ry(ψ)·Rx(−θ). Kinematyka, okno i przemiatanie do przeliczenia (zmiana jednej linii w skrypcie). M4 musi zostać na ±x |
| **B4** (blokuje klatkę) | Otwór w uchu MG90S (Ø, szerokość ucha) i czy M2,5 przechodzi luźno | Ø2,5–2,7 → M2,5×10 w Ø2,1 w PLA | < 2,5: M2×10 z nakrętką w kieszeni bloku (wkręt M2 w Ø2 słabo trzymał w v2.7); M3 tylko przy zmierzonym ≥ 3,1, bez rozwiercania (zostaje 0,45 mm materiału, Opus W7). Do tego: wyjście kabla (bok, wysokość) i wysokość wieżyczki nad korpusem |
| **B5** (blokuje Płytę) | Wolna głębokość za wewnętrzną ścianką na wysokości oka | ≥ 70 (68,3 + kable bokiem) | < 70: `glebokoscSrodka` +Δ (gałka wystaje mniej) albo S_PG do przodu (`zSerwPG` −60 → −56, czworobok G od nowa) |
| B6–B8 | jak v2 (wystawanie, rozstaw małych oczu, Obejma PETG) | | |

## 14. Uwagi z drugiej rundy → co zrobiono

**Astra**

| ID | Uwaga | Co zrobiono |
|---|---|---|
| K1 | Pręt Y w górnej powiece, model inny niż dokument | Pełny przekrój i okucia; wycięcie G 75° w pasie x −2…+24; zęby powiek 0,75°. Pręt Y – czasza 1,09 (praca) / 0,80; końcówka Y 1,16 / 0,31 |
| K2 | Okno nie realizuje ±27/±17 | Okno z pełnych brył (pkt 4): zakres mechaniczny ±28,2/±18,2, sprawdzony w całości; zapas w pracy 0,52 |
| K3 | Rozruch niezależnych serw | Rampa w (ψ, θ) z IK; skoki: tor w kątach serw w obrazie okna albo na Słupku (pkt 6) |
| K4 | Pręt Ø6 z M5 | Końcówka Ø9 × 5 (ścianka 2,4), szpilka stalowa, kontry M2/M5, długości gwintów (pkt 3.3) |
| W1 | Ochrona przekładni | Pkt 7 (a)–(c) z liczbami |
| W2 | Drut z wykorbieniem, Z niedopisane | Wykorbienie 1,5 / 1,2 mm, σ 370 MPa przy 38 N; Z z r_i 1,2, ogony 2 mm w przemiataniu |
| W3 | Tolerancje przycięcia, DIN 913, kołnierz | g ≥ 0,6 nominalnie przy luzie osi 0,4 (δ(x) pkt 5.3); DIN 7991 z łbem w gnieździe; szczelina kołnierza 0,5 na rancie, 1,8 na czaszy; P3 mierzy siłę w 3 miejscach |
| W4 | Znaki, dane wykonawcze | θ+ = góra wszędzie; IK z gałęzią i stałymi; K9 z zależnościami; stos M5×30 policzony (pkt 3.1); słupki, ucha, zęby, okno z liczbami; B1 rozdziela gwinty i wysokość |
| W5 | Obejma | P5: ±20 N, 0,7 N·m w 4 kierunkach, 24/72 h przed i po dokręceniu, owalizacja |
| W6 | Głębokość, masa | Głębokość 83,3 / 68,3 policzona do końca ramienia G; dźwignie w B5; masa ok. 217–225 g, cel 130–150 g nieosiągalny |
| W7 | Montaż, DFAM | Kolejność z drogami narzędzi (pkt 8): M4 od boku przed prętami, Z przez okna tarczy, Obejma nad tyłem w R39,75; DIN tylko ojciec; druga gałąź 143,5°/127,9° (poprawka liczby z v2); pręt z płaską stroną; Gałka P6 |
| W8 | Prąd | T2 jako pomiar; PWM tylko w ruchu; reakcja na brownout |

**Fable**

| ID | Uwaga | Co zrobiono |
|---|---|---|
| K1 | Nakrętka M5 w S_PG | Czop wkręcony w Ramię 6 mm, bez nakrętki od strony serwa; obudowa M5 Y – klatka S_PG 2,3 mm |
| K2 | Montaż | Wspornik w Płycie, gałka z Płytą w zamknięte powieki, druty dopinane przez okna tarczy (pkt 8) |
| W1 | Drut G ściśnięty | S_Y o +2,2 w x, strony nóg: drut G – rura 3,76, – klatka S_Y 0,73; przyrząd do gięcia |
| W2 | Wysokość kulki, pochylenie czopu | Czopy pochylone (wychylenie M5 12–14° przy h 4, 17–19° przy h 7); h jako `kulkaM5H`; wariant h 7 policzony; B1 pyta o „M5” |
| W3 | Głębokość, `zSerw` | `zSerw` jako zmienna z K9 (rezerwa tylko 1 mm przez wspornik); tarcza ażurowa; B5 z warunkiem |
| W4 | Ochrona przekładni | T1 stopniowany z kryterium, sprzęgło cierne jako próbka, PWM tylko w ruchu |
| W5 | Luzy poniżej tabeli | pktR 19,5; otwory drutu Ø1,6 (wiercone 1,5 → 1,6), także w orczyku D |
| W6 | M2,5 w uszach | Domyślnie M2,5×10, `srubaUcha`, B4 z wariantami |
| W7 | Źródło drutu | Łącznik powiek oznaczony jako adaptacja [A]; dowodem P3 |
| W8 | Elementy poza modelem | Dodane: obudowy i nakrętki, końcówka, ogony Z, kable, wieżyczki, uszy, płyta okna, słupki, ucha; siatka 1° i 0,25° |

**Opus (recenzent)**

| ID | Uwaga | Co zrobiono |
|---|---|---|
| K1 | Pręty Ø6 w czaszy gałki i powiece | Lokalne wycięcia gałki (104°/106°), wycięcie G 75° (nie 77°, bo pręt Y potrzebuje 2 mm więcej), pktR 19,5 |
| K2 | Nakrętka M5 Y w S_PG | Jak Fable K1 |
| K3 | Montaż | Jak Fable K2; ucha Ramy na R ≥ 30,5 na kątach słupków; rachunek wspornika: ramię 25 mm, 6,7 N od przodu na ramię, σ ≈ 16 MPa przy 4 × 4 |
| W1 | Okno | Pełne bryły, okno biegunowe, styk z −10,2…−13,8, M4 na ±x, 42 N |
| W2 | Drut G, kabel S_Y | Kabel po czole do x 0 i między S_X a S_Y; drut D od −x ramienia; ogony stycznie |
| W3 | Ograniczniki powiek | Zęby na ramionach, 0,75° = 10–12 µs; kalibracja zamknięcia względem zęba; kąciki dla 1,5° |
| W4 | Ochrona przekładni | (a) od razu, bezpiecznik M2 po B1 (okno 28–35 N), sprzęgło jako druga próbka; sprężynowy saver z drutu odrzucony, bo nie mieści się przy Y |
| W5 | Głębokość | 83,3 / 68,3; okna tarczy według liczb; kable bokiem przed tarczą; B5 z warunkiem |
| W6 | Bryły poza modelem | 1: S_X–S_PD bez ścianki nośnej; 2: kąty słupków i uch; 3: mostek ucha G; 4: spłaszczenie Słupka; 5: końcówka Ø9; 6: łączniki Uchwytu z r min; 7: kolejność Ramion |
| W7 | B1, B4 | Rozszerzone (pkt 13) |

## Werdykt

V3 jest gotowa do weryfikacji poprawek i, po odpowiedzi na B1 i B2, do briefu CAD.
- Pełne przemiatanie w zakresie pracy ma najmniej 0,52 mm (okno), a wśród części ruchomych 0,61 mm. Na ogranicznikach jest 0,31 mm.
- Montaż i rozruch są wykonalne.

**Najsłabszy punkt:** zależność od nieznanych wymiarów przegubów z warsztatu (B1). Przy kulce M5 wysoko (h 7) i obudowie Ø14 obudowy X i Y zderzają się na ogranicznikach. Drugie w kolejności: przekładnie MG90S bez sprawdzonej ochrony do wyniku T1.

---

## Załącznik A: liczby pomocnicze

- **Ramiona wspornika** w wolnych sektorach (mapa na z −33…−35): ramię r2 ma do najbliższej części ruchomej 4,5 mm (100°), 2,4 (200°), 4,6 (310°). Słupki R33 mają 3,0 / 3,3 / 4,0. Inne kąty kolidują z obudowami M5 (0–60°, 340–360°), wieżyczkami S_PG/S_PD (130–160°, 230–290°) i ramionami powiek.
- **Głębokość:**
  - koniec ramienia G (H na z −70,3 przy ograniczniku otwarcia, R3) sięga z −73,3;
  - klatki z −68,3;
  - tarcza z −68,3…−71,3.
- **Kąty ramienia G** (b, w płaszczyźnie yz wokół wałka S_PG), od zamknięcia nominalnego 135,6°:
  - ogranicznik zamknięcia 134,7°;
  - otwarta 203,1°;
  - z podążaniem 209,9°;
  - ogranicznik otwarcia 210,9°.
- **Kąty ramienia D**, od 29,3°: 30,4 / −10,4 / −18,6 / −19,9°.
- **Siła na mostku okna:** 0,5 N·m / 12 mm = 42 N.

## Załącznik B: skrypty

Wszystkie rachunki są w scratchpadzie sesji (Python 3 + numpy):
`/tmp/claude-1000/-home-rkp--claude-spares-spare-mfMMBV/81adf3b7-b77e-42b1-b39b-151f54c8e062/scratchpad/v3/`

| Skrypt | Co liczy |
|---|---|
| `geo.py` | parametry, kinematyka gałki i powiek |
| `full.py` | pełny model brył i funkcje odległości; parametry przez zmienne środowiska (`HXT`, `HYT`, `PKTR`, `GSPAN`, `BL`, `HR`, `XCE`, `TJG`/`TJD`) |
| `sweep.py` | przemiatanie: `python3 sweep.py <h> f 1`; wynik do JSON (`OUT`) |
| `sweep_local.py` | zagęszczenie wokół minimów (`refine_pts.json`) |
| `window.py`, `reach2.py`, `reach3.py`, `wcontact.py` | okno, zakres mechaniczny, pas styku na Słupku |
| `uchwyt.py`, `plate.py`, `plate2.py`, `uchlinks.py` | płyta okna, wycięcia i mostki, łączniki |
| `kin4.py`, `misw.py`, `forces.py`, `ikform.py` | zakresy serw, wychylenia, momenty i siły, stałe IK |
| `jump2.py` | skoki w przestrzeni kątów serw |
| `lidstops.py`, `tarcza.py`, `freemap*.py`, `ears*.py` | zęby powiek, okna tarczy, wolne sektory |

Wyniki: `final_h4.txt`, `local_h4.txt`, `final_h7.txt` (h 7, Ø12), `h7c.txt`, `ch_h7.txt`.

Scratchpad nie jest trwały (Astra: „skrypty tylko w scratchpadzie nie zapewniają odtwarzalnej kontroli”). Propozycja do parkingu: skopiować katalog do `40-cad/narzedzia/e6-przemiatanie/` przed briefem CAD.
