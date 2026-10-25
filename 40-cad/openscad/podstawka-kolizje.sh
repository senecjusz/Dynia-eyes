#!/usr/bin/env bash
# Kontrola kolizji podstawki v2 (CGAL, części z podstawka.scad): każda kontrola eksportuje część wspólną brył – wynik ma być pusty.
# KolizjaZamknieta: szufladka zamknięta (korpus, front, rączka, PIR, powerbank) wobec sklejki i kasety;
# KolizjaWsuwanie: to samo przy wysunięciu 0/30/60/90 (zmienna wysuwy); KolizjaPIR: PIR we froncie wobec frontu i korpusu;
# KolizjaWkladaniePIR: przemiatanie PIR i słupków M2 przy nasuwaniu frontu na korpus; KolizjaSruby: łby, nakrętki i trzpienie wobec części.
# Użycie: bash podstawka-kolizje.sh [Kontrola ...]   Zmienne środowiska: ZMIENNE="-D WIN=214", OPENSCAD=<program>.
set -u
OS="${OPENSCAD:-$(command -v openscad || echo "/c/Program Files/OpenSCAD/openscad.com")}"
cd "$(dirname "$0")"
read -r -a ZM <<< "${ZMIENNE:-}"
K=("$@"); [ ${#K[@]} -eq 0 ] && K=(KolizjaZamknieta KolizjaWsuwanie KolizjaPIR KolizjaWkladaniePIR KolizjaSruby)
TMP=$(mktemp -d); blad=0
for k in "${K[@]}"; do
  timeout 3600 "$OS" -o "$TMP/$k.stl" "${ZM[@]}" -D "czesc=\"$k\"" podstawka.scad > "$TMP/$k.log" 2>&1
  if grep -q "Current top level object is empty" "$TMP/$k.log" || { [ -f "$TMP/$k.stl" ] && ! grep -q "vertex" "$TMP/$k.stl"; }; then echo "$k: pusto – OK"
  else blad=1; echo "$k: KOLIZJA albo błąd"; grep -E "ERROR|WARNING" "$TMP/$k.log" | head -3
    [ -f "$TMP/$k.stl" ] && awk '/vertex/ { for (i = 2; i <= 4; i++) { if (!n || $i < lo[i]) lo[i] = $i; if (!n || $i > hi[i]) hi[i] = $i } n++ }
      END { if (n) printf "  część wspólna: x %.2f…%.2f, y %.2f…%.2f, z %.2f…%.2f\n", lo[2], hi[2], lo[3], hi[3], lo[4], hi[4] }' "$TMP/$k.stl"; fi
done
rm -rf "$TMP"
[ $blad -eq 0 ] && echo "KOLIZJE: OK" || { echo "KOLIZJE: BŁĄD"; exit 1; }
