# Review: `50-elektronika/kalibracja/kalibracja.ino` (Opus)

Zakres: cały program, z `polaczenia.md`, PRD §5–6 i szablonem `kalibracja-oczu.md`. Nie kompilowałem: na tym komputerze (Windows) nie ma rdzenia esp32 ani biblioteki Adafruit. Sygnatury sprawdziłem z pamięci źródeł Adafruit PWM Servo Driver 3.x i Wire/HWCDC z rdzenia 3.x. Nie czytałem wcześniejszych raportów z `20-analizy/review/`.

## Co sprawdziłem i działa

- **Kompilacja (pewność średnia, bez kompilatora):**
  - W 3.x `setPWM()` zwraca `uint8_t` (0 = OK, 1 = błąd zapisu `Adafruit_I2CDevice`), więc warunki `!= 0` w l. 65 i 88 są dobre.
  - `begin(uint8_t prescale=0)`, `setOscillatorFrequency(uint32_t)` i `setPWMFreq(float)` istnieją.
  - `Wire.requestFrom(uint8_t, uint8_t)` ma dokładne przeciążenie, a `HWCDC::setTxTimeoutMs` i `peek()` istnieją.
  - `setTxTimeoutMs` jest tylko w HWCDC, więc kompilacja wymaga `CDCOnBoot=cdc`. Komenda w l. 10 to ma.
- **Start bez impulsu:**
  - Zapis `0xFD = 0x10` (ALL_LED_OFF_H, FULL_OFF) przed `begin()` gasi wszystkie kanały także po restarcie samego ESP.
  - `begin()` → `reset()` (MODE1 = 0x80) nie rusza rejestrów LED.
  - `setPWMFreq(50)` daje prescale `(int)(27e6/204800 + 0,5 − 1)` = 131 i ustawia AI (0x20). Kontrola w l. 137 przejdzie.
  - Drugi `Wire.begin()` wewnątrz BusIO na rdzeniu 3.x kończy się ostrzeżeniem „already started”, piny 8/9 zostają.
- **Przeliczanie:** 4,889 µs/tick. Zaokrąglenie `+0,5f` zgadza się z wzorem w nagłówku i w `kalibracja-oczu.md`. `setPWM(ch, 0, 4096)` daje bit FULL_OFF. Każdy `t < 4096` go kasuje.
- **Wykrycie zaniku zasilania PCA:** po zaniku MODE1 = 0x11 (SLEEP bez AI). Kontrola w `ustaw()` (l. 76) to łapie i blokuje sterowanie.
- **Parsowanie:**
  - Działają: `k`, `k 3 4`, `k  3`, `g 1500`, `g 1500  500`, `+10`, `-10`, `0600`, linia > 40 znaków.
  - Zakończenie `\r\n`: resztkowy `\n` jest zdejmowany w `ruchG` (l. 157), więc nie przerywa ruchu.
  - Przy przerwaniu `g` znaki nowej komendy zostają w buforze, a pętla w `loop()` je dokończy.
- **NVS:** klucze `s0`–`x15` mieszczą się w 15 znakach. Zapis jest weryfikowany odczytem. Wartość 0 jest jednoznaczna jako „brak”, bo US_MIN = 600.

Błędów, przez które serwo samo skoczy po włączeniu albo zapis trafi do złego kanału, nie znalazłem.

## Uwagi do istniejącego zakresu

### WAŻNE

**W1. Impuls liczbą i `++`/`--` skacze z pełną prędkością w dowolne miejsce 600–2400 µs (l. 186–188, 192).**
- **Scenariusz:** przy dużym oku z założonymi cięgnami literówka („1050” zamiast „1500”, „2100” zamiast „1200”) przesuwa MG90S o ok. 45° w jednym impulsie.
  - Zakres mechaniczny cięgien i powiek jest znacznie węższy niż ±90° z granicy 600–2400.
  - Serwo uderza w opór albo zrywa przegub cięgna.
  - To samo dotyczy małego oka z ogranicznikami ruchu.
  - Granica US_MIN/US_MAX jest wspólna dla wszystkich kanałów i nie chroni mechanizmu.
- **Poprawka:** skok liczbą przy `aktywny` ograniczyć do np. ±150 µs od bieżącego impulsu. Dalej tylko przez `g`, z komunikatem „za daleko, użyj g”. Bez `aktywny` (po `off`) zostaje jak jest. Procedura zastępcza bez zmiany kodu: przy dużym oku wartości liczbą tylko w pobliżu bieżącej, dalekie ruchy przez `g`.
- **Pewność:** średnia (zależy od zakresu cięgien, ale literówka na stanowisku jest realna).

