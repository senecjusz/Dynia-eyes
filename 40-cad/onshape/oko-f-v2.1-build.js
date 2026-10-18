// Budowa modelu "Oko F v2.1c" (modul malego oka: jednoczesciowa obudowa bez bagnetu, pileczka wklejona w jarzmo z miska,
// przeguby na srubach M3) w Onshape ze zwyklych operacji (Variable Studio, Plane, Sketch, Extrude, Revolve, Helix,
// Sweep, Chamfer, Move face, Boolean) przez REST API w sesji przegladarki (cookie + X-XSRF-TOKEN), bez kluczy API.
//
// Uzycie: otworz puste Part Studio "Oko F v2.1" w galezi v2 dokumentu SimpleEye, wklej caly plik do konsoli i uruchom:
//   await OS.all()        // zmienne + wszystkie czesci + nazwy czesci
//   await OS.zlozenie()   // Assembly z grupami i mate'ami (potem recznie: Obudowa -> Fix)
// Kazda sekcja to osobna funkcja (OS.obudowa(), OS.jarzmo() ...). Ponowne uruchomienie sekcji aktualizuje
// istniejace operacje (mapa nazwa -> featureId jest w localStorage strony), zamiast dodawac nowe.
// Foldery w drzewie i ukrycie plaszczyzn/szkicow robi sie recznie (REST API ich nie obsluguje).
// Endpointu /featurescript nie uzywamy (bardzo niski limit; 429 z Retry-After ~20 h).
// Kolizje w ruchu: oko-f-v2-kolizje.js (po OS.all()).
//
// Uklad: os oka = Y (pionowa), +Z na zewnatrz dyni, plaszczyzna Top (z = 0) = wierzch rantu, +Y = GORA.
// Szkice sa rysowane we wspolrzednych swiata (funkcja sketchW przelicza je przez macierz plaszczyzny),
// srednice i glebokosci glownych elementow sa wyrazeniami ze zmiennych #... z Variable Studio "Zmienne v2".
// Polozenia drobnych elementow (przeguby, slupki, zaczepy) sa liczbami z tablicy D (zgodnymi z domyslnymi zmiennymi).

// ===================== lib.js =====================
// Pomocnicze funkcje do budowy modelu w Onshape przez REST API (sesja przegladarki).
(() => {
const OS = window.OS || { log: [], F: {} };
const xsrf = decodeURIComponent((document.cookie.match(/XSRF-TOKEN=([^;]+)/) || [])[1] || '');
const H = { Accept: 'application/json', 'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrf };
const [, did, wid, eid] = location.pathname.match(/documents\/(\w+)\/w\/(\w+)\/e\/(\w+)/);
const base = `/api/v10/partstudios/d/${did}/w/${wid}/e/${eid}`;
const F = OS.F;
try { Object.assign(F, JSON.parse(localStorage.getItem('OSv2F_' + eid) || '{}')); } catch (e) {}
const save = () => { try { localStorage.setItem('OSv2F_' + eid, JSON.stringify(F)); } catch (e) {} };
let specs = null;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function req(url, opt = {}) {
  for (let k = 0; k < 4; k++) {
    const r = await fetch(url, { headers: H, ...opt });
    await sleep(350);
    if (r.status === 429) { const ra = +(r.headers.get('Retry-After') || 5); if (ra > 600) { OS.stop = true; throw new Error('429, Retry-After ' + ra + ' s - STOP'); } OS.log.push(`429, czekam ${ra}s`); await sleep((ra + 1 + k * 2) * 1000); continue; }
    if (r.status === 402) { OS.stop = true; throw new Error('HTTP 402 - limit API, STOP'); }
    const rem = r.headers.get('X-Rate-Limit-Remaining'); if (rem) OS.rem = rem;
    return r;
  }
  throw new Error('429 x4: ' + url);
}
const mm = (v) => `${+v.toFixed(4)} mm`;
const deg = (v) => `${+v.toFixed(4)} deg`;
const Q = (s) => ({ btType: 'BTMIndividualQuery-138', queryString: s });
const qBody = (n) => `query=qCreatedBy(makeId("${F[n]}"), EntityType.BODY);`;
const qEdge = (n) => `query=qCreatedBy(makeId("${F[n]}"), EntityType.EDGE);`;
const qFace = (n) => `query=qCreatedBy(makeId("${F[n]}"), EntityType.FACE);`;
const qReg = (n) => `query=qSketchRegion(makeId("${F[n]}"), true);`;
const qStd = (p) => `query=qCreatedBy(makeId("${p}"), EntityType.FACE);`;
// krawedz/sciana najblizsza punktowi (mm) sposrod utworzonych przez operacje n (lub cialo czesci n)
const v3 = (p) => `vector(${p.map((x) => +(x / 1000).toFixed(12)).join(', ')}) * meter`;
const qNearEdge = (n, p, owner) => `query=qClosestTo(${owner ? `qOwnedByBody(qCreatedBy(makeId("${F[n]}"), EntityType.BODY), EntityType.EDGE)` : `qCreatedBy(makeId("${F[n]}"), EntityType.EDGE)`}, ${v3(p)});`;
const qNearFace = (n, p, owner) => `query=qClosestTo(${owner ? `qOwnedByBody(qCreatedBy(makeId("${F[n]}"), EntityType.BODY), EntityType.FACE)` : `qCreatedBy(makeId("${F[n]}"), EntityType.FACE)`}, ${v3(p)});`;

async function enumName(ft, pid) {
  if (!specs) specs = (await (await req(base + '/featurespecs')).json()).featureSpecs;
  const s = specs.find((x) => x.featureType === ft);
  const p = s.parameters.find((x) => x.parameterId === pid);
  if (!p) throw new Error(`brak parametru ${ft}.${pid}`);
  return p.enumName;
}
const pq = (id, ...qs) => ({ btType: 'BTMParameterQueryList-148', parameterId: id, queries: qs.map(Q) });
const pn = (id, e) => ({ btType: 'BTMParameterQuantity-147', parameterId: id, expression: String(e), isInteger: false });
const pb = (id, v) => ({ btType: 'BTMParameterBoolean-144', parameterId: id, value: v });
const ps = (id, v) => ({ btType: 'BTMParameterString-149', parameterId: id, value: v });
const pe = async (ft, id, v) => ({ btType: 'BTMParameterEnum-145', parameterId: id, enumName: await enumName(ft, id), value: v });

async function post(feature, key) {
  if (OS.stop) throw new Error('STOP');
  const exist = F[key];
  const url = exist ? base + '/features/featureid/' + exist : base + '/features';
  if (exist) feature.featureId = exist;
  const r = await req(url, { method: 'POST', body: JSON.stringify({ feature }) });
  const j = await r.json();
  const st = j.featureState ? j.featureState.featureStatus : 'HTTP' + r.status + ' ' + JSON.stringify(j).slice(0, 300);
  if (j.feature && j.feature.featureId) F[key] = j.feature.featureId;
  save();
  OS.log.push(`${key}: ${st}`);
  if (st !== 'OK' && st !== 'INFO') throw new Error(`${key}: ${st}`);
  return F[key];
}

class Sk {
  constructor() { this.e = []; this.c = []; this.k = 0; }
  id(p) { return p + ++this.k; }
  circle(x, y, d, expr) {
    const id = this.id('c');
    this.e.push({ btType: 'BTMSketchCurve-4', entityId: id, centerId: id + '.center',
      geometry: { btType: 'BTCurveGeometryCircle-115', radius: d / 2000, xCenter: x / 1000, yCenter: y / 1000, xDir: 1, yDir: 0, clockwise: false } });
    if (expr) this.c.push({ btType: 'BTMSketchConstraint-2', constraintType: 'DIAMETER', entityId: this.id('d'),
      parameters: [ps('localFirst', id), pn('length', expr)] });
    return id;
  }
  line(x1, y1, x2, y2, constr = false) {
    const id = this.id('l');
    const L = Math.hypot(x2 - x1, y2 - y1);
    this.e.push({ btType: 'BTMSketchCurveSegment-155', entityId: id, startPointId: id + '.start', endPointId: id + '.end',
      startParam: 0, endParam: L / 1000, isConstruction: constr,
      geometry: { btType: 'BTCurveGeometryLine-117', pntX: x1 / 1000, pntY: y1 / 1000, dirX: (x2 - x1) / L, dirY: (y2 - y1) / L } });
    return id;
  }
  poly(pts) {
    pts = pts.filter((p, i, A) => Math.hypot(p[0] - A[(i + 1) % A.length][0], p[1] - A[(i + 1) % A.length][1]) > 0.005);
    const ids = pts.map((a, i) => { const b = pts[(i + 1) % pts.length]; return this.line(a[0], a[1], b[0], b[1]); });
    ids.forEach((id, i) => this.c.push({ btType: 'BTMSketchConstraint-2', constraintType: 'COINCIDENT', entityId: this.id('k'),
      parameters: [ps('localFirst', id + '.end'), ps('localSecond', ids[(i + 1) % ids.length] + '.start')] }));
  }
  rect(x0, y0, x1, y1) { this.poly([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]); }
  radial(r0, r1, w, a) {
    const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180);
    const R = (x, y) => [x * c - y * s, x * s + y * c];
    this.poly([R(r0, -w / 2), R(r1, -w / 2), R(r1, w / 2), R(r0, w / 2)]);
  }
  // pas (prostokat) o szerokosci w miedzy punktami p i q
  pas(p, q, w) { const L = Math.hypot(q[0] - p[0], q[1] - p[1]); const n = [-(q[1] - p[1]) / L * w / 2, (q[0] - p[0]) / L * w / 2];
    this.poly([[p[0] + n[0], p[1] + n[1]], [q[0] + n[0], q[1] + n[1]], [q[0] - n[0], q[1] - n[1]], [p[0] - n[0], p[1] - n[1]]]); }
  // wycinek pierscienia (lamana) r0..r1 od kata a0 do a1 (st., od osi x szkicu), srodek (cx,cy)
  sector(cx, cy, r0, r1, a0, a1, n = 16) {
    const P = []; for (let i = 0; i <= n; i++) { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; P.push([cx + r1 * Math.cos(a), cy + r1 * Math.sin(a)]); }
    for (let i = n; i >= 0; i--) { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; P.push([cx + r0 * Math.cos(a), cy + r0 * Math.sin(a)]); }
    this.poly(P);
  }
}

const sketch = (key, planeQ, sk) => post({ btType: 'BTMSketch-151', featureType: 'newSketch', name: key,
  parameters: [pq('sketchPlane', planeQ)], entities: sk.e, constraints: sk.c }, key);
async function plane(key, baseQ, offset, opposite) {
  const ft = 'cPlane';
  return post({ btType: 'BTMFeature-134', featureType: ft, name: key, parameters: [
    pq('entities', baseQ), await pe(ft, 'cplaneType', 'OFFSET'), pn('offset', offset), pb('oppositeDirection', !!opposite)] }, key);
}
async function planeAngle(key, axisKey, refQ, angle) {
  const ft = 'cPlane';
  return post({ btType: 'BTMFeature-134', featureType: ft, name: key, parameters: [
    pq('entities', qEdge(axisKey), refQ), await pe(ft, 'cplaneType', 'LINE_ANGLE'), pn('angle', angle)] }, key);
}
// o: {op, depth, opp, sym, through, scope, regions, depth2}
async function extrude(key, skKey, o) {
  const ft = 'extrude';
  const p = [await pe(ft, 'bodyType', 'SOLID'), await pe(ft, 'operationType', o.op || 'NEW'), pq('entities', o.regions || qReg(skKey)),
    await pe(ft, 'endBound', o.through ? 'THROUGH_ALL' : 'BLIND'), pn('depth', o.depth || '1 mm'),
    pb('oppositeDirection', !!o.opp), pb('symmetric', !!o.sym)];
  if (o.scope) p.push(pb('defaultScope', false), pq('booleanScope', ...[].concat(o.scope).map(qBody)));
  return post({ btType: 'BTMFeature-134', featureType: ft, name: key, parameters: p }, key);
}
async function revolve(key, skKey, axisKey, o) {
  const ft = 'revolve';
  const p = [await pe(ft, 'bodyType', 'SOLID'), await pe(ft, 'operationType', o.op || 'NEW'), pq('entities', o.regions || qReg(skKey)),
    pq('axis', o.axisQ || qEdge(axisKey)), pb('fullRevolve', !!o.full), await pe(ft, 'endBound', 'BLIND'), pn('angle', o.angle || '360 deg'),
    pb('oppositeDirection', !!o.opp)];
  if (o.scope) p.push(pb('defaultScope', false), pq('booleanScope', ...[].concat(o.scope).map(qBody)));
  return post({ btType: 'BTMFeature-134', featureType: ft, name: key, parameters: p }, key);
}
async function helix(key, circleSkKey, pitch, height) {
  const ft = 'helix';
  return post({ btType: 'BTMFeature-134', featureType: ft, name: key, parameters: [
    await pe(ft, 'axisType', 'CIRCLE'), pq('edge', qEdge(circleSkKey)), pq('entities', qEdge(circleSkKey)),
    await pe(ft, 'pathType', 'PITCH'), await pe(ft, 'endType', 'HEIGHT'), pn('height', height), pn('helicalPitch', pitch),
    await pe(ft, 'startType', 'START_ANGLE'), pn('startAngle', '0 deg'), await pe(ft, 'handedness', 'CW')] }, key);
}
async function sweep(key, profKey, pathKey, op, scope) {
  const ft = 'sweep';
  const p = [await pe(ft, 'bodyType', 'SOLID'), await pe(ft, 'operationType', op), pq('profiles', qReg(profKey)),
    pq('path', qEdge(pathKey)), await pe(ft, 'profileControl', 'NONE')];
  if (scope) p.push(pb('defaultScope', false), pq('booleanScope', ...[].concat(scope).map(qBody)));
  return post({ btType: 'BTMFeature-134', featureType: ft, name: key, parameters: p }, key);
}
async function cpattern(key, featKeys, axisQ, angle, count, scope) {
  const ft = 'circularPattern';
  const p = [await pe(ft, 'patternType', 'FEATURE'),
    { btType: 'BTMParameterFeatureList-1749', parameterId: 'instanceFunction', featureIds: featKeys.map((k) => F[k]) },
    pq('axis', axisQ), pn('angle', angle), pn('instanceCount', count), pb('equalSpace', false)];
  if (scope) p.push(pb('defaultScope', false), pq('booleanScope', ...[].concat(scope).map(qBody)));
  return post({ btType: 'BTMFeature-134', featureType: ft, name: key, parameters: p }, key);
}
async function chamfer(key, edgeQs, width) {
  const ft = 'chamfer';
  return post({ btType: 'BTMFeature-134', featureType: ft, name: key, parameters: [
    pq('entities', ...edgeQs), await pe(ft, 'chamferType', 'EQUAL_OFFSETS'), pn('width', width)] }, key);
}
async function moveFaceOffset(key, faceQs, dist) {
  const ft = 'moveFace';
  return post({ btType: 'BTMFeature-134', featureType: ft, name: key, parameters: [
    await pe(ft, 'moveFaceType', 'OFFSET'), pq('moveFaces', ...faceQs), pn('offsetDistance', dist), pb('oppositeDirection', false)] }, key);
}
async function booleanOp(key, type, toolQs, targetQs, keep) {
  const ft = 'booleanBodies';
  const p = [await pe(ft, 'operationType', type), pq('tools', ...toolQs)];
  if (targetQs) p.push(pq('targets', ...targetQs));
  if (keep) p.push(pb('keepTools', true));
  return post({ btType: 'BTMFeature-134', featureType: ft, name: key, parameters: p }, key);
}
async function fs(script) {
  const r = await req(base + '/featurescript', { method: 'POST', body: JSON.stringify({ script }) });
  return r.json();
}
async function features() { return (await req(base + '/features')).json(); }

Object.assign(OS, { H, did, wid, eid, base, F, save, req, sleep, mm, deg, Q, qBody, qEdge, qFace, qReg, qStd, v3, qNearEdge, qNearFace,
  pq, pn, pb, ps, pe, post, Sk, sketch, plane, planeAngle, extrude, revolve, helix, sweep, cpattern, chamfer, moveFaceOffset, booleanOp, fs, features, enumName });
// uruchamia sekcje po kolei; OS.status pokazuje, ktora trwa
OS.run = async (names) => { for (const s of names) { OS.status = s; await OS[s](); } OS.status = 'gotowe'; };
window.OS = OS;
return 'lib ok ' + eid + ' F=' + Object.keys(F).length;
})();

