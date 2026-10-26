# Duże oko – koncepcja na wzór The Face maker101 (krok 1, bez CAD)

26.10.2026, projektant dużego oka. Brief: `30-projekt/brief-duze-oko-koncepcja-referencja.md` (3a39568). Szkic: `2026-10-26-duze-oko-koncepcja-referencja.svg`. Założenia oznaczam **[Z]**. Rachunki kinematyki zrobiłem skryptem w 2D (płaszczyzna ruchu każdej osi). Narożniki (obie osie naraz) sprawdzi dopiero przemiatanie w CAD.

**Układ współrzędnych:** 0 = środek kuli; z do przodu (na zewnątrz dyni), y w górę, x w prawo patrząc od tyłu (z wnętrza dyni).

## 0. Co biorę z referencji (pomiar STL z `00-inbox/face-maker101/`)

- **Gałka:** cienka czasza otwarta z tyłu; przegub w środku kuli.
- **Powieka:** czasza o promieniu ok. 1,35 × R gałki, z uszami zawiasu na obu końcach; oś zawiasu leży w środku czaszy.
- **Napęd:** serwa w gniazdach na klej, pręty z drutu z końcami w „Z”.
- **Słupki:** prostopadłe do płyty.

Na `eyeball.stl` nie ma zaczepów prętów. Położenie zaczepów dobieram sam (pkt 6 briefu).

## 1. Układ (szkic SVG obok)

- **Płyta** stoi pionowo za gałką, prostopadle do osi oka. Przód płyty leży na z = −48, grubość 10, tylny koniec tuby opiera się o płytę.
  - Z przodu płyty wychodzą do przodu **2 słupki zawiasu** po bokach gałki (x = ±34,7…37,2, y ±5, do z = +4) i **słupek kardana** w osi (Ø12, do z = −14,25).
  - Za płytą są **4 × MG90S**. Korpus każdego serwa przechodzi przez okno w płycie i jest wklejony, a orczyki pracują za płytą.
- **Gałka Ø60** na **kardanie 5/5**: krzyżak w środku kuli, sworzeń piasty tylnej pionowo (lewo–prawo), sworzeń piasty przedniej poziomo (góra–dół). Kardan siedzi na 2 trzpieniach M5 × 8, jeden w słupku, drugi w piaście gałki.
- **Pręty gałki:** dwa druty Ø1,0, równoległe do osi oka. Każdy idzie od języczka wewnątrz kuli (14 mm od osi, z = −4) do orczyka za płytą: L–P na godzinie 3, G–D na godzinie 12.
- **Powieki:** dwie, współśrodkowe z gałką: dolna wewnętrzna, górna zewnętrzna. Obie obracają się na wspólnej osi x przez środek kuli, na 2 drutach Ø2 w słupkach. Drut Ø1,0 idzie od tylnej krawędzi powieki do przedłużenia orczyka 25 (PRD).
- **Tuba** w otworze Ø80, kołnierz z łapami od środka dyni, maskownica z zewnątrz (PRD). Moduł wsuwa się w tubę od środka dyni.

## 2. Lista części

**Drukowane** (każda ≤ 180 mm, kolor według PRD):

| Część | Wymiar | Uwagi do druku |
|---|---|---|
| Płyta ze słupkami | ok. 106 × 112 × 10, słupki 52 | tyłem na stole, słupki w górę; okna serw na wylot |
| Gałka | Ø60, ścianka 2, czasza do 120° | krawędzią na stole, jak referencja; w środku piasta na 3 żebrach 45° i 2 języczki z podparciem 45° |
| Powieka górna | R33,2–34,4, uszy na x ±(33,2…34,4) | – |
| Powieka dolna | R31,0–32,2, uszy na x ±(31,8…33,0) | – |
| Przedłużenie orczyka powieki × 2 | 25 mm | według PRD |
| Tuba z kołnierzem × 3 warianty | Ø79,5 / Ø76,3, rant–koniec 54 | kołnierz na 30 / 40 / 50 od rantu (pytanie P2) |
| Maskownica | ≤ 2 mm poza otwór | według PRD |

