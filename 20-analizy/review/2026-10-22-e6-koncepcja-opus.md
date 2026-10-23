# Review koncepcji dużego oka 2c (E6.1), recenzent Opus, 22.10

Oceniany plik: `20-analizy/2026-10-22-duze-oko-2c-koncepcja.md`. Brief recenzji: `20-analizy/review/brief-review-e6-koncepcja.md`. Tylko do odczytu; raportów Fable i Astry nie czytałem. Wagi według `AGENTS.md`: **KRYTYCZNE** (nie zadziała albo test nic nie wykaże), **WAŻNE**, **DROBNE**. Oznaczenia: **[F]** fakt (źródło, plik), **[R]** mój rachunek, **[Z]** założenie.

## Jak liczyłem

Skrypty w Pythonie poza repo. Układ współrzędnych i wszystkie liczby wejściowe wziąłem z koncepcji (pkt 1, 2.2, 2.3, zał. A2, A3, A7).

- **Gałka:** R = Rx(θ)·Ry(ψ), punkty X (−18; 0; −6) i Y (0; −18; −6), ramiona r16/r15 wokół osi ∥ x w (y 16; z −45) i (y −3; z −45). Siatka ψ ±27 × θ ±17 co 1°.
- **Powieki:** czworoboki płaskie w yz. Najpierw ustaliłem konwencję kątów: β dźwigni liczone od −z w stronę +y, kąty ramion serwa od +y w stronę +z. Tylko ta konwencja daje długości cięgien 35,8 i 41,6 z koncepcji. Potem przemiatałem serwo 0→73° co 0,5° i rozwiązywałem kąty powiek przez ciągłość.
- **Zgodność z autorem:** tabela A3 wyszła 1:1 (np. 20° serwa → górna 12,9°, dolna 6,4°; 73° → 51,2° i 27,1°), A2 też, z dokładnością do znaku (np. (25; 0) → serwo X 31,0°; sprzężenie Y 4,47°). Rozbieżności niżej wynikają więc z geometrii, a nie z innej interpretacji danych.

Sprawdzone jako **poprawne** [R]:
- przenoszenie gałki ≥ 51° (X) i ≥ 60° (Y; autor podaje 56);
- przegięcie kardana 28,9° w zakresie pracy i 31,6° na ogranicznikach;
- wychylenie kulek ≤ 24,6° (gałka) i ≤ 15,6° (orczyk);
- oś pręta przechodzi przez otwór czaszy z odstępem ≥ 2,47 mm od krawędzi;
- pręty mają ≥ 25,8° kątowo do zakresu omiatanego przez powieki i ≥ 5,8 mm do Słupka; odległość między prętami ≥ 17,6 mm;
- uzasadnienie S–S w A1 jest poprawne (5 stopni swobody plus obrót pręta wokół własnej osi);
- stos przy osi powiek daje R39,75, arytmetycznie dobrze.

**Napęd gałki jest policzony rzetelnie. Napęd powiek w tej geometrii się nie mieści.**

## KRYTYCZNE

### K1. Sprzężenie powiek nie mieści się w Ramie ani w Ø79,5: cztery kolizje w zakresie 0–73° serwa

**Miejsce:** pkt 2.3, zał. A3 i A7, pkt 5 (pary „dźwignia dolna – nadlew górnej”, „cięgno – dźwignia”), schemat pkt 6.

**Rachunek [R]** (przemiatanie czworoboków, liczby autora):

1. **Dźwignia górna wychodzi poza obwiednię.** Leży w warstwie x 33,85–36,25. Jej czop (r22) przechodzi z (y −14,2; z −16,8) przy zamkniętych powiekach do (y −22,0; z +0,5) przy otwartych.
   - W tej warstwie wnętrze rury R37,75 (z luzem 0,5: R37,25) pozwala na |y| ≤ 16,7 przy x 33,85 i ≤ 10,5 przy x 36,25.
   - Odległość od osi z: sam środek czopu przy x 33,85 ma R_xy 36,7 → **40,4** (otwarte); brzeg nadlewu r3,5 przy x 36,25 ma **40,3** już przy zamkniętych i **44,3** przy otwartych. Obwiednia to 39,75.
   - Dźwignia wchodzi więc w ściankę rury w całym zakresie i do 4,6 mm poza Ø79,5. To strefa z −17…0, czyli wnętrze otworu w dyni: moduł z powiekami nie przejdzie przez otwór Ø80, a w dyni dźwignia trze o miąższ.
