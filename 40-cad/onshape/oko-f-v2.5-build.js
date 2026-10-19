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

// ===================== v2.5: Nakretka =====================
(() => {
const G = window.G;
G.nakretka = () => G.bryla('Nakrętka', async () => {
  const s = new G.Sk('Nakrętka: przekrój', G.q.std('Front'));
  s.poly(['n1', 'n2', 'n3', 'n4', 'n5', 'n6'], [[30.75, -24], [37, -24], [37, -31], [30.75, -31], [29.75, -30], [29.75, -25]]);
  s.H('n1'); s.V('n2'); s.H('n3'); s.V('n5');
  s.dy('n1.start', '#nakretkaZ'); s.dx('n2.start', '#nakretkaR'); s.dy('n3.start', '#nakretkaTylZ');
  s.dx('n1.start', '#nakretkaOtworR + #nakretkaFaza'); s.dx('n4.start', '#nakretkaOtworR + #nakretkaFaza');
  s.dx('n5.start', '#nakretkaOtworR'); s.dy('n5.start', '#nakretkaTylZ - #nakretkaFaza'); s.dy('n6.start', '#nakretkaZ + #nakretkaFaza');
  await G.zapiszSzkic(s.feature());
  await G.rev('Nakrętka: korpus', G.q.region('Nakrętka: przekrój'), { op: 'NEW' });
  const c = new G.Sk('Nakrętka: czoło szkic', G.q.std('Front'));
  c.poly(['c1', 'c2', 'c3'], [[29.75, -24], [38, -24], [38, -26.2]]); c.H('c1'); c.V('c2');
  c.dx('c1.start', '#nakretkaOtworR'); c.dy('c1.start', '#nakretkaZ'); c.dx('c2.start', '#nakretkaZewR'); c.dy('c3.start', '#nakretkaZ + #nakretkaCzoloSpad');
  await G.zapiszSzkic(c.feature());
  await G.rev('Nakrętka: czoło pod dynię', G.q.region('Nakrętka: czoło szkic'), { op: 'REMOVE', scope: [G.q.body('Nakrętka: korpus')] });
  await G.plOffset('Nakrętka: pl. tyłu', G.q.std('Top'), '#nakretkaTylZ', true);
  const r = new G.Sk('Nakrętka: radełko szkic', G.q.plane('Nakrętka: pl. tyłu'));
  r.poly(['r1', 'r2', 'r3', 'r4'], [[36.4, -0.7], [38, -0.7], [38, 0.7], [36.4, 0.7]]); r.H('r1'); r.V('r2'); r.H('r3'); r.V('r4');
  r.dx('r1.start', '#radelkoR1'); r.dx('r2.start', '#nakretkaZewR'); r.dy('r1.start', '#radelkoPolSzer'); r.dy('r3.start', '#radelkoPolSzer');
  await G.zapiszSzkic(r.feature());
  await G.ext('Nakrętka: rowek radełka', 'Nakrętka: radełko szkic', { op: 'REMOVE', depth: '#nakretkaH', scope: [G.q.body('Nakrętka: korpus')] });
  await G.szyk('Nakrętka: radełko', ['Nakrętka: rowek radełka'], '#radelkoN', '360 deg', { equal: true });
  const k = new G.Sk('Nakrętka: klucz szkic', G.q.plane('Nakrętka: pl. tyłu'));
  k.poly(['k1', 'k2', 'k3', 'k4'], [[33.2, -2], [38, -2], [38, 2], [33.2, 2]]); k.H('k1'); k.V('k2'); k.H('k3'); k.V('k4');
  k.dx('k1.start', '#kluczR1'); k.dx('k2.start', '#nakretkaZewR'); k.dy('k1.start', '#kluczPolSzer'); k.dy('k3.start', '#kluczPolSzer');
  await G.zapiszSzkic(k.feature());
  await G.ext('Nakrętka: wycięcie na klucz', 'Nakrętka: klucz szkic', { op: 'REMOVE', depth: '#kluczH', scope: [G.q.body('Nakrętka: korpus')] });
  await G.szyk('Nakrętka: wycięcia na klucz', ['Nakrętka: wycięcie na klucz'], '#kluczN', '360 deg', { equal: true });
  await G.sweep('Nakrętka: narzędzie gwintu', 'Gniazdo: profil gwintu', 'Gniazdo: helisa');
  await G.boolean('Nakrętka: gwint', 'SUBTRACTION', [G.q.body('Nakrętka: narzędzie gwintu')], [G.q.body('Nakrętka: korpus')], { offset: '#luzGwint' });
});
return 'nakretka ok';
})();

