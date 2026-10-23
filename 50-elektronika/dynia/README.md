# dynia – firmware oczu i strona w telefonie (E7.2)

Firmware ESP32-C3 SuperMini, który steruje oczami dyni przez PCA9685 i serwuje stronę na iPhone'a (Safari 15, iPhone 7) albo telefon z Androidem. Telefon łączy się z siecią Wi-Fi dyni i dostaje stronę bez internetu i bez aplikacji. Ruch bazuje na `oczy-ruch`: sakada z rozpędem i hamowaniem, potem fiksacja. Dziennik w NVS działa jak w `test-24h`, start bez skoku jak w `test-powerbank-wifi`.

Wersja **E7.2d** zawiera poprawki po review kodu (Astra, Fable 23.10), duże oko według decyzji 22.10 (4 × MG90S, kanały 12–15, każda powieka niezależnie) oraz **kalibrację oka ze strony** jako 5-krokowy kreator: środek, dwa krańce, kierunek z odpowiedzi „w moją lewą / prawą”, tryb „Nowe serwo”. Na czas prób domyślnie jest **1 małe oko na kanale 0**.

## Pliki

| Plik | Co jest w środku |
|---|---|
| `dynia.ino` | `setup`/`loop`, zadanie ruchu (FreeRTOS, co 20 ms), blokada stanu, komendy portu szeregowego, dziennik |
| `dynia.h` | **stałe do ustawienia**, typy, deklaracje |
| `ruch.cpp` | silnik ruchu: napędy, kolejki kroków, limit `MAX_W_RUCHU`, mapowanie kąt → µs, granice, PCA9685 przez `Wire`, pozycje w NVS, rozruch, park, kalibracja |
| `efekty.cpp` | tryby, automat (oczy-ruch), emocje, wszystkie efekty |
| `serwer.cpp` | punkt dostępu, captive portal, strona, API JSON |
| `strona/index.html` | źródło strony: jeden plik z CSS i JS, bez zasobów zewnętrznych, z trybem symulacji |
| `zrob_strone.py` | generuje `strona_html.h` (strona skompresowana gzip w pamięci flash) |
| `strona_html.h` | plik generowany, nie edytować |

## Kompilacja i wgrywanie

```bash
python3 50-elektronika/dynia/zrob_strone.py          # tylko po zmianie strona/index.html
arduino-cli compile -b esp32:esp32:esp32c3:CDCOnBoot=cdc 50-elektronika/dynia
arduino-cli upload -p /dev/ttyACM0 -b esp32:esp32:esp32c3:CDCOnBoot=cdc 50-elektronika/dynia
```

Wymagany jest rdzeń esp32 3.3.12. Korzystam tylko z bibliotek rdzenia (`WiFi`, `WebServer`, `DNSServer`, `Preferences`, `Wire`). PCA9685 obsługuję bezpośrednio przez `Wire`, bez biblioteki Adafruit; powód w uwadze K4 niżej.

Wynik 23.10 (`--clean --warnings all`, bez ostrzeżeń):

| Zasób | Zajęte | Z | % |
|---|---|---|---|
| Flash (szkic) | 1 138 603 B | 1 310 720 B | 86 % |
| RAM (zmienne globalne) | 45 704 B | 327 680 B | 13 % |
| Strona (źródło / gzip) | 92,8 KB / 26,9 KB | – | – |

**Przebudowa strony:** zmieniasz `strona/index.html`, uruchamiasz `zrob_strone.py` i kompilujesz szkic. Skrypt kompresuje plik gzip z `mtime=0`, więc z tego samego źródła wychodzi ten sam wynik.

## Tryb symulacji strony

Otwórz `50-elektronika/dynia/strona/index.html` w przeglądarce jako plik (`file:`). Strona sama wejdzie w symulację: odpowiedzi API i ruch oczu liczy JS. Warianty i dostęp:

- `index.html?duze=1` – symulacja z dużym okiem; `?n=1` – jedno małe oko (jak firmware na czas prób).
- `http://192.168.4.1/?symulacja=1` – to samo na ESP.
- PIN panelu rodzica w symulacji to **0000**. To PIN tylko demonstracyjny; PIN firmware nie występuje w stronie.

**Symulator jest przybliżeniem** (druga, ręcznie utrzymywana kopia silnika w JS):

- To samo co w ESP: kolejki po 12 kroków, limit serw, efekty, dwie powieki.
- Różnice wobec ESP:
  - profil to sam smoothstep, bez stycznych;
  - nie ma ogranicznika impulsów ani NVS;
  - liczba oczu i duże oko zmieniają się od razu, a na ESP dopiero po restarcie.

## Pierwsze uruchomienie

