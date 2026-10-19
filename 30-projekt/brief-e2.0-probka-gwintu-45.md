# Brief E2.0: próbka gwintu 45°, skok 5, pięć luzów (Onshape)

Wykonawca CAD. Obowiązuje cały `AGENTS.md`, w szczególności „Modelowanie w Onshape” i „Praca z API Onshape”. To pierwsze zadanie na tych zasadach: liczy się zarówno próbka, jak i to, czy model jest parametryczny i czy dowody są kompletne.

## Cel

**Sześć brył w jednym Part Studio:** jeden trzpień z gwintem zewnętrznym i pięć nakrętek, każda z własnym luzem `luzGwint` = **0,2 / 0,25 / 0,3 / 0,35 / 0,4 mm** (promieniowo, odsunięcie ścian). Bez konfiguracji: wszystkie bryły istnieją naraz. Użytkownik drukuje je na docelowej drukarce, skręca i wybiera luz dla gniazda i nakrętki v2.5.

**Foldery:** po jednym na bryłę: „Trzpień”, „Nakrętka 0.20” … „Nakrętka 0.40”, zakładane ręcznie w interfejsie, operacje bryły trafiają do nich od razu.

## Geometria (z v2.2, gdzie ten profil wydrukował się poprawnie)

| Parametr | Wartość |
|---|---|
| Profil gwintu | trapez, flanki 45°, skok **5**, wysokość zarysu **2,0**, czoło zęba 0,8 osiowo, podstawa 4,8 osiowo; zarys wchodzi 0,4 w rdzeń (zakładka) |
| Trzpień (strona gniazda) | otwór Ø54,9, rdzeń gwintu Ø58,9, gwint zewnętrzny Ø62,9, faza początku zwoju; długość jako zmienna, tak dobrana, żeby dało się na nim sprawdzić każdą nakrętkę (układ nakrętek zaproponuj w planie) |
| Nakrętka | Ø74 × 7, otwór = rdzeń + 2 × `luzGwint`, gwint = zwój trzpienia odsunięty o `luzGwint`, fazy 1 mm na krawędziach otworu |
| Oznaczenie | luz czytelny po wydruku (karby albo napis); wybór w planie |

Wymiary bierz ze zmiennych, nie z tej tabeli wpisanej liczbą. Wzorzec poprzedniej budowy (tylko jako odniesienie geometrii, nie sposobu modelowania): `40-cad/onshape/oko-f-v2.2-build.js`, funkcje `profil` i `OS.probka`.

## Gdzie

- Dokument **„Probka gwintu 45”** w folderze TMP (już istnieje). Obecne Part Studio 1 zawiera poprzednią, odrzuconą wersję z konfiguracją: usuń je i załóż nowe Part Studio „Probka gwintu 45”. Nie zmieniaj żadnego innego dokumentu.
- Pracujesz w karcie `cad.onshape.com` w przeglądarce w aplikacji (sesja użytkownika, narzędzia `mcp__Claude_Browser__*`). Użytkownik patrzy na żywo.

## Kolejność i punkty zatrzymania

**Etap 1 (stop po nim).** Bramka `req()` i test znacznika są już zaliczone (`40-cad/onshape/e2.0-etap1.md`); bramkę wstrzyknij ponownie z licznikami z pliku stanu.
1. Test folderów: na jednym szkicu testowym załóż folder w interfejsie i sprawdź, gdzie trafia następna operacja zapisana przez API (do folderu czy za nim) i jak ją przenieść do folderu. Opisz procedurę krok po kroku, potem usuń elementy testowe.
2. Nowy plan drzewa: sześć brył, foldery, zmienne, szkice z użyciem, operacje w kolejności z przypisaniem do folderów, budżet operacji na bryłę i budżet wywołań API.

Zapisz wynik w `40-cad/onshape/e2.0-etap1b.md` i plik stanu, potem stop i zgłoś orkiestratorowi.

**Etap 2 (po zatwierdzeniu planu):** budowa operacja po operacji z kontrolą każdej operacji i szkicu, folder po folderze, runda weryfikacji K1–K9 i K11, raport `40-cad/onshape/weryfikacja-probka-gwintu-45.md`. Potem stop i zgłoszenie „gotowe do eksportu”.

## Ograniczenia

- Budżet wywołań API dla całego zadania: **≤ 30 odczytów `GET /features`** (licznik ok. 100), zapisy według planu z etapu 1, **≤ 200 wywołań łącznie**. Jeśli plan wymaga więcej, zgłoś to w etapie 1.
- Bez endpointu `/featurescript`, bez `Fix`, bez `sleep`.
- Nie commitujesz i nie robisz `git pull`: pliki (raporty, `stan-api.json`, skrypt `40-cad/onshape/probka-gwintu-45.js`) zostawiasz na dysku, commituje orkiestrator.
- Raporty po polsku, krótko, z liczbami.
