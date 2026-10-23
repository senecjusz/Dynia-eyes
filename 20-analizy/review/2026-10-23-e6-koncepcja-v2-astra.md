# Review koncepcji dużego oka 2c v2 — Astra, 23.10.2026

**Zadanie:** E6.1b, niezależna kontrola przed briefem CAD.  
**Raport docelowy:** `20-analizy/review/2026-10-23-e6-koncepcja-v2-astra.md`.

**Koncepcja nie jest gotowa do briefu CAD.** Potwierdziłem nominalną kinematykę czterech napędów, lecz znalazłem kolizję pręta z powieką, niewłaściwie wyznaczone ograniczniki i niesprawdzony zakres ruchu podczas rozruchu. Połączenie M5 w pręcie Ø6 nie spełnia wymaganej grubości ścianek. Ochrona przekładni pozostaje niezaprojektowana.

Nie czytałem raportów innych recenzentów tej rundy. Przeczytałem wszystkie trzy raporty v1 oraz skrypty realizatora wskazane w załączniku koncepcji. Obliczenia własne wykonałem w Pythonie, bez zapisywania plików. Poniższe wyniki dotyczą geometrii nominalnej, nie gotowego CAD ani wydruku.

## 1. Co potwierdziłem niezależnie

Przyjąłem współrzędne v2 i `R = Rx(θ) · Ry(ψ)`. Długości prętów gałki wynikające z pozycji zerowej wynoszą **43,4166 i 44,9222 mm**; wartości 43,4/44,9 traktowałem jako zaokrąglenia.

| Wielkość | Wynik własny |
|---|---:|
| Serwo X, zakres pracy gałki ±25°/±15° | −28,575…+38,884° |
| Serwo Y, zakres pracy | −18,158…+24,888° |
| Serwo X, zadeklarowany zakres ograniczników ±27°/±17° | −30,358…+43,079° |
| Serwo Y, ten zakres | −20,352…+28,466° |
| Najmniejsza wartość osobliwa macierzy `dα/d(ψ,θ)`, siatka 1° | 0,632 w pracy; 0,542 w rozszerzonym zakresie |
| Moment serwa X przy zewnętrznych 0,5 N·m wokół ψ | maks. 0,644 N·m w pracy |
| Moment serwa Y przy zewnętrznych 0,5 N·m wokół θ | maks. 0,528 N·m w pracy |
| Górna powieka: skok serwa dla 58° powieki | 77,49° |
| Dolna: skok serwa dla 34° powieki | −51,95° |
| Górna: maks. kąt nacisku orczyk/zaczep | 46,01° / 46,50° |
| Dolna: maks. kąt nacisku orczyk/zaczep | 35,76° / 22,20° |
| `|dφ/dα|`, górna/dolna | 0,690–0,817 / 0,599–0,704 |
| Siła styczna na R33,4 przy 0,177 N·m | maks. 7,68 / 8,85 N |

**Wniosek:** w sprawdzonych zakresach nie wykryłem martwego punktu. Dwa osobne czworoboki powiek mają poprawny skok. Mieszanie przegubów M2/M5 samo w sobie nie psuje kinematyki S–S — decydują położenia środków, artykulacja i rzeczywiste gabaryty końcówek.

Nie potwierdza to bezkolizyjności, wytrzymałości ani wykonania ograniczników.

## 2. Uwagi KRYTYCZNE

### K1. Pręt Y koliduje z górną powieką; przemiatanie sprawdza inną geometrię niż dokument

**Miejsce:** §3.3, §5, załącznik A4; skrypt realizatora `v2/final.py`.

W koncepcji pręty mają **Ø6 albo 6×5 mm**. W skrypcie są odcinkami o promieniu **2 mm**, czyli Ø4. Ponadto odległość pręt–czasza jest sprawdzana tylko w **10 punktach wzdłuż pręta**.

Niezależny rachunek odległości do wewnętrznej powierzchni czaszy R31,2 daje:

| ψ | θ | Otwarcie górnej powieki od zamknięcia | Odległość osi pręta od czaszy | Luz dla Ø6 |
|---:|---:|---:|---:|---:|
| −25° | +9° | 56° | 2,819 mm | **−0,181 mm** |
| −25° | +15° | 56° | 2,937 mm | **−0,063 mm** |
| −27° | +9° | 58° | 2,037 mm | **−0,963 mm** |

Pierwsze dwa przypadki mieszczą się w zadeklarowanych niezależnych zakresach roboczych. Trzeci jest w zakresie, który koncepcja nazywa zakresem ograniczników.

Przykładowy punkt czaszy w trzecim przypadku:

```text
Q = (7,770; 20,219; −22,456) mm
|Q| = 31,2 mm
atan2(y,z) = 138° = 80° wycięcia + 58° otwarcia
odległość Q od osi pręta Y = 2,037 mm
```

Punkt leży w pasie wycięcia `x=0…13`. Kolizja nie wynika więc z odmiennej interpretacji szerokości wycięcia. Nawet **Ø4 ma tutaj tylko około 0,037 mm luzu**, a nie wymagane 0,5 mm. Pręt 6×5 zawiera przekrój kołowy Ø5, więc w trzecim przypadku również koliduje niezależnie od obrotu przekroju.

