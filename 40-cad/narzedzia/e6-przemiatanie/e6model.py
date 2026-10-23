#!/usr/bin/env python3
"""Model kontrolny dużego oka 2c, wersja v3.1 (E6.1d).

Jedno źródło parametrów (`DEF`, nadpisywane plikiem JSON), kinematyka gałki i powiek,
bryły jako prymitywy z DOKŁADNĄ funkcją odległości punktu (ze znakiem) i z próbnikiem
powierzchni o znanym promieniu pokrycia. Odległość pary = min po próbkach bryły A funkcji
odległości bryły B, minus promień pokrycia próbek (dolne ograniczenie). Prymityw kapsuła
próbkuje oś (funkcja odległości jest 1-lipschitzowska, błąd ≤ krok/2).

Układ: O = środek kuli, +z z dyni, +y w górę, +x w prawo patrząc na dynię.
Gałka: R = Rx(-θ)·Ry(ψ), θ+ = góra. Kąty w stopniach, długości w mm.
"""
import numpy as np, json, copy

d2r = np.pi / 180.0

# ============================================================== parametry
DEF = dict(
    # gałka
    kulaR=30.0, kulaRin=28.0, rim=115.0,
    rimCuts=[[0.0, 25.0, 104.0], [80.0, 35.0, 106.0]],   # [azymut środka, pół-szerokość, krawędź] (stopnie)
    pktR=19.5, pktZ=-6.0,
    # serwa (płaszczyzna orczyka fabrycznego xh, wałek y/z, n: +1 orczyk w +x)
    ramieTipR=4.5,
    S_X=dict(xh=18.013, yc=-13.0, zs=-49.0, n=+1, flip=False),
    S_Y=dict(xh=10.229, yc=3.0, zs=-49.0, n=+1, flip=False),
    S_PG=dict(xh=-30.0, yc=18.0, zs=-60.0, n=-1, flip=True),
    S_PD=dict(xh=-21.0, yc=-27.0, zs=-49.0, n=-1, flip=False),
    serwoW=12.5, luzSerwa=0.4, klatka=2.0,
    kabelStrona='przeciwna',          # 'przeciwna' do wałka (e6-pomiary.md) albo 'walek'
    rX=13.0, rY=15.0, ramieT=6.0, ramieW=8.0, ramieHubR=7.0,
    # przeguby (B1) – wariant odniesienia h 7 / obudowa M5 Ø12
    # gniazdo: walec o osi wzdłuż czopu (gD × gH, środek w środku kuli); trzon: walec wzdłuż pręta (sD, od środka kuli do L)
    M2=dict(h=4.0, cokol=1.0, cokolR=2.0, gD=7.0, gH=6.0, sD=5.0, L=9.0, nutR=2.31, nutL=1.6, bossR=3.0, bossL=5.0, kat=30.0),
    M5=dict(h=7.0, cokol=1.0, cokolR=4.0, gD=12.0, gH=10.0, sD=8.0, L=12.0, nutR=4.62, nutL=4.0, studR=2.5, studTailX=0.0, studTailY=0.5, kat=25.0),
    rodR=2.25, endR=4.0, endL=5.0, fazaGniazdaM5=1.0, fazaPiastyM2=0.75,
    # Słupek, kardan, wspornik, Rama, Płyta
    slupekR=7.65, slupekZ0=-33.0, slupekZ1=-5.5,
    kardanR=5.5, kardanDolZ0=-12.75, kardanDolZ1=5.5, kardanGoraZ0=-4.0, kardanGoraZ1=12.75,
    piastaZ0=-37.0, piastaZ1=-33.0, piastaR=9.0,
    ramionaKaty=[100.0, 200.0, 310.0], ramieWspW=5.0, ramieWspH=4.0, slupekPlytyR=33.0, slupekPlytyD=6.0,
    uchoRamyR0=30.5, uchoRamyR1=37.75, uchoRamyW=8.0, uchoRamyZ0=-33.0, uchoRamyZ1=-27.0,
    tarczaZ0=-71.3, tarczaZ1=-68.3, tarczaR=39.5,
    oknaTarczy=[[-35.5, -24.5, -7.0, 14.0], [-26.0, -17.0, -21.0, -6.0]],
    rura=dict(R=37.75, z0=-37.0, z1=12.0, kolnR=35.2, kolnZ0=6.0, obwR=39.75, rantSferaR=152.0),
    # Uchwyt (układ gałki)
    oknoZ=-6.0, plytaT=3.0, plytaRout=27.0, zebroZ1=-2.0,
    laczniki=[135.0, 225.0, 315.0], lacznikR=2.0,
    nadlewy=[210.0, 330.0], nadlewR=3.5, nadlewRpol=24.0, nadlewZ=[-16.0, -10.0],
    piastaPrzodZ0=6.3, piastaPrzodR=7.65,
    # powieki
    LID=dict(Rin=31.2, Rout=33.4, Rrant=34.7, rantKat=6.5),
    G_SPAN=99.5, D_SPAN=79.0, G_CUT=[-2.0, 24.0, 83.5], G_CUT2=[-31.0, -17.0, 96.5], D_CUT2=[-31.0, -17.0, 76.0],
    LG=dict(xJ=-22.0, rho=25.61694307060082, ph=92.0, xh=-30.0, yc=18.0, zs=-60.0, r=20.0, b0=135.0,
            ramieT=3.0, ramieW=6.0, hubR=4.5, legJ=-1, legH=+1, f=0.40),
    LD=dict(xJ=-22.0, rho=25.61694307060082, ph=-92.0, xh=-21.0, yc=-27.0, zs=-49.0, r=17.5, b0=30.0,
            ramieT=2.0, ramieW=5.0, hubR=4.5, legJ=-1, legH=-1, f=0.15),
    tG=[-0.25, 0.5, 56.0, 56.75], tD=[-0.25, 0.5, 32.0, 32.75],   # ogr. zamknięcia, praca od, praca do, ogr. otwarcia
    drutR=0.6, drutRi=1.2, drutOgon=2.0, zaczepT=2.4, zaczepR=2.0,
    slupkiStopuA=6.0, slupkiStopuRho=8.5,
    # zakres gałki
    praca=[25.0, 15.0], ogr=[28.0, 18.0],
)


def params(path=None, over=None):
    P = copy.deepcopy(DEF)
    if path:
        with open(path) as f:
            u = json.load(f)
        _merge(P, u)
    if over:
        _merge(P, over)
    return P


def _merge(a, b):
    for k, v in b.items():
        if k.startswith('_'):
            continue
        if isinstance(v, dict) and isinstance(a.get(k), dict):
            _merge(a[k], v)
        else:
            a[k] = v


# ============================================================== rotacje
def Rx(t):
    c, s = np.cos(t), np.sin(t); return np.array([[1, 0, 0], [0, c, -s], [0, s, c]])


def Ry(p):
    c, s = np.cos(p), np.sin(p); return np.array([[c, 0, s], [0, 1, 0], [-s, 0, c]])


def Reye(psi, theta):
    return Rx(-theta * d2r) @ Ry(psi * d2r)


