// Duże oko v2 – model parametryczny (OpenSCAD 2021.01), noc 24/25.10.2026, projektant.
// Plan: 40-cad/onshape/duze-oko-v2-plan.md; poprawki po review Astry i stan: 30-projekt/raport-nocny-2026-10-25.md.
// Układ: x w prawo (patrząc na dynię), y w górę, z do przodu; środek gałki = (0,0,0). Wymiary w mm, kąty w stopniach.
// Zasada: każda liczba geometrii jest zmienną w sekcji „zmienne”; w modułach tylko zmienne, 0, ±1 (znak), 1/2 i kąty 90/180/360.
// Eksport: bash eksport.sh (3MF na część + zbiorczy z osobnymi obiektami) albo
//   openscad -o <plik>.3mf -D 'czesc="Galka"' -D 'tryb="druk"' duze-oko-v2.scad
//   czesc: Galka | PowiekaGorna | PowiekaDolna | Pierscien | Maskownica | UchwytSerw | ProbkaDrutu | parametry | zlozenie
//   (plik zbiorczy z osobnymi obiektami składa 40-cad/narzedzia/zbiorczy_3mf.js – OpenSCAD zlałby części w jedną siatkę)
//   tryb:  druk (płaska strona na stole, z ≥ 0) | zlozenie (położenie w module)

czesc = "zlozenie";
tryb = "zlozenie";

// ===================== zmienne =====================
// Dwie grupy. BAZOWE: wymiary części kupnych, luzy z tabeli AGENTS.md, Rg, otwór, ścianka dyni i decyzje projektowe wyrażone jako
// odstępy, kąty albo rozmiary (nie współrzędne). POCHODNE: wszystkie położenia, liczone z bazowych; w komentarzu wartość dla bazowych z tego pliku.
// Test zginania (raport nocny): Rg 29 / 31, scianka 28 / 50, luzObr 0,3.

