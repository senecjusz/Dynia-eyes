# Stan projektu – przekazanie (2026-10-18, wieczór)

Dla orkiestratora, który przejmuje projekt w Warszawie. Zasady pracy: `AGENTS.md` i `CLAUDE.md`.

## Gdzie jesteśmy

- **Małe oko, moduł v2.4** w trakcie: sesja wykonawcy „SolidCraft: moduł oka v2.3 (pilotaż)” na komputerze w **Kobyłce** (Windows, nie usypia), aplikacja SolidCraft otwarta z `--control 7878`. Zakres v2.4 jest w `decyzje.md` (wpis 2026-10-18).
- **Źródło prawdy o modelu:** `40-cad/solidcraft/oko-f-v2.3.solidcraft` (SolidCraft 0.15). Onshape (dokument SimpleEye, gałąź v2, wersja „v2.2 do review”) jest w zapasie.
- **Historia wersji:** v1 → v1.1 (wydruk testowy) → v2 → v2.1 → v2.1b/c/d → v2.2 (pierwsza składalna, gniazdo + kaseta) → v2.3 (SolidCraft) → v2.4 (w toku). Każda wersja przeszła review Opus + Codex.
- **Wydruki:**
  - próbka gwintu 45° v2.2: luz OK,
  - próbka gwintu ISO M63×3 (v2.3/v2.4): do wydruku (nakrętki z luzem 0,3 / 0,45 / 0,6).

## Następne kroki

1. Sesja SolidCraft zgłasza „v2.4 gotowe do review”.
2. Review dwoma recenzentami. Briefy były w scratchpadzie orkiestratora w Kobyłce, a wzorem jest sekcja „Zasady dla recenzenta” w AGENTS.md. Codex jest uruchamiany przez `codex exec --sandbox read-only -C <repo> -o <plik> "<brief>"`.
3. Wydruk próbki gwintu ISO, potem wydruk testowy całego modułu.
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
