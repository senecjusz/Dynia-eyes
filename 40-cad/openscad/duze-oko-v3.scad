// Duże oko v3 – adaptacja The Face maker101 (koncepcja 20-analizy/2026-10-26-duze-oko-koncepcja-referencja.md,
// decyzja PM 20-analizy/review/2026-10-26-odstepstwa-koncepcji-decyzja-pm.md): płyta pozioma za tubą, kardan 5/5 w środku kuli,
// pręty z drutu Ø1,0 z końcami w „Z”, dwie powieki na słupkach płyty, tuba 30/40/50 z kołnierzem, maskownica.
//
// Układ złożenia: 0 = środek kuli, z do przodu (na zewnątrz dyni), y w górę, x w prawo patrząc od przodu.
// Użycie: openscad -D 'czesc="Galka"' -D 'tryb="druk"' -o Galka.3mf duze-oko-v3.scad
//   czesc: Plyta, Galka, PowiekaGorna, PowiekaDolna, PrzedluzenieOrczyka, Tuba30, Tuba40, Tuba50, Maskownica,
//          parametry (echo JSON), zlozenie (podgląd całości)
//   tryb:  "druk" (orientacja do druku, płaska strona na z = 0) albo "zlozenie" (położenie w układzie złożenia)
// Źrenica ≤ Ø20, gałka 24 mm przed rantem, czasza ok. 111°: decyzje użytkownika 26.10 (P4, P5).

czesc = "zlozenie";
tryb  = "zlozenie";
$fa = 3; $fs = 0.4;

// ---------- Parametry: gałka ----------
R_kula   = 30;     // Ø60
sc_kula  = 2;      // ścianka
z_kraw   = -11;    // płaska krawędź tylna czaszy, ok. 111° od przodu – decyzja użytkownika 26.10 ( przy −11,5 sztywny drut „Z” L–P miał 0,27 do krawędzi przy theta ±25)
piasta_d = 14;     // jedna centralna piasta od przedniego bieguna
piasta_z = 14;     // czoło piasty (piasta przednia kardana kończy się na +12,75)
leb_d    = 9.5;    // gniazdo kołnierza trzpienia kardana (dawniej łeb M5×8 ISO 4762 Ø8,5 × 5 + 0,5 na stronę na klej)
leb_h    = 5.2;
zacz_r   = 15.5;   // otwór zaczepu pręta: promień od osi oka (mostek ≥ 1 mm od wylotu fazki do końca języczka r 12,8)
zacz_z   = -4.5;   // i położenie wzdłuż osi
zacz_r0  = 12.8;   // wewnętrzny koniec języczka
zacz_gr  = 2.0;    // grubość języczka i słupka G–D (wzdłuż osi otworu)
zacz_h   = 5;      // wysokość języczka wzdłuż osi oka
drut_d   = 1.0;    // drut napędu Ø1 (jest w warsztacie – użytkownik 26.10, powrót z Ø1,2)
// „Z” gięte ręcznie kombinerkami (zdjęcia 70-budowa/zdjecia/2026-10-26-drut-z): noga między zagięciami ok. 6 (5–7),
// promień gięcia ok. 1, ogon po zgięciu skrócony do ok. 2; otwór na środku nogi, noga przesuwa się w nim o ok. ±0,5;
// noga 7 (górna granica gięcia): przy 6 ogon G–D przy theta +25 zbliża się do płytki słupka na 0,22, przy 7 luz 0,64
drut_noga = 7;     // noga „Z” między zagięciami (osie)
drut_r_gi = 1;     // promień gięcia (wewnętrzny)
drut_ogon = 2;     // ogon za drugim zagięciem
zacz_otw = 1.3;    // otwór na drut Ø1 w uszkach powiek i przedłużeniach orczyka (0,15 na stronę)
zacz_gardz_d = 2.0;  // otwór dwustożkowy w języczkach gałki: światło gardzieli (drut Ø1 przechyla się do ok. 37°)
zacz_gardz_l = 1.0;  // długość gardzieli; dalej fazki 45° do obu ścian
zacz_ods = drut_noga / 2;   // odsadzenie zagięcia „Z” od środka otworu wzdłuż osi otworu (otwór na środku nogi)
orcz_ods = drut_noga / 2;   // to samo w otworach orczyków
slup_GD_szer = 6.5;  // słupek zaczepu G–D w płaszczyźnie y = zacz_r: szerokość w x
slup_GD_nasada = 4;  // początek pogrubienia słupka ku czaszy (skos 45° w ±y do grubości 14)
zacz_pod = 20;     // od tego promienia języczek ma podparcie 45° do krawędzi (druk krawędzią w dół)
zrenica_d = 20;    // decyzja użytkownika 26.10 (P4): czarny środek najwyżej Ø20; tylko do rachunku odsłonięcia, w modelu nic nie rysuje
wystawanie = 24;   // decyzja użytkownika 26.10 (P5): gałka 24 mm przed rantem tuby; rant na z = R_kula − wystawanie

