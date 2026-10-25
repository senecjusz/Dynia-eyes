# Review: połączenie drutu z gałką – Z przez blaszkę / oczko na M3 (krytyk Opus)

24.10.2026, tylko odczyt. Oceniane: `20-analizy/2026-10-24-duze-oko-ucho-oczko-m3.md` wobec `duze-oko-v2.scad` (stan roboczy: `uchoDol` 2,6, `katOsiS2` 14,9°) i parametrów `duze-oko-v2-parametry.json`.
Oznaczenia: **[P]** wynik skryptu / przemiatania, **[O]** obliczenie, **[Z]** założenie.
Kierunki drutu w układzie gałki: siatka θ ±35° × φ ±25° co 5°, długość stała, kąt orczyka z solvera (jak w `duze-oko-katy-przegubow.js`).

## W skrócie

- Wniosek „Z przez blaszkę nie przejdzie” jest poprawny (K1).
- Oczko na M3 zapewnia potrzebny przechył, ale tylko dzięki luzowi: Ø5 → 2 mm, Ø6 → 3 mm luzu średnicowego. Daje to **5,6° / 8,4° histerezy spojrzenia** (K2). To główny koszt wariantów B/C, którego koncepcja nie liczy.
- Potrzebny przechył zależy od kierunku sworznia. Kierunek ze szkicu nie jest najlepszy: dla S2 sworzeń ∥ y potrzebuje ±25,8° zamiast ±38° (W1).
- Mniejszy luz przy tym samym przechyle daje cieńszy sworzeń: luz ≈ 0,5 × (d + 1) przy 48°. Sworzeń Ø1 (drut) zamiast Ø3 (M3) daje połowę luzu (wariant D, do próby).

## KRYTYCZNE

**K1. Z przez blaszkę w płaszczyźnie (x, z) – wniosek poprawny.** [O] [P]
- Kąt drutu względem osi otworu S1 (oś ∥ y) zmienia się od −38,4° do +27,5°, więc korpus przechodzi przez płaszczyznę blaszki raz w jedną, raz w drugą stronę.
- Żeby korpus po stronie A nie wszedł w blaszkę, naroże musi stać co najmniej c ≥ (½ blaszki + ½ drutu + luz) + s·tg γ od środka blaszki. s to droga w płaszczyźnie do krawędzi blaszki pod otworem: przy `uchoDol` 2,6 i kierunku (0,64; −0,62) w płaszczyźnie s ≈ 3,7 mm. γ to kąt drutu w stronę blaszki.
  - γ 27,5° → c ≥ 1,5 + 1,9 = **3,4 mm**;
  - γ 38,4° → c ≥ 1,5 + 2,9 = **4,4 mm**.
  - Faktycznie c ≈ 1,5 mm (naroże przy ściance). Wychodzi −1,9…−2,9 mm, w modelu projektanta −0,90 (inne s).
- Dłuższy środek Z nie pomaga: przy kącie korpusu do nogi < 90° ciągnięcie drutu ma składową wzdłuż nogi F·cos(kąt), która dociąga naroże do blaszki. Odstęp c nie jest więc zachowany pod obciążeniem.
- Przy `uchoDol` 1,2 przemiatanie (krok 10°, korpus prosty od punktu przesuniętego o 2 mm) dawało +0,16 mm, ale wtedy pod otworem jest 0,35 mm materiału. Obie wersje odpadają. Pewność: wysoka.

**K2. Oczko na M3: luz średnicowy = histereza spojrzenia.** [O]
- Oczko o średnicy wewnętrznej D na trzpieniu Ø d ma luz D − d wzdłuż korpusu. Przy zmianie kierunku siły (pchanie ↔ ciągnięcie) drut przesuwa się o cały luz.
- Ramię ucha od osi obrotu ok. 20,4 mm:
  - Ø5 na M3: 2,0 mm → **5,6°** (±2,8° wokół zera);
  - Ø6 na M3: 3,0 mm → **8,4°** (±4,2°).
  - Dla porównania Z w klepsydrze (talia Ø1,7, drut Ø1): 0,7 mm → 2,0°.
