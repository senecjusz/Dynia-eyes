# Duże oko v3: przemiatanie kolizji na siatkach z OpenSCAD, z ruchem (Blender w tle, mathutils.bvhtree).
# Użycie: blender -b -P duze-oko-v3-przemiatanie.py -- <katalog STL złożenia z parametry.json (eksport-v3.sh)> <plik wyniku .txt>
# Metoda:
#  - przenikanie siatka–siatka: BVHTree.overlap (przecięcie trójkątów) – wynik „KOLIZJA”;
#  - luz siatka–siatka: najmniejsza odległość wierzchołków A od powierzchni B i odwrotnie (find_nearest); siatki z OpenSCAD
#    mają gęste wierzchołki na powierzchniach krzywych, płaskie ściany są dzielone do ≤ 1,5 mm przed pomiarem;
#  - pręty, druty i orczyki: odcinki próbkowane co 0,25 mm, luz = odległość osi od powierzchni − promień;
#  - kardan: piasta tylna nieruchoma (walec Ø11, z −12,75…0), przednia z gałką (walec Ø11, z 0…+12,75);
#  - serwa MG90S: prostopadłościany korpusów i walce wieżyczek (rysunek Miuzei).
# Zakres: gałka psi −35…+35 co 5°, theta −25…+25 co 5° (z narożnikami); powieki 0 / 17 / 34 / 51,5°.
import bpy, bmesh, sys, os, json, math, itertools
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree
argv = sys.argv[sys.argv.index('--') + 1:]
DIR, WYN = argv[0], argv[1]
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import duze_oko_v3_kinematyka as kin
K = kin.wczytaj(os.path.join(DIR, 'parametry.json'))
P = K.P

def wczytaj_stl(nazwa, podzial=1.5):
    bpy.ops.wm.stl_import(filepath=os.path.join(DIR, nazwa + '.stl'))
    o = bpy.context.selected_objects[0]
    bm = bmesh.new(); bm.from_mesh(o.data)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-4)
    for _ in range(6):   # dzielenie długich krawędzi (gęstsze wierzchołki na płaskich ścianach)
        dl = [e for e in bm.edges if e.calc_length() > podzial]
        if not dl: break
        bmesh.ops.subdivide_edges(bm, edges=dl, cuts=1, use_grid_fill=False)
        bmesh.ops.triangulate(bm, faces=bm.faces)
    V = [v.co.copy() for v in bm.verts]; F = [[v.index for v in f.verts] for f in bm.faces]
    bm.free(); bpy.data.objects.remove(o)
    return V, F
def walec(c0, c1, r, n=24):
    c0, c1 = Vector(c0), Vector(c1); ax = (c1 - c0); L = ax.length; ax.normalize()
    u = ax.orthogonal().normalized(); w = ax.cross(u)
    V, F = [], []
    nz = max(2, int(L / 1.0) + 1)
    for i in range(nz):
        p = c0 + ax * (L * i / (nz - 1))
        for k in range(n):
            a = 2 * math.pi * k / n; V.append(p + r * (math.cos(a) * u + math.sin(a) * w))
    for i in range(nz - 1):
        for k in range(n):
            a, b = i * n + k, i * n + (k + 1) % n; F.append([a, b, b + n, a + n])
    V += [c0, c1]; ic0, ic1 = len(V) - 2, len(V) - 1
    for k in range(n): F.append([ic0, (k + 1) % n, k]); F.append([ic1, (nz - 1) * n + k, (nz - 1) * n + (k + 1) % n])
    return V, F
def pudlo(x0, x1, y0, y1, z0, z1, krok=1.5):
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts: v.co = Vector(((x0 + x1) / 2 + v.co.x * (x1 - x0), (y0 + y1) / 2 + v.co.y * (y1 - y0), (z0 + z1) / 2 + v.co.z * (z1 - z0)))
    for _ in range(6):
        dl = [e for e in bm.edges if e.calc_length() > krok]
        if not dl: break
        bmesh.ops.subdivide_edges(bm, edges=dl, cuts=1, use_grid_fill=False); bmesh.ops.triangulate(bm, faces=bm.faces)
    V = [v.co.copy() for v in bm.verts]; F = [[v.index for v in f.verts] for f in bm.faces]; bm.free(); return V, F
