# Duże oko v2 – plan szczegółów przed CAD (krok 2)

25.10.2026, projektant. Podstawa: PRD v0.1, koncepcja `20-analizy/2026-10-24-duze-oko-koncepcja-wstepna.md`, krytyk `20-analizy/review/2026-10-24-koncepcja-duze-oko-krytyk.md`, brief `30-projekt/brief-duze-oko-krok2-cad.md`.

Układ: x w prawo (patrząc na dynię), y w górę, z do przodu. Środek gałki = (0, 0, 0). W Onshape X = x, Y = y, Z = z (Top = płaszczyzna z = 0).

## 1. Co się zmieniło względem koncepcji

| Zmiana | Powód |
|---|---|
| Wszystkie 3 serwa mają wałek **wzdłuż x**. Orczyki obracają się w płaszczyznach yz | Drut lewo–prawo i tak porusza się głównie wzdłuż z (±12 mm), a odchyłkę w y (r(1 − cos α) ≤ 7 mm) przyjmuje klepsydra (K1). Jeden kierunek montażu = prosty uchwyt (3 pionowe ramki na płycie) |
| Serwa poza Ø79, za kołnierzem (z −34…−66) | Moduł wkładamy od środka, więc obrys Ø79 obowiązuje tylko tubę |
| **Osie powiek: M2 × 6** (łeb od strony gałki, gwint w podkładce tuby), nie M3 | Między gałką (R 30) a OD tuby (R 39,5) jest 9,5 mm. Najkrótsza M3 (× 8 + łeb 2,45 = 10,45) się nie mieści. M2 × 6 + łeb 1,6 = 7,6 mieści się z wariantem A. Użytkownik ma M2 × 6 (24.10) |
| Ścianka tuby 1,6 (ID 75,8) | Ogon Z drutu dolnej powieki na x ≈ −36, y ≈ 8 ma R 37,4 od osi tuby, więc potrzebny zapas |
| Ramiona na Uchwycie (W7), Pierścień płasko | krytyk |
| **Czop przedni: M5 × 12 bez nakrętki.** Łeb wsuwany bokiem w rowek T w stożku gałki, nad podłogą 5 mm (z 12,75…17,75). Piasta dociśnięta do wierzchołka stożka, wkręt M4 piasty dokręcony kluczem L od dołu przez otwór gałki | W5. Wersja z nakrętką i M5 × 16 ma łeb na z ≈ 27, gdzie rowek nie wychodzi już do wnętrza gałki (stożek styka się ze skorupą na z ≈ 23), więc przeciąłby skorupę. Obrót blokuje docisk podłogi między piastą a łbem |
| **Czop tylny: M5 × 16 od dołu przez okno w słupku.** Łeb w poziomym oknie (z −21,95…−26), trzpień Ø5,3 w górę do piasty. Wkręt M4 piasty (oś ∥ x) dokręcany z boku pod krawędzią gałki | Bez rowka bocznego w słupku; słupek drukuje się bez podpór |
| **Gałka: jedna podpora drzewiasta** pod wierzchołkiem stożka (Ø11,5 na wysokości 20,75 nad stołem) | Najniższy punkt w osi, który da się zbudować od krawędzi (z = −8) pod 45°, leży na z = 18,8, a czoło piasty na z = 12,75. Podpora jest wewnątrz gałki i zdejmuje się ją przez tylny otwór Ø57 |
| Słupek prosto w osi (Ø16) od płyty do piasty | Przy wałkach wzdłuż x pas w osi jest wolny. Zastrzał z W6 nie jest potrzebny. Sfera obrzeża gałki nie wchodzi w stożek 31° wokół −z, a słupek jest w środku pustej gałki |
| Gałka: zamiast słupka **stożek 45°** od sklepienia do piasty (wierzchołek Ø11,5 na z = 12,75) | W4: ściany samonośne, wierzchołek na podporze (wyżej) |
| Żebra na druty: płytki 2 mm stojące na stole (z −8…−4), otwór klepsydrowy na z = −6 | K1, W4 |
| Powieki: druk kopułą do góry, uszy na stole, **podpory drzewiaste tylko pod wewnętrzną stroną czaszy** | Cienka czasza sferyczna 75° nie da się wydrukować bez podpór w żadnej orientacji. Ślady zostają po stronie gałki, niewidoczne |

Wariant A powiek się mieści, więc B nie jest potrzebny.

## 2. Główne zmienne (Variable Studio „Zmienne v2”)