2. **Cięgno górne przecina czaszę powieki dolnej.** Cięgno leży w warstwie x 25,9–28,3, ma szerokość 5. Od ok. 45° serwa wchodzi w czaszę dolnej powieki (R31,2–33,4, sektor −117…−38°) na głębokość do **1,1 mm** (przy 50–73° serwa; np. punkt x 27,1; y −15,9; z −7,5; φ −115°). A7 sprawdza elementy powiek tylko wobec kuli R30,5, nie wobec drugiej powieki.
3. **Dźwignia górna przechodzi przez łeb śruby przegubu dolnego.** Nakrętka przegubu dolnego jest po stronie −x (A7), więc łeb M3 (2,45) leży na x 33,6–36,05, czyli w warstwie dźwigni górnej.
   - Odległość osi dźwigni górnej od środka przegubu dolnego spada z 10,7 mm (0°) do **0,5 mm (50°)** i wraca do 6,6 (73°).
   - Potrzeba ≥ 3 (łeb) + 3 (pół szerokości dźwigni) + 0,5 = 6,5. **Kolizja trwa od ok. 25° do 70° serwa.**
4. **Drobniejsze w tym samym pasie:**
   - nadlew dźwigni dolnej (r14 + 3,5) przy x 33,6 sięga R_xy 37,88 przy zamkniętych powiekach, przy wnętrzu rury 37,75 (wymagane ≤ 37,25);
   - nadlew dźwigni górnej (ρ 18,5 przy x 28,2) mija czaszę dolnej o 0,33 mm (wymagane 0,5);
   - nakrętka przegubu dolnego mija cięgno górne przy otwartych powiekach o 0,21 mm (patrz W6: nakrętka ma 4,0, nie 2,4).

**Scenariusz porażki:** z tej koncepcji wykonawca nie zbuduje działających powiek. Albo CAD wykaże kolizje i trzeba będzie od nowa liczyć A3 w trakcie budowy, albo, przy złej kontroli, wydruk się nie złoży albo nie przejdzie przez otwór.

**Przyczyna:** dwie dźwignie po jednej stronie, w warstwach na x 31–36. W tym miejscu rura daje |y| ≤ 8,6–16 mm, a dźwignie są skierowane w dół (β −40…−91 i −90…−117), a nie wzdłuż −z.

**Poprawka**, decyzja użytkownika; B5 staje się blokujące:
- **(a) zalecam 4. MG90S.** Każda powieka ma własną dźwignię po swojej stronie, w wewnętrznej warstwie ucha (ucha w kolejności lustrzanej: po +x górne wewnątrz, po −x dolne wewnątrz). W warstwie x 31,2–33,6 wolne jest |y| ≤ 16,1 (R37,25). Dźwignia r22 obracająca się wokół −z o ±25,5° zajmuje |y| ≤ 22·sin 25,5° + 3,5 = 13,0, więc się mieści.
  - To układ sprawdzony: Cogley daje osobne serwo każdej powiece [F, GitHub EyeMech ε3.2, Make Simplified].
  - Powieki odzyskują podążanie za góra–dół.
  - Kanały: 10 planowanych małych oczu + 4 = 14 ≤ 16, więc koszt „najwyżej 12 małych oczu” nie ogranicza planu.
  - Zapasem dla serwa powieki może być SG90: moment powieki 8·10⁻³ N·m to ok. 1/20 jego momentu zablokowania.
  - Układ 4 serw na Płycie trzeba policzyć od nowa (autor pisze, że wymaga przesunięcia S_Y; nie sprawdzałem).
