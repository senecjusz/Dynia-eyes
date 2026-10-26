// Podstawka pod dynię – model parametryczny (OpenSCAD 2021.01). v1: 25.10.2026, projektant podstawki; v2 (szufladka v2): 25.10.2026, wykonawca.
// Koncepcja: 20-analizy/2026-10-25-podstawka-koncepcja.md (v5.1 + łączniki RJ45 w dyni); opis modelu i zmian: 20-analizy/2026-10-25-podstawka-model.md.
// Wymagania: 30-projekt/PRD.md 0.2 §5 (wymiary wykonane podstawki, szufladka v2, PIR we froncie) – mają pierwszeństwo przed tym modelem.
// Układ: x w prawo (patrząc na dynię od przodu), y do tyłu, z w górę; początek = lewy przedni narożnik podstawki na stole. Wymiary w mm.
// Przednia płaszczyzna skrzynki (krawędzie ścianek, dna i płyty) = y 0. Szufladka: układ korpusu, x od lewego boku korpusu,
// y od przedniej ściany korpusu (front w y < 0), z od spodu dna korpusu (= wierzch dna ze sklejki).
// Zasada: każda liczba geometrii jest zmienną w sekcji „zmienne”; w modułach tylko zmienne, 0, ±1, 1/2 i kąty 90/120/180/360.
// Eksport: bash podstawka-eksport.sh albo
//   openscad -o <plik>.3mf -D 'czesc="Korpus"' -D 'tryb="druk"' podstawka.scad
//   czesc: Korpus | Front | Raczka | ProbkaPIR | Kaseta | Tuleja | Nakretka | ProbkaTuleja | ProbkaNakretka
//          | Plyta | ScianaBoczna | ScianaTylna | Dno | RysunekCiecia (sklejka) | parametry | zlozenie
//          | KolizjaZamknieta | KolizjaWsuwanie | KolizjaPIR | KolizjaWkladaniePIR | KolizjaSruby (kontrole: podstawka-kolizje.sh)
//   tryb:  druk (płaska strona na stole, z ≥ 0) | zlozenie (położenie w podstawce)
//
// SZUFLADKA v2 – rozstrzygnięcia techniczne wykonawcy (założenie → uzasadnienie):
// - korpus: ścianki sc 2,0 (brief PM), wnętrze = powerbank 160 + luz 1 + wtyk USB-C 50 (decyzja użytkownika) = 211, korpus 215,0;
//   luz w podstawce (216 − 215) / 2 = 0,5 na stronę (luzSzBok, pochodna). Tabela AGENTS.md: ślizgowe 0,25–0,3 – 0,5 zostawia zapas na sklejkę ±0,5.
// - front osobno, płyta tF 4 drukowana licem na stole: lico gładkie, otwory śrub pionowo na stole (okrągłe), kopułka PIR i blokada bez nawisów.
//   Front zakrywa otwór i zachodzi frontZak 14 na przednie krawędzie ścianek bocznych (szerokość 244 – jak czoło v1, mieści się na X1C 256),
//   od dołu kończy się frontNadStolem 1 nad stołem (zakrywa krawędź dna 9), od góry frontPodGora 1 poniżej wierzchu płyty (dynia stoi na płycie,
//   front jej nie dotyka) – zakładka na przednią krawędź płyty górnej 17 mm, w niej blokada.
// - front–korpus: 2 śruby rączki M4 (przez rączkę, front i przednią ścianę korpusu, nakrętki od środka w kieszeni PIR, z dala od powerbanku)
//   + 2 × M4 × 12 z łbem stożkowym (DIN 7991, użytkownik 26.10: „śruby z boku” stożkowe) przy dolnych rogach korpusu, łby w pogłębieniu
//   90° równo z licem frontu (front nie odstaje na brzegach przy szarpnięciu za rączkę); nakrętki M4 od środka w kieszeni PIR.
// - rączka (kształt i wielkość: decyzje użytkownika 25.10 – niska, nienachalna, mała, bo używana raz–dwa razy): ścięty ostrosłup
//   z zaokrąglonymi narożami R2 (lico płaskie – na stół), mniejsza podstawa 40 × 10 na froncie, większa 46 × 16 na zewnątrz, wysięg 10; podcięcie 3 mm daje
//   chwyt dwoma palcami. Na środku frontu (pod blokadą), daleko od kopułki PIR. Druk większą podstawą na stole (ścianki zbiegają się
//   ku górze, bez podpór). Łby M4 (Ø7 × 4) wklejone epoksydem w gniazda Ø8 od lica (szczelina na klej 0,5 – tabela AGENTS.md),
//   dostęp imbusem od lica; rozstaw 26; śruby M4 × 20 (ok. 4 mm za nakrętką).
// - blokada: M4 × 25 imbus przez front (Ø5: otwór pilotowy wiercony przez front przy wsuniętej szufladce – review Fable W2) w przednią krawędź
//   płyty górnej, na środku szerokości, w połowie grubości płyty; otwór pilotowy w sklejce Ø3,3 × 22 (25 − front 4 + 1 zapasu); gwint wycina
//   śruba (jak blokada v1).
// - po review (Fable, Astra 25.10): okno PIR w korpusie otwarte do górnej krawędzi (bez mostu 1 mm nad oknem); wycięcie 12 × 8 w górnej
//   krawędzi przegrody nad listwą PIR (przewody z wtyków Dupont skręcają w górę); fazki wejściowe 2 × 45° na tylnych pionowych narożach
//   korpusu; próbka gniazda PIR (60 × 40 wycinek frontu) do wydruku przed frontem – wymiary PIR są ze zdjęć (±1).
// - PIR HC-SR501 (pomiary ze zdjęć 25.10, PRD 0.2): kołnierz soczewki 23 × 23 × 3 w gnieździe 23,5 × 23,5 × 0,5 od tyłu frontu (luz 0,25 na stronę),
//   kopułka przez otwór Ø24; płytka 3,5 za frontem na 2 podkładkach 4 × 8 (użytkownik 26.10 po próbce: szersze, wyższe o 1; luty 1–2 mm
//   z przodu płytki mają 1,5–2,5 luzu, kołnierz 0,5 za tyłem frontu – płytkę ustawiają wkręty), dociśnięta 2 × M2 × 6 w podkładki frontu
//   (otwory Ø1,7 – jak oś powiek dużego oka; rozstaw pirOtwRozst 28,5 jako zmienna). Za płytką do przegrody 22 mm: elementy 8 + wtyki Dupont 20.
//   Przez przednią ścianę korpusu PIR przechodzi oknem 36 × 28 (płytka + 2 na stronę: kondensatory na rogach wystają poza obrys płytki).
// - kaseta elektroniki (tacka) v2 (26.10, uzgodnione z sesją elektroniki i użytkownikiem): zamiast ramki płaskiego breakoutu USB-C pionowa
//   ścianka z otworem pod panelowe gniazdo USB-C wkręcane (gwint z nakrętką; WYMIARY GNIAZDA DO POMIARU – do tego czasu tacki nie drukować),
//   wejście do przodu; bez pierścienia kondensatora (1000 µF lutowany do PCA9685); miejsce na rezystor 3 W ≥ 5 nad dnem na 2 uchwytach
//   z tunelem na opaskę; uchwyty opasek: 3 skrętki przed PCA9685, przewód PIR (pętla na wysuw szufladki). Położenie gniazda i piasty jak v1.
//   wycięcie kablowe korpusu liczone od gniazda kasety. Przy dnie 9 wkręt 3 × 12 wchodzi w dno na 5 mm (zostaje 4).
// - ścianka tylna skrzynki 18 (założenie: jak v1; pomiar użytkownika: głębokość całkowita 226).

czesc = "zlozenie";
tryb = "zlozenie";

// ===================== zmienne =====================
// BAZOWE: części kupne, luzy z tabeli AGENTS.md, pomiary podstawki i decyzje (rozmiary, odstępy). POCHODNE: położenia i wymiary wynikowe.
// Test zginania: podstawka-zginanie.sh (warianty w 20-analizy/2026-10-25-podstawka-model.md, sekcja v2).

