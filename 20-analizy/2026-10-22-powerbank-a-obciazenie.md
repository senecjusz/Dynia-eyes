# Powerbank a obciążenie podtrzymujące (E5.5, pytanie A, 22.10)

Raport agenta badawczego do briefu `30-projekt/brief-e5.5-powerbank-agenci.md`. **F** = fakt (źródło), **I** = interpretacja, **Z** = założenie.

## 1. Progi auto-wyłączenia i tryb małego prądu

- **F:** Kontrolery powerbanków Injoinic: wyłączenie przy prądzie < 45 mA (min. 20, maks. 80 mA) trwającym 32 s (24–40 s); w czuwaniu same wykrywają podłączenie odbiornika ([IP5305T, karta katalogowa](https://wmsc.lcsc.com/wmsc/upload/file/pdf/v2/lcsc/2203210916_INJOINIC-IP5305T_C2982924.pdf)).
- **F:** Pomiary 3 tanich powerbanków: potrzebny prąd 100 / 30 / 10 mA, czas do wyłączenia 10 / 16 / 18 s ([zakkemble](https://blog.zakkemble.net/smart-power-bank-keep-alive/)). Inny powerbank potrzebował ok. 150 mA ([0110.be](https://0110.be/posts/Powering_low_current_electronics_projects_with_power_banks)).
- **F:** Baseus Airpow: wyjście włącza się samo po podłączeniu odbiornika ([ixbt](https://www.ixbt.com/live/comments/3271406)). Sklepy piszą tylko „Auto Shut-Off” ([dcs.dk](https://www.dcs.dk/en/p/1002748568)). **Nie znalazłem progu, czasu ani trybu małego prądu dla PPAP20K.** Dla Manty MPB2001S nie znalazłem żadnych danych.
- **F:** Inny Baseus (PicoGo AM31): podwójne naciśnięcie włącza tryb małego prądu, dioda miga w kółko (instrukcja, [device.report](https://device.report/manual/16337890); znam tylko z opisu w wynikach wyszukiwania). U Xiaomi i Aukey ten tryb sam wyłącza się po 2 h ([Xiaomi FAQ](https://www.mi.com/uk/support/faq/details/KA-301691/)), czyli na 8 h nie wystarczy.
- **I, ocena hipotezy orkiestratora.** Mocne strony: przyczyna `POWERON` oznacza pełne odcięcie wyjścia, nie spadek napięcia. Około 15–20 s od podania zasilania pasuje do dolnej granicy czasów ze źródeł (10–40 s). Cykl wyłącz–włącz sam ze sobą też pasuje: kontroler w czuwaniu wykrywa ESP jako nowy odbiornik. Słabe strony: (a) przebieg A trzymał ponad 5 min przy prądzie **nie większym** niż w B–E (PCA bez oscylatora, serwo bez impulsu), a A też zaczął się bez przycisku. Sam za mały prąd tego nie wyjaśnia: Baseus musiał być wtedy w innym stanie niż w B–E, a tego stanu nie znamy. (b) To, że ruch w C nie pomógł, niczego nie obala: rampa 110 µs w 1 s to małe kroki co 20 ms, więc **Z:** średnio raczej dziesiątki mA niż 100–250 mA. (c) Nie wykluczono innej przyczyny: komentarz w programie mówi, że na powerbanku `if (Serial)` bywał prawdziwy, czyli linie D+/D− portu USB-A zmieniają stan natywnego USB w ESP32-C3. Wpływ wykrywania szybkiego ładowania (QC/BC1.2) na wyjście jest **możliwy, niesprawdzony**. Hipoteza jest prawdopodobna, ale nie udowodniona. Rozstrzyga ją test z punktu 4.

## 2. Sztuczne obciążenie: liczby

- **F:** Obciążenie impulsowe działa u większości, ale nie u wszystkich: „0,3 s co 4,5 s przy ok. 200 mA” wystarcza dla ok. 90% powerbanków, niektóre Ankery 20 Ah potrzebują 3 s co 100 s, a impuls 100 ms bywał zawodny ([EEVblog](https://eevblog.com/forum/projects/(yet-another)-power-bank-stay-on)). Sotabeams zrezygnowało z impulsów, bo część powerbanków próbkuje prąd rzadko i gaśnie po długim czasie. Stałe obciążenie 6–150 mA działało u nich zawsze ([Sotabeams](https://sotabeams.co.uk/usb-battery-pack-keep-alive-load/?revpage=3)).
- **F, gotowe moduły:** Electrokit EKM004: 90 mA (z mostkiem 180 mA) przez 100 ms co 4–45 s, 49 SEK, Szwecja ([Electrokit](https://docs.electrokit.com/en/modules/EKM004/index.html)). Pi Hut KeepAlive: 100 / 145 / 170 mA przy wypełnieniu 50%, 6–7,5 GBP w [elecena](https://elecena.pl/product/27808846/rss), a więc **Z:** ok. 35–45 zł z wysyłką. W polskim sklepie z ceną w złotych nie znalazłem.
- **Wersja z części (Z: rezystory i MOSFET są w warsztacie, w `sprzet.md` ich nie ma):**

| Wariant | Element | Prąd / moc | Grzanie (Z) | Energia na dzień 8 h (Z: 63 Wh użytkowe = 74 Wh × 0,85) |
|---|---|---|---|---|
| Stały | 47 Ω / **2 W** między 5V a GND przy PCA | 106 mA / 0,53 W | +25–40 K (przy 1 W: +50–60 K, gorący) | 4,3 Wh = **7%** pojemności |
| Impulsowy | 22 Ω / 1 W + MOSFET logic-level (AO3400, IRLML2502; 2N7000 na granicy przy 3,3 V), bramka z wolnego kanału PCA9685 (`setPWM(k, 4096, 0)` = stale wł.), 100 kΩ do masy; 0,3 s co 4,5 s | 227 mA szczytowo, 15 mA średnio | kilka K | 0,6 Wh = 1% |
| Wi-Fi AP stale (punkt 3) | brak części | ok. +80 mA / 0,4 W | brak | 3,2 Wh = 5% |

- **I, czas wystawy:** przy 0,3–0,4 A (2 W) 63 Wh daje 31–42 h, czyli 3,9–5,2 dnia po 8 h. Obciążenie stałe 0,1 A skraca to do 25–34 h (3,1–4,2 dnia), impulsowe o ok. 3%. **Z:** pełny zestaw w spoczynku (10 × SG90 trzymające po 6–10 mA, [protosupplies](https://protosupplies.com/product/servo-motor-micro-sg90/)) bierze już 60–100 mA plus ESP, więc test z 1 okiem to najgorszy przypadek.

## 3. Czy wystarczy samo firmware

- **F:** ESP32-C3: odbiór Wi-Fi 84 mA, nadawanie 802.11b 335 mA (przy 3,3 V), modem-sleep 16–28 mA ([zestawienie danych Espressif](https://docs.deneyapkart.org/en/Cards/Deneyap-Kart-G/Power-Consumption-esp32-c3)). **I:** w trybie AP radio nie śpi, więc ESP bierze stale ok. 85–100 mA. Regulator LDO nie zmniejsza prądu, czyli z 5 V płynie tyle samo. To stały prąd powyżej typowego progu 45 mA, ale poniżej 100–150 mA, których potrzebują niektóre powerbanki.
- **F:** SG90 w ruchu 100–250 mA, zablokowany ok. 360 mA (pomiar sprzedawcy, [protosupplies](https://protosupplies.com/product/servo-motor-micro-sg90/)). **I:** sakada 10–25° przy 0,1 s/60° trwa ok. 50–100 ms, a takie impulsy źródła uznają za zawodne. Sam ruch oka co 5 s to słabe podtrzymanie. Pomóc mógłby wolniejszy, wymuszony ruch trwający ≥ 0,3 s, ale to zmienia wygląd ruchu oczu.

## 4. Najtańszy test (bez części, ok. 50–60 min, bez pilnowania)

Zmiana `test-powerbank` (opis, bez kodu w repo): klucz `etap` w NVS, a w zapisie co 5 s czas od startu, etap i przyczyna startu.
- **Przebieg 1** (po skasowaniu NVS, Baseus włączony **jednym** naciśnięciem przycisku): etap 1 to `WiFi.softAP(...)` i serwo jak dziś przez 30 min. Potem etap 2: `WiFi.mode(WIFI_OFF)`, to samo serwo, zapis aż do zgaśnięcia. Wynik: czas do **pierwszego** wyłączenia od świeżego włączenia.
- **Przebieg 2 i dalsze** (start `POWERON` w trybie ponownego wykrywania): etap 3, czyli AP włączone od razu.
- **Odczyt:** E1 ≥ 30 min, E2 gaśnie po X s, E3 ≥ 10 min: za mały prąd potwierdzony, AP wystarcza. E3 gaśnie po ok. 15 s mimo AP: przyczyna to nie (tylko) prąd, następny krok to kabel tylko do ładowania albo port USB-C. E1 gaśnie: ok. 100 mA za mało, następny krok to ten sam test z 47 Ω / 2 W. Potem to samo na Mancie. Podwójne naciśnięcie przycisku sprawdzić osobno (czy diody migają w kółko), nie w tym przebiegu.

**Rekomendacja:** najpierw podtrzymanie bez części, czyli stale włączony Wi-Fi AP (ok. +80 mA, 5% energii na dzień). Jeśli test go obali, impuls 22 Ω przez MOSFET z wolnego kanału PCA9685 (0,3 s co 4,5 s, 1% energii), a obciążenie stałe 47 Ω / 2 W jako najpewniejsze, choć najdroższe w energii.
**Najtańszy test:** zmieniony `test-powerbank` z etapami AP wł. / AP wył. / AP po restarcie, ok. 1 h. Użytkownik wgrywa program, kasuje zapis, podłącza Baseusa, raz wciska przycisk, zostawia płytkę i potem odczytuje NVS. Nic nie trzeba kupować.
