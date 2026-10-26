# Duże oko v3: animacja mechanizmu w Blenderze (render w tle do klatek PNG, MP4 składa ffmpeg w duze-oko-v3-render.sh).
# Użycie: blender -b -P duze-oko-v3-blender.py -- <katalog STL złożenia z parametry.json> <katalog wyjściowy> <ujęcie> [klatki]
#   ujęcie: ogolny (ruch L–P, G–D, rozglądanie, mrugnięcie, powieka podąża za spojrzeniem; kamera obiega oko),
#           kardan (gałka półprzezroczysta, bez powiek: kardan 5/5 i trzpienie M5 w środku kuli),
#           prety (pręty L–P i G–D z zaczepami „Z” na języczkach gałki i na orczykach serw),
#           zawiasy (uszy powiek na słupkach płyty, druty Ø2 osi, druty powiek z „Z” na przedłużeniach orczyków)
# Technika renderu jak w duze-oko-blender-v9.py (EEVEE, krzywe z grubością jako druty, klatki kluczowe); geometria z duze-oko-v3.scad.
import bpy, sys, os, math
from mathutils import Matrix, Vector
argv = sys.argv[sys.argv.index('--') + 1:]
DIR, OUT, UJ = argv[0], argv[1], argv[2]
N = int(argv[3]) if len(argv) > 3 else 240
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import duze_oko_v3_kinematyka as kin
K = kin.wczytaj(os.path.join(DIR, 'parametry.json')); P = K.P
rad = math.radians

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
def mat(nazwa, kolor, alpha=1.0, metal=0.0, rough=0.45):
    m = bpy.data.materials.new(nazwa); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = (*kolor, 1); b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    if alpha < 1:
        b.inputs['Alpha'].default_value = alpha
        for atr, w in (('surface_render_method', 'BLENDED'), ('blend_method', 'BLEND')):
            if hasattr(m, atr):
                try: setattr(m, atr, w)
                except Exception: pass
    return m
przezr_galka = 0.22 if UJ == 'kardan' else (0.55 if UJ == 'prety' else 1.0)
M = dict(galka=mat('gałka', (0.95, 0.95, 0.93), przezr_galka), pow=mat('powieki', (0.95, 0.45, 0.05)),
         plyta=mat('płyta', (0.95, 0.50, 0.08)), tuba=mat('tuba', (0.95, 0.55, 0.15), 0.18), mask=mat('maskownica', (0.15, 0.15, 0.15)),
         serwo=mat('serwa', (0.15, 0.35, 0.75)), orcz=mat('orczyki', (0.92, 0.92, 0.92)), prz=mat('przedłużenia', (0.95, 0.50, 0.08)),
         drut=mat('druty', (0.85, 0.05, 0.05), metal=0.6, rough=0.3), kard=mat('kardan', (0.80, 0.82, 0.85), metal=0.9, rough=0.25),
         sruba=mat('śruby', (0.35, 0.35, 0.38), metal=0.9), os_=mat('osie', (0.85, 0.85, 0.2), metal=0.7), napis=mat('napisy', (0.02, 0.02, 0.02)))
root = bpy.data.objects.new('model (y w górę)', None); sc.collection.objects.link(root); root.rotation_euler = (rad(90), 0, 0)
def wez(o): o.parent = root; return o
def stl(nazwa, m):
    bpy.ops.wm.stl_import(filepath=os.path.join(DIR, nazwa + '.stl'))
    o = bpy.context.selected_objects[0]; o.name = nazwa; o.data.materials.append(m)
    bpy.ops.object.shade_auto_smooth() if hasattr(bpy.ops.object, 'shade_auto_smooth') else None
    return wez(o)
galka = stl('Galka', M['galka']); plyta = stl('Plyta', M['plyta'])
pg = stl('PowiekaGorna', M['pow']); pd = stl('PowiekaDolna', M['pow'])
tuba = stl('Tuba40', M['tuba']); mask = stl('Maskownica', M['mask'])
if UJ in ('kardan', 'prety'):
    for o in (pg, pd): o.hide_render = True
if UJ in ('kardan', 'prety', 'zawiasy'):
    tuba.hide_render = True; mask.hide_render = True
for o in (galka, pg, pd): o.rotation_mode = 'QUATERNION'

