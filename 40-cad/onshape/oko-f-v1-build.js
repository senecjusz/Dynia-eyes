// Budowa modelu "Oko F v1" w Onshape ze zwyklych operacji (Variable, Plane, Sketch,
// Extrude, Revolve, Helix, Sweep, Circular pattern) przez REST API.
//
// Uzycie: otworz docelowe (puste) Part Studio na cad.onshape.com, wklej plik do konsoli
// przegladarki i uruchom:  await OS.all()
// Wynik: normalne drzewo operacji w logicznej kolejnosci:
//   Zmienne -> Wspolne -> Gniazdo -> Nakretka -> Modul tuleja -> Modul mechanizm -> Podglad
// Foldery w drzewie i ukrywanie plaszczyzn/szkicow robi sie recznie w Onshape
// (REST API nie obsluguje folderow ani widocznosci).
//
// Uklad: os oka = Z (Top = powierzchnia dyni), +Z na zewnatrz, +Y = GORA.
// Front: szkic (x,y) -> swiat (X,Z), normalna -Y.  Right: (x,y) -> (Y,Z), normalna +X.
// Plaszczyzna "LINE_ANGLE" (Front obrocony wokol osi Z o kat a): os x szkicu = kierunek 180+a st.,
//   wspolrzedne szkicu licza sie od poczatku ukladu (y szkicu = Z swiata).
// Srednice i glebokosci glownych elementow sa wyrazeniami ze zmiennych #...;
// drobne szkice (zaczepy, rowki, profil gwintu, slupki, korba, ciegno) maja liczby z tablicy D.

(() => {
const OS = { log: [] };
const xsrf = decodeURIComponent((document.cookie.match(/XSRF-TOKEN=([^;]+)/) || [])[1] || '');
const H = { Accept: 'application/json', 'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrf };
const [, did, wid, eid] = location.pathname.match(/documents\/(\w+)\/w\/(\w+)\/e\/(\w+)/);
const base = `/api/v10/partstudios/d/${did}/w/${wid}/e/${eid}`;
const F = {}; // nazwa operacji -> featureId
let specs = null;

const mm = (v) => `${+v.toFixed(4)} mm`;
const deg = (v) => `${+v.toFixed(4)} deg`;
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
  F[key] = j.feature && j.feature.featureId;
  OS.log.push(`${key}: ${st}`);
  if (st !== 'OK') throw new Error(`${key}: ${st}`);
  return F[key];
}

// ---------- szkic ----------
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
    const ids = pts.map((a, i) => { const b = pts[(i + 1) % pts.length]; return this.line(a[0], a[1], b[0], b[1]); });
    ids.forEach((id, i) => this.c.push({ btType: 'BTMSketchConstraint-2', constraintType: 'COINCIDENT', entityId: this.id('k'),
      parameters: [ps('localFirst', id + '.end'), ps('localSecond', ids[(i + 1) % ids.length] + '.start')] }));
  }
  rect(x0, y0, x1, y1) { this.poly([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]); }
  // prostokat promieniowy r0..r1, szerokosc w, obrocony o kat a (st.) wokol poczatku szkicu
  radial(r0, r1, w, a) {
    const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180);
    const R = (x, y) => [x * c - y * s, x * s + y * c];
    this.poly([R(r0, -w / 2), R(r1, -w / 2), R(r1, w / 2), R(r0, w / 2)]);
  }
}

// ---------- operacje ----------
const sketch = (key, planeQ, sk) => post({ btType: 'BTMSketch-151', featureType: 'newSketch', name: key,
  parameters: [pq('sketchPlane', planeQ)], entities: sk.e, constraints: sk.c }, key);
