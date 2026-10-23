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
    kulaR=30.0, kulaRin=28.0, rim=115.0, kulaZcut=-12.68,      # tył czaszy: płaskie cięcie z_b = -12,68 (jak w CAD)
    rimCuts=[[0.0, 30.0, 98.0], [80.0, 40.0, 102.0]],   # [azymut środka, pół-szerokość, krawędź] (stopnie)
    pktR=21.25, pktRY=20.0, pktZ=-6.0,           # punkt przegubu przy gałce: X (pktR; 0; pktZ), Y (0; pktRY; pktZ)
    # serwa (płaszczyzna orczyka fabrycznego xh, wałek y/z, n: +1 orczyk w +x)
    ramieTipR=4.5,
    S_X=dict(xh=18.013, yc=-13.0, zs=-49.0, n=+1, flip=False),
    S_Y=dict(xh=10.229, yc=3.0, zs=-49.0, n=+1, flip=False),
    S_PG=dict(xh=-30.0, yc=18.0, zs=-60.0, n=-1, flip=True),
    S_PD=dict(xh=-21.0, yc=-27.0, zs=-49.0, n=-1, flip=False),
    serwoW=12.5, luzSerwa=0.4, klatka=2.0,
    kabelStrona='oba',                # kanał przyjmuje kabel z obu krótszych ścian (decyzja 23.10): obie trasy w modelu
    rX=14.7, rY=15.4, ramieT=6.0, ramieW=8.0, ramieHubR=7.0, ramieWKoniec=6.0, ramieLKoniec=10.0,
    # przeguby (B1) – wariant odniesienia h 7 / obudowa M5 Ø12
    # gniazdo: walec o osi wzdłuż czopu (gD × gH, środek w środku kuli); trzon: walec wzdłuż pręta (sD, od środka kuli do L)
    M2=dict(h=4.0, cokol=1.0, cokolR=2.0, gD=7.0, gH=6.0, sD=5.0, L=9.0, nutR=2.31, nutL=1.6, bossR=3.0, bossLX=5.0, bossLY=2.8, kat=30.0),
    M5=dict(h=7.0, cokol=1.0, cokolR=4.0, gD=12.0, gH=10.0, sD=8.0, L=12.0, nutR=4.62, nutL=4.0, studR=2.5, studTailX=0.0, studTailY=0.5, kat=25.0),
    rodR=2.25, endR=4.0, endL=5.0, fazaGniazdaM5=1.0, fazaPiastyM2=0.75,
    # v3.2: przeguby U–U zamiast kulek RC (końcówek kulowych nie ma; decyzja 23.10)
    przeguby='UU',
    # przy gałce: kardan 2/2 z warsztatu (Ø9 × 23,5, otwory Ø2, wkręty M3, zgięcie > 90°); środek krzyżaka = P
    kard22=dict(D=9.0, L=23.5, tyl=3.5, bolec=2.0, bolecGl=6.0, piastaD=6.0, piastaL=6.0, luz=0.5, ramieW=5.0, katMax=60.0),
    # v3.2b: 4 przeguby krzyżowe drukowane (wariant a). Krzyżak: krążek Do × Hr (oś krążka wzdłuż pręta) z czterema
    # promieniowymi otworami Ø2,0 (rozwiercone) na sworznie a1 i a2; każdy sworzeń to wkręt M2×5 wkręcony w policzek widełek
    # (otwór Ø1,6, łeb dociska) i obracający się w otworze krążka. Oznaczenia (od środka krzyżaka): rP – promień końca policzka
    # widełek pręta = połowa ich grubości, cP – lico podstawy widełek pręta, pP – grubość podstawy; rS, cS, pS – to samo dla
    # widełek stałych; łby sworzni: lebR (promień), lebH (widełki stałe), lebHP (widełki pręta), nakrH (nakrętka, tu 0).
    # Zakresy kątów liczy u_zakres() (luz 0,5 mm w całym obrocie); wymagane kąty liczy kinematyka.py.
    # Przy orczyku: obrotnica M3 wzdłuż pręta – podstawa widełek pP = pogłębienie łba 3,2 + łożysko 3,3 na tulejce pręta.
    uOrcz=dict(Do=8.0, Hr=4.0, luzOs=0.125, policzek=2.0, rP=2.6, cP=5.5, pP=6.5, rS=2.6, cS=8.25, pS=1.5,
               lebR=2.0, lebH=0.0, nakrH=0.0, lebHP=1.6, tulejaD=7.0, tulejaL=6.0, katWidelekX=-12.0, katWidelekY=0.0,
               podstawaD=8.0, czopD=4.4, L=5.0, otwGl=3.125),     # podstawa walcowa Ø8, czop obrotnicy Ø4,4; otwory krzyżaka L − policzek − luzOs + 0,25
    pretUU=dict(D=4.5),
    # przy gałce: bez obrotnicy; widełki stałe na Uchwycie (oś m = -e0, sworzeń a1 dobrany pod najmniejsze wychylenie wokół a2),
    # wspornik widełek od płyty okna (φ, R)
    uGal=dict(Do=5.75, Hr=4.0, luzOs=0.125, policzek=2.0, rP=2.3, cP=5.5, pP=2.0, rS=1.9, cS=7.0, pS=2.0,
              lebR=2.0, lebH=1.6, nakrH=0.0, lebHP=0.0, L=3.7, otwGl=1.825, trojkaty=True,     # przy gałce: widełki pręta DIN 7991 M2×4 (skrócone do 3,7) w pogłębieniu Ø3,8, widełki stałe DIN 7985 M2×4 (łeb Ø4 × 1,6)
              a1X=[0.0, -1.0, 0.0], a1Y=[0.0, -1.0, 0.0], wsporKat=46.0, wsporA=4.0),     # a1 = −y gałki (widełki na płaszczyznach Front/Right); wspornik ≥ 45° do poziomu (druk płytą w dół bez podpór)
    przegubGalki='druk',              # 'druk' (4 przeguby drukowane) albo 'kardan22'
    # Słupek, kardan, wspornik, Rama, Płyta
    slupekR=7.65, slupekZ0=-33.0, slupekZ1=-5.5,
    kardanR=5.5, luzKieszeni=0.3, kardanDolZ0=-12.75, kardanDolZ1=4.0, kardanGoraZ0=-4.0, kardanGoraZ1=12.75,
    piastaZ0=-37.0, piastaZ1=-33.0, piastaR=9.0,
    ramionaKaty=[100.0, 200.0, 310.0], ramieWspW=5.0, ramieWspH=4.0, slupekPlytyR=33.0, slupekPlytyD=6.0,
    uchoRamyR0=30.5, uchoRamyR1=37.75, uchoRamyW=8.0, uchoRamyZ0=-33.0, uchoRamyZ1=-27.0,
    tarczaZ0=-71.3, tarczaZ1=-68.3, tarczaR=39.5,
    oknaTarczy=[[-35.5, -24.5, -7.0, 14.0], [-26.0, -17.0, -21.0, -6.0]],
    rura=dict(R=37.75, z0=-37.0, z1=12.0, kolnR=35.2, kolnZ0=6.0, obwR=39.75, rantSferaR=152.0),
    # Uchwyt (układ gałki)
    oknoZ=-6.0, plytaT=3.0, plytaRout=26.6, zebroZ1=-2.0,      # R zewn. płyty: przy z_b -7,5 do R28 czaszy 0,36
    laczniki=[135.0, 225.0, 315.0], lacznikR=2.0,
    nadlewy=[210.0, 330.0], nadlewR=3.5, nadlewRpol=23.5, nadlewZ=[-12.68, -6.68],     # CAD 23.10
    lapaUchwytu=dict(r0=20.0, r1=25.0, t=2.0, grub=5.0, luz=0.3),   # łapy Uchwytu pod nadlewy (płyta ma nad nadlewami wycięcia Ø7,6)
    piastaPrzodZ0=7.0, piastaPrzodR=7.65, piastaPrzodZ2=19.75,
    # powieki
    LID=dict(Rin=31.2, Rout=33.4, Rrant=34.7, rantKat=6.5),
    # ucha i mostek (jak w CAD etapu 1): mostek G R4,5–8, x 30,95–36,25, kąt od krawędzi przedniej 20–70°; ucho G R6 x 33,85–36,25;
    # ucho D R4 x 30,95–33,6; boki osi Ramy R5 x 36,5–38,5 (obie strony)
    wycKolnierza=None, wycUchaD=[4.6, 30.35],     # v3.2: kołnierz bez wycięcia (mostek G 56–95°, ucho G R5,5 – CAD 23.10); czasza G wokół ucha D R4 + 0,6
    uszy=dict(mostG=[4.5, 8.0, 30.95, 36.25, 56.0, 95.0], uchoG=[5.5, 33.85, 36.25], uchoD=[4.0, 30.95, 33.6], bokOsi=[5.0, 36.5, 38.5]),
    G_SPAN=99.5, D_SPAN=79.0, G_CUT=[-14.0, 24.0, 82.5], G_CUT2=[-31.0, -17.0, 96.5], D_CUT2=[-31.0, -17.0, 76.0],
    LG=dict(xJ=-22.0, rho=25.61694307060082, ph=92.0, xh=-30.0, yc=18.0, zs=-60.0, r=20.0, b0=135.0,
            ramieT=3.0, ramieW=6.0, hubR=4.5, legJ=-1, legH=+1, f=0.40),
    LD=dict(xJ=-22.0, rho=25.61694307060082, ph=-92.0, xh=-21.0, yc=-27.0, zs=-49.0, r=17.5, b0=30.0,
            ramieT=2.0, ramieW=5.0, hubR=4.5, legJ=-1, legH=-1, f=0.15),
    tG=[-0.25, 0.5, 56.0, 56.75], tD=[-0.25, 0.5, 32.0, 32.75],   # ogr. zamknięcia, praca od, praca do, ogr. otwarcia
    drutR=0.6, drutRi=1.2, drutOgon=2.0, zaczepT=2.4, zaczepR=2.0,
    slupkiStopuA=6.0, slupkiStopuRho=8.5,
    stopy=dict(G_zam=dict(rho=10.0, x=[-32.0, -18.8], wsp='klatka', plytka=[10.4, -40.7]), G_otw=dict(rho=10.0, x=[-32.0, -18.8], wsp='przez_tarcze'),
               D_zam=dict(rho=14.0, x=[-22.5, -16.6], wsp='wspornik200'), D_otw=dict(rho=10.0, x=[-22.5, -16.6], wsp='tarcza')),
    # zakres gałki
    praca=[25.0, 15.0], ogr=[28.0, 18.0],
)


