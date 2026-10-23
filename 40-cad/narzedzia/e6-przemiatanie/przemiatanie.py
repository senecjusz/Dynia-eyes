#!/usr/bin/env python3
"""Przemiatanie pełnego modelu v3.1: macierz par, dolne ograniczenia odległości, zagęszczenie przy minimach.

Użycie:  python3 przemiatanie.py [parametry.json] [--szybko]
Wejście: okno.json i okno_splajn.npy (okno.py; okno nie zależy od przegubów).
Wyjście: przemiatanie.json (każda para: minimum w pracy i w całym zakresie + położenie), wydruk 10 minimów.

Każda wartość jest DOLNYM ograniczeniem odległości: min po próbkach bryły A dokładnej funkcji odległości
bryły B minus promień pokrycia próbek (kapsuła: oś, błąd ≤ krok/2). Powyżej progu THR podaję tańsze
ograniczenie z kapsuły opisanej (też dolne). Zakresy: gałka w całym zakresie mechanicznym okna (okno.json),
powieki od ogranicznika do ogranicznika, wszystkie kombinacje niezależnie.
"""
import numpy as np, json, sys, os, time
import multiprocessing as mp
import e6model as M
from e6model import d2r

THR = 1.5
STEP_C, STEP_S, STEP_F = 0.5, 0.15, 0.08


# ------------------------------------------------------------------ geometria pomocnicza
def screen_cap(A):
    if A.kind == 'cap': return A
    if A.kind in ('cyl', 'ann'): return M.cap(A.name, A.p, A.q, A.r)
    if A.kind == 'obb':
        i = int(np.argmax(A.h)); e = A.ax[:, i]; j, k = [m for m in range(3) if m != i]
        return M.cap(A.name, A.ctr - e * A.h[i], A.ctr + e * A.h[i], np.hypot(A.h[j], A.h[k]))
    return None


def seg_seg(p1, q1, p2, q2):
    d1 = q1 - p1; d2 = q2 - p2; r = p1 - p2
    a = d1 @ d1; e = d2 @ d2; f = d2 @ r
    if a < 1e-12 and e < 1e-12: return np.linalg.norm(r)
    if a < 1e-12:
        s = 0.0; t = np.clip(f / e, 0, 1)
    else:
        c = d1 @ r
        if e < 1e-12:
            t = 0.0; s = np.clip(-c / a, 0, 1)
        else:
            b = d1 @ d2; den = a * e - b * b
            s = np.clip((b * f - c * e) / den, 0, 1) if den > 1e-12 else 0.0
            t = (b * s + f) / e
            if t < 0: t = 0.0; s = np.clip(-c / a, 0, 1)
            elif t > 1: t = 1.0; s = np.clip((b - c) / a, 0, 1)
    return float(np.linalg.norm(p1 + d1 * s - (p2 + d2 * t)))


def far(A, B, thr):
    """szybkie odrzucenie (zwraca dolne ograniczenie albo None)."""
    if A.kind not in ('cap', 'cyl', 'obb', 'ann'): return None
    cn = np.linalg.norm(A.c); rmin = max(cn - A.rad, 0); rmax = cn + A.rad
    k = B.kind
    if k in ('cap', 'cyl', 'obb', 'sphere', 'ann'):
        d = np.linalg.norm(A.c - B.c) - A.rad - B.rad
        return d if d > thr else None
    if k == 'lid':
        L = 31.2; U = 34.7
        if rmin > U + thr: return rmin - U
        if rmax < L - thr: return L - rmax
        return None
    if k == 'ball':
        return (rmin - 30.0) if rmin > 30.0 + thr else None
    if k == 'prism':
        if B.Rm is not None:
            return (rmin - 27.5) if rmin > 27.5 + thr else None
        z = A.c[2]
        d = max(B.z0 - (z + A.rad), (z - A.rad) - B.z1)
        return d if d > thr else None
    if k == 'tube':
        rho = np.hypot(A.c[0], A.c[1]) + A.rad
        return (35.2 - rho) if rho < 35.2 - thr else None
    return None


