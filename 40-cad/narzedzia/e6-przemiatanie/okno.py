#!/usr/bin/env python3
"""Ogranicznik gałki: okno w płycie Uchwytu (układ gałki) wokół Słupka i dolnej połówki kardana (świat).

Dokładnie: przekrój skończonego walca przez całą grubość płyty = otoczka wypukła krzywych brzegowych
(przecięcia powierzchni bocznej z płaszczyznami płyty i okręgi den walca w grubości płyty), próbkowanych
co 0,125° (błąd cięciwy < 1e-5 mm). Okno do CAD = okresowy splajn sześcienny przez punkty co 5°;
dalsze kontrole liczą na TYM splajnie (gęsty wielokąt), nie na obwiedni.

Użycie:  python3 okno.py [parametry.json]   ->  okno.json (tabela, zakres, zapas, pas styku)
"""
import numpy as np, json, sys, os
import e6model as M

NW = 2880                     # kroki kąta na walcu
OM = np.linspace(0, 2 * np.pi, NW, endpoint=False)


def solids(P):
    return [(P['slupekR'], P['slupekZ0'], P['slupekZ1'], 'Słupek'),
            (P['kardanR'], P['kardanDolZ0'], P['kardanDolZ1'], 'kardan dolny')]


def hull2(pts):
    """otoczka wypukła 2D (monotone chain), zwraca indeksy."""
    idx = np.lexsort((pts[:, 1], pts[:, 0])); p = pts[idx]
    def cross(o, a, b): return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    lo = []; up = []
    for i in range(len(p)):
        while len(lo) >= 2 and cross(p[lo[-2]], p[lo[-1]], p[i]) <= 0: lo.pop()
        lo.append(i)
    for i in range(len(p) - 1, -1, -1):
        while len(up) >= 2 and cross(p[up[-2]], p[up[-1]], p[i]) <= 0: up.pop()
        up.append(i)
    h = lo[:-1] + up[:-1]
    return idx[h]


def section(P, psi, theta):
    """punkty brzegowe przekroju (układ gałki, 2D) + dane źródła (świat z, azymut, bryła)."""
    R = M.Reye(psi, theta); RT = R.T
    zc = P['oknoZ']; half = P['plytaT'] / 2
    pts = []; src = []
    c, s_ = np.cos(OM), np.sin(OM)
    for k, (Rc, z0, z1, nm) in enumerate(solids(P)):
        # powierzchnia boczna ∩ płaszczyzny płyty
        for zb in (zc - half, zc + half):
            s = (zb - RT[2, 0] * Rc * c - RT[2, 1] * Rc * s_) / RT[2, 2]
            ok = (s >= z0) & (s <= z1)
            W = np.stack([Rc * c, Rc * s_, s], 1)[ok]
            pts.append(W @ R); src.append(np.stack([W[:, 2], np.degrees(OM[ok]), np.full(ok.sum(), k)], 1))
        # dna walca w grubości płyty
        for zz in (z0, z1):
            W = np.stack([Rc * c, Rc * s_, np.full(NW, zz)], 1); B = W @ R
            ok = (B[:, 2] >= zc - half) & (B[:, 2] <= zc + half)
            pts.append(B[ok]); src.append(np.stack([W[ok, 2], np.degrees(OM[ok]), np.full(ok.sum(), k)], 1))
            # cięciwy den (płaszczyzny płyty ∩ dno) – końce leżą na krzywych wyżej
    Pb = np.vstack(pts)[:, :2]; S = np.vstack(src)
    if len(Pb) < 3:
        return None, None
    # brzeg przekroju (zbiór wypukły zawierający środek płyty): w każdym przedziale 0,25° punkt o największym r.
    # Punkty leżą na brzegu, cięciwy między nimi wewnątrz (strzałka < 1e-4 mm).
    ang = np.arctan2(Pb[:, 1], Pb[:, 0]); r = np.hypot(Pb[:, 0], Pb[:, 1])
    k = ((ang + np.pi) / (2 * np.pi) * NB).astype(int) % NB
    order = np.lexsort((r, k)); kk = k[order]
    last = np.r_[kk[1:] != kk[:-1], True]
    sel = order[last]
    sel = sel[np.argsort(ang[sel])]
    return Pb[sel], S[sel]


NB = 1440


def ray_max(H, phis):
    """dla wielokąta wypukłego H: największe r wzdłuż promienia φ, w którym promień przecina H (0 gdy brak)."""
    A = H; B = np.roll(H, -1, 0); E = B - A
    dx, dy = np.cos(phis)[:, None], np.sin(phis)[:, None]
    den = dx * E[None, :, 1] - dy * E[None, :, 0]
    with np.errstate(divide='ignore', invalid='ignore'):
        t = (A[None, :, 0] * E[None, :, 1] - A[None, :, 1] * E[None, :, 0]) / den
        u = (A[None, :, 0] * dy - A[None, :, 1] * dx) / den
    ok = (np.abs(den) > 1e-12) & (u >= -1e-9) & (u <= 1 + 1e-9) & (t > 0)
    return np.where(ok, t, 0).max(1)


