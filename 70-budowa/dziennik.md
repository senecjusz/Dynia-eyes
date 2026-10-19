# Dziennik budowy

## 2026-10-17
- Start projektu: repo, opis poziomów, lista sprzętu.
- Research Gemini o mechanizmach oka przeniesiony do `20-analizy/2026-10-17-mechanizm-oka/`, źródła w `10-inspiracje/`.
- Pierwsza wersja modelu małego oka (wariant F) w Onshape, dokument **SimpleEye** → Part Studio „Oko F v1”: gniazdo z rantem i gwintem, nakrętka ze skrzydełkami, tuleja modułu z bagnetem i zatrzaskiem, jarzmo C, 2 czopy, cięgno. Eksporty do druku testowego w `40-cad/stl/` (opis w `40-cad/README.md`).
- **TODO:** skopiować pełny research Gemini (`C:\Users\Karol\.gemini\antigravity\brain\22c1b0e0-97e8-478d-af28-db231550d0a4`, ~488 MB klatek) na dysk sieciowy, gdy serwer wróci (modem wyłączony).

## 2026-10-18
- v1 małego oka → review (Opus + Codex) → v1.1 (napęd bez martwego punktu, piłeczka 39,5–40,5, dokładne STL) → review → wydruk testowy v1.1 (bez cięgna, które jest uszkodzone w STL).
- Brief v2 ze śrubami gotowy, v2 zlecona nowej sesji.

## 2026-10-18 – wydruk testowy v1.1 (uwagi użytkownika)
- **Jarzmo** nie miało płaskiej strony na stół. Wymagało podpór i **pękało przy ich odrywaniu**, bo było za cienkie.
- **Nakrętka za ciasna**, praktycznie bez luzu: w modelu 0,3 mm, a na siatce ~0,29 mm. Prawdziwy wydruk zjada więcej.
- **Kabel SG90 wychodzi u dołu krótszego boku korpusu, od strony wałka.** W v1/v1.1 serwo by się przez niego nie zmieściło.
- Wnioski przekazane do v2.1c: jarzmo bez podpór, ścianki ≥ 2–2,4 mm, `luzGwint` 0,5 + próbka gwintu, kanał na kabel.

## 2026-10-18 – review v2.1d i próbka gwintu
- Review v2.1d (Opus + Codex): modułu nie da się złożyć (słupek SG90 i występy pokrywy blokują piłeczkę), wtyczka nie przechodzi przez pokrywę, montaż w dyni niewykonalny narzędziem.
- Próbka gwintu v2.1 (luz 0,5): za luźna, ~1,3 mm luzu całkowitego.
- Decyzja: v2.2 = gniazdo + kaseta na zaczepy (zlecone sesji v2).

## 2026-10-18 – próbka gwintu v2.2 i review v2.2
- Próbka gwintu v2.2 (luz 0,3, flanki 45°, pogłębiony zarys): **luz na wydruku OK**.
- Review v2.2 (Opus + Codex): pierwsza wersja, którą da się złożyć; do poprawy luz sanek, fazki, zaczepy (kolizja z otworem H, cienki pasek), ucha pod wkładki. Zlecone jako v2.3.
- Do sprawdzenia po wydruku modułu: napęd symetryczny (pomysł użytkownika), widelec do wyjmowania kasety, zacisk kabla, orczyk.

## 2026-10-18 – review v2.3 (SolidCraft)
- Opus + Codex: przeniesienie geometrii z Onshape poprawne (< 0,1 mm), kinematyka i ruch OK; do poprawy: klin w otworze H, błona w przyrządzie, nieszczelne siatki z eksportu SolidCraft, cienkie ścianki przy H, brak fazek. Zlecone jako v2.4.

## 2026-10-18 – review v2.4 i przekazanie
- Review v2.4 (Opus + Codex): do wydruku testowego po drobnych poprawkach (v2.5: prowadnica sanek w eksporcie, naroże sanek vs tulejka H, otwory dolne Ø8,7, domyślna nakrętka 0,45, parametry, orientacja siatek, dokumenty). Ramię przy stopie 0,26 zaakceptowane, firmware ≤ ±30°.
- Orkiestracja przeniesiona do Warszawy (Omarchy). Stan: `30-projekt/stan-projektu.md`.

## 2026-10-19 – próbka gwintu ISO 60° w PETG
- Próbka ISO M63×3 (v2.4, model z SolidCrafta) wydrukowana w PETG: gwint wyszedł kiepsko. Nie wiadomo, czy winny jest profil 60°, czy model z SolidCrafta.
- Decyzja użytkownika: nowy zestaw próbek 45°, skok 5, luzy 0,2 / 0,25 / 0,3 / 0,35 / 0,4, zaprojektowany w Onshape (zadanie E2.0, zarazem pilotaż nowych zasad pracy w Onshape).

## 2026-10-19 – wydruk próbki gwintu 45° (E2.0)
- Trzpień + nakrętki 45°, skok 5, wydruk na X1C. Luz poprzeczny suwmiarką (skrajne dociśnięcie w obie strony, błąd pomiaru ±0,15–0,20 mm): nakrętka 0,20 → ok. 0,5 mm, pasuje dobrze; nakrętka 0,25 → ok. 1,15 mm, za luźna. Nakrętek 0,30–0,40 nie mierzono.
- Decyzja: `luzGwint` = 0,20 dla gniazda i nakrętki v2.5.
