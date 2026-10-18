// Budowa modelu "Oko F v2" (modul malego oka na srubach M3) w Onshape ze zwyklych operacji
// (Variable Studio, Plane, Sketch, Extrude, Revolve, Helix, Sweep, Chamfer, Move face, Boolean, Split)
// przez REST API w sesji przegladarki (cookie + X-XSRF-TOKEN), bez kluczy API.
//
// Uzycie: otworz puste Part Studio "Oko F v2" w galezi v2 dokumentu SimpleEye, wklej caly plik do konsoli i uruchom:
//   await OS.all()        // zmienne + wszystkie czesci + nazwy czesci
//   await OS.zlozenie()   // Assembly z grupami i mate'ami (potem recznie: Tuleja modulu -> Fix)
// Kazda sekcja to osobna funkcja (OS.gniazdo(), OS.tuleja() ...). Ponowne uruchomienie sekcji aktualizuje
// istniejace operacje (mapa nazwa -> featureId jest w localStorage strony), zamiast dodawac nowe.
// Foldery w drzewie i ukrycie plaszczyzn/szkicow robi sie recznie (REST API ich nie obsluguje).
// Endpointu /featurescript nie uzywamy (bardzo niski limit; 429 z Retry-After ~20 h).
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
    if (r.status === 429) { const ra = +(r.headers.get('Retry-After') || 5); OS.log.push(`429, czekam ${ra}s`); await sleep((ra + 1 + k * 2) * 1000); continue; }
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
window.OS = OS;
return 'lib ok ' + eid + ' F=' + Object.keys(F).length;
})();

