# Moduł małego oka v2.1d: plan i stan po budowie (do review)

Na podstawie [briefu v2](brief-v2-modul-oka.md) i poprawek po review v2 (18.10): **bez bagnetu**, **piłeczka wklejona w miskę**, **mniejsza średnica**. Wartości, których nie zmierzono, są zmiennymi (lista niżej).

**Onshape:** dokument SimpleEye, gałąź **v2**. Wersja **„v2.1d do review”**. Wcześniejsze wersje „v2.1c do review”, „v2.1b do review”, „v2.1b animacja”, „v2.1 do review”, „v2 do review”, „v1.1” i „v1” zostają w historii bez zmian.

**v2.1d względem v2.1c:** otwór w dyni pod stałą otwornicę **Ø56** (Ø57 nie ma). Część w otworze Ø55,6 (`przodD`) – 0,2 mm luzu na stronę; gwint Ø54,9 – 0,55 mm na stronę; za rantem nic nie jest szersze niż Ø55,6 (sprawdzone na siatce). Rant bez zmian: zakładka na skórce rośnie z 3 do 3,5 mm, ząbki 1,5 mm od krawędzi otworu. Pogłębienie łbów osi przesunęło się o 0,3 mm. Poprawiona kolejność montażu: serwo i pokrywa dopiero w dyni (wystają poza Ø56).

**v2.1c względem v2.1b** (po wydruku testowym v1.1):
- **jarzmo drukuje się bez podpór:** leży płaskim bokiem miski (strona bez korby); korba zrośnięta z miską na całej szerokości pasa; piasta C Ø10 (ścianka wokół tulejki 2 mm zamiast 1,2) w kształcie kropli z bokami 45°; oczka 2,4 mm (`oczkoT`); jedyne nawisy to mostki nad poziomymi otworami Ø6 i Ø3,3,
- **gwint:** `luzGwint` 0,5 (v1.1 z 0,3 była za ciasna) i nowe części **Probka gwintu** (pierścień z gwintem obudowy + kawałek nakrętki) do kalibracji przed drukiem obudowy,
- **kabel SG90:** taśma wychodzi u dołu krótszego boku od strony wałka i idzie prosto do tyłu; w pokrywie otwór w kształcie dziurki od klucza przepuszcza wtyczkę 3-pin przy założonej pokrywie, a wąska szczelina zaciska taśmę.

**v2.1b względem v2.1:**
- szczelina na klej 0,5 mm (zmienna `klej`) pod klej wypełniający (akrylowy dwuskładnikowy),
- przyrząd do wklejania sterowany zmiennymi, a jego czasza nie zależy od kleju,
- Assembly: przeciąganie piłeczki prowadzi cały napęd (limit wałka serwa, przegub C obrotowy).
- Part Studio **Oko F v2.1**: wszystkie części w pozycji złożonej, 230 operacji w 12 folderach.
- Variable Studio **Zmienne v2**: 42 zmienne v2.1.
- Assembly **Oko F v2.1 - zlozenie**: ruch ±33°. Przeciągnięcie piłeczki albo Animate na mate'cie osi oka porusza cały napęd.

Stan v2 (bagnet, jarzmo z kołkiem, przyrząd wiercenia) jest w wersji „v2 do review” i w historii gita tego pliku.

## Co się zmieniło względem v2

| | v2 | v2.1 |
|---|---|---|
| Mocowanie w dyni | gniazdo + tuleja na bagnet | **jedna Obudowa**: rodzic wkłada ją od zewnątrz i od środka dokręca nakrętkę; syn wpina tylko wtyczkę serwa |
| Piłeczka | jarzmo C, siodło, kołek Ø4, wiercenie w przyrządzie | **wklejona (klej akrylowy 2K) w Miskę** – pas kulisty 8 mm z tyłu piłeczki, zrośnięty z korbą |
| Otwór w dyni | Ø64 | **Ø56** (stała otwornica; część w otworze Ø55,6) |
| Rant | Ø68 | **Ø63**, otwór kołnierzyka Ø41 |
| Nakrętka | Ø72 | **Ø66** |
| Wnętrze | Ø48,5 | Ø48,5 (bez zmian – patrz niepewności) |
| Gwint | na gnieździe Ø~64 | na obudowie: rdzeń Ø52,5, zewn. Ø54,9, skok 3, 45° |
| Grubość ścianki dyni | 15–30 mm | **15–25 mm** |
| Długość modułu | 72,6 + gniazdo | 77,5 mm (całość) |
| Części do druku | 12 | **10** (w tym 2 przyrządy) |

## Układ

