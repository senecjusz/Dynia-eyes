// Duże oko v2, druty gięte ręcznie (koncepcja v2): kolizje pełnych drutów – Z z luzem osiowym na obu końcach, V na drutach powiek, noga L z koszulką przy dźwigni górnej.
// Części i kinematyka jak duze-oko-kolizje.js (ten sam kod do znacznika „przebieg”). Wariant drutu: środek Z (srodekZ ± tolZ), położenie nogi w luzie (oba skraje), ogon Z (+ / − wzdłuż korpusu), V (kierunek, kąt 30/60°).
// Użycie: node duze-oko-druty-v2-kolizje.js <katalog STL złożenia> [krok_stopni=10]
const fs = require('fs'), path = require('path');
const DIR = process.argv[2], KROK = +(process.argv[3] || 10);
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
const mid = K.lev.skok / 2, SKOK = K.lev.skok, RD = PAR.dDrut / 2;
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
const SV = PAR.sv, zSP = SV.zP, zST = SV.zT, hw = SV.Wsv / 2, rW = SV.rWiezy;
// serwo z wałkiem ∥ x w stronę −x: czubek na xh + odstOrcz, korpus dalej w +x; ucha na uchoOd…uchoOd + uchoT od czubka
const serwoX = (s) => { const t = s.xh + SV.odstOrcz; return [...pudlo(t + SV.wiezaH, t + SV.wiezaH + SV.Hsv, s.ys - hw, s.ys + hw, zST, zSP),
  ...pudlo(t + SV.uchoOd, t + SV.uchoOd + SV.uchoT, s.ys - hw, s.ys + hw, zST - SV.uchoWyst, zSP + SV.uchoWyst), ...walec(0, [s.ys, s.zs], t, t + SV.wiezaH, rW)]; };
// serwo S3 z wałkiem ∥ y w górę: czubek na yh − odstOrcz, korpus w −y
const serwoY = (s) => { const t = s.yh - SV.odstOrcz; return [...pudlo(s.xs - hw, s.xs + hw, t - SV.wiezaH - SV.Hsv, t - SV.wiezaH, zST, zSP),
  ...pudlo(s.xs - hw, s.xs + hw, t - SV.uchoOd - SV.uchoT, t - SV.uchoOd, zST - SV.uchoWyst, zSP + SV.uchoWyst), ...walec(1, [s.xs, s.zs], t - SV.wiezaH, t, rW)]; };
const serwa = { S1: serwoX(K.s1), S2: serwoX(K.s2), S3: serwoY(K.s3) };
const stale = { pierscien: M.pier, uchwyt: M.uch, ...serwa,
  lebM2: [...walec(0, [0, 0], PAR.xLeb, PAR.xLeb + PAR.hLebM2, PAR.dLebM2 / 2), ...walec(0, [0, 0], -PAR.xLeb - PAR.hLebM2, -PAR.xLeb, PAR.dLebM2 / 2)],
  piastaTyl: walec(2, [0, 0], -PAR.zPiasta, -PAR.dlWidelek, PAR.dKardan / 2) };
// orczyk: ramię szer. 5, grub. 2 od osi do otworu + 2,5, piasta Ø7
function orczykX(s, a, x0, x1) { const h = Hx(s, a), c = [s.xh, s.ys, s.zs]; const e = [h[0], c[1] + (h[1] - c[1]) * SV.dlOrcz / s.r, c[2] + (h[2] - c[2]) * SV.dlOrcz / s.r];
  return [...pret([x0 + SV.grubOrcz / 2, c[1], c[2]], [x0 + SV.grubOrcz / 2, e[1], e[2]], SV.szerOrcz / 2, 8), ...walec(0, [c[1], c[2]], x0, x1, SV.rPiastyOrcz)]; }
function orczykY(s, a) { const h = Hy(s, a), c = [s.xs, s.yh, s.zs]; const e = [c[0] + (h[0] - c[0]) * SV.dlOrcz / s.r, h[1], c[2] + (h[2] - c[2]) * SV.dlOrcz / s.r];
  return [...pret([c[0], s.yh, c[2]], [e[0], s.yh, e[2]], SV.szerOrcz / 2, 8), ...walec(1, [c[0], c[2]], s.yh - SV.grubOrcz, s.yh + SV.grubOrcz, SV.rPiastyOrcz)]; }
const skroc = (a, b, m) => { const L = dist(a, b), u = [0, 1, 2].map((i) => (b[i] - a[i]) / L); return [a.map((v, i) => v + u[i] * m), b.map((v, i) => v - u[i] * m)]; };

