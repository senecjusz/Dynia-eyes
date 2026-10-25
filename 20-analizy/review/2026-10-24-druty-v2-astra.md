**Raport Astra — krytyczne review koncepcji drutów v2, 24.10.2026**  
Docelowa nazwa: `20-analizy/review/2026-10-24-druty-v2-astra.md`. Raport podaję wyłącznie tutaj.

**Wynik:** kierunek „drut gięty iteracyjnie, regulacja na drucie, trzy serwa” jest sensowny, ale przedstawiony łańcuch tolerancji nie gwarantuje działania. Najważniejsze braki dotyczą zakresu V, różnicy długości drutów powiek, rzeczywistej obwiedni Z oraz przyjęcia 2 mm od osi jako wystarczającego miejsca.

**Zakres i dowody.** Przeczytałem koncepcję, SVG, SCAD, parametry, skrypty, poprzednie raporty v1, instrukcję montażu, pomiary E6, PRD i zasady repo. Nie czytałem raportu Opusa tej rundy. Uruchomiłem oba skrypty kinematyczne; niezależnie rozwiązałem kinematykę S1/S2 na siatce co 1° oraz równania domknięcia powiek.

- **Pomiary fizyczne:** brak nowych.
- **Dane geometryczne:** bieżące pliki robocze; HEAD `38a381f` nie obejmuje wszystkich ocenianych materiałów.
- **Obliczenia:** geometria idealna; uproszczona sprężystość stalowego drutu Ø1.
- **Ograniczenia:** nie wykonałem nowego przemiatania siatek zmienionej konstrukcji — tej geometrii jeszcze nie ma. SVG oceniłem z jego ścieżek i opisów, bez renderowania.

### 1. KRYTYCZNE — zakres V nie pokrywa deklarowanych błędów

**Miejsce:** koncepcja §3.2; SVG, panel 3.

Dla dwóch idealnych ramion po 5 mm:

\[
p(\alpha)=10\cos\alpha,\qquad h(\alpha)=5\sin\alpha
\]

| Kąt ramion do osi | Rozstaw końców V | Wysunięcie V | Zmiana długości względem 45° |
|---:|---:|---:|---:|
| 30° | 8,660 mm | 2,500 mm | +1,589 mm |
| 45° | 7,071 mm | 3,536 mm | 0 |
| 60° | 5,000 mm | 4,330 mm | −2,071 mm |

**Obliczenie:** zakres regulacji wynosi **−2,071…+1,589 mm**, łącznie 3,660 mm. Zdanie „pokrywa błąd ±2 mm jednego zagięcia” jest nieprawdziwe po stronie wydłużania.

Jeśli dwa miejsca wyznaczające długość mają niezależnie błąd ±2 mm, odległość między nimi może mieć błąd **±4 mm**. Nie należy sumować bezwarunkowo błędów wszystkich siedmiu zagięć: potrzebne są bazy pomiarowe. Jednak już dwa naroża wystarczają do wykazania niedoboru regulacji.

Dodatkowo nominalne V wykonane pod 35° zamiast 45° wydłuża cięgno o 1,120 mm, a pod 55° skraca o 1,335 mm. Tolerancja kątowa samego V również zużywa zakres poprawki.

**S1/S2:** kalibracja może przejąć część niedoboru. Po maksymalnym wydłużeniu drutu początkowo krótszego o 4 mm zostaje błąd −2,411 mm. Dla tego przypadku niezależny rachunek dał:

| Cięgno | Zero orczyka | Zakres orczyka dla θ ±35°, φ ±25° | Brak rozwiązania na siatce |
|---|---:|---:|---:|
| S1 | +1,90° | −32,68…+52,01° | 0 |
| S2 | +4,64° | −31,38…+57,95° | 0 |

To potwierdza możliwość skompensowania długości **kinematycznie**, bez dowodu zakresu przegubów, kolizji i rzeczywistego zakresu serw. Samo przesunięcie zera nie odtwarza nominalnej charakterystyki ruchu; trzeba ponownie ustalić krańce.

**Powieki:** przy błędach długości obu drutów ±4 mm ich różnica dochodzi do **±8 mm**. V w drugim drucie tego nie pokryje. Nawet użycie obu V daje maksymalną korektę różnicy około ±3,660 mm.

**Scenariusz porażki:** gałkę można wyzerować, lecz jednej powieki nie da się doprowadzić do właściwego położenia w podanym zakresie V.