// ---------- BAZOWE: dynia (mierzone przy montażu) ----------
hDoc     = 45;      // wysokość dna wnętrza dyni przy otworze nad wierzchem płyty (mierzona, gdy dynia stoi na płycie)
nadDnem  = 10;      // tuleja wystaje ponad dno wnętrza (nakrętka + 2)
otwDyni  = 80;      // otwór w dnie dyni (otwornica 80)
// ---------- BAZOWE: podstawka ze sklejki – stan wykonany (pomiary użytkownika 25.10, PRD 0.2 §5) ----------
WIN      = 216;     // szerokość wnętrza (zmierzona przy froncie i z tyłu)
H_IN     = 40;      // wysokość wnętrza (ścianki na dnie)
tDno     = 9;       // dno ze sklejki (szufladka i kaseta stoją na dnie)
tPl      = 18;      // płyta górna i ścianki boczne
tTyl     = 18;      // ścianka tylna (założenie: jak v1)
DL       = 226;     // głębokość podstawki (pomiar użytkownika)
dOtwPl   = 60;      // otwór w płycie górnej (zmierzony Ø60–61)
wkrPlOd  = 20;      // 4 wkręty płyty górnej w ścianki boczne: od przodu i tyłu (w osi ścianki)
dWkretSkl = 3.5; dLebSkl = 6.5;                  // otwór przelotowy w sklejce lub w druku i pogłębienie łba
// ---------- BAZOWE: powerbank Baseus i kabel ----------
pbL = 160; pbW = 70; pbH = 32;          // PRD §5; USB-C na środku krótszej ścianki
wtyk     = 50;      // wtyk USB-C z osłoną i gięciem kabla (decyzja użytkownika 25.10: zostaje 50)
// ---------- BAZOWE: PIR HC-SR501 (pomiary ze zdjęć 25.10, PRD 0.2; ±1 mm) ----------
pirW = 32; pirH = 24; pirT = 1.5;                // płytka
pirKol = 23; pirKolH = 3;                        // kwadratowy kołnierz soczewki: bok, wysokość od płytki
pirKopD = 23; pirKopH = 14;                      // kopułka: średnica, wysięg od płytki (z kołnierzem)
pirTyl = 8;                                      // elementy za płytką (kondensatory, listwa, zworka)
pirDupont = 20;                                  // wtyki Dupont na listwie: wysięg za płytką (PRD: ok. 20)
pirLut = 2; pirLutStrefa = 4;                    // luty od strony soczewki: wysokość (1–2), pas przy górnej i dolnej krawędzi płytki (zdjęcia pir-03, pir-08)
pirRogi = 1.5;                                   // kondensatory na rogach wystają poza obrys płytki (szacunek ze zdjęć)
pirOtwRozst = 28.5; dPirOtw = 2;                 // otwory montażowe płytki: rozstaw (28–29, do pomiaru), Ø
pirLstW = 8; pirLstH = 3;                        // listwa 3-pin na górnej krawędzi płytki (pod wtyki Dupont): szerokość, wysokość
// ---------- BAZOWE: śruby z magazynu (PRD §7) ----------
dM4 = 4.5; dLebM4 = 7; hLebM4 = 4; sM4 = 7; hNakM4 = 3.2; tPodkM4 = 0.8;   // M4 imbus z łbem okrągłym: luźny otwór, łeb, nakrętka (klucz 7), podkładka
dM3 = 3.3; dM3ciasny = 2.6; sM3 = 5.5; hNakM3 = 2.4; dLebM3 = 5.5; hLebM3 = 3;
dM2c = 1.7; dLebM2 = 3.8; hLebM2 = 1.6;           // M2 × 6 w plastik (otwór ciasny jak oś powiek dużego oka), łeb
lM2 = 6; lFk = 12; lM4r = 20; blokL = 25;        // długości śrub: M2 PIR, M4 stożkowa front–korpus (z łbem), M4 rączki, M4 blokady
dLebStoz = 8; luzStoz = 0.2;                     // łeb stożkowy M4 (DIN 7991: Ø8, 90°), luz pogłębienia na promieniu
// ---------- BAZOWE: druk – korpus szufladki ----------
szMax = 215;        // PRD 0.2: korpus ≤ 215
sc = 2.0; dnoSz = 2; scH = 30;                   // ścianka (brief PM: 2,0), dno, wysokość ścianek
kieszenPIR = 27;    // przednia kieszeń korpusu (PIR, nakrętki rączki): od tyłu frontu do przegrody
slupekW = 4; slupekH = 12; slupekL = 8;          // słupki zatrzymujące powerbank z prawej
wcCiecie = 12; wcDno = 10;                       // wycięcie na kable w tylnej ściance: szerokość, wysokość dna nad dnem szufladki
przWyc = 12; przWycH = 8;                        // wycięcie w górnej krawędzi przegrody nad listwą PIR: szerokość, głębokość
fazaKorp = 2;                                    // fazka wejściowa tylnych pionowych naroży korpusu
oknoPIRzap = 3;     // okno PIR w przedniej ścianie korpusu: zapas wokół płytki (≥ pirRogi; 3 – review Fable r2: wysięg kondensatorów tylko ze zdjęć)
fkOd = 10; fkZ = 8;                              // śruby boczne front–korpus: od boku korpusu, wysokość nad spodem korpusu
// ---------- BAZOWE: druk – front ----------
tF = 4;             // grubość frontu
frontZak = 14;      // zakładka frontu na przednie krawędzie ścianek bocznych
frontNadStolem = 1; // dół frontu nad stołem
frontPodGora = 1;   // góra frontu poniżej wierzchu płyty górnej
pirOdPrawej = 40;   // oś PIR od prawego boku korpusu (decyzja użytkownika 25.10: PIR po prawej – przewód prosto do tyłu pasem wtyku USB-C)
pirGn = 23.5; pirGnG = 0.5;                      // gniazdo kołnierza od tyłu frontu: bok (kołnierz 23 + 2 × 0,25), głębokość
dKopOtw = 24;       // otwór na kopułkę (PRD 0.2)
slupM2D = 4.5;      // szerokość strefy wokół otworu M2 (wyłączona z brył elementów PIR)
pirPadW = 4; pirPadH = 8; pirPadT = 3.5;         // podkładki M2 pod płytkę PIR (użytkownik 26.10 po próbce: szersze niż okrągłe, wyższe o ok. 1): szerokość (w poprzek paska), wysokość (wzdłuż paska), wysokość od frontu
glM2 = 5;           // otwór M2 w słupku (od czoła słupka); M2 × 6 wchodzi 4,5
// ---------- BAZOWE: druk – rączka ----------
rRozst = 26;        // rozstaw śrub rączki
rL1 = 40; rH1 = 10;                              // mniejsza podstawa (na froncie): długość, wysokość
rL2 = 46; rH2 = 16;                              // większa podstawa (lico): długość, wysokość
rD = 10;            // wysięg rączki od frontu
rR = 2;             // zaokrąglenie krawędzi
raczkaDx = 0;       // przesunięcie rączki w prawo od środka frontu
luzKlej = 0.5;      // szczelina na klej wypełniający (AGENTS.md) – łeb M4 w rączce
// ---------- BAZOWE: blokada (PRD 0.2: M4 na środku górnej krawędzi frontu, w przednią krawędź płyty górnej) ----------
dBlokPilot = 3.3; blokZapas = 1;                 // otwór pilotowy w sklejce (jak pod gwintownik M4), zapas głębokości
dBlokF = 5;         // otwór blokady we froncie (wiercenie pilota przez front; łeb Ø7 ma 1 mm oparcia)
probkaPirW = 60; probkaPirH = 40;                // próbka gniazda PIR: wycinek frontu
// ---------- BAZOWE: mocowanie kasety do dna ----------
wkrDnoL = 12; kPiastaD = 9; kPiastaOd = 8;       // wkręty 3 × 12 w dno, piasty pod łby, od brzegów kasety
kPiastaH = 4.6;     // kaseta v1 bez zmian (12 − (6 − 1) − 2,4 przy dnie 6); przy dnie 9 wkręt wchodzi w dno na wkrDnoL − kDno − kPiastaH = 5
// ---------- BAZOWE: druk – kaseta elektroniki (v1 bez zmian) ----------
pcaL = 62; pcaW = 25; pcaOtwX = 55.9; pcaOtwY = 19.05; dPcaOtw = 3;   // PCA9685: płytka, rozstaw i Ø otworów
espL = 24; espW = 18.4; espH = 4; espUsbWyst = 1.5;                   // ESP32-C3 SuperMini: długość z gniazdem USB-C, szerokość (pomiar użytkownika 26.10); gniazdo USB wystaje przed płytkę (założenie: 24 − 22,5)
pcaPom = true;                                                        // PCA9685 62 × 25, otwory 55,9 × 19: zgodne z pomiarem użytkownika 26.10
kW = 170; kD = 100; kDno = 2.4; kScH = 10; kSc = 2.4;   // szerokość, głębokość, dno, niskie boki, ścianka (v1)
kTylH = 25; kTylT = 3;                           // tylny pas (ogranicznik o ściankę tylną)
slupPcaD = 6; slupPcaH = 5;                      // słupki PCA9685
espRama = 1.5; espRamaH = 4;                     // ramka ESP32-C3
pcaX0 = 75; pcaY0 = 45;                          // PCA9685: lewy przedni narożnik płytki na tacce (listwy kanałów do przodu – w stronę tulei, zacisk do tyłu; elektronika 26.10)
pcaPrzod = 25;                                   // wolne miejsce przed listwą kanałów (kondensator i przewody 5 V na kanałach 8–11)
espOdBoku = 15;                                  // ESP32-C3 z przodu po lewej, USB-C do przodu (lewy przedni narożnik płytki)
espPodH = 16; espPodW = 11; espPodD = 3; espLip = 1;   // podstawka ESP klejonego (elektronika 26.10: piny w dół z Dupontami, bez płytki stykowej): wysokość słupków, szerokość górnej powierzchni pod klej (mniej niż 18 – na 18 weszłyby wtyki narożnych pinów), głębokość pod krótką krawędzią, wysokość rantu z tyłu
espRzedy = 15.2;                                 // rozstaw rzędów pinów ESP32-C3 SuperMini (wzdłuż długich boków)
bkGn = 9.5;                                      // wyjście gniazda USB-C ESP32-C3 w ramce (8,94 + luz)
bkX = 157.1; bkY = 48;                           // oś i przód gniazda zasilania w kasecie (jak v1: wycięcie kablowe szufladki na tej osi, przed gniazdem miejsce na wtyk)
// ---------- BAZOWE: tacka v2 – gniazdo panelowe USB-C (ZAŁOŻENIA do pomiaru użytkownika), rezystor, opaski ----------
gnGwintD = 11; gnGwintFlat = 10;                // gwint gniazda: średnica, wymiar w poprzek 2 ścięć „podwójne D” (pomiar użytkownika 26.10)
luzGn = 0.15;       // luz otworu na gwint (na stronę; otwór 11,3 / 10,3 – propozycja elektroniki)
gnT = 3;            // grubość ścianki pod nakrętkę (≤ 7 według elektroniki; 3 – zostaje gwint na nakrętkę 2–3)
gnNakE = 15.5;      // nakrętka gniazda: wymiar na rogach (pomiar użytkownika 27.10; grubość ok. 3)
gnWolneD = 18;      // wolny okrąg za ścianką na nakrętkę i obrót klucza albo palców (elektronika 27.10)
gnKolD = 14;        // kołnierz gniazda z przodu ścianki (pomiar 26.10)
gnKorpL = 13;       // korpus gniazda od kołnierza do końca (pomiar 26.10); przewody z tyłu
gnMarg = 3;         // ścianka wokół kołnierza / nakrętki (w bok i nad); 3 – ścianka mieści się w tacce na osi wycięcia wydrukowanego korpusu
gnZebroL = 8;       // żebra za ścianką (długość w y)
wtykSzer = 14;      // wtyk USB-C kabla C–C z osłoną: szerokość (typowa, szacunek) – strefa przed gniazdem wolna od uchwytów
rezL = 17; rezD = 6; rezRozst = 25; rezNad = 8;  // rezystor 47 Ω / 3 W (zapas, elektronika 26.10): korpus Ø6 × 17, nóżki osiowe; rozstaw słupków; korpus ≥ 8 nad dnem (grzeje się do 55–60 °C – nie dotyka PLA)
rezSlupW = 5; dRezNoga = 1.4;                    // słupek: przekrój, otwór na nóżkę (Ø ok. 0,8–1 + luz; poziomy, drukowany jako łza)
rezOdst = 5;                                     // korpus rezystora od ścianek i przewodów
rezX = 32; rezY0 = 68;                           // położenie rezystora: oś x, oś pierwszego słupka (drugi o rezRozst dalej w y) – z tyłu po lewej
opW = 4; opT = 1.5; opLuz = 0.3;                 // opaska kablowa: szerokość, grubość, luz tunelu
uchL = 8; uchD = 8; uchH = 5;                    // uchwyt opaski: długość (wzdłuż tunelu), szerokość (wzdłuż kabla), wysokość
uchSkretkiY = 12; uchSkretkiX = [55, 75, 95];    // uchwyty skrętek pod otworem w płycie, przed strefą wolną przed PCA9685 (kabel wzdłuż y)
uchPirXY = [142, 10];                            // uchwyt przewodu PIR przy wejściu z szufladki (kabel wzdłuż x, do ESP32-C3)
uchGnXY = [140, 88];                             // uchwyt przewodów gniazda USB-C w drodze do zacisku PCA9685 (kabel wzdłuż x)
zapW = 20; zapL = 30; zapRozst = 25; zapX = 55; zapY0 = 64;   // miejsce zapasowe na małą płytkę (elektronika 26.10): 20 × 30, 2 słupki M3 Ø2,6 w rozstawie 25 wzdłuż y; oś x, przód płytki
// ---------- BAZOWE: gwint (jak próbka E2.0: 45°, skok 5, zarys 2,0) ----------
skok = 5; zarys = 2; zabRdzen = 4.8;             // ząb u rdzenia (szerokość osiowa)
gwKrok = 3;                                      // rozdzielczość helisy zwoju [°]
gwD = 76;                                        // średnica zewnętrzna gwintu tulei
// ---------- BAZOWE: tuleja i nakrętka ----------
tulRw = 32;                                      // promień otworu na kable (Ø64)
kolR = 60; kolT = 3;                             // kołnierz
wkretR = 50; dWkret = 3.5; dLebWkretu = 6.5;     // 3 wkręty 3 × 16 w płytę
fazaTul = 2;                                     // fazka wejścia na górze tulei
nakR = 65; nakH = 8; fazaNak = 1;                // nakrętka: promień opisany sześciokąta, wysokość, fazka otworu
probkaH = 15; probkaKolR = 45; probkaNakR = 45;  // próbka gwintu
// ---------- BAZOWE: luzy (AGENTS.md) ----------
luzPb    = 1;       // powerbank w komorze – na stronę
luzSlizg = 0.3;     // ESP w ramce
luzGwint = 0.20;    // gwint 45° skok 5 (próbka E2.0)
odstSzKas = 2;      // szufladka – kaseta (minimum)
luzKasTyl = 1;      // kaseta – ścianka tylna
luzKasBok = 1;      // kaseta – prawa ścianka boczna
zak = 0.01;         // zakładka brył (elementy na dnie wchodzą w dno, żeby siatka była jedną bryłą)
// ---------- BAZOWE: kontrole ----------
wysuwy = [0, 30, 60, 90];                        // położenia szufladki przy kontroli wsuwania (wysunięcie)
drogaPIR = 30;                                   // droga frontu z PIR przy wkładaniu w korpus
odsun = 0.01;                                    // odsunięcie powierzchni styku w kontrolach (styk ≠ kolizja)

