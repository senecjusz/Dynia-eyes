# Brief E6: duże oko w Onshape („Duże oko v1”)

Wykonawca CAD (sesja „Wykonawca CAD”). Obowiązuje cały `AGENTS.md`. Użytkownik czyta twój wątek i może pisać do ciebie bezpośrednio; jego słowo ma pierwszeństwo przed briefem. Użytkownik jest przeważnie poza komputerem: plany zatwierdza orkiestrator.

## Cel

Parametryczny model dużego oka z powiekami. **Geometria od razu pod poziom 2c** (dwie powieki sprzężone na jednym serwie, ruch lewo–prawo i góra–dół), **pierwszy wydruk 2b**: dolna powieka zablokowana śrubą Ustalacz. Przejście 2b → 2c ma wymagać tylko jednej nowej części (Cięgno powieki dolnej), bez zmian Rury i Płyty serw. Plan awaryjny 2a: oś góra–dół zablokowana śrubą, serwo nr 2 niemontowane. Model ma to umożliwiać bez przeróbek.

## Źródła

- `20-analizy/2026-10-18-duze-oko-jedna-noc.md`: architektura, wymiary startowe, lista części, połączenia, ryzyka. To podstawa; odstępstwa podaj w planie.
- `30-projekt/decyzje.md`, wiersze z 22.10 (dokument, 2c/2b, Ø 60, kardan 5/5, gałka biała, rozmieszczenie) oraz 21.10 (M3 w plastik zamiast M2 i wkładek).
- `30-projekt/opis.md`, „Poziom 2”: podpoziomy 2a/2b/2c.
- Gwint 45°, skok 5 jak w Gnieździe małego oka: `40-cad/onshape/e2.0-etap1b.md`, `40-cad/onshape/probka-gwintu-45.js`, `luzGwint` 0,20 (tabela luzów w `AGENTS.md`). Sposób budowy gwintu i Nakrętki z klucza możesz przejąć z „Oko F v2.5” (tylko odczyt, niczego tam nie zmieniaj).

## Ustalenia (nie zmieniaj bez zgody)

| Element | Wartość |
|---|---|
| Gałka | `kulaD` 60, czasza ok. 210°, ścianka 2, tył otwarty; **front gładki** (bez rowków, wkładek, szwów, napisów) – tęczówkę rysuje syn; druk źrenicą do góry |
| Otwór w dyni / rant | 83 / 96; środek kuli 8 mm pod powierzchnią rantu |
| Środek gałki | **metalowy przegub kardana 5/5** z warsztatu, nie drukowany Krzyżak: Ø 11 × 25,5 (pomiar), otwory Ø 5 w obu piastach, wkręty dociskowe M4, zgięcie > 90° (pomiar użytkownika). Środek krzyżaka = środek kuli. Jedna piasta na trzpieniu M5 w Słupku, druga na trzpieniu M5 w Uchwycie gałki |
| Serwa | 3 × MG90S (lewo–prawo ±25°, góra–dół ±15°, powieki 0–75°); bryła PODGLAD MG90S do kolizji |
| Śruby | M3/M4/M5 z kompletu 8–50 mm; uszy MG90S na M3×10 w Ø 2,6 (jak v2.8); części montowane raz – M3 w plastik Ø 2,6 zamiast wkładek; części rozkręcane (Płyta serw do Rury) – zaproponuj w planie |
| Rozmieszczenie | duże oko na środku frontu, po 3–4 małe oczy z każdej strony; wszystko za rantem w obrysie Ø 76, moduł za ścianką dyni ≤ 55 mm |

**Wymiary kardana (E6.1, odczyt orkiestratora ze zdjęć suwmiarki 22.10, ±0,2):** długość czoło–czoło `kardanL` 25,5 (karta produktu podaje 24 – obowiązuje pomiar); oś sworznia krzyżaka → oś wkrętu M4 `kardanSrubaOd` 9,1. Obie połówki są jednakowe, więc środek krzyżaka = `kardanL`/2 od czoła (12,75), a oś wkrętu M4 = `kardanL`/2 − `kardanSrubaOd` od czoła (3,65). Głębokość otworu Ø 5: płytszy z dwóch ma 7 (pomiar użytkownika); trzpień M5 wchodzi w piastę na `kardanTrzpienGl` 6 (decyzja użytkownika: zapas 1 mm do dna). Model ma się przestawić samą zmianą tych zmiennych – to jeden z punktów testu zginania K9. Wkręt M4 musi być dostępny kluczem po montażu (otwór dostępowy w Słupku/Uchwycie albo dokręcanie przed wsunięciem – zaproponuj w planie).

## Części (każda we własnym folderze)

Rura (rant, kołnierzyk, gwint, osie powiek), Nakrętka, Płyta serw ze Słupkiem, Uchwyt gałki, Gałka, Powieka górna, Powieka dolna, Cięgno X, Cięgno Y, Cięgno powieki górnej, Cięgno powieki dolnej (2c), Szablon otworu. Podgląd (osobny folder, nie do druku): kardan 5/5, MG90S × 3 z orczykami, śruby trzpieni. Ustalacz to śruba, nie część. Kolejność i ewentualne scalenia uzasadnij w planie.

## Etapy i zatrzymania

**Etap 1 (stop):** sprawdź logowanie do Onshape (jeśli wylogowany, napisz w wątku i czekaj). Utwórz dokument **„Duże oko v1”** w folderze Halloween (ten sam co „Oko F v2.5”), w nim Part Studio „Duże oko v1” i Variable Studio „Zmienne duże oko”. Potem plan `40-cad/onshape/e6-plan.md`:
1. Zmienne z wartościami i zależnościami, lista dozwolonych stałych.
2. Szkic layoutu: środek kuli, osie kardana, oś powiek, płaszczyzna rantu, płaszczyzna Płyty serw.
3. Dla każdej części: operacje bryłowe (typ, nazwa, zmienne), szkice i ich użycie, Mirror i szyki, płaska strona na stół, budżet ≤ 15.
4. **Tabela luzów każdej pary** (rodzaj pasowania, luz nominalny), w tym powieki–gałka, powieka–powieka, cięgna–Rura w całym zakresie ruchu, gałka–Rura przy ±25°/±15°, trzpienie M5 w piastach.
5. Budżet wywołań API (odczytaj liczniki na starcie, zostaw ≥ 40 na `/features`) i odstępstwa od zasad.
Zgłoś orkiestratorowi i czekaj na zatwierdzenie.

**Etap 2:** budowa część po części według zatwierdzonego planu (jedna bryła na uruchomienie, kontrola każdej operacji: stan z odpowiedzi zapisu, ikony ostrzeżeń i znacznik szkicu w drzewie, pomiar bryły wobec planu, folder). Po każdej części 2–3 linie w wątku i wpis w pliku stanu. Potem runda K1–K11; raport `40-cad/onshape/weryfikacja-e6.md`. Stop i zgłoszenie z hashem commita.

**Etap 3 (osobne zlecenie):** Assembly z mate'ami: ruch ±25° / ±15° / powieki 0–75° bez kolizji, łącznie z łbami śrub i PODGLAD MG90S; kupon testowy pasowań.

## Ograniczenia

- Zasady API z `AGENTS.md`: jedna bramka `req()`, bez `/featurescript`, bez `Fix`, bez `sleep`, stop przy 429/402.
- Worktree i własna gałąź; pliki w `40-cad/onshape/`: `duze-oko-v1-build.js`, `stan-api-e6.json`, plan, raport. `git add` po nazwach. Orkiestrator scala po odbiorze.
- Dokumentów „Oko F v2.5” i SimpleEye nie zmieniaj.
