# Review podstawki v2 (stan wykonany P7, blokada P5) – Opus, 25.10

Zakres: działanie i druk. Dane: `podstawka.scad` z 17:51 (dOtwPl = 60 po korekcie użytkownika), eksporty własne do `C:/Users/Karol/AppData/Local/Temp/opus-v2` (OpenSCAD 2021.01), narzędzia `sprawdz_siatki.js`, `skladowe_siatki.js`, `wymiary_siatki.js`, porównanie zbiorów wierzchołków (`por.js`) i część wspólna w OpenSCAD z objętością liczoną z STL (`kol.scad`, `vol.js`).

## Wyniki punktów briefu

1. **Zgodność ze stanem wykonanym.** Model: dno 6 (254,8 × 222,8), ścianki 40 (boczne 222,8, tylna 218,8), płyta 18, wysokość 64, otwór Ø60 (assert Ø60 < Ø64 tulei: OK), 4 wkręty płyty 9 od boku i 30 od przodu/tyłu. Rysunek cięcia (17:51) pokazuje Ø60 i te wymiary; `podstawka-drewno.png` (17:51) – stan wykonany z blokadą. PRD §5 zgodny (Ø60, 4 wkręty w dół, elektronika do dna).
2. **Szufladka na dnie.** Luz boczny 1,5/1,5 (x 19,5–235,3 wobec ścianek 18 i 236,8). Dno szufladki na dnie sklejki z = 6. Powerbank: wierzch z = 40, spód płyty z = 46 → 6 mm. Czoło: góra z = 45, leży przed płytą (y < 0), nie pod nią. Szufladka–kaseta 2 mm (tył 101,8, kaseta 103,8); dosuw zatrzymuje czoło na krawędziach ścianek, nie kaseta. Części wspólne (objętość): szufladka ∩ (dno + ścianki + płyta) = 0,000 mm³ (tylko styk z = 6), szufladka ∩ kaseta = pusta, kaseta ∩ drewno = 0,000 mm³ (styk z dnem). Przy wysunięciu 100 mm na dnie zostaje 1,8 mm szufladki.
3. **Blokada P5.** Oś wkrętu w złożeniu x = 245,8 = SZ − 9 (środek ścianki 18), z = 25,5 (ścianka z 6–46: 19,5 od dołu, 20,5 od góry). Przy luzie bocznym ±1,5 wkręt trafia 7,5–10,5 mm od lic ścianki – w sklejkę. Prawy kołnierz x 235,3–254,8 pokrywa całą krawędź ścianki (236,8–254,8), więc kołnierz jest podparty przez sklejkę za nim. Wkręt przez czoło w ściankę blokuje wysunięcie. Kolizja z wkrętem płyty (y = 30, z 24–46, ta sama płaszczyzna x): koniec blokady y ≈ 17, odstęp ok. 11 mm. Pogłębienie na siatce: Ø5,3 na licu, Ø3,5 na głębokości 1,5, czyli stożek 62°, nie 90° (niżej, BRZEGOWE). Prawa połówka 65,9 × 104,8 × 39 (A1 mini ≤ 180: OK), X1C 244,8 × 112,8 × 39 (≤ 256: OK). Druk na dnie bez podpór: kołnierz to pionowa ścianka 3 mm, otwór poziomy Ø3,5 i stożek Ø5,3 – małe mostki, bez podpór.
4. **Kaseta do dna.** Piasta 4,6 + dno kasety 2,4 = 7 nad sklejką; wkręt 3 × 12 z łbem walcowym wchodzi 5 mm w dno 6 → zostaje 1,0 mm; łeb stożkowy na krawędzi otworu Ø3,5 siedzi ok. 1,2 mm wyżej → zostaje ok. 2,2 mm. Nie wychodzi spodem przy dnie ≥ 5,5 mm. Piasty (Ø9 w x 8/162, y 8/89) wobec: ramki ESP32-C3 (x 13,5–35,1, y 13,5–39,6) – 1,0 mm od piasty przód-lewo, bez kolizji; PCA9685 (x 54–116, y 60–85) – daleko; ramki gniazda zasilania (x 147,8–166,4, y 46,2–69,8) – 15 mm od piasty tył-prawo w y, 34 mm od przód-prawo; pierścienia kondensatora (x 124,2–137,8, y 65,7–79,3) – daleko. Dostęp od góry: przed założeniem płyty nic nie przykrywa piast; tylny pas kasety (y 97–100) 3,5 mm za piastami tylnymi – śrubokręt pionowo bez przeszkód.
5. **Lewa połówka.** Eksport bieżącego modelu = plik z commitu de713fe: 194/194 wierzchołki, 0 różnic (zaokrąglenie 0,001). Plik w repo też identyczny. Geometria bez zmian.
6. **Siatki.** Eksporty własne i pliki w repo (lewa, prawa, X1C, kaseta): szczelne, 0 otwartych i nierozmaitościowych krawędzi, 0 zdegenerowanych, 1 bryła. Wymiary: X1C 244,8 × 112,8 × 39, lewa 178,9 × 112,8 × 39, prawa 65,9 × 104,8 × 39, kaseta 170 × 100 × 25 – zgodne z `parametry.json`. Pliki w repo = eksport bieżącego modelu (0 różnic wierzchołków); otwór blokady jest w prawej i w X1C (w HEAD go nie było – pliki są zmienione w drzewie roboczym, niezacommitowane).

