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
