// Wymiary (prostopadłościan otaczający) siatek 3MF i porównanie wysokości z oczekiwaną z parametrów SCAD.
// Użycie: node wymiary_siatki.js <katalog 3MF> [parametry.json]   – bez parametrów wypisuje tylko wymiary.
// Wynik: „<plik>: x × y × z [mm]” i dla części z polem oczekiwane.<Czesc> w parametrach: „wysokość OK/BŁĄD (oczekiwana …)”.
const fs = require('fs'), path = require('path'), zlib = require('zlib');
function modele(buf) { const out = []; for (let i = 0; i < buf.length - 30;) { if (buf.readUInt32LE(i) !== 0x04034b50) { i++; continue; }
  const met = buf.readUInt16LE(i + 8), cs = buf.readUInt32LE(i + 18), nl = buf.readUInt16LE(i + 26), el = buf.readUInt16LE(i + 28);
  const name = buf.slice(i + 30, i + 30 + nl).toString(), st = i + 30 + nl + el;
  if (name.endsWith('.model')) out.push((met === 8 ? zlib.inflateRawSync(buf.slice(st, st + cs)) : buf.slice(st, st + cs)).toString()); i = st + cs; } return out; }
const PLIK = { 'Galka': 'Galka', 'Pierscien': 'Pierscien', 'Uchwyt serw': 'UchwytSerw', 'Maskownica': 'Maskownica' };
const [dir, par] = process.argv.slice(2); const ocz = par ? (JSON.parse(fs.readFileSync(par, 'utf8')).oczekiwane || {}) : {};
let blad = 0;
for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('.3mf')).sort()) {
  const lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9];
  for (const x of modele(fs.readFileSync(path.join(dir, f)))) for (const m of x.matchAll(/<vertex[^>]*x="([^"]+)"[^>]*y="([^"]+)"[^>]*z="([^"]+)"/g))
    for (let k = 0; k < 3; k++) { const v = +m[k + 1]; if (v < lo[k]) lo[k] = v; if (v > hi[k]) hi[k] = v; }
  const w = hi.map((v, k) => v - lo[k]); let txt = `${f}: ${w.map((v) => v.toFixed(2)).join(' × ')} mm`;
  const c = PLIK[f.replace(/\.3mf$/, '')];
  if (c && ocz[c] !== undefined) { const ok = Math.abs(w[2] - ocz[c]) <= 0.05 && Math.abs(lo[2]) <= 0.05; if (!ok) blad++; txt += `; wysokość ${ok ? 'OK' : 'BŁĄD'} (oczekiwana ${ocz[c]}, z od ${lo[2].toFixed(2)})`; }
  console.log(txt);
}
if (blad) { console.log(`WYMIARY: BŁĄD (${blad})`); process.exit(1); } else if (Object.keys(ocz).length) console.log('WYMIARY: OK');
