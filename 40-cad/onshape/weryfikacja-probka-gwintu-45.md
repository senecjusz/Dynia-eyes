# E2.0 próbka gwintu 45: weryfikacja modelu (K1–K9, K11)

Wykonawca CAD, 19.10.2026, 11:03–11:17. Plan: `40-cad/onshape/e2.0-etap1b.md`. Surowe dane: `40-cad/onshape/stan-api.json` (klucze `F`, `szkice`, `log`, `etap2.pomiary`, `etap2.weryfikacja`, `etap2.czasy`). Skrypt: `40-cad/onshape/probka-gwintu-45.js`. Plik stanu i skrypt leżą w głównym checkoucie repo (nieśledzone); ten raport powstał w worktree sesji wykonawcy (`.claude/worktrees/heuristic-brattain-6e5ce2`), bo hook blokuje zapis Write do głównego checkoutu.

Dokument „Probka gwintu 45” (TMP), Part Studio **„Probka gwintu 45”** (`3011db72b94295d3b75ca7d2`): https://cad.onshape.com/documents/c6697bd7b3b9a1043b66ae1f/w/6446e4139a3cb81b769891c3/e/3011db72b94295d3b75ca7d2

**Wynik: wszystkie kryteria zaliczone. Gotowe do eksportu 3MF.** Zastrzeżenie: Part Studio 1 (odrzucona wersja) nadal jest w dokumencie, do ręcznego usunięcia.

## Bryły (pomiar z `bodydetails`; z i R z płaszczyzn i walców, x/y z `boundingboxes`)

| Bryła | Folder (operacje) | z min / max | Walce R | Ściany | Zgodność |
|---|---|---|---|---|---|
| Zwój (narzędzie, zużyty w trzpieniu) | Wspólne: oś i gwint (6) | −2,4 / 61,4 (czoła profilu z = 0 i 59) | 29,05; 31,45 | 8 | tak |
| Nakrętka 0.20 | Nakrętka 0.20 (4) | 8 / 15 | 29,65; 31,65; 37 | 12 | tak, odchyłka 0 |
| Nakrętka 0.25 | Nakrętka 0.25 (5) | 17 / 24 | 31,70; 37 | 15 | tak po decyzji (a) |
| Nakrętka 0.30 | Nakrętka 0.30 (5) | 26 / 33 | 31,75; 37 | 19 | tak, odchyłka 0 |
| Nakrętka 0.35 | Nakrętka 0.35 (5) | 35 / 42 | 31,80; 37 | 23 | tak, odchyłka 0 |
| Nakrętka 0.40 | Nakrętka 0.40 (5) | 44 / 51 | 31,85; 37 | 27 | tak, odchyłka 0 |
| Trzpień | Trzpień (4) | 5 / 54 | 27,45; 29,45; 31,45; **brak 29,05** | 8 (+ stożek 45°) | tak |

- Nakrętki: x od −37 do 36,992 (karb na +X), y ±37. Liczba brył typu SOLID = 6.
- **`boundingboxes` nie jest ciasne** przy powierzchniach helikoidalnych: zwój y ±36,324 przy R 31,45; trzpień x od −32,45; z nakrętek ±1,8 mm. Wartości z i R biorę z `bodydetails`, zgodnie z planem.
- **Brak walca 29,05 w trzpieniu:** końce zwoju są przycięte (dół płaski na z = 5, góra ścięta stożkiem 45° od R 29,45 na z = 54).

### Rozbieżność z planem i decyzja (a) orkiestratora

Od luzu 0,25 nakrętka nie ma walca otworu. Zwój poszerzony o L ma na promieniu otworu szerokość osiową 4,8 + 0,828·L, czyli ≥ skok 5 dla L ≥ 0,2415. Średnicę wewnętrzną tworzy wtedy grzbiet flank, R = max(29,45 + L; 29,35 + 1,414·L):

| L | 0.20 | 0.25 | 0.30 | 0.35 | 0.40 |
|---|---|---|---|---|---|
| R wewnętrzny | 29,650 (otwór) | 29,704 | 29,774 | 29,845 | 29,916 |
| ponad 29,45 + L | 0 | +0,004 | +0,024 | +0,045 | +0,066 |

Luz na flankach i w dnie rowka wynosi dokładnie L (dno rowka R = 31,45 + L, pomiar). W nakrętce 0.20 z otworu zostaje pasek szerokości 0,034 mm osiowo; slicer go pominie. Orkiestrator przyjął to jako wariant (a) o 11:10. Oczekiwana liczba ścian: 8 + 4n z otworem, 7 + 4n bez otworu (n = liczba karbów).

