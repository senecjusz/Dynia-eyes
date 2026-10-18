# Moduł małego oka v2: plan i stan po budowie (do review)

Na podstawie [briefu v2](brief-v2-modul-oka.md). Użytkownik w nocy 18.10 zlecił, żebym zrobił v2 sam, bez pytania o szczegóły. Pomiary nie były dostępne, więc wartości są założone jako zmienne (lista na końcu).

**Onshape:** dokument SimpleEye, gałąź **v2** (od wersji **v1.1**). Wersja **„v2 do review”**.
- Part Studio **Oko F v2**: wszystkie części w pozycji złożonej.
- Variable Studio **Zmienne v2**: 51 zmiennych.
- Assembly **Oko F v2 - zlozenie**: ruch ±33°.

v1 i v1.1 zostały nietknięte w historii i w gałęzi Main.

## Układ

- Oś oka jest pionowa (Y), +Z na zewnątrz dyni, a z = 0 to wierzch rantu.
- Środek piłeczki leży 12 mm pod rantem, więc gałka wystaje ok. 8 mm (było 13).
- Napęd leży w warstwie na wysokości środka piłeczki (y od −3 do +4), bo tam tuleja jest najszersza.
- SG90 leży wzdłuż osi, wałkiem do tyłu. Korpus wystaje 7 mm pod tuleję, ale dopiero za gniazdem (z < −46), więc nie przeszkadza w bagnecie.
- Moduł ma 72,6 mm długości (v1.1: 76) i jest fazowany z tyłu.

## Części (każda jako osobny Part)

| Part | Szt. | Do czego |
|---|---|---|
| Gniazdo | 1 | Rant (płaski wierzch, stożek pod spodem pod krzywiznę dyni R 150), ząbki, gwint 45° z fazą początku, 3 zaczepy bagnetu z fazkami |
| Nakretka | 1 | Ø72, bez skrzydełek. Czoło stożkowe pod wewnętrzną ściankę dyni, radełko, 6 wycięć na klucz. Gwint = zwój gniazda odsunięty o `#luzGwint` |
| Tuleja modulu | 1 | Bagnet z 3 sprężystymi językami (garb 0,6). Występy osi z pogłębieniem na łby i rowkiem ogranicznika. Słupek przedniego ucha SG90, szczelina na serwo, otwory montażowe, uszy z wkładkami na pokrywę, znaczniki na chwycie |
| Jarzmo | 1 | Pierścień w płaszczyźnie odchylonej o 60° w bok, oczka na osi z kołkami ogranicznika, korba zrośnięta z pierścieniem, siodło i kołek Ø4 w piłeczkę |
| Ciegno | 1 | Jeden zamknięty kontur, otwory Ø3,3, wkładki M3 od góry w podniesieniach |
| Ramie orczyka | 1 | Kieszeń w kształcie orczyka od spodu, otwór M2 13 mm od osi, otwór na tulejkę w H |
| Tulejka przegubu korby / ramienia | 2 | Ø5,6 × 2,7 z kołnierzem Ø8 × 0,8, otwór Ø3,3 |
| Pokrywa tylna | 1 | Zamyka tył tulei, słupek tylnego ucha SG90, 3 kołki do przeplecenia kabla (odciążenie) |
| Przyrzad wiercenia A, B | 1+1 | Dwie połówki skręcane 2 × M3. Prowadnice: bieguny Ø3,3, kołek Ø4,2, znacznik źrenicy Ø3 |
| Przyrzad centrowania orczyka | 1 | Płytka pod tuleją z 2 trzpieniami Ø5,8 przez otwory dolne do korby (C) i ramienia (H) |
| PODGLAD pileczka 40.5 / SG90 / orczyk SG90 | – | Tylko do sprawdzania kolizji |

## Foldery w drzewie operacji

Wspolne (osie) · Gniazdo · Gniazdo - zaczepy i znaczniki · Nakretka · Nakretka - gwint wewnetrzny · Nakretka - klucz i radelkowanie · Tuleja - korpus, chwyt i bagnet · Tuleja - jezyki z garbem (klik bagnetu) · Tuleja - os oka M3 i ograniczniki · Tuleja - slupek i szczelina SG90 · Tuleja - otwory montazowe · Tuleja - pokrywa i znaczniki · Jarzmo - pierscien i oczka osi · Jarzmo - korba, siodlo i kolec · Ciegno · Ramie orczyka · Tulejki przegubow · Pokrywa tylna · PODGLAD - nie drukowac · Przyrzad wiercenia pileczki · Przyrzad centrowania orczyka.

Każda operacja ma nazwę `Część: co robi`, np. `Modul: rowek ogranicznika gora`, `Jarzmo: kolek ogranicznika dol`.

## Zmienne (Variable Studio „Zmienne v2”)

Każda z nich naprawdę steruje geometrią (średnice w szkicach, głębokości, odsunięcia płaszczyzn, odsunięcie ścian gwintu):

