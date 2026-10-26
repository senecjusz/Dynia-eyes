# Review Astra: zgodność dużego oka v3 z założeniami

26.10.2026. Zadanie: niezależna recenzja według `2026-10-26-zgodnosc-v3-brief.md`. Baza: `ca3b376f6b2a9f15fd02998507b49b97f010da6e`.

**Wynik: model realizuje zasadnicze korekty PM, ale nie nadaje się obecnie do wydruku testowego całego modułu. Korpusy dwóch serw przecinają się, a instrukcja nie zapewnia wymaganego dostępu narzędzia.** Nie proponuję dodatkowych części, przegubów ani funkcji.

## 1. Zakres i dowody

Przeczytałem brief, PRD (§4 i §9 oraz powiązane wymagania), decyzje z 26.10, sześć ustaleń briefu koncepcji, koncepcję, decyzję PM, SCAD, instrukcję montażu, wynik i kod przemiatania oraz pomiary MG90S/kardana. Referencję sprawdziłem w podanym głównym katalogu `00-inbox/face-maker101/`, także odczytując STL. Nie czytałem raportów `*-opus.md`.

Wymiary części drukowanych pochodzą z bezpośredniego odczytu wierzchołków i trójkątów ZIP/XML 3MF oraz operacji SCAD. Pomiary lokalnych odległości wykonałem niezależnie w Pythonie/NumPy: odległość punkt–trójkąt, z uwzględnieniem wnętrza ściany i jej krawędzi. Korzystałem z istniejącej funkcji kinematyki do obrotów i końców drutów; nie jest to niezależna walidacja fizycznego modelu zagięcia „Z”.

Nie powtórzyłem całego przemiatania. Próba pomiaru w Blenderze zakończyła się limitem 110 s bez wyniku; zastąpiłem ją pomiarami NumPy. W szczególności nie przedstawiam istniejącego wyniku „0 z 83” jako własnego pełnego sprawdzenia. SCAD, siatki i skrypty pomiarowe stanowiące podstawę review nie mają lokalnych zmian względem wskazanego commita. Zastane zmiany skryptów renderowania nie były podstawą oceny.

Oznaczenia w dalszym tekście: **SCAD** = `40-cad/openscad/duze-oko-v3.scad`; **montaż** = `40-cad/openscad/duze-oko-v3-montaz.md`; **przemiatanie** = `40-cad/narzedzia/duze-oko-v3-przemiatanie.py`.

## 2. Zgodność z decyzją PM, punkt po punkcie

„ZGODNE” dotyczy konkretnego wymagania z danego wiersza, nie oznacza przyjęcia całego modułu. Przy dowodzie obejmującym tylko uproszczony drut zaznaczam ograniczenie.