| Zmienna | Wartość | Uwagi |
|---|---|---|
| `scianka` | 40 mm | grubość ścianki dyni; tuba = scianka + 2, ramiona = 84 − scianka (zakres 28–50) |
| `Rg` | 30 | gałka; skorupa `tg` 2 |
| `zRant` | −8 | tył gałki = stół |
| `Rpg`, `tp` | 31,5 / 1,2 | powieka górna (R wewn., grubość) |
| `Rpd` | 33,2 | powieka dolna (wewn.), 33,2 − 32,7 = 0,5 luzu (D3) |
| `katZam`, `katOtw`, `szerPow` | 1,5° / 50° / 75° | krawędź zamknięta (zakładka 3°), otwarta, szerokość czaszy |
| `xLeb`, `xUchoG`, `xUchoD`, `xPad` | 30,5 / 32,3 / 34,0 / 35,7 | stos osi powiek: gałka 30 \| 0,5 \| łeb M2 1,6 \| 0,2 \| ucho G 1,5 \| 0,2 \| ucho D 1,5 \| 0,2 \| podkładka do 38,2 |
| `rDzw` | 8 | dźwignie powiek (W3) |
| `rTubaZ`, `tTuba` | 39,5 / 1,6 | tuba |
| `Dkol` | 104 | kołnierz; łapy = 3 otwory Ø4,5 na r 47 |
| `Dmask`, `dMaskW` | 84 / 79,1 | maskownica (wcisk na tubę, dopasowanie po próbie) |
| `zWal` | −44 | wałki 3 serw |
| `rOrcz1`, `rOrcz2`, `rOrcz3` | 15,5 / 11,5 / 7,5 | orczyki: lewo–prawo / góra–dół / powieki (otwory 5,5…17,5 co 2) |
| `xOrcz1`, `xOrcz2`, `xOrcz3` | 21 / 11 / −34,5 | płaszczyzny orczyków |
| `yWal1`, `yWal2`, `yWal3` | −15,5 / 10,5 / −7,5 | osie wałków (otwór orczyka w środku ruchu: y 0 / 22 / 0) |
| `dKlep`, `kKlep` | 1,2 / 40° | klepsydra: przewężenie Ø1,2 × 0,4, stożki 40° do Ø2,4 |
| luzy | 0,2 obrotowe, 0,3 ślizgowe | tabela AGENTS |

## 3. Kinematyka (środek ruchu: orczyk ⟂ drut)

| Oś | Ucho | Zasięg ucha wzdłuż z | Orczyk | Kąt serwa |
|---|---|---|---|---|
| Lewo–prawo ±35° | (22, 0, −6), oś otworu ∥ y | +13,7 / −11,5 | r 15,5 | +62° / −48° |
| Góra–dół ±25° | (0, 22, −6), oś ∥ x | +9,9 / −8,7 | r 11,5 | +59° / −49,5° |
| Powieki 51,5° (−1,5° → 50°) | dźwignie r 8 na x ≈ −33 / −34,7, ⟂ drut w połowie skoku | ±3,5 | r 7,5, otwór Ø2,1 na oba druty | ±27,6° |

Asymetria ±35° wynika z ucha na z = −6. W kalibracji ustawiamy osobne kąty dla obu kierunków, bez zmiany sprzętu.

Druty Ø1,0 (sprężynowy), od otworu do otworu w środku ruchu: lewo–prawo 38,0, góra–dół 39,6, powieka górna 44,7, powieka dolna 44,7. Rysunek 1:1 – kamień 6.

## 4. Części i operacje (Onshape, jeden Part Studio „Duże oko v2”)

