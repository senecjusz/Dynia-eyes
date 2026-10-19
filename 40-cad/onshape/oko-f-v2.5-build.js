// Oko F v2.5 (E2.1): skrypt wykonawcy; bramka i kontrola szkicu przeniesione z probka-gwintu-45.js (E2.0)
// Probka gwintu 45 (E2.0): skrypt wykonawcy w karcie cad.onshape.com (sesja przegladarki, cookie + X-XSRF-TOKEN).
// Etap 1: bramka req() (zasada 1 API z AGENTS.md), jej test i kontrola znacznika szkicu w drzewie.
// Etap 2 (budowa czesci) dopisuje sie ponizej po zatwierdzeniu planu drzewa przez orkiestratora.
//
// Uzycie: wklej do konsoli karty (albo przez javascript_tool). Po przejsciu karty na inny dokument
// kontekst window sie resetuje: wstrzyknij plik ponownie i wywolaj G.wczytaj(<obiekt z 40-cad/onshape/stan-api.json>),
// zeby przeniesc liczniki, log i sume wywolan. Stan zapisuje sie do pliku w repo (G.zrzut()), nie do localStorage.

// ===================== bramka req() =====================
(() => {
const G = window.G || {};
G.PROG = 20;                       // zasada 1: remaining <= PROG -> wyjatek, bez wysylki
G.BUDZET = { features: 400, total: 260, getFeatures: 8 };   // E2.1 plan: <=252 wywolan, <=5 GET /features (+rezerwa)
G.rem = G.rem || {};               // klucz endpointu -> { remaining: liczba | null, t }
G.log = G.log || [];               // kazde wywolanie i kazda blokada
G.n = G.n || { total: 0, features: 0, getFeatures: 0 };   // wywolania HTTP wyslane w tym zadaniu
G.fetches = G.fetches || 0;        // licznik faktycznych fetch() (dowod w tescie, ze blokada nic nie wyslala)
G.busy = false;
G.stop = G.stop || null;           // 429 / 402 / wyjatek bramki -> stop calej pracy
G.F = G.F || {};                   // nazwa operacji -> featureId
G.mv = G.mv || null;               // ostatni znany sourceMicroversion
G.szkice = G.szkice || [];         // slad kontroli szkicow (punkt 2 "Kontroli szkicu")

const xsrf = () => decodeURIComponent((document.cookie.match(/XSRF-TOKEN=([^;]+)/) || [])[1] || '');
// klucz endpointu: metoda + sciezka bez wersji API i bez identyfikatorow
G.key = (method, url) => {
  const p = new URL(url, location.origin).pathname.replace(/^\/api\/v\d+/, '');
  return method.toUpperCase() + ' ' + p
    .replace(/\/(d|w|v|m|e|featureid|folder|magic)\/[^/]+/g, '/$1/{id}')
    .replace(/\/[0-9a-f]{24}(?=\/|$)/g, '/{id}')
    .replace(/\/partid\/[^/]+/, '/partid/{id}');
};
G.czyFeatures = (k) => /\/features(\/|$)/.test(k);
G.czyGetFeatures = (k) => /^GET .*\/features$/.test(k);
const teraz = () => new Date().toISOString();

G.req = async (method, url, body) => {
  const k = G.key(method, url);
  const blokada = (msg) => {
    G.stop = G.stop || msg;
    G.log.push({ t: teraz(), k, blokada: msg });
    throw new Error('BRAMKA: ' + msg);
  };
  if (G.stop) throw new Error('BRAMKA: stop aktywny (' + G.stop + ')');
  if (G.busy) blokada('drugie zadanie w trakcie (jedno naraz)');
  if (/\/featurescript/.test(url)) blokada('zakaz endpointu /featurescript');
  if (G.n.total >= G.BUDZET.total) blokada(`budzet laczny ${G.BUDZET.total} wyczerpany`);
  if (G.czyFeatures(k) && G.n.features >= G.BUDZET.features) blokada(`budzet /features ${G.BUDZET.features} wyczerpany`);
  if (G.czyGetFeatures(k) && (G.n.getFeatures || 0) >= G.BUDZET.getFeatures) blokada(`budzet GET /features ${G.BUDZET.getFeatures} wyczerpany`);
  if (k in G.rem) {                  // pierwsze wywolanie endpointu = odczyt startowy; dalej sprawdzamy ostatni odczyt
    const r = G.rem[k].remaining;
    if (r === null || r === undefined || Number.isNaN(r)) blokada(`brak X-Rate-Limit-Remaining w poprzedniej odpowiedzi (${k})`);
    if (r <= G.PROG) blokada(`remaining ${r} <= prog ${G.PROG} (${k})`);
  }
  G.busy = true;
  const start = !(k in G.rem);
  let r;
  try {
    G.fetches++;
    r = await fetch(url, { method, credentials: 'include',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrf() },
      body: body === undefined ? undefined : JSON.stringify(body) });
  } catch (e) { G.busy = false; blokada('blad sieci: ' + e.message); }
  G.n.total++; if (G.czyFeatures(k)) G.n.features++; if (G.czyGetFeatures(k)) G.n.getFeatures = (G.n.getFeatures || 0) + 1;
  const h = r.headers.get('X-Rate-Limit-Remaining');
  const remaining = h === null ? null : Number(h);
  G.rem[k] = { remaining, t: teraz() };
  const txt = await r.text();
  let json = null; try { json = JSON.parse(txt); } catch (e) {}
  if (json && json.sourceMicroversion) G.mv = json.sourceMicroversion;
  G.log.push({ t: teraz(), k, method, path: new URL(url, location.origin).pathname, status: r.status, remaining,
    odczytStartowy: start, retryAfter: r.headers.get('Retry-After') });
  G.busy = false;
  if (r.status === 429 || r.status === 402) {
    G.stop = `HTTP ${r.status} (${k}), Retry-After ${r.headers.get('Retry-After')}`;
    throw new Error('STOP: ' + G.stop);
  }
  return { status: r.status, ok: r.ok, remaining, json, text: json ? null : txt.slice(0, 500) };
};

// test progu (bez wywolan API): prog = biezacy remaining endpointu -> musi byc wyjatek i zero fetch()
G.testProgu = async (k, url) => {
  if (!(k in G.rem)) throw new Error('najpierw odczyt startowy ' + k);
  const prog0 = G.PROG, f0 = G.fetches, n0 = G.n.total, rem = G.rem[k].remaining;
  const wynik = { k, remaining: rem, prog: rem };
  G.PROG = rem;
  try { await G.req('GET', url); wynik.wyjatek = false; }
  catch (e) { wynik.wyjatek = true; wynik.komunikat = e.message; }
  wynik.wyslano = G.fetches - f0; wynik.policzono = G.n.total - n0;
  // test braku naglowka: sztucznie null w ostatnim odczycie -> tez wyjatek
  G.PROG = prog0; G.stop = null;
  const zapas = G.rem[k]; G.rem[k] = { remaining: null, t: zapas.t };
  try { await G.req('GET', url); wynik.brakNaglowkaWyjatek = false; }
  catch (e) { wynik.brakNaglowkaWyjatek = true; wynik.brakNaglowkaKomunikat = e.message; }
  wynik.wyslanoRazem = G.fetches - f0;
  G.rem[k] = zapas; G.PROG = prog0; G.stop = null;   // przywrocenie po tescie (blokady testowe nie sa stopem pracy)
  wynik.zaliczony = wynik.wyjatek && wynik.brakNaglowkaWyjatek && wynik.wyslanoRazem === 0;
  G.testBramki = { t: teraz(), ...wynik };
  return G.testBramki;
};

// ===================== znacznik szkicu w drzewie (bez API) =====================
// data-id wiersza NIE jest featureId (test znacznika 19.10): featureId jest w atrybucie feature-id rodzica .os-list-item,
// ktory ma ten sam data-id co etykieta .os-list-item-label. Dopasowanie: feature-id -> data-id -> etykieta.
G.wiersz = (fid) => {
  const it = document.querySelector(`.os-list-item[feature-id="${fid}"]`);
  if (!it) return null;
  const dataId = it.getAttribute('data-id');
  const r = it.querySelector(`.os-list-item-label[data-id="${dataId}"]`);
  if (!r) return { featureId: fid, id: dataId, brakEtykiety: true };
  return { featureId: fid, id: dataId, tytul: r.getAttribute('data-bs-original-title') || null,
    tekst: r.textContent.trim(), szkic: !!r.querySelector('use[*|href*="sketch-button"]'),
    niedookreslony: !!r.querySelector('use[*|href*="underdefined"]') };
};
G.szkiceWDrzewie = () => [...document.querySelectorAll('.os-list-item-label')]
  .filter((r) => r.querySelector('use[*|href*="sketch-button"]'))
  .map((r) => ({ id: r.dataset.id, tytul: r.getAttribute('data-bs-original-title'), niedookreslony: !!r.querySelector('use[*|href*="underdefined"]') }));
// czeka (MutationObserver, nie pauza) az wiersz fid spelni warunek; limit = czas z testu znacznika
G.czekajNaWiersz = (fid, warunek, limitMs) => new Promise((ok, zle) => {
  const t0 = performance.now();
  const sprawdz = () => { const w = G.wiersz(fid); if (warunek(w)) { obs.disconnect(); clearTimeout(tm); ok({ w, ms: Math.round(performance.now() - t0) }); return true; } return false; };
  const obs = new MutationObserver(sprawdz);
  const tm = setTimeout(() => { obs.disconnect(); zle(new Error(`limit ${limitMs} ms: wiersz ${fid} = ${JSON.stringify(G.wiersz(fid))}`)); }, limitMs);
  if (!sprawdz()) obs.observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true });
});

