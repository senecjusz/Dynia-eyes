# Review koncepcji dużego oka 2c, wersja 2 (E6.1b) – recenzent Opus, 23.10

Oceniany plik: `20-analizy/2026-10-22-duze-oko-2c-koncepcja-v2.md`. Brief: `20-analizy/review/brief-review-e6-koncepcja-v2.md`. Pracowałem tylko do odczytu. Raportów Fable i Astry z tej rundy nie czytałem. Wagi według `AGENTS.md`: **KRYTYCZNE**, **WAŻNE**, **DROBNE**. Oznaczenia: **[F]** fakt (źródło, plik), **[R]** mój rachunek, **[Z]** założenie.

## Jak liczyłem

Skrypty w Pythonie są poza repo, w `/tmp/claude-1000/-home-rkp--claude-spares-spare-mfMMBV/81adf3b7-b77e-42b1-b39b-151f54c8e062/scratchpad/e6-v2-opus/`:
- `galka.py`: kinematyka i macierz momentów;
- `okno.py`, `okno2.py`, `rim.py`, `wariant.py`: krawędź czaszy i okno ogranicznika;
- `powieki.py`, `sweep.py`: czworoboki i druty;
- `nut.py`: nakrętki M5;
- `rodlid.py`, `shift.py`: pręt Y wobec powieki, wariant S_Y.

Wszystkie wejścia pochodzą z koncepcji: pkt 3.2, 3.3, tabela 7, zmienne 8, zał. A3–A4 i model korpusów „3–34 mm pod płaszczyzną ramienia”.

**Zgodność z autorem.** Pełne odtworzenie, więc rozbieżności niżej biorą się z geometrii, a nie z innego odczytu danych:
- **Gałka:** tabela 7 co do 0,1 mm i 0,1°:
  - zakres X −28,6…+38,9° (praca) i −30,4…+43,1° (ograniczniki); Y −18,2…+24,9° i −20,4…+28,5°;
  - kąt nacisku przy orczyku 43,6/34,0° (praca) i 48,8/37,4° (ograniczniki); przy gałce 60,3° (praca) i 63,6° (ograniczniki);
  - kulki M2 ≤ 23,4/19,2°, M5 ≤ 14,2/20,5°; kardan 28,9/31,6°;
  - **moment X 0,644 N·m, Y 0,528 N·m** przy (+25; −15).
- **Powieki:** zał. A3:
  - długości łączników 49,94 / 41,69;
  - skok serwa 77,4° / −51,9°;
  - siła przycięcia 6,5–7,7 N (G) i 7,5–8,8 N (D).

  Martwych punktów nie ma ani w zakresie, ani 6–8° za ogranicznikami (kąty nacisku ≤ 49°).

**Kinematyka obu napędów jest policzona rzetelnie. Przemiatanie kolizji już nie:** brakuje w nim kilku par, a kilka części ma w modelu inne wymiary niż na liście części.

## KRYTYCZNE

### K1. Pręty Ø6 przecinają krawędź czaszy gałki i wycięcie powieki górnej

**Miejsce:** pkt 3.2 (pręt Ø6, obudowa M2 Ø7), pkt 2 (czasza 230°, krawędź 115°), pkt 3.3 (wycięcie 80° w pasie x 0…13), zał. A4. Pary „pręt – gałka” w A4 nie ma.

**Rachunek [R]** (`okno.py`, `rodlid.py`). Odległość **osi** pręta od krawędzi czaszy (pierścień R28–30 na 115° w układzie gałki):

| Pręt | Na ogranicznikach | W pracy ±25/±15 | Z prętem Ø6 (r 3) |
|---|---|---|---|
| X | **1,25 mm** przy (+27; +17), 9,9 mm od środka kulki M2 | **1,78 mm** przy (+25; +15) | −1,75 / −1,22 |
| Y | 2,60 przy (+27; −17) | 3,27 | −0,40 / +0,27 |
| Y – wycięcie powieki górnej (80°) | oś 2,20 przy (−27; +9; powieka 57,5°) | — | **−0,80** (koncepcja: +0,82) |

- Miejsce styku leży 9–10 mm od środka kulki M2. Tam kończy się obudowa przegubu albo zaczyna pręt, więc kolizji nie usunie nawet gołe M2 (r 1 + 0,5 > 0,28 zapasu w pracy).
- Wynik +0,82 w A4 da się odtworzyć tylko przy pręcie r ≈ 1,4. Przemiatanie liczyło więc cieńszy pręt niż ten z listy części.

**Scenariusz porażki:** przy patrzeniu w prawo (ψ > ok. +20°) pręt X trze o tylną krawędź gałki i ją zatrzymuje, w zakresie pracy. Pręt Y uderza w wycięcie otwartej powieki górnej przy patrzeniu w lewo.

**Poprawka**, do wpisania w brief CAD i do sprawdzenia przemiataniem:
- **Lokalne wycięcie krawędzi czaszy gałki.** Pod pręt X (wokół φ = 0° w układzie gałki, ±15°) krawędź z 115° do ok. 109°; pod pręt Y (φ = 90°) do ok. 111°. Warunek: oś pręta ≥ r części + 0,5, czyli 4,0 przy obudowie Ø7.
  - Skutek: przy ψ ±25° dno wycięcia wychodzi na 84° od osi z, w samym kąciku oka przy osi powiek (ρ ≈ 3 mm). Do sprawdzenia, czy widać to przy otwartych powiekach.
