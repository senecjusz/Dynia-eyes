// Zbiorczy 3MF z osobnymi, nazwanymi obiektami (jeden obiekt na plik wejściowy), rozstawionymi obok siebie na płaszczyźnie z = 0.
// OpenSCAD zlewa części w jedną siatkę, więc zbiorczy składamy z pojedynczych 3MF (Bambu Studio widzi osobne obiekty).
// Użycie: node zbiorczy_3mf.js <wyjście.3mf> <odstęp_mm> <wejście1.3mf> [wejście2.3mf ...]   (nazwa obiektu = nazwa pliku bez .3mf)
const fs = require('fs'), path = require('path'), zlib = require('zlib');
function modele(buf) { const out = []; for (let i = 0; i < buf.length - 30;) { if (buf.readUInt32LE(i) !== 0x04034b50) { i++; continue; }
  const met = buf.readUInt16LE(i + 8), cs = buf.readUInt32LE(i + 18), nl = buf.readUInt16LE(i + 26), el = buf.readUInt16LE(i + 28);
  const name = buf.slice(i + 30, i + 30 + nl).toString(), st = i + 30 + nl + el;
  if (name.endsWith('.model')) out.push((met === 8 ? zlib.inflateRawSync(buf.slice(st, st + cs)) : buf.slice(st, st + cs)).toString()); i = st + cs; } return out; }
const MM = { micron: 0.001, millimeter: 1, centimeter: 10, inch: 25.4, meter: 1000 };
function siatka(f) { const V = [], T = []; for (const x of modele(fs.readFileSync(f))) { const s = MM[(x.match(/<model[^>]*\bunit="([^"]+)"/) || [])[1] || 'millimeter'];
    for (const mesh of x.split('<mesh').slice(1)) { const o = V.length;
      for (const m of mesh.matchAll(/<vertex[^>]*x="([^"]+)"[^>]*y="([^"]+)"[^>]*z="([^"]+)"/g)) V.push([s * m[1], s * m[2], s * m[3]]);
      for (const m of mesh.matchAll(/<triangle[^>]*v1="(\d+)"[^>]*v2="(\d+)"[^>]*v3="(\d+)"/g)) T.push([o + +m[1], o + +m[2], o + +m[3]]); } }
  const lo = [0, 1, 2].map((k) => Math.min(...V.map((v) => v[k]))), hi = [0, 1, 2].map((k) => Math.max(...V.map((v) => v[k])));
  return { V, T, lo, hi }; }
const crcT = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; return c; });
const crc32 = (b) => { let c = -1; for (let i = 0; i < b.length; i++) c = crcT[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };
function zip(pliki) { const lok = [], cen = []; let off = 0;
  for (const [nazwa, dane] of pliki) { const n = Buffer.from(nazwa), d = zlib.deflateRawSync(dane), c = crc32(dane);
    const h = Buffer.alloc(30); h.writeUInt32LE(0x04034b50, 0); h.writeUInt16LE(20, 4); h.writeUInt16LE(0, 6); h.writeUInt16LE(8, 8); h.writeUInt32LE(0, 10);
    h.writeUInt32LE(c, 14); h.writeUInt32LE(d.length, 18); h.writeUInt32LE(dane.length, 22); h.writeUInt16LE(n.length, 26); h.writeUInt16LE(0, 28);
    const ce = Buffer.alloc(46); ce.writeUInt32LE(0x02014b50, 0); ce.writeUInt16LE(20, 4); ce.writeUInt16LE(20, 6); ce.writeUInt16LE(0, 8); ce.writeUInt16LE(8, 10); ce.writeUInt32LE(0, 12);
    ce.writeUInt32LE(c, 16); ce.writeUInt32LE(d.length, 20); ce.writeUInt32LE(dane.length, 24); ce.writeUInt16LE(n.length, 28); ce.writeUInt32LE(off, 42);
    lok.push(h, n, d); cen.push(ce, n); off += 30 + n.length + d.length; }
  const cd = Buffer.concat(cen), e = Buffer.alloc(22); e.writeUInt32LE(0x06054b50, 0); e.writeUInt16LE(pliki.length, 8); e.writeUInt16LE(pliki.length, 10);
  e.writeUInt32LE(cd.length, 12); e.writeUInt32LE(off, 16); return Buffer.concat([...lok, cd, e]); }
const [wyj, odstS, ...wej] = process.argv.slice(2); const odst = +odstS;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
let obiekty = '', build = '', x = 0, y = 0, wiersz = 0; const SZER = 260;
wej.forEach((f, i) => { const m = siatka(f), w = m.hi[0] - m.lo[0], h = m.hi[1] - m.lo[1];
  if (x > 0 && x + w > SZER) { x = 0; y += wiersz + odst; wiersz = 0; }
  const tx = x - m.lo[0], ty = y - m.lo[1], tz = -m.lo[2]; x += w + odst; wiersz = Math.max(wiersz, h);
  const nazwa = path.basename(f, '.3mf');
  obiekty += `<object id="${i + 1}" name="${esc(nazwa)}" type="model"><mesh><vertices>` + m.V.map((v) => `<vertex x="${v[0].toFixed(5)}" y="${v[1].toFixed(5)}" z="${v[2].toFixed(5)}"/>`).join('') +
    '</vertices><triangles>' + m.T.map((t) => `<triangle v1="${t[0]}" v2="${t[1]}" v3="${t[2]}"/>`).join('') + '</triangles></mesh></object>\n';
  build += `<item objectid="${i + 1}" transform="1 0 0 0 1 0 0 0 1 ${tx.toFixed(4)} ${ty.toFixed(4)} ${tz.toFixed(4)}"/>\n`; });
const model = `<?xml version="1.0" encoding="UTF-8"?>\n<model unit="millimeter" xml:lang="pl-PL" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02">\n<resources>\n${obiekty}</resources>\n<build>\n${build}</build>\n</model>\n`;
const ct = '<?xml version="1.0" encoding="UTF-8"?>\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/></Types>';
const rels = '<?xml version="1.0" encoding="UTF-8"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Target="/3D/3dmodel.model" Id="rel0" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/></Relationships>';
fs.writeFileSync(wyj, zip([['[Content_Types].xml', Buffer.from(ct)], ['_rels/.rels', Buffer.from(rels)], ['3D/3dmodel.model', Buffer.from(model)]]));
console.log(`${path.basename(wyj)}: obiektów ${wej.length}: ${wej.map((f) => path.basename(f, '.3mf')).join(', ')}`);