- **(b) przy 3 serwach:** zamienić warstwy (górna dźwignia wewnątrz, dolna na zewnątrz) i obie skierować symetrycznie wokół −z.
  - Górna: β ±25,5°, |y| 13,0 ≤ 16,1. Dolna r14: ±13,5°, |y| 6,8 ≤ 8,6.
  - Potem nowy A3 z przemiataniem kolizji: cięgno–druga powieka, łby i nakrętki, nadlewy, R_xy ≤ 37,25.
  - To nadal niesprawdzona adaptacja.

**Test:** przed briefem CAD przemiatanie 0–73° co 1° (albo zakres nowego układu), dla każdego elementu powiek z pełnymi bryłami okuć. Warunki: (i) R_xy ≤ 37,25, poza oknami ≤ 37,75 − 0,5; (ii) ≥ 0,5 do drugiej powieki, jej cięgna i okuć; (iii) ≥ 0,5 do kuli.

**Pewność:** wysoka. Wejście to liczby autora, a jego tabelę A3 odtworzyłem dokładnie.

## WAŻNE

### W1. Między ogranicznikami ręka dziecka przestawia serwo; wymaganie briefu nie jest spełnione, a test ryzyka 3 nie ma kryterium

**Miejsce:** 2.5 (pierwszy wiersz tabeli), ryzyko 3.

**Fakt i rachunek:**
- Brief: „wymuszony obrót gałki w obu osiach … idą na twarde ograniczniki w ramie, nie na przekładnię serwa”.
- Ograniczniki działają dopiero na ±27/±17. Wewnątrz zakresu siła 10–17 N na kuli R30 (0,3–0,5 N·m) daje w pręcie M/0,019 = 16–26 N, a na ramieniu r16 0,25–0,42 N·m.
- To 1,4–2,4 × moment zablokowania MG90S (1,8 kg·cm = 0,177 N·m przy 4,8 V [F, components101]).
- Zasilone serwo walczy wtedy prądem zablokowania; wielowypust orczyka drukowanego Ramienia jest najsłabszy.

**Scenariusz porażki:** w szkole dzieci kręcą gałką. Serwo X jest cofane w każdym położeniu, Ramię wyrabia wielowypust albo kieszeń orczyka, a gałka traci zero.

**Poprawka:** jedno z dwóch, policzone:
- **Bezpiecznik:** przegub kulowy na gałce wypina się przy znanej sile poniżej ok. 11 N w pręcie (0,177 / 0,016). Wada: wypięcie w dyni wymaga wyjęcia modułu, ale wpięcie nie wymaga narzędzi.
- **Sprzęgło przeciążeniowe w Ramieniu X/Y:** drukowana zapadka o momencie 0,15 N·m.

Test ryzyka 3 musi mieć kryterium, a nie „oględziny”: po 20 cyklach 15 N zero gałki ≤ 1°, brak luzu w kieszeni orczyka ≤ 0,5° i brak zapachu spalenizny przy prądzie zablokowania przez 10 s.

**Pewność:** wysoka co do rachunku, średnia co do tego, czy wielowypust MG90S z Ramieniem PLA to wytrzyma.

### W2. Szczelina zamkniętych powiek „2° = 1,1 mm” obowiązuje tylko na równiku; przy osi spada do 0, a ograniczniki ją zjadają

**Miejsce:** 2.3 „Kryteria”, pkt 9 (tabela: „−1° i +2°”).

**Rachunek [R]:**
- Krawędzie zamykające są południkami przez oś powiek, więc szczelina wynosi ρ·0,0349, gdzie ρ to odległość od osi x.
- Szczelina ≥ 0,5 mm wymaga ρ ≥ 14,3. Przy uchach (x 31,2) czasza ma ρ ≤ 11,9, czyli szczelina ≤ 0,41 mm, a przy samej osi 0.
- „Ogranicznik 1° za położeniem zamkniętym”: jeśli to kąt powieki, obie powieki stają na −10° i szczelina wynosi 0° w całej długości.
- Tolerancja otworów cięgien ±0,2 mm daje ±0,5° (r22) i ±0,8° (r14), czyli ±1,3° rozbieżności przy 2° nominalnej szczeliny.

