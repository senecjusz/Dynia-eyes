# E2.1 Oko F v2.5: weryfikacja modelu (K1–K11) i porównanie z v2.4

Dokument Onshape „Oko F v2.5” (folder Halloween), Part Studio „Oko F v2.5”, stan końcowy `sourceMicroversion` 95ea37eb5a2d7c8851d4c68a, 19.10.2026. Wykonawca CAD.
Stan i log wywołań: `40-cad/onshape/stan-api-v2.5.json`. Skrypt: `40-cad/onshape/oko-f-v2.5-build.js` (zaktualizowany o wszystkie poprawki z weryfikacji).

**API:** 247 wywołań w zadaniu E2.1 (budżet 260), `GET /features` 2 (budżet 8, licznik endpointu 93). Suma w roku: 131 (do E2.0) + 247 = **378**. Bez 429/402, bez wyjątku bramki. Jedno wywołanie stracone (232: błąd odczytu odpowiedzi w skrypcie, powtórzone jako 233).

## Wynik w skrócie

| # | Wynik | Uwagi |
|---|---|---|
| K1 | zaliczone | 154 operacje, 0 ikon błędu i ostrzeżenia w drzewie; każdy zapis z `featureStatus` OK |
| K2 | zaliczone | 53 wiersze szkiców w drzewie = 53 szkice w JSON, 0 niedookreślonych |
| K3 | zaliczone | `instanceCount` = `2` w dwóch szykach 180° przyjęte przez orkiestratora jako stała dozwolona (para z definicji) |
| K4 | zaliczone | 0 więzów `Fix` |
| K5 | zaliczone | 8 operacji Mirror/szyk, wszystkie pary i powtórzenia z planu |
| K6 | **otwarte** | operacje bryłowe w budżecie (Kaseta 23 ≤ 24 zatwierdzone); **szkiców 53 wobec 40 w planie** – 12 grup szkiców na wspólnej płaszczyźnie |
| K7 | zaliczone | zmienne w Variable Studio, layout pierwszy w drzewie |
| K8 | zaliczone | 53 szkice na płaszczyznach (Top/Front/Right lub cPlane), 0 na ścianach |
| K9 | zaliczone po poprawce | test zbiorczy (2 stany × 5 zmiennych naraz, decyzja orkiestratora ze względu na budżet); wykrył błąd zależności `podniesienieY`, poprawiony |
| K10 | do użytkownika | nazwy operacji i zmiennych |
| K11 | zaliczone | każda operacja w folderze swojej bryły, liczby w nazwach folderów zgodne |
| v2.4 | zaliczone | 10 brył: każda różnica objętości wyjaśniona liczbowo; obrysy zgodne do 0,01 mm; genus zgodny |

## Poprawki wykonane w trakcie weryfikacji

Wszystkie jako edycja jednej operacji (`featureid`), każda z kontrolą stanu i znacznika szkicu.

| Wywołanie | Część | Co było | Poprawka | Skąd wykryte |
|---|---|---|---|---|
| 227–229, 230–231 | Ramię, Cięgno | płyty i kieszeń jako „stadion” na stycznych (błąd odczytu v2.4 w spisie) | pas o stałej półszerokości wzdłuż osi + okręgi końcowe (`ramiePolSzer` 4, `ciegnoPolSzer` 3,5); kieszeń: prostokąt 2 × `kieszenPolSzer` 2,6 od O do T + R3,7 + R2,3 | objętość +18,5% / +8,2% wobec siatki v2.4, przekroje siatki |
| 234 | Jarzmo | korba bez obszaru wspólnego pętli 1 i okręgu piasty (12,7 mm² × 2,5 = 31,7 mm³) | Extrude na `qSketchRegion(szkic, false)` zamiast `true` (filterInnerLoops) | objętość −31 mm³, pętla wewnętrzna na ścianach y −3 / −0,5 |
| 236 | Sanki | Hole z czubkiem 118°: dno pod czubkiem 0,059 mm | `tipAngleStyle` FLAT: dno 0,60 pod całym otworem (płaszczyzna y −21,35) | ściany CONE w `bodydetails` |
| 237 | Gniazdo | spód rantu jako cięciwa (stożek) zamiast łuku dyni R150 – odstępstwo od spisu #1 | łuk R `#dyniaR`, środek na osi | ściana CONE r37 zamiast SPHERE |
| 238 | Nakrętka | czoło jako cięciwa zamiast łuku R130 – odstępstwo od spisu #18 | łuk R `#nakretkaCzoloR`, środek na osi | ściana CONE r38 zamiast SPHERE |
| 243 (VS) | Cięgno | `podniesienieY` stałe 2,1: przy `plytaT` 2 podniesienia oderwane od płyty (3 bryły) | `podniesienieY = #plytaT − #ciegnoY − #ramaZakladka` (nominalnie 2,1, geometria bez zmian) | K9 stan min |