def pkt0(P, name):
    """środek przegubu przy gałce w zerze (układ gałki)."""
    return np.array([P['pktR'], 0, P['pktZ']]) if name == 'X' else np.array([0, P.get('pktRY', P['pktR']), P['pktZ']])


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
        elif k == 'cwedge':
            xm = (self.x0 + self.x1) / 2; am = (self.a0 + self.a1) / 2
            self.c = np.array([xm, 0, 0]); self.rad = np.hypot((self.x1 - self.x0) / 2, self.r1)
        elif k == 'sphere':
            self.rad = self.r
        else:
            self.c = np.zeros(3); self.rad = 1e9

    # ---------- odległość ze znakiem
    def dist(self, X):
        d = self._dist(X)
        for (Rc, x0, x1) in getattr(self, 'wyc', ()):       # wycięcia walcem o osi x (oś powiek): A∖B, max(dA, -dB) – dolne ograniczenie
            dc = np.maximum(np.hypot(X[:, 1], X[:, 2]) - Rc, np.maximum(x0 - X[:, 0], X[:, 0] - x1))
            d = np.maximum(d, -dc)
        return d

    def _dist(self, X):
        k = self.kind
        if k == 'cap':
            return seg_pt(self.p, self.q, X) - self.r
        if k == 'cyl':
            return cyl_d(self.p, self.q, self.r, X)
        if k == 'obb':
            return obb_d(self.ctr, self.ax, self.h, X)
        if k == 'ann':
            return ann_d(self.p, self.q, self.ri, self.r, X)
        if k == 'cwedge':
            return cwedge_d(self, X)
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
        if k == 'cwedge':
            return cwedge_samples(self, step)
        if k == 'ann':
            a, _, e1 = cyl_samples(self.p, self.q, self.r, step)
            b, _, e2 = cyl_samples(self.p, self.q, self.ri, step)
            return np.vstack([a, b]), 0.0, max(e1, e2)
        raise ValueError('brak próbnika: ' + k)


def cap(name, p, q, r): return Prim('cap', name, p=np.asarray(p, float), q=np.asarray(q, float), r=float(r))
def cyl(name, p, q, r): return Prim('cyl', name, p=np.asarray(p, float), q=np.asarray(q, float), r=float(r))


