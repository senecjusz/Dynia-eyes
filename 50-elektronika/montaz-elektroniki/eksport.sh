#!/usr/bin/env bash
# Eksport grup modelu elementy.scad do STL i kontrola kolizji. Użycie: bash eksport.sh <katalog roboczy> [ref tacki, domyślnie 8a07059]
set -euo pipefail
cd "$(dirname "$0")"; TU=$(pwd); W=${1:?katalog roboczy}; REF=${2:-8a07059}
mkdir -p "$W/stl"
git show "$REF:40-cad/openscad/podstawka.scad" > "$W/podstawka.scad"
cp "$TU/elementy.scad" "$W/"
GRUPY="tacka sufit pca pcaListwy zacisk podkladki esp espPiny espWtyki gniazdo wtykCC zasilCzerw zasilCzarny esp5V espG espI2C espPCAwtyki kondensator kondWtyki pirVCC pirGND pirOUT pirWtyki przycisk przyciskGND przyciskSyg przyciskWtyk zapasESP skL skP skD skZyly skWtyki rezystor"
for g in $GRUPY; do timeout 600 openscad -q -o "$W/stl/$g.stl" -D "grupa=\"$g\"" "$W/elementy.scad" & done; wait
for k in kolizjaTacka kolizjaSufit kolizjaRezystor; do
  if timeout 600 openscad -o "$W/$k.stl" -D "grupa=\"$k\"" "$W/elementy.scad" 2>"$W/$k.log"; then echo "$k: PRZECIĘCIE (plik $W/$k.stl)"; else grep -q "top level object is empty" "$W/$k.log" && echo "$k: brak kolizji" || { echo "$k: błąd"; cat "$W/$k.log"; }; fi
done