Po poprawkach (wywołanie 245, przywrócone zmienne): 10 brył, objętości jak w tabeli niżej.

## Porównanie z v2.4 (siatki 3MF `40-cad/3mf/Oko F v2.4/`)

Objętość v2.5 z `massproperties` (`massAsGroup=false`), obrys z `bodydetails` (pudełka ścian; ściany śrubowe OTHER pominięte), v2.4 z siatek (`mesh.py`, Green / tetraedry). Narzędzia lokalne: `mtool.py` (przekroje płaszczyzną, objętość siatki w obszarze promieniami, szczeliny cięciw wobec walców).

| Część | V v2.5 [mm³] | V v2.4 [mm³] | Różnica | Obrys v2.5 (min / max) | Obrys v2.4 | Genus |
|---|---|---|---|---|---|---|
| Gniazdo | 32576,96 | 32556,87 | +20,1 (+0,06%) | ±37, z −45,7…0 | ±37, z −45,7…0 | 3 / 3 |
| Nakrętka | 7383,37 | 7765,48 | −382,1 (−4,9%) | ±36,99, z −31…−24 (ściany płaskie i sfera) | ±37, z −31…−24 | 1 / 1 |
| Kaseta | 35086,12 | 35056,89 | +29,2 (+0,08%) | x −29,6…28,23, y ±27,25, z −77,5…−1,5 | to samo | 10 / 10 |
| Jarzmo z miską | 1825,14 | 1819,20 | +5,9 (+0,3%) | x −6,16…21,96, y ±24,75, z −41,15…−6,14 | x −6,16…21,97, z −41,14…−6,14 | 3 / 3 |
| Sanki serwa | 1058,63 | 944,16 | +114,5 | x ±9,6, y −21,95…−17,6, z −77,4…−44,6 | to samo | 0 / 0 |
| Ramię orczyka | 793,76 | 793,66 | +0,1 | x −14,23…5,5, y −4,5…−0,5, z −71,5…−35,63 | to samo | 3 / 3 |
| Cięgno | 599,30 | 599,19 | +0,1 | x −13,43…11,58, y −0,3…5,3, z −44,83…−31,95 | to samo | 2 / 2 |
| Tulejka korby | 76,78 | 76,75 | 0 | x 3,38…11,38, y −3,8…−0,3 | to samo | 1 / 1 |
| Tulejka ramienia | 76,78 | 76,75 | 0 | x −13,24…−5,24 | x −13,23…−5,23 (punkt H −9,235 wobec −9,23) | 1 / 1 |
| Pokrywa tylna | 7963,33 | 7959,90 | +3,4 (siatka) | x ±29,67, y −38…27,25, z −80,5…−74 | to samo | 3 / 3 |

Pudełka ścian walcowych gwintu nakrętki są luźne (z −32,79…−22,70 z pudełka ściany R31,65); obrys z płaszczyzn i sfery czoła: z −31…−24.

### Bilans różnic

**Sanki +114,5** (analityka v2.5 = Onshape do 0,01):
- słupki 19,2 × (4,6 + 5,3) × 4,35 = 826,85;
- prowadnice 2 × (3,25 × 23,5 − 3,25 × 0,6) × 1,7 = 253,05;
- otwory −2 × π·0,81·3,75 = −19,09;
- fazka 1 × 45° na krawędzi 4,35 = −2,18;
- razem 1058,63.

W 3MF v2.4 brakuje jednej prowadnicy: Extrude NEW utworzył w v2.4 dwie bryły, a „Sanki serwa (2)” zgubiła się w eksporcie. Analityka v2.4 z jedną prowadnicą: 826,85 + 136,26 − 19,59 = 943,51; siatka 944,16 (wielokąty otworów).

Składniki różnicy:

| Składnik | mm³ |
|---|---|
| druga prowadnica | +126,53 |
| zwężenie prowadnicy (wewn. krawędź 6,1 → 6,35) | −9,73 |
| otwory 3,85 → 3,75, dno płaskie | +0,51 |
| fazka | −2,18 |
| siatka | −0,65 |

