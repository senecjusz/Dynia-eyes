# Montaż dużego oka v1 (szkic)

Instrukcja do składania we dwóch: rodzic i syn. Duże oko to gałka Ø60 poruszana w dwóch osiach (lewo–prawo i góra–dół) przez dwa serwa i dwa pręty z przegubami krzyżowymi. Przed gałką pracują dwie powieki na wspólnej osi, każda z własnym serwem. Cały mechanizm siedzi w Ramie, którą wsuwa się w otwór Ø80 w dyni i dociąga Obejmą.

Szkic wykonawcy CAD z 23.10.2026. Podstawy:
- koncepcja v3.2 (`20-analizy/2026-10-23-duze-oko-2c-koncepcja-v3.2.md`, pkt 8 „Montaż”);
- README druku (`40-cad/3mf/Duze oko v1/README.md`);
- decyzje E6.4–E6.6.

Obrazki dodamy po zakończeniu CAD. **[2b]** oznacza miejsca zależne od etapu 2b CAD (Uchwyt, Ramiona X/Y, pręty, słupki stopu) – wymiary, długości śrub i kolejność mogą się tam jeszcze zmienić.

## Części

### Do druku

Pliki 3MF: `40-cad/3mf/Duze oko v1/` (eksport ręczny po etapie 2b). Orientacja na stole i podpory: README druku. **Najpierw Próbka P4** (przegub krzyżowy) i **Próbka P6** (czasza Gałki).

| Nazwa | Szt. | Uwagi |
|---|---|---|
| Rama | 1 | PLA, tyłem w dół |
| Płyta | 1 | PLA, tarczą w dół; 4 klatki serw, wspornik Słupka |
| Słupek | 1 | pionowo, czopem w dół |
| Gałka | 1 | PLA biały, krawędzią tylną w dół |
| Powieka górna, Powieka dolna | 1 + 1 | podpory od strony wklęsłej |
| Ramię PG, Ramię PD | 1 + 1 | płasko, pogłębieniem w dół |
| Obejma | 1 | **PETG** |
| Uchwyt | 1 | [2b] płytą w dół, podpory drzewiaste pod wspornikami |
| Łapa Uchwytu | 2 | [2b] na boku |
| Ramię X, Ramię Y | 1 + 1 | [2b] płasko |
| Pręt X, Pręt Y | 1 + 1 | [2b] pionowo, czopem na stole (brim) |
| Widełki pręta przy orczyku X, Y | 1 + 1 | [2b] podstawą na stole |
| Krzyżak przy gałce, Krzyżak przy orczyku | 2 + 2 | [2b] osią pionowo |
| Przyrząd gięcia drutów | 1 | płytką w dół |
| Przyrząd zera | 1 | dnem w dół |

### Kupne i z warsztatu

- 4 × serwo **MG90S** (Miuzei MS60-4-D-V1) z orczykami jednoramiennymi i wkrętami środkowymi,
- kardan 5/5 (Ø11 × 25,5),
- drut sprężynowy Ø1,2, 2 × ok. 60 mm,
- ESP32 + PCA9685, program `50-elektronika/kalibracja` (kanały 12 = X, 13 = Y, 14 = powieka górna, 15 = dolna).

### Śruby i drobne części

| Nazwa | Szt. | Do czego | Krok |
|---|---|---|---|
| **M2×10 + nakrętka M2 (DIN 934) + podkładka Ø6** | 8 | uszy 4 serw w klatkach Płyty | 1 |
| M2 krótki (ok. 6) | 4 | Ramiona PG/PD przez otwory orczyka (rozwiercone do Ø1,6) | 3 |
| wkręt środkowy orczyka | 4 | z kompletu serwa: Ramiona PG, PD, X, Y | 3 |
| **DIN 7991 M3×8** (zamiennie DIN 913 M3×8) | 2 | osie powiek w gniazdach stożkowych boków Ramy | 5 |
| **DIN 7991 M5×30 + nakrętka M5** | 1 | trzpień Słupka (łeb w gnieździe piasty Płyty, nakrętka w kieszeni Słupka) | 6 |
| M4 bez łba (docięty) | 2 | wkręty piast kardana: przez Słupek i przez tuleję Uchwytu | 6, 7 |
| DIN 7991 M5 + nakrętka M5 | 1 | [2b] zamknięcie tulei Uchwytu, koniec jako czop w górnej piaście kardana | 7 |
| M3 (długość [2b]) | 2 | Łapy Uchwytu od wierzchu płyty | 7 |
| **DIN 7991 M3×6** | 2 | Gałka: przez Łapy w nadlewy (po korekcie v3.2 zamiast M3×8) | 8 |
| **DIN 7991 M2×4** | 8 | [2b] sworznie przegubów przy gałce | 9 |
| **DIN 7991 M2×5** | 4 | [2b] sworznie a1 przy orczyku (widełki Ramion) | 9 |
| **DIN 7985 M2×5** | 4 | [2b] sworznie a2 przy orczyku (widełki pręta) | 9 |
| **DIN 912 M3×12** | 2 | [2b] obrotnice prętów | 9 |
| **M3×45** | 3 | Płyta do Ramy (od tyłu tarczy przez słupki w gwinty uch Ramy) | 10 |
| **M3×25 + nakrętka samohamująca DIN 985** | 1 | zacisk Obejmy | 13 |

