// Duże oko v2: kontrola kolizji na siatkach (STL z OpenSCAD w położeniu złożenia) w zakresie ruchu.
// Części drukowane: siatki; serwa, orczyki, druty, łby M2, tylna piasta kardana: bryły zastępcze (wymiary jak w duze-oko-v2.scad).
// Ruch: gałka θ (lewo–prawo) × φ (góra–dół), powieki ψ 0…51,5°, kąty serw z solvera (stała długość drutów).
// Wynik: najmniejszy odstęp każdej pary (mm, ≈ dokładność próbkowania 0,1–0,2) i położenie, w którym wystąpił; wnikanie = wartość ujemna.
// Użycie: node duze-oko-kolizje.js <katalog STL złożenia> [krok_stopni=5]
const fs = require('fs'), path = require('path');
const DIR = process.argv[2], KROK = +(process.argv[3] || 5);
const rad = (d) => d * Math.PI / 180;

// ---------- siatki ----------
function czytajSTL(f) { const b = fs.readFileSync(f); const t = b.slice(0, 5).toString();
  if (t === 'solid' && b.indexOf('facet') > 0 && b.indexOf('endsolid') > 0 && !/[\x00-\x08]/.test(b.slice(0, 200).toString())) {
    const v = [...b.toString().matchAll(/vertex\s+(\S+)\s+(\S+)\s+(\S+)/g)].map((m) => [+m[1], +m[2], +m[3]]); const T = [];
    for (let i = 0; i + 2 < v.length; i += 3) T.push([...v[i], ...v[i + 1], ...v[i + 2]]); return T; }
  const n = b.readUInt32LE(80), T = []; for (let i = 0; i < n; i++) { const t2 = []; for (let k = 0; k < 9; k++) t2.push(b.readFloatLE(84 + i * 50 + 12 + 4 * k)); T.push(t2); } return T; }
function pudlo(x0, x1, y0, y1, z0, z1) { const P = (i) => [i & 1 ? x1 : x0, i & 2 ? y1 : y0, i & 4 ? z1 : z0];
  const F = [[0, 2, 3, 1], [4, 5, 7, 6], [0, 1, 5, 4], [2, 6, 7, 3], [0, 4, 6, 2], [1, 3, 7, 5]], T = [];
  for (const f of F) { T.push([...P(f[0]), ...P(f[1]), ...P(f[2])]); T.push([...P(f[0]), ...P(f[2]), ...P(f[3])]); } return T; }
// walec wzdłuż osi o (0 = x, 1 = y, 2 = z), środek c (pozostałe dwie współrzędne), zakres a0..a1, promień r
function walec(o, c, a0, a1, r, n = 24) { const T = [], p = (a, k) => { const v = [0, 0, 0]; const [i, j] = [0, 1, 2].filter((q) => q !== o);
    v[o] = a; v[i] = c[0] + r * Math.cos(2 * Math.PI * k / n); v[j] = c[1] + r * Math.sin(2 * Math.PI * k / n); return v; };
  const s = (a) => { const v = [0, 0, 0]; const [i, j] = [0, 1, 2].filter((q) => q !== o); v[o] = a; v[i] = c[0]; v[j] = c[1]; return v; };
  for (let k = 0; k < n; k++) { const A = p(a0, k), B = p(a0, k + 1), C = p(a1, k + 1), D = p(a1, k);
    T.push([...A, ...B, ...C], [...A, ...C, ...D], [...s(a0), ...B, ...A], [...s(a1), ...D, ...C]); } return T; }