Okno SG90 w kasecie się nie zmieniło: 2 × (12,7/2 + 0,25) = 13,2, tak jak w v2.4. Zmieniła się tylko szczelina między prowadnicami sanek: 12,7 zamiast 12,2.

**Kaseta +29,2**

| Składnik | mm³ | Jak ustalone |
|---|---|---|
| otwory dolne Ø8,5 → Ø8,7 | −17,4 | siatka v2.4 w pierścieniach r 4,25–4,35, y −28…−19,75: C 8,57, H 8,81 |
| stożki 118° otworów wkładek | −10,1 | 2 × π·2²·1,202/3; v2.4: płaskie dno na tej samej głębokości 5,6 |
| szczeliny cięciw siatki v2.4 | +43,0 | ściany walcowe wokół Z (krok 3,75°, N = 96): R27,25 zewn. i R24,25 wewn. +46,0, otwory −3,0 |
| **reszta** | **+13,7 (0,04%)** | dokładność siatki 3MF v2.4 (ściany stożkowe i nieosiowe nieliczone); przyjęte przez orkiestratora |

**Gniazdo +20,1.** Strefy wzdłuż z: v2.5 liczone analitycznie, v2.4 z siatki promieniami. Analityka v2.5 = 32580,2 + ząbki ~8 − strzałka 4,2 ≈ 32584, czyli Onshape 32576,96 do 0,02%.

| Strefa z | v2.5 | v2.4 (siatka) | Różnica | Przyczyna |
|---|---|---|---|---|
| −34…−16 | 561,49 mm²/mm (rdzeń R29,45: 348,88 + grzbiet 45°: 5,6 mm² × 2π × 30,212 / 5 = 212,61) | 558,62 mm²/mm (przekroje −20 / −25,3 / −30: 558,67) | +51,7 | gwint 45° zamiast ISO |
| −16…−15 | 561,49 | 601,54 | −40,0 | wybieg gwintu ISO w v2.4 zaczynał się poniżej −15 |
| −36,7…−34 | 1487,42 | 1484,73 | +2,7 | koniec zwoju i stożek przycięcia |
| −45,7…−36,7 | 3035,12 + 77,28 | 3109,21 | +3,2 | rura R29,45 zamiast R29,5 (−80,5); ogon grzbietu nad stożkiem przycięcia z −37,7…−36,7 (+77,3) |
| z > −15 | geometria jak v2.4 (Pappus 17312,0) | 17306,3 | +5,7 | siatka |
| reszta | | | −3,2 | ząbki, fazki żebra |

Kontrola ścian v2.5 (`bodydetails`) zgodna z modelem:
- płaszczyzna stopnia z −15: 180,05 = 392,53 − 212,48;
- rdzeń R29,45: 1592,27;
- grzbiet R31,45: 654,46 (20,7 mm × 0,8/5);
- okienka 2 × 13,68 mm² w przekroju;
- rant: 2742,89 = π(36² − 20,5²) − strzałka 8,36.

**Nakrętka −382,1.** Analityka v2.5 7383,31 = Onshape 7383,37. Liczona jako całka (r, z) z udziałem rowka gwintu g(r) = w(r)/5, w(r) = 4,8 + 2·0,2·√2 − 2(r − 29,45). Weryfikacja: walec otworu R29,65 ma w Onshape 6,37 mm², z modelu 6,33.

Analityka v2.4 = 7768,2, siatka 7765,48 (−2,7, cięciwy).

Rowek ISO wzięty z siatki (przekrój w strefie czystej 1308,43 mm², pierścień 1440,14, czyli rowek 131,71 mm²/mm). Profil podstawowy daje 137,46, więc skalowany.

| Krok v2.4 → v2.5 | mm³ |
|---|---|
| czoło R130 od krawędzi otworu: w v2.4 łuk od r 30,2 i 0,1 nad czołem; v2.5 na r 37 o 0,25 mm głębsze | −136,8 |
| otwór R30,176 → R29,65 i gwint ISO → 45° z luzem 0,2 (rowek 226,78 mm²/mm) | −135,9 |
| radełko 24 × 0,837 mm² × 5,14 mm, bez części w wycięciach na klucz | −90,2 |
| fazy otworu 1 × 45° (większość obszaru jest już w rowku gwintu) | −22,0 |
| siatka v2.4 | +2,7 |

Wycięcia na klucz takie same w obu wersjach: 6 × 15,13 × 2,6 = 236,0.

