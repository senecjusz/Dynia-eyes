# Review koncepcji dużego oka 2c (Fable, 22.10.2026)

Recenzent: Fable, tylko do odczytu. Brief recenzji: `20-analizy/review/brief-review-e6-koncepcja.md`. Oceniany plik: `20-analizy/2026-10-22-duze-oko-2c-koncepcja.md` (realizator: Opus). Każda uwaga ma wagę (KRYTYCZNE / WAŻNE / DROBNE), miejsce, scenariusz porażki, poprawkę albo test i pewność. Liczby liczyłem własnymi skryptami (Python/numpy, poza repo: `/tmp/claude-1000/-home-rkp--claude-spares-spare-mfMMBV/81adf3b7-b77e-42b1-b39b-151f54c8e062/scratchpad/e6/kin.py`, `powieki2.py`, `powieki3.py`, `powieki4.py`, wyniki `wynik*.txt`). Oznaczenia jak w koncepcji: [F] fakt, [R] mój rachunek, [Z] założenie.

## 0. Wynik w pięciu zdaniach

1. **Gałka: kinematyka się zgadza.** Odtworzyłem rachunek A2 niezależnie (kardan R = Rx(θ)·Ry(ψ), pręty S–S): kąt kardana 28,9°/31,6°, serwo X −34…+27° i Y −27…+20° na ogranicznikach, kąt pręt–ramię ≥ 51° (X) / ≥ 60° (Y), sprzężenie Y −4,6° przy ψ −25°, odchylenie kulek ≤ 24,6° (gałka) / ≤ 15,6° (orczyk), pręty mijają krawędź czaszy o ≥ 3,2 mm, Słupek o ≥ 5,8 mm, dolną powiekę o ≥ 26°. Martwego punktu nie ma.
2. **Powieki: układ z koncepcji nie mieści się i koliduje.** Z tych samych danych, które dają tabelę A3 (odtworzyłem ją co do 0,1°), wynika: dźwignia górna wychodzi poza rurę i poza Ø79,5 (do R44,3 od osi z), pręt dolny przecina nadlew górnej na 3,6–5,9 mm przy serwie 0–42°, cięgna krzyżują się w płaszczyźnie yz przy odstępie osiowym 0,1–0,3 mm, a łeb przegubu dolnego wchodzi 2,4 mm w gałkę. Przeszukanie syntezą (siatka ~10⁵ wariantów w tym samym pasie x 23–36) nie znalazło **żadnego** układu obu dźwigni po jednej stronie bez kolizji.
3. **Obrys i montaż:** poza powiekami wszystko mieści się w Ø79,5; droga „wsunąć z zewnątrz, Obejma od środka, 2 ruchy” jest zgodna z briefem. Wariant awaryjny B2 jest policzony źle: Ø56 z łbem 2,45 daje Ø80,4 (nie przechodzi); mieści się Ø55 (Ø79,4).
4. **Ręka dziecka:** ograniczniki na nakrętkach prętów prowadzą siłę przez przeguby kulowe (28 N w pręcie przy 0,5 N·m, wypięcie kulki możliwe) i tylko poza zakresem pracy; w zakresie dziecko cofa przekładnię MG90S 1,5–2,5 × moment zablokowania. Ogranicznik powinien siedzieć na Uchwycie i Słupku.
5. **Źródła:** 7 z 9 linków sprawdziłem w treści; cytaty ze Stan Winston School, Make i Instructables Compact są prawdziwe. Pręty S–S z kulkami na **obu** końcach przy nieruchomych serwach nie występują w żadnym źródle (Compact: kulka tylko przy serwie, czop przy oku; „on the Cheap”: drut z haczykami). Jednoserwowe sprzężenie górna–dolna nie ma pierwowzoru, co koncepcja uczciwie mówi.

## 1. Rachunki własne

**R1. Pręty gałki** (siatka ψ ±27 × θ ±17 co 1,5°/1°, zał. A2 koncepcji; `kin.py`):

| Pręt | Serwo na ogranicznikach | w pracy ±25/±15 | min kąt pręt–ramię | max kąt nacisku na orczyku | odchylenie kulki gałka / orczyk | przejście przez czaszę R29 (krawędź 115°) | do Słupka Ø15 |
|---|---|---|---|---|---|---|---|
| X | −34,0…+26,8° | −29,6…+24,3° | 51,2° | 38,8° | 24,6° / 6,9° | ≥ 121,3° = 3,2 mm zapasu | 5,8 mm |
| Y | −27,4…+19,7° | −23,6…+17,6° | 60,2° | 34,4° | 19,9° / 15,6° | ≥ 122,7° = 3,9 mm | 8,0 mm |

