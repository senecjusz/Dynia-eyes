# Lista hardware'u: Dynia-eyes (stan 28.10, 00:05)

Lista wszystkiego, co jest potrzebne do złożenia i uruchomienia dyni na czwartek 29.10. Kolumnę „Mam?” wypełnia użytkownik. Zakres obejmuje duże oko v3, montaż 8 małych oczu w dyni, podstawkę z szufladką, kasetę elektroniki, okablowanie, zasilanie, PIR, przycisk, montaż w dyni i narzędzia. Na końcu są części drukowane, elementy wycofane z instrukcji i luki w instrukcjach.

## W skrócie

- **Pozycje:** 73 (hardware i materiały: 47, narzędzia: 26), do tego 11 części drukowanych.
- **ZAŁOŻONE: 36 z 73.**
  - Hardware i materiały (21): D8, P4, P6, P7, K3, K4, K5, W7, Z2, Z3, Z6, Z7, Z8, S3, S5, Y2, Y3, Y4, Y5.
  - Narzędzia (15): N5, N6, N7, N8, N11, N12, N13, N14, N15, N18, N19, N22, N24, N25, N26.
  - Do tego 3 części drukowane o nieznanym stanie druku: R7, R9, R11.
- **BRAKI (potrzebny zamiennik): wśród rzeczy wymaganych przez aktualne instrukcje nie ma potwierdzonego braku.** Trzy braki z 27.10 są już zastąpione w instrukcjach (sekcja 11):
  - śruba M5 × 8 ISO 4762 → trzpień drukowany z wkrętem M3 × 10 (D3);
  - M5 z łbem walcowym → j.w.;
  - drut Ø2,0 × 5,6 na osie powiek → wkręt M2 × 6 (D4). Zmiana z 27.10 ok. 23:50, niezacommitowana; wcześniejszy wariant z filamentem 1,75 użytkownik odrzucił.
- **Do druku (aktualnej wersji nie ma):** powieki (R5), tuby 30/40/50 (R6), tuleja z nakrętką po pomiarze `hDoc` (R10).
- **POTWIERDZONE** znaczy: jest cytat albo zdjęcie z datą, że użytkownik to ma. Lista nie rozstrzyga, czy rzecz leży w Warszawie, czy w Kobyłce.

## Źródła (skróty w tabelach)

| Skrót | Plik |
|---|---|
| [DO] | `.claude/worktrees/duze-oko/40-cad/openscad/duze-oko-v3-montaz.md` i `.html` (gałąź `projektant-duze-oko`, zmiany niezacommitowane, stan 28.10 00:00) |
| [POD] | `20-analizy/2026-10-25-podstawka-model.md`: sekcja „v2” („Śruby z magazynu”, „Kolejność montażu szufladki”, „Tacka elektroniki (kaseta) v2”, „Przycisk…”) |
| [POL] | `.claude/worktrees/elektronika/50-elektronika/polaczenia.md`, „Dynia: połączenia docelowe” (gałąź `elektronika/dynia-v2`, `17b667f`) |
| [M28] | `.claude/worktrees/montaz/70-budowa/montaz-v2.8.md` (gałąź `wykonawca-montaz`, zmiany niezacommitowane) |
| [PRD] | `30-projekt/PRD.md` |
| [SZ] | zdjęcie szafki ze śrubami z 19.10: `/tmp/claude-1000/-home-rkp--claude-spares-spare-6XgxuH/079fb8d7-3d0e-496c-b54c-75796e66b78a/scratchpad/img/hw-1.jpeg` |
| [KAM] | zdjęcia z kamery warsztatowej: `/tmp/kamera-warsztatowa/` |

Cytaty użytkownika pochodzą z transkryptów sesji, godziny są lokalne.

## 1. Duże oko v3: montaż na stole

