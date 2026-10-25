// Duże oko v2 (25.10): kolizje kardanów 2/2 przy gałce (piasta 1 w gałce, piasta 2 i pręt Ø2 do orczyka S1/S2) w pełnym zakresie spojrzenia, wobec części, powiek i drutów powiek.
// Użycie: node duze-oko-kardany-kolizje.js <katalog STL złożenia z parametry.json> [krok_stopni=10]
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

// ---------- kinematyka ----------
const PAR = JSON.parse(fs.readFileSync(path.join(DIR, 'parametry.json'), 'utf8'));
const Rx = (p, a) => { const c = Math.cos(rad(a)), s = Math.sin(rad(a)); return [p[0], p[1] * c + p[2] * s, -p[1] * s + p[2] * c]; };
const Ry = (p, a) => { const c = Math.cos(rad(a)), s = Math.sin(rad(a)); return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c]; };
const gal = (p, th, ph) => Rx(Ry(p, th), ph), galOdwr = (p, th, ph) => Ry(Rx(p, -ph), -th);
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const zero = (f, lo, hi) => { let a = lo, b = hi, fa = f(a); if (fa * f(b) > 0) return null; for (let i = 0; i < 60; i++) { const m = (a + b) / 2, fm = f(m); if (fa * fm <= 0) b = m; else { a = m; fa = fm; } } return (a + b) / 2; };
const Hx = (s, a) => [s.xh, s.ys + s.r * Math.cos(rad(a)), s.zs + s.r * Math.sin(rad(a))];
const L1 = dist(Hx(PAR.s1, PAR.s1.a0), PAR.lug1), L2 = dist(Hx(PAR.s2, PAR.s2.a0), PAR.lug2);
function alfa(s, L, pkt) { const f = (a) => dist(Hx(s, a), pkt) - L; for (let d = 0; d < 100; d += 1) for (const [p, q] of [[s.a0 + d, s.a0 + d + 1], [s.a0 - d - 1, s.a0 - d]]) { const r = zero(f, p, q); if (r !== null) return r; } return null; }
const PW = PAR.pow, SK = PW.skok, RD = PAR.dDrut / 2;
const uszko = (sg, ps) => [0, sg * PW.rZacz * Math.sin(rad(PW.katZacz + ps)), PW.rZacz * Math.cos(rad(PW.katZacz + ps))];
const orczP = (sg, a) => [0, sg * (PW.yWal + PW.r * Math.cos(rad(a))), PW.zs + PW.r * Math.sin(rad(a))];
const LP = dist(uszko(1, SK / 2), orczP(1, 0));
const alfaP = (ps) => (ps < SK / 2 ? zero((a) => dist(uszko(1, ps), orczP(1, a)) - LP, 0, 100) : zero((a) => dist(uszko(1, ps), orczP(1, a)) - LP, -100, 0)) ?? 0;
// ---------- bryły ----------
const st = (n) => czytajSTL(path.join(DIR, n + '.stl'));
const M = { galka: st('Galka'), pg: st('PowiekaGorna'), pd: st('PowiekaDolna'), pier: st('Pierscien'), uch: st('UchwytSerw') };
const SV = PAR.sv, hw = SV.Wsv / 2, rW = SV.rWiezy;
const serwoX = (s) => { const t = s.xh + SV.odstOrcz; return [...pudlo(t + SV.wiezaH, t + SV.wiezaH + SV.Hsv, s.ys - hw, s.ys + hw, SV.zT, SV.zP), ...walec(0, [s.ys, s.zs], t, t + SV.wiezaH, rW)]; };
const serwoP = (sg) => { const t = -SV.odstOrcz, y = sg * PW.yWal; return [...pudlo(t - SV.wiezaH - SV.Hsv, t - SV.wiezaH, y - hw, y + hw, SV.zT, SV.zP), ...walec(0, [y, PW.zs], t - SV.wiezaH, t, rW)]; };
const stale = { pierscien: M.pier, uchwyt: M.uch, S1: serwoX(PAR.s1), S2: serwoX(PAR.s2), SG: serwoP(1), SD: serwoP(-1),
  lebM2: [...walec(0, [0, 0], PAR.xLeb, PAR.xLeb + PAR.hLebM2, PAR.dLebM2 / 2), ...walec(0, [0, 0], -PAR.xLeb - PAR.hLebM2, -PAR.xLeb, PAR.dLebM2 / 2)],
  piastaTyl: walec(2, [0, 0], -PAR.zPiasta, -PAR.dlWidelek, PAR.dKardan / 2) };
