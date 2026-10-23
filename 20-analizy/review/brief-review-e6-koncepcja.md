# Review koncepcji dużego oka 2c (E6.1) – 22.10

Jesteś recenzentem. Dwóch recenzentów (Fable – Anthropic, Astra – OpenAI Codex) dostaje ten sam materiał i pracuje niezależnie. Tylko do odczytu: bez `git pull`, commitów, pushy i porządków w repo. Zapisujesz wyłącznie swój raport. Piszesz po polsku. Zasady recenzenta: `AGENTS.md`, „Zasady dla recenzenta” – review pełne, wagi KRYTYCZNE / WAŻNE / DROBNE, liczby zamiast opinii, dla każdej uwagi miejsce, scenariusz porażki, poprawka albo test, pewność.

## Co oceniasz

**Koncepcję:** `20-analizy/2026-10-22-duze-oko-2c-koncepcja.md` (realizator: Opus). Napisana według briefu `30-projekt/brief-e6-duze-oko-koncepcja.md` (wersja 2), który przeszedł Wasze review (`20-analizy/review/2026-10-22-brief-e6-fable.md`, `…-astra.md`). Z koncepcji orkiestrator napisze brief dla wykonawcy CAD (Onshape), więc błąd przepuszczony teraz wyjdzie dopiero na wydruku.

Pytanie główne: **czy ten mechanizm zadziała po wydrukowaniu i złożeniu, i czy da się z niego od razu napisać brief CAD?**

Sprawdź w szczególności (licz, nie oceniaj na oko):
1. **Kinematyka gałki:** kardan w środku kuli, 2 pręty z przegubami kulowymi na obu końcach (S–S), nieruchome serwa. Kąty przenoszenia, martwe punkty, sprzężenie osi (realizator podaje do 4,5° serwa, korygowane w firmware), kolizje prętów z gałką, powiekami, Słupkiem i sobą w całym zakresie (±25°/±15° i przekątne). Przegięcie kardana (realizator: blisko granicy 33°).
2. **Powieki z jednego serwa** (realizator: własny pomysł, niesprawdzony; 73° serwa → 51° górnej, 27° dolnej): czy powieki się zamykają i otwierają zgodnie z kryteriami, czy nie kolidują ze sobą, z gałką przy ruchu, z prętami; pas ok. 10 mm przy osi powiek; siła przycięcia palca.
3. **Obrys i montaż:** walec Ø79,5 przez otwór Ø80, rant Ø84, wystawanie gałki, głębokość 65 mm za ścianką 15 mm, droga wsuwania, „co wolno robić w dyni” z briefu. Osie powiek: wkręty bez łba DIN 913 vs łby 2,45 mm użytkownika.
4. **Mocowanie w dyni** (Obejma zaciskana pokrętłem od środka – niesprawdzona): czy utrzyma ok. 175 g na ramieniu, w mokrym miąższu, przy ścianie 15–35 mm, przy ręce dziecka.
5. **„Sprawdzone mechanizmy”:** czy źródła (linki w koncepcji) faktycznie pokazują to, na co się powołuje realizator, i czy adaptacja (skala, M3, kardan RC zamiast drukowanego) nie zmienia kinematyki. Oznacz, co sprawdziłeś w źródle, a czego nie.
6. **Wytrzymałość i ręka dziecka:** ograniczniki w ramie, droga momentu przy wymuszonym obrocie, 20 N od przodu, co pęka pierwsze.
7. **Luzy** z tabeli `AGENTS.md` i z briefu (powieka–gałka 1,0–1,2) dla każdej pary; ≥ 0,5 mm między ruchomymi w całym zakresie, z łbami, nakrętkami, kulkami przegubów, kablami.
8. **DFAM:** każda część płasko na stole, nawisy, podpory; które części na A1 mini (180 mm).
9. **Prąd i rozruch:** budżet prądu, bezpieczny rozruch, zachowanie bez PWM, kanały PCA9685.
10. **Gotowość do CAD:** czy schemat złożenia, zmienne i połączenia wystarczą wykonawcy bez zgadywania; czego brakuje. Czy pytania blokujące B1–B4 są kompletne.
11. **Zgodność z wymaganiami briefu i intencjami użytkownika:** otwór ≤ 80, lekko (bez gwintu, Nakrętki, kasety; ścianki ≥ 2 mm), 2c od razu, sprawdzone mechanizmy, M3, bez wkładek, nakrętki samohamujące, komplet nie na raty, minimum zakupów (realizator proponuje przeguby kulowe RC i wkręty DIN 913 – oceń, czy da się bez zakupów i jakim kosztem).

## Kontekst z rozmowy z użytkownikiem (22.10)

- „Od razu 2c.” „Bazować na sprawdzonych mechanizmach z researchu.” „Jesteśmy ograniczeni otwornicą 80.” „Nie robiłbym tym razem tak ciężkiego mechanizmu jak zewnętrznego mocowania i wkładania kasety. To musi być lżejsze (cieńsze).” Przegub z warsztatu: „połączenie krzyżowe”. MG90S × 4 są w warsztacie.
- Użytkownik nie chce prognoz czasu w briefach i raportach – nie pisz o czasie pracy ani terminach.
- Zasady współpracy: komplet do druku, nie na raty; części drukowane i śruby M3, bez rozwiązań „craftowych”; bez absurdalnych napraw; bezpieczeństwo dziecka; serwo bez gwałtownych skoków.

## Raport

- Na końcu **werdykt jednym zdaniem:** czy koncepcja nadaje się na brief CAD (TAK / TAK PO POPRAWKACH – których / NIE – co zmienić w architekturze).
- Plik: Fable → `20-analizy/review/2026-10-22-e6-koncepcja-fable.md`, Astra → `20-analizy/review/2026-10-22-e6-koncepcja-astra.md`.