def rot_x(v, a):
    ca, sa = np.cos(a), np.sin(a)
    return np.array([v[0], v[1] * ca - v[2] * sa, v[1] * sa + v[2] * ca])


# ============================================================== prymitywy
class Prim:
    """kind: cap, cyl, obb, tube, lid, ball, prism, sphere. dist(pts)->(N,) ze znakiem."""
    def __init__(self, kind, name, **kw):
        self.kind = kind; self.name = name; self.__dict__.update(kw)
        self._bs()

    def _bs(self):
        k = self.kind
        if k == 'cap':
            self.c = (self.p + self.q) / 2; self.rad = np.linalg.norm(self.q - self.p) / 2 + self.r
        elif k == 'cyl':
            self.c = (self.p + self.q) / 2; self.rad = np.hypot(np.linalg.norm(self.q - self.p) / 2, self.r)
        elif k == 'obb':
            self.c = self.ctr; self.rad = np.linalg.norm(self.h)
        elif k == 'ann':
            self.c = (self.p + self.q) / 2; self.rad = np.hypot(np.linalg.norm(self.q - self.p) / 2, self.r)
        elif k == 'sphere':
            self.rad = self.r
        else:
            self.c = np.zeros(3); self.rad = 1e9

    # ---------- odległość ze znakiem
    def dist(self, X):
        k = self.kind
        if k == 'cap':
            return seg_pt(self.p, self.q, X) - self.r
        if k == 'cyl':
            return cyl_d(self.p, self.q, self.r, X)
        if k == 'obb':
            return obb_d(self.ctr, self.ax, self.h, X)
        if k == 'ann':
            return ann_d(self.p, self.q, self.ri, self.r, X)
        if k == 'sphere':
            return np.linalg.norm(X - self.c, axis=1) - self.r
        if k == 'tube':
            return tube_d(self.T, X)
        if k == 'lid':
            return lid_d(self.blocks, X)
        if k == 'ball':
            return ball_d(self.blocks, (X - 0) @ self.Rm)      # X świat -> układ gałki: X @ R
        if k == 'prism':
            Xb = X @ self.Rm if self.Rm is not None else X
            return prism_d(self, Xb)
        raise ValueError(k)

    # ---------- próbki powierzchni (pts, eps); dla kapsuły: oś (pts, r, eps)
    def samples(self, step):
        k = self.kind
        if k == 'cap':
            L = np.linalg.norm(self.q - self.p); n = max(2, int(np.ceil(L / step)) + 1)
            s = np.linspace(0, 1, n)[:, None]
            return self.p + s * (self.q - self.p), self.r, (L / (n - 1)) / 2 if n > 1 else 0.0
        if k == 'cyl':
            return cyl_samples(self.p, self.q, self.r, step)
        if k == 'obb':
            return obb_samples(self.ctr, self.ax, self.h, step)
        if k == 'ann':
            a, _, e1 = cyl_samples(self.p, self.q, self.r, step)
            b, _, e2 = cyl_samples(self.p, self.q, self.ri, step)
            return np.vstack([a, b]), 0.0, max(e1, e2)
        raise ValueError('brak próbnika: ' + k)


def cap(name, p, q, r): return Prim('cap', name, p=np.asarray(p, float), q=np.asarray(q, float), r=float(r))
def cyl(name, p, q, r): return Prim('cyl', name, p=np.asarray(p, float), q=np.asarray(q, float), r=float(r))


def ann(name, p, q, ri, r):
    return Prim('ann', name, p=np.asarray(p, float), q=np.asarray(q, float), ri=float(ri), r=float(r))


def ann_d(p, q, ri, r, X):
    """walec drążony (tuleja): przekrój południkowy to prostokąt [ri, r] × [0, L] – dokładnie."""
    a = q - p; L = np.linalg.norm(a); a = a / L
    v = X - p; t = v @ a; rad = np.linalg.norm(v - t[:, None] * a, axis=1)
    dr = np.maximum(np.maximum(rad - r, ri - rad), 0); dt = np.maximum(np.maximum(-t, 0), t - L)
    out = np.hypot(dr, dt)
    ins = (dr == 0) & (dt == 0)
    out[ins] = -np.minimum(np.minimum(r - rad[ins], rad[ins] - ri), np.minimum(t[ins], L - t[ins]))
    return out


def obb(name, ctr, ax, h):
    return Prim('obb', name, ctr=np.asarray(ctr, float), ax=np.asarray(ax, float), h=np.asarray(h, float))


def obb_seg(name, a, b, side, t, w, ext=0.0):
    """prostopadłościan wzdłuż odcinka a->b (przedłużonego o ext), grubość t wzdłuż `side`, szerokość w."""
    a = np.asarray(a, float); b = np.asarray(b, float)
    e = b - a; L = np.linalg.norm(e); e /= L
    s = np.asarray(side, float); s = s - (s @ e) * e; s /= np.linalg.norm(s)
    wv = np.cross(e, s)
    ctr = (a + b) / 2
    return obb(name, ctr, np.stack([e, s, wv], 1), [L / 2 + ext, t / 2, w / 2])


# ============================================================== funkcje odległości
def seg_pt(p, q, X):
    v = q - p; vv = v @ v
    t = np.clip(((X - p) @ v) / vv, 0, 1) if vv > 1e-12 else np.zeros(len(X))
    return np.linalg.norm(X - (p + t[:, None] * v), axis=1)


def cyl_d(p, q, r, X):
    a = q - p; L = np.linalg.norm(a); a = a / L
    v = X - p; t = v @ a; rad = np.linalg.norm(v - t[:, None] * a, axis=1)
    dt = np.maximum(np.maximum(-t, 0), t - L); dr = np.maximum(rad - r, 0)
    out = np.hypot(dt, dr)
    ins = (dt == 0) & (dr == 0)
    out[ins] = -np.minimum(r - rad[ins], np.minimum(t[ins], L - t[ins]))
    return out


def obb_d(ctr, ax, h, X):
    L = (X - ctr) @ ax               # współrzędne lokalne
    q = np.abs(L) - h
    out = np.linalg.norm(np.maximum(q, 0), axis=1) + np.minimum(np.max(q, axis=1), 0)
    return out


def tube_d(T, X):
    """rura: suma pierścieni zewnętrznych {rho >= R, z0 <= z <= z1}; dokładnie."""
    rho = np.hypot(X[:, 0], X[:, 1]); z = X[:, 2]
    best = np.full(len(X), 1e9)
    for (R, z0, z1) in T:
        dz = np.maximum(np.maximum(z0 - z, 0), z - z1); dr = np.maximum(R - rho, 0)
        d = np.hypot(dz, dr)
        ins = (dz == 0) & (dr == 0)
        d[ins] = -np.minimum(rho[ins] - R, np.minimum(z[ins] - z0, z1 - z[ins]))
        best = np.minimum(best, d)
    return best


