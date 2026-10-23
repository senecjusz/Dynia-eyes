# Review koncepcji dużego oka 2c — Astra, 22.10.2026

**Zadanie:** E6.1, niezależna ocena koncepcji przed przygotowaniem briefu CAD.  
**Materiał:** `20-analizy/2026-10-22-duze-oko-2c-koncepcja.md`, brief E6.1 wersja 2, oba review briefu, wymagania i kontekst projektu.

**Koncepcja nie jest jeszcze gotowa na brief CAD.** Odtworzyłem zasadniczą kinematykę gałki i powiek: mechanizmy mają wymagany skok i nie wykazują martwego punktu w sprawdzonym zakresie. Natomiast podane warstwy napędu powiek zawierają kolizję z gałką i niewykonalne stosy śrub. Ochrona przekładni oraz rozruch nie spełniają briefu.

Obliczenia poniżej dotyczą geometrii nominalnej z dokumentu, nie istniejącego modelu CAD ani wydruku. Źródła internetowe sprawdziłem w zakresie opisanym w A11; filmów nie obejrzałem. Nie korzystałem z raportu drugiego recenzenta tej koncepcji.

## A1. KRYTYCZNE — nakrętka dolnego cięgna wchodzi w gałkę, a część śrub nie obejmuje stosów

**Miejsce:** §2.3, §4–5, załącznik A7.

**Kolizja występuje już przy gałce ustawionej na wprost.** Według A7 przegub dolnej powieki przy zamknięciu leży około `(y = −14; z = 0)`, a nakrętka zajmuje `x = 25,8…28,2`.

Konkretny punkt materiału nakrętki:

```text
(x; y; z) = (26; −14; 2) mm
odległość od środka gałki = √(26² + 14² + 2²) = 29,60 mm
```

Punkt leży poza otworem M3 nakrętki, wewnątrz jej sześciokątnego obrysu i jednocześnie **w ściance gałki R28…30**. To przecięcie brył, nie tylko niedotrzymanie luzu 0,5 mm.

