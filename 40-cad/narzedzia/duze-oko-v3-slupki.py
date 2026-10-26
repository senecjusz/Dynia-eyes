# Duże oko v3: ugięcie i naprężenia słupków płyty (zawiasu powiek i kardana) – rachunek belkowy na przekrojach siatki.
# Użycie: python3 duze-oko-v3-slupki.py <Plyta.stl w układzie złożenia (ASCII, eksport-v3.sh)> [wynik.md]
#
# Metoda:
#  - przekroje płaszczyznami siatki płyty (bez upraszczania kształtu): poziome y = const (przy druku płyty na płasko to
#    płaszczyzny warstw – naprężenie normalne do nich działa W POPRZEK warstw) oraz pionowe z = const wzdłuż słupków
#    (naprężenie normalne wzdłuż osi słupka leży w płaszczyźnie warstw – WZDŁUŻ warstw);
#  - pole i momenty bezwładności przekroju z rasteryzacji wielokątów przekroju (siatka 0,05 mm, reguła parzystości);
#  - naprężenie zginające σ = M·c / I (najdalsze włókno), osiowe σ = N / A, skręcanie przekroju pełnego τ ≈ T / (0,2·A·t)
#    (szacunek dla prostokąta o grubości t); ugięcie: całkowanie M/(E·I(z)) wzdłuż słupka od przodu płyty (z = −49);
#  - słupki zawiasu wklejone w tubę: podparcie przegubowe w miejscu kleju (tylny brzeg tuby, z = 6 − L), moment przy
#    nasadzie belki utwierdzonej z podporą i wysięgiem: M = F·a/2 (a = wysięg od kleju do obciążenia).
# Założenia [Z]: PLA E = 3500 MPa; wytrzymałość wzdłuż warstw 50 MPa, w poprzek warstw 20 MPa (ostrożnie; literatura
# 15–30 MPa); przy druku pod kątem ok. 45° (decyzja użytkownika) przyjmuje się wartość w poprzek warstw jako dolną granicę.
# Obciążenia (MG90S 2,2 kg·cm = 0,216 N·m przy zablokowaniu):
#  - pręt G–D na orczyku 11,5: 18,8 N, pręt L–P na orczyku 17,5: 12,3 N; całość przechodzi na słupek kardana przez kardan
#    (środek kuli z = 0): ostrożnie 19 N poprzecznie (osobno w y i w x), do tego osiowo 12,3 + 18,8 = 31 N;
#  - ciężar gałki z piastą i kardanem ok. 0,5 N (pomijalny wobec 19 N, policzony); praca kardana: moment skręcający ze składowej
#    poprzecznej prętów ≤ 0,2 · 19 N · 15,5 mm ≈ 60 N·mm;
#  - drut powieki: 0,216 / 0,025 = 8,6 N; ostrożnie całość na jeden słupek, na osi zawiasu (z = 0), osobno w y i w z,
#    w x (kierunek słaby, tylko ręka przy montażu) 4,3 N; ciężar powieki ok. 0,1 N.
import sys, re, math
import numpy as np

pl = sys.argv[1]; WYN = sys.argv[2] if len(sys.argv) > 2 else None
txt = open(pl).read()
V = np.array(re.findall(r'vertex\s+(\S+)\s+(\S+)\s+(\S+)', txt), dtype=float).reshape(-1, 3, 3)
E_PLA, R_WZD, R_POP = 3500.0, 50.0, 20.0

def przekroj(ax, h, filtr):
    """Odcinki przecięcia siatki z płaszczyzną (oś ax = h), w 2D (pozostałe osie), z filtrem obszaru."""
    a = V[:, :, ax] - h
    oth = [i for i in range(3) if i != ax]
    seg = []
    for tri, s in zip(V, a):
        pts = []
        for i in range(3):
            j = (i + 1) % 3
            if (s[i] < 0) != (s[j] < 0):
                f = s[i] / (s[i] - s[j]); p = tri[i] + f * (tri[j] - tri[i]); pts.append(p[oth])
        if len(pts) == 2:
            m = (pts[0] + pts[1]) / 2
            if filtr(m): seg.append(pts)
    return np.array(seg)
