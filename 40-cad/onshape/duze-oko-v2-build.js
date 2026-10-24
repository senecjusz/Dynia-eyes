// Duże oko v2 (krok 2, noc 24/25.10.2026): skrypt projektanta w karcie cad.onshape.com (sesja przeglądarki, cookie + X-XSRF-TOKEN).
// Bramka req() jak w e6.6-build.js (AGENTS.md „Praca z API Onshape”): jedno żądanie naraz, próg 20, budżet, stop przy 429/402,
// zakaz /featurescript. Zapis operacji: featureStatus z odpowiedzi = OK i wiersz w drzewie bez ikony ostrzeżenia/błędu.
// Szkice: geometria liczona z tabeli zmiennych (V) w skrypcie; parametry operacji jako #zmienne z Variable Studio.
// Wklej do konsoli karty po każdym przeładowaniu; stan do pliku przez G.zrzutK().
(() => {
const G = window.G = window.G || {};
G.PROG = 20;
G.BUDZET = G.BUDZET || { total: 200, getFeatures: 3 };
G.rem = G.rem || {}; G.log = G.log || []; G.n = G.n || { total: 0, getFeatures: 0 }; G.busy = false; G.stop = G.stop || null;
G.F = G.F || {}; G.mv = G.mv || null; G.kontrola = G.kontrola || [];
const xsrf = () => decodeURIComponent((document.cookie.match(/XSRF-TOKEN=([^;]+)/) || [])[1] || '');
G.key = (m, url) => m.toUpperCase() + ' ' + new URL(url, location.origin).pathname.replace(/^\/api\/v\d+/, '')
  .replace(/\/(d|w|v|m|e|featureid)\/[^/]+/g, '/$1/{id}').replace(/\/[0-9a-f]{24}(?=\/|$)/g, '/{id}').replace(/\/partid\/[^/]+/, '/partid/{id}');
G.req = async (method, url, body, raw) => {
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
  try { r = await fetch(url, { method, credentials: 'include', headers: { Accept: raw ? '*/*' : 'application/json', 'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrf() },
    body: body === undefined ? undefined : JSON.stringify(body) }); }
  catch (e) { G.busy = false; blok('błąd sieci: ' + e.message); }
  G.n.total++; if (getF) G.n.getFeatures++;
  const h = r.headers.get('X-Rate-Limit-Remaining'), remaining = h === null ? null : Number(h), start = !(k in G.rem);
  G.rem[k] = { remaining, t: teraz };
  let json = null, txt = null, buf = null;
  if (raw && r.ok) buf = await r.arrayBuffer(); else { txt = await r.text(); try { json = JSON.parse(txt); } catch (e) {} }
  if (json && json.sourceMicroversion) G.mv = json.sourceMicroversion;
  G.log.push({ t: teraz, k, status: r.status, remaining, odczytStartowy: start });
  G.busy = false;
  if (r.status === 429 || r.status === 402) { G.stop = `HTTP ${r.status} (${k}), Retry-After ${r.headers.get('Retry-After')}`; throw new Error('STOP: ' + G.stop); }
  return { status: r.status, ok: r.ok, remaining, json, buf, text: json ? null : (txt || '').slice(0, 500) };
};
G.ps = () => `/api/v12/partstudios/d/${G.doc.did}/w/${G.doc.wid}/e/${G.doc.eid}`;
G.mvOdswiez = async () => { const r = await G.req('GET', `/api/v12/documents/d/${G.doc.did}/w/${G.doc.wid}/currentmicroversion`); if (!r.ok) throw new Error('mv HTTP ' + r.status); G.mv = r.json.microversion; return G.mv; };
G.TYPY = ['extrude', 'revolve', 'cPlane', 'mirror', 'booleanBodies'];
G.wczytajSpecs = async () => { const r = await G.req('GET', G.ps() + '/featurespecs'); if (!r.ok) throw new Error('featurespecs HTTP ' + r.status);
  G.enums = {}; G.specP = {}; for (const s of r.json.featureSpecs) { if (!G.TYPY.includes(s.featureType)) continue; G.enums[s.featureType] = {};
    G.specP[s.featureType] = s.parameters.map((p) => p.parameterId + (p.enumName ? ':' + p.enumName : ''));
    for (const p of s.parameters) if (p.enumName) G.enums[s.featureType][p.parameterId] = p.enumName; } return G.specP; };

// ---- drzewo (bez API): wiersz po feature-id, skan wirtualizowanej listy ----
G.wiersz = (fid) => { const it = document.querySelector(`.os-list-item[feature-id="${fid}"]`); if (!it) return null;
  const l = it.querySelector('.os-list-item-label'); const ik = [...it.querySelectorAll('use')].map((u) => (u.getAttribute('href') || u.getAttributeNS('http://www.w3.org/1999/xlink', 'href') || '').replace(/^.*#/, ''));
  return { dataId: it.getAttribute('data-id'), tytul: l && l.getAttribute('data-bs-original-title'), tekst: l ? l.textContent.trim() : '', ikony: ik,
    szkic: ik.some((u) => /sketch-button/.test(u)), under: ik.some((u) => /underdefined/.test(u)) }; };
G.skanuj = async (fid) => { let el = document.querySelector('.os-list-item[feature-id]');
  while (el && !(el.scrollHeight > el.clientHeight + 5 && /auto|scroll/.test(getComputedStyle(el).overflowY))) el = el.parentElement;
  for (let i = 0; i < 60; i++) { const w = G.wiersz(fid); if (w) return w; if (el) el.scrollTop = el.scrollHeight - i * Math.max(100, el.clientHeight / 2); await new Promise((r) => setTimeout(r, 150)); }
  return G.wiersz(fid); };
G.zap = async (feature) => {
  if (!G.mv) throw new Error('brak sourceMicroversion');
  const url = G.ps() + '/features' + (feature.featureId ? '/featureid/' + feature.featureId : '');
  const r = await G.req('POST', url, { feature, sourceMicroversion: G.mv, rejectMicroversionSkew: true });
  if (!r.ok) { G.stop = 'HTTP ' + r.status + ' ' + feature.name; throw new Error(G.stop + ' ' + JSON.stringify(r.json || r.text).slice(0, 400)); }
  const f = r.json.feature, st = r.json.featureState && r.json.featureState.featureStatus; G.F[f.name] = f.featureId;
  if (st !== 'OK') { G.stop = feature.name + ': ' + st; throw new Error(G.stop); }
  const w = await G.skanuj(f.featureId);
  G.kontrola.push({ t: new Date().toISOString(), nazwa: f.name, featureId: f.featureId, featureStatus: st, dataId: w && w.dataId, podpowiedz: w && w.tytul, mv: G.mv });
  if (!w) { G.stop = 'brak wiersza ' + f.name; throw new Error(G.stop); }
  if (w.ikony.some((u) => /warn|error/i.test(u))) { G.stop = 'ostrzeżenie ' + f.name; throw new Error(G.stop); }
  return f.featureId;
};

// ---- parametry i zapytania ----
const Q = (s) => ({ btType: 'BTMIndividualQuery-138', queryString: s });
const pq = (id, ...qs) => ({ btType: 'BTMParameterQueryList-148', parameterId: id, queries: qs.map(Q) });
const pn = (id, e) => ({ btType: 'BTMParameterQuantity-147', parameterId: id, expression: String(e), isInteger: false });
const pb = (id, v) => ({ btType: 'BTMParameterBoolean-144', parameterId: id, value: v });
const pstr = (id, v) => ({ btType: 'BTMParameterString-149', parameterId: id, value: v });
const pe = (ft, id, v) => { const en = G.enums[ft] && G.enums[ft][id]; if (!en) throw new Error('brak enum ' + ft + '.' + id); return { btType: 'BTMParameterEnum-145', parameterId: id, enumName: en, value: v }; };
const fid = (n) => { if (!G.F[n]) throw new Error('brak featureId: ' + n); return G.F[n]; };
Object.assign(G, { Q, pq, pn, pb, pstr, pe, fid });
// płaszczyzny: układ lokalny szkicu (o, ex, ey, n) w mm; Front: u = X, v = Z, n = −Y; Right: u = Y, v = Z, n = +X; Top: u = X, v = Y, n = +Z
G.PL = { Top: { o: [0, 0, 0], ex: [1, 0, 0], ey: [0, 1, 0], n: [0, 0, 1] }, Front: { o: [0, 0, 0], ex: [1, 0, 0], ey: [0, 0, 1], n: [0, -1, 0] },
  Right: { o: [0, 0, 0], ex: [0, 1, 0], ey: [0, 0, 1], n: [1, 0, 0] } };
G.plOff = (std, d) => { const b = G.PL[std]; return { ...b, o: b.n.map((c) => c * d) }; };
G.w = (pl, u, v) => [0, 1, 2].map((i) => pl.o[i] + u * pl.ex[i] + v * pl.ey[i]);
G.q = {
  std: (n) => `query=qCreatedBy(makeId("${n}"), EntityType.FACE);`,
  plane: (n) => `query=qCreatedBy(makeId("${fid(n)}"), EntityType.FACE);`,
  body: (n) => `query=qCreatedBy(makeId("${fid(n)}"), EntityType.BODY);`,
  ent: (n, e) => `query=sketchEntityQuery(makeId("${fid(n)}"), EntityType.EDGE, "${e}");`,
  reg: (n, p) => `query=qContainsPoint(qSketchRegion(makeId("${fid(n)}"), false), vector(${p.map((v) => (v / 1000).toFixed(7)).join(', ')}) * meter);`,
  bodyAt: (p) => `query=qContainsPoint(qBodyType(qEverything(EntityType.BODY), BodyType.SOLID), vector(${p.map((v) => (v / 1000).toFixed(7)).join(', ')}) * meter);`,
};
// obszary szkicu po punktach (u, v) w układzie płaszczyzny szkicu
G.regs = (sk, pts) => pts.map((p) => G.q.reg(sk.name, G.w(sk.pl, p[0], p[1])));

// ---- szkic: geometria w mm (u, v), punkty wspólne łączone więzem COINCIDENT ----
G.Sk = class {
  constructor(name, pl, planeQ) { this.name = name; this.pl = pl; this.planeQ = planeQ; this.e = []; this.c = []; this.k = 0; this.tag = name.replace(/[^A-Za-z0-9]/g, '').slice(-8); }
  con(type, params) { this.c.push({ btType: 'BTMSketchConstraint-2', constraintType: type, entityId: 'k' + this.tag + (++this.k), parameters: params }); }
  co(a, b) { this.con('COINCIDENT', [pstr('localFirst', a), pstr('localSecond', b)]); }
  line(id, a, b, constr = false) { const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    this.e.push({ btType: 'BTMSketchCurveSegment-155', entityId: id, startPointId: id + '.start', endPointId: id + '.end', startParam: 0, endParam: L / 1000, isConstruction: constr,
      geometry: { btType: 'BTCurveGeometryLine-117', pntX: a[0] / 1000, pntY: a[1] / 1000, dirX: (b[0] - a[0]) / L, dirY: (b[1] - a[1]) / L } }); return id; }
  // łuk przeciwnie do wskazówek od a0 do a1 (stopnie)
  arc(id, c, r, a0, a1) { this.e.push({ btType: 'BTMSketchCurveSegment-155', entityId: id, startPointId: id + '.start', endPointId: id + '.end', centerId: id + '.center',
      startParam: a0 * Math.PI / 180, endParam: a1 * Math.PI / 180, isConstruction: false,
      geometry: { btType: 'BTCurveGeometryCircle-115', radius: r / 1000, xCenter: c[0] / 1000, yCenter: c[1] / 1000, xDir: 1, yDir: 0, clockwise: false } }); return id; }
  circle(id, c, d) { this.e.push({ btType: 'BTMSketchCurve-4', entityId: id, centerId: id + '.center', isConstruction: false,
      geometry: { btType: 'BTCurveGeometryCircle-115', radius: d / 2000, xCenter: c[0] / 1000, yCenter: c[1] / 1000, xDir: 1, yDir: 0, clockwise: false } }); return id; }
  // zamknięty wielokąt
  poly(pre, pts) { const ids = pts.map((_, i) => pre + i); ids.forEach((id, i) => this.line(id, pts[i], pts[(i + 1) % pts.length]));
    ids.forEach((id, i) => this.co(id + '.end', ids[(i + 1) % ids.length] + '.start')); return ids; }
  // kontur z odcinków i łuków: segs = [['L', [u,v]], ['A', centrum, r, a0, a1, ccw]]; start = pierwszy punkt
  kontur(pre, start, segs) { let p = start, prev = null, first = null; segs.forEach((s, i) => { const id = pre + i; let a, b;
      if (s[0] === 'L') { this.line(id, p, s[1]); a = id + '.start'; b = id + '.end'; p = s[1]; }
      else { const [, c, r, a0, a1, ccw] = s; if (ccw) { this.arc(id, c, r, a0, a1); a = id + '.start'; b = id + '.end'; } else { this.arc(id, c, r, a1, a0); a = id + '.end'; b = id + '.start'; }
        p = [c[0] + r * Math.cos(a1 * Math.PI / 180), c[1] + r * Math.sin(a1 * Math.PI / 180)]; }
      if (prev) this.co(prev, a); else first = a; prev = b; });
    this.co(prev, first); }
  feature() { return { btType: 'BTMSketch-151', featureType: 'newSketch', name: this.name, parameters: [pq('sketchPlane', this.planeQ)], entities: this.e, constraints: this.c }; }
};
G.szkic = async (sk) => { await G.zap(sk.feature()); return sk; };
G._F = (featureType, name, parameters) => ({ btType: 'BTMFeature-134', featureType, name, parameters });
G.plaszczyzna = (name, baseQ, expr, opp = false) => G.zap(G._F('cPlane', name, [pq('entities', baseQ), pe('cPlane', 'cplaneType', 'OFFSET'), pn('offset', expr), pb('oppositeDirection', opp)]));
// o: { op, depth, opp, sym, through, depth2, opp2 (drugi kierunek), scope: [q] }
G.ext = (name, regs, o) => { const p = [pe('extrude', 'bodyType', 'SOLID'), pe('extrude', 'operationType', o.op || 'NEW'), pq('entities', ...regs),
  pe('extrude', 'endBound', o.through ? 'THROUGH_ALL' : 'BLIND'), pb('oppositeDirection', !!o.opp)];
  if (!o.through) p.push(pn('depth', o.depth)); if (o.sym) p.push(pb('symmetric', true));
  if (o.depth2) p.push(pb('hasSecondDirection', true), pe('extrude', 'secondDirectionBound', 'BLIND'), pn('secondDirectionDepth', o.depth2), pb('secondDirectionOppositeDirection', !!o.opp2));
  if (o.scope) p.push(pb('defaultScope', false), pq('booleanScope', ...o.scope));
  return G.zap(G._F('extrude', name, p)); };
// o: { op, axisQ, full (domyślnie), a1, a2 (dwa kierunki), opp, scope }
G.rev = (name, regs, o) => { const p = [pe('revolve', 'bodyType', 'SOLID'), pe('revolve', 'operationType', o.op || 'NEW'), pq('entities', ...regs), pq('axis', o.axisQ)];
  if (o.a1 === undefined) p.push(pe('revolve', 'revolveType', 'FULL'));
  else { p.push(pe('revolve', 'revolveType', 'TWO_DIRECTIONS'), pn('angle', o.a1), pn('angleBack', o.a2), pb('oppositeDirection', !!o.opp)); }
  if (o.scope) p.push(pb('defaultScope', false), pq('booleanScope', ...o.scope));
  return G.zap(G._F('revolve', name, p)); };
G.mirror = (name, featNames, planeQ) => G.zap(G._F('mirror', name, [pe('mirror', 'patternType', 'FEATURE'),
  { btType: 'BTMParameterFeatureList-1749', parameterId: 'instanceFunction', featureIds: featNames.map(fid) }, pq('mirrorPlane', planeQ), pb('fullFeaturePattern', true)]));
G.ciala = async () => { const r = await G.req('GET', G.ps() + '/bodydetails'); if (!r.ok) throw new Error('bodydetails HTTP ' + r.status); G._bd = r.json; return r.json; };
G.czesci = async () => { const r = await G.req('GET', `/api/v12/parts/d/${G.doc.did}/w/${G.doc.wid}/e/${G.doc.eid}`); if (!r.ok) throw new Error('parts HTTP ' + r.status); return r.json; };
G.bbox = async () => { const r = await G.req('GET', G.ps() + '/boundingboxes?includeHidden=false'); if (!r.ok) throw new Error('bbox HTTP ' + r.status); return r.json; };
G.zrzutK = () => JSON.stringify({ n: G.n, mv: G.mv, stop: G.stop, rem: G.rem, F: G.F, doc: G.doc, kontrola: G.kontrola, log: G.log });
return 'duze-oko-v2 bramka ok, n=' + JSON.stringify(G.n);
})();
