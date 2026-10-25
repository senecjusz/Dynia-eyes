# The Face maker101 — analiza referencji i adaptacji do gałki Ø60

25.10.2026 · Astra · zadanie: `30-projekt/brief-analiza-referencji-face-maker101.md`.

**Wynik:** referencja potwierdza zasadę otwartego modułu, nieruchomych serw i prostych drucianych cięgien. Nie dostarcza jednak odczytanych wymiarów podparcia ani zakresów gałki. Nie ma podstaw do orzeczenia, że jej podparcie nie wystarczy dla Ø60, ani do dodania w zamian metalowego kardana. Nasze dwie niezależne powieki są zmianą względem widocznego wzoru i wymagają osobnego sprawdzenia geometrii.

## Materiał i granice analizy

- **[F]** Przeczytano brief, PRD, pomiary E6, dokumenty agendy i decyzji oraz `10-inspiracje/mechanizmy-oka-zrodla.md`. Nie otwierano modeli v1–v9, koncepcji dużego oka w `20-analizy/` ani raportów pozostałych analityków. Informacje o starych rozwiązaniach zawarte w PRD nie są dowodem dotyczącym referencji.
- **[F]** Odczytano opis PCBWay i obejrzano zdjęcia Z1–Z4 poniżej. Zdjęcia wyświetlono wyłącznie w pamięci; nie zapisano ich do plików. Nie pobierano załączników STL, kodu, schematu, BOM ani Gerberów.
- **[F]** Film wskazany przez stronę, [YouTube H712Cc5Ca94](https://www.youtube.com/watch?v=H712Cc5Ca94), nie otworzył się w narzędziu odczytu: osadzenie zwróciło `Online fetch throttled`, strona filmu `Error fetching`. Nie obejrzano filmu; raport nie przypisuje mu żadnych minut ani obserwacji ruchu.
- **[F]** Zdjęcia montażowe mają szerokość 600 px. Rozróżniają układ części i działania dłoni, ale nie pozwalają wiarygodnie zmierzyć otworów, luzów, gwintów ani średnicy gałki.
- **[Z]** Wszystkie proponowane wymiary, schematy i przebieg adaptacji poniżej są warunkami do oceny, nie zatwierdzonym projektem ani instrukcją gotowego modelu.

### Źródła i numeracja zdjęć

| Oznaczenie | Źródło / sposób wskazywania miejsca |
|---|---|
| S | [PCBWay: Face With Animatronic Eyes, Motion Detection and Voice](https://www.pcbway.com/project/shareproject/The_Face_maker101_c4124445.html); sekcje `Step 1`–`Step 6`, `Code`, `Schematic and Layout`, `CAD-Custom parts and enclosures` |
| Z1 | [Zdjęcie w Step 1 — części](https://pcbwayfile.s3.us-west-2.amazonaws.com/project/24/09/30/2041515117168.png): duży panel z maską; prawy górny z zestawem części; prawy dolny z gałkami i powiekami |
| Z2 | [Pierwsze zdjęcie w Step 2 — zespół](https://pcbwayfile.s3.us-west-2.amazonaws.com/project/24/09/30/2044393288413.png): duży panel z modułem; po prawej spinacze, serwa i detal mocowania |
| Z3 | [Drugie zdjęcie w Step 2 — montaż](https://pcbwayfile.s3.us-west-2.amazonaws.com/project/24/09/30/2045331334555.png): dziewięć pól numerowanych **1–9**, od lewego górnego, wierszami |
| Z4 | [Drugie zdjęcie w Step 6 — osadzanie w masce](https://pcbwayfile.s3.us-west-2.amazonaws.com/project/24/09/30/2100110176625.png): sześć pól numerowanych **1–6**, wierszami |
| P | [`30-projekt/PRD.md`](../30-projekt/PRD.md), §4, §7–§9 |
| M | [`30-projekt/e6-pomiary.md`](../30-projekt/e6-pomiary.md), pierwsza tabela pomiarów; późniejsze hipotetyczne dane przegubów kulowych nie są stanem wyposażenia |

**Oznaczenia:** **[F]** — odczytany fakt, również fakt braku danej w dostępnym materiale; **[Z]** — założenie, interpretacja lub propozycja. Wyniki rachunków opisano jako obliczenia warunkowe, z podanymi założeniami.

## 1. Fakty z referencji

| Temat | Ustalenie | Źródło i ograniczenie |
|---|---|---|
| Drukowane części | **[F]** Maska, 2 gałki, 2 powieki, wspólny uchwyt, elementy przegubów, 2 belki, tył. | Z1, prawy górny panel; nazwy plików w S. |
| Serwa | **[F]** 5 MG90S: po 2 na oko, 1 na powieki. | S, Step 2. Kafelek `Components` błędnie upraszcza ilość do ×1. |
| Druty | **[F]** Cięgna ze spinaczy; końcówki gięte szczypcami. | Z2, prawy górny panel; Z3/2, 4. |
| Śruby | **[F]** Widoczne łby przy bocznych podporach powiek i przy orczykach; rozmiary i pełna liczba nieczytelne. | Z2; Z3/7–8. Nie ma podstaw do przypisania M2/M3 ani rodzaju nakrętek. |
| Elektronika kupna | **[F]** Nano, DFPlayer, PIR HC-SR505, głośnik, PCB, złącza i elementy bierne. | S, Components i Step 4. Nie są potrzebne do odtworzenia samej mechaniki. |
| Średnica gałki | **[F]** Nieustalona. | S nie podaje wymiaru; Z1 nie ma skali pomiarowej. |
| Podparcie gałki | **[F]** Widać tylne mocowanie gałki i elementy przegubu na wsporniku płyty. | Z3/1, 3, 5; połączenie jest częściowo zasłonięte. |
| Liczba przegubów podparcia | **[Z]** Odczyt układu: jeden zespół przegubu uniwersalnego na gałkę, z dwoma obrotami. | Z1, Z3/1, 3; S nazywa części `Universal Joint`. Nie potwierdzono przekroju, liczby sworzni ani ich położenia względem środka kuli. |
| Serwa wobec gałki | **[F]** Korpusy stoją na wspólnej nieruchomej płycie, za oczami; położenia serw nie są jednakowe. | Z2, duży panel; Z3/5–6. To nie jest serwo niesione przez drugie serwo. |
| Końce cięgien | **[F]** Druty dochodzą do perforowanych orczyków i zaczepów mechanizmu przy gałkach. **[Z]** Zagięta końcówka przełożona przez otwór jest prawdopodobna. | Z2; Z3/2–6. Nie rozstrzygnięto: pełne oczko, zagięcie Z, zabezpieczenie przed wysunięciem, swoboda poza płaszczyzną. |
| Dodatkowe kardany na cięgnach | **[F]** Na obejrzanych zdjęciach nie rozpoznano metalowych kardanów przy końcach prętów. | Z2, Z3. Brak rozpoznania nie jest dowodem dokładnej budowy wszystkich zasłoniętych połączeń. |
| Powieki | **[F]** Dwie osobne czasze, po jednej na oko, z bocznymi ramionami/podparciem. | Z1, prawy dolny panel; Z3/7–9. Nie widać pary górna–dolna na jednym oku. |
| Podparcie powiek | **[F]** Boczne punkty mocowania pozostają dostępne od zewnątrz modułu. | Z3/7 pokazuje wkrętak dochodzący z boku; Z3/8 manipulowanie przy powiece. Dokładna budowa osi nieczytelna. |
| Mocowanie całości | **[F]** Płyta mechanizmu spoczywa na belkach wewnątrz maski; autor podaje klej na gorąco. | Z4/2–3, S Step 6. |
| Kolejność według autora | **[F]** Centrowanie → serwa → gałki/cięgna → powieki → test → belki i osadzenie w masce. | S, Step 2–3 i Step 6; zdjęcia Z3 potwierdzają montaż na otwartym stole. |
| Kąty ruchu | **[F]** Nieustalone dla gałek i powiek. | Dostępny opis nie daje wartości, zdjęcia nie są pomiarem zakresu, film niedostępny. Pozycja serwa 90° oznacza środek montażowy, nie wychylenie oka. |

### Pliki wymienione na stronie — bez pobrania

**[F]** Lista widoczna w sekcjach załączników S:

| Rodzaj | Nazwy |
|---|---|
| STL, przeguby | `joint_v1.stl`, `center-joint_v1.stl` |
| STL, oko i uchwyt | `eyeball.stl`, `eyelid.stl`, `eye_holder_main.stl` |
| STL, obudowa | `face_main.stl`, `bars_v1.stl`, `backside.stl` |
| Kod | `servo_motor_code.ino`, `the_face_code.ino` |
| Schemat | `Schematic_Nano_DFPlayer_PIR_Servo_Board_2024-09-16.png` |
| BOM jako obraz | `Ekran Resmi 2024-09-16 13.33.59.png` |
| Dźwięk | `1.mp3` |
| Pozostałe | Przyciski Gerber i BOM; bez ustalonej nazwy archiwum. |

Nie sprawdzono zawartości ani poprawności plików. Dwie nazwy STL przegubu nie oznaczają dwóch dodatkowych przegubów na każdym cięgnie.

### Co jest proste i dlaczego może działać

**[Z — interpretacja zdjęć Z2–Z3]** Prostota wynika przede wszystkim z dostępu: najpierw montuje się mechanizm na odsłoniętej płycie, a dopiero potem wkłada do obudowy. Pręty nie muszą przechodzić przez tunele, a powieki można przykręcić z boku. Nieruchome korpusy serw nie zwiększają masy poruszanej przez gałkę. Podparcie ustala położenie oka, a cięgna przekazują ruch.

**[Z]** Zagięty drut może zapewniać potrzebną zmianę kierunku przez luz w otworze i podatność. Ze zdjęć nie wynika, ile ruchu daje każda z tych cech. Zamiana takiego połączenia na ciasną oś śrubową nie jest neutralnym „ulepszeniem”: może odebrać swobodę przestrzenną i zablokować mechanizm.

## 2. Adaptacja — układ warunkowy, bez nowych przegubów

### Czy podparcie referencji wystarczy przy Ø60?

**[F]** Brakuje średnicy oryginalnej gałki, przekrojów przegubu, rozstawu osi, masy wydruku i geometrii zaczepów. Nie da się policzyć współczynnika powiększenia ani nośności. Dla podobnych brył masa rośnie jak skala³, a dla cienkiej czaszy o stałej grubości — w przybliżeniu jak skala²; nie znamy nawet tej skali.

**[Z]** Punktem wyjścia pozostaje podparcie z referencji. **Nie proponuję metalowego kardana jako części bazowej**, ponieważ nie wykazano niewystarczalności oryginału. To nie jest zatwierdzenie jego wytrzymałości. Zamiana wymagałaby konkretnego dowodu: blokowania ruchu, kolizji albo niedostatecznej sztywności odtworzonego podparcia.

**[F — M]** Posiadany kardan 5/5 ma długość 25,5 ±0,2 mm, Ø11 i otwory Ø5 o głębokości 7 mm. Sam walec Ø11 × 25,5 zmieściłby się w kuli Ø60, ale nie dowodzi to zmieszczenia z trzpieniami, zaciskami, podpórką i drogą imbusa. Pozostaje niewybranym wariantem, nie uzasadnieniem jego użycia. Kardany 2/2 przy cięgnach nie trafiają do tej adaptacji.

### Lista części adaptacji

Poniższy wykaz rozdziela wymagania od nieustalonych szczegółów; nie jest zamkniętym BOM do druku.

| Część | Ilość / status | Podstawa i warunek |
|---|---|---|
| Biała gałka Ø60 | 1, wymaganie | **[F — P §4]**; sposób połączenia z podparciem do odtworzenia z referencji. |
| Podparcie gałki | 1 zespół, liczba wydruków i sworzni nieustalona | **[Z]** Zachować zasadę referencji; bez dodawania przegubów na końcach cięgien. |
| Otwarta płyta z mocowaniem serw | 1, propozycja | **[Z]** Układ wynikający z Z2–Z3, dostosowany do jednego oka i 4 serw; bez osobnych zamkniętych ramek. |
| MG90S + fabryczne orczyki | 4 zestawy | **[F — P §4 i §7]**: X, Y, góra i dół powiek. |
| Cięgna druciane | 4, propozycja | **[Z]** Po jednym na każdą funkcję; końcówki jak w referencji dopiero po rozpoznaniu ich geometrii. |
| Powieka górna i dolna | 2, wymaganie | **[F — P §4]**; punkty podparcia i wzajemne odsunięcie nieustalone. Nie dodano tulejek, krzyżaków ani łożysk. |
| Przedłużenia orczyków powiek 25 mm | 2, zapisane w PRD | **[F — P §4]**; są odstępstwem od odczytanego wzoru, a ich zamocowanie wymaga uzgodnienia. |
| Tuba/kołnierz z łapami oraz maskownica | Funkcje wymagane; liczba oddzielnych wydruków nieustalona | **[F — P §4]**. Nie projektuję dodatkowej kasety ani nakrętki. |
| Śruby i nakrętki | Liczba i długości nieustalone | **[F — P §7]** dostępne M3/M4/M5, 8–50 mm. Trzeba rozpoznać rzeczywiste osie referencji; nie wolno automatycznie zastąpić wszystkich trzpieni śrubami M3. |
| Wkręty do drewna do mocowania w dyni | Średnica 4 mm, długość 30–40 mm; liczba nieustalona | **[F — P §4]**. Zapis `4 × 30–40` odczytuję jako rozmiar wkrętu, nie potwierdzenie czterech sztuk. |

**[F — P §7]** Są druty sprężynowe Ø1,0/1,2 i ocynkowany Ø2,0. **[F — M]** Otwory orczyka opisano jako około Ø1, a największy promień zaczepienia jako 17,5 ±0,3 mm. **[Z]** Ø1,0 jest pierwszym kandydatem do połączenia bez rozwiercania, ale nie potwierdzonym pasowaniem. Ø2,0 nie przejdzie przez otwór Ø1. Dla tej samej stali i długości sztywność na zginanie rośnie jak d⁴: drut Ø2 ma 16 razy większą sztywność niż Ø1; nie zastępuje więc zachowania spinacza tylko przez zmianę średnicy otworu.

### Schemat funkcjonalny — nie rysunek wymiarowy

**[Z]** Pozycje serw są umowne. `J?` oznacza podparcie z referencji, którego dokładnego położenia względem środka gałki nie potwierdzono. Cięgna pokazano osobno dla czytelności; ich skrzyżowania w rzucie nie oznaczają kontaktu.

```text
BOK: przód / na zewnątrz                         tył / wnętrze dyni

        ścianka i tuba       otwarty dostęp przy montażu na stole
              ||
           .--||--. powieka górna --- cięgno G -------- [SG]
          /   ||   \
         ( gałka Ø60 ) -- J? -- wspornik na otwartej płycie
          \   ||   /  \---- cięgno Y ----------------- [SY]
           '--||--' powieka dolna --- cięgno D -------- [SD]
              ||       cięgno X i SX: poza tym przekrojem
          maskownica

TYŁ: rozkład funkcji, patrzymy od serw ku gałce

                         [SG]
                           | G
                o----- powieka G -----o
          [SX] -- X -- (gałka / J?) -- Y -- [SY]
                o----- powieka D -----o
                           | D
                         [SD]

        o = boczne punkty podparcia powiek, układ do ustalenia
        serwa na wspólnej otwartej płycie; dojście z boków i tyłu
```

**[Z]** Rysunek nie rozstrzyga, czy powieki współdzielą sworznie. Dodanie drugiej czaszy nie daje automatycznie miejsca na drugą oś, jej mocowanie i palce. Do czasu rozstrzygnięcia tego punktu schemat nie stanowi dowodu montowalności.

### Montaż rękami — proponowana kolejność i wymagane dojścia

Wszystkie kroki poniżej są **[Z]**. Zachowują zasadę montażu na stole widoczną na Z3, ale nie udają instrukcji odtworzonego modelu.

| Krok | Czynność | Dostęp palców i narzędzia / warunek przyjęcia |
|---|---|---|
| 1 | Ustawić i oznaczyć środki 4 serw przed sprzęgnięciem. | Serwa osobno na stole; wkręt środka orczyka dostępny osiowo. Brak mechanicznego wymuszania pozycji. |
| 2 | Przygotować zakończenia drutów, połączyć z luźnymi orczykami i zaczepami gałki/powiek. | Obie strony każdego otworu odsłonięte, szczypce z boku. Nie zaginać końcówki wewnątrz tuby. Dokładne zakończenie pozostaje do rozpoznania. |
| 3 | Złożyć podparcie i gałkę na odsłoniętej płycie. | Palce podtrzymują część, druga ręka ma prosty dostęp do osi/sworzni. Jeśli połączenie wymaga śruby, dostęp do nakrętki musi być otwarty. |
| 4 | Osadzić serwa X/Y i połączyć orczyki. | Korpus ma być wkładany od otwartej strony; droga kabla i wtyczki wolna. Wkrętak dochodzi po osi wkrętu orczyka. Kolejność serwo–orczyk ustalić tak, aby żaden wkręt nie znalazł się za gałką. |
| 5 | Sprawdzić X/Y bez powiek. | Otwarty dostęp do cięgien; sprawdzenie pojedynczych osi i narożników. Konieczność wyginania drutu przez sąsiednią część oznacza brak poprawnego rozwiązania. |
| 6 | Dołożyć dolną, potem górną powiekę oraz ich napędy. | Dostęp osiowy z obu boków jak na Z3/7; nakrętki przytrzymywane z otwartej strony. Kolejność warunkowa: druga powieka nie może odciąć dostępu do pierwszej ani wymagać przeciskania jej przez wąską szczelinę. |
| 7 | Sprawdzić ruch i dopiero połączyć moduł z mocowaniem do dyni. | Narzędzie od tyłu lub z boku, po prostej; żadnego zakładania nakrętki za zamkniętą tubą. Sposób połączenia płyty i mocowania jeszcze nieustalony. |
| 8 | Wprowadzić gotowy moduł od wnętrza dyni; zamocować łapy i maskownicę. | Przez Ø80 przechodzi tylko część frontowa. Serwa pozostają wewnątrz; potrzeba wolnej drogi całego modułu przez otwarcie dyni i prostego dojścia do wkrętów łap. Tych wymiarów nie ma w wejściu. |

**[Z — kryterium, nie wynik pomiaru]** Dla miejsc manipulowania przyjmuję do sprawdzenia obwiednię palca Ø20 mm oraz prostą drogę trzpienia wkrętaka Ø6 mm, z rękojeścią poza mechanizmem. To wartości robocze, nie pomiar dłoni i narzędzia użytkownika. Miejsce przytrzymania nakrętki wymaga miejsca także na drugą rękę lub klucz. Żadne z tych dojść nie zostało wykazane na modelu.

**[F — zasady projektu]** Drobny luz roboczy przegubu nie zastępuje dostępu montażowego: ślizg 0,25–0,3 mm/stronę, obrót na osi 0,2 mm promieniowo i 0,2–0,3 mm osiowo, ruchome części ≥0,5 mm od siebie nominalnie i ≥0,2 mm po uwzględnieniu luzów. **[Z]** Montaż przewidziany jako przesuwanie serwa obok sąsiada ze szczeliną około 1 mm należy odrzucić, nawet jeśli sam ruch później spełnia tę tabelę.

## 3. Różnice wobec referencji i pytania do użytkownika

Wymagania Ø60, 4 MG90S i dwóch niezależnych powiek są już zadane — nie proszę o ponowne zatwierdzenie ich funkcji. Pytania dotyczą sposobu wykonania różnic. **Żaden nierozstrzygnięty dodatek z tej tabeli nie jest zatwierdzony do CAD.**

| Różnica | Dlaczego / inne możliwości | Pytanie do użytkownika przed realizacją |
|---|---|---|
| Jedno oko Ø60 zamiast modułu dwuocznego o nieustalonej średnicy | Wymaganie P; nieznana skala uniemożliwia zwykłe powiększenie wszystkich części. | Czy przyjmujesz odtworzenie jednej gałki i jej podparcia w nowym rozmiarze, z zachowaniem zasady połączeń referencji? |
| Płyta dla 4 serw jednego oka | Wzór mieści 5 serw dwóch oczu; kopiowanie całej płyty nie daje naszego układu. Alternatywą jest inny rozkład na tej samej otwartej zasadzie, nie dodatkowe ramki. | Czy przyjmujesz jedną otwartą płytę dopasowaną do czterech MG90S, po pokazaniu dróg wkładania i wkrętaka? |
| Druga powieka na tym samym oku | Nowa czasza, drugie cięgno i podparcie. Wspólne osie albo osobne osie mają różne kolizje i dostęp; nie wybrano wariantu. | Który z pokazanych później wariantów podparcia dwóch czasz akceptujesz, po policzeniu dodatkowych części i śrub? |
| Niezależny napęd obu powiek | Wymaganie już ustalone; mechanicznie dodatkowy napęd względem pojedynczej powieki wzoru. | Czy przyjmujesz bezpośrednie cięgno każdej powieki do jej serwa, bez dodatkowego mechanizmu pośredniego? |
| Dwa przedłużenia orczyków 25 mm i zaczepy około R34 | Wpisane w P, niepotwierdzone w referencji. Alternatywa: fabryczne orczyki z innym zaczepem, jeśli spełnią otwarcie; bez automatycznej zmiany PRD. | Czy zachowujemy przedłużenia z PRD, a sposób ich mocowania oceniamy jako jawny dodatek do referencji? |
| Posiadany drut zamiast spinaczy o nieznanej średnicy | Ø1,0 daje największą szansę użycia obecnych otworów; Ø1,2/2,0 oznacza zmianę otworów i sztywności. | Czy przyjmujesz najpierw wariant z posiadanym Ø1,0 i zakończeniem jak we wzorze, bez dodatkowych przegubów? |
| Śruby z warsztatu zamiast nieustalonych osi i śrub wzoru | Każda zmiana średnicy może wymagać nowych uszu lub miejsca na nakrętkę. Alternatywa: odtworzenie pierwotnego połączenia po rozpoznaniu szczegółu. | Czy akceptujesz dopiero konkretny wykaz zamian z ilością, rozmiarem i szkicem dostępu, bez dopisywania śrub „na zapas”? |
| Mocowanie w dyni zamiast maski i belek | Tuba, łapy i maskownica wynikają z P. Połączenie ich z płytą może być klejone lub skręcane; liczby łączników nie ustalono. | Który pokazany sposób połączenia płyty z wymaganym mocowaniem akceptujesz, z ujawnieniem każdej dodatkowej części i śruby? |
| Metalowy kardan 5/5 w środku gałki | **Nie wybrano:** brak dowodu niewystarczalności podparcia referencji. Alternatywa podstawowa: jego zachowanie. | Tylko jeśli próba wykaże problem: czy dopuszczasz zamianę na 5/5 wraz z pokazanymi trzpieniami i mocowaniem? |

**[Z]** Odczytuję „jedyną dozwoloną modyfikację” z briefu jako zakaz dodatkowego komplikowania mechanizmu poza adaptacją rozmiaru i funkcjami wprost zadanymi. Literalne zachowanie liczby powiek i mocowania maski byłoby sprzeczne z tymi wymaganiami. Dlatego konieczne odstępstwa są jawne; nie przedstawiam ich jako kopii 1:1.

## 4. Zakres ruchu wobec PRD

### Co wiadomo, a czego nie można podać

| Parametr | PRD | Referencja | Adaptacja |
|---|---|---|---|
| Lewo–prawo | Cel ±35°, minimum ±30° | Brak pomiaru | Niepotwierdzony; warunkowy rachunek niżej |
| Góra–dół | Cel ±25°, minimum ±20° | Brak pomiaru | Niepotwierdzony; warunkowy rachunek niżej |
| Narożniki | Mogą mieć mniejszy zakres | Brak pomiaru | Wymagają kontroli obu cięgien i obu powiek jednocześnie |
| Powieki | Pełne zamknięcie i odsłonięcie źrenicy | Nieustalone kąty; pojedyncza czasza na oko | Dwie czasze zmieniają obwiednię i montaż; 51,5° z P nie jest pomiarem referencji |

Nie ma podstaw do stwierdzenia „referencja daje mniej” ani do wpisania jej dowolnego zakresu. Jeśli adaptacja osiągnie np. ±25°/±15°, zabraknie 5° na każdą stronę obu osi do minimum; **to przykład warunku decyzji, nie wynik analizy wzoru**. Wybór mniejszego ruchu albo dodatku wraca do użytkownika.

### Obliczenie warunkowe skoku cięgien

**[Z]** Przyjmuję wyłącznie do rachunku promień zaczepienia na gałce `r = 20 mm`, fabryczny orczyk `h = 17,5 mm` z M oraz takie kierunki cięgien, aby w środku ruchu działały stycznie. Przybliżenie płaskie: połowa skoku `s = r·sin(α)`, wymagany kąt orczyka `β ≈ asin(s/h)`. Nie jest to rozwiązanie przestrzennego mechanizmu.

| Ruch oka | Połowa skoku s | Pełny skok | Przybliżone wychylenie serwa β |
|---|---:|---:|---:|
| X, cel ±35° | 11,47 mm | 22,94 mm | ±40,96° |
| X, minimum ±30° | 10,00 mm | 20,00 mm | ±34,85° |
| Y, cel ±25° | 8,45 mm | 16,90 mm | ±28,88° |
| Y, minimum ±20° | 6,84 mm | 13,68 mm | ±23,01° |

**[Z — wniosek rachunkowy]** Sam skok orczyka nie wskazuje konieczności dodatkowego przegubu czy przedłużenia dla X/Y. Nie potwierdza jednak osiągnięcia tych kątów: nie znamy długości drutów, położeń osi serw, kierunków otworów ani kolizji. Punkt zaczepienia opisuje łuk, nie prostą: dla r20 przy 35° zmiana drugiej współrzędnej wynosi `20·(1−cos35°) = 3,62 mm`, a przy 25° — 1,87 mm. Muszą ją przyjąć rzeczywiste końcówki i geometria cięgna, nie naprężenie mechanizmu. W narożnikach dochodzi ruch przestrzenny.

### Otwór Ø80 i położenie podparcia

**[F — P]** Gałka ma Ø60, otwór najwyżej Ø80, rant najwyżej 2 mm na stronę: dla otworu Ø80 maksymalny zewnętrzny obrys maskownicy wynosi Ø84.

**[Z — rachunek geometryczny]** Kula obracana dokładnie wokół środka nie powiększa swojej obwiedni. W otworze Ø80 pozostaje nominalnie 10 mm promieniowo względem samej kuli; tuba, powieki i luzy zużywają ten budżet. To nie jest 10 mm wolnego miejsca na każdy z tych elementów osobno.

**[Z]** Dla osi obrotu odsuniętej wzdłuż kierunku patrzenia o `e` środek gałki przesuwa się poprzecznie o `e·sinα`. Konserwatywnie mieszcząc rzut całej kuli w obrysie Ø79,5, bez powiek i ścianki, otrzymujemy `e·sin35° + 30 ≤ 39,75`, czyli **e ≤ 17,00 mm**. Dla e = 30 mm sam boczny przesuw przy 35° wynosi 17,21 mm — więcej niż dostępne 9,75 mm. Odsunięta oś może więc ograniczać układ, lecz nie zmierzono e w referencji. Ten warunek nie jest dowodem konieczności metalowego kardana; zależy także od tego, jaka część kuli rzeczywiście przecina tunel i gdzie leżą powieki.

### Powieki i widoczność źrenicy

**[Z]** Przyjmuję do oceny źrenicę Ø12 na gałce R30, do akceptacji użytkownika. Jej promień kątowy wynosi około `asin(6/30) = 11,54°`. Przy spojrzeniu pionowym ±25° skraj źrenicy sięga około ±36,54° od kierunku na wprost. Otwarta krawędź powieki musi odsłonić także ten skraj, nie tylko środek źrenicy. Dla poziomu ±35° analogiczny skraj sięga 46,54°; boczne ramiona i tuba też nie mogą go zasłaniać.

**[Z — rachunek geometryczny]** Zaczep powieki R34 przy obrocie o 51,5° przemieszcza się między końcami łuku o cięciwę `2·34·sin(51,5°/2) = 29,54 mm`. Koniec orczyka R25 może zakreślić cięciwę najwyżej 50 mm, więc sama wielkość przemieszczenia nie wyklucza takiego napędu. Nie potwierdza też jego działania: ruch obu punktów łączy cięgno o stałej długości. Potrzebne są położenia obu osi, długość cięgna i oba skrajne położenia czaszy; sam stosunek 25/34 nie dowodzi otwarcia ani braku martwego położenia.

## 5. Werdykt

**Warunkowa adaptacja jest prostsza od v9 opisanego w briefie przez brak kardanów na cięgnach i zamkniętych ramek serw, lecz na dostępnych dowodach nie można jeszcze potwierdzić ani jej złożenia rękami, ani osiągnięcia zakresów PRD.**