Dalsze rozbieżności skrypt–opis:

- skrypt rozszerza pas wycięcia zależnie od promienia badanego elementu: `−1−r…16+r`, zamiast rzeczywistego `0…13`;
- gałka–powieki sprawdzane są z dodatkowym przerzedzaniem próbek: `eye[::2]` i krokiem powieki 4°, nie wszędzie według deklarowanego 3°/2°/2°;
- zakres zamykania powiek **−0,5° do ogranicznika** jest pominięty;
- brak kompletnych uszu serw, śrub, nakrętek, przewodów, słupków klatki i rzeczywistych obudów końcówek.

**Scenariusz porażki:** pręt zatrzymuje otwierającą się powiekę; serwo dociska elementy, mimo zaliczonego przemiatania.

**Poprawka/test:** zmienić trasę pręta, wycięcie lub napęd tak, aby rzeczywisty przekrój z końcówkami miał ≥0,5 mm nominalnie i ≥0,2 mm po uwzględnieniu luzów. Odległości liczyć do całych odcinków i powierzchni, z zagęszczeniem przy minimum; ponowić kontrolę pełnych brył przed przyjęciem koncepcji.

**Pewność:** wysoka dla wskazanych przecięć nominalnych i rozbieżności skryptu.

### K2. Okno nie realizuje zadeklarowanych ograniczeń ±27°/±17°

**Miejsce:** §3.1, §8, załącznik A5; `v2/stop3.py`.

Skrypt zastępuje eliptyczny przekrój pochylonego Słupka **kołem o promieniu `R/cos(t)`**, a następnie buduje otoczkę wszystkich takich kół na granicy zakresu. To zawyża przekrój w kierunkach innych niż jego duża oś.

Dla rzeczywistego przekroju nieskończonego walca, w rozpatrywanej płaszczyźnie `z_gałki=−6`, funkcja podparcia wynosi:

```text
h(u) = c·u + R·√[1 + (vxy·u / vz)²]
```

Skrypt używa zamiast drugiego składnika stałej `R/|vz|`.

Dla okna otrzymanego metodą realizatora:

| Pozycja gałki | Pozostały odstęp przekroju od okna |
|---|---:|
| ψ=27°, θ=0° | około **0,392 mm** |
| ψ=0°, θ=17° | około **1,203 mm** |
| ψ=27°, θ=17° | kontakt w narożniku |

W tym samym modelu pojedynczej płaszczyzny kontakt podczas ruchu tylko jednej osi wypada około:

- **ψ=28,83°**, zamiast 27°;
- **θ=23,96°**, zamiast 17°.

To nie są przewidywane dokładne kąty gotowej części: dokument nie definiuje wystarczająco grubości płyty i kontaktu ze skończonym Słupkiem. Są natomiast dowodem, że przedstawiony rachunek **nie wyznacza deklarowanych ograniczników**. Same „półosie 12,04×11,04” nie definiują też kształtu otoczki.

Dodatkowo dokument podaje **0,46 mm** między ramą okna a prętem/końcówką M2 — poniżej wymaganego nominalnego 0,5 mm.

**Scenariusz porażki:** ręka przesuwa gałkę poza obszar sprawdzony pod kątem kolizji; pierwszym ograniczeniem staje się pręt, przegub albo powieka.

**Poprawka/test:** zachować drogę siły Uchwyt→Słupek, lecz przeprojektować powierzchnie kontaktowe na pełnych bryłach. Wyznaczyć rzeczywistą granicę ruchu dla każdej osi i ich kombinacji, uwzględniając grubość płyty, zakończenie Słupka i tolerancje. Jeśli pozostaje większy zakres mechaniczny, cały ten zakres wymaga ponownego sprawdzenia. Nie wystarczy przepisanie obecnych dwóch wymiarów okna do CAD.

**Pewność:** wysoka dla błędu modelu; dokładne kąty rzeczywistego kontaktu pozostają nieustalone.

### K3. Sprawdzenie pozycji gałki nie dowodzi bezkolizyjnego rozruchu niezależnych serw X/Y

**Miejsce:** §9, szczególnie zdanie „mechanizm przeżyje taki skok z każdej pozycji”.

Akceptuję decyzję użytkownika: NVS, potem rampa; skok po ręcznym przestawieniu lub zaniku zasilania podczas ruchu jest dopuszczony. Problem dotyczy **toru mechanicznego podczas tego skoku**.

Z powodu sprzężenia osi prostokąt w kątach gałki nie jest prostokątem w kątach serw. Przykład:

```text
Pozycja rzeczywista: ψ=−25°, θ=−15°
αX=+38,656°, αY=−17,771°

Pozycja zapisana/docelowa: ψ=+25°, θ=+15°
αX=−25,239°, αY=+24,888°
```

Gdy X osiągnie swój cel, a Y pozostanie przy początkowej wartości, rozwiązanie nominalnej kinematyki wynosi:

```text
ψ ≈ +27,437°
θ ≈ −21,643°
```