Sprzężenie: serwo Y −4,6° przy ψ −25° (koncepcja −4,5), serwo X ±0,8° przy θ ±15°. Najlepsza oś kulki na gałce to dokładnie ∥ y (koncepcja ma optimum): maksimum 23,6° (X) i 19,9° (Y) nie da się już obniżyć orientacją czopa. Pręt Y wchodzi w strefę R 30,7–35,2 przy φ −143…−152° (pasmo dolnej powieki kończy się na −117°), pręt X przy φ 180°. Zapasy liniowe nie uwzględniają promienia pręta (ok. 1 mm) ani korpusu końcówki kulowej.

**R2. Powieki** (płaszczyzna yz, `kin.py` sekcja 3). Konwencje koncepcji nie są podane wprost; odtworzyłem je z długości cięgien 35,8 / 41,6 i tabeli A3: wałek P C = (y −17; z −45), ramię A = C + 16·(cos φ, sin φ) przy φ = −20°, B przy 130° (B0 = (−20,2; −41,2), odległość do przegubu dolnego (−14; 0) = 41,6 ✓), dźwignia górna U0 = (y −14,1; z −16,9), czyli φ = 220° od +z ku +y (|A0−U0| = 35,8 ✓; lustrzane (+14,1; −16,9) daje 37,3, odpada). Serwo 0→73°: górna 0→51,1°, dolna 0→26,9°, min przenoszenie dźwignie 50°, ramię 49° – **tabela A3 zgadza się co do 0,1°**, więc liczę na geometrii realizatora. W tej geometrii:

| Serwo | górna | dolna | r od osi z: dźwignia górna r22 / nadlew r25,5 (x 36,25) | dolna, nadlew r17,5 (x 33,6) | pręt dolny – nadlew górny (luz, mm) | cięgna krzyżują się w yz | cięgno górne vs czasza dolnej (mm) |
|---|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 38,9 / 39,8 | 37,9 | **−3,6** | nie | — |
| 18 | 11,5 | 5,6 | 40,1 / 41,4 | 37,8 | **−4,9** | tak | — |
| 42 | 28,0 | 14,6 | 41,6 / 43,3 | 37,6 | −0,2 | tak | — |
| 54 | 36,9 | 19,4 | 42,1 / 43,9 | 37,4 | +2,0 | tak | **−1,3** |
| 73 | 51,1 | 26,9 | 42,4 / 44,3 | 37,0 | +5,6 | tak | **−2,2** |

Granice: rura wewnętrzna R37,75, obwiednia przejścia R39,75. Łeb/nakrętka przegubu dolnego (Ø5,5, x 25,75–28,2 po stronie −x wg A7) wchodzi w kulę R30,5 na **2,4 mm** (`powieki2.py`). Siła przycięcia przy zablokowanym serwie: 0,177 / (0,034 · (0,63…0,76 + 0,28…0,41)) = **4,4–5,7 N** (koncepcja 5,6 ✓).

**R3. Przeszukanie zamienników w tym samym pasie** (`powieki3.py`: 3,6 mln losowań; `powieki4.py`: synteza na siatce dźwignia górna r 16–24 / φ 135–205°, dolna r 12–20 / φ −165…−80°, wałek y −26…−4, z −52…−38, ramiona 8–16 / 3,5–8, warstwy x jak w koncepcji). Gałęzi górnych spełniających „51° przy 73°, przenoszenie ≥ 45°, bez kolizji z gałką i czaszą dolnej” było 88, dolnych 64; **par bez kolizji pręt dolny–nadlew górny, bez krzyżowania cięgien i bez kolizji ramienia B z cięgnem górnym: 0**, niezależnie od okien w rurze. To nie dowód niemożliwości, ale silna wskazówka, że dwie dźwignie i dwa płaskie cięgna po jednej stronie osi w pasie 10 mm to ślepa uliczka.

**R4. Stos przy osi powiek** (30 + 1,2 + 2,4 + 0,25 + 2,4 + 0,25 + 3,25): Ø60 → R39,75, z łbem 2,45 R42,2 (Ø84,4); **Ø56 → R37,75, z łbem R40,2 (Ø80,4 > 80)**; Ø55 → R39,7 (Ø79,4 ✓); Ø54 → Ø78,4.

**R5. Masy, momenty:** czasza 230° R29 × 2: 15,0 cm³ = 18,6 g ✓; klin powieki 100° Rm 32,3 × 2,2: 8,0 cm³ ✓; bezwładność gałki 2,8 mN·m, powieki 2,9 mN·m ✓. Moment modułu na ściance: 0,175 kg · 9,81 · 0,019 m = **0,033 N·m** (koncepcja 0,045; 0,045 wychodzi dla 26 mm). Obejma: N = 2π·100 = 628 N, tarcie 188 N ✓ (model cienkiej opaski; sztywny pierścień 8 × 10 mm da mniej, ale potrzeba < 5 N).

