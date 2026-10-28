# Rysunki schematyczne skrętek do montaz-elektroniki.md, rozdział 5 (SVG → PNG przez rsvg-convert).
# Użycie: python3 schematy.py   → img/krok07d-lutowanie-wtyczek.png, img/krok07e-serwa-strona-oczu.png
# Wymaga: rsvg-convert (librsvg), czcionka Liberation Sans albo DejaVu Sans.
import os, subprocess

TU = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(TU, "img")
FONT = "Liberation Sans, DejaVu Sans, Arial, sans-serif"

# T568B: żyła → (nazwa, kolor bazowy, kolor paska lub None)
ZYLA = {1: ("biało-pomarańczowa", "#ffffff", "#f07f12"), 2: ("pomarańczowa", "#f07f12", None),
        3: ("biało-zielona", "#ffffff", "#1f9a2f"), 4: ("niebieska", "#1f5fd1", None),
        5: ("biało-niebieska", "#ffffff", "#1f5fd1"), 6: ("zielona", "#1f9a2f", None),
        7: ("biało-brązowa", "#ffffff", "#7a4a1e"), 8: ("brązowa", "#7a4a1e", None)}
SERWO = {"b": ("brązowy", "#6b3a17"), "c": ("czerwony", "#d81e1e"), "p": ("pomarańczowy", "#f06a00")}
KOSZ = "#5c5c5c"

def tekst(x, y, t, size=22, kolor="#111", anchor="start", bold=False):
    w = ' font-weight="bold"' if bold else ""
    return f'<text x="{x}" y="{y}" font-family="{FONT}" font-size="{size}" fill="{kolor}" text-anchor="{anchor}"{w}>{t}</text>'

def przewod(d, kolor, pasek=None, sz=10):
    """d: ścieżka SVG; obrys ciemny, biała obwódka (czytelne skrzyżowania), kolor, ewentualny pasek."""
    s = f'<path d="{d}" fill="none" stroke="#ffffff" stroke-width="{sz + 8}" stroke-linecap="round"/>'
    s += f'<path d="{d}" fill="none" stroke="#333" stroke-width="{sz + 2}" stroke-linecap="round"/>'
    s += f'<path d="{d}" fill="none" stroke="{kolor}" stroke-width="{sz}" stroke-linecap="round"/>'
    if pasek:
        s += f'<path d="{d}" fill="none" stroke="{pasek}" stroke-width="{sz}" stroke-dasharray="14 10"/>'
    return s

def zyla(d, z, sz=10):
    _, k, p = ZYLA[z]
    return przewod(d, k, p, sz)

def koszulka(x, y, w=80, h=22):
    return f'<rect x="{x}" y="{y - h / 2}" width="{w}" height="{h}" rx="6" fill="{KOSZ}" stroke="#222" stroke-width="2"/>'

def zapisz(nazwa, w, h, tresc):
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">'
           f'<rect width="{w}" height="{h}" fill="#ffffff"/>{tresc}</svg>')
    p_svg = os.path.join(IMG, nazwa + ".svg")
    open(p_svg, "w", encoding="utf-8").write(svg)
    p_png = os.path.join(IMG, nazwa + ".png")
    subprocess.run(["rsvg-convert", "-w", str(w), "-b", "white", "-o", p_png, p_svg], check=True)
    os.remove(p_svg)
    print("ZAPISANO", p_png)

def strzalka_wym(x0, x1, y, t):
    s = f'<line x1="{x0}" y1="{y}" x2="{x1}" y2="{y}" stroke="#b00020" stroke-width="3"/>'
    for x, d in ((x0, 1), (x1, -1)):
        s += f'<path d="M{x},{y} l{14 * d},-8 l0,16 z" fill="#b00020"/>'
        s += f'<line x1="{x}" y1="{y - 16}" x2="{x}" y2="{y + 16}" stroke="#b00020" stroke-width="2"/>'
    return s + tekst((x0 + x1) / 2, y - 14, t, 22, "#b00020", "middle", True)

