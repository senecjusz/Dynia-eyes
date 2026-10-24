# Raport nocny 24/25.10 – duże oko, krok 2

Projektant dużego oka. Zlecenie: `30-projekt/brief-duze-oko-krok2-cad.md`. Raport aktualizowany przy każdym kamieniu.

## Najważniejsze na rano

1. **Onshape: nie powstał dokument „Duże oko v2”.** Uprawnienia mojej sesji zablokowały utworzenie nowego publicznego dokumentu (`POST /documents`, `isPublic: true`, plan Free; klasyfikator: „Create Public Surface”). Nie obchodziłem tej blokady. **Model zbudowałem parametrycznie w OpenSCAD** (zainstalowany na Windows): `40-cad/openscad/duze-oko-v2.scad`, zmienne na górze pliku, eksport 3MF skryptem `40-cad/openscad/eksport.sh`. Onshape da się odtworzyć później z tego pliku i planu (decyzja niżej).
2. **Granica parametru:** przy otworze Ø80 gałka może mieć najwyżej Rg ≈ 30,4 (asercja w SCAD, test zginania). PRD: Ø60 (Rg 30), więc OK.
3. **Próbka drutu do druku:** `40-cad/3mf/Duze oko v2/Probka drutu.3mf` (blaszka ucha 1:1 jak w gałce, ok. 10 min). Test: sekcja „Próbka drutu: co sprawdzić”.

## Kamienie

| # | Kamień | Stan | Commit |
|---|---|---|---|
| 1 | Próbka końcówki drutu | gotowa (3MF, siatka OK) | 98e5fdb |
| 2 | Plan szczegółów + Astra | plan `40-cad/onshape/duze-oko-v2-plan.md`, review Astry `20-analizy/review/2026-10-25-astra-plan-v2.md` (3 krytyczne, 7 ważnych); poprawki w modelu (niżej) | 98e5fdb |
| 3 | CAD | OpenSCAD zamiast Onshape (pkt 1 wyżej): osobny moduł na część, wszystkie liczby jako zmienne na górze pliku | a4017f6, fe62019, 566001b, b8a48b7 |
| 4 | Eksport 3MF + kontrola siatek | 7 części + zbiorczy w `40-cad/3mf/Duze oko v2/`: wszystkie szczelne, 0 błędów po naprawie (CGAL zostawia pojedyncze zdegenerowane trójkąty, `eksport.sh` naprawia je automatycznie), każda część = 1 bryła, zbiorczy = 7 | 566001b, b8a48b7 |
| 5 | Kontrola kolizji + Astra na siatkach (pełne review: `20-analizy/review/2026-10-25-astra-pelne-v2.md`, K1 rozstrzygnięte) | kolizje `40-cad/openscad/kolizje-v2.txt`: gałka 8 × 6 pozycji ±35°/±25° z narożnikami (+ zagęszczenie co 1° wokół minimum drutów), powieki 7 pozycji (dolna z solvera), kąty serw z solvera. **0 przenikań.** Najmniejsze odstępy: styki montażowe 0,00; luzy osi powiek 0,18–0,20 (projektowe); drut S1–gałka 0,42 (zagęszczenie, opis w W2 niżej); reszta ≥ 0,5. Astra `20-analizy/review/2026-10-25-astra-siatki-v2.md`: 2 krytyczne, 5 ważnych, 2 drobne; wszystkie poprawione (tabela niżej) | 566001b, b8a48b7 |
| 6 | Druty: rysunek 1:1 | `40-cad/druty/duze-oko-v2-druty-1do1.svg` (L: **S1 41,9, S2 42,9 (Z pod 75°), powieki 2 × 44,6**) | 566001b, b8a48b7 |
| 7 | Instrukcja montażu i README druku | `40-cad/openscad/duze-oko-v2-montaz.md` | 566001b, b8a48b7 |

## Rozstrzygnięcia z Astrą (plan)

