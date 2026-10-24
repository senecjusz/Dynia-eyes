// Duże oko v2 – model parametryczny (OpenSCAD 2021.01), noc 24/25.10.2026, projektant.
// Plan: 40-cad/onshape/duze-oko-v2-plan.md; poprawki po review Astry i stan: 30-projekt/raport-nocny-2026-10-25.md.
// Układ: x w prawo (patrząc na dynię), y w górę, z do przodu; środek gałki = (0,0,0). Wymiary w mm, kąty w stopniach.
// Zasada: każda liczba geometrii jest zmienną w sekcji „zmienne”; w modułach tylko zmienne, 0, ±1 (znak), 1/2 i kąty 90/180/360.
// Eksport: bash eksport.sh (3MF na część + zbiorczy) albo
//   openscad -o <plik>.3mf -D 'czesc="Galka"' -D 'tryb="druk"' duze-oko-v2.scad
//   czesc: Galka | PowiekaGorna | PowiekaDolna | Pierscien | Maskownica | UchwytSerw | ProbkaDrutu | zbiorczy | zlozenie
//   tryb:  druk (płaska strona na stole, z ≥ 0) | zlozenie (położenie w module)

czesc = "zlozenie";
tryb = "zlozenie";

// ===================== zmienne =====================
// --- ogólne ---
scianka  = 40;      // grubość ścianki dyni przy otworze; tuba = scianka + wystTuby, ramiona Uchwytu z niej liczone; zakres 28–50
luzObr   = 0.2;     // luz obrotowy i osiowy (AGENTS: 0,2)
luzSlizg = 0.3;     // luz ślizgowy / okna korpusów serw (AGENTS: 0,25–0,3)
nad      = 1;       // naddatek cięć (żeby cięcia przechodziły przez ściankę)
e        = 0.01;    // zakładka brył (unika ścianek zerowej grubości)
fnDuze   = 192;  fnSr = 64;  fnMale = 24;  krokKata = 1;  nSektor = 48;
// --- gałka ---
Rg = 30; tg = 2; zRant = -8;
zPiasta  = 12.75;   // czoło przedniej piasty kardana (25,5 / 2)
dPiasta  = 11;      // tylko podgląd
stozekK  = 7;       // tworząca stożka: r = z − stozekK (45°), wierzchołek r 5,75 na z = zPiasta
uStozek  = (-stozekK + sqrt(2 * (Rg - tg) * (Rg - tg) - stozekK * stozekK)) / 2;   // styk stożka ze skorupą (r 15,99; z 22,99)
aStozek  = atan2(uStozek + stozekK, uStozek);
aRantZ   = asin(zRant / Rg);  aRantW = asin(zRant / (Rg - tg));
dTrzpM5  = 5.5;     // szczelina trzpienia M5 (M5 × 12: 7 w piaście, 5 w podłodze)
podloga  = 5.5;     // podłoga między piastą a łbem: M5 × 12 wchodzi w piastę na 6,5 z 7 mm; piasta dociśnięta do stożka, łeb do podłogi, potem M4 (docisk)
dLebM5   = 9.5;  hLebM5 = 3.5;      // łeb krzyżakowy M5 (założenie)
luzLebR  = 0.25; luzLebH = 0.4;     // luz łba w rowku: promieniowo, wysokość
yRowek   = -16;     // wylot rowka T do wnętrza gałki
xUcha    = 20;  zUcho = -4;         // ucha drutów: odległość od osi, wysokość
// blaszka ucha (płytka grub. tZebra, zawieszona na skorupie): dolna krawędź uchoDol pod otworem na odcinku [−uchoPlL, +uchoPlP] od otworu,
// od strony osi wznosi się pod 45° do końca blaszki (xUcha − uchoOdOsi), od strony skorupy opada pod 45° do stołu (druk bez podpór);
// pod otworem wolne miejsce na korpus drutu Z przy przechyle (od strony gałki i od strony skorupy)
uchoDol = 1.2; uchoGora = 2.5; uchoPlL = 1.5; uchoPlP = 3; uchoOdOsi = 3; uchoZaSkorupa = 1.5;
tZebra = 2;
dTalia = 1.7; lTalia = 0.3; katKlep = 45; lKlep = 1.2;   // klepsydra: talia Ø1,7 × 0,3, stożki 45° do 1,2 od talii
// --- powieki ---
Rpg = 31.5; Rpd = 33.4; tp = 1.2;           // górna 31,5–32,7, dolna 33,4–34,6 (szczelina 0,7)
katZam = 1.5; szerPow = 75; skok = 51.5;    // krawędź zamknięta ±1,5° (zakładka 3°), otwarcie do 50°
xLeb = 30.5; hLebM2 = 1.6; dLebM2 = 3.8;    // łeb M2 od strony gałki
luzLebM2 = 0.4;                             // luz pogłębienia na łeb M2 (średnica)
tUcho = 1.5;
xUchoG = xLeb + hLebM2 + luzObr;            // 32,3
xUchoD = xUchoG + tUcho + luzObr;           // 34,0
xPad   = xUchoD + tUcho + luzObr;           // 35,7
dOsM2  = 2.4;  dPadM2 = 1.7; glPadM2 = 2.4; // otwór luźny w uchu, ciasny w podkładce (wkręcić do dna)
lOtwOsi = 8;                                // długość cięcia otworu osi
rUchoG = 4;  sektorG = [11, 50]; rRamieG = 14; xPlytkiG = 26;   // ucho górnej: koło + ramię-sektor; płytka od x = 26 (resztę zjada kula)
rUchoD = 4.5; sektorD = [-50, -11]; rRamieD = 11.5; xRamieD = 31.5; xTrymD = 32;   // dolna: |x| ≤ 32
rDzw = 7; dDzwOtw = 1.4; rDzwPiasta = 3; rDzwKoniec = 2;   // otwór: drut Ø1 + 2 × 0,2
katDzwZam = 90 - skok / 2;                  // dźwignia ⟂ drut w połowie skoku (kąt od +z do +y)
// --- pierścień, maskownica ---
rTubaZ = 39.5; tTuba = 1.6; zTubaPrzod = 24; wystTuby = 2;   // tuba wystaje 2 mm ponad skórkę (pod maskownicę)
zSkorka = zTubaPrzod - wystTuby;                             // płaszczyzna skórki (22)
Dkol = 104; tKol = 4;
aPad = 4; luzPadTuba = 0.5;                 // podkładka osi: kwadrat 2·aPad z dołem V 45°, do rTubaZ − luzPadTuba
dM3luz = 3.3; dM3ciasny = 2.6; dPoglM3 = 6.5; hPoglM3 = 2.6;
dWkret = 4.5;
dMask = 84; dMaskW = 79.0; tMask = wystTuby;
ramiona = [[43, -2], [-45, 8], [0, -45]];   // osie ramion Uchwytu (x, y)
wkrety  = [90, 215, 325]; rWkr = 47;        // łapy: otwory pod wkręty do drewna 4 × 30–40
// --- serwa MG90S (rysunek Miuzei MS60-4-D-V1) ---
zWal = -44; Lsv = 22.8; Wsv = 12.5; Hsv = 22.8; wiezaH = 12.2; uchoOd = 15; uchoT = 2; rozstUch = 27.7; osOdCzola = 5.5;
odstOrcz = 1.5;                             // płaszczyzna otworu orczyka → czubek wałka
dWkrSerwa = 1.7;                            // wkręt fabryczny w ramkę
xOrcz1 = 21; yWal1 = -18.5; rOrcz1 = 17.5;  // S1 lewo–prawo, wałek ∥ x w stronę −x
xOrcz2 = 11; yWal2 = 8.5;   rOrcz2 = 13.5;  // S2 góra–dół, wałek ∥ x w stronę −x
xWal3 = -42; yOrcz3 = 0;    rOrcz3 = 7.5;   // S3 powieki, wałek ∥ y w górę
aOrcz0 = -6;                                // położenie orczyków S1, S2 w zerze (solver)
// --- uchwyt ---
zPlyta = -69; tPlyta = 3; dSlupek = 16; tRamki = 4; aRamie = 8;
zRamkaGora = -32;  polRamki12 = 8.5;  polRamki3 = 8;
plytaX = [-50, 47.5]; plytaY = [-27, 17]; jezykPol = 6; jezykY = -49;   // obrys płyty + język pod ramię dolne
zOkno = [-26.0, -21.95]; oknoSzer = 10.5; oknoDl = 20; dTrzpTyl = 5.3;  // okno łba tylnego M5 × 16 w słupku
// --- próbka drutu ---
pPlyta = [34, 10, 2]; pZebroA = [4, 4]; pDlA = 10; pZebroB = [24, 4.25]; pDlB = 8; pWysZebra = 6;
pUchoA = 4; pUchoB = 3; pOtw2 = [19, 7]; dOtw2 = 2.4; pOkno = 6; pOknoY = 4;   // dOtw2: dwa druty Ø1 + 2 × 0,2 (orczyk S3); okno pod otworem żebra A: szerokość wzdłuż żebra, długość w poprzek (płytka zostaje w całości)
// --- zbiorczy: rozstaw części ---
odstep = 10;
stopka = 0.6;       // płaskie ścięcie uszu powiek przy stole (druk)

