#!/usr/bin/env python3
"""3MF -> binarny STL w milimetrach (bez zależności, tylko biblioteka standardowa).

Użycie:  python3 -I 3mf_do_stl.py <plik.3mf> [...] -o <katalog_wyjściowy> [--rozdziel]

- czyta 3D/3dmodel.model (zip + XML), uwzględnia atrybut unit (meter, millimeter, ...),
  komponenty i transformacje <build><item transform>,
- wszystkie obiekty z <build> łączy w jeden STL o nazwie pliku 3MF,
- z --rozdziel: każdy element <build> osobno, plik "<nazwa 3MF bez ' - FullProject'> - <nazwa obiektu>.stl"
  (FullProject z Onshape: 10 brył w jednym pliku),
- wypisuje obwiednię w mm (kontrola, że części są w pozycji złożonej).
"""
import argparse
import os
import struct
import sys
import xml.etree.ElementTree as ET
import zipfile

NS = {"m": "http://schemas.microsoft.com/3dmanufacturing/core/2015/02"}
UNIT = {"micron": 0.001, "millimeter": 1.0, "centimeter": 10.0,
        "inch": 25.4, "foot": 304.8, "meter": 1000.0}
IDENT = (1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0)


def parse_tf(s):
    if not s:
        return IDENT
    v = tuple(float(x) for x in s.split())
    return v if len(v) == 12 else IDENT


def mul(a, b):
    """a, b: macierze 3MF (m00 m01 m02 m10 m11 m12 m20 m21 m22 m30 m31 m32), wektor wierszowy.
    Zwraca a*b (najpierw a, potem b)."""
    A = [[a[0], a[1], a[2], 0], [a[3], a[4], a[5], 0], [a[6], a[7], a[8], 0], [a[9], a[10], a[11], 1]]
    B = [[b[0], b[1], b[2], 0], [b[3], b[4], b[5], 0], [b[6], b[7], b[8], 0], [b[9], b[10], b[11], 1]]
    C = [[sum(A[i][k] * B[k][j] for k in range(4)) for j in range(4)] for i in range(4)]
    return (C[0][0], C[0][1], C[0][2], C[1][0], C[1][1], C[1][2],
            C[2][0], C[2][1], C[2][2], C[3][0], C[3][1], C[3][2])


def apply(t, p):
    x, y, z = p
    return (x * t[0] + y * t[3] + z * t[6] + t[9],
            x * t[1] + y * t[4] + z * t[7] + t[10],
            x * t[2] + y * t[5] + z * t[8] + t[11])


def read_3mf(path, rozdziel=False):
    with zipfile.ZipFile(path) as z:
        name = next(n for n in z.namelist() if n.lower().endswith(".model"))
        root = ET.fromstring(z.read(name))
    scale = UNIT.get(root.get("unit", "millimeter"), 1.0)
    objs = {}
    for o in root.find("m:resources", NS).findall("m:object", NS):
        objs[o.get("id")] = o
    tris = []

    def emit(oid, tf, depth=0):
        o = objs[oid]
        mesh = o.find("m:mesh", NS)
        if mesh is not None:
            vs = [(float(v.get("x")), float(v.get("y")), float(v.get("z")))
                  for v in mesh.find("m:vertices", NS)]
            vs = [apply(tf, p) for p in vs]
            for t in mesh.find("m:triangles", NS):
                tris.append((vs[int(t.get("v1"))], vs[int(t.get("v2"))], vs[int(t.get("v3"))]))
        comps = o.find("m:components", NS)
        if comps is not None and depth < 16:
            for c in comps.findall("m:component", NS):
                emit(c.get("objectid"), mul(parse_tf(c.get("transform")), tf), depth + 1)

    build = root.find("m:build", NS)
    s = scale
    przeskaluj = lambda tt: [tuple((p[0] * s, p[1] * s, p[2] * s) for p in t) for t in tt]
    if rozdziel:
        out = []
        for it in build.findall("m:item", NS):
            tris.clear()
            emit(it.get("objectid"), parse_tf(it.get("transform")))
            out.append((objs[it.get("objectid")].get("name") or it.get("objectid"), przeskaluj(tris)))
        return out
    for it in build.findall("m:item", NS):
        emit(it.get("objectid"), parse_tf(it.get("transform")))
    return przeskaluj(tris)


def write_stl(path, tris, label):
    with open(path, "wb") as f:
        f.write(label.encode("ascii", "replace")[:80].ljust(80, b" "))
        f.write(struct.pack("<I", len(tris)))
        for a, b, c in tris:
            ux, uy, uz = b[0] - a[0], b[1] - a[1], b[2] - a[2]
            vx, vy, vz = c[0] - a[0], c[1] - a[1], c[2] - a[2]
            n = (uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx)
            ln = (n[0] ** 2 + n[1] ** 2 + n[2] ** 2) ** 0.5 or 1.0
            f.write(struct.pack("<12fH", n[0] / ln, n[1] / ln, n[2] / ln, *a, *b, *c, 0))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("files", nargs="+")
    ap.add_argument("-o", "--out", required=True)
    ap.add_argument("--rozdziel", action="store_true")
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    for fp in a.files:
        base = os.path.splitext(os.path.basename(fp))[0]
        if a.rozdziel:
            pary = [(base.replace(" - FullProject", "") + " - " + nazwa, tris) for nazwa, tris in read_3mf(fp, True)]
        else:
            pary = [(base, read_3mf(fp))]
        for base, tris in pary:
            zapisz_stl(a.out, base, tris)


def zapisz_stl(out, base, tris):
    write_stl(os.path.join(out, base + ".stl"), tris, base)
    xs = [p[0] for t in tris for p in t]
    ys = [p[1] for t in tris for p in t]
    zs = [p[2] for t in tris for p in t]
    print(f"{base}: {len(tris)} tr.  x {min(xs):.2f}..{max(xs):.2f}  "
          f"y {min(ys):.2f}..{max(ys):.2f}  z {min(zs):.2f}..{max(zs):.2f}", file=sys.stderr)


if __name__ == "__main__":
    main()