- Oś oka jest pionowa (Y), +Z na zewnątrz dyni, z = 0 to wierzch rantu, +Y = GÓRA (strzałka wycięta na rancie).
- Środek piłeczki leży 12 mm pod rantem, więc gałka wystaje ok. 8 mm.
- Napęd leży w warstwie y od −3 do +4 (na wysokości środka piłeczki).
- SG90 leży wzdłuż osi, wałkiem do tyłu, i wystaje pod obudowę przez szczelinę za gwintem.
- Tył obudowy (z < −64) ma spłaszczenia |x| ≤ 23,2, żeby sąsiednie moduły mieściły się przy rozstawie 105 mm w dyni o promieniu 150 mm.

## Części (każda jako osobny Part)

| Part | Szt. | Do czego |
|---|---|---|
| Obudowa | 1 | Rant Ø63 (płaski wierzch, pod spodem dopasowany do dyni R 150, fazka, 8 ząbków przeciw obracaniu), część w otworze Ø55,6 × 15, rura Ø52,5 z gwintem. W środku: występy osi z rowkiem ogranicznika i kanałem montażowym od tyłu, pogłębienia i ciasne otwory osi, słupek przedniego ucha SG90 z podporą 45°, szczelina na serwo, otwory montażowe (dolny do przegubu H, górne do wkrętów ucha i orczyka), 2 występy z wkładkami na pokrywę, spłaszczenia tyłu, wybranie w ściance na przegub H |
| Nakretka | 1 | Ø66 × 7. Czoło stożkowe pod wewnętrzną ściankę dyni, radełko, 6 wycięć na klucz. Gwint = zwój obudowy odsunięty o `#luzGwint` |
| Jarzmo z miska | 1 | Pas kulisty (wnętrze Ø41,5 = piłeczka 40,5 + 2 × 0,5 kleju, ścianka 2,5, szerokość 8) w płaszczyźnie odchylonej o 60° od osi z tyłu w bok. Oczka 2,4 mm na osi z luźnymi otworami M3 i kołkami ogranicznika. Korba zrośnięta z miską na całej szerokości pasa, piasta C Ø10 (kropla ostrzem w stronę stołu, spłaszczona 4,15 mm od osi po stronie ściany obudowy) |
| Ciegno | 1 | Otwory Ø3,3, wkładki M3 od góry w podniesieniach |
| Ramie orczyka | 1 | Kieszeń na orczyk od spodu, otwór M2 13 mm od osi, otwór na tulejkę w H |
| Tulejka przegubu korby / ramienia | 2 | Ø5,6 × 2,7 z kołnierzem Ø8 × 0,8, otwór Ø3,3 |
| Pokrywa tylna | 1 | Zamyka tył, słupek tylnego ucha SG90, spłaszczenia jak w obudowie. Otwór na kabel w kształcie dziurki od klucza: szeroka część 9 × 3,4 na wtyczkę 3-pin (8 × 2,5), pod nią szczelina 3,8 × 1,2 zaciskająca taśmę; od środka 2 prowadnice taśmy |
| Probka gwintu - obudowa / - nakretka | 1+1 | Pierścień 14 mm z gwintem obudowy (ta sama ścianka, skok, profil, faza zwoju) i kawałek nakrętki Ø62 × 7 z tym samym `#luzGwint`. Do wydrukowania przed obudową |
| Przyrzad do wklejania pileczki | 1 | Czasza na przednią połowę piłeczki (Ø40,9, niezależnie od kleju) z otworem-celownikiem Ø3 na źrenicę. Dwa słupki (wewnętrzna ściana jak występy osi w obudowie) z otworami M3 trzymają jarzmo w tym samym położeniu co w obudowie |
| Przyrzad centrowania orczyka | 1 | Płytka pod obudową z trzpieniem Ø5,8 przez otwór dolny do otworu ramienia (H) |
| PODGLAD pileczka 40.5 / SG90 / orczyk SG90 | – | Tylko do sprawdzania kolizji. SG90 ma taśmę kabla 3,5 × 1,4 wychodzącą u dołu krótszego boku od strony wałka, przez pokrywę na zewnątrz |

## Foldery w drzewie operacji

Wspolne · **Obudowa** (podfoldery: rant i przod · gwint · os i ograniczniki · mocowanie serwa · otwory i pokrywa · splaszczenia i wybranie) · Nakretka · Jarzmo z miska · Ciegno · Ramie orczyka · Tulejki · Pokrywa tylna · PODGLAD (nie drukowac) · Przyrzad do wklejania pileczki · Przyrzad centrowania orczyka · Probka gwintu (do kalibracji luzu).

