# Rendery instrukcji montażu modułu małego oka v2.5 (Blender, tryb bez okna).
#
# Uruchamianie: przez renderuj.sh (konwersja 3MF -> STL + ten skrypt):
#   blender -b --factory-startup -P renderuj.py -- <katalog_stl> <katalog_png> [--szybko] [krok ...]
#
# Układ modelu (jak w Onshape): oś modułu Z (+Z na zewnątrz dyni), +Y = GÓRA, mm.
# W Blenderze: X = x, Y = -z, Z = y (tył kasety = +Y Blendera, góra = +Z Blendera).
# Kolory: szare = już złożone, niebieskie = nowa część (odsunięta w kierunku wsuwania),
# złote = nowe śruby i wkładki, zielone = przyrząd, kaseta przezroczysta, czerwona strzałka = ruch.

import math
import os
import struct
import sys

import bpy
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
if len(argv) < 2:
    raise SystemExit("użycie: blender -b -P renderuj.py -- <katalog_stl> <katalog_png> [--szybko] [krok ...]")
STL_DIR, OUT_DIR = argv[0], argv[1]
SZYBKO = "--szybko" in argv
WYBRANE = [a for a in argv[2:] if not a.startswith("--")]

PLIKI = {
    "K": "Oko F v2.5 - Kaseta",
    "J": "Oko F v2.5 - Jarzmo z miską",
    "S": "Oko F v2.5 - Sanki serwa",
    "R": "Oko F v2.5 - Ramię orczyka",
    "C": "Oko F v2.5 - Cięgno",
    "TC": "Oko F v2.5 - Tulejka przegubu korby",
    "TH": "Oko F v2.5 - Tulejka przegubu ramienia",
    "PT": "Oko F v2.5 - Pokrywa tylna",
    "G": "Oko F v2.5 - Gniazdo",
    "N": "Oko F v2.5 - Nakrętka",
    "P": "Oko F v2.4 - PODGLAD pileczka 40.5",
    "SG": "Oko F v2.4 - PODGLAD SG90",
    "O": "Oko F v2.4 - PODGLAD orczyk SG90",
    "PC": "Oko F v2.4 - Przyrzad centrowania orczyka",
    "PW": "Oko F v2.4 - Przyrzad do wklejania pileczki",
}

# Punkty z modelu (e2.1-specyfikacja, siatki v2.5), mm, układ modelu
C_PT = (7.382, -36.147)      # przegub C (x, z)
H_PT = (-9.235, -40.628)     # przegub H
UCHO = (22.598, 18.962)      # otwory wkładek / śrub pokrywy (x, y)

# Śruby i wkładki: (punkt pod łbem, kierunek łeb->koniec, typ, długość)
SRUBY = {
    "os_gora": ((0, 25.55, -12), (0, -1, 0), "iso7380", 4),
    "os_dol": ((0, -25.55, -12), (0, 1, 0), "iso7380", 4),
    "srC": ((C_PT[0], -3.8, C_PT[1]), (0, 1, 0), "din912", 8),
    "srH": ((H_PT[0], -3.8, H_PT[1]), (0, 1, 0), "din912", 8),
    "pokr_p": ((UCHO[0], UCHO[1], -80.5), (0, 0, 1), "din912", 8),
    "pokr_l": ((-UCHO[0], UCHO[1], -80.5), (0, 0, 1), "din912", 8),
    "m2": ((-4.446, -0.5, -53.784), (0, -1, 0), "m2", 6),
    "orczyk": ((0, -0.5, -66), (0, -1, 0), "m2", 4),
    "ucho_p": ((0, -15.1, -46.75), (0, -1, 0), "m2", 6),
    "ucho_t": ((0, -15.1, -74.55), (0, -1, 0), "m2", 6),
}
WKLADKI = {
    "wkC": ((C_PT[0], 1.3, C_PT[1]), (0, 1, 0)),
    "wkH": ((H_PT[0], 1.3, H_PT[1]), (0, 1, 0)),
    "wkU_p": ((UCHO[0], UCHO[1], -77.5), (0, 0, 1)),
    "wkU_l": ((-UCHO[0], UCHO[1], -77.5), (0, 0, 1)),
}

