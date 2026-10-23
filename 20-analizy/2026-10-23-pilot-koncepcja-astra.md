**E7.3 — koncepcja pilota dyni, Astra, 23.10.2026**

Rekomenduję **joystick analogowy z przyciskiem oraz trzy osobne przyciski: OK, Wstecz i Bu!**, ekran pionowo, Arduino_GFX i zasilanie USB z powerbanku. Taki pilot obsłuży obecne API bez zmiany protokołu. Najważniejsze wymaganie programowe: wysyłanie joysticka musi zależeć od aktywnego trybu — inaczej przerwie efekty uruchamiane przyciskami.

Raport powstał z odczytu repo, lokalnego rdzenia Arduino oraz dokumentacji i kodu bibliotek. **Nie wykonywałem kompilacji, testów sprzętowych ani połączeń z dynią.** Dane Waveshare dotyczą oryginału; zgodność klona pozostaje do potwierdzenia.

**1. Płytka: ustalone fakty i ograniczenia**

Źródła producenta:

- [W1 — wiki ESP32-C6-LCD-1.47](https://www.waveshare.com/wiki/ESP32-C6-LCD-1.47).
- [W2 — schemat płytki](https://files.waveshare.com/wiki/ESP32-C6-LCD-1.47/ESP32-C6-LCD-1.47_schemetics.pdf), sprawdzony również wizualnie.
- [W3 — oficjalne przykłady Arduino i ESP-IDF](https://files.waveshare.com/wiki/ESP32-C6-LCD-1.47/ESP32-C6-LCD-1.47-Demo.zip).
- [W4 — karta ekranu](https://files.waveshare.com/wiki/ESP32-C6-LCD-1.47/1.47inch_LCD_Datasheet.pdf).
- [E1 — dokumentacja ESP32-C6](https://www.espressif.com/sites/default/files/documentation/esp32-c6_datasheet_en.pdf).

| Element | Fakt dla oryginału Waveshare |
|---|---|
| Procesor | ESP32-C6FH4, główny rdzeń RISC-V do 160 MHz, 512 KB HP SRAM, 4 MB flash |
| Wyświetlacz | **ST7789**, 172 × 320, SPI; bez dotyku |
| Ekran — piny | MOSI **6**, SCLK **7**, CS **14**, DC **15**, RESET **21**, podświetlenie **22** |
| Karta TF — piny | MISO **5**, MOSI **6**, SCLK **7**, CS **4**; ekran i TF współdzielą SPI |
| RGB | WS2812B-0807, sterowanie **GPIO8** |
| BOOT | **GPIO9**, zwierany do GND |
| RESET | Wejście resetu układu; nie jest przyciskiem aplikacji |
| USB | GPIO12 D−, GPIO13 D+; pozostawić do USB |
| Zasilanie | USB 5 V → LDO **ME6217C33M5G** → 3,3 V |
| Akumulator | **Brak ładowarki, złącza akumulatora i układu zarządzania jego zasilaniem** na schemacie |

Wyprowadzone sygnały na złączu oryginału: **GPIO0–5, GPIO9, GPIO12–13, GPIO16–20, GPIO23**, a także 5 V, 3,3 V i GND. GPIO16/17 opisano jako TXD/RXD.

Po pozostawieniu działających LCD, TF, RGB, USB i BOOT wolne są:

**GPIO0, 1, 2, 3, 16, 17, 18, 19, 20, 23 — razem 10 GPIO.**

Z nich **GPIO0–3 mają ADC1**, więc dwie osie joysticka nie wymagają dodatkowego przetwornika. GPIO4/5 również mają ADC, ale są połączone z TF; nie warto ich odzyskiwać, skoro dostępne są cztery inne wejścia analogowe. GPIO16/17 można wykorzystać, jeżeli aplikacja nie używa UART0.

Nie używać BOOT jako głównego przycisku zabawy: przytrzymany przy włączeniu może uruchomić tryb pobierania firmware. GPIO8/9 są pinami startowymi; dokumentacja C6 wymienia też GPIO4/5 i GPIO15 jako piny konfiguracji startowej. Proponowane wejścia omijają wszystkie te piny.

**Arduino i biblioteki**

Lokalnie potwierdziłem rdzeń **esp32 3.3.12** i profil `esp32:esp32:esp32c6`, nazwany „ESP32C6 Dev Module”, z 160 MHz i 4 MB flash: [boards.txt](/home/rkp/.arduino15/packages/esp32/hardware/esp32/3.3.12/boards.txt:799).

| Rozwiązanie | Potwierdzone wsparcie i ocena |
|---|---|
| **Arduino_GFX** | W archiwum **1.6.9** są ścieżki dla C6 oraz gotowa definicja `WAVESHARE_ESP32_C6_LCD_1_47`. Dobry wybór do tego pilota |
| **LVGL** | Waveshare dostarcza przykład z **8.3.10** i własnym sterownikiem ST7789 opartym na `SPI`. LVGL obsługuje interfejs, nadal potrzebuje warstwy wyświetlania i wejść |
| **TFT_eSPI** | W sprawdzonym **2.5.43** wybór sterownika procesora rozróżnia S3 i C3, ale nie C6. Nie traktowałbym tej wersji jako gotowego rozwiązania dla tej płytki |
| `WiFi`, `HTTPClient`, `SPI`, `Preferences` | Dostępne z rdzeniem Arduino |
| Parser JSON | Proponuję ArduinoJson; wymaga dodania |

Źródła kodu: [Arduino_GFX 1.6.9](https://downloads.arduino.cc/libraries/github.com/moononournation/GFX_Library_for_Arduino-1.6.9.zip), [TFT_eSPI 2.5.43](https://downloads.arduino.cc/libraries/github.com/Bodmer/TFT_eSPI-2.5.43.zip), [indeks bibliotek Arduino](https://downloads.arduino.cc/libraries/library_index.json.gz).

W `/home/rkp/Arduino/libraries` znalazłem wyłącznie Adafruit BusIO i bibliotekę PCA9685. **Arduino_GFX, TFT_eSPI, LVGL i ArduinoJson nie są tam zainstalowane.** Wsparcie w kodzie biblioteki nie zastępuje sprawdzenia kompilacji z dokładnie 3.3.12.

Konfiguracja Arduino_GFX dla oryginału używa `Arduino_HWSPI`, ST7789, rozmiaru 172 × 320 i **przesunięcia kolumn o 34 piksele**. Przed inicjalizacją LCD ustawia GPIO4, czyli CS karty, w stan wysoki. To gotowy punkt odniesienia.

Pułapki:

- Domyślne piny SPI profilu „ESP32C6 Dev Module” **nie odpowiadają tej płytce**. Wszystkie piny LCD trzeba podać jawnie.
- Także domyślne I²C koliduje z proponowanymi funkcjami: SCL to GPIO22, czyli podświetlenie.
- Wiki zawiera fragmenty instrukcji skopiowane z S3. Dla tej płytki wybieramy **C6**.
- Pełny bufor RGB565 zajmuje `172 × 320 × 2 = 110 080 B`, czyli 107,5 KiB. Podwójny — 215 KiB. Nie jest potrzebny do prostego menu.
- Dla klona trzeba potwierdzić pinout, inicjalizację, przesunięcie obrazu, kolory i polaryzację podświetlenia.

**2. Wejścia: trzy warianty**

Wszystkie poniższe przypisania zachowują TF, RGB i USB. Numery oznaczają GPIO, nie pozycję na złączu.

| Wariant | Podłączenie | Ergonomia i odporność |
|---|---|---|
| **A — joystick + OK/Wstecz/Bu**, rekomendowany | X→0, Y→1, klik joysticka→18, OK→19, Wstecz→20, Bu→23 | Naturalna Pacynka w dwóch osiach. Lewy kciuk prowadzi oczy, prawy obsługuje przyciski. Wystający joystick wymaga ochrony przed uderzeniem |
| **B — krzyżak z czterech przycisków + OK/Wstecz/Bu** | lewo→0, prawo→1, góra→2, dół→3, OK→18, Wstecz→19, Bu→20 | Najbardziej odporny; niski profil. Pacynka działa skokowo lub przez narastanie wychylenia podczas przytrzymania. Trudniej uzyskać subtelny ruch i przekątne |
| **C — joystick + enkoder z klikiem + Wstecz/Bu** | X→0, Y→1, enkoder A→2, B→3, klik enkodera→18, Wstecz→19, Bu→20; klik joysticka→23 | Wygodne przewijanie długiej listy, lecz dwa różne manipulatory zwiększają złożoność. Enkoder wystaje, wymaga poprawnego dekodowania drgań styków |

**Wariant A — tabela połączeń**

| Element | Połączenie |
|---|---|
| Potencjometry joysticka | Zasilanie **3,3 V**, GND wspólne |
| VRx | GPIO0 / ADC1_CH0 |
| VRy | GPIO1 / ADC1_CH1 |
| SW joysticka | GPIO18 ↔ styk ↔ GND |
| OK | GPIO19 ↔ styk ↔ GND |
| Wstecz | GPIO20 ↔ styk ↔ GND |
| Bu! | GPIO23 ↔ styk ↔ GND |
| Wejścia przycisków | `INPUT_PULLUP`; dla przewodów w obudowie można dodać zewnętrzne 10 kΩ do 3,3 V |
| Filtrowanie osi — propozycja | Szeregowo 1 kΩ, przy ADC 100 nF do GND; 100 nF przy zasilaniu joysticka |

Dotyczy to pasywnego joysticka potencjometrycznego. **Nie podawać 5 V na jego osie.** Jeżeli posiadany moduł ma elektronikę, najpierw sprawdzić jego schemat.

Proponowana obsługa:

- odczyt osi 100 Hz, krótki filtr medianowy lub uśredniający;
- kalibracja minimum/środka/maksimum, osobno dla obu kierunków każdej osi;
- martwa strefa startowo 8–12%, z histerezą — wartości do sprawdzenia na egzemplarzu;
- mapowanie do `−100…100`, ograniczenie wyniku przed HTTP;
- przyciski: filtr drgań około 20 ms, zdarzenie pojedynczego naciśnięcia;
- przy uruchomieniu i odzyskaniu sieci wymagane puszczenie przycisków i wycentrowanie joysticka.

C6 ma ADC1 na tych pinach; nie dotyczy ich problem współdzielenia ADC2 z Wi-Fi znany z klasycznego ESP32. Zakres i dokładność ADC należy przyjmować z dokumentacji **C6**, nie z tabel innego wariantu ESP32. Kalibracja joysticka powinna uwzględniać rzeczywiste krańce i ewentualne nasycenie pomiaru.

Dla dziecka proponuję osobne OK zamiast wymagania kliku joystickiem: naciskanie gałki często zmienia jej wychylenie. Klik joysticka może służyć wyłącznie do mrugania w Pacynce.

**3. Interfejs 172 × 320 bez dotyku**

Proponuję pionowy ekran, duże ikony z krótkimi polskimi podpisami, tekst główny około 24–28 px. Stan połączenia musi być rozpoznawalny po symbolu i napisie, nie tylko kolorze. Długie nazwy zawijać na dwie linie; unikać ciągłego przewijania tekstu.

Układ: pasek stanu około 24 px, treść, na dole podpowiedź działania OK i Wstecz. Ikony oraz font z polskimi znakami we flash; karta TF nie jest potrzebna.

Przykładowe ekrany:

```text
┌──────────────────┐  ┌──────────────────┐
│ DYNIA       ● OK │  │ PACYNKA     ● OK │
│                  │  │                  │
│ > Pacynka        │  │     (  ●  )      │
│   Efekty         │  │                  │
│   Emocje         │  │     lewo/prawo   │
│   Straszaki      │  │     góra/dół     │
│   Podgląd        │  │                  │
│                  │  │ Klik: mrugnij    │
│ OK: wybierz      │  │ OK: powieki      │
└──────────────────┘  │ Wstecz: automat  │
                      └──────────────────┘

┌──────────────────┐  ┌──────────────────┐
│ EFEKTY      2/…  │  │ STRASZAKI   ● OK │
│                  │  │                  │
│   Fala           │  │       BU!        │
│ > Zdziwienie     │  │                  │
│   Mrugnięcie     │  │   Gotowa          │
│                  │  │                  │
│ OK: uruchom      │  │ > Zdziwienie     │
│ Wstecz: menu     │  │   Mrugnięcie     │
└──────────────────┘  └──────────────────┘
```

Zasady nawigacji:

- **Joystick góra/dół:** wybór pozycji w menu; krótkie wychylenie przesuwa o jeden wiersz, przytrzymanie uruchamia kontrolowane powtarzanie.
- **OK:** wejście lub uruchomienie zaznaczonej pozycji.
- **Wstecz:** powrót; z Pacynki dodatkowo jawne `/api/efekt?n=automat`.
- **Bu!:** jedna akcja na naciśnięcie, bez powtarzania podczas przytrzymania.
- **Klik joysticka:** `/api/mrug` w Pacynce.
- Przeglądanie menu samo w sobie nie wysyła poleceń ruchu.

Poszczególne widoki:

| Widok | Zachowanie |
|---|---|
| Efekty | Lista pobrana z `/api/konfig`; identyfikatory API zachowane, polskie nazwy i ikony z lokalnego słownika |
| Emocje | Lista z `/api/konfig`, zaznaczenie aktywnej emocji, opcja „Zwykła” → `n=brak` |
| Pacynka | Joystick steruje położeniem; punkt zadany oraz osobno pozycja raportowana przez dynię |
| Powieki, podwidok Pacynki | OK przełącza „obie / górna / dolna”, joystick góra/dół reguluje 0–100%; wyłączone, gdy brak dużego oka |
| Podgląd | Duże oko i uproszczone małe oczy, bieżący tryb i efekt; bez wysyłania padu |
| Straszaki | Kilka dużych pozycji, w tym Bu; informacja „Łapie oddech” na podstawie `buZa` |
| Brak połączenia | „Szukam dyni”, nieaktywne akcje; ostatnia pozycja wyraźnie oznaczona jako nieaktualna |

**Fakt:** konfiguracja zwraca pola `n` i `b`; nie zawiera polskich etykiet, ikon ani opisu interakcji. Samo `b=1` oznacza bezpieczeństwo dla trybu wystawowego, nie gwarantuje dostępności w każdym stanie.

Efekty interaktywne wymagają adapterów interfejsu. Przykładowo `pacynka` otwiera Pacynkę, `pianino` potrzebuje wyboru oka i `/api/oko`, a gry własnych akcji. Nie należy przedstawiać każdego identyfikatora jako w pełni obsługiwanego tylko dlatego, że da się wysłać `n`.

Podgląd nie jest pomiarem położenia mechanizmu: API raportuje pozycję z profilu ruchu, a serwa nie mają sprzężenia zwrotnego. Źródło: [README firmware](/home/rkp/Projects/010-Eye-pumpkin/Dynia-eyes/50-elektronika/dynia/README.md).

**4. Komunikacja i zachowanie po utracie sieci**

**Fakty z firmware E7.2b:**

- Dynia działa jako AP „Dynia”, adres **192.168.4.1**, port HTTP 80. Hasło sieci jest zdefiniowane w `dynia.h`.
- `/api/stan` **wywołuje `zap()`**, zatem odświeża `tOstZapytania`: [serwer.cpp:129](/home/rkp/Projects/010-Eye-pumpkin/Dynia-eyes/50-elektronika/dynia/serwer.cpp:129).
- Heartbeat wynosi **20 s**. Jego wygaśnięcie prowadzi do automatu lub wybudzenia, z wyjątkami m.in. parkowania i rozruchu: [efekty.cpp:764](/home/rkp/Projects/010-Eye-pumpkin/Dynia-eyes/50-elektronika/dynia/efekty.cpp:764).
- Pacynka i Pianino mają niezależny limit **15 s bez polecenia ręcznego**. Sam `/api/stan` nie podtrzymuje tego licznika.
- Nowy efekt gościa ma odstęp co najmniej **1,2 s**. Bu ma dodatkową przerwę **10 s**, liczoną według zdarzenia zapisywanego przez firmware, a nie od kliknięcia pilota.
- `/api/pad` włącza Pacynkę, jeśli trwa inny efekt: [efekty.cpp:862](/home/rkp/Projects/010-Eye-pumpkin/Dynia-eyes/50-elektronika/dynia/efekty.cpp:862).
- Serwer HTTP obsługuje jedno połączenie naraz. Ruch ma osobne zadanie, lecz wolny klient może blokować następne żądania HTTP.

**Proponowany harmonogram**

| Operacja | Częstość |
|---|---|
| `/api/konfig` | Po połączeniu i ponownie po odzyskaniu połączenia |
| `/api/stan` | **2 Hz** normalnie; **4 Hz** w aktywnym podglądzie, jeśli zmierzony czas obsługi na to pozwala |
| `/api/pad` | Maksymalnie **10 Hz** podczas zmiany wychylenia |
| Niezmienny pad | Co około **1 s**, wyłącznie podczas aktywnej Pacynki, aby nie wygasała po 15 s |
| Efekt, emocja, mrugnięcie | Jedno żądanie na zdarzenie |
| Powieki | Z ograniczoną częstością, ostatnia wartość zastępuje wcześniejszą |

Łączenie: tryb STA, znany SSID i hasło, DHCP; komunikacja bezpośrednio z IP, bez captive portalu i bez zależności od internetu. Wi-Fi 6 C6 nie przyspieszy automatycznie tego połączenia — AP jest na C3.

**Jedno żądanie w toku dla całego pilota.** Pozycje joysticka trzymać w pojedynczym nadpisywanym polu, nie w kolejce. Zdarzenia przycisków mają krótką, ograniczoną kolejkę i pierwszeństwo przed kolejną telemetrią.

Przy Bu, emocji lub innym efekcie:

1. wyłączyć generowanie padu i usunąć oczekującą pozycję;
2. zakończyć bieżące żądanie;
3. wysłać akcję;
4. nie wracać samoczynnie do wysyłania padu.

Powrót do Pacynki wymaga świadomego wejścia w ten tryb. Dzięki temu następny pakiet joysticka nie kasuje straszaka.

**Utrata łączności**

- Błąd transakcji od razu oznacza niepewny wynik polecenia. Nie powtarzać automatycznie Bu ani mrugnięcia — polecenie mogło zostać wykonane mimo utraty odpowiedzi.
- Przy rozłączeniu Wi-Fi albo nieaktualnym stanie, np. przez 1 s, blokować sterowanie i pokazać brak łączności. Wartość 1 s jest propozycją.
- Porzucić stare pozycje i naciśnięcia; nie odtwarzać ich po powrocie sieci.
- Ponawiać samo łączenie z narastającym odstępem, np. 1/2/4/8 s.
- Po połączeniu pobrać konfigurację i stan, poczekać na neutralny joystick i puszczone przyciski.
- Nie obiecywać natychmiastowego zatrzymania dyni: bez dostarczonego polecenia pozostają jej własne limity **15/20 s**. Powrót do automatu również nie oznacza odłączenia serw.

Osobny przypadek to zawieszenie interfejsu przy działającym zadaniu sieciowym. Zadanie sieciowe nie może bez końca wysyłać starej pozycji. Powinno wymagać świeżego potwierdzenia działania modułu wejść; po jego utracie zaprzestać padu i próbować przejść do automatu.

**Opóźnienia — założenia do pomiaru**

Przy 10 Hz oczekiwanie na następną wysyłkę wynosi 0–100 ms, średnio około 50 ms. Dochodzi filtr wejścia, HTTP oraz krok silnika dyni 20 ms. Cel odbiorczy proponuję ustalić jako **95% poleceń poniżej 150 ms od odczytu do rozpoczęcia reakcji**, do potwierdzenia pomiarem.

Przy 10 padach i 4 stanach na sekundę pojedyncza transakcja musi trwać średnio mniej niż około 71 ms, aby w ogóle utrzymać harmonogram. Potrzebny jest zapas; przy wolniejszej sieci ograniczać telemetrię i pomijać nieaktualne pady.

`WiFi.setSleep(false)` jest rozsądnym punktem startowym dla Pacynki. Oszczędzanie Wi-Fi wprowadzać dopiero po porównaniu opóźnień i poboru.

**Zmiany API — lista propozycji, bez zmian w repo**

| Propozycja | Potrzeba |
|---|---|
| Jawne `apiVersion` i możliwości: duże oko, zakresy, heartbeat, limity | Przydatne; obecna `wersja` jest opisem firmware |
| Pole `applied` albo kod 409 dla zignorowanego sterowania | **Istotne:** dziś pad/mrug/powieki mogą zwrócić 200, choć funkcja nic nie zrobiła podczas parkowania, rozruchu lub kalibracji |
| Opcjonalna odpowiedź ze stanem na komendę padu | Pozwoli ograniczyć osobne zapytania o stan; dopiero jeśli pomiary uzasadnią |
| Atomowe polecenie pozycji i powiek | Przydatne dla przyszłego jednoczesnego sterowania; obecne API wystarczy do osobnych podwidoków |
| Osobny termin ważności sterowania ręcznego | Umożliwi krótszą reakcję na utratę pilota niezależnie od odpytywania stanu |
| Metadane efektów: etykieta, rodzaj interakcji, wymagane napędy | Ułatwią menu budowane z konfiguracji |

Krótszy JSON, binarny protokół i WebSocket **nie są wymagane do pierwszej wersji**. `/api/stan` już zwraca stan zbiorczy.

Autoryzacja pozostaje poza zakresem. Istniejące ograniczenia jednak nadal działają: przy włączonym trybie wystawowym Pacynka bez uprawnień otrzyma 403. Na pierwszą wersję zakładam wcześniejsze wyłączenie trybu wystawowego z telefonu; pilot pokazuje odmowę, zamiast obchodzić blokadę.

**5. Zasilanie i obudowa**

**Rekomendacja: powerbank USB**, najpierw posiadany do sprawdzenia, docelowo niewielki mieszczący się w obudowie lub wygodnie przy niej. Dwa zapisane w `sprzet.md` powerbanki 20 000 mAh są dostępne, ale ich gabaryt nie jest dobrym punktem wyjścia dla dziecięcego pilota.

| Opcja | Zalety | Co jest potrzebne |
|---|---|---|
| Powerbank USB | Gotowe ładowanie, zabezpieczenia i 5 V; łatwa wymiana | Sprawdzenie masy, gabarytu i wyłączania przy małym poborze |
| Li-Po 1S | Płaski, lekki pakiet | Ochrona ogniwa, ładowarka, przetwornica lub regulator oraz poprawne przełączanie zasilania |
| 18650 1S | Ogniwo w sztywnej obudowie, wymienność | Zabezpieczenia, ładowanie, konwersja napięcia, pewne mocowanie; większa grubość |

Nie podłączać surowego Li-Po do 3V3 — naładowany ma 4,2 V. Nie zakładać też, że podanie go na 5V rozwiązuje zasilanie w całym zakresie rozładowania. Schemat łączy 5V z VBUS USB bez widocznego rozdzielania źródeł: własny moduł akumulatorowy musi zapobiegać podawaniu napięcia wstecz do portu komputera.

Jeśli pilot ma działać podczas ładowania, potrzebny jest układ z rozdzieleniem prądu odbiornika i ładowania — **power-path/load sharing**. Sam moduł TP4056 nie jest kompletnym rozwiązaniem takiego zasilania.

**Rachunek poboru — nie pomiar płytki**

Dane katalogowe:

- C6, Wi-Fi RX HT20: około **78 mA**; TX zależnie od trybu i mocy do **354 mA**. To warunki tabeli, nie średnia aplikacji — E1, tabele 5-7 i 5-10.
- C6 przy 160 MHz w modem-sleep, CPU pracuje: **27–38 mA**, zależnie od zegarów peryferiów.
- LCD: elektronika typowo **8 mA**, maksymalnie 10 mA; podświetlenie typowo **40 mA**, maksymalnie 60 mA — W4, rozdział 4.
- Rzeczywisty prąd podświetlenia płytki zależy także od rezystora, egzemplarza LED i PWM.

Założenia do budżetu:

| Składnik | Założony średni prąd |
|---|---:|
| C6 z aktywnym Wi-Fi i aplikacją | 90–140 mA |
| Elektronika LCD | 8 mA |
| Podświetlenie | 20–40 mA |
| Flash, joystick i pozostałe obciążenia; RGB wyłączone | około 5 mA |
| **Suma zaokrąglona** | **120–200 mA** |

Przy zasilaniu przez liniowy regulator z USB prąd wejściowy jest zbliżony do prądu obciążenia 3,3 V, z dodatkiem prądu własnego regulatora. Otrzymujemy około **0,6–1,0 W z USB**. Źródło 5 V / 1 A daje zapas na impulsy Wi-Fi; nie oznacza to poboru 1 A.

Przykładowa autonomia, dla zasilania przez przetwornicę do 5 V:

`czas = pojemność [Ah] × 3,7 V × 0,8 × 0,85 / moc USB [W]`

Założenia: 80% użytecznej energii nominalnej oraz 85% sprawności konwersji.

| Źródło | Wynik rachunku przy 0,6–1,0 W |
|---|---:|
| Li-Po 1000 mAh | około **2,5–4,2 h** |
| 18650 3000 mAh | około **7,5–12,6 h** |
| Powerbank 5000 mAh, pojemność odniesiona do ogniwa 3,7 V | około **12,6–21 h** |

To wyłącznie porównanie energetyczne. Odbiór wymaga pomiaru przy aktywnej Pacynce, jasności docelowej, ponownym łączeniu i przygaszonym ekranie. Dla powerbanku sprawdzić również automatyczne wyłączenie; sam spadek napięcia USB nie daje wiarygodnego procentu baterii.

**Obudowa — propozycja konstrukcyjna**

- Dwuręczny układ podobny do małego kontrolera: ekran pośrodku, joystick z lewej, przyciski z prawej.
- Wstępna obwiednia około **120 × 90 × 35 mm**, do korekty po pomiarze modułów i próbie chwytu przez syna.
- PETG, ścianki startowo **2,4–3 mm**, zaokrąglone naroża, żebra przy słupkach.
- Dwie części drukowane płaską stroną na stole; otwarte wnętrze do góry. Nawisy ≤45° lub fazy; bez podpór jako założenie.
- Łączenie na cztery M3 z nakrętkami w kieszeniach albo wkładkami do wielokrotnego otwierania. Otwory przelotowe Ø3,3; długość śrub po ustaleniu przekroju.
- Ustalenie pokrywy: **0,25–0,3 mm luzu na stronę** i faza wejściowa.
- Drukowane klawisze w prowadnicach: **0,3 mm na stronę**, ograniczenie skoku przenoszące nadmierny nacisk na obudowę.
- Osłona joysticka poza obwiednią jego ruchu: co najmniej **0,5 mm luzu** w całym wychyleniu, następnie sprawdzenie z palcem i gumową nakładką.
- Ekran zagłębiony za rantem; opcjonalna wymienna szybka bez nacisku na LCD.
- Płytka podparta na PCB, nie na szkle ani taśmie ekranu. Joystick i przyciski zamocowane mechanicznie, przewody odciążone.
- Powerbank/ogniwo unieruchomione; śruby i krawędzie nie mogą trafiać w pakiet.
- Antena przy plastikowej krawędzi, z dala od akumulatora i większych elementów metalowych.
- Opcjonalny narożny zderzak TPU.

Odporność na upadek jest **celem do sprawdzenia**, nie wynikiem obliczeń. Proponuję próbę z wysokości około 1 m, na powierzchnię odpowiadającą użyciu, obejmującą naroża i stronę joysticka. Kontrola po próbie: mocowanie baterii, ekran, USB, słupki i powrót joysticka do środka.

**6. Architektura firmware i testy bez dyni**

Dla tej skali wybrałbym **Arduino_GFX z prostym interfejsem rysowanym własnym kodem**, bez LVGL w pierwszej wersji. Potrzebne są listy, kilka wskaźników i rysunek oczu, a nie rozbudowany system okien.

Proponowana struktura:

```text
50-elektronika/pilot/
  pilot.ino
  board.h                 piny, ekran, wersja płytki
  wejscia.h/.cpp           ADC, przyciski, kalibracja
  model.h/.cpp             stan dyni i stan interfejsu
  nawigacja.h/.cpp         ekrany, fokus, akcje
  ekran.h/.cpp             rysowanie, fonty i ikony
  siec.h/.cpp              STA, reconnect, stan połączenia
  api_dynia.h/.cpp         HTTP, JSON, walidacja
  harmonogram.h/.cpp       priorytety, ostatni pad, terminy
  ustawienia.h/.cpp        Preferences
  assets/
  testy/
    mock_api.py
    fixtures/
    scenariusze.md
  README.md
```

Podział wykonania:

- Zadanie interfejsu odczytuje wejścia i rysuje tylko zmienione obszary.
- Jedno zadanie sieciowe wykonuje HTTP z ograniczonym czasem połączenia i odpowiedzi.
- Komunikacja przez zdarzenia i nadpisywany cel padu; żadnego współbieżnego wywoływania LCD.
- C6 ma jeden główny rdzeń: rozdzielenie zadań zapobiega blokowaniu przez HTTP, ale nie daje drugiego rdzenia do renderowania.
- Kalibracja joysticka i ustawienia jasności w NVS, zapisywane tylko po zmianie.
- JSON z ograniczeniem długości odpowiedzi i liczby elementów; walidacja typów i wymaganych pól. Nie zakładać `ok:true` w stanie — obecny `/api/stan` tego pola nie zwraca.
- Obsługa 400/401/403/404/409/429 osobno od awarii sieci.

Dla LVGL, gdyby został wybrany później, wystarczy częściowy bufor: dwa bufory po 20 wierszy RGB565 to **13 760 B**. Trzeba przypiąć wersję biblioteki i konfigurację; przykład LVGL 8 nie jest bezpośrednio konfiguracją LVGL 9.

**Plan testów bez dyni — nic z poniższego nie zostało uruchomione**

1. **Atrapa HTTP na komputerze:** odtwarza `/api/konfig`, `/api/stan` i komendy; rejestruje kolejność oraz parametry. Pilot i komputer w osobnej sieci testowej, adres serwera ustawiany w konfiguracji.
2. **Model zachowania:** automat, Pacynka, efekty, limity 15/20 s, antyspam i przerwa Bu. Wartości wynikają z rzeczywistego firmware.
3. **Błędy transportu:** opóźnienie, brak odpowiedzi, zerwane połączenie po wykonaniu polecenia, błędny JSON, HTML zamiast JSON i przekierowanie.
4. **Błędy aplikacyjne:** 403 wystawa, 409 zajętość, 429 antyspam, nieznany efekt, brak dużego oka, wyłączone napędy.
5. **Scenariusze krytyczne:** trzymanie joysticka przy starcie, Bu podczas ciągłego padu, Wstecz z Pacynki, restart dyni, utrata sieci przy wychyleniu oraz zawieszenie wejść przy działającej sieci.
6. **Pomiary:** liczba żądań, maksymalnie jedno w toku, brak narastającej kolejki, wiek pozycji przed wysłaniem, opóźnienia i minimum wolnej pamięci.
7. **Kompilacja C6:** dokładny rdzeń 3.3.12 i przypięte biblioteki, bez podłączania płytki.

Istniejąca symulacja w `dynia/strona/index.html` jest przydatnym materiałem, ale działa wewnątrz strony. Nie stanowi gotowego serwera HTTP dla fizycznego pilota.

**7. Warunkowa lista zakupów**

W [sprzet.md](/home/rkp/Projects/010-Eye-pumpkin/Dynia-eyes/50-elektronika/sprzet.md) nie ma potwierdzonego joysticka ani przycisków. Są śruby, nakrętki, wkładki, warsztat i dwa powerbanki.

**Każda pozycja poniżej: „do potwierdzenia, czy jest w warsztacie”.** Ceny są orientacyjnymi założeniami budżetowymi w PLN, bez dostawy; nie są sprawdzonymi ofertami.

| Pozycja | Ilość | Cena orientacyjna | Warunek |
|---|---:|---:|---|
| Joystick analogowy 2 osie z klikiem | 1 | 5–15 zł | Jeśli brak odpowiedniego modułu |
| Przyciski chwilowe OK/Wstecz/Bu | 3 | łącznie 6–25 zł | Zależnie od obudowy i rozmiaru |
| Mała płytka montażowa, przewody, złącza | komplet | 10–25 zł | Jeśli brak zapasu |
| Krótki przewód USB-C | 1 | 8–20 zł | Jeśli posiadany nie pasuje do obudowy |
| Mały powerbank około 5000 mAh | 1 | 30–70 zł | Tylko jeśli posiadany okaże się niewygodny |
| Szybka ochronna | 1 | 5–15 zł | Jeśli brak materiału do wycięcia |

Dla wariantu z posiadanym powerbankiem: około **21–65 zł** za podstawowe wejścia i montaż, jeżeli niczego z tej grupy nie ma. Nie proponuję zakupu TF, enkodera, dodatkowej płytki ESP32 ani elementów ładowania do rekomendowanego wariantu USB.

**8. Rekomendacja, pięć ryzyk i pytania**

Rekomendowany zestaw: **wariant A, Arduino_GFX, obecne HTTP GET/JSON, 10 Hz pad i 2 Hz stan, powerbank USB, obudowa PETG skręcana M3**. Pierwszy prototyp ma korzystać z posiadanych wejść i zasilania, a geometria obudowy powinna wynikać z ich pomiarów.

| Ryzyko | Scenariusz | Ograniczenie i dowód odbioru |
|---|---|---|
| **1. Klon różni się od Waveshare** | Nieprawidłowe piny, obraz albo zasilanie | Identyfikacja płytki i zgodności połączeń przed okablowaniem; następnie test ekranu i wejść |
| **2. Pad kasuje efekty lub utrzymuje starą pozycję** | Bu przerwane następnym pakietem, odtworzenie komend po reconnect | Jedna maszyna trybów, ostatnia pozycja zamiast kolejki, brak automatycznego powrotu do Pacynki; test na atrapie |
| **3. Zawieszenia HTTP i złudne 200 OK** | UI zamiera albo pokazuje wykonanie zignorowanej komendy | Osobne zadanie HTTP, limity czasu, kontrola raportowanego trybu i wieku stanu |
| **4. Zasilanie gaśnie lub resetuje C6** | Auto-off powerbanku, spadek przy TX, niewłaściwy układ Li-Po | Pomiar prądu i napięcia, test przygaszenia/reconnect, gotowy powerbank na początek |
| **5. Upadek uszkadza joystick, ekran lub mocowanie baterii** | Wystające elementy przejmują uderzenie | Ranty, podparcie mechaniczne, odciążenie przewodów, próbka obudowy i kontrolowany test upadku |

Pytania do użytkownika — do rozstrzygnięcia przez orkiestratora:

1. **Jakie joysticki i przyciski są w warsztacie?** Propozycja: jeden joystick potencjometryczny z klikiem i trzy przyciski chwilowe.
2. **Jaki jest dokładny model/link klona i oznaczenie PCB?** Propozycja: potwierdzić zgodność z Waveshare przed przyjęciem pinoutu jako schematu wykonawczego.
3. **Czy pilot ma być samodzielny, bez przewodu do kieszeni?** Propozycja: docelowo mały powerbank zamknięty w obudowie; do prób posiadany.
4. **Czy Bu ma działać z każdego ekranu zabawy?** Propozycja: tak, pojedyncze naciśnięcie; po Bu Pacynkę włącza się ponownie świadomie.
5. **Czy dla zabawy pilotem akceptujemy wcześniejsze wyłączenie trybu wystawowego z telefonu?** Propozycja: tak w pierwszej wersji, zgodnie z odłożeniem autoryzacji.

**Wynik:** koncepcja wykonalna na oryginale Waveshare z zapasem GPIO; przed wykonaniem pozostają identyfikacja klona i inwentaryzacja wejść. Repo i płytka pozostały nietknięte. Nie pozostawiłem uruchomionych procesów w tle.