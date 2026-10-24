Zadanie: review kalibracji, runda 2. **Pozostaje 1 problem KRYTYCZNY, 5 WAŻNYCH i 2 DROBNE.** Przeczytałem cały program, połączenia, PRD §5–6, szablon tabeli i poprzedni raport. Ocena statyczna, bez kompilacji i prób sprzętowych; zatwierdzone 1500 µs po `k <n>` przyjmuję jako wymaganie.

**Uwagi do istniejącego zakresu**

1. **KRYTYCZNE — końcówka inicjalizacji kasuje wyłączenie wszystkich kanałów.**  
   **Miejsce:** [kalibracja.ino:94](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/50-elektronika/kalibracja/kalibracja.ino:94), po pętli z linii 93.  
   **Scenariusz:** `ALL_LED_OFF_H` służy do zbiorczego zapisu rejestrów kanałów. Zapis `0x00` kasuje ustawione przed chwilą bity FULL_OFF we wszystkich 16 kanałach. Pozostaje `ON=0, OFF=0` — konfiguracja zabroniona w dokumentacji, bez gwarancji braku impulsów. Komentarz „kanały nadal pełne OFF” jest błędny.  
   **Poprawka:** usunąć zapis z linii 94. Późniejsze ustawienie wybranego kanału samo kasuje jego FULL_OFF; nie trzeba zbiorczego „odblokowania”. Potwierdzić start pomiarem wyjść.  
   **Pewność:** wysoka; [NXP, §7.3.4 i tabela 8](https://www.nxp.com/docs/en/data-sheet/PCA9685.pdf).

2. **WAŻNE — błędy I²C nadal pozwalają zapisać niepodany impuls.**  
   **Miejsce:** [linia 55](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/50-elektronika/kalibracja/kalibracja.ino:55), funkcje `wyslij()`, `ustaw()`, `wylacz()` oraz linie 89–95 i 119–120.  
   **Scenariusz:** kanał trzyma 1500; po utracie I²C użytkownik podaje `1800`. `us` zmienia się przed wysłaniem, a nieudane `ustaw()` pozostawia wcześniejsze `aktywny=true`. Następne `s` zapisuje **1800**, choć PCA nie przyjął polecenia. Ponadto nieudane wyłączenie poprzedniego kanału nie blokuje uruchomienia następnego. Sam ACK adresu nie potwierdza zapisu.  
   **Poprawka:** sprawdzać wyniki właściwych transakcji, w tym inicjalizacji i wyłączenia; aktualizować potwierdzony impuls dopiero po sukcesie. Po błędzie blokować zapisy kalibracji i dalsze przełączanie.  
   **Pewność:** wysoka. `writeMicroseconds()` ignoruje wynik wewnętrznego `setPWM()`, które zwraca status — [implementacja Adafruit](https://github.com/adafruit/Adafruit-PWM-Servo-Driver-Library/blob/master/Adafruit_PWMServoDriver.cpp).

3. **WAŻNE — `off` podczas `g` zatrzymuje ruch, ale pozostawia nacisk serwa.**  
   **Miejsce:** [linia 103](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/50-elektronika/kalibracja/kalibracja.ino:103), linie 103–104 i 154–155.  
   **Scenariusz:** podczas dochodzenia do ogranicznika użytkownik wysyła `off` + Enter. Znak `o` przerywa interpolację, `ustaw()` ponownie podaje aktualny impuls, a reszta komendy zostaje wyrzucona. Serwo nadal trzyma mechanizm przy oporze; potrzeba drugiego `off`.  
   **Poprawka:** zachować możliwość zatrzymania dowolnym znakiem, ale pełną komendę `off` przekazywać do istniejącej obsługi wyłączenia impulsu.  
   **Pewność:** wysoka.

4. **WAŻNE — przepełniona linia jest wykonywana jako poprawny prefiks.**  
   **Miejsce:** [linia 154](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/50-elektronika/kalibracja/kalibracja.ino:154).  
   **Scenariusz:** linia złożona z `k 1`, następnie 37 spacji i `abc` ma 43 znaki. Program zachowuje pierwsze 40, usuwa spacje i wykonuje **`k 1`**, zamiast odrzucić błędną komendę. Analogicznie `g 2400 1` + 32 spacje + `abc` wykonuje ruch do 2400.  
   **Poprawka:** po przekroczeniu 40 znaków oznaczyć całą linię jako błędną i odrzucić ją do końca wiersza.  
   **Pewność:** wysoka; wynika bezpośrednio z ograniczenia bufora i późniejszego `trim()`.

5. **WAŻNE — eksport tabeli może zostać ucięty bez komunikatu.**  
   **Miejsce:** [linia 84](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/50-elektronika/kalibracja/kalibracja.ino:84), eksport w liniach 71–79.  
   **Scenariusz:** tabela 11 kompletnych kanałów przekracza 500 bajtów. Domyślny bufor TX HWCDC ma 256 bajtów; przy `setTxTimeoutMs(0)` zapełnienie bufora może zakończyć zapis przed wysłaniem całości. Program ignoruje wyniki drukowania, więc mogą zniknąć wiersze albo ich fragmenty.  
   **Poprawka:** dla eksportu zapewnić ograniczone oczekiwanie i kontrolę pełnej transmisji; nie uznawać samego wywołania `printf()` za dostarczenie całej tabeli.  
   **Pewność:** wysoka co do możliwości krótkiego zapisu; występowanie zależy od odbioru USB. Potwierdza to [HWCDC rdzenia 3.3.12](https://github.com/espressif/arduino-esp32/blob/3.3.12/cores/esp32/HWCDC.cpp).

6. **WAŻNE — kontrakt tabeli pomija sposób przeliczania impulsów.**  
   **Miejsce:** [kalibracja.ino:91](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/50-elektronika/kalibracja/kalibracja.ino:91) oraz [kalibracja-oczu.md:3](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/50-elektronika/kalibracja-oczu.md:3).  
   **Scenariusz:** kalibracja przelicza µs przy założeniu **27 MHz i 50 Hz**, ale tabela tego nie zapisuje. Jeżeli dynia-v2 użyje domyślnych 25 MHz biblioteki, te same liczby na tym samym PCA dadzą inną szerokość impulsu — różnicę około 7,4%, czyli około 110 µs przy wartości 1500. Może to przekroczyć zmierzony kraniec.  
   **Poprawka:** zapisać w kontrakcie tabeli ustawienia 27 MHz/50 Hz oraz wymóg zgodnego przeliczania µs na ticki w dynia-v2. To warunek przeniesienia kalibracji.  
   **Pewność:** wysoka; wynika z [przeliczenia w bibliotece Adafruit](https://github.com/adafruit/Adafruit-PWM-Servo-Driver-Library/blob/master/Adafruit_PWMServoDriver.cpp). Nie potwierdzałem pomiarem rzeczywistej częstotliwości oscylatora.

7. **DROBNE — kierunek „lewo/prawo” nie ma ustalonej perspektywy.**  
   **Miejsce:** [kalibracja-oczu.md:7](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/50-elektronika/kalibracja-oczu.md:7).  
   **Scenariusz:** kalibrujący patrzy od tyłu, autor dynia-v2 interpretuje kierunek od przodu. Wypełnione „Min to” daje przeciwny kierunek ruchu.  
   **Poprawka:** dopisać jednoznaczną konwencję, np. „lewo/prawo patrząc na dynię od przodu”.  
   **Pewność:** wysoka.

8. **DROBNE — pozostała stara instrukcja nasadzania orczyka.**  
   **Miejsce:** [polaczenia.md:31](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/50-elektronika/polaczenia.md:31).  
   **Scenariusz:** opis `test-serwa/` nadal odsyła do komendy `1500`; po uruchomieniu kalibracji bez wyboru kanału zostanie ona odrzucona.  
   **Poprawka:** zastąpić odwołaniem do `k <n>`.  
   **Pewność:** wysoka.

**Stan każdej poprzedniej uwagi**

| Nr z rundy 1 | Status w rundzie 2 |
|---|---|
| 1. Stare impulsy przy inicjalizacji | **Niezamknięta.** Wyłączenie przeniesiono przed `begin()`, ale linia 94 kasuje FULL_OFF; niepowodzenie pierwszego wyłączenia nie zatrzymuje inicjalizacji. |
| 2. Ujemny czas `g` | **Zamknięta.** Czas 1–20000 ms, kontrolowane tokeny, ograniczenie impulsu przy wysyłaniu. |
| 3. Przyjmowanie błędnych komend | **Częściowo.** Wskazane wcześniej błędne tokeny są odrzucane; pozostaje wykonywanie uciętych linii. |
| 4. `off` podczas `g` | **Częściowo.** Ruch można przerwać, ale `off` nie wyłącza impulsu. |
| 5. Błędy I²C | **Niezamknięta.** Dodano sondowanie adresu; nadal brak potwierdzenia właściwych zapisów i poprawnej obsługi stanu po błędzie. |
| 6. Potwierdzenie zapisu NVS | **Zamknięta.** Sprawdzane są `begin()`, wynik `putInt()` i zgodny odczyt. `putInt()` wykonuje commit — [Preferences 3.3.12](https://github.com/espressif/arduino-esp32/blob/3.3.12/libraries/Preferences/src/Preferences.cpp). |
| 7. Nieznana pozycja po `off` | **Zamknięta przy poprawnej komunikacji.** Zapisy i ruch względny są blokowane do ponownego ustawienia impulsu. |
| 8. Znaczenie krańców | **Częściowo.** Dodano role, „Min to” i znaczenie środka powiek; pozostaje określenie perspektywy kierunków. |
| 9. Niezgodność ze starym firmware | **Nieaktualna zgodnie z briefem.** Nie stosuję ograniczeń starego `dynia/`; odbiorcą będzie dynia-v2. |
| 10. Nieaktualna instrukcja połączeń | **Częściowo.** Główny opis poprawiono, pozostało odwołanie w linii 31. |

**Propozycje poza zakresem**

Brak. Powyższe poprawki dotyczą istniejącego sterowania, zapisu i przekazania wyników.

Nie zmieniałem plików. Nie uruchamiałem procesów w tle.

**Werdykt: program w obecnej postaci nie nadaje się jeszcze do kalibracji zmontowanych mechanizmów oczu.**