// ===================== v2.5: Kaseta – zmienne =====================
// Uklady szkicow (pomiary 19.10): Front i plaszczyzny offset od Front: x = X, y = Z, normalna -Y (offset dodatni -> y ujemne);
// LINE_ANGLE przez osZ: x = promien na azymucie (180 deg - kat), y = Z; Top i offset od Top: x = X, y = Y, normalna +Z.
(() => {
const G = window.G; const L = 'LENGTH', A = 'ANGLE', N = 'NUMBER';
G.ZM.kaseta = [
 ['kasetaIDR', L, '#modulID / 2', 24.25, ''], ['kasetaODR', L, '#kasetaOD / 2', 27.25, ''], ['kasetaTylZ', L, '#rantT + #modulL', 77.5, 'tyl kasety (z)'],
 ['kulaDmax', L, '40.5 mm', 40.5, 'najwieksza pileczka'], ['klej', L, '0.5 mm', 0.5, 'szczelina na klej'], ['oczkoT', L, '2.4 mm', 2.4, 'grubosc oczka jarzma'], ['luzOsiowy', L, '0.3 mm', 0.3, 'luz osiowy oczko-wystep'],
 ['wystepY', L, '#kulaDmax / 2 + #klej + #oczkoT + #luzOsiowy', 23.45, 'czolo wystepu osi (y)'], ['wystepR', L, '9.6 mm', 9.6, 'promien kropli wystepu'], ['wystepKat', A, '45 deg', 45, 'kat stycznych kropli'],
 ['wystepTx', L, '#wystepR * sin(#wystepKat)', 6.788, ''], ['wystepOgon', L, '1.6 mm', 1.6, 'wierzcholek kropli (z)'], ['wystepH', L, '2.05 mm', 2.05, 'grubosc wystepu do scianki'],
 ['kolekD', L, '2.6 mm', 2.6, 'kolek ogranicznika'], ['kolekR', L, '6.7 mm', 6.7, 'promien kolka od osi oka'], ['luzStop', L, '0.3 mm', 0.3, 'luz kolka w szczelinie'], ['stopKat', A, '33 deg', 33, 'ogranicznik +-33'],
 ['szczelinaR1', L, '#kolekR - #kolekD / 2 - #luzStop', 5.1, ''], ['szczelinaR2', L, '#kolekR + #kolekD / 2 + #luzStop', 8.3, ''], ['szczelinaKat', A, '#stopKat + asin(#kolekD / 2 / #kolekR)', 44.19, 'kat konca szczeliny'],
 ['szczelinaX1', L, '#szczelinaR1 * sin(#szczelinaKat)', 3.555, ''], ['szczelinaX2', L, '#szczelinaR2 * sin(#szczelinaKat)', 5.785, ''], ['szczelinaStopGl', L, '6 mm', 6, ''],
 ['kanalPolSzer', L, '#kolekD / 2 + #luzStop', 1.6, ''], ['kanalZ1', L, '17.9 mm', 17.9, 'poczatek kanalu kolka (z)'], ['kanalZ2', L, '#kasetaTylZ + #zapas', 78.5, ''], ['kanalGl', L, '1.6 mm', 1.6, ''],
 ['otworOsiY', L, '28 mm', 28, 'plaszczyzna otworow osi (y)'], ['lebD', L, '6.2 mm', 6.2, 'pogl. pod leb ISO 7380 M3'], ['lebH', L, '1.7 mm', 1.7, ''], ['m3Ciasny', L, '2.6 mm', 2.6, ''], ['m3Luzny', L, '3.3 mm', 3.3, ''],
 ['otworOsiGl', L, '6.75 mm', 6.75, 'otwor osi od pl. 28 do wystepu'], ['lebGl', L, '#lebH + #otworOsiY - #kasetaODR', 2.45, 'poglebienie od pl. 28'],
 ['sg90Szer', L, '12.2 mm', 12.2, 'SG90 szerokosc (producent)'], ['luzSanki', L, '0.25 mm', 0.25, ''], ['szczelinaSG90', L, '#sg90Szer + 2 * #luzSanki', 12.7, 'szczelina SG90 w sankach'],
 ['szczelinaSerwaPolSzer', L, '#szczelinaSG90 / 2 + #luzSanki', 6.6, 'okno SG90 w kasecie (pol)'], ['szczelinaSerwaY', L, '20 mm', 20, ''], ['szczelinaSerwaZ', L, '49.2 mm', 49.2, ''], ['szczelinaSerwaGl', L, '20 mm', 20, ''],
 ['otworDolnyD', L, '8.7 mm', 8.7, 'otwory dolne C i H'], ['otworDolnyY', L, '28 mm', 28, ''], ['otworDolnyGl', L, '8.25 mm', 8.25, 'do y -19.75'],
 ['m2X', L, '4.446 mm', 4.446, 'wkret M2 orczyka: -x'], ['m2Z', L, '53.784 mm', 53.784, 'wkret M2 orczyka: z'], ['otworGornyR', L, '4.5 mm', 4.5, ''], ['otworGornyGl', L, '6.75 mm', 6.75, ''],
 ['wybranieCY', L, '0.6 mm', 0.6, ''], ['wybranieCGl', L, '4.2 mm', 4.2, ''], ['wybranieCR1', L, '21.5 mm', 21.5, ''], ['wybranieCR2', L, '24.8 mm', 24.8, ''], ['wybranieCZ1', L, '22.4 mm', 22.4, ''], ['wybranieCZ2', L, '35 mm', 35, ''],
 ['wybranieCZs', L, '#wybranieCZ2 - #wybranieCR2 + #wybranieCR1', 31.7, ''],
 ['luzRowek', L, '0.3 mm', 0.3, 'luz rowka na strone'], ['luzRowekR', L, '0.35 mm', 0.35, 'luz rowka promieniowo'], ['rowekR1', L, '#zebroR - #luzRowekR', 26.25, ''], ['rowekR2', L, '#kasetaODR + #zapas', 28.25, ''],
 ['rowekZ1', L, '#rantT - #zapas', 0.5, ''], ['rowekZ2', L, '#gniazdoKoniec + #zapas', 46.7, ''], ['rowekSzer', L, '#zebroSzer + 2 * #luzRowek', 4.6, ''], ['rowekKatPl', A, '180 deg - #zebroKat', 45, ''],
 ['rowekFazaR', L, '26.85 mm', 26.85, ''], ['rowekFazaGl', L, '1.4 mm', 1.4, ''], ['rowekFazaX1', L, '2.2 mm', 2.2, ''], ['rowekFazaW', L, '0.9 mm', 0.9, ''], ['rowekFazaZ1', L, '1.4 mm', 1.4, ''], ['rowekFazaL', L, '1.7 mm', 1.7, ''],
 ['rowekFazaX2', L, '#rowekFazaX1 + #rowekFazaW', 3.1, ''], ['rowekFazaZ2', L, '#rowekFazaZ1 + #rowekFazaL', 3.1, ''],
 ['uchoKat', A, '40 deg', 40, 'ucha pokrywy 40/140'], ['uchoKatPl', A, '180 deg - #uchoKat', 140, ''], ['uchoR1', L, '26.5 mm', 26.5, ''], ['uchoR2', L, '33.5 mm', 33.5, ''], ['uchoR3', L, '27.2 mm', 27.2, ''],
 ['uchoZ1', L, '64.7 mm', 64.7, ''], ['uchoZ2', L, '71 mm', 71, ''], ['uchoSzer', L, '8 mm', 8, ''], ['uchoR', L, '29.5 mm', 29.5, 'os wkladki ucha'], ['uchoX', L, '#uchoR * cos(#uchoKat)', 22.598, ''], ['uchoY', L, '#uchoR * sin(#uchoKat)', 18.962, ''],
 ['wkladkaD', L, '4 mm', 4, ''], ['wkladkaL', L, '4 mm', 4, ''], ['uchoDno', L, '1.6 mm', 1.6, ''], ['wkladkaZapas', L, '0.6 mm', 0.6, ''],
 ['zaczepZ', L, '36.6 mm', 36.6, ''], ['zaczepL', L, '7.7 mm', 7.7, ''], ['zaczepR1', L, '23.5 mm', 23.5, ''], ['zaczepR2', L, '28 mm', 28, ''], ['zaczepKoniecKat1', A, '50 deg', 50, ''], ['zaczepKoniecKat2', A, '52.5 deg', 52.5, ''],
 ['zaczepCienZ', L, '36.7 mm', 36.7, ''], ['zaczepCienL', L, '7.55 mm', 7.55, ''], ['zaczepCienR', L, '25.2 mm', 25.2, ''], ['zaczepCienKat1', A, '19 deg', 19, ''], ['zaczepCienKat2', A, '50.5 deg', 50.5, ''],
 ['zaczepSkosKat', A, '34.2 deg', 34.2, ''], ['zaczepSkosKatPl', A, '180 deg - #zaczepSkosKat', 145.8, ''], ['zaczepSkosRozw', A, '36.4 deg', 36.4, ''], ['skosR1', L, '23.9 mm', 23.9, ''], ['skosR2', L, '28.2 mm', 28.2, ''],
 ['skosZ1', L, '40.75 mm', 40.75, ''], ['skosW', L, '1.131 mm', 1.131, ''], ['skosZ2', L, '#skosZ1 - #skosR2 + #skosR1', 36.45, ''], ['skosZ3', L, '#skosZ2 - #skosW', 35.319, ''], ['skosZ4', L, '#skosZ1 - #skosW', 39.619, ''],
 ['zaczepTylZ', L, '43.4 mm', 43.4, ''], ['zaczepTylGl', L, '0.8 mm', 0.8, ''], ['zaczepTylKat1', A, '16 deg', 16, ''], ['zaczepTylKat2', A, '52.4 deg', 52.4, ''],
 ['haczykR1', L, '26.75 mm', 26.75, ''], ['haczykR2', L, '28.25 mm', 28.25, ''], ['haczykZ1', L, '38 mm', 38, ''], ['haczykZ2', L, '42 mm', 42, ''], ['haczykNajazdZ', L, '39.05 mm', 39.05, ''], ['haczykSzer', L, '2.8 mm', 2.8, ''],
 ['hKat', A, '178 deg', 178, 'kierunek przegubu H'], ['hKatPl', A, '180 deg - #hKat', 2, ''], ['pogrubienieHKat', A, '40 deg', 40, ''], ['pgR1', L, '27 mm', 27, ''], ['pgR2', L, '27.2 mm', 27.2, ''], ['pgR3', L, '29.6 mm', 29.6, ''],
 ['pgZ1', L, '46.5 mm', 46.5, 'pogrubienie H od z'], ['pgZ2', L, '#pgZ1 + #pgR3 - #pgR2', 48.9, ''], ['pgZ3', L, '57 mm', 57, ''],
 ['wybranieHKat', A, '26 deg', 26, ''], ['whR1', L, '21 mm', 21, ''], ['whR2', L, '25.25 mm', 25.25, ''], ['whR3', L, '25.8 mm', 25.8, ''], ['whZ1', L, '43.6 mm', 43.6, ''], ['whZ2', L, '47.1 mm', 47.1, ''], ['whZ3', L, '51.2 mm', 51.2, ''],
 ['whZ4', L, '#whZ3 + #whR3 - #whR1', 56, ''],
];
return 'zmienne kasety: ' + G.ZM.kaseta.length;
})();

// ===================== v2.5: Kaseta A (rura, wystep, szczelina stopu, kanal, otwor osi, Mirror) =====================
(() => {
const G = window.G;
G.oko = () => G.q.vtx('Layout: osie i punkty', 'lOko.start');
G.hole = (name, sk, pts, o) => { const p = [G.pe('hole', 'style', o.cbore ? 'C_BORE' : 'SIMPLE'), G.pq('locations', ...pts.map((v) => G.q.vtx(sk, v))),
  G.pe('hole', 'endStyle', o.through ? 'THROUGH' : 'BLIND'), G.pn('holeDiameter', o.d), G.pb('oppositeDirection', !!o.opp)];
  if (!o.through) p.push(G.pn('holeDepth', o.depth)); if (o.cbore) p.push(G.pn('cBoreDiameter', o.cbore), G.pn('cBoreDepth', o.cboreDepth));
  if (o.scope) p.push(G.pq('scope', ...o.scope));
  return G.op(name, 'hole', p); };
G.kasetaA = () => G.bryla('Kaseta A', async () => {
  const p = new G.Sk('Kaseta: profil rury', G.q.std('Front'));
  p.poly(['k1', 'k2', 'k3', 'k4', 'k5'], [[24.25, -1.5], [26.65, -1.5], [27.25, -2.1], [27.25, -77.5], [24.25, -77.5]]);
  p.H('k1'); p.V('k3'); p.H('k4'); p.V('k5');
  p.dx('k1.start', '#kasetaIDR'); p.dy('k1.start', '#rantT'); p.dx('k2.start', '#kasetaODR - #fazkaCzola'); p.dx('k3.start', '#kasetaODR'); p.dy('k3.start', '#rantT + #fazkaCzola'); p.dy('k4.start', '#kasetaTylZ');
  await G.zapiszSzkic(p.feature());
  await G.rev('Kaseta: rura', G.q.region('Kaseta: profil rury'), { op: 'NEW' });
  const K = [G.q.body('Kaseta: rura')];
  await G.plOffset('Kaseta: pl. występu', G.q.std('Front'), '#wystepY', true);
  const w = new G.Sk('Kaseta: występ szkic', G.q.plane('Kaseta: pl. występu'));
  w.arc('w1', [0, -12], 9.6, 135, 405); w.line('wP', [6.788, -5.212], [0, -1.6]); w.line('wL', [0, -1.6], [-6.788, -5.212]);
  w.co('w1.end', 'wP.start'); w.co('wP.end', 'wL.start'); w.co('wL.end', 'w1.start');
  w.coExt('w1.center', G.oko()); w.ra('w1', '#wystepR'); w.dx('w1.start', '#wystepTx'); w.dx('w1.end', '#wystepTx');
  w.coExt('wP.end', G.q.std('Right')); w.dy('wP.end', '#wystepOgon');
  await G.zapiszSzkic(w.feature());
  await G.ext('Kaseta: występ osi', 'Kaseta: występ szkic', { op: 'ADD', depth: '#wystepH', opp: true, scope: K });
  const s = new G.Sk('Kaseta: szczelina stopu szkic', G.q.plane('Kaseta: pl. występu'));
  s.arc('sO', [0, -12], 8.3, 225.81, 314.19); s.arc('sI', [0, -12], 5.1, 225.81, 314.19);
  s.line('sP', [5.785, -17.952], [3.555, -15.657]); s.line('sL', [-3.555, -15.657], [-5.785, -17.952]);
  s.co('sO.end', 'sP.start'); s.co('sP.end', 'sI.end'); s.co('sI.start', 'sL.start'); s.co('sL.end', 'sO.start');
  s.coExt('sO.center', G.oko()); s.coExt('sI.center', G.oko()); s.ra('sO', '#szczelinaR2'); s.ra('sI', '#szczelinaR1');
  s.dx('sO.start', '#szczelinaX2'); s.dx('sO.end', '#szczelinaX2'); s.dx('sI.start', '#szczelinaX1'); s.dx('sI.end', '#szczelinaX1');
  await G.zapiszSzkic(s.feature());
  await G.ext('Kaseta: szczelina stopu', 'Kaseta: szczelina stopu szkic', { op: 'REMOVE', depth: '#szczelinaStopGl', opp: true, scope: K });
  const c = new G.Sk('Kaseta: kanał kołka szkic', G.q.plane('Kaseta: pl. występu'));
  c.poly(['c1', 'c2', 'c3', 'c4'], [[-1.6, -78.5], [1.6, -78.5], [1.6, -17.9], [-1.6, -17.9]]); c.H('c1'); c.V('c2'); c.H('c3'); c.V('c4');
  c.dx('c1.start', '#kanalPolSzer'); c.dx('c2.start', '#kanalPolSzer'); c.dy('c1.start', '#kanalZ2'); c.dy('c3.start', '#kanalZ1');
  await G.zapiszSzkic(c.feature());
  await G.ext('Kaseta: kanał kołka', 'Kaseta: kanał kołka szkic', { op: 'REMOVE', depth: '#kanalGl', opp: true, scope: K });
  await G.plOffset('Kaseta: pl. otworów osi', G.q.std('Front'), '#otworOsiY', true);
  const o = new G.Sk('Kaseta: oś szkic', G.q.plane('Kaseta: pl. otworów osi'));
  o.point('pOs', [0, -12]); o.coExt('pOs', G.oko());
  await G.zapiszSzkic(o.feature());
  await G.hole('Kaseta: otwór osi', 'Kaseta: oś szkic', ['pOs'], { d: '#m3Ciasny', depth: '#otworOsiGl', cbore: '#lebD', cboreDepth: '#lebGl', scope: K });
});
G.kasetaAMirror = () => G.mirror('Kaseta: oś, stop i kanał dół', ['Kaseta: występ osi', 'Kaseta: szczelina stopu', 'Kaseta: kanał kołka', 'Kaseta: otwór osi'], G.q.std('Front'));
return 'kaseta A ok';
})();

