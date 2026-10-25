# dynia-v2 – analiza obecnego firmware'u i etapy

24.10. Wymagania: wyłącznie `30-projekt/PRD.md` §5–6. Stary `dynia/` zostaje jako odniesienie; `dynia-v2/` powstaje od zera, kod ze starego tylko tam, gdzie pasuje.

## Obecny `dynia/` (E7.2d, 23.10)

Ok. 2 700 linii C++ (`ruch.cpp` 866, `efekty.cpp` 973, `serwer.cpp` 515, `dynia.ino` 158, `dynia.h` 211) i strona 1 328 linii (93 KB). Flash 86 %. Na sprzęcie z oczami nie był uruchomiony w całości (README, „Do sprawdzenia na sprzęcie”).

| # | Funkcja | Co robi | PRD §5–6 | Złożoność (linie, ok.; szacunki nakładają się, nie sumować) |
|---|---|---|---|---|
| 1 | Start PCA9685 | `ALL_LED_OFF`, 50 Hz przez `Wire`, bez biblioteki | tak (warunek bezpiecznego startu) | mała (~40) |
| 2 | Start bez skoku | w NVS cel przy starcie ruchu i pozycja po końcu (nie zawsze ostatni wysłany impuls), rozruch kanał po kanale co 150 ms, potem płynnie na środek; zapis NVS z limitem 2 s / 0,5 s | nie wprost; w briefie etapu 1 | średnia (~120) |
| 3 | Silnik ruchu | napędy, kolejki 12 kroków, profil smoothstep + Hermite, limit prędkości 200°/s, ogranicznik 80 µs/krok, limit `MAX_W_RUCHU` | tak: płynny ruch, najwyżej 2 małe naraz | duża (~500) |
| 4 | Automat | spoczynek: jedno małe oko co ok. 5 s, powieki dużego oka 75 % otwarte (PRD: zamknięte); aktywny: sakady i fiksacje; duże oko fiksacje + mruganie; limit domyślnie 4 serwa naraz (PRD: najwyżej 2 małe) | tak (spoczynek / ktoś podchodzi) | średnia (~150) |
| 5 | Czujnik PIR | **brak** w `dynia/` (jest pin w `oczy-ruch`, nieużywany) | tak | mała (~20) |
| 6 | Duże oko | 4 serwa, kanały 12–15, powieka górna i dolna osobno | zgodne z PRD (decyzja 25.10): 4 × MG90S, powieka górna i dolna niezależnie; kanały do potwierdzenia | średnia (~150) |
| 7 | Mruganie | obie powieki razem i powrót każdej do jej położenia | tak | mała |
| 8 | Powieka podąża za spojrzeniem | **brak** (README: „nie zrobione”) | tak | mała (~20 + integracja z automatem) |
| 9 | Nastrój / emocje | 6 emocji: parametry automatu i rozwarcie powiek na 45 s | tak, tylko „przymykanie powiek zależnie od nastroju” | średnia (~80) |
| 10 | Kalibracja | NVS (`a/l/r`), kreator 5 kroków na stronie, „Nowe serwo”, migracja, walidacja | strona: „kalibracja (jest)”; kalibracja modułów robi teraz `kalibracja/` | duża (~350 z API i stroną) |
| 11 | Efekty | 21 efektów (fala, zez, mucha, Bu!, hipnoza…), azymuty oczu, antyspam | strona: „efekty”, bez listy | duża (~700) |
| 12 | Gry i sterowanie ręczne | pacynka (pad), pianino, troll, refleks, magik, wyrocznia | nie | duża (~300 + strona) |
| 13 | Wi-Fi i strona (Wi-Fi też jako obciążenie, wiersz 18) | punkt dostępu, captive portal, 26 ścieżek API, PIN rodzica, token, tryb wystawowy, heartbeat 20 s | strona w telefonie: tak | duża (~500 + 1 328 strona) |
| 14 | Park / wznów / restart z panelu | wszystkie na środek, zdjęcie impulsów | nie | mała |
| 15 | Dziennik NVS | czas pracy, starty, przyczyna restartu | nie (było do testu 24 h) | mała |
| 16 | FreeRTOS + mutex | ruch w osobnym zadaniu co 20 ms, żeby serwer HTTP go nie blokował | potrzebne dopiero ze stroną | średnia |
| 17 | Port szeregowy | `l z k c r a s e ?` | nie; do testów | mała |
| 18 | Podtrzymanie powerbanku | **jest:** punkt dostępu Wi-Fi włączony stale przed rozruchem serw (bez niego Baseus odcinał prąd co ok. 15 s, test 22.10) | tak (§5: tylko powerbank) | mała (~5) |

Wniosek: z PRD wynikają pozycje 1–9, 13 i 18. PRD wymaga strony z efektami i kalibracją, ale nie kreatora ani konkretnego zestawu efektów i gier; ich zakres ustala użytkownik. Pozycje 12, 14 i 15 PRD nie wymaga.

## Etapy `dynia-v2/`

Każdy etap kompiluje się, działa na stole i przechodzi review Astry i Opusa, zanim zacznie się następny. Poprawki po review planu: `20-analizy/review/2026-10-24-dynia-v2-plan-astra.md`, `-opus.md`.

