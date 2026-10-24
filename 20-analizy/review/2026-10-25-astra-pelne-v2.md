Zadanie E6: pełne review dużego oka v2. Oceniłam bieżące pliki, bez git, zapisu i ponownego eksportowania wariantów.

Niezależna kontrola bazowych 3MF: **0 błędów szczelności, degeneracji i orientacji trójkątów**; pojedyncze części mają po jednej bryle, zbiorczy siedem. Wszystkie części mieszczą się na A1 mini i mają płaskie oparcie na z=0. Największy Pierścień ma **104 × 104 × 46 mm**.

**KRYTYCZNE**

**K1. Kontrola kolizji nie dowodzi poprawności całego rzeczywistego mechanizmu.**  
**Miejsce:** `duze-oko-kolizje.js`, linie 82, 133–191.  
**Scenariusz porażki:** badane jest **9 × 7 położeń gałki i 7 powiek**; względem gałki powieki występują tylko jako zamknięte lub otwarte. Pominięto kolanka Z, ogony, pełny kardan, przewody i drogi montażowe. Przy drutach wyłączono początkowe **3–4 mm**, czyli właśnie okolice przegubów. Ponadto dwa druty Ø1 przy S3 trafiają w solverze w jeden punkt, chociaż ich rzeczywiste osie muszą być oddalone co najmniej o **1 mm**. Wynik „0 przenikań” opisuje uproszczenie, a nie cały mechanizm.  
**Poprawka:** uwzględnić rzeczywiste końcówki i obwiednie części kupnych, sprawdzić brakujące kombinacje ruchu oraz wsuwanie. Zagęszczać wszystkie małe odstępy; sam krok 10° przesuwa punkt na R30 o **5,23 mm** między próbkami.  
**Pewność:** wysoka co do braków kontroli; kolizja rzeczywistego zespołu pozostaje niesprawdzona.

**WAŻNE**

**W1. Luz S1–gałka nadal nie spełnia tabeli.**  
**Miejsce:** `kolizje-v2.txt`, blaszka ucha gałki.  
**Scenariusz porażki:** minimum wynosi **0,42 mm**, wobec wymaganego nominalnie **≥0,5 mm**. Zapas jest mniejszy o **0,08 mm**, jeszcze przed błędami wykonania. Raport nie zamyka tej uwagi — przekazuje ją próbce.  
**Poprawka:** sprawdzić rzeczywiste Z na próbce i zapewnić wymagany odstęp po ewentualnej obróbce; wynik przenieść do geometrii i ponownie przeliczyć.  
**Pewność:** wysoka dla niespełnienia progu; średnia dla wystąpienia ocierania po druku.

**W2. Próba ±35° nie wystarcza jako jednoznaczny test końcówek.**  
**Miejsce:** raport nocny, sekcja „Próbka drutu”.  
**Scenariusz porażki:** z geometrii i stałych długości otrzymałam minimalny wymagany przechył około **38,4° dla S1** przy θ=35°, φ=−25° oraz **38,1° dla S2** przy θ=35°, φ≈−2°. To dolne oszacowanie, dopuszczające swobodny obrót korpusu drutu. Próba po 35° osobno w dwóch płaszczyznach może przepuścić końcówkę klinującą w narożniku ruchu.  
**Poprawka:** badać oba rodzaje Z, w tym S2 z kątem 75°, w rzeczywistych skrajnych kierunkach; objąć co najmniej **40°** oraz kontakt korpusu i ogona z blaszką.  
**Pewność:** wysoka dla obliczonego wymagania.

**W3. Kontrola zakłada skrócone orczyki, ale instrukcja nie każe ich skracać.**  
**Miejsce:** `duze-oko-kolizje.js`, `orczykX()` i `orczykY()`.  
**Scenariusz porażki:** koniec ramienia modelowany jest jako `r + 2,5`: **16 mm dla S2 i 10 mm dla S3**. Dane posiadanego orczyka podają otwory aż do **17,5 mm**. Nieobciętego końca S3 kontrola zatem nie obejmuje.  
**Poprawka:** modelować pełny używany orczyk albo jednoznacznie podać jego skrócenie, zachowując materiał wokół wybranego otworu.  
**Pewność:** wysoka dla rozbieżności; nie stwierdzam na tej podstawie konkretnej kolizji.

