# K1–K8 z GET /features (z encjami) – E6.2, wykonawca CAD. Użycie: python3 e6-kontrola-k.py features.json znaczniki.json
import json, re, sys, collections
F = json.load(open(sys.argv[1], encoding='utf-8')); Z = json.load(open(sys.argv[2], encoding='utf-8'))
feats = F['features']; st = F['featureStates']
DOZW = {'0', '90 deg', '180 deg', '360 deg', '2'}
BRYLOWE = {'extrude', 'revolve', 'hole', 'mirror', 'chamfer', 'fillet', 'circularPattern', 'linearPattern', 'booleanBodies', 'sweep', 'shell'}
def czesc(n): return n.split(':')[0].strip()
def wyr(f):  # (gdzie, wyrażenie)
    out = []
    for p in f.get('parameters', []):
        if p['btType'].startswith('BTMParameterQuantity'): out.append(('op ' + p['parameterId'], p['expression']))
    for c in f.get('constraints', []) or []:
        for p in c['parameters']:
            if p['btType'].startswith('BTMParameterQuantity'): out.append((c['constraintType'] + ' ' + p['parameterId'], p['expression']))
    return out
def stale(e):
    s = re.sub(r'#\w+', '', e); s = re.sub(r'\b(sin|cos|tan|sqrt)\b', '', s)
    return [m.strip() for m in re.findall(r'\d+(?:\.\d+)?\s*(?:mm|deg)?', s)]
w = {'K1': [], 'K2': {}, 'K3': [], 'K4': [], 'K5': [], 'K6': {}, 'K8': []}
w['K1'] = [(f['name'], st.get(f['featureId'], {}).get('featureStatus')) for f in feats if st.get(f['featureId'], {}).get('featureStatus') != 'OK']
szk = [f for f in feats if f['featureType'] == 'newSketch']
w['K2'] = {'szkiceJSON': len(szk), 'wierszeZnacznikow': len(Z), 'niedookreslone': [z['tytul'] for z in Z if z['niedookreslony']]}
licz = 0
for f in feats:
    for gdzie, e in wyr(f):
        licz += 1
        zle = [s for s in stale(e) if s not in DOZW]
        if zle: w['K3'].append((f['name'], gdzie, e, zle))
w['K3licz'] = licz
for f in szk:
    fix = [c for c in f['constraints'] if c['constraintType'] == 'FIX']
    uzyte = set()
    for c in f['constraints']:
        for p in c['parameters']:
            if p['btType'].startswith('BTMParameterString'): uzyte.add(p['value'].split('.')[0])
    wolne = [e['entityId'] for e in f['entities'] if e['entityId'] not in uzyte]
    if fix or wolne: w['K4'].append((f['name'], len(fix), wolne))
    w['K8'].append((f['name'], [q['queryString'] for p in f['parameters'] if p['parameterId'] == 'sketchPlane' for q in p['queries']][0]))
for f in feats:
    if f['featureType'] in ('mirror', 'circularPattern', 'linearPattern'):
        typ = [p.get('value') for p in f['parameters'] if p['parameterId'] == 'patternType']
        w['K5'].append((f['name'], typ[0] if typ else None))
    if f['featureType'] in BRYLOWE: w['K6'][czesc(f['name'])] = w['K6'].get(czesc(f['name']), 0) + 1
w['K6szkice'] = dict(collections.Counter(czesc(f['name']) for f in szk))
nazwy = [f['name'] for f in feats]; w['K10duplikaty'] = [n for n, k in collections.Counter(nazwy).items() if k > 1]
print(json.dumps(w, ensure_ascii=False, indent=1))
