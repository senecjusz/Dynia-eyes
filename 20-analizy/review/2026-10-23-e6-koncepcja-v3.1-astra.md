**Weryfikacja E6.1d — koncepcja v3.1, Astra, 23.10.2026**

**Model kontrolny nie jest jeszcze wiarygodną podstawą briefu CAD etapu 2.** Znalazłem rzeczywistą kolizję piasty M2 Y ze Słupkiem **w zakresie pracy**, pominiętą przez przemiatanie. Potwierdziłem lokalne wyniki okna, ale nie deklarację „wszystkie pary niezamierzone ≥0,551 mm”.

Zakres zgodny ze zleceniem: poprawki po review v3, bez ponownej oceny architektury. Przeczytałem wskazane skrypty, wyniki i koncepcję. Wykonałem obliczenia przez import modułów w `python3 -B`, bez zapisywania plików. Nie uruchamiałem całego `odtworz.sh`, które nadpisuje wyniki w repo. Porównanie z bazą CAD opieram na geometrii podanej w zleceniu i raporcie odbioru etapu 1; nie wykonywałem odczytu Onshape.

**1. Wyniki odtworzone**

| Sprawdzenie | Mój wynik | Ocena |
|---|---:|---|
| Okno–Słupek, ψ=0°, θ=−15° | **0,560518 mm** | Potwierdzone lokalnie |
| Okno–Słupek, ψ=−1°, θ=−15° | **0,560539 mm** | Stary kontrprzykład K1 naprawiony |
| Wskazany styk–krawędź M4 | **1,369859 mm** | Potwierdzone dla wskazanego styku |
| Obudowa M2 X–płyta, 25°/−15° | **0,729577 mm** | Odtworzone |
| Obudowa M2 Y–płyta, 25°/−15° | **0,752512 mm** | Odtworzone |
| Obudowa M2 Y–płyta, 23,733°/−18,183° | **0,550499 mm** | Odtworzone dla zaokrąglonego położenia |
| Drut G–kula R30, t=0,5° / −0,25° | **0,617187 / 0,604768 mm** | Odtworzone dla modelu drutu |
| Piasta M2 Y–tuleja Słupka, ψ=0°, θ=15° | **punkt piasty 0,803069 mm wewnątrz Słupka** | Kolizja pominięta przez skrypt |

Odtworzenie wskazanej wartości nie oznacza potwierdzenia globalnego minimum ani zgodności całej geometrii z CAD.

**2. KRYTYCZNE — tuleja Słupka wypada z kontroli; kolizja już przy θ=15°**

**Miejsce:** `e6model.py:fixed_prims()`, `uchwyt_prims()`; `przemiatanie.py`, linie 354–356.

Słupek jest rozdzielony na walec do z=−12,75 oraz tuleję typu `ann` od −12,75 do −5,5. Tymczasem listy `Fs`, `near_ball` i `near_lid` **nie zawierają typu `ann`**. Kontrolowana jest dolna część Słupka, a tulejowa znika z macierzy par.

Dla ψ=0°, θ=15° znalazłem punkt powierzchni walcowej piasty M2 Y:

```text
x =  0,007714197
y =  6,846926511
z = −11,152103785 mm
```

Wyniki funkcji odległości:

```text
piasta M2 Y:      −4,44·10⁻¹⁶ mm — punkt na powierzchni
tuleja Słupka:    −0,803069144 mm — punkt wewnątrz materiału
```

To nie jest ujemny wynik powstały przez odjęcie błędu próbkowania. Punkt leży w przedziale z tulei i ma promień **6,846931 mm**, pomiędzy jej promieniami **5,65 i 7,65 mm**. Otwór M4 na +x ani kanał nakrętki nie usuwają materiału w tym miejscu.

| θ przy ψ=0° | Odległość znalezionego punktu piasty od tulei |
|---:|---:|
| 10° | +0,142844 mm |
| 12° | −0,228792 mm |
| 15° | −0,803069 mm |

