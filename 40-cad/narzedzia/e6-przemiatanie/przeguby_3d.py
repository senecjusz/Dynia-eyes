#!/usr/bin/env python3
"""Wnętrze przegubów krzyżowych w 3D (v3.2, uwaga Astry pkt 4): dla każdego z 4 przegubów i każdego położenia gałki
(siatka + granica okna) liczy rzeczywiste kąty (γ wokół a1, β wokół a2) i najmniejszy odstęp brył strony pręta od brył
strony stałej (policzki, podstawy, trójkąty DFAM, walec podstawy, łby, pręt, tulejka, wspornik widełek orczyka) oraz
krzyżaka od podstaw. Pary sworzniowe (krzyżak – własne policzki, luz osiowy luzOs) są parami obrotowymi i nie wchodzą.
Potem zapas: największe Δ, o które można jednocześnie powiększyć |γ| i |β| w 60 skrajnych położeniach przy odstępie ≥ 0,5.
Użycie: python3 przeguby_3d.py [parametry.json] [--szybko]   → przeguby_3d.json"""
import sys, json
import numpy as np, e6model as M, przemiatanie as Z

PROG = 0.5


def rot(k, b, v):
    k = k / np.linalg.norm(k)
    return v * np.cos(b) + np.cross(k, v) * np.sin(b) + k * (k @ v) * (1 - np.cos(b))


def bodies(u, typ, rodD, hh=0.0):
    """bryły w układzie przegubu: a1 = X, oś widełek stałych m = +Z, pręt w zerze wzdłuż −Z. Zwraca funkcję (γ, β) → (pręt, stałe, krzyżak)."""
    hi = u['Do'] / 2 + u['luzOs']; ho = hi + u['policzek']
    X, Y, Zv = np.eye(3)
    fixed = []
    for s in (1, -1):
        fixed.append(M.obb('policzek stały', [s * (hi + u['policzek'] / 2), 0, u['cS'] / 2], np.eye(3), [u['policzek'] / 2, u['rS'], u['cS'] / 2]))
        fixed.append(M.cyl('policzek stały', [s * hi, 0, 0], [s * ho, 0, 0], u['rS']))
        if u.get('lebH', 0) > 0: fixed.append(M.cyl('łeb stały', [s * ho, 0, 0], [s * (ho + u['lebH']), 0, 0], u['lebR']))
    fixed.append(M.obb('podstawa stała', [0, 0, u['cS'] + u['pS'] / 2], np.eye(3), [ho, u['rS'], u['pS'] / 2]))
    if hh > ho:                                     # przy orczyku: widełki przechodzą w Ramię po stronie −a1
        fixed.append(M.obb('wspornik widełek orczyka', [-(hh + ho) / 2, 0, (u['cS'] + u['pS']) / 2], np.eye(3), [(hh - ho) / 2, u['rS'], (u['cS'] + u['pS']) / 2]))

    def pose(g, b):
        Rs = lambda v: rot(X, g, v)
        a2 = Rs(-Y); e = Rs(rot(-Y, b, -Zv)); w2 = np.cross(e, a2)
        A = np.stack([e, a2, w2], 1)
        def P_(se, sa, sw=0.0): return se * e + sa * a2 + sw * w2
        rod = []
        for s in (1, -1):
            rod.append(M.obb('policzek pręta', P_(u['cP'] / 2, s * (hi + u['policzek'] / 2)), A, [u['cP'] / 2, u['policzek'] / 2, u['rP']]))
            rod.append(M.cyl('policzek pręta', P_(0, s * hi), P_(0, s * ho), u['rP']))
            if u.get('lebHP', 0) > 0: rod.append(M.cyl('łeb pręta', P_(0, s * ho), P_(0, s * (ho + u['lebHP'])), u['lebR']))
        c0, c1 = u['cP'], u['cP'] + u['pP']
        rod.append(M.obb('podstawa pręta', P_((c0 + c1) / 2, 0), A, [(c1 - c0) / 2, ho, u['rP']]))
        s0 = c1
        if typ == 'galka' and u.get('trojkaty', True):
            tri = ho - rodD / 2
            rod.append(M.obb('trójkąty 45°', P_(c1 + tri / 4, 0), A, [tri / 4, ho, u['rP']]))
            rod.append(M.obb('trójkąty 45°', P_(c1 + 3 * tri / 4, 0), A, [tri / 4, ho - tri / 2, u['rP']]))
            s0 = c1 + tri
        if typ == 'orczyk':
            rod.append(M.cyl('podstawa walcowa', P_(c0, 0), P_(c1, 0), u['podstawaD'] / 2))
            rod.append(M.cyl('tulejka obrotnicy', P_(c1, 0), P_(c1 + u['tulejaL'], 0), u['tulejaD'] / 2))
            s0 = c1 + u['tulejaL']
        rod.append(M.cyl('pręt', P_(s0, 0), P_(s0 + 15, 0), rodD / 2))
        n = Rs(-Zv)
        spider = M.cyl('krzyżak', -n * u['Hr'] / 2, n * u['Hr'] / 2, u['Do'] / 2)
        return rod, fixed, spider
    return pose


