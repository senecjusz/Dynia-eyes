# Duże oko v2: animacja mechanizmu w Blenderze (render w tle do MP4).
# Użycie: blender -b -P duze-oko-blender-animacja.py -- <katalog STL złożenia z eksport.sh> <plik.mp4> [klatki=144]
# Siatki: Galka, PowiekaGorna, PowiekaDolna, UchwytSerw (położenie złożenia). Serwa, orczyki i druty: bryły zastępcze z parametry.json.
# Kinematyka jak w duze-oko-kinematyka.js: gałka = Rx(φ)·Ry(θ) (konwencja skryptów), kąty serw z równania stałej długości drutu.
import bpy, sys, json, math, os
from mathutils import Matrix, Vector

argv = sys.argv[sys.argv.index('--') + 1:]
DIR, OUT = argv[0], argv[1]
N = int(argv[2]) if len(argv) > 2 else 144
P = json.load(open(os.path.join(DIR, 'parametry.json'), encoding='utf-8'))
rad = math.radians

# --- kinematyka (konwencja skryptów JS: Rx(p,a) = obrót standardowy o −a, Ry(p,a) = standardowy o +a) ---
def RxM(a): return Matrix.Rotation(-rad(a), 4, 'X')
def RyM(a): return Matrix.Rotation(rad(a), 4, 'Y')
def galM(th, ph): return RxM(ph) @ RyM(th)
def Hx(s, a): return Vector((s['xh'], s['ys'] + s['r'] * math.cos(rad(a)), s['zs'] + s['r'] * math.sin(rad(a))))
def Hy(s, a): return Vector((s['xs'] + s['r'] * math.cos(rad(a)), s['yh'], s['zs'] + s['r'] * math.sin(rad(a))))
def zero(f, lo, hi):
    fa, fb = f(lo), f(hi)
    if fa * fb > 0: return None
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
lug1, lug2 = Vector(P['lug1']), Vector(P['lug2'])
s1, s2, s3, lev = P['s1'], P['s2'], P['s3'], P['lev']
L1, L2 = (Hx(s1, s1['a0']) - lug1).length, (Hx(s2, s2['a0']) - lug2).length
mid, SKOK = lev['skok'] / 2, lev['skok']
def U(psi): d = psi - mid; return Vector((lev['xu'], lev['r'] * math.cos(rad(d)), -lev['r'] * math.sin(rad(d))))
def D(psi): d = psi - mid; return Vector((lev['xl'], -lev['r'] * math.cos(rad(d)), -lev['r'] * math.sin(rad(d))))
Lu, Ld = (Hy(s3, 0) - U(mid)).length, (Hy(s3, 0) - D(mid)).length
def alfa3(psi): return zero(lambda a: (Hy(s3, a) - U(psi)).length - Lu, -60, 60)
def psiD(a3, przybl): return zero(lambda q: (Hy(s3, a3) - D(q)).length - Ld, przybl - 5, przybl + 5)

# --- scena ---
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
def mat(nazwa, kolor, alpha=1.0):
    m = bpy.data.materials.new(nazwa); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = (*kolor, 1); b.inputs['Roughness'].default_value = 0.5
    if alpha < 1: b.inputs['Alpha'].default_value = alpha
    return m
def stl(nazwa, m):
    bpy.ops.wm.stl_import(filepath=os.path.join(DIR, nazwa + '.stl'))
    o = bpy.context.selected_objects[0]; o.name = nazwa; o.data.materials.append(m); return o
