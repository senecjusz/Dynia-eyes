# Podstawka – koncepcja v2: wnioski z review (runda 1)

Raporty: `2026-10-25-podstawka-koncepcja-opus.md`, `2026-10-25-podstawka-koncepcja-astra.md`. Klasyfikacja wg zasady PM z 25.10: „psuje działanie wg PRD” → poprawiam; „przypadek brzegowy” → nie rozwiązuję (najwyżej test, który i tak jest w planie).

## Psuje działanie – poprawione w koncepcji v3

| Uwaga | Kto | Poprawka |
|---|---|---|
| Wtyki za łącznikami RJ45 nachodzą na PCA9685 | Opus 1, Astra 2 | PCA9685 przesunięta do tyłu (y 190–252), za łącznikami 35 mm na wtyki i gięcie |
| Wkręt dynia → płyta bez podkładki i szczeliny pod zaokrąglonym dnem | Opus 4, Astra 3–4 | długość = grubość miąższu w miejscu wkrętu + szczelina + 4 + 15; miejsca wkrętów wyznacza się po postawieniu dyni, Ø140 tylko orientacyjnie |
| Kołnierz uchwytu PIR zachodzi na sklejkę 5 mm, uchwyt bez luzu w przerwie | Opus 5, Astra 5 | kołnierz 70 szerokości, korpus 39,4 (luz 0,3 na stronę) |
| Zapas skrętek 20 cm za mały do wpinania wtyku przy wysuniętej szufladzie | Opus 2 | zapas 30 cm (także przewód PIR) |
| Zapasowy powerbank Manta nieuwzględniony | Astra 1 | szerokość komory jako zmienna; wymiary Manty do podania przez użytkownika |
| Łącznik gniazdo–gniazdo może krzyżować styki | Astra 8 | sprawdzić miernikiem każdy łącznik i każdą wiązkę przed podłączeniem serw |

## Uproszczenia przyjęte (obaj recenzenci)

- Skrętka po stronie dyni **lutowana wprost do rozdzielacza** (bez łącznika i krótkiego odcinka): mniej o 3 łączniki, 3 odcinki, 6 wtyków, 2 styki na żyle mniej (mniejszy spadek napięcia – Opus 3).
- **Tuleja z kołnierzem usunięta:** zysk wątpliwy (Opus 10, Astra 11). Sok z otworu kapie na dno podstawki przed szufladą, nie na łączniki (otwór kończy się na y 115, łączniki od y 118).
- Wariant M2 mocowania usunięty z koncepcji.

## Brzegowe – bez rozwiązań

- Pełny tor zasilania (styki, USB-C, 11 serw > 3 A) – sprawdza istniejący test 11 serw na Baseusie (`dynia-v2-plan.md`); dopisano tylko pomiar napięcia na rozdzielaczu dużego oka (Opus 3, Astra 6–7).
- Kąty osłonki PIR przybliżone, zakłócenia Wi-Fi (Opus, Astra 9) – test PIR w planie.
- Końcówki Dupont na drucie skrętki, mocowanie łączników w szufladzie, gniazdo USB-C w warsztacie – szczegóły kroku 2.
- Niespójności rysunku SVG (listwa, okręgi, wysokość PIR) – schemat SVG zastąpiony renderami z Blendera.

# Runda 2 (koncepcja v5) – wnioski

Raporty: `2026-10-25-podstawka-koncepcja-opus-r2.md`, `2026-10-25-podstawka-koncepcja-astra-r2.md`. Ostatnia runda (zasada PM: najwyżej 2).

## Psuje działanie – poprawione w v5.1

| Uwaga | Kto | Poprawka |
|---|---|---|
| Wysokość tulei z grubości korka `t`, a nie z wysokości dna wnętrza nad płytą (wklęsłe dno → za mało gwintu) | Opus 4, Astra 1 | tuleja = `h` + 10, `h` mierzone przy postawionej dyni |
| Kaseta: tylna ścianka bez zakładki na ścianki boczne, wkręty nie trafią | Astra 2 | uszy tylnej ścianki (228 szer.) na tylnych czołach ścianek bocznych |
| Skrętka nie ma miejsca na gięcie przed łącznikami | Opus 1 | łączniki 40 mm za osią tulei (porty y 178), łuk R 20 w 27 mm pod płytą; podstawka głębsza: 240 |
| Wpinanie skrętek przy stojącej dyni niemożliwe | Opus 2 | kolejność: kaseta wysunięta o 120 mm, wpiąć, wsunąć, zapas 15 cm odciągnąć do dyni |
| Wtyk USB-C z gięciem kabla dłuższy niż 30 | Opus 3 (Astra: brzegowe) | długość szufladki i szerokość podstawki jako zmienne z pomiaru kabla użytkownika |
| PIR: potencjometry od strony przegródki, kieszeń 12 mm | Opus 5 (Astra: brzegowe) | przegródka 25 mm, przewód wlutowany; szufladka 100 głęboka |

## Brzegowe – bez rozwiązań

Docisk miąższu nakrętką (próba na dyni), stała długość przewodów ruchomych w modelu, luz nad kasetą 0,3–0,5 (przyjęty), fazka uchwytu szufladki, kąty PIR – szczegóły kroku 2.
