Zadanie: **review Astra, runda 4**. Pozostaje **1 uwaga WAŻNA i 1 DROBNA; brak KRYTYCZNYCH**. Przeczytałem cały program, połączenia, PRD §5–6, kontrakt tabeli i poprzednie raporty. Ocena statyczna, bez kompilacji i prób sprzętowych.

**Uwagi do istniejącego zakresu**

1. **WAŻNE — ponowne zasilenie samego PCA9685 pozwala zapisać kalibrację bez impulsu.**  
   **Miejsce:** [kalibracja.ino:60](/C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/50-elektronika/kalibracja/kalibracja.ino:60), linie 60–72, 128 oraz 163–167.  
   **Scenariusz:** program działa; podczas przepinania przewodów PCA9685 traci VCC, ale ESP pozostaje zasilany przez USB. Po powrocie zasilania PCA ma ustawienia początkowe: SLEEP, wyłączoną autoinkrementację i FULL_OFF kanałów. Kolejne `k 1` może otrzymać poprawne ACK, ustawić `aktywny=true` i dopuścić `s`, chociaż serwo nie dostało 1500 µs. `usNaTick` nadal opisuje konfigurację sprzed zaniku zasilania. To wynika z [ustawień początkowych PCA9685](https://www.nxp.com/docs/en/data-sheet/PCA9685.pdf) oraz sposobu zapisu w [Adafruit `setPWM()`](https://github.com/adafruit/Adafruit-PWM-Servo-Driver-Library/blob/3.0.3/Adafruit_PWMServoDriver.cpp).  
   **Poprawka:** przed uznaniem odzyskanego sterowania za potwierdzone sprawdzić ponownie MODE1 i prescale. Niezgodność powinna blokować sterowanie i zapis do restartu ESP. Sama udana transmisja PWM nie wystarcza.  
   **Pewność:** wysoka dla zachowania po restarcie PCA; bez reprodukcji sprzętowej.

2. **DROBNE — kontrola eksportu nie potwierdza kompletności danych odebranych przez monitor.**  
   **Miejsce:** [kalibracja.ino:85](/C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/50-elektronika/kalibracja/kalibracja.ino:85), linie 85–104.  
   **Scenariusz:** monitor zostaje zamknięty lub połączenie USB przerwane podczas `t`. HWCDC może zwrócić pełną długość zapisu mimo zastępowania danych w buforze przy rozłączeniu; `flush()` także może usunąć niedostarczone dane. Wówczas `ok` pozostaje prawdziwe i ostrzeżenie nie powstaje. Dotyczy przerwanego odbioru, nie zwykłego eksportu przy działającym monitorze. [Implementacja HWCDC 3.3.12](https://github.com/espressif/arduino-esp32/blob/3.3.12/cores/esp32/HWCDC.cpp).  
   **Poprawka:** w instrukcji eksportu wymagać nagłówka, kompletnych wierszy i zakończenia ze zgodną liczbą wierszy; po przerwaniu połączenia powtórzyć `t`. To wystarczy dla obecnego ręcznego sposobu pracy.  
   **Pewność:** wysoka co do ograniczenia kontroli; bez próby USB.

**Stan każdej uwagi z rundy 3**

| Nr | Uwaga | Stan w rundzie 4 |
|---|---|---|
| 1 | Niepotwierdzony prescale podczas startu | **Zamknięta:** sprawdzane `begin()`, transmisje odczytu, prescale 131, SLEEP i AI; błąd blokuje sterowanie. |
| 2 | Nieudane wyłączenie przy `k` pozostawia możliwość zapisu | **Zamknięta:** `aktywny=false`; stan wskazuje impuls niepotwierdzony. |
| 3 | Blokada startu pomija `wylacz()` i wybór kanału | **Zamknięta:** obie ścieżki sprawdzają `usNaTick`. |
| 4 | Interpolacja `g` przekracza cel | **Zamknięta:** jeden odczyt czasu, koniec interpolacji przed obliczeniem kroku poza zakresem. |
| 5 | Eksport nie wykrywa utraty danych | **Częściowo zamknięta:** długości zapisów są kontrolowane; pozostaje ograniczenie opisane wyżej, ocenione jako DROBNE. |
| 6 | Brak reguły zaokrąglania ticków | **Zamknięta:** identyczny wzór znajduje się w kodzie i kontrakcie tabeli. |

Nie znalazłem dalszych błędów parsowania w opisanej obsłudze monitora. Nieprawidłowe tokeny, dodatkowe argumenty, przepełnione linie i niedozwolone czasy `g` są odrzucane. `off` zachowuje pełną komendę podczas ruchu. Zapis NVS sprawdza otwarcie, wynik `putInt()` i odczyt kontrolny; `putInt()` wykonuje commit. [Kod Preferences](https://github.com/espressif/arduino-esp32/blob/3.3.12/libraries/Preferences/src/Preferences.cpp).

Do wykorzystania wyniku w dynia-v2 trzeba zachować przypisania ról kanałów, uzupełnić „Min to” i potwierdzić kanały 12–14 w [kalibracja-oczu.md:22](/C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/50-elektronika/kalibracja-oczu.md:22). Eksport pozostawia te pola puste; opisane ręczne uzupełnienie zapewnia potrzebne znaczenie krańców.

**Propozycje poza zakresem**

Brak.

Nie zmieniałem plików. Nie uruchamiałem procesów w tle.

**Werdykt: program nadaje się do ręcznej kalibracji przy stabilnych połączeniach, pod warunkiem restartu ESP po zaniku zasilania PCA9685 i sprawdzenia kompletności odebranej tabeli.**