def box(nazwa, x0, x1, y0, y1, z0, z1, m, parent=None):
    bpy.ops.mesh.primitive_cube_add(size=1, location=((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2))
    o = bpy.context.object; o.name = nazwa; o.scale = (x1 - x0, y1 - y0, z1 - z0); o.data.materials.append(m)
    if parent: o.parent = parent; return o
    return wez(o)
def cyl(nazwa, c0, c1, r, m, parent=None, v=32):
    c0, c1 = Vector(c0), Vector(c1); d = c1 - c0
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=d.length, vertices=v, location=(c0 + c1) / 2)
    o = bpy.context.object; o.name = nazwa; o.rotation_mode = 'QUATERNION'; o.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(d.normalized())
    o.data.materials.append(m)
    if parent: o.parent = parent; return o
    return wez(o)
def pusty(nazwa, loc=(0, 0, 0)):
    e = bpy.data.objects.new(nazwa, None); sc.collection.objects.link(e); wez(e); e.location = loc; e.rotation_mode = 'QUATERNION'; return e

# ---- kardan 5/5: piasta tylna nieruchoma (sworzeń pionowo), krzyżak obraca się z psi, piasta przednia z gałką ----
cyl('kardan piasta tylna', (0, 0, -12.75), (0, 0, -4.5), 5.5, M['kard'])
for s in (1, -1): box('kardan widełki tylne', -2.5, 2.5, s * 3.3, s * 5.5, -5, 2.5, M['kard'])
cyl('trzpień M5 słupka', (0, 0, -14.3), (0, 0, -6.2), 2.5, M['sruba'])
krzyz = pusty('kardan krzyżak')
box('krzyżak', -2.2, 2.2, -2.2, 2.2, -2.2, 2.2, M['kard'], krzyz)
cyl('krzyżak sworzeń pion', (0, -5.3, 0), (0, 5.3, 0), 1.3, M['kard'], krzyz)
cyl('krzyżak sworzeń poziom', (-5.3, 0, 0), (5.3, 0, 0), 1.3, M['kard'], krzyz)
przod = pusty('kardan przód (z gałką)')
cyl('kardan piasta przednia', (0, 0, 4.5), (0, 0, 12.75), 5.5, M['kard'], przod)
for s in (1, -1): box('kardan widełki przednie', s * 3.3, s * 5.5, -2.5, 2.5, -2.5, 5, M['kard'], przod)
cyl('trzpień M5 gałki', (0, 0, 6.2), (0, 0, 19.2), 2.5, M['sruba'], przod)
cyl('wkręt M4 piasty przedniej', (-5.3, 0, 9.1), (-6.3, 0, 9.1), 2.0, M['sruba'], przod)
cyl('wkręt M4 piasty tylnej', (0, 5.3, -9.1), (0, 6.3, -9.1), 2.0, M['sruba'])

# ---- serwa MG90S (korpusy, wieżyczki), orczyki i przedłużenia orczyków ----
L, G, PG, PD = P['LP_wal'], P['GD_wal'], P['PG_wal'], P['PD_wal']
box('serwo L–P', L[0] - 6.25, L[0] + 6.25, -33, -10.5, L[2] + 5.5 - 22.8, L[2] + 5.5, M['serwo'])
cyl('wieżyczka L–P', (L[0], -10.5, L[2]), (L[0], -2, L[2]), 5.9, M['serwo'])
box('serwo G–D', -33, -10.5, -15, 7.8, G[2] - 6.25, G[2] + 6.25, M['serwo'])
cyl('wieżyczka G–D', (-10.5, G[1], G[2]), (-1, G[1], G[2]), 5.9, M['serwo'])
box('serwo powieki górnej', 15.5, 38, -15, 7.8, PG[2] - 6.25, PG[2] + 6.25, M['serwo'])
cyl('wieżyczka powieki górnej', (15.5, PG[1], PG[2]), (6, PG[1], PG[2]), 5.9, M['serwo'])
box('serwo powieki dolnej', -38, -15.5, -15, 7.8, PD[2] - 6.25, PD[2] + 6.25, M['serwo'])
cyl('wieżyczka powieki dolnej', (-15.5, PD[1], PD[2]), (-6, PD[1], PD[2]), 5.9, M['serwo'])
def orczyk(nazwa, os_kier, c, ramie, dl, gr, m):   # belka obracana wokół osi wałka; ramie: kierunek ramienia przy α = 0
    e = pusty(nazwa + ' oś', c)
    bpy.ops.mesh.primitive_cube_add(size=1); o = bpy.context.object; o.name = nazwa
    a = Vector(ramie).normalized(); n = Vector(os_kier).normalized(); b = n.cross(a)
    Mx = Matrix(((a.x, b.x, n.x, 0), (a.y, b.y, n.y, 0), (a.z, b.z, n.z, 0), (0, 0, 0, 1)))
    o.data.transform(Mx @ Matrix.Translation((dl / 2 - 3, 0, 0)) @ Matrix.Diagonal((dl + 6, 5, gr, 1)))
    o.data.materials.append(m); o.parent = e
    cyl(nazwa + ' piasta', -n * gr, n * gr * 1.5, 3.5, m, e)
    return e