| Uwaga Astry | Rozstrzygnięcie |
|---|---|
| K1 klepsydra Ø1,2 × 0,4 → tylko 19° przechyłu | talia **Ø1,7 × 0,3**, stożki 45° (wylot Ø3,4 przy blaszce 2 mm): warunek 1/cos φ + 0,3 tan φ ≤ 1,7 daje ok. 44°. **Ucho to blaszka zawieszona na skorupie** (nie żebro od stołu): otwór 20 mm od osi na z = −4 (dalej i wyżej drut zahaczał o tylny rant gałki: −0,84 mm przy θ 35°, φ −25°; teraz +0,77), dolna krawędź 1,2 mm pod otworem na odcinku 5,5 mm, dalej pod 45° do stołu, więc druk bez podpór. Kontrola kolizji pokazała, że przy żebrze stojącym na stole korpus drutu przy pochyleniu 25° musi przejść przez żebro (−0,96 mm). Przechył w otworze: S1 do 40°, S2 do 52° bez wstępnego kąta, ok. 37° z Z przygiętym na 75° (rysunek drutów). **Próbka ma to samo ucho i to ona rozstrzyga**: jeśli drut się klinuje przy ±35°, rozwiercić talię na Ø1,9 |
| K2 stożek piasty zaczyna się w powietrzu | zgoda. **Jedna podpora drzewiasta pod wierzchołkiem stożka** (wewnątrz gałki, zdejmowana przez tylny otwór Ø57). Najniższy punkt w osi budowany od krawędzi pod 45° to z = 18,8, a piasta ma czoło na 12,75, więc bez podpory się nie da |
| K3 ramiona powiek mogą się przeciąć | ramię dolnej to sektor −50…−11° (górnej 11…50°; skrócone, bo przy 61° dotykało drutu przy dźwigni), r 4,5…11,5 (ograniczone, żeby nie dotykać tuby). Kontrola: powieka–powieka 0,20 (luz osiowy uszu), druty–druga powieka ≥ 0,82 |
| W1 kąty serw ze stałej długości drutu | solver `40-cad/narzedzia/duze-oko-kinematyka.js`. S1: orczyk r 17,5, zero −6°, serwo **−42…+38°**. S2: r 13,5, −6°, **−46…+40°**. Cała siatka ±35° × ±25° (narożniki też) osiągalna |
| W2 narożniki | jak wyżej, osiągalne (sprzężenie osi do ok. 10° na S1, do skompensowania w programie) |
| W3 asymetria powiek na wspólnym otworze | S3 z **wałkiem pionowym**: otwór orczyka porusza się w płaszczyźnie y = 0, więc dla obu dźwigni układ jest symetryczny. Solver: przy otwarciu górnej o 51,5° dolna otwiera się o 51,26°, zamknięcie −0,23° |
| W4 luz między powiekami 0,5 – 2 × 0,2 = 0,1 | dolna R 33,4 (szczelina **0,7**). Dźwignie r 7 (ogon Z ma 0,64 do tuby) |
| W5 luz osiowy M2 | otwór w podkładce **ślepy, głębokość 2,4**: M2 × 6 wkręcona do dna daje łeb w x 32,1, czyli 0,2 luzu do ucha |
| W6 kolejność montażu | w instrukcji (kamień 7) |
| W7 źrenica | założenie: **źrenica Ø10** w tęczówce Ø24. Przy otwarciu 50° i spojrzeniu 25° zapas 15,4° |
| D1 maskownica | Ø79,0 na tubę Ø79 (wcisk 0; druk zwęża otwór). Dopasować po wydruku |
| D2 wylot klepsydry | liczony z kąta (Ø3,4) |

## Rozstrzygnięcia z Astrą (siatki)

