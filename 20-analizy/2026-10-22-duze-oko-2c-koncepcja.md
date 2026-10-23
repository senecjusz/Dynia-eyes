# Duże oko 2c: koncepcja do krytycznej analizy (E6.1, 22.10)

Autor: Opus, realizator briefu `30-projekt/brief-e6-duze-oko-koncepcja.md` (wersja 2). Tylko do odczytu w repo, zapisany wyłącznie ten plik. Oznaczenia: **[F]** fakt (źródło, plik, pomiar), **[R]** mój rachunek (załącznik), **[Z]** założenie, **[A]** własna adaptacja albo pomysł, niesprawdzony. Filmów nie oglądałem; „sprawdzony” znaczy tu: strona projektu opisuje zbudowany egzemplarz i linkuje film albo zdjęcia działania. Znaczniki czasu filmów podaje recenzent albo użytkownik.

## 0. Wynik w pięciu zdaniach

1. **Gałka Ø60** na **kardanie RC z warsztatu w środku kuli**. Kardan siedzi na Słupku z tyłu. Oś zewnętrzna kardana jest pozioma (góra–dół), wewnętrzna pionowa (lewo–prawo).
2. **Napęd gałki:** 2 nieruchome MG90S i 2 pręty z **przegubem kulowym na obu końcach** (S–S). Jest to konieczne, nie tylko wystarczające: między orczykiem a punktem gałki potrzeba 5 stopni swobody (zał. A1). Liczyłem cały zakres ±25°/±15° z przekątnymi. Martwego punktu nie ma, kąt przenoszenia wynosi ≥ 51°, sprzężenie osi ≤ 4,5° serwa i firmware je kompensuje wzorem zamkniętym.
3. **Powieki:** górna i dolna obracają się na wspólnej osi poziomej przez środek kuli i napędza je **jedno MG90S przez drukowane podwójne ramię** (r 16 i r 5, rozwarcie 150°). Przy 73° serwa powieka górna przechodzi 51°, dolna 27°, a kąt przenoszenia nie spada poniżej 49° (zał. A3). **To sprzężenie to moja adaptacja, nie powtórzenie sprawdzonej konstrukcji** (patrz 2.3).
4. **Mocowanie:** cały moduł mieści się w walcu Ø79,5. Wsuwa się go z zewnątrz, aż oprze się rantem Ø84 (2 mm poza otwór). Od środka trzyma go **Obejma** zaciskana pokrętłem: 2 ruchy, bez narzędzi.
5. Masa całości to **ok. 175 g ±20 %** (wydruki ok. 95 g, serwa 40 g), więcej niż orientacyjne 130–150 g. Warunek blokujący: **2 wkręty bez łba M3×8 na osie powiek** (łeb 2,45 mm wystaje 2,45 mm poza Ø79,5). Bez nich gałka zostaje Ø56 (pkt 13, B2).

## 1. Wymiary i miejsce

**Układ współrzędnych:** O to środek kuli. **+z** wychodzi z dyni (oś patrzenia na wprost), **+y** w górę, **+x** w prawo patrząc na dynię z zewnątrz. Kąty: ψ (lewo–prawo) i θ (góra–dół).

| Wielkość | Wartość | Status |
|---|---|---|
| Gałka | Ø60, czasza **230°** (krawędź 115° od osi), ścianka 2 | [R] zał. A5: przy 210° krawędź czaszy jest widoczna przy ψ 25° |
| Zakres pracy / ograniczniki | ψ ±25° / ±27°, θ ±15° / ±17°, powieki górna 51°, dolna 27° | wymaganie briefu |
| Środek kuli za zewnętrzną powierzchnią dyni (przy krawędzi otworu) | `glebokoscSrodka` 10. Gałka wystaje 20, zamknięte powieki 24,7 | [Z] do decyzji (B6) |
| **Obwiednia pracy** | kula R34,7 (rant powiek) z przodu; za nią moduł do z −67 | [R] |
| **Obwiednia przejścia przez otwór** | walec **Ø79,5** od z +10 do −67 plus kable. Poza walcem jest tylko rant Ø84, który zostaje na zewnątrz | [R] |
| Droga przez wieczko | przechodzi tylko Obejma (ok. Ø104 z pokrętłem) i ręka. Moduł wchodzi przez otwór oka | [R]; wieczko ≥ 110 [Z] |
| Za wewnętrzną ścianką | 80 − w: **65 mm przy w = 15**, 45 mm przy w = 35 | [R]; wolne „ok. 65” to szacunek, styk przy cienkiej ściance |
| Dynia | R150, ścianka w 15–35, front na osi symetrii, środek oka na 55–60 % wysokości | [Z] z briefu i 18.10, jako zmienne |
| Wieża | 95 × 45 albo 105 × 60 (niespójne). Zakładam 105 × 60 węższym bokiem do oka: od końca modułu do osi dyni zostaje 78 mm, do ściany wieży 48 | [Z] |
| Rozstaw środek dużego – środek małego, po łuku | **≥ 120 mm w poziomie, ≥ 135 mm w pionie**. Ogranicza nie powierzchnia, lecz zbieganie się tyłów modułów w dyni R150 | [R] zał. A6, szacunek z obwiedni. Rozstrzyga Assembly z bryłami PODGLĄD |

## 2. Mechanizm

### 2.1 Podparcie gałki: kardan w środku kuli

