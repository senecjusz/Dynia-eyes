# Podstawka pod dynię – koncepcja wstępna v5.1 (po review rundy 2) (krok 1)

25.10.2026, projektant podstawki. Wymagania: `30-projekt/PRD.md` §5, §7, §8 oraz decyzje użytkownika z 25.10 (przekazane PM do wpisania w PRD):

- szufladka **tylko z powerbankiem, wysuwana do przodu** (z tyłu stoją inne dynie);
- **elektronika na stałe** w podstawce, przy wymianie powerbanku nietykana;
- USB-C wpinany ręcznie, **żadne kable na zewnątrz**;
- **podstawka bez dna**, płyta górna 18;
- **dynia mocowana w środku swojego dna**;
- PIR HC-SR501 z przodu, z dostępem do regulacji, opcjonalna osłonka;
- skrętki z wtykami RJ45 i łącznikami gniazdo–gniazdo;
- użytkownik nie ma kabla USB-C kątowego; szufladkę może wydrukować na X1C albo z 2 części sklejonych CA;
- mocowanie dyni ma być niskie (w dyni moduły oczu zajmują miejsce);
- elektronika w kasecie wsuwanej od tyłu (tylko do montażu i serwisu).

Dynia użytkownika: **obwód 100 cm (Ø ok. 318), 10 kg**.

**Rendery** (Blender, skrypt `40-cad/narzedzia/podstawka-blender-render.py`): [wymiana powerbanku](2026-10-25-podstawka-render/1-wymiana-powerbanku.png), [prześwietlenie](2026-10-25-podstawka-render/2-przeswietlenie.png), [przekrój](2026-10-25-podstawka-render/3-przekroj.png), [przód](2026-10-25-podstawka-render/4-przod.png).

**Review** runda 1 (koncepcja v2) i runda 2 (v5) z klasyfikacją uwag: `review/2026-10-25-podstawka-koncepcja-wnioski.md`. Bez CAD; liczby to wartości bazowe zmiennych do modelu w kroku 2.

## Jak to działa

Skrzynka ze sklejki **236 × 240 × 58 bez dna**: dwie ścianki boczne i płyta górna 18. Ścianki stoją na stole. Z przodu, na całą szerokość, jest **drukowana szufladka** z samym powerbankiem ułożonym w poprzek, a w jej czole siedzi PIR.

**Wymiana powerbanku:**

1. Wysunąć szufladkę do przodu o ok. 10 cm.
2. Wypiąć wtyk USB-C z boku powerbanku (wtyk jest w szufladce).
3. Wyjąć powerbank, włożyć nowy, wpiąć wtyk.
4. Wsunąć szufladkę.

Elektronika i dynia stoją.

**Elektronika za szufladką, w kasecie wsuwanej od tyłu:** PCA9685 i ESP32-C3; 3 skrętki idą z niej przez tuleję do łączników RJ45 w dyni. Tylna ścianka kasety zamyka podstawkę z tyłu. Kasetę przykręca się do ścianek bocznych i podczas wystawy się jej nie rusza.

**Mocowanie dyni:** w środku dna dyni jest otwór Ø80. Przechodzi przez niego **drukowana tuleja z gwintem**, przykręcona kołnierzem do płyty górnej. Od środka dyni zakręca się na nią **nakrętkę**, która dociska dno dyni do płyty. Nad dnem wnętrza dyni tuleja z nakrętką wystaje **ok. 10 mm**. Przez tuleję idą 3 skrętki z kasety do łączników RJ45 w dyni.

## Założenia (zmienne, źródło)

