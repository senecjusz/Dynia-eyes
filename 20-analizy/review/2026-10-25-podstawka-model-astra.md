Review podstawki v1, krok 2. **Trzy uwagi blokujące.**

1. **PSUJE DZIAŁANIE ALBO DRUK — PIR, `szuflada()`, linie 140–153.** Szczelina płytki kończy się na Y=2,20, a ściana na Y=2,40: siatka zawiera błonę **0,20 mm** między płytką a kieszenią regulacyjną. Elementy tylne PIR trafiają w błonę zamiast do kieszeni 25 mm. **Poprawka:** otworzyć przestrzeń za płytką, zachowując prowadnice; sprawdzić wsunięcie kompletnego PIR. **Pewność: wysoka.**

2. **PSUJE DZIAŁANIE ALBO DRUK — gwint, `gwint()`, linie 106–108; również próbki.** Przy 24 warstwach/skok przekroje obracają się o **15°**, mimo obwodowego kroku 3°. Gotowe siatki mają powierzchnie skierowane w dół nachylone zaledwie **11,3–11,4° do stołu**, zamiast 45°. Cięciwa przy R38 daje zapadnięcie około **0,325 mm**. To psuje zarys i druk bez podpór. **Poprawka:** poprawić siatkowanie i ponowić eksport; kontrolny eksport ze 120 warstwami/skok dał flanki około **45°**. **Pewność: wysoka.**

3. **PSUJE DZIAŁANIE ALBO DRUK — luz gwintu, `offset(delta=luz)`, linia 108.** Odsunięcie przekroju XY o 0,20 mm nie odtwarza luzu próbki E2.0. Po usunięciu problemu rozdzielczości zmierzony luz prostopadły na flankach wynosi **0,1414–0,1415 mm**, zamiast **0,20 mm**. Wydruk E2.0 nie potwierdza tego pasowania. **Poprawka:** odtworzyć odsunięcie powierzchni jak w E2.0, sprawdzić luz 3D i wydrukować poprawioną próbkę. **Pewność: wysoka.**

4. **BRZEGOWE — USB-C:** od portu X=163,4 do wewnętrznej ściany X=213,4 pozostaje dokładnie **50 mm**, czyli **zero luzu** dla przyjętej obwiedni; dodać luz i sprawdzić wypinanie. **Pewność: wysoka.**

5. **BRZEGOWE — `zlozenie()`:** nakrętka bez korekty fazy przenika tuleję promieniowo o około **1,00 mm**; ustawić właściwy obrót, wstępnie około −72°, i ponowić kontrolę. **Pewność: wysoka.**

6. **BRZEGOWE — elektronika:** złożenie pomija płytki, Dupont i skrętki; słupki PCA kończą się na Z=7,4, pozostawiając **32,6 mm** do płyty, lecz przejście uzbrojonej kasety i trasę przewodów trzeba sprawdzić z obwiedniami. **Pewność: wysoka co do braku kontroli.**

7. **BRZEGOWE — opis testu zginania:** dla `pbL=150` lewa połówka ma **168,9 mm**, nie deklarowane 167,9; poprawić raport. **Pewność: wysoka.**

Pozostałe kontrole: **9/9 siatek** szczelnych, po jednej bryle, z poprawną orientacją i płaską podstawą. Gabaryty mieszczą się na wskazanych drukarkach; połówki zachowują obrys szufladki, dodając żebra łączenia. Powerbank ma nominalnie po **1 mm** luzu do ograniczeń, korpus szufladki po **1,5 mm** do boków, kaseta odstęp **2 mm** od szufladki. Rysunek zawiera płytę **254,8×222,8×18, Ø64**, dwa boki **222,8×40** i tył **218,8×40** — zgodne z modelem, prostokąty do cięcia na pile, otwór osobno otwornicą.

Repo bez zmian; żadne uruchomione przeze mnie procesy nie pozostały w tle.

**Werdykt: plików nie przekazywać jeszcze do druku; rysunek sklejki nadaje się do cięcia.**