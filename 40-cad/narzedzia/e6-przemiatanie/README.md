# Model kontrolny dużego oka (E6, koncepcja v3.2)

Skrypty do koncepcji `20-analizy/2026-10-23-duze-oko-2c-koncepcja-v3.2.md`. Python 3 + numpy, bez innych bibliotek. Liczą na 10 rdzeniach (fork).
Model analityczny jest narzędziem projektowym; końcowa kontrola kolizji idzie na siatkach z CAD.

| Plik | Co robi |
|---|---|
| `e6model.py` | jedno źródło parametrów (`DEF`, nadpisywane JSON), kinematyka, bryły z dokładną funkcją odległości i próbnikiem powierzchni, przeguby krzyżowe drukowane (`uGal`, `uOrcz`) i ich zakres kątowy `u_zakres()` |
| `okno.py` | okno ogranicznika z dokładnych przekrojów Słupka i kardana przez płytę 3 mm; tabela co 5°, splajn, zakres mechaniczny, zapas w pracy, pas styku, otwór M4 → `okno.json`, `okno_splajn.npy` |
| `okno_co5.py` | kontrola tabeli okna przez wykonawcę CAD (E6.2), nie zmieniać |
| `przemiatanie.py` | pełne przemiatanie z macierzą par, przypadkami kontrolnymi i zagęszczeniem przy minimach → `przemiatanie.json` (ze skrótem `skrot`), wydruk 10 minimów w pracy i w całym zakresie |
| `stale_pary.py` | pary stałe–stałe (słupki stopu, korpusy i uszy serw, wieżyczki, kable, wspornik) i tabela słupków stopu do CAD |
| `kinematyka.py` | zakresy serw, kąty przegubów wokół a1 i a2 (wymagane), kąty nacisku, momenty, stałe IK → `kinematyka.json` |
| `przeguby_akceptacja.py` | akceptacja wymiarów przegubów krzyżowych: przelicza komplet i daje TAK/NIE z naruszeniami |
| `przeguby_odniesienie.json` | wariant odniesienia v3.2 (4 przeguby drukowane); wzór pliku wejścia |
| `odtworz.sh` | odtworzenie wszystkich wyników od zera |
| `v3/`, `v3.1/` | skrypty i wyniki koncepcji v3 i v3.1 (archiwum, nie używać) |

Kolejność: `okno.py`, `przemiatanie.py`, `stale_pary.py`, `kinematyka.py`, `przeguby_akceptacja.py <plik.json> [--uzyj]`. Każda podana odległość jest dolnym ograniczeniem (próbki jednej bryły wobec dokładnej odległości drugiej, minus promień pokrycia próbek). `--uzyj` bierze zapisane przemiatanie tylko przy zgodnym skrócie parametrów i plików modelu.
