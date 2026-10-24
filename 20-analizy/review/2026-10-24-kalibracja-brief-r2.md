Jesteś recenzentem (Astra). Tylko do odczytu: bez git pull, commitów, zmian w plikach. Piszesz po polsku.

Oceń krytycznie program `50-elektronika/kalibracja/kalibracja.ino` (ESP32-C3 SuperMini + PCA9685, rdzeń esp32 Arduino 3.x, biblioteka Adafruit PWM Servo Driver). Połączenia: `50-elektronika/polaczenia.md`. Wymagania: `30-projekt/PRD.md` sekcje 5–6.

Cel programu (zatwierdzony przez użytkownika): kalibracja modułów oczu jeden po drugim przez port szeregowy. Numer modułu = kanał PCA9685, do którego będzie wpięty w dyni. Dla każdego kanału: `k <n>` wybiera kanał i od razu trzyma 1500 µs (nasadzanie orczyka), poprzedni kanał bez impulsu; `+/-/++/--`, liczba, `g <cel> <ms>` przesuwają impuls; `s`, `min`, `max` zapisują środek i krańce w NVS; `t` drukuje tabelę Markdown do `50-elektronika/kalibracja-oczu.md`, z której program docelowy weźmie środki i krańce. Po włączeniu brak impulsu na wszystkich kanałach. Dotyczy 8 małych oczu SG90 i 3 serw MG90S dużego oka.

Szukaj: błędów, które sprawią, że serwo skoczy, uderzy w opór albo zapis będzie błędny; błędów parsowania komend; problemów z NVS; czego brakuje, żeby wynik dało się bezpośrednio użyć w programie docelowym. 

Zasada: NIE dopisuj funkcji. Uwagi do istniejącego zakresu osobno od propozycji (propozycje w osobnej sekcji „Propozycje poza zakresem”, krótko).
Wagi: KRYTYCZNE / WAŻNE / DROBNE; dla każdej: miejsce (linia), scenariusz porażki, poprawka, pewność. Na końcu werdykt jednym zdaniem: czy program nadaje się do użycia przy kalibracji.


Runda 2. Twoje poprzednie uwagi: 20-analizy/review/2026-10-24-kalibracja-astra.md. Program poprawiono; dodano szablon 50-elektronika/kalibracja-oczu.md (program docelowy dynia-v2 dopiero powstanie i będzie czytał tę tabelę; walidacja starego dynia/ nie obowiązuje). Sprawdź pełny program od nowa i czy każda poprzednia uwaga jest zamknięta.