1. **Próbka drutu.** Płytka 34 × 10 × 2. Żebro A: klepsydra jak w gałce (2 mm, otwór 2 nad płytką). Żebro B: 1,5 mm z otworem Ø1,2 (dźwignia powieki). Płytka ma też otwór Ø2,1 na test dwóch drutów w jednym otworze. Ok. 4 operacje, osobno od modelu.
2. **Gałka** (biała), druk kopułą do góry na krawędzi z = −8, bez podpór. Szkic przekroju: skorupa + stożek 45°, potem obrót. Dalej rowek T (wyciągnięcie w obie strony wzdłuż y, ze stopniami 5,5 / 8,3 / 10,2), płaszczyzna z = −6, żebra x 18…28 i y 18…28 (2 × 4), dwie klepsydry (obrót wycięcia wokół osi w szkicu). Razem 9 operacji.
3. **Powieka górna.** Szkic na Front: półpierścień R 31,5–32,7 i profil wycięcia (kula R 31,5 + pogłębienie Ø4,6 do x 32,3 + otwór Ø2,4). Obrót czaszy w dwóch kierunkach (−1,5…73,5°). Płaszczyzna x = −33,8, szkic ucha (koło r 4 + ramię sektora 11…61°, r 14) i dźwigni (r 8, otwór Ø1,2). Wyciągnięcie ucha 4,8 i Mirror, dźwignia 1,5 (tylko lewa). Na końcu obrót wycięcia. Razem ok. 9 operacji.
4. **Powieka dolna.** Czasza R 33,2–34,4 przycięta do |x| ≤ 32, sektor −73,5…1,5°. Ucho: koło r 4,5 + dźwignia na x 34,0…35,5 oraz ramię pierścieniowe r 4,5…14,9 na x 32…35,5. Mirror (bez dźwigni), wycięcie kuli R 33,2 + otwór Ø2,4. Ok. 10 operacji.
5. **Pierścień.** Tuba Ø79 / Ø75,8 od z = 24 na długość `scianka` + 2. Kołnierz Ø104 × 4 (jego przód na z = 22 − `scianka`), 3 otwory Ø4,5 (łapy na wkręty do drewna) i 3 otwory Ø3,3 z pogłębieniem Ø6,5 × 2,6 od przodu (M3 do ramion). Podkładki osi powiek: pięciokąt z dołem V 45° (samonośny), x 35,7…38,2, otwór Ø1,7 (M2 ciasny), Mirror. Druk kołnierzem na stole. Ok. 11 operacji.
6. **Maskownica.** Pierścień Ø84 / Ø79,1 × 2, ze szkicu tuby. 1 operacja.
7. **Uchwyt serw.** Płyta 3 mm na z −69…−66. Słupek Ø16 do z = −13,25 z rowkiem T (otwartym w górę). 3 ramiona 8 × 8 do tyłu kołnierza (z = 18 − `scianka`) z otworem Ø2,6 na całej długości (M3 × 16 w plastik). 3 ramki serw (płaszczyzny x = 40,5 / 29,5 / −53, grubość 4, okno 13,1 × 23,4, 2 otwory Ø1,7 na wkręty fabryczne co 27,7). Druk płytą na stole, bez podpór. Ok. 18 operacji (powyżej limitu 15, bo 3 ramki leżą w 3 różnych płaszczyznach).

Budżet API: ok. 70 zapisów operacji + 10 odczytów + eksport (ok. 20) + poprawki. **Limit 200 wywołań.** Bramka `req()` jak w e6.6, próg 20. GET /features najwyżej 3.

## 5. Kolizje do sprawdzenia (na siatkach + bryły zastępcze serw, orczyków, drutów, kardana)

Ruch: gałka ±35° / ±25° i narożniki (siatka 7 × 5), powieki −1,5…50° (obie). Pary i oczekiwane odstępy:
- gałka–słupek: żebro x 18 wobec słupka r 8, min. 1,3 mm przy θ = 35°;
- gałka–drut S1 przy tylnej krawędzi, ok. 3,6 mm;
- drut S2–czasza górna przy otwarciu, ok. 2,3 mm;
- powieka górna–dolna: 0,5 promieniowo;
- ucha–łeb M2: 0,2 osiowo;
- dźwignia dolna z ogonem Z–tuba: ok. 0,4;
- orczyk S1–korpus S2: ok. 1,7;
- orczyk S2–słupek: 2,0;
- ramiona–serwa: ≥ 1;
- kołnierz–ucha serw przy `scianka` = 50: 2 mm.

## 6. Niepewności (szacunki jako zmienne)

- łeb M5: przyjęty DIN 912 Ø8,5 × 5; rowek mieści Ø10 × 5,2;
- łeb M2: Ø3,8 × 1,6;
- kardan: wymiary z e6-pomiary (L 25,5, Ø11, otwór Ø5 × 7, wkręt M4 co 3,65 od czoła);
- MG90S: rysunek Miuzei (ucha 18–20 nad spodem, wałek na 35, oś 5,5 od czoła, wycięcia co 27,7);
- dynia: ścianka 40 (zmienna), krzywizna wnętrza ok. R 150, więc łapy przy wkręcaniu stoją ok. 7 mm od ścianki (wkręt 4 × 40).
