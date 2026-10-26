# Review Astra: słupki i podpora płyty dużego oka v3

26.10.2026 · oceniony HEAD `41c5140`, porównanie z `881d818` · zakres: cztery punkty briefu `2026-10-26-slupki-brief.md`. Bez czytania raportów `*-opus.md`.

## Wynik

**Zapas 2,9 nie jest rzeczywistym minimum.** Skrypt pomija przekrój bezpośrednio przed końcem żebra obu zawiasów. Pogrubione nasady pomagają, ale słabsze miejsce pozostaje na z≈−20 mm. Ponadto plik do druku nie ustawia stopki i podstawy podpory na wspólnej płaszczyźnie.

| Waga | Miejsce i dowód | Scenariusz porażki; poprawka albo test | Pewność |
|---|---|---|---|
| **KRYTYCZNE K1** | `plyta()` / `c45`, 3MF z podporą: najniższe Z płyty **−0,62132 mm**, podpory **0 mm**. Stopka ma **84 × 3 mm**, nie 84 × 4,2. | Wspólne podniesienie zestawu zostawi podporę 0,621 mm nad stołem; osobne opuszczenie obiektów zmieni styki, a obcięcie ujemnego Z zmieni stopkę. Poprawić zgodność fazy i transformacji, przeliczyć podporę względem poprawionej płyty i sprawdzić pierwszą warstwę obu części w slicerze. | Wysoka: odczyt XML 3MF, bez transformacji elementów `build`. |
| **WAŻNE W1** | Oba zawiasy, koniec `sl_zebro`: A spada z **40,891 do 23,867 mm²**, moment bezwładności dla siły X z **57,164 do 11,448 mm⁴** na z=−20,01/−19,99. Przy 4,3 N: **9,80 MPa**, a nie maksimum 7,0. Przy ręcznym nacisku 10 N: **22,79 MPa**. | Nacisk boczny podczas składania albo zdejmowania podpory może złamać ramię przy uskoku. Wyprowadzić żebro łagodnie do ramienia lub zapewnić miejscowe podtrzymanie i zweryfikować próbą siły; przeliczyć wszystkie uskoki, nie tylko osiem wydrukowanych wierszy. | Wysoka dla geometrii i rachunku nominalnego; średnia dla wytrzymałości wydruku. |
| **WAŻNE W2** | `podpora_plyty()`: trzy poprzeczki na Z=22/42/62 mm mają po dwa mostki **33,9 mm**, szerokość 1,6 mm. Łącznie **325,44 mm² poziomego spodu nad pustką**. | Podpora sama wymaga mostkowania; opis „bez nawisów” obejmuje tylko płytę. Zastąpić dolne krawędzie skosami albo dopuścić mostki po sprawdzeniu ścieżek i próbie na docelowym profilu. Nie stwierdzam, że mostek 33,9 mm musi się nie udać. | Wysoka dla wymiarów; wynik druku niezweryfikowany. |
| **WAŻNE W3** | Łączniki pod ramionami: **6 na ramię**, pod kardanem 2; pod płytą 32. Stożek Ø0,7 kończy się 0,2 mm wewnątrz części: na powierzchni kontaktu ma około **Ø0,84**, pole około **0,54 mm²**. Ścianki wiążą trzy poprzeczki. | Odchylanie całej ścianki na bok obciąża słaby kierunek ramienia przez kilka łączników. Przy założonym ścinaniu 10 MPa jeden kontakt przenosi około **5,4 N**; to oszacowanie ścinania, nie pomiar siły odłamania przez zginanie. Nie ma dowodu, że zawsze pęknie podpora przed ramieniem. Odcinać łączniki pojedynczo, podtrzymując ramię, albo poprawić karb i zrobić próbę odłamywania tej samej geometrii/orientacji. | Wysoka dla geometrii; średnia dla scenariusza pękania. |
| **WAŻNE W4** | Obciążenia w `duze-oko-v3-slupki.py`: użyto F=T/r. Z kinematyki i **F=T/\|e·(r×u)\|**, dla T=216 N·mm, wychodzi maksymalnie **18,63 N L–P; 21,05 N G–D; 11,06 N powieka G; 10,74 N powieka D**. | Siła przy zablokowaniu jest niedoszacowana, zwłaszcza L–P (12,3 N). Dwa druty gałki mogą dać do **39,36 N osiowo**, nie 31 N. Poprawić przypadki obciążeń i ich jednoczesność; nie traktować wyników F=T/r jako górnej granicy. | Wysoka w modelu kinematycznym; moment rzeczywistego MG90S jest założeniem. |
| **DROBNE D1** | `decyzje.md` na tym commicie nie zawiera trzech szczegółowych decyzji o nasadach, druku 45° i osobnej podporze wskazanych w briefie. | Przyjmuję je jako autoryzowane przez brief PM; należy uzupełnić zapis projektu. Nie jest to powód do zmiany koncepcji. | Wysoka. |

## Własny rachunek wytrzymałości

Założenia, **nie pomiary filamentu**: PLA w temperaturze pokojowej, E=2500 MPa, rozciąganie wzdłuż warstw 40 MPa, w poprzek 15 MPa, ścinanie między warstwami 10 MPa. Przekroje liczone jako pełne; bez wskazania obrysów/wypełnienia nie można przenieść wyników wprost na wydruk. Pominięte koncentracje naprężeń przy ostrych uskokach obniżą rzeczywisty zapas.

Niezależnie od skryptu autora przeciąłem siatkę `Plyta.3mf`, po cofnięciu orientacji druku, i policzyłem pole, środek oraz pełną macierz momentów przekroju całkami wielokątowymi, z iloczynem bezwładności. Przegląd z co 0,1 mm i dodatkowo po obu stronach uskoków; nasady nad płytą także przekrojami y. Rachunek belkowy, nie MES.

