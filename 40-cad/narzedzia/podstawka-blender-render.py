# Podstawka pod dynię: poglądowe rendery koncepcji (krok 1, bez CAD).
# Użycie: blender -b -P podstawka-blender-render.py -- <katalog wyjściowy>
# Jednostka: 1 = 1 mm. Układ: x w prawo, y do tyłu (przód dyni = -y), z w górę; środek dyni nad (0, 0).
# Wymiary jak w 20-analizy/2026-10-25-podstawka-koncepcja.md; dynia: obwód 100 cm (Ø318), 10 kg.
# v5 (25.10): bez dna; szufladka tylko z powerbankiem w poprzek, do przodu, PIR w czole; elektronika na stale z tylu; tuleja z gwintem w srodku dna dyni.
import bpy, sys, os, math, subprocess, shutil
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

OUT = sys.argv[sys.argv.index('--') + 1]
os.makedirs(os.path.join(OUT, 'surowe'), exist_ok=True)

# --- zmienne ---
D = 318.0            # średnica dyni (obwód 1000 / pi)
H2 = 115.0           # połowa wysokości bryły dyni przed spłaszczeniem dna
T_DNO, T_BOK = 40.0, 30.0
SZ, DL = 236.0, 240.0  # szerokość (x) i głębokość (y) podstawki
SX, SY = 118.0, 120.0  # środek dyni w układzie podstawki
H_IN, T_PL = 40.0, 18.0
Z_PL = H_IN + T_PL   # wierzch płyty górnej
TUL_R, TUL_RW, NAK_R = 38.0, 32.0, 65.0  # tuleja: promień gwintu, promień wewnętrzny; nakrętka
WYSUW = 95.0         # wysuniecie szufladki w widoku wymiany

for o in list(bpy.data.objects): bpy.data.objects.remove(o, do_unlink=True)

def mat(nazwa, kol, alfa=1.0, rough=0.6):
    m = bpy.data.materials.new(nazwa); m.use_nodes = True
    p = m.node_tree.nodes['Principled BSDF']
    p.inputs['Base Color'].default_value = (*kol, 1)
    p.inputs['Roughness'].default_value = rough
    if alfa < 1:
        p.inputs['Alpha'].default_value = alfa
        if hasattr(m, 'surface_render_method'): m.surface_render_method = 'BLENDED'
        if hasattr(m, 'blend_method'): m.blend_method = 'BLEND'
    return m

M = {
 'sklejka': mat('sklejka', (0.80, 0.62, 0.38)), 'sklejka_szklo': mat('sklejka_szklo', (0.80, 0.62, 0.38), 0.18),
 'szuflada': mat('szuflada', (0.35, 0.75, 0.40)), 'druk': mat('druk', (0.95, 0.45, 0.08)),
 'pb': mat('pb', (0.12, 0.14, 0.18), rough=0.3), 'czarny': mat('czarny', (0.03, 0.03, 0.03)),
 'pca': mat('pca', (0.05, 0.35, 0.10)), 'esp': mat('esp', (0.08, 0.15, 0.45)),
 'kabel': mat('kabel', (0.15, 0.35, 0.85)), 'usb': mat('usb', (0.85, 0.10, 0.10)),
 'dynia': mat('dynia', (0.95, 0.42, 0.05), rough=0.5), 'dynia_szklo': mat('dynia_szklo', (0.95, 0.45, 0.08), 0.15),
 'bialy': mat('bialy', (0.95, 0.95, 0.95), rough=0.3), 'ogonek': mat('ogonek', (0.35, 0.40, 0.15)),
 'wtyk': mat('wtyk', (0.85, 0.88, 0.9), 0.7, 0.2),
}

def link(o, m):
    o.data.materials.clear(); o.data.materials.append(m); return o

def xb(x): return x - SX
def yb(y): return y - SY