def dmin(A, B, thr=THR):
    """dolne ograniczenie odległości A–B; A z próbnikiem (cap/cyl/obb), B z dokładną funkcją odległości."""
    f = far(A, B, thr)
    if f is not None: return float(f)
    if A.kind == 'cap' and B.kind == 'cap':
        return seg_seg(A.p, A.q, B.p, B.q) - A.r - B.r
    As = screen_cap(A)
    if B.kind in ('cap', 'cyl', 'obb', 'ann'):
        Bs = screen_cap(B); lb = seg_seg(As.p, As.q, Bs.p, Bs.q) - As.r - Bs.r
    else:
        pts, r, eps = As.samples(STEP_C)
        lb = float((B.dist(pts) - r).min() - eps)
    if lb >= thr: return lb
    if A.kind == 'cap':
        pts, r, eps = A.samples(STEP_F)
        return float((B.dist(pts) - r).min() - eps)
    pts, r, eps = A.samples(STEP_S)
    lb = float((B.dist(pts) - r).min() - eps)
    if lb < 0.9:
        pts, r, eps = A.samples(STEP_F)
        lb = float((B.dist(pts) - r).min() - eps)
    return lb


def area(A):
    if A.kind == 'cap': return 0.0
    if A.kind == 'cyl': return 2 * np.pi * A.r * (np.linalg.norm(A.q - A.p) + A.r)
    if A.kind == 'ann': return 2 * np.pi * (A.r + A.ri) * np.linalg.norm(A.q - A.p) + 2 * np.pi * (A.r ** 2 - A.ri ** 2)
    if A.kind == 'obb': h = A.h; return 8 * (h[0] * h[1] + h[1] * h[2] + h[0] * h[2])
    return 1e18


def ev(A, B):
    """próbkuję bryłę o mniejszej powierzchni (kapsuła: oś), drugą liczę dokładnie."""
    S = ('cap', 'cyl', 'obb', 'ann')
    if A.kind in S and B.kind in S:
        return dmin(A, B) if area(A) <= area(B) else dmin(B, A)
    if A.kind in S: return dmin(A, B)
    if B.kind in S: return dmin(B, A)
    return None


# ------------------------------------------------------------------ zakres gałki
class EyeRange:
    def __init__(self, okno):
        z = np.array(okno['zakres'])
        self.a = np.r_[z[:, 0], 360.0]; self.s = np.r_[z[:, 1], z[0, 1]]
        self.P0, self.T0 = 28.0, 18.0

    def scale(self, p, t):
        a = np.degrees(np.arctan2(t / self.T0, p / self.P0)) % 360
        return np.interp(a, self.a, self.s)

    def inside(self, p, t):
        return max(abs(p) / self.P0, abs(t) / self.T0) <= self.scale(p, t) + 1e-9

    def boundary(self, ndir):
        out = []
        for a in np.linspace(0, 360, ndir, endpoint=False):
            c, s = np.cos(np.radians(a)), np.sin(np.radians(a)); n = max(abs(c), abs(s))
            sc = np.interp(a, self.a, self.s) - 1e-6
            out.append((float(self.P0 * sc * c / n), float(self.T0 * sc * s / n)))
        return out


# ------------------------------------------------------------------ model
class Model:
    def __init__(self, P, W):
        self.P = P; self.W = W[::80]          # otwór okna w płycie: wierzchołki co 1° na splajnie (cięciwy wewnątrz – płyta zachowawczo większa)
        self.hX = M.Horn(P, 'X'); self.hY = M.Horn(P, 'Y')
        self.F = M.fixed_prims(P)
        self.plate_outer = None

    def eye(self, p, t):
        P = self.P
        R, PX, PY = M.eye_points(P, p, t)
        aX = self.hX.ik(PX); aY = self.hY.ik(PY)
        if aX is None or aY is None: return None
        rx, (Ax, Hx, dx, ex) = M.rod_prims(P, 'X', PX, self.hX, aX, R)
        ry, (Ay, Hy, dy, ey) = M.rod_prims(P, 'Y', PY, self.hY, aY, R)
        hx = M.horn_prims(P, 'X', self.hX, aX, Ax, Hx, dx)
        hy = M.horn_prims(P, 'Y', self.hY, aY, Ay, Hy, dy)
        bf = M.ball_prims(P, R)
        if self.plate_outer is not None:
            bf += M.uchwyt_prims(P, R, self.W, self.plate_outer)
        return dict(R=R, rx=rx, ry=ry, hx=hx, hy=hy, bf=bf, aX=aX, aY=aY)

    def lids(self, which, ts):
        c = self.P['LG'] if which == 'G' else self.P['LD']; sg = 1 if which == 'G' else -1
        st, L = M.lid_traj(c, sg, ts)
        return [M.lid_prims(self.P, which, t, J, H, b) for t, (J, H, b) in zip(ts, st)]


