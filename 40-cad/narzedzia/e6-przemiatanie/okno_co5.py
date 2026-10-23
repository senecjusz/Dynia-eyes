# Okno ogranicznika co 5 deg (Fable v3 W3): brzeg zakresu co 0,25 deg (boundary n=112), Słupek co 0,05 mm w z,
# 720 punktów po obwodzie, rozdzielczość kątowa 0,25 deg, wartości zaokrąglone w górę do 0,01 mm.
# Uruchomienie z tego katalogu: python3 okno_co5.py  (E6.2, wykonawca CAD, 23.10)
import numpy as np, window as W
ph = np.linspace(0, 2*np.pi, 720, endpoint=False); z = np.arange(-20.0, -5.5 + 1e-9, 0.05)
P, Z = np.meshgrid(ph, z); W.PP = np.stack([W.RP*np.cos(P).ravel(), W.RP*np.sin(P).ravel(), Z.ravel()], 1)
zc = -6.0; nb = 1440; rb = np.zeros(nb)
for (p, t) in W.boundary(28, 18, 112):
    s = W.slab_pts(p, t, zc, 1.5)
    if len(s) == 0: continue
    a = np.arctan2(s[:, 1], s[:, 0]); r = np.hypot(s[:, 0], s[:, 1])
    k = ((a + np.pi)/(2*np.pi)*nb).astype(int) % nb
    np.maximum.at(rb, k, r)
phd = np.degrees((np.arange(nb) + 0.5)/nb*2*np.pi - np.pi)
for d in range(0, 91, 5):
    vals = [rb[np.abs(((phd - q + 180) % 360) - 180) <= 0.5].max() for q in (d, 180 - d, -d, d - 180)]
    print('okno_r%d %.2f' % (d, np.ceil(max(vals)*100)/100))
print('max %.2f przy phi %.2f' % (rb.max(), phd[rb.argmax()]))
