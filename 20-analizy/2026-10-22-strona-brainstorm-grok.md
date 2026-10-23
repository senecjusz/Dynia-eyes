Przeczytam brief sprzętowy i analizy w repo, a potem złożę trzy niezależne tory pomysłów w jeden raport po polsku — bez zapisu plików.# Burza mózgów Grok: co ma umieć strona sterująca oczami dyni

Tylko odczyt repo. Trzy tory (syn i koledzy, choreografia i charakter dużego oka, rodzic i wystawa) są poniżej już połączone. Wyglądu interfejsu tu nie ma.

Oznaczenia: **[F]** fakt ze źródłem, **[Z]** założenie.

## 1. Lista pomysłów

Wspólna zasada dla wszystkich efektów ruchu **[F]** (`oczy-ruch.ino`, `polaczenia.md`, brief): serwo nie zna swojej pozycji, więc strona nie wysyła skoków kąta. Wysyła cel albo nazwę efektu, a układ robi sakadę ze smoothstepem (dziś ok. 120 ms + 6 ms/°). W ruchu naraz najwyżej 3–4 serwa w całej dyni. „Wszystkie oczy naraz” znaczy kolejkę, nie jednoczesny prąd.

| # | Nazwa | Co robi | Dla kogo | Wow | Trudność | Sprzęt | Ryzyko mechaniki i zasilania |
|---|---|---|---|---|---|---|---|
| 1 | Pokaz, gdy nikt nie steruje | Sam wraca do spoczynku: małe oczy rzadko i chaotycznie, duże zamknięte albo półprzytomne. Po 30–60 s bez komendy z telefonu zabawa się kończy. | Dzieci na wystawie, rodzic | 3 | 2 | Nic | Niskie. To jest dzisiejszy tryb `s` **[F]** (`oczy-ruch.ino`). |
| 2 | Jedno miejsce sterowania | Jeden telefon dostaje sterowanie na krótką kolejkę (kilkanaście–kilkadziesiąt sekund). Reszta może tylko patrzeć albo czekać na swoją kolej. Po czasie sterowanie wraca do pokazu. | Dzieci na wystawie | 4 | 2 | Nic | Niskie, o ile kolejka nie odpala efektów pełną mocą jeden po drugim bez pauzy. |
| 3 | Kłódka rodzica | Hasło Wi-Fi na kartce przy dyni oraz PIN w stronie do kalibracji, diagnostyki i „zatrzymaj wszystko”. Dzieci nie widzą mikrosekund, wyłączania PWM ani zakresu poza limitami. | Rodzic | 1 | 2 | Nic | Bez tego obce dziecko może zablokować serwo na ograniczniku. Sam PIN prądu nie zwiększa. |
| 4 | Palec prowadzi duże oko | Przeciąganie palcem po ekranie ustawia azymut i wysokość dużego oka. Małe oczy albo zostają w chaosie, albo 1–2 „prowadzące” idą w tę samą stronę. Oś góra–dól mają tylko duże oko. | Syn, dzieci | 5 | 3 | Nic (duże oko) | Dwa serwa gałki naraz. Trzecie tylko przy mrugnięciu. Trzeba limitu prędkości (propozycja ze szkoły: ok. 120°/s i martwa strefa ±5° **[F]** `2026-10-18-prezentacja-w-szkole.md`) i 2° zapasu przed ogranicznikami **[F]** koncepcja 2c, pkt 8. |
| 5 | Emocje dużego oka | Krótkie scenki: zdziwienie (szeroko + w górę), sen (zamknięcie, gałka na wprost), przebudzenie (otwarcie i jedno rozejrzenie), nieufność (przymknięte + wolny ruch w bok), „łypnięcie” (szybka sakada i powrót). Powieki są sprzężone jednym serwem: mruga się obiema naraz, nie da się puścić oka **[F]** koncepcja 2c, pkt 2.3. | Syn, dzieci | 5 | 2 | Nic | Jedno serwo powiek plus najwyżej dwa gałki. Mrugnięcie krótkie (w koncepcji rząd 0,1 s). Nie trzymać powieki na ograniczniku. |
| 6 | Chór małych oczu | Wszystkie patrzą w lewo, w prawo albo na wprost, z kolejką (w kodzie już jest `wszystkieWStrone`, limit `MAX_RUCHOW`) **[F]**. | Dzieci | 5 | 2 | Nic | Średnie, jeśli ktoś skróci kolejkę i ruszy 10 SG90 naraz. Zostawić 2–4 naraz. |
| 7 | Fala | Oczy od lewej do prawej robią tę samą sakadę z opóźnieniem. Rodzic raz ustala kolejność oczek na dyni. | Dzieci | 5 | 2 | Nic | Niskie, fala z natury jest szeregowa. |
| 8 | Zez i „przewracanie” | Zez: lewe oczy w prawo, prawe w lewo (każde i tak ma tylko lewo–prawo). „Przewracanie oczami” to karykatura: duże oko w górę, potem w bok. Nie ma osi obrotu źrenicy **[F]** koncepcja 2c: ψ i θ, źrenica okrągła. | Syn | 4 | 2 | Nic | Niskie, w zakresie ±25°. |
| 9 | Spłoszenie | Przez 2–3 s szybsze, krótsze sakady małych oczu i otwarte duże oko. Potem sam powrót do spoczynku. | Dzieci | 4 | 2 | Nic | Średnie przy długim trzymaniu. Twardy limit czasu i ta sama kolejka 3–4 serw. |
| 10 | Scenka „strach” | Odliczanie na telefonie, potem chór na wprost, duże oko otwarte i krótki ruch w górę. Dźwięk z głośnika telefonu (syntezator w przeglądarce, gest użytkownika). | Syn i koledzy | 5 | 2 | Nic | Jak chór. Dźwięk jest w telefonie, nie w dyni. |
| 11 | Nagraj i puść | Syn układa kilka ruchów (kierunki, mrugnięcie, fala) i odtwarza je klasie. Zapis siedzi w telefonie. Układ dostaje tylko kolejne cele. | Syn | 5 | 3 | Nic | Średnie, jeśli pętla jest bez końca. Limit długości i obowiązkowy powrót do pokazu. |
| 12 | Powtórz wzór | Dynia pokazuje 2–4 ruchy (lewo, prawo, mrugnięcie). Dziecko powtarza na ekranie. Telefon ocenia, dynia „kiwa” albo mruga przy sukcesie. | Syn, dzieci | 4 | 3 | Nic | Niskie, wzorce są krótkie i z kolejki. |
| 13 | Twoja kolej | Ta sama gra na jednym telefonie, przekazywanym z rąk do rąk, z punktami na tym telefonie. Bez wielu sterowników naraz. | Dzieci na wystawie | 4 | 2 | Nic | Niskie. |
| 14 | Kto stoi przede mną | Duże oko wybiera jedną osobę (najbliższa w strefie, przyklejenie na kilka sekund) i patrzy na nią. Im bliżej, tym niżej **[F]** ustalenie 18.10 w `wykrywanie-ruchu.md` i filtr w `prezentacja-w-szkole.md`. W tłumie co 20–40 s chór małych oczu w jej stronę, potem znowu chaos. | Dzieci | 5 | 4 | Radar HLK-LD2450 | Średnie: bez filtra serwa drżą **[F]** analiza szkoły. Ruch dużego oka to 2 serwa; chór i tak kolejką. |
| 15 | Budzik bez radaru | PIR albo sam próg „ktoś jest”: duże oko się otwiera, małe przyspieszają. Kierunku nie ma. PIR już jest **[F]** `sprzet.md`. W tłumie PIR będzie wisiał na „jest ruch” **[F]** analiza szkoły, więc to zapas, nie śledzenie. | Dzieci | 3 | 2 | PIR (jest) | Niskie, o ile „aktywny” nie oznacza ciągłego ruchu wszystkich. |
| 16 | Tryb wystawy | Rodzic włącza na dzień: tylko pokaz + budzik/radar, telefony mogą oglądać, nie sterować. Osobno „bawimy się” na czas syna. | Rodzic | 2 | 2 | Nic | Najbezpieczniejszy prądowo, jeśli spoczynek zostaje rzadki. |
| 17 | Zatrzymaj i parkuj | Jedno polecenie: płynnie na środki, powieki w pozycji spoczynku, koniec efektu. Nie „odetnij PWM” z telefonu dziecka. | Rodzic | 1 | 1 | Nic | Niskie. Wyłączenie PWM przy pustym powerbanku grozi ucięciem zasilania **[F]** test 22.10: bez Wi-Fi Baseus odcinał prąd; AP ma zostać włączony. |
| 18 | Diagnostyka rodzica | Czas od włączenia, liczba restartów, przyczyna z NVS (zasilanie, brownout, watchdog – już jest w `test-24h`) **[F]**, liczba telefonów, które oko wyłączone z ruchu, wolny suwak jednego kanału. | Rodzic | 1 | 3 | Nic | Suwak tylko wolny (`g` jak w `kalibracja/`). Bez procentu baterii: nie ma miernika. |
| 19 | Kalibracja środków | Dla każdego małego oka środek w µs, zapis w NVS (firmware testu 24 h już tak robi) **[F]**. Dla dużego oka: na wprost, zakres ψ/θ, powieki otwarte/zamknięte, limity 2° przed stopem. | Rodzic | 1 | 4 | Nic | Średnie przy złym zakresie: serwo na ogranicznik. Tylko za PIN-em, tylko powoli. |
| 20 | Mapa oczek | Rodzic raz mówi, które oko jest z lewej, które z boku. Fala, zez i „patrz na osobę” używają tej kolejności. | Rodzic | 2 | 2 | Nic | Żadne, dopóki kąty zostają w ±25°. |
| 21 | Dźwięk z telefonu | Krótki dźwięk w Safari przy strachu, wygranej i przebudzeniu. Plik albo synteza w stronie, głośnik iPhone’a. | Syn, dzieci | 4 | 2 | Nic | Brak obciążenia serw. Słychać głównie przy uchu albo z głośnika telefonu, nie „z dyni”. |
| 22 | Klaśnięcie budzi oko | Telefon słucha głośności (nie słów). Klaśnięcie otwiera duże oko. | Syn | 4 | 3 | Nic | Ruch jak przebudzenie. Działa tylko przy HTTPS, patrz pkt 4. |
| 23 | Ster z przechyłu telefonu | Pochylenie iPhone’a obraca duże oko. Osobna zabawa „pilot”, nie tryb na cały dzień. | Syn | 5 | 4 | Nic | Dwa serwa, obowiązkowe wygładzenie. Bez HTTPS i zgody iOS nie wystartuje, patrz pkt 4. |
| 24 | Głos dyni | Słowa z głośnika w dyni, zsynchronizowane z powiekami. | Dzieci | 5 | 5 | Głośnik i wzmacniacz, których nie ma na liście sprzętu **[F]** `sprzet.md` | Prąd głośnika dochodzi do tego samego powerbanku. Na tę Halloween nie zakładać. |

