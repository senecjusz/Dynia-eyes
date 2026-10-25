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
| Szufladka | `Szuflada (X1C)` | 234,8 × 112,8 × 39 | X1C | dnem na stół; uchwyt klinem 45° bez podpór; otwór kopułki Ø24 w pionowym czole |
| albo 2 połówki | `Szuflada lewa (A1 mini)` + `Szuflada prawa (A1 mini)` | 178,9 / 55,9 × 112,8 × 39 | A1 mini | żebra z 2 otworami M3: skręcić M3 × 10 z nakrętką, opcjonalnie CA na styku |
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
