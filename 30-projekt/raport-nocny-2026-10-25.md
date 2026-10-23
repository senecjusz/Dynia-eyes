# Raport nocny 24/25.10 – duże oko, krok 2

Projektant dużego oka. Zlecenie: `30-projekt/brief-duze-oko-krok2-cad.md`. Raport aktualizowany przy każdym kamieniu.

## Najważniejsze na rano

1. **Onshape: nie powstał dokument „Duże oko v2”.** Uprawnienia mojej sesji zablokowały utworzenie nowego publicznego dokumentu (`POST /documents`, `isPublic: true`, plan Free; klasyfikator: „Create Public Surface”). Nie obchodziłem tej blokady. **Model zbudowałem parametrycznie w OpenSCAD** (zainstalowany na Windows): `40-cad/openscad/duze-oko-v2.scad`, zmienne na górze pliku, eksport 3MF skryptem `40-cad/openscad/eksport.sh`. Onshape da się odtworzyć później z tego pliku i planu (decyzja niżej).
2. **Próbka drutu do druku:** `40-cad/3mf/Duze oko v2/Probka drutu.3mf` (34 × 10 × 8, ok. 10 min). Opis testu w punkcie „Co wydrukować najpierw”.

## Kamienie

| # | Kamień | Stan | Commit |
|---|---|---|---|
| 1 | Próbka końcówki drutu | gotowa (3MF, siatka OK) | 98e5fdb |
| 2 | Plan szczegółów + Astra | plan `40-cad/onshape/duze-oko-v2-plan.md`, review Astry `20-analizy/review/2026-10-25-astra-plan-v2.md` (3 krytyczne, 7 ważnych); poprawki w modelu (niżej) | 98e5fdb |
| 3 | CAD | OpenSCAD zamiast Onshape (pkt 1 wyżej): osobny moduł na część, wszystkie liczby jako zmienne na górze pliku | (ten commit) |
| 4 | Eksport 3MF + kontrola siatek | 7 części + zbiorczy w `40-cad/3mf/Duze oko v2/`: wszystkie szczelne, 0 błędów po naprawie (CGAL zostawił 10–52 zdegenerowane trójkąty w powiekach i zbiorczym), każda część = 1 bryła, zbiorczy = 7 | (ten commit) |
| 5 | Astra na siatkach | – | – |
| 6 | Druty: rysunek 1:1 | `40-cad/druty/duze-oko-v2-druty-1do1.svg` (L: S1 40,4, S2 41,4, powieki 2 × 44,6) | ebb1030 |
| 7 | Instrukcja montażu i README druku | `40-cad/openscad/duze-oko-v2-montaz.md` | ebb1030 |

## Rozstrzygnięcia z Astrą (plan)