1. **Zmień `PIN_RODZICA`** w `dynia.h` przed wystawą. Wgraj szkic.
2. Start: PCA9685 najpierw wyłącza wszystkie wyjścia. Potem ESP włącza Wi-Fi i kanał po kanale (co 150 ms) wysyła ostatni zapisany impuls, a następnie płynnie prowadzi oczy na środek.
3. Telefon: Wi-Fi `Dynia`, hasło `dynia2026`. iPhone sam otworzy okno logowania z naszą stroną. Okno jest okrojone, więc strona pokazuje baner: zamknij je, wybierz „Bez internetu”, potem Safari → `192.168.4.1`.
4. **Kalibracja oka** (zakładka **Rodzic**, pierwsza sekcja po zalogowaniu) – opis niżej. Powieki dużego oka kalibruje się w tej samej sekcji: każdą (górną i dolną) osobno, „zamknięta” i „otwarta”. Przed kalibracją mają wąski zakres 1350–1650 µs.
5. Azymut każdego oka (◀ 5° ▶) ustala kolejność Fali i kierunki w „Wszyscy tam!”. Domyślnie oczy są rozłożone równo od −100° do +100°.

## Kalibracja oka (panel Rodzic)

**Konwencja kierunku:** „lewo” i „prawo” to kierunki **widziane przez obserwatora stojącego przed dynią**. Strzałki ← → pokazują, w którą stronę ma się ruszyć oko widziane od przodu. Kraniec lewy odpowiada kątowi −25°, prawy +25°. W efektach dodatni kąt oznacza spojrzenie w prawo, patrząc na dynię.

**Każde małe oko ma trzy wartości w NVS:**

| Wartość | Klucz NVS | Domyślnie |
|---|---|---|
| środek | `a<k>` | 1500 µs |
| kraniec lewy | `l<k>` | środek − 278 µs |
| kraniec prawy | `r<k>` | środek + 278 µs |

**Mapowanie** jest liniowe osobno w każdej połówce: −25°…0 = lewy kraniec…środek, 0…+25° = środek…prawy kraniec. Krańce mogą być niesymetryczne. Efekty nigdy nie wychodzą poza krańce: cel jest obcięty, a test pokazał impuls 1300…1848 przy krańcach 1300 / 1850.

**Warunki poprawności:** krańce leżą po przeciwnych stronach środka, 30–700 µs od niego, i w granicy bezpieczeństwa 900–2100 µs. Środek mieści się w 1200–1800 µs. Złe ustawienie zostaje odrzucone z komunikatem.

**Migracja:** stare NVS bez krańców dostaje je z zapisanego środka i znaku (środek ∓ 278 µs × znak). Zapisane środki zostają.

**Kreator kalibracji (E7.2d)** – nie trzeba wiedzieć, co jest lewo, a co prawo. Na ekranie są tylko kontrolki bieżącego kroku: jedno zdanie, strzałki, jeden główny przycisk i mały „Wstecz”.

| Krok | Co robisz | Przycisk |
|---|---|---|
| 0 | widzisz zapisane wartości | „Zacznij kalibrację” (oko płynnie na swój środek) |
| 1 | ustaw piłkę prosto (patrz od przodu) | „Zapisz środek” |
| 2 | do oporu w JEDNĄ stronę, cofnij o drobny krok | „Zapisz kraniec 1” |
| 3 | do oporu w DRUGĄ stronę, cofnij o drobny krok | „Zapisz kraniec 2” (po tej samej stronie co kraniec 1 – odrzucony z komunikatem) |
| 4 | piłka jedzie płynnie na kraniec 1; „w którą TWOJĄ stronę patrzy?” | „W moją lewą” / „W moją prawą” – firmware ustala kraniec lewy (−25°), prawy (+25°) i znak |
| 5 | test zakresu rusza sam (środek → lewa → prawa → środek); strzałki są już opisane „twoja lewa / prawa” | „Zapisz” (NVS), „Powtórz test” |

- W krokach 1–3 strzałki to tylko obrót serwa: ◀ / ▶ = −30 / +30 µs, „drobno” = ±5 µs; ◀ zawsze zmniejsza impuls.
- Wszystko inne jest pod zwiniętym „Więcej…”:
  - wybór kanału (przy jednym oku schowany);
  - zapisane wartości, azymut, wyłączenie serwa;
  - kanały dużego oka (stara kalibracja −10 −1 +1 +10, „Odwróć kierunek”);
  - „Zacznij od nowa”;
  - **„Nowe serwo”** – czerwone ostrzeżenie o zdjęciu dźwigienki, drugie stuknięcie potwierdza, od razu 1500 µs, potem kreator od kroku 1.
- Wyjście z kalibracji: „Zapisz” (wraca automat), dowolny efekt albo 20 s ciszy. Impuls wraca powoli (4 µs na krok).

**Duże oko** w tej samej sekcji: środki osi i powieki (zamknięta / otwarta) przyciskami −10 −1 +1 +10. „Odwróć kierunek” zmienia znak osi.

## Stałe do ustawienia (`dynia.h`)

