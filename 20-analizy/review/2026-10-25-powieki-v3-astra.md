Kinematyka wariantu A działa: serwo wykonuje skok **+35,95°…−31,24°**, bez zbliżenia do martwego punktu. Błąd długości drutu ±2 mm mieści się w potrzebnym zakresie **−37,99°…+41,79°**; czułość powieki wynosi nominalnie **1,69–2,82°/mm**.

Nie znalazłem potwierdzonej kolizji naruszającej PRD. Raportowane **2,62 mm orczyk–uchwyt nie dotyczy rzeczywistego przedłużenia**: jego piasta Ø11 pozostawia do słupka około **0,595 mm**, nadal powyżej 0,5 mm.

Dwa warunki prawidłowego wykonania to podparcie nowych uszek podczas druku i zabezpieczenie końców L przed wysunięciem. Dolne uszko ma dodatkowo nacięty otwór, opisany poniżej jako **BRZEGOWA**.

**Zakres i dowody.** Review powiek v3, runda 1/2. Nie czytałem raportu drugiego recenzenta ani nie oceniałem połączeń S1/S2 z gałką. Model zmieniono podczas pracy przez dodanie pogłębienia w przedłużeniu; końcowy odczyt ma SHA-256 `77866a810122a3bfc95a63074140c0c089089b8ff2e92736e266af3e5d76970b`. Obliczenia kinematyki wykonałem niezależnie; wyniki przemiatania siatek poniżej pochodzą z dostarczonego pliku, bez powtarzania całego przebiegu.

**1. Kinematyka**

Dla geometrii funkcji `uszkoP` i `orczP`: promienie 34/25 mm, oś serwa `yWalP = 14,095 mm`, `zWal = −44 mm`, długość między punktami zaczepienia **36,701 mm**.

| Otwarcie powieki | Kąt serwa | Czułość powieki przy nieruchomym serwie |
|---:|---:|---:|
| 0° | +35,95° | 1,72°/mm |
| 12,875° | +16,97° | 1,70°/mm |
| 25,75° | 0° | 1,83°/mm |
| 38,625° | −15,96° | 2,14°/mm |
| 51,5° | −31,24° | 2,82°/mm |

Najmniejszy ostry kąt między drutem a ramieniem powieki wynosi **36,73°**, a między drutem a orczykiem **44,49°**. Martwy punkt odpowiada 0°; nominalny skok ma wyraźny zapas. Po uwzględnieniu długości ±2 mm minima wynoszą odpowiednio **33,64° i 41,02°**.

| Błąd długości | Serwo: zamknięcie | Serwo: otwarcie 51,5° |
|---:|---:|---:|
| −2 mm | +41,79° | −24,88° |
| 0 mm | +35,95° | −31,24° |
| +2 mm | +30,62° | −37,99° |

Potrzebny jest dostępny zakres co najmniej **−38°…+42° względem modelowego zera**. Dostarczony materiał nie potwierdza rzeczywistych ograniczników posiadanych serw ani limitów strony kalibracji.

**BRZEGOWA — samo przesunięcie zera nie zachowuje dokładnie skoku.** Miejsce: kalibracja SG/SD. Po ustawieniu zamknięcia i pozostawieniu nominalnej różnicy kątów otrzymujemy około **52,01° dla drutu −2 mm** albo **50,43° dla +2 mm**. Nie psuje to widoczności źrenicy Ø10; przy kalibracji można ustawić osobno oba końce. Pewność: wysoka.

**2. Uszka, drut L i druk**