def box(nazwa, x0, x1, y0, y1, z0, z1, m, baza=True):
    """Prostopadłościan; przy baza=True x, y w układzie podstawki (od lewego przedniego narożnika)."""
    if baza: x0, x1, y0, y1 = xb(x0), xb(x1), yb(y0), yb(y1)
    bpy.ops.mesh.primitive_cube_add(size=1, location=((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2))
    o = bpy.context.object; o.name = nazwa; o.scale = (x1 - x0, y1 - y0, z1 - z0)
    bpy.ops.object.transform_apply(scale=True)
    return link(o, m)

def cyl(nazwa, x, y, z0, z1, r, m, seg=64):
    bpy.ops.mesh.primitive_cylinder_add(vertices=seg, radius=r, depth=z1 - z0, location=(x, y, (z0 + z1) / 2))
    o = bpy.context.object; o.name = nazwa
    return link(o, m)

def odejmij(o, narzedzie, usun=True):
    md = o.modifiers.new('bool', 'BOOLEAN'); md.operation = 'DIFFERENCE'; md.object = narzedzie; md.solver = 'EXACT'
    bpy.context.view_layer.objects.active = o; bpy.ops.object.modifier_apply(modifier=md.name)
    if usun: bpy.data.objects.remove(narzedzie, do_unlink=True)

def krzywa(nazwa, pkty, r, m):
    cu = bpy.data.curves.new(nazwa, 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = r; cu.bevel_resolution = 3
    sp = cu.splines.new('BEZIER'); sp.bezier_points.add(len(pkty) - 1)
    for bp, p in zip(sp.bezier_points, pkty):
        bp.co = Vector(p); bp.handle_left_type = bp.handle_right_type = 'AUTO'
    o = bpy.data.objects.new(nazwa, cu); bpy.context.collection.objects.link(o)
    cu.materials.append(m); return o

def kula(nazwa, p, r, m):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=48, ring_count=24, radius=r, location=p)
    o = bpy.context.object; o.name = nazwa; bpy.ops.object.shade_smooth(); return link(o, m)

# ---------------- dynia ----------------
def dynia_mesh(nazwa, R, H, z_srodek, z_obciecie):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=120, ring_count=60, radius=1)
    o = bpy.context.object; o.name = nazwa
    for v in o.data.vertices:
        x, y, z = v.co; phi = math.atan2(y, x); rxy = math.hypot(x, y)
        f = 0.955 + 0.045 * abs(math.cos(5 * phi)) ** 0.6       # 10 żeber
        zz = z * H - 18 * math.exp(-(rxy ** 2) / 0.04) * (1 if z > 0 else 0)  # wgłębienie przy ogonku
        zz = max(zz + z_srodek, z_obciecie)
        v.co = (x * R * f, y * R * f, zz)
    bpy.ops.object.shade_smooth()
    return o

zc = Z_PL + 0.82 * H2
zew = dynia_mesh('Dynia', D / 2, H2, zc, Z_PL)
wew = dynia_mesh('wnetrze', D / 2 - T_BOK, H2 - T_BOK, zc, Z_PL + T_DNO)
odejmij(zew, wew)
odejmij(zew, cyl('otw_dynia', 0, 0, Z_PL - 10, Z_PL + T_DNO + 10, 40, M['czarny']))
link(zew, M['dynia'])
cyl('Ogonek', 0, 0, zc + H2 - 25, zc + H2 + 25, 9, M['ogonek'], 12)
for i, (az, z, r) in enumerate([(0, zc + 10, 30), (-45, zc + 35, 20), (45, zc + 35, 20), (-62, zc - 25, 20), (62, zc - 25, 20)]):
    a = math.radians(az - 90)
    kula(f'Oko{i}', (math.cos(a) * (D / 2 - r * 0.7), math.sin(a) * (D / 2 - r * 0.7), z), r, M['bialy'])

# ---------------- podstawka (sklejka, bez dna; z przodu cała szerokość to szufladka) ----------------
box('Scianka L', 0, 18, 0, DL, 0, H_IN, M['sklejka'])
box('Scianka P', SZ - 18, SZ, 0, DL, 0, H_IN, M['sklejka'])
box('Kaseta tyl', 4, SZ - 4, DL, DL + 4, 0, H_IN, M['druk'])  # uszy zachodzą na tylne czoła ścianek bocznych
plyta = box('Plyta gorna', 0, SZ, 0, DL, H_IN, Z_PL, M['sklejka'])
odejmij(plyta, cyl('otw_plyta', 0, 0, H_IN - 5, Z_PL + 5, TUL_RW, M['czarny']))

