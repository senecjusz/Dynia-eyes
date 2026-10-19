# Brief E3.5: próbka gniazd wkładek M3 (Onshape)

Wykonawca CAD. Obowiązuje cały `AGENTS.md`, w szczególności „Modelowanie w Onshape” i „Praca z API Onshape”.

## Po co

Wkładki M3×4×5 (długość 4, Ø5, podwójne radełko) wtopione w gniazda Ø4,0 (`wkladkaD`) rozdęły piasty Cięgna v2.5 na obwodzie i Ramię nie wchodzi na Cięgno (wydruk 20.10). Decyzja 20.10: `wkladkaD` 4,0 → ok. 4,4, wartość potwierdzić próbką. Użytkownik nie ma wierteł 4,2–4,8, więc próbka ma gniazda w pięciu średnicach. Po wtopieniu wkładek użytkownik mierzy średnicę piast i sprawdza, czy wkładka nie obraca się pod śrubą M3.

## Geometria: piasty takie jak w Cięgnie v2.5

| Parametr | Wartość | Zmienna |
|---|---|---|
| Listwa (płyta) | grubość 2,5, szerokość 9, długość wg rozstawu piast | `plytaT`, nowe: `listwaSzer`, `listwaL` |
| Piasta | Ø7,6, góra 5,6 nad spodem listwy (jak Cięgno: płyta 2,5 + podniesienie 3,1) | `piastaD`, `piastaH` |
| Liczba i rozstaw piast | 5 piast co 12 mm | `piastyN`, `piastyOdstep` |
| Gniazdo wkładki | od góry piasty, głębokość 4,6 (`wkladkaL` 4 + `wkladkaZapas` 0,6) | `wkladkaL`, `wkladkaZapas` |
| Średnice gniazd | **4,0 / 4,2 / 4,4 / 4,6 / 4,8** | `wkladkaD1`…`wkladkaD5` |
| Otwór pod gniazdem | Ø3,3 przelotowo | `m3Luzny` |
| Oznaczenie | numer gniazda 1–5 czytelny po wydruku, np. nacięcia na boku listwy przy piaście; wybór w planie | |

Druk spodem listwy na stół, piasty do góry (jak Cięgno). Bez podpór.

## Gdzie

- Nowy dokument **„Probka wkladek M3”** w folderze TMP (obok „Probka gwintu 45”), jedno Part Studio „Probka wkladek M3”, jedna bryła „Probka wkladek M3”, jeden folder. Jeśli API nie założy dokumentu w folderze TMP, poproś użytkownika w swoim wątku, żeby go założył, i czekaj.
- Nie zmieniaj żadnego innego dokumentu, w szczególności „Oko F v2.5”.
- Pracujesz w karcie `cad.onshape.com` w przeglądarce w aplikacji. Na starcie sprawdź, że Onshape jest zalogowany; jeśli nie, napisz w swoim wątku i czekaj.

## Kolejność

1. `git merge main` w swoim worktree (gałąź jest 5 commitów za `main`; ten brief jest na `main`).
2. Plan drzewa (zmienne, dozwolone stałe, szkice i ich użycie, operacje, szyki) do zatwierdzenia przez orkiestratora, w pliku `40-cad/onshape/e3.5-plan.md`. Piasty jako szyk liniowy ×`piastyN`. Gniazda o różnych średnicach jako operacje `Hole`; jeśli wymaga to więcej niż 15 operacji bryłowych, uzasadnij w planie.
3. Budowa według zatwierdzonego planu, kontrola szkicu znacznikiem w drzewie jak w E2.0.
4. Runda K1–K9 i K11, raport `40-cad/onshape/weryfikacja-e3.5.md`. K9: `piastyOdstep` i `wkladkaD3` min/max.
5. Commit na swoją gałąź (`git add` po nazwach), wiadomość do orkiestratora z hashem: „gotowe do eksportu”. Eksport 3MF robi użytkownik ręcznie, jak w E2.1b.

## Ograniczenia

- Budżet: **≤ 60 wywołań łącznie, ≤ 3 odczyty `GET /features`**. Jeśli plan wymaga więcej, zgłoś to przy planie.
- Bez endpointu `/featurescript`, bez `Fix`, bez `sleep`. Stan w `40-cad/onshape/stan-api.json`.
- Raporty po polsku, krótko, z liczbami. Po zakończeniu stop; bez kolejnych zadań.
