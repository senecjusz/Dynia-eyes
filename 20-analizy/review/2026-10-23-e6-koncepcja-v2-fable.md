# Review koncepcji dużego oka 2c, wersja 2 (Fable, 23.10.2026)

Recenzent: Fable, tylko do odczytu. Brief recenzji: `20-analizy/review/brief-review-e6-koncepcja-v2.md`. Oceniany plik: `20-analizy/2026-10-22-duze-oko-2c-koncepcja-v2.md` (realizator: Opus). Każda uwaga ma wagę (KRYTYCZNE / WAŻNE / DROBNE), miejsce, scenariusz porażki, poprawkę albo test i pewność. Liczby policzyłem własnym skryptem na geometrii z v2 (Python/numpy, poza repo: `/tmp/claude-1000/-home-rkp--claude-spares-spare-mfMMBV/81adf3b7-b77e-42b1-b39b-151f54c8e062/scratchpad/e6-v2-fable/check_v2.py`, wynik `wynik_check_v2.txt`) i porównałem ze skryptami realizatora (`…/scratchpad/v2/model.py`, `final.py`, `eyefinal.py`, `stop3.py`, `plan.py`). Raportów Astry i Opusa z tej rundy nie czytałem. Oznaczenia jak w koncepcji: [F] fakt, [R] mój rachunek, [Z] założenie.

## 0. Wynik w pięciu zdaniach

1. **Liczby realizatora się zgadzają.** Odtworzyłem niezależnie: pręty gałki (serwo X −30,4…+43,1°, Y −20,4…+28,5°, kąt nacisku orczyk 48,8°/37,4°, gałka 63,6°/41,2°, kulki M2 23,4°/19,2°, M5 14,2°/20,5°, moment na wale 0,644/0,528 N·m, sprzężenie Y +5,4°), czworoboki powiek (A3 co do 0,1°, skok 77,5°/−51,9°, kąt nacisku 46,0/46,5° i 35,8/22,2°, dφ/dα 0,69–0,82 i 0,60–0,70, przycięcie 6,6–7,7 N i 7,5–8,8 N), okno ogranicznika (12,04 × 11,04, zapas 0,50 mm, kulka M2 do ramy 0,46 mm) i odstęp drutu G do rury 0,52 mm. Martwych punktów nie ma (przebiegi monotoniczne, przenoszenie ≥ 43,5°).
2. **Model uproszczony ukrył jedną kolizję:** nakrętka M5 z podkładką na wewnętrznej stronie Ramienia Y (stos 5 mm, x 1,5…6,5) wchodzi **2,5 mm** w korpus odwróconego serwa S_PG (x ≤ +4) i to w **każdym** położeniu gałki, także w zerze (K1).
3. **Kolejność montażu z pkt 10 jest niewykonalna:** gałka Ø60 nie wejdzie od przodu między powieki otwarte do ograniczników (prześwit 45,6 mm) ani od tyłu przez wspornik Słupka, który ma piastę na osi (K2). Rozwiązanie jest proste: wspornik i Słupek na Płycie, nie na Ramie.
4. **Napęd powiek jest poprawny kinematycznie, ale drut G ma 0,52 mm do rury i 0,89 mm do korpusu S_Y, a te odstępy zależą od położenia korby drutu z dokładnością 0,4 mm** (f 0,4 jest jedyną wartością, która przechodzi) – przy ręcznym gięciu to za mało bez przyrządu.
5. **Źródła:** Make (Simplified) potwierdza wspólną oś powiek i góra–dół oraz cztery ramiona powiek; EyeMech ε3.2 potwierdza 4 kanały powiek i MG90S; „on the Cheap” potwierdza drut z haczykiem, ale **do napędu gałki**, nie powiek – drut w powiekach to adaptacja [A], nie [F].

## 1. Rachunki własne

**R1. Pręty gałki** (siatka ψ ±27 × θ ±17 co 1°; `check_v2.py` sekcja 1). Zgodne z pkt 3.2 i 7 koncepcji co do 0,1°/0,1 mm. Dodatkowo:

| Pręt | kąt nacisku gałka (praca / ogr.) | kulka M2 czop ∥ y | kulka M5 czop ∥ x | kulka M5 z czopem pochylonym do średniego kierunku pręta | luz gałki z 0,1 mm luzu osiowego przegubów |
|---|---|---|---|---|---|
| X | 60,3° / 63,6° | 23,4° | 14,2° | pochylenie 8,9° od x (ku +z) → **5,4°** | 0,68° |
| Y | 39,2° / 41,2° | 19,2° | 20,5° | pochylenie 16,8° od x → **3,7°** | 0,40° |

Pochylenie czopa M2 na gałce nic nie daje (optimum już ∥ y: 22,4°). Pochylenie czopów M5 na Ramionach zbija wychylenie kulki M5 z 20,5° do 3,7° i uniezależnia projekt od kąta pracy przegubów M5 (B1).

**R2. Nakrętka M5 Ramienia Y a korpus S_PG.** Pkt 6: „M5 przez Ramię Ø5,3 z nakrętką M5 (Ramię 3 + nakrętka 4 + podkładka 1 = 8)”. Ramię Y leży w płaszczyźnie x +8 (6,5…9,5), kulka w x +13, więc nakrętka z podkładką zajmuje x **+1,5…+6,5** przy (y, z) kulki H_Y. Korpus S_PG (odwrócony, pkt 3.3, `final.py`: x −27…+4, y 11,55…24,45, z −65,9…−42,7). H_Y w całym zakresie ma y 16,2…18,9 i z −54,1…−41,9, czyli leży w rzucie (y, z) korpusu, a nakrętka zachodzi na korpus w x o **2,5 mm** – w każdym z 7 sprawdzonych położeń, w tym w (0; 0). Model realizatora zna tylko „ramię R3 (do korpusów 1,5 w x)” i „kulkę M5 R7” (stąd jego 1,00 i 2,00 mm); stosu nakrętki nie ma w zał. A4. Dla Ramienia X nakrętka (x 12,5…17,5 na r13) trafia nad realny korpus S_X poniżej wieży (góra korpusu 11,2 mm pod płaszczyzną orczyka, wieża tylko w R ≤ 7) – bez kolizji.

