# Model kontrolny dużego oka (E6, koncepcja v3.1)

Skrypty do koncepcji `20-analizy/2026-10-23-duze-oko-2c-koncepcja-v3.1.md`. Python 3 + numpy, bez innych bibliotek. Liczą na 10 rdzeniach (fork).

| Plik | Co robi |
|---|---|
| `e6model.py` | jedno źródło parametrów (`DEF`, nadpisywane JSON), kinematyka, bryły z dokładną funkcją odległości i próbnikiem powierzchni |
| `okno.py` | okno ogranicznika z dokładnych przekrojów Słupka i kardana przez płytę 3 mm; tabela co 5°, splajn do CAD, zakres mechaniczny, zapas w pracy, pas styku, otwór M4 → `okno.json`, `okno_splajn.npy` |
| `przemiatanie.py` | pełne przemiatanie z macierzą par i zagęszczeniem przy minimach → `przemiatanie.json`, wydruk 10 minimów w pracy i w całym zakresie |
| `b1_akceptacja.py` | akceptacja pomiarów przegubów (B1): przelicza komplet i daje TAK/NIE z naruszeniami |
| `b1_odniesienie.json` | wariant odniesienia (h 7, obudowa M5 Ø12); wzór pliku pomiarów |
| `odtworz.sh` | odtworzenie wszystkich wyników od zera |
| `v3/` | skrypty i wyniki koncepcji v3 (archiwum, nie używać) |

Kolejność: `okno.py` (nie zależy od przegubów), potem `przemiatanie.py` albo `b1_akceptacja.py <pomiary.json>`. Każda podana odległość jest dolnym ograniczeniem (próbki jednej bryły wobec dokładnej odległości drugiej, minus promień pokrycia próbek).