def _d2_annsector(u, v, Ri, Ro, a0, a1):
    """2D: odległość punktów (u,v) od wycinka pierścienia {Ri<=r<=Ro, a0<=atan2(v,u)<=a1} (a w rad, a1-a0 <= pi).
    Zwraca odległość (>=0, 0 wewnątrz)."""
    r = np.hypot(u, v); a = np.arctan2(v, u)
    mid = (a0 + a1) / 2
    da = (a - mid + np.pi) % (2 * np.pi) - np.pi
    half = (a1 - a0) / 2
    inside_ang = np.abs(da) <= half
    d_rad = np.maximum(np.maximum(Ri - r, 0), r - Ro)
    out = np.where(inside_ang, d_rad, 1e9)
    for ae in (a0, a1):
        c, s = np.cos(ae), np.sin(ae)
        # odcinek od Ri do Ro wzdłuż kierunku ae
        t = np.clip(u * c + v * s, Ri, Ro)
        out = np.minimum(out, np.hypot(u - t * c, v - t * s))
    return out


def _d_shellwedge(X, Ri, Ro, a0, a1, x0, x1):
    """odległość od bryły {Ri<=|p|<=Ro, a0<=alfa<=a1 (alfa = atan2(y,z) wokół osi x), x0<=x<=x1} (bez znaku, 0 w środku).
    Dokładnie: najbliższy punkt leży w półpłaszczyźnie alfa punktu (jeśli w klinie) albo na ścianie klina.
    Granice x są płaszczyznami x=const (pasy wycięcia); a1-a0 <= 180°."""
    x = X[:, 0]; y = X[:, 1]; z = X[:, 2]
    rho = np.hypot(y, z); al = np.arctan2(y, z)
    mid = (a0 + a1) / 2; half = (a1 - a0) / 2
    da = (al - mid + np.pi) % (2 * np.pi) - np.pi
    inw = np.abs(da) <= half
    # (1) w klinie: zagadnienie 2D w półpłaszczyźnie (x, rho>=0): pierścień ∩ pas x
    d_in = _d2_ring_strip(x, rho, Ri, Ro, x0, x1)
    out = np.where(inw, d_in, 1e9)
    # (2) ściany klina
    for ae in (a0, a1):
        dd = al - ae
        u = rho * np.cos(dd); w = rho * np.sin(dd)      # u: współrzędna w półpłaszczyźnie, w: odległość od płaszczyzny
        d2 = _d2_ring_strip(x, u, Ri, Ro, x0, x1, halfplane=True)
        out = np.minimum(out, np.hypot(w, d2))
    return out


def _d2_ring_strip(x, v, Ri, Ro, x0, x1, halfplane=False):
    """2D: odległość od {Ri<=hypot(x,v)<=Ro, v>=0, x0<=x<=x1}."""
    r = np.hypot(x, v)
    ins = (r >= Ri) & (r <= Ro) & (v >= 0) & (x >= x0) & (x <= x1)
    best = np.full(len(x), 1e9)
    # łuki r=Ri i r=Ro (v>=0, x w pasie)
    for R in (Ri, Ro):
        ang = np.arctan2(np.maximum(v, 0) if False else v, x)   # kąt punktu
        # punkt rzutu radialnego na okrąg
        px = R * np.cos(ang); pv = R * np.sin(ang)
        ok = (pv >= 0) & (px >= x0) & (px <= x1)
        d = np.abs(r - R)
        best = np.where(ok, np.minimum(best, d), best)
        # końce łuku: przecięcia okręgu z v=0 i x=x0, x1
        for (ex, ev) in _arc_ends(R, x0, x1):
            best = np.minimum(best, np.hypot(x - ex, v - ev))
    # odcinek v=0, x w [Ri,Ro]∪[-Ro,-Ri] ∩ [x0,x1]
    for (s0, s1) in ((Ri, Ro), (-Ro, -Ri)):
        a, b = max(s0, x0), min(s1, x1)
        if a <= b:
            t = np.clip(x, a, b); best = np.minimum(best, np.hypot(x - t, v))
    # odcinki x=x0 i x=x1: v od sqrt(Ri^2-x^2) (lub 0) do sqrt(Ro^2-x^2)
    for xe in (x0, x1):
        if abs(xe) > Ro:
            continue
        vlo = np.sqrt(max(Ri * Ri - xe * xe, 0)); vhi = np.sqrt(Ro * Ro - xe * xe)
        t = np.clip(v, vlo, vhi); best = np.minimum(best, np.hypot(x - xe, v - t))
    return np.where(ins, 0.0, best)


def _arc_ends(R, x0, x1):
    pts = []
    for xx in (R, -R):
        if x0 <= xx <= x1:
            pts.append((xx, 0.0))
    for xe in (x0, x1):
        if abs(xe) <= R:
            pts.append((xe, np.sqrt(R * R - xe * xe)))
    return pts


def lid_d(blocks, X):
    """powieka = suma bloków (Ri, Ro, a0, a1, x0, x1); odległość bez znaku (wewnątrz 0)."""
    best = np.full(len(X), 1e9)
    for b in blocks:
        best = np.minimum(best, _d_shellwedge(X, *b))
    return best


def _d_cone_wedge(Xb, Ri, Ro, pol, f0, f1):
    """bryła w układzie gałki: {Ri<=|p|<=Ro, kąt biegunowy od +z <= pol, azymut w [f0,f1]} (f1-f0 <= 180°).
    Dokładnie jak w _d_shellwedge, w półpłaszczyźnie południka (rho, z)."""
    x, y, z = Xb[:, 0], Xb[:, 1], Xb[:, 2]
    rho = np.hypot(x, y); fi = np.arctan2(y, x)
    mid = (f0 + f1) / 2; half = (f1 - f0) / 2
    dfi = (fi - mid + np.pi) % (2 * np.pi) - np.pi
    inw = np.abs(dfi) <= half
    # w półpłaszczyźnie: współrzędne (z, rho): kąt od +z
    d_in = _d2_annsector(z, rho, Ri, Ro, 0.0, pol)
    out = np.where(inw, d_in, 1e9)
    for fe in (f0, f1):
        dd = fi - fe
        u = rho * np.cos(dd); w = rho * np.sin(dd)
        # półpłaszczyzna południka fe: punkty (rho'>=0, z); wycinek kąta biegunowego [0,pol]
        d2 = _d2_annsector(z, u, Ri, Ro, 0.0, pol)
        out = np.minimum(out, np.hypot(w, d2))
    return out


def ball_d(blocks, Xb):
    best = np.full(len(Xb), 1e9)
    for b in blocks:
        best = np.minimum(best, _d_cone_wedge(Xb, *b))
    return best


# ---------- graniastosłup z wielokątów (płyta okna, tarcza)
def poly_inside(Q, H, chunk=2000):
    """parzystość przecięć, wektorowo po krawędziach."""
    A = H; B = np.roll(H, -1, 0)
    x1, y1, x2, y2 = A[:, 0], A[:, 1], B[:, 0], B[:, 1]
    out = np.empty(len(Q), bool)
    for i in range(0, len(Q), chunk):
        x = Q[i:i + chunk, 0][:, None]; y = Q[i:i + chunk, 1][:, None]
        c = ((y1[None] > y) != (y2[None] > y)) & (x < (x2 - x1)[None] * (y - y1[None]) / ((y2 - y1)[None] + 1e-300) + x1[None])
        out[i:i + chunk] = (c.sum(1) % 2) == 1
    return out