async function plane(key, baseQ, offset, opposite) {
  const ft = 'cPlane';
  return post({ btType: 'BTMFeature-134', featureType: ft, name: key, parameters: [
    pq('entities', baseQ), await pe(ft, 'cplaneType', 'OFFSET'), pn('offset', offset), pb('oppositeDirection', !!opposite)] }, key);
}
async function planeAngle(key, axisKey, angle) {
  const ft = 'cPlane';
  return post({ btType: 'BTMFeature-134', featureType: ft, name: key, parameters: [
    pq('entities', qEdge(axisKey), qStd('Front')), await pe(ft, 'cplaneType', 'LINE_ANGLE'), pn('angle', angle)] }, key);
}
// o: {op, depth, opp, sym, through, scope}
async function extrude(key, skKey, o) {
  const ft = 'extrude';
  const p = [await pe(ft, 'bodyType', 'SOLID'), await pe(ft, 'operationType', o.op || 'NEW'), pq('entities', qReg(skKey)),
    await pe(ft, 'endBound', o.through ? 'THROUGH_ALL' : 'BLIND'), pn('depth', o.depth || '1 mm'),
    pb('oppositeDirection', !!o.opp), pb('symmetric', !!o.sym)];
  if (o.scope) p.push(pb('defaultScope', false), pq('booleanScope', qBody(o.scope)));
  return post({ btType: 'BTMFeature-134', featureType: ft, name: key, parameters: p }, key);
}
// fullRevolve domyslnie = true, wiec zawsze ustawiany jawnie; obrot "do przodu" = CCW wokol +Z
async function revolve(key, skKey, axisKey, o) {
  const ft = 'revolve';
  const p = [await pe(ft, 'bodyType', 'SOLID'), await pe(ft, 'operationType', o.op || 'NEW'), pq('entities', o.regions || qReg(skKey)),
    pq('axis', qEdge(axisKey)), pb('fullRevolve', !!o.full), await pe(ft, 'endBound', 'BLIND'), pn('angle', o.angle || '360 deg')];
  if (o.scope) p.push(pb('defaultScope', false), pq('booleanScope', qBody(o.scope)));
  return post({ btType: 'BTMFeature-134', featureType: ft, name: key, parameters: p }, key);
}
// CW przy tej osi daje gwint prawy
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
  if (scope) p.push(pb('defaultScope', false), pq('booleanScope', qBody(scope)));
  return post({ btType: 'BTMFeature-134', featureType: ft, name: key, parameters: p }, key);
}
// szyk kolowy dziala dla ADD; dla REMOVE Onshape zglasza PATTERN_FACE_FAILED (wtedy osobne szkice)
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
    await pe(ft, 'variableType', 'LENGTH'), ps('name', name), pn('lengthValue', expr), ps('description', desc)] }, '#' + name);
}

// ---------- liczby do drobnych szkicow (zgodne z domyslnymi zmiennymi) ----------
const D = {};
D.kulaR = 20; D.kulaZ = -5;                  // srodek pileczki 5 mm pod powierzchnia
D.jRin = 20.75; D.jRout = 23.25;             // jarzmo
D.mIR = 24.25; D.mOR = 26.65;                // tuleja modulu
D.gIR = 27.25; D.gOR = 29.65; D.gTop = 31.15; // gniazdo: otwor, dno gwintu, wierzcholek gwintu
D.thrZ0 = -48;                               // start helisy = -(gniazdoL + skok)
D.zaczepH = 1.2; D.zaczepW = 6; D.zaczepZ = -6; D.zaczepL = 3; D.luzZ = 0.3;
D.dno = D.mOR - (D.zaczepH - 0.6) - 0.4;     // dno rowka bagnetu = 25.65
D.katy = [0, 150, 210];                      // zaczepy gniazda (pozycja koncowa); nierowno = jedna pozycja
D.obrot = 30;                                // obrot bagnetu
// korba 20 mm, warstwa ciegna Y 16..18.5 (przy korbie 17 ciegno nachodzilo na luk jarzma)
D.servoZ = -40.5; D.linkY0 = 16; D.servoSpod = D.linkY0 - 30.5; D.uchoY = D.servoSpod + 15.9;
D.servoPrzod = D.servoZ + 5.9; D.servoSrodek = D.servoPrzod - 11.25;
D.korba = 20; D.orczyk = 14;