Każda operacja ma nazwę `Część: co robi`, np. `Obudowa: rowek ogranicznika gora`, `Jarzmo: kolek ogranicznika dol`. Płaszczyzny i szkice są ukryte.

## Zmienne (Variable Studio „Zmienne v2”, zestaw v2.1)

| Grupa | Zmienne |
|---|---|
| Piłeczka i miska | `kulaDmax` 40,5, `klej` 0,5, `jarzmoT` 2,5, `jarzmoW` 8, `oczkoT` 2,4, `luzOsiowy` 0,3 |
| Obudowa | `modulID` 48,5, `sciankaM` 2, `modulL` 77,5, `rantD` 63, `rantT` 1,5, `kolnierzykD` 41, `przodD` 55,6, `przodL` 15 |
| Gwint i nakrętka | `gwintSkok` 3, `luzGwint` 0,5, `dociskMin` 15, `dociskMax` 25, `nakretkaH` 7, `nakretkaD` 66, `nakretkaZ` 22 (tylko podgląd) |
| Śruby i wkładki | `m3Ciasny` 2,6, `m3Luzny` 3,3, `lebD` 6,2, `lebH` 1,9, `wkladkaD` 4, `wkladkaL` 4, `tulejkaD` 5,6, `luzPrzegub` 0,2, `kolnierzD` 8, `kolnierzH` 0,8, `plytaT` 2,5, `m2Otwor` 2,2, `serwoWkret` 1,8 |
| SG90 (do pomiaru) | `servoH` 30,5, `servoSpodY` −33,5, `servoUcho` 15,9 |
| Wyliczane | `hornTop`, `modulOD` (52,5), `gwintD` (54,9), `gniazdoL` (koniec gwintu, 35,73), `nakretkaOtwor` (53,1) |

Liczbami w skrypcie (tablica `D`) zostały:
- położenia przegubów (kinematyka),
- słupki, występy i wybranie,
- profil gwintu,
- krzywizna dyni R 150.

Ich zmiana wymaga ponownego uruchomienia sekcji skryptu.

## Połączenia: każda para części

| Para | Jak | Śruba | Ciasno | Luźno |
|---|---|---|---|---|
| Obudowa ↔ jarzmo z miską (oś oka) | 2 śruby od góry i od dołu, łeb w pogłębieniu Ø6,2 × 1,9. Śruba trzyma się na 2,45 mm w występie, a końcówka kończy się 0,15 mm w oczku, 0,65 mm przed piłeczką | 2 × **M3×5 z niskim łbem** (ISO 7380) | występ obudowy Ø2,6 | oczko jarzma Ø3,3; luz osiowy 0,3 z każdej strony |
| Jarzmo ↔ piłeczka | klej wypełniający (akrylowy 2K) w szczelinie 0,5 mm w misce, z daleka od otworów osi; ustawienie źrenicy w przyrządzie do wklejania | – | – | – |
| Jarzmo ↔ obudowa (ograniczniki) | kołek Ø1,4 na każdym oczku w łukowym rowku występu, stop przy ±33°. Kanał montażowy prowadzi kołek od tyłu | – | – | – |
| Korba ↔ cięgno (C) | śruba od dołu przez tulejkę z kołnierzem, dokręcona do oporu | M3×8 DIN 912 | wkładka M3 w cięgnie | korba na tulejce (Ø6,0 / Ø5,6), luz osiowy 0,2 |
| Cięgno ↔ ramię (H) | jak w C, przez otwór dolny obudowy | M3×8 DIN 912 | wkładka M3 w cięgnie | ramię na tulejce |
| Ramię ↔ orczyk | orczyk w kieszeni + wkręt środkowy serwa + wkręt M2 w otwór orczyka 13 mm | M2×6 | – | – |
| SG90 ↔ obudowa / pokrywa | przednie ucho na słupku obudowy, tylne na słupku pokrywy | wkręty z kompletu SG90 | Ø1,8 | – |
| Pokrywa ↔ obudowa | 2 śruby w występach obudowy | 2 × M3×8 | wkładki M3 w obudowie | pokrywa Ø3,3 |
| Obudowa ↔ dynia | obudowa od zewnątrz w otworze Ø56 (część w otworze Ø55,6, luz 0,2 na stronę), rant z ząbkami na skórce, nakrętka od środka | – | – | – |
| Obudowa ↔ nakrętka | gwint 45°, skok 3, faza początku zwoju | – | – | luz 0,5 (odsunięcie ścian), sprawdzany na Próbce gwintu |
| Przyrząd do wklejania ↔ jarzmo | 2 śruby w słupkach jak oś oka | 2 × M3×10 DIN 912 | słupek Ø2,6 | oczko Ø3,3 |

