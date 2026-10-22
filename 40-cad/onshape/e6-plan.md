# E6: plan drzewa – duże oko v1

Wykonawca CAD, 22.10.2026. Brief: `30-projekt/brief-e6-duze-oko.md`. Podstawa: `20-analizy/2026-10-18-duze-oko-jedna-noc.md`, decyzje z 22.10. Do zatwierdzenia przed pierwszym zapisem operacji.

## Dokument (zrobione, etap 1)

- „Duże oko v1”, folder Halloween, publiczny (plan Free): did `b8cc184e37d6a8dbfb63c30b`, wid `abf573bb580a27e085f1d73e`.
- Part Studio „Duże oko v1” `045583ad9368d7b383c9477f`, Variable Studio „Zmienne duże oko” `5d1a01286f0f4439abd87cc4`, Assembly 1 (na etap 3).
- Stan i log wywołań: `40-cad/onshape/stan-api-e6.json` (4 wywołania, 0 na `/features`).

## Układ współrzędnych

- **Początek = środek kuli = środek krzyżaka kardana.**
- **+Z = kierunek patrzenia** (na zewnątrz dyni), **+Y = góra**, **X = lewo–prawo**.
- Oś góra–dół (pochylenie) = oś X, nieruchoma: sworzeń tylnej piasty kardana. Oś lewo–prawo (obrót) = oś Y, przechyla się razem z pochyleniem: sworzeń przedniej piasty.
- Oś powiek = oś X, przez środek kuli.
- Płaszczyzny: Top (XZ), Front (XY), Right (YZ). Płaszczyzny pomocnicze `cPlane` Offset od Front: rant, koniec Rury, Płyta serw.

## Zmienne (Variable Studio, przed operacjami)

Dozwolone stałe w drzewie: `0`, `90 deg`, `180 deg`, `360 deg`, liczba sztuk w szykach (`2`, `3`). Każda inna liczba to zmienna.

