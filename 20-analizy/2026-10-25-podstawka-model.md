# Podstawka pod dynię – model v1 (krok 2)

25.10.2026, projektant podstawki. Koncepcja: [`2026-10-25-podstawka-koncepcja.md`](2026-10-25-podstawka-koncepcja.md) (v5.1, łączniki RJ45 w dyni, wtyk USB-C 50 mm – decyzja użytkownika).

**Zmiany względem koncepcji v5.1** (techniczne, bez zmiany funkcji):
- **Ścianka tylna ze sklejki** zamiast tylnej ścianki kasety. Kasetę wkłada się i wyjmuje przez otwór szufladki, z przodu, bo z tyłu stoją inne dynie. Kaseta mieści się na A1 mini (170 mm).
- **Głębokość podstawki** 222,8 zamiast 240, bo łączniki RJ45 przeszły do dyni.

## Pliki

| Plik | Co |
|---|---|
| `40-cad/openscad/podstawka.scad` | model parametryczny (zmienne bazowe → pochodne), części drukowane, sklejka, złożenie, rysunek cięcia |
| `40-cad/openscad/podstawka-eksport.sh` | eksport 3MF, kontrola siatek, liczba brył, wymiary wobec parametrów |
| `40-cad/openscad/podstawka-zginanie.sh` | test zginania (warianty zmiennych bazowych) |
| `40-cad/narzedzia/podstawka-wymiary.js` | wymiary siatek 3MF wobec oczekiwanych z `parametry.json` |
| `40-cad/3mf/Podstawka v1/` | pliki do druku (3MF, jeden na część) i `parametry.json` |
| `40-cad/openscad/podglad/podstawka-ciecie.png` / `.svg` | **rysunek cięcia sklejki** |
| `40-cad/openscad/podglad/podstawka-*.png` | podglądy części i złożenia |

## Wymiary wynikowe (wartości bazowe)

Podstawka **254,8 × 222,8 × 66** (bez dna); wnętrze 48 (szufladka leży dnem na 2 listwach nośnych 8 mm nad stołem).

**Szufladka** 215,8 × 101,8 korpus + czoło 234,8 × 39 × 3, uchwyt klin 45°.

**Kaseta** 170 × 100 × 25.

**Tuleja:**
- wysokość `hDoc` + kołnierz 3 + 10 = 58 (dynia leży na kołnierzu, `hDoc` mierzone przed założeniem tulei);
- gwint Ø76, prawy, 45°, skok 5, zarys 2;
- otwór Ø64, kołnierz Ø120 × 3.

**Nakrętka** sześciokąt Ø130 × 8 (luz gwintu 0,20).

## Cięcie sklejki 18 mm (rysunek `podstawka-ciecie.png`)

| Element | Wymiar | Szt. |
|---|---|---|
| Płyta górna | 254,8 × 222,8, otwór Ø64 w środku (nastawna otwornica 64) | 1 |
| Ścianka boczna | 222,8 × 48, **3 otwory Ø3,5** 4 mm nad dolną krawędzią, 15 / 50,9 / 86,8 od przodu, pogłębione od zewnątrz (wkręty listew nośnych) | 2 (lewa i prawa – lustrzane) |
| Ścianka tylna | 218,8 × 48 (między bocznymi) | 1 |

Montaż skrzynki:

1. Ścianki boczne i tylną skręcić wkrętami 3,5 × 40, po 2 na narożnik.
2. Płytę górną przykręcić od góry wkrętami 3,5 × 40 w krawędzie ścianek, 6 szt.
3. Z przodu nie ma ścianki: tam wchodzi szufladka.

## Druk

