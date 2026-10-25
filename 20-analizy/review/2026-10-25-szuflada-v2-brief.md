Jesteś recenzentem. Pełne review szufladki v2 podstawki pod dynię (korpus, front, rączka, blokada, PIR we froncie) i jej zgodności ze stanem wykonanym podstawki. Tylko pod kątem działania, montażu i druku. TYLKO DO ODCZYTU: bez zmian w repo i bez git; eksporty i skrypty tylko do katalogu tymczasowego. Jedyny plik, który zapisujesz, to Twój raport (ścieżka na końcu). Po polsku, zwięźle.

Materiały (katalog roboczy = korzeń repo):
- wymagania: `30-projekt/PRD.md` 0.2, §5 (wymiary wykonane podstawki, szufladka v2, PIR) i §7–8; `AGENTS.md` (DFAM, luzy, śruby z nakrętkami, klej dozwolony);
- model: `40-cad/openscad/podstawka.scad` – nagłówek pliku opisuje rozstrzygnięcia techniczne z uzasadnieniem; moduły `korpus()`, `front()`, `raczka()`, `pirPrym()`/`pir()`, `sruby()`, `sklejka()`, `plyta()`, `kaseta()`, `zlozenie()`, kontrole `kolizja*()`; OpenSCAD 2021.01: `openscad`;
- skrypty: `40-cad/openscad/podstawka-eksport.sh` (eksport, siatki, wymiary), `podstawka-kolizje.sh` (kolizje CGAL, wynik pusty = OK), `podstawka-zginanie.sh`; narzędzia `40-cad/narzedzia/` (`sprawdz_siatki.js`, `skladowe_siatki.js`, `podstawka-wymiary.js`);
- siatki do druku: `40-cad/3mf/Podstawka v2/` (Szuflada v2 – korpus, front, rączka; kaseta, tuleja, nakrętka, próbki gwintu);
- podglądy: `40-cad/openscad/podglad/podstawka-v2-*.png`, `podstawka-ciecie.png` (płyta górna z otworem pilotowym blokady);
- zdjęcia PIR HC-SR501 (źródło wymiarów płytki): `20-analizy/2026-10-25-pir-zdjecia/`.

Stan wykonany podstawki (pomiary użytkownika 25.10, fakt): skrzynka 252 × 226, wnętrze 216 szerokości i 40 wysokości, dno 9 (sklejone ze ściankami), boki i płyta górna 18, płyta przykręcana 4 wkrętami 20 mm od frontu i tyłu (9 od boku), otwór w płycie Ø60–61, otwarta z przodu. Ścianka tylna 18 – założenie. Kaseta elektroniki v1 może być już wydrukowana i ma zostać bez zmian.

Wymagania z PRD 0.2 (funkcja – nie zmieniać): korpus i front osobno, skręcane; korpus ≤ 215; wtyk USB-C 50 mm zostaje (decyzja użytkownika), ścianki korpusu 2,0; rączka na wklejonych M4 z łbem okrągłym (epoksyd, imbus), nakrętki od środka z dala od powerbanku; blokada M4 na środku górnej krawędzi frontu, w przednią krawędź płyty górnej 18; PIR we froncie: otwór Ø24, od tyłu gniazdo 23,5 × 23,5 na kołnierz 3 mm, docisk mostkiem albo 2 × M2, za płytką ≥ 10 mm (z wtykami Dupont ok. 20 mm); druk na X1C (≤ 256). Szufladka otwierana do przodu, tylko powerbank w środku, USB-C wpinany ręcznie.

Sprawdź liczbowo (na siatkach albo w modelu, z liczbami):
1. Zgodność modelu i rysunku płyty ze stanem wykonanym i PRD 0.2.
2. Korpus w podstawce: luz na stronę, wsuwanie na całej drodze (dno, ścianki, płyta, kaseta), powerbank pod płytą, wtyk USB-C i wycięcie kablowe wobec gniazda zasilania kasety.
3. Front: zakładki na ścianki i płytę, odstęp od stołu i od wierzchu płyty, druk licem na stole bez podpór, sztywność płyty 4 mm.
4. Połączenie front–korpus: 2 × M4 rączki i 2 × M3 przy dolnych rogach – długości śrub, dostęp do nakrętek, czy nakrętki i końce śrub omijają PIR i powerbank.
5. Rączka: wytrzymałość przy szarpnięciu, gniazdo łba M4 na klej (Ø8, szczelina 0,5), druk pałąkiem na stole, prześwit na palce, wpływ na pole widzenia PIR.
6. Blokada: trafienie w krawędź płyty 18 (wysokość, odległość od wkrętów płyty i od tulei), długość otworu pilotowego, czy łeb mieści się na froncie, czy blokuje wysunięcie.
7. PIR: gniazdo kołnierza, luty od strony soczewki wobec tyłu frontu, słupki i otwory M2 (Ø1,7, M2 × 6), okno w przedniej ścianie korpusu wobec kondensatorów na rogach, miejsce za płytką, przewód do ESP32 w kasecie (szufladka jest ruchoma).
8. Siatki: szczelne, 1 bryła na część, wymiary zgodne z parametrami; kaseta bez zmian wobec v1.

Wagi: KRYTYCZNE (nie zadziała albo nie złoży się / nie wydrukuje), WAŻNE, DROBNE. Dla każdej uwagi: miejsce, scenariusz porażki, poprawka albo test, pewność. Nie dopisuj funkcji spoza PRD. Na końcu werdykt jednym zdaniem: czy korpus, front i rączkę v2 można drukować.

Raport zapisz do pliku: `20-analizy/review/2026-10-25-szuflada-v2-<RECENZENT>.md`.