// ===================== v2.1: czesci =====================
// ===== Oko F v2.1: obudowa jednoczesciowa (bez bagnetu), pileczka wklejona w jarzmo z miska =====
(() => {
const OS = window.OS;
const { Sk, F, post, plane, planeAngle, extrude, revolve, helix, sweep, chamfer, moveFaceOffset, booleanOp,
  qStd, qFace, qEdge, qBody, qNearEdge, v3, req, base, pq, pn, pb, pe, mm, deg } = OS;
const r2d = 180 / Math.PI, d2r = Math.PI / 180;

// ---------- liczby (zgodne z domyslnymi zmiennymi) ----------
const D = {};
D.zc = -12; D.Rb = 20.25; D.kulaR = 20.25; D.klej = 0.5; D.oczkoT = 2.4;                    // srodek pileczki 12 mm pod wierzchem rantu (gałka wystaje ~8 mm)
D.hTop = -3;                                 // wierzch orczyka
D.mIR = 24.25; D.mOR = 26.25;                // obudowa: wnetrze 48.5, rdzen gwintu 52.5
D.gTop = 27.45;                              // szczyt gwintu (54.9)
D.pR = 28.1;                                 // przod w otworze (56.2), otwor w dyni 57
D.gL = 35.73;                                // koniec gwintu = krzywizna 2.73 + docisk 25 + nakretka 7 + 1
D.zEnd = -77.5;                              // koniec obudowy
// naped (czworobok): A os oka, C korba, H ramie orczyka, S wal serwa (x, z)
D.A = [0, D.zc]; D.korba = 25.25; D.alfa = 17; D.S = [0, -66]; D.ramie = 27; D.beta = 200;
D.C0 = [D.korba * Math.sin(D.alfa * d2r), D.zc - D.korba * Math.cos(D.alfa * d2r)];
D.H0 = [D.S[0] + D.ramie * Math.sin(D.beta * d2r), D.S[1] - D.ramie * Math.cos(D.beta * d2r)];
D.ciegno = Math.hypot(D.C0[0] - D.H0[0], D.C0[1] - D.H0[1]);
D.dirR = [(D.H0[0] - D.S[0]) / D.ramie, (D.H0[1] - D.S[1]) / D.ramie];
D.M2 = [D.S[0] + 13 * D.dirR[0], D.S[1] + 13 * D.dirR[1]];
// SG90 (wzdluz osi, wal z tylu korpusu, wystaje pod obudowe)
D.sSpod = -33.5; D.sUcho = -17.6; D.uszyL = 32.2; D.uszyRoz = 27.8;
D.sPrzod = D.S[1] + 16.6; D.sTyl = D.S[1] - 5.9; D.sSrodek = D.S[1] + 5.35;
D.uchoP = D.sSrodek + D.uszyRoz / 2; D.uchoT = D.sSrodek - D.uszyRoz / 2;
D.uszyP = D.sSrodek + D.uszyL / 2; D.uszyT = D.sSrodek - D.uszyL / 2;
// jarzmo z miska: pierscien w plaszczyznie przez os oka odchylonej o 60 st. od -Z ku +x, szerokosc 8
D.gamma = 60; D.u = [Math.sin(D.gamma * d2r), -Math.cos(D.gamma * d2r)]; D.n = [Math.cos(D.gamma * d2r), Math.sin(D.gamma * d2r)];
D.jW = 8;
D.dogAng = 255; D.dogR = 3.3;                // kolek ogranicznika (polarnie w XZ wokol osi, 90 st. = +z)
D.dog = [D.A[0] + D.dogR * Math.cos(D.dogAng * d2r), D.A[1] + D.dogR * Math.sin(D.dogAng * d2r)];
D.dogHalf = Math.asin(0.7 / D.dogR) * r2d; D.stop = 33;
D.J = [130, 0, D.zc];                        // przyrzad do wklejania
D.dyniaR = 150; D.sag = (r, R = D.dyniaR) => R - Math.sqrt(R * R - r * r);
D.flat = 23.2; D.zFlat = -64;                // splaszczenia tylu obudowy |x| <= 23.2 (rozstaw oczu 105 mm)

const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
async function mat(key) {
  const r = await req(base + '/sketches?sketchId=' + F[key]);
  const j = await r.json(); const M = j.sketches[0].sketchMatrix;
  return { X: [M[0], M[4], M[8]], Y: [M[1], M[5], M[9]], N: [M[2], M[6], M[10]], O: [M[3] * 1000, M[7] * 1000, M[11] * 1000] };
}
OS.M = OS.M || {};
async function sketchW(key, planeQ, draw) {
  if (!F[key]) await post({ btType: 'BTMSketch-151', featureType: 'newSketch', name: key, parameters: [pq('sketchPlane', planeQ)], entities: [], constraints: [] }, key);
  const m = OS.M[key] || (OS.M[key] = await mat(key));
  const L = (P) => { const d = sub(P, m.O); return [dot(d, m.X), dot(d, m.Y)]; };
  const sk = new Sk();
  const W = { circle: (P, d, expr) => { const p = L(P); return sk.circle(p[0], p[1], d, expr); }, poly: (Ps) => sk.poly(Ps.map(L)),
    line: (P, Q, c) => { const p = L(P), q = L(Q); return sk.line(p[0], p[1], q[0], q[1], c); }, pas: (P, Q, w) => sk.pas(L(P), L(Q), w), L, m, sk };
  draw(W);
  await post({ btType: 'BTMSketch-151', featureType: 'newSketch', name: key, parameters: [pq('sketchPlane', planeQ)], entities: sk.e, constraints: sk.c }, key);
  return m;
}
async function ext(key, skKey, dir, o = {}) { const m = OS.M[skKey]; const opp = dir ? dot(m.N, dir) < 0 : false; return extrude(key, skKey, { ...o, opp }); }
const regionAt = (skKey, P) => `query=qContainsPoint(qSketchRegion(makeId("${F[skKey]}"), false), ${v3(P)});`;
const allRegions = (skKey) => `query=qSketchRegion(makeId("${F[skKey]}"), false);`;
const planeY = (key, expr, sign) => plane(key, qStd('Front'), expr, sign > 0);
const planeZ = (key, expr, sign) => plane(key, qStd('Top'), expr, sign < 0);
const planeX = (key, expr, sign) => plane(key, qStd('Right'), expr, sign < 0);
const planeOff = (key, baseKey, expr, opp) => plane(key, qFace(baseKey), expr, opp);
const arcPts = (c, r, psi0, psi1, n, y) => { const P = []; for (let i = 0; i <= n; i++) { const p = (psi0 + (psi1 - psi0) * i / n) * d2r; P.push([c[0] + r * Math.sin(p), y, c[1] - r * Math.cos(p)]); } return P; };
const psiPt = (r, psi, y) => [D.A[0] + r * Math.sin(psi * d2r), y, D.A[1] - r * Math.cos(psi * d2r)];
const rotRect = (c, a, b, ha, hb, y) => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([s, t]) => [c[0] + s * ha * a[0] + t * hb * b[0], y, c[1] + s * ha * a[1] + t * hb * b[1]]);
const pXY = (r, a, z) => [r * Math.cos(a * d2r), r * Math.sin(a * d2r), z];
const radialW = (r0, r1, w, a, z) => { const c = Math.cos(a * d2r), s = Math.sin(a * d2r); const R = (x, y) => [x * c - y * s, x * s + y * c, z]; return [R(r0, -w / 2), R(r1, -w / 2), R(r1, w / 2), R(r0, w / 2)]; };
const UP = [0, 1, 0], DOWN = [0, -1, 0], FWD = [0, 0, 1], BACK = [0, 0, -1];
const W3 = (p, y) => [p[0], y, p[1]];
const add2 = (p, v, k) => [p[0] + k * v[0], p[1] + k * v[1]];
OS.D = D;
Object.assign(OS, { sketchW, ext, regionAt, allRegions, planeY, planeZ, planeX, planeOff, arcPts, psiPt, rotRect, pXY, radialW, UP, DOWN, FWD, BACK, mat, dot, sub });

// ---------- zmienne ----------
OS.VARS = [
  ['kulaDmax', '40.5 mm', 'najwieksza pileczka'],
  ['klej', '0.5 mm', 'szczelina na klej wypelniajacy (akrylowy 2K), pileczka 39.5-40.5'],
  ['jarzmoT', '2.5 mm', 'grubosc promieniowa miski (pierscienia jarzma)'],
  ['jarzmoW', '8 mm', 'szerokosc miski (grubosc na stole)'],
  ['oczkoT', '2.4 mm', 'grubosc oczka jarzma na osi (min. 2-2.4 po wydruku v1.1)'],
  ['luzOsiowy', '0.3 mm', 'luz osiowy oczko - wystep obudowy'],
  ['modulID', '48.5 mm', 'wnetrze obudowy (z kinematyki napedu)'],
  ['sciankaM', '2 mm', 'scianka obudowy pod gwintem'],
  ['gwintSkok', '3 mm', 'skok gwintu (profil liczony pod 3 mm)'],
  ['luzGwint', '0.5 mm', 'luz gwintu nakretki (odsuniecie scian); v1.1 z 0.3 byla za ciasna - kalibrowac Probka gwintu'],
  ['rantD', '63 mm', 'srednica rantu'],
  ['rantT', '1.5 mm', 'grubosc plaskiej czesci rantu'],
  ['kolnierzykD', '41 mm', 'otwor w rancie (zaslania brzeg miski)'],
  ['przodD', '56.2 mm', 'czesc obudowy w otworze dyni (otwornica 57)'],
  ['przodL', '15 mm', 'dlugosc czesci w otworze'],
  ['dociskMin', '15 mm', 'najciensza scianka dyni'],
  ['dociskMax', '25 mm', 'najgrubsza scianka dyni'],
  ['nakretkaH', '7 mm', 'wysokosc nakretki'],
  ['nakretkaD', '66 mm', 'srednica nakretki'],
  ['nakretkaZ', '22 mm', 'polozenie nakretki pod rantem (tylko podglad)'],
  ['modulL', '77.5 mm', 'dlugosc obudowy od wierzchu rantu'],
  ['m3Ciasny', '2.6 mm', 'otwor M3 ciasny (sruba wkreca sie w plastik)'],
  ['m3Luzny', '3.3 mm', 'otwor M3 luzny (obrot na srubie)'],
  ['lebD', '6.2 mm', 'poglebienie pod leb sruby osi (ISO 7380 M3x5)'],
  ['lebH', '1.9 mm', 'glebokosc poglebienia pod leb sruby osi (ISO 7380 k=1.65)'],
  ['wkladkaD', '4 mm', 'otwor pod wkladke M3 do wtapiania'],
  ['wkladkaL', '4 mm', 'dlugosc wkladki M3'],
  ['tulejkaD', '5.6 mm', 'srednica tulejki przegubu'],
  ['luzPrzegub', '0.2 mm', 'luz promieniowy przegubu (korba/ramie na tulejce)'],
  ['kolnierzD', '8 mm', 'srednica kolnierza tulejki'],
  ['kolnierzH', '0.8 mm', 'grubosc kolnierza tulejki'],
  ['plytaT', '2.5 mm', 'grubosc korby, ciegna i ramienia'],
  ['servoH', '30.5 mm', 'SG90: od spodu korpusu do wierzchu orczyka (POMIAR)'],
  ['servoSpodY', '-33.5 mm', 'polozenie spodu SG90 (os Y)'],
  ['servoUcho', '15.9 mm', 'SG90: od spodu korpusu do spodu uszu (POMIAR)'],
  ['serwoWkret', '1.8 mm', 'otwor pod wkret z kompletu serwa'],
  ['m2Otwor', '2.2 mm', 'otwor pod wkret M2 do orczyka'],
  ['hornTop', '#servoSpodY + #servoH', 'wyliczane: wierzch orczyka (os Y)'],
  ['modulOD', '#modulID + 2 * #sciankaM', 'wyliczane: rdzen gwintu obudowy'],
  ['gwintD', '#modulOD + 2.4 mm', 'wyliczane: srednica gwintu (zarys 1.2 mm)'],
  ['gniazdoL', '#dociskMax + #nakretkaH + 3.73 mm', 'wyliczane: koniec gwintu (krzywizna 2.73 + 1 mm)'],
  ['nakretkaOtwor', '#modulOD + 2 * #luzGwint', 'wyliczane: otwor nakretki'],
];
OS.VSID = OS.VSID || '96b825edb16e4cba5a3bb8c7';
OS.zmienne = async () => {
  const url = `/api/v10/variables/d/${OS.did}/w/${OS.wid}/e/${OS.VSID}/variables`;
  const conv = (v) => v.map(([name, expression, description]) => ({ name, type: 'LENGTH', expression, description }));
  const baseV = OS.VARS.filter((v) => !v[1].includes('#')), der = OS.VARS.filter((v) => v[1].includes('#'));
  let r = await req(url, { method: 'POST', body: JSON.stringify(conv(baseV)) });
  for (let i = 1; i <= der.length; i++) r = await req(url, { method: 'POST', body: JSON.stringify(conv([...baseV, ...der.slice(0, i)])) });
  OS.log.push('zmienne: ' + r.status);
};

OS.wspolne = async () => {
  await sketchW('Wspolne: os Z', qStd('Front'), (W) => W.line([0, 0, -95], [0, 0, 30], true));
  await sketchW('Wspolne: os oka', qStd('Right'), (W) => W.line([0, -30, D.zc], [0, 30, D.zc], true));
  await planeY('Wspolne: pl. orczyka', '-(#hornTop)', -1);
};

// ---------- Obudowa: rant + czesc w otworze + rura z gwintem + mechanizm ----------
OS.obudowa = async () => {
  const O = 'Obudowa: rant';
  await sketchW('Obudowa: rant szkic', qStd('Top'), (W) => { W.circle([0, 0, 0], 63, '#rantD'); W.circle([0, 0, 0], 41, '#kolnierzykD'); });
  await ext(O, 'Obudowa: rant szkic', BACK, { op: 'NEW', depth: '#rantT', regions: regionAt('Obudowa: rant szkic', [30, 0, 0]) });
  await sketchW('Obudowa: przod szkic', qStd('Top'), (W) => { W.circle([0, 0, 0], 56.2, '#przodD'); W.circle([0, 0, 0], 48.5, '#modulID'); });
  await ext('Obudowa: przod', 'Obudowa: przod szkic', BACK, { op: 'ADD', depth: '#przodL', scope: O, regions: regionAt('Obudowa: przod szkic', [26, 0, 0]) });
  await sketchW('Obudowa: rura szkic', qStd('Top'), (W) => { W.circle([0, 0, 0], 52.5, '#modulOD'); W.circle([0, 0, 0], 48.5, '#modulID'); });
  await ext('Obudowa: rura', 'Obudowa: rura szkic', BACK, { op: 'ADD', depth: '#modulL', scope: O, regions: regionAt('Obudowa: rura szkic', [25.2, 0, 0]) });
  // rant dopasowany do krzywizny dyni (R 150) od r 28 do 31.5, fazka i zabki (>= 1 mm od krawedzi otworu 57)
  await sketchW('Obudowa: dopasowanie rantu szkic', qStd('Front'), (W) => W.poly([[28, 0, -1.4], [31.5, 0, -1.4], [31.5, 0, -D.sag(31.5)], [28, 0, -D.sag(28)]]));
  await revolve('Obudowa: dopasowanie rantu', 'Obudowa: dopasowanie rantu szkic', 'Wspolne: os Z', { op: 'ADD', full: true, scope: O });
  await chamfer('Obudowa: fazka rantu', [qNearEdge(O, [31.5, 0, 0])], '1 mm');
  await planeZ('Obudowa: pl. zabkow', '2.7 mm', -1);
  await sketchW('Obudowa: zabki szkic', qFace('Obudowa: pl. zabkow'), (W) => { for (let k = 0; k < 8; k++) W.poly(radialW(29.5, 30.3, 1.0, 22.5 + 45 * k, -2.7)); });
  await ext('Obudowa: zabki', 'Obudowa: zabki szkic', BACK, { op: 'ADD', depth: '1.4 mm', scope: O });
  await sketchW('Obudowa: strzalka GORA szkic', qStd('Top'), (W) => W.poly([[0, 26.5, 0], [-2.2, 22.6, 0], [2.2, 22.6, 0]]));
  await ext('Obudowa: strzalka GORA', 'Obudowa: strzalka GORA szkic', BACK, { op: 'REMOVE', depth: '0.5 mm', scope: O });
  // gwint 45 st. na rurze: od -15.5 do konca (#gniazdoL), z fazowanym poczatkiem zwoju
  await planeZ('Obudowa: pl. startu gwintu', '#gniazdoL + #gwintSkok', -1);
  const z0 = -(D.gL + 3);
  await sketchW('Obudowa: okrag helisy', qFace('Obudowa: pl. startu gwintu'), (W) => W.circle([0, 0, z0], 52.5, '#modulOD'));
  await helix('Obudowa: helisa gwintu', 'Obudowa: okrag helisy', '#gwintSkok', '#gniazdoL + #gwintSkok - 15.5 mm');
  await sketchW('Obudowa: profil gwintu', qStd('Front'), (W) => W.poly([[D.mOR - 0.4, 0, z0 - 1.4], [D.mOR, 0, z0 - 1.4], [D.gTop, 0, z0 - 0.2], [D.gTop, 0, z0 + 0.2], [D.mOR, 0, z0 + 1.4], [D.mOR - 0.4, 0, z0 + 1.4]]));
  await sweep('Obudowa: gwint', 'Obudowa: profil gwintu', 'Obudowa: helisa gwintu', 'ADD', O);
  await planeZ('Obudowa: pl. konca gwintu', '#gniazdoL', -1);
  await sketchW('Obudowa: przyciecie gwintu szkic', qStd('Front'), (W) => W.poly([[D.mOR, 0, -D.gL - 0.01], [32, 0, -D.gL - 0.01], [32, 0, -D.gL - 12], [D.mOR, 0, -D.gL - 12]]));
  await revolve('Obudowa: przyciecie gwintu', 'Obudowa: przyciecie gwintu szkic', 'Wspolne: os Z', { op: 'REMOVE', full: true, scope: O });
  await sketchW('Obudowa: faza poczatku gwintu szkic', qStd('Front'), (W) => W.poly([[D.mOR, 0, -D.gL - 0.01], [29, 0, -D.gL - 0.01], [29, 0, -D.gL + 2.74]]));
  await revolve('Obudowa: faza poczatku gwintu', 'Obudowa: faza poczatku gwintu szkic', 'Wspolne: os Z', { op: 'REMOVE', full: true, scope: O });
  // wystepy osi (kropla), rowek ogranicznika z kanalem montazowym od tylu, poglebienie i otwor ciasny M3
  const kropla = (y) => { const P = []; for (let f = 45; f >= -225; f -= 15) P.push([5 * Math.cos(f * d2r), y, D.zc + 5 * Math.sin(f * d2r)]); P.push([0, y, D.zc + 5 * Math.SQRT2]); return P; };
  const yW = D.kulaR + D.klej + D.oczkoT + 0.3, yWexpr = '#kulaDmax / 2 + #klej + #oczkoT + #luzOsiowy';
  for (const [nm, sg] of [['gora', 1], ['dol', -1]]) {
    const y = sg * yW;
    await planeY(`Obudowa: pl. wystepu ${nm}`, yWexpr, sg);
    await sketchW(`Obudowa: wystep ${nm} szkic`, qFace(`Obudowa: pl. wystepu ${nm}`), (W) => W.poly(kropla(y)));
    await ext(`Obudowa: wystep osi ${nm}`, `Obudowa: wystep ${nm} szkic`, sg > 0 ? UP : DOWN, { op: 'ADD', depth: '3 mm', scope: O });
    const g0 = D.dogAng - D.stop - D.dogHalf, g1 = D.dogAng + D.stop + D.dogHalf;
    await sketchW(`Obudowa: rowek ogranicznika ${nm} szkic`, qFace(`Obudowa: pl. wystepu ${nm}`), (W) => {
      const P = []; for (let i = 0; i <= 12; i++) { const f = (g0 + (g1 - g0) * i / 12) * d2r; P.push([4.2 * Math.cos(f), y, D.zc + 4.2 * Math.sin(f)]); }
      for (let i = 12; i >= 0; i--) { const f = (g0 + (g1 - g0) * i / 12) * d2r; P.push([2.4 * Math.cos(f), y, D.zc + 2.4 * Math.sin(f)]); }
      W.poly(P);
      W.poly([[D.dog[0] - 0.95, y, D.dog[1] + 0.8], [D.dog[0] + 0.95, y, D.dog[1] + 0.8], [D.dog[0] + 0.95, y, D.zc - 6], [D.dog[0] - 0.95, y, D.zc - 6]]);
    });
    await ext(`Obudowa: rowek ogranicznika ${nm}`, `Obudowa: rowek ogranicznika ${nm} szkic`, sg > 0 ? UP : DOWN, { op: 'REMOVE', depth: '1 mm', scope: O, regions: allRegions(`Obudowa: rowek ogranicznika ${nm} szkic`) });
    await planeY(`Obudowa: pl. ${nm} przodu`, '#przodD / 2', sg);
    await sketchW(`Obudowa: poglebienie ${nm} szkic`, qFace(`Obudowa: pl. ${nm} przodu`), (W) => W.circle([0, sg * D.pR, D.zc], 6.2, '#lebD'));
    await ext(`Obudowa: poglebienie ${nm}`, `Obudowa: poglebienie ${nm} szkic`, sg > 0 ? DOWN : UP, { op: 'REMOVE', depth: '#lebH', scope: O });
    await sketchW(`Obudowa: otwor osi ${nm} szkic`, qFace(`Obudowa: pl. ${nm} przodu`), (W) => W.circle([0, sg * D.pR, D.zc], 2.6, '#m3Ciasny'));
    await ext(`Obudowa: otwor osi ${nm}`, `Obudowa: otwor osi ${nm} szkic`, sg > 0 ? DOWN : UP, { op: 'REMOVE', depth: '7 mm', scope: O });
  }
  // slupek przedniego ucha SG90 z podpora 45 st., otwor na wkret, szczelina na serwo od dolu
  await planeY('Obudowa: pl. uszu serwa', '-(#servoSpodY + #servoUcho)', -1);
  await sketchW('Obudowa: slupek serwa szkic', qFace('Obudowa: pl. uszu serwa'), (W) => W.poly([[-4, D.sUcho, D.uszyP], [4, D.sUcho, D.uszyP], [4, D.sUcho, D.sPrzod], [-4, D.sUcho, D.sPrzod]]));
  await ext('Obudowa: slupek serwa', 'Obudowa: slupek serwa szkic', DOWN, { op: 'ADD', depth: '7.9 mm', scope: O });
  await sketchW('Obudowa: podpora slupka szkic', qStd('Right'), (W) => W.poly([[0, D.sUcho, D.uszyP], [0, -25.0, D.uszyP], [0, -25.0, D.uszyP + (D.sUcho + 25.0)]]));
  await ext('Obudowa: podpora slupka', 'Obudowa: podpora slupka szkic', null, { op: 'ADD', depth: '8 mm', sym: true, scope: O });
  await sketchW('Obudowa: otwor ucha szkic', qFace('Obudowa: pl. uszu serwa'), (W) => W.circle([0, D.sUcho, D.uchoP], 1.8, '#serwoWkret'));
  await ext('Obudowa: otwor ucha', 'Obudowa: otwor ucha szkic', DOWN, { op: 'REMOVE', depth: '8 mm', scope: O });
  await planeY('Obudowa: pl. szczeliny', '20 mm', -1);
  await sketchW('Obudowa: szczelina serwa szkic', qFace('Obudowa: pl. szczeliny'), (W) => W.poly([[-6.6, -20, D.sPrzod], [6.6, -20, D.sPrzod], [6.6, -20, -85], [-6.6, -20, -85]]));
  await ext('Obudowa: szczelina serwa', 'Obudowa: szczelina serwa szkic', DOWN, { op: 'REMOVE', depth: '20 mm', scope: O });
  // otwory montazowe: od dolu do sruby przegubu H (za gwintem), od gory do wkretow uszu i orczyka
  await planeY('Obudowa: pl. dolu', '#modulOD / 2', -1);
  await sketchW('Obudowa: otwor dolny szkic', qFace('Obudowa: pl. dolu'), (W) => W.circle(W3(D.H0, -D.mOR), 8.5));
  await ext('Obudowa: otwor dolny', 'Obudowa: otwor dolny szkic', UP, { op: 'REMOVE', depth: '5 mm', scope: O });
  await planeY('Obudowa: pl. gory', '#modulOD / 2', 1);
  await sketchW('Obudowa: otwory gorne szkic', qFace('Obudowa: pl. gory'), (W) => {
    W.circle([0, D.mOR, D.uchoP], 6); W.circle([0, D.mOR, D.uchoT], 6);
    W.pas(W3(D.S, D.mOR), W3(D.M2, D.mOR), 9); W.circle(W3(D.S, D.mOR), 9); W.circle(W3(D.M2, D.mOR), 9);
  });
  await ext('Obudowa: otwory gorne', 'Obudowa: otwory gorne szkic', DOWN, { op: 'REMOVE', depth: '5 mm', scope: O, regions: allRegions('Obudowa: otwory gorne szkic') });
  // wystepy z wkladkami M3 na pokrywe tylna (wewnatrz, z faza 45 st.)
  for (const a of [40, 140]) {
    await planeAngle(`Obudowa: pl. wystepu pokrywy ${a}`, 'Wspolne: os Z', qStd('Front'), deg(a));
    await sketchW(`Obudowa: wystep pokrywy ${a} szkic`, qFace(`Obudowa: pl. wystepu pokrywy ${a}`), (W) => W.poly([pXY(19.0, a, D.zEnd), pXY(24.6, a, D.zEnd), pXY(24.6, a, D.zEnd + 11), pXY(19.0, a, D.zEnd + 5.4)]));
    await ext(`Obudowa: wystep pokrywy ${a}`, `Obudowa: wystep pokrywy ${a} szkic`, null, { op: 'ADD', depth: '8 mm', sym: true, scope: O });
  }
  await planeZ('Obudowa: pl. konca', '#modulL', -1);
  await sketchW('Obudowa: otwory wkladek szkic', qFace('Obudowa: pl. konca'), (W) => { for (const a of [40, 140]) W.circle(pXY(21.4, a, D.zEnd), 4, '#wkladkaD'); });
  await ext('Obudowa: otwory wkladek', 'Obudowa: otwory wkladek szkic', FWD, { op: 'REMOVE', depth: '#wkladkaL + 0.5 mm', scope: O, regions: allRegions('Obudowa: otwory wkladek szkic') });
  // splaszczenia tylu (sasiednie oczy przy rozstawie 105 mm w dyni o promieniu 150 mm)
  await sketchW('Obudowa: splaszczenia szkic', qFace('Obudowa: pl. konca'), (W) => { W.poly([[D.flat, -30, D.zEnd], [32, -30, D.zEnd], [32, 30, D.zEnd], [D.flat, 30, D.zEnd]]); W.poly([[-32, -30, D.zEnd], [-D.flat, -30, D.zEnd], [-D.flat, 30, D.zEnd], [-32, 30, D.zEnd]]); });
  await ext('Obudowa: splaszczenia', 'Obudowa: splaszczenia szkic', FWD, { op: 'REMOVE', depth: mm(D.zFlat - D.zEnd), scope: O, regions: allRegions('Obudowa: splaszczenia szkic') });
  // wybranie w scianie na przegub H (ramie, ciegno, tulejka) - przy -33 deg dochodzi do sciany; sufit 45 deg - bez podpor
  await planeY('Obudowa: pl. wybrania na ramie', '2.8 mm', 1);
  await sketchW('Obudowa: wybranie na ramie szkic', qFace('Obudowa: pl. wybrania na ramie'), (W) => W.poly([[-22.8, 2.8, -52.8], [-24.7, 2.8, -50.9], [-24.7, 2.8, -43.9], [-22.8, 2.8, -43.9]]));
  await ext('Obudowa: wybranie na ramie', 'Obudowa: wybranie na ramie szkic', DOWN, { op: 'REMOVE', depth: '7.2 mm', scope: O });
};

// ---------- Nakretka ----------
OS.nakretka = async () => {
  const N = 'Nakretka: korpus';
  const zf = -22, zb = -29;
  await planeZ('Nakretka: pl. czola', '#nakretkaZ', -1);
  await sketchW('Nakretka: korpus szkic', qFace('Nakretka: pl. czola'), (W) => { W.circle([0, 0, zf], 66, '#nakretkaD'); W.circle([0, 0, zf], 53.1, '#nakretkaOtwor'); });
  await ext(N, 'Nakretka: korpus szkic', BACK, { op: 'NEW', depth: '#nakretkaH', regions: regionAt('Nakretka: korpus szkic', [30, 0, zf]) });
  const Ri = D.dyniaR - 20, dz = D.sag(33.5, Ri) - D.sag(27, Ri);
  await sketchW('Nakretka: dopasowanie czola szkic', qStd('Front'), (W) => W.poly([[27.0, 0, zf + 0.01], [33.6, 0, zf + 0.01], [33.6, 0, zf - dz]]));
  await revolve('Nakretka: dopasowanie czola', 'Nakretka: dopasowanie czola szkic', 'Wspolne: os Z', { op: 'REMOVE', full: true, scope: N });
  await chamfer('Nakretka: fazy otworu', [qNearEdge(N, [26.55, 0, zf], true), qNearEdge(N, [26.55, 0, zb], true)], '1 mm');
  await sweep('Nakretka: narzedzie gwintu', 'Obudowa: profil gwintu', 'Obudowa: helisa gwintu', 'NEW');
  await moveFaceOffset('Nakretka: luz gwintu', [`query=qOwnedByBody(qCreatedBy(makeId("${F['Nakretka: narzedzie gwintu']}"), EntityType.BODY), EntityType.FACE);`], '#luzGwint');
  await booleanOp('Nakretka: gwint', 'SUBTRACTION', [qBody('Nakretka: narzedzie gwintu')], [qBody(N)]);
  await planeZ('Nakretka: pl. tylu', '#nakretkaZ + #nakretkaH', -1);
  await sketchW('Nakretka: wyciecia na klucz szkic', qFace('Nakretka: pl. tylu'), (W) => { for (let k = 0; k < 6; k++) W.poly(radialW(29.8, 34, 4, 30 + 60 * k, zb)); });
  await ext('Nakretka: wyciecia na klucz', 'Nakretka: wyciecia na klucz szkic', FWD, { op: 'REMOVE', depth: '2.5 mm', scope: N });
  await sketchW('Nakretka: radelkowanie szkic', qFace('Nakretka: pl. tylu'), (W) => { for (let k = 0; k < 24; k++) W.poly(radialW(32.4, 34, 1.4, 15 * k, zb)); });
  await ext('Nakretka: radelkowanie', 'Nakretka: radelkowanie szkic', FWD, { op: 'REMOVE', depth: '#nakretkaH', scope: N });
};

// ---------- Jarzmo z miska (pileczka wklejona) ----------
OS.jarzmo = async () => {
  const J = 'Jarzmo: miska';
  const u = D.u, n = D.n, A = D.A, zc = D.zc, C0 = D.C0;
  // kulista powloka (wnetrze = pileczka + klej) przycieta do pasa szerokosci #jarzmoW w plaszczyznie odchylonej o 60 st.
  await sketchW('Jarzmo: powloka szkic', qStd('Right'), (W) => {
    W.circle([0, 0, zc], 40.9, '#kulaDmax + 2 * #klej'); W.circle([0, 0, zc], 45.9, '#kulaDmax + 2 * (#klej + #jarzmoT)'); W.line([0, -30, zc], [0, 30, zc]);
  });
  await revolve(J, 'Jarzmo: powloka szkic', 'Wspolne: os oka', { op: 'NEW', full: true, regions: regionAt('Jarzmo: powloka szkic', [0, 0, zc - 21.7]) });
  await planeAngle('Jarzmo: pl. pierscienia', 'Wspolne: os oka', qStd('Right'), '120 deg');
  const mR = await sketchW('Jarzmo: przod miski szkic', qFace('Jarzmo: pl. pierscienia'), (W) => {
    const a = (rho, y) => [A[0] + rho * u[0], y, A[1] + rho * u[1]];
    W.poly([a(0, -30), a(-30, -30), a(-30, 30), a(0, 30)]);
  });
  await ext('Jarzmo: przod miski', 'Jarzmo: przod miski szkic', null, { op: 'REMOVE', depth: '60 mm', sym: true, scope: J });
  const nW = [n[0], 0, n[1]];
  for (const [nm, sg] of [['plus', 1], ['minus', -1]]) {
    await planeOff(`Jarzmo: pl. boku ${nm}`, 'Jarzmo: pl. pierscienia', '#jarzmoW / 2', dot(mR.N, nW) * sg < 0);
    await sketchW(`Jarzmo: bok ${nm} szkic`, qFace(`Jarzmo: pl. boku ${nm}`), (W) => {
      const b = (rho, y) => [A[0] + rho * u[0] + sg * D.jW / 2 * n[0], y, A[1] + rho * u[1] + sg * D.jW / 2 * n[1]];
      W.poly([b(-30, -30), b(30, -30), b(30, 30), b(-30, 30)]);
    });
    await ext(`Jarzmo: bok ${nm}`, `Jarzmo: bok ${nm} szkic`, [sg * n[0], 0, sg * n[1]], { op: 'REMOVE', depth: '30 mm', scope: J });
  }
  // oczka na osi, przyciecie nad oczkami, otwory luzne M3, kolki ogranicznika
  for (const [nm, sg] of [['gora', 1], ['dol', -1]]) {
    await planeY(`Jarzmo: pl. oczka ${nm}`, '#kulaDmax / 2 + #klej', sg);
    await sketchW(`Jarzmo: oczko ${nm} szkic`, qFace(`Jarzmo: pl. oczka ${nm}`), (W) => W.poly(rotRect(A, u, n, 4.8, D.jW / 2, sg * 20.45)));
    await ext(`Jarzmo: oczko ${nm}`, `Jarzmo: oczko ${nm} szkic`, sg > 0 ? UP : DOWN, { op: 'ADD', depth: '#oczkoT', scope: J });
    await planeY(`Jarzmo: pl. nad oczkiem ${nm}`, '#kulaDmax / 2 + #klej + #oczkoT', sg);
    await sketchW(`Jarzmo: przyciecie ${nm} szkic`, qFace(`Jarzmo: pl. nad oczkiem ${nm}`), (W) => W.circle(W3(A, sg * 22.45), 13));
    await ext(`Jarzmo: przyciecie ${nm}`, `Jarzmo: przyciecie ${nm} szkic`, sg > 0 ? UP : DOWN, { op: 'REMOVE', depth: '5 mm', scope: J });
    await sketchW(`Jarzmo: kolek ogranicznika ${nm} szkic`, qFace(`Jarzmo: pl. nad oczkiem ${nm}`), (W) => W.circle(W3(D.dog, sg * 22.45), 1.4));
    await ext(`Jarzmo: kolek ogranicznika ${nm}`, `Jarzmo: kolek ogranicznika ${nm} szkic`, sg > 0 ? UP : DOWN, { op: 'ADD', depth: '0.8 mm', scope: J });
  }
  await sketchW('Jarzmo: otwory osi szkic', qStd('Front'), (W) => W.circle(W3(A, 0), 3.3, '#m3Luzny'));
  await ext('Jarzmo: otwory osi', 'Jarzmo: otwory osi szkic', null, { op: 'REMOVE', depth: '60 mm', sym: true, scope: J });
  const yk = D.hTop;
  // korba zrosnieta z miska na calej szerokosci pasa (luk do plaszczyzny stolu s = jW/2), piasta C fi 10 (scianka 2 mm wokol otworu 6)
  // jako kropla z ostrzem w dol, do stolu (boki 45 st.) - jarzmo drukuje sie bez podpor, lezac bokiem miski bez korby
  const s0 = D.jW / 2, pAng = (r) => 60 + Math.asin(s0 / r) * r2d, Rk = 5, dn = [n[0], n[1]];
  const rotV = (v, a) => [v[0] * Math.cos(a) - v[1] * Math.sin(a), v[0] * Math.sin(a) + v[1] * Math.cos(a)];
  // splaszczenie piasty od strony sciany obudowy przy +33 st. (4.15 mm od osi otworu -> luz 0.5 do sciany)
  const wK = [Math.cos(D.stop * d2r), -Math.sin(D.stop * d2r)], hK = 4.15;
  const clipK = (P) => { const f = (p) => (p[0] - C0[0]) * wK[0] + (p[2] - C0[1]) * wK[1] - hK; const o = [];
    for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length], fa = f(a), fb = f(b); if (fa <= 0) o.push(a);
      if ((fa < 0) !== (fb < 0)) { const t = fa / (fa - fb); o.push([a[0] + t * (b[0] - a[0]), yk, a[2] + t * (b[2] - a[2])]); } } return o; };
  const kroplaK = () => { const P = [[C0[0] + Math.SQRT2 * Rk * dn[0], yk, C0[1] + Math.SQRT2 * Rk * dn[1]]];
    for (let i = 0; i <= 24; i++) { const v = rotV(dn, (45 + 270 * i / 24) * d2r); P.push([C0[0] + Rk * v[0], yk, C0[1] + Rk * v[1]]); } return clipK(P); };
  await sketchW('Jarzmo: korba szkic', qFace('Wspolne: pl. orczyka'), (W) => {
    W.poly([...arcPts(A, 20.75, pAng(20.75), 13, 18, yk), psiPt(26.4, 13, yk), psiPt(28.0, 20, yk), psiPt(23.4, 30, yk), ...arcPts(A, 23.4, 30, pAng(23.4), 12, yk)]);
    W.poly(kroplaK());
  });
  await ext('Jarzmo: korba', 'Jarzmo: korba szkic', UP, { op: 'ADD', depth: '#plytaT', scope: J, regions: allRegions('Jarzmo: korba szkic') });
  await sketchW('Jarzmo: otwor korby szkic', qFace('Wspolne: pl. orczyka'), (W) => W.circle(W3(C0, yk), 6, '#tulejkaD + 2 * #luzPrzegub'));
  // ponowne wyciecie wnetrza miski: ostrze kropli piasty nie moze wejsc w szczeline kleju
  await revolve('Jarzmo: wnetrze miski', 'Jarzmo: powloka szkic', 'Wspolne: os oka', { op: 'REMOVE', full: true, scope: J, regions: regionAt('Jarzmo: powloka szkic', [0, 0, zc - 10]) });
  await ext('Jarzmo: otwor korby', 'Jarzmo: otwor korby szkic', UP, { op: 'REMOVE', depth: '#plytaT', scope: J });
};