**Scenariusz porażki:** oko opiera się piastą M2 Y o Słupek przed osiągnięciem programowego zakresu +15°. Deklarowany dowód rozruchu „kontakt tylko na ogranicznikach” również przestaje obowiązywać.

**Poprawka/test:** włączyć wszystkie tuleje do kontroli, poprawić kolidującą geometrię i ponownie sprawdzić cały zakres. Powyższy punkt powinien stać się przypadkiem kontrolnym wykrywającym pominięcie bryły. Nie przesądza to konieczności zmiany istniejącego Słupka — poprawka może dotyczyć nowego Uchwytu.

**Pewność: wysoka; bezpośredni dowód przenikania.**

**3. KRYTYCZNE — macierz par i geometria nadal nie obejmują całego mechanizmu**

**Miejsce:** `eye_pairs()`, `do_cross()`, `lid_prims()`, `uchwyt_prims()`, `servo_prims()`.

Najważniejsze braki:

| Element | Stan faktyczny kodu |
|---|---|
| Uchwyt wobec powiek | `do_cross()` obejmuje `rx`, `ry`, `hx`, `hy`, ale pomija `bf`: płytę, piasty, łączniki, nadlewy i tuleję przednią |
| Płyta okna wobec stałych | Nie przechodzi przez pętlę części `bf`, ograniczoną do `cap/cyl/obb`; `okno.py` zastępuje tylko kontrolę zewnętrznego przekroju Słupka i kardana |
| Tuleja przednia Uchwytu wobec stałych | Typ `ann` również wypada z tej pętli |
| Żebro mostka X | Obliczana jest dostępna szerokość, lecz żebro nie powstaje jako bryła w `uchwyt_prims()` |
| Mostki i ucha powiek | Brak brył odpowiadających istniejącemu mostkowi G R4,5–8 oraz uchom G R6 i D R4 |
| Boki osi Ramy | Brak odpowiadającej im geometrii w modelu stałym |
| Przycięcia kącików | `lid_lid_gap()` oblicza δ(x), ale `lid_blocks()` nie stosuje tych przycięć do czasz |
| Kable | Dwie rozłączne kapsuły R0,6 nie obejmują pełnego przekroju 3,6×1,2 mm |

Dla kabla dwie osie są oddalone o **2,4 mm**, a średnice wynoszą **1,2 mm**. Między nimi pozostaje pusta szczelina **1,2 mm**. Przykładowo punkt środkowy kabla S_Y:

```text
(−21,771; 3,000; −69,150)
```

ma w modelu odległość **+0,6 mm** od kabla, choć leży wewnątrz deklarowanego pełnego przekroju taśmy.

Także wynik szczeliny powiek jest obliczeniem dla postulowanych przycięć, nie kontrolą wygenerowanych brył: przy x=30,9 mm same nieprzycięte krawędzie dają około **0,113 mm**, podczas gdy raport wpisuje **0,600 mm**.

**Scenariusz porażki:** niewygenerowany element lub niewysłana do obliczenia para koliduje mimo dodatnich minimów raportu. Kolizja z punktu 2 pokazuje, że to zagrożenie już występuje.

**Poprawka/test:** przygotować kompletny spis brył oraz macierz par z jawnym uzasadnieniem każdego wyłączenia. Dodać istniejące mostki, ucha, boki osi, żebro i pełną obwiednię kabli. Osobno wykazać pary zastąpione rachunkiem analitycznym.

**Pewność: wysoka dla braków; poza punktem 2 nie stwierdzam na tej podstawie konkretnej kolizji.**

**4. KRYTYCZNE — nie każda raportowana odległość jest dolnym ograniczeniem**

**Miejsce:** `e6model.py:prism_d()`; `przemiatanie.py:dmin()`, `run()`; `wire_points()`.

**Kontrprzykład funkcji odległości płyty.** Dla płyty okna w zerze, z=−7,5…−4,5, punkt:

```text
(−20; 0; −2)
```

leży nad pełnym fragmentem płyty. Dokładna odległość wynosi **2,5 mm**, ale `prism_d()` zwraca **3,0 mm**. Przyczyną jest inicjalizacja `far+1` i pominięcie dokładnego obliczenia dla `dz≥far`.

Dla kapsuły R0,1 między punktami `(−20;0;−2)` i `(−20;0;−1,99)`:

- rzeczywista odległość od płyty: **2,400 mm**;
- wynik `ev()`: **2,895 mm**.

To bezpośrednio obala deklarację dolnego ograniczenia, również po przejściu przez mechanizm odejmowania błędu próbek.

Dodatkowo:

- `prism_d(star=True)` ustala przynależność przez interpolację promienia między wierzchołkami; nie jest to dokładny test wnętrza łamanej.
- Odejmowany promień pokrycia dotyczy **próbek bryły w jednym położeniu**, nie przerw między położeniami mechanizmu.
- Siatka ruchu co 1° i lokalne zagęszczanie wybranych minimów nie dają dolnego ograniczenia dla ciągłego ruchu. Dla ilustracji punkt na R30 przemieszcza się o **0,262 mm na 0,5°**; zapas najciaśniejszej pary ponad wymagane 0,5 mm wynosi tylko około **0,051 mm**.
- Łuki drutu zastąpiono cięciwami bez dodania ich odchyłki do promienia. Dla R1,8 i ośmiu odcinków na 90° strzałka wynosi **0,00867 mm**. Kapsuły wokół cięciw nie są pełną obwiednią rzeczywistego łuku.

**Scenariusz porażki:** raport zawyża luz albo pomija minimum między sprawdzonymi położeniami.

**Poprawka/test:** poprawić pole odległości płyty; zachować prawidłowe dolne ograniczenia także w szybkich ścieżkach. Osobno uwzględnić błędy aproksymacji geometrii i próbkowania ruchu, np. przez adaptacyjne dzielenie zakresów z ograniczeniem maksymalnego przemieszczenia.

**Pewność: wysoka.** Nowa funkcja czaszy usuwa dawny problem szukania najbliższego punktu przy stałym x, lecz nie naprawia powyższych błędów całego obliczenia.

**5. WAŻNE — okno poprawiono, ale nie ma jeszcze jednej identycznej geometrii od obliczeń do CAD**

**Miejsce:** `okno.py:section()`, `pspline()`, `clearance()`; `przemiatanie.py:Model.__init__()`; koncepcja §4.

**Co zaliczam:** przecięcia tworzących walca z obiema płaszczyznami płyty są teraz obliczane. Niezależna kontrola z przycinaniem tworzących przez pełną warstwę 3 mm potwierdziła **0,560518 mm** dla 0°/−15°. Potwierdziłem również odległość **1,369859 mm** od wskazanego styku do rzeczywistej krawędzi otworu M4 na powierzchni Słupka.

Pozostają trzy rozbieżności:

1. `okno.py` używa **14 400 punktów**, natomiast przemiatanie pobiera `W[::80]`, czyli **180 punktów**. To inny profil.
2. Profil nie jest wszędzie wypukły. Zmierzona różnica promieni łamanej 180-punktowej względem gęstego profilu wynosi około **−0,004988…+0,001188 mm**. Twierdzenie, że wszystkie cięciwy leżą wewnątrz i zawsze powiększają materiał płyty, jest fałszywe.
3. Kod definiuje konkretny **okresowy splajn sześcienny o jednostajnym parametrze**. Polecenie „zamknięty spline przez punkty” w Onshape nie gwarantuje tej samej parametryzacji i krzywej.

Ponadto `section()` nie wykonuje opisanej otoczki wypukłej: funkcja `hull2()` pozostaje niewykorzystana, a punkty są wybierane w koszykach kątowych. `clearance()` nie odejmuje łącznego błędu tej redukcji i próbkowania ruchu. Potwierdzone **0,560518 mm** jest wynikiem lokalnym, nie certyfikowanym minimum całego prostokąta pracy.