// ===================== v2.5: Kaseta B–E =====================
// Hole: glebokosci od pierwszego styku z czescia; domyslny kierunek = przeciwny do normalnej plaszczyzny szkicu;
// Mirror nie wzoruje Hole ("Could not pattern selected features") -> para otworow = jeden Hole z 2 punktami (pl. dolna z flipNormal).
(() => {
const G = window.G; const L = 'LENGTH';
const kos = (n, r, k) => [n, L, `#${r} * cos(#${k})`, 0, ''];
G.ZM.kaseta.push(kos('zkX1o', 'zaczepR2', 'zaczepKoniecKat1'), kos('zkX2o', 'zaczepR2', 'zaczepKoniecKat2'), kos('zkX1i', 'zaczepR1', 'zaczepKoniecKat1'), kos('zkX2i', 'zaczepR1', 'zaczepKoniecKat2'),
  kos('zcX1o', 'zaczepCienR', 'zaczepCienKat1'), kos('zcX2o', 'zaczepCienR', 'zaczepCienKat2'), kos('zcX1i', 'zaczepR1', 'zaczepCienKat1'), kos('zcX2i', 'zaczepR1', 'zaczepCienKat2'),
  kos('ztX1o', 'zaczepR2', 'zaczepTylKat1'), kos('ztX2o', 'zaczepR2', 'zaczepTylKat2'), kos('ztX1i', 'zaczepR1', 'zaczepTylKat1'), kos('ztX2i', 'zaczepR1', 'zaczepTylKat2'));
G.ZM.kaseta.forEach((r) => { if (r[3] === 0) r[3] = 20; });   // zapis 1: wartosc tymczasowa (zapis 2 nadpisuje wyrazeniem)
const K = () => [G.q.body('Kaseta: rura')];
const lCH = (v) => G.q.vtx('Layout: osie i punkty', v);
// wycinek pierscienia wokol Origin (plaszczyzna Z): luki r1 (wewn.) i r2 (zewn.) od kata a1 do a2; dx koncow ze zmiennych
G.wycinek = (name, planeQ, r1, r2, a1, a2, v) => { const s = new G.Sk(name, planeQ);
  s.arc('aO', [0, 0], r2, a1, a2); s.arc('aI', [0, 0], r1, a1, a2);
  s.line('lA', [r2 * Math.cos(a1 * Math.PI / 180), r2 * Math.sin(a1 * Math.PI / 180)], [r1 * Math.cos(a1 * Math.PI / 180), r1 * Math.sin(a1 * Math.PI / 180)]);
  s.line('lB', [r1 * Math.cos(a2 * Math.PI / 180), r1 * Math.sin(a2 * Math.PI / 180)], [r2 * Math.cos(a2 * Math.PI / 180), r2 * Math.sin(a2 * Math.PI / 180)]);
  s.co('aO.start', 'lA.start'); s.co('lA.end', 'aI.start'); s.co('aI.end', 'lB.start'); s.co('lB.end', 'aO.end');
  s.naOrigin('aO.center'); s.naOrigin('aI.center'); s.ra('aO', '#' + v.r2); s.ra('aI', '#' + v.r1);
  s.dx('aO.start', '#' + v.x1o); s.dx('aO.end', '#' + v.x2o); s.dx('aI.start', '#' + v.x1i); s.dx('aI.end', '#' + v.x2i);
  return s; };
G.kasetaB = () => G.bryla('Kaseta B', async () => {
  await G.plOffset('Kaseta: pl. okna SG90', G.q.std('Front'), '#szczelinaSerwaY');
  const a = new G.Sk('Kaseta: okno SG90 szkic', G.q.plane('Kaseta: pl. okna SG90'));
  a.poly(['a1', 'a2', 'a3', 'a4'], [[-6.6, -78.5], [6.6, -78.5], [6.6, -49.2], [-6.6, -49.2]]); a.H('a1'); a.V('a2'); a.H('a3'); a.V('a4');
  a.dx('a1.start', '#szczelinaSerwaPolSzer'); a.dx('a2.start', '#szczelinaSerwaPolSzer'); a.dy('a1.start', '#kanalZ2'); a.dy('a3.start', '#szczelinaSerwaZ');
  await G.zapiszSzkic(a.feature());
  await G.ext('Kaseta: okno SG90', 'Kaseta: okno SG90 szkic', { op: 'REMOVE', depth: '#szczelinaSerwaGl', scope: K() });
  const d = new G.Sk('Kaseta: otwory dolne szkic', G.q.plane('Kaseta: pl. otworów osi dół'));
  d.circle('dC', [7.382, -36.147], 8.7); d.circle('dH', [-9.235, -40.628], 8.7);
  d.coExt('dC.center', lCH('lCH.start')); d.coExt('dH.center', lCH('lCH.end')); d.fi('dC', '#otworDolnyD'); d.fi('dH', '#otworDolnyD');
  await G.zapiszSzkic(d.feature());
  await G.ext('Kaseta: otwory dolne', 'Kaseta: otwory dolne szkic', { op: 'REMOVE', depth: '#otworDolnyGl', scope: K() });
  const g = new G.Sk('Kaseta: otwór górny szkic', G.q.plane('Kaseta: pl. otworów osi'));
  g.arc('o1', [0, -66], 4.5, 200, 380); g.arc('o2', [-4.446, -53.784], 4.5, 20, 200);
  g.line('t1', [4.229, -64.461], [-0.217, -52.245]); g.line('t2', [-8.675, -55.323], [-4.229, -67.539]);
  g.co('o1.end', 't1.start'); g.co('t1.end', 'o2.start'); g.co('o2.end', 't2.start'); g.co('t2.end', 'o1.start');
  g.coExt('o1.center', G.q.vtx('Layout: osie i punkty', 'lOko.end')); g.dx('o2.center', '#m2X'); g.dy('o2.center', '#m2Z');
  g.ra('o1', '#otworGornyR'); g.ra('o2', '#otworGornyR'); g.tan('t1', 'o1'); g.tan('t1', 'o2'); g.tan('t2', 'o1'); g.tan('t2', 'o2');
  await G.zapiszSzkic(g.feature());
  await G.ext('Kaseta: otwór górny', 'Kaseta: otwór górny szkic', { op: 'REMOVE', depth: '#otworGornyGl', scope: K() });
  await G.plOffset('Kaseta: pl. wybrania C', G.q.std('Front'), '#wybranieCY', true);
  const c = new G.Sk('Kaseta: wybranie C szkic', G.q.plane('Kaseta: pl. wybrania C'));
  c.poly(['w1', 'w2', 'w3', 'w4'], [[21.5, -35], [24.8, -31.7], [24.8, -22.4], [21.5, -22.4]]); c.V('w2'); c.H('w3'); c.V('w4');
  c.dx('w1.start', '#wybranieCR1'); c.dy('w1.start', '#wybranieCZ2'); c.dx('w2.start', '#wybranieCR2'); c.dy('w2.start', '#wybranieCZs'); c.dy('w3.start', '#wybranieCZ1');
  await G.zapiszSzkic(c.feature());
  await G.ext('Kaseta: wybranie C', 'Kaseta: wybranie C szkic', { op: 'REMOVE', depth: '#wybranieCGl', scope: K() });
  await G.plKat('Kaseta: pl. rowka', G.osZ(), G.q.std('Front'), '#rowekKatPl');
  const r = new G.Sk('Kaseta: rowek szkic', G.q.plane('Kaseta: pl. rowka'));
  r.poly(['r1', 'r2', 'r3', 'r4'], [[26.25, -46.7], [28.25, -46.7], [28.25, -0.5], [26.25, -0.5]]); r.H('r1'); r.V('r2'); r.H('r3'); r.V('r4');
  r.dx('r1.start', '#rowekR1'); r.dx('r2.start', '#rowekR2'); r.dy('r1.start', '#rowekZ2'); r.dy('r3.start', '#rowekZ1');
  await G.zapiszSzkic(r.feature());
  await G.ext('Kaseta: rowek', 'Kaseta: rowek szkic', { op: 'REMOVE', depth: '#rowekSzer', sym: true, scope: K() });
  await G.plOffset('Kaseta: pl. fazek rowka', G.q.plane('Gniazdo: pl. prostopadła do żebra'), '#rowekFazaR', true);
  const f = new G.Sk('Kaseta: fazki rowka szkic', G.q.plane('Kaseta: pl. fazek rowka'));
  f.poly(['fa1', 'fa2', 'fa3'], [[2.2, -1.4], [3.1, -1.4], [2.2, -3.1]]); f.H('fa1'); f.V('fa3');
  f.dx('fa1.start', '#rowekFazaX1'); f.dy('fa1.start', '#rowekFazaZ1'); f.dx('fa2.start', '#rowekFazaX2'); f.dy('fa3.start', '#rowekFazaZ2');
  f.poly(['fb1', 'fb2', 'fb3'], [[-2.2, -1.4], [-2.2, -3.1], [-3.1, -1.4]]); f.V('fb1'); f.H('fb3');
  f.dx('fb1.start', '#rowekFazaX1'); f.dy('fb1.start', '#rowekFazaZ1'); f.dy('fb2.start', '#rowekFazaZ2'); f.dx('fb3.start', '#rowekFazaX2');
  await G.zapiszSzkic(f.feature());
  await G.ext('Kaseta: fazki wejścia rowka', 'Kaseta: fazki rowka szkic', { op: 'REMOVE', depth: '#rowekFazaGl', sym: true, scope: K() });
});
G.kasetaC = () => G.bryla('Kaseta C', async () => {
  await G.plKat('Kaseta: pl. ucha', G.osZ(), G.q.std('Front'), '#uchoKatPl');
  const u = new G.Sk('Kaseta: ucho szkic', G.q.plane('Kaseta: pl. ucha'));
  u.poly(['u1', 'u2', 'u3', 'u4', 'u5'], [[26.5, -77.5], [33.5, -77.5], [33.5, -71], [27.2, -64.7], [26.5, -64.7]]); u.H('u1'); u.V('u2'); u.H('u4'); u.V('u5');
  u.dx('u1.start', '#uchoR1'); u.dy('u1.start', '#kasetaTylZ'); u.dx('u2.start', '#uchoR2'); u.dy('u3.start', '#uchoZ2'); u.dx('u4.start', '#uchoR3'); u.dy('u4.start', '#uchoZ1');
  await G.zapiszSzkic(u.feature());
  await G.ext('Kaseta: ucho pokrywy', 'Kaseta: ucho szkic', { op: 'ADD', depth: '#uchoSzer', sym: true, scope: K() });
  await G.op('Kaseta: ucho pokrywy 140', 'mirror', [G.pe('mirror', 'patternType', 'FEATURE'), { btType: 'BTMParameterFeatureList-1749', parameterId: 'instanceFunction', featureIds: [G.fid('Kaseta: ucho pokrywy')] }, G.pq('mirrorPlane', G.q.std('Right')), G.pb('fullFeaturePattern', true)]);
  await G.plOffset('Kaseta: pl. tyłu', G.q.std('Top'), '#kasetaTylZ', true);
  const w = new G.Sk('Kaseta: wkładki szkic', G.q.plane('Kaseta: pl. tyłu'));
  w.point('pW1', [22.598, 18.962]); w.point('pW2', [-22.598, 18.962]);
  w.dx('pW1', '#uchoX'); w.dy('pW1', '#uchoY'); w.dx('pW2', '#uchoX'); w.dy('pW2', '#uchoY');
  await G.zapiszSzkic(w.feature());
  await G.op('Kaseta: otwory wkładek', 'hole', [G.pe('hole', 'style', 'SIMPLE'), G.pq('locations', G.q.vtx('Kaseta: wkładki szkic', 'pW1'), G.q.vtx('Kaseta: wkładki szkic', 'pW2')), G.pe('hole', 'endStyle', 'BLIND'),
    G.pn('holeDiameter', '#wkladkaD'), G.pn('holeDepth', '#wkladkaL + #uchoDno'), G.pb('oppositeDirection', true), G.pq('scope', ...K())]);
});
G.kasetaD = () => G.bryla('Kaseta D (zaczep)', async () => {
  await G.plOffset('Kaseta: pl. końca zaczepu', G.q.std('Top'), '#zaczepZ', true);
  await G.zapiszSzkic(G.wycinek('Kaseta: koniec zaczepu szkic', G.q.plane('Kaseta: pl. końca zaczepu'), 23.5, 28, 50, 52.5, { r1: 'zaczepR1', r2: 'zaczepR2', x1o: 'zkX1o', x2o: 'zkX2o', x1i: 'zkX1i', x2i: 'zkX2i' }).feature());
  await G.ext('Kaseta: koniec zaczepu', 'Kaseta: koniec zaczepu szkic', { op: 'REMOVE', depth: '#zaczepL', opp: true, scope: K() });
  await G.plOffset('Kaseta: pl. pocienienia zaczepu', G.q.std('Top'), '#zaczepCienZ', true);
  await G.zapiszSzkic(G.wycinek('Kaseta: pocienienie zaczepu szkic', G.q.plane('Kaseta: pl. pocienienia zaczepu'), 23.5, 25.2, 19, 50.5, { r1: 'zaczepR1', r2: 'zaczepCienR', x1o: 'zcX1o', x2o: 'zcX2o', x1i: 'zcX1i', x2i: 'zcX2i' }).feature());
  await G.ext('Kaseta: pocienienie zaczepu', 'Kaseta: pocienienie zaczepu szkic', { op: 'REMOVE', depth: '#zaczepCienL', opp: true, scope: K() });
  await G.plKat('Kaseta: pl. szczeliny skośnej', G.osZ(), G.q.std('Front'), '#zaczepSkosKatPl');
  const s = new G.Sk('Kaseta: szczelina skośna szkic', G.q.plane('Kaseta: pl. szczeliny skośnej'));
  s.poly(['s1', 's2', 's3', 's4'], [[23.9, -40.75], [28.2, -36.45], [28.2, -35.319], [23.9, -39.619]]); s.V('s2'); s.V('s4');
  s.dx('s1.start', '#skosR1'); s.dy('s1.start', '#skosZ1'); s.dx('s2.start', '#skosR2'); s.dy('s2.start', '#skosZ2'); s.dy('s3.start', '#skosZ3'); s.dy('s4.start', '#skosZ4');
  await G.zapiszSzkic(s.feature());
  await G.rev('Kaseta: szczelina skośna zaczepu', G.q.region('Kaseta: szczelina skośna szkic'), { op: 'REMOVE', angle: '#zaczepSkosRozw', scope: K() });
  await G.plOffset('Kaseta: pl. szczeliny tylnej', G.q.std('Top'), '#zaczepTylZ', true);
  await G.zapiszSzkic(G.wycinek('Kaseta: szczelina tylna szkic', G.q.plane('Kaseta: pl. szczeliny tylnej'), 23.5, 28, 16, 52.4, { r1: 'zaczepR1', r2: 'zaczepR2', x1o: 'ztX1o', x2o: 'ztX2o', x1i: 'ztX1i', x2i: 'ztX2i' }).feature());
  await G.ext('Kaseta: szczelina tylna zaczepu', 'Kaseta: szczelina tylna szkic', { op: 'REMOVE', depth: '#zaczepTylGl', opp: true, scope: K() });
  const h = new G.Sk('Kaseta: haczyk szkic', G.q.plane('Gniazdo: pl. zaczepów'));
  h.poly(['h1', 'h2', 'h3', 'h4'], [[26.75, -38], [26.75, -42], [28.25, -42], [28.25, -39.05]]); h.V('h1'); h.H('h2'); h.V('h3');
  h.dx('h1.start', '#haczykR1'); h.dy('h1.start', '#haczykZ1'); h.dy('h2.start', '#haczykZ2'); h.dx('h3.start', '#haczykR2'); h.dy('h4.start', '#haczykNajazdZ');
  await G.zapiszSzkic(h.feature());
  await G.ext('Kaseta: haczyk', 'Kaseta: haczyk szkic', { op: 'ADD', depth: '#haczykSzer', sym: true, scope: K() });
  await G.op('Kaseta: zaczep 213', 'circularPattern', [G.pe('circularPattern', 'patternType', 'FEATURE'), { btType: 'BTMParameterFeatureList-1749', parameterId: 'instanceFunction',
    featureIds: ['Kaseta: koniec zaczepu', 'Kaseta: pocienienie zaczepu', 'Kaseta: szczelina skośna zaczepu', 'Kaseta: szczelina tylna zaczepu', 'Kaseta: haczyk'].map(G.fid) },
    G.pq('axis', G.osZ()), G.pn('angle', '360 deg'), G.pn('instanceCount', '2', true), G.pb('equalSpace', true), G.pb('fullFeaturePattern', true)]);
});
G.kasetaE = () => G.bryla('Kaseta E (H)', async () => {
  await G.plKat('Kaseta: pl. H', G.osZ(), G.q.std('Front'), '#hKatPl');
  const p = new G.Sk('Kaseta: pogrubienie H szkic', G.q.plane('Kaseta: pl. H'));
  p.poly(['p1', 'p2', 'p3', 'p4', 'p5'], [[27, -46.5], [27.2, -46.5], [29.6, -48.9], [29.6, -57], [27, -57]]); p.H('p1'); p.V('p3'); p.H('p4'); p.V('p5');
  p.dx('p1.start', '#pgR1'); p.dy('p1.start', '#pgZ1'); p.dx('p2.start', '#pgR2'); p.dx('p3.start', '#pgR3'); p.dy('p3.start', '#pgZ2'); p.dy('p4.start', '#pgZ3');
  await G.zapiszSzkic(p.feature());
  await G.rev('Kaseta: pogrubienie H', G.q.region('Kaseta: pogrubienie H szkic'), { op: 'ADD', angle: '#pogrubienieHKat', scope: K() });
  const w = new G.Sk('Kaseta: wybranie H szkic', G.q.plane('Kaseta: pl. H'));
  w.poly(['q1', 'q2', 'q3', 'q4', 'q5', 'q6'], [[21, -43.6], [25.25, -43.6], [25.25, -47.1], [25.8, -47.1], [25.8, -51.2], [21, -56]]);
  w.H('q1'); w.V('q2'); w.H('q3'); w.V('q4'); w.V('q6');
  w.dx('q1.start', '#whR1'); w.dy('q1.start', '#whZ1'); w.dx('q2.start', '#whR2'); w.dy('q3.start', '#whZ2'); w.dx('q4.start', '#whR3'); w.dy('q5.start', '#whZ3'); w.dy('q6.start', '#whZ4');
  await G.zapiszSzkic(w.feature());
  await G.rev('Kaseta: wybranie H', G.q.region('Kaseta: wybranie H szkic'), { op: 'REMOVE', angle: '#wybranieHKat', scope: K() });
});
return 'kaseta B-E ok';
})();

