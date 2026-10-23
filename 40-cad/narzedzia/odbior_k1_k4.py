"""Niezależny odbiór K1–K4 (orkiestrator) na surowych danych wykonawcy: features.json z encjami, znaczniki, Variable Studio."""
import json, re, sys

feat_path, znacz_path = sys.argv[1], sys.argv[2]
f = json.load(open(feat_path))
z = json.load(open(znacz_path))
if isinstance(z, dict):
    z = z.get("lista", [])
DOZWOLONE = {'0', '90deg', '180deg', '360deg', '2', '0deg', '1', '-1'}

# K1
st = f.get('featureStates') or {}
bad = {k: v['featureStatus'] for k, v in st.items() if v['featureStatus'] != 'OK'}
brak_stanu = [x.get('name') for x in f['features'] if x.get('featureId') not in st]
print('K1 featureStatus != OK:', bad or 'brak', '| operacji bez stanu:', len(brak_stanu), '(K1 NIEZALICZONY – brak danych)' if brak_stanu else '')

feats = f['features']
szkice = [x for x in feats if x['btType'].startswith('BTMSketch')]
print('K2 szkice w JSON:', len(szkice), '| wiersze w drzewie:', len(z), '| niedookreślone:',
      [r['tytul'] for r in z if r['niedookreslony']] or 'brak')

# K3: wyrażenia w parametrach operacji i wymiarach szkiców
def wyrazenia(o, out):
    if isinstance(o, dict):
        if 'expression' in o and isinstance(o['expression'], str):
            out.append(o['expression'])
        for v in o.values():
            wyrazenia(v, out)
    elif isinstance(o, list):
        for v in o:
            wyrazenia(v, out)

k3 = []
for x in feats:
    ex = []
    wyrazenia(x, ex)
    for e in ex:
        s = re.sub(r'#\w+', '', e)
        s = re.sub(r'\b(cos|sin|tan|acos|asin|atan|sqrt|abs|min|max|PI)\b', '', s)
        s = re.sub(r'\s*(mm|deg)\b', lambda m: m.group(1), s)
        nums = re.findall(r'(?<![\w.])(\d+(?:\.\d+)?)\s*(mm|deg|in)?', s)
        for n, u in nums:
            tok = n + (u or '')
            tok_n = n.rstrip('0').rstrip('.') if '.' in n else n
            if tok_n + (u if u == 'deg' else '') not in DOZWOLONE and tok_n not in DOZWOLONE:
                k3.append((x.get('name'), e))
                break
print('K3 wyrażenia ze stałymi spoza listy:', len(k3))
for n, e in k3:
    print('   ', n, '|', e)

# K4: Fix i encje bez więzów
for sk in szkice:
    cons = sk.get('constraints', [])
    fixy = [c for c in cons if c.get('constraintType') == 'FIX']
    ent_ids = {e['entityId'] for e in sk.get('entities', [])}
    uzyte = set()
    for c in cons:
        for p in c.get('parameters', []):
            v = p.get('value')
            if isinstance(v, str):
                uzyte.add(v.split('.')[0])
    wolne = sorted(ent_ids - uzyte)
    print(f"K4 {sk['name']}: encji {len(ent_ids)}, więzów {len(cons)}, FIX {len(fixy)}, encje bez więzów: {wolne or 'brak'}")