| Element | Ilość | Gdzie i do czego | Źródło wymagania | Status | Mam? |
|---|---|---|---|---|---|
| **D1** Serwo MG90S Miuzei MS60-4-D-V1 (metalowe przekładnie) z orczykiem jednoramiennym i wkrętem orczyka | 4 (bez zapasu) | L–P, G–D, powieka górna, powieka dolna; kroki 3, 6, 8, 9; serwa klejone do płyty | [DO] §2, [PRD] §4 | **POTWIERDZONE**: zdjęcia pudełka i etykiety 22.10 (`30-projekt/e6-pomiary.md`); `sprzet.md`: „Dotarły (22.10)” | |
| **D2** Kardan PATIKIL 5/5: Ø11 × 25,5, otwory Ø5,05–5,1 gładkie, 2 wkręty dociskowe M4 bez łba | 1 (posiadane 2) | środek gałki: piasta tylna na trzpień słupka, przednia na trzpień gałki; kroki 4–5 | [DO] §2 | **POTWIERDZONE**: zdjęcia 25.10 (`70-budowa/zdjecia/2026-10-25-kardan-5-5/`); 27.10: „on ma z boku wkręcane takie sruby bez łepków”, „jest 5.05 - 5.1” | |
| **D3** Wkręt M3 × 10, łeb grzybkowy ISO 7380 (łeb ok. Ø5,7 × 1,65, razem 12) | 2 | rdzeń drukowanych trzpieni kardana, wkręcony od kołnierza w otwór Ø2,5; krok 1 | [DO] §2 | **POTWIERDZONE**: 27.10: „mam m3x12grybkowy”, „m3 10 grzybkowy ma długosc 12 mm? … to mam taka”; 27.10 ok. 22:05: „mam dwa białe z wkrecona srubamia” (trzpienie już skręcone) | |
| **D4** Wkręt M2 × 6 z łbem najwyżej Ø4 × 2 | 2 | osie zawiasu powiek: od zewnątrz przez słupek i ucho górnej (Ø2,4), wkręcony w ucho powieki dolnej (Ø1,6), bez kleju; łeb przechodzi w szczelinie tuby; krok 7 | [DO] §2, §5 krok 7 (zmiana 27.10 ok. 23:50) | **POTWIERDZONE**: 27.10 ok. 23:24: „mam m2x5 i m2x6”; [SZ]: przegródka „M2x6”. Nikt nie sprawdził łba posiadanego M2 × 6 wobec limitu Ø4 × 2. Razem z S2 potrzeba 4 szt. M2 × 6 | |
| **D5** Drut sprężynowy stalowy Ø1,0 (pręt 500 mm) | 4 odcinki: gotowe ok. 77 / 71 / 104 / 79 mm, tnij ok. 5 mm dłużej | pręt L–P, pręt G–D, drut powieki górnej i dolnej; końce „Z”: noga ok. 7, promień ok. 1, ogon ok. 2 (przy uszkach powiek ok. 1, decyzje 27.10); kroki 6, 8, 9 | [DO] §2 | **POTWIERDZONE**: zdjęcie 26.10 `70-budowa/zdjecia/2026-10-26-drut-z/drut-z-02.jpg` (dwa druty Ø1 zgięte w „Z”); 26.10: „no moge zoqabczyc jak zrobie to na drucie 1mm” | |
| **D6** Drut Ø1,0 na kołki | 4 (po 2 na przedłużenie; długości instrukcja nie podaje, kołki obcina się równo) | przedłużenia orczyków powiek: przez otwory 13,5 i 17,5 w otwory orczyka; krok 2 | [DO] §5 krok 2, html krok 2 | **POTWIERDZONE**: ten sam drut co D5 | |
| **D7** Klej cyjanoakrylowy (CA) z primerem | wg potrzeby | kołnierze trzpieni w gniazdach (krok 1); styk ramienia orczyka z przedłużeniem (krok 2) | [DO] §2, §5 | **POTWIERDZONE**: 20.10: „użyłem kleju cyjanoacrylite z primerem i złapało” | |
| **D8** Klej na gorąco (pistolet i wkłady) | wg potrzeby | 4 serwa do płyty (kroki 3, 9); moduł w tubie (krok 11, w dyni); wtyki Dupont po teście ([POL] „Kolejność uruchomienia” pkt 4) | [DO] §2, §5; [POL] | **ZAŁOŻONE**: 26/27.10 użytkownik sam proponuje „przewód któr potem zaleje kejem termicnzym”, ale nie powiedział wprost, że ma klej na gorąco | |

## 2. Małe oczy: montaż w dyni i podłączenie

| Element | Ilość | Gdzie i do czego | Źródło wymagania | Status | Mam? |
|---|---|---|---|---|---|
| **M1** Moduł małego oka v2.8, złożony i skalibrowany (1500 / 1100 / 1800 µs) | 8 | w dyni: Gniazdo od zewnątrz, Nakrętka od środka, Kaseta w Gnieździe, wtyczka serwa do listwy goldpin (W5); kanały 0–3 lewa, 4–7 prawa; [M28] kroki 9–11 | [PRD] §6 „Minimum na szkołę”; [M28]; [POL] | **POTWIERDZONE**: 27.10 ok. 21:30: „mamy mielstone to byl 8 małe oko skaliborwane”; 27.10: buczenie usunięte („jak je wyczyscielem to działa dużo lepiej”) | |

Pozostałe rzeczy potrzebne do montażu małych oczu są w innych sekcjach: Gniazdo i Nakrętka (R11), listwy goldpin (W5), otwornica (N11), nóż (N25), marker (N26).

## 3. Podstawka z szufladką

