# Moduł małego oka v2.2: gniazdo + kaseta (do review)

Zlecenie v2.2 po review v2.1d (Opus + Codex): modułu v2.1d nie dało się złożyć, więc zmieniona jest koncepcja. Wymaganie użytkownika: **w dyni nic się nie skręca, wkłada się gotowy moduł**.

**Onshape:** dokument SimpleEye, gałąź **v2**, wersja **„v2.2 do review”**.
- Part Studio **Oko F v2.2**: 17 części, 268 operacji w folderach, płaszczyzny i szkice ukryte.
- Variable Studio **Zmienne v2.2**: Part Studio v2.2 odwołuje się tylko do niego.
- Assembly **Oko F v2.2 - zlozenie**.

v2.1 (Part Studio „Oko F v2.1” i „Zmienne v2”) zostaje bez zmian, a w historii są wersje v2.1–v2.1d, „v2 do review”, „v1.1” i „v1”. Ten plik w wersji v2.1d jest w historii gita.

## Koncepcja

1. **Gniazdo** montuje się raz w dyni:
   - od zewnątrz wkłada się je w otwór, rant opiera się na skórce,
   - od środka nakręca się nakrętkę.
   - W środku nie ma mechanizmu.
2. **Kaseta** to kompletny moduł oka złożony na stole: tuleja, jarzmo z wklejoną piłeczką na osi 2 × M3, napęd, SG90 na sankach i pokrywa.
3. **Kasetę wsuwa się od środka dyni** osiowo, bez obrotu:
   - rowek kasety wchodzi na żebro gniazda (jedna pozycja: oś oka pionowa, GÓRA u góry),
   - czoło kasety opiera się o kołnierzyk gniazda (Ø41, piłeczka wystaje ok. 8 mm),
   - 2 sprężyste zaczepy zaskakują w okienka gniazda.
   - **Wyjęcie:** ściśnięcie obu haczyków palcami przez okienka i wyciągnięcie kasety do tyłu, bez narzędzi.

## Wymiary (otwór w dyni Ø63,5, otwornica 2½")