**Scenariusz porażki:** CAD otrzymuje inne okno niż kontrolowane, a kontakt wypada przy innym kącie.

**Poprawka/test:** przekazać jednoznaczną definicję splajnu albo zweryfikować wyeksportowany profil CAD względem obliczonego, z tolerancją uwzględnioną w zapasie. Ujednolicić profil w obu skryptach.

**Pewność: wysoka dla różnic; nie wykazałem tutaj spadku zapasu okna poniżej 0,5 mm.**

**6. WAŻNE — B1 przelicza komplet, ale jego TAK nie jest jeszcze wiarygodną akceptacją**

**Miejsce:** `b1_akceptacja.py:to_params()`, `main()`.

Zwykły przebieg rzeczywiście wywołuje przemiatanie dla wprowadzonych wymiarów. **Wysokość gniazda jest wymagana** dla obu przegubów: brak `gniazdo_H` powoduje `KeyError`. To poprawa względem v3.

Pozostałe problemy:

- Wynik bazuje na niepełnym modelu z punktów 2–4.
- `--uzyj` nie sprawdza zgodności zapisanych wyników z pomiarami. W kontrolowanym teście, bez zapisu na dysk, zmieniłem **gniazdo M2 z Ø7 na Ø30**, pozostawiając wcześniejsze przemiatanie. Program nadal zwrócił **TAK, minimum 0,551 mm**.
- Brak głębokości gwintu jest zastępowany **99 mm**, a brak długości czopa — **0 mm**. Niekompletne dane mogą przejść.
- `kolnierz_D` z wejścia nie wpływa na geometrię; model korzysta z osobnego `cokolR`.
- `gwint_czopa_L` służy tylko do kontroli progu. Nie zmienia długości walca czopa w modelu.
- Wbrew §7 koncepcji program **nie przelicza momentów M_k** po zmianie B1.

**Scenariusz porażki:** TAK dotyczy starych danych, wymiarów zastępczych albo innej długości czopa niż fizycznie zamontowana.

**Poprawka/test:** wymagać kompletu pomiarów; powiązać cache ze skrótem pomiarów, parametrów, kodu i okna; używać rzeczywistych wymiarów okuć w modelu; dodać przeliczenie momentów lub poprawić deklarację dokumentu.

**Pewność: wysoka, w tym wykonany test błędnej akceptacji cache.**

**7. WAŻNE — długości pochylonych czopów i płaska podstawa Ramion nadal są niespójne**

**Miejsce:** koncepcja §3.2; `e6model.py:horn_prims()`.

W modelu płaszczyzna oporowa kołnierza przechodzi przez A, a cokół leży pod nią. Kod, opis i B1 używają różnych długości:

| Wielkość | X | Y |
|---|---:|---:|
| Długość modelowanego czopa od A w stronę tyłu | **6,020 mm** | **6,865 mm** |
| Długość zalecona w tekście pod kołnierzem | **7,0 mm** | **7,8 mm** |
| Wystawanie modelowanego czopa poza nominalny spód płytki, z promieniem Ø5 | **0,204 mm** | **1,306 mm** |
| Wystawanie czopa o długości z tekstu, od tej samej płaszczyzny A | **1,180 mm** | **2,187 mm** |

Dodatkowo ukośne walcowe gniazdo Ø9 wystaje poniżej nominalnego płaskiego spodu Ramienia o **0,366 mm dla X** i **1,501 mm dla Y**. Kod nie przycina tego walca płaszczyzną spodu.

**Scenariusz porażki:** czop wystaje bardziej niż deklarowane 0/0,5 mm, a Ramię nie ma opisanej płaskiej powierzchni druku. Przemiatanie sprawdza krótszy czop niż zalecany do wykonania.