**Poprawka/test:** traktować V jako regulację końcową. Większy błąd usuwać ponownym uformowaniem naroża Z po przymiarce, zgodnie z dopuszczonym doginaniem. Procedura musi określać, kiedy poprawia się Z, a kiedy V; nie może obiecywać, że wszystko przejmie V.

**Pewność:** wysoka.

### 2. KRYTYCZNE — instrukcja dodaje V dopiero po dopasowaniu długości

**Miejsce:** SVG, panel 4, krok 2; koncepcja §4.

Rysunek każe zaznaczyć i wykonać drugie Z po przyłożeniu prostego korpusu, a następnie zrobić V.

**Obliczenie:** V 45° skróci tak dopasowane cięgno o **2,929 mm**. Po rozgięciu do dopuszczonych 30° nadal będzie ono krótsze od długości dopasowanej o 1,340 mm.

**Scenariusz porażki:** użytkownik wykonuje poprawnie instrukcję, po czym musi odrabiać błąd wprowadzony przez samą kolejność czynności.

**Poprawka:** wykonać nominalne V **przed zaznaczaniem drugiego Z**. Przymierzać drut z gotowym V i pierwszym Z, przy ustalonym położeniu gałki oraz orczyka. Doginanie wykonywać po wyjęciu drutu, z podparciem w narzędziu.

**Pewność:** wysoka.

### 3. WAŻNE — krótkie V jest prawdopodobnie dostatecznie sztywne, ale „siła mała” pozostaje założeniem

**Miejsce:** koncepcja §5.

