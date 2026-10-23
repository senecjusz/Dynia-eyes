// E6.6 – Uchwyt i Łapy Uchwytu (plan e6.6-plan-uchwyt.md, „Plan do zapisu”). Wymaga e6.6-build.js i e6.6-p4.js (P4.v).
(() => {
const G = window.G, U = window.U = window.U || {};
const d2r = Math.PI / 180;
// wartości startowe (mm, deg) – tylko położenia startowe encji
G.Sk.prototype.point = function (id, p) { this.e.push({ btType: 'BTMSketchPoint-158', entityId: id, isConstruction: false, x: p[0] / 1000, y: p[1] / 1000 }); return id; };
const v = U.v = {
  pktR: 21.25, pktRY: 20, pktZ: -6, kX: -11.59, kY: -28.23, wsporKat: 46, wsporA: 4, wsporWglab: 1,
  oknoZ: -6, plytaT: 3, Rout: 26.6, krok: 5,
  okno: [12.66, 12.71, 12.86, 13.12, 13.47, 13.75, 13.92, 13.97, 13.90, 13.72, 13.42, 13.04, 12.58, 12.07, 11.53, 11.06, 10.74, 10.55, 10.49],
  plW: { m15: 15.07, m10: 14.89, m5: 14.82, 0: 14.82, 5: 14.82, 10: 14.88, 15: 15.06, 55: 15.45, 60: 15.29, 65: 15.26, 70: 15.26, 75: 15.28, 80: 15.42, 85: 15.64, 90: 15.89, 95: 15.89, 100: 16.22, 105: 16.40, 110: 16.76 },
  zbW: { m175: 19.22, m15: 15.07, m125: 14.97, m10: 14.89, m75: 14.79, m5: 14.62, m25: 14.54, 0: 14.54, 25: 14.54, 5: 14.62, 75: 14.79, 10: 14.88, 125: 14.96, 15: 15.06, 175: 19.21 },
  zebroZ1: -2, tZ0: 7, tZ1: 12.75, tZ2: 22.75, tR: 7.65, tRin: 5.8, m5PoglD: 10.4, m5L: 5.3, nakrS: 8.2, nakrH: 4.1, nakrZ0: 12.95,
  m4Z: 9.1, m4D: 4.2, lacKat: 135, lacD: 4, lacR0: 15.5, lacR1: 9.2,
  nadlewR: 23.5, nadlewD: 7, nadlewKat1: 210, kieszLuz: 0.3, nadlewZ1: -6.68, nadlewZ2: -12.68,
  lapaR0: 20, lapaR1: 25, lapaT: 2, lapaZebroW: 5, lapaLuz: 0.3, m3PoglD: 6.3, lapaOtwGl: 6.6,
  // przegub gałki (po korekcie)
  gDo: 5.75, gLuz: 0.125, gPol: 2, grS: 1.9, gcS: 7, gpS: 2, m2Gwint: 1.6, m3Luzny: 3.3, m3Ciasny: 2.6
};
v.gHi = v.gDo / 2 + v.gLuz; v.gHo = v.gHi + v.gPol;

// ---------- zmienne ----------
U.ZMIANY = { pktR: '21.25 mm', okno_r0: '12.66 mm', okno_r5: '12.71 mm', okno_r10: '12.86 mm', okno_r15: '13.12 mm', okno_r20: '13.47 mm', okno_r25: '13.75 mm',
  okno_r30: '13.92 mm', okno_r35: '13.97 mm', okno_r40: '13.90 mm', okno_r45: '13.72 mm', okno_r50: '13.42 mm', okno_r55: '13.04 mm', okno_r60: '12.58 mm',
  okno_r65: '12.07 mm', okno_r70: '11.53 mm', okno_r75: '11.06 mm', okno_r80: '10.74 mm', okno_r85: '10.55 mm', okno_r90: '10.49 mm' };
const L = (n, e, d) => [n, 'LENGTH', e, d], A = (n, e, d) => [n, 'ANGLE', e, d];
U.NOWE = [
  L('pktRY', '20 mm', 'środek krzyżaka Y przy gałce: y'),
  A('widelkiXKat', '-11.59 deg', 'oś m widełek stałych X od +z ku −x (a1 = −y)'), A('widelkiYKat', '-28.23 deg', 'oś m widełek stałych Y od +z ku −x'),
  A('wsporKat', '46 deg', 'wsporniki widełek: nachylenie do poziomu (druk bez podpór)'), L('wsporA', '4 mm', 'wspornik: przekrój'), L('wsporWglab', '1 mm', 'wspornik: wejście w ścianę tulei'),
  L('plytaRout', '26.6 mm', 'płyta okna: R zewnętrzny'), A('oknoKrok', '5 deg', 'krok węzłów okna i płyty'),
  ...Object.entries(v.plW).map(([k, r]) => L('plytaW' + k, r + ' mm', 'płyta okna: węzeł wycięcia φ ' + k.replace('m', '−'))),
  ...Object.entries(v.zbW).map(([k, r]) => L('zebroW' + k, r + ' mm', 'żebro mostka X: węzeł zewnętrzny (min z płytą) φ ' + k.replace('m', '−').replace(/(\d)5$/, '$1,5'))),
  L('zebroZ1', '-2 mm', 'żebro mostka X: wierzch'), A('zebroKrok', '2.5 deg', 'krok węzłów żebra'),
  L('tulejaPrzodZ0', '7 mm', 'tuleja przednia Uchwytu: początek'), L('tulejaPrzodZ2', v.tZ2 + ' mm', 'tuleja przednia: wierzch zamknięcia'),
  L('m5PoglD', '10.4 mm', 'gniazdo DIN 7991 M5'), L('nakrPrzodZ0', '12.95 mm', 'kieszeń nakrętki M5 w zamknięciu tulei: spód'), L('nakrLuzH', '0.1 mm', 'kieszeń nakrętki: luz wysokości'),
  A('lacznikKat1', '135 deg', 'łącznik Uchwytu: pierwszy kąt'), A('lacznikKrok', '90 deg', 'łączniki co 90°'), L('lacznikUchD', '4 mm', 'łącznik Uchwytu: średnica'),
  L('lacznikR0', '15.5 mm', 'łącznik: R przy płycie'), L('lacznikR1', '9.2 mm', 'łącznik: R przy tulei'),
  L('kieszenNadlewuLuz', '0.3 mm', 'kieszeń nad nadlewem: luz'),
  L('lapaR0', '20 mm', 'łapa: R wewn.'), L('lapaR1', '25 mm', 'łapa: R zewn.'), L('lapaT', '2 mm', 'łapa: grubość płytki'), L('lapaZebroW', '5 mm', 'łapa: żeberko stycznie'),
  L('lapaLuz', '0.3 mm', 'łapa: luz żeberko – nadlew'), L('oknoStrzalka', '0.02 mm', 'okno jako łamana: dodatek na strzałkę cięciwy (spline bez wymiarowania punktów w API)'),
  L('kanalNakrL', '10 mm', 'kanał nakrętki M5 tulei: od osi w −x'), L('m3PoglD', '6.3 mm', 'pogłębienie DIN 7991 M3'), L('lapaOtwGl', '6.6 mm', 'łapa: otwór Ø2,6 w żeberku')];
U.POCHODNE = [
  L('kieszenNadlewuD', '#nadlewD + 2 * #kieszenNadlewuLuz', 'kieszeń nad nadlewem: Ø'), L('tulejaPrzodR', '#slupekR', 'tuleja przednia Uchwytu: R zewn. (= Słupek)'),
  L('kieszenNadlewuGl', '#nadlewZ1 - (#oknoZ - #plytaOknaT / 2) + #kieszenNadlewuLuz', 'kieszeń nad nadlewem: głębokość od spodu płyty'),
  L('lapaT1', '#nadlewD / 2 + #lapaLuz + #lapaZebroW', 'łapa: koniec stycznie (strona φ 270°)')];
U.zmienne = async () => {
  const url = `/api/v12/variables/d/${G.doc.did}/w/${G.doc.wid}/e/${G.doc.vs}/variables`;
  const r0 = await G.req('GET', url); const lista = r0.json[0].variables;
  const nazwy = new Set(lista.map((x) => x.name)); const kol = [...U.NOWE, ...U.POCHODNE].filter(([n]) => nazwy.has(n)); if (kol.length) throw new Error('już są: ' + kol.map((k) => k[0]));
  const brak = Object.keys(U.ZMIANY).filter((n) => !nazwy.has(n)); if (brak.length) throw new Error('brak do zmiany: ' + brak);
  const baza = lista.map((x) => ({ name: x.name, type: x.type, expression: U.ZMIANY[x.name] || x.expression, description: x.description || '' }));
  const nowe = U.NOWE.map(([name, type, expression, description]) => ({ name, type, expression, description }));
  const licz = { tulejaPrzodR: '7.65 mm', kieszenNadlewuD: '7.6 mm', kieszenNadlewuGl: '1.12 mm', lapaT1: '8.8 mm' };
  const r1 = await G.req('POST', url, [...baza, ...nowe, ...U.POCHODNE.map(([name, type, , description]) => ({ name, type, expression: licz[name], description }))]);
  if (!r1.ok) throw new Error('VS 1: ' + r1.status + ' ' + JSON.stringify(r1.json || r1.text).slice(0, 300));
  const r2 = await G.req('POST', url, [...baza, ...nowe, ...U.POCHODNE.map(([name, type, expression, description]) => ({ name, type, expression, description }))]);
  if (!r2.ok) throw new Error('VS 2: ' + r2.status + ' ' + JSON.stringify(r2.json || r2.text).slice(0, 300));
  await G.mvOdswiez(); return { przed: lista.length, po: baza.length + nowe.length + U.POCHODNE.length };
};

// ---------- pomocnicze ----------
const TOP = G.q.std('Top'), FRONT = G.q.std('Front'), RIGHT = G.q.std('Right');
const plQ = (fid) => `query=qCreatedBy(makeId("${fid}"), EntityType.FACE);`;
const cel = (fid, p) => `query=qContainsPoint(qCreatedBy(makeId("${fid}"), EntityType.BODY), vector(${p.map((a) => a / 1000).join(', ')}) * meter);`;
// punkt biegunowy: [u, v, exU, exV] z wyrażeniem promienia eR i kąta eK (stopnie fi do położenia startowego)
const bieg = (r, fi, eR, eK) => [r * Math.cos(fi * d2r), r * Math.sin(fi * d2r), `abs(${eR} * cos(${eK}))`, `abs(${eR} * sin(${eK}))`];
const okR = (fi) => { let f = ((fi % 360) + 360) % 360; if (f > 180) f = 360 - f; if (f > 90) f = 180 - f; return '#okno_r' + Math.round(f); };
const okV = (fi) => { let f = ((fi % 360) + 360) % 360; if (f > 180) f = 360 - f; if (f > 90) f = 180 - f; return v.okno[Math.round(f) / 5]; };
U.okno = (pre, strz) => Array.from({ length: 72 }, (_, k) => { const fi = 5 * k, r = okV(fi) + (strz ? 0.02 : 0), eR = strz ? `(${okR(fi)} + #oknoStrzalka)` : okR(fi);
  return bieg(r, fi, eR, k === 0 ? '0 deg' : `${k} * #oknoKrok`); });
const nazwaW = (f) => (f < 0 ? 'm' : '') + Math.abs(f);
// kontur płyty: φ od −20 do 340 (łuk R26,6 poza wycięciami), węzły wycięć jako łamana
U.konturPlyty = (s) => {
  const wezly = []; // [fi, r, eR]
  const dodaj = (f) => { const k = nazwaW(f); wezly.push([f, v.plW[k], '#plytaW' + k]); };
  [-15, -10, -5, 0, 5, 10, 15].forEach(dodaj); [55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110].forEach(dodaj);
  // segmenty: łuk 115→340 (−20), łamana −20…20, łuk 20→50, łamana 50…115
  const P = (f, r, eR) => bieg(r, f, eR, `${Math.round(f / 5)} * #oknoKrok`);
  const sekw = [[-20, v.Rout, '#plytaRout'], ...wezly.slice(0, 7), [20, v.Rout, '#plytaRout'], [50, v.Rout, '#plytaRout'], ...wezly.slice(7), [115, v.Rout, '#plytaRout']];
  const pp = sekw.map(([f, r, eR]) => P(f, r, eR));
  const lin = (a, b, id) => { s.line(id, [pp[a][0], pp[a][1]], [pp[b][0], pp[b][1]]); return id; };
  // łamana 1: indeksy 0..8 (−20 … 20), łuk 20→50, łamana 9..22 (50 … 115), łuk 115 → 340
  const L1 = []; for (let i = 0; i < 8; i++) L1.push(lin(i, i + 1, 'pk' + i));
  s.arc('pa1', [0, 0], v.Rout, 20, 50);
  const L2 = []; for (let i = 9; i < pp.length - 1; i++) L2.push(lin(i, i + 1, 'pk' + i));
  s.arc('pa2', [0, 0], v.Rout, 115, 340);
  for (let i = 0; i < L1.length - 1; i++) s.co(L1[i] + '.end', L1[i + 1] + '.start');
  for (let i = 0; i < L2.length - 1; i++) s.co(L2[i] + '.end', L2[i + 1] + '.start');
  s.co(L1[L1.length - 1] + '.end', 'pa1.start'); s.co('pa1.end', L2[0] + '.start'); s.co(L2[L2.length - 1] + '.end', 'pa2.start'); s.co('pa2.end', L1[0] + '.start');
  // wymiary: wierzchołki łamanych (u, v); węzły na łukach (−20, 20, 50, 115) tylko u – drugą współrzędną daje łuk R26,6
  const wym = (id, p, tylkoU) => { s.dx(id, p[2]); if (!tylkoU) s.dy(id, p[3]); };
  const last = pp.length - 1;
  L1.forEach((id, i) => wym(id + '.start', pp[i], i === 0)); wym(L1[L1.length - 1] + '.end', pp[8], true);
  L2.forEach((id, i) => wym(id + '.start', pp[9 + i], i === 0)); wym(L2[L2.length - 1] + '.end', pp[last], true);
  ['pa1', 'pa2'].forEach((a) => { s.con('COINCIDENT', [G.pstr('localFirst', a + '.center'), G.pq('externalSecond', G.q.origin)]); s.ra(a, '#plytaRout'); });
  return { L1, L2 };
};

// ---------- kroki ----------
const W = (u, w) => G.q.reg; // (zarezerwowane)
const top = (u, w, z) => [u, w, z || 0], front = (u, w) => [u, 0, w];
const zz = (z) => z;   // z płaszczyzny poziomej: punkt obszaru w świecie
U.Fz = {};             // featureId po nazwie skrótu
const zap = async (key, f, sk) => { const w = await G.zap(f, sk); U.Fz[key] = w.featureId; return w; };
const st = (ws) => ws.map((w) => [w.nazwa, w.featureStatus, w.under]);
const plOff = (name, base, expr, opp) => G._F('cPlane', name, [G.pq('entities', base), G.pe('cPlane', 'cplaneType', 'OFFSET'), G.pn('offset', expr), G.pb('oppositeDirection', !!opp)]);
// ciało Uchwytu: zawiera punkt płyty (13,7; 0; −6) – odporne na scalanie brył
const BU = () => 'query=qContainsPoint(qBodyType(qEverything(EntityType.BODY), BodyType.SOLID), vector(0.0137, 0, -0.006) * meter);';

// krok 1: płaszczyzna płyty, szkic płyty (kontur, okno, kieszenie, otwory M3 łap), płyta, kieszenie
U.krok1 = async () => {
  const w1 = await zap('plPlyty', plOff('Uchwyt: płaszczyzna płyty', TOP, '-(#oknoZ - #plytaOknaT / 2)', true), false);
  const s = new G.Sk('Uchwyt: płyta', plQ(U.Fz.plPlyty));
  U.konturPlyty(s);
  s.poly('ok', U.okno('ok', true));
  const okr = (id, r, fi, eR, eK, d, eD) => { const c = s.circle(id, [r * Math.cos(fi * d2r), r * Math.sin(fi * d2r)], d); s.dx(c + '.center', `abs(${eR} * cos(${eK}))`); s.dy(c + '.center', `abs(${eR} * sin(${eK}))`);
    s.con('DIAMETER', [G.pstr('localFirst', c), G.pn('length', eD)]); return c; };
  okr('kn1', v.nadlewR, v.nadlewKat1, '#nadlewR', '#nadlewKat1', 7.6, '#kieszenNadlewuD');
  okr('kn2', v.nadlewR, 360 - v.nadlewKat1, '#nadlewR', '#nadlewKat2', 7.6, '#kieszenNadlewuD');
  const zw = await zap('skPlyta', s.feature(), true);
  const z0 = v.oknoZ - v.plytaT / 2, zr = (v.okno[0] + 14.82) / 2;
  const nk = (fi) => [v.nadlewR * Math.cos(fi * d2r), v.nadlewR * Math.sin(fi * d2r), z0];
  const e1 = await zap('plyta', G.ext('Uchwyt: płyta (wyciągnięcie)', G.regs(U.Fz.skPlyta, [[zr, 0, z0], nk(v.nadlewKat1), nk(360 - v.nadlewKat1)]), { op: 'NEW', depth: '#plytaOknaT' }), false);
  const e2 = await zap('kieszenie', G.ext('Uchwyt: kieszenie nad nadlewami', G.regs(U.Fz.skPlyta, [nk(v.nadlewKat1), nk(360 - v.nadlewKat1)]), { op: 'REMOVE', depth: '#kieszenNadlewuGl', scope: [BU()] }), false);
  return st([w1, zw, e1, e2]);
};

// krok 2: żebro (płaszczyzna z −4,5) + punkty otworów M3 łap; Hole C_SINK z wierzchu płyty
const zebroPts = () => {
  const out = [];
  for (let k = 7; k >= -7; k--) { const f = 2.5 * k, key = (k < 0 ? 'm' : '') + String(Math.abs(f)).replace('.', ''); out.push(bieg(v.zbW[key], f, '#zebroW' + key, k === 0 ? '0 deg' : `${k} * #zebroKrok`)); }
  for (let m = -3; m <= 3; m++) { const f = 5 * m; out.push(bieg(okV(f) + 0.02, f, `(${okR(f)} + #oknoStrzalka)`, m === 0 ? '0 deg' : `${m} * #oknoKrok`)); }
  return out;
};
const zebroPkt = (sgn) => {   // środek żeberka łapy: R (R0+R1)/2, stycznie (nadlewD/2 + luz + W/2) w stronę φ 270°
  const K = sgn > 0 ? v.nadlewKat1 : 360 - v.nadlewKat1, eK = sgn > 0 ? '#nadlewKat1' : '#nadlewKat2', s90 = sgn > 0 ? '+' : '-';
  const rc = (v.lapaR0 + v.lapaR1) / 2, tc = v.nadlewD / 2 + v.lapaLuz + v.lapaZebroW / 2;
  const x = rc * Math.cos(K * d2r) + tc * Math.cos((K + sgn * 90) * d2r), y = rc * Math.sin(K * d2r) + tc * Math.sin((K + sgn * 90) * d2r);
  const eRc = '(#lapaR0 + #lapaR1) / 2', eTc = '(#nadlewD / 2 + #lapaLuz + #lapaZebroW / 2)';
  return [x, y, `abs(${eRc} * cos(${eK}) + ${eTc} * cos(${eK} ${s90} 90 deg))`, `abs(${eRc} * sin(${eK}) + ${eTc} * sin(${eK} ${s90} 90 deg))`];
};
U.zebroPkt = zebroPkt;
U.krok2 = async () => {
  const w1 = await zap('plZebra', plOff('Uchwyt: płaszczyzna żebra', TOP, '-(#oknoZ + #plytaOknaT / 2)', true), false);
  const s = new G.Sk('Uchwyt: żebro', plQ(U.Fz.plZebra));
  s.poly('zb', zebroPts());
  [1, -1].forEach((sg) => { const p = zebroPkt(sg), id = sg > 0 ? 'm3a' : 'm3b'; s.point(id, [p[0], p[1]]); s.dx(id, p[2]); s.dy(id, p[3]); });
  const zw = await zap('skZebro', s.feature(), true);
  const z1 = v.oknoZ + v.plytaT / 2;
  const e1 = await zap('zebro', G.ext('Uchwyt: żebro (wyciągnięcie)', G.regs(U.Fz.skZebro, [[13.6, 0, z1]]), { op: 'ADD', depth: '#zebroZ1 - (#oknoZ + #plytaOknaT / 2)', scope: [BU()] }), false);
  const vtx = (id) => `query=sketchEntityQuery(makeId("${U.Fz.skZebro}"), EntityType.VERTEX, "${id}");`;
  const h = G._F('hole', 'Uchwyt: otwory M3 łap', [G.pe('hole', 'style', 'C_SINK'), G.pq('locations', vtx('m3a'), vtx('m3b')), G.pq('scope', BU()), G.pe('hole', 'endStyle', 'THROUGH'),
    G.pn('holeDiameter', '#m3Luzny'), G.pn('cSinkDiameter', '#m3PoglD'), G.pn('cSinkAngle', '90 deg'), G.pb('oppositeDirection', false)]);
  const e2 = await zap('otwM3', h, false);
  return st([w1, zw, e1, e2]);
};

// krok 3: tuleja (Right), kieszeń nakrętki M5, otwór M4 ±y
U.krok3 = async (zNakretka = true) => {
  const s = new G.Sk('Uchwyt: przekrój tulei', RIGHT);
  const tz2 = v.tZ2, eZ2 = '#tulejaPrzodZ2', eGn = '(#m5PoglD - #m5Luzny) / 2';
  s.poly('tu', [[v.tRin, v.tZ0, '#kieszenKardanaD / 2', '#tulejaPrzodZ0'], [v.tR, v.tZ0, '#tulejaPrzodR', '#tulejaPrzodZ0'], [v.tR, tz2, '#tulejaPrzodR', eZ2],
    [v.m5PoglD / 2, tz2, '#m5PoglD / 2', eZ2], [v.m5L / 2, tz2 - (v.m5PoglD - v.m5L) / 2, '#m5Luzny / 2', `${eZ2} - ${eGn}`], [v.m5L / 2, v.tZ1, '#m5Luzny / 2', '#kardanB'], [v.tRin, v.tZ1, '#kieszenKardanaD / 2', '#kardanB']]);
  s.line('osZ', [0, v.tZ0], [0, tz2]); s.vOrg('osZ.start'); s.vOrg('osZ.end'); s.dy('osZ.start', '#tulejaPrzodZ0'); s.dy('osZ.end', eZ2);
  const zw = await zap('skTuleja', s.feature(), true);
  const r1 = await zap('tuleja', G.rev('Uchwyt: tuleja', G.regs(U.Fz.skTuleja, [[0, 6.7, 10]]), G.q.edge(U.Fz.skTuleja, 'osZ'), { op: 'ADD', scope: [BU()] }), false);
  const out = [zw, r1];
  if (zNakretka) {
    const wp = await zap('plNakr', plOff('Uchwyt: płaszczyzna nakrętki M5', TOP, '#nakrPrzodZ0', false), false);
    const sn = new G.Sk('Uchwyt: kieszeń nakrętki M5', plQ(U.Fz.plNakr));
    const E = 9.47, S = 8.2, Lk = 10;
    sn.poly('nk', [[E / 2, 0, '#nakrM5E / 2', null], [E / 4, S / 2, '#nakrM5E / 2 / 2', '#nakrM5S / 2'], [-Lk, S / 2, '#kanalNakrL', '#nakrM5S / 2'], [-Lk, -S / 2, '#kanalNakrL', '#nakrM5S / 2'], [E / 4, -S / 2, '#nakrM5E / 2 / 2', '#nakrM5S / 2']]);
    const ws = await zap('skNakr', sn.feature(), true);
    const en = await zap('nakr', G.ext('Uchwyt: kieszeń nakrętki M5 (wycięcie)', G.regs(U.Fz.skNakr, [[0, 0, v.nakrZ0]]), { op: 'REMOVE', depth: '#nakrM5H + #nakrLuzH', scope: [BU()] }), false);
    out.push(wp, ws, en);
  }
  const s4 = new G.Sk('Uchwyt: otwór M4 tulei', FRONT);
  const c = s4.circle('m4', [0, v.m4Z], v.m4D); s4.vOrg('m4.center'); s4.dy('m4.center', '#kardanSrubaOd'); s4.con('DIAMETER', [G.pstr('localFirst', c), G.pn('length', '#m4Otwor')]);
  const w4 = await zap('skM4', s4.feature(), true);
  const e4 = await zap('m4', G.ext('Uchwyt: otwór M4 tulei (wycięcie)', G.regs(U.Fz.skM4, [[0, 0, v.m4Z]]), { op: 'REMOVE', depth: '2 * #tulejaPrzodR', sym: true, scope: [BU()] }), false);
  out.push(w4, e4);
  return st(out);
};

// krok 4: łącznik (Front, φ 0) jako bryła, obrót o lacznikKat1 wokół osi tulei, szyk × 3, scalenie
U.krok4 = async () => {
  const s = new G.Sk('Uchwyt: łącznik', FRONT);
  const z0 = v.oknoZ + v.plytaT / 2, rEnd = v.tR - v.wsporWglab, zEnd = v.tZ0 + (v.lacR1 - rEnd) * (v.tZ0 - z0) / (v.lacR0 - v.lacR1);
  const eZ0 = '(#oknoZ + #plytaOknaT / 2)', eRe = '(#tulejaPrzodR - #wsporWglab)';
  const eZe = `#tulejaPrzodZ0 + (#lacznikR1 - ${eRe}) * (#tulejaPrzodZ0 - ${eZ0}) / (#lacznikR0 - #lacznikR1)`;
  const P0 = [v.lacR0, z0], P1 = [rEnd, zEnd]; const dl = Math.hypot(P1[0] - P0[0], P1[1] - P0[1]); const n = [-(P1[1] - P0[1]) / dl * 2, (P1[0] - P0[0]) / dl * 2];
  if (n[1] < 0) { n[0] = -n[0]; n[1] = -n[1]; }
  s.line('lx', P0, P1); s.line('l2', [P0[0] + n[0], P0[1] + n[1]], [P1[0] + n[0], P1[1] + n[1]]);
  s.line('e0', P0, [P0[0] + n[0], P0[1] + n[1]]); s.line('e1', P1, [P1[0] + n[0], P1[1] + n[1]]);
  s.dx('lx.start', '#lacznikR0'); s.dy('lx.start', `abs${eZ0}`); s.dx('lx.end', eRe); s.dy('lx.end', eZe);
  s.co('lx.start', 'e0.start'); s.co('e0.end', 'l2.start'); s.co('lx.end', 'e1.start'); s.co('e1.end', 'l2.end');
  s.con('PARALLEL', [G.pstr('localFirst', 'l2'), G.pstr('localSecond', 'lx')]); s.con('PERPENDICULAR', [G.pstr('localFirst', 'e0'), G.pstr('localSecond', 'lx')]);
  s.con('PERPENDICULAR', [G.pstr('localFirst', 'e1'), G.pstr('localSecond', 'lx')]);
  s.con('DISTANCE', [G.pstr('localFirst', 'l2'), G.pstr('localSecond', 'lx'), { btType: 'BTMParameterEnum-145', parameterId: 'direction', enumName: 'DimensionDirection', value: 'MINIMUM' }, G.pn('length', '#lacznikUchD / 2')]);
  const zw = await zap('skLacznik', s.feature(), true);
  const mid = [(P0[0] + P1[0]) / 2 + n[0] / 2, 0, (P0[1] + P1[1]) / 2 + n[1] / 2];
  const r1 = await zap('lacznik', G.rev('Uchwyt: łącznik (bryła)', G.regs(U.Fz.skLacznik, [mid]), G.q.edge(U.Fz.skLacznik, 'lx'), { op: 'NEW' }), false);
  const LB = G.q.body(U.Fz.lacznik), OS = G.q.edge(U.Fz.skTuleja, 'osZ');
  const t1 = await zap('lacznikObrot', G._F('transform', 'Uchwyt: łącznik (obrót)', [G.pe('transform', 'transformType', 'ROTATION'), G.pq('entities', LB), G.pq('transformAxis', OS), G.pn('angle', '#lacznikKat1'), G.pb('oppositeDirection', false), G.pb('makeCopy', false)]), false);
  const p1 = await zap('laczniki', G._F('circularPattern', 'Uchwyt: łączniki', [G.pe('circularPattern', 'patternType', 'PART'), G.pq('entities', LB), G.pq('axis', OS), G.pn('angle', '#lacznikKrok'),
    { btType: 'BTMParameterQuantity-147', parameterId: 'instanceCount', expression: '3', isInteger: true }, G.pb('equalSpace', false), G.pb('oppositeDirection', false)]), false);
  const b1 = await zap('lacznikiScal', G._F('booleanBodies', 'Uchwyt: łączniki (scalenie)', [G.pe('booleanBodies', 'operationType', 'UNION'), G.pq('tools', BU(), LB, G.q.body(U.Fz.laczniki))]), false);
  return st([zw, r1, t1, p1, b1]);
};

// widełki stałe przy gałce: szkic w płaszczyźnie ⊥ a1 (= ±y) przez P; m pod kątem β od +z ku −x
// pu0/ePu – współrzędna u środka P (X) i jej wyrażenie (null = na osi); pv0/ePv – v (Z)
const widelkiSzkic = (s, pre, pu0, ePu, beta, eB) => {
  const sb = Math.sin(beta * d2r), cb = Math.cos(beta * d2r), rS = v.grS;
  const T = [[0, null], [v.gcS, '#uGal_cS'], [v.gcS + v.gpS, '(#uGal_cS + #uGal_pS)']];
  const Q = ([t, et], sg) => { const u = pu0 + t * sb + sg * rS * cb, w = v.pktZ + t * cb - sg * rS * sb, ss = sg > 0 ? '+' : '-', sm = sg > 0 ? '-' : '+';
    const tu = et ? ` + ${et} * sin(${eB})` : '', tw = et ? ` + ${et} * cos(${eB})` : '';
    return [u, w, `abs(${ePu ? ePu : '0 mm'}${tu} ${ss} #uGal_rS * cos(${eB}))`, `abs(#pktZ${tw} ${sm} #uGal_rS * sin(${eB}))`]; };
  s.poly(pre, [Q(T[0], 1), Q(T[1], 1), Q(T[2], 1), Q(T[2], -1), Q(T[1], -1), Q(T[0], -1)]);
  s.line(pre + 's', [Q(T[1], 1)[0], Q(T[1], 1)[1]], [Q(T[1], -1)[0], Q(T[1], -1)[1]]); s.co(pre + 's.start', pre + '1.start'); s.co(pre + 's.end', pre + '4.start');
  const c1 = s.circle(pre + 'r', [pu0, v.pktZ], 2 * rS), c2 = s.circle(pre + 'p', [pu0, v.pktZ], v.m2Gwint);
  [c1, c2].forEach((c) => { s.pu(c + '.center', ePu); s.dy(c + '.center', 'abs(#pktZ)'); });
  s.ra(c1, '#uGal_rS'); s.con('DIAMETER', [G.pstr('localFirst', c2), G.pn('length', '#m2Gwint')]);
  const P = [pu0, v.pktZ], m = [sb, cb], at = (t) => [P[0] + m[0] * t, P[1] + m[1] * t];
  return { cap: at(-1.4), sh1: at(-0.4), sh2: at(0.4), rect: at(3.5), base: at(v.gcS + v.gpS / 2) };
};
// wspornik: w płaszczyźnie (u, v) od środka podstawy (Bu, Bv) pod wsporKat w stronę −u do u_end
const wspornikSzkic = (s, pre, Bu, Bv, eBu, eBv, uEnd, eUe) => {
  const a = v.wsporKat * d2r, h = v.wsporA / 2, n = [Math.sin(a) * h, Math.cos(a) * h], tg = Math.tan(a);
  const V1 = [Bu + n[0], Bv + n[1]], V2 = [Bu - n[0], Bv - n[1]];
  const V4 = [uEnd, V1[1] + (V1[0] - uEnd) * tg], V3 = [uEnd, V2[1] + (V2[0] - uEnd) * tg];
  const e1u = `${eBu} + #wsporA / 2 * sin(#wsporKat)`, e1v = `${eBv} + #wsporA / 2 * cos(#wsporKat)`, e2u = `${eBu} - #wsporA / 2 * sin(#wsporKat)`, e2v = `${eBv} - #wsporA / 2 * cos(#wsporKat)`;
  s.poly(pre, [[V2[0], V2[1], `abs(${e2u})`, `abs(${e2v})`], [V1[0], V1[1], `abs(${e1u})`, `abs(${e1v})`],
    [V4[0], V4[1], eUe, `abs(${e1v} + (${e1u} - ${eUe}) * tan(#wsporKat))`], [V3[0], V3[1], eUe, `abs(${e2v} + (${e2u} - ${eUe}) * tan(#wsporKat))`]]);
  return [(Bu + uEnd) / 2, Bv + (Bu - uEnd) / 2 * tg];
};
U.krok5 = async () => {   // widełki X + wspornik X (Front)
  const s = new G.Sk('Uchwyt: widełki X', FRONT);
  const r = widelkiSzkic(s, 'wx', v.pktR, '#pktR', v.kX, '#widelkiXKat');
  const zw = await zap('skWidX', s.feature(), true);
  const F = (p) => [p[0], 0, p[1]];
  const e1 = await zap('widX', G.ext('Uchwyt: widełki X (bryła)', G.regs(U.Fz.skWidX, [r.cap, r.sh1, r.sh2, r.rect, r.base].map(F)), { op: 'NEW', depth: '2 * #uGal_ho', sym: true }), false);
  const WX = G.q.body(U.Fz.widX);
  const e2 = await zap('widXszcz', G.ext('Uchwyt: widełki X (szczelina)', G.regs(U.Fz.skWidX, [r.cap, r.sh1, r.sh2, r.rect].map(F)), { op: 'REMOVE', depth: '2 * #uGal_hi', sym: true, scope: [WX] }), false);
  const e3 = await zap('widXsw', G.ext('Uchwyt: widełki X (sworzeń)', G.regs(U.Fz.skWidX, [r.sh1, r.sh2].map(F)), { op: 'REMOVE', depth: '2 * #uGal_ho', sym: true, scope: [WX] }), false);
  const sw = new G.Sk('Uchwyt: wspornik X', FRONT);
  const bt = v.gcS + v.gpS / 2, Bu = v.pktR + bt * Math.sin(v.kX * d2r), Bv = v.pktZ + bt * Math.cos(v.kX * d2r);
  const mid = wspornikSzkic(sw, 'sx', Bu, Bv, '#pktR + (#uGal_cS + #uGal_pS / 2) * sin(#widelkiXKat)', '#pktZ + (#uGal_cS + #uGal_pS / 2) * cos(#widelkiXKat)', v.tR - v.wsporWglab, '(#tulejaPrzodR - #wsporWglab)');
  const zw2 = await zap('skWspX', sw.feature(), true);
  const e4 = await zap('wspX', G.ext('Uchwyt: wspornik X (wyciągnięcie)', G.regs(U.Fz.skWspX, [F(mid)]), { op: 'ADD', depth: '#wsporA', sym: true, scope: [BU(), WX] }), false);
  return st([zw, e1, e2, e3, zw2, e4]);
};
U.krok6 = async () => {   // widełki Y (Front offset y 20) + wspornik Y (Right offset x −3,78)
  const w0 = await zap('plWidY', plOff('Uchwyt: płaszczyzna widełek Y', FRONT, '#pktRY', true), false);
  const s = new G.Sk('Uchwyt: widełki Y', plQ(U.Fz.plWidY));
  const r = widelkiSzkic(s, 'wy', 0, null, v.kY, '#widelkiYKat');
  const zw = await zap('skWidY', s.feature(), true);
  const F = (p) => [p[0], v.pktRY, p[1]];
  const e1 = await zap('widY', G.ext('Uchwyt: widełki Y (bryła)', G.regs(U.Fz.skWidY, [r.cap, r.sh1, r.sh2, r.rect, r.base].map(F)), { op: 'NEW', depth: '2 * #uGal_ho', sym: true }), false);
  const WY = G.q.body(U.Fz.widY);
  const e2 = await zap('widYszcz', G.ext('Uchwyt: widełki Y (szczelina)', G.regs(U.Fz.skWidY, [r.cap, r.sh1, r.sh2, r.rect].map(F)), { op: 'REMOVE', depth: '2 * #uGal_hi', sym: true, scope: [WY] }), false);
  const e3 = await zap('widYsw', G.ext('Uchwyt: widełki Y (sworzeń)', G.regs(U.Fz.skWidY, [r.sh1, r.sh2].map(F)), { op: 'REMOVE', depth: '2 * #uGal_ho', sym: true, scope: [WY] }), false);
  const bt = v.gcS + v.gpS / 2, xb = bt * Math.sin(v.kY * d2r), Bv = v.pktZ + bt * Math.cos(v.kY * d2r);
  const w5 = await zap('plWspY', plOff('Uchwyt: płaszczyzna wspornika Y', RIGHT, '-sin(#widelkiYKat) * (#uGal_cS + #uGal_pS / 2)', true), false);
  const sw = new G.Sk('Uchwyt: wspornik Y', plQ(U.Fz.plWspY));
  const uEnd = Math.sqrt(v.tR * v.tR - xb * xb) - v.wsporWglab;
  const mid = wspornikSzkic(sw, 'sy', v.pktRY, Bv, '#pktRY', '#pktZ + (#uGal_cS + #uGal_pS / 2) * cos(#widelkiYKat)', uEnd,
    '(sqrt(#tulejaPrzodR ^ 2 - (sin(#widelkiYKat) * (#uGal_cS + #uGal_pS / 2)) ^ 2) - #wsporWglab)');
  const zw2 = await zap('skWspY', sw.feature(), true);
  const e4 = await zap('wspY', G.ext('Uchwyt: wspornik Y (wyciągnięcie)', G.regs(U.Fz.skWspY, [[xb, mid[0], mid[1]]]), { op: 'ADD', depth: '#wsporA', sym: true, scope: [BU(), WY] }), false);
  return st([w0, zw, e1, e2, e3, w5, zw2, e4]);
};

// Łapa Uchwytu (φ nadlewKat1) + otwory + Mirror PART
U.krok7 = async () => {
  const w0 = await zap('plLapy', plOff('Łapa Uchwytu: płaszczyzna', TOP, '#lapaT - #nadlewZ2', true), false);
  const s = new G.Sk('Łapa Uchwytu: obrys', plQ(U.Fz.plLapy));
  const K = v.nadlewKat1 * d2r, eK = '#nadlewKat1';
  const RT = (r, t, eR, eT) => [r * Math.cos(K) - t * Math.sin(K), r * Math.sin(K) + t * Math.cos(K), `abs(${eR} * cos(${eK}) - ${eT} * sin(${eK}))`, `abs(${eR} * sin(${eK}) + ${eT} * cos(${eK}))`];
  const t0 = -v.nadlewD / 2, t3 = v.nadlewD / 2 + v.lapaLuz, t1 = t3 + v.lapaZebroW;
  const et0 = '(-#nadlewD / 2)', et3 = '(#nadlewD / 2 + #lapaLuz)', et1 = '#lapaT1';
  s.poly('lp', [RT(v.lapaR0, t0, '#lapaR0', et0), RT(v.lapaR1, t0, '#lapaR1', et0), RT(v.lapaR1, t3, '#lapaR1', et3), RT(v.lapaR1, t1, '#lapaR1', et1), RT(v.lapaR0, t1, '#lapaR0', et1), RT(v.lapaR0, t3, '#lapaR0', et3)]);
  const a = RT(v.lapaR1, t3, '', ''), b = RT(v.lapaR0, t3, '', ''); s.line('lps', [a[0], a[1]], [b[0], b[1]]); s.co('lps.start', 'lp2.start'); s.co('lps.end', 'lp5.start');
  const pn = RT(v.nadlewR, 0, '#nadlewR', '0 mm'); s.point('nd', [pn[0], pn[1]]); s.dx('nd', pn[2]); s.dy('nd', pn[3]);
  const zw = await zap('skLapa', s.feature(), true);
  const z0 = v.nadlewZ2 - v.lapaT, rc = (v.lapaR0 + v.lapaR1) / 2;
  const at = (r, t) => { const q = RT(r, t, '', ''); return [q[0], q[1], z0]; };
  const e1 = await zap('lapa', G.ext('Łapa Uchwytu: płytka', G.regs(U.Fz.skLapa, [at(rc, (t0 + t3) / 2), at(rc, (t3 + t1) / 2)]), { op: 'NEW', depth: '#lapaT' }), false);
  const LP = G.q.body(U.Fz.lapa);
  const e2 = await zap('lapaZeb', G.ext('Łapa Uchwytu: żeberko', G.regs(U.Fz.skLapa, [at(rc, (t3 + t1) / 2)]), { op: 'ADD', depth: '#oknoZ - #plytaOknaT / 2 - (#nadlewZ2 - #lapaT)', scope: [LP] }), false);
  const h1 = await zap('lapaM3', G._F('hole', 'Łapa Uchwytu: otwór M3 do nadlewu', [G.pe('hole', 'style', 'C_SINK'), G.pq('locations', `query=sketchEntityQuery(makeId("${U.Fz.skLapa}"), EntityType.VERTEX, "nd");`),
    G.pq('scope', LP), G.pe('hole', 'endStyle', 'THROUGH'), G.pn('holeDiameter', '#m3Luzny'), G.pn('cSinkDiameter', '#m3PoglD'), G.pn('cSinkAngle', '90 deg'), G.pb('oppositeDirection', true)]), false);
  const s2 = new G.Sk('Łapa Uchwytu: punkt otworu żeberka', plQ(U.Fz.plPlyty));
  const p2 = zebroPkt(1); s2.point('zb', [p2[0], p2[1]]); s2.dx('zb', p2[2]); s2.dy('zb', p2[3]);
  const zw2 = await zap('skLapaZb', s2.feature(), true);
  const h2 = await zap('lapaZbOtw', G._F('hole', 'Łapa Uchwytu: otwór żeberka', [G.pe('hole', 'style', 'SIMPLE'), G.pq('locations', `query=sketchEntityQuery(makeId("${U.Fz.skLapaZb}"), EntityType.VERTEX, "zb");`),
    G.pq('scope', LP), G.pe('hole', 'endStyle', 'BLIND'), G.pn('holeDiameter', '#m3Ciasny'), G.pn('holeDepth', '#lapaOtwGl'), G.pb('oppositeDirection', false)]), false);
  const m1 = await zap('lapaMir', G._F('mirror', 'Łapa Uchwytu: prawa', [G.pe('mirror', 'patternType', 'PART'), G.pq('entities', LP), G.pq('mirrorPlane', RIGHT)]), false);
  return st([w0, zw, e1, e2, h1, zw2, h2, m1]);
};

return 'U ok';
})();