| Punkt | Werdykt | Dowód |
|---|---|---|
| Płyta pozioma za tubą | **ZGODNE** | SCAD 49–64, 201–209: płyta x ±42, y −20…−15, z −97…−49. Oś oka z jest równoległa do płyty. Kołnierz tuby 50 kończy się z tyłu na −47: odstęp 2 mm. Słupki i ramiona są integralne. |
| Zaczepy powiek ok. 34 / 31–32 przy x ≈ 0 | **ZGODNE** | SCAD 42–45, 151: środki otworów `(5; sqrt(34²−1,6²); 1,6)` i `(−5; −sqrt(31,5²−1,6²); 1,6)`. Odległości od osi zawiasu x dokładnie 34 i 31,5. Przesunięcie ±5 jest lokalne, nie wraca do ±14/18 z odrzuconej koncepcji; uzasadnienie odsunięcia górnego drutu w §3. |
| Klej zamiast 2 × M3 mocujących moduł | **ZGODNE** | SCAD nie zawiera uszu ani gniazd tych śrub; montaż krok 10 przewiduje klej na gorąco w szczelinie słupek–tuba. Brak dodatkowych M3 w wykazie części. |
| Trzy rzeczywiste tuby 30 / 40 / 50 | **ZGODNE** | SCAD 224–236; w 3MF wysokości 33 / 43 / 53, w tym 3 mm kołnierza. Odcinek od powierzchni kołnierza dotykającej dyni do rantu ma 30 / 40 / 50. Nie jest to wspólna tuba 54 z przesuwanym kołnierzem. |
| Jedna centralna piasta, bez trzech żeber | **ZGODNE** | SCAD 117–120: walec Ø14 od z=14 do wewnętrznego przedniego bieguna. Brak trzech żeber; pozostają dwa zatwierdzone języczki napędu. |
| Słupki o zewnętrznym profilu R37,2 | **ZGODNE** | SCAD 183–185 przycina ramię walcem. Pomiar 3MF przy przednim końcu: Rmax=37,200002. Tuba R38,15, z uwzględnieniem jej 240-boku luz ok. 0,947 mm, zgodny z zaakceptowanym ok. 1 mm. |
| Usunięcie kolizji pręta L–P z krawędzią czaszy | **ZGODNE dla odcinka użytego w obliczeniach** | Krawędź przesunięta z −15 na −12. Na 3MF przy ψ=+35°, θ=−25° odległość od powierzchni drutu Ø1 do gałki wynosi 1,254 mm w punkcie 6 mm od zaczepu, zgodnie z lokalnym minimum raportu 1,25. Pręt G–D przy ψ=−20°, θ=+25°: 2,151 mm. Zagięcia „Z” i pierwsze 6 mm nie są tym dowodem objęte (§5). |
| Montaż wkrętu M4 tylnej piasty | **ZGODNE** | Montaż krok 3: dokręcenie na słupku przed założeniem gałki. Oś wkrętu z≈−9,1, podejście od +y. Słupek kończy się na z=−14,25, boczne ramiona są na x≈±35, serwa za z≈−54. Nie trzeba przechylać gałki o 70–90°. |
| Prawidłowe światło otworu tylnego | **NIEZGODNE w opisie; poprawiona geometria** | Dla obecnej krawędzi z=−12 otwór samej sferycznej ścianki R28 ma ok. Ø50,57; stara wartość Ø47,3 dotyczyła z=−15. Jednak podparcia języczków dochodzą w płaszczyźnie otworu do x=25 lub y=25: wspólny wolny okrąg ma **Ø50,0**, nie deklarowane wszędzie Ø50,6. Droga imbusa po stronie −x nie trafia w te podpory. **DROBNE.** |
| Otwory osi powiek co najmniej Ø2,4; ustalenie drutu w słupku | **NIEZGODNE na siatce / nominalnie poprawione** | SCAD: Ø2,4 w uszach, Ø1,9 w słupku; instrukcja wymaga wcisku i CA. W obu 3MF otwory uszu są 19-bokiem wpisanym w Ø2,4: najmniejsze światło **Ø2,367264**, luz promieniowy dla Ø2 tylko **0,183632**, poniżej 0,2. W słupku 15-bok daje Ø1,858477: wcisk promieniowy ok. 0,071 zamiast nominalnego 0,05. **DROBNE**, lecz warunek „co najmniej” nie jest spełniony. |
| Sprawdzenie drutu dolnej powieki przy gałce | **ZGODNE dla uproszczonego odcinka** | Własny pomiar na 3MF przy ψ=−25°, θ=+10°, zamkniętej dolnej powiece: **1,3105 mm** po odjęciu promienia drutu, punkt około `(−5; −31,400; −0,948)`. Potwierdza 1,31, nie dawne 2,6. Brak rzeczywistego „Z” pozostaje ograniczeniem. |
| Łeb M5 i szczelina na klej | **ZGODNE jako wskazana specyfikacja** | Montaż podaje M5×8 ISO 4762, Ø8,5×5; SCAD gniazdo Ø9,5×5,2, nominalnie 0,5 promieniowo i 0,2 na głębokości. Rzeczywisty łeb użytkownika pozostaje niezmierzony i tak został oznaczony w instrukcji. |
| Przemiatanie narożników L–P/G–D na siatkach | **ZGODNE co do obecności narożników** | Pętla `product(range(−35,36,5),range(−25,26,5))` obejmuje 165 ustawień i wszystkie cztery narożniki. Obie powieki i cztery druty są uwzględnione. **Nie jest to wystarczający dowód bezkolizyjności całego modułu** — §5. |
| Źrenica Ø20 i wysunięcie 24 jako założenia | **ZGODNE** | SCAD 31–32 i montaż oznaczają [Z], P4/P5. Nie traktuję ich jako uzyskanej akceptacji użytkownika. |

## 3. Elementy nowe i ich konieczność