**R3. Czworoboki powiek** (`check_v2.py` sekcja 3). Odtworzyłem tabelę A3 co do 0,1° i 0,1 mm (J0 (−22; 25,6; −0,9), S_PG C (−30; 18; −60) r20 b0 135°, L 49,94; S_PD C (−21; −27; −49) r17,5 b0 30°, L 41,69). Przebieg serwo→powieka monotoniczny, przenoszenie min 43,5° (G) / 54,2° (D). Siła w drucie przy zablokowanym serwie liczona z kątem nacisku orczyka: **12,7 N** (G) i 12,5 N (D), nie 8,9 (koncepcja pominęła 1/cos 46°); przy 20 N na krawędzi powieki przez zaczep: 37,9 N (G) / 28,2 N (D). Oba poniżej P_kr 80 N (zgadza się: EI 20 358 N·mm², P_kr 80,4 N dla L 50). Korba 10,5 mm (x −22 → −32,5) przy f 0,4: ugięcie osiowe od zginania 0,39 mm przy 12,7 N i 1,16 mm przy 38 N, naprężenie 470 / 1410 MPa – przy 38 N na granicy drutu sprężynowego (R_m 1500–2000 MPa), czyli przy pchnięciu powieki 20 N drut może zostać trwale wygięty, jeśli przekładnia nie ustąpi wcześniej.

**R4. Skan położenia drutu G** (noga 1 w x −22 / −23,8 / −20,2, korba w f, noga 2 w x −32,5 lub −32,1; odstępy w całym zakresie 0…58°):

| f | do rury (x2 −32,5) | do rury (x2 −32,1) | do korpusu S_Y |
|---|---|---|---|
| 0,15 | −2,29 | −1,96 | 5,90 |
| 0,25 | −1,10 | −0,76 | 5,90 |
| **0,40** | **0,52** | 0,87 | **0,89** |
| 0,55 | 1,90 | 2,27 | −0,60 |
| 0,70 | 3,03 | 3,40 | −0,60 |

Przesunięcie korby o 7,5 mm wzdłuż drutu (f 0,25 ↔ 0,55) zmienia wynik z kolizji z rurą na kolizję z S_Y. Położenie nogi 1 w x (po której stronie zaczepu leży drut) nie ma wpływu.

**R5. Okno ogranicznika** (otoczka przekrojów Słupka R7,65 na granicy ±27/±17 co 0,25°, 720 kierunków): półosie 12,04 × 11,04, zapas w zakresie pracy ±25/±15 (co 0,5°) 0,50 mm; kulka M2 X (x 18, R3,5) do ramy okna 2 mm: **0,46 mm**; kulka M2 Y: 1,46 mm. Siła na wieniec przy 0,5 N·m: 83 N przy ramieniu 6 mm (koncepcja) albo 37 N, jeśli liczyć ramię od O do punktu styku (13,4 mm); przyjmuję 83 N jako górne oszacowanie.

**R6. Montaż gałki.** Prześwit między krawędziami powiek otwartych do ograniczników (+49° / −45°) na R31,2: 31,2·(sin 49° + sin 45°) = **45,6 mm** < 60. Od tyłu: wspornik Słupka to dwa ramiona 250° i 290° od ściany do piasty w osi (z −33…−37; `model.py` `POST_ARMS`), piasta R7,65 leży na osi, więc kula R30 nie przejdzie płaszczyzny z −35. Powieki (lune 100°) od tyłu przechodzą tylko ustawione „do góry” nad piastą, dolna przekręcona o ~130° i obracana dopiero wewnątrz; wykonalne, ale przy osadzaniu gałki nie pomaga.

**R7. Wspornik, Słupek, Rama – obciążenia.** Siła zewnętrzna od ręki przy 0,5 N·m na kuli R30 to ok. 17 N; 83 N to siła wewnętrzna pary okno–wieniec. Zginanie Słupka Ø15,3/11,3 na wsporniku: 17 N × 31 mm = 0,53 N·m, σ ≈ 2 MPa, ugięcie < 1 mm – bez znaczenia, bo kardan i wieniec siedzą na tym samym Słupku (pętla zamknięta). Docisk wieńca: 83 N na 2 × 1,5 mm = 28 MPa – blisko granicy PLA, ślad możliwy.

**R8. Masa, głębokość.** Ciężar 2,21 N, moment 0,052 N·m ✓. Tarcza Płyty Ø79 × 3 to sama 14,7 cm³ = 18 g (cała Płyta w koncepcji 18 g – tarcza nie może być pełna, inaczej Płyta waży ok. 30 g); rura 47 mm 28 g (koncepcja 21,9 cm³/35 g z rantem ✓). Skrócenie rury o 10 mm: −6 g. Czubek ramienia G przy 58° sięga z −70,7, z zagięciem Z R2 z −72,7: moduł kończy się na **83 mm**, nie 82. Przesunięcie wszystkich serw ku gałce: korpusy przy z −43,1 mogą dojść najwyżej do końca rury (z −37), bo narożnik S_PD ma R_xy 38,0 > 37,75 i nie wejdzie do rury – zysk najwyżej 6 mm (realnie 4–5), czyli 61–63 mm za ścianką 15 zamiast 67.

