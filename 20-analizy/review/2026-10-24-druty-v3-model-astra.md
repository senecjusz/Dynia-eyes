**Raport Astry — E6: połączenia drutów v3, model v6**  
Treść do `20-analizy/review/2026-10-24-druty-v3-model-astra.md`.

**Wynik: model wymaga poprawek przed wydrukiem całego mechanizmu.** Potwierdziłem nominalne wyniki przemiatania, ale znalazłem problem z drukowalnością widełek oraz pomijany kontakt oczka S2 z mostkiem.

Pracowałem wyłącznie do odczytu. Nie czytałem raportu drugiego recenzenta dla tej rundy.

**Podstawa i powtórzone sprawdzenia**

- SCAD: SHA256 `6db603d01f3c0cd9fa86b059ca4aa35658d459dd436d94ee69302b2208d34947`; bez zmian podczas review.
- Siatki i parametry: wskazany katalog `stl6`; oba dostarczone pliki parametrów są zgodne.
- Powtórzyłem **całe przemiatanie drutów** z krokiem 10°. Odtworzyłem podane minima, w tym −0,03; 0,15; 0,21; 0,23 i 0,44 mm.
- Odczytałem ukończony wynik części v4. Na siatkach v6 powtórzyłem trzy ciasne pary: **0,182 mm** powieka górna–łeb M2, **0,200 mm** powieka dolna–Pierścień oraz **0,200 mm** między powiekami przy zamknięciu. Nie powtarzałem całego przemiatania części.
- Niezależnie przeliczyłem nominalną kinematykę S1/S2 co 0,5° oraz krańce powiek.

Wartości poniżej są obliczeniami geometrii, nie pomiarami wydruku.

**1. KRYTYCZNE — płaskie dna policzków nie mają podparcia podczas druku**

**Miejsce:** [profile S1/S2 i mostek](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/40-cad/openscad/duze-oko-v2.scad:163), gałka drukowana rantem na stole.

Oś sworznia leży 4 mm nad stołem. Dno policzka jest 1,6 mm pod osią, więc pierwsza pozioma powierzchnia policzka zaczyna się **2,40 mm nad stołem**.

Na STL potwierdziłem powierzchnie skierowane w dół:

| Element | Każdy policzek | Łączne pole |
|---|---:|---:|
| S1 | **7 × 2,5 mm** | **35 mm²** |
| S2 | **3 × 2,5 mm** | **15 mm²** |

S1 tworzy poziome wysunięcie od strony podpartej skosem. S2 zaczyna od fragmentów bez połączenia z wcześniejszymi warstwami; mostek łączy je ze skorupą dopiero wyżej. Mostek ma spód **7 mm nad stołem** i również wymaga sprawdzenia podparcia.

**Scenariusz porażki:** opadnięte lub niepowstałe dolne warstwy policzków, zdeformowane otwory i osłabienie mocowania. Płaskie dno nie jest powierzchnią opartą na stole.

**Poprawka/test:** przeprowadzić podparcia do wcześniejszych warstw, zachowując przejście drutu, albo jawnie przewidzieć podpory i ich usuwanie. Sprawdzić warstwy w slicerze. Poprawić również `ProbkaDrutu`, która odtwarza ten problem względem swojej płytki.  
**Pewność: wysoka — geometria potwierdzona na STL.**

**2. KRYTYCZNE — oczko S2 może oprzeć się o mostek przed wybraniem luzu na sworzniu**

**Miejsce:** mostek S2, `zMost = 3`, oczko Ø3 na sworzniu Ø1.

Test stale umieszcza środek oczka na osi sworznia. Rzeczywiste oczko ma jednak **1 mm nominalnej swobody promieniowej**.

Sprawdziłem położenie zerowe z przesunięciem środka oczka o **0,90 mm w +z**, ku mostkowi:

- minimalny luz powierzchni oczka do sworznia: **0,098 mm**;
- wnikanie oczka w gałkę, w obszarze mostka: **0,354 mm**;
- przykładowy punkt wewnątrz mostka: **[0,427; 19,917; −0,646] mm**.

To test dopuszczalnego położenia wewnątrz luzu, a nie dowód pełnej trajektorii mechanizmu. Wykazuje jednak, że mostek ogranicza ruch oczka wcześniej niż sworzeń.

