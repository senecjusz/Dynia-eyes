# Brief E2.1b: nazwy części i eksport v2.5

Wykonawca CAD. Obowiązuje `AGENTS.md`. Dokument „Oko F v2.5” (did `21ca65b874071b352b43ebad`), Part Studio „Oko F v2.5”. Model jest odebrany (E2.1), geometrii nie zmieniasz.

1. **Nazwy części** = nazwy folderów: Gniazdo, Nakrętka, Kaseta, Jarzmo z miską, Sanki serwa, Ramię orczyka, Cięgno, Tulejka przegubu korby, Tulejka przegubu ramienia, Pokrywa tylna. Kontrola: lista części z API = te 10 nazw, każda dokładnie raz, każda bryła w folderze o tej samej nazwie.
2. **Eksport** każdej części osobno do `40-cad/3mf/Oko F v2.5/`, plik `Oko F v2.5 - <nazwa części>.3mf`: kąt 3°, odchyłka 0,01 mm. Jeśli API nie daje 3MF, STL binarny z tymi samymi tolerancjami i informacja w raporcie.
3. **Kontrola po eksporcie:** `node 40-cad/narzedzia/sprawdz_siatki.js "40-cad/3mf/Oko F v2.5"` = 0 błędów (przy błędach `napraw_siatki.js` i ponowne sprawdzenie); liczba plików = 10 = liczba części; objętość każdej siatki wobec objętości z raportu `40-cad/onshape/weryfikacja-v2.5.md` (różnica do 0,5%).
4. Raport krótki w `40-cad/onshape/e2.1b-eksport.md` (tabela: część, plik, trójkąty, wynik kontroli, objętość siatki wobec modelu), commit na swoją gałąź, wiadomość do orkiestratora z hashem.

Budżet: **≤ 80 wywołań łącznie, ≤ 2 odczyty `GET /features`**. Bez zmian w geometrii, bez `/featurescript`.