def pspline(Pts, n_out=14400):
    """okresowy splajn sześcienny (parametr jednostajny) przez punkty Pts (N,2) -> gęsty wielokąt."""
    N = len(Pts)
    A = np.zeros((N, N))
    for i in range(N):
        A[i, (i - 1) % N] = 1; A[i, i] = 4; A[i, (i + 1) % N] = 1
    rhs = 3 * (np.roll(Pts, -1, 0) - np.roll(Pts, 1, 0))
    D = np.linalg.solve(A, rhs)                       # pochodne w węzłach
    out = []
    m = n_out // N
    for i in range(N):
        p0, p1 = Pts[i], Pts[(i + 1) % N]; d0, d1 = D[i], D[(i + 1) % N]
        t = np.linspace(0, 1, m, endpoint=False)[:, None]
        h00 = 2 * t ** 3 - 3 * t ** 2 + 1; h10 = t ** 3 - 2 * t ** 2 + t; h01 = -2 * t ** 3 + 3 * t ** 2; h11 = t ** 3 - t ** 2
        out.append(h00 * p0 + h10 * d0 + h01 * p1 + h11 * d1)
    return np.vstack(out)


def radial_fn(W):
    """promień wielokąta gwiaździstego (wierzchołki uporządkowane kątowo) jako funkcja kąta (interpolacja)."""
    ang = np.arctan2(W[:, 1], W[:, 0]); r = np.hypot(W[:, 0], W[:, 1])
    o = np.argsort(ang); ang = ang[o]; r = r[o]
    ang = np.r_[ang[-1] - 2 * np.pi, ang, ang[0] + 2 * np.pi]; r = np.r_[r[-1], r, r[0]]
    return lambda phi: np.interp((phi + np.pi) % (2 * np.pi) - np.pi, ang, r)


def win_radial(W, phis):
    return radial_fn(W)(phis)


def clearance(W, H, rW=None, gap=1.5):
    """odległość brzegu okna W od przekroju H (wielokąt brzegowy); ujemna = przekrój wychodzi poza okno."""
    if rW is None:
        rW = radial_fn(W)
    aH = np.arctan2(H[:, 1], H[:, 0]); rH = np.hypot(H[:, 0], H[:, 1])
    over = rH - rW(aH)
    if over.max() > 0:
        return -float(over.max())
    rHf = radial_fn(H)
    aW = np.arctan2(W[:, 1], W[:, 0]); rWv = np.hypot(W[:, 0], W[:, 1])
    cand = W[(rWv - rHf(aW)) < gap]
    if len(cand) == 0:
        return gap
    return float(M.poly_edge_d(cand, H).min())


def boundary_poses(P0, T0, step):
    b = []
    for p in np.arange(-P0, P0 + 1e-9, step): b += [(p, T0), (p, -T0)]
    for t in np.arange(-T0, T0 + 1e-9, step): b += [(P0, t), (-P0, t)]
    return b


