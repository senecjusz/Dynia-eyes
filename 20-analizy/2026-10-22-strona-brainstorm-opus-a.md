# Strona sterująca dynią: burza mózgów, Opus A (E7.1, 22.10)

Autor: Opus A, według briefu `30-projekt/brief-e7-strona-brainstorm.md`. Repo tylko do odczytu; zapisany jest wyłącznie ten plik.

**Jak powstał raport.** Trzy tory prowadzili trzej niezależni subagenci. Każdy dostał pełny brief i jeden tor:
1. syn i koledzy,
2. choreografia oczu i duże oko,
3. rodzic, wystawa i niezawodność.

Każdy tor sam czytał pliki z briefu i szukał w sieci. Tor 3 sprawdził też nagłówki i `sdkconfig` lokalnego rdzenia esp32 3.3.12 w `~/.arduino15`. Ja połączyłem duplikaty, ułożyłem Top 10 i sam sprawdziłem na MDN listę funkcji wymagających bezpiecznego kontekstu. Pozostałe linki zebrały tory; ponownie ich nie otwierałem.

**Oznaczenia:**
- **[F]** fakt ze źródła albo z repo,
- **[L]** fakt z lokalnych plików rdzenia esp32 3.3.12,
- **[R]** rachunek,
- **[Z]** założenie albo rzecz do sprawdzenia na iPhonie lub płytce,
- **[K]** konflikt z ustaleniem z 18.10: małe oczy ruszają się chaotycznie i nie reagują na nic, na ludzi reaguje tylko duże oko.

## 0. Wnioski w pięciu zdaniach

1. **O bezpieczeństwie decyduje firmware, nie strona.** Każde polecenie ze strony przechodzi przez jeden strażnik ruchu: wspólny budżet 3–4 serw dla całej dyni, limity kąta i prędkości, kolejka. Strona wysyła intencje („patrz na −10°”, „scenka 3”), a nie mikrosekundy.
2. **„Wszystkie oczy naraz” zawsze oznacza kaskadę albo falę.** Przy limicie 3 serw 10 małych oczu obraca się w ok. 0,8–1,4 s [R], co wygląda na zamierzoną choreografię, a nie na wadę.
3. **Strona z `http://192.168.4.1` nie dostanie żyroskopu, mikrofonu, kamery, wibracji, blokady wygaszania ekranu ani pełnego ekranu.** Działają dotyk z multi-touchem, dźwięk z telefonu (po pierwszym stuknięciu) i synteza mowy [F/Z, sekcja 4]. Zabawy opieramy więc na palcu i dźwięku z telefonu.
4. **Safari w tle zrywa WebSocket i nie zawsze to zgłasza [F].** Sterowanie ręczne wymaga heartbeatu i samoczynnego powrotu do automatu. Dynia bez żadnego telefonu ma robić pełny pokaz.
5. **Duże oko wyraża emocje tylko trzema środkami:** rozwarciem powiek (jeden stopień swobody), tempem sakad i kierunkiem. Nie mruga jedną powieką ani nie przechyla powiek.

## 1. Lista pomysłów (po połączeniu trzech torów)

Kolumny:
- **Dla:** S = syn, D = dzieci na wystawie, R = rodzic.
- **W:** „wow” dla 8-latka, 1–5.
- **T:** trudność, 1–5.
- **Sprzęt:** dodatkowy sprzęt.
- **Ryzyko / serwa naraz:** ryzyko dla mechaniki lub zasilania.

Dla dużego oka zakładam kanały z koncepcji 2c: ψ, θ i powieki, każda oś w ruchu zajmuje jedno miejsce w budżecie.

### 1.1 Fundament (bez niego reszta jest ryzykiem)

| # | Nazwa | Co robi | Dla | W | T | Sprzęt | Ryzyko / serwa naraz |
|---|---|---|---|---|---|---|---|
| 1 | **Strażnik ruchu: wspólny budżet serw i harmonogram** | Jeden licznik serw w ruchu dla całej dyni, z dużym okiem włącznie, ustawiany jednym parametrem (3 albo 4). Limity: ±25° małych, ψ ±25° / θ ±15° dużego, prędkość, minimalny czas ruchu. Efekt to lista kroków; brak miejsca opóźnia krok, zamiast łamać limit. Priorytety: bezpieczeństwo > ręczne > scenka > chaos > mikroruch. | R (warunek wszystkiego) | 1 | 2–3 | nic | Usuwa ryzyko. Dziś `MAX_RUCHOW = 2` liczy tylko małe oczy [F] |
| 2 | **Mapa dyni** | Dla każdego oka: kanał, azymut na dyni, rząd, znak obrotu, środek, min i max µs, sąsiedzi, kolejność do fali. Do tego położenie dużego oka i radaru. Z mapy liczy się kąt „patrz na punkt” i kolejność fal, a strona rysuje z niej schemat dyni do stukania. | R | 1 | 2 | nic | brak |
| 3 | **Automat jako stan domyślny** | Bez telefonu dynia gra pełny pokaz: sakady, spoczynek i aktywność, duże oko. Strona jest tylko nakładką. | wszyscy | 2 | 1 | nic | brak |
| 4 | **Martwy człowiek (heartbeat) i limit sesji** | Sterowanie ręczne trwa, dopóki strona co ok. 0,5 s potwierdza „trzymam”. Po ok. 1,5 s ciszy albo N s bez dotyku oczy płynnie wracają do automatu. Strona sama łączy się ponownie. | S, D | 1 | 2 | nic | Chroni przed okiem zostawionym na skraju zakresu |
| 5 | **„Obrażona dynia”** | Gdy strażnik odrzuca polecenia, bo ktoś klika za szybko albo przekroczył limit: duże oko się zamyka, małe falą odwracają się w bok, a na ekranie widać „Dynia się obraziła, poczekaj 20 s”. Ochrona serw staje się żartem, nie błędem. | wszyscy | 4 | 1 | nic | Zmniejsza ryzyko |

### 1.2 Dostęp i bezpieczeństwo na wystawie

