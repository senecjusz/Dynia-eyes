# Duże oko v3: ugięcie i naprężenia słupków płyty (zawiasu powiek i kardana) – rachunek belkowy na przekrojach siatki.
# Użycie: python3 duze-oko-v3-slupki.py <Plyta.stl w układzie złożenia (ASCII, eksport-v3.sh)> <parametry.json> [wynik.md]
#
# Metoda:
#  - przekroje płaszczyznami siatki płyty (bez upraszczania kształtu): poziome y = const przy nasadzie oraz poprzeczne
#    z = const wzdłuż słupków co 0,5 mm; pole, środek i pełna macierz momentów bezwładności (z iloczynem) z rasteryzacji
#    wielokątów przekroju (siatka 0,05 mm, reguła parzystości);
#  - naprężenie normalne σ = N/A + g·ρ, gdzie J·g = n × M (J – macierz momentów bezwładności przekroju, ρ – położenie
#    w przekroju względem środka, n – normalna przekroju, M – moment obciążeń względem środka przekroju): zginanie
#    dwukierunkowe liczone dla każdego wektora obciążenia osobno, bez łączenia I z jednej osi i c z drugiej;
#    skręcanie τ ≈ Mn / (0,2·A·t) (szacunek), naprężenie zastępcze √(σ² + 3τ²);
#  - wytrzymałość zależna od kąta φ między kierunkiem naprężenia (normalna przekroju) a płaszczyzną warstw, kryterium
#    Tsai–Hilla: 1/R² = cos⁴φ/X² + (1/S² − 1/X²)·cos²φ·sin²φ + sin⁴φ/Y²; druk na płasko: warstwy y = const,
#    druk pod 45°: normalna warstw (0, 1, 1)/√2; dolna granica dla druku pod 45°: Y (wytrzymałość w poprzek warstw);
#  - wypełnienie: przekrój pełny (100 %) oraz ≥ 5 ścianek bez wypełnienia (pierścień 2,1 mm od obrysu – dolna granica);
#  - ugięcie: całkowanie M/(E·I) wzdłuż słupka od przodu płyty (z = −49), osobno w x i w y.
# Założenia [Z]: PLA E = 3500 MPa; X = 50 MPa wzdłuż warstw, Y = 20 MPa w poprzek warstw, S = 20 MPa ścinanie między
# warstwami (ostrożnie; literatura 15–30 MPa w poprzek warstw).
# Obciążenia (MG90S 2,2 kg·cm, T = 216 N·mm przy zablokowaniu), z kinematyki (duze_oko_v3_kinematyka.py):
#  - siła w drucie F = T / |e·(r × u)|: e – oś wałka serwa, r – od osi wałka do otworu orczyka, u – kierunek drutu;
#    gałka ±35° × ±25° co 5°, powieki 0…51,5° co 2,5°; drut ciągnie albo pcha (oba znaki);
#  - kardan: obie siły prętów gałki naraz, wszystkie kombinacje znaków, w środku kuli (z = 0); skręcanie słupka
#    składową z momentu sił prętów względem środka kuli; gałka zablokowana oparciem: siła oparcia na promieniu kuli
#    równoważąca moment prętów względem środka (|M_xy| / R_kula), w kierunkach ±x, ±y, ±z;
#  - zawias: siła drutu powieki na ucho powieki; rozdział na dwa słupki dźwignią wzdłuż x (A), cała siła jednej
#    powieki na jeden słupek (B), obie powieki całą siłą na jeden słupek (C), powieka zablokowana oparciem (D): drut
#    plus siła oparcia na krawędzi powieki (r = 33) równoważąca moment drutu względem osi zawiasu, kąt oparcia co 15°,
#    całość na jeden słupek;
#  - ręka przy montażu w x (kierunek słaby ramienia): siła niszcząca najsłabszy przekrój.
import sys, os, re, math
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import duze_oko_v3_kinematyka as kin

