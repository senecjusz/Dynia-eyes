# Duże oko 2c – koncepcja v2 (E6.1b, 22–23.10)

Autor: Opus (realizator v1). Wykonuję brief `30-projekt/brief-e6-duze-oko-koncepcja-v2.md` i jego uzupełnienia od orkiestratora z 22–23.10:
- pomiary kardana i MG90S,
- przeguby kulowe i druty z warsztatu,
- DIN 913,
- zakaz zakupów modelarskich,
- łożyska.

V2 jest kompletna: wykonawca CAD i recenzenci nie muszą czytać v1. W repo nic nie zmieniłem, zapisałem tylko ten plik. Nie podaję prognoz czasu.

Oznaczenia: **[F]** fakt (źródło, pomiar, plik), **[R]** rachunek (skrypty w scratchpadzie, wyniki w załączniku), **[Z]** założenie, **[A]** własna adaptacja, niesprawdzona.

Układ współrzędnych:
- O = środek kuli i środek krzyżaka kardana;
- **+z** z dyni na zewnątrz (patrzenie na wprost), **+y** w górę, **+x** w prawo patrząc na dynię z zewnątrz;
- ψ = lewo–prawo, θ = góra–dół;
- kardan: R = Rx(θ)·Ry(ψ), oś pochylenia (x) zewnętrzna i nieruchoma.

## 0. Wynik

1. **Zostaje (potwierdzone przez trzech recenzentów):**
   - gałka Ø60 na metalowym kardanie 5/5 w środku kuli;
   - dwa nieruchome MG90S i pręty z przegubem kulowym na obu końcach (S–S) dla ψ i θ.

   Pręty działają na **posiadanych przegubach**: M2 przy gałce, M5 przy orczyku. Na jednym pręcie mogą być dwa różne rozmiary, bo pręt drukuję z dwoma gwintami.
2. **Powieki:**
   - **osobne MG90S na każdą powiekę**, razem 4 serwa (decyzja użytkownika 22.10), jak u Cogleya [F];
   - napęd każdej powieki to płaski czworobok (dźwignia na powiece, łącznik, ramię orczyka), czyli zasada Cogleya;
   - łącznik to **drut sprężynowy Ø1,2 z zagięciami Z**, jak druty w „Eye Mechanism on the Cheap” Cogleya. Rachunek pokazuje, że przy osi powiek nie mieści się stos śruby M3 z nakrętką.
3. **Przemiatanie kolizji wszystkich par w całym zakresie** (gałka ±27°/±17° do ograniczników × powieka górna 0–58° × dolna 0–34°, niezależnie):
   - zero miejsc poniżej 0,5 mm;
   - najciaśniej: drut powieki górnej do rury 0,52 mm, pręt θ do wyciętej czaszy górnej powieki 0,82 mm;
   - model uproszczony (walce, kule, prostopadłościany), zał. A3–A4.
4. **Ręka dziecka:**
   - ograniczniki gałki to okno w Uchwycie wokół Słupka: siła idzie kula → Uchwyt → Słupek → Rama, z pominięciem prętów, kulek i serw;
   - ograniczniki powiek to wypusty Ramy, na które naciskają zaczepy powiek;
   - **w zakresie pracy dziecko cofa przekładnię**: do 0,64 N·m na wale przy 0,5 N·m na gałce (3,6 × moment zablokowania);
   - sprawdzonej ochrony z warsztatu nie ma (sejwer serwa to część modelarska). Zostaje ryzyko 1 z testem i kryterium.
5. **Masa i obrys:**
   - ok. **225 g ±20 %**;
   - moduł w walcu Ø79,5, sięga **82 mm za zewnętrzną powierzchnię dyni** (67 mm za ściankę przy ściance 15 mm, wobec szacowanych 65 wolnych);
   - mocowanie: Rama i Obejma (2 części drukowane), 2 ruchy w dyni.

## 1. Co zmieniłem względem v1

| Obszar | v1 | v2 | Dlaczego |
|---|---|---|---|
| Powieki | 1 serwo, podwójne ramię, dźwignie po jednej stronie | 4. MG90S, każda powieka ma własny czworobok; zaczep na powiece z tyłu boku (x −22), łącznik z drutu Ø1,2 | decyzja użytkownika; kolizje Fable K1–K3, Astra A1, Opus O-K1 |
| Ogranicznik gałki | nakrętki na prętach | okno w Uchwycie wokół Słupka (hull przekrojów słupka na granicy ±27/±17) | Fable W2, Astra A2, Opus O-W5 |
| Pręty gałki | końcówki M2 do kupienia | przeguby użytkownika: M2 przy gałce, M5 przy orczyku | B1 (23.10), zakaz zakupów |
| Układ serw | 3 serwa, pręt ψ po lewej, θ na dole | 4 serwa: ψ z prawej (ramię w górę), θ na górze, serwo powieki górnej z lewej u góry (odwrócone), dolnej na dole | jedyny układ, w którym przemiatanie przeszło (zał. A2) |
| Kardan | założony 3/5, L 23 | **5/5 zmierzony**: Ø11 × 25,5, otwory Ø5 gł. 7, trzpień M5 na 6, wkręty M4 9,1 od osi sworznia | pomiar 22.10 |
| MG90S | obwiednia SG90 | Miuzei MS60-4-D-V1: 22,4 × 12,1 × 22,8, czubek wałka 35, uszy 31,8 / rozstaw 27,7 / 2,0 na wys. 18 | pomiar 22.10 |
| Rama | rura z oknami, rantem w dół | rura **pełna** od z −3 do −37 (pas Obejmy), kołnierz przodu R35,2, druk tyłem w dół, rant z fazą 45° | Fable W6, W9, Opus D3, D4 |
| Obejma | PLA z pokrętłem (3 części) | PETG, M3×25 z nakrętką w kieszeni, wkrętak (ojciec); 2 części drukowane | Astra A7, Fable W6 |
| Rozruch | pierwszy impuls = sakada | zapis ostatniego impulsu w NVS, start od niego, potem rampa (decyzja użytkownika) | Astra A3 zamknięte decyzją |

## 2. Wymiary i miejsce

| Wielkość | Wartość | Status |
|---|---|---|
| Gałka | Ø60, czasza 230° (krawędź 115° od osi), ścianka 2, **biała, front gładki** (bez rowków i szwów; tęczówkę rysuje syn) | [F] decyzje 22.10 |
| Zakres | praca ψ ±25°, θ ±15°; ograniczniki ±27°/±17° | brief |
| Powieki (w układzie powieki) | górna: krawędź −9° (zamknięta) do +42° (otwarta), +47° przy podążaniu za θ +15, ogranicznik +49°; dolna: −11° do −38°, −43° przy θ −15, ogranicznik −45° | [R] |
| Środek kuli za powierzchnią dyni | 10 mm (`glebokoscSrodka`); gałka wystaje 20 mm, zamknięte powieki 24,7 mm | [Z], do potwierdzenia kartonem |
| Obwiednia przejścia | walec Ø79,5 od z +10 do z −72; poza nim tylko rant Ø84 przed dynią | [R] (kable: pkt 6) |
| Głębokość za wewnętrzną ścianką | 82 − w: **67 mm przy w 15**, 47 przy w 35 | [R]; wolne ok. 65 to szacunek, przy cienkiej ściance 2 mm za dużo (pytanie B6) |
| Rozstaw do środka małego oka (po łuku R150) | poziomo ≥ 117 (prawa strona) / ≥ 136 (lewa), pionowo ≥ 126 (góra) / ≥ 143 (dół) | [R] zał. A6; „po 3–4 z każdej strony” tylko przy rozłożeniu na boki dyni |

