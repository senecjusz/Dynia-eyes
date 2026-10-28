# Obrazki krok po kroku do montaz-elektroniki.md z grup STL modelu elementy.scad (Blender 5.2, Workbench, bez GPU).
# Użycie: blender -b --factory-startup -P render.py -- <katalog z STL z eksport.sh> [krok ...]
#   np. blender -b --factory-startup -P render.py -- /tmp/praca/stl            (wszystkie kroki)
#       blender -b --factory-startup -P render.py -- /tmp/praca/stl krok04b-lewa-listwa   (wybrane, pełne nazwy plików bez .png)
# Wymaga: Blender 5.x, ImageMagick 7 (magick), czcionka Liberation Sans albo DejaVu Sans (strzałki, Ω).
# Podpisy i linie odniesienia nanosi ImageMagick (magick) po renderze; pozycje 3D rzutuje Blender.
# Układ jak w elementy.scad: x od lewego boku tacki, y od przodu, z od spodu tacki [mm].
import bpy, bmesh, os, sys, math, subprocess
from mathutils import Vector, Matrix
from bpy_extras.object_utils import world_to_camera_view

TU = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(TU, "img")
argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
if not argv:
    sys.exit("podaj katalog STL: blender -b -P render.py -- <katalog stl> [krok ...]")
STL, WYBOR = argv[0], set(argv[1:])
W, H = 1600, 1000
def czcionka(*pliki):  # pierwsza istniejąca; potrzebne znaki: ą–ż, →, ←, −, Ω
    for f in pliki:
        if os.path.exists(f):
            return f
    return "DejaVu-Sans"
FONT = czcionka("/usr/share/fonts/liberation/LiberationSans-Bold.ttf", "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf", "C:/Windows/Fonts/arialbd.ttf")
FONT_R = czcionka("/usr/share/fonts/liberation/LiberationSans-Regular.ttf", "/usr/share/fonts/TTF/DejaVuSans.ttf", "C:/Windows/Fonts/arial.ttf")