| Część | Plik 3MF | Wymiar na stole | Drukarka | Uwagi |
|---|---|---|---|---|
| **Szufladka – DRUKOWAĆ TĘ WERSJĘ** | `Szuflada (X1C)` | 244,8 × 112,8 × 39 | **X1C, w całości** (decyzja użytkownika 25.10) | dnem na stół; uchwyt klinem 45° bez podpór; otwór kopułki Ø24 w pionowym czole; w prawym kołnierzu czoła otwór Ø4,5 na M4 blokady |
| zapas: 2 połówki | `Szuflada lewa (A1 mini)` + `Szuflada prawa (A1 mini)` | 178,9 / 65,9 × 112,8 × 39 | A1 mini | **tylko jako zapas**, gdyby X1C nie był dostępny; żebra z 2 otworami M3: skręcić M3 × 10 z nakrętką |
| Listwy nośne × 2 | `Listwy nosne x2` | 101,8 × 26 × 7,5 (dwie na stole) | A1 mini | stroną przy ściance na stole, otwory pilotowe Ø2,5 pionowo; przykręcane od zewnątrz przez ściankę 3 wkrętami 3 × 25 każda |
| Kaseta elektroniki | `Kaseta elektroniki` | 170 × 100 × 25 | A1 mini | słupki PCA9685 z otworem Ø2,6 (wkręt M3 w plastik – montaż jednorazowy), ramka ESP32-C3 z wyjściem USB-C do przodu (programowanie po wyjęciu szufladki), ramka gniazda zasilania USB-C (breakout ok. 20 × 15, szacunek) dokładnie za wycięciem kablowym szufladki, wejściem do przodu, 50 mm za szufladką (kaseta dosunięta do prawej ścianki), pierścień kondensatora, 2 otwory pod wkręty 3 × 16 do ścianki tylnej |
| Tuleja z gwintem | `Tuleja z gwintem` | Ø120 × 58 | A1 mini | kołnierzem na stół; **drukować po zmierzeniu `hDoc`** (tuleja = `hDoc` + 13) |
| Nakrętka | `Nakretka` | 130 × 112,6 × 8 | A1 mini | płasko; fazki wejścia z obu stron |
| Próbka gwintu | `Probka gwintu - tuleja` + `- nakretka` | Ø90 × 15 / Ø90 × 8 | A1 mini | najpierw próbka (AGENTS.md: nowe pasowanie); ten sam profil co E2.0, większa średnica |
| Osłonka PIR (opcja) | `Oslonka PIR (opcja)` | Ø30 × 20 | A1 mini | na stojąco; przykleić CA do czoła wokół kopułki (dół rurki 7 mm nad stołem) |

## Montaż elektroniki i dyni

1. **Kaseta:** PCA9685 na słupkach (4 × M3), ESP32-C3 w ramce, kondensator w pierścieniu. 3 skrętki żyłami (Dupont) na listwach PCA9685, wtykami RJ45 do góry.
2. **Wsunięcie kasety (przed przykręceniem listew nośnych):** kasetę wsunąć przez otwór szufladki do ścianki tylnej i przykręcić 2 wkrętami 3 × 16 do ścianki tylnej (wkrętak przez otwór szufladki). Kasetę wyjmuje się tak samo, gdy szufladka jest wysunięta – najpierw przesunąć ją ok. 7 mm w lewo, bo prawy brzeg zachodzi nad prawą listwę nośną.
3. **PIR:** płytkę wsunąć od góry w prowadnice za czołem szufladki (kopułka z kwadratową podstawą zjeżdża wycięciem w czole, otwartym od dna do góry; płytka stoi na dnie), przewód wlutowany, ok. 15 cm zapasu do ESP32-C3 przez wycięcie w tylnej ściance szufladki.
4. **Listwy nośne i szufladka:** każdą listwę przyłożyć od środka do dolnej krawędzi ścianki bocznej (równo z przodem) i przykręcić od zewnątrz 3 wkrętami 3 × 25 przez otwory w sklejce. Szufladkę wsunąć od przodu: leży dnem na listwach (po 6 mm z każdej strony), z boków prowadzą ją ścianki (luz 1,5), czoło opiera się o ścianki. Bez kleju; w środku nie ma łbów. Wariant A1 mini: połówki skręcić najpierw 2 × M3 × 10.
5. **Powerbank i USB-C:** powerbank włożyć do szufladki portem w prawo, wpiąć USB-C, kabel przez to samo wycięcie do wejścia zasilania w kasecie.
6. **Dynia:**
   - wyciąć otwór Ø80 w środku dna dyni;
   - postawić dynię na płycie, zmierzyć `hDoc`;
   - wydrukować tuleję i przykręcić ją do płyty 3 wkrętami 3 × 16 przez kołnierz;
   - opuścić dynię na tuleję (skrętki wcześniej przez otwór);
   - zakręcić nakrętkę od środka dyni;
   - w dyni wpiąć skrętki w łączniki RJ45 z przewodami od rozdzielaczy.

## Kontrola (dowody)

| Kontrola | Wynik |
|---|---|
| Siatki (`sprawdz_siatki.js`): otwarte, nierozmaitościowe, zdegenerowane | 0 / 0 / 0 dla każdej z 9 części (po dodaniu zakładki brył `zak` 0,01 i odstępu podziału `szczSeam` 1; tuleja i nakrętki po `napraw_siatki.js` – CGAL zostawiał 1–5 zdegenerowanych trójkątów na gwincie). Gwint: zwój jako helisa profilu zęba (krok 3°), flanki dokładnie 45°, rowek nakrętki odsunięty o 0,20 prostopadle do flank (jak E2.0) |
| Liczba brył (`skladowe_siatki.js`) | 1 na część |
| Wymiary wobec parametrów (`podstawka-wymiary.js`) | OK |
| Gwint: część wspólna tulei i nakrętki nakręconej na gwint (CGAL `intersection`, z 4,5 mm / obrót 324°) | pusta |
| Test zginania (`podstawka-zginanie.sh`): wtyk 30 / 50 / 60, pbW 75, pbL 150, kieszenPIR 30, hDoc 30 / 60 | wszystkie warianty: wymiary zgodne z oczekiwanymi (szerokość podstawki 234,8 / 254,8 / 264,8; głębokość +5 przy pbW 75 i kieszeni 30; lewa połówka 168,9 przy pbL 150; tuleja 43 / 58 / 73 przy hDoc 30 / 45 / 60), siatki OK |

