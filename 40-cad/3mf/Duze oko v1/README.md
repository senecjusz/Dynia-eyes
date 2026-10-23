# Duże oko v1 – druk (szkic)

Szkic wykonawcy CAD, 23.10.2026. Źródło: Onshape, dokument **„Duże oko v1”**, Part Studio „Duże oko v1” (stan E6.4, mikrowersja po odbiorze `features-e6.4.json`); weryfikacje `40-cad/onshape/weryfikacja-e6-etap1.md` i `weryfikacja-e6-etap2a.md`.

**Uwaga:** plik `Duze oko v1 - FullProject.3mf` w tym folderze pochodzi z etapu 1 (przed poprawkami). Przed drukiem potrzebny nowy eksport ręczny (instrukcja osobno). **Pręty, Uchwyt, Ramiona X/Y i słupki stopu powiek jeszcze nie istnieją** (czekają na koncepcję v3.2) – bez nich mechanizm gałki i ograniczniki powiek nie są kompletne.

## Próbka P4 – przegub krzyżowy (drukować najpierw)

Komplet pręta X na prosto, części „P4 …” w folderze „Próbka P4” (plan `40-cad/onshape/e6.6-plan-p4.md`). Wymiary jak w końcowych częściach (zmienne `uGal_*`, `uOrcz_*`). Krzyżaki leżą 43,635 mm od siebie (długość pręta X).

| Część | Szt. | Orientacja na stole | Podpory | Uwagi |
|---|---|---|---|---|
| P4 Widełki stałe G (wycinek Uchwytu) | 1 | na boku: płaski U z klockiem na stole | nie | 2 otwory M3 Ø3,3 w klocku do przykręcenia do deski |
| P4 Widełki stałe O (wycinek Ramienia X) | 1 | jak G | nie | jw. |
| P4 Krzyżak G (Ø5,75 × 4) | 1 | osią pionowo | nie | 4 otwory Ø1,8 → **rozwiercić wiertłem Ø2,0** (a1 głęb. 2,125, a2 1,825) |
| P4 Krzyżak O (Ø8 × 4) | 1 | osią pionowo | nie | jw. |
| P4 Pręt | 1 | pionowo, czopem na stole (brim), widełki u góry | nie | pod podstawą widełek trójkąty 45°; stopień czop → tulejka 1,3 mm bez podpór; otwór Ø2,6 pod M3 w osi |
| P4 Widełki pręta O | 1 | podstawą (strona łożyska Ø4,8) na stole | nie | łożysko obrotnicy Ø4,8 × 3,3, pogłębienie łba M3 Ø6 × 3,2 |

**Okucia:**

| Okucie | Szt. | Gdzie |
|---|---|---|
| DIN 7985 M2×4 | 2 | przegub G, sworzeń a1 (widełki stałe G): łeb Ø4 na licu policzka, bez pogłębienia |
| DIN 7991 M2×4 **skrócony do 3,7** | 2 | przegub G, sworzeń a2 (widełki pręta): łeb w pogłębieniu Ø3,8 |
| DIN 7991 M2×5 | 2 | przegub O, sworzeń a1 (widełki stałe O) |
| DIN 7985 M2×5 | 2 | przegub O, sworzeń a2 (widełki pręta O), łeb na licu policzka |
| DIN 912 M3×12 | 1 | obrotnica: przez pogłębienie widełek pręta O w czop pręta |
| M3 + nakrętki | 4 | klocki do deski |