**Scenariusz porażki:** przy zmianie kierunku obciążenia oczko zaczyna naciskać na plastikowy mostek; przechył i tarcie przestają odpowiadać modelowi swobodnego przegubu.

**Poprawka/test:** zmienić lokalny prześwit mostka i sprawdzić oczko przemieszczone w całym dostępnym luzie, również przy przechyleniu. Samo poszerzenie szczeliny między policzkami tego nie usuwa.  
**Pewność: wysoka dla kontaktu; średnia dla wystąpienia zakleszczenia w działającym mechanizmie.**

**3. KRYTYCZNE — przemiatanie nie uzasadnia stwierdzenia „pozostało tylko −0,03 mm”**

**Miejsce:** [geometria oczka i kontrola gałki](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/40-cad/narzedzia/duze-oko-druty-v2-kolizje.js:205).

Zakres testu jest niepełny:

- oczko jest modelowane, ale **pomijane w kontroli względem własnej gałki/widełek**;
- brak sworzni i ich zagiętych końców;
- brak końca zwoju, zakładki i rzeczywistych łuków gięcia;
- S1/S2 względem powiek sprawdzane są tylko przy powiekach zamkniętych i otwartych;
- brak par drutów **S1/S2–PG/PD**;
- oba druty powiek dostają wspólne `m` i `pozH`, więc nie obejmuje to wszystkich niezależnych kombinacji luzów i wykonania;
- przy własnej powiece wyłączone jest **5 mm korpusu**, znacznie więcej niż samo przejście przez otwór.

Dodatkowo `pret()` tworzy walce bez den. Test parzystości używany do rozpoznawania wnętrza takich siatek nie daje wiarygodnej głębokości wnikania drut–drut.

**Scenariusz porażki:** dodatni wynik dla sprawdzonych par ukrywa kontakt elementów wyłączonych lub nieobecnych w teście. Punkt 2 jest konkretnym przykładem.

**Poprawka/test:** uzupełnić geometrię i pary; styki montażowe wyłączać lokalnie. Dla drut–drut użyć odległości odcinków/łuków z promieniami albo zamkniętych brył. Zagęścić kontrolę wokół małych odstępów.  
**Pewność: wysoka — wynika bezpośrednio z kodu.**

**4. WAŻNE — geometria drutu zmienia długość podczas symulacji**

Solver utrzymuje odległość **środek sworznia–środek otworu orczyka**, po czym osobno dodaje oczko i przesunięcie Z. W efekcie długość prostego korpusu między tymi elementami nie pozostaje stała.

Dla jednego ustalonego wariantu, `Z = 6,5`, `pozH = 1`, na siatce użytej przez test:

| Drut | Najkrótszy korpus | Najdłuższy korpus | Różnica |
|---|---:|---:|---:|
| S1 | 39,340 mm | 40,096 mm | **0,755 mm** |
| S2 | 39,627 mm | 40,175 mm | **0,548 mm** |

**Scenariusz porażki:** rzeczywisty drut kompensuje tę różnicę luzem, ugięciem albo innymi kątami serwa; obwiednia przestaje odpowiadać symulacji. Różnice przekraczają część raportowanych prześwitów.

**Poprawka/test:** rozwiązywać kinematykę dla stałej geometrii wygiętego drutu, z jawnymi swobodami przegubów, lub wykazać obwiednię obejmującą te odchylenia.  
**Pewność: wysoka dla zmiany długości; średnia dla skutku mechanicznego.**

**5. Przechył oczek — nominalna szczelina wystarcza**

Niezależny wynik dla idealnych, wycentrowanych oczek:

| Wielkość | S1 | S2 |
|---|---:|---:|
| Maksymalny przechył | **38,364°** | **27,049°** |
| Konserwatywny zapas na stronę ze skryptu | **0,86 mm** | **1,28 mm** |

Dla płaskiego oczka z okrągłego drutu szerokość osiowa wynosi:

\[
W=1+4\sin\beta
\]

Przy szczelinie **5,830 mm** daje to odpowiednio **1,174 / 1,506 mm** zapasu na stronę. Po zwiększeniu przechyłu o 10° zostaje **0,920 / 1,210 mm** — przy zachowaniu środka oczka na osi sworznia.

**DROBNE:** granica **53,2°** pochodzi w skrypcie z niewłaściwego wzoru. Idealny okrągły zwój Ø3 z drutu Ø1 na sworzniu Ø1 daje granicę **60°**. Błąd jest tu konserwatywny.

