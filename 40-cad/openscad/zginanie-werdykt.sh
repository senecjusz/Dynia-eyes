#!/usr/bin/env bash
# Werdykt wariantu testu zginania z pliku wynik.txt (wywoływany przez zginanie.sh; można uruchomić ponownie na gotowych wynikach).
#   POZA ZAKRESEM – asercja GRANICA w SCAD albo część z liczbą brył ≠ 1 albo brak parametrów;
#   NIEZALICZONY  – błąd eksportu (druk/złożenie), siatka po naprawie z błędem, błąd kinematyki/kolizji, pozycja nieosiągalna, przenikanie (< 0);
#   ZALICZONY     – reszta; pary z odstępem < 0,5 mm (bez styków stałych) wypisane do oceny wobec tabeli luzów.
# Kontrola siatki „BLAD … .3mf” przed naprawą nie jest błędem, jeśli naprawa dała OK (eksport.sh kopiuje naprawioną siatkę).
# Użycie: bash zginanie-werdykt.sh <katalog wariantu>
d="$1"; f="$d/wynik.txt"; w=ZALICZONY
if grep -q "GRANICA" "$f" || grep -E "brył ([02-9]|[1-9][0-9])" "$f" > /dev/null || ! [ -s "$d/parametry.json" ]; then w="POZA ZAKRESEM"
elif grep -qE "^BLAD (kinematyki|kolizji)|^BLAD [A-Za-z]+ (druk|zlozenie)|naprawiono.*\n.*BLAD naprawa|nieosiągalne [1-9]|NIEOSIĄGALNE" "$f" \
  || grep -E "^BLAD naprawa" "$f" > /dev/null || grep -E "\| -[0-9]" "$f" > /dev/null; then w=NIEZALICZONY; fi
p=$(grep -E "\| 0\.[0-4][0-9] \|" "$f" | grep -v "(stałe)" | cut -d'|' -f1-2 | sed 's/ *$//' | tr '\n' ';')
sed -i '/^WERDYKT:/d' "$f"
echo "WERDYKT: $w; odstępy < 0,5 (bez styków stałych): $p" >> "$f"
echo "$(head -1 "$f" | sed 's/=== wariant: //'): $w"