OS.zmienne = async () => {
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
    ['czopD', '3 mm', 'srednica czopu'],
    ['luzCzop', '0.2 mm', 'luz czopu w jarzmie i ciegnie'],
    ['rantD', '72 mm', 'srednica rantu'],
    ['rantT', '2 mm', 'grubosc rantu'],
    ['kolnierzykD', '43 mm', 'otwor w rancie (oczodol)'],
    ['przodD', '62 mm', 'srednica przedniej czesci gniazda (otwor w dyni 64)'],
    ['przodL', '12 mm', 'dlugosc przedniej czesci gniazda'],
    ['dociskMin', '15 mm', 'najciensza scianka dyni'],
    ['dociskMax', '35 mm', 'najgrubsza scianka dyni'],
    ['nakretkaH', '8 mm', 'wysokosc nakretki'],
    ['nakretkaD', '76 mm', 'srednica nakretki'],
    ['nakretkaZ', '25 mm', 'pozycja nakretki pod powierzchnia (tylko podglad)'],
    ['modulL', '65 mm', 'dlugosc tulei modulu'],
    ['modulID', '#kulaD + 2 * (#luzKula + #jarzmoT + #luzJarzmo)', 'wyliczane: srednica wewn. tulei'],
    ['modulOD', '#modulID + 2 * #sciankaM', 'wyliczane: srednica zewn. tulei'],
    ['gniazdoID', '#modulOD + 2 * #luzBagnet', 'wyliczane: otwor gniazda'],
    ['gniazdoOD', '#gniazdoID + 2 * #sciankaG', 'wyliczane: dno gwintu'],
    ['gwintD', '#gniazdoOD + 2 * #gwintH', 'wyliczane: srednica gwintu'],
    ['gniazdoL', '#dociskMax + #nakretkaH + 2 mm', 'wyliczane: dlugosc gniazda za rantem'],
    ['nakretkaOtwor', '#gniazdoOD + 2 * #luzGwint', 'wyliczane: otwor nakretki'],
  ];
  for (const [n, e, d] of V) await variable(n, e, d);
};

OS.wspolne = async () => {
  const s = new Sk(); s.line(0, -80, 0, 30, true);
  await sketch('Wspolne: os Z', qStd('Front'), s);
};

