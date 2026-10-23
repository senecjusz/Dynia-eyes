#!/usr/bin/env bash
# Odtworzenie wyników koncepcji v3.1 od zera (bez scratchpada). Czas: okno ok. 10 min, przemiatanie ok. 25 min (10 rdzeni).
set -euo pipefail
cd "$(dirname "$0")"
timeout 3600 python3 okno.py                                  # okno.json, okno_splajn.npy
timeout 7200 python3 przemiatanie.py | tee przemiatanie.txt   # przemiatanie.json + listy 10 minimów
timeout 7200 python3 b1_akceptacja.py b1_odniesienie.json | tee b1_odniesienie.txt
