# Review: odstępstwo „oczko zamiast Z” na języczkach gałki (Opus 5.5)

26.10.2026. Brief `2026-10-26-oczko-brief.md`, commit `871090f`. Pracowałem tylko na odczyt, raportu Astry nie czytałem.

Rachunek jest mój i nie korzysta z `duze_oko_v3_kinematyka.py`. Kinematykę napisałem od nowa: kardan R = Ry(ψ)·Rx(−θ), orczyki i zaczepy z parametrów `duze-oko-v3.scad`, odwrotna kinematyka orczyka ze stałej długości pręta. Długości prętów wychodzą 61,50 mm (L–P) i 55,50 mm (G–D). Siatka kątów ma krok 1°. Skrypty leżą w katalogu tymczasowym sesji: `katy.py` (kąty, najlepsza oś otworu, przechył drutu w otworze) i `ods.py` (odsadzenie „Z” wobec języczka). Uruchamiałem je przez `python3 -I`.

## 1. Czy problem istnieje? Tak

Liczę kąt wyjścia pręta z płaszczyzny otworu, czyli asin(d·n), gdzie d to kierunek pręta w układzie gałki, a n to oś otworu.

| Zaczep (oś otworu obecnie) | Cel ±35° / ±25°: oś osobno | Cel: narożnik | Minimum ±30° / ±20°: oś osobno | Minimum: narożnik | Ok. ±20° / ±15° (referencja) |
|---|---|---|---|---|---|
| G–D (n = x gałki) | **37,7°** | **40,9°** (ψ −35, θ +25) | **32,3°** | **34,6°** | 21,6° / 22,8° |
| L–P (n = y gałki) | **26,8°** | 26,8° (ψ 0, θ −25) | **21,4°** | 21,4° | 16,1° |
| Orczyk G–D / L–P | – | 5,9° / 1,8° | – | 4,7° / 1,4° | 2,8° / 1,1° |

Moje liczby zgadzają się z liczbami projektanta co do 0,1°. Obecny otwór ma Ø1,3, a języczek grubość 2,5 mm. Drut Ø1,0 przechyli się w takim otworze najwyżej o **6,7°** (warunek 1/cos β + l·tg β ≤ D). Nie wystarcza to nawet przy zakresie referencji. Problem jest więc rzeczywisty przy pełnym zakresie PRD i przy minimum PRD.

Obrót w płaszczyźnie języczka, czyli wokół osi otworu, wynosi do 44,1° (L–P) i 28,4° (G–D). „Z” przenosi go swobodnie, więc nie on jest problemem.

## 2. Czy (a) jest niezbędne? Nie, jest rozwiązanie z „Z”

**Oś otworu G–D jest źle dobrana, a nie sam zaczep „Z”.** Szukałem stałej osi otworu n w gałce, która daje najmniejszy największy kąt wyjścia, po całej sferze kierunków z krokiem 1°:

| Pręt | Cel: najlepsza oś | Cel: max wyjście | Minimum: max wyjście |
|---|---|---|---|
| L–P | n = y gałki (tak jest teraz) | 26,8° | 21,4° |
| G–D | **n = y gałki** (teraz x) | **27,7°** | **22,2°** |

Języczek G–D obrócony o 90° wokół osi oka, z otworem równoległym do otworu L–P (wzdłuż y gałki), zmniejsza wymagany przechył z 40,9° do 27,7°. Wtedy wahanie ψ do 41° zamienia się w obrót wokół osi otworu, który „Z” przenosi swobodnie. W praktyce oznacza to płytkę w płaszczyźnie XZ przy y ≈ 14 zamiast płytki w płaszczyźnie YZ. Ta płytka też drukuje się pionowo, a otwór wychodzi poziomy.

**Przechył drutu Ø1,0 w otworze** zależy od średnicy otworu D i długości l części walcowej, czyli od tego, co zostaje między fazkami 45°:

| D \ l | 2,5 | 1,2 | 0,8 | 0,4 |
|---|---|---|---|---|
| Ø1,3 | 6,7° | 12,9° | 17,5° | 25,6° |
| Ø1,6 | 12,9° | 23,1° | **29,4°** | 38,6° |
| Ø2,0 | 20,5° | **33,6°** | 40,5° | 49,3° |

**Odsadzenie „Z”** to odległość od środka otworu do osi pręta głównego. Przy przechyle pręt główny idzie w ściankę języczka. Policzyłem to na uproszczonym obrysie języczka (L–P z podparciem 45°, G–D po obróceniu 5 × 5 mm). Zero styku wymaga 2,85–2,90 mm przy celu i 2,65 mm przy minimum. Z wymogiem luzu 0,5 mm wychodzi ok. 3,5 mm. Obecnie jest 1,75 mm, co już w położeniu neutralnym daje luz 0. Stąd biorą się −1,33 / −0,99 mm z przemiatania projektanta.

**Wariant bez zmiany ustalenia 1** spełnia pełny cel PRD na liczbach:

- języczek G–D obrócony (n ∥ y gałki): wymagane 27,7°;
- otwór Ø2,0 z fazkami 45° i walcem 1,2 mm daje 33,6°, czyli 6° zapasu. Alternatywa to Ø1,6 z walcem 0,8 mm: 29,4°, zapas tylko 1,7°, za mało przy poziomym otworze Ø1,6 z druku;
- noga „Z” około 3,5 mm zamiast 1,75.

Zmienia się tylko geometria języczka i wymiar zagięcia, bez nowej części i bez nowego przegubu.