| Element / obciążenie | Naprężenie nominalne i ocena |
|---|---|
| **Lewy i prawy zawias**, 4,3 N w X na osi, bez kleju | Identycznie **9,80 MPa** tuż przed z=−20. Według kryterium autora 20/σ zapas **2,04**, nie 2,9. Dla mojej ostrożnej granicy 15/σ: **1,53**. |
| Oba zawiasy, ręka **10 N w X** [własne założenie montażowe] | **22,79 MPa**; 15/σ=**0,66**. Przy idealnym druku 45° samo σzz daje σ⊥=σ∥=τ=σ/2: kryterium najsłabszej składowej daje **0,88** (ścinanie). To nie ma wystarczającego zapasu. |
| Zawias, porównawcze **8,6 N w Y** z raportu | Maksimum w przekrojach z: **4,49 MPa** przy z≈−20; w sprawdzonych przekrojach nasady y: około **4,18 MPa**. Dla pojedynczej powieki górnej nawet obwiednia całej siły 11,06 N w Y daje około **5,77 MPa**, 15/σ≈**2,6**. Przy równoczesnym zablokowaniu obu powiek skrajna obwiednia 11,06+10,74=**21,80 N**, cała w Y na jednym słupku, daje **11,38 MPa**, 15/σ≈**1,32**. To celowo zawyżona obwiednia bez korzystania z podziału reakcji między dwa zawiasy; nie dowodzi awarii, ale też nie uzasadnia deklaracji zapasu ≥2,9. |
| **Kardan**, 19 N osobno w X albo Y | Maksima odpowiednio **3,91 / 3,58 MPa**. Nie potwierdzam wskazania z=−36 jako rzeczywistego minimum zapasu: autor łączy największe c z najmniejszym I z różnych osi, otrzymując sztucznie zawyżone zginanie. |
| Kardan, ostrożna wspólna obwiednia **±19 N X, ±19,5 N Y, ±40 N Z** | Maksimum normalne **6,08 MPa** przy początku gniazda łba, z≈−19,45. Z T=60 N·mm w tym pierścieniu τ≈**0,29 MPa**; konserwatywne 15/(6,08+0,29)≈**2,35**. Słupek centralny wygląda wystarczająco do próby; brak podstaw do dokładania części. Ręczne 10 N w X daje około **2,06 MPa**. |

Przy E=2500 MPa ugięcie niepodpartego zawiasu od 4,3 N w X wynosi około **0,64 mm**, a od 10 N około **1,49 mm**, wobec 0,3 mm luzu ucha. Kardan przy 19 N w X: około **0,16 mm**. Są to ugięcia belki, bez podatności płyty i kleju.

**Klej:** wzór M=F·a/2 i liczby 24/35/45% są poprawne dla idealnej belki o stałym EI z idealnym podparciem w tylnym brzegu tuby. Tutaj EI zmienia się znacznie, a klej na gorąco ma nieznaną podatność, powierzchnię i temperaturę pracy. Nie przyznaję tym procentom statusu pomiaru. Co ważniejsze, punktowe podparcie na z=−24/−34/−44 **nie zmniejsza momentu w słabym przekroju z≈−20**, leżącym przed każdym z tych podparć. Klej nie chroni też przed uszkodzeniem podczas montażu na stole ani zdejmowania podpory.

## Luzy, droga montażu i zgodność

- Własny pomiar na siatkach: **płyta–tuba 50: 0,547 mm, zero przecięć**. Promień wzmocnienia ≤37,6 wobec wpisanego promienia światła tuby około 38,147 zapewnia ten luz również przy osiowym wsuwaniu od tyłu; szeroka płyta kończy drogę 2 mm przed kołnierzem. To nominalna droga współosiowa, bez luzów montażowych, kleju i przekoszenia.
- Powieki względem płyty, obrót 0–51,5° co 0,5°: **zero przecięć**, minima **0,300 mm górna**, **1,700 mm dolna**. Wzmocnienia nie zabierają nominalnej drogi wsunięcia uszu od przodu; ich część wchodząca do x<34,7 kończy się na z=−20, za uszami podczas wsuwania.
- Druty względem nowej płyty: **L–P 3,00; G–D 2,34; górny 12,47; dolny 3,24 mm**. Własne próbkowanie osi drutu co ≤0,15 mm, promień 0,6; gałka ±35/±25° co 5°, powieki co 0,5°. To model łamanych „Z” z osiami nóg według wspólnej kinematyki, **nie niezależne rozwiązanie całego sztywnego drutu** ani dowód ciągłego minimum. Nie znalazłem kolizji spowodowanej żebrami; podatność i luzy przegubów pozostają poza tym pomiarem.
- Kontrola dostarczonego 3MF płyty z podporą: **6278 trójkątów, 0 otwartych krawędzi, 0 krawędzi >2, 0 degeneracji, 2 bryły**. Poprawna topologia nie usuwa K1. Sama płyta ma spody pod 45° i lokalne nawisy w otworach; stwierdzenie to nie obejmuje poziomych belek podpory.
- Wzmocnienia są integralne z płytą; **brak nowych śrub i nowych części mechanizmu**. Oddzielna, usuwana podpora jest zgodna z briefem. Jej ścianki i poprzeczki zwiększają trudność demontażu, ale nie stanowią samowolnej zmiany funkcji.

**Werdykt: płyty z podporą z commita `41c5140` nie należy jeszcze drukować jako gotowego zestawu — najpierw poprawić wspólny poziom stołu, rozwiązać mostki i bezpieczne usuwanie podpory oraz skorygować ocenę słabych przekrojów obu ramion.**
