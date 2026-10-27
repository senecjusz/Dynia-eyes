# Raport – elektronika i software

Wykonawca: sesja „elektronika”, gałąź `elektronika/dynia-v2`. Zakres: PRD §5–6, brief PM z 25.10.

## Stan (27.10)

| Zadanie | Stan | Uwagi |
|---|---|---|
| S1 – plan `dynia-v2` | w toku | Kanały: duże oko 12–15 (12 lewo–prawo, 13 góra–dół, 14 powieka górna, 15 powieka dolna), małe 0–3 lewa, 4–7 prawa, 8–11 wolne. Użytkownik bez preferencji, przyjęte technicznie. Pytanie o zgodę na wersję bez strony w telefonie: użytkownik przerwał je, nie odpowiedział |
| S2 – program `dynia-v2/` | czeka na S1 | |
| M2 – kalibracja małych oczu | **zrobione** | Wszystkie 8 małych oczu skalibrowane (użytkownik 27.10): środek 1500, Min 1100 = prawo, Max 1800 = lewo. Przy 1500 oko patrzy prosto (potwierdzone na nowych modułach). Moduł „8” buczy, ostatni z 25.10 chodzi ciężko |
| P10 – pinout RJ45 | nie zaczęte | |
| PIR | nie zaczęte | PRD 0.2: PIR we froncie szufladki. Przewód musi wytrzymać wysuwanie szufladki (do uzgodnienia z montażem) |
| S3 – test powerbanku | czeka na S2 | |

## Testy na sprzęcie

- 27.10, kalibrator `kalibracja/` na kanale 0: trzy nowe moduły po kolei, każdy 1500 → 1100 → 1800 → 1500. Bez buczenia na krańcach, przy 1500 prosto (potwierdził użytkownik). Kierunek „Min = prawo” odczytany ze zdjęcia z kamery warsztatowej.

## Blokady i pytania do użytkownika

- Zgoda na program na środę bez strony w telefonie (odstępstwo od PRD §6).
- Czy breakout USB-C z 5,1 kΩ na CC jest w warsztacie.

## Commity

- `28b522a`, `aaab8c6`, `0aa3935` i ten commit – `50-elektronika/kalibracja-oczu.md`.
