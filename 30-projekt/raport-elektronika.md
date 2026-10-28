# Raport – elektronika i software

Wykonawca: sesja „elektronika”, gałąź `elektronika/dynia-v2`. Zakres: PRD §5–6, brief PM z 25.10, zakres etapu 1 od PM z 27.10.

## Stan (28.10)

| Zadanie | Stan | Uwagi |
|---|---|---|
| S1 – plan `dynia-v2` | zrobione | Zakres etapu 1 (PM 27.10, słowa użytkownika: „minimum to 8 oczu małych, ruch oczu, PIR i przycisk. Bez strony w telefonie”). Kanały: małe 0–3 lewa, 4–7 prawa; 8–10 rozdzielacz 5 V (kondensator, ESP, PIR), 11 wolny; duże oko 12 L–P, 13 G–D, 14 powieka górna, 15 powieka dolna |
| S2 – program `dynia-v2/` | kod gotowy, kompiluje się bez ostrzeżeń; **nie wgrany** | 8 małych oczu, PIR, przycisk blokady 5 s, AP Wi-Fi (podtrzymanie powerbanku). Gałka dużego oka włączona (28.10) ze sprzężeniem osi; powieki wyłączone do kalibracji |
| Sprzężenie osi gałki | w kodzie; **znak i wielkość do ustalenia na sprzęcie** | Poprawka G–D = SPRZ × (wychylenie L–P / zakres)², osobno dla strony min i max; w `kalibracja.h` 0. Procedura: `dynia-v2/README.md`, „Ustalenie sprzężenia” (komendy `g`, `z`). Sprzężenie G–D → L–P (+1,5°) pominięte – kinematyka dopuszcza |
| M2 – kalibracja małych oczu | zrobione (kalibrator) | 1500 / Min 1100 = prawo / Max 1800 = lewo; moduł „8” buczy, ostatni z 25.10 chodzi ciężko (program wyłącza impuls po ruchu) |
| Gałka dużego oka | zakresy z kalibratora (28.10) | G–D ±239, L–P ±284 µs wokół 1500 – sprawdzona krótsza strona, dłuższe niesprawdzone. Na stole L–P na kanale 11, G–D na 12 – przed testem programu przełożyć na 12 / 13 |
| P10 – okablowanie, skrętki | zrobione | `50-elektronika/polaczenia.md`, „Dynia: połączenia docelowe”: T568B, keystone'y w dyni |
| PIR | zrobione (podłączenie) | HW-416A na GPIO10, zasilanie z kanału 10; przewód w szufladce bez złącza, zapas 150 mm w pasie wtyku (z montażem 27.10) |
| Zasilanie | zrobione (projekt) | gniazdo USB-C wkręcane → zacisk PCA; 470 µF na kanale 8; ESP z kanału 9; rezystor 47 Ω / 3 W jako zapas. Plan tacki z przewodami pokazany użytkownikowi 28.10 |
| Przycisk blokady | zrobione w kodzie | wtyczka 3-pin użytkownika na ESP 5–6–7: GPIO5 = masa (LOW), GPIO7 = odczyt; 5 s |
| S3 – test powerbanku z programem | czeka | Baseus ≥ 30 min, w tym tryb aktywny |

## Wyniki

- Kompilacja `dynia-v2` (arduino-cli, esp32 3.3.12, `--warnings all`) 28.10: bez ostrzeżeń; 1 011 587 B flash (77 %), 37 736 B RAM (11 %).
- Wgranie i testy programu na sprzęcie: nie wykonane.

## Blokady i pytania do użytkownika

1. Podłączenie ESP do komputera – wgranie `dynia-v2` i test na stole.
2. Sprzężenie osi: znak i wielkość na sprzęcie (po przełożeniu wtyczek gałki na 12 / 13).
3. Kalibracja powiek (kanały 14–15).
4. Pomiar 5 V na przewodach gniazda USB-C z powerbanku.