// ---------- BAZOWE: dynia i otwór ----------
scianka  = 40;      // grubość ścianki dyni przy otworze (zakres 28–50)
otwor    = 80;      // średnica otworu w dyni (PRD: ≤ Ø80)
// ---------- BAZOWE: luzy (tabela AGENTS.md) ----------
luzObr   = 0.2;     // obrotowy i osiowy
luzSlizg = 0.3;     // ślizgowy, okna korpusów serw
luzRuch  = 0.5;     // ruchome części obok siebie
luzOtwor = 0.5;     // tuba w otworze dyni (na promieniu)
// ---------- BAZOWE: części kupne ----------
Lkardan = 25.5; dKardan = 11; glOtwKardana = 7;      // kardan 5/5: długość, Ø piasty, głębokość otworu Ø5
lM5tyl = 16; dLebM5 = 9.5; hLebM5 = 3.5; dTrzpM5 = 5.5; dTrzpTyl = 5.3;   // M5 × 12 (przód) i × 16 (tył), łeb krzyżakowy (założenie)
lM2 = 6; dM2 = 2; hLebM2 = 1.6; dLebM2 = 3.8; dPadM2 = 1.7;               // M2 × 6: trzpień, łeb, otwór ciasny w podkładce (wkręcana)
dM3luz = 3.3; dM3ciasny = 2.6; dPoglM3 = 6.5; hPoglM3 = 2.6; dWkret = 4.5;  // M3, wkręty do drewna
Lsv = 22.8; Wsv = 12.5; Hsv = 22.8; wiezaH = 12.2; uchoOd = 15; uchoT = 2; rozstUch = 27.7; osOdCzola = 5.5; dlUszu = 31.8; dWkrSerwa = 1.7;   // MG90S (Miuzei)
rOrcz1 = 17.5; rOrcz2 = 13.5;                        // otwory orczyka (5,5…17,5 co 2) wybrane dla S1, S2
rOrczP = 25;                                         // serwa powiek SG, SD: otwór drutu w drukowanym przedłużeniu orczyka (wariant A użytkownika, 25.10)
szerOrczF = 5.5; dPiastyOrczF = 7; tPrzedl = 3; glRowkaP = 1.2; dWkretOrcz = 2.4; dLebWkretOrcz = 4.6; dnoPogl = 0.6;
kolkiOrczF = [13.5, 17.5];                         // otwory fabrycznego orczyka MG90S (Ø ok. 1, co 2 mm, 5,5–17,5 – pomiar E6) na kołki z drutu Ø1: blokują obrót nakładki, kształt orczyka bez znaczenia
zapasRowkaP = 1;                                     // wgłębienie od spodu szersze o tyle na stronę (orczyk MG90S nie jest płaski – użytkownik 25.10)   // fabryczny orczyk jednoramienny (założenie: szerokość końca, Ø piasty); przedłużenie: grubość, rowek na orczyk od spodu, otwór wkrętu orczyka
grubOrcz = 2; odstOrcz = 1.5;                        // grubość ramienia orczyka; płaszczyzna otworu → czubek wałka
dDrut = 1.0;                                         // drut sprężynowy
dKoszulki = 2.2; lKoszulki = 1.5;                    // koszulka = izolacja zsunięta z przewodu o żyle ~1 mm (AWG 18–20; Ø zewn. założony 2,2), długość; blokuje nogę L PG/PD i końce sworzni ucha
srodekZ = 5; tolZ = 1.5; ogonZ = 5; ramieV = 5;      // druty gięte ręcznie: środek Z 5 ± 1,5, ogon, ramiona V (tylko PG, PD) – dla skryptów kolizji
// ---------- BAZOWE: gałka (decyzje) ----------
Rg = 30; tg = 2;
wystGalki = 6;      // gałka wystaje przed lico tuby / maskownicy
tylRant = 4;        // skorupa sięga tylRant za środek (rant = stół do druku); 4 zamiast 8 – miejsce na piastę kardana 2/2 przy krawędzi (25.10)
podloga = 5.5;      // podłoga rowka T = część M5 × 12 poza piastą (wsunięcie 6,5 z 7)
luzLebR = 0.25; luzLebH = 0.4; skorupaRowka = 0.8;   // skorupaRowka: ścianka zostawiona nad gniazdem łba M5 od zewnątrz                       // łeb M5 w rowku
rUcha = 17; wysUcha = 4;                             // punkt zaczepienia drutu (środek kardana 2/2): promień od osi, wysokość nad rantem; 17 zamiast 20 – piasta kardana nie ociera o krawędź gałki (25.10)
uchoDol = 2.6; uchoGora = 2.5; uchoPlL = 1.5; uchoPlP = 4; uchoOdOsi = 3; uchoZaSkorupa = 1.5; tZebra = 2;   // blaszka ucha
dTalia = 1.7; lTalia = 0.3; katKlep = 45; lKlep = 1.2;                    // klepsydra (tylko dawne ucho; nieużywana w gałce)
// ucha S1, S2 = widełki: dwa policzki, między nimi oczko drutu (zwinięte na trzpieniu M3) na sworzniu z drutu Ø1 (koniec zagięty kombinerkami)
// połączenie drutów S1/S2 z gałką (25.10, decyzja użytkownika): kardan 2/2 z warsztatu (zgięcie do ~90°) – środek przegubu w punkcie ucha,
// piasta 1 na kołku z drutu ocynkowanego Ø2 wciśniętym w kostkę gałki, piasta 2 zaciska pręt Ø2 do orczyka (długość przesuwem pręta, zero w ESP32)
LkardanM = 23.5; dKardanM = 9; dKolka = 2.2; glKolka = 8; dKostki = 7; luzKostki = 0.5;   // kardan 2/2: długość, Ø (karta); kołek Ø2 wklejany (otwór Ø2,2 pod klej – klejenie dozwolone, 25.10), głębokość w kostce; kostka: Ø, odstęp od piasty
dOczkaS1 = 3; katOczkaS1 = 50;                       // oczko S1: Ø wewn. (zwinięte na trzpieniu M3); przechył, na który liczona jest szczelina (wymagany 38,4° + 10° błędu płaszczyzny)
dOczkaS2 = 2; katOczkaS2 = 40;                       // oczko S2: Ø wewn. (na trzpieniu M2) – mniejszy luz; wymagany 27° + 10°
tPolicz = 2.5; aPolicz = 3; ePodSw = 0.9; xsPolicz = 1.5; tMost = 2; xSkosS1 = 5.5;   // xSkosS1: początek skosu policzka S1 do rantu (miejsce na korpus drutu przy przechyle)   // policzek: grubość, połowa szerokości, materiał pod otworem, połowa płaskiego dna; mostek S2 do skorupy
// ---------- BAZOWE: powieki (decyzje) ----------
szczGalkaPow = 1.5; szczPowiek = 0.7; tp = 1.2;     // szczeliny gałka–górna i górna–dolna, grubość czaszy
katZam = 1.5; szerPow = 75; skok = 51.5;            // krawędź zamknięta ±1,5° (zakładka 3°), szerokość czaszy, skok (do 50°)
tUcho = 1.5; rUchoG = 4; sektorG = [11, 50]; rRamieG = 14; rUchoD = 4.5; sektorD = [-50, -11];   // ucha i ramiona
rDzw = 7; rDzwPiasta = 3; rDzwKoniec = 2.2;         // (dawne dźwignie powiek – nieużywane od v3 powiek)
// powieki v3 (25.10, decyzja użytkownika): każda powieka na swoim serwie (SG górna, SD dolna); drut zaczepiony w uszku na tylnej krawędzi czaszy, daleko od osi
rZaczP = 34; dKatZacz = 4;                           // otwór uszka: promień od osi powiek, kąt za krawędzią czaszy
rUszkaP = 2.6; tUszkaP = 4; dKatUszka = 8;           // uszko: promień oczka wokół otworu, grubość (wzdłuż x), zasięg nasady w głąb czaszy
przesOrczP = 6;                                      // oś orczyka powieki przesunięta o tyle na zewnątrz od położenia „orczyk ⟂ drut w połowie skoku” (solver)
// ---------- BAZOWE: pierścień, maskownica (decyzje) ----------
tTuba = 1.6; wystTuby = 2; rantMask = 2; tKol = 4; szerKol = 12.5; odstWkretu = 7.5;   // rant maskownicy ≤ 2 poza otwór (PRD)
aPad = 4; luzPadTuba = 0.5;
katyRamion = [-3, 170, 285]; katyWkretow = [90, 215, 325];   // położenia kątowe ramion Uchwytu i łap
// ---------- BAZOWE: serwa i uchwyt (decyzje) ----------
odstSerwa = 8.5;    // czoło korpusów serw za gałką (od R gałki)
przesS1 = 1; przesS2 = 5.5; // otwór orczyka S1 1 mm pod osią gałki; S2 5,5 mm nad uchem (wieża S2 ≥ 1,5 mm od orczyka S1 przy rUcha 17 – review Astry v8)
odstOrczSlupek = 2;         // orczyk S2 od słupka
aOrcz0 = -6;                // orczyki S1, S2 w zerze obrócone 6° do tyłu (solver)
tPlyta = 3; tRamki = 4; aRamie = 8; polRamki = 10.5; ramkaNadUchem = 2; zapasPlyty = 4; luzUchaPlyta = 0.2;
wkladSlupka = 2.5;          // ścianka słupka wokół piasty
tSciany = 2.5; fazaWiezy = 5; zebroP = 14; hZebraS2 = 6; yZebraS2 = 0;   // żebra końcowe ściany SG/SD (zasięg w −x); niskie żebro do ramki S2: wysokość, położenie y   // ścianki usztywniające uchwyt (słupek–wieże, wieża–ramki, ramki powiek razem); skośna podstawa wież 45°
oknoDl = 20;
// ---------- BAZOWE: próbka, druk, siatka ----------
pMargines = 3; pOdst = 4; pSzer = 12; pGrub = 2; pDlB = 8; pWysZebra = 6; pUchoB = 3; pOknoY = 4; pSkorupa = 2;   // próbka: margines od brzegu, odstęp między elementami
odstep = 10; stopka = 0.6;
// ---------- BAZOWE: przyrząd do gięcia drutów ----------
zapasPrzez = 0.5; ogonDrut = 2;         // odcinek przez otwór = grubość ścianki + zapasPrzez; ogon Z
gPrzyrz = 10; glRowka = 0.7; luzRowka = 0.1;  // płytka: grubość (pogłębienia łbów na 2 głębokościach); rowek: głębokość, luz na stronę
odstTorow = 11; margPrzyrz = 6; hNapisu = 0.6; rozmNapisu = 3.2;
dM3 = 3; prostaZ = 0.4; hPoglGleb = 5.5; luzSzczeliny = 0.3; dlStacji = 12;   // kołki = trzpienie śrub M3 od spodu; prosty odcinek między łukami Z; pogłębienie drugiej śruby Z (wkręcanej po 1. zagięciu); stanowisko haka A
rWiezy = 6; szerOrcz = 5; rPiastyOrcz = 3.5; dlOrcz = 20; dlWidelek = 2; fnPodglad = 8;   // dlOrcz: koniec ramienia orczyka jednoramiennego od osi (nieskracany; otwory do 17,5)   // bryły zastępcze (podgląd i kontrola kolizji): wieżyczka serwa, ramię i piasta orczyka, widełki kardana
nad = 1; e = 0.01; fnDuze = 192; fnSr = 64; fnMale = 24; krokKata = 1; nSektor = 48; lOtwOsi = 8;