**Odstępstwo od v2.4 zaakceptowane przez orkiestratora:** czoło nakrętki R130 zaczyna się od krawędzi otworu (spis #18), więc przy r 37 jest o 0,25 mm głębiej niż w v2.4. Czoło tylko dociska skórkę dyni.

**Jarzmo +5,9:** pełny okrąg piasty C w korbie v2.5 (+2,23 mm² × 2,5 = +5,6), reszta +0,3. Przekroje siatki v2.4 zgodne z analityką v2.5:

| y | v2.4 (siatka) [mm²] | v2.5 (analityka) [mm²] |
|---|---|---|
| 0 | 20,11 | 20,11 |
| 10 | 22,63 | 22,63 |
| 22 | 104,82 | 104,89 |
| 24 | 5,27 | 5,27 |
| −1,75 | 93,19 | 93,09 |

**Ramię +0,1, Cięgno +0,1** (po poprawce):
- przekrój siatki v2.4 płyty ramienia (y −1,75): 276,42 mm²;
- przekrój siatki v2.4 cięgna (y 0,4): 163,18 mm²;
- przekrój siatki v2.4 ramy (y −3,75): 68,41 mm², stadion R3,5 był poprawny.

**Tulejki, Pokrywa:** równe w granicach siatki.

## K1 – stan operacji

`GET /features` (wywołanie 246) zwraca `featureStates` = `{}`, tak samo jak w E2.0, więc K1 jest z drzewa w karcie:
- 154 operacje w JSON;
- skan całej listy (wirtualizowanej, wszystkie foldery rozwinięte): 154 wiersze, 0 wierszy z ikoną `error` i `warning`;
- każdy zapis w logu ma `featureStatus` OK.

Po każdej edycji z tej weryfikacji: `G.blad` dla wszystkich 154 operacji = brak.

## K2 – szkice

Skan drzewa: 53 wiersze szkiców (`sketch-button`) = 53 `BTMSketch-151` w JSON, 0 z `underdefined`. Wpisy kontroli szkiców po edycjach są w `stan-api-v2.5.json` → `szkice`:
- Ramię płyta, Ramię kieszeń, Cięgno płyta;
- Gniazdo profil, Nakrętka czoło.

Wszystkie „w pełni zdefiniowany”.

## K3 – stałe w wyrażeniach

385 wyrażeń w parametrach operacji i więzach szkiców. Po usunięciu `#zmiennych` zostają tylko stałe dozwolone (`0`, `90 deg`, `180 deg`, `360 deg`) z dwoma wyjątkami:

| Operacja | Parametr | Wyrażenie |
|---|---|---|
| Gniazdo: okienka | `instanceCount` | `2` |
| Kaseta: zaczep 213 | `instanceCount` | `2` |

Oba to pary obrócone o 180° (AGENTS: „szyk kołowy ×2”). **Decyzja orkiestratora 19.10:** `2` w `instanceCount` pary 180° to stała dozwolona.

## K4 – więzy

0 więzów `FIX` w 53 szkicach. Pełne zdefiniowanie każdej encji potwierdza K2.

## K5 – symetrie i szyki

| Operacja | Typ |
|---|---|
| Gniazdo: ząbki | circularPattern ×`#zabkiN` |
| Gniazdo: okienka | circularPattern ×2 |
| Nakrętka: radełko | circularPattern ×`#radelkoN` |
| Nakrętka: wycięcia na klucz | circularPattern ×`#kluczN` |
| Kaseta: oś, stop i kanał dół | mirror Front |
| Kaseta: ucho pokrywy 140 | mirror Right |
| Kaseta: zaczep 213 | circularPattern ×2 |
| Jarzmo: przycięcie, oczko i kołek dół | mirror Front |

Pary otworów z Hole (Kaseta: otwory osi, Sanki: otwory uszu, Cięgno: otwory i wkładki, Kaseta: otwory wkładek, Pokrywa: otwory śrub) to jedna operacja Hole z dwoma punktami. Mirror nie powiela Hole („Could not pattern selected features”, ustalone przy budowie).

## K6 – budżet operacji i szkice

Operacje bryłowe (bez szkiców, płaszczyzn i helisy):

| Część | Operacje | Budżet |
|---|---|---|
| Gniazdo | 10 | 15 |
| Nakrętka | 8 | 15 |
| Kaseta | 23 | 24 (odstępstwo 1, zatwierdzone) |
| Jarzmo | 8 | 15 |
| Sanki | 3 | 15 |
| Ramię | 6 | 15 |
| Cięgno | 3 | 15 |
| Tulejki | 4 | 15 |
| Pokrywa | 4 | 15 |

**Szkice: 53 wobec 40 w planie** (różnica +13; Gniazdo +1, Nakrętka +1, Kaseta +6, Sanki +2, Ramię +1, Cięgno +1, Pokrywa +1). 48 szkiców jest użytych przez jedną operację. Szkice na wspólnej płaszczyźnie w obrębie jednej części, każdy użyty przez jedną operację (kandydaci do scalenia według zasady „ograniczaj liczbę szkiców”):

| Płaszczyzna | Szkice |
|---|---|
| Front (Gniazdo) | profil, ząbek szkic, profil gwintu, przycięcie końca zwoju (spis #4: ząbek miał być w S-G1) |
| Front (Nakrętka) | przekrój, czoło szkic |
| Nakrętka: pl. tyłu | radełko szkic, klucz szkic |
| Kaseta: pl. występu | występ, szczelina stopu, kanał kołka (spis #29: w S-K2) |
| Kaseta: pl. otworów osi | oś szkic, otwór górny szkic |
| Kaseta: pl. otworów osi dół | oś dół szkic, otwory dolne szkic |
| Kaseta: pl. H | pogrubienie H szkic, wybranie H szkic (spis #88: w S-K15) |
| Sanki: pl. spodu | słupki szkic, prowadnice szkic (plan: 1 szkic S-S1) |
| Ramię: pl. ramy | rama orczyka szkic, kieszeń orczyka szkic (spis #121: w S-R2) |
| Tulejki: pl. kołnierza | kołnierz szkic, trzon szkic |

Wspólne płaszczyzny między częściami (Front dla Kasety i Jarzma; pl. zaczepów Gniazdo/Kaseta; pl. korby Jarzmo/Ramię; Kaseta: pl. tyłu z Pokrywą) nie dają się scalić, bo folder jest per bryła.

**Status: otwarte.** Decyzja orkiestratora 19.10: nie scalać w E2.1 (12 edycji przy 13 wywołaniach nie zostawia zapasu, budżetu w trakcie zadania się nie zmienia). Scalenie szkiców to osobne zadanie z nowym budżetem.

## K7 – kolejność

Wszystkie zmienne są w Variable Studio „Zmienne v2.5” (osobny element, przed Part Studio). Pierwsza operacja drzewa to `Layout: osie i punkty` (indeks 0). Zmienne dodane w weryfikacji (`ramiePolSzer`, `kieszenPolSzer`, `ciegnoPolSzer`) i zmiana `podniesienieY` są zapisane w VS przed edycjami, które ich używają.

## K8 – płaszczyzny szkiców

Wszystkie 53 szkice leżą na Top / Front / Right albo na operacji `cPlane`, 0 na ścianach brył.

## K9 – test zginania (zbiorczy)

Zgodnie z decyzją orkiestratora (budżet) test jest **zbiorczy**: w każdym stanie wszystkie 5 zmiennych zmienione naraz. Zmienne działają na różne wymiary, więc efekty się nie mieszają.

Przebieg każdego stanu:
1. jeden zapis VS;
2. jeden `bodydetails`;
3. kontrola ikon w drzewie (`featureStates` puste).

| Zmienna | Nominal | Min | Max | Mierzony wymiar | Oczekiwane min / nom / max | Zmierzone min / nom / max |
|---|---|---|---|---|---|---|
| `luzSanki` | 0,25 | 0,15 | 0,4 | Sanki: wewn. krawędź prowadnicy x = 6,1 + luz | 6,25 / 6,35 / 6,5 | ±6,25 / ±6,35 / ±6,5 |
| | | | | Kaseta: okno SG90 x = 6,1 + 2·luz | 6,4 / 6,6 / 6,9 | ±6,4 / ±6,6 / ±6,9 |
| `otworDolnyD` | 8,7 | 8,5 | 9 | Kaseta: promień otworów dolnych C, H | 4,25 / 4,35 / 4,5 | 4,25 / 4,35 / 4,5 (oba) |
| `plytaT` | 2,5 | 2 | 3 | Jarzmo: ściana korby y = −3 + T | −1 / −0,5 / 0 | −1 / −0,5 / 0 |
| | | | | Cięgno: góra płyty / góra podniesień | 1,7 / 2,2 / 2,7 ; 5,3 stała | min: rozpad (niżej) / 2,2 / 2,7 ; 5,3 |
| `luzGwint` | 0,2 | 0,15 | 0,3 | Nakrętka: otwór R = 29,45 + luz; grzbiet rowka R = 31,45 + luz | 29,6 / 29,65 / 29,75 ; 31,6 / 31,65 / 31,75 | 29,6 / 29,65 / (brak, niżej) ; 31,6 / 31,65 / 31,75 |
| `nakretkaH` | 7 | 6 | 8 | Nakrętka: tył z = −(24 + H) | −30 / −31 / −32 | −30 / −31 / −32 |
| | | | | Gniazdo: koniec z = −(dociskMax + H + 4,7 + 9) | −44,7 / −45,7 / −46,7 | −44,7 / −45,7 / −46,7 |

- Stany min i max: 0 błędów i ostrzeżeń w drzewie.
- **Stan min: 12 brył zamiast 10.** Cięgno rozpadło się na płytę (y −0,3…1,7) i dwie oderwane piasty (y 2,1…5,8), bo `podniesienieY` było stałe 2,1. Poprawka: `podniesienieY = #plytaT − #ciegnoY − #ramaZakladka`. Pozostałe dwa nowe identyfikatory to przenumerowane Tulejki i Pokrywa.
- Stan max (już z poprawką): 10 brył. Cięgno ma płaszczyzny y −0,3 / 0,7 (dno wkładki) / 2,7 (góra płyty) / 5,3 (góra piast), góra piast pozostaje stała.
- **Obserwacja `luzGwint`:** przy 0,3 walec otworu R29,75 znika, bo szerokość rowka 4,8 + 0,85 − 0,6 = 5,05 przekracza skok 5. Ząb nakrętki kończy się wtedy ostrzem na r ≈ 29,77. Przy nominalnym 0,2 płaska część zęba na otworze ma 0,034 mm (ściana R29,65: 6,37 mm²). Wynika to z profilu E2.0 (podstawa 4,8 na skoku 5), nie z budowy v2.5.
- Przywrócenie (wywołanie 245): objętości wszystkich 10 brył identyczne jak przed testem (tabela wyżej).

## K11 – foldery

Skan drzewa: każda z 154 operacji jest w folderze swojej bryły (prefiks nazwy = folder; „Tulejki:” w folderze Tulejka przegubu korby). Liczba operacji w folderze jest równa liczbie w nazwie folderu:

| Folder | Operacje |
|---|---|
| Layout | 1 |
| Gniazdo | 23 |
| Nakrętka | 13 |
| Kaseta | 58 |
| Jarzmo z miską | 17 |
| Sanki serwa | 8 |
| Ramię orczyka | 10 |
| Cięgno | 9 |
| Tulejka przegubu korby | 6 |
| Tulejka przegubu ramienia | 1 |
| Pokrywa tylna | 8 |

## Uwagi do procesu

1. **Wirtualizowana lista drzewa.** Wiersz w zwiniętym folderze albo poza oknem przewijania nie istnieje w DOM. Trzy zatrzymania kontroli wiersza (Ramię płyta, Jarzmo korba, Gniazdo profil) wynikały z tego, a nie z błędu modelu: po rozwinięciu i przewinięciu każdy szkic był w pełni zdefiniowany, bez błędu. `G.czekajNaWiersz` ma teraz skan przewijanej listy przed stopem (w skrypcie, razem z regułą karty ukrytej).
2. **`qSketchRegion(id, true)`** pomija obszary traktowane jak otwory przy nakładających się pętlach. Domyślne zapytanie `G.q.region` zostało `true`, korba jarzma ma `false`. Do sprawdzenia przy każdym szkicu z nakładającymi się pętlami.
3. **Hole BLIND** ma domyślnie czubek 118°. Przy otworach z wymaganym dnem trzeba ustawić `tipAngleStyle` FLAT. Otwory wkładek kasety mają stożek (z −71,9…−70,70), a ściana CONE jest pełna (14,66 mm² = π·2·2,333), więc nie ma przebicia. Grubości dna nad czubkiem nie mierzyłem; wkładka siedzi na długości 5,6 walca, jak w v2.4.
4. W liście części jest też „Curve 1” (helisa, bez masy); w 3MF się nie eksportuje.
5. Zmienna `kieszenR0` (2,6) jest od poprawki kieszeni nieużywana (zastąpiona przez `kieszenPolSzer`).

**Werdykt:** model v2.5 odpowiada v2.4 po wyjaśnionych zmianach i nadaje się do eksportu 3MF i review. Otwarte zostaje K6 (53 szkice wobec 40): scalenie jako osobne zadanie.