| # | Nazwa | Co robi | Dla | W | T | Sprzęt | Ryzyko |
|---|---|---|---|---|---|---|---|
| 6 | **Role: gość / syn / rodzic** | Gość: kilka gotowych zabaw i „patrz tu” z mniejszą amplitudą i prędkością. Syn: pełne sterowanie, nagrywanie, scenki. Rodzic: kalibracja, wyłączanie oczu, ustawienia, OTA, restart, dziennik. Gość nie ma żadnej komendy „wyłącz” ani „µs”. | wszyscy | 2 | 2 | nic | Gość fizycznie nie ma dostępu do niczego groźnego |
| 7 | **PIN rodzica** | 4–6 cyfr. Po N min albo po zamknięciu strony wraca niższa rola. 5 błędnych prób blokuje wpisywanie na kilka minut, bo dzieci będą zgadywać. Zmiana PIN-u ze strony i przez port szeregowy. | R | 1 | 2 | nic | brak |
| 8 | **Hasło WPA2 i karta z kodem QR** | Sieć dyni z hasłem (ukryta albo nie). Syn i rodzic łączą się z karty `WIFI:S:…;T:WPA;P:…;H:true;;`, bo aparat iPhone'a czyta QR Wi-Fi [F]. Do tego opcjonalna karta „dla gości”, którą rodzic wykłada albo chowa. | R, S | 2 | 1 | wydruk karty | brak |
| 9 | **Jeden pilot naraz i kolejka** | Steruje jedna osoba przez np. 60 s, inni widzą „jesteś 2., 40 s”. Syn i rodzic przejmują od razu. Po czasie wraca automat albo następny w kolejce. | D, S | 3 | 3 | nic | Dwie osoby nie szarpią jednym okiem w przeciwne strony |
| 10 | **Strona gościa** | Ograniczona wersja dla obcych telefonów: 3–4 bezpieczne efekty z odstępem czasowym („każdy raz na minutę”). | D | 4 | 2 (na bazie 6) | nic | Limit klientów punktu dostępu (sekcja 4) |
| 11 | **Twardy limit klientów** | `max_connection` = 4: syn, rodzic i 2 goście. Piąty telefon się nie połączy. | R | 1 | 1 | nic | Chroni RAM i gniazda |
| 12 | **Tryb wystawowy: jeden przełącznik** | Rano rodzic włącza limity gościa, kolejkę i auto-powrót, a ukrywa funkcje ryzykowne. Opcja „tylko automat”. Stan w NVS, więc przetrwa restart. | R | 1 | 2 | nic | brak |
| 13 | **Magnetyczny klucz rodzica** | Kontaktron na wolnym GPIO i magnes w kieszeni rodzica. Przyłożony w ukrytym miejscu włącza tryb serwisowy albo kasuje PIN. Przycisk BOOT odpada, bo na SuperMini to GPIO9, czyli SCL [F z repo]. | R (S: „magiczny magnes”) | 3 | 2 | kontaktron | brak |

### 1.3 Serwis, kalibracja, diagnostyka

| # | Nazwa | Co robi | Dla | W | T | Sprzęt | Ryzyko |
|---|---|---|---|---|---|---|---|
| 14 | **Kalibracja ze strony** | Suwak środka każdego oka (±1 / ±10 µs), powolny podgląd, „przywróć poprzednią”, zapis w NVS. Dziś robi to `k<nr>` przez port szeregowy. Dla dużego oka: środki, punkty ψ ±25 i θ ±15, „zamknięte” i „otwarte” powieki, sprawdzenie 2° zapasu do ograniczników. Kalibrowane oko wypada z automatu. Wymóg z decyzji 18.10. | R | 2 | 3 | nic | Suwak tylko w 1200–1800 µs, ruch wolny |
| 15 | **Tryb montażu** | Na kanał: „trzymaj 1500 µs” (do nasadzania dźwigienki), „bez impulsu”, „test ±100 µs powoli”. Zastępuje szkic `kalibracja/` bez laptopa. Po „bez impulsu” strona wymusza najpierw „trzymaj 1500”, bo inaczej oko skacze [F `polaczenia.md`]. | R | 1 | 2 | nic | jak wyżej |
| 16 | **Wyłączenie pojedynczego oka** | Uszkodzony moduł parkuje na środku i ma wyłączony PWM albo trzymany środek. Wypada z automatu i scenek, a fale przeliczają się bez niego. Stan w NVS. | R | 1 | 2 | nic | Zacięte oko się nie grzeje |
| 17 | **Kreator wymiany modułu** | „Wymieniam oko 4”: kanał na 1500 µs, wkładam zapasowy moduł, wybieram jego numer, a środek bierze się z tabeli modułów. Potem test ruchu i oko wraca do pracy. | R | 2 | 3 | nic | brak |
| 18 | **Przegląd poranny** | Oczy po kolei robią wolny ruch −25 → +25 → 0. Syn odhacza ✓ albo ✗, a oko z ✗ jest wyłączane (16). | S, R | 3 | 2 | nic | 1 serwo naraz |
| 19 | **Panel stanu** | Czas od startu, liczba startów, przyczyna ostatniego restartu (kody z `test-24h`), wolny RAM, klienci Wi-Fi i ich RSSI, wersja firmware, wyłączone oczy, tryb, czas obiegu ping-pong. | R | 1 | 2 | nic | brak |
| 20 | **Dziennik zdarzeń** | Pierścień ok. 100 zdarzeń: restarty, przejęcia sterowania, wyłączenia oczu, przekroczenia budżetu, zmiany ustawień. Do tego zrzut po panice (partycja `coredump` 64 KB [L]). | R | 1 | 2 | nic | Zapis zdarzeń, nie co krok (zużycie flash) |
| 21 | **Licznik ruchów** | Sakady i stopnie łącznie na oko, w NVS co 60 s (jak `test-24h`). Rodzic widzi zużycie, syn ciekawostkę: „dynia zrobiła dziś 48 213 ruchów”. | R, S | 3 | 1 | nic | brak |
| 22 | **Parkuj i wyłącz** | Przed transportem albo wymianą powerbanku: oczy na środek, duże oko zamknięte, pozycja w NVS, komunikat „można odłączyć”. | R | 1 | 1 | nic | Usuwa skok przy następnym starcie |
| 23 | **Start bez skoku i Budzenie** | Serwa ruszają po kolei co ≥ 150 ms: najpierw zaparkowana pozycja z NVS, potem pierwszy ruch wolny. Po restarcie samego ESP odczyt impulsów z rejestrów PCA9685 [Z, do testu]. Na zewnątrz wygląda to jak scenka: oczy budzą się kolejno, przeciągają się o ±10°, duże oko otwiera się na końcu. Strona pokazuje „rozruch 5/13”. | wszyscy | 3 | 3 | nic | Pierwszy impuls po zaniku zasilania to nadal skok z nieznanej pozycji; scenka tylko rozkłada skoki w czasie [F] |
| 24 | **Watchdog pętli i strażnik Wi-Fi** | `enableLoopWDT()`, który w rdzeniu jest domyślnie wyłączony [L], i własny warunek „pętla ruchu stoi 1 s, więc restart”. Gdy punkt dostępu zniknie, ponowne `softAP`, bo AP podtrzymuje powerbank. Liczniki trafiają do panelu (19). | R | 1 | 2 | nic | Zawieszone ESP: PCA trzyma ostatni impuls, oko stoi |
| 25 | **OTA** | Z laptopa w sieci dyni (ArduinoOTA) albo z iPhone'a (`/update`, plik z aplikacji Pliki). Osobno obraz strony w LittleFS. Tylko z PIN-em, tylko po „Parkuj” i z cofnięciem wersji. | R | 1 | 3 | nic | Nieudana aktualizacja = dynia bez programu. Potrzebne cofnięcie i laptop z kablem w zapasie |
| 26 | **Pomiar 5 V pod obciążeniem** | Dzielnik z V+ na ADC: napięcie w spoczynku i minimum w ruchu. Wykrywa zły kabel albo dławienie powerbanku. Przy spadku firmware zmniejsza budżet serw. To **nie jest** procent baterii. | R | 1 | 2 | 2 rezystory | Wykrywa problem, zanim pojawią się resety |
| 27 | **„Bateria” jako licznik energii** | Przy podłączeniu naładowanego powerbanku: „nowy powerbank”. Strona pokazuje czas od wymiany i zużyte Wh: zmierzone z INA219, jeśli jest w warsztacie [Z], albo szacowane. Ostrzeżenie „wymień po X h” ustawia rodzic. | R | 1 | 2 | nic / INA219 | brak |
| 28 | **Przegląd z pomiarem prądu** | Jak przegląd poranny (18), ale z prądem każdego oka z INA219. Oko, które bierze wyraźnie więcej od innych, ociera albo jest zacięte. | R | 2 | 3 | INA219 | brak |
| 29 | **Przełączniki dnia** | Pauza („zamroź”, sama mija po 10 min), tryb cichy na apel, tryb oszczędny (budżet 1–2, dłuższe fiksacje), limit sakad na minutę na oko. Wszystkie to parametry strażnika (1). Żaden nie wyłącza Wi-Fi ani PWM (decyzja 22.10). | R | 1 | 1 | nic | Zmniejszają zużycie; prąd nie może spaść poniżej progu podtrzymania powerbanku |
| 30 | **Harmonogram dnia wystawy** | Godziny pokazu, poza nimi oczy zaparkowane, a duże oko zamknięte. Wi-Fi zostaje włączone. Zegara RTC nie ma, więc godzinę podaje telefon przy połączeniu. Po restarcie bez telefonu harmonogram jest nieaktywny. | R | 1 | 2 | nic | jak wyżej |
| 31 | **Kopia ustawień i raport dnia** | Pobranie JSON-a z kalibracjami, tabelą modułów i ustawieniami; wgranie po wymianie płytki ESP. Raport: godziny pracy, ruchy, restarty, z radarem także „dynia widziała dziś 312 osób”. | R, S | 3 | 2 | radar (licznik osób) | brak |