def wlasnosci(seg, krok=0.05):
    """Pole, środek i momenty bezwładności obszaru ograniczonego odcinkami (parzystość promienia w kierunku +u)."""
    if len(seg) == 0: return None
    mn = seg.reshape(-1, 2).min(0) - krok; mx = seg.reshape(-1, 2).max(0) + krok
    us = np.arange(mn[0], mx[0], krok) + krok / 2; vs = np.arange(mn[1], mx[1], krok) + krok / 2
    A0, B0 = seg[:, 0], seg[:, 1]
    maska = np.zeros((len(vs), len(us)), bool)
    for k, v in enumerate(vs):
        # przecięcia poziomej linii v z odcinkami
        lo = np.minimum(A0[:, 1], B0[:, 1]); hi = np.maximum(A0[:, 1], B0[:, 1])
        sel = (lo <= v) & (hi > v)
        if not sel.any(): continue
        a, b = A0[sel], B0[sel]
        uc = a[:, 0] + (v - a[:, 1]) * (b[:, 0] - a[:, 0]) / (b[:, 1] - a[:, 1])
        uc.sort()
        for i in range(0, len(uc) - 1, 2):
            maska[k] |= (us >= uc[i]) & (us < uc[i + 1])
    dA = krok * krok
    UU, VV = np.meshgrid(us, vs)
    A = maska.sum() * dA
    if A == 0: return None
    uc, vc = (UU[maska].sum() * dA) / A, (VV[maska].sum() * dA) / A
    Iu = ((VV[maska] - vc) ** 2).sum() * dA     # względem osi równoległej do u (zginanie w kierunku v)
    Iv = ((UU[maska] - uc) ** 2).sum() * dA
    cu = np.abs(UU[maska] - uc).max(); cv = np.abs(VV[maska] - vc).max()
    t = min(UU[maska].max() - UU[maska].min(), VV[maska].max() - VV[maska].min())
    return dict(A=A, uc=uc, vc=vc, Iu=Iu, Iv=Iv, cu=cu, cv=cv, t=t)

lin = ['# Duże oko v3: wytrzymałość słupków płyty', '',
       'Wynik `narzedzia/duze-oko-v3-slupki.py` na siatce `Plyta` (eksport-v3.sh); metoda, obciążenia i założenia [Z] w nagłówku skryptu.',
       f'PLA [Z]: E = {E_PLA:.0f} MPa, wytrzymałość wzdłuż warstw {R_WZD:.0f} MPa, w poprzek {R_POP:.0f} MPa. Zapas = wytrzymałość / naprężenie.', '']

# ---------------- słupek zawiasu (prawy; lewy jest lustrem) ----------------
F_pow, F_pow_x = 8.6, 4.3
pin = np.array([36.0, 0.0, 0.0])
lin += ['## Słupek zawiasu powiek (prawy, lewy symetryczny)', '',
        'Obciążenie: 8,6 N na osi zawiasu (z = 0) w y albo w z, 4,3 N w x (ręka przy montażu).', '',
        '### Przekroje poziome (warstwy przy druku na płasko): naprężenie w poprzek warstw', '',
        '| y przekroju | pole [mm²] | długość w z [mm] | σ od 8,6 N w y | σ od 8,6 N w z | σ od 4,3 N w x | zapas (w poprzek) |', '|---|---|---|---|---|---|---|']
najgorszy_poz = 0
for y in (-14.9, -13, -11, -9, -7, -5.5):
    seg = przekroj(1, y, lambda m: m[0] > 25)            # (x, z), prawy słupek
    w = wlasnosci(seg)
    if w is None: continue
    zc = w['vc']; xc = w['uc']
    s_y = F_pow * (0 - zc) * w['cv'] / w['Iu'] + F_pow / w['A']       # F_y: moment wokół x (ramię w z) + osiowe
    s_z = F_pow * (0 - y) * w['cv'] / w['Iu']                          # F_z: moment wokół x (ramię w y)
    s_x = F_pow_x * (0 - y) * w['cu'] / w['Iv'] + F_pow_x * abs(0 - zc) / (0.2 * w['A'] * w['t'])   # F_x: zginanie + skręcanie (szacunek)
    smax = max(abs(s_y), abs(s_z), abs(s_x)); najgorszy_poz = max(najgorszy_poz, smax)
    dl = 2 * w['cv']
    lin.append(f'| {y:+.1f} | {w["A"]:.0f} | {dl:.1f} | {abs(s_y):.1f} | {abs(s_z):.1f} | {abs(s_x):.1f} | {R_POP / smax:.1f} |')
lin += ['', '### Przekroje pionowe wzdłuż ramienia: naprężenie wzdłuż warstw (druk na płasko)', '',
        '| z przekroju | pole [mm²] | σ od 8,6 N w y | σ od 4,3 N w x | zapas (wzdłuż) | zapas (w poprzek, druk pod kątem) |', '|---|---|---|---|---|---|']
I_z = []
for z in np.arange(-48.5, 0.01, 1.0):
    seg = przekroj(2, z, lambda m: m[0] > 25 and m[1] > -15.5)       # (x, y), część nad płytą
    w = wlasnosci(seg)
    if w is None: continue
    I_z.append((z, w['Iu'], w['Iv']))
    if z in (-48.5, -42.5, -35.5, -28.5, -20.5, -14.5, -7.5, -1.5):
        s_y = F_pow * (0 - z) * w['cv'] / w['Iu']; s_x = F_pow_x * (0 - z) * w['cu'] / w['Iv']
        smax = max(s_y, s_x)
        lin.append(f'| {z:+.0f} | {w["A"]:.0f} | {s_y:.1f} | {s_x:.1f} | {R_WZD / smax:.1f} | {R_POP / smax:.1f} |')
