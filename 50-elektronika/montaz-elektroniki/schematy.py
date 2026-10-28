# Rysunki schematyczne do montaz-elektroniki.md: piny ESP (krok 2) i skrętki (rozdział 5), SVG → PNG przez rsvg-convert.
# Użycie: python3 schematy.py [nazwa ...]   → img/krok02a-esp-piny.png, img/skretka-*.png
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

# ---------- rozdział 5: skrętki (strona serw i strona tacki) ----------
CZERW = "#b00020"

def sciezka(pts, r=18, hops=(), hr=20):
    """Ścieżka ortogonalna przez punkty pts, zaokrąglone narożniki r; hops = punkty na odcinkach,
    w których przewód przeskakuje mostkiem (łuk hr) nad innym przewodem."""
    def sg(v): return (v > 0) - (v < 0)
    d = f"M{pts[0][0]},{pts[0][1]}"
    for i in range(1, len(pts)):
        (ax, ay), (bx, by) = pts[i - 1], pts[i]
        ux, uy = sg(bx - ax), sg(by - ay)
        na = [h for h in hops if (ux == 0 and h[0] == ax and min(ay, by) < h[1] < max(ay, by)) or
              (uy == 0 and h[1] == ay and min(ax, bx) < h[0] < max(ax, bx))]
        na.sort(key=lambda h: (h[0] - ax) * ux + (h[1] - ay) * uy)
        for hx, hy in na:
            d += f" L{hx - ux * hr},{hy - uy * hr} A{hr},{hr} 0 0 1 {hx + ux * hr},{hy + uy * hr}"
        if i < len(pts) - 1:
            cx, cy = pts[i + 1]
            vx, vy = sg(cx - bx), sg(cy - by)
            d += f" L{bx - ux * r},{by - uy * r} Q{bx},{by} {bx + vx * r},{by + vy * r}"
        else:
            d += f" L{bx},{by}"
    return d

def znaczek(x, y, z, r=24):
    """Kółko z numerem żyły w jej kolorach (biało-X: obwódka w paski)."""
    _, k, p = ZYLA[z]
    s = f'<circle cx="{x}" cy="{y}" r="{r}" fill="#ffffff" stroke="#333" stroke-width="{12}"/>'
    s += f'<circle cx="{x}" cy="{y}" r="{r}" fill="#ffffff" stroke="{k}" stroke-width="8"/>'
    if p:
        s += f'<circle cx="{x}" cy="{y}" r="{r}" fill="none" stroke="{p}" stroke-width="8" stroke-dasharray="9 7"/>'
    return s + tekst(x, y + 9, str(z), 26, "#111", "middle", True)

def tuleja(x, y, w=90, h=30):
    """Koszulka termokurczliwa (półprzezroczysta) na lucie."""
    return (f'<rect x="{x - w / 2}" y="{y - h / 2}" width="{w}" height="{h}" rx="9" fill="#555" fill-opacity="0.55" '
            f'stroke="#222" stroke-width="2.5"/>')

def kropla(x, y):
    return f'<circle cx="{x}" cy="{y}" r="9" fill="#c8c8c8" stroke="#222" stroke-width="2.5"/>'

def nozyczki(x, y):
    """Symbol obcięcia: czerwony krzyżyk z nożyczkami."""
    s = f'<g stroke="{CZERW}" stroke-width="5" fill="none" stroke-linecap="round">'
    s += f'<circle cx="{x - 30}" cy="{y - 14}" r="10"/><circle cx="{x - 30}" cy="{y + 14}" r="10"/>'
    s += f'<line x1="{x - 21}" y1="{y - 9}" x2="{x + 12}" y2="{y + 12}"/><line x1="{x - 21}" y1="{y + 9}" x2="{x + 12}" y2="{y - 12}"/></g>'
    return s

def zaslepka(x, y, kol, kier=1):
    """Koniec obciętego przewodu: zamknięta koszulka (kier = 1 – przewód wchodzi z lewej)."""
    x0 = x if kier == 1 else x - 44
    return (f'<rect x="{x0}" y="{y - 15}" width="44" height="30" rx="13" fill="#555" fill-opacity="0.85" stroke="#222" stroke-width="2.5"/>')