Obie pozycje końcowe są dozwolone. Pozycja pośrednia leży **poza sprawdzonym ±27°/±17°**. To istotne przy proponowanym uruchamianiu serw kolejno co 150 ms, a także przy różnicy prędkości dwóch napędów.

**Scenariusz porażki:** w drodze do poprawnego celu mechanizm trafia w ogranicznik lub inną część. Jeżeli ogranicznik zatrzyma ruch, serwo przez część rozruchu pracuje pod przeciążeniem.

**Poprawka/test:** sprawdzić obszar przejść w przestrzeni **kątów serw**, również dla różnych postępów X i Y między dowolnymi dopuszczalnymi stanami. Jednoczesne wysłanie PWM ogranicza problem, ale samo nie dowodzi jednakowego ruchu. Mechanika musi tolerować te przejścia albo mieć skuteczne odciążenie napędu podczas kontaktu. Test obejmuje ręczne przestawienie i różną kolejność uruchamiania X/Y.

**Pewność:** wysoka dla kontrprzykładu kinematycznego; konkretny tor rzeczywistych serw zależy od obciążenia i oporu cofania.

### K4. Pręt Ø6 z gwintem M5 nie ma wymaganej ścianki; zakończenia nie są zdefiniowane

**Miejsce:** §3.2, §5–6, B1.

Dla współosiowego gwintu M5:

- pręt Ø6 zostawia przy zewnętrznym obrysie gwintu **0,5 mm materiału na stronę**;
- przekrój 6×5 zostawia w cieńszym kierunku **zero nominalnej ścianki** przy Ø5;
- aby zachować 2 mm materiału wokół gwintu Ø5, lokalna średnica zakończenia musi wynosić co najmniej **Ø9**;
- kieszeń zwykłej nakrętki M5 wymaga jeszcze większego zakończenia: sześciokąt ma około 9,24 mm po narożnikach, zatem przy 2 mm otoczki około **Ø13,3**.

Nie opisano długości zazębienia M2/M5 w pręcie, wykonania gwintu, ustalenia metalowych trzpieni ani zabezpieczenia regulacji. Tabela §6 opisuje zamocowanie kulek do Uchwytu i Ramienia, lecz nie zamyka konstrukcji obu końców samego pręta.

**Scenariusz porażki:** rozwarstwienie lub pęknięcie zakończenia M5 podczas wkręcania albo wymuszenia ruchu; pogrubienie wykonane dopiero w CAD wprowadza kolejne kolizje.

**Poprawka/test:** po B1 wybrać jeden przekrój zakończenia, długości gwintów i sposób blokowania. Preferowane połączenie metalowego gwintu z nakrętką uwięzioną lub innym dodatnim zabezpieczeniem, jeżeli pozwala obrys. Zaktualizować przemiatanie o rzeczywiste pogrubienia. Próbka musi sprawdzać rozciąganie, ściskanie i zmianę długości po cyklach.

**Pewność:** wysoka dla grubości ścianek; wytrzymałość konkretnego połączenia wymaga próbki.

## 3. Uwagi WAŻNE

### W1. Ochrona przekładni jest możliwa do opracowania z dostępnych materiałów, ale v2 jej nie zawiera

**Miejsce:** §3.4, ryzyko 1, T1.

Potwierdzam **0,644/0,528 N·m** na serwach gałki. W całym deklarowanym zakresie mechanicznym maksima dla odpowiednich wymuszeń rosną w moim rachunku do około **0,734/0,565 N·m**. Moment zablokowania 0,177 N·m nie jest dopuszczalnym momentem niszczącym przekładnię.

T1 jest teraz opisany lepiej, lecz badanie przeciążeniowe nie zastępuje ochrony. W szczególności pomiar 30 N wymagany w P4 potwierdza utrzymanie końcówki, a nie jej działanie jako bezpiecznika.

**Propozycja do opracowania: sprzęgło cierne między fabrycznym orczykiem a napędzanym ramieniem.**

Punkt wyjścia do próbki:

- próg poślizgu **0,025–0,040 N·m**;
- wobec deklarowanych momentów roboczych około 0,008 N·m daje zapas **3,1–5×**;
- dwie powierzchnie cierne, przykładowy pierścień `ri=6`, `ro=10 mm`;
- średni promień tarcia przy równomiernym nacisku **8,17 mm**;
- dla założonego `μ=0,15–0,30` wymagany docisk:
  `N=T/(2μr)` ≈ **5–16 N**.

Materiały: drukowane elementy, zwykłe śruby, nakrętki i podkładki; sprężyste podtrzymanie docisku można opracować z posiadanego drutu. Fabryczny orczyk musi pozostać poprawnie przykręcony do serwa — **nie proponuję ochrony przez poluzowanie jego śruby środkowej**.

Przy progu 0,040 N·m siła styczna na R33,4 spada nominalnie do około **1,74 N górna / 2,00 N dolna**. To nie jest uniwersalna granica siły przycięcia: przy mniejszym ramieniu kontaktu siła rośnie.

**Ograniczenia propozycji:** nie potwierdziłem zmieszczenia takiego sprzęgła w obecnym układzie, szczególnie przy S_PG. Po poślizgu traci się zgodność pozycji mechanizmu z NVS; potrzebne jest ustawienie zera lub inne kontrolowane przywrócenie położenia. Próg trzeba zmierzyć w obu kierunkach, po cyklach i po pozostawieniu pod dociskiem.

