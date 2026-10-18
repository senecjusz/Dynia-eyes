# Stan projektu – przekazanie do Warszawy (2026-10-18, późny wieczór)

Dla orkiestratora, który przejmuje projekt w Warszawie. Zasady pracy: `AGENTS.md` i `CLAUDE.md`.

## Gdzie jesteśmy

- **Małe oko, moduł v2.4** gotowy i po review (Opus + Codex): nadaje się do wydruku testowego po drobnych poprawkach v2.5. Połączone wnioski: `20-analizy/review/2026-10-18-v2.4-polaczone.md`.
- **Źródło prawdy o modelu:** `40-cad/solidcraft/oko-f-v2.4.solidcraft` (SolidCraft 0.15). Onshape (dokument SimpleEye, gałąź v2, wersja „v2.2 do review”) jest w zapasie.
- **Historia wersji:** v1 → v1.1 (wydruk testowy) → v2 → v2.1 → v2.1b/c/d → v2.2 (pierwsza składalna, gniazdo + kaseta) → v2.3 (SolidCraft) → v2.4 (po review) → v2.5 (do zrobienia). Każda wersja przeszła review Opus + Codex.
- **Wydruki:**
  - próbka gwintu 45° v2.2: luz OK,
  - próbka gwintu ISO M63×3 (v2.3/v2.4): do wydruku (nakrętki z luzem 0,3 / 0,45 / 0,6).

## Następne kroki

1. **v2.5:** poprawki 1–7 z `20-analizy/review/2026-10-18-v2.4-polaczone.md` (do zlecenia nowemu wykonawcy w Warszawie, w SolidCraft AppImage). Potem review dwoma recenzentami (`20-analizy/review/`).
2. **Użytkownik:** wydruk próbek gwintu (0,3 / 0,45 / 0,6) i pomiary SG90, taśmy kabla i wkrętów uszu.
3. Wydruk testowy całego modułu v2.5.
4. Po teście: decyzja o serii ~10 modułów, rozmieszczenie w dyni (poziomo ≥ 125 mm, pionowo ≥ 145 mm, otwór Ø63,5).
5. Równolegle:
   - firmware na ESP32 z kalibracją przez telefon,
   - pudełko na elektronikę w dyni,
   - duże oko (analiza w `20-analizy/2026-10-18-duze-oko-jedna-noc.md`, do omówienia).

## Otwarte sprawy

- Pomiary SG90, orczyka, taśmy i wtyczki kabla (wymiary w modelu są założone).
- Śruby osi ISO 7380 M3: skrócić do 4 mm albo kupić M3×5/6.
- Drukowany widelec do zwalniania zaczepów (w v2.4).
- Napęd symetryczny (pomysł użytkownika) do rozważenia po wydruku modułu.
- Kopia pełnego researchu Gemini na dysk sieciowy (gdy serwer wróci).

## Sesje Claude (komputer w Kobyłce)

| Sesja | Rola | Stan |
|---|---|---|
| Orkiestrator (sesja główna, od 17.10) | rozmowa z użytkownikiem, review, dokumentacja | **zakończona – orkiestracja przechodzi do Warszawy** |
| SolidCraft: moduł oka v2.3 (pilotaż) | wykonawca CAD w SolidCraft (GUI w Kobyłce, --control 7878) | v2.4 gotowa; nie zlecać jej już pracy – v2.5 robi nowy wykonawca w Warszawie |
| Onshape: moduł małego oka v2 ze śrubami | wykonawca CAD w Onshape | w zapasie (v2.2 w Onshape) |
| Onshape: gniazdo i moduł małego oka (wariant F) | wykonawca v1/v1.1 | zakończona |

Nowy orkiestrator w Warszawie nie ma dostępu do historii tych rozmów. Wszystko, co istotne, jest w repo: ten plik, `AGENTS.md`, `CLAUDE.md`, `30-projekt/decyzje.md`, `70-budowa/dziennik.md`, `20-analizy/review/`, `30-projekt/plan-v2-modul-oka.md`, `40-cad/solidcraft/README.md`.