KOLORY = {
    "old": (0.60, 0.60, 0.60), "old_metal": (0.30, 0.30, 0.32), "old_kula": (0.88, 0.88, 0.85),
    "new": (0.08, 0.40, 0.85), "new_metal": (0.95, 0.65, 0.05), "new_kula": (0.97, 0.97, 0.97),
    "aux": (0.15, 0.62, 0.30), "glass": (0.62, 0.70, 0.80), "dynia": (0.80, 0.36, 0.06),
    "strzalka": (0.85, 0.08, 0.08),
}
PALETA = {  # tylko obraz 00
    "J": (0.08, 0.40, 0.85), "P": (0.97, 0.97, 0.97), "S": (0.55, 0.30, 0.75), "SG": (0.20, 0.25, 0.65),
    "R": (0.90, 0.45, 0.05), "O": (0.95, 0.95, 0.95), "C": (0.15, 0.62, 0.30), "TC": (0.85, 0.10, 0.10),
    "TH": (0.85, 0.10, 0.10), "PT": (0.45, 0.45, 0.45),
}

# ---------------------------------------------------------------- kroki
TYL_GORA = (1.1, 1.6, 0.9)
TYL_DOL = (1.1, 1.6, -0.8)
BOK_TYL = (1.6, 1.1, 0.7)

MODUL = ["K", "J", "P", "S", "SG", "O", "R", "C", "TC", "TH", "PT"]
SRUBY_MODULU = ["os_gora", "os_dol", "srC", "srH", "pokr_p", "pokr_l", "m2", "orczyk", "ucho_p", "ucho_t"]
WKLADKI_MODULU = ["wkC", "wkH", "wkU_p", "wkU_l"]


def g(role, parts=(), sruby=(), wkladki=(), offset=(0, 0, 0), base=(0, 0, 0), arrow=None, dynia=False, paleta=False):
    return dict(role=role, parts=list(parts), sruby=list(sruby), wkladki=list(wkladki), offset=offset,
                base=base, arrow=(arrow if arrow is not None else any(offset)), dynia=dynia, paleta=paleta)


KROKI = [
    dict(id="00_kaseta_zlozona", cam=(1.5, 0.5, 1.0), groups=[
        g("glass", ["K"]),
        g("old", [p for p in MODUL if p != "K"], SRUBY_MODULU, WKLADKI_MODULU, paleta=True)]),
    dict(id="01_wkladki", cam=TYL_GORA, groups=[
        g("old", ["K"]),
        g("old", ["C"], base=(60, 0, 0)),
        g("new", wkladki=["wkU_p"], offset=(0, 0, -16)),
        g("new", wkladki=["wkU_l"], offset=(0, 0, -16)),
        g("new", wkladki=["wkC"], base=(60, 0, 0), offset=(0, 14, 0)),
        g("new", wkladki=["wkH"], base=(60, 0, 0), offset=(0, 14, 0))]),
    dict(id="02_klejenie_pileczki", cam=(1.2, 1.4, 0.8), flip=True, groups=[
        g("old", ["PW"]),
        g("new", ["P"], base=(130, 0, 0), offset=(0, 0, -30)),
        g("new", ["J"], base=(130, 0, 0), offset=(0, 0, -62))]),
    dict(id="03_jarzmo", cam=BOK_TYL, groups=[
        g("glass", ["K"]),
        g("new", ["J", "P"], offset=(0, 0, -100)),
        g("new", sruby=["os_gora"], offset=(0, 12, 0)),
        g("new", sruby=["os_dol"], offset=(0, -12, 0))]),
    dict(id="04_sanki_sg90", cam=(1.2, 1.6, -0.5), groups=[
        g("glass", ["K"]),
        g("old", ["J", "P"], ["os_gora", "os_dol"]),
        g("new", ["S", "SG"], ["ucho_p", "ucho_t"], offset=(0, 0, -55))]),
    dict(id="05_ramie_orczyka", cam=TYL_GORA, groups=[
        g("glass", ["K"]),
        g("old", ["J", "P", "S", "SG"], ["os_gora", "os_dol", "ucho_p", "ucho_t"]),
        g("aux", ["PC"]),
        g("new", ["R", "O"], ["m2", "orczyk"], offset=(0, 3, -55))]),
    dict(id="06_ciegno", cam=TYL_GORA, groups=[
        g("glass", ["K"]),
        g("old", ["J", "P", "S", "SG", "R", "O"], ["os_gora", "os_dol", "ucho_p", "ucho_t", "m2", "orczyk"]),
        g("new", ["C"], wkladki=["wkC", "wkH"], offset=(0, 0, -60))]),
    dict(id="07_przeguby_C_H", cam=TYL_DOL, groups=[
        g("glass", ["K"]),
        g("old", ["J", "P", "S", "SG", "R", "O", "C"],
          ["os_gora", "os_dol", "ucho_p", "ucho_t", "m2", "orczyk"], ["wkC", "wkH"]),
        g("new", ["TC"], ["srC"], offset=(0, -40, 0)),
        g("new", ["TH"], ["srH"], offset=(0, -40, 0))]),
    dict(id="08_pokrywa", cam=TYL_GORA, groups=[
        g("glass", ["K"]),
        g("old", ["J", "P", "S", "SG", "R", "O", "C", "TC", "TH"],
          ["os_gora", "os_dol", "ucho_p", "ucho_t", "m2", "orczyk", "srC", "srH"], WKLADKI_MODULU),
        g("new", ["PT"], offset=(0, 0, -25)),
        g("new", sruby=["pokr_p"], offset=(0, 0, -45)),
        g("new", sruby=["pokr_l"], offset=(0, 0, -45))]),
    dict(id="09_gniazdo_w_dyni", cam=(1.8, -0.55, 0.6), groups=[
        g("old", dynia=True),
        g("new", ["G"], offset=(0, 0, 75))]),
    dict(id="10_nakretka", cam=TYL_GORA, groups=[
        g("old", ["G"], dynia=True),
        g("new", ["N"], offset=(0, 0, -35))]),
    dict(id="11_kaseta_do_gniazda", cam=TYL_GORA, groups=[
        g("old", ["G", "N"], dynia=True),
        g("new", MODUL, SRUBY_MODULU, WKLADKI_MODULU, offset=(0, 0, -70))]),
]

