// Duze oko v1 (E6): skrypt wykonawcy; bramka, kontrola szkicu i pomocnicze przeniesione z oko-f-v2.5-build.js (E2.1)
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
G.BUDZET = { features: 400, total: 40, getFeatures: 2 };    // E6 etap 1: dokument, elementy, Variable Studio, odczyty startowe; etap 2 wg e6-plan.md
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
// 19.10: lista drzewa jest wirtualizowana (zwiniety folder / wiersz poza oknem = brak w DOM); przed stopem skan przewijanej listy
// karta ukryta (regula orkiestratora): jedno ponowienie po 15 s, potem stop
G.czekajNaWiersz = ((czekaj) => async (fid, warunek, limitMs) => { try { return await czekaj(fid, warunek, limitMs); } catch (e) {
  if (document.visibilityState === 'hidden') { G.log.push({ t: new Date().toISOString(), uwaga: 'wiersz ' + fid + ' brak, karta hidden: ponowienie po 15 s' }); await new Promise((r) => setTimeout(r, 15000)); try { return await czekaj(fid, warunek, limitMs); } catch (e2) { G.stop = 'karta hidden: wiersz ' + fid + ' brak po ponowieniu'; throw e2; } }
  let el = document.querySelector('.os-list-item[feature-id]'); while (el && !(el.scrollHeight > el.clientHeight + 5 && /auto|scroll/.test(getComputedStyle(el).overflowY))) el = el.parentElement;
  if (!el) throw e; const t0 = performance.now();
  for (let y = 0; y <= el.scrollHeight; y += Math.max(100, el.clientHeight / 2)) { el.scrollTop = y; await new Promise((r) => setTimeout(r, 300)); const w = G.wiersz(fid); if (w && warunek(w)) { G.log.push({ t: new Date().toISOString(), uwaga: 'wiersz ' + fid + ' znaleziony skanem listy' }); return { w, ms: Math.round(performance.now() - t0) }; } }
  throw e; } })(G.czekajNaWiersz);

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

// ===================== wspolne (z E2.1) =====================
(() => {
const G = window.G;
if (!G.VS) G.VS = null;
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
G.VS = G.VS || null;   // Variable Studio "Zmienne duze oko": ustawiane po utworzeniu (etap 1)
G.zapiszZmienne = async (V) => { const c = G.ctx(); const url = `/api/v12/variables/d/${c.did}/w/${c.wid}/e/${G.VS}/variables`;
  const jedn = { LENGTH: ' mm', ANGLE: ' deg', NUMBER: '' };
  const r1 = await G.req('POST', url, V.map(([name, type, , v, description]) => ({ name, type, expression: String(v) + jedn[type], description: description || '' })));
  if (!r1.ok) throw new Error('zmienne 1: HTTP ' + r1.status + ' ' + JSON.stringify(r1.json || r1.text).slice(0, 200));
  const r2 = await G.req('POST', url, V.map(([name, type, expression, , description]) => ({ name, type, expression, description: description || '' })));
  if (!r2.ok) throw new Error('zmienne 2: HTTP ' + r2.status + ' ' + JSON.stringify(r2.json || r2.text).slice(0, 200));
  G.etap2.zmienne = { liczba: V.length, t: new Date().toISOString() }; G._V = V; return V.length; };
G._logOd = G._logOd || 0;
G.zrzutK = () => { const out = { n: G.n, mv: G.mv, stop: G.stop, rem: G.rem, F: G.F, szkice: G.szkice, logNowe: G.log.slice(G._logOd), etap2: G.etap2 }; G._logOd = G.log.length; return JSON.stringify(out); };
return 'wspolne ok';
})();
