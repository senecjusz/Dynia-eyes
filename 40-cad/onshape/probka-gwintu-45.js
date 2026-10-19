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
G.BUDZET = { features: 200, total: 200, getFeatures: 30 };   // brief E2.0 (szesc brył): <=30 GET /features, <=200 lacznie
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

// ===================== etap 2: budowa szesciu brył (plan zatwierdzony: e2.0-etap1b.md) =====================
// Uzycie w karcie: G.przygotuj*() raz, potem jedna bryla na uruchomienie: G.folder1(), G.nakretka(1..5), G.trzpien();
// po kazdej bryle folder w UI, G.mvOdswiez(), G.pomiar().
(() => {
const G = window.G;
G.etap2 = G.etap2 || {};
G.etap2.czasy = G.etap2.czasy || [];
G.etap2.pomiary = G.etap2.pomiary || [];
G.F = G.F || {};
const Q = (s) => ({ btType: 'BTMIndividualQuery-138', queryString: s });
const pq = (id, ...qs) => ({ btType: 'BTMParameterQueryList-148', parameterId: id, queries: qs.map(Q) });
const pn = (id, e, isInteger = false) => ({ btType: 'BTMParameterQuantity-147', parameterId: id, expression: String(e), isInteger });
const pb = (id, v) => ({ btType: 'BTMParameterBoolean-144', parameterId: id, value: v });
const pstr = (id, v) => ({ btType: 'BTMParameterString-149', parameterId: id, value: v });
G.en = (ft, id) => { const e = G.enums && G.enums[ft] && G.enums[ft][id];
  if (!e) throw new Error(`brak enumName ${ft}.${id}: najpierw G.wczytajSpecs()`); return e; };
const pe = (ft, id, v) => ({ btType: 'BTMParameterEnum-145', parameterId: id, enumName: G.en(ft, id), value: v });
const fid = (n) => { if (!G.F[n]) throw new Error('brak featureId: ' + n); return G.F[n]; };
Object.assign(G, { Q, pq, pn, pb, pstr, pe, fid });
G.q = {
  origin: 'query=qCreatedBy(makeId("Origin"), EntityType.VERTEX);',
  plane: (n) => `query=qCreatedBy(makeId("${n}"), EntityType.FACE);`,       // Top / Front / Right
  body: (n) => `query=qCreatedBy(makeId("${fid(n)}"), EntityType.BODY);`,
  edges: (n) => `query=qCreatedBy(makeId("${fid(n)}"), EntityType.EDGE);`,
  region: (n) => `query=qSketchRegion(makeId("${fid(n)}"), true);`,
  ent: (n, e) => `query=sketchEntityQuery(makeId("${fid(n)}"), EntityType.EDGE, "${e}");`,
};
G.osZ = () => G.q.ent('Layout: oś Z i przekrój trzpienia', 'osZ');

// enumy z jednego odczytu featurespecs (licznik osobny, nie /features)
G.TYPY = ['extrude', 'revolve', 'helix', 'sweep', 'booleanBodies', 'circularPattern'];
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

// szkic: wspolrzedne startowe w mm (tylko start solvera); polozenie i rozmiar z wymiarow #zmienna do Origin, bez Fix
G.Sk = class {
  constructor(name, planeQ) { this.name = name; this.planeQ = planeQ; this.e = []; this.c = []; this.k = 0; }
  con(type, params) { this.c.push({ btType: 'BTMSketchConstraint-2', constraintType: type,
    entityId: 'k' + this.name.replace(/[^A-Za-z0-9]/g, '').slice(0, 12) + (++this.k), parameters: params }); }
  line(id, a, b, constr = false) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    this.e.push({ btType: 'BTMSketchCurveSegment-155', entityId: id, startPointId: id + '.start', endPointId: id + '.end', startParam: 0, endParam: L / 1000,
      isConstruction: constr, geometry: { btType: 'BTCurveGeometryLine-117', pntX: a[0] / 1000, pntY: a[1] / 1000, dirX: (b[0] - a[0]) / L, dirY: (b[1] - a[1]) / L } });
    return id;
  }
  circle(id, c, d) {
    this.e.push({ btType: 'BTMSketchCurve-4', entityId: id, centerId: id + '.center',
      geometry: { btType: 'BTCurveGeometryCircle-115', radius: d / 2000, xCenter: c[0] / 1000, yCenter: c[1] / 1000, xDir: 1, yDir: 0, clockwise: false } });
    return id;
  }
  // zamkniety wielokat: linia ids[i] od pts[i] do pts[i+1]; punkt i = ids[i].start
  poly(ids, pts) {
    ids.forEach((id, i) => this.line(id, pts[i], pts[(i + 1) % pts.length]));
    ids.forEach((id, i) => this.con('COINCIDENT', [pstr('localFirst', id + '.end'), pstr('localSecond', ids[(i + 1) % ids.length] + '.start')]));
  }
  H(l) { this.con('HORIZONTAL', [pstr('localFirst', l)]); }
  V(l) { this.con('VERTICAL', [pstr('localFirst', l)]); }
  naOrigin(pt) { this.con('COINCIDENT', [pstr('localFirst', pt), pq('externalSecond', G.q.origin)]); }
  dx(pt, expr) { this.con('DISTANCE', [pstr('localFirst', pt), pq('externalSecond', G.q.origin), { btType: 'BTMParameterEnum-145', parameterId: 'direction', enumName: 'DimensionDirection', value: 'HORIZONTAL' }, pn('length', expr)]); }
  dy(pt, expr) { this.con('DISTANCE', [pstr('localFirst', pt), pq('externalSecond', G.q.origin), { btType: 'BTMParameterEnum-145', parameterId: 'direction', enumName: 'DimensionDirection', value: 'VERTICAL' }, pn('length', expr)]); }
  dl(l, expr) { this.con('DISTANCE', [pstr('localFirst', l + '.start'), pstr('localSecond', l + '.end'), { btType: 'BTMParameterEnum-145', parameterId: 'direction', enumName: 'DimensionDirection', value: 'MINIMUM' }, pn('length', expr)]); }
  fi(c, expr) { this.con('DIAMETER', [pstr('localFirst', c), pn('length', expr)]); }
  feature() { return { btType: 'BTMSketch-151', featureType: 'newSketch', name: this.name, parameters: [pq('sketchPlane', this.planeQ)], entities: this.e, constraints: this.c }; }
};
G.op = (name, featureType, parameters) => G.zapisz({ btType: 'BTMFeature-134', featureType, name, parameters });

// ---- operacje (nazwy parametrow jak w v2.2 i pomiarze featurespecs 19.10) ----
G.revolve = (name, regionQ, op, scopeQs) => {
  const p = [pe('revolve', 'bodyType', 'SOLID'), pe('revolve', 'operationType', op), pq('entities', regionQ), pq('axis', G.osZ())];
  if (G.enums.revolve.revolveType) p.push(pe('revolve', 'revolveType', 'FULL'));
  else p.push(pb('fullRevolve', true), pn('angle', '360 deg'));
  if (scopeQs) p.push(pb('defaultScope', false), pq('booleanScope', ...scopeQs));
  return G.op(name, 'revolve', p);
};
G.helix = (name, circleSk) => G.op(name, 'helix', [pe('helix', 'axisType', 'CIRCLE'), pq('edge', G.q.edges(circleSk)), pq('entities', G.q.edges(circleSk)),
  pe('helix', 'pathType', 'PITCH'), pe('helix', 'endType', 'HEIGHT'), pn('height', '#helisaH'), pn('helicalPitch', '#gwintSkok'),
  pe('helix', 'startType', 'START_ANGLE'), pn('startAngle', '0 deg'), pe('helix', 'handedness', 'CW')]);
G.sweep = (name, profSk, path) => G.op(name, 'sweep', [pe('sweep', 'bodyType', 'SOLID'), pe('sweep', 'operationType', 'NEW'),
  pq('profiles', G.q.region(profSk)), pq('path', G.q.edges(path)), pe('sweep', 'profileControl', 'NONE')]);
// BooleanOperationType: UNION / SUBTRACTION / INTERSECTION (19.10: 'SUBTRACT' = HTTP 400)
G.boolean = (name, type, toolQs, targetQs, o = {}) => {
  const p = [pe('booleanBodies', 'operationType', ({ SUBTRACT: 'SUBTRACTION' })[type] || type), pq('tools', ...toolQs)];
  if (targetQs) p.push(pq('targets', ...targetQs));
  if (o.keep) p.push(pb('keepTools', true));
  if (o.offset) p.push(pb('offset', true), pb('offsetAll', true), pn('offsetDistance', o.offset));
  return G.op(name, 'booleanBodies', p);
};
G.extrudeRemove = (name, sk, scopeQ) => G.op(name, 'extrude', [pe('extrude', 'bodyType', 'SOLID'), pe('extrude', 'operationType', 'REMOVE'),
  pq('entities', G.q.region(sk)), pe('extrude', 'endBound', 'THROUGH_ALL'), pb('oppositeDirection', false),
  pb('defaultScope', false), pq('booleanScope', scopeQ)]);
G.szyk = (name, featName, count) => G.op(name, 'circularPattern', [pe('circularPattern', 'patternType', 'FEATURE'),
  { btType: 'BTMParameterFeatureList-1749', parameterId: 'instanceFunction', featureIds: [fid(featName)] },
  pq('axis', G.osZ()), pn('angle', '#karbKat'), pn('instanceCount', count, true), pb('equalSpace', false)]);

// ---- pomiar czasu bryly ----
G.bryla = async (nazwa, fn) => {
  const t0 = new Date(); const ops0 = Object.keys(G.F).length;
  try { await fn(); } finally {
    G.etap2.czasy.push({ bryla: nazwa, start: t0.toISOString(), koniecSkryptu: new Date().toISOString(), msSkryptu: Date.now() - t0, operacje: Object.keys(G.F).length - ops0, stop: G.stop });
  }
  return G.etap2.czasy[G.etap2.czasy.length - 1];
};

// ---- folder 1: Wspolne: os i gwint ----
G.folder1 = () => G.bryla('Wspólne: oś i gwint', async () => {
  const s1 = new G.Sk('Layout: oś Z i przekrój trzpienia', G.q.plane('Front'));
  s1.line('osZ', [0, 0], [0, 63.8], true); s1.naOrigin('osZ.start'); s1.V('osZ'); s1.dl('osZ', '#przycieciaGora');
  s1.poly(['rD', 'rP', 'rG', 'rL'], [[27.45, 5], [29.45, 5], [29.45, 54], [27.45, 54]]);
  s1.H('rD'); s1.V('rP'); s1.H('rG'); s1.V('rL');
  s1.dx('rD.start', '#trzpienOtworR'); s1.dx('rP.start', '#gwintRdzenR'); s1.dy('rD.start', '#trzpienZ'); s1.dy('rG.start', '#trzpienGora');
  await G.zapiszSzkic(s1.feature());

  const s2 = new G.Sk('Layout: okrąg helisy', G.q.plane('Top'));
  s2.circle('cH', [0, 0], 58.9); s2.naOrigin('cH.center'); s2.fi('cH', '#gwintRdzenD');
  await G.zapiszSzkic(s2.feature());

  await G.helix('Wspólne: helisa', 'Layout: okrąg helisy');

  // trapez: A(wew, -pol.podst.) B(rdzen, -pol.podst.) C(gwintR, -pol.czola) D(gwintR, +pol.czola) E(rdzen, +pol.podst.) F(wew, +pol.podst.)
  const s3 = new G.Sk('Wspólne: profil gwintu', G.q.plane('Front'));
  s3.poly(['pAB', 'pBC', 'pCD', 'pDE', 'pEF', 'pFA'], [[29.05, -2.4], [29.45, -2.4], [31.45, -0.4], [31.45, 0.4], [29.45, 2.4], [29.05, 2.4]]);
  s3.H('pAB'); s3.V('pCD'); s3.H('pEF'); s3.V('pFA');
  s3.dx('pAB.start', '#gwintWewR'); s3.dy('pAB.start', '#gwintPolPodstawy'); s3.dx('pBC.start', '#gwintRdzenR');
  s3.dx('pCD.start', '#gwintR'); s3.dy('pCD.start', '#gwintPolCzola'); s3.dy('pDE.start', '#gwintPolCzola');
  s3.dx('pEF.start', '#gwintRdzenR'); s3.dy('pEF.start', '#gwintPolPodstawy');
  await G.zapiszSzkic(s3.feature());

  const s4 = new G.Sk('Wspólne: karb', G.q.plane('Top'));
  s4.poly(['kD', 'kP', 'kG', 'kL'], [[36, -0.75], [38, -0.75], [38, 0.75], [36, 0.75]]);
  s4.H('kD'); s4.V('kP'); s4.H('kG'); s4.V('kL');
  s4.dx('kD.start', '#nakretkaR - #karbGl'); s4.dx('kP.start', '#nakretkaR + #zapas'); s4.dy('kD.start', '#karbPolSzer'); s4.dy('kG.start', '#karbPolSzer');
  await G.zapiszSzkic(s4.feature());

  await G.sweep('Wspólne: zwój gwintu', 'Wspólne: profil gwintu', 'Wspólne: helisa');
});

// ---- foldery 2-6: nakretka i (luz 0.20 ... 0.40) ----
G.LUZY = { 1: '0.20', 2: '0.25', 3: '0.30', 4: '0.35', 5: '0.40' };
G.nakretka = (i) => { const L = G.LUZY[i], N = `Nakrętka ${L}`;
  return G.bryla(N, async () => {
    const luz = Number(L), Z = 8 + 9 * (i - 1), Ri = 29.45 + luz, f = 1, R = 37, H = 7;
    const zI = `#nakretkaZ${i}`, ri = `#gwintRdzenR + #luzNakretka${i}`;
    const s = new G.Sk(`${N}: przekrój`, G.q.plane('Front'));
    // P1(ri+f, Z) P2(R, Z) P3(R, Z+H) P4(ri+f, Z+H) P5(ri, Z+H-f) P6(ri, Z+f)
    s.poly(['nD', 'nZ', 'nG', 'nFg', 'nW', 'nFd'], [[Ri + f, Z], [R, Z], [R, Z + H], [Ri + f, Z + H], [Ri, Z + H - f], [Ri, Z + f]]);
    s.H('nD'); s.V('nZ'); s.H('nG'); s.V('nW');
    s.dy('nD.start', zI); s.dx('nZ.start', '#nakretkaR'); s.dy('nG.start', `${zI} + #nakretkaH`);
    s.dx('nD.start', `${ri} + #nakretkaFaza`); s.dx('nFg.start', `${ri} + #nakretkaFaza`);
    s.dx('nW.start', ri); s.dy('nW.start', `${zI} + #nakretkaH - #nakretkaFaza`); s.dy('nFd.start', `${zI} + #nakretkaFaza`);
    await G.zapiszSzkic(s.feature());
    await G.revolve(`${N}: korpus`, G.q.region(`${N}: przekrój`), 'NEW');
    await G.boolean(`${N}: gwint`, 'SUBTRACT', [G.q.body('Wspólne: zwój gwintu')], [G.q.body(`${N}: korpus`)], { keep: true, offset: `#luzNakretka${i}` });
    await G.extrudeRemove(`${N}: karb`, 'Wspólne: karb', G.q.body(`${N}: korpus`));
    if (i > 1) await G.szyk(`${N}: karby`, `${N}: karb`, `#karbyN${i}`);
  }); };

// ---- folder 7: Trzpien ----
G.trzpien = () => G.bryla('Trzpień', async () => {
  const s = new G.Sk('Trzpień: przycięcie końców zwoju i faza', G.q.plane('Front'));
  // dol: prostokat R przycieciaWewR..przycieciaR, z -gwintPodstawa..trzpienZ
  s.poly(['dD', 'dP', 'dG', 'dL'], [[28.05, -4.8], [32.45, -4.8], [32.45, 5], [28.05, 5]]);
  s.H('dD'); s.V('dP'); s.H('dG'); s.V('dL');
  s.dx('dD.start', '#przycieciaWewR'); s.dx('dP.start', '#przycieciaR'); s.dy('dD.start', '#gwintPodstawa'); s.dy('dG.start', '#trzpienZ');
  // gora: T1(rdzen, gora) -faza-> T2(przycieciaR, fazaDolZ) -> T3(przycieciaR, przycieciaGora) -> T4(wew, przycieciaGora) -> T5(wew, gora)
  s.poly(['gF', 'gP', 'gG', 'gL', 'gD'], [[29.45, 54], [32.45, 51], [32.45, 63.8], [28.05, 63.8], [28.05, 54]]);
  s.V('gP'); s.H('gG'); s.V('gL'); s.H('gD');
  s.dx('gF.start', '#gwintRdzenR'); s.dy('gF.start', '#trzpienGora'); s.dx('gP.start', '#przycieciaR'); s.dy('gP.start', '#fazaDolZ');
  s.dy('gG.start', '#przycieciaGora'); s.dx('gL.start', '#przycieciaWewR');
  await G.zapiszSzkic(s.feature());
  await G.revolve('Trzpień: rdzeń', G.q.region('Layout: oś Z i przekrój trzpienia'), 'NEW');
  await G.boolean('Trzpień: gwint', 'UNION', [G.q.body('Trzpień: rdzeń'), G.q.body('Wspólne: zwój gwintu')]);
  // zakres tylko rdzen: po UNION zwoj nie istnieje jako bryla; zapytanie o niego dawalo w drzewie '1 missing selection'
  // przy featureStatus OK w odpowiedzi zapisu (19.10, poprawione edycja featureid)
  await G.revolve('Trzpień: przycięcie końców zwoju i faza wejścia', G.q.region('Trzpień: przycięcie końców zwoju i faza'), 'REMOVE',
    [G.q.body('Trzpień: rdzeń')]);
});

// dokonczenie nakretki po poprawce jednej operacji (bez ponownego wysylania zapisanych)
G.nakretkaReszta = async (i) => { const N = `Nakrętka ${G.LUZY[i]}`;
  if (!G.F[`${N}: gwint`]) await G.boolean(`${N}: gwint`, 'SUBTRACT', [G.q.body('Wspólne: zwój gwintu')], [G.q.body(`${N}: korpus`)], { keep: true, offset: `#luzNakretka${i}` });
  if (!G.F[`${N}: karb`]) await G.extrudeRemove(`${N}: karb`, 'Wspólne: karb', G.q.body(`${N}: korpus`));
  if (i > 1 && !G.F[`${N}: karby`]) await G.szyk(`${N}: karby`, `${N}: karb`, `#karbyN${i}`); };

// ---- drzewo w karcie (bez API): wciecie 19 px = w folderze; pozycje wierszy do klikania ----
G.drzewoUI = () => [...document.querySelectorAll('.os-list-item')].map(it => { const ind = it.querySelector('.node-indent');
  const lab = it.querySelector('.os-list-item-label'); return { fid: it.getAttribute('feature-id'), tekst: (lab ? lab.textContent : it.textContent).trim().slice(0, 50), wciecie: ind ? Math.round(ind.getBoundingClientRect().width) : null }; });
G.pozycja = (fid) => { const it = document.querySelector(`.os-list-item[feature-id="${fid}"]`); if (!it) return null; const r = it.getBoundingClientRect(); return [Math.round(r.left + 60), Math.round(r.top + r.height / 2)]; };
G.pozycjeBryly = (N) => Object.keys(G.F).filter(k => k.startsWith(N + ':')).map(k => [k, G.pozycja(G.F[k])]);

// ---- microversion po zmianach w UI (foldery) ----
G.mvOdswiez = async () => { const c = G.ctx();
  const r = await G.req('GET', `/api/v12/documents/d/${c.did}/w/${c.wid}/currentmicroversion`);
  if (!r.ok) throw new Error('currentmicroversion HTTP ' + r.status);
  G.mv = r.json.microversion; return G.mv; };

// ---- pomiar: bodydetails (wszystkie bryly) + boundingboxes jednej bryly ----
const mm = (v) => Math.round(v * 1e6) / 1e3;
// bodydetails: typy scian wielkimi literami (PLANE, CYLINDER, CONE, OTHER); jednostki m
G.parsujCiala = (bd) => bd.bodies.map((b) => {
  const cyl = new Set(), zpl = new Set(), inne = [], typy = {};
  for (const f of b.faces || []) {
    const s = f.surface || {}; const t = String(s.type).toLowerCase(); typy[t] = (typy[t] || 0) + 1;
    if (t === 'cylinder') cyl.add(mm(s.radius));
    else if (t === 'plane' && s.normal && Math.abs(Math.abs(s.normal.z) - 1) < 1e-9) zpl.add(mm(s.origin.z));
    else if (t === 'plane') inne.push({ o: [mm(s.origin.x), mm(s.origin.y), mm(s.origin.z)], n: [s.normal.x, s.normal.y, s.normal.z].map(v => Math.round(v * 1e4) / 1e4) });
    else if (t === 'cone') inne.push({ stozek: true, o: s.origin && [mm(s.origin.x), mm(s.origin.y), mm(s.origin.z)], kat: s.halfAngle });
  }
  return { id: b.id, typ: b.type, ściany: (b.faces || []).length, typyŚcian: typy, walceR: [...cyl].sort((a, b) => a - b), płaszczyznyZ: [...zpl].sort((a, b) => a - b), inne };
});
G.ciala = async () => { const r = await G.req('GET', G.ps() + '/bodydetails'); if (!r.ok) throw new Error('bodydetails HTTP ' + r.status); G._bd = r.json; return G.parsujCiala(r.json); };
G.bbox = async (partId) => { const c = G.ctx();
  const r = await G.req('GET', `/api/v12/parts/d/${c.did}/w/${c.wid}/e/${c.eid}/partid/${encodeURIComponent(partId)}/boundingboxes`);
  if (!r.ok) throw new Error('boundingboxes HTTP ' + r.status);
  const j = r.json; return { x: [mm(j.lowX), mm(j.highX)], y: [mm(j.lowY), mm(j.highY)], z: [mm(j.lowZ), mm(j.highZ)] }; };
// pomiar nakretki i wobec planu (stop przy odchylce > 0.05 mm); bbox z nie jest ciasny przy helikoidzie, z i R z bodydetails
G.pomiarNakretki = async (i) => { const L = G.LUZY[i], luz = Number(L), Z = 8 + 9 * (i - 1);
  await G.mvOdswiez();
  const c = await G.ciala();
  const nak = c.filter(x => x.płaszczyznyZ.includes(Z) && x.płaszczyznyZ.includes(Z + 7));
  const b = nak.length === 1 ? await G.bbox(nak[0].id) : null;
  const ocz = { z: [Z, Z + 7], walceR: [+(29.45 + luz).toFixed(3), +(31.45 + luz).toFixed(3), 37], xy: 37, xMax: 36.992, ściany: 12 + 3 * (i - 1) };
  const p = { bryla: `Nakrętka ${L}`, t: new Date().toISOString(), ciala: c, bbox: b, oczekiwane: ocz };
  G.etap2.pomiary.push(p); G.etap2.czasy.at(-1).koniecZFolderemIPomiarem = new Date().toISOString();
  return p; };
// ocena nakretki wobec planu po decyzji (a) orkiestratora 19.10: walec otworu znika dla L >= 0.2415 (zwoj z offsetem L
// ma na R otworu szerokosc osiowa 4.8 + 0.828 L >= skok 5); srednica wewnetrzna = max(29.45 + L, 29.35 + 1.414 L); sciany 8+4n / 7+4n
G.ocenNakretke = (i, p) => { const L = Number(G.LUZY[i]), Z = 8 + 9 * (i - 1), otwor = L < 0.2415;
  const ocz = { z: [Z, Z + 7], walceR: (otwor ? [29.45 + L] : []).concat([31.45 + L, 37]).map(r => +r.toFixed(3)), xMax: 36.992, xy: 37,
    ściany: otwor ? 8 + 4 * i : 7 + 4 * i, grzbietR: +Math.max(29.45 + L, 29.35 + Math.SQRT2 * L).toFixed(3) };
  const n0 = p.ciala.find(x => x.płaszczyznyZ.includes(Z) && x.płaszczyznyZ.includes(Z + 7)) || {}; const R = n0.walceR || [];
  const odch = R.length === ocz.walceR.length ? Math.max(...ocz.walceR.map((r, j) => Math.abs(r - R[j])), ...ocz.z.map((z, j) => Math.abs(z - n0.płaszczyznyZ[j])), Math.abs(p.bbox.x[1] - ocz.xMax), Math.abs(p.bbox.y[1] - ocz.xy)) : null;
  p.oczekiwane = ocz; p.wynik = { id: n0.id, ściany: n0.ściany, walceR: R, z: n0.płaszczyznyZ, maxOdchylkaMm: odch, zgodnosc: odch !== null && odch <= 0.05 && n0.ściany === ocz.ściany };
  return p.wynik; };
const _pom = G.pomiarNakretki; G.pomiarNakretki = async (i) => { const p = await _pom(i); G.ocenNakretke(i, p); return p; };
// weryfikacja w karcie (bez API): K2 znaczniki szkicow, K11 wciecie i ikony; foldery zwiniete -> ikona ostrzezenia w srodku
// (API GET /features zwrocilo featureStates = {} 19.10, wiec K1 i stany w K9 z ikon w drzewie)
G._k2 = {}; G._k11 = {};
G.zbierzK2 = () => { const sk = G._fj.features.filter(f => f.featureType === 'newSketch');
  sk.forEach(f => { const w = G.wiersz(f.featureId); if (w) G._k2[f.name] = { fid: f.featureId, dataId: w.id, tytul: w.tytul, niedookreslony: w.niedookreslony }; });
  G._fj.features.forEach(f => { const it = document.querySelector(`.os-list-item[feature-id="${f.featureId}"]`); if (it) { const ind = it.querySelector('.node-indent'); const uses = [...it.querySelectorAll('use')].map(u => (u.getAttribute('href') || u.getAttributeNS('http://www.w3.org/1999/xlink', 'href') || '').replace(/^.*#/, '')); G._k11[f.name] = { wciecie: ind ? Math.round(ind.getBoundingClientRect().width) : null, ostrzezenie: uses.some(u => /warn|error/i.test(u)) }; } });
  return { szkiceZebrane: Object.keys(G._k2).length, operacjeZebrane: Object.keys(G._k11).length }; };
G.folderyUI = () => [...document.querySelectorAll('.os-list-item[feature-id]')].filter(it => it.querySelector('use[*|href*="svg-icon-folder"]')).map(it => { const uses = [...it.querySelectorAll('use')].map(u => (u.getAttribute('href') || u.getAttributeNS('http://www.w3.org/1999/xlink', 'href') || '').replace(/^.*#/, '')); return [it.querySelector('.os-list-item-label').textContent.trim(), uses.filter(u => /collapsed|expanded|warn|error/.test(u)).join(',')]; });
// zrzut kompaktowy stanu do scalenia z stan-api.json
G._logOd = G._logOd || 0;
G.zrzutK = () => { const out = { n: G.n, mv: G.mv, stop: G.stop, rem: G.rem, F: G.F, szkice: G.szkice, logNowe: G.log.slice(G._logOd), etap2: G.etap2 }; G._logOd = G.log.length; return JSON.stringify(out); };
return 'etap2 ok';
})();