| Stała | Domyślnie | Uwagi |
|---|---|---|
| `N_MALYCH` | **1** (na czas prób) | kanały 0..N−1, bez dużego oka do 16; **z dużym okiem do 12 (kanały 0–11)**; gdy przybędzie oczu, zwiększ w panelu rodzica (NVS, po restarcie) |
| `KRANIEC_DOM_US`, `KRANIEC_MIN_US`, `KRANIEC_MAX_US` | 278, 30, 700 µs | domyślny kraniec małego oka i dozwolona odległość krańca od środka |
| `NOWE_SERWO_US` | 1500 µs | impuls „Nowe serwo” |
| `DUZE_OKO` | `false` | panel rodzica zmienia (NVS, po restarcie) |
| `KANAL_DO_X`, `KANAL_DO_Y`, `KANAL_POW_G`, `KANAL_POW_D` | 12, 13, 14, 15 | decyzja 22.10: 4 × MG90S, powieka górna i dolna niezależnie |
| `MAX_W_RUCHU` | 4 | wspólny limit serw w ruchu; panel zmienia od razu. Z dużym okiem co najmniej 2, bo gałka liczy się za 2 serwa, a każda powieka za 1 |
| `AP_SSID`, `AP_HASLO`, `AP_KANAL`, `AP_MAX_KLIENTOW` | Dynia, dynia2026, 1, 4 | sieć widoczna |
| `PIN_RODZICA` | `"2610"` | **zmień przed wystawą**; 5 błędnych prób = blokada 60 s (blokada globalna, nie na telefon) |
| `CAPTIVE_PORTAL` | `true` | `false`: odpowiedź „Success” na testy łączności, stronę otwiera się ręcznie |
| `PARK_POWIEKI`, `PARK_BEZ_PWM` | 100, `true` | po „Parkuj” powieki otwarte, potem impulsy zdjęte |
| `POW_ZAMK_US`, `POW_OTW_US` | 1350, 1650 | powieki przed kalibracją |
| `V_MAX_OKO` | 200 °/s | twardy szczyt profilu oka, liczony dokładnie |
| `V_MAX_POW_US` | 3500 µs/s | szczyt profilu powieki w µs/s, więc niezależny od jej kalibracji; przy pełnym zakresie ok. 700 µs zamknięcie trwa ok. 0,3 s |
| `US_MIN_ABS`, `US_MAX_ABS` | 900, 2100 µs | granica bezpieczeństwa każdego zapisu, niezależna od kalibracji |
| `US_KROK_MAX`, `US_KROK_WOLNO` | 80, 4 µs na krok | twardy limit wyjścia; rozruch i kalibracja |
| `ZAPIS_PONOWNY_MS`, `ZAPIS_ODSTEP_MS` | 2 s, 0,5 s | NVS: najwyżej jeden zapis na napęd co 2 s i jeden w całej dyni co 0,5 s |
| `HEARTBEAT_MS`, `RECZNY_BEZCZYNNOSC_MS` | 20 s, 15 s | powrót do automatu |
| `BU_PRZERWA_MS`, `ROZBIEGANE_MAX_MS`, `HIPNOZA_MAX_MS`, `SEN_MAX_MS`, `BABAJAGA_MAX_MS`, `EMOCJA_MS` | 10 s, 7 s, 20 s, 3 min, 3 min, 45 s | limity czasu; przerwa „Bu!” liczona od chwili straszenia |

**NVS wersja 2:** przy pierwszym starcie E7.2b firmware kasuje stare wpisy kanałów 12–15 i wyłączenia napędów od indeksu 12, bo zmieniło się ich znaczenie. Kalibracje małych oczu 0–11 zostają.

## Jak działa ruch (bezpieczeństwo)

- **Zadania:**
  - ruch liczy osobne zadanie FreeRTOS co 20 ms (`vTaskDelayUntil`), z wyższym priorytetem niż `loop()`;
  - obsługa HTTP i portu szeregowego działa w `loop()`; każdy handler zmienia stan pod rekurencyjnym mutexem (`Blokada`) i zwalnia go przed wysłaniem odpowiedzi;
  - wolny albo niepełny klient HTTP blokuje tylko serwer, nie profile ruchu ani heartbeat;
  - czas kroku jest brany po zajęciu blokady, a porównania czasu są ze znakiem (K1).
- **Napędy:** małe oko (stopnie, ±25°), gałka dużego oka (ψ ±25°, θ ±15°, 2 serwa), powieka górna i dolna (każda osobno, rozwarcie 0–100 %, po 1 serwie). Strona podaje kąty i nazwy efektów, nigdy µs; wyjątek to kalibracja w panelu rodzica, najwyżej ±50 µs na zapytanie.
- **Profil:**
  - sakada trwa (120 + 6·|Δ°|)·tempo ms, z rozpędem i hamowaniem (smoothstep);
  - przy zmianie celu w biegu nowy odcinek startuje z bieżącą prędkością (Hermite);
  - szczyt prędkości jest liczony dokładnie (końce i ekstremum pochodnej) i wymuszany bez tolerancji: 200°/s dla oczu, 3500 µs/s dla powiek.
