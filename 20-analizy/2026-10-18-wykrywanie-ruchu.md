# Wykrywanie ruchu

> **USTALENIE UŻYTKOWNIKA (2026-10-18), ważniejsze niż wszystko poniżej:**
> - **Małe oczy zawsze ruszają się chaotycznie** i nie reagują na nic, więc nie potrzebują czujnika.
> - **Na ruch reaguje tylko duże oko:** gdy nikogo nie ma, oko jest **zamknięte** (powieka), a gdy ktoś jest, oko się **otwiera**. Ewentualnie, w kolejnym kroku, patrzy w jego stronę.
> - Do otwierania i zamykania wystarczy **zwykły czujnik obecności**, np. PIR HC-SR501, który już jest. Kierunek (radar, kilka czujników) to dopiero poziom 3.
> - **Śledzenie przez duże oko (poziom 3), bo ma już serwa lewo–prawo i góra–dół:** jeden radar **HLK-LD2450** robi wszystko naraz. Brak celu oznacza zamknięte oko, cel oznacza otwarte oko, które patrzy w jego stronę. Kąt poziomy = atan2(X, Y) wprost z odczytu radaru. Góry i dołu radar nie mierzy, więc stosujemy prostą regułę: im ktoś bliżej, tym oko patrzy niżej (dzieci są niskie i podchodzą blisko). Radar wymaga **ESP32** zamiast Nano (powód: port szeregowy, nie obliczenia). ESP32 steruje wtedy całą dynią przez ten sam PCA9685.
> - Poniższe warianty (gapienie się małych oczu, 3 PIR-y, LD2450 dla małych oczu) są **nieaktualne** jako plan, zostają tylko jako notatki.

Dwa różne zadania:
- **budzik** (rozszerzenie 2.1): „ktoś podszedł”, więc oczy ożywają,
- **kierunek** (poziom 3): „ktoś jest z lewej”, więc oczy patrzą w lewo.

## 1. Budzik – PIR HC-SR501 (już jest)

| Ustawienie / fakt | Wartość |
|---|---|
| Zasilanie | 5 V z Nano (działa od 4,5 V), wyjście 3,3 V – Nano odczyta je jako HIGH |
| Zasięg / kąt | ~3–7 m (potencjometr Sx), stożek ~110° |
| Czas podtrzymania | potencjometr Tx na minimum (~3 s), dłuższe „ożywienie” robi program |
| Zworka | **H** (retrigger): sygnał trwa, dopóki ktoś się rusza |
| Rozgrzewanie | **30–60 s** po włączeniu zasilania fałszywe wyzwolenia, program je ignoruje |

**Montaż – najważniejsza pułapka:** PIR **nie widzi przez miąższ dyni** ani przez zwykły plastik, tylko przez swoją soczewkę. Kopułka (~23 mm) musi wystawać przez otwór w dyni. Pomysły: jako **nos**, w **ustach** albo w jednym z „oczodołów” bez oka. Mocowanie w drukowanej tulejce, tak jak moduł oka, tylko mniejsze.

**Zachowanie w programie (propozycja):**
- spokój: oczy stoją albo bardzo powoli dryfują, a serwa są prawie bez prądu, co oszczędza powerbank (uwaga na auto-wyłączanie, patrz [zasilanie](2026-10-17-zasilanie-powerbank.md)),
- wykrycie: 20–30 s szybkiego, nerwowego rozglądania się,
- potem powolne uspokojenie i powrót do spoczynku.

## 2. Kierunek – opcje

**Ważne odkrycie:** małe oczy ruszają się tylko lewo–prawo, więc do „patrzenia na gościa” wystarczy **kierunek poziomy**. Efekt poziomu 3 można więc mieć **już na małych oczach**, bez dużego oka.