| Grupa | Zmienne (wartość startowa, mm) |
|---|---|
| Gałka | `kulaD` 60; `kulaScianka` 2; `kulaTylKat` 15° (czasza do 15° za równik); `kulaR` = `kulaD/2` |
| Kardan 5/5 | `kardanD` 11; `kardanL` 25,5; `kardanSrubaOd` 9,1; `kardanOtworD` 5; `kardanTrzpienGl` 6; `kardanB` = `kardanL/2`; `kardanA` = `kardanB − kardanSrubaOd` |
| Śruby | `m3Ciasny` 2,6; `m3Luzny` 3,3; `m5Ciasny` 4,3 (gwint w plastik, do próbki); `m5Luzny` 5,4; `m4Klucz` 2,5 (imbus wkrętu dociskowego, do potwierdzenia) |
| Powieki | `luzKulaPowieka` 0,5; `powiekaT` 2,0; `luzPowieki` 0,5; `powiekaDolR1` = `kulaR + luzKulaPowieka` (30,5); `powiekaDolR2` = `powiekaDolR1 + powiekaT` (32,5); `powiekaGorR1` = `powiekaDolR2 + luzPowieki` (33,0); `powiekaGorR2` = `powiekaGorR1 + powiekaT` (35,0); `powiekaRant` 3,5 (pogrubienie krawędzi); `powiekaOtwarcie` 75°; `ramiePowiekiR` 9 (górna), `ramiePowiekiDolR` 6 (dolna, 2c; przełożenie na orczyku podwójnym); `ramieGorX1` 33,0, `ramieGorX2` 34,5; `ramieDolX1` 30,5, `ramieDolX2` 32,5 |
| Rura i rant | `luzRuraPowieka` 0,5; `ruraWewR` = `powiekaGorR2 + luzRuraPowieka` (35,5); `ruraD` 76 (= rdzeń gwintu); `rantD` 96; `rantT` 3; `rantZ` 8 (przód rantu nad środkiem kuli); `kolnierzykD` = 2 × (√(`powiekaGorR2`² − `rantZ`²) + `luzRuraPowieka`) (69,2); `ruraTyl` 40 (koniec Rury za środkiem kuli) |
| Dynia | `otworD` 83; `dociskMin` 15; `dociskMax` 35 (ścianka dyni) |
| Gwint 45° | jak E2.0/v2.5: `gwintSkok` 5, `gwintH` 2, `gwintCzolo` 0,8, `gwintKat` 45°, `gwintZakladka` 0,4; `gwintRdzenD` = `ruraD` (76); `gwintD` 80; **`luzGwint` 0,20**; gwint od z = `rantZ − rantT − dociskMin + …` do `−ruraTyl` (zakres docisku 15–35) |
| Nakrętka | `nakretkaD` 94; `nakretkaH` 7; skrzydełka albo klucz (patrz „Do decyzji”) |
| Płyta serw | `plytaT` 3; `plytaZ` = `−ruraTyl`; mocowanie do Rury 3 × M3 (`plytaSrubyN` 3, `plytaSrubyR` 33) |
| Słupek | `slupekD` 12; `slupekTyl` = `plytaZ`; otwór pod trzpień M5 na osi Z |
| Uchwyt gałki | `punktR` 20 (punkty X i Y cięgien w płaszczyźnie z = 0); `uchwytT` 3; `uchwytZ` = `kardanB` (czoło przedniej piasty); 3 × M3 do gałki (`galkaSrubyR` 18) |
| MG90S (Miuzei MS60-4-D-V1, karta z pudełka 22.10: 22,4 × 12,1 × 22,8, wielowypust 20T Ø4,9, 180° przy 500–2500 µs, 1,8–2,0 kg·cm) | `serwoL` 22,4; `serwoW` 12,5; `serwoH` 22,8; `serwoUchaL` 31,8; `serwoUchaRozstaw` 27,7 (osie otworów uszu); `serwoUchaT` 2,0; `serwoUchaZ` 18 (spód → spód uszu); `serwoWalekZ` 35 (spód → czubek wałka); `serwoWalekOd` 5,5 (czoło → oś wałka, odczyt z rysunku ±0,5); `luzKorpusSerwa` 0,4; uszy M3×10 w Ø`m3Ciasny` (jak v2.8). **Źródło: rysunek „Product Size” Miuzei MG90S (Amazon, obraz 711P7m2xAPL) – korpus tam 22 × 12,5 × 22, karta z pudełka 22,4 × 12,1 × 22,8: przyjmuję większe. Orczyk jednoramienny (pomiar ze zdjęcia suwmiarki 22.10, ±0,3): 7 otworów ok. Ø1 co 2,0 mm, od osi wałka 5,5 / 7,5 / 9,5 / 11,5 / 13,5 / 15,5 / 17,5. Otwór roboczy rozwiercony do Ø2 pod M2 z nakrętką (sąsiednie otwory co 2 mm nie pozwalają na Ø2,5).** |
| Cięgna | `ciegnoT` 2,5; `ciegnoSzer` 6; `orczykRX` 11,5 (lewo–prawo), `orczykRY` 9,5 (góra–dół), `orczykRP` 9,5 (powieka) – tylko wartości 5,5 + 2k, pozycje serw: `serwoX…`, `serwoY…`, `serwoZ…` (zmienne, start z rachunku niżej) |

## Rachunek ruchu (sprawdzony przed planem)

