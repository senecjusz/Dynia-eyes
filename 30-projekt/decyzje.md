# Dziennik decyzji

| Data | Decyzja | Dlaczego |
|---|---|---|
| 2026-10-17 | Sterowanie: Arduino Nano + PCA9685, serwa SG90 | Sprzęt już kupiony; PCA9685 obsłuży do 16 serw |
| 2026-10-17 | Dostęp agentów do GitHuba tylko przez deploy key tego repo | Ochrona pozostałych repozytoriów |
| 2026-10-17 | Dynia prawdziwa | Projekt na 1–2 tygodnie, wilgoć akceptowalna |
| 2026-10-17 | Małe oczy bez powiek – 1 serwo na oko | Najprostszy mechanizm, pewny do zrobienia z synem |
| 2026-10-17 | Punkt wyjścia: moduł-rurka (68percentwater), mocowanie gwintem | Mały otwór w dyni, montaż bez narzędzi przez syna |
| 2026-10-17 | Poziomy = złożoność, nie mechanizm; duże oko w podpoziomach 2a/2b/2c | Każdy krok daje działające oko; mechanizm dobieramy w analizach |
| 2026-10-17 | Moduł oka wpinany bagnetem w gniazdo osadzone w dyni; mocowanie gniazda do ustalenia | Montaż modułu bez narzędzi, wymuszona pionowa oś oka |
| 2026-10-17 | Mocowanie małego oka: gniazdo z rantem + nakrętka (rodzic), moduł na bagnet (syn); wymiary rantu i napędu zaktualizowane w v1.1 (patrz niżej) | Najbezpieczniejsze; dziecko robi tylko prostą, nie do pomylenia czynność |
| 2026-10-17 | Drukowany klucz nasadowy do nakrętki gniazda, pod grzechotkę 3/8" | Syn może sam dokręcić gniazdo; jeden klucz do wszystkich oczu |
| 2026-10-17 | Model oka F v1 w Onshape (SimpleEye) ze zwykłych operacji + zmienne `#…`, wszystkie części w jednym Part Studio w pozycji złożonej | Użytkownik może sam edytować drzewo; jedno miejsce do sprawdzania kolizji i luzów |
| 2026-10-17 | Gwint gniazda/nakrętki: trapezowy, prawy, skok 3 mm, luz 0,3 mm, od 14 do 45 mm pod powierzchnią | Docisk ścianki 15–35 mm; prawy = dokręcanie „normalnie” patrząc od środka dyni |
| 2026-10-17 | Bagnet: 3 zaczepy w gnieździe na 0°/150°/210° (nierówno = jedna pozycja), obrót 30°, garb zatrzasku 0,6 mm | Moduł wchodzi tylko pionowo; klik potwierdza zamknięcie |
| 2026-10-17 | Napęd oka: SG90 leżący w tulei za jarzmem (wałek pionowo), cięgno korba 20 mm ↔ orczyk 14 mm, piłeczka na 2 czopach + kolec z tyłu | Wszystko mieści się w tulei Ø53,3; ruch oka ±30–40° bez kolizji |
| 2026-10-17 | Środek piłeczki 5 mm pod powierzchnią dyni; piłeczka wystaje ~13 mm ponad rant | Czopy muszą zmieścić się w tulei przed rantem; do oceny na wydruku |
| 2026-10-17 | Pudełko z elektroniką i powerbankiem w środku dyni (pionowa wieża); powerbank na podstawce = opcja | Minimum bez dodatkowych konstrukcji; wyprowadzenie na zewnątrz tylko gdy starczy czasu |
| 2026-10-17 | Plan: minimum (4–8 małych oczu) do 25.10, rozszerzenia niezależne; duże oko raczej na przyszły rok | 2 weekendy do Halloween; nic opcjonalnego nie może blokować minimum |
| 2026-10-17 | Połączenia i osie na śruby M3/M4; piłeczka na śrubach-osiach przez bieguny (P1) | Śruby są w warsztacie; pewniejsze niż drukowane czopy i klej |
| 2026-10-18 | Kontroler: Arduino Nano; zapas: ESP32 / Raspberry Pi (gdyby zabrakło pamięci), w warsztacie też Uno i Mega | Tani, 5 V jak PCA9685 i PIR, mały pobór; syn nie programuje sam, więc micro:bit niepotrzebny |
| 2026-10-18 | Dynia będzie prezentowana w szkole: filtrowanie radaru, limit serw w ruchu, zapasowe moduły | Tłum dzieci = ciągły ruch i dotykanie |
| 2026-10-18 | Małe oczy zawsze chaotyczne, bez czujnika; na ruch reaguje tylko duże oko (zamknięte gdy nikogo nie ma, otwiera się po wykryciu PIR-em) | Najprostsze; minimum nie potrzebuje żadnego czujnika |
| 2026-10-18 | Śledzenie przez duże oko: radar LD2450 + ESP32 (otwarcie i kierunek z jednego czujnika; góra–dół z odległości) | Duże oko ma 2 osie, radar podaje kąt wprost; Nano nie obsłuży portu szeregowego radaru |
| 2026-10-18 | Duże oko próbujemy zrobić w tym roku, równolegle z małymi oczami (małe oczy = minimum) | Projekt w CAD jest szybki; użytkownik ocenia mechanizm jako prosty |
| 2026-10-18 | Firmware od początku na ESP32, z kalibracją serw przez stronę w telefonie (Wi-Fi, zapis w pamięci) | Kalibracja to największe ryzyko; radar LD2450 później bez migracji |
| 2026-10-18 | Zamówić radar HLK-LD2450 | Dostawa kilka dni; śledzenie przez duże oko to wtedy jeden wieczór |
| 2026-10-18 | Drukarki: X1C w Warszawie (wydruki próbne w tygodniu), A1 mini w Kobyłce (weekendy, małe części) | Logistyka między dwoma miejscami |
| 2026-10-18 | v1.1 małego oka: napęd korba 22 \/ cięgno 16 \/ drukowane ramię orczyka 22 mm, ±30° (start ±25°), piłeczka 39,5–40,5, rant Ø68×1,5; drukowana testowo bez poprawek z review | Usuwa martwy punkt z v1 (przy orczyku 13–14 mm blokada ~20°); poprawki review → v2 |
| 2026-10-18 | Zasada DFAM: każda część z płaską stroną na stół, nic nie wystaje poza nią | Jarzmo v1/v1.1 nie leżało płasko |
| 2026-10-18 | v2 modułu oka ze śrubami zlecona nowej sesji (brief 30-projekt/brief-v2-modul-oka.md) | Po review v1.1 |
| 2026-10-18 | v2 modułu oka w gałęzi „v2” dokumentu SimpleEye (wersje „v1.1” i „v2 do review”): Part Studio „Oko F v2”, Variable Studio „Zmienne v2”, Assembly „Oko F v2 - zlozenie” | v1 i v1.1 zostają nietknięte; jedno miejsce na historię |
| 2026-10-18 | Oś oka: 2 × M3×8 z niskim łbem (ISO 7380 / DIN 7984) wkręcone ciasno w występy tulei, łby w pogłębieniu; jarzmo i piłeczka luźno; luz osiowy 0,3 mm | Łeb DIN 912 nie mieści się w ściance tulei bez wystawania pod gniazdo |
| 2026-10-18 | Przeguby napędu: M3×8 od dołu, tulejka z kołnierzem (korba/ramię luźno 0,2 mm), wkładki M3 w cięgnie, śruba dokręcona do oporu | Pewny luz i brak odkręcania przy ruchu wahadłowym |
| 2026-10-18 | Napęd v2: korba 26 mm @16°, cięgno 15,15, ramię orczyka 25,5; wałek serwa 51 mm za osią oka; kąt przenoszenia ≥ 41° przy ±30° (także z luzami) | Przy łbach M3 i tulejkach wymiary v1.1 nie mieszczą się w tulei Ø48,5 |
| 2026-10-18 | Jarzmo: pierścień odchylony o 60° w bok, kołek Ø4 + siodło; ograniczniki ±33° (kołki na oczkach w łukowych rowkach występów tulei) | Miejsce na cięgno za piłeczką; wymuszony obrót ręką idzie na tuleję, nie na serwo; druga pozycja czworoboku niemożliwa |
| 2026-10-18 | SG90 wzdłuż osi, wałkiem do tyłu, wysunięty 7 mm pod tuleję za gniazdem; wsuwany od tyłu, przednie ucho na słupku tulei, tylne na pokrywie tylnej (odciążenie kabla kołkami) | Warstwa napędu na wysokości środka piłeczki daje najwięcej miejsca; moduł krótszy (72,6 mm) |
| 2026-10-18 | Gałka wystaje ~8 mm; gniazdo na ściankę 15–30 mm; rant i nakrętka (Ø72, bez skrzydełek) dopasowane do dyni R 150; gwint 45° z fazą początku; bagnet z językami (garb 0,6 mm) i znacznikami WSUŃ/ZAMKNIĘTE | Brief v2 (pkt 4, 5, 7, 8, 9) |
| 2026-10-18 | v2 bez bagnetu: gniazdo + tuleja = jedna Obudowa (montuje rodzic, syn wpina wtyczkę); piłeczka wklejona (CA) w drukowaną tylną Miskę zamiast jarzma C i wiercenia | Mniej części i mniejsza średnica (otwór ~Ø57 zamiast 64); moment rozłożony na tylną połowę piłeczki |
| 2026-10-18 | v2.1 w gałęzi „v2” (wersja „v2.1 do review”): Part Studio „Oko F v2.1”, Assembly „Oko F v2.1 - zlozenie”; „v2 do review” zostaje w historii | Poprawki po review v2 |
| 2026-10-18 | Obudowa jednoczęściowa: otwór w dyni Ø57, rant Ø63 z ząbkami, gwint 45° skok 3 na rurze Ø52,5, nakrętka Ø66 od środka; ścianka dyni 15–25 mm | Mniejsza średnica bez bagnetu; przegub H musi leżeć za gwintem, żeby go skręcić przy założonej nakrętce |
| 2026-10-18 | Miska = pas kulisty 8 mm (wnętrze Ø40,9, klej 0,2) z tyłu piłeczki w płaszczyźnie odchylonej o 60°, korba zrośnięta; przyrząd do wklejania ustawia źrenicę | Pełna półkula łamie DFAM (oczka poza płaską stroną) i zajmuje miejsce cięgna |
| 2026-10-18 | Wnętrze zostaje Ø48,5; napęd v2.1: korba 25,25 @17°, cięgno 17,21, ramię 27 @200°, wałek serwa 54 mm za osią oka; kąt przenoszenia ≥ 44° przy ±30° | W mniejszej rurze czworobok z łbami M3 i tulejkami nie mieści się (≤ ~30° kąta przenoszenia albo kolizje) |
| 2026-10-18 | Oś oka: 2 × M3×5 ISO 7380 (koniec 0,35 mm przed piłeczką); wybranie 0,6 mm w ściance na przegub H | Dłuższa śruba weszłaby w piłeczkę; przy −33° ramię i cięgno dotykały ścianki |
| 2026-10-18 | v2.1b: szczelina na klej 0,5 mm (klej wypełniający, akrylowy 2K); czasza przyrządu = piłeczka + 0,4 niezależnie od kleju; wersja „v2.1b do review” | Decyzja użytkownika; 0,2 mm za mało dla piłeczek 39,5–40,5 |
| 2026-10-18 | Assembly: wałek serwa z limitem −37…+30°, przegub C Revolute, H Ball | Bez limitu solver wpadał w drugą gałąź czworoboku (ramię 68°); Cylindrical w C pozwalał cięgnu się przechylać |
| 2026-10-18 | Luz gwintu drukowanego 0,5 mm (zamiast 0,3) i próbka gwintu przed drukiem obudowy | Nakrętka v1.1 po wydruku była za ciasna |
| 2026-10-18 | Cienkie elementy wymagające podpór niedopuszczalne; jarzmo/miska ze ściankami ≥ 2–2,4 mm i płaską stroną na stół | Jarzmo v1.1 pękało przy zdejmowaniu podpór |
| 2026-10-18 | v2.1c (wersja „v2.1c do review”): jarzmo drukowane płaskim bokiem miski bez podpór; korba zrośnięta z miską na całej szerokości pasa; piasta C Ø10 jako kropla 45° (spłaszczona po stronie ściany); oczka 2,4 mm; pogłębienie łba osi 1,9 | Wydruk v1.1: jarzmo bez płaskiej strony pękało przy odrywaniu podpór; ścianka wokół tulejki była 1,2 mm |
| 2026-10-18 | `luzGwint` 0,5 i osobne części „Probka gwintu” (pierścień 14 mm + kawałek nakrętki) drukowane przed obudową | Nakrętka v1.1 z luzem 0,3 była po wydruku za ciasna |
| 2026-10-18 | Kabel SG90: taśma prosto do tyłu z dołu krótszego boku od strony wałka; pokrywa z otworem w kształcie dziurki od klucza (9 × 3,4 na wtyczkę 3-pin, szczelina 1,2 zaciska taśmę) i prowadnicami zamiast kołków | Kabel wychodzi przy wałku; wtyczka musi przejść przy założonej pokrywie |
| 2026-10-18 | Otwór małego oka pod stałą otwornicę Ø56 mm (część w otworze Ø~55,6) | Otwornica 57 niedostępna; stała daje równiejszy otwór niż nastawna |
| 2026-10-18 | v2.1d: otwór w dyni pod stałą otwornicę Ø56; część obudowy w otworze Ø55,6 (luz 0,2/str.), gwint Ø54,9 (0,55/str.), rant Ø63 bez zmian; serwo i pokrywa montowane od środka dyni po założeniu obudowy | Otwornicy Ø57 nie ma; serwo i występ pokrywy wystają poza Ø56 |
| 2026-10-18 | v2.2: gniazdo w dyni + kaseta (kompletny moduł skręcony na stole) wsuwana osiowo, z żebrem (pozycja GÓRA) i 2 sprężystymi zaczepami; otwór Ø62 | W dyni nic się nie skręca (v2.1d nie dało się złożyć); syn wkłada moduł sam |
| 2026-10-18 | Zakres pracy oka ±30°, ograniczniki ±33° jako stop | Przy ±33° napęd na granicy (review v2.1d) |
| 2026-10-18 | Gwint: luz 0,3 przy flankach 45° i głębszy zarys (~1,6–1,8 mm) | Próbka v2.1 (luz 0,5) za luźna: ~1,3 mm luzu |
| 2026-10-18 | CAD zostaje w Onshape. Fusion 360 odpada (tylko Windows). SolidCraft (open source, klon Fusion z MCP, Win+Linux) – wrócić, gdy projekt się ustabilizuje | Praca na dwóch komputerach (Windows + Linux); SolidCraft v0.14 jest jeszcze za młody |