// ---------- druty v2: geometria ----------
const DR = PAR.druty, ZM = [DR.srodekZ - DR.tolZ, DR.srodekZ + DR.tolZ];
const add = (a, b) => a.map((x, i) => x + b[i]), sub = (a, b) => a.map((x, i) => x - b[i]), mul = (a, k) => a.map((x) => x * k);
const unit = (a) => { const l = Math.hypot(...a); return a.map((x) => x / l); }, dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
// koniec Z: E środek otworu, a oś otworu, sg strona korpusu (+1: korpus po +a), t grubość płytki, m środek Z (między osiami zagięć),
// poz 0/1: skraj luzu osiowego (0: naroże korpusu przy płytce, 1: naroże ogona przy płytce), b kierunek korpusu ku temu końcowi; ogon wzdłuż +b
function koniecZ90(E, a, sg, t, m, poz, b) { let n = sub(a, mul(b, dot(a, b))); n = unit(n); const tilt = Math.acos(Math.min(1, dot(n, a))) * 180 / Math.PI;
  const z = koniecZ(E, n, sg, t, m, poz, b); z.tilt = tilt; return z; }
function koniecZ(E, a, sg, t, m, poz, b) { const d1 = poz ? m - t / 2 - RD : t / 2 + RD;
  const C1 = add(E, mul(a, sg * d1)), C2 = add(E, mul(a, -sg * (m - d1))); return { C1, C2, T: add(C2, mul(b, DR.ogonZ)) }; }
// korpus A→B z V w punkcie o współrzędnej z = zV, wierzchołek w kierunku n0 (rzut ⟂ korpusu), ramiona ramieV pod kątem kat do korpusu
function korpusV(A, B, zV, n0, kat) { const u = unit(sub(B, A)), f = Math.min(0.85, Math.max(0.15, (zV - A[2]) / (B[2] - A[2]))), c = add(A, mul(sub(B, A), f));
  const n = unit(sub(n0, mul(u, dot(n0, u)))), s = DR.ramieV * Math.cos(rad(kat)), h = DR.ramieV * Math.sin(rad(kat));
  const p = sub(c, mul(u, s)), q = add(c, mul(u, s)), w = add(c, mul(n, h)); return [[A, p], [p, w], [w, q], [q, B]]; }
const odc = (S, r = RD) => S.flatMap(([a, b]) => pret(a, b, r));
const pr = (S, r) => probki(odc(S, r));
// obcięcie pierwszych m mm odcinka od strony a (wyłączenie styku przy własnym otworze)
const obetnij = ([a, b], m) => { const L = dist(a, b); if (L <= m + 0.1) return null; const u = unit(sub(b, a)); return [add(a, mul(u, m)), b]; };
const sfera = (P, R) => Math.min(...P.map((p) => Math.hypot(...p) - R));   // odstęp punktów (powierzchni drutu) od sfery R, od zewnątrz

// ---------- przebieg ----------
const I = {}; for (const [k, T] of Object.entries(stale)) I[k] = indeks(T);
const wyniki = new Map(); const zapisz = (para, d, poz) => { const w = wyniki.get(para); if (!w || d < w.d) wyniki.set(para, { d: Math.round(d * 100) / 100, poz: poz + (d < 0.3 && OSTATNI ? ' @ ' + OSTATNI.map((v) => v.toFixed(1)).join(',') : '') }); };
const kroki = (a, b, k) => { const r = []; for (let v = a; v <= b + 1e-9; v += k) r.push(+v.toFixed(3)); if (r[r.length - 1] !== b) r.push(b); return r; };
const sym = (m, k) => [...new Set([-m, ...kroki(0, m, k).map((v) => -v).reverse(), ...kroki(0, m, k), m])].sort((a, b) => a - b);
const TH = sym(35, KROK), PH = sym(25, KROK), PS = kroki(0, SKOK, SKOK / 6);
const t0 = Date.now(); const Ig0 = indeks(M.galka); const galOdwr = (p, th, ph) => Ry(Rx(p, -ph), -th);
const xL = [1, 0, 0], yA = [0, 1, 0], zV = -33;
// orczyk płaski: ramię = 3 pręty o promieniu grubOrcz/2 obok siebie (szerokość ≈ szerOrcz), piasta jak w duze-oko-kolizje.js
function ramiePlaskie(c, e, nOs) { const u = unit(sub(e, c)), w = unit([u[1] * nOs[2] - u[2] * nOs[1], u[2] * nOs[0] - u[0] * nOs[2], u[0] * nOs[1] - u[1] * nOs[0]]);
  const hw = SV.szerOrcz / 2, ht = SV.grubOrcz / 2, V = (i) => add(add(i & 1 ? e : c, mul(w, i & 2 ? hw : -hw)), mul(nOs, i & 4 ? ht : -ht));
  const F = [[0, 2, 3, 1], [4, 5, 7, 6], [0, 1, 5, 4], [2, 6, 7, 3], [0, 4, 6, 2], [1, 3, 7, 5]], T = [];
  for (const f of F) { T.push([...V(f[0]), ...V(f[1]), ...V(f[2])]); T.push([...V(f[0]), ...V(f[2]), ...V(f[3])]); } return T; }