| Zmienna | Wartość bazowa | Źródło / pewność |
|---|---|---|
| `D` średnica dyni | 318 | obwód 100 cm (użytkownik) |
| `h` wysokość docisku nakrętki nad płytą | ok. 45 (dno 25–55 + ewentualne wklęśnięcie dna zewn.) | mierzy się, gdy dynia stoi na płycie: od płyty do dna wnętrza przy otworze |
| podstawka `SZ × DL × H` | 236 × 240 × 58 | szerokość = ścianki 2 × 18 + szufladka 196 + luz 2 × 2 (rośnie razem z długością wtyku USB-C); głębokość = czoło 3 + szufladka 100 + kaseta 134 + luzy; wysokość = wnętrze 40 + płyta 18 |
| `H_IN` wnętrze | 40 | powerbank 32 + dno szufladki 2 + 6 luzu; PCA9685 z wtykami Dupont ok. 30 nad płytką nośną 3 |
| powerbank Baseus | 160 × 70 × 32, USB-C na środku krótszej ścianki | PRD §5. Manta (zapas): wymiary nieznane, wnęka szufladki jest zmienną |
| PCA9685 | 62 × 25 | typowa płytka (szacunek) |
| ESP32-C3 SuperMini | 22,5 × 18 | typowa płytka (szacunek) |
| łącznik RJ45 gniazdo–gniazdo | 38 × 16 × 20 | typowy (szacunek; zmierzyć jeden) |
| HC-SR501 | płytka 32 × 24, kopułka Ø23, wysokość z kopułką ok. 25 | typowe wymiary z kart modułu (szacunek); potencjometry i zworka na stronie elementów |
| wtyk USB-C prosty z odgięciem kabla | 30 (Opus: 43–55) | **zmierzyć posiadany kabel**; długość szufladki = 160 + wtyk + 5, szerokość podstawki = szufladka + 40 (przy 50 mm: 215 i 255) |
| otwór w dnie dyni | Ø80, w środku dna | otwornica 80 jest w warsztacie; tnie ok. 40 mm głęboko, resztę nożem |
| tuleja | gwint Ø76, wnętrze Ø64, kołnierz Ø120 × 3, wysokość nad kołnierzem = `h` + 10 | gwint 45°, skok 5, luz 0,20 jak w próbce E2.0 (`decyzje.md`); `h` mierzone przy postawionej dyni, potem druk tulei; nad dnem wnętrza zostaje nakrętka 8 + 2 |
| nakrętka | Ø130 (sześciokąt z uchwytami), wys. 8 | ok. 1,6 zwoju gwintu; dociska dno dyni do płyty, kręcona ręką od środka dyni |

Środek ciężkości dyni ok. 190–220 mm nad stołem, połowa podstawki 118–120 mm, więc dynia przewraca się dopiero przy przechyle ok. 28–32°. Narożniki podstawki (połowa przekątnej 168) wystają ok. 9 mm poza obrys dyni (promień 159).

## Szufladka (druk: X1C w całości albo 2 części sklejone CA)

- **Wymiary:** 196 × 100 × 30 (dno 2, ścianki 2,4). Czoło 206 × 39 × 3 opiera się o przednie krawędzie ścianek bocznych, więc to ono zatrzymuje szufladkę przy wsuwaniu.
- **Powerbank** w poprzek, portem w prawo. Prosty wtyk USB-C z gięciem kabla mieści się w szufladce (160 + 30 przy wtyku 30 mm; długość szufladki to zmienna).
- **Kabel USB-C:** z wtyku przez wycięcie w tylnej ściance szufladki do kasety elektroniki, zapas ok. 10 cm na wysunięcie. Na zewnątrz podstawki nic nie wychodzi.
- **Prowadzenie:** ścianki boczne podstawki (luz 2 na stronę).
- **Wysuwanie:** szufladka jedzie po stole. Do wyjęcia powerbanku wystarczy wysunąć ją o ok. 100 mm (powerbank 70 + przegródka PIR 27 + ścianka).
- **PIR:** przegródka 25 mm za czołem (potencjometry, zworka i listwa są z tyłu płytki, od strony przegródki). Kopułka wystaje przez otwór Ø24 w czole, ok. 20 mm nad stołem. Po wysunięciu szufladki potencjometry są dostępne wkrętakiem od góry. Przewód 3-żyłowy wlutowany w płytkę (bez wtyku Dupont), ok. 15 cm zapasu.
- **Osłonka PIR (opcja):** rurka Ø28 wewn. o długości `L`, przykręcona do czoła 2 wkrętami 2,5–3 × 10. L = 20 zawęża pole widzenia orientacyjnie do ±30°.

