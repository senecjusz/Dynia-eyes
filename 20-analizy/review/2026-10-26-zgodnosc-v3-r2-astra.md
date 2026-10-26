# Astra — zgodność dużego oka v3, runda 2

26.10.2026. Baza: `d7a6dae443d153da3bb1683f8e3b83a15649b021`; porównanie z `ca3b376`, zmiany `871090f` i `d7a6dae`. Zakres: zamknięcie uwag r1 i wykonanie decyzji PM, bez nowych ulepszeń.

**Wynik: kolizja serw i większość uwag montażowych są zamknięte; otwarty pozostaje dowód ruchu rzeczywistego, sztywnego „Z”.**

Skróty: **SCAD** — `40-cad/openscad/duze-oko-v3.scad`; **montaż** — plik `duze-oko-v3-montaz.md` obok; **KIN** — `40-cad/narzedzia/duze_oko_v3_kinematyka.py`; **SWEEP** — `40-cad/narzedzia/duze-oko-v3-przemiatanie.py`.

## Uwagi KRYTYCZNE i WAŻNE z rundy 1

| Uwaga r1 | Stan | Dowód i granica zamknięcia |
|---|---|---|
| Astra K1 / Opus K1: kolizja L–P–PG | **ZAMKNIĘTA** — kolizja | SCAD: `PG_wal.z=−95`. Przód korpusu PG: −88,75; tył korpusu L–P: −83,3; tył jego ucha: −87,8. Odstępy odpowiednio **5,45 i 0,95 mm**. Uszy uwzględnione. Droga wkładania oceniona osobno niżej. |
| Astra W1: wkrętak dolnego orczyka | **ZAMKNIĘTA** | Montaż kroki 8→9: orczyki powiek dokręcane przed włożeniem L–P. Oś PD `(x;−9,5;−76)` nie przecina już L–P; do przedniej ściany PG w z jest **12,75 mm**, do tylnej ściany GD **9,75 mm**. Płyta jest 5,5 mm pod osią, czyli trzon Ø3 ma do niej 4 mm. Nie potrzeba wcześniejszego przejścia Ø2 bez luzu. |
| Astra W2: niepodparte końce zaczepów | **ZAMKNIĘTA w instrukcji druku** | Montaż, wiersz Gałki: podpory pod piastą, końcem L–P i spodem nowego słupka G–D. Na 3MF poziomy spód wysięgu L–P ma **14,40 mm²**, spód G–D **6,00 mm²**, oba na z=−7, czyli 4,5 mm nad stołem. Są teraz jawnie wskazane do podparcia. Nie otrzymano projektu po cięciu w slicerze. |
| Astra W3: niepełny dowód bezkolizyjności | **OTWARTA — WAŻNE** | Pary nieruchome, uszy serw, wszystkie trzy tuby i gęstsza kontrola gałka–powieki dodane; ograniczenia opisane. Jednak SWEEP nadal deformuje „Z”, zamiast przechylać sztywną poprzeczkę w otworze. Liczby poniżej. Końcowe zdanie montażu §8 „z rzeczywistym kształtem Z” nadal jest zbyt mocne. |
| Astra W4: cztery dodatkowe kołki | **ZAMKNIĘTA** | SCAD `przedluzenie_orczyka()`, linie 259–264: pozostał otwór piasty Ø7 i otwór drutu na r25; usunięte otwory r5,5/r17,5. Montaż krok 2: tylko CA. Siatka przedłużenia jest jedną bryłą. |
| Opus W1: przygnieciony kabel G–D | **ZAMKNIĘTA dla przyjętego MG90S** | SCAD linia 220: przelot **8,2×8 mm**, x=−33,7…−25,5, z=−64…−56, przez całą płytę. Montaż krok 3 nakazuje przełożyć kabel przed osadzeniem serwa. Wychodzący przy x≈−31 kabel ma przejście; położenie wyjścia rzeczywistego egzemplarza nadal jawnie oznaczone jako założenie do testu. |
| Opus W2: wcisk osi wyginający słupek | **ZAMKNIĘTA** | SCAD: `sl_otw=2,4`, wielokąt opisany. Własny pomiar 3MF: światło słupka **2,399998 mm**, uszu **2,399998 mm** — Ø2,4 z dokładnością eksportu; luz promieniowy **0,20 mm**. Montaż krok 7: wsuwanie bez siły, CA tylko w słupku. Zamyka również Astra D1. |
| Opus W3: brak centrowania podczas klejenia | **ZAMKNIĘTA w procedurze** | Montaż krok 11: czoła słupków 2 mm za rantem, równy pierścień wokół gałki, słupki poziomo, jedna osoba trzyma, druga kontroluje od frontu. Opadanie do 4,8 mm i kontrola po druku są zapisane. Geometria nie stała się samocentrująca i instrukcja tego nie twierdzi. |