function orczykXp(s, a, x0, x1) { const h = Hx(s, a), c = [s.xh, s.ys, s.zs]; const e = [h[0], c[1] + (h[1] - c[1]) * SV.dlOrcz / s.r, c[2] + (h[2] - c[2]) * SV.dlOrcz / s.r];
  return [...ramiePlaskie([s.xh, c[1], c[2]], [s.xh, e[1], e[2]], xL), ...walec(0, [c[1], c[2]], x0, x1, SV.rPiastyOrcz)]; }
function orczykYp(s, a) { const h = Hy(s, a), c = [s.xs, s.yh, s.zs]; const e = [c[0] + (h[0] - c[0]) * SV.dlOrcz / s.r, h[1], c[2] + (h[2] - c[2]) * SV.dlOrcz / s.r];
  return [...ramiePlaskie([c[0], s.yh, c[2]], [e[0], s.yh, e[2]], yA), ...walec(1, [c[0], c[2]], s.yh - SV.grubOrcz, s.yh + SV.grubOrcz, SV.rPiastyOrcz)]; }
const LUZK = +(process.env.LUZK || 0.3), OFS = 0.6;   // OFS: druty PG/PD obok siebie w otworze Ø2,4 orczyka S3   // luz koszulki od dźwigni (dosunięta ręką)
const OPCJE_V = { y: { pg: [0, 1, 0], pd: [0, -1, 0] }, mx: { pg: [-1, 0, 0], pd: [-1, 0, 0] } };
// 1) druty powiek
for (const ps of PS) {
  const a3 = alfa3(ps), pd_ = psiDolna(a3, ps), H3 = Hy(K.s3, a3), pp = 'ψ ' + ps.toFixed(1);
  const pg = przeksztalc(M.pg, (p) => Rx(p, ps)), pd = przeksztalc(M.pd, (p) => Rx(p, -pd_)), Ipg = indeks(pg), Ipd = indeks(pd);
  const Iorc = indeks(orczykYp(K.s3, a3));
  const Eu = U(ps), Ed = D(pd_);
  for (const m of ZM) for (const pozH of [0, 1]) for (const luzG of [0, LUZK]) for (const luzD of [0, LUZK]) for (const [ov, OV] of Object.entries(OPCJE_V)) for (const kat of [30, 60]) for (const ogPG of [1, -1]) {
    const war = `${pp}, Z ${m}, luz orcz ${pozH}, luz koszulki PG ${luzG} PD ${luzD}, V ${ov} ${kat}°, ogon PG ${ogPG > 0 ? 'w dół' : 'w górę'}`;
    // PG: noga L z koszulką przy dźwigni (korpus po −x), Z przy orczyku (korpus po +y)
    const C1u = [-(DR.xUchoG + DR.tUcho) - RD - luzG, Eu[1], Eu[2]], tip = [-DR.xUchoG + DR.lKoszulki - luzG, Eu[1], Eu[2]];
    const kosz = [[[-DR.xUchoG - luzG, Eu[1], Eu[2]], tip]];
    const H3u = add(H3, [-OFS, 0, 0]), H3d = add(H3, [OFS, 0, 0]);
    const zu = koniecZ(H3u, yA, +1, DR.grubOrcz, m, pozH, mul(unit(sub(H3, Eu)), ogPG));
    const Ku = korpusV(C1u, zu.C1, zV, OV.pg, kat);
    // PD: noga L z koszulką przy dźwigni (korpus po −x, jak PG), Z przy orczyku (korpus po +y, jak PG; noga −y)
    const C1d = [-(DR.xUchoD + DR.tUcho) - RD - luzD, Ed[1], Ed[2]], tipD = [-DR.xUchoD + DR.lKoszulki - luzD, Ed[1], Ed[2]];
    const koszD = [[[-DR.xUchoD - luzD, Ed[1], Ed[2]], tipD]];
    const zdH = koniecZ(H3d, yA, -1, DR.grubOrcz, m, pozH, unit(sub(H3, Ed)));
    const Kd = korpusV(C1d, zdH.C1, zV, OV.pd, kat);
    const Su = { korpus: Ku, nogaD: [[C1u, tip]], koszulka: kosz, nogaH: [[zu.C1, zu.C2]], ogonH: [[zu.C2, zu.T]] };
    const Sd = { korpus: Kd, nogaD: [[C1d, tipD]], koszulka: koszD, nogaH: [[zdH.C1, zdH.C2]], ogonH: [[zdH.C2, zdH.T]] };
    for (const [nm, S, Iwl, Iinna] of [['PG', Su, Ipg, Ipd], ['PD', Sd, Ipd, Ipg]]) {
      const cale = [...S.korpus, ...S.nogaD, ...(S.ogonD || []), ...S.nogaH, ...S.ogonH], Pc = pr(cale);
      const Pk = S.koszulka ? pr(S.koszulka, DR.dKoszulki / 2) : [];
      const tagV = ` [V ${ov}]`;
      for (const k of ['pierscien', 'uchwyt', 'S1', 'S2', 'S3', 'lebM2', 'piastaTyl']) zapisz(`drut ${nm} – ${k}${tagV}${nm === 'PG' ? (ogPG > 0 ? ' ogon w dół' : ' ogon w górę') : ''}`, odstep([...Pc, ...Pk], I[k]), war);
      zapisz(`drut ${nm} – druga powieka${tagV}`, odstep([...Pc, ...Pk], Iinna), war);
      // własna powieka: bez nogi przy dźwigni i 1,5 mm korpusu / 1 mm ogona od dźwigni (styk w otworze); koszulka od 0,3 mm za dźwignią
      const wl = [obetnij(S.korpus[0], 5), ...S.korpus.slice(1), ...(S.ogonD ? [obetnij(S.ogonD[0], 1)] : []), ...S.nogaH, ...S.ogonH].filter(Boolean);
      const kWl = S.koszulka ? [obetnij(S.koszulka[0], 0.3)].filter(Boolean) : [];
      zapisz(`drut ${nm} – własna powieka (bez otworu dźwigni i 5 mm korpusu przy niej)${tagV}`, odstep([...pr(wl), ...(kWl.length ? pr(kWl, DR.dKoszulki / 2) : [])], Iwl), war);
      // orczyk S3: bez nogi w otworze, 1,5 mm korpusu i 1 mm ogona od orczyka
      const kb = S.korpus[S.korpus.length - 1], przyOrcz = [...S.korpus.slice(0, -1), obetnij([kb[1], kb[0]], 1.5), obetnij(S.ogonH[0], 1), ...S.nogaD, ...(S.ogonD || [])].filter(Boolean);
      zapisz(`drut ${nm} – orczyk S3 (bez otworu)${tagV}${nm === "PG" ? (ogPG > 0 ? " ogon w dół" : " ogon w górę") : ""}`, odstep(pr(przyOrcz), Iorc), war);
      zapisz(`drut ${nm} – sfera gałki R${PAR.Rg}${tagV}`, sfera([...Pc, ...Pk], PAR.Rg), war);
    }
    // PG – PD: bez nóg w otworze orczyka i 1 mm wokół niego
    const bezO = (S) => { const kb = S.korpus[S.korpus.length - 1]; return [...S.korpus.slice(0, -1), obetnij([kb[1], kb[0]], 1), obetnij(S.ogonH[0], 1), ...S.nogaD, ...(S.ogonD || [])].filter(Boolean); };
    zapisz(`drut PG – drut PD (bez otworu orczyka) [V ${ov}, ogon PG ${ogPG > 0 ? 'w dół' : 'w górę'}]`, odstep(pr(bezO(Su)), indeks(odc(bezO(Sd)))), war);
  }
  process.stderr.write(`[${((Date.now() - t0) / 1000).toFixed(0)} s] powieki ${pp}\n`);
}
// 2) druty S1, S2
// ucho = widełki ze sworzniem ∥ y (układ gałki); oczko o promieniu osi rOczka w płaszczyźnie najbliższej ⟂ sworznia, korpus od brzegu oczka
// granica przechyłu oczka z drutu okrągłego (Ø wewn. D) na sworzniu Ø d: cos T ≥ 2d / (D + d) (review Opus v3 W2; oczko otwarte, bez zakładki)
const katGr = (D) => Math.acos(Math.min(1, 2 * PAR.dDrut / (D + PAR.dDrut))) * 180 / Math.PI;
const OCZ = { S1: { r: DR.rOczkaS1, D: DR.dOczkaS1, szcz: DR.szczS1 }, S2: { r: DR.rOczkaS2, D: DR.dOczkaS2, szcz: DR.szczS2 } };
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
function oczko(E, pin, b, O, przes) { const tilt = Math.asin(Math.min(1, Math.abs(dot(b, pin)))) * 180 / Math.PI;
  let n = sub(pin, mul(b, dot(pin, b))); n = Math.hypot(...n) < 1e-6 ? pin : unit(n); const u = unit(sub(b, mul(n, dot(b, n)))), v = cross(n, u);
  const pk = []; const Ec = add(E, przes || [0, 0, 0]); for (let k = 0; k <= 16; k++) { const t = 2 * Math.PI * k / 16; pk.push(add(Ec, add(mul(u, O.r * Math.cos(t)), mul(v, O.r * Math.sin(t))))); }
  const seg = []; for (let k = 0; k < 16; k++) seg.push([pk[k], pk[k + 1]]);
  return { tilt, start: add(Ec, mul(u, O.r)), seg, szczelina: O.szcz / 2 - ((O.r + PAR.dDrut / 2) * Math.sin(rad(tilt)) + PAR.dDrut / 2) }; }