- **Wyjście:**
  - zmiana impulsu ≤ 80 µs na krok (rozruch i kalibracja 4 µs);
  - przed zapisem impuls jest obcięty do 900–2100 µs; cel jest obcięty do okna kalibracji w `usDla()`;
  - zmiana kalibracji przesuwa tylko cel, więc impuls dochodzi do nowego okna stopniowo (K2).
- **Koniec ruchu** jest dopiero wtedy, gdy profil się skończył i impulsy wszystkich kanałów napędu doszły do celu. Dopiero wtedy napęd zwalnia limit serw, a pozycja trafia do NVS, parkowanie się kończy albo impuls jest zdejmowany (K3).
- **Limit serw:** nowy ruch czeka na miejsce, starty idą w kolejności zgłoszeń, najwyżej co 40 ms. Powieki przy mrugnięciu startują razem jako para. Wyjątku „pusty limit” już nie ma.
- **PCA9685 (K4):**
  - inicjalizacja przez `Wire`: najpierw `ALL_LED_OFF` (wszystkie 16 wyjść wyłączone, także po restarcie samego ESP przy zasilonym PCA), potem uśpienie, dzielnik 50 Hz, pobudka;
  - nie używam `begin()` biblioteki, które chwilowo ustawia 1000 Hz przy starych rejestrach;
  - nieużywane kanały zostają wyłączone.
- **Start bez skoku:** w NVS (`dyniapoz`, klucze `u<kanał>`) leży ostatni impuls każdego kanału.
  - Zapis celu przy starcie ruchu i położenia po końcu, z limitem 2 s na napęd i 0,5 s w całej dyni.
  - Przy parkowaniu, wyłączeniu oka i restarcie z panelu zapis idzie od razu, z faktycznie wysłanym impulsem.
  - Restart z panelu najpierw parkuje (najwyżej 5 s).
  - Skok zostaje możliwy po zaniku prądu w trakcie ruchu, po ręcznym przestawieniu oka i przy pierwszym starcie bez wpisów (decyzja 22.10).
- **Heartbeat:** 20 s bez zapytania ze strony kończy efekt albo sterowanie i dynia płynnie wraca do automatu; śpiąca dynia się budzi. Pad i pianino wracają też po 15 s bez polecenia, a nie po stałych 15 s od startu.

**Zapisy NVS** (test natywny, 10 małych oczu, 10 min albo 60 s padu):

| Sytuacja | Bez dużego oka | Z dużym okiem |
|---|---|---|
| Spoczynek | ok. 11,5/min | ok. 66/min |
| Automat aktywny | ok. 118/min | ok. 110/min |
| Pad 10 Hz | ok. 119/min (wcześniej ok. 1100) | ok. 64/min |

Twardy sufit wynosi 120/min, czyli 1 zapis na 0,5 s. Liczba wywołań zapisu nie jest liczbą kasowań sektora; trwałości flash nie liczyłem.

## Tryby

1. `rozruch`.
2. `automat` – domyślny: spoczynek z `oczy-ruch`, jedno małe oko co ok. 5 s; duże oko z fiksacjami i mruganiem obiema powiekami.
3. `efekt` albo `reczny` (pad, pianino), potem z powrotem `automat`.
4. Poza tym cyklem:
   - `kalibracja` – panel rodzica;
   - `park` – wszystkie płynnie na środek, powieki otwarte, potem bez impulsów; „Wznów” podaje ostatni impuls i wraca automat.

Emocja zmienia parametry automatu na 45 s albo do zmiany.

## Efekty

Czasy pochodzą z testu natywnego silnika (`ruch.cpp` + `efekty.cpp` z zaślepkami, 10 oczu, `MAX_W_RUCHU` 4, duże oko z 4 serwami) – to symulacja, nie pomiar na sprzęcie. W kolumnach: „Serwa” = ile serw naraz w ruchu, „Wyst.” = dostępny dla gości w trybie wystawowym.