pl, pj = sys.argv[1], sys.argv[2]; WYN = sys.argv[3] if len(sys.argv) > 3 else None
V = np.array(re.findall(r'vertex\s+(\S+)\s+(\S+)\s+(\S+)', open(pl).read()), dtype=float).reshape(-1, 3, 3)
K = kin.wczytaj(pj)
E_PLA, X_W, Y_W, S_W = 3500.0, 50.0, 20.0, 20.0
T_SERWO = 216.0
SCIANKI = 2.1          # 5 ścianek × 0,42
L_PLASKO = np.array([0.0, 1.0, 0.0]); L_45 = np.array([0.0, 1.0, 1.0]) / math.sqrt(2)
EX, EY, EZ = np.eye(3)

def R_tsai(n, Ln):
    s = abs(float(np.dot(n, Ln))); c2 = 1 - s * s
    return 1 / math.sqrt(c2 * c2 / X_W ** 2 + (1 / S_W ** 2 - 1 / X_W ** 2) * c2 * s * s + s ** 4 / Y_W ** 2)

# ---------------- przekroje ----------------
def przekroj(ax, h, filtr):
    a = V[:, :, ax] - h
    oth = [i for i in range(3) if i != ax]
    seg = []
    for tri, s in zip(V, a):
        pts = []
        for i in range(3):
            j = (i + 1) % 3
            if (s[i] < 0) != (s[j] < 0):
                f = s[i] / (s[i] - s[j]); p = tri[i] + f * (tri[j] - tri[i]); pts.append(p[oth])
        if len(pts) == 2 and filtr((pts[0] + pts[1]) / 2): seg.append(pts)
    return np.array(seg)
def erozja(m, n):
    for k in range(n):
        e = m.copy()
        e[1:] &= m[:-1]; e[:-1] &= m[1:]; e[:, 1:] &= m[:, :-1]; e[:, :-1] &= m[:, 1:]
        if k % 2:
            e[1:, 1:] &= m[:-1, :-1]; e[:-1, :-1] &= m[1:, 1:]; e[1:, :-1] &= m[:-1, 1:]; e[:-1, 1:] &= m[1:, :-1]
        m = e
    return m
def otoczka(P):
    P = sorted(set(map(tuple, P)))
    if len(P) < 3: return np.array(P)
    def cr(o, a, b): return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    lo, hi = [], []
    for p in P:
        while len(lo) >= 2 and cr(lo[-2], lo[-1], p) <= 0: lo.pop()
        lo.append(p)
    for p in reversed(P):
        while len(hi) >= 2 and cr(hi[-2], hi[-1], p) <= 0: hi.pop()
        hi.append(p)
    return np.array(lo[:-1] + hi[:-1])
def wlasnosci(seg, krok=0.05, scianki=False):
    if len(seg) == 0: return None
    mn = seg.reshape(-1, 2).min(0) - krok; mx = seg.reshape(-1, 2).max(0) + krok
    us = np.arange(mn[0], mx[0], krok) + krok / 2; vs = np.arange(mn[1], mx[1], krok) + krok / 2
    A0, B0 = seg[:, 0], seg[:, 1]
    maska = np.zeros((len(vs), len(us)), bool)
    lo = np.minimum(A0[:, 1], B0[:, 1]); hi = np.maximum(A0[:, 1], B0[:, 1])
    for k, v in enumerate(vs):
        sel = (lo <= v) & (hi > v)
        if not sel.any(): continue
        a, b = A0[sel], B0[sel]
        uc = np.sort(a[:, 0] + (v - a[:, 1]) * (b[:, 0] - a[:, 0]) / (b[:, 1] - a[:, 1]))
        for i in range(0, len(uc) - 1, 2):
            maska[k] |= (us >= uc[i]) & (us < uc[i + 1])
    if scianki: maska &= ~erozja(maska, int(round(SCIANKI / krok)))
    dA = krok * krok
    UU, VV = np.meshgrid(us, vs)
    u, v = UU[maska], VV[maska]
    A = len(u) * dA
    if A == 0: return None
    uc, vc = u.mean(), v.mean(); du, dv = u - uc, v - vc
    J = np.array([[(du * du).sum(), (du * dv).sum()], [(du * dv).sum(), (dv * dv).sum()]]) * dA
    t = min(u.max() - u.min(), v.max() - v.min())
    return dict(A=A, uc=uc, vc=vc, J=J, hull=otoczka(np.c_[du, dv].round(3)), t=t)

