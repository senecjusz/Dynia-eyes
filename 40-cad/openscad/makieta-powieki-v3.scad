// MAKIETA (nie do druku): duże oko z powiekami na osobnych serwach, drut zaczepiony na tylnej krawędzi powieki, daleko od osi.
// Bazuje na duze-oko-v2.scad (gałka, powieki, pierścień, uchwyt S1/S2 bez zmian); nowe: zaczepy na powiekach, 2 serwa powiek z orczykami, druty.
// Użycie: openscad -o x.png -D psi=0 -D th=0 -D ph=0 makieta-powieki-v3.scad   (psi: otwarcie powiek 0…51,5°; th, ph: spojrzenie)
include <duze-oko-v2.scad>
psi = 25; th = 0; ph = 0; pokazTube = true;

// ---- zaczep na tylnej krawędzi powieki (kąt od +z ku +y; górna: krawędź 73,5°) ----
katZacz = szerPow - katZam + 3;      // 76,5°: tuż za krawędzią czaszy
rZacz   = Rpd + tp + 1;              // 35,6 od osi powiek (oś x)
tZacz = 3; dOtwZ = 1.4;
module zaczep(s) {   // s = +1 górna (y > 0), −1 dolna
  difference() {
    hull() { rotate([s * -(katZacz - 6), 0, 0]) translate([-tZacz / 2, 0, Rpg + tp / 2]) cube([tZacz, 0.1, 0.1]);
             rotate([s * -katZacz, 0, 0]) translate([0, 0, rZacz]) rotate([0, 90, 0]) cylinder(r = 2.2, h = tZacz, center = true, $fn = 24); }
    rotate([s * -katZacz, 0, 0]) translate([0, 0, rZacz]) rotate([0, 90, 0]) cylinder(d = dOtwZ, h = tZacz + 2, center = true, $fn = 16);
  }
}
function pZacz(s, a) = [0, s * rZacz * sin(katZacz + a), rZacz * cos(katZacz + a)];   // a = kąt otwarcia powieki

// ---- serwa powiek: wałek ∥ x, orczyk w płaszczyźnie (y, z) przy x = 0 ----
rOrczP = 25;                        // ramię orczyka powieki: drukowane przedłużenie fabrycznego orczyka
yOsP = rZacz * sin(katZacz + skok / 2) - rOrczP; zOsP = -50;   // oś orczyka: w połowie skoku drut biegnie prosto do tyłu, orczyk ⟂ drutu (dolnej: −y)
// kąt orczyka dla danego otwarcia: stała długość drutu (bisekcja), zero = powieka w połowie, orczyk ⟂ drutu
function H(s, a) = [0, s * yOsP + s * rOrczP * cos(a), zOsP + rOrczP * sin(a)];
Ldrut = norm(pZacz(1, skok / 2) - H(1, 0));
function f(s, a, p) = norm(pZacz(s, p) - H(s, a)) - Ldrut;
function bis(s, p, lo, hi, n) = n == 0 ? (lo + hi) / 2 : let(m = (lo + hi) / 2) (f(s, lo, p) * f(s, m, p) <= 0 ? bis(s, p, lo, m, n - 1) : bis(s, p, m, hi, n - 1));
function alfaP(s, p) = bis(s, p, -80, 80, 40);
echo(str("MAKIETA Ldrut=", Ldrut, " alfa(zamk)=", alfaP(1, 0), " alfa(otw)=", alfaP(1, skok), " czułość [°/mm] ≈ ", 180 / PI / rZacz));

module serwoPowieki(s, a) {
  // korpus: wałek w −x, korpus po +x (x 1,5…), jak S1/S2
  color("steelblue") translate([-(odstOrcz + wiezaH + Hsv), s * yOsP - Wsv / 2, zOsP - Lsv / 2 - osOdCzola]) cube([Hsv, Wsv, Lsv]);   // korpus po −x (miejsce po S3)
  color("steelblue") translate([-(odstOrcz + wiezaH), s * yOsP, zOsP]) rotate([0, 90, 0]) cylinder(r = rWiezy, h = wiezaH, $fn = 24);
  color("black") hull() { translate([0, s * yOsP, zOsP]) sphere(r = 2.5, $fn = 12); translate(H(s, a)) sphere(r = 2, $fn = 12); }
}
module drutP(a, b) { color("red") hull() { translate(a) sphere(d = 1.2, $fn = 8); translate(b) sphere(d = 1.2, $fn = 8); } }

// ---- scena (obrót: oś y modelu → z OpenSCAD, żeby „góra” była u góry obrazka) ----
rotate([90, 0, 0]) {
color("white") rotate([ph * -1, 0, 0]) rotate([0, th, 0]) Galka();
color("orange") rotate([-psi, 0, 0]) { PowiekaGorna(); zaczep(1); }
color("darkorange") rotate([psi, 0, 0]) { PowiekaDolna(); zaczep(-1); }
if (pokazTube) color("tan", 0.35) Pierscien();
color("tan") UchwytSerw();
for (s = [1, -1]) let(a = alfaP(s, psi)) { serwoPowieki(s, a); drutP(pZacz(s, psi), H(s, a)); }
// S1, S2 jak w modelu (podgląd bez S3)
color("steelblue") { translate([xOrcz1 + odstOrcz + wiezaH, yWal1 - Wsv / 2, zSerwoTyl]) cube([Hsv, Wsv, Lsv]); translate([xOrcz2 + odstOrcz + wiezaH, yWal2 - Wsv / 2, zSerwoTyl]) cube([Hsv, Wsv, Lsv]); }
}