// ===================== POCHODNE =====================
SZ     = WIN + 2 * tPl;                          // szerokość podstawki (252)
szNad  = tDno;                                   // spód korpusu nad stołem
luzPodPl = H_IN - dnoSz - pbH;                   // od wierzchu powerbanku do spodu płyty (6)
Z_PL   = tDno + H_IN + tPl;                      // wierzch płyty (67)
szInW  = luzPb + pbL + wtyk;                     // wnętrze korpusu w x (211)
szW    = szInW + 2 * sc;                         // 215,0
luzSzBok = (WIN - szW) / 2;                      // luz korpusu w podstawce na stronę (0,5)
pbY0   = kieszenPIR + sc + luzPb;                // początek powerbanku w y (29)
szD    = pbY0 + pbW + luzPb + sc;                // głębokość korpusu (102)
szX0   = tPl + luzSzBok;                         // położenie korpusu w podstawce (18,5)
kX0    = SZ - tPl - luzKasBok - kW;              // kaseta przy prawej ściance (63)
kY0    = DL - tTyl - luzKasTyl - kD;             // przód kasety (107)
xPort  = sc + luzPb + pbL;                       // czoło portu powerbanku (x w korpusie)
wcX    = kX0 + bkX - szX0 - wcCiecie / 2;        // wycięcie kablowe w korpusie: na osi gniazda zasilania kasety
pirX   = szW - pirOdPrawej;                      // oś PIR w korpusie (175)
pirZ   = dnoSz + scH / 2;                        // oś PIR nad spodem korpusu (17)
pirYp  = pirPadT;                                // przód płytki PIR za tyłem frontu = wysokość podkładek (3,5); kołnierz 0,5 za tyłem frontu, płytkę ustawiają wkręty M2
oknoW  = pirW + 2 * oknoPIRzap; oknoH = pirH + 2 * oknoPIRzap;   // okno PIR w przedniej ścianie korpusu (36 × 28)
frontW = WIN + 2 * frontZak;                     // szerokość frontu (244)
frontX0 = szW / 2 - frontW / 2;                  // lewa krawędź frontu w układzie korpusu
frontZ0 = frontNadStolem - szNad;                // dół frontu (układ korpusu)
frontZ1 = Z_PL - frontPodGora - szNad;           // góra frontu (układ korpusu)
blokZ  = tDno + H_IN + tPl / 2 - szNad;          // oś blokady: połowa grubości płyty górnej (układ korpusu)
blokOtwG = blokL - tF + blokZapas;               // otwór pilotowy w krawędzi płyty (22)
rcX    = szW / 2 + raczkaDx;                     // środek rączki (x korpusu)
rcZ    = dnoSz + scH / 2;                        // oś śrub rączki (z korpusu)
rX     = [rcX - rRozst / 2, rcX + rRozst / 2];   // osie śrub rączki
fkX    = [fkOd, szW - fkOd];                     // osie śrub bocznych front–korpus
hStoz  = (dLebStoz + 2 * luzStoz - dM4) / 2;     // głębokość pogłębienia 90° (1,95)
lM4min = rD - hLebM4 + tF + sc + tPodkM4 + hNakM4;   // śruba rączki pod łbem do końca nakrętki (21)
cx = SZ / 2; cy = DL / 2;                        // środek dyni = środek podstawki
rc     = gwD / 2 - zarys;                        // promień rdzenia gwintu
tulH   = hDoc + kolT + nadDnem;                  // wysokość tulei nad płytą: dynia leży na kołnierzu (hDoc mierzone bez tulei)

