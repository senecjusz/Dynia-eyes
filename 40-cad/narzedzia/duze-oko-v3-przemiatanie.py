# Duże oko v3: przemiatanie kolizji na siatkach z OpenSCAD, z ruchem (Blender w tle, mathutils.bvhtree).
# Użycie: blender -b -P duze-oko-v3-przemiatanie.py -- <katalog STL złożenia z parametry.json (eksport-v3.sh)> <plik wyniku .txt>
#
# Co liczy:
#  - przenikanie siatka–siatka: BVHTree.overlap (przecięcie trójkątów) – wynik „KOLIZJA”;
#  - luz siatka–siatka: najmniejsza odległość wierzchołków A od powierzchni B i odwrotnie (find_nearest); krawędzie siatek
#    dzielone przed pomiarem do ≤ 1–2 mm, więc minimum krawędź–krawędź jest przybliżone z dokładnością do ok. połowy tego kroku;
#  - druty Ø1,0 jako łamane z zakończeniami „Z”: noga przez otwór (wzdłuż osi otworu) do zagięcia, odcinek główny, noga przez
#    drugi otwór; odsadzenie nogi w języczkach gałki zacz_ods (4,0), w orczykach 1,75, w uszkach powiek pow_ods (2,5); przechył nogi w otworze
#    dwustożkowym liczy osobno duze_oko_v3_kinematyka.py (wymagany wobec dopuszczalnego), tu noga jest sztywna wzdłuż osi otworu; próbkowanie co 0,25 mm; luz = odległość osi od powierzchni − 0,5;
#  - orczyki i przedłużenia jako pas o promieniu 2,5 wokół osi ramienia (od osi wałka do otworu + 3 mm);
#  - serwa MG90S w pełnej obwiedni z rysunku Miuzei: korpus 22,8 × 12,5 × 22,5, uszy 4,5 × 12,5 × 2 na wysokości 18–20,
#    wieżyczka r 5,9 do 27, wałek r 2,4 do 35; kardan: piasta tylna nieruchoma i przednia z gałką (walce Ø11).
# Pary nieruchome: serwo–serwo (wymóg 0,5) i serwo–płyta (serwa zmniejszone o 0,05 na stronę: styk korpusu i uszu z płytą
#   jest zamierzony, sprawdzane jest tylko przenikanie i luz uszu w szczelinach).
# Ruch: gałka psi −35…+35 × theta −25…+25 co 5° (165 położeń, z narożnikami); powieki 0 / 17 / 34 / 51,5° niezależnie
#   wobec gałki i prętów we wszystkich 165 położeniach; powieki wobec siebie i części nieruchomych co 8,6° (7 × 7).
# Wyłączenia (styki zamierzone): drut w otworze własnego zaczepu (odcinek przez otwór i 2,5 mm od zagięcia);
#   uszy powiek na osi zawiasu (luz osiowy 0,2–0,3 sprawdzany osobno, wymóg 0,2).
# Nie obejmuje: kabli serw (poza przejściem w płycie), rzeczywistego kształtu orczyków (tylko pas r 2,5), łbów wkrętów orczyków,
#   widełek i krzyżaka kardana (tylko walce Ø11), luzów w przegubach i ugięcia drutów, położeń pośrednich między krokami siatki.
import bpy, bmesh, sys, os, json, math, itertools
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree
argv = sys.argv[sys.argv.index('--') + 1:]
DIR, WYN = argv[0], argv[1]
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import duze_oko_v3_kinematyka as kin
K = kin.wczytaj(os.path.join(DIR, 'parametry.json'))
P = K.P

def dziel(bm, podzial):
    for _ in range(6):
        dl = [e for e in bm.edges if e.calc_length() > podzial]
        if not dl: break
        bmesh.ops.subdivide_edges(bm, edges=dl, cuts=1, use_grid_fill=False)
        bmesh.ops.triangulate(bm, faces=bm.faces)