// ---------- Parametry: powieki ----------
pG_ri = 33.2; pG_ro = 34.4;      // górna (zewnętrzna)
pD_ri = 31.0; pD_ro = 32.2;      // dolna (wewnętrzna); luz 1,0 do gałki i między powiekami
pow_tyl  = 3;      // krawędź tylna powieki w płaszczyźnie z = −3 (płaska strona do druku; ucho r 3 nad stołem)
ucho_r   = 3;      // ucho zawiasu: krążek r 3 z otworem Ø2,4
os_otw   = 2.4;    // otwór osi w uszach (drut Ø2, luz 0,2 na stronę)
uchoG    = [33.2, 34.4];   // |x| ucha górnej
uchoD    = [31.8, 33.0];   // |x| ucha dolnej (0,2 osiowo do ucha górnej)
// oś powiek: wkręt M2 × 6 (użytkownik 27.10: ma M2 × 5 i M2 × 6) od zewnątrz słupka, łeb na słupku, gwint wkręcony w powiekę dolną
// (otwór Ø1,6 w uchu i czaszy x 31…33), luźno w słupku i uchu górnej (Ø2,4); łeb przechodzi w szczelinie tuby (łeb do Ø4 × 2)
os_wkret_otw = 1.6; os_leb = [4.0, 2.0]; os_szczel_luz = 0.5;   // szczelina tuby 5,0 (review Astry 28.10: 4,6 za ciasno)
os_ucho_D_wew = 31.0;   // ucho dolnej pogrubione do środka: pełny pierścień wokół gwintu M2 na x 31,0…33,0 (review Astry: było 1,2 pełne); do gałki R30 1,0
os_szczel_x = 40.5;     // szczelina tuby tylko do |x| 40,5 (łeb do 39,2): kołnierz Ø92 zostaje cały
zaczG    = [5, 34.0];      // zaczep drutu powieki górnej: [x, promień od osi zawiasu]
zaczD    = [-5, 31.5];     // dolnej
zacz_pow_gr = 2;           // grubość uszka drutu (wzdłuż x)
zacz_pow_z  = 1.6;         // otwór uszka nad płaszczyzną osi (pod uszkiem wycięcie paska krawędzi tylnej)
pow_ods     = drut_noga / 2;   // odsadzenie zagięcia „Z” drutu powieki od środka uszka (otwór na środku nogi)
otwarcie = 51.5;           // pełne otwarcie powiek

// ---------- Parametry: płyta, słupki, słupek kardana ----------
pl_y    = -15;     // wierzch płyty (ucha serwa L–P leżą na płycie, orczyk L–P na wysokości osi)
pl_gr   = 5;
pl_zP   = -49;     // przód płyty: za kołnierzem tuby 50 (z −44…−47), 2 mm zapasu
pl_zT   = -105;
pl_x    = 42;
pl_stopka = 3;     // ścięcie 45° tylnej dolnej krawędzi płyty: przyprostokątne pl_stopka, płaski pas pl_stopka·√2 = 4,24 – stopka do druku pod kątem 45°
sl_x0   = 34.7;    // słupek zawiasu: od x 34,7 do łuku R37,2 (0,95 do ścianki tuby R38,15 na całej szerokości)
sl_R    = 37.2;
sl_h    = 10;      // wysokość słupka (y ±5)
sl_zP   = 4;       // przód słupka
sl_otw  = 2.4;     // otwór na drut Ø2 w słupku: luźny, drut na CA (decyzja PM o kleju; wcisk ugiąłby ramię)
pod_x0  = 33.2;    // podpora słupka (pion) od płyty do słupka, z −49…−53
pod_gr  = 4;
kol_d   = 12;      // słupek kardana
kol_zP  = -14.25;  // czoło słupka (piasta tylna kardana kończy się na −12,75; trzpień wchodzi 6,5)
kol_klocek = [12, 9];   // klocek słupka kardana przed płytą: szerokość x, głębokość z (w świetle tuby, do z = −40)
kol_z0  = -51;     // tył słupka i klocka (2 mm w płycie; orczyk G–D pracuje za nim)
kol_skos_x = 14;   // nasada słupka kardana: skosy 45° po płycie do x ±14
kol_zebro = -31;   // żebro pod słupkiem kardana sięga do z = −31 (skos 45° od przodu klocka)
kol_zebro_gr = 5;  // grubość żebra (x)
sl_zebro = -12;    // skos żebra słupka zawiasu schodzi do zera na ramieniu na z = −12 (bez uskoku przekroju)
sl_zebro_x = 30;   // wewnętrzna krawędź żebra słupka zawiasu (|x|)
sl_zebro_z0 = -38; // do tego z żebro słupka zawiasu ma pełną wysokość y −12…+5 (w świetle tuby: r ≤ 36,7)
sl_zebro_r = 37.2; // część żebra przed płytą schodząca do spodu płyty: r ≤ 37,2 (0,95 do światła tuby, jak ramię)

// ---------- Parametry: serwa MG90S (rysunek Miuzei, 30-projekt/e6-pomiary.md) ----------
sv_L = 22.8; sv_W = 12.5; sv_H = 22.5; sv_ucho_h = 18; sv_ucho_gr = 2; sv_ucho_wys = 4.5; sv_wal = 5.5; sv_czubek = 35;
sv_luz = 0.2;      // gniazdo na klej: luz na stronę
// położenia wałków [x, y, z]; kierunki opisane przy gniazdach
LP_wal = [33.0, 0, -66];      // pion (do góry), orczyk 17,5 w płaszczyźnie y ≈ 0
GD_wal = [0, 2.3, -60];       // poziomo w +x, korpus po lewej, orczyk 11,5 w płaszczyźnie x ≈ 0
PG_wal = [0, -9.5, -95];      // poziomo w −x, korpus po prawej, orczyk 25 (przedłużenie) w płaszczyźnie x ≈ 1,75; przód korpusu 1 mm za tylnym uchem L–P
PD_wal = [0, -9.5, -76];      // poziomo w +x, korpus po lewej, orczyk 25 w płaszczyźnie x ≈ −1,75 (przez szczelinę w płycie)
orcz_LP = 17.5; orcz_GD = 11.5; orcz_pow = 25;
pG_x_orcz = 1.75;  // płaszczyzna otworu przedłużenia orczyka powieki górnej (przedłużenie na zewnętrznej stronie ramienia, czubek wałka x = 3)
pD_x_orcz = -1.75; // dolnej (czubek wałka x = −3)
pG_psi0 = 25;      // kąt orczyka powieki górnej przy zamkniętej powiece (od +y ku +z, w płaszczyźnie x = zaczG.x)
pD_psi0 = 35;      // dolnej (od −y ku +z)