def poly_edge_d(Q, H, chunk=4000):
    A = H; B = np.roll(H, -1, 0); AB = B - A; L2 = np.sum(AB * AB, 1)
    out = np.empty(len(Q))
    for i in range(0, len(Q), chunk):
        q = Q[i:i + chunk]
        AP = q[:, None, :] - A[None]
        t = np.clip(np.sum(AP * AB[None], -1) / L2[None], 0, 1)
        out[i:i + chunk] = np.linalg.norm(AP - t[..., None] * AB[None], axis=-1).min(1)
    return out


def _radial_of(H):
    ang = np.arctan2(H[:, 1], H[:, 0]); r = np.hypot(H[:, 0], H[:, 1])
    o = np.argsort(ang); ang = ang[o]; r = r[o]
    return np.r_[ang[-1] - 2 * np.pi, ang, ang[0] + 2 * np.pi], np.r_[r[-1], r, r[0]]


def prism_d(pr, Xb, far=2.0):
    """graniastosłup (wielokąt zewnętrzny z otworami) między z0 i z1. Odległość dokładna dla punktów bliżej niż `far`
    (krawędzie wielokątów); dalej zwraca dolne ograniczenie >= far."""
    Q = Xb[:, :2]; z = Xb[:, 2]
    dz = np.maximum(np.maximum(pr.z0 - z, 0), z - pr.z1)
    out = np.full(len(Xb), far + 1.0)
    out = np.maximum(out, dz)
    near = dz < far
    if not near.any():
        return out
    q = Q[near]
    if getattr(pr, 'star', False):
        # wielokąty gwiaździste względem środka: przynależność z funkcji promieniowych
        ph = np.arctan2(q[:, 1], q[:, 0]); r = np.hypot(q[:, 0], q[:, 1])
        ro = np.interp(ph, *pr._ro); rh = np.interp(ph, *pr._rh)
        ins = (r <= ro) & (r >= rh)
        cand = (np.abs(r - ro) < far + 1.5) | (np.abs(r - rh) < far + 1.5)
        d2 = np.full(len(q), far + 1.0)
        if cand.any():
            qq = q[cand]
            dd = star_edge_d(qq, pr._so, far + 1.5)
            dd = np.minimum(dd, star_edge_d(qq, pr._sh, far + 1.5))
            d2[cand] = dd
    else:
        ins = poly_inside(q, pr.outer)
        for h in pr.holes:
            ins &= ~poly_inside(q, h)
        d2 = poly_edge_d(q, pr.outer)
        for h in pr.holes:
            d2 = np.minimum(d2, poly_edge_d(q, h))
    dzn = dz[near]; zn = z[near]
    o = np.where(ins, dzn, np.hypot(d2, dzn))
    in3 = ins & (dzn == 0)
    o[in3] = -np.minimum(d2[in3], np.minimum(zn[in3] - pr.z0, pr.z1 - zn[in3]))
    out[near] = o
    return out


def prism(name, outer, holes, z0, z1, Rm=None, star=False):
    pr = Prim('prism', name, outer=np.asarray(outer, float), holes=[np.asarray(h, float) for h in holes],
              z0=z0, z1=z1, Rm=Rm, star=star)
    if star:
        pr._ro = _radial_of(pr.outer); pr._rh = _radial_of(pr.holes[0])
        pr._so = _sorted_poly(pr.outer); pr._sh = _sorted_poly(pr.holes[0])
    return pr


def _sorted_poly(H):
    ang = np.arctan2(H[:, 1], H[:, 0]); o = np.argsort(ang)
    return H[o], ang[o]


def star_edge_d(Q, S, reach):
    """odległość punktów od brzegu wielokąta gwiaździstego (wierzchołki posortowane kątowo): krawędzie w oknie kątowym,
    które obejmuje wszystkie krawędzie bliższe niż `reach` (dla punktów dalej niż reach wynik >= reach)."""
    H, ang = S; N = len(H)
    ph = np.arctan2(Q[:, 1], Q[:, 0]); r = np.hypot(Q[:, 0], Q[:, 1])
    rmin = np.hypot(H[:, 0], H[:, 1]).min()
    dphi = np.arcsin(np.clip(reach / max(rmin, reach + 1e-6), 0, 1)) + 1e-3
    step = 2 * np.pi / N
    k = int(np.ceil(dphi / step)) + 2
    i0 = np.searchsorted(ang, ph) - 1
    idx = (i0[:, None] + np.arange(-k, k + 1)[None, :]) % N
    A = H[idx]; B = H[(idx + 1) % N]; AB = B - A
    AP = Q[:, None, :] - A
    t = np.clip(np.sum(AP * AB, -1) / np.maximum(np.sum(AB * AB, -1), 1e-12), 0, 1)
    return np.linalg.norm(AP - t[..., None] * AB, axis=-1).min(1)


# ---------- próbniki
def cyl_samples(p, q, r, step):
    a = q - p; L = np.linalg.norm(a); a = a / L
    e1 = np.cross(a, [0.37, 0.53, 0.76]); e1 /= np.linalg.norm(e1); e2 = np.cross(a, e1)
    nc = max(8, int(np.ceil(2 * np.pi * r / step)))
    na = max(2, int(np.ceil(L / step)) + 1)
    ang = np.linspace(0, 2 * np.pi, nc, endpoint=False); s = np.linspace(0, L, na)
    A, S = np.meshgrid(ang, s)
    lat = p + S.reshape(-1, 1) * a + r * (np.cos(A).reshape(-1, 1) * e1 + np.sin(A).reshape(-1, 1) * e2)
    pts = [lat]
    nr = max(1, int(np.ceil(r / step)))
    for end in (p, q):
        for rr in np.linspace(0, r, nr + 1)[:-1]:
            m = max(1, int(np.ceil(2 * np.pi * rr / step)))
            aa = np.linspace(0, 2 * np.pi, m, endpoint=False)
            pts.append(end + rr * (np.cos(aa)[:, None] * e1 + np.sin(aa)[:, None] * e2))
    eps = 0.5 * np.hypot(2 * np.pi * r / nc, L / (na - 1))
    eps = max(eps, 0.5 * np.hypot(r / nr, step))
    return np.vstack(pts), 0.0, eps


def obb_samples(ctr, ax, h, step):
    pts = []; eps = 0.0
    for i in range(3):
        j, k = [m for m in range(3) if m != i]
        nj = max(2, int(np.ceil(2 * h[j] / step)) + 1); nk = max(2, int(np.ceil(2 * h[k] / step)) + 1)
        u = np.linspace(-h[j], h[j], nj); v = np.linspace(-h[k], h[k], nk)
        U, V = np.meshgrid(u, v); U = U.ravel(); V = V.ravel()
        for sgn in (-1, 1):
            loc = np.zeros((len(U), 3)); loc[:, i] = sgn * h[i]; loc[:, j] = U; loc[:, k] = V
            pts.append(ctr + loc @ ax.T)
        eps = max(eps, 0.5 * np.hypot(2 * h[j] / (nj - 1), 2 * h[k] / (nk - 1)))
    return np.vstack(pts), 0.0, eps


