# AGENTS.md

Instrukcje dla agentów AI pracujących w tym repozytorium (Claude, Codex i inne).

## Komunikacja

- **Zawsze po polsku**: odpowiedzi, dokumenty, opisy commitów, komentarze w plikach `.md`.
- Krótko i konkretnie. Bez zbędnego kontekstu i powtarzania tego, co jest w repo.

## Najpierw przeczytaj

- `CLAUDE.md`: zasady projektu, ograniczenia projektowe (druk 3D, śruby M3/M4/M5, DFAM), struktura Onshape, praca z API Onshape. Obowiązuje wszystkich agentów, nie tylko Claude.
- `README.md` i README w folderach: układ repo i co gdzie trafia.
- `30-projekt/decyzje.md`: co już ustalono. Nie zmieniaj tego bez zgody użytkownika.

## Zasady pracy

- **Najpierw rozmowa, potem zapis:** przy decyzjach projektowych proponuj w rozmowie, a do repo zapisuj dopiero to, na co użytkownik się zgodził.
- **Commituj tylko własne pliki** (`git add` po nazwach, nigdy `git commit -a`). W repo pracuje równolegle kilka sesji.
- Na początku `git pull`, na końcu commit + `git push`.
- Recenzent (review) pracuje tylko do odczytu i niczego nie zmienia w repo.
- W razie niepewności: pytaj, zamiast zgadywać.