OS.gniazdo = async () => {
  const G = 'Gniazdo: rant';
  let s;
  s = new Sk(); s.circle(0, 0, 72, '#rantD'); s.circle(0, 0, 43, '#kolnierzykD');
  await sketch('Gniazdo: rant szkic', qStd('Top'), s);
  await extrude(G, 'Gniazdo: rant szkic', { op: 'NEW', depth: '#rantT' });
  s = new Sk(); s.circle(0, 0, 62, '#przodD'); s.circle(0, 0, 54.5, '#gniazdoID');
  await sketch('Gniazdo: przod szkic', qStd('Top'), s);
  await extrude('Gniazdo: przod', 'Gniazdo: przod szkic', { op: 'ADD', depth: '#przodL', opp: true, scope: G });
  s = new Sk(); s.circle(0, 0, 59.3, '#gniazdoOD'); s.circle(0, 0, 54.5, '#gniazdoID');
  await sketch('Gniazdo: tuleja szkic', qStd('Top'), s);
  await extrude('Gniazdo: tuleja', 'Gniazdo: tuleja szkic', { op: 'ADD', depth: '#gniazdoL', opp: true, scope: G });
  // gwint: helisa po okregu dna gwintu + trapez przemiatany po helisie
  await plane('Gniazdo: pl. startu gwintu', qStd('Top'), '#gniazdoL + #gwintSkok', true);
  s = new Sk(); s.circle(0, 0, 59.3, '#gniazdoOD');
  await sketch('Gniazdo: okrag helisy', qFace('Gniazdo: pl. startu gwintu'), s);
  await helix('Gniazdo: helisa gwintu', 'Gniazdo: okrag helisy', '#gwintSkok', '#gniazdoL + #gwintSkok - #dociskMin + 1 mm');
  const z0 = D.thrZ0;
  s = new Sk(); s.poly([[D.gOR - 0.4, z0 - 1.1], [D.gOR, z0 - 1.1], [D.gTop, z0 - 0.3], [D.gTop, z0 + 0.3], [D.gOR, z0 + 1.1], [D.gOR - 0.4, z0 + 1.1]]);
  await sketch('Gniazdo: profil gwintu', qStd('Front'), s);
  await sweep('Gniazdo: gwint', 'Gniazdo: profil gwintu', 'Gniazdo: helisa gwintu', 'ADD', G);
  await plane('Gniazdo: pl. konca', qStd('Top'), '#gniazdoL', true);
  s = new Sk(); s.circle(0, 0, 90);
  await sketch('Gniazdo: przyciecie gwintu szkic', qFace('Gniazdo: pl. konca'), s);
  await extrude('Gniazdo: przyciecie gwintu', 'Gniazdo: przyciecie gwintu szkic', { op: 'REMOVE', depth: '10 mm', opp: true, scope: G });
  // zaczepy bagnetu (do srodka) na 0 st. + szyk 150 i 210 st.
  await plane('Gniazdo: pl. zaczepow', qStd('Top'), mm(-D.zaczepZ), true);
  s = new Sk(); s.rect(D.gIR - D.zaczepH, -D.zaczepW / 2, D.gIR + 0.5, D.zaczepW / 2);
  await sketch('Gniazdo: zaczep szkic', qFace('Gniazdo: pl. zaczepow'), s);
  await extrude('Gniazdo: zaczep 0', 'Gniazdo: zaczep szkic', { op: 'ADD', depth: mm(D.zaczepL), scope: G });
  await cpattern('Gniazdo: zaczep 150', ['Gniazdo: zaczep 0'], 'Wspolne: os Z', '150 deg', 2, G);
  await cpattern('Gniazdo: zaczep 210', ['Gniazdo: zaczep 0'], 'Wspolne: os Z', '210 deg', 2, G);
  // zabki pod rantem (przeciw obracaniu w dyni)
  s = new Sk(); for (let k = 0; k < 8; k++) s.radial(32.3, 35.3, 1.2, 22.5 + 45 * k);
  await sketch('Gniazdo: zabki szkic', qStd('Top'), s);
  await extrude('Gniazdo: zabki', 'Gniazdo: zabki szkic', { op: 'ADD', depth: '1.5 mm', opp: true, scope: G });
  // strzalka GORA wycieta w rancie
  await plane('Gniazdo: pl. rantu', qStd('Top'), '#rantT', false);
  s = new Sk(); s.poly([[0, 34.5], [-3, 29.5], [3, 29.5]]);
  await sketch('Gniazdo: strzalka GORA szkic', qFace('Gniazdo: pl. rantu'), s);
  await extrude('Gniazdo: strzalka GORA', 'Gniazdo: strzalka GORA szkic', { op: 'REMOVE', depth: '0.6 mm', opp: true, scope: G });
};

OS.nakretka = async () => {
  const N = 'Nakretka: korpus';
  let s;
  await plane('Nakretka: pl. czola', qStd('Top'), '#nakretkaZ', true);
  s = new Sk(); s.circle(0, 0, 76, '#nakretkaD'); s.rect(-46, -5, 46, 5);
  await sketch('Nakretka: korpus szkic', qFace('Nakretka: pl. czola'), s);
  await extrude(N, 'Nakretka: korpus szkic', { op: 'NEW', depth: '#nakretkaH', opp: true });
  s = new Sk(); s.circle(0, 0, 59.9, '#nakretkaOtwor');
  await sketch('Nakretka: otwor szkic', qFace('Nakretka: pl. czola'), s);
  await extrude('Nakretka: otwor', 'Nakretka: otwor szkic', { op: 'REMOVE', through: true, opp: true, scope: N });
  const z0 = D.thrZ0, l = 0.3;
  s = new Sk(); s.poly([[D.gOR - 0.5, z0 - 1.1 - l], [D.gOR, z0 - 1.1 - l], [D.gTop + l, z0 - 0.3 - l], [D.gTop + l, z0 + 0.3 + l], [D.gOR, z0 + 1.1 + l], [D.gOR - 0.5, z0 + 1.1 + l]]);
  await sketch('Nakretka: profil gwintu', qStd('Front'), s);
  await sweep('Nakretka: gwint', 'Nakretka: profil gwintu', 'Gniazdo: helisa gwintu', 'REMOVE', N);
  await plane('Nakretka: pl. tylu', qStd('Top'), '#nakretkaZ + #nakretkaH', true);
  s = new Sk(); for (let k = 0; k < 6; k++) s.radial(33, 39, 4, 30 + 60 * k);
  await sketch('Nakretka: wyciecia na klucz szkic', qFace('Nakretka: pl. tylu'), s);
  await extrude('Nakretka: wyciecia na klucz', 'Nakretka: wyciecia na klucz szkic', { op: 'REMOVE', depth: '2.5 mm', scope: N });
};