**R6. Drobne liczby:** tęczówka Ø27 na R30 to półkąt 26,7°, przy θ +15° brzeg 41,7° wobec powieki 42° – zapas **0,3° = 0,16 mm**; szczelina 2° = 1,15–1,21 mm ✓; ząbek 0,3°·R30 = 0,16 mm.

## 2. KRYTYCZNE

**K1. Dźwignia górna powieki wychodzi poza rurę i poza Ø79,5.** Miejsce: 2.3 (dźwignia górna r22, β −40°, warstwa x 33,85–36,25), A7 (nadlew r22 ± 3,5), tabela połączeń „Powieki – rura i rant 3,0” (dotyczy tylko czasz). Rachunek R2: już w położeniu zamkniętym nadlew sięga R39,8 od osi z (rura wewn. 37,75, obwiednia 39,75), przy otwartych powiekach dźwignia jest na R42,4, nadlew na R44,3, czyli 4,6 mm poza obwiednią przejścia przez otwór i 6,6 mm w ściance rury. Przyczyna: dźwignia leży w skrajnej warstwie x (36,25 od osi) i obraca się od φ 220° do 271°, czyli kończy skierowana pionowo w dół; przy x 36,25 obwiednia dopuszcza tylko |y| ≤ 10,5 (rura) / 16,3 (okno). Dźwignia dolna z nadlewem r17,5 przy x 33,6 ma R37,9 > 37,75 (0,15 w ściance; samo okno wystarczy). Scenariusz: wykonawca zbuduje według współrzędnych, Assembly pokaże kolizję, albo gorzej: wytnie okno w rurze i dźwignia będzie orać miąższ przy wsuwaniu. Poprawka: dźwignie tylko w sektorze symetrycznym wokół φ 180° (np. 155°→206° dla górnej, r ≤ 20 przy x 36,25 albo okno w rurze), co wymaga nowej syntezy całego czworoboku (patrz K2). Pewność: wysoka (geometria odtwarza tabelę A3 realizatora).

**K2. W pasie 10 mm przy osi powiek elementy wchodzą w siebie.** Miejsce: 2.3, A7, ryzyko 1. Rachunek R2: (a) pręt dolny (x 28,2–30,6) przechodzi przez nadlew dźwigni górnej (x 28,2–36,25, r22 ± 3,5) z przenikaniem 3,6–5,9 mm dla serwa 0–42°, czyli od zamknięcia do półotwarcia; (b) cięgna krzyżują się w płaszczyźnie yz od 18° serwa, a dzielą je osiowo 0,1 mm (A7: 25,9–28,3 i 28,2–30,6) albo 0,3 mm (2.3: 28,6–31,0) wobec ≥ 0,5 z tabeli `AGENTS.md`; (c) cięgno górne wchodzi w czaszę dolnej powieki (R31,2–33,4 w jej paśmie) na 1,3–2,2 mm dla serwa ≥ 54°, bo dźwignia górna przy otwarciu wjeżdża w sektor dolnej powieki (φ −89°). Koncepcja sprawdziła powieki tylko względem kuli R30,5 i tylko dla z ≤ −10; czasze powiek sięgają R33,4 (rant 34,7) i |x| 33,4, a przeguby leżą przy z 0…−17. Scenariusz: mechanizm zablokuje się na wydruku przy pierwszym mrugnięciu; próbka P3 to wykaże, ale koncepcja miała to policzyć przed CAD. Poprawka: rozdzielić dźwignie na strony +x (górna) i −x (dolna); wtedy każda strona ma jedną dźwignię i jedno cięgno, a kolizje (a)–(c) znikają konstrukcyjnie. Napęd z jednego serwa wymaga wówczas prętów S–S (kulki, jak pręty gałki) z orczyka w osi modułu albo 4. serwa po stronie −x (B5). Pewność: wysoka co do kolizji; średnia co do tego, że w pasie po jednej stronie nie ma rozwiązania (R3: 0 na ~10⁵ wariantów).

**K3. Okucia przegubu dolnego wchodzą w gałkę.** Miejsce: A7 („nakrętka samohamująca po stronie −x, x 25,8–28,2”), 2.3 (dźwignia dolna r14, β −90°). Rachunek: przegub przy (y −14; z 0) to płaszczyzna równika kuli; łeb/nakrętka Ø5,5 przy x 25,75–28,2 ma punkty w odległości 27,9–28,1 mm od środka, czyli 2,4 mm wewnątrz kuli R30,5 i 1,9 mm wewnątrz ścianki R30 (czasza istnieje tam, bo kąt biegunowy 90° < 115°). Kontrola „|x| ≥ 23 albo poza kulą R30,5, dla z ≤ −10” tego nie objęła, bo przegub ma z 0…−6,4. Scenariusz: gałka ociera o nakrętkę przy każdym ruchu, przy ψ 25° zahacza. Poprawka: przegub dolny cofnąć za krawędź czaszy (z ≤ −14 przy x 26, czyli φ ≤ −150°) albo przenieść na stronę −x (K2); każdorazowo sprawdzić okucia (łeb 2,45, nakrętka 2,4, podkładka Ø7) w obu skrajnych stanach powiek i gałki. Pewność: wysoka.

