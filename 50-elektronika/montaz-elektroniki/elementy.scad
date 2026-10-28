// Elektronika na tacce v2 – model do instrukcji montażu i kontroli kolizji (sesja elektroniki, 28.10).
// Tacka: podstawka.scad z gałęzi wykonawca-montaz (commit 8a07059, podkładki ESP 7 mm), kopiowana obok przez eksport.sh.
// Układ tacki: x od lewego boku, y od przodu tacki, z od spodu tacki [mm]. Sufit = spód płyty górnej, 40 nad spodem tacki.
// Wymiary kupnych części: TYPOWE (nie mierzone) – listwa goldpin 2,5 plastiku, obudowa Dupont 2,5 × 2,5 × 14, kondensator Ø8 × 12,
// gniazdo USB-C z pomiarów użytkownika (kołnierz 14, korpus 13, gwint 11, nakrętka 15,5 × 3). Kanał 0 PCA po lewej – do sprawdzenia na płytce.
use <podstawka.scad>
grupa = "wszystko";

kDno = 2.4; SUFIT = 40;
// PCA9685 HW-170
pX = 75; pY = 45; pZ = kDno + 5; pT = 1.6; pTop = pZ + pT;           // płytka na słupkach 5
gp = 2.54; plast = 2.5; dup = 14;                                     // raster, plastik listwy, obudowa Dupont
function chX(i) = 81.9 + (i + floor(i / 4)) * gp;                     // kolumna kanału (4 grupy po 4)
rowY = [46.8, 46.8 + gp, 46.8 + 2 * gp];                              // od krawędzi: GND, V+, sygnał
function bokY(k) = 57.5 + (k - 2.5) * gp;                             // listwy boczne, 6 pinów: GND, OE, SCL, SDA, VCC, V+ (kolejność wg napisu)
bokXL = 77.3; bokXP = 134.7;
dupTop = pTop + plast + dup;                                          // 25,5 – wierzch wtyków na PCA
// ESP32-C3 SuperMini na podkładkach
eX0 = 15; eY0 = 16.5; eW = 18.4; eL = 22.5; eT = 1.2;
eZ = kDno + 16 + 7;                                                    // spód płytki 25,4
eRowX = [24.2 - 7.6, 24.2 + 7.6];                                      // rząd od ściany (5,6,7,8,9,10,20,21), rząd od PCA (5V,G,3V3,4,3,2,1,0)
function eY(k) = 18.3 + k * gp;
eDupBot = eZ - plast - dup;                                            // 8,9 – spód wtyków pod ESP
// gniazdo USB-C
gX = 157.1; gY = 48; gZ = kDno + 18 / 2 + 1;                           // oś 12,4
// przycisk w prawej ściance podstawki (od środka)
bY = 83; bZ = 23;

module przewod(p, d = 1.3) for (i = [0 : len(p) - 2]) hull() { translate(p[i]) sphere(d = d, $fn = 8); translate(p[i + 1]) sphere(d = d, $fn = 8); }
module dupGora(x, y) { translate([x - 1.25, y - 1.25, pTop + plast]) cube([2.5, 2.5, dup]); }
module dupDol(x, y) { translate([x - 1.25, y - 1.25, eDupBot]) cube([2.5, 2.5, dup]); }
// przewód wchodzący od góry do wtyku na PCA: ostatnie punkty nad pinem
function doPCA(x, y) = [[x, y, dupTop + 3], [x, y, dupTop]];
function zESP(k, r) = [[eRowX[r], eY(k), eDupBot], [eRowX[r], eY(k), 5]];