| Grupa | Zmienne |
|---|---|
| Piłeczka | `kulaDmax` 40,5 (luzy, podgląd), `kulaDmin` 39,5 (zagłębienie kołka), `kolecD` 4, `kolecGleb` 2,25 |
| Luzy | `luzKula` 0,75, `luzOs` 0,4, `luzOsiowy` 0,3, `luzJarzmo` 0,75, `luzBagnet` 0,6, `luzGwint` 0,3, `luzPrzegub` 0,2 |
| Ścianki | `jarzmoT` 2,5, `jarzmoW` 6, `oczkoT` 2, `sciankaM` 2,4, `sciankaG` 2,4, `plytaT` 2,5 |
| Śruby i wkładki | `m3Ciasny` 2,6, `m3Luzny` 3,3, `lebD` 6,2, `lebH` 1,9, `wkladkaD` 4, `wkladkaL` 4, `tulejkaD` 5,6, `kolnierzD` 8, `kolnierzH` 0,8, `m2Otwor` 2,2, `serwoWkret` 1,8 |
| SG90 (pomiar) | `servoH` 30,5 (spód → wierzch orczyka), `servoUcho` 15,9, `servoSpodY` −33,5 |
| Gniazdo i nakrętka | `rantD` 68, `rantT` 1,5, `kolnierzykD` 43, `przodD` 62, `przodL` 12, `dociskMin` 15, `dociskMax` 30, `nakretkaH` 7, `nakretkaD` 72, `nakretkaZ` 25, `gwintSkok` 3, `modulL` 72,6 |
| Wyliczane | `hornTop`, `modulID`, `modulOD`, `gniazdoID`, `gniazdoOD`, `gwintD`, `gniazdoL`, `nakretkaOtwor` |

Liczbami w skrypcie (tablica `D`) zostały:
- położenia przegubów (kinematyka),
- położenia zaczepów, języków i słupków,
- profil gwintu (wysokość 1,2 przy skoku 3),
- krzywizna dyni R 150.

Ich zmiana wymaga ponownego uruchomienia sekcji skryptu.

## Połączenia: każda para części

| Para | Jak | Śruba | Ciasno | Luźno |
|---|---|---|---|---|
| Tuleja ↔ jarzmo ↔ piłeczka (oś oka) | 2 śruby od góry i od dołu, łeb w pogłębieniu Ø6,2 × 1,9, końcówka 3 mm w piłeczce | 2 × M3×8, **niski łeb** (ISO 7380 / DIN 7984) | tuleja Ø2,6 (występ 1,8 mm) | oczko jarzma Ø3,3, piłeczka Ø3,3; luz osiowy 0,3 z każdej strony (nie zależy od dokręcenia) |
| Jarzmo ↔ piłeczka (napęd) | kołek Ø4 w otworze Ø4,2 z boku piłeczki (60° od tyłu) + siodło 6 × 12 mm | – | – | – |
| Jarzmo ↔ tuleja (ograniczniki) | kołek Ø1,4 na każdym oczku w łukowym rowku występu, stop przy ±33° | – | – | – |
| Korba ↔ cięgno (C) | śruba od dołu przez tulejkę z kołnierzem, dokręcona do oporu | M3×8 DIN 912 | wkładka M3 w cięgnie | korba na tulejce (Ø6,0 / Ø5,6), luz osiowy 0,2 |
| Cięgno ↔ ramię (H) | jak w C | M3×8 DIN 912 | wkładka M3 w cięgnie | ramię na tulejce |
| Ramię ↔ orczyk | orczyk w kieszeni + wkręt środkowy serwa + wkręt M2 w otwór orczyka 13 mm | M2×6 | – | – |
| SG90 ↔ tuleja / pokrywa | przednie ucho na słupku tulei, tylne na słupku pokrywy | wkręty z kompletu SG90 | Ø1,8 | – |
| Pokrywa ↔ tuleja | 2 śruby w uszach tulei | 2 × M3×8 | wkładki M3 w tulei | pokrywa Ø3,3 |
| Moduł ↔ gniazdo | bagnet: 3 zaczepy, obrót 30°, klik na garbie języka | – | – | luz 0,6 |
| Gniazdo ↔ nakrętka | gwint trapezowy 45°, skok 3 | – | – | luz 0,3 (odsunięcie ścian) |
| Przyrząd A ↔ B | 2 śruby | 2 × M3×35–40 | B Ø2,6 | A Ø3,3 |

## Kinematyka

| Element | Wartość |
|---|---|
| Oś oka A | (x 0, z −12) |
| Korba | 26 mm pod 16° |
| Cięgno | 15,15 mm |
| Ramię orczyka | 25,5 mm pod 198° |
| Wałek serwa S | (0, −63) |

