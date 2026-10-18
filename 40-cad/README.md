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
| Małe oko, wariant F **v2.2 (do review)**: gniazdo + kaseta. Dokument **SimpleEye**, gałąź **v2**, Part Studio **Oko F v2.2**, Variable Studio **Zmienne v2.2**, Assembly **Oko F v2.2 - zlozenie** | [Part Studio](https://cad.onshape.com/documents/5bf3e9f6848edf7f1b0019a9/w/8083c4aa68dac2ff3dcc33d3/e/573498b5468d2d054026f0fc), [Assembly](https://cad.onshape.com/documents/5bf3e9f6848edf7f1b0019a9/w/8083c4aa68dac2ff3dcc33d3/e/263f94e3f0b837fcb7f90f3c) |
| Małe oko, wariant F **v2.1d** (jedna obudowa, otwór 56) – Part Studio **Oko F v2.1** w tej samej gałęzi, wersja **„v2.1d do review”** | [Part Studio](https://cad.onshape.com/documents/5bf3e9f6848edf7f1b0019a9/w/8083c4aa68dac2ff3dcc33d3/e/77278efdbb90d7fd3f42dfa8) |
| Małe oko, wariant F **v2** (bagnet, jarzmo z kołkiem) – wersja dokumentu **„v2 do review”** | [Part Studio](https://cad.onshape.com/documents/5bf3e9f6848edf7f1b0019a9/v/72db7c584de41f36a24f1eff/e/55797b2a8c74e36981a8e30d), [Assembly](https://cad.onshape.com/documents/5bf3e9f6848edf7f1b0019a9/v/72db7c584de41f36a24f1eff/e/d93dceae16d5a9f4a5bd58e9) |
| Małe oko, wariant F **v1.1** (gniazdo, nakrętka, moduł oka) – dokument **SimpleEye**, Part Studio **Oko F v1.1** | [Onshape](https://cad.onshape.com/documents/5bf3e9f6848edf7f1b0019a9/w/3a55ebced85399a96c2abb04/e/e16c6f06fdebaa87e0db8e02) |

Historia w Onshape:
- **v1:** wersja dokumentu **„v1”**, pliki w [`archiwum/v1/`](archiwum/v1/).
- **v1.1:** wersja **„v1.1”** (gałąź Main).
- **v2:** wersja **„v2 do review”** w gałęzi **v2**.
- **v2.1:** wersje **„v2.1 do review”**, **„v2.1b do review”**, **„v2.1b animacja”**, **„v2.1c do review”** i **„v2.1d do review”** w tej samej gałęzi.
- **v2.2:** wersja **„v2.2 do review”**. v2.2 ma własne Variable Studio, więc zmiany v2.2 nie ruszają v2.1.

## Oko F v2.2 – do review (gałąź v2)

**Gniazdo** wkręca się raz w dynię:
- od zewnątrz w otwór **Ø63,5** (otwornica 2½", opisywana „64”),
- nakrętka od środka.

**Kaseta** to kompletny moduł oka złożony na stole. W dyni wsuwa się ją od środka do gniazda, aż kliknie: w dyni nic się nie skręca.

Plan, wymiary, połączenia, kinematyka (z zakresem serwa dla firmware), wyniki symulacji ruchu i wsuwania, rozmieszczenie oczu i niepewności są w [`30-projekt/plan-v2-modul-oka.md`](../30-projekt/plan-v2-modul-oka.md).

Skrypty:
- [`onshape/oko-f-v2.2-build.js`](onshape/oko-f-v2.2-build.js) buduje model,
- [`onshape/oko-f-v2-kolizje.js`](onshape/oko-f-v2-kolizje.js) + [`onshape/oko-f-v2.2-kolizje.js`](onshape/oko-f-v2.2-kolizje.js) sprawdzają ruch, wsuwanie, nawisy i ścianki.

Skrypty v2.1 i v2 zostają dla starszych wersji.

**Wymiary:**
- otwór w dyni Ø63,5, rant gniazda Ø74, nakrętka Ø74 × 7 (otwór Ø59,5),
- gwint Ø62,9, skok 5,
- kaseta Ø54,5 × 76, gałka wystaje ok. 8 mm,
- ścianka dyni 15–25 mm,
- rozstaw oczu: poziomo ≥ 115 mm, pionowo ≥ 145 mm.

### Do druku (PLA, bez podpór)

Eksport robi użytkownik: prawy przycisk na części → Export…
- **3MF**, rozdzielczość **Custom**,
- Distance tolerance `0.00001` (0,01 mm), Angular tolerance `3`.

Onshape nazywa pliki **`Oko F v2.2 - <nazwa części>.3mf`**: tych nazw używamy (`40-cad/3mf/`). Wszystkie części mieszczą się na A1 mini.

| Część | Szt. | Wymiary [mm] | Ułożenie na stole |
|---|---|---|---|
| Probka gwintu - gniazdo, Probka gwintu - nakretka | 1+1 | Ø63 × 15, Ø74 × 7 | **Drukować najpierw**, tymi samymi ustawieniami co gniazdo i nakrętkę: pierścień czołem, nakrętka płasko. Jeśli nakrętka idzie za ciężko albo lata, zmienić `luzGwint` (teraz 0,3) |
| Gniazdo | 1 | Ø74 × 44 | Wierzchem rantu (ze strzałką GÓRA) do stołu |
| Nakretka | 1 | Ø74 × 7 | Tyłem (strona z wycięciami na klucz) do stołu |
| Kaseta | 1 | 57 × 55 × 76 | Czołem do stołu (rura pionowo). Ramiona zaczepów mają pod spodem skośną szczelinę 45° – bez podpór |
| Jarzmo z miska | 1 | 28 × 50 × 35 | Płaskim bokiem miski **bez korby** do stołu (korba pionowo w górę). Brim zalecany |
| Ciegno | 1 | 25 × 13 × 5,6 | Spodem do stołu, podniesienia do góry |
| Ramie orczyka | 1 | 36 × 20 × 4 | Wierzchem do stołu (kieszeń orczyka do góry) |
| Tulejka przegubu korby / ramienia | 1+1 | Ø8 × 3,5 | Kołnierzem do stołu |
| Sanki serwa | 1 | 33 × 19 × 4,6 | Prowadnicami do stołu |
| Pokrywa tylna | 1 | 59 × 65 × 6,5 | Zewnętrzną ścianą do stołu (prowadnice kabla do góry) |
| Przyrzad do wklejania pileczki | 1 | 62 × 28 × 34 | Dnem (z okienkiem na źrenicę) do stołu, stożek do góry |
| Przyrzad centrowania orczyka | 1 | 22 × 29 × 14 | Płytką do stołu |

Części `PODGLAD …` służą tylko do sprawdzania kolizji. **Nie drukować.**

### Elementy złączne

| Element | Szt. | Gdzie |
|---|---|---|
| **ISO 7380 M3 (grzybkowa) skrócona do 4 mm** – z M3×8 z kompletu, uciąć i zeszlifować | 2 | Oś oka (dłuższa weszłaby w piłeczkę, DIN 912 się nie mieści) |
| M3×8 DIN 912 | 4 | Przeguby C i H (od spodu), pokrywa (2) |
| M3×10 DIN 912 | 2 | Przyrząd do wklejania (na czas klejenia) |
| Wkładka M3 do wtapiania Ø4 × 4 | 4 | 2 w cięgnie, 2 w uchach kasety |
| M2×6 | 1 | Ramię do orczyka (otwór 13 mm) |
| Wkręty z kompletu SG90 | 3 | 2 uszy serwa na sankach, wkręt środkowy orczyka |
| Klej wypełniający, akrylowy dwuskładnikowy | – | Piłeczka w misce (szczelina 0,5 mm), z dala od otworów osi |

### Kolejność składania

1. Najpierw wydrukować i sprawdzić **Próbkę gwintu**.
2. W dyni (raz):
   - wyciąć otwór otwornicą 2½",
   - gniazdo włożyć od zewnątrz, strzałką GÓRA do góry,
   - od środka nakręcić nakrętkę, aż ząbki rantu wejdą w skórkę.
3. Kaseta na stole (szczegóły w planie):
   1. Wtopić wkładki: cięgno od góry, ucha kasety.
   2. Wkleić piłeczkę w przyrządzie:
      - źrenica w dół w stożku,
      - jarzmo na słupki, kołki ogranicznika w gniazdach,
      - 2 × M3×10, klej, odczekać.
   3. Jarzmo z piłeczką wsunąć **od tyłu** kasety (kołki w kanałach), wkręcić 2 śruby osi.
   4. SG90 przykręcić do sanek, sanki wsunąć **od tyłu** (serwo spodem przez szczelinę).
   5. Serwo na środek (strona ESP32). Przyrząd centrowania od spodu (trzpień przez otwór dolny H).
   6. Ramię z orczykiem przez tył nad wałek, nasadzić. Wkręt środkowy i M2 przez otwory górne, zdjąć przyrząd.
   7. Cięgno wsunąć **od tyłu** nad korbę i ramię.
   8. Przeguby C i H: tulejki od spodu przez oba otwory dolne, M3×8 do oporu we wkładki.
   9. Wtyczkę przez okno pokrywy, pokrywę 2 × M3×8, taśmę wcisnąć w przewężenie (pociągnąć na próbę).
4. Kasetę wsunąć do gniazda od środka dyni, GÓRA do góry, aż oba zaczepy kliką. Syn wpina wtyczkę.

Wyjęcie: ścisnąć oba haczyki w okienkach gniazda i wyciągnąć kasetę.

### Assembly

- Grupy:
  - nieruchome: gniazdo, nakrętka, kaseta, sanki, SG90, pokrywa,
  - jarzmo z piłeczką,
  - ramię z orczykiem,
  - cięgno z tulejkami.
- Mate'y:
  - oś oka: Revolute z limitem ±33°,
  - wałek serwa: Revolute z limitem −37…+30° (wyklucza drugie położenie czworoboku),
  - przegub C: Revolute,
  - przegub H: Ball.
- Gniazdo jest unieruchomione (Fix).
- **Ruch:** przeciągnij piłeczkę albo kliknij prawym przyciskiem mate „Os oka 2 x M3 (ogranicznik +-33)” → **Animate** → ▶ (66 kroków). Żeby widzieć napęd: Hide na „Gniazdo”, „Nakretka”, „Kaseta” i „Pokrywa tylna”, widok Back (Shift+2).

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