Sam drut Ø1,2 nie jest kontrolowanym ogranicznikiem momentu. Element zrywalny również wymaga prób; zbyt mały przekrój może przeczyć wymaganiu ścianek ≥2 mm.

**Scenariusz porażki:** uszkodzenie przekładni albo kieszeni orczyka przed dojściem do ogranicznika; utrata zera po niekontrolowanym ugięciu.

**Poprawka/test:** wybrać i zweryfikować ochronę wszystkich czterech napędów. Powyższe liczby są założeniem próbki, nie gotowym, sprawdzonym rozwiązaniem CAD.

**Pewność:** wysoka dla braku ochrony i rachunku tarcia; średnia dla wykonalności konkretnego sprzęgła w dostępnym miejscu.

### W2. Drut jest liczony jak prosty pręt, choć ma znaczne wykorbienie; zakończenia Z są niedopisane

**Miejsce:** §3.3, §6, A3–A4, P3.

Siła w łączniku wynosi:

```text
F = T / (r · cos kąta nacisku)
```

Zamiast podanych 8,9 N otrzymuję maksymalnie:

- **12,74 N** dla górnej powieki;
- **12,46 N** dla dolnej.

Eulerowskie 80 N dla prostego, przegubowo podpartego drutu Ø1,2×50 mm jest arytmetycznie poprawne, ale **nie opisuje wykorbionego łącznika**. W skrypcie górny drut przechodzi z `x=−22` do `x=−32,5`, czyli ma przesunięcie **10,5 mm**. To wnosi zginanie i podatność, których nie obejmuje zapas „9×”.

Dla skali problemu: uproszczony odcinek wspornikowy długości 10,5 mm, obciążony 12,75 N, daje około **0,24 mm ugięcia** i **789 MPa naprężenia zginającego**. Nie jest to pełny model drutu; pokazuje, że podatności nie można pominąć przy prześwicie 0,52 mm.

Dodatkowe braki:

- Ø1,4/1,2 daje **0,10 mm promieniowo**, a Ø1,3/1,2 tylko **0,05 mm**, wobec ogólnego zalecenia 0,2 dla obrotu;
- otwory Ø1,3 i Ø1,4 występują równocześnie jako docelowe;
- zakończenie obejmujące płytkę 2,4 mm dwoma ramionami drutu Ø1,2 zajmuje co najmniej **4,8 mm** w osi, przed dodaniem luzu; opis „±1,8” nie jest całkowitym gabarytem;
- brak promieni gięcia, długości końcówek zabezpieczających i drogi włożenia gotowego Z;
- modelowany górny drut ma już **49,95+10,5=60,45 mm** prostych odcinków przed dodaniem zakończeń; „około 60 mm” materiału nie wystarcza jako wymiar wykonawczy;
- po uwzględnieniu pominiętego położenia zamykającego −0,5° odstęp modelowanego drutu od rury spada do około **0,486 mm**.

**Scenariusz porażki:** drut ugina się do rury, wyciera otwór, zmienia długość skuteczną albo wysuwa się z zaczepu.

**Poprawka/test:** zwymiarować pełny kształt drutu i przyrząd gięcia; sprawdzić otwór, luz osiowy, retencję oraz ugięcie pod obciążeniem. P3 ma mierzyć również zużycie otworów, zmianę pozycji powieki, deformację drutu i pozostawanie końcówek na miejscu — nie tylko DIN 913 i kąciki.

**Pewność:** wysoka dla sił i braków wymiarowania; orientacyjna dla uproszczonego modelu zginania.

### W3. Siły przycięcia i luzy są poprawione nominalnie, ale tolerancje nadal nie są zamknięte

**Miejsce:** §3.3–3.4, §6, P3.

Siły 7,7/8,8 N dotyczą stycznego kontaktu na R33,4. Dla kontaktu o ramieniu 4 mm te same momenty dają około **64/74 N**. Nie twierdzę, że palec dociera do takiego miejsca — trzeba wskazać dostępne szczeliny i rzeczywiste ramiona kontaktu.

Przycięcie kącików poprawia nominalną szczelinę do około 0,5 mm. Jednak dwa niezależne otwory Ø3,4 na osiach Ø3 mogą pozwolić na względne przesunięcie powiek do **0,4 mm**. Konserwatywnie pozostaje wtedy tylko **0,1 mm**, poniżej wymaganych 0,2 po uwzględnieniu luzów.

DIN 913 nadal obraca się względem uch gwintowaną powierzchnią i nie ma dodatniej blokady wędrówki. Mniejszy otwór Ø2,5 zwiększa opór wkręcania, ale nie dowodzi zabezpieczenia.

Deklarowana szczelina kołnierza 0,5 mm także nie jest jednolita: jeśli kołnierz R35,2 leży przy `z=+10`, przekrój rantu R34,7 daje około **1,97 mm**, a czaszy R33,4 około **3,33 mm**.