assert(szW <= szMax, "korpus szerszy niż 215 (PRD 0.2)");
assert(luzSzBok >= 0.25, "luz korpusu w podstawce < 0,25 na stronę");
assert(szD + odstSzKas <= kY0, "korpus wchodzi na kasetę");
assert(luzPodPl >= 2, "powerbank za blisko płyty");
assert(pirZ - oknoH / 2 >= dnoSz && pirZ + oknoH / 2 <= dnoSz + scH, "okno PIR poza przednią ścianą korpusu");
assert(pirX - oknoW / 2 >= sc && pirX + oknoW / 2 <= szW - sc, "okno PIR poza korpusem");
assert(pirX - przWyc / 2 >= xPort + luzPb + slupekW, "wycięcie przegrody nad powerbankiem (PIR ma być w pasie wtyku)");
assert(abs(pirX - rcX) > oknoW / 2 + rL2 / 2, "rączka nachodzi na PIR");
assert(rRozst / 2 + dLebM4 / 2 + luzKlej + rR <= rL1 / 2, "łby M4 poza mniejszą podstawą rączki");
assert(rL1 <= rL2 && rH1 <= rH2, "rączka: mniejsza podstawa większa niż lico");
for (x = fkX) assert(abs(x - pirX) > oknoW / 2 + sM4 / cos(30) / 2, "śruba boczna front–korpus nachodzi na okno PIR");
assert(fkZ - sM4 / cos(30) / 2 >= dnoSz, "nakrętka śruby bocznej wchodzi w dno korpusu");
assert(hStoz < tF, "pogłębienie łba stożkowego głębsze niż front");
assert(lFk >= tF + sc + tPodkM4 + hNakM4, "śruba boczna za krótka");
assert(pirYp + pirT + pirDupont + 2 <= kieszenPIR, "za płytką PIR brak miejsca na wtyki Dupont");
assert(pirYp >= pirLut + odsun, "luty PIR dotykają frontu");
assert(pirYp >= pirKolH - pirGnG, "kołnierz soczewki dociska front zamiast podkładek");
assert(pirPadH / 2 + 1 <= pirH / 2 - pirLutStrefa, "podkładka M2 wchodzi na pas lutów");
assert(pirOtwRozst / 2 - pirPadW / 2 >= pirGn / 2 + 0.5, "podkładka M2 nachodzi na gniazdo kołnierza");
assert(lM4min <= lM4r, "śruba rączki za krótka");
assert(hLebM4 + luzKlej < rD, "gniazdo łba M4 głębsze niż rączka");
assert(frontZ1 - blokZ >= dLebM4 / 2 + 1, "łeb blokady wystaje nad front");
assert(frontW <= 256, "front nie mieści się na X1C");
assert(wcX >= sc && wcX + wcCiecie <= szW - sc, "wycięcie kablowe poza tylną ścianą korpusu");
assert(szD + wtyk <= kY0 + bkY, "wtyk USB-C nie mieści się przed gniazdem kasety");
assert(gwD / 2 < otwDyni / 2, "tuleja nie wchodzi w otwór dyni");
assert(dOtwPl < 2 * tulRw, "otwór w płycie większy niż w tulei");
assert(kW <= WIN, "kaseta szersza niż wnętrze");
assert(rc - tulRw >= 2, "ścianka tulei < 2");
gnObrys = max(gnWolneD, gnNakE, gnKolD);         // największy okrąg wokół osi gniazda (wolne miejsce na nakrętkę)
gnOsZ  = kDno + gnObrys / 2 + 1;                 // oś gniazda nad spodem tacki
gnScW  = gnObrys + 2 * gnMarg;                   // szerokość ścianki gniazda
gnScH  = gnOsZ + gnObrys / 2 + gnMarg;           // wysokość ścianki
assert(bkX + gnScW / 2 <= kW, "ścianka gniazda poza tacką");
assert(gnScW / 2 - kSc >= gnWolneD / 2, "żebra za ścianką wchodzą w wolny okrąg nakrętki");
assert(gnT <= gnKorpL - 3 - 3, "ścianka za gruba na nakrętkę na gwincie");
assert(bkY + gnT + gnKorpL <= kD - kTylT, "korpus gniazda opiera się o tył tacki");
assert(gnScH <= H_IN - 2, "ścianka gniazda za wysoka pod płytą");
assert(pcaX0 + pcaL + 3 <= bkX - gnScW / 2 || pcaY0 >= bkY + gnT + gnZebroL + 2, "PCA9685 nachodzi na ściankę gniazda");
assert(pcaY0 + pcaW <= kD - kTylT - 2, "PCA9685 nachodzi na tylny pas");
assert(pcaY0 - pcaPrzod >= uchSkretkiY + uchD / 2, "uchwyty skrętek w wolnej strefie przed PCA9685");
rezOsZ = kDno + rezNad + rezD / 2;               // oś rezystora nad spodem tacki
assert(rezX + rezD / 2 + rezOdst <= pcaX0 && rezY0 - rezSlupW / 2 >= espOdBoku + espL + 2 * espRama + 3, "rezystor nachodzi na PCA9685 albo ESP32-C3");
assert(espPodW <= espRzedy - 2.54 - 1, "słupki ESP wchodzą pod wtyki Dupont rzędów pinów");
assert(kDno + espPodH + 1.6 + 4 <= H_IN - 5, "ESP za wysoko pod płytą");
assert(rezX - rezD / 2 - rezOdst >= kSc, "rezystor za blisko lewej ścianki");
assert(rezY0 + rezRozst + rezSlupW / 2 <= kD - kTylT, "słupek rezystora wchodzi w tylny pas");
assert((rezRozst - rezSlupW - rezL) / 2 >= 1, "rezystor nie mieści się między słupkami");
assert(kD - kTylT - (rezY0 + (rezRozst + rezL) / 2) >= rezOdst - 1, "rezystor za blisko tylnego pasa");
assert(uchPirXY[0] + uchD / 2 + 1 <= bkX - wtykSzer / 2, "uchwyt PIR w strefie wtyku USB-C");
assert(zapX - zapW / 2 >= rezX + rezD / 2 + rezOdst && zapX + zapW / 2 + 3 <= pcaX0 && zapY0 + zapL <= kD - kTylT, "miejsce zapasowe nachodzi na rezystor, PCA9685 albo tylny pas");
assert(uchGnXY[1] - uchL / 2 >= pcaY0 + pcaW + 3 && uchGnXY[0] + uchD / 2 + 2 <= bkX - gnGwintD / 2, "uchwyt przewodów gniazda nachodzi na PCA9685 albo korpus gniazda");

// ===================== gwint =====================
// Zwój = profil zęba (r, z) przeciągnięty po helisie (prawej: z rośnie z kątem przeciwnie do wskazówek zegara, patrząc z góry).
// Ząb tulei: u rdzenia rc szerokość zabRdzen, flanki 45°, wierzchołek rc + zarys. Rowek nakrętki: ten sam ząb odsunięty o luz
// prostopadle do flank (flanka 45° → przesunięcie osiowe luz·√2), dno rowka rc + zarys + luz (jak próbka E2.0).
// Krawędź wewnętrzna profilu leży na promieniu, na którym sąsiednie zwoje się nie stykają (szerokość profilu < skok).
function profilZeba(luz) = let(s = luz * sqrt(2), rIn = rc + max(luz, s - (skok - zabRdzen) / 2 + zak) - zak)
  [[rIn, (rIn - rc) - s], [rc + zarys + luz, zarys + luz - s], [rc + zarys + luz, zabRdzen - zarys - luz + s], [rIn, zabRdzen - (rIn - rc) + s]];
