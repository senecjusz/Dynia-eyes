**Recenzja E6.1e — koncepcja dużego oka v3.2, 23.10.2026**

Architektura U–R–U jest kinematycznie poprawna, a poprzednia kolizja piasty Y ze Słupkiem została usunięta. Nie potwierdzam jednak gotowości opisanej konstrukcji do wydruku całego mechanizmu: znalazłem zerowy przekrój połączenia stopu D, niedopasowane długości śrub oraz zawyżony zapas kąta i zaniżony luz zwrotny.

Przeprowadziłem odczyt dokumentacji, analizę kodu, ponowne obliczenie kinematyki i niezależne obliczenia kontrolne. Nie wykonywałem pełnego przemiatania nowych siatek CAD. Zgodnie ze zleceniem nie wymagam formalnego dowodu dla ruchu ciągłego.

**1. KRYTYCZNE — filar stopu D otwarcia nie tworzy połączenia o niezerowym przekroju**

Miejsce: koncepcja §5.2; [e6model.py:771](/home/rkp/Projects/010-Eye-pumpkin/Dynia-eyes/40-cad/narzedzia/e6-przemiatanie/e6model.py:771), `stop_posts()`.

Filar kończy się dokładnie na najniższej krawędzi obróconego słupka:

- wierzch filara: **z = −61,411915 mm**;
- najniższa krawędź słupka: **z = −61,411915 mm**, y = −17,662208 mm;
- krawędź biegnie od x −22,5 do −16,6.

Bryły dotykają się linią długości 5,9 mm. **Pole przekroju łączącego wynosi 0 mm².** Wyliczenie luzów do serw tego nie wykrywa, ponieważ para słupek–filar jest wykluczona jako połączenie zamierzone.

Scenariusz porażki: nieudane scalenie brył albo wydruk bez nośnego połączenia ogranicznika.

Poprawka/test: przedłużyć filar w głąb słupka lub zastosować podparcie dopasowane do jego dolnych ścian; podać minimalny przekrój połączenia. Sprawdzić jedną bryłę po operacji i po eksporcie. Dodatkowo uzupełnić model o opisane płytki podparcia G: `stop_posts()` nie realizuje gałęzi `wsp='klatka'`.

**Pewność: wysoka.**

**2. KRYTYCZNE — śruby mocowania Gałki w C6 są za długie**

Miejsce: koncepcja §3.5, C6 i montaż; pomiar nadlewów w `stan-api-e6.json`.

CAD ma otwory od z −12,68 do −7,28, czyli **5,4 mm głębokości**. DIN 7991 M3×8, osadzona równo w łapie grubości 2 mm, wystaje za łapę:

**8 − 2 = 6 mm**, czyli **0,6 mm więcej niż głębokość otworu**.

Scenariusz porażki: śruba dobija do dna przed dociśnięciem łapy, rozpycha nadlew albo przebija jego dno.

Poprawka/test: dobrać krótszą śrubę lub ją skrócić. M3×6 dawałaby nominalnie 4 mm zazębienia i 1,4 mm zapasu do dna; nośność tego mocowania sprawdzić w próbce. Zweryfikować stos wymiarów z rzeczywistym łbem i pogłębieniem.

**Pewność: wysoka dla nominalnych wymiarów.**

**3. WAŻNE — luz zwrotny gałki jest większy niż podano**

Miejsce: koncepcja §3.3, „Luz zwrotny”.

Nawet przy pozostawieniu uproszczenia **Δl = 8c + s** dokument nie uwzględnia poprawnie wpływu obu prętów na oba kąty. Przy ψ = +25°, θ = +15° niezależnie obliczona macierz wrażliwości wynosi:

\[
\begin{bmatrix}\delta\psi\\\delta\theta\end{bmatrix}
=
\begin{bmatrix}
-6{,}404&-2{,}050\\
-2{,}102&-4{,}481
\end{bmatrix}
\begin{bmatrix}\delta L_X\\\delta L_Y\end{bmatrix}
\quad [^\circ/\mathrm{mm}].
\]

Dla jednoczesnego niekorzystnego ułożenia luzów:

| Pasowanie, s = 0,1 mm | Δl każdego pręta | Luz ψ | Luz θ |
|---|---:|---:|---:|
| c = 0,03 mm | 0,34 mm | **2,87°** | **2,24°** |
| c = 0,05 mm | 0,50 mm | **4,23°** | **3,29°** |

To oszacowanie liniowe, bez luzu przekładni serw i podatności wydruków. Przy 4,23° przesunięcie punktu na R30 wynosi około **2,21 mm**.

