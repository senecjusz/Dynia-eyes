// Sprawdzenie ruchu i kolizji modulu oka F v2.1 na siatkach z Onshape (w przegladarce, bez FeatureScriptu).
// Uzycie: po wklejeniu oko-f-v2.1-build.js (w otwartym Part Studio "Oko F v2.1") wklej ten plik i uruchom:
//   await OS.siatki();                     // pobiera siatki czesci (tessellatedfaces, tolerancja 0.03 mm)
//   const r = await OS.runSim([-33, -30, -20, 0, 20, 30, 33]);   // ok. 30-40 s na kat
// Wynik: dla kazdej pary czesci najmniejszy odstep [mm] i liczba punktow jednej czesci wewnatrz drugiej.
// Oko obraca sie o theta wokol osi Y przez (0, kulaZ); serwo i ciegno ustawiane z kinematyki czworoboku.
(() => {
const OS = window.OS, D = OS.D, d2r = Math.PI / 180;

OS.siatki = async () => {
  const ids = OS.PID; // nazwa czesci -> partId (z OS.nazwy)
  const map = { Tuleja: 'Obudowa', Jarzmo: 'Jarzmo z miska', Ciegno: 'Ciegno', Ramie: 'Ramie orczyka', TulejkaC: 'Tulejka przegubu korby',
    TulejkaH: 'Tulejka przegubu ramienia', Pokrywa: 'Pokrywa tylna', Pileczka: 'PODGLAD pileczka 40.5', SG90: 'PODGLAD SG90', Orczyk: 'PODGLAD orczyk SG90' };
  OS.mesh = {};
  for (const [k, n] of Object.entries(map)) {
    const r = await OS.req(`${OS.base}/tessellatedfaces?partId=${encodeURIComponent(ids[n])}&chordTolerance=0.00003&angleTolerance=0.12`);
    const j = await r.json(); const T = [];
    for (const b of j.bodies) for (const f of b.faces) for (const t of (f.facets || [])) T.push(t.vertices.map((v) => [v.x * 1000, v.y * 1000, v.z * 1000]));
    OS.mesh[k] = T;
  }
};

function prep(T) {
  const g3 = new Map(), g2 = new Map(), C = 2, C2 = 1;
  T.forEach((t, i) => {
    const lo = [0, 1, 2].map((k) => Math.min(t[0][k], t[1][k], t[2][k])), hi = [0, 1, 2].map((k) => Math.max(t[0][k], t[1][k], t[2][k]));
    for (let a = Math.floor(lo[0] / C); a <= Math.floor(hi[0] / C); a++) for (let b = Math.floor(lo[1] / C); b <= Math.floor(hi[1] / C); b++) for (let c = Math.floor(lo[2] / C); c <= Math.floor(hi[2] / C); c++) { const k = a + ',' + b + ',' + c; if (!g3.has(k)) g3.set(k, []); g3.get(k).push(i); }
    for (let b = Math.floor(lo[1] / C2); b <= Math.floor(hi[1] / C2); b++) for (let c = Math.floor(lo[2] / C2); c <= Math.floor(hi[2] / C2); c++) { const k = b + ',' + c; if (!g2.has(k)) g2.set(k, []); g2.get(k).push(i); }
  });
  return { T, g3, g2 };
}
function ptTri(p, a, b, c) {
  const sub = (u, v) => [u[0] - v[0], u[1] - v[1], u[2] - v[2]], dt = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
  const ab = sub(b, a), ac = sub(c, a), ap = sub(p, a); const d1 = dt(ab, ap), d2 = dt(ac, ap);
  if (d1 <= 0 && d2 <= 0) return Math.sqrt(dt(ap, ap));
  const bp = sub(p, b), d3 = dt(ab, bp), d4 = dt(ac, bp); if (d3 >= 0 && d4 <= d3) return Math.sqrt(dt(bp, bp));
  const vc = d1 * d4 - d3 * d2; if (vc <= 0 && d1 >= 0 && d3 <= 0) { const v = d1 / (d1 - d3); const e = sub(p, [a[0] + v * ab[0], a[1] + v * ab[1], a[2] + v * ab[2]]); return Math.sqrt(dt(e, e)); }
  const cp = sub(p, c), d5 = dt(ab, cp), d6 = dt(ac, cp); if (d6 >= 0 && d5 <= d6) return Math.sqrt(dt(cp, cp));
  const vb = d5 * d2 - d1 * d6; if (vb <= 0 && d2 >= 0 && d6 <= 0) { const w = d2 / (d2 - d6); const e = sub(p, [a[0] + w * ac[0], a[1] + w * ac[1], a[2] + w * ac[2]]); return Math.sqrt(dt(e, e)); }
  const va = d3 * d6 - d5 * d4; if (va <= 0 && (d4 - d3) >= 0 && (d5 - d6) >= 0) { const w = (d4 - d3) / ((d4 - d3) + (d5 - d6)); const e = sub(p, [b[0] + w * (c[0] - b[0]), b[1] + w * (c[1] - b[1]), b[2] + w * (c[2] - b[2])]); return Math.sqrt(dt(e, e)); }
  const den = 1 / (va + vb + vc), v = vb * den, w = vc * den; const e = sub(p, [a[0] + ab[0] * v + ac[0] * w, a[1] + ab[1] * v + ac[1] * w, a[2] + ab[2] * v + ac[2] * w]); return Math.sqrt(dt(e, e));
}
function dist(M, p, R) {
  const C = 2; let best = R; const seen = new Set();
  for (let a = Math.floor((p[0] - R) / C); a <= Math.floor((p[0] + R) / C); a++) for (let b = Math.floor((p[1] - R) / C); b <= Math.floor((p[1] + R) / C); b++) for (let c = Math.floor((p[2] - R) / C); c <= Math.floor((p[2] + R) / C); c++) {
    const L = M.g3.get(a + ',' + b + ',' + c); if (!L) continue;
    for (const i of L) { if (seen.has(i)) continue; seen.add(i); const t = M.T[i]; const d = ptTri(p, t[0], t[1], t[2]); if (d < best) best = d; }
  }
  return best;
}
// punkt wewnatrz bryly: parzystosc przeciec promienia +x, glosowanie 3 promieni przesunietych (unika szwow siatki)
function inside(M, p) {
  const votes = [[0.0131, 0.0277], [-0.0213, 0.0119], [0.0071, -0.0241]].map(([dy, dz]) => {
    const py = p[1] + dy, pz = p[2] + dz; const L = M.g2.get(Math.floor(py) + ',' + Math.floor(pz)); if (!L) return 0; let n = 0;
    for (const i of L) { const [a, b, c] = M.T[i]; const e1y = b[1] - a[1], e1z = b[2] - a[2], e2y = c[1] - a[1], e2z = c[2] - a[2]; const det = e1y * e2z - e1z * e2y; if (Math.abs(det) < 1e-12) continue;
      const qy = py - a[1], qz = pz - a[2]; const u = (qy * e2z - qz * e2y) / det, v = (e1y * qz - e1z * qy) / det; if (u < 0 || v < 0 || u + v > 1) continue;
      if (a[0] + u * (b[0] - a[0]) + v * (c[0] - a[0]) > p[0]) n++; }
    return n % 2; });
  return votes.reduce((s, v) => s + v, 0) >= 2;
}
function samples(T, step = 1.0) {
  const P = [];
  for (const [a, b, c] of T) { const L = Math.max(Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]), Math.hypot(c[0] - a[0], c[1] - a[1], c[2] - a[2]), Math.hypot(c[0] - b[0], c[1] - b[1], c[2] - b[2])); const n = Math.max(1, Math.ceil(L / step));
    for (let i = 0; i <= n; i++) for (let j = 0; j <= n - i; j++) { const u = i / n, v = j / n, w = 1 - u - v; P.push([a[0] * w + b[0] * u + c[0] * v, a[1] * w + b[1] * u + c[1] * v, a[2] * w + b[2] * u + c[2] * v]); } }
  const S = new Map(); for (const p of P) S.set(p.map((x) => x.toFixed(2)).join(','), p); return [...S.values()];
}
const rot = (P, cx, cz, b) => { const c = Math.cos(b), s = Math.sin(b); return P.map(([x, y, z]) => { const dx = x - cx, dz = z - cz; return [cx + dx * c - dz * s, y, cz + dx * s + dz * c]; }); };
const A = D.A, S = D.S, a = D.korba, al = D.alfa * d2r, c = D.ramie, be = D.beta * d2r, L = D.ciegno;
const Cf = (t) => [a * Math.sin(al + t), A[1] - a * Math.cos(al + t)], Hf = (f) => [S[0] + c * Math.sin(be + f), S[1] - c * Math.cos(be + f)];
function phi(t) { let f = 0; const steps = Math.max(1, Math.ceil(Math.abs(t) / d2r));
  for (let k = 1; k <= steps; k++) { const tt = t * k / steps; for (let i = 0; i < 30; i++) { const C = Cf(tt), H = Hf(f), g = Math.hypot(H[0] - C[0], H[1] - C[1]) - L; const H2 = Hf(f + 1e-6); const g2 = Math.hypot(H2[0] - C[0], H2[1] - C[1]) - L; f -= g / ((g2 - g) / 1e-6); if (Math.abs(g) < 1e-10) break; } }
  return f; }
