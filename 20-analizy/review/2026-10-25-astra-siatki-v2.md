Zadanie: review dużego oka v2 przed drukiem testowym. **Znalazłem dwa błędy krytyczne: brak podkładek osi powiek w wyeksportowanej geometrii oraz brak docisku ustalającego gałkę na kardanie.**

Sprawdzone niezależnie:

- Wszystkie 3MF są szczelne, bez zdegenerowanych trójkątów i z poprawną orientacją ścian. Każda część ma jedną bryłę; zbiorczy ma siedem. Wszystkie pojedyncze części mieszczą się na A1 mini.
- Idealna kinematyka cięgien osiąga ±35°/±25° na siatce co 0,5°: S1 **−42,20…+37,82°**, S2 **−45,60…+40,18°**. To potwierdza poprawę poprzedniego planu.
- Szczelina między czaszami wynosi **0,7 mm**, po przeciwnych przesunięciach osi po 0,2 mm zostaje **0,3 mm** — zgodnie z tabelą.
- Dla założonej źrenicy Ø10, przy idealnym współosiowym montażu i obserwacji od przodu, pełne otwarcie pozostawia minimum około **5,48 mm** zapasu do górnej powieki.

## KRYTYCZNE

**K1. Wycięcie wnętrza tuby usuwa podkładki osi M2.**  
**Miejsce:** [`Pierscien()`](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/40-cad/openscad/duze-oko-v2.scad:166), potwierdzone na `Pierscien.3mf`.  
**Scenariusz porażki:** podkładki mają zaczynać się przy |x|=35,7 mm, lecz późniejsze wycięcie walca R37,9 usuwa je razem z wnętrzem tuby. Przy osi zostaje zwykła ścianka tuby. Otwór kończy się przy |x|=38,1, więc rzeczywiste zazębienie śruby wynosi około **0,2 mm zamiast 2,4 mm**. Za dolnym uchem zostaje około **2,4 mm wolnej przestrzeni zamiast 0,2 mm**. Oś nie będzie miała zakładanego podparcia ani luzu osiowego.  
**Poprawka:** wyciąć wnętrze tuby przed dodaniem podkładek; następnie wykonać otwory M2. Powtórzyć pomiar przekroju i stosu osi na nowym 3MF.  
**Pewność:** wysoka — zgodność kodu i pomiaru siatki.

**K2. Rowek T nie zapewnia planowanego docisku gałki do piasty.**  
**Miejsce:** [`Galka()`, rowek T](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/40-cad/openscad/duze-oko-v2.scad:131), montaż krok 4.  
**Scenariusz porażki:** M5×12 wsunięta w piastę na 7 mm pozostawia **5 mm** pod łbem. Rzeczywista podłoga modelu ma `podloga − luzObr` = **4,8 mm**. Zostaje **0,2 mm luzu**, więc podłoga nie jest ściskana między piastą a łbem. M4 zaciska czop w piaście, ale nie kasuje tego luzu. Okrągły czop i łeb nie ustalają obrotu gałki wokół własnej osi; solver zakłada sztywne połączenie.  
**Poprawka:** dobrać podłogę i wysunięcie czopa tak, aby uzyskać rzeczywisty docisk, oraz sprawdzić brak obrotu i wysuwania gałki. Zachować dostęp do M4.  
**Pewność:** wysoka dla braku docisku; średnia dla skali ruchu pod obciążeniem rzeczywistych drutów.

## WAŻNE

**W1. Raport „0 przenikań” nie obejmuje pełnego mechanizmu i zakresu ruchu.**  
**Miejsce:** [`duze-oko-kolizje.js`](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/40-cad/narzedzia/duze-oko-kolizje.js:125).  
**Scenariusz porażki:**

- Test zapisano dla **48 pozycji gałki co 10°** i siedmiu pozycji powiek. Zagęszczenie ujawniło mniejszy luz pomiędzy próbkami — szczegóły W2.
- Dolna powieka porusza się dokładnie przeciwnie do górnej, chociaż solver przewiduje różnicę około **0,23–0,24°**, czyli do około **0,14 mm** na czaszy.
- Druty są prostymi odcinkami, skróconymi o **1–4 mm** przy końcach. Zagięcia Z, ogony do 2 mm i ich przejścia przez otwory nie są sprawdzane.
- Brakuje pełnej geometrii kardana, M5 i kabli.
- Wieżyczka S3 i piasta jej orczyka mają zamienione współrzędne x/z: środek **(−44,−42)** zamiast **(−42,−44)**, błąd położenia **2,83 mm**.
- Kontrola korzysta z próbek powierzchni, bez pełnego testu przecięć trójkątów; dla par nieruchomych jest jednostronna. Deklarowana dokładność 0,1–0,2 mm nie wynika z tej metody.

**Poprawka:** poprawić transformacje, uwzględnić rzeczywiste końcówki i osprzęt, zastosować ruch obu powiek z solvera oraz zagęszczać kontrolę wokół minimów. Pary nieruchome sprawdzać dwustronnie wraz z przecięciami powierzchni.  
**Pewność:** wysoka — wynika bezpośrednio z kodu.

