// Podstawka: wymiary (prostopadłościan otaczający) siatek 3MF wobec oczekiwanych z parametrów SCAD (x, y, z; z od 0).
// Użycie: node podstawka-wymiary.js <katalog 3MF> <parametry.json>. Plik → część: wg słownika PLIK (jak w podstawka-eksport.sh).
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const PLIK = { 'Szuflada v2 - korpus (X1C)': 'Korpus', 'Szuflada v2 - front (X1C)': 'Front', 'Szuflada v2 - raczka': 'Raczka', 'Szuflada v2 - probka gniazda PIR': 'ProbkaPIR',
  'Kaseta elektroniki': 'Kaseta', 'Tuleja z gwintem': 'Tuleja', 'Nakretka': 'Nakretka' };
function modele(buf) {   // pliki .model z archiwum ZIP 3MF (deflate albo bez kompresji)
  const out = []; let i = 0;
  while ((i = buf.indexOf(Buffer.from([0x50, 0x4b, 0x03, 0x04]), i)) >= 0) {
    const met = buf.readUInt16LE(i + 8), rozm = buf.readUInt32LE(i + 18), nl = buf.readUInt16LE(i + 26), el = buf.readUInt16LE(i + 28);
    const nazwa = buf.slice(i + 30, i + 30 + nl).toString(), start = i + 30 + nl + el, dane = buf.slice(start, start + rozm);
    if (nazwa.endsWith('.model')) out.push((met === 8 ? zlib.inflateRawSync(dane) : dane).toString());
    i = start + rozm;
  }
  return out;
}
const [dir, par] = process.argv.slice(2); const ocz = JSON.parse(fs.readFileSync(par, 'utf8')).oczekiwane;
let blad = 0;
for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('.3mf')).sort()) {
  const c = PLIK[f.replace(/\.3mf$/, '')]; if (!c || !ocz[c]) continue;
  const lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9];
  for (const x of modele(fs.readFileSync(path.join(dir, f)))) for (const m of x.matchAll(/<vertex[^>]*x="([^"]+)"[^>]*y="([^"]+)"[^>]*z="([^"]+)"/g))
    for (let k = 0; k < 3; k++) { const v = +m[k + 1]; if (v < lo[k]) lo[k] = v; if (v > hi[k]) hi[k] = v; }
  const w = hi.map((v, k) => v - lo[k]); const ok = w.every((v, k) => Math.abs(v - ocz[c][k]) <= 0.1) && Math.abs(lo[2]) <= 0.05;
  if (!ok) blad++;
  console.log(`${c}: ${w.map((v) => v.toFixed(2)).join(' × ')} (oczekiwane ${ocz[c].map((v) => (+v).toFixed(2)).join(' × ')}) ${ok ? 'OK' : 'BŁĄD'}`);
}
console.log(blad ? `WYMIARY: BŁĄD (${blad})` : 'WYMIARY: OK'); process.exit(blad ? 1 : 0);
