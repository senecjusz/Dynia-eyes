# Referencja The Face maker101 jako wzór dużego oka (analityk Opus 5.5)

25.10.2026. Brief: `30-projekt/brief-analiza-referencji-face-maker101.md`. Praca tylko na odczyt. Plików z PCBWay nie pobierałem.

## 0. Źródła i oznaczenia

**Strona:** <https://www.pcbway.com/project/shareproject/The_Face_maker101_c4124445.html> (autor Mert Kilic / Maker 101, 29.09.2024, CC BY-SA). Strona otwiera się. Czytałem tekst opisu, zdjęcia w przeglądarce (powiększenia) i film.

**Film:** osadzony na stronie YouTube `H712Cc5Ca94`, „The Face: DIY Animatronic Eyes with Motion Detection and Sound”, 7:32. Montaż mechaniki trwa od 0:40 do 3:25 i idzie bez narracji (tylko muzyka). Czasy podaję jako m:ss.

**Numeracja zdjęć** (kolejność na stronie):

| Nr | Plik | Treść |
|---|---|---|
| G1 | web/24/09/29/0024423018883 | maska na niebieskim tle |
| G2–G4 | 0030564956230, 0031231671023, 0031576298615 | płytka PCB (bez znaczenia dla mechaniki) |
| G5 | web/24/09/30/2031046517705 | **mechanizm z góry**, 5 serw, elektronika obok |
| G6 | 2030554872177 | maska z oczami, front |
| G7 | 2031256628135 | maska od tyłu, w środku uchwyt na fioletowej listwie |
| S1 | project/…/2041515117168 | krok 1: maska, części drukowane, 2 gałki i 2 powieki |
| S2a | 2044393288413 | krok 2: gotowy mechanizm w dłoniach |
| S2b | 2045331334555 | krok 2: siatka 3 × 3 zdjęć montażu (panele 1–9 wierszami) |
| S6a | 2059569142033 | krok 6: maska, wkładanie PIR |
| S6b | 2100110176625 | krok 6: siatka 2 × 3 montażu w masce (panele 1–6) |

Zdjęć S3 (obwód testowy), S4 (PCB), S5 (kod) nie analizowałem, bo dotyczą elektroniki.

**Pliki do pobrania na stronie (nie pobrane):**

| Rodzaj | Pliki |
|---|---|
| Kod | `servo_motor_code.ino`, `the_face_code.ino` |
| Schemat, BOM | `Schematic_Nano_DFPlayer_PIR_Servo_Board_2024-09-16.png`, `Ekran Resmi 2024-09-16 13.33.59.png` (BOM jako obraz), BOM CSV i Gerbery pod przyciskami „Download BOM/Gerber” |
| Dźwięk | `1.mp3` |
| STL | `joint_v1.stl` i `center-joint_v1.stl` (opis: „Universal Joint”), `face_main.stl`, `eyeball.stl`, `eyelid.stl`, `eye_holder_main.stl`, `bars_v1.stl`, `backside.stl` |

Wymiarów gałki, przegubu ani długości prętów nie ma w opisie. Ich dokładne wartości są tylko w STL. Wymiary niżej szacowałem ze zdjęć, przyjmując za wzorzec znany korpus MG90S (22,8 × 12,2 × 22,7 mm). Oznaczam je **[Z]**.

**[F]** to fakt odczytany ze źródła, **[Z]** to założenie albo szacunek.

---

## 1. Fakty z referencji

### 1.1 Lista części

