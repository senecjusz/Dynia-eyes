// Duże oko v2 – model parametryczny (OpenSCAD 2021.01), noc 24/25.10.2026, projektant.
// Plan: 40-cad/onshape/duze-oko-v2-plan.md (+ poprawki po review Astry, raport nocny 30-projekt/raport-nocny-2026-10-25.md).
// Układ: x w prawo (patrząc na dynię), y w górę, z do przodu; środek gałki = (0,0,0). Wymiary w mm.
// Eksport: openscad -o <plik>.3mf -D 'czesc="galka"' -D 'tryb="druk"' duze-oko-v2.scad
//   czesc: galka | powieka_gorna | powieka_dolna | pierscien | maskownica | uchwyt | probka | zlozenie
//   tryb:  druk (płaska strona na stole, z ≥ 0) | zlozenie (położenie w module)

czesc = "zlozenie";
tryb = "zlozenie";
$fn = 96;

// ===================== zmienne =====================
scianka   = 40;     // grubość ścianki dyni przy otworze (tuba = scianka + 2, ramiona Uchwytu = 84 − scianka); zakres 28–50
luzObr    = 0.2;    // luz obrotowy (AGENTS: 0,2)
// gałka
Rg = 30; tg = 2; zRant = -8;
zPiasta  = 12.75;   // czoło przedniej piasty kardana (25,5 / 2)
dPiasta  = 11;
stozekK  = 7;       // tworząca stożka: r = z − stozekK (45°), wierzchołek r 5,75 na z = 12,75
uStozek  = (-stozekK + sqrt(2 * (Rg - tg) * (Rg - tg) - stozekK * stozekK)) / 2;   // styk stożka ze skorupą R 28 (r 15,99; z 22,99)
aStozek  = atan2(uStozek + stozekK, uStozek);
dTrzpM5  = 5.5;     // szczelina trzpienia M5 (M5 × 12: 7 w piaście, 5 w podłodze)
podloga  = 5;       // podłoga między piastą a łbem
dLebM5   = 9.5;  hLebM5 = 3.5;   // łeb krzyżakowy M5 (założenie: ten sam typ co M3 użytkownika)
yRowek   = -16;     // wylot rowka T do wnętrza gałki
zUcho    = -5.5;    // ucha drutów w żebrach (2,5 nad stołem)
xZebra   = [18, 28]; tZebra = 2; zZebraTop = -2;
dTalia = 1.7; lTalia = 0.3; katKlep = 45;   // klepsydra: talia Ø1,7 × 0,3, stożki 45° (przechył drutu Ø1 do ~44°)
// powieki
Rpg = 31.5; Rpd = 33.4; tp = 1.2;           // górna 31,5–32,7, dolna 33,4–34,6 (szczelina 0,7)
katZam = 1.5; szerPow = 75; skok = 51.5;    // krawędź zamknięta ±1,5° (zakładka 3°), otwarcie do 50°
xLeb = 30.5; hLebM2 = 1.6; dLebM2 = 3.8;    // łeb M2 od strony gałki
tUcho = 1.5;
xUchoG = xLeb + hLebM2 + luzObr;            // 32,3
xUchoD = xUchoG + tUcho + luzObr;           // 34,0
xPad   = xUchoD + tUcho + luzObr;           // 35,7
dOsM2  = 2.4;  dPadM2 = 1.7; glPadM2 = 2.4; // otwór luźny w uchu, ciasny w podkładce (wkręcić do dna)
rDzw = 7; dDzwOtw = 1.2;
katDzwZam = 90 - skok / 2;                  // dźwignia ⟂ drut w połowie skoku (kąt od +z do +y)
// pierścień, maskownica
rTubaZ = 39.5; tTuba = 1.6; zTubaPrzod = 24;
Dkol = 104; tKol = 4;
dMask = 84; dMaskW = 79.0; tMask = 2;
ramiona = [[43, -2], [-45, 8], [0, -45]];   // osie ramion Uchwytu (x, y)
wkrety  = [90, 215, 325]; rWkr = 47;        // łapy: otwory Ø4,5 pod wkręty do drewna 4 × 30–40
// serwa MG90S (rysunek Miuzei MS60-4-D-V1)
zWal = -44; Lsv = 22.8; Wsv = 12.5; Hsv = 22.8; wiezaH = 12.2; uchoOd = 15; uchoT = 2; rozstUch = 27.7; osOdCzola = 5.5;
xOrcz1 = 21; yWal1 = -18.5; rOrcz1 = 17.5;  // S1 lewo–prawo, wałek ∥ x w stronę −x
xOrcz2 = 11; yWal2 = 8.5;   rOrcz2 = 13.5;  // S2 góra–dół, wałek ∥ x w stronę −x
xWal3 = -42; yOrcz3 = 0;    rOrcz3 = 7.5;   // S3 powieki, wałek ∥ y w górę
// uchwyt
zPlyta = -69; tPlyta = 3; dSlupek = 16; tRamki = 4; aRamie = 8;
zOkno = [-26.0, -21.95];                    // okno łba tylnego M5 × 16 w słupku