### 1.4 Sterowanie palcem

| # | Nazwa | Co robi | Dla | W | T | Sprzęt | Ryzyko / serwa naraz |
|---|---|---|---|---|---|---|---|
| 32 | **„Wszyscy tam!” (kaskada kierunku), wariant „Szef i podwładni”** | Stuknięcie albo przeciągnięcie po pasku-panoramie: oczy kolejno patrzą w tę stronę, od oka najbliższego kierunkowi. Każde liczy własny kąt z mapy i obcina go do ±25°. W wariancie „Szef” najpierw obraca się duże oko, po 0,5 s idą małe. Przy przeciąganiu: martwa strefa 3–5° i tylko ostatni cel na oko. | S, D | 5 | 2–3 | nic | ≤ 3; 10 oczu w 3–4 partiach, 0,8–1,1 s [R]. Kod grupowy `wszystkieWStrone` już jest [F] |
| 33 | **Fala i Dyrygent** | Oczy w kolejności azymutu robią +20° i wracają. Dyrygent: przeciągnięcie palcem w lewo albo w prawo puszcza falę w tę stronę, a szybkość przeciągnięcia ustawia jej tempo. | S, D | 5 | 2–3 | nic | Ruch 40° trwa 360 ms, więc odstęp ≥ 120 ms daje ≤ 3 naraz; 10 oczu ok. 1,4 s [R] |
| 34 | **Pacynka (joystick dużego oka)** | Pad 2D ustawia kierunek, suwak rozwarcie powiek, przycisk mruga. Strona wysyła kąty oka. Firmware ogranicza prędkość do ok. 120°/s i kompensuje sprzężenie osi (koncepcja 2c). | S | 5 | 2 | nic | 2–3 serwa, małym oczom zostaje 1 |
| 35 | **Pojedyncze oko na mapie dyni** | Stuknięcie w oko na schemacie: ono się „budzi” albo słucha suwaka. | S | 3 | 2 | nic | małe |
| 36 | **Rysowanie trasy oka** | Syn rysuje palcem kółko, ósemkę albo zygzak, a duże oko powoli jedzie po tej trasie, przyciętej do zakresu i wygładzonej. | S | 4 | 2 | nic | 2 serwa ciągle |
| 37 | **Pianino oczu** | 10 klawiszy, po jednym na oko. Dotyk obraca oko w bok i gra nutę z telefonu; multi-touch pozwala na akordy. | S | 4 | 2 | nic | Akord ponad budżet kolejka rozkłada w czasie |
| 38 | **Sztuczka magika (tryb kieszonkowy)** | Ukryty ekran z kilkoma dużymi polami do obsługi bez patrzenia: lewo, prawo, mrugnij, „Bu!”. Syn mówi przy kolegach „Dyniu, popatrz na Kasię” i po cichu stuka. | S przy kolegach | 5 | 2 | nic | małe |

### 1.5 Gotowe efekty i scenki (przyciski, również składniki automatu)