Wiertła: Ø1,6 (otwory zaczepów drutu, Ramion i orczyków), **Ø2,0 do rozwiercenia otworów krzyżaków**.

## Uważaj

1. **Gwinty M3 w uchach Ramy** to otwory Ø2,5 bez gwintu: przed montażem nagwintuj je, wkręcając i wykręcając stalową M3 (Krok 0).
2. **Krzyżaki:** otwory sworzni drukowane Ø1,8 rozwierć ręcznie wiertłem Ø2,0 (wiertło w imadle albo w uchwycie ręcznym, nie wkrętarką). Wkręt M2 ma się obracać w krążku bez luzu, który da się wyczuć palcami.
3. **Wkręty M2 w policzki** wkręcaj do oporu łba, bez dociągania – gwint w plastiku łatwo zerwać.
4. **Serwa nasadzaj tylko przy 1500 µs z programu `kalibracja`**, zasilanie przez cały czas nasadzania (jak w małym oku v2.8). Nie używaj `test-serwa`.
5. **Nie kręć gałką ani powiekami ręką, gdy serwa są zasilone.** Palce z dala od Ramion i prętów, gdy program wysyła ruch.

## Bezpieczeństwo

- **Rozwiercanie krzyżaków i docinanie M4 – tylko rodzic.**
- **Otwornica w dyni – tylko rodzic.**
- Test nadlewów (Krok 8) – rodzic trzyma Gałkę, syn czyta wagę.

## Krok 0. Przygotowanie części (rodzic)

1. **Rama:** wkręć i wykręć stalową M3 w 3 ucha (Ø2,5, pełny gwint 4,25 mm po fazce).
2. **Zaczepy drutu** w Powiekach i otwory drutu w Ramionach PG/PD: przewierć Ø1,6.
3. **Orczyki PG/PD:** rozwierć po 2 otwory orczyka do Ø1,6 (co drugi otwór, 7,5 i 11,5 mm od osi – przymierz do Ramienia).
4. **Krzyżaki** [2b]: rozwierć 4 otwory każdego krzyżaka Ø2,0.
5. Przymierz orczyki do kieszeni Ramion PG/PD (wymiary kieszeni to szacunki – zmienne `orczyk*` w CAD).

**Sprawdź:** M3 wchodzi w ucha Ramy do końca, M2 obraca się w krzyżaku.

## Krok 1. Serwa w Płytę (rodzic; syn podaje śruby i układa kable)

1. Włóż 4 serwa MG90S w klatki Płyty: S_X, S_Y, S_PG, S_PD (oznaczenia jak w CAD; S_PG odwrócone).
2. Każde ucho: **M2×10 z podkładką Ø6 od strony tarczy przez wycięcie ucha, nakrętka M2 w kieszeni bloku**. Dokręć z wyczuciem.
3. **(S)** układa kable w kanałach klatek (kanał przyjmuje kabel z dowolnej krótszej ściany) i przez otwory kabli w tarczy pod S_X, S_Y, S_PD. Kabel S_PG wychodzi przez okno G tarczy.

**Sprawdź:** serwa nie kiwają się w klatkach (luz korpusu 0,4 na stronę), kable nie są zgniecione pod korpusem.

## Krok 2. Kalibracja serw na 1500 µs (rodzic)

1. Podłącz serwa do PCA9685 na kanałach 12–15. Wgraj `50-elektronika/kalibracja` i dla każdego kanału wyślij `1500`.
2. Serwa trzymają 1500 µs, dopóki program działa. **Nie odłączaj zasilania aż do końca Kroku 3.**

## Krok 3. Ramiona na wałki (rodzic)