**W4. „ZALICZONY” w teście zginania nie oznacza spełnienia wymaganych luzów.**  
**Miejsce:** `zginanie-werdykt.sh`, linie 8–14; `zginanie-v2.txt`.  
**Scenariusz porażki:** wariant Ø1,2 otrzymuje „ZALICZONY” przy **0,35 mm S1–gałka i 0,38 mm między drutami powiek**. Wariant Rg29 przechodzi przy **0,40 i 0,44 mm**. Skrypt jedynie wypisuje odstępy poniżej 0,5 mm.  
**Poprawka:** przypisać parom odpowiednie progi z tabeli i rozdzielić „przeliczył się” od „spełnia wymagania mechaniczne”. Styki montażowe i luzy osiowe powinny mieć własne kryteria.  
**Pewność:** wysoka.

**W5. Test zginania potwierdza przeliczenie, lecz nie pełną poprawność zależności.**  
**Miejsce:** sekcje BAZOWE/POCHODNE/GRANICE oraz `zginanie.sh`.  
**Scenariusz porażki:** zależności są rzeczywiste: zmiana Rg zmienia długości drutów, a asercje prawidłowo odrzucają Rg30,5 i Rg31. Brakuje jednak automatycznego porównania oczekiwanych wymiarów brył z pomiarem: przykładowo przy ściance **28/40/50 mm** wysokość Pierścienia powinna wynosić **34/46/56 mm**. Działający eksport i solver nie zastępują takiego pomiaru.  
**Poprawka:** dodać oczekiwane wymiary i ich pomiary, także dla zmiany skoku oraz wymiaru serwa.  
**Pewność:** wysoka.

**DROBNE**

**D1. Instrukcja kalibracji zawiera niedziałające wywołanie.**  
**Miejsce:** `duze-oko-v2-montaz.md`, krok 8.  
**Scenariusz porażki:** przekazuje `'{...}'`, podczas gdy skrypt wymaga ścieżki kończącej się `.json` i zakończy się kodem 2.  
**Poprawka:** podać rzeczywistą ścieżkę do `parametry.json`.  
**Pewność:** wysoka.

**D2. Wymiar zastępczego wkrętu M2 jest niejednoznaczny.**  
**Miejsce:** raport nocny, „Założenia przyjęte bez użytkownika”.  
**Scenariusz porażki:** od spodu łba x=32,1 do dna x=38,1 jest **6,0 mm**; podane **7,6 mm** obejmuje również wysokość łba 1,6. Zastosowanie 7,6 jako długości pod łbem przesunie łeb o 1,6 mm w stronę gałki.  
**Poprawka:** rozdzielić długość pod łbem i całkowitą.  
**Pewność:** wysoka.

Pozostałe sprawdzenia: długości idealnych cięgien **41,856 / 42,890 / 44,561 mm** zgadzają się z SVG; kąt S2 około **75,1°** również. Kolejność montażu zapewnia dostęp do M2 przed gałką i M4 przed zamknięciem zespołu, ale nie ma kontroli brył narzędzi ani przemiatania montażowego. Podpory pod stożkiem gałki i czaszami są opisane; nawisy ucha wymagają oceny na reprezentatywnej próbce. Szczelina czasz **0,7 mm**, po przeciwnych przesunięciach promieniowych po 0,2 mm, pozostawia nominalnie **0,3 mm**.

Propozycje nowych funkcji: brak. Procesy w tle: brak.

**Werdykt: próbkę drutu można drukować i sprawdzić w rozszerzonym zakresie, ale dużego oka v2 nie uznaję jeszcze za gotowe do wydruku testowego pozostałych części.**