# ------------------------------------------------------------------ wykluczenia i styki zamierzone
def excluded(A, B):
    pair = {A.name, B.name}
    if pair == {'kardan dolny', 'kardan górny'}: return True                    # wnętrze kardana (zgięcie > 90°)
    for s, srv in (('X', 'S_X'), ('Y', 'S_Y')):
        if pair == {s + ' obudowa M5', s + ' czop M5'}: return True          # przegub
        if pair == {s + ' obudowa M2', 'czop M2 ' + s}: return True          # przegub
        if pair <= {s + ' czop M5', s + ' Ramię', s + ' piasta Ramienia', s + ' podkładka M5'}: return True   # jedna bryła / gwint
        if srv + ' wieża' in pair and (pair & {s + ' Ramię', s + ' piasta Ramienia'}): return True   # Ramię na wielowypuście
    for w, srv in (('G', 'S_PG'), ('D', 'S_PD')):
        if srv + ' wieża' in pair and (pair & {w + ' ramię serwa', w + ' piasta ramienia'}): return True
    return False


def intended(A, B):
    n = {A.name, B.name}
    for w in ('G', 'D'):
        if any(x.startswith('słupek stopu ' + w) for x in n) and (n & {w + ' ramię serwa', w + ' piasta ramienia'}):
            return True
    return False


# ------------------------------------------------------------------ generatory par
def eye_pairs(S, Fs, near_ball):
    mov = S['rx'] + S['ry'] + S['hx'] + S['hy']
    for A in mov:
        for B in Fs: yield A, B
    for A in S['rx'] + S['hx']:
        for B in S['ry'] + S['hy']: yield A, B
    for own, rod in ((S['hx'], S['rx']), (S['hy'], S['ry'])):
        for A in own:
            for B in rod: yield A, B
    for A in S['rx'] + S['ry']:
        for B in S['bf']: yield A, B
    for A in S['bf']:
        if A.kind in ('cap', 'cyl', 'obb'):
            for B in near_ball: yield A, B
    for B in near_ball: yield B, S['bf'][0]


def lid_pairs(prims, w, Fs, sphere, near_lid):
    shell = prims[0]
    for A in prims[1:]:
        for B in Fs: yield A, B
        if A.name in (w + ' drut', w + ' zaczep J', w + ' wypust zaczepu'): yield A, sphere
        if A.name == w + ' drut': yield A, shell
    for B in near_lid: yield B, shell


def cross_pairs(S, prims):
    for A in S['rx'] + S['ry'] + S['hx'] + S['hy']:
        for B in prims: yield A, B


# ------------------------------------------------------------------ rejestr
class Reg:
    def __init__(self): self.d = {}

    def merge(self, d):
        for k, e in d.items():
            f = self.d.setdefault(k, dict(praca=[99.0, None], calosc=[99.0, None]))
            for key in ('praca', 'calosc'):
                if e[key][0] < f[key][0]: f[key] = e[key]

    def up(self, a, b, v, work, info):
        k = tuple(sorted((a, b)))
        e = self.d.setdefault(k, dict(praca=[99.0, None], calosc=[99.0, None]))
        if work and v < e['praca'][0]: e['praca'] = [float(v), info]
        if v < e['calosc'][0]: e['calosc'] = [float(v), info]