## Założenia do sprawdzenia przy montażu

- Wymiary płytek (PCA9685 62 × 25, otwory 55,9 × 19,05 Ø3; ESP32-C3 22,5 × 18; HC-SR501 32 × 24, kopułka Ø23) – typowe, nie mierzone.
- Wtyk USB-C 50 mm (przyjęte przez użytkownika).
- `hDoc` 45 – zmierzyć przed drukiem tulei.

## Review modelu (Opus, Astra) – poprawione

Raporty: `review/2026-10-25-podstawka-model-opus.md`, `review/2026-10-25-podstawka-model-astra.md`. Jedna runda (PM). Klasyfikacja: psuje działanie albo druk → poprawione; brzegowe → bez zmian.

| Uwaga | Kto | Poprawka |
|---|---|---|
| Błona 0,2 mm za płytką PIR (zbędna ścianka za czołem) | Opus 1, Astra 1 | ścianka usunięta |
| Kopułka PIR nie przejdzie przy wsuwaniu od góry; płytka 1 mm poniżej otworu | Opus 1 | wycięcie w czole od góry do otworu; płytka stoi na dnie (`pirNadDnem` 0) |
| Gwint: flanki ok. 11° zamiast 45° i luz −0,12…+0,46 / 0,14 zamiast 0,20 (siatkowanie `linear_extrude` z twist) | Opus 4, Astra 2–3 | zwój jako helisa profilu zęba; rowek nakrętki odsunięty o luz prostopadle do flank; kontrola kolizji: pusto |
| Wysokość tulei bez kołnierza – za mało gwintu pod nakrętką | Opus 5 | `tulH` = `hDoc` + `kolT` + `nadDnem` |
| Brak wejścia zasilania w kasecie | Opus 2, weryfikacja Astry | ramka gniazda USB-C za wycięciem kablowym szufladki, 50 mm miejsca na wtyk; kaseta dosunięta do prawej ścianki |
| Połówki A1 mini: słupek zasłania otwór M3, łeb nachodzi na słupek | Opus 3 | otwory M3 przesunięte poza słupki (y 46,4 i 81,4) |
| Osłonka PIR sięga pod stół | Opus 6 | osłonka bez kołnierza, ścięta płasko na poziomie stołu |

Brzegowe (bez zmian): wtyk USB-C dokładnie 50 mm bez luzu (przyjęte 50 z zapasem), położenie nakrętki w podglądzie złożenia, brak obwiedni przewodów w złożeniu, gniazdo USB-C ESP32-C3 dostępne tylko po wyjęciu szufladki.

## Weryfikacja poprawek (Opus, Astra)

Raporty: `review/2026-10-25-podstawka-poprawki-opus.md`, `-astra.md`.

**Potwierdzone jako naprawione:**
- PIR;
- połówki A1 mini: lewa 178,9 × 112,8, bez brimu;
- gwint: flanki 45,0°, luz 0,200, bez kolizji, kierunek zgodny;
- tuleja 58;
- osłonka.

**Dopracowane po weryfikacji:**
- wycięcie PIR w czole od dna, bo podstawa soczewki jest kwadratowa, ok. 23 × 23 (Opus P1);
- gniazdo zasilania w kasecie 50 mm za szufladką, za wycięciem kablowym (Astra 5, Opus P2);
- otwory na gniazda USB-C w ramkach 9,5, bo gniazdo ma 8,94 (Opus P2).

Siatki po ponownym eksporcie: OK, 1 bryła, wymiary OK.

## Zmiana 25.10 (rano): szufladka na listwach nośnych