| | Wymiar |
|---|---|
| Otwór w dyni | **Ø63,5** (otwornica 2½", w zestawach opisywana „64”; przy 64 luz rośnie, rant zakrywa) |
| Kaseta | wnętrze Ø48,5 (z kinematyki), zewnątrz **Ø54,5** (ścianka 3), długość 76 |
| Gniazdo | otwór Ø54,9 (luz 0,2 na stronę), rdzeń gwintu Ø58,9 (ścianka 2) |
| Gwint gniazda | 45°, **skok 5**, zarys 2,0, zewnątrz **Ø62,9** = część w otworze (0,3 na stronę w Ø63,5) |
| Nakrętka | **Ø74 × 7**, otwór **Ø59,5** (`nakretkaOtwor` = rdzeń 58,9 + 2 × `luzGwint` 0,3), zazębienie **1,7 mm** |
| Rant gniazda | **Ø74**, zakładka na skórce 5,25 mm, dopasowany do dyni R 150, ząbki 2–3,25 mm od krawędzi otworu |
| Długość gniazda | 43,7 mm: rant + część w otworze 15 + gwint do 36,7 + strefa zaczepów 7 |
| Ścianka dyni | 15–25 mm |

Skok wzrósł z 3 na 5. Przy flankach 45° i skoku 3 ząb ma najwyżej 1,5 mm wysokości, więc wymaganego zazębienia 1,6–1,8 mm nie da się osiągnąć.

## Części (każda jako osobny Part)

| Part | Szt. | Do czego |
|---|---|---|
| Gniazdo | 1 | Rant z kołnierzykiem Ø41, strzałką GÓRA i 8 ząbkami, część w otworze, gwint z fazą początku zwoju. Od tyłu żebro ustalające (135°, wejście 45°) i 2 okienka na haczyki (59° i 239°) |
| Nakretka | 1 | Ø74 × 7, czoło stożkowe pod wewnętrzną ściankę dyni, radełko, 6 wycięć na klucz. Gwint = zwój gniazda odsunięty o `#luzGwint` |
| Kaseta | 1 | Tuleja Ø54,5/48,5. Występy osi (kropla oparta o czoło) z pogłębieniem Ø6,2 × 1,7 pod ISO 7380 i ciasnym otworem Ø2,6. Szczelina ogranicznika na wylot, kanał kołka od tyłu. Szczelina na serwo od spodu (otwarta do tyłu). Otwory dolne do przegubów C i H, górne do wkrętów orczyka. Wybrania na piasty C i H z pogrubieniem przy H. Rowek ustalający, 2 zaczepy sprężyste, 2 ucha z wkładkami na pokrywę (na zewnątrz) |
| Jarzmo z miska | 1 | Pas kulisty (wnętrze Ø41,5, ścianka 2,5, szerokość 8). Oczka 2,4 mm z wypustką i kołkiem ogranicznika Ø2,6 × 1,6, 6,7 mm za osią. Korba zrośnięta z miską na całej szerokości pasa, piasta C Ø10 (kropla) |
| Ciegno | 1 | Otwory Ø3,3; podniesienia z wkładkami M3 od góry, otwór wkładki 4,6 (4 + 0,6), pod nim 1 mm dna |
| Ramie orczyka | 1 | Kieszeń na orczyk, otwór M2 13 mm od osi, piasta H Ø10 (ścianka 2) |
| Tulejka przegubu korby / ramienia | 2 | Ø5,6 × 2,7 z kołnierzem Ø8 × 0,8, otwór Ø3,3 |
| Sanki serwa | 1 | Dwa słupki pod uszy SG90 (otwory na wkręty z kompletu) połączone prowadnicami, wsuwane od tyłu po krawędziach szczeliny |
| Pokrywa tylna | 1 | Zamyka tył i dociska sanki. Ucha na 2 × M3. Okno 9 × 3,4 na wtyczkę 3-pin, pod nim przewężenie 3,8 × 1,0 zaciskające taśmę 1,4. Od środka prowadnice taśmy na \|x\| ≥ 4,7 |
| Przyrzad do wklejania pileczki | 1 | Stożek 90° centruje piłeczki 39,5–40,5 na osi (okienko na źrenicę). Słupki ze śrubami osi jak w kasecie. Gniazda kołków ogranicznika blokują jarzmo w 0° |
| Przyrzad centrowania orczyka | 1 | Płytka pod kasetą z trzpieniem Ø5,8 przez otwór dolny H do otworu ramienia |
| Probka gwintu - gniazdo / - nakretka | 1+1 | Pierścień 15 mm z gwintem gniazda i kawałek nakrętki Ø74 × 7, ten sam `#luzGwint`. Drukować przed gniazdem |
| PODGLAD pileczka 40.5 / SG90 / orczyk SG90 | – | Tylko do sprawdzania kolizji. SG90 ma taśmę kabla 3,5 × 1,4 wychodzącą u dołu krótszego boku od strony wałka |

## Zmienne (Variable Studio „Zmienne v2.2”)

| Grupa | Zmienne |
|---|---|
| Piłeczka i miska | `kulaDmax` 40,5, `klej` 0,5, `jarzmoT` 2,5, `jarzmoW` 8, `oczkoT` 2,4, `luzOsiowy` 0,3 |
| Kaseta i gniazdo | `modulID` 48,5, `kasetaT` 3, `luzKaseta` 0,2, `gniazdoT` 2, `modulL` 76, `przodL` 15, `otworD` 63,5, `rantD` 74, `rantT` 1,5, `kolnierzykD` 41 |
| Gwint i nakrętka | `gwintSkok` 5, `gwintH` 2, `luzGwint` 0,3, `dociskMin` 15, `dociskMax` 25, `nakretkaH` 7, `nakretkaD` 74, `nakretkaZ` 24 (podgląd) |
| Śruby i wkładki | `m3Ciasny` 2,6, `m3Luzny` 3,3, `lebD` 6,2, `lebH` 1,7, `wkladkaD` 4, `wkladkaL` 4, `wkladkaZapas` 0,6, `tulejkaD` 5,6, `luzPrzegub` 0,2, `kolnierzD` 8, `kolnierzH` 0,8, `plytaT` 2,5, `m2Otwor` 2,2, `serwoWkret` 1,8 |
| SG90 (do pomiaru) | `servoH` 30,5, `servoSpodY` −33,5, `servoUcho` 15,9 |
| Wyliczane | `hornTop`, `kasetaOD` 54,5, `gniazdoID` 54,9, `gwintRdzen` 58,9, `gwintD` 62,9, `gniazdoL` 36,7, `nakretkaOtwor` 59,5 |

Liczbami w skrypcie (tablica `D`) zostały:
- położenia przegubów (kinematyka),
- zaczepy, okienka, żebro i wybrania,
- profil gwintu,
- krzywizna dyni.

## Połączenia: każda para części

| Para | Jak | Element złączny | Ciasno | Luźno |
|---|---|---|---|---|
| Kaseta ↔ jarzmo (oś oka) | 2 śruby od góry i od dołu, łeb w pogłębieniu. Po włożeniu do gniazda łby zakrywa otwór gniazda (nie wykręcą się) | 2 × **ISO 7380 M3 skrócone do 4 mm** (z M3×8 z kompletu) | występ kasety Ø2,6, gwint 2,1 mm | oczko Ø3,3; koniec śruby 1,6 mm w oczku, 1,0 mm przed piłeczką; luz osiowy 0,3 |
| Jarzmo ↔ kaseta (ogranicznik) | kołek Ø2,6 na oczku w szczelinie na wylot, zazębienie 1,6 mm; praca ±30°, stop ±33° (dotyk na ±33°, przy ±34° kolizja) | – | – | – |
| Jarzmo ↔ piłeczka | klej wypełniający (akrylowy 2K) w szczelinie 0,5, z dala od otworów osi; ustawienie w przyrządzie | – | – | – |
| Korba ↔ cięgno (C) | od dołu przez otwór dolny C: tulejka z kołnierzem i śruba do oporu we wkładkę | M3×8 DIN 912 | wkładka w cięgnie (gwint 2,9 mm) | korba na tulejce (Ø6,0 / Ø5,6) |
| Cięgno ↔ ramię (H) | jak w C, przez otwór dolny H | M3×8 DIN 912 | wkładka w cięgnie | ramię na tulejce |
| Ramię ↔ orczyk | orczyk w kieszeni, wkręt środkowy serwa + M2 w otwór orczyka 13 mm (przez otwory górne kasety) | M2×6 | – | – |
| SG90 ↔ sanki | uszy na słupkach sanek | wkręty z kompletu SG90 | Ø1,8 | – |
| Sanki ↔ kaseta | wsuwane od tyłu, przód serwa opiera się o koniec szczeliny, tył dociska pokrywa | – | – | prowadnice na krawędziach szczeliny |
| Pokrywa ↔ kaseta | 2 śruby w uchach | 2 × M3×8 DIN 912 | wkładki M3 w uchach (otwór 5,6 = 4 + 1,6) | pokrywa Ø3,3 |
| Kaseta ↔ gniazdo | wsunięcie osiowe od tyłu, rowek na żebrze, oparcie czołem o kołnierzyk, 2 zaczepy w okienkach | – | – | luz 0,2 na stronę |
| Gniazdo ↔ dynia ↔ nakrętka | gniazdo od zewnątrz w otwór Ø63,5, nakrętka od środka; gwint 45°, skok 5 | – | – | luz 0,3 (odsunięcie ścian) |
| Przyrząd do wklejania ↔ jarzmo | 2 śruby w słupkach jak oś oka; kołki ogranicznika w gniazdach blokują 0° | 2 × M3×10 DIN 912 | słupek Ø2,6 | oczko Ø3,3 |

## Kolejność składania kasety (na stole)

1. Wtopić wkładki: 2 w cięgnie (od góry) i 2 w uchach kasety.
2. Wkleić piłeczkę w przyrządzie:
   - piłeczka źrenicą w dół w stożku,
   - jarzmo na słupki, kołki ogranicznika w gniazdach,
   - 2 × M3×10, klej, odczekać.
3. Jarzmo z piłeczką wsunąć **od tyłu** kasety, kołki ogranicznika w kanałach u góry i u dołu. Wkręcić 2 śruby osi (ISO 7380 M3 skrócone do 4 mm).
4. SG90 przykręcić uszami do sanek, sanki wsunąć **od tyłu**, serwo spodem przez szczelinę.
5. Serwo na środek (strona ESP32). Od spodu założyć przyrząd centrowania (trzpień przez otwór dolny H).
6. Ramię z orczykiem włożyć przez tył kasety nad wałek, nasadzić na wielowypust, wkręcić wkręt środkowy i M2 przez otwory górne. Zdjąć przyrząd.
7. Cięgno wsunąć **od tyłu** (jedzie 0,2 mm nad ramieniem) nad korbę i ramię.
8. Przeguby C i H: przez oba otwory dolne tulejki z kołnierzem od spodu, M3×8 do oporu.
9. Wtyczkę serwa przeciągnąć przez okno pokrywy, pokrywę przykręcić 2 × M3×8, taśmę wcisnąć w przewężenie (test: pociągnąć).
10. W dyni: kasetę wsunąć od środka do gniazda, GÓRA do góry, aż oba zaczepy kliką. Syn wpina wtyczkę.

Wyjęcie: ścisnąć oba haczyki w okienkach gniazda i wyciągnąć kasetę do tyłu.

## Kinematyka

| Element | Wartość |
|---|---|
| Oś oka A | (x 0, z −12) |
| Korba | 25,25 mm pod 17° |
| Cięgno | 17,21 mm |
| Ramię orczyka | 27 mm pod 200° |
| Wałek serwa S | (0, −66) |

**Kąt przenoszenia** w zakresie ±30°, z luzem cięgna ±0,4 mm:
- po stronie napędzanej, korba–cięgno: co najmniej **39,1°** (najmniejszy przy −30°),
- ramię–cięgno: co najmniej **41,3°**.

W v2.1 „≥ 44°” było policzone tylko po stronie ramienia.

**Zakres serwa dla firmware** (asymetryczny):

| Oko | Serwo |
|---|---|
| +30° | −29,8° |
| −30° | +25,6° |
| +33° (stop) | −34,2° |
| −33° (stop) | +27,3° |

Zakres pracy oka ±30°, ogranicznik ±33°. W Assembly wałek serwa ma limit −37…+30°, co wyklucza drugie położenie czworoboku.

## Sprawdzenie (symulacja na siatkach z Onshape)

Skrypty:
- [`40-cad/onshape/oko-f-v2-kolizje.js`](../40-cad/onshape/oko-f-v2-kolizje.js): silnik,
- [`40-cad/onshape/oko-f-v2.2-kolizje.js`](../40-cad/onshape/oko-f-v2.2-kolizje.js): części v2.2, wsuwanie, nawisy, ścianki.

**Ruch ±33°: przenikań 0** w 26 parach. Najmniejsze luzy:

| Para | Luz |
|---|---|
| cięgno – kaseta | 0,49 mm |
| ramię – kaseta | 0,46 mm |
| tulejka C – kaseta | 0,60 mm |
| łby śrub przegubów – kaseta | 0,66 mm |
| cięgno – jarzmo, cięgno – ramię | 0,20 mm (szczelina warstw) |

Ogranicznik: kołki dotykają końców szczelin przy ±33°, przy ±34° byłaby kolizja.

**Wsuwanie (kolejność montażu)**: bez przenikań na każdym kroku.

| Krok | Najmniejszy odstęp |
|---|---|
| jarzmo z piłeczką od tyłu przez kasetę | 0,29 mm |
| sanki z serwem | 0,04 mm (prowadnice jadą po krawędziach szczeliny – tak zaprojektowane) |
| ramię nad wielowypustem, potem w dół | bez kolizji |
| cięgno od tyłu | 0,2 mm nad ramieniem |
| tulejki od spodu do C i H | bez kolizji |
| kaseta do gniazda (z nakrętką) | bez kolizji; jedyny styk to czoło na kołnierzyku |
| haczyki zaczepów | uginają się ok. 0,8 mm na ostatnich 4 mm, na końcu siedzą w okienkach bez kolizji |

Wsuwanie jarzma i sanek pokazało dwa błędy, które poprawiłem:
- występy osi wystawały poza kasetę,
- okienka nie leżały naprzeciw haczyków.

Kolejność montażu też się zmieniła: cięgno wchodzi na końcu, a przegub C ma własny otwór od spodu.

**Dopasowania nieruchome:**
- nakrętka na gnieździe i w próbce: 0,27 mm,
- jarzmo w przyrządzie: 0,17 mm,
- piłeczka leży w stożku,
- obrót jarzma o ±3° w przyrządzie zablokowany,
- serwo na sankach, sanki na kasecie, pokrywa na kasecie: styki tam, gdzie zaprojektowane,
- kabel 0,75 mm od krawędzi okna.

**Ścianki (pomiar promieniem na siatce):**

| Miejsce | Grubość |
|---|---|
| przy wybraniu C | 2,21 mm |
| przy wybraniu H | 2,45 mm |
| nad kanałem kołka | 2,2 mm |
| pod rowkiem ustalającym | 2,03 mm |
| występ osi obok otworu | 2,1 mm |
| piasty C i H | 2,0 mm |
| dno pod wkładką w cięgnie | 1,0 mm |

## Druk (DFAM)

Każda część ma płaską stronę na stół i nic nie wystaje poza nią. Analiza nawisów (ściany bardziej nawisowe niż 44°) w ułożeniu do druku:
- **Bez nawisów:** cięgno, ramię, tulejki, sanki, pokrywa, przyrząd centrowania.
- **Tylko mostki** nad poziomymi otworami i szczelinami, bez podpór:
  - jarzmo: otwory Ø6 i Ø3,3, spód kołków ogranicznika,
  - gniazdo: okienka 7 mm, strzałka GÓRA na czole,
  - nakrętka: wycięcia na klucz,
  - kaseta: szczeliny nad ramionami zaczepów (most ok. 15 mm, podparty z obu stron), otwory dolne i górne, szczelina ogranicznika,
  - przyrząd do wklejania: otwory śrub.
- **Ramiona zaczepów** mają pod spodem szczelinę skośną 45°: drukują się jak nawis 45°, a ugięcie do środka jej nie zamyka (zostaje 0,33 mm).

## Rozmieszczenie oczu (dynia R 150)

| Kierunek | Rozstaw | Co ogranicza |
|---|---|---|
| Poziomo | **≥ 115 mm** | tył kaset (Ø54,5) na głębokości 77,5; tył jest okrągły, bez spłaszczeń, więc bez nożowych krawędzi |
| Pionowo | **≥ 145 mm** | serwo i występ pokrywy wystają w dół do −38 mm |

Przy mniejszej dyni rozstawy rosną.

## Czego nie jestem pewien

1. **Zaczepy.** Ramię 2 × 6 mm, długość ok. 15 mm, ugięcie 0,8 mm (odkształcenie ok. 1,2%). Klik i siła wyjęcia nie są sprawdzone na wydruku. Jeśli za twardo, można pocienić ramię (rozmiar w skrypcie).
2. **Gwint skok 5, luz 0,3.** Nowa próbka gwintu: wydrukować przed gniazdem. Jeśli za luźno albo za ciasno, zmienić `luzGwint`.
3. **Śruby osi skrócone do 4 mm.** Ucięta końcówka ma zadziory i trzeba je zeszlifować. Z M3 grzybkowej ISO 7380 (łeb 1,65) zostaje pogłębienie 1,7. DIN 912 (łeb 3 mm) się nie zmieści.
4. **Animate w Assembly** działa (sprawdzone na żywo): przy ukrytym gnieździe, nakrętce, kasecie i pokrywie, w widoku z góry, jarzmo, cięgno i ramię chodzą razem w zakresie ±33°. Eksport 3MF dla recenzentów jest w `40-cad/3mf/Oko F v2.2/`.
5. **Kabel i wtyczka.** Taśma 3,5 × 1,4 i wtyczka 15 × 8 × 2,5 są przyjęte, nie mierzone. Przewężenie 1,0 zaciska taśmę 1,4: sprawdzić pociągnięciem.
6. **Wymiary SG90 i orczyka** są założone (do pomiaru i wpisania w zmienne).
7. **Klej akrylowy 2K** w szczelinie 0,5 na pasie 8 mm nie jest sprawdzony.
8. **Piłeczka 39,5 w stożku przyrządu** leży 0,7 mm bliżej przodu niż 40,5 (stożek centruje na osi, ale nie w głąb). Przy kołnierzyku Ø41 to nie przeszkadza.
9. **Przyrząd centrowania** nie usuwa skoku wielowypustu orczyka (~14°): kalibracja środka na stronie ESP32 nadal jest potrzebna.
10. **Sanki** jadą po krawędziach szczeliny (styk 0,04 mm w symulacji). Jeśli po druku będą za ciasno, przeszlifować.