Wow i trudność: 1 najmniej, 5 najwięcej, w skali tej dyni (ESP32-C3, Safari, jeden PCA9685, limit 3–4 serw).

## 2. Top 10

**Na tę Halloween**

1. **Pokaz, gdy nikt nie steruje (1) + tryb wystawy (16).** Dynia ma być żywa przez kilka dni bez telefonu. Strona jest dodatkiem. Po odejściu dziecka sam wraca do rzadkiego chaosu małych oczu. Zgodne z decyzją 18.10: na co dzień małe oczy nie gonią ludzi **[F]** `wykrywanie-ruchu.md`. Sterowanie z telefonu jest chwilowym wyjątkiem, o który prosi użytkownik 22.10.
2. **Kłódka rodzica (3) i jedno miejsce sterowania (2).** Przy dyni będą obce dzieci. Hasło Wi-Fi nie wystarczy, gdy hasło jest na kartce. PIN odcina kalibrację i parkowanie. Jedna kolejka odcina wojnę dwóch telefonów o te same serwa.
3. **Chór, fala, zez (6, 7, 8).** Największy efekt na sprzęcie, który już jest (małe oczy, jeden stopień swobody). Fala wygląda jak postać, a prąd zostaje w kolejce.
4. **Emocje dużego oka (5),** gdy mechanizm 2c stanie. Mrugnięcie, sen i zdziwienie dają charakter przy trzech serwach i sprzężonych powiekach. Jak dużego oka nie będzie na wystawę, te same przyciski mogą zostać w stronie i nic nie robić.
5. **Palec prowadzi duże oko (4).** To jest „pobawić się”, o które chodzi 22.10. Telefon wysyła cel kilka razy na sekundę, układ sam jedzie smoothstepem. Małych oczu nie podpinać wszystkich pod palec.
6. **Scenka strachu (10) i dźwięk z telefonu (21).** Wow dla 8-latka bez nowego sprzętu. Dźwięk jest w Safari, więc nie trzeba głośnika w dyni.
7. **Nagraj i puść (11) albo powtórz wzór (12).** Jedna z tych dwóch, nie obie naraz, jeśli czas implementacji będzie krótki. Nagranie jest „skustomizowane dla synka”. Powtórz wzór lepiej znosi kolejkę dzieci przy stole. Obie używają tego samego odtwarzacza celów.
8. **Zatrzymaj i parkuj (17) + diagnostyka bez procentu baterii (18).** Rodzic widzi, czy dynia wstaje po zaniku prądu, i wyłącza jedno zatarte oko z ruchu. Procentu naładowania ESP z USB nie poda **[Z]**.
9. **Budzik (15) od razu, śledzenie radarem (14) tylko jeśli LD2450 jest zamontowany.** PIR leży w warsztacie. Radaru na liście „mamy” nie ma, jest „do zamówienia” **[F]** `sprzet.md`. W tłumie bez filtra z analizy szkoły radar zaszkodzi serwom.
10. **Mapa oczek (20) i kalibracja środków (19) schowane za PIN-em.** Bez mapy fala i zez są przypadkowe. Środki i tak trzeba wpisać (NVS już to umie dla małych oczu).