// ---------- grupy ----------
module pca() {
  translate([pX, pY, pZ]) cube([62, 25, pT]);
}
module pcaListwy() {   // listwy goldpin (plastik i piny) bez wtyków
  for (i = [0:15], r = [0:2]) { translate([chX(i) - 1.25, rowY[r] - 1.25, pTop]) cube([2.5, 2.5, plast]); translate([chX(i) - 0.3, rowY[r] - 0.3, pTop]) cube([0.6, 0.6, plast + 6]); }
  for (x = [bokXL, bokXP], k = [0:5]) { translate([x - 1.25, bokY(k) - 1.25, pTop]) cube([2.5, 2.5, plast]); translate([x - 0.3, bokY(k) - 0.3, pTop]) cube([0.6, 0.6, plast + 6]); }
}
module zacisk() { translate([101, 62, pTop]) cube([10.2, 7.6, 10]); }
module podkladki() for (y = [16.5, 36]) translate([24.2 - 5.5, y, kDno + 16]) cube([11, 3, 7]);
module esp() {
  translate([eX0, eY0, eZ]) cube([eW, eL, eT]);
  translate([24.2 - 4.5, 15, eZ + eT]) cube([9, 7.5, 3.2]);           // gniazdo USB-C ESP
}
module espPiny() for (r = [0, 1], k = [0:7]) translate([eRowX[r] - 1.25, eY(k) - 1.25, eZ - plast]) cube([2.5, 2.5, plast]);
uzyteESP = [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [0, 0], [0, 3], [0, 4], [0, 5]];   // [rząd, k]: 5V, G, 3V3, 4, 3 | 5, 8, 9, 10
module espWtyki() for (u = uzyteESP) dupDol(eRowX[u[0]], eY(u[1]));
module gniazdo() {
  translate([gX, gY - 2, gZ]) rotate([-90, 0, 0]) cylinder(d = 14, h = 2, $fn = 32);     // kołnierz przed ścianką
  translate([gX, gY, gZ]) rotate([-90, 0, 0]) cylinder(d = 11, h = 13, $fn = 32);       // korpus przez ściankę
  translate([gX, gY + 3, gZ]) rotate([-90, 0, 0]) cylinder(d = 15.5 / cos(30), h = 3, $fn = 6);   // nakrętka
}
module wtykCC() translate([gX - 6, 18, gZ - 3.5]) cube([12, 28, 7]);
module zasilanie(kolor) {   // 0 czerwony → V+, 1 czarny → GND (śruby zacisku: wg napisu)
  xs = [108.6, 103.5];
  przewod([[gX + (kolor ? 1.5 : -1.5), 61, gZ], [150, 88, 6], [130, 88 + (kolor ? 2 : 0), 6], [xs[kolor], 80, 14], [xs[kolor], 70.5, 14]], 1.6);
}
module espPCA(n) {   // 0: 5V→9 V+, 1: G→9 GND, 2: 3V3→VCC, 3: 8→SDA, 4: 9→SCL
  if (n == 0) przewod(concat(zESP(0, 1), [[45, 30, 5], [100, 38, 5], [chX(9) + 0.4, 40, dupTop + 3]], doPCA(chX(9) + 0.4, rowY[1])));
  if (n == 1) przewod(concat(zESP(1, 1), [[44, 32, 5], [98, 40, 5], [chX(9) - 0.4, 42, dupTop + 3]], doPCA(chX(9) - 0.4, rowY[0])));
  if (n == 2) przewod(concat(zESP(2, 1), [[40, 45, 5], [70, bokY(4), 5], [bokXL - 3, bokY(4), dupTop + 3]], doPCA(bokXL, bokY(4))));
  if (n == 3) przewod(concat(zESP(3, 0), [[24, 34, 4], [38, 47, 4], [70, bokY(3), 4], [bokXL - 3, bokY(3), dupTop + 4]], doPCA(bokXL, bokY(3))));
  if (n == 4) przewod(concat(zESP(4, 0), [[24, 37, 4], [36, 49, 4], [70, bokY(2), 4], [bokXL - 3, bokY(2), dupTop + 5]], doPCA(bokXL, bokY(2))));
}
module espPCAwtyki() { dupGora(chX(9), rowY[0]); dupGora(chX(9), rowY[1]); for (k = [2:4]) dupGora(bokXL, bokY(k)); }
module kondensator() {
  for (r = [0, 1]) przewod([[chX(8), rowY[r], dupTop], [chX(8), rowY[r], dupTop + 2], [chX(8) + (r ? 1 : -1), 40, dupTop + 4]], 0.7);
  translate([chX(8), 40, dupTop + 4]) rotate([90, 0, 0]) cylinder(d = 8, h = 12, $fn = 32);
}
module kondWtyki() for (r = [0, 1]) dupGora(chX(8), rowY[r]);
module pir(n) {   // 0 VCC → 10 V+, 1 GND → 10 GND, 2 OUT → ESP 10
  if (n < 2) przewod(concat([[150, 10, 5], [142, 10 + n, 5], [125, 30, 5], [chX(10) + (n ? -0.4 : 0.4), 40, dupTop + 3]], doPCA(chX(10) + (n ? -0.4 : 0.4), rowY[1 - n])));
  if (n == 2) przewod(concat([[150, 9, 5], [142, 9, 5], [138, 22, 4], [40, 22, 4]], [[eRowX[0], eY(5), 5], [eRowX[0], eY(5), eDupBot]]));
}
module pirWtyki() { dupGora(chX(10), rowY[0]); dupGora(chX(10), rowY[1]); }
module przycisk() translate([151, bY, bZ]) rotate([0, 90, 0]) cylinder(d = 15, h = 20, $fn = 32);
module przyciskPrzew(n) {
  if (n == 0) przewod(concat([[151, bY - 3, bZ], [140, 62, dupTop + 4]], [[bokXP, bokY(0), dupTop + 3], [bokXP, bokY(0), dupTop]]));
  if (n == 1) przewod([[151, bY + 3, bZ], [120, 82, 20], [70, 82, 14], [45, 55, 10], [36, 28, 5], [eRowX[1], eY(3), 5], [eRowX[1], eY(3), eDupBot]]);
}
module przyciskWtyk() dupGora(bokXP, bokY(0));
module zapasESP() { przewod([[eRowX[1], eY(4), eDupBot], [eRowX[1], eY(4), 5], [40, eY(4), 5], [44, 42, 5]]); przewod([[eRowX[0], eY(0), eDupBot], [eRowX[0], eY(0), 5], [9, 18, 5], [8, 32, 5]]); }
// skrętki: s = 0 lewa (ch 0–3), 1 prawa (4–7), 2 duże oko (12–15)
sk = [[50, 55, 0], [63, 75, 4], [76, 95, 12]];   // x nad otworem, x uchwytu, n
function skCh(s) = sk[s][2];
module skretkaPlaszcz(s) { n = skCh(s); xg = (chX(n) + chX(n + 3)) / 2; przewod([[sk[s][0], 6, SUFIT], [sk[s][1], 9, 12], [sk[s][1], 12, 4.9], [sk[s][1], 20, 5], [xg, 36, dupTop + 6]], 5); }
module skretkaZyla(s, z) {   // żyła 1..8 → pin
  n = skCh(s); xg = (chX(n) + chX(n + 3)) / 2;
  cel = z == 1 ? [chX(n), rowY[2]] : z == 2 ? [chX(n + 1), rowY[2]] : z == 3 ? [chX(n + 2), rowY[2]] : z == 6 ? [chX(n + 3), rowY[2]]
      : z == 4 ? [chX(n), rowY[1]] : z == 5 ? [chX(n), rowY[0]] : z == 7 ? [chX(n + 2), rowY[1]] : [chX(n + 2), rowY[0]];
  przewod(concat([[xg, 36, dupTop + 6]], [[cel[0], cel[1] - 3, dupTop + 4]], doPCA(cel[0], cel[1])), 1);
}
module skretkaWtyki(s) { n = skCh(s); for (i = [0:3]) dupGora(chX(n + i), rowY[2]); for (i = [0, 2], r = [0, 1]) dupGora(chX(n + i), rowY[r]); }
module rezystor() {
  translate([32, 72, kDno + 8 + 3]) rotate([-90, 0, 0]) cylinder(d = 6, h = 17, $fn = 24);
  translate([32, 64, kDno + 8 + 3]) rotate([-90, 0, 0]) cylinder(d = 0.9, h = 37, $fn = 8);   // nóżki: tylna wychodzi za tylny słupek
}
module sufit() translate([0, 0, SUFIT]) cube([170, 100, 0.4]);

