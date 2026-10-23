# Brief E6.1b: koncepcja dużego oka 2c, wersja 2 – poprawki po review (22.10)

Dla: **Opus** (realizator koncepcji v1). Piszesz po polsku. Tylko do odczytu w repo: bez `git pull`, commitów, pushy i zmian w innych plikach. Zapisujesz jeden plik: `20-analizy/2026-10-22-duze-oko-2c-koncepcja-v2.md` (pełna koncepcja, nie lista zmian – wykonawca CAD i recenzenci mają czytać tylko v2). Brief v1 (`30-projekt/brief-e6-duze-oko-koncepcja.md`) obowiązuje dalej, chyba że ten plik mówi inaczej. Bez prognoz czasu (użytkownik nie chce ich w briefach i raportach).

## Materiał

- Twoja koncepcja v1: `20-analizy/2026-10-22-duze-oko-2c-koncepcja.md`.
- Review v1: **Astra** `20-analizy/review/2026-10-22-e6-koncepcja-astra.md` (4 KRYTYCZNE, 8 WAŻNYCH, drobne; werdykt NIE) i **Fable** `20-analizy/review/2026-10-22-e6-koncepcja-fable.md` (3 KRYTYCZNE, 12 WAŻNYCH, 8 DROBNYCH; werdykt NIE). oraz **Opus (recenzent, osobna sesja)** `20-analizy/review/2026-10-22-e6-koncepcja-opus.md` (1 KRYTYCZNA, 6 WAŻNYCH, 7 DROBNYCH; werdykt NIE). Przeczytaj wszystkie trzy w całości.
- Skrypty i wyniki rachunków Fable (kinematyka gałki, powieki): `/tmp/claude-1000/-home-rkp--claude-spares-spare-mfMMBV/81adf3b7-b77e-42b1-b39b-151f54c8e062/scratchpad/e6/` (`kin.py`, `powieki*.py`, `wynik*.txt`) – użyj ich albo własnych do sprawdzenia nowej geometrii.

## Co zostaje (obaj recenzenci)

Gałka Ø60 na kardanie RC w środku kuli, 2 nieruchome MG90S i pręty z przegubami kulowymi na obu końcach (S–S) dla lewo–prawo i góra–dół: kinematyka potwierdzona niezależnym rachunkiem Fable (przegięcie kardana 28,9/31,6°, przenoszenie ≥ 51°, sprzężenie −4,6°, kulki ≤ 24,6°, zapas do czaszy 3,2 mm). Rama, Płyta i Obejma zostają jako kierunek, po poprawkach niżej.

## Decyzje użytkownika (22.10) – przyjmij jako fakt

1. **Powieki: osobne serwo na każdą powiekę** – razem **4 × MG90S** (użytkownik: „osobne serwo pod każdą powiekę jest bezpieczniejsze”). Tak robi Cogley, więc to rozwiązanie sprawdzone; jednoserwowe sprzężenie z v1 odpada w całości (Fable K1, K2; Astra A1, A4). Zapasowego MG90S nie będzie. Oprzyj napęd powiek na konkretnym projekcie Cogleya (wersja, link, co bierzesz, co zmieniasz) i policz go od nowa: geometria, obrys Ø79,5, kolizje ze wszystkim w całym zakresie gałki i powiek.
2. **Rozruch jak w małym oku:** firmware zapisuje ostatni zadany impuls każdego serwa w NVS i po włączeniu wysyła najpierw ten impuls, potem płynnie prowadzi do pozycji startowej. Skok jest akceptowany tylko po zaniku prądu w trakcie ruchu albo po ręcznym przestawieniu oka. To zamyka Astra A3 jako zmianę wymagania przez użytkownika; mechanizm ma jednak przeżyć taki skok z każdej pozycji w zakresie bez kolizji.
3. **Montaż w dyni razem z synem:** część kroków robi syn, część ojciec; narzędzia (także ostre) obsługuje ojciec, więc nie są ograniczeniem. Kroki dla syna oznacz w kolejności montażu.
4. **MG90S × 4 są w warsztacie.** Kardan: „połączenie krzyżowe”, wymiary nieznane (B3).
5. **Drut stalowy sprężysty** jest w warsztacie (średnica nieznana – dopisz do pomiarów). Użytkownik: „jakby trzeba było z niego zrobić odciągi … choć wydaje mi się, że wydruk 3D powinien być lepszy, ale nie wykluczam takiego użycia”. Domyślnie pręty i cięgna drukowane (zasada z `AGENTS.md`); drut tylko tam, gdzie daje wyraźną przewagę (np. pręt S–S cieńszy przy kolizjach, sprawdzone u Cogleya albo w innym zbudowanym projekcie) – z uzasadnieniem liczbą i sposobem zakończenia drutu.