## 3. Mechanizm

### 3.1 Podparcie gałki: kardan 5/5

- **Źródło [F]:**
  - Cogley, [Eye Mechanism on the Cheap](https://www.instructables.com/3D-Printed-Animatronic-Eye-Mechanism-on-the-Cheap/): kardan 3 mm, druty z haczykami, [film](https://www.youtube.com/watch?v=I7IxOmThaxw);
  - zasada środka oka na sworzniach kardana: [Stan Winston School](https://forums.stanwinstonschool.com/discussion/comment/6206).
- **Pomiar [F]:** kardan 5/5, Ø11 × 25,5, środek krzyżaka 12,75 od czoła, otwory Ø5 głębokości 7, trzpień M5 wchodzi na 6, wkręty dociskowe M4 9,1 od osi sworznia (3,65 od czoła), zgięcie > 90°. Kardan 2/2 jest za słaby.
- **Tylna piasta:** w kieszeni Słupka (Ø11,3, luz 0,15/str., z −12,75…−5,5). Trzpień to M5×30 od tyłu przez Słupek, z nakrętką M5 w kieszeni wspornika.
  - **W8:** wkręt dociskowy piasty zastępuję dłuższym M4 bez łba. Przechodzi przez otwór Ø4,2 w ściance Słupka i wkręca się w gwint piasty.
  - Dzięki temu ścianka Słupka trzyma piastę osiowo i na obrót, a ten sam otwór służy do dokręcania kluczem.
  - Zdolność piasty do przeniesienia wyrwania [R]: ścianka 2,15 × Ø4 × 30 MPa ≈ 260 N.
- **Przednia piasta:** tak samo w piaście Uchwytu (z +5,5…+12,75), M4 przez ściankę Uchwytu, trzpień M5×12 wkręcony w Uchwyt (nakrętka w kieszeni).
- **Kąt kardana:** 28,9° w pracy, 31,6° na ogranicznikach. Kardan ma > 90°, zapas duży (Astra A5.3 zamknięte pomiarem).
- **Luz kardana:** do zmierzenia. Okrągła tęczówka ukrywa luz skrętny.
- **Ogranicznik gałki (W2, A2, O-W5) [R]:**
  - płyta Uchwytu na z = −6 w układzie gałki z oknem wokół Słupka;
  - kształt okna to otoczka przekrojów Słupka (R7,65) na całej granicy ±27°/±17°, łącznie z narożnikami, więc sprzężenie osi nie zjada zapasu. Półosie 12,04 (x) × 11,04 (y);
  - zapas w całym zakresie pracy ±25°/±15° ≥ 0,50 mm (≈ 2°);
  - rama okna (2 mm) ma ≥ 0,46 mm do prętów z kulkami M2;
  - siła przy 0,5 N·m: 0,5 / 0,006 = 83 N na wieniec Słupka, na wysokości z −5,5…−7.
- **Nacisk 20 N od przodu (A2):** idzie przez kardan (stal) w Słupek. Pręty S–S nie przeniosą go, dopóki luz kardana (do 0,15 mm) jest mniejszy niż luz przekładni i kulek: luz kątowy MG90S ok. 1° na r13 daje 0,23 mm [Z]. To trzeba sprawdzić testem T3.

### 3.2 Napęd gałki: pręty S–S na przegubach z warsztatu

- **Źródło [F]:** Cogley, [DIY Compact](https://www.instructables.com/DIY-Compact-3D-Printed-Animatronic-Eye-Mechanism/): MG90S, popychacze z „M2 servo ball-links” po stronie serwa, przy oku czopy.
- **Moja adaptacja [A]:** przegub kulowy na obu końcach.
  - S–S nie jest jedynym poprawnym wyborem (Astra A5.5, Fable D2): U–S też ma 5 stopni swobody. Jest za to najprostszy z części, które są w warsztacie.
  - Przydział: **M2 przy gałce** (mała obudowa wewnątrz kuli), **M5 przy orczyku** (za kulą jest miejsce). Każdy pręt ma jedną M2 i jedną M5.
  - Pręt drukuję płasko, Ø6 lub 6 × 5, z wkręconą śrubą M2×10 i M5×12. Długość reguluje się obrotem obudowy na gwincie.

| Element | Wartość [R] |
|---|---|
| Punkt X na Uchwycie | (+18; 0; −6), kulka M2 ∥ y gałki |
| Punkt Y | (0; +18; −6), kulka M2 ∥ y gałki |
| S_X (ψ) | oś ∥ x, płaszczyzna ramienia x +19, wałek (y −13; z −49), ramię r13 skierowane w górę, kulka M5 ∥ x w x +24; pręt 43,4 |
| S_Y (θ) | oś ∥ x, płaszczyzna ramienia x +8, wałek (y +3; z −49), ramię r15 w górę, kulka M5 w x +13; pręt 44,9 |
| Zakres serwa X (ogranicznik / praca) | −30,4…+43,1° / −28,6…+38,9° |
| Zakres serwa Y | −20,4…+28,5° / −18,2…+24,9° |
| Kąt nacisku po stronie orczyka | X ≤ 48,8°, Y ≤ 37,4° (przenoszenie ≥ 41°) |
| Kąt nacisku po stronie gałki (A5.1) | X ≤ 60,4° w pracy (63,7° przy 27/17) → przenoszenie ≥ 29,6°; Y ≤ 39,2° |
| Wychylenie kulek | M2 przy gałce ≤ 23,4° (X) / 19,2° (Y); M5 przy orczyku ≤ 14,2° / 20,5° |
| Sprzężenie (bez kompensacji) | serwo Y +5,4° przy ψ +25; serwo X +1,0° przy θ ±15 |
| Moment na wale przy 0,5 N·m na gałce (macierz pełna, A2) | X **0,644 N·m** (ψ +25, θ −15, moment wokół ψ), Y **0,528** |

Kinematyka odwrotna w firmware jest wzorem zamkniętym: A·cos α + B·sin α = K (pkt 9).

Ramiona orczyków X i Y drukuję (kieszeń fabrycznego orczyka jak w małym oku), z gniazdem kulki M5 i nakrętką M5. Fabryczny orczyk ma otwory Ø~1 co 2 mm [F], więc kulki M5 w nim nie osadzę.

### 3.3 Powieki: 4 serwa, czworoboki z drutu

**Źródło [F]:**
- Cogley Simplified ([Make](https://makezine.com/projects/simple-animatronic-eyes/)): „This pivot point is for the y-axis of the eye motion and the eyelids”, czyli powieki na osi pochylenia przez środek oka. Każda powieka ma własne serwo („eyelid servos”, 6 serw na 2 oczy) i łączy się z orczykiem przez łącznik i ramię.
- EyeMech ε3.2 ([GitHub](https://github.com/will-cogley/EyeMech_Epsilon)): 4 kanały powiek.
- Drut z zagięciem w otworze orczyka i części napędzanej: Cogley „on the Cheap” (cytat strony: „I bent a little hook into the wire and plugged one end into the servo horn”).

**Co biorę:** oś powiek przez środek kuli (wspólna dla obu powiek), osobne serwo, płaski czworobok dźwignia–łącznik–ramię, łącznik z drutu.

**Co zmieniam [A], z liczbami:**
- **Zaczep (wypust) na tylnej krawędzi powieki przy boku −x**, zamiast dźwigni przy osi. Przy osi pas między kulą a rurą ma 6,75 mm (Fable R3: zero układów).
  - Stos przegubu M3 z nakrętką DIN 985 to: łeb 2,45 + 2,4 + podkładka 0,5 + 2,4 + nakrętka 4,0 + koniec 0,6 = **12,35 mm**.
  - W punkcie J dostępne okno wzdłuż x to **3,3 mm** (kula R30,5 od środka, rura R37,25 od zewnątrz).
  - Zagięcie Z drutu Ø1,2 w zaczepie o grubości 2,4 zajmuje ±1,8 mm w x i ±0,6 promieniowo; sam wypust ±1,2 w x i R2 → mieści się (zał. A3).
- Łącznik z **drutu sprężynowego Ø1,2** [F, w warsztacie] z zagięciami Z na obu końcach, wykorbiony w x (czworobok płaski, sworznie ∥ x, kształt łącznika w x dowolny).
  - Wyboczenie: EI = 200 GPa · π·0,6⁴/4 = 20 357 N·mm². Przy L 50 (przegubowo) P_kr = π²EI/L² = **80 N**, wobec maksymalnie 8,9 N od zablokowanego serwa (0,177/0,020). Zapas 9×.
  - Drut Ø1,0 to zapas (P_kr 39 N), Ø2,0 ocynkowany odpada (otwory w orczyku Ø~1).
- Otwory na drut: Ø1,4 w zaczepie i w ramieniu (orczyk fabryczny rozwiercony z Ø~1 do Ø1,3).

| | Powieka górna (G) | Powieka dolna (D) |
|---|---|---|
| Zaczep J (stan zamknięty) | (−22,0; +25,6; −0,9), ρ 25,6 od osi x, kąt 92° (1° za tylną krawędzią) | (−22,0; −25,6; −0,9), kąt −92° |
| Serwo | S_PG: oś ∥ x, płaszczyzna ramienia x −30, wałek (y +18; **z −60**, serwo odwrócone: wałek przy tylnym czole), korpus x −27…+4, y 11,6…24,5 | S_PD: płaszczyzna ramienia x −21, wałek (y −27; z −49), korpus x −18…+13, y −33,5…−20,6 |
| Ramię | r20, drukowane (fabryczny ma najwyżej 17,5) | r17,5 = skrajny otwór fabrycznego orczyka |
| Łącznik (yz) | 49,95, wykorbienie 40 % długości od J | 41,7, wykorbienie 15 % |
| Skok serwa | 0 → +77,5° przy 0 → 58° powieki | 0 → −52,0° przy 0 → 34° |
| Kąt nacisku (orczyk / zaczep) | 46,0° / 46,5° | 35,8° / 22,2° |
| dφ/dα | 0,69–0,82 | 0,60–0,70 |

Tabela położeń przegubów w krokach: zał. A3.

**Kryteria zamknięcia i otwarcia (O-W2, A8):**
- Zamknięte nominalnie: −9°/−11°, szczelina 2° = 1,15 mm na R33. Limit programowy = położenie nominalne.
- Ograniczniki: 0,5° dalej dla każdej powieki, więc na ograniczniku zostaje 1° szczeliny = 0,58 mm na R33.
- **Kąciki:** szczelina rośnie z odległością ρ od osi powiek. Każdą krawędź przycinam o Δ(ρ) = max(0; (28,65/ρ − 1)/2)°. Daje to ≥ 0,5 mm szczeliny na ograniczniku na całej krawędzi, aż do ucha (ρ 4: przycięcie 3,1° na powiekę).
- **Otwarcie:** brzeg tęczówki Ø27 (26,7° od osi) przy θ +15 leży na 41,7°. Powieka górna przy podążaniu idzie do 47° (zapas 5,3°, A8/D3). Przy θ −15 dolna idzie do −43° (zapas 1,3°).
- **Wycięcie tylnej krawędzi górnej powieki:** w pasie x −0…+13 krawędź kończy się na 80° zamiast 91°, bo w otwartej powiece jest tam pręt θ (φ ≥ 139°). Z przodu nadal zakrywa kulę: R31,2·sin 80° = 30,7 > 30 [R].

### 3.4 Ręka dziecka, przycięcie

| Obciążenie | Droga siły | Liczby [R] |
|---|---|---|
| Obrót gałki poza zakres | okno Uchwytu na Słupek | 83 N na wieniec przy 0,5 N·m |
| Obrót gałki w zakresie | przez pręt i kulkę do przekładni | do 0,644 N·m (X) i 0,528 (Y), czyli 3,6× / 3,0× momentu zablokowania 0,177 N·m przy 4,8 V ([components101](https://components101.com/motors/mg90s-metal-gear-servo-motor)). **Ryzyko 1** |
| Nacisk 20 N na krawędź powieki | w zakresie: łącznik, serwo; poza zakresem: zaczep na wypust Ramy (zamknięcie −0,5°, otwarcie +2°) | moment na wale do 0,567 N·m (G), 0,489 (D) przed ogranicznikiem |
| Przycięcie palca przy zablokowanym serwie, każda powieka osobno (A4) | — | górna 6,6 N przy zamknięciu (najwyżej 7,7 w zakresie), dolna 7,5 N (najwyżej 8,8) na R33,4; rant R1,5 |
| 20 N od przodu | kardan, Słupek | pkt 3.1 |
| Wyrwanie powieki | ucho na DIN 913, zaczep | pierwsze pęka ucho Powieki (2,4 × 2,35 PLA, ok. 450 N); Rama ma wypust 3,25 z gwintem (ok. 530 N) [R, szacunek] |

**Szczeliny:**
- powieka do kołnierza przodu Ramy (R35,2) 0,5 mm;
- powieka do rury 3,05 mm;
- gałka do powieki 1,2 mm.

Normę EN 71-1 (5/12 mm) przywołuję tylko jako analogię (Fable D4, Astra A4), nie jako wymaganie. Z zewnątrz nie ma łbów: osie powiek to DIN 913 zlicowane z rurą.

**Łożyska z warsztatu:** 608-2RS (8 × 22 × 7) i 6802-2RS (15 × 24 × 5) **nie są używane**. Ucho powieki ma 2,4 mm, a bok osi 3,25 mm, więc łożysko B 5–7 i D 22–24 tam się nie zmieści. Kardan już jest stalowy. Nigdzie łożysko nie daje przewagi wobec M3 w luźnym otworze.

## 4. Mocowanie w dyni

Rekomenduję **M1 – Obejmę z PETG**. Pozostałe warianty bez zmian względem v1 (M2 zapadki, M3 rygle), odrzucone tak jak tam.

- **Części drukowane mocowania:** Rama (rant, rura) i Obejma, czyli 2 (A7).
  - Zacisk: M3×25 z nakrętką samohamującą w kieszeni sześciokątnej, dokręcany wkrętakiem PH2 przez wieczko (robi to ojciec; brief dopuszcza narzędzie).
  - PETG zamiast PLA ze względu na pełzanie (W6), dokręcenie po 24 h w instrukcji.
- **Rura pełna** (bez okien) od z −3 do −37. Obejma o szerokości 10 siedzi na z −5…−35 dla ścianki 15–35 (W6, D3).
- **Rant** Ø84, 2 mm poza otwór, spód po R150, 8 ząbków. Pole docisku 515 mm² (A7).
- **Kołnierz Obejmy** Ø96. Na wklęsłej ściance (R115–135) dotyka brzegiem, ok. 900 mm² [Z].
- **Obciążenia [R]:**
  - masa 225 g → 2,2 N;
  - środek ciężkości z −28,7, 23,7 mm za ścianką przy w 15, moment 0,052 N·m;
  - pchnięcie gałki z boku 20 N na ramieniu 35 mm daje 0,7 N·m, czyli ok. 47 N na rancie przy w 15 (0,09 MPa).
- **P5 (W10, A7):**
  - wycinek dyni grubości 15 i 35 mm, rant, odcinek rury, Obejma;
  - obciążenie osiowe ±10 N w obu kierunkach i moment 0,7 N·m;
  - przesunięcie i obrót po 24 h i 72 h, potem ponowny montaż.
  - Kryterium: przesunięcie ≤ 1 mm, obrót ≤ 2° po 72 h.

## 5. Lista części

DFAM: płaska strona na stół, podpory nazwane wprost (A9, Opus W3).

| Część | Funkcja | Wymiary | Masa [R] | Druk |
|---|---|---|---|---|
| **Rama** | rant Ø84, rura Ø79,5/75,5 pełna z +10 do −37, kołnierz przodu R35,2, boki osi powiek (3,25), wypusty ograniczników powiek, wspornik Słupka (2 ramiona: 250° i 290°, z −33…−37), 3 ucha do Płyty | Ø84 × 47 | 35 g | **tyłem w dół** (ramiona wspornika na stole), rant u góry z fazą 45°; otwory osi poziomo, kształt kropli; wypusty ograniczników z fazą 45° |
| **Słupek** | kieszeń tylnej piasty, otwór M4 dostępowy, trzpień M5, wieniec ogranicznika R7,65 | Ø15,3 × 28 | 3 g | pionowo, kołnierzem w dół |
| **Płyta serw** | tylna tarcza (z −67…−70) z wycięciem na ramię i drut powieki górnej (x −29…−36, y −3…+6), klatka 4 serw do przodu (S_PG odwrócone), kanały kabli, 3 słupki do uch Ramy (z −37) z M3 | Ø79 × 33 | 18 g | tarczą w dół, ścianki i słupki pionowo |
| **Gałka** | czasza 230°, 2 nadlewy M3 od tyłu, front gładki | Ø60 | 19 g | krawędzią tylną w dół, front do góry, szew z tyłu. Sklepienie wnętrza Ø~40 powyżej 45° drukuje się bez podpór jak u Cogleya [F, whitepaper V1]; zwis wnętrza niewidoczny, ale **do sprawdzenia** na pierwszym wydruku |
| **Uchwyt gałki** | płyta ogranicznika z oknem (z −6), piasta przedniej piasty kardana (M4 dostępowy), ramiona do X i Y z kulkami M2, łuki do nadlewów Gałki | 50 × 45 × 22 | 4 g | płytą ogranicznika w dół; piasta na 2 słupkach (most ≤ 20 mm) |
| **Powieka górna** | czasza R31,2–33,4, zakres 100° z wycięciem do 80° w pasie x −0…13, rant 3,5 przy krawędzi, ucha (2,4) z obu stron, zaczep J na boku −x, przycięcie kącików | 69 × 70 × 35 | 11,5 g | płaszczyzną krawędzi przedniej na stół (Cogley V3 wg researchu), 5 obrysów; podpory drzewiaste tylko od strony wklęsłej, opisane w README |
| **Powieka dolna** | jak górna, zakres 79°, zaczep J na boku −x | 69 × 70 × 30 | 9 g | jak wyżej |
| **Pręt X**, **Pręt Y** | pręt Ø6 z gwintami M2 (gałka) i M5 (orczyk) | 43,4 / 44,9 między środkami kulek | 2 g | płasko |
| **Ramię X**, **Ramię Y** | kieszeń fabrycznego orczyka, gniazdo kulki M5 z nakrętką | r13 / r15 | 2 g | płasko |
| **Ramię powieki górnej** | kieszeń orczyka, otwór Ø1,4 na r20 | 26 × 8 × 3 | 1 g | płasko |
| **Obejma** | PETG, C z uchem i kieszenią nakrętki M3 | Ø96 × 10 | 12 g | kołnierzem w dół |
| *Przyrząd zera gałki* | czapka na gałkę zaczepiona w rant: ψ = θ = 0 | Ø70 × 25 | 6 g | |
| *Klin powiek* | trzyma obie powieki w położeniu 1500 µs (górna 29°, dolna 17° od zamknięcia: połowa **kąta powieki**) | 30 × 10 × 6 | 1 g | |
| *Przyrząd długości prętów* | listwa z kołkami 43,4 / 44,9 | 55 × 8 | 1 g | |

**Wszystkie wydruki** ok. 115 g, wszystko mieści się na A1 mini.

**Z warsztatu:**
- 4 × MG90S;
- kardan 5/5;
- przeguby kulowe 2 × M2 i 2 × M5;
- drut sprężynowy Ø1,2 (2 × ok. 60 mm);
- DIN 913 M3×8 × 2 (osie powiek);
- M4 bez łba × 2 (dłuższe niż fabryczne dociskowe, do docięcia);
- M5×30 i M5×12 z nakrętkami;
- M2×10 × 2;
- M3: 8 × M3×10 (uszy serw), 3 × M3×8 (Płyta), 2 × M3×8 (Gałka), M3×25 z nakrętką samohamującą (Obejma);
- śruby kulek M5 z nakrętkami.

Masy kupnych części: serwa 53,6 g, kardan ok. 12 g, śruby ok. 25 g, kable 12 g. **Razem ok. 225 g ±20 %.**

## 6. Połączenia i stosy (A1, Fable K3, W5, W12)

| Para | Pasowanie | Luz | Stos i długość śruby z łańcucha |
|---|---|---|---|
| Gałka – powieki | ruchome współśrodkowe | 1,2 promieniowo (`luzPowieka`) | — |
| Ucho dolnej – ucho górnej – bok Ramy | obrotowe na śrubie | osiowo 0,25 ×2; ucha Ø3,4 (0,2/str.) | DIN 913 M3×8: bok 3,25 (gwint, Ø2,5) + 0,25 + 2,4 + 0,25 + 2,4 = 8,55 → koniec 0,55 przed wewnętrzną ścianą ucha dolnego, zewnętrzny koniec zlicowany z R39,75 |
| Drut – zaczep / ramię | sworzeń Z | otwór Ø1,4 / drut 1,2 | zaczep 2,4 + 2 × noga 1,2 → ±1,8 w x |
| Pręt X/Y – kulki | przeguby RC | fabryczny | M2 w Ø1,7 (Uchwyt, 4 mm gwintu); M5 przez Ramię Ø5,3 z nakrętką M5 (Ramię 3 + nakrętka 4 + podkładka 1 = 8 → śruba kulki do pomiaru B1) |
| Ramię – orczyk | kieszeń orczyka | jak v2.8 | wkręt środkowy M2 serwa |
| Kardan tył – Słupek | kieszeń Ø11,3 | 0,15/str. | M5×30: łeb przy wsporniku, wspornik 4 + Słupek 21 + piasta 6 → M5×30, nakrętka w kieszeni wspornika; M4 bez łba: ścianka 2,15 + gwint w piaście 3 + docisk → M4×6 lub dłuższy docięty |
| Kardan przód – Uchwyt | kieszeń Ø11,3 | 0,15/str. | M5×12: Uchwyt 5 (nakrętka w kieszeni) + piasta 6; M4 jak wyżej |
| Gałka – Uchwyt | stałe | — | 2 × M3×8: łuk Uchwytu 2,5 (luźno) + nadlew 5,5 (ciasno) |
| Serwa – klatka | stałe | korpus 0,4 przód/tył | M3×10: ucho 2,0 + ścianka 8 (Ø2,6); **czy M3 przechodzi przez ucho MG90S – B4** |
| Płyta – Rama | ślizgowe środkujące | 0,25 i fazka | 3 × M3×8 |
| Obejma – rura | ślizgowe, potem zacisk | 0,3/str. | M3×25: ucho 2 × 6 + szczelina 3 + nakrętka 4 = 19 + 1,5 |
| Ruchome obok siebie | ≥ 0,5 w całym zakresie | — | przemiatanie: zał. A4 |

Gdzie łeb 2,45 się nie mieści: oś powiek (stąd DIN 913) i zaczep J (stąd drut).

**Kable MG90S (Fable W4):** wychodzą przy wałku z krótszego boku, czyli dla serw ∥ x z czoła z −43,1, a dla odwróconego S_PG z czoła z −65,9. Kanały w Płycie wzdłuż korpusów do tyłu, przed czołem z ≤ −38. Kable S_X i S_Y biegną po zewnętrznej stronie klatki, z dala od ramion. Wymaga sprawdzenia w Assembly z PODGLĄD kabla Ø3 × 1,2.

## 7. Położenia i znaki

**Przeguby gałki w skrajnych położeniach** (P = kulka M2, H = kulka M5):

| (ψ; θ) | serwo X | P_X | H_X | serwo Y | P_Y | H_Y |
|---|---|---|---|---|---|---|
| (0; 0) | 0 | (18; 0; −6) | (24; 0; −49) | 0 | (0; 18; −6) | (13; 18; −49) |
| (+25; 0) | −28,5 | (13,8; 0; −13,0) | (24; −1,6; −55,2) | +5,4 | | (13; 17,9; −47,6) |
| (−25; 0) | +38,9 | (18,8; 0; 2,2) | (24; −2,9; −40,8) | −0,5 | | |
| (0; +15) | +1,0 | | | +19,1 | (0; 18,9; −1,1) | (13; 17,2; −44,1) |
| (0; −15) | +1,0 | | | −17,2 | (0; 15,8; −10,5) | (13; 17,3; −53,4) |
| (+27; +17) | −25,9 | | | +28,5 | | (13; 16,2; −41,9) |
| (−27; −17) | +42,7 | (18,8; 0,8; 2,7) | (24; −3,4; −40,2) | −19,8 | | (13; 17,1; −54,1) |

Przeguby powiek: zał. A3.

**Znak dodatni każdego serwa** (kąt α rośnie od +y w stronę +z, patrząc wzdłuż +x):
- X: α dodatnie = gałka w lewo (ψ ujemne);
- Y: α dodatnie = gałka w górę;
- P_G: α dodatnie = powieka górna się otwiera;
- P_D: α ujemne = powieka dolna się otwiera.

Który kierunek impulsu µs odpowiada α dodatniemu, zależy od egzemplarza serwa. Kalibracja ustawia znak flagą w NVS.

## 8. Zmienne do Variable Studio

**Gałka i dynia:** `kulaD` 60, `czaszaKat` 230, `glebokoscSrodka` 10, `otworD` 80, `luzOtworu` 0,25, `obwiedniaR` = `otworD`/2 − `luzOtworu`, `rantD` = `otworD` + 4, `dyniaR` 150, `dociskMin` 15, `dociskMax` 35, `scRury` 2, `kolnierzR` 35,2.

**Kardan:** `kardanD` 11, `kardanL` 25,5, `kardanB` = `kardanL`/2, `kardanSrubaOd` 9,1, `kardanOtworGl` 7, `kardanTrzpienGl` 6, `luzKieszeni` 0,15.

**Ogranicznik:** `oknoZ` 6, `oknoA` 12,04, `oknoB` 11,04 (z rachunku otoczki; zależne od `zakresPsi` + `zapasOgr`, `zakresTheta` + `zapasOgr`, `slupekR` 7,65), `zakresPsi` 25, `zakresTheta` 15, `zapasOgr` 2.

**Pręty gałki:** `pktR` 18, `pktZ` −6, `zSerw` −49, `orczykX` 13, `orczykY` 15, `walX_y` −13, `walY_y` 3, `ramieX_x` 19, `ramieY_x` 8, `kulkaM5Od` 5, `pretX` 43,4, `pretY` 44,9.

**Powieki:**
- `luzPowieka` 1,2, `scPowieki` 2,2, `rantPowieki` 3,5, `ucho` 2,4, `luzOsiowy` 0,25;
- `zamkG` −9, `zamkD` −11, `otwG` 42, `otwD` −38, `podazanie` 5, `zapasZamk` 0,5, `zapasOtw` 2, `zakresG` 100, `zakresD` 79;
- `wyciecieG` 80 (pas `wyciecieX1` 0, `wyciecieX2` 13);
- `zaczepX` −22, `zaczepRho` 25,6;
- `ramieG` 20, `ramieD` 17,5;
- `walPG` (−30; 18; −60), `walPD` (−21; −27; −49);
- `lacznikG` 49,95, `lacznikD` 41,7, `drutD` 1,2, `otworDrutu` 1,4.

**MG90S:** `serwoL` 22,4, `serwoW` 12,1, `serwoH` 22,8, `serwoWalek` 35, `serwoWalekOd` 5,5, `serwoUszy` 31,8, `serwoUszyRozstaw` 27,7, `serwoUchoT` 2,0, `serwoUchoZ` 18, `luzKorpusSerwa` 0,4.

**Śruby:** `m3Ciasny` 2,6, `m3Luzny` 3,3, `m3Os` 2,5 (DIN 913 w boku), `uchoOtwor` 3,4, `m5Luzny` 5,3, `m4Otwor` 4,2.

**K9 (zginanie), oczekiwane wyniki:**
- `kulaD` 58↔60: wszystkie promienie powiek, rury i J −1;
- `glebokoscSrodka` 8↔12: rant się przesuwa, J bez zmian;
- `dociskMax` 30↔35: koniec rury i pas Obejmy;
- `luzPowieka` 1,0↔1,5: promień powiek i kołnierza;
- `zapasOgr` 1,5↔2,5: okno ±0,25.

Za każdym razem trzeba powtórzyć skrypt przemiatania.

## 9. Napędy, prąd, firmware

**Momenty robocze** [R; moment roboczy przyjęty jako ½ zablokowania = 0,09 N·m, Z]:
- X ok. 7·10⁻³ N·m (zapas 13×);
- Y ok. 8·10⁻³ (11×);
- powieka górna: mrugnięcie 2,9·10⁻³ / 0,75 + ciężar ≤ 2,5·10⁻³ → ok. 8·10⁻³ (11×);
- dolna ok. 6·10⁻³ (15×).

**Bez PWM:** moment od ciężaru na wale ≤ 3,2·10⁻³ N·m (górna powieka 2,5·10⁻³ / 0,76). Test (D2, A10): 25 g na ramieniu 16 mm, czyli 3,9·10⁻³ N·m, ≥ 1,2 × najgorszy przypadek. W rzeczywistym mechanizmie, w położeniu parkowania i przy otwartej powiece, serwo nie może się obrócić, bez zasilania i z zasilaniem bez PWM.

**Prąd: tylko szacunki, pomiaru MG90S brak.**

| Stan | Duże oko (4 × MG90S) | Cała dynia (10 × SG90, ESP z AP) |
|---|---|---|
| spoczynek, PWM wł. | 4 × ok. 10 mA [Z] | 0,18–0,23 A |
| praca | sakada (2 serwa) i mrugnięcie (2 serwa): do 4 × 0,25 = 1,0 A przez ok. 0,12 s; średnio przy 1 sakadzie/s i 1 mrugnięciu na 4 s ok. 0,1 A [Z] | szczyt ok. 1,6 A, średnio 0,3–0,4 A |
| rozruch | jeden impuls z NVS na serwo, co 150 ms; serwo, które stoi na zapisanym położeniu, nie rusza | szczyt jak jedno serwo w ruchu |
| zablokowanie (ręka) | 4 × 0,65–0,8 A [Z, źródło wtórne] = 2,6–3,2 A w najgorszym razie (A10); realnie 1–2 serwa | do ok. 3,4 A, więcej niż port 3 A: zależy od E5.5 |

**Kanały:** 12 = X, 13 = Y, 14 = powieka górna, 15 = dolna. Małe oczy 0–11 (najwyżej 12; plan ok. 10).

**Podtrzymanie powerbanku:** z GPIO ESP przez tranzystor (stopień wykonawczy, A10). Kanał zostaje wolny. Wybór źródła należy do E5.5.

**Rozruch (decyzja użytkownika 22.10):**
- firmware zapisuje w NVS ostatni zadany impuls każdego serwa;
- po włączeniu wysyła najpierw ten impuls, potem płynnie prowadzi do pozycji startowej;
- skok jest możliwy tylko po zaniku prądu w trakcie ruchu albo po ręcznym przestawieniu oka.

**Mechanizm przeżyje taki skok z każdej pozycji:** przemiatanie objęło wszystkie kombinacje położeń czterech napędów (gałka × powieka górna × powieka dolna, niezależnie), a cele leżą w limitach, 2° przed ogranicznikami. Skok nie kończy się na ograniczniku.

**Inne:**
- kinematyka odwrotna prętów wzorem zamkniętym;
- dla powiek tablica kąt powieki → µs (16 punktów) z kalibracji;
- powieki podążają za θ: otwG + 0,33·θ dla θ > 0, otwD − 0,33·|θ| dla θ < 0.

## 10. Montaż na stole (z synem) i kalibracja

**(S)** = krok dla syna, reszta dla ojca.

1. Powieki od tyłu w Ramę (dolna, potem górna), wyrównanie uch. **(S)** wkręca 2 × DIN 913 kluczem 1,5 aż do zlicowania. Ojciec sprawdza zlicowanie linijką.
2. Drut: zagięcie Z na jednym końcu (ojciec, szczypce), przełożenie przez zaczep J, drugie zagięcie według przyrządu długości. Wpięcie w ramię orczyka dopiero w kroku 8.
3. Słupek do wspornika Ramy na M5×30 z nakrętką. Tylna piasta w kieszeń, M4 przez ściankę.
4. Serwa w klatce Płyty (8 × M3×10), kable w kanałach. **(S)** podaje śruby według kolorów na rysunku.
5. Uchwyt: przednia piasta, M5×12, M4. Kulki M2 na X i Y. Pręty ustawione na przyrządzie długości. **(S)** zatrzaskuje pręty na kulkach.
6. **(S)** wkłada gałkę na Uchwyt, ojciec przykręca 2 × M3×8 od tyłu.
7. Płyta do Ramy (3 słupki, 3 × M3×8). Gałka wchodzi od tyłu w powieki.
8. Program `kalibracja`, wszystkie 4 serwa na 1500 µs przez cały czas nasadzania.
   - Przyrząd zera gałki. Ramię X i Y na najbliższy ząb do znacznika na Płycie (wielowypust 20T = 18°/ząb). Pręt M5 na kulkę ramienia.
   - Klin powiek. Orczyk dolnej fabryczny r17,5 i ramię górnej r20, druty w otwory.
   - Drugiej gałęzi nie da się złożyć: pręt 43,4 nie sięga ramienia odwróconego o 180° (różnica 26 mm), łącznik powieki nie wejdzie przy zaczepie po drugiej stronie wypustu.
9. **(S)** na stronie w telefonie: suwak każdego serwa ±100 µs powoli. Ojciec zapisuje µs dla ψ ±25, θ ±15, powiek (zamknięte, otwarte) i sprawdza 2° do ograniczników. Kompensacja zęba (do ±9° serwa) idzie środkiem w µs, nie przez obracanie końcówki (Opus D1: ½ obrotu M2 to 0,2 mm, czyli 0,9° serwa).
10. Test 24 h na stole.

**W dyni:**
1. Ojciec wierci otworem 80.
2. **(S)** wsuwa moduł z zewnątrz, kablami naprzód, do oparcia rantu.
3. Ojciec przez wieczko nasuwa Obejmę na tył modułu do oporu o ściankę i dokręca M3×25 wkrętakiem.
4. **(S)** wpina 4 wtyczki według numerów.

Wyjęcie w odwrotnej kolejności. Gniazdo w Obejmie zostaje bez zmian.

| Serwo | Zakres bez kolizji | Ograniczniki |
|---|---|---|
| X | ψ ±27 = serwo −30,4…+43,1° | okno Uchwytu / Słupek |
| Y | θ ±17 = −20,4…+28,5° | jw. |
| P_G | 0…77,5° (powieka −9,5…+49°) | zaczep J na wypusty Ramy |
| P_D | 0…−52,0° | jw. |

## 11. Ryzyka (top 5)

| # | Miejsce | Scenariusz | Test i kryterium |
|---|---|---|---|
| 1 | Przekładnie MG90S i wielowypust Ramienia | dziecko obraca gałkę w zakresie pracy (do 3,6 × moment zablokowania) albo naciska powiekę | **T1** (O-W1): zasilone serwa, 15 N na źrenicy w 4 kierunkach i 20 N na krawędź każdej powieki, 20 razy. Zaliczone, gdy zero ≤ 10 µs (≈ 1°), brak luzu w kieszeni orczyka > 0,5°, kulki na miejscu, temperatura serwa po 10 s zablokowania ≤ 50 °C |
| 2 | Zaczep J i drut powieki górnej (najciaśniejsze miejsca: drut do rury 0,52, zaczep do gałki 1,0, do rury 1,2) | owalizacja czaszy, ugięcie drutu, zagięcie Z wychodzi z otworu | **P3**: wycinek Ramy z osią, obie powieki, oba druty, ramię na serwie, atrapa gałki R30; 1000 mrugnięć, pomiar wystawania DIN 913 (≤ 0,2 mm) i szczeliny w kącikach (≥ 0,5) |
| 3 | Przeguby z warsztatu (wymiary nieznane) | obudowa M2 > Ø7 albo M5 > Ø14, wychylenie < 25°/21° | pomiar B1, **P4**: kulka M2 na Uchwycie przy 25°, M5 przy 21°, wyrwanie ręką ≥ 30 N |
| 4 | Obejma w mokrym miąższu | luzowanie po 1–2 dniach | **P5** (pkt 4) |
| 5 | Głębokość 67 mm za ścianką 15 mm i rozstaw do małych oczu | moduł uderza w wieżę lub moduł sąsiedni | Assembly z PODGLĄD wieży i małych oczu; karton Ø84 na dyni |

## 12. Próbki (jedna runda)

| Próbka | Co rozstrzyga |
|---|---|
| P1 Kardan 5/5 w Słupku i Uchwycie | kieszenie 0,15, M4 przez ściankę, ogranicznik okna (kontakt przy 27/17), dostęp klucza |
| P2 Kieszeń MG90S | luz 0,4, M3 w uchu |
| P3 Oś i napęd powiek | pkt 11 / 2 |
| P4 Przeguby kulowe | pkt 11 / 3 |
| P5 Mocowanie w miąższu | pkt 4 |

## 13. Pomiary (stan na 23.10) i warunki odrzucenia

| Element | Stan | Przyjęty przedział | Warunek odrzucenia |
|---|---|---|---|
| Kardan 5/5 | **zmierzony** [F] | — | luz > 0,3 mm → drganie gałki; wymiana na krzyżak drukowany (nowy rachunek) |
| MG90S | **zmierzony** [F] (±0,2–0,3) | otwór ucha 2,0–2,5 | otwór < 2,9: M3 nie wchodzi → M2,5 albo rozwiercenie (B4) |
| **Przeguby M2 i M5** | brak | M2: kula Ø4,8, obudowa ≤ Ø7, wychylenie ≥ ±25°; M5: obudowa ≤ Ø14, wychylenie ≥ ±21° | M2 > Ø7,5 albo < 24°, M5 > Ø15 albo < 21° → przeliczenie punktów X/Y i ramion; przy wychyleniu < 20° przegub drukowany 2-DOF jako próbka |
| Drut | **znany** [F]: sprężynowy Ø1,0 i Ø1,2, ocynkowany Ø2,0 (po 500 mm) | — | — |
| DIN 913 M3 | **w warsztacie** [F] | — | — |
| Otwór wieczka, wieża, wolne miejsce za ścianką | brak | ≥ 106 / 105 × 60 / 65 | wolne < 67 przy ściance 15 → skrócić rurę o różnicę (`dociskMax` 30) albo większa dynia |

## 14. Pytania do użytkownika

| # | Pytanie | Propozycja |
|---|---|---|
| **B1 (blokujące)** | Wymiary przegubów kulowych M2 i M5: Ø kuli, gwint i długość czopa, średnica i długość obudowy, kąt do oporu, typ (z czopem czy na śrubę) | — |
| **B4 (blokujące dla klatki)** | Średnica otworu w uchu MG90S (czy wchodzi M3) | M3, jak w v2.8 |
| B5 | Głębokość wolna za ścianką (odległość ściany wieży od wewnętrznej ścianki dyni na wysokości oka) | ≥ 67 przy ściance 15 |
| B6 | Gałka wystaje 20 mm, zamknięte powieki 25 mm. OK? | tak, karton Ø84 |
| B7 | Rozstaw: najbliższe małe oko ≥ 117 mm z prawej i ≥ 136 z lewej (po łuku). Czy „3–4 z każdej strony” może iść na boki dyni? | tak, 2 najbliższe pochylić o 10–15° od dużego oka |
| B8 | Obejma z PETG, dokręcana wkrętakiem przez wieczko | tak |

## 15. Uwagi z review → co zrobiono

**Astra**

| ID | Uwaga | Co zrobiono |
|---|---|---|
| A1 | Nakrętka przegubu w gałce, stosy śrub | Czworobok z jednym serwem usunięty. Przy osi brak miejsca na M3 z nakrętką (12,35 wobec 3,3 mm), więc łącznik z drutu Ø1,2 z zagięciami Z. Stosy z DIN 985 4,0, łbami 2,45, podkładką Ø7 w pkt 6. Zaczep do gałki 1,0, do rury 1,2 (A4) |
| A2 | Ograniczniki nie chronią przekładni | Ogranicznik na Uchwycie i Słupku. Moment w zakresie z pełnej macierzy: 0,644 N·m. Sprawdzonej ochrony bez zakupów brak → ryzyko 1, test T1 z kryterium |
| A3 | Rozruch ze skokiem | Zamknięte decyzją użytkownika (NVS, rampa); mechanizm przemieciony we wszystkich kombinacjach (pkt 9) |
| A4 | 5,6 N to nie granica przycięcia | Siła osobno dla każdej powieki przy jej serwie: 6,6–7,7 N i 7,5–8,8 N; pomiar na przyrządzie w P3 |
| A5 | Parametry kinematyki | Jedna tabela zakresów (pkt 3.2, 10), orientacje kulek, definicja kąta po obu stronach (gałka X ≥ 29,6° przenoszenia), S–S nie jest jedyne (U–S też ma 5) |
| A6 | Obrys i Ø56 | Ø60 zostaje (DIN 913 jest). Głębokość policzona do z −72 (67/47 mm). Kable i wtyczki: kanały, sprawdzenie w Assembly |
| A7 | Obejma: zacisk ≠ docisk; 3 części | Pokrętło zastąpione śrubą i wkrętakiem (2 części); korekty liczb (1,72 N, 0,052 N·m, 515 mm²); P5 z 0,7 N·m, obie ścianki, 72 h |
| A8 | Luzy i tolerancje | Przemiatanie wszystkich par z pełnymi okuciami; szczelina zamknięcia na całej krawędzi (przycięcie kącików); otwory uch Ø3,4 (0,2/str.); zapas tęczówki 5,3° |
| A9 | DFAM | Płaska strona i podpory każdej części (pkt 5); Rama tyłem w dół; sklepienie Gałki i powieki do sprawdzenia na wydruku |
| A10 | Prąd i bez PWM | Budżet z 4 serwami; test 25 g / 16 mm; GPIO przez tranzystor |
| A11 | Źródła | Rozróżnienie źródło / adaptacja w każdym podzespole (3.1–3.3); M3 w uszach v2.8 nazwane jako model bez potwierdzonego wydruku |
| A12 | Blokady CAD | Jeden wariant 2c z kompletem części; pomiary uzupełnione; M2 tylko w przegubach gałki (gwint przegubu z warsztatu) i wkręcie orczyka |

**Fable**

| ID | Uwaga | Co zrobiono |
|---|---|---|
| K1 | Dźwignia poza Ø79,5 | Dźwignie przy osi usunięte; zaczepy przy x −22, R_xy 33,8 (do rury 1,2 mm) |
| K2 | Kolizje w pasie 10 mm | Każda powieka ma jedno serwo i jeden drut; przemiatanie: G–D ≥ 10 mm |
| K3 | Okucia w gałce | Brak okuć przy osi; zaczep do gałki 1,0 mm |
| W1 | Ø55, nie Ø56 | Zbędne: DIN 913 jest, Ø60 zostaje |
| W2 | Ograniczniki na prętach | Okno Uchwytu na Słupek |
| W3 | Końcówki kulowe | Przeguby z warsztatu, wymiary do B1, warunek odrzucenia (pkt 13) |
| W4 | Kable do gałki | Kanały w Płycie (pkt 6) |
| W5 | Warstwy cięgien | Jeden stos na przegub; druty różnych powiek ≥ 10 mm od siebie |
| W6 | Obejma na oknach, pełzanie | Rura pełna z −3…−37, PETG, dokręcenie po 24 h |
| W7 | Otwory w Płycie | Tarcza Płyty jest z tyłu (z −67…−70), więc pręty X/Y i druty jej nie przecinają (jedno wycięcie na ramię i drut powieki górnej); słupki Płyty stoją poza drogami prętów (do sprawdzenia w Assembly); ograniczniki nie są na prętach |
| W8 | Widełki kardana osiowo | M4 bez łba przez ściankę Słupka/Uchwytu do gwintu piasty |
| W9 | Rama nie leży płasko | Druk tyłem w dół, rant z fazą 45° |
| W10 | P5 za łagodna | 0,7 N·m, ±10 N, 24 i 72 h |
| W11 | Wycięcia czasz | Wycięcie górnej do 80° (x −0…13) pod pręt θ; zaczepy za tylnymi krawędziami |
| W12 | Konwencje, mapa | Pkt 7, zał. A3 |
| D1–D8 | moment 0,033; A1 za mocne; tęczówka; EN 71; orczyki poza wieżą; Face maker; film ε3.2; drut | 0,052 (225 g, 23,7 mm); U–S dopuszczone; tęczówka 5,3°; EN 71 jako analogia; pudełko MG90S 3–34 mm pod płaszczyzną ramienia; Face maker nie jest źródłem kardana; film ε3.2 to montaż; drut użyty w powiekach |

**Opus (recenzent)**

| ID | Uwaga | Co zrobiono |
|---|---|---|
| O-K1 | Sprzężenie się nie mieści | Usunięte; 4. MG90S zgodnie z Twoją propozycją (a), ale dźwignie przy osi i tak się nie mieszczą, więc zaczepy na powiekach przy x −22 |
| O-W1 | Brak kryterium testu | T1 z kryterium (pkt 11) |
| O-W2 | Szczelina w kącikach | Przycięcie Δ(ρ), ograniczniki 0,5° za zamknięciem, szczelina ≥ 0,5 na całej krawędzi |
| O-W3 | Nawisy | Pkt 5 |
| O-W4 | DIN 913: gwint, wędrówka | Otwór Ø2,5 w boku (ciasny gwint), koniec 0,55 przed uchem dolnym; P3 z pomiarem wystawania po 1000 cyklach. Kołki stalowe odpadają (zakaz zakupów) |
| O-W5 | Ogranicznik wewnątrz zakresu | Okno jako otoczka granicy z narożnikami: zapas ≥ 0,50 w całym zakresie ±25/±15 |
| O-W6 | DIN 985 4,0, braki geometrii | Stosy w pkt 6; Uchwyt, wspornik, ograniczniki opisane; M2 nakrętki zbędne |
| O-D1–D7 | ½ obrotu; test bez PWM; Obejma na oknach; szczelina przodu 5,9; czoło Słupka; budżet operacji; rozruch | Środek w µs; 25 g/16 mm; rura pełna; kołnierz R35,2 (szczelina 0,5); czoło Słupka z −5,5 z wymiaru piasty 12,75; Płyta i Rama: plan drzewa może dzielić operacje (klatka jako osobny folder); rozruch z NVS |

## Werdykt

V2 jest **gotowa do drugiej rundy review**. Napęd powiek oparto na sprawdzonej zasadzie Cogleya (osobne serwo, łącznik drutowy). Przemiatanie wszystkich par w pełnych, niezależnych zakresach nie pokazało miejsca poniżej 0,5 mm. Napęd gałki działa na przegubach z warsztatu.

**Najsłabszy punkt:** przekładnie MG90S nie są chronione przed ręką dziecka w zakresie pracy (do 3,6 × moment zablokowania). Ryzyko rozstrzygnie dopiero test T1. Drugi w kolejności jest napięty upakowaniem zaczep i drut powieki górnej.

---

## Załącznik: rachunki

Skrypty w scratchpadzie sesji: `v2/model.py`, `plan.py`, `final.py`, `eyefinal.py`, `stop3.py`, `report_nums.py`. Model uproszczony:
- pręty jako walce;
- kulki M2 R3,5, M5 R7,0;
- drut R0,6;
- zaczep J jako walec ±1,2 R2 i drut ±1,8 R0,6;
- przegub H jako walec 5 mm R2;
- ramiona orczyków R3 (do korpusów 1,5 w x);
- korpusy MG90S jako prostopadłościany 3–34 mm pod płaszczyzną ramienia, ±6,45 i czoło 5,9 / tył 17,3 od wałka;
- gałka R30 (strefa z < −26 za gałką);
- czasze powiek R31,2–34,7 w swoich sektorach;
- rura R37,75 (z ≥ −37), obwiednia R39,75;
- Słupek R7,65 (z −37…−5) i 2 ramiona wspornika.

Rozbieżności z CAD do sprawdzenia w Assembly.

**A1. Dlaczego zaczep zamiast dźwigni przy osi.** Przy x −22 i ρ 25,6:
- od wewnątrz kula R30,5 wymaga |x| ≥ 20,3 dla stosu R2;
- od zewnątrz rura R37,25 dopuszcza |x| ≤ 23,6;
- okno 3,3 mm;
- stos M3 z nakrętką 12,35 mm, zaczep z drutem ±1,8 mm.

**A2. Wybór układu serw.** Sprawdzone 6 układów gałki (ramię X r13/r16 w dół lub w górę, pręt θ na dole lub górze) × 2 powieki, synteza konstrukcyjna i swobodna. Wnioski:
- 3 serwa po jednej stronie się nie mieszczą (Fable R3);
- czworoboki z M3 przy zaczepie przy osi nie mieszczą się w żadnym układzie;
- z drutem:
  - powieka górna (58°) ma rozwiązania tylko przy θ na górze i serwie górnej powieki odwróconym (wałek z −60);
  - powieka dolna ma setki rozwiązań;
  - wybrana para ma najmniejszy wzajemny odstęp 4,7 mm (przy ramieniu dolnym 17,5).

**A3. Powieki (yz), co 8° powieki:**

| G: powieka | serwo | J | H | D: powieka | serwo | J | H |
|---|---|---|---|---|---|---|---|
| 0 | 0 | (−22; 25,6; −0,9) | (−30; 3,9; −45,9) | 0 | 0 | (−22; −25,6; −0,9) | (−21; −11,8; −40,2) |
| 16 | +19,7 | (−22; 24,4; −7,9) | (−30; −0,1; −51,5) | 16 | −23,2 | (−22; −24,4; −7,9) | (−21; −9,6; −46,9) |
| 32 | +40,9 | (−22; 21,2; −14,3) | (−30; −1,9; −58,6) | 32 | −48,6 | (−22; −21,2; −14,3) | (−21; −10,4; −54,6) |
| 48 | +63,8 | (−22; 16,5; −19,6) | (−30; −0,9; −66,4) | 34 | −52,0 | (−22; −20,7; −15,1) | (−21; −10,8; −55,5) |
| 58 | +77,5 | (−22; 12,8; −22,2) | (−30; 1,1; −70,7) | | | | |

Siła przycięcia F = 0,177 / (dφ/dα · 0,0334): górna 6,6–7,7 N, dolna 7,5–8,8 N.

**A4. Przemiatanie** (gałka co 3°/2° do ±27/±17; powieki co 2°; wszystkie kombinacje). Najmniejsze odstępy:

| Para | mm |
|---|---|
| drut G – rura | 0,52 |
| pręt Y – czasza górnej (z wycięciem) | 0,82 |
| drut G – korpus S_Y | 0,89 |
| zaczep J – gałka | 1,00 |
| ramię Y – korpus S_PG | 1,00 |
| wypust powieki – gałka | 1,10 |
| zaczep J – rura | 1,20 |
| kulka M5 Y – korpus S_PG | 2,00 |
| przegub H G – korpus S_Y | 2,00 |
| pręt X – Słupek | 3,67 |
| G – D (dowolne elementy) | ≥ 4,7 |
| poniżej 0,5 | 0 pozycji |

**A5. Ogranicznik:** otoczka przekrojów Słupka (R7,65/cos t) na granicy ±27/±17, płaszczyzna z −6. Półosie 12,04 × 11,04; zapas w zakresie pracy 0,50 mm; pręt z kulką M2 do ramy 2 mm: 0,46 mm.

**A6. Rozstaw:** 2(R − t)·sin(γ/2) ≥ r_duże + r_małe + 3, r_małe 30,5, t 72–77. r_duże: z lewej 35, z prawej 26, u góry 30, na dole 38 → s 117–154. Przy wewnętrznej ściance (Obejma 48 + Nakrętka 37): 100–118.

**A7. Masy:**
- Gałka 19; Uchwyt 4; powieki 11,5 + 9; Rama 35 (rura pełna 21,9 cm³); Słupek 3; Płyta 18; Obejma 12; ramiona i pręty 5;
- serwa 53,6; kardan 12; śruby 25; kable 12;
- razem 225 g;
- środek ciężkości z −28,7.