## 3. WAŻNE

**W1. Wariant awaryjny B2 (Ø56 z łbami) nie przechodzi przez otwór.** Miejsce: 0.5, 5 („Gdzie łeb się nie mieści”), 12, B2. Rachunek R4: Ø56 daje Ø80,4 z łbami 2,45 (0,2 mm/str. za otwór 80, 0,45 za obwiednię 79,5); dopiero Ø55 daje Ø79,4. Scenariusz: użytkownik odpowiada „nie kupuję DIN 913”, wykonawca ustawia `kulaD` 56 i moduł nie wchodzi w otwór. Poprawka: B2 → „bez DIN 913: `kulaD` 55 (Ø79,4) albo 54 (Ø78,4 z zapasem 0,55/str.)”. Bez zakupu są jeszcze dwie opcje, obie słabsze: (a) śruba M3 wkręcona **ciasno w ucho górne** (Ø2,6 w 2,4 mm PLA), łeb w pogłębieniu 2,45 w boku Ramy, gdzie zostaje 0,8 mm luźnego otworu jako łożysko: ucho górne kręci się razem ze śrubą w ściance, ucho dolne luźno na trzonie; słabe łożysko 0,8 mm, nie polecam bez próbki; (b) M2×6 z warsztatu: łeb 1,3, ale 3,25 w ściance + 0,25 + 2,4 zostawia 0,1 mm w uchu dolnym, odpada. DIN 913 M3×8 to zakup za kilka złotych i to jest właściwa odpowiedź. Pewność: wysoka.

**W2. Ograniczniki gałki prowadzą siłę dziecka przez przeguby kulowe i działają tylko poza zakresem.** Miejsce: 2.1 (nakrętki na prętach o łapki Płyty), 2.5 („siła idzie przez pręt w ramę, nie w serwo”), ryzyko 3. Rachunek: 0,3–0,5 N·m na kuli przy ramieniu 18 mm punktu zaczepienia to 17–28 N w pręcie; w jednym kierunku pręt jest rozciągany, czyli kubek końcówki kulowej jest ściągany z kulki (siła wypięcia końcówek M2 to rząd 20–50 N [Z, bez źródła]). Między ogranicznikami (cały zakres pracy) siła i tak trafia w przekładnię: 0,27–0,45 N·m na wale wobec 0,177 N·m zablokowania; metalowe koła MG90S zniosą chwilowo 2×, wielowypust plastikowego orczyka raczej nie. Poprawka: ogranicznik na Uchwycie i Słupku (kołnierz Słupka z otworem stożkowym ±27°/±17° i piasta Uchwytu albo kołek na Uchwycie w rowku kołnierza, jak kołek Jarzma v2.x). Siła idzie wtedy kula → Uchwyt → Słupek → Płyta, z pominięciem prętów, kulek i serw, a nakrętki na prętach stają się zbędne. W zakresie pracy pozostaje test z ryzyka 3 (15 N na źrenicy, zasilone serwo, 20 razy); dopisać oględziny wielowypustu orczyka i sprawdzenie, czy kulki zostały na miejscu. Pewność: wysoka co do drogi siły, średnia co do siły wypięcia.

**W3. Przeguby kulowe: wymaganie ≥ 28° jest na granicy typowych końcówek, a koncepcja nie ma ich wymiarów w układzie.** Miejsce: 2.2 (odchylenie 25°/16°), 2.4 (odstępy 1,5–3 mm), 5 (kulki na M2/M3). Rachunek R1: 24,6° na gałce przy już optymalnej osi czopa (∥ y), więc orientacją nic nie zyskamy; końcówki M2 (Align/Tamiya) dopuszczają zwykle ok. 25–30° od płaszczyzny czopa [Z, do pomiaru w P4]. Korpus końcówki ma ok. 6–8 mm szerokości wzdłuż osi czopa: kulka orczyka Y leży w x −8, a spód korpusu S_P w x −4,5, czyli 3,5 mm na pół korpusu końcówki i luz; przy orczyku X kulka w x −18 a korpus S_X kończy się na x −16 (orczyk 2 mm **za** końcem wieży wałka? wymiary 2.4 i tabela 2.2 nie zgadzają się ze sobą). Scenariusz: po pomiarze MG90S i końcówek cały rzut od tyłu (2.4) trzeba przesunąć, a S_Y/S_P nie mają zapasu. Poprawka: do pomiarów B3/B4 dopisać końcówki kulowe (Ø kulki, długość gwintu czopa, szerokość i wysokość kubka, kąt do oporu, siła wypięcia) i rzut 2.4 oznaczyć „do CAD po B4”, a nie jako wynik. Pewność: wysoka.

