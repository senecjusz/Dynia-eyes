# Zasilanie – czy powerbank wystarczy?

Pomysł: zasilanie z powerbanku, bez kabla do gniazdka. **Krótko: tak, ale trzeba obejść trzy pułapki.**

## Ile prądu potrzeba

| Odbiornik | Prąd |
|---|---|
| Arduino Nano + PCA9685 | ~30–50 mA |
| SG90 w spoczynku | ~5–10 mA / szt. |
| SG90 w ruchu (bez oporu) | ~100–250 mA / szt. |
| SG90 zablokowane (oparte o ramę) | do ~700 mA / szt. |
| MG90S w ruchu | ~150–300 mA / szt. |

Przy ~10–16 oczach ruszanych losowo, kiedy naraz rusza się tylko kilka:
- **średnio ~0,3–0,8 A**,
- **chwilowo do 2–3 A**, jeśli program pozwoli wielu serwom ruszyć jednocześnie.

## Ile wytrzyma powerbank

10 000 mAh to ~37 Wh, czyli **~6,3 Ah przy 5 V** po stratach przetwornicy (~85%).

| Średni pobór | Czas pracy (10 000 mAh) |
|---|---|
| 0,3 A | ~21 h |
| 0,5 A | ~13 h |
| 0,8 A | ~8 h |

Przy 20 000 mAh czas się podwaja. Na wieczór pod drzwiami (np. 17:00–22:00) w zupełności wystarczy, ładowanie co 1–2 dni. **Oszczędzanie:** PIR wybudza oczy, gdy ktoś podchodzi, a w pozostałym czasie serwa stoją i pobór spada do ~0,1–0,2 A.

## Trzy pułapki

### 1. Powerbank sam się wyłącza
Większość powerbanków wyłącza wyjście, gdy pobór spada poniżej ~50–100 mA przez kilkadziesiąt sekund. Kiedy oczy stoją, a Nano działa, dokładnie tak się stanie.

Rozwiązania, od najlepszego:
- powerbank z trybem **„low current” / „always on”** (często włączany dwuklikiem przycisku; wiele modeli Xiaomi, Anker, Baseus go ma),
- **impuls podtrzymujący** w programie: co ~10 s krótki ruch serwa albo chwilowe obciążenie (rezystor + tranzystor),
- sprawdzić empirycznie, ile mA trzeba, żeby dany powerbank nie gasł.

### 2. Reset Arduino przy starcie serw
Kiedy kilka serw rusza naraz, napięcie chwilowo spada i Nano może się zresetować.
- **Osobne zasilanie logiki i serw:** powerbank z **2 portami**, port 1 → Nano (USB), port 2 → zacisk V+ na PCA9685. **Wspólna masa** zostaje przez PCA9685.
- **Kondensator 470–1000 µF** przy PCA9685.
- W programie: **serwa nie ruszają wszystkie naraz** (rozłożenie w czasie). To zmniejsza też szczyty prądu.

### 3. Prąd z jednego portu
Typowy port USB-A daje 2,1–3 A przy 5 V, co jest OK dla serw, jeśli program pilnuje, żeby nie ruszały się wszystkie naraz. Porty USB-C PD bez negocjacji dają 5 V / do 3 A. Do V+ PCA9685 potrzebny jest **kabel USB → zaciski** (przecięty kabel albo moduł USB breakout). Przewody serwowe 5 V min. **0,5 mm²** (AWG 20).

## Praktyczne
- **Wilgoć:** w prawdziwej dyni jest mokro. Powerbank i elektronikę trzymać w woreczku strunowym albo puszce, ewentualnie za dynią z kablem przez otwór.
- **Dwa powerbanki na zmianę:** jeden pracuje, drugi się ładuje.
- **Alternatywa awaryjna:** ładowarka sieciowa 5 V / 3 A z długim kablem, jeśli przy dyni jest gniazdko.

## Do sprawdzenia
1. Jakie powerbanki są w domu (pojemność, liczba portów, tryb low current)?
2. Test: Nano + PCA9685 + kilka serw w spoczynku. Czy powerbank gaśnie?

## Powerbanki w domu (2026-10-17)

| | **Baseus Airpow 20W (PPAP20K)** | **Manta MPB2001S Sunny** |
|---|---|---|
| Pojemność | 20 000 mAh / 74 Wh | 20 000 mAh |
| Wyjścia | 3 (USB-A, USB-C, …), 5 V / 3 A | 2, do 3 A |
| Szybkie ładowanie | PD / QC (9–12 V tylko po negocjacji) | PD / QC |
| Wymiary | 153,5 × 69 × 29,6 mm, 446 g | do zmierzenia (solarny, raczej większy) |
| Dodatki | — | panel słoneczny, ładowanie indukcyjne (w dyni bez znaczenia) |

- **Czas pracy:** 20 000 mAh to ~12,5 Ah przy 5 V, czyli **~16–40 h**, zależnie od ruchu. Ładowanie co 2–4 wieczory.
- **Napięcie:** Nano i przecięty kabel do PCA9685 niczego nie negocjują, więc porty dają **5 V**. Nie podłączać serw przez „inteligentne” kable ani triggery PD.
- **Propozycja:** **Baseus jako główny** (3 porty, mniejszy, znane wymiary), **Manta jako zapas** na zmianę.
- **Tryb niskiego poboru:** dla żadnego nie jest potwierdzony. Do sprawdzenia testem: Nano + PCA9685 + serwa w spoczynku przez 5 min. Jeśli powerbank zgaśnie, w programie dodajemy impuls podtrzymujący.