1. **Ramię PG** (kieszeń orczyka od strony serwa): orczyk w kieszeń, wkręt środkowy przez pogłębienie Ø4,5 w wałek, 2 × M2 krótkie przez otwory orczyka. Nasadź w położeniu „zamknięte”: bok ramienia przy słupku stopu G zamknięcia [2b – słupki stopu].
2. **Ramię PD** (na orczyku fabrycznym, wybranie 0,5 do orczyka): tak samo, położenie „zamknięte”.
3. **Ramiona X i Y** [2b]: orczyk w kieszeń, M2 przez orczyk. Ramię w zerze skierowane w +y (r 14,7 / 15,4). Najpierw Y, potem X. Dokładne zero ustawia później Przyrząd zera (Krok 11).

**Sprawdź:** ramiona siedzą bez luzu. Po `g 1400 4000`, `g 1600 4000`, `g 1500 4000` ruszają się płynnie i wracają do tego samego położenia.

## Krok 4. Druty z przyrządu (rodzic gnie, syn sprawdza na przyrządzie)

1. Dwa odcinki drutu sprężynowego Ø1,2 (ok. 60 mm) zegnij na **Przyrządzie gięcia drutów**: rowek G i rowek D, kołki w środkach zagięć Z i łuków wykorbienia, długość nóg według karbów.
2. **(S)** kładzie gotowy drut na przyrządzie: drut leży w rowku na całej długości.

## Krok 5. Powieki w Ramę (rodzic; syn trzyma i wkręca zaczepy)

1. Od tyłu Ramy włóż **Powiekę dolną**, potem **górną**. Ucha nakładają się na boki osi: bok Ramy → ucho G → ucho D (luz 0,25 między nimi).
2. Oś powiek z każdej strony: **DIN 7991 M3×8** z zewnątrz w gniazdo stożkowe boku Ramy, przez ucha.
   - **Zamiennie DIN 913 M3×8** (wkręt bez łba, jest w warsztacie): wkręca się w ten sam gwint Ø2,5 boku Ramy, stożek gniazda zostaje pusty. Wkręć go **równo z powierzchnią boku** – nie może wystawać poza obrys rury Ø79,5. Koniec wypada wtedy 0,55 przed wewnętrzną ścianą ucha D, jak przy DIN 7991.
   - Gwint w boku ma tylko ok. 1,6 mm (pod stożkiem gniazda), a wkrętu bez łba nic nie dociska. Zabezpiecz go kroplą kleju do gwintów i sprawdź po teście 24 h, czy się nie wykręcił.
3. **(S)** wkręca zagięcie Z drutu w otwór zaczepu J każdej powieki.
4. **(S)** przykleja zamknięte powieki taśmą do rantu, a druty taśmą do rury, żeby nie przeszkadzały przy dalszym montażu.

**Sprawdź:** powieki obracają się ręką bez oporu (górna ok. 100°, dolna ok. 79°). Krawędzie przednie przy zamknięciu mają szczelinę ≥ 0,6 mm.

## Krok 6. Słupek i kardan (rodzic)

1. **Słupek** na piastę wspornika Płyty: DIN 7991 M5×30 od spodu przez gniazdo stożkowe piasty, nakrętka M5 w kieszeni Słupka. Spłaszczenie czopu Słupka w kieszeni piasty blokuje obrót.
2. **Kardan 5/5** dolną piastą w kieszeń Słupka (Ø11,6), na koniec trzpienia M5.
3. Wkręt M4 kardana dokręć przez otwór Ø4,2 w Słupku (na ±x; potwierdź stronę – B2).

**Sprawdź:** kardan nie obraca się na trzpieniu, zgina się swobodnie w obu osiach.

## Krok 7. Uchwyt z łapami (rodzic) [2b]

1. **Łapy Uchwytu** (2 szt.) przyłóż od spodu płyty okna przy nadlewach (φ 210° i 330°), żeberkiem do płyty. Przykręć M3 od wierzchu płyty (łeb w pogłębieniu) w żeberko.
2. Uchwyt nasadź tuleją na górną piastę kardana. Zamknięcie tulei: DIN 7991 M5 przez gniazdo, nakrętka M5 w kieszeni bocznej, koniec śruby w otworze Ø5 piasty kardana.
3. Wkręt M4 górnej piasty dokręć przez otwór Ø4,2 w tulei (otwór przelotowy w obu kierunkach ±y – wkręt trafi z jednej strony).

**Sprawdź:** Uchwyt nie ma luzu na kardanie, płyta okna obraca się z kardanem do oporu o Słupek w każdą stronę.