| Efekt (API `n=`) | Co robi | Serwa | Czas bez DO / z DO | Bez dużego oka | Wyst. |
|---|---|---|---|---|---|
| Fala (`fala`, `w` 0 prawo / 1 lewo / 2 tam i z powrotem) | spojrzenie obiega dynię w kolejności azymutu, krok 140 ms | ≤ 4 | 4,3 / 4,7 s (w=2) | pełny | tak |
| Wszyscy tam! (`tam`, `k` −120…120°) | oczy parami, od najbliższych, patrzą w kierunek (±25°), 3 s, powrót; duże oko prowadzi, powieki szerzej | ≤ 4 | 4,5 / 4,9 s | pełny | tak |
| Zez (`zez`) | oczy do osi dyni (±22°), 1,8 s, powrót | ≤ 4 | 3,4 / 3,5 s | pełny | tak |
| Spłoszone (`rozbiegane`) | nerwowe sakady, rozbiegnięcie, powrót; powieki szeroko | ≤ 4 | 5,3 / 5,7 s, limit 7 s | pełny | nie |
| Mucha (`mucha`) | mucha leci wokół dyni, oczy w zasięgu ±70° ją śledzą | ≤ 4 | 10–13 s, limit 15 s | pełny | tak |
| Znajdź buntownika (`buntownik`, `pokaz`) | wszystkie w jedną stronę, jedno w drugą i łypie; „Pokaż” albo po 15 s się trzęsie | ≤ 4 | ok. 17,7 s | pełny (≥ 2 oczu) | tak |
| Kłótnia sąsiadów (`klotnia`) | sąsiednia para zerka ku sobie i odwraca się; duże oko przyłapuje i mruga | 2 (z DO 4) | 5,3 s | pełny (≥ 2 oczu) | tak |
| Pianino (`/api/oko`) | dotyk oka: ±20° i powrót; przeciągnięcie wychyla kolejne | ≤ 4 | – | pełny | tak |
| Pacynka (`/api/pad`, `/api/mrug`, `/api/powieki`) | pad prowadzi duże oko, stuknięcie = mrugnięcie obiema; suwaki „Powieki (obie)” i „Mrużenie (dolna w górę)” | 2–4 | – | pad X prowadzi małe oczy (lider i stado), stuknięcie = drżenie, suwaki wyszarzone | nie |
| Bu! (`bu`, `w` 1 = od razu) | udaje uśpioną (powieki zamknięte, małe odwrócone), potem obie powieki szeroko, po 0,25 s małe na wprost; przerwa 10 s od straszenia | ≤ 4 | 8,3 / 8,4 s | małe nagle na wprost i drżenie | tak |
| Zdziwienie (`zdziwienie`) | zerknięcie, odwrócenie, szybki powrót; dwa mrugnięcia, obie powieki szeroko | ≤ 4 | 5,3 / 6,1 s | małe z drżeniem | tak |
| Przewracanie oczami (`przewracanie`) | łuk gałki, górna powieka przymknięta (50/80), „westchnienie” | ≤ 4 | 4,0 / 3,2 s | wszystkie małe wolno na skraj i z powrotem | tak |
| Zasypianie (`zasypianie`) | górna opada skokami, dolna podnosi się wolniej, małe po kolei na środek; `sen` najwyżej 3 min | ≤ 4 | do snu ok. 7 s | same małe | nie |
| Budzenie (`budzenie`) | „jeszcze 5 minut”, potem zryw | ≤ 4 | 4,5 / 5,3 s | bez powiek | tak |
| Hipnoza (`hipnoza`) | duże oko kręci koła (powieki 75/90), małe w zezie | ≤ 4 | limit 20 s | zez ↔ rozbieżność | nie |
| Szef ucisza bunt (`szef`) | małe rozrabiają, duże otwiera się i groźnie mruży (60/40), małe na baczność | ≤ 4 | 7,2 / 7,6 s | rozrabianie, pauza, baczność | tak |
| Emocje (`/api/emocja`) | parametry automatu, zob. tabela emocji niżej | 1–4 | 45 s | parametry małych oczu (bez powiek) | tak, poza „przestraszony” |
| Wyrocznia (`tak`, `nie`, `niewiem`) | kiwnięcie / kręcenie / przewracanie | 2–4 | 4,0 / 2,0 s; 4,3 / 1,4 s; 4,0 / 3,2 s | tak = wszyscy na wprost + drżenie; nie = fala w obie strony; nie wiem = przewracanie bez DO | tak |
| Mrugnij (`mrug`) | obie powieki razem i powrót każdej do jej położenia | 2 | 1,4 / 0,3 s | drżenie małych kaskadą | tak |
| Refleks (`refleks`, `/api/refleks`) | otwarcie po 2–8 s; wynik liczony od sygnału: powieka w połowie albo oko prowadzące w połowie drogi | ≤ 4 | 8,5 / 9,6 s | otwarcie = małe na wprost | tak |
| Baba Jaga (`babajaga`, `patrze`) | oko zamknięte, „Patrzę!” = gwałtowne (w limicie) spojrzenie w losową stronę | ≤ 4 | limit 3 min | same małe | nie |
| Troll (`/api/troll`), Awaria (`awaria`) | odwrócone lewo ↔ prawo w Pacynce i Pianinie; Awaria = wytrzeszcz + spłoszone | ≤ 4 | 5,8 / 6,2 s | pełny | nie |
| Magik | zegar; strefy 3 × 3: lewo, wprost, prawo / zez, Bu!, fala / mrugnij, zaśnij, obudź; wyjście: lewy górny róg 2 s | jak efekt | – | jak efekty | jak efekty |

**Emocje** (`/api/emocja`, `n` = nazwa albo `brak`):