**Później**

- Przechył telefonu (23) i klaśnięcie (22): zależą od HTTPS i zgody iOS (pkt 4). Na stronie otwieranej jako `http://192.168.4.1` ich nie będzie.
- Głos z wnętrza dyni (24): nowy sprzęt i prąd.
- Osobne powieki (puścić oko, powieka podąża za góra–dół): czwarte MG90S, a koncepcja 2c sama pisze, że wtedy brakuje kanału albo zapasu serwa **[F]** pkt 2.3.
- Prawdziwe obroty gałki, procent baterii, wiele telefonów sterujących naraz.

## 3. Odrzucone

- **Rozpoznawanie słów** („powiedz dyni hasło”). `webkitSpeechRecognition` w Safari woła silnik Apple i w praktyce potrzebuje sieci oraz zgody mikrofonu **[F]** wsparcie od iOS 14.5, kontekst bezpieczny. Punkt dostępu dyni nie ma internetu **[F]** brief. Zostaje co najwyżej klaśnięcie liczone lokalnie w telefonie, i to dopiero po HTTPS.
- **`navigator.vibrate`.** Safari na iPhonie tego nie ma **[F]** WebKit nie implementuje Vibration API. Wibracja nie jest nagrodą w grze.
- **Generic Sensor API** (`new Gyroscope()`). Safari tego nie ma. Jest tylko `DeviceOrientationEvent` po zgodzie **[F]** [MDN `requestPermission`](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent/requestPermission_static).
- **Żyroskop i mikrofon na stronie HTTP.** Oba wymagają bezpiecznego kontekstu **[F]** [MDN `getUserMedia`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia). Adres `http://192.168.4.1` nim nie jest. `localhost` tak, ale telefon nie otwiera układu jako localhost.
- **Sterowanie z okienka „zaloguj się do sieci”.** Captive Network Assistant na iOS to nie pełny Safari i psuje czujniki oraz HTTPS **[F]** praktyka WebKit, m.in. kontekst błędu [288844](https://bugs.webkit.org/show_bug.cgi?id=288844). Po połączeniu z Wi-Fi strona ma się otwierać w Safari.
- **Aplikacja, Web Bluetooth, Bluetooth Classic.** Użytkownik chce Safari. ESP32-C3 nie ma Bluetooth Classic **[F]** brief. Web Bluetooth w Safari na iOS nie jest drogą do tej dyni.
- **Procent baterii.** Nie ma pomiaru napięcia ogniwa ani licznika kulombów. Powerbank jest za USB **[F]** `sprzet.md`, `decyzje.md` 20.10.
- **Skok wszystkich serw na raz, trzęsienie, „szarpnięcie dla straszności”.** Sprzeciwia się limitowi 3–4 serw i zasadzie płynnego startu **[F]** brief, `oczy-ruch.ino`.
- **Dziecko wyłącza PWM albo wpisuje mikrosekundy.** PWM trzyma pozycję; odcięcie przy małym poborze wiąże się z gaśnięciem Baseusa **[F]** `test-powerbank-wifi.ino` (22.10 bez Wi-Fi odcinał co ok. 15 s). AP zostaje włączony niezależnie od strony.
- **Kamera telefonu jako oczy dyni, strumień wideo na ESP, ESP32-CAM.** Za dużo RAM i prądu jak na jeden rdzeń i brak takiej części w projekcie. Radar albo PIR wystarcza do „ktoś jest”.
- **Prawdziwe przewrócenie oka** (obrót gałki wokół osi patrzenia). Mechanizm 2c tego nie ma **[F]** koncepcja 2c.
- **Niezależne mrugnięcie jedną powieką** przy sprzężeniu jednym MG90S **[F]** koncepcja 2c, pkt 2.3.
- **Długa choreografia zapisana w NVS układu.** Pamięć jest na środki i liczniki. Nagranie syna trzyma telefon i wysyła cele.
- **Kilkanaście telefonów na WebSocket.** Miękki limit praktyczny to kilka klientów (pkt 4), a i tak sterować może jeden.
- **Walka palca z radarem.** Dwa źródła celu naraz dają drganie. W trybie zabawy radar milknie. W trybie wystawy milknie palec.

## 4. Ograniczenia techniczne

**Safari na iPhonie**

- Strona z punktu dostępu bez internetu działa: HTML, przyciski, zapis w `localStorage`, rysowanie, dźwięk wygenerowany w stronie. Dźwięk startuje po geście (puknięcie). Plików z sieci nie dociągnie.
- Pełny ekran nie jest podstawą zabawy. Pasek Safari może zostać. **[Z]** dokładna wersja iOS syna nie jest w repo. Nie opierać efektu na Fullscreen API.
- Żyroskop: `DeviceOrientationEvent.requestPermission()` z obsługi puknięcia, i tylko na HTTPS **[F]** [MDN](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent/requestPermission_static).
- Mikrofon: `getUserMedia({audio:true})` tylko na HTTPS i po zgodzie **[F]** [MDN](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia). Głośność da się liczyć w telefonie. Rozpoznanie mowy bez internetu odpada.
- Wibracji nie ma **[F]** Vibration API poza WebKit na iOS.
- HTTPS na ESP32-C3 da się zrobić samopodpisanym certyfikatem **[F]** [esp_https_server](https://docs.espressif.com/projects/esp-idf/en/latest/esp32c3/api-reference/protocols/esp_https_server.html). iPhone za każdym razem będzie pytał o zaufanie do certyfikatu. Dopóki żyroskop i mikrofon nie są potrzebne, strona powinna zostać przy HTTP: mniej tarcia przy stole w szkole i prostszy WebSocket (`ws://`). Certyfikat włącza się dopiero razem z przechyłem i klaśnięciem, a wtedy socket musi być `wss://`, bo Safari blokuje mieszaną treść.
- Okienko logowania do Wi-Fi nie zastępuje Safari.

**ESP32-C3**

- Jeden rdzeń 160 MHz, ok. 400 KB RAM, Wi-Fi 2,4 GHz **[F]** brief i `sprzet.md`. Ruch serw zostaje w układzie (krok 20 ms już jest). Telefon nie powinien wysyłać 13 kątów 50 razy na sekundę. Wystarczy nazwa efektu albo cel dużego oka koło 10 Hz. Układ wygładza.
- Punkt dostępu: w Arduino `softAP` domyślnie bierze 4 stacje. Sterownik IDF na ESP32-C3 ma wyższy sufit (w aktualnych opisach rzędu 10) **[F]** [Wi-Fi driver, ESP32-C3](https://docs.espressif.com/projects/esp-idf/en/stable/esp32c3/api-guides/wifi.html), [Arduino WiFi `softAP`](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/wifi.html). Na wystawę świadomie zostać przy 4: jeden sterujący, reszta co najwyżej ogląda.
- WebSocket na tym RAM: rozsądnie 4 klientów przy małych ramkach **[Z]** z praktyki stosu lwIP, nie z pomiaru tej dyni. Po starcie Wi-Fi zostaje rząd 200 KB sterty **[Z]**. Nie trzymać w RAM nagrania ani dużego JSON.
- Opóźnienie na własnym AP przy krótkiej ramce zwykle mieści się w czasie jednej sakady **[Z]**, nie mierzone w tym projekcie. Palec i tak nie może być szybszy niż limit prędkości serwa.
- PCA9685: 16 kanałów **[F]**. Koncepcja 2c daje kanały 13–15 dużemu oku i 0–12 małym **[F]** pkt 8. Dziesięć małych plus trzy duże mieszczą się na jednym sterowniku.
- Brak odczytu pozycji. Ekran pokazuje ostatni cel, nie to, gdzie dziecko przekręciło gałkę ręką.
- Zasilanie: kolejka 3–4 serw, sakady bez skoku, efekt sam się kończy. Start po zaniku prądu nie może oprzeć serwa o ogranicznik (koncepcja 2c, pkt 8, już to opisuje dla dużego oka).
- AP zostaje włączony cały czas, także w spoczynku **[F]** ustalenie 22.10 i szkic `test-powerbank-wifi`.

**Sprzęt, który zmienia listę funkcji**

- Duże oko jest koncepcją w review, nie złożonym mechanizmem **[F]** `2026-10-22-duze-oko-2c-koncepcja.md`. Strona ma działać na samych małych oczach.
- Radar LD2450 widzi do 3 osób, kąt i odległość, nie wysokość **[F]** `wykrywanie-ruchu.md`. Na góra–dół zostaje reguła „bliżej = niżej”. W tłumie bez filtra (strefa, przyklejenie 3–5 s, martwa strefa, limit prędkości) serwa będą drżeć **[F]** analiza szkoły.
- Decyzja 18.10 (małe oczy zawsze chaotyczne, czujnik tylko dla dużego oka) dotyczy pokazu autonomicznego. Strona na chwilę ją zawiesza i oddaje stery pokazowi, gdy telefon zniknie.