| Część | Ile | Szczegół | Źródło | |
|---|---|---|---|---|
| Maska (face_main) | 1 | PLA, średnia jakość | opis „Step 1”, S1 | [F] |
| Gałka (eyeball) | 2 | drukowana, tęczówka w kolorze | opis „Step 1”, S1 (prawy dolny panel) | [F] |
| Gałka: kształt | – | czasza (półkula), otwarta z tyłu | S1: cztery jednakowe kopułki, dwie z tęczówką | [Z] |
| Powieka (eyelid) | 2 | jedna na oko, czasza większa od gałki | opis „Two eyelids”, S1, G5 | [F] |
| Uchwyt serw (eye_holder_main) | 1 | płyta z kieszeniami na 5 serw, słupkami pod przeguby i wspornikami osi powiek, jedna część | opis „Servo holder (to hold all 5 servos in place)”, S1, S2b-1 | [F] |
| Przegub krzyżowy (joint_v1 + center-joint_v1) | 2 zestawy | drukowany, jeden fioletowy, jeden szary | opis „Universal joints”, film 0:43, S2b-1 | [F] |
| Listwy (bars_v1) | 2 | fioletowe, poprzecznie w masce | opis „Two bars”, S1, film 6:08 | [F] |
| Tył (backside) | 1 | rama z oknami, zamyka elektronikę | opis, S1, S6b-4 | [F] |
| MG90S | 5 | 2 × lewo–prawo, 2 × góra–dół, 1 × powieki | opis „Step 2”: „five MG90S” | [F] |
| Drut | ok. 7 odcinków | spinacze biurowe, gięte kombinerkami | opis „we used a few paperclips”, film 1:05 | [F] |
| Średnica drutu | – | ok. Ø0,9–1,0 (typowy spinacz) | – | [Z] |
| Wkręty serw | 2 na serwo | wkręty z kompletu MG90S, wkręcane wkrętakiem w kieszenie uchwytu | film 0:40 (wkrętak przy serwie) | [F] działanie, [Z] że to wkręty z kompletu |
| Wkręty osi powiek | 2 na powiekę | małe wkręty samogwintujące (wyglądają jak wkręty serwa) | film 1:46 (dwa wkręty na dłoni), 1:55 (wkręcanie z boku przez wspornik) | [F] |
| Wkręty orczyków | 1 na serwo | standardowe | film 2:30 (zakładanie orczyka) | [F] |
| Klej na gorąco | – | uchwyt do listew | opis „Step 6”: „using hot glue” | [F] |
| Śruby w opisie | – | brak wzmianki | opis | [F] |

### 1.2 Gałka

| Pytanie | Odpowiedź | Źródło | |
|---|---|---|---|
| Średnica gałki | ok. Ø35 (±5) | G5, film 3:46; skala z MG90S i rozstawu oczu ok. 103 mm | [Z] |
| Średnica powieki | ok. Ø45–50 z uszami osi | G5, film 3:46 | [Z] |
| Na czym siedzi | na **przegubie krzyżowym** wciśniętym na słupek wystający z przedniej krawędzi uchwytu | film 0:47 i 0:51 (wciskanie przegubów na słupki), S2b-1, film 2:29 (gałka nasuwana na fioletowy przegub) | [F] |
| Gdzie jest środek obrotu | na płaszczyźnie tylnej (otwartej) strony czaszy, czyli w środku kuli | G5, film 3:46 | [Z] |
| Ile przegubów | **1 przegub krzyżowy na oko** (2 osie obrotu), nic więcej nie podpiera gałki | opis „Universal joints are added”, S2b-1 | [F] |
| Jak gałka trzyma się przegubu | wcisk, bez śruby | film 2:29 | [Z] |

### 1.3 Napęd gałki

| Pytanie | Odpowiedź | Źródło | |
|---|---|---|---|
| Ile serw na oko | 2 (lewo–prawo i góra–dół) | opis „Each eye's movement is controlled by two servos”, kod: Servo1/5 poziomo, Servo2/4 pionowo | [F] |
| Serwo lewo–prawo | stoi za gałką, wałek prostopadły do płyty uchwytu, **orczyk podwójny** równoległy do płyty | G5, S2a | [F] |
| Pręty lewo–prawo | **2 druty pchająco-ciągnące** z obu końców orczyka do lewej i prawej krawędzi tylnej strony gałki | G5 (powiększenie), S2a | [F] |
| Serwo góra–dół | leży bokiem przy zewnętrznej krawędzi uchwytu, wałek równoległy do płyty | G5, S2a | [F] |
| Pręt góra–dół | 1 drut z orczyka do dolnej części gałki, przy osi | G5, S2a | [F] układ, [Z] punkt zaczepienia |
| Połączenie drutu z orczykiem | koniec drutu zagięty i włożony w otwór orczyka (bez przegubu, bez oczka) | G5, film 1:05 (gięcie), 2:30 | [Z] kształt zagięcia (Z lub haczyk) niewidoczny |
| Połączenie drutu z gałką | drut w otworze na krawędzi czaszy | G5, S2a | [Z] |
| Przeguby na prętach | **brak**, drut sam się ugina i obraca w otworach | G5, S2a | [F] |
| Kąty serw w kodzie | Servo1 (L–P lewe): prawo 60 – środek 75 – lewo 90; Servo5 (L–P prawe): prawo 70 – 90 – lewo 110; Servo2 (G–D lewe): dół 70 – 95 – góra 110; Servo4 (G–D prawe): dół 110 – 80 – góra 60 | komentarze w kodzie, film 3:38 | [F] |
| Wychylenie serw | L–P: ±15° i ±20°; G–D: −25/+15° i −20/+30° | z kątów wyżej | [F] |
| Wychylenie gałki | ≈ wychylenie serwa (ramię orczyka ok. 15–18 mm, zaczep na gałce ok. 17 mm od środka, przełożenie ok. 1:1) | G5 | [Z] |

