# Weryfikacja modelu kontrolnego koncepcji v3.1 dużego oka (E6.1d) – 23.10

Jesteś recenzentem (Astra – OpenAI Codex). Tylko do odczytu w repo; cały raport podajesz jako odpowiedź końcową. Po polsku. Wagi KRYTYCZNE / WAŻNE / DROBNE, liczby zamiast opinii, dla każdej uwagi miejsce, scenariusz porażki, poprawka albo test, pewność. Bez prognoz czasu.

## Zakres – wąski

Architektura jest przyjęta i nie podlega ocenie. Oceniasz **tylko to, co dała Twoja weryfikacja v3** (`20-analizy/review/2026-10-23-e6-koncepcja-v3-astra.md`: K1 okno z niepełnych przekrojów Słupka, K2 przemiatanie nie obejmuje geometrii i zawyża prześwity, W1 akceptacja B1, W2 czop i pręt, W4 NVS/rozruch, W5 T1 i plan B, W6 znak w B5, drobne), na nowym materiale:

- `20-analizy/2026-10-23-duze-oko-2c-koncepcja-v3.1.md` (tabela „uwaga → co zrobiono”);
- `40-cad/narzedzia/e6-przemiatanie/` – nowe skrypty `e6model.py`, `okno.py`, `przemiatanie.py`, `b1_akceptacja.py`, `odtworz.sh`, wejście `b1_odniesienie.json`, wyniki `okno.json`, `przemiatanie.json/.txt`, `b1_odniesienie_*.json/.txt`, `README.md`; stare skrypty v3 w `v3/`.

Sprawdź w szczególności:
1. Czy okno liczone jest z dokładnych przekrojów Słupka i kardana przez całą grubość płyty 3 mm, i czy splajn przez tabelę co 5° jest tym samym kształtem, który sprawdza przemiatanie (zapas w pracy 0,56; zakres mechaniczny ±28,03°/±18,05°; M4 1,37 mm).
2. Czy funkcje odległości są poprawne i każda podana wartość jest **dolnym ograniczeniem** (odjęty błąd próbkowania), i czy macierz par obejmuje wszystko, co się rusza (pręty z obudowami jako dwa walce, druty, ramiona, piasty, płyta okna, czasze, rura, kable).
3. Czy `b1_akceptacja.py` daje TAK/NIE z przeliczenia konkretnego kompletu (nie z progów) i czy wymaga wysokości gniazda obudowy.
4. Zmiany geometrii wymuszone pełnym modelem (pręt Ø4,5 z końcówką Ø8 – ścianka 1,5 mm wobec Twojego wymogu 2 mm; cokoły pod kołnierzami; przycięcie tylnych krawędzi powiek G 96,5°/D 76°; szersze wycięcie gałki dla pręta Y): czy są spójne i czy któraś z nich **zmienia części już zbudowane w CAD** w bazie – Rama (rura, rant po sferze R152, kołnierz R35,2 od z 6, boki osi), Gałka (czasza R28–30, krawędź 115°, płaska tylna krawędź z −12,68), Powieka górna (czasza −8,5…91°, rant 6,5°, mostek R4,5–8, ucho R6), Powieka dolna (−11,5…−90,5°, ucha R4), Słupek (R7,65, z −33…−5,5, kieszeń Ø11,3 od z −12,75, M4 na +x z −9,1, kanał nakrętki M5 na −x), Obejma.
5. Możesz uruchomić `odtworz.sh` / skrypty (python3 + numpy), jeśli sandbox pozwala; inaczej czytaj kod.

## Raport

- Na końcu **werdykt jednym zdaniem:** TAK (model kontrolny wiarygodny, v3.1 do briefu CAD etapu 2 po pomiarach B1/B4) / TAK PO POPRAWKACH – których / NIE – co jeszcze.
- Orkiestrator zapisze raport do `20-analizy/review/2026-10-23-e6-koncepcja-v3.1-astra.md`.
