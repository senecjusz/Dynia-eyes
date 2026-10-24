# Review r5 – poprawki kalibracji (Opus)

Zakres: `50-elektronika/kalibracja/kalibracja.ino` (stan roboczy, niezacommitowany) i `50-elektronika/kalibracja-oczu.md` (plik nieśledzony), tylko poprawki W1, W2, D1, D3 i D5 z `2026-10-24-kalibracja-opus.md`. Nie mogłem skompilować, bo na tym komputerze nie ma `arduino-cli` w PATH. Kompilację sprawdziłem tylko czytając kod.

## Wynik sprawdzenia poprawek

1. **SKOK_MAX = 150 (l. 20, 192–193): poprawne.**
   - Sprawdzenie stoi po kontroli zakresu 600..2400, więc |v − us| ≤ 1800 i nic się nie przepełnia.
   - `v` to `long`, `us` to `int`, więc `abs()` dostaje `long`. Działa i z `std::abs` (core 3.x), i z makrem (core 2.x).
   - `printf` dostaje dwa `int` pod `%d`, typy się zgadzają.
   - Parsowanie bez zmian: „-” i „--” nie przechodzą przez `liczba()` i trafiają do swoich komend, a „-50” odrzuca kontrola zakresu.
   - `k` bez zmian: ustawia 1500 przez `ustaw()`, z pominięciem tego sprawdzenia, czyli tak jak przed poprawką.
   - `+`, `-`, `++`, `--` (najwyżej 50 µs), `g`, `off`, `s`, `min`, `max` i zapis do NVS bez zmian.
   - Po przerwanym `g` `us` to pozycja przerwania (`ustaw(us)`), więc kolejny impuls liczbą jest ograniczany względem niej. Dobrze.
2. **Komentarz l. 5–6 i zdanie l. 10 w kalibracja-oczu.md:** zgodne ze sobą i z kodem.
3. **Ostrzeżenie NVS w `tabela()` (l. 101):** poprawne. Wypisuje się nad tabelą, więc nie trafi do wklejanych wierszy. Gdy NVS nie działa, `odczyt()` dostaje wartość domyślną 0, więc wynik to „0 wierszy” plus ostrzeżenie. Zdania z l. 11–12 (przepisać do istniejących wierszy, ta sama płytka) są poprawne.

Poprawki nie tworzą nowej drogi do skoku serwa. Wszystkie drogi z uwag niżej istniały już przed poprawkami.

## Uwagi

**KRYTYCZNE:** brak.

**WAŻNE:** brak.

**DROBNE**

- **D-r5-1. Ograniczenie nie działa, gdy serwo nie jest trzymane (l. 193, warunek `aktywny`).**
  - Miejsce: impuls liczbą po `off`, po błędzie I2C albo po nieudanym `g` (wtedy `aktywny = false`).
  - Scenariusz: `off`, potem literówka „2400” zamiast „1400”. Serwo stoi tam, gdzie było (≈ `us`), i skacze w opór.
  - To działanie zgodne z komentarzem l. 10 („pozycja nieznana”), a nie regres.
  - Pewność: wysoka co do mechanizmu.
- **D-r5-2. `g` z krótkim czasem też jest skokiem (l. 155–168, 203).**
  - Scenariusz: komunikat „użyj g” kieruje do `g`, a literówka „g 2400 20” (zamiast 2000) daje ruch o 900 µs w 20 ms.
  - Ta droga istniała przed poprawką.
  - Pewność: wysoka.
- **D-r5-3. Zdanie „program docelowy używa ich wprost” to wymaganie, nie opis obecnego kodu.**
  - Miejsce: l. 5 w .ino, l. 10 w kalibracja-oczu.md.
  - Obecne `dynia/ruch.cpp` (l. 92–101) używa krańców tylko dla powiek (`a`/`b`) i małych oczu (`kl`/`kp`).
  - Duże oko lewo–prawo i góra–dół bierze środek ± `ZAKRES_DO_X/Y · US_NA_STOPIEN` (±278 / ±167 µs) i zapisanego min/max nie używa.
  - Do tego `US_MIN_ABS`/`US_MAX_ABS` = 900/2100 po cichu obcina krańce skalibrowane poza tym zakresem.
  - Scenariusz: kraniec dużego oka bliżej środka niż 278 µs i dynia dojeżdża do oporu mimo kalibracji.
  - Dotyczy programu docelowego, nie kalibracji.
  - Pewność: wysoka co do kodu, średnia co do tego, czy „program docelowy” to `dynia/` czy przyszły `dynia-v2`.

## Propozycje (poza zakresem)

- Po `off` ograniczać impuls liczbą względem ostatniego `us` (ten sam kanał). W `g` wymagać czasu ≥ |Δ| · ~5 ms/µs.
- W `dynia/` dla dużego oka ograniczać cel do zapisanych min/max, albo zmienić zdanie w kalibracja-oczu.md tak, żeby dotyczyło tylko małych oczu i powiek.

## Werdykt

Tak, program w tej wersji można wgrać na płytkę do kalibracji. Poprawki są poprawne, niczego nie psują i nie dodają nowej drogi do skoku. Zastrzeżenie: kompilacji nie uruchomiłem.

---
Programista: D-r5-3 dotyczy starego `dynia/`; nowy `dynia-v2` (krok 3) ma używać min/max z tabeli dla wszystkich kanałów – wymaganie dla dynia-v2.
