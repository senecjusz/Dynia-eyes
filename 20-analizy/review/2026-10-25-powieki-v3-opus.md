# Review powiek v3 (każda powieka na swoim serwie) – krytyk Opus, runda 1 z 2

25.10.2026, tylko odczyt. Oceniane: `duze-oko-v2.scad` (stan roboczy: `uszkoPow`, `PrzedluzenieOrczyka`, ramki SG/SD, `rZaczP` 34, `rOrczP` 25, `yWalP` 14,09), `kolizje-powieki-v3.txt`, parametry `duze-oko-v2-parametry.json`.
Oznaczenia: **[P]** przemiatanie projektanta, **[O]** obliczenie (mój skrypt, płaszczyzna x = 0, drut 36,70 mm), **[Z]** założenie.

## Streszczenie

Kinematyka jest dobra: kąt między ramieniem orczyka a drutem wynosi 41–85°, a przy uszku 34–84°, nawet przy błędzie długości ±2 mm. Do martwego punktu (0°) jest daleko. Błąd ±2 mm przesuwa zero serwa o ±5–7° i kasuje go kalibracja, bo każda powieka ma swoje serwo.

Są dwie uwagi PSUJE, obie z prostą poprawką. Uszko w orientacji do druku jest wyspą 3 mm pod krawędzią czaszy, więc bez malowanej podpory się nie wydrukuje. Przedłużenie orczyka podnosi łeb fabrycznego wkrętu o 1,8 mm, więc wkręt prawie nie trzyma w wałku.

Wymiary orczyka (5,5 / Ø7) to założenie, dlatego przedłużenie trzeba najpierw wydrukować próbnie (ok. 10 min). Pozostałe uwagi są BRZEGOWE. Werdykt: do wydruku po dwóch poprawkach i przymiarce przedłużenia na prawdziwym orczyku.

## PSUJE

**P1. Uszko powieki drukuje się w powietrzu.** [O]
- `druk()`: powieka obrócona o 36° wokół x, czasza do góry. Krawędź czaszy (73,5°, R 32,7) jest na z 29,3. Otwór uszka (77,5°, R 34) na z 28,9, spód oczka uszka na **z 26,3**, czyli 3 mm niżej i ok. 2,6 mm na zewnątrz od krawędzi.
- Uszko zwisa w dół i na zewnątrz z krawędzi, która sama wisi na podporach. Pierwsze warstwy oczka nie mają podparcia → nieudany druk uszka. Powieka dolna jest symetryczna, więc tak samo.
- **Poprawka:** malować podporę drzewiastą od stołu pod uszkiem (obie powieki), dopisać w tabeli druku `duze-oko-v2-montaz.md`. Pewność: wysoka.

**P2. Przedłużenie orczyka: wkręt fabryczny traci 1,8 mm wkręcenia.** [O] [Z]
- Rowek od spodu ma 1,2 mm, przedłużenie 3 mm, więc nad orczykiem zostaje 1,8 mm płytki. Otwór Ø2,4 jest bez pogłębienia, więc łeb wkrętu opiera się na górze przedłużenia, 1,8 mm wyżej niż na gołym orczyku.
- Wkręt fabryczny MG90S do orczyka ma ok. M2 × 4–5 [Z], wkręca się w wałek na ok. 3 mm. Po podniesieniu łba zostaje ok. 1–1,5 mm gwintu → wkręt wyrwie się przy pierwszym zablokowaniu (7 N na r 25 = 176 N·mm). Powieka przestanie działać.
- **Poprawka:** pogłębienie pod łeb Ø4,6 do 0,6 mm nad górą orczyka (traci się tylko 0,6), albo dłuższy wkręt M2, jeśli jest w warsztacie (pytanie do użytkownika). Pewność: średnia (długość wkrętu do sprawdzenia).

**P3. Przedłużenie na założonym kształcie orczyka – najpierw przymiarka.** [Z]
- Rowek: piasta Ø7 + 0,6, ramię 5,5 + 0,6 do 20 mm. Orczyki jednoramienne MG90S są zwykle zwężające się (ok. 6–7 przy piaście, 4–5 na końcu) [Z]. Prostokątny rowek 6,1 przy końcu ramienia 4,5 daje luz kątowy ok. (6,1 − 4,5)/2 / 15 ≈ 3° → przy r 25 ok. 1,3 mm → ok. 2,4° powieki chybotania. Zbyt wąski rowek przy piaście → nie wejdzie.
- **Poprawka:** zmierzyć orczyk suwmiarką (szerokość przy piaście i na końcu, Ø piasty, grubość) i zrobić rowek w kształcie orczyka (hull dwóch okręgów), luz 0,1–0,15 zamiast `luzSlizg` 0,3. Najpierw próbny wydruk przedłużenia. Pewność: średnia.

## BRZEGOWE

