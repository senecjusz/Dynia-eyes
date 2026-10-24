Zadanie E6: review przyrządu i zbiorczego 3MF. **Zbiorczy plik przechodzi kontrolę; przyrząd wymaga poprawek przed użyciem do wykonania kompletu drutów.**

Potwierdziłam:

- Długości obliczeniowe: **S1 41,856; S2 42,890; PG i PD 44,561 mm**. Kąty: **S2 75,139°; powieki 80,962°**.
- Zbiorczy 3MF zawiera **8 osobnych obiektów**, poprawnie nazwanych: Galka, Powieka gorna, Powieka dolna, Pierscien, Maskownica, Uchwyt serw, Probka drutu, Przyrzad do giecia drutow.
- Każdy obiekt ma jedną spójną bryłę; **0 otwartych krawędzi, krawędzi nierozmaitościowych, degeneracji i błędów orientacji**. Geometria odpowiada plikom pojedynczym z dokładnością zaokrąglenia **0,000005 mm**.
- Po uwzględnieniu transformacji obwiednie nie nakładają się; najmniejszy odstęp wynosi **10,000 mm**. Całość zajmuje **221,100 × 250 × 56,250 mm**, zgodnie z opisanym przeznaczeniem do rozdzielenia na stoły.

**KRYTYCZNE**

**K1. Tor PD ma niewłaściwą skrętność dla opisanej strony montażu.**  
**Miejsce:** `duze-oko-v2.scad`, wiersze 311–312; instrukcja montażu, krok 2.  
**Scenariusz porażki:** górny korpus biegnie po zewnętrznej stronie dźwigni, dolny od strony gałki. Dlatego przejście A jest odpowiednio **+x i −x**. Wejścia do wspólnego orczyka S3 mają być przeciwne: B odpowiednio **−y i +y**. Odwracają się zatem **oba** końce. Przyrząd zachowuje A skierowane w dół i odwraca tylko B. Powstaje przeciwna skrętność przestrzenna: iloczyn mieszany dla obu wymaganych drutów ma znak dodatni, a dla torów PG/PD odpowiednio dodatni/ujemny. Sam obrót gotowego PD tego nie naprawi.  
**Poprawka:** uzgodnić oba kierunki końców PD z opisanym montażem, następnie sprawdzić komplet dwóch drutów na rzeczywistej dźwigni i orczyku.  
**Pewność:** wysoka dla sprzeczności z obecną instrukcją.

**WAŻNE**