Punktem odniesienia są łącznie referencja, koncepcja i decyzja PM. Nie nazywam nowym odstępstwem rzeczy, które PM już dopuścił: dwóch M5, kardana 5/5, dwóch powiek, ich przedłużeń, dwóch osi Ø2, języczków gałki, tub, kołnierzy i maskownicy. Nie doszła nowa śruba ani dodatkowy przegub.

| Nowa geometria / element wykonania | Ocena | Uzasadnienie liczbowe i granica oceny |
|---|---|---|
| Płyta z ramionami do przodu i trzema integralnymi podporami | **NIEZBĘDNE; bezpośrednio wymagane przez PM** | Płyta y=−20…−15, oś zawiasu y=0, słupki x=34,7…37,2. Ramiona łączą z płytą odległą do z=−49. Nie są osobnymi ramkami ani dodatkowymi częściami. |
| Przestawienie serw względem pionowej koncepcji i ułożenie trzech na boku | **NIEZBĘDNE jako adaptacja do poziomej płyty; konkretne pozycje wadliwe** | Stare środki wałków powiek y=+46/−46 nie odpowiadają nowej płycie z wierzchem y=−15. Nowe korpusy trzech serw opierają się na y=−15. Sama zmiana jest uzasadniona; ułożenie L–P/PG przecina korpusy na 143,44 mm³ (§6 K1). Nie zatwierdzam go jako działającego. |
| Szczeliny na dolne uszy serw, gniazdo L–P na wylot | **NIEZBĘDNE** | Ucho ma nominalnie 2×12,5, szczelina 2,4×12,9. Korpus L–P przechodzi przez y=−20…−15; potrzebuje okna 12,9×23,2. To wykonanie gniazd na klej, nie dodatkowe mocowanie. |
| Wnęki 1 mm pod wieżyczkami serw powiek | **NIEZBĘDNE** | Oś wieżyczki y=−9,5, R=5,9, zatem dół y=−15,4: bez wnęki wnika w płytę o 0,4. Dno wnęki −16 daje 0,6 luzu. |
| Szczelina 8×37 w płycie pod dolnym orczykiem | **NIEZBĘDNE** | Oś orczyka y=−9,5; przy zamknięciu koniec ramienia 25 jest na y≈−29,98 i z≈−61,66, przecina poziom płyty −20…−15. Bez szczeliny ruch jest niemożliwy. |
| Przesunięcie zaczepów w okolice x=±5 | **NIEZBĘDNE jako rozdzielenie torów w tym układzie** | Dla górnego drutu przy ψ=−35°, θ=+25°, g=51,5° dokładna odległość odcinek–odcinek minus promienie 0,5+2,5 daje 2,217 mm do orczyka G–D. Przeniesienie samego toru drutu na x=0 daje **−1,511 mm**, czyli kolizję. Nie dowodzi to jedyności współrzędnej −5 dolnego zaczepu; ±5 mieści się w przyjętym lokalnym przybliżeniu x≈0. |
| Podniesienie otworu uszka do z=1,6 i tylne wycięcia szerokości 8 w obu powiekach | **NIEZBĘDNE** | Przy zamknięciu drut przecina płaszczyznę z=0 w promieniu od środka kuli 33,934 dla górnej i 31,817 dla dolnej. Są to wnętrza ścianek odpowiednio R33,2…34,4 i R31…32,2. Bez lokalnego wycięcia droga drutu przecina powiekę. Wycięcia pozostają za frontem czaszy. |
| Boczne wybrania R4,6 w górnej powiece pod uszy dolnej | **NIEZBĘDNE** | Narożnik dolnego ucha `(33;3;−3)` ma R=33,2716, przekracza R33,2 wewnętrznej powierzchni górnej powieki. Bez wybrania powstaje nakładanie materiału mimo nominalnego luzu między samymi uszami. |
| Skrócenie czaszy z z=−15 do −12, zaczep gałki z −4 do −4,5 | **NIEZBĘDNE jako korekta wymaganej drogi prętów** | Wymagana przez PM poprawka kolizji; obecna geometria daje lokalne luzy 1,254 i 2,151 mm. Głębokość ok. 113,58° mieści się w dopuszczonym cofnięciu do płytszej czaszy, jeżeli zaczepy się nie mieszczą. Nie żądam powrotu do −15. |
| Otwór Ø7 w przedłużeniu i materiał do promienia 28 przy zaczepie 25 | **NIEZBĘDNE** | Ø7 pozostawia dostęp do piasty i wkrętu fabrycznego orczyka; za środkiem otworu Ø1,3 przy r=25 zostaje 28−25−0,65=2,35 mm materiału. To geometria wymaganej listwy, nie nowa funkcja. |
| **Po dwa kołki Ø1 na przedłużenie**, z otworami Ø1,2 przy 5,5 i 17,5 | **NADMIAROWE w udokumentowanym zakresie** | Dochodzą cztery odcinki drutu, których nie ma w liście części koncepcji ani decyzji PM. Instrukcja wymienia tylko ustalanie położenia; przy już przewidzianym klejeniu CA nie podaje wymuszonej kolizją lub pasowaniem potrzeby dwóch stałych kołków na listwę. Nie wykazano geometrycznej niezbędności. Otwory i kołki nie są potrzebne do ruchu o promieniu 25. |
| Łapy kołnierza na 45/135/225/315° | **Nie jest nowym odstępstwem wymagającym dodatku** | Cztery łapy i wkręty wynikają z PRD; obrys pozostaje 92×92, bez zwiększenia liczby części lub mocowań. Kąt jest szczegółem rozmieszczenia. |