# ---------- krok07d: strona tacki – żyły do wtyczek odciętych od serw ----------
def krok07d():
    W, H = 1600, 1060
    s = tekst(30, 52, "5  Strona tacki: żyły skrętki → 4 wtyczki odcięte od serw (T568B)", 34, bold=True)
    s += tekst(30, 88, "każdy lut w koszulce · przewód wtyczki: brązowy GND, czerwony V+, pomarańczowy sygnał · brązowy od krawędzi płytki", 21, "#555")
    # wiersze: (wtyczka, przewód wtyczki, żyła albo None = obcięty)
    WIERSZE = []
    grupy = [("A", "n", {"b": 5, "c": 4, "p": 1}), ("B", "n+1", {"b": None, "c": None, "p": 2}),
             ("C", "n+2", {"b": 8, "c": 7, "p": 3}), ("D", "n+3", {"b": None, "c": None, "p": 6})]
    y0, dy, dg = 190, 42, 66
    yc = 0
    for gi, (lit, kan, m) in enumerate(grupy):
        for ri, r in enumerate("bcp"):
            WIERSZE.append((lit, kan, r, m[r], y0 + gi * (3 * dy + dg) + ri * dy))
    xj, xr, xk, xw, xp = 300, 470, 760, 840, 1180          # koniec płaszcza, początek prostej, koszulka, przewód wtyczki, wtyczka
    yj = (WIERSZE[0][4] + WIERSZE[-1][4]) / 2
    # płaszcz
    s += f'<rect x="30" y="{yj - 20}" width="{xj - 30}" height="40" rx="8" fill="#9b8fb0" stroke="#333" stroke-width="2"/>'
    s += tekst(40, yj - 34, "skrętka – długi odcinek", 22, bold=True)
    s += tekst(40, yj + 52, "do keystone'a w dyni", 20, "#555")
    # żyły → koszulka → przewód wtyczki
    aktywne = [w for w in WIERSZE if w[3]]
    for i, (lit, kan, r, z, y) in enumerate(aktywne):
        ys = yj - 14 + i * 4
        s += zyla(f"M{xj},{ys} C{xj + 90},{ys} {xr - 90},{y} {xr},{y} L{xk},{y}", z)
    for lit, kan, r, z, y in aktywne:
        nazwa, kol = SERWO[r]
        s += przewod(f"M{xw},{y} L{xp},{y}", kol)
        s += koszulka(xk - 10, y)
        s += tekst(xr + 6, y - 12, f"żyła {z} ({ZYLA[z][0]})", 20, bold=True)
        s += tekst(xw + 14, y - 12, nazwa, 18, "#444")
    # obcięte brązowy i czerwony (B, D)
    for lit, kan, r, z, y in WIERSZE:
        if z is None:
            nazwa, kol = SERWO[r]
            s += przewod(f"M{xp - 40},{y} L{xp},{y}", kol)
            s += f'<rect x="{xp - 64}" y="{y - 10}" width="28" height="20" rx="5" fill="{KOSZ}" stroke="#222" stroke-width="2"/>'
            s += tekst(xp - 76, y + 7, f"{nazwa}: obcięty, zaizolowany", 19, "#444", "end")
    # wtyczki i piny
    for gi, (lit, kan, m) in enumerate(grupy):
        ys = [w[4] for w in WIERSZE if w[0] == lit]
        s += f'<rect x="{xp}" y="{ys[0] - 24}" width="64" height="{ys[2] - ys[0] + 48}" rx="5" fill="#202020"/>'
        s += tekst(xp + 32, ys[1] + 12, lit, 34, "#ffffff", "middle", True)
        for y, pin in zip(ys, ("GND", "V+", "sygnał")):
            s += tekst(xp + 76, y + 7, pin, 19, "#333")
        s += tekst(xp + 160, ys[1] - 4, f"wtyczka {lit}", 26, bold=True)
        s += tekst(xp + 160, ys[1] + 26, f"→ kanał {kan}", 22)
        if not m["b"]:
            s += tekst(xp + 160, ys[1] + 54, "tylko sygnał", 22, "#b00020", bold=True)
    # wymiary i opisy
    s += f'<line x1="{xk + 20}" y1="{WIERSZE[0][4] - 12}" x2="{xk - 40}" y2="{WIERSZE[0][4] - 46}" stroke="#555" stroke-width="2"/>'
    s += tekst(xk - 46, WIERSZE[0][4] - 44, "lut w koszulce", 20, "#333", "end")
    s += strzalka_wym(xw - 40, xp, 128, "ok. 5 cm przewodu przy wtyczce")
    yb = WIERSZE[-1][4] + 70
    s += strzalka_wym(xj, xk + 70, yb, "płaszcz zdjęty ok. 80 mm")
    s += tekst(30, H - 40, "n: lewa skrętka 0 · prawa 4 · duże oko 12.  Wtyczki A–D wpinasz w kolejne kanały n…n+3, brązowy przewód od krawędzi płytki (GND).", 21, "#111")
    zapisz("krok07d-lutowanie-wtyczek", W, H, s)