**R9. Przekładnia MG90S** [Z, wymiary kół nieznane]: koło wyjściowe r ≈ 5 mm, szerokość 2,5, moduł 0,35, Y 0,3: naprężenie Lewisa 135 MPa przy 0,177 N·m, 267 przy 0,35, **490 MPa przy 0,644** – mosiądz/brąz 200–400 MPa, czyli przy 3,6 × zablokowania ząb koła wyjściowego jest na granicy albo poza nią. Sprzęgło cierne na wkręcie M2 orczyka (naciąg 250 N przy 0,1 N·m, μ 0,25, r_eff 3 mm): 0,19 N·m przy jednej powierzchni, 0,38 przy dwóch – poślizg leży między zablokowaniem a siłą dziecka, ale PLA pod 12 MPa pełznie.

## 2. KRYTYCZNE

**K1. Nakrętka M5 na Ramieniu Y przenika korpus S_PG o 2,5 mm w każdym położeniu.** Miejsce: pkt 6 (stos „Ramię 3 + nakrętka 4 + podkładka 1”), pkt 3.2 (`ramieY_x` 8, `kulkaM5Od` 5), pkt 3.3 (S_PG odwrócone, korpus x −27…+4), zał. A4 („ramię Y – korpus S_PG 1,00”, „kulka M5 Y – korpus S_PG 2,00”). Rachunek R2. Przyczyna: model przemiatania ma ramię jako walec R3 i kulkę jako kulę R7, a nie ma stosu śruby kulki po wewnętrznej stronie Ramienia; gałka w (0; 0) ma H_Y w (13; 18; −49), czyli dokładnie w rzucie korpusu S_PG, który kończy się dnem (nie wieżą) na x +4. Scenariusz: Płyty nie da się złożyć albo Ramię Y trze o dno S_PG; wykonawca zobaczy to w Assembly dopiero po narysowaniu 4 serw. Poprawka do briefu CAD (jedna z trzech, najlepiej pierwsza): (a) `ramieY_x` 8 → **11** (korpus S_Y na x 8…−23, nakrętka x 4,5…9,5, 0,5 mm do S_PG) z czopem M5 pochylonym o 16,8° ku +z (R1; bez pochylenia wychylenie kulki rośnie do 20,9° w zerze); (b) nakrętka od zewnątrz, kulka na śrubie z łbem niskim od wewnątrz ≤ 2 mm – zależne od B1; (c) kulka wkręcona w gwint w pogrubionym do 6 mm Ramieniu (M5 w PLA, 7 zwojów) bez nakrętki. Po każdej z nich powtórzyć przemiatanie z pełnym stosem (śruba, nakrętka, podkładka, obudowa przegubu jako walec wzdłuż pręta). Pewność: wysoka (geometria i wymiary z koncepcji).

**K2. Gałki nie da się zamontować w kolejności z pkt 10.** Miejsce: pkt 10 kroki 1, 3, 5–7; pkt 5 (Rama: „wspornik Słupka (2 ramiona: 250° i 290°, z −33…−37)”); pkt 3.3 ograniczniki powiek „wypusty Ramy”. Rachunek R6. Krok 3 mocuje Słupek do wspornika Ramy, krok 5 Uchwyt do kardana, krok 6 gałkę na Uchwyt – gałka musiałaby wejść od przodu między powieki (prześwit 45,6 mm, ograniczniki są na Ramie i nie da się ich ominąć, drut jeszcze niewpięty nie ma znaczenia) albo od tyłu przez wspornik z piastą na osi. Krok 7 („Gałka wchodzi od tyłu w powieki”) zakłada przeciwnie, że gałka przyjeżdża z Płytą – to się nie zgadza z krokiem 3. Scenariusz: po wydruku moduł nie składa się bez odcięcia wypustów ograniczników. Poprawka do briefu CAD: **wspornik Słupka na Płycie** (za rurą, z −37…−41, Słupek 4 mm dłuższy), Rama bez wspornika (rant, rura, boki osi, kołnierz, wypusty, 3 ucha). Kolejność: Rama + powieki + DIN 913 + druty na zaczepach (kroki 1–2) osobno; Płyta + serwa + Słupek + kardan + Uchwyt + pręty + gałka (kroki 3–6 na stole, dostęp do obu M4 kardana i do nadlewów gałki od tyłu bez przeszkód); złożenie = Płyta z gałką wsunięta od tyłu w rurę, gałka wchodzi w powieki (krok 7 jak napisano), 3 × M3×8; druty w ramiona (krok 8). Droga siły ogranicznika: kula → Uchwyt → Słupek → Płyta → 3 słupki M3×8 → ucha Ramy (17 N zewnętrznie, ok. 1,3 N·m na promieniu 36 mm = ok. 12 N na śrubę – bez znaczenia). Rama drukuje się dalej tyłem w dół (koniec rury i ucha płasko). Pewność: wysoka.

## 3. WAŻNE

