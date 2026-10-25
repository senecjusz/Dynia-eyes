Jesteś recenzentem. Tylko do odczytu: bez git pull, commitów, zmian w plikach. Piszesz po polsku, krótko.

Oceń krytycznie `50-elektronika/dynia-v2-plan.md`: tabelę funkcji obecnego firmware'u `50-elektronika/dynia/` (README.md i kod) i propozycję etapów odchudzonego programu `dynia-v2`. Jedyne wymagania: `30-projekt/PRD.md` §5–6 (sprzęt: ESP32-C3 SuperMini + PCA9685, 8 małych oczu SG90 lewo–prawo, duże oko 3 × MG90S: lewo–prawo, góra–dół, powieki razem na jednym serwie; PIR HC-SR501; zasilanie z powerbanku). Kalibracja modułów jest już zrobiona osobnym programem `50-elektronika/kalibracja/` z tabelą `50-elektronika/kalibracja-oczu.md`. Do ponownego użycia: `50-elektronika/oczy-ruch/`, `test-powerbank-wifi/`. Dynia stoi w szkole od 28.10.

Sprawdź: czy tabela jest zgodna z kodem (co robi, czy PRD tego wymaga, złożoność); czy etap 1 pokrywa minimum potrzebne, żeby dynia działała w szkole, i nie zawiera nic ponad PRD; czy kolejność etapów nie wymusi przepisywania kodu później; ryzyka techniczne etapu 1 (start bez skoku, prąd przy starcie wielu serw z powerbanku, NVS).

Zasada: NIE dopisuj funkcji. Propozycje poza PRD osobno, najwyżej 3 linie.
Wagi: KRYTYCZNE / WAŻNE / DROBNE z miejscem, scenariuszem, poprawką. Na końcu werdykt jednym zdaniem: czy plan etapu 1 można dać użytkownikowi do zatwierdzenia.


Runda 3: plan poprawiono po rundzie 2 (raporty 20-analizy/review/2026-10-24-dynia-v2-plan-astra-r2.md i -opus-r2.md). Sprawdź tylko, czy uwagi z rundy 2 są zamknięte i czy nic nowego nie jest błędne. Bardzo krótko: lista otwartych uwag (jeśli są) i werdykt.
