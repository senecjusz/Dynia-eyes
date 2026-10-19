#!/usr/bin/env bash
# Rendery instrukcji montażu v2.5 jednym poleceniem (po każdym nowym eksporcie 3MF).
#   bash 70-budowa/montaz-v2.5/renderuj.sh                 # wszystkie kroki + części i galerie, pełna jakość
#   bash 70-budowa/montaz-v2.5/renderuj.sh --szybko        # to samo, podgląd (mniejsze obrazki)
#   bash 70-budowa/montaz-v2.5/renderuj.sh 03 07           # tylko wybrane kroki (prefiks nazwy)
#   bash 70-budowa/montaz-v2.5/renderuj.sh --czesci        # tylko części z podpisami i galerie
#   bash 70-budowa/montaz-v2.5/renderuj.sh --czesci czesc_jarzmo min_J   # wybrane części / miniatury
# Pliki pośrednie (STL, surowe rendery części) w $MONTAZ_TMP (domyślnie ${TMPDIR:-/tmp}/montaz-v2.5).
# Podpisy na częściach dokłada podpisz.py (SVG -> PNG, potrzebny rsvg-convert).
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "$HERE/../.." && pwd)"
TMPD="${MONTAZ_TMP:-${TMPDIR:-/tmp}/montaz-v2.5}"
V25="$REPO/40-cad/3mf/Oko F v2.5"
V24="$REPO/40-cad/3mf/Oko F v2.4"
command -v blender >/dev/null || { echo "Brak blendera w PATH" >&2; exit 1; }
command -v rsvg-convert >/dev/null || { echo "Brak rsvg-convert w PATH (podpisy części)" >&2; exit 1; }
python3 -I "$HERE/3mf_do_stl.py" -o "$TMPD/stl" \
  "$V25"/*.3mf \
  "$V24/Oko F v2.4 - PODGLAD pileczka 40.5.3mf" \
  "$V24/Oko F v2.4 - PODGLAD SG90.3mf" \
  "$V24/Oko F v2.4 - PODGLAD orczyk SG90.3mf" \
  "$V24/Oko F v2.4 - Przyrzad centrowania orczyka.3mf" \
  "$V24/Oko F v2.4 - Przyrzad do wklejania pileczki.3mf" \
  "$V24/Oko F v2.4 - Widelec do zaczepow.3mf"

kroki=1; czesci=1; opcje=(); wybrane=()
for a in "$@"; do
  case "$a" in
    --czesci) kroki=0 ;;
    --*) opcje+=("$a") ;;
    *) wybrane+=("$a") ;;
  esac
done
[[ $kroki == 1 && ${#wybrane[@]} -gt 0 ]] && czesci=0

if [[ $kroki == 1 ]]; then
  timeout 3600 blender -b --factory-startup -noaudio -P "$HERE/renderuj.py" -- "$TMPD/stl" "$HERE" \
    ${opcje[@]+"${opcje[@]}"} ${wybrane[@]+"${wybrane[@]}"} 2>&1 | grep -E "ZAPISANO|wczytano|Error|Traceback|błąd" || true
fi
if [[ $czesci == 1 ]]; then
  rm -f "$TMPD/czesci"/czesc_*.json
  timeout 3600 blender -b --factory-startup -noaudio -P "$HERE/renderuj.py" -- "$TMPD/stl" "$TMPD/czesci" --czesci \
    ${opcje[@]+"${opcje[@]}"} ${wybrane[@]+"${wybrane[@]}"} 2>&1 | grep -E "ZAPISANO|ZASŁONIĘTA|Error|Traceback|błąd" || true
  timeout 600 python3 -I "$HERE/podpisz.py" "$TMPD/czesci" "$HERE"
fi
ls -1 "$HERE"/*.png