mBialy, mPom, mBez, mNieb, mCzarny, mCzerw = mat('gałka', (0.95, 0.95, 0.93)), mat('powieki', (0.95, 0.45, 0.05)), mat('uchwyt', (0.85, 0.75, 0.6)), mat('serwa', (0.15, 0.35, 0.75)), mat('orczyki', (0.05, 0.05, 0.05)), mat('druty', (0.85, 0.05, 0.05))
galka, pg, pd, uch = stl('Galka', mBialy), stl('PowiekaGorna', mPom), stl('PowiekaDolna', mPom), stl('UchwytSerw', mBez)
SV = P['sv']
def box(nazwa, x0, x1, y0, y1, z0, z1, m):
    bpy.ops.mesh.primitive_cube_add(size=1, location=((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2))
    o = bpy.context.object; o.name = nazwa; o.scale = (x1 - x0, y1 - y0, z1 - z0); o.data.materials.append(m); return o
hw = SV['Wsv'] / 2
for nm, s in (('S1', s1), ('S2', s2)):
    t = s['xh'] + SV['odstOrcz']; box('serwo ' + nm, t + SV['wiezaH'], t + SV['wiezaH'] + SV['Hsv'], s['ys'] - hw, s['ys'] + hw, SV['zT'], SV['zP'], mNieb)
t = s3['yh'] - SV['odstOrcz']; box('serwo S3', s3['xs'] - hw, s3['xs'] + hw, t - SV['wiezaH'] - SV['Hsv'], t - SV['wiezaH'], SV['zT'], SV['zP'], mNieb)
# orczyk = belka od osi wałka do otworu (+2,5), obracana wokół osi wałka (pivot w osi)
def orczyk(nazwa, os_, c, r):
    bpy.ops.object.empty_add(location=c); piv = bpy.context.object; piv.name = 'oś ' + nazwa
    L = r + 2.5
    if os_ == 'X': b = box(nazwa, c[0] - 1, c[0] + 1, c[1], c[1] + L, c[2] - 2.5, c[2] + 2.5, mCzarny)   # ramię w +y przy α = 0
    else: b = box(nazwa, c[0], c[0] + L, c[1] - 1, c[1] + 1, c[2] - 2.5, c[2] + 2.5, mCzarny)           # ramię w +x przy α = 0
    b.parent = piv; b.matrix_parent_inverse = piv.matrix_world.inverted(); return piv
o1, o2 = orczyk('orczyk S1', 'X', (s1['xh'], s1['ys'], s1['zs']), s1['r']), orczyk('orczyk S2', 'X', (s2['xh'], s2['ys'], s2['zs']), s2['r'])
o3 = orczyk('orczyk S3', 'Y', (s3['xs'], s3['yh'], s3['zs']), s3['r'])
for o in (o1, o2, o3): o.rotation_mode = 'XYZ'
# druty: krzywe z grubością, punkty kluczowane co klatkę
def drut(nazwa):
    cu = bpy.data.curves.new(nazwa, 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = 0.6; cu.bevel_resolution = 2
    sp = cu.splines.new('POLY'); sp.points.add(1); o = bpy.data.objects.new(nazwa, cu); o.data.materials.append(mCzerw); sc.collection.objects.link(o); return sp
dS1, dS2, dPG, dPD = drut('drut S1'), drut('drut S2'), drut('drut PG'), drut('drut PD')
for o in (galka, pg, pd): o.rotation_mode = 'QUATERNION'

# --- ruch: rozglądanie (koło θ ±35, φ ±25) i dwa mrugnięcia ---
a1p, a2p = s1['a0'], s2['a0']
for f in range(N):
    t = f / N
    th, ph = 35 * math.sin(2 * math.pi * t), 25 * math.sin(4 * math.pi * t + 0.6)
    mrug = max(0.0, math.cos(2 * math.pi * (t * 2 - 0.25)) ** 15)   # krótkie zamknięcia
    ps = SKOK * (1 - mrug)
    M = galM(th, ph); galka.rotation_quaternion = M.to_quaternion(); galka.keyframe_insert('rotation_quaternion', frame=f + 1)
    l1, l2 = M @ lug1, M @ lug2
    a1p, a2p = alfa(s1, L1, l1, a1p), alfa(s2, L2, l2, a2p)
    o1.rotation_euler = (rad(a1p), 0, 0); o1.keyframe_insert('rotation_euler', frame=f + 1)
    o2.rotation_euler = (rad(a2p), 0, 0); o2.keyframe_insert('rotation_euler', frame=f + 1)
    a3 = alfa3(ps) or 0.0; pdk = psiD(a3, ps) or ps
    o3.rotation_euler = (0, -rad(a3), 0); o3.keyframe_insert('rotation_euler', frame=f + 1)
    pg.rotation_quaternion = RxM(ps).to_quaternion(); pg.keyframe_insert('rotation_quaternion', frame=f + 1)
    pd.rotation_quaternion = RxM(-pdk).to_quaternion(); pd.keyframe_insert('rotation_quaternion', frame=f + 1)
    for sp, a, b in ((dS1, l1, Hx(s1, a1p)), (dS2, l2, Hx(s2, a2p)), (dPG, U(ps), Hy(s3, a3)), (dPD, D(pdk), Hy(s3, a3))):
        for i, q in enumerate((a, b)): sp.points[i].co = (q.x, q.y, q.z, 1); sp.points[i].keyframe_insert('co', frame=f + 1)

# --- model ma oś y w górę, Blender z: wszystko pod pustym obiektem obróconym o +90° wokół X ---
root = bpy.data.objects.new('model (y w górę)', None); sc.collection.objects.link(root); root.rotation_euler = (rad(90), 0, 0)
for o in list(sc.collection.objects):
    if o is not root and o.parent is None: o.parent = root
# --- kamera, światło, render (współrzędne Blendera: model (x, y, z) → (x, −z, y)) ---
cel = bpy.data.objects.new('cel', None); sc.collection.objects.link(cel); cel.location = (0, 22, -8)
cam = bpy.data.cameras.new('kamera'); cam.lens = 50; cam.clip_end = 5000
co = bpy.data.objects.new('kamera', cam); sc.collection.objects.link(co); co.location = (-185, -25, 95); sc.camera = co
tr = co.constraints.new('TRACK_TO'); tr.target = cel; tr.track_axis = 'TRACK_NEGATIVE_Z'; tr.up_axis = 'UP_Y'
for loc, e in (((-150, 150, 250), 1.2e6), ((200, -150, 150), 0.6e6), ((0, 250, -50), 0.4e6)):
    l = bpy.data.lights.new('l', 'POINT'); l.energy = e; lo = bpy.data.objects.new('l', l); lo.location = loc; sc.collection.objects.link(lo)
w = bpy.data.worlds.new('w'); w.use_nodes = True; w.node_tree.nodes['Background'].inputs['Color'].default_value = (0.35, 0.35, 0.38, 1); sc.world = w
sc.render.engine = 'BLENDER_EEVEE' if 'BLENDER_EEVEE' in [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties['engine'].enum_items] else 'BLENDER_EEVEE_NEXT'
sc.render.resolution_x, sc.render.resolution_y = 1280, 960
sc.frame_start, sc.frame_end = 1, N; sc.render.fps = 24
sc.render.image_settings.file_format = 'PNG'
sc.render.filepath = os.path.join(os.path.dirname(OUT), 'klatki', 'k_')
bpy.ops.wm.save_as_mainfile(filepath=os.path.splitext(OUT)[0] + '.blend')
bpy.ops.render.render(animation=True)
print('KONIEC', OUT)
