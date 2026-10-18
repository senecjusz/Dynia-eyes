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

## Projektowanie: luzy montażowe (obowiązkowe)

Każda para części, które wchodzą jedna w drugą, ślizgają się, obracają albo są skręcane, **musi mieć luz policzony i zapisany już przy projektowaniu**, a nie odkryty dopiero w review albo na wydruku.

- **Wykonawca** dla każdej pary podaje w planie: rodzaj pasowania, luz nominalny i luz na siatce po eksporcie. Luz trzyma jako **zmienną** w Variable Studio. Przy ruchu i wsuwaniu sprawdza go symulacją na całej drodze, łącznie z łbami śrub, kablem i realnym SG90.
- **Recenzent** sprawdza tabelę luzów i zgłasza każdą parę bez luzu albo z luzem poniżej wartości z tabeli.
- Wartości startowe dla **PLA na Bambu A1 mini / X1C** (na stronę, czyli promieniowo). Korygować po próbkach i zapisywać korekty w tej tabeli:

| Pasowanie | Luz | Źródło |
|---|---|---|
| Ślizgowe: wsuwanie (kaseta w gniazdo, sanki, prowadnice) | **0,25–0,3 mm** + fazki wejściowe | review v2.2 (0,06 mm = zacięcie) |
| Obrotowe na śrubie lub tulejce (przeguby, oś) | 0,2 mm, luz osiowy 0,2–0,3 mm | v2.x |
| Ruchome części obok siebie (cięgno, ramię, jarzmo) | ≥ 0,5 mm w całym zakresie ruchu, ≥ 0,2 mm po uwzględnieniu luzów przegubów | review v1.1, v2.2 |
| Gwint drukowany (flanki 45°, zazębienie ~1,7 mm) | **0,3 mm** | próbka v2.2 OK; 0,5 za luźno, 0,3 przy flankach 62° za ciasno |
| Wcisk (np. tulejka w otwór) | 0 do −0,05 mm | do próby |
| Szczelina na klej wypełniający | 0,5 mm | v2.1b |
| Otwory M3 | ciasny Ø2,6, luźny Ø3,3; wkładka: głębokość = długość wkładki + ≥ 0,6 mm dna | v2.x, review v2.1d |

- **Najpierw próbka:** nowe pasowanie (gwint, zatrzask, prowadnica) najpierw drukujemy jako krótką próbkę (~20–30 min), a dopiero potem całą część.
- **Eksport do pomiaru luzów:** 3MF z dokładną siatką (Custom, kąt 3°, odchyłka 0,01 mm). Zgrubna siatka zjada luzy.