# osie obrotu: L–P wokół +y (α rośnie: otwór idzie w +z), G–D i powieki wokół ±x
oLP = orczyk('orczyk L–P', (0, 1, 0), (L[0], 0.5, L[2]), (-1, 0, 0), P['orcz_LP'], 1.6, M['orcz'])
oGD = orczyk('orczyk G–D', (1, 0, 0), (0.5, G[1], G[2]), (0, 1, 0), P['orcz_GD'], 1.6, M['orcz'])
oG = orczyk('przedłużenie powieki górnej', (1, 0, 0), (P['pG_x_orcz'], PG[1], PG[2]), (0, 1, 0), P['orcz_pow'], 2.5, M['prz'])
oD = orczyk('przedłużenie powieki dolnej', (1, 0, 0), (P['pD_x_orcz'], PD[1], PD[2]), (0, -1, 0), P['orcz_pow'], 2.5, M['prz'])
def ustaw_orczyk(e, os_, kat, f):
    e.rotation_quaternion = Matrix.Rotation(rad(kat), 4, os_).to_quaternion(); e.keyframe_insert('rotation_quaternion', frame=f)
# osie powiek: druty Ø2 w słupkach
for s in (1, -1): cyl('oś powiek Ø2', (s * 31.6, 0, 0), (s * 37.2, 0, 0), 1.0, M['os_'])

