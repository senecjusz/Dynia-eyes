# Brief E4.3: rendery instrukcji montażu v2.7 (Blender)

Wykonawca. Bez Onshape i bez API. Tekst instrukcji już jest: `70-budowa/montaz-v2.7.md` (czytaj z głównego katalogu repo, jeszcze nie na `main`). Twoje zadanie to obrazki do niej.

## Co jest

Potok z v2.5: `70-budowa/montaz-v2.5/renderuj.sh` → `3mf_do_stl.py` (3MF → STL), `renderuj.py` (Blender, Cycles; kroki w `KROKI`, części w `CZESCI`, miniatury w `MINIATURY`), `podpisz.py` (podpisy, galerie). Opis w `montaz-v2.5.md`, „Dla dociekliwych”.

## Zrób

1. Skopiuj potok do `70-budowa/montaz-v2.7/` (nie zmieniaj plików v2.5).
2. Źródło siatek: `40-cad/3mf/Oko F v2.7/Oko F v2.7 - FullProject.3mf` (10 brył w jednym pliku – rozdziel po nazwach obiektów; `3mf_do_stl.py` dziś łączy wszystko w jeden STL) oraz podglądy z `Oko F v2.4` (piłeczka, SG90, orczyk, przyrząd do klejenia, widelec). Sanek i przyrządu centrowania nie ma.
3. Kroki według `montaz-v2.7.md`: 01 wkładki w uchach Kasety (w środku, ±X), 03 serwo z Klamrą H wsuwane od tyłu + wkręt przez okno, 04 dźwigienka na wałku, 05 napęd skręcony na stole (śruby M3×12, podkładki, nakrętki), 06 napęd wsuwany od przodu i Ramię na dźwigienkę, 07 wkręt Ramienia przez okno, 08 Pokrywa, 11 Kaseta do Gniazda (łby w bruzdach). Kroki 02, 09, 10 mogą zostać z v2.5, jeśli wyglądają tak samo – sprawdź.
4. Części z podpisami: Kaseta (blok, kanał, okno, ucha wewnątrz), Klamra H (ramiona, łącznik, otwór), Cięgno (otwory, płyta), Gniazdo (bruzdy, strzałka), Pokrywa; galeria drukowanych i kupnych (dodaj podkładkę i nakrętkę samohamującą M3, M3×12; usuń Sanki, wkładki w Cięgnie, przyrząd centrowania).
5. Podmień ścieżki obrazków w `montaz-v2.7.md` na `montaz-v2.7/…` i usuń notkę „rendery jeszcze nie są przeliczone”.
6. Najpierw `--szybko`, sprawdź kilka obrazków sam (czy części są tam, gdzie mówi tekst), potem pełna jakość.

## Zasady

- Procesy z limitem czasu (`timeout`), żadnych zostawionych w tle.
- Commit na swoją gałąź (`git add` po nazwach): `70-budowa/montaz-v2.7/` i `70-budowa/montaz-v2.7.md`; wiadomość do orkiestratora z hashem i listą obrazków.
- Jeśli coś w tekście instrukcji przeczy siatkom (np. kierunek, położenie), nie zmieniaj tekstu sam – napisz do orkiestratora.
