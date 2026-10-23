**Weryfikacja poprawek koncepcji v3 dużego oka — Astra, 23.10.2026**  
**Zadanie:** E6.1c. Raport do zapisania jako `20-analizy/review/2026-10-23-e6-koncepcja-v3-astra.md`.

**Koncepcja wymaga ponownego przeliczenia ogranicznika i poprawienia modelu kontrolnego przed briefem CAD.** Potwierdziłem poprawę kinematyki i usunięcie starego stosu nakrętki M5 przy serwie Y. Nie potwierdzam natomiast deklaracji „pełny model, minimum 0,52 mm w pracy / 0,31 mm na ogranicznikach”.

Nie oceniałem ponownie przyjętej architektury. Nie czytałem raportu Fable z rundy v3. Skrypty `.py` w repo i wskazanym scratchpadzie są identyczne. Własne rachunki wykonałem bez zapisywania plików: odtworzenie wskazanych minimów, niezależne przecięcia Słupka z płytą, kontrola odległości do powierzchni powieki, IK oraz wariantów B1. Nie wykonałem nowego kompletnego przemiatania wszystkich brył.

**1. Ocena 10 poprawek obowiązkowych**

| # | Poprawka | Ocena i dowód |
|---|---|---|
| 1 | Pręty, gałka i powieki | **Częściowo.** Model ma Ø5, końcówkę Ø9×5 oraz wycięcia 104°/106°/75°. Odtworzyłem wynik 0,314 mm dla końcówki Y, ale funkcja odległości go zawyża i pozycja minimum nie mieści się w dokładniej sprawdzonym zapisanym oknie. Brak spójnego dowodu ≥0,5 mm. |
| 2 | Nakrętka M5 Y i przesunięcie serwa | **Stara przyczyna usunięta.** Nie ma nakrętki od strony serwa; dolna powierzchnia Ramienia Y jest na x≈9,23, korpus S_PG kończy się na x=4, czyli odstęp w x wynosi 5,23 mm. Pozostaje długość pochylonego czopa — W2. |
| 3 | Wspornik w Płycie i montaż | **Częściowo.** Przeniesienie wspornika usuwa wcześniejszą przeszkodę przy wsuwaniu gałki. Dopinanie gotowych Z przez tarczę opisano, ale nie sprawdzono drogi montażowej — W3. |
| 4 | Ogranicznik gałki | **Niezaliczone.** Model próbkowany daje 0,517 mm; rzeczywisty punkt przecięcia walca z granicą płyty ma tylko 0,486 mm. Zapisane okno nie realizuje deklarowanych ±28,2°/±18,2° — K1. |
| 5 | Zakończenia prętów | **Częściowo.** Długości wydruków 16,73/19,22 mm są zgodne. Ø9 wokół M5 daje 2,0 mm materiału, nie 2,4 mm. Pogrubienie przeczy opisowi drukowania całego pręta na jego płaskiej stronie — W2. |
| 6 | Rozruch przez IK | **Matematyka poprawiona, dowód mechaniczny niezamknięty.** Wzór i gałąź potwierdzone; zakres X −30,55…43,54°, Y −20,68…29,86°. Ochrona podczas skoku opiera się jednak na wadliwym modelu okna i niepełnym przemiataniu — W4. |
| 7 | PWM, T1 i plan B | **Częściowo.** Wszystkie trzy elementy opisano liczbowo, wraz z zależnością od E5.5. Progi decyzji po T1 nie zapewniają jednak deklarowanej ochrony wszystkich napędów — W5. |
| 8 | Pełny model, wszystkie pary | **Niezaliczone.** Są obudowy, nakrętki, uszy, wieżyczki i trasy kabli. Brakuje rzeczywistych łuków drutu, części okuć, ograniczników powiek i kompletnego Uchwytu; płyta okna jest pominięta w głównej kontroli — K2. |
| 9 | Pozostałe WAŻNE | **Częściowo.** Poprawiono znak θ, Ø1,6 dla drutu, oznaczenie adaptacji, `zSerw`, stos M5×30 i opis tarczy. Nadal występują sprzeczności geometrii, rozruchu i głębokości. |
| 10 | Pytania blokujące | **Pytania rozszerzone, warunki przyjęcia niezaliczone.** B1 dopuszcza warianty niespełniające luzów; B2 blokuje więcej niż Słupek; B5 ma odwrócony znak korekty — W1/W6. |