## Co musisz poprawić

Odnieś się do **każdej** uwagi KRYTYCZNE i WAŻNE z obu raportów (Astra A1–A12, Fable K1–K3, W1–W12, Opus-recenzent K1, W1–W6 – w tabeli oznaczaj je „O-K1”, „O-W1” itd.) i do drobnych, które zmieniają geometrię. Na końcu v2 tabela: ID uwagi → co zrobiono (albo dlaczego nie, z liczbą). Najważniejsze:

- **Stosy i okucia z rzeczywistymi wymiarami** (Astra A1, Fable K3, W5, W12): nakrętka samohamująca M3 DIN 985 ma 4,0 mm całkowitej wysokości; łby śrub użytkownika 2,45 mm; podkładki Ø7. Dla każdego przegubu przekrój stosu i długość śruby z łańcucha grubości. Żadne okucie nie wchodzi w gałkę (R30 + luz), czasze powiek ani obrys Ø79,5. Tabela współrzędnych wszystkich przegubów w skrajnych położeniach i znak dodatni każdego serwa.
- **Ręka dziecka i przeciążenie** (Astra A2, A4; Fable W2): ogranicznik ruchu gałki na Uchwycie i Słupku (siła kula → Uchwyt → Słupek → Płyta z pominięciem prętów, kulek i serw), nie na nakrętkach prętów. Policz, co dostaje przekładnia przy wymuszeniu w zakresie pracy (Astra: do 0,67 N·m przy 0,5 N·m na gałce w położeniu ψ −25°, θ +15°) i zaproponuj najprostszą sprawdzoną ochronę; jeśli jej nie ma, nazwij ryzyko i test. Siła przycięcia palca osobno dla każdej powieki, przy jej własnym serwie.
- **Obrys, montaż, Obejma, DFAM, prąd, źródła, pomiary:** Astra A5–A12, Fable W1, W3–W11 – w tym: wariant bez DIN 913 to Ø55, nie Ø56 (Fable W1); końcówki kulowe do pomiaru (W3); kable MG90S wychodzą w stronę gałki (W4); pas pełny rury pod Obejmą i pełzanie PLA (W6); Rama nie leży płasko rantem (W9); próbka P5 z momentem 0,7 N·m (W10); budżet prądu z 4 serwami i zachowanie bez PWM (Astra A10).
- **Z review Opusa:** szczelina zamkniętych powiek w kącikach spada poniżej 0,5 mm, a przy ogranicznikach do zera (O-W2) – kryterium zamknięcia na całej krawędzi, nie tylko w połowie wysokości; ogranicznik góra–dół wypada 0,34 mm wewnątrz zakresu pracy w narożniku −25°/−15°, bo sprzężenie osi zjada zapas (O-W5) – ograniczniki ustaw z rachunku narożników; test ręki dziecka z kryterium zaliczenia (O-W1).
- **Pytania B1–B4** uzupełnij o to, czego potrzeba przy 4 serwach i nowej geometrii (końcówki kulowe, MG90S, kardan); dla każdego brakującego pomiaru przyjęty przedział i warunek odrzucenia koncepcji.

Na końcu **werdykt jednym zdaniem:** czy v2 jest gotowa do drugiej rundy review i co jest jej najsłabszym punktem.