// ---------- Parametry: podpora płyty do druku pod 45° (decyzja użytkownika 26.10, wzór: film Slant 3D) ----------
pod45_g = 0.8;      // odstęp płetwy od spodu płyty (0,5–1)
pod45_t = 1.2;      // grubość płetwy i żeber
pod45_x = 40;       // płetwa i podstawa w x ±40
pod45_zebra = [-36, -18, 0, 18, 36];   // żebra (x)
pod45_podst = 1.0;  // grubość podstawy na stole
pod45_przod = -8;   // podstawa sięga do Y' = −8 (pod końce ramion; przeciw przewracaniu)
// podpory pod spodami ramion zawiasu i słupka kardana (użytkownik 26.10: „zawsze bezpieczniejszy wydruk”)
pod45_ram_z = [-32, 2.5];    // zakres z spodu ramienia (y = −5) podpierany od stołu (dalej do tyłu linia w dół trafia w płytę)
pod45_kol_z = [-24, -16];    // zakres z spodu słupka kardana (y = −6) podpierany od stołu (bliżej płyty trafia w klocek nasady)
pod45_scianka = 1.6;         // grubość ścianki pod ramieniem (pod słupkiem kardana 3)
pod45_skosy = [[4, 0], [26, 1]];  // skośne (45°) zastrzały ścianek: [Z' dolnego końca, 0 = od ścianki ramienia w górę do środkowej, 1 = od środkowej w górę do ścianki ramienia]
pod45_karb = 0.7;   // średnica łącznika przy płycie (karb do odłamania); przy płetwie 1,6
pod45_lacza = true; // false: podpora bez łączników (do kontroli odstępu od płyty)
// łączniki: punkty (x, z) na spodzie płyty, ≥ 2 mm od gniazd i szczelin
pod45_lacz = [[-36, -98], [-36, -88], [-36, -78], [-36, -68], [-36, -58], [-36, -52], [-24, -98], [-24, -88], [-24, -78], [-24, -68], [-24, -52], [-12, -98], [-12, -88], [-12, -78], [-12, -70], [0, -98], [0, -52], [12, -98], [12, -88], [12, -78], [12, -68], [12, -58], [12, -52], [24, -98], [24, -88], [24, -78], [24, -68], [24, -58], [24, -52], [36, -98], [36, -88], [36, -52]];

// ---------- Parametry: przedłużenie orczyka ----------
prz_L = 28; prz_szer = 6; prz_gr = 2.5; prz_piasta = 7;   // listwa na płaskiej (zewnętrznej) stronie ramienia; otwór Ø7 na pierścień piasty (0,4 nad ramieniem) i łeb wkrętu
// ramię orczyka MG90S (pomiar użytkownika 27.10): szerokość 6 przy piaście, 4 na końcu, koniec ok. 18 od osi, grubość 2,3 → 2, otwory co 2 od 5,5 do 17,5
prz_ram = [6, 4, 18];     // szerokość ramienia przy piaście, na końcu; koniec od osi
prz_row = [0.15, 1.2];    // rowek na ramię: luz na stronę, głębokość (ścianki po bokach ramienia, otwarte na końcu)
prz_kolki = [13.5, 17.5]; // otwory na kołki z drutu Ø1 przez otwory orczyka (jak v2; otwory orczyka rozwiercić Ø1, gdy drut nie wchodzi)

// ---------- Parametry: tuba, kołnierz, maskownica ----------
tuba_D = 79.5; tuba_d = 76.3;          // otwór w dyni Ø80
rant_z = R_kula - wystawanie;          // +6
kol_D  = 92; kol_gr = 3;               // kołnierz od środka dyni
lapa_r = 47; lapa_szer = 12; lapa_otw = 4.5; lapa_kat = [45, 135, 225, 315];   // 4 łapy na wkręty do drewna 4 × 30–40
mask_D = 84; mask_d = 76.3; mask_gr = 2;

// ---------- pomocnicze ----------
E = 0.01;
// otwór o zadanym najmniejszym świetle: wielokąt opisany na okręgu d (OpenSCAD wpisuje wielokąt w okrąg)
function d_opis(d, n) = d / cos(180 / n);
OTW_N = 32;
module sfera_pow(ri, ro) { difference() { sphere(r = ro, $fn = 120); sphere(r = ri, $fn = 120); } }
module walec_x(d, x0, x1, n = 0) { translate([x0, 0, 0]) rotate([0, 90, 0]) if (n > 0) cylinder(d = d, h = x1 - x0, $fn = n); else cylinder(d = d, h = x1 - x0); }
module pudlo(x0, x1, y0, y1, z0, z1) { translate([x0, y0, z0]) cube([x1 - x0, y1 - y0, z1 - z0]); }

