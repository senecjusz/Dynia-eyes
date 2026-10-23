# E7.1: burza mózgów – co ma umieć strona dyni (Opus B, 22–23.10)

Uczestnik: **Opus B**, brief `30-projekt/brief-e7-strona-brainstorm.md`. Trzy tory prowadziło trzech niezależnych subagentów (T1 syn i koledzy, T2 choreografia i duże oko jako postać, T3 rodzic, wystawa, niezawodność, a do tego badanie Safari i ESP32-C3). Ja połączyłem duplikaty i ułożyłem Top 10. Pracowałem tylko do odczytu, zapisany jest wyłącznie ten plik.

**Oznaczenia:**
- **[F]** fakt (plik w repo albo link), **[R]** rachunek, **[Z]** założenie, niesprawdzone.
- ★ pomysł nieoczywisty.
- Wow i trudność w skali 1–5.
- „Serwa” to najwięcej serw w ruchu jednocześnie (limit 3–4). Duże oko to 3 serwa (X, Y, powieki).
- W kolumnie „Tor” jest źródło pomysłu; kilka torów oznacza duplikat połączony w jeden wiersz.

## 0. Pięć wniosków, które zmieniają listę funkcji

1. **Po http Safari na iPhonie nie da żyroskopu, mikrofonu, blokady wygaszania ekranu ani wibracji** [F, pkt 4]. Bez nich zostają zabawy na dotyk, dźwięk z telefonu i radar. Pomysły z przechylaniem telefonu i krzykiem do dyni trafiły do „później” (HTTPS z własnym CA) albo do odrzuconych.
2. **Oczy rozstawione po dyni prawie nie zbiegną się w jednym punkcie** [R, T2]. Przy rozstawie ≥ 125 mm na R150 [F: `30-projekt/plan-v2-modul-oka.md`] sąsiednie oczy mają kierunki bazowe różne o ok. 48°. Dziecko stoi 0,5 m przed dynią. Oko z azymutem 24° musi się obrócić o 31°, oko z azymutem 48° o 59°, a zakres wynosi ±25°. Naprawdę patrzy na dziecko 1–2 oczu, reszta może się tylko „wytężać” na +25°. Efekt „wszyscy na ciebie” wymaga **mapy oczu** (azymut każdego modułu), a i z nią będzie niepełny. Fizyczne kule nie mają efektu Mony Lisy [F: [Al Moubayed i in. 2012](https://www.lri.fr/~anab/teaching/evaluation/papers/AlMoubayed2012_MonaLisaEffect.pdf)]: oko odwrócone o 25° nie wygląda na patrzące na kogoś.
3. **Limit 3–4 serw zamieniamy w styl:** duże oko prowadzi, małe podążają parami z opóźnieniem. Wygląda to jak stado, a nie jak usterka (pomysł B1).
4. **Bezpieczeństwo bez kont:** obce dzieci w ogóle nie łączą się z Wi-Fi. Steruje tylko telefon syna, który może „pożyczyć” koledze tryb gościa. Na wystawie zabawy dla dzieci bez telefonu idą przez radar.
5. **Sprzeczność z decyzją:** `decyzje.md` z 18.10 mówi „Małe oczy zawsze chaotyczne, bez czujnika; na ruch reaguje tylko duże oko”. Pomysły B2, C1, C4 i C8 wiążą małe oczy z radarem. To przeczy tej decyzji, więc orkiestrator powinien zapytać użytkownika, czy ją zmienia. Ręczne sterowanie małymi oczami ze strony jej nie narusza.

**Zasada wspólna dla wszystkich pomysłów** (T1, T2 i T3 doszły do niej niezależnie): ruch liczy ESP, z jednej kolejki. Kolejka ma limit 3–4 serw, rampy (smoothstep), limit prędkości ok. 120°/s, limity kąta i rozsunięte starty. Strona wysyła tylko „co” (efekt, cel, kierunek), nigdy surowych µs. Dzięki temu żaden pomysł poniżej nie może szarpnąć serwem, a ryzyko w tabelach dotyczy tylko zużycia i prądu.

## 1. Lista pomysłów (po połączeniu duplikatów)

### A. Fundament sterowania (bez niego reszta jest ryzykiem)

| # | Nazwa | Co robi | Dla kogo | Wow | Trudn. | Sprzęt | Ryzyko mechanika / zasilanie | Tor |
|---|---|---|---|---|---|---|---|---|
| A1 | **Jedna kolejka ruchu w ESP** | Każda komenda (palec, efekt, pokaz, radar) idzie przez tę samą kolejkę z limitami: prędkość, 3–4 serwa naraz, starty co ≥ 50 ms (rozruch co 150 ms), limity kąta 2° przed ogranicznikiem. Szybkie machanie palcem nie dochodzi do przekładni | rodzic | 1 | 2 | nic | usuwa ryzyko szarpania | T1, T2, T3 |
| A2 | **Martwa ręka (heartbeat)** | Sterowanie ręczne działa, dopóki telefon co ok. 0,5 s wysyła sygnał. Po 1,5 s ciszy oko stoi, a po kilku sekundach płynnie wraca do pokazu. Safari zrywa WebSocket po zablokowaniu ekranu, często bez zdarzenia `close` [F, pkt 4] | wszyscy | 1 | 2 | nic | oko nie zostaje w skrajnym położeniu | T2, T3 |
| A3 | **Pokaz jako stan „domu”** | Dynia wraca do pokazu automatycznego po każdej sesji, restarcie, zerwaniu połączenia i końcu czasu gościa. Strona nie ma przycisku „wyłącz dynię” | dzieci | 3 | 1 | nic | brak | T3 |
| A4 | **Sterowanie palcem z fizyką** | Palec wyznacza cel dużego oka, małe oczy idą za nim jak stado (B1). Podwójne stuknięcie to mrugnięcie, drugi palec w pionie ustawia rozwarcie powiek | syn | 4 | 2 | nic | duże 3 + małe ≤ 1 | T1, T2 |

### B. Choreografia i duże oko jako postać

| # | Nazwa | Co robi | Dla kogo | Wow | Trudn. | Sprzęt | Ryzyko mechanika / zasilanie | Tor |
|---|---|---|---|---|---|---|---|---|
| B1 | ★ **Lider i stado** | Duże oko rusza pierwsze, a małe dochodzą parami po 150–400 ms, od najbliższych w kierunku spojrzenia. 10 oczu w 5 parach to ok. 1,3 s [R]. Limit serw zamienia się w opóźnienie reakcji stada | wszyscy | 4 | 2 | nic (mapa oczu poprawia kolejność) | najpierw 2, potem 2 małe; ≤ 4 | T2 (T1: fala stadionowa) |
| B2 | **Fala, karuzela, domino** | Spojrzenie obiega dynię według prawdziwego azymutu oczu, nie numeru kanału. Warianty: tam i z powrotem, od dziecka na zewnątrz, „domino” (oko spogląda ku sąsiadowi, sąsiad ku następnemu) | wszyscy | 4 | 2 | mapa oczu (bez niej według numerów) | 2 naraz | T1, T2 |
| B3 | ★ **Słownik emocji jednej powieki** | Emocje gra się rozwarciem 0–100%, tempem, rytmem mrugnięć, drżeniem powieki i „przyłapaniem” (opada, nagle się otwiera). Senny, zdziwiony, podejrzliwy, przestraszony, „kocie powolne mrugnięcie” jako gest przyjaźni. Sprzężenie górna 51° / dolna 27° sprawia, że przy połowie otwarcia górna powieka wygląda „ciężko”, co dobrze gra senność [R z koncepcji 2c, pkt 2.3] | syn, dzieci | 4 | 2 | nic | 1–3; drżenie tylko krótko | T2 |
| B4 | **Charakter dnia** | Syn wybiera osobowość na dzień: nieśmiała (oczy uciekają od najbliższej osoby), wścibska, śpiąca, podejrzliwa. To te same parametry silnika ruchu (fiksacje, prędkość, rozwarcie, reakcja na radar), tylko inne zestawy | syn wybiera, efekt dla dzieci | 4 | 2 | radar (bez niego uboższe) | brak | T1 |
| B5 | **Sakada z charakterem** | Przed dużą sakadą (> 15°) oko cofa się o 2–3°, przelatuje cel o 1,5–3° i wraca. Styl do wyboru: robot, człowiek, kreskówka | syn (porównanie), rodzic | 3 | 2 | nic | każde odwrócenie kierunku to skok prądu [Z]: tylko przy dużych ruchach, przelot obcinany przy ±25° | T2 |
| B6 | **Mrugnięcie przy dużej sakadzie** | Duże oko mruga przy zwrocie > 20°. U ludzi mrugnięcie towarzyszy 97% zwrotów wzroku > 33° [F: [Evinger i in. 1994](https://researchconnect.stonybrook.edu/en/publications/not-looking-while-leaping-the-linkage-of-blinking-and-saccadic-ga/)] | wszyscy (podświadomie) | 2 | 1 | nic | 3, małe czekają | T2 |
| B7 | **Żywe patrzenie: mikroruchy** | Podczas długiej fiksacji duże oko co 0,5–1,5 s drga o 1,5–2,5°. Bez tego robot gapi się „martwo” | wszyscy | 2 | 1 | nic | ruchy < 1,5° zawodne przez martwą strefę SG90 (niżej); więcej pracy przekładni | T2 |
| B8 | **Plotkarki** | Dwa sąsiednie małe oczy zerkają ku sobie, potem razem na gościa. Duże oko je „przyłapuje”, a one natychmiast patrzą na wprost. Scenka ok. 6 s | dzieci | 4 | 2 | nic | 2, potem 2 | T2 |
| B9 | **Oko-buntownik** | Przy każdym ruchu grupowym jedno małe oko, wybrane na cały dzień, patrzy w drugą stronę albo spóźnia się i nadrabia. Syn nadaje oczom imiona i wybiera buntownika | syn, dzieci | 4 | 1 | nic | jak ruch grupowy | T2 |
| B10 | **Zasypianie z przysypianiem, pobudka „jeszcze 5 minut”** | Powieka schodzi skokami, raz się jeszcze otwiera, małe oczy po kolei dryfują na środek. Pierwsze „obudź” uchyla oko i zamyka je z powrotem, dopiero drugie budzi dynię, a małe oczy budzą się jak strojenie orkiestry | syn | 4 | 2 | nic | 1–3, wolno | T2 |
| B11 | **Hipnoza i zez całej dyni** | Duże oko kreśli wolne kółko (0,3 Hz), lewa połowa małych oczu patrzy w prawo, prawa w lewo; telefon pokazuje spiralę i gra niski dźwięk | wszyscy | 3 | 1 | nic | 2 + 2, wolno | T1, T2 |
| B12 | **Choreografia syna (looper)** | Syn nagrywa do ok. 30 s palcem: najpierw duże oko, potem na tym samym czasie małe oczy, jak looper muzyczny. Przy 10 Hz to ok. 300 klatek po kilka bajtów, mieści się w RAM i NVS [R]. Nadaje nazwę („Taniec Antka”), a w trybie wystawy taniec leci co N minut. Przy dyni kartka „choreografia: syn”. Już przy nagrywaniu strona mówi „za dużo oczu naraz”, więc limit serw staje się częścią zabawy | syn i tata | 5 | 3 | nic | kontrola ≤ 4 przy nagrywaniu | T1, T2 |
| B13 | **Taniec do muzyki z telefonu** | Telefon gra melodię (Web Audio po http działa [Z]), a w takt idą gotowe ruchy: lewo–prawo na bit, mrugnięcie na akcent, fala na refren | wszyscy | 4 | 3 | głośnik BT do telefonu opcjonalnie | do ok. 2 ruchów/s na oko | T1 |
| B14 | **Kolekcja min i sekretne efekty** | Każda mina dużego oka to „karta”. Część jest zablokowana i odblokowuje się za wynik (rekord w Simonie, 10 pobudek z zasadzki) albo sekretną kombinację. Stan w NVS | syn | 4 | 2 | nic | brak | T1 |

### C. Gry i zabawy przy wystawie (radar jako kontroler, dzieci bez telefonów)

| # | Nazwa | Co robi | Dla kogo | Wow | Trudn. | Sprzęt | Ryzyko mechanika / zasilanie | Tor |
|---|---|---|---|---|---|---|---|---|
| C1 | ★ **Raz, dwa, trzy, Baba Jaga patrzy** | Duże oko zamknięte i odwrócone, telefon odlicza; dzieci idą do dyni. Oko się otwiera, a radar sprawdza, kto się rusza (LD2450 podaje prędkość celu). Na przyłapanego patrzą duże oko i małe po jego stronie. Kto dojdzie bliżej niż 40 cm, wygrywa, a dynia „mdleje”. Słabe widzenie stojących przez LD2450 jest tu zaletą, bo nieruchome dziecko jest „niewidzialne” | dzieci na wystawie, syn jako sędzia | 5 | 3–4 | radar; głośnik telefonu | 3 przy otwarciu, potem 2 + 2 | T1, T2 |
| C2 | **Zasadzka „dynia śpi”, „Bu!” w obie strony** | Dynia śpi (oczy w dół, duże zamknięte). Kto nachyli się bliżej niż 40 cm albo syn naciśnie przycisk, budzi ją: duże oko szeroko na cel, potem fala, z telefonu krzyk. Odwrotnie: gdy dziecko skoczy w stronę dyni (prędkość zbliżania z radaru), dynia się boi i oczy uciekają falą | dzieci, syn | 5 | 2–3 | radar albo PIR (pierwszy wariant) | szczyt 3 + 1; przerwa ochronna, np. raz na 20 s | T1, T2 |
| C3 | **Wyrocznia tak/nie** | Dziecko zadaje pytanie na głos. Duże oko kiwa (tak), kręci (nie) albo przewraca oczami („głupie pytanie”). Na wystawie losowo, gdy ktoś stoi blisko i nieruchomo; u syna z ukrytym wyborem odpowiedzi, czyli trik | dzieci, syn | 5 | 2 | nic (radar opcjonalnie) | 2 | T1 |
| C4 | **Wybraniec, wyliczanka** | Duże oko wybiera jedno z do 3 dzieci przed dynią i gapi się na nie; bez efektu Mony Lisy reszta widzi, że to nie oni. Wariant wyliczanka: spojrzenie skacze między dziećmi coraz wolniej, jak koło fortuny („kto pierwszy bierze cukierka”) | dzieci | 4 | 2–3 | radar | 2–3 | T1, T2 |
| C5 | ★ **Sztafeta spojrzeń** | Dziecko obchodzi dynię. Duże oko śledzi je do ±25°, potem „podaje” je kolumnie małych oczu po tej stronie. Radar widzi ±60°, więc sztafeta sięga mniej więcej do oczu na ±48° | dzieci | 5 | 4 | radar, mapa oczu | ≤ 4. Przeczy decyzji 18.10 | T2 |
| C6 | **Podział uwagi** | Oczy po lewej śledzą dziecko z lewej, po prawej dziecko z prawej, a duże oko przenosi wzrok między nimi jak sędzia tenisowy | dzieci | 4 | 4 | radar, mapa oczu | 2 + 2. Sloty celów radaru się zamieniają [Z], potrzebne „przyklejenie”. Przeczy decyzji 18.10 | T2 |
| C7 | ★ **Ciepło–zimno** | Syn zaznacza na mapie radaru tajny punkt na podłodze. Im bliżej punktu dziecko, tym szerzej otwarte duże oko i nerwowsze małe; po trafieniu wszystkie na nie patrzą, telefon gra fanfarę | dzieci, syn ustawia | 4 | 3 | radar | „nerwowe” sakady z limitem | T1 |
| C8 | ★ **„Uczciwe” wszyscy na ciebie** | Oczy, które sięgają do celu, patrzą dokładnie (z mapy oczu). Pozostałe stają na +25° w stronę celu i krótko drżą (±1,5°, ok. 3 Hz), jakby się wytężały | dzieci | 4 | 3 | mapa oczu (radar opcjonalnie) | dojazd parami; drżą najwyżej 2 i tylko kilka sekund | T2 |
| C9 | **Wstydliwe oko** | Ktoś stoi bliżej niż ok. 35 cm dłużej niż 2 s: duże oko patrzy w dół i w bok, przymyka się do 40% i co kilka sekund zerka. Z daleka śmiałe, z bliska nieśmiałe | dzieci | 4 | 2 | radar | ≤ 3, wolno | T2 |
| C10 | **Simon z oczami** | Dynia pokazuje sekwencję (oko 3 w lewo, oko 7 w prawo, mrugnięcie), dziecko powtarza ją na rysunku dyni w telefonie. Rekordy w NVS | syn i koledzy | 4 | 2 | nic | brak | T1 |
| C11 | **Przeciąganie liny wzrokiem** | Dwa telefony (syn i tata), kto szybciej stuka. Spojrzenie wszystkich oczu przechyla się w stronę szybszego, a na koniec patrzą na zwycięzcę | syn i koledzy | 5 | 3 | nic | z wygładzeniem; 2 klientów AP | T1 |
| C12 | **Kompas do skarbu, „patrzcie tam!”** | Syn chowa cukierek, na widoku pokoju z góry wskazuje miejsce, a każde oko liczy własny kąt i na nie patrzy. Te, które nie sięgają, wytężają się jak w C8 | syn, dzieci | 4 | 2–3 | mapa oczu | parami | T1, T2 |
| C13 | **Dyrygent, chór** | Każde oko ma swój ton. Dotknięcie oka na rysunku gra ton z telefonu, a oko „śpiewa” (przekręcenie i powrót) | syn i koledzy | 3 | 2 | nic | stukanie przez kolejkę | T1 |

### D. Dla syna: sekrety i „magia”

| # | Nazwa | Co robi | Dla kogo | Wow | Trudn. | Sprzęt | Ryzyko mechanika / zasilanie | Tor |
|---|---|---|---|---|---|---|---|---|
| D1 | ★ **Iluzjonista: „steruję myślą”** | Ekran udaje coś niewinnego (czarny, zdjęcie). Ukryte strefy dotyku: rogi = duże oko w lewo/prawo, dwa stuknięcia = mrugnięcie, przytrzymanie = wszystkie na środek. Syn z telefonem w dłoni „rozkazuje dyni myślą” na prośby kolegów. Ekran musi być włączony (Wake Lock po http nie działa), więc na czas pokazu Auto-Lock „Nigdy” | syn | 5 | 2 | nic | brak, gotowe efekty | T1 |
| D2 | ★ **Radar na ekranie: „wskaż ofiarę”** | Widok jak z filmu: kropki do 3 osób przed dynią. Syn dotyka kropkę, a dynia przykleja się wzrokiem do tej osoby (taty, nauczycielki) i nie odpuszcza, aż syn puści. Władza nad dorosłymi. Przy okazji narzędzie rodzica do strojenia filtrów radaru | syn | 5 | 3 | radar | śledzenie z limitem prędkości | T1, T2 |
| D3 | ★ **„Pan dyni”: rozpoznaje telefon właściciela** | Gdy łączy się telefon syna (identyfikator zapamiętany w ciasteczku), dynia wita go falą i kocim mrugnięciem. To jedyne prawdziwe rozpoznanie, jakie da się zrobić. Radar rozpozna najwyżej „ten sam wrócił w ciągu 5–20 s w to samo miejsce” | syn | 5 | 2 | nic | 2–3 | T2 |
| D4 | ★ **Dynia zna twoje imię** | Syn ukradkiem wybiera imię kolegi. Telefon schowany przy dyni mówi „Cześć, Antek…” syntezą mowy, duże oko patrzy na najbliższą osobę z radaru, a powieki pulsują w rytm sylab. Warunek: polski głos syntezy offline w Safari [Z]; inaczej nagrane pliki audio | syn i koledzy | 5 | 3 | radar; głośnik BT opcjonalnie | powieka do 4 Hz i krótko | T1 |
| D5 | ★ **Dziennik dyni, raport dnia** | Po szkole syn sprawdza, co dynia „widziała”: ile osób podeszło, ile pobudek, najdłuższe gapienie, najczęstszy efekt. Liczby z radaru, bez danych osobowych. LD2450 widzi najwyżej 3 cele, więc w tłumie liczy za mało | syn, klasa | 4 | 2 | radar (PIR uboższy) | brak | T1, T3 |
| D6 | **Tajne wejście do trybu szefa** | Dla obcych strona wygląda zwyczajnie. Pełne sterowanie odblokowuje sekretny gest (np. 3 dotknięcia nosa dyni i przeciągnięcie po uśmiechu), ustawienia dodatkowo PIN taty | syn, rodzic | 4 | 1 | nic | chroni mechanikę | T1, T3 |
| D7 | **Badanie wzroku (kalibracja jako zabawa)** | Kalibracja środka każdego oka jako wizyta u okulisty: „oko nr 4, patrz prosto”, syn przesuwa suwak. To i tak jest potrzebne (dziś `k<nr> <µs>` z portu szeregowego), a wychodzi wspólna praca z tatą | syn i tata (za PIN-em) | 2 | 1 | nic | suwak ±300 µs, ruch rampą | T1, T3 |

### E. Rodzic, wystawa, niezawodność

| # | Nazwa | Co robi | Dla kogo | Wow | Trudn. | Sprzęt | Ryzyko mechanika / zasilanie | Tor |
|---|---|---|---|---|---|---|---|---|
| E1 | ★ **Telefon syna jako jedyny pilot, tryb gościa do pożyczenia** | Obce dzieci nie łączą się z Wi-Fi: sieć ukryta, hasło zna rodzina. Syn podaje koledze telefon w trybie gościa: tylko gotowe efekty, jeden na 10 s, licznik 60 s, powrót gestem albo PIN-em. iOS **Dostęp z przewodnikiem** blokuje telefon w Safari z limitem czasu [F: [Apple](https://support.apple.com/en-us/ht202612)]. Omija limit klientów AP i system kont | syn, dzieci | 4 | 1–2 | nic | brak | T1, T3 |
| E2 | **Trzy role: właściciel, gość, serwis** | Właściciel (syn, rodzic) ma pełne sterowanie. Gość ma gotowe efekty z limitem częstości, bez suwaków. Serwis (drugi PIN) ma kalibrację, OTA i wyłączanie oczu | wszyscy | 2 | 2 | nic | ogranicza ryzyko | T1, T3 |
| E3 | **Kierownica i kolejka** | Steruje jeden telefon naraz, pozostałe oglądają. Właściciel wywłaszcza gościa, rodzic może rozłączyć obcy telefon. Białej listy MAC nie robić: iOS ma adres prywatny, także rotujący [F: [Apple](https://support.apple.com/en-nz/102509)] | syn | 3 | 3 | nic | brak | T3 |
| E4 | **Stop dla każdego, wznowienie z PIN-em** | Stop zamraża oczy w miejscu, bez parkowania, bo parkowanie zamyka powieki i może przyciąć palec (5,6 N, koncepcja 2c). Po 2 s PWM się wyłącza. Wznawia PIN albo zegar po 5 min | wszyscy | 1 | 1 | nic | chroni ręce | T3 |
| E5 | ★ **Tryb przytulenia** | Cel bliżej niż 0,3–0,4 m: małe oczy zamierają z wyłączonym PWM (serwo nie walczy z ręką), duże oko nie mruga i nie robi efektów. Po odejściu 3 s i łagodny powrót. Rozdzielczość LD2450 z bliska niepewna [Z] | dzieci | 2 | 2 | radar | chroni przekładnie i palce | T3 |
| E6 | ★ **Sen bez zegara, rytm dnia** | Po N min bez ludzi w strefie radaru (zapas: PIR) dynia ziewa i zasypia: PWM małych oczu wyłączony, duże zaparkowane. Wi-Fi zostaje włączone, bo podtrzymuje powerbank. Energia postaci spada przez dzień (dłuższe fiksacje, ziewanie). Opcja: godzina z telefonu przy połączeniu jako przesunięcie `millis()`; restart ją kasuje | rodzic, dzieci | 2–3 | 2 | radar albo PIR | mniej zużycia; ok. −60–100 mA spoczynku serw [Z], ESP z AP ok. 85 mA nadal trzyma powerbank [Z] | T2, T3 |
| E7 | **Rotacja dyżurów, budżet ruchów** | Naraz „dyżuruje” np. 6 z 10 oczu, zmiana co 15 min, reszta tylko w efektach grupowych. Dzienny budżet ruchów na oko | rodzic | 1 | 2 | nic | równe zużycie, mniejszy prąd | T3 |
| E8 | **Zestaw serwisowy: wymień moduł, wyłącz oko, licznik przebiegu** | „Wymień moduł”: wybrane oko na 1500 µs (decyzja 21.10), reszta stoi, potem suwak środka ±10 µs i zapis w NVS, samo wyjście po 10 min. „Wyłącz oko N”: PWM kanału zerowe, choreografia je pomija. Licznik ruchów i godzin na moduł, zerowany przy wymianie | rodzic | 1 | 1–2 | nic | ręce przy mechanizmie bez ruchu innych oczu; uszkodzone serwo nie brzęczy | T3 |
| E9 | **Apel oczu (autotest)** | Rano każde oko po kolei rusza o ±10°, duże przechodzi X, Y i mrugnięcie. Syn odhacza na stronie, które działa | syn, rodzic | 3 | 1 | nic | 1 serwo naraz | T3 |
| E10 | **Czarna skrzynka i watchdog** | Pierścień zdarzeń w RAM, migawka do NVS co 60 s: starty z przyczyną (jak w `test-24h`), brownout, minimum V+, wolna pamięć, klienci, najdłuższa pętla, wyłączone oczy. Oś czasu ostatnich 8 h. Watchdog zadań, a po 3 restartach w 10 min tryb minimalny (sam pokaz, bez serwera www) | rodzic | 1 | 2 | nic | brak | T3 |
| E11 | ★ **Dynia sama mówi, że ma kłopot** | Zużycie energii szacowane od przycisku „naładowano” (czas × pobór bazowy + ruchy × energia ruchu). Poniżej 20% albo po wielu restartach duże oko co godzinę ziewa, a małe robią zeza. Nauczycielka wie, że ma dać znać, bez telefonu. Szacunek, nie pomiar | nauczycielka, rodzic | 3 | 2 | nic | brak | T3 |
| E12 | **Pomiar 5 V dzielnikiem** | ADC1 (GPIO0, 1, 3 albo 4; nie GPIO2, bo to pin startowy), dzielnik np. 150k/100k. Pokazuje spadki pod obciążeniem, słabe złącze i brownouty. **Stanu baterii nie pokazuje**, bo wyjście powerbanku jest stabilizowane | rodzic | 1 | 1 | 2 rezystory | brak | T3 |
| E13 | ★ **Wykrycie trzymanego oka bez czujnika prądu** | W autoteście serwa ruszają po jednym. Spadek V+ (zablokowany SG90 ok. 0,36 A, przy 0,1–0,3 Ω to 36–110 mV), który trwa po końcu ruchu, oznacza blokadę. Czy szum ADC C3 na to pozwala, nie wiadomo [Z]. Pewniej: INA219 na V+ (nie ma go w `sprzet.md`) | rodzic | 1 | 4 | dzielnik albo INA219 | brak; diagnostyka | T3 |
| E14 | ★ **Magnes nauczycielki** | Kontaktron pod skórką, magnes u nauczycielki. Przyłożenie = „pokaz wow”, przytrzymanie 3 s = tryb cisza (E15). Bez telefonu i Wi-Fi; dla rodzica to też stop bez telefonu | nauczycielka | 3 | 1 | kontaktron, magnes | brak | T3 |
| E15 | **Tryb cisza, lekcja** | Rzadkie fiksacje, bez efektów i mrugania, sam powrót do pokazu po 45 min | nauczycielka | 1 | 1 | nic | mniej zużycia | T3 |
| E16 | **Pilot reżysera** | Rodzic dyskretnie odpala scenki w czasie prezentacji („przywitaj się z panią dyrektor”) | rodzic | 3 | 1 | nic | jak efekty | T2 |
| E17 | ★ **Mapa oczu przez celowanie** | Rodzic staje z telefonem w znanej odległości przed okiem i suwakiem ustawia je, aż „patrzy na niego”. Z jednego pomiaru wychodzi azymut bazowy oka (jedno równanie, jedna niewiadoma) [R]. Bez mapy nie działają B2 (wersja z azymutem), C5, C6, C8, C12 | rodzic | 1 | 3 | nic | 1 | T2 |
| E18 | ★ **Kopia ustawień w telefonie** | Strona pokazuje cały zestaw jako tekst: środki oczu, środki i wzmocnienia 3 MG90S, mapa oczu, wyłączone oczy. Zrzut albo Notatki; po wymianie ESP na zapasowy wklejenie przywraca kalibrację. Nie w localStorage (ITP, pkt 4) | rodzic | 1 | 1 | nic | brak | T3 |
| E19 | **OTA z przeglądarki** | ElegantOTA `/update`, tylko w roli serwis, z wycofaniem nieudanej wersji (`esp_ota_mark_app_valid_cancel_rollback`). Na czas wgrywania serwa stoją | rodzic | 1 | 2 | nic | ruch w trakcie wgrywania: zablokować | T3 |
| E20 | **Kanał i moc Wi-Fi** | Przy starcie wybór najmniej zajętego kanału 1/6/11 (szkoła ma własne Wi-Fi). Na stronie RSSI i moc TX (8,5 dBm na słabą antenę SuperMini), z ostrzeżeniem, że mniejsza moc zmniejsza pobór i może zepsuć podtrzymanie powerbanku | rodzic | 1 | 2 | nic | ★ każdą zmianę mocy TX sprawdzić `test-powerbank-wifi` | T3 |

## 2. Top 10

Kryteria: radość syna i dzieci, ochrona mechaniki na kilka dni bez rodzica, wykonalność na ESP32-C3 i w Safari po http, brak nowego sprzętu. Radar LD2450 według `sprzet.md` jest „do zamówienia”; czy już jest, nie sprawdzałem. Dlatego pomysły z radarem mają warunek.

### Na tę Halloween

| # | Pomysł | Uzasadnienie |
|---|---|---|
| 1 | **Jedna kolejka ruchu w ESP + martwa ręka (A1 + A2) + pokaz jako dom (A3)** | Fundament: bez niego każda funkcja ze strony to ryzyko dla przekładni. Safari po cichu zrywa WebSocket po zablokowaniu ekranu, więc oko nie może czekać na komendę, która nie przyjdzie. |
| 2 | **Lider i stado (B1) z falą (B2)** | Limit 3–4 serw staje się stylem, poprawia każdy ruch grupowy i nie wymaga sprzętu. Wersja bez mapy działa na numerach oczu. |
| 3 | **Słownik emocji jednej powieki i charakter dnia (B3 + B4), z zasypianiem (B10)** | Z jednego serwa powiek robi postać. Syn wybiera osobowość dyni na każdy dzień wystawy, więc dynia jest „jego”. Wersja bez radaru działa od razu. |
| 4 | **Iluzjonista „steruję myślą” (D1)** | Sekret i władza przed kolegami to to, co 8-latka bawi najbardziej. Kosztuje kilka ukrytych stref dotyku na gotowych efektach. |
| 5 | **Choreografia syna jako looper, grana na wystawie z podpisem (B12)** | Najbardziej „skustomizowane dla synka”: jego taniec leci w szkole przez kilka dni, a limit serw poznaje przez zabawę. Prosta wersja: najpierw tylko duże oko. |
| 6 | **Wyrocznia tak/nie (C3)** | Działa sama na wystawie i jako trik syna. Wykorzystuje obie osie dużego oka i powieki, czego małe oczy nie umieją. Radar tylko opcjonalnie. |
| 7 | **Telefon syna jako jedyny pilot, tryb gościa do pożyczenia, stop dla każdego (E1 + E2 + E4)** | Bezpieczeństwo bez kont i bez obcych telefonów w sieci (limit klientów AP). Syn „rozdaje” sterowanie, co samo jest frajdą. Stop nie parkuje powiek, więc nie przytnie palca. |
| 8 | **Zestaw serwisowy z apelem oczu, czarną skrzynką i kopią ustawień (E8 + E9 + E10 + E18)** | Moduły na bagnet i 2–3 zapasy mają sens tylko, gdy wymiana i kalibracja (D7) idą z telefonu, bez komputera. Rodzica nie będzie przy dyni, więc po fakcie musi wiedzieć, co się stało. |
| 9 | **Baba Jaga patrzy (C1), warunek: radar dotarł i jest podłączony** | Gra, którą zna każde dziecko w szkole, bez telefonu. Radar robi tu dokładnie to, do czego go kupujemy, a jego słabość (słabo widzi stojących) jest regułą gry. Bez radaru: później. |

### Później

| # | Pomysł | Uzasadnienie |
|---|---|---|
| 10 | **Mapa oczu (E17), a na niej radar na ekranie „wskaż ofiarę” (D2), „uczciwe” wszyscy na ciebie (C8) i sztafeta spojrzeń (C5)** | Największe „wow” dla syna i dzieci, ale wymaga radaru, kalibracji azymutu każdego oka i decyzji użytkownika co do małych oczu z czujnikiem (decyzja 18.10). Mapa oczu jest jednorazowym kosztem, który odblokowuje kilka efektów. |

**Tuż za Top 10:** „Pan dyni” (D3), sen bez zegara (E6, ważny przy kilku dniach wystawy, w wersji z PIR możliwy od razu), zasadzka „dynia śpi” (C2, w wersji z PIR też od razu), dziennik dyni (D5), Simon (C10).

## 3. Pomysły odrzucone

| Pomysł | Dlaczego nie |
|---|---|
| Sterowanie przechylaniem telefonu (żyroskop) | `DeviceOrientationEvent.requestPermission()` działa tylko w secure context; po http iOS odrzuca prośbę bez okna. Zamiennik: przeciąganie palcem. Wraca tylko z HTTPS (niżej). |
| Dynia reaguje na krzyk, klaskanie, głos | `getUserMedia` tylko w secure context; po http `navigator.mediaDevices` jest `undefined`. |
| Komendy głosowe („Dynio, spójrz w lewo”) | Poza mikrofonem Safari bywa przełączane na rozpoznawanie w chmurze, a punkt dostępu nie ma internetu. |
| Wibracja telefonu przy straszeniu | iOS Safari nie ma Vibration API; obejście przez `<input switch>` podobno załatane w iOS 26.5 (jedno źródło). |
| Telefon w kieszeni z wygaszonym ekranem jako pilot | Safari wstrzymuje JS i WebSocket po zablokowaniu ekranu, a Wake Lock wymaga HTTPS. |
| Pełny ekran strony na iPhonie | Fullscreen API na iPhonie tylko dla `<video>`. |
| Joystick dla każdego dziecka na wystawie | Obce dziecko kręci okiem w kółko, grzeje serwa i męczy przekładnie SG90; do tego limit klientów AP. Zamiast tego tryb gościa (E1). |
| Kamera telefonu do śledzenia twarzy | `getUserMedia` wymaga HTTPS; radar robi to prościej. |
| Obrazki i litery z 10 oczu | Jedna oś ±25° i oczy rozłożone dookoła dyni nie dadzą czytelnego obrazu. Zostają fale i wskazywanie. |
| Puszczanie oka, mrużenie jedną powieką, powieka podążająca za góra–dół | Jedno serwo powiek to jeden stopień swobody (koncepcja 2c, pkt 2.3); potrzebny byłby 4. MG90S. |
| Wszystkie oczy ruszają w tej samej chwili | 10–13 serw wobec limitu 3–4; zastępuje to fala parami, ok. 1,3 s. |
| Mikrosakady poniżej ok. 1,5° | Martwa strefa SG90 to 10 µs ≈ 0,9°, krok PCA9685 to ok. 0,44°; ruch może się nie wykonać albo wykonać raz tak, raz nie. |
| Sąsiednie oczy patrzące sobie w oczy | Przy 48° między kierunkami bazowymi potrzeba 66°; zostaje „zerkanie ku sobie”. |
| Przewracanie oczami małymi oczami | Mają tylko oś lewo–prawo; robi to duże oko. |
| Rozpoznawanie konkretnego dziecka przez radar między dniami | LD2450 podaje tylko X, Y i prędkość, bez tożsamości. |
| Ciepło–zimno z siły sygnału Wi-Fi telefonu | RSSI za bardzo skacze w skali pokoju [Z]; radar robi to lepiej (C7). |
| Długie trzęsienie wszystkimi oczami | Stały ruch wielu serw: prąd i zużycie przekładni. Zostaje krótkie drżenie 1–2 oczu. |
| Procent baterii powerbanku z ADC | Wyjście 5 V jest stabilizowane, napięcie nic nie mówi do chwili odcięcia. Zostaje szacunek (E11). |
| Odczyt pozycji serwa z potencjometru | Przeróbka 13 serw, sprzeczna z modułami na bagnet. |
| Zegar z NTP, powiadomienia push do rodzica | Nie ma internetu. |
| Wyłączanie Wi-Fi albo uśpienie ESP w nocy | Powerbank odetnie prąd po ok. 15 s bez obciążenia (22.10) i rano trzeba wciskać przycisk. |
| Biała lista MAC, konta per dziecko | iOS ma prywatny, także rotujący adres Wi-Fi; konta to przesada na kilka dni. |
| Captive portal jako wejście syna | Mini-przeglądarka CNA nie trzyma ciasteczek, ma ograniczony JS i zamyka się przy zmianie aplikacji. Najwyżej na kiosk gościa. |

**Nie odrzucone, tylko „później”:** HTTPS z własnym CA zainstalowanym na iPhonie syna, z certyfikatem na 192.168.4.1. Odblokowałby żyroskop, mikrofon i Wake Lock. Koszt: ok. 40 KB RAM na gniazdo TLS na ESP [F: [ESP-IDF HTTPS server](https://docs.espressif.com/projects/esp-idf/en/v5.5/esp32/api-reference/protocols/esp_https_server.html)], ręczne „pełne zaufanie” certyfikatu w iOS [F: [Start9](https://docs.start9.com/0.3.5.x/device-guides/ios/ca-ios.html)] i znany błąd iOS 18 z tym ustawieniem [F: [Apple forum](https://developer.apple.com/forums/thread/764673?page=5)]. Do próby, nie do planu bazowego.

## 4. Ograniczenia techniczne

### 4.1 Z repo [F]

- `test-powerbank-wifi.ino`: `WiFi.softAP(AP_SSID, AP_HASLO, 1, 1, 1)`, czyli kanał 1, ukryta sieć, **najwyżej 1 klient**. Na stronę potrzeba 2–4 (syn, rodzic, drugi telefon w C11). Po każdej zmianie liczby klientów albo mocy TX test podtrzymania trzeba powtórzyć, bo pobór ESP to obciążenie, które trzyma powerbank [Z].
- `test-24h.ino`: watchdog nie jest włączony (opis w `polaczenia.md`). Przy serwerze www na jednym rdzeniu watchdog jest potrzebny (E10).
- `test-powerbank-wifi.ino` zapisuje ostatni impuls do NVS co 100 ms ruchu. Przy 13 serwach rachunek T3 [R, przy założeniu 100 tys. cykli kasowania i partycji NVS 20 KB] daje zużycie flash w ok. miesiąc, a kasowanie strony flash może przyciąć pętlę i Wi-Fi na kilkadziesiąt ms [Z]. Wniosek dla łagodnego startu: zapisywać **cel sakady**, nie kroki rampy.
- Decyzja 18.10 „Małe oczy zawsze chaotyczne, bez czujnika” ogranicza pomysły C5, C6, C8 (pkt 0.5).
- Martwa strefa SG90 10 µs [F: [karta SG90](https://static.rapidonline.com/pdf/37-1330t.pdf)], przy 11,1 µs/° (`oczy-ruch.ino`) ok. 0,9° [R]. Krok PCA9685 przy 50 Hz: 4,9 µs ≈ 0,44° [R].

### 4.2 Safari na iPhonie, strona po http z 192.168.4.1

| Funkcja | Stan | Źródło |
|---|---|---|
| Żyroskop (DeviceOrientation/Motion) | tylko HTTPS i po geście (`click`/`touchend`); po http **nie działa** | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent/requestPermission_static), [yal.cc](https://yal.cc/js-device-motion/) |
| Mikrofon (`getUserMedia`) | tylko HTTPS; po http **nie działa** | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia), [caniuse](https://caniuse.com/mdn-api_mediadevices_getusermedia_secure_context_required) |
| Wibracja | **brak** w iOS | [caniuse](https://caniuse.com/vibration) |
| Pełny ekran | na iPhonie tylko `<video>` | [WebKit 240312](https://www2.webkit.org/show_bug.cgi?id=240312), [Apple forum](https://developer.apple.com/forums/thread/133248?page=2) |
| Ekran nie gaśnie (Wake Lock) | Safari 16.4+, tylko HTTPS; po http **nie** | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API) |
| WebSocket w tle, po zablokowaniu ekranu | ginie od razu albo po 30 s–1 min, często bez `onclose`; potrzebny heartbeat i ponowne łączenie po `visibilitychange` | [Apple forum 696310](https://developer.apple.com/forums/thread/696310), [WebKit 247943](https://bugs.webkit.org/show_bug.cgi?id=247943) |
| `ws://` ze strony `http://` | działa (to nie mixed content) [Z, standard, nietestowane na tej konfiguracji] | – |
| Dźwięk (Web Audio) | po geście; domyślnie wycisza go przełącznik wyciszenia; `navigator.audioSession.type = "playback"` pomaga, `<audio>` gra mimo wyciszenia | [WebKit 264473](https://bugs.webkit.org/show_bug.cgi?id=264473), [WebKit 251532](https://bugs.webkit.org/show_bug.cgi?id=251532) |
| Synteza mowy | `speechSynthesis.speak()` tylko w obsłudze gestu; polski głos offline niepewny [Z] | [Apple forum](https://developer.apple.com/forums/thread/105624) |
| Rozpoznawanie mowy | `webkitSpeechRecognition` jest, ale bywa przełączane na chmurę | [Apple forum 775699](https://developer.apple.com/forums/thread/775699) |
| `crypto.subtle` | tylko HTTPS; `getRandomValues` działa | [MDN](https://developer.mozilla.org/docs/Web/API/Crypto/subtle) |
| localStorage | działa na `http://192.168.4.1`, ale ITP kasuje pamięć zapisywaną skryptem po 7 dniach bez interakcji ze stroną (źródła wtórne) | [Didomi](https://docs.didomi.io/releases-and-announcements/announcements/apple-implements-7-day-cap-on-script-writable-storage) |
| Okno captive portal (CNA) | okrojony WebKit, bez trwałych ciasteczek, zamyka się przy zmianie aplikacji. Brak okna: ESP odpowiada 200 „Success” na `captive.apple.com/hotspot-detect.html` | [Purple](https://www.purple.ai/en-us/guides/why-captive-portal-isnt-loading-on-iphone), [esp8266.com](https://esp8266.com/viewtopic.php?p=25197) |
| Sieć bez internetu | Connectivity Assist (dawniej Wi-Fi Assist) używa danych komórkowych, „gdy Wi-Fi jest bezużyteczne”; warunków Apple nie podaje | [Apple 127686](https://support.apple.com/127686) |
| Prywatny adres Wi-Fi | iOS 18: wyłączony, stały albo rotujący dla każdej sieci | [Apple 102509](https://support.apple.com/en-nz/102509) |
| Dostęp z przewodnikiem | blokuje telefon w jednej aplikacji, z limitem czasu i kodem | [Apple](https://support.apple.com/en-us/ht202612) |
| „Dodaj do ekranu początkowego” po http | niejasne; Service Worker (praca offline) wymaga HTTPS [Z] | [moodeaudio](https://moodeaudio.org/forum/showthread.php?pid=60715) |

Wniosek: strona musi być w całości z ESP, bez CDN i bez fontów z sieci; dźwięki generowane w Web Audio albo jako małe pliki we flash.

### 4.3 ESP32-C3 SuperMini, PCA9685, LD2450

| Funkcja | Stan | Źródło |
|---|---|---|
| Klienci punktu dostępu | Arduino `softAP(…, max_connection)`, domyślnie 4; FAQ Espressif dla ESP32: do 10. **Limitu dla C3 nie znaleziono**; bezpiecznie 3–4 [Z] | [Arduino-ESP32 WiFi](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/wifi.html), [ESP FAQ](https://docs.espressif.com/projects/esp-faq/en/latest/software-framework/wifi.html) |
| AsyncWebSocket | przy przepełnionej kolejce wiadomości odpadają albo klient jest rozłączany; trzeba wołać `cleanupClients()`, bo przeglądarki nie zamykają gniazd. Domyślnie 8 klientów WS, kolejka 32 (źródło wtórne); duże ramki potrafią zjeść cały heap | [ESP32Async](https://esp32async.github.io/ESPAsyncWebServer/websockets/), [esp32.com](https://esp32.com/viewtopic.php?p=63607) |
| Opóźnienie | echo przez SoftAP ok. 16–60 ms, TCP 40–50 ms, z pojedynczymi skokami; na WebSocket nie mierzone. Do sterowania palcem wystarczy [Z] | [esp32.com 26257](https://esp32.com/viewtopic.php?p=26257), [esp32.com 71585](https://esp32.com/viewtopic.php?p=71585) |
| Wi-Fi a impulsy serw | PCA9685 generuje impulsy sam, więc Wi-Fi na jednym rdzeniu najwyżej opóźnia aktualizację, nie powoduje drgań (interpretacja, nie pomiar) | [LKML](https://lkml.iu.edu/hypermail/linux/kernel/2002.3/03645.html) |
| ADC | ADC1 = GPIO0–4; ADC2 w trybie oneshot na C3 nieobsługiwany (errata); zakres ok. 0–2500 mV, wymaga kalibracji | [ESP-IDF ADC C3](https://docs.espressif.com/projects/esp-idf/en/stable/esp32c3/api-reference/peripherals/adc/adc_oneshot.html) |
| Słaba antena SuperMini | społeczność zaleca `WiFi.setTxPower(WIFI_POWER_8_5dBm)`; przyczyna sporna | [Hackaday](https://hackaday.io/project/205906-esp32-c3-super-mini-wifi-fix-3-methods-that-work), [forum Arduino](https://forum.arduino.cc/t/esp32-c3-super-mini-esp-now-instable-a-pleine-puissance-tx/1459456) |
| Regulator 3,3 V SuperMini | ME6211 (500 mA) albo XC6206 (200 mA, brownout przy impulsach Wi-Fi), zależnie od egzemplarza | [Cirkit](https://docs.cirkitdesigner.com/component/c8170182-1bc4-4ab9-925d-5e9459b9a115/esp32-c3-super-mini) |
| OTA | ElegantOTA v3 z ESPAsyncWebServer, `.bin` aplikacji albo LittleFS | [Random Nerd Tutorials](https://randomnerdtutorials.com/esp32-ota-elegantota-arduino/) |
| HTTPS | ok. 40 KB RAM na gniazdo TLS | [ESP-IDF](https://docs.espressif.com/projects/esp-idf/en/v5.5/esp32/api-reference/protocols/esp_https_server.html) |
| LD2450 | do 3 celów z X, Y i prędkością, ok. 10 odczytów/s, ±60°, 6 m, UART 256 000 | [ESPHome](https://esphome.io/components/sensor/ld2450/), [instrukcja](https://www.elemon.com.ar/images/productos/hojas-de-datos/radar-modulos/hlk-ld2450.pdf) |
| LD2450 a stojący człowiek | słabo widzi nieruchomych dalej niż ok. 2 m („a tracker, not a stillness detector”); oko potrzebuje podtrzymania celu 5–10 s [Z] | [atomic14](https://www.atomic14.com/esp32/sensors/hlk-ld2450/) |
| LD2450 a odbicia | meble i metal dają cele-duchy; jednostka prędkości sporna (mm/s albo cm/s), sprawdzić przed progiem w C2 | [HLK-LD2450-security](https://github.com/PeterkoCZ91/HLK-LD2450-security), [RBEGamer](https://github.com/RBEGamer/HLK-LD2450) |

### 4.4 Założenia do sprawdzenia na iPhonie syna i na płytce

1. iPhone zostaje w sieci dyni z komunikatem „brak internetu”, a ruch do 192.168.4.1 idzie przez Wi-Fi, nie komórkowo (zależy też od tego, czy telefon syna ma SIM).
2. ESPAsyncWebServer z AsyncTCP działa stabilnie na C3 z rdzeniem 3.3.12 przy 2–4 klientach.
3. Moc TX 8,5 dBm i więcej klientów nie psują podtrzymania powerbanku: powtórzyć `test-powerbank-wifi`.
4. Polski głos syntezy mowy działa offline (D4).
5. `navigator.audioSession` działa po http.
6. LD2450 rozróżnia cel na 0,3–0,4 m (E5, C1); źródła podają rozdzielczość sprzecznie (75 mm, 0,15 m, 0,75 m).
7. Dzielnik na V+ wykrywa zablokowane serwo (E13), choć może na to nie pozwolić szum ADC.
8. mDNS `dynia.local` odpowiada na interfejsie punktu dostępu.

## 5. Proponowane wpisy do Parkingu (po jednej linijce)

- Pytanie do użytkownika: czy zmienia decyzję 18.10 „małe oczy bez czujnika” (warunek dla C5, C6, C8).
- Pomiar rzeczywistej martwej strefy SG90 i MG90S na PCA9685, przed strojeniem mikroruchów (B7).
- Firmware zapisuje do NVS cel sakady zamiast kroków rampy (zużycie flash przy 13 serwach).