def serwo_sg90(x, yc, lit, kanal):
    """SG90 z boku: kabel wchodzi z lewej (3 przewody co 30 px wokół yc), orczyk po prawej."""
    s = f'<rect x="{x - 26}" y="{yc - 46}" width="30" height="92" rx="6" fill="#1a1a1a"/>'          # wyjście kabla
    s += f'<rect x="{x}" y="{yc - 62}" width="230" height="124" rx="10" fill="#2a62d6" stroke="#0d2a6b" stroke-width="3"/>'
    s += f'<rect x="{x + 150}" y="{yc - 75}" width="26" height="150" rx="5" fill="#2a62d6" stroke="#0d2a6b" stroke-width="3"/>'   # uszy
    s += f'<rect x="{x + 230}" y="{yc - 30}" width="22" height="60" rx="6" fill="#5d8be6" stroke="#0d2a6b" stroke-width="3"/>'     # wieżyczka
    s += f'<rect x="{x + 252}" y="{yc - 75}" width="20" height="150" rx="10" fill="#ffffff" stroke="#333" stroke-width="3"/>'    # orczyk
    for k in (-50, -25, 25, 50):
        s += f'<circle cx="{x + 262}" cy="{yc + k}" r="3.5" fill="#333"/>'
    s += f'<circle cx="{x + 262}" cy="{yc}" r="8" fill="#ddd" stroke="#333" stroke-width="2"/>'
    s += tekst(x + 62, yc + 24, lit, 72, "#ffffff", "middle", True)
    s += tekst(x + 104, yc - 4, "kanał", 24, "#ffffff", "start", True)
    s += tekst(x + 104, yc + 28, str(kanal), 32, "#ffffff", "start", True)
    return s

def wtyk_rj45(x, y):
    """Wtyk RJ45 od strony styków: styki u góry, kabel w dół, styk 1 po lewej. Zwraca (svg, x środka kabla, y końca kabla)."""
    w, h = 320, 300
    cx = x + w / 2
    s = ""
    s += f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="14" fill="#e3edf4" fill-opacity="0.75" stroke="#333" stroke-width="4"/>'
    xs = [x + 48 + i * 32 for i in range(8)]
    ycab = y + h + 4
    for i, xc in enumerate(xs):
        z = i + 1
        xe = cx - 35 + i * 10
        s += zyla(f"M{xc},{y + 70} L{xc},{y + 170} C{xc},{y + 230} {xe},{y + 230} {xe},{ycab}", z, 11)
    for i, xc in enumerate(xs):
        s += f'<rect x="{xc - 9}" y="{y + 14}" width="18" height="64" rx="3" fill="#e2b42a" stroke="#7a5a00" stroke-width="2.5"/>'
        s += tekst(xc, y - 14, str(i + 1), 28, "#111", "middle", True)
    return s, cx, ycab

def legenda_serwa(x, y):
    s = tekst(x, y, "przewód serwa:", 24, "#111", "start", True)
    for i, (r, opis) in enumerate((("b", "brązowy = GND (masa)"), ("c", "czerwony = V+ (5 V)"), ("p", "pomarańczowy = sygnał"))):
        yy = y + 40 + i * 38
        s += przewod(f"M{x + 10},{yy - 8} L{x + 80},{yy - 8}", SERWO[r][1])
        s += tekst(x + 100, yy, opis, 24)
    yy = y + 40 + 3 * 38
    s += przewod(f"M{x + 0},{yy - 8} L{x + 90},{yy - 8}", ZYLA[4][1]) + tuleja(x + 45, yy - 8, 60, 30) + kropla(x + 45, yy - 8)
    s += tekst(x + 100, yy, "lut w koszulce termokurczliwej (każdy)", 24)
    return s