def cwedge(name, r0, r1, a0, a1, x0, x1):
    """klin walcowy wokół osi x: {r0<=rho_yz<=r1, a0<=alfa<=a1 (alfa = atan2(y,z)), x0<=x<=x1}; kąty w stopniach."""
    return Prim('cwedge', name, r0=r0, r1=r1, a0=a0 * d2r, a1=a1 * d2r, x0=x0, x1=x1)


def _d2_rect(u, v, u0, u1, v0, v1):
    du = np.maximum(np.maximum(u0 - u, 0), u - u1); dv = np.maximum(np.maximum(v0 - v, 0), v - v1)
    return np.hypot(du, dv)


def cwedge_d(w, X):
    x = X[:, 0]; rho = np.hypot(X[:, 1], X[:, 2]); al = np.arctan2(X[:, 1], X[:, 2])
    mid = (w.a0 + w.a1) / 2; half = (w.a1 - w.a0) / 2
    da = (al - mid + np.pi) % (2 * np.pi) - np.pi
    out = np.where(np.abs(da) <= half, _d2_rect(x, rho, w.x0, w.x1, w.r0, w.r1), 1e9)
    for ae in (w.a0, w.a1):
        dd = al - ae; u = rho * np.cos(dd); ww = rho * np.sin(dd)
        out = np.minimum(out, np.hypot(ww, _d2_rect(x, u, w.x0, w.x1, w.r0, w.r1)))
    return out


def cwedge_samples(w, step):
    pts = []
    xs = np.arange(w.x0, w.x1 + 1e-9, step); rs = np.arange(w.r0, w.r1 + 1e-9, step)
    for r in (w.r0, w.r1):
        na = max(2, int(np.ceil(r * (w.a1 - w.a0) / step)) + 1); al = np.linspace(w.a0, w.a1, na)
        X, A = np.meshgrid(xs, al); pts.append(np.stack([X.ravel(), r * np.sin(A.ravel()), r * np.cos(A.ravel())], 1))
    for a in (w.a0, w.a1):
        X, Rr = np.meshgrid(xs, rs); pts.append(np.stack([X.ravel(), Rr.ravel() * np.sin(a), Rr.ravel() * np.cos(a)], 1))
    for xe in (w.x0, w.x1):
        for r in rs:
            na = max(2, int(np.ceil(r * (w.a1 - w.a0) / step)) + 1); al = np.linspace(w.a0, w.a1, na)
            pts.append(np.stack([np.full(na, xe), r * np.sin(al), r * np.cos(al)], 1))
    return np.vstack(pts), 0.0, step * 0.75


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
        d = np.hypot(dz, dr)   # dokładnie dla pierścienia {rho>=R, z0<=z<=z1}
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


def lid_d(blocks, X, far=2.0):
    """powieka = suma bloków (Ri, Ro, a0, a1, x0, x1); odległość bez znaku (wewnątrz 0); poza warstwą promieni o > far
    odległość promieniowa (dolne ograniczenie)."""
    Ri = min(b[0] for b in blocks); Ro = max(b[1] for b in blocks)
    r = np.linalg.norm(X, axis=1); gap = np.maximum(Ri - r, r - Ro)
    best = np.maximum(gap, 0.0); near = gap < far
    if near.any():
        q = X[near]; bb = np.full(len(q), 1e9)
        for b in blocks:
            bb = np.minimum(bb, _d_shellwedge(q, *b))
        best[near] = bb
    return best


def _d_cone_wedge(Xb, Ri, Ro, pol, f0, f1, zc=None):
    """bryła w układzie gałki: {Ri<=|p|<=Ro, kąt biegunowy od +z <= pol (albo z >= zc, gdy zc podane), azymut w [f0,f1]}
    (f1-f0 <= 180°). Dokładnie jak w _d_shellwedge, w półpłaszczyźnie południka (z, rho)."""
    x, y, z = Xb[:, 0], Xb[:, 1], Xb[:, 2]
    rho = np.hypot(x, y); fi = np.arctan2(y, x)
    mid = (f0 + f1) / 2; half = (f1 - f0) / 2
    dfi = (fi - mid + np.pi) % (2 * np.pi) - np.pi
    inw = np.abs(dfi) <= half
    # w półpłaszczyźnie: współrzędne (z, rho): kąt od +z
    f2 = (lambda zz, vv: _d2_annsector(zz, vv, Ri, Ro, 0.0, pol)) if zc is None else \
         (lambda zz, vv: _d2_ring_strip(zz, vv, Ri, Ro, zc, 1e3))
    d_in = f2(z, rho)
    out = np.where(inw, d_in, 1e9)
    for fe in (f0, f1):
        dd = fi - fe
        u = rho * np.cos(dd); w = rho * np.sin(dd)
        d2 = f2(z, u)
        out = np.minimum(out, np.hypot(w, d2))
    return out


def ball_d(blocks, Xb, far=2.0):
    """czasza gałki; punkty dalej niż far od warstwy R28–30 dostają odległość promieniową (dolne ograniczenie)."""
    Ri = min(b[0] for b in blocks); Ro = max(b[1] for b in blocks)
    r = np.linalg.norm(Xb, axis=1); gap = np.maximum(Ri - r, r - Ro)
    best = np.maximum(gap, 0.0); near = gap < far
    if near.any():
        q = Xb[near]; bb = np.full(len(q), 1e9)
        for b in blocks:
            bb = np.minimum(bb, _d_cone_wedge(q, *b))
        best[near] = bb
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
    """graniastosłup (wielokąt zewnętrzny z otworami) między z0 i z1, odległość ze znakiem.
    Punkty z |dz| >= far dostają dz (dolne ograniczenie: odległość >= dz); bliżej – dokładnie
    (przynależność: parzystość przecięć; krawędzie: wszystkie albo okno kątowe obejmujące każdą krawędź bliższą niż reach)."""
    Q = Xb[:, :2]; z = Xb[:, 2]
    dz = np.maximum(np.maximum(pr.z0 - z, 0), z - pr.z1)
    out = dz.copy()
    near = dz < far
    if not near.any():
        return out
    q = Q[near]
    reach = far
    if getattr(pr, 'star', False):
        ins = star_inside(q, pr._so) & ~star_inside(q, pr._sh)
    else:
        ins = poly_inside(q, pr.outer)
        for h in pr.holes:
            ins &= ~poly_inside(q, h)
    if getattr(pr, 'star', False):
        d2 = np.minimum(star_edge_d(q, pr._so, reach), star_edge_d(q, pr._sh, reach))
    else:
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