function rWewProfilu(luz) = profilZeba(luz)[0][0];
module zwoj(prof, z0, obroty) {
  n = len(prof); k = round(obroty * 360 / gwKrok);
  pts = [for (i = [0 : k]) let(t = i * gwKrok) for (p = prof) [p[0] * cos(t), p[0] * sin(t), z0 + t * skok / 360 + p[1]]];
  polyhedron(pts, concat(
    [for (i = [0 : k - 1], j = [0 : n - 1]) [i * n + j, (i + 1) * n + j, (i + 1) * n + (j + 1) % n, i * n + (j + 1) % n]],
    [[for (j = [0 : n - 1]) j], [for (j = [n - 1 : -1 : 0]) k * n + j]]), convexity = 10);
}
module gwintZew(h) intersection() {   // tuleja: rdzeń + zwój, przycięte do 0…h, fazka 45° na górze
  union() { cylinder(r = rc + zak, h = h, $fn = 360 / gwKrok); zwoj(profilZeba(0), -skok, h / skok + 2); }
  cylinder(h = h, r1 = gwD / 2 + h - fazaTul, r2 = gwD / 2 - fazaTul, $fn = 360 / gwKrok);
}
module gwintWew(h) union() {          // nakrętka: otwór (rdzeń + rowek z luzem), dłuższy o skok z obu stron
  translate([0, 0, -skok]) cylinder(r = rWewProfilu(luzGwint) + zak, h = h + 2 * skok, $fn = 360 / gwKrok);
  zwoj(profilZeba(luzGwint), -2 * skok, h / skok + 4);
}

// ===================== części drukowane =====================
module tuleja(h = tulH, kR = kolR, zWkrety = true) {
  difference() {
    union() {
      cylinder(r = kR, h = kolT, $fn = 120);
      gwintZew(h);
    }
    translate([0, 0, -1]) cylinder(r = tulRw, h = h + 2, $fn = 120);
    if (zWkrety) for (a = [0 : 120 : 359]) rotate(a) translate([wkretR, 0, -1]) {
      cylinder(d = dWkret, h = kolT + 2, $fn = 24);
      translate([0, 0, 1 + kolT - (dLebWkretu - dWkret) / 2]) cylinder(d1 = dWkret, d2 = dLebWkretu, h = (dLebWkretu - dWkret) / 2 + 0.01, $fn = 24);
    }
  }
}

module nakretka(r = nakR, h = nakH) {
  difference() {
    cylinder(r = r, h = h, $fn = 6);
    gwintWew(h);
    for (z = [0, h]) translate([0, 0, z]) mirror([0, 0, z > 0 ? 1 : 0])   // fazki wejścia z obu stron
      translate([0, 0, -1]) cylinder(h = fazaNak + 1, r1 = gwD / 2 + luzGwint + fazaNak + 1, r2 = rc, $fn = 120);   // kończy się w otworze, bez wspólnych powierzchni
  }
}

module kaseta() {   // układ kasety: x od lewego boku, y od przodu kasety
  difference() {
    union() {
      cube([kW, kD, kDno]);
      for (x = [0, kW - kSc]) translate([x, 0, 0]) cube([kSc, kD, kScH]);
      translate([0, kD - kTylT, 0]) cube([kW, kTylT, kTylH]);                       // tylny pas
      translate([pcaX0, pcaY0, kDno - zak])                                         // słupki PCA9685
        for (dx = [0, pcaOtwX], dy = [0, pcaOtwY]) translate([(pcaL - pcaOtwX) / 2 + dx, (pcaW - pcaOtwY) / 2 + dy, 0])
          cylinder(d = slupPcaD, h = slupPcaH + zak, $fn = 24);
      espPodstawka();                                                                 // ESP32-C3 na 2 podpórkach, piny z Dupontami w dół
      translate([bkX - gnScW / 2, bkY, kDno - zak]) cube([gnScW, gnT, gnScH - kDno + zak]);   // ścianka gniazda panelowego USB-C, wejście do przodu
      for (s = [-1, 1]) translate([bkX + s * (gnScW / 2 - kSc / 2) - kSc / 2, bkY + gnT - zak, kDno - zak])   // żebra za ścianką
        rotate([90, 0, 90]) linear_extrude(kSc) polygon([[0, 0], [gnZebroL, 0], [0, gnScH - kDno]]);
      for (dy = [0, rezRozst]) translate([rezX - rezSlupW / 2, rezY0 + dy - rezSlupW / 2, kDno - zak])   // słupki rezystora (nóżki przez otwory)
        cube([rezSlupW, rezSlupW, rezOsZ - kDno + rezSlupW / 2 + zak]);
      for (x = uchSkretkiX) uchwytOpaski(x, uchSkretkiY, 0, uchH);                                     // skrętki przed PCA9685
      uchwytOpaski(uchPirXY[0], uchPirXY[1], 90, uchH);                                                // przewód PIR
      uchwytOpaski(uchGnXY[0], uchGnXY[1], 90, uchH);                                                  // przewody gniazda USB-C do zacisku
      for (dy = [(zapL - zapRozst) / 2, (zapL + zapRozst) / 2]) translate([zapX, zapY0 + dy, kDno - zak])   // miejsce zapasowe: słupki M3
        cylinder(d = slupPcaD, h = slupPcaH + zak, $fn = 24);
      for (x = [kPiastaOd, kW - kPiastaOd], y = [kPiastaOd, kD - kTylT - kPiastaOd]) translate([x, y, kDno - zak])   // piasty pod wkręty w dno
        cylinder(d = kPiastaD, h = kPiastaH + zak, $fn = 32);
    }
    translate([pcaX0, pcaY0, kDno])
      for (dx = [0, pcaOtwX], dy = [0, pcaOtwY]) translate([(pcaL - pcaOtwX) / 2 + dx, (pcaW - pcaOtwY) / 2 + dy, -kDno - 1])
        cylinder(d = dM3ciasny, h = slupPcaH + kDno + 2, $fn = 24);
    for (x = [kPiastaOd, kW - kPiastaOd], y = [kPiastaOd, kD - kTylT - kPiastaOd]) translate([x, y, -1])   // 4 wkręty 3 × 12 w dno ze sklejki
      cylinder(d = dWkretSkl, h = kDno + kPiastaH + 2, $fn = 24);
    for (dy = [0, rezRozst]) translate([rezX, rezY0 + dy - rezSlupW / 2 - 1, rezOsZ]) rotate([-90, 0, 0]) {   // otwory nóżek rezystora (łza, wzdłuż y)
      cylinder(d = dRezNoga, h = rezSlupW + 2, $fn = 16);
      rotate([0, 0, 225]) cube([dRezNoga / 2, dRezNoga / 2, rezSlupW + 2]);
    }
    for (dy = [(zapL - zapRozst) / 2, (zapL + zapRozst) / 2]) translate([zapX, zapY0 + dy, -1])   // miejsce zapasowe: otwory M3 ciasne
      cylinder(d = dM3ciasny, h = kDno + slupPcaH + 2, $fn = 24);
    translate([bkX, bkY - 1, gnOsZ]) rotate([-90, 0, 0]) intersection() {   // otwór na gwint „podwójne D”: ścięcia u góry i u dołu (górne ścięcie = krótki most, bez podpór)
      cylinder(d = gnGwintD + 2 * luzGn, h = gnT + 2, $fn = 64);
      translate([-gnGwintD, -(gnGwintFlat + 2 * luzGn) / 2, 0]) cube([2 * gnGwintD, gnGwintFlat + 2 * luzGn, gnT + 2]);
    }
  }
}
module espPodstawka() {   // 2 słupki pod krótkimi krawędziami (płaskie górne powierzchnie pod klej; środek płytki, między rzędami pinów z Dupontami); niski rant z tyłu jako ogranicznik
  cxE = espOdBoku + espW / 2;
  for (y = [espOdBoku + espUsbWyst, espOdBoku + espL - espPodD]) translate([cxE - espPodW / 2, y, kDno - zak]) cube([espPodW, espPodD, espPodH + zak]);   // przedni pod płytką, za wystającym gniazdem USB
  translate([cxE - espPodW / 2, espOdBoku + espL + luzSlizg, kDno - zak]) cube([espPodW, espRama, espPodH + espLip + zak]);   // rant z tyłu (koniec z anteną)
}
module uchwytOpaski(x, y, obrot, h) translate([x, y, kDno - zak]) rotate([0, 0, obrot]) difference() {   // blok z tunelem na opaskę (tunel wzdłuż x po obrocie)
  translate([-uchL / 2, -uchD / 2, 0]) cube([uchL, uchD, h + zak]);
  translate([-uchL / 2 - 1, -(opW + 2 * opLuz) / 2, (h - (opT + 2 * opLuz)) / 2]) cube([uchL + 2, opW + 2 * opLuz, opT + 2 * opLuz]);
}