## Kinematyka

| Element | Wartość |
|---|---|
| Oś oka A | (x 0, z −12) |
| Korba | 25,25 mm pod 17° |
| Cięgno | 17,21 mm |
| Ramię orczyka | 27 mm pod 200° |
| Wałek serwa S | (0, −66) |

- Oko +30° → serwo −29,8°, a oko −30° → serwo +25,6°.
- Kąt przenoszenia w zakresie ±30° wynosi co najmniej 44°, przy +33° spada do 33°.
- Przegub H leży za strefą gwintu (z −40,6), więc da się go skręcić przez otwór w spodzie obudowy przy założonej nakrętce. Z tego powodu `dociskMax` wynosi 25.

## Sprawdzenie (symulacja na siatkach z Onshape, tolerancja 0,03 mm)

Skrypt [`40-cad/onshape/oko-f-v2-kolizje.js`](../40-cad/onshape/oko-f-v2-kolizje.js). Kąty oka −33, −30, −15, 0, 15, 30, 33°. Serwo i cięgno były ustawiane z kinematyki, a łby śrub przegubów dodane jako walce.

- **Przenikań: zero** we wszystkich 26 parach.
- Pierwsza symulacja wykazała, że koniec ramienia, cięgno i tulejka H przy −33° dotykają ścianki obudowy (luz 0,004–0,1 mm). Dodałem wybranie 0,6 mm w ściance z sufitem 45°. Po zmianie:

| Para (cały zakres ±33°) | Najmniejszy luz |
|---|---|
| ramię – obudowa | 0,66 mm |
| cięgno – obudowa | 0,52 mm |
| tulejka H – obudowa | 0,60 mm |
| tulejka C – obudowa | 0,57 mm |
| korba (piasta C) – obudowa | 0,54 mm |
| łby śrub – obudowa, jarzmo, ramię | ≥ 0,66 mm |
| ramię – SG90 | 1,29 mm |
| piłeczka – obudowa | 2,56 mm |
| piłeczka – miska (szczelina kleju) | 0,46 mm (0,5 – dokładność siatki) |
| kabel – pokrywa (prowadnice) | 0,55 mm |
| piłeczka – cięgno | 0,82 mm |
| cięgno – jarzmo, cięgno – ramię | 0,2 mm (szczelina warstw) |

- Przy ±33° ruch blokuje kołek ogranicznika w rowku, a przy 0° miska ma 0,2 mm do występów.
- Kołnierze tulejek dotykają korby i ramienia, tak jak zaprojektowano.
- **Dopasowania nieruchome:**
  - nakrętka na obudowie i w Próbce gwintu: najmniej 0,47 mm (gwint, `luzGwint` 0,5), bez przenikań,
  - piłeczka w przyrządzie do wklejania: 0,18 mm,
  - jarzmo w przyrządzie: 0,3 mm. Wcześniej krawędź kieszeni oczek dotykała pierścienia, więc kieszenie poszerzyłem do |y| 18,4.
- **Brzeg miski patrząc na wprost:** schowany za kołnierzykiem Ø41 w całym zakresie ±33°. Zostaje tylko szczelina 0,25 mm między piłeczką Ø40,5 a kołnierzykiem. Najbardziej wysunięty punkt miski leży 6–8 mm za rantem, na promieniu 20,5.

## Druk (DFAM)

Każda część ma płaską stronę na stół i nic nie wystaje poza nią. Podpory nie są potrzebne:
- **jarzmo z miską** leży bokiem miski bez korby (płaszczyzna pasa, s = +4 mm). Sprawdzone na siatce: żadna ściana nie jest bardziej nawisowa niż 45°, poza mostkami nad poziomymi otworami (otwór tulejki Ø6 na wysokości ~24 mm i otwory osi Ø3,3) – razem ok. 25 mm². Korba to pionowe żebro 2,5 mm, wysokość części 26 mm,
- otwory poziome mają kształt kropli,
- słupek serwa ma podporę 45°,
- występy pokrywy, faza gwintu i wybranie w ściance mają skosy 45°.

Ułożenie części jest w [`40-cad/README.md`](../40-cad/README.md). Wszystkie części mieszczą się na A1 mini; obudowa ma 63 × 63 × 78.

## Odstępstwa od zlecenia (świadome)