def suma(*ms):
    V, F = [], []
    for v, f in ms: o = len(V); V += v; F += [[i + o for i in ff] for ff in f]
    return V, F

# ---- części ----
CZ = {}
CZ['Galka'] = wczytaj_stl('Galka', 2.0)
CZ['PowiekaGorna'] = wczytaj_stl('PowiekaGorna', 1.5)
CZ['PowiekaDolna'] = wczytaj_stl('PowiekaDolna', 1.5)
CZ['Plyta'] = wczytaj_stl('Plyta', 1.0)
CZ['Tuba50'] = wczytaj_stl('Tuba50', 2.0)
CZ['KardanTyl'] = walec((0, 0, -12.75), (0, 0, 0), 5.5)
CZ['KardanPrzod'] = walec((0, 0, 0), (0, 0, 12.75), 5.5)
L, G, PG, PD = P['LP_wal'], P['GD_wal'], P['PG_wal'], P['PD_wal']
W, H, Ls, wal, czub = 12.5, 22.5, 22.8, 5.5, 35.0
# korpusy serw (jak w modelu SCAD) + wieżyczki (walec r 5,9, 4,5 nad korpusem) + wałek (r 2,4 do czubka)
CZ['SerwoLP'] = suma(pudlo(L[0] - W / 2, L[0] + W / 2, -33, -10.5, L[2] + wal - Ls, L[2] + wal),
                     walec((L[0], -10.5, L[2]), (L[0], -6, L[2]), 5.9), walec((L[0], -6, L[2]), (L[0], 2, L[2]), 2.4))
CZ['SerwoGD'] = suma(pudlo(-33, -10.5, -15, 7.8, G[2] - W / 2, G[2] + W / 2),
                     walec((-10.5, G[1], G[2]), (-6, G[1], G[2]), 5.9), walec((-6, G[1], G[2]), (2, G[1], G[2]), 2.4))
CZ['SerwoPG'] = suma(pudlo(15.5, 38, -15, 7.8, PG[2] - W / 2, PG[2] + W / 2),
                     walec((15.5, PG[1], PG[2]), (11, PG[1], PG[2]), 5.9), walec((11, PG[1], PG[2]), (3, PG[1], PG[2]), 2.4))
CZ['SerwoPD'] = suma(pudlo(-38, -15.5, -15, 7.8, PD[2] - W / 2, PD[2] + W / 2),
                     walec((-15.5, PD[1], PD[2]), (-11, PD[1], PD[2]), 5.9), walec((-11, PD[1], PD[2]), (-3, PD[1], PD[2]), 2.4))
STALE = ['Plyta', 'Tuba50', 'KardanTyl', 'SerwoLP', 'SerwoGD', 'SerwoPG', 'SerwoPD']

def drzewo(nazwa, M=None):
    V, F = CZ[nazwa]
    if M is not None: V = [M @ v for v in V]
    return BVHTree.FromPolygons(V, F, epsilon=0.0), V
def mat3(R): return Matrix(R)
def luz(tA, VA, tB, VB):
    best = 1e9; gdzie = None
    for (t, Vs) in ((tB, VA), (tA, VB)):
        for v in Vs:
            r = t.find_nearest(v)
            if r[0] is not None and r[3] < best: best, gdzie = r[3], r[0]
    return best, gdzie
KIER = Vector((0.5774, 0.5771, 0.5777)).normalized()
def wewnatrz(t, p):
    # odległość od powierzchni; znak z parzystości przecięć promienia (tylko blisko powierzchni – ścianki części są cienkie)
    r = t.find_nearest(p)
    if r[0] is None: return False, 1e9
    if r[3] > 3.0: return False, r[3]
    n, q = 0, Vector(p)
    for _ in range(200):
        h = t.ray_cast(q, KIER)
        if h[0] is None: break
        n += 1; q = h[0] + KIER * 1e-4
    return n % 2 == 1, r[3]