def wczytaj_stl(nazwa, podzial=1.5):
    bpy.ops.wm.stl_import(filepath=os.path.join(DIR, nazwa + '.stl'))
    o = bpy.context.selected_objects[0]
    bm = bmesh.new(); bm.from_mesh(o.data)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-4); dziel(bm, podzial)
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
def pudlo_lok(o, eL, eW, eH, L0, L1, W0, W1, H0, H1, krok=1.5):
    """Prostopadłościan w układzie serwa (osie eL, eW, eH, początek o)."""
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0); dziel(bm, krok)
    V = []
    for v in bm.verts:
        l = (L0 + L1) / 2 + v.co.x * (L1 - L0); w = (W0 + W1) / 2 + v.co.y * (W1 - W0); h = (H0 + H1) / 2 + v.co.z * (H1 - H0)
        V.append(o + eL * l + eW * w + eH * h)
    F = [[v.index for v in f.verts] for f in bm.faces]; bm.free(); return V, F
def suma(*ms):
    V, F = [], []
    for v, f in ms: o = len(V); V += v; F += [[i + o for i in ff] for ff in f]
    return V, F
# MG90S w układzie lokalnym: L wzdłuż korpusu (wałek na L = 17,3, 5,5 od końca L = 22,8), W szerokość, H wzdłuż wałka (spód H = 0)
SL, SW, SH, SWAL = 22.8, 12.5, 22.5, 17.3
def serwo(o, eL, eW, eH, s=0.0):
    o, eL, eW, eH = map(Vector, (o, eL, eW, eH)); hw = SW / 2
    wal = o + eL * SWAL
    return suma(pudlo_lok(o, eL, eW, eH, s, SL - s, -hw + s, hw - s, s, SH - s),
                pudlo_lok(o, eL, eW, eH, -4.5 + s, 0, -hw + s, hw - s, 18 + s, 20 - s),          # ucho przy końcu L = 0
                pudlo_lok(o, eL, eW, eH, SL, SL + 4.5 - s, -hw + s, hw - s, 18 + s, 20 - s),     # ucho przy końcu wałka
                walec(wal + eH * (SH - 0.01), wal + eH * 27, 5.9 - s), walec(wal + eH * 27, wal + eH * 35, 2.4 - s))
L_, G_, PG_, PD_ = P['LP_wal'], P['GD_wal'], P['PG_wal'], P['PD_wal']
def serwa(s):
    return {
        'SerwoLP': serwo((L_[0], -33, L_[2] - SWAL), (0, 0, 1), (1, 0, 0), (0, 1, 0), s),          # pion, wałek do góry, koniec wałka do przodu
        'SerwoGD': serwo((-33, G_[1] - SWAL, G_[2]), (0, 1, 0), (0, 0, 1), (1, 0, 0), s),          # stoi na końcu korpusu, wałek w +x
        'SerwoPG': serwo((38, PG_[1] + SWAL, PG_[2]), (0, -1, 0), (0, 0, 1), (-1, 0, 0), s),       # stoi na końcu z wałkiem, wałek w −x
        'SerwoPD': serwo((-38, PD_[1] + SWAL, PD_[2]), (0, -1, 0), (0, 0, 1), (1, 0, 0), s)}       # stoi na końcu z wałkiem, wałek w +x

# ---- części ----
CZ = {}
CZ['Galka'] = wczytaj_stl('Galka', 2.0)
CZ['PowiekaGorna'] = wczytaj_stl('PowiekaGorna', 1.5)
CZ['PowiekaDolna'] = wczytaj_stl('PowiekaDolna', 1.5)
CZ['Plyta'] = wczytaj_stl('Plyta', 1.0)
for t in ('Tuba30', 'Tuba40', 'Tuba50'): CZ[t] = wczytaj_stl(t, 2.0)
CZ['KardanTyl'] = walec((0, 0, -12.75), (0, 0, 0), 5.5)
CZ['KardanPrzod'] = walec((0, 0, 0), (0, 0, 12.75), 5.5)
CZ.update(serwa(0.0))
SERWA_M = serwa(0.05)
SERWA = ['SerwoLP', 'SerwoGD', 'SerwoPG', 'SerwoPD']
TUBY = ['Tuba30', 'Tuba40', 'Tuba50']
STALE = ['Plyta', 'KardanTyl'] + TUBY + SERWA

def drzewo_z(V, F, M=None):
    if M is not None: V = [M @ v for v in V]
    return BVHTree.FromPolygons(V, F, epsilon=0.0), V