**Scenariusz porażki:** rzeczywisty zwój jest owalny, przestrzenny lub przesunięty; nominalny zapas nie opisuje już całego mocowania.

**Poprawka/test:** poprawić wzór i sprawdzić rzeczywiste oczko do 50°, wraz z końcem zwoju i przesunięciem w luzie.  
**Pewność: wysoka dla geometrii idealnej.**

**6. WAŻNE — małe odstępy wymagają rozdzielenia styku przegubu od niezamierzonego ocierania**

| Para | Wynik [mm] | Ocena |
|---|---:|---|
| S1–własny orczyk | **−0,03** | Możliwy wpływ ostrego naroża modelu; rzeczywisty orczyk wymaga sprawdzenia |
| PG/PD–własna powieka | **0,00–0,01** | Styk koszulki może być zamierzony; nie potwierdza swobody wyłączonych 5 mm korpusu |
| PG/PD–orczyk S3 | **0,15** | Sprawdzić swobodę Z pod obciążeniem |
| S2–własny orczyk | **0,21** | Jak wyżej |
| S1–gałka | **0,23** | Poniżej wymaganych 0,5 mm poza stykiem przegubu |
| PD–Pierścień | **0,44** | Poniżej 0,5 mm |
| Górna powieka–łeb M2 | **0,182** | Powtórzone; sprawdzić z luzami osi |
| Dolna powieka–Pierścień | **0,200** | Powtórzone; obszar pasowania przy osi |
| Powieka–powieka | **0,200** | Powtórzone; obszar pasowania przy osi |

**Scenariusz porażki:** po wybraniu luzów osi albo niewielkim dogięciu drutu powstaje ocieranie. Krok 10° nie stanowi gwarancji minimalnego prześwitu między próbkami.

**Poprawka/test:** dla S1–gałka i PD–Pierścień uzyskać co najmniej 0,5 mm po uwzględnieniu luzów. Przy osiach powiek policzyć skrajne przesunięcia osiowe. Przy Z sprawdzić rzeczywisty kontakt i swobodę, zamiast automatycznie traktować każdy mały odstęp jako błąd.  
**Pewność: wysoka dla podanych próbek; średnia dla minimum ciągłego ruchu.**

**7. WAŻNE — wytrzymałość i retencja sworzni nie są jeszcze potwierdzone**

Policzki mają 2,5 mm grubości, ale pod otworem Ø1,4 pozostaje **0,90 mm materiału**. To poniżej punktu odniesienia 1,2 mm z listy kontrolnej druku.

Dla obu dolnych mostków materiału łączna uproszczona powierzchnia ścinania wynosi:

\[
2\cdot2{,}5\cdot0{,}9=4{,}5\ \mathrm{mm^2}
\]

Nie znamy siły roboczej ani wytrzymałości tego wydruku, więc nie ma podstaw do deklaracji nośności.

Otwór S2 **Ø1,0 na drut Ø1,0 oznacza nominalnie zerowy luz**, nie gwarantowany wcisk. Może wyjść za ciasny lub nie zapewnić retencji. Obecna próbka S1 tego nie sprawdza.

**Scenariusz porażki:** pęknięcie przy wciskaniu lub zaginaniu sworznia, ewentualnie jego przesuwanie po montażu.

**Poprawka/test:** próbka również dla S2, z rzeczywistą skorupą, mostkiem i otworami; sprawdzenie osadzania oraz utrzymania sworznia. Zaginanie wykonywać z podparciem drutu narzędziem, bez przenoszenia momentu na policzek. Rozważyć lokalne zwiększenie materiału pod otworem, po kontroli kolizji.  
**Pewność: wysoka dla wymiarów; średnia dla ryzyka uszkodzenia.**

**8. WAŻNE — luz oczka jest widoczny w kącie gałki**

Przy zerze czułość wynosi około:

- S1: **0,347 mm/°**;
- S2: **0,334 mm/°**.

Sam pełny luz średnicowy oczka, **3−1 = 2 mm**, daje w przybliżeniu **5,76° / 5,99° pełnej szerokości luzu gałki**, nie wartości ±. Nie obejmuje to luzów Z ani przemieszczania sworznia w otworach Ø1,4.