- **Alternatywa bez wycięcia:** `pktZ` −6 → −8 daje oś X 2,35/3,01 mm. Kosztuje to wzrost momentu przy ręce dziecka z 0,62 do 0,88 N·m (`wariant.py`), więc nie polecam.
- **Wycięcie powieki górnej:** `wyciecieG` 80° → 77°, pas x do 16. Krycie z przodu zostaje: 31,2·sin 77° = 30,4 > 30.
- **W modelu przemiatania:** pręt r 3, obudowa M2 r 3,5 na długości z pomiaru B1, para pręt–gałka z krawędzią czaszy w układzie gałki.

**Pewność:** wysoka co do geometrii z liczb koncepcji. Zakres, na którym obudowa M2 sięga od kulki, zależy od B1.

### K2. Nakrętka M5 kulki na Ramieniu Y wchodzi 2,5 mm w korpus serwa powieki górnej

**Miejsce:** pkt 6 („M5 przez Ramię Ø5,3 z nakrętką M5: Ramię 3 + nakrętka 4 + podkładka 1”), pkt 3.2 (płaszczyzna ramienia Y x +8), pkt 3.3 (S_PG: korpus x −27…+4, y 11,6…24,5), zał. A4 (nakrętki nie ma w modelu).

**Rachunek [R]** (`nut.py`). Nakrętka i podkładka (5 mm) leżą po stronie serwa, czyli na x +1,5…+6,5 przy ramieniu ±1,5 wokół +8.
- Koniec Ramienia Y (y 16,2–18,0, z −41,8…−54,7) jest nad obrysem S_PG w całym zakresie serwa Y.
- Spód S_PG jest na x +4, więc **przenikanie wynosi 2,5 mm przy każdym położeniu**.
- Ramię X: nakrętka przy ograniczniku +43,1° mija narożnik czoła S_X o −0,22 mm (opisana Ø9,2) albo +0,26 mm (wpisana Ø8). Wymagane jest 0,5.

**Scenariusz porażki:** Ramienia Y nie da się nasadzić. Po skróceniu stosu nakrętka trze o dno S_PG przy każdym ruchu góra–dół.

**Poprawka:**
- **S_Y z Ramieniem Y przesunąć o +3,5 mm w x:** `ramieY_x` 11,5, kulka M5 x 16,5.
  - Spód S_Y idzie wtedy z −26 na −22,5, co usuwa też W2 (drut G przy S_Y).
  - Sprawdziłem wariant +3: L_Y 45,88, moment Y 0,530 N·m (bez zmiany). Pręt Y zbliża się jednak do krawędzi czaszy (2,12/2,98) i do wycięcia powieki (1,95), więc wycięcia z K1 trzeba policzyć dla nowego położenia.
- **Ramię X:** stos nakrętki o ≥ 0,5 od narożnika czoła S_X przy 43,1°. Albo kąt ogranicznika X, albo nakrętka w kieszeni sześciokątnej Ramienia (Ramię ≥ 5 mm).
- **Stosy nakrętek M5** dopisać do przemiatania.

**Pewność:** wysoka według modelu korpusów koncepcji. Realna wysokość wieżyczki wałka MG90S rozstrzygnie P2.

### K3. Kolejności montażu z pkt 10 nie da się wykonać: gałka nie przejdzie obok wspornika Słupka w Ramie

**Miejsce:** pkt 5 (Rama: „wspornik Słupka – 2 ramiona 250° i 290°, z −33…−37”), pkt 10 kroki 1, 3, 5–7, pkt 3.4 (ograniczniki powiek jako wypusty Ramy).

**Rachunek [R]:**
1. **Gałka.** Ramiona wspornika biegną od R7,65 do R37,75 w przekroju rury na z −33…−37. Gałka Ø60 nie przejdzie obok nich od tyłu.
2. **Od przodu też nie.** Powieki są już w Ramie (krok 1). Gałki nie da się też włożyć przed powiekami, bo:
   - powieki wkłada się od tyłu (ucha x ±36,25 nie przejdą przez kołnierz R35,2);
   - powieki przesuwanej od tyłu nie da się nasunąć na gałkę: przy przesunięciu d > 1,2 mm krawędź przednia (R31,2, φ −9°) wchodzi w kulę R30.
3. **Powieka dolna** w położeniu roboczym też nie przejdzie obok ramion od tyłu: jej rzut zajmuje y ≤ −0,19ρ, a ramiona y ≤ −7,2.
   - Górna przechodzi z zapasem ok. 2 mm.
   - Dolnej nie da się też włożyć obróconej i obrócić na miejsce: przy obrocie przez tył trafia w końce ramion (R 33,9 na z −33), przy obrocie przez przód zaczep J wchodzi na wypust ogranicznika zamknięcia.
4. **Gałka wsuwana od tyłu w zamknięte powieki jest geometrycznie możliwa:** każdy punkt gałki o z ≥ 0 ma wtedy |p| ≤ 30 < 31,2, a zaczepy J mają do niej ≥ 2,3 mm.
   - Drogę blokują jednak wypusty ograniczników otwarcia przy zaczepach J. Górny sięga do R_xy ≈ 25 na z −23, a gałka ma R30.

**Scenariusz porażki:** wykonawca narysuje Ramę ze wspornikiem i wypustami, a złożenie w Assembly okaże się niemożliwe w każdej kolejności.

**Poprawka:**
- **Wspornik Słupka przenieść do Płyty** (ramiona na jej przednich słupkach, z −33…−37). Kolejność wtedy:
  1. obie powieki od tyłu w pustą Ramę, osie DIN 913;
  2. na stole zespół Płyta + serwa + Słupek + kardan + Uchwyt + gałka + pręty;
  3. zespół wsuwany od tyłu, gałka wchodzi w zamknięte powieki (jak w kroku 7);
  4. druty w ramiona.