## Kryteria

| # | Wynik | Dane |
|---|---|---|
| K1 | **zaliczone** | Wszystkie zapisy zwróciły `featureStatus` = OK (34 operacje + 1 edycja). `GET /features` zwróciło `featureStates` = `{}`, więc stan sprawdziłem w drzewie karty: 34 operacje bez ikon ostrzeżenia i błędu; 7 zwiniętych folderów bez `list-warning-inside`. **Poprawka w trakcie:** „Trzpień: przycięcie końców zwoju i faza wejścia” miało w drzewie ostrzeżenie „1 missing selection” przy OK w odpowiedzi zapisu. W zakresie było zapytanie o zwój, a ten po UNION nie jest już osobną bryłą. Edycja `featureid` (zakres tylko „Trzpień: rdzeń”) usunęła ostrzeżenie; pomiar trzpienia bez zmian. |
| K2 | **zaliczone** | 10 szkiców w JSON = 10 wierszy szkiców w drzewie (rozwinięte foldery, dwie pozycje przewinięcia), 0 niedookreślonych. Ślad każdego szkicu w `stan-api.json` → `szkice` (featureId, data-id, podpowiedź, czas od odpowiedzi 0–27 ms, microversion). |
| K3 | **zaliczone** | 91 wyrażeń w operacjach i wymiarach szkiców. Po usunięciu `#zmiennych`, `+`, `-` i nawiasów zostają tylko stałe `0 deg` (start helisy) i `360 deg` (Revolve), obie z listy dozwolonych. Variable Studio: wyrażenia ze stałymi `2`, `/ 2`, `1` i `tan()`, dozwolonymi w planie. |
| K4 | **zaliczone** | 0 więzów `Fix`. Więzy: COINCIDENT do Origin i między odcinkami, H/V, DISTANCE `#zmienna` do Origin, DIAMETER `#gwintRdzenD`. Pełne zdefiniowanie potwierdza K2. |
| K5 | **zaliczone** | Karby nakrętek 0.25–0.40 to `Circular pattern` (FEATURE) operacji karbu, liczba `#karbyN2…N5`, kąt `#karbKat`. Par do odbicia brak (plan). |
| K6 | **zaliczone** | Operacje bryłowe: Wspólne 1 (Sweep), Nakrętka 0.20 3, 0.25–0.40 po 4, Trzpień 3 (+ Sweep z folderu Wspólne = 4), wszystkie ≤ 15. Szkice użyte przez jedną operację (profil gwintu, okrąg helisy, 5 przekrojów, przycięcie trzpienia) są uzasadnione w planie (obszar wybierany całym szkicem). |
| K7 | **zaliczone** | Variable Studio przed Part Studio; kolejność: 2 szkice layoutu → helisa → profil, karb → Sweep → nakrętki 0.20…0.40 → trzpień; każda operacja po swoich wejściach. |
| K8 | **zaliczone** | 7 szkiców na Front, 3 na Top; żadnego na ścianie operacji. |
| K9 | **zaliczone** | Tabela niżej: 6 stanów + przywrócenie, za każdym razem 6 brył i foldery bez ostrzeżeń. |
| K10 | do oceny użytkownika | Nazwy operacji „Bryła: co robi”, zmienne w `etap2.listaZmiennych` (50). |
| K11 | **zaliczone** | 34/34 operacji z wcięciem 19 px (w folderze), 7 folderów jak w planie, pasek wycofania poza folderami (wcięcie 0). |

### K9: test zginania (Variable Studio → `bodydetails`)

| Zmiana | Oczekiwane | Zmierzone |
|---|---|---|
| `nakretkaH` 5 mm | trzpień z 5/44; nakrętki od z 8, 15, 22, 29, 36, grubość 5 | 5/44; wszystkie 5 nakrętek z płaszczyznami Z i Z + 5 |
| `nakretkaH` 10 mm | trzpień z 5/69; nakrętki od z 8, 20, 32, 44, 56 | 5/69; wszystkie 5 |
| `gwintRdzenD` 56.9 mm | trzpień R 27,45/28,45/30,45; nakrętka 0.20 R 28,65/30,65/37; 0.30 R 30,75/37 | jak oczekiwane |
| `gwintRdzenD` 60.9 mm | trzpień R 27,45/30,45/32,45; 0.20 R 30,65/32,65/37; 0.30 R 32,75/37 | jak oczekiwane |
| `luzNakretka3` 0.10 mm | tylko 0.30: R 29,55/31,55/37 (otwór wraca, L < 0,2415) | 29,55/31,55/37; 0.25 i 0.35 bez zmian |
| `luzNakretka3` 0.60 mm | tylko 0.30: R 32,05/37 | 32,05/37; 0.25 i 0.35 bez zmian |
| przywrócenie | stan wyjściowy | trzpień 5/54, R 27,45/29,45/31,45; nakrętki jak w tabeli brył |

