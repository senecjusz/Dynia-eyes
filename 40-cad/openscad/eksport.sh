#!/usr/bin/env bash
# Eksport części dużego oka v2: 3MF w orientacji do druku (40-cad/3mf/Duze oko v2/) i STL w położeniu złożenia (do kontroli kolizji).
# Użycie: bash eksport.sh [katalog_stl] [czesc ...]
set -u
OS="${OPENSCAD:-/c/Program Files/OpenSCAD/openscad.com}"
cd "$(dirname "$0")"
STL="${1:-./stl-zlozenie}"; shift || true
mkdir -p "../3mf/Duze oko v2" "$STL"
declare -A NAZWA=([galka]="Galka" [powieka_gorna]="Powieka gorna" [powieka_dolna]="Powieka dolna" [pierscien]="Pierscien" [maskownica]="Maskownica" [uchwyt]="Uchwyt serw" [probka]="Probka drutu")
CZ=("$@"); [ ${#CZ[@]} -eq 0 ] && CZ=(probka galka powieka_gorna powieka_dolna pierscien maskownica uchwyt)
for c in "${CZ[@]}"; do
  t0=$(date +%s)
  timeout 1800 "$OS" -o "../3mf/Duze oko v2/${NAZWA[$c]}.3mf" -D "czesc=\"$c\"" -D 'tryb="druk"' duze-oko-v2.scad > "$STL/$c-druk.log" 2>&1 || echo "BLAD $c druk"
  [ "$c" != probka ] && { timeout 1800 "$OS" -o "$STL/$c.stl" -D "czesc=\"$c\"" -D 'tryb="zlozenie"' duze-oko-v2.scad > "$STL/$c-zl.log" 2>&1 || echo "BLAD $c zlozenie"; }
  echo "$c $(( $(date +%s) - t0 )) s"
done