**W2. Drut S1 ma za mały luz do gałki.**  
**Miejsce:** ucho S1 i dolna krawędź blaszki gałki.  
**Scenariusz porażki:** odtworzyłem raportowane **0,191 mm** przy θ=35°, φ=−15°. Przy **θ=35°, φ=−10,5°** otrzymałem już **0,136 mm**, w punkcie około **(22,348; −1,038; −5,630)** w układzie gałki. To poniżej wymaganego nominalnego 0,5 mm oraz minimum 0,2 mm po uwzględnieniu luzów. Przesunięcie drutu o 0,14 mm w niekorzystnym kierunku może zamknąć szczelinę.  
**Poprawka:** skorygować obrys blaszki lub drogę korpusu drutu i sprawdzić rzeczywiste Z, bez wyłączania początku cięgna.  
**Pewność:** wysoka dla modelowanego prostego odcinka; rzeczywiste Z wymaga osobnego sprawdzenia.

**W3. Instrukcja montażu podaje pozycje niezgodne z kinematyką.**  
**Miejsce:** [montaż, kroki 2 i 7](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/40-cad/openscad/duze-oko-v2-montaz.md:31).  
**Scenariusz porażki:** powieki mają pozostać zamknięte, a orczyk S3 wskazywać +x. Tymczasem ta pozycja orczyka odpowiada **25,75° otwarcia**. Przy zamknięciu odległość końców górnego cięgna wynosi **47,48 mm**, zamiast jego długości **44,58 mm**. Dodatkowo S1/S2 mają być odchylone 6° „w stronę gałki”, podczas gdy model wymaga −6°, czyli od niej. Odwrócenie znaku zmienia potrzebne długości o **3,66 mm dla S1** i **2,72 mm dla S2**.  
**Poprawka:** dla montażowego zera S3 ustawić powieki w połowie skoku; zamknięcie osiągać przy α≈+23,25°. Poprawić kierunek odchylenia S1/S2.  
**Pewność:** wysoka.

**W4. Pozostały pasowania drutów poniżej tabeli luzów.**  
**Miejsce:** [`dDzwOtw`](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/40-cad/openscad/duze-oko-v2.scad:54) i rozwiercanie orczyków.  
**Scenariusz porażki:** drut Ø1 w dźwigni Ø1,2 ma **0,10 mm luzu promieniowego**, a w orczyku Ø1,3 — **0,15 mm**, wobec wymaganych 0,2 mm. Dwa druty Ø1 w otworze Ø2,1 zostawiają jedynie **0,05 mm** zapasu do zewnętrznej obwiedni ułożonej pary. Obróbka i odchylenie końcówek mogą powodować klinowanie.  
**Poprawka:** dobrać otwory na próbce kompletnego połączenia, z rzeczywistą grubością orczyka i dwoma końcówkami Z; zapisać wynik jako jawne pasowanie.  
**Pewność:** wysoka dla wymiarów, średnia dla zachowania po ręcznym rozwierceniu.

**W5. „Uchwyt serw — bez podpór” wymaga doprecyzowania.**  
**Miejsce:** [`UchwytSerw()`](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/40-cad/openscad/duze-oko-v2.scad:189).  
**Scenariusz porażki:** w orientacji 3MF nad oknami serw powstają poziome mosty **13,1 mm**. Strop okna M5 ma rozpiętość **10,5 mm**, przerwaną otworem Ø5,3; przy jego środku zostają jednostronne nawisy około **2,6 mm**. Nie są to powierzchnie samonośne pod 45°. Zwis może ograniczyć wsuwanie łba M5 lub korpusu serwa.  
**Poprawka:** opisać i sprawdzić mostkowanie tych miejsc albo przewidzieć lokalne podpory/fazki z zachowaniem przestrzeni montażowej. Podpora stożka gałki i podpory czasz są już opisane poprawnie.  
**Pewność:** wysoka dla geometrii, średnia dla jakości konkretnego wydruku.

## DROBNE

**D1. Powieki nie mają płaskiej powierzchni oparcia uszami.**  
**Miejsce:** orientacja obu 3MF powiek.  
**Scenariusz porażki:** najniższe punkty leżą na zaokrąglonych krawędziach uszu, odpowiednio około **z=0,0031 i 0,0035 mm**; powierzchnia płaskiego styku ze stołem wynosi zero.  
**Poprawka:** wykonać niewielkie płaskie podstawy albo jawnie uwzględnić podparcie uszu w przygotowaniu druku.  
**Pewność:** wysoka.

**D2. Raport nocny zawiera stare długości drutów.**  
**Miejsce:** tabela „Kamienie”, punkt 6.  
**Scenariusz porażki:** podaje **40,4/41,4 mm**, podczas gdy solver daje **41,86/42,89 mm**, a SVG prawidłowo **41,9/42,9 mm**. Wykonanie według raportu skróci oba cięgna o około 1,5 mm.  
**Poprawka:** ujednolicić raport z aktualnym SVG i solverem.  
**Pewność:** wysoka.

Propozycje zmian funkcji: brak. Nie zapisywałem plików, nie używałem git ani nie uruchamiałem procesów w tle.

**Werdykt: duże oko v2 w obecnej postaci nie nadaje się do wydruku testowego całego mechanizmu; najpierw trzeba naprawić osie powiek i mocowanie gałki oraz ponownie zweryfikować luzy, kolizje i instrukcję montażu.**