**Montaż:**
- Wkręty M2 wkręcają się w policzki (otwory Ø1,6) i obracają w krążku. Otwory w krążku są drukowane Ø1,8 i rozwiercane ręcznie Ø2,0, co daje luz ok. 0,03–0,05 (B9). Luz osiowy krzyżak – policzek 0,125 na stronę (korekta v3.2).
- Dna otworów krążka leżą 0,25 za końcem wkrętu (tabela v3.2 pkt 3.3). Końce wkrętów a1 i a2 się nie stykają; dna otworów mogą się zejść w narożniku.
- Obrotnica: czop Ø4,4 × 3,4 w łożysku Ø4,8 × 3,3 (luz osiowy 0,1). Łeb M3 dociska czoło czopu, a podstawę trzyma stopień łożyska (zakład 0,35).
- Policzki widełek pręta G mają szerokość 4,6 (rP 2,3), więc wokół pogłębienia Ø3,8 zostaje ścianka 0,4. Widełki stałe G mają szerokość 3,8 (rS 1,9), łby DIN 7985 na licu.

**Testy (v3.2 pkt 15):**
- (a) pełne wychylenie bez zacięć, także w obu osiach naraz:
  - przy gałce a1 −33,5…+43,6°, a2 28,6°;
  - przy orczyku a1 −46,8…+47,7°, a2 17°;
  - Astra: przy a1 38,6° i a2 ok. 30° odstęp policzków spada do 0,5. Próbka nie ma ograniczników;
- (b) luz zwrotny długości pręta pod ±5 N ≤ **0,64 mm** (kryterium z pełnej macierzy, korekta v3.2 K3);
- (c) ±80 N osiowo, 10 s × 5: bez pęknięć, bez trwałego wydłużenia > 0,05;
- (d) 1000 cykli ±40° na serwie: wzrost luzu ≤ 0,1.

Zmierzony luz sworzni wpisać do tabeli luzów w `AGENTS.md`.

## Części

| Część | Szt. | Materiał | Orientacja na stole | Podpory | Uwagi |
|---|---|---|---|---|---|
| **Rama** | 1 | PLA | tyłem (z −37) w dół | nie | ucha z fazką 45° pod słupki Płyty; rant z fazką |
| **Gałka** | 1 | PLA biały | krawędzią tylną (płaszczyzna z −12,68 razem z nadlewami) w dół, front do góry | w razie potrzeby drzewiaste tylko od środka | warstwa 0,16, szew z tyłu; front gładki z wgłębieniem zera Ø3,2 × 1 (pod źrenicą); **najpierw Próbka P6** |
| Próbka P6 | 1 | PLA biały | jak Gałka (front do góry) | – | próbka czaszy frontu (z 10…30) do sprawdzenia nawisu > 45° wnętrza |
| **Powieka górna** | 1 | PLA | płaszczyzną krawędzi przedniej na stół | **tak – od strony wklęsłej** (drzewiaste) | zaczep drutu Ø1,6 – przewiercić Ø1,6 po druku |
| **Powieka dolna** | 1 | PLA | jak górna | **tak – od strony wklęsłej** | jw. |
| **Słupek** | 1 | PLA | pionowo, czopem (z −34) w dół | nie | kanał nakrętki M5 poziomo – sufit S 8,2 mostem |
| **Obejma** | 1 | **PETG** | kołnierzem w dół | nie | zacisk M3×25, nakrętka samohamująca w kieszeni |
| **Płyta** | 1 | PLA | tarczą w dół | nie | szczegóły niżej |
| **Ramię PG** | 1 | PLA | płasko, **stroną zewnętrzną (pogłębienie Ø4,5) w dół**, kieszeń orczyka do góry | nie | otwór drutu Ø1,6 przewiercić |
| **Ramię PD** | 1 | PLA | jak PG (wybranie orczyka do góry) | nie | jw. |
| Przyrząd gięcia drutów | 1 | PLA | płytką w dół, kołki do góry | nie | kołki Ø2,4 w środkach zagięć Z, łuków wykorbienia i na końcach nóg (rząd G i D) |
| Przyrząd zera | 1 | PLA | dnem w dół, trzpień i ścianki do góry | nie | czapka na czole rantu Ramy; trzpień Ø3 we wgłębienie zera; kalibracja przy otwartych powiekach |

## Uwagi do druku