// ===================== szufladka v2 (układ korpusu) =====================
module korpus() {   // druk dnem na stół, bez podpór
  difference() {
    union() {
      cube([szW, szD, dnoSz]);                                                   // dno
      for (x = [0, szW - sc]) translate([x, 0, 0]) cube([sc, szD, dnoSz + scH]); // boki
      cube([szW, sc, dnoSz + scH]);                                              // przednia ściana (za frontem)
      translate([0, szD - sc, 0]) cube([szW, sc, dnoSz + scH]);                  // tył
      translate([0, kieszenPIR, 0]) cube([szW, sc, dnoSz + scH]);                // przegroda: tył kieszeni PIR
      for (y = [pbY0, szD - sc - slupekL]) translate([xPort + luzPb, y, 0]) cube([slupekW, slupekL, dnoSz + slupekH]);   // słupki pb
    }
    translate([pirX - oknoW / 2, -1, pirZ - oknoH / 2]) cube([oknoW, sc + 2, dnoSz + scH - (pirZ - oknoH / 2) + 1]);   // okno PIR, otwarte do górnej krawędzi
    translate([pirX - przWyc / 2, kieszenPIR - 1, dnoSz + scH - przWycH]) cube([przWyc, sc + 2, przWycH + 1]);          // wycięcie w przegrodzie nad listwą PIR
    for (s = [0, 1]) translate([s * szW, szD, (dnoSz + scH) / 2]) rotate([0, 0, 45]) cube([fazaKorp * sqrt(2), fazaKorp * sqrt(2), dnoSz + scH + 2], center = true);   // fazki tylnych naroży 45°
    for (x = rX) translate([x, -1, rcZ]) rotate([-90, 0, 0]) cylinder(d = dM4, h = sc + 2, $fn = 32);    // śruby rączki
    for (x = fkX) translate([x, -1, fkZ]) rotate([-90, 0, 0]) cylinder(d = dM4, h = sc + 2, $fn = 32);   // śruby boczne front–korpus
    translate([wcX, szD - sc - 1, dnoSz + wcDno]) cube([wcCiecie, sc + 2, scH]);                         // wycięcie na kable
  }
}

module front() {   // druk licem na stół (tryb druk: obrót y → z), słupki M2 do góry
  difference() {
    union() {
      translate([frontX0, -tF, frontZ0]) cube([frontW, tF, frontZ1 - frontZ0]);
      for (s = [-1, 1]) translate([pirX + s * pirOtwRozst / 2 - pirPadW / 2, -zak, pirZ - pirPadH / 2])   // podkładki M2 pod płytkę PIR
        cube([pirPadW, pirPadT + zak, pirPadH]);
    }
    translate([pirX, -tF - 1, pirZ]) rotate([-90, 0, 0]) cylinder(d = dKopOtw, h = tF + 2, $fn = 96);   // kopułka
    translate([pirX - pirGn / 2, -pirGnG, pirZ - pirGn / 2]) cube([pirGn, pirGnG + 1, pirGn]);          // gniazdo kołnierza
    for (s = [-1, 1]) translate([pirX + s * pirOtwRozst / 2, pirYp - glM2, pirZ]) rotate([-90, 0, 0])   // M2 w słupkach
      cylinder(d = dM2c, h = glM2 + 1, $fn = 16);
    for (x = rX) translate([x, -tF - 1, rcZ]) rotate([-90, 0, 0]) cylinder(d = dM4, h = tF + 2, $fn = 32);
    for (x = fkX) translate([x, -tF - 1, fkZ]) rotate([-90, 0, 0]) {   // śruby boczne: otwór i pogłębienie 90° od lica
      cylinder(d = dM4, h = tF + 2, $fn = 32);
      translate([0, 0, 1 - zak]) cylinder(d1 = dLebStoz + 2 * luzStoz, d2 = dM4, h = hStoz, $fn = 48);
      cylinder(d = dLebStoz + 2 * luzStoz, h = 1, $fn = 48);
    }
    translate([szW / 2, -tF - 1, blokZ]) rotate([-90, 0, 0]) cylinder(d = dBlokF, h = tF + 2, $fn = 32);   // blokada
  }
}

module raczka() {   // druk licem (większą podstawą) na stół (tryb druk: obrót y → z); łby M4 wklejone od lica
  yL = -tF - rD;                                   // lico rączki
  difference() {
    hull() {
      for (sx = [-1, 1], sz = [-1, 1]) {
        translate([rcX + sx * (rL1 / 2 - rR), -tF - zak, rcZ + sz * (rH1 / 2 - rR)]) rotate([-90, 0, 0]) cylinder(r = rR, h = zak, $fn = 32);   // mniejsza podstawa
        translate([rcX + sx * (rL2 / 2 - rR), yL, rcZ + sz * (rH2 / 2 - rR)]) rotate([-90, 0, 0]) cylinder(r = rR, h = rR, $fn = 32);           // lico płaskie (na stół), naroża R
      }
    }
    for (x = rX) translate([x, yL - 1, rcZ]) rotate([-90, 0, 0]) {
      cylinder(d = dLebM4 + 2 * luzKlej, h = 1 + hLebM4 + luzKlej, $fn = 48);   // gniazdo łba (epoksyd)
      cylinder(d = dM4, h = rD + 2, $fn = 32);
    }
  }
}

// ---------- PIR HC-SR501 (bryły wypukłe – przemiatanie przez hull) ----------
nPir = 13;
module pirPrym(i) {
  xs = [-1, 1];
  if (i == 0) translate([pirX - pirW / 2, pirYp, pirZ - pirH / 2]) cube([pirW, pirT, pirH]);                       // płytka
  if (i == 1) translate([pirX - pirKol / 2, pirYp - pirKolH, pirZ - pirKol / 2]) cube([pirKol, pirKolH, pirKol]); // kołnierz
  if (i == 2) translate([pirX, pirYp - pirKopH, pirZ]) rotate([-90, 0, 0]) cylinder(d = pirKopD, h = pirKopH - pirKolH, $fn = 48);   // kopułka (walec)
  if (i == 3) translate([pirX - pirOtwRozst / 2 + slupM2D, pirYp + pirT, pirZ - pirH / 2]) cube([pirOtwRozst - 2 * slupM2D, pirTyl, pirH]);   // elementy za płytką
  if (i >= 4 && i <= 7) let(sx = xs[(i - 4) % 2], sz = xs[floor((i - 4) / 2)])                                       // kondensatory na rogach
    translate([pirX + (sx > 0 ? pirW / 2 - slupM2D : -pirW / 2 - pirRogi), pirYp + pirT, pirZ + (sz > 0 ? pirH / 2 - slupM2D : -pirH / 2 - pirRogi)])
      cube([slupM2D + pirRogi, pirTyl, slupM2D + pirRogi]);
  if (i == 8) translate([pirX - pirLstW / 2, pirYp + pirT, pirZ + pirH / 2 - pirLstH]) cube([pirLstW, pirDupont, pirLstH]);   // listwa z wtykami Dupont
  if (i >= 9 && i <= 12) let(sx = xs[(i - 9) % 2], sz = xs[floor((i - 9) / 2)])                                      // luty od strony soczewki (paski boczne, poza otworami)
    translate([pirX + (sx > 0 ? pirKol / 2 : -pirW / 2), pirYp - pirLut, pirZ + (sz > 0 ? pirH / 2 - pirLutStrefa : -pirH / 2)])
      cube([(pirW - pirKol) / 2, pirLut, pirLutStrefa]);
}
module pir() for (i = [0 : nPir - 1]) pirPrym(i);