Ponadto stwierdzenie „wszystkie sworznie są prostopadłe do pręta” jest nieprawdziwe przy wychyleniu: właśnie kąty a2 opisują odchylenie od tej prostopadłości. Luz osiowy krzyżaka między policzkami może wtedy dokładać składową wzdłuż pręta. Nie jest ujęty w `8c+s`.

Scenariusz porażki: wyraźny martwy ruch przy zmianie kierunku i poruszanie się gałki pod małym zmiennym obciążeniem. Sam luz nie dowodzi samowzbudnych drgań serwa; przy wyłączonym PWM pozostaje możliwość przestawiania i grzechotania mechanizmu.

Poprawka/test: liczyć pełną macierz dwóch prętów oraz projekcje luzów osiowych. P4 mierzyć również przy wychylonych przegubach, a po złożeniu mierzyć luz gałki w zerze i narożnikach zakresu. Kryterium P4 **≤0,3 mm** nie jest zagwarantowane nawet przez obecny uproszczony rachunek, który daje minimum 0,34 mm.

**Pewność: wysoka dla macierzy i pominiętego sprzężenia; średnia dla rzeczywistego luzu wydruku.**

**4. WAŻNE — zapas kąta ≥15,6° nie został potwierdzony przestrzennie**

Miejsce: [e6model.py:895](/home/rkp/Projects/010-Eye-pumpkin/Dynia-eyes/40-cad/narzedzia/e6-przemiatanie/e6model.py:895), `u_zakres()`; koncepcja §3.3.

Funkcja bada dwa osobne przekroje. Nie sprawdza jednoczesnego wychylenia wokół obu osi ani pełnej pary policzek–policzek.

Dla przegubu X przy gałce, przy ψ = +28°, θ = −18°, otrzymałem:

- obrót a1: **38,64°**;
- wychylenie a2: **22,69°**.

W przestrzennym modelu opisanych policzków, podstaw i zaokrąglonych końców, przy zachowaniu a1 = 38,64°:

- przy a2 ≈ **30,1°** odstęp policzków spada do około **0,5 mm**;
- przy a2 = 22,69° + 15,6° = **38,29°** znalazłem odstęp **0,238 mm**.

Zapas do kryterium 0,5 mm wynosi więc w tym przekroju ruchu około **7,4°**, a nie 15,6°. Nie wykazałem tym kolizji w wymaganym zakresie roboczym; wykazałem niepoprawność deklarowanego zapasu.

Scenariusz porażki: zaakceptowanie zmiany wymiarów na podstawie dwóch niezależnych limitów, mimo utraty luzu przy połączonym wychyleniu.

Poprawka/test: oceniać wnętrze przegubu w 3D dla rzeczywistych kombinacji a1/a2. P4 wykonywać z jednoczesnym wychyleniem obu osi.

**Pewność: wysoka dla kontrprzykładu; dokładny limit końcowy wymaga geometrii CAD.**

**5. WAŻNE — sworznie M2 mają niespójne długości i niedomkniętą ocenę wytrzymałości**

Miejsce: koncepcja §3.3, montaż §8 i P4.

Przy gałce opis konstrukcji przewiduje M2×4, natomiast montaż i P4 nadal wymieniają M2×5. Dla policzka 2 mm i szczeliny 0,25 mm:

- M2×4 wchodzi nominalnie **1,75 mm** w otwór głęboki 1,7 mm;
- M2×5 wchodzi **2,75 mm**, czyli o **1,05 mm za głęboko**.

Przy orczyku nominalne wejście 2,75 mm również wykorzystuje całą podaną głębokość otworu — bez zapasu do dna. Trzeba uwzględnić zakończenie wiertła i końcówkę śruby.

Dodatkowo szerokość policzka pręta przy gałce wynosi **2rP = 3,6 mm**, podczas gdy model przyjmuje promień łba 2 mm. Pogłębienie Ø4 wychodzi poza obrys policzka o 0,2 mm na stronę. Nie oznacza to automatycznie zerwania, ale wymaga policzenia rzeczywistego przekroju po pogłębieniu.

Siły potwierdziłem niezależnie dla przyjętego obciążenia gałki 0,5 N·m:

| Zakres | Pręt X | Pręt Y |
|---|---:|---:|
| Praca | **58,8 N** | **43,0 N** |
| Do ogranicznika | około **79,9 N** | około **55,9 N** |

Przy podziale 80 N na dwa sworznie docisk **11,8 MPa** jest poprawny jako średnia nominalna. Nie dowodzi jednak odporności na wyrwanie:

- krążek Hr = 4 mm z otworem Ø2 pozostawia **1 mm materiału** do czoła;
- prosty model wyrwania dwoma pasmami po 1,7 × 1 mm daje również około **11,8 MPa**, ale na ścinanie/rozwarstwienie, nie na ściskanie;
- orientacyjny model wspornikowy sworznia, z ramieniem 0,25 + 1,7/2 = 1,10 mm i rdzeniem Ø1,57, daje około **116 MPa naprężenia zginającego**;
- nie oceniono wyrwania krótkiego gwintu z policzka po pogłębieniu.

Scenariusz porażki: zablokowany krzyżak po dokręceniu, pęknięcie policzka, wyrwanie sworznia lub rozwarstwienie krążka mimo poprawnego rachunku docisku.

Poprawka/test: ujednolicić długości, zapewnić dodatni zapas do dna, ocenić przekroje po pogłębieniu. P4 ±80 N wykonać przy niekorzystnym połączonym wychyleniu, następnie ponownie zmierzyć luz. Wytrzymałość PLA 60 MPa na ściskanie nie zastępuje tego sprawdzenia.

**Pewność: wysoka dla wymiarów i sił; średnia dla modeli zniszczenia, wymagających próby wydruku.**

**6. WAŻNE — zapisane przemiatanie i narzędzie akceptacji nie dają obecnie pozytywnego odbioru**

Miejsce: [przeguby_akceptacja.py:35](/home/rkp/Projects/010-Eye-pumpkin/Dynia-eyes/40-cad/narzedzia/e6-przemiatanie/przeguby_akceptacja.py:35), `przemiatanie.json`, koncepcja §10–11.

Podczas kontroli:

- zapisany wynik miał skrót **`28b2b7e4a3b8b8c1`**;
- aktualny model miał skrót **`5365b33b22f7d2e8`**;
- dokument pozostawiał wynik akceptacji jako **„⟦brak⟧”**.

Zastosowanie zapisanych w skrypcie progów do starego wyniku wskazuje cztery naruszenia: **0,494 < 0,5 mm** oraz trzy pary obrotowe **0,190–0,193 < 0,2 mm**. Te ostatnie wynikają z odjęcia promienia pokrycia próbek od nominalnego luzu 0,25 mm; nie są dowodem rzeczywistej kolizji. Są jednak wynikiem **NIE** według obecnej bramki.

Narzędzie nie włącza też wyników `stale_pary.py`, a kontrola wejścia wymaga tylko trzech pól nadrzędnych — brakujące wymiary wewnątrz `uGal`/`uOrcz` są uzupełniane wartościami domyślnymi.

Scenariusz porażki: odbiór nieaktualnego wariantu albo uzyskanie „TAK” bez sprawdzenia podparć i kompletności wymiarów.

Poprawka/test: odtworzyć wynik dla aktualnego modelu, rozstrzygać przypadki graniczne dokładnym pomiarem CAD, dołączyć pary stałe i walidację wymaganych wymiarów. Nie obniżać progów tylko po to, żeby wynik przeszedł.

**Pewność: wysoka.**

**7. WAŻNE — końcowa kontrola siatek wymaga jeszcze obsługi U–R–U**

Miejsce: [e6-siatki-ruch.py:418](/home/rkp/Projects/010-Eye-pumpkin/Dynia-eyes/40-cad/narzedzia/e6-siatki-ruch.py:418).

`kinematyka_pretow()` kończy się `NotImplementedError`. Kierunek między środkami przegubów nie wystarczy do ustawienia drukowanych widełek: potrzebna jest również orientacja wokół pręta, wyznaczona przez U przy gałce, oraz osobna orientacja widełek za obrotnicą.

Scenariusz porażki: brak wykonania zapowiedzianej kontroli albo sprawdzenie pręta z niewłaściwie ustawionymi policzkami.

Poprawka/test: przed odbiorem napędu dodać transformacje prętów, obu krzyżaków i widełek obrotnicy oraz właściwe pary wewnętrzne. Kontrolować również łby i końcówki sworzni.

**Pewność: wysoka.**

**Kinematyka, martwe punkty i momenty — wynik pozytywny z ograniczeniami powyżej**

U–R–U ma pięć ruchów przegubowych i generuje jeden więz odległości. U przy gałce wyznacza obrót pręta, a obrotnica przy orczyku umożliwia pogodzenie orientacji obu końców. Nie pozostaje niezależny jałowy obrót pręta charakterystyczny dla idealnego S–S. Warunek praktyczny: obrotnica musi pozostać swobodna po dokręceniu M3.

