# Duże oko v3: kontrola prętów gałki jako JEDNEGO SZTYWNEGO drutu o stałych zagięciach (uwaga Astry W3, runda 2).
# Użycie: blender -b -P duze-oko-v3-z-sztywne.py -- <katalog STL złożenia z parametry.json> <plik wyniku .txt>
#
# Model drutu (dla każdego pręta osobno):
#  - drut sztywny: noga przy gałce (długość zacz_ods od zagięcia do środka otworu), odcinek główny o STAŁEJ długości Lm,
#    noga przy orczyku (orcz_ods od zagięcia do środka otworu); obie nogi prostopadłe do odcinka głównego (zagięcia 90°),
#    kąt skręcenia nóg wokół odcinka głównego STAŁY, z położenia spoczynkowego (L–P: nogi równoległe; G–D: prostopadłe);
#  - położenie drutu w danym stanie gałki: kierunek odcinka głównego d, obrót drutu wokół d (φ) i kąt orczyka α spełniają
#    warunki: noga przy gałce przechodzi przez środek otworu języczka, noga przy orczyku przez środek otworu orczyka,
#    |odcinek główny| = Lm; φ dobierane tak, by najmniej przechylić nogi w otworach (minimum największego stosunku
#    przechyłu do dopuszczalnego);
#  - przechył nogi = kąt między nogą a osią otworu; dopuszczalny: języczek gałki (gardziel Ø2,0 × 1,0) 36,9°,
#    orczyk MG90S fabryczny Ø1,3 (ramię ok. 1,6 mm [Z]); średnica drutu drut_d z parametrów (Ø1,0);
#  - druga strona „Z” (noga drut_noga między zagięciami, otwór na środku, ogon drut_ogon równoległy do odcinka głównego,
#    skierowany od niego): reszta nogi od 2,5 za środkiem otworu i ogon liczą się do luzu wobec gałki, płyty i piasty;
#  - luz: cały drut (obie nogi i odcinek główny jako odcinki o promieniu drut_d/2) wobec siatki gałki, z wyłączeniem nogi w obrębie
#    otworu własnego zaczepu (2,5 mm od środka otworu wzdłuż nogi = połowa grubości 1,0 + wylot fazki: przejście przez gardziel
#    zapewnia przechył ≤ dopuszczalnego, a fazki 45° są szersze od przechyłu ≤ 30°, więc drut dotyka tylko gardzieli),
#    oraz wobec płyty ze słupkiem i piasty tylnej kardana.
# Siatka stanów: psi −35…+35 × theta −25…+25 co 5° (165, z narożnikami).
import bpy, bmesh, sys, os, json, math
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree
argv = sys.argv[sys.argv.index('--') + 1:]
DIR, WYN = argv[0], argv[1]
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import duze_oko_v3_kinematyka as kin
K = kin.wczytaj(os.path.join(DIR, 'parametry.json')); P = K.P

def siatka(nazwa):
    bpy.ops.wm.stl_import(filepath=os.path.join(DIR, nazwa + '.stl'))
    o = bpy.context.selected_objects[0]; bm = bmesh.new(); bm.from_mesh(o.data)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-4)
    V = [v.co.copy() for v in bm.verts]; F = [[v.index for v in f.verts] for f in bm.faces]; bm.free(); bpy.data.objects.remove(o)
    return V, F
VG, FG = siatka('Galka'); VP, FP = siatka('Plyta')
tP = BVHTree.FromPolygons(VP, FP, epsilon=0.0)
# piasta tylna kardana: walec Ø11, z −12,75…0 (odległość analityczna)
def luz_piasta(p):
    r = math.hypot(p.x, p.y)
    if -12.75 <= p.z <= 0: return r - 5.5
    dz = -12.75 - p.z if p.z < -12.75 else p.z
    return math.hypot(max(r - 5.5, 0), dz)
KIER = Vector((0.5774, 0.5771, 0.5777)).normalized()
def odl_znak(t, p):
    r = t.find_nearest(p)
    if r[0] is None: return 1e9
    if r[3] > 3.0: return r[3]
    n, q = 0, Vector(p)
    for _ in range(200):
        h = t.ray_cast(q, KIER)
        if h[0] is None: break
        n += 1; q = h[0] + KIER * 1e-4
    return -r[3] if n % 2 else r[3]