**W2. `min`/`max` zapisują impuls tam, gdzie akurat jest serwo, a wynik nie mówi, czy to opór, czy granica robocza (l. 184–185, szablon `kalibracja-oczu.md`).**
- **Scenariusz:** przy szukaniu krańca naturalne jest dojście `+` do momentu, gdy serwo przestaje iść (opór), i zapis `max`.
  - Program docelowy weźmie to jako kraniec ruchu i będzie regularnie dociskał do oporu.
  - Skutki: prąd utyku SG90/MG90S (ok. 0,6–0,8 A), grzanie, piski, spadki napięcia z powerbanku przy kilku oczach naraz.
- **Poprawka:** w nagłówku programu (l. 4) i w `kalibracja-oczu.md` jedno zdanie: „min/max zapisuj 20–30 µs przed oporem (serwo nie brzęczy)”. Albo jawnie: „min/max = opór, program docelowy odejmuje margines X”. Bez tej definicji dynia-v2 nie wie, jak ich użyć.
- **Pewność:** wysoka.

### DROBNE

**D1. `t` nie ostrzega o niedziałającym NVS (l. 96–114).**
- **Scenariusz:** gdy `nvsOk == false`, tabela ma 0 wierszy i wygląda jak „nic nie skalibrowano”. Komunikat o błędzie NVS był tylko przy starcie (l. 148), a przy `CDCOnBoot` i otwieraniu monitora po wgraniu prawie zawsze ginie.
- **Poprawka:** w `tabela()` przy `!nvsOk` wiersz „BŁĄD: NVS nie działa”.
- **Pewność:** wysoka co do mechanizmu, niska co do częstości.

**D2. Komunikat startowy jest praktycznie zawsze niewidoczny, a `?` nie pokazuje stanu PCA ani NVS (l. 143–148, 52–57).**
- **Scenariusz:** port HWCDC przy TX timeout 0 gubi wydruk z `setup()`, zanim monitor się podłączy. Użytkownik dowie się o błędzie PCA dopiero przy `k`. To akceptowalne, ale `?` przed wyborem kanału odpowiada tylko „brak kanału”.
- **Poprawka:** w `stan()` dopisać jedną linijkę: prescale/`usNaTick` albo „PCA zablokowany”, oraz NVS ok/błąd.
- **Pewność:** wysoka.

**D3. Wiersze tabeli mają pustą kolumnę „Moduł” (l. 105).**
- **Scenariusz:** wklejenie wyniku `t` w miejsce tabeli z szablonu kasuje nazwy („małe oko 3”, „duże oko: powieki”) i wiersze kanałów jeszcze nieskalibrowanych. Trzeba scalać ręcznie, łatwo pomylić wiersz.
- **Poprawka:** w szablonie napisać „przepisz liczby do istniejących wierszy”, albo program wypisuje nazwę modułu dla kanałów 0–7 i 12–14.
- **Pewność:** wysoka.

**D4. Warunek `n < s < x` (l. 104) przy powiece.**
- **Scenariusz:** jeśli pozycja do nasadzania orczyka powieki to jedno z położeń krańcowych (np. zamknięta), to `s == n` i wiersz dostaje „BRAK albo min/max nie po obu stronach środka”, choć kalibracja jest poprawna.
- **Poprawka:** ustalić w szablonie, że środek powieki leży między krańcami (np. połowa otwarcia). Wtedy kod zostaje.
- **Pewność:** niska (zależy od konstrukcji powiek).

**D5. Wynik jest ważny tylko dla tej płytki PCA9685 (nagłówek, l. 9; szablon).**
- **Scenariusz:** µs są liczone przy założonych 27 MHz. Rzeczywisty oscylator PCA9685 różni się między egzemplarzami o kilka procent. Inna płytka w dyni przesunie środki o kilkadziesiąt µs.
- **Poprawka:** w `kalibracja-oczu.md` zdanie „kalibracja dotyczy płytki PCA9685 użytej przy kalibracji, tę samą montować w dyni”.
- **Pewność:** wysoka.

## Propozycje poza zakresem (krótko)

- Komenda kasująca zapis kanału. Teraz omyłkowe `k 8` + `s` zostawia wiersz 8 w tabeli na stałe.
- Kalibracja MG90S dużego oka z osobnym 5 V na V+ (`polaczenia.md` dopuszcza z USB najwyżej 2 × SG90). Utyk MG90S przy szukaniu krańca na USB grozi brownoutem ESP i utratą sesji. NVS przetrwa, ale wybór kanału nie.
- Echo odebranej linii. Przydatne, jeśli terminal (`arduino-cli monitor`) nie pokazuje wpisywanych znaków. Niesprawdzone.

## Werdykt

Program nadaje się do użycia przy kalibracji. Przed kalibracją dużego oka warto poprawić W1 (albo stosować `g` do dalekich ruchów), a przed wpisaniem wyników do programu docelowego trzeba ustalić znaczenie min/max (W2).

---
Poprawione po review (programista, 24.10): W1 (skok liczbą ≤ ±150 µs przy trzymanym serwie), W2 (min/max 20–30 µs przed oporem, w kodzie i szablonie), D1, D3, D5 (szablon). D2, D4 i propozycje bez zmian.
