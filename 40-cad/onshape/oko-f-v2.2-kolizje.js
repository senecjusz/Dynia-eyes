// Sprawdzenie modulu oka F v2.2 na siatkach z Onshape (w przegladarce, bez FeatureScriptu).
// Uzycie (w otwartym Part Studio "Oko F v2.2"): wklej oko-f-v2.2-build.js, potem oko-f-v2-kolizje.js (silnik: siatki,
// odleglosci, kinematyka, OS.runSim), na koncu ten plik, i uruchom:
//   await OS.siatki();                                   // siatki czesci v2.2 (kaseta w roli "Tuleja")
//   await OS.runSim([-33, -30, -15, 0, 15, 30, 33]);     // ruch: min. odstep i przenikania dla par czesci
//   await OS.wsuwanie();                                 // kolejnosc montazu na stole i kaseta -> gniazdo
//   OS.nawisyWszystkie();                                // nawisy > 44 st. w ulozeniu do druku
//   OS.scianki();                                        // grubosc scian w krytycznych miejscach
(() => {
const OS = window.OS, D = OS.D;

OS.mesh1 = async (n) => {
  const r = await OS.req(`${OS.base}/tessellatedfaces?partId=${encodeURIComponent(OS.PID[n])}&chordTolerance=0.00003&angleTolerance=0.12`);
  const j = await r.json(); const T = [];
  for (const b of j.bodies) for (const f of b.faces) for (const t of (f.facets || [])) T.push(t.vertices.map((v) => [v.x * 1000, v.y * 1000, v.z * 1000]));
  return T;
};
OS.siatki = async () => {
  const map = { Tuleja: 'Kaseta', Jarzmo: 'Jarzmo z miska', Ciegno: 'Ciegno', Ramie: 'Ramie orczyka', TulejkaC: 'Tulejka przegubu korby',
    TulejkaH: 'Tulejka przegubu ramienia', Pokrywa: 'Pokrywa tylna', Pileczka: 'PODGLAD pileczka 40.5', SG90: 'PODGLAD SG90', Orczyk: 'PODGLAD orczyk SG90',
    Sanki: 'Sanki serwa', Gniazdo: 'Gniazdo', Nakretka: 'Nakretka', PW: 'Przyrzad do wklejania pileczki', PO: 'Przyrzad centrowania orczyka',
    PG: 'Probka gwintu - gniazdo', PN: 'Probka gwintu - nakretka' };
  OS.mesh = {}; for (const [k, n] of Object.entries(map)) OS.mesh[k] = await OS.mesh1(n);
};

// przesuwanie czesci "mov" wzdluz Z o kolejne "shifts" (opcjonalnie podniesionych o offY) wzgledem nieruchomych "stat"
OS.sweep = async (mov, stat, shifts, opt = {}) => {
  const { prep, dist, inside, samples } = OS.sim, M = OS.mesh, y0 = () => new Promise((r) => setTimeout(r, 0));
  const B = prep([].concat(...stat.map((k) => M[k]))); const res = { min: 99, at: null, pen: 0, penBy: {} };
  const P = {}; for (const k of mov) { P[k] = samples(M[k], opt.step || 1.2); if (opt.offY) P[k] = P[k].map(([x, y, z]) => [x, y + opt.offY, z]); await y0(); }
  for (const s of shifts) for (const k of mov) { let n = 0;
    for (const p of P[k]) { const q = [p[0], p[1], p[2] + s]; if (opt.skip && opt.skip(k, q, p)) continue; const d = dist(B, q, 3);
      if (d < res.min) { res.min = d; res.at = [s, k, q.map((v) => v.toFixed(1)).join(',')]; } if (d > 0.03 && inside(B, q)) n++; }
    if (n) { res.pen += n; res.penBy[k + '@' + s] = n; } await y0(); }
  res.min = +res.min.toFixed(3); return res;
};
const range = (a, b, st) => { const o = []; for (let s = a; s <= b + 1e-9; s += st) o.push(+s.toFixed(2)); return o; };
// haczyki zaczepow (ugniataja sie przy wsuwaniu) liczone osobno
const hak = (k, q, p) => { if (k !== 'Tuleja') return false; const r = Math.hypot(p[0], p[1]); if (r < 27.3) return false;
  const a = (Math.atan2(p[1], p[0]) * 180 / Math.PI + 360) % 360; return (a > 50 && a < 65) || (a > 230 && a < 245); };
OS.wsuwanie = async () => {
  const o = {};
  o.jarzmo = await OS.sweep(['Jarzmo', 'Pileczka'], ['Tuleja'], range(-82, 0, 2));                           // 1. jarzmo z pileczka od tylu
  o.sanki = await OS.sweep(['Sanki', 'SG90'], ['Tuleja', 'Jarzmo', 'Pileczka'], range(-38, 0, 1.5), { step: 1 });   // 2. sanki z serwem
  o.ramie = await OS.sweep(['Ramie', 'Orczyk'], ['Tuleja', 'SG90', 'Sanki', 'Jarzmo'], range(-40, 0, 2), { step: 1, offY: 2.6 }); // 3. ramie nad wielowypustem
  o.ciegno = await OS.sweep(['Ciegno'], ['Tuleja', 'SG90', 'Sanki', 'Jarzmo', 'Ramie', 'Orczyk', 'Pileczka'], range(-48, 0, 2), { step: 0.8 }); // 4. ciegno od tylu
  o.kaseta = await OS.sweep(['Tuleja', 'Pileczka'], ['Gniazdo', 'Nakretka'], range(-44, 0, 4).concat([-2, 0]), { skip: hak }); // 5. kaseta do gniazda
  o.haczyki = await OS.sweep(['Tuleja'], ['Gniazdo'], [-4, -2, 0], { step: 0.5, skip: (k, q, p) => !hak(k, q, p) });
  return o;
};

// nawisy: sciany skierowane w dol bardziej niz 44 st. (poza sciana na stole); n = kierunek "w dol" przy druku
OS.nawisy = (T, n, c = [0, 0, 0], thr = 0.7193) => {
  const sOf = (p) => (p[0] - c[0]) * n[0] + (p[1] - c[1]) * n[1] + (p[2] - c[2]) * n[2];
  let smax = -1e9; for (const t of T) for (const p of t) smax = Math.max(smax, sOf(p));
  const nrm = (t) => { const a = [0, 1, 2].map((k) => t[1][k] - t[0][k]), b = [0, 1, 2].map((k) => t[2][k] - t[0][k]);
    const x = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; const L = Math.hypot(...x) || 1; return [x.map((v) => v / L), L / 2]; };
  let area = 0; const bins = {};
  for (const t of T) { const [v, A] = nrm(t); const d = v[0] * n[0] + v[1] * n[1] + v[2] * n[2];
    if (d > thr && !t.every((p) => Math.abs(sOf(p) - smax) < 0.05)) { area += A; const m = [0, 1, 2].map((k) => (t[0][k] + t[1][k] + t[2][k]) / 3);
      const key = m.map((x) => Math.round(x / 2) * 2).join(',') + ' h=' + (smax - sOf(m)).toFixed(1); bins[key] = (bins[key] || 0) + A; } }
  return { area: +area.toFixed(1), top: Object.entries(bins).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, v]) => k + ' A=' + v.toFixed(1)) };
};
OS.nawisyWszystkie = () => { const M = OS.mesh, o = {};
  for (const [nm, k, n] of [['Gniazdo', 'Gniazdo', [0, 0, 1]], ['Nakretka', 'Nakretka', [0, 0, -1]], ['Kaseta', 'Tuleja', [0, 0, 1]], ['Jarzmo', 'Jarzmo', [D.n[0], 0, D.n[1]]],
    ['Ciegno', 'Ciegno', [0, -1, 0]], ['Ramie', 'Ramie', [0, 1, 0]], ['Tulejka', 'TulejkaC', [0, -1, 0]], ['Sanki', 'Sanki', [0, -1, 0]], ['Pokrywa', 'Pokrywa', [0, 0, -1]],
    ['Przyrzad wklejania', 'PW', [0, 0, 1]], ['Przyrzad orczyka', 'PO', [0, -1, 0]], ['Probka gniazdo', 'PG', [0, 0, 1]], ['Probka nakretka', 'PN', [0, 0, -1]]])
    o[nm] = OS.nawisy(M[k], n, k === 'Jarzmo' ? [0, 0, D.zc] : [0, 0, 0]);
  return o; };

