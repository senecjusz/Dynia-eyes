// Przekrój trzpienia kardana z wkrętem M3 × 10 ISO 7380 do instrukcji montażu (trzpien-kardana.png): płaski przekrój osiowy.
// openscad -o trzpien-kardana.png --imgsize=1200,900 --camera=0,6.2,0,0,0,0,48 --projection=o --colorscheme=Tomorrow trzpien-przekroj.scad
include <../../../duze-oko-v3.scad>
czesc = "brak";
module przekroj() projection(cut = true) rotate([-90, 0, 0]) children();   // płaszczyzna przez oś; oś pionowo, kołnierz na dole
color("orange") linear_extrude(0.1) przekroj() trzpien_kardana();
color("dimgray") translate([0, 0, 0.2]) linear_extrude(0.1) przekroj() {
  translate([0, 0, 0.1]) cylinder(d = 5.7, h = 1.65, $fn = 48); translate([0, 0, 1.75]) cylinder(d = 3, h = tk_m3_dl, $fn = 24); }