def compute(P, verbose=True):
    O = P['ogr']; Wk = P['praca']
    phis = np.linspace(-np.pi, np.pi, 1440, endpoint=False)
    rreq = np.zeros(len(phis))
    poses = boundary_poses(O[0], O[1], 0.25) + [(p, t) for p in np.arange(-O[0], O[0] + 1e-9, 2.0) for t in np.arange(-O[1], O[1] + 1e-9, 2.0)]
    for (p, t) in poses:
        H, _ = section(P, p, t)
        if H is not None:
            rreq = np.maximum(rreq, radial_fn(H)(phis))
            # dokładniej: maksimum punktów w przedziale
            aH = np.arctan2(H[:, 1], H[:, 0]); kk = ((aH + np.pi) / (2 * np.pi) * len(phis)).astype(int) % len(phis)
            np.maximum.at(rreq, kk, np.hypot(H[:, 0], H[:, 1]))
    # tabela co 5° (symetria względem osi x i y gałki): wartość = max obwiedni w ±5° i z obu ćwiartek, w górę do 0,01
    deg = np.degrees(phis)
    tab = []
    for f in range(0, 91, 5):
        m = np.zeros(len(deg), bool)
        for g in (f, -f, 180 - f, f - 180):
            m |= np.abs(((deg - g + 180) % 360) - 180) <= 0.13
        tab.append(np.ceil(rreq[m].max() * 100) / 100)
    tab = np.array(tab)
    # pełny obwód z tabeli i splajn
    for it in range(200):
        ang = []; rr = []
        for k, f in enumerate(range(0, 360, 5)):
            q = f % 180; q = q if q <= 90 else 180 - q
            ang.append(f); rr.append(tab[q // 5])
        ang = np.radians(ang); rr = np.array(rr)
        W = pspline(np.stack([rr * np.cos(ang), rr * np.sin(ang)], 1))
        rw = win_radial(W, phis)
        deficit = rreq - rw
        if deficit.max() <= 0:
            break
        # podnieś węzły w okolicy największego niedoboru
        k = np.argmax(deficit); f = (np.degrees(phis[k]) + 360) % 360
        q = f % 180; q = q if q <= 90 else 180 - q
        i = int(round(q / 5)); j = int(np.floor(q / 5)); tab[j] += 0.01; tab[min(j + 1, len(tab) - 1)] += 0.01
    res = dict(tabela_r=[round(float(x), 2) for x in tab], tabela_phi=list(range(0, 91, 5)),
               splajn_min_minus_obwiednia=float((rw - rreq).min()), splajn_max_minus_obwiednia=float((rw - rreq).max()))
    # zakres mechaniczny z oknem = splajn
    rWf = radial_fn(W)
    def fits(p, t):
        H, _ = section(P, p, t)
        return H is None or clearance(W, H, rWf) >= 0
    reach = []
    for a in range(0, 360, 5):
        c, s = np.cos(np.radians(a)), np.sin(np.radians(a)); n = max(abs(c), abs(s))
        lo, hi = 0.8, 1.3
        for _ in range(26):
            m = (lo + hi) / 2
            if fits(O[0] * m * c / n, O[1] * m * s / n): lo = m
            else: hi = m
        reach.append((a, lo, O[0] * lo * c / n, O[1] * lo * s / n))
    res['zakres'] = [[a, round(sc, 5), round(p, 3), round(t, 3)] for a, sc, p, t in reach]
    # zapas w pracy: siatka 0,5°, potem zagęszczenie 0,05° wokół minimów
    best = []
    for p in np.arange(-Wk[0], Wk[0] + 1e-9, 0.5):
        for t in np.arange(-Wk[1], Wk[1] + 1e-9, 0.5):
            H, _ = section(P, p, t); best.append((clearance(W, H, rWf), p, t))
    best.sort()
    cand = [b for b in best if b[0] < best[0][0] + 0.15][:8]
    fin = list(best[:1])
    for (d0, p0, t0) in cand:
        for p in np.arange(p0 - 0.5, p0 + 0.5 + 1e-9, 0.1):
            for t in np.arange(t0 - 0.5, t0 + 0.5 + 1e-9, 0.1):
                if abs(p) <= Wk[0] + 1e-9 and abs(t) <= Wk[1] + 1e-9:
                    H, _ = section(P, p, t); fin.append((clearance(W, H, rWf), p, t))
    fin.sort()
    res['zapas_praca'] = [round(fin[0][0], 4), round(fin[0][1], 2), round(fin[0][2], 2)]
    # pas styku i odległość od otworu M4 (otwory na ±x, oś z -9,1, Ø4,2)
    zs = []; az = []; dm4 = 9.0
    for (a, sc, p, t) in [(a, sc, p, t) for (a, sc, p, t) in reach]:
        H, S = section(P, p, t)
        aH = np.arctan2(H[:, 1], H[:, 0])
        k = (rWf(aH) - np.hypot(H[:, 0], H[:, 1])) < 0.02
        for (z, om, kk) in S[k]:
            if int(kk) != 0:
                continue
            zs.append(z); az.append(om)
            dz = z + 9.1; daz = min(abs(((om - 0 + 180) % 360) - 180), abs(((om - 180 + 180) % 360) - 180))
            dm4 = min(dm4, np.hypot(dz, P['slupekR'] * np.radians(daz)) - 2.1)
    zs = np.array(zs); az = np.array(az)
    res['styk_z'] = [round(float(zs.min()), 3), round(float(zs.max()), 3)] if len(zs) else None
    sect = {}
    for c0 in (0, 90, 180, 270):
        m = np.abs(((az - c0 + 180) % 360) - 180) <= 15
        if m.any(): sect[str(c0)] = [round(float(zs[m].min()), 3), round(float(zs[m].max()), 3)]
    res['styk_z_azymut'] = sect
    res['odl_od_otworu_M4'] = round(float(dm4), 3)
    res['_W'] = W
    if verbose:
        print("tabela r co 5° (0..90):", res['tabela_r'])
        print("splajn - obwiednia: %.3f .. %.3f" % (res['splajn_min_minus_obwiednia'], res['splajn_max_minus_obwiednia']))
        r0 = [x for x in reach if x[0] in (0, 45, 90)]
        print("zakres mechaniczny (kierunek, psi, theta):", [(a, round(p, 2), round(t, 2)) for a, sc, p, t in reach if a in (0, 30, 45, 60, 90)])
        print("zapas w pracy: %.3f przy (%.2f; %.2f)" % tuple(res['zapas_praca']))
        print("styk na Słupku z:", res['styk_z'], "wg azymutu:", sect, " M4 (krawędź otworu) – styk: %.2f" % dm4)
    return res


if __name__ == '__main__':
    P = M.params(sys.argv[1] if len(sys.argv) > 1 else None)
    res = compute(P)
    W = res.pop('_W')
    out = os.environ.get('OUT', 'okno.json')
    json.dump(res, open(out, 'w'), indent=1, ensure_ascii=False)
    np.save(out.replace('.json', '_splajn.npy'), W)
