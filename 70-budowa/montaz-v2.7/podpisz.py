#!/usr/bin/env python3
"""Podpisy na obrazkach części i galerie (SVG -> PNG przez rsvg-convert, bez zależności Pythona).

Użycie:  python3 -I podpisz.py <katalog_renderów> <katalog_png>

- czesc_*.png + czesc_*.json z renderuj.py --czesci: dokłada podpisy z liniami do punktów (kotwic),
- min_*.png: składa galerie galeria_drukowane.png i galeria_kupne.png.
Podpis "nazwa|objaśnienie|...": pierwsza linia pogrubiona, dalsze zwykłe. Strona "A" = według położenia punktu.
"""
import base64
import glob
import html
import json
import os
import subprocess
import sys

FONT = "Noto Sans, DejaVu Sans, Liberation Sans, sans-serif"
KOLOR_LINII = "#b3261e"

GALERIA_DRUKOWANE = [
    ("min_G", "Gniazdo", "w otworze dyni, Ø67,5 mm"),
    ("min_N", "Nakrętka", "trzyma Gniazdo, Ø74 mm"),
    ("min_K", "Kaseta", "obudowa całego oka, 76 mm"),
    ("min_KH", "Klamra H", "trzyma tył serwa, 19 mm"),
    ("min_J", "Jarzmo", "uchwyt piłeczki, 50 mm"),
    ("min_R", "Ramię", "dźwignia na dźwigienkę, 36 mm"),
    ("min_C", "Cięgno", "łącznik Ramienia z korbą, 25 mm"),
    ("min_TC", "Tulejka korby", "przegub korby, Ø8 mm"),
    ("min_TH", "Tulejka ramienia", "taka sama, Ø8 mm"),
    ("min_PT", "Pokrywa", "krążek, zamyka Kasetę od tyłu"),
    ("min_PW", "Przyrząd do klejenia", "do klejenia piłeczki (v2.4)"),
    ("min_WD", "Widelec", "do wyjmowania Kasety (v2.4)"),
]
GALERIA_KUPNE = [
    ("min_SG", "serwo z dźwigienką", "SG90; dźwigienka = orczyk"),
    ("min_P", "piłeczka", "pingpongowa, 40 mm"),
    ("min_m3x12", "M3×12 imbusowa", "przeguby C i H; 2 szt."),
    ("min_podkladka", "podkładka M3", "Ø7 × 0,5; 2 szt."),
    ("min_nakretka", "nakrętka M3", "samohamująca, klucz 5,5; 2 szt."),
    ("min_m3x8", "M3×8 imbusowa", "Pokrywa; 2 szt."),
    ("min_wkladka", "wkładka M3×4×5", "do wtapiania w ucha; 2 szt."),
    ("min_m3x4", "M3×4 grzybkowa", "oś oka (łeb ≤ 2,75); 2 szt."),
    ("min_m3x10", "M3×10 imbusowa", "przyrząd albo oś oka; 2 szt."),
    ("min_m2x6", "M2×6", "dźwigienka, wałek; 2 szt."),
    ("min_m2x5", "M2×5 albo M2×6", "wkręty do uszu serwa; 2 szt."),
]


def obraz(path):
    with open(path, "rb") as f:
        return "data:image/png;base64," + base64.b64encode(f.read()).decode()


def zapisz(svg, out_png):
    tmp = out_png + ".svg"
    with open(tmp, "w", encoding="utf-8") as f:
        f.write(svg)
    subprocess.run(["rsvg-convert", "-o", out_png, tmp], check=True, timeout=120)
    os.remove(tmp)
    print("ZAPISANO", out_png, flush=True)


def tekst(x, y, linie, anchor, s1, s2):
    out = []
    for i, ln in enumerate(linie):
        size, weight, fill = (s1, 700, "#111") if i == 0 else (s2, 400, "#444")
        out.append(f'<text x="{x:.1f}" y="{y + i * (s1 + 6):.1f}" font-family="{FONT}" font-size="{size}" '
                   f'font-weight="{weight}" fill="{fill}" text-anchor="{anchor}" stroke="#fff" stroke-width="5" '
                   f'paint-order="stroke" stroke-linejoin="round">{html.escape(ln)}</text>')
    return "\n".join(out)