| Element | Ilość | Gdzie i do czego | Źródło wymagania | Status | Mam? |
|---|---|---|---|---|---|
| **P1** Śruba M4 × 20 z łbem okrągłym na imbus (model: łeb Ø7 × 4; gniazdo w rączce Ø8 × 4,5) | 2 | rączka szufladki: łby wklejone epoksydem od lica, rozstaw 26; kroki 2–3 montażu szufladki | [POD] „Śruby z magazynu”; [PRD] §5 | **POTWIERDZONE**: [SZ] przegródka „M4x20”, śruby nierdzewne z łbem okrągłym i gniazdem imbus; 25.10: „nie mam sześciąkotnych srub musi byc okrągła z klejem” | |
| **P2** Śruba M4 × 12 z łbem stożkowym 90° (DIN 7991, łeb Ø8) | 2 | front–korpus przy dolnych rogach, łby równo z licem; krok 3 | [POD] „Śruby boczne front–korpus stożkowe (26.10)” | **POTWIERDZONE**: 27.10: „mam tez m4 stozkowe o długosci całkowietj 12 mm”; zdjęcie z suwmiarką 26.10 ([KAM] `20261026-004711-adnotacje.jpg`) | |
| **P3** Nakrętka M4 | 4 (2 do P1, 2 do P2) | od środka, w kieszeni PIR; krok 3 | [POD] „Śruby z magazynu” | **POTWIERDZONE**: [SZ] przegródka „M4 NK” z nakrętkami | |
| **P4** Podkładka M4 | 4 (2 do P1, 2 do P2) | pod nakrętki; krok 3 | [POD] „Śruby z magazynu” | **ZAŁOŻONE**: na [SZ] są podkładki w czerwonych przegródkach, ale rozmiaru nie widać | |
| **P5** Śruba M4 × 25 na imbus (łeb Ø7 opiera się o front) | 1 | blokada szufladki: przez otwór Ø5 we froncie w otwór pilotowy Ø3,3 × 22 w krawędzi płyty górnej, gwint wycina śruba; krok 5 | [POD] „Blokada”; [PRD] §5 | **POTWIERDZONE**: [SZ] przegródka „M4x25” z kilkoma śrubami (łba nie widać) | |
| **P6** Klej epoksydowy | wg potrzeby | łby M4 w rączce (krok 2); przycisk w otworze Ø12 (S4) | [POD] krok 2, „Przycisk” | **ZAŁOŻONE**: w rozmowach nikt nie potwierdził | |
| **P7** Wkręt do drewna 3,5 × 40 (wymiar z modelu) | 4 | płyta górna 18 mm w ścianki boczne (9 od boku, 20 od frontu i od tyłu), przykręcana na końcu (plan P12) | [POD] „Model zaktualizowany do stanu wykonanego”; [PRD] §5 „4 śrubami do dołu” | **ZAŁOŻONE**: otwory są już nawiercone (25.10: „otowry są na razie nawierocne wiertłęm 2.5mm”), ale rodzaju wkrętów nikt nie potwierdził | |

Powerbanki i kabel USB-C są w sekcji 6, PIR i przycisk w sekcji 7.

## 4. Kaseta elektroniki (tacka v2)

| Element | Ilość | Gdzie i do czego | Źródło wymagania | Status | Mam? |
|---|---|---|---|---|---|
| **K1** ESP32-C3 SuperMini z pinami przylutowanymi w dół | 1 | na 2 słupkach 16 mm, klej termiczny albo CA, USB-C do przodu | [POL]; [POD] tacka v2 | **POTWIERDZONE**: [KAM] `20261026-234006.jpg` („taki mam espe”, 26.10); pomiar 26.10: „dlugosc eps z gnizdem 24, szer 18.4” | |
| **K2** Sterownik serw PCA9685, płytka HW-170 | 1 | na 4 słupkach Ø6 × 5, listwy kanałów do przodu | [POL]; [POD] tacka v2 | **POTWIERDZONE**: [KAM] `20261026-232954.jpg` (26.10); 26.10: „wymiary PCA sie zgadzają” | |
| **K3** Śruba M3 do PCA9685, długość nie podana (otwór Ø2,6 przelotowy przez słupek 5 i dno tacki 2,4; płytka 1,6) | 4 | słupki PCA9685, wkręcana w plastik | [POD] v1 „PCA9685 na słupkach (4 × M3)”; `40-cad/openscad/podstawka.scad` (`slupPcaH`, `kDno`) | **ZAŁOŻONE**: długości nie podaje żadna instrukcja; na [SZ] są M3x8 i M3x10 | |
| **K4** Wkręt do drewna 3 × 12 | 4 | tacka do dna ze sklejki 9 mm (wchodzi na 5 mm) | [POD] v2 „kaseta do dna: 4 wkręty 3 × 12” | **ZAŁOŻONE**: w rozmowach nikt nie potwierdził | |
| **K5** Opaska kablowa szer. ≤ 4 mm (tunel uchwytu 4,6 × 2,1) | 7 (5 na tacce, 2 przy PIR) | na tacce: 3 skrętki pod otworem płyty, przewód PIR przy wejściu z szufladki, przewody gniazda USB-C. Przy PIR: opaska przy płytce i luźna opaska zapasu do ścianki korpusu | [POD] tacka v2; `podstawka.scad` (`opW` 4, tunel 4,6 × 2,1); [POL] „PIR” | **ZAŁOŻONE**: w rozmowach nikt nie potwierdził | |
| **K6** Przewód Dupont żeński–żeński | 5 | 5V ESP → V+ kanału 9; G → GND kanału 9; GPIO8 → SDA, GPIO9 → SCL, 3V3 → VCC listwy bocznej PCA | [POL] „ESP32-C3 SuperMini”, „Zasilanie” | **POTWIERDZONE**: [KAM] `20261026-232954.jpg` (26.10): PCA9685 z przewodami Dupont F–F | |

