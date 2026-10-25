Review v5, runda 2: **dwie poprawki obowiązkowe**, bez potrzeby zmiany układu podstawki.

1. **PSUJE DZIAŁANIE — wysokość tulei, „Mocowanie dyni”.** Samo `t` nie uwzględnia zagłębienia zewnętrznego dna dyni. Według tabeli tuleja wystaje nad płytę `t + 13`; przy przykładowej szczelinie 10 mm pod dnem zostają tylko **3 mm gwintu, czyli 0,6 zwoju**, zamiast nakrętki 8 mm. Ponadto skrypt daje wysokość `t + 10` od płyty, o 3 mm mniej niż tabela. **Poprawka:** wysokość całkowita = zmierzona wysokość miejsca docisku nakrętki nad płytą + 10 mm. Pewność: **wysoka rachunku, średnia wystąpienia szczeliny**.

2. **PSUJE DZIAŁANIE — mocowanie kasety.** W [skrypcie](/C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/40-cad/narzedzia/podstawka-blender-render.py:111) tylna ścianka zajmuje x=18,5–217,5; sklejka x=0–18 i 218–236. **Zakładka wynosi 0 mm:** opisane wkręty prowadzone od tyłu nie trafią w boki. Kaseta nie będzie zamocowana ani nie usztywni skrzynki. **Poprawka:** uszy zachodzące na tylne czoła boków albo mocowanie boczne do gniazd kasety. Pewność: **wysoka**.

3. **BRZEGOWE — USB-C:** `191,2 − 160 − 30 = 1,2 mm` rezerwy nie potwierdza możliwości wypięcia; sprawdzić rzeczywisty kabel, dopuszczając uniesienie powerbanku z wtykiem przed rozłączeniem. Pewność: **średnia**.

4. **BRZEGOWE — przewody ruchome:** zapasy USB 100 mm i PIR 150 mm nominalnie pokrywają wysuw 92 mm, lecz rendery zmieniają długość krzywych; w modelu sprawdzić stałą długość przewodów i odkładanie pętli przy zamykaniu. Pewność: **wysoka**.

5. **BRZEGOWE — docisk miąższu:** sześciokąt nakrętki z renderu ma około 5950 mm² powierzchni poza otworem Ø80; założony docisk 100 N daje około 17 kPa — utrzymanie docisku po zgnieceniu miąższu wymaga próby na dyni. Pewność: **średnia**.

6. **BRZEGOWE — pasowanie kasety:** wysokość 40 w świetle 40 oznacza **zerowy luz**; w CAD zapewnić minimum 0,3 mm nad kasetą i sprawdzić wsuwanie kompletnej elektroniki. Pewność: **wysoka**.

7. **BRZEGOWE — PIR:** oś 20 mm nad stołem i komora 15 mm są wiarygodną bazą, ale render pomija potencjometry i złącze; sprawdzić dostęp narzędzia oraz wykrywanie przy docelowej dyni w istniejącym teście PIR. Pewność: **średnia**.

8. **BRZEGOWE — druk szufladki:** uchwyt w skrypcie wystaje poziomo 8 mm na wysokości 26 mm; przy druku dnem na stole wymaga fazki 45° albo podpory. Pewność: **wysoka**.

Pozostałe sprawdzenia nie wykazały blokady:

- **Płyta i stabilność:** ciężar to 98 N, rozpiętość między bokami 200 mm. Orientacyjny model belkowy pasa 100 mm, przy założonym E=3 GPa, daje ugięcie około 0,11 mm; to oszacowanie, bez pełnego modelowania otworu. Kąt wywrócenia **26,6–30,1°** zgadza się z koncepcją.
- **Elektronika:** łącznik z dwoma modelowanymi wtykami zajmuje **74 mm**, za tylnym wtykiem zostaje **28 mm**. PCA9685 z założoną obwiednią połączeń 30 mm nad dnem 3 mm pozostawia około **7 mm** pod płytą. Rozmieszczenie jest wykonalne przy przyjętych wymiarach.
- **Mocowanie i druk:** Ø76 w Ø80 daje 2 mm luzu promieniowego; nakrętka 8 mm obejmuje nominalnie 1,6 zwoju. Ciężar dyni przenosi podparcie na płytę, a nakrętka utrzymuje docisk. Tuleja i nakrętka mają poprawną orientację druku; szufladka i kaseta mieszczą się na X1C.

Praca tylko do odczytu; bez procesów w tle.

**Werdykt: koncepcję można przyjąć i przejść do modelu po skorygowaniu wysokości tulei oraz mocowania kasety, bez kolejnej rundy koncepcji.**