### 1.4 Powieki

| Pytanie | Odpowiedź | Źródło | |
|---|---|---|---|
| Czy są | tak, **1 powieka na oko (górna)** | opis, S1, film 3:46 | [F] |
| Kształt | czasza większa od gałki, ze zgrubieniami (uszami) na osi | S1, G5 | [F] |
| Podparcie | oś pozioma przez środek gałki, **2 wkręty z boku przez pionowe wsporniki** uchwytu | film 1:55, G5 | [F] |
| Napęd | 1 serwo między oczami, orczyk z **2 drutami**, każdy do wewnętrznego ucha jednej powieki | opis „eyelids are controlled by a single servo”, G5 (dwa skośne druty) | [F] |
| Zakres serwa | zamknięte 50 – otwarte 80 (30°) | kod, film 3:38 | [F] |
| Otwarta powieka | zasłania górną część gałki aż do tęczówki | film 3:46 | [F] |

### 1.5 Mocowanie i kolejność montażu

| Krok | Co | Czym | Źródło | |
|---|---|---|---|---|
| 1 | serwa ustawione na 90° | program testowy | opis „Center the Servos” | [F] |
| 2 | 5 serw w kieszenie uchwytu | wkręty serw, wkrętak | film 0:40 | [F] |
| 3 | 2 przeguby wciśnięte na słupki | ręka | film 0:43–0:51 | [F] |
| 4 | druty gięte i przycinane | kombinerki, obcinaczki | film 1:05, S2b-2 | [F] |
| 5 | powieka nałożona na wsporniki, 2 wkręty z boku | wkrętak | film 1:46–1:55 | [F] |
| 6 | gałka nasunięta na przegub | ręka | film 2:29 | [F] |
| 7 | druty w orczyk, orczyk na wałek, wkręt orczyka | wkrętak | film 2:30, S2b-7…9 | [F] |
| 8 | test na płytce stykowej | – | opis „Step 3”, film 3:30–3:46 | [F] |
| 9 | 2 listwy wsunięte poprzecznie w maskę | ręka | opis „Insert the Bars”, film 6:08 | [F] |
| 10 | uchwyt z całym mechanizmem położony na listwach i przyklejony | klej na gorąco | opis „using hot glue”, film 6:22–6:26, S6b-3 | [F] |
| 11 | PIR, głośnik, PCB, tył | – | opis „Step 6” | [F] |
| Płyta uchwytu | leży poziomo, prostopadle do twarzy; gałki z przodu, serwa za nimi | S6b-3, film 6:26 | [F] |

### 1.6 Co jest proste i dlaczego działa

| Cecha | Dlaczego działa |
|---|---|
| Jedna część trzyma wszystko (serwa, słupki przegubów, wsporniki powiek) | położenia osi wynikają z druku, nie z montażu; nic się nie ustawia |
| Jeden przegub na oko, w środku kuli | gałka obraca się wokół stałego punktu, druty tylko pchają; brak ramek i jarzm |
| Druty bez przegubów | spinacz w otworze sam się obraca, a przy kątach ±15–25° ugięcie drutu jest małe |
| Para drutów pchająco-ciągnących na osi L–P | jeden drut zawsze ciągnie, więc cienki drut się nie wyboczy |
| Powieka na tej samej osi co środek gałki | stała szczelina między gałką a powieką w całym ruchu |
| Mały zakres (±15–25°) | szczelina w masce i tak zasłania resztę; mało ugięcia drutu, mało kolizji |
| Duże luzy | gałka ok. Ø35 pod powieką ok. Ø45–50: szczelina ok. 5 mm na promieniu; wsporniki stoją poza czaszą powieki |
| Montaż od przodu i z boku na otwartym stole | każdy wkręt jest dostępny prosto, mechanizm trafia do maski dopiero na końcu, gotowy i przetestowany |
| Mocowanie klejem do listew | brak śrub i ramek do maski |

