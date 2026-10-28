**Review v3: obecnego kompletu nie zatwierdzam do druku jako gotowego rozwiązania montażowego.**

Sprawdziłem świeże eksporty: **13 plików 3MF bez błędów topologii i orientacji**, właściwa liczba brył. Powieki, tuby i przedłużenie odpowiadają bieżącemu SCAD. Przemiatanie: **139 par, 4 poniżej wymogu**; dodatkowo sprawdziłem rzeczywiste przedłużenia co 0,5° oraz wsuwanie łbów.

**Sama zasada osi M2×6 działa:** łeb i gwint zatrzymują śrubę w obu kierunkach już na ławce, dopóki gwint trzyma. Nominalny koniec śruby pozostaje **1,20 mm poza obwiednią gałki R30**, niezależnie od jej obrotu. Okrągły łeb nie zmienia obwiedni przy obrocie powieki.

1. **KRYTYCZNE — zaczepy drutów powiek, krok 8.**  
   Ogon 2 mm przenika górną powiekę o **1,02 mm**, dolną o **1,00 mm**, gałkę o **0,65 mm**. Sprawdziłem również ogon 1 mm: nadal **0,50 mm przenikania** obu powiek i tylko **0,20 mm do gałki**.  
   **Poprawka:** zmienić wybrania/zaczepy przed drukiem albo sprawdzić inne odgięcie z zachowanym zabezpieczeniem przed wypięciem. Ogon ucięty do zera nie spełnia tego wymagania. **Pewność: wysoka dla modelu drutu; rzeczywiste łuki gięcia wymagają próby.**

2. **KRYTYCZNE — fabryczne otwory orczyków, kroki 2, 6 i 9.**  
   Drut Ø1 nie przejdzie przez podane **około Ø0,8**. Instrukcja zakłada Ø1,3 i przewiduje rozwiercanie tylko pod kołki. Ponadto Ø1,3 przy rzeczywistej grubości ramienia **2–2,3 mm** dopuszcza przechył tylko **8,24–7,23°**, wobec raportowanych **9,9°** dla G–D.  
   **Poprawka:** rozdzielić otwory ustalające od ruchowych; dla ruchowych Ø1,5 daje **11,75° przy grubości 2,3 mm**, ale trzeba sprawdzić mostek przy końcu ramienia. Samo rozwiercenie do Ø1 nie wystarcza. **Pewność: wysoka rachunku, średnia średnicy wszystkich posiadanych orczyków.**

3. **KRYTYCZNE — wymaganie „nic tylko na kleju”.**  
   Dwa proste kołki Ø1 w otworach przedłużenia Ø1,3, obcięte równo, **nie blokują oderwania przedłużenia od orczyka**. Rowek wysokości 1,2 również go nie obejmuje od góry. Cztery serwa według instrukcji pozostają mocowane klejem.  
   **Poprawka:** mechaniczne zamknięcie przedłużeń, np. zabezpieczone końce drutu albo obejma, oraz mechaniczne przytrzymanie serw. Sprawdzić ich obwiednie. **Pewność: wysoka; to niezgodność z wymaganiem tego review.**

4. **WAŻNE — regulacja osi M2, krok 7.**  
   Ćwierć obrotu przy skoku 0,4 daje **0,10 mm**, poniżej wymaganego luzu osiowego **0,2–0,3 mm**. Luz ucho–ucho wynosi **0,20 mm**, górne ucho–słupek **0,30 mm**; są to inne szczeliny. Jeśli łeb zostanie przyhamowany, względne 51,5° oznacza przesunięcie gwintu o **0,057 mm**.  
   **Poprawka/test:** ustalać zmierzony luz, nie samo „ćwierć obrotu”; oznaczyć śruby i sprawdzić pełne cykle obu powiek oraz zmianę luzu. Sam obrót powieki **nie dowodzi samoodkręcania**. **Pewność: wysoka geometrii, średnia ryzyka odkręcania.**

5. **WAŻNE — rzeczywiste zazębienie M2 w dolnej powiece.**  
   Po cofnięciu o 0,10 mm końcówka leży przy x≈31,3. Pełny materiał wokół gwintu jest tylko na **x=31,8…33,0: 1,2 mm, czyli 3 zwoje**. Następne około **0,5 mm obejmuje jedynie połowę obwodu** — potwierdzone na siatce. To nie jest pełne 2 mm gwintu. Oś otworu leży równolegle do warstw.  
   **Poprawka/test:** przedrukować dolne ucho z pełnym obwodem na odcinku zazębienia i sprawdzić próbkę z rzeczywistą śrubą. Bez próby nie przypisuję temu gwintowi pewnej nośności. Górne ucho Ø2,4 ma nominalnie poprawne **0,20 mm promieniowo**, ale pracuje na gwincie — sprawdzić zużycie. **Pewność: wysoka geometrii.**

