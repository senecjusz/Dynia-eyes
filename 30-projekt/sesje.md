# Sesje agentów: role, gałęzie, stan

Plik pozwala wznowić pracę bez historii rozmów, np. po zmianie konta Claude. Prowadzi go PM. Każda sesja obszaru zaczyna od tego pliku, `teraz.md`, `decyzje.md` i swojej gałęzi.

Stan na 28.10 rano. Termin: czwartek 29.10 rano. Minimum na szkołę: 8 małych oczu, PIR i przycisk, bez strony w telefonie (PRD §6).

| Rola | Worktree / gałąź | Stan | Otwarte |
|---|---|---|---|
| **PM** | main (`/home/rkp/Projects/010-Eye-pumpkin/Dynia-eyes`) | prowadzi PRD, `decyzje.md`, `teraz.md`, `plan.html`, `lista-hardware.md` i ten plik | kolumna „Mam?” w `lista-hardware.md` do wypełnienia przez użytkownika; scalanie gałęzi obszarów z main po odbiorze |
| **Projektant dużego oka** (całe duże oko v3) | `.claude/worktrees/duze-oko`, `projektant-duze-oko` | trzpień kardana z rdzeniem M3 (wydrukowany, pasuje), osie powiek M2 × 6, przedłużenie orczyka z rowkiem, ogon „Z” 2 mm ku serwu (1b2aaf9); w toku: mocniejsze uszka drutów na powiekach | przemiatanie uszek; przedruk powiek i tub; montaż na stole według `40-cad/openscad/duze-oko-v3-montaz.md`; otwory orczyków ok. Ø0,8 (rozwiercić do 1,5) |
| **Elektronika i software** | `.claude/worktrees/elektronika`, `elektronika/dynia-v2` | program `50-elektronika/dynia-v2` etap 1 skompilowany, używa kalibracji 1500/1100/1800; przewód PIR w szufladce bez złącza, zapas 150 mm (17b667f) | wgranie i test na stole; pinout RJ45; duże oko w programie wyłączone (`DUZE_OKO_GOTOWE = false`) do kalibracji kanałów 12–15 |
| **Kalibrator** (tylko kalibracja serw) | ta sama gałąź co elektronika | 8/8 małych oczu: środek 1500, Min 1100 (prawo), Max 1800 (lewo), w NVS (`50-elektronika/kalibracja-oczu.md`, `30-projekt/raport-elektronika.md`) | 4 × MG90S dużego oka, kanały 12–15, po montażu na stole |
| **Montaż** (małe oczy, podstawka, szufladka, dynia) | `.claude/worktrees/montaz`, `wykonawca-montaz` | instrukcja `70-budowa/montaz-v2.8.md` (Jarzmo obrócone o 180°, wiertło Ø3,2); podstawka v2 i szufladka wydrukowane; kaseta elektroniki gotowa do druku | montaż kasety w podstawce (P8–P12), montaż w dyni (K2–K5); brak pliku `70-budowa/kompletacja-dyni.md`, do którego odsyła instrukcja |

## Zasady pracy (skrót, pełne w `AGENTS.md`)

- Zmiany pokazujesz użytkownikowi jako diff. Commit i push robisz dopiero po jego „ok”.
- Obszar nie zmienia PRD, `decyzje.md`, `teraz.md`, `plan.html` ani tego pliku. Zgłasza zmiany do PM w formacie `[PM][typ]`.
- Każda część, śruba i drut w instrukcji musi być na liście posiadanych w `lista-hardware.md`, potwierdzona przez użytkownika, zanim pójdzie do druku.
- Każda czynność musi być wykonalna rękami w warsztacie. Bez decyzji za użytkownika.
