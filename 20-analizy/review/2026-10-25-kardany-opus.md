# Review: druty S1/S2 z gałką na kardanach 2/2 (v8) – krytyk Opus, runda 1 z 2

25.10.2026, tylko odczyt. Oceniane: `duze-oko-v2.scad` (stan roboczy v8: `kostkaKardana`, `rUcha` 17, `tylRant` 4, `zUcho` 0, `przesS2` 4), `kolizje-kardany-v8.txt`, siatki i parametry v8 (`C:/Users/Karol/AppData/Local/Temp/v8/stl`).
Oznaczenia: **[P]** przemiatanie projektanta, **[O]** moje obliczenie (kinematyka z parametrów v8, siatka θ ±35° × φ ±25° co 5°; analiza nawisów na `Galka.stl`), **[Z]** założenie.

## Streszczenie

Kardan 2/2 rozwiązuje przechył przy gałce. Zgięcie wynosi najwyżej 50,2° (S1) i 42,5° (S2) przy zdolności ok. 90°. Serwa pracują w zakresie −40…+28°, kąt ramię–pręt nie spada poniżej 48°, kolizje części są czyste.

Dwie rzeczy PSUJE dotyczą końca pręta przy orczyku. Kardan nie pozwala prętowi obracać się wokół własnej osi, więc noga L w otworze orczyka zmienia nachylenie w trakcie ruchu: przy złym ustawieniu krzyżaka do 22°, przy dobrym 5,1° (S1) i 8,7° (S2), a otwór Ø2,2 w orczyku 2 mm daje ok. 5,7°. Do tego L nie ma zabezpieczenia przed wysunięciem.

Druk kostek jest w porządku: żebro ok. 58° od poziomu, a płaski nawis to tylko strop gniazda piasty, ok. Ø5. Krawędź gałki przy θ ±35° jest widoczna jako ciemny pasek do 3,4 mm (było 1,7) – brzegowa. Werdykt: do wydruku po zapisaniu orientacji krzyżaka, poszerzeniu otworu orczyka S2 i zabezpieczeniu L.

## PSUJE

**P1. Orientacja krzyżaka kardana decyduje o zakleszczeniu przy orczyku – nie ma jej w modelu ani instrukcji.** [O]
- Kardan przenosi obrót, więc obrót pręta wokół własnej osi wynika z położenia gałki. Noga L w otworze orczyka musi być ∥ osi serwa (x). Różnica to przechył nogi w otworze.
- Najgorszy przechył w zakresie, zależnie od obrotu krzyżaka wokół osi piasty 1 (β, co 15°):

| β | 0° | 30° | 60° | 90° | 120° | 150° |
|---|---|---|---|---|---|---|
| S1 | **5,1°** | 7,7 | 15,1 | 22,5 | 18,8 | 8,2 |
| S2 | **8,7°** | 13,5 | 19,6 | 22,0 | 17,2 | 10,1 |

- β = 0: sworzeń krzyżaka od strony pręta (piasta 2) **równoległy do osi serwa** przy gałce na wprost. Wtedy główny ruch pręta jest obrotem na tym sworzniu, jak na orczyku.
- Otwór Ø2,2 w orczyku 2 mm z prętem Ø2 daje przechył atan(0,2/2) ≈ 5,7°. S1 przy β 0 się mieści (5,1), S2 nie (8,7). Nadmiar 3° skręca pręt Ø2 dł. 47 mm: GJ/L ≈ 2700 N·mm/rad → **ok. 140 N·mm**, czyli ok. 80% momentu MG90S [Z: 176 N·mm], jako opór gałki w narożnikach. Przy β ≥ 30° zakleszczenie.
- Użytkownik ustawia β sam (piasta 1 na kołku, piasta 2 na pręcie, przed dokręceniem).
- **Poprawka:**
  - (a) w instrukcji i na rysunku: „sworzeń krzyżaka przy pręcie poziomo, równolegle do osi serwa, przy gałce na wprost”;
  - (b) otwór orczyka S2 Ø2,5 (przechył 14°, luz 0,5 mm → ok. 1,7° gałki) albo stożkowe rozwiercenie z obu stron.
- Pewność: wysoka co do mechanizmu, średnia co do liczb (luz kardana pominięty).

**P2. L pręta w orczyku bez zabezpieczenia przed wysunięciem.** [O]
- Pręt S2 odchyla się od płaszczyzny orczyka o stałe 13,6°, S1 o 1,2–5,1°. Siła w pręcie ma więc składową wzdłuż nogi: F·sin 13,6° = 0,24 F. Zmienia kierunek przy pchaniu i ciągnięciu, więc noga „wędruje” w otworze. Przy zablokowaniu S2 to ok. 3 N.
- Scenariusz porażki: noga wychodzi z orczyka, gałka traci oś.
- **Poprawka:** za orczykiem (od strony serwa) dogiąć ogon ≥ 5 mm (drut ocynkowany Ø2 gnie się łatwo), z orczykiem zdjętym z serwa. Albo Z z długim środkiem. Kierunek ogona w stronę osi serwa, wzdłuż ramienia orczyka.
- Pewność: wysoka.

## BRZEGOWE

- **B1. Piasta 1 – gałka 0,49 mm** [P] (wewnątrz, θ ∓35°, φ ∓25°): 0,01 poniżej tabeli, w narożniku. Do sprawdzenia przy montażu. Wkręty M3 piast kardana (śruby dociskowe) nie są w przemiataniu: jeśli wystają z piasty, obrócić je w stronę środka gałki.
- **B2. Druk kostek** [O, analiza `Galka.stl`]:
  - spody < 40° od poziomu to ok. 50 mm² na kostkę, głównie strop gniazda piasty (kopułka Ø ok. 5 mm na z ≈ 16) i dno otworu kołka;
  - żebro od skorupy (x 25,4, z 6,8) do kostki (x 19,8, z 15,7) ma spód ok. 58° od poziomu, więc drukuje się bez podpór;
  - ugięcie stropu gniazda < 0,5 mm zjada luz piasty (0,5) – sprawdzić na `ProbkaDrutu` (jest w niej kostka).