def star_inside(Q, S):
    """dokładny test wnętrza wielokąta gwiaździstego względem (0,0) o wierzchołkach monotonicznych kątowo:
    promień przecięcia półprostej pod kątem punktu z krawędzią obejmującą ten kąt."""
    H, ang = S; N = len(H)
    ph = np.arctan2(Q[:, 1], Q[:, 0])
    i0 = (np.searchsorted(ang, ph) - 1) % N
    A = H[i0]; B = H[(i0 + 1) % N]
    dx, dy = np.cos(ph), np.sin(ph)
    E = B - A
    den = dx * E[:, 1] - dy * E[:, 0]
    t = (A[:, 0] * E[:, 1] - A[:, 1] * E[:, 0]) / np.where(np.abs(den) < 1e-15, 1e-15, den)
    return np.hypot(Q[:, 0], Q[:, 1]) <= t


def star_edge_d(Q, S, reach):
    """odległość punktów od brzegu wielokąta gwiaździstego (wierzchołki posortowane kątowo): krawędzie w oknie kątowym,
    które obejmuje wszystkie krawędzie bliższe niż `reach` (dla punktów dalej niż reach wynik >= reach)."""
    H, ang = S; N = len(H)
    ph = np.arctan2(Q[:, 1], Q[:, 0]); r = np.hypot(Q[:, 0], Q[:, 1])
    rmin = min(np.hypot(H[:, 0], H[:, 1]).min(), r.min())
    if rmin <= reach * 1.01:
        return np.minimum(poly_edge_d(Q, H), reach)
    dphi = np.arcsin(reach / rmin) + 1e-3
    step = 2 * np.pi / N
    k = int(np.ceil(dphi / step)) + 2
    if 2 * k + 1 >= N:
        return np.minimum(poly_edge_d(Q, H), reach)
    i0 = np.searchsorted(ang, ph) - 1
    idx = (i0[:, None] + np.arange(-k, k + 1)[None, :]) % N
    A = H[idx]; B = H[(idx + 1) % N]; AB = B - A
    AP = Q[:, None, :] - A
    t = np.clip(np.sum(AP * AB, -1) / np.maximum(np.sum(AB * AB, -1), 1e-12), 0, 1)
    # krawędzie poza oknem są dalej niż reach, więc min(…, reach) jest dokładne poniżej reach i dolnym ograniczeniem powyżej
    return np.minimum(np.linalg.norm(AP - t[..., None] * AB, axis=-1).min(1), reach)


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
    PX = R @ pkt0(P, 'X'); PY = R @ pkt0(P, 'Y')
    return R, PX, PY


class Horn:
    """Ramię X/Y: C – środek górnej powierzchni Ramienia na osi wałka, r, czop d (⊥ do średniego kierunku pręta)."""
    def __init__(self, P, name):
        s = P['S_' + name]; self.name = name
        self.r = P['r' + name]; self.h = P['M5']['h']
        self.C = np.array([s['xh'] + 5.0, s['yc'], s['zs']])
        self.xh = s['xh']
        P0 = pkt0(P, name)
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
    # łby śrub uszu: M2×10 z podkładką Ø5 (łeb Ø3,8 × 1,6 + podkładka 0,5), nakrętka M2 w kieszeni bloku pod uchem
    for dz in (-13.85, 13.85):
        out.append(cyl(key + ' łeb śruby ucha', [e1, yc, zc + dz], [e1 + n * 2.1, yc, zc + dz], 2.5))
    # wieżyczka R6 od korpusu do płaszczyzny orczyka - 1
    out.append(cyl(key + ' wieża', [top, yc, zs], [xh - n * 1.0, yc, zs], 6.0))
    # kabel płaski 3,6 × 1,2 (dwie kapsuły R0,6 co 2,4, szerokość wzdłuż y)
    cx = bot + n * 2.0; xb = bot - n * 1.0
    zf, zt = (zr[1], zr[0]) if not flip else (zr[0], zr[1])   # ściana od strony wałka / przeciwna
    sgn = 1.0 if zf > zt else -1.0
    trasy = {'tyl': [[cx, yc, zt], [cx, yc, -72.0]] if zt < zf else [[cx, yc, zt], [cx, yc, zt + 2.2], [xb, yc, zt + 2.2], [xb, yc, -72.0]],
             'przod': [[cx, yc, zf], [cx, yc, zf + sgn * 2.2], [xb, yc, zf + sgn * 2.2], [xb, yc, -72.0]] if zf > zt else [[cx, yc, zf], [cx, yc, -72.0]]}
    zc_ = zf + 1.2
    if key == 'S_X':      # przód: po czole do szczeliny S_X–S_Y (y -5), dalej do tyłu
        trasy['przod'] = [[cx, yc, zc_], [cx, -5.0, zc_], [cx, -5.0, -72.0]]
    if key == 'S_Y':      # przód: po czole w +x do x -10, w dół do szczeliny y -5, do tyłu (z dala od drutu D i G)
        trasy['przod'] = [[cx, yc, zc_], [-10.0, yc, zc_], [-10.0, -5.0, zc_], [-10.0, -5.0, -72.0]]
    wyb = {'oba': ['tyl', 'przod'], 'przeciwna': ['tyl'], 'walek': ['przod']}[P['kabelStrona']]
    segs = []
    for k_ in wyb:
        pp = np.array(trasy[k_], float); segs += [(pp[i], pp[i + 1]) for i in range(len(pp) - 1)]
    for a, b in segs:
        e = (b - a) / np.linalg.norm(b - a)
        e = (b - a) / np.linalg.norm(b - a)
        wdir = np.array([0, 1.0, 0]) if abs(e[1]) < 0.9 else np.array([1.0, 0, 0])   # szerokość taśmy
        if abs(a[1] + 5.0) < 1e-9 and abs(b[1] + 5.0) < 1e-9 and abs(e[2]) > 0.9:
            wdir = np.array([1.0, 0, 0])               # w szczelinie S_X–S_Y taśma leży szerokością wzdłuż x
        tdir = np.cross(e, wdir); tdir /= np.linalg.norm(tdir)                        # grubość
        out.append(obb_seg(key + ' kabel', a, b, tdir, 1.2, 3.6))                     # pełny prostokąt 3,6 × 1,2
    return out