| Uwaga Astry | Rozstrzygnięcie |
|---|---|
| K1 klepsydra Ø1,2 × 0,4 → tylko 19° przechyłu | talia **Ø1,7 × 0,3**, stożki 45° (wylot Ø3,4 przy żebrze 2 mm): warunek 1/cos φ + 0,3 tan φ ≤ 1,7 daje ok. 44°. Otwór 2,5 nad stołem, tak że za otworem zostaje tylko 0,8 mm żebra. Próbka sprawdza to na realnym drucie |
| K2 stożek piasty zaczyna się w powietrzu | zgoda. **Jedna podpora drzewiasta pod wierzchołkiem stożka** (wewnątrz gałki, zdejmowana przez tylny otwór Ø57). Najniższy punkt w osi budowany od krawędzi pod 45° to z = 18,8, a piasta ma czoło na 12,75, więc bez podpory się nie da |
| K3 ramiona powiek mogą się przeciąć | ramię dolnej to sektor −61…−11° (górnej 11…61°), r 4,5…11,5 (ograniczone, żeby nie dotykać tuby). Wynik w kontroli kolizji |
| W1 kąty serw ze stałej długości drutu | solver `40-cad/narzedzia/duze-oko-kinematyka.js`. S1: orczyk r 17,5, środek −6°, serwo **−47…+44°**. S2: r 13,5, −6°, **±50°**. Cała siatka ±35° × ±25° (narożniki też) osiągalna |
| W2 narożniki | jak wyżej, osiągalne (sprzężenie osi do ok. 10° na S1, do skompensowania w programie) |
| W3 asymetria powiek na wspólnym otworze | S3 z **wałkiem pionowym**: otwór orczyka porusza się w płaszczyźnie y = 0, więc dla obu dźwigni układ jest symetryczny. Solver: przy otwarciu górnej o 51,5° dolna otwiera się o 51,26°, zamknięcie −0,23° |
| W4 luz między powiekami 0,5 – 2 × 0,2 = 0,1 | dolna R 33,4 (szczelina **0,7**). Dźwignie r 7 (ogon Z ma 0,64 do tuby) |
| W5 luz osiowy M2 | otwór w podkładce **ślepy, głębokość 2,4**: M2 × 6 wkręcona do dna daje łeb w x 32,1, czyli 0,2 luzu do ucha |
| W6 kolejność montażu | w instrukcji (kamień 7) |
| W7 źrenica | założenie: **źrenica Ø10** w tęczówce Ø24. Przy otwarciu 50° i spojrzeniu 25° zapas 15,4° |
| D1 maskownica | Ø79,0 na tubę Ø79 (wcisk 0; druk zwęża otwór). Dopasować po wydruku |
| D2 wylot klepsydry | liczony z kąta (Ø3,4) |

## Założenia przyjęte bez użytkownika

- **Osie powiek: M2 × 6, wkręcane w ciasny otwór Ø1,7 w podkładce, bez nakrętki** (na nakrętkę nie ma miejsca). Najkrótsza M3 (× 8) z łbem 2,45 nie mieści się w 9,5 mm między gałką a OD tuby. **Do sprawdzenia rano:** użytkownik napisał 24.10 tylko „zakładam, że mam śruby… pewno M2 × 6, które doskonale te serwa mocują”, a to nie jest potwierdzenie. **Zapas:** wkręt fabryczny MG90S (samogwintujący ok. M2) w ten sam otwór, bo łeb ok. Ø4 × 1,5 mieści się w pogłębieniu Ø4,2 × 1,6. Długość wkrętu do dna otworu musi wynosić 7,6 ± 0,3 (od łba do dna). Jeśli jest inna, zmienić `glPadM2` i przedrukować tylko Pierścień.
- **Łby M5 krzyżakowe Ø9,5 × 3,5**, jak M3 użytkownika. Rowek T w gałce mieści łeb do 3,9 mm wysokości. Imbusowa DIN 912 (5 mm) się nie zmieści.
- M5 × 12 (czop przedni), M5 × 16 (tylny), M4 z oryginalnych wkrętów kardana.
- Ścianka dyni 40 mm (zmienna `scianka`, zakres 28–50).
- Źrenica Ø10, tęczówka Ø24.
- MG90S według rysunku Miuzei (ucha 18–20 nad spodem, wałek na 35, oś 5,5 od czoła, wycięcia co 27,7). Mocowanie fabrycznymi wkrętami (brief).

## Do decyzji rano

1. **Onshape czy SCAD?** Albo zakładasz dokument „Duże oko v2” w Onshape i przenoszę do niego model, albo zostajemy przy OpenSCAD (`40-cad/openscad/duze-oko-v2.scad`). Moja propozycja: SCAD do Halloween.

## Co wydrukować najpierw

1. **Próbka drutu** (`Probka drutu.3mf`, PLA, 0,2 mm, bez podpór). Rozwiercić talię żebra A wiertłem Ø1,7, a otwór żebra B wiertłem Ø1,2. Wygiąć Z z drutu Ø1,0 (ogon ≤ 2 mm) i sprawdzić ręką, czy drut w żebrze A przechyla się swobodnie o ±35° w obu płaszczyznach. Na żebrze B wystarczy luźny obrót. Otwór Ø2,1: dwa druty Z wchodzą z dwóch stron.