def baza(ax):
    """Normalna przekroju i osie w jego płaszczyźnie (pozostałe osie w kolejności x, y, z)."""
    oth = [i for i in range(3) if i != ax]
    return np.eye(3)[ax], np.eye(3)[oth[0]], np.eye(3)[oth[1]]
def naprezenia(w, ax, h, P, F):
    """σ zastępcze (max w przekroju) dla każdego wektora obciążenia: P (k×3) punkty przyłożenia, F (k×3) siły."""
    n, eu, ev = baza(ax)
    C = eu * w['uc'] + ev * w['vc'] + n * h
    M = np.cross(P - C, F)
    N = F @ n; Mn = M @ n
    nxM = np.cross(n, M)
    g = np.linalg.solve(w['J'], np.c_[nxM @ eu, nxM @ ev].T).T
    sig = np.abs(N[:, None] / w['A'] + g @ w['hull'].T).max(1)
    tau = np.abs(Mn) / (0.2 * w['A'] * w['t'])
    return np.sqrt(sig ** 2 + 3 * tau ** 2)

# ---------------- obciążenia z kinematyki ----------------
def jedn(a): a = np.array(a, float); return a / np.linalg.norm(a)
def sila_drutu(s, h, j, e):
    u = jedn(np.subtract(h, j)); r = np.subtract(h, s)
    return T_SERWO / abs(np.dot(e, np.cross(r, u))), u
kard_F, kard_Mz, fmax = [], [], dict(LP=0, GD=0, G=0, D=0)
for psi in range(-35, 36, 5):
    for th in range(-25, 26, 5):
        st = K.stan(psi, th)
        fL, uL = sila_drutu(K.sLP, st['pretLP'][1], st['pretLP'][0], EY)     # orczyk L–P w płaszczyźnie y = 0
        fG, uG = sila_drutu(K.sGD, st['pretGD'][1], st['pretGD'][0], EX)     # orczyk G–D w płaszczyźnie x = 0
        fmax['LP'] = max(fmax['LP'], fL); fmax['GD'] = max(fmax['GD'], fG)
        for a in (1, -1):
            for b in (1, -1):
                FL, FG = a * fL * uL, b * fG * uG
                M = np.cross(st['pretLP'][0], FL) + np.cross(st['pretGD'][0], FG)
                fc = math.hypot(M[0], M[1]) / K.P['R_kula']
                for d in (np.zeros(3), EX, -EX, EY, -EY, EZ, -EZ):
                    kard_F.append(FL + FG + fc * d); kard_Mz.append(M[2])
kard_F = np.array(kard_F); kard_Mz = np.array(kard_Mz)
def kard_obc():
    """Siła w środku kuli plus para sił ±Mz/2 na ramieniu ±0,5 w x (dokłada samo skręcanie Mz)."""
    k = len(kard_F)
    P = np.zeros((k, 3, 3)); F = np.zeros((k, 3, 3))
    F[:, 0] = kard_F
    P[:, 1] = [0.5, 0, 0]; F[:, 1, 1] = kard_Mz
    P[:, 2] = [-0.5, 0, 0]; F[:, 2, 1] = -kard_Mz
    return P, F
pow_v = {'G': [], 'D': []}
for g in np.arange(0, 51.6, 2.5):
    st = K.stan(g=g, d=g)
    for nm, s, key in (('G', K.sG, 'drutG'), ('D', K.sD, 'drutD')):
        j, h = st[key]
        f, u = sila_drutu(s, h, j, EX)                                        # orczyki powiek w płaszczyznach x = const
        fmax[nm] = max(fmax[nm], f)
        pow_v[nm] += [(f * u, j[0], j), (-f * u, j[0], j)]