- Luz osiowy, który oczko potrzebuje do przechyłu, daje mniej, bo przy pełnym przechyle obrzeże oczka dotyka obu stron. Największy iloczyn „luz × sin przechyłu” wychodzi ok. R·sin²T/2: Ø5 przy 38° → 0,66 mm → **±1,9°**.
- Gałka na kardanie jest prawie wyważona [Z], więc luzu nic nie wybiera. Przy każdej sakadzie gałka zatrzyma się w innym miejscu w zakresie histerezy, a przy zmianie kierunku słychać stuk.
- To zmienia jakość ruchu, a nie konstrukcję, więc decyzja, czy ±3–4° jest do przyjęcia, należy do użytkownika (niżej). Pewność: wysoka co do liczb.

## WAŻNE

**W1. Kierunek sworznia: najmniejszy potrzebny przechył.** [P]

| Ucho | Oś sworznia | Zakres kąta drutu do płaszczyzny ⟂ osi | Połowa (po wyśrodkowaniu) |
|---|---|---|---|
| S1 | ∥ y (styczna, jak dziś otwór) | −38,4…+27,5° | ±32,9° (środek −5,5°) |
| S1 | ∥ x (promieniowa) | −31,8…+44,5° | ±38,2° (środek +6,4°) |
| S2 | ∥ x pochylona 14,9° (szkic) | ok. ±38° | ±38° |
| S2 | **∥ y (promieniowa)** | −24,6…+27,0° | **±25,8°** |
| obie | najlepsza (≈ wzdłuż z) | — | ±21,7° przy środku 65° – niepraktyczna |

- Do tego ±10° na płaszczyźnie oczka względem korpusu (gięcie ręczne, W3 użytkownika). Po doginaniu na miejscu realnie ±5° [Z].
- Wymagany przechył:
  - S1 ∥ y: 38–43°;
  - S1 ∥ x: 43–48°;
  - S2 ∥ y: 31–36°.
- Wyśrodkowanie, czyli płaszczyzna oczka obrócona o −5,5° / +6,4° względem korpusu, mieści się w tolerancji gięcia i nie wymaga osobnego kroku.

**W2. Przechył oczka – wzór i wyniki.** [O]
- Dla drutu okrągłego (przekrój oczka to dwa koła Ø d_w w odległości D + d_w): oczko przechyla się, dopóki **(D/2 + d_w/2)·cos T − d_w/2 ≥ d/2**, czyli cos T ≥ (d + d_w)/(D + d_w).
- Wzór projektanta (D·cos T − d_w·sin T ≥ d) jest bardziej zachowawczy niż koła, a mniej zachowawczy niż realny zwój: zwój zwijany ręcznie ma zakładkę, czyli w miejscu końca grubość ≈ 2·d_w.

| Oczko na trzpieniu | Drut okrągły | Zwój z zakładką (2·d_w) | Wzór projektanta | Luz D − d |
|---|---|---|---|---|
| Ø5 na Ø3 (gwint) | 48,2° | **39,4°** | 42,6° | 2,0 |
| Ø6 na Ø3 | 55,2° | **47,4°** | 50,9° | 3,0 |
| Ø5 spłaszczone do 4,5 | 43,3° | 34,0° | 36,8° | 1,5 |
| Ø6 spłaszczone do 5,5 | 52,0° | 43,7° | 47,2° | 2,5 |
| Ø5 na rdzeniu 2,4 (zużyty gwint) | 55,5° | 46,5° | 50,6° | 2,6 |