| # | Nazwa | Co robi | Dla | W | T | Sprzęt | Ryzyko / serwa naraz |
|---|---|---|---|---|---|---|---|
| 39 | **Zez** | Przednie oczy obracają się o 25° do osi dyni, boczne do przodu. Trzymają 2 s i wracają. Działa jako konwencja dla widza z przodu. | D | 4 | 1 | nic | 2 partie, ok. 0,6 s |
| 40 | **Rozbiegane** | Odwrotność zeza: wszystkie oczy odwracają się od środka, „jakby coś wybuchło”. | D | 3 | 1 | nic | jak 39 |
| 41 | **Statua** | Wszystkie oczy stają, duże się wpatruje. To baza gry „Baba Jaga”. | S, D | 3 | 1 | nic | 0 w ruchu |
| 42 | **Kłótnia sąsiadów / Plotka** | Para sąsiednich oczu patrzy na siebie, potem oba „obrażone” odwracają się w przeciwne strony. Plotka: oko patrzy na sąsiada, ten na następnego, i tak dookoła dyni. | D obchodzące dynię | 3 | 2 | nic (lista sąsiadów) | 1–3 |
| 43 | **Mecz tenisa / Mucha** | Wyobrażona piłka przelatuje z lewa na prawo, a każde oko odwraca się, gdy piłka minie jego azymut. Mucha krąży wokół dyni: patrzą na nią tylko 2–3 najbliższe oczy, a z przodu dołącza duże i mruga ze złości. | D | 4 | 3 | nic | Z natury w budżecie |
| 44 | **Zasypianie** | Ok. 30 s. Małe oczy wydłużają fiksacje, po kolei idą na środek i stają. Duże: powieki 100 → 60 → 30 %, wzrok w dół, dwa „poderwania”, zamknięcie. To też naturalny koniec dnia. | S, D | 4 | 2 | nic | 1–2 |
| 45 | **Mrugnięcia naturalne i motywowane** | Losowo co 2–6 s, zawsze przy sakadzie > 15° i przy zmianie nastroju, bo mrugnięcie maskuje zmianę kierunku (zasada animatorów). Zamykanie ok. 0,1 s, otwieranie ok. 0,2 s [F, PMC4015796]. Warianty: podwójne (niedowierzanie) i wolne senne. | wszyscy | 3 | 1 | nic | 1 (3 przez ok. 0,15 s przy sakadzie) |
| 46 | **Trzepot powiek („chichot”)** | Powieki ±10° serwa, 4 Hz, ≤ 1 s. | S | 3 | 1 | nic | MG90S się grzeje: przerwa ≥ 10 s |
| 47 | **Przewracanie oczami** | Łuk ψ −20° → θ +15° → ψ +20° w 0,8 s przy powiekach 60 %, potem wolne mrugnięcie. Np. przy 5. kliknięciu tego samego przycisku. Tylko duże oko. | S | 5 | 2 | nic | 3, małe stoją |
| 48 | **Zdziwienie** | Powieki szybko na 100 %, oko na wprost, 1,5 s bezruchu, podwójne mrugnięcie, potem małe kaskadą w tę stronę. | D | 4 | 2 | nic | 3, potem małe po 3 |
| 49 | **„Bu!”** | 5 s ciszy, potem duże oko otwiera się szybko (ruch z rozpędem, bez skoku) i patrzy na wprost albo na najbliższą osobę z radaru. Po 0,3 s małe oczy kaskadą na środek. Z dźwiękiem z telefonu (55). | S i koledzy | 5 | 2 | nic, opcjonalnie radar | 3 + kaskada. **[K]**, gdy kierunek małych bierze się z radaru |
| 50 | **Strach i chowanie się** | Powieki szeroko, 4–6 szybkich sakad, zamknięcie, 3 s „schowane”, potem szparka i wyglądanie. | D | 4 | 2 | nic | 2–3 |
| 51 | **Podejrzliwe zerknięcie / Hipnoza** | Zerknięcie: szparka 30 %, powolne podążanie do ψ ±22°, 2–3 s trzymania. Hipnoza: duże oko kręci wolne koła (0,3 Hz), małe stoją w zezie. | D | 3–4 | 1–2 | nic | 1–2 |
| 52 | **Fotka!** | Odliczanie 3-2-1 na ekranie, potem wszystkie oczy kaskadą na wprost i duże szeroko otwarte przez 5 s, do zdjęcia z drugiego telefonu. | S, prezentacja | 3 | 1 | nic | małe |
| 53 | **Nastroje dużego oka** | Senny, ciekawski, podejrzliwy, przestraszony, złośliwy, znudzony. Każdy to zestaw parametrów tego samego generatora: rozwarcie, tempo i amplituda sakad, fiksacja, kierunek, mruganie (tabela w 1.9). Suwak „nerwowości” dla małych oczu: fiksacja 6 → 0,4 s. Do tego mikroruch ±2–3° w spoczynku, żeby oczy „żyły”. | S | 4 | 2–3 | nic | 1–3 |
| 54 | **Wyrocznia: tak / nie / nie wiem** | Dzieci zadają pytanie, syn naciska „zapytaj” albo w sekrecie wybiera odpowiedź. Tak: duże kiwa (θ ±10° ×2) albo, bez dużego oka, małe kaskadą na środek. Nie: kręcenie, małe kręcą kaskadą. Nie wiem: przewracanie oczami. | S jako „kapłan”, koledzy | 5 | 1–2 | nic | 1 duże + 2 małe |

### 1.6 Dźwięk z telefonu

| # | Nazwa | Co robi | Dla | W | T | Sprzęt | Ryzyko |
|---|---|---|---|---|---|---|---|
| 55 | **Dźwięk do efektów** | Każdy straszak i scenka ma dźwięk z telefonu: skrzypienie, śmiech, chrapanie przy zasypianiu, „mlask” przy mrugnięciu. Pliki leżą w LittleFS na ESP i są wczytywane przy otwarciu strony. | S | 4 | 2 | nic (telefon) | brak. Ograniczenie: przełącznik wyciszenia iPhone'a (sekcja 4) |
| 56 | **Dynia mówi** | Syn wpisuje albo wybiera zdanie („Witaj, Kasiu”), telefon czyta je syntezą mowy, a duże oko w tym czasie „mówi”: lekko pulsują powieki i porusza się oko. | S | 4 | 2 | nic | Pulsowanie powiek tylko małą amplitudą. [Z] polski głos offline w iOS |
| 57 | **Własne dźwięki syna** | Nagranie z Dyktafonu na iPhonie, wgrane przez `<input type=file>` jako dźwięk przycisku: „mój głos w dyni”. | S | 4 | 3 | nic | Miejsce w LittleFS, ok. 1,4 MB w domyślnym podziale [L] |
| 58 | **Taniec do muzyki** | Telefon gra krótką melodię, a oczy tańczą według gotowej osi czasu, pisanej od początku pod budżet 3–4 serw. | S, pokaz w klasie | 5 | 3 | nic | Rozjazd startu przez WebSocket: kilkadziesiąt ms [Z] |

### 1.7 Tworzenie i gry

