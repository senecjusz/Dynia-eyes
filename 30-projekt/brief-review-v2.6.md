# Brief review: v2.6 (E4) przed eksportem i wydrukiem

Recenzent, tylko do odczytu: bez `git pull`, commitów i zmian w plikach. Odpowiedź po polsku, jeden raport. Obowiązują „Zasady dla recenzenta”, „Zasady projektowe” i „Luzy montażowe” w `AGENTS.md` oraz lista `30-projekt/review-cad.md`.

## Sytuacja

Wykonawca zbudował v2.6 w Onshape według `30-projekt/brief-e4-v2.6.md` (zmiany po montażu v2.5: Gniazdo, Cięgno, Kaseta, nowa Klamra H, Pokrywa; Sanki usunięte). Siatek 3MF v2.6 jeszcze nie ma: użytkownik wyeksportuje je wieczorem i od razu wydrukuje. To review **projektu na podstawie raportu i planów** – ma wyłapać błędy, które da się poprawić w ciągu dnia. Kontrolę siatek po eksporcie zrobi orkiestrator.

## Materiał

Pliki wykonawcy leżą w jego worktree: `/home/rkp/Projects/010-Eye-pumpkin/Dynia-eyes/.claude/worktrees/heuristic-brattain-6e5ce2/40-cad/onshape/`:
- `weryfikacja-v2.6.md` – pomiary brył (bodydetails), luzy, K1–K11, K9,
- `e4-plan-1-gniazdo-ciegno.md`, `e4-plan-2-kaseta-klamra-pokrywa-sanki.md` – zatwierdzone plany,
- `stan-api.json` → `e4` – log, zmienne.

Kontekst: brief `30-projekt/brief-e4-v2.6.md`, wcześniejsze analizy `20-analizy/review/2026-10-20-e4-fable.md` i `…-astra.md` (pomiary siatek v2.5), rozmowa `20-analizy/review/2026-10-20-e4-rozmowa.md`, siatki v2.5 `40-cad/3mf/Oko F v2.5/` (do odniesienia: części bez zmian i geometria sąsiednia, w tym `PODGLAD SG90` z v2.4 w `40-cad/3mf/Oko F v2.4/`).

## Pytania

1. Czy v2.6 realizuje brief i rozwiązuje problemy z montażu (rozdęte piasty Cięgna, rant, ząbki, łby w Gnieździe, Sanki wpadające do środka, ucha Pokrywy)? Wskaż odstępstwa.
2. Luzy z raportu: przelicz kluczowe pary na geometrii (bruzdy i łby, blok przedni – otwór dolny C 0,28 i kołnierz C 0,63, kanał końcówki wkrętu, Klamra H – ścianka/szczelina/kabel/korpus serwa 0,2 osiowo, ucha – napęd). Uwzględnij rozrzut wymiarów SG90 różnych producentów (długość korpusu względem otworu ucha, grubość ucha) – czy coś przestanie pasować?
3. Montaż według kolejności z briefu (serwo z Klamrą od tyłu → przedni wkręt przez okno → napęd skręcony na stole od przodu → Ramię na wałek → Pokrywa): czy każdy krok jest wykonalny, czy coś zasłania drogę albo dostęp narzędzia?
4. DFAM: druk Kasety czołem, Klamry profilem H, Gniazda rantem; skosy 45°, cienkie ścianki (bruzda 0,9, ścianka bloku przy otworze C), mostki.
5. Wytrzymałość: blok przedni z wkrętem M2 (siedzisko x ±2,75), Klamra H, ucha Pokrywy z wkładkami, ścianka 0,9 pod bruzdą – czy któreś jest ryzykiem przy montażu przez dziecko i dokręcaniu?
6. Czego nie da się ocenić bez siatek i co orkiestrator ma sprawdzić po eksporcie.

Dla każdej uwagi: waga (KRYTYCZNE / WAŻNE / DROBNE), miejsce, scenariusz porażki, poprawka albo test, pewność. Na końcu jedno zdanie: czy v2.6 można eksportować i drukować dziś wieczorem bez zmian, po drobnych poprawkach (jakich), czy wymaga zmian przed drukiem.