# ---- druty z końcami w „Z”: łamana (przejście przez otwór wzdłuż osi otworu, odsadzenie 1,75, odcinek do drugiego otworu) ----
def drut(nazwa, r=P.get('drut_d', 1.0) / 2):
    cu = bpy.data.curves.new(nazwa, 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = r; cu.bevel_resolution = 3; cu.use_fill_caps = True
    sp = cu.splines.new('POLY'); sp.points.add(5); o = bpy.data.objects.new(nazwa, cu); o.data.materials.append(M['drut']); sc.collection.objects.link(o); wez(o); return sp
def ustaw_drut(sp, a, na, b, nb, f, odst=1.75, wyst=1.6, odst_a=None):
    a, b, na, nb = Vector(a), Vector(b), Vector(na).normalized(), Vector(nb).normalized()
    oa = odst if odst_a is None else odst_a
    a1, b1 = a + na * oa, b + nb * odst
    pts = [a - na * wyst, a1, a1 + (b1 - a1).normalized() * 1.2, b1 - (b1 - a1).normalized() * 1.2, b1, b - nb * wyst]
    for i, q in enumerate(pts): sp.points[i].co = (q.x, q.y, q.z, 1); sp.points[i].keyframe_insert('co', frame=f)
dLP, dGD, dG, dD = drut('pręt L–P'), drut('pręt G–D'), drut('drut powieki górnej'), drut('drut powieki dolnej')

# ---- napisy ----
def napis(tekst, gdzie, rozm=4.0):
    cu = bpy.data.curves.new(tekst, 'FONT'); cu.body = tekst; cu.size = rozm; cu.align_x = 'CENTER'
    o = bpy.data.objects.new('napis ' + tekst, cu); o.data.materials.append(M['napis']); sc.collection.objects.link(o); wez(o); o.location = gdzie; return o
NAP = {'ogolny': [('L–P', (L[0] + 10, -40, L[2])), ('G–D', (-22, 14, G[2])), ('powieka górna', (27, 14, PG[2])), ('powieka dolna', (-27, 14, PD[2]))],
       'kardan': [('kardan 5/5', (0, 13, -6), 3.0), ('trzpień M5 słupka', (0, -12, -19), 2.5), ('trzpień M5 gałki', (0, 12, 19), 2.5)],
       'prety': [('zaczep „Z” na języczku', (24, 10, -4), 3.0), ('zaczep „Z” na orczyku', (24, 12, -62), 3.0), ('pręt G–D', (6, 22, -30), 3.0), ('pręt L–P', (26, -6, -30), 3.0)],
       'zawiasy': [('oś Ø2 w słupku', (44, 9, 0), 3.0), ('ucho powieki górnej / dolnej', (44, -10, 0), 3.0), ('drut powieki z „Z”', (14, 40, -40), 3.0)]}
napisy = [napis(t[0], t[1], t[2] if len(t) > 2 else 4.0) for t in NAP[UJ]]

# ---- ruch ----
def ruch(t):
    """Zwraca psi, theta, g, d dla t w [0,1) zależnie od ujęcia."""
    if UJ in ('ogolny',):
        if t < 0.18:  return 35 * math.sin(2 * math.pi * t / 0.18), 0, 51.5, 51.5                  # lewo–prawo
        if t < 0.36:  u = (t - 0.18) / 0.18; return 0, 25 * math.sin(2 * math.pi * u), 51.5, 51.5   # góra–dół
        if t < 0.62:  u = (t - 0.36) / 0.26; return 30 * math.cos(2 * math.pi * u), 20 * math.sin(2 * math.pi * u), 51.5, 51.5  # rozglądanie (narożniki)
        if t < 0.74:  u = (t - 0.62) / 0.12; z = 51.5 * (1 - math.sin(math.pi * u)); return 0, 0, z, z   # mrugnięcie obu powiek
        u = (t - 0.74) / 0.26; th = 22 * math.sin(2 * math.pi * u)                                      # powieka górna podąża za spojrzeniem
        return 15 * math.sin(4 * math.pi * u), th, max(10, min(51.5, 30 + th)), 51.5
    if UJ in ('kardan', 'prety'):
        if t < 0.5: return 35 * math.sin(2 * math.pi * t / 0.5), 0, 51.5, 51.5
        u = (t - 0.5) / 0.5; return 0, 25 * math.sin(2 * math.pi * u), 51.5, 51.5
    # zawiasy: powieki niezależnie
    if t < 0.5: z = 51.5 * (1 - math.sin(math.pi * t / 0.5)); return 0, 0, z, 51.5
    u = (t - 0.5) / 0.5; z = 51.5 * (1 - math.sin(math.pi * u)); return 0, 0, 51.5, z

prev = dict(aLP=0, aGD=0, aG=None, aD=None)
for f in range(1, N + 1):
    t = (f - 1) / N
    psi, th, g, d = ruch(t)
    st = K.stan(psi, th, g, d, prev['aLP'], prev['aGD'], prev['aG'], prev['aD'])
    for k in prev: prev[k] = st[k]
    Rg = Matrix(st['Rg']).to_4x4()
    galka.rotation_quaternion = Rg.to_quaternion(); galka.keyframe_insert('rotation_quaternion', frame=f)
    przod.rotation_quaternion = Rg.to_quaternion(); przod.keyframe_insert('rotation_quaternion', frame=f)
    krzyz.rotation_quaternion = Matrix(kin.Ry(psi)).to_4x4().to_quaternion(); krzyz.keyframe_insert('rotation_quaternion', frame=f)
    pg.rotation_quaternion = Matrix(st['RG']).to_4x4().to_quaternion(); pg.keyframe_insert('rotation_quaternion', frame=f)
    pd.rotation_quaternion = Matrix(st['RD']).to_4x4().to_quaternion(); pd.keyframe_insert('rotation_quaternion', frame=f)
    # orczyki: L–P otwór (L.x − r cos α, z + r sin α) → obrót wokół +y o +α; dolna powieka o −α; G–D (y + r cos α, z + r sin α) → wokół +x o +α
    ustaw_orczyk(oLP, Vector((0, 1, 0)), st['aLP'], f)
    ustaw_orczyk(oGD, Vector((1, 0, 0)), st['aGD'], f)
    ustaw_orczyk(oG, Vector((1, 0, 0)), st['aG'], f)
    ustaw_orczyk(oD, Vector((1, 0, 0)), -st['aD'], f)
    Rg3 = Matrix(st['Rg'])
    ustaw_drut(dLP, st['otwLP'], st['nLP'], st['pretLP'][1], (0, 1, 0), f, odst_a=P['zacz_ods'])
    ustaw_drut(dGD, st['otwGD'], st['nGD'], st['pretGD'][1], (-1, 0, 0), f, odst_a=P['zacz_ods'])
    ustaw_drut(dG, st['drutG'][0], (1, 0, 0), st['drutG'][1], (1, 0, 0), f, odst_a=P['pow_ods'])
    ustaw_drut(dD, st['drutD'][0], (-1, 0, 0), st['drutD'][1], (-1, 0, 0), f, odst_a=P['pow_ods'])

# ---- kamera (współrzędne Blendera: model (x, y, z) → (x, −z, y)) ----
def B(p): return Vector((p[0], -p[2], p[1]))
UJECIA = {'ogolny': dict(cel=(0, -6, -35), r=340, h=100, kat0=215, obrot=70, lens=50),
          'kardan': dict(cel=(0, 0, -4), r=130, h=45, kat0=15, obrot=40, lens=70),
          'prety': dict(cel=(14, 4, -30), r=150, h=60, kat0=320, obrot=30, lens=50),
          'zawiasy': dict(cel=(30, 0, -5), r=110, h=40, kat0=10, obrot=25, lens=55)}
U = UJECIA[UJ]
cel = bpy.data.objects.new('cel', None); sc.collection.objects.link(cel); cel.location = B(U['cel'])
cam = bpy.data.cameras.new('kamera'); cam.lens = U['lens']; cam.clip_start = 1; cam.clip_end = 5000
co = bpy.data.objects.new('kamera', cam); sc.collection.objects.link(co); sc.camera = co
tr = co.constraints.new('TRACK_TO'); tr.target = cel; tr.track_axis = 'TRACK_NEGATIVE_Z'; tr.up_axis = 'UP_Y'
for f in range(0, N + 1, 6):
    t = f / N; kat = rad(U['kat0'] + U['obrot'] * t)
    # kąt mierzony w płaszczyźnie poziomej modelu (x, z): 270° = z przodu oka
    c = U['cel']; co.location = B((c[0] + U['r'] * math.cos(kat), c[1] + U['h'], c[2] + U['r'] * math.sin(kat))); co.keyframe_insert('location', frame=f + 1)
for o in napisy:
    c = o.constraints.new('TRACK_TO'); c.target = co; c.track_axis = 'TRACK_Z'; c.up_axis = 'UP_Y'
for loc, e in (((-150, 150, 250), 1.2e6), ((200, -150, 150), 0.7e6), ((0, 250, -50), 0.5e6), ((0, -250, 100), 0.5e6)):
    l = bpy.data.lights.new('l', 'POINT'); l.energy = e; lo = bpy.data.objects.new('l', l); lo.location = loc; sc.collection.objects.link(lo)
w = bpy.data.worlds.new('w'); w.use_nodes = True; w.node_tree.nodes['Background'].inputs['Color'].default_value = (0.35, 0.35, 0.38, 1); sc.world = w
sc.render.engine = 'BLENDER_EEVEE' if 'BLENDER_EEVEE' in [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties['engine'].enum_items] else 'BLENDER_EEVEE_NEXT'
sc.render.resolution_x, sc.render.resolution_y = 1280, 720
PROBKI = int(os.environ.get('PROBKI', '12'))   # EEVEE: próbki na klatkę (domyślnie 64 – za wolno w tle na CPU)
if hasattr(sc, 'eevee'):
    for atr, w in (('taa_render_samples', PROBKI), ('use_raytracing', False)):
        if hasattr(sc.eevee, atr):
            try: setattr(sc.eevee, atr, w)
            except Exception: pass
sc.frame_start, sc.frame_end = 1, N; sc.render.fps = 24
sc.render.image_settings.file_format = 'PNG'
os.makedirs(os.path.join(OUT, 'klatki-' + UJ), exist_ok=True)
sc.render.filepath = os.path.join(OUT, 'klatki-' + UJ, 'k_')
if UJ == 'ogolny': bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, 'duze-oko-v3.blend'))
bpy.ops.render.render(animation=True)
print('KONIEC', UJ)