| # | Nazwa | Co robi | Dla | W | T | Sprzęt | Ryzyko |
|---|---|---|---|---|---|---|---|
| 59 | **Nagrywarka ruchów** | „Nagraj”: syn steruje palcem i straszakami, a strona zapisuje kroki. Potem „Odtwórz” i „Zapisz jako przycisk”. 1–3 sloty w ESP, z możliwością włączenia do pokazu automatycznego („to ja zaprogramowałem”). Odtwarzanie idzie przez strażnika, więc nagranie zbyt gęste trochę się rozciągnie. | S | 5 | 3 | nic | ≤ budżetu z definicji |
| 60 | **Klocki sekwencji (jak Scratch)** | „Fala w lewo → mrugnij → czekaj 2 s → wszyscy na środek”, do ułożenia i odtworzenia. | S, prezentacja | 4 | 4 | nic | jak 59 |
| 61 | **Obudź śpiącą dynię** | Dynia śpi. Trzeba „pogłaskać” ekran albo stuknąć N razy: budzi się jedno małe oko, potem kolejne, na końcu duże. | S i koledzy | 4 | 2 | nic | ruchy po kolei |
| 62 | **Refleks** | Duże oko jest zamknięte i otwiera się w losowej chwili. Kto pierwszy stuknie, wygrywa; czas w ms i tabela 10 najlepszych w ESP. | S i koledzy | 4 | 2 | nic | 1 serwo, przerwa między rundami |
| 63 | **Simon mówi** | Dynia pokazuje sekwencję („oko 3 w lewo, oko 7 w prawo, mrugnięcie”), dziecko powtarza ją stukaniem na mapie. Z każdą rundą o jeden krok dłużej. | S i koledzy | 4 | 3 | nic | ruchy po kolei |
| 64 | **Przeciąganie liny wzrokiem** | Dwa telefony stukają jak najszybciej, a oczy przesuwają się w stronę szybszego. | S i kolega | 5 | 3 | drugi telefon | Mocne wygładzanie i limit prędkości |
| 65 | **Dwie drużyny oczu** | Każdy telefon steruje połową dyni i ma ustawić swoje oczy na cel wskazany przez dynię. | S i kolega | 4 | 3 | drugi telefon | Budżet po 2 serwa na gracza |
| 66 | **Baba Jaga patrzy** | Duże oko zamknięte, dzieci się skradają. Oko się otwiera, a ten, kto się rusza, dostaje spojrzenie dużego oka i „Widzę cię!”. Działa bez telefonu, jako gra wystawowa. | D | 5 | 4 | radar (głośnik opcjonalnie) | Radar przeskakuje między osobami w tłumie, potrzebny filtr z 18.10. [Z] że LD2450 podaje prędkość celu |

### 1.8 Radar: duże oko jako postać

| # | Nazwa | Co robi | Dla | W | T | Sprzęt | Ryzyko |
|---|---|---|---|---|---|---|---|
| 67 | **Śledzenie i otwieranie (decyzja 18.10) z „za blisko!”** | Filtr z `prezentacja-w-szkole.md`. Rozwarcie zależy od odległości (daleko 40 %, blisko 100 %), θ też z odległości, a gdy nikogo nie ma, oko się zamyka. Ruch skokami z fiksacjami, nie ciągłe podążanie. Ktoś bliżej niż 0,3 m: oko mruży albo powoli się zamyka, co chroni też palce, bo powieka zamyka się z siłą 5,6 N [F koncepcja 2c]. Gdy się cofnie: „Bu”. | D | 5 | 3 | radar | 1–3; martwa strefa ±5° |
| 68 | **Dwie osoby i odprowadzanie** | Oko co 3–5 s przenosi wzrok między dwiema osobami i przy przeskoku mruga. Odchodzącego odprowadza do brzegu pola widzenia, mruży i się zamyka. | D | 4 | 3 | radar | 3 przez ok. 0,2 s |
| 69 | **Podglądanie, gdy nikogo nie ma** | Co 1–3 min powieki uchylają się na 20 %, oko powoli skanuje i się zamyka. Krótko, więc tylko słaby konflikt z „zamknięte, gdy nikogo nie ma”. | wystawa | 2 | 1 | nic albo radar | 1–2 |
| 70 | **Charakter automatyczny** | Maszyna stanów nastroju z radaru: nikogo – zamknięte albo podglądanie; ktoś daleko – ciekawski; ktoś blisko i długo – podejrzliwy, potem złośliwy; nagle bardzo blisko – przestraszony; tłum dłużej niż 30 s – znudzony, przewraca oczami. Wzór: warstwy stanów w pracy Disney Research o spojrzeniu robota. | D | 5 | 4 | radar | 1–3 |
| 71 | **„Patrzcie na nią”: małe oczy na radar [K]** | Co 20–40 s kaskada wszystkich oczu na najbliższą osobę, czyli tryb tłumu z analizy 18.10. Zamiast „naraz” kaskada. | D | 5 | 3 | radar | ≤ 3. Wymaga zmiany ustalenia z 18.10 |
| 72 | **Licznik przestraszonych** | Ile osób dziś podeszło i rekord dnia. Część raportu dnia (31). | S i koledzy | 3 | 2 | radar | brak |

### 1.9 Tabela nastrojów dużego oka (do 53 i 70)

| Nastrój | Rozwarcie | Sakady | Fiksacja | Kierunek | Mruganie |
|---|---|---|---|---|---|
| senny | 30–50 %, opada | wolne (×2), ≤ 8° | 3–6 s | θ −8…−12° | rzadkie, wolne (0,3–0,5 s) |
| ciekawski | 100 % | szybkie, małe (5–10°) wokół celu | 0,3–0,8 s | θ +3…+5°, w stronę celu | częste, krótkie |
| podejrzliwy | 25–35 % | brak; powolne podążanie 20–30°/s | 2–4 s | skrajne ψ ±20° | prawie wcale |
| przestraszony | 100 %, szybko | szybkie, 20–30° | 0,2–0,4 s | ucieka wzrokiem od celu | częste, na koniec zamknięcie |
| złośliwy | 55–65 % | rzadkie, celne | 3–5 s wpatrywania | θ lekko w dół („spod łba”) | wolne, finał „Bu” |
| znudzony | 60 % | wolne | długie | dowolny | wolne; przewracanie oczami co 20–40 s |

## 2. Top 10

Kolejność łączy wartość dla syna i wystawy, zależności (fundament przed zabawą) i ryzyko. Pozycje 1–4 są warunkiem 5–10, nie konkurencją.

### Na tę Halloween

