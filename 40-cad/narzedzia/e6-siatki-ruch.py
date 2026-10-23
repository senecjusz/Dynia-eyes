#!/usr/bin/env python3
"""e6-siatki-ruch.py – kontrola kolizji na siatkach z CAD dużego oka (E6) z kinematyką ruchu.

Wejście: plik JSON z opisem części (STL z Onshape), ich ruchów, zakresów i par
(wzór: e6-siatki-ruch.json). Wyjście: <wynik>.json i <wynik>.txt.

Metoda (szczegóły w e6-siatki-ruch.md):
- odległość siatka–siatka liczona dokładnie: wierzchołki A do trójkątów B,
  wierzchołki B do trójkątów A oraz krawędź–krawędź (krawędzie pocięte na odcinki
  ≤ 0,5 mm tylko po to, żeby indeks przestrzenny był zwarty; odległość odcinków
  jest dokładna). Minimum tych trzech rodzin = odległość dwóch trójkątnych
  powierzchni, jeśli się nie przecinają;
- przenikanie: test przecięcia odcinek–trójkąt (krawędzie A przez ściany B i
  odwrotnie), test parzystości promienia dla całkowitego zawierania, głębokość
  przez znak względem pseudonormalnych (Bærentzen–Aanæs);
- stany: dla każdej pary tylko zmienne, od których para zależy (rzut pełnego
  iloczynu ψ × θ × G × D – dokładnie równoważny), siatka co krok_deg z kotwicą
  w położeniu modelu, deduplikacja po względnej pozie A→B, zagęszczenie wokół
  minimów (przeszukiwanie wzorcem do kroku ≤ zageszczenie_mm na R_ref).

Tylko Python 3 + numpy. Uruchomienie:
  python3 e6-siatki-ruch.py e6-siatki-ruch.json --wynik e6-siatki-ruch-wynik-etap1
  python3 e6-siatki-ruch.py --test          # testy jednostkowe jąder i kostek
"""
import os
os.environ.setdefault("OMP_NUM_THREADS", "1")
os.environ.setdefault("OPENBLAS_NUM_THREADS", "1")
os.environ.setdefault("MKL_NUM_THREADS", "1")

import argparse
import itertools
import json
import math
import multiprocessing as mp
import struct
import sys
import time

import numpy as np

KOLEJNOSC_ZMIENNYCH = ["psi", "theta", "G", "D"]
RODZAJ = {0: "wierzchołek A – ściana B", 1: "ściana A – wierzchołek B", 2: "krawędź – krawędź"}


# ---------------------------------------------------------------- STL i siatka
def wczytaj_stl(sciezka):
    with open(sciezka, "rb") as f:
        dane = f.read()
    if len(dane) >= 84:
        n = struct.unpack("<I", dane[80:84])[0]
        if 84 + 50 * n == len(dane):
            dt = np.dtype([("n", "<f4", (3,)), ("v", "<f4", (9,)), ("a", "<u2")])
            rek = np.frombuffer(dane, dtype=dt, count=n, offset=84)
            return rek["v"].reshape(-1, 3, 3).astype(np.float64), "binarny"
    tekst = dane.decode("ascii", errors="replace")
    wiersze = [l.split()[1:4] for l in tekst.splitlines() if l.strip().lower().startswith("vertex")]
    if not wiersze or len(wiersze) % 3:
        raise ValueError(f"{sciezka}: ani binarny, ani poprawny ASCII STL")
    return np.array(wiersze, float).reshape(-1, 3, 3), "ASCII"


def _dot(u, v):
    return np.einsum("ij,ij->i", u, v)


def _norm(u):
    return np.sqrt(np.einsum("ij,ij->i", u, u))


class Siatka:
    """Siatka trójkątna po zespoleniu wierzchołków, z danymi do odległości i znaku."""

    def __init__(self, nazwa, tri, dl_odcinka=0.5, format_pliku="?"):
        self.nazwa = nazwa
        self.format = format_pliku
        V, inv = np.unique(np.round(tri.reshape(-1, 3), 5), axis=0, return_inverse=True)
        F = inv.reshape(-1, 3)
        ok = (F[:, 0] != F[:, 1]) & (F[:, 1] != F[:, 2]) & (F[:, 0] != F[:, 2])
        self.f_powtorzone = int((~ok).sum())
        F = F[ok]
        self.V, self.F = V, F
        a, b, c = V[F[:, 0]], V[F[:, 1]], V[F[:, 2]]
        cr = np.cross(b - a, c - a)
        dl = _norm(cr)
        pole = 0.5 * dl
        fn = cr / np.maximum(dl, 1e-300)[:, None]
        fn[dl < 1e-12] = 0.0
        # krawędzie, szczelność, orientacja
        e = np.stack([F[:, [0, 1]], F[:, [1, 2]], F[:, [2, 0]]], 1).reshape(-1, 2)
        E, einv, ecnt = np.unique(np.sort(e, 1), axis=0, return_inverse=True, return_counts=True)
        self.E = E
        self.kraw_nie2 = int((ecnt != 2).sum())
        self.kraw_skierowane_powt = int(len(e) - len(np.unique(e, axis=0)))
        tri_kraw = einv.reshape(-1, 3)
        # pseudonormalne: krawędzi (suma normalnych ścian) i wierzchołków (kątowo ważone)
        kn = np.zeros((len(E), 3))
        np.add.at(kn, einv, np.repeat(fn, 3, axis=0))
        wn = np.zeros_like(V)
        for i in range(3):
            p = V[F[:, i]]
            u = V[F[:, (i + 1) % 3]] - p
            w = V[F[:, (i + 2) % 3]] - p
            cosk = _dot(u, w) / np.maximum(_norm(u) * _norm(w), 1e-300)
            kat = np.arccos(np.clip(cosk, -1, 1))
            np.add.at(wn, F[:, i], fn * kat[:, None])
        self.objetosc = float(_dot(a, np.cross(b, c)).sum() / 6.0)
        # trójkąty do odległości: bez zdegenerowanych (ich krawędzie należą do sąsiadów)
        dobre = pole > 1e-10
        self.f_zdegenerowane = int((~dobre).sum())
        self.Fg = F[dobre]
        self.a, self.b, self.c = a[dobre], b[dobre], c[dobre]
        self.e1, self.e2 = self.b - self.a, self.c - self.a
        self.fn = fn[dobre]
        self.tk = tri_kraw[dobre]
        self.kn, self.wn = kn, wn
        self.ctr = (self.a + self.b + self.c) / 3.0
        self.rad = np.sqrt(np.max(np.stack([_dot(self.a - self.ctr, self.a - self.ctr),
                                            _dot(self.b - self.ctr, self.b - self.ctr),
                                            _dot(self.c - self.ctr, self.c - self.ctr)]), axis=0))
        obw = _norm(self.b - self.a) + _norm(self.c - self.b) + _norm(self.a - self.c)
        self.promien_wpisany_max = float((2 * pole[dobre] / obw).max())
        self.pole = float(pole.sum())
        # wypukłość krawędzi: wierzchołek naprzeciw w drugiej ścianie leży pod płaszczyzną pierwszej
        opp = np.stack([F[:, 2], F[:, 0], F[:, 1]], 1).reshape(-1)        # naprzeciw krawędzi k ściany f
        fac = np.repeat(np.arange(len(F)), 3)
        kolej = np.argsort(einv, kind="stable")
        wypukla = np.ones(len(E), bool)
        if self.kraw_nie2 == 0:
            i1, i2 = kolej[0::2], kolej[1::2]                               # dwa wystąpienia każdej krawędzi
            ed = einv[i1]
            v0 = V[E[ed, 0]]
            s12 = _dot(fn[fac[i1]], V[opp[i2]] - v0) + _dot(fn[fac[i2]], V[opp[i1]] - v0)
            zerowa = (dl[fac[i1]] < 1e-12) | (dl[fac[i2]] < 1e-12)
            wypukla[ed] = (s12 < -1e-9) | zerowa
        self.wypukla = wypukla
        # odcinki krawędzi
        p0, p1 = V[E[:, 0]], V[E[:, 1]]
        L = _norm(p1 - p0)
        n = np.maximum(1, np.ceil(L / dl_odcinka - 1e-9).astype(np.int64))
        idx = np.repeat(np.arange(len(E)), n)
        k = np.arange(n.sum()) - np.repeat(np.cumsum(n) - n, n)
        t0 = (k / n[idx])[:, None]
        t1 = ((k + 1) / n[idx])[:, None]
        d = (p1 - p0)[idx]
        self.s0 = p0[idx] + d * t0
        self.s1 = p0[idx] + d * t1
        self.smid = 0.5 * (self.s0 + self.s1)
        self.sh = 0.5 * L[idx] / n[idx]
        w = wypukla[idx]                         # odcinki krawędzi wypukłych – do krawędź–krawędź
        self.w0, self.w1, self.wmid, self.wh = self.s0[w], self.s1[w], self.smid[w], self.sh[w]
        self.kraw_max = float(L.max())
        # składowe spójne (union-find po krawędziach)
        rodz = list(range(len(V)))

        def znajdz(x):
            while rodz[x] != x:
                rodz[x] = rodz[rodz[x]]
                x = rodz[x]
            return x
        for i, j in E.tolist():
            ri, rj = znajdz(i), znajdz(j)
            if ri != rj:
                rodz[ri] = rj
        korz = np.array([znajdz(i) for i in range(len(V))])
        _, pierwszy = np.unique(korz, return_index=True)
        self.skladowe_wierzcholki = np.sort(pierwszy)
        self.lo, self.hi = V.min(0), V.max(0)
        self.rmax = float(_norm(V).max())
        self._klastry = {}

    def opis(self):
        return {
            "plik_format": self.format, "trojkaty": int(len(self.F)), "wierzcholki": int(len(self.V)),
            "krawedzie_nie_2_sciany": self.kraw_nie2, "krawedzie_skierowane_powtorzone": self.kraw_skierowane_powt,
            "trojkaty_zdegenerowane": self.f_zdegenerowane + self.f_powtorzone,
            "objetosc_mm3": round(self.objetosc, 1), "pole_mm2": round(self.pole, 1),
            "skladowe": int(len(self.skladowe_wierzcholki)),
            "bbox_min": [round(float(x), 3) for x in self.lo], "bbox_max": [round(float(x), 3) for x in self.hi],
            "max_odl_od_poczatku": round(self.rmax, 3), "max_krawedz": round(self.kraw_max, 3),
            "max_promien_wpisany": round(self.promien_wpisany_max, 3),
            "odcinki_krawedzi": int(len(self.sh)), "krawedzie_wypukle": int(self.wypukla.sum()),
        }

    def klastry(self, rodzaj, komorka=4.0):
        """Klastry elementów (wierzchołki 'v', trójkąty 't', odcinki 's') do trybu dalekiego."""
        if rodzaj in self._klastry:
            return self._klastry[rodzaj]
        if rodzaj == "v":
            sr = self.V
            pkt = [self.V]
        elif rodzaj == "t":
            sr = self.ctr
            pkt = [self.a, self.b, self.c]
        else:
            sr = self.wmid
            pkt = [self.w0, self.w1]
        klucz = np.floor(sr / komorka).astype(np.int64)
        _, kl = np.unique(klucz, axis=0, return_inverse=True)
        kl = kl.ravel()
        n = kl.max() + 1
        cnt = np.bincount(kl, minlength=n)
        sumy = np.zeros((n, 3))
        np.add.at(sumy, kl, sr)
        C = sumy / cnt[:, None]
        r = np.zeros(n)
        for p in pkt:
            np.maximum.at(r, kl, _norm(p - C[kl]))
        kolej = np.argsort(kl, kind="stable")
        start = np.concatenate([[0], np.cumsum(cnt)[:-1]])
        wynik = (C, r, start, cnt, kolej)
        self._klastry[rodzaj] = wynik
        return wynik