// odcinek grubości r (drut): walec między punktami a i b
function pret(a, b, r, n = 12) { const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(...d), u = d.map((x) => x / L);
  const t = Math.abs(u[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]; let e1 = [u[1] * t[2] - u[2] * t[1], u[2] * t[0] - u[0] * t[2], u[0] * t[1] - u[1] * t[0]];
  const l1 = Math.hypot(...e1); e1 = e1.map((x) => x / l1); const e2 = [u[1] * e1[2] - u[2] * e1[1], u[2] * e1[0] - u[0] * e1[2], u[0] * e1[1] - u[1] * e1[0]];
  const P = (q, k) => { const c = Math.cos(2 * Math.PI * k / n) * r, s = Math.sin(2 * Math.PI * k / n) * r; return [0, 1, 2].map((i) => q[i] + c * e1[i] + s * e2[i]); };
  const T = []; for (let k = 0; k < n; k++) { const A = P(a, k), B = P(a, k + 1), C = P(b, k + 1), D = P(b, k); T.push([...A, ...B, ...C], [...A, ...C, ...D]); } return T; }
const przeksztalc = (T, f) => T.map((t) => [...f(t.slice(0, 3)), ...f(t.slice(3, 6)), ...f(t.slice(6, 9))]);

// ---------- odległość punkt–trójkąt (Ericson) ----------
function dPT(p, t) { const a = [t[0], t[1], t[2]], b = [t[3], t[4], t[5]], c = [t[6], t[7], t[8]];
  const sub = (u, v) => [u[0] - v[0], u[1] - v[1], u[2] - v[2]], dot = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
  const ab = sub(b, a), ac = sub(c, a), ap = sub(p, a); const d1 = dot(ab, ap), d2 = dot(ac, ap); let q;
  if (d1 <= 0 && d2 <= 0) q = a; else { const bp = sub(p, b), d3 = dot(ab, bp), d4 = dot(ac, bp);
    if (d3 >= 0 && d4 <= d3) q = b; else { const vc = d1 * d4 - d3 * d2;
      if (vc <= 0 && d1 >= 0 && d3 <= 0) { const v = d1 / (d1 - d3); q = [a[0] + v * ab[0], a[1] + v * ab[1], a[2] + v * ab[2]]; }
      else { const cp = sub(p, c), d5 = dot(ab, cp), d6 = dot(ac, cp);
        if (d6 >= 0 && d5 <= d6) q = c; else { const vb = d5 * d2 - d1 * d6;
          if (vb <= 0 && d2 >= 0 && d6 <= 0) { const w = d2 / (d2 - d6); q = [a[0] + w * ac[0], a[1] + w * ac[1], a[2] + w * ac[2]]; }
          else { const va = d3 * d6 - d5 * d4;
            if (va <= 0 && d4 - d3 >= 0 && d5 - d6 >= 0) { const w = (d4 - d3) / ((d4 - d3) + (d5 - d6)); q = [b[0] + w * (c[0] - b[0]), b[1] + w * (c[1] - b[1]), b[2] + w * (c[2] - b[2])]; }
            else { const den = 1 / (va + vb + vc), v = vb * den, w = vc * den; q = [a[0] + ab[0] * v + ac[0] * w, a[1] + ab[1] * v + ac[1] * w, a[2] + ab[2] * v + ac[2] * w]; } } } } } }
  return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); }
// siatka statyczna: kubełki 3D (odległość) + kubełki yz (promień wzdłuż +x, parzystość = wnętrze)
const CELL = 2, ZASIEG = 3;
function indeks(T) { const g = new Map(), gyz = new Map();
  T.forEach((t, i) => { const lo = [0, 1, 2].map((k) => Math.floor(Math.min(t[k], t[k + 3], t[k + 6]) / CELL)), hi = [0, 1, 2].map((k) => Math.floor(Math.max(t[k], t[k + 3], t[k + 6]) / CELL));
    for (let x = lo[0]; x <= hi[0]; x++) for (let y = lo[1]; y <= hi[1]; y++) for (let z = lo[2]; z <= hi[2]; z++) { const k = x + ',' + y + ',' + z; if (!g.has(k)) g.set(k, []); g.get(k).push(i); }
    for (let y = lo[1]; y <= hi[1]; y++) for (let z = lo[2]; z <= hi[2]; z++) { const k = y + ',' + z; if (!gyz.has(k)) gyz.set(k, []); gyz.get(k).push(i); } });
  return { T, g, gyz }; }