- **Ograniczniki powiek przenieść na Ramiona powiek** (patrz W3), żeby nic w Ramie nie sięgało do R < 30,5 za z 0.
- **Uszy Płyty w Ramie (z −37)** na R ≥ 30,5.
- Droga obciążenia Słupka przechodzi wtedy przez 3 słupki Płyty z M3×8. Policzyć przekrój słupków na 20 N od przodu i 0,7 N·m.

**Pewność:** wysoka co do przeszkód. Wariant „wspornik w Płycie” to moja propozycja; nie przeliczałem sztywności słupków.

## WAŻNE

### W1. Okno ogranicznika: elipsa z Variable Studio styka się ze Słupkiem wewnątrz zakresu pracy, a zapas idealnej otoczki to 0,31 mm, nie 0,50

**Miejsce:** pkt 3.1 (ogranicznik), pkt 8 (`oknoA` 12,04, `oknoB` 11,04), zał. A5, pkt 3.4 („83 N na wieniec”).

**Rachunek [R]** (`okno2.py`). Słupek to walec R7,65 do z −5 w układzie świata. Płyta Uchwytu leży na z_b −6.

| Płaszczyzna płyty | Otoczka na granicy ±27/±17: x / y / max (pod φ −34°) | Elipsa 12,04 × 11,04 minus przekrój w pracy | Zapas idealnej otoczki w pracy |
|---|---|---|---|
| środek z_b −6 | 11,64 / 9,83 / **12,66** | **−0,38 mm** | 0,31 |
| płyta 2 mm (z_b −5…−7) | 12,15 / 10,14 / 13,28 | **−0,92 mm** | 0,34 |
| płyta 3 mm | 12,40 / 10,29 / 13,59 | −1,19 mm | 0,36 |

- Otoczka nie jest elipsą: na przekątnej φ ≈ −34° wymaga 12,66–13,28. Elipsa o tych półosiach zatrzymuje gałkę już w narożnikach zakresu pracy (−25; ±15).
- Kontakt wypada po stronie, gdzie płyta schodzi w dół, czyli na Słupku na **z −9…−13**, a nie na „wieńcu z −5,5…−7”. W tym pasie Słupek ma ściankę 2,0 nad kieszenią kardana i otwór Ø4,2 na wkręt M4 (z −9,1).
- Siła przy 0,5 N·m wynosi 0,5 / 0,012 ≈ 42 N, a nie 83 N (ramię 10–13 mm). Na korzyść koncepcji.
- Rama okna do kulki M2: 0,46 mm, przy płycie 2 mm 0,35 mm. W obu przypadkach < 0,5.

**Scenariusz porażki:**
- Oko w narożniku zakresu dojeżdża pod prądem do ogranicznika, wbrew zasadzie z briefu; serwo stoi zablokowane i się grzeje.
- Krawędź płyty 2 mm wchodzi w otwór Ø4,2, jeśli wkręt M4 nie jest z nim zlicowany.

**Poprawka:**
- Okno jako otoczka liczona na **tylnej powierzchni płyty** (z_b −6 − T/2), zapisana jako krzywa z tabeli punktów, a nie elipsa `oknoA × oknoB`.
- `zapasOgr` 3° (ograniczniki ±28/±18). Sprawdzić kardan przy ok. 33° i K1 przy nowych ogranicznikach.
- Kulki M2 odsunąć od ramy okna o ≥ 0,5: rama węższa przy φ 0°/90° albo `pktR` 19, co wymaga K1 na nowo.
- M4 przez ściankę Słupka przyciąć na zlicowanie ±0,2 albo otwór obrócić poza strefę kontaktu.

**Pewność:** wysoka co do otoczki i znaku wyniku. Wartości zależą od grubości płyty, której koncepcja nie podaje.

### W2. Drut powieki górnej nie mieści się między rurą a S_Y przy realnym zagięciu Z, a kabel S_Y wychodzi w strefę ramienia powieki

**Miejsce:** pkt 3.3 („zagięcie Z zajmuje ±1,8 mm w x”), pkt 6, zał. A3–A4 („drut G – rura 0,52”, „drut G – korpus S_Y 0,89”, „przegub H jako walec 5 mm R2”), pkt 6 „Kable”.

**Rachunek [R]** (`sweep.py`):
- **Zagięcie Z ma promień wewnętrzny.** Drut sprężynowy Ø1,2 gięty szczypcami ma r_i ≈ 0,5–1·d. Noga zagięcia leży więc ±(1,2 + 0,1 + r_i + 0,6) od środka zaczepu, czyli ±2,5…3,1 (oś drutu), a nie ±1,2 jak w modelu.
- **Wyniki przemiatania:**

  | Para | r_i 0 | r_i 0,6 | r_i 1,2 |
  |---|---|---|---|
  | drut G – spód S_Y (x −26), drut po stronie +x Ramienia G | 1,05 | **0,60** | **0,00** |
  | ten sam drut po stronie −x Ramienia: do rury | 0,76 | **0,22** | **−0,31** |
  | ogon Z przy zaczepie G, skierowany „od H”, do kuli, powieka otwarta | — | **−0,02** | — |
  | wykorbienie D po stronie +x Ramienia, do kuli | 0,20 | −0,16 | −0,51 |

  Drut G jest ściśnięty: z jednej strony ma rurę, z drugiej S_Y. Dochodzi tolerancja gięcia ręcznego ok. ±0,5.
