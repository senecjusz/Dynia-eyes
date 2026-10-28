// Przekrój zawiasu powiek w płaszczyźnie osi (y = 0), strona +x: tuba ze szczeliną, słupek, uszy powiek, gałka i wkręt osi M2 × 6 (łeb Ø4 × 2).
// openscad -o zawias-przekroj.png --imgsize=1400,1000 --camera=33.5,0,0,0,0,0,40 --projection=o --colorscheme=Tomorrow zawias-przekroj.scad
include <../../../duze-oko-v3.scad>
czesc = "brak";
os_L = 6.5; os_x1 = sl_R;   // oś równo z zewnętrzną powierzchnią słupka
module przekroj() projection(cut = true) rotate([-90, 0, 0]) children();
module okno() intersection() { children(); translate([27, -9]) square([14, 18]); }
color("silver")      linear_extrude(0.1) okno() przekroj() galka();
color("orange")      translate([0, 0, 0.2]) linear_extrude(0.1) okno() przekroj() plyta();
color("royalblue")   translate([0, 0, 0.4]) linear_extrude(0.1) okno() przekroj() powieka_gorna();
color("mediumseagreen") translate([0, 0, 0.6]) linear_extrude(0.1) okno() przekroj() powieka_dolna();
color("dimgray")     translate([0, 0, 0.8]) linear_extrude(0.1) okno() przekroj() tuba(30);
color("red")         translate([0, 0, 1.0]) linear_extrude(0.1) { translate([os_x1 - 6, -1]) square([6, 2]); translate([os_x1, -os_leb[0] / 2]) square([os_leb[1], os_leb[0]]); }
color("black") translate([0, 0, 1.2]) linear_extrude(0.1) {
  translate([27.6, 5.6]) text("gałka", size = 0.45);
  translate([31.0, -4.2]) text("ucho D", size = 0.4);
  translate([32.8, 5.6]) text("ucho G", size = 0.4);
  translate([35.1, -4.2]) text("słupek", size = 0.4);
  translate([38.2, 5.6]) text("tuba", size = 0.45);
  translate([31.2, 1.2]) text("M2 × 6", size = 0.45);
  translate([29.9, -1.9]) text("1,2", size = 0.4);
  translate([38.5, -3.2]) text("szczelina", size = 0.4);
}
