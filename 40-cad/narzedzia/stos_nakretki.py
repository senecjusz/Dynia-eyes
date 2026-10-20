# Odstep stosu podkladka+nakretka+koniec sruby (przeguby C i H Ciegna) od czesci v2.6 na calym ruchu oka.
# Uzycie: python3 -I stos_nakretki.py <katalog z 3MF v2.6> <yGora piasty> <srubaL>
import sys, os, zipfile, re, math
import numpy as np

kat, yG, L = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
TUL_Y = 3.8           # spod lba = -tulejkaY
NAK_H, PODK, R_PODK, R_NAK, R_SR = 4.0, 0.5, 3.5, 6.35 / 2, 1.5
yKon = -TUL_Y + L     # koniec sruby
# obwiednia dwoch wariantow (1 i 2 podkladki): [y0, y1, R]
STOS = [(yG, yG + 2 * PODK, R_PODK), (yG + PODK, yG + 2 * PODK + NAK_H, R_NAK), (yG + PODK + NAK_H, yKon, R_SR)]

def siatka(plik):
    z = zipfile.ZipFile(plik); s = z.read([n for n in z.namelist() if n.endswith('.model')][0]).decode()
    skala = {'meter': 1000.0, 'millimeter': 1.0}[re.search(r'unit="(\w+)"', s).group(1)]
    V = np.array(re.findall(r'<vertex x="([^"]+)" y="([^"]+)" z="([^"]+)"', s), float) * skala
    T = np.array(re.findall(r'<triangle v1="(\d+)" v2="(\d+)" v3="(\d+)"', s), int)
    return V, T

def probki(V, T, krok=0.25):
    out = [V]
    a, b, c = V[T[:, 0]], V[T[:, 1]], V[T[:, 2]]
    dl = np.max([np.linalg.norm(b - a, axis=1), np.linalg.norm(c - a, axis=1), np.linalg.norm(c - b, axis=1)], axis=0)
    N = np.clip(np.ceil(dl / krok).astype(int), 1, 200)
    for n in np.unique(N):
        m = N == n
        for i in range(n + 1):
            for j in range(n + 1 - i):
                out.append(a[m] + (i / n) * (b[m] - a[m]) + (j / n) * (c[m] - a[m]))
    return np.vstack(out)

def odstep(P, cx, cz):
    """najmniejsza odleglosc punktow P do obwiedni stosu w (cx, cz); <0 = przenikanie"""
    r = np.hypot(P[:, 0] - cx, P[:, 2] - cz); y = P[:, 1]
    best = np.inf
    for y0, y1, R in STOS:
        dy = np.maximum(np.maximum(y0 - y, y - y1), 0)
        dr = np.maximum(r - R, 0)
        d = np.hypot(dy, dr)
        inside = (dy == 0) & (dr == 0)
        d = np.where(inside, -np.minimum(np.minimum(y - y0, y1 - y), R - r), d)
        best = min(best, d.min())
    return best

def rot(p, o, a):  # obrot w plaszczyznie XZ wokol osi Y przez o=(x,z)
    ca, sa = math.cos(a), math.sin(a); dx, dz = p[0] - o[0], p[1] - o[1]
    return (o[0] + ca * dx - sa * dz, o[1] + sa * dx + ca * dz)

E, S = (0.0, -12.0), (0.0, -66.0)
C0, H0 = (7.382, -36.147), (-9.235, -40.628)
LCH = math.dist(C0, H0); RH = math.dist(H0, S)
def H_od(C, Hpop):
    d = math.dist(C, S); a = (RH ** 2 - LCH ** 2 + d ** 2) / (2 * d); h = math.sqrt(max(RH ** 2 - a ** 2, 0))
    ex, ez = (C[0] - S[0]) / d, (C[1] - S[1]) / d
    px, pz = S[0] + a * ex, S[1] + a * ez
    k = [(px - h * ez, pz + h * ex), (px + h * ez, pz - h * ex)]
    return min(k, key=lambda q: math.dist(q, Hpop))
ruch = []
for sgn in (1, -1):
    Hp = H0
    for i in range(0, 34 * 4 + 1):
        th = sgn * math.radians(i / 4)
        C = rot(C0, E, th); H = H_od(C, Hp); Hp = H
        fi = math.atan2(H[1] - S[1], H[0] - S[0]) - math.atan2(H0[1] - S[1], H0[0] - S[0])
        ruch.append((th, C, H, fi))

czesci = {}
for f in sorted(os.listdir(kat)):
    if not f.endswith('.3mf') or 'FullProject' in f or 'Cięgno' in f or 'Tulejka' in f: continue
    V, T = siatka(os.path.join(kat, f))
    ty = V[T][:, :, 1]; m = (ty.max(1) > yG - 4) & (ty.min(1) < yKon + 4)
    czesci[f.split(' - ')[1][:-4]] = probki(V, T[m], 0.4) if m.any() else np.zeros((0, 3))
wyn = {}
for nazwa, P in czesci.items():
    m = (P[:, 1] > yG - 4) & (P[:, 1] < yKon + 4); P = P[m]
    if nazwa.startswith('Jarzmo'): pts = [rot(H, E, -th) for th, C, H, fi in ruch] + [C0]
    elif nazwa.startswith('Ramię'): pts = [rot(C, S, -fi) for th, C, H, fi in ruch] + [H0]
    else: pts = [C for th, C, H, fi in ruch] + [H for th, C, H, fi in ruch]
    pts = np.array(pts); dmin = np.full(len(P), np.inf)
    for q in pts[::4]: dmin = np.minimum(dmin, np.hypot(P[:, 0] - q[0], P[:, 2] - q[1]))
    P = P[dmin < 12]
    print(nazwa, 'punktow blisko', len(P), flush=True)
    if not len(P): wyn[nazwa] = ('>= 8 (brak punktow w promieniu 12 od osi stosu)', None); continue
    if not len(P): wyn[nazwa] = ('brak punktow w pasie y', None); continue
    naj = (np.inf, None)
    for th, C, H, fi in ruch:
        if nazwa.startswith('Jarzmo'):
            Cl, Hl = rot(C, E, -th), rot(H, E, -th)
        elif nazwa.startswith('Ramię'):
            Cl, Hl = rot(C, S, -fi), rot(H, S, -fi)
        else:
            Cl, Hl = C, H
        for nm, (x, z) in (('C', Cl), ('H', Hl)):
            d = odstep(P, x, z)
            if d < naj[0]: naj = (d, f'{nm} oko {math.degrees(th):+.1f} serwo {math.degrees(fi):+.1f}')
    wyn[nazwa] = naj
print(f'piasta y {yG}, sruba M3x{L:g}: koniec y {yKon:.2f}; stos {STOS}')
print('serwo zakres', round(min(math.degrees(r[3]) for r in ruch), 1), round(max(math.degrees(r[3]) for r in ruch), 1))
for k, (d, gdzie) in sorted(wyn.items(), key=lambda x: (x[1][0] if x[1][0] is not None and not isinstance(x[1][0], str) else 1e9)):
    print(f'{k:20s} {d if isinstance(d, str) else round(d, 3)}  {gdzie or ""}')