**Scenariusz porażki:** powieki przy zamknięciu ocierają rantami przy kącikach albo się zakleszczają. Przy jednym serwie napiera ono wtedy pod prądem na drugą powiekę.

**Poprawka:**
- Ogranicznik zapisać jako kąt powieki z szczeliną: `szczelinaZamk` ≥ 2° po dojściu obu dźwigni do ograniczników.
- Krawędzie przy kącikach przyciąć tak, żeby szczelina wynosiła ≥ 0,5 mm aż do ucha (przy ρ < 14,3 krawędź odsunięta od południka).
- W A5 sprawdzić, czy przycięcie odsłania krawędź czaszy.

**Pewność:** wysoka.

### W3. DFAM: Gałka, Powieki i Uchwyt mają nawisy > 45°, a podpory nie są opisane

**Miejsce:** pkt 4, kolumna „Druk”.

**Rachunek [R]:**
- **Gałka** drukowana krawędzią w dół, źrenicą w górę: wewnętrzna powierzchnia czaszy wewnątrz kąta 45° od bieguna (Ø ≈ 40 mm, a powyżej 65° od pionu Ø ≈ 25) to sufit kopuły.
- **Powieki** stojące na płaszczyźnie krawędzi: łuk 100° wznosi się pionowo od stołu i zawija nad środek. Między 45° a 100° pochylenie przekracza 45°, a na szczycie powierzchnia jest pozioma; w przekroju to ok. połowa powieki. Dolna: 79°, czyli 34° łuku ponad granicą.
- **Uchwyt „płasko”:** to część przestrzenna (50 × 45 × 22, łuki po wnętrzu kuli, ramiona do z −6), więc „płasko” nie jest orientacją.

**Scenariusz porażki:** pierwszy wydruk powiek ma nadtopiony sufit albo podpory po wypukłej, widocznej stronie, a „komplet bez podpór” się nie potwierdza. `AGENTS.md` wymaga opisu podpór w README.

**Poprawka:** dla każdej z tych części podać orientację, kąt najgorszego nawisu i podpory: wewnętrzne w gałce i od strony wklęsłej w powiekach. Uchwyt podzielić na płaskie elementy skręcane albo wskazać płaszczyznę stołu.

**Pewność:** wysoka.

### W4. Oś powiek na DIN 913: ucha obracają się na gwincie, a wkręt nie ma blokady osiowej

**Miejsce:** 0.5, 5 (para ucho–ucho–bok), 9.1, B2.

**Rachunek [R]:**
- Wkręt trzyma się na 3,25 mm gwintu w Ø2,6 PLA (bok Ramy wydrukowany z otworem poziomym).
- Ucha Ø3,3 obracają się na gwincie M3 (Ø zewn. 3,0, rdzeń 2,39): luz promieniowy 0,15–0,45 i zużycie zwojami.
- Moment tarcia ucha przy każdym mrugnięciu działa na wkręt w jedną albo w drugą stronę. Po wkręceniu się o 0,55 mm koniec wchodzi w ucho dolne, a po 1,75 mm dotyka gałki (ucho 31,2 − kula 30 = 1,2, plus 0,55).
- Moment od 25 N na ucho przy ramieniu ok. 4,7 mm daje na 3,25 mm gwintu nacisk krawędziowy ok. 23 MPa [R, M/(d·L²/6)].

**Scenariusz porażki:** po tygodniu mrugania gałka zaczyna ocierać o koniec wkrętu albo powieka kiwa się na osi.

