// Podstawka pod dynię – model parametryczny (OpenSCAD 2021.01), 25.10.2026, projektant podstawki.
// Koncepcja: 20-analizy/2026-10-25-podstawka-koncepcja.md (v5.1 + łączniki RJ45 w dyni). Rendery: 40-cad/narzedzia/podstawka-blender-render.py.
// Układ: x w prawo (patrząc na dynię od przodu), y do tyłu, z w górę; początek = lewy przedni narożnik podstawki na stole. Wymiary w mm.
// Zasada: każda liczba geometrii jest zmienną w sekcji „zmienne”; w modułach tylko zmienne, 0, ±1, 1/2 i kąty 90/120/180/360.
// Eksport: bash podstawka-eksport.sh albo
//   openscad -o <plik>.3mf -D 'czesc="Szuflada"' -D 'tryb="druk"' podstawka.scad
//   czesc: Szuflada | SzufladaL | SzufladaP | Kaseta | Tuleja | Nakretka | OslonkaPIR | ProbkaTuleja | ProbkaNakretka
//          | Plyta | ScianaBoczna | ScianaTylna (sklejka, do rysunku cięcia) | parametry | zlozenie
//   tryb:  druk (płaska strona na stole, z ≥ 0) | zlozenie (położenie w podstawce)

czesc = "zlozenie";
tryb = "zlozenie";

// ===================== zmienne =====================
// BAZOWE: części kupne, luzy z tabeli AGENTS.md i decyzje (rozmiary, odstępy). POCHODNE: położenia i wymiary wynikowe.
// Test zginania: wtyk 30 / 60, hDoc 30 / 60, pbW 75, pbL 150 (podstawka-zginanie.sh).

// ---------- BAZOWE: dynia (mierzone przy montażu) ----------
hDoc     = 45;      // wysokość dna wnętrza dyni przy otworze nad wierzchem płyty (mierzona, gdy dynia stoi na płycie)
nadDnem  = 10;      // tuleja wystaje ponad dno wnętrza (nakrętka + 2)
otwDyni  = 80;      // otwór w dnie dyni (otwornica 80)
// ---------- BAZOWE: sklejka ----------
tPl      = 18;      // płyta górna i ścianki
// ---------- BAZOWE: powerbank Baseus i kabel ----------
pbL = 160; pbW = 70; pbH = 32;          // PRD §5; USB-C na środku krótszej ścianki
wtyk     = 50;      // wtyk USB-C z osłoną i gięciem kabla (decyzja użytkownika 25.10: przyjąć 50)
// ---------- BAZOWE: PIR HC-SR501 (typowe wymiary z kart modułu, szacunek) ----------
pirW = 32; pirH = 24; pirT = 1.6; pirKop = 23;
kieszenPIR = 25;    // kieszeń za czołem (potencjometry i zworka z tyłu płytki)
pirX     = 40;      // oś PIR od lewego boku szufladki
pirNadDnem = 0;     // płytka PIR stoi na dnie szufladki (oś kopułki = środek płytki)
// ---------- BAZOWE: elektronika (typowe płytki, szacunek) ----------
pcaL = 62; pcaW = 25; pcaOtwX = 55.9; pcaOtwY = 19.05; dPcaOtw = 3;   // PCA9685: płytka, rozstaw i Ø otworów
espL = 22.5; espW = 18; espH = 4;                                     // ESP32-C3 SuperMini (z gniazdem USB-C)
kondD = 10;                                                           // kondensator 470–1000 µF
// ---------- BAZOWE: druk – szufladka ----------
sc = 2.4; dnoSz = 2; scH = 30;          // ścianka, dno, wysokość ścianek
czoloT = 3; zakladka = 8;               // czoło: grubość, zakładka na przednie krawędzie ścianek bocznych
uchwytL = 50; uchwytWys = 8; uchwytOdGory = 4;   // uchwyt: długość, wysięg (klin 45°), odstęp od górnej krawędzi czoła
slupekW = 4; slupekH = 12; slupekL = 8;          // słupki zatrzymujące powerbank z prawej
zebroT = 3; zebroH = 8; zebroOdKrawedzi = 10;    // żebra łączenia połówek (wariant A1 mini)
wcCiecie = 12; wcDno = 10;                       // wycięcie na kable w tylnej ściance: szerokość, wysokość dna nad dnem szufladki
wcOdBoku = 4;                                    // wycięcie od prawego boku
// ---------- BAZOWE: stan wykonany 25.10 (użytkownik): dno 6 sklejone ze ściankami 40, płyta 18 na 4 wkrętach, otwór Ø45 ----------
tDno = 6;                                        // dno ze sklejki (szufladka i kaseta stoją na dnie)
H_IN = 40;                                       // wysokość ścianek (wnętrze)
dOtwPl = 60;                                     // otwór w płycie górnej, jak wykonany (skrętki z wtykami RJ45)
wkrPlOd = 30;                                    // 4 wkręty płyty górnej w ścianki boczne: od przodu i tyłu
dWkretSkl = 3.5; dLebSkl = 6.5;                  // otwór przelotowy w sklejce lub w druku i pogłębienie łba
// ---------- BAZOWE: blokada szufladki (P5, decyzja użytkownika: śruba M4 imbusowa) ----------
blokL = 25; dBlok = 4.5; dBlokPilot = 3.3; blokOtwG = 22;   // M4 × 25 imbus przez prawy kołnierz czoła (otwór luźny Ø4,5) w przednią krawędź prawej ścianki;
                                                 // w sklejce otwór dBlokPilot (Ø3,3) na blokOtwG (= 25 − kołnierz 3), gwint wycina śruba (otwór Ø3,3 jak pod gwintownik M4; łeb Ø7 opiera się płasko o kołnierz)
