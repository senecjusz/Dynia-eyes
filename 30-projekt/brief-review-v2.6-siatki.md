# Brief review: v2.6 na siatkach po eksporcie (przed drukiem)

Recenzent, tylko do odczytu: bez `git pull`, commitów i zmian w repo i worktree. Odpowiedź po polsku, jeden raport. Obowiązują „Zasady dla recenzenta” i „Luzy montażowe” w `AGENTS.md` oraz `30-projekt/review-cad.md`.

## Sytuacja

v2.6 zbudowana, poprawiona po review projektu (`20-analizy/review/2026-10-20-v2.6-fable.md`, `…-astra.md`: poprawki 1–4 – kanał wkrętu 1,5 z fazką, `uchoDno` 1,6, zapas korpusu SG90 0,7 z obu stron, bruzdy 7,8) i przyjęta przez orkiestratora (K1–K4 z surowego JSON). Użytkownik wyeksportował 3MF wszystkich 10 części i chce drukować dziś. To ostatnia kontrola **na siatkach**.

## Materiał

- Siatki v2.6: `40-cad/3mf/Oko F v2.6/` (10 plików, `unit="meter"`; narzędzie `40-cad/narzedzia/sprawdz_siatki.js`). Orkiestrator: 10/10 szczelne, po 1 bryle, objętości w ±0,1 % od Onshape; Nakrętka ma 2 zdegenerowane trójkąty jak w v2.5 (bez zmian w części).
- Siatki v2.5 do porównania: `40-cad/3mf/Oko F v2.5/` (w tym Sanki), `PODGLAD SG90` / `PODGLAD orczyk` w `40-cad/3mf/Oko F v2.4/`.
- Raport wykonawcy z poprawkami: `/home/rkp/Projects/010-Eye-pumpkin/Dynia-eyes/.claude/worktrees/heuristic-brattain-6e5ce2/40-cad/onshape/weryfikacja-v2.6.md`; brief `30-projekt/brief-e4-v2.6.md`.

## Pytania

1. Na siatkach potwierdź poprawki 1–4 i wymiary z raportu: Gniazdo (bruzdy ±Y 7,8 × R28,55, z −8,6…−45,7, ścianka min 0,90 w narożu, rant R33,75, 8 ząbków r 31,5–33, strzałka cała), Kaseta (brak starych uch i Sanek, blok, kanał 1,5, otwór wkrętu, okno górne, ucha ±X z otworami 5,6, koniec szczeliny), Klamra H, Pokrywa, Cięgno (Ø4,4).
2. Symulacje na siatkach z luzami: Kaseta w Gnieździe z łbami 2,45 (przesunięcie 0,25 i obrót w prowadnicy), serwo SG90 z Klamrą od tyłu (z wkrętem wystającym ≤ 1,2 pod uchem) do bloku, Pokrywa na Klamrze, napęd ±33° wobec nowych elementów.
3. Regresje: czy części bez zmian (Nakrętka, Jarzmo, Ramię, tulejki) są identyczne z v2.5; czy coś w zmienionych częściach zmieniło się poza zakresem briefu.
4. DFAM w orientacjach druku (Gniazdo rantem, Kaseta czołem, Klamra profilem H, Pokrywa płasko).

Dla każdej uwagi: waga, miejsce, scenariusz porażki, poprawka albo test, pewność. Na końcu jedno zdanie: czy pięć zmienionych części (Gniazdo, Cięgno, Kaseta, Klamra H, Pokrywa tylna) można dziś drukować.