Nie wykazałem konieczności każdej dokładnej współrzędnej serwa lub każdego milimetra wycięcia. Powyższe uzasadnia ich funkcję geometryczną, nie udziela zgody na obecne kolidujące rozmieszczenie.

## 4. Montaż rękami, krok po kroku

Ocena dotyczy kolejności z instrukcji. Nie mylę luzu łożyskowania 0,2–0,3 z drogą palców; wymaganie PRD o braku montażu „na milimetr” dotyczy dostępu i przechodzenia części obok siebie.

| Krok | Ocena | Dostęp i przeszkoda |
|---|---|---|
| 1. Wklejenie M5 | **WYKONALNE geometrycznie** | Tylne wejście gałki co najmniej Ø50,0, łeb Ø8,5, piasta osiągalna przez otwór; pęseta wskazana w instrukcji. Słupek otwarty przed składaniem. |
| 2. Trzy serwa na płycie | **WYKONALNE dla ich korpusów osobno; nie dowodzi kompletnego montażu** | Bez L–P korpusy GD i PD mają 3,5 mm przerwy w z. Szczeliny dolnych uszu są dostępne z góry. Wieżyczki powiek mają ok. 0,6 nad dnami wnęk. To już lokalnie ciasne pasowanie, ale dostępne z góry. |
| 3. Kardan na słupek | **WYKONALNE** | Tylna śruba dokręcana bez gałki. Usunięto wcześniejszy niewykonalny manewr. |
| 4. Gałka i przedni M4 | **WYKONALNE dla podanej drogi klucza L** | Klucz AF2 o promieniu obwiedni 1,155 na x=−18 przechodzi po wolnej stronie otworu; przy tylnej sferycznej krawędzi nominalny zapas do niej ok. 6,14 mm. Piasta jest na osi, języczki po +x/+y, ramię zawiasu przy −35. Wymiary krótkiego ramienia rzeczywistego klucza nie są podane, więc nie potwierdzam dowolnego klucza AF2. |
| 5. Pręt G–D i orczyk | **WYKONALNE według opisanej drogi** | Wkrętak idzie po osi x, przy y=2,3 i z=−60; L–P jeszcze nie ma. Gałka kończy się przy −12, najbliższy przód korpusu GD −53,75: przestrzeń za gałką ok. 41,75 mm. Brak pełnej symulacji wkładania „Z”, ale nie wykazałem blokady dostępu. |
| 6. Włożenie L–P | **NIEWYKONALNE** | Docelowy korpus L–P przecina już wklejone serwo górnej powieki: wspólna bryła 12,5×4,5×2,55. Zmiana kolejności nie usuwa przecinania w pozycji końcowej. |
| 7. Powieki i osie | **WYKONALNE nominalnie; pasowanie wymaga korekty siatki** | Dostęp od przodu i z boków przed tubą. Ucho–ucho 0,2; ucho–słupek 0,3. Oś długości 5,6 od x=37,2 kończy się na 31,6, przechodzi oba uszy. Rzeczywiste otwory i wcisk inne niż nominalne — §2. |
| 8. Druty i orczyki powiek | **NIE POTWIERDZAM; dostęp dolnego nie spełnia PRD** | Oś wkrętaka dolnej powieki to y=−9,5, z=−76, podejście od +x. Przecina obszar x=25,25…37,75 nad korpusem L–P, którego góra jest na y=−10,5. Od osi narzędzia do korpusu tylko **1,0 mm**: trzon Ø2 jest styczny, Ø3 wnika o 0,5. PH1 nie ma w instrukcji określonej tak małej obwiedni. To dodatkowe miejsce „na milimetr”, poza zgodą na tubę. |
| 9. Test | **ZABLOKOWANY** | Bez wykonania kroku 6 nie ma kompletnego modułu do testu czterech napędów. |
| 10. Tuba w dyni i wklejenie modułu | **ZGODNE z zasadą montażu, warunkowo wykonalne po usunięciu wcześniejszych blokad** | Słupki mieszczą się z zaakceptowanym luzem ok. 0,947. Przy tubie 50 koniec kołnierza −47 jest 2 mm przed płytą −49; dysza kleju musi dochodzić z boku do tylnego brzegu tuby, a nie między płytą a kołnierzem. Nie znam obwiedni dyszy ani otworu wieczka rzeczywistej dyni; brak dowodu pełnego dostępu palców/narzędzia w dyni. Nie uznaję tego za wykazaną dodatkową kolizję. |