zKolPrzod = 22 - scianka;                   // przód kołnierza (styk z wnętrzem dyni)
zSerwoPrzod = zWal + osOdCzola;             // -38,5
zSerwoTyl = zSerwoPrzod - Lsv;              // -61,3
zUchSerwa = [ (zSerwoPrzod + zSerwoTyl) / 2 + rozstUch / 2, (zSerwoPrzod + zSerwoTyl) / 2 - rozstUch / 2 ];

// ===================== pomocnicze =====================
module xOs() { multmatrix([[0,0,1,0],[1,0,0,0],[0,1,0,0]]) children(); }   // lokalne XY → świat (y, z), lokalne Z → świat x
function sektor(r0, r1, a0, a1, n = 48) = concat(
  [for (i = [0:n]) let(a = a0 + (a1 - a0) * i / n) [r1 * sin(a), r1 * cos(a)]],
  [for (i = [n:-1:0]) let(a = a0 + (a1 - a0) * i / n) [r0 * sin(a), r0 * cos(a)]]);   // punkty (y, z), kąt od +z do +y
module klepsydra(L = 6) {   // oś wzdłuż lokalnego z, talia w 0
  cylinder(d = dTalia, h = lTalia + 0.02, center = true);
  for (s = [-1, 1]) mirror([0, 0, s < 0 ? 1 : 0]) translate([0, 0, lTalia / 2])
    cylinder(d1 = dTalia, d2 = dTalia + 2 * L * tan(katKlep), h = L);
}
// czasza: pas sfery R0..R1 między kątami a0..a1 (od +z do +y) wokół osi x
module czasza(R0, R1, a0, a1) {
  multmatrix([[0, 0, -1, 0], [sin(a0), cos(a0), 0, 0], [cos(a0), -sin(a0), 0, 0]])
    rotate_extrude(angle = a1 - a0, $fn = 192) difference() {
      circle(r = R1, $fn = 192); circle(r = R0, $fn = 192); translate([-R1 - 1, -R1 - 1]) square([R1 + 1, 2 * R1 + 2]); }
}