**Etap 1 – minimum na szkołę** (dynia robi wszystko z PRD §6 poza ruchem „plastycznym” i stroną). **Odstępstwo od §6 do decyzji użytkownika:** bez etapu 2 dynia nie mruga, nie przymyka powiek i nie przeplata sakad spokojnym rozglądaniem; bez etapu 3 nie ma strony.
- **Zasilanie:** punkt dostępu Wi-Fi (ukryty, bez strony i serwera) włączony stale, przed rozruchem serw – obciążenie podtrzymujące powerbank, jak w `test-powerbank-wifi`. Tymczasowe rozstrzygnięcie zadania E0 (zasilanie, decyzja PM 24.10); ostatecznie potwierdzi je test powerbanku z tym programem.
- **Kalibracja:** środek, min, max i kierunek („Min to”) każdego kanału z `kalibracja-oczu.md` w pliku `kalibracja.h`. PCA9685 jak w `kalibracja/` i `dynia/ruch.cpp`: 27 MHz, prescale 131, to samo zaokrąglenie µs → ticki. **Granica impulsu każdego kanału = jego min i max** (granica absolutna 600–2400 µs jak w kalibratorze, nie 900–2100 ze starego `dynia.h`), więc pełny skalibrowany zakres zostaje. Warunek: tabela wypełniona i kanały dużego oka potwierdzone.
- **Rdzeń ruchu z `dynia/ruch.cpp`,** bez kolejek efektów i bez kalibracji (bez jej ograniczeń `constrain` 1000–2000 / 1200–1800 i bez domyślnych `POW_ZAMK/OTW_US` – zakres tylko z `kalibracja.h`): napęd z profilem Hermite'a (przy zerowych prędkościach to smoothstep z `oczy-ruch`), osobne zadanie FreeRTOS co 20 ms, ogranicznik kroku. Każda powieka (górna, dolna) osobno jako oś 0–100 % otwarcia, nie przełącznik. Dzięki temu etapy 2 i 3 tylko dokładają zachowania.
- **Start, jedna kolejność:** wszystkie kanały wyłączone (`ALL_LED_OFF`) → kanał po kanale impuls z NVS (tam serwo powinno stać) → wolny dojazd (4 µs/krok, pod limitem serw naraz): małe oczy i gałka na środek → dopiero potem obie powieki do „zamknięte”.
- **NVS pozycji:** nowa przestrzeń (bez danych starego `dynia/` i innego mapowania kanałów). Zapis jak w `ruch.cpp`: cel przy starcie ruchu i pozycja po jego końcu, najwyżej raz na 2 s na napęd i raz na 0,5 s w całej dyni; sprawdzany wynik zapisu. **Brak wpisu, błąd otwarcia albo odczytu, wartość spoza [min, max] kanału = start od środka z `kalibracja.h`** (świadomy skok jednego serwa naraz). **Znane ograniczenie:** zapis nie gwarantuje aktualnej pozycji; skok możliwy przy pierwszym starcie, po ręcznym przestawieniu oka i po zaniku prądu w trakcie ruchu.
- **Spoczynek:** duże oko zamknięte (gałka na środek, zanim powieki się zamkną), co ok. 5 s rusza się jedno małe oko.
- **Ktoś podchodzi (PIR HC-SR501, zworka H – ponowne wyzwalanie):** pin poza 2, 8, 9 (np. GPIO 3), pierwsze 60 s po starcie ignorowane; ruch = więcej oczu, najwyżej 2 małe naraz, duże oko się otwiera i rozgląda; po N s bez ruchu powrót do spoczynku (N = 30 s, założenie). Cel gałki w elipsie zakresów obu osi, żeby nie wchodzić w rogi.
- **Limit serw naraz:** 2 małe + duże oko (4 MG90S) = najwyżej 6.
- **Cisza na stojąco:** po dojściu do celu impuls kanału wyłączany (serwo trzyma tarciem); część serw z drugiej partii długo buczy przy środku (test 25.10, moduł „8”). Przed ruchem impuls wraca od zapamiętanej pozycji.
- Port szeregowy do testów: wymuszenie spoczynku / aktywnego, stan.
- **Test etapu 1:** komplet 12 serw, kondensator 470–1000 µF przy V+ PCA9685 (`polaczenia.md`); na Baseusie, nie z USB komputera, ≥ 30 min, w tym rozruch i trwały tryb aktywny (2 SG90 + 4 MG90S naraz); kryterium: brak odcięć i restartów. Manta ≥ 5 min tak samo. Zimny start i reset samego ESP bez szarpnięcia przy poprawnym wpisie NVS (skok dopuszczony tylko w znanych wyjątkach powyżej); PIR 10 min w pudełku bez ludzi (fałszywe wyzwolenia od Wi-Fi); 4 rogi dużego oka raz na stole.

**Etap 2 – ruch „plastyczny”:** płynna zmiana celu w biegu, sakady przeplatane wolnym rozglądaniem, mruganie (obie powieki razem i powrót każdej do jej położenia), powieka górna podąża za spojrzeniem góra–dół, przymykanie powiek zależnie od nastroju (górna i dolna osobno) (założenie: nastrój zmienia się losowo co kilka minut).

**Etap 3 – strona w telefonie:** serwer na istniejącym punkcie dostępu, strona z wybranymi efektami. Które efekty i czy kalibracja ma być też na stronie (PRD: „efekty i kalibracja (jest)”), decyduje użytkownik przed etapem 3. To odstępstwo od PRD do decyzji użytkownika: do czasu etapu 3 dynia działa bez strony.

## Propozycje poza PRD (do decyzji użytkownika)

- Dziennik NVS z `dynia.ino` (czas pracy, starty, przyczyna restartu, ~30 linii): po szkole pokaże, czy dynia gasła.

## Pytania do użytkownika

1. Zatwierdzasz etap 1 w tym zakresie?
2. (przed etapem 3) Które efekty na stronę i czy kalibracja na stronie zostaje.