Prośba użytkownika: szufladka ma być prowadzona w skrzynce, nie leżeć na stole. Zasady: bez kleju (AGENTS.md), bez przedruku szufladki (PM). Dwie drukowane listwy nośne 101,8 × 8 × 7,5 przykręcone od zewnątrz przez ściankę ze sklejki (wkręty 3 × 25, łeb na zewnątrz podstawki, pogłębiony); szufladka leży na nich dnem 8 mm nad stołem (zachodzi 6 mm na każdą listwę), z boków prowadzą ją ścianki. Szufladka bez zmian – plik z nocnego druku jest dobry (geometria identyczna z commitem de713fe). Skutek: wnętrze 40 → 48, podstawka 58 → 66. Odrzucone: listwy klejone CA (klej), kołnierze dna w rowkach (przedruk szufladki), śruby M3 przez bok szufladki (łeb w środku koliduje z powerbankiem: luz 1 mm, łeb 1,65–3 mm).

Kontrola: siatki listew i osłonki OK, wymiary OK; część wspólna szufladki ze ściankami, płytą, kasetą i listwami w złożeniu: pusta; listwy ze ściankami: pusta.

Weryfikacja (Opus, Astra): `review/2026-10-25-podstawka-listwy-opus.md`, `-astra.md` – brak uwag psujących działanie lub druk; szufladkę z nocnego druku można używać. Uwagi montażowe: pogłębiać otwory w sklejce pogłębiaczem 90° pod rzeczywisty łeb i nie przeciągać wkrętów (pod otworem 2,25 mm sklejki); przy wysunięciu ok. 100 mm szufladka schodzi z listew i staje na stole – przy wsuwaniu unieść ją 8 mm na listwy.

## Stan wykonania u użytkownika (25.10) i otwarte punkty

- **Sklejka:** wycięta wersja ze ściankami 40 mm, bez otworów. Pod spodem dno ze sklejki 6 mm (decyzja użytkownika). Szufladka jeździ po dnie, ścianki ją prowadzą, listwy nośne niepotrzebne. Podstawka ma 64 mm. Model i rysunki w repo opisują jeszcze wariant 48 mm z listwami: do przestawienia, gdy użytkownik zechce.
- **Otwór w płycie górnej:** wykonany Ø60 (pomiar użytkownika).
- **Otwarte:** mocowanie PIR w czole szufladki sprawi problem. Użytkownik sprawdzi je w kolejny wieczór w Warszawie.

## Model zaktualizowany do stanu wykonanego (P7) i blokada szufladki (P5) – aktualne

Ta sekcja **zastępuje** wcześniejsze opisy: listew nośnych, ścianek 48 i rowków (historia wyżej).

**Drewno – jak wykonane:**
- dno 6 mm 254,8 × 222,8, sklejone ze ściankami;
- ścianki 40 mm (boczne 222,8 × 40 × 2, tylna 218,8 × 40);
- płyta górna 18 mm z otworem Ø60 (pomiar użytkownika), przykręcana na końcu 4 wkrętami 3,5 × 40 w ścianki boczne (9 od boku, 30 od przodu i tyłu);
- wysokość 64.

Model: `tDno`, `H_IN` = 40 (zmienne bazowe), `dOtwPl` = 60, moduł `dno()`. Rysunek cięcia i `podstawka-drewno.png` pokazują ten stan.

**Szufladka:**
- jeździ po dnie ze sklejki, z boków prowadzą ją ścianki (luz 1,5);
- powerbank 6 mm pod płytą;
- lewa połówka bez zmian: geometria identyczna z commitem de713fe, nocny druk dobry.

**Szufladka do druku: `Szuflada (X1C).3mf` w całości na X1C** (decyzja użytkownika 25.10); połówki A1 mini tylko jako zapas.

**Blokada (P5, decyzja użytkownika: M4 imbus):**
- prawy kołnierz czoła sięga do zewnętrznej krawędzi prawej ścianki, w nim luźny otwór Ø4,5;
- śruba M4 × 25 imbusowa od przodu, łeb (Ø7) opiera się płasko o kołnierz;
- w przedniej krawędzi prawej ścianki otwór Ø3,3 na 22 mm (25 − kołnierz 3), w połowie grubości (9 mm od boku) i 19,5 mm nad dnem: gwint wycina sama śruba, bez nakrętki wbijanej i wkładki;
- wkręcona blokuje szufladkę, do wymiany powerbanku wykręcić imbusem.

**Kaseta:**
- przykręcona do dna 4 wkrętami 3 × 12;
- piasty 4,6 mm pod łbami, żeby wkręt nie wyszedł spodem dna: zostaje 1 mm;
- tylny pas bez otworów, tylko ogranicznik.

**Kontrola:**
- siatki szufladek, kasety i osłonki OK, 1 bryła, wymiary zgodne z parametrami;
- część wspólna szufladki z dnem, ściankami, płytą i kasetą: pusta;
- część wspólna kasety ze ściankami i płytą: pusta.

**Otwarte:**
- P6 – mocowanie PIR: czekam na opis od użytkownika, co nie pasuje;
- review Opusa i Astry tej wersji.