R_POW = 33.0                                                                  # promień krawędzi powieki (oparcie)
A_PIN = 36.0                                                                  # oś zawiasu na środku ramienia
pin = np.array([A_PIN, 0.0, 0.0])
def zawias_obc(przypadek):
    """Wektory sił na prawy słupek, przyłożone na osi zawiasu."""
    udz = lambda x: (x + A_PIN) / (2 * A_PIN)
    if przypadek == 'A':
        Fs = [FG * udz(xg) + FD * udz(xd) for FG, xg, _ in pow_v['G'] for FD, xd, _ in pow_v['D']]
    elif przypadek == 'B':
        Fs = [F for F, _, _ in pow_v['G'] + pow_v['D']]
    elif przypadek == 'C':
        Fs = [FG + FD for FG, _, _ in pow_v['G'] for FD, _, _ in pow_v['D']]
    else:
        Fs = []
        for F, _, j in pow_v['G'] + pow_v['D']:
            f = -np.cross(j, F)[0] / R_POW
            for th in np.radians(np.arange(0, 360, 15)):
                Fs.append(F + f * np.array([0, -math.sin(th), math.cos(th)]))
    F = np.array(Fs)
    return np.tile(pin, (len(F), 1))[:, None, :], F[:, None, :]

def naprezenia_obc(w, ax, h, obc):
    """obc: (P, F) o kształcie k×m×3 – k przypadków, każdy suma m sił; zwraca σ zastępcze dla każdego przypadku."""
    P, F = obc
    n, eu, ev = baza(ax)
    C = eu * w['uc'] + ev * w['vc'] + n * h
    M = np.cross(P - C, F).sum(1); Fs = F.sum(1)
    N = Fs @ n; Mn = M @ n
    nxM = np.cross(n, M)
    g = np.linalg.solve(w['J'], np.c_[nxM @ eu, nxM @ ev].T).T
    sig = np.abs(N[:, None] / w['A'] + g @ w['hull'].T).max(1)
    tau = np.abs(Mn) / (0.2 * w['A'] * w['t'])
    return np.sqrt(sig ** 2 + 3 * tau ** 2)

# ---------------- raport ----------------
pr = lambda x, d=1: f'{x:.{d}f}'.replace('.', ',')
R45 = R_tsai(EZ, L_45)
lin = ['# Duże oko v3: wytrzymałość słupków płyty', '',
       'Wynik `narzedzia/duze-oko-v3-slupki.py` na siatce `Plyta` (eksport-v3.sh); metoda, obciążenia i założenia [Z] w nagłówku skryptu.',
       f'PLA [Z]: E = {E_PLA:.0f} MPa, X = {X_W:.0f} MPa wzdłuż warstw, Y = {Y_W:.0f} MPa w poprzek, S = {S_W:.0f} MPa; '
       f'naprężenie pod kątem 45° do warstw: R = {pr(R45)} MPa (Tsai–Hill). Zapas = R / σ zastępcze.', '',
       '## Obciążenia z kinematyki', '',
       f'- Największa siła w drucie przy zablokowanym serwie (T = 216 N·mm): pręt L–P {pr(fmax["LP"])} N, pręt G–D {pr(fmax["GD"])} N, '
       f'drut powieki górnej {pr(fmax["G"])} N, dolnej {pr(fmax["D"])} N.',
       f'- Kardan (obie siły prętów naraz, w środku kuli): osiowo (z) do {pr(np.abs(kard_F[:, 2]).max())} N, w x do {pr(np.abs(kard_F[:, 0]).max())} N, '
       f'w y do {pr(np.abs(kard_F[:, 1]).max())} N (z siłą oparcia gałki), poprzecznie do {pr(np.hypot(kard_F[:, 0], kard_F[:, 1]).max())} N; skręcanie do {pr(np.abs(kard_Mz).max(), 0)} N·mm.']
for c, opis in (('A', 'rozdział dźwignią na dwa słupki'), ('B', 'cała siła jednej powieki'), ('C', 'obie powieki całą siłą'), ('D', 'powieka zablokowana oparciem, całość na jeden słupek')):
    F = zawias_obc(c)[1][:, 0]
    lin.append(f'- Prawy słupek zawiasu, przypadek {c} ({opis}): |F| do {pr(np.linalg.norm(F, axis=1).max())} N '
               f'(x {pr(np.abs(F[:, 0]).max())}, y {pr(np.abs(F[:, 1]).max())}, z {pr(np.abs(F[:, 2]).max())} N).')