## PSUJE DZIAŁANIE ALBO DRUK

Brak.

## BRZEGOWE

- Pogłębienie blokady ma stożek 62° (Ø5,3 na licu, głęb. 1,5), a łeb wkrętu 3 × 20 jest 90°, Ø ok. 6: łeb wystaje ok. 0,4 mm i dociska kołnierz krawędzią; poprawka: w `szuflada()` `d1 = dLebSkl + 2` (stożek 90° z zapasem 1 mm przed licem) – albo dogłębić pogłębiaczem po druku i nie przeciągać.
- Przed wkręceniem blokady nawiercić krawędź sklejki Ø2 przez otwór w czole (wkręt w czoło sklejki, środkowe warstwy).
- Wkręty kasety: zapas do spodu 1,0 mm przy łbie walcowym i dnie dokładnie 6,0; zmierzyć dno (sklejka „6” bywa 5,5–5,7) i przy < 5,8 użyć 3 × 10 albo podnieść `wkrDnoZapas` do 2.
- Kabel z powerbanku do gniazda zasilania przechodzi ok. 2 mm obok przedniej prawej piasty (oś kabla x = 222,9, piasta 223,3–232,3, łeb do z ≈ 15) – może się o nią opierać, bez skutku dla działania.
- Przy wysunięciu ok. 100 mm szufladka zsuwa się z dna 6 mm na stół; przy wsuwaniu unieść.
- Sekcja „aktualne” w `20-analizy/2026-10-25-podstawka-model.md` podaje jeszcze otwór Ø45 (model i rysunek: Ø60).

## Werdykt

Prawą połówkę szufladki z blokadą (A1 mini albo X1C) i kasetę można drukować; pogłębienie blokady warto przed drukiem poprawić na 90°, ale nie blokuje to druku ani działania.

## Dopisek: blokada M5 × 25 imbus (zmiana po review)

Dane: `podstawka.scad` z `blokL = 25`, `dBlok = 5,5`, `dBlokPilot = 4,2`; siatki w repo z 17:55.

- **Siatki:** prawa połówka i X1C są szczelne, każda to 1 bryła. Wymiary: prawa 65,9 × 104,8 × 39, X1C 244,8 × 112,8 × 39, czyli bez zmian. Plik prawej połówki w repo jest identyczny z moim eksportem bieżącego modelu (0 różnic wierzchołków). W kołnierzu jest walec Ø5,5 na całej grubości 3 mm, bez pogłębienia. Lewa połówka nadal jest identyczna z de713fe (194/194 wierzchołki).
- **Odległości od lic sklejki:** oś śruby leży na x = 245,8, czyli 9 mm od obu lic ścianki, i na z = 25,5. Otwór Ø4,2 zostawia 6,9 mm ścianki z każdej strony, a gwint M5 6,5 mm. Od góry ścianki (z = 46) jest 18,4 mm, od dna (z = 6) 17,4 mm.
- **Luz:** otwór Ø5,5 na śrubie Ø5 daje 0,25 mm luzu promieniowo. Szufladka ma ±1,5 mm luzu bocznego, więc przy wkręcaniu śruba sama ją ustawia. Otwór w ściance trzeba wiercić przez otwór w kołnierzu przy dosuniętej szufladce.
- **Wkręt płyty 3,5 × 40 (y = 30):** zajmuje y 28,25–31,75 i z 24–46, a w z pokrywa się z otworem blokady (z 23,4–27,6). Koniec śruby M5 jest na y = 22 (25 − 3 mm kołnierza), więc do wkrętu płyty zostaje 6,25 mm. Koniec otworu Ø4,2 × 25 jest na y = 25, a do wkrętu zostaje 3,25 mm.
- **Łeb:** łeb Ø8,5 × 5 opiera się płasko na licu kołnierza. Zajmuje x 241,6–250,1 (kołnierz kończy się na 254,8) i z 21,3–29,8 (czoło sięga z 6–45). Wystaje 5 mm do przodu. Nie koliduje z niczym: uchwyt jest na lewej połówce, a stół leży na z = 0.
- **Druk:** kołnierz to pionowa ścianka 3 mm z poziomym otworem Ø5,5, który drukuje się bez podpór (mały mostek).
- **Działanie:** śruba przez kołnierz w ściankę blokuje wysunięcie szufladki. Siła docisku przenosi się przez kołnierz na krawędź sklejki, która leży bezpośrednio za nim.