// ===================== v2.js =====================
// ===== Oko F v2: liczby, pomocnicze funkcje 3D i sekcje budowy (wymaga lib.js -> window.OS) =====
(() => {
const OS = window.OS;
const { Sk, F, post, plane, planeAngle, extrude, revolve, helix, sweep, cpattern, chamfer, moveFaceOffset, booleanOp,
  qStd, qFace, qEdge, qBody, qReg, qNearEdge, qNearFace, v3, req, base, pq, pn, pb, ps, pe, mm, deg } = OS;
const r2d = 180 / Math.PI, d2r = Math.PI / 180;

// ---------- liczby (zgodne z domyslnymi zmiennymi) ----------
const D = {};
D.zc = -12;                      // srodek pileczki (wystaje ~8 mm ponad rant)
D.Rb = 20.25;                    // kulaDmax / 2
D.hTop = -3;                     // wierzch orczyka = servoSpodY + servoH
D.mIR = 24.25; D.mOR = 26.65; D.gIR = 27.25; D.gOR = 29.65; D.gTop = 30.85;
D.zMf = -1.9;                    // czolo tulei modulu
D.gL = 41.44;                    // dlugosc gniazda (gniazdoL)
D.zEnd = -74.5;                  // koniec tulei (czolo - modulL)
// bagnet
D.zaczepZ0 = -7.6; D.zaczepZ1 = -4.6; D.zaczepH = 1.2; D.zaczepW = 6; D.luzZ = 0.3;
D.dno = 25.65; D.katy = [0, 150, 210]; D.obrot = 30;
D.zA = D.zaczepZ0 - D.luzZ; D.zB = D.zaczepZ1 + D.luzZ;
// naped (czworobok): A os oka, C korba, H ramie orczyka, S wal serwa (wspolrzedne x, z)
D.A = [0, D.zc]; D.korba = 26; D.alfa = 16; D.S = [0, -63]; D.ramie = 25.5; D.beta = 198;
D.C0 = [D.korba * Math.sin(D.alfa * d2r), D.zc - D.korba * Math.cos(D.alfa * d2r)];
D.H0 = [D.S[0] + D.ramie * Math.sin(D.beta * d2r), D.S[1] - D.ramie * Math.cos(D.beta * d2r)];
D.ciegno = Math.hypot(D.C0[0] - D.H0[0], D.C0[1] - D.H0[1]);
D.dirR = [(D.H0[0] - D.S[0]) / D.ramie, (D.H0[1] - D.S[1]) / D.ramie]; // kierunek ramienia S->H
D.M2 = [D.S[0] + 13 * D.dirR[0], D.S[1] + 13 * D.dirR[1]];         // otwor orczyka 13 mm
// SG90 (lezy wzdluz Z, wal z tylu korpusu)
D.sW = 11.8; D.sL = 22.5; D.sH = 22.7; D.sSpod = -33.5; D.sUcho = -17.6; D.uszyL = 32.2; D.uszyRoz = 27.8;
D.sPrzod = D.S[1] + 16.6; D.sTyl = D.S[1] - 5.9; D.sSrodek = D.S[1] + 5.35;
D.uchoP = D.sSrodek + D.uszyRoz / 2; D.uchoT = D.sSrodek - D.uszyRoz / 2;          // otwory uszu
D.uszyP = D.sSrodek + D.uszyL / 2; D.uszyT = D.sSrodek - D.uszyL / 2;              // konce uszu
// jarzmo: pierscien w plaszczyznie przez os oka, odchylonej o gamma od -Z ku +x
D.gamma = 60; D.u = [Math.sin(D.gamma * d2r), -Math.cos(D.gamma * d2r)]; D.n = [Math.cos(D.gamma * d2r), Math.sin(D.gamma * d2r)];
D.dogRho = -3.0; D.dogT = 2.0;   // kolek ogranicznika na oczku (wsp. pierscienia)
D.dog = [D.A[0] + D.dogRho * D.u[0] + D.dogT * D.n[0], D.A[1] + D.dogRho * D.u[1] + D.dogT * D.n[1]];
D.dogR = Math.hypot(D.dog[0] - D.A[0], D.dog[1] - D.A[1]); D.dogAng = Math.atan2(D.dog[1] - D.A[1], D.dog[0] - D.A[0]) * r2d;
D.dogHalf = Math.asin(0.7 / D.dogR) * r2d; D.stop = 33;  // ogranicznik +-33 st. (praca +-30)
// przyrzad do wiercenia
D.J = [130, 0, D.zc];
// krzywizna dyni (R 150) dla rantu i nakretki
D.dyniaR = 150; D.sag = (r, R = D.dyniaR) => R - Math.sqrt(R * R - r * r);

// ---------- 3D ----------
const P3 = (x, z, y = 0) => [x, y, z];                       // punkt (x,z) na wysokosci y
const ptXZ = (x, z, y) => [x, y, z];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
async function mat(key) {
  const r = await req(base + '/sketches?sketchId=' + F[key]);
  const j = await r.json(); const M = j.sketches[0].sketchMatrix;
  return { X: [M[0], M[4], M[8]], Y: [M[1], M[5], M[9]], N: [M[2], M[6], M[10]], O: [M[3] * 1000, M[7] * 1000, M[11] * 1000] };
}
// szkic rysowany we wspolrzednych swiata: draw(W) gdzie W ma metody circle(P, d, expr), poly([P...]), pas(P,Q,w), sector..., line
async function sketchW(key, planeQ, draw) {
  if (!F[key]) await post({ btType: 'BTMSketch-151', featureType: 'newSketch', name: key, parameters: [pq('sketchPlane', planeQ)], entities: [], constraints: [] }, key);
  const m = OS.M[key] || (OS.M[key] = await mat(key));
  const L = (P) => { const d = sub(P, m.O); return [dot(d, m.X), dot(d, m.Y)]; };
  const sk = new Sk();
  const W = {
    circle: (P, d, expr) => { const p = L(P); return sk.circle(p[0], p[1], d, expr); },
    poly: (Ps) => sk.poly(Ps.map(L)),
    line: (P, Q, c) => { const p = L(P), q = L(Q); return sk.line(p[0], p[1], q[0], q[1], c); },
    pas: (P, Q, w) => sk.pas(L(P), L(Q), w),
    L, m, sk,
  };
  draw(W);
  await post({ btType: 'BTMSketch-151', featureType: 'newSketch', name: key, parameters: [pq('sketchPlane', planeQ)], entities: sk.e, constraints: sk.c }, key);
  return m;
}
OS.M = OS.M || {};
// wyciagniecie w zadanym kierunku swiata (dir) - opp liczone z normalnej szkicu
async function ext(key, skKey, dir, o = {}) {
  const m = OS.M[skKey]; const opp = dir ? dot(m.N, dir) < 0 : false;
  return extrude(key, skKey, { ...o, opp });
}
const regionAt = (skKey, P) => `query=qContainsPoint(qSketchRegion(makeId("${F[skKey]}"), false), ${v3(P)});`;
const allRegions = (skKey) => `query=qSketchRegion(makeId("${F[skKey]}"), false);`;
// plaszczyzny rownolegle do ukladu: y = wartosc (Front), z = wartosc (Top), x = wartosc (Right)
// expr: wyrazenie dodatnie; sign: +1 / -1 (kierunek osi)
const planeY = (key, expr, sign) => plane(key, qStd('Front'), expr, sign > 0);   // Front: normalna -Y
const planeZ = (key, expr, sign) => plane(key, qStd('Top'), expr, sign < 0);     // Top: normalna +Z
const planeX = (key, expr, sign) => plane(key, qStd('Right'), expr, sign < 0);   // Right: normalna +X
const planeOff = (key, baseKey, expr, opp) => plane(key, qFace(baseKey), expr, opp);
const poly2 = (pts, y, fn) => pts.map((p) => fn ? fn(p) : [p[0], y, p[1]]);
// punkty luku wokol srodka c (x,z) w plaszczyznie y: kat psi od -Z ku +x
const arcPts = (c, r, psi0, psi1, n, y) => { const P = []; for (let i = 0; i <= n; i++) { const p = (psi0 + (psi1 - psi0) * i / n) * d2r; P.push([c[0] + r * Math.sin(p), y, c[1] - r * Math.cos(p)]); } return P; };
const psiPt = (r, psi, y) => [D.A[0] + r * Math.sin(psi * d2r), y, D.A[1] - r * Math.cos(psi * d2r)];
// prostokat obrocony: srodek c (x,z), osie a (x,z) i b (x,z), polowy ha, hb
const rotRect = (c, a, b, ha, hb, y) => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([s, t]) => [c[0] + s * ha * a[0] + t * hb * b[0], y, c[1] + s * ha * a[1] + t * hb * b[1]]);
// polar w plaszczyznie XY (Top) - kat od +x, CCW patrzac od +Z
const pXY = (r, a, z) => [r * Math.cos(a * d2r), r * Math.sin(a * d2r), z];
const radialW = (r0, r1, w, a, z) => { const c = Math.cos(a * d2r), s = Math.sin(a * d2r); const R = (x, y) => [x * c - y * s, x * s + y * c, z];
  return [R(r0, -w / 2), R(r1, -w / 2), R(r1, w / 2), R(r0, w / 2)]; };
const UP = [0, 1, 0], DOWN = [0, -1, 0], FWD = [0, 0, 1], BACK = [0, 0, -1];

OS.D = D;
Object.assign(OS, { sketchW, ext, regionAt, allRegions, planeY, planeZ, planeX, planeOff, arcPts, psiPt, rotRect, pXY, radialW, UP, DOWN, FWD, BACK, mat, P3, ptXZ });

// ---------- zmienne (Variable Studio "Zmienne v2") ----------
OS.VARS = [
  ['kulaDmax', '40.5 mm', 'najwieksza pileczka: od niej licza sie luzy'],
  ['kulaDmin', '39.5 mm', 'najmniejsza pileczka: od niej liczy sie zaglebienie kolka'],
  ['luzKula', '0.75 mm', 'luz pileczka - pierscien jarzma'],
  ['luzOs', '0.4 mm', 'luz pileczka - oczko jarzma (na osi)'],
  ['jarzmoT', '2.5 mm', 'grubosc promieniowa pierscienia jarzma'],
  ['jarzmoW', '6 mm', 'szerokosc pierscienia jarzma (grubosc na stole)'],
  ['oczkoT', '2 mm', 'grubosc oczka jarzma na osi'],
  ['luzOsiowy', '0.3 mm', 'luz osiowy oczko - wystep tulei'],
  ['luzJarzmo', '0.75 mm', 'luz pierscien jarzma - tuleja'],
  ['sciankaM', '2.4 mm', 'scianka tulei modulu'],
  ['luzBagnet', '0.6 mm', 'luz promieniowy modul - gniazdo'],
  ['sciankaG', '2.4 mm', 'scianka gniazda pod gwintem'],
  ['gwintSkok', '3 mm', 'skok gwintu (profil liczony pod 3 mm)'],
  ['luzGwint', '0.3 mm', 'luz gwintu nakretki (odsuniecie scian)'],
  ['rantD', '68 mm', 'srednica rantu'],
  ['rantT', '1.5 mm', 'grubosc plaskiej czesci rantu'],
  ['kolnierzykD', '43 mm', 'otwor w rancie (oczodol)'],
  ['przodD', '62 mm', 'przednia czesc gniazda (otwor w dyni 64)'],
  ['przodL', '12 mm', 'dlugosc przedniej czesci gniazda'],
  ['dociskMin', '15 mm', 'najciensza scianka dyni'],
  ['dociskMax', '30 mm', 'najgrubsza scianka dyni'],
  ['nakretkaH', '7 mm', 'wysokosc nakretki'],
  ['nakretkaD', '72 mm', 'srednica nakretki'],
  ['nakretkaZ', '25 mm', 'polozenie nakretki pod rantem (tylko podglad)'],
  ['modulL', '72.6 mm', 'dlugosc tulei modulu'],
  ['m3Ciasny', '2.6 mm', 'otwor M3 ciasny (sruba wkreca sie w plastik)'],
  ['m3Luzny', '3.3 mm', 'otwor M3 luzny (obrot na srubie)'],
  ['lebD', '6.2 mm', 'pogłębienie pod leb sruby osi (ISO 7380 / DIN 7984)'],
  ['lebH', '1.9 mm', 'glebokosc pogłębienia pod leb sruby osi'],
  ['wkladkaD', '4 mm', 'otwor pod wkladke M3 do wtapiania'],
  ['wkladkaL', '4 mm', 'dlugosc wkladki M3'],
  ['tulejkaD', '5.6 mm', 'srednica tulejki przegubu'],
  ['luzPrzegub', '0.2 mm', 'luz promieniowy przegubu (korba/ramie na tulejce)'],
  ['kolnierzD', '8 mm', 'srednica kolnierza tulejki'],
  ['kolnierzH', '0.8 mm', 'grubosc kolnierza tulejki'],
  ['plytaT', '2.5 mm', 'grubosc korby, ciegna i ramienia'],
  ['kolecD', '4 mm', 'srednica kolka w tyl pileczki'],
  ['kolecGleb', '2.25 mm', 'zaglebienie kolka w najmniejszej pileczce'],
  ['servoH', '30.5 mm', 'SG90: od spodu korpusu do wierzchu orczyka (POMIAR)'],
  ['servoSpodY', '-33.5 mm', 'polozenie spodu SG90 (os Y)'],
  ['servoUcho', '15.9 mm', 'SG90: od spodu korpusu do spodu uszu (POMIAR)'],
  ['serwoWkret', '1.8 mm', 'otwor pod wkret z kompletu serwa'],
  ['m2Otwor', '2.2 mm', 'otwor pod wkret M2 do orczyka'],
  ['hornTop', '#servoSpodY + #servoH', 'wyliczane: wierzch orczyka (os Y)'],
  ['modulID', '#kulaDmax + 2 * (#luzKula + #jarzmoT + #luzJarzmo)', 'wyliczane: srednica wewn. tulei'],
  ['modulOD', '#modulID + 2 * #sciankaM', 'wyliczane: srednica zewn. tulei'],
  ['gniazdoID', '#modulOD + 2 * #luzBagnet', 'wyliczane: otwor gniazda'],
  ['gniazdoOD', '#gniazdoID + 2 * #sciankaG', 'wyliczane: dno gwintu'],
  ['gwintD', '#gniazdoOD + 2.4 mm', 'wyliczane: srednica gwintu (zarys 1.2 mm)'],
  ['gniazdoL', '#dociskMax + #nakretkaH + 4.44 mm', 'wyliczane: dlugosc gniazda (krzywizna 3.44 + 1 mm)'],
  ['nakretkaOtwor', '#gniazdoOD + 2 * #luzGwint', 'wyliczane: otwor nakretki'],
];
OS.VSID = OS.VSID || '96b825edb16e4cba5a3bb8c7'; // id Variable Studio "Zmienne v2" w galezi v2
// Variable Studio przyjmuje odwolania tylko do zmiennych juz zapisanych, wiec wyliczane dopisujemy po jednej.
OS.zmienne = async () => {
  const url = `/api/v10/variables/d/${OS.did}/w/${OS.wid}/e/${OS.VSID}/variables`;
  const conv = (v) => v.map(([name, expression, description]) => ({ name, type: 'LENGTH', expression, description }));
  const baseV = OS.VARS.filter((v) => !v[1].includes('#')), der = OS.VARS.filter((v) => v[1].includes('#'));
  let r = await req(url, { method: 'POST', body: JSON.stringify(conv(baseV)) });
  for (let i = 1; i <= der.length; i++) r = await req(url, { method: 'POST', body: JSON.stringify(conv([...baseV, ...der.slice(0, i)])) });
  OS.log.push('zmienne: ' + r.status);
};

// ---------- Wspolne ----------
OS.wspolne = async () => {
  await sketchW('Wspolne: os Z', qStd('Front'), (W) => W.line([0, 0, -95], [0, 0, 30], true));
  await sketchW('Wspolne: os oka', qStd('Right'), (W) => W.line([0, -30, D.zc], [0, 30, D.zc], true));
  await planeY('Wspolne: pl. orczyka', '-(#hornTop)', -1);   // y = hornTop (wierzch orczyka, spod korby i ramienia)
};

// ---------- Gniazdo ----------
OS.gniazdo = async () => {
  const G = 'Gniazdo: rant';
  await sketchW('Gniazdo: rant szkic', qStd('Top'), (W) => { W.circle([0, 0, 0], 68, '#rantD'); W.circle([0, 0, 0], 43, '#kolnierzykD'); });
  await ext(G, 'Gniazdo: rant szkic', BACK, { op: 'NEW', depth: '#rantT' });
  await sketchW('Gniazdo: przod szkic', qStd('Top'), (W) => { W.circle([0, 0, 0], 62, '#przodD'); W.circle([0, 0, 0], 54.5, '#gniazdoID'); });
  await ext('Gniazdo: przod', 'Gniazdo: przod szkic', BACK, { op: 'ADD', depth: '#przodL', scope: G, regions: regionAt('Gniazdo: przod szkic', [29, 0, 0]) });
  await sketchW('Gniazdo: tuleja szkic', qStd('Top'), (W) => { W.circle([0, 0, 0], 59.3, '#gniazdoOD'); W.circle([0, 0, 0], 54.5, '#gniazdoID'); });
  await ext('Gniazdo: tuleja', 'Gniazdo: tuleja szkic', BACK, { op: 'ADD', depth: '#gniazdoL', scope: G, regions: regionAt('Gniazdo: tuleja szkic', [28.5, 0, 0]) });
  // rant dopasowany do krzywizny dyni (R 150): stozek pod rantem od r 31 do 34
  await sketchW('Gniazdo: dopasowanie rantu szkic', qStd('Front'), (W) => W.poly([[30.5, 0, -1.4], [34, 0, -1.4], [34, 0, -D.sag(34)], [30.5, 0, -D.sag(30.5)]]));
  await revolve('Gniazdo: dopasowanie rantu', 'Gniazdo: dopasowanie rantu szkic', 'Wspolne: os Z', { op: 'ADD', full: true, scope: G });
  await chamfer('Gniazdo: fazka rantu', [qNearEdge(G, [34, 0, 0])], '1 mm');
  // gwint: helisa po okregu dna gwintu + trapez 45 st. przemiatany po helisie
  await planeZ('Gniazdo: pl. startu gwintu', '#gniazdoL + #gwintSkok', -1);
  await sketchW('Gniazdo: okrag helisy', qFace('Gniazdo: pl. startu gwintu'), (W) => W.circle([0, 0, -(D.gL + 3)], 59.3, '#gniazdoOD'));
  await helix('Gniazdo: helisa gwintu', 'Gniazdo: okrag helisy', '#gwintSkok', '#gniazdoL + #gwintSkok - #dociskMin - 2.44 mm');
  const z0 = -(D.gL + 3);
  await sketchW('Gniazdo: profil gwintu', qStd('Front'), (W) => W.poly([[D.gOR - 0.4, 0, z0 - 1.4], [D.gOR, 0, z0 - 1.4], [D.gTop, 0, z0 - 0.2], [D.gTop, 0, z0 + 0.2], [D.gOR, 0, z0 + 1.4], [D.gOR - 0.4, 0, z0 + 1.4]]));
  await sweep('Gniazdo: gwint', 'Gniazdo: profil gwintu', 'Gniazdo: helisa gwintu', 'ADD', G);
  await planeZ('Gniazdo: pl. konca', '#gniazdoL', -1);
  await sketchW('Gniazdo: przyciecie gwintu szkic', qFace('Gniazdo: pl. konca'), (W) => W.circle([0, 0, -D.gL], 90));
  await ext('Gniazdo: przyciecie gwintu', 'Gniazdo: przyciecie gwintu szkic', BACK, { op: 'REMOVE', depth: '10 mm', scope: G });
  // fazowany poczatek zwoju (stozek 45 st. na koncu gniazda)
  await sketchW('Gniazdo: faza poczatku gwintu szkic', qStd('Front'), (W) => W.poly([[D.gOR, 0, -D.gL - 0.01], [32.5, 0, -D.gL - 0.01], [32.5, 0, -D.gL + 2.85]]));
  await revolve('Gniazdo: faza poczatku gwintu', 'Gniazdo: faza poczatku gwintu szkic', 'Wspolne: os Z', { op: 'REMOVE', full: true, scope: G });
  // zaczepy bagnetu (3 szt. w jednym szkicu) z fazka od strony rantu
  await planeZ('Gniazdo: pl. zaczepow', mm(-D.zaczepZ0), -1);
  await sketchW('Gniazdo: zaczepy szkic', qFace('Gniazdo: pl. zaczepow'), (W) => { for (const a of D.katy) W.poly(radialW(D.gIR - D.zaczepH, D.gIR + 0.5, D.zaczepW, a, D.zaczepZ0)); });
  await ext('Gniazdo: zaczepy', 'Gniazdo: zaczepy szkic', FWD, { op: 'ADD', depth: mm(D.zaczepZ1 - D.zaczepZ0), scope: G });
  await chamfer('Gniazdo: fazki zaczepow', D.katy.map((a) => qNearEdge('Gniazdo: zaczepy', pXY(D.gIR - D.zaczepH, a, D.zaczepZ1))), '1 mm');
  // zabki pod rantem: r 33..33.8 (>= 1 mm od krawedzi otworu 64)
  await planeZ('Gniazdo: pl. zabkow', '3.5 mm', -1);
  await sketchW('Gniazdo: zabki szkic', qFace('Gniazdo: pl. zabkow'), (W) => { for (let k = 0; k < 8; k++) W.poly(radialW(33.0, 33.8, 1.0, 22.5 + 45 * k, -3.5)); });
  await ext('Gniazdo: zabki', 'Gniazdo: zabki szkic', BACK, { op: 'ADD', depth: '1.2 mm', scope: G });
  // strzalka GORA na rancie i znacznik na koncu gniazda (tu wsuwa sie znacznik WSUN modulu)
  await sketchW('Gniazdo: strzalka GORA szkic', qStd('Top'), (W) => W.poly([[0, 32.0, 0], [-2.3, 28.0, 0], [2.3, 28.0, 0]]));
  await ext('Gniazdo: strzalka GORA', 'Gniazdo: strzalka GORA szkic', BACK, { op: 'REMOVE', depth: '0.5 mm', scope: G });
  await sketchW('Gniazdo: znacznik szkic', qFace('Gniazdo: pl. konca'), (W) => W.poly(radialW(D.gIR + 0.1, D.gIR + 1.6, 1.4, 90, -D.gL)));
  await ext('Gniazdo: znacznik', 'Gniazdo: znacznik szkic', FWD, { op: 'REMOVE', depth: '0.6 mm', scope: G });
};

// ---------- Nakretka ----------
OS.nakretka = async () => {
  const N = 'Nakretka: korpus';
  const zf = -25, zb = -32;
  await planeZ('Nakretka: pl. czola', '#nakretkaZ', -1);
  await sketchW('Nakretka: korpus szkic', qFace('Nakretka: pl. czola'), (W) => { W.circle([0, 0, zf], 72, '#nakretkaD'); W.circle([0, 0, zf], 59.9, '#nakretkaOtwor'); });
  await ext(N, 'Nakretka: korpus szkic', BACK, { op: 'NEW', depth: '#nakretkaH', regions: regionAt('Nakretka: korpus szkic', [33, 0, zf]) });
  // czolo dopasowane do wewnetrznej scianki dyni (R ok. 127): stozek od otworu do obwodu
  const Ri = D.dyniaR - 22.5, dz = D.sag(36.5, Ri) - D.sag(30, Ri);
  await sketchW('Nakretka: dopasowanie czola szkic', qStd('Front'), (W) => W.poly([[30.0, 0, zf + 0.01], [36.6, 0, zf + 0.01], [36.6, 0, zf - dz]]));
  await revolve('Nakretka: dopasowanie czola', 'Nakretka: dopasowanie czola szkic', 'Wspolne: os Z', { op: 'REMOVE', full: true, scope: N });
  await chamfer('Nakretka: fazy otworu', [qNearEdge(N, [29.95, 0, zf], true), qNearEdge(N, [29.95, 0, zb], true)], '1 mm');
  // gwint wewnetrzny: kopia zwoju gniazda odsunieta o #luzGwint i odjeta od nakretki
  await sweep('Nakretka: narzedzie gwintu', 'Gniazdo: profil gwintu', 'Gniazdo: helisa gwintu', 'NEW');
  await moveFaceOffset('Nakretka: luz gwintu', [`query=qOwnedByBody(qCreatedBy(makeId("${F['Nakretka: narzedzie gwintu']}"), EntityType.BODY), EntityType.FACE);`], '#luzGwint');
  await booleanOp('Nakretka: gwint', 'SUBTRACTION', [qBody('Nakretka: narzedzie gwintu')], [qBody(N)]);
  await planeZ('Nakretka: pl. tylu', '#nakretkaZ + #nakretkaH', -1);
  await sketchW('Nakretka: wyciecia na klucz szkic', qFace('Nakretka: pl. tylu'), (W) => { for (let k = 0; k < 6; k++) W.poly(radialW(33, 37, 4, 30 + 60 * k, zb)); });
  await ext('Nakretka: wyciecia na klucz', 'Nakretka: wyciecia na klucz szkic', FWD, { op: 'REMOVE', depth: '2.5 mm', scope: N });
  await sketchW('Nakretka: radelkowanie szkic', qFace('Nakretka: pl. tylu'), (W) => { for (let k = 0; k < 24; k++) W.poly(radialW(35.4, 37, 1.4, 15 * k, zb)); });
  await ext('Nakretka: radelkowanie', 'Nakretka: radelkowanie szkic', FWD, { op: 'REMOVE', depth: '#nakretkaH', scope: N });
};
})();

