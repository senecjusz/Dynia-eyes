# Review Uchwytu serw v12 (ścianki usztywniające) – krytyk Opus, runda 1 z 2, tylko PSUJE

25.10.2026, tylko odczyt. Oceniane: `UchwytSerw` w `duze-oko-v2.scad` (v12), siatki `…/v12/stl/UchwytSerw.stl`, dla porównania `…/v9/stl/UchwytSerw.stl`.

**Dowód [P, mój]:** symulacja wsuwania każdego serwa w okno ramki. Serwo MG90S to bryła zastępcza z modelu: korpus 22,8 × 12,5 × 22,8, wieża r 6 na 12,2 mm, ucha. Przesuwam je wzdłuż osi wałka o całą drogę 0…18 mm (od położenia zamontowanego do chwili, gdy dno korpusu dopiero wchodzi w okno) i sprawdzam, czy punkty bryły leżą wewnątrz siatki Uchwytu (test promienia). Skrypt w scratchpadzie (`wsuw.js`). Wyniki:

| Serwo | v9 | v12 |
|---|---|---|
| S1 | wolna droga | **kolizja od 13 mm drogi** (wieża w ściance, np. (2,8; −12,9; −44,0)) |
| S2 | **kolizja od 6 mm** (wieża w słupku, np. (6,8; 3,8; −41,9)) | to samo |
| SG | wolna droga | wolna droga |
| SD | wolna droga | **kolizja od 3 mm drogi** (wieża w ściance, np. (1,2; −8,5; −44,0)) |

## PSUJE

**1. Ścianka słupek–wieża 3 (nowa w v12) nie pozwala włożyć serw S1 i SD.** [P]
- Ścianka biegnie od (0, 0) do wieży 3 w (11,6; −43,5), od płyty (z −66) do z −26,85. Przecina drogę, którą serwo musi przejść, żeby wejść dnem w okno ramki.
- S1: wieża serwa na y −18,5 przy wsuwaniu przechodzi przez x 1,5…13,7, a ścianka jest na y −18,5 w x 3,7–6,2. Blokada od 13 mm z 18 mm drogi.
- SD: wieża na y −14,1, ścianka w x 1,0–3,5. Blokada od 3 mm drogi.
- Okno ramki jest dopasowane do korpusu (luz 0,3), więc serwa nie da się wprowadzić skosem.
- Ta sama ścianka zasłania wkrętak do górnych wkrętów uszu S1 (z −36,05). Wkrętak od strony wałka ma tylko ok. 28 mm do ścianki.
- **Poprawka:** obniżyć ściankę słupek–wieża 3 do z ≤ −62 (ok. 4 mm nad płytą, pod korpusami serw: dół korpusu z −61,3 minus luz), jak niskie żebro S2. Albo poprowadzić ją poza drogami wsuwania S1 (y −12,2…−24,8, x 1,5…36,5) i SD (y −7,8…−20,3, x −18,5…18). Po zmianie powtórzyć symulację wsuwania.

**2. Serwo S2 nie wchodzi w ramkę obok słupka (już w v9, bez zmian w v12).** [P]
- Przy wsuwaniu dnem w okno (ramka x 29,5) wieża S2 (y 3…15) przechodzi przez x −4…8,2. Słupek Ø16 zajmuje tam y ≤ 8 → kolizja od 6 mm z 18 mm drogi.
- Model wieży jest przybliżony (walec r 6 na 12,2 mm). Prawdziwa górna część MG90S jest prawie tak szeroka jak korpus [Z], więc w rzeczywistości kolizja raczej większa.
- Scenariusz porażki: po wydruku serwa S2 nie da się zamontować.
- **Poprawka (technika, bez zmiany funkcji):** ramkę S2 przenieść na drugą stronę uszu (płaszczyzna ramki = x uszu − `tRamki`). Serwo wchodzi wtedy wieżą od +x (wieża Ø12 mieści się w oknie 13,1 × 23,4), ucha opierają się o ścianę +x ramki, wkręty od +x. Po stronie +x jest wolno (korpus S2 wystaje za płytę w powietrze). Najpierw sprawdzić na wydrukowanym v9: czy S2 da się włożyć.

## Nie PSUJE (sprawdzone)

- Druk: nowe ścianki są pionowe od płyty, żebra `zebroP` mają skos ok. 68° od poziomu (34 mm wysokości na 14 mm), podstawy wież 45°. Uchwyt drukuje się płytą na stole bez podpór.
- Sztywność: słupki ramek (21 − 13,1)/2 ≈ 4,0 mm zamiast ok. 2. Ściana SG/SD 4 mm ma na końcach żebra 14 mm. Ścianki 2,5 mm sięgają 34–44 mm.
- Okno łba M5 w słupku jest wolne: ścianka do wieży 2 jest wycięta w oknie, ścianka do wieży 3 kończy się 1 mm pod oknem.
- Kable serw wychodzą z dna korpusu (S1/S2 przy x ≈ 47–54, SG/SD przy x −36,5), poza ściankami.
- Kolizje w ruchu: orczyk SD–uchwyt 0,84, SG–uchwyt 2,62, piasta 2 S1–uchwyt 1,75 [P projektanta]. Bez uwag.

## Werdykt

Uchwyt v12 nie może iść do druku, dopóki ścianka słupek–wieża 3 nie zostanie obniżona pod korpusy serw albo przeprowadzona inaczej (blokuje włożenie S1 i SD). Przed drukiem trzeba też sprawdzić na wydrukowanym v9 wkładanie S2 obok słupka i, jeśli nie wchodzi, przenieść ramkę S2 na drugą stronę uszu.