def put(reg, A, B, work, info, sel=None):
    if sel is not None and {A.name, B.name} != sel:
        return
    if excluded(A, B): return
    v = ev(A, B)
    if v is None: return
    if intended(A, B):
        reg.up(A.name, B.name + ' (styk zamierzony)', v, work, info)
    else:
        reg.up(A.name, B.name, v, work, info)


# ------------------------------------------------------------------ płyta okna: wycięcie po obwiedni prętów
def plate_cut(model, poses):
    P = model.P; zc = P['oknoZ']; half = P['plytaT'] / 2
    nb = 720; rmin = np.full(nb, 99.0); rrib = np.full(nb, 99.0)
    for (p, t) in poses:
        S = model.eye(p, t)
        if S is None: continue
        R = S['R']
        for pr in S['rx'] + S['ry']:
            pts = surface_pts(pr, 0.25)
            Xb = pts @ R
            for (z0, z1, arr) in ((zc - half - 0.5, zc + half + 0.5, rmin), (zc + half - 0.5, P['zebroZ1'] + 0.5, rrib)):
                m = (Xb[:, 2] >= z0) & (Xb[:, 2] <= z1)
                if m.any():
                    q = Xb[m]; ph = np.arctan2(q[:, 1], q[:, 0]); rr = np.hypot(q[:, 0], q[:, 1])
                    k = ((ph + np.pi) / (2 * np.pi) * nb).astype(int) % nb
                    np.minimum.at(arr, k, rr)
    return rmin, rrib


def surface_pts(pr, step):
    if pr.kind == 'cyl':
        return M.cyl_samples(pr.p, pr.q, pr.r, step)[0]
    a = pr.q - pr.p
    cy = M.cyl_samples(pr.p, pr.q, pr.r, step)[0] if np.linalg.norm(a) > 1e-6 else np.zeros((0, 3))
    n = int(4 * np.pi * pr.r ** 2 / step ** 2) + 50
    u = np.random.default_rng(0).normal(size=(n, 3)); u /= np.linalg.norm(u, axis=1)[:, None]
    return np.vstack([cy, pr.p + pr.r * u, pr.q + pr.r * u])


def plate_polygon(P, rmin, clear=0.6):
    nb = len(rmin); deg = np.degrees((np.arange(nb) + 0.5) / nb * 2 * np.pi - np.pi)
    cut = np.minimum(P['plytaRout'], rmin - clear)
    nodes = []
    for f in range(-180, 180, 5):
        m = np.abs(((deg - f + 180) % 360) - 180) <= 5.0
        nodes.append((f, float(np.floor(cut[m].min() * 100) / 100)))
    poly = np.array([[r * np.cos(np.radians(f)), r * np.sin(np.radians(f))] for f, r in nodes])
    return poly, nodes


def lid_lid_gap(P):
    """szczelina krawędzi przednich na ogranicznikach zamknięcia: 2ρ·sin(Δ/2), Δ = 3° − 2·0,75° + 2δ(x)."""
    Ri = P['LID']['Rin']
    gap_nom = 3.0 - (P['tG'][1] - P['tG'][0]) - (P['tD'][1] - P['tD'][0])
    best = (99, None)
    for x in np.arange(0, 31.0, 0.1):
        rho = np.sqrt(Ri * Ri - x * x)
        delta = max(0.0, (0.6 / rho - gap_nom * d2r) / 2)
        g = 2 * rho * np.sin((gap_nom * d2r + 2 * delta) / 2)
        if g < best[0]: best = (g, x)
    return dict(szczelina_min=round(best[0], 3), przy_x=round(best[1], 1), luz_osi=0.4, po_luzie=round(best[0] - 0.4, 3),
                kolnierz_rant=round(P['rura']['kolnR'] - np.sqrt(max(P['LID']['Rrant'] ** 2 - P['rura']['kolnZ0'] ** 2, 0)), 3))


# ------------------------------------------------------------------ równoległość (fork: kontekst dziedziczony)
_CTX = {}


def _job(args):
    fn, chunk = args
    reg = Reg(); _CTX[fn](chunk, reg)
    return reg.d


