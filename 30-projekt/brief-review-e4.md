# Brief analizy: zmiany v2.6 po montażu v2.5 (E4)

Recenzent, tylko do odczytu: bez `git pull`, commitów i zmian w plikach. Odpowiedź po polsku, jeden raport. Obowiązują „Zasady dla recenzenta”, „Zasady projektowe” i „Luzy montażowe” w `AGENTS.md`.

## Sytuacja

20.10 użytkownik złożył wydrukowany moduł małego oka v2.5 i znalazł szereg problemów. Orkiestrator zebrał je w epik E4 w `30-projekt/teraz.md` i napisał brief dla wykonawcy CAD na pierwszą, szybką część: `30-projekt/brief-e4.1-v2.6a.md` (Gniazdo i Cięgno do wydruku jeszcze dziś). Użytkownik nie jest pewien, czy dokumenty są spójne między sobą i z tym, co mówił, i obawia się, że wykonawca nie zrozumie, co, dlaczego i po co. **Brief E4.1 jeszcze nie został wysłany wykonawcy.**

## Materiał

- Rozmowa (wiadomości użytkownika i odpowiedzi orkiestratora, od początku montażu): `20-analizy/review/2026-10-20-e4-rozmowa.md`. Intencje użytkownika bierz stąd, nie z dokumentów orkiestratora.
- Zdjęcia z montażu (kolejność jak w rozmowie, od najstarszego): `/home/rkp/.claude/uploads/eb2cdf70-f52f-41f0-a685-77d1a0567308/` – pliki `8974de30`, `66a6ee87` (Cięgno, wkładki), `8abf5efb`, `87444d82` (Kaseta i Cięgno z wkładkami), `2b92c4d8` (zestaw wkładek), `8b013189`, `a8ecf384` (piłeczki), `971b8f61`, `d6ee468d`, `044d51dc` (serwo w Sankach w Kasecie), `3ca4bb88` (sięganie wkrętakiem), `ca238270` (Kaseta od spodu: serwo, kabel, łeb śruby osi), `d6c93ed1` (pomysł klamry H: wałek położony na zewnątrz Kasety). Każdy z sufiksem `-image.jpg`.
- Dokumenty do oceny: `30-projekt/brief-e4.1-v2.6a.md`, epik E4 i Parking w `30-projekt/teraz.md`, wiersze z 20.10 w `30-projekt/decyzje.md`, wpis z 20.10 w `70-budowa/dziennik.md` (zmiany jeszcze niezacommitowane – czytaj pliki z dysku).
- Model v2.5: `40-cad/onshape/e2.1-specyfikacja.md`, `40-cad/onshape/e2.1-plan.md` (zmienne), siatki `40-cad/3mf/Oko F v2.5/`, instrukcja `70-budowa/montaz-v2.5.md`.

## Pytania

1. **Kompletność:** czy każda uwaga użytkownika z rozmowy trafiła do E4.1, E4.2, E4.2b, E4.3, dziennika albo Parkingu – i czy trafiła tak, jak ją ostatecznie sformułował (użytkownik kilka razy się poprawiał, np. gniazdo blokujące z przodu → sam wkręt; słupki → szyny; klamra H z tyłu)? Wypisz brakujące albo przeinaczone.
2. **Spójność:** sprzeczności między briefem E4.1, `teraz.md`, `decyzje.md` i dziennikiem (liczby, zakres, które części drukujemy, co jest decyzją, a co dyskusją).
3. **Brief E4.1 jako zlecenie:** czy wykonawca, który nie zna rozmowy, zrozumie cel, kontekst i ograniczenia każdej zmiany i zrobi ją dobrze? Wskaż miejsca, gdzie brakuje uzasadnienia, liczby albo opisu działania części, i miejsca, gdzie brief twierdzi coś niezgodnego z modelem (sprawdź na specyfikacji albo siatkach: położenia śrub osi, z końca Gniazda, ścianki pod bruzdą, ząbki, rant, kolizje bruzd z żebrem i zaczepami, DFAM).
4. **Merytorycznie:** czy zmiany E4.1 rozwiązują opisane problemy i czy nie psują czegoś innego (np. ząbki przy krawędzi otworu, rant 67,5 z fazką, ścianka 0,9 pod bruzdą w części gwintowanej, `wkladkaD` 4,4 przy wkładce ze stopniem Ø4,0 i radełkiem Ø5)? Liczby zamiast opinii.
5. **E4.2 i E4.2b** (tylko opis w `teraz.md`, bez briefu): czy koncepcja jest wykonalna i czego brakuje, żeby z niej napisać brief (luzy, położenia, montaż, otwarta sprawa kierunku serwa).

Dla każdej uwagi: waga (KRYTYCZNE / WAŻNE / DROBNE), miejsce, scenariusz porażki, poprawka, pewność. Na końcu jedno zdanie: czy brief E4.1 można wysłać wykonawcy bez zmian, po drobnych poprawkach, czy wymaga przepisania.