**Posiadane:**

- MG90S × 4 z orczykami i wkrętami;
- kardan 5/5 × 1 z 2 wkrętami M4;
- **M5 × 8 × 2**;
- drut Ø1,0: 2 × ok. 75 (gałka) i 2 × ok. 70 (powieki), z zapasem na „Z”;
- drut Ø2,0: 2 × ok. 6;
- wkręty do drewna 4 × 30–40 (łapy kołnierza, PRD);
- klej: epoksyd albo CA, klej na gorąco.

**Śruby razem:**

- 2 × M5 × 8 (trzpienie kardana);
- elementy, które przychodzą z kardanem i serwami: 2 × M4 (wkręty dociskowe kardana) i 4 wkręty orczyków;
- 4 wkręty do drewna z PRD;
- **+ 2 × M3 × 10 z nakrętkami, jeśli przyjmiesz P3.**

## 3. Główne wymiary

| Co | Wartość |
|---|---|
| Środek kuli wobec rantu tuby | 6 za rantem **[Z]**: gałka wystaje 24, zamknięte powieki 28 (P5) |
| Gałka | R30, krawędź czaszy z = −15, otwór tylny Ø52 |
| Kardan | piasty z = −12,75…+12,75; wkręty dociskowe na z = ±9,1; trzpień wchodzi w piastę na 6,5–6,75 |
| Płyta | przód z = −48, tył z = −58; obrys omija łapy kołnierza na 0°/90°/180°/270° |
| Rozstaw słupków zawiasu | wewnątrz 69,4, na zewnątrz 74,4; do ścianki tuby (R38,15) zostaje 0,95 (zaakceptowane ok. 1 mm) |
| Serwa | wałki na z = −69,8; ucho przednie równo z przodem płyty; okno na wsunięcie serwa 13 × 35,5 |
| Wałki serw (x, y) | L–P (31,5; 0), oś pionowo · G–D (0; 29,5) · powieka górna (14; 46) · powieka dolna (−18; −46), osie ostatnich trzech poziomo |
| Zaczepy gałki | języczki z = −4, otwór Ø1,3 na r = 14 (L–P: x = +14, G–D: y = +14) |
| Otwory orczyków | L–P 17,5 (otwór skrajny), G–D 15,5; powieki 25 (przedłużenie) |
| Zaczepy powiek | górna x = +14, 31,4 od osi zawiasu; dolna x = −18, 26,7 od osi. PRD podaje ok. 34; więcej się w tubie nie mieści |
| Długości drutów między zagięciami | L–P 65,8; G–D 65,8; powieka górna 61,9; dolna 61,4 |
| Luz powiek | 1,0 do gałki i między powiekami (tabela AGENTS: ≥ 0,5); oś na drucie Ø2, otwór w uszach Ø2,3 |
| Głębokość modułu | od rantu tuby (+6) do końca orczyków ok. −87, czyli ok. 93 mm za rantem |

## 4. Kolejność montażu (wszystko na stole, poza krokami 9–10)