## 5. Okablowanie dynia–podstawka

| Element | Ilość | Gdzie i do czego | Źródło wymagania | Status | Mam? |
|---|---|---|---|---|---|
| **W1** Kabel skrętka Ethernet, 8 żył: odcinki długie | 3 (lewa n = 0, prawa n = 4, duże oko n = 12); długości instrukcja nie podaje | z listew PCA przez otwór Ø60 w płycie i przez tuleję do keystone'ów w dyni; T568B | [PRD] §5; [POL] „Skrętki do dyni” | **POTWIERDZONE**: [PRD] §5 i `decyzje.md` 25.10: „Użytkownik: ma kabel i zaciskarkę” | |
| **W2** Gniazdo keystone RJ45 | 3 | w dyni, zarobione na końcu długiej skrętki (T568B) | [PRD] §5 (zmiana 27.10); [POL] | **POTWIERDZONE**: 26/27.10: „mam keystone”; `decyzje.md` 24.10: „keystone’y już kupione” | |
| **W3** Wtyk RJ45 8P8C do zaciśnięcia | 3 + zapas na nieudane zaciśnięcia | krótki odcinek skrętki od strony oczu, wpinany w keystone | [POL] „Skrętki do dyni” | **POTWIERDZONE**: 26/27.10, w odpowiedzi na pytanie o złącza RJ45: „mam koncówki do zarbaiania przwodów” | |
| **W4** Skrętka: krótki odcinek od keystone'a do oczu | 3; długości instrukcja nie podaje | z jednej strony wtyk RJ45, z drugiej żyły przylutowane wprost do przewodów serw (28.10) | [POL] | **POTWIERDZONE**: ten sam kabel co W1 | |
| **W5** Wtyczki odcięte z serw (3-pin), przylutowane do żył skrętki | 12 | po stronie PCA: A i C po 3 przewody, B i D tylko sygnał; po stronie oczu serwa przylutowane wprost do krótkiej skrętki, bez goldpinów | [POL] i `50-elektronika/montaz-elektroniki.md` (74d82f4) | **POTWIERDZONE**: użytkownik 28.10: „zakładałem, że skrętkę będziemy montować odcinając końcówki z serwomechanizmów” | |
| **W6** Kable Dupont męsko-żeńskie 20 cm, przecinane na pół (żeńskie połówki) | na 19 żeńskich końców (ESP, PIR, kondensator, przycisk) | połówka z wtykiem żeńskim na pin, drugi koniec lutowany, koszulka termokurczliwa | [POL] (74d82f4) | **POTWIERDZONE**: użytkownik 28.10: „większość kabli, które mam, to jest female to male DuPont… 20 centymetrowe” | |
| **W8** Kabel DFRobot do czujnika analogowego (wtyczka odcięta) | 1 | przewód PIR | [POL] (74d82f4) | **POTWIERDZONE**: użytkownik 28.10 | |
| **W7** Cyna | wg potrzeby | żyły skrętek do goldpinów, przewody przycisku, ewentualnie PIR i rezystor | [POL] („żyły lutowane do listew goldpin”) | **ZAŁOŻONE**: użytkownik lutował 19.10 („Zlutowałem też ukłąd”), ale zapasu cyny nikt nie potwierdził | |

## 6. Zasilanie

