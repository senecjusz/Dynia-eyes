# Rendery instrukcji montażu modułu małego oka v2.7 (Blender, tryb bez okna).
#
# Uruchamianie: przez renderuj.sh (konwersja 3MF -> STL + ten skrypt):
#   blender -b --factory-startup -P renderuj.py -- <katalog_stl> <katalog_png> [--szybko] [krok ...]
#
# Układ modelu (jak w Onshape): oś modułu Z (+Z na zewnątrz dyni), +Y = GÓRA, mm.
# W Blenderze: X = x, Y = -z, Z = y (tył kasety = +Y Blendera, góra = +Z Blendera).
# Kolory: szare = już złożone, niebieskie = nowa część (odsunięta w kierunku wsuwania),
# złote = nowe śruby, podkładki, nakrętki i wkładki, kaseta przezroczysta, czerwona strzałka = ruch.

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

PLIKI = {  # v2.7: bryły z FullProject rozdzielone przez 3mf_do_stl.py --rozdziel
    "K": "Oko F v2.7 - Kaseta",
    "KH": "Oko F v2.7 - Klamra H",
    "J": "Oko F v2.7 - Jarzmo z miską",
    "R": "Oko F v2.7 - Ramię orczyka",
    "C": "Oko F v2.7 - Cięgno",
    "TC": "Oko F v2.7 - Tulejka przegubu korby",
    "TH": "Oko F v2.7 - Tulejka przegubu ramienia",
    "PT": "Oko F v2.7 - Pokrywa tylna",
    "G": "Oko F v2.7 - Gniazdo",
    "N": "Oko F v2.7 - Nakrętka",
    "P": "Oko F v2.4 - PODGLAD pileczka 40.5",
    "SG": "Oko F v2.4 - PODGLAD SG90",
    "O": "Oko F v2.4 - PODGLAD orczyk SG90",
    "PW": "Oko F v2.4 - Przyrzad do wklejania pileczki",
    "WD": "Oko F v2.4 - Widelec do zaczepow",
}

# Punkty z modelu (weryfikacja-v2.6.md, siatki v2.7), mm, układ modelu
C_PT = (7.382, -36.147)      # przegub C (x, z)
H_PT = (-9.235, -40.628)     # przegub H
UCHO = (20.45, 0.0)          # ucha Pokrywy w środku Kasety, ±X (x, y)
Y_PLYTA = 2.2                # wierzch płyty Cięgna

# Śruby i drobne części: (punkt pod łbem / spód, kierunek łeb->koniec, typ, długość)
SRUBY = {
    "os_gora": ((0, 25.55, -12), (0, -1, 0), "iso7380", 4),
    "os_dol": ((0, -25.55, -12), (0, 1, 0), "iso7380", 4),
    "srC": ((C_PT[0], -3.8, C_PT[1]), (0, 1, 0), "din912", 12),
    "srH": ((H_PT[0], -3.8, H_PT[1]), (0, 1, 0), "din912", 12),
    "podkC": ((C_PT[0], Y_PLYTA, C_PT[1]), (0, 1, 0), "podkladka", 0.5),
    "podkH": ((H_PT[0], Y_PLYTA, H_PT[1]), (0, 1, 0), "podkladka", 0.5),
    "nakC": ((C_PT[0], Y_PLYTA + 0.5, C_PT[1]), (0, 1, 0), "nakretka", 4),
    "nakH": ((H_PT[0], Y_PLYTA + 0.5, H_PT[1]), (0, 1, 0), "nakretka", 4),
    "pokr_p": ((UCHO[0], UCHO[1], -80.5), (0, 0, 1), "din912", 8),
    "pokr_l": ((-UCHO[0], UCHO[1], -80.5), (0, 0, 1), "din912", 8),
    "m2": ((-4.446, -0.5, -53.784), (0, -1, 0), "m2", 6),
    "orczyk": ((0, -0.5, -66), (0, -1, 0), "m2", 6),
    "ucho_p": ((0, -15.1, -46.75), (0, -1, 0), "m2", 6),
    "ucho_t": ((0, -15.1, -74.55), (0, -1, 0), "m2", 6),
}
WKLADKI = {
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
    "J": (0.08, 0.40, 0.85), "P": (0.97, 0.97, 0.97), "KH": (0.55, 0.30, 0.75), "SG": (0.20, 0.25, 0.65),
    "R": (0.90, 0.45, 0.05), "O": (0.95, 0.95, 0.95), "C": (0.15, 0.62, 0.30), "TC": (0.85, 0.10, 0.10),
    "TH": (0.85, 0.10, 0.10), "PT": (0.45, 0.45, 0.45),
}