- **Kabel S_Y:** MG90S ma wyjście przy dnie krótszego boku od strony wałka [F, `sprzet.md`, dziennik 18.10].
  - Dla S_Y to punkt ok. (x −25; y 3; z −43,1).
  - Ramię G zamiata y −2…+3,9, z −45,9…−70,7 na x −28,5…−31,5, czyli 2,5–4 mm od wyjścia kabla. Zdanie „kable S_X i S_Y biegną po zewnętrznej stronie klatki” dla S_Y nie ma drogi.

**Scenariusz porażki:** drut trze o dno S_Y albo o rurę przy każdym mrugnięciu. Kabel S_Y wchodzi pod ramię powieki górnej i jest ścinany.

**Poprawka:**
- Przesunięcie S_Y o +3,5 w x (K2) daje spód S_Y na −22,5, czyli 3,5 mm więcej dla drutu G i kabla.
- Do briefu: przyrząd do gięcia obu drutów (kołki na długości 49,95/41,7 i wykorbienie). Oba zagięcia Z wygięte na stole.
- Ogony zagięć ≤ 2 mm, skierowane stycznie do czaszy albo na zewnątrz, nigdy do środka.
- Drut D wchodzi w orczyk od strony −x.
- Kanał kabla S_Y: wzdłuż czoła w +x, potem między S_Y a S_X (szczelina 3,1 mm). Wpisać jako bryłę do przemiatania.
- W przemiataniu zagięcie Z z r_i 1,2.

**Pewność:** wysoka co do zasady i kierunku. Liczby zależą od przyjętego przebiegu drutu (mój: prosto do 40 %, wykorbienie w x, prosto do H).

### W3. Ograniczniki powiek: bez geometrii, poza przemiataniem, 0,5° za zamknięciem

**Miejsce:** pkt 3.3 („ograniczniki 0,5° dalej”), pkt 3.4, pkt 9 („cele 2° przed ogranicznikami”), pkt 10 krok 9 („sprawdza 2° do ograniczników”).

**Rachunek [R]:**
- **Ogranicznik otwarcia G** (zaczep J przy 150,5°) leży w (x −22; y 12,6; z −22,3), **12,4 mm od ściany rury**.
  - Wypust z rury musi przejść przez płaszczyznę drutu G (x ≈ −24,5).
  - Przed zaczepem, w kierunku ruchu, drut odchodzi pod kątem 47° do stycznej. Przy wypuście szerokości 3 mm zostaje ok. 0,15 mm do drutu.
- **Ograniczniki zamknięcia** są 0,5° za położeniem programowym, czyli 0,29 mm na R33, ok. 5 µs.
  - Martwa strefa MG90S i błąd kalibracji są tego rzędu, a skok po zaniku prądu przestrzeliwuje.
  - Ogranicznik będzie więc zwykłym punktem dojazdu pod prądem.
  - Pkt 9 i krok 9 mówią o 2°, co przeczy 0,5°.
- **Wypusty blokują drogę gałki** (K3).

**Scenariusz porażki:** serwo powieki szumi i grzeje się przy każdym zamknięciu, a wypust ociera o drut.

**Poprawka:** ograniczniki na **Ramieniu powieki G i orczyku D**, o wypusty Płyty. Siła z powieki idzie wtedy drut → ramię → wypust z pominięciem wielowypustu, czyli tak samo dobrze, a w otwartej klatce jest miejsce.
- Zamknięcie: szczelina nominalna 3° (1,7 mm na R33, nadal < 5 mm), ogranicznik 1,5° dalej (0,9 mm szczeliny na ograniczniku). Przycięcie kącików Δ(ρ) przeliczyć dla 1,5°.
- Otwarcie: ogranicznik 2° za otwarciem z podążaniem (bez zmian).
- Wypusty dopisać do przemiatania.

**Pewność:** wysoka co do położenia i marginesu; średnia co do zachowania serwa przy 5 µs.

### W4. Ochrona przekładni MG90S przed ręką dziecka: rozwiązania z warsztatu są, z ograniczeniami

**Miejsce:** pkt 0.4, 3.4, ryzyko 1, P4 („wyrwanie ręką ≥ 30 N”).

**Potwierdzam rachunek autora [R]:**
- przy 0,5 N·m na gałce przekładnia X dostaje 0,644 N·m w pracy i 0,734 na ogranicznikach (3,6–4,1 × 0,177);
- siła w pręcie X dochodzi do **58 N**;
- powieka górna przy 20 N na krawędzi: 0,567 N·m.

Zasilone serwo nie „trzyma”: powyżej 0,177 N·m silnik jest cofany, a zęby przenoszą cały moment zewnętrzny (bezwładność silnika zredukowana przez przekładnię). Ryzyko jest realne.

**Co jest z warsztatu, z liczbami:**
1. **Firmware: PWM tylko w ruchu** (impuls na czas ruchu + 0,2 s, potem wyłączony). Koszt zero.
   - Bez PWM serwo jest cofane momentem tarcia przekładni, a nie walczy prądem zablokowania.
   - Przy 1 sakadzie na sekundę i mrugnięciu co 4 s napęd gałki jest pod prądem ok. 30 % czasu, powieki ok. 8 %. Narażenie spada 3–10×, a przy okazji prąd.
   - Warunek: test „bez PWM” z pkt 9 (25 g na 16 mm) musi przejść.
