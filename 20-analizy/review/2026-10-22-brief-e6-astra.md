# Review briefu E6.1 — Astra, 22.10.2026

**Zadanie:** ocena [briefu E6.1](/home/rkp/Projects/010-Eye-pumpkin/Dynia-eyes/30-projekt/brief-e6-duze-oko-koncepcja.md) przed przekazaniem realizatorowi.

Brief dobrze zachowuje główne intencje: pełne 2c od pierwszej iteracji, otwór ≤ Ø80, lżejsze mocowanie, wykorzystanie researchu i uwzględnienie posiadanego kardana. **W obecnej postaci nie gwarantuje jednak koncepcji wystarczającej do przygotowania briefu CAD bez kolejnych ustaleń.** Najważniejsze luki dotyczą kinematyki przestrzennej, rozruchu serw, montażu całego zespołu i zasilania.

Ocena dotyczy treści briefu i lokalnego repo. Nie weryfikowałem ponownie filmów ani stron źródłowych; nie zatwierdzam geometrii przyszłego mechanizmu.

## A1. KRYTYCZNE — brak obowiązku sprawdzenia przestrzennej kinematyki napędu gałki

**Miejsce:** „Przeczytaj najpierw”, pkt 2; „Znane błędy…”; oczekiwany wynik, pkt 2.

**Fakt:** analiza z 18.10 uzasadnia dwa zwykłe przeguby śrubowe na każdym cięgnie twierdzeniem: „punkt na osi jednego ruchu nie przesuwa się w drugim ruchu”. Takie rozumowanie nie wystarcza dla dwóch złożonych obrotów kardana. Brief wymaga rachunku kątów powiek, ale nie wymaga analogicznego dowodu dla napędu gałki.

**Scenariusz porażki:** realizator przejmie układ dwóch sztywnych cięgien ze zwykłymi zawiasami M3. Każda oś osobno będzie wyglądała poprawnie, natomiast ruch po przekątnej spowoduje przekoszenie, zakleszczenie albo wymusi uginanie części.

**Rachunek ilustracyjny:** dla punktu oddalonego o `r = 20 mm`, przy złożeniu obrotów `Rx(15°) · Ry(25°)`, jedna ze składowych poprzecznego przemieszczenia wynosi:

`r · sin(25°) · sin(15°) = 2,19 mm`.

To przykład obalający ogólną deklarację niezależności, nie pomiar przyszłego mechanizmu.

**Konkretna poprawka — dopisać do „Znanych błędów” i pkt 2 wyniku:**

> Analiza z 18.10 nie dowodzi niezależności cięgien przy jednoczesnym ruchu obu osi. Podaj układ współrzędnych, kolejność osi kardana, punkty zaczepienia i dozwolone ruchy każdego przegubu. Policz napęd gałki w całym deklarowanym zakresie obu osi, także przy ruchach po przekątnej: wymagane wychylenia przegubów, sprzężenia osi, martwe punkty i kolizje. Nie przyjmuj, że luz otworu M3 zastępuje przegub przestrzenny.

**Pewność:** wysoka.

## A2. WAŻNE — „sprawdzony mechanizm” może oznaczać tylko powtórzenie twierdzenia researchu AI

**Miejsce:** twarde wymaganie 4, linia 26.

**Fakt:** README researchu wprost ostrzega, że materiał przygotowało AI, a parametry wymagają weryfikacji. Lista źródeł zawiera zastrzeżenie, że linki trzeba sprawdzić. Whitepaper opisuje zarówno powieki napędzane niezależnie, jak i sprzężenie jednym serwem; sam opis sprzężenia nie wskazuje jednoznacznie konkretnej działającej realizacji tego wariantu.

**Scenariusz porażki:** realizator napisze „według Cogleya/Paul’s Bots”, ale zaproponuje własne połączenie fragmentów różnych mechanizmów. Zmiana niezależnych powiek na jeden napęd albo zastąpienie przegubów kulowych zawiasami M3 może zmienić kinematykę, mimo zachowania nazw źródeł.

