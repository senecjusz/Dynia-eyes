# 40 – CAD i druk 3D

Źródłem prawdy są dokumenty w **Onshape** – tu trzymamy eksporty i linki.

| Folder | Zawartość |
|---|---|
| `step/` | Eksporty STEP z Onshape (do wymiany i archiwum) |
| `stl/` | Gotowe STL do druku (tylko aktualna wersja) |
| `3mf/` | Eksport 3MF z Onshape / projekty ze slicera |
| `onshape/` | Skrypty budujące model w Onshape przez REST API |
| `archiwum/` | Stare wersje – **nie drukować** |

Nazwy plików: `<element>-v<wersja>`, np. `oko-male-uchwyt-v2.stl`.

## Dokumenty Onshape

| Element | Link |
|---|---|
| Małe oko, wariant F **v2.1 (do review)** – dokument **SimpleEye**, gałąź **v2**, Part Studio **Oko F v2.1**, Variable Studio **Zmienne v2**, Assembly **Oko F v2.1 - zlozenie** | [Part Studio](https://cad.onshape.com/documents/5bf3e9f6848edf7f1b0019a9/w/8083c4aa68dac2ff3dcc33d3/e/77278efdbb90d7fd3f42dfa8), [Assembly](https://cad.onshape.com/documents/5bf3e9f6848edf7f1b0019a9/w/8083c4aa68dac2ff3dcc33d3/e/03c2a390f18fde7668b5a2ee) |
| Małe oko, wariant F **v2** (bagnet, jarzmo z kołkiem) – wersja dokumentu **„v2 do review”** | [Part Studio](https://cad.onshape.com/documents/5bf3e9f6848edf7f1b0019a9/v/72db7c584de41f36a24f1eff/e/55797b2a8c74e36981a8e30d), [Assembly](https://cad.onshape.com/documents/5bf3e9f6848edf7f1b0019a9/v/72db7c584de41f36a24f1eff/e/d93dceae16d5a9f4a5bd58e9) |
| Małe oko, wariant F **v1.1** (gniazdo, nakrętka, moduł oka) – dokument **SimpleEye**, Part Studio **Oko F v1.1** | [Onshape](https://cad.onshape.com/documents/5bf3e9f6848edf7f1b0019a9/w/3a55ebced85399a96c2abb04/e/e16c6f06fdebaa87e0db8e02) |

Historia w Onshape:
- v1 to wersja dokumentu **„v1”**, a jej pliki są w [`archiwum/v1/`](archiwum/v1/).
- v1.1 to wersja **„v1.1”** (gałąź Main).
- v2 to wersja **„v2 do review”** w gałęzi **v2**. W gałęzi v2 (workspace) zostały już tylko elementy v2.1.
- v2.1 to wersja **„v2.1 do review”** w tej samej gałęzi, a v2.1b (klej 0,5 mm, napęd w Assembly) to wersja **„v2.1b do review”**.

## Oko F v2.1 – do review (gałąź v2)

Bez bagnetu (jedna Obudowa), piłeczka wklejona w jarzmo z miską. Plan, połączenia, zmienne, kinematyka, wyniki kolizji, odstępstwa i lista niepewności są w [`30-projekt/plan-v2-modul-oka.md`](../30-projekt/plan-v2-modul-oka.md).

Skrypty:
- [`onshape/oko-f-v2.1-build.js`](onshape/oko-f-v2.1-build.js) buduje model,
- [`onshape/oko-f-v2-kolizje.js`](onshape/oko-f-v2-kolizje.js) sprawdza ruch na siatkach.

Skrypt v2 ([`onshape/oko-f-v2-build.js`](onshape/oko-f-v2-build.js)) jest zachowany dla wersji „v2 do review”.

Wymiary: otwór w dyni **Ø57**, rant Ø63, nakrętka Ø66, ścianka dyni 15–25 mm, długość modułu 77,5 mm, gałka wystaje ok. 8 mm.

### Do druku (PLA, bez podpór)

STL i 3MF eksportuje użytkownik: 3MF, rozdzielczość Custom, kąt 3°, odchyłka 0,01 mm. Nazwy plików mają sufiks `-v2.1`. Wszystkie części mieszczą się na A1 mini.

| Część | Szt. | Plik | Wymiary [mm] | Ułożenie na stole |
|---|---|---|---|---|
| Obudowa | 1 | `obudowa-v2.1.stl` | 63 × 63 × 78 | Płaskim wierzchem rantu do stołu |
| Nakretka | 1 | `nakretka-v2.1.stl` | Ø66 × 10 | Tyłem (strona z wycięciami na klucz) do stołu |
| Jarzmo z miska | 1 | `jarzmo-z-miska-v2.1.stl` | 28 × 47 × 34 | Płaskim bokiem miski do stołu, od strony bez korby (korba to pionowe żebro). Brim |
| Ciegno | 1 | `ciegno-v2.1.stl` | 25 × 13 × 4,5 | Spodem do stołu, podniesienia do góry |
| Ramie orczyka | 1 | `ramie-orczyka-v2.1.stl` | 35 × 19 × 4 | Wierzchem do stołu (kieszeń orczyka do góry) |
| Tulejka przegubu | 2 | `tulejka-v2.1.stl` | Ø8 × 3,5 | Kołnierzem do stołu |
| Pokrywa tylna | 1 | `pokrywa-v2.1.stl` | 64 × 44 × 8 | Tylną ścianą do stołu |
| Przyrzad do wklejania pileczki | 1 | `przyrzad-wklejania-v2.1.stl` | 62 × 28 × 32 | Dnem (z otworem-celownikiem) do stołu, czasza do góry |
| Przyrzad centrowania orczyka | 1 | `przyrzad-orczyka-v2.1.stl` | 28 × 20 × 12 | Podstawą do stołu |

Części `PODGLAD …` służą tylko do sprawdzania kolizji. **Nie drukować.** Jarzmo z miską najlepiej drukować na czarno: z ukosu widać przy piłeczce brzeg miski.

### Elementy złączne

| Element | Szt. | Gdzie |
|---|---|---|
| M3×5 z **niskim łbem** (ISO 7380) | 2 | Oś oka (dłuższa śruba weszłaby w piłeczkę, łeb DIN 912 się nie mieści) |
| M3×8 DIN 912 | 4 | 2 przeguby (od dołu) i pokrywa tylna |
| M3×10 DIN 912 | 2 | Przyrząd do wklejania (trzyma jarzmo na czas klejenia) |
| Wkładka M3 do wtapiania (otwór Ø4, dł. 4) | 4 | 2 w cięgnie, 2 w występach obudowy |
| M2×6 | 1 | Ramię do orczyka (otwór 13 mm) |
| Wkręty z kompletu SG90 | 3 | 2 uszy serwa i wkręt środkowy orczyka |
| Klej wypełniający, akrylowy dwuskładnikowy | – | Piłeczka w misce (szczelina 0,5 mm) |

### Kolejność składania

1. Wtopić wkładki w cięgno (od góry) i w 2 występy z tyłu obudowy.
2. **Wklejanie piłeczki:**
   - piłeczkę włożyć źrenicą w dół do czaszy przyrządu, tak żeby źrenica była widoczna w otworze-celowniku Ø3,
   - na pas miski nałożyć klej, **z dala od otworów osi** (końcówki śrub osi wchodzą 0,15 mm w szczelinę),
   - jarzmo nałożyć oczkami między słupki i przykręcić 2 × M3×10,
   - po związaniu kleju odkręcić.
3. **Przegub C:** tulejkę z kołnierzem włożyć od dołu w otwór korby, nałożyć cięgno i wkręcić M3×8 do oporu we wkładkę.
4. Jarzmo z piłeczką i cięgnem wsunąć **od tyłu** obudowy, piłeczką do otworu w rancie (GÓRA do góry). Kołki ogranicznika wchodzą kanałami w występach osi. Wkręcić 2 × M3×5 od góry i od dołu.
5. SG90 wsunąć **od tyłu**, przednim uchem na słupek. Ucho przykręcić wkrętem z kompletu przez otwór w górze obudowy.
6. Serwo ustawić na środek (strona ESP32). Od dołu założyć przyrząd centrowania: trzpień przez otwór dolny wchodzi w otwór ramienia. Orczyk z ramieniem nasadzić na wałek, przykręcić M2 i wkręt środkowy przez otwory w górze, zdjąć przyrząd.
7. **Przegub H:** przez otwór dolny włożyć tulejkę w ramię, nasunąć cięgno, wkręcić M3×8 do oporu.
8. Pokrywę tylną przykręcić 2 × M3×8, przykręcić tylne ucho, kabel przepleść między kołkami pokrywy.
9. **W dyni (rodzic):**
   - obudowę włożyć od zewnątrz w otwór Ø57, strzałką GÓRA do góry,
   - od środka nakręcić nakrętkę, aż ząbki rantu wejdą w skórkę,
   - syn wpina wtyczkę serwa.

### Assembly

- Grupy: moduł nieruchomy (obudowa, nakrętka, SG90, pokrywa), jarzmo z piłeczką, ramię z orczykiem, cięgno z tulejkami.
- Mate'y:
  - oś oka: Revolute z limitem ±33°,
  - wałek serwa: Revolute z limitem −37…+30° (wyklucza drugie położenie czworoboku, w którym ramię stoi pod 68°),
  - przegub C: Revolute,
  - przegub H: Ball.
- Obudowa jest unieruchomiona (Fix).
- **Ruch:** przeciągnij piłeczkę myszką, a jarzmo, cięgno, ramię i orczyk ruszą razem z nią. Możesz też kliknąć prawym przyciskiem mate „Os oka 2 x M3 (ogranicznik +-33)”, wybrać **Animate** i nacisnąć ▶ (zakres −33…33° podstawia się z limitów).

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