**Scenariusz porażki:** krawędzie ocierają po przesunięciu na osiach; powieka wciąga przedmiot w szczelinę; wkręt przemieszcza się ku gałce.

**Poprawka/test:** tolerancje liczyć dla rzeczywistych stopni swobody i ugięć. Zdefiniować blokadę osi oraz dostępne strefy kontaktu. Siłę mierzyć na przyrządzie w kilku miejscach każdej powieki i między powiekami. Nie uznawać wartości 8,8 N za globalnego maksimum.

**Pewność:** wysoka dla nominalnych rachunków; dostępność stref kontaktu wymaga pełnego modelu.

### W4. Znaki ruchu i część danych wykonawczych pozostają sprzeczne

**Miejsce:** definicja osi, §3.3, §7–10, B1/B4.

Przy `+y` w górę i macierzy użytej w rachunkach:

```text
Rx(θ) · (0,0,1) = (0, −sinθ, cosθ)
```

Dodatnie θ kieruje zatem wzrok **w dół**, podczas gdy §7 przypisuje dodatniemu serwu Y ruch w górę. Reguła podążania powiek używa przeciwnej interpretacji niż geometria.

Przy θ=+15° dolny brzeg tęczówki Ø27 leży około **−41,74°**, ale obecna reguła pozostawia dolną powiekę na −38°. Brakuje **3,74° otwarcia**.

Pozostałe braki:

- §9 zapowiada wzór odwrotny, lecz nie podaje współczynników ani wyboru gałęzi;
- `K9: kulaD 58↔60` nie ma spójnych zależności: `obwiedniaR` wynika z otworu 80, więc sama zmiana kuli nie zmienia promienia rury;
- skrócenie `dociskMax` nie ma zdefiniowanego wpływu na położenia serw i tylny koniec modułu;
- stos M5×30: **4+21+6=31 mm**, więc wskazana śruba nie zapewnia deklarowanego zagłębienia 6 mm przy dosłownym stosie;
- brak dokładnych współrzędnych słupków Płyty, łuków Uchwytu, ograniczników powiek i zabezpieczeń regulacji;
- B1 nie rozdziela jednoznacznie gwintu mocowania kulki od gwintu łączącego obudowę z prętem ani nie podaje odległości środka kulki od powierzchni mocowania;
- próg B1 pozwala na obudowy M2 7–7,5 i M5 14–15 mm bez jednoznacznego statusu, choć rachunek używa Ø7/Ø14;
- B4 wymaga także ustalenia szerokości ucha i pozostałego materiału po ewentualnym rozwierceniu.

**Scenariusz porażki:** wykonawca odwraca ruch lub podążanie powiek, dobiera brakującą geometrię samodzielnie albo przelicza układ dopiero w CAD.

**Poprawka/test:** zachowując obecną macierz, nazwać θ dodatnie jako ruch w dół i odwrócić warunki podążania; alternatywnie konsekwentnie zmienić znak θ we wszystkich równaniach i tabelach. Uzupełnić jeden wykonawczy zestaw danych, z jednoznacznymi granicami akceptacji pomiarów.

**Pewność:** wysoka.

### W5. Obejma nie ma jeszcze dowodu utrzymania w mokrym miąższu

**Miejsce:** §4, P5.

Potwierdzam:

- 225 g → **2,21 N**;
- przy ramieniu 23,7 mm moment ciężaru ≈ **0,0523 N·m**;
- pole pierścienia Ø84/80 ≈ **515 mm²**.

Natomiast `0,7 N·m / 15 mm = 46,7 N` jest tylko wybraną idealizacją drogi reakcji. Nie dowodzi równomiernego rozłożenia tej siły na całym rancie. Przy przechylaniu część pierścienia odciąża się, a kontakt staje się lokalny. Także 900 mm² pod Obejmą pozostaje założeniem.

Zacisk Obejmy na rurze nadal nie wytwarza kontrolowanego osiowego docisku dyni. PETG nie eliminuje pełzania ani osiadania miąższu. P5 ma ±10 N, choć wymagany nacisk na gałkę wynosi 20 N.

**Scenariusz porażki:** Obejma trzyma rurę, ale cały moduł kołysze się lub wciska rant w osłabioną ściankę.

**Poprawka/test:** P5 dla ścianek 15/35 mm, z obciążeniem osiowym co najmniej ±20 N i momentem 0,7 N·m w kilku kierunkach; pomiar po 24/72 h, przed i po ponownym dokręceniu. Dodać owalizację rury i zachowanie prześwitów mechanizmu podczas zacisku. Dokręcenie po dobie nie może zastąpić wyniku sprzed dokręcenia.

**Pewność:** wysoka dla braku dowodu; nośności konkretnej dyni nie da się ustalić z dostępnych danych.

### W6. Głębokość nie zostaje naprawiona samym skróceniem rury; cel masy wymaga większej zmiany

**Miejsce:** §2, §5, §13, A7.

**Głębokość 67 mm za ścianką 15 mm jest policzona poprawnie.** Problemem jest proponowany zamiennik: górny przegub H dochodzi do `z≈−70,7`, a jego gabaryt wyznacza tył około −72. Skrócenie samej rury lub zmiana `dociskMax` nie przesuwa tego napędu.

