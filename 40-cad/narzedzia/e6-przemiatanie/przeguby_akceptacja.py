#!/usr/bin/env python3
"""Akceptacja wymiarów przegubów prętów gałki (v3.2, U–R–U): przelicza komplet i daje TAK/NIE.

Użycie:  python3 przeguby_akceptacja.py przeguby.json [--szybko] [--uzyj]
Wzór wejścia: przeguby_odniesienie.json (przegub drukowany przy gałce uGal, przy orczyku uOrcz, wysokość środka H).
Sprawdza: (0) komplet pól uGal/uOrcz (bez wartości domyślnych); (1) każda para poza stykiem zamierzonym ≥ 0,5 mm
(pary obrotowe ≥ 0,2) w całym zakresie; (2) okno – Słupek ≥ 0,5 w pracy; (3) pary stała–stała ≥ 0,5 (stale_pary.py);
(4) wnętrze każdego przegubu w 3D (przeguby_3d.py) ≥ 0,5 przy rzeczywistych kątach a1/a2 i zapas kąta > 0;
u_zakres() (przekroje płaskie) zostaje w wyniku jako informacja.
--uzyj: wykorzystaj zapisane przemiatanie (<pomiary>_przemiatanie.json albo przemiatanie.json) tylko wtedy,
gdy zgadza się skrót parametrów, trybu i plików modelu (przemiatanie.skrot).
"""
import sys, os, json, hashlib, subprocess
import numpy as np, e6model as M, przemiatanie as Z


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    meas = json.load(open(args[0]))
    for k in ('uGal', 'uOrcz', 'hPrzegubu'):
        if k not in meas: sys.exit('brak pola %s w %s' % (k, args[0]))
    WYM = ('Do', 'Hr', 'luzOs', 'policzek', 'rP', 'cP', 'pP', 'rS', 'cS', 'pS', 'lebR', 'lebH', 'lebHP', 'L', 'otwGl')
    braki = ['uGal.' + k for k in WYM + ('trojkaty',) if k not in meas['uGal']] + ['uOrcz.' + k for k in WYM + ('podstawaD', 'czopD', 'tulejaD', 'tulejaL', 'katWidelekX', 'katWidelekY') if k not in meas['uOrcz']]
    if braki: sys.exit('brak wymiarów (bez wartości domyślnych): ' + ', '.join(braki))
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
    kin = json.loads(subprocess.run([sys.executable, 'kinematyka.py', '/dev/stdin'], input=json.dumps(over), capture_output=True, text=True).stdout)
    lim = dict(galka=M.u_zakres(P['uGal'], P['pretUU']['D'] / 2), orczyk=M.u_zakres(P['uOrcz'], P['pretUU']['D'] / 2))
    kin['dopuszczalne_przekroje'] = {k: dict(a1=v[0], a2=v[1]) for k, v in lim.items()}
    pj = base + '_parametry.json'; json.dump(over, open(pj, 'w'), ensure_ascii=False)
    r3 = subprocess.run([sys.executable, 'przeguby_3d.py', pj] + (['--szybko'] if '--szybko' in sys.argv else []), capture_output=True, text=True)
    if r3.returncode: sys.exit('przeguby_3d.py: ' + r3.stderr[-500:])
    p3 = json.load(open('przeguby_3d.json'))
    for k, v in p3.items():
        if v['min_odstep'] < 0.5: viol.append('wnętrze przegubu %s: %.3f < 0,5 (%s, %s)' % (k, v['min_odstep'], v['para'], v['gdzie']))
        if v['zapas_deg'] <= 0: viol.append('wnętrze przegubu %s: brak zapasu kąta' % k)
    rs = subprocess.run([sys.executable, 'stale_pary.py', pj], capture_output=True, text=True)
    if rs.returncode: sys.exit('stale_pary.py: ' + rs.stderr[-500:])
    stale = []
    for line in rs.stdout.splitlines():
        if line.startswith('Uchwyt'): break
        try: v = float(line.split()[0]); stale.append(line.strip())
        except (ValueError, IndexError): continue
        if v < 0.5: viol.append('para stała–stała: ' + line.strip())
    kin['przeguby_3d'] = p3
    out = dict(TAK=not viol, naruszenia=viol, skrot=hsh, kinematyka=kin, stale_pary=stale[:10],
               top_praca=[[r[0], round(r[1], 3), r[2]] for r in tw], top_calosc=[[r[0], round(r[3], 3), r[4]] for r in tc])
    json.dump(out, open(base + '_wynik.json', 'w'), indent=1, ensure_ascii=False, default=float)
    print('przeguby:', 'TAK' if not viol else 'NIE')
    for v in viol: print('  -', v)


if __name__ == '__main__':
    main()
