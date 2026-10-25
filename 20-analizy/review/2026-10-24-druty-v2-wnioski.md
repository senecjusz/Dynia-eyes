# Druty v2 – połączenie review (Opus + Astra) i rozstrzygnięcia projektanta

Raporty: `2026-10-24-druty-v2-opus.md` (do przeprojektowania po 2 poprawkach), `2026-10-24-druty-v2-astra.md` (nie do przyjęcia w obecnym zapisie). Funkcja bez zmian: obie powieki ruchome na jednym S3, nic nie kupujemy. Runda koncepcji 2/2 (AGENTS: dalej CAD na zmiennych i przemiatanie).

| # | Problem (liczba) | Warianty | Wybór |
|---|---|---|---|
| 1 | S1/S2: V zbędne. ±2 mm długości → zero ±6,6° / ±9,0°, 0 pozycji nieosiągalnych (O, A) | V zostaje / V usunięte | **V usunięte w S1/S2.** Większy błąd → ponowne gięcie Z. |
| 2 | Kolejność: V zrobione po zaznaczeniu skraca drut o 2,93 mm (A2, O-D1) | – | **V najpierw (45°), potem zaznaczenie drugiego Z.** Zaznaczanie przy orczyku na serwie w zerze i gałce na wprost. |
| 3 | Powieki: różnica PG–PD przy niezależnym gięciu do ±4 mm (O) / ±8 mm (A); jedno V daje −2,1…+1,6 mm | jedno V / oba V / gięcie w parze + oba V | **Gięcie w parze** (oba druty razem w szczękach, różnica ~0,3–0,5 mm [Z]) + **oba V** do dostrojenia (razem ~±3,7 mm). Gdy nie starcza – poprawka Z. |
| 4 | Dźwignia górnej powieki: za nią gałka, środek Z max ≈ 3,6 mm (O-K1) | a) dłuższa dźwignia ρ 12 → 4,3 mm (dalej za mało na 5 ± 2); b) L + 2–3 mm izolacji z przewodu, noga przycięta obcinaczkami; c) krótki Z 3 ± 0,5 na próbce | **b)**, jeśli w warsztacie jest przewód w izolacji (pytanie do użytkownika). Przycięcie nogi obcinaczkami po włożeniu to nie gięcie precyzyjne. W przeciwnym razie a)+c) do przeliczenia w CAD. |
| 5 | Histereza luzu Z: S2 przy kącie 105° ~1,6 mm → ~4,5° φ (O-W4, A6) | krótszy środek / oś otworu ucha S2 obrócona o 15° | **Środek Z 5 ± 1,5** (min. 4,2 przez promienie gięcia – A10), **oś klepsydry S2 obrócona** tak, żeby przy uchu S2 było 90°. Przy orczyku 105° zostaje. |
| 6 | Cel „2 mm od osi” źle zdefiniowany: drut Ø1 + odchyłka 2 mm → potrzeba 2,5–3,0 mm od osi (A4); przy S1–gałka i PD–Pierścień 2 mm się nie zmieści (O-W5) | – | Cel w modelu: **≥ 0,5 mm powierzchnia–powierzchnia dla drutu w skrajnym luzie Z i skrajnym V**. Kształt po doginaniu ma być ten nominalny (dogina się do niego), a nie ±2 mm. Tam, gdzie nie ma więcej, podać wartość. |
| 7 | Przemiatanie nie widzi ogonów Z, V i 4 mm przy dźwigniach (O, A) | – | `duze-oko-kolizje.js`: pełne Z (środek, ogon), V, skrajne luzy, wszystkie pozycje powiek. |
| 8 | Ucho gałki: 0,35 mm pod otworem; oczko dźwigni 1,3 mm ścianki | – | `uchoDol` ≥ 2,6; `rDzwKoniec` 2 → 2,2. |
| 9 | Kąt przy uchu sprawdzany tylko „na wprost” (O-W4, A7) | – | Próba w 4 narożnikach; przy zacięciu dogiąć w stronę narożnika. |
| 10 | Rysunek: jeden płaski widok, brak rzutów, stron, kątów łukiem, kierunku V, długości cięcia (O-D1, A9) | – | Cztery rysunki (S1, S2, PG+PD razem), dwa rzuty, ponumerowane zagięcia, kąty łukiem, kierunki, długości, „schemat – nie mierzyć”. |
| 11 | Ilość drutu ~30 cm Ø1,0 (O-D2) | – | fakt do potwierdzenia u użytkownika |