---

## 2. Adaptacja do naszych potrzeb

Wejście: gałka Ø60, otwór w dyni ≤ Ø80 z tubą i kołnierzem od środka (PRD §4), 4 × MG90S (L–P, G–D, powieka górna, powieka dolna), części z PRD §7.

### 2.1 Czy podparcie z referencji wystarcza przy Ø60

Gałka w referencji siedzi **już na przegubie krzyżowym w środku kuli**. Kardan w środku gałki nie jest więc dodatkiem, tylko tym samym elementem co w referencji. Pytanie dotyczy tylko tego, czy użyć drukowanego przegubu, czy posiadanego kardana.

| Wielkość | Referencja | Ø60 | Wniosek |
|---|---|---|---|
| Masa gałki (czasza PLA 1,6 mm, 2πR²·t·1,24 g/cm³) | ok. 3 g | ok. 11 g + piasta ≈ 15 g | obciążenie przegubu rośnie ok. 5 razy, ale nadal jest małe |
| Siła na drucie (MG90S 0,18 N·m, ramię 13,5 mm) | – | do ok. 13 N | drukowany przegub ok. 15 mm na wcisk przenosi to tylko wtedy, gdy się go przeskaluje; jego geometria jest nieznana bez STL |
| Kąt przegubu | ±15–25° | potrzeba ±35° | kardan 5/5 zgina się ponad 90° (`e6-pomiary.md`) |

**Werdykt:** zasada podparcia z referencji (jeden przegub krzyżowy w środku kuli na słupku) **wystarcza przy Ø60** i przenoszę ją 1:1. Proponuję zastąpić drukowany przegub posiadanym **kardanem 5/5** (Ø11 × 25,5, otwory Ø5, wkręty M4). Liczba przegubów zostaje ta sama, czyli 1. Uzasadnienie: geometria drukowanego przegubu jest nieznana bez pobrania STL, a przeskalowany wcisk w PLA przy obciążeniu 5 razy większym trzeba by sprawdzić. Kardan 5/5 już istnieje, ma zmierzone wymiary i pasuje do słupka Ø5. Decyzja należy do użytkownika (P1).

### 2.2 Lista części adaptacji

| Część | Ile | Odpowiednik w referencji | Uwagi |
|---|---|---|---|
| **Drukowane** | | | |
| Uchwyt: płyta z kieszeniami na 4 serwa, słupkiem i 2 wspornikami osi powiek | 1 | eye_holder_main (połowa: jedno oko) | ok. 110 × 110 mm [Z]; ≤ 180 mm, mieści się na A1 mini |
| Gałka Ø60, czasza z piastą pod kardan i otworami na 3 druty | 1 | eyeball | patrz P5 (głębokość czaszy) |
| Powieka górna | 1 | eyelid | |
| Powieka dolna | 1 | brak | PRD §4, wariant C |
| Przedłużenie orczyka 25 mm | 2 | brak | PRD §4 (dla powiek) |
| Tuba z kołnierzem i łapami | 1 | listwy + maska | PRD §4 (montaż od środka dyni) |
| **Posiadane** | | | |
| MG90S z kompletem wkrętów i orczyków | 4 | 5 | |
| Kardan 5/5 | 1 | joint_v1 + center-joint_v1 | P1 |
| Drut sprężynowy Ø1,0 lub Ø1,2 | 5 odcinków (2 L–P, 1 G–D, 2 powieki) | spinacze | P6 |
| **Śruby** | | | |
| Wkręty serw (z kompletu) | 8 | 10 | jak w referencji |
| Oś powiek: 2 × M3 + nakrętka | 2 | 4 wkręty samogwintujące (2 powieki) | P7 |
| Słupek kardana: śruba M5 (trzon Ø5 w otworze piasty, dociśnięty wkrętem M4) albo słupek drukowany Ø5 | 1 | słupek drukowany | P2 |
| Wkręty do drewna 4 × 30–40 w miąższ | 4 | klej na gorąco | PRD §4 |
| Uchwyt do kołnierza | 2–4 × M3/M4 albo jedna część | klej | P9 |

