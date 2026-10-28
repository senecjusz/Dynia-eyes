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
| 0 | małe oko | 1500 | 1100 | 1800 | prawo | nowy moduł 27.10: przy 1500 patrzy prosto (potwierdził użytkownik), krańce bez buczenia; zapisane w NVS kalibratora |
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

**Uwagi z testu 25.10:** moduł „8” buczy przy środku, a ostatni złożony moduł chodzi ciężko. Oba do sprawdzenia przed montażem w dyni. Kierunek „Min to” sprawdzony 27.10 tylko na kanale 0. Pozostałe moduły mają ten sam wydruk i serwo, więc najpewniej też „prawo”, ale to założenie.

**27.10, sprawdzenie na stole (kanał 0 kalibratora):** trzy nowe moduły, po kolei. Każdy przy 1500 patrzy prosto, Min 1100 = prawo, Max 1800 = lewo, bez buczenia (potwierdził użytkownik). Trzeci z nich to ósme małe oko (użytkownik 27.10): **wszystkie 8 małych oczu skalibrowane** na wspólnych wartościach 1500 / 1100 / 1800. Kanał w dyni każdy moduł dostaje przy montażu (numer na module i wtyczce).

## Duże oko – pierwszy ruch gałki (28.10, `test-galka/`)

- Orczyki obu serw gałki nasadzone przy 1500 µs (kalibrator, kanały stołu 1–4).
- Na stole: **góra–dół na kanale 12, lewo–prawo na kanale 11** (pomyłka w liczeniu slotów; kanały liczą się od 0, czwórki 0–3, 4–7, 8–11, 12–15). W dyni ma być 12 = lewo–prawo, 13 = góra–dół: przed montażem przełożyć wtyczki.
- Zakresy sprawdzone sinusem i w trybie „losowo”, bez oporu (użytkownik: „jest ok”, „gałka chodzi”):
  - góra–dół ±239 µs (±21,5° serwa), czyli pełna krótsza strona z kinematyki v3 (+26,6° / −21,5° serwa dla ±25° gałki);
  - lewo–prawo ±284 µs (±25,6° serwa), czyli pełna krótsza strona z kinematyki v3 (+33,5° / −25,6° dla ±35°).
- Dłuższych stron (+57 µs G–D, +88 µs L–P) jeszcze nie sprawdzono. Nie wiadomo też, który kierunek µs to „+” z kinematyki.
- **Sprzężenie osi widoczne na sprzęcie:** ruch L–P ściąga gałkę w pionie. Kinematyka v3 podaje, że przy L–P ±35° G–D musi dodać +4,4° serwa (ok. 49 µs, rośnie z kwadratem wychylenia). Do zaprogramowania w programie docelowym; znak w µs do ustalenia na sprzęcie.
- Środek, min i max gałki do `kalibracja.h` dopiero po przełożeniu na kanały docelowe.