Odtworzyłem zakresy serw:

| Serwo | Praca | Do ogranicznika |
|---|---|---|
| X | −29,5…+40,4° | −32,2…+47,4° |
| Y | −21,0…+31,7° | −24,5…+40,2° |

Na sprawdzonej siatce z dodatkowymi punktami granicy nie znalazłem martwego punktu. Minimalna wartość singularna Jacobianu serwo–gałka wyniosła około **0,598 w pracy** i **0,442 do ogranicznika**.

Maksymalne momenty przy obciążeniu 0,5 N·m:

- w pracy: **X 0,706 N·m, Y około 0,571 N·m**;
- do ogranicznika: **X około 0,930 N·m, Y około 0,735 N·m**.

T1 pozostaje potrzebny. Przyjęte 0,177 N·m momentu zablokowania serwa nie jest pomiarem wytrzymałości przekładni na obciążenie od ręki.

**Kolizja piasta–Słupek i nowe widełki — poprzedni błąd usunięty**

Aktualny wariant nie tworzy piasty M2. Przypadki kontrolne poprawnie odtwarzają starą kolizję: **−0,803069 mm** dla punktu Astry i **−0,859 mm** dla starej piasty.

Dla aktualnych widełek Y, przy ψ = 0°, θ = 15°, ponownie otrzymałem co najmniej:

- **2,027 mm** dla widełek stałych wobec Słupka i dolnego kardana;
- **3,380 mm** dla widełek pręta wobec tych brył.

Sprawdzone położenia graniczne również nie ujawniły powrotu tej kolizji. Zapisane minima do czaszy Gałki wynoszą 2,67 mm dla widełek stałych X i 1,83 mm dla Y. Nie traktuję tego jako pełnego odbioru nowych widełek wobec wszystkich powiek: pozostaje aktualne przemiatanie i kontrola CAD.

Deklarację „cały Uchwyt ≥1,50 mm od Słupka” należy zawęzić: zapisany wynik dla łap Uchwytu wynosi **1,092 mm**, nadal powyżej wymaganego luzu.

**Spójność C1–C6 z CAD**

| Zmiana | Ocena |
|---|---|
| C1 | Aktualny kod ma właściwy wariant: **bez wycięcia kołnierza**, mostek 56–95°, ucho G R5,5. Dokument nadal wielokrotnie poleca odrzucone wycięcie. Usunąć te instrukcje i zastąpić stare wyniki nowymi. |
| C2 | Wycięcie R4,6 wokół ucha D jest w modelu analitycznym; nie znalazłem potwierdzenia jego wykonania w odebranym etapie 2a. Pozostaje nową operacją CAD. |
| C3 | Zmiana 104°/±25° → **98°/±30°** odpowiada istniejącym zmiennym i operacjom Gałki. Nie jest potwierdzona jako wykonana. |
| C4 | Analogicznie 106°/±35° → **102°/±40°**, środek 80°. |
| C5 | Istnieją parametry pasa x −2…24 i kąta 83,5°. Zmiana na **−14…24 i 82,5°** jest strukturalnie spójna. |
| C6 | Położenie nadlewów R23,5, Ø7, z −12,68…−6,68 zgadza się z późniejszym pomiarem CAD. Kierunek montażu łap jest właściwy; długość śrub wymaga poprawki z punktu 2. |

Przesunięcie stopów D usuwa zgłoszone wejście w korpus S_X: ich x kończy się na −16,6 wobec początku korpusu −15,987, czyli nominalnie pozostaje **0,613 mm**. Zapisane wyniki 0,556–0,557 mm uwzględniają zapas próbkowania. Nie rozwiązują jednak problemu połączenia filara z punktu 1.

**DROBNE — porządek dokumentacji**

W §8 długość pręta X nadal wynosi 43,611 mm zamiast odtworzonych **43,635 mm**. W §17 pozostało obciążenie P4 ±72 N, podczas gdy właściwa tabela wymaga **±80 N**. Poprawić przed przekazaniem briefu; pewność wysoka.

Nie zmieniałem plików ani nie wykonywałem wywołań API Onshape. Repo było równolegle aktualizowane; identyfikatory wyników podane wyżej określają sprawdzony stan. Nie pozostawiłem własnych procesów w tle.

**Werdykt: TAK PO POPRAWKACH — po zapewnieniu nośnego podparcia stopu D, poprawieniu długości śrub i geometrii sworzni, przeliczeniu luzu oraz przestrzennego zapasu przegubów, ujednoliceniu C1–C6 i zaliczeniu P4 oraz aktualnej kontroli siatek CAD.**