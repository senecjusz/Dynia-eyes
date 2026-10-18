Jesteś recenzentem ADWERSARYJNYM. Robisz PEŁNE review wersji v2.3 modułu małego oka do prawdziwej dyni: całej wersji, nie tylko zmian. Przeczytaj AGENTS.md (zasady dla recenzenta) i CLAUDE.md. Pracujesz TYLKO DO ODCZYTU: nie zmieniaj repo, skrypty uruchamiaj z katalogu tymczasowego. Odpowiadaj po polsku, zwięźle.

Materiały:
- 30-projekt/plan-v2-modul-oka.md (opis v2.2 i v2.3 oraz TABELA LUZÓW v2.3), 40-cad/solidcraft/README.md (model w SolidCraft 0.15: parametry, komponenty, jointy),
- 40-cad/solidcraft/oko-f-v2.3.solidcraft (model źródłowy; jeśli się da, odczytaj parametry; jest też CLI: "C:/Program Files/SolidCraft/solidcraft-cli.exe" eval/inspect, ale TYLKO odczyt, niczego nie zapisuj), 40-cad/solidcraft/png/ (zrzuty), dla porównania v2.2: 40-cad/onshape/oko-f-v2.2-build.js i siatki 40-cad/3mf/Oko F v2.2/,
- SIATKI v2.3: katalog 40-cad/3mf/Oko F v2.3/ (eksport z SolidCraft; sprawdź, czy części są w pozycji złożonej, a jeśli nie, użyj złożenia z modelu albo zgłoś to). Najpierw potwierdź wersję liczbami: gwint gniazda M63×3, gniazdo wewn. Ø55,0, okienka zaczepów na 52° i 232°, pasek 3,5 mm,
- 30-projekt/review-cad.md, 30-projekt/decyzje.md, 70-budowa/dziennik.md.

Koncepcja v2.2: GNIAZDO montowane raz w dyni (rant na skórce, nakrętka od środka, bez mechanizmu). KASETA to kompletny moduł oka skręcony na stole: tuleja, jarzmo z miską i wklejoną piłeczką 39,5–40,5 na osi 2 × M3 ISO 7380, napęd na M3 z tulejkami i wkładkami, SG90 na sankach, pokrywa. Kaseta wsuwa się osiowo od środka dyni: rowek na żebrze (oś pionowa), oparcie o kołnierzyk Ø41, 2 sprężyste zaczepy w okienkach; wyjęcie palcami. Zakres pracy ±30°, stop ±33°. PLA. Gwint luz 0,3, flanki 45°, pogłębiony zarys. Wymaganie użytkownika: w dyni nic się nie skręca.

Historia problemów, sprawdź, czy NIE wracają:
- v1.1 z wydruku: jarzmo wymagało podpór i pękało; nakrętka za ciasna (luz 0,3 przy flankach 62°); kabel SG90 (wychodzi u dołu krótszego boku od strony wałka) się nie mieścił,
- v2.1 z wydruku próbki: gwint przy luzie 0,5 za luźny (~1,3 mm luzu całkowitego),
- review v2.1d: jarzma z piłeczką nie dało się włożyć (słupek SG90, występy pokrywy), wtyczka nie przechodziła przez pokrywę, słabe ograniczniki (kołek Ø1,4), cienkie piasty ~1,15 mm, otwory pod wkładki za płytkie, dno cięgna 0,2 mm, przyrząd klejenia bez blokady kąta, kąt przenoszenia liczony po złej stronie, montaż w dyni narzędziem niewykonalny.

Sprawdź liczbowo:
1. Kolejność montażu na stole krok po kroku (symulacja wsuwania jarzma z piłeczką r 20,25 i sanek), dostęp narzędziem do każdej śruby, wklejanie piłeczki w przyrządzie (blokada kąta, centrowanie 39,5–40,5).
2. Wsuwanie kasety w gniazdo w dyni: żebro i rowek, zaczepy (ugięcie, odkształcenie względne w PLA ≤ ~2–3%, siła wsuwania i wyjęcia palcami, kierunek warstw), oparcie, luzy promieniowe; czy dziecko może to zrobić źle.
3. Kinematykę ±30° i ±33° (kąt przenoszenia po obu stronach, z luzami 0,2 mm, druga gałąź) oraz kolizje na siatkach w całym ruchu, łącznie z łbami śrub, SG90 i kablem.
4. Łańcuch wymiarów: otwór w dyni, gniazdo, gwint, nakrętka (luz i zazębienie), zakres grubości ścianki, zakładka rantu. UWAGA: użytkownik ma otwornice 45, 50, 56, 62 stałe, nastawną do 64 i maks. 80; otwór Ø63,5 użytkownik ZAAKCEPTOWAŁ (wywierci nastawną otwornicą do 64). Sprawdź tolerancję: czy przy 63–64 wszystko się zgadza.
5. Druk każdej części: płaska strona, nic nie wystaje, nawisy, ścianki ≥ 2 mm, kołki ograniczników, zaczepy, mostki.
6. Wkładki i śruby: głębokości otworów, długości śrub dostępnych w komplecie (M3 od 8 mm; krótsze trzeba ciąć), dna ≥ 0,6 mm.
7. Kabel i wtyczka 3-pin (~15 × 8 × 2,5): przejście, zacisk, promień zgięcia, wpięcie w dyni.
8. Sąsiednie moduły w dyni R150 (poziomo i pionowo) przy nowej średnicy.
9. Sprzeczności między planem, README, skryptem i siatkami.

Format: dla każdej uwagi waga (KRYTYCZNE / WAŻNE / DROBNE), miejsce, scenariusz z liczbami, poprawka albo test, pewność. Posortuj od najpoważniejszego, maks. 20 uwag. Na końcu werdykt jednym zdaniem: czy v2.2 nadaje się do wydruku testowego całego modułu, a jeśli nie, co MINIMALNIE poprawić.

UZUPEŁNIENIE v2.3: model został PRZENIESIONY z Onshape do SolidCraft (inne jądro CAD). Sprawdź także, czy przeniesienie niczego nie zgubiło ani nie zmieniło: porównaj kluczowe wymiary v2.3 z v2.2 (Onshape) i wypisz różnice, które nie wynikają z zakresu v2.3. Zakres v2.3:
- gwint ISO M63×3 (60°) zamiast 45° (nakrętka M63.6×3, luz 0,3/str.; próbka z luzem 0,6),
- luz sanek 0,25,
- fazki wejściowe żebra i rowka,
- zaczepy obrócone o −7°,
- pasek za okienkami 3,5 mm,
- ucha pod wkładki ≥ 1,6–2 mm,
- luz kaseta–gniazdo 0,25/str.,
- ramię i cięgno–kaseta ≥ 0,5,
- kołek przyrządu 0,3.
Oceń też, czy gwint 60° da się wydrukować pionowo (nawisy flank) i czy zazębienie jest wystarczające.