## Elektronika (kaseta od tyłu, na stałe)

Drukowana kaseta ok. 198 × 134 × 40 za szufladką (y 106–240): dno 3 i tylna ścianka 228 × 40, która zamyka podstawkę z tyłu i uszami zachodzi na tylne czoła ścianek bocznych. Wsuwa się ją od tyłu po stole i przykręca 2 wkrętami przez uszy w czoła ścianek bocznych. Luz nad kasetą 0,3–0,5. Na dnie kasety:

- **3 skrętki do dyni** wpięte żyłami (Dupont) w listwy PCA9685; schodzą z tulei pionowo i skręcają do PCA łukiem R ≥ 20 w 27 mm pod płytą;
- PCA9685, ESP32-C3, kondensator 470–1000 µF i wejście zasilania wg `polaczenia.md`.

Montaż: elektronikę z 3 skrętkami złożyć w kasecie na stole i wsunąć kasetę; wtyki skrętek wyprowadzić w górę przez tuleję. Przy opuszczaniu dyni na tuleję skrętki przechodzą przez otwór w dnie; w dyni wpiąć je w łączniki z przewodami od rozdzielaczy. Zdjęcie dyni: wypiąć 3 łączniki w dyni.

Rozkład elementów w kasecie (słupki PCA9685 i ESP32-C3, prowadzenie przewodów) to główna praca kroku 2.

## Mocowanie dyni

1. Wyciąć otwór Ø80 w środku dna dyni. Postawić dynię na płycie (otwór nad otworem w płycie) i zmierzyć `h` od płyty do dna wnętrza przy otworze.
2. Wydrukować tuleję o wysokości `h` + 10 (gwint na całej długości) i przykręcić ją kołnierzem do płyty górnej (3 wkręty 3 × 16) nad otworem Ø64 w płycie.
3. Opuścić dynię na tuleję (fazka na górze tulei ułatwia trafienie, przez otwór w wieku widać tuleję).
4. Od środka zakręcić nakrętkę ręką do oporu.

Druk: tuleja kołnierzem na stół, nakrętka płasko – bez podpór. Nad dnem wnętrza tuleja z nakrętką wystaje ok. 10 mm: nie zabiera miejsca modułom oczu, a sok z dna dyni nie spływa do podstawki.

## Okablowanie skrętką (PRD §5)

**Tor jednej grupy:**

1. PCA9685 w kasecie;
2. skrętka z kasety: z jednej strony żyły z końcówkami Dupont na listwach PCA9685, przez tuleję do dyni, z drugiej strony wtyk RJ45 ok. 10–15 cm nad dnem wnętrza;
3. **łącznik RJ45 w dyni** (decyzja użytkownika 25.10 – wszystkie połączenia rozłączane w dyni, w podstawce nic się nie wpina);
4. krótka skrętka z wtykiem RJ45, drugi koniec **wlutowany w rozdzielacz** (płytka uniwersalna z listwami goldpin 3-pin);
5. wtyczki serw.

- **3 skrętki:** grupa lewa (3–4 małe oczy), grupa prawa (3–4 małe oczy), duże oko (3 × MG90S). Z kasety do łącznika ok. 0,3 m, od łącznika do rozdzielacza 0,2–0,4 m. Wtyki RJ45: 6, łączniki: 3.
- **Kolejność pinów na rozdzielaczu jak we wtyczce serwa:** sygnał (pomarańczowy), 5 V (czerwony), masa (brązowy). Po stronie PCA9685: sygnał → PWM kanału, 5 V → V+, masa → GND.
- **Przed podłączeniem serw:** sprawdzić miernikiem każdy łącznik i każdą wiązkę od końca do końca.

**Przypisanie żył** (wtyki T568B, zasilanie w parach z masą):