// ===================== zapis szkicu z kontrola znacznika =====================
// kontekst dokumentu (ustawiany po otwarciu Part Studio; eid z URL karty, bez wywolania API)
G.ctx = () => { const m = location.pathname.match(/documents\/([0-9a-f]{24})\/w\/([0-9a-f]{24})\/e\/([0-9a-f]{24})/);
  if (!m) throw new Error('karta nie jest w Part Studio'); return { did: m[1], wid: m[2], eid: m[3] }; };
G.ps = () => { const c = G.ctx(); return `/api/v12/partstudios/d/${c.did}/w/${c.wid}/e/${c.eid}`; };
G.LIMIT_ZNACZNIKA_MS = G.LIMIT_ZNACZNIKA_MS || null;   // ustala test znacznika (punkt 0): 5000 ms (zmierzone <= 349 ms od wysylki); bez niego zapis szkicu jest zablokowany
// zapis operacji (nowa albo edycja jednej operacji po featureId), zawsze z sourceMicroversion i rejectMicroversionSkew
G.zapisz = async (feature) => {
  if (!G.mv) throw new Error('brak sourceMicroversion: najpierw odczyt drzewa');
  const fid = feature.featureId;
  if (fid && !(feature.featureType && feature.name)) throw new Error('edycja bez featureType/name');
  const url = G.ps() + '/features' + (fid ? '/featureid/' + fid : '');
  const r = await G.req('POST', url, { feature, sourceMicroversion: G.mv, rejectMicroversionSkew: true });
  if (!r.ok) throw new Error(`zapis ${feature.name}: HTTP ${r.status} ${JSON.stringify(r.json || r.text).slice(0, 300)}`);
  const f = r.json.feature, st = r.json.featureState && r.json.featureState.featureStatus;
  G.F[f.name] = f.featureId;
  G.log.push({ t: new Date().toISOString(), operacja: f.name, featureId: f.featureId, featureStatus: st });
  if (st !== 'OK') throw new Error(`operacja ${f.name} (${f.featureId}): featureStatus ${st}`);
  return { fid: f.featureId, status: st, mv: r.json.sourceMicroversion, tOdp: performance.now() };
};
// szkic: zapis + odczyt wiersza w drzewie po data-id; niedookreslony / brak wiersza / limit = wyjatek i stop
G.zapiszSzkic = async (feature) => {
  if (!G.LIMIT_ZNACZNIKA_MS) throw new Error('brak testu znacznika (punkt 0) - zapis szkicu zablokowany');
  const z = await G.zapisz(feature);
  let wynik;
  try { wynik = await G.czekajNaWiersz(z.fid, (w) => w && w.szkic && !w.niedookreslony, G.LIMIT_ZNACZNIKA_MS); }
  catch (e) { G.stop = 'kontrola szkicu: ' + e.message; G.szkice.push({ t: new Date().toISOString(), nazwa: feature.name, featureId: z.fid,
    dataId: (G.wiersz(z.fid) || {}).id || null, podpowiedz: (G.wiersz(z.fid) || {}).tytul || null, wynik: 'BLAD', blad: e.message, sourceMicroversion: z.mv }); throw e; }
  const wpis = { t: new Date().toISOString(), nazwa: feature.name, featureId: z.fid, dataId: wynik.w.id, podpowiedz: wynik.w.tytul,
    niedookreslony: false, msOdOdpowiedzi: wynik.ms, featureStatus: z.status, sourceMicroversion: z.mv };
  G.szkice.push(wpis);
  return wpis;
};

// ===================== stan do pliku =====================
G.POLA = ['rem', 'n', 'fetches', 'stop', 'F', 'mv', 'log', 'szkice', 'testBramki', 'testZnacznika', 'LIMIT_ZNACZNIKA_MS', 'doc', 'tmp', 'etap2', 'enums'];
G.zrzut = () => Object.fromEntries(G.POLA.map((k) => [k, G[k] === undefined ? null : G[k]]));
G.wczytaj = (s) => { G.POLA.forEach((k) => { if (s[k] !== undefined) G[k] = s[k]; }); G.busy = false; return G.n; };