// ---------- śruby i powerbank (do złożenia i kontroli) ----------
module sruby() {
  y0 = -tF - rD;
  for (x = rX) translate([x, 0, rcZ]) rotate([-90, 0, 0]) {
    translate([0, 0, y0 + odsun]) cylinder(d = dLebM4, h = hLebM4 - odsun, $fn = 32);                  // łeb w gnieździe rączki
    translate([0, 0, y0 + hLebM4]) cylinder(d = dM4 - 0.5, h = lM4r, $fn = 32);                          // trzpień (Ø gwintu − luz rysunkowy)
    translate([0, 0, sc + odsun]) cylinder(d = 2 * sM4, h = tPodkM4 - odsun, $fn = 32);                  // podkładka
    translate([0, 0, sc + tPodkM4]) cylinder(d = sM4 / cos(30), h = hNakM4, $fn = 6);                     // nakrętka
  }
  for (x = fkX) translate([x, 0, fkZ]) rotate([-90, 0, 0]) {   // M4 stożkowe w pogłębieniu, nakrętki od środka
    translate([0, 0, -tF + odsun]) cylinder(d1 = dLebStoz - 2 * odsun, d2 = dM4 - 0.5, h = (dLebStoz - dM4 + 0.5) / 2, $fn = 32);
    translate([0, 0, -tF]) cylinder(d = dM4 - 0.5, h = lFk, $fn = 32);
    translate([0, 0, sc + odsun]) cylinder(d = sM4 / cos(30), h = hNakM4, $fn = 6);
  }
  for (s = [-1, 1]) translate([pirX + s * pirOtwRozst / 2, pirYp + pirT + odsun, pirZ]) rotate([-90, 0, 0])   // łby M2 za płytką PIR (trzpień w słupku)
    cylinder(d = dLebM2, h = hLebM2, $fn = 16);
  translate([szW / 2, 0, blokZ]) rotate([-90, 0, 0]) {                                                    // blokada
    translate([0, 0, -tF - hLebM4]) cylinder(d = dLebM4, h = hLebM4 - odsun, $fn = 32);
    translate([0, 0, -tF]) cylinder(d = dM4 - 0.5, h = blokL, $fn = 32);
  }
}
module powerbank() translate([sc + luzPb, pbY0, dnoSz]) cube([pbL, pbW, pbH]);
module szufladaRuch(sruby = true) { korpus(); front(); raczka(); pir(); powerbank(); if (sruby) sruby(); }   // wszystko, co jedzie z szufladką

// ===================== sklejka (układ podstawki) =====================
module plyta() difference() {                   // 4 wkręty w ścianki boczne (od góry), otwór na skrętki, otwór pilotowy blokady w przedniej krawędzi
  cube([SZ, DL, tPl]);
  translate([cx, cy, -1]) cylinder(d = dOtwPl, h = tPl + 2, $fn = 120);
  for (x = [tPl / 2, SZ - tPl / 2], y = [wkrPlOd, DL - wkrPlOd]) translate([x, y, -1]) cylinder(d = dWkretSkl, h = tPl + 2, $fn = 24);
  translate([SZ / 2, -1, tPl / 2]) rotate([-90, 0, 0]) cylinder(d = dBlokPilot, h = blokOtwG + 1, $fn = 24);
}
module dno() cube([SZ, DL, tDno]);
module scianaBoczna() cube([tPl, DL, H_IN]);
module scianaTylna() cube([WIN, tTyl, H_IN]);
module sklejka() {
  dno();
  translate([0, 0, tDno + H_IN]) plyta();
  translate([0, 0, tDno]) { scianaBoczna(); translate([SZ - tPl, 0, 0]) scianaBoczna(); translate([tPl, DL - tTyl, 0]) scianaTylna(); }
}

// ===================== rysunek cięcia i wiercenia (2D, widok z góry, wymiary w tekście) =====================
rysOdst = 40; rysTekst = 9; rysLinia = 0.8;
module wymiar(dl, tekst, obrot = 0) rotate(obrot) {   // linia wymiarowa wzdłuż x od 0 do dl, tekst nad nią
  translate([0, -rysLinia / 2]) square([dl, rysLinia]);
  for (x = [0, dl]) translate([x - rysLinia / 2, -rysTekst / 2]) square([rysLinia, rysTekst]);
  translate([dl / 2, rysTekst / 2]) text(tekst, size = rysTekst, halign = "center");
}
module obrys(w, h) difference() { square([w, h]); translate([rysLinia, rysLinia]) square([w - 2 * rysLinia, h - 2 * rysLinia]); }
module rysunekCiecia() {   // rysunek w układzie podstawki: przód (y 0) na dole
  obrys(SZ, DL);
  translate([cx, cy]) difference() { circle(d = dOtwPl, $fn = 96); circle(d = dOtwPl - 2 * rysLinia, $fn = 96); }
  translate([cx, cy - dOtwPl / 2 - rysTekst * 2]) text(str("otwór Ø", dOtwPl, " w środku"), size = rysTekst, halign = "center");
  for (x = [tPl / 2, SZ - tPl / 2], y = [wkrPlOd, DL - wkrPlOd]) translate([x, y]) circle(d = dWkretSkl, $fn = 24);
  translate([SZ / 2, DL - wkrPlOd - rysTekst]) text(str("4 wkręty w ścianki: ", tPl / 2, " od boku, ", wkrPlOd, " od przodu i tyłu"), size = rysTekst * 0.6, halign = "center");
  translate([SZ / 2, DL / 2 + tulRw + rysTekst]) text(str("PŁYTA GÓRNA ", tPl, " mm (wykonana)"), size = rysTekst, halign = "center");
  translate([SZ / 2 - rysLinia, 0]) square([2 * rysLinia, blokOtwG]);   // blokada: otwór w przedniej krawędzi płyty
  translate([SZ / 2, blokOtwG + rysTekst]) text(str("BLOKADA: w przedniej krawędzi na środku (", SZ / 2, " od boku)"), size = rysTekst * 0.6, halign = "center");
  translate([SZ / 2, blokOtwG + rysTekst * 0.1]) text(str("otwór Ø", dBlokPilot, " × ", blokOtwG, " głęb., ", tPl / 2, " pod wierzchem płyty, poziomo"), size = rysTekst * 0.6, halign = "center");
  translate([0, DL + rysTekst * 2]) wymiar(SZ, str(SZ));
  translate([SZ + rysTekst * 2, 0]) wymiar(DL, str(DL), 90);
  translate([SZ / 2, -rysTekst * 2.5]) text(str("wnętrze ", WIN, " × ", H_IN, ", dno ", tDno, ", ścianki ", tPl, " – stan wykonany 25.10"), size = rysTekst * 0.7, halign = "center");
}

// ===================== złożenie (układ podstawki) =====================
module wPodstawce(w = 0, dz = 0) translate([szX0, -w, szNad + dz]) children();   // szufladka wysunięta o w (dz: odsunięcie od dna w kontrolach)
module zlozenie() {
  color("BurlyWood") sklejka();
  wPodstawce() {
    color("LightGreen") korpus();
    color("Orange") front();
    color("Orange") raczka();
    color("White") pir();
    color("DimGray") powerbank();
    color("Silver") sruby();
  }
  color("Orange") translate([kX0, kY0, tDno]) kaseta();
  color("Orange") translate([cx, cy, Z_PL]) tuleja();
  color("Orange") translate([cx, cy, Z_PL + hDoc]) nakretka();
}

// ===================== kontrole kolizji (wynik ma być pusty) =====================
module stale() { sklejka(); translate([kX0, kY0, tDno]) kaseta(); }   // części nieruchome
// szufladka zamknięta: wszystko, co jedzie z szufladką, wobec sklejki i kasety (odsunięte o „odsun” od krawędzi i od dna, z którymi się styka)
module kolizjaZamknieta() intersection() { stale(); wPodstawce(odsun, odsun) szufladaRuch(false); }
// wsuwanie: te same bryły w położeniach wysunięcia (ruch prostoliniowy w y, przekrój stały)
module kolizjaWsuwanie() for (w = wysuwy) intersection() { stale(); wPodstawce(w + odsun, odsun) szufladaRuch(false); }
// PIR zamontowany we froncie, wobec frontu i korpusu (PIR odsunięty o „odsun” do tyłu: kołnierz i płytka stykają się z gniazdem i słupkami)
module kolizjaPIR() intersection() { union() { front(); korpus(); } translate([0, odsun, 0]) pir(); }
// wkładanie frontu z PIR w korpus: przemiatanie każdej bryły PIR i słupków M2 po drodze drogaPIR, wobec korpusu
module kolizjaWkladaniePIR() intersection() {
  korpus();
  union() {
    for (i = [0 : nPir - 1]) hull() { translate([0, -drogaPIR, 0]) pirPrym(i); translate([0, -odsun, 0]) pirPrym(i); }
    for (s = [-1, 1]) hull() for (d = [drogaPIR, odsun]) translate([pirX + s * pirOtwRozst / 2 - pirPadW / 2, -d, pirZ - pirPadH / 2]) cube([pirPadW, pirPadT, pirPadH]);
  }
}
// śruby, nakrętki i łby wobec drukowanych części, PIR i powerbanku (trzpienie M2 i M4 blokady w otworach ciasnych – poza kontrolą)
module kolizjaSruby() intersection() { sruby(); union() { korpus(); front(); raczka(); pir(); powerbank(); } }