0. **Kalibracja:** serwa na 1500 µs z ESP przed nasadzeniem orczyków.
1. **Trzpienie M5 × 8:** łeb do gniazda Ø8,6 × 5 na czole słupka kardana i w piaście gałki, epoksyd. Gałkę kładziesz otworem do góry, a śrubę wkładasz palcami albo pęsetą przez otwór Ø52 (piasta leży ok. 30 mm w głąb).
2. **Kardan do gałki:** piasta przednia na trzpień. Wkręt M4 dokręcasz imbusem 2: krótkie ramię promieniowo przez otwór tylny, między żebrami piasty. Nic nie zasłania.
3. **Serwa w płytę:** każde wsuwasz od przodu płyty tyłem do przodu, wieżyczka przechodzi przez okno. Ucho przednie ma być równo z czołem płyty. Klej na gorąco dookoła korpusu od przodu i od tyłu, kable do tyłu.
4. **Gałka z kardanem na słupek:** piasta tylna na trzpień, wkręt dociskowy skierowany w górę (sworzeń pionowo). Gałkę przechylasz ręką przodem w dół o 70–90° (kardan pozwala do ok. 90°), otwór tylny patrzy wtedy w górę. Imbus 2 wchodzi pionowo z góry między słupkami zawiasu.
5. **Pręty gałki:** „Z” do języczka w kuli kombinerkami przez otwór tylny; szczelina gałka–płyta ma 33 mm. Drugi koniec do otworu zdjętego orczyka, orczyk na wałek prostopadle do pręta. Wkręt orczyka wkrętakiem PH1 wzdłuż wałka: L–P z góry, G–D z prawej (patrząc od tyłu).
6. **Powieki:** najpierw dolna, potem górna; nakładasz je od przodu, uszy wchodzą między słupki (0,3 luzu na stronę). Drut Ø2 × 6 wciskasz od zewnątrz przez słupek w oba uszy, kombinerkami.
7. **Druty powiek:** „Z” do zaczepu powieki, drugi koniec do przedłużenia 25 na orczyku, orczyk na wałek przy zamkniętej powiece. Wkręt orczyka: powieka górna wkrętakiem z lewej, dolna z prawej.
8. **Test ruchu i kalibracja** na stole.
9. **Tuba w dyni** (PRD): kołnierz od środka, wkręty do drewna wkrętakiem przez wieczko; maskownica z zewnątrz.
10. **Moduł przez wieczko:** słupki i gałkę wsuwasz w tubę od środka, płyta opiera się o koniec tuby. Ścianka tuby trzyma druty zawiasu przed wysunięciem. Mocowanie według P3.

Na „milimetr” jest tylko zaakceptowany odstęp słupek–tuba (0,95). Najmniejsze pozostałe odstępy przy ruchu są niżej (§5) i trafią do sprawdzenia w CAD.

## 5. Zakres ruchu wobec PRD (rachunek)

Czworobok w płaszczyźnie ruchu: zaczep na gałce, pręt, orczyk. Kąt serwa i kąt przenoszenia (pręt–ramię orczyka) policzyłem co 5°.

| Oś | Cel PRD | Zaczep / orczyk | Kąt serwa | Przenoszenie min. | Najmniejsze odstępy |
|---|---|---|---|---|---|
| L–P | ±35° | r 14 / 17,5 | +30,1° / −24,4° | 58° | pręt–krawędź czaszy 3,3; pręt–słupek kardana 4,3; języczek–piasta tylna ok. 2,0 przy +35° |
| G–D | ±25° | r 14 / 15,5 | +24,0° / −20,8° | 64° | pręt–otwarta powieka górna 4,7; pręt–krawędź 6,4; pręt–słupek 6,1 |
| Powieka górna | 0 → 51,5° | 31,4 / 25 | 60° | 56° | drut–gałka 4,6 (w płaszczyźnie x = +14) |
| Powieka dolna | 0 → 51,5° | 26,7 / 25 | 49° | 68° | drut–gałka 2,6 (w płaszczyźnie x = −18) |

- **Cel PRD ±35° / ±25° jest osiągnięty bez nowych części.** Wybieramy tylko otwory orczyka i miejsca zaczepów. Zapas serwa: MG90S ma ok. ±90°, a używamy najwyżej 30°.
- **Źrenica Ø20 [Z]** (półkąt 19,5° na R30). Przy patrzeniu w górę o 25° jej krawędź jest na 44,5°, a powieka otwarta na 51,5° ma zapas 7°.
- **Druty Ø1,0:** wyboczenie przy 65,8 mm to ok. 22 N (Euler, stal). Siła z orczyka przy zatrzymaniu MG90S (2,2 kg·cm) to 12,3 N na 17,5 i 8,6 N na 25.

## 6. Różnice wobec referencji

