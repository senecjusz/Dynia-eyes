Zadanie: review [planu dużego oka v2](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/40-cad/onshape/duze-oko-v2-plan.md). Ocena rachunkowa przed CAD; podane w planie odstępy nie są jeszcze pomiarami geometrii.

## KRYTYCZNE

**K1. Klepsydra nadal nie zapewnia przechylenia drutu.**  
**Miejsce:** §2, `dKlep`, oraz §4.1–2.  
**Porażka:** dla drutu Ø1, przewężenia Ø1,2 i długości 0,4 mm warunek przechylenia wynosi:
`1/cos φ + 0,4·tan φ ≤ 1,2`.
Granicą jest **19,3°**, zamiast wymaganych 25–35°. Przy 35° potrzeba minimum **Ø1,501**, jeszcze bez zapasu wykonania. Końcówka będzie klinować albo zginać drut. Poprzednia krytyka podała niewystarczające przewężenie.  
**Poprawka:** przeliczyć przewężenie, stożki i ogon Z jako jeden przegub; próbka ma sprawdzać rzeczywiste ±35° z zamontowanym drutem.  
**Pewność:** wysoka.

**K2. Stożek piasty gałki zaczyna druk w powietrzu.**  
**Miejsce:** §1 i §4.2.  
**Porażka:** druk zaczyna się na `z = −8`, a wierzchołek Ø9,5 na `z = 13,25`, czyli **21,25 mm nad stołem**. W tym przekroju wewnętrzna powierzchnia gałki R28 ma promień **24,67 mm**; od piasty r4,75 oddziela ją **19,92 mm pustki**. Stożek rozszerzający się pod 45° spotka skorupę dopiero około `z = 23,59`. Kąt 45° nie zapewnia podparcia pierwszych warstw.  
**Poprawka:** połączyć piastę ze strukturą wyrastającą od rantu na stole; sprawdzić warstwami również gniazdo T.  
**Pewność:** wysoka.

**K3. Opis ramienia dolnej powieki dopuszcza bezpośrednią kolizję z górnym.**  
**Miejsce:** §4.3–4.  
**Porażka:** dolne „ramię pierścieniowe r4,5…14,9” zajmuje `|x| = 32…35,5`; górne ramię dochodzi do r14 i obejmuje `|x| = 32,3…33,8`. Jeżeli dolne ramię jest pełnym pierścieniem, punkt **(−33; 7,07; 7,07)** należy do obu części. Wycięcia sferyczne go nie usuną: odległość od środka wynosi **34,48 mm**. Jeśli chodziło o wycinek, brakuje jego kątów.  
**Poprawka:** określić sektor dolnego ramienia i sprawdzić oba ramiona przy rzeczywistym sprzężonym ruchu powiek, z luzem ≥0,5 mm.  
**Pewność:** wysoka dla pełnego pierścienia; zamierzony kształt jest niejednoznaczny.

## WAŻNE

**W1. Kąty serw policzono ze skoku z, pomijając stałą długość cięgien.**  
**Miejsce:** §3.  
**Porażka:** dla S1 przy `α = −35°, β = 0°` ucho leży w **(21,463; 0; 7,704)**. Najmniejsza odległość do całego okręgu orczyka wynosi **38,480 mm**, a cięgno neutralne ma **38,013 mm**. Ta pozycja jest nieosiągalna; granica wypada około **33,7°**. Przy deklarowanych 62° serwa potrzebne byłoby cięgno **38,900 mm**. Dla S2 osiągnięcie +25° wymaga około **66,4°** przy długości 39,6 mm, zamiast 59°.  
**Poprawka:** rozwiązać przestrzenne równania długości obu cięgien; dobrać promienie, położenia osi i długości, następnie wyznaczyć ciągłą gałąź ruchu. Minimum PRD ±30°/±20° pozostaje możliwe; deklarowany cel wymaga korekty.  
**Pewność:** wysoka.

**W2. Narożniki nie są osiągalne jako pełny prostokąt ±35° × ±25°.**  
**Miejsce:** §5.  
**Porażka:** przy `α = +35°, β = +25°` minimalna odległość ucha S2 od jego orczyka przekracza długość neutralnego cięgna o około **1,73 mm**. To brak rozwiązania kinematycznego, niezależny od kolizji brył.  
**Poprawka:** wyznaczyć osiągalną obwiednię i odpowiadające jej pozycje serw; dopiero na niej badać kolizje. PRD dopuszcza mniejsze narożniki, więc nie trzeba zmieniać funkcji.  
**Pewność:** wysoka.

**W3. Wspólny otwór S3 nie zapewnia symetrycznych położeń powiek.**  
**Miejsce:** §3, powieki i dwa druty 44,7 mm.  
**Porażka:** nawet przy idealizacji obu końców w jednym punkcie, dla orczyka −27,6° rachunek daje otwarcie około **50,4° górnej i 48,2° dolnej**. Dwa rzeczywiste druty Ø1 w otworze Ø2,1 dodatkowo mają różne środki, oddalone co najmniej o 1 mm; ich położenia zależą od kontaktu z otworem.  
**Poprawka:** policzyć oba cięgna osobno, uwzględnić końcówki Z i ustalić wspólne krańce pełnego zamknięcia oraz otwarcia. Próbka powinna odtwarzać również grubość orczyka.  
**Pewność:** wysoka dla asymetrii idealnego mechanizmu; średnia dla zachowania rzeczywistych końcówek.

