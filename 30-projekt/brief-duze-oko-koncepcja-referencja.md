# Brief: koncepcja dużego oka na wzór The Face maker101 (krok 1, bez CAD)

26.10.2026, PM. Dostaje go nowa sesja projektanta, bez historii modeli v1–v9.

## Rola

Jesteś projektantem dużego oka i robisz **wstępną koncepcję**, krok 1 z PRD §9. CAD robisz dopiero po akceptacji użytkownika i na osobne zlecenie.

- **Ustalenia z użytkownikiem:** prowadzisz skillem `grilling` (`.claude/skills/grilling/SKILL.md`). Pytasz rundami, każde pytanie ma Twoją rekomendację, bez formularzy.
- **Zgłoszenia do PM:** według `AGENTS.md`, sekcja „Zgłoszenia do PM”.
- **Git:** commitujesz na swojej gałęzi tylko swoje pliki, bez push.

## Najpierw przeczytaj

- `30-projekt/PRD.md`: §4 (stan „Wzór 26.10”), §7, §8, **§9 prostota przed zakresem**.
- `20-analizy/2026-10-25-referencja-face-maker101-synteza.md`, a tylko w razie potrzeby trzy raporty analityków obok niej.
- `30-projekt/decyzje.md`: wiersze z 26.10.
- `30-projekt/e6-pomiary.md`: kardan 5/5, MG90S, orczyk.
- Pliki referencji: `00-inbox/face-maker101/` (STL i `.ino`). Wolno je mierzyć skryptem, ale nie kopiuj ich do repo.

**Nie korzystaj z** `40-cad/openscad/duze-oko-v2.scad` ani z koncepcji v1–v9 w `20-analizy/`. To rozbudowa, której unikamy.

## Ustalone, nie otwierasz na nowo

1. **Wzór:** adaptacja referencji. Jedna płaska płyta z 4 × MG90S (lewo–prawo, góra–dół, powieka górna, powieka dolna), serwa w gniazdach na klej jak w referencji. Pręty z drutu bez przegubów, końce zagięte w „Z”, drut Ø1,0 jak spinacz.
2. **Przegub gałki: jeden, kardan 5/5 z warsztatu, krzyżak w środku kuli.** Wymiary: Ø11 na całej długości, długość 25,5, krzyżak w połowie (ok. 13 mm od czoła), otwory Ø5 o głębokości 7, wkręty M4, zgięcie do oporu ok. 90°.
3. **Gałka:** Ø60, od tyłu czasza do ok. 120° od przodu (otwór tylny ok. Ø52). Jeśli zaczepy prętów albo piasta kardana się nie zmieszczą, kształt jak w referencji: ok. 10 mm za środek kuli.
4. **Powieki:** dwie, każda na swoim serwie (PRD §4). Zawias na dwóch słupkach płyty po bokach gałki, jak w referencji. Oko z powiekami skręcasz na stole, potem wsuwasz w tubę. Ok. 1 mm między słupkiem a tubą jest zaakceptowane.
5. **Mocowanie w dyni:** tuba w otworze Ø80, kołnierz z łapami od środka dyni, maskownica z zewnątrz (PRD §4). **Tuba z kołnierzem w 3 długościach** pod ścianę dyni 30, 40 i 50 mm, drukowana z góry. Moduł wkładasz do dyni przez wieczko, nie przez otwór Ø80.
6. **Zakres ruchu:** cel PRD ±35° / ±25° osiągasz doborem otworu orczyka i położenia zaczepów na gałce, bez nowych części (synteza §3).

## Zadanie

Koncepcja na jedną stronę:

1. **Szkic:** widok z boku i od tyłu, prosty, w SVG albo ASCII. Na nim gałka, kardan, płyta, serwa, pręty, słupki i powieki, tuba.
2. **Lista części:** osobno drukowane (każda ≤ 180 mm) i posiadane: śruby, kardan, drut. Liczba śrub.
3. **Główne wymiary:** średnica i położenie płyty, rozstaw słupków, promienie zaczepów, otwory orczyków, długości drutów.
4. **Kolejność montażu:** w każdym kroku narzędzie i dostęp palcami. Nic, co przechodzi obok siebie „na milimetr”, poza zaakceptowanym 1 mm przy tubie.
5. **Zakres ruchu wobec PRD**, z rachunkiem.
6. **Lista różnic wobec referencji:** każda poza punktami 1–6 wyżej to **pytanie do użytkownika** (runda `grilling`), a nie Twoja decyzja. Dotyczy zwłaszcza każdego dodatkowego przegubu, części i śruby.

Bez CAD i bez eksportów. Liczby zamiast opinii, założenia oznacz **[Z]**.

## Wynik

- Plik `20-analizy/2026-10-26-duze-oko-koncepcja-referencja.md` ze szkicem `.svg` obok.
- Zgłoszenie `[PM][zadanie zrobione]`.
- Potem pokazujesz koncepcję użytkownikowi i prowadzisz z nim rundy pytań, aż zaakceptuje albo zawróci.