// =================== GAŁKA ===================
module otwor_dwustozkowy(gr) {   // wzdłuż osi z, środek w 0: gardziel o świetle zacz_gardz_d, fazki 45° do ścian ±gr/2
  f = (gr - zacz_gardz_l) / 2;
  cylinder(d = d_opis(zacz_gardz_d, OTW_N), h = gr + 2, center = true, $fn = OTW_N);
  for (m = [0, 1]) mirror([0, 0, m]) translate([0, 0, zacz_gardz_l / 2])
    cylinder(d1 = d_opis(zacz_gardz_d, OTW_N), d2 = d_opis(zacz_gardz_d + 2 * f + 2, OTW_N), h = f + 1, $fn = OTW_N);
}
module zaczep_LP() {   // języczek w płaszczyźnie XZ (gr. wzdłuż y), otwór wzdłuż y gałki
  r_sc = sqrt(pow(R_kula - sc_kula / 2, 2) - zacz_z * zacz_z);
  difference() {
    intersection() {
      union() {
        pudlo(zacz_r0, r_sc, -zacz_gr / 2, zacz_gr / 2, zacz_z - zacz_h / 2, zacz_z + zacz_h / 2);
        hull() {   // podparcie 45° pod zewnętrzną częścią języczka, do płaszczyzny krawędzi (stołu)
          pudlo(zacz_pod, r_sc, -zacz_gr / 2, zacz_gr / 2, zacz_z - zacz_h / 2, zacz_z - zacz_h / 2 + E);
          pudlo(zacz_pod + (zacz_z - zacz_h / 2 - z_kraw), R_kula, -zacz_gr / 2, zacz_gr / 2, z_kraw, z_kraw + E);
        }
      }
      sphere(r = R_kula - sc_kula / 2, $fn = 120);
      translate([-50, -50, z_kraw]) cube(100);
    }
    translate([zacz_r, 0, zacz_z]) rotate([90, 0, 0]) otwor_dwustozkowy(zacz_gr);
  }
}
module zaczep_GD() {   // słupek w płaszczyźnie y = zacz_r (gr. wzdłuż y) od przedniej czaszy do 1 mm pod otworem; otwór wzdłuż y gałki
  difference() {
    z0 = zacz_z - zacz_gardz_d / 2 - (zacz_gr - zacz_gardz_l) / 2 - 1;   // 1 mm pod wylotem fazki: niżej pracuje pręt G–D
    intersection() {
      // od przedniej czaszy w dół; spód 3 mm szerokości, narożniki ścięte pod 45° (luz pręta przy wychyleniu L–P)
      union() {
        hull() {
          pudlo(-1.5, 1.5, zacz_r - zacz_gr / 2, zacz_r + zacz_gr / 2, z0, R_kula);
          pudlo(-slup_GD_szer / 2, slup_GD_szer / 2, zacz_r - zacz_gr / 2, zacz_r + zacz_gr / 2, z0 + slup_GD_szer / 2 - 1.5, R_kula);
        }
        // nasada: od z = slup_GD_nasada pogrubienie w y skosem 45° do czaszy (sztywność na zginanie siłą pręta)
        hull() {
          pudlo(-slup_GD_szer / 2, slup_GD_szer / 2, zacz_r - zacz_gr / 2, zacz_r + zacz_gr / 2, slup_GD_nasada, R_kula);
          pudlo(-slup_GD_szer / 2, slup_GD_szer / 2, zacz_r - zacz_gr / 2 - 6, zacz_r + zacz_gr / 2 + 6, slup_GD_nasada + 6, R_kula);
        }
      }
      sphere(r = R_kula - sc_kula / 2, $fn = 120);
    }
    translate([0, zacz_r, zacz_z]) rotate([90, 0, 0]) otwor_dwustozkowy(zacz_gr);
  }
}
module galka() {
  difference() {
    union() {
      difference() { sfera_pow(R_kula - sc_kula, R_kula); translate([-50, -50, z_kraw - 100]) cube([100, 100, 100]); }
      intersection() {   // piasta od przedniego bieguna
        translate([0, 0, piasta_z]) cylinder(d = piasta_d, h = R_kula);
        sphere(r = R_kula - sc_kula / 2, $fn = 120);
      }
      zaczep_LP();                                 // L–P: x = zacz_r, otwór wzdłuż y
      zaczep_GD();                                 // G–D: słupek y = zacz_r, otwór wzdłuż y
    }
    translate([0, 0, piasta_z - E]) cylinder(d = leb_d, h = leb_h + E);   // gniazdo łba M5, wylot do tyłu
  }
}

// =================== TRZPIEŃ KARDANA (PLA z rdzeniem M3, decyzja PM 27.10) ===================
// Jedna część do gałki i do słupka zamiast łba M5 (użytkownik nie ma M5×8, jego M5×16 mają łeb stożkowy Ø10).
// Kardan: otwór gładki Ø5,05–5,1 (pomiar użytkownika 27.10), głębokość użytkowa 6, wkręt dociskowy z boku 3,65 ±0,2 od czoła piasty.
// Kołnierz wklejany CA w gniazdo leb_d × leb_h; trzpień wchodzi w kardan na 6,0 od gałki (szczelina 1,25) i 5,75 od słupka (1,5).
// Rdzeń: wkręt M3×10 ISO 7380 (łeb Ø5,7 × 1,65, razem 12 – pomiar użytkownika) wkręcony od czoła kołnierza w otwór pilotowy w PLA;
// stal sięga w kardan 5,65 / 5,4 od czoła piasty (wymagane ≥ 4,85) i kończy się 0,35 przed czubkiem trzpienia.
tk_d      = 4.95;  // trzpień (warianty do przymiarki 4,9 i 5,0)
tk_kol_d  = 9.3;   // kołnierz w gnieździe Ø9,5 (warianty 9,2 i 9,3)
tk_l      = (piasta_z - 12.75) + 6;   // trzpień od czoła kołnierza: szczelina od gałki 1,25 + 6 w kardanie = 7,25
tk_m3_leb = [6.0, 1.75];   // kieszeń na łeb M3 (Ø5,7 × 1,65 + luz; łeb 0,1 pod czołem kołnierza)
tk_m3_dl  = 12 - 1.65;     // trzon M3 pod łbem
tk_pilot  = 2.5;   // otwór pilotowy pod wkręcenie M3 w PLA
module trzpien_kardana(d = tk_d, dk = tk_kol_d) {   // czoło kołnierza (strona dna gniazda) na z = 0, trzpień w +z
  H = leb_h + tk_l;
  difference() {
    union() {
      hull() { translate([0, 0, 0.3]) cylinder(d = dk, h = leb_h - 0.3, $fn = 64); cylinder(d = dk - 0.6, h = leb_h, $fn = 64); }   // fazka 0,3 przy stole
      hull() { cylinder(d = d, h = H - 0.4, $fn = 48); cylinder(d = d - 0.8, h = H, $fn = 48); }                                // fazka 0,4 na czubku
    }
    translate([0, 0, -E]) cylinder(d = tk_m3_leb[0], h = tk_m3_leb[1] + E, $fn = 48);
    translate([0, 0, -E]) cylinder(d = tk_pilot, h = tk_m3_leb[1] + tk_m3_dl + E, $fn = 24);   // ślepy, do końca stali (z 12,1; czubek 12,45)
  }
}