Moment 1,8 kgf·cm odpowiada **176,5 Nmm**. Na ramieniu 25 mm daje to **7,06 N siły stycznej**, ale rzeczywista siła osiowa drutu zależy od kąta: nominalnie około **7,1–10,1 N przy zatrzymanym serwie**. Wartość momentu jest zgodna z kartą [TowerPro MG90S](https://towerpro.com.tw/product/mg90s-3/); dla posiadanych Miuzei pozostaje założeniem z briefu.

Górne uszko ma grubość **4 mm**, otwór **Ø1,4** i zewnętrzny promień **2,6 mm**. Uproszczony nacisk drutu przy 10,1 N wynosi około **2,5 MPa**; nie wskazuje to na oczywiście za mały przekrój. Nie jest to jednak potwierdzenie wytrzymałości nasady na wydruku.

**BRZEGOWA — otwór dolnego uszka jest nacięty od wnętrza.** Miejsce: `PowiekaDolna()`, odjęcie sfery po dodaniu `uszkoPow(-1)`. Wewnętrzna krawędź otworu leży na **34 − 0,7 = 33,3 mm**, a wycinana sfera ma **R33,4**; powstaje szczelina około **0,72 mm w przekroju x=0**. Drut Ø1 nominalnie przez nią nie przechodzi, więc nie stwierdzam samoczynnego wypadania tą drogą; pozostawić w tej rundzie. Pewność geometrii: wysoka, zachowania wydruku: średnia.

**PSUJE — druk nowego uszka bez lokalnej podpory.** Miejsce: `druk()` i `uszkoPow()`. W obecnej orientacji środek otworu górnego uszka leży około **28,86 mm nad stołem**, a dolna powierzchnia jego oczka zaczyna się około **26,3 mm**, poza tylną krawędzią czaszy. Podpory wyłącznie pod wnętrzem czaszy nie gwarantują podparcia uszka. **Poprawka: dodać podporę pod wystającą częścią każdego uszka**; orientację powiek można zachować. Pewność: wysoka.

**PSUJE — gołe końce L nie mają zabezpieczenia osiowego.** Miejsce: oba końce każdego drutu powieki. Zagięcie L pozwala na montaż i obrót, ale samo nie zamyka drogi wysunięcia z otworu. **Poprawka: koszulka na każdym z czterech końców**, zgodnie z rozwiązaniem już przewidzianym w projekcie. Długość prostej nogi od zagięcia: orientacyjnie **6,5–7 mm przy uszku 4 mm** oraz **5,5–6 mm przy przedłużeniu 3 mm**, z miejscem na koszulkę i niewielki luz. Pewność: wysoka.

Końce L należy wkładać osiowo, przy zdjętym orczyku lub przed zamknięciem złożenia. Nie trzeba przekładać zagięcia przez otwór.

**3. Przedłużenie orczyka**

Miejsce: [model, `PrzedluzenieOrczyka()`](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/40-cad/openscad/duze-oko-v2.scad:225).

Rowek ma nominalnie **7,6 mm przy piaście** i **6,1 mm przy końcu**, czyli po 0,3 mm luzu dla założeń Ø7/5,5. Jego boczne ścianki przenoszą moment po skasowaniu luzu; mocowanie nie opiera się wyłącznie na tarciu wkrętu. Luz ±0,3 mm na ramieniu około 20 mm odpowiada około **±0,86° obrotu przedłużenia**.

Grubość 3 mm i rowek 1,2 mm pozostawiają **1,8 mm dna**; w końcowym odczycie pogłębienie pod łeb pozostawia lokalnie **0,6 mm**. Nie mam dowodu, że część pęknie podczas normalnego ruchu.

**BRZEGOWA — dopasowanie do fabrycznego orczyka i wkrętu pozostaje założeniem.** Poprawka/test montażowy: sprawdzić osadzenie rzeczywistego orczyka w rowku, wejście łba w pogłębienie i chwyt gwintu po dodaniu 0,6 mm pod łbem. Nie dokręcać przez odkształcanie cienkiego dna. Pewność: wysoka co do modelu, nieustalona co do części kupnej.

**4. Kolizje**

Wartości z [wyniku przemiatania](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/40-cad/openscad/kolizje-powieki-v3.txt):

| Para | Minimum | Klasyfikacja i rozstrzygnięcie |
|---|---:|---|
| Drut–własna powieka | −0,89 mm | **BRZEGOWA:** model prostego drutu biegnie przez własne uszko; nie traktować jako kolizji poprawnie zamontowanego L. |
| Górna powieka–łeb M2 | 0,18 mm | **BRZEGOWA:** strefa osi, nominalny luz 0,2 mm; brak dowodu blokowania. |
| Powieka–powieka | 0,20 mm | **BRZEGOWA:** minimum na uszach osi, nie szczelina między czaszami; pozostawić. |
| Dolna powieka–pierścień | 0,20 mm | **BRZEGOWA:** luz osiowy przy podkładce osi; pozostawić. |
| Druty powiek–pierścień | 1,07 mm | Bez uwagi. |
| Gałka–górna powieka | 1,40 mm | Bez uwagi w sprawdzonych pozycjach. |
| Druty S1/S2–górna powieka | 2,82 mm | Bez uwagi w sprawdzonych pozycjach. |
| Gałka–druty powiek | 2,91 mm | Bez uwagi; niezależny rachunek względem sfery R30 potwierdza około 2,91 mm. |

**BRZEGOWA — uproszczony orczyk zawyża luz do słupka.** Miejsce: `orczykP()` w skrypcie kontroli. Piasta zastępcza ma R3,5, rzeczywiste przedłużenie R5,5, zatem nominalny luz wynosi:

**14,0949 − 8 − 5,5 = 0,5949 mm.**

Nie ma nominalnej kolizji i nie proponuję przesuwania serw. Przy kolejnym sprawdzeniu należy użyć rzeczywistego przedłużenia; dotychczasowych 2,62 mm nie należy podawać jako jego luzu. Pewność: wysoka.

Niezależnie sprawdziłem odległość prostych korpusów drutów powiek od prostych drutów S1/S2: krok gałki **1°**, powieki **0,5°**, cały zakres ±35°/±25°. Minimum odstępu powierzchni wyniosło około **6,03 mm**. Kontrola nie obejmuje realnych zagięć L i koszulek.

Ograniczenie dostarczonego przebiegu: względem gałki i jej napędu sprawdzono tylko **trzy pozycje powiek**, a orczyki mają geometrię zastępczą. Wynik nie stanowi pełnego potwierdzenia wszystkich odstępów rzeczywistego złożenia.

**5. Widoczność**

**BRZEGOWA — uszka i fragmenty drutów mogą być widoczne od przodu.** Przy zamknięciu środki uszek mają **|y| = 33,19 mm**, a oczka sięgają około **35,79 mm**; mieszczą się w prześwicie tuby R37,9 i wystają poza obrys gałki R30. Nie narusza to gładkości białej gałki ani rantu maskownicy 2 mm, więc nie proponuję osłon.

Dla przyjętej wcześniej źrenicy **Ø10** pełne otwarcie pozostawia przy spojrzeniu ±25° około **15,4° zapasu kątowego** do przedniej krawędzi powieki. Warunek niezasłaniania źrenicy jest spełniony przy tym założeniu.

**6. Montaż — czynności ręczne**

1. W slicerze dodać podpory pod oba nowe uszka; wydrukować i oczyścić otwory Ø1,4.
2. Przymierzyć przedłużenia do rzeczywistych orczyków i sprawdzić mocowanie wkrętem.
3. Ugiąć dwa druty Ø1, z rozstawem zagięć około **36,7 mm**; nogi L przyciąć do grubości elementów i koszulek.
4. Założyć druty w uszka przed zamknięciem złożenia; nasunąć dwie koszulki.
5. Złożyć powieki w tubie, połączyć tubę z uchwytem i zamontować SG/SD wałkami w stronę +x.
6. Ustawić serwa na zero; przy powiekach otwartych do **25,75°** nasadzić orczyki z przedłużeniami na zewnątrz, w ±y.
7. Połączyć drugie końce drutów ze zdjętymi orczykami, zabezpieczyć kolejnymi koszulkami, następnie przykręcić orczyki.
8. Skalibrować każdą powiekę osobno i sprawdzić niezależny ruch obu powiek oraz swobodę drutów i koszulek.

Raportu nie zapisałem w repo. Uruchomione przeze mnie procesy w tle: brak.

**Werdykt: powieki v3 nadają się do wydruku testowego z podporami pod nowymi uszkami i zabezpieczeniem wszystkich czterech końców L; nie stwierdzam konieczności zmiany koncepcji wariantu A.**