**W1. Drut powieki górnej ma 0,52 mm do rury i 0,89 mm do korpusu S_Y, a oba odstępy zależą od położenia korby z dokładnością ~0,4 mm.** Miejsce: pkt 3.3 (łącznik 49,95, wykorbienie 40 %), zał. A4 (0,52, 0,89), ryzyko 2. Rachunek R4: f 0,25 daje kolizję z rurą (−1,10), f 0,55 kolizję z S_Y przy 58° (−0,60); okno działających położeń korby to ok. ±3 mm wzdłuż drutu (f 0,35–0,45), a przesunięcie nogi 2 z x −32,5 na −32,1 (0,4 mm) zmienia odstęp do rury z 0,52 na 0,87. Drut gięty szczypcami ma błąd położenia zagięcia rzędu 0,5–1 mm [Z]. Scenariusz: drut trze o rurę przy zamkniętej powiece albo o S_Y przy pełnym otwarciu; na siatce co 2° powieki minimum może być jeszcze o 0,1–0,2 mm niżej. Poprawka: (a) przyrząd do gięcia (drukowana forma z rowkiem R0,6 i kołkami zagięć, zamiast „przyrządu długości”), (b) obniżyć korpus S_Y w y o 1 mm (`walY_y` 3 → 2; sprawdzić S_X–S_Y 3,1 mm) i przesunąć nogę 2 do x −32,1 (zewnętrzna powierzchnia Ramienia 3 mm + 0,6) – daje ok. 0,9 / 1,9 mm; (c) w P3 sprawdzać drut przy obu skrajach. Pewność: wysoka co do wrażliwości, średnia co do tolerancji gięcia.

**W2. Wysokość kulki M5 nad Ramieniem (5 mm) jest założeniem, od którego zależy kinematyka; pochylenie czopów M5 by to uniezależniło.** Miejsce: pkt 3.2 (`kulkaM5Od` 5, kulka M5 ∥ x), pkt 13 (M5: obudowa ≤ Ø14, wychylenie ≥ ±21°), B1. Rachunek R1: wychylenie kulki M5 na Y wynosi 20,5° przy założeniu 5 mm; standardowy czop kulowy RC ma środek kuli ok. 1,1–1,3 × Ø kuli nad powierzchnią montażową (dla kuli Ø8–10 to 8–12 mm) [Z], a wtedy H_Y przesuwa się do x 16–20 i wychylenie rośnie do 21–27° już w zerze, poza przyjętą granicę 21°. Czop pochylony do średniego kierunku pręta (X: 8,9° od x ku +z; Y: 16,8°) daje 5,4° i 3,7° niezależnie od wysokości kulki; to w CAD jedna pochylona powierzchnia gniazda w Ramieniu. Do B1 dopisać: **wysokość środka kuli nad powierzchnią montażową** oraz **czy „M5” oznacza gwint, czy średnicę kuli** (w RC „5 mm ball link” to kula Ø5 z gwintem M3; wtedy stosy w pkt 6 zmieniają się na M3 i K1 znika inaczej). Pewność: wysoka co do kinematyki, średnia co do wymiarów przegubów.

**W3. Głębokość 82–83 mm za powierzchnią dyni przekracza szacowane wolne miejsce, a koncepcja nie szuka rezerwy w położeniu serw.** Miejsce: pkt 2 („67 mm przy w 15, wolne ok. 65”), pkt 5 (Płyta z tarczą z −67…−70), B5, ryzyko 5. Rachunek R8: czubek ramienia G przy 58° sięga z −72,7 (83 mm); `zSerw` −49 jest stałą w całym przemiataniu (`model.py` `ZS`), choć czoła korpusów (z −43,1) mają 13 mm do tylnych krawędzi otwartych powiek (z −29,7); granicą jest koniec rury (z −37), bo narożnik S_PD (R_xy 38,0) nie wejdzie w rurę R37,75 – zysk 4–6 mm. Druga rezerwa: tarcza Płyty jako ramka z trzema słupkami zamiast pełnego dysku (3 mm głębokości i ok. 10 g). Scenariusz: moduł opiera się o wieżę albo ścianka 15 mm okaże się 12 mm. Poprawka: `zSerw` jako zmienna z testem K9 (−49 ↔ −44) i ponowne przemiatanie; tarcza ażurowa; B5 pozostaje blokujące dla głębokości, z warunkiem odrzucenia jak w pkt 13 (`dociskMax` 30). Pewność: wysoka.

**W4. Ochrona przekładni przed ręką dziecka: potwierdzam, że z warsztatu nie ma pełnej; ryzyko jest realne, a nie tylko formalne.** Miejsce: pkt 0.4, 3.4, ryzyko 1, T1. Rachunek R9: przy 0,644 N·m ząb koła wyjściowego dostaje szacunkowo 490 MPa wobec 200–400 MPa mosiądzu [Z], czyli odkształcenie zęba jest prawdopodobne; przy 0,35 N·m (2×) ok. 270 MPa – zwykle do zniesienia. Co da się zrobić z tego, co jest: (a) **sprzęgło cierne na wkręcie M2 orczyka**: Ramię X/Y z okrągłą piastą dociśniętą wkrętem M2 przez drukowaną podkładkę Ø10 do piasty orczyka fabrycznego z odciętym ramieniem; poślizg 0,19–0,38 N·m (jedna/dwie powierzchnie, 250 N, μ 0,25), ustawiany momentem wkręta; koszt: po poślizgu zero gałki ucieka i trzeba kalibracji ze strony w telefonie (NVS nie wykryje poślizgu), PLA pod 12 MPa pełznie – dokręcenie po 24 h; (b) **przegub M2 przy gałce jako element zrywalny w rozciąganiu**: wypięcie kulki RC M2 to typowo 20–40 N [Z] wobec 28 N w pręcie przy 0,5 N·m – chroni w jednym kierunku każdej osi, zatrzaskuje się z powrotem, ale P4 wymaga ≥ 30 N, czyli odwrotnie; trzeba zdecydować, czego się chce; (c) bez ochrony: **T1 stopniowany na jednym serwie przed budową** (0,25 / 0,35 / 0,5 / 0,65 N·m na ramieniu, po 10 s, 5 razy, pomiar luzu wału przed i po; zaliczone, gdy luz < 1°), bo wynik rozstrzyga, czy (a) jest potrzebne. Powieki: droga siły „zaczep → wypust Ramy” działa dopiero poza zakresem; w zakresie serwo powieki dostaje do 0,567 N·m (3,2×) – to samo ryzyko, dodatkowo drut przy 38 N jest przy granicy plastyczności (R3). Pewność: średnia (wymiary kół MG90S nieznane; dane o awariach MG90S z forów są anegdotyczne).

