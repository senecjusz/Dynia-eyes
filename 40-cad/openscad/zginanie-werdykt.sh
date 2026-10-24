#!/usr/bin/env bash
# Werdykt wariantu testu zginania z pliku wynik.txt (wywoływany przez zginanie.sh; można uruchomić ponownie na gotowych wynikach).
# Dwie oceny:
#   PRZELICZENIE: POZA ZAKRESEM – asercja GRANICA w SCAD, część z liczbą brył ≠ 1 albo brak parametrów;
#                 NIEZALICZONY  – błąd eksportu, siatki, kinematyki lub kolizji, pozycja nieosiągalna, przenikanie (< 0),
#                                 wysokość części ≠ oczekiwanej z parametrów (wymiary_siatki.js);
#                 ZALICZONY     – reszta.
#   LUZY:         SPEŁNIONE / NIESPEŁNIONE wobec tabeli AGENTS.md: pary obrotowe i osiowe osi powiek (łeb M2, ucho–ucho,
#                 ucho–podkładka) ≥ luzObr − 0,02; pozostałe pary ruchome ≥ 0,5; styki stałych pomijane.
# Kontrola siatki „BLAD … .3mf” przed naprawą nie jest błędem, jeśli naprawa dała OK (eksport.sh kopiuje naprawioną siatkę).
# Użycie: bash zginanie-werdykt.sh <katalog wariantu>
d="$1"; f="$d/wynik.txt"; w=ZALICZONY
sed -i '/^WERDYKT:/d;/^WYMIARY:/d;/: .* mm; wysokość /d' "$f"
[ -s "$d/parametry.json" ] && node "$(dirname "$0")/../narzedzia/wymiary_siatki.js" "$d/3mf" "$d/parametry.json" | grep -E "wysokość|WYMIARY" >> "$f"
if grep -q "GRANICA" "$f" || grep -E "brył ([02-9]|[1-9][0-9])" "$f" > /dev/null || ! [ -s "$d/parametry.json" ]; then w="POZA ZAKRESEM"
elif grep -qE "^BLAD (kinematyki|kolizji)|^BLAD [A-Za-z]+ (druk|zlozenie)|^BLAD naprawa|nieosiągalne [1-9]|NIEOSIĄGALNE|WYMIARY: BŁĄD" "$f" \
  || grep -E "\| -[0-9]" "$f" > /dev/null; then w=NIEZALICZONY; fi
lo=$(node -e 'try{const p=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"));console.log(Math.round(((p.luzObr||0.2)-0.025)*1000)/1000)}catch(e){console.log(0.18)}' "$d/parametry.json")
nies=$(grep -E "^[^|]+ \| [0-9]+\.[0-9]+ \|" "$f" | grep -v "(stałe)" | awk -F'|' -v lo="$lo" '{ p=$1; v=$2+0; gsub(/ +$/,"",p);
  prog = (p ~ /lebM2|powieka dolna – pierscien|powieka górna – powieka dolna/) ? lo : 0.5;
  if (v < prog) printf "%s %.2f < %.2f; ", p, v, prog }')
luzy=SPEŁNIONE; [ -n "$nies" ] && luzy="NIESPEŁNIONE ($nies)"; [ "$w" = "POZA ZAKRESEM" ] && luzy="– (nie dotyczy)"
echo "WERDYKT: PRZELICZENIE $w; LUZY $luzy" >> "$f"
echo "$(head -1 "$f" | sed 's/=== wariant: //'): PRZELICZENIE $w; LUZY $luzy"