def podpisz_czesc(js_path, out_dir):
    with open(js_path, encoding="utf-8") as f:
        d = json.load(f)
    W, H = d["W"], d["H"]
    k = W / 1800.0
    s1, s2, gap, marg = round(27 * k), round(22 * k), 18 * k, 24 * k
    col = {"L": 0.235 * W, "P": 0.765 * W}
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}">',
             f'<rect width="{W}" height="{H}" fill="#fff"/>',
             f'<image href="{obraz(js_path[:-5] + ".png")}" x="0" y="0" width="{W}" height="{H}"/>']
    linie, napisy = [], []
    for a in d["kotwice"]:
        if a["strona"] == "A":
            a["strona"] = "L" if a["xy"][0] < W / 2 else "P"
    for strona in ("L", "P"):
        items = sorted([a for a in d["kotwice"] if a["strona"] == strona], key=lambda a: a["xy"][1])
        boxes = []
        for a in items:
            n = len(a["tekst"].split("|"))
            h = s1 + (n - 1) * (s1 + 6)
            boxes.append([a["xy"][1] - h / 2, h, a])
        prev = marg
        for b in boxes:
            b[0] = max(b[0], prev)
            prev = b[0] + b[1] + gap
        over = (boxes[-1][0] + boxes[-1][1]) - (H - marg) if boxes else 0
        if over > 0:
            nxt = H - marg
            for b in reversed(boxes):
                b[0] = min(b[0], nxt - b[1])
                nxt = b[0] - gap
        for top, h, a in boxes:
            ln = a["tekst"].split("|")
            x = col[strona]
            y0 = top + s1 * 0.8
            napisy.append(tekst(x, y0, ln, "end" if strona == "L" else "start", s1, s2))
            ax, ay = a["xy"]
            lx = x + (12 if strona == "L" else -12) * k
            ly = top + s1 * 0.45
            dash = '' if a["widoczna"] else ' stroke-dasharray="8 6"'
            linie.append(f'<polyline points="{lx:.1f},{ly:.1f} {ax:.1f},{ay:.1f}" fill="none" stroke="#fff" '
                         f'stroke-width="{6 * k:.1f}" stroke-linecap="round"/>')
            linie.append(f'<polyline points="{lx:.1f},{ly:.1f} {ax:.1f},{ay:.1f}" fill="none" stroke="{KOLOR_LINII}" '
                         f'stroke-width="{2.6 * k:.1f}" stroke-linecap="round"{dash}/>')
            linie.append(f'<circle cx="{ax:.1f}" cy="{ay:.1f}" r="{7 * k:.1f}" fill="{KOLOR_LINII}" stroke="#fff" '
                         f'stroke-width="{2.5 * k:.1f}"/>')
    for p in d["podpisy"]:
        x, y = p["xy"]
        napisy.append(f'<text x="{x:.1f}" y="{min(y + s2, H - 10):.1f}" font-family="{FONT}" font-size="{s2}" '
                      f'font-style="italic" fill="#555" text-anchor="middle">{html.escape(p["tekst"])}</text>')
    parts += linie + napisy + ["</svg>"]
    zapisz("\n".join(parts), os.path.join(out_dir, d["id"] + ".png"))


def galeria(src_dir, lista, out_png, kolumny):
    cell, cap = 300, 78
    rows = (len(lista) + kolumny - 1) // kolumny
    W, H = kolumny * cell, rows * (cell + cap)
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}">',
             f'<rect width="{W}" height="{H}" fill="#fff"/>']
    for i, (mid, nazwa, opis) in enumerate(lista):
        x, y = (i % kolumny) * cell, (i // kolumny) * (cell + cap)
        parts.append(f'<rect x="{x + 6}" y="{y + 6}" width="{cell - 12}" height="{cell + cap - 12}" rx="10" '
                     f'fill="none" stroke="#ddd" stroke-width="2"/>')
        parts.append(f'<image href="{obraz(os.path.join(src_dir, mid + ".png"))}" x="{x + 14}" y="{y + 10}" '
                     f'width="{cell - 28}" height="{cell - 28}"/>')
        parts.append(tekst(x + cell / 2, y + cell + 4, [nazwa, opis], "middle", 24, 18))
    parts.append("</svg>")
    zapisz("\n".join(parts), out_png)


def main():
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    src, out = sys.argv[1], sys.argv[2]
    for js in sorted(glob.glob(os.path.join(src, "czesc_*.json"))):
        podpisz_czesc(js, out)
    if all(os.path.exists(os.path.join(src, m + ".png")) for m, _, _ in GALERIA_DRUKOWANE + GALERIA_KUPNE):
        galeria(src, GALERIA_DRUKOWANE, os.path.join(out, "galeria_drukowane.png"), 4)
        galeria(src, GALERIA_KUPNE, os.path.join(out, "galeria_kupne.png"), 4)


main()
