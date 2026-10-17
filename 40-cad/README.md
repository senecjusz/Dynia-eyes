# 40 – CAD i druk 3D

Źródłem prawdy są dokumenty w **Onshape** – tu trzymamy eksporty i linki.

| Folder | Zawartość |
|---|---|
| `step/` | Eksporty STEP z Onshape (do wymiany i archiwum) |
| `stl/` | Gotowe STL do druku |
| `3mf/` | Projekty ze slicera (ustawienia druku, rozmieszczenie na stole) |

Nazwy plików: `<element>-v<wersja>`, np. `oko-male-uchwyt-v2.stl`.

## Dokumenty Onshape

| Element | Link |
|---|---|
| Małe oko, wariant F v1 (gniazdo, nakrętka, moduł oka) – dokument **SimpleEye**, Part Studio **Oko F v1** | [Onshape](https://cad.onshape.com/documents/5bf3e9f6848edf7f1b0019a9/w/3a55ebced85399a96c2abb04/e/e16c6f06fdebaa87e0db8e02) |

Uwaga: konto Onshape jest na planie Free, więc dokumenty są **publiczne**.

## Oko F v1 – jak zbudowany jest model

- Wszystkie części leżą w jednym Part Studio w **pozycji złożonej**: oś oka = Z, płaszczyzna Top = powierzchnia dyni, +Z na zewnątrz, **+Y = GÓRA**.
- Na górze drzewa są **zmienne** (`#luzBagnet`, `#luzGwint`, `#luzKula`, `#luzJarzmo`, `#luzCzop`, `#kulaD`, `#rantD`, `#kolnierzykD`, `#dociskMin/Max` …) oraz wyliczane z nich średnice (`#modulOD`, `#gniazdoID`, `#gniazdoOD`, `#gwintD`, `#nakretkaOtwor`). Średnice okręgów w szkicach i głębokości wyciągnięć są do nich podpięte.
- Drobne szkice (zaczepy i rowki bagnetu, profil gwintu, słupki serwa, korba, cięgno) mają wymiary liczbowe. Po zmianie luzu bagnetu albo grubości ścianek trzeba je przejrzeć.
- Model został zbudowany skryptem [`onshape/oko-f-v1-build.js`](onshape/oko-f-v1-build.js), który dodaje zwykłe operacje (Variable, Plane, Sketch, Extrude, Revolve, Helix, Sweep, Circular pattern) przez REST API. Skrypt opisuje też wszystkie użyte liczby.
- Części z prefiksem `PODGLAD` (piłeczka, SG90, orczyk) służą tylko do sprawdzania kolizji. **Nie drukować.**

### Części do druku (`stl/`)

| Plik | Szt. | Uwagi do druku |
|---|---|---|
| `gniazdo-v1.stl` | 1 | Rantem do stołu. Kolor dyni. Gwint prawy, skok 3 mm |
| `nakretka-v1.stl` | 1 | Płasko. Skrzydełka + 6 wycięć pod przyszły klucz |
| `modul-tuleja-v1.stl` | 1 | Czołem (z = −0,3) do stołu. Okno serwa = GÓRA modułu |
| `modul-jarzmo-v1.stl` | 1 | Bokiem (płaska ścianka 6 mm) do stołu |
| `modul-czop-v1.stl` | 2 | Łebkiem do stołu. Wcisk Ø3 w otwór Ø2,9 tulei |
| `modul-ciegno-v1.stl` | 1 | Płasko. Otwór Ø2,2 na wkręt z kompletu SG90 (do orczyka) |

Sprawdzone w Onshape: brak kolizji gniazdo–nakrętka–tuleja w pozycji zamkniętej bagnetu; jarzmo z piłeczką obraca się o **±40°** bez kolizji (przy 60° już uderza w tuleję).