// ===================== v2b.js =====================
(() => {
const OS = window.OS, D = OS.D;
const { F, post, planeAngle, revolve, chamfer, qStd, qFace, qEdge, qBody, qNearEdge, pq, pn, pb, pe, mm, deg,
  sketchW, ext, regionAt, allRegions, planeY, planeZ, planeX, planeOff, arcPts, psiPt, rotRect, pXY, radialW, UP, DOWN, FWD, BACK, dot } = OS;
const d2r = Math.PI / 180, r2d = 180 / Math.PI;
const W3 = (p, y) => [p[0], y, p[1]];              // (x,z) -> [x,y,z]
const zc = D.zc, A = D.A, C0 = D.C0, H0 = D.H0, S = D.S;
const add2 = (p, v, k) => [p[0] + k * v[0], p[1] + k * v[1]];

OS.tuleja = async () => {
  const T = 'Modul: tuleja';
  await planeZ('Modul: pl. czola', '1.9 mm', -1);
  await sketchW('Modul: tuleja szkic', qFace('Modul: pl. czola'), (W) => { W.circle([0, 0, D.zMf], 53.3, '#modulOD'); W.circle([0, 0, D.zMf], 48.5, '#modulID'); });
  await ext(T, 'Modul: tuleja szkic', BACK, { op: 'NEW', depth: '#modulL', regions: regionAt('Modul: tuleja szkic', [25.5, 0, D.zMf]) });
  // chwyt (dla syna) za koncem gniazda, z faza 45 st. od przodu
  await planeZ('Modul: pl. chwytu', '#gniazdoL + 1 mm', -1);
  const zg = -(D.gL + 1);
  await sketchW('Modul: chwyt szkic', qFace('Modul: pl. chwytu'), (W) => { W.circle([0, 0, zg], 64.3, '#gwintD + 2.6 mm'); W.circle([0, 0, zg], 48.5, '#modulID'); });
  await ext('Modul: chwyt', 'Modul: chwyt szkic', BACK, { op: 'ADD', depth: '6.6 mm', scope: T, regions: regionAt('Modul: chwyt szkic', [28, 0, zg]) });
  await chamfer('Modul: faza chwytu', [qNearEdge('Modul: chwyt', [32.15, 0, zg])], '5.4 mm');
  await chamfer('Modul: faza konca', [qNearEdge(T, [26.65, 0, D.zEnd])], '2.3 mm');
  // bagnet: wejscia osiowe (modul wchodzi obrocony o -30 st.) i rowki obwodowe
  const hw = D.zaczepW / 2 + D.luzZ, polKat = hw / D.mOR * r2d;
  await sketchW('Modul: wejscia bagnetu szkic', qStd('Top'), (W) => { for (const a of D.katy) W.poly(radialW(D.dno, D.mOR + 1, 2 * hw, a + D.obrot, 0)); });
  await ext('Modul: wejscia bagnetu', 'Modul: wejscia bagnetu szkic', BACK, { op: 'REMOVE', depth: mm(-D.zA), scope: T });
  for (const a of D.katy) {
    const a0 = a - polKat;
    await planeAngle(`Modul: pl. rowka ${a}`, 'Wspolne: os Z', qStd('Front'), deg(a0));
    await sketchW(`Modul: rowek ${a} szkic`, qFace(`Modul: pl. rowka ${a}`), (W) => W.poly([pXY(D.dno, a0, D.zA), pXY(D.mOR + 1, a0, D.zA), pXY(D.mOR + 1, a0, D.zB), pXY(D.dno, a0, D.zB)]));
    await revolve(`Modul: rowek bagnetu ${a}`, `Modul: rowek ${a} szkic`, 'Wspolne: os Z', { op: 'REMOVE', angle: deg(D.obrot + 2 * polKat), scope: T });
  }
  // sprezyste jezyki z garbem (klik w pozycji ZAMKNIETE): szczeliny nad i pod jezykiem + szczelina na koncu
  for (const a of D.katy) {
    const a0 = a + 2;
    await planeAngle(`Modul: pl. jezyka ${a}`, 'Wspolne: os Z', qStd('Front'), deg(a0));
    await sketchW(`Modul: szczeliny jezyka ${a} szkic`, qFace(`Modul: pl. jezyka ${a}`), (W) => {
      W.poly([pXY(24.0, a0, D.zB - 0.6), pXY(25.75, a0, D.zB - 0.6), pXY(25.75, a0, D.zB), pXY(24.0, a0, D.zB)]);
      W.poly([pXY(24.0, a0, D.zA), pXY(25.75, a0, D.zA), pXY(25.75, a0, D.zA + 0.6), pXY(24.0, a0, D.zA + 0.6)]);
    });
    await revolve(`Modul: szczeliny jezyka ${a}`, `Modul: szczeliny jezyka ${a} szkic`, 'Wspolne: os Z', { op: 'REMOVE', angle: '24 deg', scope: T });
  }
  await planeZ('Modul: pl. rowkow', mm(-D.zB), -1);
  await sketchW('Modul: konce jezykow szkic', qFace('Modul: pl. rowkow'), (W) => { for (const a of D.katy) W.poly(radialW(24.0, 25.75, 0.6, a + 2, D.zB)); });
  await ext('Modul: konce jezykow', 'Modul: konce jezykow szkic', BACK, { op: 'REMOVE', depth: mm(D.zB - D.zA), scope: T });
  await planeZ('Modul: pl. garbow', mm(-(D.zB - 0.6)), -1);
  const zt = D.zB - 0.6;
  await sketchW('Modul: garby szkic', qFace('Modul: pl. garbow'), (W) => { for (const a of D.katy) { const ac = a + 10.4, b = 2.4 / 25.3 * r2d, t = 0.4 / 26.65 * r2d;
    W.poly([pXY(25.3, ac - b, zt), pXY(26.65, ac - t, zt), pXY(26.65, ac + t, zt), pXY(25.3, ac + b, zt)]); } });
  await ext('Modul: garby', 'Modul: garby szkic', BACK, { op: 'ADD', depth: mm(zt - (D.zA + 0.6)), scope: T });
  // wystepy pod os oka (gora i dol), ksztalt kropli (bez nawisu przy druku czolem w dol)
  const kropla = (y) => { const P = []; for (let f = 45; f >= -225; f -= 15) P.push([5 * Math.cos(f * d2r), y, zc + 5 * Math.sin(f * d2r)]); P.push([0, y, zc + 5 * Math.SQRT2]); return P; };
  const yW = 22.95, yWexpr = '#kulaDmax / 2 + #luzOs + #oczkoT + #luzOsiowy';
  for (const [nm, sg] of [['gora', 1], ['dol', -1]]) {
    await planeY(`Modul: pl. wystepu ${nm}`, yWexpr, sg);
    await sketchW(`Modul: wystep ${nm} szkic`, qFace(`Modul: pl. wystepu ${nm}`), (W) => W.poly(kropla(sg * yW)));
    await ext(`Modul: wystep osi ${nm}`, `Modul: wystep ${nm} szkic`, sg > 0 ? UP : DOWN, { op: 'ADD', depth: '3 mm', scope: T });
    // rowek ogranicznika (kolek oczka jarzma chodzi w luku +-33 st.) i kanal montazowy od czola
    const g0 = D.dogAng - D.stop - D.dogHalf, g1 = D.dogAng + D.stop + D.dogHalf, y = sg * yW;
    await sketchW(`Modul: rowek ogranicznika ${nm} szkic`, qFace(`Modul: pl. wystepu ${nm}`), (W) => {
      const P = []; for (let i = 0; i <= 12; i++) { const f = (g0 + (g1 - g0) * i / 12) * d2r; P.push([4.5 * Math.cos(f), y, zc + 4.5 * Math.sin(f)]); }
      for (let i = 12; i >= 0; i--) { const f = (g0 + (g1 - g0) * i / 12) * d2r; P.push([2.7 * Math.cos(f), y, zc + 2.7 * Math.sin(f)]); }
      W.poly(P);
      W.poly([[-2.5, y, D.dog[1] - 0.8], [-0.7, y, D.dog[1] - 0.8], [-0.7, y, -3.5], [-2.5, y, -3.5]]);
    });
    await ext(`Modul: rowek ogranicznika ${nm}`, `Modul: rowek ogranicznika ${nm} szkic`, sg > 0 ? UP : DOWN, { op: 'REMOVE', depth: '1 mm', scope: T, regions: allRegions(`Modul: rowek ogranicznika ${nm} szkic`) });
    // poglebienie pod leb i otwor ciasny M3
    await planeY(`Modul: pl. ${nm} tulei`, '#modulOD / 2', sg);
    await sketchW(`Modul: poglebienie ${nm} szkic`, qFace(`Modul: pl. ${nm} tulei`), (W) => W.circle([0, sg * 26.65, zc], 6.2, '#lebD'));
    await ext(`Modul: poglebienie ${nm}`, `Modul: poglebienie ${nm} szkic`, sg > 0 ? DOWN : UP, { op: 'REMOVE', depth: '#lebH', scope: T });
    await sketchW(`Modul: otwor osi ${nm} szkic`, qFace(`Modul: pl. ${nm} tulei`), (W) => W.circle([0, sg * 26.65, zc], 2.6, '#m3Ciasny'));
    await ext(`Modul: otwor osi ${nm}`, `Modul: otwor osi ${nm} szkic`, sg > 0 ? DOWN : UP, { op: 'REMOVE', depth: '6 mm', scope: T });
  }
  // slupek pod przednie ucho SG90 (z podpora 45 st.) i otwor na wkret z kompletu
  await planeY('Modul: pl. uszu serwa', '-(#servoSpodY + #servoUcho)', -1);
  await sketchW('Modul: slupek serwa szkic', qFace('Modul: pl. uszu serwa'), (W) => W.poly([[-4, D.sUcho, D.uszyP], [4, D.sUcho, D.uszyP], [4, D.sUcho, D.sPrzod], [-4, D.sUcho, D.sPrzod]]));
  await ext('Modul: slupek serwa', 'Modul: slupek serwa szkic', DOWN, { op: 'ADD', depth: '7.9 mm', scope: T });
  await sketchW('Modul: podpora slupka szkic', qStd('Right'), (W) => W.poly([[0, D.sUcho, D.uszyP], [0, -25.0, D.uszyP], [0, -25.0, D.uszyP + (D.sUcho + 25.0)]]));
  await ext('Modul: podpora slupka', 'Modul: podpora slupka szkic', null, { op: 'ADD', depth: '8 mm', sym: true, scope: T });
  await sketchW('Modul: otwor ucha szkic', qFace('Modul: pl. uszu serwa'), (W) => W.circle([0, D.sUcho, D.uchoP], 1.8, '#serwoWkret'));
  await ext('Modul: otwor ucha', 'Modul: otwor ucha szkic', DOWN, { op: 'REMOVE', depth: '8 mm', scope: T });
  // szczelina od dolu: SG90 wsuwa sie od tylu i wystaje pod tuleje (za gniazdem)
  await planeY('Modul: pl. szczeliny', '20 mm', -1);
  await sketchW('Modul: szczelina serwa szkic', qFace('Modul: pl. szczeliny'), (W) => W.poly([[-6.6, -20, D.sPrzod], [6.6, -20, D.sPrzod], [6.6, -20, -82], [-6.6, -20, -82]]));
  await ext('Modul: szczelina serwa', 'Modul: szczelina serwa szkic', DOWN, { op: 'REMOVE', depth: '20 mm', scope: T });
  // otwory montazowe: od dolu do srub przegubow, od gory do wkretow uszu i orczyka
  await sketchW('Modul: otwory dolne szkic', qFace('Modul: pl. dol tulei'), (W) => { W.circle(W3(C0, -26.65), 9); W.circle(W3(H0, -26.65), 9); });
  await ext('Modul: otwory dolne', 'Modul: otwory dolne szkic', UP, { op: 'REMOVE', depth: '5 mm', scope: T, regions: allRegions('Modul: otwory dolne szkic') });
  await sketchW('Modul: otwory gorne szkic', qFace('Modul: pl. gora tulei'), (W) => {
    W.circle([0, 26.65, D.uchoP], 6); W.circle([0, 26.65, D.uchoT], 6);
    W.pas(W3(S, 26.65), W3(D.M2, 26.65), 9); W.circle(W3(S, 26.65), 9); W.circle(W3(D.M2, 26.65), 9);
  });
  await ext('Modul: otwory gorne', 'Modul: otwory gorne szkic', DOWN, { op: 'REMOVE', depth: '5 mm', scope: T, regions: allRegions('Modul: otwory gorne szkic') });
  // uszy z wkladkami M3 do przykrecenia pokrywy tylnej (z faza 45 st.)
  for (const a of [60, 120]) {
    await planeAngle(`Modul: pl. ucha pokrywy ${a}`, 'Wspolne: os Z', qStd('Front'), deg(a));
    await sketchW(`Modul: ucho pokrywy ${a} szkic`, qFace(`Modul: pl. ucha pokrywy ${a}`), (W) => W.poly([pXY(26.0, a, D.zEnd), pXY(31.15, a, D.zEnd), pXY(31.15, a, D.zEnd + 4.5), pXY(26.0, a, D.zEnd + 9.65)]));
    await ext(`Modul: ucho pokrywy ${a}`, `Modul: ucho pokrywy ${a} szkic`, null, { op: 'ADD', depth: '8 mm', sym: true, scope: T });
  }
  await planeZ('Modul: pl. konca', '1.9 mm + #modulL', -1);
  await sketchW('Modul: otwory wkladek szkic', qFace('Modul: pl. konca'), (W) => { for (const a of [60, 120]) W.circle(pXY(28.9, a, D.zEnd), 4, '#wkladkaD'); });
  await ext('Modul: otwory wkladek', 'Modul: otwory wkladek szkic', FWD, { op: 'REMOVE', depth: '#wkladkaL + 0.5 mm', scope: T, regions: allRegions('Modul: otwory wkladek szkic') });
  // znaczniki na tylnej scianie chwytu: WSUN (kolko, 120 st.), strzalka, ZAMKNIETE (kreska, 90 st.)
  await planeZ('Modul: pl. tylu chwytu', '#gniazdoL + 7.6 mm', -1);
  const zt2 = -(D.gL + 7.6);
  await sketchW('Modul: znaczniki szkic', qFace('Modul: pl. tylu chwytu'), (W) => {
    W.poly(radialW(27.4, 31.4, 1.4, 90, zt2));
    W.circle(pXY(29.4, 120, zt2), 3);
    const P = []; for (let k = 0; k <= 8; k++) P.push(pXY(29.8, 114 - 14 * k / 8, zt2)); for (let k = 8; k >= 0; k--) P.push(pXY(29.0, 114 - 14 * k / 8, zt2)); W.poly(P);
    W.poly([pXY(29.4, 96, zt2), pXY(27.9, 101, zt2), pXY(30.9, 101, zt2)]);
  });
  await ext('Modul: znaczniki', 'Modul: znaczniki szkic', FWD, { op: 'REMOVE', depth: '0.6 mm', scope: T, regions: allRegions('Modul: znaczniki szkic') });
};

OS.jarzmo = async () => {
  const J = 'Jarzmo: pierscien';
  const u = D.u, n = D.n;
  await planeAngle('Jarzmo: pl. pierscienia', 'Wspolne: os oka', qStd('Right'), '120 deg');
  await sketchW('Jarzmo: pierscien szkic', qFace('Jarzmo: pl. pierscienia'), (W) => {
    W.circle([0, 0, zc], 42, '#kulaDmax + 2 * #luzKula'); W.circle([0, 0, zc], 47, '#kulaDmax + 2 * (#luzKula + #jarzmoT)');
    W.line([0, -30, zc], [0, 30, zc]);
  });
  const pr = add2(A, u, 22.25);
  await ext(J, 'Jarzmo: pierscien szkic', null, { op: 'NEW', depth: '#jarzmoW', sym: true, regions: regionAt('Jarzmo: pierscien szkic', W3(pr, 0)) });
  // oczka na osi (gora/dol), przyciecie pierscienia nad oczkami, otwory luzne M3, kolki ogranicznika
  for (const [nm, sg] of [['gora', 1], ['dol', -1]]) {
    await planeY(`Jarzmo: pl. oczka ${nm}`, '#kulaDmax / 2 + #luzOs', sg);
    await sketchW(`Jarzmo: oczko ${nm} szkic`, qFace(`Jarzmo: pl. oczka ${nm}`), (W) => W.poly(rotRect(A, u, n, 4.8, 3.0, sg * 20.65)));
    await ext(`Jarzmo: oczko ${nm}`, `Jarzmo: oczko ${nm} szkic`, sg > 0 ? UP : DOWN, { op: 'ADD', depth: '#oczkoT', scope: J });
    await planeY(`Jarzmo: pl. nad oczkiem ${nm}`, '#kulaDmax / 2 + #luzOs + #oczkoT', sg);
    await sketchW(`Jarzmo: przyciecie ${nm} szkic`, qFace(`Jarzmo: pl. nad oczkiem ${nm}`), (W) => W.circle(W3(A, sg * 22.65), 13));
    await ext(`Jarzmo: przyciecie ${nm}`, `Jarzmo: przyciecie ${nm} szkic`, sg > 0 ? UP : DOWN, { op: 'REMOVE', depth: '5 mm', scope: J });
    await sketchW(`Jarzmo: kolek ogranicznika ${nm} szkic`, qFace(`Jarzmo: pl. nad oczkiem ${nm}`), (W) => W.circle(W3(D.dog, sg * 22.65), 1.4));
    await ext(`Jarzmo: kolek ogranicznika ${nm}`, `Jarzmo: kolek ogranicznika ${nm} szkic`, sg > 0 ? UP : DOWN, { op: 'ADD', depth: '0.8 mm', scope: J });
  }
  await sketchW('Jarzmo: otwory osi szkic', qStd('Front'), (W) => W.circle(W3(A, 0), 3.3, '#m3Luzny'));
  await ext('Jarzmo: otwory osi', 'Jarzmo: otwory osi szkic', null, { op: 'REMOVE', depth: '60 mm', sym: true, scope: J });
  // korba zrosnieta z pierscieniem (warstwa korby = wierzch orczyka)
  const yk = D.hTop;
  await sketchW('Jarzmo: korba szkic', qFace('Wspolne: pl. orczyka'), (W) => {
    W.poly([...arcPts(A, 20.75, 62, 14, 16, yk), psiPt(27, 14, yk), psiPt(28.5, 21, yk), psiPt(23.4, 30, yk), ...arcPts(A, 23.4, 30, 62, 10, yk)]);
    W.circle(W3(C0, yk), 8.4);
  });
  await ext('Jarzmo: korba', 'Jarzmo: korba szkic', UP, { op: 'ADD', depth: '#plytaT', scope: J, regions: allRegions('Jarzmo: korba szkic') });
  await sketchW('Jarzmo: otwor korby szkic', qFace('Wspolne: pl. orczyka'), (W) => W.circle(W3(C0, yk), 6, '#tulejkaD + 2 * #luzPrzegub'));
  await ext('Jarzmo: otwor korby', 'Jarzmo: otwor korby szkic', UP, { op: 'REMOVE', depth: '#plytaT', scope: J });
  // siodlo na tyl pileczki (szerzej rozklada nacisk) i kolek w otwor piłeczki
  await sketchW('Jarzmo: siodlo szkic', qFace('Jarzmo: pl. pierscienia'), (W) => {
    const P = [], f0 = -17.2, f1 = 17.2;
    for (let i = 0; i <= 8; i++) { const f = (f0 + (f1 - f0) * i / 8) * d2r; P.push([21.3 * Math.cos(f) * u[0], 21.3 * Math.sin(f), zc + 21.3 * Math.cos(f) * u[1]]); }
    for (let i = 8; i >= 0; i--) { const f = (f0 + (f1 - f0) * i / 8) * d2r; P.push([20.3 * Math.cos(f) * u[0], 20.3 * Math.sin(f), zc + 20.3 * Math.cos(f) * u[1]]); }
    W.poly(P);
  });
  await ext('Jarzmo: siodlo', 'Jarzmo: siodlo szkic', null, { op: 'ADD', depth: '#jarzmoW', sym: true, scope: J });
  await planeAngle('Jarzmo: pl. osi kolca', 'Wspolne: os oka', qStd('Right'), '30 deg');
  await planeOff('Jarzmo: pl. konca kolca', 'Jarzmo: pl. osi kolca', '#kulaDmin / 2 - #kolecGleb', true);
  const pt = add2(A, u, 17.5);
  const m = await sketchW('Jarzmo: kolec szkic', qFace('Jarzmo: pl. konca kolca'), (W) => W.circle(W3(pt, 0), 4, '#kolecD'));
  OS.log.push('kolec: plaszczyzna w odl. ' + (dot(OS.sub(m.O, [0, 0, zc]), [u[0], 0, u[1]])).toFixed(2) + ' od osi (ma byc 17.5)');
  await ext('Jarzmo: kolec', 'Jarzmo: kolec szkic', [u[0], 0, u[1]], { op: 'ADD', depth: '3.4 mm', scope: J });
};

OS.naped = async () => {
  // ciegno: jeden zamkniety kontur, oba otwory luzne, wkladki M3 od gory w podniesieniach
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
  // ramie orczyka: kieszen w ksztalcie orczyka od spodu, otwor srodkowy, otwor M2 (13 mm), otwor luzny na tulejke w H
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
  // tulejki przegubow (2 szt.): kolnierz pod korba/ramieniem, tulejka o 0.2 mm dluzsza niz plyta
  const TU = 'Tulejki: kolnierze';
  await planeOff('Tulejki: pl. kolnierzy', 'Wspolne: pl. orczyka', '#kolnierzH', false);
  await sketchW('Tulejki: kolnierze szkic', qFace('Tulejki: pl. kolnierzy'), (W) => { W.circle(W3(C0, yr - 0.8), 8, '#kolnierzD'); W.circle(W3(H0, yr - 0.8), 8, '#kolnierzD'); });
  await ext(TU, 'Tulejki: kolnierze szkic', UP, { op: 'NEW', depth: '#kolnierzH', regions: allRegions('Tulejki: kolnierze szkic') });
  await sketchW('Tulejki: tulejki szkic', qFace('Wspolne: pl. orczyka'), (W) => { W.circle(W3(C0, yr), 5.6, '#tulejkaD'); W.circle(W3(H0, yr), 5.6, '#tulejkaD'); });
  await ext('Tulejki: tulejki', 'Tulejki: tulejki szkic', UP, { op: 'ADD', depth: '#plytaT + 0.2 mm', scope: TU, regions: allRegions('Tulejki: tulejki szkic') });
  await sketchW('Tulejki: otwory szkic', qStd('Front'), (W) => { W.circle(W3(C0, 0), 3.3, '#m3Luzny'); W.circle(W3(H0, 0), 3.3, '#m3Luzny'); });
  await ext('Tulejki: otwory', 'Tulejki: otwory szkic', null, { op: 'REMOVE', depth: '30 mm', sym: true, scope: TU, regions: allRegions('Tulejki: otwory szkic') });
};

OS.pokrywa = async () => {
  const PK = 'Pokrywa tylna', z = D.zEnd;
  await sketchW('Pokrywa: szkic', qFace('Modul: pl. konca'), (W) => {
    W.circle([0, 0, z], 53.3); for (const a of [60, 120]) W.poly(radialW(24, 31.15, 8, a, z));
    W.poly([[-9, -38, z], [9, -38, z], [9, -20, z], [-9, -20, z]]);
  });
  await ext(PK, 'Pokrywa: szkic', BACK, { op: 'NEW', depth: '3 mm', regions: allRegions('Pokrywa: szkic') });
  await sketchW('Pokrywa: otwory szkic', qFace('Modul: pl. konca'), (W) => { for (const a of [60, 120]) W.circle(pXY(28.9, a, z), 3.3, '#m3Luzny'); W.poly([[-2.2, -38.5, z], [2.2, -38.5, z], [2.2, -34.5, z], [-2.2, -34.5, z]]); });
  await ext('Pokrywa: otwory', 'Pokrywa: otwory szkic', BACK, { op: 'REMOVE', depth: '3 mm', scope: PK, regions: allRegions('Pokrywa: otwory szkic') });
  await sketchW('Pokrywa: slupek szkic', qFace('Modul: pl. uszu serwa'), (W) => W.poly([[-4, D.sUcho, D.sTyl - 0.3], [4, D.sUcho, D.sTyl - 0.3], [4, D.sUcho, z], [-4, D.sUcho, z]]));
  await ext('Pokrywa: slupek', 'Pokrywa: slupek szkic', DOWN, { op: 'ADD', depth: '6.4 mm', scope: PK });
  await sketchW('Pokrywa: otwor ucha szkic', qFace('Modul: pl. uszu serwa'), (W) => W.circle([0, D.sUcho, D.uchoT], 1.8, '#serwoWkret'));
  await ext('Pokrywa: otwor ucha', 'Pokrywa: otwor ucha szkic', DOWN, { op: 'REMOVE', depth: '6.4 mm', scope: PK });
  // odciazenie kabla: kabel przeplatany miedzy trzema kolkami, wyjscie wycieciem na dole
  await sketchW('Pokrywa: kolki kabla szkic', qFace('Modul: pl. konca'), (W) => { W.circle([-3.5, -27.5, z], 3); W.circle([3.5, -27.5, z], 3); W.circle([0, -31.5, z], 3); });
  await ext('Pokrywa: kolki kabla', 'Pokrywa: kolki kabla szkic', FWD, { op: 'ADD', depth: '4 mm', scope: PK, regions: allRegions('Pokrywa: kolki kabla szkic') });
};

OS.podglad = async () => {
  await sketchW('Podglad: pileczka szkic', qStd('Right'), (W) => { W.circle([0, 0, zc], 40.5, '#kulaDmax'); W.line([0, -25, zc], [0, 25, zc]); });
  await revolve('PODGLAD pileczka', 'Podglad: pileczka szkic', 'Wspolne: os oka', { op: 'NEW', full: true, regions: regionAt('Podglad: pileczka szkic', [0, 0, zc + 10]) });
  const SG = 'PODGLAD SG90';
  await planeY('Podglad: pl. spodu serwa', '-#servoSpodY', -1);
  await sketchW('Podglad: SG90 szkic', qFace('Podglad: pl. spodu serwa'), (W) => W.poly([[-5.9, D.sSpod, D.sTyl], [5.9, D.sSpod, D.sTyl], [5.9, D.sSpod, D.sPrzod], [-5.9, D.sSpod, D.sPrzod]]));
  await ext(SG, 'Podglad: SG90 szkic', UP, { op: 'NEW', depth: '22.7 mm' });
  await sketchW('Podglad: SG90 uszy szkic', qFace('Modul: pl. uszu serwa'), (W) => W.poly([[-5.9, D.sUcho, D.uszyT], [5.9, D.sUcho, D.uszyT], [5.9, D.sUcho, D.uszyP], [-5.9, D.sUcho, D.uszyP]]));
  await ext('Podglad: SG90 uszy', 'Podglad: SG90 uszy szkic', UP, { op: 'ADD', depth: '2.5 mm', scope: SG });
  await planeOff('Podglad: pl. wierzchu serwa', 'Podglad: pl. spodu serwa', '22.7 mm', true);
  await sketchW('Podglad: SG90 garb szkic', qFace('Podglad: pl. wierzchu serwa'), (W) => W.circle(W3(S, D.sSpod + 22.7), 11.8));
  await ext('Podglad: SG90 garb', 'Podglad: SG90 garb szkic', UP, { op: 'ADD', depth: '4 mm', scope: SG });
  await planeOff('Podglad: pl. walka', 'Podglad: pl. wierzchu serwa', '4 mm', true);
  await sketchW('Podglad: SG90 walek szkic', qFace('Podglad: pl. walka'), (W) => W.circle(W3(S, D.sSpod + 26.7), 4.8));
  await ext('Podglad: SG90 walek', 'Podglad: SG90 walek szkic', UP, { op: 'ADD', depth: '2.3 mm', scope: SG });
  await planeOff('Podglad: pl. kabla', 'Podglad: pl. spodu serwa', '4 mm', true);
  await sketchW('Podglad: SG90 kabel szkic', qFace('Podglad: pl. kabla'), (W) => W.poly([[-1.6, D.sSpod + 4, D.sTyl + 0.5], [1.6, D.sSpod + 4, D.sTyl + 0.5], [1.6, D.sSpod + 4, D.sTyl - 1.2], [-1.6, D.sSpod + 4, D.sTyl - 1.2]]));
  await ext('Podglad: SG90 kabel', 'Podglad: SG90 kabel szkic', UP, { op: 'ADD', depth: '1.2 mm', scope: SG });
  const tip = add2(S, D.dirR, 17.5), yo = D.hTop - 1.5;
  await sketchW('Podglad: orczyk szkic', qFace('Ramie: pl. dolu'), (W) => { W.circle(W3(S, yo), 7); W.pas(W3(S, yo), W3(tip, yo), 4.8); W.circle(W3(tip, yo), 4); });
  await ext('PODGLAD orczyk', 'Podglad: orczyk szkic', UP, { op: 'NEW', depth: '1.5 mm', regions: allRegions('Podglad: orczyk szkic') });
};

OS.przyrzady = async () => {
  // przyrzad do wiercenia pileczki: dwie polowki skrecane 2 x M3, podzial w plaszczyznie pierscienia jarzma
  const J = D.J, u = D.u, n = D.n, PB = 'Przyrzad wiercenia: blok';
  const mR = OS.M['Jarzmo: pierscien szkic'];
  const dn = 130 * n[0];
  await planeOff('Przyrzad wiercenia: pl. podzialu', 'Jarzmo: pl. pierscienia', mm(dn), dot(mR.N, [n[0], 0, n[1]]) < 0);
  const c = (s, t, y) => [J[0] + s * u[0], y + t, J[2] + s * u[1]];
  await sketchW('Przyrzad wiercenia: blok szkic', qFace('Przyrzad wiercenia: pl. podzialu'), (W) => W.poly([c(-26, 0, -26), c(26, 0, -26), c(26, 0, 26), c(-26, 0, 26)]));
  await ext(PB, 'Przyrzad wiercenia: blok szkic', null, { op: 'NEW', depth: '52 mm', sym: true });
  await planeX('Przyrzad wiercenia: pl. osi', '130 mm', 1);
  await sketchW('Przyrzad wiercenia: os', qFace('Przyrzad wiercenia: pl. osi'), (W) => W.line([130, -30, J[2]], [130, 30, J[2]], true));
  await sketchW('Przyrzad wiercenia: gniazdo kuli szkic', qFace('Przyrzad wiercenia: pl. osi'), (W) => { W.circle(J, 40.9, '#kulaDmax + 0.4 mm'); W.line([130, -25, J[2]], [130, 25, J[2]]); });
  await revolve('Przyrzad wiercenia: gniazdo kuli', 'Przyrzad wiercenia: gniazdo kuli szkic', 'Przyrzad wiercenia: os', { op: 'REMOVE', full: true, scope: PB, regions: regionAt('Przyrzad wiercenia: gniazdo kuli szkic', [130, 0, J[2] + 10]) });
  await sketchW('Przyrzad wiercenia: prowadnica osi szkic', qStd('Front'), (W) => W.circle(J, 3.3, '#m3Luzny'));
  await ext('Przyrzad wiercenia: prowadnica osi', 'Przyrzad wiercenia: prowadnica osi szkic', null, { op: 'REMOVE', depth: '70 mm', sym: true, scope: PB });
  await planeOff('Przyrzad wiercenia: pl. kolca', 'Jarzmo: pl. osi kolca', mm(130 * u[0]), true);
  await sketchW('Przyrzad wiercenia: prowadnica kolca szkic', qFace('Przyrzad wiercenia: pl. kolca'), (W) => W.circle(J, 4.2, '#kolecD + 0.2 mm'));
  await ext('Przyrzad wiercenia: prowadnica kolca', 'Przyrzad wiercenia: prowadnica kolca szkic', [u[0], 0, u[1]], { op: 'REMOVE', depth: '35 mm', scope: PB });
  await planeZ('Przyrzad wiercenia: pl. zrenicy', mm(-J[2]), -1);
  await sketchW('Przyrzad wiercenia: znacznik zrenicy szkic', qFace('Przyrzad wiercenia: pl. zrenicy'), (W) => W.circle(J, 3));
  await ext('Przyrzad wiercenia: znacznik zrenicy', 'Przyrzad wiercenia: znacznik zrenicy szkic', FWD, { op: 'REMOVE', depth: '35 mm', scope: PB });
  await sketchW('Przyrzad wiercenia: sruby szkic', qFace('Przyrzad wiercenia: pl. podzialu'), (W) => { W.circle(c(19, 0, 19), 2.6, '#m3Ciasny'); W.circle(c(-19, 0, -19), 2.6, '#m3Ciasny'); });
  await ext('Przyrzad wiercenia: otwory ciasne', 'Przyrzad wiercenia: sruby szkic', null, { op: 'REMOVE', depth: '52 mm', sym: true, scope: PB, regions: allRegions('Przyrzad wiercenia: sruby szkic') });
  await sketchW('Przyrzad wiercenia: sruby luzne szkic', qFace('Przyrzad wiercenia: pl. podzialu'), (W) => { W.circle(c(19, 0, 19), 3.3, '#m3Luzny'); W.circle(c(-19, 0, -19), 3.3, '#m3Luzny'); });
  await ext('Przyrzad wiercenia: otwory luzne', 'Przyrzad wiercenia: sruby luzne szkic', [n[0], 0, n[1]], { op: 'REMOVE', depth: '27 mm', scope: PB, regions: allRegions('Przyrzad wiercenia: sruby luzne szkic') });
  const ft = 'splitPart';
  await post({ btType: 'BTMFeature-134', featureType: ft, name: 'Przyrzad wiercenia: podzial na polowki', parameters: [
    await pe(ft, 'splitType', 'PART'), pq('targets', qBody(PB)), pq('tool', qFace('Przyrzad wiercenia: pl. podzialu')), pb('keepTools', false), pb('keepBothSides', true)] }, 'Przyrzad wiercenia: podzial na polowki');
  // przyrzad do centrowania orczyka: plytka pod tuleja z dwoma trzpieniami przez otwory dolne do korby (C) i ramienia (H)
  const PO = 'Przyrzad orczyka';
  await planeY('Przyrzad orczyka: pl. podstawy', '27 mm', -1);
  await sketchW('Przyrzad orczyka: podstawa szkic', qFace('Przyrzad orczyka: pl. podstawy'), (W) => W.poly([[-13, -27, -32], [13, -27, -32], [13, -27, -44], [-13, -27, -44]]));
  await ext(PO, 'Przyrzad orczyka: podstawa szkic', DOWN, { op: 'NEW', depth: '2.5 mm' });
  await sketchW('Przyrzad orczyka: trzpienie szkic', qFace('Przyrzad orczyka: pl. podstawy'), (W) => { W.circle(W3(C0, -27), 5.8); W.circle(W3(H0, -27), 5.8); });
  await ext('Przyrzad orczyka: trzpienie', 'Przyrzad orczyka: trzpienie szkic', UP, { op: 'ADD', depth: '25.5 mm', scope: PO, regions: allRegions('Przyrzad orczyka: trzpienie szkic') });
};
return 'v2b ok';
})();