def odcinek_luz(t, a, b, r, wyklucz=None, krok=0.25):
    a, b = Vector(a), Vector(b); n = max(2, int((b - a).length / krok) + 1); best = 1e9; gdzie = None
    for i in range(n):
        p = a + (b - a) * (i / (n - 1))
        if wyklucz and any((p - c).length < rr for c, rr in wyklucz): continue
        ins, d = wewnatrz(t, p)
        d = -d if ins else d
        if d - r < best: best, gdzie = d - r, p
    return best, gdzie
def odc_odc(a, b, c, d):   # odległość dwóch odcinków (próbkowanie)
    a, b, c, d = map(Vector, (a, b, c, d)); best = 1e9
    for i in range(41):
        p = a + (b - a) * (i / 40)
        for j in range(41):
            q = c + (d - c) * (j / 40); best = min(best, (p - q).length)
    return best

WYMOG = 0.5; WYMOG_OS = 0.2    # tabela AGENTS: ruchome obok siebie ≥ 0,5; osiowo na osi zawiasu 0,2–0,3
wyniki = {}
def zapisz(para, d, stan, gdzie, wymog=WYMOG, kol=False):
    w = wyniki.get(para)
    if w is None or d < w['d']:
        wyniki[para] = dict(d=d, stan=stan, gdzie=None if gdzie is None else [round(x, 2) for x in gdzie], wymog=wymog, kol=kol or (w or {}).get('kol', False))
    elif kol: wyniki[para]['kol'] = True

T_stale = {n: drzewo(n) for n in STALE}
PSI = range(-35, 36, 5); THETA = range(-25, 26, 5); POW = (0, 17, 34, 51.5)
pierw = {}
TPOW = {}
for a in POW:
    TPOW[('G', a)] = drzewo('PowiekaGorna', mat3(kin.Rx(-a)).to_4x4()); TPOW[('D', a)] = drzewo('PowiekaDolna', mat3(kin.Rx(a)).to_4x4())