OS.tuleja = async () => {
  const T = 'Modul: tuleja';
  let s;
  await plane('Modul: pl. czola', qStd('Top'), '0.3 mm', true);
  s = new Sk(); s.circle(0, 0, 53.3, '#modulOD'); s.circle(0, 0, 48.5, '#modulID');
  await sketch('Modul: tuleja szkic', qFace('Modul: pl. czola'), s);
  await extrude(T, 'Modul: tuleja szkic', { op: 'NEW', depth: '#modulL', opp: true });
  await plane('Modul: pl. chwytu', qStd('Top'), '#gniazdoL + 2 mm', true);
  s = new Sk(); s.circle(0, 0, 64.3, '#gwintD + 2 mm'); s.circle(0, 0, 48.5, '#modulID');
  await sketch('Modul: chwyt szkic', qFace('Modul: pl. chwytu'), s);
  await extrude('Modul: chwyt', 'Modul: chwyt szkic', { op: 'ADD', depth: '5 mm', opp: true, scope: T });
  // bagnet: modul wchodzi obrocony o -30 st., wiec wejscia osiowe na a+30, rowki od a-polKat do a+30+polKat
  const hw = D.zaczepW / 2 + D.luzZ, polKat = hw / D.mOR * 180 / Math.PI;
  const zA = D.zaczepZ - D.luzZ, zB = D.zaczepZ + D.zaczepL + D.luzZ;
  s = new Sk(); for (const a of D.katy) s.radial(D.dno, D.mOR + 1, 2 * hw, a + D.obrot);
  await sketch('Modul: wejscia bagnetu szkic', qStd('Top'), s);
  await extrude('Modul: wejscia bagnetu', 'Modul: wejscia bagnetu szkic', { op: 'REMOVE', depth: mm(-zA), opp: true, scope: T });
  for (const a of D.katy) {
    await planeAngle(`Modul: pl. rowka ${a}`, 'Wspolne: os Z', deg(a - polKat));
    s = new Sk(); s.rect(-(D.mOR + 1), zA, -D.dno, zB);
    await sketch(`Modul: rowek ${a} szkic`, qFace(`Modul: pl. rowka ${a}`), s);
    await revolve(`Modul: rowek bagnetu ${a}`, `Modul: rowek ${a} szkic`, 'Wspolne: os Z', { op: 'REMOVE', angle: deg(D.obrot + 2 * polKat), scope: T });
  }
  // zatrzaski: garb 0.6 mm na dnie rowka tuz za zaczepem (po rowkach, inaczej zostalyby wyciete)
  await plane('Modul: pl. zatrzaskow', qStd('Top'), mm(-zA), true);
  const da = (D.zaczepW / 2 + 0.6) / D.mOR * 180 / Math.PI;
  s = new Sk(); for (const a of D.katy) s.radial(D.dno - 0.5, D.dno + 0.6, 0.8, a + da);
  await sketch('Modul: zatrzaski szkic', qFace('Modul: pl. zatrzaskow'), s);
  await extrude('Modul: zatrzaski', 'Modul: zatrzaski szkic', { op: 'ADD', depth: mm(zB - zA), scope: T });
  // otwory na czopy (gora/dol) + poglebienia na lby
  s = new Sk(); s.circle(0, D.kulaZ, 2.9, '#czopD - 0.1 mm');
  await sketch('Modul: otwory czopow szkic', qStd('Front'), s);
  await extrude('Modul: otwory czopow', 'Modul: otwory czopow szkic', { op: 'REMOVE', depth: '60 mm', sym: true, scope: T });
  await plane('Modul: pl. Y+ tulei', qStd('Front'), '#modulOD / 2', true);
  await plane('Modul: pl. Y- tulei', qStd('Front'), '#modulOD / 2', false);
  s = new Sk(); s.circle(0, D.kulaZ, 6);
  await sketch('Modul: poglebienie gora szkic', qFace('Modul: pl. Y+ tulei'), s);
  await extrude('Modul: poglebienie gora', 'Modul: poglebienie gora szkic', { op: 'REMOVE', depth: '1.3 mm', scope: T });
  s = new Sk(); s.circle(0, D.kulaZ, 6);
  await sketch('Modul: poglebienie dol szkic', qFace('Modul: pl. Y- tulei'), s);
  await extrude('Modul: poglebienie dol', 'Modul: poglebienie dol szkic', { op: 'REMOVE', depth: '1.3 mm', opp: true, scope: T });
  // slupki pod uszy SG90 (otwory pod wkrety z kompletu serwa)
  await plane('Modul: pl. uszu serwa', qStd('Front'), mm(D.uchoY), true);
  const zs = [D.servoSrodek + 13.9, D.servoSrodek - 13.9];
  s = new Sk(); for (const z of zs) s.rect(-6, z - 2, 6, z + 2);
  await sketch('Modul: slupki serwa szkic', qFace('Modul: pl. uszu serwa'), s);
  await extrude('Modul: slupki serwa', 'Modul: slupki serwa szkic', { op: 'ADD', depth: mm(D.uchoY + D.mIR + 1), scope: T });
  s = new Sk(); for (const z of zs) s.circle(0, z, 1.8);
  await sketch('Modul: otwory wkretow szkic', qFace('Modul: pl. uszu serwa'), s);
  await extrude('Modul: otwory wkretow', 'Modul: otwory wkretow szkic', { op: 'REMOVE', depth: '8 mm', scope: T });
  // okno od gory na serwo (= GORA modulu)
  await plane('Modul: pl. okna', qStd('Front'), '5 mm', true);
  s = new Sk(); s.rect(-6.8, D.servoPrzod - 28, 6.8, D.servoPrzod + 5.5);
  await sketch('Modul: okno serwa szkic', qFace('Modul: pl. okna'), s);
  await extrude('Modul: okno serwa', 'Modul: okno serwa szkic', { op: 'REMOVE', through: true, opp: true, scope: T });
};