def skretka_strona_serw(ile, prawa=False):
    """ile = 4 (lewa: kanały 0–3; duże oko 12–15) albo 3 (prawa: kanały 4–6, żyła 6 obcięta)."""
    W, H = 1900, 1830
    kan0 = 4 if prawa or ile == 3 else 0
    if ile == 4 and prawa:
        s = tekst(30, 54, "Prawa skrętka – strona serw: wtyk RJ45 → 8 żył → 4 serwa (kanały 4–7)", 36, bold=True)
    elif ile == 4:
        s = tekst(30, 54, "Lewa skrętka – strona serw: wtyk RJ45 → 8 żył → 4 serwa (kanały 0–3)", 36, bold=True)
    else:
        s = tekst(30, 54, "Prawa skrętka – strona serw: wtyk RJ45 → żyły → 3 serwa (kanały 4–6)", 36, bold=True)
    s += tekst(30, 94, "krótki odcinek z wtykiem do keystone'a w dyni · kolory T568B · każdą żyłę prowadź palcem od wtyku do serwa", 22, "#444")
    # --- wtyk i instrukcja trzymania
    sw, cx, ycab = wtyk_rj45(70, 200)
    yj = 640                                             # koniec płaszcza
    s += f'<rect x="{cx - 48}" y="{ycab - 10}" width="96" height="{yj - ycab + 10}" rx="10" fill="#9b8fb0" stroke="#333" stroke-width="3"/>'
    s += sw
    s += tekst(440, 220, "WTYK RJ45 – patrzysz na złote styki", 28, "#111", "start", True)
    s += tekst(440, 262, "• styki do Ciebie, zatrzask z tyłu (od Ciebie)", 24)
    s += tekst(440, 298, "• kabel w dół", 24)
    s += tekst(440, 334, "• wtedy styk 1 jest po LEWEJ", 24, "#111", "start", True)
    s += tekst(440, 386, "kolejność T568B od lewej:", 22, "#555")
    for i in range(8):
        s += znaczek(460 + i * 58, 424, i + 1, 22)
    s += tekst(440, 500, "Po wyjściu z płaszcza żyły ułożone", 22, "#555")
    s += tekst(440, 528, "tak, żeby się nie krzyżowały – licz kolor.", 22, "#555")
    s += legenda_serwa(1140, 210)
    # --- geometria
    xs = 1520                                            # lewa krawędź serwa
    off = 480
    gr = []                                              # (lit, kanał, yc serwa, odwrócone?)
    for g in range(2):
        b = g * off
        gr.append(("AC"[g], 740 + b, False))             # od góry: pomarańczowy, czerwony, brązowy
        gr.append(("BD"[g], 1060 + b, True))             # od góry: brązowy, czerwony, pomarańczowy
    def yw(yc, odw, r):
        k = {"p": -30, "c": 0, "b": 30}[r]
        return yc - k if odw else yc + k
    yr = {1: 710, 4: 840, 5: 940, 2: 1090, 3: 1190, 7: 1320, 8: 1420, 6: 1570}
    tory = [6, 8, 7, 3, 2, 5, 4, 1]                      # od lewej; najbardziej w lewo skręca najniżej
    xt = {z: 150 + i * 26 for i, z in enumerate(tory)}
    xe = {z: cx - 35 + i * 10 for i, z in enumerate(tory)}
    XL1, XL2, XLP = 1000, 1200, 860                      # lut pierwszej / drugiej pary zasilania, lut sygnału
    serwa = [("A", 740), ("B", 1060), ("C", 1220), ("D", 1540)]
    if ile == 3:
        serwa = serwa[:3]
    nr = {lit: kan0 + i for i, (lit, _) in enumerate(serwa)}
    ycs = dict(serwa)
    odw = {"A": False, "B": True, "C": False, "D": True}
    # przewody serw: (żyła, serwo, kolor, punkty, mostki)
    dz = []
    def pojedynczy(z, lit, r, xl):
        y0 = yr[z]; y1 = yw(ycs[lit], odw[lit], r)
        if y0 == y1:
            pts = [(xl, y0), (xs - 26, y0)]
        else:
            xf = xl + 70
            pts = [(xl, y0), (xf, y0), (xf, y1), (xs - 26, y1)]
        dz.append((z, lit, r, pts, ()))
    for (z1, z4, z5, z2, lA, lB, rozdz) in ((1, 4, 5, 2, "A", "B", True), (3, 7, 8, 6, "C", "D", ile == 4)):
        pojedynczy(z1, lA, "p", XLP)
        if rozdz:
            pojedynczy(z2, lB, "p", XLP)
            for z, xl, r in ((z4, XL1, "c"), (z5, XL2, "b")):
                y0 = yr[z]; xf = xl + 70
                yA = yw(ycs[lA], odw[lA], r); yB = yw(ycs[lB], odw[lB], r)
                dz.append((z, lA, r, [(xl, y0 - 9), (xf, y0 - 9), (xf, yA), (xs - 26, yA)], ()))
                hop = ((xf, yr[z5]),) if r == "c" else ()
                dz.append((z, lB, r, [(xl, y0 + 9), (xf, y0 + 9), (xf, yB), (xs - 26, yB)], hop))
        else:
            pojedynczy(z4, lA, "c", XL1)
            pojedynczy(z5, lA, "b", XL2)
    lut_x = {}
    for z, lit, r, pts, hop in dz:
        lut_x[z] = pts[0][0]
    obciete = [] if ile == 4 else [6]
    # żyły skrętki (od końca płaszcza do lutu)
    for z in tory:
        y = yr[z]
        xk = (lut_x[z] if z not in obciete else 700)
        d = (f"M{xe[z]},{yj - 20} C{xe[z]},{yj + 15} {xt[z]},{yj + 10} {xt[z]},{yj + 45} " +
             sciezka([(xt[z], yj + 45), (xt[z], y), (xk, y)], 30)[len(f"M{xt[z]},{yj + 45}"):])
        s += zyla(d, z, 12)
    # koniec płaszcza na wierzchu żył
    s += f'<rect x="{cx - 48}" y="{yj - 60}" width="96" height="44" rx="8" fill="#9b8fb0" stroke="#333" stroke-width="3"/>'
    s += tekst(cx + 60, yj - 30, "koniec płaszcza", 22, "#555")
    # przewody serw – z mostkiem przewód leżący wyżej rysowany później
    for z, lit, r, pts, hop in sorted(dz, key=lambda t: len(t[4])):
        s += przewod(sciezka(list(pts), 16, hop), SERWO[r][1], None, 12)
    # luty, koszulki, opisy
    for z in tory:
        y = yr[z]
        cele = [(lit, r) for zz, lit, r, _, _ in dz if zz == z]
        if z in obciete:
            s += zaslepka(700, y, None) + nozyczki(800, y)
            s += tekst(860, y + 9, f"żyła {z}: obciąć, zaizolować (nieużywana)", 26, CZERW, "start", True)
        else:
            xl = lut_x[z]
            podw = len(cele) == 2
            s += tuleja(xl, y, 96, 44 if podw else 30) + kropla(xl, y)
            if podw:
                s += f'<circle cx="{xl}" cy="{y}" r="56" fill="none" stroke="{CZERW}" stroke-width="4"/>'
                if xl == XL1:
                    opis = f"1 lut: żyła {z} + {SERWO[cele[0][1]][0]} {cele[0][0]} + {SERWO[cele[1][1]][0]} {cele[1][0]}"
                    s += tekst(xl - 70, y - 22, opis, 24, CZERW, "end", True)
                else:                                    # lut drugiej żyły: opis w 3 liniach na prawo od lutu
                    for k, t_ in enumerate((f"1 lut: żyła {z}", f"+ {SERWO[cele[0][1]][0]} {cele[0][0]}", f"+ {SERWO[cele[1][1]][0]} {cele[1][0]}")):
                        s += tekst(xl + 94, y - 125 + k * 30, t_, 24, CZERW, "start", True)
            else:
                lit, r = cele[0]
                s += tekst(470, y - 20, f"żyła {z} → {SERWO[r][0]} {lit}", 24, "#111", "start", True)
        s += znaczek(410, y, z)
    # serwa
    for lit, yc in serwa:
        s += serwo_sg90(xs, yc, lit, nr[lit])
    # stopka
    yb = H - 150
    s += f'<rect x="30" y="{yb}" width="{W - 60}" height="120" rx="10" fill="#fff4f4" stroke="{CZERW}" stroke-width="3"/>'
    s += f'<circle cx="95" cy="{yb + 60}" r="34" fill="#ffffff" stroke="{CZERW}" stroke-width="4"/>' + tekst(95, yb + 72, "V", 34, CZERW, "middle", True)
    s += tekst(150, yb + 46, "Przed lutowaniem serw: ok. 5 V między żyłą 4 i 5 oraz między żyłą 7 i 8", 28, CZERW, "start", True)
    if ile == 4 and prawa:
        s += tekst(150, yb + 90, "Prawa skrętka: A, B, C = 3 oczy po prawej (kanały 4–6), D = ósme oko na środku frontu (kanał 7).", 23, "#222")
    elif ile == 4:
        s += tekst(150, yb + 90, "Duże oko: ten sam rysunek, kanały 12–15: A = lewo–prawo, B = góra–dół, C = powieka górna, D = powieka dolna.", 23, "#222")
    else:
        s += tekst(150, yb + 90, "Prawa skrętka: serwo C samo na żyłach 7 i 8 (zwykłe luty); kanał 7 wolny.", 23, "#222")
    zapisz("skretka-prawa-strona-serw" if prawa else "skretka-4-serwa-strona-serw" if ile == 4 else "skretka-3-serwa-strona-serw", W, H, s)