## Krok 8. Test nadlewów i Gałka (rodzic; syn czyta wagę i nakłada Gałkę)

1. **Test nadlewów przed montażem:** wkręć śrubę M3 w każdy nadlew Gałki i ciągnij oraz zginaj ją wagą bagażową siłą ok. **30 N**. Nadlew 330° (przy wycięciu X) łączy się ze ścianką tylko łukiem ok. 70°. Jeśli pęknie – nie montuj, zgłoś (zmiana: przypora nadlewu).
2. **(S)** nakłada Gałkę na Uchwyt: nadlewy w kieszenie płyty okna, czoła nadlewów na Łapy.
3. 2 × **DIN 7991 M3×6** od tyłu przez Łapy w otwory Ø2,6 nadlewów.

**Sprawdź:** Gałka nie kiwa się na Uchwycie, wgłębienie zera (Ø3,2 pod źrenicą) jest na przodzie.

## Krok 9. Pręty z przegubami (rodzic) [2b]

1. **Przeguby przy gałce:** krzyżak Ø5,5 w widełki stałe Uchwytu, DIN 7991 M2×4 w policzki (łby w pogłębieniach). Potem widełki pręta na krzyżak, DIN 7991 M2×4.
2. **Obrotnica:** widełki pręta przy orczyku na czop pręta (łożysko Ø4,8), DIN 912 M3×12 przez pogłębienie w otwór pręta, do oporu łba. Widełki obracają się na czopie z luzem osiowym 0,1.
3. **Przeguby przy orczyku:** krzyżak Ø8 w widełki Ramienia, DIN 7991 M2×5. Widełki pręta na krzyżak, DIN 7985 M2×5.
4. Kolejność: najpierw pręt Y, potem X.

**Sprawdź:** każdy przegub rusza się ręką bez zacięć w obu osiach (serwa bez zasilania). Pręt nie ma luzu wzdłużnego, który da się wyczuć palcami.

## Krok 10. Płyta do Ramy (syn z rodzicem)

1. **(S)** z rodzicem wsuwa Płytę z gałką od tyłu w Ramę, aż stożkowe końce 3 słupków Płyty usiądą w fazkach uch Ramy.
2. Rodzic: 3 × **M3×45** od tyłu tarczy przez słupki w gwinty uch Ramy.
3. Rodzic dopina druty w otwory Ramion PG/PD (od boku między z −37 a tarczą albo przez okna tarczy): odegnij cały drut, nie sam koniec.
4. Zdejmij taśmę z powiek i drutów.

## Krok 11. Kalibracja z Przyrządem zera (syn w telefonie, rodzic zapisuje)

1. Powieki otwarte (krawędzie ≥ 42° od osi).
2. Załóż **Przyrząd zera** na czoło rantu Ramy (fartuch na średnicy Ø84), trzpień Ø3 w stronę Gałki.
3. **(S)** przesuwa w telefonie suwaki X i Y, aż trzpień wejdzie we wgłębienie zera Gałki bez nacisku. Rodzic zapisuje µs zera X i Y (NVS) i zdejmuje przyrząd.
4. Powieki: dojazd do słupka stopu zamknięcia, cofnięcie o 1,0° serwa; to samo dla otwarcia. Rodzic zapisuje µs.

## Krok 12. Test 24 h na stole

Program ruchu z rampami; obserwuj luz zwrotny gałki, ciepło serw i odgłosy w skrajnych położeniach. Wynik do `70-budowa/dziennik.md`.

## Krok 13. W dyni (rodzic: otwór i Obejma; syn: wsuwanie i wtyczki)

1. Rodzic: otwornica Ø80 w dyni.
2. **(S)** wsuwa moduł od przodu do oparcia rantu (ząbki rantu w skórce).
3. Rodzic: **Obejma** na rurze od środka dyni (pas z −5…−35), M3×25 z nakrętką samohamującą w kieszeni, dokręć wkrętakiem. Dokręć ponownie po 24 h.
4. **(S)** wpina wtyczki serw do PCA9685.

## Otwarte [2b]

- Uchwyt: długość M3 Łap, zamknięcie tulei (z do 19,75), wsporniki z podporami.
- Ramiona X/Y: kieszeń orczyka, M2 przez orczyk, kierunek w zerze.
- Słupki stopu powiek: położenie styku Ramion PG/PD w Kroku 3.
- Wyniki Próbki P4 (luz sworzni po rozwierceniu) – do tabeli luzów w `AGENTS.md`.