// orczyk: prostopadłościan grubość grubOrcz × szerOrcz od osi do otworu + 2,5, piasta
function belka(c, e, nOs) { const u = [e[0] - c[0], e[1] - c[1], e[2] - c[2]], L = Math.hypot(...u), uu = u.map((v) => v / L);
  const w = [uu[1] * nOs[2] - uu[2] * nOs[1], uu[2] * nOs[0] - uu[0] * nOs[2], uu[0] * nOs[1] - uu[1] * nOs[0]], hw2 = SV.szerOrcz / 2, ht = SV.grubOrcz / 2;
  const V = (i) => [0, 1, 2].map((k) => (i & 1 ? e[k] : c[k]) + w[k] * (i & 2 ? hw2 : -hw2) + nOs[k] * (i & 4 ? ht : -ht));
  const F = [[0, 2, 3, 1], [4, 5, 7, 6], [0, 1, 5, 4], [2, 6, 7, 3], [0, 4, 6, 2], [1, 3, 7, 5]], T = [];
  for (const f of F) { T.push([...V(f[0]), ...V(f[1]), ...V(f[2])]); T.push([...V(f[0]), ...V(f[2]), ...V(f[3])]); } return T; }
const orczykX = (s, a) => { const c = [s.xh, s.ys, s.zs], h = Hx(s, a); const e = [s.xh, c[1] + (h[1] - c[1]) * (s.r + 2.5) / s.r, c[2] + (h[2] - c[2]) * (s.r + 2.5) / s.r]; return [...belka(c, e, [1, 0, 0]), ...walec(0, [c[1], c[2]], s.xh - 1, s.xh + 2, SV.rPiastyOrcz)]; };
const orczykP = (sg, a) => { const c = [0, sg * PW.yWal, PW.zs], h = orczP(sg, a); const e = [0, c[1] + (h[1] - c[1]) * (PW.r + 2.5) / PW.r, c[2] + (h[2] - c[2]) * (PW.r + 2.5) / PW.r]; return [...belka(c, e, [1, 0, 0]), ...walec(0, [c[1], c[2]], -2, 1, SV.rPiastyOrcz)]; };
const skroc = (a, b, m) => { const L = dist(a, b), u = [0, 1, 2].map((i) => (b[i] - a[i]) / L); return [a.map((v, i) => v + u[i] * m), b.map((v, i) => v - u[i] * m)]; };
// ---------- kardany 2/2 przy gałce (25.10): środek przegubu w punkcie ucha, piasta 1 w głąb gałki (oś „ucho → orczyk w zerze”), piasta 2 w stronę pręta, pręt Ø2 do orczyka ----
const LK = 23.5, RK = 4.5, RPR = 1;
const sub = (a, b) => a.map((v, i) => v - b[i]), add = (a, b) => a.map((v, i) => v + b[i]), mul = (a, k) => a.map((v) => v * k), unit = (a) => mul(a, 1 / Math.hypot(...a));
const OS = { S1: unit(sub(Hx(PAR.s1, PAR.s1.a0), PAR.lug1)), S2: unit(sub(Hx(PAR.s2, PAR.s2.a0), PAR.lug2)) };
const I = {}; for (const [k, T] of Object.entries(stale)) I[k] = indeks(T);
const wyniki = new Map(); const zapisz = (para, d, poz) => { const w = wyniki.get(para); if (!w || d < w.d) wyniki.set(para, { d: Math.round(d * 100) / 100, poz: poz + (d < 0.3 && OSTATNI ? ' @ ' + OSTATNI.map((v) => v.toFixed(1)).join(',') : '') }); };
const kroki = (a, b, k) => { const r = []; for (let v = a; v <= b + 1e-9; v += k) r.push(+v.toFixed(3)); if (r[r.length - 1] !== b) r.push(b); return r; };
const sym = (m, k) => [...new Set([-m, ...kroki(0, m, k).map((v) => -v).reverse(), ...kroki(0, m, k), m])].sort((a, b) => a - b);
const TH = sym(35, KROK), PH = sym(25, KROK);
const t0 = Date.now(), Ig0 = indeks(M.galka);
const LidT = {}; for (const ps of [0, SK / 2, SK]) LidT[ps] = { g: indeks(przeksztalc(M.pg, (p) => Rx(p, ps))), d: indeks(przeksztalc(M.pd, (p) => Rx(p, -ps))) };
const katy = { S1: [1e9, -1e9], S2: [1e9, -1e9] };
for (const k of ['S1', 'S2', 'SG', 'SD']) zapisz('serwo ' + k + ' – uchwyt (stałe; 0,3 = luz okna ramki)', odstep(probki(stale[k]), I.uchwyt), '–');
const prev = { S1: PAR.s1.a0, S2: PAR.s2.a0 };
for (const th of TH) for (const ph of PH) {
  const poz = `θ ${th}, φ ${ph}`, g = (p) => gal(p, th, ph); const ciala = {};
  for (const [nm, s, lug] of [['S1', PAR.s1, PAR.lug1], ['S2', PAR.s2, PAR.lug2]]) {
    const L = dist(Hx(s, s.a0), lug), J = g(lug), a = alfa(s, L, J); if (a === null) { zapisz('NIEOSIĄGALNE ' + nm, -99, poz); continue; }
    katy[nm] = [Math.min(katy[nm][0], a), Math.max(katy[nm][1], a)];
    const H = Hx(s, a), u = unit(sub(H, J)), o = g(OS[nm]);
    const p2 = add(J, mul(u, LK / 2));
    ciala[nm] = { piasta1: pret(sub(J, mul(o, LK / 2)), J, RK, 16), piasta2: pret(add(J, mul(u, 1.5)), p2, RK, 16), pret: pret(p2, sub(H, mul(u, 1.5)), RPR, 8), a };
  }
  if (ciala.S1 && ciala.S2) { const o1 = probki(orczykX(PAR.s1, ciala.S1.a)), o2 = probki(orczykX(PAR.s2, ciala.S2.a)); zapisz('orczyk S1 – serwo S2 (wieża, korpus)', odstep(o1, I.S2), poz); zapisz('orczyk S2 – serwo S1 (wieża, korpus)', odstep(o2, I.S1), poz); zapisz('orczyk S1 – orczyk S2', odstep(o1, indeks(orczykX(PAR.s2, ciala.S2.a))), poz); for (const k of ['uchwyt', 'pierscien', 'SG', 'SD']) { zapisz('orczyk S1 – ' + k, odstep(o1, I[k]), poz); zapisz('orczyk S2 – ' + k, odstep(o2, I[k]), poz); } }
  for (const nm of Object.keys(ciala)) { const c = ciala[nm], P2 = probki(c.piasta2), Pp = probki(c.pret), P1 = probki(c.piasta1);
    for (const k of ['pierscien', 'uchwyt', 'S1', 'S2', 'SG', 'SD', 'piastaTyl']) { zapisz(`piasta 2 kardana ${nm} – ${k}`, odstep(P2, I[k]), poz); zapisz(`pręt ${nm} – ${k}`, odstep(Pp, I[k]), poz); zapisz(`piasta 1 kardana ${nm} – ${k}`, odstep(P1, I[k]), poz); }
    zapisz(`piasta 2 kardana ${nm} – gałka`, odstep(P2.map((p) => galOdwr(p, th, ph)), Ig0), poz); zapisz(`pręt ${nm} – gałka`, odstep(Pp.map((p) => galOdwr(p, th, ph)), Ig0), poz);
    zapisz(`piasta 1 kardana ${nm} – gałka (bez kostki: wewnątrz)`, odstep(P1.map((p) => galOdwr(p, th, ph)).filter((p) => true), Ig0), poz);
    for (const ps of Object.keys(LidT)) { zapisz(`kardan + pręt ${nm} – powieka górna`, odstep([...P1, ...P2, ...Pp], LidT[ps].g), poz + ', ψ ' + ps); zapisz(`kardan + pręt ${nm} – powieka dolna`, odstep([...P1, ...P2, ...Pp], LidT[ps].d), poz + ', ψ ' + ps); }
    const inny = ciala[nm === 'S1' ? 'S2' : 'S1']; if (inny && nm === 'S1') zapisz('kardan + pręt S1 – kardan + pręt S2', odstep([...P1, ...P2, ...Pp], indeks([...inny.piasta1, ...inny.piasta2, ...inny.pret])), poz);
    // druty powiek (proste, uszko → orczyk) w 3 położeniach
    for (const ps of [0, SK / 2, SK]) { const a3 = alfaP(ps); for (const sg of [1, -1]) { const [p, q] = skroc(uszko(sg, ps), orczP(sg, a3), 1.5);
      zapisz(`kardan + pręt ${nm} – drut powieki ${sg > 0 ? 'SG' : 'SD'}`, odstep([...P1, ...P2, ...Pp], indeks(pret(p, q, RD))), poz + ', ψ ' + ps); } }
    // orczyki S1/S2 wobec prętów drugiej osi
    zapisz(`pręt ${nm} – orczyk ${nm === 'S1' ? 'S2' : 'S1'}`, odstep(Pp, indeks(nm === 'S1' ? orczykX(PAR.s2, (ciala.S2 || {}).a ?? PAR.s2.a0) : orczykX(PAR.s1, (ciala.S1 || {}).a ?? PAR.s1.a0))), poz);
  }
  process.stderr.write(`[${((Date.now() - t0) / 1000).toFixed(0)} s] ${poz}\n`);
}
const lista = [...wyniki.entries()].sort((x, y) => x[1].d - y[1].d);
console.log(`kolizje kardanów 2/2 przy gałce: krok ${KROK}°, θ ${TH.length} × φ ${PH.length}; S1 α ${katy.S1.map((v) => v.toFixed(1)).join('…')}°, S2 α ${katy.S2.map((v) => v.toFixed(1)).join('…')}°; ${((Date.now() - t0) / 1000).toFixed(0)} s`);
console.log('para | najmniejszy odstęp powierzchni [mm] (≥ 3 = „> 3”) | położenie');
for (const [k, w] of lista) console.log(`${k} | ${w.d >= ZASIEG ? '> 3' : w.d.toFixed(2)} | ${w.poz}`);
