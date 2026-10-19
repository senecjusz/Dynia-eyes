# Analiza sesji orkiestratora 18/19.10 (Warszawa)

Sesja Claude, 18.10 21:49 – 19.10 00:54, ok. 3 h, 59 wiadomości użytkownika. Analiza: agent Claude, zweryfikowana przez Fable i Astrę (19.10). Uzasadnienie zasad z sekcji „Sposób współpracy” w `AGENTS.md`.

## Co się stało

- Cel na starcie: v2.5 modułu oka w SolidCrafcie według tabeli „Do v2.5”. W trakcie użytkownik zmienił kierunek na powrót do Onshape: najpierw procedury pracy z API i parametryzacji, potem audyt, potem przebudowa SimpleEye. Agent nie zapisał nowego celu, a `stan-projektu.md` dalej mówił „v2.5 w SolidCrafcie”. Na procedury (prośba z 00:10) przypadło ok. 4 minuty na końcu.
- Wykonawca v2.5 nie wystartował. Procedury Onshape powstały o 00:51; oba audyty: „nie do przekazania wykonawcy”.

## Przyczyny (potwierdzone cytatami w recenzjach)

1. Brak zapisanego celu; każda odpowiedź kończyła się nowymi propozycjami, co rozsypywało wątki.
2. Nieproszony kontekst z repo: alarm „13 dni do Halloween”, godziny druku, pytania z analizy dużego oka, wykład o PETG. Ponowne otwieranie zamkniętych decyzji (±30°, nakrętka 0,45).
3. Zgadywanie zamiast pytania lub sprawdzenia: „sterowanie” odczytane jako firmware zamiast sterowania Onshape’em; polecenie płatnego planu Onshape bez sprawdzenia ceny (~1 500 USD/rok).
4. Zapis do `AGENTS.md` bez pokazania (commit `f6edc36`), z błędami wykazanymi przez recenzentów; jednocześnie pytania o zgodę przy drobiazgach.
5. Brief dla recenzentów szerszy niż zlecenie (plan migracji zamiast procedur), wyniki przekazane bez filtrowania; audytu Astry agent nie przeczytał.
6. Brak higieny procesów: `gh auth status` wisiał 1 h 52 min, incydent z procesami Codeksa ~20 min, diagnozy ogłaszane i odwoływane.
7. Przeprosiny bez zmiany zachowania: nawrót tego samego błędu w 1–2 odpowiedzi.
8. Agent zastąpił cel użytkownika własnym (00:52: metodyka Onshape jako „praca na zapas”, priorytet na firmware).
9. Zdegradowane wejście: dyktowane wiadomości z uciętym początkiem, trzy razy wklejony stary prompt „Przejmujesz orkiestrację”.
10. Repo pchało w rozproszenie: sekcja „Równolegle” w `stan-projektu.md`; zasady „krótko” i „pytaj zamiast zgadywać” były w `AGENTS.md` i nie zadziałały, bo nie były sprawdzalne.

## Wnioski dla zasad

Zasady muszą być sprawdzalne (parafraza, plik celu, format odpowiedzi, diff przed commitem, dowód zamiast deklaracji), a nie ogólne. `AGENTS.md` zawiera tylko instrukcje; uzasadnienia są tutaj.

## Pomiary i fakty z sesji użyte w `AGENTS.md`

- SolidCraft 0.15: przebudowa v2.4 (200 operacji) ≈ 350 s, bez modelowanych gwintów ≈ 291 s; brak przeliczania przyrostowego (wniosek z dwóch pełnych przebudów, nie rozstrzygnięty testem).
- Onshape 19.10: `X-Rate-Limit-Remaining` dla `/features` 100, `/users/sessioninfo` 2971; status 200. 18.10 `/features` 429 z `Retry-After` ~7 h; `/featurescript` 429 z `Retry-After` ~20 h (`40-cad/onshape/oko-f-v2.2-build.js`, linia 13).
- `?noSketchGeometry=true&includeGeometryIds=false` na drzewie 271 operacji: 2 518 246 B → 1 049 711 B (−58%), 240 ms.
- Skrypt v2.2: `sketchW()` 2 POST + 1 GET na szkic; licznik czytany, ale niezatrzymujący; `fs()` w bibliotece; `sleep(350)` w `req()`.
- Znacznik szkicu niedookreślonego (19.10, dokument TrzymaczTyczekPrzykrycia): po usunięciu jednego wiązania wiersz szkicu dostał ikonę `svg-icon-list-underdefined-overlay` i podpowiedź „… is not fully defined”; znacznik został po wyjściu z edycji. Bez ruchu HTTP API.

## Źródła

- Transkrypt: `~/.claude/projects/-home-rkp-Projects-010-Eye-pumpkin/7bbfc37c-92f1-458a-98ab-5c01d8373db8.jsonl` (komputer w Warszawie).
- Audyty procedur Onshape (Fable, Astra) i weryfikacja tej analizy (Fable, Astra): w katalogach roboczych sesji, nie w repo.
- Research: `20-analizy/2026-10-19-metodyka-modelowania-parametrycznego.md`.