- **Lewo–prawo ±25°:** punkt X (`punktR`, 0, 0) leży na osi pochylenia, więc pochylenie go nie rusza. Skok wzdłuż Z = 20 · sin 25° = 8,5 mm. Przy `orczykRX` 11,5 orczyk obraca się o ±48°.
- **Góra–dół ±15°:** punkt Y (0, `punktR`, 0) leży na osi obrotu przedniej piasty. Skok = 20 · sin 15° = 5,2 mm; `orczykRY` 9,5 → orczyk ±33°.
- **Powieka górna 0–75°:** ramię 9 mm → cięciwa 2 · 9 · sin 37,5° = 11,0 mm; `orczykRP` 9,5 → orczyk ±35°.
- **Kardan:** potrzeba ±25° / ±15°, przegub > 90° (pomiar użytkownika). Zapas duży.
- **Tylny brzeg gałki:** czasza do 15° za równik, brzeg na z = −7,8, r = 29,0. Przy obrocie 25° brzeg schodzi do z = −19,3. Słupek (r ≤ 6) i cięgna X/Y (r = 20 od osi, w ruchu razem z gałką na przednim końcu) mieszczą się w otworze. Kontrola w Assembly (etap 3).

## Odstępstwa od analizy z 18.10 (do zatwierdzenia)

1. **Powieki zagnieżdżone, nie równe.** Dwie czasze tego samego promienia na jednej osi zderzają się przy osi (obie dochodzą do bieguna na osi X). Dolna R30,5–32,5, górna R33,0–35,0, luz 0,5 między nimi i do kuli. Ścianka 2,0 zamiast 2,2.
2. **Rura wewnątrz Ø71 zamiast Ø70** (ściana 2,5 do rdzenia gwintu 76), bo górna powieka ma R35,0 i potrzebuje luzu ≥ 0,5 (tabela luzów: części ruchome obok siebie).
3. **Kołnierzyk (oczodół) Ø69,2 zamiast Ø66.** Przy rancie 8 mm nad środkiem kuli górna powieka (R35) przechodzi przez płaszczyznę rantu na promieniu 34,1; przy Ø66 zahaczyłaby o kołnierzyk. Kołnierzyk jest zmienną pochodną.
4. **Napęd powiek ramionami z boku, w szczelinie między kulą a Rurą.** Ramię górnej powieki leży w warstwie x 33,0–34,5 (1,5 mm), dolnej x 30,5–32,5 (2,0 mm), obie po tej samej stronie (+X), w środku zakresu skierowane do tyłu; cięgna biegną wzdłuż Z przy x ≈ 33,7 i x ≈ 31,5. Warunek: róg ramienia (x = 34,5, |y| = 9 · sin 37,5° = 5,5) ma √(34,5² + 5,5²) = 34,94 ≤ 35,0, czyli luz ≥ 0,5 do Rury R35,5. Ramię 12 mm z analizy (|y| 7,3 → 35,3) zahaczyłoby o Rurę. Ramię górne 1,5 mm to słaby punkt: alternatywa to płytka kieszeń w ścianie Rury na drodze ramienia (ściana 2,5 → 1,5 lokalnie).
5. **Oś powiek:** 2 × M3 przez ścianę Rury (Ø`m3Ciasny`), przez biegun górnej i dolnej powieki (Ø`m3Luzny`), jedna śruba na stronę na obie powieki. Ustalacz (2b): M3 przez Rurę w ramię dolnej powieki.
6. **Gwint Ø80 na rdzeniu Ø76** (profil E2.0, wysokość 2). Otwór 83 → 1,5 mm luzu na stronę.

## Części i operacje

Każda część we własnym folderze; Mirror dla par lewo/prawo; fazki na końcu folderu. Liczby operacji bryłowych to plan (budżet ≤ 15).