**W5. Trzy luzy poniżej tabeli `AGENTS.md`.** Miejsce: pkt 3.1 („rama okna ma ≥ 0,46 mm do prętów z kulkami M2”), pkt 3.3 i 6 („otwory na drut Ø1,4”, „orczyk fabryczny rozwiercony do Ø1,3”). Rachunek R5: 0,46 < 0,5 (ruchome obok siebie); drut Ø1,2 w Ø1,4 to 0,1/str. i w Ø1,3 to 0,05/str. wobec 0,2 dla obrotowych; drukowane otwory Ø1,4 wychodzą na Bambu ok. Ø1,1–1,2 [Z, typowy skurcz małych otworów], więc drut nie wejdzie bez wiercenia. Poprawka: `pktR` 18 → 18,5 (0,96 mm; pręty dłuższe o ok. 0,3) albo okno węższe o 0,5 kosztem zapasu ogranicznika (nie polecam); `otworDrutu` 1,6 w zaczepie z adnotacją „przewiercić 1,5 po druku”; orczyk fabryczny wiercony 1,5. Pewność: wysoka.

**W6. B4 (otwór ucha MG90S) z propozycją „M3 jak w v2.8” – rysunki producenta i sklepów podają otwór ok. Ø2 [Z], w uchu 2 mm grubości i ok. 4,7 mm szerokości.** Miejsce: pkt 6 (M3×10 w uchu), pkt 13, B4. Źródła: components101 i towerpro.com.tw nie podają średnicy otworu w tekście (tylko rysunki); M3 wymaga rozwiercenia ucha do 3,2 i zostawia 0,75 mm ścianki na stronę. Scenariusz: użytkownik rozwierca 8 uszu, pękają 1–2. Poprawka: domyślnie **M2,5×10** (otwór ciasny Ø2,1 w PLA, śruby „dowolne” wg decyzji), M3 tylko po pomiarze ≥ 2,8; w CAD `srubaUcha` jako zmienna. Nie blokuje geometrii Płyty. Pewność: średnia (pomiar B4 rozstrzyga).

**W7. Źródło dla drutu w powiekach jest przypisane niewłaściwie.** Miejsce: pkt 3.3 („Drut z zagięciem w otworze orczyka i części napędzanej: Cogley „on the Cheap””), pkt 1 i 15 (A11). Sprawdziłem w treści (przez proxy tekstowe): „Using some needle-nose pliers, I bent a little hook into the wire and plugged one end into the servo horn and the other into the hole in the eyeball” – drut z haczykiem napędza **gałkę**; powieki mają własne serwa („Put the eyelids and their servos in after the eyeball is already secured”), ale sposób ich połączenia nie jest opisany; drut to „Stiff Wire (I used packaging wire)”, bez średnicy. Make (Simplified) mówi o „connector” na śrubie M2 bez typu. Czyli „płaski czworobok z drutem sprężynowym Ø1,2 z zagięciami Z na powiece” to własna adaptacja [A] (zasada haczyka w otworze orczyka jest sprawdzona, przeniesienie na powiekę, Z zamiast haczyka i drut sprężynowy nie). Dla briefu CAD bez zmian, dla statusu „sprawdzone” ważne: P3 (1000 mrugnięć) jest jedynym dowodem i musi zostać. Pewność: wysoka.

**W8. Przemiatanie: lista elementów poza modelem i siatka.** Miejsce: zał. A4 (siatka 3°/2°/2°, model walce–kule–prostopadłościany). Poza modelem są: stos śruby kulki M5 (K1), ogony zagięć Z (3–4 mm po wewnętrznej stronie zaczepu i ramienia; przy zaczepie w stronę −x ogon radialny trafia w rurę: hypot(23,8; 28,6) = 37,2 > 37,15, więc ogon musi iść stycznie, wzdłuż krawędzi powieki), łby 2 × M3×8 nadlewów Gałki (położenie nadlewów nie jest podane), kable S_X/S_Y/S_PD wychodzące z czół z −43,1 ku gałce, obudowy przegubów jako bryły wzdłuż prętów (kulka M5 R7 to kula, a obudowa RC jest wydłużona wzdłuż pręta i ma kołnierz przy otworze). Siatka 3° w ψ przesuwa punkt P o 0,94 mm, więc minima 0,82 (pręt Y – czasza górna) i 0,89 mogą być w rzeczywistości o 0,2–0,4 mm niższe. Poprawka: w briefie CAD lista par do sprawdzenia w Assembly z PODGLĄDEM pełnych okuć i kabli Ø3 × 1,2; siatka 1°/1°/1° wokół minimów w skrypcie przed CAD. Pewność: wysoka.

## 4. DROBNE

**D1.** Kąt nacisku po stronie gałki dla X dochodzi do 63,6° (przenoszenie 26,4°): luz osiowy 0,1 mm w przegubach daje 0,68° luzu gałki wokół ψ (Y: 0,40°). Dopuszczalne, zapisać jako świadomy wybór; poprawa wymagałaby P_X głębiej (z −10) i nowego przemiatania.