**2. KRYTYCZNE**

**K1. Okno powstało z niepełnych przekrojów Słupka; 0,52 mm i zakres mechaniczny nie są potwierdzone**

**Miejsce:** koncepcja §4; `window.py`: `post_pts()`, `slab_pts()`, `window_polar()`; `reach2.py`.

`post_pts()` próbuje powierzchnię Słupka co 2° obwodu i co **0,4661 mm w z**. `slab_pts()` wybiera punkty znajdujące się w grubości płyty. Komentarz zapowiada dodatkowe przecięcia z płaszczyznami brzegowymi, ale kod ich nie dodaje.

Dla zapisanego `okno_-6.npy` otrzymałem:

| Pozycja ψ, θ | Metoda autora | Z dokładnymi przecięciami tworzących walca z granicami płyty |
|---|---:|---:|
| −1°, −15° | +0,5172 mm | **+0,4859 mm** |
| 25°, 15° | +0,5800 mm | +0,5084 mm |
| 28°, 0° | +0,0004 mm | **−0,0326 mm** |
| 0°, 18° | +0,0010 mm | **−0,0641 mm** |
| 28°, 18° | −0,0001 mm | **−0,2469 mm** |
| −25,25°, −18,25° | −0,0029 mm | **−0,1154 mm** |

Ujemna wartość oznacza wyjście przekroju Słupka poza otwór.

Konkretny świadek w **zakresie pracy**, przy ψ=−1°, θ=−15°:

```text
Punkt Słupka w świecie: (0; −7,65; −9,815565)
Ten sam punkt w gałce:  (−0,130913; −9,929788; −7,5)
Punkt brzegu okna:      (−0,135153; −10,415688; −7,5)
Odległość:              0,485918 mm
```

Oba punkty leżą na tylnej granicy płyty. Jest to bezpośredni kontrprzykład dla minimum ≥0,5 mm, niezależny od poszukiwania globalnego minimum.

Dla tego samego wielokąta przy dokładniejszych przekrojach kontakt wychodzi w przybliżeniu przy **ψ=27,87°** dla θ=0 oraz **θ=17,66°** dla ψ=0. Na promieniu prowadzącym do narożnika 28°/18° kontakt wypada około **27,08°/17,41°**.

Dodatkowo CAD ma otrzymać spline przez punkty co 15°, podczas gdy rachunek sprawdza wielokąt o **720 wierzchołkach**. Nie są to z definicji te same powierzchnie.

**Scenariusz porażki:** ogranicznik styka się wcześniej niż przewidziano; rzeczywisty zakres i lokalny zapas zależą od sposobu interpolacji szkicu.

**Poprawka/test:** generować dokładne przekroje skończonego walca przez całą grubość płyty, uwzględnić otwór M4, a następnie sprawdzić dokładnie ten profil, który trafi do CAD. Ponownie wyznaczyć granicę ruchu, pas kontaktu i odległość od otworu M4. Samo powiększenie okna wymaga ponownego przemiatania pozostałych części.

**Pewność:** wysoka dla kontrprzykładów i błędu kodu; podane kąty kontaktu dotyczą zapisanego wielokąta, nie przyszłego spline’u CAD.

**K2. „Pełne przemiatanie” nie obejmuje deklarowanej geometrii, a pole odległości zawyża prześwity**

**Miejsce:** koncepcja §9; `full.py`, `sweep.py`, `sweep_local.py`, `plate2.py`.

| Element | Co rzeczywiście sprawdza kod |
|---|---|
| Pręty i zakończenia | Kapsuły Ø5, Ø9×5, obudowy Ø7/Ø14, nakrętki Ø4,6/Ø9,2. Nazwa `koniec Ø10` jest nieaktualna — promień wynosi 4,5. |
| Zagięcia drutu | Proste odcinki połączone ostrymi narożnikami. `RI=1.2` służy tylko do odsunięcia nóg; **nie tworzy łuków gięcia**. |
| Klatki i serwa | Prostopadłościany korpusów, rozszerzone obwiednie klatek, uszy i walce wieżyczek. Brak kompletnej geometrii mocowań i okuć. |
| Przewody | Kapsuły Ø2, choć dokument podaje płaski kabel **3,6×1,2 mm**. Ø2 nie obejmuje takiego przekroju. |
| Płyta okna | W obu głównych skryptach w miejscu kontroli jest **`pass`**. Osobne wyznaczanie wycięcia prętów nie sprawdza wszystkich par kompletnej płyty. |
| Uchwyt | Kontrolowane są trzy elementy `BOSS`; brak kompletnego zestawu łączników przedniej piasty, żebra i mocowań gałki. |
| Ograniczniki powiek | Zęby i słupki stopu są wyłączone z przemiatania. Ząb na ramieniu jest elementem ruchomym. |
| Wspornik | Kapsuła R2; dokument podaje przekrój 4×4, a tabela części **5×4 mm**. Walec Ø4 nie obejmuje narożników żadnego z tych prostokątów. |