1. **Miska to pas, nie pełna półkula.** Pas kulisty ma 8 mm szerokości i obejmuje tylną połowę piłeczki w płaszczyźnie odchylonej o 60°. Pełna półkula miałaby oczka osi wystające poza płaską stronę (DFAM) i zajęłaby miejsce cięgna za piłeczką. Klej trzyma na pasie około 8 × 64 mm.
2. **Średnica wnętrza została 48,5** (zamiast zakładanego ok. 45,5). Przy łbach M3 i tulejkach w przegubach przeszukiwanie kinematyki dla mniejszej rury dawało najwyżej ok. 30° kąta przenoszenia albo kolizje ze ścianką (przy 48,5 jest co najmniej 44°). Zmalało za to to, co widać i co się wierci: otwór w dyni z Ø64 na Ø56, rant z Ø68 na Ø63, nakrętka z Ø72 na Ø66.
3. **Ścianka dyni do 25 mm** (było 30). Przegub H musi leżeć za gwintem, żeby dało się go skręcić przy założonej nakrętce.
4. **Wybranie w ściance obudowy** na przegub H, dodane po symulacji.

## Czego nie jestem pewien

1. **Śruby osi M3×5 z niskim łbem (ISO 7380).** DIN 912 nie mieści się w pogłębieniu, a M3×8 weszłaby w piłeczkę. Jeśli w warsztacie ich nie ma, można skrócić M3×8 i zeszlifować łeb do 2,5 mm.
2. **Klej.** Akrylowy 2K w szczelinie 0,5 mm na pasie 8 mm nie jest sprawdzony na tej piłeczce (materiał nieznany). Jeśli puści, można zwiększyć `jarzmoW` (szersza miska). Kleju nie nakładać w pobliżu otworów osi, żeby nie zalał otworów oczek (końcówki śrub kończą się 0,45 mm przed wnętrzem miski).
   - **Mniejsza piłeczka w przyrządzie.** Czasza ma Ø40,9, więc piłeczka 39,5 leży w niej 0,7 mm bliżej przodu niż środek jarzma. Wklejona tak będzie lekko „bić” przy obrocie. Dla mniejszych piłeczek trzeba zmniejszyć czaszę (szkic `Przyrzad wklejania: czasza szkic`).
3. **Widok z ukosu.** Patrząc pod kątem do osi, przy piłeczce otwiera się sierp (ok. 2 mm przy 10°), przez który widać brzeg miski i wnętrze. To geometria otworu, nie kolizja. Najprościej wydrukować jarzmo z miską (i najlepiej obudowę) na czarno.
4. **Wymiary SG90 i orczyka są założone** (jak w v2): wysokość 30,5 do wierzchu orczyka, uszy 15,9 od spodu, orczyk jednoramienny z otworem 13 mm. Trzeba je zmierzyć i wpisać w zmienne.
5. **Przegub H składany przez otwór dolny w dyni.** Wymaga krótkiego klucza imbusowego i tulejki wkładanej od dołu, co może być niewygodne. Złożyć go przed włożeniem do dyni się nie da: serwo z ramieniem wystaje poza otwór Ø56, więc serwo, ramię, przegub H i pokrywę montuje się od środka dyni (kolejność w README).
6. **Spłaszczenia tyłu i rozstaw 105 mm** policzone dla dyni o promieniu 150 mm. W mniejszej dyni nakrętki Ø66 mogą się stykać.
7. **Kabel serwa.** Wymiary taśmy (3,5 × 1,4) i wtyczki (15 × 8 × 2,5) są przyjęte, nie mierzone. Wtyczka przechodzi przez szeroką część otworu (9 × 3,4) przy założonej pokrywie; po przeciągnięciu taśmę wciska się w szczelinę 1,2 pod spodem (zgięcie w S, promień ok. 3,9 mm). Jeśli taśma jest grubsza, szczelinę trzeba poszerzyć.
8. **Przyrząd centrowania** nie usuwa skoku wielowypustu orczyka (~14°), więc kalibracja środka na stronie ESP32 nadal jest potrzebna.
9. **Gwint drukowany** (45°, skok 3, luz 0,5). Najpierw wydrukować Próbkę gwintu (te same ustawienia co obudowa). Jeśli nakrętka nadal idzie ciężko albo lata, zmienić `luzGwint` (zmienia nakrętkę i próbkę naraz).
10. **Piasta C jarzma** ma ściankę 2 mm wokół tulejki, ale po stronie ściany obudowy jest spłaszczona do 1,15 mm (inaczej przy +33° dotyka ściany). Piasta H na ramieniu orczyka została Ø8,4 (ścianka 1,2) – nie zmieniałem, bo ramię nie było częścią tej poprawki.
11. **Luzów na eksporcie 3MF nie mierzyłem**, bo eksport robi użytkownik.