// =================== POWIEKI ===================
module powieka(ri, ro, gora, ucho, zacz, ucho_inne, otw = os_otw, ucho_wew = 0) {
  s = gora ? 1 : -1;
  difference() {
    union() {
      difference() {
        intersection() {
          sfera_pow(ri, ro);
          translate([-ro, gora ? 0 : -ro, -pow_tyl]) cube([2 * ro, ro, ro + pow_tyl]);
          // boczne krawędzie powieki do wewnętrznej płaszczyzny ucha
          translate([-ucho[1], -50, -50]) cube([2 * ucho[1], 100, 100]);
        }
        // wycięcie krawędzi tylnej przy uszku drutu: drut wychodzi z otworu (z = zacz_pow_z) do tyłu po stronie uszka
        translate([zacz[0] - 5, -50, -pow_tyl - 1]) cube([10, 100, pow_tyl + 1 + zacz_pow_z + 1]);
      }
      for (m = [0, 1]) mirror([m, 0, 0]) hull() {         // ucho: krążek r 3 + podstawa do płaszczyzny z = −3
        walec_x(2 * ucho_r, ucho_wew > 0 ? ucho_wew : ucho[0], ucho[1]);
        pudlo(ucho_wew > 0 ? ucho_wew : ucho[0], ucho[1], -ucho_r, ucho_r, -pow_tyl, -pow_tyl + E);
      }
      // uszko drutu na tylnej krawędzi: płytka w płaszczyźnie YZ, otwór wzdłuż x na promieniu zacz[1]
      intersection() {
        translate([zacz[0] - zacz_pow_gr / 2, 0, 0]) rotate([0, 90, 0])
          linear_extrude(zacz_pow_gr) polygon([[0, s * (ri - 0.3)], [0, s * (zacz[1] + 1.6)], [-2 * zacz_pow_z - 0.2, s * (zacz[1] + 1.6)], [-2 * zacz_pow_z - 0.2, s * (ri - 0.3)]]);
        translate([-50, -50, -pow_tyl]) cube(100);
      }
    }
    for (m = [0, 1]) mirror([m, 0, 0]) walec_x(d_opis(otw, OTW_N), ucho[0] - 2, ucho[1] + 1, OTW_N);
    translate([zacz[0], s * sqrt(pow(zacz[1], 2) - pow(zacz_pow_z, 2)), zacz_pow_z]) rotate([0, 90, 0]) cylinder(d = zacz_otw, h = 10, center = true, $fn = 16);
    // miejsce na ucho drugiej powieki (górna: wycięcie przy osi w pasie ucha dolnej)
    if (len(ucho_inne) == 2) for (m = [0, 1]) mirror([m, 0, 0]) walec_x(2 * 4.6, ucho_inne[0] - 0.2, ucho_inne[1] + 0.2);
  }
}
module powieka_gorna() { powieka(pG_ri, pG_ro, true,  uchoG, zaczG, uchoD); }
module powieka_dolna() { powieka(pD_ri, pD_ro, false, uchoD, zaczD, [], os_wkret_otw, os_ucho_D_wew); }   // otwór pod gwint M2 (wkręt osi)

