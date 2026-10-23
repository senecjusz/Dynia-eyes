#!/usr/bin/env python3
"""Kinematyka napędu gałki (v3.2, pręty U–R–U): zakresy serw, zgięcia przegubów, kąty nacisku, momenty, stałe IK.
Użycie: python3 kinematyka.py [parametry.json]"""
import sys, json
import numpy as np, e6model as M, przemiatanie as Z
P = M.params(sys.argv[1] if len(sys.argv) > 1 else None)
ER = Z.EyeRange(json.load(open('okno.json')))
H = {n: M.Horn(P, n) for n in ('X', 'Y')}
P0 = {n: M.pkt0(P, n) for n in ('X', 'Y')}
FR = {n: M.uu_frames(P, H[n], P0[n]) for n in H}
def ang(p, t):
    R, PX, PY = M.eye_points(P, p, t); return np.array([H['X'].ik(PX), H['Y'].ik(PY)])
rows = []; ex = []; lz = []
LUZ_C = (0.03, 0.05, 0.2); LUZ_S = 0.1
for p in np.arange(-28.5, 28.6, 0.5):
    for t in np.arange(-18.5, 18.6, 0.5):
        if not ER.inside(p, t): continue
        R, PX, PY = M.eye_points(P, p, t); a = ang(p, t)
        w = abs(p) <= 25 and abs(t) <= 15
        o = [p, t, w, np.degrees(a[0]), np.degrees(a[1])]
        for n, Pt, aa in (('X', PX, a[0]), ('Y', PY, a[1])):
            h = H[n]; A, Hh, d = h.AHd(aa); e = (Hh - Pt) / np.linalg.norm(Hh - Pt)
            e0, a1 = FR[n]
            a1g = R @ np.array(P['uGal']['a1' + n]); a1g /= np.linalg.norm(a1g)
            o.append(np.degrees(np.arcsin(abs(e @ a1g))))                           # wychylenie przegubu przy gałce wokół a2 (ograniczone)
            o.append(np.degrees(np.arcsin(abs(e @ M.rot_x(a1, aa)))))              # wychylenie przy orczyku wokół osi a2 (ograniczone)
            def plane_ang(v, ref, ax):
                v = v - (v @ ax) * ax; ref = ref - (ref @ ax) * ax
                return np.degrees(np.arctan2(np.cross(ref, v) @ ax / np.linalg.norm(ref) / np.linalg.norm(v), (ref @ v) / np.linalg.norm(ref) / np.linalg.norm(v)))
            ex.append((n, plane_ang(e, R @ e0, a1g), plane_ang(e, M.rot_x(M.horn_uf0(P, n, e0, a1), aa), M.rot_x(a1, aa)), w))
            eps = 1e-5; dH = (h.AHd(aa + eps)[1] - h.AHd(aa - eps)[1]); dH /= np.linalg.norm(dH)
            o.append(np.degrees(np.arccos(min(1, abs(e @ dH)))))
        e_ = 0.05; J = np.zeros((2, 2)); J[:, 0] = (ang(p + e_, t) - ang(p - e_, t)) / (2 * e_ * np.pi / 180); J[:, 1] = (ang(p, t + e_) - ang(p, t - e_)) / (2 * e_ * np.pi / 180)
        Ji = np.linalg.inv(J); tq = [0, 0]
        # luz zwrotny (Astra v3.2 pkt 3): pełna macierz dwóch prętów przy stałych kątach serw; Δl pręta = 8c + s + 2·luzOs·sin β (gałka, orczyk)
        def Lr(pp, tt):
            R_, PX_, PY_ = M.eye_points(P, pp, tt)
            return np.array([np.linalg.norm(H['X'].AHd(aX)[1] - PX_), np.linalg.norm(H['Y'].AHd(aY)[1] - PY_)])
        aX, aY = np.radians(o[3]), np.radians(o[4])
        JL = np.zeros((2, 2)); JL[:, 0] = (Lr(p + e_, t) - Lr(p - e_, t)) / (2 * e_); JL[:, 1] = (Lr(p, t + e_) - Lr(p, t - e_)) / (2 * e_)   # mm/°
        JLi = np.abs(np.linalg.inv(JL))
        for c in LUZ_C:
            dl = np.array([8 * c + LUZ_S + 2 * P['uGal']['luzOs'] * np.sin(np.radians(o[5])) + 2 * P['uOrcz']['luzOs'] * np.sin(np.radians(o[6])),
                           8 * c + LUZ_S + 2 * P['uGal']['luzOs'] * np.sin(np.radians(o[8])) + 2 * P['uOrcz']['luzOs'] * np.sin(np.radians(o[9]))])
            lz.append((c, w, abs(p) < 1e-9 and abs(t) < 1e-9, dl[0], dl[1], *(JLi @ dl)))
        for phi in np.linspace(0, 2 * np.pi, 36, endpoint=False):
            T = Ji.T @ (0.5 * np.array([np.cos(phi), np.sin(phi)])); tq = [max(tq[0], abs(T[0])), max(tq[1], abs(T[1]))]
        rows.append(o + tq)