| Opcja | Co daje | Koszt / trudność | Uwagi |
|---|---|---|---|
| **3 × PIR w sektorach** (lewo / środek / prawo) | kierunek zgrubny, 3 pozycje | **mały**: 2 dodatkowe HC-SR501, drukowane osłony zawężające pole widzenia | najprostsze, pasuje do Nano. Sektory nakładają się, więc 5 stanów (L, L+Ś, Ś, Ś+P, P) |
| **2–3 × HC-SR04** (ultradźwięki) | odległość w kilku kierunkach | mały | nie widzą przez dynię, „oczy” czujnika muszą wystawać. Szerokie wiązki, przy ruchu bywają kapryśne |
| **Radar HLK-LD2450** | pozycja X/Y do 3 osób, płynnie | średni | **UART 256 000 bodów, a Nano ma jeden UART zajęty przez USB**, więc w praktyce **Mega albo ESP32** (oba są w warsztacie). Przez wilgotny miąższ słabo, potrzebne okienko z cienkiego plastiku |
| Kamera (ESP32-CAM / RPi) | najwięcej możliwości | duży | nie na ten termin |

## Rekomendacja

1. **Minimum + 2.1:** jeden HC-SR501 jako budzik, wystający jako nos albo w ustach.
2. **Tani kierunek:** dołożyć 2 PIR-y w sektorach. Małe oczy patrzą w stronę gościa, kod jest prosty, Nano wystarczy.
3. **Płynne śledzenie** (z dużym okiem, przyszły rok): LD2450 + Mega/ESP32.

## Do ustalenia
1. Jakie czujniki są w warsztacie: więcej HC-SR501, HC-SR04, LD2450, inne radary?
2. Gdzie w dyni może być „nos” albo usta na czujnik?

## Radar: LD2420 czy LD2450? (2026-10-18)

Użytkownik słusznie zauważył, że jeden radar to mniej montażu niż 3 PIR-y. **Pułapka:** pokazany **HLK-LD2420 nie podaje kierunku.**

| | **HLK-LD2420** (pokazany) | **HLK-LD2450** |
|---|---|---|
| Co mierzy | obecność + **odległość** jednej osoby | **pozycja X/Y** (kąt ±60° + odległość) do **3 osób** |
| Kierunek lewo/prawo | **nie** | **tak** |
| Widzi stojącego człowieka | tak (oddech, mikroruchy), lepiej niż PIR | tak |
| Zasilanie | **3,3 V** (pin 3V3) | 5 V |
| Wyjścia | OT2 = cyfrowe „ktoś jest” (3,3 V), OT1/RX = UART | UART 256 000 bodów (3,3 V) |
| Z Nano | **tak, przez OT2** jako budzik (jak PIR, bez UART) | praktycznie **nie**: jedyny UART Nano jest zajęty przez USB → **Mega** (4 UART-y) albo **ESP32** |
| Rola w projekcie | **lepszy budzik** niż PIR | **kierunek** (2.2b i poziom 3) |

**Montaż radaru:** fale 24 GHz przechodzą przez cienki plastik, ale mokry miąższ dyni mocno je tłumi. Radar można więc schować za drukowaną, cienką (~1–2 mm) zaślepką w otworze dyni („nos”, usta) i nie widać elektroniki, w przeciwieństwie do kopułki PIR. Przez samą ściankę dyni prawdopodobnie nie zadziała, więc trzeba to sprawdzić testem.

**Rekomendacja:**
- jeśli **kierunek** (oczy patrzą na gościa) ma być w tym roku, to **LD2450 + ESP32** (patrz niżej, dlaczego nie Mega) zamiast Nano. PCA9685 i okablowanie serw zostają bez zmian,
- jeśli tylko **budzik**, wystarczy HC-SR501, który już jest. LD2420 to opcjonalny lepszy budzik, który wykryje też stojącego gościa,
- 3 × PIR odpada, jeśli bierzemy LD2450: jeden czujnik i jedno okienko w dyni.

### Dlaczego nie Nano i czemu raczej ESP32 niż Mega (korekta 2026-10-18)