**Konkretna poprawka — rozszerzyć wymaganie 4:**

> Research AI jest indeksem źródeł, nie dowodem działania. Dla każdego przejętego mechanizmu wskaż konkretną wersję projektu i materiał potwierdzający jego pracę — fragment instrukcji, rysunek albo znacznik czasu filmu. Oddziel rozwiązanie pokazane w źródle od własnej adaptacji. Zmiana liczby serw, typu przegubów lub sposobu sprzężenia wymaga ponownego rachunku kinematyki; nie jest samym przeskalowaniem. Gdy brak potwierdzenia, oznacz podzespół jako niezweryfikowany i podaj próbę rozstrzygającą.

**Pewność:** wysoka co do ograniczeń materiału w repo; nie rozstrzygam, co dokładnie pokazują nieotwierane ponownie filmy.

## A3. WAŻNE — obrys roboczy nie wystarczy do wykazania montowalności w dyni

**Miejsce:** twarde wymaganie 1; wnioski „Montaż na stole”; wynik, pkt 1, 3 i 10.

**Fakty i rachunek:**

- Dla gałki Ø60, luzu 1,2 mm i ścianki powieki 2,2 mm z analizy 18.10 obrys samej czaszy wynosi `60 + 2 × (1,2 + 2,2) = 66,8 mm`.
- Do Ø80 pozostaje **6,6 mm promieniowo**, przed uwzględnieniem luzu montażowego, uszu, śrub, nakrętek i ramy. To nie dowodzi ani niemożliwości, ani kompletnego zmieszczenia.
- Analiza pudełka podaje niespójne gabaryty wieży: podstawę około 95 × 45 mm oraz końcowo około 105 × 60 mm. Ich przekątne wynoszą odpowiednio **105,1 i 120,9 mm**. Otwór wieczka Ø110 nie daje więc automatycznie pionowego przejścia większej wersji.
- Wolne 65 mm za ścianką jest szacunkiem, nie pomiarem.
- Brief dopuszcza „montuje od środka”, a jednocześnie wymaga złożenia mechanizmu na stole.

**Scenariusz porażki:** kompletny mechanizm mieści się przy ściance, ale nie przechodzi przez wieczko albo nie daje się obrócić obok wieży. Alternatywnie realizator ponownie przewidzi skręcanie cięgien wewnątrz dyni. Obrys dużego oka może też wejść w tyły małych modułów.

**Konkretna poprawka — rozszerzyć pkt 1 i 3:**

> Rozdziel obwiednię pracy, obwiednię przejścia przez otwór Ø80 oraz drogę wniesienia i obrotu kompletnego mechanizmu przez wieczko. Podaj minimalne wymiary otworu wieczka, przestrzeń na rękę i narzędzie oraz kolejność względem montażu wieży i małych oczu. Od środka wolno wykonywać mocowanie gotowego modułu i podłączenie przewodów; przeguby napędu składamy na stole. Wyznacz minimalne odstępy od małych modułów i wieży z ich obwiedni, bez przejmowania starego rozstawu 100 mm jako pewnika. Dla ścianki 15–35 mm pokaż położenie osi oka i zakres regulacji mocowania.

**Pewność:** wysoka. Rzeczywistych wymiarów dyni i wieży nie potwierdzono.

## A4. WAŻNE — pominięto aktualny problem zasilania i warunkowy konflikt kanałów

**Miejsce:** lista lektur; wynik, pkt 7, linia 56.

**Fakty:**

- Brief E5.5 i analizy z 22.10 opisują powtarzalne restarty zestawu z Baseusem. Przyczyna pozostaje nierozstrzygnięta; nie wolno zakładać stabilnego podtrzymania.
- „Małe oczy zajmują 0–12” przedstawia maksymalny przydział jako stan faktyczny. Brief E5.5 mówi o około 10 małych oczach.
- `13 małych + 3 dużego = 16` kanałów. Proponowane w analizie A sterowanie obciążeniem podtrzymującym z PCA9685 wymagałoby **17. kanału**, gdyby wykorzystać wszystkie 13 małych oczu.
- Szacunek z analizy 18.10, `0,7–1 A` na zablokowane MG90S, daje **2,1–3 A dla trzech serw**, bez małych oczu i ESP. To scenariusz awaryjny, nie zmierzony pobór roboczy.