OS.mechanizm = async () => {
  const J = 'Mechanizm: jarzmo';
  const zc = D.kulaZ;
  let s;
  s = new Sk(); s.circle(0, zc, 46.5, '#kulaD + 2 * (#luzKula + #jarzmoT)'); s.circle(0, zc, 41.5, '#kulaD + 2 * #luzKula');
  await sketch('Mechanizm: jarzmo szkic', qStd('Right'), s);
  await extrude(J, 'Mechanizm: jarzmo szkic', { op: 'NEW', depth: '6 mm', sym: true });
  s = new Sk(); s.rect(-30, zc, 30, zc + 30);
  await sketch('Mechanizm: polowa jarzma szkic', qStd('Right'), s);
  await extrude('Mechanizm: polowa jarzma', 'Mechanizm: polowa jarzma szkic', { op: 'REMOVE', depth: '20 mm', sym: true, scope: J });
  await plane('Mechanizm: pl. Y+ jarzma', qStd('Front'), mm(D.jRin), true);
  await plane('Mechanizm: pl. Y- jarzma', qStd('Front'), mm(D.jRin), false);
  s = new Sk(); s.circle(0, zc, 7);
  await sketch('Mechanizm: oczko gora szkic', qFace('Mechanizm: pl. Y+ jarzma'), s);
  await extrude('Mechanizm: oczko gora', 'Mechanizm: oczko gora szkic', { op: 'ADD', depth: mm(D.jRout - D.jRin), opp: true, scope: J });
  s = new Sk(); s.circle(0, zc, 7);
  await sketch('Mechanizm: oczko dol szkic', qFace('Mechanizm: pl. Y- jarzma'), s);
  await extrude('Mechanizm: oczko dol', 'Mechanizm: oczko dol szkic', { op: 'ADD', depth: mm(D.jRout - D.jRin), scope: J });
  // kolec w tyl pileczki (pileczka obraca sie razem z jarzmem)
  await plane('Mechanizm: pl. kolca', qStd('Top'), mm(-(zc - D.jRin - 0.3)), true);
  s = new Sk(); s.circle(0, 0, 2.5);
  await sketch('Mechanizm: kolec szkic', qFace('Mechanizm: pl. kolca'), s);
  await extrude('Mechanizm: kolec', 'Mechanizm: kolec szkic', { op: 'ADD', depth: mm((zc - D.kulaR + 3) - (zc - D.jRin - 0.3)), scope: J });
  // korba: oczko + kolek w gore do ciegna
  await plane('Mechanizm: pl. korby', qStd('Front'), mm(D.linkY0 - 2.5), true);
  s = new Sk(); s.circle(0, zc - D.korba, 5.5);
  await sketch('Mechanizm: korba szkic', qFace('Mechanizm: pl. korby'), s);
  await extrude('Mechanizm: korba', 'Mechanizm: korba szkic', { op: 'ADD', depth: '2.5 mm', opp: true, scope: J });
  await plane('Mechanizm: pl. ciegna', qStd('Front'), mm(D.linkY0), true);
  s = new Sk(); s.circle(0, zc - D.korba, 3, '#czopD');
  await sketch('Mechanizm: kolek korby szkic', qFace('Mechanizm: pl. ciegna'), s);
  await extrude('Mechanizm: kolek korby', 'Mechanizm: kolek korby szkic', { op: 'ADD', depth: '2.5 mm', opp: true, scope: J });
  s = new Sk(); s.circle(0, zc, 3.4, '#czopD + 2 * #luzCzop');
  await sketch('Mechanizm: otwory jarzma szkic', qStd('Front'), s);
  await extrude('Mechanizm: otwory jarzma', 'Mechanizm: otwory jarzma szkic', { op: 'REMOVE', depth: '60 mm', sym: true, scope: J });
  // czopy (2 szt.): przez tuleje, oczko jarzma i 3 mm w pileczke
  for (const [nm, up] of [['Mechanizm: czop gora', true], ['Mechanizm: czop dol', false]]) {
    await plane(`${nm} pl.`, qStd('Front'), mm(D.kulaR - 3), up);
    s = new Sk(); s.circle(0, zc, 3, '#czopD');
    await sketch(`${nm} szkic`, qFace(`${nm} pl.`), s);
    await extrude(nm, `${nm} szkic`, { op: 'NEW', depth: mm(D.mOR - 1.3 - (D.kulaR - 3)), opp: up });
    await plane(`${nm} pl. lba`, qStd('Front'), mm(D.mOR - 1.3), up);
    s = new Sk(); s.circle(0, zc, 5.6);
    await sketch(`${nm} leb szkic`, qFace(`${nm} pl. lba`), s);
    await extrude(`${nm} leb`, `${nm} leb szkic`, { op: 'ADD', depth: '1.2 mm', opp: up, scope: nm });
  }
  // ciegno: kolek korby (Ø3.4) <-> orczyk SG90 (Ø2.2, wkret z kompletu serwa)
  const zA = zc - D.korba, zB = D.servoZ - D.orczyk;
  s = new Sk(); s.rect(-2.5, zB, 2.5, zA); s.circle(0, zA, 5.5); s.circle(0, zB, 5.5);
  await sketch('Mechanizm: ciegno szkic', qFace('Mechanizm: pl. ciegna'), s);
  await extrude('Mechanizm: ciegno', 'Mechanizm: ciegno szkic', { op: 'NEW', depth: '2.5 mm', opp: true });
  s = new Sk(); s.circle(0, zA, 3.4, '#czopD + 2 * #luzCzop'); s.circle(0, zB, 2.2);
  await sketch('Mechanizm: otwory ciegna szkic', qFace('Mechanizm: pl. ciegna'), s);
  await extrude('Mechanizm: otwory ciegna', 'Mechanizm: otwory ciegna szkic', { op: 'REMOVE', depth: '2.5 mm', opp: true, scope: 'Mechanizm: ciegno' });
};