## v2: wymiary wykonane i szufladka v2 (25.10 wieczorem) – aktualne

Ta sekcja **zastępuje** opisy szufladki i blokady wyżej (historia). Wymagania: `30-projekt/PRD.md` 0.2 §5 (pomiary użytkownika i szufladka v2). Model: `40-cad/openscad/podstawka.scad`; rozstrzygnięcia techniczne z uzasadnieniem są w nagłówku pliku.

### Zmienne bazowe według pomiarów

| Zmienna | v1 | v2 | Źródło |
|---|---|---|---|
| `WIN` (szerokość wnętrza) | 218,8 (pochodna) | **216** | pomiar przy froncie i z tyłu |
| `tDno` | 6 | **9** | pomiar |
| `H_IN` | 40 | 40 | pomiar |
| `DL` (głębokość) | 222,8 (pochodna) | **226** | pomiar |
| `wkrPlOd` | 30 | **20** | pomiar (9 od boku bez zmian) |
| `dOtwPl` | 60 | 60 | pomiar Ø60–61 |
| `tTyl` (ścianka tylna) | 18 | 18 | **założenie** |

Wynik: podstawka 252 × 226 × 67 (użytkownik podał 69 wysokości – różnica w dnie albo płycie, na szufladkę nie wpływa, bo liczy się wnętrze 40).

### Szufladka v2 (PRD 0.2)

| Część | Wymiar (druk) | Drukarka | Na stół | Uwagi |
|---|---|---|---|---|
| Korpus | 215,0 × 103 × 32 | X1C | dnem | ścianki 2,0; luz w podstawce **0,5 na stronę**; kieszeń PIR 27 z przodu, przegroda z wycięciem 12 × 8 nad listwą PIR, komora powerbanku, słupki, wycięcie kablowe na osi gniazda zasilania kasety; okno PIR 38 szer. (płytka + 3 na stronę) otwarte do górnej krawędzi, otwory M4/M3 w przedniej ścianie; fazki 2 × 45° na tylnych narożach |
| Front | 244 × 65 × 4 (+ podkładki M2 3,5) | X1C | licem, brim | zakładka 14 na ścianki, 1 nad stołem, 1 poniżej wierzchu płyty; PIR po prawej (oś 40 od prawego boku korpusu, 58,5 od prawej krawędzi podstawki); otwór kopułki Ø24, gniazdo kołnierza 23,5 × 23,5 × 0,5, 2 podkładki M2 4 × 8; otwory: 2 × M4 rączki, 2 × M3, blokada Ø5 |
| Rączka | 46 × 16 × 10 | A1 mini albo X1C | licem (większą podstawą) | ścięty ostrosłup z krawędziami R2 (kształt i wielkość: decyzje użytkownika – niska, nienachalna, mała, używana raz–dwa razy): przy froncie 40 × 10, lico 46 × 16, wysięg 10; gniazda łbów M4 Ø8 × 4,5 od lica (epoksyd), rozstaw 26; na środku frontu |
| Próbka gniazda PIR | 60 × 40 × 7,5 | A1 mini albo X1C | licem | wycinek frontu: otwór kopułki, gniazdo kołnierza, 2 podkładki M2 – przymiarka 26.10 zaliczona (wersja ze słupkami Ø4,5 × 2,5) |

Pliki: `40-cad/3mf/Podstawka v2/Szuflada v2 - korpus (X1C).3mf`, `… - front (X1C).3mf`, `… - raczka.3mf`; w tym samym katalogu kaseta, tuleja, nakrętka i próbki gwintu (bez zmian). Podglądy: `40-cad/openscad/podglad/podstawka-v2-*.png`; rysunek płyty z otworem blokady: `podglad/podstawka-ciecie.png` / `.svg`.

**Śruby z magazynu (PRD §7):**
- rączka: 2 × M4 × 20 imbus (pod łbem potrzeba ≥ 16, koniec 4 mm za nakrętką; łeb mieści się w gnieździe Ø8 × 4,5 – założenie Ø7 × 4), 2 nakrętki M4, 2 podkładki, epoksyd;
- front–korpus: 2 × M3 × 10, 2 nakrętki M3;
- PIR: 2 × M2 × 6 w podkładki frontu (Ø1,7);
- blokada: M4 × 25 imbus;
- kaseta do dna: 4 wkręty 3 × 12 (przy dnie 9 wchodzą w dno na 5 mm, zostaje 4); tuleja do płyty: 3 wkręty 3 × 16.

**Kaseta elektroniki:** bez zmian wobec v1 (położenie gniazda zasilania i piasty zamrożone w zmiennych). Siatka v2 ma te same wierzchołki co v1 z dokładnością 0,001 mm. Leży 107 od frontu (63 od lewego boku), korpus kończy się na 102.