function wewnatrz(I, p) { const l = I.gyz.get(Math.floor(p[1] / CELL) + ',' + Math.floor(p[2] / CELL)); if (!l) return false; let n = 0;
  for (const i of l) { const t = I.T[i]; // przecięcie promienia (p, +x) z trójkątem w rzucie yz
    const [y, z] = [p[1] + 1e-7, p[2] + 1.3e-7]; const A = [t[1], t[2]], B = [t[4], t[5]], C = [t[7], t[8]];
    const s = (P, Q) => (Q[0] - P[0]) * (z - P[1]) - (Q[1] - P[1]) * (y - P[0]); const s1 = s(A, B), s2 = s(B, C), s3 = s(C, A);
    if ((s1 > 0 && s2 > 0 && s3 > 0) || (s1 < 0 && s2 < 0 && s3 < 0)) { const den = (B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1]);
      const u = ((y - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (z - A[1])) / den, v = ((B[0] - A[0]) * (z - A[1]) - (y - A[0]) * (B[1] - A[1])) / den;
      const x = t[0] + u * (t[3] - t[0]) + v * (t[6] - t[0]); if (x > p[0]) n++; } }
  return n % 2 === 1; }
function odl(I, p) { const c = p.map((v) => Math.floor(v / CELL)); let m = ZASIEG; const seen = new Set(); const R = Math.ceil(ZASIEG / CELL);
  for (let x = -R; x <= R; x++) for (let y = -R; y <= R; y++) for (let z = -R; z <= R; z++) { const l = I.g.get((c[0] + x) + ',' + (c[1] + y) + ',' + (c[2] + z)); if (!l) continue;
    for (const i of l) { if (seen.has(i)) continue; seen.add(i); const d = dPT(p, I.T[i]); if (d < m) m = d; } }
  return m; }
// próbki powierzchni: wierzchołki + środki trójkątów + punkty na krawędziach co ≤ 1 mm
function probki(T) { const P = []; for (const t of T) { const a = t.slice(0, 3), b = t.slice(3, 6), c = t.slice(6, 9); P.push(a, [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3, (a[2] + b[2] + c[2]) / 3]);
    for (const [u, v] of [[a, b], [b, c], [c, a]]) { const L = Math.hypot(u[0] - v[0], u[1] - v[1], u[2] - v[2]), n = Math.floor(L / 1.5); for (let k = 1; k < n; k++) P.push([0, 1, 2].map((i) => u[i] + (v[i] - u[i]) * k / n)); } }
  const u = new Map(); for (const p of P) u.set(p.map((c) => Math.round(c * 20)).join(), p); return [...u.values()]; }
// odstęp siatki A (punkty) od siatki B (indeks): min odległości; punkt A wewnątrz B → ujemny (−odległość do powierzchni)
let OSTATNI = null;
function odstep(PA, IB, IA, PB) { let m = ZASIEG; OSTATNI = null;
  for (const p of PA) { let d = odl(IB, p); if (wewnatrz(IB, p)) d = -d; if (d < m) { m = d; OSTATNI = p; } }
  if (PB) for (const p of PB) { let d = odl(IA, p); if (wewnatrz(IA, p)) d = -d; if (d < m) m = d; }
  return m; }