lin.append('')

KOL = (('plasko', 'płasko'), ('d45', '45°'), ('d45min', '45° dolna granica'), ('s5_45', '45°, 5 ścianek'))
def tabela(sekcje, przypadki, ax, filtr, pokaz):
    wiersze, mins = [], {}
    n = baza(ax)[0]
    Rp, Rk = R_tsai(n, L_PLASKO), R_tsai(n, L_45)
    for h in sekcje:
        seg = przekroj(ax, h, filtr)
        w = wlasnosci(seg)
        if w is None: continue
        ws = wlasnosci(seg, scianki=True)
        row = [pr(h), pr(w['A'], 0)]
        for nm, obc in przypadki:
            s = naprezenia_obc(w, ax, h, obc).max()
            s5 = naprezenia_obc(ws, ax, h, obc).max() if ws else float('inf')
            z = dict(plasko=Rp / s, d45=Rk / s, d45min=Y_W / s, s5_45=Rk / s5)
            for k, val in z.items():
                if (nm, k) not in mins or val < mins[(nm, k)][0]: mins[(nm, k)] = (val, h)
            row += [pr(s)] + [pr(z[k]) for k, _ in KOL]
        if pokaz(h): wiersze.append('| ' + ' | '.join(row) + ' |')
    return wiersze, mins
def naglowek(przypadki, os_nazwa):
    h = f'| {os_nazwa} | pole [mm²] |' + ''.join(f' σ {nm} [MPa] |' + ''.join(f' zapas {o} |' for _, o in KOL) for nm, _ in przypadki)
    return [h, '|---|---|' + '---|' * (5 * len(przypadki))]
co2 = lambda h: abs((h + 0.5) % 2) < 1e-6

# słupek zawiasu
PRZ_Z = [(c, zawias_obc(c)) for c in 'ABCD']
F_ZAW = lambda m: m[0] > 25 and m[1] > -20.5
lin += ['## Słupek zawiasu powiek (prawy, lewy symetryczny)', '',
        'Przypadki obciążeń A–D jak wyżej, na osi zawiasu (x = 36, z = 0). „45°, 5 ścianek”: druk pod 45°, ≥ 5 ścianek bez wypełnienia; pozostałe kolumny dla wypełnienia 100 %.', '',
        '### Przekroje poziome przy nasadzie (nad płytą)', '']
zp, mz_poz = tabela((-14.9, -13, -11, -9, -7, -5.5), PRZ_Z, 1, lambda m: m[0] > 25, lambda h: True)
lin += naglowek(PRZ_Z, 'y') + zp
lin += ['', '### Przekroje poprzeczne wzdłuż ramienia (liczone co 0,5 mm, w tabeli co 2 mm)', '']
sek = [round(h, 2) for h in np.arange(-48.5, -0.4, 0.5)]
zz, mz_pop = tabela(sek, PRZ_Z, 2, F_ZAW, co2)
lin += naglowek(PRZ_Z, 'z') + zz
fr = {}
for h in sek:
    w = wlasnosci(przekroj(2, h, F_ZAW))
    if w is None: continue
    s1 = naprezenia(w, 2, h, np.array([pin]), np.array([EX])).max()
    for k, R in (('plasko', R_tsai(EZ, L_PLASKO)), ('d45', R45), ('d45min', Y_W)):
        if k not in fr or R / s1 < fr[k][0]: fr[k] = (R / s1, h)
lin += ['', f'**Siła ręki w x (kierunek słaby ramienia), która niszczy najsłabszy przekrój:** druk na płasko {pr(fr["plasko"][0])} N (z = {pr(fr["plasko"][1])}), '
        f'pod 45° {pr(fr["d45"][0])} N (Tsai–Hill), dolna granica {pr(fr["d45min"][0])} N (z = {pr(fr["d45min"][1])}).', '']