**W1. Przyrząd pomija promienie gięcia wymagane przez rysunek.**  
**Miejsce:** `torPrzyrz()`, wiersze 299–303; SVG, opis promienia wewnętrznego ≈1 mm.  
**Scenariusz porażki:** drut Ø1 z promieniem wewnętrznym 1 mm ma promień osi **1,5 mm**. Przy kolanku 90° jego obwiednia wychodzi około **0,19 mm poza naroże rowka szerokości 1,2 mm**. Nie da się jednocześnie zachować tego promienia i docisnąć drutu do dna całego toru. Ponadto dwa kolanka 90° o takim promieniu wymagają rozstawu wirtualnych naroży co najmniej **3 mm**, wobec przewidzianego odcinka przez otwór **2,5 mm**. Wykonanie wymusi ciaśniejsze zagięcia albo inne wymiary końcówki. Zbyt małe promienie zwiększają ryzyko pękania drutu. [Newcomb Spring](https://newcombspring.com/resources/torsion-spring-wire-forming-radii)  
**Poprawka:** określić rzeczywisty promień uzyskiwany kombinerkami i uwzględnić go w torze, długościach oraz kontroli końcówek.  
**Pewność:** wysoka geometrycznie; zachowanie konkretnego drutu wymaga próby.

**W2. Dociśnięcie do nominalnego kąta nie zapewnia tego kąta po zwolnieniu.**  
**Miejsce:** instrukcja gięcia, kroki 2–4.  
**Scenariusz porażki:** brakuje kompensacji sprężynowania i kontroli swobodnego drutu. Przykładowy odskok **5°** przesuwa koniec ramienia 4,5 mm o **0,39 mm**, przy luzie rowka tylko **0,10 mm na stronę**. To przykład wrażliwości, nie pomiar posiadanego drutu. Kompensację ustala się dla konkretnego materiału i procesu. [XULONG — gięcie drutów](https://chinaspringfactory.com/springback-wire-forming-overbend-compensation/)  
Dodatkowo wytrzymałość krawędzi PLA nie jest sprawdzona: rowek ma tylko **0,7 mm wysokości**, a pod ślepym otworem pozostaje **1,5 mm materiału**. Możliwe jest wyrobienie krawędzi i przesunięcie miejsca gięcia.  
**Poprawka:** wykonać próbne gięcie, mierzyć kąt po zwolnieniu oraz sprawdzić odkształcenie otworu i rowka; zasadnicze przegięcie wykonywać szczękami narzędzia.  
**Pewność:** wysoka dla braku kompensacji; średnia dla trwałości wydruku.

**W3. Otwór A nie odmierza deklarowanych 4,5 mm względem osi korpusu.**  
**Miejsce:** `stubDrut`, `torPrzyrz()`; instrukcja, krok 2.  
**Scenariusz porażki:** dno otworu leży na **z=1,5 mm**, dno rowka na **z=5,3 mm**, a oś leżącego drutu na **z=5,8 mm**. Od dna otworu do wirtualnego przecięcia osi jest więc **4,3 mm**, zamiast 4,5 mm. Po odmierzeniu ogona 2 mm pozostaje **2,3 mm**, jeszcze przed uwzględnieniem promieni. Również SVG podaje dla dźwigni 1,5 mm odcinek „grubość +0,5”, czyli **2,0 mm**, podczas gdy przyrząd wszędzie zakłada 2,5 mm.  
**Poprawka:** przyjąć jednoznaczny sposób wymiarowania końcówki i skorygować głębokość oporu oraz instrukcję dla poszczególnych połączeń.  
**Pewność:** wysoka.

**W4. Polecenie gięcia ogonów jest sprzeczne z kątami S2 i powiek.**  
**Miejsce:** instrukcja, krok 5; SVG, rysunki 2–3.  
**Scenariusz porażki:** po odgięciu ogona o 90° względem odcinka S2 ustawionego pod 75,139° ogon będzie odchylony od korpusu o **14,861°**. Dla B powiek różnica wyniesie **9,038°**. Przy ogonie 2 mm daje to odchylenie poprzeczne odpowiednio **0,51 i 0,31 mm**. Nie można jednocześnie spełnić poleceń „90°” i „równolegle do korpusu”. SVG dodatkowo przedstawia końcówkę powiek jako 90°, zamiast około 81°.  
**Poprawka:** podać kierunek i kąt każdego ogona osobno, zgodnie z geometrią toru; ujednolicić SVG.  
**Pewność:** wysoka.

**DROBNE**

**D1. Dokumentacja zawiera nieaktualne wymiary.**  
**Miejsce:** instrukcja, opis płytki; komentarze `LPrzyrz` i `katP`.  
**Scenariusz porażki:** siatka ma **65,561 × 56 × 6 mm**, zamiast 69 × 56 × 6; `katP` wynosi **80,962°**, zamiast komentowanych 79,7°. Utrudnia to kontrolę zgodności wydruku.  
**Poprawka:** poprawić opis i komentarze.  
**Pewność:** wysoka.

Geometrycznie płytka mieści się na A1 mini, ma płaskie dno i nie wymaga podpór. Rowki **1,2 × 0,7 mm**, pionowe otwory **Ø1,5 × 4,5 mm** oraz grawer głębokości **0,6 mm** są drukowalne; nie potwierdza to jednak ich przydatności jako powierzchni formujących.

Bez zapisu plików i git; brak pozostawionych procesów w tle.

**Werdykt: zbiorczy 3MF nadaje się do rozdzielenia i przygotowania druku, lecz przyrząd i instrukcja nie zapewniają jeszcze wykonania drutów zgodnych z opisanym montażem — szczególnie końcówki PD i zagięć o rzeczywistych promieniach.**