// ---------- BAZOWE: mocowanie kasety do dna ----------
wkrDnoL = 12; wkrDnoZapas = 1; kPiastaD = 9; kPiastaOd = 8;   // wkręty 3 × 12 w dno 6: zapas do spodu dna, piasty pod łby, od brzegów kasety
// ---------- BAZOWE: druk – kaseta elektroniki ----------
kW = 170; kD = 100; kDno = 2.4; kScH = 10;       // szerokość, głębokość, dno, niskie boki
kTylH = 25; kTylT = 3;                           // tylny pas (ogranicznik o ściankę tylną)
slupPcaD = 6; slupPcaH = 5;                      // słupki PCA9685
espRama = 1.5; espRamaH = 4;                     // ramka ESP32-C3
pcaOdTylu = 12; espOdBoku = 15; kondOdPca = 15; // położenia na dnie kasety (kondensator: od prawego brzegu PCA9685)
bkL = 20; bkW = 15; bkGn = 9.5;                  // gniazdo zasilania USB-C (breakout, szacunek): długość, szerokość, otwór na gniazdo (8,94 + luz)
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
// ---------- BAZOWE: osłonka PIR (opcja) ----------
oslL = 20; oslRw = 13; oslT = 2;                 // rurka bez kołnierza, przyklejana CA do czoła; ścięta płasko na poziomie stołu
// ---------- BAZOWE: luzy (AGENTS.md) ----------
luzSz    = 1.5;     // szufladka między ściankami ze sklejki (piła stołowa ±0,5) – na stronę
luzPb    = 1;       // powerbank w komorze – na stronę
luzSlizg = 0.3;     // płytka PIR w rowkach, ESP w ramce
luzKop   = 0.5;     // kopułka PIR w otworze czoła – na promieniu
luzGwint = 0.20;    // gwint 45° skok 5 (próbka E2.0)
odstSzKas = 2;      // szufladka – kaseta
luzKasTyl = 1;      // kaseta – ścianka tylna
luzKasBok = 1;      // kaseta – prawa ścianka boczna (kaseta dosunięta w prawo, pod wycięcie kablowe szufladki)
dM3 = 3.3; dM3ciasny = 2.6;
zak = 0.01;         // zakładka brył (elementy na dnie wchodzą w dno, żeby siatka była jedną bryłą)
szczSeam = 1;       // podział połówek 1 mm za słupkami powerbanku