**Pozostałe decyzje PM zachowane:** jedna pozioma płyta ze słupkami; zaczepy powiek r34/r31,5 przy x=±5; klej do tuby; tuby 30/40/50; jedna centralna piasta; R37,2 słupków. Tylna piasta kardana nadal dokręcana przed gałką, przednia kluczem od −x. Gniazdo M5 Ø9,5×5,2 i łeb ISO 4762 Ø8,5×5 dają nominalnie 0,5 mm na klej promieniowo. Źrenica Ø20 i wysunięcie 24 pozostają założeniami.

Zapisane przemiatanie podaje **0/139** par poniżej wymogu, w tym sześć serwo–serwo i cztery serwo–płyta. Nie powtarzałem całego przemiatania. Wyniki pręt L–P–gałka **0,79**, G–D–gałka **0,82** i drut dolnej powieki–gałka **1,18 mm** są wynikami dostarczonego modelu drutów, nie niezależnym potwierdzeniem rzeczywistych zakończeń. Uwaga Astra D2 o świetle tylnym pozostaje drobna: Ø51,1 opisuje samą czaszę; podparcie L–P dochodzi na krawędzi do x=24,5, więc wspólny wolny okrąg ma **Ø49,0**. Droga klucza po −x nie trafia w tę podporę.

## „Z”: otwór poprawiony, cały drut jeszcze niezweryfikowany

Niezależnie rozwiązałem równanie długości używane w KIN: `|c + e·cos(a) + f·sin(a) − R·j|²=L²`, analitycznie, wybierając rozwiązanie najbliższe zeru. Parametry z SCAD, `R=Ry(ψ)Rx(−θ)`, siatka co 1°. Punkty zagięcia modelu w zerze: L–P `(15,3;4;−4,5)`, G–D `(0;11,3;−4,5)`. Kąt wyjścia liczony jako `asin(|u·n|)`.

| Zaczep | Maksimum przy drugiej osi w zerze | Maksimum w całym prostokącie ±35°/±25° | Granica otworu | Zapas |
|---|---:|---:|---:|---:|
| L–P | 30,145° przy (0;−25°) | 30,145° | 36,870° | **6,725°** |
| G–D | 29,812° przy (0;+25°) | 29,812° | 36,870° | **7,058°** |

W czterech narożnikach maksimum tego kąta wynosi **26,596° L–P / 23,968° G–D**. Na obu otworach 3MF zmierzyłem gardziel **Ø1,999998 mm**; długość 1,0 i fazki po 0,5 mm wynikają z SCAD `otwor_dwustozkowy()`. Z warunku `1/cos(γ)+1·tan(γ)≤2` wynika powyższa granica, a przy najgorszym kącie pozostaje **0,131 mm na stronę** w gardzieli. **Sam warunek otworu przechodzi nominalnie, także w narożnikach.** Próba ≥33° jest wpisana przed drukiem gałki; wyniku fizycznej próby nie ma.

**Dlaczego W3 pozostaje otwarta:** KIN linie 26, 30 i 59–60 utrzymuje stałą odległość od punktu zagięcia przy gałce do środka otworu orczyka. SWEEP `pret_Z()` (167–172) dodaje następnie 1,75 mm wzdłuż osi otworu serwa; poprzeczka przy gałce cały czas leży dokładnie w jej lokalnej osi otworu. W tym samym przemiatanem prostokącie otrzymałem:

| Pręt w SWEEP | Długość głównego odcinka min.–maks. | Kąt między osią nogi przy gałce a głównym odcinkiem min.–maks. |
|---|---:|---:|
| L–P | **61,497707–61,605847 mm** | **64,975–118,521°** |
| G–D | **55,423713–55,743493 mm** | **65,457–119,812°** |