**W4. Kable MG90S wychodzą w stronę gałki.** Miejsce: 2.4, 9 („kable do tyłu”). Fakt z `sprzet.md`/dziennik 18.10: kabel wychodzi u dołu krótszego boku od strony wałka. Przy osi serwa ∥ x i wałku w z −45 (6 mm od czoła z −39) tym bokiem jest ścianka z −39, zwrócona do gałki, a „dół” to koniec x +12,5…+22,8, czyli kable trzech serw wychodzą w stronę Uchwytu, prętów i ramienia powiek. Scenariusz: kabel S_P (x 22,8, z −39) leży dokładnie pod ramieniem powiek (x 23,2–25,6, z −29…−61); kabel S_Y pod cięgnem górnym. Poprawka: w Płycie kanały kabli od czoła z −39 wzdłuż korpusu do tyłu, ujęte w luzach ≥ 0,5 wobec ramion i cięgien; wpisać do listy par w 5. Pewność: wysoka co do kierunku wyjścia, średnia co do kolizji (zależy od B4).

**W5. Warstwy cięgien są niespójne i poniżej luzu 0,5.** Miejsce: 2.3 (cięgna x 28,6–31,0 i 25,9–28,3), A7 (28,2–30,6), tabela luzów `AGENTS.md` (ruchome obok ≥ 0,5). Dwie wersje tego samego stosu różnią się o 0,4 mm; w wersji A7 cięgna zachodzą na siebie osiowo o 0,1 mm, w wersji 2.3 mają 0,3 mm. Przy krzyżowaniu w yz (R2, od 18° serwa) to kolizja. Po K2 problem znika, ale brief CAD musi dostać jeden stos z luzami ≥ 0,5 między cięgnami innych części i 0,25 w przegubie. Pewność: wysoka.

**W6. Obejma potrzebuje ciągłego walca pod sobą, a rura ma okna.** Miejsce: 3 (M1: zacisk na rurze Ø79,5), 4 (Rama: rura do z −35 „(okna)”, 35 % wycięte w A4). Obejma 10 mm siedzi w z −5…−15 przy ściance 15 i z −25…−35 przy ściance 35, czyli na całym odcinku rury, w którym mają być okna. Scenariusz: zacisk na krawędziach okien odkształca rurę i nie trzyma; przy ściance 35 Obejma kończy się dokładnie na końcu rury (zero zapasu). Poprawka: pas pełny z −3…−37 (rura o 2 mm dłuższa) i okna tylko w Płycie/klatce; do próbki P5 dodać zacisk na rurze z oknami. Dodatkowo PLA pełznie pod stałym naciągiem śruby: po 24 h siła spada; Obejmę i Pokrętło w PETG albo dokręcenie po dobie w instrukcji. Pewność: wysoka co do okien, średnia co do pełzania.

**W7. Płyta i ograniczniki prętów nie są opisane na tyle, żeby je narysować.** Miejsce: 4 (Płyta: „łapki ograniczników prętów”), 2.1. Pręty X i Y (z −6 → −45) i oba cięgna powiek przechodzą przez tarczę Płyty (z ok. −35); potrzebne są 4 otwory o kształcie wynikającym z ruchu prętów (koniec przy orczyku przesuwa się po łuku do ±8 mm w z i 3 mm w y, pręt pochyla się do 16°). Nakrętka M2 na pręcie uderzająca w łapkę wymaga rowka, w którym nakrętka Ø4 mieści się przy każdym pochyleniu i nie zahacza w zakresie pracy. Nic z tego nie jest podane, choć decyduje o kształcie Płyty. Po W2 (ogranicznik na Słupku) zostają same otwory przejściowe z luzem ≥ 0,5 w całym zakresie. Pewność: wysoka.

**W8. Mocowanie tylnych widełek kardana: tylko wkręt ustalający trzyma osiowo.** Miejsce: 2.1 (widełki w kieszeni Słupka, M5×25, wkręt ustalający), 2.5 (szarpnięcie 50 N). Kieszeń wymusza obrót, ale wyciągnięcie gałki do przodu (dziecko łapie gałkę) obciąża drogę Uchwyt → M3×12 w PLA → krzyżak → tylne widełki → wkręt ustalający na gwincie M5 → Słupek. Zacisk wkręta na gwincie M5 trzyma osiowo kilkadziesiąt N [Z]. Poprawka: kieszeń z kołnierzem zamykanym od przodu (np. tylne widełki wchodzą od tyłu Słupka, a od przodu kieszeń jest węższa niż widełki) albo wałek M5 przez otwór poprzeczny widełek, jeśli kardan taki ma (dopisać do pomiaru B3: czy widełki mają otwór poprzeczny czy tylko wkręt, rozmiar wkręta: na stronie 5 mm bywa M4). Pewność: średnia.