// ---------- POCHODNE (wartość dla bazowych powyżej) ----------
zPiasta    = Lkardan / 2;                          // 12,75 czoło przedniej piasty
zRant      = -tylRant;                             // -8
zUcho      = zRant + wysUcha;                      // -4
xUcha      = rUcha;                                // 20
stozekK    = zPiasta - (dKardan / 2 + luzLebR);    // 7: tworząca r = z − stozekK, wierzchołek r 5,75
uStozek    = (-stozekK + sqrt(2 * (Rg - tg) * (Rg - tg) - stozekK * stozekK)) / 2;   // 15,99 styk stożka ze skorupą
aStozek    = atan2(uStozek + stozekK, uStozek);    // 55,2°
aRantZ     = asin(zRant / Rg);  aRantW = asin(zRant / (Rg - tg));   // -15,5° / -16,6°
yRowek     = -uStozek;                             // -15,99 wylot rowka T do wnętrza gałki
dDzwOtw    = dDrut + 2 * luzObr;                   // 1,4
dOsM2      = dM2 + 2 * luzObr;                     // 2,4 otwór osi w uchu powieki
dOtw2      = 2 * dDrut + 2 * luzObr;               // 2,4 (dwa druty, orczyk S3)
Rpg        = Rg + szczGalkaPow;                    // 31,5
Rpd        = Rpg + tp + szczPowiek;                // 33,4
xLeb       = Rg + luzRuch;                         // 30,5 łeb M2 od strony gałki
xUchoG     = xLeb + hLebM2 + luzObr;               // 32,3
xUchoD     = xUchoG + tUcho + luzObr;              // 34,0
xPad       = xUchoD + tUcho + luzObr;              // 35,7
glPadM2    = xLeb + hLebM2 + lM2 - xPad;           // 2,4 ślepy otwór: M2 wkręcona do dna
luzLebM2   = 2 * luzObr;                           // 0,4
xPlytkiG   = Rpg - rRamieG / 2;                    // 24,5 początek płytki ucha (wnętrze zjada kula)
xRamieD    = Rpg;                                  // 31,5
xTrymD     = xUchoG - luzSlizg;                    // 32,0: czasza dolna |x| ≤
rTubaZ     = otwor / 2 - luzOtwor;                 // 39,5
rTubaW     = rTubaZ - tTuba;                       // 37,9
rRamieD    = sqrt(rTubaW * rTubaW - (xUchoD + tUcho) * (xUchoD + tUcho)) - 3 * luzRuch;   // 11,8 ramię dolnej (od tuby)
katDzwZam  = 90 - skok / 2;                        // 64,25° dźwignia ⟂ drut w połowie skoku
zTubaPrzod = Rg - wystGalki;                       // 24
zSkorka    = zTubaPrzod - wystTuby;                // 22
zKolPrzod  = zSkorka - scianka;                    // -18
Dkol       = 2 * (rTubaZ + szerKol);               // 104
rWkr       = rTubaZ + odstWkretu;                  // 47
dMask      = otwor + 2 * rantMask;                 // 84
dMaskW     = 2 * rTubaZ;                           // 79 (wcisk 0)
tMask      = wystTuby;                             // 2
rRamion    = rTubaZ + aRamie / 2 + 3 * luzRuch;    // 45
ramiona    = [for (a = katyRamion) [rRamion * cos(a), rRamion * sin(a)]];   // (44,9; -2,4), (-44,3; 7,8), (0; -45)
wkrety     = katyWkretow;
zSerwoPrzod = -(Rg + odstSerwa);                   // -38,5
zWal       = zSerwoPrzod - osOdCzola;              // -44
zSerwoTyl  = zSerwoPrzod - Lsv;                    // -61,3
uchoWyst   = (dlUszu - Lsv) / 2;                   // 4,5
zUchSerwa  = [ (zSerwoPrzod + zSerwoTyl) / 2 + rozstUch / 2, (zSerwoPrzod + zSerwoTyl) / 2 - rozstUch / 2 ];   // -36,05 / -63,75
xOrcz1     = xUcha + przesS1;                      // 21: S1, wałek ∥ x w stronę −x
yWal1      = -(rOrcz1 + przesS1);                  // -18,5
dSlupek    = dKardan + 2 * wkladSlupka;            // 16
xOrcz2     = dSlupek / 2 + odstOrczSlupek + grubOrcz / 2;   // 11: S2, wałek ∥ x w stronę −x
yWal2      = xUcha + przesS2 - rOrcz2;             // 8,5
katKrawP   = szerPow - katZam;                     // 73,5° tylna krawędź czaszy (od +z ku ±y, powieka zamknięta)
katZaczP   = katKrawP + dKatZacz;                  // 77,5° otwór uszka
yZaczMid   = rZaczP * sin(katZaczP + skok / 2);    // 33,2 uszko w połowie skoku
yWalP      = yZaczMid - rOrczP + przesOrczP;       // 19,6 oś serwa powieki (SG +y, SD −y); wałek ∥ x w stronę +x, orczyk w x = 0
xRamkaP    = -(odstOrcz + uchoOd + uchoT);         // -18,5 płaszczyzna uszu serw powiek (ramka po stronie −x)
zPlyta     = zSerwoTyl - uchoWyst - luzUchaPlyta - tPlyta;   // -69
zRamkaGora = zSerwoPrzod + uchoWyst + ramkaNadUchem;         // -32
xRamka1    = xOrcz1 + odstOrcz + uchoOd + uchoT;   // 39,5
xRamka2    = xOrcz2 + odstOrcz + uchoOd + uchoT;   // 29,5
polRamki12 = polRamki;                             // 8,5
ramkaS2Zewn = false;   // WARIANT (czeka na decyzję): ramka S2 przed uszami, serwo wsuwane wieżą od +x (review Opus r2: przy słupku S2 nie wchodzi)
luzWiezyS2 = 0.6;      // w wariancie: luz okna ramki S2 od strony wieży (wieża MG90S przechodzi przez okno)
xRamka2Ust = ramkaS2Zewn ? xRamka2 - uchoT - tRamki : xRamka2;   // 23,5 w wariancie
yFazyW1Max = yWal2 - Wsv / 2 - luzSlizg - 0.5;     // w wariancie: skos podstawy wieży 1 kończy się przed pasem S2 (dolne ucho)
plytaX     = [min(ramiona[1][0] - aRamie / 2, xRamkaP - tRamki - zapasPlyty), xRamka1 + tRamki + zapasPlyty];   // [-48,3; 47,5]
plytaY     = [min(yWal1 - polRamki12, -yWalP - polRamki), max(yWal2 + polRamki12, yWalP + polRamki)];   // [-28,1; 28,1]
jezykPol   = aRamie / 2 + 2 * luzRuch + 1;         // 6
xJezyk     = ramiona[2][0];                       // 11,6 język płyty pod trzecim ramieniem (285°: poza orczykiem serwa dolnej powieki)
jezykY     = ramiona[2][1] - aRamie / 2;           // -47,5
zOkno1     = -zPiasta - (lM5tyl - glOtwKardana) - luzObr;   // -21,95 strop okna = łeb M5 × 16
zOkno      = [zOkno1 - (hLebM5 + luzLebH), zOkno1];         // [-25,85; -21,95]
oknoSzer   = dLebM5 + 4 * luzLebR;                 // 10,5
dPiasta    = dKardan;                              // podgląd
pXucha     = pMargines;                            // 3 początek blaszki ucha od brzegu płytki
pDlUcha    = (Rg - uchoZaSkorupa) - (xUcha - uchoOdOsi) + pSkorupa;   // 13,5 blaszka + kawałek skorupy
pOtw2      = [pXucha + pDlUcha + pOdst, pSzer - pMargines];           // [20,5; 9] otwór na dwa druty
pZebroB    = [pOtw2[0] + dOtw2 / 2 + pOdst, (pSzer - tUcho) / 2];      // [25,7; 5,25] żebro B (dźwignia powieki)
pPlyta     = [pZebroB[0] + pDlB + pMargines, pSzer, pGrub];           // [36,7; 12; 2]
// przyrząd do gięcia: długości i kąty drutów z tej samej geometrii co kinematyka (położenie zerowe orczyków)
H1  = [xOrcz1, yWal1 + rOrcz1 * cos(aOrcz0), zWal + rOrcz1 * sin(aOrcz0)];   // otwór orczyka S1
H2  = [xOrcz2, yWal2 + rOrcz2 * cos(aOrcz0), zWal + rOrcz2 * sin(aOrcz0)];   // otwór orczyka S2
LdS1 = norm(H1 - [xUcha, 0, zUcho]);                   // 41,86 długość korpusu S1
LdS2 = norm(H2 - [0, xUcha, zUcho]);                   // 42,89 S2
katS2 = acos(abs(H2[0]) / LdS2);                       // 75,1° korpus S2 – odcinek przez otwór (oba końce ∥ x)
dSwLuz   = dDrut + 2 * luzObr;                        // 1,4 otwór sworznia (obrót, przełożenie)
glSwS2 = tPolicz - ePodSw;                            // 1,6 ślepy otwór sworznia w zewnętrznym policzku S2 (przy skorupie nie ma miejsca na koszulkę)
function szczelina(dO, kat) = 2 * (dO / 2 + dDrut) * sin(kat) + dDrut + 2 * luzRuch;   // oczko płaskie z drutu okrągłego, przechylone o kat
szczS1 = szczelina(dOczkaS1, katOczkaS1);             // 5,83
szczS2 = szczelina(dOczkaS2, katOczkaS2);             // 4,57
hPodSw   = dSwLuz / 2 + ePodSw;                       // 1,9 dno policzka pod osią sworznia
bS1 = Rg - uchoZaSkorupa - xUcha; zRantU = zRant - zUcho;       // 8,5 / -4: policzek S1 do skorupy i rantu (w układzie ucha)
profS1 = [[-aPolicz, uchoGora], [bS1, uchoGora], [bS1, zRantU], [xSkosS1 - hPodSw - zRantU, zRantU], [xSkosS1, -hPodSw], [-xsPolicz, -hPodSw], [-aPolicz, -hPodSw + aPolicz - xsPolicz]];
zMost = dOczkaS2 / 2 + dDrut + (dOczkaS2 - dDrut) + luzRuch;   // 3,5 spód mostka S2: oczko przesunięte o cały luz na sworzniu + luz ruchomy (review Astry)
profS2 = [[-aPolicz, zMost + tMost], [aPolicz, zMost + tMost], [aPolicz, -hPodSw + aPolicz - xsPolicz], [xsPolicz, -hPodSw], [-xsPolicz, -hPodSw], [-aPolicz, -hPodSw + aPolicz - xsPolicz]];
yMost = Rg - tg / 2 - xUcha;                          // 9: mostek S2 sięga do środka grubości skorupy
przezUcha = tZebra + zapasPrzez;                      // 2,5 przez blaszkę ucha gałki (S1, S2: koniec A)
przezDzw  = tUcho + zapasPrzez;                       // 2,0 przez dźwignię powieki (PG/PD: koniec A)
przezOrcz = grubOrcz + zapasPrzez;                    // 2,5 przez orczyk (koniec B)
zOsiPrzyrz = gPrzyrz - glRowka + dDrut / 2;           // 5,8 oś drutu leżącego w rowku
Rgiecia   = dM3 / 2 + dDrut / 2 + luzRowka;           // 2,1 promień osi drutu owiniętego na trzpieniu M3
function przezZ(kat) = 2 * Rgiecia * tan(kat / 2) + prostaZ;   // odcinek Z między narożami wirtualnymi: 90° 4,6; 75° 3,6; 81° 4,0
wRowka = dDrut + 2 * luzRowka;                         // 1,2
dOtwPrzyrz = dDrut + 2 * luzObr + luzRowka;            // 1,5
LPrzyrz = max(LdS1, LdS2) + 2 * (przezZ(90) + ogonDrut + Rgiecia) + 2 * margPrzyrz;   // 82,2 długość płytki
BPrzyrz = 5 * odstTorow + 2 * margPrzyrz;              // 67 szerokość płytki (4 tory + stanowisko haka A)