def drzewo(nazwa, M=None): return drzewo_z(*CZ[nazwa], M)
def mat4(R): return Matrix(R).to_4x4()
def luz(tA, VA, tB, VB, filtrA=None, filtrB=None):
    best = 1e9; gdzie = None
    for (t, Vs, f) in ((tB, VA, filtrA), (tA, VB, filtrB)):
        for v in Vs:
            if f and not f(v): continue
            r = t.find_nearest(v)
            if r[0] is not None and r[3] < best: best, gdzie = r[3], r[0]
    return best, gdzie
KIER = Vector((0.5774, 0.5771, 0.5777)).normalized()
def wewnatrz(t, p):
    r = t.find_nearest(p)
    if r[0] is None: return False, 1e9
    if r[3] > 3.0: return False, r[3]
    n, q = 0, Vector(p)
    for _ in range(200):
        h = t.ray_cast(q, KIER)
        if h[0] is None: break
        n += 1; q = h[0] + KIER * 1e-4
    return n % 2 == 1, r[3]
def lamana_luz(t, odcinki, r, krok=0.25):
    best = 1e9; gdzie = None
    for a, b in odcinki:
        a, b = Vector(a), Vector(b); n = max(2, int((b - a).length / krok) + 1)
        for i in range(n):
            p = a + (b - a) * (i / (n - 1))
            ins, d = wewnatrz(t, p); d = -d if ins else d
            if d - r < best: best, gdzie = d - r, p
    return best, gdzie
def odc_odc(a, b, c, d):   # dokładna odległość dwóch odcinków (Eberly / Sunday)
    a, b, c, d = map(Vector, (a, b, c, d)); u, v, w = b - a, d - c, a - c
    A, B, C, D, E = u.dot(u), u.dot(v), v.dot(v), u.dot(w), v.dot(w); den = A * C - B * B
    sD = tD = den
    if den < 1e-9: sN, sD, tN, tD = 0.0, 1.0, E, C
    else:
        sN, tN = B * E - C * D, A * E - B * D
        if sN < 0: sN, tN, tD = 0.0, E, C
        elif sN > sD: sN, tN, tD = sD, E + B, C
    if tN < 0:
        tN = 0.0
        if -D < 0: sN = 0.0
        elif -D > A: sN = sD
        else: sN, sD = -D, A
    elif tN > tD:
        tN = tD
        if (-D + B) < 0: sN = 0.0
        elif (-D + B) > A: sN = sD
        else: sN, sD = (-D + B), A
    sc = 0.0 if abs(sN) < 1e-12 else sN / sD; tc = 0.0 if abs(tN) < 1e-12 else tN / tD
    return (w + u * sc - v * tc).length
def lam_lam(L1, L2): return min(odc_odc(a, b, c, d) for a, b in L1 for c, d in L2)

ODS, WYST = 1.75, 1.6
def drut_Z(a, na, b, nb, ods_a=ODS):
    """Łamana drutu z zakończeniami „Z”: zwraca (odcinki przez otwory [zaczep, orczyk], odcinki główne)."""
    a, b, na, nb = Vector(a), Vector(b), Vector(na).normalized(), Vector(nb).normalized()
    a1, b1 = a + na * ods_a, b + nb * ODS
    return [(a - na * WYST, a1), (b - nb * WYST, b1)], [(a1, b1)]
def pret_Z(otw, n, zag, b, nb):
    """Pręt gałki: noga „Z” przez otwór języczka (oś n) do zagięcia zag (odsadzenie zacz_ods), odcinek główny, „Z” w orczyku."""
    otw, n, zag, b, nb = Vector(otw), Vector(n).normalized(), Vector(zag), Vector(b), Vector(nb).normalized()
    b1 = b + nb * ODS
    return [(otw - n * WYST, zag), (b - nb * WYST, b1)], [(zag, b1)]
def druty(st):
    return {'PretLP': pret_Z(st['otwLP'], st['nLP'], st['pretLP'][0], st['pretLP'][1], (0, 1, 0)),
            'PretGD': pret_Z(st['otwGD'], st['nGD'], st['pretGD'][0], st['pretGD'][1], (-1, 0, 0)),
            'DrutG': drut_Z(st['drutG'][0], (1, 0, 0), st['drutG'][1], (1, 0, 0), P.get('pow_ods', ODS)),
            'DrutD': drut_Z(st['drutD'][0], (-1, 0, 0), st['drutD'][1], (-1, 0, 0), P.get('pow_ods', ODS))}
