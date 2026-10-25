# Brief: krytyczne review koncepcji v2 – druty gięte ręcznie (duże oko v2)

Jesteś recenzentem, tylko do odczytu: bez zmian w repo, bez commitów, bez `git pull`. Piszesz po polsku.

## Kontekst

Dynia na Halloween, mechanizm oka składany hobbystycznie z synem. Koncepcja v1 połączeń cięgien nie przeszła review (raporty `20-analizy/review/2026-10-24-polaczenia-ciegien-astra.md` i `-opus.md`). Koncepcja v2 bierze z nich poprawki.

Ustalenia z użytkownikiem (24.10):
- druty gięte kombinerkami z dokładnością ±2 mm i ±10°, można je doginać ponownie po przyłożeniu;
- źródłem problemu było projektowanie, które zakłada gięcie co do ułamka milimetra, a nie sam drut;
- nie zmieniamy konstrukcji, żeby ominąć drut: obie powieki zostają ruchome na jednym S3;
- nic nie kupujemy;
- żadnych drobnych, kruchych wydruków.

## Materiał

- Koncepcja: `20-analizy/2026-10-24-duze-oko-druty-v2.md`.
- Rysunek dla użytkownika: `40-cad/druty/druty-v2-giecie-reczne.svg`. Rysunki to to, co dostanie użytkownik: oceń, czy są zrozumiałe bez znajomości projektu i zgodne z koncepcją.
- Model i narzędzia jak w v1: `40-cad/openscad/duze-oko-v2.scad`, `40-cad/openscad/kolizje-v2.txt`, `40-cad/narzedzia/duze-oko-*.js`, parametry `40-cad/narzedzia/duze-oko-v2-parametry.json`.
- Zasady: `AGENTS.md`, `30-projekt/PRD.md`.

## Pytania

1. **Tolerancja.** Czy cały łańcuch (Z z luzem, V, kalibracja zera) przyjmie błąd ±2 mm / ±10° na każdym zagięciu? Policz zakres poprawki V i porównaj z najgorszym sumarycznym błędem długości.
2. **V.**
   - Czy V w środku drutu przenosi pchanie i ciągnięcie bez zmiany długości pod obciążeniem (sprężystość V, wyboczenie)? Podaj liczby.
   - Gdzie w modelu V ma miejsce (S1, S2, PG, PD) i w którą stronę ma wychodzić?
3. **Z z długim środkiem.** Czy luz osiowy ~3 mm jest dopuszczalny dla gałki i powiek (błąd kąta, stuk, zmiana zera z kierunkiem ruchu)? Czy kąty ~90/95/105° i próba „wolny koniec trafia w otwór” wystarczą?
4. **Miejsce ≥ 2 mm.** Czy cel ≥ 2 mm wokół drutów jest osiągalny zmianami z tabeli 3.3? Gdzie nie i co wtedy?
5. **Powieki.** Czy procedura „zero S3 na jedną powiekę, V na drugim drucie” daje domknięcie obu bez przeciążenia S3? Jaka dokładność?
6. **Rysunek.** Czego brakuje, żeby użytkownik zgiął i złożył druty bez pytań: rzuty, kąty, kierunki V, strona wkładania?
7. **Luki.** Czego koncepcja nie uwzględnia?

## Zasady

- Nie dopisuj funkcji. Zmiany funkcji wypisz osobno, jako decyzje dla użytkownika.
- Wagi: KRYTYCZNE / WAŻNE / DROBNE. Każda uwaga: miejsce, scenariusz porażki, poprawka albo test, pewność.
- Liczby zamiast opinii. Oddzielaj pomiar, obliczenie i założenie.
- Na końcu werdykt jednym zdaniem: czy koncepcja v2 nadaje się do przeprojektowania modelu.
- Raport: Astra → `20-analizy/review/2026-10-24-druty-v2-astra.md` (jako odpowiedź końcowa), krytyk Opus → `20-analizy/review/2026-10-24-druty-v2-opus.md` (jedyny plik, który wolno zapisać). Nie czytaj raportu drugiego recenzenta tej rundy.