// ---------- kinematyka (te same parametry co duze-oko-kinematyka.js, wartości końcowe) ----------
// parametry z SCAD: <DIR>/parametry.json (eksport.sh: openscad -D 'czesc="parametry"', echo PARAMETRY{...})
const PAR = JSON.parse(fs.readFileSync(path.join(DIR, 'parametry.json'), 'utf8'));
const K = { lug1: PAR.lug1, lug2: PAR.lug2, s1: PAR.s1, s2: PAR.s2, s3: PAR.s3, lev: PAR.lev };
// korpus drutu biegnie przy ściance (zagięcie Z): górny na zewnątrz dźwigni (x −34,3), dolny od strony gałki (x −33,5); S1 przy ściance żebra od strony −y, S2 od strony +x
const KORP = { xu: PAR.korp.xu, xl: PAR.korp.xl, s1: [0, 0, 0], s2: [0, 0, 0] };   // S1/S2: drut od środka otworu; pierwsze 3 mm (przejście przez blaszkę ucha z klepsydrą) sprawdza próbka
const Rx = (p, a) => { const c = Math.cos(rad(a)), s = Math.sin(rad(a)); return [p[0], p[1] * c + p[2] * s, -p[1] * s + p[2] * c]; };
const Ry = (p, a) => { const c = Math.cos(rad(a)), s = Math.sin(rad(a)); return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c]; };
const gal = (p, th, ph) => Rx(Ry(p, th), ph);
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const Hx = (s, a) => [s.xh, s.ys + s.r * Math.cos(rad(a)), s.zs + s.r * Math.sin(rad(a))];
const Hy = (s, a) => [s.xs + s.r * Math.cos(rad(a)), s.yh, s.zs + s.r * Math.sin(rad(a))];
const zero = (f, lo, hi) => { let a = lo, b = hi, fa = f(a); if (fa * f(b) > 0) return null; for (let i = 0; i < 50; i++) { const m = (a + b) / 2, fm = f(m); if (fa * fm <= 0) b = m; else { a = m; fa = fm; } } return (a + b) / 2; };
const L1 = dist(Hx(K.s1, K.s1.a0), K.lug1), L2 = dist(Hx(K.s2, K.s2.a0), K.lug2);
// kąt serwa: zero najbliższe a0 (przeszukanie ±100° od a0, pierwsze przejście od a0 w obie strony)
function alfa(s, L, pkt) { const f = (a) => dist(Hx(s, a), pkt) - L; for (let d = 0; d < 100; d += 1) for (const [p, q] of [[s.a0 + d, s.a0 + d + 1], [s.a0 - d - 1, s.a0 - d]]) { const r = zero(f, p, q); if (r !== null) return r; } return null; }
const mid = K.lev.skok / 2;
const U = (psi) => { const d = psi - mid; return [K.lev.xu, K.lev.r * Math.cos(rad(d)), -K.lev.r * Math.sin(rad(d))]; };
const D = (psi) => { const d = psi - mid; return [K.lev.xl, -K.lev.r * Math.cos(rad(d)), -K.lev.r * Math.sin(rad(d))]; };
const Lu = dist(Hy(K.s3, 0), U(mid));
const Uk = (psi) => { const q = U(psi); q[0] = KORP.xu; return q; }, Dk = (psi) => { const q = D(psi); q[0] = KORP.xl; return q; };
function alfa3(psi) { const f = (a) => dist(Hy(K.s3, a), U(psi)) - Lu; return zero(f, -60, 60); }
const Ld = dist(Hy(K.s3, 0), D(mid));
// kąt dolnej powieki dla kąta S3 (solver; różni się od górnej o ≤ 0,25°)
function psiDolna(a3, przybl) { const f = (q) => dist(Hy(K.s3, a3), D(q)) - Ld; return zero(f, przybl - 5, przybl + 5); }

