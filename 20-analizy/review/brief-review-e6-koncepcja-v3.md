# Weryfikacja poprawek koncepcji v3 dużego oka (E6.1c) – 23.10

Jesteś recenzentem. Dwóch recenzentów (Fable – Anthropic, Astra – OpenAI Codex) pracuje niezależnie; nie czytaj raportu drugiego z tej rundy (`…-v3-*.md`). Tylko do odczytu w repo. Zapisujesz wyłącznie swój raport. Po polsku. Wagi KRYTYCZNE / WAŻNE / DROBNE, liczby zamiast opinii, dla każdej uwagi miejsce, scenariusz porażki, poprawka albo test, pewność. Bez prognoz czasu.

## Zakres

To **weryfikacja poprawek**, nie trzecie pełne review. Architektura (kardan 5/5, pręty S–S M2/M5, 4 × MG90S, czworoboki powiek z drutem Ø1,2, Obejma) jest przyjęta po dwóch rundach i nie podlega ocenie. Oceniasz:

1. Czy **10 poprawek obowiązkowych** z `30-projekt/brief-e6-duze-oko-koncepcja-v3.md` jest wykonanych w `20-analizy/2026-10-23-duze-oko-2c-koncepcja-v3.md` – sprawdź liczbami, nie deklaracją (tabela „uwaga → co zrobiono” w v3).
2. Czy poprawki **nie wprowadziły nowych kolizji ani sprzeczności** – w szczególności: czopy M5 pochylone i wkręcone w Ramię 6 mm, pręty Ø5 z końcówką Ø9 × 5, przesunięcie serwa Y o +2,2 mm, wycięcia krawędzi gałki do 104°/106° i powieki górnej do 75°, okno ogranicznika (płyta 3 mm, zapas 0,52, zakres mechaniczny ±28,2°/±18,2°, otwór M4 na ±x), wspornik Słupka w Płycie i nowa kolejność montażu (dopinanie drutów przez okna tarczy), rampa rozruchu w kątach gałki z kinematyką odwrotną.
3. **Przemiatanie realizatora na pełnym modelu** – skrypty w `40-cad/narzedzia/e6-przemiatanie/` (też w scratchpadzie `/tmp/claude-1000/-home-rkp--claude-spares-spare-mfMMBV/81adf3b7-b77e-42b1-b39b-151f54c8e062/scratchpad/v3/`): czy model zawiera to, co deklaruje (przekroje, obudowy, nakrętki, zagięcia Z, klatka z uszami i kablami, płyta z grubością), i czy minimum 0,52 mm w pracy / 0,31 mm na ogranicznikach (końcówka Ø9 Y – czasza górnej powieki) jest prawdziwe. Ogranicznik może dać < 0,5 tylko w zamierzonym styku.
4. **Pytania blokujące** B1 (przeguby), B2 (orientacja wkrętu M4 kardana), B4 (ucho MG90S), B5 (głębokość ≥ 70 mm): czy są kompletne, czy warunki odrzucenia są dobrze policzone, i które części CAD można zacząć **przed** odpowiedziami (np. gałka, powieki, Rama) bez ryzyka przeróbki.

Pierwsze dwie rundy: `20-analizy/review/2026-10-22-e6-koncepcja-*.md` i `2026-10-23-e6-koncepcja-v2-*.md`.

## Raport

- Na końcu **werdykt jednym zdaniem:** TAK (do briefu CAD) / TAK PO POPRAWKACH – które orkiestrator wpisze wprost do briefu CAD / NIE – co jeszcze trzeba przeliczyć.
- Plik: Fable → `20-analizy/review/2026-10-23-e6-koncepcja-v3-fable.md`, Astra → `…-v3-astra.md`.
