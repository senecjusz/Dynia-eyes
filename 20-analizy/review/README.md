# Review modułu małego oka

Każda wersja przechodzi **dwa niezależne review**: Opus (Anthropic, subagent) i Codex / „Astra” (OpenAI). Zasady są w `AGENTS.md`, sekcja „Zasady dla recenzenta”.

## Jak uruchomić

- **Brief:** [brief-review-szablon.md](brief-review-szablon.md) (ostatnio użyty dla v2.3). Przed użyciem podmień wersję, katalog siatek, zakres zmian i historię problemów.
- **Codex** (tylko do odczytu), z katalogu repo:
  ```bash
  codex exec --sandbox read-only -C . -o /tmp/codex-review.md "$(cat brief.md)"
  ```
- **Opus:** subagent `general-purpose` w tle, z tym samym briefem. Skrypty pomiarowe trzyma poza repo i parsuje 3MF jako ZIP z XML.
- Pełne review trwa ok. 30–45 min. Orkiestrator łączy wyniki, a o tym, co poprawić teraz, decyduje użytkownik.

## Wyniki

| Wersja | Codex | Opus (skrót) | Werdykt |
|---|---|---|---|
| v1 | [v1-codex](2026-10-18-v1-codex.md) | martwy punkt napędu, kolizje oczu w dyni, STL zjada luzy, wieża nie przejdzie przez otwór | nie do druku |
| v1.1 | [v1.1-codex](2026-10-18-v1.1-codex.md) | uszkodzone cięgno w STL, brak miejsca na kabel SG90, jarzmo nie leży płasko | do testu po drobnych poprawkach |
| v2.1d | [v2.1d-codex](2026-10-18-v2.1d-codex.md) | jarzma z piłeczką nie da się włożyć do obudowy, wtyczka nie przechodzi przez pokrywę, montaż w dyni niewykonalny | nie do złożenia → koncepcja gniazdo + kaseta |
| v2.2 | [v2.2-codex](2026-10-18-v2.2-codex.md) | zaczep koliduje z otworem H, pasek za okienkami 1,5 mm, ucha pod wkładki 1 mm, cięgno trzeba wsuwać wyżej | pierwsza wersja do złożenia, drobne poprawki → v2.3 |
| v2.3 (SolidCraft) | [v2.3-codex](2026-10-18-v2.3-codex.md) | klin w otworze dolnym H blokuje tulejkę, błona w przyrządzie, nieszczelna siatka kasety (~270 błędów), brak fazek wejściowych, gwint 60° z luzem 0,3 grozi powtórką ciasnej nakrętki | nie do druku całego modułu → v2.4 |
| v2.4 (SolidCraft) | [v2.4-codex](2026-10-18-v2.4-codex.md) | styk kołnierza tulejki H z narożem sanek, ramię przy stopie +33° 0,05 z luzami (akceptowane, firmware ≤ ±30°), nakrętka 0,3 przy 60° za ciasna (domyślnie 0,45); Codex: brak lewej prowadnicy sanek w eksporcie | do wydruku testowego po drobnych poprawkach + próbki |

Szczegóły połączonych wyników i decyzje są w `30-projekt/decyzje.md` i `70-budowa/dziennik.md`.