// ===================== v2c.js =====================
(() => {
const OS = window.OS, D = OS.D;
const { req, base, F } = OS;

// ---------- nazwy czesci (dopasowanie po srodku prostopadloscianu otaczajacego) ----------
OS.NAZWY = [
  ['Gniazdo', [0, 0, -21]], ['Nakretka', [0, 0, -28.6]], ['Tuleja modulu', [0, 0.3, -38]], ['Jarzmo', [8, 0, -24]],
  ['Ciegno', [-0.4, 2, -37.9]], ['Ramie orczyka', [-3.4, -2.5, -51]], ['Tulejka przegubu korby', [7.2, -2, -37]], ['Tulejka przegubu ramienia', [-7.9, -2, -38.8]],
  ['Pokrywa tylna', [0, -4.5, -73.4]], ['PODGLAD pileczka 40.5', [0, 0, -12]], ['PODGLAD SG90', [0, -19, -57.6]], ['PODGLAD orczyk SG90', [-2, -3.8, -55]],
  ['Przyrzad wiercenia A', [136, 0, -1]], ['Przyrzad wiercenia B', [123, 0, -23]], ['Przyrzad centrowania orczyka', [0, -15.5, -38]],
];
OS.nazwy = async () => {
  const parts = await (await req(`/api/v10/parts/d/${OS.did}/w/${OS.wid}/e/${OS.eid}`)).json();
  const C = [];
  for (const p of parts) {
    const b = await (await req(`/api/v10/parts/d/${OS.did}/w/${OS.wid}/e/${OS.eid}/partid/${encodeURIComponent(p.partId)}/boundingboxes`)).json();
    C.push([p.partId, [(b.lowX + b.highX) * 500, (b.lowY + b.highY) * 500, (b.lowZ + b.highZ) * 500]]);
  }
  OS.PID = {};
  for (const [name, c] of OS.NAZWY) {
    let best = null, bd = 1e9; for (const [pid, m] of C) { const d = Math.hypot(m[0] - c[0], m[1] - c[1], m[2] - c[2]); if (d < bd) { bd = d; best = pid; } }
    OS.PID[name] = best;
    await req(`/api/v10/metadata/d/${OS.did}/w/${OS.wid}/e/${OS.eid}/p/${encodeURIComponent(best)}`, { method: 'POST',
      body: JSON.stringify({ jsonType: 'metadata-part', partId: best, properties: [{ propertyId: '57f3fb8efa3416c06701d60d', value: name }] }) });
    OS.log.push(`nazwa ${name} -> ${best} (odl. ${bd.toFixed(1)})`);
  }
};

// ---------- zlozenie (Assembly): grupy + lacznik na krawedziach otworow osi + mate'y ----------
// Tuleje trzeba potem unieruchomic recznie (PPM na "Tuleja modulu" -> Fix) - REST API nie ma tej operacji.
OS.zlozenie = async (name = 'Oko F v2 - zlozenie') => {
  const P = OS.PID;
  const r0 = await req(`/api/v10/assemblies/d/${OS.did}/w/${OS.wid}`, { method: 'POST', body: JSON.stringify({ name }) });
  OS.AID = (await r0.json()).id;
  const A = `/api/v10/assemblies/d/${OS.did}/w/${OS.wid}/e/${OS.AID}`;
  const lista = ['Tuleja modulu', 'Gniazdo', 'Nakretka', 'Jarzmo', 'PODGLAD pileczka 40.5', 'Ciegno', 'Ramie orczyka', 'Tulejka przegubu korby',
    'Tulejka przegubu ramienia', 'Pokrywa tylna', 'PODGLAD SG90', 'PODGLAD orczyk SG90'];
  for (const n of lista) await req(A + '/instances', { method: 'POST', body: JSON.stringify({ documentId: OS.did, elementId: OS.eid, partId: P[n], isAssembly: false, isWholePartStudio: false }) });
  const g = await (await req(A)).json();
  const I = {}; for (const inst of g.rootAssembly.instances) { const n = lista.find((k) => P[k] === inst.partId); if (n) I[n] = inst.id; }
  const postF = async (feature) => { const r = await req(A + '/features', { method: 'POST', body: JSON.stringify({ feature }) }); const j = await r.json();
    OS.log.push(feature.name + ': ' + (j.featureState ? j.featureState.featureStatus : r.status)); return j.feature && j.feature.featureId; };
  const occ = (n) => ({ btType: 'BTMIndividualOccurrenceQuery-626', path: [I[n]] });
  const group = (nm, ns) => postF({ btType: 'BTMMateGroup-65', featureType: 'mateGroup', name: nm, parameters: [{ btType: 'BTMParameterQueryWithOccurrenceList-67', parameterId: 'occurrencesQuery', queries: ns.map(occ) }] });
  await group('Grupa: modul nieruchomy', ['Tuleja modulu', 'Gniazdo', 'Nakretka', 'PODGLAD SG90', 'Pokrywa tylna']);
  await group('Grupa: jarzmo z pileczka', ['Jarzmo', 'PODGLAD pileczka 40.5']);
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
    tA: ['Tuleja modulu', await circ('Tuleja modulu', 1.3, [0, 22.95, D.zc])], jA: ['Jarzmo', await circ('Jarzmo', 1.65, [0, 22.65, D.zc])],
    jC: ['Jarzmo', await circ('Jarzmo', 3.0, [D.C0[0], -0.5, D.C0[1]])], cC: ['Ciegno', await circ('Ciegno', 1.65, [D.C0[0], -0.3, D.C0[1]])],
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
  const lim = [{ btType: 'BTMParameterBoolean-144', parameterId: 'limitsEnabled', value: true },
    { btType: 'BTMParameterNullableQuantity-807', parameterId: 'limitAxialZMin', expression: '-33 deg', isNull: false },
    { btType: 'BTMParameterNullableQuantity-807', parameterId: 'limitAxialZMax', expression: '33 deg', isNull: false }];
  const pary = [['Os oka 2 x M3 (ogranicznik +-33)', 'REVOLUTE', 'tA', 'jA', lim], ['Wal serwa - ramie orczyka', 'REVOLUTE', 'sS', 'rS'],
    ['Przegub C: korba - ciegno', 'CYLINDRICAL', 'jC', 'cC'], ['Przegub H: ciegno - ramie', 'BALL', 'cH', 'rH']];
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
window.OS.all = async () => {
  const OS = window.OS;
  for (const s of ['zmienne', 'wspolne', 'gniazdo', 'nakretka', 'tuleja', 'jarzmo', 'naped', 'pokrywa', 'podglad', 'przyrzady', 'nazwy']) { OS.status = s; await OS[s](); }
  OS.status = 'gotowe';
};
