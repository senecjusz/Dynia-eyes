# E5.5 (B): źródło 5 V bez auto-wyłączania – alternatywy (22.10)

Agent badawczy B, brief `30-projekt/brief-e5.5-powerbank-agenci.md`. Pobór z briefu (szacunek, niezmierzony): średnio 0,3–0,4 A, chwilowo ~1 A; do rachunków **0,35 A ≈ 1,75 W**.

## Fakty (źródła)

- **Tryby „low current” w zwykłych powerbankach mają limit czasu.** Anker Trickle Charging: dwuklik, < 0,5 A, „automatically turns off after 2 hours if no interaction”, wymaga 30–90 mA poboru ([Anker](https://service.anker.com/article-description/What-is-Trickle-Charging-Mode)). Xiaomi: 2 h, wyjście przyciskiem ([Mi FAQ](https://www.mi.com/global/support/faq/details/KA-301691/)). Huawei: ok. 2 h ([Huawei](https://consumer.huawei.com/en/support/content/en-us00748338)). Hobbysta z trybem low current: bank i tak „shuts down after a couple of hours” ([0110.be](https://0110.be/posts/Powering_low_current_electronics_projects_with_power_banks)).
- **Baseus PPAP20K i Manta MPB2001S:** nie znalazłem żadnego źródła o trybie małego prądu ani progu odcięcia (karty sklepów, test [techtest.org](https://techtest.org/die-baseus-ppap20k-20000mah-20w-usb-c-portable-power-bank-im-test-eine-guenstige-und-gute-standard-powerbank)). Ten sam test zmierzył energię Baseusa: **64,8 Wh przy 5 V / 1 A**.
- **Voltaic V25/V50/V75: Always On jako stan domyślny**, „will not shut off even if your device is drawing low or no power. There is no low current cutoff” ([Voltaic](https://support.voltaicsystems.com/kb/getting-started/always-on-mode)); **tylko porty USB-A**, USB-C PD nie jest Always On; Always On nie działa przy ładowaniu przez górne USB-C; pobór własny ~7 mA ([V25](https://voltaicsystems.com/V25)). Ceny w Kiwi Electronics (NL), z VAT: **V25** 24 Wh – 51,65 € (brak), **V50** 48 Wh – 84,86 € (brak), **V75** 72 Wh – **104,54 € (13 szt. dostępne)**, wysyłka do PL od 18,45 € ([V75](https://www.kiwi-electronics.com/nl/merk-voltaic-systems/v75-usb-battery-pack-10102), [V50](https://www.kiwi-electronics.com/en/batteries-powerbanks-93/v50-usb-battery-pack-4351)). Polskiego sprzedawcy nie znalazłem.
- **ESP32-C3 SuperMini:** pin 5V przyjmuje **3,3–6 V**, LDO ME6211 lub podobny ([components101](https://components101.com/development-boards/esp32c3-mini-development-board-datasheet-pinout)); tańsze klony mają XC6206 200 mA ([mischianti](https://mischianti.org/esp32-c3-plus-mini-1-esp32-c3_mini_v1-high-resolution-pinout-datasheet-schema-and-specs/)).
- **NiMH:** Eneloop AA 2000 mAh, min. 1900 mAh ([budgetlightforum](https://budgetlightforum.com/node/67024)); 4 szt. **66,90 zł** ([x-kom](https://www.x-kom.pl/p/1068323-bateria-i-akumulatorek-panasonic-eneloop-aa-2000mah-4-szt.html)); ładowarka BQ-CC55 + 4 × Eneloop Pro 2500 – **159,90 zł** ([Komputronik](https://www.komputronik.pl/product/770129/panasonic-smartplus.html)); koszyk 4 × AA z pokrywą i włącznikiem ok. 4 zł ([Botland](https://botland.store/236-battery-holder-for-4-aa-r6-batteries-with-cover-and-switch.html)). Ceny Eneloop D w PL nie znalazłem.
- **Zasilacz:** Okdo 5 V / 3 A USB-C, 36,72 zł z VAT ([RS](https://pl.rs-online.com/web/p/zasilacze-do-raspberry-pi/2012167/)); oryginalny Raspberry Pi 5,1 V / 3 A w Botlandzie ([Botland](https://botland.store/14348-zasilacz-usb-c-51v-3a-do-raspberry-pi-4-oryginalny-czarny.html)).
- **W `50-elektronika/sprzet.md`** nie ma: akumulatorów NiMH, ładowarki, koszyków, zasilacza 5 V, miernika USB, kondensatora 470–1000 µF (ten jest na liście braków i jest potrzebny w każdym wariancie).

## Interpretacja (rachunek)

- **Czas pracy przy 0,35 A:** 4 × AA 1900 mAh wprost ≈ **5,4 h** (0,3 A: 6,3 h; 0,4 A: 4,8 h); 4 × AA Pro 2450 mAh ≈ 7 h; 4 × D ~5700 mAh ≈ 16 h; Baseus 64,8 Wh / 1,75 W ≈ 37 h (jeśli się nie wyłącza); V75 72 Wh × 0,85 / 1,75 W ≈ 35 h; V50 ≈ 23 h; V25 ≈ 11 h.
- **4 × NiMH wprost, bez przetwornicy:** 4,8 V nominalnie to standardowe napięcie pakietu odbiornika RC, pod które projektowane jest SG90. Pakiet ma 5,6–5,8 V tuż po ładowaniu i 4,0 V przy 1,0 V/ogniwo. Mieści się w 3,3–6 V pinu 5V. LDO daje 3,3 V do ok. 3,5 V wejścia, a serwa przy 4,0 V są tylko wolniejsze. Mały opór wewnętrzny NiMH dobrze znosi szczyty 1 A. Bez elektroniki nie ma czego wyłączać. Przetwornica z 2–3 ogniw dodaje straty, prąd szczytowy z ogniw i własne zachowanie przy małym poborze, więc odpada.
- **Ocena wcześniejszej rady (NiMH odradzany):** argument „ok. 1 dzień” był zawyżony. 2400 mAh przy 0,35 A to ok. 7 h, a nie 8. Ograniczeniem NiMH jest tylko pojemność, a nie niezawodność. Pod względem auto-wyłączania i resetów to najpewniejsze źródło bez gniazdka. Użytkownik miał rację, że to rozsądny kierunek.
- **Ryzyka NiMH:** (1) **4 × alkaliczne AA to 6,4 V na świeżo, czyli powyżej 6 V pinu 5V.** Ktoś może je włożyć przy wymianie; trzeba wyraźnie opisać koszyk (np. „TYLKO akumulatory 1,2 V”). (2) Zwarcie pakietu daje kilka A, więc warto dać bezpiecznik polimerowy ~1,5 A. (3) Pinu 5V z baterii i USB z komputera nie łączyć naraz (`polaczenia.md`). Pod względem dziecka NiMH jest bezpieczniejszy niż Li-ion.
- **Voltaic** to jedyny powerbank, który według producenta nie ma progu odcięcia. Jest drogi (~0,5 tys. zł z wysyłką), sprowadzany z NL, a zachowania przy szczytach serw nikt nie sprawdził.
- **Interpretacja orkiestratora** (cykl ~15 s = ponowne wykrywanie po odcięciu) zgadza się z danymi: B–E dają stały czas życia mimo różnych przerw w ruchu, przyczyna to `POWERON`, a w E powerbank „poddał się”. Nie wyklucza to jednak, że Baseus odcina także przy szczycie prądu (zabezpieczenie). Bez miernika obu przyczyn się nie rozróżni.

## Założenia

Średni pobór 0,3–0,4 A to szacunek. Gniazdko na wystawie: nieznane. Kurs ~4,25 zł/€. Że użytkownik ma w domu ładowarkę USB 5 V ≥ 2 A (telefon): prawdopodobne, niesprawdzone. Pojemność Eneloop D: ~5700–6000 mAh według źródeł wtórnych.

## Zestawienie

| Wariant | Koszt | Czas przy 0,35 A | Auto-off / reset | Wymiana bez narzędzi | Bezpieczeństwo (dziecko) |
|---|---|---|---|---|---|
| Zasilacz USB 5 V / 3 A (jeśli jest gniazdko) | 0 zł (ładowarka z domu) – 37 zł | bez limitu | brak | wtyczka | 230 V tylko w zasilaczu; kabel na podłodze |
| 4 × NiMH AA wprost, 2 komplety | 67 zł + 67 zł + koszyki 8 zł (+ ładowarka, jeśli brak) | **~5–7 h**, wymiana w połowie dnia | brak | koszyk z wtykiem | dobre; ryzyko alkalicznych 6,4 V |
| 4 × NiMH D wprost | koszt nieustalony (cen D w PL nie znaleziono) | ~16 h (2 dni) | brak | koszyk | dobre; ciężkie (~0,7 kg) |
| Voltaic V75 (USB-A) | ~105 € + 18 € ≈ 520 zł | ~35 h | brak według producenta | wtyczka USB | Li-ion w obudowie z ochroną |
| Baseus z podtrzymaniem (pytanie A) | 0 zł | ~37 h | **ryzyko: niesprawdzone** | wtyczka USB | Li-ion w obudowie |
| Tryb low current (Anker / Xiaomi) | – | 2 h | wyłącza się po 2 h | – | odpada |

## Najtańszy test (bez pilnowania)

Program jak `test-24h` (stały ruch według firmware'u wystawowego), zapis do NVS co 60 s: czas od startu, liczba ruchów, `esp_reset_reason()`, a przy NiMH także **napięcie pakietu z ADC**. Dzielnik 200 k / 100 k z V+ na wolny pin ADC (ESP32-C3 przy tłumieniu 11 dB mierzy do ok. 2,5 V). Użytkownik wkłada naładowany komplet NiMH (albo podłącza zasilacz), uruchamia płytkę wieczorem i rano czyta wynik. Wynik: krzywa rozładowania, czas do 4,2 V, czyli praktyczny koniec, i 0 restartów. **Wariant potwierdzony = ≥ 8 h przy firmware wystawowym bez żadnego startu `POWERON`/`BROWNOUT`.** Koszt: komplet Eneloop i ładowarka (jeśli ich nie ma) plus 2 rezystory. Czas: jedna noc. Przy zasilaczu ten sam test trwa 8 h i sprawdza tylko liczbę restartów.

## Rekomendacja

Z gniazdkiem zasilacz USB 5 V / 3 A, bez gniazdka 4 × NiMH AA wprost na V+ i 5V w dwóch opisanych kompletach wymienianych w połowie dnia (4 × D, jeśli nocny test da < 8 h, a Voltaic V75 za ~520 zł tylko wtedy, gdy musi to być jeden pakiet na cały dzień).