// ===================== v2.5: Jarzmo z miska =====================
(() => {
const G = window.G; const L = 'LENGTH', A = 'ANGLE';
G.ZM.jarzmo = [
 ['jarzmoT', L, '2.5 mm', 2.5, 'grubosc promieniowa miski'], ['jarzmoW', L, '8 mm', 8, 'szerokosc miski'], ['jarzmoPolW', L, '#jarzmoW / 2', 4, ''],
 ['jarzmoRw', L, '#kulaDmax / 2 + #klej', 20.75, ''], ['jarzmoRz', L, '#jarzmoRw + #jarzmoT', 23.25, ''],
 ['pasKat', A, '60 deg', 60, 'os pasa w plaszczyznie XZ'], ['pasOsL', L, '30 mm', 30, ''], ['pasOsX', L, '#pasOsL * cos(#pasKat)', 15, ''], ['pasOsZ', L, '#pasOsL * sin(#pasKat) - #oczkoZ', 13.98, ''], ['pasObrot', A, '180 deg', 180, ''],
 ['przyciecieR', L, '6.5 mm', 6.5, ''], ['przyciecieGl', L, '5 mm', 5, ''], ['przyciecieY', L, '#wystepY - #luzOsiowy', 23.15, ''],
 ['oczkoZakladka', L, '0.05 mm', 0.05, ''], ['oczkoY', L, '#jarzmoRw + #oczkoZakladka', 20.8, ''], ['oczkoGl', L, '#oczkoT - #oczkoZakladka', 2.35, ''], ['oczkoRamieB', L, '4.8 mm', 4.8, ''], ['oczkoTabR', L, '2.3 mm', 2.3, ''],
 ['kolekZ', L, '#oczkoZ + #kolekR', 18.7, ''], ['kolekZakladka', L, '0.1 mm', 0.1, ''], ['kolekY', L, '#przyciecieY - #kolekZakladka', 23.05, ''], ['kolekH', L, '1.7 mm', 1.7, ''],
 ['korbaR1', L, '20.9 mm', 20.9, ''], ['korbaR2', L, '23.4 mm', 23.4, ''], ['korbaKat1', A, '19 deg', 19, ''], ['korbaKat1o', A, '20.2 deg', 20.2, ''], ['korbaKat2', A, '60 deg', 60, ''], ['korbaKat3', A, '77 deg', 77, ''],
 ['korbaP20R', L, '26.4 mm', 26.4, ''], ['korbaP21R', L, '28 mm', 28, ''], ['korbaP21Kat', A, '70 deg', 70, ''],
 ['kP1x', L, '#korbaR1 * cos(#korbaKat1)', 19.762, ''], ['kP34x', L, '#korbaR2 * cos(#korbaKat1o)', 21.963, ''], ['kP22x', L, '#korbaR2 * cos(#korbaKat2)', 11.7, ''], ['kP19x', L, '#korbaR1 * cos(#korbaKat3)', 4.701, ''],
 ['kP20x', L, '#korbaP20R * cos(#korbaKat3)', 5.939, ''], ['kP20z', L, '#oczkoZ + #korbaP20R * sin(#korbaKat3)', 37.723, ''], ['kP21x', L, '#korbaP21R * cos(#korbaP21Kat)', 9.577, ''], ['kP21z', L, '#oczkoZ + #korbaP21R * sin(#korbaP21Kat)', 38.311, ''],
 ['korbaY', L, '3 mm', 3, ''], ['plytaT', L, '2.5 mm', 2.5, 'korba, ciegno, ramie'], ['korbaPiastaR', L, '5 mm', 5, ''], ['tulejkaD', L, '5.6 mm', 5.6, ''], ['luzPrzegub', L, '0.2 mm', 0.2, ''],
 ['otworPrzegubuD', L, '#tulejkaD + 2 * #luzPrzegub', 6, ''],
];
const J = () => [G.q.body('Jarzmo: pas miski')];
G.jarzmo = () => G.bryla('Jarzmo', async () => {
  const p = new G.Sk('Jarzmo: profil pasa', G.q.std('Front'));
  p.line('osPasa', [0, -12], [15, 13.98], true); p.coExt('osPasa.start', G.oko()); p.dx('osPasa.end', '#pasOsX'); p.dy('osPasa.end', '#pasOsZ');
  p.arc('pI', [0, -12], 20.75, -41.1, -18.9); p.arc('pO', [0, -12], 23.25, -39.9, -20.1);
  p.line('L1', [19.633, -18.717], [21.834, -19.988]); p.line('L2', [17.834, -26.916], [15.633, -25.645]);
  p.co('pI.end', 'L1.start'); p.co('L1.end', 'pO.end'); p.co('pO.start', 'L2.start'); p.co('L2.end', 'pI.start');
  p.coExt('pI.center', G.oko()); p.coExt('pO.center', G.oko()); p.ra('pI', '#jarzmoRw'); p.ra('pO', '#jarzmoRz');
  p.perp('L1', 'osPasa'); p.perp('L2', 'osPasa'); p.con('DISTANCE', [G.pstr('localFirst', 'L1'), G.pq('externalSecond', G.oko()), { btType: 'BTMParameterEnum-145', parameterId: 'direction', enumName: 'DimensionDirection', value: 'MINIMUM' }, G.pn('length', '#jarzmoPolW')]);
  p.con('DISTANCE', [G.pstr('localFirst', 'L2'), G.pq('externalSecond', G.oko()), { btType: 'BTMParameterEnum-145', parameterId: 'direction', enumName: 'DimensionDirection', value: 'MINIMUM' }, G.pn('length', '#jarzmoPolW')]);
  await G.zapiszSzkic(p.feature());
  await G.rev('Jarzmo: pas miski', G.q.region('Jarzmo: profil pasa'), { op: 'NEW', axisQ: G.q.ent('Jarzmo: profil pasa', 'osPasa'), angle: '#pasObrot' });
  const os = G.q.ent('Jarzmo: profil pasa', 'osPasa');
  const dLin = (s, l, expr) => s.con('DISTANCE', [G.pstr('localFirst', l), G.pq('externalSecond', G.oko()), { btType: 'BTMParameterEnum-145', parameterId: 'direction', enumName: 'DimensionDirection', value: 'MINIMUM' }, G.pn('length', expr)]);
  await G.plOffset('Jarzmo: pl. przycięcia', G.q.std('Front'), '#przyciecieY', true);
  const c = new G.Sk('Jarzmo: przycięcie szkic', G.q.plane('Jarzmo: pl. przycięcia'));
  c.circle('cP', [0, -12], 13); c.coExt('cP.center', G.oko()); c.ra('cP', '#przyciecieR');
  await G.zapiszSzkic(c.feature());
  await G.ext('Jarzmo: przycięcie', 'Jarzmo: przycięcie szkic', { op: 'REMOVE', depth: '#przyciecieGl', opp: true, scope: J() });
  await G.plOffset('Jarzmo: pl. oczka', G.q.std('Front'), '#oczkoY', true);
  const o = new G.Sk('Jarzmo: oczko szkic', G.q.plane('Jarzmo: pl. oczka'));
  o.poly(['r1', 'r2', 'r3', 'r4'], [[2.157, -17.864], [6.157, -10.936], [-2.157, -6.136], [-6.157, -13.064]]);
  o.parExt('r1', os); o.perpExt('r2', os); o.parExt('r3', os); o.perpExt('r4', os);
  dLin(o, 'r1', '#oczkoRamieB'); dLin(o, 'r2', '#jarzmoPolW'); dLin(o, 'r3', '#oczkoRamieB'); dLin(o, 'r4', '#jarzmoPolW');
  o.line('t1', [-2.3, -12], [-2.3, -18.7]); o.arc('ta', [0, -18.7], 2.3, 180, 360); o.line('t2', [2.3, -18.7], [2.3, -12]); o.line('t3', [2.3, -12], [-2.3, -12]);
  o.co('t1.end', 'ta.start'); o.co('ta.end', 't2.start'); o.co('t2.end', 't3.start'); o.co('t3.end', 't1.start');
  o.V('t1'); o.V('t2'); o.H('t3'); o.coExt('ta.center', G.q.std('Right')); o.dy('ta.center', '#kolekZ'); o.ra('ta', '#oczkoTabR');
  o.con('COINCIDENT', [G.pstr('localFirst', 't3'), G.pq('externalSecond', G.oko())]); o.tan('t1', 'ta'); o.tan('t2', 'ta');
  await G.zapiszSzkic(o.feature());
  await G.ext('Jarzmo: oczko', 'Jarzmo: oczko szkic', { op: 'ADD', depth: '#oczkoGl', opp: true, scope: J() });
  await G.plOffset('Jarzmo: pl. kołka', G.q.std('Front'), '#kolekY', true);
  const k = new G.Sk('Jarzmo: kołek szkic', G.q.plane('Jarzmo: pl. kołka'));
  k.circle('cK', [0, -18.7], 2.6); k.coExt('cK.center', G.q.std('Right')); k.dy('cK.center', '#kolekZ'); k.fi('cK', '#kolekD');
  await G.zapiszSzkic(k.feature());
  await G.ext('Jarzmo: kołek ogranicznika', 'Jarzmo: kołek szkic', { op: 'ADD', depth: '#kolekH', opp: true, scope: J() });
  await G.op('Jarzmo: przycięcie, oczko i kołek dół', 'mirror', [G.pe('mirror', 'patternType', 'FEATURE'), { btType: 'BTMParameterFeatureList-1749', parameterId: 'instanceFunction',
    featureIds: ['Jarzmo: przycięcie', 'Jarzmo: oczko', 'Jarzmo: kołek ogranicznika'].map(G.fid) }, G.pq('mirrorPlane', G.q.std('Front')), G.pb('fullFeaturePattern', true)]);
  await G.op('Jarzmo: otwory osi', 'hole', [G.pe('hole', 'style', 'SIMPLE'), G.pq('locations', G.q.vtx('Kaseta: oś szkic', 'pOs')), G.pe('hole', 'endStyle', 'THROUGH'),
    G.pn('holeDiameter', '#m3Luzny'), G.pb('oppositeDirection', true), G.pq('scope', ...J())]);
  await G.plOffset('Jarzmo: pl. korby', G.q.std('Front'), '#korbaY');
  const b = new G.Sk('Jarzmo: korba szkic', G.q.plane('Jarzmo: pl. korby'));
  b.arc('ki', [0, -12], 20.9, -77, -19); b.arc('ko', [0, -12], 23.4, -60, -20.2);
  b.line('lA', [19.762, -18.805], [21.963, -20.08]); b.line('lD', [11.7, -32.265], [9.577, -38.311]); b.line('lC', [9.577, -38.311], [5.939, -37.723]); b.line('lB', [5.939, -37.723], [4.701, -32.364]);
  b.co('ki.end', 'lA.start'); b.co('lA.end', 'ko.end'); b.co('ko.start', 'lD.start'); b.co('lD.end', 'lC.start'); b.co('lC.end', 'lB.start'); b.co('lB.end', 'ki.start');
  b.coExt('ki.center', G.oko()); b.coExt('ko.center', G.oko()); b.ra('ki', '#korbaR1'); b.ra('ko', '#korbaR2');
  b.dx('ki.end', '#kP1x'); b.dx('ko.end', '#kP34x'); b.dx('ko.start', '#kP22x'); b.dx('ki.start', '#kP19x');
  b.dx('lC.end', '#kP20x'); b.dy('lC.end', '#kP20z'); b.dx('lD.end', '#kP21x'); b.dy('lD.end', '#kP21z');
  b.circle('kC', [7.382, -36.147], 10); b.coExt('kC.center', G.q.vtx('Layout: osie i punkty', 'lCH.start')); b.ra('kC', '#korbaPiastaR');
  await G.zapiszSzkic(b.feature());
  await G.ext('Jarzmo: korba', 'Jarzmo: korba szkic', { op: 'ADD', depth: '#plytaT', opp: true, scope: J() });
  await G.op('Jarzmo: otwór korby', 'hole', [G.pe('hole', 'style', 'SIMPLE'), G.pq('locations', G.q.vtx('Layout: osie i punkty', 'lCH.start')), G.pe('hole', 'endStyle', 'THROUGH'),
    G.pn('holeDiameter', '#otworPrzegubuD'), G.pb('oppositeDirection', true), G.pq('scope', ...J())]);
});
return 'jarzmo ok';
})();