| # | Folder / część | Szkice (płaszczyzna → użycie) | Operacje bryłowe | Liczba |
|---|---|---|---|---|
| 0 | **Layout** | `Layout: osie` (Right): oś Z, oś Y, okrąg kuli R, łuki powiek, punkt X/Y cięgien → wszystkie; `Layout: płaszczyzny` = `cPlane` rant, koniec Rury, Płyta | 3 × cPlane | 0 bryłowych |
| 1 | **Gałka** | `Gałka: przekrój` (Right): łuk R30/R28 od bieguna przodu do 15° za równik → Revolve; `Gałka: piasty` (Front, offset) → Extrude 3 piast pod M3 | Revolve; Extrude piasta + Circular Pattern ×3; Hole M3 Ø2,6 (w piastach, bez przebicia przodu); Fillet brzegu | 5 |
| 2 | **Uchwyt gałki** | `Uchwyt: płyta` (płaszczyzna z = `uchwytZ`) → płyta z 3 uszami; `Uchwyt: ramiona` (Top/Right) → ramiona do punktów X i Y | Extrude płyta; Extrude ramię X; Extrude ramię Y; Hole M5 trzpień (osiowo, przez płytę); Hole M3 ×3 luźne do gałki (szyk); Hole M3 ciasne w punktach X, Y; Chamfer | 8 |
| 3 | **Słupek** (z Płytą serw, jedna część) | `Płyta: obrys` (płaszczyzna Płyty) → płyta Ø76 z wycięciami na cięgna; `Słupek` (Right) → Revolve | Extrude płyta; Revolve słupek; Hole M5 trzpień osiowo (śruba od tyłu, łeb w Płycie); Hole M3 ×3 do Rury (szyk); Extrude kieszenie MG90S ×3 (osobne położenia, nie szyk); Hole uszy serw (Mirror par uszu); Extrude REMOVE przepusty cięgien; Chamfer | ≤ 15 |
| 4 | **Rura** | `Rura: przekrój` (Right) → Revolve rant + kołnierzyk + rura; gwint jak v2.5 (helisa, profil, Sweep) | Revolve korpus; Helix; Sweep zwój; Boolean UNION; Hole M3 osi powiek + Mirror (YZ); Hole M3 Ustalacz; Hole M3 ×3 do Płyty (szyk, ciasne); Chamfer rantu | 9 |
| 5 | **Nakrętka** | jak v2.5 w skali: `Nakrętka: przekrój` → Revolve; zwój Sweep z helisy Rury | Revolve; Sweep narzędzie; Boolean SUBTRACT z offsetem `luzGwint`; skrzydełka albo klucz (szyk) | 5–8 |
| 6 | **Powieka górna** | `Powieka górna: przekrój` (Right): łuk R33/R35 w zakresie kąta + pogrubiony rant → Revolve wokół osi X o kąt szerokości; `Powieka górna: ramię` (płaszczyzna x = 34) → ramię | Revolve czasza; Revolve biegun (piasta osi) + Mirror; Extrude ramię; Hole M3 luźny w biegunach; Hole M3 w ramieniu; Fillet rantu | 7 |
| 7 | **Powieka dolna** | jak górna, R30,5/R32,5, ramię x = 31,5, długość 8 | jak górna | 7 |
| 8 | **Cięgna** X, Y, powieki górnej, powieki dolnej | `Cięgna: obrysy` (Top i Right; jeden szkic na płaszczyznę, kilka obszarów) | Extrude ×4 (każde własna bryła); Hole M3 luźne na końcach | 6 |
| 9 | **Szablon otworu** | `Szablon` (Front): okrąg `otworD`, uchwyt | Extrude; Extrude REMOVE (środek do odrysowania) | 2 |
| 10 | **Podgląd** (nie do druku) | kardan (2 walce `kardanD` × `kardanB` + krzyżak), 3 × MG90S z orczykiem, śruba M5 | Extrude/Revolve, bez booleanów z częściami | ok. 8 |

Wkręt M4 tylnej piasty leży na z = −`kardanA` = −3,65, wewnątrz kuli. Dokręca się go przed założeniem gałki: kolejność montażu Słupek + kardan → Uchwyt → gałka. Wkręt przedniej piasty na z = +3,65 dokręca się przed przykręceniem Uchwytu do gałki. W Uchwycie i Słupku nie trzeba otworów dostępowych.

## Luzy (pary)