- Oczko zwinięte na trzpieniu M5 po zdjęciu sprężynuje i wychodzi ok. 5,2–5,5 [Z], na wiertle Ø6 ok. 6,3–6,6. Przechył rośnie, luz też.
- Liczyć trzeba na zwój z zakładką: oczko leży na zakładce, a ta jest najgrubsza.
- Wynik: **Ø5 wystarcza tylko dla S2 ∥ y (39 ≥ 31–36). Dla S1 potrzebne Ø6** (47 ≥ 38–43 przy ∥ y; przy ∥ x 47 < 48, na granicy).
- Gwint: oczko jeździ po grzbiecie (Ø3) i wyrabia sobie bruzdę [Z]. Przy rdzeniu 2,4 przechył i luz rosną o 0,6 mm (ostatni wiersz). Lepiej trzpień gładki: M3 dłuższe niż ok. 20 mm często mają część gładką [Z], do sprawdzenia w warsztacie.

**W3. Miejsce w gałce.** [O] (model uproszczony: oczko Ø6 jako pierścień R 4, piasta tylna kardana r 5,5 do z −12,75, słupek r 8 dalej; bez widełek kardana)

| Oczko | Najmniej do kardana / słupka | Największy promień od środka gałki | Najniższe z (rant −8) |
|---|---|---|---|
| S1, sworzeń ∥ y | 2,09 (θ 35°, φ 0) | 24,4 (skorupa wewn. ~27,7 → 3,3) | −8,0 |
| S1, sworzeń ∥ x | 3,79 | 21,5 | −8,0 |
| S2, sworzeń ∥ y | 6,75 | 21,5 | −8,0 |
| S2, sworzeń ∥ x pochylony | 4,59 | 24,4 | −7,9 |

- Oczko sięga rantu (z −8): wystaje do płaszczyzny tylnej gałki, czyli tam, gdzie jest Pierścień i druty. Przy przechyle obrzeże przesuwa się o R·sin T ≈ 3 mm wzdłuż osi sworznia, więc nie mieści się w tym, co liczy przemiatanie samego korpusu. **Oczko i łeb muszą wejść do przemiatania jako bryły** (w `duze-oko-druty-v2-kolizje.js` ich nie ma).
- Rowek T: jest z przodu (z 12,75…22), oczka z ≤ 0 – brak konfliktu.
- Drugie ucho: oczka S1 (x 16–24, y ≈ 0) i S2 (x ≈ 0, y 16–24) są od siebie ponad 15 mm.
- Powieki (R ≥ 31,5): oczko i łeb są w środku gałki (R ≤ 24,4). Łeb wystający na zewnątrz skorupy (R 30 + 3) wszedłby w czaszę górnej powieki (luz 1,5) – nie wolno.
- **Mocowanie i dostęp:**
  - Sworzeń styczny (S1 ∥ y) w kostce przy x 20: do wkręcenia potrzeba wkrętaka wzdłuż y wewnątrz czaszy. Od sworznia do skorupy jest ok. 19 mm, krótkie ramię klucza 2,5 ma ok. 18 mm [Z] – praktycznie się nie da.
  - Sworzeń promieniowy (S1 ∥ x, S2 ∥ y) wchodzi przez skorupę od zewnątrz: łeb stożkowy (DIN 7991) albo walcowy w pogłębieniu zgrubienia skorupy, równo z R 30. Ta część gałki (z ≈ −4) jest w tubie, za osią powiek, niewidoczna. Wkręt dokręcany od zewnątrz, gdy gałka jest zdjęta.
  - Od strony środka: oczko, potem dwie nakrętki M3 skontrowane z luzem osiowym (pojedyncza nakrętka dokręcona zaciśnie oczko). Nakrętki przez otwór tylny palcami. Długość M3: zgrubienie ok. 5 + 8 (do oczka) + 1 + luz 1–4 + 2 × 2,4 ≈ **20–25 mm**.
  - Otwór ciasny Ø2,6 bez nakrętki: wymaga ≥ 6 mm wkręcenia w plastik, a sworzeń na wysięgu 8 mm się wyrobi. Nakrętki wychodzą prościej.
  - Do potwierdzenia w warsztacie: czy są M3 ze łbem stożkowym albo walcowym niskim.