# ============================================================== odległość pary
def pair_dist(A, B, step=0.35, fine=0.06, thr=1.2, want_pt=False):
    """dolne ograniczenie odległości A–B. A musi mieć próbnik. Zwraca (d_lb, punkt na A)."""
    if A.kind in ('cap', 'cyl', 'obb') and B.kind in ('cap', 'cyl', 'obb', 'sphere'):
        if np.linalg.norm(A.c - B.c) - A.rad - B.rad > thr + 1.0:
            return 99.0, None
    pts, r, eps = A.samples(step)
    d = B.dist(pts) - r
    i = int(np.argmin(d)); lb = d[i] - eps
    if lb < thr and fine < step:
        pts2, r2, eps2 = A.samples(fine)
        d2 = B.dist(pts2) - r2
        j = int(np.argmin(d2))
        return d2[j] - eps2, pts2[j]
    return lb, pts[i]


# ============================================================== kinematyka gałki
def eye_points(P, psi, theta):
    R = Reye(psi, theta)
    PX = R @ np.array([P['pktR'], 0, P['pktZ']]); PY = R @ np.array([0, P['pktR'], P['pktZ']])
    return R, PX, PY


class Horn:
    """Ramię X/Y: C – środek górnej powierzchni Ramienia na osi wałka, r, czop d (⊥ do średniego kierunku pręta)."""
    def __init__(self, P, name):
        s = P['S_' + name]; self.name = name
        self.r = P['r' + name]; self.h = P['M5']['h']
        self.C = np.array([s['xh'] + 5.0, s['yc'], s['zs']])
        self.xh = s['xh']
        P0 = np.array([P['pktR'], 0, P['pktZ']]) if name == 'X' else np.array([0, P['pktR'], P['pktZ']])
        A0 = self.C + self.r * np.array([0, 1.0, 0])
        u = P0 - A0; u /= np.linalg.norm(u)
        d = np.array([1.0, 0, 0]) - u[0] * u; self.d0 = d / np.linalg.norm(d)
        self.L = np.linalg.norm(P0 - (A0 + self.h * self.d0))
        self.w = self.r * np.array([0, 1.0, 0]) + self.h * self.d0

    def AHd(self, a):
        A = self.C + self.r * rot_x(np.array([0, 1.0, 0]), a)
        d = rot_x(self.d0, a)
        return A, A + self.h * d, d

    def ik(self, Pt):
        """wzór zamknięty, gałąź '−' (w zerze α = 0)."""
        q = Pt - self.C; w = self.w
        K = (w @ w + q @ q - self.L ** 2) / 2
        A = q[1] * w[1] + q[2] * w[2]; B = q[2] * w[1] - q[1] * w[2]
        c = (K - q[0] * w[0]) / np.hypot(A, B)
        if abs(c) > 1:
            return None
        return np.arctan2(B, A) - np.arccos(c)


# ============================================================== kinematyka powiek
def lid_J(c, t, sgn):
    a = (c['ph'] + sgn * t) * d2r
    return np.array([c['xJ'], c['rho'] * np.sin(a), c['rho'] * np.cos(a)])


def lid_L(c, sgn):
    J0 = lid_J(c, 0, sgn); b0 = c['b0'] * d2r
    H0 = np.array([c['yc'] + c['r'] * np.cos(b0), c['zs'] + c['r'] * np.sin(b0)])
    return np.hypot(H0[0] - J0[1], H0[1] - J0[2])


def lid_state(c, t, sgn, L, prev):
    J = lid_J(c, t, sgn)
    Dy = c['yc'] - J[1]; Dz = c['zs'] - J[2]; r = c['r']
    K = (L * L - Dy * Dy - Dz * Dz - r * r) / (2 * r); rho = np.hypot(Dy, Dz)
    base = np.arctan2(Dz, Dy); da = np.arccos(np.clip(K / rho, -1, 1))
    cand = [base + da, base - da]
    cand = [((x - prev + np.pi) % (2 * np.pi)) - np.pi + prev for x in cand]
    b = min(cand, key=lambda x: abs(x - prev))
    H = np.array([c['xh'], c['yc'] + r * np.cos(b), c['zs'] + r * np.sin(b)])
    return J, H, b


def lid_traj(c, sgn, ts):
    L = lid_L(c, sgn); prev = c['b0'] * d2r; out = []
    t_sorted = sorted(set([0.0] + list(ts)))
    res = {}
    # od zera w obie strony, żeby zachować gałąź
    for direction in (1, -1):
        prev = c['b0'] * d2r
        seq = [t for t in t_sorted if (t >= 0 if direction > 0 else t <= 0)]
        seq = sorted(seq, key=lambda t: abs(t))
        for t in seq:
            J, H, b = lid_state(c, t, sgn, L, prev); prev = b; res[t] = (J, H, b)
    return [res[t] for t in ts], L


# ============================================================== bryły
def servo_prims(P, key):
    s = P[key]; xh, yc, zs, n, flip = s['xh'], s['yc'], s['zs'], s['n'], s['flip']
    W2 = P['serwoW'] / 2 + P['luzSerwa']
    bot = xh - n * 34.0; top = xh - n * 11.2
    if not flip:
        zr = (zs - 17.3, zs + 5.9); zc = zs - 5.7
    else:
        zr = (zs - 5.9, zs + 17.3); zc = zs + 5.7
    x0, x1 = min(bot, top), max(bot, top)
    out = []
    out.append(obb(key + ' korpus', [(x0 + x1) / 2, yc, (zr[0] + zr[1]) / 2], np.eye(3), [(x1 - x0) / 2, W2, (zr[1] - zr[0]) / 2]))
    k = P['klatka']
    out.append(obb(key + ' klatka', [(x0 + x1) / 2, yc, (zr[0] + zr[1]) / 2], np.eye(3), [(x1 - x0) / 2, W2 + k, (zr[1] - zr[0]) / 2 + k]))
    # ucha: 18..20 nad spodem korpusu (e6-pomiary.md), 31,8 wzdłuż z
    e0 = bot + n * 18.0; e1 = bot + n * 20.0
    out.append(obb(key + ' ucho', [(e0 + e1) / 2, yc, zc], np.eye(3), [1.0, W2, 15.9]))
    # łby śrub uszu z podkładką (M2,5: Ø6 × 2,5 nad uchem, w stronę orczyka)
    for dz in (-13.85, 13.85):
        out.append(cyl(key + ' łeb śruby ucha', [e1, yc, zc + dz], [e1 + n * 2.5, yc, zc + dz], 3.0))
    # wieżyczka R6 od korpusu do płaszczyzny orczyka - 1
    out.append(cyl(key + ' wieża', [top, yc, zs], [xh - n * 1.0, yc, zs], 6.0))
    # kabel płaski 3,6 × 1,2 (dwie kapsuły R0,6 co 2,4, szerokość wzdłuż y)
    cx = bot + n * 2.0
    if P['kabelStrona'] == 'przeciwna':           # e6-pomiary.md: krótsza ściana po stronie przeciwnej do wałka, nisko
        if not flip:
            pts = [[cx, yc, zr[0]], [cx, yc, -72.0]]
        else:                                     # S_PG: wyjście z przedniego czoła, pętla i wzdłuż spodu do tyłu
            xb = bot - n * 1.0
            pts = [[cx, yc, zr[1]], [cx, yc, zr[1] + 2.2], [xb, yc, zr[1] + 2.2], [xb, yc, -72.0]]
    else:                                         # strona wałka (wariant v3)
        if not flip:
            z0 = zr[1] + 1.2
            pts = [[cx, yc, z0], [0.0, yc, z0], [0.0, -5.0, z0], [0.0, -5.0, -72.0]]
        else:
            pts = [[cx, yc, zr[0] - 1.2], [cx, yc, -72.0]]
    pts = np.array(pts, float)
    for i in range(len(pts) - 1):
        a, b = pts[i], pts[i + 1]
        e = (b - a) / np.linalg.norm(b - a)
        side = np.array([0, 1.0, 0]) if abs(e[1]) < 0.9 else np.array([1.0, 0, 0])
        for o in (-1.2, 1.2):
            out.append(cap(key + ' kabel', a + o * side, b + o * side, 0.6))
    return out