| Para | Pasowanie | Luz |
|---|---|---|
| Kula – powieka dolna | ruchome obok siebie | 0,5 promieniowo |
| Powieka dolna – powieka górna | ruchome obok siebie | 0,5 |
| Powieka górna – Rura, kołnierzyk | ruchome obok siebie | 0,5 |
| Powieki na śrubie M3 osi | obrotowe na śrubie | Ø3,3 / M3 (0,15), luz osiowy 0,3 między biegunami i do Rury |
| Trzpień M5 – piasta kardana | stalowa śruba w stalowym otworze Ø5 | wg producenta; wkręt M4 dociska |
| Śruba M5 w Słupku / Uchwycie | ciasne w części nieruchomej | Ø4,3 w plastik (**próbka**) albo nakrętka M5 w kieszeni |
| Rura – Nakrętka | gwint 45° | `luzGwint` 0,20 |
| Rura – otwór w dyni | – | 1,5 na stronę (83 vs 80) |
| Cięgna na śrubach M3 | obrotowe | Ø3,3, luz osiowy 0,3 |
| Cięgno – sąsiednie części | ruchome obok siebie | ≥ 0,5 w całym zakresie (Assembly) |
| Gałka – Słupek, tylny brzeg – Rura | ruchome obok siebie | ≥ 0,5 przy ±25° / ±15° (Assembly) |
| MG90S w kieszeni | jak v2.8 | 0,4 |

## Druk (X1C, PLA 0,2)

Gałka biegunem przodu do góry (0,16, front bez szwu Z na przodzie, szew z tyłu); Uchwyt płytą na stół; Płyta ze Słupkiem płytą na stół; Rura rantem na stół; Nakrętka płasko; powieki biegunami poziomo, rantem na stół (podpory pod ramieniem – do sprawdzenia, w README); cięgna płasko; Szablon płasko.

## Budżet API (etap 2)

- Odczyt startowy liczników na początku etapu 2; próg bramki 20.
- Zapisy operacji: ok. 75 operacji i szkiców → ok. 75 × `POST /features`, ok. 10 edycji `featureid`.
- `featurespecs` 1, zmienne 2 (liczby, potem wyrażenia), `GET /features` ≤ 2 (start i odbiór), `bodydetails`/`boundingboxes` ≤ 25 (pomiary brył i K9).
- Razem ≤ 120 wywołań, w tym ≤ 2 `GET /features`. Zapas ≥ 40 na `GET /features` (licznik z 19.10: 95, odnawia się – odczyt na starcie).

## K9 – test zginania (plan)

| Zmienna | Min / max | Oczekiwany efekt |
|---|---|---|
| `kulaD` | 55 / 65 | gałka Ø, powieki i Rura rosną o połowę różnicy na promieniu; `kolnierzykD` za nimi |
| `kardanL` | 24 / 27 | Słupek i Uchwyt przesuwają czoła o ±`kardanL`/2 |
| `luzGwint` | 0,15 / 0,30 | średnica wewnętrzna zwoju Nakrętki ±0,3 |
| `punktR` | 18 / 22 | położenie otworów punktów X/Y i cięgien |
| `powiekaT` | 1,8 / 2,4 | R powiek, `ruraWewR`, `kolnierzykD` |

## Do decyzji (orkiestrator / użytkownik)

1. Odstępstwa 1–6 powyżej.
2. **Nakrętka:** klucz jak w małym oku (wymaga nowego klucza Ø94) czy skrzydełka (dokręcanie palcami)? Proponuję skrzydełka: duże oko montuje się raz.
3. **Śruba M5 w Słupku i Uchwycie:** w plastik Ø4,3 (krótka próbka) czy nakrętka M5 w kieszeni? Proponuję nakrętkę w kieszeni, bo trzpień przenosi cały moment z cięgien.
4. **MG90S:** pomiar przed etapem 2 (prześlę rysunek z zaznaczonymi wymiarami).
5. Położenie serw za Płytą (z −43 do −65, w obrysie Ø76) wyznaczę w szkicu Płyty i sprawdzę w Assembly (etap 3). Moduł za ścianką dyni 15 mm wychodzi ok. 55 mm, na granicy założenia z analizy.
