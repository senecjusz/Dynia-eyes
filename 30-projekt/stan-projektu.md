# Stan projektu (2026-10-21, wieczór)

Krótki stan dla orkiestratora, który zaczyna sesję. **Pełne przekazanie: `30-projekt/przekazanie-2026-10-21.md`** (wersje, co działa na sprzęcie, kolejka, wykonawca, pułapki, zasady, których pilnuje użytkownik). Braki w dokumentacji sesji 19–21.10 i ich poprawki: `20-analizy/2026-10-21-audyt-dokumentacji-sesji.md`. Agenda: `30-projekt/teraz.md`.

## Gdzie jesteśmy

- **Model:** Onshape, dokument **„Oko F v2.5”** (folder Halloween) zawiera dziś stan **v2.8**. SimpleEye i `40-cad/solidcraft/` to archiwum. Eksporty: `40-cad/3mf/Oko F v2.x/`, do druku plik `… - FullProject.3mf`.
- **Wersje:** v2.5 (19.10) wydrukowana i złożona → wady → v2.6 (20.10, wydrukowana) → v2.7 (Cięgno na nakrętkach, dodrukowane) → **v2.8** (21.10: M3 w uszach SG90 i w Pokrywie, bez wkładek; eksport sprawdzony; do druku Kaseta i Klamra H, wydruk niepotwierdzony).
- **Pierwszy moduł** (21.10): złożony z v2.6 + Cięgno v2.7, skalibrowany (środek 1500 µs, dźwigienka nasadzona przy 1500 µs w położeniu „otwarte V”), działa z programem `oczy-ruch`. Gniazda w dyni nie sprawdzano.
- **Elektronika:** ESP32-C3 SuperMini + PCA9685 + SG90 (`50-elektronika/polaczenia.md`). Zasilanie docelowe: powerbank przez USB-C (decyzja 20.10).
- **API Onshape:** 558 wywołań w roku (`40-cad/onshape/stan-api.json`).

## Następne kroki

Bieżące zadanie i kolejka są w `30-projekt/teraz.md` (E5): instrukcja v2.8 do commita, test powerbanku (E5.5), drugi moduł (E5.7), test 24 h na dwóch modułach (E5.6), stanowisko i tabela kalibracji (E5.4).

## Sesje

- **Wykonawca CAD:** stała sesja „Wykonawca CAD”, worktree `.claude/worktrees/heuristic-brattain-6e5ce2`, gałąź scalona z `main`, bez zlecenia.
- Sesje z Kobyłki (SolidCraft, wykonawcy v1–v2.2) są zakończone.