def clearance(pose, g, b):
    rod, fixed, spider = pose(g, b)
    best = (9e9, '')
    for A in rod:
        for B in fixed:
            v = Z.ev(A, B)
            if v is not None and v < best[0]: best = (v, A.name + ' – ' + B.name)
    for B in [f for f in fixed if f.name.startswith('podstawa')] + [r for r in rod if r.name.startswith('podstawa') or r.name.startswith('trójkąty') or r.name == 'podstawa walcowa']:
        v = Z.ev(spider, B)
        if v is not None and v < best[0]: best = (v, 'krzyżak – ' + B.name)
    return best


def angles(P, szybko):
    """(γ, β) wymagane dla 4 przegubów w położeniach gałki; γ, β w radianach."""
    ER = Z.EyeRange(json.load(open('okno.json')))
    H = {n: M.Horn(P, n) for n in ('X', 'Y')}
    st = 2.0 if szybko else 1.0
    poses = [(p, t) for p in np.arange(-28.5, 28.6, st) for t in np.arange(-18.5, 18.6, st) if ER.inside(p, t)] + list(ER.boundary(120 if szybko else 360))
    out = {('galka', n): [] for n in H}; out.update({('orczyk', n): [] for n in H})
    for (p, t) in poses:
        R, PX, PY = M.eye_points(P, p, t)
        for n, Pt in (('X', PX), ('Y', PY)):
            h = H[n]; a = h.ik(Pt); A, Hh, d = h.AHd(a); e = (Hh - Pt) / np.linalg.norm(Hh - Pt)
            P0 = M.pkt0(P, n); e0, a10 = M.uu_frames(P, h, P0)
            # przy gałce: układ gałki; a1 z parametru, m = −e0
            a1 = np.array(P['uGal']['a1' + n], float); a1 /= np.linalg.norm(a1); mb = -e0 - (-e0 @ a1) * a1; mb /= np.linalg.norm(mb)
            Yb = np.cross(mb, a1); eb = R.T @ e
            el = np.array([eb @ a1, eb @ Yb, eb @ mb])
            out[('galka', n)].append((p, t, np.arcsin(np.clip(el[0], -1, 1)), np.arctan2(el[1], -el[2])))
            # przy orczyku: oś widełek uf, a1 obracają się z Ramieniem; pręt widziany z H biegnie ku P (−e)
            uf = M.rot_x(M.horn_uf0(P, n, e0, a10), a); a1o = M.rot_x(a10, a); Yo = np.cross(uf, a1o); ro = -e
            el = np.array([ro @ a1o, ro @ Yo, ro @ uf])
            out[('orczyk', n)].append((p, t, np.arcsin(np.clip(el[0], -1, 1)), np.arctan2(el[1], -el[2])))
    return out


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    P = M.params(args[0] if args else None)
    szybko = '--szybko' in sys.argv
    req = angles(P, szybko)
    res = {}
    rodD = P['pretUU']['D']
    for (typ, n), lst in req.items():
        u = P['uGal'] if typ == 'galka' else P['uOrcz']
        hh = M.Horn(P, n).h if typ == 'orczyk' else 0.0
        pose = bodies(u, typ, rodD, hh)
        G = np.array([x[3] for x in lst]); B = np.array([x[2] for x in lst])
        worst = (9e9, None, '')
        vals = []
        for (p, t, b, g) in lst:
            v, nm = clearance(pose, g, b); vals.append(v)
            if v < worst[0]: worst = (v, (p, t, np.degrees(g), np.degrees(b)), nm)
        vals = np.array(vals)
        # zapas: 60 skrajnych położeń (największe |γ|, |β| i ich suma względna)
        idx = set(np.argsort(-np.abs(G))[:20]) | set(np.argsort(-np.abs(B))[:20]) | set(np.argsort(-(np.abs(G) / max(np.abs(G).max(), 1e-9) + np.abs(B) / max(np.abs(B).max(), 1e-9)))[:20]) | set(np.argsort(vals)[:10])
        marg = 0.0; step = np.radians(0.5); dl = 0.0
        while dl < np.radians(60):
            dl += step
            ok = all(clearance(pose, G[i] + np.sign(G[i]) * dl, B[i] + np.sign(B[i]) * dl)[0] >= PROG for i in idx)
            if not ok: break
            marg = dl
        res['%s %s' % (typ, n)] = dict(min_odstep=round(float(worst[0]), 3), gdzie=[round(float(x), 2) for x in worst[1]], para=worst[2],
                                       gamma=[round(float(np.degrees(G.min())), 1), round(float(np.degrees(G.max())), 1)],
                                       beta=[round(float(np.degrees(B.min())), 1), round(float(np.degrees(B.max())), 1)],
                                       zapas_deg=round(float(np.degrees(marg)), 1))
        print('%-10s min %.3f (%s) γ %s β %s zapas %.1f°' % (typ + ' ' + n, worst[0], worst[2], res['%s %s' % (typ, n)]['gamma'], res['%s %s' % (typ, n)]['beta'], np.degrees(marg)), flush=True)
    json.dump(res, open('przeguby_3d.json', 'w'), indent=1, ensure_ascii=False)
    return res


if __name__ == '__main__':
    main()
