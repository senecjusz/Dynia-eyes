# Kalibracja oczu

Wynik programu `kalibracja/` (komenda `t`), wklejony tutaj. Program docelowy bierze stąd środek i krańce każdego kanału.

- **Numer modułu = kanał PCA9685**, do którego moduł jest wpięty w dyni. Numer napisany na module i na wtyczce.
- Impulsy w µs. `Min` i `Max` to mniejszy i większy impuls, zawsze `Min < Środek < Max`.
- „Min to”: co robi oko przy impulsie `Min` (lewo / prawo, góra / dół, zamknięta / otwarta), wpisane ręcznie przy kalibracji. **Lewo i prawo patrząc na dynię od przodu.**
- Impulsy liczone przy PCA9685 z oscylatorem 27 MHz i 50 Hz (prescale 131, `ticki = floor(µs / (1e6 · (prescale + 1) / 27e6) + 0,5)`, impuls od ticku 0). Program docelowy musi przeliczać µs tak samo, inaczej ta sama liczba da inny impuls (przy 25 MHz ok. 110 µs różnicy przy 1500).
- Powieki: `Środek` = pozycja spoczynkowa do nasadzania; krańce to zamknięte i otwarte.
- `Min` i `Max` zapisane 20–30 µs przed oporem (serwo nie buczy); program docelowy używa ich wprost, bez marginesu.
- Liczby z `t` przepisać do istniejących wierszy poniżej (nie zastępować tabeli).
- Kalibracja dotyczy tej płytki PCA9685, na której ją zrobiono; tę samą montować w dyni.
- Powtórna kalibracja tylko po zdjęciu orczyka albo wymianie serwa, i tylko tego modułu.

| Kanał | Moduł | Środek µs | Min µs | Max µs | Min to | Uwagi |
|---|---|---|---|---|---|---|
| 0 | małe oko | 1500 | 1100 | 1800 | | wspólne dla wszystkich małych oczu (test 25.10) |
| 1 | małe oko | 1500 | 1100 | 1800 | | wspólne dla wszystkich małych oczu (test 25.10) |
| 2 | małe oko | 1500 | 1100 | 1800 | | wspólne dla wszystkich małych oczu (test 25.10) |
| 3 | małe oko | 1500 | 1100 | 1800 | | wspólne dla wszystkich małych oczu (test 25.10) |
| 4 | małe oko | 1500 | 1100 | 1800 | | wspólne dla wszystkich małych oczu (test 25.10) |
| 5 | małe oko | 1500 | 1100 | 1800 | | wspólne dla wszystkich małych oczu (test 25.10) |
| 6 | małe oko | 1500 | 1100 | 1800 | | wspólne dla wszystkich małych oczu (test 25.10) |
| 7 | małe oko | 1500 | 1100 | 1800 | | wspólne dla wszystkich małych oczu (test 25.10) |
| 12 | duże oko: lewo–prawo | | | | | kanały 12–15 jak w `dynia/`, do potwierdzenia |
| 13 | duże oko: góra–dół | | | | | |
| 14 | duże oko: powieka górna | | | | | |
| 15 | duże oko: powieka dolna | | | | | |