| Uwaga Astry | Rozstrzygnięcie |
|---|---|
| K1 wycięcie tuby usuwało podkładki osi M2 | podkładki dodawane po wycięciu wnętrza tuby; na siatce: lico x ±35,7, dno otworu x ±38,1 |
| K2 brak docisku gałki do piasty (0,2 mm luzu) | podłoga rowka T 5,5 mm; M5 × 12 wchodzi w piastę na 6,5 z 7 mm. Montaż: piastę docisnąć do stożka, łeb do podłogi i **trzymając docisk** dokręcić M4. Obrót gałki na czopie blokuje tarcie zaciśniętej podłogi; do sprawdzenia ręką na stole |
| W1 kontrola kolizji niepełna | poprawione położenie wieżyczki i orczyka S3 (zamienione x/z), dolna powieka z solvera, pary stałe dwustronnie, zagęszczenie co 1° wokół minimum drutów S1/S2. Bez zmian: końcówki Z, ogony i kardan nie są w modelu kontroli; strefę ucha sprawdza próbka |
| W2 drut S1–blaszka ucha 0,14 | dolna krawędź blaszki 1,2 pod otworem (było 1,5), płaski odcinek 5,5 mm. **Zostaje 0,42 mm** (θ 35°, φ −12°, zagęszczenie co 1°) 2,3 mm od otworu, pod krawędzią blaszki. Tabela wymaga 0,5. Krawędzi nie da się podnieść bez odsłonięcia talii klepsydry (zostałoby 0,15 mm materiału). To strefa kolanka Z, gdzie prosty model drutu z osi otworu jest przybliżeniem; **rozstrzyga próbka 1:1** (ta sama blaszka). Jeśli drut ociera: pilnikiem 0,3 mm z dolnej krawędzi blaszki za otworem |
| W3 instrukcja: zero S3 i kierunek −6° | zero S3 przy powiekach otwartych do połowy (zamknięcie ok. +23°, otwarcie ok. −25°); orczyki S1/S2 obrócone o 6° do tyłu |
| W4 luzy drutu w otworach | dźwignie i orczyki S1/S2 Ø1,4, orczyk S3 Ø2,4 (0,2 na stronę) |
| W5 mosty w Uchwycie | opisane w README druku (13,1 i 10,5 mm, zwis zebrać nożykiem) |
| D1 powieki bez płaskiej podstawy | stopki 0,6 mm pod uszami |
| D2 stare długości drutów w raporcie | poprawione (wyżej) |

**Weryfikacja Astry po poprawkach** (`20-analizy/review/2026-10-25-astra-weryfikacja-v2.md`): K1, K2, W3, W4, W5, D1 i D2 zamknięte. Otwarte zostały:
- **W1:** kontrola kolizji nie modeluje kolanek Z, kardana ani kabli. Zagęszczenie miało błąd we wzorcu; poprawione i przeliczone ręcznie wokół minimum S1.
- **W2:** 0,42 mm (wyżej).
- **Próbka nie odwzorowywała ucha:** poprawione, teraz ma blaszkę 1:1 ze szczeliną.

## Parametryczność i test zginania (wymaganie użytkownika przez PM)

Sekcja zmiennych w `duze-oko-v2.scad` ma 3 części:
- **BAZOWE:** części kupne, luzy z AGENTS.md, Rg, otwór Ø80, ścianka dyni oraz decyzje jako odstępy, kąty i rozmiary;
- **POCHODNE:** wszystkie położenia, liczone z bazowych, z dzisiejszą wartością w komentarzu;
- **GRANICE:** asercje, które przerywają model poza zakresem konstrukcji.

Skrypty kinematyki i kolizji biorą całą geometrię z modelu (`parametry.json` z echa SCAD), łącznie z bryłami zastępczymi i średnicą drutu. Bez tego pliku nie startują.

**Test zginania:** `40-cad/openscad/zginanie.sh` + `zginanie-werdykt.sh`, pełne wyniki w `40-cad/openscad/zginanie-v2.txt`. Każdy wariant przechodzi:
- eksport 6 części;
- kontrolę siatek (szczelność, 1 bryła na część);
- solver;
- kontrolę kolizji (5 × 5 pozycji gałki z zerem i krańcami, 7 pozycji powiek).

| Wariant | Przeliczenie | Dowód (wymiary brył z siatek, kinematyka) | Luzy wobec tabeli |
|---|---|---|---|
| bazowy (Rg 30, ścianka 40, luzObr 0,2, drut 1,0), kolizje krok 10° (9 × 7 z zerem) | ZALICZONY | Gałka 38, Pierścień 46, Uchwyt 56,25, Maskownica 2 (= oczekiwane); S1 −42…+38°, S2 −46…+40° | niespełnione: drut S1–gałka 0,42 |
| Rg 29 | ZALICZONY | druty S1/S2/powieki 40,9 / 41,9 / 43,6 (bazowo 41,9 / 42,9 / 44,6) | niespełnione: drut S1 0,40, drut S2 0,44 |
| Rg 30,5 | **POZA ZAKRESEM** | asercja: zakładka ramię dolnej powieki–czasza 0,71 < 1,0 | – |
| Rg 31 | **POZA ZAKRESEM** | asercja: zakładka −1,0 (ramię odrywa się od czaszy) | – |
| ścianka 28 | ZALICZONY | Pierścień 34, Uchwyt 59 (ramiona wyższe od słupka) | niespełnione: drut S1 0,42 |
| ścianka 50 | ZALICZONY | Pierścień 56, Uchwyt 56,25 | niespełnione: drut S1 0,42 |
| luzObr 0,3 | ZALICZONY | luzy osi powiek 0,28–0,30, otwory osi Ø2,6, drutu Ø1,6 | niespełnione: drut S1 0,42 |
| drut Ø1,2 | ZALICZONY | obwiednia drutów +0,1 | niespełnione: drut S1 0,35; druty powiek 0,38 |