2. **Przegub M2 przy gałce jako bezpiecznik.** Przy sile wypięcia F moment na serwie X wynosi F·0,013·cos(kąt nacisku) ≤ F·0,013.
   - Wypięcie przy 20–25 N ogranicza X do ≤ 0,26–0,33 N·m (1,5–1,8 × zablokowania), Y (r 15) do ≤ 0,30–0,38.
   - Przy pracy pręt przenosi ≤ 1 N, a przy zablokowaniu własnym serwem 14–19 N (X) i 12–14 N (Y). Próg 20–25 N nie wypina się więc w normalnej pracy.
   - Koszt: wpięcie kulki M2 wymaga wyjęcia modułu (w szkole nie).
   - Do P4: zmierzyć siłę wypięcia wagą bagażową, zamiast wymagać ≥ 30 N.
3. **Zapasowo, gdy T1 nie przejdzie: sprężynowy „servo saver” z drutu Ø1,2** [R, projekt własny, niesprawdzony]:
   - sprężyna skrętna D 8 mm, 8–9 zwojów, k ≈ 0,094 N·m/rad;
   - napięcie wstępne 18° daje 0,03 N·m (sztywno w pracy: moment roboczy 0,007–0,008 N·m);
   - przy pełnym przestawieniu 73,5° moment ≤ 0,15 N·m; naprężenie ok. 1000 MPa (drut sprężynowy wytrzymuje);
   - zajmuje ok. 10 mm w x na piaście Ramienia, więc mieści się tylko przy X (Y po K2 jest ciasne);
   - to rozwiązanie z próbką, nie do pierwszego wydruku.

**Mój wybór:** (1) od razu w firmware, (2) decyzja po pomiarze w P4, T1 jako kryterium. Zgadzam się z autorem, że sprawdzonej mechanicznej ochrony z warsztatu, która zachowuje kalibrację, nie ma.

**Pewność:** wysoka co do momentów i skutku PWM. Siła wypięcia kulek nieznana (B1).

### W5. Głębokość: tył modułu jest na z −73,7, a środek zaradczy z pkt 13 nie działa

**Miejsce:** pkt 2 („do z −72”), pkt 5 (Płyta: tarcza z −67…−70, wycięcie x −29…−36, y −3…+6), pkt 13 („skrócić rurę o różnicę (`dociskMax` 30)”).

**Rachunek [R]:**
- **Ramię G na ograniczniku 58°:** H (y 1,1; z −70,7). Z oczkiem R3 sięga z −73,7, czyli 3,7 mm za tylną powierzchnię tarczy. Głębokość za ścianką 15 mm: **69 mm**, a nie 67.
- **Wycięcie w tarczy jest za małe.** Dla β ≥ 48° koniec ramienia z zagięciem Z jest w grubości tarczy. Potrzeba x −26…−36 (noga Z po stronie +x na −27,2…−26,6) i y −5,5…+7,5 (H od −2,0 do +4,0, oczko R3, luz 0,5).
- **Skrócenie rury niczego nie zmienia.** Głębokość za wewnętrzną ścianką to (z tyłu modułu) − (10 − w), niezależnie od długości rury: tył wyznacza S_PG z wałkiem na z −60. Prawdziwe dźwignie:
  - `glebokoscSrodka` (każdy mm mniej głębokości to mm więcej wystawania);
  - inny układ S_PG (A2 mówi, że innego nie ma);
  - kable wyprowadzone bokiem klatki przed tarczą, a nie przez tarczę, bo zgięcie kabla za tarczą dodaje 8–10 mm.

**Scenariusz porażki:** przy wolnych 65 mm moduł uderza w wieżę, a reguła z pkt 13 każe skracać rurę, co nic nie da.

**Poprawka:** warunek odrzucenia w pkt 13: „wolne < 69 + zapas na kabel przy ściance 15 → `glebokoscSrodka` +Δ albo inna dynia”. B5 oznaczyć jako blokujące dla Płyty. Wycięcie tarczy według liczb wyżej.

**Pewność:** wysoka.

### W6. Model przemiatania i opis części pomijają bryły, które wykonawca musi narysować

**Miejsce:** zał. A4 i lista modelu („korpusy MG90S jako prostopadłościany”), pkt 5, pkt 6.

1. **Klatka serw.** W modelu są gołe korpusy, bez ścianek, bloków pod uszy (M3×10 w ściance 8) i dna.
   - Między S_X (y ≤ −6,55) a S_PD (y ≥ −20,6) zostaje **1,15 mm**, a ścianka nośna ma mieć ≥ 2,0. Między S_Y a S_PG zostaje 2,15.
   - Narożnik kieszeni S_PD (x −18, y −33,5) ma R38,0: do obwiedni Płyty R39,5 zostaje 1,5 mm.
2. **3 słupki Płyty i uszy Ramy:** brak położeń kątowych („do sprawdzenia w Assembly”). Drogi do ominięcia:
   - pręt X przy φ ≈ 0°, R 22–24;
   - pręt Y przy 54–90°, R 18–22;
   - drut G przy 130–170°;
   - drut D przy 230–245°;
   - ramię G na x −28…−34.

   Wolne są np. sektory 20–45° i 195–215° na R ≥ 33 [R, zgrubnie].
