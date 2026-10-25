// Podstawka – stan wykonany 25.10: dno 6 sklejone ze ściankami 40, płyta górna 18 na 4 wkrętach (od góry, uniesiona w podglądzie),
// szufladka na dnie (blokada wkrętem przez prawy kołnierz czoła), kaseta przykręcona do dna. Wymiary z podstawka.scad.
// Użycie: openscad -o podglad/podstawka-drewno.png --imgsize=1600,1200 podstawka-drewno.scad
include <podstawka.scad>
czesc = "nic";      // ostatnie przypisanie wygrywa: w pliku podstawka.scad nic się nie rysuje

rozsun = 60;        // płyta górna uniesiona w podglądzie
wkretL = 40; wkretD = 3.5;    // wkręty płyty górnej 3,5 × 40

module wkret(dl = wkretL) color("DimGray") { cylinder(d = wkretD, h = dl, $fn = 12); translate([0, 0, dl]) cylinder(d = 2 * wkretD, h = wkretD / 2, $fn = 12); }

module drewno() {
  color("BurlyWood") {
    dno();
    translate([0, 0, tDno]) { scianaBoczna(); translate([SZ - tPl, 0, 0]) scianaBoczna(); translate([tPl, DL - tPl, 0]) scianaTylna(); }
    translate([0, 0, tDno + H_IN + rozsun]) plyta();
  }
  for (x = [tPl / 2, SZ - tPl / 2], y = [wkrPlOd, DL - wkrPlOd])   // płyta górna → ścianki boczne, od góry
    translate([x, y, tDno + H_IN + rozsun + tPl - wkretL]) wkret();
  color("LightGreen", 0.5) translate([szX0, 0, szNad]) szuflada();
  translate([szX0 + xBlok, -czoloT + blokL, szNad + czH / 2]) rotate([90, 0, 0]) wkret(blokL);   // blokada szufladki: M4 imbus od przodu (łeb na czole)
  color("Orange", 0.6) translate([kX0, kY0, tDno]) kaseta();
}
drewno();