**Blokada:** M4 × 25 przez front (Ø5) w przednią krawędź płyty górnej, na środku szerokości (126 od boku), 9 mm pod wierzchem płyty (58 nad stołem). W płycie otwór pilotowy **Ø3,3 × 22**, poziomo, wiercony przez otwór frontu przy wsuniętej szufladce. Najbliższe: wkręty płyty 9 od boku i 20 od frontu, kołnierz tulei od y 53 – daleko.

**PIR (wymiary ze zdjęć `70-budowa/zdjecia/2026-10-25-pir/`, odczyty w `70-budowa/zdjecia/MANIFEST.md`):** kołnierz soczewki 23 × 23 × 3 w gnieździe 23,5 × 23,5 × 0,5 (luz 0,25 na stronę), kopułka Ø23 w otworze Ø24, wystaje ok. 7,5 mm przed lico frontu (14 − 2,5 − 4). Przód płytki 2,5 za frontem: luty (≤ 2) mają ≥ 0,5 luzu. Płytka na 2 słupkach Ø4,5 z otworami Ø1,7 × 5, M2 × 6 wchodzi 4,5. Za płytką do przegrody 22: elementy 8, wtyki Dupont 20. Potencjometry i zworkę ustawić przed montażem (PRD).

### Kolejność montażu szufladki

0. Próbka gniazda PIR: przymierzyć PIR (kołnierz w gnieździe, kopułka w otworze, oba M2 wchodzą bez gięcia płytki). Jeśli nie pasuje – zmierzyć suwmiarką rozstaw otworów, kołnierz i kopułkę i poprawić `pirOtwRozst`, `pirGn`, `dKopOtw` przed drukiem frontu.
1. PIR we front: potencjometry i zworkę ustawić wcześniej; kołnierz w gniazdo od tyłu, 2 × M2 × 6 przez otwory płytki w podkładki, bez siły. Rysunki: `40-cad/openscad/podglad/podstawka-v2-pir-montaz.png` (rozstrzelony), `podstawka-v2-pir-przekroj.png` (przekrój).
2. Rączka: łby M4 wkleić epoksydem w gniazda od lica, gwintem w stronę frontu; po związaniu kleju.
3. Front na korpus: śruby rączki przez front i przednią ścianę korpusu, podkładki i nakrętki M4 od środka (kieszeń PIR, klucz 7); przy dolnych rogach 2 × M3 × 10 z nakrętkami. Przy dokręcaniu przytrzymać łeb M4 imbusem od lica rączki.
4. Przewód PIR (wlutowany albo na Dupontach) przez wycięcie w przegrodzie i prosto do tyłu pasem wtyku USB-C (prawa strona korpusu, obok powerbanku) do wycięcia w tylnej ściance, dalej do ESP32 w kasecie: ok. 350 mm z zapasem na wysunięcie (Fable W3, Astra W3). Kabel USB-C od powerbanku do gniazda kasety: ≥ 100 mm wolnego kabla przy zamkniętej szufladce. Zapas układać po lewej od kasety (x 18–63). **Próba:** kilka wysunięć 0…105 przy założonej płycie, bez napinania wtyków.
5. Szufladkę wsunąć do oporu frontu i wycentrować, przez otwór blokady we froncie nawiercić krawędź płyty Ø3,3 na 22 mm (głębokość od drewna), wkręcić M4 × 25.

### Kontrole (dowody)

| Kontrola | Wynik |
|---|---|
| Siatki (`sprawdz_siatki.js`), 1 bryła (`skladowe_siatki.js`) | korpus, front, rączka, próbka PIR, kaseta: 0 błędów, 1 bryła; tuleja, nakrętka, próbki gwintu: zdegenerowane trójkąty na gwincie naprawione `napraw_siatki.js` (jak v1), potem 0 błędów, 1 bryła |
| Wymiary wobec parametrów (`podstawka-wymiary.js`) | korpus 215 × 102 × 32, front 244 × 65 × 6,5, rączka 76 × 22 × 15 (siatka 75,97 × 21,97 × 14,99 – kule R3 z 32 segmentami), próbka PIR 60 × 40 × 6,5, kaseta, tuleja, nakrętka – OK |
| Kolizje (`podstawka-kolizje.sh`, CGAL, część wspólna ma być pusta) | szufladka zamknięta (korpus, front, rączka, PIR, powerbank) wobec sklejki i kasety: pusto; wsuwanie przy wysunięciu 0 / 30 / 60 / 90: pusto; PIR wobec frontu i korpusu: pusto; wkładanie frontu z PIR w korpus (przemiatanie 30 mm): pusto; łby, nakrętki i trzpienie wobec części, PIR i powerbanku: pusto |
| Test czułości kontroli | okno PIR bez zapasu (`oknoPIRzap` 0): wkładanie PIR wykrywa kolizję kondensatorów z przednią ścianą (PIR po lewej: x 22,5…57,5; po przeniesieniu na prawo: x 157,5…192,5; y 0…2) |
| Test zginania (`podstawka-zginanie.sh`) | przed review: `WIN` 218 → front 246; `wtyk` 45 → korpus 210; `kieszenPIR` 28 → korpus 104 głęb.; `tF` 5 → front 7,5 (wszystko OK). Po zmianie rączki: `rD` 12 → rączka 12 wysięgu; `rL2` 80 → 80; `rH2` 26 → 26; `WIN` 218 → front 246; `kieszenPIR` 28 → korpus 104. Wszystkie: wymiary zgodne z oczekiwanymi, siatki 0 błędów, 1 bryła; kolizje dla `WIN` 218, `kieszenPIR` 28, `rD` 12: pusto |

