# Review planu `dynia-v2`, runda 2 (Opus, 24.10)

Zamknięte z rundy 1: podtrzymanie (ukryty AP przed serwami, wiersz 18), PIR w etapie 1, rdzeń Hermite'a z `ruch.cpp` i zadanie FreeRTOS, powieki 0–100 %, wolny dojazd pod limitem, limit 5 serw, „Min to”, 27 MHz/prescale 131, elipsa i 4 rogi, znane ograniczenie skoku, osobna przestrzeń NVS z limitami 2 s / 0,5 s, powieka przy starcie do „zamknięte”, wariant A w etapie 2, 75 % i limit 4 w wierszu 4, Wi-Fi jako obciążenie w wierszu 13, strona jako odstępstwo do decyzji. Częściowo otwarte: NVS przy braku/złym odczycie, granice µs. Poprawki nie dodają funkcji ponad PRD (FreeRTOS, elipsa, port szeregowy to technika i narzędzia testowe; dziennik NVS osobno jako propozycja).

**WAŻNE 1: twarde granice 900–2100 µs w rdzeniu z `ruch.cpp`.** `wyslij()` (ruch.cpp:142) obcina do `US_MIN_ABS/US_MAX_ABS` = 900/2100 (dynia.h:38), kalibrator dopuszcza 600–2400. Kraniec z tabeli poza 900–2100 zostanie po cichu obcięty (powieka się nie domyka, mniejszy zakres oka). Poprawka: granica każdego kanału z jego min/max w `kalibracja.h`; granica absolutna obejmuje 600–2400; przy starcie wartość z NVS ograniczać do min/max kanału.

**WAŻNE 2: NVS bez reguły przy braku lub złym odczycie** (uwaga Astry z rundy 1). Plan nie mówi, co przy braku wpisu, błędzie otwarcia albo wartości spoza [min, max]. Po zmianie kalibracji stara pozycja może wypaść za opór. Poprawka: „brak, błąd albo wartość spoza [min, max] = start od środka z `kalibracja.h` (znany skok)”.

**WAŻNE 3: „minimum na szkołę” bez ruchu plastycznego nie jest nazwane odstępstwem.** PRD §6 wymaga ruchu plastycznego, w tym mrugania. Poprawka: przy etapie 1 dopisać, że bez etapu 2 dynia nie mruga i nie przymyka powiek – odstępstwo od §6 do decyzji użytkownika.

**DROBNE 4.** Start a reguła spoczynku: najpierw gałka na środek, potem powieka (albo zapisać wyjątek).
**DROBNE 5.** Test tylko na Baseusie; dodać ≥ 5 min na Mancie (zapas z PRD §5).
**DROBNE 6.** PIR: zworka H (retrigger); kondensator 470–1000 µF przy V+ w opisie testu z 5 serwami.
**DROBNE 7.** Etap 2: „nastrój losowo co kilka minut” oznaczyć jako założenie.

Propozycje poza PRD: bez nowych.

**Werdykt:** plan etapu 1 można dać użytkownikowi do zatwierdzenia po dopisaniu trzech zdań: granice µs z kalibracji zamiast 900–2100, reguła startu przy złym lub braku wpisu NVS oraz informacja, że bez etapu 2 dynia w szkole nie mruga.