**Wnioski:**
- Model przelicza się w całym zakresie ścianki 28–50, przy luzach 0,2–0,3 i drucie 1,0–1,2.
- **Granica Rg:** przy otworze Ø80 i zakładce ramienia ≥ 1,0 mm gałka może mieć najwyżej Rg ≈ 30,4. PRD wymaga Ø60, więc zapas wynosi 0,4 mm na promieniu.
- **Drut Ø1,2** (użytkownik ma taki) zmniejsza zapas przy uchu S1 do 0,35, więc zostajemy przy Ø1,0.
- Jedyny niespełniony luz we wszystkich wariantach to drut S1 przy uchu gałki. Rozstrzyga go próbka (patrz niżej).

**Review Astry parametryczności** (`20-analizy/review/2026-10-25-astra-parametry-v2.md`):
- **K1** (rozpad części przy Rg 31 przechodził jako „gotowe”): asercje GRANICE i werdykt POZA ZAKRESEM.
- **W1** (liczby w skryptach): bryły zastępcze, promień drutu i skok pochodzą z parametrów; kinematyka bez `parametry.json` się nie uruchamia.
- **W2** (skok, dolna powieka): z parametrów i solvera.
- **W3** (siatka bez zera, obcięte wyniki): siatka symetryczna z zerem, pełne wyniki, werdykty.
- **W4** (`dOsM2`): liczony z `dM2 + 2·luzObr`.
- **W5** (plan Onshape): poprawiona formuła rowka. Layout, więzy i testy wymiarowe są wpisane jako lista do uzupełnienia przy przenoszeniu.
- **D1:** położenia próbki liczone z marginesu i odstępów.
- **D2:** podgląd bez liczb.
- **Bez zmian:** kontrola kolizji nadal nie modeluje kolanek Z, pełnego kardana i kabli; strefę ucha rozstrzyga próbka.

## Pełne review Astry przed drukiem (kamień 5)

Plik: `20-analizy/review/2026-10-25-astra-pelne-v2.md`. Astra niezależnie potwierdziła: siatki 0 błędów, 1 bryła na część, wszystko mieści się na A1 mini, długości drutów i kąt Z S2 zgodne z kinematyką, szczeliny powiek zgodne z tabelą.

| Uwaga | Rozstrzygnięcie |
|---|---|
| **K1** kontrola kolizji to uproszczenie: bez kolanek Z, pełnego kardana, kabli i dróg montażu; druty S3 w jednym punkcie | **Rozstrzygnięte podziałem ryzyka** (do rana nie zamodeluję tego wiarygodnie): kolanka Z i ucho sprawdza próbka 1:1 (rozszerzony test niżej); kardan, kable, wsuwanie i 2 druty w orczyku S3 sprawdza **montaż na stole przed dynią** (instrukcja, kroki 2–7): ruch ręką w całym zakresie przed włożeniem serw, potem serwami przy 1500 µs i krańcach. Orczyki są teraz w kontroli w pełnej długości (`dlOrcz` 20 mm). Wynik „0 przenikań” dotyczy brył drukowanych, korpusów serw, orczyków i drutów jako odcinków |
| W1 drut S1–gałka 0,42 < 0,5 | otwarte, rozstrzyga próbka (dolna krawędź blaszki ucha 1:1); obróbka podana w teście próbki |
| W2 ±35° to za mało dla końcówek | test próbki: **≥ 40°** w kierunkach narożnych (S1 wymaga 38,4°, S2 38,1°), oba typy Z (S1 90°, S2 75°), kontakt korpusu i ogona z blaszką |
| W3 orczyki w kontroli skrócone | kontrola używa pełnego orczyka jednoramiennego (koniec 20 mm od osi) |
| W4 „ZALICZONY” ≠ luzy spełnione | werdykt rozdzielony: PRZELICZENIE (ZALICZONY / NIEZALICZONY / POZA ZAKRESEM) i LUZY (SPEŁNIONE / NIESPEŁNIONE z progami z tabeli) |
| W5 brak pomiaru wymiarów brył | `wymiary_siatki.js`: wysokości Gałki, Pierścienia, Uchwytu i Maskownicy porównane z oczekiwanymi z parametrów w każdym wariancie |
| D1 niedziałające wywołanie w instrukcji | poprawione (`parametry.json` z `eksport.sh`) |
| D2 długość wkrętu M2 | rozdzielone: 6,0 pod łbem, 7,6 całkowita |

