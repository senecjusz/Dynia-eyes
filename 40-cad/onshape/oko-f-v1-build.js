// Budowa modelu "Oko F v1" w Onshape ze zwyklych operacji (Variable, Plane, Sketch,
// Extrude, Revolve, Helix, Sweep, Circular pattern) przez REST API.
// Uruchamiane w konsoli przegladarki na zalogowanej stronie cad.onshape.com
// (Part Studio docelowego dokumentu). Wynik to normalne drzewo operacji do edycji w Onshape.
//
// Uklad: os oka = Z (Top plane = powierzchnia dyni), +Z na zewnatrz, +Y = GORA.
// Front: szkic (x,y) -> swiat (X,Z), normalna -Y.  Right: (x,y) -> (Y,Z), normalna +X.
// Wymiary kluczowe (srednice, glebokosci) sa wyrazeniami ze zmiennych #...;
// drobne szkice (zaczepy, rowki, profil gwintu) maja wymiary liczbowe z wartosci domyslnych.

(() => {
const OS = {};
const xsrf = decodeURIComponent((document.cookie.match(/XSRF-TOKEN=([^;]+)/) || [])[1] || '');
const H = { Accept: 'application/json', 'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrf };
const [, did, wid, eid] = location.pathname.match(/documents\/(\w+)\/w\/(\w+)\/e\/(\w+)/);
const base = `/api/v10/partstudios/d/${did}/w/${wid}/e/${eid}`;
const F = (window.__F = window.__F || {}); // nazwa -> featureId
let specs = null;

const mm = (v) => `${+v.toFixed(4)} mm`;
const Q = (s) => ({ btType: 'BTMIndividualQuery-138', queryString: s });
const qBody = (n) => `query=qCreatedBy(makeId("${F[n]}"), EntityType.BODY);`;
const qEdge = (n) => `query=qCreatedBy(makeId("${F[n]}"), EntityType.EDGE);`;
const qFace = (n) => `query=qCreatedBy(makeId("${F[n]}"), EntityType.FACE);`;
const qReg = (n) => `query=qSketchRegion(makeId("${F[n]}"), true);`;
const qStd = (p) => `query=qCreatedBy(makeId("${p}"), EntityType.FACE);`;

async function enumName(ft, pid) {
  if (!specs) specs = (await (await fetch(base + '/featurespecs', { headers: H })).json()).featureSpecs;
  return specs.find((s) => s.featureType === ft).parameters.find((p) => p.parameterId === pid).enumName;
}
const pq = (id, ...qs) => ({ btType: 'BTMParameterQueryList-148', parameterId: id, queries: qs.map(Q) });
const pn = (id, e) => ({ btType: 'BTMParameterQuantity-147', parameterId: id, expression: String(e), isInteger: false });
const pb = (id, v) => ({ btType: 'BTMParameterBoolean-144', parameterId: id, value: v });
const ps = (id, v) => ({ btType: 'BTMParameterString-149', parameterId: id, value: v });
const pe = async (ft, id, v) => ({ btType: 'BTMParameterEnum-145', parameterId: id, enumName: await enumName(ft, id), value: v });

async function post(feature, key) {
  const r = await fetch(base + '/features', { method: 'POST', headers: H, body: JSON.stringify({ feature }) });
  const j = await r.json();
  const st = j.featureState ? j.featureState.featureStatus : 'HTTP' + r.status;
  if (key) F[key] = j.feature && j.feature.featureId;
  const line = `${feature.name || key}: ${st}`;
  OS.log.push(line);
  if (st !== 'OK') throw new Error(line + ' ' + JSON.stringify(j).slice(0, 300));
  return j.feature.featureId;
}

// ---------- szkic ----------
class Sk {
  constructor() { this.e = []; this.c = []; this.k = 0; }
  id(p) { return p + ++this.k; }
  circle(x, y, d, expr, constr = false) {
    const id = this.id('c');
    this.e.push({ btType: 'BTMSketchCurve-4', entityId: id, centerId: id + '.center', isConstruction: constr,
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
    const ids = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      ids.push(this.line(a[0], a[1], b[0], b[1]));
    }
    for (let i = 0; i < ids.length; i++)
      this.c.push({ btType: 'BTMSketchConstraint-2', constraintType: 'COINCIDENT', entityId: this.id('k'),
        parameters: [ps('localFirst', ids[i] + '.end'), ps('localSecond', ids[(i + 1) % ids.length] + '.start')] });
  }
  rect(x0, y0, x1, y1) { this.poly([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]); }
  // prostokat promieniowy (r0..r1, szerokosc w) obrocony o kat a (stopnie) wokol srodka szkicu
  radial(r0, r1, w, a) {
    const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180);
    const R = (x, y) => [x * c - y * s, x * s + y * c];
    this.poly([R(r0, -w / 2), R(r1, -w / 2), R(r1, w / 2), R(r0, w / 2)]);
  }
}
async function sketch(key, planeQ, sk) {
  return post({ btType: 'BTMSketch-151', featureType: 'newSketch', name: key,
    parameters: [pq('sketchPlane', planeQ)], entities: sk.e, constraints: sk.c }, key);
}
async function plane(key, baseQ, offset, opposite) {
  const ft = 'cPlane';
  return post({ btType: 'BTMFeature-134', featureType: ft, name: key, parameters: [
    pq('entities', baseQ), await pe(ft, 'cplaneType', 'OFFSET'), pn('offset', offset), pb('oppositeDirection', !!opposite)] }, key);
}
// o: {op, depth, opp, scope, sym, through}
async function extrude(key, skKey, o) {
  const ft = 'extrude';
  const p = [await pe(ft, 'bodyType', 'SOLID'), await pe(ft, 'operationType', o.op || 'NEW'), pq('entities', qReg(skKey)),
    await pe(ft, 'endBound', o.through ? 'THROUGH_ALL' : 'BLIND'), pn('depth', o.depth || '1 mm'),
    pb('oppositeDirection', !!o.opp), pb('symmetric', !!o.sym)];
  if (o.scope) p.push(pb('defaultScope', false), pq('booleanScope', qBody(o.scope)));
  return post({ btType: 'BTMFeature-134', featureType: ft, name: key, parameters: p }, key);
}
async function revolve(key, skKey, axisKey, o) {
  const ft = 'revolve';
  // uwaga: fullRevolve domyslnie = true, trzeba go jawnie wylaczyc; obrot "do przodu" = CCW wokol +Z
  const p = [await pe(ft, 'bodyType', 'SOLID'), await pe(ft, 'operationType', o.op || 'NEW'), pq('entities', o.regions || qReg(skKey)),
    pq('axis', qEdge(axisKey)), pb('fullRevolve', !!o.full), await pe(ft, 'endBound', 'BLIND'), pn('angle', o.angle || '360 deg'),
    pb('oppositeDirection', !!o.opp)];
  if (o.scope) p.push(pb('defaultScope', false), pq('booleanScope', qBody(o.scope)));
  return post({ btType: 'BTMFeature-134', featureType: ft, name: key, parameters: p }, key);
}
async function helix(key, circleSkKey, pitch, height) {
  const ft = 'helix';
  return post({ btType: 'BTMFeature-134', featureType: ft, name: key, parameters: [
    await pe(ft, 'axisType', 'CIRCLE'), pq('edge', qEdge(circleSkKey)), pq('entities', qEdge(circleSkKey)),
    await pe(ft, 'pathType', 'PITCH'), await pe(ft, 'endType', 'HEIGHT'), pn('height', height), pn('helicalPitch', pitch),
    await pe(ft, 'startType', 'START_ANGLE'), pn('startAngle', '0 deg'), await pe(ft, 'handedness', 'CW')] }, key); // CW = gwint prawy przy tej osi
}
async function sweep(key, profKey, pathKey, op, scope) {
  const ft = 'sweep';
  const p = [await pe(ft, 'bodyType', 'SOLID'), await pe(ft, 'operationType', op), pq('profiles', qReg(profKey)),
    pq('path', qEdge(pathKey)), await pe(ft, 'profileControl', 'NONE')];
  if (scope) p.push(pb('defaultScope', false), pq('booleanScope', qBody(scope)));
  return post({ btType: 'BTMFeature-134', featureType: ft, name: key, parameters: p }, key);
}
// plaszczyzna przez os Z obrocona od Front o kat; jej os x wskazuje kierunek 180 st. + kat,
// a wspolrzedne szkicu licza sie od poczatku ukladu (y szkicu = Z swiata)
async function planeAngle(key, axisKey, angle) {
  const ft = 'cPlane';
  return post({ btType: 'BTMFeature-134', featureType: ft, name: key, parameters: [
    pq('entities', qEdge(axisKey), qStd('Front')), await pe(ft, 'cplaneType', 'LINE_ANGLE'), pn('angle', angle)] }, key);
}
// Szyk kolowy dziala dla operacji ADD (np. zaczepy); dla wyciec REMOVE Onshape zglasza PATTERN_FACE_FAILED.
async function cpattern(key, featKeys, axisKey, angle, count, scope) {
  const ft = 'circularPattern';
  const p = [await pe(ft, 'patternType', 'FEATURE'),
    { btType: 'BTMParameterFeatureList-1749', parameterId: 'instanceFunction', featureIds: featKeys.map((k) => F[k]) },
    pq('axis', qEdge(axisKey)), pn('angle', angle), pn('instanceCount', count), pb('equalSpace', false)];
  if (scope) p.push(pb('defaultScope', false), pq('booleanScope', qBody(scope)));
  return post({ btType: 'BTMFeature-134', featureType: ft, name: key, parameters: p }, key);
}
async function variable(name, expr, desc) {
  const ft = 'assignVariable';
  return post({ btType: 'BTMFeature-134', featureType: ft, parameters: [
    await pe(ft, 'variableType', 'LENGTH'), ps('name', name), pn('lengthValue', expr), ps('description', desc || '')] }, '#' + name);
}

// ---------- wartosci liczbowe (domyslne) do drobnych szkicow ----------
const D = {};
D.kulaR = 20; D.kulaZ = -5;
D.jRin = 20.75; D.jRout = 23.25;
D.mIR = 24.25; D.mOR = 26.65; D.gIR = 27.25; D.gOR = 29.65; D.gTop = 31.15;
D.gL = 45; D.skok = 3; D.thrZ0 = -48;
D.zaczepH = 1.2; D.zaczepW = 6; D.zaczepZ = -6; D.zaczepL = 3; D.luzZ = 0.3;
D.dno = D.mOR - (D.zaczepH - 0.6) - 0.4; // 25.65
// korba 20 mm i warstwa ciegna Y 16..18.5: przy korbie 17 / Y 17.5 ciegno nachodzilo na luk jarzma
D.servoZ = -40.5; D.linkY0 = 16; D.servoSpod = D.linkY0 - 30.5; D.uchoY = D.servoSpod + 15.9;
D.servoPrzod = D.servoZ + 5.9; D.servoSrodek = D.servoPrzod - 11.25;
D.korba = 20; D.orczyk = 14;

OS.vars = async () => {
  const V = [
    ['kulaD', '40 mm', 'srednica pileczki'],
    ['luzKula', '0.75 mm', 'luz pileczka-jarzmo'],
    ['jarzmoT', '2.5 mm', 'grubosc jarzma'],
    ['luzJarzmo', '1 mm', 'luz jarzmo-tuleja'],
    ['sciankaM', '2.4 mm', 'scianka tulei modulu'],
    ['luzBagnet', '0.6 mm', 'luz promieniowy modul-gniazdo'],
    ['sciankaG', '2.4 mm', 'scianka gniazda pod gwintem'],
    ['gwintSkok', '3 mm', 'skok gwintu'],
    ['gwintH', '1.5 mm', 'wysokosc zarysu gwintu'],
    ['luzGwint', '0.3 mm', 'luz gwintu nakretki'],
    ['luzCzop', '0.2 mm', 'luz czopu w jarzmie i ciegnie'],
    ['czopD', '3 mm', 'srednica czopu'],
    ['rantD', '72 mm', 'srednica rantu'],
    ['rantT', '2 mm', 'grubosc rantu'],
    ['kolnierzykD', '43 mm', 'otwor w rancie (oczodol)'],
    ['przodD', '62 mm', 'srednica przedniej czesci gniazda (w otworze 64)'],
    ['przodL', '12 mm', 'dlugosc przedniej czesci gniazda'],
    ['dociskMin', '15 mm', 'najciensza scianka dyni'],
    ['dociskMax', '35 mm', 'najgrubsza scianka dyni'],
    ['nakretkaH', '8 mm', 'wysokosc nakretki'],
    ['nakretkaD', '76 mm', 'srednica nakretki'],
    ['nakretkaZ', '25 mm', 'pozycja nakretki pod powierzchnia (podglad)'],
    ['kulaZ', '5 mm', 'srodek pileczki pod powierzchnia dyni'],
    ['modulL', '65 mm', 'dlugosc tulei modulu'],
    ['modulID', '#kulaD + 2 * (#luzKula + #jarzmoT + #luzJarzmo)', 'wyliczane'],
    ['modulOD', '#modulID + 2 * #sciankaM', 'wyliczane'],
    ['gniazdoID', '#modulOD + 2 * #luzBagnet', 'wyliczane'],
    ['gniazdoOD', '#gniazdoID + 2 * #sciankaG', 'wyliczane = dno gwintu'],
    ['gwintD', '#gniazdoOD + 2 * #gwintH', 'wyliczane = srednica gwintu'],
    ['gniazdoL', '#dociskMax + #nakretkaH + 2 mm', 'wyliczane'],
    ['nakretkaOtwor', '#gniazdoOD + 2 * #luzGwint', 'wyliczane'],
  ];
  for (const [n, e, d] of V) await variable(n, e, d);
};

OS.gniazdo = async () => {
  let s;
  s = new Sk(); s.circle(0, 0, 72, '#rantD'); s.circle(0, 0, 43, '#kolnierzykD'); await sketch('Gniazdo rant szkic', qStd('Top'), s);
  await extrude('Gniazdo rant', 'Gniazdo rant szkic', { op: 'NEW', depth: '#rantT' });
  s = new Sk(); s.circle(0, 0, 62, '#przodD'); s.circle(0, 0, 54.5, '#gniazdoID'); await sketch('Gniazdo przod szkic', qStd('Top'), s);
  await extrude('Gniazdo przod', 'Gniazdo przod szkic', { op: 'ADD', depth: '#przodL', opp: true, scope: 'Gniazdo rant' });
  s = new Sk(); s.circle(0, 0, 59.3, '#gniazdoOD'); s.circle(0, 0, 54.5, '#gniazdoID'); await sketch('Gniazdo tuleja szkic', qStd('Top'), s);
  await extrude('Gniazdo tuleja', 'Gniazdo tuleja szkic', { op: 'ADD', depth: '#gniazdoL', opp: true, scope: 'Gniazdo rant' });
  // os Z (do szyku i obrotu)
  s = new Sk(); s.line(0, -80, 0, 30, true); await sketch('Os Z', qStd('Front'), s);
  // gwint: helisa + profil trapezowy
  await plane('Plaszczyzna gwintu', qStd('Top'), '#gniazdoL + #gwintSkok', true);
  s = new Sk(); s.circle(0, 0, 59.3, '#gniazdoOD'); await sketch('Helisa okrag', qFace('Plaszczyzna gwintu'), s);
  await helix('Helisa gwintu', 'Helisa okrag', '#gwintSkok', '#gniazdoL + #gwintSkok - #dociskMin + 1 mm');
  const z0 = D.thrZ0;
  s = new Sk(); s.poly([[D.gOR - 0.4, z0 - 1.1], [D.gOR, z0 - 1.1], [D.gTop, z0 - 0.3], [D.gTop, z0 + 0.3], [D.gOR, z0 + 1.1], [D.gOR - 0.4, z0 + 1.1]]);
  await sketch('Gwint profil', qStd('Front'), s);
  await sweep('Gwint', 'Gwint profil', 'Helisa gwintu', 'ADD', 'Gniazdo rant');
  await plane('Plaszczyzna konca gniazda', qStd('Top'), '#gniazdoL', true);
  s = new Sk(); s.circle(0, 0, 90); await sketch('Przyciecie gwintu szkic', qFace('Plaszczyzna konca gniazda'), s);
  await extrude('Przyciecie gwintu', 'Przyciecie gwintu szkic', { op: 'REMOVE', depth: '10 mm', opp: true, scope: 'Gniazdo rant' });
  // zaczep bagnetu (0 st.) + szyk 150 i 210 st.
  await plane('Plaszczyzna zaczepow', qStd('Top'), mm(-D.zaczepZ), true);
  s = new Sk(); s.rect(D.gIR - D.zaczepH, -D.zaczepW / 2, D.gIR + 0.5, D.zaczepW / 2); await sketch('Zaczep szkic', qFace('Plaszczyzna zaczepow'), s);
  await extrude('Zaczep', 'Zaczep szkic', { op: 'ADD', depth: mm(D.zaczepL), scope: 'Gniazdo rant' });
  await cpattern('Zaczep 150', ['Zaczep'], 'Os Z', '150 deg', 2, 'Gniazdo rant');
  await cpattern('Zaczep 210', ['Zaczep'], 'Os Z', '210 deg', 2, 'Gniazdo rant');
  // zabki pod rantem
  s = new Sk(); for (let k = 0; k < 8; k++) s.radial(32.3, 35.3, 1.2, 22.5 + 45 * k); await sketch('Zabki szkic', qStd('Top'), s);
  await extrude('Zabki', 'Zabki szkic', { op: 'ADD', depth: '1.5 mm', opp: true, scope: 'Gniazdo rant' });
  // strzalka GORA na rancie
  await plane('Plaszczyzna rantu', qStd('Top'), '#rantT', false);
  s = new Sk(); s.poly([[0, 34.5], [-3, 29.5], [3, 29.5]]); await sketch('Strzalka GORA szkic', qFace('Plaszczyzna rantu'), s);
  await extrude('Strzalka GORA', 'Strzalka GORA szkic', { op: 'REMOVE', depth: '0.6 mm', opp: true, scope: 'Gniazdo rant' });
};

OS.nakretka = async () => {
  let s;
  await plane('Plaszczyzna nakretki', qStd('Top'), '#nakretkaZ', true);
  s = new Sk(); s.circle(0, 0, 76, '#nakretkaD'); s.rect(-46, -5, 46, 5); await sketch('Nakretka szkic', qFace('Plaszczyzna nakretki'), s);
  await extrude('Nakretka', 'Nakretka szkic', { op: 'NEW', depth: '#nakretkaH', opp: true });
  s = new Sk(); s.circle(0, 0, 59.9, '#nakretkaOtwor'); await sketch('Nakretka otwor szkic', qFace('Plaszczyzna nakretki'), s);
  await extrude('Nakretka otwor', 'Nakretka otwor szkic', { op: 'REMOVE', through: true, opp: true, scope: 'Nakretka' });
  const z0 = D.thrZ0, l = 0.3;
  s = new Sk(); s.poly([[D.gOR - 0.5, z0 - 1.1 - l], [D.gOR, z0 - 1.1 - l], [D.gTop + l, z0 - 0.3 - l], [D.gTop + l, z0 + 0.3 + l], [D.gOR, z0 + 1.1 + l], [D.gOR - 0.5, z0 + 1.1 + l]]);
  await sketch('Gwint nakretki profil', qStd('Front'), s);
  await sweep('Gwint nakretki', 'Gwint nakretki profil', 'Helisa gwintu', 'REMOVE', 'Nakretka');
  await plane('Plaszczyzna tylu nakretki', qStd('Top'), '#nakretkaZ + #nakretkaH', true);
  s = new Sk(); for (let k = 0; k < 6; k++) s.radial(33, 39, 4, 30 + 60 * k); await sketch('Wyciecia na klucz szkic', qFace('Plaszczyzna tylu nakretki'), s);
  await extrude('Wyciecia na klucz', 'Wyciecia na klucz szkic', { op: 'REMOVE', depth: '2.5 mm', scope: 'Nakretka' });
};

OS.tuleja = async () => {
  let s;
  await plane('Plaszczyzna czola modulu', qStd('Top'), '0.3 mm', true);
  s = new Sk(); s.circle(0, 0, 53.3, '#modulOD'); s.circle(0, 0, 48.5, '#modulID'); await sketch('Tuleja szkic', qFace('Plaszczyzna czola modulu'), s);
  await extrude('Tuleja', 'Tuleja szkic', { op: 'NEW', depth: '#modulL', opp: true });
  await plane('Plaszczyzna chwytu', qStd('Top'), '#gniazdoL + 2 mm', true);
  s = new Sk(); s.circle(0, 0, 64.3, '#gwintD + 2 mm'); s.circle(0, 0, 48.5, '#modulID'); await sketch('Chwyt szkic', qFace('Plaszczyzna chwytu'), s);
  await extrude('Chwyt', 'Chwyt szkic', { op: 'ADD', depth: '5 mm', opp: true, scope: 'Tuleja' });
  // slupki pod uszy SG90 (otwory na wkrety z kompletu serwa)
  await plane('Plaszczyzna uszu serwa', qStd('Front'), mm(D.uchoY), true);
  const zs = [D.servoSrodek + 13.9, D.servoSrodek - 13.9];
  s = new Sk(); for (const z of zs) s.rect(-6, z - 2, 6, z + 2); await sketch('Slupki szkic', qFace('Plaszczyzna uszu serwa'), s);
  await extrude('Slupki', 'Slupki szkic', { op: 'ADD', depth: mm(D.uchoY + D.mIR + 1), scope: 'Tuleja' });
  s = new Sk(); for (const z of zs) s.circle(0, z, 1.8); await sketch('Otwory wkretow szkic', qFace('Plaszczyzna uszu serwa'), s);
  await extrude('Otwory wkretow', 'Otwory wkretow szkic', { op: 'REMOVE', depth: '8 mm', scope: 'Tuleja' });
  // okno od gory na serwo
  await plane('Plaszczyzna okna', qStd('Front'), '5 mm', true);
  s = new Sk(); s.rect(-6.8, D.servoPrzod - 28, 6.8, D.servoPrzod + 5.5); await sketch('Okno serwa szkic', qFace('Plaszczyzna okna'), s);
  await extrude('Okno serwa', 'Okno serwa szkic', { op: 'REMOVE', through: true, opp: true, scope: 'Tuleja' });
  // bagnet: zaczepy gniazda na 0/150/210 st. (pozycja koncowa). Modul wchodzi obrocony o -30 st.,
  // wiec wejscia osiowe sa na 30/180/240 st., a rowki obwodowe od a-polKat do a+30+polKat.
  const hw = D.zaczepW / 2 + D.luzZ, polKat = hw / D.mOR * 180 / Math.PI;
  const zA = D.zaczepZ - D.luzZ, zB = D.zaczepZ + D.zaczepL + D.luzZ;
  s = new Sk(); s.radial(D.dno, D.mOR + 1, 2 * hw, 30); await sketch('Bagnet wejscie szkic', qStd('Top'), s);
  await extrude('Bagnet wejscie', 'Bagnet wejscie szkic', { op: 'REMOVE', depth: mm(-zA), opp: true, scope: 'Tuleja' });
  await plane('Plaszczyzna rowka', qStd('Top'), mm(-zA), true);
  for (const a of [0, 150, 210]) {
    await planeAngle(`Plaszczyzna rowka ${a}`, 'Os Z', `${(a - polKat).toFixed(3)} deg`);
    s = new Sk(); s.rect(-(D.mOR + 1), zA, -D.dno, zB); await sketch(`Bagnet rowek ${a} szkic`, qFace(`Plaszczyzna rowka ${a}`), s);
    await revolve(`Bagnet rowek ${a}`, `Bagnet rowek ${a} szkic`, 'Os Z', { op: 'REMOVE', angle: `${(30 + 2 * polKat).toFixed(3)} deg`, scope: 'Tuleja' });
  }
  s = new Sk(); s.radial(D.dno, D.mOR + 1, 2 * hw, 180); s.radial(D.dno, D.mOR + 1, 2 * hw, 240);
  await sketch('Bagnet wejscia 150 210 szkic', qStd('Top'), s);
  await extrude('Bagnet wejscia 150 210', 'Bagnet wejscia 150 210 szkic', { op: 'REMOVE', depth: mm(-zA), opp: true, scope: 'Tuleja' });
  // zatrzaski (garb 0.6 mm na dnie rowka tuz za zaczepem) - PO rowkach, inaczej rowek je wytnie
  const da = (D.zaczepW / 2 + 0.6) / D.mOR * 180 / Math.PI;
  s = new Sk(); for (const a of [0, 150, 210]) s.radial(D.dno - 0.5, D.dno + 0.6, 0.8, a + da);
  await sketch('Zatrzaski szkic', qFace('Plaszczyzna rowka'), s);
  await extrude('Zatrzaski', 'Zatrzaski szkic', { op: 'ADD', depth: mm(zB - zA), scope: 'Tuleja' });
  // otwory czopow (gora/dol) + poglebienia na lby
  s = new Sk(); s.circle(0, D.kulaZ, 2.9, '#czopD - 0.1 mm'); await sketch('Otwory czopow szkic', qStd('Front'), s);
  await extrude('Otwory czopow', 'Otwory czopow szkic', { op: 'REMOVE', depth: '60 mm', sym: true, scope: 'Tuleja' });
  await plane('Plaszczyzna Y+ tulei', qStd('Front'), '#modulOD / 2', true);
  await plane('Plaszczyzna Y- tulei', qStd('Front'), '#modulOD / 2', false);
  s = new Sk(); s.circle(0, D.kulaZ, 6); await sketch('Poglebienie gora szkic', qFace('Plaszczyzna Y+ tulei'), s);
  await extrude('Poglebienie gora', 'Poglebienie gora szkic', { op: 'REMOVE', depth: '1.3 mm', scope: 'Tuleja' });
  s = new Sk(); s.circle(0, D.kulaZ, 6); await sketch('Poglebienie dol szkic', qFace('Plaszczyzna Y- tulei'), s);
  await extrude('Poglebienie dol', 'Poglebienie dol szkic', { op: 'REMOVE', depth: '1.3 mm', opp: true, scope: 'Tuleja' });
  // GORA modulu = okno serwa (strzalka na chwycie wypadalaby w oknie)
};

OS.mechanizm = async () => {
  let s;
  const zc = D.kulaZ;
  // jarzmo C
  s = new Sk(); s.circle(0, zc, 46.5, '#kulaD + 2 * (#luzKula + #jarzmoT)'); s.circle(0, zc, 41.5, '#kulaD + 2 * #luzKula');
  await sketch('Jarzmo szkic', qStd('Right'), s);
  await extrude('Jarzmo', 'Jarzmo szkic', { op: 'NEW', depth: '6 mm', sym: true });
  s = new Sk(); s.rect(-30, zc, 30, zc + 30); await sketch('Jarzmo polowa szkic', qStd('Right'), s);
  await extrude('Jarzmo polowa', 'Jarzmo polowa szkic', { op: 'REMOVE', depth: '20 mm', sym: true, scope: 'Jarzmo' });
  await plane('Plaszczyzna Y+ jarzma', qStd('Front'), mm(D.jRin), true);
  await plane('Plaszczyzna Y- jarzma', qStd('Front'), mm(D.jRin), false);
  s = new Sk(); s.circle(0, zc, 7); await sketch('Oczko gora szkic', qFace('Plaszczyzna Y+ jarzma'), s);
  await extrude('Oczko gora', 'Oczko gora szkic', { op: 'ADD', depth: mm(D.jRout - D.jRin), opp: true, scope: 'Jarzmo' });
  s = new Sk(); s.circle(0, zc, 7); await sketch('Oczko dol szkic', qFace('Plaszczyzna Y- jarzma'), s);
  await extrude('Oczko dol', 'Oczko dol szkic', { op: 'ADD', depth: mm(D.jRout - D.jRin), scope: 'Jarzmo' });
  await plane('Plaszczyzna kolca', qStd('Top'), mm(-(zc - D.jRin - 0.3)), true);
  s = new Sk(); s.circle(0, 0, 2.5); await sketch('Kolec szkic', qFace('Plaszczyzna kolca'), s);
  await extrude('Kolec', 'Kolec szkic', { op: 'ADD', depth: mm((zc - D.kulaR + 3) - (zc - D.jRin - 0.3)), scope: 'Jarzmo' });
  await plane('Plaszczyzna korby', qStd('Front'), mm(D.linkY0 - 2.5), true);
  s = new Sk(); s.circle(0, zc - D.korba, 5.5); await sketch('Korba szkic', qFace('Plaszczyzna korby'), s);
  await extrude('Korba', 'Korba szkic', { op: 'ADD', depth: '2.5 mm', opp: true, scope: 'Jarzmo' });
  await plane('Plaszczyzna ciegna', qStd('Front'), mm(D.linkY0), true);
  s = new Sk(); s.circle(0, zc - D.korba, 3, '#czopD'); await sketch('Kolek korby szkic', qFace('Plaszczyzna ciegna'), s);
  await extrude('Kolek korby', 'Kolek korby szkic', { op: 'ADD', depth: '2.5 mm', opp: true, scope: 'Jarzmo' });
  s = new Sk(); s.circle(0, zc, 3.4, '#czopD + 2 * #luzCzop'); await sketch('Jarzmo otwory szkic', qStd('Front'), s);
  await extrude('Jarzmo otwory', 'Jarzmo otwory szkic', { op: 'REMOVE', depth: '60 mm', sym: true, scope: 'Jarzmo' });
  // czopy (2 szt.)
  for (const [nm, sg] of [['Czop gora', 1], ['Czop dol', -1]]) {
    await plane(`Plaszczyzna ${nm}`, qStd('Front'), mm(D.kulaR - 3), sg > 0);
    s = new Sk(); s.circle(0, zc, 3, '#czopD'); await sketch(`${nm} szkic`, qFace(`Plaszczyzna ${nm}`), s);
    await extrude(nm, `${nm} szkic`, { op: 'NEW', depth: mm(D.mOR - 1.3 - (D.kulaR - 3)), opp: sg > 0 });
    await plane(`Plaszczyzna ${nm} leb`, qStd('Front'), mm(D.mOR - 1.3), sg > 0);
    s = new Sk(); s.circle(0, zc, 5.6); await sketch(`${nm} leb szkic`, qFace(`Plaszczyzna ${nm} leb`), s);
    await extrude(`${nm} leb`, `${nm} leb szkic`, { op: 'ADD', depth: '1.2 mm', opp: sg > 0, scope: nm });
  }
  // ciegno
  const zA = zc - D.korba, zB = D.servoZ - D.orczyk;
  s = new Sk(); s.rect(-2.5, zB, 2.5, zA); s.circle(0, zA, 5.5); s.circle(0, zB, 5.5); await sketch('Ciegno szkic', qFace('Plaszczyzna ciegna'), s);
  await extrude('Ciegno', 'Ciegno szkic', { op: 'NEW', depth: '2.5 mm', opp: true });
  s = new Sk(); s.circle(0, zA, 3.4, '#czopD + 2 * #luzCzop'); s.circle(0, zB, 2.2); await sketch('Ciegno otwory szkic', qFace('Plaszczyzna ciegna'), s);
  await extrude('Ciegno otwory', 'Ciegno otwory szkic', { op: 'REMOVE', depth: '2.5 mm', opp: true, scope: 'Ciegno' });
};

OS.podglad = async () => {
  let s;
  s = new Sk(); s.circle(0, D.kulaZ, 40, '#kulaD'); s.line(0, D.kulaZ - 25, 0, D.kulaZ + 25); await sketch('PODGLAD pileczka szkic', qStd('Right'), s);
  await revolve('PODGLAD pileczka', 'PODGLAD pileczka szkic', 'Os Z', { op: 'NEW', full: true,
    regions: `query=qNthElement(qSketchRegion(makeId("${F['PODGLAD pileczka szkic']}"), false), 0);` });
  await plane('Plaszczyzna spodu serwa', qStd('Front'), mm(-D.servoSpod), false);
  s = new Sk(); s.rect(-6.1, D.servoPrzod - 22.5, 6.1, D.servoPrzod); await sketch('PODGLAD SG90 szkic', qFace('Plaszczyzna spodu serwa'), s);
  await extrude('PODGLAD SG90', 'PODGLAD SG90 szkic', { op: 'NEW', depth: '22.7 mm', opp: true });
  s = new Sk(); s.rect(-6.1, D.servoSrodek - 16.1, 6.1, D.servoSrodek + 16.1); await sketch('PODGLAD SG90 uszy szkic', qFace('Plaszczyzna uszu serwa'), s);
  await extrude('PODGLAD SG90 uszy', 'PODGLAD SG90 uszy szkic', { op: 'ADD', depth: '2.5 mm', opp: true, scope: 'PODGLAD SG90' });
  s = new Sk(); s.circle(0, D.servoZ, 4.8); await sketch('PODGLAD SG90 walek szkic', qFace('Plaszczyzna spodu serwa'), s);
  await extrude('PODGLAD SG90 walek', 'PODGLAD SG90 walek szkic', { op: 'ADD', depth: mm(D.linkY0 - 1.5 - D.servoSpod), opp: true, scope: 'PODGLAD SG90' });
  await plane('Plaszczyzna orczyka', qStd('Front'), mm(D.linkY0 - 1.5), true);
  s = new Sk(); s.rect(-2.5, D.servoZ - D.orczyk - 2.5, 2.5, D.servoZ + 3); await sketch('PODGLAD orczyk szkic', qFace('Plaszczyzna orczyka'), s);
  await extrude('PODGLAD orczyk', 'PODGLAD orczyk szkic', { op: 'NEW', depth: '1.5 mm', opp: true });
};

OS.D = D; OS.F = F; OS.log = [];
window.OS = OS;
})();
