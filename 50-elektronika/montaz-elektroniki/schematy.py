# Rysunki schematyczne do montaz-elektroniki.md: piny ESP (krok 2) i skrętki (rozdział 5), SVG → PNG przez rsvg-convert.
# Użycie: python3 schematy.py [nazwa ...]   → img/krok02a-esp-piny.png, img/krok07d-lutowanie-wtyczek.png, img/krok07e-serwa-strona-oczu.png
# Wymaga: rsvg-convert (librsvg), czcionka Liberation Sans albo DejaVu Sans.
import os, subprocess, sys

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

# ---------- krok02a: piny ESP32-C3 SuperMini, widok z góry, USB do patrzącego ----------
# Zgodnie z tabelą pinów w montaz-elektroniki.md, krok 2 (rząd lewy od ściany tacki: 5V, G, 3V3, 4, 3, 2, 1, 0;
# rząd prawy od PCA: 5, 6, 7, 8, 9, 10, 20, 21; pozycje od USB).
def krok02a():
    W, H = 1600, 960
    CZ, CA, NB, ZO, PO, ZP, SZ = "#d81e1e", "#141414", "#1e78d8", "#b08600", "#e07800", "#1f9a8a", "#9a9a9a"
    LEWY = [("5V", "→ kanał 9 V+ (PCA)", CZ), ("G", "→ kanał 9 GND (PCA)", CA), ("3V3", "→ lewa listwa PCA: VCC", NB),
            ("4", "zapas – koniec zaizolowany", ZP), ("3", "zapas – koniec zaizolowany", ZP),
            ("2", "wolny", None), ("1", "wolny", None), ("0", "wolny", None)]
    PRAWY = [("5", "→ przycisk: masa", PO), ("6", "pusty (środek wtyczki)", None), ("7", "→ przycisk: odczyt", PO),
             ("8", "→ lewa listwa PCA: SDA", NB), ("9", "→ lewa listwa PCA: SCL", NB), ("10", "→ PIR OUT", ZO),
             ("20", "wolny", None), ("21", "wolny", None)]
    mm = 20                                     # skala płytki [px/mm]
    cx, yb = 800, 740                           # oś płytki, krawędź płytki od strony USB
    bw, bl = 18.4 * mm, 22.5 * mm
    xl, xp = cx - 7.6 * mm, cx + 7.6 * mm       # rzędy pinów
    def yk(k): return yb - (1.8 + 2.54 * k) * mm
    s = tekst(30, 52, "4.2  Piny ESP – widok z góry: układ scalony do góry, USB do Ciebie", 34, bold=True)
    s += tekst(30, 88, "pozycja liczona od USB (1 = najbliżej USB) · czarny kwadrat = wtyk Dupont nałożony na pin od spodu · napisy na płytce mają pierwszeństwo", 20, "#555")
    # nagłówki kolumn i strony tacki
    s += tekst(xl - 60, 170, "LEWY rząd (od ściany tacki)", 30, "#111", "end", True)
    s += tekst(xp + 60, 170, "PRAWY rząd (od PCA)", 30, "#111", "start", True)
    s += tekst(30, 215, "← lewa ściana tacki", 24, "#555")
    s += tekst(W - 30, 215, "PCA9685 →", 24, "#555", "end")
    # płytka
    s += f'<rect x="{cx - bw / 2}" y="{yb - bl}" width="{bw}" height="{bl}" rx="14" fill="#1d3fb8" stroke="#0d1f66" stroke-width="4"/>'
    s += f'<rect x="{cx - 2.5 * mm}" y="{yb - bl + 1.2 * mm}" width="{5 * mm}" height="{2.6 * mm}" rx="4" fill="#d9d9d9" stroke="#333" stroke-width="2"/>'
    s += tekst(cx, yb - bl + 1.2 * mm + 34, "antena", 20, "#111", "middle")
    s += f'<rect x="{cx - 2.6 * mm}" y="{yk(4.2)}" width="{5.2 * mm}" height="{5.2 * mm}" rx="6" fill="#151515" stroke="#555" stroke-width="2"/>'
    s += tekst(cx, yk(4.2) + 2.6 * mm - 6, "układ", 20, "#fff", "middle", True)
    s += tekst(cx, yk(4.2) + 2.6 * mm + 18, "scalony", 20, "#fff", "middle", True)
    # gniazdo USB-C ESP (wystaje przed płytkę)
    s += f'<rect x="{cx - 4.5 * mm}" y="{yb - 6 * mm}" width="{9 * mm}" height="{7.5 * mm}" rx="16" fill="#c0c4c9" stroke="#333" stroke-width="3"/>'
    s += tekst(cx, yb - 2.2 * mm, "USB-C", 24, "#111", "middle", True)
    # wtyczka przycisku 3-pin na prawych pozycjach 1–3 (obudowa pod płytką)
    s += f'<rect x="{xp - 22}" y="{yk(2) - 30}" width="44" height="{yk(0) - yk(2) + 60}" rx="6" fill="#202020" stroke="{PO}" stroke-width="4"/>'
    # piny, wtyki, nazwy na płytce, etykiety
    for strona, rzad, x in (("L", LEWY, xl), ("P", PRAWY, xp)):
        for k, (nazwa, dokad, kol) in enumerate(rzad):
            y = yk(k)
            wtyk = kol is not None
            if wtyk and not (strona == "P" and k <= 2):
                s += f'<rect x="{x - 19}" y="{y - 19}" width="38" height="38" rx="4" fill="#151515"/>'
            s += f'<circle cx="{x}" cy="{y}" r="11" fill="#e8c35a" stroke="#6b5310" stroke-width="3"/>'
            s += f'<circle cx="{x}" cy="{y}" r="4" fill="#6b5310"/>'
            # nazwa pinu na płytce (jak nadruk)
            s += tekst(x + (26 if strona == "L" else -26), y + 7, nazwa, 20, "#ffffff", "start" if strona == "L" else "end", True)
            # numer pozycji od USB
            xn = x - 70 if strona == "L" else x + 70
            # etykieta: [nazwa] dokąd
            kol_r = kol or SZ
            txt = dokad
            szer_n = 22 + 15 * len(nazwa)
            szer_t = 13.2 * len(txt) + 20
            xb0 = xn - 30 - szer_n - szer_t if strona == "L" else xn + 30
            s += f'<line x1="{x}" y1="{y}" x2="{xn + (-17 if strona == "L" else 17)}" y2="{y}" stroke="{kol_r}" stroke-width="3"/>'
            s += f'<line x1="{xn + (-17 if strona == "L" else 17)}" y1="{y}" x2="{xb0 + (szer_n + szer_t if strona == "L" else 0)}" y2="{y}" stroke="{kol_r}" stroke-width="3"/>'
            s += f'<circle cx="{xn}" cy="{y}" r="17" fill="#ffffff" stroke="#777" stroke-width="2"/>' + tekst(xn, y + 7, str(k + 1), 20, "#555", "middle", True)
            s += f'<rect x="{xb0}" y="{y - 20}" width="{szer_n + szer_t}" height="40" rx="7" fill="#ffffff" stroke="{kol_r}" stroke-width="3"/>'
            s += f'<rect x="{xb0}" y="{y - 20}" width="{szer_n}" height="40" rx="7" fill="{kol_r}"/>'
            s += tekst(xb0 + szer_n / 2, y + 9, nazwa, 26, "#ffffff", "middle", True)
            s += tekst(xb0 + szer_n + 10, y + 8, txt, 22, "#111" if kol else "#888", "start", bool(kol))
    for xn in (xl - 70, xp + 70):
        s += tekst(xn, yk(7) - 34, "poz.", 18, "#777", "middle", True)
    # klamra: wtyczka przycisku
    xk = 1460
    s += f'<path d="M{xk},{yk(0) + 20} l14,0 l0,{-(yk(0) - yk(2)) - 40} l-14,0" fill="none" stroke="{PO}" stroke-width="4"/>'
    s += tekst(xk + 22, yk(1) - 4, "jedna", 22, PO, "start", True)
    s += tekst(xk + 22, yk(1) + 20, "wtyczka", 22, PO, "start", True)
    s += tekst(xk + 22, yk(1) + 44, "przycisku", 22, PO, "start", True)
    # USB do patrzącego
    ya = yb + 2 * mm
    s += f'<line x1="{cx}" y1="{ya}" x2="{cx}" y2="{ya + 90}" stroke="#b00020" stroke-width="6"/>'
    s += f'<path d="M{cx - 20},{ya + 80} L{cx},{ya + 115} L{cx + 20},{ya + 80} z" fill="#b00020"/>'
    s += tekst(cx + 40, ya + 70, "USB – do Ciebie / do przodu tacki", 28, "#b00020", "start", True)
    s += tekst(30, H - 30, "Wolne piny: 2, 1, 0 (lewy rząd) oraz 20, 21 (prawy rząd) – bez wtyków.", 22, "#333")
    zapisz("krok02a-esp-piny", W, H, s)

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
    RYS = {"krok02a-esp-piny": krok02a, "krok07d-lutowanie-wtyczek": krok07d, "krok07e-serwa-strona-oczu": krok07e}
    for n in sys.argv[1:] or RYS:
        RYS[n]()