Minimalne wymaganie „wolne ≥67” nie daje rezerwy montażowej ani miejsca na przewody. B5 jest zatem warunkiem integracji, nie luźną informacją.

Suma pozycji A7 wynosi **219,1 g**, co mieści się w uczciwym szacunku 225±20%. Osiągnięcie 130–150 g przez drobne wybrania jest jednak mało realne:

- wymienione części kupne: **102,6 g**;
- Gałka i obie powieki: **39,5 g**;
- przy celu 150 g zostaje tylko **7,9 g** na Ramę, Płytę, Obejmę, Słupek, Uchwyt i napędy.

Możliwe oszczędności bez ścianek <2 mm, do sprawdzenia konstrukcyjnego:

- wybranie 60% materiału nieobciążonej części przedniego pasa rury długości 13 mm: około **4,7 g**;
- perforacja 60% pełnej tarczy Ø79×3: około **10,9 g**, przed dodaniem żeber;
- zmiana ścianek powiek 2,2→2,0: około **1,9 g** według skalowania obecnych mas.

To oszczędności rzędu kilkunastu gramów, nie 75–95 g. Nie wolno przy tym naruszyć pełnego pasa pod Obejmą.

**Scenariusz porażki:** skrócona rura nadal nie mieści napędu przy wieży; odchudzanie usuwa podparcie albo zwiększa ugięcia.

**Poprawka/test:** mierzyć obrys całego zespołu z kablami. Jeżeli miejsca jest za mało, zmienić układ tylnego napędu i ponowić kinematykę. Masę uzyskać z brył po zdefiniowaniu klatki i otworów; 130–150 g traktować jako cel wymagający przebudowy, nie wynik bieżących korekt.

**Pewność:** wysoka dla głębokości i sum; orientacyjna dla oszczędności.

### W7. Montaż i DFAM są poprawione, lecz nie zamknięte

**Miejsce:** §5, §10.

**Zgodne nominalnie:** Ø79,5 daje 0,25 mm luzu na stronę w Ø80; rant Ø84 wystaje 2 mm. Pojedyncze części mieszczą się na A1 mini. W dyni nie przewidziano łączenia przegubów.

Pozostają:

- brak dowodu nasuwania Obejmy przez cały tył z uszami serw, łbami, przewodami i wtyczkami;
- brak wykazanej drogi narzędzia do obu M4 kardana po założeniu gałki i Ramy;
- brak wykazanej drogi zakładania gotowego Z w kroku 8;
- przypisanie synowi wkręcania DIN 913 kluczem przeczy decyzji „narzędzia obsługuje ojciec”;
- twierdzenie, że pręt X nie sięga orczyka odwróconego o 180° „o 26 mm”, jest błędne: długość zmienia się z **43,42 do 50,61 mm**, czyli o 7,19 mm; druga gałąź rozwiązania nie musi być odwróceniem o 180°;
- Gałka R28 nadal ma wewnętrzną strefę nawisu >45°, zaczynającą się przy średnicy około **39,6 mm**;
- walec Ø6 „drukowany płasko” nie ma płaskiej powierzchni podparcia;
- orientacja powiek wymaga sprawdzenia zaczepów i przyciętych krawędzi względem stołu.

**Scenariusz porażki:** podzespoły mieszczą się w pozycji złożonej, ale nie dają się połączyć; wydruk wymaga podpór w nieprzewidzianych miejscach.

**Poprawka/test:** rysunek kolejności montażu z drogami części i narzędzi, transportowa pozycja powiek, wzornik Ø80 i kontrola drogi Obejmy. Przenieść wszystkie czynności narzędziowe do ojca. Dla Gałki określić próbę druku i wariant podpór od wnętrza; prętowi nadać rzeczywistą płaską stronę.

**Pewność:** wysoka dla wskazanych sprzeczności; możliwość montażu wymaga pełnej geometrii.

### W8. Prąd i utrzymanie pozycji pozostają założeniami; odstęp 150 ms nie ogranicza prądu awarii

**Miejsce:** §9, T1.

Kanały **12–15** dla dużego oka i **0–11** dla małych są poprawne. Podtrzymanie przez GPIO z tranzystorem jest opisane właściwie.

Przy przyjętych 0,65–0,8 A na MG90S cztery zablokowane serwa pobiorą **2,6–3,2 A**, przed ESP i małymi oczami. Uruchamianie co 150 ms nie gwarantuje zakończenia ruchu ani ustania przeciążenia poprzedniego napędu. E5.5 sprawdzający podtrzymanie powerbanku nie zastępuje testu wydajności prądowej czterech MG90S.

Odważnik 25 g na 16 mm daje **0,003924 N·m**, około 1,2× podanego momentu ciężaru. To sensowna poprawka testu v1, lecz wynik nadal nie jest znany.

Temperatura obudowy ≤50°C po 10 s zablokowania nie wystarcza jako kryterium stanu uzwojenia ani przekładni.

**Scenariusz porażki:** opadnięcie bez PWM, reset zasilania i ponowiony rozruch albo nagrzewanie zablokowanego serwa.