# ---------------- tuleja z gwintem i nakrętka (druk) ----------------
z_dno_wew = Z_PL + T_DNO
tul = cyl('Tuleja', 0, 0, Z_PL, z_dno_wew + 10, TUL_R, M['druk'])
odejmij(tul, cyl('t_otw', 0, 0, Z_PL - 1, z_dno_wew + 30, TUL_RW, M['czarny']))
kol = cyl('Tuleja kolnierz', 0, 0, Z_PL, Z_PL + 3, 60, M['druk'])
odejmij(kol, cyl('k_otw', 0, 0, Z_PL - 1, Z_PL + 4, TUL_RW, M['czarny']))
for i in range(36):  # zarys gwintu (tylko wygląd)
    zz = Z_PL + T_DNO - 20 + i * 1.2
    if zz < z_dno_wew + 9:
        bpy.ops.mesh.primitive_torus_add(major_radius=TUL_R, minor_radius=0.8, location=(0, 0, zz))
        link(bpy.context.object, M['druk']).name = f'gwint{i}'
nak = cyl('Nakretka', 0, 0, z_dno_wew, z_dno_wew + 8, NAK_R, M['druk'], 6)
odejmij(nak, cyl('n_otw', 0, 0, z_dno_wew - 1, z_dno_wew + 11, TUL_R, M['czarny']))


# ---------------- szufladka (druk): powerbank w poprzek + PIR w czole ----------------
TX0, TX1, TGL = 20.0, 216.0, 100.0   # szufladka 196 × 100 (X1C albo 2 części sklejone CA); wtyk USB-C w środku

def szufladka(dy):
    s, zt, y0, y1 = 2.4, 30.0, dy, TGL + dy
    cz = [box('Szufladka dno', TX0, TX1, y0, y1, 0, 2, M['szuflada']),
          box('Szufladka bok L', TX0, TX0 + s, y0, y1, 0, zt, M['szuflada']),
          box('Szufladka bok P', TX1 - s, TX1, y0, y1, 0, zt, M['szuflada']),
          box('Szufladka tyl', TX0, TX1, y1 - s, y1, 0, zt, M['szuflada']),
          box('Szufladka przegroda PIR', TX0, TX1, y0 + 25, y0 + 27, 0, zt, M['szuflada']),
          box('Szufladka czolo', TX0 - 5, TX1 + 5, y0 - 3, y0, 0, H_IN - 1, M['szuflada']),
          box('Szufladka uchwyt', 120, 170, y0 - 11, y0 - 3, 26, 34, M['szuflada']),
          box('Powerbank', 22.5, 182.5, y0 + 27.5, y0 + 97.5, 2, 34, M['pb']),
          box('Wtyk USB-C', 182.5, 207, y0 + 56, y0 + 68, 12, 22, M['czarny'])]
    cz.append(kula('Kopulka PIR', (xb(60), yb(y0 - 3), 20), 11.5, M['bialy']))
    cz.append(box('Plytka PIR', 44, 76, y0 + 1, y0 + 3, 8, 32, M['pca']))
    usb = krzywa('USB-C', [(xb(207), yb(y0 + 62), 17), (xb(210), yb(y1 - 4), 31), (xb(185), yb(y1 + 25 - dy * 0.4), 6),
                           (xb(175), yb(165), 6), (xb(165), yb(178), 8)], 1.8, M['usb'])
    pir = krzywa('PIR przewod', [(xb(60), yb(y0 + 2), 30), (xb(70), yb(y1 + 8), 33), (xb(110), yb(y1 + 30 - dy * 0.4), 4),
                                 (xb(150), yb(185), 6)], 1.0, M['czarny'])
    return cz + [usb, pir]

# ---------------- elektronika na stałe (druk: płytka nośna) ----------------
box('Kaseta dno', 19, SZ - 19, 106, DL, 0, 3, M['druk'])
box('PCA9685', 160, 185, 115, 177, 8, 9.6, M['pca'])
box('PCA listwy', 160, 168, 117, 175, 9.6, 26, M['czarny'])
box('ESP32-C3', 190, 212, 190, 208, 8, 12, M['esp'])
cyl('Kondensator', xb(200), yb(225), 3, 23, 5, M['czarny'], 24)