// ===================== POCHODNE =====================
szNad  = tDno;                                   // dno szufladki nad stołem
luzPodPl = H_IN - dnoSz - pbH;                   // od wierzchu powerbanku do spodu płyty (6)
Z_PL   = tDno + H_IN + tPl;                      // wierzch płyty (64)
szInW  = luzPb + pbL + wtyk;                     // wnętrze szufladki w x (211)
szW    = szInW + 2 * sc;                         // 215,8
pbY0   = kieszenPIR + sc + luzPb;                // początek powerbanku w y (od czoła)
szD    = pbY0 + pbW + luzPb + sc;                // głębokość korpusu szufladki bez czoła (101,8)
szX0   = tPl + luzSz;                            // położenie szufladki w podstawce
SZ     = 2 * tPl + 2 * luzSz + szW;              // szerokość podstawki (254,8)
kY0    = szD + odstSzKas;                        // przód kasety
DL     = kY0 + kD + luzKasTyl + tPl;             // głębokość podstawki (222,8)
czH    = H_IN - 1;                               // wysokość czoła (od dna szufladki)
pirZ   = dnoSz + pirNadDnem + pirH / 2;          // oś PIR nad dnem szufladki (nad stołem: + szNad)
pirSzcz = pirT + 2 * luzSlizg;                   // szczelina na płytkę PIR
xPort  = sc + luzPb + pbL;                       // czoło portu powerbanku (x w szufladce)
zPort  = dnoSz + pbH / 2;                        // oś portu
xSeam  = xPort + luzPb + slupekW + szczSeam;     // podział połówek (wariant A1 mini)
rc     = gwD / 2 - zarys;                        // promień rdzenia gwintu
tulH   = hDoc + kolT + nadDnem;                  // wysokość tulei nad płytą: dynia leży na kołnierzu (hDoc mierzone bez tulei)
cx = SZ / 2; cy = DL / 2;                        // środek dyni = środek podstawki
kX0    = SZ - tPl - luzKasBok - kW;              // kaseta przy prawej ściance
kPiastaH = wkrDnoL - (tDno - wkrDnoZapas) - kDno;  // piasty pod łby wkrętów kasety (4,6)
xBlok  = szW + luzSz + tPl / 2;                  // oś wkrętu blokady w szufladce (środek grubości prawej ścianki)
bkX    = szX0 + szW - sc - wcOdBoku - wcCiecie / 2 - kX0;   // oś gniazda zasilania w kasecie = oś wycięcia kablowego szufladki
bkY    = szD + wtyk - kY0;                        // przód gniazda: wtyk z kablem mieści się za szufladką

assert(dnoSz + pirNadDnem + pirH <= czH, "PIR nie mieści się w czole");
assert(pirZ > 0, "oś PIR pod stołem");
assert(tulRw < rc - 2, "ścianka tulei < 2");
assert(gwD / 2 < otwDyni / 2, "tuleja nie wchodzi w otwór dyni");
assert(kW <= SZ - 2 * tPl, "kaseta szersza niż wnętrze");
assert(luzPodPl >= 2, "powerbank za blisko płyty");
assert(dOtwPl < 2 * tulRw, "otwór w płycie większy niż w tulei");
assert(bkX + bkW / 2 + espRama + luzSlizg <= kW, "gniazdo zasilania poza kasetą");

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

module szuflada() {   // korpus w układzie szufladki: x od lewego boku, y od tylnej płaszczyzny czoła (czoło w y < 0)
  difference() {
    union() {
      translate([0, kieszenPIR, 0]) cube([szW, sc, scH + dnoSz]);            // przegroda: tył kieszeni PIR
      cube([szW, szD, dnoSz]);                                               // dno
      for (x = [0, szW - sc]) translate([x, 0, 0]) cube([sc, szD, scH + dnoSz]);   // boki
      translate([0, szD - sc, 0]) cube([szW, sc, scH + dnoSz]);              // tył
      translate([-zakladka - luzSz, -czoloT, 0]) cube([szW + 2 * luzSz + zakladka + tPl, czoloT, czH]);   // czoło: z prawej zachodzi na całą przednią krawędź ścianki (blokada)
      translate([szW / 2 + uchwytL / 2, -czoloT, czH - uchwytOdGory]) rotate([0, -90, 0])   // uchwyt: klin 45°
        linear_extrude(height = uchwytL) polygon([[0, 0], [0, -uchwytWys], [-uchwytWys, 0]]);
      for (s = [-1, 1]) let(xr = pirX + s * (pirW / 2 + luzSlizg))           // prowadnice płytki PIR (zachodzą sc na krawędź płytki)
        translate([xr - sc, 0, dnoSz - zak]) cube([2 * sc, pirSzcz + sc, scH + zak]);
      for (y = [pbY0, szD - sc - slupekL]) translate([xPort + luzPb, y, 0]) cube([slupekW, slupekL, dnoSz + slupekH]);   // słupki pb
    }
    translate([pirX, -czoloT - 1, pirZ]) rotate([-90, 0, 0]) cylinder(d = pirKop + 2 * luzKop, h = czoloT + 2, $fn = 64);   // kopułka
    translate([xBlok, -czoloT - 1, czH / 2]) rotate([-90, 0, 0])   // blokada: otwór luźny M4 w kołnierzu czoła
      cylinder(d = dBlok, h = czoloT + 2, $fn = 32);
    translate([pirX - pirKop / 2 - luzKop, -czoloT - 1, dnoSz]) cube([pirKop + 2 * luzKop, czoloT + 2, czH]);   // wycięcie od dna do góry: kopułka z kwadratową podstawą (ok. 23 × 23) wsuwa się z płytką
    translate([pirX - pirW / 2 - luzSlizg, 0, dnoSz]) cube([pirW + 2 * luzSlizg, pirSzcz, czH]);   // szczelina na płytkę PIR za czołem
    translate([szW - sc - wcOdBoku - wcCiecie, szD - sc - 1, dnoSz + wcDno]) cube([wcCiecie, sc + 2, scH]);   // wycięcie na kable
  }
}