class Krata:
    """Indeks przestrzenny w komórkach sześciennych.

    Element trafia do komórki, gdy środek komórki leży w odległości ≤ zapas + ½ przekątnej
    komórki od elementu (dokładny test punkt–trójkąt albo punkt–odcinek). Zapytanie punktem p
    zwraca więc na pewno każdy element w odległości < zapas od p.
    """

    def __init__(self, lo, hi, zapas, komorka, geom=None, blok=40000):
        self.h = float(komorka)
        self.o = lo.min(0) - zapas - 1e-6
        g_hi = hi.max(0) + zapas + 1e-6
        self.dims = (np.floor((g_hi - self.o) / self.h).astype(np.int64) + 1)
        i0a = np.clip(np.floor((lo - zapas - self.o) / self.h).astype(np.int64), 0, self.dims - 1)
        i1a = np.clip(np.floor((hi + zapas - self.o) / self.h).astype(np.int64), 0, self.dims - 1)
        prog = zapas + self.h * math.sqrt(3) / 2 + 1e-9
        IT, CI = [], []
        for b0 in range(0, len(lo), blok):
            sl = slice(b0, min(len(lo), b0 + blok))
            i0, i1 = i0a[sl], i1a[sl]
            nn = i1 - i0 + 1
            cnt = nn.prod(1)
            item = np.repeat(np.arange(sl.start, sl.stop), cnt)
            loc = np.arange(cnt.sum()) - np.repeat(np.cumsum(cnt) - cnt, cnt)
            li = item - sl.start
            nx, ny = nn[li, 0], nn[li, 1]
            ix = i0[li, 0] + loc % nx
            r = loc // nx
            iy = i0[li, 1] + r % ny
            iz = i0[li, 2] + r // ny
            if geom is not None:
                srod = self.o + (np.stack([ix, iy, iz], 1) + 0.5) * self.h
                if geom[0] == "tri":
                    d, _, _ = pkt_trojkat(srod, geom[1][item], geom[2][item], geom[3][item])
                else:
                    p0, p1 = geom[1][item], geom[2][item]
                    dd = p1 - p0
                    tt = np.clip(_dot(srod - p0, dd) / np.maximum(_dot(dd, dd), 1e-300), 0, 1)
                    d = _norm(srod - p0 - dd * tt[:, None])
                m = d <= prog
                item, ix, iy, iz = item[m], ix[m], iy[m], iz[m]
            IT.append(item)
            CI.append((ix * self.dims[1] + iy) * self.dims[2] + iz)
        item = np.concatenate(IT)
        cid = np.concatenate(CI)
        kolej = np.argsort(cid, kind="stable")
        self.items = item[kolej].astype(np.int32)
        self.cnt = np.bincount(cid, minlength=int(self.dims.prod())).astype(np.int64)
        self.start = np.concatenate([[0], np.cumsum(self.cnt)[:-1]])
        self.wpisow = int(len(self.items))

    def zapytaj(self, P, maks_par=1_500_000):
        idx = np.floor((P - self.o) / self.h).astype(np.int64)
        ok = np.all((idx >= 0) & (idx < self.dims), axis=1)
        pi = np.nonzero(ok)[0]
        if len(pi) == 0:
            return
        cid = (idx[pi, 0] * self.dims[1] + idx[pi, 1]) * self.dims[2] + idx[pi, 2]
        c = self.cnt[cid]
        m = c > 0
        pi, cid, c = pi[m], cid[m], c[m]
        if len(pi) == 0:
            return
        cs = np.cumsum(c)
        granice = np.searchsorted(cs, np.arange(maks_par, cs[-1] + maks_par, maks_par), side="right")
        granice = np.unique(np.concatenate([[0], np.maximum(granice, 1), [len(pi)]]))
        for i, j in zip(granice[:-1], granice[1:]):
            cc = c[i:j]
            tot = int(cc.sum())
            loc = np.arange(tot) - np.repeat(np.cumsum(cc) - cc, cc)
            yield np.repeat(pi[i:j], cc), self.items[np.repeat(self.start[cid[i:j]], cc) + loc]


# ---------------------------------------------------------------- jądra geometrii
def pkt_trojkat(p, a, b, c):
    """Najbliższy punkt trójkąta (Ericson 5.1.5), wektorowo. Region: 0 ściana, 1 AB, 2 BC, 3 CA, 4 A, 5 B, 6 C."""
    ab, ac, ap = b - a, c - a, p - a
    d1, d2 = _dot(ab, ap), _dot(ac, ap)
    bp = p - b
    d3, d4 = _dot(ab, bp), _dot(ac, bp)
    cp = p - c
    d5, d6 = _dot(ab, cp), _dot(ac, cp)
    va = d3 * d6 - d5 * d4
    vb = d5 * d2 - d1 * d6
    vc = d1 * d4 - d3 * d2
    den = va + vb + vc
    den = np.where(np.abs(den) > 1e-300, den, 1.0)
    q = a + ab * (vb / den)[:, None] + ac * (vc / den)[:, None]
    reg = np.zeros(len(p), np.int8)
    m = (va <= 0) & ((d4 - d3) >= 0) & ((d5 - d6) >= 0)
    if m.any():
        t = (d4 - d3)[m] / ((d4 - d3)[m] + (d5 - d6)[m])
        q[m] = b[m] + (c[m] - b[m]) * t[:, None]
        reg[m] = 2
    m = (vb <= 0) & (d2 >= 0) & (d6 <= 0)
    if m.any():
        t = d2[m] / (d2[m] - d6[m])
        q[m] = a[m] + ac[m] * t[:, None]
        reg[m] = 3
    m = (d6 >= 0) & (d5 <= d6)
    q[m] = c[m]
    reg[m] = 6
    m = (vc <= 0) & (d1 >= 0) & (d3 <= 0)
    if m.any():
        t = d1[m] / (d1[m] - d3[m])
        q[m] = a[m] + ab[m] * t[:, None]
        reg[m] = 1
    m = (d3 >= 0) & (d4 <= d3)
    q[m] = b[m]
    reg[m] = 5
    m = (d1 <= 0) & (d2 <= 0)
    q[m] = a[m]
    reg[m] = 4
    return _norm(p - q), q, reg


def odc_odc(p1, q1, p2, q2):
    """Najbliższe punkty dwóch odcinków (Ericson 5.1.9), wektorowo; odcinki niezerowe."""
    d1, d2, r = q1 - p1, q2 - p2, p1 - p2
    a, e, f = _dot(d1, d1), _dot(d2, d2), _dot(d2, r)
    c, b = _dot(d1, r), _dot(d1, d2)
    den = a * e - b * b
    ok = den > 1e-12 * a * e
    s = np.where(ok, np.clip((b * f - c * e) / np.where(ok, den, 1.0), 0, 1), 0.0)
    t = (b * s + f) / e
    m0, m1 = t < 0, t > 1
    t = np.clip(t, 0, 1)
    s = np.where(m0, np.clip(-c / a, 0, 1), s)
    s = np.where(m1, np.clip((b - c) / a, 0, 1), s)
    c1 = p1 + d1 * s[:, None]
    c2 = p2 + d2 * t[:, None]
    return _norm(c1 - c2), c1, c2


def odc_przecina(p0, p1, a, e1, e2):
    """Czy odcinek p0–p1 przecina trójkąt (a, a+e1, a+e2) – Möller–Trumbore."""
    d = p1 - p0
    h = np.cross(d, e2)
    det = _dot(e1, h)
    ok = np.abs(det) > 1e-14
    inv = np.where(ok, 1.0 / np.where(ok, det, 1.0), 0.0)
    s = p0 - a
    u = inv * _dot(s, h)
    q = np.cross(s, e1)
    v = inv * _dot(d, q)
    t = inv * _dot(e2, q)
    return ok & (u >= 0) & (v >= 0) & (u + v <= 1) & (t >= 0) & (t <= 1)


KIERUNKI_PROMIENI = np.array([[0.5345, 0.2673, 0.8018], [-0.4082, 0.8165, 0.4082], [0.7071, -0.1, -0.7]])


def w_srodku(p, s):
    """Test parzystości promienia (3 kierunki, większość głosów): czy punkt p leży wewnątrz siatki s."""
    glosy = 0
    for k in KIERUNKI_PROMIENI:
        k = k / np.linalg.norm(k)
        d = np.broadcast_to(k, s.a.shape)
        h = np.cross(d, s.e2)
        det = _dot(s.e1, h)
        ok = np.abs(det) > 1e-14
        inv = np.where(ok, 1.0 / np.where(ok, det, 1.0), 0.0)
        w = p[None, :] - s.a
        u = inv * _dot(w, h)
        q = np.cross(w, s.e1)
        v = inv * _dot(d, q)
        t = inv * _dot(s.e2, q)
        traf = ok & (u >= 0) & (v >= 0) & (u + v <= 1) & (t > 1e-9)
        glosy += int(np.count_nonzero(traf)) % 2
    return glosy >= 2


def znak_pseudonormalna(s, ti, reg, p, q):
    """Znak (p − q)·n, n = pseudonormalna najbliższego elementu (ściana/krawędź/wierzchołek)."""
    n = s.fn[ti].copy()
    for r, kol in ((1, 0), (2, 1), (3, 2)):
        m = reg == r
        if m.any():
            n[m] = s.kn[s.tk[ti[m], kol]]
    for r, kol in ((4, 0), (5, 1), (6, 2)):
        m = reg == r
        if m.any():
            n[m] = s.wn[s.Fg[ti[m], kol]]
    return np.sign(_dot(p - q, n))


# ---------------------------------------------------------------- kinematyka
def Rx(a):
    c, s = np.cos(a), np.sin(a)
    R = np.zeros(np.shape(a) + (3, 3))
    R[..., 0, 0] = 1
    R[..., 1, 1], R[..., 1, 2], R[..., 2, 1], R[..., 2, 2] = c, -s, s, c
    return R


def Ry(a):
    c, s = np.cos(a), np.sin(a)
    R = np.zeros(np.shape(a) + (3, 3))
    R[..., 1, 1] = 1
    R[..., 0, 0], R[..., 0, 2], R[..., 2, 0], R[..., 2, 2] = c, s, -s, c
    return R