// ---------- naped: ciegno, ramie orczyka, tulejki ----------
OS.naped = async () => {
  const C0 = D.C0, H0 = D.H0, S = D.S;
  const CI = 'Ciegno';
  await planeOff('Ciegno: pl. spodu', 'Wspolne: pl. orczyka', '#plytaT + 0.2 mm', true);
  const y0 = D.hTop + 2.7;
  await sketchW('Ciegno: szkic', qFace('Ciegno: pl. spodu'), (W) => { W.pas(W3(C0, y0), W3(H0, y0), 7); W.circle(W3(C0, y0), 8.4); W.circle(W3(H0, y0), 8.4); });
  await ext(CI, 'Ciegno: szkic', UP, { op: 'NEW', depth: '#plytaT', regions: allRegions('Ciegno: szkic') });
  await planeOff('Ciegno: pl. wierzchu', 'Ciegno: pl. spodu', '#plytaT', true);
  await sketchW('Ciegno: podniesienia szkic', qFace('Ciegno: pl. wierzchu'), (W) => { W.circle(W3(C0, y0 + 2.5), 7); W.circle(W3(H0, y0 + 2.5), 7); });
  await ext('Ciegno: podniesienia', 'Ciegno: podniesienia szkic', UP, { op: 'ADD', depth: '2 mm', scope: CI, regions: allRegions('Ciegno: podniesienia szkic') });
  await sketchW('Ciegno: otwory szkic', qStd('Front'), (W) => { W.circle(W3(C0, 0), 3.3, '#m3Luzny'); W.circle(W3(H0, 0), 3.3, '#m3Luzny'); });
  await ext('Ciegno: otwory', 'Ciegno: otwory szkic', null, { op: 'REMOVE', depth: '40 mm', sym: true, scope: CI, regions: allRegions('Ciegno: otwory szkic') });
  await planeOff('Ciegno: pl. podniesien', 'Ciegno: pl. wierzchu', '2 mm', true);
  await sketchW('Ciegno: otwory wkladek szkic', qFace('Ciegno: pl. podniesien'), (W) => { W.circle(W3(C0, y0 + 4.5), 4, '#wkladkaD'); W.circle(W3(H0, y0 + 4.5), 4, '#wkladkaD'); });
  await ext('Ciegno: otwory wkladek', 'Ciegno: otwory wkladek szkic', DOWN, { op: 'REMOVE', depth: '#wkladkaL + 0.3 mm', scope: CI, regions: allRegions('Ciegno: otwory wkladek szkic') });
  const R = 'Ramie orczyka', yr = D.hTop, tip = add2(S, D.dirR, 17.5);
  await sketchW('Ramie: szkic', qFace('Wspolne: pl. orczyka'), (W) => { W.pas(W3(S, yr), W3(H0, yr), 8); W.circle(W3(S, yr), 11); W.circle(W3(H0, yr), 8.4); });
  await ext(R, 'Ramie: szkic', UP, { op: 'NEW', depth: '#plytaT', regions: allRegions('Ramie: szkic') });
  await planeOff('Ramie: pl. dolu', 'Wspolne: pl. orczyka', '1.5 mm', false);
  await sketchW('Ramie: rama orczyka szkic', qFace('Ramie: pl. dolu'), (W) => { W.circle(W3(S, yr - 1.5), 10.4); W.pas(W3(S, yr - 1.5), W3(tip, yr - 1.5), 7); W.circle(W3(tip, yr - 1.5), 7); });
  await ext('Ramie: rama orczyka', 'Ramie: rama orczyka szkic', UP, { op: 'ADD', depth: '1.5 mm', scope: R, regions: allRegions('Ramie: rama orczyka szkic') });
  await sketchW('Ramie: kieszen orczyka szkic', qFace('Ramie: pl. dolu'), (W) => { W.circle(W3(S, yr - 1.5), 7.4); W.pas(W3(S, yr - 1.5), W3(tip, yr - 1.5), 5.2); W.circle(W3(tip, yr - 1.5), 4.6); });
  await ext('Ramie: kieszen orczyka', 'Ramie: kieszen orczyka szkic', UP, { op: 'REMOVE', depth: '1.5 mm', scope: R, regions: allRegions('Ramie: kieszen orczyka szkic') });
  await sketchW('Ramie: otwory szkic', qStd('Front'), (W) => { W.circle(W3(S, 0), 2.8); W.circle(W3(D.M2, 0), 2.2, '#m2Otwor'); W.circle(W3(H0, 0), 6, '#tulejkaD + 2 * #luzPrzegub'); });
  await ext('Ramie: otwory', 'Ramie: otwory szkic', null, { op: 'REMOVE', depth: '40 mm', sym: true, scope: R, regions: allRegions('Ramie: otwory szkic') });
  const TU = 'Tulejki: kolnierze';
  await planeOff('Tulejki: pl. kolnierzy', 'Wspolne: pl. orczyka', '#kolnierzH', false);
  await sketchW('Tulejki: kolnierze szkic', qFace('Tulejki: pl. kolnierzy'), (W) => { W.circle(W3(C0, yr - 0.8), 8, '#kolnierzD'); W.circle(W3(H0, yr - 0.8), 8, '#kolnierzD'); });
  await ext(TU, 'Tulejki: kolnierze szkic', UP, { op: 'NEW', depth: '#kolnierzH', regions: allRegions('Tulejki: kolnierze szkic') });
  await sketchW('Tulejki: tulejki szkic', qFace('Wspolne: pl. orczyka'), (W) => { W.circle(W3(C0, yr), 5.6, '#tulejkaD'); W.circle(W3(H0, yr), 5.6, '#tulejkaD'); });
  await ext('Tulejki: tulejki', 'Tulejki: tulejki szkic', UP, { op: 'ADD', depth: '#plytaT + 0.2 mm', scope: TU, regions: allRegions('Tulejki: tulejki szkic') });
  await sketchW('Tulejki: otwory szkic', qStd('Front'), (W) => { W.circle(W3(C0, 0), 3.3, '#m3Luzny'); W.circle(W3(H0, 0), 3.3, '#m3Luzny'); });
  await ext('Tulejki: otwory', 'Tulejki: otwory szkic', null, { op: 'REMOVE', depth: '30 mm', sym: true, scope: TU, regions: allRegions('Tulejki: otwory szkic') });
};