// sworznie ucha z koszulkami (układ gałki): S1 przelotowy, koszulki po obu stronach; S2 ślepy na zewnątrz, koszulka od środka
const lK = DR.lKoszulki, rK = DR.dKoszulki / 2, tP = DR.tPolicz;
const SWORZ = [
  ...[[K.lug1, DR.szczS1, true], [K.lug2, DR.szczS2, false]].flatMap(([E, sz, oba]) => { const y0 = sz / 2 + tP, Ep = (dy) => add(E, [0, dy, 0]);
    const s = [[Ep(-y0 - lK), Ep(oba ? y0 + lK : sz / 2 + tP - 0.9)]]; const k = [[Ep(-y0 - lK), Ep(-y0)]]; if (oba) k.push([Ep(y0), Ep(y0 + lK)]); return [{ s, k }]; })];
const PS0 = SWORZ.flatMap((q) => [...pr(q.s), ...pr(q.k, rK)]);
const Igz = indeks(M.pg), Igo = indeks(przeksztalc(M.pg, (p) => Rx(p, SKOK))), Idz = indeks(M.pd), Ido = indeks(przeksztalc(M.pd, (p) => Rx(p, -psiDolna(alfa3(SKOK), SKOK))));
for (const th of TH) for (const ph of PH) {
  const poz = `θ ${th}, φ ${ph}`, g = (p) => gal(p, th, ph);
  const l1 = g(K.lug1), l2 = g(K.lug2), a1 = alfa(K.s1, L1, l1), a2 = alfa(K.s2, L2, l2);
  if (a1 === null || a2 === null) { zapisz('NIEOSIĄGALNE', -99, poz); continue; }
  const h1 = Hx(K.s1, a1), h2 = Hx(K.s2, a2), go = SV.grubOrcz;
  const Io1 = indeks(orczykXp(K.s1, a1, K.s1.xh - go / 2, K.s1.xh + go / 2 + 2)), Io2 = indeks(orczykXp(K.s2, a2, K.s2.xh - go / 2, K.s2.xh + go / 2 + 2));
  const ear = { S1: [l1, g([0, 1, 0]), h1], S2: [l2, g([0, 1, 0]), h2] };
  for (const m of ZM) for (const pH of [0, 1]) {
    const war = `${poz}, Z ${m}, luz orcz ${pH}`, druty = {};
    for (const nm of ['S1', 'S2']) { const [E, a, H] = ear[nm];
      const O = OCZ[nm], bb = unit(sub(H, E)), oc = oczko(E, a, bb, O), zh = koniecZ(H, xL, -1, go, m, pH, bb);
      // oczko przesunięte o cały luz na sworzniu (D − d)/2 w 4 kierunkach w swojej płaszczyźnie – wobec gałki (policzki, mostek)
      const n0 = unit(sub(a, mul(bb, dot(a, bb)))), u0 = unit(sub(bb, mul(n0, dot(bb, n0)))), v0 = cross(n0, u0), lz = (O.D - PAR.dDrut) / 2;
      for (const w of [u0, mul(u0, -1), v0, mul(v0, -1)]) { const os = oczko(E, a, bb, O, mul(w, lz));
        zapisz(`oczko ${nm} przesunięte w luzie – gałka (policzki, mostek)`, odstep(pr(os.seg).map((p) => galOdwr(p, th, ph)), Ig0), war); }
      const S = { korpus: [[oc.start, zh.C1]], nogaE: oc.seg, ogonE: [[oc.start, oc.start]], nogaH: [[zh.C1, zh.C2]], ogonH: [[zh.C2, zh.T]] };
      druty[nm] = S; zapisz(`przechył oczka ${nm} [° zapasu do ${katGr(O.D).toFixed(1)}°; bez błędu płaszczyzny]`, katGr(O.D) - oc.tilt, war);
      zapisz(`oczko ${nm} w szczelinie widełek [mm zapasu na stronę]`, oc.szczelina, war); const Pc = pr([...S.korpus, ...S.nogaE, ...S.nogaH, ...S.ogonH]);
      for (const k of ['pierscien', 'uchwyt', 'S1', 'S2', 'S3', 'piastaTyl', 'lebM2']) zapisz(`drut ${nm} – ${k}`, odstep(Pc, I[k]), war);
      for (const [k, Ik] of [['powieka górna (zamkn.)', Igz], ['powieka górna (otw.)', Igo], ['powieka dolna (zamkn.)', Idz], ['powieka dolna (otw.)', Ido]]) zapisz(`drut ${nm} – ${k}`, odstep(Pc, Ik), war);
      // gałka: bez nogi w uchu, 1,5 mm korpusu i 1 mm ogona przy uchu
      const przyG = [obetnij(S.korpus[0], 0.5), ...S.nogaH, ...S.ogonH].filter(Boolean);
      zapisz(`drut ${nm} – gałka (korpus od brzegu oczka)`, odstep(pr(przyG).map((p) => galOdwr(p, th, ph)), Ig0), war);
      // własny orczyk: bez nogi w otworze, 1,5 mm korpusu i 1 mm ogona przy orczyku
      const przyO = [obetnij([S.korpus[0][1], S.korpus[0][0]], 1.5), obetnij(S.ogonH[0], 1), ...S.nogaE].filter(Boolean);
      zapisz(`drut ${nm} – własny orczyk (bez otworu)`, odstep(pr(przyO), nm === 'S1' ? Io1 : Io2), war);
      zapisz(`drut ${nm} – orczyk ${nm === 'S1' ? 'S2' : 'S1'}`, odstep(Pc, nm === 'S1' ? Io2 : Io1), war);
    }
    const all = (S) => [...S.korpus, ...S.nogaE, ...S.nogaH, ...S.ogonH];
    const PSw = PS0.map((q) => g(q)); zapisz('sworznie ucha z koszulkami – piasta tylna kardana', odstep(PSw, I.piastaTyl), war);
    for (const nm of ['S1', 'S2']) zapisz(`sworzeń z koszulką (drugie ucho) – drut ${nm}`, odstep(pr(SWORZ[nm === 'S1' ? 1 : 0].s.concat(SWORZ[nm === 'S1' ? 1 : 0].k).map((s2) => s2.map(g))), indeks(odc(all(druty[nm])))), war);
    zapisz('drut S1 – drut S2', odstep(pr(all(druty.S1)), indeks(odc(all(druty.S2)))), war);
  }
  process.stderr.write(`[${((Date.now() - t0) / 1000).toFixed(0)} s] ${poz}\n`);
}
const lista = [...wyniki.entries()].sort((x, y) => x[1].d - y[1].d);
console.log(`kolizje drutów v2: krok ${KROK}°, θ ${TH.length} × φ ${PH.length}, ψ ${PS.length}; środek Z ${ZM.join(' / ')}, ogon ${DR.ogonZ}, V ramiona ${DR.ramieV} (30°/60°), koszulka Ø${DR.dKoszulki} × ${DR.lKoszulki}; ${((Date.now() - t0) / 1000).toFixed(0)} s`);
console.log('para | najmniejszy odstęp powierzchni [mm] (≥ 3 = „> 3”, ujemny = wnikanie) | wariant');
for (const [k, w] of lista) console.log(`${k} | ${w.d >= ZASIEG ? '> 3' : w.d.toFixed(2)} | ${w.poz}`);