# ---------------------------------------------------------------- geometria


def load_stl(path):
    with open(path, "rb") as f:
        d = f.read()
    n = struct.unpack_from("<I", d, 80)[0]
    idx, verts, faces = {}, [], []
    for i in range(n):
        v = struct.unpack_from("<9f", d, 84 + 50 * i + 12)
        tri = []
        for k in range(3):
            p = (v[3 * k], v[3 * k + 1], v[3 * k + 2])
            key = (round(p[0], 4), round(p[1], 4), round(p[2], 4))
            j = idx.get(key)
            if j is None:
                j = idx[key] = len(verts)
                verts.append(p)
            tri.append(j)
        if tri[0] != tri[1] and tri[1] != tri[2] and tri[0] != tri[2]:
            faces.append(tri)
    return verts, faces


def basis(axis):
    a = Vector(axis).normalized()
    t = Vector((1, 0, 0)) if abs(a.x) < 0.9 else Vector((0, 1, 0))
    u = a.cross(t).normalized()
    return a, u, a.cross(u)


def cylinder(p0, axis, length, r0, r1, seg=32):
    a, u, v = basis(axis)
    p0 = Vector(p0)
    verts, faces = [], []
    for ring, r in ((p0, r0), (p0 + a * length, r1)):
        for i in range(seg):
            t = 2 * math.pi * i / seg
            verts.append(tuple(ring + u * (r * math.cos(t)) + v * (r * math.sin(t))))
    for i in range(seg):
        j = (i + 1) % seg
        faces.append([i, j, seg + j, seg + i])
    faces.append(list(range(seg - 1, -1, -1)))
    faces.append(list(range(seg, 2 * seg)))
    return verts, faces


def merge(*meshes):
    V, F = [], []
    for v, f in meshes:
        o = len(V)
        V += list(v)
        F += [[i + o for i in face] for face in f]
    return V, F