// ---------- GRANICE (asercje): przekroczenie przerywa eksport ----------
zakladkaRamieD = rRamieD - sqrt(Rpd * Rpd - xTrymD * xTrymD);   // 2,2: ramię ucha dolnej powieki zachodzi na czaszę (Rg ≤ ~30,6 przy Ø80)
assert(zakladkaRamieD >= 2 * luzRuch, str("GRANICA: ramię ucha dolnej powieki nie sięga czaszy (zakładka ", zakladkaRamieD, " mm) – za duże Rg dla otworu"));
assert(xPad + glPadM2 <= rTubaZ - e, str("GRANICA: otwór M2 przebija tubę (", xPad + glPadM2, " > ", rTubaZ, ")"));
assert(zKolPrzod - tKol > zSerwoPrzod + uchoWyst, str("GRANICA: kołnierz zachodzi na ucha serw (scianka za duża: ", scianka, ")"));
assert(zKolPrzod < -aPad - luzRuch, str("GRANICA: tuba nie obejmuje podkładek osi powiek (scianka za mała: ", scianka, ")"));

// ===================== pomocnicze =====================
module xOs() { multmatrix([[0,0,1,0],[1,0,0,0],[0,1,0,0]]) children(); }   // lokalne XY → świat (y, z), lokalne Z → świat x
function sektor(r0, r1, a0, a1, n = nSektor) = concat(
  [for (i = [0:n]) let(a = a0 + (a1 - a0) * i / n) [r1 * sin(a), r1 * cos(a)]],
  [for (i = [n:-1:0]) let(a = a0 + (a1 - a0) * i / n) [r0 * sin(a), r0 * cos(a)]]);   // punkty (y, z), kąt od +z do +y