**D2.** Wycięcie tylnej krawędzi górnej powieki do 80° w pasie x 0…13 będzie widoczne przy zamkniętym oku jako stopień 11° × 13 mm na szczycie powieki (z +5,4 zamiast −0,5); alternatywa to przesunięcie pręta Y poza pas (P_Y w x +3 i pręt Y bliżej osi) – do decyzji użytkownika, cosmetyka.

**D3.** Głębokość: czubek ramienia G z zagięciem Z przechodzi przez wycięcie tarczy do z −72,7, moduł ma 83 mm, nie 82; wycięcie w tarczy musi objąć R3 ramienia (y −4,9…6,9), a nie tylko drut (y −3…+6).

**D4.** Wieniec ogranicznika R7,65 ma 1,5 mm wysokości (z −5,5…−7): 83 N daje 28 MPa docisku na PLA, możliwy ślad po pierwszym teście; wieniec 3 mm (z −5,5…−8,5) halves to, kieszeń piasty zaczyna się dopiero od z −5,5, więc miejsce jest. Otwór dostępowy M4 (z −7…−11,2) sąsiaduje z wieńcem – sprawdzić w CAD, że nie przecina.

**D5.** Pręt S–S obraca się swobodnie wokół własnej osi; obudowa M2 na gwincie wkręta M2×10 bez kontry może się po tysiącach cykli dokręcić albo odkręcić (zmiana długości pręta = zmiana zera). RC trzyma to tarciem gwintu w plastiku; zapisać w instrukcji kalibracji kontrolę długości prętów po teście 24 h, albo kropla kleju do gwintów (nie klej montażowy) na gwincie.

**D6.** Kołnierz przodu Ramy (R35,2 przy rurze R37,75) to przy druku tyłem w dół nawis 2,55 mm na górze wydruku; faza 45° od spodu jak przy rancie, do planu drzewa.

**D7.** Kabel S_PG wychodzi z czoła z −65,9 wprost na tarczę z −67 (1,1 mm) – potrzebne wycięcie na kabel w tarczy albo tarcza ażurowa (W3).

**D8.** Masa 225 g: cel 130–150 jest nieosiągalny z 4 × MG90S (53,6 g) i kardanem (12 g) – 66 g metalu plus 115 g wydruków; realne odchudzenie to tarcza ażurowa (−10 g) i rura 37 mm przy ściance ≤ 25 (−6 g), razem ok. 205 g. Dla Obejmy masa nie ma znaczenia (0,052 N·m wobec 0,75 N·m od pchnięcia) – zapisać to jako fakt, żeby nikt nie ciął ścianek.

## 5. Uwagi z pierwszej rundy: czy zamknięte (sprawdzone liczbami)

**Fable (moje):**

| ID | Stan | Sprawdzenie |
|---|---|---|
| K1 dźwignia poza Ø79,5 | **zamknięte** | zaczep J (−22; ±25,6; −0,9): hypot(23,2; 25,6) = 34,55 → 1,2 mm do rury R37,75; drut: 0,52 (W1 tej rundy) |
| K2 kolizje w pasie 10 mm | **zamknięte** | jedna powieka = jeden drut; G–D min 4,73 mm (ramię G – przegub H D) w moim odczycie `final_fin.txt` ✓ |
| K3 okucia w gałce | **zamknięte** | zaczep R2 w x −23,2…−20,8: min odległość od O 32,98 − 2 = 30,98 → 0,98 do R30 ✓ (brak nakrętek przy osi) |
| W1 Ø55 nie Ø56 | zamknięte decyzją (DIN 913 jest) | — |
| W2 ograniczniki na prętach | **zamknięte** | okno w Uchwycie 12,04 × 11,04, zapas 0,50 (R5) ✓; ale kulka M2 do ramy 0,46 (W5) |
| W3 końcówki kulowe | **otwarte do B1** | wymiary dalej nieznane; przedziały i warunki odrzucenia są; brakuje wysokości kulki i znaczenia „M5” (W2) |
| W4 kable | częściowo | kierunek wyjścia poprawiony (czoło z −43,1 ku gałce, S_PG z −65,9 do tyłu); trasy „do sprawdzenia w Assembly” (W8, D7) |
| W5 warstwy cięgien | **zamknięte** | jeden stos na przegub, G–D ≥ 4,7 ✓ |
| W6 Obejma na oknach, pełzanie | **zamknięte** | rura pełna z −3…−37, Obejma z −5…−35 (2 mm zapasu z obu stron) ✓, PETG ✓ |
| W7 Płyta | **zamknięte** | tarcza za prętami (z −67), jedno wycięcie; słupki do Assembly ✓ |
| W8 widełki osiowo | **zamknięte** | M4 przez ściankę 2,15 do gwintu piasty, 260 N ✓ (2,15 × 4 × 30 = 258) |
| W9 Rama płasko | **zamknięte** | tyłem w dół ✓ (po K2 tej rundy: koniec rury i ucha, bez wspornika) |
| W10 P5 | **zamknięte** | 0,7 N·m, ±10 N, 24/72 h ✓ |
| W11 wycięcia czasz | **zamknięte** | górna do 80° w x 0…13; pręt Y – czasza 0,82 ✓ (siatka: W8) |
| W12 konwencje | **zamknięte** | pkt 7 (tabela skrajnych położeń zgodna z R1 co do 0,1), znaki serw, zał. A3 ✓ |
| D1–D8 | zamknięte | 0,052 ✓, U–S dopuszczone ✓, tęczówka 5,3° ✓ (41,7 vs 47), EN 71 jako analogia ✓, pudełka serw 3–34 ✓, Face maker usunięty ✓, film ε3.2 jako montaż ✓ (potwierdzone na GitHub: „Video guide” w sekcji Assembly), drut użyty ✓ |