Odległości kapsuła–kapsuła są liczone dla odcinków, ale odległości do czasz i prostopadłościanów nadal korzystają z próbek osi co około **0,3–0,5 mm**. Nie podano granicy błędu.

W `lid_d()` punkt najbliższy tylnej krawędzi powieki jest szukany przy zachowaniu współrzędnej x badanego punktu. Najbliższy punkt powierzchni może mieć inne x. Odtworzyłem następujące różnice:

| Para i pozycja | Wynik funkcji autora | Odległość do znalezionego punktu rzeczywistej powierzchni, dla tej samej kapsuły |
|---|---:|---:|
| Końcówka Y, −25,25°/−18,25°, G na stopie | 0,3142 mm | **≤0,3030 mm** |
| Końcówka Y, 19,5°/−15°, G otwarta z podążaniem | 1,1642 mm | **≤1,1400 mm** |
| Pręt Y, −25°/−8,75°, G otwarta z podążaniem | 1,0931 mm | **≤0,9968 mm** |

To wystarcza do odrzucenia funkcji jako dokładnego pola odległości. Nie dowodzi kolizji rzeczywistej końcówki: kapsuła jest jej uproszczoną, powiększoną obwiednią.

**Scenariusz porażki:** dodatnie minimum zostaje przypisane kompletnemu mechanizmowi, choć pominięty element lub błędna funkcja odległości daje mniejszy prześwit.

**Poprawka/test:** uzupełnić geometrię, stosować rzeczywiste powierzchnie lub udowodnione obwiednie, naprawić odległości i przygotować macierz sprawdzanych par. Powtórzyć obie listy dziesięciu minimów na jednej wersji modelu i jednej granicy ruchu.

**Pewność:** wysoka.

**3. WAŻNE**

**W1. B1 dopuszcza warianty, które nie spełniają wymaganego luzu**

**Miejsce:** §9, §13, B1; geometria `full.py` i `uchwyt.py`.

Przy zachowaniu miejsc serw i kierunków czopów wariantu bazowego:

| Wariant | Para i pozycja | Wynik |
|---|---|---:|
| hM5=4, obudowy Ø14 | M5 X–Y, 25,25°/−18,25° | 0,6009 mm |
| **hM5=5**, obudowy Ø14 | Ta sama para i pozycja | **0,2023 mm** |
| hM5=7, obudowy Ø14 | Ta sama para i pozycja | −0,6264 mm |
| **hM2=3**, obudowa Ø7 | M2 X–ramię piasty, **25°/−15° w pracy** | **0,1429 mm** |
| hM2=3,5 | Ta sama para i pozycja | 0,6105 mm |
| hM2=4 | Ta sama para i pozycja | 1,0780 mm |

Wartości M5 dotyczą deklarowanej granicy autora, którą trzeba poprawić według K1. Kontrprzykład hM2=3 leży wprost w zakresie pracy.

B1 przyjmuje hM2=3–4 i hM5≤5 z obudową Ø14. Te przedziały nie są więc potwierdzonymi przedziałami akceptacji. Również wariant hM5=7/Ø12 ma w samym raporcie autora tylko **0,16 mm**.

Ponadto pozostawiono lukę: model używa obudowy M2 Ø7, a warunek odrzucenia zaczyna się dopiero powyżej Ø7,5. Reguła „zwiększ `pktR` o 0,5 na każde 0,5 nadmiaru” nie gwarantuje zachowania innych luzów.

**Scenariusz porażki:** wynik pomiaru zostaje uznany za dopuszczalny, mimo że odpowiada innemu, niesprawdzonemu mechanizmowi.