// ===================== v2.5: Sanki, Ramie, Ciegno, Tulejki, Pokrywa =====================
(() => {
const G = window.G; const L = 'LENGTH', A = 'ANGLE';
G.ZM.reszta = [
 ['sankiOparcieY', L, '22.2 mm', 22.2, 'oparcie sanek nad scianka kasety (y)'], ['sankiSpodY', L, '#sankiOparcieY - #luzSanki', 21.95, ''], ['slupkiH', L, '4.35 mm', 4.35, ''], ['prowadnicaH', L, '1.7 mm', 1.7, ''],
 ['sankiPolSzer', L, '9.6 mm', 9.6, ''], ['sankiZ1', L, '44.6 mm', 44.6, ''], ['sankiZ2', L, '49.2 mm', 49.2, ''], ['sankiZ3', L, '72.1 mm', 72.1, ''], ['sankiZ4', L, '77.4 mm', 77.4, ''],
 ['sankiProwZ1', L, '48.9 mm', 48.9, ''], ['sankiProwZ2', L, '72.4 mm', 72.4, ''], ['prowadnicaWewX', L, '#szczelinaSG90 / 2', 6.35, ''], ['fazkaSanek', L, '1 mm', 1, 'naroze sanek (tulejka H)'],
 ['sankiGoraY', L, '#sankiSpodY - #slupkiH', 17.6, ''], ['sankiOtwor1Z', L, '46.75 mm', 46.75, ''], ['sg90UchaRozstaw', L, '27.8 mm', 27.8, ''], ['sankiOtwor2Z', L, '#sankiOtwor1Z + #sg90UchaRozstaw', 74.55, ''],
 ['serwoWkret', L, '1.8 mm', 1.8, ''], ['dnoWkretu', L, '0.6 mm', 0.6, ''], ['sankiOtworGl', L, '#slupkiH - #dnoWkretu', 3.75, ''],
 ['ramieRo', L, '5.5 mm', 5.5, ''], ['ramieRh', L, '5 mm', 5, ''], ['ramaY', L, '4.5 mm', 4.5, ''], ['ramaH', L, '1.6 mm', 1.6, ''], ['ramaR', L, '5.2 mm', 5.2, ''], ['ramaRamieR', L, '3.5 mm', 3.5, ''],
 ['orczykRamieL', L, '17.5 mm', 17.5, ''], ['kieszenR', L, '3.7 mm', 3.7, ''], ['kieszenR0', L, '2.6 mm', 2.6, ''], ['kieszenR1', L, '2.3 mm', 2.3, ''], ['ramaZakladka', L, '0.1 mm', 0.1, ''], ['kieszenGl', L, '#ramaH - #ramaZakladka', 1.5, ''],
 ['m2L', L, '13 mm', 13, 'wkret M2 od osi orczyka'], ['m2Otwor', L, '2.2 mm', 2.2, ''], ['wkretOrczykaD', L, '2.8 mm', 2.8, ''],
 ['ciegnoR', L, '4.2 mm', 4.2, ''], ['ciegnoY', L, '0.3 mm', 0.3, ''], ['podniesienieR', L, '3.8 mm', 3.8, ''], ['podniesienieY', L, '2.1 mm', 2.1, ''], ['ciegnoDno', L, '1 mm', 1, ''],
 ['podniesienieH', L, '#wkladkaL + #wkladkaZapas + #ciegnoDno - #plytaT + #ramaZakladka', 3.2, ''], ['ciegnoWkladkiY', L, '5.4 mm', 5.4, ''], ['ciegnoWkladkaGl', L, '#wkladkaL + #wkladkaZapas', 4.6, ''],
 ['kolnierzD', L, '8 mm', 8, ''], ['kolnierzH', L, '0.8 mm', 0.8, ''], ['tulejkaY', L, '3.8 mm', 3.8, ''], ['tulejkaKoniecY', L, '0.3 mm', 0.3, ''], ['tulejkaL', L, '#tulejkaY - #tulejkaKoniecY', 3.5, ''],
 ['pokrywaT', L, '3 mm', 3, ''], ['pokrywaUchoR', L, '4.01 mm', 4.01, ''], ['pokrywaUchoR0', L, '25 mm', 25, ''], ['pokrywaEX', L, '#uchoR2 * cos(#uchoKat)', 25.662, ''], ['pokrywaEY', L, '#uchoR2 * sin(#uchoKat)', 21.533, ''],
 ['jezykPolSzer', L, '9 mm', 9, ''], ['jezykY1', L, '20 mm', 20, ''], ['jezykY2', L, '38 mm', 38, ''], ['oknoPolSzer', L, '4.5 mm', 4.5, ''], ['oknoY1', L, '30.4 mm', 30.4, ''], ['oknoY2', L, '33.8 mm', 33.8, ''],
 ['zaciskPolSzer', L, '1.9 mm', 1.9, ''], ['zaciskTasmy', L, '1 mm', 1, 'zacisk tasmy kabla 1.4'], ['zaciskY', L, '#oknoY2 + #zaciskTasmy', 34.8, ''],
 ['prowKablaX1', L, '4.7 mm', 4.7, ''], ['prowKablaX2', L, '5.9 mm', 5.9, ''], ['prowKablaY1', L, '29.5 mm', 29.5, ''], ['prowKablaY2', L, '36 mm', 36, ''], ['prowKablaH', L, '4 mm', 4, ''], ['prowKablaZakladka', L, '0.5 mm', 0.5, ''],
 ['prowKablaZ', L, '#kasetaTylZ + #prowKablaZakladka', 78, ''],
];
const lay = (v) => G.q.vtx('Layout: osie i punkty', v);
const DIST = (s, a, q, expr) => s.con('DISTANCE', [G.pstr('localFirst', a), G.pq('externalSecond', q), { btType: 'BTMParameterEnum-145', parameterId: 'direction', enumName: 'DimensionDirection', value: 'MINIMUM' }, G.pn('length', expr)]);
const prost = (s, ids, pts, d) => { s.poly(ids, pts); s.H(ids[0]); s.V(ids[1]); s.H(ids[2]); s.V(ids[3]); s.dx(ids[0] + '.start', d[0]); s.dx(ids[1] + '.start', d[1]); s.dy(ids[0] + '.start', d[2]); s.dy(ids[2] + '.start', d[3]); };
// stadion: luki w a i b (punkty zewn.), styczne; wynik: obszar
const stadion = (s, pre, ca, ra, cb, rb, qa, qb, exprA, exprB) => {
  const ang = Math.atan2(cb[1] - ca[1], cb[0] - ca[0]) * 180 / Math.PI; const p = (c, r, a) => [c[0] + r * Math.cos(a * Math.PI / 180), c[1] + r * Math.sin(a * Math.PI / 180)];
  s.arc(pre + 'A', ca, ra, ang + 90, ang + 270); s.arc(pre + 'B', cb, rb, ang - 90, ang + 90);
  s.line(pre + 't1', p(ca, ra, ang + 270), p(cb, rb, ang - 90)); s.line(pre + 't2', p(cb, rb, ang + 90), p(ca, ra, ang + 90));
  s.co(pre + 'A.end', pre + 't1.start'); s.co(pre + 't1.end', pre + 'B.start'); s.co(pre + 'B.end', pre + 't2.start'); s.co(pre + 't2.end', pre + 'A.start');
  s.coExt(pre + 'A.center', qa); s.coExt(pre + 'B.center', qb); s.ra(pre + 'A', exprA); s.ra(pre + 'B', exprB);
  s.tan(pre + 't1', pre + 'A'); s.tan(pre + 't1', pre + 'B'); s.tan(pre + 't2', pre + 'A'); s.tan(pre + 't2', pre + 'B'); };
G.sanki = () => G.bryla('Sanki serwa', async () => {
  await G.plOffset('Sanki: pl. spodu', G.q.std('Front'), '#sankiSpodY');
  const s = new G.Sk('Sanki: słupki szkic', G.q.plane('Sanki: pl. spodu'));
  s.poly(['f1', 'f2', 'f3', 'f4', 'f5'], [[-8.6, -44.6], [9.6, -44.6], [9.6, -49.2], [-9.6, -49.2], [-9.6, -45.6]]); s.H('f1'); s.V('f2'); s.H('f3'); s.V('f4');
  s.dx('f1.start', '#sankiPolSzer - #fazkaSanek'); s.dy('f1.start', '#sankiZ1'); s.dx('f2.start', '#sankiPolSzer'); s.dy('f3.start', '#sankiZ2'); s.dx('f4.start', '#sankiPolSzer'); s.dy('f5.start', '#sankiZ1 + #fazkaSanek');
  prost(s, ['b1', 'b2', 'b3', 'b4'], [[-9.6, -77.4], [9.6, -77.4], [9.6, -72.1], [-9.6, -72.1]], ['#sankiPolSzer', '#sankiPolSzer', '#sankiZ4', '#sankiZ3']);
  await G.zapiszSzkic(s.feature());
  await G.ext('Sanki: słupki', 'Sanki: słupki szkic', { op: 'NEW', depth: '#slupkiH', opp: true });
  const p = new G.Sk('Sanki: prowadnice szkic', G.q.plane('Sanki: pl. spodu'));
  prost(p, ['p1', 'p2', 'p3', 'p4'], [[6.35, -72.4], [9.6, -72.4], [9.6, -48.9], [6.35, -48.9]], ['#prowadnicaWewX', '#sankiPolSzer', '#sankiProwZ2', '#sankiProwZ1']);
  prost(p, ['q1', 'q2', 'q3', 'q4'], [[-9.6, -72.4], [-6.35, -72.4], [-6.35, -48.9], [-9.6, -48.9]], ['#sankiPolSzer', '#prowadnicaWewX', '#sankiProwZ2', '#sankiProwZ1']);
  await G.zapiszSzkic(p.feature());
  await G.ext('Sanki: prowadnice', 'Sanki: prowadnice szkic', { op: 'ADD', depth: '#prowadnicaH', opp: true, scope: [G.q.body('Sanki: słupki')] });
  await G.plOffset('Sanki: pl. góry', G.q.std('Front'), '#sankiGoraY');
  const o = new G.Sk('Sanki: otwory uszu szkic', G.q.plane('Sanki: pl. góry'));
  o.point('u1', [0, -46.75]); o.point('u2', [0, -74.55]); o.coExt('u1', G.q.std('Right')); o.coExt('u2', G.q.std('Right')); o.dy('u1', '#sankiOtwor1Z'); o.dy('u2', '#sankiOtwor2Z');
  await G.zapiszSzkic(o.feature());
  await G.op('Sanki: otwory uszu', 'hole', [G.pe('hole', 'style', 'SIMPLE'), G.pq('locations', G.q.vtx('Sanki: otwory uszu szkic', 'u1'), G.q.vtx('Sanki: otwory uszu szkic', 'u2')), G.pe('hole', 'endStyle', 'BLIND'),
    G.pn('holeDiameter', '#serwoWkret'), G.pn('holeDepth', '#sankiOtworGl'), G.pb('oppositeDirection', true), G.pq('scope', G.q.body('Sanki: słupki'))]);
});
G.ramie = () => G.bryla('Ramię orczyka', async () => {
  const s = new G.Sk('Ramię: płyta szkic', G.q.plane('Jarzmo: pl. korby'));
  stadion(s, 'r', [0, -66], 5.5, [-9.235, -40.628], 5, lay('lOko.end'), lay('lCH.end'), '#ramieRo', '#ramieRh');
  await G.zapiszSzkic(s.feature());
  await G.ext('Ramię: płyta', 'Ramię: płyta szkic', { op: 'NEW', depth: '#plytaT', opp: true });
  const R = [G.q.body('Ramię: płyta')];
  await G.plOffset('Ramię: pl. ramy', G.q.std('Front'), '#ramaY');
  const r = new G.Sk('Ramię: rama orczyka szkic', G.q.plane('Ramię: pl. ramy'));
  r.line('oH', [0, -66], [-9.235, -40.628], true); r.coExt('oH.start', lay('lOko.end')); r.coExt('oH.end', lay('lCH.end'));
  r.point('pT', [-5.985, -49.555]); r.co('pT', 'oH'); DIST(r, 'pT', lay('lOko.end'), '#orczykRamieL');
  r.point('pM2', [-4.446, -53.784]); r.co('pM2', 'oH'); DIST(r, 'pM2', lay('lOko.end'), '#m2L');
  r.circle('cR', [0, -66], 10.4); r.coExt('cR.center', lay('lOko.end')); r.ra('cR', '#ramaR');
  r.circle('cO', [0, -66], 7, true); r.coExt('cO.center', lay('lOko.end')); r.ra('cO', '#ramaRamieR');
  r.circle('cT', [-5.985, -49.555], 7); r.co('cT.center', 'pT'); r.ra('cT', '#ramaRamieR');
  r.line('m1', [3.289, -64.803], [0.304, -48.358]); r.line('m2', [-12.274, -50.752], [-3.289, -67.197]);
  r.co('m1.start', 'cO'); r.co('m1.end', 'cT'); r.tan('m1', 'cO'); r.tan('m1', 'cT'); r.co('m2.start', 'cT'); r.co('m2.end', 'cO'); r.tan('m2', 'cO'); r.tan('m2', 'cT');
  await G.zapiszSzkic(r.feature());
  await G.ext('Ramię: rama orczyka', 'Ramię: rama orczyka szkic', { op: 'ADD', depth: '#ramaH', opp: true, scope: R });
  const k = new G.Sk('Ramię: kieszeń orczyka szkic', G.q.plane('Ramię: pl. ramy'));
  k.circle('kO', [0, -66], 7.4); k.coExt('kO.center', lay('lOko.end')); k.ra('kO', '#kieszenR');
  k.circle('k0', [0, -66], 5.2, true); k.coExt('k0.center', lay('lOko.end')); k.ra('k0', '#kieszenR0');
  k.circle('kT', [-5.985, -49.555], 4.6); k.coExt('kT.center', G.q.vtx('Ramię: rama orczyka szkic', 'pT')); k.ra('kT', '#kieszenR1');
  k.line('n1', [2.443, -65.111], [-3.824, -48.769]); k.line('n2', [-8.146, -50.341], [-2.443, -66.889]);
  k.co('n1.start', 'k0'); k.co('n1.end', 'kT'); k.tan('n1', 'k0'); k.tan('n1', 'kT'); k.co('n2.start', 'kT'); k.co('n2.end', 'k0'); k.tan('n2', 'k0'); k.tan('n2', 'kT');
  await G.zapiszSzkic(k.feature());
  await G.ext('Ramię: kieszeń orczyka', 'Ramię: kieszeń orczyka szkic', { op: 'REMOVE', depth: '#kieszenGl', opp: true, scope: R });
  const H = (n, loc, d, opp) => G.op(n, 'hole', [G.pe('hole', 'style', 'SIMPLE'), G.pq('locations', loc), G.pe('hole', 'endStyle', 'THROUGH'), G.pn('holeDiameter', d), G.pb('oppositeDirection', opp), G.pq('scope', ...R)]);
  await H('Ramię: otwór wkrętu orczyka', lay('lOko.end'), '#wkretOrczykaD', true);
  await H('Ramię: otwór M2', G.q.vtx('Ramię: rama orczyka szkic', 'pM2'), '#m2Otwor', false);
  await H('Ramię: otwór przegubu', lay('lCH.end'), '#otworPrzegubuD', true);
});
G.ciegno = () => G.bryla('Cięgno', async () => {
  await G.plOffset('Cięgno: pl. płyty', G.q.std('Front'), '#ciegnoY');
  const s = new G.Sk('Cięgno: płyta szkic', G.q.plane('Cięgno: pl. płyty'));
  stadion(s, 'c', [7.382, -36.147], 4.2, [-9.235, -40.628], 4.2, lay('lCH.start'), lay('lCH.end'), '#ciegnoR', '#ciegnoR');
  await G.zapiszSzkic(s.feature());
  await G.ext('Cięgno: płyta', 'Cięgno: płyta szkic', { op: 'NEW', depth: '#plytaT', opp: true });
  const C = [G.q.body('Cięgno: płyta')];
  await G.plOffset('Cięgno: pl. podniesień', G.q.std('Front'), '#podniesienieY', true);
  const p = new G.Sk('Cięgno: podniesienia szkic', G.q.plane('Cięgno: pl. podniesień'));
  p.circle('pC', [7.382, -36.147], 7.6); p.circle('pH', [-9.235, -40.628], 7.6); p.coExt('pC.center', lay('lCH.start')); p.coExt('pH.center', lay('lCH.end')); p.ra('pC', '#podniesienieR'); p.ra('pH', '#podniesienieR');
  await G.zapiszSzkic(p.feature());
  await G.ext('Cięgno: podniesienia', 'Cięgno: podniesienia szkic', { op: 'ADD', depth: '#podniesienieH', opp: true, scope: C });
  await G.plOffset('Cięgno: pl. wkładek', G.q.std('Front'), '#ciegnoWkladkiY', true);
  const w = new G.Sk('Cięgno: wkładki szkic', G.q.plane('Cięgno: pl. wkładek'));
  w.point('wC', [7.382, -36.147]); w.point('wH', [-9.235, -40.628]); w.coExt('wC', lay('lCH.start')); w.coExt('wH', lay('lCH.end'));
  await G.zapiszSzkic(w.feature());
  await G.op('Cięgno: otwory i wkładki', 'hole', [G.pe('hole', 'style', 'C_BORE'), G.pq('locations', G.q.vtx('Cięgno: wkładki szkic', 'wC'), G.q.vtx('Cięgno: wkładki szkic', 'wH')), G.pe('hole', 'endStyle', 'THROUGH'),
    G.pn('holeDiameter', '#m3Luzny'), G.pn('cBoreDiameter', '#wkladkaD'), G.pn('cBoreDepth', '#ciegnoWkladkaGl'), G.pb('oppositeDirection', true), G.pq('scope', ...C)]);
});
G.tulejki = () => G.bryla('Tulejki', async () => {
  await G.plOffset('Tulejki: pl. kołnierza', G.q.std('Front'), '#tulejkaY');
  const k = new G.Sk('Tulejka korby: kołnierz szkic', G.q.plane('Tulejki: pl. kołnierza'));
  k.circle('kk', [7.382, -36.147], 8); k.coExt('kk.center', lay('lCH.start')); k.fi('kk', '#kolnierzD');
  await G.zapiszSzkic(k.feature());
  await G.ext('Tulejka korby: kołnierz', 'Tulejka korby: kołnierz szkic', { op: 'NEW', depth: '#kolnierzH', opp: true });
  const T = [G.q.body('Tulejka korby: kołnierz')];
  const t = new G.Sk('Tulejka korby: trzon szkic', G.q.plane('Tulejki: pl. kołnierza'));
  t.circle('tt', [7.382, -36.147], 5.6); t.coExt('tt.center', lay('lCH.start')); t.fi('tt', '#tulejkaD');
  await G.zapiszSzkic(t.feature());
  await G.ext('Tulejka korby: trzon', 'Tulejka korby: trzon szkic', { op: 'ADD', depth: '#tulejkaL', opp: true, scope: T });
  await G.op('Tulejka korby: otwór', 'hole', [G.pe('hole', 'style', 'SIMPLE'), G.pq('locations', lay('lCH.start')), G.pe('hole', 'endStyle', 'THROUGH'), G.pn('holeDiameter', '#m3Luzny'), G.pb('oppositeDirection', true), G.pq('scope', ...T)]);
  await G.op('Tulejka ramienia: kopia C→H', 'transform', [G.pq('entities', G.q.body('Tulejka korby: kołnierz')), G.pe('transform', 'transformType', 'TRANSLATION_ENTITY'),
    G.pq('transformLine', G.q.ent('Layout: osie i punkty', 'lCH')), G.pb('oppositeDirectionEntity', false), G.pb('makeCopy', true)]);
});
G.pokrywa = () => G.bryla('Pokrywa tylna', async () => {
  const s = new G.Sk('Pokrywa: płyta szkic', G.q.plane('Kaseta: pl. tyłu'));
  s.circle('pk', [0, 0], 54.5); s.naOrigin('pk.center'); s.ra('pk', '#kasetaODR');
  const ucho = (pre, sx) => { const E = [sx * 25.662, 21.533], M = [sx * 19.151, 16.07];
    s.line(pre + 'o', [0, 0], E, true); s.naOrigin(pre + 'o.start'); s.dx(pre + 'o.end', '#pokrywaEX'); s.dy(pre + 'o.end', '#pokrywaEY');
    s.circle(pre + 'E', E, 8.02); s.co(pre + 'E.center', pre + 'o.end'); s.ra(pre + 'E', '#pokrywaUchoR');
    s.circle(pre + 'M', M, 8.02, true); s.co(pre + 'M.center', pre + 'o'); DIST(s, pre + 'M.center', G.q.origin, '#pokrywaUchoR0'); s.eq(pre + 'M', pre + 'E');
    const n = [-Math.sin(40 * Math.PI / 180) * sx, Math.cos(40 * Math.PI / 180)]; const r = 4.01;
    s.line(pre + 't1', [M[0] + r * n[0], M[1] + r * n[1]], [E[0] + r * n[0], E[1] + r * n[1]]); s.line(pre + 't2', [M[0] - r * n[0], M[1] - r * n[1]], [E[0] - r * n[0], E[1] - r * n[1]]);
    for (const t of ['t1', 't2']) { s.co(pre + t + '.start', pre + 'M'); s.co(pre + t + '.end', pre + 'E'); s.tan(pre + t, pre + 'M'); s.tan(pre + t, pre + 'E'); } };
  ucho('uP', 1); ucho('uL', -1);
  prost(s, ['j1', 'j2', 'j3', 'j4'], [[-9, -38], [9, -38], [9, -20], [-9, -20]], ['#jezykPolSzer', '#jezykPolSzer', '#jezykY2', '#jezykY1']);
  await G.zapiszSzkic(s.feature());
  await G.ext('Pokrywa: płyta', 'Pokrywa: płyta szkic', { op: 'NEW', depth: '#pokrywaT', opp: true });
  const P = [G.q.body('Pokrywa: płyta')];
  const o = new G.Sk('Pokrywa: okno wtyczki szkic', G.q.plane('Kaseta: pl. tyłu'));
  o.poly(['w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8'], [[-4.5, -30.4], [4.5, -30.4], [4.5, -33.8], [1.9, -33.8], [1.9, -34.8], [-1.9, -34.8], [-1.9, -33.8], [-4.5, -33.8]]);
  o.H('w1'); o.V('w2'); o.H('w3'); o.V('w4'); o.H('w5'); o.V('w6'); o.H('w7'); o.V('w8');
  o.dx('w1.start', '#oknoPolSzer'); o.dx('w2.start', '#oknoPolSzer'); o.dy('w1.start', '#oknoY1'); o.dy('w3.start', '#oknoY2'); o.dx('w4.start', '#zaciskPolSzer'); o.dy('w5.start', '#zaciskY'); o.dx('w6.start', '#zaciskPolSzer'); o.dy('w8.start', '#oknoY2');
  await G.zapiszSzkic(o.feature());
  await G.ext('Pokrywa: okno wtyczki z zaciskiem', 'Pokrywa: okno wtyczki szkic', { op: 'REMOVE', through: true, opp: true, scope: P });
  await G.op('Pokrywa: otwory śrub', 'hole', [G.pe('hole', 'style', 'SIMPLE'), G.pq('locations', G.q.vtx('Kaseta: wkładki szkic', 'pW1'), G.q.vtx('Kaseta: wkładki szkic', 'pW2')), G.pe('hole', 'endStyle', 'THROUGH'),
    G.pn('holeDiameter', '#m3Luzny'), G.pb('oppositeDirection', false), G.pq('scope', ...P)]);
  await G.plOffset('Pokrywa: pl. prowadnic kabla', G.q.std('Top'), '#prowKablaZ', true);
  const k = new G.Sk('Pokrywa: prowadnice kabla szkic', G.q.plane('Pokrywa: pl. prowadnic kabla'));
  prost(k, ['a1', 'a2', 'a3', 'a4'], [[4.7, -36], [5.9, -36], [5.9, -29.5], [4.7, -29.5]], ['#prowKablaX1', '#prowKablaX2', '#prowKablaY2', '#prowKablaY1']);
  prost(k, ['c1', 'c2', 'c3', 'c4'], [[-5.9, -36], [-4.7, -36], [-4.7, -29.5], [-5.9, -29.5]], ['#prowKablaX2', '#prowKablaX1', '#prowKablaY2', '#prowKablaY1']);
  await G.zapiszSzkic(k.feature());
  await G.ext('Pokrywa: prowadnice kabla', 'Pokrywa: prowadnice kabla szkic', { op: 'ADD', depth: '#prowKablaH', scope: P });
});
return 'reszta ok';
})();

