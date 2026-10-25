// Podstawka – plan części ze sklejki: rozstrzelone złożenie z wkrętami (podgląd do montażu). Wymiary z podstawka.scad.
// Użycie: openscad -o podglad/podstawka-drewno.png --imgsize=1600,1200 podstawka-drewno.scad
include <podstawka.scad>
czesc = "nic";      // ostatnie przypisanie wygrywa: w pliku podstawka.scad nic się nie rysuje

rozsun = 60;        // płyta górna uniesiona w podglądzie
wkretL = 40; wkretD = 3.5;    // wkręty do drewna 3,5 × 40
wkrOdKrawedzi = 30;            // wkręty płyty górnej od przodu i tyłu
wkrZ = [H_IN / 4, 3 * H_IN / 4];   // wkręty ścianek bocznych w ściankę tylną

module wkret(dl = wkretL) color("DimGray") { cylinder(d = wkretD, h = dl, $fn = 12); translate([0, 0, dl]) cylinder(d = 2 * wkretD, h = wkretD / 2, $fn = 12); }

module drewno() {
  color("BurlyWood") {
    translate([0, 0, H_IN + rozsun]) plyta();
    scianaBoczna(); translate([SZ, 0, 0]) mirror([1, 0, 0]) scianaBoczna();   // rowki do środka
    translate([tPl, DL - tPl, 0]) scianaTylna();
  }
  // płyta górna → ścianki boczne (3 na stronę) i tylna (2), od góry
  for (x = [tPl / 2, SZ - tPl / 2], y = [wkrOdKrawedzi, DL / 2, DL - wkrOdKrawedzi])
    translate([x, y, H_IN + rozsun + tPl - wkretL]) wkret();
  for (x = [SZ / 3, 2 * SZ / 3]) translate([x, DL - tPl / 2, H_IN + rozsun + tPl - wkretL]) wkret();
  // ścianki boczne → ścianka tylna (2 na stronę), od boku
  for (s = [0, 1], z = wkrZ) translate([s ? SZ : 0, DL - tPl / 2, z]) rotate([0, s ? -90 : 90, 0]) translate([0, 0, -wkretD]) wkret();
  // szufladka (zarys) i kaseta – żeby było widać, co wchodzi z przodu
  color("LightGreen", 0.5) translate([szX0, 0, szNad]) szuflada();
  color("Orange") for (s = [-1, 1]) multmatrix([[0, 0, -s, s < 0 ? tPl : SZ - tPl], [1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1]]) listwaNosna();
  for (s = [-1, 1], y = lnY) translate([s < 0 ? -wkretD : SZ + wkretD, y, lnH / 2]) rotate([0, s < 0 ? 90 : -90, 0]) wkret(25);   // wkręty listew od zewnątrz
  color("Orange", 0.6) translate([kX0, kY0, 0]) kaseta();
}
drewno();