def ugiecie(I_z, F, z_obc, ktory):
    # wspornik utwierdzony na z0 = I_z[0][0]: δ = ∫ M(z)·(z_obc − z) / (E·I) dz, M = F·(z_obc − z)
    zs = np.array([r[0] for r in I_z]); Is = np.array([r[1 if ktory == 'y' else 2] for r in I_z])
    m = zs <= z_obc
    zs, Is = zs[m], Is[m]
    integ = (F * (z_obc - zs) ** 2) / (E_PLA * Is)
    return np.trapezoid(integ, zs) if hasattr(np, 'trapezoid') else np.trapz(integ, zs)
d_y = ugiecie(I_z, F_pow, 0.0, 'y'); d_x = ugiecie(I_z, F_pow_x, 0.0, 'x')
lin += ['', f'Ugięcie osi zawiasu (wspornik od przodu płyty, bez kleju w tubie): {d_y:.2f} mm od 8,6 N w y, {d_x:.2f} mm od 4,3 N w x.', '']
lin += ['**Wklejone w tubę** (klej przy tylnym brzegu tuby, podparcie przegubowe): moment przy nasadzie M = F·a/2.', '',
        '| Tuba | klej na z | wysięg a | moment przy nasadzie / bez kleju |', '|---|---|---|---|']
for L in (30, 40, 50):
    zg = 6 - L; a = 0 - zg; Lb = zg - (-49)
    lin.append(f'| {L} | {zg} | {a} | {a / 2:.0f} / 49 mm·F → {a / 2 / 49 * 100:.0f} % |')
lin.append('')

# ---------------- słupek kardana ----------------
F_k, F_ax, T_k, G_k = 19.0, 31.0, 60.0, 0.5
lin += ['## Słupek kardana', '',
        'Obciążenie w środku kuli (z = 0): 19 N poprzecznie (w y albo w x), osiowo 31 N, skręcanie 60 N·mm, ciężar gałki 0,5 N w y.', '',
        '### Przekroje poziome (warstwy przy druku na płasko): naprężenie w poprzek warstw', '',
        '| y przekroju | pole [mm²] | długość w z × szerokość w x [mm] | σ od 19 N w y | σ od 19 N w x | σ od 31 N osiowo | zapas (w poprzek) |', '|---|---|---|---|---|---|---|']
for y in (-14.9, -13, -11, -9, -7):
    seg = przekroj(1, y, lambda m: abs(m[0]) < 16)
    w = wlasnosci(seg)
    if w is None: continue
    zc = w['vc']
    s_y = (F_k + G_k) * (0 - zc) * w['cv'] / w['Iu'] + (F_k + G_k) / w['A']
    s_x = F_k * (0 - y) * w['cu'] / w['Iv'] + F_k * abs(zc) / (0.2 * w['A'] * w['t'])
    s_ax = F_ax * (0 - y) * w['cv'] / w['Iu']            # siła osiowa (w z) na wysokości osi daje moment wokół x
    smax = max(s_y, s_x, s_ax)
    lin.append(f'| {y:+.1f} | {w["A"]:.0f} | {2 * w["cv"]:.1f} × {2 * w["cu"]:.1f} | {s_y:.1f} | {s_x:.1f} | {s_ax:.1f} | {R_POP / smax:.1f} |')
lin += ['', '### Przekroje pionowe wzdłuż słupka: naprężenie wzdłuż warstw (druk na płasko)', '',
        '| z przekroju | pole [mm²] | σ od 19 N (y lub x) | σ osiowe + skręcanie | zapas (wzdłuż) | zapas (w poprzek, druk pod kątem) |', '|---|---|---|---|---|---|']
Ik = []
for z in np.arange(-48.5, -14.24, 1.0):
    seg = przekroj(2, z, lambda m: abs(m[0]) < 16 and m[1] > -15.5)
    w = wlasnosci(seg)
    if w is None: continue
    Ik.append((z, w['Iu'], w['Iv']))
    if z in (-48.5, -44.5, -40.5, -35.5, -31.5, -25.5, -20.5, -15.5):
        I = min(w['Iu'], w['Iv']); c = max(w['cu'], w['cv'])
        s_b = F_k * (0 - z) * c / I
        s_o = F_ax / w['A'] + T_k / (0.2 * w['A'] * w['t'])
        smax = s_b + s_o
        lin.append(f'| {z:+.0f} | {w["A"]:.0f} | {s_b:.1f} | {s_o:.1f} | {R_WZD / smax:.1f} | {R_POP / smax:.1f} |')
# ugięcie środka kuli: wspornik do czoła słupka z = −14,25, dalej sztywny kardan do z = 0
def ug_kard(ktory):
    zs = np.array([r[0] for r in Ik]); Is = np.array([r[1 if ktory == 'y' else 2] for r in Ik])
    integ = F_k * (0 - zs) * (0 - zs) / (E_PLA * Is)
    return np.trapezoid(integ, zs) if hasattr(np, 'trapezoid') else np.trapz(integ, zs)
lin += ['', f'Ugięcie środka kuli od 19 N (słupek do z = −14,25, dalej kardan sztywny): {ug_kard("y"):.3f} mm w y, {ug_kard("x"):.3f} mm w x.', '']
out = '\n'.join(lin) + '\n'
if WYN: open(WYN, 'w', encoding='utf-8').write(out)
print(out)
