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
lM2 = 6; hLebM2 = 1.6; dLebM2 = 3.8; dOsM2 = 2.4; dPadM2 = 1.7;           // M2 × 6: łeb, otwór luźny w uchu, ciasny w podkładce
dM3luz = 3.3; dM3ciasny = 2.6; dPoglM3 = 6.5; hPoglM3 = 2.6; dWkret = 4.5;  // M3, wkręty do drewna
Lsv = 22.8; Wsv = 12.5; Hsv = 22.8; wiezaH = 12.2; uchoOd = 15; uchoT = 2; rozstUch = 27.7; osOdCzola = 5.5; dlUszu = 31.8; dWkrSerwa = 1.7;   // MG90S (Miuzei)
rOrcz1 = 17.5; rOrcz2 = 13.5; rOrcz3 = 7.5;          // otwory orczyka (5,5…17,5 co 2) wybrane dla S1, S2, S3
grubOrcz = 2; odstOrcz = 1.5;                        // grubość ramienia orczyka; płaszczyzna otworu → czubek wałka
dDrut = 1.0;                                         // drut sprężynowy
// ---------- BAZOWE: gałka (decyzje) ----------
Rg = 30; tg = 2;
wystGalki = 6;      // gałka wystaje przed lico tuby / maskownicy
tylRant = 8;        // skorupa sięga tylRant za środek (rant = stół do druku)
podloga = 5.5;      // podłoga rowka T = część M5 × 12 poza piastą (wsunięcie 6,5 z 7)
luzLebR = 0.25; luzLebH = 0.4;                       // łeb M5 w rowku
rUcha = 20; wysUcha = 4;                             // ucha drutów: promień od osi, wysokość otworu nad rantem
uchoDol = 1.2; uchoGora = 2.5; uchoPlL = 1.5; uchoPlP = 4; uchoOdOsi = 3; uchoZaSkorupa = 1.5; tZebra = 2;   // blaszka ucha
dTalia = 1.7; lTalia = 0.3; katKlep = 45; lKlep = 1.2;                    // klepsydra
// ---------- BAZOWE: powieki (decyzje) ----------
szczGalkaPow = 1.5; szczPowiek = 0.7; tp = 1.2;     // szczeliny gałka–górna i górna–dolna, grubość czaszy
katZam = 1.5; szerPow = 75; skok = 51.5;            // krawędź zamknięta ±1,5° (zakładka 3°), szerokość czaszy, skok (do 50°)
tUcho = 1.5; rUchoG = 4; sektorG = [11, 50]; rRamieG = 14; rUchoD = 4.5; sektorD = [-50, -11];   // ucha i ramiona
rDzw = 7; rDzwPiasta = 3; rDzwKoniec = 2;           // dźwignie
// ---------- BAZOWE: pierścień, maskownica (decyzje) ----------
tTuba = 1.6; wystTuby = 2; rantMask = 2; tKol = 4; szerKol = 12.5; odstWkretu = 7.5;   // rant maskownicy ≤ 2 poza otwór (PRD)
aPad = 4; luzPadTuba = 0.5;
katyRamion = [-3, 170, 270]; katyWkretow = [90, 215, 325];   // położenia kątowe ramion Uchwytu i łap
// ---------- BAZOWE: serwa i uchwyt (decyzje) ----------
odstSerwa = 8.5;    // czoło korpusów serw za gałką (od R gałki)
przesS1 = 1; przesS2 = 2;   // otwór orczyka S1 1 mm pod osią gałki; S2 2 mm nad uchem
odstOrczSlupek = 2;         // orczyk S2 od słupka
aOrcz0 = -6;                // orczyki S1, S2 w zerze obrócone 6° do tyłu (solver)
tPlyta = 3; tRamki = 4; aRamie = 8; polRamki = 8.5; ramkaNadUchem = 2; zapasPlyty = 4; luzUchaPlyta = 0.2;
wkladSlupka = 2.5;          // ścianka słupka wokół piasty
oknoDl = 20;
// ---------- BAZOWE: próbka, druk, siatka ----------
pPlyta = [34, 12, 2]; pXucha = 3; pZebroB = [24, 5.25]; pDlB = 8; pWysZebra = 6; pUchoB = 3; pOtw2 = [21, 9.5]; pOknoY = 4; pSkorupa = 2;
odstep = 10; stopka = 0.6;
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
xOtwOrcz3  = -(xUchoG + xUchoD + tUcho) / 2;       // -33,9 otwór orczyka S3 między dźwigniami
xWal3      = xOtwOrcz3 - rOrcz3;                   // -41,4: S3, wałek ∥ y w górę
yOrcz3     = 0;                                    // płaszczyzna orczyka S3 = oś powiek
zPlyta     = zSerwoTyl - uchoWyst - luzUchaPlyta - tPlyta;   // -69
zRamkaGora = zSerwoPrzod + uchoWyst + ramkaNadUchem;         // -32
xRamka1    = xOrcz1 + odstOrcz + uchoOd + uchoT;   // 39,5
xRamka2    = xOrcz2 + odstOrcz + uchoOd + uchoT;   // 29,5
yRamka3    = yOrcz3 - odstOrcz - uchoOd - uchoT;   // -18,5
polRamki12 = polRamki; polRamki3 = polRamki;       // 8,5
plytaX     = [xWal3 - polRamki3, xRamka1 + tRamki + zapasPlyty];   // [-49,9; 47,5]
plytaY     = [yWal1 - polRamki12, yWal2 + polRamki12];             // [-27; 17]
jezykPol   = aRamie / 2 + 2 * luzRuch + 1;         // 6
jezykY     = -rRamion - aRamie / 2;                // -49
zOkno1     = -zPiasta - (lM5tyl - glOtwKardana) - luzObr;   // -21,95 strop okna = łeb M5 × 16
zOkno      = [zOkno1 - (hLebM5 + luzLebH), zOkno1];         // [-25,85; -21,95]
oknoSzer   = dLebM5 + 4 * luzLebR;                 // 10,5
dPiasta    = dKardan;                              // podgląd

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
module ProbkaDrutu() {   // płytka = stół gałki (z = zRant): blaszka ucha 1:1 z klepsydrą i szczeliną pod nią, żebro B (dźwignia powieki), otwór na dwa druty
  dx = pXucha - (xUcha - uchoOdOsi); yA = pPlyta[1] / 2; zS = pPlyta[2] - zRant;
  xDol = xUcha + uchoPlP + (zUcho - uchoDol - zRant);   // miejsce, w którym dolna krawędź blaszki schodzi do stołu
  difference() {
    union() { cube(pPlyta);
      translate([dx, yA, zS]) blaszkaUcha();
      translate([dx + Rg - uchoZaSkorupa, yA - pOknoY / 2, 0]) cube([pSkorupa, pOknoY, zS + zUcho + uchoGora]);
      translate([pZebroB[0], pZebroB[1], 0]) cube([pDlB, tUcho, pPlyta[2] + pWysZebra]); }
    translate([dx + xUcha, yA, zS + zUcho]) rotate([90, 0, 0]) klepsydra(lKlep);
    translate([dx + xUcha - uchoOdOsi - nad, yA - pOknoY / 2, -nad]) cube([xDol - xUcha + uchoOdOsi + nad, pOknoY, pPlyta[2] + 2 * nad]);
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

// parametry dla skryptów (duze-oko-kinematyka.js, duze-oko-kolizje.js): openscad -o x.echo -D 'czesc="parametry"' duze-oko-v2.scad
if (czesc == "parametry") echo(str("PARAMETRY{\"lug1\":[", xUcha, ",0,", zUcho, "],\"lug2\":[0,", xUcha, ",", zUcho, "],",
  "\"s1\":{\"xh\":", xOrcz1, ",\"ys\":", yWal1, ",\"zs\":", zWal, ",\"r\":", rOrcz1, ",\"a0\":", aOrcz0, "},",
  "\"s2\":{\"xh\":", xOrcz2, ",\"ys\":", yWal2, ",\"zs\":", zWal, ",\"r\":", rOrcz2, ",\"a0\":", aOrcz0, "},",
  "\"s3\":{\"xs\":", xWal3, ",\"yh\":", yOrcz3, ",\"zs\":", zWal, ",\"r\":", rOrcz3, ",\"a0\":0},",
  "\"lev\":{\"r\":", rDzw, ",\"xu\":", -(xUchoG + tUcho / 2), ",\"xl\":", -(xUchoD + tUcho / 2), ",\"skok\":", skok, "},",
  "\"korp\":{\"xu\":", -(xUchoG + tUcho + dDrut / 2), ",\"xl\":", -(xUchoD - dDrut / 2), "},",
  "\"sv\":{\"odstOrcz\":", odstOrcz, ",\"wiezaH\":", wiezaH, ",\"Hsv\":", Hsv, ",\"Wsv\":", Wsv, ",\"zP\":", zSerwoPrzod, ",\"zT\":", zSerwoTyl,
  ",\"uchoOd\":", uchoOd, ",\"uchoT\":", uchoT, ",\"uchoWyst\":", uchoWyst, ",\"grubOrcz\":", grubOrcz, "},",
  "\"Rg\":", Rg, ",\"xLeb\":", xLeb, ",\"hLebM2\":", hLebM2, ",\"dLebM2\":", dLebM2, ",\"zPiasta\":", zPiasta, ",\"dKardan\":", dKardan,
  ",\"zRant\":", zRant, ",\"dDrut\":", dDrut, "}"));
else if (czesc == "zlozenie") { color("white") Galka(); color("orange") { PowiekaGorna(); PowiekaDolna(); Pierscien(); UchwytSerw(); } color("darkorange") Maskownica(); podglad(); }
else if (czesc == "zbiorczy") zbiorczy();
else if (tryb == "druk") druk(czesc);
else wPolozeniu(czesc);