module zebra(strona) {   // żebra łączenia połówek z 2 otworami M3 (strona −1: lewa połówka, +1: prawa)
  difference() {
    translate([strona < 0 ? xSeam - zebroT : xSeam, sc - zak, dnoSz - zak]) cube([zebroT, szD - 2 * sc + 2 * zak, zebroH + zak]);
    for (y = [pbY0 + slupekL + zebroOdKrawedzi, szD - sc - slupekL - zebroOdKrawedzi])   // otwory M3 poza słupkami powerbanku
      translate([xSeam - zebroT - 1, y, dnoSz + zebroH / 2]) rotate([0, 90, 0]) cylinder(d = dM3, h = 2 * zebroT + 2, $fn = 24);
  }
}

module polowka(strona) {   // −1 lewa (x < xSeam), +1 prawa
  union() {
    intersection() {
      szuflada();
      translate([strona < 0 ? xSeam - 2 * SZ : xSeam, -SZ, -1]) cube([2 * SZ, 2 * SZ, 2 * SZ]);
    }
    zebra(strona);
  }
}

module kaseta() {   // układ kasety: x od lewego boku, y od przodu kasety
  difference() {
    union() {
      cube([kW, kD, kDno]);
      for (x = [0, kW - sc]) translate([x, 0, 0]) cube([sc, kD, kScH]);
      translate([0, kD - kTylT, 0]) cube([kW, kTylT, kTylH]);                       // tylny pas
      translate([kW / 2 - pcaL / 2, kD - kTylT - pcaOdTylu - pcaW, kDno - zak])    // słupki PCA9685
        for (dx = [0, pcaOtwX], dy = [0, pcaOtwY]) translate([(pcaL - pcaOtwX) / 2 + dx, (pcaW - pcaOtwY) / 2 + dy, 0])
          cylinder(d = slupPcaD, h = slupPcaH + zak, $fn = 24);
      translate([espOdBoku - espRama, espOdBoku - espRama, kDno - zak])              // ramka ESP32-C3, gniazdo USB-C do przodu
        difference() {
          cube([espW + 2 * (espRama + luzSlizg), espL + 2 * (espRama + luzSlizg), espRamaH]);
          translate([espRama, espRama, -1]) cube([espW + 2 * luzSlizg, espL + 2 * luzSlizg, espRamaH + 2]);
          translate([espRama + luzSlizg + espW / 2 - bkGn / 2, -1, -1]) cube([bkGn, espRama + 2, espRamaH + 2]);   // wyjście gniazda USB-C
        }
      translate([bkX - bkW / 2 - espRama - luzSlizg, bkY - espRama - luzSlizg, kDno - zak])   // ramka gniazda zasilania USB-C, wejście do przodu
        difference() {
          cube([bkW + 2 * (espRama + luzSlizg), bkL + 2 * (espRama + luzSlizg), espRamaH]);
          translate([espRama, espRama, -1]) cube([bkW + 2 * luzSlizg, bkL + 2 * luzSlizg, espRamaH + 2]);
          translate([espRama + luzSlizg + bkW / 2 - bkGn / 2, -1, -1]) cube([bkGn, espRama + 2, espRamaH + 2]);   // otwór na gniazdo USB-C
        }
      for (x = [kPiastaOd, kW - kPiastaOd], y = [kPiastaOd, kD - kTylT - kPiastaOd]) translate([x, y, kDno - zak])   // piasty pod wkręty w dno
        cylinder(d = kPiastaD, h = kPiastaH + zak, $fn = 32);
      translate([kW / 2 + pcaL / 2 + kondOdPca, kD - kTylT - pcaOdTylu - pcaW / 2, kDno - zak]) difference() {   // pierścień kondensatora
        cylinder(d = kondD + 2 * (espRama + luzSlizg), h = espRamaH, $fn = 48);
        translate([0, 0, -1]) cylinder(d = kondD + 2 * luzSlizg, h = espRamaH + 2, $fn = 48);
      }
    }
    translate([kW / 2 - pcaL / 2, kD - kTylT - pcaOdTylu - pcaW, kDno])
      for (dx = [0, pcaOtwX], dy = [0, pcaOtwY]) translate([(pcaL - pcaOtwX) / 2 + dx, (pcaW - pcaOtwY) / 2 + dy, -kDno - 1])
        cylinder(d = dM3ciasny, h = slupPcaH + kDno + 2, $fn = 24);
    for (x = [kPiastaOd, kW - kPiastaOd], y = [kPiastaOd, kD - kTylT - kPiastaOd]) translate([x, y, -1])   // 4 wkręty 3 × 12 w dno ze sklejki
      cylinder(d = dWkretSkl, h = kDno + kPiastaH + 2, $fn = 24);
  }
}

