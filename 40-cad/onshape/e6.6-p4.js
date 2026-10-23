// E6.6 – P4: próbka przegubu krzyżowego (plan e6.6-plan-p4.md, zatwierdzony 23.10). Wymaga e6.6-build.js.
// Etapy uruchamiane po kolei: P4.zmienne(), P4.krok1() … P4.krok6(); po każdym zrzut i wpis stanu.
(() => {
const G = window.G, P4 = window.P4 = window.P4 || {};
// wartości startowe (mm) – tylko położenie startowe encji; o geometrii decydują wymiary #zmienna
const v = { p4X0: 80, pretX: 43.635, pretD: 4.5,
  gDo: 5.5, gHr: 4, gLuz: 0.25, gPol: 2, grP: 1.8, gcP: 5.5, gpP: 2, grS: 2.6, gcS: 7, gpS: 2,
  oDo: 8, oHr: 4, oLuz: 0.25, oPol: 2, orP: 2.6, ocP: 5.5, opP: 6.5, orS: 2.6, ocS: 8.25, opS: 1.5,
  tulejaD: 7, tulejaL: 6, czopD: 4.4, czopL: 3.4, luzObr: 0.2, m3PoglD: 6, m3PoglH: 3.2, m3WkretL: 12, gwintZapas: 0.5, podstawaOD: 8,
  sworzenOtworDruk: 1.8, m2Gwint: 1.6, m2PoglD: 4.2, m3Ciasny: 2.6, m3Luzny: 3.3, blokL: 8, blokH: 16, otwZ: 5 };
v.xG = v.p4X0; v.xO = v.p4X0 + v.pretX;
v.gHi = v.gDo / 2 + v.gLuz; v.gHo = v.gHi + v.gPol; v.oHi = v.oDo / 2 + v.oLuz; v.oHo = v.oHi + v.oPol;
v.gOtw = 4 - v.gPol - v.gLuz + 0.25; v.oOtw = 5 - v.oPol - v.oLuz + 0.25; v.lozL = v.opP - v.m3PoglH;
P4.v = v;

// ---------- Variable Studio ----------
P4.NOWE = [
  ['p4X0', '80 mm', 'P4: położenie środka krzyżaka G na osi X (poza modułem)'],
  ['uGal_Do', '5.5 mm', 'krzyżak przy gałce: średnica krążka'], ['uGal_Hr', '4 mm', 'krzyżak przy gałce: wysokość wzdłuż pręta'],
  ['uGal_luzOs', '0.25 mm', 'luz osiowy policzek–krążek'], ['uGal_policzek', '2 mm', 'grubość policzka'],
  ['uGal_rP', '1.8 mm', 'widełki pręta: ½ grubości = promień końca'], ['uGal_cP', '5.5 mm', 'widełki pręta: lico podstawy od środka'],
  ['uGal_pP', '2 mm', 'widełki pręta: grubość podstawy'], ['uGal_rS', '2.6 mm', 'widełki stałe: ½ grubości = promień końca'],
  ['uGal_cS', '7 mm', 'widełki stałe: lico podstawy od środka'], ['uGal_pS', '2 mm', 'widełki stałe: grubość podstawy'],
  ['uOrcz_Do', '8 mm', 'krzyżak przy orczyku: średnica krążka'], ['uOrcz_Hr', '4 mm', 'krzyżak przy orczyku: wysokość'],
  ['uOrcz_luzOs', '0.25 mm', 'luz osiowy policzek–krążek'], ['uOrcz_policzek', '2 mm', 'grubość policzka'],
  ['uOrcz_rP', '2.6 mm', 'widełki pręta przy orczyku: ½ grubości'], ['uOrcz_cP', '5.5 mm', 'widełki pręta: lico podstawy'],
  ['uOrcz_pP', '6.5 mm', 'widełki pręta: podstawa (pogłębienie M3 + łożysko)'], ['uOrcz_rS', '2.6 mm', 'widełki orczyka (stałe): ½ grubości'],
  ['uOrcz_cS', '8.25 mm', 'widełki orczyka: lico podstawy'], ['uOrcz_pS', '1.5 mm', 'widełki orczyka: grubość podstawy'],
  ['tulejaD', '7 mm', 'tulejka obrotnicy pręta: średnica'], ['tulejaL', '6 mm', 'tulejka obrotnicy: długość'],
  ['czopD', '4.4 mm', 'czop obrotnicy (uwaga 1 planu P4)'], ['czopL', '3.4 mm', 'czop obrotnicy: długość (luz osiowy z lozyskoL)'],
  ['luzObrotnicy', '0.2 mm', 'luz promieniowy czop–łożysko (tabela AGENTS, obrotowe)'],
  ['m3PoglD', '6 mm', 'pogłębienie łba M3 DIN 912 (5,5)'], ['m3PoglH', '3.2 mm', 'pogłębienie łba M3 (łeb 3)'],
  ['m3WkretL', '12 mm', 'wkręt obrotnicy M3×12'], ['gwintZapas', '0.5 mm', 'otwór pod gwint dłuższy od wkrętu'],
  ['podstawaOD', '8 mm', 'walec podstawy widełek pręta przy orczyku (uwaga 2 planu P4)'],
  ['sworzenOtworDruk', '1.8 mm', 'otwór sworznia w krążku drukowany, rozwiercany Ø2,0 (B9)'],
  ['sworzenLGal', '4 mm', 'sworzeń przy gałce M2×4'], ['sworzenLOrcz', '5 mm', 'sworzeń przy orczyku M2×5'],
  ['sworzenZapasDna', '0.25 mm', 'zapas dna otworu krążka za końcem wkrętu'],
  ['m2PoglD', '4.2 mm', 'pogłębienie łba DIN 7991 M2 (4,0 + 0,2)'],
  ['p4BlokL', '8 mm', 'P4: klocek mocujący, długość'], ['p4BlokH', '16 mm', 'P4: klocek mocujący, wysokość'], ['p4OtwZ', '5 mm', 'P4: otwory M3 klocka od osi']];
P4.POCHODNE = [
  ['uGal_hi', '#uGal_Do / 2 + #uGal_luzOs', 'wewnętrzne lico policzka od środka'], ['uGal_ho', '#uGal_hi + #uGal_policzek', 'zewnętrzne lico policzka'],
  ['uOrcz_hi', '#uOrcz_Do / 2 + #uOrcz_luzOs', 'wewnętrzne lico policzka'], ['uOrcz_ho', '#uOrcz_hi + #uOrcz_policzek', 'zewnętrzne lico policzka'],
  ['uGal_otwGl', '#sworzenLGal - #uGal_policzek - #uGal_luzOs + #sworzenZapasDna', 'głębokość otworu sworznia w krążku (uwaga 3)'],
  ['uOrcz_otwGl', '#sworzenLOrcz - #uOrcz_policzek - #uOrcz_luzOs + #sworzenZapasDna', 'głębokość otworu sworznia w krążku'],
  ['lozyskoL', '#uOrcz_pP - #m3PoglH', 'łożysko obrotnicy w podstawie'], ['p4XO', '#p4X0 + #pretX', 'P4: środek krzyżaka O']];
P4.ZMIANY = { pretX: '43.635 mm', pretD: '4.5 mm' };
P4.zmienne = async () => {
  const url = `/api/v12/variables/d/${G.doc.did}/w/${G.doc.wid}/e/${G.doc.vs}/variables`;
  const r0 = await G.req('GET', url); if (!r0.ok) throw new Error('GET VS ' + r0.status);
  const lista = Array.isArray(r0.json) && r0.json[0] && r0.json[0].variables ? r0.json[0].variables : r0.json;
  const stare = lista.map((x) => ({ name: x.name, type: x.type, expression: x.expression, description: x.description || '' }));
  P4.vsPrzed = stare;
  const nazwy = new Set(stare.map((x) => x.name)); const kol = [...P4.NOWE, ...P4.POCHODNE].filter(([n]) => nazwy.has(n)); if (kol.length) throw new Error('już są: ' + kol.map((k) => k[0]));
  const baza = stare.map((x) => P4.ZMIANY[x.name] ? { ...x, expression: P4.ZMIANY[x.name] } : x);
  const nowe = P4.NOWE.map(([name, expression, description]) => ({ name, type: 'LENGTH', expression, description }));
  const licz = { uGal_hi: v.gHi, uGal_ho: v.gHo, uOrcz_hi: v.oHi, uOrcz_ho: v.oHo, uGal_otwGl: v.gOtw, uOrcz_otwGl: v.oOtw, lozyskoL: v.lozL, p4XO: v.xO };
  const r1 = await G.req('POST', url, [...baza, ...nowe, ...P4.POCHODNE.map(([name, , description]) => ({ name, type: 'LENGTH', expression: licz[name] + ' mm', description }))]);
  if (!r1.ok) throw new Error('VS 1: ' + r1.status + ' ' + JSON.stringify(r1.json || r1.text).slice(0, 300));
  const r2 = await G.req('POST', url, [...baza, ...nowe, ...P4.POCHODNE.map(([name, expression, description]) => ({ name, type: 'LENGTH', expression, description }))]);
  if (!r2.ok) throw new Error('VS 2: ' + r2.status + ' ' + JSON.stringify(r2.json || r2.text).slice(0, 300));
  await G.mvOdswiez();
  return { przed: stare.length, po: baza.length + nowe.length + P4.POCHODNE.length, n: G.n };
};

// ---------- pomocnicze ----------
const TOP = G.q.std('Top'), FRONT = G.q.std('Front');
const X0 = '#p4X0', XO = '#p4XO';
const top = (u, w) => [u, w, 0], front = (u, w) => [u, 0, w];
const cialo = (fid, p) => `query=qContainsPoint(qCreatedBy(makeId("${fid}"), EntityType.BODY), vector(${p.map((a) => a / 1000).join(', ')}) * meter);`;
P4.c = cialo;
// półprofil prostokątny na osi u (v od 0 do h): wierzchołki od osi
const prostOs = (u0, u1, h, e0, e1, eh) => [[u0, 0, e0, null], [u1, 0, e1, null], [u1, h, e1, eh], [u0, h, e0, eh]];

// ---------- krok 1: S1 przekroje obrotowe + R1 krzyżaki + R2 pręt ----------
P4.krok1 = async () => {
  const s = new G.Sk('P4: przekroje obrotowe', TOP);
  s.poly('kg', prostOs(v.xG - v.gHr / 2, v.xG + v.gHr / 2, v.gDo / 2, `${X0} - #uGal_Hr / 2`, `${X0} + #uGal_Hr / 2`, '#uGal_Do / 2'));
  s.poly('ko', prostOs(v.xO - v.oHr / 2, v.xO + v.oHr / 2, v.oDo / 2, `${XO} - #uOrcz_Hr / 2`, `${XO} + #uOrcz_Hr / 2`, '#uOrcz_Do / 2'));
  const xs = v.xG + v.gcP + v.gpP, xt1 = v.xO - v.ocP - v.opP, xt0 = xt1 - v.tulejaL, xc = xt1 + v.czopL, xh = xc - v.m3WkretL - v.gwintZapas;
  const eXs = `${X0} + #uGal_cP + #uGal_pP`, eXt1 = `${XO} - #uOrcz_cP - #uOrcz_pP`, eXt0 = `${eXt1} - #tulejaL`, eXc = `${eXt1} + #czopL`, eXh = `${eXc} - #m3WkretL - #gwintZapas`;
  s.poly('pr', [[xs, 0, eXs, null], [xh, 0, eXh, null], [xh, v.m3Ciasny / 2, eXh, '#m3Ciasny / 2'], [xc, v.m3Ciasny / 2, eXc, '#m3Ciasny / 2'],
    [xc, v.czopD / 2, eXc, '#czopD / 2'], [xt1, v.czopD / 2, eXt1, '#czopD / 2'], [xt1, v.tulejaD / 2, eXt1, '#tulejaD / 2'],
    [xt0, v.tulejaD / 2, eXt0, '#tulejaD / 2'], [xt0, v.pretD / 2, eXt0, '#pretD / 2'], [xs, v.pretD / 2, eXs, '#pretD / 2']]);
  const w = await G.zap(s.feature(), true); P4.S1 = w.featureId;
  const r1 = await G.zap(G.rev('P4: krzyżaki', G.regs(P4.S1, [top(v.xG, 1), top(v.xO, 1)]), G.q.edge(P4.S1, 'kg0')), false); P4.R1 = r1.featureId;
  const r2 = await G.zap(G.rev('P4: pręt – czop, tulejka, pręt', G.regs(P4.S1, [top(95, 1)]), G.q.edge(P4.S1, 'pr0')), false); P4.R2 = r2.featureId;
  return [w, r1, r2].map((x) => [x.nazwa, x.featureStatus, x.under, x.podpowiedz]);
};

// ---------- krok 2: S3 widełki stałe + E3, E4 + R3 podstawa O ----------
P4.krok2 = async () => {
  const s = new G.Sk('P4: widełki stałe', FRONT);
  // stałe G: policzki |z| hi..ho od xG + rS do podstawy, podstawa xG − cS − pS … xG − cS, klocek do − blokL, |z| ≤ blokH/2
  const g = { t: v.xG + v.grS, c: v.xG - v.gcS, b: v.xG - v.gcS - v.gpS, k: v.xG - v.gcS - v.gpS - v.blokL };
  const eg = { t: `${X0} + #uGal_rS`, c: `${X0} - #uGal_cS`, b: `${X0} - #uGal_cS - #uGal_pS`, k: `${X0} - #uGal_cS - #uGal_pS - #p4BlokL` };
  const H = v.blokH / 2, eH = '#p4BlokH / 2';
  const ug = (sg) => [[g.t, sg * v.gHo, eg.t, '#uGal_ho'], [g.b, sg * v.gHo, eg.b, '#uGal_ho'], [g.b, sg * H, eg.b, eH], [g.k, sg * H, eg.k, eH]];
  s.poly('sg', [...ug(1), ...ug(-1).reverse(), [g.t, -v.gHi, eg.t, '#uGal_hi'], [g.c, -v.gHi, eg.c, '#uGal_hi'], [g.c, v.gHi, eg.c, '#uGal_hi'], [g.t, v.gHi, eg.t, '#uGal_hi']]);
  const o = { t: v.xO - v.orS, c: v.xO + v.ocS, b: v.xO + v.ocS + v.opS, k: v.xO + v.ocS + v.opS + v.blokL };
  const eo = { t: `${XO} - #uOrcz_rS`, c: `${XO} + #uOrcz_cS`, b: `${XO} + #uOrcz_cS + #uOrcz_pS`, k: `${XO} + #uOrcz_cS + #uOrcz_pS + #p4BlokL` };
  const uo = (sg) => [[o.t, sg * v.oHo, eo.t, '#uOrcz_ho'], [o.b, sg * v.oHo, eo.b, '#uOrcz_ho'], [o.b, sg * H, eo.b, eH], [o.k, sg * H, eo.k, eH]];
  s.poly('so', [...uo(1), ...uo(-1).reverse(), [o.t, -v.oHi, eo.t, '#uOrcz_hi'], [o.c, -v.oHi, eo.c, '#uOrcz_hi'], [o.c, v.oHi, eo.c, '#uOrcz_hi'], [o.t, v.oHi, eo.t, '#uOrcz_hi']]);
  // otwory M3 klocków
  [['mg', (g.b + g.k) / 2, `${X0} - #uGal_cS - #uGal_pS - #p4BlokL / 2`], ['mo', (o.b + o.k) / 2, `${XO} + #uOrcz_cS + #uOrcz_pS + #p4BlokL / 2`]].forEach(([id, x, ex]) =>
    [1, -1].forEach((sg) => { const c = s.circle(id + (sg > 0 ? 'p' : 'm'), [x, sg * v.otwZ], v.m3Luzny); s.dx(c + '.center', ex); s.dy(c + '.center', '#p4OtwZ');
      s.con('DIAMETER', [G.pstr('localFirst', c), G.pn('length', '#m3Luzny')]); }));
  // uszy zaokrągleń końców widełek pręta (oś a2 = Y): G w stronę −x, O w stronę +x
  s.ucho('ug1', v.xG, v.grP, 1, X0, '#uGal_rP'); s.ucho('ug2', v.xG, v.grP, 2, X0, '#uGal_rP');
  s.ucho('uo0', v.xO, v.orP, 0, XO, '#uOrcz_rP'); s.ucho('uo3', v.xO, v.orP, 3, XO, '#uOrcz_rP');
  // półprofil podstawy widełek pręta O (walec Ø podstawaOD)
  const pb0 = v.xO - v.ocP - v.opP, pb1 = v.xO - v.ocP;
  s.poly('pb', prostOs(pb0, pb1, v.podstawaOD / 2, `${XO} - #uOrcz_cP - #uOrcz_pP`, `${XO} - #uOrcz_cP`, '#podstawaOD / 2'));
  const w = await G.zap(s.feature(), true); P4.S3 = w.featureId;
  const e3 = await G.zap(G.ext('P4: widełki stałe G', G.regs(P4.S3, [front(g.b + 1, 0)]), { op: 'NEW', depth: '2 * #uGal_rS', sym: true }), false); P4.E3 = e3.featureId;
  const e4 = await G.zap(G.ext('P4: widełki stałe O', G.regs(P4.S3, [front(o.b - 1, 0)]), { op: 'NEW', depth: '2 * #uOrcz_rS', sym: true }), false); P4.E4 = e4.featureId;
  const r3 = await G.zap(G.rev('P4: widełki pręta O – podstawa', G.regs(P4.S3, [front((pb0 + pb1) / 2, 1)]), G.q.edge(P4.S3, 'pb0')), false); P4.R3 = r3.featureId;
  return [w, e3, e4, r3].map((x) => [x.nazwa, x.featureStatus, x.under, x.podpowiedz]);
};

// ---------- krok 3: S2 widełki pręta + E1, E2 + C1 ----------
P4.krok3 = async () => {
  const s = new G.Sk('P4: widełki pręta', TOP);
  const t = v.xG - v.grP, c = v.xG + v.gcP, b = v.xG + v.gcP + v.gpP, tr = b + v.gHo - v.pretD / 2;
  const et = `${X0} - #uGal_rP`, ec = `${X0} + #uGal_cP`, eb = `${X0} + #uGal_cP + #uGal_pP`, etr = `${eb} + #uGal_ho - #pretD / 2`;
  s.poly('wg', [[t, v.gHo, et, '#uGal_ho'], [b, v.gHo, eb, '#uGal_ho'], [tr, v.pretD / 2, etr, '#pretD / 2'], [tr, -v.pretD / 2, etr, '#pretD / 2'],
    [b, -v.gHo, eb, '#uGal_ho'], [t, -v.gHo, et, '#uGal_ho'], [t, -v.gHi, et, '#uGal_hi'], [c, -v.gHi, ec, '#uGal_hi'], [c, v.gHi, ec, '#uGal_hi'], [t, v.gHi, et, '#uGal_hi']]);
  const ob = v.xO - v.ocP - v.opP, oc = v.xO - v.ocP, ot = v.xO + v.orP;
  const eob = `${XO} - #uOrcz_cP - #uOrcz_pP`, eoc = `${XO} - #uOrcz_cP`, eot = `${XO} + #uOrcz_rP`;
  s.poly('wo', [[ob, v.oHo, eob, '#uOrcz_ho'], [ot, v.oHo, eot, '#uOrcz_ho'], [ot, v.oHi, eot, '#uOrcz_hi'], [oc, v.oHi, eoc, '#uOrcz_hi'],
    [oc, -v.oHi, eoc, '#uOrcz_hi'], [ot, -v.oHi, eot, '#uOrcz_hi'], [ot, -v.oHo, eot, '#uOrcz_ho'], [ob, -v.oHo, eob, '#uOrcz_ho']]);
  // uszy zaokrągleń końców widełek stałych (oś a1 = Z): G w stronę +x, O w stronę −x
  s.ucho('sg0', v.xG, v.grS, 0, X0, '#uGal_rS'); s.ucho('sg3', v.xG, v.grS, 3, X0, '#uGal_rS');
  s.ucho('so1', v.xO, v.orS, 1, XO, '#uOrcz_rS'); s.ucho('so2', v.xO, v.orS, 2, XO, '#uOrcz_rS');
  const w = await G.zap(s.feature(), true); P4.S2 = w.featureId;
  const e1 = await G.zap(G.ext('P4: widełki pręta G', G.regs(P4.S2, [top(c + 1, 0)]), { op: 'ADD', depth: '2 * #uGal_rP', sym: true, scope: [G.q.body(P4.R2)] }), false); P4.E1 = e1.featureId;
  const e2 = await G.zap(G.ext('P4: widełki pręta O – policzki', G.regs(P4.S2, [top(ob + 1, 0)]), { op: 'ADD', depth: '2 * #uOrcz_rP', sym: true, scope: [G.q.body(P4.R3)] }), false); P4.E2 = e2.featureId;
  const uszy = [top(v.xG + v.grS * 0.9, v.grS * 0.9), top(v.xG + v.grS * 0.9, -v.grS * 0.9), top(v.xO - v.orS * 0.9, v.orS * 0.9), top(v.xO - v.orS * 0.9, -v.orS * 0.9)];
  const c1 = await G.zap(G.ext('P4: zaokrąglenie widełek stałych', G.regs(P4.S2, uszy), { op: 'REMOVE', depth: '2 * #p4BlokH', sym: true, scope: [G.q.body(P4.E3), G.q.body(P4.E4)] }), false); P4.C1 = c1.featureId;
  return [w, e1, e2, c1].map((x) => [x.nazwa, x.featureStatus, x.under, x.podpowiedz]);
};

// ---------- krok 4: C2 zaokrąglenie widełek pręta (S3) ----------
P4.krok4 = async () => {
  const uszy = [front(v.xG - v.grP * 0.9, v.grP * 0.9), front(v.xG - v.grP * 0.9, -v.grP * 0.9), front(v.xO + v.orP * 0.9, v.orP * 0.9), front(v.xO + v.orP * 0.9, -v.orP * 0.9)];
  const c2 = await G.zap(G.ext('P4: zaokrąglenie widełek pręta', G.regs(P4.S3, uszy), { op: 'REMOVE', depth: '2 * #p4BlokH', sym: true, scope: [G.q.body(P4.R2), G.q.body(P4.R3)] }), false); P4.C2 = c2.featureId;
  return [[c2.nazwa, c2.featureStatus]];
};

// profil otworu sworznia wokół osi ⊥ do płaszczyzny szkicu (oś = linia u = x0): krążek Ø druk do hi, policzek Ø1,6, opcjonalnie stożek DIN 7991
const otwor = (s, pre, x0, ex0, sg, u, pogl) => {
  const d = v.sworzenOtworDruk / 2, m = v.m2Gwint / 2, pd = v.m2PoglD / 2;
  const P = (o, h) => [x0 + o[0], sg * h[0], o[1], h[1]];
  const eo = (e) => e ? `${ex0} + ${e}` : ex0;
  const pts = [P([0, null], [u.dno, u.eDno]), P([d, '#sworzenOtworDruk / 2'], [u.dno, u.eDno]), P([d, '#sworzenOtworDruk / 2'], [u.hi, u.eHi]), P([m, '#m2Gwint / 2'], [u.hi, u.eHi])];
  if (pogl) pts.push(P([m, '#m2Gwint / 2'], [u.ho - (pd - m), `${u.eHo} - (#m2PoglD - #m2Gwint) / 2`]), P([pd, '#m2PoglD / 2'], [u.ho, u.eHo]));
  else pts.push(P([m, '#m2Gwint / 2'], [u.ho, u.eHo]));
  pts.push(P([0, null], [u.ho, u.eHo]));
  const q = pts.map(([uu, vv, ou, ev]) => [uu, vv, eo(ou), ev]);
  return s.poly(pre, sg > 0 ? q : q.reverse());
};
const UG = { dno: v.gDo / 2 - v.gOtw, eDno: '#uGal_Do / 2 - #uGal_otwGl', hi: v.gHi, eHi: '#uGal_hi', ho: v.gHo, eHo: '#uGal_ho' };
const UO = { dno: v.oDo / 2 - v.oOtw, eDno: '#uOrcz_Do / 2 - #uOrcz_otwGl', hi: v.oHi, eHi: '#uOrcz_hi', ho: v.oHo, eHo: '#uOrcz_ho' };
P4.UG = UG; P4.UO = UO;

// ---------- krok 5: S4 osie a1 + V1, V2 ----------
P4.krok5 = async () => {
  const s = new G.Sk('P4: osie a1', FRONT);
  otwor(s, 'ag', v.xG, X0, 1, UG, true); otwor(s, 'bg', v.xG, X0, -1, UG, true);
  otwor(s, 'ao', v.xO, XO, 1, UO, true); otwor(s, 'bo', v.xO, XO, -1, UO, true);
  const w = await G.zap(s.feature(), true); P4.S4 = w.featureId;
  const kG = cialo(P4.R1, [v.xG, 0, 0]), kO = cialo(P4.R1, [v.xO, 0, 0]);
  const pG = [front(v.xG + 0.4, (UG.dno + UG.hi) / 2), front(v.xG + 0.4, -(UG.dno + UG.hi) / 2)], pO = [front(v.xO + 0.4, (UO.dno + UO.hi) / 2), front(v.xO + 0.4, -(UO.dno + UO.hi) / 2)];
  const v1 = await G.zap(G.rev('P4: oś a1 G', G.regs(P4.S4, pG), G.q.edge(P4.S4, 'ag6'), { op: 'REMOVE', scope: [G.q.body(P4.E3), kG] }), false); P4.V1 = v1.featureId;
  const v2 = await G.zap(G.rev('P4: oś a1 O', G.regs(P4.S4, pO), G.q.edge(P4.S4, 'ao6'), { op: 'REMOVE', scope: [G.q.body(P4.E4), kO] }), false); P4.V2 = v2.featureId;
  return [w, v1, v2].map((x) => [x.nazwa, x.featureStatus, x.under, x.podpowiedz]);
};

// ---------- krok 6: S5 osie a2 i obrotnica + V3, V4, V5 ----------
P4.krok6 = async () => {
  const s = new G.Sk('P4: osie a2 i obrotnica', TOP);
  otwor(s, 'ag', v.xG, X0, 1, UG, true); otwor(s, 'bg', v.xG, X0, -1, UG, true);
  otwor(s, 'ao', v.xO, XO, 1, UO, false); otwor(s, 'bo', v.xO, XO, -1, UO, false);
  const l0 = v.xO - v.ocP - v.opP, l1 = l0 + v.lozL, l2 = v.xO - v.ocP;
  const el0 = `${XO} - #uOrcz_cP - #uOrcz_pP`, el1 = `${el0} + #lozyskoL`, el2 = `${XO} - #uOrcz_cP`;
  const rl = v.czopD / 2 + v.luzObr, erl = '#czopD / 2 + #luzObrotnicy';
  s.poly('lz', [[l0, 0, el0, null], [l2, 0, el2, null], [l2, v.m3PoglD / 2, el2, '#m3PoglD / 2'], [l1, v.m3PoglD / 2, el1, '#m3PoglD / 2'], [l1, rl, el1, erl], [l0, rl, el0, erl]]);
  const w = await G.zap(s.feature(), true); P4.S5 = w.featureId;
  const kG = cialo(P4.R1, [v.xG, 0, 0]), kO = cialo(P4.R1, [v.xO, 0, 0]);
  const pG = [top(v.xG + 0.4, (UG.dno + UG.hi) / 2), top(v.xG + 0.4, -(UG.dno + UG.hi) / 2)], pO = [top(v.xO + 0.4, (UO.dno + UO.hi) / 2), top(v.xO + 0.4, -(UO.dno + UO.hi) / 2)];
  const v3 = await G.zap(G.rev('P4: oś a2 G', G.regs(P4.S5, pG), G.q.edge(P4.S5, 'ag6'), { op: 'REMOVE', scope: [G.q.body(P4.R2), kG] }), false); P4.V3 = v3.featureId;
  const v4 = await G.zap(G.rev('P4: oś a2 O', G.regs(P4.S5, pO), G.q.edge(P4.S5, 'ao5'), { op: 'REMOVE', scope: [G.q.body(P4.R3), kO] }), false); P4.V4 = v4.featureId;
  const v5 = await G.zap(G.rev('P4: obrotnica – łożysko i pogłębienie', G.regs(P4.S5, [top((l0 + l1) / 2, 1)]), G.q.edge(P4.S5, 'lz0'), { op: 'REMOVE', scope: [G.q.body(P4.R3)] }), false); P4.V5 = v5.featureId;
  return [w, v3, v4, v5].map((x) => [x.nazwa, x.featureStatus, x.under, x.podpowiedz]);
};
return 'P4 ok';
})();