**W9. Rama nie leży płasko rantem w dół.** Miejsce: 4 (Rama: „rantem w dół”; rant „spód po łuku R150 jak w Gnieździe v2.6”). Rant Ø84 dopasowany do kuli R150 ma strzałkę 42²/(2·150) = 5,9 mm, więc nie jest płaszczyzną. Poprawka: drukować rurą w dół (rant u góry, 2 mm wysięgu z fazą 45°), albo rant płaski z ząbkami (2 mm poza otwór i tak tonie w miąższu); zapisać w planie drzewa. Pewność: wysoka.

**W10. Montaż M1 przy ściance 15 mm i boczne pchnięcie gałki.** Miejsce: 3 (docisk: rant 2 mm, kołnierz Obejmy na brzegu ok. 900 mm²), P5 (10 N osiowo, 0,1 N·m). Pchnięcie gałki z boku 20 N na 35 mm przed ścianką to 0,7 N·m; przy ramieniu 15 mm między rantem a Obejmą daje to ok. 47 N na rancie 452 mm² (0,1 MPa) i tyle samo na kołnierzu. Mokry miąższ po 2–3 dniach ma wytrzymałość rzędu 0,1–0,3 MPa [Z]. P5 mierzy 10 N osiowo i 0,1 N·m – za mało. Poprawka: P5 z momentem 0,7 N·m (20 N na dźwigni 35 mm) po 24 h i po 72 h. Pewność: średnia (brak danych o miąższu).

**W11. Czasze powiek muszą mieć wycięcia przy własnych dźwigniach, a to nie jest powiedziane.** Miejsce: 2.3, 4 (Powieka: „czasza R31,2–33,4 o zakresie 100°, ucho, dźwignia”). Czasza jest klinem od ucha do ucha; przy x 28,2 zajmuje promień 13,3–17,9 od osi, więc przegub i okucia własnego cięgna (r 14 ± 3, x 25,8–30,6) leżą w jej ściance przy tylnej krawędzi. To ta sama część, więc wystarczy wycięcie, ale musi być w briefie CAD (podobnie wycięcie w górnej, jeśli jej przegub trafia w jej własny sektor). Pewność: wysoka.

**W12. Brak konwencji znaków i jednej mapy położeń.** Miejsce: 2.3, A3, 6, 7. Kąt β „od −z w stronę +y”, kąt ramienia −20°/130° i kierunek obrotu serwa nie są zdefiniowane tak, żeby dało się je przepisać do Variable Studio; sam musiałem je odtworzyć z długości cięgien (R2) i jedno z czterech odbić zgadzało się z tabelą. Poprawka: do 6 dodać tabelę współrzędnych (y; z) wszystkich przegubów powiek w stanie zamkniętym i otwartym oraz znak dodatni każdego serwa (który kierunek impulsu otwiera / obraca w prawo). Bez tego wykonawca zgaduje. Pewność: wysoka.

## 4. DROBNE

**D1.** Moment modułu względem ścianki 0,033 N·m (19 mm), nie 0,045 (R5); wniosek (para sił ok. 2–3 N) bez zmian.

**D2.** A1 twierdzi, że przegub obrotowy + kulowy (4 DOF) się zakleszcza. Cogley Compact ma właśnie taki układ (kulka przy serwie, czop drukowany przy oku, sprawdziłem w źródle) i działa u 20 budowniczych dzięki luzom i podatności PLA przy ±20°. S–S jest słuszne, ale uzasadnienie „konieczne” jest za mocne; dla briefu bez znaczenia.

**D3.** Zapas tęczówki przy θ +15° to 0,3° = 0,16 mm (R6); każdy błąd kalibracji powieki > 0,3° zakrywa brzeg tęczówki. Albo `katOtwGorna` 44°, albo zapisać jako świadomy wybór.

**D4.** Cytowanie EN 71-1 przez JJR Lab: strona nie podaje ogólnej reguły „< 5 albo > 12 mm”, tylko zasadę przymiarów 5/12 mm dla mechanizmów przesuwnych, zawiasów ≥ 250 g i kół; dla powiek to analogia, nie wymaganie normy. Wniosek (4,4–5,7 N, rant R1,5) jest rozsądny.

**D5.** Rzut 2.4: korpus S_X „x −16…12,5” (28,5 = wysokość z wieżą), a orczyk X w x −18, czyli 2 mm **poza** końcem wieży; orczyk siedzi na wielowypuście wewnątrz tych 28,5. Analogicznie S_P (x do 22,8) i ramię powiek od x 23,2. Układ serw w x jest przesunięty o ok. 4–6 mm względem orczyków; rozstrzygnie pomiar B4, ale rzut 2.4 nie powinien podawać odstępów 1,5–3 mm jako wyniku.