**Poprawka/test:** ustalić jeden przekrój z płaszczyzną oparcia kołnierza, cokołem, spodem i długością czopa. Przyciąć gniazdo do płaskiej podstawy albo jawnie zmienić podstawę. Modelować długość wynikającą z B1.

**Pewność: wysoka dla geometrii zapisanej w kodzie i rozbieżności z tekstem.**

**8. WAŻNE — końcówka Ø8 nie zamyka wcześniejszego wymagania ścianki 2 mm**

**Miejsce:** koncepcja §3.3 i próbka P4.

Rzeczywista nominalna ścianka przy gwincie M5 wynosi **(8−5)/2=1,5 mm**, czyli o **25% mniej** od wcześniejszych 2 mm. Przy M2 pręt Ø4,5 ma po nacięciu gwintu około **1,25 mm** ścianki; podane **1,45 mm** dotyczy otworu Ø1,6 przed gwintowaniem.

Druk pionowo rozwiązuje kolizję końcówki ze stołem. Nie dowodzi jednak wytrzymałości osiowej wydruku. Rachunki 0,9 MPa naprężenia obwodowego i około 790 N wyrwania przy założonych 20 MPa nie uwzględniają wytrzymałości międzywarstwowej i koncentracji naprężeń przy przejściu Ø8→Ø4,5. Zdanie „ryzyko pęknięcia jest tylko przy nacinaniu gwintu” jest zbyt mocne.

**Scenariusz porażki:** próbka przechodzi gwintowanie i ruch bez obciążenia, ale pęka przy obciążeniu osiowym odpowiadającym przyjętemu przypadkowi **71 N**.

**Poprawka/test:** traktować 1,5 mm jako odstępstwo wymagające kwalifikacji próbki. P4 musi obejmować gotowy pręt, docelowy materiał i orientację, obciążenie osiowe odniesione do 71 N oraz określone kryterium pęknięcia, poluzowania i trwałego wydłużenia.

**Pewność: wysoka dla wymiarów i braku dowodu; nośność rzeczywistego wydruku niezmierzona.**

**9. WAŻNE — T1 poprawiono logicznie, ale plan B nie mieści się w opisanych piastach powiek**

**Miejsce:** koncepcja §5, §7; `e6model.py:DEF`, `lid_prims()`.

Zaliczam oddzielne progi dla X/Y/G/D oraz jawny przypadek braku przedziału poślizgu przy `M_bezp<0,23 N·m`.

Jednak sprzęgło przewidziane dla wszystkich czterech napędów wymaga:

- pogłębienia **Ø12,5×1 mm**;
- dysku **Ø12×1 mm**.

Piasty ramion PG/PD mają w opisie i modelu **Ø9 mm**. Pogłębienie wystaje poza ich promień o **1,75 mm**. Plan B dla powiek wymaga zmiany geometrii i ponownej kontroli prześwitów. Ponadto momenty po zmianie przegubów nie są przeliczane przez B1.

**Scenariusz porażki:** T1 wskazuje potrzebę sprzęgła G/D, lecz zatwierdzone ramię nie mieści jego stosu.

**Poprawka/test:** zwymiarować warianty sprzęgła osobno dla X/Y i PG/PD, uwzględnić ich bryły w modelu i sprawdzić próbkę poślizgu w wymaganym przedziale.

**Pewność: wysoka.**

**10. Wpływ na części już zbudowane w CAD**