r_dr = 0.5   # promień drutu Ø1,0
r_orcz = 2.5 # połowa szerokości orczyka (pas wokół osi orczyka)
lugB_LP, lugB_GD = Vector(K.lugLP), Vector(K.lugGD)
for psi, th in itertools.product(PSI, THETA):
    st = K.stan(psi, th)
    Rg = mat3(st['Rg']).to_4x4()
    tG, VG = drzewo('Galka', Rg); tKP, VKP = drzewo('KardanPrzod', Rg)
    s = f'psi {psi:+d}, theta {th:+d}'
    for n in ('Plyta', 'Tuba50', 'KardanTyl'):
        t, V = T_stale[n]
        kol = bool(tG.overlap(t)); d, g = luz(tG, VG, t, V); zapisz(f'Galka–{n}', -1 if kol else d, s, g, kol=kol)
    t, V = T_stale['Plyta']; kol = bool(tKP.overlap(t)); d, g = luz(tKP, VKP, t, V); zapisz('KardanPrzod–Plyta', -1 if kol else d, s, g, kol=kol)
    # pręty gałki
    for nm, (a, b), lug in (('PretLP', st['pretLP'], lugB_LP), ('PretGD', st['pretGD'], lugB_GD)):
        wyk = [(Rg @ lug, 6.0)]   # własny języczek: drut z „Z” leży obok języczka (odsadzenie 1,75), styk w zaczepie zamierzony
        d, g = odcinek_luz(tG, a, b, r_dr, wyklucz=wyk); zapisz(f'{nm}–Galka', d, s, g)
        for n in ('Plyta', 'Tuba50', 'KardanTyl', 'SerwoLP', 'SerwoGD', 'SerwoPG', 'SerwoPD'):
            d, g = odcinek_luz(T_stale[n][0], a, b, r_dr); zapisz(f'{nm}–{n}', d, s, g)
    zapisz('PretLP–PretGD', odc_odc(*st['pretLP'], *st['pretGD']) - 2 * r_dr, s, None)
    # orczyki L–P, G–D (pas o promieniu 2,5 wokół osi ramienia; bez własnego serwa)
    for nm, (a, b), wlasne in (('OrczykLP', st['orczLP'], 'SerwoLP'), ('OrczykGD', st['orczGD'], 'SerwoGD')):
        for n in ('Plyta', 'SerwoLP', 'SerwoGD', 'SerwoPG', 'SerwoPD'):
            if n == wlasne: continue
            d, g = odcinek_luz(T_stale[n][0], a, b, r_orcz, krok=0.5); zapisz(f'{nm}–{n}', d, s, g)
    zapisz('OrczykLP–PretGD', odc_odc(*st['orczLP'], *st['pretGD']) - r_orcz - r_dr, s, None)
    zapisz('OrczykGD–PretLP', odc_odc(*st['orczGD'], *st['pretLP']) - r_orcz - r_dr, s, None)
    # powieki w kilku położeniach wobec gałki i prętów
    for g_, d_ in itertools.product(POW, POW):
        sp = K.stan(psi, th, g_, d_)
        sp_s = s + f', powieki G {g_}, D {d_}'
        tPG, VPG = TPOW[('G', g_)]; tPD, VPD = TPOW[('D', d_)]
        for nm, t, V in (('PowiekaGorna', tPG, VPG), ('PowiekaDolna', tPD, VPD)):
            if abs(psi) in (0, 35) and abs(th) in (0, 25):   # czasze współśrodkowe: luz zależy tylko od języczków i krawędzi
                kol = bool(tG.overlap(t)); d, gg = luz(tG, VG, t, V); zapisz(f'Galka–{nm}', -1 if kol else d, sp_s, gg, kol=kol)
            for pn in ('pretLP', 'pretGD'):
                a, b = sp[pn]; d, gg = odcinek_luz(t, a, b, r_dr); zapisz(f'{"PretLP" if pn == "pretLP" else "PretGD"}–{nm}', d, sp_s, gg)
        # druty powiek wobec gałki
        for nm, (a, b), lugW in (('DrutG', sp['drutG'], Vector(sp['drutG'][0])), ('DrutD', sp['drutD'], Vector(sp['drutD'][0]))):
            d, gg = odcinek_luz(tG, a, b, r_dr); zapisz(f'{nm}–Galka', d, sp_s, gg)
            for pn in ('pretLP', 'pretGD'):
                zapisz(f'{nm}–{"PretLP" if pn == "pretLP" else "PretGD"}', odc_odc(a, b, *sp[pn]) - 2 * r_dr, sp_s, None)
    print('stan', s, flush=True)