To nie jest jeden sztywny drut o stałych zagięciach. Obliczony kąt wyjścia jest warunkiem przechyłu, ale skrypt nie realizuje tego przechyłu w geometrii sprawdzanej na kolizje. Pomija też nogę przy własnym otworze i pierwsze 2,5 mm za zagięciem. **Scenariusz porażki:** rzeczywista noga kołysze się i przesuwa zagięcie w miejsce, którego SWEEP nie sprawdził; deklarowane 0,79/0,82 mm nie są wtedy dowodem. **Wymagane zamknięcie starej uwagi:** kontrola jednego sztywnego „Z” z końcówkami i drogą wkładania albo udokumentowana próba obejmująca te miejsca i zakres. **Pewność wysoka co do błędu modelu; nie stwierdzam na tej podstawie, że fizyczny mechanizm na pewno się zakleszczy.**

## Zmiany i montaż „na milimetr”

| Zmiana względem r1 | Ocena |
|---|---|
| G–D jako słupek zamiast języczka, oba otwory wzdłuż y; gardziele, fazki, r15,3 i odsadzenie 4 | **NIEZBĘDNE jako korekta istniejącego zaczepu.** Słupek 6,5×2 jest połączony z czaszą; Gałka w 3MF ma jedną spójną bryłę. To zmiana kształtu, nie nowa część ani dodatkowy przegub. Nie oznacza zamknięcia W3. |
| Cofnięcie PG o 8 mm, wydłużenie płyty o 8, przesunięcie L–P o 1,3; wycięcie kabla, szersza szczelina orczyka i wycięcia przy uszkach powiek; płytsza czasza o 0,5 | **NIEZBĘDNE jako lokalne korekty dróg istniejących części i drutów.** Nie dodają funkcji ani części; czasza nadal w granicach dopuszczonego spłycenia. Nie wykazuję konieczności każdej dokładnej współrzędnej. |
| Próbka zaczepu | **NIEZBĘDNE do przewidzianej weryfikacji nowego pasowania**, poza zespołem mechanizmu. Zbiorczy 3MF ma teraz **10 obiektów**, nie 9 jak nadal podaje montaż §6. |
| Opcjonalne paski papieru przy klejeniu | **NADMIAROWE jako wymóg montażowy** — opisane trzymanie i kontrola pierścienia już realizują centrowanie. W instrukcji są tylko opcją i nie dodają trwałej części do mechanizmu. |

**Odstęp L–P–PG 0,95 mm:** po złożeniu jest statyczny, ale podczas kroku 9 tylne ucho L–P rzeczywiście przesuwa się pionowo obok przedniej ściany PG. Jego z pozostaje ≥−87,8, PG kończy się na −88,75, więc nominalna droga jest bez kolizji i szczelina nie maleje. Serwo można chwycić od góry; palców ani narzędzia nie trzeba wkładać między te ściany. **Nie przeszkadza nominalnie we wsunięciu, lecz nie wolno opisywać go jako odstępu występującego wyłącznie po montażu:** pozostaje przejście 0,95 mm poza wyjątkiem dotyczącym tuby. W ścisłym odczytaniu briefu koncepcji pkt 4 nie jest ono zamknięte jako zgodne; wymaga rozstrzygnięcia PM w ramach już wskazanego warunku montażu, bez twierdzenia, że serw nie da się włożyć.

Pozostałe małe odstępy to pasowania: 0,2 promieniowo osi, 0,2/0,3 osiowo uszu i 0,2 na stronę gniazd serw. Nie są miejscem na palce. Nowa kolejność usuwa wykazaną w r1 przeszkodę dla PH1. Nie znalazłem kolejnej udowodnionej blokady dostępu poza opisanym ograniczeniem kontroli „Z”.

**Weryfikacja własna:** odczyt SCAD/diffu, obliczenia analityczne przez stdin, pomiary ZIP/XML 3MF; `sprawdz_siatki.js` — wszystkie 10 indywidualnych plików i zbiorczy: 0 otwartych krawędzi, 0 krawędzi nierozmaitościowych, 0 degeneracji. Spójność zmienionych Gałki, Płyty, obu powiek i przedłużenia: po jednej bryle. Nie wykonano wydruku ani pełnego ponownego przemiatania. Nie czytano raportu r2 Opusa. Zapisano tylko ten raport, bez commitów; żaden proces tego review nie pozostaje w tle.

**Werdykt: v3 (`d7a6dae`) nie zatwierdzam do wydruku testowego całego modułu przed zamknięciem W3 dotyczącej rzeczywistego „Z” i rozstrzygnięciem przejścia montażowego 0,95 mm; przygotowana próbka zaczepu nadaje się do przewidzianego testu.**