**Poprawka/test:** zmierzyć egzemplarze Miuzei przy rzeczywistym napięciu i okablowaniu: spoczynek, start, cztery napędy, przeciążenie. Rejestrować napięcie przy serwach i restarty ESP. Test bez PWM wykonać osobno z zasilaniem i bez niego. Zdefiniować reakcję na zablokowanie i nie uznawać szacunków za pomiar.

**Pewność:** wysoka dla budżetu warunkowego i ograniczeń testu; rzeczywiste prądy nieznane.

## 4. Zamknięcie uwag z pierwszej rundy

„Częściowo” oznacza, że poprawiono przyczynę lub opis, lecz nadal brakuje dowodu albo występuje nowy problem w tym obszarze.

### Astra v1

| ID | Ocena v2 |
|---|---|
| A1 — okucia i stosy powiek | **Częściowo:** stare kolidujące śruby usunięto; nowy drut wymaga W2, a nowa kolizja jest w K1. |
| A2 — ograniczniki i przeciążenie | **Otwarte:** właściwa droga siły jako kierunek, ale K2 i W1. |
| A3 — rozruch | **Wymaganie zmienione decyzją użytkownika; technicznie otwarte K3.** |
| A4 — siła przycięcia | **Częściowo:** wzór osobno dla każdej powieki poprawny; dostępne miejsca i ograniczenie siły — W1/W3. |
| A5 — kinematyka | **Częściowo:** skoki i przełożenia potwierdzone; znaki i przejścia — K3/W4. |
| A6 — obrys i montaż | **Częściowo:** DIN 913 dostępne, głębokość poprawna; pełny obrys i droga montażu — W6/W7. |
| A7 — Obejma | **Częściowo:** dwie części, właściwe pole rantu i moment ciężaru; nośność — W5. |
| A8 — luzy | **Otwarte:** K1/K2 oraz W2/W3. |
| A9 — DFAM | **Częściowo:** Rama odwrócona, podpory powiek nazwane; W7. |
| A10 — prąd i bez PWM | **Częściowo:** cztery serwa i cięższy odważnik uwzględnione; W8. |
| A11 — źródła | **Zasadniczo poprawione:** źródła zasad potwierdzone w zakresie sekcji 5; nie potwierdzają konkretnej adaptacji. |
| A12 — gotowość CAD | **Otwarte:** K1–K4, W4/W7 i pomiary B1/B4. |

### Fable v1

| ID | Ocena v2 |
|---|---|
| K1 — dźwignia poza obrysem | Stara dźwignia usunięta; **pełny obrys nowego napędu niepotwierdzony**. |
| K2 — kolizje obu cięgien | Stare sprzężenie usunięte; **nowy test kolizji niewystarczający — K1**. |
| K3 — okucia w gałce | Stare okucia usunięte; **retencja i gabaryty Z — W2**. |
| W1 — wariant Ø55/56 | **Zamknięte jako nieaktualne:** DIN 913 są dostępne. |
| W2 — ograniczniki na prętach | **Częściowo:** przeniesione na Uchwyt/Słupek, lecz K2/W1. |
| W3 — końcówki kulowe | **Otwarte:** B1 oraz K4/W4. |
| W4 — kable | **Częściowo:** kierunek i kanały opisane, bez geometrii i sprawdzenia. |
| W5 — warstwy cięgien | Stare sprzeczne warstwy usunięte; **nowy kształt drutu niedopisany — W2**. |
| W6 — pas Obejmy | **Geometria pasa poprawiona;** owalizacja i pełzanie wymagają W5. |
| W7 — Płyta | **Częściowo:** tarcza cofnięta, ale słupki i okucia nadal „do Assembly”. |
| W8 — osiowe mocowanie kardana | **Częściowo:** M4 przez ściankę daje dodatnie ustalenie; brak sprawdzenia całej drogi siły i próby. |
| W9 — Rama nie leży płasko | **Kierunkowo zamknięte:** tyłem na stole, rant fazowany; do kontroli na bryle. |
| W10 — za łagodna P5 | **Częściowo:** moment 0,7 N·m i 72 h dodano; siła osiowa nadal za mała — W5. |
| W11 — wycięcia czasz | **Otwarte:** wycięcie dodano, ale K1 wykazuje jego niewystarczalność. |
| W12 — mapa i znaki | **Częściowo:** tabela istnieje, lecz znak góra–dół jest sprzeczny — W4. |

### Opus v1

| ID | Ocena v2 |
|---|---|
| O-K1 — sprzężenie nie mieści się | Stara architektura usunięta zgodnie z decyzją; **nowa ma kolizję K1**. |
| O-W1 — kryterium testu ręki | **Kryterium dopisane**, ochrona i kompletność testu pozostają W1/W8. |
| O-W2 — kąciki | **Nominalnie poprawione**, tolerancje niezamknięte — W3. |
| O-W3 — nawisy | **Częściowo:** W7. |
| O-W4 — DIN 913 | **Częściowo:** test 1000 cykli dodano, dodatniej blokady nadal brak — W3. |
| O-W5 — ogranicznik w zakresie pracy | **Nieprzyjęte:** nowy rachunek nie określa deklarowanej granicy ruchu — K2. |
| O-W6 — okucia i braki geometrii | **Częściowo:** DIN 985 poprawione; K4 i W4 pozostają. |