## 5. Wystarczalność przemiatania

**Narożniki, obie powieki i druty są obecne, ale wynik nie wystarcza do stwierdzenia „wszystkie pary ruchome i nieruchome sprawdzone”.**

1. **Brak par nieruchoma–nieruchoma.** Lista `STALE` zawiera cztery serwa, ale kod nie porównuje ich między sobą. Z tego powodu rzeczywista kolizja nominalnych korpusów L–P/PG nie trafia do 83 wyników. Nie są to zamierzone styki serwo–płyta.
2. **Niepełna geometria drutów.** `Kin.stan()` zwraca pojedynczy odcinek od środka otworu do środka otworu. Nie ma odsadzenia 1,75, poprzecznego odcinka ani końca „Z”. Przemiatanie dodatkowo wyłącza kulę R6 wokół własnego zaczepu (linie 153–154 i 194), czyli znacznie więcej niż sam styk Ø1 w otworze Ø1,3. Nie można tym dowodzić luzu fizycznego zakończenia drutu i swobody jego przekoszenia w narożnikach.
3. **Powieki próbkowane rzadziej niż może sugerować opis.** Wobec obracającej się gałki/drutów: 0/17/34/51,5°, niezależnie obie powieki, 16 par. Wobec siebie i części stałych: siedem wartości, 49 par. Sama para gałka–powieka jest liczona tylko dla dziewięciu kombinacji ψ∈{−35,0,35}, θ∈{−25,0,25}, nie wszystkich 165 (linia 171). Współśrodkowość idealnych sfer nie dowodzi zachowania lokalnych uszek i wycięć pomiędzy próbkami.
4. **Brak pełnych obwiedni części posiadanych.** Serwa mają korpusy i wieżyczki, lecz brak uszu i kabli. Kardan jest dwiema połówkami walca, bez rzeczywistej geometrii widełek i wkrętów. Orczyki są odcinkami z promieniem 2,5; drukowane przedłużenie ma lokalnie szerokość 6 i podstawę Ø10. Taka kapsuła nie jest pełną obwiednią eksportu.
5. **Ograniczona dokładność odległości.** Luz siatka–siatka to minimum wierzchołek–powierzchnia, bez pełnego minimum krawędź–krawędź; odcinek–odcinek próbkowany po 41 punktów. Dla drutu długości 82,5 daje to krok ok. 2,06 mm, bez oszacowania błędu. Własne ścisłe minimum DrutG–OrczykGD wynosi 2,217, wynik zapisany 2,23; tu różnica nie zmienia oceny, ale sama metoda nie daje gwarancji przy progu 0,5.
6. **Sprawdzono tylko tubę 50.** Dłuższy cylinder zawiera krótsze odcinki, lecz kołnierze tub 30 i 40 znajdują się w innych płaszczyznach. Ich pominięcie wymaga osobnego argumentu lub kontroli. Z obecnych wymiarów nie wykazałem kolizji krótszych tub; nie przedstawiam pominięcia jako znalezionej kolizji.