// ---------- Pokrywa tylna ----------
OS.pokrywa = async () => {
  const PK = 'Pokrywa tylna', z = D.zEnd;
  await sketchW('Pokrywa: szkic', qFace('Obudowa: pl. konca'), (W) => {
    W.circle([0, 0, z], 52.5);
    W.poly([[-9, -38, z], [9, -38, z], [9, -20, z], [-9, -20, z]]);
  });
  await ext(PK, 'Pokrywa: szkic', BACK, { op: 'NEW', depth: '3 mm', regions: allRegions('Pokrywa: szkic') });
  await sketchW('Pokrywa: splaszczenia szkic', qFace('Obudowa: pl. konca'), (W) => { W.poly([[22, -40, z], [32, -40, z], [32, 30, z], [22, 30, z]]); W.poly([[-32, -40, z], [-22, -40, z], [-22, 30, z], [-32, 30, z]]); });
  await ext('Pokrywa: splaszczenia', 'Pokrywa: splaszczenia szkic', BACK, { op: 'REMOVE', depth: '3 mm', scope: PK, regions: allRegions('Pokrywa: splaszczenia szkic') });
  // otwory srub + dziurka od klucza: szeroka czesc 9 x 3.4 przepuszcza wtyczke 3-pin (8 x 2.5) przy zalozonej pokrywie, waska szczelina 1.2 zaciska tasme kabla
  await sketchW('Pokrywa: otwory szkic', qFace('Obudowa: pl. konca'), (W) => { for (const a of [40, 140]) W.circle(pXY(21.4, a, z), 3.3, '#m3Luzny');
    W.poly([[-4.5, -30.4, z], [4.5, -30.4, z], [4.5, -33.8, z], [1.9, -33.8, z], [1.9, -35.0, z], [-1.9, -35.0, z], [-1.9, -33.8, z], [-4.5, -33.8, z]]); });
  await ext('Pokrywa: otwory', 'Pokrywa: otwory szkic', BACK, { op: 'REMOVE', depth: '3 mm', scope: PK, regions: allRegions('Pokrywa: otwory szkic') });
  await sketchW('Pokrywa: slupek szkic', qFace('Obudowa: pl. uszu serwa'), (W) => W.poly([[-4, D.sUcho, D.sTyl - 0.3], [4, D.sUcho, D.sTyl - 0.3], [4, D.sUcho, z], [-4, D.sUcho, z]]));
  await ext('Pokrywa: slupek', 'Pokrywa: slupek szkic', DOWN, { op: 'ADD', depth: '6.4 mm', scope: PK });
  await sketchW('Pokrywa: otwor ucha szkic', qFace('Obudowa: pl. uszu serwa'), (W) => W.circle([0, D.sUcho, D.uchoT], 1.8, '#serwoWkret'));
  await ext('Pokrywa: otwor ucha', 'Pokrywa: otwor ucha szkic', DOWN, { op: 'REMOVE', depth: '6.4 mm', scope: PK });
  // prowadnice tasmy kabla od serwa do dziurki od klucza
  await sketchW('Pokrywa: prowadnice kabla szkic', qFace('Obudowa: pl. konca'), (W) => { W.poly([[2.3, -35.0, z], [3.5, -35.0, z], [3.5, -29.5, z], [2.3, -29.5, z]]); W.poly([[-3.5, -35.0, z], [-2.3, -35.0, z], [-2.3, -29.5, z], [-3.5, -29.5, z]]); });
  await ext('Pokrywa: prowadnice kabla', 'Pokrywa: prowadnice kabla szkic', FWD, { op: 'ADD', depth: '3.5 mm', scope: PK, regions: allRegions('Pokrywa: prowadnice kabla szkic') });
};

