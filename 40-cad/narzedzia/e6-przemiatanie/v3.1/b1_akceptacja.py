#!/usr/bin/env python3
"""Akceptacja pomiarów B1 (przeguby kulowe z warsztatu): przelicza KOMPLET i daje TAK/NIE.

Użycie:  python3 b1_akceptacja.py b1_pomiary.json [--szybko] [--uzyj]   (--uzyj: wykorzystaj zapisane przemiatanie)
Wymaga okno.json / okno_splajn.npy (okno.py; okno nie zależy od przegubów).

Wpisuje pomiary do modelu (serwa stoją w stałych miejscach, środki kulek M5 wynikają z wysokości h),
liczy pełne przemiatanie i sprawdza:
  1. każda para poza stykiem zamierzonym ≥ 0,5 mm w CAŁYM zakresie (gałka do okna, powieki do ograniczników),
     w tym obudowa M5 – własne Ramię i obudowa M2 – własna piasta (to zastępuje regułę h ≥ R + 0,5);
  2. okno – Słupek: zapas w pracy ≥ 0,5 (okno.json);
  3. wychylenie przegubu do oporu WŁASNEGO (obudowa o szyjkę czopu, kulka trzymana w imadle, bez płytki)
     ≥ wymagane w zakresie + 2°; styk obudowy z gniazdem i piastą liczy model z wymiarów gniazda;
  4. gwinty: obudowa M5 na szpilce ≥ 5 mm, obudowa M2 ≥ 3,5 mm; czop M5 przez Ramię 6 mm z wystawaniem ≤ 3 mm;
  5. siła wypięcia M2 (tylko informacyjnie: okno bezpiecznika 28–35 N).
"""
import numpy as np, json, sys, os
import e6model as M, przemiatanie as Z


def to_params(meas):
    m2 = meas['M2']; m5 = meas['M5']
    over = dict(M2=dict(h=m2['h'], gD=m2['gniazdo_D'], gH=m2['gniazdo_H'], sD=m2['trzon_D'], L=m2['obudowa_L'],
                        kat=m2['kat_do_oporu']),
                M5=dict(h=m5['h'], gD=m5['gniazdo_D'], gH=m5['gniazdo_H'], sD=m5['trzon_D'], L=m5['obudowa_L'],
                        kat=m5['kat_do_oporu']),
                endR=meas.get('koncowkaM5_D', 8.0) / 2)
    for k in ('cokol', 'cokolR'):
        if k in m2: over['M2'][k] = m2[k]
        if k in m5: over['M5'][k] = m5[k]
    if 'kabelStrona' in meas: over['kabelStrona'] = meas['kabelStrona']
    return over


def misalign(P, ER):
    hX = M.Horn(P, 'X'); hY = M.Horn(P, 'Y')
    mx = dict(M5X=0, M5Y=0, M2X=0, M2Y=0)
    for p in np.arange(-28.5, 28.6, 0.5):
        for t in np.arange(-18.5, 18.6, 0.5):
            if not ER.inside(p, t): continue
            R, PX, PY = M.eye_points(P, p, t)
            for nm, Pt, h in (('X', PX, hX), ('Y', PY, hY)):
                a = h.ik(Pt); A, H, d = h.AHd(a); e = (H - Pt) / np.linalg.norm(H - Pt)
                mx['M5' + nm] = max(mx['M5' + nm], np.degrees(np.arcsin(abs(e @ d))))
                mx['M2' + nm] = max(mx['M2' + nm], np.degrees(np.arcsin(abs(e @ (R @ np.array([0, 1.0, 0]))))))
    return mx


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    meas = json.load(open(args[0]))
    over = to_params(meas)
    P = M.params(None, over)
    okno = json.load(open(os.environ.get('OKNO', 'okno.json')))
    ER = Z.EyeRange(okno)
    out = os.environ.get('OUT', os.path.splitext(args[0])[0] + '_wynik.json')
    sw = out.replace('_wynik', '_przemiatanie')
    if '--uzyj' in sys.argv and os.path.exists(sw):          # ponowne użycie przemiatania dla tych samych pomiarów
        res = json.load(open(sw))
    else:
        res = Z.run(P, szybko='--szybko' in sys.argv, out=sw, log=lambda *a: None)
    tw, tc, st = Z.top(res, 10)
    viol = []
    allrows = [r for r in res['pary'] if not any('zamierzony' in x for x in r[0]) and r[0] != ['D części', 'G części']]
    bad = sorted([r for r in allrows if r[3] < 0.5], key=lambda r: r[3])
    for r in bad:
        viol.append("para %s – %s: %.3f mm < 0,5 (%s)" % (r[0][0], r[0][1], r[3], r[4]))
    if okno['zapas_praca'][0] < 0.5:
        viol.append("okno – Słupek: zapas w pracy %.3f < 0,5" % okno['zapas_praca'][0])
    mis = misalign(P, ER)
    for k, req in mis.items():
        meas_k = meas['M2' if k.startswith('M2') else 'M5']['kat_do_oporu']
        if meas_k < req + 2.0:
            viol.append("wychylenie %s: wymagane %.1f° + 2°, zmierzone %.1f°" % (k, req, meas_k))
    if meas['M5'].get('gwint_obudowy_gl', 99) < 5.0: viol.append("gwint obudowy M5 < 5 mm")
    if meas['M2'].get('gwint_obudowy_gl', 99) < 3.5: viol.append("gwint obudowy M2 < 3,5 mm")
    hX = M.Horn(P, 'X'); hY = M.Horn(P, 'Y')
    for nm, h in (('X', hX), ('Y', hY)):
        lmax = P['M5'].get('cokol', 0.0) + P['ramieT'] / h.d0[0] + P['M5']['studTail' + nm]
        lg = meas['M5'].get('gwint_czopa_L', 0)
        if lg > lmax:
            viol.append("czop M5 %s: gwint %.1f > %.1f mm (skrócić)" % (nm, lg, lmax))
    wynik = dict(TAK=(len(viol) == 0), naruszenia=viol, wychylenia_wymagane=mis,
                 min_praca=tw[0][1] if tw else None, min_calosc=tc[0][3] if tc else None,
                 top_praca=[[r[0], round(r[1], 3), r[2]] for r in tw], top_calosc=[[r[0], round(r[3], 3), r[4]] for r in tc],
                 styki_zamierzone=[[r[0], round(r[1], 3), round(r[3], 3)] for r in st],
                 okno_zapas_praca=okno['zapas_praca'], plyta_mostki=res['mostki'], powieki=res['powieki'],
                 pret_L=dict(X=round(hX.L, 3), Y=round(hY.L, 3)),
                 kulkaM5_zero=dict(X=list(np.round(hX.C + hX.w, 3)), Y=list(np.round(hY.C + hY.w, 3))))
    json.dump(wynik, open(out, 'w'), indent=1, ensure_ascii=False, default=float)
    print("B1:", "TAK" if wynik['TAK'] else "NIE")
    for v in viol: print("  -", v)
    print("najmniej w pracy %.3f, w całym zakresie %.3f; okno – Słupek %.3f" % (wynik['min_praca'], wynik['min_calosc'], okno['zapas_praca'][0]))
    print("wychylenia wymagane:", {k: round(v, 1) for k, v in mis.items()})
    print("pręty X %.2f / Y %.2f; kulki M5 w zerze X %s Y %s" % (hX.L, hY.L, wynik['kulkaM5_zero']['X'], wynik['kulkaM5_zero']['Y']))


if __name__ == '__main__':
    main()