Korekta kontroli ma objąć istniejącą geometrię i montaż, nie wymaga dobudowy mechanizmu. Pełne potwierdzenie zakresu PRD pozostaje otwarte do usunięcia kolizji i weryfikacji rzeczywistych drutów.

## 6. Uwagi według wagi

### KRYTYCZNE

**K1. Korpusy L–P i serwa górnej powieki zajmują tę samą przestrzeń.**

- Miejsce: SCAD 67–73, 164–171; obwiednie korpusów w przemiatanie 74–79; montaż kroki 2 i 6.
- Dowód w układzie złożenia: L–P `x=[25,25;37,75], y=[−33;−10,5], z=[−83,3;−60,5]`; PG `x=[15,5;38], y=[−15;7,8], z=[−93,25;−80,75]`. Część wspólna `x=[25,25;37,75], y=[−15;−10,5], z=[−83,3;−80,75]`, objętość **143,4375 mm³**. Wynika także z położeń gniazd SCAD i wymiarów MG90S, a nie tylko z raportu przemiatania.
- Scenariusz: serwo L–P zatrzymuje się na wcześniej wklejonym PG; oba nie zajmą pozycji końcowych. Sama kolejność nie pomoże.
- Wymagana poprawka/test: usunąć nakładanie przez korektę istniejącego rozmieszczenia i sprawdzić wszystkie cztery korpusy, uszy oraz drogi montażu. Nie dodawać części.
- Pewność: **wysoka dla przyjętych wymiarów producenta**. Nawet przy długości korpusu L–P 22 zamiast 22,8 nakładanie w z pozostaje 1,75 mm przy pozostałych wymiarach bez zmian.

### WAŻNE

**W1. Dolny orczyk: brak wymaganej drogi wkrętaka po prostej.**

- Miejsce: montaż krok 8, oś `(x;−9,5;−76)`; korpus L–P z K1.
- Scenariusz: trzon o średnicy ponad 2 mm ociera lub koliduje z L–P. Ø3 oznacza wniknięcie 0,5. Nawet Ø2 nie daje luzu. Jest to montaż „na milimetr” poza zaakceptowaną szczeliną tuby.
- Poprawka/test: po usunięciu K1 sprawdzić rzeczywistą obwiednię PH1 i opisać wykonalną kolejność, ewentualnie montaż tego orczyka przed zasłonięciem drogi. Nie zakładać smukłości narzędzia bez wymiaru.
- Pewność: **wysoka dla ograniczenia Ø2; warunkowa dla konkretnego niezmierzonego PH1**.

**W2. Niepodparte końce obu języczków gałki przy zalecanym druku.**

- Miejsce: SCAD 26, 30, 100–104; montaż tabela druku — „podpora drzewiasta tylko pod piastą”.
- Dowód: języczek zaczyna się na r=12,8; podparcie 45° dochodzi tylko do r=20 na poziomie z=−7. Pozostaje **7,2 mm poziomego wysięgu**, grubość w poprzek 2,5, zaczynającego się 5 mm nad stołem. W 3MF poziome dolne powierzchnie obu końców mają łącznie **36,000005 mm² = 2×7,2×2,5**. To nie jest mostek podparty na obu końcach. Piasta zaczyna się dopiero przy z=14, nie podtrzymuje tych końców.
- Scenariusz: początek języczka z otworem drutu powstaje nad pustką, mimo deklaracji samopodparcia 45°.
- Poprawka/test: uwzględnić podpory także pod tymi istniejącymi końcami w instrukcji i sprawdzić warstwy w slicerze. To korekta przygotowania druku, bez nowej części mechanizmu.
- Pewność: **wysoka dla geometrii**, jakość rzeczywistego zwisu wymaga wydruku.

**W3. Dowód bezkolizyjności jest niepełny.**

- Miejsce: przemiatanie, zwłaszcza linie 82, 142–209; montaż 119–122.
- Scenariusz: „0 z 83” zostaje odczytane jako zgoda na montaż, mimo pominięcia par serwo–serwo i zakończeń drutów. K1 jest konkretnym kontrprzykładem, nie hipotetycznym ryzykiem.
- Poprawka/test: uzupełnić kontrolę istniejących części, usunąć bezwarunkową deklarację pełnego sprawdzenia; opisać próbkowanie i pominięcia. Weryfikować narożniki z geometrią „Z” lub fizyczną próbą po usunięciu blokad.
- Pewność: **wysoka**.

