#!/usr/bin/env python3
"""Akceptacja wymiarów przegubów prętów gałki (v3.2, U–R–U): przelicza komplet i daje TAK/NIE.

Użycie:  python3 przeguby_akceptacja.py przeguby.json [--szybko] [--uzyj]
Wzór wejścia: przeguby_odniesienie.json (przegub drukowany przy gałce uGal, przy orczyku uOrcz, wysokość środka H).
Sprawdza: (1) każda para poza stykiem zamierzonym ≥ 0,5 mm (pary obrotowe ≥ 0,2) w całym zakresie;
(2) okno – Słupek ≥ 0,5 w pracy; (3) dla każdego przegubu: kąt wymagany (kinematyka.py, cały zakres do ograniczników)
≤ kąt dopuszczalny z u_zakres() (luz 0,5 w całym obrocie), osobno wokół a1 i a2.
--uzyj: wykorzystaj zapisane przemiatanie (<pomiary>_przemiatanie.json albo przemiatanie.json) tylko wtedy,
gdy zgadza się skrót parametrów, trybu i plików modelu (przemiatanie.skrot).
"""
import sys, os, json, hashlib
import numpy as np, e6model as M, przemiatanie as Z


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    meas = json.load(open(args[0]))
    for k in ('uGal', 'uOrcz', 'hPrzegubu'):
        if k not in meas: sys.exit('brak pola %s w %s' % (k, args[0]))
    over = dict(uGal=meas['uGal'], uOrcz=meas['uOrcz'], M5=dict(h=meas['hPrzegubu']))
    P = M.params(None, over)
    okno = json.load(open(os.environ.get('OKNO', 'okno.json'))); ER = Z.EyeRange(okno)
    base = os.path.splitext(args[0])[0]; sw = base + '_przemiatanie.json'
    hsh = Z.skrot(P, '--szybko' in sys.argv)
    res = None
    if '--uzyj' in sys.argv:
        for f in (sw, 'przemiatanie.json'):
            if os.path.exists(f):
                r = json.load(open(f))
                if r.get('skrot') == hsh: res = r; print('przemiatanie z pliku', f); break
        if res is None: print('zapisane przemiatanie nie pasuje do parametrów – liczę od nowa')
    if res is None:
        res = Z.run(P, szybko='--szybko' in sys.argv, out=sw, log=lambda *a: None)
    tw, tc, st = Z.top(res, 10)
    viol = []
    for r in res['pary']:
        nm = ' '.join(r[0])
        if 'zamierzony' in nm or r[0] == ['D części', 'G części']: continue
        lim = 0.2 if 'obrotowa' in nm else 0.5
        if r[3] < lim: viol.append('para %s – %s: %.3f < %.1f (%s)' % (r[0][0], r[0][1], r[3], lim, r[4]))
    if okno['zapas_praca'][0] < 0.5: viol.append('okno – Słupek %.3f < 0,5' % okno['zapas_praca'][0])
    import subprocess
    kin = json.loads(subprocess.run([sys.executable, 'kinematyka.py', '/dev/stdin'], input=json.dumps(over), capture_output=True, text=True).stdout)
    lim = dict(galka=M.u_zakres(P['uGal'], P['pretUU']['D'] / 2), orczyk=M.u_zakres(P['uOrcz'], P['pretUU']['D'] / 2))
    kin['dopuszczalne'] = {k: dict(a1=v[0], a2=v[1]) for k, v in lim.items()}
    for n in ('X', 'Y'):
        for j, nm in (('galka', 'przy gałce'), ('orczyk', 'przy orczyku')):
            a2 = float(kin['wychylenie_%s%s' % (j, n)].split('/')[1]); a1 = max(abs(x) for x in kin['obrot_a1_%s%s' % (j, n)][2:])
            if a1 > lim[j][0]: viol.append('przegub %s %s: obrót wokół a1 %.1f° > %.2f°' % (nm, n, a1, lim[j][0]))
            if a2 > lim[j][1]: viol.append('przegub %s %s: wychylenie wokół a2 %.1f° > %.2f°' % (nm, n, a2, lim[j][1]))
    out = dict(TAK=not viol, naruszenia=viol, skrot=hsh, kinematyka=kin,
               top_praca=[[r[0], round(r[1], 3), r[2]] for r in tw], top_calosc=[[r[0], round(r[3], 3), r[4]] for r in tc])
    json.dump(out, open(base + '_wynik.json', 'w'), indent=1, ensure_ascii=False, default=float)
    print('przeguby:', 'TAK' if not viol else 'NIE')
    for v in viol: print('  -', v)


if __name__ == '__main__':
    main()