| Emocja | Powieki górna / dolna | Uwagi |
|---|---|---|
| senny | 30 / 85 | górna nisko |
| ciekawski | 95 / 95 | |
| podejrzliwy | 50 / 40 | dolna wyżej, wolny skan |
| przestraszony | 100 / 100 | niedostępny dla gości w trybie wystawowym |
| znudzony | 50 / 80 | |
| złośliwy (`zlosliwy`) | 70 / 30 | przymrużenie |

Antyspam: nowy efekt od gościa najwcześniej po 1,2 s. Kolejny efekt przerywa poprzedni.

## API (GET, odpowiedzi JSON)

Parametry liczbowe są parsowane ściśle: cała wartość, liczba skończona, w zakresie; inaczej HTTP 400 bez zmiany stanu.

| Ścieżka | Parametry | Opis |
|---|---|---|
| `/api/stan` | – | tryb, efekt, emocja, `oczy`, `wyl`, `az`, `do` {x, y, powG, powD, wyl, wylG, wylD}, klienci, czas, troll, wystawa, wRuchu, max, bunt, buZa, refleks {faza, za, od, rekord} |
| `/api/konfig` | – | wersja, efekty i emocje z flagą bezpieczeństwa |
| `/api/efekt` | `n`, `w` (0–9), `k` (−180…180), [`t`] | efekt albo akcja (`automat`, `pokaz`, `patrze`, `lewo`, `prawo`, `wprost`); 403 / 409 / 429 jak niżej |
| `/api/emocja` | `n` | emocja albo `brak` |
| `/api/pad` | `x`, `y` (−100…100) | Pacynka |
| `/api/oko` | `nr` (−1 = duże), `k` (±1) | Pianino |
| `/api/mrug` | – | mrugnięcie obiema (drżenie bez DO) |
| `/api/powieki` | `r` (obie) albo `g`, `d` (0–100) | powieki |
| `/api/troll`, `/api/refleks` | `on` (0/1), `ms` | tryb trolla, wynik → rekord |
| `/api/rodzic/pin` | `pin` | → `t` (token, 30 min) |
| `/api/rodzic/…` (z `t`) | `stan`, `wybierz?ch&p`, `kal?ch&p&d (±50)|v`, `oznacz?ch&p=a/l/r`, `nowe?ch`, `test?ch`, `zapisz`, `wylacz?nr&v`, `ustaw?max&wystawa&n&duze`, `parkuj`, `wznow`, `restart`, `zeruj`, `wyloguj` | dziennik (odrzucone kroki, minimum wolnej pamięci), kalibracja, wyłączenie serwa, ustawienia, serwis |

Parametr `p` w `kal`:

| `p` | Znaczenie |
|---|---|
| `a` | środek oka / powieka zamknięta |
| `b` | powieka otwarta |
| `l`, `r` | kraniec lewy / prawy małego oka |
| `z` | odwróć kierunek: zamiana krańców; dla dużego oka znak osi |
| `q` | azymut |
| `j` | strzałka: `d` > 0 w prawo, < 0 w lewo (patrząc na dynię), impuls ręczny w trybie kalibracji |
| `u` | strzałka kreatora: `d` > 0 = więcej µs, bez lewo/prawo |

`/api/rodzic/kreator?ch&krok=`:

| `krok` | Działanie |
|---|---|
| `s` | środek; krańce tymczasowo ±278 µs |
| `1` | kraniec 1 |
| `2` | kraniec 2, musi leżeć po drugiej stronie środka |
| `p` | piłka płynnie na kraniec 1 |
| `k&lewa=1/0` | kraniec 1 widziany w lewo / w prawo obserwatora |

Odpowiedź: `{"ok":true,"us":…}` albo 409 z czytelnym powodem.

`oznacz` ustawia bieżący impuls ręczny jako środek albo kraniec. `nowe` daje od razu 1500 µs i kalibrację domyślną. W `stan` każdy kanał ma `a`, `b`, `l`, `r`, `z`, `us` (wysłany impuls) i `cel` (impuls ręczny, −1 = brak). Złe wartości kalibracji: 409 z powodem.

Kody błędów `/api/efekt`: 403 – tryb wystawowy, 409 – park, rozruch albo kalibracja, 429 – antyspam albo przerwa „Bu!”.

- `/ustaw` zapisuje tylko przekazane pola. `max` nie może być mniejszy niż koszt najdroższego napędu.
- `restart` najpierw parkuje.

Captive portal: DNS odpowiada adresem 192.168.4.1 na każdą nazwę. Testy łączności (`/generate_204`, `/hotspot-detect.html` itd.) i obce hosty dostają przekierowanie na `http://192.168.4.1/?cna=1`.

**Strona:**
- każde zapytanie ma limit 2,5 s (`AbortController`);
- w toku jest najwyżej jedno zapytanie o stan, a następne jest zawsze zaplanowane;
- odpowiedź bez wymaganych pól to błąd połączenia;
- po błędzie pad porzuca stare polecenie;
- Restart i Zerowanie potwierdza się drugim stuknięciem, bo `confirm()` bywa zablokowane w oknie logowania iOS.

## Port szeregowy (115200)