// ---------- bryły ----------
const st = (n) => czytajSTL(path.join(DIR, n + '.stl'));
const M = { galka: st('Galka'), pg: st('PowiekaGorna'), pd: st('PowiekaDolna'), pier: st('Pierscien'), uch: st('UchwytSerw') };
const SV = PAR.sv, zSP = SV.zP, zST = SV.zT, hw = SV.Wsv / 2, rW = 6;
// serwo z wałkiem ∥ x w stronę −x: czubek na xh + odstOrcz, korpus dalej w +x; ucha na uchoOd…uchoOd + uchoT od czubka
const serwoX = (s) => { const t = s.xh + SV.odstOrcz; return [...pudlo(t + SV.wiezaH, t + SV.wiezaH + SV.Hsv, s.ys - hw, s.ys + hw, zST, zSP),
  ...pudlo(t + SV.uchoOd, t + SV.uchoOd + SV.uchoT, s.ys - hw, s.ys + hw, zST - SV.uchoWyst, zSP + SV.uchoWyst), ...walec(0, [s.ys, s.zs], t, t + SV.wiezaH, rW)]; };
// serwo S3 z wałkiem ∥ y w górę: czubek na yh − odstOrcz, korpus w −y
const serwoY = (s) => { const t = s.yh - SV.odstOrcz; return [...pudlo(s.xs - hw, s.xs + hw, t - SV.wiezaH - SV.Hsv, t - SV.wiezaH, zST, zSP),
  ...pudlo(s.xs - hw, s.xs + hw, t - SV.uchoOd - SV.uchoT, t - SV.uchoOd, zST - SV.uchoWyst, zSP + SV.uchoWyst), ...walec(1, [s.xs, s.zs], t - SV.wiezaH, t, rW)]; };
const serwa = { S1: serwoX(K.s1), S2: serwoX(K.s2), S3: serwoY(K.s3) };
const stale = { pierscien: M.pier, uchwyt: M.uch, ...serwa,
  lebM2: [...walec(0, [0, 0], PAR.xLeb, PAR.xLeb + PAR.hLebM2, PAR.dLebM2 / 2), ...walec(0, [0, 0], -PAR.xLeb - PAR.hLebM2, -PAR.xLeb, PAR.dLebM2 / 2)],
  piastaTyl: walec(2, [0, 0], -PAR.zPiasta, -2, PAR.dKardan / 2) };
// orczyk: ramię szer. 5, grub. 2 od osi do otworu + 2,5, piasta Ø7
function orczykX(s, a, x0, x1) { const h = Hx(s, a), c = [s.xh, s.ys, s.zs]; const e = [h[0], c[1] + (h[1] - c[1]) * (s.r + 2.5) / s.r, c[2] + (h[2] - c[2]) * (s.r + 2.5) / s.r];
  return [...pret([x0 + 1, c[1], c[2]], [x0 + 1, e[1], e[2]], 2.5, 8), ...walec(0, [c[1], c[2]], x0, x1, 3.5)]; }
function orczykY(s, a) { const h = Hy(s, a), c = [s.xs, s.yh, s.zs]; const e = [c[0] + (h[0] - c[0]) * (s.r + 2.5) / s.r, h[1], c[2] + (h[2] - c[2]) * (s.r + 2.5) / s.r];
  return [...pret([c[0], s.yh, c[2]], [e[0], s.yh, e[2]], 2.5, 8), ...walec(1, [c[0], c[2]], s.yh - 1.5, s.yh + 1.5, 3.5)]; }
const skroc = (a, b, m) => { const L = dist(a, b), u = [0, 1, 2].map((i) => (b[i] - a[i]) / L); return [a.map((v, i) => v + u[i] * m), b.map((v, i) => v - u[i] * m)]; };