**Astra, Opus (recenzent) – to, co da się sprawdzić z v2:** A2/O-W5 zamknięte liczbą (0,50 mm w narożnikach, pełna macierz 0,644 ✓); O-W2 zamknięte: Δ(ρ) = (28,65/ρ − 1)/2 daje dokładnie 1°·ρ ≥ 0,5 mm na ograniczniku, przy ρ 4 → 3,08° ✓; A4 zamknięte (6,6–7,7 / 7,5–8,8 ✓ R3); A7 zamknięte (2 części, 515 mm² = π(42² − 39,75²)·… rząd ✓); A1 zamknięte co do osi (DIN 913 stos 8,55 → koniec 0,55 ✓: 3,25 + 0,25 + 2,4 + 0,25 + 2,4 = 8,55), ale stos M5 na Ramieniu Y otwiera K1; O-W4 zamknięte z testem; O-W1 zamknięte (T1 z kryterium), lecz T1 powinno być stopniowane (W4); A10 zamknięte (budżet 4 serw, test 25 g/16 mm = 3,9 mN·m ≥ 1,2 × 3,2 ✓); A3 zamknięte decyzją. Astra A6 (głębokość) jest policzone, lecz nie rozwiązane (W3).

## 6. Odpowiedzi na 10 punktów briefu

| # | Pytanie | Ocena |
|---|---|---|
| 1 | Uwagi I rundy zamknięte? | Tak dla 14 z 15 moich K/W (tabela pkt 5), W3 czeka na B1; nowe problemy to K1 (nakrętka M5) i K2 (montaż) |
| 2 | Napęd powiek | Kinematyka zgodna co do 0,1° (R3): skok 77,5°/−51,9°, nacisk ≤ 46,5°, przenoszenie ≥ 43,5°, bez martwych punktów, zakresy niezależne (G–D ≥ 4,7). Zaczepy: pin Z w otworze Ø1,4 – wypadanie wyklucza ogon ≥ 3 mm po drugiej stronie (do briefu: strona i kierunek ogona, W8); zużycie: stal w PLA przy 0,1/str. – P3 konieczne. Przycięcie 6,6–8,8 N ✓. Słabe: W1 (0,52/0,89 przy tolerancji gięcia), drut 1410 MPa przy 38 N (R3) |
| 3 | Napęd gałki | Mieszanie M2/M5 nie psuje kinematyki (pręt = odcinek między środkami kulek) ani obrysu (M5 R7 do rury ≥ 8,5); psuje stos na Ramieniu Y (K1) i zależy od wysokości kulki M5 (W2). Gwinty: M2 w Ø1,7 × 4 mm PLA ok. 250 N wyrwania [R: π·2·4·0,5·20 MPa] ✓; M5 w pręcie Ø6 (ścianka 0,9 mm przy Ø4,2!) – pręt przy M5 musi mieć Ø8 albo przekrój 6 × 8 (do briefu). Okno: 0,50 ✓, droga siły ✓ (po K2 przez Płytę) |
| 4 | Przemiatanie | Uproszczenie ukryło K1; pozostałe pominięcia w W8. Liczby, które model zawiera, odtwarzam co do 0,01 mm |
| 5 | Ochrona przekładni | Brak pełnej; W4: sprzęgło cierne 0,19–0,38 N·m na M2 orczyka (koszt: utrata zera), wypięcie kulki M2 jako bezpiecznik w rozciąganiu (sprzeczne z P4 ≥ 30 N), T1 stopniowany na jednym serwie przed budową |
| 6 | Masa, głębokość | Masa nieistotna dla Obejmy (0,052 wobec 0,75 N·m); 225 → ok. 205 g realne, 150 nie (D8). Głębokość 83 mm: rezerwa 4–6 mm w `zSerw` i 3 mm w tarczy (W3); dalej tylko B5 albo `dociskMax` 30 |
| 7 | Obrys i montaż | Ø79,5 ✓ (max R_xy brył 38,0 za rurą < 39,75), rant 2 mm ✓, 3 ruchy w dyni ✓; **montaż na stole niewykonalny w podanej kolejności (K2)**; kroki syna sensowne po przeniesieniu Słupka na Płytę |
| 8 | Luzy, DFAM, prąd | Powieka–gałka 1,2 ✓, osiowe 0,25 ✓, 0,46 i Ø1,4/1,3 ✗ (W5); DFAM: Rama ✓ (D6 faza kołnierza), powieki z podporami od wklęsłej ✓ nazwane, gałka ✓, wszystko ≤ 84 mm na A1 mini ✓; prąd: szczyt 1,0 A, zablokowanie 2,6–3,2 A [Z] spójne z E5.5; bez PWM test 25 g/16 mm ✓; kanały 12–15 ✓ |
| 9 | Gotowość do CAD | Zmienne, znaki, tabela położeń, stosy: tak. Braki: położenie 2 nadlewów M3 Gałki, strona i długość ogonów Z, przekrój pręta przy M5, wycięcie tarczy pod ramię R3 i kabel S_PG, wspornik na Płycie (K2), `ramieY_x`/strona nakrętki (K1), `zSerw` jako zmienna. B1 uzupełnić o wysokość kulki i znaczenie „M5”, B4 o propozycję M2,5. Przedziały i warunki odrzucenia są |
| 10 | Źródła | Tabela pkt 7: Make ✓ (oś wspólna, „eyelid servos”, „all four of them”), ε3.2 ✓ (4 kanały powiek, MG90S), „on the Cheap” ✓ cytat, ale drut napędza gałkę, nie powieki (W7) |