**Założenie materiałowe:** \(E=200\,000\ \mathrm{N/mm^2}\), reprezentatywne dla stalowego drutu sprężynowego; producent sprężyn podaje dla music wire około 207 GPa. Nie jest to identyfikacja gatunku drutu użytkownika. [Dane materiałowe Suhm Spring Works](https://www.suhm.net/wp-content/uploads/2015/09/Music_Wire-EN-US_v2.html).

Dla Ø1:

\[
I=\frac{\pi d^4}{64}=0{,}04909\ \mathrm{mm^4},\qquad
EI=9817\ \mathrm{N\,mm^2}
\]

Dla idealnego V, siły wzdłuż osi cięgna i małych odkształceń:

\[
\frac{\delta_V}{F}\approx\frac{2l^3\sin^2\alpha}{3EI}
\]

| V | Podatność samego V | Zmiana długości przy 2 N |
|---|---:|---:|
| 45° | 0,00424 mm/N | 0,0085 mm |
| 60° | 0,00637 mm/N | 0,0127 mm |

Przy V 45° naprężenie od momentu \(Fh\) wynosi około **36 MPa na każdy 1 N**, przy 60° około 44 MPa/N. Nie uwzględnia to koncentracji naprężeń i historii plastycznego doginania.

**Wniosek:** przy rzeczywistym obciążeniu 1–2 N samo krótkie V nie wygląda na główne źródło zmiany długości. Luzy połączeń będą znacznie większe.

Dla porównania prosty, przegubowo podparty pręt Ø1 ma eulerowską siłę krytyczną około **55 N przy 42 mm** i **48 N przy 45 mm**. To wartości odniesienia, **nie dowód odporności cięgna z V i Z na wyboczenie**: jest ono początkowo krzywe i obciążane mimośrodowo.

Nie można też zakładać, że serwo zawsze ograniczy siłę do 2 N. Katalogowe 1,8 kgf·cm MG90S odpowiada około 176,5 N·mm, czyli charakterystycznie **23,5 N na ramieniu 7,5 mm**, zanim uwzględni się kąt działania cięgna. To porównanie dla TowerPro, nie pomiar posiadanego Miuzei. [Specyfikacja producenta MG90S](https://torqpro.com/product/mg90s/).

**Scenariusz porażki:** zakleszczenie lub źle ustawiony kraniec obciąża drut wielokrotnie mocniej niż przyjęto; V nie jest zabezpieczeniem przeciążeniowym.

**Poprawka/test:** na gotowym drucie sprawdzić pchanie i ciągnięcie przy znanej sile, na przykład 2 N: zmianę długości pod obciążeniem oraz powrót po odciążeniu. Osobno sprawdzić siłę potrzebną do poruszania powiekami. Nie doginać V z reakcją opartą o wydruk.

Przywołany artykuł RC potwierdza praktykę regulacji, lecz nie sztywność tej konkretnej geometrii. Zaleca również rozpinanie cięgna i poprawianie wszystkich trzech zagięć regulacji. [Flite Test — Adjustable Wire Push Rods](https://www.flitetest.com/articles/adjustable-wire-push-rods).

**Pewność:** wysoka dla rachunku uproszczonego; średnia dla rzeczywistego drutu po wielokrotnym doginaniu.

### 4. KRYTYCZNE — 2 mm od osi nie zapewnia miejsca na odchyłkę ±2 mm

**Miejsce:** koncepcja §3.3.

Dla Ø1 promień drutu wynosi 0,5 mm. Przy nominalnej odległości osi od części równej 2 mm i odchyłce osi o 2 mm drut **wnika w część o 0,5 mm**.

**Obliczenie:**

- brak kontaktu przy przesunięciu osi o 2 mm wymaga co najmniej **2,5 mm od osi**;
- zachowanie dodatkowego luzu powierzchniowego 0,5 mm wymaga **3,0 mm od osi**;
- dwa druty odchylające się niezależnie ku sobie o 2 mm każdy wymagają nominalnego odstępu **powierzchnia–powierzchnia 4,5 mm**, aby zostało 0,5 mm.

`kolizje-v2.txt` podaje odstępy powierzchni brył zastępczych, a koncepcja formułuje cel od osi. Tych wartości nie wolno porównywać bez przeliczenia.

Również ±10° nie oznacza obwiedni ±2 mm: błąd kierunku odcinka 42 mm daje poprzecznie około **7,3 mm**. Ponowne dogięcie może to usunąć, ale wtedy warunkiem odbioru jest sprawdzony kształt po przymiarce.

**Scenariusz porażki:** model spełnia literalny cel „2 mm od osi”, a dopuszczalnie krzywy drut nadal ociera.

**Poprawka:** zdefiniować oddzielnie tolerancję pierwszego gięcia i dopuszczalną obwiednię gotowego drutu po poprawkach. Przemiatać tę drugą, wraz z regulacją V i luzami Z.

**Pewność:** wysoka.

### 5. WAŻNE — miejsca i kierunki V są wykonalnymi kandydatami, nie rozstrzygniętym rozwiązaniem

**Miejsce:** koncepcja §3.2–3.3.

Obliczone środki obecnych korpusów drutów w położeniu neutralnym:

| Drut | Przybliżony środek [x, y, z], mm | Kierunek V do sprawdzenia |
|---|---|---|
| S1 | [20,5; −0,55; −24,91] | ku +y |
| S2 | [5,5; 20,96; −24,71] | ku +x |
| PG | [−34,1; 3,5; −22] | ku +y |
| PD | [−33,7; −3,5; −22] | ku −y |

Kierunki oznaczają odpowiednią składową prostopadłą do cięgna. Są **propozycją techniczną do przemiatania**, nie potwierdzonym montażem.

Dla powiek V nie powinny wychodzić oba w tę samą stronę ani ku sobie. W obecnej geometrii PG skierowane na zewnątrz, ku −x, koliduje z tubą:

- przy zamknięciu i V 45°: obliczeniowe wnikanie około **0,67 mm**;
- przy V 60°: około **1,46 mm**.

To obliczenie lokalne z promienia wewnętrznego tuby 37,9 mm i korpusu PG z parametrów.

Przy PG ku +y i V 60° zostaje lokalnie około **2,20 mm powierzchnia–powierzchnia** do tuby. Odchyłka o 2 mm zużywa niemal całość: zostaje około 0,20 mm, przed innymi błędami. PD ku −y daje w tej samej pozycji około 2,58 mm.

**Tabela 3.3 nie rozwiązuje całego otoczenia:**

- kieszeń za dźwignią może pomóc przy końcu Z, ale nie odsuwa automatycznie korpusu od S3 i Pierścienia;
- pominięto pary drut PG–dolna powieka **0,82 mm** oraz drut PD–górna powieka **1,30 mm**;
- rozdzielenie otworów S3 nie gwarantuje rozdzielenia całych drutów;
- dwa otwory na różnych promieniach zmieniają przełożenia powiek;
- „jw.” przy S2 nie określa właściwego przesunięcia: ucho S2 ma oś X, a S1 oś Y.

Przy otworach i powierzchniach roboczych połączeń cel „2 mm do każdej części” jest z definicji niemożliwy. Potrzebne są jawnie wskazane strefy przegubów z własnymi luzami.

**Scenariusz porażki:** poprawiono połączenie przy dźwigni, lecz V albo drugi koniec drutu trafia w tubę, serwo lub sąsiednią powiekę.

**Poprawka/test:** ustalić dla każdego drutu miejsce V, płaszczyznę i kierunek; sprawdzić skrajne regulacje oraz pełne Z. Jeśli brakuje miejsca, zmienić lokalny przebieg i geometrię mocowań, zachowując obie ruchome powieki. Nie przyjmować samego opisu kieszeni jako dowodu.

**Pewność:** wysoka dla lokalnych ograniczeń; średnia dla podanych kierunków kandydackich.

### 6. WAŻNE — luz Z nie ma jednej wartości ani jednego skutku kątowego

**Miejsce:** koncepcja §3.1.

Nawet w uproszczeniu „środek minus grubość”:

- ucho gałki i orczyk 2 mm: dla środka 5 ±2 mm luz wynosi **1…5 mm**;
- dźwignia powieki 1,5 mm: **1,5…5,5 mm**.

Nie jest to stałe „około 3 mm”. Rzeczywisty przesuw ograniczą średnica drutu, promienie kolanek i przechył nogi. Trzeba też określić, czy 5 mm mierzy się między osiami naroży, stycznymi czy wewnętrznymi powierzchniami.

**Obliczenie skutku, nie prognoza typowego zachowania:** przy nodze ustawionej pod 105° do korpusu przesuw 3 mm daje składową wzdłuż cięgna około:

\[
3|\cos105^\circ|=0{,}776\ \mathrm{mm}
\]

Dwa takie końce mogą dać zmianę efektywnej długości około 1,55 mm między stanami oparcia. Dla S2 w środku zakresu odpowiada to około **4,6° ruchu gałki między tymi stanami**. Zatem ±1,9° z jednego przykładu nie opisuje całego mechanizmu.

Dla powiek przy S3 składowa wynosi około \(3\sin9^\circ=0,47\) mm, co przy domykaniu odpowiada około **4,6° powieki**, jeszcze bez luzów promieniowych.

Dochodzi luz Ø1 w otworze Ø1,4. Przy odwróceniu obciążenia jeden koniec może przemieścić się w otworze o 0,4 mm; dwa końce dają granicznie około **0,8 mm**, czyli około **7,9° powieki** przy zamknięciu. To granica geometryczna, nie przewidywana przeciętna.

**Scenariusz porażki:** po kalibracji w jednym kierunku mechanizm zmienia zero przy ruchu przeciwnym, stuka i zostawia inną szczelinę.

**Poprawka/test:** określić dopuszczalny przesuw każdego Z i zmierzyć histerezę złożenia przy stałym impulsie serwa, obciążając wyjście w obie strony. Kalibracji elektronicznej nie traktować jako kasowania luzu.

**Pewność:** wysoka dla istnienia problemu i skali geometrycznej; średnia dla rzeczywistej amplitudy.

### 7. WAŻNE — kąty 90/95/105° poprawiają kierunek, lecz test w zerze nie dowodzi zakresu

**Miejsce:** koncepcja §3.1; SVG, panel 2.

Niezależne obliczenie dla długości nominalnych:

| Połączenie przy gałce | Zakres kąta między osią otworu a korpusem | Przyjęte gięcie | Minimalny wymagany przechył nogi, maksymalnie |
|---|---:|---:|---:|
| S1 | 51,64…117,50° | 90° | 38,36° |
| S2 | 66,71…143,06° | 105° | 38,29° |

Dla idealnej talii Ø1,7, długości 0,3 mm i drutu Ø1 granica przechyłu wynosi około **44,59°**. Pozostaje zatem około **6,2–6,3°** zapasu, a nie ±10°. Niekorzystny błąd gięcia 10° podnosi wymaganie do około 48,3°.

Przy orczykach nominalne 95° dla S1 i 105° dla S2 kompensują stałe odchylenie cięgna. Nadal trzeba sprawdzić otwór i grubość orczyka z resztkowym błędem po dogięciu.

Dla powiek skrypt podaje:

- przy S3 odchylenie od płaszczyzny orczyka około **8–9°**, przeciwnych znaków dla PG i PD;
- przy dźwigniach około **0–2°**.

Daje to przy S3 kąt wewnętrzny około **81° albo 99°**, zależnie od kierunku nogi; przy dźwigniach blisko 90°. Bez strony wkładania pojedyncza wartość kąta jest niejednoznaczna.

Próba trafienia końcem w otwór sprawdza położenie w jednym stanie. Nie sprawdza przechyłu nogi w skrajnych pozycjach ani orientacji drugiego Z — zwłaszcza gdy luźny koniec może się obracać i przesuwać.

**Scenariusz porażki:** drut pasuje przy gałce na wprost, ale blokuje się podczas rozglądania.

**Poprawka/test:** zachować doginanie według próby, lecz rozszerzyć kryterium o swobodny ruch całego ustalonego zakresu, z oboma końcami zamontowanymi. Nie wymaga to od użytkownika gięcia kątomierzem; wymaga wykazania, że po poprawkach nie ma zakleszczenia. Obliczone maksima dotyczą celu ±35°/±25°; nie dowodzą automatycznie utraty minimum PRD.

**Pewność:** wysoka.

### 8. KRYTYCZNE — regulacja „S3 na jedną, V na drugą” działa tylko przy ograniczonej różnicy długości

**Miejsce:** koncepcja §3.2; SVG, panel 4.

**Co działa:** jeden wspólny parametr S3 i osobna regulacja długości drugiego drutu wystarczają do ustawienia dwóch położeń zamknięcia, jeżeli regulacja ma odpowiedni zakres i połączenia nie mają nadmiernej histerezy.

**Co nie działa w podanym bilansie:** niezależnie policzony przykład:

- PG dłuższy o 4 mm;
- PD krótszy o 4 mm;
- S3 ustawione tak, by PG był zamknięty: α ≈ −8,44°;
- wymagana poprawka PD: **+7,997 mm**.

To znacznie więcej niż +1,589 mm z V. Idealne równanie ustawia wtedy dolną powiekę około 69,7°, poza przewidzianym skokiem 0…51,5°; nie jest to prognoza bezkolizyjnego rzeczywistego ruchu.

Czułość długości drutu PG:

| Pozycja | Zmiana kąta na 1 mm długości |
|---|---:|
| Zamknięta | 9,87°/mm |
| Połowa skoku | 8,29°/mm |
| Otwarta | 8,59°/mm |

Dla przykładowej dokładności 1° potrzeba około **0,10 mm** kontroli efektywnej długości przy zamykaniu. Istniejąca zakładka 3° odpowiada około **0,30 mm**. Same dopuszczone luzy połączeń mogą być większe.

**Przeciążenie:** czasze nominalnie mijają się promieniowo; wizualne zamknięcie nie musi być twardym oporem. Procedura nie gwarantuje jednak braku przeciążenia, jeśli użytkownik domyka przeciw zakleszczeniu Z albo kolizji dźwigni. Sztywne V tego nie wyrówna.

**Poprawka/test:** najpierw zgrubnie dopasować oba druty przez poprawki Z, potem regulować V. Kalibrować z tego samego kierunku, sprawdzić zamknięcie z obu kierunków oraz pełne otwarcie. Nie przesuwać S3 dalej tylko dlatego, że druga powieka została z tyłu.

**Pewność:** wysoka.

### 9. WAŻNE — rysunek nie wystarcza do samodzielnego wykonania i montażu

**Miejsce:** `druty-v2-giecie-reczne.svg`.

Koncepcja mówi o dwóch rzutach pokazujących przestrzenność. **SVG ich nie zawiera:** panel 1 pokazuje jeden płaski schemat całego drutu, panel 2 jeden szczegół Z.

Brakuje:

- osobnych rysunków S1, S2, PG i PD, z końcami „serwo”/„ucho”;
- drugiego rzutu i oznaczenia stron wkładania;
- kierunku V względem mechanizmu;
- kątów obu zagięć każdego Z, z jednoznacznym zaznaczeniem kąta wewnętrznego;
- numeru otworu orczyka i położenia orczyka podczas przymiarki;
- obu drutów przy S3 jednocześnie;
- przekroju otworu i drogi przełożenia gotowego Z;
- definicji pomiaru środka Z, ogona i ramion V;
- długości materiału do cięcia oraz widocznej informacji „schemat, nie mierzyć z rysunku”.

**Niezgodność geometryczna panelu 1:** narysowane zagięcia znajdują się obok płyt, natomiast płyty przecinają odcinki końcowe. Nie pokazuje to jednoznacznie środkowej nogi Z przechodzącej przez otwór.

**DROBNE:** „trzy miejsca gięcia” oznacza trzy obszary, ale wykonawczo są **siedem zagięć**: po dwa na każdym Z i trzy dla V. Warto je ponumerować, żeby użytkownik poprawiał właściwe naroże.

**Scenariusz porażki:** użytkownik zrobi płaski S1/PG/PD, odwróci stronę Z lub skieruje V w tubę.

**Poprawka/test:** zastąpić wspólny schemat czterema jednoznacznymi rysunkami wykonawczo-montażowymi. Pokazać je osobie nieznającej projektu i sprawdzić, czy potrafi wskazać wszystkie strony i kolejność bez dopowiedzeń.

**Pewność:** wysoka.

### 10. Pozostałe luki

**WAŻNE — promienie gięcia zmieniają podane długości.**  
**Miejsce:** definicje Z/V oraz §3.4. Wzory V zakładają ostre naroża. W SCAD dotychczasowy promień osi gięcia wynosi 2,1 mm. Dla dwóch kolanek 90° odległość między wirtualnymi narożami musi wynosić co najmniej \(2R=4,2\) mm, aby łuki się nie nakładały; dolne 3 mm z tolerancji 5 ±2 tego nie spełnia. Nie oznacza to konieczności użycia promienia 2,1, lecz konieczność określenia rzeczywistego promienia i sposobu wymiarowania.  
**Porażka:** Z ma właściwy wymiar na linijce, ale nie ma miejsca na przejście przez blaszkę.  
**Poprawka/test:** przyjąć mierzalną geometrię kolanek i sprawdzić gotowy Z na próbce przed gałką. **Pewność: wysoka.**

**WAŻNE — pełne Z i droga montażu nadal nie są sprawdzane.**  
**Miejsce:** `duze-oko-kolizje.js`. Skrypt reprezentuje korpusy jako proste pręty, pomija fragmenty przy połączeniach i nie ma V ani ogonów ≥5 mm. Przemiatane jest tylko siedem pozycji powiek.  
**Porażka:** pozytywny wynik starego testu omija dokładnie nowe kolizje.  
**Poprawka/test:** dodać pełne końce, promienie, V i skrajne położenia luzów; sprawdzić również przełożenie gotowego drutu, nie tylko pracę po montażu. **Pewność: wysoka.**

**WAŻNE — końcówka dźwigni powieki pozostaje cienka.**  
**Miejsce:** SCAD, `rDzwKoniec=2`, otwór Ø1,4. Ścianka promieniowa wynosi **1,3 mm**; koncepcja poprawia dół ucha gałki, ale nie tę końcówkę. Przy zewnętrznym Ø4,4 zostałoby 1,5 mm, przed sprawdzeniem otoczenia.  
**Porażka:** uszkodzenie przy wkładaniu albo regulowaniu sprężynowego drutu.  
**Poprawka/test:** sprawdzić lokalne wzmocnienie i dostęp montażowy, bez dodawania drobnej osobnej części. **Pewność: wysoka dla wymiaru; średnia dla wytrzymałości.**

**WAŻNE — długi ogon nie jest dowodem zabezpieczenia we wszystkich pozycjach.**  
**Miejsce:** §3.1. Ogon ≥5 mm poprawia retencję, ale jego obrót tworzy własną obwiednię. Nie określono też górnej długości ogona.  
**Porażka:** ogon zaczepia sąsiednią część albo umożliwia odwrotną drogę wyplecenia przy skrajnym luzie.  
**Poprawka/test:** określić długość docelową i sprawdzić retencję oraz ruch połączenia na próbce. **Pewność: średnia — brak kompletnej geometrii.**

**Decyzje funkcjonalne dla użytkownika:** nie proponuję zmian funkcji. Obie powieki pozostają ruchome na jednym S3; zakupy, dodatkowe serwo i unieruchomienie dolnej powieki nie są poprawkami przyjętymi w tym review.

Nie zapisywałem plików, nie wykonywałem `git pull`, commitów ani pushy. Nie pozostawiłem własnych procesów w tle.

**Werdykt: koncepcja v2 w obecnym zapisie nie nadaje się do przyjęcia jako podstawa przeprojektowania modelu — wymaga poprawienia bilansu regulacji, kolejności gięcia, kontroli luzów oraz rozmieszczenia pełnych Z i V, przy zachowaniu drutów i obu ruchomych powiek na jednym S3.**