def sruba(name):
    p, ax, typ, L = SRUBY[name]
    a = Vector(ax).normalized()
    p = Vector(p)
    if typ == "iso7380":
        head = cylinder(p - a * 1.65, ax, 1.65, 1.9, 2.85)
        shank = cylinder(p, ax, L, 1.45, 1.45, 20)
    elif typ == "din912":
        head = cylinder(p - a * 3.0, ax, 3.0, 2.75, 2.75)
        shank = cylinder(p, ax, L, 1.45, 1.45, 20)
    else:  # M2 / wkręty SG90
        head = cylinder(p - a * 1.3, ax, 1.3, 1.6, 1.9)
        shank = cylinder(p, ax, L, 0.95, 0.95, 16)
    return merge(head, shank)


def wkladka(name):
    p, ax = WKLADKI[name]
    return cylinder(p, ax, 4.0, 2.3, 2.3)


def dynia():
    """Ścianka dyni R 150 (zewn.) / R 130 (wewn.) z otworem Ø63,5, bez ćwiartki x > 0, y > 0 (przekrój)."""
    r_hole, r_max, n_r, seg = 31.75, 72.0, 24, 72
    zo = lambda r: -151.5 + math.sqrt(150 ** 2 - r ** 2)
    zi = lambda r: -150.34 + math.sqrt(130 ** 2 - r ** 2)
    rs = [r_hole + (r_max - r_hole) * i / n_r for i in range(n_r + 1)]
    prof = [(r, zo(r)) for r in rs] + [(r, zi(r)) for r in reversed(rs)]
    m = len(prof)
    verts, faces = [], []
    for s in range(seg + 1):
        t = math.radians(90 + 270 * s / seg)
        for r, z in prof:
            verts.append((r * math.cos(t), r * math.sin(t), z))
    for s in range(seg):
        for i in range(m):
            j = (i + 1) % m
            faces.append([s * m + i, s * m + j, (s + 1) * m + j, (s + 1) * m + i])
    faces.append(list(range(m - 1, -1, -1)))
    faces.append([seg * m + i for i in range(m)])
    return verts, faces


def to_blender(verts, shift, flip):
    sx, sy, sz = shift
    out = []
    for x, y, z in verts:
        x, y, z = x + sx, y + sy, z + sz
        # flip: obrót o 180° wokół Y modelu i +Z modelu w dół (przyrząd do wklejania dnem na stole)
        out.append((-x, y, -z) if flip else (x, -z, y))
    return out


def vec_to_blender(v, flip):
    x, y, z = v
    return Vector((-x, y, -z)) if flip else Vector((x, -z, y))


# ---------------------------------------------------------------- Blender

MAT = {}


def material(key, rgb, alpha=1.0, metal=0.0, rough=0.45):
    if key in MAT:
        return MAT[key]
    m = bpy.data.materials.new(key)
    try:
        m.use_nodes = True
    except Exception:
        pass
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.inputs["Base Color"].default_value = (*rgb, 1.0)
    bsdf.inputs["Roughness"].default_value = rough
    bsdf.inputs["Metallic"].default_value = metal
    if alpha < 1.0:
        tr = nt.nodes.new("ShaderNodeBsdfTransparent")
        mix = nt.nodes.new("ShaderNodeMixShader")
        mix.inputs[0].default_value = alpha
        nt.links.new(tr.outputs[0], mix.inputs[1])
        nt.links.new(bsdf.outputs[0], mix.inputs[2])
        nt.links.new(mix.outputs[0], out.inputs["Surface"])
    else:
        nt.links.new(bsdf.outputs[0], out.inputs["Surface"])
    m.diffuse_color = (*rgb, alpha)
    MAT[key] = m
    return m


def make_obj(name, verts, faces, mat, smooth=True):
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, [], faces)
    me.validate()
    me.update()
    if smooth:
        try:
            me.shade_smooth()
            me.set_sharp_from_angle(angle=math.radians(32))
        except Exception:
            try:
                me.polygons.foreach_set("use_smooth", [True] * len(me.polygons))
                me.use_auto_smooth = True
                me.auto_smooth_angle = math.radians(32)
            except Exception:
                me.polygons.foreach_set("use_smooth", [False] * len(me.polygons))
    me.materials.append(mat)
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    return ob


def clear_scene():
    for ob in list(bpy.data.objects):
        bpy.data.objects.remove(ob, do_unlink=True)
    for me in list(bpy.data.meshes):
        bpy.data.meshes.remove(me)
    for li in list(bpy.data.lights):
        bpy.data.lights.remove(li)
    for ca in list(bpy.data.cameras):
        bpy.data.cameras.remove(ca)