3. **Ucho powieki górnej** (x 33,85–36,25) leży poza sferą tej powieki (R33,4), za uchem dolnej (31,2–33,6). Brakuje kształtu mostka od czaszy do ucha wokół ucha dolnego (ρ ≥ r ucha + 0,5, w obrysie rury: przy x 34 |y| ≤ 16,4).
4. **Słupek bez blokady obrotu.** Dziecko kręcące gałką wokół jej osi daje do 0,5 N·m wokół z. Ten moment idzie kardanem w Słupek i na wspornik, a tam trzyma tylko docisk M5 (tarcie ok. 0,7–1,5 N·m przy zacisku w PLA, który pełznie). Potrzebny kształt przeciwobrotowy (spłaszczenie albo wpust).
5. **Gwint M5 w pręcie Ø6:** otwór pod gwint Ø4,2 zostawia ściankę 0,9 mm. Koniec pręta przy orczyku musi mieć ≥ Ø9.
6. **Uchwyt:** brak przekroju łączników między płytą okna (z_b −6) a piastą (z_b +5,5…+12,75) i ich promienia. Łączniki na z_b > −6 muszą leżeć poza otoczką okna dla swojego z_b.
7. **Kolejność śrub orczyków:** wkręt środkowy orczyka Y (x +8, y 3, z −49) jest 3 mm od kulki M5 Ramienia X. Najpierw Ramię Y, potem X, a przy zmianie zęba Y zdjąć X.

**Poprawka:** dopisać 1–6 do pkt 5/6 jako reguły z liczbami. Bryły 1, 2, 4 i kanały kabli dodać do skryptu przemiatania.

**Pewność:** wysoka (1, 3, 5, 7), średnia (2, 4, 6).

### W7. Pytania blokujące B1 i B4 są niekompletne; w B4 przedział przeczy warunkowi odrzucenia

**Miejsce:** pkt 13, 14.

- **B1** musi obejmować to, od czego zależą K1, K2 i W4:
  - odległość od środka kulki do końca obudowy wzdłuż pręta i średnica tej części (K1);
  - kołnierz sześciokątny i gwint czopa kulki M5 oraz długość wystająca za ramię 3 mm (stos nakrętki, K2);
  - siła wypięcia kulki (W4);
  - typ M5 (czy DIN 71802 z zapinką);
  - gwint obudowy: M2 i M5 na pręcie czy inny.
- **B4:** przyjęty przedział „otwór ucha 2,0–2,5” i warunek „< 2,9: M3 nie wchodzi” oznaczają, że przyjęty stan jest stanem odrzucenia.
  - Rozwiercenie do Ø3,2 przy uszach 31,8 / rozstawie 27,7 zostawia **0,45 mm** materiału na zewnątrz otworu [R: ucho 4,7 mm, środek otworu 2,65 od korpusu]. Rozwiercanie odpada.
  - Wariant zapasowy podać wprost: M2/M2,5 z nakrętką w kieszeni bloku. Wkręt M2 w Ø2 słabo trzymał w v2.7 (decyzje 21.10).
  - Najpierw sprawdzić, czy M3 wchodzi jak w SG90 (decyzje 21.10).
- **Dopisać do pomiarów:** położenie wyjścia kabla MG90S (bok, wysokość) i wysokość wieżyczki wałka nad korpusem (K2, W2).

**Pewność:** wysoka.

## DROBNE

- **D1. Znak θ.** R = Rx(θ)·Ry(ψ) i tabela 7 ((0; +15): P_Y z −6 → −1,1) dają **θ+ = spojrzenie w dół**.
  - Pkt 7 („Y: α dodatnie = gałka w górę”) i reguła podążania „otwG + 0,33·θ dla θ > 0” zakładają θ+ w górę.
  - Liczby zapasu tęczówki są symetryczne, ale firmware z tymi wzorami otworzy górną powiekę przy patrzeniu w dół.
  - Poprawka: zdefiniować θ+ = góra (R = Rx(−θ)·Ry(ψ)) albo odwrócić znak w pkt 7 i 9.
- **D2. Masa.** Tarcza Płyty Ø79 × 3 to sama 14,7 cm³, czyli ok. 18 g. Z klatką, blokami uszu i słupkami Płyta waży ok. 30 g, a całość ok. 240 g (w ±20 %).
  - Odchudzenie bez ścianek < 2 mm: tarcza jako pierścień ze szprychami, −8…−10 g. Więcej się nie da, bo części kupne to ok. 103 g, więc 130–150 g jest nieosiągalne przy 4 serwach.
  - Dla mocowania masa nie ma znaczenia: 0,052 N·m od ciężaru wobec 0,7 N·m od ręki. Liczy się P5.
- **D3. P3:** 1000 mrugnięć to ok. 1 h pracy, a wystawa ma rząd 10⁵. Wystawanie DIN 913 mierzyć po teście 24 h (ok. 21 600 cykli).
  - Ucho dolne pracuje na 1,85 mm wkrętu minus faza końca DIN 913 (ok. 0,3–0,5).
  - DIN 913 M3×10 odpada: koniec na x 29,75, w kuli.
- **D4. Gałka – Uchwyt M3×8:** 2,5 + 5,5 = 8, czyli koniec wkrętu na ściance czaszy. Nadlew ≥ 6,1 (dno 0,6), żeby wkręt nie wypychał białego frontu.
- **D5. Zapas tęczówki przy powiece dolnej:** 1,3° = 0,75 mm na R33. Każdy błąd kalibracji > 1° zasłania brzeg.
- **D6. Obejma na kablach:** podać, czy wtyczki przekłada się przez pierścień, czy kable przez szczelinę C (szczelina 3 mm, kabel 1,2 × 3).
- **D7. Kardan:** w `decyzje.md` stoi Ø11 × 24, w v2 i `sprzet.md` 25,5. „Zgięcie > 90°” jest niejednoznaczne.
  - W P1 zmierzyć zbliżenie ucha przednich widełek do czoła Słupka (z −5,5) przy 31,6°. Szacuję 0–0,5 mm zapasu [Z, kształt widełek nieznany].
  - O-D5 nie jest zamknięte regułą.