// =================== PŁYTA ===================
// gniazda: zwraca wycięcia w płycie
module gniazda() {
  // L–P: korpus pionowo na wylot, ucha na płycie; wałek 5,5 od przedniego końca korpusu
  pudlo(LP_wal[0] - sv_W / 2 - sv_luz, LP_wal[0] + sv_W / 2 + sv_luz, pl_y - pl_gr - 1, pl_y + 1,
        LP_wal[2] + sv_wal - sv_L - sv_luz, LP_wal[2] + sv_wal + sv_luz);
  // G–D: stoi na końcu korpusu, dolne ucho w szczelinie (płaszczyzna ucha x = −33 + 18)
  szczelina_ucha(-33 + sv_ucho_h, GD_wal[2]);
  // powieka górna: korpus x 15,5…38, ucho x 18…20; wnęka na wieżyczkę 1 mm
  szczelina_ucha(38 - sv_ucho_h - sv_ucho_gr, PG_wal[2]);
  pudlo(4, 16.5, pl_y - 1, pl_y + 1, PG_wal[2] - 6.5, PG_wal[2] + 6.5);
  // powieka dolna: korpus x −38…−15,5, ucho x −20…−18; wnęka na wieżyczkę; szczelina orczyka przez płytę
  szczelina_ucha(-38 + sv_ucho_h, PD_wal[2]);
  pudlo(-16.5, -4, pl_y - 1, pl_y + 1, PD_wal[2] - 6.5, PD_wal[2] + 6.5);
  pudlo(-9.5, 1.5, pl_y - pl_gr - 1, pl_y + 1, PD_wal[2] - 18.5, PD_wal[2] + 18.5);   // orczyk x −5…−3, przedłużenie −3…−0,5, „Z” drutu do −3,5
  // kabel G–D: wychodzi z krótszej ściany przeciwnej do wałka (stoi na płycie), nisko przy spodzie korpusu (x −33…−27)
  pudlo(-33.7, -25.5, pl_y - pl_gr - 1, pl_y + 1, GD_wal[2] - 4, GD_wal[2] + 4);
}
module szczelina_ucha(x0, zc) {
  pudlo(x0 - sv_luz, x0 + sv_ucho_gr + sv_luz, pl_y - pl_gr - 1, pl_y + 1, zc - sv_W / 2 - sv_luz, zc + sv_W / 2 + sv_luz);
}
module slupek(m) {   // słupek zawiasu z podporą; m = 1 prawy, 0 lewy (lustro)
  mirror([m == 1 ? 0 : 1, 0, 0]) difference() {
    union() {
      intersection() {   // ramię: x od 34,7 do łuku R37,2, y ±5, z od tyłu podpory do +4
        pudlo(sl_x0, sl_R, -sl_h / 2, sl_h / 2, pl_zP - pod_gr, sl_zP);
        translate([0, 0, pl_zP - pod_gr - 1]) cylinder(r = sl_R, h = 100, $fn = 360);
      }
      pudlo(pod_x0, sl_R, pl_y - pl_gr, sl_h / 2, pl_zP - pod_gr, pl_zP);   // podpora: od spodu płyty do słupka
      // nasada (decyzja użytkownika 26.10): żebro po wewnętrznej stronie ramienia, oparte na płycie, zwężające się skosem
      // do zera na ramieniu na z = sl_zebro (przekrój maleje w sposób ciągły); przed płytą spód y ≥ −12 (r ≤ 36,7)
      pudlo(sl_zebro_x, sl_x0 + E, pl_y - pl_gr, sl_h / 2, pl_zP - 1.5, pl_zP + E);   // nad płytą: pełna wysokość
      pudlo(sl_zebro_x, sl_x0 + E, -12, sl_h / 2, pl_zP, sl_zebro_z0);              // przed płytą do z −38
      intersection() {   // przed płytą w dół do spodu płyty, w promieniu r ≤ sl_zebro_r (światło tuby i kołnierz tuby 50 od r 38,15)
        pudlo(sl_zebro_x, sl_x0 + E, pl_y - pl_gr, sl_h / 2, pl_zP - E, sl_zebro_z0);
        translate([0, 0, pl_zP - 1]) cylinder(r = sl_zebro_r, h = 20, $fn = 360);
      }
      hull() {
        pudlo(sl_zebro_x, sl_x0 + E, -12, sl_h / 2, sl_zebro_z0 - E, sl_zebro_z0);
        pudlo(sl_x0 - 0.01, sl_x0 + E, -sl_h / 2, sl_h / 2, sl_zebro - E, sl_zebro);
      }
    }
    walec_x(d_opis(sl_otw, OTW_N), sl_x0 - 1, sl_R + 1, OTW_N);   // otwór osi powiek na z = 0 (światło Ø2,4)
  }
}
module slupek_kardana() {
  difference() {
    union() {
      translate([0, 0, kol_z0]) cylinder(d = kol_d, h = kol_zP - kol_z0);
      pudlo(-kol_klocek[0] / 2, kol_klocek[0] / 2, pl_y - pl_gr, 0, kol_z0, pl_zP + kol_klocek[1]);
      // nasada (decyzja użytkownika 26.10): skosy 45° na boki po płycie do x ±kol_skos_x i żebro pod słupkiem do z = kol_zebro
      hull() {
        pudlo(-kol_skos_x, kol_skos_x, pl_y - pl_gr, pl_y, kol_z0, pl_zP + kol_klocek[1]);
        pudlo(-kol_d / 2, kol_d / 2, pl_y - pl_gr, pl_y + kol_skos_x - kol_d / 2, kol_z0, pl_zP + kol_klocek[1]);
      }
      translate([-kol_zebro_gr / 2, 0, 0]) rotate([90, 0, 90]) linear_extrude(kol_zebro_gr)
        polygon([[pl_y - pl_gr, kol_z0], [pl_y - pl_gr, pl_zP + kol_klocek[1]], [-kol_d / 2 + 0.5, kol_zebro], [-kol_d / 2 + 0.5, kol_z0]]);   // punkty (y, z)
    }
    translate([0, 0, kol_zP - leb_h]) cylinder(d = leb_d, h = leb_h + E);   // gniazdo łba M5, wylot do przodu
  }
}
module plyta() {
  difference() {
    union() {
      pudlo(-pl_x, pl_x, pl_y - pl_gr, pl_y, pl_zT, pl_zP);
      slupek(1); slupek(0);
      slupek_kardana();
    }
    gniazda();
    // stopka do druku pod 45° (obrót wokół x, wierzch i przód do góry, tył na stole): ścięcie tylnej dolnej krawędzi,
    // przyprostokątne pl_stopka, płaski pas pl_stopka·√2 (decyzja użytkownika 26.10: płytę drukuje pod kątem; w pliku zostaje płasko);
    // płaszczyzna ścięcia y + z = c45 (układ druku niżej)
    translate([0, pl_y - pl_gr, pl_zT]) rotate([45, 0, 0]) cube([2 * pl_x + 2, pl_stopka * sqrt(2), pl_stopka * sqrt(2)], center = true);
  }
}

// =================== PRZEDŁUŻENIE ORCZYKA ===================
// Listwa na płaskiej (zewnętrznej) stronie ramienia orczyka jednoramiennego, z = 0 strona zewnętrzna (na stole), z = prz_gr powierzchnia ramienia.
// Ścianki rowka obejmują ramię z boków (obrót), pierścień piasty w otworze Ø7 i kołki ustalają położenie wzdłuż ramienia; CA dodatkowo.
module przedluzenie_orczyka() {
  w0 = prz_ram[0] + 2 * prz_row[0]; w1 = prz_ram[1] + 2 * prz_row[0]; xk = prz_ram[2] + prz_row[0];
  module obrys() { hull() { circle(d = prz_piasta + 3); translate([prz_L - prz_szer / 2, 0]) circle(d = prz_szer); } }
  difference() {
    union() {
      linear_extrude(prz_gr) obrys();
      translate([0, 0, prz_gr - E]) linear_extrude(prz_row[1] + E) difference() {
        intersection() { obrys(); translate([prz_piasta / 2 + 0.5, -10]) square([xk - w1 / 2 - prz_piasta / 2 - 0.5, 20]); }   // ścianki do początku zaokrąglenia końca ramienia: koniec otwarty
        hull() { translate([-1, -w0 / 2]) square([prz_piasta / 2 + 1, w0]); translate([xk - w1 / 2, 0]) circle(d = w1, $fn = 32); }
      }
    }
    translate([0, 0, -1]) cylinder(d = prz_piasta, h = prz_gr + prz_row[1] + 2);                    // pierścień piasty i łeb wkrętu orczyka
    translate([orcz_pow, 0, -1]) cylinder(d = zacz_otw, h = prz_gr + 2, $fn = 16);                 // drut powieki
    for (k = prz_kolki) translate([k, 0, -1]) cylinder(d = zacz_otw, h = prz_gr + 2, $fn = 16);    // kołki Ø1 przez otwory orczyka
  }
}

