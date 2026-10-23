#!/usr/bin/env python3
"""Generuje strona_html.h ze strona/index.html: plik skompresowany gzip jako tablica bajtów w pamięci flash.

Użycie (z dowolnego katalogu):  python3 50-elektronika/dynia/zrob_strone.py
Potem zwykła kompilacja szkicu. Serwer wysyła stronę z nagłówkiem Content-Encoding: gzip.
"""
import gzip
import pathlib

KATALOG = pathlib.Path(__file__).resolve().parent
ZRODLO = KATALOG / "strona" / "index.html"
CEL = KATALOG / "strona_html.h"


def main():
    html = ZRODLO.read_bytes()
    gz = gzip.compress(html, compresslevel=9, mtime=0)   # mtime=0: ten sam wynik przy tym samym źródle
    wiersze = []
    for i in range(0, len(gz), 20):
        wiersze.append("  " + ", ".join(f"0x{b:02x}" for b in gz[i:i + 20]) + ",")
    tekst = (
        "// PLIK GENEROWANY przez zrob_strone.py ze strona/index.html – nie edytuj ręcznie.\n"
        f"// Źródło: {len(html)} B, gzip: {len(gz)} B.\n"
        "#pragma once\n"
        "#include <Arduino.h>\n\n"
        f"const size_t STRONA_GZ_LEN = {len(gz)};\n"
        "const uint8_t STRONA_GZ[] PROGMEM = {\n"
        + "\n".join(wiersze)
        + "\n};\n"
    )
    CEL.write_text(tekst, encoding="utf-8")
    print(f"{CEL.name}: źródło {len(html)} B, gzip {len(gz)} B")


if __name__ == "__main__":
    main()