def par(fn, items, reg, nproc=None):
    nproc = nproc or max(1, (os.cpu_count() or 2) - 2)
    if len(items) < 8 or nproc == 1:
        _CTX[fn](items, reg); return
    k = max(1, len(items) // (nproc * 4))
    chunks = [items[i:i + k] for i in range(0, len(items), k)]
    with mp.get_context('fork').Pool(nproc) as pool:
        for d in pool.imap_unordered(_job, [(fn, c) for c in chunks]):
            reg.merge(d)


# ------------------------------------------------------------------ przebieg
def run(P, szybko=False, out='przemiatanie.json', log=print):
    t00 = time.time()
    on = os.environ.get('OKNO', 'okno.json')
    okno = json.load(open(on)); W = np.load(on.replace('.json', '_splajn.npy'))
    model = Model(P, W); ER = EyeRange(okno); Wk = P['praca']
    st = 2.0 if szybko else 1.0
    grid = [(float(p), float(t)) for p in np.arange(-28.5, 28.5 + 1e-9, st) for t in np.arange(-18.5, 18.5 + 1e-9, st) if ER.inside(p, t)]
    poses = grid + ER.boundary(120 if szybko else 360)
    def ework(p, t): return abs(p) <= Wk[0] + 1e-9 and abs(t) <= Wk[1] + 1e-9
    # płyta okna
    rmin, rrib = plate_cut(model, poses[::(3 if szybko else 1)])
    poly, nodes = plate_polygon(P, rmin)
    model.plate_outer = poly
    import okno as O
    rW = O.radial_fn(W)
    bridges = [(f, r, round(r - float(rW(np.radians(f))), 2)) for f, r in nodes if r < P['plytaRout'] - 1e-6]
    rib = []
    for f in range(-180, 180, 5):
        k = int(((np.radians(f) + np.pi) / (2 * np.pi) * len(rrib))) % len(rrib)
        if rrib[k] < 40: rib.append((f, round(float(rrib[k] - 0.5 - rW(np.radians(f))), 2)))
    log("płyta okna: %d węzłów wycięcia; najwęższy mostek %s" % (len(bridges), min(bridges, key=lambda b: b[2]) if bridges else None))

    F = model.F
    Fs = [f for f in F if f.kind in ('cap', 'cyl', 'obb')] + [f for f in F if f.kind in ('tube', 'prism')]
    near_ball = [f for f in F if f.kind in ('cap', 'cyl', 'obb') and np.linalg.norm(f.c) - f.rad < P['kulaR'] + THR]
    near_lid = [f for f in F if f.kind in ('cap', 'cyl', 'obb') and np.linalg.norm(f.c) - f.rad < P['LID']['Rrant'] + THR]
    sphere = M.Prim('sphere', 'gałka R30 (dowolne położenie)', c=np.zeros(3), r=P['kulaR'])
    reg = Reg()
    tG, tD = P['tG'], P['tD']; stL = 2.0 if szybko else 1.0
    tsG = sorted(set([float(x) for x in np.arange(tG[0], tG[3], stL)] + [tG[1], tG[2], tG[3]]))
    tsD = sorted(set([float(x) for x in np.arange(tD[0], tD[3], stL)] + [tD[1], tD[2], tD[3]]))
    def lwork(w, t): r = tG if w == 'G' else tD; return r[1] - 1e-9 <= t <= r[2] + 1e-9
    LG = model.lids('G', tsG); LD = model.lids('D', tsD)

    def do_eye(plist, reg_, sel=None):
        for (p, t) in plist:
            S = model.eye(p, t)
            if S is None: continue
            w = ework(p, t); info = ['gałka', round(p, 3), round(t, 3)]
            for A, B in eye_pairs(S, Fs, near_ball): put(reg_, A, B, w, info, sel)
    _CTX['eye'] = lambda ch, r: do_eye(ch, r)
    par('eye', poses, reg)
    log("gałka: %.0f s" % (time.time() - t00))

    for w, ts, L in (('G', tsG, LG), ('D', tsD, LD)):
        for t, prims in zip(ts, L):
            for A, B in lid_pairs(prims, w, Fs, sphere, near_lid):
                put(reg, A, B, lwork(w, t), ['powieka ' + w, round(t, 3)])
    # G × D
    def bbox(prims):
        X = np.array([q.c for q in prims[1:]]); rr = np.array([q.rad for q in prims[1:]])
        return (X - rr[:, None]).min(0), (X + rr[:, None]).max(0)
    BG = [bbox(p) for p in LG]; BD = [bbox(p) for p in LD]
    def do_gd(items, reg_):
        for (ig, ) in items:
            tg, pg, bg = tsG[ig], LG[ig], BG[ig]
            for (td, pd, bd) in zip(tsD, LD, BD):
                gap = np.max(np.maximum(bd[0] - bg[1], bg[0] - bd[1]))
                wk = lwork('G', tg) and lwork('D', td); info = ['powieki', round(tg, 3), round(td, 3)]
                if gap > THR:
                    reg_.up('G części', 'D części', float(gap), wk, info)
                else:
                    for A in pg[1:]:
                        for B in pd[1:]: put(reg_, A, B, wk, info)
                for A in pg[1:]: put(reg_, A, pd[0], wk, info)
                for B in pd[1:]: put(reg_, B, pg[0], wk, info)
    _CTX['gd'] = do_gd
    par('gd', [(i,) for i in range(len(tsG))], reg)
    log("powieki: %.0f s" % (time.time() - t00))

    # gałka × powieki (części gałki wobec czasz i części powiek); szybkie odrzucenie po obwiedniach
    Lall = [('G', t, p, b) for t, p, b in zip(tsG, LG, BG)] + [('D', t, p, b) for t, p, b in zip(tsD, LD, BD)]
    def do_cross(plist, reg, lsel=None, sel=None):
        for (p, t) in plist:
            S = model.eye(p, t)
            if S is None: continue
            we = ework(p, t)
            mov = S['rx'] + S['ry'] + S['hx'] + S['hy']
            for (w, tl, prims, bb) in (lsel if lsel is not None else Lall):
                wk = we and lwork(w, tl); info = ['gałka×powieka ' + w, round(p, 3), round(t, 3), round(tl, 3)]
                for A in mov:
                    gap = np.max(np.maximum(bb[0] - (A.c + A.rad), (A.c - A.rad) - bb[1]))
                    if gap <= THR:
                        for B in prims[1:]: put(reg, A, B, wk, info, sel)
                    put(reg, A, prims[0], wk, info, sel)
    _CTX['cross'] = lambda ch, r: do_cross(ch, r)
    par('cross', poses[::(3 if szybko else 1)], reg)
    log("gałka × powieki: %.0f s" % (time.time() - t00))

    # zagęszczenie przy minimach: ±1° co 0,25, potem ±0,25 co 0,05 (gałka i powieki)
    cand = sorted([(min(v['praca'][0], v['calosc'][0]), k) for k, v in reg.d.items()])
    cand = [c for c in cand if c[0] < 1.0 and 'zamierzony' not in c[1][0] + c[1][1] and c[1] != ('D części', 'G części')][:30]
    for (val, k) in cand:
        sel = set(x.replace(' (styk zamierzony)', '') for x in k)
        for key in ('praca', 'calosc'):
            for (span, stp) in ((1.0, 0.25), (0.25, 0.05)):
                info = reg.d[k][key][1]
                if info is None: continue
                kind = info[0]
                if kind == 'gałka':
                    p0, t0 = info[1], info[2]
                    pl = [(p0 + a, t0 + b) for a in np.arange(-span, span + 1e-9, stp) for b in np.arange(-span, span + 1e-9, stp)
                          if ER.inside(p0 + a, t0 + b) and (key == 'calosc' or ework(p0 + a, t0 + b))]
                    _CTX['eye_sel'] = lambda ch, r, _s=sel: do_eye(ch, r, _s)
                    par('eye_sel', pl, reg)
                elif kind.startswith('powieka '):
                    w = kind[-1]; rr = tG if w == 'G' else tD; t0 = info[1]
                    tl = [t0 + a for a in np.arange(-span, span + 1e-9, stp) if rr[0] - 1e-9 <= t0 + a <= rr[3] + 1e-9]
                    if key == 'praca': tl = [x for x in tl if lwork(w, x)]
                    for tt, prims in zip(tl, model.lids(w, tl)):
                        for A, B in lid_pairs(prims, w, Fs, sphere, near_lid):
                            put(reg, A, B, lwork(w, tt), ['powieka ' + w, round(tt, 3)], sel)
                elif kind.startswith('gałka×powieka'):
                    w = kind[-1]; rr = tG if w == 'G' else tD; p0, t0, l0 = info[1], info[2], info[3]
                    tl = [l0 + a for a in np.arange(-span, span + 1e-9, stp) if rr[0] - 1e-9 <= l0 + a <= rr[3] + 1e-9]
                    if key == 'praca': tl = [x for x in tl if lwork(w, x)]
                    Ls = model.lids(w, tl)
                    lsel = [(w, tt, pp, bbox(pp)) for tt, pp in zip(tl, Ls)]
                    pl = [(p0 + a, t0 + b) for a in np.arange(-span, span + 1e-9, stp) for b in np.arange(-span, span + 1e-9, stp)
                          if ER.inside(p0 + a, t0 + b) and (key == 'calosc' or ework(p0 + a, t0 + b))]
                    _CTX['cross_sel'] = lambda ch, r, _l=lsel, _s=sel: do_cross(ch, r, _l, _s)
                    par('cross_sel', pl, reg)
    log("zagęszczenie: %.0f s" % (time.time() - t00))
    res = dict(pary=[[list(k), v['praca'][0], v['praca'][1], v['calosc'][0], v['calosc'][1]] for k, v in reg.d.items()],
               plyta_wezly=nodes, mostki=bridges, zebro=rib, powieki=lid_lid_gap(P),
               okno=dict(zapas_praca=okno['zapas_praca'], tabela=okno['tabela_r'], styk=okno['styk_z_azymut'], M4=okno['odl_od_otworu_M4']),
               stale=dict(LX=model.hX.L, LY=model.hY.L, dX=list(model.hX.d0), dY=list(model.hY.d0)))
    json.dump(res, open(out, 'w'), indent=0, ensure_ascii=False, default=float)
    return res


def top(res, n=10):
    rows = [r for r in res['pary'] if not any('zamierzony' in x for x in r[0]) and r[0] != ['D części', 'G części']]
    tw = sorted([r for r in rows if r[1] < 50], key=lambda r: r[1])[:n]
    tc = sorted([r for r in rows if r[3] < 50], key=lambda r: r[3])[:n]
    st = sorted([r for r in res['pary'] if any('zamierzony' in x for x in r[0])], key=lambda r: r[1])
    return tw, tc, st


def report(res, log=print):
    tw, tc, st = top(res)
    log("== 10 najciaśniejszych par w zakresie pracy")
    for r in tw: log("  %6.3f  %-32s – %-36s %s" % (r[1], r[0][0], r[0][1], r[2]))
    log("== 10 najciaśniejszych par w całym zakresie (do ograniczników)")
    for r in tc: log("  %6.3f  %-32s – %-36s %s" % (r[3], r[0][0], r[0][1], r[4]))
    log("== styki zamierzone (ramię powieki – słupek stopu): w pracy / cały zakres")
    for r in st: log("  %6.3f / %6.3f  %s – %s" % (r[1], r[3], r[0][0], r[0][1]))
    log("okno – Słupek (styk zamierzony): zapas w pracy %s" % res['okno']['zapas_praca'])
    log("powieki G–D i kołnierz: %s" % res['powieki'])
    log("mostki płyty okna (φ, r zewn., szerokość): %s" % res['mostki'])


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    P = M.params(args[0] if args else None)
    res = run(P, szybko='--szybko' in sys.argv, out=os.environ.get('OUT', 'przemiatanie.json'))
    report(res)