// =================== PODPORA PŁYTY DO DRUKU POD 45° ===================
// Układ druku: płyta obrócona o 45° wokół x (wierzch i przód do góry), stopka na stole z = 0.
// Punkt złożenia (y, z) → druk (Y', Z') = ((y − z)/√2, (y + z − c45)/√2), c45 = y + z płaszczyzny stopki.
c45 = (pl_y - pl_gr) + pl_zT + pl_stopka;
function PY(y, z) = (y - z) / sqrt(2);
function PZ(y, z) = (y + z - c45) / sqrt(2);
module plyta_druk45() { translate([0, 0, -c45 / sqrt(2)]) rotate([45, 0, 0]) plyta(); }
module podpora_plyty() {
  ys = pl_y - pl_gr;                       // spód płyty
  F0 = PZ(ys, 0) + PY(ys, 0);              // linia spodu płyty w druku: Z' = F0 − Y'
  Yf = PY(ys, pl_zP) + 0.5;                // przód: 0,5 za przednią krawędzią płyty
  k = sqrt(2);
  // płetwa równoległa do spodu, odstęp g, grubość t
  rotate([90, 0, 90]) translate([0, 0, -pod45_x]) linear_extrude(2 * pod45_x)
    polygon([[F0 - pod45_g * k, 0], [Yf, F0 - Yf - pod45_g * k], [Yf, F0 - Yf - (pod45_g + pod45_t) * k], [F0 - (pod45_g + pod45_t) * k, 0]]);
  // żebra pionowe (w druku) od stołu do płetwy
  for (x = pod45_zebra) translate([x - pod45_t / 2, 0, 0]) rotate([90, 0, 90]) linear_extrude(pod45_t)
    polygon([[F0 - (pod45_g + pod45_t) * k, 0], [Yf, F0 - Yf - (pod45_g + pod45_t) * k], [Yf, 0]]);
  // podstawa na stole (do przodu przeciw przewracaniu; z tyłu 1 mm luzu do płyty)
  translate([-pod45_x, pod45_przod, 0]) cube([2 * pod45_x, F0 - (pod45_g + pod45_t) * k - pod45_podst * 1.5 - pod45_przod, pod45_podst]);
  // ścianki pod spodami ramion (x = ±36) i słupka kardana (x = 0), od stołu do 0,8 pod spodem, łączniki co 6 mm
  k2 = sqrt(2);
  module scianka(x, gr, ysp, zr) {
    Ya = PY(ysp, zr[0]) - pod45_g / k2; Za = PZ(ysp, zr[0]) - pod45_g / k2;
    Yb = PY(ysp, zr[1]) - pod45_g / k2; Zb = PZ(ysp, zr[1]) - pod45_g / k2;
    translate([x - gr / 2, 0, 0]) rotate([90, 0, 90]) linear_extrude(gr) polygon([[Ya, 0], [Ya, Za], [Yb, Zb], [Yb, 0]]);
    if (pod45_lacza) for (z = [zr[0] + 1 : 6 : zr[1]])
      translate([x, PY(ysp, z) - (pod45_g + 0.3) / k2, PZ(ysp, z) - (pod45_g + 0.3) / k2]) rotate([-45, 0, 0])
        cylinder(h = pod45_g + 0.5, d1 = 1.6, d2 = pod45_karb, $fn = 16);
  }
  for (sx = [-1, 1]) scianka(sx * (sl_x0 + 0.7 + pod45_scianka / 2), pod45_scianka, -sl_h / 2, pod45_ram_z);   // 0,7 od żebra nasady, pod ramieniem
  scianka(0, 3, -kol_d / 2, pod45_kol_z);
  // skośne zastrzały 45° łączące ścianki (bez mostów): w Y' tam, gdzie wszystkie trzy ścianki się pokrywają
  Yb0 = PY(-kol_d / 2, pod45_kol_z[1]) - pod45_g / k2; Yb1 = PY(-kol_d / 2, pod45_kol_z[0]) - pod45_g / k2;
  xs = sl_x0 + 0.7 + pod45_scianka / 2;
  for (sx = [-1, 1], s = pod45_skosy) hull() {
    translate([sx * (s[1] == 0 ? xs : 0) - 0.8, (Yb0 + Yb1) / 2 - 0.8, s[0]]) cube([1.6, 1.6, 2.5]);
    translate([sx * (s[1] == 0 ? 0 : xs) - 0.8, (Yb0 + Yb1) / 2 - 0.8, s[0] + xs]) cube([1.6, 1.6, 2.5]);
  }
  // łączniki z karbem: od płetwy do spodu płyty (0,2 w płycie), wzdłuż normalnej spodu
  if (pod45_lacza) for (p = pod45_lacz) {
    Fy = PY(ys, p[1]); Fz = PZ(ys, p[1]);
    translate([p[0], Fy - (pod45_g + 0.3) / k, Fz - (pod45_g + 0.3) / k]) rotate([-45, 0, 0])
      cylinder(h = pod45_g + 0.5, d1 = 1.6, d2 = pod45_karb, $fn = 16);
  }
}