| Element | Ilość | Gdzie i do czego | Źródło wymagania | Status | Mam? |
|---|---|---|---|---|---|
| **Z1** Powerbank Baseus Airpow PPAP20K, 20 000 mAh, USB-C, 160 × 70 × 32 | 1 | w szufladce | [PRD] §5 | **POTWIERDZONE**: test na Baseusie 22.10 (`50-elektronika/dynia-v2-plan.md`: „Baseus odcinał prąd co ok. 15 s, test 22.10”) | |
| **Z2** Powerbank Manta MPB2001S, 20 000 mAh (zapas) | 1 | do wymiany | [PRD] §5 | **ZAŁOŻONE**: `sprzet.md` „Mamy”; 22.10: „mam jeszcze jeden mniejszy powerbank” (bez modelu) | |
| **Z3** Kabel USB-C – USB-C, krótki (wtyk ≤ 50 mm) | 1 | powerbank → gniazdo w tacce; przy zamkniętej szufladce ≥ 100 mm luzu | [POL] „Zasilanie”; [POD] krok 4 szufladki | **ZAŁOŻONE**: elektronika 26.10: „sprawdź, czy masz krótki”, odpowiedzi brak | |
| **Z4** Gniazdo USB-C panelowe wkręcane: gwint Ø11 ze ścięciami na 10, kołnierz Ø14, korpus 13, nakrętka 15,5 na rogach × 3, zaślepka, 2 przewody (czerwony, czarny) | 1 | w ściance tacki; czerwony → zacisk V+, czarny → GND PCA | [POL] „Zasilanie”; [POD] tacka v2 | **POTWIERDZONE**: [KAM] `20261026-010302.jpg` (26.10, kilka sztuk); pomiary użytkownika 26.10. Rezystorów 5,1 kΩ na CC nikt jeszcze nie sprawdził (pomiar 5 V, N20) | |
| **Z5** Kondensator elektrolityczny 470 µF / 10 V | 1 | piny kanału 8 PCA: „+” na V+, pasek na GND | [POL] „Zasilanie” | **POTWIERDZONE**: [KAM] `20261027-002633.jpg` (27.10): zestaw 120 kondensatorów, na etykiecie „470uF/10V x10szt” | |
| **Z6** Wtyk Dupont żeński na nóżki kondensatora | 2 | „Wszystkie połączenia w podstawce na wtykach Dupont” | [POL] | **ZAŁOŻONE**: sposobu podłączenia instrukcja nie opisuje | |
| **Z7** Rezystor 47 Ω / 3 W, korpus Ø6 × 17, nóżki osiowe (zapas, tylko gdy powerbank gaśnie) | 1 | na 2 słupkach tacki, nóżki przez otwory Ø1,4 | [POL] „Zasilanie”; [POD] tacka v2 | **ZAŁOŻONE**: 26.10: „dostarczono mi do paczkomatu zatem jutro bede je miał”; odbioru nikt nie potwierdził | |
| **Z8** Przewód od nóżek rezystora do zacisku V+/GND | 2 krótkie | tylko razem z Z7 | [POD] tacka v2 („tam lutujesz przewody do zacisku”) | **ZAŁOŻONE** | |

## 7. PIR i przycisk

| Element | Ilość | Gdzie i do czego | Źródło wymagania | Status | Mam? |
|---|---|---|---|---|---|
| **S1** Czujnik PIR HW-416A (klon HC-SR501) | 1 | we froncie szufladki, po prawej. Przed montażem: zworka na H, czas w lewo do oporu, czułość na środku | [PRD] §5; [POL] „PIR” | **POTWIERDZONE**: zdjęcia 25.10 (`70-budowa/zdjecia/2026-10-25-pir/`), próbka gniazda 26.10 | |
| **S2** Wkręt M2 × 6 | 2 | płytka PIR do podkładek frontu (otwory Ø1,7); krok 1 szufladki | [POD] „Śruby z magazynu” | **POTWIERDZONE**: 27.10: „mam m2x5 i m2x6”; próbka 26.10 przykręcona 2 × M2 (`70-budowa/zdjecia/2026-10-26-probka-pir/probka-pir-02.jpg`) | |
| **S3** Przewód 3-żyłowy do PIR (VCC, OUT, GND), bez złącza pośrodku | 1, ok. 350 mm (model); zapas ok. 150 mm zwinięty w pasie wtyku USB-C ([POL]) | VCC i GND → piny kanału 10 PCA, OUT → GPIO10 ESP; od strony tacki wtyki Dupont F | [POL] „PIR”; [POD] krok 4 szufladki | **ZAŁOŻONE**: rodzaju przewodu instrukcja nie podaje | |
| **S4** Przycisk chwilowy PBS-33B, Ø12, NO | 1 | prawy bok podstawki, 36 mm od tyłu, oś 32 mm nad stołem; wklejony epoksydem (P6), bez nakrętki | [PRD] §5; [POD] „Przycisk” | **POTWIERDZONE**: [KAM] `20261027-001028.jpg` (27.10); [PRD] §5: „posiadany” | |
| **S5** Przewód 2-żyłowy do przycisku | 1; długości instrukcja nie podaje | nóżka 1 → GPIO4 ESP, nóżka 2 → GND listwy bocznej PCA; prowadzony po tacce wzdłuż tylnego pasa; na przycisku lut, na drugim końcu Dupont F | [POL] „ESP32-C3 SuperMini”; [POD] „Przycisk” | **ZAŁOŻONE** | |

## 8. Montaż w dyni

