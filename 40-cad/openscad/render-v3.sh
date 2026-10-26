#!/usr/bin/env bash
# Render dużego oka v3 w Blenderze (w tle): 4 ujęcia → klatki PNG → MP4 (ffmpeg) + wybrane klatki PNG.
# Użycie: bash render-v3.sh <katalog STL złożenia z parametry.json (eksport-v3.sh)> [katalog wyjściowy=podglad/duze-oko-v3]
set -u
cd "$(dirname "$0")"
STL="$1"; OUT="${2:-podglad/duze-oko-v3}"; TMP="${TMP_RENDER:-$OUT/.klatki}"
mkdir -p "$OUT" "$TMP"
N=../narzedzia/duze-oko-v3-blender.py
declare -A KL=([ogolny]=240 [kardan]=120 [prety]=120 [zawiasy]=120)
for u in ogolny kardan prety zawiasy; do
  timeout 3600 blender -b -P "$N" -- "$STL" "$TMP" "$u" "${KL[$u]}" > "$TMP/$u.log" 2>&1 || echo "BLAD render $u"
  ffmpeg -y -loglevel error -framerate 24 -i "$TMP/klatki-$u/k_%04d.png" -c:v libx264 -pix_fmt yuv420p -crf 20 "$OUT/duze-oko-v3-$u.mp4"
done
printf "file '%s'\n" duze-oko-v3-ogolny.mp4 duze-oko-v3-kardan.mp4 duze-oko-v3-prety.mp4 duze-oko-v3-zawiasy.mp4 > "$OUT/lista.txt"
(cd "$OUT" && ffmpeg -y -loglevel error -f concat -safe 0 -i lista.txt -c copy duze-oko-v3-calosc.mp4 && rm lista.txt)
# klatki PNG: ujęcie: klatka → nazwa
for spec in "ogolny 1 ogolny-otwarte" "ogolny 23 ogolny-lewo" "ogolny 65 ogolny-gora" "ogolny 162 ogolny-zamkniete" "ogolny 120 ogolny-naroznik" \
            "kardan 30 kardan-lewo-prawo" "kardan 90 kardan-gora-dol" "prety 30 prety-lewo-prawo" "prety 90 prety-gora-dol" "zawiasy 30 zawiasy-gorna-zamknieta" "zawiasy 90 zawiasy-dolna-zamknieta"; do
  set -- $spec; cp "$TMP/klatki-$1/k_$(printf %04d $2).png" "$OUT/$3.png"; done
cp "$TMP/duze-oko-v3.blend" "$OUT/" 2>/dev/null || true
echo KONIEC
