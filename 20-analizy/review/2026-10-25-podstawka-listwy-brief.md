Jesteś recenzentem. Szybka WERYFIKACJA jednej zmiany w modelu podstawki pod dynię: szufladka leży dnem na 2 drukowanych listwach nośnych, przykręconych wkrętami od zewnątrz przez ściankę ze sklejki. Tylko pod kątem działania i druku. TYLKO DO ODCZYTU: bez zmian w repo, bez git; eksporty i skrypty tylko do katalogu tymczasowego. Po polsku, zwięźle.

Materiały:
- opis: 20-analizy/2026-10-25-podstawka-model.md, sekcja „Zmiana 25.10 (rano): szufladka na listwach nośnych”, tabele cięcia i druku, krok 4 montażu;
- model: 40-cad/openscad/podstawka.scad (zmienne lnH, lnPod, lnW, lnY, lnWkretOd, dWkretPilot, lnDnoOtw, dWkretSkl, dLebSkl, szNad; moduły listwaNosna(), scianaBoczna(), szuflada(), zlozenie(), rysunekCiecia()); podstawka-drewno.scad; OpenSCAD 2021.01: "C:/Program Files/OpenSCAD/openscad.com";
- siatki: 40-cad/3mf/Podstawka v1/Listwy nosne x2.3mf, Szuflada*.3mf (szufladka bez zmian względem commitu de713fe – użytkownik drukuje lewą połówkę w nocy), Oslonka PIR (opcja).3mf;
- rysunki: 40-cad/openscad/podglad/podstawka-ciecie.png, podstawka-drewno.png;
- zasady: AGENTS.md (bez kleju, śruby/wkręty, DFAM, luzy). Wymaganie użytkownika: szufladka prowadzona w skrzynce, nie leży na stole, wysuwana do przodu; bez przedruku szufladki.

Sprawdź liczbowo:
1. Szufladka na listwach: zachodzenie dna na listwę, luz boczny, wysokość nad stołem, wysuwanie do przodu (czy szufladka nie spada z listew przy wysunięciu ok. 100 mm do wymiany powerbanku – wtedy może stanąć na stole, to dopuszczalne), brak kolizji w złożeniu (szufladka, ścianki, płyta, kaseta, listwy).
2. Wkręty 3 × 25 od zewnątrz: otwór Ø3,5 w sklejce 18 + pogłębienie, otwór pilotowy Ø2,5 w listwie (głębokość, dno), czy wkręt nie wychodzi z listwy, materiał wokół otworu przy listwie 8 mm wysokiej, odległość otworu od dolnej krawędzi sklejki (4 mm).
3. Druk listew: orientacja, ≤ 180, bez podpór, siatki szczelne.
4. Wysokości: wnętrze 48, powerbank i PCA9685 pod płytą; PIR i osłonka (nie sięga pod stół, liczona od stołu).
5. Rysunek cięcia: wymiary i otwory zgodne z modelem.

Uwagi tylko jako „PSUJE DZIAŁANIE ALBO DRUK” (opisz z liczbami i poprawką) albo „BRZEGOWE” (jedna linijka). Nie dopisuj funkcji. Na końcu jedno zdanie: czy listwy, rysunek cięcia i szufladkę z nocnego druku można używać.
