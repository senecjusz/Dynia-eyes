# Brief review: moduł małego oka v2.5

Recenzent, tylko do odczytu. Obowiązują sekcje „Zasady dla recenzenta” i „Luzy montażowe” w `AGENTS.md` oraz lista `30-projekt/review-cad.md`. Odpowiedź po polsku, wynik jako jeden raport.

## Przedmiot

Pełne review v2.5 (10 części) przed wydrukiem testowym. Model zbudowany od nowa w Onshape (dokument „Oko F v2.5”) na podstawie v2.4 z SolidCrafta.

## Materiał

- Siatki do pomiarów: `40-cad/3mf/Oko F v2.5/` (10 plików, `unit="meter"`; narzędzie `40-cad/narzedzia/sprawdz_siatki.js` czyta jednostkę).
- Siatki v2.4 do porównania: `40-cad/3mf/Oko F v2.4/`.
- Co miało się zmienić: tabela „Do v2.5” w `20-analizy/review/2026-10-18-v2.4-polaczone.md` oraz decyzje z 19.10 w `30-projekt/decyzje.md` (gwint 45° skok 5, `luzGwint` 0,20, radełko, szczelina SG90 12,2 + 2 × 0,25, nowy dokument).
- Jak zbudowano: brief `30-projekt/brief-e2.1-v2.5-modul.md`, spis elementów v2.4 → v2.5 `40-cad/onshape/e2.1-specyfikacja.md`, plan `40-cad/onshape/e2.1-plan.md`.
- Kontrole wykonawcy: `40-cad/onshape/weryfikacja-v2.5.md`, `40-cad/onshape/e2.1b-eksport.md`.
- Dane v2.4: `30-projekt/plan-v2-modul-oka.md` (sekcja v2.4: łańcuch średnic, tabela luzów, połączenia), `40-cad/solidcraft/oko-f-v2.4.solidcraft` (zip z `document.json`).

## Pytania

1. Czy każdy punkt tabeli „Do v2.5” jest zrobiony? Liczby z siatek.
2. Regresje wobec v2.4: czy jakiś element z v2.4 zginął, zmienił się bez uzasadnienia w spisie albo ma inny wymiar (otwory, pogłębienia, wkładki, zaczepy, haczyki, ucha, prowadnice kabla, ograniczniki)?
3. Luzy: tabela luzów v2.4 policzona na siatkach v2.5, w tym wsuwanie kasety w gniazdo, sanek, tulejek od spodu i jarzma przez kasetę, oraz ruch oka ±33° (złożenia z mate'ami jeszcze nie ma; licz z położeń z v2.4 i obrotu brył, jak w poprzednich review).
4. Gwint 45° z luzem 0,20 i nakrętka z radełkiem: zazębienie, nawisy, druk.
5. DFAM: płaska strona na stół, nawisy, cienkie ścianki (≥ 2 mm tam, gdzie v2.4 tego wymagał).
6. Znane i otwarte: K6 (53 szkice zamiast 40) i odstępstwa przyjęte w raporcie weryfikacji. Oceń tylko, czy któreś z nich wpływa na wydruk albo działanie.

Dla każdej uwagi: waga (KRYTYCZNE / WAŻNE / DROBNE), miejsce, scenariusz porażki, poprawka albo test, pewność. Na końcu werdykt jednym zdaniem: czy v2.5 nadaje się do wydruku testowego.
