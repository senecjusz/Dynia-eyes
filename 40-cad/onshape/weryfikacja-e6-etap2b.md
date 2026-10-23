# Weryfikacja E6.6 – etap 2b (napęd gałki i słupki stopu)

Wykonawca CAD, 23.10, mikrowersja `dc51fef594e5dbfee41afb19`. Surowe dane:
- `odbior-e6/k1-k8-e6.6-koniec.json` (K1–K8);
- `odbior-e6/znaczniki-e6.6-koniec.json` (111 szkiców);
- `stan-api-e6.json` → `e66` (sekcje `kompletY`, `slupkiStopu`, `k9`, `odbior2b`).

Zakres etapu:
- **P4 z poprawkami:** przeguby przelotowe a1, a2 skrócone.
- **Nowe części:** Uchwyt i Łapy ×2, Ramię X i Ramię Y, komplet pręta Y (Krzyżak gałki Y, Krzyżak orczyka Y, Pręt Y, Widełki pręta przy orczyku Y), słupki stopu na Płycie.

## K1–K11

| # | Wynik | Dane |
|---|---|---|
| K1 | **zaliczone** | 349 operacji, 353 stany (pełny `GET /features`), 0 ≠ OK |
| K2 | **zaliczone** | 111 szkiców w JSON = 111 wierszy w drzewie, 0 niedookreślonych; skan po rozwinięciu 19 folderów, ze zrzutem ekranu po każdym przewinięciu |
| K3 | **zaliczone z wyjątkami** | 1738 wyrażeń. 220 to wyjątek zatwierdzony w planie Uchwytu pkt 7 (n·`#oknoKrok`, n·`#zebroKrok`) albo zero (`0 mm`). Do decyzji orkiestratora jedno: `Uchwyt: łączniki` `instanceCount` 3 (liczba łączników w szyku) |
| K4 | **zaliczone** | 941 encji, 2805 więzów, 0 Fix, 0 encji bez więzu |
| K5 | **zaliczone** | Mirror i szyki zgodnie z planami (Uchwyt: łączniki PART ×3, Łapa PART) |
| K6 | **zaliczone, wyjątki zatwierdzone** | Komplet Y 11, Ramię X 8, Ramię Y 8, P4 14, Łapa 5; Uchwyt 18 i Płyta 41 to wyjątki D4 |
| K7 | **zaliczone** | 0 odwołań do operacji późniejszych w drzewie |
| K8 | **zaliczone** | wszystkie szkice na płaszczyznach standardowych albo cPlane |
| K9 | **zaliczone po poprawce** | niżej |
| K10 | użytkownik | nazwy operacji „Część: co robi”, części nazwane jak w planach |
| K11 | **niezaliczone dla nowych części** | foldery Uchwyt, Łapa Uchwytu, Ramię X, Ramię Y, Komplet Y i operacje słupków w folderze Płyty: przy ukrytym panelu „Add selection to folder…” nie działa niezawodnie (operacje leżą na końcu drzewa, poza folderami) |

## K9 – test zginania

Plan: `e6.6-plan-k9.md` (b075fe9). Bryły mierzone `bodydetails`: ramka bryły, ściany płaskie ⊥ x, promienie walców.

| Zmienna | baza → test | Wynik |
|---|---|---|
| `uGal_cP` | 5,5 → 6,5 | Pręt X (P4) i Pręt Y: dno szczeliny widełek 85,5 → 86,5, koniec trójkątów 90,25 → 91,25; koniec przy gałce bez zmian – **zgodne** |
| `uOrcz_cS` | 8,25 → 8,75 | P4 Widełki stałe O: x max +0,5; Ramię X: z min −0,483, x max +0,099; Ramię Y: z min −0,44, x max +0,236 (podstawa widełek 0,5 dalej od H wzdłuż obróconego kierunku) – **zgodne** |
| `pktRY` | 20 → 20,5 | 1. przebieg: **ERROR** w `Uchwyt: widełki Y (bryła/szczelina)` i `sworzeń a1 widełek Y (otwór)`; widełki zniknęły (y max −0,89). Po poprawce: y max Uchwytu +0,5, walce bez zmian (otwory R0,8 są), 0 błędów – **zgodne** |
| `pretY` | 46,179 → 47,179 | 1. przebieg: **ERROR** w `Komplet Y: oś a1 O` i `oś a2 O` (otwory nie powstały). Po poprawce: Krzyżak orczyka Y i Widełki pręta Y +1,0 w x, Pręt Y koniec czopu 117,579 → 118,579, otwory R0,9 / R0,8 są, 0 błędów – **zgodne** |

- **Przyczyna błędów:** obszar szkicu wybierany `qContainsPoint` z punktu policzonego z wartości startowych. Po przesunięciu płaszczyzny (`pktRY`) albo profilu w płaszczyźnie (`pretY`) punkt leży poza obszarem.
- **Poprawka:** 5 operacji edytowanych na `qClosestTo(qSketchRegion(…), punkt)`, czyli obszar najbliższy punktowi, odporny na przesunięcia.
- **Ryzyko w pozostałych częściach:** ten sam wzorzec mają pozostałe operacje z obszarami. K9 sprawdził 4 zmienne; inne zmienne położenia mogą dać ten sam błąd. Przy zmianie zmiennej położenia: `GET /features` (K1) i pomiar brył. Kandydat do Parkingu: przejście na `qClosestTo` we wszystkich operacjach z obszarami.
- **Po przywróceniu wartości:** wszystkie ramki brył identyczne z pomiarem bazowym, 27 brył.

## Wywołania API

Etap 2b: 271 z 320 (GET /features 6 z 8). E6: 752, rok: 1310.
