Zadanie: weryfikacja wskazanych poprawek po review Opusa.

- `SKOK_MAX` działa poprawnie: ±150 µs przechodzi, większa różnica jest odrzucana przed wysłaniem impulsu, bez zmiany `us`.
- Nie stwierdziłem regresji w parsowaniu, `k`, `off`, `g` ani zapisie NVS. Poprawki nie tworzą nowej drogi do skoku; zachowanie po `off` i przy `k` pozostaje dotychczasowe.
- Dokumentacja poprawnie określa margines 20–30 µs, przepisywanie liczb i użycie tej samej płytki PCA9685.
- **DROBNE — `kalibracja.ino:101`:** wynik `pisz()` ostrzeżenia NVS jest ignorowany. Przy niepełnym wysłaniu ostrzeżenia kolejne fragmenty mogą przejść, a pusta tabela nie dostanie komunikatu „TABELA NIEKOMPLETNA”.
- Kompilacja: nowe fragmenty nie wykazują błędu składni ani typów; pełnej kompilacji nie potwierdziłem — brak dostępnego kompilatora w PATH. Niczego nie zmieniałem, nic nie uruchomiłem w tle.

**Werdykt: program w tej wersji można wgrać na płytkę do kalibracji; wskazana drobna uwaga tego nie blokuje.**