def bez_poczatku(odc, dl=2.5):   # odcinek główny bez 2,5 mm przy zagięciu na zaczepie (drut opiera się o płytkę zaczepu)
    return [(a + (b - a).normalized() * dl, b) for a, b in odc]
def wszystko(dr): return dr[0] + dr[1]
WLASNE = {'PretLP': 'Galka', 'PretGD': 'Galka', 'DrutG': 'PowiekaGorna', 'DrutD': 'PowiekaDolna'}

WYMOG = 0.5; WYMOG_OS = 0.2
wyniki = {}
def zapisz(para, d, stan, gdzie, wymog=WYMOG, kol=False):
    w = wyniki.get(para)
    if w is None or d < w['d']:
        wyniki[para] = dict(d=d, stan=stan, gdzie=None if gdzie is None else [round(x, 2) for x in gdzie], wymog=wymog, kol=kol or (w or {}).get('kol', False))
    elif kol: wyniki[para]['kol'] = True

T_stale = {n: drzewo(n) for n in STALE}
# ---- pary nieruchome ----
for a, b in itertools.combinations(SERWA, 2):
    ta, Va = T_stale[a]; tb, Vb = T_stale[b]; kol = bool(ta.overlap(tb)); d, g = luz(ta, Va, tb, Vb)
    zapisz(f'{a}–{b}', -1 if kol else d, 'nieruchome', g, kol=kol)
for a in SERWA:
    tm, Vm = drzewo_z(*SERWA_M[a])
    for n in ['Plyta', 'KardanTyl'] + TUBY:
        tb, Vb = T_stale[n]; kol = bool(tm.overlap(tb)); d, g = luz(tm, Vm, tb, Vb)
        zapisz(f'{a}–{n}' + (' (serwo −0,05: styk zamierzony)' if n == 'Plyta' else ''), -1 if kol else d, 'nieruchome', g,
               wymog=0.0 if n == 'Plyta' else WYMOG, kol=kol)
for n in TUBY:
    tb, Vb = T_stale[n]; ta, Va = T_stale['Plyta']; kol = bool(ta.overlap(tb)); d, g = luz(ta, Va, tb, Vb)
    zapisz(f'Plyta–{n} (moduł w środku tuby)', -1 if kol else d, 'nieruchome', g, kol=kol)
print('nieruchome policzone', flush=True)

PSI = range(-35, 36, 5); THETA = range(-25, 26, 5); POW = (0, 17, 34, 51.5)
TPOW = {}
for a in POW:
    TPOW[('G', a)] = drzewo('PowiekaGorna', mat4(kin.Rx(-a))); TPOW[('D', a)] = drzewo('PowiekaDolna', mat4(kin.Rx(a)))
r_dr, r_orcz = 0.5, 2.5
def orcz_odc(s, h):   # ramię orczyka od osi wałka do otworu + 3 mm
    s, h = Vector(s), Vector(h); u = (h - s).normalized(); return [(s, h + u * 3.0)]