**D6.** Face maker101 ma przeguby krzyżowe **drukowane** (pliki `joint_v1.stl`, `center-joint_v1.stl`) i jedno serwo powiek dla obu oczu; koncepcja powołuje się na niego przy kardanie RC. To raczej źródło dla wariantu „drukowany krzyżak” z warunku odrzucenia w pkt 12 niż dla kardana z warsztatu.

**D7.** Film EyeMech ε3.2 (`MeHLouL9ltw`) to według strony GitHub instrukcja montażu, a nie pokaz działania; dowodem działania EyeMech są zdjęcia i „20 people made this” na Instructables Compact. Dla statusu „sprawdzone” bez zmian, ale opis w 2.2 jest nieścisły.

**D8.** Drut sprężysty z warsztatu (`sprzet.md`) plus haczyki to dokładnie popychacze z „on the Cheap” (sprawdzone, zero zakupów). Koncepcja go nie rozważa; projekt słusznie preferuje części drukowane i M3, ale B1 powinno nazwać tę opcję jako zapasową, bo blokuje zakup.

## 5. Odpowiedzi na pytania briefu

| # | Pytanie | Ocena |
|---|---|---|
| 1 | Kinematyka gałki | Zgodna z moim rachunkiem (R1). Kardan 28,9°/31,6°; przegięcie ≥ 33° wymagane słusznie. Kolizje prętów z gałką, Słupkiem i powiekami: zapasy 3,2 / 5,8 / 26° ✓. Brak martwego punktu ✓ |
| 2 | Powieki z jednego serwa | Kąty i siła przycięcia poprawne (R2), ale geometria nie mieści się w rurze i koliduje (K1–K3). Pas 10 mm nie wystarcza na dwie dźwignie i dwa cięgna po jednej stronie (R3) |
| 3 | Obrys i montaż | Walec Ø79,5 naruszony przez dźwignię górną do Ø88,6 (K1). Reszta ✓. DIN 913 konieczne przy Ø60; wariant awaryjny Ø55, nie Ø56 (W1). Droga wsuwania i 2 ruchy w dyni zgodne z briefem ✓ |
| 4 | Obejma | Tarcie 188 N vs < 5 N ✓, ale siedzisko na rurze z oknami (W6), pełzanie PLA, P5 za łagodna (W10). Wariant rozsądny, próbka konieczna |
| 5 | Źródła | Tabela w sekcji 6. Cytaty prawdziwe. S–S na obu końcach przy nieruchomych serwach: adaptacja bez pierwowzoru (poprawnie oznaczona [A]); jednoserwowe górna–dolna: bez pierwowzoru ✓ |
| 6 | Ręka dziecka | 20 N z przodu ✓ (kardan). Ograniczniki na prętach obciążają kulki i serwa (W2); w zakresie pracy przekładnia dostaje 1,5–2,5 × zablokowanie (koncepcja to przyznaje). Powieki: ogranicznik w Ramie ✓, 5,6 N ✓ |
| 7 | Luzy | Powieka–gałka 1,2 ✓, osiowe 0,25 ✓, cięgna między sobą 0,1–0,3 ✗ (W5), nadlew–dźwignia dolna 1,0 ✓, pręt dolny–nadlew górny −5,9 ✗ (K2), okucia–gałka −2,4 ✗ (K3), kable nieuwzględnione (W4) |
| 8 | DFAM | Rama nie leży płasko (W9); gałka, powieki, Płyta, Obejma OK; wszystko ≤ 180 ✓ |
| 9 | Prąd i rozruch | Budżet spójny z E5.5; rozruch co 150 ms ✓; po zaniku zasilania skok to zwykła sakada ✓; powieki startują od „otwórz” ✓; kanały 13–15 i podtrzymanie z GPIO ✓ |
| 10 | Gotowość do CAD | Gałka, Rama, Płyta (po W7), Obejma: tak po poprawkach. Powieki: nie, bez nowej syntezy (K1–K3) i konwencji (W12). B1–B4 niekompletne: brak wymiarów końcówek kulowych i sposobu mocowania widełek (W3, W8); B2 z błędnym wariantem awaryjnym (W1); B5 przestaje być opcjonalne |
| 11 | Zgodność z briefem | Otwór ≤ 80 ✓ (poza K1), lekko ✓ (175 g, bez gwintu i kasety, ścianki ≥ 2), 2c ✓, M3 ✓, bez wkładek ✓, nakrętki samohamujące ✓, komplet ✓. Zakupy: 4 końcówki kulowe + pręty i 2 wkręty DIN 913 – minimalne; bez zakupów zostaje drut z haczykami (D8) i Ø55 (W1), oba gorsze |

## 6. Źródła: co sprawdziłem

