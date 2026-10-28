# Duże oko v3: obrazy do ilustrowanej instrukcji montażu (§5 duze-oko-v3-montaz.md, kroki 1–9).
# Na każdym obrazie część dokładana w danym kroku jest turkusowa, części już zamontowane mają zwykłe kolory, reszta jest ukryta;
# narzędzia (wkrętak PH1, imbus 2) szare na drodze z instrukcji. Druty jako pełne „Z”: noga drut_noga z otworem na środku,
# ogon drut_ogon; w uszkach powiek ogon zagięty w drugą stronę: równolegle do drutu, ku serwu (decyzja użytkownika 28.10, §8 instrukcji).
# Użycie: blender -b -P duze-oko-v3-montaz-render.py -- <katalog STL złożenia z parametry.json (eksport-v3.sh)> <katalog wyjściowy> [ujęcie …]
# Wynik: <katalog wyjściowy>/<ujęcie>.jpg (40-cad/openscad/podglad/duze-oko-v3/montaz/, używane w duze-oko-v3-montaz.html).
# Technika jak w duze-oko-v3-blender.py (EEVEE, krzywe z grubością jako druty); pliku .blend nie zapisuje.
import bpy, sys, os, math
from mathutils import Matrix, Vector
argv = sys.argv[sys.argv.index('--') + 1:]
DIR, OUT = argv[0], argv[1]
WYBRANE = argv[2:]
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import duze_oko_v3_kinematyka as kin
K = kin.wczytaj(os.path.join(DIR, 'parametry.json')); P = K.P
rad = math.radians
NOGA, OGON = P.get('drut_noga', 7), P.get('drut_ogon', 2)
L, G, PG, PD = P['LP_wal'], P['GD_wal'], P['PG_wal'], P['PD_wal']

def mat(nazwa, kolor, alpha=1.0, metal=0.0, rough=0.45, emis=0.0):
    m = bpy.data.materials.new(nazwa); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = (*kolor, 1); b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    if emis:
        for k in ('Emission Color', 'Emission'):
            if k in b.inputs: b.inputs[k].default_value = (*kolor, 1); break
        if 'Emission Strength' in b.inputs: b.inputs['Emission Strength'].default_value = emis
    if alpha < 1:
        b.inputs['Alpha'].default_value = alpha
        for atr, w in (('surface_render_method', 'BLENDED'), ('blend_method', 'BLEND')):
            if hasattr(m, atr):
                try: setattr(m, atr, w)
                except Exception: pass
    return m

