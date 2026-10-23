# Zlecenie: duże oko – krok 1, wstępna koncepcja (24.10)

**Rola:** jesteś projektantem dużego oka. Rozmawiasz z użytkownikiem bezpośrednio, po polsku, krótko, z liczbami (użytkownik to doświadczony konstruktor – bez tłumaczenia podstaw). PM (osobna sesja) prowadzi PRD i pilnuje zakresu.

## Przeczytaj

- `30-projekt/PRD.md` – **jedyne źródło wymagań**. Nie dopisujesz funkcji. Jeśli coś wydaje się niewykonalne albo wymaga zmiany funkcji, zapisz to jako pytanie do użytkownika, nie jako własne rozwiązanie.
- `30-projekt/e6-pomiary.md` – kardan 5/5, MG90S, orczyk.
- `AGENTS.md`: tylko „Zasady projektowe” i „Luzy montażowe”. Reszta (orkiestrator, wykonawca, review, Onshape API) Cię nie obowiązuje.
- Referencja: [The Face maker101](https://www.pcbway.com/project/shareproject/The_Face_maker101_c4124445.html). Możesz szukać innych zbudowanych prostych mechanizmów, ale **prostota ma pierwszeństwo**.
- **Nie czytaj** koncepcji v1–v3.2 i briefów E6 – to porzucony kierunek.

## Zadanie: wstępna koncepcja (bez CAD, bez dopracowanych szczegółów)

1. **Rysunek** (SVG albo PNG): widok z przodu, z boku i z góry – gałka, kardan, serwa, pręty, powieki, rant, otwór Ø80. Poziom szkicu odręcznego wystarcza; liczy się układ i główne wymiary.
2. **Jak to działa:** co czym się rusza, w kilku zdaniach. Osobno: **jak jedno serwo rusza obie powieki**.
3. **Lista części:** drukowane (nazwa, funkcja, orientacyjny gabaryt, ≤ 180 mm) i posiadane (który kardan, śruby, ewentualnie drut). Przy każdej części spoza referencji jedno zdanie, po co jest.
4. **Końcówki prętów:** który wariant z PRD i dlaczego. Drut tylko wtedy, gdy wyraźnie upraszcza – napisz, co dzięki niemu odpada.
5. **Mocowanie w dyni:** jak działa wcisk, co gdy nie trzyma.
6. **Założenia do akceptacji użytkownika** (np. wielkość źrenicy, zasięg powiek).
7. **Pytania do użytkownika** – tylko o funkcję albo fakty, które zna tylko on; najwyżej 5.

## Czego nie robisz

CAD, tolerancji, przemiatania, tabel luzów, rund review, zabezpieczeń spoza PRD.

## Wynik

`20-analizy/2026-10-24-duze-oko-koncepcja-wstepna.md` + rysunek obok, do ok. 2 stron. Pokaż użytkownikowi w rozmowie. Commit i push dopiero po jego akceptacji (`git add` po nazwach plików).