**Wariant (b) w wersji projektanta** zakłada otwór Ø1,6 z fazkami, około ±20°, i oś G–D wzdłuż x. Przy minimum PRD **nie przechodzi**: G–D potrzebuje 32,3° na samej osi i 34,6° w narożniku, a L–P 21,4°, co jest na granicy. Liczba ±20° odpowiada walcowi ok. 1,4 mm. Przy walcu 0,4 mm Ø1,6 daje 38,6°, ale krawędź 0,4 mm w poziomym otworze Ø1,6 z PLA nie jest wymiarem do zaufania.

## 3. Czy (a) dodaje część albo przegub?

- **Część: nie.** To ten sam drut i ten sam języczek, zmienia się tylko zakończenie.
- **Przegub w rozumieniu PRD §9: nie w sensie dodatkowego elementu.** §9 i PRD §4 („bez własnych drukowanych mini-kardanów”) celują w dodatkowe zespoły. Kinematycznie zaczep „Z” też jest przegubem (1 stopień swobody), a oczko ma 2 stopnie swobody i skręt.
- **Ustalenie projektu: tak, oczko jest jego zmianą.** Synteza `2026-10-25-referencja-face-maker101-synteza.md` §3, na której opiera się decyzja z 26.10, mówi dosłownie: „4 druty **bez oczek** i bez przegubów, końce w »Z« jak spinacz”. Gdyby (a) było jedynym wyjściem, musiałoby trafić do użytkownika jako zmiana założeń.

Ryzyka (a):

- **Luz:** martwy ruch gałki zależy od tego, o ile wnętrze oczka jest większe od mostka. Oczko gięte na trzpieniu ok. Ø2 wokół mostka 1,3 mm daje ok. 0,7 mm. Z zaczepem „Z” w orczyku Ø1,3 (0,3 mm) to ok. 4° na gałce. Wariant „Z” w otworze Ø2,0 daje ok. 5,3°, a Ø1,6 ok. 3,7°. Wszystkie warianty mają podobny rząd luzu.
- **Mostek:** otwór Ø2,4 na r 14 sięga do r 12,8, czyli do wewnętrznego końca języczka (`zacz_r0`). Oczko może więc objąć tylko mostek od strony z, o szerokości 1,3 mm. Wymaga to doprecyzowania geometrii.
- **Gięcie i montaż:** oczko trzeba zamknąć z drutem przełożonym przez otwór. Ogon trzeba owinąć wokół pręta, co pogrubia go o ok. 3 mm przy języczku, a tego nie objęło żadne przemiatanie. Robi się to szczypcami okrągłymi. Da się to zrobić palcami tylko przed osadzeniem gałki na kardanie. Po osadzeniu dostęp jest przez pierścień ok. 22 mm między piastą Ø11 a krawędzią czaszy Ø55. Kolejność montażu trzeba więc zapisać.
- **Wypadanie:** zamknięte oczko nie wypadnie. Zaczep „Z” w luźnym otworze trzyma się na obu zagięciach i przy przechyle nie wychodzi. Wypadnięcia nie oceniam jako ryzyka w żadnym wariancie.

## Uwagi

| Waga | Miejsce | Scenariusz porażki | Poprawka / test | Pewność |
|---|---|---|---|---|
| KRYTYCZNE | języczki gałki, `zacz_otw` 1,3 / `zacz_gr` 2,5, `ODS` 1,75 | Drut przechyla się najwyżej o 6,7°, a potrzeba 26,8° / 40,9°. Pręt zakleszczy się albo zegnie | Obrócić języczek G–D (otwór ∥ y gałki), dać otwór Ø2,0 z fazkami do walca 1,2 i nogę „Z” ok. 3,5. Potem ponowne przemiatanie z przechylonym odcinkiem przez otwór | wysoka (rachunek) |
| WAŻNE | obrócony języczek G–D przy y ≈ 14 | Nie sprawdziłem kolizji z prętem L–P, piastami kardana Ø11 ani czaszą | Przemiatanie `duze-oko-v3-przemiatanie.py` po zmianie, z luzem drutu w otworze | średnia |
| WAŻNE | luz w zaczepach (wszystkie warianty) | Martwy ruch gałki ok. 4–5° | Najpierw próbka języczka z otworem Ø1,6 / Ø2,0 i walcem 0,8 / 1,2, zmierzyć przechył i luz | średnia |
| DROBNE | orczyk G–D | Potrzebny przechył 5,9°. Otwór Ø1,3 w ramieniu gr. ok. 2 mm daje ok. 8°, więc zapas jest mały | Sprawdzić otwór orczyka MG90S albo rozwiercić do Ø1,5 | średnia (grubość ramienia założona) |
| DROBNE | PRD §4 „Pręty: drut Ø2 albo drukowane” wobec ustalenia 1 „drut Ø1,0” | Sprzeczność w dokumentach | Zgłosić do PM | wysoka |

## Werdykt dla (a): **NADMIAROWE**

**(a) nie jest potrzebne do spełnienia PRD, bo zaczep „Z” spełnia pełny cel: po obróceniu otworu G–D na oś y gałki wymagany przechył spada z 40,9° do 27,7°, a otwór Ø2,0 z fazkami do walca 1,2 mm daje 33,6° przy nodze „Z” ok. 3,5 mm.** Oczko staje się zapasem, a jako odejście od „bez oczek” z syntezy wymaga decyzji użytkownika dopiero wtedy, gdy ten wariant nie przejdzie przemiatania albo próbki.