| Komenda | Działanie |
|---|---|
| `l` | dziennik i kanały |
| `z` | zeruj dziennik (to samo co przycisk w panelu) |
| `k<kanał> <µs>` | środek oka albo zamknięta powieka; zapis w NVS (odrzucony, gdy środek nie leży między krańcami) |
| `c` | parkuj |
| `r` | wznów / automat |
| `a` / `s` | automat aktywny / spoczynek |
| `e <efekt> [w] [k]` | uruchom efekt |
| `?` | pomoc |

## Jak dodać efekt

1. `efekty.cpp`: dopisz identyfikator do `IdEfektu` i `{"nazwa", bezpieczny}` do `EFEKTY[]` w tej samej kolejności.
2. W `startEfektu()` dodaj `case` z krokami w kolejkach napędów. Dostępne funkcje:
   - oczy: `ruchKat(n, kąt, tempo)`, `kaskadaMalych(...)`, `drzenie(n)`;
   - czas: `postoj(n, ms)`, `czekajDo(n, t)`;
   - duże oko: `gal(ψ, θ, tempo)`;
   - powieki: `powR(górna, dolna, ms)` albo `powR(obie, ms)`, `powSpocz(ms)`, `powPostoj(ms)`, `mrugnij()`.

   Kolejka ma 12 kroków; przepełnienie liczy licznik „odrzucone kroki” w panelu.
3. Efekt z samych kolejek kończy się, gdy wszystkie napędy są wolne. Efekt dynamiczny dostaje `case` w `krokEfektu()` i woła `zakonczEfekt()`. Ustaw `ef.tMax`; efekty ręczne mają 0.
4. Bez dużego oka `gal()` i `powR()` nic nie robią – daj wersję na małych oczach.
5. Strona:
   - przycisk z `data-e="nazwa"` w `strona/index.html`;
   - etykieta w `NAZWY`;
   - wersja w symulatorze (`startEf` / `krokEf`);
   - potem `zrob_strone.py`.

## Sprawdzone przed oddaniem (23.10, bez sprzętu)

**Kompilacja:** `arduino-cli compile --clean … --warnings all` przechodzi bez ostrzeżeń.

**Test natywny silnika:** prawdziwe `ruch.cpp` i `efekty.cpp`, zaślepki Arduino i NVS, model rejestrów PCA9685; bez i z dużym okiem (4 serwa), 7 losowań. Wynik:

| Sprawdzenie | Wynik |
|---|---|
| Efekty | wszystkie wracają do automatu |
| Limit serw | nigdy przekroczony, także przy `max` = 1 w NVS (firmware podnosi do 2 przy dużym oku) |
| Największa zmiana impulsu na krok 20 ms | 44 µs dla oczu i gałki (= 200°/s); powieki 68 µs przy oknie 300 µs i 73 µs przy 800 µs (3500 µs/s); twardy limit 80 µs nie zadziałał |
| K1 | czas zapytania nowszy niż czas kroku: efekt trwa dalej |
| K2 | zmiana krańców i środka w biegu przesuwa tylko cel; impuls dochodzi krokiem ≤ 5 µs (E7.2b: przy krańcu 1222 µs i środku 1500 → 1800 największy krok 5 µs zamiast 300; w E7.2c taki środek jest odrzucany, bo leży poza krańcami) |
| K3 | kalibracja i od razu „Parkuj”: zaparkowana dopiero przy 1550 µs; zapis 1550, PWM zdjęty |
| K4 | pierwszy zapis do PCA to `ALL_LED_OFF`; żaden kanał nie dostaje impulsu przed ustawieniem 50 Hz |
| W1 | po kalibracji `usZap` = `usWy` |
| W5 | NaN w `ruch()` / `natychmiast()` zignorowany |
| W7 | Bu → Fala → Bu: 429 |
| W8 | pad 60 s bez przerwy: dalej `reczny` |
| Powieki | „podejrzliwy” 50 / 40, „senny” 30 / 85; kalibracja górnej nie rusza dolnej |
| Heartbeat | 20,0 s |
| Krańce zmienione w biegu (automat), potem efekty i pad | impuls kanału 0 w 1300…1848 przy krańcach 1300 / 1850, największy krok 44 µs (54 µs przy N = 1: szersza połówka 350 µs / 25° przy 200°/s), bez skoków |
| Kraniec po złej stronie / środek poza krańcami | odrzucone |
| Strzałki 6 × ←← | cel 1200 µs, krok ≤ 5 µs (kwantyzacja PCA) |
| Oznaczenie | lewy 1200, prawy 1700, środek 1400 – zapisane w NVS razem z pozycją startową 1400 |
| Test zakresu | 1198…1701 µs (krańce 1200 / 1700), krok ≤ 10 µs |
| Nowe serwo | 1560 → 1500 µs od razu (zamierzony skok), kalibracja 1222 / 1500 / 1778 |
| Wyjście z kalibracji | impuls ręczny znika, powrót krokiem ≤ 10 µs |
| Migracja | stary środek 1520 i znak −1 → krańce 1798 / 1242 |
| Kreator, odpowiedź „w moją lewą” | środek 1520, kraniec 1 = 1220, kraniec 2 = 1870 → lewy 1220, prawy 1870, znak +1; efekt −25° = 1220 µs, +25° = 1870 µs |
| Kreator, odpowiedź „w moją prawą” | kraniec 1 = 1240, kraniec 2 = 1890 → lewy 1890, prawy 1240, znak −1; efekt −25° = 1890 µs, +25° = 1240 µs |
| Kreator, kraniec 2 po tej samej stronie | odrzucony |
| Kreator, ruch na kraniec 1 i z powrotem | krok ≤ 5 µs |
| N = 1 | efekty działają na jednym oku (Fala 1,8 s, limit 1 serwo), bez czekania na inne oczy |