module klepsydra(L) {   // oś wzdłuż lokalnego z, talia w 0
  cylinder(d = dTalia, h = lTalia + e, center = true, $fn = fnMale);
  for (s = [0, 1]) mirror([0, 0, s]) translate([0, 0, lTalia / 2])
    cylinder(d1 = dTalia, d2 = dTalia + 2 * L * tan(katKlep), h = L, $fn = fnMale);
}
// czasza: pas sfery R0..R1 między kątami a0..a1 (od +z do +y) wokół osi x
module czasza(R0, R1, a0, a1) {
  multmatrix([[0, 0, -1, 0], [sin(a0), cos(a0), 0, 0], [cos(a0), -sin(a0), 0, 0]])
    rotate_extrude(angle = a1 - a0, $fn = fnDuze) difference() {
      circle(r = R1, $fn = fnDuze); circle(r = R0, $fn = fnDuze); translate([-R1 - nad, -R1 - nad]) square([R1 + nad, 2 * (R1 + nad)]); }
}
module dzwignia(znakY) {   // 2D w (y, z): od osi do końca dźwigni, z otworem na drut
  k = [znakY * rDzw * sin(katDzwZam), rDzw * cos(katDzwZam)];
  difference() { hull() { circle(r = rDzwPiasta, $fn = fnMale); translate(k) circle(r = rDzwKoniec, $fn = fnMale); } translate(k) circle(d = dDzwOtw, $fn = fnMale); }
}

// kostka z otworem na kołek kardana: na osi „ucho → orczyk w zerze”, po stronie gałki; żebro do skorupy z dołem pod 45° (druk rantem na stole)
function osKard(lug, h) = (h - lug) / norm(h - lug);
module kostkaKardana(lug, h) {
  o = osKard(lug, h); p0 = lug - o * (LkardanM / 2 + luzKostki); p1 = p0 - o * glKolka; sk = Rg - tg / 2;
  m = (p0 + p1) / 2; dz = sk - norm(p0);
  difference() {
    intersection() { sphere(r = Rg - tg / 2, $fn = fnDuze); union() {   // przycięte do połowy grubości skorupy: nic nie wychodzi na zewnątrz gałki
      hull() { translate(p0) sphere(d = dKostki, $fn = fnSr); translate(p1) sphere(d = dKostki, $fn = fnSr); }
      hull() { translate(p0) sphere(d = dKostki, $fn = fnSr); translate(p1) sphere(d = dKostki, $fn = fnSr);
               translate(m / norm(m) * sk) sphere(d = dKostki, $fn = fnSr); translate((p0 - [0, 0, dz]) / norm(p0 - [0, 0, dz]) * sk) sphere(d = 1, $fn = fnMale); }
    } }
    hull() { translate(p0 + o * (dKostki / 2 + nad)) sphere(d = dKolka, $fn = fnMale); translate(p1) sphere(d = dKolka, $fn = fnMale); }   // kołek Ø2 na wcisk, otwór ślepy (wylot za zaokrągleniem kostki)
    hull() { translate(lug) sphere(d = dKardanM + 2 * luzRuch, $fn = fnSr); translate(p0 + o * luzKostki) sphere(d = dKardanM + 2 * luzRuch, $fn = fnSr); }   // miejsce na piastę 1 (żebro jej nie zasłania)
  }
}
module widelec(prof, szcz) { for (y0 = [szcz / 2, -szcz / 2 - tPolicz]) translate([0, y0 + tPolicz, 0]) rotate([90, 0, 0]) linear_extrude(tPolicz) polygon(prof); }   // policzki ⟂ y, sworzeń ∥ y w (0,0,0)
// uszko powieki na tylnej krawędzi czaszy, w x = 0 (s = +1 górna, −1 dolna; układ powieki zamkniętej); otwór ∥ x na drut z zagięciem L
module uszkoPow(s) {
  Rm = s > 0 ? Rpg + tp / 2 : Rpd + tp / 2;
  difference() {
    hull() { rotate([-s * katZaczP, 0, 0]) translate([0, 0, rZaczP]) rotate([0, 90, 0]) cylinder(r = rUszkaP, h = tUszkaP, center = true, $fn = fnMale);
             rotate([-s * (katKrawP - dKatUszka), 0, 0]) translate([-tUszkaP / 2, -e, Rm - tp / 2]) cube([tUszkaP, 2 * e, tp]); }
    rotate([-s * katZaczP, 0, 0]) translate([0, 0, rZaczP]) rotate([0, 90, 0]) cylinder(d = dDzwOtw, h = tUszkaP + 2 * nad, center = true, $fn = fnMale);
  }
}
// przedłużenie orczyka powieki: płytka nakładana na fabryczny orczyk; obrót blokują 2 kołki z drutu Ø1 przez otwory orczyka, środek dociska wkręt orczyka; drut w otworze na rOrczP
module PrzedluzenieOrczyka() {
  difference() {
    hull() { cylinder(r = dPiastyOrczF / 2 + 2, h = tPrzedl, $fn = fnSr); translate([rOrczP, 0, 0]) cylinder(r = rUszkaP + 1, h = tPrzedl, $fn = fnSr); }
    translate([0, 0, tPrzedl - glRowkaP]) hull() { cylinder(d = dPiastyOrczF + 2 * zapasRowkaP, h = glRowkaP + nad, $fn = fnSr);
      translate([rOrcz1 + 2.5, 0, 0]) cylinder(d = szerOrczF + 2 * zapasRowkaP, h = glRowkaP + nad, $fn = fnSr); }
    for (k = kolkiOrczF) translate([k, 0, -nad]) cylinder(d = dDzwOtw, h = tPrzedl + 2 * nad, $fn = fnMale);   // kołki Ø1 (przepchnąć drutem)
    translate([0, 0, -nad]) cylinder(d = dWkretOrcz, h = tPrzedl + 2 * nad, $fn = fnMale);
    translate([0, 0, -nad]) cylinder(d = dLebWkretOrcz, h = tPrzedl - glRowkaP - dnoPogl + nad, $fn = fnSr);   // pogłębienie pod łeb wkrętu orczyka (review Opus P2): łeb tylko 0,6 mm wyżej niż bez przedłużenia
    translate([rOrczP, 0, -nad]) cylinder(d = dDzwOtw, h = tPrzedl + 2 * nad, $fn = fnMale);
  }
}
module blaszkaUcha() {   // w płaszczyźnie (x, z), grubość wzdłuż y
  zF = zUcho - uchoDol; xP = xUcha + uchoPlP; xL = xUcha - uchoPlL; xK = xUcha - uchoOdOsi; xS = Rg - uchoZaSkorupa;
  rotate([90, 0, 0]) linear_extrude(tZebra, center = true) polygon([[xK, zF + (xL - xK)], [xL, zF], [xP, zF], [xP + (zF - zRant), zRant], [xS, zRant], [xS, zUcho + uchoGora], [xK, zUcho + uchoGora]]);
}