**Scenariusz porażki:** po zmianie kierunku serwo najpierw wybiera luz; kierunek patrzenia zależy od kierunku dojazdu.

**Poprawka/test:** przy unieruchomionych orczykach zmierzyć pełny luz gałki w zerze i na krańcach oraz powtarzalność dojazdu z obu stron. Kalibracja ESP32 usuwa stały błąd zera, ale nie tę histerezę. Nie zmniejszać oczka bez ponownej kontroli przechyłu.  
**Pewność: wysoka dla skali przy zerze; średnia dla rzeczywistej histerezy pod obciążeniem.**

**9. WAŻNE — powieki zachowują skok, ale koszulki i montaż wymagają próby**

Nominalnie potwierdzam:

- S3: **+18,076° → −19,254°**, zakres **37,330°**;
- górna powieka: **0 → 51,5°**;
- dolna: **−0,177 → 51,326°**.

Ogon PG skierowany w dół usuwa raportowany kontakt z PD w badanym modelu; powtórzony odstęp wynosi **1,92 mm**. Zachować ten kierunek.

Koszulka Ø1,6 zatrzymuje się na otworze Ø1,4 z zakryciem tylko **0,10 mm na stronę**. Brakuje potwierdzenia jej średnicy po nasunięciu na drut i siły utrzymania.

**Scenariusz porażki:** miękka koszulka przesuwa się albo przechodzi przez otwór, uwalniając nogę L. Z kolei sworznie gałki mogą wymagać dostępu kombinerkami, którego sama kontrola drutu nie sprawdza.

**Poprawka/test:** zmontować próbkę L z rzeczywistą izolacją i wykonać próbę ciągnięcia oraz ruchu. Sworznie montować w luźnej gałce przed powiekami; sprawdzić rzeczywistymi kombinerkami. Ręczne gięcie ±2 mm jest wykonalne z doginaniem i przycinaniem, ale nie oznacza tolerancji obwiedni ±2 mm w miejscach z prześwitem 0,23 mm.  
**Pewność: wysoka dla wymiarów i kinematyki; średnia dla retencji i dostępu narzędziem.**

**10. WAŻNE — przyrząd do gięcia opisuje wcześniejsze końcówki**

[PrzyrzadDrutow](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/40-cad/openscad/duze-oko-v2.scad:357) nadal przewiduje m.in. Z przy obu końcach S2 oraz wcześniejsze haki. Nie odpowiada obecnym oczkom i nogom L.

**Scenariusz porażki:** prawidłowo użyty przyrząd daje drut niezgodny z zatwierdzonym połączeniem.

**Poprawka/test:** uaktualnić przyrząd i oznaczenia albo wyłączyć go z zestawu do druku i dostarczyć aktualne rysunki z kolejnością gięcia.  
**Pewność: wysoka.**

**DROBNE — eksport dolnej powieki wymaga oczyszczenia**

Kontrola pięciu STL wykazała zero otwartych i nierozmaitościowych krawędzi. `PowiekaDolna.stl` ma jednak **6 zdegenerowanych trójkątów** według kryterium narzędzia repo; pozostałe cztery siatki mają zero.

**Scenariusz porażki:** niejednoznaczna naprawa siatki przez slicer.  
**Poprawka/test:** oczyścić eksport i ponowić kontrolę do zera błędów.  
**Pewność: wysoka.**

**Zmiany potrzebne przed wydrukiem całego modelu**

1. Zapewnić drukowalne podparcie policzków S1/S2 i mostka; poprawić próbkę.
2. Zwiększyć lokalny prześwit mostka S2 dla przesuwanego oczka.
3. Ująć sworznie, zagięcia i rzeczywiste końce oczek w modelu kontrolnym; uzupełnić przemiatanie i stałość geometrii drutów.
4. Poprawić prześwity S1–gałka i PD–Pierścień oraz sprawdzić skrajne luzy osi powiek.
5. Zweryfikować wcisk S2 i retencję koszulek na próbkach; uaktualnić przyrząd.
6. Oczyścić eksport dolnej powieki.

Nie zmieniałem plików. Wszystkie uruchomione przeze mnie procesy zakończyły pracę.

**Werdykt: v6 nie nadaje się jeszcze do wydruku testowego całego mechanizmu — najpierw trzeba usunąć problem podparcia widełek, kontakt oczka S2 z mostkiem oraz uzupełnić kontrolę rzeczywistych połączeń.**