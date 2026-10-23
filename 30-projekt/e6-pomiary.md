# E6 – dane wejściowe do CAD dużego oka (stan 23.10, noc)

Odpowiedzi na pytania blokujące koncepcji v3 (`20-analizy/2026-10-23-duze-oko-2c-koncepcja-v3.md`). Źródło: Wykonawca CAD, ze zdjęć i rysunków zebranych z użytkownikiem 22.10 (bez pomiaru na sprzęcie, chyba że zaznaczono).

| Pytanie | Odpowiedź | Pewność / źródło |
|---|---|---|
| **B2** kardan 5/5: oś wkrętu M4 piasty wobec osi sworznia widełek tej piasty | **równoległa** (łeb sworznia i otwór M4 tej samej piasty patrzą w tę samą stronę) | średnia – zdjęcie użytkownika i karta produktu |
| Kardan 5/5: długość, Ø, otwór | L 25,5 (±0,2), Ø zewn. 11 (karta), otwór Ø5 głęb. 7 (pomiar użytkownika), oś sworznia → oś M4 9,1 (±0,2), zgięcie > 90° (użytkownik) | zdjęcia suwmiarki |
| **B4** MG90S Miuzei MS60-4-D-V1: otwór w uchu | **brak** – na rysunku otwarte wycięcia bez wymiaru; osie wycięć 27,7, końce uszu 31,8, ucho gr. 2, spód ucha 18 nad spodem korpusu | rysunek Amazon „Product Size” |
| MG90S: szerokość ucha | brak osobno; korpus 12,5 (rysunek) / 12,1 (pudełko); ucho na całą szerokość korpusu – założenie | – |
| MG90S: kabel | z krótszej ściany **po stronie przeciwnej do wałka**, nisko przy spodzie; wysokość brak. Uwaga: SG90 w `sprzet.md` ma kabel od strony wałka – dla MG90S do sprawdzenia | niska – rysunek |
| MG90S: wałek | czubek wałka 35 nad spodem; korpus 22 / 22,8; wieżyczka + wałek ok. 12–13 nad korpusem, wielowypust 3 mm (20T Ø4,9); oś wałka ok. 5,5 od czoła (±0,5) | rysunek |
| Orczyk jednoramienny | 7 otworów ok. Ø1 co 2,0 mm, 5,5–17,5 od osi (±0,3); długości orczyków 21 / 31,5 / 33,5 | zdjęcie użytkownika, rysunek |
| **B1** przeguby kulowe RC M2 i M5 | **brak danych** – do pomiaru przez użytkownika | – |
| **B5** wolne miejsce za wewnętrzną ścianką dyni (potrzeba ≥ 70 mm) | **brak** – dyni jeszcze nie ma | – |

## B1 – przeguby kulowe RC (2 × M2, 2 × M5) – stan 23.10 rano

**Zdjęć przegubów kulowych w tej sesji nie ma.** Wszystkie obrazy z rozmowy z użytkownikiem 22/23.10 (`~/.claude/uploads/5ff01094-…/` i karty produktów wklejone w rozmowie):

| Plik | Co przedstawia |
|---|---|
| 59ae542c-image.jpg | dwa **przeguby kardana** (krzyżakowe) w woreczku z kluczami imbusowymi – nie kulowe |
| 7c1ec235-image.jpg, 14444feb-image.jpg | kardan 5/5 na suwmiarce (oś sworznia → M4, długość) |
| images/1.webp, images/2.webp | karty produktu kardana 5/5 (Ø11 × 24) i 2/2 (Ø9 × 23,5) |
| 63f90bd9-image.jpg, d71f037a-image.jpg | pudełko i etykieta MG90S Miuzei MS60-4-D-V1 |
| 933edaa6-image.jpg | orczyk MG90S na suwmiarce |

Możliwe, że użytkownik ma na myśli zdjęcie 59ae542c (dwa przeguby z woreczka) – to kardany, nie przeguby kulowe. Poniżej wyłącznie **wartości typowe [Z]** z kart podobnych produktów, do zastąpienia pomiarem.