- **Źródło [F]:** Will Cogley (Instructables „Ikkalebob”), [3D Printed Animatronic Eye Mechanism on the Cheap](https://www.instructables.com/3D-Printed-Animatronic-Eye-Mechanism-on-the-Cheap/). Pojedyncze oko na 4 × SG90, na liście części jest „3mm Universal Joint”. Popychacze to drut z haczykiem wpiętym w otwór gałki, czyli luźny przegub przestrzenny. Działanie pokazuje [film](https://www.youtube.com/watch?v=I7IxOmThaxw). Ta sama zasada w praktyce zawodowej, forum Stan Winston School: [„The center of the eye needs to line up with the silver pins…”](https://forums.stanwinstonschool.com/discussion/comment/6206). Kardan i druty w oczach ma też [Face maker101](https://www.pcbway.com/project/shareproject/The_Face_maker101_c4124445.html) (tylko zdjęcia).
- **Biorę:** kardan RC jako jedyny punkt podparcia, środek krzyżaka w środku kuli.
- **Zmieniam [A]:**
  - Tylne widełki siedzą w kieszeni Słupka. Wałkiem jest M5×25 przez Słupek, zaciśnięte wkrętem ustalającym kardana. Klucz do tego wkrętu wchodzi przez otwór w ściance Słupka, więc kieszeń wymusza obrót widełek.
  - Przednie widełki trzyma M3×12 wkręcone ciasno w piastę Uchwytu gałki.
  - Uchwyt przykręcam do Gałki 2 × M3×8 od tyłu, w nadlewy na górze i na dole, zamiast Cogleyowego zatrzasku.
  - Ograniczniki ±27°/±17° to nakrętki na prętach, które opierają się o łapki Płyty (2.2). Siła z ręki dziecka idzie przez pręt w ramę, nie w serwo.
- **Kąt kardana [R]:** 28,9° w zakresie pracy i **31,6° na ogranicznikach**. Kardan, który nie daje ≥ 33°, odrzuca koncepcję w tej postaci (pkt 12).
- **Luz kardana [Z]:** zakładam 0,05–0,15 mm promieniowo. Przesuwa to środek kuli o tyle samo, przy luzie powieka–gałka 1,2 mm bez znaczenia. Luz skrętny krzyżaka (1–2° obrotu wokół osi patrzenia) przy **okrągłej źrenicy** jest niewidoczny. Przy źrenicy szczelinowej byłby widać (B11).
- **Nacisk 20 N z przodu:** idzie przez kardan w Słupek, a pręty biegną wzdłuż z i obciążenia osiowego nie przenoszą. Słupek Ø15 PLA w podstawie: 6 MPa przy 1 N·m [R].

### 2.2 Napęd gałki: pręty S–S, serwa nieruchome

- **Źródło [F]:** Cogley, [DIY Compact 3D Printed Animatronic Eye Mechanism](https://www.instructables.com/DIY-Compact-3D-Printed-Animatronic-Eye-Mechanism/). 6 × MG90S, popychacze z „M2 servo ball-links” po stronie serwa, opisane jako „commonly used in professional eye mechanisms”. Ten projekt jest szeroko powtarzany (EyeMech, wersja ε3.2: [GitHub](https://github.com/will-cogley/EyeMech_Epsilon), [instrukcja](https://www.instructables.com/Animatronic-Eye-Mechanism/), [film](https://youtu.be/MeHLouL9ltw)).
- **Biorę:** dwa sztywne popychacze z przegubami kulowymi RC, serwa nieruchome za gałką.
- **Zmieniam [A]:** przegub kulowy jest na **obu** końcach (zał. A1). Cogley ma po stronie oka drukowane ogniwa z czopami, których geometrii nie znam. Skala Ø60 zamiast ok. 32. Punkty zaczepienia leżą w środku kuli i pręty wychodzą przez otwór czaszy.

| Element | Współrzędne [mm] |
|---|---|
| Punkt X (lewo–prawo) na Uchwycie | (−18; 0; −6) w układzie gałki, kulka pionowa (∥ y gałki) |
| Punkt Y (góra–dół) | (0; −18; −6), kulka pionowa |
| Serwo X | oś ∥ x, wałek (x −20; y +16; z −45), ramię r16 w dół do (−18; 0; −45), pręt 39,0 |
| Serwo Y | oś ∥ x, ramię w płaszczyźnie x −8, wałek (y −3; z −45), ramię r15 w dół do y −18, pręt 39,8 |

**Wynik [R] (zał. A2), siatka ψ ±27 × θ ±17 z przekątnymi:**
- serwo X od −31,0 do +25,1°, serwo Y od −23,9 do +17,2°;
- przełożenie 1,12 (X) i 1,20 (Y) stopnia serwa na stopień oka;
- minimalny kąt przenoszenia 51° (X) i 56° (Y), martwego punktu nie ma;
- sprzężenie: serwo Y musi się przestawić o −4,5° przy ψ −25°, serwo X o 0,8° przy θ ±15°. Firmware liczy oba kąty wzorem zamkniętym (pkt 8). Bez kompensacji błąd wynosi ≤ 4° oka;
- odchylenie przegubów kulowych do 25° na gałce i do 16° na orczyku. Wymaganie dla przegubu: ≥ ±28°.

**Dlaczego nie kołyska** (Cogley Simplified, [Make](https://makezine.com/projects/simple-animatronic-eyes/): „This pivot point is for the y-axis of the eye motion and the eyelids”): oś kołyski musi leżeć na osi powiek, po bokach. Stos przy osi wynosi wtedy:

kula 30 + luz 1,2 + 2 ucha powiek 4,8 + 2 luzy 0,5 + ramię kołyski 2,5 + luz 0,25 + bok ramy 2,5 + łeb 2,45 = **R44,2**,

czyli 4,5 mm poza Ø79,5 [R]. Kardan przenosi obie osie do środka kuli, a po bokach zostają tylko powieki.

### 2.3 Powieki: wspólna oś, jedno serwo

**Ze źródeł [F]:**
- Powieki obracają się wokół osi przez środek kuli, wspólnej z osią góra–dół (Cogley Simplified, cytat wyżej). Każda powieka ma dźwignię i popychacz do serwa.
- Cogley daje **każdej powiece osobne serwo**: EyeMech ε3.2 ma kanały „Top Left eyelid … Bottom Right eyelid”, Simplified 6 serw na 2 oczy.
- Że w praktyce jedno serwo napędza wszystkie powieki, poświadcza tylko wypowiedź na [forum Stan Winston School](https://forums.stanwinstonschool.com/discussion/6348/can-you-use-a-linear-servo-for-eyelids): „Some setups use a single servo for all 4 lids”.
- **Zbudowanego, sfilmowanego oka z sprzężeniem górna–dolna na jednym serwie nie znalazłem.**

**Moja adaptacja [A], liczona:**
- Obie dźwignie są po stronie +x, w dwóch warstwach: dolna x 31,2–33,6, górna 33,85–36,25. Górna ma nadlew przechodzący przez warstwę dolnej na promieniu 22, dolna kończy się na promieniu 14 (z nadlewem 17,5), więc między nimi zostaje 1 mm.
- Cięgna leżą w warstwach x 28,6–31,0 (dolne) i 25,9–28,3 (górne).
- Serwo P ma oś ∥ x, wałek w (y −17; z −45). Drukowane **Ramię powiek** obejmuje fabryczny orczyk pojedynczy, więc wchodzi tylko w jednym położeniu. Ramię A ma r16 i kąt −20°, ramię B r5 i kąt 130°.
- Dźwignia górna ma promień 22 i kąt β −40° przy zamkniętej powiece. Dźwignia dolna ma promień 14 i kąt β −90°. Cięgna mają 35,8 (górne) i 41,6 (dolne).
- **Wynik [R] (zał. A3):** serwo 0→73° (1500 µs w połowie). Powieka górna przechodzi 0→51° (0,64–0,72°/°), dolna 0→26,9° (0,29–0,38°/°). Minimalny kąt przenoszenia: dźwignie 52°, ramię 49°.

**Kryteria:**
- Zamknięte: krawędzie na −9° i −11°, szczelina 2° = **1,1 mm**, bez docisku. Ogranicznik wypada 1° za położeniem zamkniętym, więc krawędzie się nie dotykają.
- Otwarte: górna krawędź na +42°, dolna na −38°. Przy θ +15° górny brzeg tęczówki Ø27 (26,7°) leży na 41,7°, czyli jeszcze odsłonięty. Przy θ −15° dolna powieka zakrywa 3,7° tęczówki, co wygląda naturalnie.
- Zakres powiek: górna 100°, dolna 79°. Dzięki temu w żadnym położeniu nie widać nieoklejonej kuli z przodu (zał. A5).
- **Podążanie za góra–dół:** przy jednym serwie powieki mają jeden stopień swobody, tylko rozwarcie. Firmware może je co najwyżej rozewrzeć szerzej przy |θ| > 10°. Ta strata wynika z wyboru 3 serw.

**Plan B jedną śrubą:** Ustalacz powieki dolnej, czyli M3×8 przez otwór w boku Ramy w otwór dźwigni dolnej. Po zdjęciu cięgna dolnego oko działa jak 2b.

**Alternatywa: 4. MG90S** (decyzja użytkownika, B5):
- dolna powieka dostaje własne serwo, dźwignie można rozdzielić na strony +x i −x, a powieki podążają za góra–dół (jak u Cogleya);
- koszt: +13,4 g, 4. kanał (13 małych + 4 duże = 17 > 16: najwyżej 12 małych oczu albo drugi PCA9685), +0,25 A w ruchu, zapasowego MG90S już nie ma, a Płytę trzeba zaprojektować od nowa (czwarte serwo nie mieści się w tym układzie bez przesunięcia S_Y).

### 2.4 Mocowanie serw

- **Źródło [F]:** v2.8 projektu (uszy SG90 na M3×10 w Ø2,6 × 8, luz korpusu 0,4 z przodu i z tyłu). Montaż v2.7 pokazał, że serwo musi być trzymane w każdym kierunku.
- **Rozwiązanie:** klatka z trzech ścianek ⊥ x na Płycie serw, 2 × M3×10 na serwo. Korpusy zajmują z −39…−62 [R]:

| Serwo | Zakres korpusu |
|---|---|
| S_X | x −16…12,5, y 9,9…22,1 |
| S_Y | x −6…22,5, y −9,1…3,1 |
| S_P | x −4,5…22,8, y −23,1…−10,9 |

- Najdalszy narożnik leży na R32,5 (≤ 39,75). Najmniejsze odstępy to 1,5–3 mm (orczyk Y do korpusu P, cięgno górne do korpusu Y), więc dokładne położenie ustala CAD.
- **Czy M3 przechodzi przez ucho MG90S, nie wiadomo** (pkt 12).

### 2.5 Ręka dziecka i miejsca przycięcia

| Obciążenie | Droga siły | Rachunek [R] |
|---|---|---|
| Wymuszony obrót gałki w obu osiach | pręt, potem nakrętka ogranicznika, łapka Płyty i Rama | Między ogranicznikami dziecko przestawia serwo: 0,3–0,5 N·m na kuli to 0,27–0,45 N·m na wale X (1,5–2,5 × moment zablokowania MG90S 0,177 N·m przy 4,8 V, [components101](https://components101.com/motors/mg90s-metal-gear-servo-motor)). **Ryzyko 3** |
| Naciśnięcie powieki | dźwignia na ogranicznik w Ramie (1° za zamknięciem, 2° za otwarciem) | 20 N na krawędzi górnej daje 0,68 N·m na powiece i 0,44 N·m na serwie, zanim zadziała ogranicznik |
| 20 N od przodu | kardan i Słupek | jak wyżej |
| Szarpnięcie powieki 50 N | ucho powieki i wkręt osi | Nic nie pęka [R]. Przy nadużyciu pęka najpierw ucho Powieki (1 h druku), nie Rama |

**Miejsca przycięcia** (za podsumowaniem normy EN 71-1 w [JJR Lab](https://www.jjrlab.com/news/en-71-1-mechanical-and-physical-properties-testing-of-toys.html): szczelina ruchoma < 5 mm albo > 12 mm):
- **zamykające się krawędzie powiek**: jedyne miejsce, gdzie szczelina przechodzi przez przedział 12→5 mm. Siła na palcu przy zablokowaniu serwa wynosi **5,6 N** [R], rant powieki zaokrąglony R1,5;
- powieka do rantu Ramy: 3,0 mm;
- gałka do powieki: 1,2 mm;
- ucho do boku osi: 0,25 mm.

Z zewnątrz nie ma łbów: wkręty osi powiek są zlicowane, rant ma fazę.

## 3. Mocowanie w dyni: 3 warianty

Wszystkie warianty są **[A] niesprawdzone**. Jedyne znane rozwiązanie to klej na gorąco z 68percentwater (`10-inspiracje/arduino-servo-pumpkin-eyes-68percentwater.md`). Wspólne dla wszystkich:
- moduł ok. 175 g, środek ciężkości na z ≈ −24 [R];
- przy ściance 15 mm środek ciężkości jest 19 mm za wewnętrzną powierzchnią i daje moment ≈ 0,045 N·m. To para sił ok. 3 N na rancie i docisku od środka;
- rant Ø84 (2 mm poza otwór, docisk na 452 mm²), spód po łuku R150 jak w Gnieździe v2.6, 8 ząbków 1 mm przeciw obrotowi.

| | **M1 Obejma z pokrętłem (rekomendacja)** | M2 Pierścień zapadkowy | M3 Rygle i klin |
|---|---|---|---|
| Części drukowane | Obejma (C, Ø96 × 10) i Pokrętło | Pierścień z 3 zapadkami | 2 rygle U i klin |
| Co trzyma | tarcie zaciśniętej Obejmy na rurze Ø79,5. Przy 100 N w śrubie zostaje ok. 190 N w osi (μ 0,3) [R], przy potrzebnych < 5 N | 3 zapadki na ząbkach rury (skok 1,5) | rygle w rzędzie otworów co 4 mm, klin dobiera resztę |
| Regulacja 15–35 | ciągła | co 1,5 mm (do 1,5 mm luzu osiowego) | co 4 mm plus klin |
| Ruchy w dyni | 2: nasunąć Obejmę od tyłu modułu, dokręcić pokrętło palcami | 1: nasunąć do oporu. Zdjęcie: obrót 60° | 3 |
| Narzędzia | brak | brak | brak |
| Docisk od środka | kołnierz Ø96. Na wklęsłej ściance (R115–135) styka się tylko brzeg, ok. 900 mm² | podobnie | 2 małe stopki |
| Mokry miąższ | tarcie PLA na PLA, nie na miąższu | zapadki PLA pełzną, lepszy PETG | rygle mogą wpaść do dyni |
| Masa | ok. 13 g | ok. 10 g | ok. 6 g |
| Ryzyko | pokrętło za słabe, obejma pęka na uchu | zapadki się męczą, trzeba próbki | kolejność 3 ruchów po omacku |

**Montaż (M1):**
1. Rodzic wierci otwór otwornicą 80.
2. Wsuwa moduł z zewnątrz, kablami do przodu, aż rant oprze się o dynię.
3. Przez wieczko podaje Obejmę z pokrętłem, nasuwa ją na tył modułu (kable przechodzą przez środek) do oporu o ściankę i kręci pokrętłem.
4. Wpina 3 wtyczki.

Wyjęcie: odwrotnie, bez niszczenia.

**Próbka P5:** wycinek dyni albo dyni piżmowej, pierścień rantu z odcinkiem rury i Obejmą. Wilgotny miąższ, 24 h. Mierzę przesunięcie po 10 N osiowo i po 0,1 N·m.

## 4. Lista części

Masy z objętości ścian [R], ±20 %. Wszystkie części mieszczą się na A1 mini (180) i X1C.

| Część | Funkcja | Wymiary | Masa | Druk |
|---|---|---|---|---|
| **Rama** | rant Ø84, rura Ø79,5/75,5 do z −35 (okna), boki osi powiek, ograniczniki powiek, 3 ucha do Płyty, otwór Ustalacza | Ø84 × 47 | 22 g | rantem w dół |
| **Płyta serw** | tarcza z kołnierzem środkującym w rurze, klatka 3 ścianek na serwa, łapki ograniczników prętów | Ø79 × 35 | 15 g | tarczą w dół |
| **Słupek** | kieszeń tylnych widełek, otwór na klucz, wałek M5 | Ø15 × 30 z kołnierzem Ø24 | 3 g | pionowo |
| **Gałka** | czasza 230°, 2 nadlewy na M3 | Ø60 | 19 g | krawędzią w dół, źrenicą w górę, 0,12–0,16 |
| **Uchwyt gałki** | piasta z M3 do przednich widełek, 2 łuki do nadlewów, ramię punktu X, punkt Y | 50 × 45 × 22 | 3 g | płasko |
| **Powieka górna** | czasza R31,2–33,4 o zakresie 100°, rant 3,5, ucho, dźwignia r22 | 69 × 70 × 35 | 11 g | płaszczyzną krawędzi w dół, 5 obrysów |
| **Powieka dolna** | zakres 79°, dźwignia r14 | 69 × 70 × 30 | 9 g | jak wyżej |
| **Cięgno powieki górnej** / **dolnej** | 35,8 / 41,6 między osiami, 2,4 × 5 | — | 1 g razem | płasko |
| **Ramię powiek** | kieszeń orczyka pojedynczego, A r16, B r5 | 24 × 10 × 4 | 1 g | jak Ramię orczyka v2.x |
| **Ramię X**, **Ramię Y** | kieszeń orczyka, otwór kulki r16 / r15 | 22 × 8 × 4 | 1 g razem | płasko |
| **Obejma**, **Pokrętło** | mocowanie M1 | Ø96 × 10, Ø16 × 8 | 13 g | kołnierzem w dół |
| *Przyrząd zera gałki* | czapka na gałkę zaczepiona w rant: ψ = θ = 0 | Ø70 × 25 | 6 g | |
| *Klin powiek* | trzyma powieki w połowie drogi (1500 µs) | 30 × 10 × 5 | 1 g | |
| *Przyrząd długości prętów* | listwa z 2 kołkami: 39,0 / 39,8 | 50 × 8 | 1 g | |

**Razem wydruki ok. 95 g, ok. 5,5–6,5 h na jednej płycie X1C** (szacunek z 15–20 g/h). **Kupne i z warsztatu:**
- 3 × MG90S;
- kardan RC;
- **4 przeguby kulowe z 2 prętami** (B1);
- **2 × M3×8 DIN 913** (B2);
- 6 × M3×10 (uszy serw);
- 7 × M3×8 (Płyta, Gałka, Słupek);
- M3×12 (wałek Uchwytu);
- M5×25 (wałek Słupka);
- 3 × M3×10 z podkładką i nakrętką samohamującą (przeguby powiek);
- M2×6 z nakrętką (ramię B);
- M3×25 z nakrętką (Obejma).

Śrub łącznie ok. 19 g.

## 5. Połączenia (każda para)

| Para | Pasowanie | Luz (zmienna) | Śruba / ciasno / luźno |
|---|---|---|---|
| Gałka – powieki (czasze) | ruchome współśrodkowe | **1,2 promieniowo** (`luzPowieka`) | — |
| Ucho powieki dolnej – ucho górnej – bok Ramy | obrotowe na śrubie | osiowo 0,25 ×2 (`luzOsiowyPowiek`), promieniowo 0,2 | **M3×8 DIN 913**, ciasno Ø2,6 w boku (3,25 gwintu), luźno Ø3,3 w uszach, koniec 0,55 przed wewnętrzną ścianą ucha |
| Powieki – rura i rant | ruchome obok | 3,0 | — |
| Dźwignia dolna – nadlew górnej | ruchome obok | osiowo 0,25, promieniowo 1,0 | — |
| Cięgno – dźwignia, cięgno górne – ramię A | obrotowe płaskie | luźno Ø3,3 po obu stronach | M3×10, podkładka, nakrętka samohamująca (jak v2.7) |
| Cięgno dolne – ramię B (r5) | obrotowe | luźno Ø2,2 | M2×6 z nakrętką (M3 nie mieści się przy wkręcie środkowym orczyka) |
| Ramię X/Y/powiek – orczyk | kieszeń orczyka | jak v2.8 | wkręt środkowy M2 serwa |
| Pręt X/Y – kulki | przegub kulowy RC | fabryczny | kulki na M2/M3 w Ø1,7 / Ø2,6 ciasno (Uchwyt, Ramiona) |
| Uchwyt – Słupek, pręty – Płyta, pręty – czasza | ruchome obok | ≥ 0,5 w całym zakresie (szacunek ≥ 1,5; do CAD) | — |
| Kardan tył – Słupek | kieszeń | 0,15/str. | M5×25 ciasno (ok. Ø4,4, do próbki P1), wkręt ustalający kardana |
| Kardan przód – Uchwyt | kieszeń | 0,15/str. | M3×12 ciasno Ø2,6 |
| Gałka – Uchwyt | stałe | — | 2 × M3×8, Uchwyt luźno, nadlew ciasno |
| Serwo – klatka | stałe | korpus 0,4 z przodu i z tyłu (`luzKorpusSerwa`) | 2 × M3×10 ciasno Ø2,6 (jeśli ucho MG90S przepuszcza M3) |
| Płyta – Rama | ślizgowe, środkujące | 0,25 i fazka | 3 × M3×8, Rama ciasno, Płyta luźno |
| Słupek – Płyta | stałe, kształt D | — | 2 × M3×8 |
| Rama – otwór w dyni | wsuwanie | 0,25/str. (Ø79,5 w 80) | — |
| Obejma – rura | ślizgowe, potem zacisk | 0,3/str. i fazki | M3×25, nakrętka w kieszeni, Pokrętło na łbie |

**Gdzie łeb 2,45 się nie mieści [R]:** oś powiek. Stos 30 + 1,2 + 2,4 + 0,25 + 2,4 + 0,25 + bok 3,25 daje R39,75, a łeb dokłada 2,45 poza obwiednię przejścia. Łeb stożkowy też nie pasuje, bo zostawia tylko 1,4 mm gwintu w PLA. Wszędzie indziej łby mieszczą się w osi z albo w środku modułu.

## 6. Zwymiarowany schemat złożenia

```
WIDOK Z BOKU (przekrój x = 0), z →  (wnętrze dyni po lewej)
 z:  -67      -45  -34 -35      -25..-5   -6   0  +10      +30
      |  serwa  |orczyki|Płyta|rura Ø79,5 |Y+X | O | rant Ø84 | przód gałki
      |S_X y10..22      |     |  Obejma przy z = 10 − w  (Ø96)
      |S_Y y-9..3   pręty X/Y 39 ←————————→ punkty (-18;0;-6), (0;-18;-6)
      |S_P y-23..-11    Słupek z -34..-5 ——→ kardan, krzyżak w O, widełki ±11,5
      powieka górna: R31,2–33,4 (rant 34,7), zamknięta -9…91°, otwarta 42…142°
      powieka dolna: zamknięta -11…-90°, otwarta -38…-117°

WIDOK Z PRZODU, przekrój przy osi powiek (z = 0), połowa +x:
 x: 0 ........ 30 | 31,2 dolne ucho 33,6 | 33,85 górne ucho 36,25 | 36,5 bok Ramy 39,75 | otwór 40
                kula     luz 1,2               luz 0,25            M3×8 DIN 913 zlicowany

RZUT OD TYŁU (z = -45), r ≤ 39,75:
        S_X (orczyk x -20, w dół do y 0) | S_Y (orczyk x -8, w dół do y -18) | S_P (wałek y -17, ramię x 23..25,6)
        cięgna powiek x 25,9..31 → dźwignie przy osi powiek x 31..36
```

Szczegóły w zał. A1–A3, A7: wszystkie punkty zaczepienia, promienie ramion, długości cięgien, kąty β, stosy uszu, podkładek, łbów i nakrętek.

## 7. Zmienne do Variable Studio

**Geometria:**
- `kulaD` 60; `czaszaKat` 230; `scGalki` 2;
- `luzPowieka` 1,2; `scPowieki` 2,2; `rantPowieki` 3,5; `zakresPowGornej` 100; `zakresPowDolnej` 79;
- `katZamkGorna` −9; `katZamkDolna` −11; `katOtwGorna` 42; `katOtwDolna` −38;
- `ucho` 2,4; `luzOsiowyPowiek` 0,25; `bokOsi` = `otworR` − `luzOtworu` − … (zależność: R kuli + `luzPowieka` + 2·`ucho` + 2·`luzOsiowyPowiek` + `bokOsi` = `obwiedniaR`);
- `otworD` 80; `luzOtworu` 0,25; `obwiedniaR` = `otworD`/2 − `luzOtworu`; `rantD` = `otworD` + 4; `dyniaR` 150; `glebokoscSrodka` 10; `dociskMin` 15; `dociskMax` 35; `scRury` 2.

**Napęd:**
- `pktXr` 18; `pktYr` 18; `pktZ` −6; `zOrczyka` −45;
- `orczykX` 16; `orczykY` 15; `pretX` 39,0; `pretY` 39,8;
- `dzwGornaR` 22; `dzwDolnaR` 14; `betaGorna0` −40; `betaDolna0` −90;
- `ramieA` 16; `ramieB` 5; `katA` −20; `rozwarcieAB` 150; `cieglaGorne` 35,8; `cieglaDolne` 41,6;
- `zakresPsi` 25; `zakresTheta` 15; `zapasOgranicznika` 2.

**Okucia i luzy:**
- `kardanD`, `kardanL`, `kardanOtwor` (z pomiaru); `luzKieszeni` 0,15;
- `m3Ciasny` 2,6; `m3Luzny` 3,3; `m5Ciasny` 4,4;
- `luzKorpusSerwa` 0,4; `luzSlizg` 0,25; `luzObejmy` 0,3; `luzRuchomy` 0,5.

**Test zginania (K9):** `kulaD` 56↔60, `glebokoscSrodka` 6↔14, `dociskMax` 25↔35, `luzPowieka` 1,0↔1,5.

## 8. Napędy, prąd, firmware (tylko to, co wpływa na mechanikę)

| Napęd | Najgorszy przypadek, moment na wale [R] | Zapas wobec roboczego 0,09 N·m [Z: ½ zablokowania przy 4,8 V] |
|---|---|---|
| X (lewo–prawo) | bezwładność 2,8·10⁻³ + tarcie 5·10⁻³ [Z], ×0,89: ok. 7·10⁻³ N·m | ok. 13× |
| Y (góra–dół) | bezwładność 2,8·10⁻³ + ciężar 1,7·10⁻³ (środek ciężkości 8 mm przed osią) + tarcie, /1,2: ok. 8·10⁻³ | ok. 11× |
| P (powieki) | mrugnięcie 0,12 s: górna 2,9·10⁻³ × 0,64, dolna × 0,29, ciężar ≤ 2,2·10⁻³, tarcie 3·10⁻³ [Z]: ok. 8·10⁻³ | ok. 11× |

**Bez PWM i po zaniku zasilania:** moment od ciężaru na wale jest ≤ 1,7·10⁻³ N·m (pitch i powieki, R3 Fable). Moment cofania nie zasilonego MG90S nie jest znany; zakładam ≥ 0,01 N·m. Test: ramię 16 mm z odważnikiem 5 g, czyli 0,8·10⁻³ N·m, nie może opaść. Powieki i gałka zostają tam, gdzie były.

**Prąd: tylko szacunki, pomiaru MG90S brak.**

| Stan | Duże oko | Cała dynia (10 × SG90, ESP z AP) |
|---|---|---|
| spoczynek, PWM wł. | 3 × ok. 10 mA [Z] | ok. 0,15–0,22 A (SG90 6–10 mA z [protosupplies](https://protosupplies.com/product/servo-motor-micro-sg90/) w analizie A; ESP z AP ok. 85 mA) |
| praca (sakada i mrugnięcie) | szczyt 3 × 0,25 = 0,75 A na 0,1 s, średnio ok. 0,1 A [Z] | szczyt ok. 1,45 A, średnio 0,3–0,4 A (brief E5.5) |
| rozruch | po kolei, ≤ 0,3 A. Naraz byłoby do 2,4 A | **firmware: serwa uruchamiane co 150 ms** |
| zablokowanie (ręka dziecka) | 2 × 0,65–0,8 A [Z, źródło wtórne] | ok. 2 A, mniej niż port 3 A [Z] |

**Zależność od E5.5:** spoczynek z PWM wyłączonym w dużym oku mechanicznie jest bezpieczny, ale obniża pobór. Jeśli powerbank wyłącza się przy małym prądzie, lepiej trzymać PWM włączony (+30 mA) albo obciążenie podtrzymujące.

**Kanały:**
- 13 = X, 14 = Y, 15 = powieki. 0–12 to najwyższa pula małych oczu (dziś zajęte 0 i 1);
- **podtrzymanie powerbanku proponuję z GPIO ESP32-C3, nie z PCA**: kanał zostaje wolny. Jeśli ma iść z PCA, to kanał 12, czyli najwyżej 12 małych oczu, albo drugi PCA9685 (A0).

**Firmware (to, co wpływa na mechanikę):**
- Kinematyka odwrotna prętów wzorem zamkniętym: A cos α + B sin α = K, czyli α = atan2(B, A) − acos(K/√(A² + B²)). Na stronie kalibracji dla każdego serwa środek i wzmocnienie w µs.
- Limity programowe 2° przed ogranicznikami.
- Przed wyłączeniem PWM firmware parkuje oko na wprost i zamyka powieki. Zapis do NVS tylko pozycji parkowania.

**Bezpieczny rozruch:**
- **Pierwsze uruchomienie:** orczyki zdjęte, serwa na 1500 µs, montaż z przyrządami (pkt 9).
- **Restart po zaniku zasilania:** pozycja rzeczywista jest gdzieś w zakresie pracy. Pierwszy impuls to ruch z pełną prędkością o ≤ zakres, czyli zwykła sakada. Nigdy nie kończy się na ograniczniku, bo cel leży w limitach.
- **Po ręcznym przestawieniu:** oko może stać na ograniczniku (2° za limitem). Pierwszy impuls odsuwa je od ogranicznika, więc serwo nie napiera na ramę.
- **Powieki po przebudzeniu:** pierwsza komenda to „otwórz”, ruch od miejsca przycięcia. Zamyka dopiero zwykłe mrugnięcie (5,6 N).

## 9. Montaż na stole i kalibracja

1. **Powieki w Ramie:** od przodu wkładam dolną, potem górną, i wyrównuję ucha. 2 × M3×8 DIN 913 z zewnątrz kluczem 1,5 aż do zlicowania z rurą. Ruch ręką: 100° i 79° bez oporu.
2. **Cięgna do dźwigni** (M3×10, podkładka, nakrętka samohamująca). Ustalacz powieki dolnej nie wkręcony.
3. **Płyta:** Słupek przykręcam 2 × M3×8, w kieszeń wkładam tylne widełki kardana (wkręt ustalający na otwór w Słupku), wałek M5×25 od tyłu, dokręcam wkręt.
4. **Serwa w klatce** (6 × M3×10), kable do tyłu.
5. **Uchwyt:** przednie widełki na M3×12. Kulki na punktach X i Y. Pręty ustawione na przyrządzie długości (39,0 / 39,8), wcisnąć na kulki Uchwytu. Gałka 2 × M3×8 od tyłu.
6. **Płyta do Ramy:** gałka wchodzi od tyłu w klatkę powiek, 3 × M3×8.
7. **Zasilanie, program `kalibracja`:** S_X, S_Y, S_P trzymają 1500 µs przez cały czas nasadzania (jak krok 4 v2.8).
8. **Przyrząd zera gałki** na gałce i rancie (ψ = θ = 0). Ramię X i Ramię Y nasadzam na ząb najbliżej znacznika strzałki na Płycie, przy pręcie wpiętym w kulkę orczyka. Różnicę do pół zęba wyrównuje ½ obrotu końcówki kulowej. Drugiej gałęzi nie da się złożyć: pręt 39 nie sięga do ramienia skierowanego w górę (32 mm dalej).
9. **Klin powiek** (połowa drogi). Ramię powiek ma jedno położenie dzięki orczykowi pojedynczemu. Wpinam cięgno górne do A (M3) i dolne do B (M2).
10. **Zdejmuję przyrządy.** Każde serwo komendą `g` ±100 µs powoli. Na stronie zapisuję µs dla ψ ±25, θ ±15, zamknięte i otwarte, sprawdzam 2° zapasu do ograniczników. Ograniczniki prętów ustawiam nakrętkami na ψ ±27 i θ ±17.
11. **Test 24 h na stole** (jak E5.6).

| Serwo | Zakres bez kolizji | Ograniczniki |
|---|---|---|
| X | ψ ±27° = serwo −34…+27° | nakrętki na pręcie X o łapkę Płyty |
| Y | θ ±17° = −27…+20° | nakrętki na pręcie Y |
| P | 0–73° (1500 ± 400 µs) | dźwignie o występy boku Ramy, −1° i +2° |

## 10. Ryzyka (top 5)

| # | Miejsce | Scenariusz porażki | Test |
|---|---|---|---|
| 1 | Sprzężenie powiek (warstwy x 25,9–36,25, ramię B r5) | nadlew dźwigni górnej trafia w dolną, M2 przy wkręcie orczyka, cięgno dolne ociera o czaszę (0,4–1 mm), powieka przekosza się (napęd z jednej strony) | **P3** (oś powiek, 2 powieki z dźwigniami, wycinek boku Ramy, Ramię powiek na serwie): 73° ręką i serwem, 100 mrugnięć |
| 2 | Kardan RC | kąt < 33°, luz > 0,2 mm, wkręt ustalający nie trzyma na M3 | pomiar plus **P1** (Słupek z kieszenią i Uchwyt, przegięcie 32° we wszystkich kierunkach) |
| 3 | Przekładnie serw | dziecko obraca gałkę, 1,5–2,5 × moment zablokowania, wielowypust orczyka się ścina | po złożeniu: zasilone serwo, siła 15 N na źrenicy, 20 razy w obie strony, oględziny |
| 4 | Obejma w mokrym miąższu | moduł luzuje się po 1–2 dniach | **P5**, 24 h |
| 5 | Ciasny układ serw (odstępy 1,5–3 mm) i przeguby kulowe na 25° | kolizja orczyka Y z korpusem P, przegub kulowy wypina się przy szarpnięciu | Assembly z PODGLĄD MG90S i zakresem ±27/±17; **P4** (przegub na kulce, 30° i wyrwanie ręką) |

## 11. Próbki (jedna runda, razem ok. 2 h druku)

| Próbka | Co rozstrzyga | Druk |
|---|---|---|
| P1 Kardan w gnieździe | kieszeń 0,15, M5 w Ø4,4, wkręt ustalający przez otwór, kąt 32° | 20 min |
| P2 Kieszeń MG90S | luz korpusu 0,4, M3 w uchu, Ø2,6 × 8 | 15 min |
| P3 Oś powiek | DIN 913 zlicowany, luz osiowy 0,25, 2 ucha, warstwy dźwigni, Ramię powiek | 40 min |
| P4 Przegub kulowy | kulka na M2/M3 w Ø1,7/2,6, zakres ±28°, wyrwanie | 10 min |
| P5 Mocowanie w miąższu | rant, odcinek rury, Obejma, pokrętło | 35 min |

## 12. Pomiary użytkownika przed CAD (suwmiarka)

| Co | Przyjęty przedział [Z] | Wpływ | Warunek odrzucenia |
|---|---|---|---|
| **Kardan:** sztuki; czy „3 mm” i „5 mm” to dwa osobne; Ø i długość, Ø widełek, otwory, wkręty ustalające (rozmiar, położenie), odległość krzyżaka od czół, maks. przegięcie, luz (kiwanie przy unieruchomionych widełkach) | Ø9–11, L22–25, otwory 3/5, wkręty M3, ≥ 35°, luz ≤ 0,15 | Słupek, piasta Uchwytu, łuki Uchwytu (Uchwyt omija widełki o ≥ 1,5) | L > 28, przegięcie < 33°, luz > 0,3 mm: drukowany krzyżak na 4 × M3 (pomysł z 18.10, wymaga nowego rachunku) |
| **MG90S:** korpus L × W × H, wysokość do uszu, grubość uszu, rozstaw i Ø otworów uszu, odległość wałka od czoła, wysokość wałka, liczba zębów wielowypustu, długość orczyka pojedynczego, wyjście kabla | 22,8 × 12,2 × 22,7 (28,5 z wieżą), uszy 32,2, otwór 2,0–2,5 | klatka, rzut od tyłu | otwór uszu < 2,9: M2,5 albo rozwiercenie (decyzja), układ bez zmian |
| **Łby M3:** Ø i wysokość łba; czy są DIN 913, stożkowe, M2/M3 pręt gwintowany | 5,5–6 × 2,45 (pomiar 20.10) | oś powiek | brak DIN 913 i brak zakupu: `kulaD` 56 |
| Otwór wieczka, gabaryt wieży | ≥ 110; 105 × 60 | Obejma ok. Ø104 przez wieczko | wieczko < 106: Obejma dzielona |

## 13. Pytania do użytkownika

| # | Pytanie | Moja propozycja |
|---|---|---|
| **B1 (blokujące)** | Masz 4 przeguby kulowe RC (M2 albo M3) i pręty do nich? | Jeśli nie: kupić zestaw M2 (końcówki i pręty, jak u Cogleya). Wariant drukowany (kulka w zatrzasku) nie jest sprawdzony |
| **B2 (blokujące)** | Masz wkręty bez łba M3×8 (DIN 913)? | Kupić 2 sztuki (plus zapas). Bez nich: gałka Ø56 z łbami 2,45, wtedy zapasu w otworze nie ma |
| **B3 (blokujące)** | Pomiary kardana (pkt 12) | — |
| **B4 (blokujące dla klatki)** | Pomiary MG90S (pkt 12) | CAD startuje ze wspólnej obwiedni SG90/MG90S, kieszeń po P2 |
| B5 | Powieki: 3 serwa ze sprzężeniem (moja adaptacja, próbka P3) czy 4. MG90S (sprawdzony u Cogleya, powieki podążają za góra–dół, Płyta od nowa)? | 3 serwa z P3. Jeśli P3 nie przejdzie, 4. serwo w v2 dużego oka |
| B6 | Gałka wystaje 20 mm, zamknięte powieki 25 mm (`glebokoscSrodka` 10). OK? | Tak, z kartonowym kołem Ø84 na dyni |
| B7 | Rozstaw do małych oczu ≥ 120 mm w poziomie, ≥ 135 w pionie po łuku: z przodu zostają po 1–2 małe oczy na boki. OK, czy małe oczy obok dużego pochylamy (osie nie promieniowe)? | Pochylić 2 najbliższe o 10–15° od dużego oka, sprawdzić w Assembly |
| B8 | Mocowanie M1 (Obejma, 2 ruchy, bez narzędzi)? | M1 |
| B9 | Podtrzymanie powerbanku z GPIO ESP zamiast kanału PCA? | Tak |
| B10 | Źrenica okrągła (luz skrętny kardana niewidoczny)? | Okrągła |

## Werdykt

Koncepcja jest **gotowa do krytycznej analizy**. Kinematyka gałki i powiek jest policzona w całym zakresie, a wszystkie podzespoły mieszczą się w Ø79,5. Pod warunkiem B1–B3 da się z niej napisać brief CAD. **Najsłabszy punkt to sprzężenie obu powiek jednym serwem**: to moja adaptacja bez sprawdzonego pierwowzoru, upakowana w pasie 10 mm przy osi powiek. Drugi w kolejności jest przegub kardana na granicy 33°.

---

## Załącznik: rachunki

Skrypty liczyłem lokalnie w Pythonie (siatka i rozwiązanie zamknięte). Wyniki niżej są dosłowne.

**A1. Dlaczego S–S.** Pręt łączy punkt orczyka H (ruch 1-DOF, wymuszony) z punktem gałki P, który porusza się po powierzchni o 2 stopniach swobody. Ruch względny pręta wobec obu końców wymaga 5 stopni swobody w przegubach (6 minus 1 więz długości):
- obrotowy + kulowy = 4: przeciążenie, zakleszczenie (to błąd 18.10);
- obrotowy + kardanowy, kardanowy + kardanowy = 4: zakleszczenie;
- kardanowy + kulowy = 5: dokładnie;
- kulowy + kulowy = 6: jeden obrót pręta wokół własnej osi, bez znaczenia.

Sam przegub o 2 stopniach swobody na jednym końcu nie wystarcza, jeśli drugi koniec to zwykła śruba.

**A2. Pręty gałki** (kardan R = Rx(θ)·Ry(ψ), pitch zewnętrzny):

| ψ | θ | serwo X | serwo Y | przenoszenie X / Y |
|---|---|---|---|---|
| −25 | −15 | 22,4 | −23,9 | 73 / 59 |
| −25 | 0 | 25,1 | −4,5 | 66 / 74 |
| −25 | 15 | 23,2 | 12,6 | 63 / 69 |
| 0 | ±15 | −0,8 | −19,1 / 17,2 | 87 / 66 |
| 25 | −15 | −30,6 | −19,5 | 57 / 67 |
| 25 | 0 | −31,0 | −0,5 | 56 / 82 |
| 25 | 15 | −30,9 | 16,7 | 55 / 70 |

Na całej siatce ±27/±17: przenoszenie ≥ 51 / 56°, odchylenie kulek ≤ 25° (gałka) i 16° (orczyk). Wcześniejsze warianty odrzucone rachunkiem:
- punkty z tyłu kuli (−20; 0; −18): pręt nie sięga przy ψ +25 (punkt ucieka na boki);
- ramiona 8 mm: brak skoku;
- punkt Y z x −3: sprzężenie 11°;
- kulki ∥ x: odchylenie 32°.

**A3. Powieki** (płaszczyzna yz, β od −z w stronę +y, ramię orczyka C = (y −17; z −45)), co 10° serwa:

| serwo | 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 73 |
|---|---|---|---|---|---|---|---|---|---|
| powieka górna [°] | 0 | 6,4 | 12,8 | 19,5 | 26,5 | 33,9 | 41,5 | 48,9 | 51 |
| powieka dolna [°] | 0 | 2,9 | 6,3 | 9,9 | 13,8 | 17,8 | 21,8 | 25,7 | 26,9 |
| min. przenoszenie (dźwignie / ramię) [°] | 60 / 49 | 71 / 56 | 73 / 62 | 69 / 70 | 65 / 79 | 60 / 78 | 56 / 68 | 52 / 57 | 52 / 49 |

Wariant z ramieniem w (y −18; z −42) dawał przenoszenie 13–16° i odpadł. Wariant z dźwignią dolną r16 dawał kolizję nadlewów przy kącie serwa 54°.

**Siła przycięcia:** F = T / (R · (dφg/dα + dφd/dα)) = 0,177 / (0,034 · 0,93) = **5,6 N**.

**A4. Masy i momenty** (PLA 1,24 g/cm³):

| Część | Objętość i masa |
|---|---|
| Gałka | czasza 230° Rm 29 × 2: 15,0 cm³, 18,6 g |
| Powieka górna | klin 100° Rm 32,3 × 2,2: 8,0 cm³ + rant 0,5 + dźwignia 0,7, razem 11,4 g |
| Powieka dolna | 79°: 9,1 g |
| Rama | rura 21,9 cm³ − 35 % okien + rant 2,1 + nadlewy 1,5, razem 22 g |
| Reszta wydruków | Płyta 15, Słupek 3, Uchwyt 3, Obejma z Pokrętłem 13, cięgna i ramiona 3 |
| Kupne | kardan ok. 8 g, śruby i nakrętki ok. 19 g, przeguby i pręty 5 g, serwa 40,2 g, kable w module 4–9 g |
| **Razem** | **ok. 175 g** |

Środek ciężkości (z ≈ −24):
- przód (gałka, powieki, kardan, ok. 50 g) na z +2;
- Rama 22 g na z −12;
- tył (Płyta, serwa, śruby, ok. 80 g) na z −48.

Momenty:
- środek masy czaszy 230° leży R(1 + cos 115°)/2 = 8,7 mm przed środkiem kuli; z Uchwytem ok. 22 g × 8 mm daje 1,7·10⁻³ N·m;
- klin powieki: środek ciężkości 0,785 R · sin(S/2)/(S/2) = 22,2 mm (górna), 23,4 (dolna). Momenty od ciężaru 2,5 i 2,1·10⁻³ N·m;
- bezwładność gałki 1,35·10⁻⁵ kg·m² przy 209 rad/s² daje 2,8·10⁻³ N·m. Górna powieka 1,19·10⁻⁵ przy 247 rad/s² daje 2,9·10⁻³.

**A5. Czasza i zakres powiek.** Przy krawędzi czaszy na 105° (210°) i ψ 25° krawędź wychodzi na 80° od przodu: widać ją na wprost przez szczelinę przy kąciku. Przy 115° (230°) wychodzi na 90°, czyli w kącik, gdzie szczelina ma 0 mm i przykrywa ją stos uszu. Przy ψ 27° wychodzi na 88°, gdzie szczelina ma połowę wysokości 0,7 mm.

Powieki zakrywają kulę patrzącą na wprost, gdy górna sięga do 90° i dolna do −90° w każdym położeniu:
- górna: −9 + S ≥ 90, stąd **S ≥ 100°** (zamknięta);
- dolna: −11 − S ≤ −90, stąd **S ≥ 79°**.

Tylne krawędzie przy otwartych powiekach: 142° i −117°. Pręt X biegnie przy 180° ± 13°, pręt Y przy 214°, oba w wolnym sektorze 142–243°.

**A6. Rozstaw do małego oka.** Warunek 2(R − t)·sin(γ/2) ≥ r_duże(t) + r_małe(t) + 3, rozstaw po łuku s = R·γ:

| Miejsce | r_duże | r_małe | Wynik |
|---|---|---|---|
| wewnętrzna ścianka (t = w) | Obejma 48 | Nakrętka 37 | s = 100 (w 15) – 118 (w 35) |
| tył (t = 72) | klatka 27 w poziomie / 33 w pionie | Kaseta z Klamrą H 30,5 | **s = 119 (poziom) / 132 (pion)** |

**A7. Stosy przy przegubach powiek.**
- Cięgno dolne do dźwigni dolnej: cięgno x 28,2–30,6, podkładka 0,5, dźwignia 31,2–33,6 (otwory luźne Ø3,3); nakrętka samohamująca po stronie −x, x 25,8–28,2. Ta warstwa to warstwa cięgna górnego, ale przegub dolny (y −14…−12,5; z 0…−6,4) leży ≥ 12 mm w płaszczyźnie yz od cięgna górnego (y −11…−1; z −19…−48).
- Dźwignia górna: nadlew x 28,2–36,25 na promieniu 22 ± 3,5, cięgno górne x 25,9–28,3 (przy nadlewie podkładka po stronie +x), łeb od strony −x.
- Ramię powiek: x 23,2–25,6. Cięgno górne leży przy nim bezpośrednio. Cięgno dolne łączy się z ramieniem B przez tulejkę dystansową 2,6 mm na M2, w miejscu, gdzie cięgna górnego nie ma (ramiona A i B rozchylone o 150°).
- Wszystkie elementy powiek leżą przy |x| ≥ 23 albo poza kulą R30,5 (sprawdzone dla z ≤ −10).
- Wkręty osi: DIN 913 M3×8 od x 39,75 do 31,75; gwint w boku 3,25; 0,55 przed wewnętrzną ścianą ucha dolnego.