r = np.array(rows, float); w = r[:, 2] > 0
def mm(i): return "%.1f/%.1f" % (r[w, i].max(), r[:, i].max())
out = dict(
    serwoX=[round(r[w, 3].min(), 1), round(r[w, 3].max(), 1), round(r[:, 3].min(), 1), round(r[:, 3].max(), 1)],
    serwoY=[round(r[w, 4].min(), 1), round(r[w, 4].max(), 1), round(r[:, 4].min(), 1), round(r[:, 4].max(), 1)],
    wychylenie_galkaX=mm(5), wychylenie_orczykX=mm(6), naciskX=mm(7), wychylenie_galkaY=mm(8), wychylenie_orczykY=mm(9), naciskY=mm(10),
    momentX=round(r[w, 11].max(), 3), momentY=round(r[w, 12].max(), 3),
    L=dict(X=round(H['X'].L, 3), Y=round(H['Y'].L, 3)),
    C=dict(X=list(np.round(H['X'].C, 3)), Y=list(np.round(H['Y'].C, 3))),
    w=dict(X=list(np.round(H['X'].w, 3)), Y=list(np.round(H['Y'].w, 3))),
    H0=dict(X=list(np.round(H['X'].C + H['X'].w, 2)), Y=list(np.round(H['Y'].C + H['Y'].w, 2))))
for n in ('X', 'Y'):
    g = np.array([x[1] for x in ex if x[0] == n]); h_ = np.array([x[2] for x in ex if x[0] == n]); ww = np.array([x[3] for x in ex if x[0] == n])
    out['obrot_a1_galka' + n] = [round(g[ww].min(), 1), round(g[ww].max(), 1), round(g.min(), 1), round(g.max(), 1)]
    out['obrot_a1_orczyk' + n] = [round(h_[ww].min(), 1), round(h_[ww].max(), 1), round(h_.min(), 1), round(h_.max(), 1)]
L_ = np.array([x[:1] + x[3:] for x in lz], float); W_ = np.array([x[1] for x in lz]); Z_ = np.array([x[2] for x in lz])
out['luz_zwrotny'] = {('c=%g' % c).replace('.', ','): dict(dl_max=[round(L_[(L_[:, 0] == c), 1].max(), 3), round(L_[(L_[:, 0] == c), 2].max(), 3)],
                      praca_psi_theta=[round(L_[(L_[:, 0] == c) & W_, 3].max(), 2), round(L_[(L_[:, 0] == c) & W_, 4].max(), 2)],
                      calosc_psi_theta=[round(L_[(L_[:, 0] == c), 3].max(), 2), round(L_[(L_[:, 0] == c), 4].max(), 2)])
                      for c in LUZ_C}
for (p, t) in [(25, 0), (-25, 0), (0, 15), (0, -15), (25, 15), (25, -15), (-25, 15), (-25, -15)]:
    a = np.degrees(ang(p, t)); out['(%+d;%+d)' % (p, t)] = [round(a[0], 1), round(a[1], 1)]
print(json.dumps(out, indent=1, ensure_ascii=False))
