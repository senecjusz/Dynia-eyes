// Naprawa siatek 3MF/STL z eksportu SolidCraft (Node.js, bez bibliotek):
//  1) scalenie wierzcholkow (tolerancja 0.0001 mm), 2) usuniecie trojkatow zdegenerowanych i drzazg (wysokosc < 0.005 mm) przy krawedziach z >2 trojkatami,
//  3) usuniecie T-polaczen: wierzcholek lezacy na otwartej krawedzi innego trojkata -> podzial tego trojkata,
//  4) zalatanie malych otworow (obwod < 15 mm), 5) usuniecie podwojnych trojkatow. Ksztalt sie nie zmienia (dzielone sa tylko trojkaty).
// Uzycie: node napraw_siatki.js <wejscie.3mf|stl> <wyjscie.3mf>   (potem: node sprawdz_siatki.js <wyjscie>)
const fs = require('fs'), path = require('path'), zlib = require('zlib');

function unzipModels(buf) {
  const out = [];
  for (let i = 0; i < buf.length - 30; ) {
    if (buf.readUInt32LE(i) !== 0x04034b50) { i++; continue; }
    const met = buf.readUInt16LE(i + 8), cs = buf.readUInt32LE(i + 18), nl = buf.readUInt16LE(i + 26), el = buf.readUInt16LE(i + 28);
    const name = buf.slice(i + 30, i + 30 + nl).toString(); const st = i + 30 + nl + el; let size = cs;
    if (size === 0) { const j = buf.indexOf(Buffer.from([0x50, 0x4b, 0x07, 0x08]), st); size = j - st; }
    if (name.endsWith('.model')) out.push((met === 8 ? zlib.inflateRawSync(buf.slice(st, st + size)) : buf.slice(st, st + size)).toString());
    i = st + size;
  }
  return out;
}

function load(file) {
  const T = [];
  if (/\.stl$/i.test(file)) {
    const b = fs.readFileSync(file), n = b.readUInt32LE(80);
    for (let i = 0; i < n; i++) { const t = []; for (let k = 0; k < 9; k++) t.push(b.readFloatLE(84 + i * 50 + 12 + 4 * k)); T.push(t); }
    return T;
  }
  for (const x of unzipModels(fs.readFileSync(file))) for (const mesh of x.split('<mesh').slice(1)) {
    const V = [...mesh.matchAll(/<vertex[^>]*x="([^"]+)"[^>]*y="([^"]+)"[^>]*z="([^"]+)"/g)].map(m => [+m[1], +m[2], +m[3]]);
    for (const m of mesh.matchAll(/<triangle[^>]*v1="(\d+)"[^>]*v2="(\d+)"[^>]*v3="(\d+)"/g)) T.push([...V[+m[1]], ...V[+m[2]], ...V[+m[3]]]);
  }
  return T;
}

