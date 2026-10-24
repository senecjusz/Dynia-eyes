Zadanie: review kalibratora, runda 3. **Wykryłem 1 problem KRYTYCZNY, 4 WAŻNE i 1 DROBNY.** Ocena całego programu jest statyczna, bez kompilacji i prób sprzętowych. Sprawdziłem wymagania, połączenia, tabelę i oba poprzednie raporty.

**Biblioteka:** Adafruit PWM Servo Driver **3.0.3** deklaruje `uint8_t setPWM(...)`: **0 oznacza sukces, 1 błąd**. Porównania w liniach 61 i 75 są prawidłowe. Wersji faktycznie zainstalowanej na stanowisku nie potwierdziłem; repo jej nie wskazuje. [Nagłówek](https://github.com/adafruit/Adafruit-PWM-Servo-Driver-Library/blob/3.0.3/Adafruit_PWMServoDriver.h), [implementacja](https://github.com/adafruit/Adafruit-PWM-Servo-Driver-Library/blob/3.0.3/Adafruit_PWMServoDriver.cpp).

**Uwagi do istniejącego zakresu**

1. **KRYTYCZNE — niepotwierdzony prescale może radykalnie zmienić impuls.**  
   **Miejsce:** [kalibracja.ino:106](/C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/50-elektronika/kalibracja/kalibracja.ino:106), linie 106–110.  
   **Scenariusz:** wynik `begin()` jest ignorowany, `setPWMFreq()` nie raportuje powodzenia, a `readPrescale()` ukrywa błąd odczytu. Przy nieudanym zapisie adresu odczytu może zwrócić pozostawione w buforze **0xFE**, zamiast rzeczywistego **131**. Program wyliczy wtedy 9,444 µs/tick i zaakceptuje inicjalizację. Polecenie **1500 µs** wyśle **159 ticków**, czyli około **777 µs** przy rzeczywistym prescale 131 i założeniu 27 MHz. Możliwy jest skok do oporu. To wniosek z implementacji [Adafruit](https://github.com/adafruit/Adafruit-PWM-Servo-Driver-Library/blob/3.0.3/Adafruit_PWMServoDriver.cpp) i [BusIO](https://github.com/adafruit/Adafruit_BusIO/blob/master/Adafruit_I2CDevice.cpp).  
   **Poprawka:** sprawdzać `begin()` oraz wykonać odczyt prescale z kontrolą powodzenia transmisji i zgodności z oczekiwanym **131**; potwierdzić również ustawienia MODE1, zwłaszcza AI i wybudzenie. Przy błędzie pozostawić sterowanie zablokowane.  
   **Pewność:** wysoka; obliczenie potwierdzone lokalnie, bez pomiaru sprzętowego.

2. **WAŻNE — błąd wyłączenia przy `k` pozostawia możliwość zapisu kalibracji.**  
   **Miejsce:** [kalibracja.ino:138](/C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/50-elektronika/kalibracja/kalibracja.ino:138), dodatkowo linie 52–53.  
   **Scenariusz:** aktywny kanał 0, następnie `k 1`; `wylacz(0)` zawodzi. Program wraca z zachowanym `aktywny=true`, więc `s/min/max` nadal zapisują wartości mimo błędu I²C. Z kolei po błędzie `ustaw()` stan pokazuje „BEZ impulsu”, chociaż PCA może nadal generować poprzedni impuls.  
   **Poprawka:** po nieudanym wyłączeniu unieważnić potwierdzony stan; komunikat powinien mówić „impuls niepotwierdzony”, dopóki wyłączenie nie zostanie potwierdzone.  
   **Pewność:** wysoka.

3. **WAŻNE — blokada po nieudanym starcie nie obejmuje wszystkich zapisów PCA.**  
   **Miejsce:** [kalibracja.ino:74](/C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/50-elektronika/kalibracja/kalibracja.ino:74), linie 103–105, 138–145.  
   **Scenariusz:** pierwsza transmisja podczas startu zawodzi, więc `pca.begin()` nie zostaje wykonane. Pierwsze `k 0` ustawia numer kanału, choć `ustaw()` odmawia sterowania. Następne `off` albo `k 1` wywołuje `setPWM()` przez `wylacz()` na niezainicjalizowanym obiekcie. Biblioteczny wskaźnik `i2c_dev` pozostaje pusty — możliwy wyjątek i restart ESP. [Kod biblioteki](https://github.com/adafruit/Adafruit-PWM-Servo-Driver-Library/blob/3.0.3/Adafruit_PWMServoDriver.cpp).  
   **Poprawka:** blokadą poprawnej inicjalizacji objąć również `wylacz()` i wybór kanału.  
   **Pewność:** wysoka.

4. **WAŻNE — interpolacja może chwilowo przekroczyć cel `g`.**  
   **Miejsce:** [kalibracja.ino:119](/C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/50-elektronika/kalibracja/kalibracja.ino:119), linie 119–124.  
   **Scenariusz:** warunek pętli i obliczenie pozycji odczytują czas osobno. Jeżeli pomiędzy nimi zadanie zostanie wywłaszczone, drugi czas może przekroczyć `ms`. Dla startu 1500, `g 1800 1` i odczytów czasu **0 ms / 2 ms** program wysyła **2100 µs**, a dopiero potem 1800. Ograniczenie 600–2400 tego nie zatrzymuje.  
   **Poprawka:** używać jednego odczytu czasu na iterację i ograniczyć czas interpolacji do `ms`.  
   **Pewność:** wysoka co do błędu obliczenia; występowania takiego przeplotu nie sprawdzałem sprzętowo.

5. **WAŻNE — eksport nadal nie wykrywa utraty danych.**  
   **Miejsce:** [kalibracja.ino:79](/C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/50-elektronika/kalibracja/kalibracja.ino:79), linie 79–93.  
   **Scenariusz:** timeout poprawia normalny eksport, ale wyniki `println/printf` pozostają ignorowane. Przy zatrzymaniu odbioru USB możliwy jest krótki zapis, a `flush()` może po wyczerpaniu oczekiwania usunąć dane. Licznik „koniec tabeli” liczy przygotowane wiersze, nie dostarczone. [HWCDC, rdzeń 3.3.12](https://github.com/espressif/arduino-esp32/blob/3.3.12/cores/esp32/HWCDC.cpp).  
   **Poprawka:** kontrolować pełną długość wysyłanych fragmentów; przerwany eksport oznaczać jako niekompletny.  
   **Pewność:** wysoka; prawdopodobieństwo zależy od odbioru USB.

6. **DROBNE — kontrakt tabeli nie określa zaokrąglania ticków.**  
   **Miejsce:** [kalibracja.ino:60](/C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/50-elektronika/kalibracja/kalibracja.ino:60) oraz [kalibracja-oczu.md:8](/C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/50-elektronika/kalibracja-oczu.md:8).  
   **Scenariusz:** kalibrator zaokrągla do najbliższego ticka, lecz dokument podaje samo dzielenie. Dynia-v2 używająca obcięcia wyśle dla 1500 µs **306 zamiast 307 ticków** — różnica około **4,889 µs**.  
   **Poprawka:** zapisać dokładną regułę `floor(µs / usNaTick + 0.5)` również w kontrakcie tabeli.  
   **Pewność:** wysoka.

**Zamknięcie uwag z rundy 1**

| Nr | Uwaga | Stan w rundzie 3 |
|---|---|---|
| 1 | Stare impulsy podczas inicjalizacji | Poprawiona kolejność wyłączenia; pozostają błędy inicjalizacji opisane powyżej. |
| 2 | Ujemny czas `g` | Zamknięta: pełne tokeny i zakres 1–20000 ms. |
| 3 | Błędne komendy powodują ruch | Zamknięta dla wskazanych przypadków, także przepełnionych linii. |
| 4 | `off` nie działa podczas `g` | Zamknięta: znaki komendy pozostają do wykonania przez `loop()`. |
| 5 | Błędy I²C | Częściowo: zapisy PWM sprawdzane; pozostają uwagi 1–3. |
| 6 | Brak potwierdzenia NVS | Zamknięta: `begin`, wynik zapisu i odczyt kontrolny. |
| 7 | Nieznana pozycja po `off` | Zamknięta dla blokowania zapisu i ruchu; komunikaty wymagają poprawki z uwagi 2. |
| 8 | Znaczenie krańców | Zamknięta w kontrakcie; rolę i „Min to” trzeba uzupełnić ręcznie. |
| 9 | Ograniczenia starego `dynia/` | Nieaktualna zgodnie z briefem. |
| 10 | Nieaktualna instrukcja połączeń | Zamknięta. |

`Preferences::putInt()` wykonuje commit; obecna kontrola wyniku nie wymaga dodatkowego `end()` po każdym zapisie. [Preferences 3.3.12](https://github.com/espressif/arduino-esp32/blob/3.3.12/libraries/Preferences/src/Preferences.cpp).

**Zamknięcie uwag z rundy 2**

| Nr | Uwaga | Stan w rundzie 3 |
|---|---|---|
| 1 | Kasowanie FULL_OFF pod koniec startu | Zamknięta: szkodliwy zapis usunięto. |
| 2 | Niepotwierdzone zapisy I²C | Częściowo; pozostają uwagi 1–3. |
| 3 | Gubienie `off` podczas `g` | Zamknięta. |
| 4 | Wykonywanie prefiksu za długiej linii | Zamknięta. |
| 5 | Ucinanie eksportu | Częściowo; pozostaje uwaga 5. |
| 6 | Brak kontraktu przeliczania impulsów | Zasadniczo zamknięta; doprecyzowanie zaokrąglania w uwadze 6. |
| 7 | Perspektywa lewo/prawo | Zamknięta: patrząc od przodu dyni. |
| 8 | Stara instrukcja nasadzania orczyka | Zamknięta. |

Do wykorzystania tabeli w dynia-v2 pozostaje ręczne uzupełnienie ról i „Min to” oraz potwierdzenie przypisania kanałów 12–14. Nie stosowałem walidacji starego `dynia/`.

**Propozycje poza zakresem**

Brak.

Nie zmieniałem plików. Nie uruchamiałem procesów w tle.

**Werdykt: program nie nadaje się jeszcze do kalibracji zmontowanych mechanizmów oczu, przede wszystkim z powodu możliwości zaakceptowania błędnego prescale.**