| Część bazowa | Wpływ v3.1 |
|---|---|
| **Rama** | Wymienione zmiany prętów, cokołów i wycięć nie wymagają same w sobie zmiany rury, rantu R152 ani kołnierza R35,2 od z=6. Boki osi są jednak pominięte w modelu, więc ich bezkolizyjności nie potwierdzono. |
| **Gałka** | Szersze wycięcie Y zmienia końcową część, ale może być dodaną operacją na przyjętej bazie. Osobna rozbieżność: model obcina czaszę stożkiem 115°, a CAD ma płaską tylną krawędź z=−12,68. Na R28 granica modelu wypada przy **z=−11,833**, czyli pomija do **0,847 mm** materiału istniejącej podstawy. Model trzeba dopasować do CAD. |
| **Powieka górna** | Cięcie w pasie x=−31…−17 skraca rozpiętość **99,5→96,5°**. Przy nominalnym zamknięciu tylna krawędź zmienia się **91→88°**. To zmiana istniejącej czaszy, możliwa przez dodatkowe cięcie. Mostek R4,5–8 i ucho R6 wymagają dodania do modelu kontrolnego. |
| **Powieka dolna** | W tym samym pasie rozpiętość zmienia się **79→76°**, a tylna krawędź **−90,5→−87,5°**. Również dodatkowe cięcie istniejącej czaszy. Ucha R4 nie są kontrolowane. |
| **Słupek** | Kod ma kieszeń **Ø11,3**, zgodną z podaną bazą: `2·(5,5+0,15)`. Tekst v3.1 podaje **Ø11,6**, czyli zmianę średnicy o 0,3 mm i luzu promieniowego 0,15→0,30 mm. Ta zmiana nie jest spójnie wprowadzona. Kolizja z piastą Y wymaga poprawki interfejsu, lecz nie dowodzi konieczności przebudowy Słupka. |
| **Obejma** | Wymienione zmiany nie narzucają zmiany bazy Obejmy. Jej droga montażowa nie została ponownie potwierdzona tym przemiatanem. |

Cokoły należą do nowych Ramion i Uchwytu; zmiana prętów nie przebudowuje sześciu bazowych części. **Obie powieki wymagają jednak rzeczywistego usunięcia materiału z już istniejących czasz.**

Rozbieżność płaskiej krawędzi Gałki jest **WAŻNA**: model zawiera mniej materiału niż CAD, więc może zawyżać luz pręta do tylnej krawędzi. Poprawka to odwzorowanie płaskiego cięcia w modelu kontrolnym. Pewność geometryczna wysoka; wpływu na konkretne minimum nie przeliczałem.

**11. Pozostałe uwagi z v3 i drobne**

- **W3, montaż Z:** poprawiono naprężenia obu drutów do około **520/750 MPa**, dodano dostęp od boku i próbkę P3b. Plan weryfikacji jest określony; wykonanie montażu pozostaje niepotwierdzone.
- **W4, NVS:** rekord z CRC i dwoma slotami oraz jawne dopuszczenie starej pozycji poprawiają opis. Gwarancja rozruchu nadal nie jest dowiedziona, ponieważ opiera się na niepełnym przemiatananiu i przeczy jej kolizja z punktu 2.
- **W6, B5:** znak poprawiony. `73,63+g−w+2` daje przy g=10, w=15 wymagane **70,63 mm**; zmniejszenie g zmniejsza wymaganą głębokość.
- **DROBNE — zakres:** ±28,03°/±18,05° to przecięcia granicy z osiami. Zapisane `okno.json` zawiera także **ψ=28,083° przy θ=15,148°** oraz **θ=18,183° przy ψ=23,733°**. Nazywanie pierwszych wartości globalnymi maksimami może dać błędne limity Assembly; opisać pełną granicę. Pewność wysoka.
- **DROBNE — kołnierz:** **1,023 mm** jest różnicą promieni przy z=6, nie minimalną odległością przestrzenną do sfery R34,7. Ta wynosi **√(35,2²+6²)−34,7≈1,008 mm**. Nadal przekracza 0,5 mm; poprawić etykietę rachunku. Pewność wysoka.

Nie zmieniałem repo. Nie pozostawiłem uruchomionych procesów obliczeniowych.

**Werdykt: NIE — przed briefem CAD etapu 2 trzeba usunąć kolizję piasty M2 Y ze Słupkiem, uzupełnić geometrię i macierz par, naprawić dolne ograniczenia odległości, ujednolicić okno i czopy oraz poprawić akceptację B1; obecne TAK narzędzia nie potwierdza wiarygodności modelu.**