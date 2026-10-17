# Sprzęt

## Mamy (zamówione 11.10.2026)

| Część | Ilość | Uwagi |
|---|---|---|
| Arduino Nano 3.0 (ATmega328, CH340, USB-C, zlutowany) | 1 | Na Windowsie może być potrzebny sterownik CH340 |
| Sterownik serw PCA9685, 16 kanałów, I²C | 1 | Steruje wszystkimi serwami, Nano wysyła tylko komendy |
| Serwo SG90 9 g | 8 | 4 szt. od MicroChipCompany + 4 szt. od OMEGA_ZONE |
| Czujnik ruchu PIR HC-SR501 | 1 | Wystarczy do „ktoś podszedł → oczy się budzą”, nie do śledzenia kierunku |
| Piłeczki pingpongowe | ✓ | Małe oczy (Ø 40 mm) |
| Przegub 3 mm i 5 mm | ✓ | Do dużego oka – do doprecyzowania: przegub kulowy czy kardan, osobne sztuki czy jeden 3→5 mm |
| Drut sprężysty | ✓ | Awaryjnie na popychacze – preferujemy części drukowane |
| Warsztat Arduino / ESP32 | ✓ | Dużo modułów – przed zakupem czegokolwiek sprawdzić, czy już jest |
| Arduino Uno, Arduino Mega, ESP32, Raspberry Pi | ✓ | Zapas, gdyby Nano nie wystarczyło (pamięć) – PCA9685 przez I²C działa z każdym |
| Powerbank Baseus Airpow PPAP20K, 20 000 mAh, 3 porty | 1 | Główne zasilanie (propozycja) |
| Powerbank Manta MPB2001S Sunny, 20 000 mAh, 2 porty | 1 | Zapas na zmianę |
| Przepusty kablowe szczelne | ✓ | Do pudełka elektroniki – rozmiar do podania |
| Drukarki 3D: Bambu Lab **A1 mini** (stół 180 × 180 × 180) i **X1 Carbon** (256 × 256 × 256) | 2 | Duże części (pudełko-wieża) na X1C |
| Śruby M3 / M4 / M5, 8–50 mm, nakrętki | komplet | Można zakładać dowolną potrzebną śrubę i nakrętkę (M5 bez najkrótszych 6 mm) |
| Wkładki gwintowane do wtapiania | komplet (M2–M5, „chyba cały set”) | Do gwintów wielokrotnie skręcanych; wymiary otworu wg konkretnej wkładki – zmierzyć przed drukiem finalnym |

## Zamówione (w drodze)

| Część | Ilość | Uwagi |
|---|---|---|
| Serwo SG90 | 10 | Razem będzie 18 × SG90 |
| Serwo MG90S (metalowe przekładnie) | 4 | Do dużego oka – wytrzymają mruganie powieką |

## Brakuje

| Część | Do czego | Poziom |
|---|---|---|
| Kabel USB → zaciski (do V+ PCA9685) | Powerbank: port 1 → Nano, port 2 → serwa ([analiza](../20-analizy/2026-10-17-zasilanie-powerbank.md)) | 1 |
| Kondensator elektrolityczny 470–1000 µF / ≥10 V | Na zasilanie serw przy PCA9685 – tłumi spadki napięcia przy ruchu wielu serw | 1 |
| Przewody dupont (F-F, M-F), ewentualnie przedłużacze serw | Połączenia; serwa w dyni mogą być dalej od płytki | 1 |
| Coś na duże oko (np. większa piłka lub wydruk półkuli) | Duże oko | 2 |
| 2–3 dodatkowe PIR-y **albo** radar HLK-LD2450 | Kierunek ruchu przed dynią | 3 |

## Podział serw (propozycja)

Razem: **18 × SG90 + 4 × MG90S = 22 serwa.**

- **Duże oko – MG90S:** 2a = 2 serwa (lewo–prawo, powieka), 2b i 2c = 3 serwa (+ góra–dół; w 2c obie powieki z jednego serwa). Jedno MG90S zapasowe.
- **Małe oczy – SG90:** po 1 serwie na oko (ruch na boki), czyli do 18 małych oczu. Część SG90 może zostać jako zapas.
- **Kanały:** jeden PCA9685 ma 16 wyjść. Przy więcej niż 16 serwach potrzebny drugi PCA9685 – łączy się szeregowo na tej samej magistrali I²C, trzeba tylko zmienić adres zworką (A0). Sprawdzić, czy jest w warsztacie.
- **Zasilanie:** przy kilkunastu serwach zasilacz 5 V **min. 5–6 A** zamiast 3 A (SG90 ~0,2–0,3 A w ruchu, do ~0,7 A przy zablokowaniu). Oczy poruszane losowo rzadko ruszają się wszystkie naraz, ale zapas się przydaje.
