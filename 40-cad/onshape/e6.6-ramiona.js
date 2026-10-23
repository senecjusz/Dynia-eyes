// E6.6 – Ramiona X/Y (plan e6.6-plan-ramiona-prety.md, zatwierdzony b774b5e). Wymaga biblioteki G (localStorage G_lib_e66).
(() => {
const G = window.G, R = window.R = window.R || {}; const d2r = Math.PI / 180;
R.Fz = R.Fz || {};
const zap = async (key, f, sk) => { const w = await G.zap(f, sk); R.Fz[key] = w.featureId; return w; };
const st = (ws) => ws.map((w) => [w.nazwa, w.featureStatus, w.under]);
const plOff = (name, expr, opp) => G._F('cPlane', name, [G.pq('entities', G.q.std('Right')), G.pe('cPlane', 'cplaneType', 'OFFSET'), G.pn('offset', expr), G.pb('oppositeDirection', !!opp)]);
const plQ = (fid) => `query=qCreatedBy(makeId("${fid}"), EntityType.FACE);`;
const L = (n, e, d) => [n, 'LENGTH', e, d], A = (n, e, d) => [n, 'ANGLE', e, d];
R.ZMIANY = { orczykX: '14.7 mm', orczykY: '15.4 mm' };
R.NOWE = [
  L('ramieXYW', '8 mm', 'Ramię X/Y: szerokość'), L('ramieHubR', '7 mm', 'Ramię X/Y: piasta R'), L('ramieWKoniec', '6 mm', 'Ramię X/Y: szerokość końca (K9 v3.2)'),
  L('ramieLKoniec', '10 mm', 'Ramię X/Y: długość zwężonego końca przed A'), L('ramieKoniecDod', '4 mm', 'Ramię X/Y: wysięg za A'),
  L('ramieXYKieszenGl', '1.15 mm', 'Ramię X/Y: głębokość kieszeni orczyka [Z – przymierzyć]'), L('hPrzegubu', '7 mm', 'środek krzyżaka orczyka nad wierzchem Ramienia (wzdłuż d)'),
  L('ramieWglabWid', '2 mm', 'widełki orczyka: wejście bryły w Ramię'),
  L('ramieXHx', '30.007 mm', 'H przegubu orczyka X w zerze (kinematyka v3.2)'), L('ramieXHy', '1.689 mm', ''), L('ramieXHz', '-48.714 mm', ''),
  L('ramieYHx', '21.828 mm', 'H przegubu orczyka Y w zerze'), L('ramieYHy', '18.487 mm', ''), L('ramieYHz', '-46.666 mm', ''),
  A('katA1X', '-11.57 deg', 'obrót widełek orczyka X wokół osi ∥ y przez H (a1 od +x ku +z 11,57°)'), A('katA1Y', '-28.19 deg', 'jw. Y (28,19°)'),
  A('katWidOrczX', '-170.22 deg', 'kierunek widełek orczyka X w płaszczyźnie ⊥ a1 (przed obrotem), od +z ku −y'), A('katWidOrczY', '-178.12 deg', 'jw. Y'),
  L('sworzenLOrczA1', '12 mm', 'sworzeń a1 przy orczyku: DIN 7985 M2×12 przelotowy (gwint w policzku bliższym)')];
R.zmienne = async () => {
  const url = `/api/v12/variables/d/${G.doc.did}/w/${G.doc.wid}/e/${G.doc.vs}/variables`;
  const r0 = await G.req('GET', url); const lista = r0.json[0].variables; const nazwy = new Set(lista.map((x) => x.name));
  const kol = R.NOWE.filter(([n]) => nazwy.has(n)); if (kol.length) throw new Error('już są: ' + kol.map((k) => k[0]));
  const baza = lista.map((x) => ({ name: x.name, type: x.type, expression: R.ZMIANY[x.name] || x.expression, description: x.description || '' }));
  const r1 = await G.req('POST', url, [...baza, ...R.NOWE.map(([name, type, expression, description]) => ({ name, type, expression, description }))]);
  if (!r1.ok) throw new Error('VS ' + r1.status + ' ' + JSON.stringify(r1.json || r1.text).slice(0, 300));
  await G.mvOdswiez(); return baza.length + R.NOWE.length;
};
// obrys widełek w płaszczyźnie (u, v): łuk R rS wokół P po stronie −m, boki styczne do t = tEnd, linia końca; opcjonalnie okrąg Ø m2Gwint w P
R.obrys = (s, pre, P, eP, beta, eB, rS, eRS, tEnd, eT, zOtw) => {
  const sb = Math.sin(beta * d2r), cb = Math.cos(beta * d2r);
  const Q = (t, sg) => { const u = P[0] + t * sb + sg * rS * cb, w = P[1] + t * cb - sg * rS * sb, ss = sg > 0 ? '+' : '-', sm = sg > 0 ? '-' : '+';
    return [u, w, `abs(${eP[0]} + ${eT} * sin(${eB}) ${ss} ${eRS} * cos(${eB}))`, `abs(${eP[1]} + ${eT} * cos(${eB}) ${sm} ${eRS} * sin(${eB}))`]; };
  const wA = -beta, A0 = [P[0] - rS * cb, P[1] + rS * sb], A1 = [P[0] + rS * cb, P[1] - rS * sb], Ep = Q(tEnd, 1), Em = Q(tEnd, -1);
  s.arc(pre + 'a', P, rS, wA + 180, wA + 360); s.line(pre + '1', A1, [Ep[0], Ep[1]]); s.line(pre + '2', [Ep[0], Ep[1]], [Em[0], Em[1]]); s.line(pre + '3', [Em[0], Em[1]], A0);
  s.co(pre + 'a.end', pre + '1.start'); s.co(pre + '1.end', pre + '2.start'); s.co(pre + '2.end', pre + '3.start'); s.co(pre + '3.end', pre + 'a.start');
  s.dx(pre + 'a.center', `abs(${eP[0]})`); s.dy(pre + 'a.center', `abs(${eP[1]})`); s.ra(pre + 'a', eRS);
  s.dx(pre + '1.end', Ep[2]); s.dy(pre + '1.end', Ep[3]); s.dx(pre + '2.end', Em[2]); s.dy(pre + '2.end', Em[3]);
  s.con('TANGENT', [G.pstr('localFirst', pre + '1'), G.pstr('localSecond', pre + 'a')]); s.con('TANGENT', [G.pstr('localFirst', pre + '3'), G.pstr('localSecond', pre + 'a')]);
  if (zOtw) { const c = s.circle(pre + 'p', P, 1.6); s.co(c + '.center', pre + 'a.center'); s.con('DIAMETER', [G.pstr('localFirst', c), G.pn('length', '#m2Gwint')]); }
  return [P[0] + sb * 3.5, P[1] + cb * 3.5];
};
// dane Ramion (wartości startowe; geometria z wyrażeń)
R.D = {
  X: { nm: 'X', Cx: 23.013, Cy: -13, Cz: -49, r: 14.7, H: [30.007, 1.689, -48.714], beta: -170.22, eCx: '#ramieXC', eCy: '#walX_y', er: '#orczykX', eH: ['#ramieXHx', '#ramieXHy', '#ramieXHz'], eB: '#katWidOrczX', eA1: '#katA1X' },
  Y: { nm: 'Y', Cx: 15.229, Cy: 3, Cz: -49, r: 15.4, H: [21.828, 18.487, -46.666], beta: -178.12, eCx: '#ramieYC', eCy: '#walY_y', er: '#orczykY', eH: ['#ramieYHx', '#ramieYHy', '#ramieYHz'], eB: '#katWidOrczY', eA1: '#katA1Y' } };
const T = 6, W = 8, WK = 6, Lk = 10, Kd = 4, HubR = 7;
R.ramie = async (k) => {
  const D = R.D[k], N = 'Ramię ' + D.nm, out = [];
  const Ay = D.Cy + D.r, eAy = `${D.eCy} + ${D.er}`;
  // płytka (jeden obszar: łuk piasty + łamana płytki ze zwężonym końcem)
  out.push(await zap(k + 'plS', plOff(N + ': płaszczyzna spodu', `${D.eCx} - #ramieGr`), false));
  const s = new G.Sk(N + ': obrys', plQ(R.Fz[k + 'plS']));
  const hz = Math.sqrt(HubR * HubR - (W / 2) ** 2), aS = Math.asin((W / 2) / HubR) / d2r;
  const pts = [[Ay - Lk, D.Cz + W / 2, `abs(${eAy} - #ramieLKoniec)`, 'abs(#zSerw + #ramieXYW / 2)'], [Ay - Lk, D.Cz + WK / 2, `abs(${eAy} - #ramieLKoniec)`, 'abs(#zSerw + #ramieWKoniec / 2)'],
    [Ay + Kd, D.Cz + WK / 2, `abs(${eAy} + #ramieKoniecDod)`, 'abs(#zSerw + #ramieWKoniec / 2)'], [Ay + Kd, D.Cz - WK / 2, `abs(${eAy} + #ramieKoniecDod)`, 'abs(#zSerw - #ramieWKoniec / 2)'],
    [Ay - Lk, D.Cz - WK / 2, `abs(${eAy} - #ramieLKoniec)`, 'abs(#zSerw - #ramieWKoniec / 2)'], [Ay - Lk, D.Cz - W / 2, `abs(${eAy} - #ramieLKoniec)`, 'abs(#zSerw - #ramieXYW / 2)']];
  const S0 = [D.Cy + hz, D.Cz + W / 2], E0 = [D.Cy + hz, D.Cz - W / 2];
  s.arc('pa', [D.Cy, D.Cz], HubR, aS, 360 - aS);
  const seq = [S0, ...pts.map((p) => [p[0], p[1]]), E0];
  for (let i = 0; i < seq.length - 1; i++) s.line('pl' + i, seq[i], seq[i + 1]);
  s.co('pa.start', 'pl0.start'); for (let i = 0; i < seq.length - 2; i++) s.co('pl' + i + '.end', 'pl' + (i + 1) + '.start'); s.co('pl' + (seq.length - 2) + '.end', 'pa.end');
  s.dx('pa.center', `abs(${D.eCy})`); s.dy('pa.center', 'abs(#zSerw)'); s.ra('pa', '#ramieHubR');
  pts.forEach((p, i) => { s.dx('pl' + i + '.end', p[2]); s.dy('pl' + i + '.end', p[3]); });
  s.dy('pl0.start', 'abs(#zSerw + #ramieXYW / 2)'); s.dy('pl' + (seq.length - 2) + '.end', 'abs(#zSerw - #ramieXYW / 2)');
  out.push(await zap(k + 'skO', s.feature(), true));
  const x0 = D.Cx - T;
  out.push(await zap(k + 'plyt', G.ext(N + ': płytka', G.regs(R.Fz[k + 'skO'], [[x0, D.Cy + D.r / 2, D.Cz]]), { op: 'NEW', depth: '#ramieGr' }), false));
  const RB = G.q.body(R.Fz[k + 'plyt']);
  // kieszeń orczyka (od spodu): piasta orczyka + trapez wzdłuż +y (pod płytką)
  const sk = new G.Sk(N + ': kieszeń orczyka', plQ(R.Fz[k + 'plS']));
  const c = sk.circle('op', [D.Cy, D.Cz], 7.3); sk.dx('op.center', `abs(${D.eCy})`); sk.dy('op.center', 'abs(#zSerw)'); sk.con('DIAMETER', [G.pstr('localFirst', c), G.pn('length', '#orczykPiastaD + 2 * #luzOrczyka')]);
  const yE = D.Cy + 17.65;
  sk.poly('ot', [[D.Cy, D.Cz + 3.15, `abs(${D.eCy})`, 'abs(#zSerw + #orczykSzerP / 2 + #luzOrczyka)'], [yE, D.Cz + 2.15, `abs(${D.eCy} + #orczykL + #luzOrczyka)`, 'abs(#zSerw + #orczykSzerK / 2 + #luzOrczyka)'],
    [yE, D.Cz - 2.15, `abs(${D.eCy} + #orczykL + #luzOrczyka)`, 'abs(#zSerw - #orczykSzerK / 2 - #luzOrczyka)'], [D.Cy, D.Cz - 3.15, `abs(${D.eCy})`, 'abs(#zSerw - #orczykSzerP / 2 - #luzOrczyka)']]);
  out.push(await zap(k + 'skK', sk.feature(), true));
  out.push(await zap(k + 'kiesz', G.ext(N + ': kieszeń orczyka (wycięcie)', G.regs(R.Fz[k + 'skK'], [[x0, D.Cy - 2, D.Cz], [x0, D.Cy + 1.5, D.Cz], [x0, D.Cy + 10, D.Cz]]), { op: 'REMOVE', depth: '#ramieXYKieszenGl', scope: [RB] }), false));
  // otwory M2: środkowy z pogłębieniem, dwa przez orczyk
  out.push(await zap(k + 'plW', plOff(N + ': płaszczyzna wierzchu', D.eCx), false));
  const sp = new G.Sk(N + ': punkty otworów', plQ(R.Fz[k + 'plW']));
  sp.point('o0', [D.Cy, D.Cz]); sp.dx('o0', `abs(${D.eCy})`); sp.dy('o0', 'abs(#zSerw)');
  sp.point('o1', [D.Cy + 7.5, D.Cz]); sp.dx('o1', `abs(${D.eCy} + #orczykOtw1)`); sp.dy('o1', 'abs(#zSerw)');
  sp.point('o2', [D.Cy + 11.5, D.Cz]); sp.dx('o2', `abs(${D.eCy} + #orczykOtw2)`); sp.dy('o2', 'abs(#zSerw)');
  out.push(await zap(k + 'skP', sp.feature(), true));
  const vtx = (id) => `query=sketchEntityQuery(makeId("${R.Fz[k + 'skP']}"), EntityType.VERTEX, "${id}");`;
  out.push(await zap(k + 'h0', G._F('hole', N + ': otwór wkrętu środkowego', [G.pe('hole', 'style', 'C_BORE'), G.pq('locations', vtx('o0')), G.pq('scope', RB), G.pe('hole', 'endStyle', 'THROUGH'),
    G.pn('holeDiameter', '#m2Luzny'), G.pn('cBoreDiameter', '#m2LebD'), G.pn('cBoreDepth', '#m2LebGl'), G.pb('oppositeDirection', false)]), false));
  out.push(await zap(k + 'h1', G._F('hole', N + ': otwory M2 orczyka', [G.pe('hole', 'style', 'SIMPLE'), G.pq('locations', vtx('o1'), vtx('o2')), G.pq('scope', RB), G.pe('hole', 'endStyle', 'THROUGH'),
    G.pn('holeDiameter', '#m2Luzny'), G.pb('oppositeDirection', false)]), false));
  // widełki orczyka w układzie a1 = +x
  const ho = 6.125, h = 7, wg = 2, xm = D.H[0] + (ho - h - wg) / 2;
  out.push(await zap(k + 'plWm', plOff(N + ': płaszczyzna widełek', `${D.eH[0]} + (#uOrcz_ho - #hPrzegubu - #ramieWglabWid) / 2`), false));
  const sw = new G.Sk(N + ': widełki orczyka', plQ(R.Fz[k + 'plWm']));
  const pA = R.obrys(sw, 'wa', [D.H[1], D.H[2]], [D.eH[1], D.eH[2]], D.beta, D.eB, 2.6, '#uOrcz_rS', 9.75, '(#uOrcz_cS + #uOrcz_pS)', true);
  out.push(await zap(k + 'skWa', sw.feature(), true));
  out.push(await zap(k + 'wid', G.ext(N + ': widełki orczyka (bryła)', G.regs(R.Fz[k + 'skWa'], [[xm, pA[0], pA[1]]]), { op: 'NEW', depth: '#hPrzegubu + #ramieWglabWid + #uOrcz_ho', sym: true }), false));
  const WB = G.q.body(R.Fz[k + 'wid']);
  out.push(await zap(k + 'plH', plOff(N + ': płaszczyzna środka przegubu', D.eH[0]), false));
  const sg = new G.Sk(N + ': szczelina widełek orczyka', plQ(R.Fz[k + 'plH']));
  const pB = R.obrys(sg, 'wb', [D.H[1], D.H[2]], [D.eH[1], D.eH[2]], D.beta, D.eB, 2.6, '#uOrcz_rS', 8.25, '#uOrcz_cS', false);
  sg.line('osA', [D.H[1] + 3.6, D.H[2]], [D.H[1] + 6.6, D.H[2]]); sg.dx('osA.start', `abs(${D.eH[1]} + #uOrcz_rS + #ramieWglabWid / 2)`); sg.dy('osA.start', `abs(${D.eH[2]})`);
  sg.dx('osA.end', `abs(${D.eH[1]} + #uOrcz_rS + #ramieWglabWid * 2)`); sg.dy('osA.end', `abs(${D.eH[2]})`);
  out.push(await zap(k + 'skWb', sg.feature(), true));
  out.push(await zap(k + 'szcz', G.ext(N + ': widełki orczyka (szczelina)', G.regs(R.Fz[k + 'skWb'], [[D.H[0], pB[0], pB[1]]]), { op: 'REMOVE', depth: '2 * #uOrcz_hi', sym: true, scope: [WB] }), false));
  out.push(await zap(k + 'obr', G._F('transform', N + ': widełki orczyka (obrót do a1)', [G.pe('transform', 'transformType', 'ROTATION'), G.pq('entities', WB), G.pq('transformAxis', G.q.edge(R.Fz[k + 'skWb'], 'osA')),
    G.pn('angle', D.eA1), G.pb('oppositeDirection', false), G.pb('makeCopy', false)]), false));
  out.push(await zap(k + 'scal', G._F('booleanBodies', N + ': scalenie', [G.pe('booleanBodies', 'operationType', 'UNION'), G.pq('tools', RB, WB)]), false));
  return st(out);
};
return 'R ok';
})();