- **D8. Sprzężenie θ–ψ w powiekach:** podążanie liczone od θ zadanego, a nie od kąta serwa Y. Bez zmian, tylko do opisu firmware.

## Pytania z briefu, krótko

1. **Uwagi z pierwszej rundy:** tabela niżej.
2. **Napęd powiek:**
   - kinematyka dobra, bez martwych punktów;
   - kąty nacisku ≤ 46,5° w zakresie;
   - siła przycięcia 6,5–7,7 / 7,5–8,8 N, zgodnie z autorem;
   - zaczep drutu Z w otworze Ø1,4 trzyma kształtem i nie wypadnie; nacisk 0,2 MPa, zużycie małe;
   - upakowanie przy realnych zagięciach się nie mieści (W2); ograniczniki W3.
3. **Napęd gałki:**
   - mieszanie M2/M5 nie psuje kinematyki (liczą się środki kulek);
   - M2 w Ø1,7 na 4 mm trzyma ok. 160 N [R, τ 15 MPa], więc wystarczy przy 58 N;
   - gwint M5 w pręcie Ø6 nie (W6.5);
   - ograniczniki: W1. Droga siły z pominięciem prętów jest poprawna.
4. **Przemiatanie:** uproszczenie ukrywa kolizje:
   - pręt–gałka (K1);
   - nakrętki M5 (K2);
   - zagięcia Z i kabel S_Y (W2);
   - wypusty ograniczników (W3);
   - klatka serw (W6.1).
5. **Ochrona przekładni:** W4.
6. **Masa i głębokość:** D2, W5. Obejma utrzyma 225–240 g; o wyniku decyduje P5 z 0,7 N·m. Na rancie moment obciąża tylko część pierścienia: przy 1/4 obwodu 47 N daje ok. 0,36 MPa, a nie 0,09.
7. **Obrys i montaż:**
   - Ø79,5 bez uwag poza W5;
   - rant 2 mm zgodny z decyzją;
   - kroki w dyni: 3 ruchy plus wtyczki, zgodnie z briefem;
   - montaż na stole niewykonalny (K3).
8. **Luzy, DFAM, prąd, kanały:**
   - luzy z tabeli: powieka–gałka 1,2 i ucha 0,2/0,25 zgodne; ruchome obok siebie poniżej 0,5 w K1, K2, W1, W2;
   - DFAM: części mieszczą się na A1 mini; wypust ogranicznika otwarcia w Ramie byłby wspornikiem 12 mm bez podparcia (kolejny powód W3);
   - prąd i kanały 12–15 bez uwag; W4.1 zmniejsza prąd średni.
9. **Gotowość do CAD:** gałka i powieki w kinematyce tak. Rozmieszczenie brył: nie bez K1–K3 i W1–W3, W6, W7.
10. **Źródła:** tabela na końcu.

## Uwagi z pierwszej rundy: czy zamknięte (liczbami)

| ID | Stan | Uzasadnienie |
|---|---|---|
| Fable K1, K2, K3 / Opus O-K1 / Astra A1 | **zamknięte** | Dźwignie i przeguby M3 przy osi usunięte. Zaczepy J: do rury 1,70, do kuli 1,46 [R]. Stosy M3 przy powiekach znikły, ale doszedł stos M5 (K2) |
| Astra A2 / Fable W2 / Opus O-W5 | **częściowo** | Ogranicznik przeniesiony na Uchwyt–Słupek (dobrze), ale elipsa okna działa wewnątrz zakresu (W1); ochrona przekładni W4 |
| Astra A3 | zamknięte decyzją | Skok kończy się 0,5° przed ogranicznikiem zamknięcia (W3) |
| Astra A4 | **zamknięte** | Siła liczona osobno dla każdej powieki; odtworzone 6,5–7,7 / 7,5–8,8 N |
| Astra A5 | **zamknięte** | Odtworzone wszystkie zakresy, kąty po obu stronach, wychylenia kulek, macierz |
| Astra A6 | częściowo | Ø79,5 tak; głębokość W5 |
| Astra A7 / Fable W6, W10 | zamknięte | 2 części, rura pełna −3…−37, PETG, P5 z 0,7 N·m i 72 h |
| Astra A8 | **otwarte** | Przemiatanie bez pełnych brył: K1, K2, W2, W6 |
| Astra A9 / Fable W9 / Opus O-W3 | zamknięte | Orientacje i podpory podane |
| Astra A10 | zamknięte | 4 serwa w budżecie, test 25 g / 16 mm |
| Astra A11 | zamknięte | Rozróżnienie źródła i adaptacji jest |
| Astra A12 / Fable W3 / Opus O-W6 | częściowo | B1/B4 niekompletne (W7) |
| Fable W1 | nieaktualne | DIN 913 jest |
| Fable W4 | częściowo | Kanały są, ale kabel S_Y nie ma drogi (W2) |
| Fable W5 | zamknięte | G–D ≥ 4,7 mm, potwierdzam rząd wielkości |
| Fable W7 | częściowo | Tarcza z tyłu, ale słupki bez położeń (W6.2), wycięcie tarczy za małe (W5) |
| Fable W8 | zamknięte | M4 przez ściankę do gwintu piasty; ścianka trzyma ok. 260 N |
| Fable W11 | częściowo | Wycięcie 80° za płytkie dla Ø6 (K1) |
| Fable W12 | częściowo | Tabela i znaki są, ale znak θ błędny (D1) |
| Opus O-W1 | zamknięte | T1 z kryterium |
| Opus O-W2 | **zamknięte** | Wzór Δ(ρ) sprawdzony: (1° + 2Δ)·ρ·π/180 = 0,5 mm |
| Opus O-W4 | częściowo | P3 za krótki (D3) |