def I_wzdluz(filtr, z0, z1):
    out = []
    for z in np.arange(z0, z1 + 1e-6, 1.0):
        w = wlasnosci(przekroj(2, z, filtr))
        if w: out.append((z, w['J'][1, 1], w['J'][0, 0]))
    return np.array(out)
def podatnosc(I, kier):
    zs, Is = I[:, 0], I[:, 1 if kier == 'y' else 2]
    integ = zs ** 2 / (E_PLA * Is)
    return np.trapezoid(integ, zs) if hasattr(np, 'trapezoid') else np.trapz(integ, zs)
Iz = I_wzdluz(F_ZAW, -48.5, -0.5)
cy, cx = podatnosc(Iz, 'y'), podatnosc(Iz, 'x')
FA = zawias_obc('A')[1][:, 0]
lin += [f'Podatność osi zawiasu (wspornik od przodu płyty, bez kleju w tubie): {pr(cy, 3)} mm/N w y, {pr(cx, 3)} mm/N w x; '
        f'w przypadku A: {pr(cy * np.abs(FA[:, 1]).max(), 2)} mm w y, {pr(cx * np.abs(FA[:, 0]).max(), 2)} mm w x; od 4,3 N ręki w x {pr(cx * 4.3, 2)} mm.', '',
        '**Klej w tubie** podpiera ramię dopiero na z = −24 / −34 / −44 (tuba 30 / 40 / 50): zmniejsza moment przy nasadzie, '
        'ale nie w przekrojach ramienia przed miejscem kleju, więc nie zmienia najsłabszego przekroju.', '']

# słupek kardana
PRZ_K = [('kardan', kard_obc())]
F_KOL = lambda m: abs(m[0]) < 16 and m[1] > -20.5
lin += ['## Słupek kardana', '',
        'Obciążenie: wszystkie wektory sił prętów gałki (obie naraz, oba znaki) z siłą oparcia gałki, w środku kuli, i skręcanie z momentu prętów.', '',
        '### Przekroje poziome przy nasadzie (nad płytą)', '']
kp, mk_poz = tabela((-14.9, -13, -11, -9, -7), PRZ_K, 1, lambda m: abs(m[0]) < 16, lambda h: True)
lin += naglowek(PRZ_K, 'y') + kp
lin += ['', '### Przekroje poprzeczne wzdłuż słupka (liczone co 0,5 mm, w tabeli co 2 mm)', '']
sekk = [round(h, 2) for h in np.arange(-48.5, -14.4, 0.5)]
kz, mk_pop = tabela(sekk, PRZ_K, 2, F_KOL, co2)
lin += naglowek(PRZ_K, 'z') + kz
Ik = I_wzdluz(F_KOL, -48.5, -14.5)
lin += ['', f'Ugięcie środka kuli (słupek do z = −14,25, dalej kardan sztywny): {pr(podatnosc(Ik, "y") * np.abs(kard_F[:, 1]).max(), 3)} mm w y, '
        f'{pr(podatnosc(Ik, "x") * np.abs(kard_F[:, 0]).max(), 3)} mm w x.', '']

lin += ['## Najmniejsze zapasy', '', '| Słupek, przypadek | druk płasko | druk 45° (Tsai–Hill) | druk 45°, dolna granica | druk 45°, ≥ 5 ścianek |', '|---|---|---|---|---|']
def mn(ms, nm, k):
    return min((m[(nm, k)] + (o,) for m, o in ms if (nm, k) in m), key=lambda t: t[0])
for nm, ms in [(c, [(mz_poz, 'y'), (mz_pop, 'z')]) for c in 'ABCD'] + [('kardan', [(mk_poz, 'y'), (mk_pop, 'z')])]:
    lin.append(f'| {"zawias " + nm if nm != "kardan" else nm} | ' + ' | '.join(f'{pr(v)} ({o} = {pr(h)})' for v, h, o in (mn(ms, nm, k) for k, _ in KOL)) + ' |')
out = '\n'.join(lin) + '\n'
if WYN: open(WYN, 'w', encoding='utf-8').write(out)
print(out)