zew = lambda v: v.length > 29.0     # gałka–powieka: liczą się tylko punkty gałki przy powierzchni zewnętrznej
prev = dict(aLP=0, aGD=0)
for psi, th in itertools.product(PSI, THETA):
    st = K.stan(psi, th, 0, 0, prev['aLP'], prev['aGD'])
    Rg = mat4(st['Rg'])
    tG, VG = drzewo('Galka', Rg); tKP, VKP = drzewo('KardanPrzod', Rg)
    s = f'psi {psi:+d}, theta {th:+d}'
    for n in ['Plyta', 'KardanTyl'] + TUBY:
        t, V = T_stale[n]; kol = bool(tG.overlap(t)); d, g = luz(tG, VG, t, V); zapisz(f'Galka–{n}', -1 if kol else d, s, g, kol=kol)
    t, V = T_stale['Plyta']; kol = bool(tKP.overlap(t)); d, g = luz(tKP, VKP, t, V); zapisz('KardanPrzod–Plyta', -1 if kol else d, s, g, kol=kol)
    DR = druty(st)
    for nm in ('PretLP', 'PretGD'):
        otw, gl = DR[nm]
        d, g = lamana_luz(tG, bez_poczatku(gl) + [otw[1]], r_dr); zapisz(f'{nm}–Galka (bez zaczepu i 2,5 mm przy zagięciu)', d, s, g)
        for n in ['Plyta', 'KardanTyl'] + TUBY + SERWA:
            d, g = lamana_luz(T_stale[n][0], gl + otw, r_dr); zapisz(f'{nm}–{n}', d, s, g)
    zapisz('PretLP–PretGD', lam_lam(wszystko(DR['PretLP']), wszystko(DR['PretGD'])) - 2 * r_dr, s, None)
    for nm, (a, b), wlasne in (('OrczykLP', st['orczLP'], 'SerwoLP'), ('OrczykGD', st['orczGD'], 'SerwoGD')):
        for n in ['Plyta'] + SERWA:
            if n == wlasne: continue
            d, g = lamana_luz(T_stale[n][0], orcz_odc(a, b), r_orcz, krok=0.5); zapisz(f'{nm}–{n}', d, s, g)
    zapisz('OrczykLP–PretGD', lam_lam(orcz_odc(*st['orczLP']), wszystko(DR['PretGD'])) - r_orcz - r_dr, s, None)
    zapisz('OrczykGD–PretLP', lam_lam(orcz_odc(*st['orczGD']), wszystko(DR['PretLP'])) - r_orcz - r_dr, s, None)
    for g_, d_ in itertools.product(POW, POW):
        sp = K.stan(psi, th, g_, d_, st['aLP'], st['aGD'])
        sp_s = s + f', powieki G {g_}, D {d_}'
        tPG, VPG = TPOW[('G', g_)]; tPD, VPD = TPOW[('D', d_)]
        DRp = druty(sp)
        for nm, t, V in (('PowiekaGorna', tPG, VPG), ('PowiekaDolna', tPD, VPD)):
            kol = bool(tG.overlap(t)); d, gg = luz(tG, VG, t, V, filtrA=zew); zapisz(f'Galka–{nm}', -1 if kol else d, sp_s, gg, kol=kol)
            for pn in ('PretLP', 'PretGD'):
                d, gg = lamana_luz(t, wszystko(DRp[pn]), r_dr); zapisz(f'{pn}–{nm}', d, sp_s, gg)
        for nm in ('DrutG', 'DrutD'):
            d, gg = lamana_luz(tG, wszystko(DRp[nm]), r_dr); zapisz(f'{nm}–Galka', d, sp_s, gg)
            for pn in ('PretLP', 'PretGD'):
                zapisz(f'{nm}–{pn}', lam_lam(wszystko(DRp[nm]), wszystko(DRp[pn])) - 2 * r_dr, sp_s, None)
    prev = dict(aLP=st['aLP'], aGD=st['aGD'])
    print('stan', s, flush=True)

