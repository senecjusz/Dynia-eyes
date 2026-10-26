# Recenzja: odstępstwa koncepcji dużego oka od referencji i ustaleń (Opus 5.5)

26.10.2026. Brief: `2026-10-26-odstepstwa-koncepcji-brief.md`. Materiał: `20-analizy/2026-10-26-duze-oko-koncepcja-referencja.md`, brief projektanta (6 ustaleń), PRD §4 i §9, `decyzje.md` (26.10), synteza referencji, STL z `00-inbox/face-maker101/`. Raportu Astry nie czytałem.

**Metoda:** liczby policzyłem sam (`python3 -I`, numpy): pomiar STL, czworobok L–P i G–D co 0,005°, odstęp pręt–krawędź czaszy w 3D, budżet promieni w tubie. Układ jak w koncepcji: 0 = środek kuli, z do przodu. Tuba wewnątrz R = 76,3 / 2 = **38,15**.

## 0. Pomiary referencji, które są potrzebne do werdyktów

- `eyelid.stl`: czasza o środku ok. (20; 20; 20), promień wewnętrzny **19,0**, zewnętrzny **20,6**. Gałka `eyeball.stl` ma R14. **Luz gałka–powieka w referencji wynosi 19,0 − 14 = 5,0 mm**, czyli 36% R gałki. W skali ×2,14 daje to ok. 10,7 mm. W koncepcji jest 1,0.
- `eye_holder_main.stl`: płyta 141 × 75, pełna do wysokości 5, słupki prostopadłe do płyty do wysokości 41.

## 1. Tabela werdyktów

