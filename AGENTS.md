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

## Podział ról

- **Orkiestrator (jeden):** rozmawia z użytkownikiem, zleca pracę wykonawcom, uruchamia review, łączy wyniki i przekazuje wykonawcy uwagi zatwierdzone przez użytkownika. Pilnuje dokumentacji: decyzje, dziennik, plan. Sam nie projektuje w CAD.
- **Wykonawcy:** jeden na zadanie (np. moduł oka w Onshape). Pracują według briefu, przed budową pokazują plan, po zakończeniu się zatrzymują i zgłaszają gotowość do review. Nie uruchamiają review sami i nie zaczynają kolejnej wersji bez zlecenia.
- **Recenzenci:** dwóch niezależnych, z **różnych rodzin modeli**: **Opus** (Anthropic) i **Codex / „Astra”** (OpenAI). Pracują tylko do odczytu, każdy osobno, na tym samym briefie review.

## Gdzie jest prawda o modelu

- **Onshape** (dokument SimpleEye, gałęzie i wersje, np. „v2.1c do review”) to źródło prawdy o geometrii.
- W repo są tylko eksporty (`40-cad/stl`, `40-cad/3mf`, `40-cad/step`), skrypty budujące i opisy (`40-cad/README.md`, `30-projekt/plan-*.md`).

## Proces wersji

1. Projekt (wykonawca), potem zgłoszenie „gotowe do review”.
2. Review dwoma recenzentami (zleca orkiestrator).
3. Orkiestrator łączy wyniki, a użytkownik decyduje, co poprawić teraz, a co w następnej wersji.
4. Poprawki (wykonawca).
5. Wydruk testowy (użytkownik).
6. Uwagi z wydruku → **zawsze wpis w `70-budowa/dziennik.md`** i wnioski do następnej wersji.

Każdy etap kończy się zapisem w repo (dziennik, decyzje albo plan).

## Zasady dla recenzenta

- **Review zawsze pełne**, całej wersji, a nie tylko zmian. Review jest tanie w porównaniu z błędnym wydrukiem.
- Wagi uwag: **KRYTYCZNE** (nie zadziała albo test nic nie wykaże), **WAŻNE**, **DROBNE**.
- **Liczby zamiast opinii:** wymiary, luzy, kąty, policzone albo zmierzone na siatkach.
- Dla każdej uwagi podaj: miejsce, scenariusz porażki, poprawkę albo test i pewność.
- Na końcu **werdykt jednym zdaniem:** czy wersja nadaje się do wydruku testowego.
- Lista kontrolna: `30-projekt/review-cad.md`.
