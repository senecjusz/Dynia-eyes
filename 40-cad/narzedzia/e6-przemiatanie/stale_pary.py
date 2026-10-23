#!/usr/bin/env python3
"""Pary stała–stała (v3.2): słupki stopu i ich podparcia, klatki, korpusy, wieżyczki, kable, ramiona wspornika, ucha.
Wymaganie ≥ 0,5 mm poza bryłami, które z założenia są połączone (podparcie–słupek, słupek–klatka własnego serwa itd.).
Dodatkowo bryły Uchwytu wobec czaszy Gałki (sztywno skręcone, Gałka nasuwana osiowo na Uchwyt: luz montażowy ≥ 0,3)."""
import sys, json
import numpy as np, e6model as M, przemiatanie as Z
P = M.params(sys.argv[1] if len(sys.argv) > 1 else None)
F = [f for f in M.fixed_prims(P) if f.kind in Z.SAMP and not f.name.endswith('klatka')]   # klatki to obwiednie ze wspólnymi ściankami
def joined(A, B):
    a, b = A.name, B.name; n = {a, b}
    for k in ('G zamknięcia', 'G otwarcia', 'D zamknięcia', 'D otwarcia'):
        if n <= {'słupek stopu ' + k, 'filar słupka ' + k, 'łącznik słupka ' + k, 'płytka słupka ' + k}: return True
    if any(x.startswith('płytka słupka G') for x in n) and (n & {'S_PG klatka', 'S_PG korpus'}): return True
    if any(x.startswith('łącznik słupka') for x in n) and 'ramię wspornika 200' in n: return True
    if any(x.startswith('filar słupka') for x in n) and 'tarcza' in n: return True
    for srv, w in (('S_PG', 'G'), ('S_PD', 'D')):
        if any(x.startswith('słupek stopu ' + w) for x in n) and (n & {srv + ' klatka', srv + ' korpus'}): return True
    # ten sam serwomechanizm
    pa = a.split(' ')[0]; pb = b.split(' ')[0]
    if pa == pb and pa.startswith('S_'): return True
    if a == b: return True
    rel = [('piasta wspornika', 'ramię wspornika'), ('ramię wspornika', 'słupek Płyty'), ('Słupek', 'kardan dolny'),
           ('Słupek', 'piasta wspornika'), ('słupek Płyty', 'ucho Ramy'), ('bok osi Ramy', 'bok osi Ramy'),
           ('Słupek', 'ramię wspornika'), ('ramię wspornika', 'ucho Ramy')]
    for x, y in rel:
        if (a.startswith(x) and b.startswith(y)) or (a.startswith(y) and b.startswith(x)): return True
    # klatki sąsiednich serw mają wspólne ścianki (projekt); korpusy i wieżyczki sprawdzamy
    if a.endswith('klatka') and b.endswith('klatka'): return True
    if a.endswith('kabel') and b.endswith('kabel'): return True      # kable mogą leżeć jeden przy drugim w kanale
    return False
res = []
for i, A in enumerate(F):
    for B in F[i + 1:]:
        if joined(A, B): continue
        if np.linalg.norm(A.c - B.c) - A.rad - B.rad > 3: continue
        v = Z.ev(A, B)
        if v is not None and v < 1.5: res.append((round(v, 3), A.name, B.name))
res.sort()
for r in res[:40]: print("%7.3f  %s – %s" % r)
print("Uchwyt – czasza Gałki (luz montażowy ≥ 0,3):")
mo = Z.Model(P, np.load('okno_splajn.npy'))
mo.plate_outer = np.array([[27 * np.cos(a), 27 * np.sin(a)] for a in np.linspace(0, 2 * np.pi, 72, endpoint=False)])
Sb = mo.eye(0.0, 0.0); ball = [p for p in Sb['bf'] if p.name == 'czasza gałki'][0]
for A in Sb['bf']:
    if A is ball or A.kind not in Z.SAMP or A.name.startswith('nadlew'): continue      # nadlewy są częścią Gałki
    if A.name.startswith('łapa'): print('  styk  %s (płytka łapy dociśnięta do czoła nadlewu i tylnej krawędzi Gałki z_b -12,68, zamierzony)' % A.name); continue
    print("%7.3f  %s" % (ball.dist(Z.surface_pts(A, 0.1)).min(), A.name))
zp = P['oknoZ'] - P['plytaT'] / 2
print("%7.3f  płyta okna (R zewn. %.2f przy z_b %.2f; czasza R%.1f)" % (P['kulaRin'] - np.hypot(P['plytaRout'], zp), P['plytaRout'], zp, P['kulaRin']))
print("słupki:")
for f in M.stop_posts(P):
    L = np.array([[i, j, k] for i in (-1, 1) for j in (-1, 1) for k in (-1, 1)]) * f.h
    C = f.ctr + L @ f.ax.T
    print("  %-32s x %.2f…%.2f  y %.2f…%.2f  z %.2f…%.2f  środek (%.2f; %.2f; %.2f)" % (f.name, C[:, 0].min(), C[:, 0].max(), C[:, 1].min(), C[:, 1].max(), C[:, 2].min(), C[:, 2].max(), *f.ctr))