| Styk | Kolor (T568B) | Para | Grupa 4 małych oczu | Duże oko (3 × MG90S) |
|---|---|---|---|---|
| 1 | biało-pomarańczowy | 2 | sygnał oko 1 | sygnał lewo–prawo |
| 2 | pomarańczowy | 2 | sygnał oko 2 | sygnał góra–dół |
| 3 | biało-zielony | 3 | sygnał oko 3 | sygnał powieki |
| 4 | niebieski | 1 | **+5 V** | **+5 V** |
| 5 | biało-niebieski | 1 | **masa** | **masa** |
| 6 | zielony | 3 | sygnał oko 4 | **masa** |
| 7 | biało-brązowy | 4 | **+5 V** | **+5 V** |
| 8 | brązowy | 4 | **masa** | **masa** |

Grupa z 3 małymi oczami: styk 6 wolny.

**Prąd i spadek napięcia na skrętce 0,6 m.** Prądy serw to założenia z kart, nie pomiary. Opór żyły: Cu 24 AWG 0,084 Ω/m, CCA ok. 0,15 Ω/m.

| | Grupa małych oczu | Duże oko |
|---|---|---|
| Najgorszy przypadek | firmware: najwyżej 2 małe oczy naraz: 0,5 A w ruchu, 0,72 A szczytowo (SG90 360 mA zablokowany) | 3 × MG90S: 0,75 A w ruchu, 2,1 A szczytowo (700 mA zablokowany) |
| Żyły 5 V / masa | 2 / 2 | 2 / 3 |
| Prąd na żyłę 5 V | 0,25 / 0,36 A | 0,38 / 1,05 A |
| Spadek Cu | 0,03 / 0,04 V | 0,03 / 0,09 V |
| Spadek CCA | 0,05 / 0,07 V | 0,06 / 0,16 V |

Do istniejącego testu 11 serw na Baseusie (`dynia-v2-plan.md`) dopisany pomiar: napięcie na rozdzielaczu dużego oka ≥ 4,3 V przy ruchu 3 serw.

## Wygląd

Podstawka schowana pod dynią, pomalowana na czarno albo ciemną bejcą. Z przodu widać czoło szufladki z kopułką PIR.

## Lista elementów

**Sklejka:**

| Element | Grubość | Wymiar | Szt. | Uwagi |
|---|---|---|---|---|
| Płyta górna | 18 | 236 × 240 | 1 | otwór Ø64 w środku (x 118, y 120) – nastawna otwornica 64 |
| Ścianka boczna | 18 | 240 × 40 | 2 | |

**Druk 3D:**

| Część | Wymiar | Drukarka |
|---|---|---|
| Szufladka z przegródką PIR | 206 × 103 × 39 | X1C albo A1 mini z 2 części sklejonych CA |
| Kaseta elektroniki z tylną ścianką | ok. 228 × 138 × 40 | X1C albo A1 mini z 2 części |
| Tuleja z gwintem i kołnierzem | Ø120 × (`h` + 13) | A1 mini, po zmierzeniu `h` |
| Nakrętka | Ø130 × 8 | A1 mini |
| Osłonka PIR (opcja) | Ø34 × L | A1 mini |

**Z warsztatu:**

- wkręty do drewna 3,5 × 40 × 6 (płyta górna do ścianek, od góry);
- wkręty 3 × 16 × 3 (tuleja), 3 × 12 × 2 (kaseta), 2,5–3 × 10 × 2 (osłonka PIR);
- śruby M3 do słupków PCA9685;
- kabel USB-C prosty (jest);
- skrętka ok. 3 × 0,3 m + 3 × 0,4 m, wtyki RJ45 × 6, łączniki × 3, płytki uniwersalne × 3, goldpin, końcówki Dupont, przewód 3-żyłowy do PIR.

## Poza koncepcją (świadomie)

Bez zamka szuflady, osłon, uszczelek i nóżek (PRD §8).

## Do potwierdzenia (fakty z warsztatu, nie blokują)

- Wymiary zapasowej Manty (wnęka szufladki).
- Długość wtyku USB-C z osłoną i promień gięcia kabla (decyduje o długości szufladki i szerokości podstawki).