**Poprawka:**
- Zamiast DIN 913: kołek walcowy stalowy Ø3 × 8 (ISO 8734 / DIN 6325) wciskany w Ø2,9. Gładka oś, nie wędruje; to też zakup, jak DIN 913.
- Jeśli zostaje DIN 913: wkręt dociągnięty do drukowanego dna (ślepy otwór od strony ucha z kołnierzem 0,6) i ucha na gładkiej tulejce.
- Do P3 dodać 1000 mrugnięć z pomiarem wystawania wkrętu.

**Pewność:** średnia.

### W5. Ograniczniki na prętach nie są „twarde w ramie” i wobec sprzężenia osi wypadają wewnątrz zakresu pracy

**Miejsce:** 2.1 (ostatnie zdanie), 9 krok 10, tabela 9.

**Rachunek [R]:**
- Nakrętka na pręcie Y, 10 mm od kulki orczyka, nastawiona na θ −17 przy ψ 0, stoi na z −29,64.
- W narożniku zakresu pracy (ψ −25; θ −15) ta sama nakrętka dochodzi do z −29,30, czyli **0,34 mm za ogranicznikiem**. Sprzężenie 4,5° serwa zjada 2° zapasu.
- Dla X zapas jest (−42,28 wobec −41,86).

**Scenariusz porażki:** oko w lewym dolnym narożniku dojeżdża pod prądem do ogranicznika, wbrew wymaganiu briefu; MG90S stoi zablokowany i grzeje się.

**Poprawka:**
- Ograniczniki ustawiać według najgorszego narożnika, a nie osi, albo limity programowe liczyć w kątach serwa po kompensacji.
- Nakrętki przeciwnakrętką albo drukowany stały ogranicznik, bo regulowany przestawi się przy uderzeniach.
- Zapisać, w którym kroku kalibracji i przy jakim (ψ; θ) się je ustawia.

**Pewność:** wysoka co do rachunku, średnia co do położenia nakrętki (10 mm to moje założenie [Z]).

### W6. Niekompletne pytania blokujące i stosy okuć: z tej listy wykonawca CAD musiałby zgadywać

**Miejsce:** 12, 13, A7, lista okuć pkt 4.

**Fakty i braki:**
- Nakrętka samohamująca M3 (DIN 985 / ISO 10511) ma wysokość **4,0 mm**, nie 2,4 jak w A7 [F, norma]. Wszystkie stosy przegubów powiek trzeba przeliczyć; przy otwartych powiekach nakrętka przegubu dolnego mija cięgno górne o 0,21 mm, wobec 0,5 wymaganego (K1.4).
- Nakrętki M2 i „tulejki dystansowej 2,6 mm” (A7) nie ma ani na liście części, ani w `sprzet.md` (są tylko wkręty M2×6).
- **Wymiary przegubów kulowych** (Ø gniazda, długość do pręta, Ø kulki, gwint pręta) nie są w B1, a od nich zależy odstęp gniazda od krawędzi czaszy. Przy gnieździe Ø7 na 4 mm i szyjce Ø4,4 dalej wychodzi przy ψ −27, θ −17 **0,28 mm** dla pręta X (w zakresie ±25/±15: 0,79) [R, Z].
- B5 musi być blokujące (K1).
- Brakuje geometrii, którą wykonawca musi znać: kształt Uchwytu (położenie nadlewów, łuków, ramion), szerokości dźwigni i cięgien, położenie okien w rurze (kolizja z Obejmą, patrz D3), ogranicznik prętów na Płycie (łapki, szczeliny przejścia prętów przez Płytę na z −35), prowadzenie 3 kabli z wtyczkami przez Płytę i Obejmę.

**Poprawka:** dopisać do pkt 12 pomiar nakrętki samohamującej i przegubów kulowych, do listy okuć nakrętki M2 i tulejkę (albo ją wydrukować), a do pkt 6 wymienione elementy z liczbami albo z regułą.

**Pewność:** wysoka.

## DROBNE

### D1. Kalibracja: „½ obrotu końcówki kulowej wyrównuje pół zęba” jest liczbowo nieprawdziwe (pkt 9 krok 8)