// ===================== rysunki montażu PIR (podglądy do instrukcji) =====================
pokazOdst = 18;     // odstęp części w widoku rozstrzelonym
module wkretM2() rotate([-90, 0, 0]) { translate([0, 0, -hLebM2]) cylinder(d = dLebM2, h = hLebM2, $fn = 24); cylinder(d = dM2c + 0.3, h = lM2, $fn = 16); }
module pokazPIR() {   // rozstrzelony: wycinek frontu, PIR, wkręty M2 (patrzymy od tyłu frontu)
  color("Orange") probkaPIR();
  color("SteelBlue") translate([0, pokazOdst, 0]) pir();
  color("Silver") for (s = [-1, 1]) translate([pirX + s * pirOtwRozst / 2, pirYp + pirT + 2 * pokazOdst, pirZ]) mirror([0, 1, 0]) wkretM2();
}
module przekrojPIR() {   // przekrój poziomy przez otwory M2 (widok z góry): front, podkładki, płytka, kołnierz, kopułka, przednia ściana korpusu
  module ciecie() translate([pirX - probkaPirW / 2, -pirKopH - tF, pirZ - probkaPirH]) cube([probkaPirW, pirKopH + tF + kieszenPIR, probkaPirH]);
  color("Orange") intersection() { front(); ciecie(); }
  color("LightGreen") intersection() { korpus(); ciecie(); }
  color("SteelBlue") intersection() { pir(); ciecie(); }
  color("Silver") intersection() { for (s = [-1, 1]) translate([pirX + s * pirOtwRozst / 2, pirYp + pirT, pirZ]) mirror([0, 1, 0]) wkretM2(); ciecie(); }
}

// ===================== rysunek tacki elektroniki z płytkami (podgląd do montażu) =====================
module pokazTacki() {   // układ tacki: x od lewego boku, y od przodu tacki; widok z góry
  txt = 4.5;
  module napis(x, y, s) translate([x, y, 40]) color("Black") linear_extrude(0.5) text(s, size = txt, halign = "center", valign = "center");
  color("Gold") kaseta();
  color("ForestGreen") translate([pcaX0, pcaY0, kDno + slupPcaH]) cube([pcaL, pcaW, 1.6]);                      // PCA9685
  color("DimGray") translate([pcaX0 + 3, pcaY0, kDno + slupPcaH + 1.6]) cube([pcaL - 6, 6, 8]);                  // listwy kanałów (przód)
  color("RoyalBlue") translate([pcaX0 + pcaL / 2 - 5, pcaY0 + pcaW - 6, kDno + slupPcaH + 1.6]) cube([10, 6, 8]); // zacisk (tył)
  color("Orange", 0.35) translate([pcaX0, pcaY0 - pcaPrzod, kDno]) cube([pcaL, pcaPrzod, 1]);                    // wolne przed listwą
  color("SteelBlue") translate([espOdBoku, espOdBoku, kDno + espPodH]) cube([espW, espL, 1.6]);                 // ESP32-C3 na podstawce
  color("Black") for (s = [-1, 1]) translate([espOdBoku + espW / 2 + s * espRzedy / 2 - 1.3, espOdBoku + 1, kDno + espPodH - 14]) cube([2.6, espL - 2, 14]);   // wtyki Dupont pod płytką
  color("Silver") translate([bkX, bkY - 3, gnOsZ]) rotate([-90, 0, 0]) cylinder(d = gnGwintD, h = gnT + gnKorpL + 3, $fn = 32);   // gniazdo USB-C
  color("Silver", 0.5) translate([bkX - wtykSzer / 2, 0, kDno]) cube([wtykSzer, bkY - 3, 1]);                    // wtyk C–C
  color("SaddleBrown") translate([rezX, rezY0 + (rezRozst - rezL) / 2, rezOsZ]) rotate([-90, 0, 0]) cylinder(d = rezD, h = rezL, $fn = 24);   // rezystor 47 Ω / 3 W
  color("Silver") translate([rezX, rezY0 - rezSlupW, rezOsZ]) rotate([-90, 0, 0]) cylinder(d = 0.9, h = rezRozst + 2 * rezSlupW, $fn = 8);       // nóżki
  color("Red") translate([cx - kX0, cy - kY0, 38]) difference() { cylinder(d = dOtwPl, h = 0.5, $fn = 96); translate([0, 0, -1]) cylinder(d = dOtwPl - 1.5, h = 3, $fn = 96); }   // otwór w płycie (tuleja)
  napis(pcaX0 + pcaL / 2, pcaY0 + pcaW / 2, "PCA9685");
  napis(pcaX0 + pcaL / 2, pcaY0 - pcaPrzod / 2, "wolne 25 (kondensator, 5 V)");
  napis(pcaX0 + pcaL / 2, pcaY0 + pcaW + 5, "zacisk V+/GND");
  napis(espOdBoku + espW / 2, espOdBoku + espL + 6, "ESP32-C3");
  napis(bkX, bkY + gnT + gnKorpL + 6, "gniazdo USB-C");
  napis(bkX, 6, "wtyk C–C");
  napis(rezX + 2, rezY0 - 7, "rezystor 47 Ω / 3 W");
  napis(cx - kX0, cy - kY0 - 3, "otwór Ø60 (skrętki)");
  napis(uchPirXY[0] - 10, uchPirXY[1] + 8, "opaska PIR");
  color("Plum", 0.5) translate([zapX - zapW / 2, zapY0, kDno + slupPcaH]) cube([zapW, zapL, 1.6]);
  napis(zapX, zapY0 + zapL / 2, "zapas 20×30");
  napis(uchGnXY[0] - 2, uchGnXY[1] + 7, "opaska USB-C");
  napis(kW / 2, -12, "PRZÓD TACKI (szufladka)");
}

// ===================== wybór części =====================
module probkaPIR() intersection() {   // wycinek frontu z gniazdem PIR – próbka pasowania przed drukiem frontu
  front();
  translate([pirX - probkaPirW / 2, -tF - 1, pirZ - probkaPirH / 2]) cube([probkaPirW, tF + pirYp + 2, probkaPirH]);
}
module druk(c) {
  if (c == "Front") translate([0, 0, tF]) rotate([90, 0, 0]) front();
  else if (c == "Raczka") translate([0, 0, tF + rD]) rotate([90, 0, 0]) raczka();
  else if (c == "ProbkaPIR") translate([0, 0, tF]) rotate([90, 0, 0]) probkaPIR();
  else if (c == "Korpus") korpus();
}
if (czesc == "parametry")
  echo(str("PARAMETRY{\"SZ\":", SZ, ",\"DL\":", DL, ",\"H\":", Z_PL, ",\"H_IN\":", H_IN, ",\"WIN\":", WIN, ",\"szW\":", szW, ",\"szD\":", szD,
           ",\"luzSzBok\":", luzSzBok, ",\"tulH\":", tulH, ",\"blokZstol\":", blokZ + szNad, ",\"blokOtwG\":", blokOtwG, ",\"lM4min\":", lM4min,
           ",\"oczekiwane\":{\"Korpus\":[", szW, ",", szD, ",", dnoSz + scH,
           "],\"Front\":[", frontW, ",", frontZ1 - frontZ0, ",", tF + pirYp,
           "],\"Raczka\":[", rL2, ",", rH2, ",", rD,
           "],\"ProbkaPIR\":[", probkaPirW, ",", probkaPirH, ",", tF + pirYp,
           "],\"Tuleja\":[", 2 * kolR, ",", 2 * kolR, ",", tulH, "],\"Kaseta\":[", kW, ",", kD, ",", kTylH, "],\"Nakretka\":[", 2 * nakR, ",", nakR * sqrt(3), ",", nakH, "]}}"));
else if (czesc == "zlozenie") zlozenie();
else if (czesc == "ProbkaPIR") { if (tryb == "druk") druk(czesc); else wPodstawce() probkaPIR(); }
else if (czesc == "Korpus" || czesc == "Front" || czesc == "Raczka") { if (tryb == "druk") druk(czesc); else wPodstawce() { if (czesc == "Korpus") korpus(); if (czesc == "Front") front(); if (czesc == "Raczka") raczka(); } }
else if (czesc == "Kaseta") kaseta();
else if (czesc == "Tuleja") tuleja();
else if (czesc == "Nakretka") nakretka();
else if (czesc == "ProbkaTuleja") tuleja(probkaH, probkaKolR, false);
else if (czesc == "ProbkaNakretka") nakretka(probkaNakR);
else if (czesc == "Plyta") plyta();
else if (czesc == "ScianaBoczna") scianaBoczna();
else if (czesc == "ScianaTylna") scianaTylna();
else if (czesc == "Dno") dno();
else if (czesc == "RysunekCiecia") rysunekCiecia();
else if (czesc == "KolizjaZamknieta") kolizjaZamknieta();
else if (czesc == "KolizjaWsuwanie") kolizjaWsuwanie();
else if (czesc == "KolizjaPIR") kolizjaPIR();
else if (czesc == "KolizjaWkladaniePIR") kolizjaWkladaniePIR();
else if (czesc == "KolizjaSruby") kolizjaSruby();
else if (czesc == "PokazPIR") pokazPIR();
else if (czesc == "PokazTacki") pokazTacki();
else if (czesc == "PrzekrojPIR") przekrojPIR();
