// E6.6 – komplet pręta Y (plan e6.6-plan-ramiona-prety.md, zatwierdzony b774b5e): jak P4, bez klocków, pręt pretY, oś w y = kompletY_y0.
// Wymaga biblioteki G. Kroki: KY.zmienne(), potem KY.k1() … KY.k5(), każdy dwa razy: 1. wywołanie zapisuje szkic (kontrola znacznika w drzewie po zrzucie), 2. operacje bryłowe.
(() => {
const G = window.G, KY = window.KY = window.KY || {}; const d2r = Math.PI / 180;
KY.Fz = KY.Fz || {};
const zap = async (key, f, sk) => { const w = await G.zap(f, sk); KY.Fz[key] = w.featureId; return w; };
const st = (ws) => ws.map((w) => [w.nazwa, w.featureStatus, w.under]);
// pierwszy przebieg kroku: tylko szkic (i płaszczyzna), potem stop na kontrolę znacznika
// przy ukrytej karcie skanuj() zwraca zaślepkę bez podpowiedzi: znacznik przyjmuje się dopiero z odczytu z podpowiedzią (po zrzucie ekranu)
const szkic = async (key, s) => { if (KY.Fz[key]) return null; const w = await zap(key, s.feature(), true); return [w.podpowiedz ? 'szkic – znacznik odczytany' : 'szkic – ZNACZNIK NIESPRAWDZONY: zrzut i ponowny odczyt', st([w]), w.podpowiedz]; };
const plQ = (fid) => `query=qCreatedBy(makeId("${fid}"), EntityType.FACE);`;
const TOP = G.q.std('Top');
// wartości startowe (po korekcie v3.2)
const v = KY.v = { y0: 40, xG: 80, L: 46.179, gDo: 5.75, gHr: 4, gLuz: 0.125, gPol: 2, grP: 2.3, gcP: 5.5, gpP: 2, oDo: 8, oHr: 4, oLuz: 0.125, oPol: 2, orP: 2.6, ocP: 5.5, opP: 6.5,
  tulejaD: 7, tulejaL: 6, czopD: 4.4, czopL: 3.4, luzObr: 0.2, m3PoglD: 6, m3PoglH: 3.2, m3WkretL: 12, gwintZapas: 0.5, podstawaOD: 8, pretD: 4.5, druk: 1.8, m2: 1.6, m2PoglD: 3.8, m3Ciasny: 2.6 };
v.xO = v.xG + v.L; v.gHi = v.gDo / 2 + v.gLuz; v.gHo = v.gHi + v.gPol; v.oHi = v.oDo / 2 + v.oLuz; v.oHo = v.oHi + v.oPol; v.lozL = v.opP - v.m3PoglH;
v.gDnoA2 = v.gDo / 2 - (3.45 - v.gPol - v.gLuz + 0.25); v.oDnoA2 = v.oDo / 2 - (4 - v.oPol - v.oLuz + 0.25);
const X0 = '#p4X0', XO = '#kompletYXO', Y0 = '#kompletY_y0';
KY.zmienne = async () => {
  const url = `/api/v12/variables/d/${G.doc.did}/w/${G.doc.wid}/e/${G.doc.vs}/variables`;
  const r0 = await G.req('GET', url); const lista = r0.json[0].variables; const nazwy = new Set(lista.map((x) => x.name));
  if (nazwy.has('kompletY_y0')) throw new Error('już są');
  const baza = lista.map((x) => ({ name: x.name, type: x.type, expression: x.name === 'pretY' ? '46.179 mm' : x.expression, description: x.description || '' }));
  const nowe = [{ name: 'kompletY_y0', type: 'LENGTH', expression: '40 mm', description: 'komplet pręta Y: oś w y = y0 (poza modułem, obok P4)' }];
  if (!nazwy.has('pretY') || !nazwy.has('p4X0')) throw new Error('brak pretY / p4X0');
  KY.vsPrzed = lista.map((x) => [x.name, x.expression]);
  const r1 = await G.req('POST', url, [...baza, ...nowe, { name: 'kompletYXO', type: 'LENGTH', expression: '#p4X0 + #pretY', description: 'komplet Y: środek krzyżaka O' }]);
  if (!r1.ok) throw new Error('VS ' + r1.status + ' ' + JSON.stringify(r1.json || r1.text).slice(0, 300));
  await G.mvOdswiez(); return { przed: lista.length, po: baza.length + 2, pretY: lista.find((x) => x.name === 'pretY').expression };
};
// punkt w płaszczyźnie Top z osią w y0: [u, y0 + w, exU, exV]
const T = (u, w, eu, ew) => [u, v.y0 + w, eu, ew === null ? Y0 : (w >= 0 ? `${Y0} + ${ew}` : (/ [-+] /.test(ew) ? `${Y0} - (${ew})` : `${Y0} - ${ew}`))];
const prostOs = (u0, u1, h, e0, e1, eh) => [T(u0, 0, e0, null), T(u1, 0, e1, null), T(u1, h, e1, eh), T(u0, h, e0, eh)];
const top = (u, w) => [u, v.y0 + w, 0], fr = (u, w) => [u, v.y0, w];
// krok 1: przekroje obrotowe (krzyżaki, pręt) + R1 + R2
KY.k1 = async () => {
  const s = new G.Sk('Komplet Y: przekroje obrotowe', TOP);
  s.poly('kg', prostOs(v.xG - v.gHr / 2, v.xG + v.gHr / 2, v.gDo / 2, `${X0} - #uGal_Hr / 2`, `${X0} + #uGal_Hr / 2`, '#uGal_Do / 2'));
  s.poly('ko', prostOs(v.xO - v.oHr / 2, v.xO + v.oHr / 2, v.oDo / 2, `${XO} - #uOrcz_Hr / 2`, `${XO} + #uOrcz_Hr / 2`, '#uOrcz_Do / 2'));
  const xs = v.xG + v.gcP + v.gpP, xt1 = v.xO - v.ocP - v.opP, xt0 = xt1 - v.tulejaL, xc = xt1 + v.czopL, xh = xc - v.m3WkretL - v.gwintZapas;
  const eXs = `${X0} + #uGal_cP + #uGal_pP`, eXt1 = `${XO} - #uOrcz_cP - #uOrcz_pP`, eXt0 = `${eXt1} - #tulejaL`, eXc = `${eXt1} + #czopL`, eXh = `${eXc} - #m3WkretL - #gwintZapas`;
  s.poly('pr', [T(xs, 0, eXs, null), T(xh, 0, eXh, null), T(xh, v.m3Ciasny / 2, eXh, '#m3Ciasny / 2'), T(xc, v.m3Ciasny / 2, eXc, '#m3Ciasny / 2'), T(xc, v.czopD / 2, eXc, '#czopD / 2'),
    T(xt1, v.czopD / 2, eXt1, '#czopD / 2'), T(xt1, v.tulejaD / 2, eXt1, '#tulejaD / 2'), T(xt0, v.tulejaD / 2, eXt0, '#tulejaD / 2'), T(xt0, v.pretD / 2, eXt0, '#pretD / 2'), T(xs, v.pretD / 2, eXs, '#pretD / 2')]);
  const p = await szkic('S1', s); if (p) return p; const w = { nazwa: s.name, featureStatus: 'OK (wcześniej)' };
  const r1 = await zap('R1', G.rev('Komplet Y: krzyżaki', G.regs(KY.Fz.S1, [top(v.xG, 1), top(v.xO, 1)]), G.q.edge(KY.Fz.S1, 'kg0')), false);
  const r2 = await zap('R2', G.rev('Komplet Y: pręt – czop, tulejka, pręt', G.regs(KY.Fz.S1, [top((xs + xh) / 2, 1)]), G.q.edge(KY.Fz.S1, 'pr0')), false);
  return st([w, r1, r2]);
};
// krok 2: płaszczyzna y0 (Front offset), szkic: podstawa O (półprzekrój) + uszy zaokrągleń widełek pręta; R3
KY.k2 = async () => {
  if (!KY.Fz.PL) await zap('PL', G._F('cPlane', 'Komplet Y: płaszczyzna osi', [G.pq('entities', G.q.std('Front')), G.pe('cPlane', 'cplaneType', 'OFFSET'), G.pn('offset', Y0), G.pb('oppositeDirection', true)]), false);
  const wp = { nazwa: 'Komplet Y: płaszczyzna osi', featureStatus: 'OK' };
  const s = new G.Sk('Komplet Y: podstawa O i zaokrąglenia', plQ(KY.Fz.PL));
  const pb0 = v.xO - v.ocP - v.opP, pb1 = v.xO - v.ocP;
  s.poly('pb', [[pb0, 0, `${XO} - #uOrcz_cP - #uOrcz_pP`, null], [pb1, 0, `${XO} - #uOrcz_cP`, null], [pb1, v.podstawaOD / 2, `${XO} - #uOrcz_cP`, '#podstawaOD / 2'], [pb0, v.podstawaOD / 2, `${XO} - #uOrcz_cP - #uOrcz_pP`, '#podstawaOD / 2']]);
  s.ucho('ug1', v.xG, v.grP, 1, X0, '#uGal_rP'); s.ucho('ug2', v.xG, v.grP, 2, X0, '#uGal_rP');
  s.ucho('uo0', v.xO, v.orP, 0, XO, '#uOrcz_rP'); s.ucho('uo3', v.xO, v.orP, 3, XO, '#uOrcz_rP');
  const p = await szkic('S3', s); if (p) return p; const w = { nazwa: s.name, featureStatus: 'OK (wcześniej)' };
  const r3 = await zap('R3', G.rev('Komplet Y: widełki pręta O – podstawa', G.regs(KY.Fz.S3, [fr((pb0 + pb1) / 2, 1)]), G.q.edge(KY.Fz.S3, 'pb0')), false);
  return st([wp, w, r3]);
};
// krok 3: widełki pręta (Top): U pręta G z trójkątami, U widełek O; E1, E2, C2
KY.k3 = async () => {
  const s = new G.Sk('Komplet Y: widełki pręta', TOP);
  const t = v.xG - v.grP, c = v.xG + v.gcP, b = v.xG + v.gcP + v.gpP, tr = b + v.gHo - v.pretD / 2;
  const et = `${X0} - #uGal_rP`, ec = `${X0} + #uGal_cP`, eb = `${X0} + #uGal_cP + #uGal_pP`, etr = `${eb} + #uGal_ho - #pretD / 2`;
  s.poly('wg', [T(t, v.gHo, et, '#uGal_ho'), T(b, v.gHo, eb, '#uGal_ho'), T(tr, v.pretD / 2, etr, '#pretD / 2'), T(tr, -v.pretD / 2, etr, '#pretD / 2'),
    T(b, -v.gHo, eb, '#uGal_ho'), T(t, -v.gHo, et, '#uGal_ho'), T(t, -v.gHi, et, '#uGal_hi'), T(c, -v.gHi, ec, '#uGal_hi'), T(c, v.gHi, ec, '#uGal_hi'), T(t, v.gHi, et, '#uGal_hi')]);
  const ob = v.xO - v.ocP - v.opP, oc = v.xO - v.ocP, ot = v.xO + v.orP;
  const eob = `${XO} - #uOrcz_cP - #uOrcz_pP`, eoc = `${XO} - #uOrcz_cP`, eot = `${XO} + #uOrcz_rP`;
  s.poly('wo', [T(ob, v.oHo, eob, '#uOrcz_ho'), T(ot, v.oHo, eot, '#uOrcz_ho'), T(ot, v.oHi, eot, '#uOrcz_hi'), T(oc, v.oHi, eoc, '#uOrcz_hi'),
    T(oc, -v.oHi, eoc, '#uOrcz_hi'), T(ot, -v.oHi, eot, '#uOrcz_hi'), T(ot, -v.oHo, eot, '#uOrcz_ho'), T(ob, -v.oHo, eob, '#uOrcz_ho')]);
  const p = await szkic('S2', s); if (p) return p; const w = { nazwa: s.name, featureStatus: 'OK (wcześniej)' };
  const e1 = await zap('E1', G.ext('Komplet Y: widełki pręta G', G.regs(KY.Fz.S2, [top(c + 1, 0)]), { op: 'ADD', depth: '2 * #uGal_rP', sym: true, scope: [G.q.body(KY.Fz.R2)] }), false);
  const e2 = await zap('E2', G.ext('Komplet Y: widełki pręta O – policzki', G.regs(KY.Fz.S2, [top(ob + 1, 0)]), { op: 'ADD', depth: '2 * #uOrcz_rP', sym: true, scope: [G.q.body(KY.Fz.R3)] }), false);
  const uszy = [fr(v.xG - v.grP * 0.9, v.grP * 0.9), fr(v.xG - v.grP * 0.9, -v.grP * 0.9), fr(v.xO + v.orP * 0.9, v.orP * 0.9), fr(v.xO + v.orP * 0.9, -v.orP * 0.9)];
  const c2 = await zap('C2', G.ext('Komplet Y: zaokrąglenie widełek pręta', G.regs(KY.Fz.S3, uszy), { op: 'REMOVE', depth: '2 * #p4BlokH', sym: true, scope: [G.q.body(KY.Fz.R2), G.q.body(KY.Fz.R3)] }), false);
  return st([w, e1, e2, c2]);
};
// krok 4: osie a1 (przelot przez krążek) w płaszczyźnie osi; V1, V2
const przelot = (s, pre, x0, ex0, r, eR) => s.poly(pre, [[x0, -r, ex0, eR], [x0 + v.druk / 2, -r, `${ex0} + #sworzenOtworDruk / 2`, eR], [x0 + v.druk / 2, r, `${ex0} + #sworzenOtworDruk / 2`, eR], [x0, r, ex0, eR]]);
KY.k4 = async () => {
  const s = new G.Sk('Komplet Y: osie a1', plQ(KY.Fz.PL));
  przelot(s, 'ag', v.xG, X0, v.gHi, '#uGal_hi'); przelot(s, 'ao', v.xO, XO, v.oHi, '#uOrcz_hi');
  const p = await szkic('S4', s); if (p) return p; const w = { nazwa: s.name, featureStatus: 'OK (wcześniej)' };
  const kG = `query=qContainsPoint(qCreatedBy(makeId("${KY.Fz.R1}"), EntityType.BODY), vector(${(v.xG + 1.5) / 1000}, ${(v.y0 + 1.5) / 1000}, 0.0015) * meter);`;
  const kO = `query=qContainsPoint(qCreatedBy(makeId("${KY.Fz.R1}"), EntityType.BODY), vector(${(v.xO + 1.5) / 1000}, ${(v.y0 + 1.5) / 1000}, 0.0015) * meter);`;
  KY.kG = kG; KY.kO = kO;
  const v1 = await zap('V1', G.rev('Komplet Y: oś a1 G', G.regs(KY.Fz.S4, [fr(v.xG + 0.4, 0)]), G.q.edge(KY.Fz.S4, 'ag3'), { op: 'REMOVE', scope: [kG] }), false);
  const v2 = await zap('V2', G.rev('Komplet Y: oś a1 O', G.regs(KY.Fz.S4, [fr(v.xO + 0.4, 0)]), G.q.edge(KY.Fz.S4, 'ao3'), { op: 'REMOVE', scope: [kO] }), false);
  return st([w, v1, v2]);
};
// krok 5: osie a2 (G z pogłębieniem DIN 7991, O bez) i obrotnica (Top); V3, V4, V5
const otwA2 = (s, pre, x0, ex0, sg, dno, eDno, hi, eHi, ho, eHo, pogl) => {
  const d = v.druk / 2, m = v.m2 / 2, pd = v.m2PoglD / 2; const P = (du, edu, w, ew) => T(x0 + du, sg * w, edu ? `${ex0} + ${edu}` : ex0, ew);
  const q = [P(0, null, dno, eDno), P(d, '#sworzenOtworDruk / 2', dno, eDno), P(d, '#sworzenOtworDruk / 2', hi, eHi), P(m, '#m2Gwint / 2', hi, eHi)];
  if (pogl) q.push(P(m, '#m2Gwint / 2', ho - (pd - m), `${eHo} - (#m2PoglD - #m2Gwint) / 2`), P(pd, '#m2PoglD / 2', ho, eHo)); else q.push(P(m, '#m2Gwint / 2', ho, eHo));
  q.push(P(0, null, ho, eHo)); return s.poly(pre, sg > 0 ? q : q.reverse());
};
KY.k5 = async () => {
  const s = new G.Sk('Komplet Y: osie a2 i obrotnica', TOP);
  otwA2(s, 'ag', v.xG, X0, 1, v.gDnoA2, '#uGal_Do / 2 - #uGal_otwGlA2', v.gHi, '#uGal_hi', v.gHo, '#uGal_ho', true);
  otwA2(s, 'bg', v.xG, X0, -1, v.gDnoA2, '#uGal_Do / 2 - #uGal_otwGlA2', v.gHi, '#uGal_hi', v.gHo, '#uGal_ho', true);
  otwA2(s, 'ao', v.xO, XO, 1, v.oDnoA2, '#uOrcz_Do / 2 - #uOrcz_otwGl', v.oHi, '#uOrcz_hi', v.oHo, '#uOrcz_ho', false);
  otwA2(s, 'bo', v.xO, XO, -1, v.oDnoA2, '#uOrcz_Do / 2 - #uOrcz_otwGl', v.oHi, '#uOrcz_hi', v.oHo, '#uOrcz_ho', false);
  const l0 = v.xO - v.ocP - v.opP, l1 = l0 + v.lozL, l2 = v.xO - v.ocP, el0 = `${XO} - #uOrcz_cP - #uOrcz_pP`, el1 = `${el0} + #lozyskoL`, el2 = `${XO} - #uOrcz_cP`;
  const rl = v.czopD / 2 + v.luzObr, erl = '#czopD / 2 + #luzObrotnicy';
  s.poly('lz', [T(l0, 0, el0, null), T(l2, 0, el2, null), T(l2, v.m3PoglD / 2, el2, '#m3PoglD / 2'), T(l1, v.m3PoglD / 2, el1, '#m3PoglD / 2'), T(l1, rl, el1, erl), T(l0, rl, el0, erl)]);
  const p = await szkic('S5', s); if (p) return p; const w = { nazwa: s.name, featureStatus: 'OK (wcześniej)' };
  const mg = (v.gDnoA2 + v.gHi) / 2, mo = (v.oDnoA2 + v.oHi) / 2;
  const v3 = await zap('V3', G.rev('Komplet Y: oś a2 G', G.regs(KY.Fz.S5, [top(v.xG + 0.4, mg), top(v.xG + 0.4, -mg)]), G.q.edge(KY.Fz.S5, 'ag6'), { op: 'REMOVE', scope: [G.q.body(KY.Fz.R2), KY.kG] }), false);
  const v4 = await zap('V4', G.rev('Komplet Y: oś a2 O', G.regs(KY.Fz.S5, [top(v.xO + 0.4, mo), top(v.xO + 0.4, -mo)]), G.q.edge(KY.Fz.S5, 'ao5'), { op: 'REMOVE', scope: [G.q.body(KY.Fz.R3), KY.kO] }), false);
  const v5 = await zap('V5', G.rev('Komplet Y: obrotnica – łożysko i pogłębienie', G.regs(KY.Fz.S5, [top((l0 + l1) / 2, 1)]), G.q.edge(KY.Fz.S5, 'lz0'), { op: 'REMOVE', scope: [G.q.body(KY.Fz.R3)] }), false);
  return st([w, v3, v4, v5]);
};
return 'KY ok';
})();
