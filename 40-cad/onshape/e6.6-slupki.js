// E6.6 – słupki stopu powiek na Płycie (plan e6.6-plan-slupki-stopu.md). Wymaga biblioteki G.
// Kroki: SS.zmienne(), potem SS.g() i SS.d(), każdy dwa razy: 1. wywołanie zapisuje płaszczyznę i szkic (kontrola znacznika po zrzucie), 2. operacje bryłowe.
(() => {
const G = window.G, SS = window.SS = window.SS || {}; const d2r = Math.PI / 180;
SS.Fz = SS.Fz || {};
const zap = async (key, f, sk) => { const w = await G.zap(f, sk); SS.Fz[key] = w.featureId; return w; };
const st = (ws) => ws.map((w) => [w.nazwa, w.featureStatus, w.under]);
// przy ukrytej karcie skanuj() zwraca zaślepkę bez podpowiedzi: znacznik przyjmuje się dopiero z odczytu z podpowiedzią (po zrzucie ekranu)
const szkic = async (key, s) => { if (SS.Fz[key]) return null; const w = await zap(key, s.feature(), true); return [w.podpowiedz ? 'szkic – znacznik odczytany' : 'szkic – ZNACZNIK NIESPRAWDZONY: zrzut i ponowny odczyt', st([w]), w.podpowiedz]; };
const plQ = (fid) => `query=qCreatedBy(makeId("${fid}"), EntityType.FACE);`;
const plOff = (name, expr) => G._F('cPlane', name, [G.pq('entities', G.q.std('Right')), G.pe('cPlane', 'cplaneType', 'OFFSET'), G.pn('offset', expr), G.pb('oppositeDirection', true)]);
const PLYTA = 'query=qCreatedBy(makeId("FVJnKf7iXrGXqc0_7"), EntityType.BODY);';   // Płyta: tarcza (wyciągnięcie)
const L = (n, e, d) => ({ name: n, type: 'LENGTH', expression: e, description: d }), A = (n, e, d) => ({ name: n, type: 'ANGLE', expression: e, description: d });
// środek słupka: oś wałka + ρ·(cos b; sin b) + sg·(½ szer. ramienia + a/2)·(−sin b; cos b)
const srodek = (wy, wz, rho, b, W, sg) => { const off = `(#${W} / 2 + #stopA / 2)`, p = sg > 0 ? '-' : '+', q = sg > 0 ? '+' : '-';
  return [`#${wy} + #${rho} * cos(#${b}) ${p} ${off} * sin(#${b})`, `#${wz} + #${rho} * sin(#${b}) ${q} ${off} * cos(#${b})`]; };
const sGz = srodek('walPG_y', 'zSerwPG', 'stopRho', 'stopGz_b', 'ramiePGW', -1), sGo = srodek('walPG_y', 'zSerwPG', 'stopRho', 'stopGo_b', 'ramiePGW', 1);
const sDz = srodek('walPD_y', 'walPD_z', 'stopRhoDz', 'stopDz_b', 'ramiePDW', 1), sDo = srodek('walPD_y', 'walPD_z', 'stopRho', 'stopDo_b', 'ramiePDW', -1);
SS.ZMIANY = { stopRho: '10 mm', stopGz_y: sGz[0], stopGz_z: sGz[1], stopGo_y: sGo[0], stopGo_z: sGo[1], stopDz_y: sDz[0], stopDz_z: sDz[1], stopDo_y: sDo[0], stopDo_z: sDo[1] };
SS.NOWE = [
  L('stopRhoDz', '14 mm', 'słupek stopu D zamknięcia: odległość od osi wałka wzdłuż ramienia (v3.2 pkt 5.2)'),
  L('walPD_z', '-49 mm', 'oś wałka S_PD: z'),
  L('stopZapasX', '0.5 mm', 'słupek stopu za zewnętrzną ścianą ramienia powieki'),
  L('stopGx1', '-18.8 mm', 'słupki stopu G: x początku = wierzch korpusu S_PG'),
  L('stopDx1', '-16.6 mm', 'słupki stopu D: x początku = 0,6 przed korpusem S_X (−15,99)'),
  L('stopPlytkaY0', '10.4 mm', 'płytka słupka G zamknięcia: krawędź ścianki klatki S_PG (y)'),
  L('stopPlytkaZ1', '-40.7 mm', 'płytka słupka G zamknięcia: wierzch klatki S_PG (z)'),
  A('stopLacznikKat', '200 deg', 'łącznik słupka D zamknięcia: kierunek ramienia wspornika, do którego dochodzi'),
  L('stopLacznikZak', '1.5 mm', 'łącznik słupka D zamknięcia: zakładka za środkiem słupka i za osią ramienia wspornika'),
  L('stopGx0', '#walPG_x - #ramiePGT / 2 - #stopZapasX', 'słupki stopu G: x końca'),
  L('stopDx0', '#walPD_x - #ramiePDT / 2 - #stopZapasX', 'słupki stopu D: x końca')];
SS.zmienne = async () => {
  const url = `/api/v12/variables/d/${G.doc.did}/w/${G.doc.wid}/e/${G.doc.vs}/variables`;
  const r0 = await G.req('GET', url); const lista = r0.json[0].variables; const nazwy = new Set(lista.map((x) => x.name));
  const kol = SS.NOWE.filter((x) => nazwy.has(x.name)); if (kol.length) throw new Error('już są: ' + kol.map((k) => k.name));
  const brak = Object.keys(SS.ZMIANY).filter((n) => !nazwy.has(n)); if (brak.length) throw new Error('brak: ' + brak);
  SS.vsPrzed = lista.map((x) => [x.name, x.expression]);
  // nowe przed zmienionymi wzorami nie jest potrzebne: Onshape rozwiązuje odwołania w całej liście
  const baza = lista.map((x) => ({ name: x.name, type: x.type, expression: SS.ZMIANY[x.name] || x.expression, description: x.description || '' }));
  const r1 = await G.req('POST', url, [...baza, ...SS.NOWE]);
  if (!r1.ok) throw new Error('VS ' + r1.status + ' ' + JSON.stringify(r1.json || r1.text).slice(0, 300));
  await G.mvOdswiez(); return { przed: lista.length, po: baza.length + SS.NOWE.length };
};
// wartości startowe (mm) z modelu v3.2 – tylko położenie startowe encji
const a = 6, v = SS.v = {
  Gz: { y: 15.233, z: -48.671, b: 134.69, e: sGz, eb: '#stopGz_b' }, Go: { y: 12.499, z: -70.283, b: 210.89, e: sGo, eb: '#stopGo_b' },
  Dz: { y: -17.699, z: -37.179, b: 30.36, e: sDz, eb: '#stopDz_b' }, Do: { y: -19.464, z: -57.571, b: -19.87, e: sDo, eb: '#stopDo_b' },
  gx1: -18.8, gx0: -32, dx1: -16.6, dx0: -22.5, plY0: 10.4, plZ1: -40.7, tarczaZ1: -68.3, tarczaT: 3, zArm: -35, armH: 4, lacKat: 200, lacZak: 1.5 };
const ab = (e) => `abs(${e})`;
// kwadrat a × a obrócony o b wokół środka; wierzchołek (s1, s2): środek + s1·a/2·(cos b; sin b) + s2·a/2·(−sin b; cos b)
const kwadrat = (s, pre, k) => { const c = v[k], cb = Math.cos(c.b * d2r), sb = Math.sin(c.b * d2r), h = a / 2;
  const pts = [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([s1, s2]) => {
    const u = c.y + s1 * h * cb - s2 * h * sb, w = c.z + s1 * h * sb + s2 * h * cb, z1 = s1 > 0 ? '+' : '-', z2 = s2 > 0 ? '-' : '+', z3 = s2 > 0 ? '+' : '-';
    return [u, w, ab(`${c.e[0]} ${z1} #stopA / 2 * cos(${c.eb}) ${z2} #stopA / 2 * sin(${c.eb})`), ab(`${c.e[1]} ${z1} #stopA / 2 * sin(${c.eb}) ${z3} #stopA / 2 * cos(${c.eb})`)]; });
  return s.poly(pre, pts); };
// prostokąt osiowy [u0, u1] × [w0, w1] z wyrażeniami
const prost = (s, pre, u0, u1, w0, w1, eu0, eu1, ew0, ew1) => s.poly(pre, [[u0, w0, ab(eu0), ab(ew0)], [u1, w0, ab(eu1), ab(ew0)], [u1, w1, ab(eu1), ab(ew1)], [u0, w1, ab(eu0), ab(ew1)]]);
// punkt wewnątrz wielokąta (u, w)
const wPoly = (p, P) => { let r = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [xi, yi] = P[i], [xj, yj] = P[j]; if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) r = !r; } return r; };
const naroza = (k) => { const c = v[k], cb = Math.cos(c.b * d2r), sb = Math.sin(c.b * d2r), h = a / 2; return [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([s1, s2]) => [c.y + s1 * h * cb - s2 * h * sb, c.z + s1 * h * sb + s2 * h * cb]); };
SS.naroza = naroza; SS.wPoly = wPoly;
const zClip = v.tarczaZ1 - v.tarczaT, plY1 = v.Gz.y, plZ0 = v.Gz.z;
// punkty obszarów (u, w): G zamknięcia – część w płytce i poza nią; G otwarcia – nad przycięciem; płytka – poza kwadratem
SS.punktyG = () => { const K = naroza('Gz'), cz = [v.Gz.y, v.Gz.z];
  const wPl = (p) => p[0] > v.plY0 && p[0] < plY1 && p[1] > plZ0 && p[1] < v.plZ1;
  const gzIn = [cz[0] - 0.5, cz[1] + 0.5], gzOut = [cz[0] + 0.5, cz[1] - 0.5], pl = [v.plY0 + 0.3, v.plZ1 - 0.3], go = [v.Go.y, v.Go.z];
  const ok = wPoly(gzIn, K) && wPl(gzIn) && wPoly(gzOut, K) && !wPl(gzOut) && wPl(pl) && !wPoly(pl, K) && go[1] > zClip && wPoly(go, naroza('Go'));
  if (!ok) throw new Error('punkty obszarów G'); return { gzIn, gzOut, pl, go }; };