- Oko ±30° → serwo −31,4° / +29,5°.
- Kąt przenoszenia przy ±30° wynosi co najmniej 41,7°. Przy długości cięgna ±0,4 mm (luz 0,2 w dwóch przegubach) nadal co najmniej 41,1°.
- Druga pozycja złożenia czworoboku odpowiada oku przy −71°, a ogranicznik ±33° jej nie dopuszcza.
- Wymiary napędu zmieniły się względem v1.1 (korba 22, cięgno 16, ramię 22): przy łbach M3 i tulejkach w przegubach v1.1 nie mieści się w tulei Ø48,5. Policzone przeszukiwaniem: [`40-cad/onshape/oko-f-v2-build.js`](../40-cad/onshape/oko-f-v2-build.js), tablica `D`.

## Sprawdzenie (symulacja na siatkach z Onshape, tolerancja 0,03 mm)

Skrypt [`40-cad/onshape/oko-f-v2-kolizje.js`](../40-cad/onshape/oko-f-v2-kolizje.js). Kąty oka −33, −32, −30, −20, 0, 20, 30, 32, 33°. Serwo i cięgno były ustawiane z kinematyki, a łby śrub przegubów dodane jako walce.

- **Przenikań: zero** we wszystkich 26 parach.
- **Najmniejsze luzy w zakresie pracy ±30°:**

| Para | Luz |
|---|---|
| korba (żebro) – tuleja | 0,64 mm |
| cięgno – tuleja | ≥ 0,63 mm |
| ramię – tuleja | 0,64 mm |
| łby śrub – jarzmo, ramię, tuleja | ≥ 0,84 mm |
| ramię – SG90 | 1,29 mm |
| piłeczka – tuleja | 2,76 mm |
| piłeczka – cięgno | 0,88 mm |

- Cięgno od jarzma i od ramienia dzieli 0,2 mm (szczelina warstw).
- Na ograniczniku ±33° ruch blokuje kołek w rowku. Najbliższe miejsca: cięgno – tuleja 0,32, ramię – tuleja 0,47, żebro korby – tuleja 0,22 mm.
- Kołnierze tulejek dotykają korby i ramienia, tak jak zaprojektowano.
- **Dopasowania nieruchome:**
  - tuleja w gnieździe (pozycja ZAMKNIĘTE): najmniej 0,25 mm (zaczep w rowku), bez przenikań,
  - nakrętka na gnieździe: najmniej 0,27 mm (gwint), bez przenikań.

## Druk (DFAM)

Każda część ma płaską stronę na stół i nic nie wystaje poza nią. Podpory nie są potrzebne. Ułożenie części jest w [`40-cad/README.md`](../40-cad/README.md).

## Czego nie jestem pewien

1. **Łby śrub osi.** DIN 912 (łeb 3 mm) wystawałby 1,1 mm poza tuleję i zahaczał o gniazdo. Potrzebne są M3×8 z niskim łbem: grzybkowe ISO 7380 albo DIN 7984. Jeśli w warsztacie są tylko DIN 912, można zeszlifować łby do 1,8 mm.
2. **Gwint osi w PLA.** Śruba trzyma się w 1,8 mm materiału występu. Wkładka się tam nie mieści, więc może się wyrobić przy częstym rozkręcaniu.
3. **Wymiary SG90 i orczyka są założone.** Wysokość 30,5 do wierzchu orczyka, uszy 15,9 od spodu. Orczyk jednoramienny: piasta Ø7, długość do ~19,7 mm od osi, otwór 13 mm. Dłuższy orczyk trzeba przyciąć. Strona wyjścia kabla jest dowolna, bo kabel idzie pod serwem do pokrywy.
4. **Kolizje sąsiednich modułów.** Policzone dla dyni o promieniu 150 mm (Ø30 cm), rozstawu 105 mm i ścianki do 30 mm. W mniejszej dyni nakrętki Ø72 mogą się stykać.
5. **Język bagnetu i garb 0,6 mm** nie są sprawdzone na wydruku: mogą być za sztywne albo za miękkie (zmiana w `D`).
6. **Żebro korby jarzma** (2,5 × ~22 mm) drukuje się pionowo i może się chwiać. Warto dać brim i niższą prędkość.
7. **Montaż jarzma z piłeczką** idzie od przodu tulei, z kołkami ogranicznika w kanałach. Nie wiem, jak to wyjdzie w praktyce.
8. **Przyrząd centrowania** ustawia oko na wprost i ramię w położeniu środkowym. Nie usuwa skoku wielowypustu orczyka (~14°), więc kalibracja środka na stronie ESP32 nadal jest potrzebna. Przyrząd jedynie daje powtarzalny punkt odniesienia.
9. **Assembly.** Ustawienie kąta przez API nie zadziałało, więc ruch sprawdziłem własną symulacją. W Onshape można przeciągnąć piłeczkę ręcznie.
10. **Luzów na eksporcie 3MF nie mierzyłem**, bo eksport robi użytkownik. Do zrobienia po eksporcie.