def fixed_prims(P):
    F = []
    for key in ('S_X', 'S_Y', 'S_PG', 'S_PD'):
        F += servo_prims(P, key)
    T = P['rura']
    wk = P['wycKolnierza']          # wycięcie kołnierza przy uszach powiek: walec R wokół osi x, |x| w [x0; x1]
    F.append(Prim('tube', 'rura', T=[(T['R'], T['z0'], T['z1']), (T['kolnR'], T['kolnZ0'], T['z1']), (T['obwR'], -200.0, T['z0'])],
                  wyc=[(wk[0], wk[1], wk[2]), (wk[0], -wk[2], -wk[1])] if wk else []))
    F.append(cyl('Słupek', [0, 0, P['slupekZ0']], [0, 0, P['kardanDolZ0']], P['slupekR']))
    F.append(ann('Słupek', [0, 0, P['kardanDolZ0']], [0, 0, P['slupekZ1']], P['kardanR'] + P['luzKieszeni'], P['slupekR']))
    F.append(cyl('kardan dolny', [0, 0, P['kardanDolZ0']], [0, 0, P['kardanDolZ1']], P['kardanR']))
    F.append(cyl('piasta wspornika', [0, 0, P['piastaZ0']], [0, 0, P['piastaZ1']], P['piastaR']))
    r, x0, x1 = P['uszy']['bokOsi']
    for sx in (1, -1):
        F.append(cyl('bok osi Ramy', [sx * x0, 0, 0], [sx * x1, 0, 0], r))
    zA = (P['piastaZ0'] + P['piastaZ1']) / 2
    for a in P['ramionaKaty']:
        ca, sa = np.cos(a * d2r), np.sin(a * d2r)
        F.append(obb_seg('ramię wspornika %d' % a, [6 * ca, 6 * sa, zA], [P['slupekPlytyR'] * ca, P['slupekPlytyR'] * sa, zA],
                         [0, 0, 1.0], P['ramieWspH'], P['ramieWspW']))
        F.append(cyl('słupek Płyty %d' % a, [P['slupekPlytyR'] * ca, P['slupekPlytyR'] * sa, P['tarczaZ1']],
                     [P['slupekPlytyR'] * ca, P['slupekPlytyR'] * sa, P['piastaZ1']], P['slupekPlytyD'] / 2))
        F.append(cyl('ucho Ramy %d' % a, [34.5 * ca, 34.5 * sa, P['uchoRamyZ0']], [34.5 * ca, 34.5 * sa, P['uchoRamyZ1']], 4.0))   # CAD: R4 na R34,5
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


def stop_posts(P, with_support=True):
    """słupki stopu powiek 6 × 6: bok ramienia serwa opiera się o słupek przy kącie ogranicznika.
    Położenie: odległość rho od osi wałka wzdłuż ramienia w położeniu ogranicznika, odsunięcie w bok ½ szer. ramienia + 3.
    Podparcia (bryły stałe): G – z płytki na wierzchu klatki S_PG; D otwarcia – filar z tarczy; D zamknięcia – wspornik
    z ramienia wspornika Słupka 200°."""
    out = []; S = P['stopy']; a = P['slupkiStopuA']
    for key, c, sgn, ts in (('G', P['LG'], +1, P['tG']), ('D', P['LD'], -1, P['tD'])):
        st, L = lid_traj(c, sgn, [ts[0], ts[3]])
        for (J, H, b), side in zip(st, ('zamknięcia', 'otwarcia')):
            cfg = S[key + '_' + side[:3]]
            e = np.array([np.cos(b), np.sin(b)])
            closing_dir = -1 if key == 'G' else +1           # G: zamykanie = malejące b; D: rosnące
            sg = closing_dir if side == 'zamknięcia' else -closing_dir
            perp = sg * np.array([-e[1], e[0]])
            off = c['ramieW'] / 2 + a / 2
            cy, cz = np.array([c['yc'], c['zs']]) + cfg['rho'] * e + off * perp
            x0, x1 = cfg['x']
            ax = np.array([[1, 0, 0], [0, e[0], perp[0]], [0, e[1], perp[1]]], float)
            ctr = np.array([(x0 + x1) / 2, cy, cz])
            out.append(obb('słupek stopu %s %s' % (key, side), ctr, ax, [(x1 - x0) / 2, a / 2, a / 2]))
            if not with_support:
                continue
            if cfg['wsp'] == 'tarcza':                       # filar z tarczy wchodzi w słupek do jego środka (przekrój połączenia = przekrój filara)
                zt = cz
                out.append(obb('filar słupka %s %s' % (key, side), [(x0 + x1) / 2, cy, (zt + P['tarczaZ1']) / 2], np.eye(3),
                               [(x1 - x0) / 2, a / 2, (zt - P['tarczaZ1']) / 2]))
            elif cfg['wsp'] == 'klatka':                     # płytka 2 mm przy ścianie klatki (x1) od ścianki y0 klatki i wierzchu z1 klatki do słupka
                yk, zk = cfg['plytka']; L = np.array([[i, j, k] for i in (-1, 1) for j in (-1, 1) for k in (-1, 1)]) * np.array([(x1 - x0) / 2, a / 2, a / 2])
                C = ctr + L @ ax.T; ya, yb = min(yk, C[:, 1].min()), C[:, 1].max(); za, zb_ = C[:, 2].min(), max(zk, C[:, 2].max())
                out.append(obb('płytka słupka %s %s' % (key, side), [x1 - 1.0, (ya + yb) / 2, (za + zb_) / 2], np.eye(3), [1.0, (yb - ya) / 2, (zb_ - za) / 2]))
            elif cfg['wsp'] == 'wspornik200':                # łącznik w płaszczyźnie ramion wspornika (z -37…-33)
                zA = (P['piastaZ0'] + P['piastaZ1']) / 2; ca, sa = np.cos(200 * d2r), np.sin(200 * d2r)
                xm = (x0 + x1) / 2; ya = xm * sa / ca                     # punkt na osi ramienia 200° przy x słupka
                ztop = cz + a / 2 * (abs(e[1]) + abs(perp[1]))
                zz0, zz1 = min(cz, zA - 2.0), max(ztop, zA + 2.0)
                yy0, yy1 = min(cy, ya), max(cy, ya)
                out.append(obb('łącznik słupka %s %s' % (key, side), [xm, (yy0 + yy1) / 2, (zz0 + zz1) / 2], np.eye(3),
                               [(x1 - x0) / 2, (yy1 - yy0) / 2 + 1.5, 2.0]))
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



# ------------------------------------------------------------------ zakres kątowy przegubu krzyżowego drukowanego
def _u_rect_pts(r, h=0.05):
    e0, e1, y0, y1 = r; out = []
    for a, b in (((e0, y0), (e1, y0)), ((e1, y0), (e1, y1)), ((e1, y1), (e0, y1)), ((e0, y1), (e0, y0))):
        n = max(2, int(np.hypot(b[0] - a[0], b[1] - a[1]) / h) + 1)
        t = np.linspace(0, 1, n)[:, None]; out.append(np.array(a) + (np.array(b) - np.array(a)) * t)
    return np.vstack(out)