1. **Strażnik ruchu ze wspólnym budżetem serw, mapą dyni i „obrażoną dynią” (1, 2, 5).** Bez niego każda zabawa z toru 1 i 2 łamie limit 3–4 serw albo szarpie mechanizmem. Dlatego trzeba go ustalić przed projektem interfejsu. „Obrażona dynia” zamienia odmowę strażnika w żart.
2. **Automat domyślny z heartbeatem i powrotem do automatu (3, 4).** Safari w tle zrywa WebSocket i nie zawsze to zgłasza [F]. Bez tego oko zostaje tam, gdzie zostawiło je dziecko. Dynia ma działać bez żadnego telefonu.
3. **Dostęp: role, PIN, tryb wystawowy, jeden pilot z kolejką, hasło z kartą QR, limit 4 klientów (6–9, 11, 12).** Spełnia wymóg briefu: obce dziecko nie ma komendy, która zepsuje mechanizm albo wyłączy dynię.
4. **Serwis ze strony: kalibracja, tryb montażu, wyłączenie i wymiana oka, przegląd poranny, panel stanu, licznik ruchów, „Parkuj”, start bez skoku (14–23).** Kalibracja przez telefon jest decyzją z 18.10. Zapasowe moduły na wystawę już są w planie, a bez tej funkcji ich wymiana wymaga laptopa. Funkcje z `test-24h` (przyczyny restartu, środki w NVS) przechodzą na stronę prawie wprost.
5. **Palec dyryguje oczami: „Wszyscy tam!” i Fala z Dyrygentem (32, 33).** Największy efekt na 10 oczach tylko lewo–prawo, przy najmniejszym ryzyku: kaskada z natury mieści się w budżecie, a kod grupowy już istnieje. Działa bez dużego oka.
6. **Straszaki z dźwiękiem z telefonu (39–41, 44, 48–49, 55).** Zez, Rozbiegane, Statua, Zasypianie, a z dużym okiem „Bu!” i Zdziwienie, każdy z dźwiękiem. Dźwięk podwaja efekt, a działa po http po pierwszym stuknięciu. Mechanika robi tylko krótkie, gotowe ruchy.
7. **Sztuczka magika z Wyrocznią (38, 54).** Najwięcej „wow” towarzyskiego: przy kolegach dynia „słucha” syna. Technicznie to tylko inny układ tych samych poleceń. Działa też na samych małych oczach.
8. **Nagrywarka ruchów, wersja prosta (59).** 1–3 sloty i możliwość dodania do pokazu automatycznego. Daje synowi autorstwo przy prezentacji w szkole. Klocki (60) to rozbudowa na później.
9. **Pacynka dużego oka z mruganiem naturalnym (34, 45), jeśli duże oko będzie gotowe.** Najprostsza i najmocniejsza zabawa z dużym okiem: 2–3 serwa, prędkość ograniczona w firmware, kąty zamiast µs. Bez dużego oka ten punkt wypada, a reszta Top 10 zostaje.

### Później

10. **Duże oko jako postać z radaru: śledzenie z „za blisko!”, potem charakter automatyczny i Baba Jaga (67, 70, 66).** Śledzenie to zapisana decyzja i najlepsza atrakcja dla obcych dzieci, bo działa bez telefonu. Zależy od radaru, filtrowania w tłumie i gotowego dużego oka. Jeśli radar i oko zdążą, wersja podstawowa (67) może wejść już na tę Halloween.

**Tuż za Top 10:**
- Nastroje (53) i przewracanie oczami (47): potrzebują strojenia na prawdziwym oku.
- Refleks (62), Taniec (58) i Dynia mówi (56).
- Tryb cichy, oszczędny i limit ruchów (29): tanie, wchodzą od razu jako parametry strażnika.
- OTA (25): bardzo przydatne przy kilku dniach wystawy, ale ryzykowne bez cofnięcia wersji.
- Żyroskop i mikrofon: tylko z HTTPS (sekcja 4.3).

## 3. Odrzucone (żeby nie wracały)

**Safari i iPhone:**
- **Żyroskop, potrząsanie i mikrofon („krzyknij, a dynia się budzi”) na stronie po http:** Safari udostępnia je tylko w bezpiecznym kontekście (HTTPS) [F]. Wracają wyłącznie razem z HTTPS i certyfikatem zainstalowanym jako profil na telefonie syna; obce telefony na wystawie i tak ich nie dostaną.
- **Śledzenie twarzy kamerą telefonu:** kamera wymaga HTTPS, rozpoznawanie twarzy w Safari jest ciężkie, a na wystawie dochodzi wizerunek obcych dzieci.
- **Komendy głosowe („Dyniu, patrz w lewo”):** wymagają mikrofonu, czyli HTTPS, i najpewniej serwerów Apple, czyli internetu [Z].
- **Wibracja telefonu jako informacja zwrotna:** Safari na iOS nie ma `navigator.vibrate` [F].
- **Pełny ekran gry:** iPhone daje pełny ekran tylko dla `<video>` [F]. Zamiast tego ikona na ekranie początkowym [Z].
- **Pad do gier:** Gamepad API wymaga bezpiecznego kontekstu [F], a C3 nie ma Bluetooth Classic.
- **„Taniec do rytmu” z wykrywaniem rytmu z mikrofonu:** mikrofon wymaga HTTPS. Zastępuje to gotowa choreografia z dźwiękiem (58).
- **Captive portal jako główna strona:** mini-okno iOS nie ma trwałej pamięci, kasuje ciasteczka i zamyka się przy przełączeniu aplikacji [F, źródło wtórne]. Najwyżej ekran powitalny gościa.

**Mechanika i zasilanie:**
- **Wszystkie 10 oczu w jednej chwili:** 10–11 serw w ruchu przy limicie 3–4. Zawsze kaskada.
- **Ciągłe płynne śledzenie palca albo osoby wszystkimi małymi oczami:** stale 10 serw w ruchu. Zastępuje to podążanie skokami z kolejką (32).
- **Długie drżenie, „dreszcz” oczu, trzepot dłuższy niż ok. 1 s, serie szybkich mrugnięć:** zużywają plastikowe przekładnie SG90, grzeją MG90S i zwiększają ryzyko przytrzaśnięcia palca.
- **Fizycznie dokładne „patrzenie w punkt” przez oczy z boku:** oko w azymucie ±60° potrzebuje 64–77° do punktu na wprost przy zakresie ±25° [R]. Kąt obcinamy do granicy zakresu.

**Duże oko:**
- **Puszczanie oka i mruganie jedną powieką:** obie powieki napędza jedno serwo (koncepcja 2c, pkt 2.3).
- **Skośne powieki dla gniewu lub smutku:** powieka nie ma osi przechyłu.
- **Przewracanie, kiwanie i patrzenie góra–dół małymi oczami:** mają tylko oś lewo–prawo.

**Sieć, czujniki i zasilanie:**
- **„Oczy patrzą na telefon”:** ESP nie zna położenia telefonu, a radar nie wie, kto go trzyma.
- **Procent baterii powerbanku:** USB daje stałe 5 V bez informacji o naładowaniu, a breakout ma tylko zasilanie. Zastępuje to licznik energii (27).
- **Wyłączanie Wi-Fi, deep sleep albo wyłączanie PWM w nocy i w trybie oszczędnym:** sprzeczne z decyzją 22.10. Bez AP Baseus gaśnie, a przy zbyt małym poborze może się nie włączyć sam.
- **Dwie sieci, osobno dla gościa i rodzica:** C3 ma jeden interfejs AP; role robimy w aplikacji.
- **Uprawnienia po adresie MAC:** iOS ma prywatny, zmienny adres Wi-Fi [F]. Najwyżej jako dodatek.
- **Konta dla każdego dziecka:** za dużo dla wystawy; wystarczą trzy role i PIN.
- **Powiadomienia push, ranking online, sterowanie z domu:** dynia nie ma internetu (decyzja), a web push wymaga HTTPS.
- **Pozycja serw ze sprzężenia zwrotnego albo wykrycie zablokowanego oka bez czujnika:** SG90 i MG90S nie mają wyjścia potencjometru. Najwyżej jeden INA219 i test po jednym oku (28).
- **Czujnik prądu na każde serwo:** 13 czujników; jeden INA219 sekwencyjnie daje to samo.
- **Przycisk serwisowy na BOOT:** na SuperMini to GPIO9, czyli SCL magistrali I²C.

