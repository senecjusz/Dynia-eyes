#!/usr/bin/env bash
# Eksport podstawki: 3MF każdej części drukowanej (40-cad/3mf/Podstawka v2/), kontrola siatek, liczba brył, wymiary wobec parametrów.
# Użycie: bash podstawka-eksport.sh [Czesc ...]
# Zmienne środowiska: ZMIENNE="-D wtyk=30 -D hDoc=60" (test zginania), OUT3MF=<katalog> (zamiast 40-cad/3mf/Podstawka v2),
#   OPENSCAD=<program> (domyślnie openscad z PATH, a bez niego Windows).
set -u
OS="${OPENSCAD:-$(command -v openscad || echo "/c/Program Files/OpenSCAD/openscad.com")}"
cd "$(dirname "$0")"
OUT="${OUT3MF:-../3mf/Podstawka v2}"
read -r -a ZM <<< "${ZMIENNE:-}"
mkdir -p "$OUT"
declare -A PLIK=([Korpus]="Szuflada v2 - korpus (X1C)" [Front]="Szuflada v2 - front (X1C)" [Raczka]="Szuflada v2 - raczka" [ProbkaPIR]="Szuflada v2 - probka gniazda PIR" [PodkladkaESP]="Tacka - podkladki ESP (2 szt)" [Kaseta]="Kaseta elektroniki"
  [Tuleja]="Tuleja z gwintem" [Nakretka]="Nakretka" [ProbkaTuleja]="Probka gwintu - tuleja" [ProbkaNakretka]="Probka gwintu - nakretka")
CZ=("$@"); [ ${#CZ[@]} -eq 0 ] && CZ=(Korpus Front Raczka ProbkaPIR PodkladkaESP Kaseta Tuleja Nakretka ProbkaTuleja ProbkaNakretka)
timeout 120 "$OS" -o "$OUT/parametry.echo" "${ZM[@]}" -D 'czesc="parametry"' podstawka.scad > /dev/null 2>&1
sed -n 's/^ECHO: "PARAMETRY\(.*\)"$/\1/p' "$OUT/parametry.echo" > "$OUT/parametry.json"
jedna() { local c=$1 t0=$(date +%s)
  timeout 3600 "$OS" -o "$OUT/${PLIK[$c]}.3mf" "${ZM[@]}" -D "czesc=\"$c\"" -D 'tryb="druk"' podstawka.scad > "$OUT/$c.log" 2>&1 || echo "BLAD $c"
  echo "$c $(( $(date +%s) - t0 )) s"; }
n=0; for c in "${CZ[@]}"; do jedna "$c" & n=$((n + 1)); [ $((n % 3)) -eq 0 ] && wait; done; wait
N=../narzedzia
for c in "${CZ[@]}"; do f="$OUT/${PLIK[$c]}.3mf"
  node $N/sprawdz_siatki.js "$f" || { node $N/napraw_siatki.js "$f" "$OUT/naprawa.3mf" && node $N/sprawdz_siatki.js "$OUT/naprawa.3mf" && mv "$OUT/naprawa.3mf" "$f"; }
  node $N/skladowe_siatki.js "$f"; done
node $N/podstawka-wymiary.js "$OUT" "$OUT/parametry.json"
rm -f "$OUT"/*.log
echo KONIEC