def _u_sd(p, r):
    e0, e1, y0, y1 = r; c = np.array([(e0 + e1) / 2, (y0 + y1) / 2]); hw = np.array([(e1 - e0) / 2, (y1 - y0) / 2])
    q = np.abs(p - c) - hw; return np.linalg.norm(np.maximum(q, 0), axis=1) + np.minimum(np.max(q, axis=1), 0)


def _u_limit(mov, fix, clr, step=0.25):
    def mind(g):
        c, s_ = np.cos(g), np.sin(g); Rm = np.array([[c, s_], [-s_, c]]); d = 9e9
        for m in mov:
            Pp = _u_rect_pts(m) @ Rm
            for f in fix: d = min(d, _u_sd(Pp, f).min())
        for f in fix:
            Q = _u_rect_pts(f) @ Rm.T
            for m in mov: d = min(d, _u_sd(Q, m).min())
        return d
    g = 0.0
    while g < 120:
        if mind(np.radians(g)) < clr: return g - step
        g += step
    return 120.0


def u_zakres(u, rodR=2.25, clr=0.5):
    """(obrót wokół a1, obrót wokół a2) w stopniach, do pierwszego zbliżenia < clr; przekroje w płaszczyznach obrotu
    (prostokąty: policzki, podstawy, łby sworzni, pierścień, pręt; zaokrąglenia końców policzków pominięte – ostrożnie)."""
    hi = u['Do'] / 2 + u['luzOs']; ho = hi + u['policzek']; Do, Hr = u['Do'], u['Hr']
    rP, cP, pP, rS, cS, pS = u['rP'], u['cP'], u['pP'], u['rS'], u['cS'], u['pS']
    lR, lH, nH, lP = u['lebR'], u['lebH'], u['nakrH'], u.get('lebHP', 0.0)
    mov1 = [(-rP, cP + pP, hi, ho), (-rP, cP + pP, -ho, -hi), (-Hr / 2, Hr / 2, -Do / 2, Do / 2)]
    if lP > 0: mov1 += [(-lR, lR, ho, ho + lP), (-lR, lR, -ho - lP, -ho)]
    fix1 = [(-cS - pS, -cS, -rS, rS)]
    L = max(lH, nH)
    rb = max(rP, u.get('podstawaD', 0.0) / 2)                 # podstawa widełek pręta (walec Ø podstawaD przy orczyku)
    mov2 = [(cP, cP + pP, -rb, rb), (cP + pP, cP + pP + 15, -rodR, rodR)]
    fix2 = [(-Hr / 2, Hr / 2, -Do / 2, Do / 2), (-cS - pS, rS, hi, ho), (-cS - pS, rS, -ho, -hi)]
    if L > 0: fix2 += [(-lR, lR, ho, ho + L), (-lR, lR, -ho - L, -ho)]
    return _u_limit(mov1, fix1, clr), _u_limit(mov2, fix2, clr)


def _u_heads(name, c, ax, u, L=None):
    ho = u['Do'] / 2 + u['luzOs'] + u['policzek']; L = max(u['lebH'], u['nakrH']) if L is None else L
    if L <= 0: return []
    return [cyl(name, c + ax * ho, c + ax * (ho + L), u['lebR']), cyl(name, c - ax * ho, c - ax * (ho + L), u['lebR'])]


def horn_uf0(P, name, e0, a10):
    """oś widełek orczyka w zerze: e0 obrócone wokół a1 o kąt katWidelek (wyśrodkowanie zakresu obrotu wokół a1)."""
    b = np.radians(P['uOrcz'].get('katWidelek' + name, 0.0)); k = a10
    return e0 * np.cos(b) + np.cross(k, e0) * np.sin(b) + k * (k @ e0) * (1 - np.cos(b))


def uu_frames(P, horn, P0):
    """kierunki stałe przegubów U–U: pręt w zerze e0 (od P do H), oś sworznia widełek orczyka a1 (⊥ e0, w Ramieniu)."""
    H0 = horn.C + horn.w
    e0 = (H0 - P0) / np.linalg.norm(H0 - P0)
    a1 = horn.d0 - (horn.d0 @ e0) * e0; a1 /= np.linalg.norm(a1)
    return e0, a1


def rod_prims_uu(P, name, P_pt, horn, a, R):
    """pręt U–R–U: przegub przy gałce (drukowany albo kardan 2/2, środek P), pręt Ø4,5, tulejka obrotnicy,
    przegub drukowany przy orczyku (środek H, z obrotnicą wzdłuż pręta)."""
    A, H, d = horn.AHd(a)
    e = (H - P_pt); Lr = np.linalg.norm(e); e /= Lr
    k = P['kard22']; u = P['uOrcz']; g = P['uGal']
    P0 = pkt0(P, name)
    e0, a10 = uu_frames(P, horn, P0)
    m = R @ (-e0)
    out = []
    if P.get('przegubGalki') == 'kardan22':
        hL = k['L'] / 2
        out.append(cyl(name + ' kardan 2/2', P_pt - e * k['tyl'], P_pt + e * hL, k['D'] / 2))
        out.append(cyl(name + ' kardan 2/2', P_pt - m * k['tyl'], P_pt + m * hL, k['D'] / 2))
        s0 = hL + 0.5
    else:
        a1g = R @ np.array(g['a1' + name]); a1g = a1g - (a1g @ e) * e
        a2g = np.cross(e, a1g); a2g /= np.linalg.norm(a2g); w2g = np.cross(e, a2g)
        half = g['Do'] / 2 + g['luzOs'] + g['policzek']; hi = g['cP'] + g['pP']
        # policzki z końcem zaokrąglonym R rP wokół sworznia a2: prostopadłościan od środka do podstawy + walec wzdłuż a2
        out.append(obb(name + ' widełki pręta przy gałce', P_pt + e * hi / 2, np.stack([e, a2g, w2g], 1), [hi / 2, half, g['rP']]))
        out.append(cyl(name + ' widełki pręta przy gałce', P_pt - a2g * half, P_pt + a2g * half, g['rP']))
        # DFAM (druk pręta pionowo, widełki u góry): trójkąty 45° pod podstawą widełek od ±half do pręta R pretD/2;
        # obwiednia schodkowa (2 stopnie) zawiera trójkąt
        tri = half - P['pretUU']['D'] / 2
        if g.get('trojkaty', True) and tri > 0:
            e1 = hi + tri / 2; h1 = half; e2 = hi + tri; h2 = half - tri / 2
            out.append(obb(name + ' widełki pręta przy gałce', P_pt + e * (hi + e1) / 2, np.stack([e, a2g, w2g], 1), [(e1 - hi) / 2, h1, g['rP']]))
            out.append(obb(name + ' widełki pręta przy gałce', P_pt + e * (e1 + e2) / 2, np.stack([e, a2g, w2g], 1), [(e2 - e1) / 2, h2, g['rP']]))
        out += _u_heads(name + ' łby sworzni pręta przy gałce', P_pt, a2g, g, g.get('lebHP', 0.0))
        out.append(cap(name + ' krzyżak przy gałce', P_pt, P_pt, np.hypot(g['Do'] / 2, g['Hr'] / 2)))
        s0 = hi
    s_t = Lr - (u['cP'] + u['pP'])
    out.append(cyl(name + ' pręt Ø%s' % ('%g' % P['pretUU']['D']).replace('.', ','), P_pt + e * s0, P_pt + e * (s_t - u['tulejaL']), P['pretUU']['D'] / 2))
    out.append(cyl(name + ' tulejka obrotnicy', P_pt + e * (s_t - u['tulejaL']), P_pt + e * s_t, u['tulejaD'] / 2))
    a1 = rot_x(a10, a)
    a2 = np.cross(e, a1); a2 /= np.linalg.norm(a2); w2 = np.cross(e, a2)
    half = u['Do'] / 2 + u['luzOs'] + u['policzek']
    lo = -(u['cP'] + u['pP'])
    out.append(obb(name + ' widełki pręta', H + e * lo / 2, np.stack([e, a2, w2], 1), [-lo / 2, half, u['rP']]))
    out.append(cyl(name + ' widełki pręta', H - a2 * half, H + a2 * half, u['rP']))
    # podstawa widełek pręta przy orczyku: walec współosiowy z prętem (mieści pogłębienie łba M3 obrotnicy)
    out.append(cyl(name + ' widełki pręta', H - e * u['cP'], H - e * (u['cP'] + u['pP']), u['podstawaD'] / 2))
    out += _u_heads(name + ' łby sworzni pręta', H, a2, u, u.get('lebHP', 0.0))
    out.append(cap(name + ' krzyżak', H, H, np.hypot(u['Do'] / 2, u['Hr'] / 2)))
    return out, (A, H, d, e)