**Scenariusz porażki:** koncepcja przewidzi wyłączenie PWM w spoczynku, utratę pozycji i kolejne gwałtowne rozruchy; przydział kanałów uniemożliwi wariant podtrzymania. Sam rachunek prądu trzech MG90S pominie resztę dyni.

**Konkretna poprawka — dopisać lektury i zastąpić pkt 7:**

> Przeczytaj brief E5.5 oraz obie analizy powerbanku z 22.10. Podaj budżet prądu całej dyni dla spoczynku, pracy, rozruchu i zablokowania napędu, oddzielając pomiary od szacunków. Określ zachowanie mechaniki po wyłączeniu PWM i utracie zasilania, w tym utrzymanie zamkniętych powiek. Kanały 13–15 traktuj jako proponowaną rezerwację dużego oka, a 0–12 jako maksymalną pulę małych oczu; uwzględnij ewentualny kanał podtrzymania. Nie wybieraj nowego źródła zasilania w tym zadaniu; podaj wymagania i zależności od wyniku E5.5.

**Pewność:** wysoka; parametry prądowe MG90S wymagają potwierdzenia.

## A5. KRYTYCZNE — przeżycie skoku serwa zastępuje wymaganie bezpiecznego uruchomienia

**Miejsce:** wniosek o pierwszym impulsie, linia 36; wynik, pkt 7–8.

**Fakt:** brief poprawnie rozpoznaje brak informacji o pozycji, lecz proponuje „twarde ograniczniki albo zakres bez kolizji”. Ogranicznik nie usuwa skoku i może zatrzymać nadal zasilane serwo pod obciążeniem. Zapis ostatniego polecenia w NVS nie dowodzi pozycji rzeczywistej po zaniku zasilania ani po ręcznym poruszeniu oka.

**Scenariusz porażki:** mechanizm pozostanie cały, ale powieka przytnie palec, serwo uderzy w ogranicznik lub będzie stale na niego napierać. To nie spełnia intencji użytkownika dotyczącej spokojnego uruchamiania.

**Konkretna poprawka — zastąpić linię 36:**

> Rozdziel bezpieczne uruchomienie i kalibrację od odporności na awarię. NVS ani rampa poleceń nie gwarantują łagodnego pierwszego ruchu przy nieznanej pozycji serwa. Opisz procedurę pierwszego uruchomienia, restartu po zaniku zasilania oraz ponownego załączenia po ręcznym przestawieniu oka. Ograniczniki nie mogą służyć jako normalny punkt dojazdu pod prądem. Wskaż dostępne od zewnątrz miejsca przycięcia palca, sposób ich ograniczenia oraz test rozruchu i zatrzymania napędu.

**Pewność:** wysoka.

## A6. WAŻNE — masa nie wystarczy do uzasadnienia „lekko i cienko”

**Miejsce:** twarde wymaganie 2; wynik, pkt 3–5.

**Fakt:** brief wymaga mas części i całego mechanizmu, ale nie wymaga sprawdzenia momentów napędowych, sztywności ani obciążenia mocowania. Wyrażenie „objętość × gęstość przy założonym wypełnieniu” pozostawia niejasną metodę szacowania.

**Scenariusz porażki:** realizator obniży masę przez cienkie ramiona i powieki, które ugną się bardziej niż przewidziany luz. Mocowanie będzie lekkie, ale ciężar trzech serw i ramię ich odsunięcia wyrobią otwór w mięknącej ściance dyni.

**Konkretna poprawka:**