Ograniczenie: stan operacji w K9 sprawdzałem ikonami folderów zaraz po `bodydetails`, bez osobnego czekania na regenerację w karcie.

## Odstępstwa i zdarzenia

1. **Part Studio 1 nieusunięte:** klasyfikator uprawnień harnessu zablokował `DELETE /elements` (żądanie nie zostało wysłane). Decyzja orkiestratora: użytkownik usunie je ręcznie (prawy klik na karcie > Delete). Assembly 1 w dokumencie też pochodzi z poprzedniego podejścia; nie ruszałem go.
2. **Boolean, pierwsza próba = HTTP 400:** w skrypcie był enum `SUBTRACT`, poprawna wartość to `SUBTRACTION`. Nic się nie zapisało; poprawiona jedna operacja, bryła dokończona bez ponownego wysyłania szkicu i korpusu.
3. **Variable Studio:** pierwszy POST 400 (zły format ciała: `[{variables:[...]}]`, poprawnie sama tablica). Potem 2 zapisy: wartości liczbowe, a następnie wyrażenia. Nowe Part Studio od razu miało referencję do całego Variable Studio.
4. **Ostrzeżenie „missing selection” niewidoczne w odpowiedzi zapisu** (K1). Wniosek do AGENTS.md (do decyzji orkiestratora): stan z odpowiedzi nie wystarcza, potrzebny jest też odczyt ikon `warning-overlay` i `list-warning-inside` w drzewie.
5. **`GET /features` zwraca puste `featureStates`** (v12, `includeGeometryIds=false`). K1 oparte na drzewie w karcie.
6. W kontroli po edycji zakresu użyłem jednorazowego oczekiwania 1,5 s na odświeżenie wiersza (zamiast MutationObservera), wbrew zasadzie 7.

## API (bramka `G.req`, jedno żądanie naraz, bez 429/402, bez `/featurescript`)

- W tym zadaniu (od 19.10, z etapem 1 i 1b): **131 wywołań łącznie** (≤ 200), **`GET /features` 4** (≤ 30, licznik 95). Etap 2: 81 wywołań.
- Etap 2: 34 zapisy operacji (+1 odrzucony 400) i 1 edycja `featureid`; 3 zapisy zmiennych (1 × 400) + 7 w K9; 15 `bodydetails`, 7 `boundingboxes`, 9 `currentmicroversion`; po 1: `featurespecs`, `variablestudioreferences`, POST nowego Part Studio i `GET /features`.
- Liczniki na końcu: `GET /features` 95, `POST /features` 2997, `POST /features/featureid` 3000, `POST variables` 2994, `bodydetails` 485, `currentmicroversion` 400.

## Czasy (start skryptu → koniec z folderem i pomiarem)

| Bryła | Skrypt | Całość |
|---|---|---|
| Wspólne: oś i gwint | 4,2 s | 36 s |
| Nakrętka 0.20 | 1,2 + 1,7 s | 41 s (z poprawką enuma) |
| Nakrętka 0.25 | 3,3 s | 31 s |
| Nakrętka 0.30 | 3,2 s | 19 s |
| Nakrętka 0.35 | 3,2 s | 20 s |
| Nakrętka 0.40 | 3,0 s | 18 s |
| Trzpień | 2,2 s | 29 s |

Budowa 11:05–11:13 (z 2-minutowym stopem na decyzję), weryfikacja 11:13–11:17.

## Eksport (użytkownik)

3MF, Custom, kąt 3°, odchyłka 0,01 mm, Part Studio „Probka gwintu 45”: 6 części (Part 1–6). Bryły leżą współosiowo w stosie (nakrętki nakręcone na trzpień), więc w slicerze trzeba je rozdzielić. Potem kontrola `40-cad/narzedzia/sprawdz_siatki.js`.