| Element | Ilość | Gdzie i do czego | Źródło wymagania | Status | Mam? |
|---|---|---|---|---|---|
| **Y1** Dynia (ok. 10 kg) | 1 | otwory: duże oko ≤ Ø80, 8 × małe oko 63–64, Ø80 w dnie, wieczko (plan K3) | [PRD] §1, §5 | **POTWIERDZONE**: [PRD] 0.2 §5: „dynia kupiona” | |
| **Y2** Wkręt do drewna 4 × 30–40 | 4 | łapy kołnierza tuby dużego oka (otwory Ø4,5), od środka w miąższ; krok 11 | [DO] §2, [PRD] §4 | **ZAŁOŻONE**: w rozmowach nikt nie potwierdził | |
| **Y3** Klej do maskownicy (rodzaju instrukcja nie podaje) | wg potrzeby | maskownica Ø84 przyklejana z zewnątrz do skórki; krok 11 | [DO] §5 krok 11 | **ZAŁOŻONE** | |
| **Y4** Paski papieru ok. 0,9 mm (opcjonalnie) | kilka | w szczelinach słupek–tuba na czas klejenia | [DO] §5 krok 11 | **ZAŁOŻONE** | |
| **Y5** Wkręt do drewna 3 × 16 | 3 | tuleja z gwintem do płyty górnej, przez kołnierz | [POD] v2 „tuleja do płyty: 3 wkręty 3 × 16” | **ZAŁOŻONE**: w rozmowach nikt nie potwierdził | |

Moduł dużego oka wkleja się w tubę klejem na gorąco (D8). Skrętki idą przez tuleję (W1).

## 9. Narzędzia (wymienione w instrukcjach albo z nich wynikające)

| Element | Ilość | Gdzie i do czego | Źródło wymagania | Status | Mam? |
|---|---|---|---|---|---|
| **N1** Klucz imbusowy 2 mm | 1 | wkręty dociskowe M4 kardana; kroki 4–5 | [DO] §5 | **POTWIERDZONE**: kardany przyszły „w woreczku z kluczami imbusowymi” (zdjęcie 22.10, `30-projekt/e6-pomiary.md`) | |
| **N2** Klucz do wkrętu M3 ISO 7380 (imbus 2 mm) | 1 | trzpienie kardana; krok 1 | [DO] html („imbus lub wkrętak do M3 ISO 7380”) | **POTWIERDZONE**: trzpienie skręcone 27.10 | |
| **N3** Wkrętak krzyżakowy PH1 | 1 | wkręty orczyków MG90S (kroki 6, 8, 9); M2 × 6 (D4, S2), zależnie od łba | [DO] §5 | **POTWIERDZONE**: 19.10: „wwkrętak to M2 i M3 to głównie krzyżaki” (rozmiaru PH1 nikt nie potwierdził) | |
| **N4** Kombinerki | 1 | gięcie „Z” drutu Ø1 | [DO] §5 | **POTWIERDZONE**: zdjęcia 26.10 `70-budowa/zdjecia/2026-10-26-drut-z/` (manifest: „realne gięcie kombinerkami”) | |
| **N5** Szczypce do cięcia (obcinaczki) do drutu sprężynowego | 1 | cięcie drutu Ø1 i kołków; odcinanie łączników podpory płyty | [DO] §1, §5 | **ZAŁOŻONE** | |
| **N6** Pęseta | 1 | montaż dużego oka | [DO] §5 | **ZAŁOŻONE** | |
| **N7** Nożyk | 1 | zbieranie śladów podpór | [DO] §1 | **ZAŁOŻONE** | |
| **N8** Wiertło Ø1,0 (tylko gdy kołek nie wchodzi w otwór orczyka) | 1 | krok 2 | [DO] §5 krok 2 | **ZAŁOŻONE** | |
| **N9** Wiertarka albo wkrętarka | 1 | otwornice, wiertła | [M28] krok 9; [POD] | **POTWIERDZONE**: 25.10: „otowry są na razie nawierocne wiertłęm 2.5mm” | |
| **N10** Otwornica Ø80 | 1 | otwór dużego oka (tuba Ø79,5) i otwór Ø80 w dnie dyni | [PRD] §4; [POD] „Montaż elektroniki i dyni” krok 6 | **POTWIERDZONE**: 22.10: „jestemy ograniczeni otwornic 80” | |
| **N11** Otwornica 2½" (63,5 mm) albo nastawna do 64 mm | 1 | 8 otworów małych oczu, 63–64 mm | [M28] krok 9 | **ZAŁOŻONE**: `sprzet.md` „Mamy”: „nastawna do 64 mm” | |
| **N12** Wiertło Ø12 (ewentualnie rozwiercenie do Ø12,5) i klocek drewniany podkładany od środka | 1 + 1 | otwór przycisku w boku 18 mm, wiercony od zewnątrz | [POD] „Przycisk” | **ZAŁOŻONE** | |
| **N13** Wiertło Ø3,3 (otwór pilotowy na 22 mm w sklejce) | 1 | blokada P5 | [POD] „Blokada” | **ZAŁOŻONE** | |
| **N14** Klucze imbusowe do M4: 2,5 mm (ISO 7380, DIN 7991) i 3 mm (DIN 912) | wg łbów | rączka (przytrzymanie łba), śruby boczne, blokada; nie wiadomo, czy imbus sięga do blokady po postawieniu dyni | [POD] krok 3; review Fable D8 | **ZAŁOŻONE**: 19.10: „M4 to imbusy” (mowa o śrubach, nie o kluczach) | |
| **N15** Klucz płaski 7 | 1 | nakrętki M4 w kieszeni PIR | [POD] krok 3 szufladki | **ZAŁOŻONE** | |
| **N16** Lutownica | 1 | żyły skrętek do goldpinów, przycisk, ewentualnie PIR i rezystor | [POL] | **POTWIERDZONE**: 19.10: „Zlutowałem też ukłąd” | |
| **N17** Zaciskarka RJ45 | 1 | wtyki W3 | [PRD] §5 | **POTWIERDZONE**: [PRD] §5 i `decyzje.md` 25.10: „ma kabel i zaciskarkę” | |
| **N18** Narzędzie do zarabiania keystone'a (LSA), jeśli keystone nie jest beznarzędziowy | 1 | 3 keystone'y | [POL] (sposobu zarabiania nie opisuje) | **ZAŁOŻONE** | |
| **N19** Zaciskarka Dupont (tylko gdy W6 to zaciskane gniazda) | 1 | 24 żyły skrętek | [POL] | **ZAŁOŻONE** | |
| **N20** Multimetr | 1 | 5 V na przewodach gniazda USB-C z powerbanku (CC 5,1 kΩ); ok. 5 V na pinach kanału 9 przed podłączeniem ESP | [POL] „Kolejność uruchomienia”; `30-projekt/raport-elektronika.md` | **POTWIERDZONE**: 22/23.10: „mam multimetr” | |
| **N21** Komputer z arduino-cli i kabel USB-C do transmisji danych | 1 | wgranie `skan-i2c`, `kalibracja`, `dynia-v2`; kalibracja kanałów 12–15 dużego oka (krok 10) | [POL] „Kolejność uruchomienia”, „Szkice” | **POTWIERDZONE**: kalibracja małych oczu przez port 27.10 | |
| **N22** Mały wkrętak do potencjometrów PIR | 1 | ustawienie przed montażem | [PRD] §5; [POL] „PIR” | **ZAŁOŻONE** | |
| **N23** Suwmiarka | 1 | grubość ściany dyni (wybór tuby 30/40/50; małe oczy 15–25 mm), przymiarki trzpieni | [PRD] §4; [M28] krok 9 | **POTWIERDZONE**: zdjęcia z suwmiarką 25–27.10; 27.10: „jedne z mojch calipher mam uszkodzone” | |
| **N24** Miarka albo linijka | 1 | pomiar `hDoc` (dno wnętrza dyni nad płytą) przed drukiem tulei | [POD] „Montaż elektroniki i dyni” krok 6; `podstawka.scad` (`hDoc`) | **ZAŁOŻONE** | |
| **N25** Nóż | 1 | wieczko, wnętrze dyni, zestruganie miąższu wokół otworów małych oczu do 20–25 mm | [M28] krok 9; plan K3 | **ZAŁOŻONE** | |
| **N26** Marker | 1 | numer modułu (= kanał) na Pokrywie i wtyczce | [M28] „Seria modułów” krok 5 | **ZAŁOŻONE** | |