# ---------- krok07e: krótki odcinek – serwa lutowane do żył ----------
def krok07e():
    W, H = 1600, 1080
    s = tekst(30, 52, "5  Krótki odcinek (keystone → oczy): serwa A–D lutowane wprost do żył", 34, bold=True)
    s += tekst(30, 88, "każdy lut w koszulce · serwa A i B dzielą żyły 4 (V+) i 5 (GND), serwa C i D – żyły 7 (V+) i 8 (GND)", 21, "#555")
    xj, xr, xk, xs = 300, 480, 760, 1150   # koniec płaszcza, początek prostej, koszulka, serwo
    # serwa: litera, kanał, przewody od góry
    serwa = [("A", "n", "pcb", 190), ("B", "n+1", "bcp", 400), ("C", "n+2", "pcb", 600), ("D", "n+3", "bcp", 810)]
    yw = {}
    for lit, kan, kol, yt in serwa:
        for i, r in enumerate(kol):
            yw[(lit, r)] = yt + i * 34
    # żyła → wiersz koszulki, cele (serwo, przewód)
    pol = [(1, [("A", "p")]), (4, [("A", "c"), ("B", "c")]), (5, [("A", "b"), ("B", "b")]), (2, [("B", "p")]),
           (3, [("C", "p")]), (7, [("C", "c"), ("D", "c")]), (8, [("C", "b"), ("D", "b")]), (6, [("D", "p")])]
    yk = {1: 190, 4: 285, 5: 375, 2: 468, 3: 600, 7: 695, 8: 785, 6: 878}
    yj = (yk[1] + yk[6]) / 2
    # wtyk RJ45 i płaszcz
    s += f'<rect x="30" y="{yj - 30}" width="110" height="60" rx="6" fill="#e9eef2" stroke="#333" stroke-width="3"/>'
    s += f'<rect x="20" y="{yj - 12}" width="14" height="24" fill="#c9d2da" stroke="#333" stroke-width="2"/>'
    s += f'<rect x="140" y="{yj - 18}" width="{xj - 140}" height="36" rx="8" fill="#9b8fb0" stroke="#333" stroke-width="2"/>'
    s += tekst(30, yj - 46, "wtyk RJ45 (T568B)", 22, bold=True)
    s += tekst(30, yj + 62, "→ do keystone'a w dyni", 20, "#555")
    # przewody serw (najpierw, żeby żyły i koszulki leżały na wierzchu)
    for z, cele in pol:
        for lit, r in cele:
            y1 = yw[(lit, r)]
            s += przewod(f"M{xk + 70},{yk[z]} C{xk + 200},{yk[z]} {xs - 170},{y1} {xs - 40},{y1} L{xs},{y1}", SERWO[r][1])
    for i, (z, cele) in enumerate(pol):
        y = yk[z]
        ys = yj - 14 + i * 4
        s += zyla(f"M{xj},{ys} C{xj + 90},{ys} {xr - 90},{y} {xr},{y} L{xk},{y}", z)
        s += koszulka(xk - 10, y)
        opis = " + ".join(f"{SERWO[r][0]} {lit}" for lit, r in cele)
        s += tekst(xr + 6, y - 12, f"żyła {z} ({ZYLA[z][0]})", 20, bold=True)
        s += tekst(xr + 6, y + 32, "→ " + ("razem: " if len(cele) > 1 else "") + opis, 18, "#444")
    # serwa
    for lit, kan, kol, yt in serwa:
        s += f'<rect x="{xs}" y="{yt - 30}" width="190" height="{2 * 34 + 60}" rx="10" fill="#1f5fd1" stroke="#123" stroke-width="2"/>'
        s += tekst(xs + 95, yt + 30, f"serwo {lit}", 28, "#ffffff", "middle", True)
        s += tekst(xs + 95, yt + 62, f"kanał {kan}", 20, "#ffffff", "middle")
    s += tekst(xs + 210, 224, "opisz serwo", 20, "#555")
    s += tekst(xs + 210, 250, "literą i kanałem", 20, "#555")
    # test przed lutowaniem serw
    yb = 940
    s += f'<rect x="30" y="{yb}" width="{W - 60}" height="110" rx="10" fill="#fff4f4" stroke="#b00020" stroke-width="3"/>'
    s += f'<circle cx="95" cy="{yb + 55}" r="34" fill="#ffffff" stroke="#b00020" stroke-width="4"/>' + tekst(95, yb + 67, "V", 34, "#b00020", "middle", True)
    s += tekst(150, yb + 42, "Przed lutowaniem serw zmierz ok. 5 V między żyłą 4 i 5 oraz między żyłą 7 i 8", 25, "#b00020", bold=True)
    s += tekst(150, yb + 80, "(wolny koniec krótkiego odcinka; długi odcinek wpięty w PCA i keystone, krótki z wtykiem w keystone, zasilanie włączone)", 19, "#333")
    s += tekst(xs - 10, 140, "n: lewa 0 · prawa 4 · duże oko 12", 20, "#333")
    s += tekst(30, 140, "duże oko: A = L–P (12), B = G–D (13), C = powieka górna (14), D = powieka dolna (15)", 20, "#333")
    zapisz("krok07e-serwa-strona-oczu", W, H, s)

if __name__ == "__main__":
    os.makedirs(IMG, exist_ok=True)
    krok07d()
    krok07e()