OS.sim = { prep, dist, inside, samples, rot, phi, Cf, Hf, ptTri };

OS.runSim = async (thetas, pairsSel) => {
  const M = OS.mesh, y0 = () => new Promise((r) => setTimeout(r, 0));
  // lby srub M3 przegubow (DIN 912, 5.5 x 3) pod kolnierzami tulejek - ruszaja sie z ciegnem
  const head = (P0) => { const pts = []; for (let y = -6.8; y <= -3.8 + 1e-9; y += 0.5) for (let k = 0; k < 24; k++) { const f = k * 15 * d2r; pts.push([P0[0] + 2.75 * Math.cos(f), y, P0[1] + 2.75 * Math.sin(f)]); }
    for (let r = 0; r <= 2.75; r += 0.7) for (let k = 0; k < 24; k++) { const f = k * 15 * d2r; pts.push([P0[0] + r * Math.cos(f), -6.8, P0[1] + r * Math.sin(f)]); } return pts; };
  const smp = {}; for (const k of ['Jarzmo', 'Pileczka', 'Ciegno', 'Ramie', 'Orczyk', 'TulejkaC', 'TulejkaH']) { smp[k] = samples(M[k], 1.0); await y0(); }
  smp.Glowki = [...head(D.C0), ...head(D.H0)];
  const stat = { Tuleja: prep(M.Tuleja), SG90: prep(M.SG90), Pokrywa: prep(M.Pokrywa) };
  const res = {};
  for (const th of thetas) {
    const t = th * d2r, f = phi(t), C = Cf(t), H = Hf(f);
    const dl = Math.atan2(C[1] - H[1], C[0] - H[0]) - Math.atan2(D.C0[1] - D.H0[1], D.C0[0] - D.H0[0]);
    const link = (P) => rot(P, D.H0[0], D.H0[1], dl).map(([x, y, z]) => [x + H[0] - D.H0[0], y, z + H[1] - D.H0[1]]);
    const pos = { Jarzmo: rot(smp.Jarzmo, 0, D.zc, t), Pileczka: rot(smp.Pileczka, 0, D.zc, t), Ramie: rot(smp.Ramie, S[0], S[1], f), Orczyk: rot(smp.Orczyk, S[0], S[1], f),
      Ciegno: link(smp.Ciegno), TulejkaC: link(smp.TulejkaC), TulejkaH: link(smp.TulejkaH), Glowki: link(smp.Glowki) };
    const all = { ...stat, Jarzmo: prep(M.Jarzmo.map((tr) => rot(tr, 0, D.zc, t))), Ramie: prep(M.Ramie.map((tr) => rot(tr, S[0], S[1], f))), Ciegno: prep(M.Ciegno.map((tr) => link(tr))) };
    const pairs = pairsSel || [['Jarzmo', 'Tuleja'], ['Jarzmo', 'SG90'], ['Pileczka', 'Tuleja'], ['Ciegno', 'Tuleja'], ['Ciegno', 'SG90'], ['Ciegno', 'Jarzmo'], ['Ciegno', 'Ramie'],
      ['Ramie', 'Tuleja'], ['Ramie', 'SG90'], ['Ramie', 'Jarzmo'], ['Ramie', 'Pokrywa'], ['Orczyk', 'Tuleja'], ['Orczyk', 'Jarzmo'], ['TulejkaC', 'Jarzmo'], ['TulejkaC', 'Tuleja'],
      ['TulejkaH', 'Ramie'], ['TulejkaH', 'Tuleja'], ['TulejkaC', 'Ramie'], ['TulejkaH', 'Jarzmo'], ['Glowki', 'Tuleja'], ['Glowki', 'SG90'], ['Glowki', 'Jarzmo'], ['Glowki', 'Ramie'],
      ['Pileczka', 'Ciegno'], ['Pileczka', 'Ramie'], ['Jarzmo', 'Pokrywa']];
    for (const [p, q] of pairs) {
      let mn = 99, pen = 0; const B = all[q];
      for (const pt of pos[p]) { const d = dist(B, pt, 3); if (d < mn) mn = d; if (d > 0.03 && inside(B, pt)) pen++; }
      const k = p + '-' + q; if (!res[k]) res[k] = { min: 99, at: null, pen: 0 };
      if (mn < res[k].min) { res[k].min = mn; res[k].at = th; } res[k].pen += pen; await y0();
    }
  }
  return res;
};
return 'kolizje ok';
})();