const X = (x, p) => [x, p[0], p[1]];
SS.g = async () => {
  if (!SS.Fz.plG) await zap('plG', plOff('Płyta: płaszczyzna słupków G', '-#stopGx1'), false);
  const s = new G.Sk('Płyta: słupki stopu G', plQ(SS.Fz.plG));
  kwadrat(s, 'gz', 'Gz'); kwadrat(s, 'go', 'Go');
  prost(s, 'pl', v.plY0, plY1, plZ0, v.plZ1, '#stopPlytkaY0', '#stopGz_y', '#stopGz_z', '#stopPlytkaZ1');
  prost(s, 'cl', v.Go.y - a, v.Go.y + a, zClip - a, zClip, '#stopGo_y - #stopA', '#stopGo_y + #stopA', '#tarczaZ1 - #tarczaT - #stopA', '#tarczaZ1 - #tarczaT');
  const p = await szkic('skG', s); if (p) return p;
  const P = SS.punktyG();
  const e1 = await zap('extG', G.ext('Płyta: słupki stopu G (wyciągnięcie)', G.regs(SS.Fz.skG, [P.gzIn, P.gzOut, P.go].map((q) => X(v.gx1, q))), { op: 'ADD', depth: '#stopGx1 - #stopGx0', scope: [PLYTA] }), false);
  const e2 = await zap('extPl', G.ext('Płyta: płytka słupka G zamknięcia', G.regs(SS.Fz.skG, [X(v.gx1, P.pl)]), { op: 'ADD', depth: '#klatkaT', scope: [PLYTA] }), false);
  return st([e1, e2]);
};
SS.d = async () => {
  if (!SS.Fz.plD) await zap('plD', plOff('Płyta: płaszczyzna słupków D', '-#stopDx1'), false);
  const s = new G.Sk('Płyta: słupki stopu D', plQ(SS.Fz.plD));
  kwadrat(s, 'dz', 'Dz'); kwadrat(s, 'do', 'Do');
  const xm = (v.dx0 + v.dx1) / 2, lY1 = xm * Math.tan(v.lacKat * d2r) + v.lacZak;
  prost(s, 'lc', v.Dz.y - v.lacZak, lY1, v.zArm - v.armH / 2, v.zArm + v.armH / 2, '#stopDz_y - #stopLacznikZak', '(#stopDx0 + #stopDx1) / 2 * tan(#stopLacznikKat) + #stopLacznikZak', '#zArmWsp - #ramieWspH / 2', '#zArmWsp + #ramieWspH / 2');
  prost(s, 'fl', v.Do.y - a / 2, v.Do.y + a / 2, v.tarczaZ1, v.Do.z, '#stopDo_y - #stopA / 2', '#stopDo_y + #stopA / 2', '#tarczaZ1', '#stopDo_z');
  const p = await szkic('skD', s); if (p) return p;
  const wsz = `query=qSketchRegion(makeId("${SS.Fz.skD}"), false);`;
  const e3 = await zap('extD', G.ext('Płyta: słupki stopu D (wyciągnięcie)', [wsz], { op: 'ADD', depth: '#stopDx1 - #stopDx0', scope: [PLYTA] }), false);
  return st([e3]);
};
return 'SS ok';
})();