// ---------- Podglad ----------
OS.podglad = async () => {
  const zc = D.zc, S = D.S;
  await sketchW('Podglad: pileczka szkic', qStd('Right'), (W) => { W.circle([0, 0, zc], 40.5, '#kulaDmax'); W.line([0, -25, zc], [0, 25, zc]); });
  await revolve('PODGLAD pileczka', 'Podglad: pileczka szkic', 'Wspolne: os oka', { op: 'NEW', full: true, regions: regionAt('Podglad: pileczka szkic', [0, 0, zc + 10]) });
  const SG = 'PODGLAD SG90';
  await planeY('Podglad: pl. spodu serwa', '-#servoSpodY', -1);
  await sketchW('Podglad: SG90 szkic', qFace('Podglad: pl. spodu serwa'), (W) => W.poly([[-5.9, D.sSpod, D.sTyl], [5.9, D.sSpod, D.sTyl], [5.9, D.sSpod, D.sPrzod], [-5.9, D.sSpod, D.sPrzod]]));
  await ext(SG, 'Podglad: SG90 szkic', UP, { op: 'NEW', depth: '22.7 mm' });
  await sketchW('Podglad: SG90 uszy szkic', qFace('Obudowa: pl. uszu serwa'), (W) => W.poly([[-5.9, D.sUcho, D.uszyT], [5.9, D.sUcho, D.uszyT], [5.9, D.sUcho, D.uszyP], [-5.9, D.sUcho, D.uszyP]]));
  await ext('Podglad: SG90 uszy', 'Podglad: SG90 uszy szkic', UP, { op: 'ADD', depth: '2.5 mm', scope: SG });
  await planeOff('Podglad: pl. wierzchu serwa', 'Podglad: pl. spodu serwa', '22.7 mm', true);
  await sketchW('Podglad: SG90 garb szkic', qFace('Podglad: pl. wierzchu serwa'), (W) => W.circle(W3(S, D.sSpod + 22.7), 11.8));
  await ext('Podglad: SG90 garb', 'Podglad: SG90 garb szkic', UP, { op: 'ADD', depth: '4 mm', scope: SG });
  await planeOff('Podglad: pl. walka', 'Podglad: pl. wierzchu serwa', '4 mm', true);
  await sketchW('Podglad: SG90 walek szkic', qFace('Podglad: pl. walka'), (W) => W.circle(W3(S, D.sSpod + 26.7), 4.8));
  await ext('Podglad: SG90 walek', 'Podglad: SG90 walek szkic', UP, { op: 'ADD', depth: '2.3 mm', scope: SG });
  // kabel SG90: tasma 3.5 x 1.4 wychodzi u dolu krotszego boku od strony walka i idzie prosto do tylu przez pokrywe
  await planeOff('Podglad: pl. kabla', 'Podglad: pl. spodu serwa', '0.7 mm', true);
  await sketchW('Podglad: SG90 kabel szkic', qFace('Podglad: pl. kabla'), (W) => W.poly([[-1.75, D.sSpod + 0.7, D.sTyl + 0.5], [1.75, D.sSpod + 0.7, D.sTyl + 0.5], [1.75, D.sSpod + 0.7, D.zEnd - 4], [-1.75, D.sSpod + 0.7, D.zEnd - 4]]));
  await ext('Podglad: SG90 kabel', 'Podglad: SG90 kabel szkic', UP, { op: 'ADD', depth: '1.4 mm', scope: SG });
  const tip = add2(S, D.dirR, 17.5), yo = D.hTop - 1.5;
  await sketchW('Podglad: orczyk szkic', qFace('Ramie: pl. dolu'), (W) => { W.circle(W3(S, yo), 7); W.pas(W3(S, yo), W3(tip, yo), 4.8); W.circle(W3(tip, yo), 4); });
  await ext('PODGLAD orczyk', 'Podglad: orczyk szkic', UP, { op: 'NEW', depth: '1.5 mm', regions: allRegions('Podglad: orczyk szkic') });
};

