Zadanie: review kalibracji. **Wykryłem 2 problemy KRYTYCZNE, 7 WAŻNYCH i 1 DROBNY.** Ocena jest statyczna, bez kompilacji i prób na sprzęcie. Natychmiastowe 1500 µs po prawidłowym `k <n>` przyjmuję jako zatwierdzone zachowanie.

1. **KRYTYCZNE — stare impulsy podczas inicjalizacji.**  
   **Miejsce:** [kalibracja.ino:50](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/50-elektronika/kalibracja/kalibracja.ino:50), linie 50–53.  
   **Scenariusz:** restart ESP przy nadal zasilanym PCA9685. Biblioteczne `begin()` nie kasuje rejestrów kanałów, za to ustawia chwilowo 1000 Hz. Dotychczas aktywne kanały mogą generować impulsy o zmienionej długości, zanim pętla je wyłączy. Deklaracja „start bez impulsu” nie obejmuje tego przypadku.  
   **Poprawka:** jako pierwszą operację na PCA wyłączyć wszystkie wyjścia przez `Wire`, przed `pca.begin()` i zmianą częstotliwości; sprawdzić powodzenie wyłączenia.  
   **Pewność:** wysoka; potwierdzone w [implementacji Adafruit](https://github.com/adafruit/Adafruit-PWM-Servo-Driver-Library/blob/master/Adafruit_PWMServoDriver.cpp) i opisie RESTART w [dokumentacji NXP](https://www.nxp.com/docs/en/data-sheet/PCA9685.pdf).

2. **KRYTYCZNE — ujemny czas `g` omija granice impulsu.**  
   **Miejsce:** [kalibracja.ino:83](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/50-elektronika/kalibracja/kalibracja.ino:83), linie 83–88.  
   **Scenariusz:** przy `us=1500`, komenda `g 1200 -1` zamienia czas w warunku pętli na `4294967295`, ale dzieli przez ujemne `ms`. Po około 20 ms wylicza **7500 µs**, wysyłane bez `constrain()`. Pętla może działać około 49,7 dnia, ignorując kolejne komendy.  
   **Poprawka:** odrzucać niedodatni czas oraz przepełnienia przed rozpoczęciem ruchu; ograniczać również impuls wysyłany wewnątrz pętli.  
   **Pewność:** wysoka.

3. **WAŻNE — błędne komendy wykonują ruch zamiast zostać odrzucone.**  
   **Miejsce:** [kalibracja.ino:65](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/50-elektronika/kalibracja/kalibracja.ino:65), linie 65–69, 81–92.  
   **Scenariusz:** `k abc` wybiera kanał **0** i podaje 1500 µs; `k 1abc` wybiera 1; `g abc 1000` jedzie do **600 µs**; `g 1800` albo `g 1800 abc` wykonuje natychmiastowy skok do 1800. `1500abc` również jest przyjmowane. To wynika z konwersji prefiksu przez `toInt()` i braku kontroli argumentów.  
   **Poprawka:** sprawdzać pełne tokeny, liczbę argumentów, przepełnienie i zakres. Błędne wejście ma pozostawiać kanał oraz impuls bez zmian.  
   **Pewność:** wysoka; zachowanie potwierdza [kod `String` w rdzeniu 3.x](https://github.com/espressif/arduino-esp32/blob/3.3.2/cores/esp32/WString.cpp).

4. **WAŻNE — `off` nie działa podczas `g`.**  
   **Miejsce:** [kalibracja.ino:85](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/50-elektronika/kalibracja/kalibracja.ino:85), linie 85–88.  
   **Scenariusz:** podczas `g 2100 10000` mechanizm zaczyna naciskać na ogranicznik. Wysłane `off` czeka do zakończenia całego ruchu. `delay(20)` nie uruchamia parsera komend.  
   **Poprawka:** podczas ruchu obsługiwać istniejące `off` i natychmiast przerywać interpolację.  
   **Pewność:** wysoka.

5. **WAŻNE — błędy I²C nie zatrzymują kalibracji.**  
   **Mjsce:** [kalibracja.ino:30](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/50-elektronika/kalibracja/kalibracja.ino:30), także linie 50, 53, 68 i 77.  
   **Scenariusz:** wyłączenie poprzedniego kanału nie powiedzie się, ale następny zostaje uruchomiony. Albo zapis impulsu zawiedzie, a program pokaże nową wartość i pozwoli zapisać ją jako zmierzony kraniec.  
   **Poprawka:** kontrolować wynik inicjalizacji i zapisów; błąd ma zatrzymywać dalsze sterowanie i zapisy kalibracji. `writeMicroseconds()` nie zwraca powodzenia — potrzebny jest sprawdzany zapis przez `setPWM()` lub kontrolowany odczyt rejestrów.  
   **Pewność:** wysoka; wynika z [interfejsu biblioteki Adafruit](https://github.com/adafruit/Adafruit-PWM-Servo-Driver-Library/blob/master/Adafruit_PWMServoDriver.cpp).

6. **WAŻNE — brak potwierdzenia trwałego zapisu NVS.**  
   **Miejsce:** [kalibracja.ino:20](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/50-elektronika/kalibracja/kalibracja.ino:20), także linia 48.  
   **Scenariusz:** otwarcie NVS lub zapis zawiedzie. Program kontynuuje pracę, a `stan()` pokazuje stary wpis albo zero bez jednoznacznego komunikatu o nieudanym zapisie. Można uznać starą wartość za nową kalibrację.  
   **Poprawka:** sprawdzać `begin()` oraz `putInt()==sizeof(int32_t)`; potwierdzać zapis dopiero po sukcesie i odczycie zgodnej wartości.  
   **Pewność:** wysoka. `putInt()` sam wykonuje commit — problemem jest ignorowanie wyniku, nie brak `end()`. [Implementacja Preferences](https://github.com/espressif/arduino-esp32/blob/3.3.2/libraries/Preferences/src/Preferences.cpp).

7. **WAŻNE — po `off` program nadal traktuje ostatnie polecenie jako aktualne położenie.**  
   **Miejsce:** [kalibracja.ino:77](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/50-elektronika/kalibracja/kalibracja.ino:77), linie 77–87.  
   **Scenariusz:** `off`, ręczne przestawienie oka, następnie `g`. Pierwszy impuls wraca w okolice starego `us`, powodując skok. `s/min/max` po `off` zapisują starą wartość mimo braku trzymania serwa.  
   **Poprawka:** oznaczać wyjście jako nieaktywne; blokować zapis i płynny ruch do jawnego ponownego ustawienia impulsu. Komunikat powinien wyjaśniać, że pozycja fizyczna jest nieznana.  
   **Pewność:** wysoka.

8. **WAŻNE — tabela nie określa znaczenia krańców.**  
   **Miejsce:** [kalibracja.ino:35](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/50-elektronika/kalibracja/kalibracja.ino:35), linie 35–41.  
   **Scenariusz:** `min/max` oznaczają mniejszy i większy impuls, ale nie wskazują lewo/prawo, góra/dół ani zamknięta/otwarta. Dwa odwrotnie zamontowane serwa mogą mieć identyczną tabelę i przeciwny ruch. Dla powieki „środek” nie zastępuje pozycji zamkniętej.  
   **Poprawka:** w kontrakcie tabeli opisać rolę kanału i fizyczne znaczenie obu krańców; brakujące znaczenie można dopisać ręcznie podczas kalibracji, bez nowych komend.  
   **Pewność:** wysoka. Obecny firmware rozróżnia te znaczenia w [ruch.cpp:812](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/50-elektronika/dynia/ruch.cpp:812).

9. **WAŻNE — „poprawna” tabela może zostać odrzucona przez firmware.**  
   **Miejsce:** [kalibracja.ino:40](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/50-elektronika/kalibracja/kalibracja.ino:40).  
   **Scenariusz:** zestaw `800 / 1500 / 2200` przechodzi kontrolę tabeli. Obecny firmware ma granice **900–2100 µs**, środek małego oka **1200–1800 µs** i odległości krańców **30–700 µs**. Niepoprawne krańce przy odczycie zastępuje domyślnymi, więc wynik kalibracji może zostać utracony.  
   **Poprawka:** uzgodnić walidację eksportu z odbiorcą tabeli i opisać sposób przeniesienia danych. NVS `kalib` z kluczami `s/n/x` nie jest automatycznie odczytywany przez firmware używający `dynia` i `a/l/r`.  
   **Pewność:** wysoka; [walidacja](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/50-elektronika/dynia/ruch.cpp:565) i [odczyt](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/50-elektronika/dynia/ruch.cpp:812).

10. **DROBNE — instrukcja połączeń opisuje poprzednią obsługę programu.**  
    **Miejsce:** [polaczenia.md](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/50-elektronika/polaczenia.md), opis `kalibracja/`; w kodzie linie 65 i 74.  
    **Scenariusz:** użytkownik wykonuje instrukcję `1500` przed nasadzeniem orczyka, lecz bez wcześniejszego `k <n>` program odrzuca polecenie. Dokument wspomina też nieistniejącą stałą `KANAL`.  
    **Poprawka:** zaktualizować instrukcję do wyboru kanału przez `k <n>` oraz zapisu `s/min/max` i eksportu `t`.  
    **Pewność:** wysoka.

**Propozycje poza zakresem**

Brak — wymienione poprawki dotyczą istniejących komend, wiarygodności zapisu i przekazania wyniku.

Nie zmieniałem plików i nie uruchamiałem procesów w tle.

**Werdykt: program w obecnej postaci nie nadaje się do kalibracji zmontowanych mechanizmów oczu.**