// ===================== części =====================
module Galka() {
  difference() {
    union() {
      rotate_extrude($fn = fnDuze) polygon(concat(
        [[0, Rg]], [for (a = [90:-krokKata:aRantZ]) [Rg * cos(a), Rg * sin(a)]], [[Rg * cos(aRantZ), zRant], [(Rg - tg) * cos(aRantW), zRant]],
        [for (a = [aRantW:krokKata:aStozek]) [(Rg - tg) * cos(a), (Rg - tg) * sin(a)]], [[uStozek, uStozek + stozekK]],
        [[zPiasta - stozekK, zPiasta], [0, zPiasta]]));
      // połączenia drutów: kostki kardanów 2/2 (S1: ucho x = xUcha, S2: y = xUcha); kołek wzdłuż osi do orczyka w zerze
      kostkaKardana([xUcha, 0, zUcho], H1); kostkaKardana([0, xUcha, zUcho], H2);
    }
    // rowek T: trzpień (podłoga), łeb nad podłogą; zamknięty od +y, wylot do wnętrza na y = yRowek
    // (przycięte do kuli Rg − skorupaRowka: koniec gniazda łba przebijał skorupę na froncie gałki – półksiężyc widoczny z przodu, 25.10)
    intersection() { sphere(r = Rg - skorupaRowka, $fn = fnDuze); union() {
      for (s = [[dTrzpM5, zPiasta - nad, podloga + nad], [dLebM5 + 2 * luzLebR, zPiasta + podloga, hLebM5 + luzLebH]])
        hull() for (y = [0, yRowek]) translate([0, y, s[1]]) cylinder(d = s[0], h = s[2], $fn = fnSr);
    } }
  }
}
module PowiekaGorna() {
  difference() {
    union() {
      czasza(Rpg, Rpg + tp, -katZam, -katZam + szerPow);
      for (s = [-1, 1]) translate([s < 0 ? -(xUchoG + tUcho) : xPlytkiG, 0, 0]) xOs() linear_extrude(xUchoG + tUcho - xPlytkiG)
        union() { circle(r = rUchoG, $fn = fnSr); polygon(sektor(0, rRamieG, sektorG[0], sektorG[1])); }
      uszkoPow(1);
    }
    sphere(r = Rpg, $fn = fnDuze);
    for (s = [-1, 1]) {
      translate([s * xUchoG, 0, 0]) rotate([0, s * 90, 0]) translate([0, 0, -lOtwOsi]) cylinder(d = dLebM2 + luzLebM2, h = lOtwOsi, $fn = fnMale);   // pogłębienie łba do x = xUchoG
      translate([s * xUchoG, 0, 0]) rotate([0, 90, 0]) cylinder(d = dOsM2, h = lOtwOsi, center = true, $fn = fnMale);
    }
  }
}
module PowiekaDolna() {
  difference() {
    union() {
      intersection() { czasza(Rpd, Rpd + tp, -(szerPow - katZam), katZam); cube([2 * xTrymD, 2 * (Rpd + tp + nad), 2 * (Rpd + tp + nad)], center = true); }
      for (s = [-1, 1]) {
        translate([s < 0 ? -(xUchoD + tUcho) : xUchoD, 0, 0]) xOs() linear_extrude(tUcho) union() {
          circle(r = rUchoD, $fn = fnSr); polygon(sektor(0, rRamieD, sektorD[0], sektorD[1])); }
        translate([s < 0 ? -xUchoD : xRamieD, 0, 0]) xOs() linear_extrude(xUchoD - xRamieD) polygon(sektor(rUchoD, rRamieD, sektorD[0], sektorD[1]));
      }
      uszkoPow(-1);
    }
    sphere(r = Rpd, $fn = fnDuze);
    for (s = [-1, 1]) translate([s * xUchoD, 0, 0]) rotate([0, 90, 0]) cylinder(d = dOsM2, h = lOtwOsi, center = true, $fn = fnMale);
  }
}
module Pierscien() {
  difference() {
    union() {
      difference() {   // tuba i kołnierz z wyciętym wnętrzem – podkładki osi dodawane PO wycięciu (review Astry K1)
        union() { translate([0, 0, zKolPrzod]) cylinder(r = rTubaZ, h = zTubaPrzod - zKolPrzod, $fn = fnDuze);
          translate([0, 0, zKolPrzod - tKol]) cylinder(d = Dkol, h = tKol, $fn = fnDuze); }
        translate([0, 0, zKolPrzod - tKol - nad]) cylinder(r = rTubaZ - tTuba, h = zTubaPrzod - zKolPrzod + tKol + 2 * nad, $fn = fnDuze);
      }
      // podkładki osi powiek: kwadrat z dołem V 45° (samonośne przy druku kołnierzem na stole), od xPad do wnętrza ścianki tuby
      for (s = [-1, 1]) translate([s > 0 ? xPad : -(rTubaZ - luzPadTuba), 0, 0]) xOs() linear_extrude(rTubaZ - luzPadTuba - xPad)
        polygon([[-aPad, 0], [-aPad, aPad], [aPad, aPad], [aPad, 0], [0, -aPad]]);
    }
    for (s = [-1, 1]) translate([s * xPad, 0, 0]) rotate([0, s * 90, 0]) translate([0, 0, -e]) cylinder(d = dPadM2, h = glPadM2 + e, $fn = fnMale);   // ślepy, M2 do dna
    for (p = ramiona) translate([p[0], p[1], 0]) { translate([0, 0, zKolPrzod - tKol - nad]) cylinder(d = dM3luz, h = tKol + 2 * nad, $fn = fnMale);
      translate([0, 0, zKolPrzod - hPoglM3]) cylinder(d = dPoglM3, h = hPoglM3 + nad, $fn = fnSr); }
    for (a = wkrety) translate([rWkr * cos(a), rWkr * sin(a), zKolPrzod - tKol - nad]) cylinder(d = dWkret, h = tKol + 2 * nad, $fn = fnMale);
  }
}
module Maskownica() { translate([0, 0, zSkorka]) difference() { cylinder(d = dMask, h = tMask, $fn = fnDuze); translate([0, 0, -nad]) cylinder(d = dMaskW, h = tMask + 2 * nad, $fn = fnDuze); } }
// ramka serwa w płaszczyźnie ⟂ osi wałka: okno korpusu (W × L + luz) i 2 otwory na wkręty fabryczne
module ramka(u0, u1, uOs, luzG = 0) {   // w lokalnym (u, z): u = współrzędna poprzeczna, z = świat z
  difference() { translate([u0, zPlyta + tPlyta]) square([u1 - u0, zRamkaGora - (zPlyta + tPlyta)]);
    translate([uOs - Wsv / 2 - luzSlizg, zSerwoTyl - luzSlizg]) square([Wsv + 2 * luzSlizg, Lsv + 2 * luzSlizg + luzG]);
    for (z = zUchSerwa) translate([uOs, z]) circle(d = dWkrSerwa, $fn = fnMale); }
}
module obrysPlyty() { polygon([[plytaX[0], plytaY[0]], [xJezyk - jezykPol, plytaY[0]], [xJezyk - jezykPol, jezykY], [xJezyk + jezykPol, jezykY], [xJezyk + jezykPol, plytaY[0]],
  [plytaX[1], plytaY[0]], [plytaX[1], plytaY[1]], [plytaX[0], plytaY[1]]]); }
