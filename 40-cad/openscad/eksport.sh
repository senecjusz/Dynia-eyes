#!/usr/bin/env bash
# Eksport dużego oka v2: 3MF każdej części w orientacji do druku + 3MF zbiorczy z osobnymi obiektami (40-cad/3mf/Duze oko v2/),
# STL każdej części w położeniu złożenia (do kontroli kolizji, katalog podany jako 1. argument).
# Równolegle do 3 procesów OpenSCAD. Użycie: bash eksport.sh [katalog_stl] [Czesc ...]
# Zmienne środowiska: ZMIENNE="-D Rg=31 -D scianka=50" (test zginania), OUT3MF=<katalog> (zamiast 40-cad/3mf/Duze oko v2).
# W katalogu STL powstaje parametry.json (echo z SCAD) dla duze-oko-kinematyka.js i duze-oko-kolizje.js.
set -u
OS="${OPENSCAD:-/c/Program Files/OpenSCAD/openscad.com}"
cd "$(dirname "$0")"
STL="${1:-./stl-zlozenie}"; shift || true
OUT="${OUT3MF:-../3mf/Duze oko v2}"
read -r -a ZM <<< "${ZMIENNE:-}"
mkdir -p "$OUT" "$STL"
declare -A PLIK=([Galka]="Galka" [PowiekaGorna]="Powieka gorna" [PowiekaDolna]="Powieka dolna" [Pierscien]="Pierscien" [Maskownica]="Maskownica" [UchwytSerw]="Uchwyt serw" [ProbkaDrutu]="Probka drutu" [PrzedluzenieOrczyka]="Przedluzenie orczyka x2")
CZ=("$@"); [ ${#CZ[@]} -eq 0 ] && CZ=(Galka PowiekaGorna PowiekaDolna Pierscien Maskownica UchwytSerw ProbkaDrutu PrzedluzenieOrczyka)
timeout 120 "$OS" -o "$STL/parametry.echo" "${ZM[@]}" -D 'czesc="parametry"' duze-oko-v2.scad > /dev/null 2>&1
sed -n 's/^ECHO: "PARAMETRY\(.*\)"$/\1/p' "$STL/parametry.echo" > "$STL/parametry.json"
jedna() { local c=$1 t0=$(date +%s)
  timeout 3600 "$OS" -o "$OUT/${PLIK[$c]}.3mf" "${ZM[@]}" -D "czesc=\"$c\"" -D 'tryb="druk"' duze-oko-v2.scad > "$STL/$c-druk.log" 2>&1 || echo "BLAD $c druk"
  if [ "$c" != ProbkaDrutu ] && [ "$c" != PrzedluzenieOrczyka ]; then
    timeout 3600 "$OS" -o "$STL/$c.stl" "${ZM[@]}" -D "czesc=\"$c\"" -D 'tryb="zlozenie"' duze-oko-v2.scad > "$STL/$c-zl.log" 2>&1 || echo "BLAD $c zlozenie"; fi
  echo "$c $(( $(date +%s) - t0 )) s"; }
n=0; for c in "${CZ[@]}"; do jedna "$c" & n=$((n + 1)); [ $((n % 3)) -eq 0 ] && wait; done; wait
# kontrola siatek; przy błędzie naprawa (CGAL zostawia pojedyncze zdegenerowane trójkąty) i ponowna kontrola; liczba brył
N=../narzedzia
for c in "${CZ[@]}"; do f="$OUT/${PLIK[$c]}.3mf"
  node $N/sprawdz_siatki.js "$f" || { node $N/napraw_siatki.js "$f" "$STL/naprawa.3mf" && node $N/sprawdz_siatki.js "$STL/naprawa.3mf" && cp "$STL/naprawa.3mf" "$f"; }
  node $N/skladowe_siatki.js "$f"; done
# zbiorczy: osobne, nazwane obiekty z pojedynczych 3MF (tylko przy pełnym eksporcie)
if [ $# -eq 0 ]; then node $N/zbiorczy_3mf.js "$OUT/Duze oko v2 - wszystkie czesci.3mf" 10 "$OUT/Galka.3mf" "$OUT/Powieka gorna.3mf" "$OUT/Powieka dolna.3mf"   "$OUT/Pierscien.3mf" "$OUT/Maskownica.3mf" "$OUT/Uchwyt serw.3mf" "$OUT/Probka drutu.3mf" "$OUT/Przedluzenie orczyka x2.3mf"; node $N/sprawdz_siatki.js "$OUT/Duze oko v2 - wszystkie czesci.3mf"; fi
echo KONIEC