> Zaproponuj i uzasadnij docelową masę oraz grubości części. Masę wydruków szacuj z objętości materiału: pełnych ścian i żeber oraz wypełnienia wnętrza; nie mnoż całej objętości przez procent wypełnienia. Do masy zespołu dolicz serwa, kardan, śruby i przewody. Dla napędów podaj wymagany moment w najgorszym położeniu i zapas względem MG90S przy przyjętym napięciu, bez utożsamiania momentu zablokowania z roboczym. Dla mocowania podaj środek ciężkości, moment względem ścianki, powierzchnię docisku i próbę utrzymania w mokrym miąższu przez czas ekspozycji.

**Pewność:** wysoka co do brakującego kryterium; nośność miąższu wymaga próby.

## A7. WAŻNE — wynik może pozostać opisem, z którego wykonawca CAD będzie musiał sam zaprojektować mechanizm

**Miejsce:** wynik, pkt 1–6 i 10–11.

**Fakt:** wymagane są „wymiary orientacyjne”, lista części i główne zmienne. Nie ma obowiązku zwymiarowanego schematu złożenia, jednoznacznej definicji zamknięcia powiek ani wskazania, które niewiadome blokują dalszą pracę.

**Scenariusz porażki:** raport będzie kompletny formalnie, ale nie określi położenia osi, zaczepów i warstw połączenia. CAD wymyśli je ponownie. „Zamknięte” powieki mogą zostawić szczelinę albo wymagać wzajemnego docisku. Pomiar kardana dopiero przed CAD może unieważnić wybraną architekturę.

**Konkretna poprawka — dopisać do oczekiwanego wyniku:**

> Dołącz zwymiarowany schemat złożenia w widoku z przodu, z boku i w przekroju: osie, punkty zaczepienia, ramiona, długości cięgien, promienie czasz oraz stosy uszu, tulejek, podkładek, łbów i nakrętek. Określ kryteria otwarcia i zamknięcia powiek, dopuszczalną szczelinę bez wzajemnego docisku oraz brak odsłonięcia wnętrza gałki w deklarowanym zakresie patrzenia. Dla każdego brakującego pomiaru podaj przyjęty przedział, wpływ na koncepcję i warunek jej odrzucenia. Zbierz pytania blokujące w jednym pakiecie; limit pięciu pytań nie może ukrywać brakujących danych.

Nie oczekuję na tym etapie pełnego drzewa operacji, eksportów ani kontroli siatek. Te pozostają zadaniem CAD. Szkic wymiarowy i rachunek kinematyki są natomiast potrzebne już w koncepcji.

**Pewność:** wysoka.

## A8. WAŻNE — nie przeniesiono terminu, kompletnego zestawu i demontażu po wystawie

**Miejsce:** wynik, pkt 3–4 i 9.

**Fakty:**

- Montaż dyni **27.10** występuje zarówno w analizie dużego oka z 18.10, jak i w `30-projekt/plan-realizacji.md`.
- Nie znalazłem późniejszej zmiany ani świeżego potwierdzenia tej daty. Plan zawiera też nieaktualne rozwiązania, więc nie traktuję go jako aktualnego zobowiązania terminowego.
- Przekazanie z 21.10 zawiera wymaganie kompletnego zestawu do druku.
- Brief wymaga czasów poszczególnych części, ale nie sumy dla całego zestawu ani procedury odzyskania mechanizmu.

**Scenariusz porażki:** powstanie poprawna koncepcja wymagająca wielu kolejnych druków lub dostaw. Realizator może też przejąć z analizy 18.10 awaryjny powrót do 2a, sprzeczny z obecnym zleceniem 2c.

**Konkretna poprawka:**

> Roboczy termin montażu dyni zapisany w repo to 27.10; jego aktualność wskaż jako niepotwierdzoną. Podaj łączny szacowany czas druku pełnego zestawu 2c, liczbę płyt i założony profil, oddzielnie próbki pasowań. Po próbkach przewidź jeden kompletny zestaw, razem z potrzebnymi przyrządami. Nie przejmuj wariantu awaryjnego 2a/2b z analizy 18.10. Opisz odłączenie, wyjęcie i odzyskanie mechanizmu po Halloween oraz wymianę serwa bez niszczenia części.