OS.podglad = async () => {
  let s;
  s = new Sk(); s.circle(0, D.kulaZ, 40, '#kulaD'); s.line(0, D.kulaZ - 25, 0, D.kulaZ + 25);
  await sketch('Podglad: pileczka szkic', qStd('Right'), s);
  await revolve('Podglad: pileczka', 'Podglad: pileczka szkic', 'Wspolne: os Z', { op: 'NEW', full: true,
    regions: `query=qNthElement(qSketchRegion(makeId("${F['Podglad: pileczka szkic']}"), false), 0);` });
  await plane('Podglad: pl. spodu serwa', qStd('Front'), mm(-D.servoSpod), false);
  s = new Sk(); s.rect(-6.1, D.servoPrzod - 22.5, 6.1, D.servoPrzod);
  await sketch('Podglad: SG90 szkic', qFace('Podglad: pl. spodu serwa'), s);
  await extrude('Podglad: SG90', 'Podglad: SG90 szkic', { op: 'NEW', depth: '22.7 mm', opp: true });
  s = new Sk(); s.rect(-6.1, D.servoSrodek - 16.1, 6.1, D.servoSrodek + 16.1);
  await sketch('Podglad: SG90 uszy szkic', qFace('Modul: pl. uszu serwa'), s);
  await extrude('Podglad: SG90 uszy', 'Podglad: SG90 uszy szkic', { op: 'ADD', depth: '2.5 mm', opp: true, scope: 'Podglad: SG90' });
  s = new Sk(); s.circle(0, D.servoZ, 4.8);
  await sketch('Podglad: SG90 walek szkic', qFace('Podglad: pl. spodu serwa'), s);
  await extrude('Podglad: SG90 walek', 'Podglad: SG90 walek szkic', { op: 'ADD', depth: mm(D.linkY0 - 1.5 - D.servoSpod), opp: true, scope: 'Podglad: SG90' });
  await plane('Podglad: pl. orczyka', qStd('Front'), mm(D.linkY0 - 1.5), true);
  s = new Sk(); s.rect(-2.5, D.servoZ - D.orczyk - 2.5, 2.5, D.servoZ + 3);
  await sketch('Podglad: orczyk szkic', qFace('Podglad: pl. orczyka'), s);
  await extrude('Podglad: orczyk', 'Podglad: orczyk szkic', { op: 'NEW', depth: '1.5 mm', opp: true });
};