def setup_render(scene):
    scene.render.engine = "CYCLES"
    c = scene.cycles
    c.device = "CPU"
    c.samples = 16 if SZYBKO else 48
    try:
        c.use_denoising = True
        c.denoiser = "OPENIMAGEDENOISE"
    except Exception:
        pass
    c.max_bounces = 6
    c.transparent_max_bounces = 32
    c.use_adaptive_sampling = True
    scene.render.resolution_x = 800 if SZYBKO else 1400
    scene.render.resolution_y = 600 if SZYBKO else 1050
    scene.render.resolution_percentage = 100
    scene.render.film_transparent = False
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGB"
    try:
        scene.view_settings.view_transform = "Standard"
    except Exception:
        pass
    w = bpy.data.worlds.new("swiat") if not bpy.data.worlds else bpy.data.worlds[0]
    scene.world = w
    try:
        w.use_nodes = True
    except Exception:
        pass
    nt = w.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    out = nt.nodes.new("ShaderNodeOutputWorld")
    lp = nt.nodes.new("ShaderNodeLightPath")
    bg_cam = nt.nodes.new("ShaderNodeBackground")
    bg_cam.inputs[0].default_value = (1, 1, 1, 1)
    bg_cam.inputs[1].default_value = 1.0
    bg_amb = nt.nodes.new("ShaderNodeBackground")
    bg_amb.inputs[0].default_value = (1, 1, 1, 1)
    bg_amb.inputs[1].default_value = 0.55
    mix = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(lp.outputs["Is Camera Ray"], mix.inputs[0])
    nt.links.new(bg_amb.outputs[0], mix.inputs[1])
    nt.links.new(bg_cam.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs["Surface"])


def color_for(role, kind, part=None, paleta=False):
    if role == "glass":
        return material("glass", KOLORY["glass"], alpha=0.30, rough=0.3)
    if role == "dynia":
        return material("dynia", KOLORY["dynia"], rough=0.7)
    if paleta and part in PALETA:
        return material("pal_" + part, PALETA[part])
    if kind == "metal":
        k = "new_metal" if role == "new" else "old_metal"
        return material(k, KOLORY[k], metal=0.6, rough=0.35)
    if part == "P":
        k = "new_kula" if role == "new" else "old_kula"
        return material(k, KOLORY[k], rough=0.25)
    k = role if role in ("new", "aux") else "old"
    return material(k, KOLORY[k])


def bbox(points):
    xs = [p[0] for p in points]
    ys = [p[1] for p in points]
    zs = [p[2] for p in points]
    return Vector((min(xs), min(ys), min(zs))), Vector((max(xs), max(ys), max(zs)))


def arrow(tail, d, length, r):
    head_len = min(length * 0.45, 4.0 * r)
    shaft = cylinder(tail, d, max(length - head_len, 0.1), r * 0.4, r * 0.4, 20)
    head = cylinder(tail + d * (length - head_len), d, head_len, r, 0.001, 24)
    return merge(shaft, head)


