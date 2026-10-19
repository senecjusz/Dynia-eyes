#!/bin/bash
# Obserwacja wykonawcy dla orkiestratora.
# Uzycie: pilnuj-wykonawcy.sh <katalog worktree wykonawcy> <plik stanu wzgledem worktree> [minuty bez postepu, domyslnie 6]
# Konczy sie (sygnal dla orkiestratora), gdy: w pliku stanu pojawi sie nowy "stop", na galezi wykonawcy przybedzie commit,
# albo plik stanu nie zmieni sie przez podana liczbe minut. Po kazdym sygnale orkiestrator sprawdza i uruchamia ponownie.
W="$1"; S="$W/$2"; LIMIT=$(( ${3:-6} * 60 ))
odczyt_stop() { python3 -c "import json,sys;print(json.load(open(sys.argv[1])).get('stop'))" "$S" 2>/dev/null; }
stop0=$(odczyt_stop); c0=$(git -C "$W" rev-parse HEAD); m0=$(stat -c %Y "$S"); t0=$(date +%s)
while true; do
  sleep 30
  st=$(odczyt_stop); c=$(git -C "$W" rev-parse HEAD); m=$(stat -c %Y "$S")
  if [ "$st" != "$stop0" ] && [ "$st" != "None" ]; then echo "STOP $(date +%H:%M:%S): $st"; exit 0; fi
  if [ "$c" != "$c0" ]; then echo "COMMIT $(date +%H:%M:%S): $(git -C "$W" log -1 --format='%h %s')"; exit 0; fi
  if [ "$m" != "$m0" ]; then m0=$m; t0=$(date +%s); fi
  if [ $(( $(date +%s) - t0 )) -ge $LIMIT ]; then echo "BRAK POSTEPU $(( LIMIT / 60 )) min $(date +%H:%M:%S), stop=$st"; exit 0; fi
done