ODS_A, ODS_B = P['zacz_ods'], P.get('orcz_ods', 1.75)
NOGA, OGON = P.get('drut_noga', 0), P.get('drut_ogon', 0)
def kap(D, l, d=1.0): return kin.przechyl_dopuszczalny(D, l, d)
DR = P.get('drut_d', 1.0); RD = DR / 2
KAP_A = kap(P['zacz_gardz_d'], P['zacz_gardz_l'], DR); KAP_B = kap(1.3, 1.6, DR)   # orczyk MG90S fabryczny Ø1,3

def obrot(v, os_, kat):
    return Matrix.Rotation(kat, 3, os_) @ v
def uklad(d):
    e1 = d.orthogonal().normalized(); return e1, d.cross(e1)
class Pret:
    def __init__(self, nm):
        self.nm = nm
        st = K.stan(0, 0)
        Ha, na = Vector(st['otw' + nm]), Vector(st['n' + nm])
        A = Vector(st['pret' + nm][0]); Hb = Vector(st['pret' + nm][1])
        nb = Vector((0, 1, 0)) if nm == 'LP' else Vector((-1, 0, 0))
        B = Hb + nb * ODS_B
        self.Lm = (B - A).length
        d = (B - A).normalized()
        ua = (Ha - A).normalized()             # noga przy gałce: od zagięcia do otworu
        ub = (Hb - B).normalized()             # noga przy orczyku: od zagięcia do otworu
        # kąt skręcenia nóg wokół d (stały w sztywnym drucie)
        ua_p = (ua - d * ua.dot(d)).normalized(); ub_p = (ub - d * ub.dot(d)).normalized()
        self.skret = math.atan2(d.dot(ua_p.cross(ub_p)), ua_p.dot(ub_p))
        self.sa = 1.0 if ua.dot(na) >= 0 else -1.0; self.sb = 1.0 if ub.dot(nb) >= 0 else -1.0
        self.nb_lok = nb
    def otwor_orczyka(self, a):
        return Vector(K.hLP(a) if self.nm == 'LP' else K.hGD(a))
    def poza(self, Ha, na, a, phi, d0):
        """Dla kąta orczyka a i obrotu phi: kierunek d (iteracja), nogi, punkty zagięć, długość odcinka głównego."""
        Hb = self.otwor_orczyka(a); d = d0.copy()
        for _ in range(30):
            e1, e2 = uklad(d)
            ua = (e1 * math.cos(phi) + e2 * math.sin(phi)).normalized()
            ub = obrot(ua, d, self.skret)
            A = Ha - ua * ODS_A; B = Hb - ub * ODS_B
            dn = (B - A).normalized()
            if (dn - d).length < 1e-9: break
            d = dn
        return A, B, ua, ub, (B - A).length, d, Hb
    def przechyly(self, ua, ub, na, nb):
        ta = math.degrees(math.acos(max(-1, min(1, self.sa * ua.dot(na)))))
        tb = math.degrees(math.acos(max(-1, min(1, self.sb * ub.dot(nb)))))
        return ta, tb
    def rozwiaz(self, st, a0):
        Ha, na = Vector(st['otw' + self.nm]), Vector(st['n' + self.nm]); nb = self.nb_lok
        best = None
        d0 = (self.otwor_orczyka(a0) - Ha).normalized()
        for phi_deg in range(0, 360, 3):
            phi = math.radians(phi_deg)
            f = lambda a: self.poza(Ha, na, a, phi, d0)[4] - self.Lm
            lo, hi = a0 - 15, a0 + 15
            flo, fhi = f(lo), f(hi)
            if flo * fhi > 0: continue
            for _ in range(40):
                m = (lo + hi) / 2; fm = f(m)
                if flo * fm <= 0: hi = m
                else: lo, flo = m, fm
            a = (lo + hi) / 2
            A, B, ua, ub, L, d, Hb = self.poza(Ha, na, a, phi, d0)
            ta, tb = self.przechyly(ua, ub, na, nb)
            ocena = max(ta / KAP_A, tb / KAP_B)
            if best is None or ocena < best[0]: best = (ocena, a, phi_deg, A, B, ua, ub, ta, tb, Ha, Hb, L)
        return best

