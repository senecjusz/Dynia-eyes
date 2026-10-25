# Weryfikacja: szufladka na listwach nośnych (Opus), 25.10.2026

Zakres: brief `2026-10-25-podstawka-listwy-brief.md`. Pracowałem tylko na odczycie repo, a obliczenia robiłem w `C:/Users/Karol/AppData/Local/Temp/opus-listwy` (OpenSCAD 2021.01, `sprawdz_siatki.js`, `skladowe_siatki.js`, `wymiary_siatki.js`, `podstawka-wymiary.js`).

## Pomiary

**1. Szufladka na listwach**
- Listwa lewa: x 18–25,5, y 0–101,8, z 0–8. Prawa: x 229,3–236,8.
- Szufladka: x 19,5–235,3, dno na z 8. Powerbank sięga do z 42, płyta zaczyna się na z 48, więc zostaje 6 mm.
- Część wspólna szufladki z listwami w OpenSCAD to sam styk zerowej grubości, 6 × 101,8 na z = 8. Dno zachodzi więc na każdą listwę na 6 mm, na całej długości. Przy przesunięciu bocznym o ±1,5 zachodzenie wynosi 4,5–7,5 mm.
- Luz boczny do sklejki: 1,5 na stronę. Czoło zachodzi na ścianki 8 mm, więc pokrywa luz.
- Ślizg: górna ściana listwy jest w druku ścianą pionową, a linie warstw biegną wzdłuż wysuwu. Dno szufladki leży w druku na stole, jest gładkie.
- Ciężar szufladki idzie przez listwy prosto w stół: listwa stoi na stole, z = 0. Wkręty tylko ustawiają listwę.
- Wariant z połówek: szew wypada na x 188,9 (abs), poza listwami. Moment na szwie, liczony szacunkowo przy 4,5 N, to ok. 50 N·mm. Siła w M3 wychodzi ok. 2 N, przy ramieniu 26 mm do górnej krawędzi ścianek. Pomijalne.
- Wysuw o 100 mm:
  - Środek ciężkości jest głównie w powerbanku, ok. 63 mm za tylną płaszczyzną czoła. Szufladka zaczyna się przechylać do przodu przy wysuwie ok. 55–65 mm.
  - Przy 100 mm zostaje 1,8 mm dna na listwach. Przód opiera się na stole, tył unosi się o mniej niż 1 mm i nie dotyka płyty.
  - Powyżej 101,8 mm tył spada 8 mm na stół. Brief dopuszcza ten stan.
- Kolizje w złożeniu:
  - szufladka z listwami: tylko styk nośny;
  - listwy z kasetą: osobno w y (listwy kończą się na 101,8, kaseta zaczyna na 103,8);
  - pozostałe pary (szufladka ze ściankami, płytą i kasetą; listwy ze ściankami): wynik projektanta „pusta”, z tych samych zmiennych, a moje wymiary się z nim zgadzają.

**2. Wkręty 3 × 25**
- Otwór Ø3,5 w sklejce, 4 mm od dolnej krawędzi. Pod otworem zostaje 2,25 mm sklejki.
- Pogłębienie w modelu to stożek 62°, Ø5,3 na powierzchni, głęboki 1,5 mm.
- Otwór pilotowy Ø2,5 w listwie: x 18–24,9, czyli 6,9 mm, z dnem 0,6 mm.
- Wkręt z łbem równo z powierzchnią kończy się na x 25,0. Jest 0,1 mm za otworem pilotowym, a w dnie listwy zostaje 0,5 mm. Sprawdziłem w OpenSCAD: nie wychodzi z listwy.
- Gwint pracuje na 7 mm w PLA.
- Ścianka wokół otworu w listwie 8 mm: (8 − 2,5) / 2 = 2,75 mm, po nagwintowaniu Ø3 zostaje 2,5 mm.
- Otwory są 15 mm od końców listwy. Listwa jest symetryczna wzdłuż i w wysokości, więc obie sztuki są identyczne i nie mają strony.

**3. Druk listew**
- Wymiar na stole 101,8 × 26 × 7,5 (dwie sztuki), mieści się w 180 mm.
- Listwa leży na stole stroną przy ściance. Otwory pilotowe są pionowe, otwarte od stołu i zamknięte mostkiem Ø2,5. Bez podpór.
- Siatki: 0 błędów (otwarte, nierozmaitościowe, zdegenerowane), 2 bryły w pliku, zgodnie z zamiarem.
- `podstawka-wymiary.js`: WYMIARY OK dla wszystkich części.

