# Review planu `dynia-v2`, runda 3 (Opus, 24.10)

Wszystkie uwagi z rundy 2 (Astra i Opus) zamknięte: odstępstwo od §6 nazwane (bez etapu 2 brak mrugania i przymykania, bez etapu 3 brak strony – do decyzji użytkownika); jedna kolejność startu (`ALL_LED_OFF` → impuls z NVS → wolny dojazd 4 µs/krok, `dynia.h:40` → gałka na środek → powieka); NVS: wiersz 2 zgodny z `ruch.cpp:171` i `:492–505`, limity 2 s / 0,5 s z `dynia.h:44–45`, reguła na brak/błąd/wartość spoza [min, max] = start od środka, nowa przestrzeń, znane ograniczenie zapisane; granice µs = min/max kanału, absolutna 600–2400, stare 900–2100 odrzucone jawnie; test zasilania: 11 serw, kondensator, Baseus ≥ 30 min z rozruchem i 2 SG90 + 3 MG90S, kryterium bez odcięć i restartów, Manta ≥ 5 min; PIR ze zworką H; nastrój w etapie 2 jako założenie.

Otwarte: nic KRYTYCZNEGO ani WAŻNEGO.
- DROBNE: etap 1 „bez kalibracji” powinien jawnie wykluczać przeniesienie `constrain` z `ruch.cpp:588–589` (1000–2000 i 1200–1800) i domyślnych `POW_ZAMK/OTW_US`; jedno zdanie przy „Rdzeń ruchu”.
- Informacyjnie: `kalibracja-oczu.md` pusta, kanały 12–14 do potwierdzenia – plan stawia to jako warunek.

Propozycje poza PRD: bez nowych.

**Werdykt:** plan etapu 1 można dać użytkownikowi do zatwierdzenia.