module oslonka() {   // druk na stojąco (oś z); w użyciu oś poziomo, „dół” = −y, ścięty na poziomie stołu (pirZ pod osią)
  intersection() {
    difference() {
      cylinder(r = oslRw + oslT, h = oslL, $fn = 64);
      translate([0, 0, -1]) cylinder(r = oslRw, h = oslL + 2, $fn = 64);
    }
    translate([-(oslRw + oslT), -(pirZ + szNad), 0]) cube([2 * (oslRw + oslT), oslRw + oslT + pirZ + szNad, oslL]);   // (oś PIR pirZ + szNad nad stołem)
  }
}

// ===================== sklejka =====================
module plyta() difference() {                   // 4 wkręty w ścianki boczne (od góry), otwór na skrętki
  cube([SZ, DL, tPl]);
  translate([cx, cy, -1]) cylinder(d = dOtwPl, h = tPl + 2, $fn = 120);
  for (x = [tPl / 2, SZ - tPl / 2], y = [wkrPlOd, DL - wkrPlOd]) translate([x, y, -1]) cylinder(d = dWkretSkl, h = tPl + 2, $fn = 24);
}
module dno() cube([SZ, DL, tDno]);
module scianaBoczna() cube([tPl, DL, H_IN]);
module scianaTylna() cube([SZ - 2 * tPl, tPl, H_IN]);

// ===================== rysunek cięcia (2D, widok z góry, wymiary w tekście) =====================
rysOdst = 40; rysTekst = 9; rysLinia = 0.8;
module wymiar(dl, tekst, obrot = 0) rotate(obrot) {   // linia wymiarowa wzdłuż x od 0 do dl, tekst nad nią
  translate([0, -rysLinia / 2]) square([dl, rysLinia]);
  for (x = [0, dl]) translate([x - rysLinia / 2, -rysTekst / 2]) square([rysLinia, rysTekst]);
  translate([dl / 2, rysTekst / 2]) text(tekst, size = rysTekst, halign = "center");
}
module obrys(w, h) difference() { square([w, h]); translate([rysLinia, rysLinia]) square([w - 2 * rysLinia, h - 2 * rysLinia]); }
module rysunekCiecia() {
  // płyta górna
  obrys(SZ, DL);
  translate([cx, cy]) difference() { circle(d = dOtwPl, $fn = 96); circle(d = dOtwPl - 2 * rysLinia, $fn = 96); }
  translate([cx, cy - dOtwPl / 2 - rysTekst * 2]) text(str("otwór Ø", dOtwPl, " w środku"), size = rysTekst, halign = "center");
  for (x = [tPl / 2, SZ - tPl / 2], y = [wkrPlOd, DL - wkrPlOd]) translate([x, y]) circle(d = dWkretSkl, $fn = 24);
  translate([SZ / 2, wkrPlOd - rysTekst / 2]) text(str("4 wkręty w ścianki: ", tPl / 2, " od boku, ", wkrPlOd, " od przodu i tyłu"), size = rysTekst * 0.6, halign = "center");
  translate([SZ / 2, DL / 2 + tulRw + rysTekst]) text(str("PŁYTA GÓRNA ", tPl, " mm × 1"), size = rysTekst, halign = "center");
  translate([SZ / 2, DL - wkrPlOd - rysTekst]) text(str("DNO ", tDno, " mm: ", SZ, " × ", DL, " (pod całością, sklejone ze ściankami)"), size = rysTekst * 0.6, halign = "center");
  translate([0, DL + rysTekst * 2]) wymiar(SZ, str(SZ));
  translate([SZ + rysTekst * 2, 0]) wymiar(DL, str(DL), 90);
  // ścianki boczne (2 szt.) i tylna
  translate([0, -rysOdst - H_IN]) { obrys(DL, H_IN);
    translate([DL / 2, H_IN / 2]) text(str("ŚCIANKA BOCZNA ", tPl, " mm × 2"), size = rysTekst * 0.8, halign = "center");
    translate([DL / 2, H_IN / 2 - rysTekst * 1.2]) text(str("prawa: w przedniej krawędzi otwór Ø", dBlokPilot, " × ", blokOtwG, " (M4 blokady), ", tPl / 2, " od boku, ", czH / 2, " od dołu"), size = rysTekst * 0.55, halign = "center");
    translate([0, -rysTekst * 2]) wymiar(DL, str(DL)); translate([DL + rysTekst * 2, 0]) wymiar(H_IN, str(H_IN), 90); }
  translate([0, -2 * rysOdst - 2 * H_IN - rysTekst * 2]) { obrys(SZ - 2 * tPl, H_IN); translate([(SZ - 2 * tPl) / 2, H_IN / 2 - rysTekst / 2]) text(str("ŚCIANKA TYLNA ", tPl, " mm × 1"), size = rysTekst, halign = "center");
    translate([0, -rysTekst * 2]) wymiar(SZ - 2 * tPl, str(SZ - 2 * tPl)); translate([SZ - 2 * tPl + rysTekst * 2, 0]) wymiar(H_IN, str(H_IN), 90); }
}

