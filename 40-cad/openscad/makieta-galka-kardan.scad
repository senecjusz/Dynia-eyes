// MAKIETA (nie do druku): połączenie drutów S1/S2 z gałką przez kardany 2/2 użytkownika (zgięcie do ~90°, zdjęcie 25.10).
// Kołek Ø2 w kostce gałki (na osi „ucho → orczyk” w położeniu zerowym), kardan 2/2 na kołku, w drugiej piaście pręt Ø2 (drut ocynkowany) do orczyka.
// Użycie: openscad -o x.png -D th=35 -D ph=-25 makieta-galka-kardan.scad
include <duze-oko-v2.scad>
th = 0; ph = 0;
Lk = 23.5; dK = 9; lPiasta = 9;            // kardan 2/2: długość, Ø, długość piasty (założenie); środek przegubu w połowie
function gal(p, t, f) = [[1, 0, 0], [0, cos(f), sin(f)], [0, -sin(f), cos(f)]] * ([[cos(t), 0, sin(t)], [0, 1, 0], [-sin(t), 0, cos(t)]] * p);   // jak w skryptach: Rx(φ)·Ry(θ)
function Hx(xh, ys, zs, r, a) = [xh, ys + r * cos(a), zs + r * sin(a)];
lugi = [[xUcha, 0, zUcho], [0, xUcha, zUcho]];
orcz = [[xOrcz1, yWal1, zWal, rOrcz1], [xOrcz2, yWal2, zWal, rOrcz2]];
function os(i) = let(h = Hx(orcz[i][0], orcz[i][1], orcz[i][2], orcz[i][3], aOrcz0)) (h - lugi[i]) / norm(h - lugi[i]);
function J0(i) = lugi[i];                    // środek przegubu kardana w dawnym punkcie ucha (zgięcie S1 ≤ 56°, S2 ≤ 47°); piasta 1 i kostka z kołkiem w głąb gałki
function Lpret(i) = norm(Hx(orcz[i][0], orcz[i][1], orcz[i][2], orcz[i][3], aOrcz0) - J0(i));
function fK(i, a) = norm(Hx(orcz[i][0], orcz[i][1], orcz[i][2], orcz[i][3], a) - gal(J0(i), th, ph)) - Lpret(i);
function bisK(i, lo, hi, n) = n == 0 ? (lo + hi) / 2 : let(m = (lo + hi) / 2) (fK(i, lo) * fK(i, m) <= 0 ? bisK(i, lo, m, n - 1) : bisK(i, m, hi, n - 1));
function skan(i, a, k, n) = n == 0 ? 999 : (fK(i, a) * fK(i, a + k) <= 0 ? bisK(i, min(a, a + k), max(a, a + k), 30) : skan(i, a + k, k, n - 1));
function alfaK(i) = let(p = skan(i, aOrcz0, 1, 100), m = skan(i, aOrcz0, -1, 100)) abs(p - aOrcz0) < abs(m - aOrcz0) ? p : m;
module walecAB(a, b, d) { hull() { translate(a) sphere(d = d, $fn = 16); translate(b) sphere(d = d, $fn = 16); } }
rotate([90, 0, 0]) {
  color("white", 0.5) rotate([-ph, 0, 0]) rotate([0, th, 0]) Galka();   // gałka z kostkami kardanów (model główny)
  color("tan", 0.5) UchwytSerw();
  for (i = [0, 1]) let(a = alfaK(i), J = gal(J0(i), th, ph), L = gal(lugi[i], th, ph), H = Hx(orcz[i][0], orcz[i][1], orcz[i][2], orcz[i][3], a), u = (H - J) / norm(H - J)) {
    color("silver") walecAB(gal(lugi[i] - os(i) * Lk / 2, th, ph), J, dK);   // piasta 1 na kołku w kostce gałki (obraca się z gałką)
    color("gainsboro") walecAB(J, J + u * Lk / 2, dK);         // piasta 2 w kierunku pręta
    color("red") walecAB(J + u * Lk / 2, H, 2);                 // pręt Ø2 do orczyka
    color("black") hull() { translate([orcz[i][0], orcz[i][1], orcz[i][2]]) sphere(d = 4, $fn = 12); translate(H) sphere(d = 3, $fn = 12); }
    echo(str("KARDAN S", i + 1, " θ=", th, " φ=", ph, " serwo=", a, " zgięcie=", acos(gal(os(i), th, ph) * u)));
  }
  color("steelblue") { translate([xOrcz1 + odstOrcz + wiezaH, yWal1 - Wsv / 2, zSerwoTyl]) cube([Hsv, Wsv, Lsv]); translate([xOrcz2 + odstOrcz + wiezaH, yWal2 - Wsv / 2, zSerwoTyl]) cube([Hsv, Wsv, Lsv]); }
}