**Poprawka/test:** B1 powinno zbierać obecny zestaw pomiarów, ale akceptacja musi wynikać z przeliczenia konkretnego kompletu. Uwzględnić także szerokość obudowy wzdłuż czopa, kołnierz i zapinkę. Wymagać ≥0,5 mm dla par innych niż zamierzony kontakt ogranicznika.

**Pewność:** wysoka dla rachunków modelu; rzeczywiste obudowy pozostają niezmierzone.

**W2. Pochylony czop i pogrubiony pręt mają nowe sprzeczności wykonawcze**

**Miejsce:** §3.2–3.3, tabela części.

Dla płytki grubości 6 mm, czopa Ø5 pochylonego o kąt β i długości gwintu L, jego obwiednia w kierunku grubości zajmuje:

`L·cosβ + 2,5·sinβ`.

Przy L=6 mm wychodzi poza przeciwną powierzchnię Ramienia o około:

- **0,184 mm dla X**;
- **0,490 mm dla Y**.

Warunek „gwint ≤6 mm, nic nie wystaje od strony serwa” jest zatem niewystarczający. Dla płaskich powierzchni graniczne długości wynoszą około **5,82/5,48 mm**, jeszcze bez tolerancji i sprawdzenia kieszeni orczyka. Pochylone gniazdo oporowe może zmienić ten rachunek, ale musi mieć określony kształt.

Dalsze rozbieżności:

- Ø9 z gwintem M5 daje **2,0 mm** ścianki przy zewnętrznym obrysie gwintu; 2,4 mm dotyczy otworu Ø4,2 przed wykonaniem gwintu.
- Końcówka Ø9 wystaje promieniowo o **2 mm poza walec Ø5**, jeszcze przed spłaszczeniem pręta. Nie można położyć całego zespołu na płaskiej stronie Ø5 bez przecięcia stołu przez końcówkę. Wspólne spłaszczenie na tej wysokości przecięłoby otwór M5.

**Scenariusz porażki:** czop wystaje w stronę kieszeni orczyka; pręt nie ma deklarowanej orientacji druku bez podparcia.

**Poprawka/test:** podać przekrój pochylonego gniazda i długość czopa po skróceniu. Zdefiniować wykonalną orientację druku pręta, ewentualne podpory albo zmieniony profil; każdą zmianę obrysu uwzględnić w przemiataniu.

**Pewność:** wysoka dla wskazanego modelu geometrycznego.

**W3. Przeniesienie wspornika poprawia montaż, lecz dopięcie Z nadal wymaga dowodu**

**Miejsce:** §5.1, §8, `tarcza.py`.

Wsuwanie gałki od tyłu ma teraz poprawne uzasadnienie geometryczne: kula R30 mieści się w zamkniętych czaszach o promieniu wewnętrznym 31,2, a wspornik jedzie razem z Płytą.

Nie ma natomiast sprawdzenia ruchu końcówki Z, drutu i szczypiec przez okna **9×17,5 mm** oraz **9×15 mm**. `tarcza.py` wyznacza obwiednie podczas pracy, nie podczas składania.

Naprężenie od odgięcia o 3,6 mm, według użytego uproszczonego wzoru, wynosi:

- około **519 MPa** dla L=49,95 mm;
- około **746 MPa** dla L=41,69 mm.

Podane 520 MPa nie obejmuje dolnego drutu. Obie wartości pozostają poniżej założonych 1500 MPa, ale dopiero przy dostępnej całej długości sprężystej.

**Scenariusz porażki:** gotowe Z nie daje się przeprowadzić przez otwór i płytkę w dostępnej przestrzeni albo drut opiera się wcześniej o sąsiednią część.

**Poprawka/test:** próba montażowa obu rzeczywiście wygiętych drutów przez atrapy tarczy i ramion, z określonym narzędziem; uwzględnić łuki gięcia i skrócenie swobodnej długości przez kontakt.

**Pewność:** wysoka co do braku dowodu; wykonalność fizycznego montażu pozostaje niepotwierdzona.

**W4. Rampa IK jest poprawna, lecz opis NVS i gwarancja rozruchu są zbyt mocne**

**Miejsce:** §6–7; `jump2.py`.

Potwierdziłem wzór IK: różnica względem rozwiązania numerycznego w sprawdzonych punktach wyniosła poniżej **7·10⁻¹⁵ rad**. Odcinek w prostokącie ±25°/±15° pozostaje w tym prostokącie.

