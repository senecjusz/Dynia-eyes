# Brief: krytyczne review koncepcji połączeń cięgien – duże oko v2

Jesteś recenzentem, tylko do odczytu: bez zmian w repo, bez commitów, bez `git pull`. Piszesz po polsku.

## Kontekst

Dynia na Halloween z ruchomym okiem, składana hobbystycznie przez ojca z synem.

Użytkownik odrzucił obecne cięgna: drut Ø1,0 z zagięciami Z o odcinkach 2–2,5 mm i długością trafianą co do ułamka mm. Jego słowa:
- „to nie jest CNC”;
- „ja nie będę tego robił do ułamka milimetra”;
- „nie będę kupował niczego”;
- „nie będę skomplikowanych mechanizmów o mikroskopijnych elementach drukował, bo ten wydruk się nie uda”;
- zarzut wobec projektanta: traktuje wszystko jak CNC albo model 3D, bez zastanowienia, jak to się składa hobbystycznie.

## Materiał

- Koncepcja do oceny: `20-analizy/2026-10-24-duze-oko-polaczenia-ciegien.md` i rysunki `40-cad/druty/polaczenia-ciegien-hobby.svg` (rysunki to to, co dostanie użytkownik – oceń, czy są zrozumiałe i zgodne z modelem).
- Model: `40-cad/openscad/duze-oko-v2.scad`, moduły Galka (ucha z klepsydrą), PowiekaGorna/PowiekaDolna (dźwignie r 7), UchwytSerw.
- Skrypty: `40-cad/narzedzia/duze-oko-kinematyka.js`, `duze-oko-katy-przegubow.js`, `duze-oko-kolizje.js`; parametry w `40-cad/narzedzia/duze-oko-v2-parametry.json`.
- Montaż i kalibracja: `40-cad/openscad/duze-oko-v2-montaz.md`, `50-elektronika/kalibracja/`.
- Wymagania: `30-projekt/PRD.md`. Zasady: `AGENTS.md` (luzy, DFAM, preferencja śrub M3–M5).

## Pytania

1. **Wykonalność w ręku.** Czy każdy krok montażu (p. 7) da się wykonać kombinerkami z dokładnością ±2 mm i ±10°? Wskaż każdy krok, który i tak wymaga precyzji albo przyrządu.
2. **S1, S2.**
   - Czy połączenie „L + zagięty koniec” w uchu z klepsydrą i otworem prostopadłym do drutu da przegub o zakresie z p. 4 (±~40°) bez zakleszczenia? Podaj kąty graniczne.
   - Czy błąd długości ±2 mm (zero orczyka przesunięte o ±6,5° / ±8,5°) mieści się w zakresie serwa i nie daje kolizji? Jeśli możesz, policz to skryptami.
3. **Powieki.**
   - Czy rachunek 8,4° na 1 mm jest poprawny?
   - Czy P-A (drukowane łączniki o stałej długości, sworznie z drutu) jest wykonalna przy W2: ścianki, oczka, otwór Ø1,4, dźwignia r 7, otwór fabryczny orczyka?
   - Czy jest prostsze rozwiązanie bez nowych zakupów i bez zmiany liczby serw?
4. **Luki.** Czego koncepcja nie uwzględnia: luz, wypadanie, zużycie PLA na sworzniu Ø1, sprężynowanie drutu, dostęp narzędziem w gałce?
5. **Drut już zgięty.** Użytkownik ma drut zgięty na Z (noga 2,5 mm) z przyrządu. Czy da się go wykorzystać (odcięcie Z, nowe L) – policz minimalną długość.
6. **Porównanie.** Czy któraś odrzucona opcja (P-B, P-C, przeguby kulowe drukowane, pręty drukowane z oczkami M3) jest lepsza przy warunkach W1–W4? Uzasadnij liczbami.

## Zasady

- Nie dopisuj funkcji. Propozycje zmiany funkcji (np. 4 serwa) wypisz osobno, jako decyzje dla użytkownika.
- Wagi: KRYTYCZNE / WAŻNE / DROBNE. Każda uwaga: miejsce, scenariusz porażki, poprawka albo test, pewność.
- Liczby zamiast opinii. Oddzielaj pomiar, obliczenie i założenie.
- Na końcu werdykt jednym zdaniem: czy koncepcja nadaje się do przeprojektowania modelu, czy wymaga zmian i jakich.
- Raport zapisz do pliku: Astra → `20-analizy/review/2026-10-24-polaczenia-ciegien-astra.md`, krytyk Opus → `20-analizy/review/2026-10-24-polaczenia-ciegien-opus.md` (jedyny plik, który wolno zapisać).