def skretki():  # skrętka z kasety (żyły na listwach PCA9685) przez tuleję do łącznika RJ45 w dyni
    cele = [(-60, -85, zc + 15), (0, -95, zc - 25), (60, -85, zc + 15)]
    for i, (xa, cel) in enumerate(zip((162, 164, 166), cele)):
        xt = -12 + 12 * i
        zl = z_dno_wew + 45; box(f'Lacznik RJ45 {i}', xt - 8, xt + 8, 12, 32, zl, zl + 38, M['czarny'], baza=False)
        krzywa(f'Skretka rozdz {i}', [(xt, 22, zl + 38), (xt, 22, zl + 60), (cel[0] * 0.6, cel[1] / 2, cel[2] - 40), cel], 2.6, M['kabel'])
        pk = [(xt, 22, zl), (xt, 20, Z_PL),
              (xt * 0.8, 22, 32), (xb(xa) - 10, yb(150), 20), (xb(xa), yb(146), 26)]
        krzywa(f'Skretka {i}', pk, 2.6, M['kabel'])
        box(f'Rozdzielacz {i}', cel[0] - 15, cel[0] + 15, cel[1] - 2, cel[1] + 2, cel[2] - 20, cel[2] + 20, M['pca'], baza=False)
skretki()

# ---------------- render ----------------
sc = bpy.context.scene
ids = [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties['engine'].enum_items]
sc.render.engine = 'BLENDER_EEVEE' if 'BLENDER_EEVEE' in ids else 'BLENDER_EEVEE_NEXT'
sc.render.resolution_x, sc.render.resolution_y = 1600, 1200
sc.world = bpy.data.worlds.new('W'); sc.world.use_nodes = True
sc.world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.92, 0.92, 0.94, 1)
sc.world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.35
sc.view_settings.view_transform = 'Standard'
bpy.ops.object.light_add(type='SUN', rotation=(math.radians(40), math.radians(15), math.radians(-30)))
bpy.context.object.data.energy = 2.2
bpy.ops.object.light_add(type='SUN', rotation=(math.radians(60), math.radians(-20), math.radians(150)))
bpy.context.object.data.energy = 0.6
box('Stol', -500, 500, -500, 500, -10, 0, mat('stol', (0.75, 0.75, 0.73)), baza=False)

bpy.ops.object.camera_add(); cam = bpy.context.object; sc.camera = cam
cam.data.clip_start, cam.data.clip_end = 1, 10000
tgt = bpy.data.objects.new('cel', None); bpy.context.collection.objects.link(tgt)
c = cam.constraints.new('TRACK_TO'); c.target = tgt; c.track_axis = 'TRACK_NEGATIVE_Z'; c.up_axis = 'UP_Y'

FONT = r"C\:/Windows/Fonts/arial.ttf"
def esc(t):
    for a, b in ((':', r'\:'), ("'", '’'), (',', r'\,'), ('%', r'\%')): t = t.replace(a, b)
    return t

def render(nazwa, loc, cel, lens=40, orto=None, opisy=()):
    """Render + podpisy nakładane ffmpeg-iem: kropka na elemencie, opis w ramce obok (strona 'p' lub 'l', przesunięcie dy w px)."""
    cam.location = loc; tgt.location = cel
    if orto: cam.data.type = 'ORTHO'; cam.data.ortho_scale = orto
    else: cam.data.type = 'PERSP'; cam.data.lens = lens
    bpy.context.view_layer.update()
    surowy = os.path.join(OUT, 'surowe', nazwa)
    sc.render.filepath = surowy
    bpy.ops.render.render(write_still=True)
    RW, RH = sc.render.resolution_x, sc.render.resolution_y
    f = []
    for op in opisy:
        t, p = op[0], op[1]; strona = op[2] if len(op) > 2 else 'p'; dy = op[3] if len(op) > 3 else -30
        v = world_to_camera_view(sc, cam, Vector(p)); X, Y = int(v.x * RW), int((1 - v.y) * RH)
        f.append(f"drawbox=x={X-8}:y={Y-8}:w=16:h=16:color=white:t=fill")
        f.append(f"drawbox=x={X-5}:y={Y-5}:w=10:h=10:color=0xd01010:t=fill")
        tx = f"{X+16}" if strona == 'p' else f"{X-16}-text_w"
        f.append(f"drawtext=fontfile='{FONT}':text='{esc(t)}':fontsize=32:fontcolor=black:box=1:boxcolor=white@0.85:boxborderw=8:x={tx}:y={Y+dy}")
    subprocess.run([shutil.which('ffmpeg'), '-y', '-loglevel', 'error', '-i', surowy, '-vf', ','.join(f) if f else 'null',
                    os.path.join(OUT, nazwa)], check=True)