def kinematyka_pretow(czesc, stany):
    """Miejsce na moduł etapu 2: pręty X/Y z IK (koncepcja v3.1 pkt 3.2).

    Ma zwrócić (R, t) dla każdego stanu: R (n,3,3), t (n,3) – położenie pręta w świecie
    z kąta serwa α z IK (wzór zamknięty) i środków kulek M2 (na gałce) i M5 (na Ramieniu).
    Dla Lipschitza w raporcie potrzebne jest też maksymalne przemieszczenie punktu
    na 1 rad zmiennej (pole 'lipschitz_mm_na_rad' w opisie części).
    """
    raise NotImplementedError("kinematyka prętów (etap 2) nie jest jeszcze zaimplementowana")


def zmienne_czesci(czesc):
    typ = czesc["ruch"]["typ"]
    if typ == "stala":
        return []
    if typ in ("galka", "z_galka"):
        return ["psi", "theta"]
    if typ == "powieka":
        return [czesc["ruch"]["zmienna"]]
    if typ == "pret_ik":
        return ["psi", "theta"]
    raise ValueError(f"nieznany typ ruchu {typ}")


def pozy(czesc, stany, n):
    """(R, t) części dla n stanów; stany: dict zmienna -> tablica (n,) w stopniach."""
    typ = czesc["ruch"]["typ"]
    if typ == "stala":
        R = np.broadcast_to(np.eye(3), (n, 3, 3)).copy()
    elif typ in ("galka", "z_galka"):
        # koncepcja v3.1: R = Rx(−θ)·Ry(ψ); ψ+ = w prawo (+x), θ+ = w górę (+y)
        R = Rx(-np.radians(stany["theta"])) @ Ry(np.radians(stany["psi"]))
    elif typ == "powieka":
        # kąt = kąt krawędzi przedniej od +z ku +y; Rx(−Δ) zwiększa ten kąt o Δ
        d = np.radians(stany[czesc["ruch"]["zmienna"]] - czesc["ruch"]["kat_modelu"])
        R = Rx(-d)
    elif typ == "pret_ik":
        return kinematyka_pretow(czesc, stany)
    else:
        raise ValueError(typ)
    t = np.zeros((n, 3))
    if "przesun" in czesc:
        t = t + np.asarray(czesc["przesun"], float)[None, :]
    return R, t


def lipschitz(czesci_pary, A_rmax, zmienne):
    """mm przemieszczenia punktu A w układzie B na 1 rad każdej zmiennej (obroty wokół początku)."""
    L = {}
    for v in zmienne:
        L[v] = 0.0
        for cz in czesci_pary:
            if v in zmienne_czesci(cz):
                # części z IK (etap 2) podają własną stałą; obroty wokół początku: max |p| części A
                L[v] += cz["ruch"].get("lipschitz_mm_na_rad", {}).get(v, A_rmax)
    return L


# ---------------------------------------------------------------- ocena jednego stanu
_CTX = {}


def _w_strefie(ctx, pA, pB):
    """Maska rekordów w strefach zamierzonych (punkty w układzie części B)."""
    z = np.zeros(len(pA), bool)
    for s in ctx["strefy"]:
        ax = "xyz".index(s["os"])
        inne = [i for i in range(3) if i != ax]
        mid = 0.5 * (pA + pB)
        reg = (np.abs(mid[:, ax]) >= s.get("os_abs_min", -1e9)) & \
              (np.hypot(mid[:, inne[0]], mid[:, inne[1]]) <= s.get("rho_max", 1e9))
        dd = pB - pA
        dl = _norm(dd)
        kier = np.abs(dd[:, ax]) >= s.get("kierunek_osiowy_min", 0.0) * dl
        z |= reg & kier & (dl > 1e-9)
    return z


class Zbieracz:
    def __init__(self, ctx):
        self.ctx = ctx
        self.best = [np.inf, None]
        self.bestp = [np.inf, None]
        self.miejsca = []

    def dodaj(self, d, pA, pB, rodzaj):
        if len(d) == 0:
            return
        z = _w_strefie(self.ctx, pA, pB) if self.ctx["strefy"] else np.zeros(len(d), bool)
        i = int(np.argmin(d))
        if d[i] < self.best[0]:
            self.best = [float(d[i]), (pA[i].copy(), pB[i].copy(), rodzaj, bool(z[i]))]
        if (~z).any():
            dz = np.where(z, np.inf, d)
            i = int(np.argmin(dz))
            if dz[i] < self.bestp[0]:
                self.bestp = [float(dz[i]), (pA[i].copy(), pB[i].copy(), rodzaj, False)]
        m = d < self.ctx["c_miejsc"]
        if m.any():
            self.miejsca.append((d[m], pA[m], pB[m], np.full(m.sum(), rodzaj, np.int8), z[m]))

    def prog(self):
        return min(self.ctx["c"], max(self.ctx["c_miejsc"], self.best[0], self.bestp[0]))

    def miejsca_razem(self):
        if not self.miejsca:
            return None
        d = np.concatenate([m[0] for m in self.miejsca])
        pA = np.concatenate([m[1] for m in self.miejsca])
        pB = np.concatenate([m[2] for m in self.miejsca])
        r = np.concatenate([m[3] for m in self.miejsca])
        z = np.concatenate([m[4] for m in self.miejsca])
        v = np.floor(0.5 * (pA + pB) / self.ctx["wox"]).astype(np.int64) + 1024
        klucz = (v[:, 0] << 22) | (v[:, 1] << 11) | v[:, 2]
        kolej = np.lexsort((d, klucz))
        klucz = klucz[kolej]
        pierwsze = np.concatenate([[True], klucz[1:] != klucz[:-1]])
        k = kolej[pierwsze]
        return (klucz[pierwsze], d[k].astype(np.float32), pA[k].astype(np.float32),
                pB[k].astype(np.float32), r[k], z[k])


def _przeciecie(ctx, R, t):
    """Pierwsze przecięcie odcinek krawędzi – trójkąt (w obie strony); punkt w układzie B albo None."""
    A, B = ctx["A"], ctx["B"]
    MA = A.smid @ R.T + t
    S0, S1 = A.s0 @ R.T + t, A.s1 @ R.T + t
    for ai, ti in ctx["kBm"].zapytaj(MA):
        m = _norm(MA[ai] - B.ctr[ti]) <= A.sh[ai] + B.rad[ti] + 1e-9
        ai, ti = ai[m], ti[m]
        h = odc_przecina(S0[ai], S1[ai], B.a[ti], B.e1[ti], B.e2[ti])
        if h.any():
            return MA[ai[np.argmax(h)]]
    MB = (B.smid - t) @ R
    T0, T1 = (B.s0 - t) @ R, (B.s1 - t) @ R
    for bi, ti in ctx["kAm"].zapytaj(MB):
        m = _norm(MB[bi] - A.ctr[ti]) <= B.sh[bi] + A.rad[ti] + 1e-9
        bi, ti = bi[m], ti[m]
        h = odc_przecina(T0[bi], T1[bi], A.a[ti], A.e1[ti], A.e2[ti])
        if h.any():
            return B.smid[bi[np.argmax(h)]]
    return None


def _zawieranie(ctx, R, t):
    """Całkowite zawieranie składowej jednej części w drugiej (bez przecięcia powierzchni)."""
    A, B = ctx["A"], ctx["B"]
    PA = A.V @ R.T + t
    if np.all(PA.min(0) >= B.lo - 1e-9) and np.all(PA.max(0) <= B.hi + 1e-9):
        for i in A.skladowe_wierzcholki:
            if w_srodku(PA[i], B):
                return PA[i]
    PB = (B.V - t) @ R
    if np.all(PB.min(0) >= A.lo - 1e-9) and np.all(PB.max(0) <= A.hi + 1e-9):
        for i in B.skladowe_wierzcholki:
            if w_srodku(PB[i], A):
                return B.V[i]
    return None


def _glebokosc(ctx, R, t):
    """Największa odległość wierzchołka jednej części leżącego wewnątrz drugiej od jej powierzchni (≤ c)."""
    A, B, c = ctx["A"], ctx["B"], ctx["c"]
    najg, pkt = 0.0, None
    for kier in (0, 1):
        if kier == 0:
            P, S, K = A.V @ R.T + t, B, ctx["kB"]
        else:
            P, S, K = (B.V - t) @ R, A, ctx["kA"]
        dd, tt, rr, pp, qq = [], [], [], [], []
        for pi, ti in K.zapytaj(P):
            m = _norm(P[pi] - S.ctr[ti]) - S.rad[ti] < c
            pi, ti = pi[m], ti[m]
            d, q, reg = pkt_trojkat(P[pi], S.a[ti], S.b[ti], S.c[ti])
            dd.append(d); tt.append(ti); rr.append(reg); pp.append(pi); qq.append(q)
        if not dd:
            continue
        d, ti, reg, pi, q = (np.concatenate(x) for x in (dd, tt, rr, pp, qq))
        kolej = np.lexsort((d, pi))
        pierwsze = kolej[np.concatenate([[True], pi[kolej][1:] != pi[kolej][:-1]])]
        zn = znak_pseudonormalna(S, ti[pierwsze], reg[pierwsze], P[pi[pierwsze]], q[pierwsze])
        wew = zn < 0
        if wew.any():
            j = pierwsze[wew][np.argmax(d[pierwsze][wew])]
            if d[j] > najg:
                najg = float(d[j])
                pkt = P[pi[j]] if kier == 0 else (P[pi[j]] @ R.T + t)
    return najg, pkt


def ocen_blisko(ctx, R, t):
    """Dokładna odległość w obrębie odcięcia c (indeks przestrzenny)."""
    A, B, c = ctx["A"], ctx["B"], ctx["c"]
    zb = Zbieracz(ctx)
    PA = A.V @ R.T + t
    for pi, ti in ctx["kB"].zapytaj(PA):
        m = _norm(PA[pi] - B.ctr[ti]) - B.rad[ti] < c
        pi, ti = pi[m], ti[m]
        d, q, _ = pkt_trojkat(PA[pi], B.a[ti], B.b[ti], B.c[ti])
        m = d < c
        zb.dodaj(d[m], PA[pi[m]], q[m], 0)
    PB = (B.V - t) @ R
    for pi, ti in ctx["kA"].zapytaj(PB):
        m = _norm(PB[pi] - A.ctr[ti]) - A.rad[ti] < c
        pi, ti = pi[m], ti[m]
        d, q, _ = pkt_trojkat(PB[pi], A.a[ti], A.b[ti], A.c[ti])
        m = d < c
        zb.dodaj(d[m], q[m] @ R.T + t, B.V[pi[m]], 1)
    MA = A.wmid @ R.T + t
    S0, S1 = A.w0 @ R.T + t, A.w1 @ R.T + t
    for ai, bi in ctx["kBo"].zapytaj(MA):
        T = zb.prog()
        m = _norm(MA[ai] - B.wmid[bi]) - A.wh[ai] - B.wh[bi] < T
        ai, bi = ai[m], bi[m]
        d, c1, c2 = odc_odc(S0[ai], S1[ai], B.w0[bi], B.w1[bi])
        m = d < T
        zb.dodaj(d[m], c1[m], c2[m], 2)
    return zb