## 10. Części drukowane (nie są hardware'em, ale są potrzebne do złożenia)

| Element | Ilość | Gdzie i do czego | Źródło wymagania | Status | Mam? |
|---|---|---|---|---|---|
| **R1** Płyta dużego oka (druk pod 45° z podporą) | 1 | duże oko | [DO] §1 | **POTWIERDZONE**: 27.10: „plyty i galki nie bede ruszal” | |
| **R2** Gałka (biała) | 1 | duże oko | [DO] §1 | **POTWIERDZONE**: 27.10: „galka jestw porzadku” | |
| **R3** Trzpień kardana M3 | 2 (+2 zapasowe, warianty) | duże oko, krok 1 | [DO] §1 | **POTWIERDZONE**: 27.10: „mam dwa białe z wkrecona srubamia” | |
| **R4** Przedłużenie orczyka | 2 | powieki, krok 2 | [DO] §1 | **POTWIERDZONE**, że wydruk jest (zdjęcia 27.10 przy sklejaniu); plik zmieniony po uwadze użytkownika 27.10, nie wiadomo, czy wydrukowana jest wersja aktualna | |
| **R5** Powieka górna i powieka dolna | 1 + 1 | duże oko, krok 7 | [DO] §1 | **BRAK** aktualnej wersji: 27.10: „muszę wydrukować jeszcze raz powieki, bo powieki, które mi dałeś swego czasu, one nie mają uszu do drutów”; powieka dolna zmieniona 27.10 ok. 23:50 (otwór Ø1,6 pod M2) | |
| **R6** Tuba 30 / 40 / 50 | po 1 | duże oko w dyni | [DO] §1 | **BRAK** aktualnej wersji: pliki zmienione 27.10 ok. 23:50 (szczeliny 4,6 na łby M2) | |
| **R7** Maskownica | 1 | duże oko w dyni | [DO] §1 | **ZAŁOŻONE**: stan druku nieznany | |
| **R8** Szufladka v2: korpus, front, rączka | 1 + 1 + 1 | podstawka | [POD] v2 | **POTWIERDZONE**: 26.10: „wydrukowałem szufladę”; `70-budowa/dziennik.md` 26.10 | |
| **R9** Kaseta elektroniki (tacka v2) | 1 | podstawka | [POD] tacka v2 | **ZAŁOŻONE**: gotowa do druku 26.10 (`40-cad/3mf/Podstawka v2/Kaseta elektroniki.3mf`), wydruku nikt nie potwierdził | |
| **R10** Tuleja z gwintem i Nakrętka Ø130 | 1 + 1 | dynia na podstawce | [POD] „Montaż elektroniki i dyni” krok 6 | **BRAK**: do druku po pomiarze `hDoc` (plan P8 „do zrobienia”); według modelu najpierw próbka gwintu | |
| **R11** Gniazdo i Nakrętka małego oka v2.8 | 8 + 8 | małe oczy w dyni, [M28] kroki 9–10 | [M28] „Do druku” | **ZAŁOŻONE**: stan druku nieznany | |