To dowodzi toru **zadawanego**, nie identycznego postępu dwóch fizycznych serw. `jump2.py` bada 1000 losowych przejść przy jednakowej prędkości kątowej, po 60 próbek; nie jest dowodem dla dowolnej różnicy postępu. Ochronę ma wtedy zapewniać mechanika, której kontrola pozostaje otwarta w K1/K2.

NVS zapisywane najwyżej raz na 10 s nie musi odpowiadać pozycji po ostatnim zakończonym ruchu. Przykład: zapis przy t=0, nowy ruch zakończony przy t=2, odcięcie przy t=3. Skok może wystąpić mimo zaniku prądu **po ruchu**, więc zdanie „NVS = położenie, nic nie skacze” jest nieprawdziwe bez dodatkowej reguły zapisu.

**Scenariusz porażki:** rozruch dochodzi do ogranicznika lub wraca skokiem do starszej pozycji, choć dokument wyklucza taki przypadek.

**Poprawka/test:** opisać spójny zapis całej pozycji i odtwarzanie ψ/θ z kalibracji; sprawdzić rozruch przy starej NVS oraz nierównym postępie serw. Zakończenie na Słupku potwierdzić dopiero po K1/K2.

**Pewność:** wysoka.

**W5. Reguły T1 i planu B nie domykają ochrony**

**Miejsce:** §7b–c.

Dwa kontrprzykłady:

- Jeżeli T1 zaliczy **0,50 N·m**, reguła przewiduje plan B tylko na X/Y. Tymczasem dokument podaje **0,567 N·m na górnej powiece**.
- Dla dopuszczanego wariantu hM5=7 dokument podaje **0,727 N·m na X**, ale zaliczenie 0,65 N·m ma pozwalać na rezygnację z planu B.

Przy `M_bezp=0,18 N·m` docelowe sprzęgło **0,23–0,30 N·m** także nie może spełnić warunku „poniżej M_bezp”.

Geometria sprzęgła wymaga uzupełnienia: otwór Ramienia Ø7,2 nie zostanie dociśnięty zwykłą podkładką M2 o średnicy zewnętrznej około 5 mm. Trzeba określić większą podkładkę dociskową, stos i rzeczywistą powierzchnię tarcia.

**Scenariusz porażki:** test formalnie dopuszcza konfigurację, której obciążenie przekracza zaliczony moment, albo sprzęgło nie przenosi docisku.

**Poprawka/test:** dobierać ochronę osobno dla każdego napędu i wariantu po B1. Zdefiniować przypadek braku dopuszczalnego przedziału momentu poślizgu. Zwymiarować i sprawdzić próbkę sprzęgła przed uznaniem, że mieści się bez zmiany obrysu.

**Pewność:** wysoka.

**W6. B5 ma poprawną głębokość bazową, ale błędny znak działania zaradczego**

**Miejsce:** §2, §13, B5.

Potwierdziłem tył ramienia G na **z=−73,268 mm**. Przy głębokości środka g=10 mm i grubości ścianki w=15 mm:

`D = 73,268 + g − w = 68,268 mm`.

Wymagane 70 mm zostawia około **1,73 mm rezerwy**, przy założeniu kabli prowadzonych bokiem.

Proponowane `glebokoscSrodka + Δ` **zwiększa** potrzebną głębokość o Δ. Aby ją zmniejszyć, trzeba zmniejszyć g — oko będzie bardziej wystawać — albo przesunąć tylny napęd.

**Scenariusz porażki:** zastosowanie opisanej poprawki pogarsza kolizję z wnętrzem dyni.

**Poprawka/test:** B5 musi zawierać także grubość ścianki i położenie środka; przyjąć warunek `wolne ≥73,268+g−w+rezerwa`. Poprawić znak, a zmianę położenia oka lub S_PG ponownie sprawdzić geometrycznie.

**Pewność:** wysoka.

**4. Czy minima 0,52 / 0,31 mm są prawdziwe?**

**Jako globalne minima kompletnego mechanizmu — niepotwierdzone.**