module sciankaAB(a, b, z0, z1) { hull() for (q = [a, b]) translate([q[0], q[1], z0]) cylinder(d = tSciany, h = z1 - z0, $fn = fnMale); }   // pionowa ścianka między punktami a, b (rzut xy)
module UchwytSerw() {
  zRamTop = zKolPrzod - tKol;
  difference() {
    union() {
      translate([0, 0, zPlyta]) linear_extrude(tPlyta) obrysPlyty();
      translate([0, 0, zPlyta]) cylinder(d = dSlupek, h = -zPiasta - zPlyta, $fn = fnSr);
      for (p = ramiona) translate([p[0] - aRamie / 2, p[1] - aRamie / 2, zPlyta]) cube([aRamie, aRamie, zRamTop - zPlyta]);
      translate([xRamka1, 0, 0]) xOs() linear_extrude(tRamki) ramka(yWal1 - polRamki12, yWal1 + polRamki12, yWal1);
      translate([xRamka2Ust, 0, 0]) xOs() linear_extrude(tRamki) ramka(yWal2 - polRamki12, yWal2 + polRamki12, yWal2, ramkaS2Zewn ? luzWiezyS2 : 0);
      for (s = [1, -1]) translate([xRamkaP - tRamki, 0, 0]) xOs() linear_extrude(tRamki) ramka(s * yWalP - polRamki, s * yWalP + polRamki, s * yWalP);   // serwa powiek SG, SD
      // usztywnienie (użytkownik 25.10): ścianka od słupka do wieży 2 (do wieży 3 nie: blokowała wsuwanie S1 i SD, review 25.10); wieża 1 do ramek S1 i S2 (między słupkiem a wieżą 1 przechodzi pręt S1); ramki SG i SD połączone w jedną ścianę
      zDol = zPlyta + tPlyta - e;
      sciankaAB([0, 0], ramiona[1] - [0, aRamie / 2 - tSciany / 2], zDol, zRamTop);   // ścianka do dolnej krawędzi wieży 2: dalej od serwa SG
      sciankaAB(ramiona[0], [xRamka1 + tRamki / 2, yWal1 + polRamki12 - tSciany / 2], zDol, zRamTop);
      sciankaAB(ramiona[0], [xRamka2Ust + tRamki / 2, yWal2 - polRamki12 + tSciany / 2], zDol, zRamTop);
      translate([xRamkaP - tRamki, -(yWalP - polRamki) - e, zDol]) cube([tRamki, 2 * (yWalP - polRamki + e), zRamkaGora - zDol]);
      // trójkątne żebra na końcach ściany ramek SG/SD (po stronie −x, poza korpusami serw): sztywność ściany w poprzek (użytkownik 25.10)
      for (s = [1, -1]) let(yz = s * (yWalP + polRamki - tSciany / 2)) hull() { translate([xRamkaP - tRamki, yz - tSciany / 2, zDol]) cube([tRamki, tSciany, zRamkaGora - zDol]);
        translate([xRamkaP - tRamki - zebroP, yz - tSciany / 2, zDol]) cube([e, tSciany, e]); }
      // niskie żebro słupek – ramka S2 (pod zasięgiem orczyka S1): łączy prawą i lewą stronę przez słupek
      sciankaAB([0, yZebraS2], [xRamka2Ust + tRamki / 2, yZebraS2], zDol, zDol + hZebraS2);
      // skośne podstawy wież (45°), przycięte do obrysu płyty
      intersection() { translate([0, 0, zDol]) linear_extrude(fazaWiezy + e) obrysPlyty();
        if (ramkaS2Zewn) translate([0, 0, zDol]) union() { translate([plytaX[0], plytaY[0]]) cube([xRamka2Ust - plytaX[0], plytaY[1] - plytaY[0], fazaWiezy + e]);   // poza wieżą 1 bez zmian
          translate([xRamka2Ust, plytaY[0]]) cube([plytaX[1] - xRamka2Ust, yFazyW1Max - plytaY[0], fazaWiezy + e]); }   // wieża 1: skos tylko poza pasem S2
        for (q = ramiona) hull() { translate([q[0] - aRamie / 2 - fazaWiezy, q[1] - aRamie / 2 - fazaWiezy, zDol]) cube([aRamie + 2 * fazaWiezy, aRamie + 2 * fazaWiezy, e]);
          translate([q[0] - aRamie / 2, q[1] - aRamie / 2, zDol + fazaWiezy]) cube([aRamie, aRamie, e]); } }
    }
    translate([0, 0, zOkno[0]]) cylinder(d = dTrzpTyl, h = -zPiasta - zOkno[0] + nad, $fn = fnMale);                 // trzpień M5 tylnej piasty
    translate([-oknoSzer / 2, -oknoDl / 2, zOkno[0]]) cube([oknoSzer, oknoDl, zOkno[1] - zOkno[0]]);                // okno łba M5 (przelotowe wzdłuż y)
    for (p = ramiona) translate([p[0], p[1], zPlyta - nad]) cylinder(d = dM3ciasny, h = zRamTop - zPlyta + 2 * nad, $fn = fnMale);   // M3 × 16 w plastik
  }
}
module ProbkaDrutu() {   // próbka kołka kardana: 2 kostki pionowo (jak w gałce) z otworami Ø2,0 i Ø2,1 – sprawdzić wcisk drutu Ø2 i nasadzenie piasty kardana
  difference() {
    union() { cube([30, 12, pGrub]); for (i = [0, 1]) translate([8 + 14 * i, 6, 0]) cylinder(d = dKostki, h = pGrub + glKolka, $fn = fnSr); }
    for (i = [0, 1]) translate([8 + 14 * i, 6, -nad]) cylinder(d = dKolka + 0.1 * i, h = pGrub + glKolka + 2 * nad, $fn = fnMale);
  }
}
// ===================== PODGLĄD (tylko złożenie, nie do druku): serwa, orczyki w zerze, druty, piasty kardana =====================
module drut(a, b) { color("red") hull() { translate(a) sphere(d = dDrut, $fn = fnPodglad); translate(b) sphere(d = dDrut, $fn = fnPodglad); } }
module podglad() {
  color("steelblue") {
    translate([xOrcz1 + odstOrcz + wiezaH, yWal1 - Wsv / 2, zSerwoTyl]) cube([Hsv, Wsv, Lsv]);
    translate([xOrcz2 + odstOrcz + wiezaH, yWal2 - Wsv / 2, zSerwoTyl]) cube([Hsv, Wsv, Lsv]);
    for (s = [1, -1]) translate([-(odstOrcz + wiezaH + Hsv), s * yWalP - Wsv / 2, zSerwoTyl]) cube([Hsv, Wsv, Lsv]);
  }
  color("gray") translate([0, 0, -zPiasta]) cylinder(d = dPiasta, h = 2 * zPiasta);
  h1 = [xOrcz1, yWal1 + rOrcz1 * cos(aOrcz0), zWal + rOrcz1 * sin(aOrcz0)];
  h2 = [xOrcz2, yWal2 + rOrcz2 * cos(aOrcz0), zWal + rOrcz2 * sin(aOrcz0)];
  hp = [for (s = [1, -1]) [0, s * (yWalP + rOrczP), zWal]];   // orczyki powiek w zerze (ramię na zewnątrz, ±y)
  color("black") { hull() { translate([xOrcz1, yWal1, zWal]) sphere(d = grubOrcz); translate(h1) sphere(d = grubOrcz); }
    hull() { translate([xOrcz2, yWal2, zWal]) sphere(d = grubOrcz); translate(h2) sphere(d = grubOrcz); }
    for (s = [0, 1]) hull() { translate([0, (1 - 2 * s) * yWalP, zWal]) sphere(d = grubOrcz); translate(hp[s]) sphere(d = grubOrcz); } }
  drut([xUcha, 0, zUcho], h1); drut([0, xUcha, zUcho], h2);
  for (s = [1, -1]) drut(uszkoP(s, 0), orczP(s, alfaP(0)));
}