**W4. Luz między czaszami nie spełnia warunku po uwzględnieniu luzów osi.**  
**Miejsce:** §2 i §5.  
**Porażka:** nominalne **0,5 mm** między powiekami maleje do **0,1 mm**, gdy obie powieki przesuną się przeciwnie po 0,2 mm na otworach Ø2,4/M2. Tabela wymaga ≥0,2 mm po uwzględnieniu luzów. Deklarowane **0,4 mm** ogona Z względem tuby również jest poniżej nominalnego minimum 0,5 mm.  
**Poprawka:** zwiększyć szczelinę czasz do przynajmniej **0,6 mm** przed uwzględnieniem błędów druku; policzyć pełną obwiednię ogona Z i jego luzów.  
**Pewność:** wysoka.

**W5. Stos M2 mieści się wymiarowo, ale nie definiuje sposobu zachowania luzu osiowego.**  
**Miejsce:** §2, `xLeb…xPad`.  
**Porażka:** pod łbem na x32,1 i przed podkładką na x35,7 jest **3,6 mm**, w tym dwa ucha po 1,5 mm i razem 0,6 mm szczelin. Dokręcenie śruby bez dystansu lub oporu może zacisnąć ruchome ucha. M2×6 sięga do x38,1, dając **2,4 mm** wkręcenia w podkładkę — sama długość jest poprawna.  
**Poprawka:** określić konstrukcyjny opór dokręcania albo kontrolowaną metodę ustawienia i utrzymania luzu.  
**Pewność:** wysoka.

**W6. Brakuje sprawdzalnej kolejności montażu i dostępu narzędzi.**  
**Miejsce:** §1, gniazda T, oraz §4.5–7.  
**Porażka:** po osadzeniu gałki prosty dostęp wzdłuż x do łbów osi M2 przecina skorupę gałki. Wkręcenie piast na stole rozwiązuje dostęp do M4, ale plan nie pokazuje późniejszej drogi wsunięcia obu gniazd T ani utrzymania ich dosunięcia podczas pracy.  
**Poprawka:** ustalić kolejność: osie i powieki, zespół kardana z gałką, uchwyt, cięgna; sprawdzić przesunięcia montażowe oraz bryły narzędzi dla M2, M3 i wkrętów serw. Określić, co utrzymuje każde otwarte gniazdo T w położeniu roboczym.  
**Pewność:** wysoka dla ograniczenia dostępu; średnia dla możliwości całej sekwencji.

**W7. Nie określono wielkości źrenicy wymaganej do kontroli pełnego otwarcia.**  
**Miejsce:** §2–3; koncepcja §6.  
**Porażka:** Ø24 dotyczy tęczówki. W osi pionowej daje ona półkąt **23,58°**, a przy spojrzeniu 25° i powiece 50° zostaje tylko **1,42°** zapasu. Asymetria napędu z W3 jest większa. Bez średnicy źrenicy nie można rozstrzygnąć wymagania PRD, szczególnie w narożnikach.  
**Poprawka:** przyjąć jawne założenie średnicy źrenicy i sprawdzić jej odsłonięcie przy rzeczywistych krańcach obu powiek i osiągalnej obwiedni gałki.  
**Pewność:** wysoka.

## DROBNE

**D1. Maskownica ma luz zamiast wcisku.**  
**Miejsce:** §2 i §4.6.  
**Porażka:** Ø79,1 na Ø79 daje **+0,05 mm na stronę**, podczas gdy tabela dla wcisku podaje 0…−0,05 mm. Nominalnie maskownica nie ma zapewnionego trzymania.  
**Poprawka:** dobrać średnicę na próbce tego pasowania i zapisać wynik jako zmienną.  
**Pewność:** wysoka.

**D2. Wymiary klepsydry są wewnętrznie niespójne.**  
**Miejsce:** §2.  
**Porażka:** przewężenie Ø1,2×0,4 w płytce 2 mm, ze stożkami 40° względem osi, daje wylot **Ø2,543**, zamiast Ø2,4.  
**Poprawka:** uzależnić średnicę wylotu od kąta, długości przewężenia i grubości płytki.  
**Pewność:** wysoka.

Podpory pod czaszami powiek są opisanym wyjątkiem DFAM; po ich usunięciu trzeba ponownie ocenić szczelinę roboczą. Nie stwierdzam przekroczenia pola A1 mini z podanych gabarytów. Kontrola kolizji musi uwzględniać również pozycje pośrednie i pary nieruchome — samo 7×5 położeń nie dowodzi zachowania minimalnego luzu.

Propozycje zmian funkcji: brak. Nie uruchomiłem procesów w tle.

**Werdykt: planu w obecnej postaci nie należy budować w CAD; najpierw trzeba poprawić przeguby drutów, podparcie piasty gałki i geometrię ramion powiek oraz przeliczyć pełną kinematykę cięgien.**