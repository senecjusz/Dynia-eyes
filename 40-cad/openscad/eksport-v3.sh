#!/usr/bin/env bash
# Eksport dużego oka v3: 3MF każdej części w orientacji do druku (40-cad/3mf/Duze oko v3/), kontrola siatek
# (sprawdz_siatki.js: 0 błędów, skladowe_siatki.js: 1 bryła), 3MF zbiorczy oraz STL części w położeniu złożenia
# (do przemiatania kolizji i renderu w Blenderze) z parametry.json.
# Użycie: bash eksport-v3.sh [katalog_stl_zlozenia=./stl-zlozenie-v3]
set -u
OS="${OPENSCAD:-openscad}"
cd "$(dirname "$0")"
STL="${1:-./stl-zlozenie-v3}"
OUT="../3mf/Duze oko v3"
mkdir -p "$OUT" "$STL"
declare -A PLIK=([Plyta]="Plyta" [Galka]="Galka" [PowiekaGorna]="Powieka gorna" [PowiekaDolna]="Powieka dolna"
  [PrzedluzenieOrczyka]="Przedluzenie orczyka (druk x2)" [Tuba30]="Tuba 30" [Tuba40]="Tuba 40" [Tuba50]="Tuba 50" [Maskownica]="Maskownica" [ProbkaZaczepu]="Probka zaczepu galki" [PodporaPlyty]="Podpora plyty (druk 45)")
CZ=(Plyta Galka PowiekaGorna PowiekaDolna PrzedluzenieOrczyka Tuba30 Tuba40 Tuba50 Maskownica ProbkaZaczepu PodporaPlyty)
timeout 120 "$OS" -o "$STL/parametry.echo" -D 'czesc="parametry"' duze-oko-v3.scad > /dev/null 2>&1
sed -n 's/^ECHO: "PARAMETRY\(.*\)"$/\1/p' "$STL/parametry.echo" > "$STL/parametry.json"
jedna() { local c=$1
  timeout 1800 "$OS" -o "$OUT/${PLIK[$c]}.3mf" -D "czesc=\"$c\"" -D 'tryb="druk"' duze-oko-v3.scad > "$STL/$c-druk.log" 2>&1 || echo "BLAD $c druk"
  timeout 1800 "$OS" -o "$STL/$c.stl" -D "czesc=\"$c\"" -D 'tryb="zlozenie"' duze-oko-v3.scad > "$STL/$c-zl.log" 2>&1 || echo "BLAD $c zlozenie"; }
for c in "${CZ[@]}"; do jedna "$c" & done; wait
N=../narzedzia
for c in "${CZ[@]}"; do f="$OUT/${PLIK[$c]}.3mf"
  node $N/sprawdz_siatki.js "$f" || { node $N/napraw_siatki.js "$f" "$STL/naprawa.3mf" && node $N/sprawdz_siatki.js "$STL/naprawa.3mf" && cp "$STL/naprawa.3mf" "$f"; }
  node $N/skladowe_siatki.js "$f"; done
args=(); for c in "${CZ[@]}"; do args+=("$OUT/${PLIK[$c]}.3mf"); done
node $N/zbiorczy_3mf.js "$OUT/Duze oko v3 - wszystkie czesci.3mf" 10 "${args[@]}"
node $N/sprawdz_siatki.js "$OUT/Duze oko v3 - wszystkie czesci.3mf"
# płyta pod 45° z projektowaną podporą: dwa obiekty w położeniu na stole (podpora tylko łącznikami w płycie)
timeout 1800 "$OS" -o "$STL/Plyta (druk 45).3mf" -D 'czesc="PlytaDruk45"' -D 'tryb="druk"' duze-oko-v3.scad > "$STL/PlytaDruk45.log" 2>&1
node $N/sprawdz_siatki.js "$STL/Plyta (druk 45).3mf" || { node $N/napraw_siatki.js "$STL/Plyta (druk 45).3mf" "$STL/naprawa.3mf" && cp "$STL/naprawa.3mf" "$STL/Plyta (druk 45).3mf"; }
node $N/zbiorczy_3mf.js "$OUT/Plyta + podpora (druk 45).3mf" bez "$STL/Plyta (druk 45).3mf" "$OUT/Podpora plyty (druk 45).3mf"
node $N/sprawdz_siatki.js "$OUT/Plyta + podpora (druk 45).3mf"; node $N/skladowe_siatki.js "$OUT/Plyta + podpora (druk 45).3mf"
echo KONIEC
