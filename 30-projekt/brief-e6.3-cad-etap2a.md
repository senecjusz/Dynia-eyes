# Brief E6.3 – CAD dużego oka, etap 2a (23.10)

**Rola: jesteś wykonawcą CAD** (zasady jak w `30-projekt/brief-e6.2-cad-etap1.md` i `AGENTS.md`; plan drzewa każdej części do orkiestratora przed zapisem; commity na swoją gałąź).

**Zasada od użytkownika (23.10):** nie czekamy na dane. Gdzie czegoś brakuje – najlepszy szacunek (*best educated guess*) ze źródłem, wpisany jako **zmienna**, żeby później tylko ją zmienić. Wątpliwość zapisz w planie i buduj dalej.

## Podstawa

Koncepcja v3.1 (`20-analizy/2026-10-23-duze-oko-2c-koncepcja-v3.1.md`), dane `30-projekt/e6-pomiary.md` (MG90S z rysunku; uszy na **M2×10 + nakrętka M2 w kieszeni**, kanał kabla z obu krótszych ścian), decyzje 22–23.10. Napęd gałki (pręty, Uchwyt, Ramiona X/Y) jest właśnie przerabiany na przeguby krzyżowe (v3.2) – **tych części nie budujesz w 2a**.

## Zakres 2a (wartości z v3.1, wszystko na zmiennych)

1. **Dokończenie części etapu 1** (ostatnie operacje w ich folderach): ucha wewnętrzne Ramy 100°/200°/310°; Gałka – nadlewy M3 (φ 210°/330°) i wycięcia `rimX`/`rimY` (wartości v3.1, szersze wycięcie pod pręt Y); Powieka górna – wycięcie `wyciecieG`, przycięcie tylnej krawędzi (v3.1: G 96,5°), zaczep drutu; Powieka dolna – przycięcie (D 76°) i zaczep drutu; przycięcie kącików (v3.1 pkt 5.3); Słupek – czop/spłaszczenie pod piastę Płyty według planu Płyty.
2. **Płyta**: tarcza ażurowa, 4 klatki MG90S (wymiary z rysunku Miuzei, `luzKorpusSerwa` 0,4, bloki uszu z kieszenią nakrętki M2), słupki stopu powiek 6 × 6, 3 słupki do uch Ramy, piasta wspornika Słupka z ramionami, okna montażowe drutów, kanały kabli z obu stron. Położenia serw X i Y według v3.1 jako zmienne – mogą się przesunąć po v3.2 (zgłoś, które operacje od nich zależą).
3. **Ramię PG i Ramię PD** (ramiona serw powiek z otworem na drut Ø1,6 i zębem ogranicznika).
4. **Przyrządy**: zero gałki, gięcie drutów Ø1,2 (długości łączników `lacznikG`/`lacznikD`).

## Budżet i proces

- Etap 2a: ≤ 160 żądań HTTP, `GET /features` ≤ 6 (licznik startowy sprawdź). Rok ok. 732 – w każdej wiadomości suma.
- Kolejność: plan dokończenia części etapu 1 → plan Płyty → Ramiona PG/PD → przyrządy. Po każdej części: odczyty, zrzut, stan, commit; dane do odbioru (features z encjami, znaczniki) co 2–3 części jednym `GET /features`.
- K9 na końcu 2a dla 3–5 zmiennych (np. `luzKorpusSerwa`, `zSerw`, `wyciecieG`) z pomiarem brył.
- Eksport przez API zablokowany (translations 10) – eksport ręczny przez użytkownika na koniec.