6. **WAŻNE — szczeliny tuby i ręczne wsuwanie.**  
   Łeb Ø4 ma w szczelinie 4,6 tylko **0,30 mm na stronę**. Pomiary: przesunięcie osi o 0,20 mm zostawia **0,10 mm**; przy 0,30 mm występuje kontakt. Nominalne wsuwanie wszystkich trzech tub przechodzi, lecz brak faz wejściowych i zapasu na ustawienie ręką.  
   **Poprawka:** szczelina co najmniej **5,0 mm**, fazowane wejście i odpowiednio wydłużony koniec; zweryfikować rzeczywisty łeb. **Pewność: wysoka dla założonego łba Ø4×2.**

7. **WAŻNE — niepotrzebnie przecięty kołnierz tuby.**  
   Nacięcia przechodzą przez cały kołnierz Ø92. Łapy przy 45/135/225/315° pozostają całe, ale obie połowy łączy dopiero przedni pas **3,7×1,6 mm** przy każdej szczelinie. Powstają też dwa mostki **4,6 mm** podczas druku.  
   **Poprawka:** zakończyć cięcie promieniowo przy około **|x|=40 mm**; zostanie około **6 mm zewnętrznego mostka kołnierza**, a łeb sięgający nominalnie do 39,3 przejdzie. Próba wsunięcia bez rozginania tuby. **Pewność: wysoka geometrii; nośność niezmierzona.**

8. **WAŻNE — skrajny kołek przedłużenia i pasowanie rowka.**  
   Przy przyjętym końcu ramienia **18 mm**, otwór na **17,5 mm** rozwiercony do Ø1 zostawia nominalnie **0 mm mostka do końca**. To wymaga sprawdzenia na rzeczywistym orczyku. Rowek ma projektowo tylko **0,15 mm luzu na stronę**; jego ścianki mają około **1,58 mm grubości**, a 1,2 mm to wysokość.  
   **Poprawka:** wybrać otwory dalej od końca, np. 11,5 i 15,5, po sprawdzeniu ich położenia; najpierw przymiarka przedłużenia. **Pewność: wysoka dla wymiarów przyjętych w modelu, średnia dla rzeczywistego końca ramienia.**

9. **WAŻNE — kołnierze trzpieni kardana.**  
   Zasięg stali jest poprawny: **5,65/5,40 mm w piastach**, poza położeniem docisku **3,65±0,20 mm**. Po wkręceniu M3 nominalna ścianka trzpienia wynosi **0,975 mm**. Natomiast kołnierz Ø9,3 w gnieździe Ø9,5 ma projektowo **0,10 mm luzu promieniowego**, a nie wcisk; wkręt kardana nie zabezpiecza kołnierza w gałce/słupku.  
   **Test:** potwierdzić zatrzymanie osiowe obu rzeczywistych, ciasno spasowanych wydruków bez polegania na CA oraz brak luzowania po ruchu. Obserwacji użytkownika „trzyma mocno” nie kwestionuję. **Pewność: wysoka wymiarów, nieustalona nośność rzeczywistego wcisku.**

10. **DROBNE — niespójna instrukcja i ilustracje.**  
    Lista „Śruby razem” pomija **2×M2×6**, tekst mówi „Żadnych M3, kołków”, kontrola nadal wymaga drutu Ø2, a montaż przypisuje tubie zatrzymywanie osi. Generator ilustracji rysuje nadal **bezłbowy drut Ø2×5,6**, mimo podpisu M2×6.  
    **Poprawka:** ujednolicić MD, HTML, ilustracje i zestawienie narzędzi, również o wiercenie. Kolejność z serwem L–P montowanym na końcu jest sensowna. **Pewność: wysoka.**

Przedłużenia w nominalnych płaszczyznach **x=±1,75** nie kolidują: minimum do płyty **0,50 mm dla górnego, 2,00 mm dla dolnego**, do własnego serwa około **1,09 mm**. Wynik zależy od rzeczywistego osadzenia orczyka. Czwarta para poniżej wymogu, pręt G–D–gałka **0,427 mm**, pochodzi z uproszczonego modelu łamanej; nie traktuję jej jako udowodnionej kolizji.

**Alternatywy osi:** z potwierdzonej listy najpraktyczniejsze pozostaje **M2×6**. M2×5 zostawia około **0,7 mm zazębienia**; M3/M5 nie przejdą przez niezmieniany słupek Ø2,4. Drut Ø1 wymaga dodatkowego zabezpieczenia. Nieruchoma oś w osobnej obejmie słupka byłaby lepszą zasadą konstrukcyjną, ale wymaga nowej części i weryfikacji — nie jest gotowym zamiennikiem.

Dowody: [przemiatanie](/tmp/astra-v3-review-ljzq4ycl/przemiatanie.txt), [łby, gwint i przedłużenia](/tmp/astra-v3-review-ljzq4ycl/dodatkowe.log), [warianty ogonów](/tmp/astra-v3-review-ljzq4ycl/ogony.log). Repo bez moich zmian; moje procesy zakończone.

**Werdykt: nie drukować obecnych powiek i tub jako gotowego zestawu na rano — minimalnie usunąć kolizje zabezpieczonych ogonów, poprawić pełne zazębienie i regulację osi M2 oraz szczeliny tuby, a przed montażem rozwiązać otwory orczyków i mocowania zależne wyłącznie od kleju.**