# powieki: wzajemnie i wobec części nieruchomych; druty i orczyki powiek
for g_, d_ in itertools.product((0, 8, 17, 26, 34, 43, 51.5), repeat=2):
    sp = K.stan(0, 0, g_, d_); s = f'powieki G {g_}, D {d_}'
    RG, RD = mat3(sp['RG']).to_4x4(), mat3(sp['RD']).to_4x4()
    tPG, VPG = drzewo('PowiekaGorna', RG); tPD, VPD = drzewo('PowiekaDolna', RD)
    kol = bool(tPG.overlap(tPD)); d, g = luz(tPG, VPG, tPD, VPD); zapisz('PowiekaGorna–PowiekaDolna', -1 if kol else d, s, g, wymog=WYMOG_OS, kol=kol)
    for nm, t, V in (('PowiekaGorna', tPG, VPG), ('PowiekaDolna', tPD, VPD)):
        for n in ('Plyta', 'Tuba50', 'KardanTyl'):
            tt, VV = T_stale[n]; kol = bool(t.overlap(tt)); d, g = luz(t, V, tt, VV)
            zapisz(f'{nm}–{n}', -1 if kol else d, s, g, wymog=WYMOG_OS if n == 'Plyta' else WYMOG, kol=kol)
    for nm, (a, b), wlasna, inna in (('DrutG', sp['drutG'], (tPG, VPG), (tPD, VPD)), ('DrutD', sp['drutD'], (tPD, VPD), (tPG, VPG))):
        d, g = odcinek_luz(inna[0], a, b, r_dr); zapisz(f'{nm}–{"PowiekaDolna" if nm == "DrutG" else "PowiekaGorna"}', d, s, g)
        d, g = odcinek_luz(wlasna[0], a, b, r_dr, wyklucz=[(Vector(a), 6.0)]); zapisz(f'{nm}–{"PowiekaGorna" if nm == "DrutG" else "PowiekaDolna"}(poza uszkiem)', d, s, g)
        for n in ('Plyta', 'Tuba50', 'SerwoLP', 'SerwoGD', 'SerwoPG', 'SerwoPD'):
            d, g = odcinek_luz(T_stale[n][0], a, b, r_dr); zapisz(f'{nm}–{n}', d, s, g)
    for nm, (a, b), wlasne in (('OrczykG', sp['orczG'], 'SerwoPG'), ('OrczykD', sp['orczD'], 'SerwoPD')):
        for n in ('Plyta', 'SerwoLP', 'SerwoGD', 'SerwoPG', 'SerwoPD'):
            if n == wlasne: continue
            d, g = odcinek_luz(T_stale[n][0], a, b, r_orcz, krok=0.5); zapisz(f'{nm}–{n}', d, s, g)
    zapisz('DrutG–DrutD', odc_odc(*sp['drutG'], *sp['drutD']) - 2 * r_dr, s, None)
    print('powieki', s, flush=True)
# orczyki powiek wobec prętów i orczyków gałki (skrajne położenia gałki)
for psi, th, g_ in itertools.product((-35, 0, 35), (-25, 0, 25), (0, 17, 34, 51.5)):
    sp = K.stan(psi, th, g_, g_); s = f'psi {psi:+d}, theta {th:+d}, powieki {g_}'
    for a1, n1 in ((sp['orczG'], 'OrczykG'), (sp['orczD'], 'OrczykD'), (sp['drutG'], 'DrutG'), (sp['drutD'], 'DrutD')):
        for a2, n2 in ((sp['orczLP'], 'OrczykLP'), (sp['orczGD'], 'OrczykGD')):
            r1 = r_orcz if n1.startswith('Orczyk') else r_dr
            zapisz(f'{n1}–{n2}', odc_odc(*a1, *a2) - r1 - r_orcz, s, None)

# ---- raport ----
lin = ['Duże oko v3 – przemiatanie kolizji na siatkach (Blender BVHTree). Luz w mm; ujemny = przenikanie.',
       f'Zakres: gałka psi −35…+35, theta −25…+25 co 5° (narożniki włącznie), powieki 0…51,5°. Wymóg: {WYMOG} (osiowo w zawiasie {WYMOG_OS}).', '']
zle = 0
for para in sorted(wyniki, key=lambda p: wyniki[p]['d']):
    w = wyniki[para]; ok = w['d'] >= w['wymog'] and not w['kol']
    if not ok: zle += 1
    lin.append(f"{'OK ' if ok else 'ZLE'} {para:44s} {('KOLIZJA' if w['kol'] else f'{w['d']:7.2f}')}  (wymóg {w['wymog']})  przy: {w['stan']}  miejsce: {w['gdzie']}")
lin.append(''); lin.append(f'Par poniżej wymogu: {zle} z {len(wyniki)}')
open(WYN, 'w', encoding='utf-8').write('\n'.join(lin) + '\n')
json.dump(wyniki, open(os.path.splitext(WYN)[0] + '.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('\n'.join(lin))