def horn_prims_uu(P, name, horn, a, A, H, d, R):
    """Ramię: płytka 6 × 8 do punktu A, widełki stałe na Ramieniu (sworzeń a1, otwarte w stronę pręta), piasta Ø14."""
    out = []
    T = P['ramieT']; Wd = P['ramieW']; u = P['uOrcz']
    v = rot_x(np.array([0, 1.0, 0]), a)
    Cm = horn.C - np.array([T / 2, 0, 0]); Am = A - np.array([T / 2, 0, 0])
    Lk = P['ramieLKoniec']                                   # koniec Ramienia zwężony do ramieWKoniec (miejsce na podstawę Ø8 widełek pręta)
    out.append(obb_seg(name + ' Ramię', Cm - v * 4.0, Am - v * Lk, [1.0, 0, 0], T, Wd))
    out.append(obb_seg(name + ' Ramię', Am - v * Lk, Am + v * 4.0, [1.0, 0, 0], T, P['ramieWKoniec']))
    out.append(cyl(name + ' piasta Ramienia', horn.C - np.array([T, 0, 0]), horn.C, P['ramieHubR']))
    P0 = pkt0(P, name)
    e0, a10 = uu_frames(P, horn, P0)
    uf = rot_x(horn_uf0(P, name, e0, a10), a); a1 = rot_x(a10, a); wf = np.cross(uf, a1)      # widełki po stronie przeciwnej do pręta
    half = u['Do'] / 2 + u['luzOs'] + u['policzek']
    # widełki stałe: wzdłuż uf od -rS (w stronę pręta) do cS + pS; wzdłuż a1 od -h (do Ramienia) do +half
    hi_u = u['cS'] + u['pS']
    hh = horn.h * abs(d @ a1)
    lo_a, hi_a = -max(hh, half), half
    ctr = H + uf * hi_u / 2 + a1 * (lo_a + hi_a) / 2
    out.append(obb(name + ' widełki orczyka', ctr, np.stack([uf, a1, wf], 1), [hi_u / 2, (hi_a - lo_a) / 2, u['rS']]))
    out.append(cyl(name + ' widełki orczyka', H + a1 * lo_a, H + a1 * hi_a, u['rS']))      # koniec policzków R rS wokół a1
    out += _u_heads(name + ' łeb i nakrętka sworznia orczyka', H, a1, u)
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
                blocks.append((Ri, Ro, P['rim'] * d2r, b0 * d2r, b1 * d2r, P.get('kulaZcut')))
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
    xt = P['uszy']['uchoD'][1]                     # czasze kończą się na |x| = trimG 30,95 (dalej ucha i mostek)
    for (a, b, c0, c1, x0, x1) in bl:
        x0, x1 = max(x0, -xt), min(x1, xt)
        if x1 > x0:
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
    wu = P['wycUchaD'] if which == 'G' else None      # czasza G wycięta walcem wokół ucha D (oś x)
    out = [Prim('lid', 'czasza ' + ('górnej' if which == 'G' else 'dolnej'), blocks=lid_blocks(P, which, t),
                wyc=[(wu[0], wu[1], 99.0), (wu[0], -99.0, -wu[1])] if wu else [])]
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
    U = P['uszy']
    for sx in (1, -1):
        if which == 'G':
            r0, r1, x0, x1, e0, e1 = U['mostG']; fr = -9.0 + t
            xa, xb = (x0, x1) if sx > 0 else (-x1, -x0)
            out.append(cwedge('G mostek ucha', r0, r1, fr + e0, fr + e1, xa, xb))
            r, x0, x1 = U['uchoG']
        else:
            r, x0, x1 = U['uchoD']
        xa, xb = (x0, x1) if sx > 0 else (-x1, -x0)
        out.append(cyl(which + ' ucho', [xa, 0, 0], [xb, 0, 0], r))
    return out