wyn = {'LP': dict(ta=0, tb=0, luzG=1e9, luzP=1e9, luzK=1e9, dL=0, gdzie=None), 'GD': dict(ta=0, tb=0, luzG=1e9, luzP=1e9, luzK=1e9, dL=0, gdzie=None)}
prety = {nm: Pret(nm) for nm in ('LP', 'GD')}
for psi in range(-35, 36, 5):
    for th in range(-25, 26, 5):
        st = K.stan(psi, th)
        Rg = Matrix(st['Rg']).to_4x4()
        tG = BVHTree.FromPolygons([Rg @ v for v in VG], FG, epsilon=0.0)
        for nm, pr in prety.items():
            r = pr.rozwiaz(st, st['a' + nm])
            if r is None: print('BRAK ROZWIĄZANIA', nm, psi, th); continue
            ocena, a, phi, A, B, ua, ub, ta, tb, Ha, Hb, L = r
            w = wyn[nm]; w['ta'] = max(w['ta'], ta); w['tb'] = max(w['tb'], tb); w['dL'] = max(w['dL'], abs(L - pr.Lm))
            odcinki = [(A, A + ua * (ODS_A - 2.5)), (A, B), (B, Hb + ub * 1.6)]   # noga przy gałce do 2,5 przed środkiem otworu (dalej gardziel z fazkami)
            if NOGA > 0:   # druga strona „Z” przy gałce i przy orczyku
                d_ = (B - A).normalized(); C = Ha + ua * (NOGA - ODS_A); D = Hb + ub * (NOGA - ODS_B)
                if NOGA - ODS_A > 2.5: odcinki.append((Ha + ua * 2.5, C))
                odcinki += [(C, C - d_ * OGON), (Hb + ub * 1.6, D), (D, D + d_ * OGON)]
            mstan = 1e9
            for p0, p1 in odcinki:
                n = max(2, int((p1 - p0).length / 0.25) + 1)
                for i in range(n):
                    p = p0 + (p1 - p0) * (i / (n - 1))
                    dg = odl_znak(tG, p) - RD
                    mstan = min(mstan, dg)
                    if dg < w['luzG']: w['luzG'], w['gdzie'] = dg, (psi, th, [round(x, 2) for x in p])
                    w['luzP'] = min(w['luzP'], odl_znak(tP, p) - RD)
                    w['luzK'] = min(w['luzK'], luz_piasta(p) - RD)
            if mstan < 0.5: w.setdefault('ponizej', []).append((psi, th, round(mstan, 2)))
    print('stan', psi, flush=True)
lin = ['Duże oko v3 – pręty gałki jako jeden sztywny drut o stałych zagięciach (model w nagłówku duze-oko-v3-z-sztywne.py).',
       f'Drut Ø{DR}, „Z”: noga {NOGA} (otwór na środku), ogon {OGON}. Dopuszczalny przechył nogi: języczek gałki {KAP_A:.1f}° (Ø{P["zacz_gardz_d"]} × {P["zacz_gardz_l"]}), orczyk {KAP_B:.1f}° (fabryczny Ø1,3 × ramię 1,6 [Z]).', '']
for nm in ('LP', 'GD'):
    w = wyn[nm]
    lin.append(f'Pręt {nm}: długość odcinka głównego stała {prety[nm].Lm:.2f} (odchyłka rozwiązania {w["dL"]:.4f}); '
               f'przechył nogi przy gałce do {w["ta"]:.1f}° (dopuszczalne {KAP_A:.1f}°), przy orczyku do {w["tb"]:.1f}° (dopuszczalne {KAP_B:.1f}°); '
               f'luz drutu do gałki {w["luzG"]:.2f} przy {w["gdzie"]}, do płyty {w["luzP"]:.2f}, do piasty tylnej {w["luzK"]:.2f}')
for nm in ('LP', 'GD'):
    lin.append(f'  {nm}: stany z luzem do gałki < 0,5: {wyn[nm].get("ponizej", [])}')
ok = all(wyn[n]['ta'] <= KAP_A - 4 and wyn[n]['tb'] <= KAP_B and wyn[n]['luzG'] >= 0.5 and wyn[n]['luzP'] >= 0.5 and wyn[n]['luzK'] >= 0.5 for n in wyn)
lin.append(''); lin.append('WYNIK: ' + ('OK (przechył ≥ 4° poniżej dopuszczalnego w języczku, w orczyku w granicy, luzy ≥ 0,5)' if ok else 'NIE SPEŁNIA – patrz wartości wyżej'))
open(WYN, 'w', encoding='utf-8').write('\n'.join(lin) + '\n'); print('\n'.join(lin))