**W4. Cztery dodatkowe kołki przedłużeń nie mają wykazanej niezbędności.**

- Miejsce: SCAD 213–218, montaż krok 8; brak w wykazie czterech odcinków drutu napędu.
- Scenariusz: kolejny nieuzgodniony element montażu, mimo klejonego przedłużenia i zasady „bez dodatków”.
- Poprawka/test: usunąć obowiązek dodatkowych kołków albo wykazać konieczność w już istniejącym połączeniu i uzyskać decyzję według PRD §9. Nie proponuję dodatkowego mocowania.
- Pewność: **wysoka co do nowości i braku uzasadnienia; nie oceniałem wytrzymałości klejenia**.

### DROBNE

**D1. Nominalne Ø2,4 nie daje minimalnego Ø2,4 w 3MF.** Różnica 0,032736 mm, luz 0,183632 na stronę. Słupek ma minimalne Ø1,858477. Poprawić odwzorowanie otworów lub nominalny wymiar i ponownie zmierzyć; próba pasowania pozostaje zasadna. Pewność wysoka.

**D2. Światło tylne opisano bez lokalnych podpór języczków.** Wspólny wolny okrąg Ø50,0; sama czasza około Ø50,57. Poprawić opis, bez konieczności zmiany kształtu z tego powodu. Pewność wysoka.

## 7. Druk i kontrola siatek

Pomiar poniżej jest w orientacji zapisanej w indywidualnych 3MF. Wszystkie mają najniższe z=0 i rzeczywiste płaskie powierzchnie kontaktu ze stołem.

| Część | Obwiednia z 3MF [mm] | ≤180 / płaska podstawa / nawisy |
|---|---|---|
| Płyta | 84×101×25,999 | **ZGODNE**: spód płyty; podpory ramion i słupka wyraźnie opisane. |
| Gałka | 59,979×59,979×41,990 | **NIEZGODNE w przygotowaniu podpór**: tylny pierścień na stole, piasta ma podporę; dwa końce języczków pozostają niepodparte (W2). Szczyt czaszy wymieniony w instrukcji jako próba. |
| Powieka górna | 68,8×38,600×37,388 | **ZGODNE z warunkiem opisanych podpór**: tylna krawędź/ucha, mostek 8, podpory kopułki wskazane jako możliwe. Sferyczny szczyt nie spełnia sam przez się limitu 45°. |
| Powieka dolna | 66×36,100×35,189 | **ZGODNE z tym samym warunkiem** co górna. |
| Przedłużenie ×2 | 32,996×9,998×2,5 | **ZGODNE**: płasko, otwory pionowo. |
| Tuba 30 | 92×92×33 | **ZGODNE**: kołnierz na stole, pionowe ścianki. |
| Tuba 40 | 92×92×43 | **ZGODNE**. |
| Tuba 50 | 92×92×53 | **ZGODNE**. |
| Maskownica | 84×84×2 | **ZGODNE**: płaski pierścień. |

Uruchomiłem `sprawdz_siatki.js` na wszystkich dziewięciu indywidualnych 3MF i zbiorczym: **0 otwartych krawędzi, 0 krawędzi z więcej niż dwoma trójkątami, 0 zdegenerowanych trójkątów**. `skladowe_siatki.js`: po jednej bryle na plik części, dziewięć w zbiorczym. Zbiorczy ma 52 962 trójkąty. To kontrola poprawności siatki, nie poprawności montażu.

Plik zbiorczy jest układem obiektów około 232,78×399 mm, nie gotowym rozmieszczeniem na stole 180×180. Indywidualne części spełniają ograniczenie drukarki; zbiorczy trzeba rozłożyć na płyty. Zawiera jedno przedłużenie opisane „druk x2”, zgodnie z instrukcją trzeba wydrukować dwie sztuki.

## 8. Werdykt

**V3 realizuje główne korekty decyzji PM, lecz nie jest w pełni zgodne z wymaganiami prostego montażu i kontroli oraz nie nadaje się do wydruku testowego całego modułu przed usunięciem kolizji serw, zapewnieniem dostępu wkrętaka i poprawieniem przygotowania podpór.**

Zapisano wyłącznie ten raport; bez commitów, bez zmian modelu i bez odczytu raportu Opusa. Procesy uruchomione do tego review zakończone; żaden nie pozostaje w tle.