// pochodne
zKolPrzod = zSkorka - scianka;              // przód kołnierza (styk z wnętrzem dyni)
zSerwoPrzod = zWal + osOdCzola;             // -38,5
zSerwoTyl = zSerwoPrzod - Lsv;              // -61,3
zUchSerwa = [ (zSerwoPrzod + zSerwoTyl) / 2 + rozstUch / 2, (zSerwoPrzod + zSerwoTyl) / 2 - rozstUch / 2 ];
xRamka1 = xOrcz1 + odstOrcz + uchoOd + uchoT;   // 39,5
xRamka2 = xOrcz2 + odstOrcz + uchoOd + uchoT;   // 29,5
yRamka3 = yOrcz3 - odstOrcz - uchoOd - uchoT;   // -18,5

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
      // ucha drutów: lewo–prawo (płytka ⟂ y, otwór ∥ y), góra–dół (obrót o 90°: płytka ⟂ x, otwór ∥ x)
      for (k = [0, 1]) rotate([0, 0, k * 90]) blaszkaUcha();
    }
    // rowek T: trzpień (podłoga), łeb nad podłogą; zamknięty od +y, wylot do wnętrza na y = yRowek
    for (s = [[dTrzpM5, zPiasta - nad, podloga + nad], [dLebM5 + 2 * luzLebR, zPiasta + podloga, hLebM5 + luzLebH]])
      hull() for (y = [0, yRowek]) translate([0, y, s[1]]) cylinder(d = s[0], h = s[2], $fn = fnSr);
    for (k = [0, 1]) rotate([0, 0, k * 90]) translate([xUcha, 0, zUcho]) rotate([90, 0, 0]) klepsydra(lKlep);
  }
}
module PowiekaGorna() {
  difference() {
    union() {
      czasza(Rpg, Rpg + tp, -katZam, -katZam + szerPow);
      for (s = [-1, 1]) translate([s < 0 ? -(xUchoG + tUcho) : xPlytkiG, 0, 0]) xOs() linear_extrude(xUchoG + tUcho - xPlytkiG)
        union() { circle(r = rUchoG, $fn = fnSr); polygon(sektor(0, rRamieG, sektorG[0], sektorG[1])); }
      translate([-(xUchoG + tUcho), 0, 0]) xOs() linear_extrude(tUcho) dzwignia(1);
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
          circle(r = rUchoD, $fn = fnSr); polygon(sektor(0, rRamieD, sektorD[0], sektorD[1])); if (s < 0) dzwignia(-1); }
        translate([s < 0 ? -xUchoD : xRamieD, 0, 0]) xOs() linear_extrude(xUchoD - xRamieD) polygon(sektor(rUchoD, rRamieD, sektorD[0], sektorD[1]));
      }
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
module ramka(u0, u1, uOs) {   // w lokalnym (u, z): u = współrzędna poprzeczna, z = świat z
  difference() { translate([u0, zPlyta + tPlyta]) square([u1 - u0, zRamkaGora - (zPlyta + tPlyta)]);
    translate([uOs - Wsv / 2 - luzSlizg, zSerwoTyl - luzSlizg]) square([Wsv + 2 * luzSlizg, Lsv + 2 * luzSlizg]);
    for (z = zUchSerwa) translate([uOs, z]) circle(d = dWkrSerwa, $fn = fnMale); }
}
module UchwytSerw() {
  zRamTop = zKolPrzod - tKol;
  difference() {
    union() {
      translate([0, 0, zPlyta]) linear_extrude(tPlyta) polygon([[plytaX[0], plytaY[0]], [-jezykPol, plytaY[0]], [-jezykPol, jezykY], [jezykPol, jezykY], [jezykPol, plytaY[0]],
        [plytaX[1], plytaY[0]], [plytaX[1], plytaY[1]], [plytaX[0], plytaY[1]]]);
      translate([0, 0, zPlyta]) cylinder(d = dSlupek, h = -zPiasta - zPlyta, $fn = fnSr);
      for (p = ramiona) translate([p[0] - aRamie / 2, p[1] - aRamie / 2, zPlyta]) cube([aRamie, aRamie, zRamTop - zPlyta]);
      translate([xRamka1, 0, 0]) xOs() linear_extrude(tRamki) ramka(yWal1 - polRamki12, yWal1 + polRamki12, yWal1);
      translate([xRamka2, 0, 0]) xOs() linear_extrude(tRamki) ramka(yWal2 - polRamki12, yWal2 + polRamki12, yWal2);
      translate([0, yRamka3, 0]) rotate([90, 0, 0]) linear_extrude(tRamki) ramka(xWal3 - polRamki3, xWal3 + polRamki3, xWal3);
    }
    translate([0, 0, zOkno[0]]) cylinder(d = dTrzpTyl, h = -zPiasta - zOkno[0] + nad, $fn = fnMale);                 // trzpień M5 tylnej piasty
    translate([-oknoSzer / 2, -oknoDl / 2, zOkno[0]]) cube([oknoSzer, oknoDl, zOkno[1] - zOkno[0]]);                // okno łba M5 (przelotowe wzdłuż y)
    for (p = ramiona) translate([p[0], p[1], zPlyta - nad]) cylinder(d = dM3ciasny, h = zRamTop - zPlyta + 2 * nad, $fn = fnMale);   // M3 × 16 w plastik
  }
}
module ProbkaDrutu() {   // płytka: żebro A (klepsydra jak w gałce), żebro B (dźwignia powieki), otwór na dwa druty
  difference() {
    union() { cube(pPlyta); translate([pZebroA[0], pZebroA[1], 0]) cube([pDlA, tZebra, pPlyta[2] + pWysZebra]);
      translate([pZebroB[0], pZebroB[1], 0]) cube([pDlB, tUcho, pPlyta[2] + pWysZebra]); }
    translate([pZebroA[0] + pDlA / 2, pZebroA[1] + tZebra / 2, pPlyta[2] + pUchoA]) rotate([90, 0, 0]) klepsydra(lKlep);
    // okno pod otworem (górna krawędź uchoDol pod osią otworu, boki 45° – mostek samonośny) przez żebro i płytkę
    translate([pZebroA[0] + pDlA / 2, pPlyta[1] / 2, 0]) rotate([90, 0, 0]) linear_extrude(pOknoY, center = true)
      polygon([[-pOkno / 2, -nad], [pOkno / 2, -nad], [pOkno / 2, pPlyta[2] + pUchoA - uchoDol - pOkno / 2], [0, pPlyta[2] + pUchoA - uchoDol], [-pOkno / 2, pPlyta[2] + pUchoA - uchoDol - pOkno / 2]]);
    translate([pZebroB[0] + pDlB / 2, pZebroB[1] + tUcho / 2, pPlyta[2] + pUchoB]) rotate([90, 0, 0]) cylinder(d = dDzwOtw, h = tUcho + 2 * nad, center = true, $fn = fnMale);
    translate([pOtw2[0], pOtw2[1], -nad]) cylinder(d = dOtw2, h = pPlyta[2] + 2 * nad, $fn = fnMale);
  }
}

// ===================== PODGLĄD (tylko złożenie, nie do druku): serwa, orczyki w zerze, druty, piasty kardana =====================
module drut(a, b) { color("red") hull() { translate(a) sphere(d = 1, $fn = 8); translate(b) sphere(d = 1, $fn = 8); } }
module podglad() {
  color("steelblue") {
    translate([xOrcz1 + odstOrcz + wiezaH, yWal1 - Wsv / 2, zSerwoTyl]) cube([Hsv, Wsv, Lsv]);
    translate([xOrcz2 + odstOrcz + wiezaH, yWal2 - Wsv / 2, zSerwoTyl]) cube([Hsv, Wsv, Lsv]);
    translate([xWal3 - Wsv / 2, yOrcz3 - odstOrcz - wiezaH - Hsv, zSerwoTyl]) cube([Wsv, Hsv, Lsv]);
  }
  color("gray") translate([0, 0, -zPiasta]) cylinder(d = dPiasta, h = 2 * zPiasta);
  h1 = [xOrcz1, yWal1 + rOrcz1 * cos(aOrcz0), zWal + rOrcz1 * sin(aOrcz0)];
  h2 = [xOrcz2, yWal2 + rOrcz2 * cos(aOrcz0), zWal + rOrcz2 * sin(aOrcz0)];
  h3 = [xWal3 + rOrcz3, yOrcz3, zWal];
  color("black") { hull() { translate([xOrcz1, yWal1, zWal]) sphere(2); translate(h1) sphere(2); }
    hull() { translate([xOrcz2, yWal2, zWal]) sphere(2); translate(h2) sphere(2); }
    hull() { translate([xWal3, yOrcz3, zWal]) sphere(2); translate(h3) sphere(2); } }
  drut([xUcha, 0, zUcho], h1); drut([0, xUcha, zUcho], h2);
  drut([-(xUchoG + tUcho / 2), rDzw * sin(katDzwZam), rDzw * cos(katDzwZam)], h3); drut([-(xUchoD + tUcho / 2), -rDzw * sin(katDzwZam), rDzw * cos(katDzwZam)], h3);
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
}
module wPolozeniu(c) {
  if (c == "Galka") Galka(); else if (c == "PowiekaGorna") PowiekaGorna(); else if (c == "PowiekaDolna") PowiekaDolna();
  else if (c == "Pierscien") Pierscien(); else if (c == "Maskownica") Maskownica(); else if (c == "UchwytSerw") UchwytSerw(); else if (c == "ProbkaDrutu") ProbkaDrutu();
}
// zbiorczy: wszystkie części do druku obok siebie (rzędy po szerokości części)
module zbiorczy() {
  s = odstep;
  translate([-Dkol / 2 - s - Rg, 0, 0]) druk("Galka");
  translate([0, 0, 0]) druk("Pierscien");
  translate([Dkol / 2 + s + Rpd, 0, 0]) druk("PowiekaGorna");
  translate([Dkol / 2 + s + Rpd, 2 * (Rpd + tp) + s, 0]) druk("PowiekaDolna");
  translate([0, Dkol / 2 + s + dMask / 2, 0]) druk("Maskownica");
  translate([0, -Dkol / 2 - s - plytaY[1], 0]) druk("UchwytSerw");
  translate([-Dkol / 2 - s - pPlyta[0], -Dkol / 2 - s, 0]) druk("ProbkaDrutu");
}

if (czesc == "zlozenie") { color("white") Galka(); color("orange") { PowiekaGorna(); PowiekaDolna(); Pierscien(); UchwytSerw(); } color("darkorange") Maskownica(); podglad(); }
else if (czesc == "zbiorczy") zbiorczy();
else if (tryb == "druk") druk(czesc);
else wPolozeniu(czesc);