// =================== TUBA I MASKOWNICA ===================
module tuba(L) {     // w układzie złożenia: rant na z = rant_z, kołnierz za tylnym końcem (od środka dyni)
  translate([0, 0, rant_z - L - kol_gr]) difference() {
    union() {
      cylinder(d = tuba_D, h = L + kol_gr, $fn = 240);
      cylinder(d = kol_D, h = kol_gr, $fn = 240);
      for (a = lapa_kat) rotate([0, 0, a]) hull() {
        translate([tuba_D / 2 - 2, -lapa_szer / 2, 0]) cube([1, lapa_szer, kol_gr]);
        translate([lapa_r, 0, 0]) cylinder(d = lapa_szer, h = kol_gr);
      }
    }
    translate([0, 0, -1]) cylinder(d = tuba_d, h = L + kol_gr + 2, $fn = 240);
    for (a = lapa_kat) rotate([0, 0, a]) translate([lapa_r, 0, -1]) cylinder(d = lapa_otw, h = kol_gr + 2, $fn = 24);
    // szczeliny na łby wkrętów osi powiek: przez ściankę, od tylnego końca do osi (z = 0) + promień łba
    w = os_leb[0] + 2 * os_szczel_luz;
    for (m = [0, 1]) mirror([m, 0, 0]) {
      translate([tuba_d / 2 - 1, -w / 2, -1]) cube([os_szczel_x - tuba_d / 2 + 1, w, (L + kol_gr - rant_z) + w / 2 + 1]);
      translate([tuba_d / 2 - 1, 0, -E]) hull() { translate([0, -w / 2 - 1, 0]) cube([os_szczel_x - tuba_d / 2 + 1, w + 2, E]); translate([0, -w / 2, 1]) cube([os_szczel_x - tuba_d / 2 + 1, w, E]); }   // fazka wejścia 1 × 45°
    }
  }
}
module maskownica() { translate([0, 0, rant_z]) difference() { cylinder(d = mask_D, h = mask_gr, $fn = 240); translate([0, 0, -1]) cylinder(d = mask_d, h = mask_gr + 2, $fn = 240); } }

// =================== WYBÓR CZĘŚCI ===================
// orientacje do druku (płaska strona na z = 0)
module druk(c) {
  if (c == "Galka")               translate([0, 0, -z_kraw]) galka();                                       // krawędź na stole; podpora tylko pod piastą
  else if (c == "PowiekaGorna")   translate([0, 0, pow_tyl]) powieka_gorna();                               // krawędź tylna na stole
  else if (c == "PowiekaDolna")   translate([0, 0, pow_tyl]) powieka_dolna();
  else if (c == "Plyta")          rotate([90, 0, 0]) translate([0, -(pl_y - pl_gr), 0]) plyta();            // spód płyty na stole (y → z)
  else if (c == "PrzedluzenieOrczyka") przedluzenie_orczyka();                                        // drukować 2 sztuki
  else if (c == "TrzpienKardana") trzpien_kardana();                                                  // kołnierzem na stole; 2 sztuki + 2 zapasowe
  else if (c == "Tuba30")         translate([0, 0, -(rant_z - 30 - kol_gr)]) tuba(30);                     // kołnierz na stole
  else if (c == "Tuba40")         translate([0, 0, -(rant_z - 40 - kol_gr)]) tuba(40);
  else if (c == "Tuba50")         translate([0, 0, -(rant_z - 50 - kol_gr)]) tuba(50);
  else if (c == "Maskownica")     translate([0, 0, -rant_z]) maskownica();
  else if (c == "PlytaDruk45")    plyta_druk45();                                                         // płyta pod 45° (do pliku z podporą)
  else if (c == "PodporaPlyty")   podpora_plyty();                                                        // podpora w położeniu względem płyty pod 45°
}
module zlozenie_czesc(c) {
  if (c == "Galka") galka();
  else if (c == "PowiekaGorna") powieka_gorna();
  else if (c == "PowiekaDolna") powieka_dolna();
  else if (c == "Plyta") plyta();
  else if (c == "TrzpienKardana") {   // oba: w gnieździe piasty gałki (trzpień do tyłu) i słupka (do przodu)
    translate([0, 0, piasta_z + leb_h]) mirror([0, 0, 1]) trzpien_kardana();
    translate([0, 0, kol_zP - leb_h]) trzpien_kardana();
  }
  else if (c == "PrzedluzenieOrczyka") przedluzenie_orczyka();
  else if (c == "Tuba30") tuba(30);
  else if (c == "Tuba40") tuba(40);
  else if (c == "Tuba50") tuba(50);
  else if (c == "Maskownica") maskownica();
  else if (c == "PodporaPlyty") podpora_plyty();    // (w układzie druku – podpora nie należy do złożenia)
}

if (czesc == "parametry") {
  echo(str("PARAMETRY{\"R_kula\":", R_kula, ",\"z_kraw\":", z_kraw, ",\"zacz_r\":", zacz_r, ",\"zacz_z\":", zacz_z,
           ",\"LP_wal\":", LP_wal, ",\"GD_wal\":", GD_wal, ",\"PG_wal\":", PG_wal, ",\"PD_wal\":", PD_wal,
           ",\"orcz_LP\":", orcz_LP, ",\"orcz_GD\":", orcz_GD, ",\"orcz_pow\":", orcz_pow,
           ",\"pG_psi0\":", pG_psi0, ",\"pD_psi0\":", pD_psi0, ",\"zacz_pow_z\":", zacz_pow_z, ",\"pG_x_orcz\":", pG_x_orcz, ",\"pD_x_orcz\":", pD_x_orcz, ",\"drut_d\":", drut_d, ",\"zacz_ods\":", zacz_ods, ",\"orcz_ods\":", orcz_ods, ",\"drut_noga\":", drut_noga, ",\"drut_ogon\":", drut_ogon, ",\"drut_r_gi\":", drut_r_gi, ",\"pow_ods\":", pow_ods, ",\"zacz_gardz_d\":", zacz_gardz_d, ",\"zacz_gardz_l\":", zacz_gardz_l, ",\"zaczG\":", zaczG, ",\"zaczD\":", zaczD, ",\"otwarcie\":", otwarcie, ",\"rant_z\":", rant_z,
           ",\"pl_y\":", pl_y, ",\"pl_zP\":", pl_zP, ",\"kol_zP\":", kol_zP, ",\"piasta_z\":", piasta_z, "}"));
  cube(1);
} else if (czesc == "zlozenie") {
  color("white") galka();
  color("orange") { powieka_gorna(); powieka_dolna(); plyta(); }
  color("tan", 0.3) tuba(40);
  color("gray") maskownica();
} else if (tryb == "druk") druk(czesc);
else zlozenie_czesc(czesc);