// nazwy czesci (metadane) po zbudowaniu
OS.nazwy = async () => {
  const names = { 'Gniazdo: rant': 'Gniazdo', 'Nakretka: korpus': 'Nakretka', 'Modul: tuleja': 'Tuleja modulu',
    'Mechanizm: jarzmo': 'Jarzmo', 'Mechanizm: czop gora': 'Czop gora', 'Mechanizm: czop dol': 'Czop dol',
    'Mechanizm: ciegno': 'Ciegno', 'Podglad: pileczka': 'PODGLAD pileczka', 'Podglad: SG90': 'PODGLAD SG90', 'Podglad: orczyk': 'PODGLAD orczyk' };
  for (const [feat, name] of Object.entries(names)) {
    const r = await fetch(base + '/featurescript', { method: 'POST', headers: H, body: JSON.stringify({ script:
      `function(context is Context, queries) { return transientQueriesToStrings(evaluateQuery(context, qCreatedBy(makeId("${F[feat]}"), EntityType.BODY))); }` }) });
    const tid = (await r.json()).result.value[0].value;
    const parts = await (await fetch(`/api/v10/parts/d/${did}/w/${wid}/e/${eid}`, { headers: H })).json();
    const p = parts.find((x) => x.partId === tid);
    if (!p) { OS.log.push(`nazwa ${name}: brak czesci`); continue; }
    await fetch(`/api/v10/metadata/d/${did}/w/${wid}/e/${eid}/p/${encodeURIComponent(p.partId)}`, { method: 'POST', headers: H,
      body: JSON.stringify({ jsonType: 'metadata-part', partId: p.partId, properties: [{ propertyId: '57f3fb8efa3416c06701d60d', value: name }] }) });
    OS.log.push(`nazwa ${name}: OK`);
  }
};

OS.all = async () => {
  await OS.zmienne(); await OS.wspolne(); await OS.gniazdo(); await OS.nakretka();
  await OS.tuleja(); await OS.mechanizm(); await OS.podglad(); await OS.nazwy();
};

OS.D = D; OS.F = F;
window.OS = OS;
})();
