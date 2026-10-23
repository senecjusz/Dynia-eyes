# Brief: review PRD (Astra, 23.10)

Jesteś recenzentem. Piszesz po polsku. Tylko do odczytu: bez `git pull`, commitów, zmian w plikach. Raport idzie na standardowe wyjście (zapisze go PM).

## Co oceniasz

`30-projekt/PRD.md` – wymagania na dynię z oczami, spisane przez PM z użytkownikiem 23.10. Kontekst: `30-projekt/wnioski-pracy-2026-10-23.md` (pkt 0 – dlaczego poprzedni projekt dużego oka poszedł do kosza), `30-projekt/decyzje.md` (ostatnie wiersze z 23.10), `30-projekt/e6-pomiary.md` (kardan 5/5, MG90S, orczyk), `AGENTS.md` (zasady projektowe). Mechanizm referencyjny: The Face maker101, https://www.pcbway.com/project/shareproject/The_Face_maker101_c4124445.html (gałka na kardanie, nieruchome MG90S, pręty, jedno serwo powiek).

## Zasada nadrzędna

**Nie dopisuj wymagań funkcjonalnych.** O funkcji decyduje użytkownik. Każdy Twój pomysł na nowe wymaganie (bezpieczeństwo, trwałość, ograniczniki, testy) oznacz jako „PROPOZYCJA dla użytkownika” i oddziel od uwag. Prostota mechanizmu jest celem samym w sobie.

## Sprawdź

1. **Sprzeczności** wewnątrz PRD oraz z `decyzje.md` i `AGENTS.md` (np. zasady „druk zamiast drutu”).
2. **Luki blokujące projektanta:** czego projektant nie wie, a musi wiedzieć od użytkownika (tylko pytania o funkcję albo fakty, które zna tylko użytkownik). Pytania techniczne nie są lukami PRD.
3. **Wykonalność na liczbach:** czy gałka Ø60 z powiekami przy ±35° / ±25° mieści się w otworze ≤ Ø80 z rantem ≤ 2 mm; czy 3 × MG90S i części ≤ 180 mm (A1 mini) są realne; czy mechanizm referencyjny da się tak przeskalować. Policz z grubsza, podaj liczby i założenia.
4. **Niejasności**, które projektant może zrozumieć na dwa sposoby.

## Format

Uwagi z wagą KRYTYCZNE / WAŻNE / DROBNE: miejsce w PRD, problem, proponowana poprawka zapisu albo pytanie do użytkownika. Potem osobno PROPOZYCJE. Na końcu werdykt jednym zdaniem: czy PRD wystarcza, żeby projektant zaczął od rysunku mechanizmu. Najwyżej ok. 2 strony.