- **Płyta:**
  - kieszenie nakrętek M2 górnych uch są 0,15 mm od kieszeni korpusu serwa (śruba leży 0,25 za ścianką klatki); jeśli ta ścianka się nie wydrukuje, nakrętkę i tak blokuje korpus serwa (luz 0,4);
  - przegroda między klatkami S_X i S_PD ma 0,7 mm – nienośna, serwa trzymają ucha;
  - łeb dolnej śruby M2 z podkładką wystaje 0,25 za tarczę (moduł o 0,25 głębszy – B5);
  - kieszenie korpusów MG90S z luzem 0,4/str., kanały kabli w obu krótszych ścianach klatek, otwory kabli w tarczy pod S_X, S_Y, S_PD (S_PG – kabel przez okno G).
- **Gałka:** nadlewy M3 (Ø7, otwory Ø2,6 na 5,4) leżą w płaszczyźnie krawędzi – Gałka stoi na krawędzi i nadlewach.
- **Gałka – test nadlewów przed montażem:** wkręcić śrubę M3 w każdy nadlew i ciągnąć oraz zginać ją wagą bagażową siłą ok. 30 N. Nadlew 330° (prawy, przy wycięciu X) łączy się ze ścianką tylko łukiem ok. 70° przy tylnej krawędzi (E6.6). Jeśli pęknie, zmiana do zrobienia to przypora nadlewu (wariant 2, w Parkingu).
- **Rama:** gwinty M3 uch to otwory Ø2,5 – pełny gwint 4,25 mm po fazce; śrubę wkręcać stalową M3 przed montażem (nacięcie).
- **Ramiona PG/PD:** pogłębienie Ø4,5 przebija dno nad piastą – łeb wkrętu środkowego orczyka opiera się na orczyku. Wymiary kieszeni orczyka to szacunki (grubość 1,7, piasta Ø7, długość 17,5) – przed drukiem przymierzyć orczyk; poprawka to zmiana zmiennych `orczyk*`.
- **Powieki:** szczelina krawędzi przednich ≥ 0,6 (kąciki przycięte schodkowo); ucha 2,4 z otworem osi Ø3,4.
- **Druty:** sprężynowe Ø1,2 gięte na przyrządzie; wpinać przez odgięcie całego drutu (nie samego końca).

## Okucia (z drzewa i koncepcji v3.1)

| Okucie | Szt. | Gdzie |
|---|---|---|
| DIN 7991 M3×8 (zamiennie DIN 913 M3×8) | 2 | osie powiek w bokach Ramy (gniazda stożkowe). DIN 913: ten sam gwint Ø2,5, stożek pusty, wkręcić równo z bokiem (nie poza Ø79,5), zabezpieczyć klejem do gwintów |
| M3×45 | 3 | Płyta (od spodu tarczy, przez słupki) → gwint uch Ramy |
| M3×25 + nakrętka samohamująca DIN 985 M3 | 1 | zacisk Obejmy |
| DIN 7991 M5×30 + nakrętka M5 | 1 | trzpień Słupka (gniazdo stożkowe w piaście Płyty, nakrętka w kieszeni Słupka) |
| M4 bez łba (docięty) | 1 (+1 Uchwyt) | Słupek → tylna piasta kardana |
| M2×10 + nakrętka M2 (DIN 934, S4) + podkładka Ø6 | 8 | ucha 4 × MG90S (oba ucha każdego serwa) |
| M2 krótki (ok. 6) | 4 | Ramiona PG/PD – przez otwory orczyka rozwiercone do Ø1,6 (2 na ramię) |
| wkręt środkowy orczyka | 2 | z kompletu serwa (ramiona powiek) |
| M3×8 | 2 | Uchwyt → nadlewy Gałki (**Uchwyt w v3.2**) |
| drut sprężynowy Ø1,2 | 2 × ok. 60 mm | łączniki powiek |
| MG90S (Miuzei MS60-4-D-V1) | 4 | S_X, S_Y, S_PG, S_PD |
| kardan 5/5 | 1 | Słupek ↔ Uchwyt |

Pozycje dla prętów, Ramion X/Y i przegubów – po v3.2.
