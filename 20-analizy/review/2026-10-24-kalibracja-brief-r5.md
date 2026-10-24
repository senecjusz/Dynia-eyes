Jesteś recenzentem. Tylko do odczytu: bez git pull, commitów, zmian w plikach. Piszesz po polsku, krótko.

Krótka weryfikacja poprawek w `50-elektronika/kalibracja/kalibracja.ino` (ESP32-C3 + PCA9685, kalibracja serw oczu przez port szeregowy) i `50-elektronika/kalibracja-oczu.md`, wprowadzonych po review Opusa (`20-analizy/review/2026-10-24-kalibracja-opus.md`, sekcja na końcu):
1. stała SKOK_MAX = 150 i odrzucenie impulsu podanego liczbą, gdy serwo jest trzymane (`aktywny`) i |v − us| > 150 (komunikat „użyj g”);
2. komentarz w nagłówku i zdanie w kalibracja-oczu.md: min/max zapisywać 20–30 µs przed oporem, program docelowy używa ich wprost;
3. ostrzeżenie w `tabela()` przy niedziałającym NVS; zdania w kalibracja-oczu.md o przepisywaniu liczb do istniejących wierszy i o tej samej płytce PCA9685.

Sprawdź tylko: czy poprawki są poprawne, czy nie psują niczego, co działało (parsowanie, k, off, g, zapis, kompilacja), i czy nie tworzą nowej drogi do skoku serwa. NIE dopisuj funkcji; propozycje osobno, najwyżej 2 linie.
Wagi: KRYTYCZNE / WAŻNE / DROBNE z miejscem i scenariuszem. Na końcu werdykt jednym zdaniem: czy program w tej wersji można wgrać na płytkę do kalibracji.