| Źródło | Otwarte | Co potwierdza | Uwagi |
|---|---|---|---|
| Instructables „on the Cheap” | tak (przez proxy tekstowe) | 4 × SG90, „3mm Universal Joint” na liście części, popychacze z drutu z haczykami w otwory gałki, film `I7IxOmThaxw`, 6 budowniczych | strona nie mówi, gdzie siedzi kardan; powieki na osobnych serwach |
| Instructables Compact | tak | 6 × MG90S, „4* M2 Servo Ball-links”, kulki **tylko po stronie serwa**, przy oku czopy drukowane, cytat „commonly used in professional eye mechanisms” prawdziwy, 20 budowniczych | dwa serwa w sub-base: jedno dla obu górnych, drugie dla obu dolnych powiek |
| GitHub EyeMech_Epsilon | tak | 6 serw, kanały Top/Bottom Left/Right ✓ | film to instrukcja montażu (D7) |
| Stan Winston forum, komentarz 6206 | tak | cytat prawdziwy (Chris Ellerby, 2015), kardan w środku oka, oko wydrążone | ✓ |
| Stan Winston forum 6348 | tak | „Some setups use a single servo for all 4 lids” – uwaga ogólna, bez konstrukcji | koncepcja ocenia to poprawnie |
| PCBWay Face maker101 | tak | 5 × MG90S, przeguby **drukowane**, pręty ze spinaczy, 1 serwo powiek, zdjęcia bez filmu | D6 |
| Make „simple animatronic eyes” | tak | cytat o osi y i powiekach prawdziwy; 6 × SG90 | ✓ |
| components101 MG90S | tak | 1,8 kg·cm przy 4,8 V, 2,2 przy 6 V, 13,4 g; prądu nie podaje | koncepcja prąd oznaczyła [Z] ✓ |
| JJR Lab EN 71-1 | tak | przymiary 5/12 mm tylko dla wybranych mechanizmów | D4 |
| protosupplies SG90, film Cogleya, Printables E31 | nie | — | — |
| Otwór uszu MG90S, kąt kardana RC 3→5 mm | szukałem, bez wyniku | — | B3/B4 pozostają pomiarem |

## 7. Zestawienie

| Waga | # | Jedno zdanie |
|---|---|---|
| KRYTYCZNE | K1 | Dźwignia górna powieki sięga R44,3 od osi: poza rurą (37,75) i poza Ø79,5 |
| KRYTYCZNE | K2 | Pręt dolny przenika nadlew górnej o 3,6–5,9 mm, cięgna krzyżują się przy 0,1–0,3 mm, cięgno górne wchodzi w czaszę dolnej 2,2 mm; w pasie po jednej stronie nie znalazłem układu bez kolizji |
| KRYTYCZNE | K3 | Nakrętka przegubu dolnego wchodzi 2,4 mm w gałkę |
| WAŻNE | W1 | Wariant awaryjny Ø56 daje Ø80,4; mieści się Ø55 |
| WAŻNE | W2 | Ograniczniki na prętach obciążają kulki (28 N) i działają tylko poza zakresem; przenieść na Uchwyt–Słupek |
| WAŻNE | W3 | Końcówki kulowe bez wymiarów w układzie; 24,6° przy optymalnej osi, odstęp do S_P 3,5 mm |
| WAŻNE | W4 | Kable MG90S wychodzą w stronę gałki, pod ramię powiek i cięgna |
| WAŻNE | W5 | Warstwy cięgien niespójne (2.3 vs A7), luz 0,1–0,3 < 0,5 |
| WAŻNE | W6 | Obejma siedzi na odcinku rury z oknami; pełzanie PLA |
| WAŻNE | W7 | Otwory i ograniczniki w Płycie nieopisane |
| WAŻNE | W8 | Tylne widełki kardana trzymane osiowo tylko wkrętem ustalającym |
| WAŻNE | W9 | Rama z rantem po łuku R150 nie leży płasko |
| WAŻNE | W10 | P5 bez bocznego pchnięcia 0,7 N·m |
| WAŻNE | W11 | Wycięcia czasz powiek przy własnych przegubach nie są w opisie |
| WAŻNE | W12 | Brak konwencji znaków i mapy przegubów powiek |
| DROBNE | D1–D8 | moment 0,033; A1 za mocne; zapas tęczówki 0,16 mm; EN 71 przez analogię; orczyki poza wieżą wałka; Face maker drukowany; film ε3.2 to montaż; drut z haczykami jako zapas bez zakupów |

## Werdykt

**NIE w obecnej postaci: napęd powiek wymaga zmiany architektury** (dźwignie rozdzielone na strony +x/−x i pręty S–S z orczyka w osi modułu przy 3 serwach, albo 4. MG90S po stronie −x; nowa synteza z dźwigniami w sektorze symetrycznym wokół tyłu i okuciami poza kulą R30,5 i czaszami R33,4), natomiast gałka, kardan, pręty S–S, Rama, Płyta i Obejma nadają się do briefu CAD po poprawkach W1–W12, z ogranicznikiem na Uchwycie i Słupku zamiast na prętach.