// ===================== części =====================
module galka() {
  difference() {
    union() {
      rotate_extrude($fn = 192) polygon(concat(
        [[0, Rg]], [for (a = [90:-1:-15.46]) [Rg * cos(a), Rg * sin(a)]], [[sqrt(Rg*Rg - zRant*zRant), zRant], [sqrt((Rg-tg)*(Rg-tg) - zRant*zRant), zRant]],
        [for (a = [-16.6:1:aStozek]) [(Rg - tg) * cos(a), (Rg - tg) * sin(a)]], [[uStozek, uStozek + stozekK]],
        [[zPiasta - stozekK, zPiasta], [0, zPiasta]]));
      // żebra uszu drutów: lewo–prawo (x 18…28, otwór ∥ y), góra–dół (y 18…28, otwór ∥ x)
      translate([xZebra[0], -tZebra / 2, zRant]) cube([xZebra[1] - xZebra[0], tZebra, zZebraTop - zRant]);
      translate([-tZebra / 2, xZebra[0], zRant]) cube([tZebra, xZebra[1] - xZebra[0], zZebraTop - zRant]);
    }
    // rowek T: trzpień (z 12…17,75), łeb (17,55…21,45); zamknięty od +y, wylot do wnętrza na y = yRowek
    hull() { translate([0, 0, zPiasta - 1]) cylinder(d = dTrzpM5, h = podloga + 1 - 0.2); translate([0, yRowek, zPiasta - 1]) cylinder(d = dTrzpM5, h = podloga + 1 - 0.2); }
    hull() { translate([0, 0, zPiasta + podloga - 0.2]) cylinder(d = dLebM5 + 0.5, h = hLebM5 + 0.4); translate([0, yRowek, zPiasta + podloga - 0.2]) cylinder(d = dLebM5 + 0.5, h = hLebM5 + 0.4); }
    // klepsydry
    translate([(xZebra[0] + xZebra[1]) / 2 - 1, 0, zUcho]) rotate([90, 0, 0]) klepsydra(1.2);
    translate([0, (xZebra[0] + xZebra[1]) / 2 - 1, zUcho]) rotate([0, 90, 0]) klepsydra(1.2);
    // otwór klucza L do wkrętu M4 przedniej piasty nie jest potrzebny (dostęp przez tylny otwór)
  }
}
// ucha i dźwignie: strona s = −1 (lewa, z dźwignią) albo +1
module powiekaGorna() {
  difference() {
    union() {
      czasza(Rpg, Rpg + tp, -katZam, -katZam + szerPow);
      for (s = [-1, 1]) {
        // płytka ucha: koło r 4 + ramię do czaszy (sektor 11…61°, r 14), x od 26 do xUchoG + tUcho (po wycięciu kuli zostaje x ≥ 31,5)
        translate([s < 0 ? -(xUchoG + tUcho) : 26, 0, 0]) xOs() linear_extrude(xUchoG + tUcho - 26) union() {
          circle(r = 4); polygon(sektor(0, 14, 11, 61)); }
        if (s < 0) translate([-(xUchoG + tUcho), 0, 0]) xOs() linear_extrude(tUcho) difference() {
          hull() { circle(r = 3); translate([rDzw * sin(katDzwZam), rDzw * cos(katDzwZam)]) circle(r = 2); }
          translate([rDzw * sin(katDzwZam), rDzw * cos(katDzwZam)]) circle(d = dDzwOtw, $fn = 24); }
      }
    }
    sphere(r = Rpg, $fn = 192);
    for (s = [-1, 1]) { translate([s * (xUchoG - 2.5), 0, 0]) rotate([0, 90, 0]) cylinder(d = dLebM2 + 0.8, h = 5, center = true);   // pogłębienie łba (do x 32,3)
      translate([s * xUchoG, 0, 0]) rotate([0, 90, 0]) cylinder(d = dOsM2, h = 8, center = true, $fn = 24); }
  }
}
module powiekaDolna() {
  difference() {
    union() {
      intersection() { czasza(Rpd, Rpd + tp, -(szerPow - katZam), katZam); cube([64, 80, 80], center = true); }   // |x| ≤ 32
      for (s = [-1, 1]) {
        translate([s < 0 ? -(xUchoD + tUcho) : xUchoD, 0, 0]) xOs() linear_extrude(tUcho) union() {
          circle(r = 4.5); polygon(sektor(0, 11.5, -61, -11));
          if (s < 0) difference() { hull() { circle(r = 3); translate([-rDzw * sin(katDzwZam), rDzw * cos(katDzwZam)]) circle(r = 2); }
            translate([-rDzw * sin(katDzwZam), rDzw * cos(katDzwZam)]) circle(d = dDzwOtw, $fn = 24); } }
        translate([s < 0 ? -xUchoD : 31.5, 0, 0]) xOs() linear_extrude(xUchoD - 31.5) polygon(sektor(4.5, 11.5, -61, -11));
      }
    }
    sphere(r = Rpd, $fn = 192);
    for (s = [-1, 1]) translate([s * xUchoD, 0, 0]) rotate([0, 90, 0]) cylinder(d = dOsM2, h = 8, center = true, $fn = 24);
  }
}
module pierscien() {
  difference() {
    union() {
      translate([0, 0, zKolPrzod]) cylinder(r = rTubaZ, h = zTubaPrzod - zKolPrzod, $fn = 192);
      translate([0, 0, zKolPrzod - tKol]) cylinder(d = Dkol, h = tKol, $fn = 192);
      // podkładki osi powiek: kwadrat 8 z dołem V 45° (samonośne przy druku kołnierzem na stole)
      for (s = [-1, 1]) translate([s > 0 ? xPad : -(rTubaZ - 0.5), 0, 0]) xOs() linear_extrude(rTubaZ - 0.5 - xPad) polygon([[-4, 0], [-4, 4], [4, 4], [4, 0], [0, -4]]);
    }
    translate([0, 0, zKolPrzod - tKol - 1]) cylinder(r = rTubaZ - tTuba, h = zTubaPrzod - zKolPrzod + tKol + 2, $fn = 192);
    for (s = [-1, 1]) translate([s * (xPad + glPadM2 / 2), 0, 0]) rotate([0, 90, 0]) cylinder(d = dPadM2, h = glPadM2 + 0.02, center = true, $fn = 24);
    for (p = ramiona) translate([p[0], p[1], 0]) { translate([0, 0, zKolPrzod - tKol - 1]) cylinder(d = 3.3, h = tKol + 2, $fn = 24);
      translate([0, 0, zKolPrzod - 2.6]) cylinder(d = 6.5, h = 3, $fn = 32); }
    for (a = wkrety) translate([rWkr * cos(a), rWkr * sin(a), zKolPrzod - tKol - 1]) cylinder(d = 4.5, h = tKol + 2, $fn = 24);
  }
}
module maskownica() { translate([0, 0, 22]) difference() { cylinder(d = dMask, h = tMask, $fn = 192); translate([0, 0, -1]) cylinder(d = dMaskW, h = tMask + 2, $fn = 192); } }
// ramka serwa w płaszczyźnie ⟂ osi wałka: okno korpusu (W × L + 0,3/str.) i 2 otwory Ø1,7 na wkręty fabryczne
module ramka(u0, u1, uOs) {   // w lokalnym (u, z): u = współrzędna poprzeczna, z = świat z
  difference() { translate([u0, zPlyta + tPlyta]) square([u1 - u0, -32 - (zPlyta + tPlyta)]);
    translate([uOs - Wsv / 2 - 0.3, zSerwoTyl - 0.3]) square([Wsv + 0.6, Lsv + 0.6]);
    for (z = zUchSerwa) translate([uOs, z]) circle(d = 1.7, $fn = 20); }
}
module uchwyt() {
  zRamTop = zKolPrzod - tKol;
  difference() {
    union() {
      translate([0, 0, zPlyta]) linear_extrude(tPlyta) polygon([[-50, -27], [-6, -27], [-6, -49], [6, -49], [6, -27], [47.5, -27], [47.5, 17], [-50, 17]]);
      translate([0, 0, zPlyta]) cylinder(d = dSlupek, h = -zPiasta - zPlyta, $fn = 64);
      for (p = ramiona) translate([p[0] - aRamie / 2, p[1] - aRamie / 2, zPlyta]) cube([aRamie, aRamie, zRamTop - zPlyta]);
      // S1: ucha na x 37,5…39,5 → ramka x 39,5…43,5; S2: ramka x 29,5…33,5; S3 (wałek ∥ y): ramka y −22,5…−18,5
      translate([xOrcz1 + 1.5 + uchoOd + uchoT, 0, 0]) xOs() linear_extrude(tRamki) ramka(yWal1 - 8.5, yWal1 + 8.5, yWal1);
      translate([xOrcz2 + 1.5 + uchoOd + uchoT, 0, 0]) xOs() linear_extrude(tRamki) ramka(yWal2 - 8.5, yWal2 + 8.5, yWal2);
      translate([0, yOrcz3 - 1.5 - uchoOd - uchoT, 0]) rotate([90, 0, 0]) linear_extrude(tRamki) ramka(xWal3 - 8, xWal3 + 8, xWal3);
    }
    translate([0, 0, zOkno[0] - 6]) cylinder(d = 5.3, h = 20, $fn = 32);                         // trzpień M5 tylnej piasty
    translate([-5.25, -10, zOkno[0]]) cube([10.5, 20, zOkno[1] - zOkno[0]]);                     // okno łba M5 (przelotowe wzdłuż y)
    for (p = ramiona) translate([p[0], p[1], zPlyta - 1]) cylinder(d = 2.6, h = zRamTop - zPlyta + 2, $fn = 20);   // M3 × 16 w plastik
  }
}
module probka() {   // płytka 34 × 10 × 2: żebro A (klepsydra jak w gałce), żebro B (dźwignia powieki Ø1,2), otwór Ø2,1 (dwa druty)
  difference() {
    union() { translate([0, 0, 0]) cube([34, 10, 2]); translate([4, 4, 0]) cube([10, tZebra, 2 + 6]); translate([24, 4.25, 0]) cube([8, tUcho, 2 + 6]); }
    translate([9, 4 + tZebra / 2, 2 + 2.5]) rotate([90, 0, 0]) klepsydra(1.2);
    translate([28, 5, 2 + 3]) rotate([90, 0, 0]) cylinder(d = dDzwOtw, h = 6, center = true, $fn = 24);
    translate([19, 7, -1]) cylinder(d = 2.1, h = 4, $fn = 24);
  }
}

// ===================== wybór =====================
module wybrana() {
  if (czesc == "galka") { if (tryb == "druk") translate([0, 0, -zRant]) galka(); else galka(); }
  else if (czesc == "powieka_gorna") { if (tryb == "druk") translate([0, 0, 4]) rotate([szerPow / 2 - katZam, 0, 0]) powiekaGorna(); else powiekaGorna(); }
  else if (czesc == "powieka_dolna") { if (tryb == "druk") translate([0, 0, 4.5]) rotate([-(szerPow / 2 - katZam), 0, 0]) powiekaDolna(); else powiekaDolna(); }
  else if (czesc == "pierscien") { if (tryb == "druk") translate([0, 0, -(zKolPrzod - tKol)]) pierscien(); else pierscien(); }
  else if (czesc == "maskownica") { if (tryb == "druk") translate([0, 0, -22]) maskownica(); else maskownica(); }
  else if (czesc == "uchwyt") { if (tryb == "druk") translate([0, 0, -zPlyta]) uchwyt(); else uchwyt(); }
  else if (czesc == "probka") probka();
  else { color("white") galka(); color("orange") { powiekaGorna(); powiekaDolna(); pierscien(); uchwyt(); } color("darkorange") maskownica(); }
}
wybrana();
