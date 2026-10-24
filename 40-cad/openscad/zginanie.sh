#!/usr/bin/env bash
# Test zginania dużego oka v2: dla każdego wariantu zmiennych bazowych eksport 6 części (3MF do druku + STL złożenia),
# kontrola siatek, kinematyka (solver) i kontrola kolizji (krok 17,5°: 5 × 5 pozycji gałki, 7 pozycji powiek).
# Użycie: bash zginanie.sh <katalog_roboczy> "Rg=29" "Rg=31" "scianka=28" ...   (wynik: <katalog>/<wariant>/wynik.txt)
set -u
cd "$(dirname "$0")"
ROB="$1"; shift
for w in "$@"; do
  d="$ROB/$(echo "$w" | tr '=. ' '__-')"; mkdir -p "$d/3mf"
  ZM=""; for z in $w; do ZM="$ZM -D $z"; done
  {
    echo "=== wariant: $w"
    ZMIENNE="$ZM" OUT3MF="$d/3mf" bash eksport.sh "$d" Galka PowiekaGorna PowiekaDolna Pierscien Maskownica UchwytSerw 2>&1 | grep -E "OK|BLAD|brył|naprawiono"
    node ../narzedzia/duze-oko-kinematyka.js "$d/parametry.json" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log("kinematyka: S1 L",j.S1.L,"α",j.S1.alfa,"nieosiągalne",j.S1.nieosiagalne.length,"| S2 L",j.S2.L,"α",j.S2.alfa,"nieosiągalne",j.S2.nieosiagalne.length,"| S3",JSON.stringify(j.S3))})'
    node --max-old-space-size=8000 ../narzedzia/duze-oko-kolizje.js "$d" 17.5 2> "$d/postep.log" | head -16
  } > "$d/wynik.txt" 2>&1
  echo "$w gotowe"
done