const TOL = 1e-4;
function repair(T) {
  const key = new Map(), V = [];
  const vid = (x, y, z) => { const k = Math.round(x / TOL) + ',' + Math.round(y / TOL) + ',' + Math.round(z / TOL); if (!key.has(k)) { key.set(k, V.length); V.push([x, y, z]); } return key.get(k); };
  const area = (f) => { const [p, q, r] = f.map(i => V[i]); const a = [q[0] - p[0], q[1] - p[1], q[2] - p[2]], b = [r[0] - p[0], r[1] - p[1], r[2] - p[2]];
    return 0.5 * Math.hypot(a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]); };
  let F = [];
  for (const t of T) { const a = vid(t[0], t[1], t[2]), b = vid(t[3], t[4], t[5]), c = vid(t[6], t[7], t[8]); if (a !== b && b !== c && a !== c) F.push([a, b, c]); }
  // drzazgi: trojkat o wysokosci < 0.005 mm (zakladki z siatkowania SolidCraft) - usuwany, luke zalatuje krok nizej
  const hmin = (f) => { const [p, q, r] = f.map(i => V[i]); const L = Math.max(Math.hypot(q[0]-p[0], q[1]-p[1], q[2]-p[2]), Math.hypot(r[0]-q[0], r[1]-q[1], r[2]-q[2]), Math.hypot(p[0]-r[0], p[1]-r[1], p[2]-r[2])); return 2 * area(f) / L; };
  {
    const E0 = new Map(); F.forEach(f => { for (let k = 0; k < 3; k++) { const a = f[k], b = f[(k + 1) % 3]; const kk = a < b ? a + '_' + b : b + '_' + a; E0.set(kk, (E0.get(kk) || 0) + 1); } });
    const przy = (f) => [0, 1, 2].some(k => { const a = f[k], b = f[(k + 1) % 3]; return E0.get(a < b ? a + '_' + b : b + '_' + a) > 2; });
    const n0 = F.length; F = F.filter(f => !(przy(f) && hmin(f) < 0.005)); if (F.length < n0) console.log('usuniete drzazgi przy krawedziach >2:', n0 - F.length);
  }
  for (let pass = 0; pass < 10; pass++) {
    const E = new Map();
    F.forEach((f, fi) => { for (let k = 0; k < 3; k++) { const a = f[k], b = f[(k + 1) % 3]; const kk = a < b ? a + '_' + b : b + '_' + a; if (!E.has(kk)) E.set(kk, []); E.get(kk).push(fi); } });
    const open = [...E].filter(([, l]) => l.length === 1); if (!open.length) break;
    const ov = new Set(); open.forEach(([k]) => k.split('_').forEach(i => ov.add(+i))); const ovl = [...ov];
    const split = new Map();
    for (const [k, l] of open) {
      const [a, b] = k.split('_').map(Number); const A = V[a], B = V[b];
      const d = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], L2 = d[0] * d[0] + d[1] * d[1] + d[2] * d[2]; if (L2 < 1e-12) continue;
      const on = [];
      for (const p of ovl) {
        if (p === a || p === b) continue; const P = V[p]; const w = [P[0] - A[0], P[1] - A[1], P[2] - A[2]];
        const t = (w[0] * d[0] + w[1] * d[1] + w[2] * d[2]) / L2; if (t <= 1e-6 || t >= 1 - 1e-6) continue;
        if (Math.hypot(w[0] - t * d[0], w[1] - t * d[1], w[2] - t * d[2]) < 2e-4) on.push([t, p]);
      }
      if (on.length) { on.sort((x, y) => x[0] - y[0]); split.set(l[0], (split.get(l[0]) || []).concat([[a, b, on.map(x => x[1])]])); }
    }
    if (!split.size) break;
    const NF = [];
    F.forEach((f, fi) => {
      if (!split.has(fi)) { NF.push(f); return; }
      const poly = [f[0], f[1], f[2]];
      for (const [a, b, pts] of split.get(fi)) {
        const ia = poly.indexOf(a), ib = poly.indexOf(b);
        if ((ia + 1) % poly.length === ib) poly.splice(ia + 1, 0, ...pts);
        else if ((ib + 1) % poly.length === ia) poly.splice(ib + 1, 0, ...pts.slice().reverse());
      }
      // wielokat wypukly w plaszczyznie trojkata: wachlarz z oryginalnego wierzcholka, ktorego oba sasiednie boki nie byly dzielone
      const orig = new Set(f); let s0 = 0;
      for (let i = 0; i < poly.length; i++) if (orig.has(poly[i]) && orig.has(poly[(i + 1) % poly.length]) && orig.has(poly[(i + poly.length - 1) % poly.length])) { s0 = i; break; }
      if (!orig.has(poly[s0])) s0 = poly.findIndex(v => orig.has(v));
      const R = poly.slice(s0).concat(poly.slice(0, s0));
      for (let i = 1; i < R.length - 1; i++) { const t = [R[0], R[i], R[i + 1]]; if (area(t) > 1e-12) NF.push(t); }
    });
    F = NF;
  }
  // latanie malych otworow: petle otwartych krawedzi (do 40 wierzcholkow, obwod < 15 mm) -> wachlarz trojkatow,
  // orientacja przeciwna do krawedzi brzegowych (zgodna z sasiednimi trojkatami)
  {
    const H = new Set(); F.forEach(f => { for (let k = 0; k < 3; k++) H.add(f[k] + '>' + f[(k + 1) % 3]); });
    const nxt = new Map();
    F.forEach(f => { for (let k = 0; k < 3; k++) { const a = f[k], b = f[(k + 1) % 3]; if (!H.has(b + '>' + a)) { if (!nxt.has(b)) nxt.set(b, []); nxt.get(b).push(a); } } });
    const used = new Set(); let filled = 0;
    for (const [st] of nxt) {
      if (used.has(st)) continue;
      const loop = [st]; let cur = st, ok = false;
      for (let g = 0; g < 41; g++) { const l = nxt.get(cur); if (!l || !l.length) break; const nx = l[0]; if (nx === st) { ok = true; break; } if (loop.includes(nx)) break; loop.push(nx); cur = nx; }
      if (!ok || loop.length < 3) continue;
      let per = 0; for (let i = 0; i < loop.length; i++) { const P = V[loop[i]], Q = V[loop[(i + 1) % loop.length]]; per += Math.hypot(P[0] - Q[0], P[1] - Q[1], P[2] - Q[2]); }
      if (per > 15) continue;
      loop.forEach(v => used.add(v)); loop.forEach(v => nxt.get(v).shift());
      for (let i = 1; i < loop.length - 1; i++) F.push([loop[0], loop[i], loop[i + 1]]);
      filled++;
    }
    if (filled) console.log('zalatane otwory:', filled);
  }
  const seen = new Set();
  F = F.filter(f => { const k = f.slice().sort((a, b) => a - b).join('_'); if (seen.has(k)) return false; seen.add(k); return area(f) > 1e-9; });
  return { V, F };
}

