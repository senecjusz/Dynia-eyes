# Uproszczenie dużego oka – synteza (Opus, Fable, Astra + projektant)

Raporty: `2026-10-25-uproszczenie-{opus,fable,astra}.md`. Decyzja użytkownika z 25.10: **dwie powieki, każda na swoim serwie** (4 × MG90S).

## Co jest ponad potrzebę (wszyscy trzej zgodnie)

- **Źródło komplikacji: dwie decyzje.**
  - Osie powiek siedzą w tubie wewnątrz otworu Ø80. Na promieniu zostaje 10 mm, więc dźwignia powieki ma r 7 i każdy 1 mm błędu daje 8,2–8,4° ruchu powieki.
  - Obie powieki są na jednym serwie. Różnicy długości dwóch drutów nie skasuje kalibracja.
- **Łaty na skutki tych decyzji** (9 z 20 elementów, Fable): V, gięcie w parze, koszulki, kieszeń w czaszy, wspólny otwór Ø2,4, osie M2 w podkładkach tuby, przyrząd do gięcia.
- **Drugi łańcuch.** Ucha drutów S1 i S2 są w zamkniętej skorupie gałki: najpierw klepsydra, potem widełki, oczko, sworzeń i podpory przy druku, a na końcu luz spojrzenia ±3–5°. Do tego dochodzą rowek T i okno słupka pod łeb M5.
- **Referencja The Face maker101** (Fable, strona PCBWay):
  - otwarta rama U na płaskiej płycie, gałka na przegubie na słupku, serwa za nią;
  - pręty ze spinaczy w luźnych otworach, zero ustawiane programowo;
  - jedna górna powieka na oko;
  - brak tuby, brak dolnej powieki, brak sprzężenia powiek.

## Klasyfikacja (zasada użytkownika: psuje PRD / brzegowe)

| Problem | Klasa |
|---|---|
| Dźwignia r 7 (8,4°/mm), rozjazd powiek na jednym serwie | psuje PRD (powieki nie domykają się razem) |
| Ucha S1/S2 – przechył 38–53°, luz ±3–5° | psuje PRD przy pełnym zakresie ±35/±25 |
| Druk widełek (podpory), szczegóły koszulek | skutek obecnych łat, znika przy zmianie układu |

## Rekomendacja (jedna)

**Rama U zamiast tuby, każda powieka na swoim serwie z długim ramieniem, pręty gałki na kardanach 2/2:**
- Jedna drukowana rama: płyta serw, słupek kardana gałki, dwa słupki osi powiek na M3, łapy do dyni. Z przodu płaski pierścień na wkręty, który zakrywa cięcie (zamiast tuby i maskownicy).
- Powieki obracają się na osiach M3 w słupkach ramy. Ramię każdej powieki to przedłużenie czaszy do tyłu, ok. 24 mm, czyli **2,4°/mm** zamiast 8,4. Każda powieka ma swoje MG90S, a długość drutu kasuje zero tego serwa.
- **Gałka:**
  - pręty z drutu Ø2 przy gałce są w posiadanych kardanach 2/2, więc nie ma oczek, widełek ani przechyłu w otworze;
  - długość ustawia wkręt piasty kardana, a zero ESP32;
  - kardan 5/5 siedzi na śrubie M5 wkręconej w gałkę, więc odpada rowek T.
- **Zostaje:** gałka Ø60, kardan 5/5, czasze powiek, MG90S, ESP32, kalibracja.

## Propozycja do decyzji użytkownika (PM): mniejszy zakres ruchu gałki

| Zakres | Przechył drutu przy gałce S1 / S2 | Skutek |
|---|---|---|
| ±35° / ±25° (PRD) | 38° / 53° | potrzebny przegub (kardan 2/2 albo oczko) |
| ±25° / ±20° | 29° / 38° | jw., mniejszy luz |
| ±20° / ±15° | 22° / 34° | prosty drut Z w otworze jak w referencji ma szansę działać (cienkie ucho); spojrzenie wyraźnie mniej „żywe” |

Z kardanami 2/2 zakres może zostać ±35° / ±25°.

## Co zrobić (użytkownik)

1. Zdecydować: **rama U bez tuby** (zmiana decyzji z 24.10) – tak / nie.
2. Zmierzyć kardan 2/2: luz końca przy 20 mm, długość piasty, zakres kątów. Wystarczy zdjęcie z suwmiarką.
3. Potwierdzić, że wolne są 4 × MG90S (2 na powieki).
4. Zakres ruchu: zostaje ±35° / ±25° (rekomendacja) czy mniejszy.