## Źródła: co sprawdziłem

| Powołanie w v2 | Wynik |
|---|---|
| Make, Cogley Simplified: „This pivot point is for the y-axis of the eye motion and the eyelids” | **Sprawdzone, jest.** 6 × SG90, 4 serwa powiek. Strona sugeruje osobne serwo każdej powieki, choć nie mówi tego wprost. Łącznik powieki drukowany, na M2 do ostatniego otworu orczyka; drutu w powiekach tam nie ma |
| GitHub EyeMech ε3.2: 4 kanały powiek | **Sprawdzone:** 6 serw, GPIO12–15 = Top Left, Bottom Left, Top Right, Bottom Right |
| Instructables „on the Cheap”: „I bent a little hook into the wire…” | **Niesprawdzone:** strona zwraca sam tytuł, a wyszukiwanie cytatu nic nie dało. Według Fable z rundy 1 haczyki z drutu są w otworach **gałki** i w orczyku, nie w powiekach. Łącznik Z w powiekach jest więc adaptacją [A], co v2 uczciwie oznacza |
| Instructables DIY Compact („M2 servo ball-links”), Stan Winston 6206, components101 | Nie sprawdzałem ponownie; w rundzie 1 sprawdzone (moje review v1 i Fable) |

## Zestawienie

| Waga | # | Jedno zdanie |
|---|---|---|
| KRYTYCZNE | K1 | Pręt X Ø6 przechodzi 1,25–1,78 mm (oś) od krawędzi czaszy gałki, także w pracy; pręt Y wchodzi 0,8 mm w wycięcie powieki górnej; przemiatanie liczyło cieńsze pręty |
| KRYTYCZNE | K2 | Stos nakrętki M5 Ramienia Y wchodzi 2,5 mm w korpus S_PG w całym zakresie; nakrętka X mija narożnik S_X o ±0,3 |
| KRYTYCZNE | K3 | Gałka nie przejdzie obok wspornika Słupka w Ramie ani przez powieki; dolna powieka też nie wejdzie od tyłu; montaż z pkt 10 niewykonalny |
| WAŻNE | W1 | Elipsa okna 12,04 × 11,04 styka się ze Słupkiem w narożnikach pracy (−0,38 / −0,92 mm); otoczka daje 0,31, nie 0,50; kontakt na z −9…−13 przy otworze M4 |
| WAŻNE | W2 | Przy realnym zagięciu Z drut G ma 0–0,6 mm do S_Y albo −0,3–0,2 do rury; kabel S_Y wychodzi w strefę ramienia G |
| WAŻNE | W3 | Ograniczniki powiek bez geometrii, wypust otwarcia G 12 mm od ściany przy drucie; zamknięcie 0,5° za limitem programowym |
| WAŻNE | W4 | Ochrona przekładni: PWM tylko w ruchu od razu, kulka M2 jako bezpiecznik po pomiarze wypięcia, sprężynowy servo saver z drutu jako zapas |
| WAŻNE | W5 | Tył modułu na z −73,7 (69 mm za ścianką 15), wycięcie tarczy za małe, środek zaradczy „skrócić rurę” nie działa |
| WAŻNE | W6 | Brak klatki serw w przemiataniu (ścianka 1,15 mm S_X–S_PD), położeń słupków, mostka ucha górnej powieki, blokady obrotu Słupka, grubości pręta przy M5 |
| WAŻNE | W7 | B1 bez długości obudowy, stosu czopa i siły wypięcia; B4: przyjęty przedział jest przypadkiem odrzucenia, rozwiercenie zostawia 0,45 mm |
| DROBNE | D1–D8 | Znak θ; masa Płyty ok. 30 g; P3 za krótki; nadlew M3 bez dna; zapas tęczówki dolnej 1,3°; Obejma na kablach; kardan 24/25,5 i widełki przy czole Słupka; podążanie powiek |

## Werdykt

**TAK PO POPRAWKACH.** Architekturę zostawiam: kardan 5/5, pręty S–S M2/M5, 4 × MG90S, czworoboki powiek z drutu na wspólnej osi. Przed wysłaniem briefu CAD realizator musi powtórzyć skrypt przemiatania na poprawionym modelu i podać nowe minima. Modelu przemiatania przyjmować w obecnej postaci nie wolno: pręty Ø6, obudowy M2, nakrętki M5, zagięcia Z z r_i 1,2, klatka serw, płyta okna z grubością.

Poprawki do wpisania w brief:
- wspornik Słupka w Płycie i nowa kolejność montażu (K3);
- ograniczniki powiek na ramionach serw: zamknięcie 3°/1,5° (W3);
- S_Y z Ramieniem Y +3,5 mm w x (K2, W2);
- lokalne wycięcia krawędzi czaszy gałki i `wyciecieG` 77° (K1);
- okno jako otoczka na tylnej powierzchni płyty, `zapasOgr` 3° (W1);
- wycięcie tarczy x −26…−36, y −5,5…+7,5, warunek głębokości 69 mm (W5);
- reguły z W6;
- uzupełnione B1/B4 (W7).