**PSUJE DZIAŁANIE ALBO DRUK:** brak.

**BRZEGOWE:**
- Otwór Ø4,2 × 25 jest o 3 mm dłuższy niż potrzeba (śruba sięga y = 22) i kończy się 3,25 mm przed wkrętem płyty. Przy odchyłce trasowania albo zejściu wiertła o ponad 3 mm może trafić we wkręt płyty. Poprawka: `blokL` dla otworu 22–23 mm, co daje 5–6 mm odstępu; ewentualnie wiercić z ogranicznikiem głębokości.
- Gwint M5 wycinany w krawędzi sklejki traci nośność przy częstym wkręcaniu. Dokręcać bez siły, bo kołnierz ma tylko 3 mm PLA.

**Werdykt:** blokadę M5 × 25 w obecnej postaci można drukować i stosować; jedyna drobna rada to otwór w sklejce na głębokość 22–23 zamiast 25.

## Dopisek 2: blokada M4 × 25 imbus, druk w całości na X1C

Dane: `dBlok = 4,5`, `dBlokPilot = 3,3`, `blokOtwG = 22`; `Szuflada (X1C).3mf` w repo.

- **Siatka X1C:** jest szczelna, 1 bryła, 0 błędów, wymiary 244,8 × 112,8 × 39. Plik w repo jest identyczny z moim eksportem bieżącego modelu (160/160 wierzchołków). W kołnierzu jest otwór Ø4,5 na całej grubości 3 mm, bez pogłębienia. Mieści się na X1C (≤ 256), drukuje się bez podpór: otwór poziomy Ø4,5, mały mostek.
- **Odległości od lic sklejki:** oś śruby jest na x = 245,8, 9 mm od obu lic, i na z = 25,5. Otwór Ø3,3 zostawia 7,35 mm ścianki z każdej strony, gwint M4 7,0 mm. Od góry ścianki jest 20,5 mm, od dna 19,5 mm. Otwór Ø4,5 na śrubie M4 daje 0,25 mm luzu promieniowo. Szufladka ma ±1,5 mm luzu bocznego, więc przy wkręcaniu śruba ją ustawia.
- **Wkręt płyty (y 28,25–31,75, z 24–46):** otwór Ø3,3 × 22 i koniec śruby leżą na y = 22. Do wkrętu płyty zostaje 6,25 mm, wcześniej było 3,25. Uwaga z dopisku 1 jest załatwiona.
- **Łeb:** łeb Ø7 × 4 opiera się płasko na kołnierzu. Zajmuje x 242,3–249,3 (kołnierz kończy się na 254,8) i z 22–29 (czoło sięga z 6–45). Nie koliduje z niczym.
- **Działanie:** śruba blokuje wysunięcie szufladki. Docisk przenosi się przez kołnierz na krawędź sklejki tuż za nim.

**PSUJE DZIAŁANIE ALBO DRUK:** brak.

**BRZEGOWE:**
- Komentarz w `podstawka.scad` (linia 52) podaje jeszcze „otwór Ø4,2”, a zmienna i rysunek cięcia mają Ø3,3.

**Werdykt:** `Szuflada (X1C).3mf` z blokadą M4 × 25 można drukować i stosować.