window.G = G;
return 'bramka ok, n=' + JSON.stringify(G.n);
})();

// ===================== v2.5: wspolne (E2.1) =====================
(() => {
const G = window.G;
G.etap2 = G.etap2 || {}; G.etap2.czasy = G.etap2.czasy || []; G.etap2.pomiary = G.etap2.pomiary || [];
G.F = G.F || {};
const Q = (s) => ({ btType: 'BTMIndividualQuery-138', queryString: s });
const pq = (id, ...qs) => ({ btType: 'BTMParameterQueryList-148', parameterId: id, queries: qs.map(Q) });
const pn = (id, e, isInteger = false) => ({ btType: 'BTMParameterQuantity-147', parameterId: id, expression: String(e), isInteger });
const pb = (id, v) => ({ btType: 'BTMParameterBoolean-144', parameterId: id, value: v });
const pstr = (id, v) => ({ btType: 'BTMParameterString-149', parameterId: id, value: v });
G.en = (ft, id) => { const e = G.enums && G.enums[ft] && G.enums[ft][id]; if (!e) throw new Error(`brak enumName ${ft}.${id}`); return e; };
const pe = (ft, id, v) => ({ btType: 'BTMParameterEnum-145', parameterId: id, enumName: G.en(ft, id), value: v });
const fid = (n) => { if (!G.F[n]) throw new Error('brak featureId: ' + n); return G.F[n]; };
Object.assign(G, { Q, pq, pn, pb, pstr, pe, fid });
G.q = {
  origin: 'query=qCreatedBy(makeId("Origin"), EntityType.VERTEX);',
  std: (n) => `query=qCreatedBy(makeId("${n}"), EntityType.FACE);`,          // Top / Front / Right
  plane: (n) => `query=qCreatedBy(makeId("${fid(n)}"), EntityType.FACE);`,    // plaszczyzna z cPlane
  body: (n) => `query=qCreatedBy(makeId("${fid(n)}"), EntityType.BODY);`,
  edges: (n) => `query=qCreatedBy(makeId("${fid(n)}"), EntityType.EDGE);`,
  region: (n) => `query=qSketchRegion(makeId("${fid(n)}"), true);`,
  ent: (n, e) => `query=sketchEntityQuery(makeId("${fid(n)}"), EntityType.EDGE, "${e}");`,
  vtx: (n, v) => `query=sketchEntityQuery(makeId("${fid(n)}"), EntityType.VERTEX, "${v}");`,
};
G.osZ = () => G.q.ent('Layout: osie i punkty', 'osZ');
G.TYPY = ['extrude', 'revolve', 'helix', 'sweep', 'booleanBodies', 'circularPattern', 'linearPattern', 'mirror', 'cPlane', 'hole', 'transform', 'chamfer'];
G.wczytajSpecs = async () => {
  const r = await G.req('GET', G.ps() + '/featurespecs');
  if (!r.ok) throw new Error('featurespecs HTTP ' + r.status);
  G.enums = {}; G.specParams = {};
  for (const s of r.json.featureSpecs) {
    if (!G.TYPY.includes(s.featureType)) continue;
    G.enums[s.featureType] = {}; G.specParams[s.featureType] = s.parameters.map((p) => p.parameterId);
    for (const p of s.parameters) if (p.enumName) G.enums[s.featureType][p.parameterId] = p.enumName;
  }
  return { enums: G.enums, params: G.specParams };
};

// ---- drzewo: przewiniecie listy na dol (wiersze sa wirtualizowane) i ikony stanu wiersza ----
G.listaNaDol = () => { let e = document.querySelector('.os-list-item');
  while (e && !(e.scrollHeight > e.clientHeight + 5 && /auto|scroll/.test(getComputedStyle(e).overflowY))) e = e.parentElement;
  if (e) e.scrollTop = e.scrollHeight; return !!e; };
G.ikony = (fid) => { const it = document.querySelector(`.os-list-item[feature-id="${fid}"]`); if (!it) return null;
  return [...it.querySelectorAll('use')].map((u) => (u.getAttribute('href') || u.getAttributeNS('http://www.w3.org/1999/xlink', 'href') || '').replace(/^.*#/, '')); };
G.etykieta = (fid) => { const it = document.querySelector(`.os-list-item[feature-id="${fid}"]`); const l = it && it.querySelector('.os-list-item-label');
  return l ? l.getAttribute('data-bs-original-title') : null; };
// zapis + kontrola: stan z odpowiedzi = OK, wiersz w drzewie, brak ikony ostrzezenia/bledu (lekcja K1 E2.0)
const zapisz0 = G.zapisz;
G.zapiszK = async (feature) => {
  const z = await zapisz0(feature);
  G.listaNaDol();
  try { await G.czekajNaWiersz(z.fid, (w) => !!w, G.LIMIT_ZNACZNIKA_MS); }
  catch (e) { G.stop = 'brak wiersza w drzewie: ' + feature.name; throw e; }
  const ik = G.ikony(z.fid) || [];
  if (ik.some((u) => /warn|error/i.test(u))) { G.stop = `ostrzezenie w drzewie: ${feature.name}: ${G.etykieta(z.fid)}`; throw new Error(G.stop); }
  return z;
};
G.zapisz = G.zapiszK;   // zapiszSzkic tez przez kontrole ikon (wola G.zapisz)

// ---- szkic: wspolrzedne startowe w mm; polozenie z wymiarow #zmienna i wiezow z layoutem; bez Fix ----
const DIR = (v) => ({ btType: 'BTMParameterEnum-145', parameterId: 'direction', enumName: 'DimensionDirection', value: v });
G.Sk = class {
  constructor(name, planeQ) { this.name = name; this.planeQ = planeQ; this.e = []; this.c = []; this.k = 0; }
  con(type, params) { this.c.push({ btType: 'BTMSketchConstraint-2', constraintType: type, entityId: 'k' + this.name.replace(/[^A-Za-z0-9]/g, '').slice(0, 10) + (++this.k), parameters: params }); }
  line(id, a, b, constr = false) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    this.e.push({ btType: 'BTMSketchCurveSegment-155', entityId: id, startPointId: id + '.start', endPointId: id + '.end', startParam: 0, endParam: L / 1000,
      isConstruction: constr, geometry: { btType: 'BTCurveGeometryLine-117', pntX: a[0] / 1000, pntY: a[1] / 1000, dirX: (b[0] - a[0]) / L, dirY: (b[1] - a[1]) / L } });
    return id;
  }
  circle(id, c, d, constr = false) {
    this.e.push({ btType: 'BTMSketchCurve-4', entityId: id, centerId: id + '.center', isConstruction: constr,
      geometry: { btType: 'BTCurveGeometryCircle-115', radius: d / 2000, xCenter: c[0] / 1000, yCenter: c[1] / 1000, xDir: 1, yDir: 0, clockwise: false } });
    return id;
  }
  // luk przeciwnie do wskazowek od kata a0 do a1 (stopnie) wokol c, promien r
  arc(id, c, r, a0, a1, constr = false) {
    this.e.push({ btType: 'BTMSketchCurveSegment-155', entityId: id, startPointId: id + '.start', endPointId: id + '.end', centerId: id + '.center',
      startParam: a0 * Math.PI / 180, endParam: a1 * Math.PI / 180, isConstruction: constr,
      geometry: { btType: 'BTCurveGeometryCircle-115', radius: r / 1000, xCenter: c[0] / 1000, yCenter: c[1] / 1000, xDir: 1, yDir: 0, clockwise: false } });
    return id;
  }
  point(id, p) { this.e.push({ btType: 'BTMSketchPoint-158', entityId: id, isConstruction: false, x: p[0] / 1000, y: p[1] / 1000 }); return id; }
  poly(ids, pts) {
    ids.forEach((id, i) => this.line(id, pts[i], pts[(i + 1) % pts.length]));
    ids.forEach((id, i) => this.co(id + '.end', ids[(i + 1) % ids.length] + '.start'));
  }
  co(a, b) { this.con('COINCIDENT', [pstr('localFirst', a), pstr('localSecond', b)]); }
  coExt(a, q) { this.con('COINCIDENT', [pstr('localFirst', a), pq('externalSecond', q)]); }
  H(l) { this.con('HORIZONTAL', [pstr('localFirst', l)]); }
  V(l) { this.con('VERTICAL', [pstr('localFirst', l)]); }
  H2ext(a, q) { this.con('HORIZONTAL', [pstr('localFirst', a), pq('externalSecond', q)]); }
  V2ext(a, q) { this.con('VERTICAL', [pstr('localFirst', a), pq('externalSecond', q)]); }
  naOrigin(pt) { this.coExt(pt, G.q.origin); }
  dx(pt, expr, ref = G.q.origin) { this.con('DISTANCE', [pstr('localFirst', pt), pq('externalSecond', ref), DIR('HORIZONTAL'), pn('length', expr)]); }
  dy(pt, expr, ref = G.q.origin) { this.con('DISTANCE', [pstr('localFirst', pt), pq('externalSecond', ref), DIR('VERTICAL'), pn('length', expr)]); }
  dExt(pt, q, expr) { this.con('DISTANCE', [pstr('localFirst', pt), pq('externalSecond', q), DIR('MINIMUM'), pn('length', expr)]); }
  dl(l, expr) { this.con('DISTANCE', [pstr('localFirst', l + '.start'), pstr('localSecond', l + '.end'), DIR('MINIMUM'), pn('length', expr)]); }
  dpp(a, b, expr, dir = 'MINIMUM') { this.con('DISTANCE', [pstr('localFirst', a), pstr('localSecond', b), DIR(dir), pn('length', expr)]); }
  fi(c, expr) { this.con('DIAMETER', [pstr('localFirst', c), pn('length', expr)]); }
  ra(c, expr) { this.con('RADIUS', [pstr('localFirst', c), pn('length', expr)]); }
  tan(a, b) { this.con('TANGENT', [pstr('localFirst', a), pstr('localSecond', b)]); }
  eq(a, b) { this.con('EQUAL', [pstr('localFirst', a), pstr('localSecond', b)]); }
  par(a, b) { this.con('PARALLEL', [pstr('localFirst', a), pstr('localSecond', b)]); }
  perp(a, b) { this.con('PERPENDICULAR', [pstr('localFirst', a), pstr('localSecond', b)]); }
  sym(a, b, axis) { this.con('SYMMETRIC', [pstr('localFirst', a), pstr('localSecond', b), pstr('localMirror', axis)]); }
  feature() { return { btType: 'BTMSketch-151', featureType: 'newSketch', name: this.name, parameters: [pq('sketchPlane', this.planeQ)], entities: this.e, constraints: this.c }; }
};
G.op = (name, featureType, parameters) => G.zapisz({ btType: 'BTMFeature-134', featureType, name, parameters });

// ---- operacje ----
G.plOffset = (name, baseQ, expr, opp = false) => G.op(name, 'cPlane', [pq('entities', baseQ), pe('cPlane', 'cplaneType', 'OFFSET'), pn('offset', expr), pb('oppositeDirection', opp)]);
G.plKat = (name, lineQ, planeQ, expr) => G.op(name, 'cPlane', [pq('entities', lineQ, planeQ), pe('cPlane', 'cplaneType', 'LINE_ANGLE'), pn('angle', expr)]);
// o: { op, depth, through, sym, opp, scope: [q], regions: q }
G.ext = (name, sk, o) => { const p = [pe('extrude', 'bodyType', 'SOLID'), pe('extrude', 'operationType', o.op || 'NEW'), pq('entities', o.regions || G.q.region(sk)),
  pe('extrude', 'endBound', o.through ? 'THROUGH_ALL' : 'BLIND'), pb('oppositeDirection', !!o.opp)];
  if (!o.through) p.push(pn('depth', o.depth)); if (o.sym) p.push(pb('symmetric', true));
  if (o.scope) p.push(pb('defaultScope', false), pq('booleanScope', ...o.scope));
  return G.op(name, 'extrude', p); };
// o: { op, axisQ, angle (symetrycznie), scope }
G.rev = (name, regionQ, o) => { const p = [pe('revolve', 'bodyType', 'SOLID'), pe('revolve', 'operationType', o.op || 'NEW'), pq('entities', regionQ), pq('axis', o.axisQ || G.osZ())];
  if (o.angle) p.push(pb('fullRevolve', false), pn('angle', o.angle), pb('symmetric', true)); else p.push(pb('fullRevolve', true), pn('angle', '360 deg'));
  if (o.scope) p.push(pb('defaultScope', false), pq('booleanScope', ...o.scope));
  return G.op(name, 'revolve', p); };
G.helix = (name, circleSk, heightExpr, pitchExpr) => G.op(name, 'helix', [pe('helix', 'axisType', 'CIRCLE'), pq('edge', G.q.edges(circleSk)), pq('entities', G.q.edges(circleSk)),
  pe('helix', 'pathType', 'PITCH'), pe('helix', 'endType', 'HEIGHT'), pn('height', heightExpr), pn('helicalPitch', pitchExpr),
  pe('helix', 'startType', 'START_ANGLE'), pn('startAngle', '0 deg'), pe('helix', 'handedness', 'CW')]);
G.sweep = (name, profSk, path) => G.op(name, 'sweep', [pe('sweep', 'bodyType', 'SOLID'), pe('sweep', 'operationType', 'NEW'),
  pq('profiles', G.q.region(profSk)), pq('path', G.q.edges(path)), pe('sweep', 'profileControl', 'NONE')]);
G.boolean = (name, type, toolQs, targetQs, o = {}) => { const p = [pe('booleanBodies', 'operationType', type), pq('tools', ...toolQs)];
  if (targetQs) p.push(pq('targets', ...targetQs)); if (o.keep) p.push(pb('keepTools', true));
  if (o.offset) p.push(pb('offset', true), pb('offsetAll', true), pn('offsetDistance', o.offset));
  return G.op(name, 'booleanBodies', p); };
G.szyk = (name, featNames, count, angleExpr, o = {}) => { const p = [pe('circularPattern', 'patternType', 'FEATURE'),
  { btType: 'BTMParameterFeatureList-1749', parameterId: 'instanceFunction', featureIds: featNames.map(fid) },
  pq('axis', o.axisQ || G.osZ()), pn('angle', angleExpr), pn('instanceCount', count, true), pb('equalSpace', !!o.equal)];
  return G.op(name, 'circularPattern', p); };
G.mirror = (name, featNames, planeQ) => G.op(name, 'mirror', [pe('mirror', 'patternType', 'FEATURE'),
  { btType: 'BTMParameterFeatureList-1749', parameterId: 'instanceFunction', featureIds: featNames.map(fid) }, pq('mirrorPlane', planeQ)]);

// ---- czas bryly ----
G.bryla = async (nazwa, fn) => { const t0 = new Date(); const ops0 = Object.keys(G.F).length;
  try { await fn(); } finally { G.etap2.czasy.push({ bryla: nazwa, start: t0.toISOString(), koniecSkryptu: new Date().toISOString(), msSkryptu: Date.now() - t0, operacje: Object.keys(G.F).length - ops0, stop: G.stop }); }
  return G.etap2.czasy[G.etap2.czasy.length - 1]; };

// ---- microversion i pomiar ----
G.mvOdswiez = async () => { const c = G.ctx(); const r = await G.req('GET', `/api/v12/documents/d/${c.did}/w/${c.wid}/currentmicroversion`);
  if (!r.ok) throw new Error('currentmicroversion HTTP ' + r.status); G.mv = r.json.microversion; return G.mv; };
const mm = (v) => Math.round(v * 1e6) / 1e3;
G.parsujCiala = (bd) => bd.bodies.map((b) => { const cyl = new Set(), zpl = new Set(), ypl = new Set(), typy = {};
  for (const f of b.faces || []) { const s = f.surface || {}; const t = String(s.type).toLowerCase(); typy[t] = (typy[t] || 0) + 1;
    if (t === 'cylinder') cyl.add(mm(s.radius));
    else if (t === 'plane' && s.normal && Math.abs(Math.abs(s.normal.z) - 1) < 1e-9) zpl.add(mm(s.origin.z));
    else if (t === 'plane' && s.normal && Math.abs(Math.abs(s.normal.y) - 1) < 1e-9) ypl.add(mm(s.origin.y)); }
  return { id: b.id, typ: b.type, sc: (b.faces || []).length, typy, R: [...cyl].sort((a, b) => a - b), z: [...zpl].sort((a, b) => a - b), y: [...ypl].sort((a, b) => a - b) }; });
G.ciala = async () => { const r = await G.req('GET', G.ps() + '/bodydetails'); if (!r.ok) throw new Error('bodydetails HTTP ' + r.status); G._bd = r.json; return G.parsujCiala(r.json); };
G.bbox = async (partId) => { const c = G.ctx(); const r = await G.req('GET', `/api/v12/parts/d/${c.did}/w/${c.wid}/e/${c.eid}/partid/${encodeURIComponent(partId)}/boundingboxes`);
  if (!r.ok) throw new Error('boundingboxes HTTP ' + r.status); const j = r.json; return { x: [mm(j.lowX), mm(j.highX)], y: [mm(j.lowY), mm(j.highY)], z: [mm(j.lowZ), mm(j.highZ)] }; };
G.drzewoUI = () => [...document.querySelectorAll('.os-list-item[feature-id]')].map((it) => { const ind = it.querySelector('.node-indent'); const lab = it.querySelector('.os-list-item-label');
  return { fid: it.getAttribute('feature-id'), tekst: (lab ? lab.textContent : '').trim().slice(0, 50), wciecie: ind ? Math.round(ind.getBoundingClientRect().width) : null }; });
G.pozycjeBryly = (N) => Object.keys(G.F).filter((k) => k.startsWith(N + ':')).map((k) => { const it = document.querySelector(`.os-list-item[feature-id="${G.F[k]}"]`); if (!it) return [k, null];
  const r = it.getBoundingClientRect(); return [k, Math.round((r.top + r.height / 2) * 800 / innerWidth)]; });
// Variable Studio: lista [nazwa, typ, wyrazenie, wartosc liczbowa, opis]; zapis: liczby, potem wyrazenia (pomiar E2.0)
G.VS = '3841c2c5dff187c0b03d76ab';
G.zapiszZmienne = async (V) => { const c = G.ctx(); const url = `/api/v12/variables/d/${c.did}/w/${c.wid}/e/${G.VS}/variables`;
  const jedn = { LENGTH: ' mm', ANGLE: ' deg', NUMBER: '' };
  const r1 = await G.req('POST', url, V.map(([name, type, , v, description]) => ({ name, type, expression: String(v) + jedn[type], description: description || '' })));
  if (!r1.ok) throw new Error('zmienne 1: HTTP ' + r1.status + ' ' + JSON.stringify(r1.json || r1.text).slice(0, 200));
  const r2 = await G.req('POST', url, V.map(([name, type, expression, , description]) => ({ name, type, expression, description: description || '' })));
  if (!r2.ok) throw new Error('zmienne 2: HTTP ' + r2.status + ' ' + JSON.stringify(r2.json || r2.text).slice(0, 200));
  G.etap2.zmienne = { liczba: V.length, t: new Date().toISOString() }; G._V = V; return V.length; };
G._logOd = G._logOd || 0;
G.zrzutK = () => { const out = { n: G.n, mv: G.mv, stop: G.stop, rem: G.rem, F: G.F, szkice: G.szkice, logNowe: G.log.slice(G._logOd), etap2: G.etap2 }; G._logOd = G.log.length; return JSON.stringify(out); };
return 'wspolne v2.5 ok';
})();

// ===================== v2.5: zmienne (Variable Studio "Zmienne v2.5") =====================
// [nazwa, typ, wyrazenie, wartosc liczbowa (zapis 1), opis]; dopisywane czesciami (Layout, Gniazdo, Nakretka, ...)
(() => {
const G = window.G; const L = 'LENGTH', A = 'ANGLE', N = 'NUMBER';
G.ZM = G.ZM || {};
G.ZM.baza = [
 ['rantD', L, '74 mm', 74, 'srednica rantu gniazda'], ['rantR', L, '#rantD / 2', 37, ''], ['rantT', L, '1.5 mm', 1.5, 'grubosc plaskiej czesci rantu i kolnierzyka'],
 ['otworD', L, '63.5 mm', 63.5, 'otwor w dyni (otwornica 2 1/2")'], ['otworR', L, '#otworD / 2', 31.75, ''], ['dyniaR', L, '150 mm', 150, 'promien dyni (dopasowanie rantu)'],
 ['rantSag1', L, '#dyniaR - sqrt(#dyniaR ^ 2 - #rantR ^ 2)', 4.635, 'strzalka dyni na r rantu'], ['rantSag2', L, '#dyniaR - sqrt(#dyniaR ^ 2 - #otworR ^ 2)', 3.399, 'strzalka dyni na r otworu'],
 ['kolnierzykD', L, '41 mm', 41, 'otwor kolnierzyka'], ['kolnierzykR', L, '#kolnierzykD / 2', 20.5, ''],
 ['przodD', L, '63 mm', 63, 'czesc gniazda w otworze dyni'], ['przodR', L, '#przodD / 2', 31.5, ''], ['przodL', L, '15 mm', 15, 'dlugosc czesci gniazda w otworze'],
 ['dociskMin', L, '15 mm', 15, 'najciensza scianka dyni'], ['dociskMax', L, '25 mm', 25, 'najgrubsza scianka dyni'],
 ['nakretkaH', L, '7 mm', 7, 'wysokosc nakretki'], ['gniazdoZapas', L, '4.7 mm', 4.7, 'gwint za nakretka przy dociskMax'],
 ['gniazdoL', L, '#dociskMax + #nakretkaH + #gniazdoZapas', 36.7, 'koniec gwintu'], ['zaczepyL', L, '9 mm', 9, 'strefa zaczepow za gwintem'],
 ['gniazdoKoniec', L, '#gniazdoL + #zaczepyL', 45.7, 'dlugosc gniazda'], ['fazkaRantu', L, '1 mm', 1, 'fazka krawedzi rantu'], ['fazkaCzola', L, '0.6 mm', 0.6, 'fazka czola kasety i otworu gniazda'],
 ['modulID', L, '48.5 mm', 48.5, 'wnetrze kasety'], ['kasetaT', L, '3 mm', 3, 'scianka kasety'], ['kasetaOD', L, '#modulID + 2 * #kasetaT', 54.5, 'zewnatrz kasety'],
 ['luzKaseta', L, '0.25 mm', 0.25, 'luz kaseta-gniazdo (wsuwanie)'], ['gniazdoID', L, '#kasetaOD + 2 * #luzKaseta', 55, 'otwor gniazda'], ['gniazdoIDR', L, '#gniazdoID / 2', 27.5, ''],
 ['modulL', L, '76 mm', 76, 'dlugosc kasety'], ['zapas', L, '1 mm', 1, 'wyjscie narzedzi poza bryle'], ['osZL', L, '#rantT + #modulL + 2 * #zapas', 79.5, 'dlugosc osi Z w layoucie'],
 ['oczkoZ', L, '12 mm', 12, 'os oka: z'], ['cX', L, '7.382 mm', 7.382, 'przegub C: x'], ['cZ', L, '36.147 mm', 36.147, 'przegub C: z'], ['hX', L, '9.235 mm', 9.235, 'przegub H: -x'], ['hZ', L, '40.628 mm', 40.628, 'przegub H: z'], ['orczykZ', L, '66 mm', 66, 'os orczyka SG90: z'],
];
G.ZM.gniazdo = [
 ['zabekR1', L, '33.75 mm', 33.75, 'zabek: r wewn.'], ['zabekR2', L, '35 mm', 35, 'zabek: r zewn.'], ['zabekZ', L, '5.1 mm', 5.1, 'zabek: dol'], ['zabekKat', A, '1.666 deg', 1.666, 'zabek: szerokosc katowa'], ['zabkiN', N, '8', 8, 'liczba zabkow'],
 ['gwintSkok', L, '5 mm', 5, 'skok gwintu 45'], ['gwintH', L, '2 mm', 2, 'wysokosc zarysu'], ['gwintCzolo', L, '0.8 mm', 0.8, 'czolo zeba osiowo'], ['gwintKat', A, '45 deg', 45, 'kat flanki'], ['gwintZakladka', L, '0.4 mm', 0.4, 'wejscie zarysu w rdzen'],
 ['gwintPodstawa', L, '#gwintCzolo + 2 * #gwintH * tan(#gwintKat)', 4.8, ''], ['gwintPolPodstawy', L, '#gwintPodstawa / 2', 2.4, ''], ['gwintPolCzola', L, '#gwintCzolo / 2', 0.4, ''],
 ['gwintRdzenD', L, '58.9 mm', 58.9, 'rdzen gwintu = rura gniazda'], ['gwintRdzenR', L, '#gwintRdzenD / 2', 29.45, ''], ['gwintD', L, '#gwintRdzenD + 2 * #gwintH', 62.9, ''], ['gwintR', L, '#gwintD / 2', 31.45, ''],
 ['gwintWewR', L, '#gwintRdzenR - #gwintZakladka', 29.05, ''], ['przycieciaR', L, '#gwintR + #zapas', 32.45, ''],
 ['helisaZ', L, '#gniazdoL + #gwintSkok', 41.7, 'poczatek helisy (z)'], ['helisaH', L, '#helisaZ - #przodL + #gwintSkok', 31.7, 'wysokosc helisy'],
 ['fazaZwoju', L, '1 mm', 1, 'faza poczatku zwoju (od strony nakrecania)'], ['fazaKat', A, '45 deg', 45, ''],
 ['trimZ1', L, '#gniazdoL - #fazaZwoju + #gwintH * tan(#fazaKat)', 37.7, 'faza zwoju na rdzeniu'], ['trimZ2', L, '#gniazdoL - #fazaZwoju - #zapas * tan(#fazaKat)', 34.7, 'faza zwoju na r przyciecia'],
 ['luzGwint', L, '0.3 mm', 0.3, 'luz gwintu nakretki (po probce E2.0)'],
 ['haczykKat', A, '47 deg', 47, 'haczyki i okienka 47/227'], ['okienkoR1', L, '26.5 mm', 26.5, ''], ['okienkoR2', L, '31 mm', 31, ''], ['okienkoZ1', L, '38.2 mm', 38.2, ''], ['okienkoZ2', L, '42.2 mm', 42.2, ''], ['okienkoSzer', L, '7 mm', 7, ''],
 ['zebroKat', A, '135 deg', 135, 'zebro / rowek'], ['zebroKatOs', A, '#zebroKat - 90 deg', 45, 'plaszczyzna prostopadla do promienia zebra'], ['zebroSzer', L, '4 mm', 4, ''], ['zebroPolSzer', L, '#zebroSzer / 2', 2, ''],
 ['zebroWys', L, '0.9 mm', 0.9, 'wysokosc zebra w otworze'], ['zebroZakladka', L, '0.4 mm', 0.4, ''], ['zebroR', L, '#gniazdoIDR - #zebroWys', 26.6, ''], ['zebroH', L, '#zebroWys + #zebroZakladka', 1.3, ''],
 ['zebroZ1', L, '38.7 mm', 38.7, ''], ['zebroZapas', L, '0.3 mm', 0.3, ''], ['zebroZ2', L, '#gniazdoKoniec - #zebroZapas', 45.4, ''], ['fazkaWej', L, '0.8 mm', 0.8, 'fazki wejsciowe zebra i rowka'],
 ['zebroFazaZ', L, '#zebroZ2 - 2 * #fazkaWej', 43.8, ''], ['zebroPolSzerFaza', L, '#zebroPolSzer - #fazkaWej', 1.2, ''],
 ['strzalkaY', L, '35.2 mm', 35.2, 'strzalka GORA: wierzcholek'], ['strzalkaH', L, '3.8 mm', 3.8, ''], ['strzalkaPolSzer', L, '2.2 mm', 2.2, ''], ['strzalkaGl', L, '0.5 mm', 0.5, ''], ['strzalkaY2', L, '#strzalkaY - #strzalkaH', 31.4, ''],
];
G.ZM.nakretka = [
 ['nakretkaD', L, '74 mm', 74, ''], ['nakretkaR', L, '#nakretkaD / 2', 37, ''], ['nakretkaZ', L, '24 mm', 24, 'czolo nakretki (z)'], ['nakretkaTylZ', L, '#nakretkaZ + #nakretkaH', 31, ''],
 ['nakretkaFaza', L, '1 mm', 1, 'fazy otworu'], ['nakretkaOtworR', L, '#gwintRdzenR + #luzGwint', 29.75, ''], ['nakretkaZewR', L, '#nakretkaR + #zapas', 38, ''],
 ['nakretkaCzoloR', L, '130 mm', 130, 'czolo pod dynie (wewn. powierzchnia)'], ['nakretkaCzoloSpad', L, 'sqrt(#nakretkaCzoloR ^ 2 - #nakretkaOtworR ^ 2) - sqrt(#nakretkaCzoloR ^ 2 - #nakretkaZewR ^ 2)', 2.18, ''],
 ['kluczN', N, '6', 6, ''], ['kluczSzer', L, '4 mm', 4, ''], ['kluczPolSzer', L, '#kluczSzer / 2', 2, ''], ['kluczR1', L, '33.2 mm', 33.2, ''], ['kluczH', L, '2.6 mm', 2.6, ''],
 ['radelkoN', N, '24', 24, 'radelko jak v2.2'], ['radelkoSzer', L, '1.4 mm', 1.4, ''], ['radelkoPolSzer', L, '#radelkoSzer / 2', 0.7, ''], ['radelkoGl', L, '0.6 mm', 0.6, ''], ['radelkoR1', L, '#nakretkaR - #radelkoGl', 36.4, ''],
];
return 'zmienne zdefiniowane';
})();

// ===================== v2.5: Layout i Gniazdo =====================
(() => {
const G = window.G;
G.layout = () => G.bryla('Layout', async () => {
  const s = new G.Sk('Layout: osie i punkty', G.q.std('Front'));
  s.line('osZ', [0, 0], [0, -79.5], true); s.naOrigin('osZ.start'); s.V('osZ'); s.dl('osZ', '#osZL');
  s.line('lOko', [0, -12], [0, -66], true); s.co('lOko.start', 'osZ'); s.co('lOko.end', 'osZ'); s.dy('lOko.start', '#oczkoZ'); s.dy('lOko.end', '#orczykZ');
  s.line('lCH', [7.382, -36.147], [-9.235, -40.628], true); s.dx('lCH.start', '#cX'); s.dy('lCH.start', '#cZ'); s.dx('lCH.end', '#hX'); s.dy('lCH.end', '#hZ');
  await G.zapiszSzkic(s.feature());
});
// etap A: korpus, zabki, gwint 45 (zwoj, UNION, przyciecie z faza)
G.gniazdoA = () => G.bryla('Gniazdo A', async () => {
  const p = new G.Sk('Gniazdo: profil', G.q.std('Front'));
  const ids = ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10', 'g11', 'g12', 'g13'];
  p.poly(ids, [[20.5, 0], [36, 0], [37, -1], [37, -4.635], [31.75, -3.399], [31.5, -3.399], [31.5, -15], [29.45, -15], [29.45, -45.7], [28.1, -45.7], [27.5, -45.1], [27.5, -1.5], [20.5, -1.5]]);
  p.H('g1'); p.V('g3'); p.H('g5'); p.V('g6'); p.H('g7'); p.V('g8'); p.H('g9'); p.V('g11'); p.H('g12'); p.V('g13');
  p.coExt('g1.start', G.q.std('Top'));
  p.dx('g1.start', '#kolnierzykR'); p.dx('g2.start', '#rantR - #fazkaRantu'); p.dx('g3.start', '#rantR'); p.dy('g3.start', '#fazkaRantu');
  p.dy('g4.start', '#rantSag1'); p.dx('g5.start', '#otworR'); p.dy('g5.start', '#rantSag2'); p.dx('g6.start', '#przodR'); p.dy('g7.start', '#przodL');
  p.dx('g8.start', '#gwintRdzenR'); p.dy('g9.start', '#gniazdoKoniec'); p.dx('g10.start', '#gniazdoIDR + #fazkaCzola'); p.dx('g11.start', '#gniazdoIDR');
  p.dy('g11.start', '#gniazdoKoniec - #fazkaCzola'); p.dy('g12.start', '#rantT');
  await G.zapiszSzkic(p.feature());
  await G.rev('Gniazdo: korpus', G.q.region('Gniazdo: profil'), { op: 'NEW' });
  const z = new G.Sk('Gniazdo: ząbek', G.q.std('Front'));
  z.poly(['zD', 'zP', 'zG', 'zL'], [[33.75, -5.1], [35, -5.1], [35, -1.5], [33.75, -1.5]]); z.H('zD'); z.V('zP'); z.H('zG'); z.V('zL');
  z.dx('zD.start', '#zabekR1'); z.dx('zP.start', '#zabekR2'); z.dy('zD.start', '#zabekZ'); z.dy('zG.start', '#rantT');
  await G.zapiszSzkic(z.feature());
  await G.rev('Gniazdo: ząbek', G.q.region('Gniazdo: ząbek'), { op: 'ADD', angle: '#zabekKat', scope: [G.q.body('Gniazdo: korpus')] });
  await G.szyk('Gniazdo: ząbki', ['Gniazdo: ząbek'], '#zabkiN', '360 deg', { equal: true });
  await G.plOffset('Gniazdo: pl. początku helisy', G.q.std('Top'), '#helisaZ', true);
  const c = new G.Sk('Gniazdo: okrąg helisy', G.q.plane('Gniazdo: pl. początku helisy'));
  c.circle('cH', [0, 0], 58.9); c.naOrigin('cH.center'); c.fi('cH', '#gwintRdzenD');
  await G.zapiszSzkic(c.feature());
  await G.helix('Gniazdo: helisa', 'Gniazdo: okrąg helisy', '#helisaH', '#gwintSkok');
  const t = new G.Sk('Gniazdo: profil gwintu', G.q.std('Front'));
  t.poly(['pAB', 'pBC', 'pCD', 'pDE', 'pEF', 'pFA'], [[29.05, -44.1], [29.45, -44.1], [31.45, -42.1], [31.45, -41.3], [29.45, -39.3], [29.05, -39.3]]);
  t.H('pAB'); t.V('pCD'); t.H('pEF'); t.V('pFA');
  t.dx('pAB.start', '#gwintWewR'); t.dy('pAB.start', '#helisaZ + #gwintPolPodstawy'); t.dx('pBC.start', '#gwintRdzenR');
  t.dx('pCD.start', '#gwintR'); t.dy('pCD.start', '#helisaZ + #gwintPolCzola'); t.dy('pDE.start', '#helisaZ - #gwintPolCzola');
  t.dx('pEF.start', '#gwintRdzenR'); t.dy('pEF.start', '#helisaZ - #gwintPolPodstawy');
  await G.zapiszSzkic(t.feature());
  await G.sweep('Gniazdo: zwój gwintu', 'Gniazdo: profil gwintu', 'Gniazdo: helisa');
  await G.boolean('Gniazdo: gwint', 'UNION', [G.q.body('Gniazdo: korpus'), G.q.body('Gniazdo: zwój gwintu')]);
  const k = new G.Sk('Gniazdo: przycięcie końca zwoju', G.q.std('Front'));
  k.poly(['kF', 'kP', 'kD', 'kL'], [[29.45, -37.7], [32.45, -34.7], [32.45, -45.7], [29.45, -45.7]]); k.V('kP'); k.H('kD'); k.V('kL');
  k.dx('kF.start', '#gwintRdzenR'); k.dy('kF.start', '#trimZ1'); k.dx('kP.start', '#przycieciaR'); k.dy('kP.start', '#trimZ2'); k.dy('kD.start', '#gniazdoKoniec');
  await G.zapiszSzkic(k.feature());
  await G.rev('Gniazdo: przycięcie końca zwoju i faza', G.q.region('Gniazdo: przycięcie końca zwoju'), { op: 'REMOVE', scope: [G.q.body('Gniazdo: korpus')] });
});
return 'layout, gniazdoA ok';
})();

// ===================== v2.5: Gniazdo etap B (okienka, zebro, strzalka) =====================
// LINE_ANGLE: os x szkicu ma azymut 180 deg - kat, os y = +Z (pomiar 19.10); stad kat '180 deg - #haczykKat'
(() => {
const G = window.G;
G.Sk.prototype.parExt = function (l, q) { this.con('PARALLEL', [G.pstr('localFirst', l), G.pq('externalSecond', q)]); };
G.Sk.prototype.perpExt = function (l, q) { this.con('PERPENDICULAR', [G.pstr('localFirst', l), G.pq('externalSecond', q)]); };
G.ZM.gniazdo.push(['zebroRsrodek', 'LENGTH', '#zebroR + #zebroH / 2', 27.25, 'plaszczyzna styczna w srodku zebra']);
G.ZM.gniazdo.push(['zebroKatPl', 'ANGLE', '180 deg - #zebroKatOs', 135, 'kat LINE_ANGLE: os x szkicu na azymucie zebroKatOs (45)']);
G.gniazdoOkienko = () => G.bryla('Gniazdo B1 okienko', async () => {
  await G.plKat('Gniazdo: pl. zaczepów', G.osZ(), G.q.std('Front'), '180 deg - #haczykKat');
  const s = new G.Sk('Gniazdo: okienko szkic', G.q.plane('Gniazdo: pl. zaczepów'));
  s.poly(['oD', 'oZ', 'oG', 'oW'], [[26.5, -42.2], [31, -42.2], [31, -38.2], [26.5, -38.2]]);
  s.parExt('oZ', G.osZ()); s.parExt('oW', G.osZ()); s.perp('oD', 'oZ'); s.perp('oG', 'oZ');
  s.dExt('oD.start', G.osZ(), '#okienkoR1'); s.dExt('oZ.start', G.osZ(), '#okienkoR2'); s.dExt('oD.start', G.q.std('Top'), '#okienkoZ2'); s.dExt('oG.start', G.q.std('Top'), '#okienkoZ1');
  await G.zapiszSzkic(s.feature());
  await G.ext('Gniazdo: okienko', 'Gniazdo: okienko szkic', { op: 'REMOVE', depth: '#okienkoSzer', sym: true, scope: [G.q.body('Gniazdo: korpus')] });
});
G.gniazdoB = () => G.bryla('Gniazdo B2', async () => {
  await G.szyk('Gniazdo: okienka', ['Gniazdo: okienko'], '2', '360 deg', { equal: true });
  await G.plKat('Gniazdo: pl. prostopadła do żebra', G.osZ(), G.q.std('Front'), '#zebroKatPl');
  await G.plOffset('Gniazdo: pl. styczna żebra', G.q.plane('Gniazdo: pl. prostopadła do żebra'), '#zebroRsrodek', true);
  const s = new G.Sk('Gniazdo: żebro szkic', G.q.plane('Gniazdo: pl. styczna żebra'));
  s.poly(['e1', 'e2', 'e3', 'e4', 'e5', 'e6'], [[-2, -38.7], [2, -38.7], [2, -43.8], [1.2, -45.4], [-1.2, -45.4], [-2, -43.8]]);
  s.H('e1'); s.V('e2'); s.H('e4'); s.V('e6');
  s.dx('e1.start', '#zebroPolSzer'); s.dx('e2.start', '#zebroPolSzer'); s.dy('e1.start', '#zebroZ1'); s.dy('e3.start', '#zebroFazaZ');
  s.dx('e4.start', '#zebroPolSzerFaza'); s.dy('e4.start', '#zebroZ2'); s.dx('e5.start', '#zebroPolSzerFaza'); s.dy('e6.start', '#zebroFazaZ');
  await G.zapiszSzkic(s.feature());
  await G.ext('Gniazdo: żebro', 'Gniazdo: żebro szkic', { op: 'ADD', depth: '#zebroH', sym: true, scope: [G.q.body('Gniazdo: korpus')] });
  const a = new G.Sk('Gniazdo: strzałka GÓRA szkic', G.q.std('Top'));
  a.poly(['a1', 'a2', 'a3'], [[0, 35.2], [-2.2, 31.4], [2.2, 31.4]]); a.H('a2');
  a.coExt('a1.start', G.q.std('Right')); a.dy('a1.start', '#strzalkaY'); a.dy('a2.start', '#strzalkaY2'); a.dx('a2.start', '#strzalkaPolSzer'); a.dx('a3.start', '#strzalkaPolSzer');
  await G.zapiszSzkic(a.feature());
  await G.ext('Gniazdo: strzałka GÓRA', 'Gniazdo: strzałka GÓRA szkic', { op: 'REMOVE', depth: '#strzalkaGl', opp: true, scope: [G.q.body('Gniazdo: korpus')] });
});
return 'gniazdo B ok';
})();
