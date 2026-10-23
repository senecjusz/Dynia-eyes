// E6.6 (etap 2b): skrypt wykonawcy w karcie cad.onshape.com, dokument „Duże oko v1”.
// Bramka req(), kontrola zapisu (stan OK + wiersz w drzewie bez ostrzeżeń, szkic bez znacznika „underdefined”) i budowa szkiców
// – skrót z duze-oko-v1-build.js (te same reguły). Wklej do konsoli karty po każdym przeładowaniu strony.
(() => {
const G = window.G = window.G || {};
G.PROG = 20;
G.BUDZET = G.BUDZET || { total: 34, getFeatures: 0 };     // P4: 34 (plan e6.6-plan-p4.md), GET /features 0
G.rem = G.rem || {}; G.log = G.log || []; G.n = G.n || { total: 0, getFeatures: 0 }; G.busy = false; G.stop = G.stop || null;
G.F = G.F || {}; G.mv = G.mv || null; G.kontrola = G.kontrola || [];
G.doc = { did: 'b8cc184e37d6a8dbfb63c30b', wid: 'abf573bb580a27e085f1d73e', eid: '045583ad9368d7b383c9477f', vs: '5d1a01286f0f4439abd87cc4' };
G.ps = `/api/v12/partstudios/d/${G.doc.did}/w/${G.doc.wid}/e/${G.doc.eid}`;
const xsrf = () => decodeURIComponent((document.cookie.match(/XSRF-TOKEN=([^;]+)/) || [])[1] || '');
G.key = (m, url) => m.toUpperCase() + ' ' + new URL(url, location.origin).pathname.replace(/^\/api\/v\d+/, '')
  .replace(/\/(d|w|v|m|e|featureid)\/[^/]+/g, '/$1/{id}').replace(/\/[0-9a-f]{24}(?=\/|$)/g, '/{id}').replace(/\/partid\/[^/]+/, '/partid/{id}');
G.req = async (method, url, body) => {
  const k = G.key(method, url), teraz = new Date().toISOString();
  const blok = (msg) => { G.stop = G.stop || msg; G.log.push({ t: teraz, k, blokada: msg }); throw new Error('BRAMKA: ' + msg); };
  if (G.stop) throw new Error('BRAMKA: stop aktywny (' + G.stop + ')');
  if (G.busy) blok('drugie żądanie w trakcie');
  if (/\/featurescript/.test(url)) blok('zakaz /featurescript');
  if (G.n.total >= G.BUDZET.total) blok(`budżet ${G.BUDZET.total} wyczerpany`);
  const getF = /^GET .*\/features$/.test(k);
  if (getF && G.n.getFeatures >= G.BUDZET.getFeatures) blok(`budżet GET /features ${G.BUDZET.getFeatures} wyczerpany`);
  if (k in G.rem) { const r = G.rem[k].remaining; if (r === null || Number.isNaN(r)) blok('brak X-Rate-Limit-Remaining (' + k + ')'); if (r <= G.PROG) blok(`remaining ${r} <= ${G.PROG} (${k})`); }
  G.busy = true; let r;
  try { r = await fetch(url, { method, credentials: 'include', headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrf() },
    body: body === undefined ? undefined : JSON.stringify(body) }); }
  catch (e) { G.busy = false; blok('błąd sieci: ' + e.message); }
  G.n.total++; if (getF) G.n.getFeatures++;
  const h = r.headers.get('X-Rate-Limit-Remaining'), remaining = h === null ? null : Number(h), start = !(k in G.rem);
  G.rem[k] = { remaining, t: teraz };
  const txt = await r.text(); let json = null; try { json = JSON.parse(txt); } catch (e) {}
  if (json && json.sourceMicroversion) G.mv = json.sourceMicroversion;
  G.log.push({ t: teraz, k, status: r.status, remaining, odczytStartowy: start });
  G.busy = false;
  if (r.status === 429 || r.status === 402) { G.stop = `HTTP ${r.status} (${k}), Retry-After ${r.headers.get('Retry-After')}`; throw new Error('STOP: ' + G.stop); }
  return { status: r.status, ok: r.ok, remaining, json, text: json ? null : txt.slice(0, 500) };
};
G.mvOdswiez = async () => { const r = await G.req('GET', `/api/v12/documents/d/${G.doc.did}/w/${G.doc.wid}/currentmicroversion`); if (!r.ok) throw new Error('mv HTTP ' + r.status); G.mv = r.json.microversion; return G.mv; };
G.TYPY = ['extrude', 'revolve', 'cPlane', 'hole', 'chamfer', 'fillet', 'mirror'];
G.wczytajSpecs = async () => { const r = await G.req('GET', G.ps + '/featurespecs'); if (!r.ok) throw new Error('featurespecs HTTP ' + r.status);
  G.enums = {}; for (const s of r.json.featureSpecs) { if (!G.TYPY.includes(s.featureType)) continue; G.enums[s.featureType] = {};
    for (const p of s.parameters) if (p.enumName) G.enums[s.featureType][p.parameterId] = p.enumName; } return G.enums; };

// ---- drzewo (bez API): wiersz po feature-id, skan wirtualizowanej listy ----
G.wiersz = (fid) => { const it = document.querySelector(`.os-list-item[feature-id="${fid}"]`); if (!it) return null;
  const l = it.querySelector('.os-list-item-label'); const ik = [...it.querySelectorAll('use')].map((u) => (u.getAttribute('href') || u.getAttributeNS('http://www.w3.org/1999/xlink', 'href') || '').replace(/^.*#/, ''));
  return { dataId: it.getAttribute('data-id'), tytul: l && l.getAttribute('data-bs-original-title'), tekst: l ? l.textContent.trim() : '', ikony: ik,
    szkic: ik.some((u) => /sketch-button/.test(u)), under: ik.some((u) => /underdefined/.test(u)) }; };
G.skanuj = async (fid) => { let el = document.querySelector('.os-list-item[feature-id]');
  while (el && !(el.scrollHeight > el.clientHeight + 5 && /auto|scroll/.test(getComputedStyle(el).overflowY))) el = el.parentElement;
  for (let i = 0; i < 80; i++) { const w = G.wiersz(fid); if (w && (!w.szkic || w.tytul)) return w; if (el) el.scrollTop = el.scrollHeight - i * Math.max(100, el.clientHeight / 2); await new Promise((r) => setTimeout(r, 150)); }
  return G.wiersz(fid); };
// zapis operacji: stan z odpowiedzi = OK, wiersz w drzewie, brak ikony ostrzeżenia/błędu, szkic bez „underdefined”
G.zap = async (feature, szkic) => {
  if (!G.mv) throw new Error('brak sourceMicroversion');
  const url = G.ps + '/features' + (feature.featureId ? '/featureid/' + feature.featureId : '');
  const r = await G.req('POST', url, { feature, sourceMicroversion: G.mv, rejectMicroversionSkew: true });
  if (!r.ok) { G.stop = 'HTTP ' + r.status + ' ' + feature.name; throw new Error(G.stop + ' ' + JSON.stringify(r.json || r.text).slice(0, 400)); }
  const f = r.json.feature, st = r.json.featureState && r.json.featureState.featureStatus; G.F[f.name] = f.featureId;
  if (st !== 'OK') { G.stop = feature.name + ': ' + st; throw new Error(G.stop); }
  const t0 = performance.now(); const w = await G.skanuj(f.featureId);
  const wpis = { t: new Date().toISOString(), nazwa: f.name, featureId: f.featureId, featureStatus: st, dataId: w && w.dataId, podpowiedz: w && w.tytul, under: w && w.under, ms: Math.round(performance.now() - t0), mv: G.mv };
  G.kontrola.push(wpis);
  if (!w) { G.stop = 'brak wiersza ' + f.name; throw new Error(G.stop); }
  if (w.ikony.some((u) => /warn|error/i.test(u))) { G.stop = 'ostrzeżenie ' + f.name; throw new Error(G.stop); }
  if (szkic && w.under) { G.stop = 'szkic niedookreślony ' + f.name; throw new Error(G.stop); }
  return wpis;
};

// ---- parametry ----
const Q = (s) => ({ btType: 'BTMIndividualQuery-138', queryString: s });
const pq = (id, ...qs) => ({ btType: 'BTMParameterQueryList-148', parameterId: id, queries: qs.map(Q) });
const pn = (id, e) => ({ btType: 'BTMParameterQuantity-147', parameterId: id, expression: String(e), isInteger: false });
const pb = (id, v) => ({ btType: 'BTMParameterBoolean-144', parameterId: id, value: v });
const pstr = (id, v) => ({ btType: 'BTMParameterString-149', parameterId: id, value: v });
const pe = (ft, id, v) => ({ btType: 'BTMParameterEnum-145', parameterId: id, enumName: G.enums[ft][id], value: v });
const DIR = (v) => ({ btType: 'BTMParameterEnum-145', parameterId: 'direction', enumName: 'DimensionDirection', value: v });
Object.assign(G, { Q, pq, pn, pb, pstr, pe });
G.q = {
  origin: 'query=qCreatedBy(makeId("Origin"), EntityType.VERTEX);',
  std: (n) => `query=qCreatedBy(makeId("${n}"), EntityType.FACE);`,
  body: (fid) => `query=qCreatedBy(makeId("${fid}"), EntityType.BODY);`,
  edge: (fid, e) => `query=sketchEntityQuery(makeId("${fid}"), EntityType.EDGE, "${e}");`,
  // obszar szkicu zawierający punkt (mm, współrzędne świata)
  reg: (fid, p) => `query=qContainsPoint(qSketchRegion(makeId("${fid}"), false), vector(${p.map((v) => v / 1000).join(', ')}) * meter);`,
};
G.regs = (fid, pts) => pts.map((p) => G.q.reg(fid, p));

// ---- szkic: współrzędne startowe w mm (u, v płaszczyzny), wymiary #zmienna od rzutu origin; bez Fix ----
G.Sk = class {
  constructor(name, planeQ) { this.name = name; this.planeQ = planeQ; this.e = []; this.c = []; this.k = 0; this.tag = name.replace(/[^A-Za-z0-9]/g, '').slice(-8); }
  con(type, params) { this.c.push({ btType: 'BTMSketchConstraint-2', constraintType: type, entityId: 'k' + this.tag + (++this.k), parameters: params }); }
  line(id, a, b, constr = false) { const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    this.e.push({ btType: 'BTMSketchCurveSegment-155', entityId: id, startPointId: id + '.start', endPointId: id + '.end', startParam: 0, endParam: L / 1000, isConstruction: constr,
      geometry: { btType: 'BTCurveGeometryLine-117', pntX: a[0] / 1000, pntY: a[1] / 1000, dirX: (b[0] - a[0]) / L, dirY: (b[1] - a[1]) / L } }); return id; }
  arc(id, c, r, a0, a1) { this.e.push({ btType: 'BTMSketchCurveSegment-155', entityId: id, startPointId: id + '.start', endPointId: id + '.end', centerId: id + '.center',
      startParam: a0 * Math.PI / 180, endParam: a1 * Math.PI / 180, isConstruction: false,
      geometry: { btType: 'BTCurveGeometryCircle-115', radius: r / 1000, xCenter: c[0] / 1000, yCenter: c[1] / 1000, xDir: 1, yDir: 0, clockwise: false } }); return id; }
  circle(id, c, d) { this.e.push({ btType: 'BTMSketchCurve-4', entityId: id, centerId: id + '.center', isConstruction: false,
      geometry: { btType: 'BTCurveGeometryCircle-115', radius: d / 2000, xCenter: c[0] / 1000, yCenter: c[1] / 1000, xDir: 1, yDir: 0, clockwise: false } }); return id; }
  co(a, b) { this.con('COINCIDENT', [pstr('localFirst', a), pstr('localSecond', b)]); }
  H(l) { this.con('HORIZONTAL', [pstr('localFirst', l)]); }
  V(l) { this.con('VERTICAL', [pstr('localFirst', l)]); }
  // punkt: odległość od origin w poziomie / pionie (wartość bezwzględna; znak z położenia startowego)
  dx(pt, expr) { this.con('DISTANCE', [pstr('localFirst', pt), pq('externalSecond', G.q.origin), DIR('HORIZONTAL'), pn('length', expr)]); }
  dy(pt, expr) { this.con('DISTANCE', [pstr('localFirst', pt), pq('externalSecond', G.q.origin), DIR('VERTICAL'), pn('length', expr)]); }
  onX(pt) { this.con('COINCIDENT', [pstr('localFirst', pt), pq('externalSecond', G.q.origin)]); }   // tylko gdy punkt = origin
  ra(c, expr) { this.con('RADIUS', [pstr('localFirst', c), pn('length', expr)]); }
  tan(a, b) { this.con('TANGENT', [pstr('localFirst', a), pstr('localSecond', b)]); }
  hOrg(pt) { this.con('HORIZONTAL', [pstr('localFirst', pt), pq('externalSecond', G.q.origin)]); }   // v punktu = v origin (oś u)
  vOrg(pt) { this.con('VERTICAL', [pstr('localFirst', pt), pq('externalSecond', G.q.origin)]); }
  // współrzędna punktu: wyrażenie odległości od origin albo null = na osi (0)
  pu(pt, ex) { ex === null ? this.vOrg(pt) : this.dx(pt, ex); }
  pv(pt, ex) { ex === null ? this.hOrg(pt) : this.dy(pt, ex); }
  // wielokąt: pts [[u, v, exU, exV]]; każdy wierzchołek wymiarowany w u i v (bez H/V, więc bez nadmiarowości)
  poly(pre, pts) { const n = pts.length, ids = pts.map((_, i) => pre + i);
    ids.forEach((id, i) => this.line(id, pts[i], pts[(i + 1) % n]));
    ids.forEach((id, i) => this.co(id + '.end', ids[(i + 1) % n] + '.start'));
    pts.forEach((p, i) => { this.pu(ids[i] + '.start', p[2]); this.pv(ids[i] + '.start', p[3]); }); return ids; }
  // „ucho” zaokrąglenia: ćwiartka (q: 0 = 0..90°, 1 = 90..180°, 2 = 180..270°, 3 = 270..360°) koła o środku (xc, 0) i promieniu r,
  // zamknięta dwoma odcinkami przez narożnik; exXc – wyrażenie u środka, exR – promień
  ucho(pre, xc, r, q, exXc, exR) { const a0 = q * 90, a1 = a0 + 90, A = pre + 'a', L1 = pre + 'l', L2 = pre + 'm';
    const pt = (a) => [xc + r * Math.round(Math.cos(a * Math.PI / 180)), r * Math.round(Math.sin(a * Math.PI / 180))];
    const naOsi = (q === 0 || q === 2) ? 'start' : 'end', p90 = naOsi === 'start' ? 'end' : 'start';
    const PA = pt(naOsi === 'start' ? a0 : a1), P9 = pt(naOsi === 'start' ? a1 : a0), K = [PA[0], P9[1]];
    this.arc(A, [xc, 0], r, a0, a1); this.line(L1, P9, K); this.line(L2, K, PA);
    this.co(A + '.' + p90, L1 + '.start'); this.co(L1 + '.end', L2 + '.start'); this.co(L2 + '.end', A + '.' + naOsi);
    this.dx(A + '.center', exXc); this.hOrg(A + '.center'); this.ra(A, exR); this.hOrg(A + '.' + naOsi); this.dx(A + '.' + p90, exXc);
    this.H(L1); this.V(L2); return A; }
  feature() { return { btType: 'BTMSketch-151', featureType: 'newSketch', name: this.name, parameters: [pq('sketchPlane', this.planeQ)], entities: this.e, constraints: this.c }; }
};
G._F = (featureType, name, parameters) => ({ btType: 'BTMFeature-134', featureType, name, parameters });
// o: { op, depth, sym, through, opp, scope: [q] }
G.ext = (name, regionQs, o) => { const p = [pe('extrude', 'bodyType', 'SOLID'), pe('extrude', 'operationType', o.op || 'NEW'), pq('entities', ...regionQs),
  pe('extrude', 'endBound', o.through ? 'THROUGH_ALL' : 'BLIND'), pb('oppositeDirection', !!o.opp)];
  if (!o.through) p.push(pn('depth', o.depth)); if (o.sym) p.push(pb('symmetric', true));
  if (o.scope) p.push(pb('defaultScope', false), pq('booleanScope', ...o.scope)); return G._F('extrude', name, p); };
G.rev = (name, regionQs, axisQ, o = {}) => { const p = [pe('revolve', 'bodyType', 'SOLID'), pe('revolve', 'operationType', o.op || 'NEW'), pq('entities', ...regionQs), pq('axis', axisQ),
  pb('fullRevolve', true), pn('angle', '360 deg')];
  if (o.scope) p.push(pb('defaultScope', false), pq('booleanScope', ...o.scope)); return G._F('revolve', name, p); };
G.ciala = async () => { const r = await G.req('GET', G.ps + '/bodydetails'); if (!r.ok) throw new Error('bodydetails HTTP ' + r.status); G._bd = r.json; return r.json; };
G.zrzutK = () => JSON.stringify({ n: G.n, mv: G.mv, stop: G.stop, rem: G.rem, F: G.F, kontrola: G.kontrola, log: G.log });
return 'e6.6-build ok, n=' + JSON.stringify(G.n);
})();
