# Raport: elektronika i software

Stan na 27.10. Wykonawca: sesja elektroniki. Gałąź `elektronika/dynia-v2`.

| Zadanie | Stan | Uwagi |
|---|---|---|
| S1 – plan etapów, decyzje | zrobione | zakres etapu 1 zatwierdzony przez użytkownika (PM 27.10); kanały 12–15 przyjęte; odstępstwo: bez strony, efektów, nastrojów i mrugania |
| S2 etap 1 – `dynia-v2/` | w toku: kod gotowy, kompiluje się; czeka na test na stole | duże oko wyłączone do kalibracji kanałów 12–15 |
| M2 – kalibracja małych oczu | czeka na użytkownika | wspólne 1500/1100/1800 µs w `kalibracja-oczu.md`; pytanie o kanał 0 przy 1500 µs otwarte; moduł „8” buczy, ostatni chodzi ciężko (program wyłącza impuls po ruchu) |
| P10 – okablowanie, skrętki | zrobione | `50-elektronika/polaczenia.md`, sekcja „Dynia: połączenia docelowe”: T568B, keystone'y w dyni, kanały |
| PIR | zrobione (podłączenie) | HW-416A, GPIO10, zasilanie z kanału 10 PCA; zworka H, Tx minimum |
| Zasilanie | zrobione (projekt) | gniazdo USB-C wkręcane użytkownika (do potwierdzenia pomiarem 5 V); kondensator 470 µF na kanale 8; rezystor 47 Ω / 3 W jako zapas; tacka zaprojektowana przez montaż |
| Przycisk blokady | zrobione w kodzie | GPIO4, 5 s |
| S3 – test podtrzymania powerbanku z programem | czeka na użytkownika | po złożeniu: Baseus ≥ 30 min, w tym tryb aktywny |

## Wyniki

- Kompilacja `dynia-v2` (arduino-cli, esp32 3.3.12, `--warnings all`): bez ostrzeżeń; 984 593 B flash (75 %), 37 704 B RAM (11 %).
- Wgranie i testy na sprzęcie: nie wykonane (płytka nie była podłączona do komputera).

## Blokady i pytania do użytkownika

1. Kalibracja dużego oka (kanały 12–15) – bez niej duże oko nie rusza.
2. Pomiar 5 V na przewodach gniazda USB-C z powerbanku.
3. Kanał 0 przy 1500 µs – czy oko patrzy prosto.