def render_step(step, cache):
    clear_scene()
    scene = bpy.context.scene
    flip = step.get("flip", False)
    old_pts, groups_pts = [], []
    all_pts = []
    for gi, gr in enumerate(step["groups"]):
        shift = tuple(gr["base"][i] + gr["offset"][i] for i in range(3))
        pts = []
        if gr["dynia"]:
            v, f = dynia()
            vb = to_blender(v, (0, 0, 0), flip)
            make_obj("dynia", vb, f, color_for("dynia", "part"), smooth=True)
            old_pts += vb
            all_pts += vb
        for p in gr["parts"]:
            v, f = cache[p]
            vb = to_blender(v, shift, flip)
            make_obj(f"{gi}_{p}", vb, f, color_for(gr["role"], "part", p, gr["paleta"]))
            pts += vb
        for s in gr["sruby"]:
            v, f = sruba(s)
            vb = to_blender(v, shift, flip)
            make_obj(f"{gi}_{s}", vb, f, color_for(gr["role"], "metal"), smooth=True)
            pts += vb
        for w in gr["wkladki"]:
            v, f = wkladka(w)
            vb = to_blender(v, shift, flip)
            make_obj(f"{gi}_{w}", vb, f, color_for(gr["role"], "metal"), smooth=True)
            pts += vb
        all_pts += pts
        if gr["role"] == "new" and gr["arrow"]:
            groups_pts.append((gr, pts))
        elif gr["role"] != "new":
            old_pts += pts

    # strzałki ruchu: od czoła odsuniętej części w stronę złożenia
    for gr, pts in groups_pts:
        if not pts:
            continue
        mv = -vec_to_blender(gr["offset"], flip)
        dist = mv.length
        d = mv.normalized()
        lo, hi = bbox(pts)
        c = (lo + hi) / 2
        half = sum(abs(d[i]) * (hi[i] - lo[i]) / 2 for i in range(3))
        tail = c + d * (half + 2.0)
        size = max(hi[i] - lo[i] for i in range(3))
        L = dist - 4.0
        if old_pts:
            olo, ohi = bbox(old_pts)
            face = sum(d[i] * (olo[i] if d[i] > 0 else ohi[i]) for i in range(3))
            gap = face - tail.dot(d)
            if gap - 2.0 >= 8.0:
                L = min(L, gap - 2.0)
        L = max(L, 6.0)
        r = max(1.6, min(3.2, size * 0.08))
        v, f = arrow(tail, d, L, r)
        make_obj("strzalka", [tuple(p) for p in v], f, material("strzalka", KOLORY["strzalka"], rough=0.6), smooth=False)
        all_pts += [tuple(p) for p in v]

    # kamera ortogonalna dopasowana do sceny
    lo, hi = bbox(all_pts)
    center = (lo + hi) / 2
    cdir = Vector(step["cam"]).normalized()
    cam_data = bpy.data.cameras.new("kamera")
    cam_data.type = "ORTHO"
    cam = bpy.data.objects.new("kamera", cam_data)
    scene.collection.objects.link(cam)
    rot = cdir.to_track_quat("Z", "Y")
    right = rot @ Vector((1, 0, 0))
    up = rot @ Vector((0, 1, 0))
    corners = [Vector((x, y, z)) for x in (lo.x, hi.x) for y in (lo.y, hi.y) for z in (lo.z, hi.z)]
    w = max(abs((p - center).dot(right)) for p in corners) * 2
    h = max(abs((p - center).dot(up)) for p in corners) * 2
    aspect = scene.render.resolution_x / scene.render.resolution_y
    cam_data.ortho_scale = max(w, h * aspect) * 1.06
    cam_data.clip_start = 1
    cam_data.clip_end = 5000
    cam.location = center + cdir * 800
    cam.rotation_mode = "QUATERNION"
    cam.rotation_quaternion = rot
    scene.camera = cam

    # światło: główne zza lewego ramienia kamery, słabsze z prawej
    for name, vec, energy in (("klucz", cdir + up * 0.9 - right * 0.7, 3.2), ("wypelnienie", cdir - up * 0.3 + right * 0.9, 1.0)):
        ld = bpy.data.lights.new(name, "SUN")
        ld.energy = energy
        ld.angle = math.radians(8)
        lo_ = bpy.data.objects.new(name, ld)
        scene.collection.objects.link(lo_)
        lo_.rotation_mode = "QUATERNION"
        lo_.rotation_quaternion = vec.normalized().to_track_quat("Z", "Y")

    scene.render.filepath = os.path.join(OUT_DIR, step["id"] + ".png")
    bpy.ops.render.render(write_still=True)
    print("ZAPISANO", scene.render.filepath, flush=True)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    setup_render(bpy.context.scene)
    potrzebne = set()
    kroki = [k for k in KROKI if not WYBRANE or any(k["id"].startswith(w) for w in WYBRANE)]
    for k in kroki:
        for gr in k["groups"]:
            potrzebne.update(gr["parts"])
    cache = {}
    for key in sorted(potrzebne):
        path = os.path.join(STL_DIR, PLIKI[key] + ".stl")
        cache[key] = load_stl(path)
        print("wczytano", key, len(cache[key][1]), "trójkątów", flush=True)
    for k in kroki:
        render_step(k, cache)


main()
