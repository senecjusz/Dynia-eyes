#!/usr/bin/env bash
# Odtworzenie wyników koncepcji v3.2 od zera (bez scratchpada), 10 rdzeni.
# Nadpisuje: okno.json, okno_splajn.npy, przemiatanie.json/.txt, stale_pary.txt, kinematyka.json, przeguby_odniesienie_wynik.json.
set -euo pipefail
cd "$(dirname "$0")"
timeout 3600  python3 okno.py                                         # okno.json, okno_splajn.npy (nie zależy od przegubów)
timeout 14400 python3 przemiatanie.py | tee przemiatanie.txt          # przemiatanie.json (ze skrótem parametrów) + listy 10 minimów
timeout 1800  python3 stale_pary.py | tee stale_pary.txt              # pary stałe–stałe, tabela słupków stopu do CAD
timeout 1800  python3 kinematyka.py > kinematyka.json                 # zakresy serw, kąty przegubów, momenty, stałe IK
timeout 14400 python3 przeguby_akceptacja.py przeguby_odniesienie.json --uzyj | tee przeguby_odniesienie.txt
