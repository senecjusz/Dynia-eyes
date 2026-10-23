// Liczba spójnych brył (składowych) w siatce 3MF/STL: trójkąty połączone wspólnymi wierzchołkami (tolerancja 0,001 mm).
// Użycie: node skladowe_siatki.js <plik> [...]. Część do druku powinna mieć 1 bryłę (zbiorczy: tyle, ile części).
const fs = require('fs'), path = require('path'), zlib = require('zlib');
function modele(buf) { const out = []; for (let i = 0; i < buf.length - 30;) { if (buf.readUInt32LE(i) !== 0x04034b50) { i++; continue; }
  const met = buf.readUInt16LE(i + 8), cs = buf.readUInt32LE(i + 18), nl = buf.readUInt16LE(i + 26), el = buf.readUInt16LE(i + 28);
  const name = buf.slice(i + 30, i + 30 + nl).toString(), st = i + 30 + nl + el;
  if (name.endsWith('.model')) out.push((met === 8 ? zlib.inflateRawSync(buf.slice(st, st + cs)) : buf.slice(st, st + cs)).toString()); i = st + cs; } return out; }
for (const f of process.argv.slice(2)) {
  const T = []; if (f.toLowerCase().endsWith('.stl')) { const s = fs.readFileSync(f, 'utf8'); const v = [...s.matchAll(/vertex\s+(\S+)\s+(\S+)\s+(\S+)/g)].map((m) => [+m[1], +m[2], +m[3]]); for (let i = 0; i + 2 < v.length; i += 3) T.push([v[i], v[i + 1], v[i + 2]]); }
  else for (const x of modele(fs.readFileSync(f))) for (const mesh of x.split('<mesh').slice(1)) {
    const V = [...mesh.matchAll(/<vertex[^>]*x="([^"]+)"[^>]*y="([^"]+)"[^>]*z="([^"]+)"/g)].map((m) => [+m[1], +m[2], +m[3]]);
    for (const m of mesh.matchAll(/<triangle[^>]*v1="(\d+)"[^>]*v2="(\d+)"[^>]*v3="(\d+)"/g)) T.push([V[+m[1]], V[+m[2]], V[+m[3]]]); }
  const id = new Map(), P = []; const k = (p) => p.map((c) => Math.round(c * 1000)).join(',');
  const f2 = (a) => { while (P[a] !== a) { P[a] = P[P[a]]; a = P[a]; } return a; };
  const v = (p) => { const kk = k(p); if (!id.has(kk)) { id.set(kk, P.length); P.push(P.length); } return id.get(kk); };
  for (const t of T) { const a = v(t[0]), b = v(t[1]), c = v(t[2]); P[f2(b)] = f2(a); P[f2(c)] = f2(a); }
  const S = new Set(); for (let i = 0; i < P.length; i++) S.add(f2(i));
  console.log(`${path.basename(f)}: brył ${S.size}`);
}