| # | Referencja | Koncepcja | Skąd | Pytanie |
|---|---|---|---|---|
| 1 | płyta pozioma, oś oka równoległa do płyty, słupki w górę | płyta pionowa za gałką, słupki i serwa w osi oka (słupki do przodu, korpusy serw na wylot płyty) | w tubie R38 słupki zawiasu po bokach gałki R30 nie mogą wyjść z płyty pod gałką: płyta musiałaby leżeć ≥ 30 pod osią, a słupek na x = 35–37 mieści się w tubie tylko do ok. 8 pod osią | **P1** |
| 2 | przegub drukowany, sworzeń z drutu | kardan 5/5 na 2 trzpieniach M5 × 8 wklejonych łbem | pkt 2 briefu | – |
| 3 | czasza 4,5 mm za środek | czasza do 120°, w środku piasta na żebrach i 2 języczki | pkt 3 i 6 briefu | – |
| 4 | jedna powieka na oko, wspólne serwo | 2 powieki, 2 serwa, przedłużenia orczyka 25 | PRD | – |
| 5 | jeden sworzeń zawiasu przez oba słupki | 2 krótkie druty Ø2 (między słupkami jest gałka) | ten sam element | – |
| 6 | zaczep powieki – | 31,4 / 26,7 od osi zamiast ok. 34 z PRD | więcej się nie mieści w tubie | – (zgłoszę PM) |
| 7 | płyta przyklejona na gorąco do listew maski | moduł w tubie z PRD; mocowanie modułu do tuby | PRD nie mówi, jak moduł trzyma się tuby | **P3** |
| 8 | – | tuba: stała długość rant–koniec 54, kołnierz w 3 położeniach | odczytanie pkt 5 briefu | **P2** |
| 9 | – | źrenica Ø20 | PRD: założenie projektanta do akceptacji | **P4** |
| 10 | – | gałka wystaje 24 mm przed rant | wygląd | **P5** |

## 7. Pytania do użytkownika – runda 1

Zadaję je w rozmowie (`grilling`). Odpowiedzi dopiszę tutaj.

- **P1 – płyta pionowo za gałką:** zamiast poziomej płyty z referencji. Nie dochodzą żadne części; zmienia się tylko kierunek płyty.
- **P2 – tuba o stałej długości 54 od rantu do końca:** kołnierz z łapami leży na 30 / 40 / 50 od rantu. Gałka siedzi zawsze tak samo w otworze, a moduł zawsze tak samo w tubie. Gdyby tuba miała długość równą ścianie dyni, przy ścianie 30 gałka wystawałaby o 18 mm więcej.
- **P3 – moduł przykręcony do tuby 2 × M3 × 10:** nakrętki siedzą w kieszeniach 2 uszu na końcu tuby, śruby wkręcasz wkrętakiem od tyłu płyty. Da się go wyjąć bez niszczenia. Alternatywa jak w referencji: klej na gorąco, bez wyjmowania.
- **P4 – źrenica Ø20:** syn maluje tęczówkę dowolnie, ale czarny środek ≤ Ø20, żeby otwarta powieka go nie zasłaniała.
- **P5 – gałka wystaje 24 mm przed rant**, zamknięte powieki 28.

## 8. Do sprawdzenia w CAD (po akceptacji)

- **Przemiatanie narożników** (L–P i G–D naraz) na siatkach: języczek L–P wobec piasty tylnej, pręty wobec krawędzi czaszy i powiek.
- **Druk gałki krawędzią w dół:** jak w referencji, ale R30 zamiast R14; sufit czaszy przy przednim biegunie **[Z]** do próby.
- **Serwa:** wymiary MG90S z rysunku Miuzei (`30-projekt/e6-pomiary.md`), ucho na całą szerokość korpusu **[Z]**.
- **Tuba:** ścianka 1,6 **[Z]**.
- **Otwór w wieczku** ≥ ok. 130 na przejście modułu **[Z]**.

## Wniosek (do `30-projekt/decyzje.md` po akceptacji)

Koncepcja ma te same elementy co referencja: jedna płyta, 4 serwa w gniazdach na klej, jeden przegub gałki, pręty z drutu bez przegubów, zawias powiek na słupkach. Zakres PRD wychodzi z wyboru otworów orczyka i położenia zaczepów. Otwarte decyzje: P1–P5.