**4. Wysokości**
- Wnętrze: 8 + 2 + 32 + 6 = 48. Podstawka ma 66.
- Kaseta ma 25. PCA9685 stoi na słupkach, płytka na 7,4–9. Nad listwami kołkowymi z wtykami Dupont zostaje ok. 17 mm do płyty.
- Oś PIR jest 22 mm nad stołem, otwór kopułki zaczyna się 10 mm nad stołem.
- Osłonka PIR to w siatce pełna rurka 30 × 30 × 20. Płaszczyzna cięcia leży 22 mm pod osią, a promień rurki to 15, więc nic nie jest ścięte. Dół osłonki jest 7 mm nad stołem, więc nie sięga pod stół. Druk na stojąco jest bez problemu.

**5. Rysunek cięcia**
- Płyta 254,8 × 222,8 z otworem Ø64.
- Ścianka boczna 222,8 × 48 × 2: 3 otwory Ø3,5 na 4 od dołu, 15 / 50,9 / 86,8 od przodu, pogłębione od zewnątrz.
- Ścianka tylna 218,8 × 48.
- Wszystko zgodne z `lnY`, `lnH/2`, `dWkretSkl`, `H_IN`, `SZ − 2·tPl`.

## PSUJE DZIAŁANIE ALBO DRUK

Brak.

## BRZEGOWE

- **Kaseta przy listwach.** Kaseta (x 65,8–235,8) zachodzi w x o 6,5 mm na prawą listwę (wewnętrzna ściana na x 229,3). Po zamontowaniu listew nie da się jej wysunąć na wprost: w OpenSCAD wysunięta o 10 mm koliduje, a przesunięta 7 mm w lewo już nie. Montaż jest wykonalny, bo kaseta wchodzi w kroku 2, przed listwami w kroku 4. Zdanie „wyjmuje się tak samo” trzeba poprawić na „przesunąć ok. 7 mm w lewo, potem wysunąć”.
- **Krawędź sklejki przy otworze.** Pod otworem Ø3,5 zostaje 2,25 mm sklejki, a pod pogłębieniem Ø6 tylko ok. 1 mm. Fornir może się wyszczerbić przy wierceniu, więc warto wiercić z podkładką. Funkcji to nie psuje, bo ciężar idzie w stół.
- **Pogłębienie w modelu.** Stożek 62° (Ø5,3) nie pasuje do łba 90° Ø6. Bez znaczenia, jeśli pogłębia się zwykłym pogłębiaczem 90°. Wkręt wkręcony głębiej niż równo z powierzchnią wyjdzie najwyżej 0,5 mm z listwy, w pustą przestrzeń pod dnem szufladki.
- **Powrót szufladki ze stołu.** Po pełnym wysunięciu (powyżej 101,8 mm) tył szufladki trzeba podnieść 8 mm, żeby wróciła na listwy. Fazka ok. 3 × 45° na przednim górnym rogu listwy pomoże. Ta krawędź jest pionowa w druku, więc fazka nie tworzy nawisu.
- **Osłonka PIR.** Opis w tabeli druku („ścięta płasko”, „płaskim bokiem w dół”) jest nieaktualny: to pełna rurka. Przy przechyle szufladki przy wysuwie to ona pierwsza dotyka stołu, bo jej dół jest na 7 mm, a czoło na 8 mm. Obciąża wtedy spoinę CA.
- **Napis na rysunku cięcia.** Tekst o otworach wystaje poza obrys ścianki bocznej. Kosmetyka.

## Nie sprawdzone

Geometrii szufladki nie porównałem z commitem de713fe, bo brief zabrania używania git. Potwierdzam tylko, że wymiary siatek są takie same jak oczekiwane (234,8 × 112,8 × 39; lewa połówka 178,9 × 112,8 × 39). Wysokość czoła się nie zmienia: `czH` = `H_IN` − `szNad` − 1 = 39, bo obie zmienne urosły o 8.

## Werdykt

Listwy (druk i montaż), rysunek cięcia i szufladka z nocnego druku nadają się do użycia bez zmian. Trzeba tylko poprawić zdanie o wyjmowaniu kasety: najpierw ok. 7 mm w lewo.