def usun(lista):
    for o in lista: bpy.data.objects.remove(o, do_unlink=True)

def ustaw_dynie(m_dynia, m_plyta):
    link(bpy.data.objects['Dynia'], m_dynia); link(bpy.data.objects['Plyta gorna'], m_plyta)


# 1. Wymiana powerbanku: szufladka wysunięta do przodu
cz = szufladka(-WYSUW)
render('1-wymiana-powerbanku.png', (380, -560, 330), (10, -110, 30), 36, opisy=[
    ('szufladka wysunięta do przodu (ok. 9 cm)', (xb(TX1), yb(-WYSUW + 45), 30), 'p', -10),
    ('powerbank w poprzek: wyjąć, włożyć nowy', (xb(100), yb(-WYSUW + 50), 34), 'l', -110),
    ('USB-C: wypiąć, wpiąć w szufladce', (xb(195), yb(-WYSUW + 52), 22), 'p', 40),
    ('PIR w czole szufladki', (xb(60), yb(-WYSUW - 3), 20), 'l', 30),
    ('podstawka 236 × 220 × 58, bez dna', (xb(SZ), yb(150), 30), 'p', -60),
    ('dynia Ø318, 10 kg', (110, -60, 200), 'p', -20)])

# 2. Prześwietlenie, szufladka zamknięta
usun(cz); cz = szufladka(0)
ustaw_dynie(M['dynia_szklo'], M['sklejka_szklo'])
render('2-przeswietlenie.png', (-400, -480, 420), (0, 0, 60), 36, opisy=[
    ('3 łączniki RJ45 w dyni (nad tuleją)', (12, 22, z_dno_wew + 64), 'l', -20),
    ('kaseta elektroniki (od tyłu)', (xb(120), yb(200), 3), 'l', 30),
    ('PCA9685 + ESP32-C3 (na stałe)', (xb(172), yb(150), 20), 'p', 10),
    ('powerbank w szufladce', (xb(100), yb(50), 34), 'l', 20),
    ('tuleja z gwintem: 10 mm nad dnem wnętrza', (0, 0, z_dno_wew + 10), 'p', -50),
    ('nakrętka od środka dyni', (-NAK_R, 0, z_dno_wew + 10), 'l', -30),
    ('rozdzielacz serw (3 szt.)', (60, -85, zc + 15), 'p', -20),
    ('PIR', (xb(60), yb(-3), 20), 'l', 10)])

# 3. Przekrój przez środek dyni, widok z prawej
ustaw_dynie(M['dynia'], M['sklejka'])
CX = 5.0
ciecie = box('ciecie', CX, 2000, -2000, 2000, -5, 2000, M['czarny'], baza=False)
for o in list(bpy.data.objects):
    if o.type == 'MESH' and o.name not in ('ciecie', 'Stol') and max((o.matrix_world @ Vector(v)).x for v in o.bound_box) > CX:
        md = o.modifiers.new('ciecie', 'BOOLEAN'); md.operation = 'DIFFERENCE'; md.object = ciecie; md.solver = 'EXACT'
ciecie.hide_render = True
for o in bpy.data.objects:
    if o.type == 'CURVE': o.hide_render = True
render('3-przekroj.png', (700, 0, 150), (0, 0, 140), orto=440, opisy=[
    ('tuleja z gwintem (druk)', (CX, -TUL_R + 3, z_dno_wew - 10), 'l', -80),
    ('nakrętka dociska dno dyni', (CX, 50, z_dno_wew + 5), 'p', -60),
    ('płyta górna 18', (CX, 90, H_IN + 9), 'p', 20),
    ('szufladka z powerbankiem', (CX, yb(50), 18), 'l', 50),
    ('kaseta elektroniki', (CX, yb(190), 3), 'p', 40)])

# 4. Przód
for o in bpy.data.objects:
    for md in list(o.modifiers):
        if md.name == 'ciecie': o.modifiers.remove(md)
    if o.type == 'CURVE': o.hide_render = False
render('4-przod.png', (120, -700, 230), (0, 0, 120), 40, opisy=[
    ('PIR w czole szufladki', (xb(60), yb(-3), 20), 'l', 10), ('duże oko', (0, -D / 2, zc + 10), 'p', -20),
    ('podstawka 236 × 220 × 58', (xb(SZ), yb(0), 30), 'p', 20)])
print('GOTOWE', OUT)