# ---------------------------------------------------------------- kroki
TYL_GORA = (1.1, 1.6, 0.9)
TYL_DOL = (1.1, 1.6, -0.8)
BOK_TYL = (1.6, 1.1, 0.7)
PRZOD_GORA = (1.3, -1.2, 0.9)

SERWO = ["SG", "KH"]
SRUBY_SERWA = ["ucho_p", "ucho_t"]
NAPED = ["J", "P", "R", "C", "TC", "TH"]
PRZEGUBY = ["srC", "srH", "podkC", "podkH", "nakC", "nakH"]
MODUL = ["K"] + SERWO + ["O"] + NAPED + ["PT"]
SRUBY_MODULU = ["os_gora", "os_dol", "m2", "orczyk", "pokr_p", "pokr_l"] + SRUBY_SERWA + PRZEGUBY
WKLADKI_MODULU = ["wkU_p", "wkU_l"]


def g(role, parts=(), sruby=(), wkladki=(), offset=(0, 0, 0), base=(0, 0, 0), arrow=None, dynia=False, paleta=False):
    return dict(role=role, parts=list(parts), sruby=list(sruby), wkladki=list(wkladki), offset=offset,
                base=base, arrow=(arrow if arrow is not None else any(offset)), dynia=dynia, paleta=paleta)


