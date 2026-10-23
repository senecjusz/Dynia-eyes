# Brief E6.6 – CAD dużego oka, etap 2b: napęd gałki i słupki stopu (23.10)

**Rola: jesteś wykonawcą CAD** (zasady jak w briefach E6.2/E6.3 i `AGENTS.md`; plan drzewa każdej części do orkiestratora przed zapisem; commity na swoją gałąź; nie czekamy na dane – brak = szacunek jako zmienna).

## Podstawa

Koncepcja **v3.2** `20-analizy/2026-10-23-duze-oko-2c-koncepcja-v3.2.md` (na `main`, e20be27): pkt 3.2–3.6 (pręty U–R–U, przeguby krzyżowe drukowane, Ramiona X/Y, Uchwyt, wycięcia), 5.2 (słupki stopu – tabela), 10 (zmiany istniejących części C2–C6), 12 (części i okucia), 13 (zmienne, K9). Kinematyka i model: `40-cad/narzedzia/e6-przemiatanie/` (`kinematyka.py`, `przeguby_akceptacja.py`).

Decyzje orkiestratora do v3.2:
- **C1 (wycięcie kołnierza Ramy) – nie robimy**: kolizję rozwiązano w Powiece górnej (E6.5: `mostekKat1` 56, `mostekKat2` 95, `uchoGR` 5,5). Realizator potwierdza to przemiataniem.
- **B9 – pasowanie sworzni przegubów:** otwory sworzni M2 drukowane podwymiarowo (zmienna `sworzenOtworDruk`, szacunek Ø1,8) i rozwiercane ręcznie wiertłem Ø2,0 do luzu c ≈ 0,03–0,05; w README druku.
- B1: wymiary przegubów to zmienne z przedziałami (v3.2 pkt 3.3), akceptacja `przeguby_akceptacja.py`, dowód fizyczny – **próbka P4 jako pierwsza część etapu 2b**.

## Zakres i kolejność

1. **P4 – próbka przegubu krzyżowego** (widełki + krzyżak + sworznie M2, obrotnica M3) jako osobne bryły w Part Studio – pierwsza.
2. **Zmiany istniejących części C2–C6** z v3.2 pkt 10 (wycięcie czaszy G przy uchu D; `rimX` 98/±30, `rimY` 102/±40; `wyciecieG` 82,5° w pasie x −14…24; Uchwyt dopasowany do nadlewów) – jeśli realizator po przeliczeniu zmieni tę listę, dostaniesz korektę.
3. **Uchwyt** (płyta okna R26,6, okno ogranicznika ze splajnu co 5° – tabela w VS, widełki stałe przegubów X i Y, kieszeń i łapy pod nadlewy Gałki, tuleja przednia, żebro mostka X).
4. **Ramiona X i Y** (r14,7 / r15,4, widełki stałe przegubu przy orczyku, kieszeń orczyka, M2 przez orczyk).
5. **Pręty X i Y** (z widełkami i tulejką obrotnicy M3, jedna część każdy) i **4 krzyżaki**.
6. **Słupki stopu powiek** według tabeli v3.2 pkt 5.2 (podparcia: klatka, łącznik do ramienia 200°, filar z tarczy).
7. K9 dla 3–5 zmiennych przegubów (np. `pktR`, długość pręta, `sworzenOtworDruk`) z pomiarem brył; odbiór (GET /features bez `includeGeometryIds=false`, znaczniki).

## Budżet

Etap 2b ≤ 260 żądań, `GET /features` ≤ 8; w każdej wiadomości suma etapu, E6 i roku. Eksport – ręcznie przez użytkownika na końcu. Po każdej części: odczyty, zrzut, stan, commit; dane do odbioru co 2–3 części.
