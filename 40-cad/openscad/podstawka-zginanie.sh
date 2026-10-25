#!/usr/bin/env bash
# Test zginania podstawki: dla każdego wariantu zmiennych bazowych eksport części, kontrola siatek i wymiarów wobec oczekiwanych.
# Użycie: bash podstawka-zginanie.sh <katalog_roboczy> "wtyk=30" "hDoc=60" ...   (części: zmienna CZESCI, domyślnie szybkie)
set -u -o pipefail
cd "$(dirname "$0")"
ROB="$1"; shift
CZ="${CZESCI:-Szuflada SzufladaL SzufladaP Kaseta}"
for w in "$@"; do
  d="$ROB/$(echo "$w" | tr '=. ' '__-')"; rm -rf "$d"; mkdir -p "$d"
  ZM=""; for z in $w; do ZM="$ZM -D $z"; done
  ZMIENNE="$ZM" OUT3MF="$d" bash podstawka-eksport.sh $CZ > "$d/eksport.txt" 2>&1
  echo "=== wariant: $w  $(sed -n 's/.*"SZ":\([^,]*\),"DL":\([^,]*\),.*"tulH":\([^,]*\),.*/SZ \1 DL \2 tulH \3/p' "$d/parametry.json")"
  grep -E "^BLAD|OK$|błęd|brył" "$d/eksport.txt" | sort | uniq -c | sed 's/^ */  /'
  node ../narzedzia/podstawka-wymiary.js "$d" "$d/parametry.json" | sed 's/^/  /'
done