def uchwyt_prims(P, R, okno_poly, plate_outer, rib=None):
    """Uchwyt i inne bryły wewnątrz gałki (układ gałki, Rm=R)."""
    out = []
    z0 = P['oknoZ'] - P['plytaT'] / 2; z1 = P['oknoZ'] + P['plytaT'] / 2
    out.append(prism('płyta okna', plate_outer, [okno_poly], z0, z1, Rm=R, star=True))
    if rib is not None:
        out.append(prism('żebro mostka X', rib, [], z1, P['zebroZ1'], Rm=R))
    m2 = P['M2']; pk = P['pktR']; z = P['pktZ']
    if P.get('przeguby') == 'UU' and P.get('przegubGalki') != 'kardan22':
        g = P['uGal']
        for nm, p0, mvec in (('X', pkt0(P, 'X'), P['_mX']), ('Y', pkt0(P, 'Y'), P['_mY'])):
            a1 = np.array(g['a1' + nm], float); a1 /= np.linalg.norm(a1)
            mvec = mvec - (mvec @ a1) * a1; mvec = mvec / np.linalg.norm(mvec); wv = np.cross(mvec, a1)   # a1 dokładnie z parametru, oś widełek m rzutowana ⊥ a1
            half = g['Do'] / 2 + g['luzOs'] + g['policzek']; hi = g['cS'] + g['pS']
            out.append(obb('widełki przy gałce ' + nm, R @ (p0 + mvec * hi / 2), R @ np.stack([mvec, a1, wv], 1), [hi / 2, half, g['rS']]))
            out.append(cyl('widełki przy gałce ' + nm, R @ (p0 - a1 * half), R @ (p0 + a1 * half), g['rS']))
            out += _u_heads('łeb i nakrętka sworznia przy gałce ' + nm, R @ p0, R @ a1, g)
            base = p0 + mvec * (hi - g['pS'] / 2)
            # wspornik od podstawy widełek do tulei przedniej (nad drogą widełek pręta), w płaszczyźnie promieniowej przegubu
            # wspornik w płaszczyźnie y = y_podstawy (X) albo x = x_podstawy (Y) do ściany tulei przedniej R piastaPrzodR,
            # nachylony o wsporKat do poziomu (druk płytą w dół bez podpór)
            Rt = P['piastaPrzodR']
            if nm == 'X':
                xa = np.sqrt(max(Rt ** 2 - base[1] ** 2, 0)); dh = base[0] - xa
                att = np.array([xa, base[1], base[2] + dh * np.tan(np.radians(g['wsporKat']))]); tg = np.array([0, 1.0, 0])
            else:
                ya = np.sqrt(max(Rt ** 2 - base[0] ** 2, 0)); dh = base[1] - ya
                att = np.array([base[0], ya, base[2] + dh * np.tan(np.radians(g['wsporKat']))]); tg = np.array([1.0, 0, 0])
            P.setdefault('_wspor', {})[nm] = (base.copy(), att.copy())
            out.append(obb_seg('wspornik widełek ' + nm, R @ att, R @ base, R @ tg, g['wsporA'], g['wsporA']))
    elif P.get('przeguby') == 'UU':
        k = P['kard22']
        for nm, p0, mvec in (('X', pkt0(P, 'X'), P['_mX']), ('Y', pkt0(P, 'Y'), P['_mY'])):
            a = p0 + mvec * (k['L'] / 2 + k['luz']); b = a + mvec * k['piastaL']
            out.append(cyl('piasta kardana ' + nm, R @ a, R @ b, k['piastaD'] / 2))
            # ramię od tulei przedniej do piasty (w płaszczyźnie z_b środka piasty)
            c = b - mvec * 1.5; rad = np.array([c[0], c[1], 0]); rad /= np.linalg.norm(rad)   # ramię przy dalszym końcu piasty
            st = rad * (P['piastaPrzodR'] - 0.5) + np.array([0, 0, c[2]])
            out.append(obb_seg('ramię piasty kardana ' + nm, R @ st, R @ c, R @ np.array([0, 0, 1.0]), k['ramieW'], k['ramieW']))
    for nm, p0, dirv in ([] if P.get('przeguby') == 'UU' else (('X', np.array([pk, 0, z]), np.array([0, -1.0, 0])), ('Y', np.array([0, pk, z]), np.array([0, -1.0, 0])))):
        ck = m2.get('cokol', 0.0)
        top = p0 + dirv * m2['h']                      # płaszczyzna oporowa kołnierza czopu M2
        a = top + dirv * ck; b = a + dirv * m2['bossL' + nm]
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
        # łapa Uchwytu pod czołem nadlewu (DIN 7991 M3×8 od tyłu, łeb w pogłębieniu łapy, w otwór Ø2,6 nadlewu) i żeberko
        # obok nadlewu (po stronie φ 270°) od spodu płyty do łapy; łapa w R lr0…lr1, żeberko w tej samej strefie promieni
        L = P['lapaUchwytu']; rad = np.array([cf, sf, 0.0]); tan = np.array([-sf, cf, 0.0]); ez = np.array([0, 0, 1.0])
        sg = 1.0 if np.sin(f * d2r - np.pi * 1.5) < 0 else -1.0          # strona ku φ 270°
        zt = P['nadlewZ'][0]; zp = P['oknoZ'] - P['plytaT'] / 2
        t0 = -P['nadlewR']; t1 = P['nadlewR'] + L['luz'] + L['grub']           # łapa od -R nadlewu do zewnętrznej ściany żeberka
        rc = (L['r0'] + L['r1']) / 2; hr = (L['r1'] - L['r0']) / 2
        out.append(obb('łapa Uchwytu %d' % f, R @ (rad * rc + tan * sg * (t0 + t1) / 2 + ez * (zt - L['t'] / 2)), R @ np.stack([rad, tan, ez], 1), [hr, (t1 - t0) / 2, L['t'] / 2]))
        tz = P['nadlewR'] + L['luz'] + L['grub'] / 2
        out.append(obb('łapa Uchwytu %d' % f, R @ (rad * rc + tan * sg * tz + ez * (zp + zt - L['t']) / 2), R @ np.stack([rad, tan, ez], 1),
                       [hr, L['grub'] / 2, (zp - (zt - L['t'])) / 2]))
    out.append(cyl('kardan górny', R @ np.array([0, 0, P['kardanGoraZ0']]), R @ np.array([0, 0, P['kardanGoraZ1']]), P['kardanR']))
    out.append(ann('piasta przednia Uchwytu', R @ np.array([0, 0, P['piastaPrzodZ0']]), R @ np.array([0, 0, P['kardanGoraZ1']]), P['kardanR'] + P['luzKieszeni'], P['piastaPrzodR']))
    # tuleja przednia zamknięta nad kardanem (CAD E6.6): pełny walec do z_b piastaPrzodZ2
    out.append(cyl('piasta przednia Uchwytu', R @ np.array([0, 0, P['kardanGoraZ1']]), R @ np.array([0, 0, P['piastaPrzodZ2']]), P['piastaPrzodR']))
    return out
