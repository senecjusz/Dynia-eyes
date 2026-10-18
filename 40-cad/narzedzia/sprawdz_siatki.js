// Kontrola szczelnosci siatek 3MF/STL po eksporcie (Node.js, bez bibliotek).
// Uzycie: node sprawdz_siatki.js <plik lub folder> [tolerancja_mm=0.0001] [--gdzie]
// Dla kazdego pliku: liczba trojkatow, otwarte krawedzie (1 trojkat), krawedzie nierozmaitosciowe (>2 trojkaty),
// trojkaty zdegenerowane (pole < 1e-9 mm2). Wynik OK tylko przy samych zerach. Kod wyjscia 1, gdy cos jest nie tak.
const fs = require('fs'), path = require('path'), zlib = require('zlib');
function unzip3mf(buf) { // minimalny czytnik ZIP: szuka pliku .model
  let out = [];
  for (let i = 0; i < buf.length - 30; ) {
    if (buf.readUInt32LE(i) !== 0x04034b50) { i++; continue; }
    const met = buf.readUInt16LE(i + 8), cs = buf.readUInt32LE(i + 18), nl = buf.readUInt16LE(i + 26), el = buf.readUInt16LE(i + 28);
    const name = buf.slice(i + 30, i + 30 + nl).toString(); const st = i + 30 + nl + el;
    let size = cs; if (size === 0) { const j = buf.indexOf(Buffer.from([0x50, 0x4b, 0x07, 0x08]), st); size = j - st; }
    if (name.endsWith('.model')) out.push((met === 8 ? zlib.inflateRawSync(buf.slice(st, st + size)) : buf.slice(st, st + size)).toString());
    i = st + size;
  }
  return out;
}
function trianglesFrom(file) {
  const T = [];
  if (file.toLowerCase().endsWith('.stl')) {
    const b = fs.readFileSync(file), n = b.readUInt32LE(80);
    for (let i = 0; i < n; i++) { const t = []; for (let k = 0; k < 9; k++) t.push(b.readFloatLE(84 + i * 50 + 12 + 4 * k)); T.push(t); }
    return T;
  }
  for (const x of unzip3mf(fs.readFileSync(file))) {
    for (const mesh of x.split('<mesh').slice(1)) {
      const V = [...mesh.matchAll(/<vertex[^>]*x="([^"]+)"[^>]*y="([^"]+)"[^>]*z="([^"]+)"/g)].map(m => [+m[1], +m[2], +m[3]]);
      for (const m of mesh.matchAll(/<triangle[^>]*v1="(\d+)"[^>]*v2="(\d+)"[^>]*v3="(\d+)"/g)) T.push([...V[+m[1]], ...V[+m[2]], ...V[+m[3]]]);
    }
  }
  return T;
}
function check(file, tol) {
  const T = trianglesFrom(file), key = new Map(); let nv = 0;
  const vid = (x, y, z) => { const k = Math.round(x / tol) + ',' + Math.round(y / tol) + ',' + Math.round(z / tol); if (!key.has(k)) key.set(k, nv++); return key.get(k); };
  const E = new Map(), P = new Map(); let deg = 0;
  for (const t of T) {
    const a = vid(t[0], t[1], t[2]), b = vid(t[3], t[4], t[5]), c = vid(t[6], t[7], t[8]);
    const ux = t[3] - t[0], uy = t[4] - t[1], uz = t[5] - t[2], vx = t[6] - t[0], vy = t[7] - t[1], vz = t[8] - t[2];
    const area = 0.5 * Math.hypot(uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx);
    if (a === b || b === c || a === c || area < 1e-9) { deg++; continue; }
    const pts = { [a]: [t[0], t[1], t[2]], [b]: [t[3], t[4], t[5]], [c]: [t[6], t[7], t[8]] };
    for (const [p, q] of [[a, b], [b, c], [c, a]]) { const k = p < q ? p + '_' + q : q + '_' + p; E.set(k, (E.get(k) || 0) + 1);
      if (!P.has(k)) P.set(k, pts[p].map((v, i) => (v + pts[q][i]) / 2)); }
  }
  let open = 0, nonman = 0; const gdzie = new Map();
  for (const [k, v] of E) { if (v === 1) open++; else if (v > 2) nonman++; else continue;
    const m = P.get(k).map(x => Math.round(x)).join(','); gdzie.set(m, (gdzie.get(m) || 0) + 1); }
  return { tri: T.length, open, nonman, deg, gdzie };
}
const [arg, tolS] = process.argv.slice(2).filter(a => a !== '--gdzie'); const tol = +(tolS || 0.0001);
const files = fs.statSync(arg).isDirectory() ? fs.readdirSync(arg).filter(f => /\.(3mf|stl)$/i.test(f)).map(f => path.join(arg, f)) : [arg];
let bad = 0;
for (const f of files) { const r = check(f, tol); const ok = !r.open && !r.nonman && !r.deg; if (!ok) bad++;
  console.log((ok ? 'OK   ' : 'BLAD ') + path.basename(f) + `  trojkatow ${r.tri}, otwarte ${r.open}, >2 ${r.nonman}, zdegenerowane ${r.deg}`);
  if (process.argv.includes('--gdzie') && !ok) console.log('   miejsca (x,y,z mm: liczba):', [...r.gdzie].sort((a, b) => b[1] - a[1]).slice(0, 25).map(([m, n]) => m + ':' + n).join('  ')); }
process.exit(bad ? 1 : 0);
