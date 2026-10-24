# Raport nocny 24/25.10 – duże oko, krok 2

Projektant dużego oka. Zlecenie: `30-projekt/brief-duze-oko-krok2-cad.md`. Raport aktualizowany przy każdym kamieniu.

## Najważniejsze na rano

1. **Onshape: nie powstał dokument „Duże oko v2”.** Uprawnienia mojej sesji zablokowały utworzenie nowego publicznego dokumentu (`POST /documents`, `isPublic: true`, plan Free; klasyfikator: „Create Public Surface”). Nie obchodziłem tej blokady. **Model zbudowałem parametrycznie w OpenSCAD** (zainstalowany na Windows): `40-cad/openscad/duze-oko-v2.scad`, zmienne na górze pliku, eksport 3MF skryptem `40-cad/openscad/eksport.sh`. Onshape da się odtworzyć później z tego pliku i planu (decyzja niżej).
2. **Próbka drutu do druku:** `40-cad/3mf/Duze oko v2/Probka drutu.3mf` (34 × 12 × 8, blaszka ucha 1:1 jak w gałce, ok. 10 min). Opis testu w punkcie „Co wydrukować najpierw”.

## Kamienie

| # | Kamień | Stan | Commit |
|---|---|---|---|
| 1 | Próbka końcówki drutu | gotowa (3MF, siatka OK) | 98e5fdb |
| 2 | Plan szczegółów + Astra | plan `40-cad/onshape/duze-oko-v2-plan.md`, review Astry `20-analizy/review/2026-10-25-astra-plan-v2.md` (3 krytyczne, 7 ważnych); poprawki w modelu (niżej) | 98e5fdb |
| 3 | CAD | OpenSCAD zamiast Onshape (pkt 1 wyżej): osobny moduł na część, wszystkie liczby jako zmienne na górze pliku | a4017f6, fe62019, 566001b, b8a48b7 |
| 4 | Eksport 3MF + kontrola siatek | 7 części + zbiorczy w `40-cad/3mf/Duze oko v2/`: wszystkie szczelne, 0 błędów po naprawie (CGAL zostawia pojedyncze zdegenerowane trójkąty, `eksport.sh` naprawia je automatycznie), każda część = 1 bryła, zbiorczy = 7 | 566001b, b8a48b7 |
| 5 | Kontrola kolizji + Astra na siatkach | kolizje `40-cad/openscad/kolizje-v2.txt`: gałka 8 × 6 pozycji ±35°/±25° z narożnikami (+ zagęszczenie co 1° wokół minimum drutów), powieki 7 pozycji (dolna z solvera), kąty serw z solvera. **0 przenikań.** Najmniejsze odstępy: styki montażowe 0,00; luzy osi powiek 0,18–0,20 (projektowe); drut S1–gałka 0,42 (zagęszczenie, opis w W2 niżej); reszta ≥ 0,5. Astra `20-analizy/review/2026-10-25-astra-siatki-v2.md`: 2 krytyczne, 5 ważnych, 2 drobne; wszystkie poprawione (tabela niżej) | 566001b, b8a48b7 |
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

## Założenia przyjęte bez użytkownika

- **Osie powiek: M2 × 6, wkręcane w ciasny otwór Ø1,7 w podkładce, bez nakrętki** (na nakrętkę nie ma miejsca). Najkrótsza M3 (× 8) z łbem 2,45 nie mieści się w 9,5 mm między gałką a OD tuby. **Do sprawdzenia rano:** użytkownik napisał 24.10 tylko „zakładam, że mam śruby… pewno M2 × 6, które doskonale te serwa mocują”, a to nie jest potwierdzenie. **Zapas:** wkręt fabryczny MG90S (samogwintujący ok. M2) w ten sam otwór, bo łeb ok. Ø4 × 1,5 mieści się w pogłębieniu Ø4,2 × 1,6. Długość wkrętu do dna otworu musi wynosić 7,6 ± 0,3 (od łba do dna). Jeśli jest inna, zmienić `glPadM2` i przedrukować tylko Pierścień.
- **Łby M5 krzyżakowe Ø9,5 × 3,5**, jak M3 użytkownika. Rowek T w gałce mieści łeb do 3,9 mm wysokości. Imbusowa DIN 912 (5 mm) się nie zmieści.
- M5 × 12 (czop przedni), M5 × 16 (tylny), M4 z oryginalnych wkrętów kardana.
- Obrót gałki na przednim czopie blokuje tylko tarcie (podłoga zaciśnięta między piastą a łbem M5). Jeśli gałka się obraca, to zmiana na rano: kropla kleju na łbie albo wpust w podłodze.
- Ścianka dyni 40 mm (zmienna `scianka`, zakres 28–50).
- Źrenica Ø10, tęczówka Ø24.
- MG90S według rysunku Miuzei (ucha 18–20 nad spodem, wałek na 35, oś 5,5 od czoła, wycięcia co 27,7). Mocowanie fabrycznymi wkrętami (brief).

## Do decyzji rano

1. **Rano: przeniesienie do Onshape.** Użytkownik zakłada dokument „Duże oko v2”, a projektant przenosi model według planu i zmiennych (`40-cad/onshape/duze-oko-v2-plan.md`, sekcja 7: operacje Onshape i zmienne każdej części). Do tego czasu drukujemy z eksportu SCAD (decyzja użytkownika 25.10, przez PM).

## Co wydrukować najpierw

1. **Próbka drutu** (`Probka drutu.3mf`, PLA, 0,2 mm, bez podpór, ok. 10 min).
   - Rozwiercić talię żebra A wiertłem Ø1,7, otwór żebra B Ø1,4, otwór w płytce Ø2,4.
   - Wygiąć Z z drutu Ø1,0 (ogon ≤ 2 mm) i sprawdzić ręką, czy drut w żebrze A przechyla się swobodnie o ±35° w obu płaszczyznach. Korpus drutu przechodzi przy tym pod krawędzią 1,2 mm pod otworem, jak w gałce.
   - Żebro B: luźny obrót.
   - Otwór Ø2,4: dwa druty Z wchodzą z dwóch stron.
2. **Pierścień i Uchwyt** dopiero po zmierzeniu ścianki dyni (`scianka`). **Gałka i powieki** niezależnie od dyni.
