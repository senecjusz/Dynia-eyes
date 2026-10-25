# Duże oko v9: animacja mechanizmu w Blenderze (render w tle do klatek PNG; MP4 składa ffmpeg).
# Użycie: blender -b -P duze-oko-blender-v9.py -- <katalog STL złożenia z parametry.json (eksport.sh)> <katalog wyjściowy> [klatki=240]
# Pokazuje: gałkę na kardanie 5/5, kardany 2/2 z prętami do serw S1 (lewo–prawo) i S2 (góra–dół), powieki na osobnych serwach SG/SD
# (drut z uszka na tylnej krawędzi powieki do przedłużenia orczyka 25 mm), pierścień półprzezroczysty. Kinematyka jak w skryptach kolizji.
import bpy, sys, json, math, os
from mathutils import Matrix, Vector

argv = sys.argv[sys.argv.index('--') + 1:]
DIR, OUT = argv[0], argv[1]
N = int(argv[2]) if len(argv) > 2 else 240
P = json.load(open(os.path.join(DIR, 'parametry.json'), encoding='utf-8'))
rad = math.radians
def RxM(a): return Matrix.Rotation(-rad(a), 4, 'X')        # konwencja skryptów: Rx(p, a) = obrót standardowy o −a
def RyM(a): return Matrix.Rotation(rad(a), 4, 'Y')
def galM(th, ph): return RxM(ph) @ RyM(th)
def Hx(s, a): return Vector((s['xh'], s['ys'] + s['r'] * math.cos(rad(a)), s['zs'] + s['r'] * math.sin(rad(a))))
def zero(f, lo, hi):
    fa = f(lo)
    if fa * f(hi) > 0: return None
    for _ in range(50):
        m = (lo + hi) / 2; fm = f(m)
        if fa * fm <= 0: hi = m
        else: lo, fa = m, fm
    return (lo + hi) / 2
def alfa(s, L, pkt, prev):
    f = lambda a: (Hx(s, a) - pkt).length - L
    for d in range(0, 100):
        for lo, hi in ((prev + d, prev + d + 1), (prev - d - 1, prev - d)):
            r = zero(f, lo, hi)
            if r is not None: return r
    return prev
s1, s2, PW = P['s1'], P['s2'], P['pow']
lug1, lug2 = Vector(P['lug1']), Vector(P['lug2'])
L1, L2 = (Hx(s1, s1['a0']) - lug1).length, (Hx(s2, s2['a0']) - lug2).length
os1, os2 = (Hx(s1, s1['a0']) - lug1).normalized(), (Hx(s2, s2['a0']) - lug2).normalized()
SK = PW['skok']
def uszko(sg, ps): return Vector((0, sg * PW['rZacz'] * math.sin(rad(PW['katZacz'] + ps)), PW['rZacz'] * math.cos(rad(PW['katZacz'] + ps))))
def orczP(sg, a): return Vector((0, sg * (PW['yWal'] + PW['r'] * math.cos(rad(a))), PW['zs'] + PW['r'] * math.sin(rad(a))))
LP = (uszko(1, SK / 2) - orczP(1, 0)).length
def alfaP(ps):
    f = lambda a: (uszko(1, ps) - orczP(1, a)).length - LP
    r = zero(f, 0, 100) if ps < SK / 2 else zero(f, -100, 0)
    return r if r is not None else 0.0

# ---- scena ----
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
def mat(nazwa, kolor, alpha=1.0, metal=0.0):
    m = bpy.data.materials.new(nazwa); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = (*kolor, 1); b.inputs['Roughness'].default_value = 0.45
    b.inputs['Metallic'].default_value = metal
    if alpha < 1:
        b.inputs['Alpha'].default_value = alpha
        for atr, w in (('surface_render_method', 'BLENDED'), ('blend_method', 'BLEND')):
            if hasattr(m, atr):
                try: setattr(m, atr, w)
                except Exception: pass
    return m
M = dict(galka=mat('gałka', (0.95, 0.95, 0.93)), pow=mat('powieki', (0.95, 0.45, 0.05)), uch=mat('uchwyt', (0.80, 0.70, 0.55), 0.35),
         pier=mat('pierścień', (0.85, 0.65, 0.40), 0.18), serwo=mat('serwa', (0.15, 0.35, 0.75)), orcz=mat('orczyki', (0.06, 0.06, 0.06)),
         drut=mat('druty', (0.85, 0.05, 0.05)), pret=mat('pręty', (0.75, 0.75, 0.78), metal=0.8), kard=mat('kardany', (0.80, 0.82, 0.85), metal=0.9),
         napis=mat('napisy', (0.05, 0.05, 0.05)))
root = bpy.data.objects.new('model (y w górę)', None); sc.collection.objects.link(root); root.rotation_euler = (rad(90), 0, 0)
def wez(o): o.parent = root; return o
def stl(nazwa, m):
    bpy.ops.wm.stl_import(filepath=os.path.join(DIR, nazwa + '.stl'))
    o = bpy.context.selected_objects[0]; o.name = nazwa; o.data.materials.append(m); return wez(o)