## Przyrząd do gięcia drutów i plik zbiorczy (zgłoszenie użytkownika 25.10, przez PM)

- **Zbiorczy 3MF:** OpenSCAD zlewał wszystkie części w jedną siatkę. Teraz plik składa `40-cad/narzedzia/zbiorczy_3mf.js` z pojedynczych 3MF: **8 osobnych obiektów** nazwanych jak części, rozstawionych co 10 mm, siatki 0 błędów. Potwierdziła to też Astra.
- **Przyrząd do gięcia** (`Przyrzad do giecia drutow.3mf`, 65,6 × 56 × 6, druk razem z próbką): 4 tory S1, S2, PG, PD (PG = PD). Długości i kąty są liczone w SCAD z tych samych zmiennych co ruch. Koniec B i oba końce S2 mają cały Z w rowkach (odcinek „przez” + ogon równoległy do korpusu). Końce prostopadłe (S1 i powieki od strony gałki) mają otwór z dnem 4,5 / 4,0 mm pod osią drutu. Instrukcja: `duze-oko-v2-montaz.md`, „Gięcie drutów na przyrządzie”. Rysunek SVG jest przerysowany w układzie przyrządu.
- **Review Astry** (`2026-10-25-astra-przyrzad-v2.md` i `-weryf.md`):
  - K1 (PD lustrzany zamiast obróconego) zamknięte;
  - W3, W4 i D1 poprawione w modelu i na rysunku;
  - W1 (rzeczywisty promień zagięcia kombinerkami) i W2 (sprężynowanie, zużycie rowka) rozstrzyga próbne gięcie: instrukcja każe przeginać 5–10°, kontrolować drut w torze bez dociskania i oglądać zużycie przyrządu.
  
  Werdykt Astry: **przyrząd można drukować razem z próbką**.

## Założenia przyjęte bez użytkownika

- **Osie powiek: M2 × 6, wkręcane w ciasny otwór Ø1,7 w podkładce, bez nakrętki** (na nakrętkę nie ma miejsca). Najkrótsza M3 (× 8) z łbem 2,45 nie mieści się w 9,5 mm między gałką a OD tuby. **Do sprawdzenia rano:** użytkownik napisał 24.10 tylko „zakładam, że mam śruby… pewno M2 × 6, które doskonale te serwa mocują”, a to nie jest potwierdzenie. **Zapas:** wkręt fabryczny MG90S (samogwintujący ok. M2) w ten sam otwór, bo łeb ok. Ø4 × 1,5 mieści się w pogłębieniu Ø4,2 × 1,6. Długość wkrętu **pod łbem** 6,0 ± 0,3 (od spodu łba na x 32,1 do dna otworu na x 38,1; całkowita z łbem 7,6). Jeśli jest inna, zmienić `glPadM2` i przedrukować tylko Pierścień.
- **Łby M5 krzyżakowe Ø9,5 × 3,5**, jak M3 użytkownika. Rowek T w gałce mieści łeb do 3,9 mm wysokości. Imbusowa DIN 912 (5 mm) się nie zmieści.
- M5 × 12 (czop przedni), M5 × 16 (tylny), M4 z oryginalnych wkrętów kardana.
- Obrót gałki na przednim czopie blokuje tylko tarcie (podłoga zaciśnięta między piastą a łbem M5). Jeśli gałka się obraca, to zmiana na rano: kropla kleju na łbie albo wpust w podłodze.
- Ścianka dyni 40 mm (zmienna `scianka`, zakres 28–50).
- Źrenica Ø10, tęczówka Ø24.
- MG90S według rysunku Miuzei (ucha 18–20 nad spodem, wałek na 35, oś 5,5 od czoła, wycięcia co 27,7). Mocowanie fabrycznymi wkrętami (brief).

