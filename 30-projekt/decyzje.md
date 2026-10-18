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
