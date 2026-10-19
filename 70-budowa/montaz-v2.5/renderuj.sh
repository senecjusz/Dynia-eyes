#!/usr/bin/env bash
# Rendery instrukcji montażu v2.5 jednym poleceniem (po każdym nowym eksporcie 3MF).
#   bash 70-budowa/montaz-v2.5/renderuj.sh            # wszystkie kroki, pełna jakość
#   bash 70-budowa/montaz-v2.5/renderuj.sh --szybko   # podgląd 800×600
#   bash 70-budowa/montaz-v2.5/renderuj.sh 03 07      # tylko wybrane kroki (prefiks nazwy)
# Pliki pośrednie (STL) w $MONTAZ_TMP (domyślnie ${TMPDIR:-/tmp}/montaz-v2.5).
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "$HERE/../.." && pwd)"
TMPD="${MONTAZ_TMP:-${TMPDIR:-/tmp}/montaz-v2.5}"
V25="$REPO/40-cad/3mf/Oko F v2.5"
V24="$REPO/40-cad/3mf/Oko F v2.4"
command -v blender >/dev/null || { echo "Brak blendera w PATH" >&2; exit 1; }
python3 -I "$HERE/3mf_do_stl.py" -o "$TMPD/stl" \
  "$V25"/*.3mf \
  "$V24/Oko F v2.4 - PODGLAD pileczka 40.5.3mf" \
  "$V24/Oko F v2.4 - PODGLAD SG90.3mf" \
  "$V24/Oko F v2.4 - PODGLAD orczyk SG90.3mf" \
  "$V24/Oko F v2.4 - Przyrzad centrowania orczyka.3mf" \
  "$V24/Oko F v2.4 - Przyrzad do wklejania pileczki.3mf"
timeout 3600 blender -b --factory-startup -noaudio -P "$HERE/renderuj.py" -- "$TMPD/stl" "$HERE" "$@" \
  2>&1 | grep -E "ZAPISANO|wczytano|Error|Traceback|błąd" || true
ls -1 "$HERE"/*.png