## 4. Ograniczenia techniczne wpływające na funkcje

### 4.1 Safari na iPhonie, strona z `http://192.168.4.1`

`http://192.168.4.1` i `http://*.local` nie są bezpiecznym kontekstem [F, [MDN Secure contexts](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts)]. Listę funkcji, które go wymagają, sprawdziłem sam: [MDN, features restricted to secure contexts](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts/features_restricted_to_secure_contexts).

| Funkcja | Po http | Źródło / status |
|---|---|---|
| Żyroskop i akcelerometr (DeviceOrientation/Motion) | **nie** | [F] lista MDN; inżynier WebKit: od iOS 13 wymagany bezpieczny kontekst, „no HTTP” ([WebKit 203287](https://bugs.webkit.org/show_bug.cgi?id=203287)). `requestPermission` wymaga też gestu: działa na `touchend` lub `click`, nie na `touchstart` ([yal.cc](https://yal.cc/js-device-motion/)) |
| Mikrofon i kamera (`getUserMedia`) | **nie** | [F] lista MDN; na http `navigator.mediaDevices` jest `undefined` ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)) |
| Blokada wygaszania ekranu (Wake Lock) | **nie** | [F] lista MDN. Skutek: ekran zgaśnie po czasie automatycznej blokady, Safari zerwie połączenie, a strona musi sama wrócić. Obejście: dłuższy czas blokady w ustawieniach telefonu syna |
| Service Worker (praca offline, PWA) | **nie** | [F] lista MDN |
| Gamepad | **nie** | [F] lista MDN |
| Wibracja (`navigator.vibrate`) | **nie, w ogóle** | [F] w Safari iOS brak (MDN browser-compat-data, `api/Navigator.json`) |
| Pełny ekran | **nie** (tylko `<video>`, niezależnie od http) | [F] [WebKit 240312](https://bugs.webkit.org/show_bug.cgi?id=240312), [caniuse](https://caniuse.com/fullscreen) |
| Dotyk, multi-touch, Pointer Events | **tak** | [Z] nie ma ich na liście MDN, to standard Safari |
| Web Audio i `<audio>` | **tak**, po pierwszym stuknięciu | [F] nie ma ich na liście MDN. [F] Przełącznik wyciszenia domyślnie wycisza Web Audio, a `<audio>` gra dalej ([WebKit 237322](https://bugs.webkit.org/show_bug.cgi?id=237322)). `navigator.audioSession.type = "playback"` pomaga, choć są głosy, że na iOS 18 nie zawsze ([WebKit 251532](https://bugs.webkit.org/show_bug.cgi?id=251532)). [Z] Najpewniej odtwarzać przez `<audio>` i sprawdzić na telefonie syna z włączonym wyciszeniem |
| Synteza mowy (`speechSynthesis`) | **tak** | [F] nie ma jej na liście MDN. [Z] polski głos offline może wymagać pobrania w Ustawieniach |
| Wgrywanie pliku (`<input type=file>`) | **tak** | [Z] |
| Ikona na ekranie początkowym | **tak**, bez pracy offline | [Z] do sprawdzenia, w tym tryb bez paska adresu |
| WebSocket po przejściu Safari w tło | zrywany | [F] serwer widzi zerwanie, a po długiej bezczynności `onclose` i `onerror` przestają dochodzić ([Apple Forums 696310](https://developer.apple.com/forums/thread/696310), [WebKit 247943](https://bugs.webkit.org/show_bug.cgi?id=247943)). Stąd heartbeat (4) |

### 4.2 iPhone w sieci dyni bez internetu

- **[F] Captive portal:** iOS sprawdza `captive.apple.com/hotspot-detect.html`. Jeśli nie dostanie „Success”, otwiera mini-okno bez localStorage i sessionStorage, które kasuje ciasteczka przy zamknięciu ([Purple](https://www.purple.ai/en-us/guides/why-captive-portal-isnt-loading-on-iphone), [Moddable](https://www.moddable.com/guides/captive-portal/)). Źródła są niespójne co do JS i limitu wielkości strony.
  - [Z] Czy w mini-oknie działa WebSocket, nie wiadomo.
  - Wniosek: syn i rodzic używają zwykłego Safari z zakładką albo ikoną.
- **[F] Sieć bez internetu:** wybór „bez internetu” zostawia telefon w sieci ([Apple Community](https://origin-discussions2-us-dr-prz.apple.com/thread/250330973)).
  - W wątku o AP z ESP32 pomogło ustawienie bramy i DNS na 0 w DHCP: ruch do internetu idzie wtedy przez sieć komórkową ([esp32.com](https://esp32.com/viewtopic.php?p=39189)).
  - [Z] Zachowanie Wi-Fi Assist na obecnym iOS trzeba sprawdzić na miejscu.
- **[F] Kod QR Wi-Fi:** aparat iPhone'a łączy z siecią od iOS 11 ([9to5Mac](https://9to5mac.com/2017/06/09/ios-11-scan-routers-qr-code-quickly-join-network/)).
- **[Z] mDNS (`dynia.local`):** w AP ESP32 prawdopodobnie działa (ESPmDNS jest w rdzeniu [L]), ale nie znalazłem potwierdzenia. Pewny jest stały adres 192.168.4.1 i zakładka.
- **[F] Prywatny adres Wi-Fi:** Fixed jest domyślny w sieciach WPA2, Rotating w otwartych ([Apple](https://support.apple.com/guide/security/sec31e483abf/web)). MAC nie identyfikuje roli.

### 4.3 HTTPS na ESP32-C3 (odblokowałoby żyroskop i mikrofon): tylko założenia

- [Z] Własne CA zainstalowane na iPhonie syna jako profil i oznaczone jako zaufane. Potrzebne także dla WebSocketów [F, [przykład code-server](https://gitea.daniil.it/danog/code-server/commit/e0a12201264b17052b909450761a1e5e5564fa73)].
- Są zgłoszenia, że iOS 18.3 przestał akceptować certyfikat z własnym podpisem bez zaufania w ustawieniach.
- [Z] TLS na jednym rdzeniu i ok. 400 KB RAM mocno obciąża pamięć przy każdym połączeniu.
- Ocena: osobny eksperyment po zbudowaniu reszty, tylko dla telefonu syna.

### 4.4 Co udźwignie ESP32-C3

| Wielkość | Wartość | Status |
|---|---|---|
| Klienci punktu dostępu | `softAP` `max_connection` domyślnie **4** | [F] [Arduino-ESP32 Wi-Fi API](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/wifi.html); [L] `WiFiAP.h`, komentarz w `WiFiAP.cpp`: zakres „1–4” |
| Górna granica w IDF | `ESP_WIFI_MAX_CONN_NUM` 15 (oprócz C2); DHCP najwyżej 8 urządzeń; 16 gniazd i 16 aktywnych TCP | [L] `esp_wifi_types_native.h`, `sdkconfig` (`CONFIG_LWIP_DHCPS_MAX_STATION_NUM 8`, `LWIP_MAX_SOCKETS 16`). [F] Limit dzieli sprzętowe klucze z ESP-NOW ([ESP-IDF, C3](https://docs.espressif.com/projects/esp-idf/en/stable/esp32c3/api-reference/network/esp_wifi.html)). Dokumentacja jest niespójna, realny sufit trzeba zmierzyć. Projektowo: **4 telefony** |
| WebSocket | ESPAsyncWebServer (fork ESP32Async): `DEFAULT_MAX_WS_CLIENTS 8`, `WS_MAX_QUEUED_MESSAGES 32` | [F] [AsyncWebSocket.h](https://github.com/ESP32Async/ESPAsyncWebServer). [L] Biblioteka nie jest zainstalowana; wbudowany `WebServer` nie ma WebSocketu |
| Opóźnienie i RAM | dziesiątki ms w lokalnym AP; kilkadziesiąt KB RAM na serwer z kilkoma klientami | [Z] nie znalazłem pomiaru na C3; zmierzyć ping-pongiem z panelu stanu (19) |
| Częstość poleceń z telefonu | ≤ ok. 20 Hz, martwa strefa 3–5°, ostatni cel na oko; firmware wygładza w kroku 20 ms (`KROK_MS`) | [Z]; [F] `KROK_MS` w `oczy-ruch.ino` |
| Flash | domyślnie 4 MB: nvs 20 KB, 2 × aplikacja po 1,25 MB (OTA), system plików 1,375 MB (strona i dźwięki), coredump 64 KB | [L] `tools/partitions/default.csv` |
| OTA, cofnięcie wersji | ArduinoOTA, HTTPUpdateServer, Update, LittleFS, DNSServer, ESPmDNS są w rdzeniu; `CONFIG_BOOTLOADER_APP_ROLLBACK_ENABLE 1` | [L]. [Z] czy rdzeń sam zatwierdza nową wersję od razu po starcie, trzeba sprawdzić |
| Watchdog | watchdog zadań 5 s z paniką, watchdog przerwań 300 ms; `loop()` niepilnowana, dopóki nie wywoła się `enableLoopWDT()` | [L]; zgodne z uwagą w `test-24h` |
| Brownout | detektor na poziomie 7, pilnuje szyny 3,3 V za LDO | [L]. [I] Spadki 5 V widzi dopiero przy głębokim zapadzie, więc słabo mierzy „baterię”. Do tego dzielnik (26) |
| PCA9685 po restarcie samego ESP | `begin()` robi restart MODE1, a nie reset ogólny, więc rejestry impulsów prawdopodobnie zostają; `getPWM()` jest w bibliotece | [Z, do testu]; podstawa startu bez skoku (23) |

### 4.5 Mechanika i ruch (z repo)

- **[F] Limit:** ok. 3–4 serwa w ruchu w całej dyni (brief). Analiza 18.10 proponuje najwyżej 4 i kolejkę. Czy 3, czy 4, wyjdzie z testu powerbanku, więc w firmware to jeden parametr.
- **[F] Sakada małego oka:** T = 120 + 6·|Δ°| ms (`oczy-ruch.ino`). 25° to 270 ms, a szczyt prędkości ok. 140°/s [R]. Śledzenie radarem: limit ok. 120°/s (`prezentacja-w-szkole.md`).
- **[R] Kaskada:** N oczu przy K wolnych miejscach trwa ok. ⌈N/K⌉·T. **Fala** z przesunięciem Δt ma naraz ⌈T/Δt⌉ serw, więc przy limicie 3 potrzeba Δt ≥ T/3.
- **[F] Prąd:** stojące serwo trzymające pozycję bierze 6–10 mA, a SG90 w ruchu 100–250 mA (`powerbank-a-obciazenie.md`). Liczy się liczba serw w ruchu, nie liczba oczu.
- **[R] Geometria „patrz na punkt”:** przy dyni R150 i ok. 49° azymutu między sąsiednimi oczami naprawdę w punkt patrzą tylko oczy w azymucie ±20°. Pozostałe dochodzą do granicy ±25°. Paralaksa między 0,5 a 2 m to ok. 5°, więc wystarczy kierunek, bez odległości.
- **[F] Duże oko (koncepcja 2c, w review):**
  - powieki mają jeden stopień swobody;
  - sprzężenie osi ≤ 4,5° kompensuje firmware, więc strona i scenki podają kąty oka, nie µs;
  - powieka zamyka się na palcu z siłą 5,6 N;
  - przed wyłączeniem PWM oko parkuje na wprost z zamkniętymi powiekami.
- **[F] Start:** serwa nie znają pozycji, więc pierwszy impuls po zaniku zasilania to skok (`polaczenia.md`). Scenka zakładająca znaną pozycję może ruszyć dopiero po pierwszym ruchu danego oka.
- **[K] Konflikt z ustaleniem z 18.10:** małe oczy nie reagują na radar. Dotyczy pomysłu 71 i wariantu „Bu!” z radarem. Decyzja należy do użytkownika.

## 5. Inspiracje (źródła torów)

- Disney Research, „Realistic and Interactive Robot Gaze”: stany wyższego poziomu nad mikroruchami ([IEEE Spectrum](https://spectrum.ieee.org/disney-research-robotic-gaze)). Tylko omówienie, nie artykuł.
- Zasady animacji oczu: mrugnięcie maskuje zmianę kierunku wzroku i musi mieć powód ([Animation Mentor](https://newsletters.animationmentor.com/newsletter/1105/feature_tiptricks.html)).
- Will Cogley: oko sterowane joystickiem, przyciskiem mrugnięcia i potencjometrem rozwarcia ([Hackster](https://hackster.io/news/creep-your-friends-out-with-this-3d-printed-eye-dd42d3434d7c)). To pierwowzór Pacynki.
- Czasy mrugnięcia człowieka ([PMC4015796](https://pmc.ncbi.nlm.nih.gov/articles/PMC4015796/)).