function write3mf(out, V, F) {
  const xml = ['<?xml version="1.0" encoding="UTF-8"?>\n<model unit="millimeter" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02"><resources><object id="1" type="model"><mesh><vertices>'];
  for (const v of V) xml.push('<vertex x="' + v[0] + '" y="' + v[1] + '" z="' + v[2] + '"/>');
  xml.push('</vertices><triangles>');
  for (const f of F) xml.push('<triangle v1="' + f[0] + '" v2="' + f[1] + '" v3="' + f[2] + '"/>');
  xml.push('</triangles></mesh></object></resources><build><item objectid="1"/></build></model>');
  const files = {
    '[Content_Types].xml': '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/></Types>',
    '_rels/.rels': '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Target="/3D/3dmodel.model" Id="rel0" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/></Relationships>',
    '3D/3dmodel.model': xml.join(''),
  };
  const crcT = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; return c; });
  const crc = (b) => { let c = -1; for (const x of b) c = crcT[(c ^ x) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };
  const parts = [], cd = []; let off = 0, cnt = 0;
  for (const name of Object.keys(files)) {
    const raw = Buffer.from(files[name]), comp = zlib.deflateRawSync(raw), nb = Buffer.from(name), c32 = crc(raw);
    const h = Buffer.alloc(30); h.writeUInt32LE(0x04034b50, 0); h.writeUInt16LE(20, 4); h.writeUInt16LE(8, 8); h.writeUInt32LE(c32, 14); h.writeUInt32LE(comp.length, 18); h.writeUInt32LE(raw.length, 22); h.writeUInt16LE(nb.length, 26);
    parts.push(h, nb, comp);
    const c = Buffer.alloc(46); c.writeUInt32LE(0x02014b50, 0); c.writeUInt16LE(20, 4); c.writeUInt16LE(20, 6); c.writeUInt16LE(8, 10); c.writeUInt32LE(c32, 16); c.writeUInt32LE(comp.length, 20); c.writeUInt32LE(raw.length, 24); c.writeUInt16LE(nb.length, 28); c.writeUInt32LE(off, 42);
    cd.push(c, nb); off += 30 + nb.length + comp.length; cnt++;
  }
  const cdb = Buffer.concat(cd), e = Buffer.alloc(22);
  e.writeUInt32LE(0x06054b50, 0); e.writeUInt16LE(cnt, 8); e.writeUInt16LE(cnt, 10); e.writeUInt32LE(cdb.length, 12); e.writeUInt32LE(off, 16);
  fs.writeFileSync(out, Buffer.concat([...parts, cdb, e]));
}

const [inp, out] = process.argv.slice(2);
const T = load(inp); let { V, F } = repair(T);
for (let k = 0; k < 2; k++) { // kolejne rundy (otwor przy wierzcholku uzytym juz w innej petli laci sie w nastepnej)
  const n0 = F.length; const T2 = F.map(f => [...V[f[0]], ...V[f[1]], ...V[f[2]]]); ({ V, F } = repair(T2)); if (F.length === n0) break; }
write3mf(out, V, F);
console.log('naprawiono', path.basename(inp), ':', T.length, '->', F.length, 'trojkatow');