// grubosc: promien z punktu tuz przed powierzchnia, roznica pierwszego i drugiego przeciecia
OS.ray = (T, o, d) => { const hits = []; for (const t of T) { const e1 = [0, 1, 2].map((k) => t[1][k] - t[0][k]), e2 = [0, 1, 2].map((k) => t[2][k] - t[0][k]);
  const p = [d[1] * e2[2] - d[2] * e2[1], d[2] * e2[0] - d[0] * e2[2], d[0] * e2[1] - d[1] * e2[0]]; const det = e1[0] * p[0] + e1[1] * p[1] + e1[2] * p[2]; if (Math.abs(det) < 1e-12) continue;
  const iv = 1 / det, s = [0, 1, 2].map((k) => o[k] - t[0][k]); const u = (s[0] * p[0] + s[1] * p[1] + s[2] * p[2]) * iv; if (u < 0 || u > 1) continue;
  const q = [s[1] * e1[2] - s[2] * e1[1], s[2] * e1[0] - s[0] * e1[2], s[0] * e1[1] - s[1] * e1[0]]; const v = (d[0] * q[0] + d[1] * q[1] + d[2] * q[2]) * iv; if (v < 0 || u + v > 1) continue;
  const tt = (e2[0] * q[0] + e2[1] * q[1] + e2[2] * q[2]) * iv; if (tt > 1e-4) hits.push(tt); } hits.sort((a, b) => a - b); return hits; };
OS.thick = (T, o, d) => { const h = OS.ray(T, o, d); return h.length >= 2 ? +(h[1] - h[0]).toFixed(2) : null; };
OS.scianki = () => { const K = OS.mesh.Tuleja, o = {}, c = Math.cos(135 * Math.PI / 180), s = Math.sin(135 * Math.PI / 180);
  o.wybranieH = []; for (const y of [-4.5, 0, 6]) for (const z of [-44.4, -47.7, -51]) o.wybranieH.push(OS.thick(K, [-24, y, z], [-1, 0, 0]));
  o.wybranieC = []; for (const y of [-3.4, 0.4]) for (const z of [-22.6, -28, -31.5]) o.wybranieC.push(OS.thick(K, [23.5, y, z], [1, 0, 0]));
  o.kanalKolka = [OS.thick(K, [0, 23, -40], [0, 1, 0]), OS.thick(K, [0, -23, -30], [0, -1, 0])];
  o.rowek = OS.thick(K, [23 * c, 23 * s, -20], [c, s, 0]);
  o.wystepOsi = OS.thick(K, [2.2, 23, -12], [0, 1, 0]);
  return o; };
return 'kolizje v2.2 ok';
})();
