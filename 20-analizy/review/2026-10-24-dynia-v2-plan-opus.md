# Review planu `dynia-v2` (Opus, 24.10)

Sprawdziłem: `50-elektronika/dynia-v2-plan.md`, `30-projekt/PRD.md` §5–6, kod `dynia/` (`dynia.h`, `dynia.ino`, `ruch.cpp` w części: PCA, mapowanie, NVS, rozruch; README nagłówek), `oczy-ruch.ino`, `test-powerbank-wifi.ino`, `kalibracja-oczu.md`, `kalibracja.ino` (grep), `20-analizy/2026-10-22-powerbank-a-obciazenie.md`, briefy E7. Raportów innych recenzentów nie czytałem.

## Zgodność tabeli z kodem

Wiersze 1–4, 6, 10, 14–17 zgadzają się z kodem: PCA przez `Wire` z `ALL_LED_OFF`; 27 MHz i prescale 131; rozruch co 150 ms; NVS z limitem 2 s na napęd i 0,5 s na całość; 200°/s; 80 µs/krok; 4 serwa na kanałach 12–15. Rozbieżności:
- **Wiersz 18 jest błędny.** Podtrzymanie powerbanku w `dynia/` istnieje: to stale włączony punkt dostępu (`dynia.ino`: „Punkt dostępu… włączony stale: podtrzymuje powerbank (test 22.10)”, `serwerStart()` przed `ruchStart()`). `test-powerbank-wifi.ino` podaje, że 22.10 Baseus bez Wi-Fi odcinał prąd co ok. 15 s.
- Wiersz 13: część „Wi-Fi” jest wymagana przez §5 (tylko powerbank), nie tylko przez stronę.
- Wiersz 15 (dziennik NVS, przyczyna restartu): PRD tego nie wymaga. To jednak jedyny sposób, żeby po szkole odróżnić odcięcie przez powerbank od brownoutu. Patrz propozycje poza PRD.
- Drobiazg: komentarz w `dynia.ino` mówi o kanałach 13–15, a `dynia.h` ma 12–15. Nie przenosić tego do v2.

## Uwagi

**KRYTYCZNE 1: etap 1 „bez Wi-Fi” i pusta funkcja podtrzymania.**
- Miejsce: plan, etap 1, punkty „bez Wi-Fi” i „pusta funkcja”.
- Scenariusz: dynia na Baseusie gaśnie po ok. 15 s i startuje od nowa, w kółko. Spoczynek (1 SG90 co 5 s, 6–10 mA na trzymanie) nie podtrzyma powerbanku. Według raportu z 22.10 krótkie sakady to zawodne obciążenie.
- Poprawka: w etapie 1 `WiFi.softAP` ukryty, bez serwera, jak w `test-powerbank-wifi` (3 linie). Uruchomić go przed rozruchem serw. Wiersz 18 poprawić na „jest: AP stale”.
- Test etapu 1 robić na Baseusie, nie na USB komputera, przez ≥ 30 min.
- Pewność: wysoka.

**WAŻNE 2: etap 1 bez PIR nie działa w szkole.**
- Miejsce: etapy 1 i 2.
- Scenariusz: po etapie 1 tryb przełącza tylko port szeregowy, więc w szkole dynia zostaje w spoczynku z zamkniętym dużym okiem. To połowa §6.
- Poprawka: PIR (ok. 20 linii) włączyć do etapu 1 albo nazwać „minimum na szkołę = etap 1 + 2”. Szczegóły PIR:
  - pin poza 2, 8, 9 (piny strapping i I²C), np. GPIO 3, 4 albo 10;
  - zworka H (retrigger);
  - 30–60 s rozgrzewania ignorować;
  - N = 30 s zostaje jako założenie.
- Ryzyko: HC-SR501 bywa wyzwalany fałszywie przez nadajnik Wi-Fi ESP w pobliżu, a AP działa stale (pkt 1). Sprawdzić w pudełku na stole przez 10 min bez ludzi.
- Pewność: wysoka (wymaganie), średnia (zakłócenia).

**WAŻNE 3: rdzeń ruchu w etapie 1 wymusi przepisanie w etapie 3.**
- Miejsce: etap 1 (smoothstep z `oczy-ruch`) i etap 3 (Hermite z `ruch.cpp`).
- Scenariusz: `oczy-ruch` ma stan oka `start/cel/u`, bez prędkości. Zmiana celu w biegu, przeplatanie i powieka podążająca za spojrzeniem wymagają stycznych (`s, c, m0, m1`). Silnik i automat trzeba by napisać od nowa.
- Poprawka: w etapie 1 wziąć z `ruch.cpp` model napędu z profilem Hermite'a. Przy zerowych stycznych to dokładnie smoothstep. Pominąć kolejki efektów (`Krok q[12]`) i kalibrację.
- Powieki od początku trzymać jako oś 0–100 %, nie jako przełącznik „zamknięte/otwarte”. Etap 3 potrzebuje rozwarcia zależnego od nastroju i od θ.
- Pewność: wysoka.

**WAŻNE 4: „pętla na `millis()`” nie wystarczy pod serwer z etapu 4.**
- Miejsce: etap 1, ostatni punkt.
- Scenariusz: synchroniczny `WebServer` wysyła stronę 93 KB po Wi-Fi przez setki ms. W tym czasie `loop()` nie liczy kroków co 20 ms i serwa się zacinają. Właśnie dlatego `dynia/` ma osobne zadanie FreeRTOS (wiersz 16).
- Poprawka: w etapie 1 od razu zadanie ruchu z `vTaskDelayUntil` co 20 ms, jak w `dynia.ino` (ok. 15 linii). Wtedy etap 4 tylko dokłada serwer i mutex.
- Pewność: średnio-wysoka.