def skretka4():
    skretka_strona_serw(4)

def skretka_prawa():
    skretka_strona_serw(4, prawa=True)

def skretka3():
    skretka_strona_serw(3)

def skretka_tacka():
    """Strona tacki (długi odcinek przy PCA): żyły → 4 wtyczki odcięte od serw, wersja lewa (kanały 0–3)."""
    W, H = 1900, 2080
    s = tekst(30, 54, "Strona tacki (przy PCA): 8 żył → 4 wtyczki odcięte od serw (lewa skrętka: kanały 0–3)", 34, bold=True)
    s += tekst(30, 94, "długi odcinek · kolory T568B · przy wtyczce ok. 5 cm przewodu · każdy lut w koszulce", 22, "#444")
    s += legenda_serwa(30, 140)
    grupy = [("A", {"b": 5, "c": 4, "p": 1}), ("B", {"b": None, "c": None, "p": 2}),
             ("C", {"b": 8, "c": 7, "p": 3}), ("D", {"b": None, "c": None, "p": 6})]
    dy, pitch, y0 = 58, 280, 370
    W_ = []                                              # (lit, r, żyła, y)
    for gi, (lit, m) in enumerate(grupy):
        for ri, r in enumerate("bcp"):
            W_.append((lit, r, m[r], y0 + gi * pitch + ri * dy))
    akt = [w for w in W_ if w[2]]
    yj = (akt[0][3] + akt[-1][3]) / 2
    xj, xf, XL, XP = 250, 520, 1000, 1330               # koniec płaszcza, koniec rozejścia, lut, wtyczka
    s += f'<rect x="30" y="{yj - 26}" width="{xj - 30}" height="52" rx="10" fill="#9b8fb0" stroke="#333" stroke-width="3"/>'
    s += tekst(40, yj - 40, "skrętka", 24, "#111", "start", True)
    s += tekst(40, yj + 62, "do keystone'a", 22, "#555")
    s += tekst(40, yj + 90, "w dyni", 22, "#555")
    for i, (lit, r, z, y) in enumerate(akt):
        ys = yj - 21 + i * 6
        s += zyla(f"M{xj - 10},{ys} C{xj + 150},{ys} {xf - 150},{y} {xf},{y} L{XL},{y}", z, 12)
    s += f'<rect x="{xj - 30}" y="{yj - 26}" width="30" height="52" rx="6" fill="#9b8fb0" stroke="#333" stroke-width="3"/>'
    for lit, r, z, y in akt:
        s += przewod(f"M{XL},{y} L{XP},{y}", SERWO[r][1], None, 12)
        s += tuleja(XL, y) + kropla(XL, y)
        s += znaczek(570, y, z)
        s += tekst(610, y - 18, f"żyła {z} → {SERWO[r][0]}", 24, "#111", "start", True)
    for lit, r, z, y in W_:
        if z is None:
            s += przewod(f"M{XP - 120},{y} L{XP},{y}", SERWO[r][1], None, 12)
            s += zaslepka(XP - 120, y, None, -1)
    for gi, (lit, m) in enumerate(grupy):
        ys = [w[3] for w in W_ if w[0] == lit]
        s += f'<rect x="{XP}" y="{ys[0] - 32}" width="80" height="{ys[2] - ys[0] + 64}" rx="6" fill="#1c1c1c"/>'
        s += tekst(XP + 40, ys[1] + 16, lit, 44, "#ffffff", "middle", True)
        for y, pin in zip(ys, ("GND", "V+", "sygnał")):
            s += tekst(XP + 94, y + 8, pin, 22, "#333")
        s += tekst(XP + 210, ys[1] - 6, f"wtyczka {lit}", 30, "#111", "start", True)
        s += tekst(XP + 210, ys[1] + 30, f"→ kanał {gi}", 26)
        if m["b"] is None:
            s += nozyczki(XP - 210, (ys[0] + ys[1]) / 2)
            s += tekst(XP - 260, (ys[0] + ys[1]) / 2 - 2, "brązowy i czerwony:", 23, CZERW, "end", True)
            s += tekst(XP - 260, (ys[0] + ys[1]) / 2 + 26, "obciąć, zaizolować", 23, CZERW, "end", True)
    s += strzalka_wym(XL + 60, XP, y0 + 2 * dy + 70, "ok. 5 cm przewodu przy wtyczce")
    # --- widok na PCA
    yt = 1420
    s += tekst(30, yt, "Wpięcie w PCA9685 – widok z góry: brązowy przewód (GND) od krawędzi płytki", 30, "#111", "start", True)
    bx0, bx1, by0, by1 = 330, 1560, yt + 30, yt + 350
    s += f'<rect x="{bx0}" y="{by0}" width="{bx1 - bx0}" height="{by1 - by0}" rx="10" fill="#1d3fb8" stroke="#0d1f66" stroke-width="4"/>'
    s += f'<line x1="{bx0}" y1="{by1}" x2="{bx1}" y2="{by1}" stroke="#000" stroke-width="8"/>'
    ry = {"p": by0 + 95, "c": by0 + 170, "b": by0 + 245}
    for r, t in (("p", "sygnał"), ("c", "V+"), ("b", "GND")):
        s += tekst(bx0 - 16, ry[r] + 8, t, 26, "#111", "end", True)
    for k in range(8):
        x = 450 + k * 145
        akt_k = k < 4
        for r in "pcb":
            s += f'<rect x="{x - 13}" y="{ry[r] - 13}" width="26" height="26" fill="#e2b42a" stroke="#6b5310" stroke-width="2" opacity="{1 if akt_k else 0.5}"/>'
        s += tekst(x, by0 + 34, str(k), 26, "#ffffff" if akt_k else "#9fb0e6", "middle", True)
        if akt_k:
            lit, m = grupy[k]
            s += f'<rect x="{x - 40}" y="{ry["p"] - 38}" width="80" height="{ry["b"] - ry["p"] + 76}" rx="6" fill="#1c1c1c" stroke="#fff" stroke-width="2"/>'
            for r in "pcb":
                if m[r] is not None:
                    s += f'<circle cx="{x}" cy="{ry[r]}" r="17" fill="{SERWO[r][1]}" stroke="#fff" stroke-width="3"/>'
                else:
                    s += f'<circle cx="{x}" cy="{ry[r]}" r="9" fill="#555" stroke="#999" stroke-width="2"/>'
            s += tekst(x + 46, ry["c"] + 14, lit, 40, "#ffffff", "start", True)
    s += tekst(bx0 + 10, by0 + 34, "kanał:", 22, "#ffffff", "start")
    s += tekst(450 + 5.5 * 145, by0 + 310, "kanały 4–7: prawa skrętka (4 wtyczki)", 22, "#c9d4f5", "middle")
    s += f'<path d="M{bx1 + 40},{ry["b"]} L{bx1 + 40},{by1 - 6}" stroke="{CZERW}" stroke-width="5"/>'
    s += f'<path d="M{bx1 + 28},{by1 - 26} L{bx1 + 40},{by1 - 4} L{bx1 + 52},{by1 - 26} z" fill="{CZERW}"/>'
    s += tekst(bx1 + 20, by1 + 40, "krawędź płytki", 24, CZERW, "end", True)
    # stopka
    yb = H - 180
    s += f'<rect x="30" y="{yb}" width="{W - 60}" height="150" rx="10" fill="#f4f7ff" stroke="#1d3fb8" stroke-width="3"/>'
    s += tekst(60, yb + 44, "Lewa skrętka: A → kanał 0, B → 1, C → 2, D → 3 (jak na rysunku).", 26, "#111", "start", True)
    s += tekst(60, yb + 84, "Prawa skrętka: A → 4, B → 5, C → 6, D → 7 (D = ósme oko na środku frontu) – też 4 wtyczki.", 24, "#111")
    s += tekst(60, yb + 122, "Duże oko: A → 12, B → 13, C → 14, D → 15 (wszystkie 4 wtyczki).", 24, "#111")
    zapisz("skretka-strona-tacki", W, H, s)

if __name__ == "__main__":
    os.makedirs(IMG, exist_ok=True)
    RYS = {"krok02a-esp-piny": krok02a, "skretka-4-serwa-strona-serw": skretka4,
           "skretka-prawa-strona-serw": skretka_prawa, "skretka-strona-tacki": skretka_tacka}
    for n in sys.argv[1:] or RYS:
        RYS[n]()