Dodatkowo przyjęta wysokość nakrętki samohamującej jest błędna: standardowa M3 DIN 985 ma **4,0 mm całkowitej wysokości**, a 2,4 mm dotyczy niższej części metalowej. Rzeczywista nakrętka zwiększa kolizję. [Wymiary DIN 985 — Fastenright](https://www.fastenright.com/general-fixings/micro-nylon-insert-nuts-din-985/mf09)

| Połączenie | Łańcuch grubości według koncepcji | Ocena |
|---|---:|---|
| Dolne cięgno–dolna dźwignia, M3×10 | 2,4 + 0,5 + 2,4 + 4,0 = **9,3 mm** | Zostaje 0,7 mm na wystawanie gwintu i pozostałe szczeliny; możliwe warunkowo, lecz nakrętka koliduje z gałką |
| Górne cięgno–nadlew górnej dźwigni, M3×10 | 2,4 + 0,5 + **8,05** + 4,0 = **14,95 mm** | M3×10 nie obejmuje opisanego stosu |
| Dolne cięgno–ramię B, M2×6 | 2,4 + 2,6 dystansu + 2,4 ramienia = **7,4 mm przed nakrętką** | M2×6 jest za krótkie nawet bez nakrętki |

Jeżeli otwór w nadlewie górnej dźwigni ma przebiegać przez cieńszą lokalną ściankę, dokument musi pokazać jej przekrój. Obecny opis tego nie definiuje.

**Scenariusz porażki:** dolny przegub zatrzymuje ruch gałki; górnego przegubu i ramienia B nie da się skręcić wskazanymi śrubami.

**Poprawka/test:** przeprojektować warstwy napędu powiek z rzeczywistymi łbami, podkładkami Ø7 i całymi nakrętkami. Przed briefem CAD podać wykonalne przekroje wszystkich czterech przegubów oraz długości śrub wynikające ze stosów. Sam zakup DIN 913 nie usuwa tego problemu.

**Pewność:** wysoka dla kolizji i M2×6; wysoka dla M3×10 przy dosłownym przekroju nadlewu z A7.

## A2. KRYTYCZNE — ograniczniki nie chronią przekładni podczas wymuszonego ruchu

**Miejsce:** §2.1, §2.5, §9–10.

Koncepcja poprawnie przyznaje, że **między ogranicznikami dziecko przestawia serwo**. To przeczy wcześniejszej deklaracji, że obciążenie omija przekładnię.

Nakrętka na pręcie przejmuje obciążenie dopiero po zetknięciu z łapką Płyty. Przed tym moment z gałki biegnie przez przegub kulowy, pręt i orczyk do przekładni. Po zetknięciu również trzeba wykazać podział obciążenia i sztywność drogi do ramy.

Przeliczenie pełnej macierzy przełożeń daje gorszy przypadek niż stałe przełożenie 1,12 przyjęte w koncepcji:

- przy `ψ = −25°`, `θ = +15°`,
- zewnętrznym momencie **0,5 N·m wyłącznie wokół osi ψ**,
- równoważący moment na serwie X wynosi około **0,673 N·m**.

To około **3,8 × 0,177 N·m**, czyli nominalnego momentu zablokowania MG90S przy 4,8 V. Moment zablokowania nie jest dopuszczalnym obciążeniem mechanicznym przekładni. Dla powieki sam dokument podaje **0,44 N·m na serwie** przed dojściem do ogranicznika. [Dane MG90S — TowerPro](https://towerpro.com.tw/product/mg90s-3/)

**Nacisk od przodu:** zdanie „pręty biegną wzdłuż z i obciążenia osiowego nie przenoszą” jest błędnym uzasadnieniem. Właśnie takie ustawienie pozwala im przenosić siłę osiową. To, ile z 20 N przejmie kardan, zależy od luzów i podatności całego układu.

Nie ma również obliczenia potwierdzającego kolejność uszkodzeń: „najpierw ucho Powieki, nie Rama”. Brakuje przekroju krytycznego, ramienia siły i porównania z wyrwaniem wkrętu z PLA oraz wypięciem kulki.

**Scenariusz porażki:** przekładnia, wielowypust albo końcówka kulowa uszkadza się, zanim zadziała ogranicznik; przy nacisku od przodu część obciążenia trafia w napęd.

**Poprawka/test:** określić ochronę przeciążeniową działającą również wewnątrz zakresu ruchu, np. kontrolowany poślizg lub rozłączenie z jednoznacznym progiem i sposobem przywrócenia pozycji. Ograniczniki pozostawić jako ograniczenie geometrii. Przeprowadzić próbę wymuszenia gałki i powiek w kilku położeniach, a 20 N od przodu sprawdzić osobno.

**Pewność:** wysoka co do drogi siły i braku ochrony; kolejność rzeczywistych uszkodzeń pozostaje nieustalona.

## A3. KRYTYCZNE — opis rozruchu wprost dopuszcza gwałtowny skok

**Miejsce:** §8, „Bezpieczny rozruch”.

Dokument mówi, że pierwszy impuls powoduje ruch pełną prędkością i uznaje go za zwykłą sakadę. Brief wymaga **bezpiecznego rozruchu, nie tylko przeżycia skoku**.

Otwarcie powiek jako pierwsza komenda ogranicza jeden scenariusz przycięcia, ale nie usuwa:

- gwałtownego ruchu gałki;
- szarpnięcia po ręcznym przestawieniu;
- ponawiania ruchu przy kolejnych restartach zasilania;
- nieznanej pozycji rzeczywistej po zaniku zasilania.

NVS, ograniczenie zakresu i kolejne uruchamianie serw nie rozwiązują problemu nieznanej pozycji początkowej.

**Scenariusz porażki:** mechanizm uruchamia się gwałtownie mimo formalnego zaliczenia zakresów bezkolizyjnych.

**Poprawka/test:** przed CAD wybrać rozwiązanie, które rzeczywiście spełnia wymaganie: pomiar pozycji, odpowiedni napęd z kontrolowanym startem albo procedurę świadomego uzbrojenia po ustawieniu mechanizmu. Jeżeli dopuszczony ma być skok, potrzebna jest jawna zmiana wymagania przez użytkownika. Test obejmuje restart i ponowne załączenie po ręcznym przestawieniu w całym zakresie.

**Pewność:** wysoka.

## A4. KRYTYCZNE — 5,6 N nie jest granicą siły przycięcia

**Miejsce:** §2.5, załącznik A3.

Wzór:

```text
F = T / [R · (dφg/dα + dφd/dα)]
```

odpowiada szczególnemu kontaktowi przedmiotu pomiędzy obiema krawędziami. Nie opisuje przeszkody zatrzymującej tylko jedną powiekę.

Z ponownego rozwiązania mechanizmu dla `α = 0…73°`, z długościami 35,8 i 41,6 mm:

| Wielkość | Wynik |
|---|---:|
| `|dφg/dα|` | **0,635–0,759** |
| `|dφd/dα|` | **0,271–0,404** |
| Siła dla wspólnego kontaktu obu powiek, R34 | około **4,5–5,7 N** |
| Obciążenie tylko górnej powieki, siła styczna przy R34 | około **6,9–8,2 N** |
| Obciążenie tylko dolnej powieki, siła styczna przy R34 | około **12,9–19,2 N** |

To obliczenia dla momentu 0,177 N·m. Rzeczywista siła zależy od miejsca i kierunku kontaktu; powyższe wartości nie są gwarantowanym maksimum dla wszystkich dostępnych miejsc.

Odwołanie do szczelin 5/12 mm nie potwierdza bezpieczeństwa. Przywołana strona JJR opisuje różne kategorie mechanizmów z dodatkowymi warunkami stosowania, a nie uniwersalną regułę dla każdej ruchomej szczeliny. Nie traktuję jej jako dowodu zgodności z normą.

**Scenariusz porażki:** palec albo przedmiot blokuje jedną powiekę; siła znacząco przekracza deklarowane 5,6 N.

**Poprawka/test:** zaprojektować ograniczenie siły lub rozłączenie napędu i określić sposób uwolnienia przeszkody. Pomiar siły wykonać osobno dla każdej powieki oraz między krawędziami, w kilku miejscach, na przyrządzie — nie na palcu.

**Pewność:** wysoka co do niepełności wzoru i nominalnych przełożeń; siły rzeczywiste wymagają pomiaru.

## A5. WAŻNE — kinematyka działa nominalnie, ale część podanych parametrów jest niepoprawna albo niejednoznaczna

**Miejsce:** §0, §2.1–2.3, §8–9, A1–A3.

### Wyniki potwierdzone

Przyjąłem:

```text
R = Rx(θ) · Ry(ψ)
PX = R · (−18; 0; −6)
PY = R · (0; −18; −6)

HX = (−18; 16 − 16 cos αX; −45 − 16 sin αX)
HY = (−8; −3 − 15 cos αY; −45 − 15 sin αY)

|PX − HX| = 39
|PY − HY| = √(39² + 8²) = 39,8121 mm
```

W X uwzględniłem 2 mm odsunięcia środka kulki od podanej płaszczyzny wałka.

| Kryterium | Niezależny wynik |
|---|---|
| Tabela kątów serw A2 dla ±25°/±15° | Odtworzona z dokładnością zaokrągleń |
| Sprzężenie Y przy `ψ = −25°`, `θ = 0°` | **−4,47° serwa** |
| Przegięcie kardana w pracy | **28,90°** |
| Przegięcie przy ±27°/±17° | **31,56°** |
| Zakres X przy ±27°/±17° | około **−33,95…+26,77°** |
| Zakres Y przy ±27°/±17° | około **−27,34…+19,79°** |
| Gałka: osobliwość napędu | Nie wykryta na siatce; najmniejsza wartość osobliwa macierzy przełożeń około **0,567** |
| Powieki przy 73° serwa | górna **51,05°**, dolna **26,91°** |

Zastosowałem siatkę 0,5° dla podstawowego przeglądu gałki, 1° dla macierzy przełożeń i 0,1° dla powiek. To sprawdzenie numeryczne, nie dowód tolerancji wykonania.

### Parametry do poprawienia

1. **„Kąt przenoszenia ≥51°” nie obejmuje obu końców napędu.** Po stronie orczyka X odtwarzam około 51,2°. Kąt między prętem a ramieniem punktu X względem odpowiedniej osi kardana spada jednak do około **37,7°**, a dla Y do około **53,0°**. Martwego punktu nadal nie ma, ale trzeba podać definicję kąta i zmienne przełożenia.

2. **Zakresy pracy i zakresy przy ogranicznikach są pomieszane.** W §2.2 opisano siatkę ±27°/±17°, po czym podano zakresy zbliżone do ±25°/±15°. §9 podaje jeszcze inne, zaokrąglone granice. Do firmware potrzebna jest jedna tabela.

3. **Kardan ≥33° ma tylko 1,44° zapasu** względem nominalnej przekątnej ograniczników. Trzeba sprawdzić rzeczywistą sztukę we wszystkich kierunkach, wraz z Uchwytami, wkrętami ustalającymi i ugięciem.

4. **Orientacja kulek na orczykach musi zostać określona.** Wartość „do 16°” jest zgodna z innym ustawieniem osi kulki niż obracająca się wraz z orczykiem oś początkowo pionowa; przy tym drugim ustawieniu X wymagałby około **38,8°**. Same współrzędne środków kulek nie definiują wymaganej artykulacji.

5. **A1 przeczy stwierdzeniu, że S–S jest konieczne.** W tym samym załączniku poprawnie wskazano możliwość U–S. S–S jest rozsądnym wyborem, ale nie jedynym. Para obrotowy–kardanowy ma 1 + 2 = **3**, nie 4 stopnie swobody.

**Scenariusz porażki:** wykonawca przyjmuje niewłaściwe limity lub orientację końcówki kulowej; przegub dochodzi do ograniczenia wcześniej niż mechanizm.

**Poprawka/test:** ujednolicić równania, znaki, zakresy oraz osie wszystkich kulek. Przełożenia i obciążenia liczyć jako funkcje obu kątów, nie przez stałe 1,12 i 1,20.

**Pewność:** wysoka dla rachunków nominalnych; rzeczywista artykulacja kardana i końcówek pozostaje niezmierzona.

## A6. WAŻNE — obrys i droga montażu nie mają jeszcze kompletnego dowodu

**Miejsce:** §1, §4–6, §12–13, A6.

**Wariant Ø56 ze zwykłymi łbami nie mieści się według własnego stosu koncepcji:**

```text
R = 28 + 1,2 + 2,4 + 0,25 + 2,4 + 0,25 + 3,25 + 2,45
  = 40,20 mm
Ø = 80,40 mm
```

Do zachowania Ø79,5 przy niezmienionym stosie trzeba zejść do **gałki Ø55,1**, nie Ø56. To rachunek dla tego stosu, nie dowód, że Ø60 ze zwykłymi śrubami jest ogólnie niemożliwe.

DIN 913 usuwa wystający łeb, lecz:

- nie rozwiązuje A1;
- wymaga określenia zabezpieczenia przed odkręcaniem od wahającej się powieki;
- pracuje gwintem jako powierzchnią osi;
- potrzebuje kontroli końca śruby, luzów i tolerancji zlicowania.

**Głębokość:** przy powierzchni dyni `z = +10` i końcu modułu `z = −67` zagłębienie wynosi **77 mm**. Za ścianką pozostaje **62 mm przy w15** i **42 mm przy w35**, podczas gdy tabela podaje 65/45. Jeżeli dodatkowe 3 mm są rezerwą na kabel, trzeba to nazwać.

A6 używa jeszcze głębokości **72 mm**. Przy zachowaniu jego uproszczonych promieni, lecz użyciu 77 mm, rozstaw wychodzi około **128 mm poziomo i 142 mm pionowo**, zamiast 119/132. Nie są to nowe zatwierdzone rozstawy — pokazują wrażliwość wyniku na niespójny obrys.

Ø79,5 nominalnej bryły nie dowodzi przejścia **kompletnego** modułu: brak obwiedni uszu serw, łbów, wtyczek, zabezpieczonych przewodów oraz toru nasuwania Obejmy.

**Scenariusz porażki:** wariant bez zakupów nie przechodzi przez otwór; kabel albo okucie blokuje wsuwanie; tył modułu koliduje z sąsiadem.

**Poprawka/test:** ustalić jeden obrys z pełnymi okuciami i przewodami, pozycję transportową powiek oraz kolejność montażu. Przed wydrukiem kompletu sprawdzić przejście przez wzornik Ø80 i drogę Obejmy. Wariant bez DIN 913 wymaga nowego przekroju.

**Pewność:** wysoka dla stosu Ø56 i głębokości; średnia dla rozstawów opartych na uproszczeniu A6.

## A7. WAŻNE — Obejma ma policzone tarcie na rurze, ale nie utrzymanie w dyni

**Miejsce:** §3, A4, próbka P5.

Wartość około 190 N można odtworzyć z idealizacji opaski:

```text
Ftarcia ≈ μ · 2πT = 0,3 · 2π · 100 = 188 N
```

To jednak założenie dotyczące rozkładu siły w obejmie. Nie uwzględnia sztywności drukowanego C, jego uszu, okien Ramy, lokalnego ściskania rury ani rzeczywistej siły śruby uzyskiwanej pokrętłem.

Przede wszystkim: **mocne zablokowanie Obejmy na rurze nie oznacza mocnego docisku miąższu**. Pokrętło zaciska promieniowo. Docisk osiowy wynika z ręcznego dosunięcia Obejmy i później maleje wraz z odkształceniem miąższu.

Korekty rachunkowe:

- ciężar 175 g: **1,72 N**;
- moment dla ramienia 19 mm: **0,0326 N·m**, nie 0,045;
- pole pełnego pierścienia Ø84/80: **515 mm²**, nie 452;
- 20 N rozłożone na całym takim pierścieniu daje średnio **39 kPa**; przy niepełnym kontakcie nacisk rośnie;
- moment 0,5 N·m odpowiada sile stycznej około **12,5 N przy R40**, więc „potrzebne <5 N” opisuje co najwyżej ciężar, nie rękę dziecka.

Próbka P5 sprawdza 10 N i 0,1 N·m. Nie odpowiada obciążeniom 20 N oraz 0,3–0,5 N·m omawianym dla całego mechanizmu.

Mocowanie obejmuje też **Ramę, Obejmę i Pokrętło — trzy części drukowane**, wobec limitu dwóch z briefu, jeżeli liczymy wszystkie części mocujące oko do dyni.

**Scenariusz porażki:** Obejma pozostaje zaciśnięta na rurze, ale cały moduł kołysze się, obraca lub wyrywa miąższ.

**Poprawka/test:** zachować M1 jako wariant do sprawdzenia, bez deklaracji udowodnionej nośności. P5 rozszerzyć na ścianki 15 i 35 mm, obciążenie w obu kierunkach osiowych oraz momenty z briefu. Zmierzyć przesunięcie i obrót po nasiąkaniu oraz ponownym montażu. Wyjaśnić limit części; pokrętło można zastąpić dokręcaniem śruby narzędziem, które brief dopuszcza.

**Pewność:** wysoka co do rozróżnienia zacisku i docisku; nośność miąższu pozostaje nieznana.

## A8. WAŻNE — tabela luzów nie obejmuje rzeczywistych par i tolerancji

**Miejsce:** §2.3–2.4, §5, A5–A7.

| Para | Ocena |
|---|---|
| Gałka–czasze powiek | Nominalne **1,2 mm** spełnia brief; trzeba uwzględnić niewspółosiowość, luzy i ugięcie |
| Uszy powiek na wspólnej osi | **0,25 mm osiowo** mieści się w wymaganych 0,2–0,3 |
| M3–otwór Ø3,3 | Daje **0,15 mm promieniowo**, nie deklarowane 0,2; rozstrzygnąć wobec ogólnego zalecenia Ø3,3 |
| Cięgno–cięgno | Z warstw §2.3 wynika **0,3 mm**, poniżej 0,5, jeżeli rzuty części nakładają się podczas ruchu; brak dowodu rozdzielenia |
| Dolne cięgno–gałka | Dla warstwy A7, x28,2 i szerokości 5 mm, lokalny nominalny luz może wynosić około **0,46 mm**; §2.3 podaje inne x |
| Dolna nakrętka–gałka | **Kolizja**, A1 |
| Pręty–gałka/Słupek/powieki | Można oszacować osie prętów; brak wymiarów końcówek, nakrętek ograniczników i łapek |
| Orczyki–serwa–przewody | „1,5–3 mm, do CAD” pozostaje założeniem bez pełnych brył |
| Płyta–Rama, Obejma–rura | **0,25/0,3 mm** zgodne ze startowymi luzami ślizgowymi; potrzebne fazki i droga montażu |
| Kardan–kieszeń | **0,15/str.** wymaga określenia rodzaju pasowania i próby; nie jest zatwierdzonym luzem ślizgowym z tabeli |

Niezależne sprawdzenie osi prętów w zakresie ±27°/±17° daje:

- minimalny odstęp osi prętów od siebie około **17,62 mm**;
- od osi Słupka około **13,31 mm dla X** i **15,46 mm dla Y** w jego podanym przedziale z;
- od krawędzi otwarcia czaszy gałki około **2,47 mm dla X** i **3,12 mm dla Y**.

Dla gładkiego pręta Ø3 ostatnie wartości pozostawiają około **0,97 i 1,62 mm**. To dobry wynik dla samych prętów, ale nie obejmuje ich grubych końcówek ani nakrętek.

**Powieki:** szczelina 2° daje około **1,09 mm w środkowym przekroju**. Przy kącikach maleje; nie jest to minimalny luz całych krawędzi. Ponadto „ogranicznik 1° za zamknięciem” wymaga definicji: jeśli każda powieka zamknie się o dodatkowy 1°, nominalne 2° zniknie.

Pełne odsłonięcie tęczówki przy patrzeniu w górę ma tylko około **0,3° zapasu**, czyli około **0,16 mm łuku na R30**. To nie jest zapas odporny na luzy montażowe.

**Scenariusz porażki:** idealne osie przechodzą test, a podkładka, nakrętka, kabel albo ugięta powieka blokuje ruch.

**Poprawka/test:** ujednolicić warstwy i utworzyć tabelę minimalnych odległości dla kompletnych części w całym zakresie gałki i niezależnym zakresie mrugnięcia. Rozdzielić szczelinę środkową od minimalnej szczeliny krawędzi. Wskazać, czy częściowe zasłonięcie tęczówki jest dopuszczalne.

**Pewność:** wysoka dla podanych rachunków; pełne minimum odległości wymaga zdefiniowania brył.

## A9. WAŻNE — orientacje druku nie dowodzą DFAM

**Miejsce:** §4, §11.

**Gabaryty pojedynczych części mieszczą się na A1 mini.** Największy zadeklarowany wymiar części mocowania jest około 104 mm, wyraźnie poniżej 180 mm. Nie oceniałem wspólnego rozłożenia kompletu na jednej płycie.

Problemy pozostające do rozwiązania:

- **Gałka, krawędzią na stole:** płaski pierścień podstawy istnieje, ale wewnętrzny strop czaszy R28 przekracza nawis 45° powyżej około `z = 19,8 mm`. Początek tej strefy ma średnicę około **39,6 mm**. Brakuje decyzji o podporach lub geometrii zamknięcia.
- **Rama, rantem w dół:** rant dopasowany do dyni R150 nie jest płaski. Różnica wysokości między r40 a r42 wynosi około **0,57 mm**. Trzeba wskazać rzeczywistą płaszczyznę podparcia i położenie ząbków.
- **Powieka górna o sektorze 100°:** samo „krawędzią w dół” nie dowodzi, że druga krawędź i dźwignia nie schodzą poniżej wybranej płaszczyzny.
- **Uchwyt i Słupek:** brak przekrojów pokazujących nawisy, otwór na klucz, kieszeń kardana i kierunek warstw w najbardziej obciążonych miejscach.

**Scenariusz porażki:** część nie leży płasko, wymaga nieopisanych podpór albo deformuje się przy ich usuwaniu, zmniejszając luz czasz.

**Poprawka/test:** dla każdej części wskazać konkretną płaską powierzchnię i strefy podpór. Dopuszczenie podpór musi być jawne. Zweryfikować szczególnie wewnętrzną powierzchnię Gałki oraz płaszczyznę druku obu powiek.

**Pewność:** wysoka dla Gałki i krzywizny rantu; pozostałe części wymagają doprecyzowania kształtu.

## A10. WAŻNE — budżet prądu i utrzymanie pozycji bez PWM nie są potwierdzone

**Miejsce:** §8.

**Test odważnikiem jest za słaby względem własnych założeń dokumentu:**

```text
5 g × 9,81 × 16 mm = 0,000785 N·m
```

To mniej niż podane **0,0017 N·m** od ciężaru i znacznie mniej niż zakładane **0,01 N·m** oporu cofania. Na ramieniu 16 mm wartościom tym odpowiada odpowiednio około **10,8 g** i **63,7 g**. Zaliczenie testu 5 g nie dowodzi utrzymania pozycji.

**Budżet prądu:**

- „rozruch ≤0,3 A” nie wynika z uruchamiania serw po kolei; pojedynczy napęd podczas startu może pobierać znacznie więcej niż średni prąd ruchu;
- dla trzech MG90S przy przyjętych 0,65–0,8 A zablokowanie daje **1,95–2,4 A**, przed doliczeniem pozostałej dyni;
- nie ma uzasadnienia ograniczenia awarii do dwóch serw;
- dla dziesięciu SG90, trzech MG90S i ESP podane składniki spoczynku sumują się do około **0,175–0,215 A**;
- średnie 0,1 A dużego oka wymaga jawnego cyklu aktywności;
- odstęp między startami nie gwarantuje zakończenia ruchu lub ustania przeciążenia poprzedniego napędu.

**Kanały policzono poprawnie:** trzy serwa na 13–15, maksymalnie 13 małych oczu bez dodatkowego odbiornika na PCA. Przy czterech serwach dużego oka pozostaje najwyżej 12 małych. Podtrzymanie z GPIO wymaga stopnia wykonawczego; GPIO jest sygnałem sterującym, nie źródłem prądu obciążenia.

**Scenariusz porażki:** opadnięcie mechanizmu po wyłączeniu PWM albo reset zasilania podczas rozruchu/przyblokowania, a następnie kolejny gwałtowny start.

**Poprawka/test:** sprawdzić niezasilone i zasilone bez PWM serwa oddzielnie, w rzeczywistym mechanizmie i najgorszych położeniach. Budżet prądu oprzeć na pomiarach egzemplarzy i jawnej liczbie równocześnie aktywnych napędów. Pozostawić zależność od E5.5 jako nierozstrzygniętą.

**Pewność:** wysoka dla błędu testu i sum; prądy oraz opór cofania wymagają pomiaru.

## A11. WAŻNE — źródła potwierdzają bazę, nie tę konkretną adaptację

**Miejsce:** §2.1–2.4.

| Źródło | Co sprawdziłem | Czego nie potwierdziłem |
|---|---|---|
| [Cogley — mechanizm „on the Cheap”](https://www.instructables.com/3D-Printed-Animatronic-Eye-Mechanism-on-the-Cheap/) i [opis filmu autora](https://www.youtube.com/watch?v=I7IxOmThaxw) | Dostępne fragmenty wskazują 4 SG90 i przegub uniwersalny 3 mm | Pełnej instrukcji i ruchu na filmie; konkretnej geometrii mocowania kardana z E6.1 |
| [Cogley — DIY Compact](https://www.instructables.com/DIY-Compact-3D-Printed-Animatronic-Eye-Mechanism/) | Identyfikacja projektu i opis autora filmu potwierdzają użycie popychaczy oraz servo ball-links | Nie odczytałem pełnej strony; nie potwierdzam obu końców każdego popychacza ani zgodności z S–S E6.1 |
| EyeMech ε3.2, [instrukcja](https://www.instructables.com/Animatronic-Eye-Mechanism/) i [film montażowy](https://youtu.be/MeHLouL9ltw) | Istnienie materiałów źródłowych | Pełnego montażu i działania filmu; nie pobierałem repozytorium źródłowego |
| [Cogley — Simple Animatronic Eyes, Make](https://makezine.com/projects/simple-animatronic-eyes/) | Pełny tekst: wspólna oś kołyski i powiek, serwo X na ruchomej podstawie, sześć serw na parę oczu, montaż i podążanie powiek za spojrzeniem | Mechanizmu jednoserwowego z ramionami 16/5 mm; ten projekt go nie potwierdza |
| [Stan Winston — jedno serwo dla powiek](https://forums.stanwinstonschool.com/discussion/6348/can-you-use-a-linear-servo-for-eyelids) | Pełna wypowiedź potwierdza stosowanie wspólnego napędu oraz utratę niezależnego podążania powiek | Brak wymiarów i demonstracji konkretnego sprzężenia z E6.1 |
| [Stan Winston — komentarz o środku oka](https://forums.stanwinstonschool.com/discussion/comment/6206) | Próba dostępu | Treść niedostępna; nie oznaczam cytatu jako niezależnie sprawdzonego |
| [Face maker101 — PCBWay](https://www.pcbway.com/project/shareproject/The_Face_maker101_c4124445.html) | Tekst opisuje pięć MG90S, druty ze spinaczy, przeguby uniwersalne i jedno serwo powiek | Nie potwierdza wymiarów ani rodzaju metalowego kardana RC; tekst wymienia przeguby wśród elementów drukowanych. Strona zawiera także osadzony film, więc określenie „tylko zdjęcia” jest niepełne |

Zmiana Ø32 na Ø60, zastąpienie przegubów, nowe ramiona i inne punkty zaczepienia wymagają własnego rachunku. Koncepcja słusznie oznacza sprzężenie powiek jako adaptację, a jego nominalny skok udało się odtworzyć. **Nie ma jednak podstaw, aby dziedziczyć ze źródeł potwierdzenie upakowania, wytrzymałości albo bezpieczeństwa.**

Także mocowanie serw na M3 w v2.8 ma potwierdzony model i eksport, lecz w dostępnej dokumentacji nie ma potwierdzenia wydruku tej wersji. Nie należy przedstawiać go jako sprawdzonego połączenia MG90S.

**Scenariusz porażki:** nazwa sprawdzonego projektu zastępuje dowód działania zmienionego podzespołu.

**Poprawka/test:** zachować rozróżnienie „źródło zasady” i „własna adaptacja”. Próbka P3 musi obejmować rzeczywiste okucia, oba cięgna, napęd i reprezentację gałki — inaczej nie sprawdzi A1.

**Pewność:** wysoka w granicach opisanych odczytów; filmy pozostają niezweryfikowane.

## A12. WAŻNE — B1–B4 nie zamykają blokad CAD ani wariantu bez zakupów

**Miejsce:** §7, §9, §12–13 i werdykt koncepcji.

**B1–B4 są potrzebne, lecz niewystarczające.** Dodatkowo trzeba rozstrzygnąć:

1. **Napęd powiek po poprawieniu A1.** B5 jest blokujące dla architektury, bo aktualny wariant nie ma wykonalnego stosu. Nie można przesunąć ewentualnego czwartego serwa do następnej wersji, jeśli pierwsza nie spełni 2c.
2. **Ochronę przekładni i siły kontaktu**, A2/A4.
3. **Sposób rozruchu**, A3.
4. **Mocowanie i jego zakres**, w tym limit liczby części oraz próba P5.
5. **Pełne wymiary końcówek kulowych:** odległość osi kulki od gwintu, szerokość oczka, artykulacja, długość regulacji, minimalne zazębienie i wytrzymałość na wypięcie.
6. **Konkretny kardan.** Obecna koncepcja zakłada tylny otwór 5 mm i przedni 3 mm, mimo że może chodzić o dwa osobne kardany. Mocowanie musi wynikać z wybranego egzemplarza.
7. **Rzeczywiste okucia**, przede wszystkim nakrętki i podkładki, oraz miejsce na narzędzia.
8. **Obrys z przewodami, wnętrze dyni i położenie sąsiadów.**

Nie wszystkie te punkty wymagają pytania do użytkownika. Błędy geometrii, stosów i obliczeń powinien najpierw usunąć realizator.

**Wariant bez zakupów:** obecna koncepcja go nie przedstawia. S–S wymaga odpowiednich końcówek, których posiadanie nie jest potwierdzone. U–S albo przeguby drukowane są możliwymi zmianami konstrukcji, lecz nie gotowymi zamiennikami. Drut z haczykami narusza przyjęte preferencje. Rezygnacja z DIN 913 wymaga nowego stosu, a nie samej zmiany Ø60 na Ø56.

**M2 w ramieniu B** wynika z autorskiego promienia 5 mm, nie z wymagań serwa. To wyjątek od M3 wymagający uzasadnienia lub zmiany geometrii; zwykła nakrętka M2 nie realizuje też wymagania samohamowania przegubów.

Do Variable Studio brakuje pełnych zależności położeń serw, osi kulek, warstw x, obrysów okuć, otworów Płyty i powierzchni ograniczników. Test K9 podaje przedziały, lecz nie oczekiwane zmiany wymiarów ani kryteria zachowania prześwitów.

**Scenariusz porażki:** wykonawca CAD sam wybiera brakujące rozwiązania, zmienia architekturę i odkrywa sprzeczności dopiero podczas budowy.

**Poprawka/test:** po usunięciu uwag przygotować jeden zwymiarowany wariant z kompletem części, zdefiniowanymi połączeniami i granicami pomiarów. Dopiero ten wariant powinien stać się podstawą briefu CAD.

**Pewność:** wysoka.

## Drobne korekty dokumentu

| Miejsce | Korekta |
|---|---|
| §9, krok 1 | 100° i 79° to szerokości sektorów czasz, a nie robocze skoki powiek 51° i 27° |
| §2.1 | Odwołanie B11 powinno wskazywać B10 |
| A4 | Dla pełnego walca Ø15 moment 1 N·m daje około **3,0 MPa**, nie 6 MPa; rzeczywisty przekrój z kieszenią wymaga osobnego rachunku |
| §4 i §11 | Usunąć prognozy czasu wykonania — użytkownik ich nie chce |
| §9 | Zdefiniować „połowę drogi” klina: połowę kąta serwa czy położenia powiek; przy nieliniowym przełożeniu to nie jest to samo |

Pewność korekt rachunkowych i redakcyjnych: wysoka.

## Warunki ponownego przyjęcia koncepcji

Kardan w środku kuli, nieruchome serwa i pręty S–S mogą pozostać podstawą. Nie znalazłem powodu, by odrzucić je za brak wymaganego ruchu. Podobnie sam nominalny skok sprzężenia powiek jest osiągalny.

Przed przygotowaniem briefu CAD wymagane są jednak:

- wykonalne, bezkolizyjne stosy napędu obu powiek z rzeczywistymi okuciami;
- rozwiązanie przeciążenia i ograniczenia siły, działające także przed ogranicznikiem;
- rozruch zgodny z wymaganiem użytkownika;
- spójne zakresy, obrys i droga montażu;
- pomiary kardana, MG90S i końcówek oraz rozstrzygające próbki;
- kompletny wariant 2c, bez uzależnienia jego podstawowej funkcji od późniejszej wersji.

Nie zmieniłem ani nie zapisałem żadnych plików. Nie uruchomiłem procesów w tle.

**Werdykt: NIE — przed napisaniem briefu CAD trzeba przeprojektować stos i mocowania napędu powiek oraz ochronę serw przed wymuszeniem, a także rozwiązać łagodny rozruch; centralny kardan i napęd gałki S–S mogą pozostać.**