**WAŻNE 5: prąd przy starcie i przy ruchu.**
- Miejsce: etap 1, punkt „Start…”.
- Fakty i założenia o prądzie:
  - pierwszy impuls daje skok, gdy pozycja w NVS nie zgadza się z rzeczywistą;
  - SG90 zablokowany pobiera ok. 360 mA (protosupplies, w raporcie z 22.10);
  - MG90S szacuję na 0,5–0,7 A (założenie, typowa karta).
- Scenariusz: włączanie kanał po kanale co 150 ms jest bezpieczne. Plan nie mówi jednak, czy dojazd „płynnie na środek” idzie dla 11 kanałów naraz. Do tego szczyt nadawania ESP przy starcie AP wynosi ok. 335 mA. Skutek: brownout ESP albo zabezpieczenie powerbanku, potem pętla restartów.
- Poprawka: dojazd po rozruchu też pod limitem serw naraz i wolno (`US_KROK_WOLNO` 4 µs/krok jak w `ruch.cpp`). AP przed serwami. Kondensator 470–1000 µF przy V+ PCA według `polaczenia.md`.
- Plan powinien podać wspólny limit w pracy: 2 małe + duże oko (do 3 MG90S) = do 5 serw naraz, a nie tylko „2 małe”.
- Pewność: średnia.

**WAŻNE 6: zgodność z tabelą kalibracji.**
- Miejsce: etap 1, punkt `kalibracja.h`.
- Plan wymienia tylko „środki i krańce”. Etap 1 potrzebuje jeszcze dwóch rzeczy:
  - kolumny **„Min to”** (kierunek lewo/prawo, góra/dół, która skrajność powieki to „zamknięte”);
  - przeliczenia µs → ticki dokładnie jak w `kalibracja-oczu.md` (27 MHz, prescale 131, zaokrąglenie). Przy 25 MHz błąd wynosi ok. 110 µs, czyli więcej niż zapas 20–30 µs przed oporem. Serwa buczą na oporze, a MG90S grzeje przekładnię.
- Poprawka: wziąć `pcaStart()` i `wyslij()` z `ruch.cpp` (liczą już tak samo), nie domyślny `Adafruit::begin()`. W `kalibracja.h` dla każdego kanału zapisać środek, min, max i znak.
- Fakt: tabela w `kalibracja-oczu.md` jest dziś **pusta**, a kanały 12–14 są „do potwierdzenia”. Bez niej etap 1 nie przejdzie testu na stole.
- Pewność: wysoka.

**WAŻNE 7: rogi zakresu dużego oka.**
- Miejsce: etap 1, „rozglądanie lewo–prawo, góra–dół”.
- Scenariusz: każdą oś kalibrowano osobno. Cel losowany niezależnie w min–max obu osi trafia w róg (X max i Y max naraz). Przy drutach v2 i sprzężeniu osi (komentarz w `ruch.cpp`: Y +5,4° przy ψ +25°) może dojść do oporu albo zakleszczenia.
- Poprawka: cel gałki ograniczyć do elipsy, np. (x/X)² + (y/Y)² ≤ 1. Na stole raz sprawdzić 4 rogi.
- Kolejność ruchów: gałka na środku, zanim powieka się zamknie. Gałka nie rusza się przy zamkniętej powiece (PRD: w spoczynku duże oko zamknięte).
- Pewność: średnia.

**DROBNE 8: NVS.**
- Zużycie flash (szacunek): przy limicie 0,5 s to najwyżej 7 200 zapisów/h. Domyślna partycja NVS ma 20 KB, czyli 5 stron po 126 wpisów. Wychodzi ok. 14 kasowań strony/h, czyli ok. 7 000 h do 100 tys. cykli. Na kilka dni wystawy wystarczy.
- Skok po zaniku zasilania: `ruch.cpp` zapisuje cel przy starcie ruchu. Odcięcie zasilania w trakcie sakady (wymiana powerbanku według §5) daje skok najwyżej o długość sakady. To akceptowalne, ale trzeba to zapisać jako znane ograniczenie.
- Kasowanie strony NVS trwa kilkadziesiąt ms. Bez osobnego zadania (pkt 4) daje widoczne zacięcie.
- Przestrzeń pozycji osobna od `kalib` z `kalibracja/`, jak w `dynia/` („dyniapoz”).

**DROBNE 9: lid na starcie.** Środek powieki to według tabeli „pozycja do nasadzania”, czyli w połowie otwarcia. Start „płynnie na środek”, a potem tryb spoczynku zamyka powiekę. Lepiej od razu jechać do „zamknięte”.

**DROBNE 10: etap 3, wariant A.** Przy obu powiekach na jednym serwie „powieka górna podąża za spojrzeniem” oznacza zmianę rozwarcia obu powiek wraz z θ. Zapisać to w opisie etapu 3, żeby nie szukać osobnego kanału.

## Propozycje poza PRD (osobno)

- Z `dynia.ino` zostawić dziennik NVS (czas pracy, liczba startów, przyczyna restartu), ok. 30 linii. Po szkole pokaże, czy dynia gasła.
- Odczyt kalibracji z NVS `kalib` jako zapas przy pustym lub błędnym `kalibracja.h`. To kłóci się z ustaleniem „program bierze z tabeli”, więc tylko jeśli użytkownik zechce.

## Werdykt

Planu etapu 1 nie dawać jeszcze do zatwierdzenia. Najpierw poprawić podtrzymanie (Wi-Fi AP w etapie 1, wiersz 18), włączyć PIR do minimum na szkołę i przyjąć rdzeń ruchu z `ruch.cpp` z osobnym zadaniem. Po tych zmianach można go zatwierdzić.