Nie przyjmuję zatem tabeli §15 v2 jako dowodu zamknięcia wszystkich uwag KRYTYCZNYCH i WAŻNYCH.

## 5. Źródła — zakres rzeczywistej weryfikacji

| Źródło | Co sprawdziłem | Czego nie potwierdza |
|---|---|---|
| [Cogley Simplified — Make](https://makezine.com/projects/simple-animatronic-eyes/) | Pełny tekst: wspólna oś ruchu góra–dół i powiek, sześć serw na parę oczu, łączniki powiek, podążanie za spojrzeniem. | Zaczepu x−22, wykorbionego drutu i upakowania v2. |
| [EyeMech ε3.2](https://github.com/will-cogley/EyeMech_Epsilon) | README: sześć serw, oddzielne wyjścia Top/Bottom Left/Right na GPIO12–15. | Konkretnej geometrii ani ochrony przeciążeniowej v2; filmu nie oglądałem. |
| [„On the Cheap”](https://www.instructables.com/3D-Printed-Animatronic-Eye-Mechanism-on-the-Cheap/) | Fragment instrukcji dostępny w indeksie wyszukiwarki potwierdza haczyk z drutu między orczykiem a otworem gałki. | Zakończenia Z Ø1,2 w powiece 2,4 mm ani wykorbienia 10,5 mm. Pełna strona nie zwróciła treści. |
| [DIY Compact](https://www.instructables.com/DIY-Compact-3D-Printed-Animatronic-Eye-Mechanism/) | Fragmenty instrukcji potwierdzają ball-links, popychacze i ich połączenia z orczykami. | Nie potwierdziłem w tej rundzie pełnej topologii wszystkich końców popychaczy. |
| [Stan Winston, komentarz 6206](https://forums.stanwinstonschool.com/discussion/comment/6206) | Próba dostępu. | Treść niedostępna; cytatu nie oznaczam jako niezależnie sprawdzonego. |
| [Components101 MG90S](https://components101.com/motors/mg90s-metal-gear-servo-motor) | 1,8 kgf·cm przy 4,8 V, 2,2 przy 6 V, masa 13,4 g. | Prądu ani dopuszczalnego mechanicznego przeciążenia konkretnych Miuzei. |

Źródła potwierdzają zasadę wspólnej osi i osobnych napędów powiek. Nie stanowią dowodu działania nowego układu w Ø79,5. citeturn412116view0turn870447view2turn412116search0turn540386view2

## 6. Drobne korekty i kompletność prób

- §15 podaje wzajemny odstęp elementów powiek ≥10 mm, a A2/A4 **4,7 mm** — ujednolicić i wskazać parę.
- A3 opisano „co 8°”, lecz tabela pokazuje głównie kroki 16°.
- §2 odsyła głębokość do B6, choć właściwe pytanie to B5.
- Obliczenie „ucho pęka przy 450 N” dla przekroju 2,4×2,35 implikuje około **80 MPa**. Bez kierunku warstw, karbu i zginania nie potwierdza kolejności uszkodzeń.
- Próba P4 musi obejmować całe połączenie: kulka, obudowa, pręt i gwinty; samo utrzymanie kulki przy 30 N jest niewystarczające.
- W briefie CAD potrzebny jest dostępny wraz z nim model obliczeniowy. Skrypty pozostawione wyłącznie w scratchpadzie sesji nie zapewniają odtwarzalnej kontroli po zmianach.

Pewność korekt dokumentacyjnych i arytmetycznych: wysoka.

## 7. Co musi być rozstrzygnięte przed briefem CAD

Można zachować **gałkę Ø60, kardan 5/5, cztery MG90S, nominalną zasadę S–S oraz dwa osobne czworoboki powiek**. Nie ma potrzeby wracać do jednego serwa powiek.

Przed zleceniem budowy trzeba jednak:

1. Usunąć kolizję pręta Y i zweryfikować rzeczywiste zakończenia M2/M5 oraz druty.
2. Zdefiniować pełną geometrię ogranicznika Uchwyt–Słupek i rzeczywistą granicę ruchu.
3. Zaprojektować ochronę przekładni oraz sprawdzić przejścia rozruchowe w przestrzeni kątów serw.
4. Uzupełnić B1/B4, poprawić znaki, stosy i zależności parametrów.
5. Zamknąć drogę montażu, obrys z przewodami oraz wymagania prób mocowania i napędów.

To są zmiany wymagające ponownego rachunku koncepcji. Orkiestrator nie może ich zastąpić wpisem „sprawdzić w Assembly”, pozostawiając wykonawcy CAD wybór rozwiązania.

Nie zmieniłem plików ani nie uruchomiłem procesów pozostających w tle.

**Werdykt: NIE — przed briefem CAD trzeba przeprojektować kolidujące połączenie pręt–powieka, zakończenia prętów M5 oraz geometrię ogranicznika i dodać ochronę przeciążeniową obejmującą także rozruch; centralny kardan i cztery osobne napędy mogą pozostać.**