- Gwint M2 ma skok 0,4, więc ½ obrotu to 0,2 mm, czyli ok. 0,7° serwa na ramieniu r16.
- Pół zęba wielowypustu (20–21 zębów, ok. 17–18°/ząb) to ok. 9° serwa, czyli 2,5 mm.
- Wyrównuje to środek w µs w firmware, co koncepcja i tak ma.
- **Poprawka:** sprawdzić przenoszenie przy przesunięciu zera o ±9°. Z mojego rachunku przy X +34 + 9 = 43° serwa wychodzi ok. 47° (dalej bez martwego punktu), ale to warto zapisać.
- Pewność: wysoka.

### D2. Test „bez PWM” nic nie wykaże (pkt 8)

- Odważnik 5 g na 16 mm daje 0,78·10⁻³ N·m, a koncepcja podaje moment od ciężaru 1,7·10⁻³ (pochylenie) i 2,5·10⁻³ (powieka górna, A4).
- **Poprawka:** obciążenie ≥ 1,5 × najgorszy przypadek, np. 25 g na 16 mm (3,9·10⁻³ N·m).
- Pewność: wysoka.

### D3. Obejma zaciska się na rurze z oknami i z dźwigniami powiek (pkt 3, 4)

- Pas zacisku wypada na z −5…−15 (ścianka 15) albo z −25…−35 (ścianka 35), czyli na całej długości rury za ścianką. Okna (35 % rury) nie mogą tam leżeć.
- Zacisk owalizuje rurę 2 mm, a w niej są ucha i dźwignie powiek.
- **Poprawka:** pas z −5…−35 pełny, bez okien. Masa Ramy rośnie wtedy o ok. 3–4 g [R]. Do P5 dodać pomiar owalizacji rury pod pokrętłem (≤ 0,2 mm).
- Pewność: średnia.

### D4. Szczelina powieka–przód Ramy to 4,5–5,9 mm, czyli w przedziale 5–12 z własnego kryterium koncepcji (2.5)

- Na płaszczyźnie przodu Ramy (z +10) czasza powieki R33,4 jest 5,9 mm od wnętrza rury R37,75, a rant R34,7 jest 4,5 mm od niej.
- Otwierająca się powieka wciąga to, co na niej leży, w szczelinę 5,9 mm, a przechodzący rant zwęża ją do 4,5 (siła ok. 0,177/(0,0347·0,64) ≈ 8 N).
- **Poprawka:** wewnętrzny kołnierz przodu Ramy R35,2 (szczelina 0,5 do rantu, 3,3 do czaszy). Wtedy powieki wkłada się od tyłu (krok 9.1 do zmiany).
- Pewność: średnia (5–12 mm to kryterium z JJR Lab dla zawiasów i części ślizgowych [F], przeniesione przez autora).

### D5. Czoło Słupka na z −5 wobec przednich widełek przy 31,6°

- Dla typowego kardana 23 × 11 [F, oferty sklepów, wkręty ustalające często M4, nie M3] ucha przednich widełek przy przegięciu 31,6° schodzą szacunkowo do z ≈ −5,6 przy promieniu 2–5 mm [R, Z].
- **Poprawka:** czoło kieszeni jako zmienna: obwiednia widełek z pomiaru B3 + 1 mm. W B3 dopisać pomiar wysunięcia uch poza środek krzyżaka.
- Pewność: niska co do liczby, wysoka co do braku reguły.

### D6. Budżet ≤ 15 operacji

- Płyta: tarcza, kołnierz, 3 klatki, łapki ograniczników, szczeliny prętów, kieszeń D, Hole × 3 grupy, fazki. Według mnie przekracza 15.
- Rama jest na granicy (rura, rant, łuk R150, ząbki, okna, boki osi + Mirror, ograniczniki powiek, ucha Płyty, Ustalacz, fazki).
- **Poprawka:** w planie drzewa podział (np. klatka serw jako osobna część) albo uzasadnienie.
- Pewność: średnia.

### D7. Rozruch i skoki (8)