- **B3. Krawędź gałki widoczna z przodu** [O]:
  - przy `tylRant` 4 krawędź leży 97,7° od bieguna przedniego;
  - przy obrocie gałki o θ krawędź po drugiej stronie wychodzi na przód (z > 0), gdy θ > 7,7°;
  - szerokość ciemnego pasa przy brzegu kuli (w szczelinie otwartych powiek, ±x): θ 20° → 0,7 mm, 30° → 2,2 mm, **35° → 3,4 mm**, narożnik (42° łącznie) → ok. 5,2 mm;
  - przy `tylRant` 8 było: 35° → 1,7 mm;
  - kardanów nie widać: są na r 17 w głębi, pod kątem ślizgowym.
- **B4. Półksiężyc:** rowek T przycięty do Rg − 0,8 → na froncie zostaje 0,8 mm skorupy (2 ścieżki). Dziury już nie ma, ale biały PLA 0,8 mm może prześwitywać jako cień nad rowkiem. Sprawdzić na wydruku, ewentualnie Rg − 1,2.
- **B5. Luz kardana** [Z]: tanie kardany 2/2 mają luz krzyżaka ok. 0,1–0,2 mm osiowo → ok. 0,3–0,7° gałki (ramię 17). Grub M3 na pręcie Ø2 trzyma osiowo ok. 300 N [Z: docisk ~1 kN, μ 0,3] wobec 10 N z serwa – nie przesunie się.
- **B6. Przemiatanie powiek v8** nie było gotowe w chwili review (`kolizje-powieki-v8.txt` brak). Kardany wobec powiek, SG, SD i Pierścienia są > 3 mm w `kolizje-kardany-v8.txt`.
- **B7. Otwór Ø2,2 w orczyku MG90S:** ramię ok. 4–5 mm szerokości [Z] → ścianka 0,9–1,4 mm. Docisk 10 N / (2 × 2) = 2,5 MPa – wytrzyma, ale wiercić ostrożnie (krok co 2 mm: rozwiercić istniejący 17,5 / 13,5, nie nowy).

## Odpowiedzi na pytania

**1. Kinematyka** [O]
- Zgięcie kardana (`rUcha` 17): S1 max **50,2°** (θ 35°, φ −25°), S2 max **42,5°** (θ 35°, φ −25°) – połowa zdolności 90°.
- Serwa: S1 α −39,8…+28,0°, S2 α −40,1…+25,5° (zgodne z [P]).
- Martwy punkt: najmniejszy kąt ramię orczyka–pręt 53,7° (S1), 48,3° (S2) – daleko od 0°.
- Zmiana `rUcha` 20 → 17 i `zUcho` −4 → 0: krótsze ramię gałki daje ok. 18% większą siłę w pręcie przy tym samym oporze. Zakres ±35/±25 osiągalny, nieosiągalnych pozycji brak.
- Długość: przesuw pręta w piaście 2 → błąd gięcia nie gra roli, zero w ESP32.

**2. Kolizje:** wszystkie pary kardanów > 0,5 poza B1 (0,49). Pręt S1–S2 1,66, piasta 2 S1–uchwyt 1,75, piasta 2–gałka 0,99/1,53 [P]. Brak w przemiataniu: wkręty M3 piast (B1), ogon L za orczykiem (P2).

**3. Wykonanie:** druk B2. Klejenie kołka Ø2 w Ø2,2: pionowy otwór ślepy, klej od spodu przez otwór tylny – wykonalne. Zagięcie L w orczyku: P2, B7.

**4. Luz:** B5, plus luz otworu orczyka z P1(b).

**5. Wygląd:** B3, B4.

**6. Ręcznie, w punktach:**
1. Wydrukować `ProbkaDrutu` (kostka): wcisk kołka Ø2, nasadzenie piasty, strop gniazda.
2. Wyprostować drut ocynkowany Ø2: kołki 2 × ok. 15 mm, pręty 2 × ok. 60 mm.
3. Piastę 1 każdego kardana nasadzić na kołek i dokręcić wkrętem M3 **na stole** (w gałce klucz nie dojdzie). Potem kołek z kardanem wkleić w kostkę, ustawiając krzyżak wg P1(a). Wkręt piasty w stronę środka gałki.
4. Pręt: zgiąć L na jednym końcu, rozwiercić otwór orczyka (S1 Ø2,2, S2 Ø2,5), włożyć L, zagiąć ogon za orczykiem (P2).
5. Orczyk na serwo w zerze (1500 µs). Pręt wsunąć w piastę 2, gałka na wprost, sworzeń krzyżaka przy pręcie ∥ osi serwa, dokręcić wkręt piasty 2 (dostęp od tyłu, poza gałką).
6. Ruszyć gałką ręką w 4 narożniki (serwa odłączone): bez zacięć, bez skręcania pręta.
7. Kalibracja zera S1, S2 w ESP32.

## Werdykt

Kardany 2/2 nadają się do wydruku testowego pod dwoma warunkami: w instrukcji jest zapisana orientacja krzyżaka (sworzeń przy pręcie ∥ osi serwa), otwór orczyka S2 jest poszerzony do Ø2,5, a L pręta ma ogon zabezpieczający za orczykiem (P1, P2). Reszta to uwagi brzegowe.