**Pewność:** wysoka co do zapisów; średnia co do aktualności terminu.

## A9. WAŻNE — „najlepiej jedno serwo” staje się bezwarunkowym wymaganiem

**Miejsce:** linia 7 wobec pkt 2 wyniku, linia 51.

**Fakt:** wstęp i `opis.md` mówią „najlepiej z jednego serwa”. Punkt 2 wymaga już opisania, „jak dwie powieki poruszają się z jednego serwa”.

**Scenariusz porażki:** realizator uzna, że musi przedstawić sprzężenie jednoserwowe nawet wtedy, gdy nie znajdzie potwierdzonego rozwiązania mieszczącego się w ograniczeniach. To wzmacnia ryzyko z A2.

**Konkretna poprawka — zmienić początek pkt 2:**

> Wariant podstawowy: dwie powieki sprzężone jednym serwem, łącznie trzy serwa dużego oka. Jeśli nie potrafisz uzasadnić takiego wariantu w pozostałych ograniczeniach, pokaż konkretną przeszkodę i konsekwencje alternatywy; zmiana liczby serw wymaga decyzji użytkownika, bez redukcji funkcji 2c.

**Pewność:** wysoka.

## A10. DROBNE — trzy nieprecyzyjne informacje o stanie projektu i sprzęcie

**Miejsce:** linie 7, 17 i 33.

**Fakty:**

- Działa moduł złożony z części v2.6/v2.7 i starszych; wydruk v2.8 nie jest potwierdzony w dzienniku.
- Cztery MG90S znajdują się w `sprzet.md` w sekcji **„Zamówione (w drodze)”**.
- `luzKorpusSerwa = 0,4` opisano w decyzji z 21.10 jako luz **z przodu i z tyłu**, nie ogólnie w każdym kierunku.

**Scenariusz porażki:** realizator potraktuje niezweryfikowane rozwiązania jako sprawdzone na sprzęcie, założy natychmiastowy dostęp do MG90S lub bez uzasadnienia przeniesie wszystkie luzy SG90 na MG90S.

**Konkretne zamiany:**

> Działa pierwszy moduł małego oka z części v2.6/v2.7 i wcześniejszych; v2.8 ma gotowy model i sprawdzony eksport, lecz wydruk i montaż nie są potwierdzone.

> MG90S ×4 są według spisu zamówione; odbiór dostawy wymaga potwierdzenia.

> W v2.8 luz korpusu SG90 wynosi 0,4 mm z przodu i z tyłu; wymiary kieszeni MG90S wyznacz z pomiarów i wymagań mocowania.

**Pewność:** wysoka.

## Ocena zakresu i sprzeczności

Jedna koncepcja z krótkim porównaniem 2–3 sposobów mocowania jest wykonalnym zakresem jednego raportu. Nie ma potrzeby zamawiać kilku kompletnych architektur ani pełnego planu operacji Onshape. Po wyborze mocowania dalsze obliczenia powinny dotyczyć jednego wariantu.

Nie stwierdzam dowodu, że Ø60, dwie powieki i otwór Ø80 są wzajemnie sprzeczne. Nie ma też koniecznej sprzeczności między lekką konstrukcją a pewnym mocowaniem serw. Brief musi jednak wymagać wykazania obu własności liczbami.

Nie można uczciwie obiecać przejścia do CAD bez dodatkowych danych, skoro gabaryty kardana, MG90S i dostępnej przestrzeni pozostają nieznane. Można natomiast zebrać je w jednym pakiecie i określić granice, w których koncepcja zachowuje ważność.

Nie zmieniono żadnych plików. Nie uruchomiono procesów w tle.

**Werdykt: ZIELONE PO POPRAWKACH A1–A9; A10 należy skorygować redakcyjnie przed wysłaniem briefu realizatorowi.**