// ---------- przebieg ----------
const I = {}; for (const [k, T] of Object.entries(stale)) I[k] = indeks(T);
const wyniki = new Map(); const zapisz = (para, d, poz) => { const w = wyniki.get(para); if (!w || d < w.d) wyniki.set(para, { d: Math.round(d * 100) / 100, poz: poz + (d < 0.3 && OSTATNI ? ' @ ' + OSTATNI.map((v) => v.toFixed(1)).join(',') : '') }); };
// próbki gałki: tylko tył (z < 2) i strefa osi powiek (|x| > 22) – przód skorupy (R 30) jest poza zasięgiem części stałych (R ≥ 30,5)
const P0 = { galka: probki(M.galka).filter((p) => p[2] < 2 || Math.abs(p[0]) > PAR.Rg - 8), pg: probki(M.pg), pd: probki(M.pd) };
const Ig0 = indeks(M.galka); const galOdwr = (p, th, ph) => Ry(Rx(p, -ph), -th);   // świat → układ gałki
const Ipg0 = indeks(M.pg), Ipd0 = indeks(M.pd);
const kroki = (a, b, k) => { const r = []; for (let v = a; v <= b + 1e-9; v += k) r.push(+v.toFixed(3)); if (r[r.length - 1] !== b) r.push(b); return r; };
const TH = kroki(-35, 35, KROK), PH = kroki(-25, 25, KROK), PS = kroki(0, 51.5, 51.5 / 6);
const t0 = Date.now();
// 1) powieki (ψ) wobec części stałych i siebie nawzajem; drut i orczyk S3
for (const ps of PS) {
  const a3 = alfa3(ps), pd_ = psiDolna(a3, ps);
  const pg = przeksztalc(M.pg, (p) => Rx(p, ps)), pd = przeksztalc(M.pd, (p) => Rx(p, -pd_));
  const Pg = P0.pg.map((p) => Rx(p, ps)), Pd = P0.pd.map((p) => Rx(p, -pd_));
  for (const k of ['pierscien', 'uchwyt', 'lebM2', 'piastaTyl', 'S3']) { zapisz('powieka górna – ' + k, odstep(Pg, I[k]), 'ψ ' + ps.toFixed(1)); zapisz('powieka dolna – ' + k, odstep(Pd, I[k]), 'ψ ' + ps.toFixed(1)); }
  const Ipd = indeks(pd); zapisz('powieka górna – powieka dolna', odstep(Pg, Ipd), 'ψ ' + ps.toFixed(1));
  const H3 = Hy(K.s3, a3); const [du1, du2] = skroc(Uk(ps), H3, 1), [dd1, dd2] = skroc(Dk(pd_), H3, 1);
  const druty = [...pret(du1, du2, 0.5), ...pret(dd1, dd2, 0.5)], Pdr = probki(druty), orc = orczykY(K.s3, a3), Por = probki(orc);
  const Pu = probki(pret(du1, du2, 0.5)), Pd4 = probki(pret(...skroc(Dk(pd_), H3, 4), 0.5)), Pu4 = probki(pret(...skroc(Uk(ps), H3, 4), 0.5)), Pdd = probki(pret(dd1, dd2, 0.5));
  for (const k of ['pierscien', 'uchwyt', 'S1', 'S2', 'S3']) zapisz('druty powiek – ' + k, odstep(Pdr, I[k]), 'ψ ' + ps.toFixed(1));
  const Ipg = indeks(pg);
  zapisz('drut powieki górnej – powieka dolna', odstep(Pu, Ipd), 'ψ ' + ps.toFixed(1)); zapisz('drut powieki dolnej – powieka górna', odstep(Pdd, Ipg), 'ψ ' + ps.toFixed(1));
  zapisz('drut powieki górnej – własna powieka (bez 4 mm przy dźwigni)', odstep(Pu4, Ipg), 'ψ ' + ps.toFixed(1)); zapisz('drut powieki dolnej – własna powieka (bez 4 mm przy dźwigni)', odstep(Pd4, Ipd), 'ψ ' + ps.toFixed(1));
  zapisz('drut powieki górnej – drut powieki dolnej (bez 4 mm przy orczyku)', odstep(probki(pret(Uk(ps), skroc(Uk(ps), H3, 4)[1], 0.5)), indeks(pret(Dk(pd_), skroc(Dk(pd_), H3, 4)[1], 0.5))), 'ψ ' + ps.toFixed(1));
  for (const k of ['pierscien', 'uchwyt', 'S1', 'S2']) zapisz('orczyk S3 – ' + k, odstep(Por, I[k]), 'ψ ' + ps.toFixed(1));
  wyniki.set('_S3', { alfa: [...(wyniki.get('_S3') || { alfa: [] }).alfa, Math.round(a3 * 10) / 10] });
}
// 2) gałka (θ, φ): wobec stałych, powiek (zamknięte i otwarte), druty S1/S2, orczyki S1/S2
const alfy = [];
const Igz = indeks(przeksztalc(M.pg, (p) => p)), Igo = indeks(przeksztalc(M.pg, (p) => Rx(p, 51.5))), Idz = Ipd0, Ido = indeks(przeksztalc(M.pd, (p) => Rx(p, -51.5)));
for (const th of TH) for (const ph of PH) {
  const poz = `θ ${th}, φ ${ph}`; process.stderr.write(`[${((Date.now() - t0) / 1000).toFixed(0)} s] ${poz}
`); const g = (p) => gal(p, th, ph); const Pg = P0.galka.map(g);
  for (const k of ['pierscien', 'uchwyt', 'lebM2', 'piastaTyl']) zapisz('gałka – ' + k, odstep(Pg, I[k]), poz);
  zapisz('gałka – powieka górna (zamkn.)', odstep(Pg, Igz), poz); zapisz('gałka – powieka górna (otw.)', odstep(Pg, Igo), poz);
  zapisz('gałka – powieka dolna (zamkn.)', odstep(Pg, Idz), poz); zapisz('gałka – powieka dolna (otw.)', odstep(Pg, Ido), poz);
  const l1 = g(K.lug1), l2 = g(K.lug2), a1 = alfa(K.s1, L1, l1), a2 = alfa(K.s2, L2, l2); alfy.push([th, ph, a1 && +a1.toFixed(1), a2 && +a2.toFixed(1)]);
  if (a1 === null || a2 === null) { zapisz('NIEOSIĄGALNE', -99, poz); continue; }
  const add = (a, b) => a.map((v, i) => v + b[i]); const l1k = add(l1, g(KORP.s1)), l2k = add(l2, g(KORP.s2));
  const [p1, q1] = skroc(l1k, Hx(K.s1, a1), 1), [p2, q2] = skroc(l2k, Hx(K.s2, a2), 1);
  const d1 = pret(p1, q1, 0.5), d2 = pret(p2, q2, 0.5), P1 = probki(d1), P2 = probki(d2);
  for (const [nm, Pd] of [['drut S1', P1], ['drut S2', P2]]) {
    for (const k of ['pierscien', 'uchwyt', 'S1', 'S2', 'S3', 'piastaTyl']) zapisz(nm + ' – ' + k, odstep(Pd, I[k]), poz);
    zapisz(nm + ' – powieka górna (otw.)', odstep(Pd, Igo), poz); zapisz(nm + ' – powieka górna (zamkn.)', odstep(Pd, Igz), poz);
    zapisz(nm + ' – powieka dolna (otw.)', odstep(Pd, Ido), poz);
  }
  // drut z gałką: bez 4 mm przy uchu (tam przechodzi przez żebro)
  const [p1b] = skroc(l1k, Hx(K.s1, a1), 3), [p2b] = skroc(l2k, Hx(K.s2, a2), 3);
  const doG = (P) => P.map((p) => galOdwr(p, th, ph));
  zapisz('drut S1 – gałka', odstep(doG(probki(pret(p1b, q1, 0.5))), Ig0), poz); zapisz('drut S2 – gałka', odstep(doG(probki(pret(p2b, q2, 0.5))), Ig0), poz);
  zapisz('drut S1 – drut S2', odstep(P1, indeks(d2)), poz);
  const go = SV.grubOrcz, o1 = orczykX(K.s1, a1, K.s1.xh - go / 2, K.s1.xh + go / 2 + 2), o2 = orczykX(K.s2, a2, K.s2.xh - go / 2, K.s2.xh + go / 2 + 2), Po1 = probki(o1), Po2 = probki(o2);
  for (const k of ['pierscien', 'uchwyt', 'S2', 'S3']) zapisz('orczyk S1 – ' + k, odstep(Po1, I[k]), poz);
  for (const k of ['pierscien', 'uchwyt', 'S1', 'S3']) zapisz('orczyk S2 – ' + k, odstep(Po2, I[k]), poz);
  zapisz('orczyk S1 – orczyk S2', odstep(Po1, indeks(o2)), poz); zapisz('orczyk S1 – drut S2', odstep(Po1, indeks(d2)), poz); zapisz('orczyk S2 – drut S1', odstep(Po2, indeks(d1)), poz);
  zapisz('orczyk S1 – gałka', odstep(doG(Po1), Ig0), poz); zapisz('orczyk S2 – gałka', odstep(doG(Po2), Ig0), poz);
}
// 2b) zagęszczenie: druty S1/S2 wobec gałki co 1° w otoczeniu ±5° najgorszej pozycji siatki
for (const [nm, lug, s_, L, off] of [['drut S1 – gałka', K.lug1, K.s1, L1, KORP.s1], ['drut S2 – gałka', K.lug2, K.s2, L2, KORP.s2]]) {
  const w = wyniki.get(nm); if (!w) continue; const m = w.poz.match(/θ (-?[\d.]+), φ (-?[\d.]+)/); if (!m) continue;
  for (let th = Math.max(-35, +m[1] - 5); th <= Math.min(35, +m[1] + 5); th += 1) for (let ph = Math.max(-25, +m[2] - 5); ph <= Math.min(25, +m[2] + 5); ph += 1) {
    const g = (p) => gal(p, th, ph), lw = g(lug), a = alfa(s_, L, lw); if (a === null) { zapisz('NIEOSIĄGALNE', -99, th + ',' + ph); continue; }
    const st = lw.map((v, i) => v + g(off)[i]); const [p0] = skroc(st, Hx(s_, a), 3), q0 = skroc(st, Hx(s_, a), 1)[1];
    zapisz(nm, odstep(probki(pret(p0, q0, 0.5)).map((p) => galOdwr(p, th, ph)), Ig0), 'θ ' + th + ', φ ' + ph + ' (zagęszczenie)'); } }