galka, pg, pd = stl('Galka', M['galka']), stl('PowiekaGorna', M['pow']), stl('PowiekaDolna', M['pow'])
stl('UchwytSerw', M['uch']); stl('Pierscien', M['pier'])
for o in (galka, pg, pd): o.rotation_mode = 'QUATERNION'
SV = P['sv']; hw = SV['Wsv'] / 2
def box(nazwa, x0, x1, y0, y1, z0, z1, m):
    bpy.ops.mesh.primitive_cube_add(size=1, location=((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2))
    o = bpy.context.object; o.name = nazwa; o.scale = (x1 - x0, y1 - y0, z1 - z0); o.data.materials.append(m); return wez(o)
for nm, s in (('S1', s1), ('S2', s2)):
    t = s['xh'] + SV['odstOrcz']; box('serwo ' + nm, t + SV['wiezaH'], t + SV['wiezaH'] + SV['Hsv'], s['ys'] - hw, s['ys'] + hw, SV['zT'], SV['zP'], M['serwo'])
for nm, sg in (('SG', 1), ('SD', -1)):
    t = -SV['odstOrcz']; y = sg * PW['yWal']; box('serwo ' + nm, t - SV['wiezaH'] - SV['Hsv'], t - SV['wiezaH'], y - hw, y + hw, SV['zT'], SV['zP'], M['serwo'])
# orczyk: belka na osi obrotu (pusty obiekt = oś), obracana wokół x
def orczyk(nazwa, c, L, kier):   # belka z początkiem układu w osi wałka; kier: +1 ramię w +y przy α = 0, −1 w −y
    bpy.ops.mesh.primitive_cube_add(size=1); o = bpy.context.object; o.name = nazwa
    o.data.transform(Matrix.Translation((0, kier * L / 2, 0)) @ Matrix.Diagonal((2.4, L, 5.2, 1)))
    o.data.materials.append(M['orcz']); o.location = c; o.rotation_mode = 'XYZ'; return wez(o)
o1 = orczyk('orczyk S1', (s1['xh'], s1['ys'], s1['zs']), s1['r'] + 2.5, 1)
o2 = orczyk('orczyk S2', (s2['xh'], s2['ys'], s2['zs']), s2['r'] + 2.5, 1)
oG = orczyk('przedłużenie SG', (0, PW['yWal'], PW['zs']), PW['r'] + 3, 1)
oD = orczyk('przedłużenie SD', (0, -PW['yWal'], PW['zs']), PW['r'] + 3, -1)
# odcinki zmienne w czasie: krzywa z grubością, punkty kluczowane
def odcinek(nazwa, gr, m):
    cu = bpy.data.curves.new(nazwa, 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = gr; cu.bevel_resolution = 3; cu.use_fill_caps = True
    sp = cu.splines.new('POLY'); sp.points.add(1); o = bpy.data.objects.new(nazwa, cu); o.data.materials.append(m); sc.collection.objects.link(o); wez(o); return sp
LK, RK = 23.5, 4.5
el = {nm: dict(p1=odcinek('kardan ' + nm + ' piasta 1', RK, M['kard']), p2=odcinek('kardan ' + nm + ' piasta 2', RK, M['kard']), pret=odcinek('pręt ' + nm, 1.0, M['pret'])) for nm in ('S1', 'S2')}
dG, dD = odcinek('drut SG', 0.55, M['drut']), odcinek('drut SD', 0.55, M['drut'])
def ustaw(sp, a, b, f):
    for i, q in enumerate((a, b)): sp.points[i].co = (q.x, q.y, q.z, 1); sp.points[i].keyframe_insert('co', frame=f)
# napisy (zawsze przodem do kamery)
def napis(tekst, gdzie):
    cu = bpy.data.curves.new(tekst, 'FONT'); cu.body = tekst; cu.size = 5; cu.align_x = 'CENTER'
    o = bpy.data.objects.new('napis ' + tekst, cu); o.data.materials.append(M['napis']); sc.collection.objects.link(o); wez(o); o.location = gdzie; return o
napisy = [napis('S1 lewo–prawo', (s1['xh'] + 25, s1['ys'], SV['zT'] - 6)), napis('S2 góra–dół', (s2['xh'] + 25, s2['ys'] + 12, SV['zT'] - 6)),
          napis('SG powieka górna', (-30, PW['yWal'] + 14, SV['zT'] - 6)), napis('SD powieka dolna', (-30, -PW['yWal'] - 14, SV['zT'] - 6)),
          napis('kardany 2/2', (12, 12, -26))]

# ---- ruch: 0–40 % rozglądanie po kole, 40–55 % mrugnięcie obu, 55–70 % sama górna (przymknięcie), 70–85 % sama dolna, 85–100 % rozglądanie ----
a1p, a2p = s1['a0'], s2['a0']
for f in range(N):
    t = f / N
    th, ph = 35 * math.sin(2 * math.pi * t * 1.5), 25 * math.sin(2 * math.pi * t * 3 + 0.6)
    if 0.40 <= t < 0.55: th, ph = 0, 0
    psg = psd = SK
    if 0.40 <= t < 0.55: psg = psd = SK * (1 - math.sin(math.pi * (t - 0.40) / 0.15))
    elif 0.55 <= t < 0.70: psg = SK * (1 - 0.7 * math.sin(math.pi * (t - 0.55) / 0.15))
    elif 0.70 <= t < 0.85: psd = SK * (1 - 0.8 * math.sin(math.pi * (t - 0.70) / 0.15))
    k = f + 1
    G = galM(th, ph); galka.rotation_quaternion = G.to_quaternion(); galka.keyframe_insert('rotation_quaternion', frame=k)
    for nm, s, lug, os_, L, oo in (('S1', s1, lug1, os1, L1, o1), ('S2', s2, lug2, os2, L2, o2)):
        J = G @ lug
        prev = a1p if nm == 'S1' else a2p
        a = alfa(s, L, J, prev)
        if nm == 'S1': a1p = a
        else: a2p = a
        oo.rotation_euler = (rad(a), 0, 0); oo.keyframe_insert('rotation_euler', frame=k)
        H = Hx(s, a); u = (H - J).normalized(); o = (G.to_3x3() @ os_)
        ustaw(el[nm]['p1'], J - o * (LK / 2), J, k); ustaw(el[nm]['p2'], J, J + u * (LK / 2), k); ustaw(el[nm]['pret'], J + u * (LK / 2), H, k)
    pg.rotation_quaternion = RxM(psg).to_quaternion(); pg.keyframe_insert('rotation_quaternion', frame=k)
    pd.rotation_quaternion = RxM(-psd).to_quaternion(); pd.keyframe_insert('rotation_quaternion', frame=k)
    aG, aD = alfaP(psg), alfaP(psd)
    oG.rotation_euler = (rad(aG), 0, 0); oG.keyframe_insert('rotation_euler', frame=k)
    oD.rotation_euler = (rad(-aD), 0, 0); oD.keyframe_insert('rotation_euler', frame=k)
    ustaw(dG, uszko(1, psg), orczP(1, aG), k); ustaw(dD, uszko(-1, psd), orczP(-1, aD), k)

# ---- kamera: pełne okrążenie mechanizmu (współrzędne Blendera: model (x, y, z) → (x, −z, y)) ----
cel = bpy.data.objects.new('cel', None); sc.collection.objects.link(cel); cel.location = (0, 22, 0)
cam = bpy.data.cameras.new('kamera'); cam.lens = 50; cam.clip_end = 5000
co = bpy.data.objects.new('kamera', cam); sc.collection.objects.link(co); sc.camera = co
tr = co.constraints.new('TRACK_TO'); tr.target = cel; tr.track_axis = 'TRACK_NEGATIVE_Z'; tr.up_axis = 'UP_Y'
for f in range(0, N + 1, 6):
    t = f / N; kat = rad(200 - 360 * t)   # pełne okrążenie: lewy przód → lewy bok → tył → prawy bok → przód
    R = 250; co.location = (R * math.cos(kat), R * math.sin(kat) * -1 + 22, 100); co.keyframe_insert('location', frame=f + 1)
for o in napisy:
    c = o.constraints.new('TRACK_TO'); c.target = co; c.track_axis = 'TRACK_Z'; c.up_axis = 'UP_Y'
for loc, e in (((-150, 150, 250), 1.2e6), ((200, -150, 150), 0.7e6), ((0, 250, -50), 0.5e6), ((0, -250, 100), 0.5e6)):
    l = bpy.data.lights.new('l', 'POINT'); l.energy = e; lo = bpy.data.objects.new('l', l); lo.location = loc; sc.collection.objects.link(lo)
w = bpy.data.worlds.new('w'); w.use_nodes = True; w.node_tree.nodes['Background'].inputs['Color'].default_value = (0.35, 0.35, 0.38, 1); sc.world = w
sc.render.engine = 'BLENDER_EEVEE' if 'BLENDER_EEVEE' in [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties['engine'].enum_items] else 'BLENDER_EEVEE_NEXT'
sc.render.resolution_x, sc.render.resolution_y = 1280, 960
sc.frame_start, sc.frame_end = 1, N; sc.render.fps = 24
sc.render.image_settings.file_format = 'PNG'
os.makedirs(os.path.join(OUT, 'klatki'), exist_ok=True)
sc.render.filepath = os.path.join(OUT, 'klatki', 'k_')
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, 'duze-oko-v9.blend'))
bpy.ops.render.render(animation=True)
print('KONIEC')
