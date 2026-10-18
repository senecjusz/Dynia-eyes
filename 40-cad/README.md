# 40 – CAD i druk 3D

Źródłem prawdy są dokumenty w **Onshape** – tu trzymamy eksporty i linki.

| Folder | Zawartość |
|---|---|
| `step/` | Eksporty STEP z Onshape (do wymiany i archiwum) |
| `stl/` | Gotowe STL do druku (tylko aktualna wersja) |
| `3mf/` | Eksport 3MF z Onshape / projekty ze slicera |
| `onshape/` | Skrypt budujący model w Onshape przez REST API |
| `archiwum/` | Stare wersje – **nie drukować** |

Nazwy plików: `<element>-v<wersja>`, np. `oko-male-uchwyt-v2.stl`.

## Dokumenty Onshape

| Element | Link |
|---|---|
| Małe oko, wariant F **v2 (do review)** – dokument **SimpleEye**, gałąź **v2**, Part Studio **Oko F v2**, Variable Studio **Zmienne v2**, Assembly **Oko F v2 - zlozenie** | [Part Studio](https://cad.onshape.com/documents/5bf3e9f6848edf7f1b0019a9/w/8083c4aa68dac2ff3dcc33d3/e/55797b2a8c74e36981a8e30d), [Assembly](https://cad.onshape.com/documents/5bf3e9f6848edf7f1b0019a9/w/8083c4aa68dac2ff3dcc33d3/e/d93dceae16d5a9f4a5bd58e9) |
| Małe oko, wariant F **v1.1** (gniazdo, nakrętka, moduł oka) – dokument **SimpleEye**, Part Studio **Oko F v1.1** | [Onshape](https://cad.onshape.com/documents/5bf3e9f6848edf7f1b0019a9/w/3a55ebced85399a96c2abb04/e/e16c6f06fdebaa87e0db8e02) |

Poprzedni stan (v1) jest zapisany w Onshape jako wersja dokumentu **„v1”**, a jego pliki są w [`archiwum/v1/`](archiwum/v1/). Stan v1.1 to wersja **„v1.1”** (gałąź Main), a v2 to gałąź **v2** z wersją **„v2 do review”**.

## Oko F v2 – do review (gałąź v2)

Plan, połączenia, zmienne, kinematyka, wyniki kolizji i lista niepewności są w [`30-projekt/plan-v2-modul-oka.md`](../30-projekt/plan-v2-modul-oka.md). Model budują skrypty [`onshape/oko-f-v2-build.js`](onshape/oko-f-v2-build.js) i [`onshape/oko-f-v2-kolizje.js`](onshape/oko-f-v2-kolizje.js) (sprawdzenie ruchu na siatkach).

### Do druku (PLA, bez podpór)

STL i 3MF eksportuje użytkownik: 3MF, rozdzielczość Custom, kąt 3°, odchyłka 0,01 mm. Nazwy plików mają sufiks `-v2`.

| Część | Szt. | Plik | Ułożenie na stole |
|---|---|---|---|
| Gniazdo | 1 | `gniazdo-v2.stl` | Płaskim wierzchem rantu do stołu |
| Nakretka | 1 | `nakretka-v2.stl` | Tyłem (strona z wycięciami na klucz) do stołu |
| Tuleja modulu | 1 | `modul-tuleja-v2.stl` | Czołem do stołu |
| Jarzmo | 1 | `modul-jarzmo-v2.stl` | Płaską ścianą pierścienia do stołu, od strony bez korby (korba to pionowe żebro). Brim |
| Ciegno | 1 | `modul-ciegno-v2.stl` | Spodem do stołu, podniesienia do góry |
| Ramie orczyka | 1 | `modul-ramie-orczyka-v2.stl` | Wierzchem do stołu (kieszeń orczyka do góry) |
| Tulejka przegubu | 2 | `modul-tulejka-v2.stl` | Kołnierzem do stołu |
| Pokrywa tylna | 1 | `modul-pokrywa-v2.stl` | Tylną ścianą do stołu |
| Przyrzad wiercenia A, B | 1+1 | `przyrzad-wiercenia-a-v2.stl`, `-b-v2.stl` | Zewnętrzną ścianą do stołu |
| Przyrzad centrowania orczyka | 1 | `przyrzad-orczyka-v2.stl` | Podstawą do stołu |

Części `PODGLAD …` służą tylko do sprawdzania kolizji. **Nie drukować.**

### Elementy złączne

| Element | Szt. | Gdzie |
|---|---|---|
| M3×8 z **niskim łbem** (ISO 7380 albo DIN 7984) | 2 | Oś oka (DIN 912 się nie mieści) |
| M3×8 DIN 912 | 4 | 2 przeguby (od dołu) i pokrywa tylna |
| Wkładka M3 do wtapiania (otwór Ø4, dł. 4) | 4 | 2 w cięgnie, 2 w uszach tulei |
| M3×35–40 | 2 | Przyrząd wiercenia |
| M2×6 | 1 | Ramię do orczyka (otwór 13 mm) |
| Wkręty z kompletu SG90 | 3 | 2 uszy serwa i wkręt środkowy orczyka |

Piłeczka: 2 otwory Ø3,3 (bieguny) i otwór Ø4,2 z boku. Wiercić w przyrządzie, a przez otwór na górze przyrządu zaznaczyć markerem miejsce źrenicy.

### Kolejność składania

1. Wtopić wkładki w cięgno (od góry) i w uszy tulei.
2. Jarzmo z piłeczką (kołek w otworze Ø4,2) wsunąć **od przodu** tulei. Kołki ogranicznika idą kanałami w występach osi. Wkręcić 2 śruby osi.
3. SG90 wsunąć **od tyłu**, przednim uchem na słupek. Przykręcić ucho wkrętem z kompletu przez otwór w górze tulei.
4. Pokrywę tylną przykręcić 2 × M3, przykręcić tylne ucho, kabel przepleść między kołkami pokrywy.
5. Serwo ustawić na środek (strona ESP32) i założyć przyrząd centrowania od dołu: trzpienie wchodzą w otwory korby i ramienia. Orczyk z ramieniem nasadzić na wałek, przykręcić M2 i wkręt środkowy, zdjąć przyrząd.
6. Cięgno włożyć między korbę a ramię. Tulejki z kołnierzem od dołu przez otwory w spodzie tulei, potem śruby M3×8 do oporu.

### Assembly

- Grupy: moduł nieruchomy, jarzmo z piłeczką, ramię z orczykiem, cięgno z tulejkami.
- Mate'y:
  - oś oka: Revolute z limitem ±33°,
  - wałek serwa: Revolute,
  - przegub C: Cylindrical,
  - przegub H: Ball.
- Tuleja jest unieruchomiona (Fix). Oko można obracać, przeciągając piłeczkę.
Uwaga: konto Onshape jest na planie Free, więc dokumenty są **publiczne**.

## Oko F v1.1 – co się zmieniło względem v1 (po review)

- **Piłeczka 39,5–40,5 mm:** zmienne `#kulaDmax` = 40,5 (od niej liczone luzy: piłeczka–jarzmo 0,75, jarzmo–tuleja 0,75, kołnierzyk) i `#kulaDmin` = 39,5. Czopy i tylny kolec sięgają do r = 17 mm od środka, czyli 2,75 mm w piłeczkę 39,5 i 3,25 mm w 40,5.
- **Napęd bez martwego punktu (oko ±30°):** korba 22 mm na jarzmie (pod 20° od osi), **cięgno 16 mm** (między osiami, wygięte do tyłu, żeby ominąć łuk jarzma) i **drukowane ramię orczyka 22 mm**. Przy oku na wprost korba i ramię są prostopadłe do cięgna, przełożenie ~1:1 (orczyk ±27…35°), kąt przenoszenia ≥ 30° w całym zakresie. Ramię przykręca się do fabrycznego orczyka SG90 przez szczelinę 6–16 mm od osi (pasuje otwór 13 mm w orczyku jednoramiennym) i wkręt środkowy. Wał serwa leży na osi tulei, 51,8 mm za powierzchnią dyni, dlatego tuleja ma teraz 76 mm.
- **Mniejszy rant:** Ø68 × 1,5 mm (2 mm zakładki na otworze Ø64; tylko blokuje wpadnięcie do środka). Ząbki i strzałka GÓRA przesunięte do środka.
- **Eksport z dokładną siatką:** tolerancja 0,01 mm i 3° (w v1 otwory były wielokątami co 22,5°, co zjadało luzy).

## Jak zbudowany jest model

- Wszystkie części leżą w jednym Part Studio w **pozycji złożonej**: oś oka = Z, płaszczyzna Top = powierzchnia dyni, +Z na zewnątrz, **+Y = GÓRA**.
- Drzewo jest podzielone na foldery w kolejności budowy: **Zmienne (32) → Wspolne (oś Z) → Gniazdo (24) → Nakretka (10) → Modul tuleja (38) → Mechanizm (43: jarzmo, korba, czopy, cięgno, ramię orczyka) → Podglad (12)**. Operacje mają nazwy `Sekcja: element`, np. `Gniazdo: gwint`, `Modul: rowek bagnetu 150`, `Mechanizm: ramie orczyka`.
- Zmienne (`#luzBagnet`, `#luzGwint`, `#luzKula`, `#luzJarzmo`, `#luzCzop`, `#kulaDmax/min`, `#rantD`, `#kolnierzykD`, `#dociskMin/Max` …) i wyliczane z nich średnice (`#modulOD`, `#gniazdoID`, `#gniazdoOD`, `#gwintD`, `#nakretkaOtwor`) sterują średnicami okręgów w szkicach i głębokościami. Drobne szkice (zaczepy, rowki bagnetu, profil gwintu, słupki serwa, korba, cięgno, ramię) mają wymiary liczbowe z tablicy `D` w skrypcie.
- Skrypt [`onshape/oko-f-v1.1-build.js`](onshape/oko-f-v1.1-build.js) buduje drzewo zwykłymi operacjami (Variable, Plane, Sketch, Extrude, Revolve, Helix, Sweep, Circular pattern) przez REST API. Folderów i ukrywania płaszczyzn REST API nie obsługuje – zrobione ręcznie.
- Części `PODGLAD …` (piłeczka 40,5, SG90, orczyk) służą tylko do sprawdzania kolizji. **Nie drukować.**

## Części do druku v1.1 (`stl/`, PLA)

Pliki są w pozycji złożonej – w slicerze trzeba je obrócić tak, jak w kolumnie „Ułożenie”. Ten sam komplet jest w `3mf/oko-f-v1.1.3mf` (wszystkie części w jednym pliku).

| Plik | Szt. | Ułożenie / uwagi |
|---|---|---|
| `gniazdo-v1.1.stl` | 1 | Rantem do stołu. Kolor dyni. Gwint prawy, skok 3 mm |
| `nakretka-v1.1.stl` | 1 | Płasko. Skrzydełka + 6 wycięć pod przyszły klucz |
| `modul-tuleja-v1.1.stl` | 1 | Czołem do stołu. Okno serwa = GÓRA modułu |
| `modul-jarzmo-v1.1.stl` | 1 | Bokiem (płaska ścianka 6 mm) do stołu |
| `modul-czop-v1.1.stl` | 2 | Łebkiem do stołu. Wcisk Ø3 w otwór Ø2,9 tulei |
| `modul-ciegno-v1.1.stl` | 1 | Płasko. Oba otwory Ø3,4 (luźno na kołkach) |
| `modul-ramie-orczyka-v1.1.stl` | 1 | Płasko. Na fabryczny orczyk: wkręt środkowy + wkręt z kompletu w szczelinę |

## Sprawdzone (v1.1)

Na siatce z eksportu 3MF (tolerancja 0,01 mm / 3°):

| Co | Wynik | Nominalnie |
|---|---|---|
| Luz promieniowy bagnetu (otwór gniazda – tuleja) | **0,59 mm** | 0,60 (v1 po eksporcie: ~0,14) |
| Gwint gniazdo – nakrętka, najmniejszy odstęp 3D | **0,29 mm** | 0,30 (v1: wcisk 0,06–0,15) |
| Garb zatrzasku – zaczep w pozycji zamkniętej | 0,14 mm | celowo mały odstęp, przy obrocie zaczep przechodzi przez garb 0,2 mm |

Ruch oka od −30° do +30° co 5° (jarzmo, cięgno i ramię ustawione kinematycznie, test przenikania siatek): **brak kolizji**. Najmniejszy zapas: cięgno przy −30° – 0,45 mm do wnętrza tulei. Kontrola testu: przy 60° jarzmo uderza w tuleję (wykryte).