// 3) pary stałe
for (const [a, b] of [['pierscien', 'uchwyt'], ['S1', 'uchwyt'], ['S2', 'uchwyt'], ['S3', 'uchwyt'], ['S1', 'pierscien'], ['S2', 'pierscien'], ['S3', 'pierscien'], ['S1', 'S2'], ['S2', 'S3'], ['lebM2', 'pierscien']])
  zapisz(a + ' – ' + b + ' (stałe)', odstep(probki(stale[a]), I[b], I[a], probki(stale[b])), '–');
const lista = [...wyniki.entries()].filter(([k]) => !k.startsWith('_')).sort((x, y) => x[1].d - y[1].d);
console.log(`kontrola kolizji: krok ${KROK}°, θ ${TH.length} × φ ${PH.length} pozycji gałki, ψ ${PS.length} pozycji powiek, ${((Date.now() - t0) / 1000).toFixed(0)} s`);
console.log(`S1 α ${Math.min(...alfy.map((a) => a[2]))}…${Math.max(...alfy.map((a) => a[2]))}°, S2 α ${Math.min(...alfy.map((a) => a[3]))}…${Math.max(...alfy.map((a) => a[3]))}°, S3 α ${JSON.stringify(wyniki.get('_S3').alfa)}`);
console.log('para | najmniejszy odstęp [mm] (≥ 3 = „> 3”) | położenie');
for (const [k, w] of lista) console.log(`${k} | ${w.d >= ZASIEG ? '> 3' : w.d.toFixed(2)} | ${w.poz}`);