def scena(kroki, pozycja, kamera, nazwa, przezr=()):
    """kroki: zbiór części już zamontowanych (zwykły kolor); nowe: części tego kroku (turkus); pozycja: (psi, theta, g, d)."""
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    NOWY = mat('nowa część', (0.0, 0.55, 0.70), emis=0.08)
    M = dict(galka=mat('gałka', (0.95, 0.95, 0.93)), pow=mat('powieki', (0.95, 0.45, 0.05)), plyta=mat('płyta', (0.95, 0.50, 0.08)),
             serwo=mat('serwa', (0.15, 0.35, 0.75)), orcz=mat('orczyki', (0.92, 0.92, 0.92)), prz=mat('przedłużenia', (0.95, 0.50, 0.08)),
             drut=mat('druty', (0.85, 0.05, 0.05), metal=0.6, rough=0.3), kard=mat('kardan', (0.80, 0.82, 0.85), metal=0.9, rough=0.25),
             sruba=mat('śruby', (0.35, 0.35, 0.38), metal=0.9), os_=mat('osie', (0.85, 0.85, 0.2), metal=0.7),
             narz=mat('narzędzie', (0.25, 0.25, 0.27), metal=0.8, rough=0.3), rek=mat('rękojeść', (0.85, 0.15, 0.10)))
    widm = {}   # części półprzezroczyste (np. gałka, żeby było widać zaczep w środku)
    for k in przezr: widm[k] = mat('przezr ' + k, (0.0, 0.55, 0.70) if k in kroki['nowe'] else (0.95, 0.95, 0.93), 0.30)
    root = bpy.data.objects.new('model (y w górę)', None); sc.collection.objects.link(root); root.rotation_euler = (rad(90), 0, 0)
    def wez(o): o.parent = root; return o
    def m_(klucz, mk):   # materiał części: turkus, gdy dokładana w tym kroku
        return widm.get(klucz, NOWY if klucz in kroki['nowe'] else M[mk])
    def jest(klucz): return klucz in kroki['nowe'] or klucz in kroki['sa']
    def stl(nazwa, m):
        bpy.ops.wm.stl_import(filepath=os.path.join(DIR, nazwa + '.stl'))
        o = bpy.context.selected_objects[0]; o.name = nazwa; o.data.materials.append(m)
        return wez(o)
    def box(nazwa, x0, x1, y0, y1, z0, z1, m, parent=None):
        bpy.ops.mesh.primitive_cube_add(size=1, location=((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2))
        o = bpy.context.object; o.name = nazwa; o.scale = (x1 - x0, y1 - y0, z1 - z0); o.data.materials.append(m)
        o.parent = parent or root; return o
    def cyl(nazwa, c0, c1, r, m, parent=None, v=32):
        c0, c1 = Vector(c0), Vector(c1); d = c1 - c0
        bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=d.length, vertices=v, location=(c0 + c1) / 2)
        o = bpy.context.object; o.name = nazwa; o.rotation_mode = 'QUATERNION'; o.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(d.normalized())
        o.data.materials.append(m); o.parent = parent or root; return o
    def pusty(nazwa, loc=(0, 0, 0), R=None):
        e = bpy.data.objects.new(nazwa, None); sc.collection.objects.link(e); wez(e); e.location = loc; e.rotation_mode = 'QUATERNION'
        if R is not None: e.rotation_quaternion = R.to_quaternion()
        return e

    psi, th, g, d = pozycja
    st = K.stan(psi, th, g, d, 0, 0, None, None)
    Rg = Matrix(st['Rg']).to_4x4()
    if jest('plyta'): stl('Plyta', m_('plyta', 'plyta'))
    if jest('galka'):
        o = stl('Galka', m_('galka', 'galka')); o.rotation_mode = 'QUATERNION'; o.rotation_quaternion = Rg.to_quaternion()
    if jest('pg'):
        o = stl('PowiekaGorna', m_('pg', 'pow')); o.rotation_mode = 'QUATERNION'; o.rotation_quaternion = Matrix(st['RG']).to_4x4().to_quaternion()
    if jest('pd'):
        o = stl('PowiekaDolna', m_('pd', 'pow')); o.rotation_mode = 'QUATERNION'; o.rotation_quaternion = Matrix(st['RD']).to_4x4().to_quaternion()
    # trzpienie kardana (PLA z rdzeniem M3): kołnierz Ø9,3 × 5,2 w gnieździe, trzpień Ø4,95 do czubka 7,25 przed czołem gniazda; krok 1
    kz, kh, tl = P.get('kol_zP', -14.25), 5.2, 7.25
    if jest('trz_slup'): cyl('kołnierz trzpienia słupka', (0, 0, kz - kh), (0, 0, kz), 4.65, m_('trz_slup', 'plyta')); cyl('trzpień słupka', (0, 0, kz), (0, 0, kz + tl), 2.475, m_('trz_slup', 'plyta'))
    przod = pusty('kardan przód (z gałką)', R=Rg)
    pz = P.get('piasta_z', 14)
    if jest('trz_galka'): cyl('kołnierz trzpienia gałki', (0, 0, pz), (0, 0, pz + kh), 4.65, m_('trz_galka', 'galka'), przod); cyl('trzpień gałki', (0, 0, pz - tl), (0, 0, pz), 2.475, m_('trz_galka', 'galka'), przod)
    if jest('kardan'):
        mk = m_('kardan', 'kard')
        cyl('kardan piasta tylna', (0, 0, -12.75), (0, 0, -4.5), 5.5, mk)
        for s in (1, -1): box('kardan widełki tylne', -2.5, 2.5, s * 3.3, s * 5.5, -5, 2.5, mk)
        krzyz = pusty('kardan krzyżak', R=Matrix(kin.Ry(psi)).to_4x4())
        box('krzyżak', -2.2, 2.2, -2.2, 2.2, -2.2, 2.2, mk, krzyz)
        cyl('krzyżak sworzeń pion', (0, -5.3, 0), (0, 5.3, 0), 1.3, mk, krzyz)
        cyl('krzyżak sworzeń poziom', (-5.3, 0, 0), (5.3, 0, 0), 1.3, mk, krzyz)
        cyl('kardan piasta przednia', (0, 0, 4.5), (0, 0, 12.75), 5.5, mk, przod)
        for s in (1, -1): box('kardan widełki przednie', s * 3.3, s * 5.5, -2.5, 2.5, -2.5, 5, mk, przod)
        cyl('wkręt M4 piasty przedniej', (-5.3, 0, 9.1), (-6.3, 0, 9.1), 2.0, M['sruba'], przod)
        cyl('wkręt M4 piasty tylnej', (0, 5.3, -9.1), (0, 6.3, -9.1), 2.0, M['sruba'])
    # serwa MG90S jak w duze-oko-v3-blender.py
    if jest('s_lp'):
        box('serwo L–P', L[0] - 6.25, L[0] + 6.25, -33, -10.5, L[2] + 5.5 - 22.8, L[2] + 5.5, m_('s_lp', 'serwo'))
        cyl('wieżyczka L–P', (L[0], -10.5, L[2]), (L[0], -2, L[2]), 5.9, m_('s_lp', 'serwo'))
    if jest('s_gd'):
        box('serwo G–D', -33, -10.5, -15, 7.8, G[2] - 6.25, G[2] + 6.25, m_('s_gd', 'serwo'))
        cyl('wieżyczka G–D', (-10.5, G[1], G[2]), (-1, G[1], G[2]), 5.9, m_('s_gd', 'serwo'))
    if jest('s_pg'):
        box('serwo powieki górnej', 15.5, 38, -15, 7.8, PG[2] - 6.25, PG[2] + 6.25, m_('s_pg', 'serwo'))
        cyl('wieżyczka powieki górnej', (15.5, PG[1], PG[2]), (6, PG[1], PG[2]), 5.9, m_('s_pg', 'serwo'))
    if jest('s_pd'):
        box('serwo powieki dolnej', -38, -15.5, -15, 7.8, PD[2] - 6.25, PD[2] + 6.25, m_('s_pd', 'serwo'))
        cyl('wieżyczka powieki dolnej', (-15.5, PD[1], PD[2]), (-6, PD[1], PD[2]), 5.9, m_('s_pd', 'serwo'))
    def orczyk(nazwa, os_kier, c, ramie, dl, gr, m, kat):
        e = pusty(nazwa + ' oś', c, Matrix.Rotation(rad(kat), 4, Vector(os_kier)))
        bpy.ops.mesh.primitive_cube_add(size=1); o = bpy.context.object; o.name = nazwa
        a = Vector(ramie).normalized(); n = Vector(os_kier).normalized(); b = n.cross(a)
        Mx = Matrix(((a.x, b.x, n.x, 0), (a.y, b.y, n.y, 0), (a.z, b.z, n.z, 0), (0, 0, 0, 1)))
        o.data.transform(Mx @ Matrix.Translation((dl / 2 - 3, 0, 0)) @ Matrix.Diagonal((dl + 6, 5, gr, 1)))
        o.data.materials.append(m); o.parent = e
        cyl(nazwa + ' piasta', -n * gr, n * gr * 1.5, 3.5, m, e)
        return e
    if jest('o_lp'): orczyk('orczyk L–P', (0, 1, 0), (L[0], 0.5, L[2]), (-1, 0, 0), P['orcz_LP'], 1.6, m_('o_lp', 'orcz'), st['aLP'])
    if jest('o_gd'): orczyk('orczyk G–D', (1, 0, 0), (0.5, G[1], G[2]), (0, 1, 0), P['orcz_GD'], 1.6, m_('o_gd', 'orcz'), st['aGD'])
    if jest('o_pg'): orczyk('przedłużenie powieki górnej', (1, 0, 0), (P['pG_x_orcz'], PG[1], PG[2]), (0, 1, 0), P['orcz_pow'], 2.5, m_('o_pg', 'prz'), st['aG'])
    if jest('o_pd'): orczyk('przedłużenie powieki dolnej', (1, 0, 0), (P['pD_x_orcz'], PD[1], PD[2]), (0, -1, 0), P['orcz_pow'], 2.5, m_('o_pd', 'prz'), -st['aD'])
    if jest('osie'):
        for s in (1, -1): cyl('oś powiek Ø2', (s * 31.6, 0, 0), (s * 37.2, 0, 0), 1.0, m_('osie', 'os_'))

    # druty „Z”: ogon przy gałce i orczyku równoległy do odcinka głównego, od niego; w uszku powieki równoległy do drutu, ku serwu
    def drut(nazwa, pts, m):
        cu = bpy.data.curves.new(nazwa, 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = P.get('drut_d', 1.0) / 2; cu.bevel_resolution = 3; cu.use_fill_caps = True
        sp = cu.splines.new('POLY'); sp.points.add(len(pts) - 1)
        for i, q in enumerate(pts): sp.points[i].co = (q.x, q.y, q.z, 1)
        o = bpy.data.objects.new(nazwa, cu); o.data.materials.append(m); sc.collection.objects.link(o); wez(o)
    def koniec(otw, n, ods, dalej, uszko=False):
        """Punkty jednego końca „Z” od ogona do zagięcia przy odcinku głównym."""
        otw, n = Vector(otw), Vector(n).normalized(); zag = otw + n * ods; c = otw - n * (NOGA - ods)
        return [c + (zag - Vector(dalej)).normalized() * (-OGON if uszko else OGON), c, zag]   # w uszku ogon ku serwu
    def drut_Z(nazwa, a, na, ods_a, b, nb, m, uszko=False):
        b1 = Vector(b) + Vector(nb).normalized() * P['orcz_ods']
        A = koniec(a, na, ods_a, b1, uszko); B_ = koniec(b, nb, P['orcz_ods'], A[-1])
        drut(nazwa, A + B_[::-1], m)
    if jest('d_lp'): drut_Z('pręt L–P', st['otwLP'], st['nLP'], (Vector(st['pretLP'][0]) - Vector(st['otwLP'])).length, st['pretLP'][1], (0, 1, 0), m_('d_lp', 'drut'))
    if jest('d_gd'): drut_Z('pręt G–D', st['otwGD'], st['nGD'], (Vector(st['pretGD'][0]) - Vector(st['otwGD'])).length, st['pretGD'][1], (-1, 0, 0), m_('d_gd', 'drut'))
    if jest('d_pg'): drut_Z('drut powieki górnej', st['drutG'][0], (1, 0, 0), P['pow_ods'], st['drutG'][1], (1, 0, 0), m_('d_pg', 'drut'), True)
    if jest('d_pd'): drut_Z('drut powieki dolnej', st['drutD'][0], (-1, 0, 0), P['pow_ods'], st['drutD'][1], (-1, 0, 0), m_('d_pd', 'drut'), True)

    # narzędzia: wkrętak (grot do celu, trzon wzdłuż kierunku przeciwnego do ruchu), imbus L
    for nz in kroki.get('narz', []):
        if nz[0] == 'wkretak':
            _, tip, kier = nz; tip, k = Vector(tip), Vector(kier).normalized()
            cyl('wkrętak trzon', tip, tip - k * 55, 1.5, M['narz']); cyl('wkrętak rękojeść', tip - k * 55, tip - k * 95, 9, M['rek'])
        elif nz[0] == 'imbus':
            pts = [Vector(p) for p in nz[1]]
            for a, b in zip(pts, pts[1:]): cyl('imbus', a, b, 1.0, M['narz'], v=6)

    def B(p): return Vector((p[0], -p[2], p[1]))   # model (x, y, z) → Blender (x, −z, y)
    cel_, oko_, lens = kamera
    cel = bpy.data.objects.new('cel', None); sc.collection.objects.link(cel); cel.location = B(cel_)
    cam = bpy.data.cameras.new('kamera'); cam.lens = lens; cam.clip_start = 1; cam.clip_end = 5000
    co = bpy.data.objects.new('kamera', cam); sc.collection.objects.link(co); sc.camera = co; co.location = B(oko_)
    tr = co.constraints.new('TRACK_TO'); tr.target = cel; tr.track_axis = 'TRACK_NEGATIVE_Z'; tr.up_axis = 'UP_Y'
    for loc, e in (((-150, 150, 250), 0.6e6), ((200, -150, 150), 0.35e6), ((0, 250, -50), 0.25e6), ((0, -250, 100), 0.25e6)):
        l = bpy.data.lights.new('l', 'POINT'); l.energy = e; lo = bpy.data.objects.new('l', l); lo.location = loc; sc.collection.objects.link(lo)
    w = bpy.data.worlds.new('w'); w.use_nodes = True; w.node_tree.nodes['Background'].inputs['Color'].default_value = (0.36, 0.36, 0.39, 1); sc.world = w
    sc.render.engine = 'BLENDER_EEVEE' if 'BLENDER_EEVEE' in [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties['engine'].enum_items] else 'BLENDER_EEVEE_NEXT'
    sc.render.resolution_x, sc.render.resolution_y = 1200, 900
    if hasattr(sc, 'eevee'):
        for atr, w_ in (('taa_render_samples', int(os.environ.get('PROBKI', '32'))), ('use_raytracing', False)):
            if hasattr(sc.eevee, atr):
                try: setattr(sc.eevee, atr, w_)
                except Exception: pass
    sc.view_settings.view_transform = 'Standard'
    sc.render.image_settings.file_format = 'JPEG'; sc.render.image_settings.quality = 82   # lekkie obrazy na telefon
    sc.render.filepath = os.path.join(OUT, nazwa + '.jpg')
    bpy.ops.render.render(write_still=True)
    print('OBRAZ', nazwa)

# ---- kroki §5 ----
OTW, ZAMK = 51.5, 0
BAZA = {'plyta', 'trz_slup'}
PO2 = {'o_lp', 'o_gd', 'o_pg', 'o_pd'}   # orczyki z przedłużeniami gotowe po kroku 2 (montowane w krokach 6, 8, 9)
PO3 = BAZA | {'s_gd', 's_pg', 's_pd'}
PO5 = PO3 | {'kardan', 'galka', 'trz_galka'}
PO6 = PO5 | {'d_gd', 'o_gd'}
PO7 = PO6 | {'pg', 'pd', 'osie'}
PO8 = PO7 | {'d_pg', 'd_pd', 'o_pg', 'o_pd'}
UJECIA = {
    # nazwa: (zamontowane, nowe, narzędzia, pozycja, (cel, oko, ogniskowa), półprzezroczyste)
    'krok1':        ({'plyta'}, {'trz_slup'}, [], (0, 0, OTW, OTW), ((0, 0, -15), (60, 45, 45), 50), ()),
    'krok1-galka':  ({'galka'}, {'trz_galka'}, [], (0, 0, OTW, OTW), ((0, 0, 5), (70, 55, -95), 55), ('galka',)),
    'krok2':        (set(), PO2, [], (0, 0, ZAMK, ZAMK), ((10, -5, -80), (110, 60, -30), 50), ()),
    'krok3':        (BAZA, {'s_gd', 's_pg', 's_pd'}, [], (0, 0, OTW, OTW), ((0, -5, -70), (-120, 95, -160), 45), ()),
    'krok4':        (PO3, {'kardan'}, [('imbus', [(0, 7, -9.1), (0, 30, -9.1), (14, 30, -9.1)])], (0, 0, OTW, OTW), ((0, 8, -8), (60, 60, 40), 55), ()),
    'krok5':        (PO3 | {'kardan', 'trz_galka'}, {'galka'}, [('imbus', [(-6.8, 0, 9.1), (-18, 0, 9.1), (-18, 0, -75)])], (0, 0, OTW, OTW),
                     ((-10, 0, -25), (-140, 70, -120), 45), ('galka',)),
    'krok6':        (PO5, {'d_gd', 'o_gd'}, [('wkretak', (3.5, G[1], G[2]), (-1, 0, 0))], (0, 0, OTW, OTW), ((10, 5, -40), (140, 80, -100), 45), ()),
    'krok6-zaczep': (PO5, {'d_gd'}, [], (0, 0, OTW, OTW), ((0, 13, -5), (-45, 55, -60), 55), ('galka',)),
    'krok7':        (PO6, {'pg', 'pd', 'osie'}, [], (0, 0, OTW, OTW), ((15, 5, -10), (150, 110, 70), 45), ()),
    'krok7-os':     (PO6, {'pg', 'pd', 'osie'}, [], (0, 0, OTW, OTW), ((34, 0, 0), (130, 35, 60), 55), ()),
    'krok8':        (PO7, {'d_pg', 'd_pd', 'o_pg', 'o_pd'}, [('wkretak', (P['pG_x_orcz'] - 3.5, PG[1], PG[2]), (1, 0, 0)),
                     ('wkretak', (P['pD_x_orcz'] + 3.5, PD[1], PD[2]), (-1, 0, 0))], (0, 0, ZAMK, ZAMK), ((0, 0, -55), (180, 110, -40), 40), ()),
    'krok8-uszko':  (PO7, {'d_pg'}, [], (0, 0, ZAMK, ZAMK), ((5, 33, -2), (40, 75, -45), 60), ()),
    'krok9':        (PO8, {'s_lp', 'd_lp', 'o_lp'}, [('wkretak', (L[0], 3.5, L[2]), (0, -1, 0))], (0, 0, ZAMK, ZAMK), ((15, 0, -45), (150, 170, -170), 45), ()),
}
os.makedirs(OUT, exist_ok=True)
for n, (sa, nowe, narz, poz, kam, przezr) in UJECIA.items():
    if WYBRANE and n not in WYBRANE: continue
    scena(dict(sa=sa - nowe, nowe=nowe, narz=narz), poz, kam, n, przezr)
print('KONIEC')