## 11. Wycofane z instrukcji (nie są już potrzebne)

| Element | Było do | Status | Czym zastąpione w instrukcji |
|---|---|---|---|
| Śruba M5 × 8, łeb walcowy imbus ISO 4762 | trzpienie kardana (do 27.10) | **BRAK**: 27.10: „pokazałem Ci moją szafkę ze śrubami i tam nie było M5x8” | trzpień drukowany R3 z wkrętem D3 |
| Śruba M5 z łbem walcowym, każda długość | j.w. | **BRAK**: 27.10: „m5x16 jaką mam to śruba stożkowa”, „nie sróce tu śruby 16 mm” | j.w. |
| Drut Ø2,0 × 5,6 | osie powiek (do 27.10) | **BRAK**: 27.10: „a skad … mam drut 2x 5.6”; 22.10: druty „1 milimetr … 1,2. Albo 1,5 … 3 milimetry” | wkręt M2 × 6 (D4) |
| Filament 1,75 × 6 mm | osie powiek (wariant z 27.10 ok. 23:30) | użytkownik odrzucił 27.10: „montowanie czegokolwiek na krótkim odcinku druta, który ma 6 mm, jest po prostu błędem” | wkręt M2 × 6 (D4) |
| Łączniki RJ45 gniazdo–gniazdo | okablowanie w dyni | nie sprawdzano | keystone'y W2 ([PRD] §5, zmiana 27.10) |
| Breakout USB-C z 5,1 kΩ | zasilanie | nie sprawdzano | gniazdo wkręcane Z4 |
| Drugi przycisk, przełącznik zasilania | blokada, wyłączanie | nie kupiono | jeden przycisk S4; odcięcie prądu przez wypięcie USB-C ([PRD] §5, 27.10) |

**Posiadane, bez miejsca w aktualnych instrukcjach** (27.10): M5 × 16 stożkowe nierdzewne; M4 × 8 z łbem walcowym; M3 × 10 z łbem stożkowym („mam m3 o dlugosci 10 z lberm stozkowym”); M2 × 5. W dnie tacki są 4 zapasowe otwory Ø5,5 (M5 albo wkręt), ale żadna instrukcja ich nie wykorzystuje.

## 12. Luki w instrukcjach (brak elementu albo wymiaru)

- Długości 3 długich skrętek (W1), 3 krótkich odcinków (W4) i przewodu przycisku (S5).
- Mocowanie 3 keystone'ów w dyni: żadna instrukcja go nie opisuje.
- Długość śrub M3 do PCA9685 (K3).
- Zakończenie żył skrętki po stronie PCA (W6) i nóżek kondensatora (Z6).
- Rodzaj kleju do maskownicy na skórce dyni (Y3).
- Długość kołków z drutu Ø1 (D6).
- Zasięg kabli SG90 i MG90S do goldpinów przy keystone'ach. `sprzet.md` wymieniał „ewentualnie przedłużacze serw”, aktualne instrukcje ich nie przewidują.
- Zapas przewodu PIR podany różnie: ok. 350 mm z zapasem w [POD] krok 4, pętla 150 mm w [POL] (gałąź elektronika), 200 mm w `50-elektronika/polaczenia.md` na main.
- [DO] §7 nadal ma „Otwory osi Ø2,4 z drutem Ø2”, pozostałość po zmianie na M2 × 6.
- Zakończenie ogona drutu w uszku powieki jest nadal do decyzji użytkownika ([DO] §8). Nie zmienia listy części.
- [M28] krok 9 odsyła do `70-budowa/kompletacja-dyni.md`, ale tego pliku nie ma w repo.
