// Duże oko v2: kinematyka cięgien (druty o stałej długości) – kąty serw dla pozycji gałki i powiek.
// Układ: x w prawo, y w górę, z do przodu, środek gałki = 0. Gałka: świat = Rx(φ góra–dół, oś stała) · Ry(θ lewo–prawo, oś w krzyżaku).
// Orczyk serwa z wałkiem ∥ x: otwór H(α) = (xh, ys + r cos α, zs + r sin α); α = 0 → ramię w +y.
// Orczyk S3 z wałkiem ∥ y: H(α) = (xs + r cos α, yh, zs + r sin α); α = 0 → ramię w +x.
// Użycie: node duze-oko-kinematyka.js <parametry.json z eksport.sh (echo SCAD)> [siatka]
// Geometria (ucha, orczyki, dźwignie, skok) wyłącznie z modelu SCAD; bez pliku parametrów skrypt się nie uruchamia.
if (!process.argv[2] || !process.argv[2].endsWith('.json')) { console.error('podaj parametry.json (bash 40-cad/openscad/eksport.sh <katalog>)'); process.exit(2); }
const P = Object.assign({ zakres: { th: 35, ph: 25 } }, JSON.parse(require('fs').readFileSync(process.argv[2], 'utf8')));
for (const k of ['lug1', 'lug2', 's1', 's2', 's3', 'lev']) if (!P[k]) { console.error('brak w parametrach: ' + k); process.exit(2); }
const rad = (d) => d * Math.PI / 180, deg = (r) => r * 180 / Math.PI;
const Rx = (p, a) => { const c = Math.cos(rad(a)), s = Math.sin(rad(a)); return [p[0], p[1] * c + p[2] * s, -p[1] * s + p[2] * c]; };
const Ry = (p, a) => { const c = Math.cos(rad(a)), s = Math.sin(rad(a)); return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c]; };
const gal = (p, th, ph) => Rx(Ry(p, th), ph);
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const Hx = (s, a) => [s.xh, s.ys + s.r * Math.cos(rad(a)), s.zs + s.r * Math.sin(rad(a))];
const Hy = (s, a) => [s.xs + s.r * Math.cos(rad(a)), s.yh, s.zs + s.r * Math.sin(rad(a))];
// kąt α na gałęzi ciągłej od α0: szukamy zera f(α) = |H(α) − punkt| − L, krokiem 0,05° w obie strony od poprzedniego α
const rozwiaz = (H, s, pkt, L, aPrev) => { const f = (a) => dist(H(s, a), pkt) - L;
  let best = null; for (let d = 0; d <= 120; d += 0.05) for (const a of [aPrev + d, aPrev - d]) { if (Math.abs(a) > 100) continue;
    const a2 = a + 0.05; if (f(a) === 0 || f(a) * f(a2) < 0) { let lo = a, hi = a2; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (f(lo) * f(m) <= 0) hi = m; else lo = m; } best = (lo + hi) / 2; return best; } }
  return null; };
const wyn = { P };
// ---- S1, S2: długości neutralne i kąty na siatce pozycji (ścieżka ciągła od środka) ----
for (const [nm, s, lug] of [['S1', P.s1, P.lug1], ['S2', P.s2, P.lug2]]) {
  const L = dist(Hx(s, s.a0), lug); const siatka = []; let min = 1e9, max = -1e9, brak = [];
  for (const th of [-35, -30, -20, -10, 0, 10, 20, 30, 35]) for (const ph of [-25, -20, -10, 0, 10, 20, 25]) {
    if (Math.abs(th) > P.zakres.th || Math.abs(ph) > P.zakres.ph) continue;
    // ścieżka od (0,0) po prostej do (th, ph)
    let a = s.a0, ok = true; for (let t = 0.02; t <= 1.0001; t += 0.02) { const r = rozwiaz(Hx, s, gal(lug, th * t, ph * t), L, a); if (r === null) { ok = false; break; } a = r; }
    if (!ok) { brak.push([th, ph]); continue; }
    siatka.push([th, ph, Math.round(a * 10) / 10]); min = Math.min(min, a); max = Math.max(max, a);
  }
  wyn[nm] = { L: Math.round(L * 100) / 100, alfa: [Math.round(min * 10) / 10, Math.round(max * 10) / 10], nieosiagalne: brak, siatka };
}
// ---- powieki: S3 → kąty obu powiek ----
{ const s = P.s3, v = P.lev, mid = v.skok / 2;
  const U = (psi) => { const d = psi - mid; return [v.xu, v.r * Math.cos(rad(d)), -v.r * Math.sin(rad(d))]; };
  const D = (psi) => { const d = psi - mid; return [v.xl, -v.r * Math.cos(rad(d)), -v.r * Math.sin(rad(d))]; };
  const H0 = Hy(s, s.a0), Lu = dist(H0, U(mid)), Ld = dist(H0, D(mid));
  const psiZ = (F, Lx, a) => { const g = (p) => dist(Hy(s, a), F(p)) - Lx; let lo = -40, hi = 100; // ψ z bisekcji na monotonicznym odcinku
    const pts = []; for (let p = -40; p <= 100; p += 0.25) pts.push([p, g(p)]); for (let i = 1; i < pts.length; i++) if (pts[i - 1][1] * pts[i][1] <= 0 && Math.abs(pts[i][0] - mid) < 60) { lo = pts[i - 1][0]; hi = pts[i][0]; for (let k = 0; k < 40; k++) { const m = (lo + hi) / 2; if (g(lo) * g(m) <= 0) hi = m; else lo = m; } return (lo + hi) / 2; } return null; };
  // α dla zamknięcia (ψu = 0) i otwarcia (ψu = skok)
  const aDla = (psiCel) => { let best = null, bd = 1e9; for (let a = -90; a <= 90; a += 0.05) { const p = psiZ(U, Lu, a); if (p !== null && Math.abs(p - psiCel) < bd) { bd = Math.abs(p - psiCel); best = a; } } return best; };
  const aZ = aDla(0), aO = aDla(v.skok);
  wyn.S3 = { Lu: Math.round(Lu * 100) / 100, Ld: Math.round(Ld * 100) / 100, alfaZamk: aZ && Math.round(aZ * 10) / 10, alfaOtw: aO && Math.round(aO * 10) / 10,
    gornaZamk: 0, dolnaPrzyZamk: aZ !== null ? Math.round(psiZ(D, Ld, aZ) * 100) / 100 : null, dolnaPrzyOtw: aO !== null ? Math.round(psiZ(D, Ld, aO) * 100) / 100 : null };
}
console.log(JSON.stringify(wyn, (k, v) => (k === 'siatka' ? undefined : v), 1));
if (process.argv[3] === 'siatka') { console.log('S1', JSON.stringify(wyn.S1.siatka)); console.log('S2', JSON.stringify(wyn.S2.siatka)); }