### 2.3 Szkic

Widok z boku (przód dyni po lewej; oś G–D prostopadła do rysunku, przez środek kuli O):

```
          ściana dyni
         |//////////|
  rant ≤2|  tuba    |kołnierz          serwo PG (powieka górna)
     ____|__________|____      drut PG   ┌──┐
    / powieka górna  \___\______________│  │ orczyk +25
   /   ________        \  |   ucho 34   └──┘
  |   /        \       |  |
  |  |  gałka   O══[K]═══════╡słupek M5╞════╗
  |  |   Ø60    |  kardan 5/5             ║  serwo L–P (stoi, orczyk podwójny)
  |   \________/       |  |  2 druty L–P ─╢  ┌──┐
   \  powieka dolna   /___|_______________║__│  │
    \_______________ /   drut G–D ────────╫──┐  └──┘
         |          |                     ║  serwo G–D (leży bokiem)
         |//////////|      ══════════ płyta uchwytu (pozioma) ═════
                           serwo PD (powieka dolna) pod płytą albo z boku [Z]
```

Widok od tyłu (patrzymy z wnętrza dyni do przodu):

```
                 drut PG
        ┌──┐ ─────────────╮
        │PG│               \       wspornik osi    wspornik osi
        └──┘          ┌─────\───────┐ M3        M3 ┌───────────┐
                      │   ╭──────────────────────────╮         │
                      │  ╱   ●  zaczep L–P lewy       ╲        │
               ┌────┐ │ │          [K] kardan    ●     │       │
   serwo G–D   │ GD │ │ │           │       zaczep L–P │       │
   (leży) ─────┤    ├─┼─┼──── ● ────┘  prawy           │       │
               └────┘ │  ╲  zaczep G–D              ╱  │       │
                      │   ╰─────────────────────────╯  │       │
                      └──────────────────────────────── ┘
                       ┌───────────┐
                       │  L–P      │  orczyk podwójny ═●═══●═
                       │  (stoi)   │  dwa druty do zaczepów L–P
                       └───────────┘
        ┌──┐
        │PD│ ── drut PD do ucha powieki dolnej
        └──┘
```

Układ serw przeniesiony z lewego oka referencji (G5): L–P stoi za gałką, G–D leży z boku. Serwo powiek z referencji (środek, między oczami) zastępują dwa serwa, PG i PD, po obu stronach uchwytu [Z].

### 2.4 Budżet promieniowy w otworze Ø80

W referencji gałka i powieka siedzą za cienką maską ze szczeliną, a wsporniki stoją poza czaszą powieki. U nas gałka i powieki obracają się w tubie w otworze ≤ Ø80. Na promieniu jest 10 mm (40 − 30):

| Warstwa | Powieki koncentryczne | Powieki na tym samym promieniu, stykają się w środku |
|---|---|---|
| szczelina gałka–powieka | 1,5 | 1,5 |
| powieka dolna | 1,6 | – |
| szczelina między powiekami | 1,0 | – |
| powieka (górna lub obie) | 1,6 | 1,6 |
| szczelina powieka–tuba | 1,5 | 3,9 |
| ścianka tuby | 2,0 | 2,0 |
| **suma** | **9,2 (zostaje 0,8)** | **9,0 (szczeliny ≥ 1,5)** |

Wariant koncentryczny ma szczeliny 1,0–1,5 mm, czyli „na milimetr”, co odrzuca PRD §9. Wariant, w którym obie powieki leżą na tym samym promieniu (górna zamyka górną połowę, dolna dolną, uszy osi jedno obok drugiego na wkręcie), zostawia 3,9 mm przy tubie. Mimo to jest ciaśniej niż w referencji (ok. 5 mm). P4.

Wsporniki osi powiek muszą stać **za** wewnętrzną powierzchnią ściany dyni albo być ścianką tuby. Gdzie wypadnie środek kuli, zależy od grubości ściany dyni, której nie znamy (P10).