// ---------- wybór ----------
if (grupa == "tacka") kaseta();
else if (grupa == "sufit") sufit();
else if (grupa == "pca") pca();
else if (grupa == "pcaListwy") pcaListwy();
else if (grupa == "zacisk") zacisk();
else if (grupa == "podkladki") podkladki();
else if (grupa == "esp") esp();
else if (grupa == "espPiny") espPiny();
else if (grupa == "espWtyki") espWtyki();
else if (grupa == "gniazdo") gniazdo();
else if (grupa == "wtykCC") wtykCC();
else if (grupa == "zasilCzerw") zasilanie(0);
else if (grupa == "zasilCzarny") zasilanie(1);
else if (grupa == "esp5V") espPCA(0);
else if (grupa == "espG") espPCA(1);
else if (grupa == "espI2C") { espPCA(2); espPCA(3); espPCA(4); }
else if (grupa == "espPCAwtyki") espPCAwtyki();
else if (grupa == "kondensator") kondensator();
else if (grupa == "kondWtyki") kondWtyki();
else if (grupa == "pirVCC") pir(0);
else if (grupa == "pirGND") pir(1);
else if (grupa == "pirOUT") pir(2);
else if (grupa == "pirWtyki") pirWtyki();
else if (grupa == "przycisk") przycisk();
else if (grupa == "przyciskGND") przyciskPrzew(0);
else if (grupa == "przyciskSyg") przyciskPrzew(1);
else if (grupa == "przyciskWtyk") przyciskWtyk();
else if (grupa == "zapasESP") zapasESP();
else if (grupa == "skL") { skretkaPlaszcz(0); }
else if (grupa == "skP") { skretkaPlaszcz(1); }
else if (grupa == "skD") { skretkaPlaszcz(2); }
else if (grupa == "skZyly") for (s = [0:2], z = [1:8]) skretkaZyla(s, z);
else if (grupa == "skWtyki") for (s = [0:2]) skretkaWtyki(s);
else if (grupa == "rezystor") rezystor();
// kontrola kolizji: elementy, które nie mogą wchodzić w tackę ani w sufit
else if (grupa == "kolizjaTacka") intersection() { kaseta(); union() { espWtyki(); esp(); kondensator(); przycisk(); pca(); for (s = [0:2]) skretkaWtyki(s); espPCAwtyki(); zacisk(); } }
else if (grupa == "kolizjaSufit") intersection() { translate([0, 0, SUFIT]) cube([170, 100, 30]); union() { esp(); kondensator(); for (s = [0:2], z = [1:8]) skretkaZyla(s, z); espPCA(0); espPCA(1); espPCA(2); espPCA(3); espPCA(4); pir(0); pir(1); przyciskPrzew(0); } }
else if (grupa == "kolizjaRezystor") intersection() { kaseta(); rezystor(); }
