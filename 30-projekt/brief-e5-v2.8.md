# Brief E5: v2.8 – śruby M3 w plastik zamiast M2 i wkładek (Onshape)

Wykonawca CAD. Obowiązuje `AGENTS.md`. Model: dokument „Oko F v2.5”, Part Studio „Oko F v2.5”, stan v2.7 (Twój commit `65c03c3`). Zmieniasz **Kasetę i Klamrę H**.

## Po co

Użytkownik złożył i skalibrował pierwszy moduł v2.7 (`70-budowa/dziennik.md`, 20/21.10). Dwie rzeczy do poprawy (decyzje 21.10 w `30-projekt/decyzje.md`):

1. **Uszy SG90 słabo trzymają.** Przednie ucho jest przykręcone M2 w otworze Ø2 bloku przedniego, nad którym jest kanał 2,8 × 1,5 na wstępnie wkręcony wkręt – pełny obwód otworu ma ok. 2 mm długości, a poziomy otwór Ø2 drukuje się nierówno. Wkręcanie wstępne okazało się zbędne: użytkownik wkłada śrubę pęsetą i dokręca przez okno po wsunięciu serwa. Użytkownik używa wszędzie **zwykłych śrub M3** (ma komplet 8–50 mm); M3 przechodzi przez ucho SG90 bez rozwiercania. M2 trzeba wyeliminować z mocowania serwa.
2. **Wkładki w uchach Pokrywy są zbędne.** Pokrywę zdejmuje się rzadko, więc śruba M3 może iść wprost w plastik – bez lutownicy.

## Zmiany

### E5.1 – blok przedni Kasety i Klamra H pod M3×10

- **Blok przedni:** usuń kanał na końcówkę wkrętu i jego fazkę (operacje i zmienne używane tylko przez nie). Otwór pod śrubę ucha przedniego (x 0, z −46,75): `Hole` Ø`m3Ciasny` (2,6), od siedziska uszu y −17,6 w głąb, głębokość pod **M3×10**: ucho 2,5 + 7,5 śruby + 0,5 zapasu = **8,0**, dno ≥ 0,6 do zewnętrznej powierzchni Kasety (dziś od siedziska do zewnętrznej ścianki przy x 0 jest ok. 9,65 – sprawdź i podaj). Ścianki bloku wokół otworu przy x ±2,75: (5,5 − 2,6)/2 = 1,45 – podaj zmierzone; jeśli < 1,2, napisz przed zapisem.
- **Klamra H:** otwór ucha tylnego (x 0, z −74,55) tak samo: Ø2,6, głębokość 8,0 (Klamra przy x 0 jest pełna od y −17,6 do −30,5).
- Zmienna nowa: `uchoSrubaGl` (8,0) albo wyrażenie z `uchoSg90T` 2,5, długości śruby 10 i zapasu 0,5 – bez liczb w drzewie.
- Wspólna zmienna dla obu otworów (jeden parametr średnicy i głębokości).

### E5.2 – ucha Pokrywy w Kasecie bez wkładek

- Otwory w obu uchach (±X, x ±20,45, y 0): zamiast Ø`wkladkaD` 4,4 → `Hole` Ø`m3Ciasny` (2,6), głębokość pod **M3×8** przez Pokrywę 3 mm: 5 + 0,6 zapasu = **5,6** (jak dziś), dno do skosu ucha ≥ 0,85 jak dziś.
- Pokrywa bez zmian (otwory Ø3,3 luźne).
- Usuń zmienne wkładek (`wkladkaD`, `wkladkaL`, `wkladkaZapas`, …), jeśli nic już ich nie używa – po E4.4 używały ich tylko ucha.

## Sprawdź

- Wszystkie operacje OK, szkice w pełni zdefiniowane, Mirror uch zmierzony osobno.
- Pomiary: otwór przedni Ø2,6 × 8,0 i ścianka do zewnątrz, otwór Klamry Ø2,6 × 8,0, otwory uch Ø2,6 × 5,6, brak kanału i fazki.
- Wsuwanie serwa z Klamrą od tyłu – teraz bez wystającego wkrętu pod przednim uchem.
- Objętości 10 brył wobec v2.7 (zmieniają się tylko Kaseta i Klamra) z rachunkiem.
- Orientacja druku bez zmian (Kaseta czołem, Klamra profilem); otwór bloku leży poziomo – podaj, czy sufit otworu Ø2,6 drukuje się bez podpór.

## Proces

1. **Najpierw sprawdź logowanie Onshape**; jeśli wylogowany, napisz od razu (użytkownik się zaloguje).
2. Krótki plan (operacje, zmienne) do orkiestratora przed zapisem.
3. Zmiany, kontrola, raport `40-cad/onshape/weryfikacja-v2.8.md`, commit, wiadomość z hashem „gotowe do eksportu: Kaseta, Klamra H”.
4. Eksport robi użytkownik (cały zestaw jednym plikiem 3MF); kontrolę siatek robi orkiestrator.

Budżet: **≤ 30 wywołań, ≤ 1 `GET /features`**. Każde wywołanie przez `req()`, zmienne dwuetapowo.