### 2.5 Kolejność montażu rękami

| Krok | Co | Narzędzie i dostęp |
|---|---|---|
| 1 | 4 serwa na 90° (PCA9685 z telefonu) | – |
| 2 | serwa w kieszenie uchwytu, 8 wkrętów | wkrętak krzyżakowy prosto z góry; kieszenie otwarte od góry jak w referencji (film 0:40) |
| 3 | kardan na słupek (M5), dokręcić wkręt M4 piasty | imbus 2 mm z boku; przed dokręceniem obrócić piastę tak, żeby wkręt patrzył na zewnątrz uchwytu, gdzie nic nie stoi |
| 4 | druty: zagiąć na jednym końcu, przewlec w otwory gałki (L–P × 2, G–D × 1), póki gałka leży luzem na stole | kombinerki; pełny dostęp, gałka w dłoni |
| 5 | gałka na przednią piastę kardana: klej albo wkręt M4 piasty | P3: wkręt M4 w czaszy jest dostępny tylko przez otwarty tył, obok kardana; klej nie wymaga dostępu |
| 6 | powieki na wsporniki, 2 × M3 z boku + nakrętki | wkrętak i klucz 5,5 z zewnętrznej strony wsporników; przed tubą, na stole |
| 7 | drugie końce drutów w orczyki, orczyk na wałek, wkręt orczyka | jak w referencji (film 2:30): orczyk z drutem nakładany na końcu, wkrętak prosto w oś serwa |
| 8 | test i kalibracja na stole | – |
| 9 | moduł do dyni od środka: gałka z powiekami w tubę, kołnierz do ściany, 4 wkręty w miąższ | długi wkrętak przez górny otwór dyni; łapy kołnierza poza obrysem uchwytu |
| 10 | maskownica od zewnątrz | ręka |

Każdy krok od 2 do 8 robi się na stole, z otwartym dostępem z góry albo z boku, tak jak w referencji. Ciasne miejsca są dwa: krok 5 (wkręt piasty w czaszy) i krok 9 (szczelina przy tubie, §2.4).

---

## 3. Różnice wobec referencji: pytania do użytkownika

| Nr | Różnica | Dlaczego | Inne możliwości | Pytanie |
|---|---|---|---|---|
| P1 | Kardan 5/5 zamiast drukowanego przegubu krzyżowego | geometria drukowanego przegubu nieznana bez STL; obciążenie ok. 5 razy większe; kardan posiadany i zmierzony | (a) pobrać `joint_v1.stl` i `center-joint_v1.stl` i przeskalować do Ø60; (b) kardan 2/2 (Ø9) | Kardan 5/5 w miejsce drukowanego przegubu, czy pobieramy i skalujemy STL z referencji? |
| P2 | Słupek: śruba M5 zamiast słupka drukowanego | trzon Ø5 pasuje do otworu piasty Ø5, wkręt M4 dociska do metalu | słupek drukowany Ø5 w uchwycie | Słupek ze śruby M5, czy drukowany? |
| P3 | Mocowanie gałki do piasty: klej albo wkręt M4 | w referencji wcisk; w Ø60 wkręt M4 jest trudno dostępny | wcisk jak w referencji (ryzyko luzu) | Gałkę na piaście kleimy (bez dostępu narzędziem), czy dokręcamy M4 przez tył czaszy? |
| P4 | Dwie powieki zamiast jednej (PRD wariant C) | decyzja użytkownika 25.10 | – | Powieki na tym samym promieniu, stykające się w środku (szczelina 3,9 mm przy tubie), czy koncentryczne (0,8 mm)? |
| P5 | Gałka głębsza niż półkula | przy ±35° tylna krawędź półkuli wychodzi na 55° od osi patrzenia, na promień 24,6 mm, więc w otworze widać wnętrze czaszy; w referencji zasłania to maska | półkula jak w referencji: krawędź wchodzi w widok przy każdym wychyleniu θ, na promieniu 30·cos θ (θ = 15° daje 29 mm, przy samym obrysie; θ = 35° daje 24,6 mm, wyraźnie w środku); po bokach nie zasłaniają jej powieki ani maska | Czasza do 125° od przodu (krawędź 17 mm za środkiem), czy półkula jak w referencji? |
| P6 | Drut Ø1,2 sprężynowy zamiast spinacza (ok. Ø0,9–1,0) | siły do 13 N; para pchająco-ciągnąca chroni L–P, ale G–D ma 1 drut | Ø1,0 (posiadany); dla G–D też para drutów (+1 drut) | Ø1,2 na wszystkie pręty, czy Ø1,0 jak spinacz? |
| P7 | Oś powiek M3 z nakrętką zamiast wkrętów samogwintujących | AGENTS.md: śruby z nakrętkami | wkręty z kompletu serw jak w referencji | M3 z nakrętką, czy wkręty samogwintujące jak w referencji? |
| P8 | Przedłużenie orczyka 25 mm (2 szt.) | PRD §4: pełne otwarcie powieki ok. 51,5° | ucho bliżej osi powieki, bez przedłużenia (referencja: 30° serwa) | Zostaje przedłużenie z PRD, czy ucho bliżej osi bez dodatkowej części? |
| P9 | Uchwyt przykręcony do kołnierza tuby zamiast przyklejonego do listew | moduł wkładany od środka dyni (PRD §4) | uchwyt i kołnierz jako jedna część (bez śrub); klej na gorąco jak w referencji | Jedna część, śruby, czy klej? |
| P10 | Gdzie stoją wsporniki osi powiek (za ścianą dyni czy w tubie) | zależy od grubości ściany dyni | – | Jaka jest grubość ściany dyni w miejscu otworu i ile wolnego miejsca jest za nią? |
| P11 | Zakres ruchu większy niż w referencji (patrz §4) | PRD wymaga ±35°/±25°, referencja daje ok. ±15–25° | zostać przy zakresie z referencji | Większy zakres przez wybór otworów orczyka i kątów serw (bez nowych części), czy zakres z referencji? |