KROKI = [
    dict(id="00_kaseta_zlozona", cam=(1.5, 0.5, 1.0), groups=[
        g("glass", ["K"]),
        g("old", [p for p in MODUL if p != "K"], SRUBY_MODULU, WKLADKI_MODULU, paleta=True)]),
    dict(id="01_wkladki", cam=TYL_GORA, groups=[
        g("old", ["K"]),
        g("new", wkladki=["wkU_p"], offset=(0, 0, -16)),
        g("new", wkladki=["wkU_l"], offset=(0, 0, -16))]),
    dict(id="02_klejenie_pileczki", cam=(1.2, 1.4, 0.8), flip=True, groups=[
        g("old", ["PW"]),
        g("new", ["P"], base=(130, 0, 0), offset=(0, 0, -30)),
        g("new", ["J"], base=(130, 0, 0), offset=(0, 0, -62))]),
    dict(id="03_serwo_klamra", cam=(1.2, 1.6, -0.5), groups=[
        g("glass", ["K"]),
        g("new", SERWO, SRUBY_SERWA, offset=(0, 0, -55))]),
    dict(id="03b_wkret_przedni", cam=(0.9, 0.7, 1.4), groups=[
        g("glass", ["K"]),
        g("old", SERWO, ["ucho_t"]),
        g("new", sruby=["ucho_p"], offset=(0, 38, 0))]),
    dict(id="04_dzwigienka", cam=TYL_GORA, groups=[
        g("glass", ["K"]),
        g("old", SERWO, SRUBY_SERWA),
        g("new", ["O"], offset=(0, 14, 0)),
        g("new", sruby=["orczyk"], offset=(0, 30, 0), arrow=False)]),
    dict(id="05_naped_na_stole", cam=(1.3, 1.1, 0.55), groups=[
        g("old", ["J", "P", "R"]),
        g("new", ["C"], offset=(0, 10, 0)),
        g("new", ["TC"], ["srC"], offset=(0, -22, 0)),
        g("new", ["TH"], ["srH"], offset=(0, -22, 0)),
        g("new", sruby=["podkC", "nakC"], offset=(0, 22, 0)),
        g("new", sruby=["podkH", "nakH"], offset=(0, 22, 0))]),
    dict(id="06_naped_do_kasety", cam=PRZOD_GORA, groups=[
        g("glass", ["K"]),
        g("old", SERWO + ["O"], SRUBY_SERWA + ["orczyk"]),
        g("new", NAPED, PRZEGUBY, offset=(0, 0, 60)),
        g("new", sruby=["os_gora"], offset=(0, 12, 0)),
        g("new", sruby=["os_dol"], offset=(0, -12, 0))]),
    dict(id="07_wkret_ramienia", cam=(0.9, 0.7, 1.4), groups=[
        g("glass", ["K"]),
        g("old", SERWO + ["O"] + NAPED, SRUBY_SERWA + ["orczyk", "os_gora", "os_dol"] + PRZEGUBY),
        g("new", sruby=["m2"], offset=(0, 34, 0))]),
    dict(id="08_pokrywa", cam=TYL_GORA, groups=[
        g("glass", ["K"]),
        g("old", SERWO + ["O"] + NAPED, SRUBY_SERWA + ["orczyk", "os_gora", "os_dol", "m2"] + PRZEGUBY, WKLADKI_MODULU),
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
    elif typ == "podkladka":  # DIN 125 M3: Ø7 × 0,5
        return cylinder(p, ax, L, 3.5, 3.5, 40)
    elif typ == "nakretka":  # DIN 985 M3: klucz 5,5, wys. 4 (sześciokąt + kołnierz z nylonem)
        return merge(cylinder(p, ax, 3.0, 3.175, 3.175, 6), cylinder(p + a * 3.0, ax, 1.0, 2.6, 2.4, 24))
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
        if gr["role"] in ("new", "aux") and gr["arrow"]:
            groups_pts.append((gr, pts))
        elif gr["role"] != "new":
            old_pts += pts

    # strzałki ruchu: od czoła odsuniętej części w stronę złożenia
    for gr, pts in groups_pts:
        if not pts or not any(gr["offset"]):
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


# ---------------------------------------------------------------- części osobno (--czesci)
# Obrazki „Części i ich miejsca” i miniatury galerii. Blender zapisuje surowy render i plik JSON
# z położeniem punktów (kotwic) w pikselach; podpisy i linie dokłada podpisz.py (SVG -> PNG).
# Kotwice w układzie modelu (mm, przed obrotem instancji). Strona podpisu: "L" albo "P".

WIDE = (1800, 1000)
KOLOR_CZESCI = (0.32, 0.56, 0.88)


def inst(part, rot=(), podpis=None, kolor=None):
    return dict(part=part, rot=list(rot), podpis=podpis, kolor=kolor)


C3 = (C_PT[0], C_PT[1])
H3 = (H_PT[0], H_PT[1])

CZESCI = [
    dict(id="czesc_kaseta_tyl", cam=(-0.9, 1.6, 0.9), inst=[inst("K")], kotwice=[
        ("ucho Pokrywy|w środku, z otworem na wkładkę", 0, (-20.45, 3.8, -77.5), "A"),
        ("ucho Pokrywy|(drugie, po drugiej stronie)", 0, (20.45, 3.8, -77.5), "A"),
        ("okno w górnej ściance|na wkrętak (wkręty serwa i Ramienia)", 0, (0.0, 27.25, -60.0), "A"),
        ("rowek na żebro Gniazda|płytki rowek wzdłuż Kasety", 0, (-18.6, 18.6, -30.0), "A"),
        ("zagłębienie na łeb|śruby osi (u góry i u dołu)", 0, (0.0, 28.0, -12.0), "A"),
        ("szczelina na serwo|w spodzie Kasety", 0, (5.0, -26.0, -77.5), "A"),
    ]),
    dict(id="czesc_kaseta_blok", cam=(-0.25, 1.0, 0.55), inst=[inst("K")],
         kadr=[(-13.0, -27.5, -78.0), (13.0, -12.0, -44.0)], kotwice=[
        ("blok|tu leży przednie ucho serwa", 0, (-2.75, -19.5, -46.5), "A"),
        ("otwór Ø2|na wkręt przedniego ucha", 0, (0.0, -17.6, -46.75), "A"),
        ("kanał z fazką|końcówka wstępnie wkręconego wkrętu", 0, (0.0, -19.1, -47.5), "A"),
        ("szczelina na serwo|korpus i łącznik Klamry H", 0, (0.0, -25.0, -70.0), "A"),
    ]),
    dict(id="czesc_kaseta_spod", cam=(-1.0, 0.8, -1.4), inst=[inst("K")], kotwice=[
        ("zaczep z haczykiem|sprężysty języczek; drugi", 0, (-19.27, -20.66, -40.0), "A"),
        ("", 0, None, None),
        ("otwór dolny pod korbą", 0, (C3[0], -26.2, C3[1]), "A"),
        ("otwór dolny pod Ramieniem", 0, (H3[0], -25.6, H3[1]), "A"),
        ("szczelina na serwo|i łącznik Klamry H", 0, (0.0, -27.0, -62.0), "A"),
        ("zagłębienie na łeb|śruby osi (dolne)", 0, (0.0, -28.0, -12.0), "A"),
    ]),
    dict(id="czesc_klamra", cam=(0.9, -1.2, 0.6), inst=[inst("KH")], kotwice=[
        ("ramię wewnętrzne|pod tylnym uchem serwa", 0, (-6.0, -17.6, -75.0), "A"),
        ("otwór na wkręt|tylne ucho serwa", 0, (0.0, -17.6, -74.55), "A"),
        ("łącznik|przechodzi przez szczelinę", 0, (6.35, -25.75, -75.0), "A"),
        ("ramię zewnętrzne|pod ścianką Kasety, nad kablem", 0, (6.0, -28.4, -72.6), "A"),
        ("przód Klamry|fazki na krawędziach, do wsuwania", 0, (-8.0, -20.0, -72.6), "A"),
    ]),
    dict(id="czesc_jarzmo", cam=(1.6, 1.1, 0.7), inst=[inst("J")], kotwice=[
        ("oczko|ucho z otworem na oś", 0, (0.0, 23.0, -12.0), "L"),
        ("oczko|(dolne)", 0, (0.0, -23.0, -12.0), "L"),
        ("kołek|zatrzymuje obrót oka;|u góry i u dołu", 0, (0.0, 24.75, -18.7), "P"),
        ("pas miski|obręcz, tu idzie klej", 0, (18.9, 6.0, -22.9), "P"),
        ("korba|ramię z otworem,|wystaje do tyłu", 0, (C3[0] + 3.5, -0.5, C3[1] - 2.0), "P"),
    ]),
    dict(id="czesc_ramie", cam=(0.25, 0.35, 1.0), inst=[
        inst("R", podpis="wierzch"), inst("R", rot=[("z", 180)], podpis="spód (strona serwa)")], kotwice=[
        ("otwór na wkręt środkowy|nad wałkiem serwa", 0, (0.0, -0.5, -66.0), "L"),
        ("otwór na wkręt M2×6|dźwigienka do Ramienia", 0, (-4.446, -0.5, -53.784), "L"),
        ("otwór przegubu|tu wchodzi Tulejka ramienia", 0, (H3[0], -0.5, H3[1]), "L"),
        ("kieszeń na dźwigienkę", 1, (-3.0, -4.5, -58.0), "P"),
    ]),
    dict(id="czesc_ciegno", cam=(0.5, 0.8, 1.0), inst=[inst("C")], kotwice=[
        ("otwór C Ø3,3|do korby Jarzma", 0, (C3[0], 2.2, C3[1]), "A"),
        ("otwór H Ø3,3|do Ramienia", 0, (H3[0], 2.2, H3[1]), "A"),
        ("płyta|na górze podkładka i nakrętka", 0, (-1.0, 2.2, -38.4), "A"),
    ]),
    dict(id="czesc_tulejka", cam=(0.9, 0.9, 0.6), inst=[inst("TC")], kotwice=[
        ("kołnierz|szerszy brzeg, do łba śruby", 0, (C3[0] + 4.0, -3.4, C3[1]), "P"),
        ("trzon|wchodzi w otwór korby|albo Ramienia", 0, (C3[0] + 2.8, -1.5, C3[1]), "L"),
        ("otwór na śrubę M3×12", 0, (C3[0], -0.3, C3[1] - 1.65), "L"),
    ]),
    dict(id="czesc_pokrywa", cam=(0.0, 1.0, 0.25), inst=[
        inst("PT", podpis="od zewnątrz (do Ciebie)"),
        inst("PT", rot=[("y", 180)], podpis="od środka (do serwa)")], kotwice=[
        ("otwór na śrubę M3×8|(2 szt., na ucha Kasety)", 0, (20.45, 0.0, -80.5), "L"),
        ("otwór", 0, (-20.45, 0.0, -80.5), "L"),
        ("płaski krążek|obie strony takie same", 1, (0.0, -15.0, -77.5), "P"),
    ]),
    dict(id="czesc_gniazdo", cam=(0.45, 1.0, 0.45), inst=[
        inst("G", rot=[("y", 180)], podpis="od zewnątrz dyni"),
        inst("G", podpis="od środka dyni")], kotwice=[
        ("rant Ø67,5|opiera się o skórkę", 0, (-23.9, -23.9, 0.0), "A"),
        ("strzałka GÓRA", 0, (0.0, 30.5, 0.0), "A"),
        ("ząbki przy ściance|wbijają się w skórkę", 1, (32.25, 0.0, -4.2), "A"),
        ("gwint|na Nakrętkę", 0, (0.0, 30.9, -30.0), "A"),
        ("bruzda na łeb śruby osi|u góry i u dołu", 1, (0.0, 28.4, -45.7), "A"),
        ("okienko zaczepu|(2 szt.)", 1, (18.75, 20.1, -40.2), "A!"),
        ("żebro|listwa w środku,|pasuje w rowek Kasety", 1, (-18.95, 18.95, -45.4), "A"),
    ]),
    dict(id="czesc_nakretka", cam=(0.5, 1.0, 0.6), inst=[
        inst("N", rot=[("y", 180)], podpis="od strony dyni"),
        inst("N", podpis="od strony Ciebie")], kotwice=[
        ("czoło zaokrąglone|do ścianki dyni", 0, (0.0, -33.5, -24.5), "A"),
        ("radełko|rowki pod palce", 0, (-37.0, 0.0, -27.5), "A"),
        ("wycięcie na klucz|(6 szt.)", 1, (17.5, 30.3, -28.4), "A"),
    ]),
    dict(id="czesc_serwo", cam=(1.2, 1.2, 1.0), inst=[
        inst("SG", podpis="serwo SG90", kolor=(0.20, 0.25, 0.65)),
        inst("O", podpis="dźwigienka (orczyk)", kolor=(0.55, 0.55, 0.55))], kotwice=[
        ("wałek|ząbkowany trzpień;|na niego wchodzi dźwigienka", 0, (0.0, -4.5, -66.0), "L"),
        ("ucho przednie|na blok Kasety", 0, (0.0, -15.1, -46.0), "L"),
        ("ucho tylne|do Klamry H (strona wałka)", 0, (0.0, -15.1, -75.5), "L"),
        ("kabel|wychodzi z tyłu, nisko", 0, (0.0, -31.4, -80.0), "L"),
        ("otwór na środku|na wkręt środkowy", 1, (0.0, -3.0, -66.0), "P"),
        ("ramię dźwigienki|z otworkami", 1, (-3.0, -3.0, -56.0), "P"),
    ]),
    dict(id="czesc_przyrzad_klejenia", cam=(1.2, 1.4, 0.8), inst=[inst("PW", rot=[("x", 90), ("y", 180)])], kotwice=[
        ("stożek|tu leży piłeczka", 0, (130.0, -9.0, 1.0), "A"),
        ("okienko na źrenicę|na dnie stożka, widać je od spodu", 0, (130.0, 0.0, 2.5), "A"),
        ("słupek|(2 szt.)", 0, (124.0, -28.0, -21.5), "A"),
        ("gniazdo na kołek|wąskie wycięcie na górze słupka", 0, (130.0, -26.0, -21.5), "A"),
        ("tu przylega oczko Jarzma", 0, (130.0, -23.35, -8.0), "A"),
        ("otwór na śrubę M3×10|wkręcasz od zewnątrz słupka", 0, (130.0, 31.0, -12.0), "A"),
    ]),
    dict(id="czesc_widelec", cam=(0.4, 1.0, 1.2), inst=[inst("WD")], kotwice=[
        ("bolec|wchodzi w okienko Gniazda", 0, (20.1, 21.6, -41.45), "A"),
        ("bolec", 0, (-20.1, -21.6, -41.45), "A"),
        ("uchwyt|tu ściskasz palcami", 0, (25.9, 27.8, -41.45), "A"),
        ("uchwyt", 0, (-25.9, -27.8, -41.45), "A"),
    ]),
]

# miniatury galerii: (id, [(część albo "sruba:<typ>", kolor)], kamera, stała skala kadru w mm albo None)
SG_KOLOR = (0.20, 0.25, 0.65)
MINIATURY = [
    ("min_G", [("G", None)], (0.6, -1.0, 0.5), None),
    ("min_N", [("N", None)], (0.6, 1.0, 0.6), None),
    ("min_K", [("K", None)], (1.2, 1.4, 0.8), None),
    ("min_KH", [("KH", None)], (0.9, 1.2, 0.6), None),
    ("min_J", [("J", None)], (1.6, 1.1, 0.7), None),
    ("min_R", [("R", None)], (0.6, 0.6, 1.0), None),
    ("min_C", [("C", None)], (0.6, 0.8, 1.0), None),
    ("min_TC", [("TC", None)], (0.9, 0.9, 0.6), None),
    ("min_TH", [("TH", None)], (0.9, 0.9, 0.6), None),
    ("min_PT", [("PT", None)], (0.6, 1.4, 0.5), None),
    ("min_PW", [("PW", None)], (1.2, 1.4, 0.8), None),
    ("min_WD", [("WD", None)], (0.4, 1.0, 1.2), None),
    ("min_SG", [("SG", SG_KOLOR), ("O", (0.55, 0.55, 0.55))], (1.0, 1.2, 1.5), None),
    ("min_P", [("P", (0.97, 0.97, 0.97))], (1.0, 1.0, 0.6), None),
    ("min_m3x4", [("sruba:m3x4", None)], (1.0, 1.0, 0.45), 15.0),
    ("min_m3x8", [("sruba:m3x8", None)], (1.0, 1.0, 0.45), 15.0),
    ("min_m3x10", [("sruba:m3x10", None)], (1.0, 1.0, 0.45), 15.0),
    ("min_m3x12", [("sruba:m3x12", None)], (1.0, 1.0, 0.45), 17.0),
    ("min_podkladka", [("sruba:podkladka", None)], (1.0, 1.0, 0.45), 15.0),
    ("min_nakretka", [("sruba:nakretka", None)], (1.0, 1.0, 0.45), 15.0),
    ("min_m2x6", [("sruba:m2x6", None)], (1.0, 1.0, 0.45), 15.0),
    ("min_m2x5", [("sruba:m2x5", None)], (1.0, 1.0, 0.45), 15.0),
    ("min_wkladka", [("sruba:wkladka", None)], (1.0, 1.0, 0.45), 15.0),
]


def lathe(prof, seg=48):
    """prof: zamknięty wielobok (r, z) w płaszczyźnie osiowej; oś obrotu = Z Blendera."""
    m = len(prof)
    verts, faces = [], []
    for s in range(seg):
        t = 2 * math.pi * s / seg
        c, si = math.cos(t), math.sin(t)
        verts += [(r * c, r * si, z) for r, z in prof]
    for s in range(seg):
        n = (s + 1) % seg
        for i in range(m):
            j = (i + 1) % m
            faces.append([s * m + i, s * m + j, n * m + j, n * m + i])
    return verts, faces


def gwint(r_maj, r_min, z0, z1, skok):
    """Profil trzonu z rowkami (pierścienie zamiast helisy), od z0 w dół do z1 (z1 < z0)."""
    pts = [(0.001, z0), (r_maj, z0)]
    z = z0
    while z - skok > z1:
        pts += [(r_maj, z - skok * 0.2), (r_min, z - skok * 0.5), (r_maj, z - skok * 0.8)]
        z -= skok
    pts += [(r_maj * 0.85, z1), (0.001, z1)]
    return pts


def prism(cx, cy, z0, h, r, n, rot=0.0):
    verts = []
    for z in (z0, z0 + h):
        for i in range(n):
            t = rot + 2 * math.pi * i / n
            verts.append((cx + r * math.cos(t), cy + r * math.sin(t), z))
    faces = [[i, (i + 1) % n, n + (i + 1) % n, n + i] for i in range(n)]
    faces += [list(range(n - 1, -1, -1)), list(range(n, 2 * n))]
    return verts, faces


def box(cx, cy, z0, dx, dy, h):
    v, f = prism(0, 0, z0, h, math.hypot(dx, dy) / 2, 4, math.atan2(dy, dx))
    return [(x + cx, y + cy, z) for x, y, z in v], f


def sruba_galeria(typ):
    """Śruby z listy, w Blenderze pionowo: łeb na górze (z > 0), trzon w dół. Zwraca [(v, f, rola)]."""
    out = []
    if typ == "wkladka":
        prof = [(1.5, 0), (2.3, 0), (2.3, -0.6), (2.05, -0.9), (2.4, -1.3), (2.4, -1.9), (2.05, -2.2),
                (2.4, -2.6), (2.4, -3.2), (2.05, -3.5), (2.2, -4.0), (1.5, -4.0)]
        out.append((*lathe(prof, 40), "metal"))
        return out
    if typ == "podkladka":  # DIN 125 M3: Ø7 × 0,5, otwór Ø3,2
        out.append((*lathe([(1.6, 0), (3.5, 0), (3.5, -0.5), (1.6, -0.5)], 48), "metal"))
        return out
    if typ == "nakretka":  # DIN 985 M3: sześciokąt 5,5 × 3, kołnierz z nylonowym pierścieniem
        out.append((*prism(0, 0, -3.0, 3.0, 3.175, 6), "metal"))
        out.append((*lathe([(1.6, 0), (2.6, 0), (2.4, 1.0), (1.6, 1.0)], 40), "metal"))
        out.append((*lathe([(1.25, -3.05), (1.6, -3.05), (1.6, 1.05), (1.25, 1.05)], 24), "dziura"))
        return out
    if typ.startswith("m3"):
        L = {"m3x4": 4, "m3x8": 8, "m3x10": 10, "m3x12": 12}[typ]
        out.append((*lathe(gwint(1.5, 1.2, 0.0, -L, 0.5), 32), "metal"))
        if typ == "m3x4":  # ISO 7380: łeb płaski, okrągły
            prof = [(0.001, 0), (2.85, 0), (2.85, 0.35), (2.5, 1.1), (1.7, 1.55), (0.001, 1.65)]
            out.append((*lathe(prof, 48), "metal"))
            out.append((*prism(0, 0, 1.0, 0.7, 1.15, 6), "dziura"))
        else:  # DIN 912: łeb walcowy, wysoki
            prof = [(0.001, 0), (2.75, 0), (2.75, 2.75), (2.5, 3.0), (0.001, 3.0)]
            out.append((*lathe(prof, 48), "metal"))
            out.append((*prism(0, 0, 1.6, 1.45, 1.44, 6), "dziura"))
        return out
    L = {"m2x6": 6, "m2x5": 5}[typ]
    out.append((*lathe(gwint(1.0, 0.7, 0.0, -L, 0.45), 32), "metal"))
    prof = [(0.001, 0), (1.9, 0), (1.9, 0.6), (1.6, 1.2), (0.001, 1.3)]
    out.append((*lathe(prof, 48), "metal"))
    out.append((*box(0, 0, 0.95, 2.0, 0.45, 0.4), "dziura"))
    out.append((*box(0, 0, 0.95, 0.45, 2.0, 0.4), "dziura"))
    return out


def rot_model(verts, rot):
    if not rot:
        return verts
    from mathutils import Matrix
    M = Matrix.Identity(3)
    for ax, deg in rot:
        M = Matrix.Rotation(math.radians(deg), 3, ax.upper()) @ M
    return [tuple(M @ Vector(v)) for v in verts]


def kamera(scene, pts, cvec, fill_w=1.0, fill_h=1.0, skala=None):
    lo, hi = bbox(pts)
    center = (lo + hi) / 2
    cdir = Vector(cvec).normalized()
    cam_data = bpy.data.cameras.new("kamera")
    cam_data.type = "ORTHO"
    cam = bpy.data.objects.new("kamera", cam_data)
    scene.collection.objects.link(cam)
    rot = cdir.to_track_quat("Z", "Y")
    right = rot @ Vector((1, 0, 0))
    up = rot @ Vector((0, 1, 0))
    w = max(abs((p - center).dot(right)) for p in map(Vector, pts)) * 2
    h = max(abs((p - center).dot(up)) for p in map(Vector, pts)) * 2
    aspect = scene.render.resolution_x / scene.render.resolution_y
    cam_data.ortho_scale = skala if skala else max(w / fill_w, h / fill_h * aspect) * 1.06
    cam_data.clip_start = 1
    cam_data.clip_end = 5000
    cam.location = center + cdir * 800
    cam.rotation_mode = "QUATERNION"
    cam.rotation_quaternion = rot
    scene.camera = cam
    for name, vec, energy in (("klucz", cdir + up * 0.9 - right * 0.7, 3.2), ("wypelnienie", cdir - up * 0.3 + right * 0.9, 1.0)):
        ld = bpy.data.lights.new(name, "SUN")
        ld.energy = energy
        ld.angle = math.radians(8)
        lo_ = bpy.data.objects.new(name, ld)
        scene.collection.objects.link(lo_)
        lo_.rotation_mode = "QUATERNION"
        lo_.rotation_quaternion = vec.normalized().to_track_quat("Z", "Y")
    return cam, cdir, right, up


def px(scene, cam, co):
    from bpy_extras.object_utils import world_to_camera_view
    v = world_to_camera_view(scene, cam, Vector(co))
    return round(v.x * scene.render.resolution_x, 1), round((1 - v.y) * scene.render.resolution_y, 1)


def render_czesc(cz, cache):
    import json
    clear_scene()
    scene = bpy.context.scene
    scene.render.resolution_x, scene.render.resolution_y = (WIDE[0] // 2, WIDE[1] // 2) if SZYBKO else WIDE
    cdir0 = Vector(cz["cam"]).normalized()
    right0 = cdir0.to_track_quat("Z", "Y") @ Vector((1, 0, 0))
    objs, all_pts, cur = [], [], 0.0
    for k, it in enumerate(cz["inst"]):
        v, f = cache[it["part"]]
        vb = [Vector(p) for p in to_blender(rot_model(v, it["rot"]), (0, 0, 0), False)]
        lo, hi = bbox(vb)
        c = (lo + hi) / 2
        ext = max(abs((p - c).dot(right0)) for p in vb)
        shift = right0 * (cur + ext) - c if k else -c
        cur = (cur + 2 * ext + max(hi - lo) * 0.25) if k else (ext + max(hi - lo) * 0.25)
        vb = [tuple(p + shift) for p in vb]
        rgb = it["kolor"] or KOLOR_CZESCI
        ob = make_obj(f"i{k}", vb, f, material("cz_%d_%d_%d" % tuple(int(x * 100) for x in rgb), rgb))
        objs.append((ob, it, shift))
        all_pts += vb
    kadr = all_pts
    if cz.get("kadr"):
        ob0, it0, sh0 = objs[0]
        lo_, hi_ = cz["kadr"]
        rog = [(x, y, z) for x in (lo_[0], hi_[0]) for y in (lo_[1], hi_[1]) for z in (lo_[2], hi_[2])]
        kadr = [tuple(Vector(q) + sh0) for q in to_blender(rot_model(rog, it0["rot"]), (0, 0, 0), False)]
    cam, cdir, right, up = kamera(scene, kadr, cz["cam"], fill_w=0.50, fill_h=0.84)
    bpy.context.view_layer.update()
    dg = bpy.context.evaluated_depsgraph_get()
    wynik = dict(id=cz["id"], W=scene.render.resolution_x, H=scene.render.resolution_y, kotwice=[], podpisy=[])
    for tekst, k, p, strona in cz["kotwice"]:
        if p is None:
            continue
        ob, it, shift = objs[k]
        q = Vector(to_blender(rot_model([p], it["rot"]), (0, 0, 0), False)[0]) + shift
        ok, loc, _, _ = ob.closest_point_on_mesh(q)
        if ok and (loc - q).length < 1.0:  # punkt na powierzchni; środek otworu zostaje na miejscu
            q = loc
        hit, hloc, _, _, _, _ = scene.ray_cast(dg, q + cdir * 700, -cdir)
        widoczna = (not hit) or (hloc - q).dot(cdir) < 0.6 or strona.endswith("!")
        strona = strona.rstrip("!")
        wynik["kotwice"].append(dict(tekst=tekst, strona=strona, xy=px(scene, cam, q), widoczna=widoczna))
        if not widoczna:
            print("ZASŁONIĘTA", cz["id"], tekst.split("|")[0], flush=True)
    for ob, it, shift in objs:
        if it["podpis"]:
            pts = [Vector(v.co) for v in ob.data.vertices]
            ys = [px(scene, cam, p)[1] for p in pts]
            xs = [px(scene, cam, p)[0] for p in pts]
            wynik["podpisy"].append(dict(tekst=it["podpis"], xy=((min(xs) + max(xs)) / 2, max(ys) + 20)))
    scene.render.filepath = os.path.join(OUT_DIR, cz["id"] + ".png")
    bpy.ops.render.render(write_still=True)
    with open(os.path.join(OUT_DIR, cz["id"] + ".json"), "w", encoding="utf-8") as fh:
        json.dump(wynik, fh, ensure_ascii=False, indent=1)
    print("ZAPISANO", scene.render.filepath, flush=True)


def render_miniatura(mid, items, cvec, skala, cache):
    clear_scene()
    scene = bpy.context.scene
    scene.render.resolution_x = scene.render.resolution_y = 250 if SZYBKO else 500
    pts = []
    for key, rgb in items:
        if key.startswith("sruba:"):
            for v, f, rola in sruba_galeria(key[6:]):
                mat = (material("new_metal", KOLORY["new_metal"], metal=0.6, rough=0.35) if rola == "metal"
                       else material("dziura", (0.04, 0.04, 0.04), rough=0.8))
                make_obj(mid + rola, v, f, mat, smooth=(rola == "metal"))
                pts += v
            continue
        v, f = cache[key]
        vb = to_blender(v, (0, 0, 0), False)
        rgb = rgb or KOLOR_CZESCI
        make_obj(mid + key, vb, f, material("cz_%d_%d_%d" % tuple(int(x * 100) for x in rgb), rgb))
        pts += vb
    if skala:  # śruby: kadr wyśrodkowany na osi, łeb zawsze na tej samej wysokości
        pts = pts + [(0, 0, -11.0 if skala <= 15 else -13.0), (0, 0, 3.5)]
    kamera(scene, pts, cvec, skala=skala)
    scene.render.filepath = os.path.join(OUT_DIR, mid + ".png")
    bpy.ops.render.render(write_still=True)
    print("ZAPISANO", scene.render.filepath, flush=True)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    setup_render(bpy.context.scene)
    if "--czesci" in argv:
        potrzebne = {it["part"] for cz in CZESCI for it in cz["inst"]}
        potrzebne |= {k for m in MINIATURY for k, _ in m[1] if not k.startswith("sruba:")}
        cache = {}
        for key in sorted(potrzebne):
            cache[key] = load_stl(os.path.join(STL_DIR, PLIKI[key] + ".stl"))
        for cz in CZESCI:
            if not WYBRANE or any(cz["id"].startswith(w) for w in WYBRANE):
                render_czesc(cz, cache)
        for m in MINIATURY:
            if not WYBRANE or any(m[0].startswith(w) for w in WYBRANE):
                render_miniatura(*m, cache)
        return
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