# ---- powieki wobec siebie i części nieruchomych; druty i orczyki powiek ----
for g_, d_ in itertools.product((0, 8.6, 17.2, 25.8, 34.3, 42.9, 51.5), repeat=2):
    sp = K.stan(0, 0, g_, d_); s = f'powieki G {g_}, D {d_}'
    tPG, VPG = drzewo('PowiekaGorna', mat4(sp['RG'])); tPD, VPD = drzewo('PowiekaDolna', mat4(sp['RD']))
    kol = bool(tPG.overlap(tPD)); d, g = luz(tPG, VPG, tPD, VPD); zapisz('PowiekaGorna–PowiekaDolna (uszy na osi)', -1 if kol else d, s, g, wymog=WYMOG_OS, kol=kol)
    for nm, t, V in (('PowiekaGorna', tPG, VPG), ('PowiekaDolna', tPD, VPD)):
        for n in ['Plyta', 'KardanTyl'] + TUBY + SERWA:
            tt, VV = T_stale[n]; kol = bool(t.overlap(tt)); d, g = luz(t, V, tt, VV)
            zapisz(f'{nm}–{n}' + (' (uszy przy słupku)' if n == 'Plyta' else ''), -1 if kol else d, s, g, wymog=WYMOG_OS if n == 'Plyta' else WYMOG, kol=kol)
    DRp = druty(sp)
    for nm, inna, tw, ti in (('DrutG', 'PowiekaDolna', tPG, tPD), ('DrutD', 'PowiekaGorna', tPD, tPG)):
        otw, gl = DRp[nm]
        d, g = lamana_luz(ti, gl + otw, r_dr); zapisz(f'{nm}–{inna}', d, s, g)
        d, g = lamana_luz(tw, bez_poczatku(gl) + [otw[1]], r_dr); zapisz(f'{nm}–{WLASNE[nm]} (bez uszka i 2,5 mm przy zagięciu)', d, s, g)
        for n in ['Plyta'] + TUBY + SERWA:
            d, g = lamana_luz(T_stale[n][0], gl + otw, r_dr); zapisz(f'{nm}–{n}', d, s, g)
    for nm, (a, b), wlasne in (('OrczykG', sp['orczG'], 'SerwoPG'), ('OrczykD', sp['orczD'], 'SerwoPD')):
        for n in ['Plyta'] + SERWA:
            if n == wlasne: continue
            d, g = lamana_luz(T_stale[n][0], orcz_odc(a, b), r_orcz, krok=0.5); zapisz(f'{nm}–{n}', d, s, g)
    zapisz('DrutG–DrutD', lam_lam(wszystko(DRp['DrutG']), wszystko(DRp['DrutD'])) - 2 * r_dr, s, None)
    print('powieki', s, flush=True)
# orczyki i druty powiek wobec orczyków i prętów gałki (skrajne położenia gałki)
for psi, th, g_ in itertools.product((-35, 0, 35), (-25, 0, 25), (0, 17, 34, 51.5)):
    sp = K.stan(psi, th, g_, g_); s = f'psi {psi:+d}, theta {th:+d}, powieki {g_}'
    DRp = druty(sp)
    E1 = {'OrczykG': (orcz_odc(*sp['orczG']), r_orcz), 'OrczykD': (orcz_odc(*sp['orczD']), r_orcz),
          'DrutG': (wszystko(DRp['DrutG']), r_dr), 'DrutD': (wszystko(DRp['DrutD']), r_dr)}
    E2 = {'OrczykLP': (orcz_odc(*sp['orczLP']), r_orcz), 'OrczykGD': (orcz_odc(*sp['orczGD']), r_orcz),
          'PretLP': (wszystko(DRp['PretLP']), r_dr), 'PretGD': (wszystko(DRp['PretGD']), r_dr)}
    for (n1, (l1, r1)), (n2, (l2, r2)) in itertools.product(E1.items(), E2.items()):
        if n1.startswith('Drut') and n2.startswith('Pret'): continue
        zapisz(f'{n1}–{n2}', lam_lam(l1, l2) - r1 - r2, s, None)
    zapisz('OrczykG–OrczykD', lam_lam(E1['OrczykG'][0], E1['OrczykD'][0]) - 2 * r_orcz, s, None)

# ---- raport ----
lin = ['Duże oko v3 – przemiatanie kolizji na siatkach (Blender BVHTree). Luz w mm; ujemny = przenikanie.',
       f'Zakres: gałka psi −35…+35, theta −25…+25 co 5° (narożniki włącznie), powieki 0…51,5°. Wymóg: {WYMOG} (osiowo w zawiasie {WYMOG_OS}).',
       'Metoda, wyłączenia i to, czego przemiatanie nie obejmuje – nagłówek skryptu duze-oko-v3-przemiatanie.py.', '']
zle = 0
for para in sorted(wyniki, key=lambda p: wyniki[p]['d']):
    w = wyniki[para]; ok = w['d'] >= w['wymog'] and not w['kol']
    if not ok: zle += 1
    dd = 'KOLIZJA' if w['kol'] else f"{w['d']:7.2f}"
    lin.append(f"{'OK ' if ok else 'ZLE'} {para:62s} {dd}  (wymóg {w['wymog']})  przy: {w['stan']}  miejsce: {w['gdzie']}")
lin.append(''); lin.append(f'Par poniżej wymogu: {zle} z {len(wyniki)}')
open(WYN, 'w', encoding='utf-8').write('\n'.join(lin) + '\n')
json.dump(wyniki, open(os.path.splitext(WYN)[0] + '.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('\n'.join(lin))