- Po zaniku zasilania pierwszy impuls to sakada pełną prędkością przez cały zakres. Koncepcja nazywa to uczciwie, ale to sprzeczne z zasadą „serwo bez gwałtownych skoków”.
- **Poprawka:** jeśli parkowanie przed wyłączeniem PWM jest zapisane w NVS, przy starcie wysyłać najpierw pozycję parkowania. Skok jest wtedy duży tylko po zaniku zasilania w ruchu albo po ręcznym przestawieniu oka.
- Pewność: średnia.

## Pytania z briefu recenzji: krótko

1. **Kinematyka gałki:** potwierdzona w całym zakresie z przekątnymi:
   - martwego punktu nie ma, sprzężenie 4,47° (Y przy ψ −25) i 0,84° (X przy θ ±15);
   - kardan 31,6°, przy czym kąt ≥ 33° jest niezmierzony (B3);
   - kolizji prętów z powiekami, Słupkiem i sobą nie ma; z czaszą zostaje 2,47 mm do osi pręta, a gniazdo przegubu wymaga pomiaru (W6).
2. **Powieki:** nie mieszczą się (K1), szczelina przy kącikach (W2). Siła przycięcia 5,6 N policzona dobrze (0,177/(0,034·0,93)).
3. **Obrys:** stos osi R39,75 jest dobrze policzony, ale dźwignia górna wychodzi do R44,3 (K1). Głębokość 65 mm przy ściance 15: zgodna. Wsuwanie: bez uwag poza K1.
4. **Mocowanie:**
   - moment 0,03–0,05 N·m to ok. 1/40 tarcia Obejmy nawet przy 4 × mniejszym docisku niż w rachunku pasa (sztywny pierścień C nie przylega jak taśma); P5 dobrze pomyślane;
   - ręka dziecka ciągnąca powiekę (50 N) mieści się w tarciu;
   - ryzykiem jest pełzanie PLA pod pokrętłem przez dni: do P5 dodać pomiar po 24 h docisku.
5. **Źródła:** tabela niżej.
6. **Wytrzymałość:** W1 (zakres pracy), W4 (oś powiek). 20 N od przodu przez kardan i Słupek: rachunek autora (6 MPa) przyjmuję. Uchwyt (3 g, łuki) nie ma rachunku: dopisać przekrój łuków.
7. **Luzy:** K1 (0,21–0,33 mm i kolizje), W2 (szczelina przy kącikach), W6 (gniazdo przegubu 0,28 mm). Pozostałe pary w tabeli pkt 5 są zgodne z `AGENTS.md`.
8. **DFAM:** W3. Wszystkie części mieszczą się na A1 mini (największe Ø96 i Ø84): zgadza się.
9. **Prąd:** szacunki uczciwie oznaczone jako szacunki. Kanały 13–15 i podtrzymanie z GPIO: bez uwag. D2, D7.
10. **Gotowość do CAD:** dla gałki prawie tak (W6), dla powiek nie (K1).
11. **Zgodność z briefem:**
    - spełnione: 2c, Ø80, lekkość (175 g, bez gwintu i kasety, ścianki ≥ 2), M3, bez wkładek, nakrętki samohamujące, rant Ø84 (2 mm poza otwór), 2 ruchy w dyni;
    - sprzężenie powiek nie jest sprawdzonym mechanizmem i w tej postaci nie działa;
    - zakupy: przeguby kulowe z prętami, DIN 913 albo kołki Ø3, nakrętki M2. Bez zakupów nie wychodzi: zamiennik drukowany przegubu kulowego jest niesprawdzony, a przy łbach 2,45 gałka ma Ø56 (wyliczenie autora, przyjmuję). Cen nie sprawdzałem.

## Źródła: co sprawdziłem