# ---------- wymiary z elementy.scad (do etykiet i kolorów żył) ----------
gp = 2.54
def chX(i): return 81.9 + (i + i // 4) * gp
rowY = [46.8, 46.8 + gp, 46.8 + 2 * gp]          # GND, V+, sygnał
def bokY(k): return 57.5 + (k - 2.5) * gp         # GND, OE, SCL, SDA, VCC, V+
bokXL, bokXP = 77.3, 134.7
dupTop = 9.0 + 2.5 + 14                           # 25,5
eRowX = [24.2 + 7.6, 24.2 - 7.6]   # [0] prawy, od PCA (GPIO5…21) | [1] lewy, od ściany (5V, G, 3V3, 4…0)
def eY(k): return 18.3 + k * gp
eDupBot = 25.4 - 2.5 - 14                         # 8,9
SUFIT = 40
gX, gY, gZ = 157.1, 48, 2.4 + 9 + 1
SK = [(50, 55, 0), (63, 75, 4), (76, 95, 12)]       # skrętki: x nad otworem, x uchwytu, n (jak sk w elementy.scad)
def skXg(s): return (chX(SK[s][2]) + chX(SK[s][2] + 3)) / 2
def skTr(s, t): return (SK[s][1] + t * (skXg(s) - SK[s][1]), 20 + t * 16, 5 + t * (dupTop + 1))
def skLut(s, k): return (skXg(s) + (k - 3.5) * 1.8, 26 if k % 2 else 33, 20 if s == 2 else 12)   # lut k: A brąz., A czerw., A pom., B pom., C brąz., C czerw., C pom., D pom.

# ---------- kolory ----------
def rgb(h): return tuple(int(h[i:i + 2], 16) / 255 for i in (1, 3, 5))
KOL = {
    "tacka": "#d9cdb4", "sufit": "#d9534f", "pca": "#1f8a3a", "pcaListwy": "#2b2b2b", "zacisk": "#1f6f8b",
    "podkladki": "#f28c1c", "esp": "#1d3fb8", "espPiny": "#3a3a3a", "espWtyki": "#151515",
    "gniazdo": "#c0c4c9", "wtykCC": "#9aa0a8", "zasilCzerw": "#d81e1e", "zasilCzarny": "#141414",
    "esp5V": "#d81e1e", "espG": "#141414", "espI2C": "#1e90ff", "espPCAwtyki": "#202020", "zapasESP": "#2bb3a0",
    "kondensator": "#7b3fb0", "kondWtyki": "#202020",
    "pirVCC": "#d81e1e", "pirGND": "#141414", "pirOUT": "#f2c200", "pirWtyki": "#202020",
    "przycisk": "#8b1a1a", "przyciskMasa": "#141414", "przyciskSyg": "#ff8c00", "przyciskWtyczka": "#202020",
    "skL": "#8e7fa6", "skP": "#7f7896", "skD": "#9b8fb0",
    "skWtyczki": "#202020", "skPrzewBraz": "#6b3a17", "skPrzewCzerw": "#d81e1e", "skPrzewPom": "#f06a00", "skKoszulki": "#5c5c5c",
    "rezystor": "#e2c99a",
}
# T568B: żyła 1..8 (grupy skZyla1 … skZyla8)
ZYLY = {1: "#f7c79a", 2: "#f07f12", 3: "#a8e0a0", 4: "#1f5fd1", 5: "#a9c4f0", 6: "#1f9a2f", 7: "#d2b48c", 8: "#7a4a1e"}
for _z, _k in ZYLY.items():
    KOL["skZyla%d" % _z] = _k
GRUPY = list(KOL)

def przygas(c):  # wcześniejsze elementy: jaśniej i szarzej
    g = 0.84
    return tuple(0.30 * x + 0.70 * g for x in c)

# ---------- scena ----------
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = "BLENDER_WORKBENCH"
sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = W, H, 100
sc.render.film_transparent = False
sc.render.image_settings.file_format = "PNG"
sc.view_settings.view_transform = "Standard"
sh = sc.display.shading
sh.light = "STUDIO"
sh.studio_light = "paint.sl"
sh.color_type = "MATERIAL"
sh.show_cavity = True
sh.cavity_type = "BOTH"
sh.show_shadows = True
sh.shadow_intensity = 0.25
sh.show_object_outline = True
sh.object_outline_color = (0.1, 0.1, 0.1)
sh.show_specular_highlight = False
sc.display.render_aa = "16"
sc.world = bpy.data.worlds.new("tlo")
sc.world.color = (1, 1, 1)

_mats = {}
def mat(c, a=1.0):
    k = (tuple(round(x, 3) for x in c), a)
    if k not in _mats:
        m = bpy.data.materials.new("m%d" % len(_mats))
        m.diffuse_color = (*c, a)
        _mats[k] = m
    return _mats[k]

obj = {}
for g in GRUPY:
    bpy.ops.wm.stl_import(filepath=os.path.join(STL, g + ".stl"))
    o = bpy.context.selected_objects[0]
    o.name = g
    obj[g] = o
    o.data.materials.append(mat(rgb(KOL[g])))

# kolory bazowe slotów (do przygaszania)
BAZA = {g: [tuple(m.diffuse_color)[:3] for m in obj[g].data.materials] for g in GRUPY}

def ustaw(nowe, stare, sufit=False, ukryj=()):
    for g in GRUPY:
        o = obj[g]
        widac = (g in nowe or g in stare or (g == "sufit" and sufit)) and g not in ukryj
        o.hide_render = not widac
        if not widac:
            continue
        for i, c in enumerate(BAZA[g]):
            if g == "sufit":
                o.data.materials[i] = mat(c, 0.5)
            else:
                o.data.materials[i] = mat(c if g in nowe else przygas(c))

cam_d = bpy.data.cameras.new("kam")
cam = bpy.data.objects.new("kam", cam_d)
sc.collection.objects.link(cam)
sc.camera = cam
ODL = 600.0

def kamera(cel, kier, skala, przekroj=None):
    """cel: punkt [mm]; kier: wektor od celu do kamery; skala: szerokość kadru [mm] (ortho);
    przekroj: odległość płaszczyzny cięcia od celu w stronę kamery (clip_start) – widok w przekroju."""
    k = Vector(kier).normalized()
    cam.location = Vector(cel) + k * ODL
    gora = Vector((0, 0, 1)) if abs(k.z) < 0.99 else Vector((0, 1, 0))   # pionowe krawędzie pionowo w kadrze
    prawo = (-k).cross(gora).normalized()
    cam.rotation_euler = Matrix((prawo, k.cross(prawo), k)).transposed().to_euler()
    cam_d.type = "ORTHO"
    cam_d.ortho_scale = skala
    cam_d.clip_start = ODL - przekroj if przekroj is not None else 1
    cam_d.clip_end = ODL + 400
    bpy.context.view_layer.update()

def px(p):
    v = world_to_camera_view(sc, cam, Vector(p))
    return (v.x * W, (1 - v.y) * H)

# ---------- podpisy (ImageMagick) ----------
def opisz(plik, tytul, etykiety, poziomy=(), znaczniki=(), legenda=True):
    """etykiety: (tekst, punkt 3D lub None, (x, y) środka etykiety w px, kolor linii);
    poziomy: (z, tekst, punkt odniesienia 3D (x, y), x0 px, x1 px) – linie wysokości w widoku z boku;
    znaczniki: (punkt 3D, promień px) – czerwony okrąg."""
    cmd = ["magick", plik, "-strokewidth", "3"]
    for z, tekst, (xr, yr), x0, x1 in poziomy:
        _, yy = px((xr, yr, z))
        cmd += ["-stroke", "#b00020", "-fill", "none", "-draw", "stroke-dasharray 14 8 line %d,%d %d,%d" % (x0, yy, x1, yy)]
    for p, r in znaczniki:
        x, y = px(p)
        cmd += ["-stroke", "#e00000", "-strokewidth", "6", "-fill", "none", "-draw", "circle %d,%d %d,%d" % (x, y, x + r, y)]
        cmd += ["-strokewidth", "3"]
    etykiety = [(t, p, (lx, px(p)[1] if ly is None else ly), kol) for t, p, (lx, ly), kol in etykiety]   # ly None: na wysokości punktu
    for tekst, p, (lx, ly), kol in etykiety:
        if p is None:
            continue
        x, y = px(p)
        cmd += ["-stroke", kol, "-fill", "none", "-draw", "line %d,%d %d,%d" % (lx, ly, x, y),
                "-stroke", "white", "-strokewidth", "1", "-fill", kol, "-draw", "circle %d,%d %d,%d" % (x, y, x + 6, y),
                "-strokewidth", "3"]
    cmd += ["-stroke", "none"]
    for tekst, p, (lx, ly), kol in etykiety:
        cmd += ["(", "-background", "#ffffffee", "-fill", "#111111", "-font", FONT, "-pointsize", "26",
                "label:" + tekst, "-bordercolor", "#ffffffee", "-border", "8x5", "-bordercolor", kol, "-border", "3", ")",
                "-gravity", "center", "-geometry", "%+d%+d" % (lx - W / 2, ly - H / 2), "-composite"]
    for z, tekst, (xr, yr), x0, x1 in poziomy:
        _, yy = px((xr, yr, z))
        cmd += ["(", "-background", "#ffffffee", "-fill", "#b00020", "-font", FONT, "-pointsize", "26",
                "label:" + tekst, "-bordercolor", "#ffffffee", "-border", "6x3", ")",
                "-gravity", "northwest", "-geometry", "+%d+%d" % (x1 + 10, yy - 20), "-composite"]
    cmd += ["(", "-background", "#ffffffee", "-fill", "#111111", "-font", FONT, "-pointsize", "34", "label:" + tytul,
            "-bordercolor", "#ffffffee", "-border", "12x6", ")", "-gravity", "northwest", "-geometry", "+16+14", "-composite"]
    if legenda:
        cmd += ["(", "-background", "#ffffffee", "-fill", "#555555", "-font", FONT_R, "-pointsize", "22",
            "label:pełny kolor: nowe w tym kroku · jasne: zamontowane wcześniej", "-bordercolor", "#ffffffee",
            "-border", "12x4", ")", "-gravity", "northwest", "-geometry", "+16+70", "-composite"]
    cmd += ["-dither", "None", "-colors", "256", "PNG8:" + plik]   # paleta 256 kolorów: ok. 5× mniejszy plik
    subprocess.run(cmd, check=True)

# ---------- kroki ----------
K1 = ["tacka", "pca", "pcaListwy", "zacisk"]
K2 = ["podkladki", "esp", "espPiny", "espWtyki", "przyciskWtyczka"]   # wtyczka przycisku na ESP przed klejeniem (tabela pinów, krok 2)
K3 = ["gniazdo", "wtykCC", "zasilCzerw", "zasilCzarny"]
K4 = ["esp5V", "espG", "espI2C", "espPCAwtyki", "zapasESP"]
K5 = ["kondensator", "kondWtyki"]
K6 = ["pirVCC", "pirGND", "pirOUT", "pirWtyki", "przycisk", "przyciskMasa", "przyciskSyg"]
K7 = ["skL", "skP", "skD", "skWtyczki", "skPrzewBraz", "skPrzewCzerw", "skPrzewPom", "skKoszulki"] + ["skZyla%d" % z for z in range(1, 9)]
WSZ = K1 + K2 + K3 + K4 + K5 + K6 + K7 + ["rezystor"]
ISO = (-0.75, -1.35, 1.25)
CZ, NI, ZI, ZO, PO, FI, SZ = "#d81e1e", "#1e78d8", "#1f8a3a", "#c89a00", "#f28c1c", "#7b3fb0", "#333333"

KROKI = []
def krok(nazwa, tytul, nowe, stare, cam, etykiety=(), sufit=False, poziomy=(), znaczniki=(), ukryj=(), legenda=True):
    KROKI.append(dict(nazwa=nazwa, tytul=tytul, nowe=nowe, stare=stare, cam=cam, et=etykiety, sufit=sufit, poz=poziomy,
                      zn=znaczniki, ukryj=ukryj, leg=legenda))

# piny ESP z opisem: rysunek schematyczny krok02a-esp-piny w schematy.py (widok z góry, USB do patrzącego)
dP = dupTop + 1.5                                                                      # punkt na przewodzie tuż nad wtykiem

krok("krok00-calosc", "Całość na tacce", WSZ, [], ((85, 50, 12), ISO, 205), [
    ("ESP32-C3 na podkładkach", (24, 27, 29.8), (190, 700), NI),
    ("PCA9685", (90, 60, 9), (560, 210), ZI),
    ("zacisk V+ / GND", (106, 66, 19), (900, 180), "#1f6f8b"),
    ("gniazdo USB-C", (157, 46, 16), (1480, 600), SZ),
    ("przycisk", (161, 83, 30.5), (1420, 200), "#8b1a1a"),
    ("przewód przycisku → wtyczka na ESP 5–6–7 (prawy rząd)", (70, 82.7, 14), (560, 90), "#ff8c00"),
    ("skrętki do oczu", (70, 6, 40), (520, 880), FI),
    ("kondensator", (107, 30, 33), (900, 880), FI),
    ("rezystor (zapas)", (32, 80, 16.4), (300, 150), PO),
], legenda=False)
krok("krok01-pca", "4.1  PCA9685 na słupkach", K1, [], ((106, 58, 8), ISO, 115), [
    ("listwa kanałów do przodu", (100, 51.9, 17.5), (420, 830), ZI),
    ("zacisk do tyłu", (106, 66, 19), (980, 170), "#1f6f8b"),
    ("4 wkręty M3 × 8", (76, 46, 9), (300, 560), SZ),
    ("lewa listwa (SDA, SCL, VCC…)", (bokXL, 58, 17.5), (330, 330), SZ),
    ("prawa listwa", (bokXP, 58, 17.5), (1300, 400), SZ),
])
krok("krok02-esp", "4.2  ESP: wtyki na pinach, podkładki, ESP na słupkach", K2, K1, ((28, 30, 18), (-0.6, -1.2, 1.0), 80), [
    ("podkładki 7 mm na słupkach (2 szt.)", (24.2, 16.5, 21.9), (1150, 420), PO),
    ("ESP: USB do przodu", (24.2, 15, 29.8), (330, 260), NI),
    ("8 wtyków nałożonych przed klejeniem", (eRowX[1] + 1.25, eY(0) - 1.25, 12), (430, 900), SZ),
    ("przycisk: wtyczka 3-pin na ESP 5–6–7 (środek pusty)", (eRowX[0] + 0.5, eY(1) - 3.8, 12), (1150, 920), "#ff8c00"),
])
krok("krok02b-esp-wysokosci", "4.2  Wysokości przy ESP (widok od przodu, przekrój)", K2, K1 + ["tacka"], ((45, 30, 20), (0, -1, 0), 110, 15), [],
     sufit=True, poziomy=[
         (0, "spód tacki 0", (10, 20), 40, 650),
         (eDupBot, "spód wtyków pod ESP 8,9", (10, 20), 40, 650),
         (25.4, "spód ESP 25,4", (10, 20), 40, 650),
         (SUFIT, "sufit (spód płyty) 40", (10, 20), 40, 650),
     ])
krok("krok03-zasilanie", "4.3  Zasilanie: gniazdo USB-C do zacisku", K3, K1 + K2, ((128, 62, 10), (0, -0.5, 1.4), 115), [
    ("gniazdo USB-C (nakrętka od tyłu)", (157, 52, 21), (800, 560), SZ),
    ("przez uchwyt opaski", (140, 88, 6), (860, 300), SZ),
    ("wtyk kabla od powerbanku", (157, 25, 15.9), (1250, 880), SZ),
    ("czerwony → zacisk V+", (108.6, 72, 14), (520, 160), CZ),
    ("czarny → zacisk GND", (103.5, 72, 14), (330, 320), SZ),
])
krok("krok04-esp-pca", "4.4  ESP do PCA", K4, K1 + K2 + K3, ((70, 42, 12), ISO, 135), [
    ("kanał 9: 5V / G z ESP", (chX(9), 48, 25.5), (1330, 430), CZ),
    ("lewa listwa: SDA, SCL, VCC", (bokXL, bokY(3), 25.5), (620, 150), NI),
    ("zapas: ESP 4 i 3 (lewy rząd)", (11.5, 25, 5), (200, 700), "#888888"),
])
krok("krok04b-lewa-listwa", "4.4  Zbliżenie: lewa listwa PCA (widok od lewej)", K4, K1 + K2 + K3, ((bokXL, 57.5, 21), (-1.0, -0.3, 0.9), 42), [
    ("VCC ← ESP 3V3", (bokXL, bokY(4), dP), (560, 170), NI),
    ("SDA ← ESP 8", (bokXL, bokY(3), dP), (900, 170), NI),
    ("SCL ← ESP 9", (bokXL, bokY(2), dP), (1250, 250), NI),
    ("OE: wolny", (bokXL, bokY(1), 17.5), (1250, 560), "#888888"),
    ("GND: wolny", (bokXL, bokY(0), 17.5), (1250, 720), "#888888"),
    ("V+: wolny", (bokXL, bokY(5), 17.5), (330, 480), "#888888"),
])
krok("krok04c-kanal9", "4.4  Zbliżenie: kanał 9 (zasilanie ESP)", K4, K1 + K2 + K3, ((chX(9), 48, 21), (1.0, -0.6, 0.8), 40), [
    ("kanał 9 V+ ← ESP 5V (czerwony)", (chX(9), rowY[1], dP), (1150, 200), CZ),
    ("kanał 9 GND ← ESP G (czarny)", (chX(9), rowY[0], dupTop - 3), (1150, 850), SZ),
])
krok("krok05-kondensator", "4.5  Kondensator na kanale 8 (leży poziomo do przodu)", K5, K1 + K2 + K3 + K4, ((105, 42, 22), (-0.6, -1.0, 1.1), 62), [
    ("pasek (−) na GND kanału 8 (przy krawędzi)", (chX(8), rowY[0], dupTop), (420, 200), SZ),
    ("„+” na V+ kanału 8", (chX(8), rowY[1], dupTop), (1220, 230), CZ),
    ("korpus poziomo do przodu", (107.3, 32, 29.5), (400, 820), FI),
])
krok("krok06-pir-przycisk", "4.6  PIR i przycisk", K6, K1 + K2 + K3 + K4 + K5, ((90, 50, 12), ISO, 190), [
    ("PIR (od szufladki): VCC, GND, OUT", (150, 10, 5), (1300, 860), ZO),
    ("PIR OUT → ESP pin 10", (60, 29.5, 5), (330, 860), ZO),
    ("przewód przycisku → wtyczka na ESP 5–6–7 (prawy rząd)", (70, 82.7, 14), (560, 200), "#ff8c00"),
    ("PIR VCC / GND → kanał 10", (125, 30, 5), (900, 880), CZ),
])
krok("krok06b-kanal10-przycisk", "4.6  Zbliżenie – kanał 10: PIR VCC / GND", K6, K1 + K2 + K3 + K4 + K5, ((118, 52, 22), (0.2, -1.0, 1.5), 55), [
    ("kanał 10 V+ ← PIR VCC (czerwony)", (chX(10), rowY[1], dP), (480, 840), CZ),
    ("kanał 10 GND ← PIR GND (czarny)", (chX(10), rowY[0], dupTop - 2), (1000, 900), SZ),
    ("kanał 8: kondensator", (chX(8) - 1, 40.5, dupTop + 4), (330, 300), FI),
    ("kanał 9: ESP", (chX(9), rowY[1], dP + 1.5), (380, 500), CZ),
])
krok("krok07-skretki", "4.7  Skrętki do oczu (po jednej, z testem)", K7, K1 + K2 + K3 + K4 + K5 + K6, ((90, 35, 18), ISO, 150), [
    ("lewa: kanały 0–3", (55, 9, 12), (330, 850), FI),
    ("prawa: kanały 4–7", (75, 9, 12), (760, 900), FI),
    ("duże oko: kanały 12–15", (95, 9, 12), (1200, 870), FI),
    ("do otworu w płycie", (63, 6, 40), (450, 200), FI),
    ("4 wtyczki serw A–D na skrętkę", (chX(13), rowY[1] - 3.8, dupTop - 4), (1250, 330), SZ),
    ("8 lutów w koszulce na skrętkę", skLut(1, 6), (260, 560), SZ),
])
krok("krok07b-skretki-listwa", "4.7  Zbliżenie: wtyczki skrętek na listwie kanałów", K7, K1 + K2 + K3 + K4 + K5 + K6, ((103, 47, 25), (0.1, -1.0, 0.9), 62), [
    ("lewa: 0–3", (chX(1), rowY[2], dupTop + 1), (330, 200), FI),
    ("prawa: 4–7", (chX(5), rowY[2], dupTop + 1), (760, 200), FI),
    ("duże oko: 12–15", (chX(13), rowY[2], dupTop + 1), (1300, 200), FI),
    ("kanał 0 (sprawdź na płytce)", (chX(0), rowY[2], dupTop + 1), (260, 880), SZ),
    ("kanały 8–10: kond., ESP, PIR", (chX(9), rowY[1], dP + 2), (1100, 900), SZ),
    ("11: wolny", (chX(11), rowY[2], 17.5), (1480, 520), "#888888"),
    ("brązowy od krawędzi (GND)", (chX(4) - 1.5, 40, 20), (700, 900), "#6b3a17"),
])
krok("krok07c-zyly-kanaly0-3", "4.7  Wtyczki lewej skrętki na kanałach 0–3", K7, K1 + K2 + K3 + K4 + K5 + K6, ((chX(1) + 1.27, 46, 26), (-0.6, -1.0, 0.65), 40), [
    ("wtyczka A (kanał 0): żyły 5 / 4 / 1", (chX(0), rowY[1] - 3.8, 19), (300, 640), SZ),
    ("B (kanał 1): tylko żyła 2", (chX(1), rowY[2], dupTop + 3.6), (380, 110), "#f06a00"),
    ("C (kanał 2): 8 / 7 / 3", (chX(2), rowY[1], dupTop + 3.2), (1000, 110), SZ),
    ("D (kanał 3): tylko żyła 6", (chX(3), rowY[2], dupTop + 3.6), (1350, 200), "#f06a00"),
    ("brązowy od krawędzi (GND)", (chX(0), rowY[0], dupTop + 1), (280, 470), "#6b3a17"),
    ("B, D: brązowy i czerwony obcięte, zaizolowane", (chX(3), rowY[0], dupTop + 2.8), (1180, 470), "#5c5c5c"),
    ("brązowy GND · czerwony V+ · pomarańczowy sygnał", None, (800, 950), "#f06a00"),
], legenda=False)
krok("krok08-wysokosci", "Wysokości całości (widok od przodu, przekrój)", WSZ, [], ((118.75, 40, 20), (0, -1, 0), 250, 28), [],
     sufit=True, poziomy=[
         (0, "spód tacki 0", (5, 20), 40, 1140),
         (eDupBot, "spód wtyków ESP 8,9", (5, 20), 40, 1140),
         (25.4, "spód ESP 25,4 · wtyki PCA 25,5", (5, 20), 40, 1140),
         (SUFIT, "sufit 40", (5, 20), 40, 1140),
     ], legenda=False)
krok("krok09-rezystor", "Rezystor (zapas): przekrój poziomy na wysokości nóżek (z = 13,4)", ["rezystor"], K1 + K2,
     ((33, 90, 13.4), (0, 0, 1), 52, 0.05), [
         ("tylna nóżka wchodzi w tylny pas – sposób montażu do ustalenia", (32, 97, 13.4), (1050, 420), "#e00000"),
         ("tylny pas tacki (y 97–100)", (45, 98.5, 13.4), (1250, 160), SZ),
         ("koniec nóżki 1 mm za tacką", (32, 100.8, 13.4), (420, 160), "#e00000"),
         ("tylny słupek ze szczeliną", (33.5, 91.5, 13.4), (330, 420), SZ),
         ("rezystor 47 Ω / 3 W", (32, 82, 13.4), (400, 860), PO),
     ], znaczniki=[((32, 97, 13.4), 50)])
krok("krok09b-rezystor-z-tylu", "Rezystor (zapas): koniec nóżki od zewnątrz tylnej ścianki", ["rezystor"], K1 + K2,
     ((32, 98, 14), (0.5, 1.0, 0.5), 55), [
         ("koniec tylnej nóżki", (32, 101, 13.4), (1100, 800), "#e00000"),
     ], znaczniki=[((32, 100.5, 13.4), 45)])

os.makedirs(IMG, exist_ok=True)
for k in KROKI:
    if WYBOR and k["nazwa"] not in WYBOR:
        continue
    ustaw(set(k["nowe"]), set(k["stare"]) - set(k["nowe"]), k["sufit"], set(k["ukryj"]))
    kamera(*k["cam"])
    plik = os.path.join(IMG, k["nazwa"] + ".png")
    sc.render.filepath = plik
    bpy.ops.render.render(write_still=True)
    opisz(plik, k["tytul"], k["et"], k["poz"], k["zn"], k["leg"])
    print("ZAPISANO", plik)