def fixed_prims(P):
    F = []
    for key in ('S_X', 'S_Y', 'S_PG', 'S_PD'):
        F += servo_prims(P, key)
    T = P['rura']
    F.append(Prim('tube', 'rura', T=[(T['R'], T['z0'], T['z1']), (T['kolnR'], T['kolnZ0'], T['z1']), (T['obwR'], -200.0, T['z0'])]))
    F.append(cyl('Słupek', [0, 0, P['slupekZ0']], [0, 0, P['kardanDolZ0']], P['slupekR']))
    F.append(ann('Słupek', [0, 0, P['kardanDolZ0']], [0, 0, P['slupekZ1']], P['kardanR'] + 0.15, P['slupekR']))
    F.append(cyl('kardan dolny', [0, 0, P['kardanDolZ0']], [0, 0, P['kardanDolZ1']], P['kardanR']))
    F.append(cyl('piasta wspornika', [0, 0, P['piastaZ0']], [0, 0, P['piastaZ1']], P['piastaR']))
    zA = (P['piastaZ0'] + P['piastaZ1']) / 2
    for a in P['ramionaKaty']:
        ca, sa = np.cos(a * d2r), np.sin(a * d2r)
        F.append(obb_seg('ramię wspornika %d' % a, [6 * ca, 6 * sa, zA], [P['slupekPlytyR'] * ca, P['slupekPlytyR'] * sa, zA],
                         [0, 0, 1.0], P['ramieWspH'], P['ramieWspW']))
        F.append(cyl('słupek Płyty %d' % a, [P['slupekPlytyR'] * ca, P['slupekPlytyR'] * sa, P['tarczaZ1']],
                     [P['slupekPlytyR'] * ca, P['slupekPlytyR'] * sa, P['piastaZ1']], P['slupekPlytyD'] / 2))
        F.append(obb_seg('ucho Ramy %d' % a, [P['uchoRamyR0'] * ca, P['uchoRamyR0'] * sa, (P['uchoRamyZ0'] + P['uchoRamyZ1']) / 2],
                         [P['uchoRamyR1'] * ca, P['uchoRamyR1'] * sa, (P['uchoRamyZ0'] + P['uchoRamyZ1']) / 2],
                         [0, 0, 1.0], P['uchoRamyZ1'] - P['uchoRamyZ0'], P['uchoRamyW']))
    # tarcza ażurowa: pierścień R30–39,5 + otwory (graniastosłup w świecie)
    ang = np.linspace(0, 2 * np.pi, 180, endpoint=False)
    outer = np.stack([P['tarczaR'] * np.cos(ang), P['tarczaR'] * np.sin(ang)], 1)
    holes = []
    for (x0, x1, y0, y1) in P['oknaTarczy']:
        holes.append(np.array([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]))
    F.append(prism('tarcza', outer, holes, P['tarczaZ0'], P['tarczaZ1']))
    # słupki stopu powiek 6 × 6 (wspornik z klatki do płaszczyzny ramienia)
    F += stop_posts(P)
    return F


def stop_posts(P):
    out = []
    for key, c, sgn, ts, xlim in (('G', P['LG'], +1, P['tG'], None), ('D', P['LD'], -1, P['tD'], None)):
        st, L = lid_traj(c, sgn, [ts[0], ts[3]])
        a = P['slupkiStopuA']; rho = P['slupkiStopuRho']
        s = P['S_P' + key]
        top = s['xh'] - s['n'] * 11.2                                   # górna ściana korpusu (od strony orczyka)
        far = c['xh'] + s['n'] * (c['ramieT'] / 2 + 0.5)                 # 0,5 za zewnętrzną ścianą ramienia
        x0, x1 = sorted([top, far])
        for (J, H, b), side in zip(st, ('zamknięcia', 'otwarcia')):
            e = np.array([np.cos(b), np.sin(b)])
            # ogranicznik zamknięcia leży po stronie, z której ramię przychodzi przy zamykaniu
            # G: zamykanie = malejące b; D: zamykanie = rosnące b
            closing_dir = -1 if key == 'G' else +1
            sg = closing_dir if side == 'zamknięcia' else -closing_dir
            perp = sg * np.array([-e[1], e[0]])
            off = c['ramieW'] / 2 + a / 2
            cy, cz = np.array([c['yc'], c['zs']]) + rho * e + off * perp
            ax = np.array([[1, 0, 0], [0, e[0], perp[0]], [0, e[1], perp[1]]], float)
            out.append(obb('słupek stopu %s %s' % (key, side), [(x0 + x1) / 2, cy, cz], ax, [(x1 - x0) / 2, a / 2, a / 2]))
    return out


def _socket(name, C, e, stud, D, H):
    k = stud - (stud @ e) * e
    n = np.linalg.norm(k)
    k = k / n if n > 1e-6 else np.cross(e, [0.3, 0.5, 0.8]) / np.linalg.norm(np.cross(e, [0.3, 0.5, 0.8]))
    return cyl(name, C - k * H / 2, C + k * H / 2, D / 2)


