# Duże oko v3: kinematyka wspólna dla przemiatania kolizji i renderu w Blenderze (czysty Python, bez numpy).
# Układ złożenia z duze-oko-v3.scad: 0 = środek kuli, z do przodu, y w górę, x w prawo patrząc od przodu.
# Gałka: R = Ry(psi) · Rx(−theta) – kardan: sworzeń piasty tylnej pionowo (psi, lewo–prawo), przedniej poziomo (theta, góra–dół).
# psi > 0: przód gałki w stronę +x; theta > 0: przód w górę. Powieka górna: Rx(−g), dolna: Rx(+d), g, d = kąt otwarcia (0 = zamknięta).
import math, json

def Rx(a):
    c, s = math.cos(math.radians(a)), math.sin(math.radians(a))
    return ((1, 0, 0), (0, c, -s), (0, s, c))
def Ry(a):
    c, s = math.cos(math.radians(a)), math.sin(math.radians(a))
    return ((c, 0, s), (0, 1, 0), (-s, 0, c))
def mm(A, B): return tuple(tuple(sum(A[i][k] * B[k][j] for k in range(3)) for j in range(3)) for i in range(3))
def mv(A, v): return tuple(sum(A[i][k] * v[k] for k in range(3)) for i in range(3))
def sub(a, b): return tuple(x - y for x, y in zip(a, b))
def norm(a): return math.sqrt(sum(x * x for x in a))
def R_galki(psi, theta): return mm(Ry(psi), Rx(-theta))

class Kin:
    def __init__(self, P):
        self.P = P
        zr, zz = P['zacz_r'], P['zacz_z']
        self.lugLP, self.lugGD = (zr, 0.0, zz), (0.0, zr, zz)
        L, G = P['LP_wal'], P['GD_wal']
        self.sLP, self.rLP = (L[0], 0.0, L[2]), P['orcz_LP']          # orczyk L–P w płaszczyźnie y = 0, ramię w −x przy α = 0
        self.sGD, self.rGD = (0.0, G[1], G[2]), P['orcz_GD']          # orczyk G–D w płaszczyźnie x = 0, ramię w +y przy α = 0
        self.LLP = norm(sub(self.hLP(0), self.lugLP)); self.LGD = norm(sub(self.hGD(0), self.lugGD))
        zg, zd = P['zaczG'], P['zaczD']
        zp = P.get('zacz_pow_z', 0.0)
        self.lugG = (zg[0], math.sqrt(zg[1] ** 2 - zp ** 2), zp); self.lugD = (zd[0], -math.sqrt(zd[1] ** 2 - zp ** 2), zp)
        self.sG = (P.get('pG_x_orcz', zg[0]), P['PG_wal'][1], P['PG_wal'][2]); self.sD = (P.get('pD_x_orcz', zd[0]), P['PD_wal'][1], P['PD_wal'][2])
        self.rP = P['orcz_pow']; self.a0G, self.a0D = P['pG_psi0'], P['pD_psi0']
        self.LG = norm(sub(self.hG(self.a0G), self.lugG)); self.LD = norm(sub(self.hD(self.a0D), self.lugD))
    # położenia otworów orczyków w funkcji kąta α (stopnie)
    def hLP(self, a): s, r = self.sLP, self.rLP; return (s[0] - r * math.cos(math.radians(a)), 0.0, s[2] + r * math.sin(math.radians(a)))
    def hGD(self, a): s, r = self.sGD, self.rGD; return (0.0, s[1] + r * math.cos(math.radians(a)), s[2] + r * math.sin(math.radians(a)))
    def hG(self, a): s, r = self.sG, self.rP; return (s[0], s[1] + r * math.cos(math.radians(a)), s[2] + r * math.sin(math.radians(a)))
    def hD(self, a): s, r = self.sD, self.rP; return (s[0], s[1] - r * math.cos(math.radians(a)), s[2] + r * math.sin(math.radians(a)))
    @staticmethod
    def _ik(h, cel, L, a0):
        f = lambda a: norm(sub(h(a), cel)) - L
        best = None
        for d in range(0, 120):                     # szukaj zera najbliżej a0 (ciągła gałąź)
            for lo, hi in ((a0 + d, a0 + d + 1), (a0 - d - 1, a0 - d)):
                fl, fh = f(lo), f(hi)
                if fl * fh <= 0:
                    for _ in range(40):
                        m = (lo + hi) / 2
                        if fl * f(m) <= 0: hi = m
                        else: lo, fl = m, f(m)
                    return (lo + hi) / 2
        return None
    def stan(self, psi=0.0, theta=0.0, g=0.0, d=0.0, aLP=0.0, aGD=0.0, aG=None, aD=None):
        """Zwraca słownik z macierzami części i punktami końcowymi prętów/drutów (świat)."""
        Rg = R_galki(psi, theta)
        jLP, jGD = mv(Rg, self.lugLP), mv(Rg, self.lugGD)
        aLP = self._ik(self.hLP, jLP, self.LLP, aLP); aGD = self._ik(self.hGD, jGD, self.LGD, aGD)
        RG, RD = Rx(-g), Rx(d)
        jG, jD = mv(RG, self.lugG), mv(RD, self.lugD)
        aG = self._ik(self.hG, jG, self.LG, self.a0G if aG is None else aG)
        aD = self._ik(self.hD, jD, self.LD, self.a0D if aD is None else aD)
        return dict(Rg=Rg, RG=RG, RD=RD, aLP=aLP, aGD=aGD, aG=aG, aD=aD,
                    pretLP=(jLP, self.hLP(aLP)), pretGD=(jGD, self.hGD(aGD)),
                    drutG=(jG, self.hG(aG)), drutD=(jD, self.hD(aD)),
                    orczLP=(self.sLP, self.hLP(aLP)), orczGD=(self.sGD, self.hGD(aGD)),
                    orczG=(self.sG, self.hG(aG)), orczD=(self.sD, self.hD(aD)))

def wczytaj(sciezka):
    return Kin(json.load(open(sciezka, encoding='utf-8')))

if __name__ == '__main__':
    import sys
    k = wczytaj(sys.argv[1])
    print('pręty L–P %.1f, G–D %.1f; druty powiek G %.1f, D %.1f' % (k.LLP, k.LGD, k.LG, k.LD))
    for psi, th in ((-35, 0), (35, 0), (0, -25), (0, 25), (35, 25), (-35, -25)):
        s = k.stan(psi, th)
        print('gałka psi %+d theta %+d: orczyk L–P %+.1f°, G–D %+.1f°' % (psi, th, s['aLP'], s['aGD']))
    for g in (0, 25, 51.5):
        s = k.stan(g=g, d=g)
        print('powieki %.1f°: orczyk górnej %.1f°, dolnej %.1f°' % (g, s['aG'], s['aD']))