def _bnb(CA, rA, kA, CB, rB, kB, elementy, UB, rek):
    """Gałęzie i granice po parach klastrów; elementy(ia, ib) -> (d, pA, pB, rodzaj) dla par klastrów."""
    D = np.sqrt(((CA[:, None, :] - CB[None, :, :]) ** 2).sum(-1))
    lb = (D - rA[:, None] - rB[None, :]).ravel()
    kolej = np.argsort(lb)
    lb = lb[kolej]
    nB = len(CB)
    i, krok = 0, 16
    while i < len(kolej) and lb[i] < UB:
        j = min(len(kolej), i + krok)
        sel = kolej[i:j][lb[i:j] < UB]
        wyn = elementy(sel // nB, sel % nB, UB)
        if wyn is not None and wyn[0] < UB:
            UB, rek = wyn[0], wyn[1]
        i = j
        krok = min(krok * 2, 512)
    return UB, rek


def _rozwin(kA, kB, ia, ib):
    """Pary elementów dla par klastrów (ia, ib)."""
    _, _, sA, nA, oA = kA
    _, _, sB, nB, oB = kB
    na, nb = nA[ia], nB[ib]
    ile = na * nb
    tot = int(ile.sum())
    loc = np.arange(tot) - np.repeat(np.cumsum(ile) - ile, ile)
    nbr = np.repeat(nb, ile)
    ea = oA[np.repeat(sA[ia], ile) + loc // nbr]
    eb = oB[np.repeat(sB[ib], ile) + loc % nbr]
    return ea, eb


def ocen_daleko(ctx, R, t):
    """Dokładna odległość bez odcięcia: gałęzie i granice po klastrach 4 mm (tryb dla par dalekich)."""
    A, B = ctx["A"], ctx["B"]
    UB, rek = np.inf, None
    PA = A.V @ R.T + t
    kv, kt = A.klastry("v"), B.klastry("t")

    def el1(ia, ib, ub):
        ea, eb = _rozwin(kv, kt, ia, ib)
        m = _norm(PA[ea] - B.ctr[eb]) - B.rad[eb] < ub
        ea, eb = ea[m], eb[m]
        if len(ea) == 0:
            return None
        d, q, _ = pkt_trojkat(PA[ea], B.a[eb], B.b[eb], B.c[eb])
        i = int(np.argmin(d))
        return float(d[i]), (PA[ea[i]].copy(), q[i].copy(), 0, False)
    UB, rek = _bnb(kv[0] @ R.T + t, kv[1], kv, kt[0], kt[1], kt, el1, UB, rek)
    PB = (B.V - t) @ R
    kv2, kt2 = B.klastry("v"), A.klastry("t")

    def el2(ib, ia, ub):
        eb, ea = _rozwin(kv2, kt2, ib, ia)
        m = _norm(PB[eb] - A.ctr[ea]) - A.rad[ea] < ub
        eb, ea = eb[m], ea[m]
        if len(eb) == 0:
            return None
        d, q, _ = pkt_trojkat(PB[eb], A.a[ea], A.b[ea], A.c[ea])
        i = int(np.argmin(d))
        return float(d[i]), ((q[i] @ R.T + t), B.V[eb[i]].copy(), 1, False)
    UB, rek = _bnb((kv2[0] - t) @ R, kv2[1], kv2, kt2[0], kt2[1], kt2, el2, UB, rek)
    MA = A.wmid @ R.T + t
    S0, S1 = A.w0 @ R.T + t, A.w1 @ R.T + t
    ks, ks2 = A.klastry("s"), B.klastry("s")

    def el3(ia, ib, ub):
        ea, eb = _rozwin(ks, ks2, ia, ib)
        m = _norm(MA[ea] - B.wmid[eb]) - A.wh[ea] - B.wh[eb] < ub
        ea, eb = ea[m], eb[m]
        if len(ea) == 0:
            return None
        d, c1, c2 = odc_odc(S0[ea], S1[ea], B.w0[eb], B.w1[eb])
        i = int(np.argmin(d))
        return float(d[i]), (c1[i].copy(), c2[i].copy(), 2, False)
    UB, rek = _bnb(ks[0] @ R.T + t, ks[1], ks, ks2[0], ks2[1], ks2, el3, UB, rek)
    return UB, rek


def ocen_stan(ctx, R, t):
    """Wynik jednego stanu (względna poza A→B): odległości, rekordy, przenikanie, miejsca."""
    wyn = {"tryb": ctx["tryb"]}
    if ctx["tryb"] == "blisko":
        zb = ocen_blisko(ctx, R, t)
        wyn["d"], wyn["rek"] = zb.best
        wyn["dp"], wyn["rekp"] = zb.bestp
        wyn["miejsca"] = zb.miejsca_razem()
        p = _przeciecie(ctx, R, t)
        rodz = "przecięcie powierzchni" if p is not None else None
    else:
        d, rek = ocen_daleko(ctx, R, t)
        if rek is not None and ctx["strefy"]:
            z = bool(_w_strefie(ctx, rek[0][None, :], rek[1][None, :])[0])
            rek = (rek[0], rek[1], rek[2], z)
        wyn["d"], wyn["rek"] = d, rek
        wyn["dp"], wyn["rekp"] = (d, rek) if (rek is None or not rek[3]) else (np.inf, None)
        wyn["miejsca"] = None
        p = None
        rodz = None
        if d <= ctx["prom_wpis"]:
            wyn["uwaga"] = "odległość ≤ promień wpisany – przecięcie niewykluczone (tryb daleki bez testu)"
    if p is None:
        p = _zawieranie(ctx, R, t)
        if p is not None:
            rodz = "zawieranie (test parzystości)"
    wyn["kol"] = p is not None
    if p is not None:
        g, pg = _glebokosc(ctx, R, t)
        wyn["gl"] = g
        wyn["kol_pkt"] = pg if pg is not None else p
        wyn["kol_rodzaj"] = rodz
        wyn["d"] = -g
        wyn["dp"] = min(wyn["dp"], -g)
    return wyn


def _praca(zadanie):
    klucz, pozy_lista = zadanie
    ctx = _CTX[klucz]
    return [ocen_stan(ctx, R, t) for R, t in pozy_lista]


# ---------------------------------------------------------------- siatka stanów i zakresy
def wartosci_zmiennej(lo, hi, krok, kotwica):
    """Węzły kraty kotwica + k·krok w [lo, hi]; poza zakresem najwyżej pół kroku, gdy brzeg dalej niż pół kroku."""
    k0 = math.ceil((lo - kotwica) / krok - 1e-9)
    k1 = math.floor((hi - kotwica) / krok + 1e-9)
    ks = list(range(k0, k1 + 1))
    if (kotwica + k0 * krok) - lo > krok / 2 + 1e-9:
        ks.insert(0, k0 - 1)
    if hi - (kotwica + k1 * krok) > krok / 2 + 1e-9:
        ks.append(k1 + 1)
    return np.array([kotwica + k * krok for k in ks], float)


def warunek_zakresu(zakres, stany, n):
    """Maska stanów spełniających warunek zakresu (pudełko + podążanie powiek)."""
    m = np.ones(n, bool)
    for v, w in stany.items():
        if v in zakres:
            m &= (w >= zakres[v][0] - 1e-9) & (w <= zakres[v][1] + 1e-9)
    pod = zakres.get("podazanie")
    if pod and ("G" in stany or "D" in stany):
        if "theta" in stany:
            th = stany["theta"][:, None]
        else:
            th = np.linspace(zakres["theta"][0], zakres["theta"][1], 121)[None, :]
        ok = np.ones((n, th.shape[1]), bool)
        k = pod["podazanie"] / pod["zakresTheta"]
        if "G" in stany:
            ok &= stany["G"][:, None] <= pod["otwG"] + k * np.maximum(th, 0) + 1e-9
        if "D" in stany:
            ok &= stany["D"][:, None] >= pod["otwD"] - k * np.maximum(-th, 0) - 1e-9
        m &= ok.any(1)
    return m


def klucze_poz(Rrel, trel):
    return np.concatenate([np.round(Rrel.reshape(-1, 9) * 1e7), np.round(trel * 1e5)], 1).astype(np.int64)


class Para:
    def __init__(self, cfg, opis_pary, czesci, siatki, n_proc):
        self.cfg = cfg
        self.opis = opis_pary
        self.nA, self.nB = opis_pary["a"], opis_pary["b"]
        self.cA, self.cB = czesci[self.nA], czesci[self.nB]
        self.A, self.B = siatki[self.nA], siatki[self.nB]
        self.zm = [v for v in KOLEJNOSC_ZMIENNYCH if v in set(zmienne_czesci(self.cA)) | set(zmienne_czesci(self.cB))]
        self.n_proc = n_proc
        self.memo = {}
        self.klucz = f"{self.nA}|{self.nB}|{id(self)}"
        s = cfg["siatka"]
        self.krok = s["krok_deg"]
        self.strefy = [dict(cfg["strefy"][n], nazwa=n) for n in opis_pary.get("strefy", [])]
        self.c = s["odciecie_mm"]
        self.ctx = None

    # --- pozy względne
    def pozy_wzgl(self, stany, n):
        RA, tA = pozy(self.cA, stany, n)
        RB, tB = pozy(self.cB, stany, n)
        Rrel = np.einsum("nji,njk->nik", RB, RA)
        trel = np.einsum("nji,nj->ni", RB, tA - tB)
        return Rrel, trel, RB, tB

    def przygotuj(self, tryb):
        s = self.cfg["siatka"]
        ctx = {"A": self.A, "B": self.B, "c": self.c, "c_miejsc": s["rejestr_miejsc_mm"], "wox": s.get("woksel_miejsc_mm", 1.0),
               "strefy": self.strefy, "tryb": tryb,
               "prom_wpis": max(self.A.promien_wpisany_max, self.B.promien_wpisany_max)}
        if tryb == "blisko":
            kom = self.cfg["siatka"].get("komorka_mm", 0.75)

            def kt(S, zap):
                lo = np.minimum(np.minimum(S.a, S.b), S.c)
                hi = np.maximum(np.maximum(S.a, S.b), S.c)
                return Krata(lo, hi, zap, kom, ("tri", S.a, S.b, S.c))
            ctx["kB"] = kt(self.B, self.c)
            ctx["kA"] = kt(self.A, self.c)
            ctx["kBo"] = Krata(np.minimum(self.B.w0, self.B.w1), np.maximum(self.B.w0, self.B.w1),
                               self.c + float(self.A.sh.max()), kom, ("seg", self.B.w0, self.B.w1))
            # wąskie kraty do testu przecięcia odcinek–trójkąt (zapas = pół długości odcinka drugiej siatki)
            ctx["kBm"] = kt(self.B, float(self.A.sh.max()) + 1e-6)
            ctx["kAm"] = kt(self.A, float(self.B.sh.max()) + 1e-6)
        else:
            for S in (self.A, self.B):
                for r in "vts":
                    S.klastry(r)
        self.ctx = ctx
        _CTX[self.klucz] = ctx

    def ocen(self, Rrel, trel, pula=None):
        """Ocena listy póz z pamięcią; zwraca listę wyników w kolejności wejścia."""
        klucze = klucze_poz(Rrel, trel)
        kb = [k.tobytes() for k in klucze]
        brak = {}
        for i, k in enumerate(kb):
            if k not in self.memo and k not in brak:
                brak[k] = i
        if brak:
            idx = list(brak.values())
            paczka = max(1, min(40, len(idx) // (4 * self.n_proc) + 1))
            zadania = [(self.klucz, [(Rrel[i], trel[i]) for i in idx[j:j + paczka]])
                       for j in range(0, len(idx), paczka)]
            if pula is not None and len(zadania) > 1:
                wyniki = pula.map(_praca, zadania, chunksize=1)
            else:
                wyniki = [_praca(z) for z in zadania]
            plaskie = [w for wyn in wyniki for w in wyn]
            for k, w in zip(brak.keys(), plaskie):
                self.memo[k] = w
        return [self.memo[k] for k in kb]


def _fmt_stan(stan):
    czesci = []
    for v, sym in (("psi", "ψ"), ("theta", "θ"), ("G", "G"), ("D", "D")):
        czesci.append(f"{sym} {stan[v]:+.3f}" if stan.get(v) is not None else f"{sym} ·")
    return "; ".join(czesci)


def analizuj_pare(cfg, opis_pary, czesci, siatki, n_proc, log):
    t0 = time.time()
    P = Para(cfg, opis_pary, czesci, siatki, n_proc)
    s = cfg["siatka"]
    zak = cfg["zakresy"]
    mech = zak[cfg["zakres_siatki"]]
    zm = P.zm
    # węzły siatki: krata w zakresie mechanicznym (zawiera kraty zakresów pracy)
    wart = {v: wartosci_zmiennej(mech[v][0], mech[v][1], P.krok, cfg["zmienne"][v]["kotwica"]) for v in zm}
    if zm:
        siatka = np.meshgrid(*[wart[v] for v in zm], indexing="ij")
        wezly = {v: g.ravel() for v, g in zip(zm, siatka)}
        n = len(wezly[zm[0]])
        ind = np.meshgrid(*[np.arange(len(wart[v])) for v in zm], indexing="ij")
        indeksy = np.stack([g.ravel() for g in ind], 1)
    else:
        wezly, n = {}, 1
        indeksy = np.zeros((1, 0), np.int64)
    Rrel, trel, RB, tB = P.pozy_wzgl(wezly, n)
    kl = klucze_poz(Rrel, trel)
    _, pierw, inv = np.unique(kl, axis=0, return_index=True, return_inverse=True)
    inv = inv.ravel()
    log(f"  {P.nA} – {P.nB}: zmienne {zm or '—'}, węzłów {n}, unikalnych póz względnych {len(pierw)}")
    wynik = {"a": P.nA, "b": P.nB, "zmienne": zm, "wymagany_mm": opis_pary.get("wymagany", 0.5),
             "uwaga": opis_pary.get("uwaga", ""), "strefy": [x["nazwa"] for x in P.strefy],
             "wezly": int(n), "pozy_unikalne": int(len(pierw))}
    ctxm = mp.get_context("fork")
    P.przygotuj("blisko")
    with ctxm.Pool(n_proc) as pula:
        wyn_u = P.ocen(Rrel[pierw], trel[pierw], pula)
    znaleziono = any(np.isfinite(w["d"]) for w in wyn_u)
    tryb = "blisko"
    ocenione = np.ones(len(pierw), bool)
    if not znaleziono:
        # pełna krata dowiodła d ≥ c we wszystkich węzłach; wartość liczy tryb daleki na kracie zgrubnej
        kz = s.get("krok_zgrubny_daleko", 4)
        zgrubne = np.all(indeksy % kz == 0, axis=1)
        u_z = np.unique(inv[zgrubne])
        ocenione = np.zeros(len(pierw), bool)
        ocenione[u_z] = True
        log(f"    brak odległości < {P.c} mm w żadnym węźle → tryb daleki (klastry, bez odcięcia) na kracie co "
            f"{kz * P.krok}° ({len(u_z)} póz)")
        P.memo = {}
        P.przygotuj("daleko")
        tryb = "daleko"
        with ctxm.Pool(n_proc) as pula:
            wz = P.ocen(Rrel[pierw[u_z]], trel[pierw[u_z]], pula)
        wyn_u = [None] * len(pierw)
        brak = {"d": np.inf, "dp": np.inf, "rek": None, "rekp": None, "miejsca": None, "kol": False}
        for u in range(len(pierw)):
            wyn_u[u] = brak
        for u, w in zip(u_z, wz):
            wyn_u[u] = w
        wynik["krok_zgrubny_daleko_deg"] = kz * P.krok
        wynik["pelna_krata_d_ponad_mm"] = P.c
    wynik["tryb"] = tryb
    wynik["odciecie_mm"] = P.c if tryb == "blisko" else None
    d_u = np.array([w["d"] for w in wyn_u])
    dp_u = np.array([w["dp"] for w in wyn_u])
    kol_u = np.array([w["kol"] for w in wyn_u])
    L = lipschitz([P.cA, P.cB], P.A.rmax, zm)
    pol_kroku = sum(L[v] * math.radians(P.krok) / 2 for v in zm)
    wynik["lipschitz_mm_na_rad"] = {v: round(L[v], 2) for v in zm}

    def stan_wezla(i):
        return {v: (float(wezly[v][i]) if v in zm else None) for v in KOLEJNOSC_ZMIENNYCH}

    def rekord_swiat(rek, stan):
        """Punkty rekordu (układ B) → świat w danym stanie."""
        st = {v: np.array([stan[v]]) for v in zm}
        RBs, tBs = pozy(P.cB, st, 1)
        pA = RBs[0] @ np.asarray(rek[0], float) + tBs[0]
        pB = RBs[0] @ np.asarray(rek[1], float) + tBs[0]
        return pA, pB

    def opis_rek(dv, rek, stan, zrodlo):
        if rek is None or not np.isfinite(dv):
            return {"min_mm": None if not np.isfinite(dv) else round(float(dv), 4),
                    "uwaga": f"brak odległości < {P.c} mm" if not np.isfinite(dv) else "", "stan": stan, "zrodlo": zrodlo}
        pA, pB = rekord_swiat(rek, stan)
        return {"min_mm": round(float(dv), 4), "stan": stan, "punkt_A": [round(float(x), 3) for x in pA],
                "punkt_B": [round(float(x), 3) for x in pB], "rodzaj": RODZAJ[rek[2]], "w_strefie": bool(rek[3]),
                "zrodlo": zrodlo}

    def eval_stany(lista):
        if not lista:
            return []
        st = {v: np.array([x[v] for x in lista], float) for v in zm}
        R_, t_, _, _ = P.pozy_wzgl(st, len(lista))
        return P.ocen(R_, t_, pula_ref[0])

    pula_ref = [None]
    zakresy_wyn = {}
    with ctxm.Pool(n_proc) as pula:
        pula_ref[0] = pula
        for nz, zr in zak.items():
            m = warunek_zakresu(zr, wezly, n) if zm else np.ones(1, bool)
            m &= ocenione[inv]
            if not m.any():
                continue
            idx = np.nonzero(m)[0]
            u_w = inv[idx]
            rz = {"wezly": int(len(idx)), "pozy": int(len(np.unique(u_w)))}
            # minimum na siatce
            out = {}
            for cel, tab, kl_rek in (("wszystko", d_u, "rek"), ("poza_strefami", dp_u, "rekp")):
                vals = tab[u_w]
                j = int(np.argmin(vals))
                i_w = idx[j]
                out[cel] = opis_rek(vals[j], wyn_u[u_w[j]][kl_rek], stan_wezla(i_w), "siatka")
            # narożniki zakresu (dokładne granice; z warunkiem podążania)
            naroza = []
            for kombi in itertools.product(*[zr[v] for v in zm]):
                st = dict(zip(zm, kombi))
                naroza.append(st)
            naroza_ok = [st for st in naroza if warunek_zakresu(zr, {v: np.array([st[v]]) for v in zm}, 1)[0]]
            # zagęszczenie: przeszukiwanie wzorcem od 3 najlepszych, rozłącznych węzłów
            krok_f = math.degrees(s["zageszczenie_mm"] / s["R_ref"])
            krok_k = P.krok / 2
            while krok_k > krok_f + 1e-12:          # krok końcowy = ½ⁿ kroku kraty, ≤ zageszczenie_mm na R_ref
                krok_k /= 2
            for cel, tab, kl_rek in (("wszystko", d_u, "rek"), ("poza_strefami", dp_u, "rekp")):
                vals = np.where(np.isfinite(tab[u_w]), tab[u_w], P.c if tryb == "blisko" else 1e9)
                kolej = np.argsort(vals, kind="stable")
                starty = []
                for j in kolej:
                    st = stan_wezla(idx[j])
                    if all(max(abs(st[v] - s0[v]) for v in zm) > 2 * P.krok for s0 in starty):
                        starty.append(st)
                    if len(starty) >= 3:
                        break
                if not zm:
                    out[cel + "_po_zageszczeniu"] = out[cel]
                    continue
                najl = out[cel]
                najl_v = najl["min_mm"] if najl["min_mm"] is not None else np.inf
                # narożniki
                wn = eval_stany(naroza_ok)
                for st, w in zip(naroza_ok, wn):
                    dv = w["d"] if cel == "wszystko" else w["dp"]
                    if dv < najl_v - 1e-9:
                        najl_v = dv
                        najl = opis_rek(dv, w[kl_rek], {v: st.get(v) for v in KOLEJNOSC_ZMIENNYCH}, "narożnik zakresu")
                for st0 in starty:
                    x = {v: st0[v] for v in zm}
                    w0 = eval_stany([x])[0]
                    fx = w0["d"] if cel == "wszystko" else w0["dp"]
                    h = P.krok / 2 * (wynik.get("krok_zgrubny_daleko_deg", P.krok) / P.krok)
                    ruchy = 0
                    while h >= krok_k - 1e-12 and ruchy < 60:
                        sasiedzi = []
                        for off in itertools.product((-1, 0, 1), repeat=len(zm)):
                            if not any(off):
                                continue
                            y = {v: min(max(x[v] + o * h, zr[v][0]), zr[v][1]) for v, o in zip(zm, off)}
                            if warunek_zakresu(zr, {v: np.array([y[v]]) for v in zm}, 1)[0] and y != x:
                                sasiedzi.append(y)
                        ws = eval_stany(sasiedzi)
                        fv = [(w["d"] if cel == "wszystko" else w["dp"]) for w in ws]
                        if fv and min(fv) < fx - 1e-6:
                            k = int(np.argmin(fv))
                            x, fx, w0 = sasiedzi[k], fv[k], ws[k]
                            ruchy += 1
                        else:
                            h /= 2
                    if fx < najl_v - 1e-9:
                        najl_v = fx
                        najl = opis_rek(fx, w0[kl_rek], {v: x.get(v) for v in KOLEJNOSC_ZMIENNYCH},
                                        f"zagęszczenie (krok końcowy {krok_k:.4f}° = {math.radians(krok_k) * s['R_ref']:.3f} mm na R{s['R_ref']})")
                out[cel + "_po_zageszczeniu"] = najl
            # ograniczenie dolne w ciągłym zakresie (Lipschitz)
            mn = out["wszystko"]["min_mm"]
            if tryb == "blisko":
                rz["ograniczenie_dolne_ciagle_mm"] = (round(mn - pol_kroku, 4) if mn is not None else None)
            else:
                kzr = wynik["krok_zgrubny_daleko_deg"] / P.krok
                rz["ograniczenie_dolne_ciagle_mm"] = round(max(P.c - pol_kroku, mn - pol_kroku * kzr), 4)
            rz["pol_kroku_lipschitz_mm"] = round(pol_kroku, 4)
            # przenikanie
            kol_w = kol_u[u_w]
            rz["kolizje_wezlow"] = int(kol_w.sum())
            if kol_w.any():
                gl = np.array([wyn_u[u]["gl"] if wyn_u[u]["kol"] else 0 for u in u_w])
                j = int(np.argmax(gl))
                w = wyn_u[u_w[j]]
                st = stan_wezla(idx[j])
                pk, _ = rekord_swiat((w["kol_pkt"], w["kol_pkt"], 0, False), st)
                rz["kolizja_najglebsza"] = {"glebokosc_mm": round(float(w["gl"]), 4), "stan": st,
                                           "punkt": [round(float(x), 3) for x in pk], "rodzaj": w["kol_rodzaj"]}
            # rejestr miejsc < c_miejsc
            rz["miejsca"] = miejsca_zakresu(P, wyn_u, u_w, idx, stan_wezla, rekord_swiat)
            rz.update(out)
            zakresy_wyn[nz] = rz
    wynik["zakresy"] = zakresy_wyn
    wynik["czas_s"] = round(time.time() - t0, 1)
    wynik["ocen_stanow"] = len(P.memo)
    log(f"    tryb {tryb}, ocen stanów {len(P.memo)}, {wynik['czas_s']} s")
    _CTX.pop(P.klucz, None)
    return wynik


def miejsca_zakresu(P, wyn_u, u_w, idx, stan_wezla, rekord_swiat, maks=12):
    """Miejsca (woksele 1 mm, łączone w skupiska 26-sąsiedztwa) z minimum < rejestr_miejsc_mm."""
    uu, gdzie = np.unique(u_w, return_index=True)
    K, D, PA, PB, RO, Z, U = [], [], [], [], [], [], []
    for u, g in zip(uu, gdzie):
        m = wyn_u[u]["miejsca"]
        if m is None:
            continue
        K.append(m[0]); D.append(m[1]); PA.append(m[2]); PB.append(m[3]); RO.append(m[4]); Z.append(m[5])
        U.append(np.full(len(m[0]), g, np.int64))
    if not K:
        return []
    K, D, PA, PB, RO, Z, U = (np.concatenate(x) for x in (K, D, PA, PB, RO, Z, U))
    kolej = np.lexsort((D, K))
    K = K[kolej]
    pierw = kolej[np.concatenate([[True], K[1:] != K[:-1]])]
    K, D, PA, PB, RO, Z, U = K[np.concatenate([[True], K[1:] != K[:-1]])], D[pierw], PA[pierw], PB[pierw], RO[pierw], Z[pierw], U[pierw]
    # skupiska
    v = np.stack([(K >> 22) & 2047, (K >> 11) & 2047, K & 2047], 1)
    zbior = {tuple(x): i for i, x in enumerate(v.tolist())}
    etyk = -np.ones(len(K), np.int64)
    nr = 0
    for i in np.argsort(D):
        if etyk[i] >= 0:
            continue
        stos = [i]
        etyk[i] = nr
        while stos:
            j = stos.pop()
            x = v[j]
            for dx in (-1, 0, 1):
                for dy in (-1, 0, 1):
                    for dz in (-1, 0, 1):
                        k = zbior.get((x[0] + dx, x[1] + dy, x[2] + dz))
                        if k is not None and etyk[k] < 0:
                            etyk[k] = nr
                            stos.append(k)
        nr += 1
    wyn = []
    for e in range(nr):
        m = np.nonzero(etyk == e)[0]
        j = m[np.argmin(D[m])]
        st = stan_wezla(idx[U[j]])
        pA, pB = rekord_swiat((PA[j], PB[j], RO[j], Z[j]), st)
        dd = pB - pA
        dl = np.linalg.norm(dd)
        wyn.append({"min_mm": round(float(D[j]), 4), "stan": st, "punkt_A": [round(float(x), 2) for x in pA],
                    "punkt_B": [round(float(x), 2) for x in pB],
                    "kierunek": [round(float(x), 3) for x in (dd / dl)] if dl > 1e-9 else None,
                    "rodzaj": RODZAJ[int(RO[j])], "w_strefie": bool(Z[j]), "wokseli": int(len(m)),
                    "rozpietosc_ukl_B": [[round(float(x), 1) for x in (v[m].min(0) - 1024) * P.ctx["wox"]],
                                        [round(float(x), 1) for x in (v[m].max(0) - 1023) * P.ctx["wox"]]]})
    wyn.sort(key=lambda x: x["min_mm"])
    return wyn[:maks]


# ---------------------------------------------------------------- weryfikacja geometrii
def weryfikuj(cfg, siatki):
    wyn = []
    for w in cfg.get("weryfikacja_geometrii", []):
        S = siatki[w["czesc"]]
        V = S.V
        typ = w["typ"]
        r = {"czesc": w["czesc"], "typ": typ, "opis": w.get("opis", "")}
        if typ == "promienie":
            m = np.ones(len(V), bool)
            if "x_abs_max" in w:
                m &= np.abs(V[:, 0]) <= w["x_abs_max"]
            rr = _norm(V[m])
            tol = w.get("tol", 0.005)
            trafia = np.zeros(m.sum(), bool)
            for R in w["wartosci"]:
                trafia |= np.abs(rr - R) <= tol
            udz = float(trafia.mean())
            r.update({"udzial": round(udz, 5), "oczekiwany_min": w.get("min_udzial", 0.99),
                      "zakres_r": [round(float(rr.min()), 4), round(float(rr.max()), 4)],
                      "ok": udz >= w.get("min_udzial", 0.99)})
        elif typ == "kat_krawedzi":
            rr = _norm(V)
            m = np.abs(rr - w["promien"]) <= w.get("tol", 0.005)
            b = np.degrees(np.arctan2(V[m, 1], V[m, 2]))
            zak = [round(float(b.min()), 3), round(float(b.max()), 3)]
            r.update({"zmierzony": zak, "oczekiwany": w["oczekiwany"],
                      "ok": abs(zak[0] - w["oczekiwany"][0]) <= 0.05 and abs(zak[1] - w["oczekiwany"][1]) <= 0.05})
        elif typ == "kat_biegunowy_max":
            rr = _norm(V)
            m = np.abs(rr - w["promien"]) <= 0.005
            pol = float(np.degrees(np.arccos(np.clip(V[m, 2] / rr[m], -1, 1))).max())
            r.update({"zmierzony": round(pol, 3), "oczekiwany": w["oczekiwany"], "ok": abs(pol - w["oczekiwany"]) <= 0.05})
        elif typ == "os":
            ax = "xyz".index(w["os"])
            inne = [i for i in range(3) if i != ax]
            rho = np.hypot(V[:, inne[0]], V[:, inne[1]])
            m = np.abs(rho - w["promien"]) <= w.get("tol", 0.02)
            if "os_abs_min" in w:
                m &= np.abs(V[:, ax]) >= w["os_abs_min"]
            y, z = V[m, inne[0]], V[m, inne[1]]
            M = np.stack([2 * y, 2 * z, np.ones_like(y)], 1)
            sol, *_ = np.linalg.lstsq(M, y * y + z * z, rcond=None)
            R = math.sqrt(sol[2] + sol[0] ** 2 + sol[1] ** 2)
            off = math.hypot(sol[0], sol[1])
            zr = [round(float(V[m, ax].min()), 3), round(float(V[m, ax].max()), 3)]
            r.update({"wierzcholkow": int(m.sum()), "srodek_przesuniecie_mm": round(off, 4), "promien_dopasowany": round(R, 4),
                      "zakres_wzdluz_osi": zr, "oczekiwany_zakres": w.get("zakres"),
                      "ok": bool(m.sum() >= 6 and off <= 0.02 and abs(R - w["promien"]) <= 0.02 and
                                 (w.get("zakres") is None or (abs(zr[0] - w["zakres"][0]) <= 0.02 and abs(zr[1] - w["zakres"][1]) <= 0.02)))})
        else:
            r.update({"ok": False, "blad": "nieznany typ"})
        wyn.append(r)
    return wyn


# ---------------------------------------------------------------- przypadki kontrolne
def kontrole(cfg, czesci, siatki, log):
    wyn = []
    for k in cfg.get("kontrole", []):
        cz = {n: dict(c) for n, c in czesci.items()}
        for n, d in k.get("przesun", {}).items():
            cz[n]["przesun"] = d
        P = Para(cfg, {"a": k["para"][0], "b": k["para"][1], "strefy": k.get("strefy", [])}, cz, siatki, 1)
        P.przygotuj("blisko")
        rek = []
        for st in k["stany"]:
            stn = {v: np.array([float(st[v])]) for v in P.zm}
            R_, t_, _, _ = P.pozy_wzgl(stn, 1)
            w = ocen_stan(P.ctx, R_[0], t_[0])
            if not np.isfinite(w["d"]) and not w["kol"]:
                P.przygotuj("daleko")
                w = ocen_stan(P.ctx, R_[0], t_[0])
            rek.append((st, w))
        st, w = min(rek, key=lambda x: x[1]["d"])
        oc = k["oczekiwane"]
        ok = True
        if "min" in oc:
            ok &= abs(w["d"] - oc["min"]) <= oc["tol"]
        if "kolizja" in oc:
            ok &= bool(w["kol"]) == bool(oc["kolizja"])
        if "glebokosc" in oc:
            ok &= w["kol"] and abs(w.get("gl", 0) - oc["glebokosc"]) <= oc["tol"]
        r = {"nazwa": k["nazwa"], "para": k["para"], "przesun": k.get("przesun", {}), "stan": st,
             "wynik_min_mm": round(float(w["d"]), 4), "kolizja": bool(w["kol"]),
             "glebokosc_mm": round(float(w.get("gl", 0.0)), 4) if w["kol"] else None,
             "rodzaj_kolizji": w.get("kol_rodzaj"), "oczekiwane": oc, "ok": bool(ok)}
        log(f"  kontrola {k['nazwa']}: min {r['wynik_min_mm']} mm, kolizja {r['kolizja']}"
            f"{', głębokość ' + str(r['glebokosc_mm']) if r['kolizja'] else ''} → {'OK' if ok else 'BŁĄD'}")
        wyn.append(r)
        _CTX.pop(P.klucz, None)
    return wyn


# ---------------------------------------------------------------- testy jednostkowe
def _kostka(srodek, bok, R=np.eye(3)):
    v = np.array(list(itertools.product((-0.5, 0.5), repeat=3))) * bok
    # 12 trójkątów zewnętrznie zorientowanych
    f = [(0, 1, 3), (0, 3, 2), (4, 6, 7), (4, 7, 5), (0, 4, 5), (0, 5, 1),
         (2, 3, 7), (2, 7, 6), (0, 2, 6), (0, 6, 4), (1, 5, 7), (1, 7, 3)]
    v = v @ R.T + np.asarray(srodek, float)
    tri = np.array([[v[i], v[j], v[k]] for i, j, k in f])
    return tri


def testy():
    rng = np.random.default_rng(1)
    ok_all = True
    # 1. punkt–trójkąt wobec gęstego próbkowania
    n = 400
    a, b, c = rng.normal(size=(n, 3)), rng.normal(size=(n, 3)), rng.normal(size=(n, 3))
    p = rng.normal(size=(n, 3)) * 2
    d, q, _ = pkt_trojkat(p, a, b, c)
    u = rng.random((4000, 2))
    u = np.where(u.sum(1, keepdims=True) > 1, 1 - u, u)
    blad = []
    for i in range(n):
        s = a[i] + (b[i] - a[i]) * u[:, :1] + (c[i] - a[i]) * u[:, 1:]
        blad.append(np.min(np.linalg.norm(s - p[i], axis=1)) - d[i])
    blad = np.array(blad)
    t1 = blad.min() > -1e-9 and blad.max() < 0.08
    print(f"test punkt–trójkąt: próbki − dokładna ∈ [{blad.min():.2e}, {blad.max():.3f}] → {'OK' if t1 else 'BŁĄD'}")
    # 2. odcinek–odcinek
    p1, q1, p2, q2 = (rng.normal(size=(n, 3)) for _ in range(4))
    d, _, _ = odc_odc(p1, q1, p2, q2)
    s = np.linspace(0, 1, 401)
    blad = []
    for i in range(n):
        A_ = p1[i] + (q1[i] - p1[i]) * s[:, None]
        B_ = p2[i] + (q2[i] - p2[i]) * s[:, None]
        blad.append(np.min(np.linalg.norm(A_[:, None] - B_[None], axis=2)) - d[i])
    blad = np.array(blad)
    t2 = blad.min() > -1e-9 and blad.max() < 0.02
    print(f"test odcinek–odcinek: próbki − dokładna ∈ [{blad.min():.2e}, {blad.max():.4f}] → {'OK' if t2 else 'BŁĄD'}")
    # 3. kostki
    cfg = {"siatka": {"krok_deg": 0.5, "odciecie_mm": 2.0, "rejestr_miejsc_mm": 1.0}, "strefy": {}}
    Ry45 = Ry(np.radians(45.0))
    Rx45 = Rx(np.radians(45.0))
    h = 5 * math.sqrt(2)
    przyp = [
        ("ściana–ściana 0,3", _kostka((0, 0, 0), 10), _kostka((10.3, 0, 0), 10), 0.3, False),
        ("krawędź–krawędź 0,4 (krzyżujące się grzbiety)", _kostka((0, 0, 0), 10, Ry45), _kostka((0, 0, 2 * h + 0.4), 10, Rx45), 0.4, False),
        ("krawędzie wchodzą na 0,4 (przecięcie bez wierzchołka w środku)", _kostka((0, 0, 0), 10, Ry45), _kostka((0, 0, 2 * h - 0.4), 10, Rx45), None, True),
        ("kostka 2 w kostce 10 (zawieranie)", _kostka((0, 0, 0), 10), _kostka((0.5, 0.2, 0.1), 2), None, True),
        ("ściany wchodzą na 0,3", _kostka((0, 0, 0), 10), _kostka((9.7, 0.5, 0.5), 10), None, True),
    ]
    for nazwa, ta, tb, oczek, kol in przyp:
        sa, sb = Siatka("A", ta), Siatka("B", tb)
        P = Para(cfg, {"a": "A", "b": "B"}, {"A": {"ruch": {"typ": "stala"}}, "B": {"ruch": {"typ": "stala"}}},
                 {"A": sa, "B": sb}, 1)
        P.przygotuj("blisko")
        w = ocen_stan(P.ctx, np.eye(3), np.zeros(3))
        if not np.isfinite(w["d"]) and not w["kol"]:
            P.przygotuj("daleko")
            w = ocen_stan(P.ctx, np.eye(3), np.zeros(3))
        ok = bool(w["kol"]) == kol and (oczek is None or abs(w["d"] - oczek) < 1e-6)
        if nazwa.startswith("ściany wchodzą"):
            ok &= abs(w.get("gl", 0) - 0.3) < 1e-6
        ok_all &= ok
        print(f"test {nazwa}: d {w['d']:.6f}, kolizja {w['kol']} ({w.get('kol_rodzaj')}), "
              f"głębokość {w.get('gl', 0):.4f} → {'OK' if ok else 'BŁĄD'}")
        _CTX.pop(P.klucz, None)
    # 4. tryb daleki = tryb bliski na odległości < c
    sa, sb = Siatka("A", _kostka((0, 0, 0), 10, Ry45)), Siatka("B", _kostka((0, 0, 2 * h + 1.3), 10, Rx45))
    P = Para(cfg, {"a": "A", "b": "B"}, {"A": {"ruch": {"typ": "stala"}}, "B": {"ruch": {"typ": "stala"}}}, {"A": sa, "B": sb}, 1)
    P.przygotuj("blisko")
    w1 = ocen_stan(P.ctx, np.eye(3), np.zeros(3))
    P.przygotuj("daleko")
    w2 = ocen_stan(P.ctx, np.eye(3), np.zeros(3))
    t4 = abs(w1["d"] - 1.3) < 1e-6 and abs(w2["d"] - 1.3) < 1e-6
    ok_all &= t4
    print(f"test tryb bliski/daleki 1,3: {w1['d']:.6f} / {w2['d']:.6f} → {'OK' if t4 else 'BŁĄD'}")
    ok_all &= t1 and t2
    print("TESTY:", "OK" if ok_all else "BŁĄD")
    return ok_all


# ---------------------------------------------------------------- raport
def raport_txt(W):
    L = []
    a = L.append
    a("E6 – kontrola kolizji na siatkach z CAD dużego oka, z kinematyką ruchu (e6-siatki-ruch.py)")
    a(f"Data: {W['data']}; konfiguracja: {W['konfiguracja']}; siatki: {W['katalog_siatek']}")
    a(f"Czas obliczeń: {W['czas_s']} s, procesy: {W['procesy']}")
    a("")
    a("1. Siatki (po zespoleniu wierzchołków)")
    a(f"{'część':<16}{'trójk.':>8}{'wierz.':>8}{'kraw≠2':>7}{'orient':>7}{'objęt. mm3':>12}{'skład.':>7}  bbox min → max [mm]")
    for n, s in W["siatki"].items():
        a(f"{n:<16}{s['trojkaty']:>8}{s['wierzcholki']:>8}{s['krawedzie_nie_2_sciany']:>7}"
          f"{('OK' if s['krawedzie_skierowane_powtorzone'] == 0 else 'BŁĄD'):>7}{s['objetosc_mm3']:>12.1f}{s['skladowe']:>7}"
          f"  {s['bbox_min']} → {s['bbox_max']}" + ("   [pominięta: " + s['pominieta'] + "]" if s.get("pominieta") else ""))
    a("")
    a("2. Weryfikacja położenia geometrii (układ koncepcji v3.1)")
    for r in W["weryfikacja_geometrii"]:
        szcz = {k: v for k, v in r.items() if k not in ("czesc", "typ", "opis", "ok")}
        a(f"  [{'OK' if r['ok'] else 'NIE'}] {r['czesc']}: {r['opis']} – {szcz}")
    for u in W.get("uwagi_geometrii", []):
        a(f"  uwaga: {u}")
    a("")
    a("3. Kinematyka i siatka stanów")
    for k in W["kinematyka_opis"]:
        a(f"  - {k}")
    a("")
    a("4. Przypadki kontrolne (dowód wykrywania)")
    for r in W["kontrole"]:
        a(f"  [{'OK' if r['ok'] else 'BŁĄD'}] {r['nazwa']}: min {r['wynik_min_mm']} mm, kolizja {r['kolizja']}"
          + (f", głębokość {r['glebokosc_mm']} mm ({r['rodzaj_kolizji']})" if r['kolizja'] else "")
          + f"; oczekiwane {r['oczekiwane']}")
    a("")
    a("5. Minima par [mm] (po zagęszczeniu; „poza strefami” = bez styków zamierzonych przegubu osi)")
    nz = list(W["zakresy"].keys())
    a(f"{'para':<34}{'wym.':>6}" + "".join(f"{z:>18}" for z in nz) + "   wynik")
    for p in W["pary"]:
        wiersz = f"{p['a'] + ' – ' + p['b']:<34}{p['wymagany_mm']:>6.2f}"
        for z in nz:
            rz = p["zakresy"].get(z)
            if not rz:
                wiersz += f"{'—':>18}"
                continue
            v = rz["wszystko_po_zageszczeniu"]["min_mm"]
            vp = rz["poza_strefami_po_zageszczeniu"]["min_mm"]
            txt = (f"{v:.3f}" if v is not None else "—")
            if p["strefy"]:
                txt += f" / {vp:.3f}" if vp is not None else f" / ≥{W['siatka']['rejestr_miejsc_mm']}"
            wiersz += f"{txt:>18}"
        wiersz += "   " + p["werdykt"]
        a(wiersz)
    a("")
    a("6. Szczegóły par")
    for p in W["pary"]:
        a(f"--- {p['a']} – {p['b']}: zmienne {p['zmienne'] or '—'}; węzłów {p['wezly']}, póz względnych {p['pozy_unikalne']}, "
          f"ocen stanów {p['ocen_stanow']}, tryb {p['tryb']}, {p['czas_s']} s; wymagany {p['wymagany_mm']} mm"
          + (f"; strefy: {', '.join(p['strefy'])}" if p['strefy'] else "") + (f"; {p['uwaga']}" if p['uwaga'] else ""))
        for z, rz in p["zakresy"].items():
            for cel in ("wszystko", "poza_strefami"):
                if cel == "poza_strefami" and not p["strefy"]:
                    continue
                r = rz[cel + "_po_zageszczeniu"]
                g = rz[cel]
                if r["min_mm"] is None:
                    a(f"  {z:<16} {cel:<14} brak odległości < odcięcia ({p['odciecie_mm']} mm)")
                    continue
                a(f"  {z:<16} {cel:<14} min {r['min_mm']:.4f} (siatka {g['min_mm'] if g['min_mm'] is not None else '—'})"
                  f" przy {_fmt_stan(r['stan'])}; A {r.get('punkt_A')} B {r.get('punkt_B')}; {r.get('rodzaj', '')}; {r['zrodlo']}")
            a(f"  {z:<16} węzłów {rz['wezly']}, póz {rz['pozy']}; ograniczenie dolne w ciągłym zakresie (Lipschitz, ½ kroku "
              f"{rz['pol_kroku_lipschitz_mm']} mm): {rz['ograniczenie_dolne_ciagle_mm']} mm; węzłów z przenikaniem: {rz['kolizje_wezlow']}")
            if rz.get("kolizja_najglebsza"):
                k = rz["kolizja_najglebsza"]
                a(f"  {'':<16} PRZENIKANIE najgłębsze {k['glebokosc_mm']} mm przy {_fmt_stan(k['stan'])}, punkt {k['punkt']} ({k['rodzaj']})")
            for m in rz["miejsca"]:
                a(f"  {'':<16} miejsce {m['min_mm']:.3f} mm{' [strefa zamierzona]' if m['w_strefie'] else ''}: "
                  f"A {m['punkt_A']} B {m['punkt_B']}, kierunek {m['kierunek']}, {m['rodzaj']}, "
                  f"{_fmt_stan(m['stan'])}, wokseli {m['wokseli']}, obszar (ukł. B) {m['rozpietosc_ukl_B']}")
    a("")
    a("7. Ograniczenia metody")
    for o in W["ograniczenia"]:
        a(f"  - {o}")
    return "\n".join(L) + "\n"


OGRANICZENIA = [
    "Liczona jest odległość siatek trójkątnych z eksportu (tolerancja cięciwy eksportu ok. 0,01 mm), nie brył CAD: "
    "wklęsła czasza powieki ma ściany o strzałkę bliżej osi, wypukła gałka – o strzałkę dalej, więc współśrodkowa szczelina 1,2 wychodzi ok. 1,19.",
    "Odległość jest dokładna dla siatek (wierzchołek–ściana w obie strony + krawędź–krawędź, bez próbkowania), "
    "ale tylko poniżej odcięcia c; powyżej działa tryb daleki (klastry 4 mm, gałęzie i granice, też dokładny).",
    "Stany: krata co krok_deg (0,5° = 0,288 mm na R33; na rancie powieki R34,7: 0,303 mm), z kotwicą w położeniu modelu; "
    "brzegi zakresu mechanicznego, które nie leżą na kracie, są pokryte z dokładnością ≤ ½ kroku i liczone dokładnie w narożnikach; "
    "zagęszczenie to lokalne przeszukiwanie wzorcem od 3 najlepszych węzłów, nie pełna krata 0,05 mm. "
    "Ograniczenie dolne w ciągłym zakresie = minimum węzłów − L·½ kroku (L z obrotu wokół początku).",
    "Zakres „praca” to pełny iloczyn (G do otwG + podążanie przy każdym θ – nadzbiór); „praca_podazanie” "
    "sprawdza warunek podążania z koncepcji pkt 6. Zakres mechaniczny gałki to prostokąt ψ ±28,05 × θ ±18,12 "
    "(obwiednia granicy okna z koncepcji pkt 4) – nadzbiór rzeczywistego okna.",
    "Przenikanie: przecięcie powierzchni – test odcinek–trójkąt (Möller–Trumbore) dla wszystkich krawędzi obu siatek "
    "w pobliżu drugiej; zawieranie bez przecięcia – parzystość promienia z jednego wierzchołka każdej składowej "
    "(3 kierunki, większość głosów), tylko gdy obwiednia mieści się w obwiedni drugiej części. Głębokość = największa "
    "odległość wierzchołka leżącego w drugiej bryle od jej powierzchni (znak z pseudonormalnych, wymaga siatek "
    "zamkniętych i zgodnie zorientowanych – sprawdzone w pkt 1); głębokość większa niż c jest obcięta do c. "
    "Styk ściana–ściana współpłaszczyznowy daje odległość 0, ale może nie dać flagi przecięcia.",
    "Tryb daleki nie testuje przecięcia osobno: przy odległości > największy promień wpisany trójkąta obu siatek "
    "przecięcie jest niemożliwe (krawędź przebijająca trójkąt ma do jego brzegu ≤ promień wpisany).",
    "Strefy zamierzone (np. luz osiowy ucha powieki na osi M3) klasyfikuje się po położeniu środka odcinka "
    "najbliższych punktów (w układzie części B) i kierunku szczeliny; minimum „poza strefami” jest dokładne, "
    "gdy < rejestr_miejsc_mm, inaczej podawane jako ≥ tej wartości.",
    "Śruby, kable, serwa, Płyta i części etapu 2 nie są w modelu; siatki etapu 1 to „baza” (bez wycięć gałki, "
    "zaczepów, przycięcia kącików powiek), więc wynik dotyczy tylko tych brył.",
]


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("konfiguracja", nargs="?")
    ap.add_argument("--wynik", default=None, help="prefiks plików wyniku (bez rozszerzenia)")
    ap.add_argument("--siatki", default=None, help="katalog STL (zamiast katalog_siatek z JSON)")
    ap.add_argument("--procesy", type=int, default=max(1, (os.cpu_count() or 2) - 1))
    ap.add_argument("--pary", default=None, help="tylko pary o numerach, np. 1,3")
    ap.add_argument("--test", action="store_true", help="testy jednostkowe jąder i przypadków kostek")
    arg = ap.parse_args()
    if arg.test:
        sys.exit(0 if testy() else 1)
    if not arg.konfiguracja:
        ap.error("podaj plik konfiguracji JSON albo --test")
    t0 = time.time()
    with open(arg.konfiguracja, encoding="utf-8") as f:
        cfg = json.load(f)
    baza = os.path.dirname(os.path.abspath(arg.konfiguracja))
    kat = arg.siatki or os.path.normpath(os.path.join(baza, cfg["katalog_siatek"]))
    prefiks = arg.wynik or os.path.join(baza, cfg.get("wynik", "e6-siatki-ruch-wynik"))
    if not os.path.isabs(prefiks) and arg.wynik:
        prefiks = os.path.abspath(prefiks)

    def log(x):
        print(x, flush=True)
    s = cfg["siatka"]
    krok_mm = math.radians(s["krok_deg"]) * s["R_ref"]
    if krok_mm > s["krok_mm_max"] + 1e-9:
        sys.exit(f"krok_deg {s['krok_deg']} daje {krok_mm:.3f} mm na R{s['R_ref']} > {s['krok_mm_max']} mm")
    czesci = cfg["czesci"]
    siatki = {}
    opis_siatek = {}
    for n, c in czesci.items():
        tri, fmt = wczytaj_stl(os.path.join(kat, c["plik"]))
        S = Siatka(n, tri, s["odcinek_krawedzi_mm"], fmt)
        siatki[n] = S
        opis_siatek[n] = S.opis()
        if c.get("pomin"):
            opis_siatek[n]["pominieta"] = c["pomin"]
        log(f"siatka {n}: {opis_siatek[n]['trojkaty']} trójkątów, krawędzie≠2 {S.kraw_nie2}, "
            f"objętość {S.objetosc:.1f} mm3, składowe {opis_siatek[n]['skladowe']}")
    wer = weryfikuj(cfg, siatki)
    for r in wer:
        log(f"weryfikacja [{'OK' if r['ok'] else 'NIE'}] {r['czesc']}: {r['opis']}")
    log("przypadki kontrolne:")
    kon = kontrole(cfg, czesci, siatki, log)
    log("pary:")
    pary = []
    wybor = None if not arg.pary else {int(x) for x in arg.pary.split(",")}
    for i, op in enumerate(cfg["pary"], 1):
        if wybor and i not in wybor:
            continue
        w = analizuj_pare(cfg, op, czesci, siatki, arg.procesy, log)
        # werdykt
        zle = []
        for nz, rz in w["zakresy"].items():
            r = rz["poza_strefami_po_zageszczeniu"]
            v = r["min_mm"]
            if v is not None and v < w["wymagany_mm"]:
                zle.append(f"{nz}: {v:.3f} < {w['wymagany_mm']}")
            for m in rz["miejsca"]:
                if m["w_strefie"]:
                    wym = min(cfg["strefy"][s_]["wymagany"] for s_ in w["strefy"])
                    if m["min_mm"] < wym:
                        zle.append(f"{nz}: strefa {m['min_mm']:.3f} < {wym}")
            if rz["kolizje_wezlow"]:
                zle.append(f"{nz}: przenikanie w {rz['kolizje_wezlow']} węzłach")
        w["werdykt"] = "OK" if not zle else "PONIŻEJ: " + "; ".join(dict.fromkeys(zle))
        pary.append(w)
    kin = [
        "Układ: x prawo, y góra, z na zewnątrz dyni, początek = środek kuli i krzyżaka (koncepcja v3.1); siatki w mm, układ Onshape = układ koncepcji.",
        "Gałka: R = Rx(−θ)·Ry(ψ) wokół początku; ψ+ = spojrzenie w prawo, θ+ = w górę (koncepcja v3.1, układ współrzędnych).",
        "Powieki: obrót wokół osi X; G, D = kąt krawędzi przedniej od +z ku +y [°] (jak zamkG/otwG/zamkD/otwD); "
        "R = Rx(−(kąt − kąt modelu)); siatki wyeksportowane w położeniu zamkniętym: G −8,5°, D −11,5°.",
        f"Krata stanów: co {s['krok_deg']}° ({krok_mm:.3f} mm na R{s['R_ref']}), kotwice ψ 0, θ 0, G −8,5, D −11,5; "
        f"zagęszczenie do {math.degrees(s['zageszczenie_mm'] / s['R_ref']):.4f}° ({s['zageszczenie_mm']} mm na R{s['R_ref']}).",
        "Każda para liczona na rzucie pełnego iloczynu ψ × θ × G × D na swoje zmienne (pozostałe zmienne nie zmieniają pary, więc to jest dokładnie równoważne pełnemu iloczynowi); "
        "stany o tej samej pozie względnej A→B liczone raz (np. Gałka – Powieka: zależy tylko od ψ i θ − ΔG).",
        "Zakresy: " + "; ".join(f"{n}: " + ", ".join(f"{v} {z[v]}" for v in KOLEJNOSC_ZMIENNYCH if v in z)
                                + (" + podążanie (G ≤ otwG + podazanie·max(θ,0)/zakresTheta, D ≥ otwD − podazanie·max(−θ,0)/zakresTheta)" if z.get("podazanie") else "")
                                for n, z in cfg["zakresy"].items()),
        f"Odcięcie dokładnej odległości c = {s['odciecie_mm']} mm (poniżej wszystko dokładnie), rejestr miejsc < {s['rejestr_miejsc_mm']} mm w wokselach {s.get('woksel_miejsc_mm', 1.0)} mm.",
    ]
    W = {"data": time.strftime("%Y-%m-%d %H:%M"), "konfiguracja": os.path.relpath(arg.konfiguracja),
         "katalog_siatek": os.path.relpath(kat), "procesy": arg.procesy, "siatki": opis_siatek,
         "weryfikacja_geometrii": wer, "uwagi_geometrii": cfg.get("uwagi_geometrii", []),
         "kinematyka_opis": kin, "siatka": s, "zakresy": cfg["zakresy"], "kontrole": kon, "pary": pary,
         "ograniczenia": OGRANICZENIA, "czas_s": round(time.time() - t0, 1)}
    with open(prefiks + ".json", "w", encoding="utf-8") as f:
        json.dump(W, f, ensure_ascii=False, indent=1, default=lambda o: o.tolist() if hasattr(o, "tolist") else str(o))
    with open(prefiks + ".txt", "w", encoding="utf-8") as f:
        f.write(raport_txt(W))
    log(f"zapisano {prefiks}.json i {prefiks}.txt ({W['czas_s']} s)")


if __name__ == "__main__":
    main()