| Wielkość | M5 – założenie | Źródło (typowe) | M2 – założenie | Źródło (typowe) |
|---|---|---|---|---|
| (1) co znaczy rozmiar | gwint czopa i gwint żeński obudowy M5 (stal, DIN 71802/71803 wielkość 8) | karta DIN 71802 | gwint czopa / pręta M2 (modelarskie, tworzywo + stalowa kulka) | karty RC „ball link M2” |
| (2) Ø kuli | **8** (h9) | DIN 71802 rozmiar 8 ↔ M5 (Elesa-Ganter, fasten.it) | **4,8** (3/16″, najczęstsza w linkach M2/2-56) | karty RC; Associated ma też 3,5 przy M2×4 |
| (3) środek kuli nad kołnierzem czopa (h) | **7** (zgodne z wariantem odniesienia Fable h 7) | szacunek z rysunku DIN 71803 (kula 8, kołnierz ~Ø11) – niepewne ±2 | **3,5** | szacunek: kulka 4,8 + szyjka ~1 |
| (4) czop: gwint × długość, Ø kołnierza | M5 × 10, kołnierz ok. Ø11 (klucz 9–10) | J.W. Winco: „ball stud thread length 10 mm”, „center length 22 mm” | M2 × 4…5, kołnierz ok. Ø4,5 | Associated M2×4 |
| (5) obudowa: Ø przy kuli / wysokość gniazda / Ø trzonu / środek kuli → koniec / gwint żeński × głęb. | Ø **12,8** / ok. 10 / Ø ok. 8 (sześciokąt 7–8) / ok. 22 / M5 × ok. 10 | J.W. Winco M5: „head outside diameter 12,8 mm”; DIN 71802 | Ø ok. **7** / ok. 6 / Ø ok. 4,5 / ok. 9–10 / M2 × ok. 6 | karty RC „M2 ball link”, model MakerWorld 1862070 (gniazdo pod M2) |
| (6) wychylenie do oporu | **±15°** z zabezpieczeniem sprężynowym, **±18°** bez | DIN 71802 (Elesa-Ganter) | ±25…30° | typowe dla linków RC, niepotwierdzone |

**Skutki dla koncepcji v3 (do oceny orkiestratora):**
- M5 (DIN 71802 rozmiar 8): h ≈ 7 przy obudowie Ø12,8 – blisko wariantu odniesienia Fable „h 7 / Ø12”; obudowa jest o 0,8 większa niż Ø12 (v3 tabela wrażliwości: przy h 7 i Ø14 obudowy X–Y nachodzą −0,63, przy Ø12 +0,16 na ogranicznikach) – **do przeliczenia przemiataniem dla Ø12,8**.
- Wychylenie M5 **±15/18°** wobec potrzebnych 17–19° przy h 7 (v3 pkt 3.2): bez zabezpieczenia na granicy, z zabezpieczeniem **za mało** – warunek odrzucenia B1 (a)/(b) może zadziałać.
- M2: kula 4,8 i obudowa Ø7 × 9 = dokładnie założenie v3; wychylenie ≥ 25° potrzebne – typowe linki RC to spełniają, ale niepotwierdzone.

Źródła: [Elesa-Ganter DIN 71802](https://elesa-ganter.be/product/DIN 71802), [J.W. Winco DIN 71802 z czopem gwintowanym](https://jwwinco.com/en-us/products/quick-finder/DIN-71802-Steel-Threaded-Ball-Joint-Linkages-with-Threaded-Stud?q=802), [J.W. Winco M5 (Zoro)](https://www.zoro.com/jw-winco-ball-joint-linkages-5nxf1a/i/G415193318/), [fasten.it](https://www.fasten.it/de/Search/Suppliers/306), [Associated 3,5 mm ballstud M2×4](https://store.hobbyetc.com/parts/view/187017), [MakerWorld 1862070](https://www.makerworld.com/en/models/1862070).