## 7. Źródła: co sprawdziłem (23.10)

| Źródło | Otwarte | Potwierdza | Nie potwierdza |
|---|---|---|---|
| Make „simple animatronic eyes” (Simplified) | tak | „This pivot point is for the y-axis of the eye motion and the eyelids”; „Micro servos, SG90 (6)”; „one of the eyelid servos”, „all four of them in the center” (4 ramiona powiek); powieki podążają za spojrzeniem | typu łącznika (tylko „connector … with a 4mm or 6mm M2 screw”); strona raz pisze o 5 serwach w bloku |
| Instructables „on the Cheap” (przez proxy tekstowe) | tak | „I bent a little hook into the wire and plugged one end into the servo horn and the other into the hole in the eyeball”; „Stiff Wire (I used packaging wire)”; „3mm Universal Joint”; powieki z własnymi serwami; autor w komentarzu: „I think 5mm should be fine” | drutu w napędzie powiek; średnicy drutu |
| GitHub EyeMech_Epsilon | tak | 6 serw, kanały Top Left / Bottom Left / Top Right / Bottom Right; „MG90s — Recommended balance of cost and power”; film jako „Video guide” w sekcji Assembly | — |
| components101 MG90S | tak | 1,8 kg·cm (4,8 V), 2,2 (6 V), 13,4 g | prądu, otworu ucha |
| towerpro.com.tw MG90S | tak | 22,8 × 12,2 × 28,5; A 32,5, B 22,8, C 28,4, D 12,4, E 32,1, F 18,5 (bez legendy) | otworu ucha (tylko rysunek), prądu |
| Stan Winston School, protosupplies, JJR Lab | nie w tej rundzie (sprawdzone 22.10) | — | — |

## 8. Zestawienie

| Waga | # | Jedno zdanie |
|---|---|---|
| KRYTYCZNE | K1 | Nakrętka M5 z podkładką na Ramieniu Y (x 1,5…6,5) przenika korpus S_PG (x ≤ 4) o 2,5 mm w każdym położeniu; model przemiatania nie ma stosu śruby kulki |
| KRYTYCZNE | K2 | Gałka Ø60 nie wejdzie ani od przodu (prześwit powiek 45,6 mm) ani od tyłu (wspornik z piastą na osi); wspornik i Słupek muszą być na Płycie |
| WAŻNE | W1 | Drut G: 0,52 mm do rury i 0,89 do S_Y, działa tylko f 0,35–0,45; ręczne gięcie bez przyrządu tego nie trzyma |
| WAŻNE | W2 | Wysokość kulki M5 (5 mm) to założenie; czopy M5 pochylone o 8,9°/16,8° zbijają wychylenie do 5,4°/3,7°; B1 bez wysokości kulki i znaczenia „M5” |
| WAŻNE | W3 | Głębokość 83 mm; `zSerw` −49 nie było zmienną (rezerwa 4–6 mm), tarcza pełna (3 mm, 10 g) |
| WAŻNE | W4 | Brak ochrony przekładni: 490 MPa na zębie przy 0,644 N·m [Z]; sprzęgło cierne 0,19–0,38 N·m na M2 orczyka albo T1 stopniowany na jednym serwie |
| WAŻNE | W5 | Luzy poniżej tabeli: 0,46 (kulka M2–rama okna), Ø1,4/Ø1,3 na drut 1,2 |
| WAŻNE | W6 | B4: otwór ucha MG90S wg rysunków ok. Ø2; domyślnie M2,5, nie M3 |
| WAŻNE | W7 | „on the Cheap”: drut z haczykiem napędza gałkę, nie powieki – łącznik powiek to adaptacja [A] |
| WAŻNE | W8 | Poza modelem: stos M5, ogony Z, łby nadlewów gałki, kable, obudowy przegubów; siatka 3° może zaniżać minima o 0,2–0,4 |
| DROBNE | D1–D8 | luz gałki 0,68° z kąta nacisku 63,6°; stopień wycięcia 80° widoczny; 83 mm i wycięcie R3; wieniec 3 mm; kontra gwintu M2; faza kołnierza; kabel S_PG przy tarczy; 150 g nieosiągalne, 205 realne |

## Werdykt

**TAK PO POPRAWKACH**, które orkiestrator może wpisać wprost do briefu CAD: (1) wspornik Słupka na Płycie zamiast na Ramie i kolejność montażu „Rama+powieki” / „Płyta+serwa+Słupek+kardan+Uchwyt+pręty+gałka”, złożenie od tyłu (K2); (2) `ramieY_x` 8 → 11 z czopami M5 pochylonymi do średniego kierunku prętów (X 8,9°, Y 16,8°) albo nakrętka M5 na zewnątrz, i powtórzone przemiatanie z pełnym stosem śruby kulki (K1, W2); (3) `zSerw` jako zmienna z testem K9 i tarcza ażurowa (W3); (4) `pktR` 18,5, `otworDrutu` 1,6 wiercony 1,5, orczyk D wiercony 1,5 (W5); (5) przyrząd do gięcia drutu i `walY_y` 2 (W1); (6) `srubaUcha` M2,5 do pomiaru B4 (W6); (7) B1 uzupełnione o wysokość środka kuli nad powierzchnią montażową i o to, czy „M5” to gwint, czy średnica kuli (W2); (8) decyzja użytkownika w sprawie ochrony przekładni: sprzęgło cierne na M2 orczyka albo T1 stopniowany na jednym serwie przed drukiem (W4). Architektura (kardan 5/5, pręty S–S, 4 serwa, czworoboki z drutem, Obejma) jest poprawna i policzona; bez (1) i (2) wydruk się nie złoży.