- Wysięg sworznia 8–13 mm przy 2–10 N: σ = F·l/(π·d³/32) ≈ 10·13/2,65 ≈ 50 MPa na rdzeniu – bez problemu.

## DROBNE

- **D1.** Szkic: S2 „sworzeń wzdłuż osi pochylonej o 14,9°” – przy oczku pochylenie traci sens; sworzeń ∥ y (promieniowy) jest lepszy (W1) i prostszy w druku.
- **D2.** „Średnica oczka ±0,5 bez znaczenia” – ma znaczenie: ±0,5 mm średnicy to ±1,4° histerezy (K2) i ±4–5° przechyłu (W2).
- **D3.** Oczko jako pełny zwój: koniec drutu po zwinięciu sterczy i przy przechyle może zaczepić o nakrętkę. Uciąć równo z zakładką.

## Porównanie i prostszy wariant (pyt. 5)

| | A. Z przez blaszkę | B. oczko Ø5 / M3 | C. oczko Ø6 / M3 | D. oczko Ø3 na sworzniu z drutu Ø1 (do próby) |
|---|---|---|---|---|
| Przechył (zwój) | — (kolizja, K1) | 39° – tylko S2 ∥ y | 47° – S1 i S2 | Ø3,2 na Ø1: cos T ≥ 2/4,2 → 61° (drut), ok. 50° (zwój) [O] |
| Luz → histereza | 0,7 → 2,0° | 2,0 → 5,6° | 3,0 → 8,4° | 2,2 → 6,2° przy tym samym D; przy Ø2,5 na Ø1: 1,5 → 4,2°, przechył 49°/40° |
| Części | — | M3 ×20–25 + 2 nakrętki na ucho | jw. | drut ze starych Z jako sworzeń, wsunięty w otwór w zgrubieniu, koniec zagięty |
| Praca | — | zwinąć oczko na M5 | na wiertle Ø6 | zwinąć oczko na M3 (Ø3) albo na drucie Ø2 |
| Ryzyko | nie działa | za mały przechył S1 | duży luz | sworzeń Ø1 w PLA; mocowanie do próby |

- Przy tym samym przechyle luz rośnie z grubością sworznia: luz = (d + 1)·(1/cos T − 1). Przy T = 48°: M3 → 2,0 mm, Ø1 → 1,0 mm. Dlatego sworzeń z drutu jest jedyną drogą do mniejszej histerezy bez nowych części [O]. Wymaga próbki (W2 użytkownika: sworzeń to nie drobny wydruk, tylko kawałek drutu w zgrubieniu ≥ 6 mm).
- Z części, które są w warsztacie, nie znalazłem prostszego połączenia bez luzu z przechyłem ±33–38° w dwóch osiach. Kulka, przegub krzyżowy i stożkowe podkładki to drobne wydruki albo nowe części.

## Decyzja dla użytkownika

- **Luz spojrzenia:** oczko na M3 (C) daje ok. ±4° „pływania” gałki przy zmianie kierunku (±2,8° przy B, ale B nie wystarcza dla S1). Pytanie: czy to akceptowalne dla dyni? Jeśli nie, próba wariantu D (sworzeń z drutu, oczko Ø2,5–3, ±2–3°).

## Werdykt

Do modelu: wariant C (oczko Ø6 na M3) z sworzniami **promieniowymi** – S2 ∥ y (wtedy wystarczy też Ø5), S1 ∥ x (sworzeń styczny ∥ y nie daje się wkręcić, W3). Przy S1 ∥ x oczko Ø6 ma 47° wobec wymaganych 43° po doginaniu płaszczyzny oczka do ±5°, więc wymagany jest test w 4 narożnikach. Wkręt od zewnątrz przez zgrubienie skorupy, w środku dwie skontrowane nakrętki, oczko i łeb dodane do przemiatania. Przed drukiem gałki użytkownik musi zaakceptować ±4° histerezy spojrzenia (K2) albo trzeba zrobić próbę wariantu D.