- **Nano:** LD2450 wysyła dane po UART z prędkością **256 000 bodów**. Nano ma **jeden** sprzętowy UART (piny 0/1), a ten jest na stałe połączony z układem USB (CH340), który działa zawsze, gdy Nano jest zasilane z USB, także z powerbanku. Dwa nadajniki na jednej linii dają przekłamane dane. Programowy UART (SoftwareSerial) na 16 MHz nie odbierze niezawodnie 256 000 bodów. Da się obniżyć prędkość radaru komendą konfiguracyjną i użyć AltSoftSerial, ale to kruche rozwiązanie.
- **Mega:** ma 4 sprzętowe UART-y, więc problem znika, ale logika 5 V. Wyjście radaru 3,3 V jest na granicy progu wejścia (5 V × 0,6 = 3,0 V), czyli zwykle zadziała, choć bez zapasu.
- **ESP32 (zalecany do radaru):** natywnie **3,3 V** jak radar, **3 sprzętowe UART-y**, które obsługują 256 000 bodów bez problemu, i dużo pamięci. PCA9685 działa z logiką 3,3 V (VCC 3,3 V, a serwa nadal z V+ 5 V). PIR też podaje 3,3 V. Bonus: ESP32 pobiera ~80–150 mA, więc powerbank rzadziej się wyłącza.

**Wniosek:** minimum na Nano. Jeśli dokładamy radar LD2450, przechodzimy na **ESP32** (jest w warsztacie). Okablowanie serw i PCA9685 zostaje bez zmian, a program przenosimy z drobnymi zmianami (biblioteka PCA9685 działa na obu).

## Najprostsze rozwiązanie: „podejdziesz na 50 cm, oczy się na ciebie gapią” (2026-10-18)

Pytanie użytkownika: czy nie wystarczy odczyt odległości i reakcja, gdy ktoś jest blisko? **Wystarczy, i to jest najprostsza wersja.**

- **Obliczenia nie są problemem.** Nano spokojnie policzy wszystko, czego tu trzeba. Przy LD2450 jedynym problemem był **sposób komunikacji** (szybki port szeregowy), a nie moc procesora.
- **Sama odległość nie mówi, gdzie ktoś stoi** (lewo / prawo). Ale jeśli ktoś jest **50 cm przed dynią**, to patrzenie **na wprost** jest prawie patrzeniem na niego. Kierunek nie jest więc potrzebny.

**Zachowanie:**
- nikt nie jest bliżej niż ~50 cm: oczy rozglądają się losowo,
- ktoś podszedł bliżej niż 50 cm: **wszystkie oczy jednocześnie zwracają się na wprost** i „gapią się”, dopóki stoi blisko,
- odszedł: po 2–3 s oczy wracają do rozglądania.

**Bonus w szkole:** próg 50 cm sam filtruje tłum. Reaguje tylko ten, kto podejdzie do dyni, a reszta sali się nie liczy.

**Czujnik do tego (wszystkie działają z Nano):**

| Czujnik | Jak działa z Nano | Montaż |
|---|---|---|
| **HC-SR04** (ultradźwięki) | 2 piny cyfrowe, kilka linijek kodu, zasięg 2 cm – 4 m, wąski stożek ~15–30° (dobrze: tylko „na wprost”) | dwa „głośniczki” Ø 16 mm muszą wystawać, np. jako **nozdrza dyni** |
| VL53L1X (laser ToF) | I²C, ta sama magistrala co PCA9685, zasięg do ~4 m | małe okienko, bardzo dyskretny |
| LD2420 (radar) | wyjście OT2 „ktoś jest w zasięgu”, zasięg ustawiany raz z komputera | za cienką plastikową zaślepką, niewidoczny |

**Rekomendacja:** **HC-SR04 jako „nozdrza”**. Jest najtańszy, najprostszy w kodzie, sprawdzony z Arduino i pewnie leży w warsztacie. Ten sam czujnik działa jako budzik (zamiast PIR) i jako „gapienie się”.

**Rozszerzenie bez wymiany kontrolera:** 2 × HC-SR04 skierowane lekko w lewo i w prawo. Który widzi bliżej, w tę stronę patrzą oczy. To jedno porównanie dwóch liczb.
