# Brief E2.1: moduł małego oka v2.5 w Onshape (10 części)

Wykonawca CAD (sesja „Wykonawca CAD”). Obowiązuje cały `AGENTS.md`. Użytkownik czyta twój wątek i może pisać do ciebie bezpośrednio; jego słowo ma pierwszeństwo przed briefem.

## Cel

Parametryczny model modułu oka v2.5 w Onshape: 10 części do wydruku testowego. Wymiary, które będziemy stroić po wydrukach, są zmiennymi w Variable Studio.

**Części (każda we własnym folderze, w tej kolejności):** Gniazdo, Nakrętka, Kaseta, Jarzmo z miską, Sanki serwa, Ramię orczyka, Cięgno, Tulejka przegubu korby, Tulejka przegubu ramienia, Pokrywa tylna. Przyrządy (do wklejania piłeczki, centrowania orczyka) i widelec do zaczepów nie wchodzą w to zadanie. Bryły podglądowe (piłeczka, SG90, orczyk) tylko jeśli są potrzebne do sprawdzenia luzów, w osobnym folderze „Podgląd”.

## Źródła wymiarów

- `30-projekt/plan-v2-modul-oka.md`, sekcja v2.4: łańcuch średnic, zmiany, tabela luzów, połączenia i śruby.
- `40-cad/solidcraft/oko-f-v2.4.solidcraft` (zip z `document.json`: parametry i operacje v2.4) oraz `40-cad/solidcraft/README.md`: wymiary szkiców i parametry. To wzorzec **wymiarów**, nie sposobu modelowania (v2.4 był atomowy).
- `40-cad/3mf/Oko F v2.4/`: siatki do sprawdzenia geometrii.
- `30-projekt/decyzje.md`: obowiązujące decyzje; ostatnie trzy wiersze z 19.10 dotyczą v2.5.

## Zmiany względem v2.4

1. **Gwint 45°, skok 5**, profil jak w próbce E2.0 (`40-cad/onshape/e2.0-etap1b.md`, `40-cad/onshape/probka-gwintu-45.js`): rdzeń Ø58,9, gwint Ø62,9, wysokość zarysu 2,0, czoło 0,8. `luzGwint` jako zmienna, na start 0,3. Długość i położenie gwintu gniazda jak w v2.4 (strefa nakrętki w zakresie ścianki dyni 15–25 mm).
2. **Nakrętka** Ø74 × 7 z radełkiem i wycięciami na klucz, z fazą wejścia zwoju.
3. **Tabela „Do v2.5”** (`20-analizy/review/2026-10-18-v2.4-polaczone.md`): sanki jako jedna bryła z obiema prowadnicami, fazka 1 × 45° na przednim lewym narożu sanek (kolizja z kołnierzem tulejki H przy wsuwaniu), otwory dolne Ø8,7 (`otworDolnyD`), każdy parametr steruje obu elementami pary.
4. **Szczelina SG90** na 12,2 + `luzSanki`.

Bez zmian: koncepcja gniazdo + kaseta, zaczepy 33°/213°, haczyki i okienka 47°/227°, napęd i kąty, zakres ±30° (stop ±33°).

## Zmienne do strojenia (Variable Studio „Zmienne v2.5”)

Co najmniej: `luzGwint`, `luzSanki` (0,25), `luzOsiowy` (0,3), luz kaseta–gniazdo (0,25), `otworDolnyD` (8,7), szerokość szczeliny SG90, zacisk taśmy kabla, otwory M3 ciasny/luźny (2,6 / 3,3), wkładka M3 (Ø4 × 4, zapas dna 0,6), średnica piłeczki, szczelina na klej (0,5). Pełną listę podaj w planie.

## Gdzie

Dokument **SimpleEye**, nowa gałąź **„v2.5”** z wersji „v2.2 do review” (did `5bf3e9f6848edf7f1b0019a9`). W niej nowe Part Studio „Oko F v2.5” i Variable Studio „Zmienne v2.5”. Nie zmieniaj gałęzi v2 ani istniejących elementów.

## Etapy i zatrzymania

**Etap 1 (stop):** sprawdź logowanie do Onshape, utwórz gałąź i puste elementy. Potem dwa pliki:
1. **Specyfikacja `40-cad/onshape/e2.1-specyfikacja.md`:** dla każdej z 10 części każdy element z v2.4 (każda operacja z `document.json`, np. otwory śrub, pogłębienia, wkładki, kieszenie, szczeliny, fazki, zaczepy, prowadnice kabla) w wierszu: nazwa w v2.4 → do czego służy → wymiary i parametry → jak powstanie w v2.5 (albo: usunięte, dlaczego). Pokrycie musi być pełne: każda operacja v2.4 tych 10 części ma swój wiersz; podaj liczbę operacji v2.4 i liczbę wierszy.
2. **Plan `40-cad/onshape/e2.1-plan.md`:** lista zmiennych, tabela części z operacjami bryłowymi i szkicami (krótko), kolejność, budżet wywołań API, odstępstwa od zasad.

Zgłoś orkiestratorowi i czekaj na zatwierdzenie.

**Etap 2:** budowa część po części według zatwierdzonego planu (jedna bryła na uruchomienie skryptu, kontrola każdej operacji: stan z odpowiedzi zapisu, **ikony ostrzeżeń w drzewie** i znacznik szkicu; pomiar bryły wobec planu; folder). Po każdej części 2–3 linie w wątku. Potem runda K1–K9, K11 i **porównanie z v2.4**: dla każdej części objętość, wymiary obrysu i liczba otworów wobec siatki 3MF v2.4; każda różnica musi wynikać ze zmian v2.5 albo ze specyfikacji. Raport `40-cad/onshape/weryfikacja-v2.5.md`. Stop i zgłoszenie.

**Etap 3 (osobne zlecenie po etapie 2):** Assembly z mate'ami, ruch ±33°, wsuwanie części i tabela luzów.

## Ograniczenia

- Zasady API z `AGENTS.md`; budżet podaj w planie (licznik `GET /features` ok. 95, zostaw ≥ 40 na koniec).
- Pracujesz w swoim worktree i commitujesz na swoją gałąź: skrypty i raporty w `40-cad/onshape/` (`oko-f-v2.5-build.js`, `stan-api-v2.5.json`, plan, raport). Orkiestrator scala po odbiorze.
- Bez `/featurescript`, bez `Fix`, bez `sleep`.