### Założenia do sprawdzenia przez użytkownika

- ścianka tylna 18 (głębokość wnętrza za kasetą);
- przednie krawędzie dna, ścianek i płyty w jednej płaszczyźnie (front się o nie opiera);
- rozstaw otworów montażowych PIR 28,5 (zmienna `pirOtwRozst`; użytkownik: „myślę, że rozstaw jest 28,5”) – sprawdzi próbka; luty od strony soczewki ≤ 2; **kołnierz soczewki zmierzony suwmiarką: 22,97** (użytkownik 25.10, zdjęcie z suwmiarką) – w gnieździe 23,5 luz 0,27 na stronę;
- M2 × 6 w warsztacie (PRD §7 wymienia M3–M5; M2 × 6 są przy małych oczach); M4 imbus z łbem okrągłym Ø7 × 4 w długości 35–40.

### Review (Fable, Astra) i rozstrzygnięcia

Raporty: `review/2026-10-25-szuflada-v2-fable.md`, `review/2026-10-25-szuflada-v2-astra.md` (brief `review/2026-10-25-szuflada-v2-brief.md`). Jedna runda. Fable: 0 krytycznych, 4 ważne, 8 drobnych; Astra: 0 krytycznych, 3 ważne, 1 drobna. Werdykty: drukować (Fable: korpus i rączkę od razu, front po pomiarze PIR; Astra: do próby montażowej po próbkach PIR i mostu).

| Uwaga | Kto | Rozstrzygnięcie |
|---|---|---|
| Wymiary PIR ze zdjęć ±1 wobec luzów 0,25–0,5 (rozstaw M2, kołnierz, kopułka) | Fable W1, Astra W1 | **próbka gniazda PIR** (60 × 40, wycinek frontu) do przymiarki przed frontem; pomiar suwmiarką na liście założeń |
| Blokada: trafienie w otwór pilotowy przy luzie korpusu ±0,5 | Fable W2 | otwór we froncie **Ø5**; pilot wiercony przez front przy wsuniętej, wycentrowanej szufladce |
| Przewody PIR i USB-C przy ruchomej szufladce nie są w modelu | Fable W3, Astra W3 | długości i trasa w kolejności montażu (krok 4); próba wysunięć u użytkownika – **do sprawdzenia** |
| Wtyki Dupont 2 mm przed przegrodą – przewody nie skręcą w górę | Fable W4 | **wycięcie 12 × 8** w górnej krawędzi przegrody nad listwą |
| Most 36 × 2 × 1 nad oknem PIR | Astra W2, Fable D5 | **okno otwarte do górnej krawędzi** |
| Brak faz wejściowych korpusu | Astra D1 | **fazki 2 × 45°** na tylnych pionowych narożach |
| Łeb M4 – walcowy Ø7 × 4 czy kulisty Ø7,6 × 2,2 | Fable D6, Astra | założenie Ø7 × 4; dla kulistego gniazdo Ø8 też pasuje (0,2), długość śruby wg łba – na liście założeń |
| Nakrętki tylko z góry kluczem | Fable D7 | bez zmian (dostęp z góry wystarcza; ścianka 2 bez miejsca na gniazda sześciokątne) |
| Blokada pod dynią – imbus z długim ramieniem | Fable D8 | do sprawdzenia po postawieniu dyni (instrukcja) |
| Wysokość skrzynki 67 nominalna, front do 66 | Fable D9 | do pomiaru; zmienna `frontPodGora` |
| Słupki M2 – wkręcać bez siły; luty; fazka rączki; brim frontu | Fable D10–D12 | w kolejności montażu i tabeli druku; rączka i tak zmieniona |
| Rączka 86 × 28 nachalna | użytkownik (po review) | **nowa rączka**: ścięty ostrosłup 66 × 14 → 76 × 22, wysięg 15, R3 |
| PIR po lewej, przewód w poprzek nad powerbankiem (użytkownik: „dlaczego PIR zrobiłeś po lewej stronie, jeśli przejście kabli z powerbanku idzie po prawej”) | użytkownik | **PIR po prawej**: oś 40 od prawego boku korpusu (`pirOdPrawej`), wycięcie w przegrodzie nad pasem wtyku USB-C, przewód prosto do tylnego wycięcia; eksport, siatki, wymiary, 5 kontroli kolizji i test czułości powtórzone – OK |
| Rączka 76 × 22 „zbyt duża i masywna, będzie wykorzystana może raz, może dwa” | użytkownik | **zmniejszona**: 40 × 10 → 46 × 16, wysięg 10, R2, M4 × 20 w rozstawie 26; eksport, siatki, wymiary (45,98 × 15,98 × 9,99) i 5 kontroli kolizji powtórzone – OK |