def rod_prims(P, name, P_pt, horn, a, R):
    """pręt: gniazda przegubów (oś wzdłuż czopu, prostopadle do pręta), trzony obudów, nakrętki, pręt Ø5, końcówka M5."""
    A, H, d = horn.AHd(a)
    e = (H - P_pt); Lr = np.linalg.norm(e); e /= Lr
    m2, m5 = P['M2'], P['M5']
    out = []
    stud2 = R @ np.array([0, -1.0, 0])                  # czop M2 ∥ y gałki, piasta po stronie -y
    out.append(_socket(name + ' obudowa M2', P_pt, e, stud2, m2['gD'], m2['gH']))
    out.append(cyl(name + ' obudowa M2', P_pt, P_pt + e * m2['L'], m2['sD'] / 2))
    s = m2['L']
    out.append(cyl(name + ' nakrętka M2', P_pt + e * s, P_pt + e * (s + m2['nutL']), m2['nutR']))
    s0 = s + m2['nutL']
    s1 = Lr - m5['L'] - m5['nutL'] - P['endL']
    out.append(cyl(name + ' pręt Ø%s' % ('%g' % (2 * P['rodR'])).replace('.', ','), P_pt + e * s0, P_pt + e * s1, P['rodR']))
    out.append(cyl(name + ' końcówka M5', P_pt + e * s1, P_pt + e * (s1 + P['endL']), P['endR']))
    s2 = s1 + P['endL']
    out.append(cyl(name + ' nakrętka M5', P_pt + e * s2, P_pt + e * (s2 + m5['nutL']), m5['nutR']))
    out.append(_socket(name + ' obudowa M5', H, e, -d, m5['gD'], m5['gH']))
    out.append(cyl(name + ' obudowa M5', H, H - e * m5['L'], m5['sD'] / 2))
    return out, (A, H, d, e)


def horn_prims(P, name, horn, a, A, H, d):
    """Ramię X/Y: pełna płytka 6 mm od wałka do 7 mm przed gniazdem, dalej mostek 4 mm (wierzch 2 mm niżej),
    gniazdo czopu M5 jako walec Ø9 wzdłuż czopu (wierzch = płaszczyzna oporowa, prostopadła do czopu),
    podkładka pod kołnierz, czop (walec), piasta Ø14 na wałku."""
    out = []
    T = P['ramieT']; Wd = P['ramieW']; m5 = P['M5']
    v = rot_x(np.array([0, 1.0, 0]), a)
    Cm = horn.C - np.array([T / 2, 0, 0])
    lim = max(horn.r - (m5['gD'] / 2 + 1.0), 2.0)
    out.append(obb_seg(name + ' Ramię', Cm - v * 4.0, Cm + v * lim, [1.0, 0, 0], T, Wd))
    Cw = horn.C - np.array([T / 2 + 1.0, 0, 0]); Aw = A - np.array([T / 2 + 1.0, 0, 0])
    out.append(obb_seg(name + ' Ramię', Cw + v * lim, Aw, [1.0, 0, 0], T - 2.0, Wd))
    fz = P.get('fazaGniazdaM5', 0.0); rt = P['ramieTipR']; ck = m5.get('cokol', 0.0)
    Ab = A - d * ck                        # wierzch gniazda pod cokołem
    out.append(cyl(name + ' Ramię', A - d * (T / max(d[0], 0.3)), Ab - d * fz, rt))
    for k in range(4):                     # faza 45° krawędzi gniazda jako 4 warstwy o promieniu górnym warstwy (zachowawczo)
        u0, u1 = fz * k / 4, fz * (k + 1) / 4
        out.append(cyl(name + ' Ramię', Ab - d * u1, Ab - d * u0, rt - fz + u1))
    if ck > 0:                             # kołnierz czopu na cokole Ø(2·cokolR): część przegubu (styk obudowy z nim = kąt do oporu z B1)
        out.append(cyl(name + ' czop M5', Ab, A, m5['cokolR']))
    out.append(cyl(name + ' piasta Ramienia', horn.C - np.array([T, 0, 0]), horn.C, P['ramieHubR']))
    tail = A - d * (T / max(d[0], 0.3) + m5['studTail' + name])
    out.append(cyl(name + ' czop M5', tail, H, m5['studR']))
    return out


def ball_prims(P, R):
    """bryły związane z gałką, w świecie (Rm = R: X_świat @ R = X_gałka)."""
    out = []
    Ri, Ro = P['kulaRin'], P['kulaR']
    iv = []
    for (f0, hw, ed) in P['rimCuts']:
        a0 = (f0 - hw + 180.0) % 360.0 - 180.0
        iv.append((a0, a0 + 2 * hw, ed))
    iv.sort()
    blocks = [(Ri, Ro, ed * d2r, a0 * d2r, a1 * d2r) for (a0, a1, ed) in iv]
    for k in range(len(iv)):
        g0 = iv[k][1]; g1 = iv[(k + 1) % len(iv)][0] + (360.0 if k == len(iv) - 1 else 0.0)
        if g1 - g0 > 1e-9:
            n = int(np.ceil((g1 - g0) / 120.0))
            for m in range(n):
                b0 = g0 + (g1 - g0) * m / n; b1 = g0 + (g1 - g0) * (m + 1) / n
                blocks.append((Ri, Ro, P['rim'] * d2r, b0 * d2r, b1 * d2r))
    out.append(Prim('ball', 'czasza gałki', blocks=blocks, Rm=R))
    return out


def lid_blocks(P, which, t):
    Lp = P['LID']; Ri, Ro, Rr, rk = Lp['Rin'], Lp['Rout'], Lp['Rrant'], Lp['rantKat']
    big = 60.0
    if which == 'G':
        lo = -9.0 + t; hi = lo + P['G_SPAN']; x1, x2, sp = P['G_CUT']; hc = lo + sp
        y1, y2, sp2 = P['G_CUT2']; hc2 = lo + sp2
        bl = [(Ri, Ro, lo, hi, -big, y1), (Ri, Ro, lo, hc2, y1, y2), (Ri, Ro, lo, hi, y2, x1), (Ri, Ro, lo, hc, x1, x2),
              (Ri, Ro, lo, hi, x2, big), (Ro, Rr, lo, lo + rk, -big, big)]
    else:
        hi = -11.0 - t; lo = hi - P['D_SPAN']; y1, y2, sp2 = P['D_CUT2']; lc2 = hi - sp2
        bl = [(Ri, Ro, lo, hi, -big, y1), (Ri, Ro, lc2, hi, y1, y2), (Ri, Ro, lo, hi, y2, big), (Ro, Rr, hi - rk, hi, -big, big)]
    out = []
    for (a, b, c0, c1, x0, x1) in bl:
        # kliny > 180° nie występują (zakres 99,5°)
        out.append((a, b, c0 * d2r, c1 * d2r, x0, x1))
    return out