## Do decyzji rano

1. **Rano: przeniesienie do Onshape.** Użytkownik zakłada dokument „Duże oko v2”, a projektant przenosi model według planu i zmiennych (`40-cad/onshape/duze-oko-v2-plan.md`, sekcja 7: operacje Onshape i zmienne każdej części). Do tego czasu drukujemy z eksportu SCAD (decyzja użytkownika 25.10, przez PM).

## Gotowość do druku

- **Próbka drutu: gotowa do druku teraz** (werdykt Astry z pełnego review).
- **Pozostałe części: gotowe pod warunkiem**, że próbka przejdzie test niżej (ucho, kolanka Z, ≥ 40° po skosie). Uwag KRYTYCZNYCH bez rozstrzygnięcia nie ma: K1 pełnego review jest rozstrzygnięte podziałem ryzyka (próbka + montaż na stole).
- Jeśli próbka wymaga obróbki ucha: wynik (np. zebrane 0,3 mm) wpisać do `uchoDol` albo `dTalia`, `bash eksport.sh`, dopiero potem drukować gałkę.

## Kolejność druku na A1 mini (PLA, warstwa 0,2, 3 obrysy)

Pliki w `40-cad/3mf/Duze oko v2/`. Szczegóły orientacji i podpór są w `40-cad/openscad/duze-oko-v2-montaz.md`.

| # | Część | Kolor | Podpory | Uwagi |
|---|---|---|---|---|
| 1 | **Próbka drutu + Przyrząd do gięcia drutów** | dowolny | brak | razem na jednym stole, ok. 30 min; gięcie: `40-cad/openscad/duze-oko-v2-montaz.md`, sekcja „Gięcie drutów na przyrządzie” |
| 2 | Gałka | biały | 1 drzewiasta pod stożkiem w środku (malowana) | rowek T i ucha bez podpór |
| 3 | Powieka górna, Powieka dolna | pomarańcz | drzewiaste pod wewnętrzną stroną czaszy (od stołu) | stopki uszu na stole |
| 4 | Maskownica | pomarańcz | brak | płasko |
| 5 | Pierścień | pomarańcz | brak | **dopiero po zmierzeniu ścianki dyni**: `scianka` w SCAD, `bash eksport.sh` (dozwolone 28–50) |
| 6 | Uchwyt serw | pomarańcz | brak | po zmierzeniu ścianki (długość ramion); mosty 13,1 i 10,5 mm |

## Próbka drutu: co sprawdzić (rozstrzyga ucho gałki)

1. **Przygotowanie:**
   - rozwiercić talię klepsydry Ø1,7 (blaszka ucha), otwór żebra B Ø1,4 i otwór w płytce Ø2,4;
   - wygiąć drut S1 i S2 na przyrządzie (odcinek przez otwór 2,5 mm, ogon 2 mm).
2. **Ucho (blaszka z klepsydrą):** korpus drutu po jednej stronie blaszki, przechyl drut o **≥ 40°** w obu płaszczyznach i **po skosie** (narożnik: oba kierunki naraz). Sprawdzić oba typy Z: S1 (zagięcia 90°) i S2 (75°, rysunek drutów). Drut ma chodzić **bez klinowania i bez ocierania** o dolną krawędź blaszki (1,2 mm pod otworem); korpus przechodzi pod nią przez szczelinę w płytce.
   - Jeśli ociera: pilnikiem zebrać 0,3 mm z dolnej krawędzi za otworem i to samo zrobić w gałce.
   - Jeśli klinuje w otworze: rozwiercić talię na Ø1,9.
3. **Dźwignia (żebro B, Ø1,4):** drut obraca się luźno, bez luzu > 0,5 mm.
4. **Otwór Ø2,4:** dwa druty Z wchodzą z dwóch stron i oba obracają się swobodnie (jak w orczyku S3).
5. Zapisać wynik w `70-budowa/dziennik.md`. Wymiary po rozwierceniu, które pasują, wpisać do zmiennych (`dTalia`, `dDrut`, `luzObr`).