// ---------- Przyrzady ----------
OS.przyrzady = async () => {
  // przyrzad do wklejania: czasza na przod pileczki (zrenica w otworze Ø3 na osi), dwa slupki na sruby osi trzymaja jarzmo jak w obudowie
  const J = D.J, PW = 'Przyrzad wklejania', zb = J[2] + 24.5;
  const yp = D.kulaR + D.klej + D.oczkoT + 0.3;      // wewnetrzna sciana slupkow = jak wystepy osi w obudowie (czasza: pileczka + 0.4, niezaleznie od kleju)
  await planeZ('Przyrzad wklejania: pl. srodka', mm(-J[2]), -1);
  await sketchW('Przyrzad wklejania: podstawa szkic', qFace('Przyrzad wklejania: pl. srodka'), (W) => W.poly([[J[0] - 14, -31, J[2]], [J[0] + 14, -31, J[2]], [J[0] + 14, 31, J[2]], [J[0] - 14, 31, J[2]]]));
  await ext(PW, 'Przyrzad wklejania: podstawa szkic', FWD, { op: 'NEW', depth: '24.5 mm' });
  await planeX('Przyrzad wklejania: pl. osi', mm(J[0]), 1);
  await sketchW('Przyrzad wklejania: os', qFace('Przyrzad wklejania: pl. osi'), (W) => W.line([J[0], -35, J[2]], [J[0], 35, J[2]], true));
  await sketchW('Przyrzad wklejania: czasza szkic', qFace('Przyrzad wklejania: pl. osi'), (W) => { W.circle(J, 40.9, '#kulaDmax + 0.4 mm'); W.line([J[0], -25, J[2]], [J[0], 25, J[2]]); });
  await revolve('Przyrzad wklejania: czasza', 'Przyrzad wklejania: czasza szkic', 'Przyrzad wklejania: os', { op: 'REMOVE', full: true, scope: PW, regions: regionAt('Przyrzad wklejania: czasza szkic', [J[0], 0, J[2] + 10]) });
  // podstawa w osi Y wyzej niz pileczka: zostaja slupki |y| yp..31, srodek (|y| < yp) obnizony do polowy kuli
  await sketchW('Przyrzad wklejania: kieszenie oczek szkic', qFace('Przyrzad wklejania: pl. srodka'), (W) => { W.poly([[J[0] - 9, 18.4, J[2]], [J[0] + 9, 18.4, J[2]], [J[0] + 9, yp, J[2]], [J[0] - 9, yp, J[2]]]); W.poly([[J[0] - 9, -yp, J[2]], [J[0] + 9, -yp, J[2]], [J[0] + 9, -18.4, J[2]], [J[0] - 9, -18.4, J[2]]]); });
  await ext('Przyrzad wklejania: kieszenie oczek', 'Przyrzad wklejania: kieszenie oczek szkic', FWD, { op: 'REMOVE', depth: '7 mm', scope: PW, regions: allRegions('Przyrzad wklejania: kieszenie oczek szkic') });
  await sketchW('Przyrzad wklejania: slupki szkic', qFace('Przyrzad wklejania: pl. srodka'), (W) => { W.poly([[J[0] - 6, yp, J[2]], [J[0] + 6, yp, J[2]], [J[0] + 6, 31, J[2]], [J[0] - 6, 31, J[2]]]); W.poly([[J[0] - 6, -31, J[2]], [J[0] + 6, -31, J[2]], [J[0] + 6, -yp, J[2]], [J[0] - 6, -yp, J[2]]]); });
  await ext('Przyrzad wklejania: slupki', 'Przyrzad wklejania: slupki szkic', BACK, { op: 'ADD', depth: '7 mm', scope: PW, regions: allRegions('Przyrzad wklejania: slupki szkic') });
  await sketchW('Przyrzad wklejania: otwory srub szkic', qStd('Front'), (W) => { W.circle([J[0], 0, J[2]], 2.6, '#m3Ciasny'); });
  await ext('Przyrzad wklejania: otwory srub', 'Przyrzad wklejania: otwory srub szkic', null, { op: 'REMOVE', depth: '70 mm', sym: true, scope: PW });
  await planeY('Przyrzad wklejania: pl. slupka gora', '#kulaDmax / 2 + #klej + #oczkoT + #luzOsiowy', 1);
  await sketchW('Przyrzad wklejania: miejsce na kolek gora szkic', qFace('Przyrzad wklejania: pl. slupka gora'), (W) => W.circle([J[0], yp, J[2]], 9.5));
  await ext('Przyrzad wklejania: miejsce na kolek gora', 'Przyrzad wklejania: miejsce na kolek gora szkic', UP, { op: 'REMOVE', depth: '1 mm', scope: PW });
  await planeY('Przyrzad wklejania: pl. slupka dol', '#kulaDmax / 2 + #klej + #oczkoT + #luzOsiowy', -1);
  await sketchW('Przyrzad wklejania: miejsce na kolek dol szkic', qFace('Przyrzad wklejania: pl. slupka dol'), (W) => W.circle([J[0], -yp, J[2]], 9.5));
  await ext('Przyrzad wklejania: miejsce na kolek dol', 'Przyrzad wklejania: miejsce na kolek dol szkic', DOWN, { op: 'REMOVE', depth: '1 mm', scope: PW });
  await planeZ('Przyrzad wklejania: pl. dna', mm(zb), 1);
  await sketchW('Przyrzad wklejania: celownik szkic', qFace('Przyrzad wklejania: pl. dna'), (W) => W.circle([J[0], 0, zb], 3));
  await ext('Przyrzad wklejania: celownik', 'Przyrzad wklejania: celownik szkic', BACK, { op: 'REMOVE', depth: '10 mm', scope: PW });
  // przyrzad do centrowania orczyka: plytka pod obudowa z trzpieniem przez otwor dolny do otworu ramienia (H)
  const PO = 'Przyrzad orczyka';
  await planeY('Przyrzad orczyka: pl. podstawy', mm(D.mOR + 0.4), -1);
  const yb = -(D.mOR + 0.4);
  await sketchW('Przyrzad orczyka: podstawa szkic', qFace('Przyrzad orczyka: pl. podstawy'), (W) => W.poly([[-15, yb, D.H0[1] + 6], [5, yb, D.H0[1] + 6], [5, yb, D.H0[1] - 6], [-15, yb, D.H0[1] - 6]]));
  await ext(PO, 'Przyrzad orczyka: podstawa szkic', DOWN, { op: 'NEW', depth: '2.5 mm' });
  await sketchW('Przyrzad orczyka: trzpien szkic', qFace('Przyrzad orczyka: pl. podstawy'), (W) => W.circle(W3(D.H0, yb), 5.8));
  await ext('Przyrzad orczyka: trzpien', 'Przyrzad orczyka: trzpien szkic', UP, { op: 'ADD', depth: mm(-yb - 1.5), scope: PO });
};
// ---------- Probka gwintu (do kalibracji luzu przed drukiem obudowy) ----------
OS.probka = async () => {
  const { sketchW, ext, planeZ, regionAt, allRegions, qFace, qStd, qBody, qNearEdge, revolve, helix, sweep, chamfer, moveFaceOffset, booleanOp, FWD, BACK, F } = OS;
  const D = OS.D, xs = -130, L = 14, PG = 'Probka gwintu: pierscien', PN = 'Probka gwintu: nakretka';
  // pierscien: ta sama scianka i gwint co obudowa, dlugosc 14 mm, os w (x -130, y 0)
  await sketchW('Probka gwintu: pierscien szkic', qStd('Top'), (W) => { W.circle([xs, 0, 0], 52.5, '#modulOD'); W.circle([xs, 0, 0], 48.5, '#modulID'); });
  await ext(PG, 'Probka gwintu: pierscien szkic', BACK, { op: 'NEW', depth: `${L} mm`, regions: regionAt('Probka gwintu: pierscien szkic', [xs + 25.2, 0, 0]) });
  const z0 = -(L + 3);
  await planeZ('Probka gwintu: pl. startu helisy', `${L + 3} mm`, -1);
  await sketchW('Probka gwintu: okrag helisy', qFace('Probka gwintu: pl. startu helisy'), (W) => W.circle([xs, 0, z0], 52.5, '#modulOD'));
  await helix('Probka gwintu: helisa', 'Probka gwintu: okrag helisy', '#gwintSkok', `${L + 6} mm`);
  await sketchW('Probka gwintu: profil', qStd('Front'), (W) => W.poly([[xs + D.mOR - 0.4, 0, z0 - 1.4], [xs + D.mOR, 0, z0 - 1.4], [xs + D.gTop, 0, z0 - 0.2], [xs + D.gTop, 0, z0 + 0.2], [xs + D.mOR, 0, z0 + 1.4], [xs + D.mOR - 0.4, 0, z0 + 1.4]]));
  await sweep('Probka gwintu: gwint', 'Probka gwintu: profil', 'Probka gwintu: helisa', 'ADD', PG);
  // przyciecie zwoju do dlugosci pierscienia
  await sketchW('Probka gwintu: przyciecie szkic', qStd('Top'), (W) => W.circle([xs, 0, 0], 70));
  await ext('Probka gwintu: przyciecie przod', 'Probka gwintu: przyciecie szkic', FWD, { op: 'REMOVE', depth: '6 mm', scope: PG });
  await planeZ('Probka gwintu: pl. konca', `${L} mm`, -1);
  await sketchW('Probka gwintu: przyciecie tyl szkic', qFace('Probka gwintu: pl. konca'), (W) => W.circle([xs, 0, -L], 70));
  await ext('Probka gwintu: przyciecie tyl', 'Probka gwintu: przyciecie tyl szkic', BACK, { op: 'REMOVE', depth: '6 mm', scope: PG });
  // faza 45 st. na poczatku zwoju (od strony z = 0, tak jak wkrecana nakretka)
  await sketchW('Probka gwintu: os', qStd('Front'), (W) => W.line([xs, 0, 5], [xs, 0, -20], true));
  await sketchW('Probka gwintu: faza szkic', qStd('Front'), (W) => W.poly([[xs + D.mOR, 0, 0.01], [xs + 29, 0, 0.01], [xs + 29, 0, -2.74]]));
  await revolve('Probka gwintu: faza', 'Probka gwintu: faza szkic', 'Probka gwintu: os', { op: 'REMOVE', full: true, scope: PG });
  // kawalek nakretki: ten sam otwor (#nakretkaOtwor) i gwint z luzem #luzGwint, wysokosc #nakretkaH, na pierscieniu
  await planeZ('Probka gwintu: pl. nakretki', '3.5 mm', -1);
  await sketchW('Probka gwintu: nakretka szkic', qFace('Probka gwintu: pl. nakretki'), (W) => { W.circle([xs, 0, -3.5], 62); W.circle([xs, 0, -3.5], 53.5, '#nakretkaOtwor'); });
  await ext(PN, 'Probka gwintu: nakretka szkic', BACK, { op: 'NEW', depth: '#nakretkaH', regions: regionAt('Probka gwintu: nakretka szkic', [xs + 29, 0, -3.5]) });
  await chamfer('Probka gwintu: fazy nakretki', [qNearEdge(PN, [xs + 26.75, 0, -3.5], true), qNearEdge(PN, [xs + 26.75, 0, -10.5], true)], '1 mm');
  await sweep('Probka gwintu: narzedzie gwintu', 'Probka gwintu: profil', 'Probka gwintu: helisa', 'NEW');
  await moveFaceOffset('Probka gwintu: luz gwintu', [`query=qOwnedByBody(qCreatedBy(makeId("${F['Probka gwintu: narzedzie gwintu']}"), EntityType.BODY), EntityType.FACE);`], '#luzGwint');
  await booleanOp('Probka gwintu: gwint nakretki', 'SUBTRACTION', [qBody('Probka gwintu: narzedzie gwintu')], [qBody(PN)]);
};