- **B1. „Drut – własna powieka −0,89”** [P]: drut w otworze uszka, a wyłączone jest tylko 1,5 mm przy promieniu oczka 2,6. Artefakt modelu. W skrypcie wyłączyć `rUszkaP` + 0,5.
- **B2. Stos osi powiek < 0,5 mm** [P]: powieka górna – łeb M2 0,18, górna – dolna 0,20, dolna – Pierścień 0,20. Bez zmian od v2, to pasowania obrotowe z tabeli luzów (0,2). Nie dotyczy v3.
- **B3. Wieża SG/SD wobec słupka** [O]: oś serwa powieki na y 14,09, wieża MG90S r 6 [Z] od x −1,5 → **0,23 mm** do słupka Ø16. To pary nieruchome, ale przy realnym serwie (wymiary wieży ±0,5) może zachodzić. Sprawdzić przy montażu. Jeśli trze, `przesOrczP` + 0,5. Piasta przedłużenia (r 5,5) – słupek 0,82, fabryczna piasta 2,59.
- **B4. Widoczność** [O]: uszko przy zamkniętych powiekach leży na y ±33,2, z 7,4 i sięga promienia 35,8, w szczelinie między czaszą (32,7) a tubą (37,9), ok. 17 mm za czołem tuby. Z przodu, pod kątem, widać je jako mały pomarańczowy element o 12 i 6 godzinie, w cieniu. Przy otwartych powiekach chowa się za tubę (z −21). Gałki nie dotyczy (PRD: gałka biała, gładka – spełnione).
- **B5. Luz w łańcuchu powieki** [O]: otwory Ø1,4 w uszku (4 mm) i w przedłużeniu (3 mm) → 0,8 mm → ok. 1,5° powieki przy 1,8°/mm. Pomijalne.
- **B6. Przemiatanie gałki** [P]: część z pierwszego przebiegu, sprzed przesunięcia ramienia na 285°. Ramię nie jest w zasięgu gałki (gałka – uchwyt > 3), więc wynik obowiązuje.

## Odpowiedzi na pytania

**1. Kinematyka** [O]

| ψ powieki | α serwa (L nominalne) | α przy −2 mm | α przy +2 mm | kąt orczyk–drut | kąt uszko–drut |
|---|---|---|---|---|---|
| 0 (zamknięta) | +36,0° | +41,8° | +30,6° | 47–63° | 77–81° |
| 25,75 | 0,0° | +4,6° | −4,7° | 77–85° | 67–68° |
| 51,5 (otwarta) | −31,2° | −24,9° | −38,0° | 41–48° | 34–40° |

- Martwy punkt (kąt 0°) daleko. Najgorzej 34° przy uszku przy pełnym otwarciu i +0 mm/−2 mm, wciąż sprawny przekaz.
- Zakres serwa −38…+42° w najgorszym razie, w granicach 600–2400 µs.
- **Czułość:** 1,72°/mm (zamknięta), 1,81°/mm (środek), 2,67°/mm (otwarta) powieki na 1 mm drutu. Błąd ±2 mm = ±3,4–5,3° powieki przed kalibracją, potem 0.

**2. Uszko**
- Siła przy zablokowanym serwie 176 N·mm / 25 mm = **7 N**. Przekrój uszka przy krawędzi czaszy ok. 4 × 3,5 mm, ramię ok. 2,4 mm → ok. 2 MPa; oczko: ścianka 1,9 × 4 → < 1 MPa. Wytrzyma. Druk: P1.
- L przez otwór Ø1,4 w uszku 4 mm: noga ∥ x, za uszkiem w ±x jest wolne miejsce (R 34, nad czaszą górnej, tuba dalej) → zagięcie zabezpieczające ≥ 5 mm się zmieści. Drut leży w płaszczyźnie x ≈ 0…3 (orczyk + przedłużenie), więc odchylenie od płaszczyzny ok. 4,7° stałe < 7,6° przechyłu w otworze. Nie wypadnie, nie zakleszczy się.

**3. Przedłużenie orczyka:** P2, P3. Moment 176 N·mm przenoszą ścianki rowka. Przy luzie 0,1 i ramieniu ~15 mm to ok. 12 N na ściankę – wytrzyma.

**4. Kolizje:** wnikanie tylko B1 (artefakt). Poniżej 0,5: B2 (stare), B3 (nieruchome). Orczyk z przedłużeniem – słupek 0,82, orczyki – uchwyt 2,62. Drut S2 (x 0–11, y 20–22) wobec orczyka SG (płaszczyzna x 0–5, z ≤ −25,7 przy α 36°): drut S2 jest w x < 5 tylko na z > −23, więc > 2,5 mm [O]. Druty SG/SD wobec drutów S1/S2 > 10 mm (y 33–39 wobec 20–22). Gałka – drut SG/SD 2,91 [P].

**5. Widoczność:** B4.

**6. Montaż (ręcznie, w punktach):**
1. Wydrukować przedłużenia (próbka), przymierzyć do orczyka, poprawić rowek (P3).
2. Powieki na pierścieniu (osie M2 jak dotąd), zamknięte.
3. Serwa SG, SD w ramkach (−x) przy 1500 µs; orczyk + przedłużenie nałożyć ramieniem na zewnątrz (±y), dokręcić wkrętem fabrycznym (P2).
4. Drut: L na jednym końcu kombinerkami, włożyć w przedłużenie, zabezpieczyć zagięciem pod przedłużeniem (od strony serwa, poza obrysem korpusu: y 36–39 wobec 20,3).
5. Przyłożyć do uszka przy powiece zamkniętej, zaznaczyć markerem, zgiąć drugie L, włożyć w uszko od x−, zabezpieczyć zagięciem po x+.
6. Kalibracja: zero SG na domknięciu górnej, zero SD na domknięciu dolnej, potem otwarcie 51,5°.
- Dostęp do uszek: od tyłu przez tubę, przy zdjętej gałce (zaczep powiek przed krokiem „gałka w pierścieniu”).

## Werdykt

Powieki v3 nadają się do wydruku po dwóch poprawkach PSUJE (podpora pod uszkiem, pogłębienie pod łeb wkrętu w przedłużeniu) i po przymiarce wydrukowanego przedłużenia na prawdziwym orczyku MG90S.