// ===================== v2.5: Jarzmo – korba, petla 2 (kropla piasty C, v2.4 p.35-60), przywrocona 19.10 na polecenie orkiestratora =====================
(() => {
const G = window.G; const L = 'LENGTH', A = 'ANGLE';
G.ZM.jarzmo.push(['korbaP35R', L, '21.072 mm', 21.072, 'kropla piasty C (v2.4 p.35)'], ['korbaKat35', A, '58.8 deg', 58.8, ''], ['korbaKat36', A, '72.5 deg', 72.5, ''], ['korbaKat38', A, '77.87 deg', 77.87, ''], ['kP39Kat', A, '138.7 deg', 138.7, ''],
  ['kP35x', L, '#korbaP35R * cos(#korbaKat35)', 10.917, ''], ['kP35z', L, '#oczkoZ + #korbaP35R * sin(#korbaKat35)', 30.023, ''], ['kP36x', L, '#korbaR1 * cos(#korbaKat36)', 6.285, ''], ['kP38x', L, '#korbaR1 * cos(#korbaKat38)', 4.39, ''],
  ['kP39x', L, '#cX + #korbaPiastaR * cos(#kP39Kat)', 3.624, '']);
// dopisywane do szkicu "Jarzmo: korba szkic" (edycja featureid), po petli 1 i okregu kC:
G.korbaPetla2 = (b, lay) => {
  b.arc('kA', [7.382, -36.147], 5, 138.7, 375); b.arc('kE', [0, -12], 20.9, -77.87, -72.5);
  b.line('m1', [12.212, -34.853], [10.917, -30.023]); b.line('m2', [10.917, -30.023], [6.285, -31.933]); b.line('m3', [4.39, -32.433], [3.624, -32.85]);
  b.co('kA.end', 'm1.start'); b.co('m1.end', 'm2.start'); b.co('m2.end', 'kE.end'); b.co('kE.start', 'm3.start'); b.co('m3.end', 'kA.start');
  b.coExt('kA.center', lay('lCH.start')); b.coExt('kE.center', G.oko()); b.ra('kA', '#korbaPiastaR'); b.ra('kE', '#korbaR1'); b.tan('m1', 'kA');
  b.dx('m1.end', '#kP35x'); b.dy('m1.end', '#kP35z'); b.dx('kE.end', '#kP36x'); b.dx('kE.start', '#kP38x'); b.dx('kA.start', '#kP39x'); };
return 'korba petla 2';
})();