// ===================== złożenie =====================
module zlozenie() {
  color("BurlyWood") {
    dno();
    translate([0, 0, tDno + H_IN]) plyta();
    translate([0, 0, tDno]) { scianaBoczna(); translate([SZ - tPl, 0, 0]) scianaBoczna(); translate([tPl, DL - tPl, 0]) scianaTylna(); }
  }
  color("LightGreen") translate([szX0, 0, szNad]) szuflada();   // szufladka jeździ po dnie ze sklejki
  color("DimGray") translate([szX0 + sc + luzPb, pbY0, dnoSz + szNad]) cube([pbL, pbW, pbH]);
  color("Orange") translate([kX0, kY0, tDno]) kaseta();
  color("Orange") translate([cx, cy, Z_PL]) tuleja();
  color("Orange") translate([cx, cy, Z_PL + hDoc]) nakretka();
}

// ===================== wybór części =====================
if (czesc == "parametry")
  echo(str("PARAMETRY{\"SZ\":", SZ, ",\"DL\":", DL, ",\"H\":", Z_PL, ",\"H_IN\":", H_IN, ",\"szW\":", szW, ",\"szD\":", szD,
           ",\"xSeam\":", xSeam, ",\"tulH\":", tulH, ",\"oczekiwane\":{\"Szuflada\":[", szW + 2 * luzSz + zakladka + tPl, ",", szD + czoloT + uchwytWys, ",", czH,
           "],\"SzufladaL\":[", xSeam + zakladka + luzSz, ",", szD + czoloT + uchwytWys, ",", czH,
           "],\"SzufladaP\":[", szW - xSeam + luzSz + tPl, ",", szD + czoloT, ",", czH,
           "],\"Tuleja\":[", 2 * kolR, ",", 2 * kolR, ",", tulH, "],\"Kaseta\":[", kW, ",", kD, ",", kTylH, "],\"Nakretka\":[", 2 * nakR, ",", nakR * sqrt(3), ",", nakH, "]}}"));
else if (czesc == "zlozenie") zlozenie();
else if (czesc == "Szuflada") szuflada();
else if (czesc == "SzufladaL") polowka(-1);
else if (czesc == "SzufladaP") polowka(1);
else if (czesc == "Kaseta") kaseta();
else if (czesc == "Tuleja") tuleja();
else if (czesc == "Nakretka") nakretka();
else if (czesc == "OslonkaPIR") oslonka();
else if (czesc == "ProbkaTuleja") tuleja(probkaH, probkaKolR, false);
else if (czesc == "ProbkaNakretka") nakretka(probkaNakR);
else if (czesc == "Plyta") plyta();
else if (czesc == "ScianaBoczna") scianaBoczna();
else if (czesc == "ScianaTylna") scianaTylna();
else if (czesc == "Dno") dno();
else if (czesc == "RysunekCiecia") rysunekCiecia();