- **0,52 mm:** odtworzyłem 0,5172 mm w modelu próbkowanym; wskazałem rzeczywisty punkt z odległością **0,4859 mm**.
- **0,31 mm:** odtworzyłem 0,3142 mm funkcji autora; dla tej samej kapsuły znalazłem punkt powierzchni dający **≤0,3030 mm**.
- Pozycja tego minimum przenika już zapisane okno przy dokładniejszej kontroli, więc tabela łączy niespójne modele osiągalności i kolizji.
- Po przesunięciu do przybliżonej rzeczywistej granicy zapisanego okna nadal otrzymałem w uproszczonym modelu około **0,414 mm** dla końcówki Y–powieka G oraz **0,481 mm** dla M2 X–ramię piasty.

Żadna z tych dwóch par nie jest zamierzonym stykiem ogranicznika. Wymaganie ≥0,5 mm pozostaje niespełnione przez model kontrolny. Nie utożsamiam tego z dowodem kolizji rzeczywistych części: trzeba zastąpić uproszczenia poprawną geometrią.

**5. Pytania blokujące i możliwość rozpoczęcia CAD**

| Pytanie | Ocena | Co rzeczywiście blokuje |
|---|---|---|
| **B1** | Zestaw pytań znacznie poprawiony. Przedziały akceptacji wymagają ponownego rachunku — W1. | Pręty, Ramiona X/Y, Uchwyt, wycięcia gałki i górnej powieki; ewentualnie rozmieszczenie serw. |
| **B2** | Pytanie o orientację M4 zasadne. Zapas 1,3 mm wymaga potwierdzenia na poprawionym modelu otworu i kontaktu. | Przy zmianie kolejności osi: nie tylko Słupek, lecz także IK, okno, trasy prętów, wycięcia i przemiatanie. |
| **B4** | Domyślne M2,5 oraz alternatywa M2 są rozsądne warunkowo. „Przechodzi luźno” musi być sprawdzone; nominalne Ø2,5/śruba M2,5 nie określa luzu. | Klatki, bloki pod uszy, kieszenie nakrętek, trasy kabli i sąsiednie prześwity. |
| **B5** | 70 mm jest uzasadnione tylko dla g=10, w=15 i założonej trasy kabli. Znak korekty jest błędny — W6. | Płytę; przy zmianie S_PG także ramię i drut G, jego zaczep, ograniczniki i okna montażowe. |

**Przed odpowiedziami można rozpocząć parametryczny szkielet CAD:** osie, bazową sferę gałki R28–30, bazowe czasze powiek R31,2–33,4 oraz podstawowy obrys Ramy Ø79,5 z rantem Ø84.

Nie można jeszcze uznać kompletnych części za wolne od ryzyka przeróbki:

- **Gałka:** wycięcia i mocowania zależą od B1/B2.
- **Powieka górna:** wycięcie zależy od pręta Y; zaczep i napęd mogą zmienić się po B5.
- **Powieka dolna:** bazowa czasza jest mniej zależna od pomiarów, ale mostki, ucha i rzeczywiste Z nie mają pełnej kontroli.
- **Rama:** można budować podstawową rurę i rant; nie zamrażać wewnętrznych uch ani interfejsów z Płytą przed zamknięciem geometrii i montażu.

**6. DROBNE — spójność materiału wykonawczego**

**Miejsce:** §9–11 i załącznik B.

- Dokument wymienia zakres obrotu G do 56,25°, skrypt używa **56,75°**, zgodnie z przednią krawędzią 47,75°. Ujednolicić odniesienia kątów.
- `full.py` używa Słupka z=−41…−5, a model okna i opis z=−33…−5,5.
- V3 deklaruje samowystarczalność, ale odsyła do v2 po pozostałe zmienne, szczegóły Obejmy i B6–B8.
- Repo nie zawiera `refine_pts.json`, potrzebnego do `sweep_local.py`; nie znalazłem generatora tego pliku. README nie podaje też kompletnej kolejności odtworzenia danych pośrednich.

**Scenariusz porażki:** wykonawca odtwarza inny wariant albo nie może powtórzyć zagęszczenia minimów.

**Poprawka/test:** jeden zestaw parametrów, jawna lista zależności i polecenie odtwarzające wyniki bez scratchpada.

**Pewność:** wysoka.

Nie zmieniłem plików i nie pozostawiłem uruchomionych procesów w tle.

**Werdykt: NIE — przed briefem CAD trzeba przeliczyć rzeczywisty profil i zakres ogranicznika, uzupełnić oraz poprawić model odległości i przemiatania, a następnie wykazać wymagane luzy dla zmierzonych przegubów; przyjęta architektura pozostaje bez zmian.**