def wire_points(P, c, J, H, which):
    """oś drutu z łukami (R osi = r_i + r_drutu), wykorbienie łukami S."""
    Rc = P['drutRi'] + P['drutR']
    tT = P['zaczepT'] / 2
    off = 0.1 + Rc
    tab = (J[0] - tT, J[0] + tT)
    xJ = tab[1] + off if c['legJ'] > 0 else tab[0] - off
    xtJ = tab[0] - off if c['legJ'] > 0 else tab[1] + off
    arm = (c['xh'] - c['ramieT'] / 2, c['xh'] + c['ramieT'] / 2)
    xH = arm[1] + off if c['legH'] > 0 else arm[0] - off
    xtH = arm[0] - off if c['legH'] > 0 else arm[1] + off
    dv = H - J; dv[0] = 0; Lyz = np.linalg.norm(dv); dv /= Lyz
    X = np.array([1.0, 0, 0])
    og = P['drutOgon']

    def fil(V, a, b, n=8):        # zaokrąglenie narożnika V (kierunek wejścia a, wyjścia b, prostopadłe)
        O = V - a * Rc + b * Rc
        ph = np.linspace(0, np.pi / 2, n + 1)
        return [O + Rc * (-b * np.cos(p) + a * np.sin(p)) for p in ph]

    pts = []
    # ogon przy J: od końca ogona do narożnika Q1 (kierunek -dv), potem wzdłuż x do Q2, potem wzdłuż dv
    Q1 = np.array([xtJ, J[1], J[2]]); Q2 = np.array([xJ, J[1], J[2]])
    sx = np.sign(xJ - xtJ)
    T0 = Q1 + og * dv
    pts.append(T0)
    pts += fil(Q1, -dv, sx * X)
    pts += fil(Q2, sx * X, dv)
    # wykorbienie S w środku K
    K = J + c['f'] * (H - J); sK = (K - J) @ dv
    dx = xH - xJ
    if abs(dx) > 1e-6:
        sg = np.sign(dx); cb = 1 - abs(dx) / (2 * Rc); be = np.arccos(np.clip(cb, -1, 1))
        s0 = sK - Rc * np.sin(be)
        base = np.array([0, J[1], J[2]])
        for ph in np.linspace(0, be, 7):
            s = s0 + Rc * np.sin(ph); xx = xJ + sg * Rc * (1 - np.cos(ph))
            pts.append(base + s * dv + np.array([xx, 0, 0]))
        for ph in np.linspace(be, 0, 7)[1:]:
            s = s0 + 2 * Rc * np.sin(be) - Rc * np.sin(ph); xx = xH - sg * Rc * (1 - np.cos(ph))
            pts.append(base + s * dv + np.array([xx, 0, 0]))
    Q3 = np.array([xH, H[1], H[2]]); Q4 = np.array([xtH, H[1], H[2]])
    sx2 = np.sign(xtH - xH)
    pts += fil(Q3, dv, sx2 * X)
    pts += fil(Q4, sx2 * X, dv)
    pts.append(Q4 + og * dv)
    return np.array(pts)


def lid_prims(P, which, t, J, H, b):
    c = P['LG'] if which == 'G' else P['LD']
    out = [Prim('lid', 'czasza ' + ('górnej' if which == 'G' else 'dolnej'), blocks=lid_blocks(P, which, t))]
    W = wire_points(P, c, J, H, which)
    for i in range(len(W) - 1):
        if np.linalg.norm(W[i + 1] - W[i]) > 1e-9:
            out.append(cap(which + ' drut', W[i], W[i + 1], P['drutR']))
    tT = P['zaczepT'] / 2
    out.append(cyl(which + ' zaczep J', [J[0] - tT, J[1], J[2]], [J[0] + tT, J[1], J[2]], P['zaczepR']))
    edge = (-9.0 + t + P['G_SPAN']) if which == 'G' else (-11.0 - t - P['D_SPAN'])
    rr = np.sqrt(max(32.3 ** 2 - J[0] ** 2, 1)); E = np.array([J[0], rr * np.sin(edge * d2r), rr * np.cos(edge * d2r)])
    out.append(obb_seg(which + ' wypust zaczepu', E, J, [1.0, 0, 0], P['zaczepT'], 3.0))
    Cs = np.array([c['xh'], c['yc'], c['zs']]); Hx = H.copy(); Hx[0] = c['xh']
    v = (Hx - Cs) / np.linalg.norm(Hx - Cs)
    out.append(obb_seg(which + ' ramię serwa', Cs - v * 4.0, Hx, [1.0, 0, 0], c['ramieT'], c['ramieW']))
    out.append(cyl(which + ' ramię serwa', Hx - np.array([c['ramieT'] / 2, 0, 0]), Hx + np.array([c['ramieT'] / 2, 0, 0]), c['ramieW'] / 2))
    out.append(cyl(which + ' piasta ramienia', Cs - np.array([c['ramieT'] / 2, 0, 0]), Cs + np.array([c['ramieT'] / 2, 0, 0]), c['hubR']))
    return out


def uchwyt_prims(P, R, okno_poly, plate_outer):
    """Uchwyt i inne bryły wewnątrz gałki (układ gałki, Rm=R)."""
    out = []
    z0 = P['oknoZ'] - P['plytaT'] / 2; z1 = P['oknoZ'] + P['plytaT'] / 2
    out.append(prism('płyta okna', plate_outer, [okno_poly], z0, z1, Rm=R, star=True))
    m2 = P['M2']; pk = P['pktR']; z = P['pktZ']
    # piasty kulek M2 (czop ∥ y gałki): X po stronie -y, Y do środka
    for nm, p0, dirv in (('X', np.array([pk, 0, z]), np.array([0, -1.0, 0])), ('Y', np.array([0, pk, z]), np.array([0, -1.0, 0]))):
        ck = m2.get('cokol', 0.0)
        top = p0 + dirv * m2['h']                      # płaszczyzna oporowa kołnierza czopu M2
        a = top + dirv * ck; b = a + dirv * m2['bossL']
        fz = P.get('fazaPiastyM2', 0.0)
        out.append(cyl('piasta M2 ' + nm, R @ (a + dirv * fz), R @ b, m2['bossR']))
        for k in range(4):
            u0, u1 = fz * k / 4, fz * (k + 1) / 4
            out.append(cyl('piasta M2 ' + nm, R @ (a + dirv * u0), R @ (a + dirv * u1), m2['bossR'] - fz + u1))
        if ck > 0:                         # kołnierz czopu M2 na cokole: część przegubu
            out.append(cyl('czop M2 ' + nm, R @ top, R @ a, m2['cokolR']))
    for f in P['laczniki']:
        cf, sf = np.cos(f * d2r), np.sin(f * d2r)
        a = np.array([15.5 * cf, 15.5 * sf, z1]); b = np.array([9.2 * cf, 9.2 * sf, P['piastaPrzodZ0']])
        out.append(cap('łącznik Uchwytu %d' % f, R @ a, R @ b, P['lacznikR']))
    for f in P['nadlewy']:
        cf, sf = np.cos(f * d2r), np.sin(f * d2r)
        a = np.array([P['nadlewRpol'] * cf, P['nadlewRpol'] * sf, P['nadlewZ'][0]]); b = a.copy(); b[2] = P['nadlewZ'][1]
        out.append(cyl('nadlew Gałki %d' % f, R @ a, R @ b, P['nadlewR']))
    out.append(cyl('kardan górny', R @ np.array([0, 0, P['kardanGoraZ0']]), R @ np.array([0, 0, P['kardanGoraZ1']]), P['kardanR']))
    out.append(ann('piasta przednia Uchwytu', R @ np.array([0, 0, P['piastaPrzodZ0']]), R @ np.array([0, 0, P['kardanGoraZ1']]), P['kardanR'] + 0.15, P['piastaPrzodR']))
    return out