| Powołanie w koncepcji | Wynik |
|---|---|
| Make, Cogley Simplified: „This pivot point is for the y-axis of the eye motion and the eyelids” | **Sprawdzone, jest.** Strona mówi o „eyelid servos”; 6 SG90 na 2 oczy, czyli serwo na powiekę |
| Stan Winston, „Some setups use a single servo for all 4 lids” | **Sprawdzone, jest** (Chris Ellerby, admin). Bez zdjęć i bez zbudowanego przykładu; sam dodaje, że traci się podążanie za góra–dół |
| Stan Winston, „The center of the eye needs to line up with the silver pins…” | **Sprawdzone, jest.** Kardan RC za okiem, rdzeń oka wydrążony. Linkowane zdjęcia budowy i schematu (nie oglądałem) |
| GitHub EyeMech ε3.2: kanały powiek osobno | **Sprawdzone:** 6 serw, GPIO12–15 to 4 powieki. **Przegubów kulowych strona GitHub nie wymienia** |
| Instructables „…on the Cheap” (kardan 3 mm, druty) i „DIY Compact…” (6 × MG90S, „M2 servo ball-links”, „professional”) | **Niesprawdzone:** Instructables zwraca stronę bez treści (blokada). Do potwierdzenia przez użytkownika albo w filmie |
| components101 MG90S: 0,177 N·m przy 4,8 V | **Sprawdzone:** 1,8 kg·cm przy 4,8 V, 2,2 przy 6 V, 13,4 g |
| JJR Lab EN 71-1: 5 / 12 mm | **Sprawdzone:** dotyczy zawiasów, części ślizgowych i kluczyków; przeniesienie na powieki to interpretacja |
| Kąt przegięcia kardana RC ≥ 33° | **Brak danych w ofertach.** Typowe wymiary 23 × 11 mm, wkręty M4. Pomiar B3 konieczny |

Adaptacja kardana RC i prętów S–S do skali Ø60 nie zmienia zasady (punkt i oś kardana w środku kuli; Cogley i Stan Winston robią tak samo). Zmienia za to kolizje, a te policzyłem wyżej. Sprzężenie powiek nie ma pierwowzoru.

## Zestawienie

| Waga | # | Jedno zdanie |
|---|---|---|
| KRYTYCZNE | K1 | Dźwignia górna sięga R40,3–44,3 przy obwiedni 39,75; cięgno górne wchodzi 1,1 mm w powiekę dolną; dźwignia górna przechodzi przez łeb przegubu dolnego przy 25–70° serwa |
| WAŻNE | W1 | Między ogranicznikami dziecko cofa serwo 1,4–2,4 × momentem zablokowania; brak bezpiecznika i kryterium testu |
| WAŻNE | W2 | Szczelina zamkniętych powiek < 0,5 mm przy ρ < 14,3 i 0 przy ogranicznikach „−1°” |
| WAŻNE | W3 | Gałka, powieki i Uchwyt mają nawisy > 45° bez opisanych podpór |
| WAŻNE | W4 | Oś powiek DIN 913: ucha na gwincie, wkręt może się wkręcić 1,75 mm do gałki |
| WAŻNE | W5 | Ogranicznik θ ustawiony na osi wypada 0,34 mm wewnątrz narożnika zakresu pracy |
| WAŻNE | W6 | Nakrętka samohamująca ma 4,0, nie 2,4; brak nakrętek M2, wymiarów przegubów kulowych i geometrii Uchwytu, okien i ograniczników; B5 blokujące |
| DROBNE | D1–D7 | ½ obrotu = 0,2 mm, nie pół zęba; test bez PWM za lekki; Obejma na oknach; szczelina 5,9 mm przy przodzie Ramy; czoło Słupka bez reguły; budżet operacji Płyty; skok przy rozruchu |

## Werdykt

**NIE w obecnej postaci:** napęd i podparcie gałki (kardan, pręty S–S) oraz mocowanie M1 nadają się na brief CAD po poprawkach W1, W5 i W6, ale sprzężenie powiek trzeba przeprojektować architektonicznie (zalecam 4. MG90S z dźwigniami po obu stronach w wewnętrznych warstwach uch, albo przy 3 serwach zamianę warstw i dźwignie symetryczne wokół −z) i potwierdzić przemiataniem kolizji przed briefem CAD.
