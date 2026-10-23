# E6.3 etap 2a – runda weryfikacji K1–K11

Wykonawca CAD, 23.10.2026. Dokument „Duże oko v1”, stan `sourceMicroversion` 95f92025b31b72e2c5826688 (po K9, wartości przywrócone). Brief `30-projekt/brief-e6.3-cad-etap2a.md`; plany `e6.3-plan-dokonczenie-etapu1.md`, `e6.3-plan-plyta.md`, `e6.3-plan-ramiona-przyrzady.md`.

**Zakres:** dokończenie części etapu 1 (Rama: ucha z gwintem M3 i fazką; Gałka: nadlewy na płaszczyźnie krawędzi, wycięcia X/Y; powieki: wycięcie, przycięcia przy zaczepach, zaczepy drutu, kąciki; Słupek: czop 1 mm ze spłaszczeniem), Płyta (tarcza, 4 klatki MG90S, bloki uszu M2 + nakrętka, kanały i otwory kabli, wspornik ze słupkami ze stożkiem pod fazkę uch, gniazdo M5, kieszeń Słupka), Ramię PG, Ramię PD, przyrząd do gięcia drutów. **Poza zakresem:** słupki stopu powiek (kolizje z korpusem S_X i wieżyczkami – przekazane do v3.2), przyrząd zera gałki (decyzja użytkownika). 11 brył, 219 operacji, 71 szkiców.

**API:** etap 2a 291 z 300, `GET /features` 7 z 7; E6 razem 465; w roku 558 + 465 = **1023**. Bez 429/402, bez `/featurescript`.

## Surowe dane

- `odbior-e6/features-e6.3-koniec.json` – `GET /features` (bez parametrów; z `includeGeometryIds=false` odpowiedź nie ma `featureStates`).
- `odbior-e6/znaczniki-e6.3-koniec.json` – znaczniki 71 szkiców (skan drzewa z rozwiniętymi folderami).
- `odbior-e6/k1-k8-e6.3-koniec.json` – `40-cad/narzedzia/e6-kontrola-k.py`.
- `stan-api-e6.json` → `etap2a` (log, pomiary `bodydetails` po każdej części, `K9`).

## Wyniki

| # | Kryterium | Wynik | Dane |
|---|---|---|---|
| K1 | `featureStatus` = OK | **TAK** – 223 stany, 0 ≠ OK | features JSON |
| K2 | szkice zdefiniowane, wiersze = JSON | **TAK** – 71 = 71, 0 niedookreślonych, 0 ostrzeżeń | znaczniki |
| K3 | tylko stałe z listy | **TAK** – 697 wyrażeń, 0 naruszeń | k1-k8 |
| K4 | 0 Fix, encje związane | **TAK** – 0 Fix, 0 wolnych encji | k1-k8 |
| K5 | pary przez Mirror | **TAK z wyjątkiem zatwierdzonym:** kąciki powiek – para ±x w jednym szkicu, jeden obrót na pasmo (Mirror FEATURE/FACE obrotów nie działa); nadlewy Gałki – Mirror FEATURE + FACE; brak par w Płycie i ramionach | k1-k8 |
| K6 | budżet operacji | Rama 9, Gałka 7, P6 1, PG 13, PD 11, Słupek 5, Obejma 6, **Płyta 38 (wyjątek D4)**, Ramię PG 4, Ramię PD 4, Przyrząd 2 | k1-k8 |
| K7 | zmienne i layout przed użyciem | **TAK** (kolejność VS: zmienna odwołuje się tylko do wyższych – błąd `nadlewZ1` poprawiony) | features JSON |
| K8 | szkice na płaszczyznach | **TAK** – wszystkie na Top/Right/Front albo `cPlane` | k1-k8 |
| K9 | test zginania | **TAK po poprawce** – niżej | stan `K9` |
| K10 | nazwy | do oceny użytkownika; bez duplikatów | – |
| K11 | operacje w folderach | **TAK** – Rama 16, Gałka 13, P6 1, PG 30, PD 22, Słupek 12, Obejma 14, Płyta 81 (tarcza 3, klatki 16, bloki i ucha 41, wspornik i słupki 16, kieszeń Słupka i kable 5), Ramię PG 9, Ramię PD 9, Przyrząd 4 | drzewo |

### K9

| Zmienna | Zmiana | Oczekiwane | Zmierzone | Wynik |
|---|---|---|---|---|
| `luzKorpusSerwa` | 0,4 → 0,6 | kieszenie klatek ±0,2 | y −35,65→−35,85, −19,65→−19,85; z −66,3→−66,5, −43,1→−42,9; 11 brył | OK |
| `zSerw` | −49 → −48 | serwa X/Y/PD +1 w z | **1. próba: Płyta na 7 brył** (klatki oderwane od tarczy); po poprawce (spód klatek = `tarczaZ1`): kieszenie +1, piasta PD z −48, wierzch górnych bloków −37,3 (0,3 pod ramionami wspornika), 11 brył | OK po poprawce |
| `wyciecieG` | 83,5 → 85,5 | krawędź tylna PG 75° → 77° | 77° | OK |
| `ramiePGb` | 135,62 → 140 | koniec Ramienia PG (2,68; −47,14) | (2,68; −47,14) | OK |
| przywrócenie | – | jak baza | identycznie | OK |

## Druk (do README)

- **Płyta:** tarczą w dół. Kieszenie nakrętek M2 górnych uch leżą 0,15 mm od kieszeni korpusu (śruba 0,25 za ścianką klatki); jeśli ta ścianka się nie wydrukuje, nakrętkę i tak blokuje korpus serwa (luz 0,4). Przegroda S_X–S_PD 0,7 mm – nienośna. Łeb dolnej śruby M2 z podkładką wystaje 0,25 za tarczę (moduł +0,25 w B5).
- **Ramię PG / PD:** płasko, stroną orczyka do stołu; pogłębienie Ø4,5 przebija dno nad piastą (łeb M2 na orczyku).
- **Przyrząd gięcia:** płytką w dół, kołki do góry.
- **Gałka:** krawędzią tylną na stole (nadlewy w płaszczyźnie krawędzi).

## Werdykt

Części z zakresu 2a spełniają K1–K9 i K11 (K10 – ocena użytkownika). K9 wykrył oderwanie klatek od tarczy przy zmianie `zSerw` – poprawione i powtórzone. Eksport 3MF – ręcznie (translations 10). Do wydruku testowego po decyzjach: słupki stopu (v3.2), przyrząd zera.