return 'v21 ok ' + JSON.stringify({ C0: D.C0, H0: D.H0, L: D.ciegno, M2: D.M2, dog: D.dog });
})();

// ===================== v2.1: nazwy czesci i zlozenie =====================
(() => {
const OS = window.OS, D = OS.D;
const { req, base, F } = OS;

// ---------- nazwy czesci (dopasowanie po srodku prostopadloscianu otaczajacego) ----------
OS.NAZWY = [
  ['Obudowa', [0, 0, -38.8]], ['Nakretka', [0, 0, -25.6]], ['Jarzmo z miska', [7.7, 0, -23.2]], ['Ciegno', [-0.9, 1.9, -38.4]],
  ['Ramie orczyka', [-4, -2.5, -54]], ['Tulejka przegubu korby', [7.4, -2.1, -36.1]], ['Tulejka przegubu ramienia', [-9.2, -2.1, -40.6]],
  ['Pokrywa tylna', [0, -5.9, -76.3]], ['PODGLAD pileczka 40.5', [0, 0, -12]], ['PODGLAD SG90', [0, -19, -60.6]], ['PODGLAD orczyk SG90', [-2.4, -3.8, -58.5]],
  ['Przyrzad do wklejania pileczki', [130, 0, -3.2]], ['Przyrzad centrowania orczyka', [-5, -15.3, -40.6]],
  ['Probka gwintu - obudowa', [-130, 0, -7], 56.4], ['Probka gwintu - nakretka', [-130, 0, -7], 62],
];
OS.nazwy = async () => {
  const parts = await (await req(`/api/v10/parts/d/${OS.did}/w/${OS.wid}/e/${OS.eid}`)).json();
  const C = [];
  for (const p of parts) {
    const b = await (await req(`/api/v10/parts/d/${OS.did}/w/${OS.wid}/e/${OS.eid}/partid/${encodeURIComponent(p.partId)}/boundingboxes`)).json();
    C.push([p.partId, [(b.lowX + b.highX) * 500, (b.lowY + b.highY) * 500, (b.lowZ + b.highZ) * 500, (b.highX - b.lowX) * 1000]]);
  }
  OS.PID = {};
  for (const [name, c, dx] of OS.NAZWY) {
    let best = null, bd = 1e9; for (const [pid, m] of C) { const d = Math.hypot(m[0] - c[0], m[1] - c[1], m[2] - c[2]) + (dx ? Math.abs(m[3] - dx) * 10 : 0); if (d < bd) { bd = d; best = pid; } }
    OS.PID[name] = best;
    await req(`/api/v10/metadata/d/${OS.did}/w/${OS.wid}/e/${OS.eid}/p/${encodeURIComponent(best)}`, { method: 'POST',
      body: JSON.stringify({ jsonType: 'metadata-part', partId: best, properties: [{ propertyId: '57f3fb8efa3416c06701d60d', value: name }] }) });
    OS.log.push(`nazwa ${name} -> ${best} (odl. ${bd.toFixed(1)})`);
  }
};

// ---------- zlozenie (Assembly): grupy + lacznik na krawedziach otworow osi + mate'y ----------
// Obudowe trzeba potem unieruchomic recznie (PPM na "Obudowa" -> Fix) - REST API nie ma tej operacji.
OS.zlozenie = async (name = 'Oko F v2.1 - zlozenie') => {
  const P = OS.PID;
  const r0 = await req(`/api/v10/assemblies/d/${OS.did}/w/${OS.wid}`, { method: 'POST', body: JSON.stringify({ name }) });
  OS.AID = (await r0.json()).id;
  const A = `/api/v10/assemblies/d/${OS.did}/w/${OS.wid}/e/${OS.AID}`;
  const lista = ['Obudowa', 'Nakretka', 'Jarzmo z miska', 'PODGLAD pileczka 40.5', 'Ciegno', 'Ramie orczyka', 'Tulejka przegubu korby',
    'Tulejka przegubu ramienia', 'Pokrywa tylna', 'PODGLAD SG90', 'PODGLAD orczyk SG90'];
  for (const n of lista) await req(A + '/instances', { method: 'POST', body: JSON.stringify({ documentId: OS.did, elementId: OS.eid, partId: P[n], isAssembly: false, isWholePartStudio: false }) });
  const g = await (await req(A)).json();
  const I = {}; for (const inst of g.rootAssembly.instances) { const n = lista.find((k) => P[k] === inst.partId); if (n) I[n] = inst.id; }
  const postF = async (feature) => { const r = await req(A + '/features', { method: 'POST', body: JSON.stringify({ feature }) }); const j = await r.json();
    OS.log.push(feature.name + ': ' + (j.featureState ? j.featureState.featureStatus : r.status)); return j.feature && j.feature.featureId; };
  const occ = (n) => ({ btType: 'BTMIndividualOccurrenceQuery-626', path: [I[n]] });
  const group = (nm, ns) => postF({ btType: 'BTMMateGroup-65', featureType: 'mateGroup', name: nm, parameters: [{ btType: 'BTMParameterQueryWithOccurrenceList-67', parameterId: 'occurrencesQuery', queries: ns.map(occ) }] });
  await group('Grupa: modul nieruchomy', ['Obudowa', 'Nakretka', 'PODGLAD SG90', 'Pokrywa tylna']);
  await group('Grupa: jarzmo z pileczka', ['Jarzmo z miska', 'PODGLAD pileczka 40.5']);
  await group('Grupa: ramie z orczykiem', ['Ramie orczyka', 'PODGLAD orczyk SG90']);
  await group('Grupa: ciegno z tulejkami', ['Ciegno', 'Tulejka przegubu korby', 'Tulejka przegubu ramienia']);
  // krawedzie kolowe otworow (srodek, promien) -> lacznik w srodku, os Z wzdluz osi otworu, przesuniety do y = 0
  const circ = async (part, r, Pt) => {
    const j = await (await req(`${base}/bodydetails?partIds=${encodeURIComponent(P[part])}`)).json();
    let best = null, bd = 1e9;
    for (const e of j.bodies[0].edges.filter((x) => x.curve && x.curve.type === 'CIRCLE')) { const o = e.curve.origin;
      const d = Math.hypot(o.x * 1000 - Pt[0], o.y * 1000 - Pt[1], o.z * 1000 - Pt[2]) + Math.abs(e.curve.radius * 1000 - r) * 10; if (d < bd) { bd = d; best = e; } }
    return { id: best.id, y: best.curve.origin.y * 1000 };
  };
  const E = {
    tA: ['Obudowa', await circ('Obudowa', 1.3, [0, D.kulaR + D.klej + 2.3, D.zc])], jA: ['Jarzmo z miska', await circ('Jarzmo z miska', 1.65, [0, D.kulaR + D.klej + 2, D.zc])],
    jC: ['Jarzmo z miska', await circ('Jarzmo z miska', 3.0, [D.C0[0], -0.5, D.C0[1]])], cC: ['Ciegno', await circ('Ciegno', 1.65, [D.C0[0], -0.3, D.C0[1]])],
    cH: ['Ciegno', await circ('Ciegno', 1.65, [D.H0[0], -0.3, D.H0[1]])], rH: ['Ramie orczyka', await circ('Ramie orczyka', 3.0, [D.H0[0], -0.5, D.H0[1]])],
    rS: ['Ramie orczyka', await circ('Ramie orczyka', 1.4, [D.S[0], -0.5, D.S[1]])], sS: ['PODGLAD SG90', await circ('PODGLAD SG90', 2.4, [D.S[0], -4.5, D.S[1]])],
  };
  const MC = {};
  const mcFeature = (k, flip) => ({ btType: 'BTMMateConnector-66', featureType: 'mateConnector', name: 'MC ' + k, parameters: [
    { btType: 'BTMParameterEnum-145', parameterId: 'originType', enumName: 'Origin type', value: 'ON_ENTITY' },
    { btType: 'BTMParameterQueryWithOccurrenceList-67', parameterId: 'originQuery', queries: [{ btType: 'BTMInferredQueryWithOccurrence-1083', path: [I[E[k][0]]], deterministicIds: [E[k][1].id], inferenceType: 'CENTER' }] },
    { btType: 'BTMParameterBoolean-144', parameterId: 'flipPrimary', value: flip },
    { btType: 'BTMParameterBoolean-144', parameterId: 'transform', value: true },
    { btType: 'BTMParameterQuantity-147', parameterId: 'translationX', expression: '0 mm' }, { btType: 'BTMParameterQuantity-147', parameterId: 'translationY', expression: '0 mm' },
    { btType: 'BTMParameterQuantity-147', parameterId: 'translationZ', expression: `${(-E[k][1].y).toFixed(4)} mm` }] });
  for (const k of Object.keys(E)) MC[k] = await postF(mcFeature(k, true));
  const q = (k) => ({ btType: 'BTMFeatureQueryWithOccurrence-157', path: [], featureId: MC[k], queryData: '' });
  const mate = (nm, type, a, b, extra = []) => postF({ btType: 'BTMMate-64', featureType: 'mate', name: nm, parameters: [
    { btType: 'BTMParameterEnum-145', parameterId: 'mateType', enumName: 'Mate type', value: type },
    { btType: 'BTMParameterQueryWithOccurrenceList-67', parameterId: 'mateConnectorsQuery', queries: [q(a), q(b)] }, ...extra] });
  // limity: samo 'expression' bez 'value' daje w Onshape zakres 0..0 i blokuje Animate - trzeba podac tez wartosc w radianach
  const lim = [{ btType: 'BTMParameterBoolean-144', parameterId: 'limitsEnabled', value: true },
    { btType: 'BTMParameterNullableQuantity-807', parameterId: 'limitAxialZMin', expression: '-33 deg', value: -33 * Math.PI / 180, isNull: false },
    { btType: 'BTMParameterNullableQuantity-807', parameterId: 'limitAxialZMax', expression: '33 deg', value: 33 * Math.PI / 180, isNull: false }];
  // limit walu serwa -37..+30: przy oku +-33 serwo ma -34.2..+27.3, druga galaz czworoboku zaczyna sie od -40.9 - limit ja wyklucza,
  // wiec przeciaganie pileczki zawsze prowadzi naped wlasciwa droga. C obrotowy (ciegno tylko w plaszczyznie), H kulowy (bez przewiazania).
  const limS = [{ btType: 'BTMParameterBoolean-144', parameterId: 'limitsEnabled', value: true },
    { btType: 'BTMParameterNullableQuantity-807', parameterId: 'limitAxialZMin', expression: '-37 deg', value: -37 * Math.PI / 180, isNull: false },
    { btType: 'BTMParameterNullableQuantity-807', parameterId: 'limitAxialZMax', expression: '30 deg', value: 30 * Math.PI / 180, isNull: false }];
  const pary = [['Os oka 2 x M3 (ogranicznik +-33)', 'REVOLUTE', 'tA', 'jA', lim], ['Wal serwa - ramie orczyka (limit -37..+30, blokuje druga galaz czworoboku)', 'REVOLUTE', 'sS', 'rS', limS],
    ['Przegub C: korba - ciegno', 'REVOLUTE', 'jC', 'cC'], ['Przegub H: ciegno - ramie', 'BALL', 'cH', 'rH']];
  for (const p of pary) await mate(...p);
  // os Z kazdego lacznika ma wskazywac +Y; jesli wyszla -Y, odwroc lacznik (kierunek krawedzi zalezy od jej parametryzacji)
  const g2 = await (await req(A + '?includeMateFeatures=true')).json();
  const zy = {};
  g2.rootAssembly.features.filter((f) => f.featureType === 'mate').forEach((f, i) => f.featureData.matedEntities.forEach((m, j2) => { zy[[pary[i][2], pary[i][3]][j2]] = m.mateConnectorCS.zAxis[1]; }));
  const feats = (await (await req(A + '/features')).json()).features;
  for (const k of Object.keys(zy)) if (zy[k] < 0) {
    const f = feats.find((x) => x.featureId === MC[k]); f.parameters.find((x) => x.parameterId === 'flipPrimary').value = false;
    await req(A + '/features/featureid/' + encodeURIComponent(f.featureId), { method: 'POST', body: JSON.stringify({ feature: f }) });
    OS.log.push('odwrocony ' + k);
  }
};
return 'v2c ok';
})();


// ===================== uruchomienie =====================
window.OS.all = () => window.OS.run(['zmienne', 'wspolne', 'obudowa', 'nakretka', 'jarzmo', 'naped', 'pokrywa', 'podglad', 'przyrzady', 'probka', 'nazwy']);