**Strona:**
- `node --check` przechodzi;
- skan konstrukcji spoza Safari 15: brak `=>`, `let`/`const`, `?.`, `??`, `:has`, `dvh`, `structuredClone`, `.at()`;
- Chromium headless 375 × 667 i 320 × 568: brak przewijania w poziomie, wszystkie zakładki i efekty w symulacji bez błędów w konsoli.

## Znane ograniczenia

- **Serwer HTTP nadal obsługuje jedno połączenie naraz.** Ruch już przez to nie staje, ale cichy albo niepełny klient blokuje inne telefony do 5–10 s. Na takie przypadki jest limit 2,5 s na stronie. Jeśli na iPhonie zacięcia się potwierdzą: kopia `WebServer` w szkicu z `HTTP_MAX_DATA_WAIT` 500 ms; stałej nie da się nadpisać ze szkicu.
- **Duże oko:**
  - mapowanie kąt → µs jest liniowe, bez IK prętów (koncepcja v3.1 pkt 3.2) i bez korekty sprzężenia osi; miejsce na to jest w `ikGalki()`, razem z `odwrotnosc()`;
  - powieki „podążające za θ” (v3.1) nie są zrobione;
  - oba te punkty trzeba dodać przed podłączeniem mechanizmu E6.
  - przy `MAX_W_RUCHU` 4 duże oko (2 + 1 + 1) potrafi zająć cały limit i małe oczy chwilę czekają.
- **Podgląd** pokazuje położenie z profilu. Impuls na wyjściu może być za nim do jednego kroku, a przy kalibracji dłużej.
- **Ogranicznik wyjścia** działa na wywołanie zadania ruchu, które przychodzi najwcześniej co 20 ms (`vTaskDelayUntil`). Opóźnione wywołanie daje wolniejszy ruch, nigdy szybszy.
- **Restart:** liczba oczu i duże oko zmieniają się po restarcie. Rekord refleksu i troll są w RAM; „rekord dnia” = od restartu.
- **Watchdog pętli nie jest włączony.**
- **Blokada PIN jest globalna:** 5 złych prób gościa blokuje też rodzica na 60 s.
- **Flash 86 %** przy domyślnym podziale z OTA. Gdyby zabrakło miejsca: `PartitionScheme=huge_app`.
- **Refleks:** wynik liczony od sygnału, który strona szacuje z planu oraz pomiaru z `/api/stan` (± połowa czasu zapytania).
- **Okno captive portal na iOS:** token rodzica jest w `sessionStorage`, więc w tym oknie trzeba logować się ponownie.
- **Skok przy rozruchu** jest możliwy przy pierwszym starcie bez wpisów NVS, po ręcznym przestawieniu oka albo po zaniku prądu w trakcie ruchu (świadome, decyzja 22.10).

## Do sprawdzenia na sprzęcie

1. **Powerbank z nową siecią:** widoczna sieć, do 4 klientów, ruch z limitem 4 serw. Powtórzyć test podtrzymania i test 24 h.
2. **iPhone 7 / iOS 15.8:**
   - czy okno logowania otwiera się samo;
   - co daje „Anuluj” / „Bez internetu”;
   - Safari pod 192.168.4.1;
   - opóźnienie padu, zacięcia przy kilku telefonach;
   - brak powiększania.
3. **Android (Chrome):** powiadomienie o logowaniu i strona.
4. **Kierunki:** dodatni kąt = w prawo, patrząc na dynię; w razie potrzeby „Odwróć kierunek”. Azymuty zgodne z rozmieszczeniem.
5. **Restart samego ESP przy zasilonym PCA** (przycisk Restart, reset na płytce): serwa bez szarpnięcia.
6. **Kalibracja powiek** (każda zamknięta i otwarta, 2° przed ogranicznikami); czas mrugnięcia przy `V_MAX_POW_US` 3500.
7. **Prąd szczytowy** przy Fali, Spłoszonych i Pacynce z dużym okiem.
8. **Po dniu pracy:** licznik „Zapisy NVS od startu”, „Odrzucone kroki” i minimum wolnej pamięci w panelu.
