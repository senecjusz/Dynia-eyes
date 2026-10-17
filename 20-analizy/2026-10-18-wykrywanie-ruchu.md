# Wykrywanie ruchu

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