// ===================== części w orientacji do druku =====================
module naStol() { difference() { children(); translate([-Dkol, -Dkol, -Dkol]) cube([2 * Dkol, 2 * Dkol, Dkol]); } }   // ścięcie poniżej stołu (stopki)
module druk(c) {
  if (c == "Galka") translate([0, 0, -zRant]) Galka();
  else if (c == "PowiekaGorna") naStol() translate([0, 0, rUchoG - stopka]) rotate([szerPow / 2 - katZam, 0, 0]) PowiekaGorna();
  else if (c == "PowiekaDolna") naStol() translate([0, 0, rUchoD - stopka]) rotate([-(szerPow / 2 - katZam), 0, 0]) PowiekaDolna();
  else if (c == "Pierscien") translate([0, 0, -(zKolPrzod - tKol)]) Pierscien();
  else if (c == "Maskownica") translate([0, 0, -zSkorka]) Maskownica();
  else if (c == "UchwytSerw") translate([0, 0, -zPlyta]) UchwytSerw();
  else if (c == "ProbkaDrutu") ProbkaDrutu();
  else if (c == "PrzedluzenieOrczyka") for (k = [0, 1]) translate([0, k * (2 * dPiastyOrczF), 0]) PrzedluzenieOrczyka();   // 2 sztuki (SG, SD), rowkiem do góry
}
module wPolozeniu(c) {
  if (c == "Galka") Galka(); else if (c == "PowiekaGorna") PowiekaGorna(); else if (c == "PowiekaDolna") PowiekaDolna();
  else if (c == "Pierscien") Pierscien(); else if (c == "Maskownica") Maskownica(); else if (c == "UchwytSerw") UchwytSerw(); else if (c == "ProbkaDrutu") ProbkaDrutu();
}

// parametry dla skryptów (duze-oko-kinematyka.js, duze-oko-kolizje.js): openscad -o x.echo -D 'czesc="parametry"' duze-oko-v2.scad
if (czesc == "parametry") echo(str("PARAMETRY{\"lug1\":[", xUcha, ",0,", zUcho, "],\"lug2\":[0,", xUcha, ",", zUcho, "],",
  "\"s1\":{\"xh\":", xOrcz1, ",\"ys\":", yWal1, ",\"zs\":", zWal, ",\"r\":", rOrcz1, ",\"a0\":", aOrcz0, "},",
  "\"s2\":{\"xh\":", xOrcz2, ",\"ys\":", yWal2, ",\"zs\":", zWal, ",\"r\":", rOrcz2, ",\"a0\":", aOrcz0, "},",
  "\"pow\":{\"r\":", rOrczP, ",\"yWal\":", yWalP, ",\"zs\":", zWal, ",\"rZacz\":", rZaczP, ",\"katZacz\":", katZaczP, ",\"skok\":", skok, ",\"xRamka\":", xRamkaP, "},",
  "\"druty\":{\"osS2\":0,\"szczS1\":", szczS1, ",\"szczS2\":", szczS2, ",\"rOczkaS1\":", dOczkaS1 / 2 + dDrut / 2, ",\"rOczkaS2\":", dOczkaS2 / 2 + dDrut / 2, ",\"dOczkaS1\":", dOczkaS1, ",\"dOczkaS2\":", dOczkaS2, ",\"zMost\":", zMost, ",\"tPolicz\":", tPolicz, ",\"srodekZ\":", srodekZ, ",\"tolZ\":", tolZ, ",\"ogonZ\":", ogonZ, ",\"ramieV\":", ramieV, ",\"tZebra\":", tZebra, ",\"tUcho\":", tUcho,
  ",\"xUchoG\":", xUchoG, ",\"xUchoD\":", xUchoD, ",\"dKoszulki\":", dKoszulki, ",\"lKoszulki\":", lKoszulki, ",\"grubOrcz\":", grubOrcz, "},",
  "\"sv\":{\"odstOrcz\":", odstOrcz, ",\"wiezaH\":", wiezaH, ",\"Hsv\":", Hsv, ",\"Wsv\":", Wsv, ",\"zP\":", zSerwoPrzod, ",\"zT\":", zSerwoTyl,
  ",\"uchoOd\":", uchoOd, ",\"uchoT\":", uchoT, ",\"uchoWyst\":", uchoWyst, ",\"grubOrcz\":", grubOrcz, ",\"rWiezy\":", rWiezy, ",\"szerOrcz\":", szerOrcz, ",\"rPiastyOrcz\":", rPiastyOrcz, ",\"dlOrcz\":", dlOrcz, "},",
  "\"Rg\":", Rg, ",\"xLeb\":", xLeb, ",\"hLebM2\":", hLebM2, ",\"dLebM2\":", dLebM2, ",\"zPiasta\":", zPiasta, ",\"dKardan\":", dKardan,
  ",\"zRant\":", zRant, ",\"dDrut\":", dDrut, ",\"dlWidelek\":", dlWidelek, ",\"luzObr\":", luzObr, ",\"oczekiwane\":{\"Galka\":", Rg + tylRant, ",\"Pierscien\":", zTubaPrzod - (zKolPrzod - tKol), ",\"UchwytSerw\":", max(-zPiasta, zKolPrzod - tKol) - zPlyta, ",\"Maskownica\":", tMask, "}}"));
else if (czesc == "zlozenie") { color("white") Galka(); color("orange") { PowiekaGorna(); PowiekaDolna(); Pierscien(); UchwytSerw(); } color("darkorange") Maskownica(); podglad(); }
else if (tryb == "druk") druk(czesc);
else wPolozeniu(czesc);