Po zmianach powtórzone: eksport 9 części, siatki, wymiary, 5 kontroli kolizji (pusto), test zginania (wyżej). Druga runda review – nie (brief PM).

### Review runda 2 (wersja końcowa, 26.10) i rozstrzygnięcia

Na prośbę użytkownika („całość może zostać już zrewidowana, czy jest OK”) review całej wersji po poprawkach i decyzjach użytkownika (commit `4cfe031`). Brief: `review/2026-10-25-szuflada-v2-brief-r2.md`; raporty: `review/2026-10-25-szuflada-v2-{fable,astra}-r2.md`.

- Astra: 0 krytycznych, 0 ważnych, 0 drobnych; poprawki rundy 1 działają; werdykt: drukować, front po przymiarce PIR.
- Fable: 0 krytycznych, 1 ważna, 3 drobne.

| Uwaga | Rozstrzygnięcie |
|---|---|
| W1: okno PIR ma 0,5 zapasu na kondensatory narożne, których wysięg 1,5 jest tylko ze zdjęć (±1) | **`oknoPIRzap` 3**: okno 38 × 30 (od wierzchu dna do górnej krawędzi) |
| D2: `podstawka-kolizje.sh` zgłasza „pusto” także po nieudanym assercie | skrypt sprawdza `ERROR` / `Assertion` w logu – test: `WIN` 214 daje „BŁĄD modelu” |
| D3: kule R2 na licu rączki – nawis przy stole, z min 0,0096 | **lico płaskie** (naroża R2 jako walce), rączka leży na stole: 46,00 × 16,00 × 10,00 |
| D4: kołnierz PIR opiera się na 4 polach narożnych (Ø24 w gnieździe 23,5) | bez zmian – wynika z PRD 0.2 |

Po zmianach powtórzone: eksport korpusu, frontu, rączki i próbki PIR, siatki (0 błędów, 1 bryła), wymiary, 5 kontroli kolizji (pusto), test czułości (`oknoPIRzap` 0 → kolizja wykryta).

### Podkładki M2 pod PIR (26.10, po próbce)

Użytkownik po przymiarce próbki (zaznaczył słupki na zdjęciu): „ja bym zrobił to nie okrągłe, tylko trochę szersze, tak aby było stabilniejsze, i zrobił wyższe o około 1 mm”.

- **Podkładki 4 × 8** (wzdłuż paska płytki) zamiast słupków Ø4,5, **wysokość 3,5** zamiast 2,5 (`pirPadW`, `pirPadH`, `pirPadT`). Podkładki mieszczą się między gniazdem kołnierza (0,5 odstępu) a pasami lutów przy górnej i dolnej krawędzi płytki (`pirLutStrefa` 4 ze zdjęć, odstęp 4).
- Skutek: płytka 3,5 za frontem, kołnierz soczewki 0,5 za tyłem frontu (nie dotyka gniazda – płytkę ustawiają wkręty M2), luty z przodu płytki mają 1,5–2,5 luzu, kopułka wystaje ok. 6,5 przed lico. Kieszeń PIR 26 → 27 (miejsce za płytką na wtyki Dupont zostaje 22), korpus 102 → 103 głęb. (do kasety 4).
- Kontrole: eksport korpusu, frontu, rączki i próbki, siatki (0 błędów, 1 bryła), wymiary (front 244 × 65 × 7,5, korpus 215 × 103 × 32), 5 kontroli kolizji (pusto), test czułości – OK.
- Rysunki montażu PIR: `podglad/podstawka-v2-pir-montaz.png` (front, PIR i wkręty rozstrzelone, widok od tyłu), `podglad/podstawka-v2-pir-przekroj.png` / `.svg` (przekrój przez osie wkrętów z wymiarami).
