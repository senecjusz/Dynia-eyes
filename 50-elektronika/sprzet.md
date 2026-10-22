# Sprzęt

## Mamy (zamówione 11.10.2026)

| Część | Ilość | Uwagi |
|---|---|---|
| **ESP32-C3 SuperMini (V1601)** – kontroler | 1 | Wi-Fi (kalibracja przez telefon), I²C do PCA9685 (typowo GPIO8 SDA / GPIO9 SCL), drugi sprzętowy UART na radar LD2450, USB w układzie. Logika 3,3 V. Piny startowe 2, 8, 9 – nie ciągnąć do masy przy starcie. Piny do wlutowania |
| NodeMCU v3 LoLin (ESP8266, CH340G) – zapas | 1 | Wi-Fi, ale jeden sprzętowy UART (zajęty przez USB) – słabo pod radar LD2450 |
| Arduino Nano 3.0 (ATmega328, CH340, USB-C, zlutowany) – zapas | 1 | Bez Wi-Fi. Na Windowsie może być potrzebny sterownik CH340 |
| Sterownik serw PCA9685, 16 kanałów, I²C | 1 | Steruje wszystkimi serwami, ESP32-C3 wysyła tylko komendy (I²C) |
| Serwo SG90 9 g | 8 | 4 szt. od MicroChipCompany + 4 szt. od OMEGA_ZONE. **Kabel wychodzi u dołu krótszego boku, od strony wałka** – uwzględniać w CAD. Wymiary różnią się między dostawcami – przed serią zmierzyć każdego (Parking w `teraz.md`; kieszeń v2.8 ma 0,4 z każdej strony) |
| Czujnik ruchu PIR HC-SR501 | 1 | Wystarczy do „ktoś podszedł → oczy się budzą”, nie do śledzenia kierunku |
| Piłeczki pingpongowe | ✓ | Małe oczy (Ø 40 mm) |
| Przegub krzyżowy (kardan) 5/5 i 2/2 | ✓ | 5/5: Ø11 × 25,5, otwory Ø5 (głęb. 7), wkręty dociskowe M4 – środek gałki dużego oka (pomiar 22.10, ze zdjęć). 2/2 za słaby |
| Przeguby kulowe RC: 2 × M2, 2 × M5 | 4 | Pręty napędu gałki dużego oka (M2 przy gałce, M5 przy orczyku – koncepcja v2); wymiary do zmierzenia |
| Wkręty bez łba M3 (DIN 913) | ✓ | Osie powiek dużego oka |
| Łożyska 608-2RS (8 × 22 × 7) i 6802-2RS (15 × 24 × 5) | ✓ | W dużym oku nieużyte (koncepcja v2) |
| Pręty stalowe 500 mm: Ø1,0 i Ø1,2 sprężynowe, Ø2,0 ocynkowany | po 1 | Ø1,2 – łączniki powiek dużego oka z zagięciami Z (koncepcja v2); poza tym preferujemy części drukowane |
| Warsztat Arduino / ESP32 | ✓ | Dużo modułów – przed zakupem czegokolwiek sprawdzić, czy już jest |
| Arduino Uno, Arduino Mega, ESP32, Raspberry Pi | ✓ | Zapas, gdyby Nano nie wystarczyło (pamięć) – PCA9685 przez I²C działa z każdym |
| Powerbank Baseus Airpow PPAP20K, 20 000 mAh, 3 porty | 1 | Główne zasilanie (decyzja 20.10). Przed wystawą: test podtrzymania (E5.5) |
| Powerbank Manta MPB2001S Sunny, 20 000 mAh, 2 porty | 1 | Zapas na zmianę. Przed wystawą: test podtrzymania (E5.5) |
| Przepusty kablowe szczelne **PG9** | ✓ | Do pudełka elektroniki (kabel Ø ~4–8 mm, otwór montażowy ~15,2 mm) |
| Otwornice: **45, 50, 56, 62 mm** (stałe), **nastawna do 64 mm**, maks. **80 mm** | ✓ | Otwory w dyni – projektować pod te średnice |
| Serwo MG90S Miuzei MS60-4-D-V1 (metalowe przekładnie) | 4 | Dotarły (22.10). Duże oko: 4 serwa (lewo–prawo, góra–dół, 2 powieki), bez zapasu. Korpus ok. 22,4 × 12,1 × 22,8, rozstaw otworów uszu 27,7 |
| Drukarki 3D: Bambu Lab **A1 mini** (stół 180 × 180 × 180) i **X1 Carbon** (256 × 256 × 256) | 2 | Duże części (pudełko-wieża) na X1C |
| Śruby M3 / M4 / M5, 8–50 mm, nakrętki | komplet | Można zakładać dowolną potrzebną śrubę i nakrętkę (M5 bez najkrótszych 6 mm) |
| Nakrętki samohamujące M3 (z nylonem) i podkładki M3 (Ø7) | ✓ | Przeguby C i H modułu oka (v2.7+), użyte 21.10 |
| Wkręty M2×6 krzyżakowe | ✓ | Dźwigienka do Ramienia i wkręt środkowy w wałek SG90 (jedyne M2 w module v2.8) |
| Wkładki gwintowane do wtapiania | zestaw 360 szt. (M2–M6, 1/4"), podwójne radełko; M3: 4×5 / 5×5 / 6×5 (długość × Ø), po 30 szt. | Do gwintów wielokrotnie skręcanych. Od v2.8 moduł oka nie ma wkładek (śruby M3 wprost w plastik, decyzje 21.10); M3×4×5 z gniazdem `wkladkaD` 4,4 były w v2.6–v2.7 |

## Zamówione (w drodze)

| Część | Ilość | Uwagi |
|---|---|---|
| Serwo SG90 | 10 | Razem będzie 18 × SG90 |

## Brakuje

| Część | Do czego | Poziom |
|---|---|---|
| Gniazdo USB-C (breakout) z 5,1 kΩ na CC1/CC2 + przewody do V+ i 5V | Zasilanie z powerbanku, wymiana bez narzędzi (decyzja 20.10, [analiza](../20-analizy/2026-10-17-zasilanie-powerbank.md)) – **sprawdzić, czy jest w warsztacie** | 1 |
| Kondensator elektrolityczny 470–1000 µF / ≥10 V | Na zasilanie serw przy PCA9685 – tłumi spadki napięcia przy ruchu wielu serw | 1 |
| Przewody dupont (F-F, M-F), ewentualnie przedłużacze serw | Połączenia; serwa w dyni mogą być dalej od płytki | 1 |
| Coś na duże oko (np. większa piłka lub wydruk półkuli) | Duże oko | 2 |
| Radar HLK-LD2450 – **do zamówienia teraz** (LD2420 nie podaje kierunku) | Śledzenie przez duże oko: otwarcie + kierunek | 2.7 |
| 2–3 zapasowe moduły oczu (wydruk + SG90) | Szybka wymiana w szkole, gdy dziecko uszkodzi oko | 1 |

## Podział serw (propozycja)

Razem: **18 × SG90 + 4 × MG90S = 22 serwa.**

- **Duże oko – MG90S:** 2a = 2 serwa (lewo–prawo, powieka), 2b i 2c = 3 serwa (+ góra–dół; w 2c obie powieki z jednego serwa). Jedno MG90S zapasowe.
- **Małe oczy – SG90:** po 1 serwie na oko (ruch na boki), czyli do 18 małych oczu. Część SG90 może zostać jako zapas.
- **Kanały:** jeden PCA9685 ma 16 wyjść. Przy więcej niż 16 serwach potrzebny drugi PCA9685 – łączy się szeregowo na tej samej magistrali I²C, trzeba tylko zmienić adres zworką (A0). Sprawdzić, czy jest w warsztacie.
- **Zasilanie:** przy kilkunastu serwach zasilacz 5 V **min. 5–6 A** zamiast 3 A (SG90 ~0,2–0,3 A w ruchu, do ~0,7 A przy zablokowaniu). Oczy poruszane losowo rzadko ruszają się wszystkie naraz, ale zapas się przydaje.