Razem **11 pytań**.

---

## 4. Zakres ruchu wobec PRD

| Oś | PRD cel / minimum | Referencja (kąt serwa z kodu, przełożenie ≈ 1:1 [Z]) | Adaptacja |
|---|---|---|---|
| L–P | ±35° / ±30° | **±15° i ±20°** (oba oczy) | ±35° przy serwie ±45°, orczyk 13,5 mm (otwór 5 od osi), zaczepy L–P 16,6 mm od środka: 13,5·sin45° = 9,5 mm = 16,6·sin35° |
| G–D | ±25° / ±20° | **−25/+15° i −20/+30°** | ±25° przy serwie ±45°, orczyk 13,5 mm, zaczep G–D 22,6 mm od środka (9,5 = 22,6·sin25°); mieści się w R30 |
| Powieki | od zamkniętej do otwartej | 30° serwa, jedna powieka | 51,5° (PRD, przedłużenie 25 mm) |

Referencja daje na osi L–P o **15–20° mniej niż minimum PRD**, a na osi G–D mieści się w minimum tylko w jednym kierunku. Wynika to z kodu i ze szczeliny w masce, nie z mechanizmu. Kardan 5/5 nie ogranicza zakresu (ponad 90°). Większy zakres u nas oznacza:

- tylko wybór otworu orczyka i odległości zaczepów na gałce, bez nowych części;
- większe ugięcie drutów bez przegubów (ok. 2,5 razy większy kąt niż w referencji);
- czaszę głębszą niż półkula (P5).

Pozostanie przy zakresie z referencji (±15–20°) nie wymaga P5, ale nie spełnia minimum PRD na osi L–P. Wybór należy do użytkownika (P11).

Narożniki: przy kardanie obie osie są niezależne. Zaczepy L–P i G–D leżą 16,6 i 22,6 mm od środka, a obrys kardana to Ø11, więc druty nie trafiają w kardan [Z, do sprawdzenia w CAD].

---

## 5. Werdykt

Adaptacja jest prostsza niż v9: 1 przegub zamiast 1 + 2 × 2/2, druty bez przegubów, jedna płyta uchwytu bez ramek, 4 serwa wkręcane prosto z góry. Da się ją złożyć rękami na stole w kolejności z referencji. Jedyne ciasne miejsca to szczelina powiek w tubie Ø80 (P4, P10) i mocowanie gałki do piasty (P3).