| # | Pozycja | Werdykt | Dowód liczbowy (mój rachunek) | Prostsza alternatywa |
|---|---|---|---|---|
| 1 | Płyta pionowa za gałką zamiast poziomej | **NIEZBĘDNE** | Słupek o przekroju x 34,7–37,2 mieści się w tubie R38,15 tylko przy \|y\| ≤ 8,46 (przy luzie 0,95 tylko na y = 0). Płyta pozioma pod gałką leży na y ≤ −31 (R30 + luz). Słupek na (34,7; −31) jest na r = 46,5, czyli **8,4 mm poza tubą**. Argument projektanta jest prawdziwy. Płyta pionowa zachowuje cechę referencji: słupki prostopadłe do płyty. Nie dochodzą części. | Brak prostszej. Płyta pozioma za tubą na wysokości osi (y ≈ 0) wymagałaby słupków w płaszczyźnie płyty i szczeliny na pręt L–P, który leży na y = 0. To nie jest prostsze. |
| 2 | Zaczepy powiek 31,4 / 26,7 od osi zamiast ok. 34 (PRD §4) | **ZMIANA ZAŁOŻEŃ** (parametr PRD; funkcja zostaje) | **Tuba tego nie wymusza.** Liczby to promień czaszy w wybranej płaszczyźnie: √(34,4² − 14²) = **31,42** i √(32,2² − 18²) = **26,70**. Tuba dopuszcza \|y\| do 35,5 przy x = 14 i do 33,6 przy x = 18. Ograniczeniem jest przesunięcie zaczepów na x = +14 / −18 pod serwa, a nie tuba. **Funkcja zostaje:** kąt otwarcia 51,5° się nie zmienia. Serwo potrzebuje (model cięciwy, ramię 25) 66° i 55°, przy ok. 34 byłoby 72°; projektant podaje 60° i 49°. Wszystko mieści się w ±90° MG90S. Źrenica: krawędź przy patrzeniu 25° w górę na 44,5°, zapas do 51,5° wynosi **7,0°**. Zaczep powieki dolnej nie może mieć 34: jej czasza ma R32,2, a koncentryczne powieki wymusza wspólny zawias na słupkach (ustalenie 4). | Zgodnie z PRD: zaczep powieki górnej przy x ≤ 5 daje ρ = 34,0–34,4. Zaczep powieki dolnej przy x ≈ 0 daje ok. 31, maksimum 32,2. Drut biegnie wtedy skośnie do serwa (14 mm na ok. 62 mm, ok. 13°) albo serwa trzeba przestawić. Jeśli użytkownik przyjmie 31,4 / 26,7, nic więcej nie trzeba. |
| 3 | Moduł do tuby 2 × M3 × 10 z nakrętkami w 2 uszach tuby (P3) | **NADMIAROWE** | Dochodzą 2 śruby, 2 nakrętki, 2 uszy z kieszeniami i 2 otwory w płycie. PRD §4: wyjmowanie „nie wymagane – odpada, jeśli komplikuje”. Decyzja 25.10: śruby tylko tam, gdzie coś się obraca albo rozkręca. Płyta i tak opiera się o koniec tuby, a słupki centrują ją w tubie promieniowo (0,95). | Klej na gorąco w 3–4 punktach na styku czoła płyty z końcem tuby, jak w referencji. Można kleić na stole przed wkręceniem kołnierza, jeśli wycięcia płyty przy łapach przepuszczają wkrętak, albo przez wieczko po wkręceniu tuby. |
| 4 | Tuba o stałej długości 54 (rant–koniec), kołnierz w 3 położeniach 30 / 40 / 50 (P2) | **NIEZBĘDNE** (ta sama funkcja co ustalenie 5) | Moduł wymaga stałej odległości rant–płyta: 6 + 48 = **54**. Przy tubie długiej jak ściana (30) moduł przesuwa się o **24 mm** do przodu. Środek kuli byłby wtedy 18 mm przed rantem, a słupki zawiasu (do z = +4) wystawałyby 22 mm z dyni. Zmienną wielkością pod ścianę jest rant–kołnierz, i tak to robi koncepcja: 3 wydruki z góry, wybór przy składaniu. Drobna nieścisłość w koncepcji: „gałka wystawałaby o 18 mm więcej” powinno brzmieć „o 24 mm więcej, środek 18 mm przed rantem”. | – |
| 5a | Piasta na 3 żebrach 45° wewnątrz gałki | **NIEZBĘDNE** | Piasta przednia kardana kończy się na z = +12,75, a wnętrze czaszy na biegunie na z = 28: przerwa 15,25 mm. Coś musi ją pokonać (ustalenia 2 i 3). Referencja ma czop zwisający z bieguna (Ø2,8 do 6,6 przed środkiem). Przy druku krawędzią w dół (jak referencja) taki czop zaczynałby się w powietrzu ok. 23 mm nad stołem. Żebra 45° drukują się bez podpór. | – |
| 5b | 2 języczki zaczepów prętów w gałce (r 14, z −4) | **NIEZBĘDNE** | Ustalenia 1 i 6: pręt z „Z” potrzebuje otworu na gałce. Na `eyeball.stl` zaczepów nie ma. Czworobok sprawdzony: L–P +30,1° / −23,5°, przenoszenie min. **57,6°**; G–D +23,9° / −20,4°, min. **65,3°**. Zgodne z koncepcją z dokładnością do 1°. | Zaczep na krawędzi czaszy (r ≈ 26) zamiast języczka: serwo potrzebowałoby ok. 58° przy gorszym przenoszeniu, a pręt szedłby obok uszu powiek. Nie jest prostsze. |
| 5c | Słupek kardana Ø12 (z −48 → −14,25) | **NIEZBĘDNE** | Ustalenie 2: krzyżak w środku kuli, więc piasta tylna (do z = −12,75) musi być podparta od płyty. Referencja też ma słupki z przegubem. Przy L–P ±35° krawędź czaszy przechodzi **6,7 mm** od słupka, a pręt L–P 2,95 mm od słupka (po odjęciu promienia drutu). | – |
| 5d | 2 × M5 × 8 wklejone łbem (trzpienie do kardana) | **NIEZBĘDNE** | Kardan ma otwory Ø5 × 7 i wkręty dociskowe M4 (ustalenie 2). Potrzebny jest wałek Ø5, odpowiednik drucianego sworznia z referencji. M5 jest na liście posiadanych części (PRD §7). Wkręt dociskowy jest na z = ±9,1, czyli 3,65 od czoła piasty, w zasięgu trzpienia (wejście 6,5–6,75 < głębokość 7). **Uwaga do CAD:** gniazdo Ø8,6 × 5 pasuje tylko do łba walcowego imbusowego (ISO 4762: Ø8,5 × 5). Łeb sześciokątny (9,2 po narożach) się nie zmieści. | Trzpień Ø5 drukowany razem ze słupkiem i piastą: 0 części, ale wkręt M4 dociska wtedy PLA, a warstwy idą w poprzek trzpienia. M5 jest pewniejsze i nie dokłada zakupu. |
| 5e | 2 krótkie druty Ø2 × 6 jako osie powiek (zamiast jednego sworznia) | **NIEZBĘDNE** | Na osi x przez środek kuli leżą gałka i kardan, więc jeden sworzeń przez oba słupki nie przejdzie. Pakiet: słupek 2,5 + 0,3 + ucho 1,2 + 0,2 + ucho 1,2 = 5,4. Drut 6 kończy się na x = 31,2, czyli 0,6 za uchem dolnym i 1,2 przed gałką R30. Drut Ø2 jest w posiadanych częściach. | – |
| 6 | Kardan 5/5 (tab. §6 #2) | zgodne z ustaleniem 2 | – | – |
| 7 | Czasza do 120° (tab. §6 #3) | zgodne z ustaleniem 3 | Otwór Ø52 > Ø48 potrzebne przy ±35°. | – |
| 8 | 2 powieki, 2 serwa, przedłużenia orczyka 25 (tab. §6 #4) | zgodne z PRD §4 | – | – |
| 9 | Źrenica Ø20 [Z] (P4) | **NIEZBĘDNE** jako założenie wymagane przez PRD §4; wartość do akceptacji | Półkąt asin(10/30) = 19,47°. Przy 25° w górę krawędź jest na 44,47°, zapas do 51,5° wynosi 7,0°. Źrenica Ø23 zjadłaby zapas do ok. 3,9°. | – |
| 10 | Gałka 24 przed rantem, powieki 28,4 (P5) | **NIEZBĘDNE** jako parametr (nie jest częścią) | Słupki kończą się na z = +4, a rant leży na +6, więc środek kuli musi być ≥ ok. 5 za rantem, żeby słupki nie wystawały. Wystawanie ≤ 25 jest zatem górną granicą geometrii. Mniej (środek głębiej) jest możliwe, ale wtedy rośnie długość tuby albo płyta idzie do przodu. Wygląd w tym przedziale wybiera użytkownik. | – |
| 11 | Wkręty do drewna 4 × 30–40, maskownica, tuba z łapami | zgodne z PRD §4 | – | – |

## 2. Miejsca „na milimetr” poza zaakceptowanym 0,95 słupek–tuba (pkt 6 briefu)

| Miejsce | Wartość | Uwagi |
|---|---|---|
| **Narożnik słupka zawiasu (y = ±5) – tuba** | **0,62**, nie 0,95 | 38,15 − √(37,2² + 5²) = 0,615. Koncepcja podaje 0,95, a to jest prawda tylko na y = 0. Poprawka bez nowych części: zewnętrzna ściana słupka jako łuk R37,2 współśrodkowy z tubą. Wtedy na całej szerokości zostaje 0,95. |
| **Pręt L–P – krawędź czaszy, przy wychyleniu, w którym zaczep idzie do tyłu (−35° w moim znaku)** | **−0,3 (kolizja)** do +1,5 | Koncepcja podaje 3,3. Czasza ucięta płasko na z = −15: krawędź wewnętrzna r = 23,64, zewnętrzna 25,98. Oś pręta mija krawędź wewnętrzną o 0,2 mm, a promień drutu wynosi 0,5. Przy krawędzi ciętej promieniowo zostaje ok. +0,8. **To trzeba poprawić przed CAD.** Sprawdzony wariant: krawędź czaszy na z = −12 (czasza ok. 114°, otwór ok. Ø55 > Ø48) daje **+2,9**. |
| Pręt G–D – krawędź czaszy (−25°) | 2,7 | Koncepcja podaje 6,4. Mieści się, ale rozbieżność potwierdza, że rachunek odstępów w §5 koncepcji trzeba powtórzyć. |
| **Gałka – powieka dolna, powieka dolna – górna (promieniowo, części ruchome)** | **1,0 / 1,0** | Referencja ma 5,0 przy R14. Budżet w tubie: 38,15 − 30 = 8,15. Słupek 2,5 + 0,95 + 2 uszy 2,4 zostawiają na 3 luzy 2,3. Wynika to z ustalenia 4 i tuby, więc większego luzu nie da się uzyskać bez zmiany PRD (Ø60 / Ø80). Luz zależy od łańcucha tolerancji: płyta → słupek kardana 33,75 → M5 → kardan → M5 → żebra → czasza, a z drugiej strony płyta → słupki 52 → drut Ø2 → ucho. Każde przesunięcie środka kardana względem osi zawiasu o > 1,0 daje tarcie. **Ryzyko do zgłoszenia użytkownikowi**, nie odstępstwo. |
| Uszy powiek między słupkami (osiowo) | 0,3 słupek–ucho, 0,2 ucho–ucho | Montaż „wsuń między słupki” z 0,3 na stronę. Słupki 2,5 × 10 × 52 dadzą się rozchylić palcami, ale na zewnątrz zostaje im tylko 0,62–0,95 do tuby. |
| Okno serwa 13 / korpus 12,5; gniazdo Ø8,6 / łeb Ø8,5 | 0,25 / 0,05 na stronę | Gniazda na klej, nic się w nich nie rusza. Bez znaczenia. |

Pozostałe odstępy z §5 koncepcji (języczek–piasta 2,0, drut powieki dolnej–gałka 2,6) wymagają geometrii z CAD, więc ich nie potwierdzam ani nie podważam.

## 3. Pozostałe kontrole liczb koncepcji

- Wyboczenie drutu Ø1,0 (E = 200 GPa): 22,4 N przy 65,8 mm i 25,3 N przy 61,9 mm. Siła z serwa przy 2,2 kg·cm: 12,3 N na ramieniu 17,5, 13,9 N na 15,5 i 8,6 N na 25. Zapas ok. 1,6×, zgodnie z koncepcją.
- Długości prętów 65,8 = −4 − (−69,8). Orczyk L–P: 31,5 − 17,5 = 14, G–D: 29,5 − 15,5 = 14. Zgodne.
- Rant–koniec tuby 6 + 48 = 54, ścianka (79,5 − 76,3) / 2 = 1,6, luz w otworze 0,25. Zgodne.
- Drobiazg: płyta (z −48…−58) leży między zaczepami a orczykami (z = −69,8), więc 4 druty przechodzą przez płytę. Koncepcja nie wymienia otworów ani szczelin w płycie. Szczelina drutu powieki górnej musi mieć ok. 25 mm (cięciwa ramienia 25 przy 60°). To szczegół do CAD, a nie nowa część.

## 4. Werdykt

Koncepcja może iść do CAD. Odstępstwa 1, 4 i 5a–5e są niezbędne. Trzeba wprowadzić te zmiany:

- mocowanie M3 zastąpić klejem na gorąco jak w referencji;
- zaczepy powiek wrócić do ok. 34 / ok. 31 (górna przy x ≤ 5, dolna przy x ≈ 0), chyba że użytkownik przyjmie 31,4 / 26,7;
- ścianę słupków zaokrąglić do R37,2, żeby luz 0,95 był na całej szerokości;
- usunąć kolizję pręta L–P z krawędzią czaszy, np. krawędź na z = −12;
- luz 1,0 między gałką a powiekami zgłosić użytkownikowi jako ryzyko wynikające z tuby Ø80.
