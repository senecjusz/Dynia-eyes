# Strona dyni: zestawienie funkcji z burzy mózgów E7.1 (23.10)

To zestawienie łączy sześć niezależnych raportów napisanych na briefie `30-projekt/brief-e7-strona-brainstorm.md`. Nie dodaje własnych pomysłów. Uwagi zestawiającego są oznaczone **[uwaga zestawienia]**.

**Skróty uczestników:**
- **OA**: Opus A (`2026-10-22-strona-brainstorm-opus-a.md`),
- **OB**: Opus B (`…-opus-b.md`),
- **AS**: Astra / Codex (`…-astra.md`),
- **GR**: Grok (`…-grok.md`),
- **KI**: Kimi (`…-kimi.md`),
- **AR**: Argon / Gemini (`…-argon.md`).

**Oznaczenia:**
- „Wow” i „Trudność” to średnia ocen uczestników w skali 1–5, w nawiasie zakres. Gdy uczestnik podał przedział (np. 2–3), liczony jest jego środek.
- **[unikat]**: pomysł tylko u jednego uczestnika, a wyraźnie dobry.
- **[K]**: konflikt z decyzją z 18.10: „Małe oczy zawsze chaotyczne, bez czujnika; na ruch reaguje tylko duże oko” (`decyzje.md`, wiersz 24).
- „Link” oznacza, że uczestnik podał źródło w sieci; „repo” – plik w repozytorium; „[L]” – odczyt lokalnych plików rdzenia esp32 3.3.12 (tylko OA).

---

## 1. Najważniejsze fakty i ograniczenia

### 1.1 Safari na iPhonie, strona z `http://192.168.4.1`

| Fakt | Kto podał | Źródło | Zgoda / spór |
|---|---|---|---|
| `http://192.168.4.1` (i `dynia.local`) **nie jest bezpiecznym kontekstem** | wszyscy | link: OA (MDN, lista funkcji sprawdzona osobiście), OB, AS, GR, KI (MDN); AR bez linku | zgoda |
| **Żyroskop / przechył** (`DeviceOrientation`) po http **nie działa**; do tego `requestPermission()` wymaga gestu (`touchend`/`click`) | wszyscy | link: OA (MDN, WebKit 203287, yal.cc), OB (MDN, yal.cc), AS, GR, KI (MDN) | zgoda. KI pisze „najpewniej nie, do potwierdzenia testem” |
| **Mikrofon i kamera** (`getUserMedia`) po http nie działają; `navigator.mediaDevices` = `undefined` | wszyscy | link: OA, OB, AS, GR, KI (MDN) | zgoda |
| **Rozpoznawanie mowy** potrzebuje mikrofonu i zwykle serwerów Apple (internetu) | OA, OB, AS, GR, AR | link: OB (Apple forum 775699); reszta bez linku | zgoda |
| **Wake Lock** (ekran nie gaśnie) tylko po HTTPS → po zgaszeniu ekranu Safari zrywa połączenie | OA, OB, AR | link: OA, OB (MDN) | zgoda. Obejście: dłuższa autoblokada w telefonie syna (OA, OB) |
| **Wibracja**: Safari na iOS nie ma `navigator.vibrate` w ogóle | wszyscy | link: OA, AS (MDN BCD), OB (caniuse), KI (MDN); GR, AR bez linku | zgoda |
| **Pełny ekran** (Fullscreen API) na iPhonie tylko dla `<video>` | OA, OB, AS, GR, KI | link: OA, OB (WebKit 240312), AS (MDN BCD) | zgoda |
| **Ikona na ekranie początkowym** daje tryb bez pasków Safari | AR i KI jako fakt; OA, OB jako niesprawdzone | AR, KI bez linku; OB link na forum (moodeaudio) | **spór:** AR pisze, że strona „jest pamiętana w cache”, ale OA i OB zauważają, że praca offline (Service Worker) wymaga HTTPS. Do sprawdzenia na telefonie |
| **Dźwięk z telefonu** działa po http, ale dopiero po pierwszym stuknięciu | wszyscy | link: OA, OB (WebKit 237322, 251532, 264473), AS (WebKit, polityka autoplay) | zgoda |
| **Przełącznik wyciszenia** wycisza Web Audio | OA, OB, AR | link: OA, OB (WebKit) | obejścia się różnią, ale nie przeczą sobie: OA i OB proponują `<audio>` (gra mimo wyciszenia) oraz `audioSession.type = "playback"` (na iOS 18 zawodne); AR – głośnik Bluetooth sparowany z iPhone'em |
| **Synteza mowy** działa (po geście); polski głos offline niepewny | OA, OB | link: OB (Apple forum) | zgoda, polski głos = założenie |
| **WebSocket po zablokowaniu ekranu lub przejściu w tło** ginie, często bez `onclose` → potrzebny heartbeat | OA, OB | link: OA, OB (Apple forum 696310, WebKit 247943) | AS: „nie potwierdzono”, wniosek ten sam (ESP sam wraca do automatu) |
| **localStorage** działa po http | GR, AR (AR chce w nim trzymać nagrania) | bez linku | **zastrzeżenie OB:** ITP kasuje pamięć zapisaną skryptem po 7 dniach bez wizyty (źródło wtórne, Didomi) → konfiguracji i nagrań nie trzymać tylko w telefonie |
| **Okno captive portal (CNA)** to okrojony WebKit: bez trwałych ciasteczek, zamyka się przy zmianie aplikacji → nie może być główną drogą | OA, OB, GR, KI, AR; AS: „nie jedyna droga” | link: OA, OB (Purple, Moddable, esp8266.com), GR (WebKit 288844) | zgoda co do celu, różne recepty: OB – ESP odpowiada „Success” na `captive.apple.com/hotspot-detect.html`; AR – ESP nie uruchamia fałszywego DNS; OA – brama i DNS = 0 w DHCP |
| **iPhone zostaje w sieci bez internetu** (wybór „bez internetu”) | OA, OB, AS | link: AS (Apple 102554), OA (Apple Community, esp32.com), OB (Apple 127686: Connectivity Assist, warunki niejawne) | zgoda; zachowanie na obecnym iOS do sprawdzenia |
| **Kod QR Wi-Fi** w aparacie iPhone'a łączy z siecią | OA | link (9to5Mac) | – |
| **Prywatny adres MAC** (stały albo rotujący) → MAC nie identyfikuje osoby | OA, OB | link (Apple) | zgoda |
| **HTTPS na ESP** (odblokowałby żyroskop, mikrofon i Wake Lock) | wszyscy | link: OB (ESP-IDF: ok. 40 KB RAM na gniazdo TLS; Start9; Apple forum – błąd iOS 18), GR (esp_https_server) | **spór o koszt dla użytkownika:** OA i OB – własne CA instalowane raz jako profil z ręcznym „pełnym zaufaniem”; GR – „iPhone za każdym razem będzie pytał”; AR – pełnoekranowe ostrzeżenie i „często blokuje `wss://`” (bez linku). Wszyscy: nie w wersji bazowej |

### 1.2 ESP32-C3 i punkt dostępu

| Fakt | Kto podał | Źródło | Zgoda / spór |
|---|---|---|---|
| Arduino `softAP(…, max_connection)` **domyślnie 4** | OA, OB, AS, GR | link: dokumentacja Arduino-ESP32; OA także [L] (komentarz w `WiFiAP.cpp`: zakres 1–4) | zgoda |
| **Sufit sterownika IDF dla C3** | AS, GR: **10** stacji; OA: **15** (`ESP_WIFI_MAX_CONN_NUM`, [L]), DHCP najwyżej 8, 16 gniazd lwIP; OB: dla C3 nie znalazł (FAQ ESP32: 10); KI: „4–10” | AS, GR (ESP-IDF, link), OA [L] + link | **sprzeczne liczby (10 a 15)**. OA sam pisze, że dokumentacja jest niespójna i sufit trzeba zmierzyć |
| **Ilu klientów zakładać** | OA: 4 (syn, rodzic, 2 goście); AS, GR: do 4, sterujący 1; KI: 1–2 sterujących i kilku oglądających; OB: 2–4, a obcy w ogóle się nie łączą; **AR: `max_connection` = 1 (najwyżej 2)** | AR powołuje się na `test-24h.ino` | **spór**. [uwaga zestawienia] W repo oba szkice testowe (`test-24h.ino`, `test-powerbank-wifi.ino`) mają dziś 1 klienta. OB: po zmianie liczby klientów albo mocy TX trzeba powtórzyć test podtrzymania powerbanku |
| **WebSocket**: ESPAsyncWebServer domyślnie 8 klientów WS, kolejka 32; trzeba wołać `cleanupClients()`, duże ramki zjadają stertę | OA, OB | link: OA (GitHub ESP32Async), OB (dokumentacja ESP32Async, esp32.com) | zgoda. OA [L]: biblioteka nie jest zainstalowana, wbudowany `WebServer` nie ma WS. AS: WS ma też `esp_http_server` z ESP-IDF (link) |
| **Opóźnienie** w AP | OB: echo 16–60 ms, TCP 40–50 ms (pomiary innych na esp32.com); reszta: „dziesiątki ms” | link: OB | nikt nie mierzył na C3 z WS; OA proponuje ping-pong w panelu stanu |
| **Częstość poleceń z telefonu**: 10–20 Hz, tylko najnowszy cel, firmware wygładza w kroku 20 ms | OA, AS, GR, KI, AR | repo (`KROK_MS` w `oczy-ruch.ino`) | zgoda |
| **PCA9685 generuje impulsy sam**, więc Wi-Fi na jednym rdzeniu nie powoduje drgań serw | OB (jako interpretację), AR (jako fakt) | OB link (LKML) | zgoda |
| **I²C 400 kHz** i wysyłanie tylko do serw w ruchu skraca cykl | AR [unikat] | założenie | – |
| **Zapis NVS** wstrzymuje wykonywanie z flash → zapisywać po „Zapisz”, nie przy ruchu suwaka | AR; OB: obecny `test-powerbank-wifi` zapisuje impuls co 100 ms ruchu, przy 13 serwach zużyje flash w około miesiąc [rachunek] → zapisywać cel sakady | repo | zgoda |
| **Flash 4 MB, domyślny podział**: 2 × 1,25 MB aplikacji (OTA), 1,375 MB system plików, NVS 20 KB, coredump 64 KB; cofanie wersji włączone | OA [L] | lokalne pliki rdzenia | **sprzeczne z KI**, który odrzuca OTA, bo „dwie partycje OTA zajmują prawie całe 4 MB”. Odczyt OA pokazuje, że mieszczą się obok systemu plików |
| **Watchdog pętli** w rdzeniu domyślnie wyłączony (`enableLoopWDT()`); `test-24h` go nie włącza | OA [L], OB (repo) | – | zgoda |
| **Słaba antena SuperMini**: zaleca się moc 8,5 dBm | OB | link (Hackaday, forum Arduino) | OB: każdą zmianę mocy sprawdzić `test-powerbank-wifi` |
| **Głośnik w dyni sterowany przez ESP** | GR: wymaga głośnika i wzmacniacza, których nie ma; KI: „C3 bez I2S/DAC”; AS: C3 nie ma Bluetooth Classic, więc nie wyśle dźwięku do głośnika A2DP | – | [uwaga zestawienia] twierdzenie KI o braku I2S nie ma źródła i inni go nie powtarzają; według mojej wiedzy C3 ma interfejs I2S – do sprawdzenia, jeśli temat wróci |
| **Głośnik Bluetooth sparowany z iPhone'em**: iOS trzyma naraz Wi-Fi z dynią i dźwięk po Bluetooth | AR (jako fakt) | bez linku | OB, AS wspominają głośnik BT jako opcję |

### 1.3 Mechanika i zasilanie

| Fakt | Kto podał | Źródło | Zgoda / spór |
|---|---|---|---|
| **Najwyżej 3–4 serwa w ruchu w całej dyni**; „wszystkie oczy naraz” = kaskada albo fala | wszyscy | brief, `prezentacja-w-szkole.md` | zgoda |
| **Duże oko to 3 serwa** (ψ, θ, powieki); przy limicie 3 małe oczy czekają | OA, OB, AS, GR | koncepcja 2c | zgoda |
| **Czas kaskady i fali**: sakada T = 120 + 6·\|Δ°\| ms (repo); kaskada N oczu ≈ ⌈N/K⌉·T, fala potrzebuje kroku Δt ≥ T/3; 10 oczu w 0,8–1,4 s | OA (rachunek); OB: 5 par ≈ 1,3 s; AR: krok ≥ 130 ms przy T = 420 ms; KI: starty co ok. 150 ms | repo | zgoda co do zasady |
| **Obecny kod**: `MAX_RUCHOW = 2` liczy tylko małe oczy | OA | repo | – |
| **Obecny kod**: komenda `c` centruje wszystkie oczy naraz, a `setup()` od razu podaje środki | AS [unikat] | repo | – |
| **Serwa nie znają pozycji**; pierwszy impuls po zaniku zasilania to skok | OA, AS, GR, AR | repo (`polaczenia.md`) | **niuans:** AR i OA (pkt 22) piszą, że parkowanie przed odłączeniem „eliminuje skok”. AS i OA (pkt 23): tylko jeśli nikt nie przestawił oka ręką, a samą rampą nie da się obiecać łagodnego pierwszego ruchu |
| **Prąd SG90**: stojące 6–10 mA, w ruchu 100–250 mA | OA | repo (`powerbank-a-obciazenie.md`) | – |
| **Prąd zablokowanego SG90** | OB: ok. 0,36 A; AR: do ok. 0,7 A | AR repo (`2026-10-17-zasilanie-powerbank.md`); OB bez źródła | **sprzeczne liczby** |
| **Szczyt prądu przy 13 serwach** | KI: ok. 1,45 A przy porcie 3 A („z repo”); AR: przy jednoczesnym starcie 13 serw 4–6 A [założenie] | – | **sprzeczne**; prawdopodobnie różne scenariusze (z kolejką i bez), żaden nie podał rachunku |
| **Wyłączanie PWM (sen, stop, parkowanie, oszczędzanie)** | za: KI (po zaśnięciu i w nocy), AR (zdejmować impuls z małych oczu stojących > 5 s; parkowanie z PWM off), OB (sen, stop, tryb przytulenia; AP z ESP ok. 85 mA nadal trzyma powerbank [założenie]); przeciw: OA (żaden przełącznik dnia nie wyłącza PWM, bo pobór może spaść poniżej progu podtrzymania), GR (nie z telefonu dziecka; ryzyko odcięcia powerbanku) | ustalenie 22.10 z briefu | **spór**. Dodatkowo AS: po zdjęciu PWM pozycja jest nieznana, więc przy wznowieniu oko skoczy |
| **Geometria małych oczu**: przy rozstawie ok. 48–49° między sąsiednimi oczami (R150, ≥ 125 mm) naprawdę patrzy w punkt tylko 1–2 oczu (azymut ±20°); oko na ±60° potrzebowałoby 64–77°; fizyczne kule nie mają efektu Mony Lisy | OB, OA (rachunek); AS: boczne oczy nie trafią w ten sam punkt | OB link (Al Moubayed i in. 2012), repo (`plan-v2-modul-oka.md`) | **sprzeczne z AR (pkt 3)**, który zakłada, że każde oko policzy kąt „dokładnie w ten punkt” i powstanie zbieżny zez, oraz z KI (pkt 8, „traf wszystkimi oczami w jeden punkt”). OA: paralaksa między 0,5 a 2 m to ok. 5°, wystarczy kierunek |
| **Sąsiednie oczy nie spojrzą sobie w oczy** (potrzeba ok. 66°) → zostaje „zerkanie ku sobie” | OB | rachunek | OA, AS, AR proponują kłótnię i plotkę jako „zwrot ku sąsiadowi”, co jest zgodne z wersją OB |
| **Martwa strefa SG90** ok. 0,9°, krok PCA9685 ok. 0,44° → mikroruchy < 1,5° zawodne | OB | link (karta SG90), rachunek | OA proponuje mikroruch ±2–3°, co jest zgodne |
| **Duże oko**: powieki mają 1 stopień swobody (bez puszczania oka i skosu); sprzężenie osi ≤ 4,5° kompensuje firmware (strona podaje kąty, nie µs); powieka zamyka się na palcu z siłą 5,6 N | wszyscy (powieki); OA, AR (sprzężenie); OA, OB (5,6 N) | koncepcja 2c | zgoda. **Skutek sporny:** OA, AR i GR parkują z zamkniętymi powiekami; OB – stop nie zamyka powiek, bo może przyciąć palec |
| **Mrugnięcie**: zamykanie ok. 0,1 s, otwieranie ok. 0,2 s; mrugnięcie towarzyszy 97 % zwrotów wzroku > 33° | OA (PMC4015796), OB (Evinger 1994) | link | – |
| **Mapa oczu** (azymut, kolejność i sąsiedzi każdego modułu) jest potrzebna do fal, zezów i „patrz tam” | OA, OB, AS, GR; KI i AR zakładają ją niejawnie | – | zgoda |

### 1.4 Radar LD2450 i PIR

| Fakt | Kto podał | Źródło | Zgoda / spór |
|---|---|---|---|
| Radar jest w `sprzet.md` jako „do zamówienia”; PIR HC-SR501 jest w warsztacie | OB, GR | repo | – |
| LD2450: do 3 celów, X, Y i prędkość, ok. 10 odczytów/s, ±60°, 6 m | OB (link: ESPHome, instrukcja); GR i AS: kąt i odległość, bez wysokości | link | OA podaje prędkość celu jako założenie, OB jako fakt |
| Słabo widzi stojących dalej niż ok. 2 m; cele-duchy od mebli; jednostka prędkości i rozdzielczość z bliska podawane sprzecznie (75 mm, 0,15 m, 0,75 m) | OB | link (atomic14, GitHub) | – |
| Filtr: strefa, przyklejenie celu 3–5 s, martwa strefa ±5°, limit ok. 120°/s | OA, AS, GR, AR | repo (`prezentacja-w-szkole.md`) | zgoda |
| **Automatyczne sędziowanie bezruchu** (Baba Jaga) | OB: słabe widzenie stojących jest zaletą gry; OA, AR: wykonalne (trudność 4) | – | **spór:** AS odrzuca automatycznego sędziego w tłumie (gubienie i zamiana celów) |
| **Jedno źródło celu naraz**: w trybie zabawy radar milknie, w trybie wystawy palec | GR | – | nikt nie przeczy |

### 1.5 Decyzja z 18.10 a pomysły

- **Wprost zgłaszają konflikt:** OA (pkt 49 w wariancie z radarem, pkt 71) i OB (B4 z radarem, C1, C4, C5, C6, C8).
- **Interpretacja AS i GR:** decyzja dotyczy pokazu autonomicznego; efekty małych oczu uruchamiane ręcznie ze strony jej nie łamią. OB pisze to samo o ręcznym sterowaniu.
- **Bez zgłoszenia konfliktu:**
  - GR (pkt 14: „chór” małych oczu w stronę osoby z radaru co 20–40 s),
  - AR (pkt 2, 8, 11, 22 „Wataha”: małe oczy na osobę wskazaną przez radar),
  - KI (pkt 21: w pokazie bez telefonu małe oczy patrzą za dużym).

---

## 2. Fundament (pod wszystkie funkcje)

| Element | Co to jest | Kto | Uwagi i rozbieżności |
|---|---|---|---|
| **Strażnik ruchu (jedna kolejka w ESP)** | Każde polecenie (palec, scenka, radar, kalibracja, parkowanie) przechodzi przez jedną kolejkę. Obowiązują w niej: wspólny budżet 3–4 serw z dużym okiem włącznie, limity kąta (2° przed ogranicznikiem), limit prędkości ok. 120°/s i rozsunięte starty. Strona wysyła intencje („patrz na −10°”, „scenka 3”), nigdy µs. Liczy się tylko najnowszy cel | wszyscy | OA dodaje priorytety: bezpieczeństwo > ręczne > scenka > chaos > mikroruch. AS: dziś `c` i `setup()` łamią limit |
| **Automat jako stan domyślny** | Bez telefonu dynia gra pełny pokaz; strona jest nakładką i nie ma przycisku „wyłącz dynię” | wszyscy | zgoda |
| **Heartbeat i powrót do automatu** | Sterowanie ręczne trwa, dopóki telefon potwierdza obecność. Po ciszy oczy płynnie wracają do automatu, strona sama łączy się ponownie, a stare komendy nie są odtwarzane | OA, OB, AS, GR, AR | Różne czasy, bo to dwa różne mechanizmy: zerwanie połączenia (OA, OB: sygnał co 0,5 s, cisza 1,5 s) i bezczynność (GR: 30–60 s; AR: 30 s, regulowane 15–120 s). KI ma tylko jedną sesję sterującą (token) |
| **Antyspam z charakterem** | Za dużo kliknięć → „obrażona / wkurzona dynia” na 20 s | OA, KI | Ochrona serw podana jako żart |
| **Role i dostęp** | Gość, syn, rodzic. Gość ma kilka bezpiecznych efektów z odstępem; syn pełne sterowanie; rodzic kalibrację i ustawienia za PIN-em (blokada po kilku błędnych próbach – OA) | OA, OB, AS, GR, KI, AR | Uprawnienia sprawdza ESP, nie sama strona (AS). Wejście syna tajnym gestem: OB, AR; AS – sekretny znak to zabawa, nie hasło |
| **Kto łączy się z Wi-Fi** | OA: hasło WPA2 i karta QR dla rodziny, opcjonalna karta dla gości. GR: hasło na kartce przy dyni. OB: sieć ukryta, obcy się nie łączą, syn pożycza telefon w trybie gościa | OA, OB, GR | **spór** (pytanie 2). [unikat] OB: iOS **Dostęp z przewodnikiem** blokuje pożyczony telefon w Safari z limitem czasu (link Apple) |
| **Jeden pilot naraz** | Steruje jeden telefon, inni czekają lub oglądają; syn i rodzic przejmują sterowanie od razu | OA, OB, AS, GR, KI | zgoda |
| **Stop** | OB: „stop” dla każdego, wznowienie PIN-em albo po 5 min; zamraża oczy bez zamykania powiek | OB | **sprzeczne z OA, GR, KI**: gość nie ma żadnej komendy „wyłącz”; „zatrzymaj wszystko” jest za PIN-em (GR) |
| **Tryb wystawowy** | Jeden przełącznik: limity gościa, kolejka, auto-powrót, opcja „tylko automat”; stan zapisany w NVS | OA, GR | GR: telefony mogą oglądać, nie sterować |
| **Kalibracja ze strony** | Suwak środka i granic każdego oka (1200–1800 µs, wolny podgląd, zapis w NVS po „Zapisz”); dla dużego oka środki, ψ, θ i powieki. Zastępuje port szeregowy | wszyscy | wymóg decyzji 18.10 (kalibracja z telefonu). OB: jako zabawa „badanie wzroku” z synem |
| **Tryb montażu „trzymaj 1500 µs”** | Do nasadzania dźwigienki (decyzja 21.10) i wymiany modułu | OA, OB, AR | – |
| **Wyłączenie pojedynczego oka** | Uszkodzony moduł wypada z automatu i scenek; stan w NVS | OA, OB, AS, GR, AR | AS: wyłączenie PWM nie odcina zasilania serwa |
| **Mapa oczu** | Kanał, azymut, kolejność i sąsiedzi każdego oka | OA, OB, AS, GR | [unikat] OB: azymut z jednego pomiaru – rodzic staje w znanej odległości i suwakiem ustawia oko, aż „patrzy na niego” |
| **Przegląd poranny** | Oczy po kolei robią wolny ruch, syn odhacza ✓ / ✗ | OA, OB, AS, AR | 1 serwo naraz |
| **Panel stanu i czarna skrzynka** | Czas pracy, starty, przyczyna restartu (jak `test-24h`), wolny RAM, klienci, pierścień zdarzeń | OA, OB, AS, GR, KI, AR | zapis zdarzeń, nie każdego kroku (zużycie flash) |
| **Parkuj** | Oczy na środek, duże zamknięte, potem komunikat „można odłączyć” | OA, AS, GR, KI, AR | spór o powieki (OB) i o PWM off (pkt 1.3) |
| **Watchdog i strażnik AP** | `enableLoopWDT()`, ponowne `softAP` po zaniku AP; po 3 restartach tryb minimalny (OB) | OA, OB | – |
| **Kopia ustawień** | JSON albo tekst do Notatek; przywrócenie po wymianie ESP | OA, OB, AS, AR | OB: nie w localStorage (ITP) |
| **Zasilanie bez „procentu baterii”** | Licznik od przycisku „nowy powerbank” (czas, szacowane Wh/mAh) oraz dzielnik na 5 V do wykrywania spadków | OA, OB, AS, KI, AR | Wszyscy: z napięcia 5 V nie da się odczytać naładowania. KI i OB: dynia sama sygnalizuje kłopot (sen, ziewanie, zez) |
| **Tryb cichy (lekcja) i oszczędny** | Mniej serw naraz, wolniej, dłuższe fiksacje | OA, OB, KI, AR | parametry strażnika |
| **Harmonogram** | Godzina z telefonu, bo nie ma RTC; po restarcie bez telefonu harmonogram nie działa | OA, AS, KI; OB: „sen bez zegara” z radaru lub PIR | AP zostaje włączony (wszyscy) |
| **OTA** | Aktualizacja z przeglądarki, tylko w roli serwis, po „Parkuj”, z cofnięciem wersji | OA, OB | **KI odrzuca** (ryzyko „uceglenia”, argument o flash – patrz 1.2) |
| **Strojenie radaru** | Suwaki filtru i podgląd celów | AR, KI, OB | [unikat] AR: wirtualne kurtyny boczne (X_min, X_max) wycinające ścianę i drzwi |
| **Magnetyczny klucz** | Kontaktron w ukrytym miejscu: tryb serwisowy, „pokaz wow” albo cisza bez telefonu | OA, OB | OA: przycisk BOOT odpada, bo na SuperMini to GPIO9 = SCL |
| **Drobne pozostałe** | Licznik ruchów na oko (OA, OB, KI, AR); rotacja dyżurów oczu (OB [unikat]); „odpust 1°” po dojściu do skrajnej pozycji, żeby serwo nie grzało się na oporze (AR [unikat]); wykrycie zablokowanego oka spadkiem V+ albo INA219 (OA, OB, założenie); kanał 1/6/11 i moc TX (OB) | – | KI proponuje wykrywanie blokady „po czasie ruchu”; AS i OA odrzucają wykrywanie bez pomiaru |

---

## 3. Katalog funkcji dla zabawy

Kolumna „Wymaga”: **DO** = duże oko, **R** = radar, **mapa** = mapa oczu, **nic** = sama dynia z małymi oczami i telefon.

### 3.1 Sterowanie palcem

| Funkcja | Co robi | Kto | Wow | Trudn. | Wymaga | Ryzyko |
|---|---|---|---|---|---|---|
| **Pacynka: palec prowadzi duże oko** | Pad 2D ustawia kierunek dużego oka, stuknięcie mruga, opcjonalnie suwak rozwarcia. Małe oczy mogą iść „stadnie” z opóźnieniem | OA, OB, AS, GR, KI, AR (6) | 4,8 (4–5) | 2,5 (2–3) | DO | 2–3 serwa, małym zostaje 0–1; limit prędkości, tylko najnowszy cel |
| **„Wszyscy tam!” (kaskada kierunku)** | Stuknięcie w panoramę albo punkt w pokoju: oczy kolejno patrzą w tę stronę, każde z własnym kątem obciętym do ±25°. OB: „kompas do skarbu” | OA, OB, AS, GR, KI, AR (6) | 4,7 (4–5) | 2,3 (2–3) | nic, lepiej z mapą | kaskada ≤ 3. Wersja AR „każde oko dokładnie w punkt” jest geometrycznie niewykonalna (pkt 1.3) |
| **Tryb magika (ukryte sterowanie)** | Ekran udaje coś niewinnego albo działa „na ślepo” z kieszeni; ukryte strefy: lewo, prawo, mrugnij, „Bu!”. Syn „rozkazuje dyni myślą” przy kolegach | OA, OB, AR (3) | 5,0 (5) | 2,0 (2) | nic, lepiej DO | brak, gotowe efekty. Ekran musi świecić (autoblokada „Nigdy”, OB) |
| **Pianino oczu** | Każde oko to klawisz na rysunku dyni: dotyk obraca oko i gra nutę z telefonu; AR: przeciągnięcie palcem po łuku wychyla kolejne oczy | OA, OB, AR (3) | 4,0 (3–5) | 2,3 (2–3) | nic | akord ponad budżet kolejka rozkłada w czasie |
| **Rysowanie trasy oka** [unikat] | Syn rysuje kółko albo ósemkę, duże oko jedzie po wygładzonej trasie | OA | 4 | 2 | DO | 2 serwa ciągle |

### 3.2 Efekty i choreografie małych oczu

| Funkcja | Co robi | Kto | Wow | Trudn. | Wymaga | Ryzyko |
|---|---|---|---|---|---|---|
| **Fala (i Dyrygent)** | Ruch obiega dynię w kolejności azymutu; warianty: tam i z powrotem, od środka, domino. OA: kierunek i tempo fali ustawia przeciągnięcie palcem | OA, OB, AS, GR, KI, AR (6) | 4,7 (4–5) | 2,3 (2–3) | nic, lepiej z mapą | krok ≥ T/3 (ok. 120–130 ms) trzyma ≤ 3–4 serwa |
| **Lider i stado (styl ruchu grupowego)** | Duże oko rusza pierwsze, małe dochodzą parami od najbliższych; limit serw wygląda jak opóźnienie stada. AR jako tło „Wataha”, OA jako „Szef i podwładni” | OB, OA, KI, AR (4) | 4,3 (4–5) | 2,2 (2–2,5) | nic, lepiej DO | ≤ 4. „Wataha” AR w automacie z radarem = [K] |
| **Zez, rozbiegane, spłoszenie** | Zez do osi dyni, rozbiegnięcie na boki „jakby coś wybuchło”, krótko nerwowe sakady | OA, OB, GR, KI, AR (5) | 4,1 (3–5) | 1,4 (1–2) | nic | nie trzymać na skraju dłużej niż 2–3 s (KI); spłoszenie z twardym limitem czasu (GR) |
| **Kłótnia sąsiadów, plotka** | Para zerka ku sobie i obrażona odwraca się; „szept” wędruje po obwodzie; duże oko przyłapuje plotkarki (OB) | OA, OB, AS, AR (4) | 3,8 (3–4) | 2,5 (2–3) | mapa (sąsiedzi) | 1–2 serwa; „patrzenie w oczy” niemożliwe, zostaje zerkanie |
| **Mecz tenisa, mucha, ping-pong** | Wyimaginowana piłka albo mucha: oczy odwracają się, gdy minie ich azymut | OA, AR (2) | 4,5 (4–5) | 3,0 (3) | nic, lepiej DO | z natury w budżecie |

### 3.3 Duże oko jako postać

| Funkcja | Co robi | Kto | Wow | Trudn. | Wymaga | Ryzyko |
|---|---|---|---|---|---|---|
| **„Bu!” i zasadzka „dynia śpi”** | Dynia udaje wyłączoną, po chwili ciszy duże oko otwiera się szeroko na wprost, po ok. 0,2–0,3 s małe oczy kaskadą; z dźwiękiem z telefonu. Warianty: „kto obudzi potwora” (AS, OA), dynia boi się skoku dziecka (OB) | OA, OB, AS, GR, AR (5) | 4,8 (4–5) | 2,2 (2–2,5) | DO; R opcjonalnie | fazy: najpierw duże, potem fale małych; przerwa ochronna np. raz na 20 s (OB). Kierunek małych oczu z radaru = [K] |
| **Zdziwienie, double-take** | Oko mija cel, wraca, dwa mrugnięcia, pełne otwarcie, potem małe kaskadą. KI: odpalane, gdy łączy się nowy telefon albo radar widzi nową osobę | OA, AS, GR, KI, AR (5) | 4,6 (4–5) | 2,1 (2–2,5) | DO | 3 serwa, małe po zatrzymaniu dużego |
| **Przewracanie oczami** | Łuk pod górną powieką przy półprzymknięciu, potem „westchnienie” | OA, AS, GR, KI, AR (5) | 4,4 (4–5) | 2,0 (1–3) | DO | 2–3 serwa, małe stoją |
| **Zasypianie i budzenie** | Powieki opadają skokami, oko w dół, małe po kolei na środek; pobudka „jeszcze 5 minut” (OB), zryw ze snu (AR) | OA, OB, AS, GR, KI, AR (6) | 4,3 (4–5) | 2,2 (2–3) | DO (część małych działa bez) | wolne ruchy; KI chce po scence zdjąć PWM (spór, pkt 1.3) |
| **Emocje na przycisk** | Senny, ciekawski, podejrzliwy (AR: „Clint Eastwood”, wolny skan spod przymkniętej powieki), przestraszony, złośliwy, znudzony. OA podaje gotową tabelę parametrów: rozwarcie, sakady, fiksacja, kierunek, mruganie | OA, OB, GR, KI, AR (5) | 4,4 (4–5) | 2,1 (1–3) | DO | 1–3 serwa; drżenie powieki tylko krótko |
| **Charakter dnia i imię** | Syn nadaje dyni imię i wybiera osobowość na dzień (nieśmiała, wścibska, śpiąca…); to inne zestawy parametrów tego samego silnika | AS, OB (2) | 4,5 (4–5) | 2,5 (2–3) | DO; z R bogatsze | brak |
| **Hipnoza, zawroty głowy** | Duże oko kręci wolne koła albo elipsę, małe w zezie | OA, OB, AR (3) | 3,8 (3–5) | 1,8 (1–3) | DO | ciągły ruch 2–3 MG90S: małe zamrożone (AR) |
| **„Szef ucisza bunt”** [unikat] | Duże oko śpi, małe rozrabiają, nagle duże otwiera się groźnie i małe karnie stają na baczność | AR | 5 | 3 | DO | etapy rozdzielone w czasie |
| **Mrugnięcia z powodem i mikroruchy** | Losowe, przy dużej sakadzie i zmianie nastroju; podwójne, senne; mikroruch ±2–3° | OA, OB, KI (3) | 2,7 (2–3) | 1,0 | DO | mikroruchy < 1,5° zawodne (OB); trzepot powiek najwyżej 1 s (OA) |
| **„Obrażona dynia”** | Odmowa strażnika jako scenka (patrz fundament) | OA, KI (2) | 3,5 (3–4) | 1,0 | nic, lepiej DO | zmniejsza zużycie |
| Drobne | Fotka z odliczaniem (OA, 3/1); sakada z przelotem i cofnięciem w stylu kreskówki (OB, 3/2); losowa scenka jednym przyciskiem (KI, 4/2); kichnięcie (KI) | – | – | – | – | – |

### 3.4 Gry i sztuczki dla syna

| Funkcja | Co robi | Kto | Wow | Trudn. | Wymaga | Ryzyko |
|---|---|---|---|---|---|---|
| **Wyrocznia tak / nie (detektor kłamstw, wywiad)** | Dzieci pytają, syn po cichu wybiera odpowiedź: kiwnięcie, kręcenie albo przewracanie oczami. Bez dużego oka kaskada małych (OA). AR jako „detektor kłamstw”, KI jako „wywiad z dynią” | OA, OB, AS, KI, AR (5) | 4,8 (4–5) | 2,1 (1,5–3) | lepiej DO | małe amplitudy |
| **Simon (powtórz wzór)** | Dynia pokazuje sekwencję, dziecko powtarza na rysunku dyni; z każdą rundą dłuższa. GR: wersja turowa na jednym telefonie | OA, OB, AS, GR (4) | 4,0 (4) | 2,8 (2–3) | nic | trudność rośnie przez pamięć, nie prędkość |
| **Refleks, pojedynek spojrzeń** | Duże oko otwiera się w losowej chwili i wygrywa ten, kto pierwszy stuknie; albo „kto pierwszy mrugnie” ze stoperem | OA, AS, AR (3) | 4,0 (4) | 1,7 (1–2) | DO | 1 serwo, przerwa między rundami |
| **Baba Jaga patrzy** | Oko zamknięte, dzieci się skradają; po otwarciu przyłapany dostaje spojrzenie. Sędziuje syn z telefonu albo radar | OA, OB, AR (3) | 5,0 (5) | 3,5 (2–4) | DO; R w wersji automatycznej | AR: wersja ręczna ma trudność 2. AS odrzuca automatycznego sędziego w tłumie. Małe oczy na przyłapanego = [K] |
| **Znajdź buntownika, policz oczy** | Jedno oko patrzy w drugą stronę albo „łypie”, dzieci zgadują które; AR: „ile oczu spojrzało w lewo?”. OB: oko-buntownik z imieniem na cały dzień | AS, KI, AR, OB (4) | 4,0 (4) | 2,0 (1–3) | mapa | ustawianie grupami |
| **Powitanie właściciela** | Telefon syna (ciasteczko – OB) albo sekretny gest (AS) wywołuje autorskie powitanie: falę i kocie mrugnięcie | OB, AS (2) | 5,0 (5) | 2,0 (2) | nic, lepiej DO | limit powtórzeń |
| **Przeciąganie liny wzrokiem, dwie drużyny** | Dwa telefony stukają, oczy przechylają się ku szybszemu | OA, OB (2) | 4,8 (4–5) | 3,0 (3) | 2 telefony | potrzebuje 2 klientów (pytanie 2), mocne wygładzenie |
| **Tryb trolla** [unikat] | Przed podaniem telefonu koledze syn odwraca sterowanie; po chwili „awaria, dmuchnij w oko” i wytrzeszcz | AR | 5 | 2 | DO | zwykłe ruchy z kolejki |
| **Kolekcja min, sekretne efekty** [unikat] | Część efektów odblokowuje się za wyniki w grach albo sekretną kombinację; stan w NVS | OB | 4 | 2 | nic | brak |
| **Liczniki i dziennik dyni** | „Dynia zrobiła dziś 48 213 ruchów”, ile osób podeszło, rekord straszeń | OA, OB, KI, AR (4) | 3,3 (3–4) | 1,6 (1–2) | nic; licznik osób z R | LD2450 w tłumie liczy za mało (OB) |
| Polowanie na oczy | Traf wszystkimi oczami w jeden punkt w 20 s | KI | 4 | 3 | nic | 20 s ciągłego ruchu; cel geometrycznie nieosiągalny (pkt 1.3) |

### 3.5 Nagrywanie i tworzenie sekwencji

| Funkcja | Co robi | Kto | Wow | Trudn. | Wymaga | Ryzyko |
|---|---|---|---|---|---|---|
| **Nagrywarka ruchów (looper)** | Syn steruje palcem i efektami, strona nagrywa, potem „odtwórz”, „zapisz jako przycisk” z nazwą („Taniec Antka”). OA i OB: opcjonalnie w pokazie automatycznym z kartką „choreografia: syn” | OA, OB, AS, GR, KI, AR (6) | 4,8 (4–5) | 3,3 (3–4) | nic, lepiej DO | odtwarzanie przez strażnika; OB: strona mówi „za dużo oczu naraz” już przy nagrywaniu. **Spór o miejsce zapisu:** ESP (OA 1–3 sloty, OB) a telefon (GR, AR); KI w RAM, znika po restarcie (pytanie 5) |
| **Klocki sekwencji, reżyser scenek** | Układanie scenek z gotowych gestów („fala w lewo → mrugnij → czekaj 2 s”) | OA, AS, KI (3) | 4,7 (4–5) | 3,7 (3–4) | nic | trzeba sprawdzić bezpieczeństwo przejść między gestami (AS) |

### 3.6 Dźwięk z telefonu

| Funkcja | Co robi | Kto | Wow | Trudn. | Wymaga | Ryzyko |
|---|---|---|---|---|---|---|
| **Dźwięk do efektów (soundboard)** | Każdy straszak i scenka ma dźwięk z telefonu; pliki z ESP albo synteza Web Audio. AR: głośnik BT w dyni sparowany z iPhone'em | OA, GR, KI, AR (4); OB i AS w opisach scenek | 4,3 (4–5) | 1,8 (1–2) | nic (opcjonalnie głośnik BT) | brak dla serw; przełącznik wyciszenia (pkt 1.1) |
| **Dynia mówi (synteza mowy)** | Syn wpisuje zdanie („Cześć, Antek”), telefon czyta, powieki pulsują w rytm sylab | OA, OB (2) | 4,5 (4–5) | 2,5 (2–3) | DO; R w wersji OB | polski głos offline niepewny; pulsowanie powiek krótko |
| **Własny głos syna** | Nagranie z Dyktafonu wgrane przez `<input type=file>` jako dźwięk przycisku albo kwestia w scence | OA, AS (2) | 4,5 (4–5) | 3,5 (3–4) | nic | miejsce w systemie plików (ok. 1,4 MB) |
| **Taniec do muzyki** | Gotowa oś czasu pod melodię z telefonu; AS: syn wystukuje rytm, oczy odpowiadają | OA, OB, AS (3) | 4,3 (4–5) | 3,0 (3) | nic | do ok. 2 ruchów/s na oko; nie „każde uderzenie dowolnej muzyki” (AS) |

### 3.7 Radar (duże oko jako postać z czujnikiem)

| Funkcja | Co robi | Kto | Wow | Trudn. | Wymaga | Ryzyko |
|---|---|---|---|---|---|---|
| **Śledzenie i otwieranie (decyzja 18.10)** | Nikogo nie ma: oko zamknięte. Ktoś podchodzi: otwiera się i śledzi najbliższego skokami z fiksacjami; bliżej = szerzej i niżej. Za blisko (< 0,3–0,4 m): mruży się albo „wstydzi” (OB), „tryb przytulenia” (OB) | OA, OB, AS, GR, KI, AR (6) | 4,8 (4–5) | 3,4 (2–4) | DO, R | filtr z 18.10; bez niego serwa drżą (GR) |
| **Wybór między osobami** | Oko przenosi wzrok między 2–3 osobami i mruga przy przeskoku; wyliczanka jak koło fortuny (OB); wybiera najniższego, czyli dziecko (AR) | OA, OB, AR (3) | 4,3 (4–5) | 3,2 (2,5–4) | DO, R | **KI odrzuca** skakanie między osobami jako nerwowe |
| **Radar na ekranie: „wskaż ofiarę”** | Kropki do 3 osób na ekranie; syn dotyka kropkę i dynia przykleja się wzrokiem do tej osoby | OB, AR, KI (3) | 4,3 (3–5) | 3,0 (3) | DO, R | śledzenie z limitem prędkości; przy okazji narzędzie do strojenia filtru |
| **Charakter automatyczny** | Maszyna stanów nastroju z radaru: nikogo → zamknięte; daleko → ciekawski; długo blisko → podejrzliwy; nagle blisko → przestraszony; tłum → znudzony | OA, OB (2) | 5,0 (5) | 4,0 (4) | DO, R | 1–3 serwa |
| **Podglądanie, gdy nikogo nie ma** | Co jakiś czas powieki uchylają się i oko skanuje | OA, KI (2) | 3,0 (2–4) | 1,0 | DO | KI: małe patrzą za dużym (łagodne [K]) |
| **Małe oczy reagują na osobę** [K] | Kaskada wszystkich na najbliższą osobę co 20–40 s (OA, GR); „uczciwe wszyscy na ciebie” (OB: sięgające oczy patrzą dokładnie, reszta wytęża się na +25°); sztafeta spojrzeń dookoła dyni i podział uwagi (OB); „Wataha” (AR) | OA, OB, GR, AR (4) | 4,4 (4–5) | 2,9 (2–4) | R, mapa | wymaga zmiany decyzji 18.10 (pytanie 1) |
| **Unikaj spojrzenia strażnika** [unikat] | Oko skanuje jak reflektor; kto wejdzie w „snop wzroku” (kąt z radaru ±8°), uruchamia alarm | AR | 5 | 4 | DO, R | 1 serwo wolno; alarm małymi oczami = [K] |
| **Ciepło–zimno** [unikat] | Syn zaznacza tajny punkt na mapie radaru; im bliżej dziecko, tym szerzej otwarte oko | OB | 4 | 3 | DO, R | „nerwowe” małe oczy w wersji OB = [K] |

### 3.8 Tylko z HTTPS (wszyscy: nie w wersji bazowej)

| Funkcja | Kto proponuje | Wow | Trudn. | Stan |
|---|---|---|---|---|
| Oko sterowane przechyłem telefonu | AS, GR, KI | 5,0 (5) | 3,7 (3–4) | AS, GR, KI: „później, z HTTPS”; OA, OB, AR: odrzucone po http |
| Klaśnięcie albo krzyk budzi dynię | AS, GR, KI | 4,7 (4–5) | 4,0 (3–5) | jak wyżej; w hałasie szkoły wyzwalałoby się ciągle (AS, KI) |

---

## 4. Proponowany zestaw startowy

Kryteria: zbieżność (ilu uczestników), stosunek wow do trudności, działanie bez nowego sprzętu. Fundament z pkt 2 jest warunkiem, a nie pozycją zestawu. Pozycje 1–6 i 8–11 działają (w całości albo w wersji uboższej) na samych małych oczach.

1. **„Wszyscy tam!” w stylu „lider i stado”** – 6/6 uczestników, wow 4,7 przy trudności 2,3; kaskada z natury mieści się w budżecie serw, a kod grupowy `wszystkieWStrone` już istnieje.
2. **Fala z Dyrygentem** – 6/6, wow 4,7 przy trudności 2,3; największy efekt z 10 oczu o jednej osi.
3. **Zez i rozbiegane** – 5/6, najtańszy efekt w całym katalogu (trudność 1,4), działa bez dużego oka.
4. **„Bu!” / zasadzka, wywoływane ręcznie** – 5/6, wow 4,8; bez radaru nie dotyka decyzji 18.10, a z dużym okiem to najmocniejszy straszak.
5. **Wyrocznia tak / nie** – 5/6, wow 4,8 przy trudności 2,1; to tylko inny układ tych samych poleceń, działa też na samych małych oczach.
6. **Tryb magika (ukryte sterowanie)** – 3/6, ale wszyscy trzej dali wow 5 przy trudności 2; daje synowi „władzę” przy kolegach bez nowej mechaniki.
7. **Pacynka: palec prowadzi duże oko** (jeśli duże oko będzie gotowe) – 6/6, wow 4,8; najprostsza zabawa z dużym okiem, prędkość ograniczona w firmware.
8. **Pakiet emocji dużego oka: zdziwienie, przewracanie oczami, podejrzliwy skan** – po 5/6 uczestników, trudność ok. 2; z jednego serwa powiek robi postać. Bez dużego oka zostaje część „małe oczy kaskadą”.
9. **Zasypianie i budzenie** – 6/6; scenka na koniec dnia i dla gości, częściowo działa na samych małych oczach.
10. **Dźwięk z telefonu do efektów** – 4/6 wprost i 6/6 w opisach scenek; trudność 1,8, a każdy efekt zyskuje na wow.
11. **Nagrywarka ruchów, wersja prosta** – 6/6, wow 4,8; najbardziej „skustomizowane dla synka”, zwłaszcza gdy jego nagranie gra na wystawie. Jest najtrudniejsza w zestawie (3,3), więc 1–3 sloty bez klocków.
12. **Śledzenie radarem (decyzja 18.10), warunkowo** – 6/6, wow 4,8, ale trudność 3,4 i zależność od radaru (w `sprzet.md` „do zamówienia”) i gotowego dużego oka. Wchodzi, jeśli oba będą w dyni.

Tuż za zestawem (wysoka zgodność albo niski koszt): Simon (4/6), Refleks (3/6), Baba Jaga w wersji ręcznej (3/6), Powitanie właściciela (2/6, wow 5, trudność 2), „Obrażona dynia” (2/6, trudność 1).

---

## 5. Pomysły odrzucone (połączone)

**Safari i iPhone:**
- **Żyroskop / przechył po http:** wymaga bezpiecznego kontekstu (OA, OB, AR odrzucają; AS, GR, KI: tylko z HTTPS).
- **Mikrofon (krzyk, klaskanie, rytm z muzyki):** `getUserMedia` tylko po HTTPS, a w szkole ciągłe fałszywe wyzwalanie (wszyscy).
- **Komendy głosowe:** mikrofon plus rozpoznawanie w chmurze, a dynia nie ma internetu (OA, OB, AS, GR, AR).
- **Wibracja telefonu:** Safari na iOS nie ma Vibration API (wszyscy).
- **Fullscreen API:** na iPhonie tylko `<video>` (OA, OB, AS, GR, KI).
- **Kamera i śledzenie twarzy, wideo z dyni:** HTTPS, za mało RAM na C3, wizerunek obcych dzieci (OA, OB, GR, KI, AR).
- **Telefon w kieszeni z wygaszonym ekranem jako pilot:** Safari wstrzymuje JS, a Wake Lock wymaga HTTPS (OB).
- **Gamepad, Web Bluetooth, dźwięk z ESP do głośnika A2DP:** wymagają bezpiecznego kontekstu albo Bluetooth Classic, którego C3 nie ma (OA, GR, AS).
- **Captive portal jako główna strona:** okrojone okno bez trwałej pamięci (OA, OB, GR, KI, AR).
- **Awatar 3D oka renderowany na żywo:** obciąża rdzeń ruchem WebSocket dla samej dekoracji (KI).
- **Swobodna rozmowa AI:** za duża na C3 (AS).

**Mechanika i zasilanie:**
- **Wszystkie oczy w jednej chwili, trzęsienie, „szarpnięcie dla straszności”:** 10–13 serw wobec limitu 3–4 i zużycie przekładni (wszyscy).
- **Ciągłe płynne śledzenie palca albo osoby wszystkimi małymi oczami:** stale 10 serw w ruchu (OA).
- **Dokładne „patrzenie w punkt” przez wszystkie oczy:** boczne oczy nie sięgają przy ±25° (OA, OB, AS). Wbrew temu AR (pkt 3) i KI (pkt 8).
- **Sąsiednie oczy patrzące sobie w oczy:** potrzeba ok. 66° (OB).
- **Obrazki i litery z oczu:** jedna oś i rozłożenie dookoła dyni nie dadzą obrazu (OB).
- **Mikrosakady poniżej ok. 1,5°:** martwa strefa SG90 (OB).
- **Puszczanie oka, jedna powieka, skośne powieki, powieka podążająca za góra–dół:** jedno serwo powiek (wszyscy).
- **Pełny obrót gałki, skręt źrenicy:** mechanizm 2c tego nie ma (AS, GR).
- **Ruch góra–dół, mruganie i przewracanie małymi oczami:** mają tylko oś lewo–prawo i nie mają powiek (OA, OB, AS, AR).
- **Gra w dotykanie gałek:** zachęca do chwytania mechanizmu, a nie ma czujników dotyku (AS).
- **Procent baterii powerbanku:** stabilizowane 5 V nic nie mówi o ogniwach (wszyscy).
- **Pozycja serwa z potencjometru, autokalibracja do ograniczników, wykrycie blokady bez pomiaru:** brak sprzężenia zwrotnego (OA, OB, AS). Wbrew temu KI pkt 28: heurystyka czasu.
- **Czujnik prądu na każde serwo:** jeden INA219 sekwencyjnie daje to samo (OA).
- **Wyłączanie Wi-Fi, deep sleep:** AP podtrzymuje powerbank (OA, OB, AS, GR, AR).
- **Długie drżenie, trzepot powyżej ok. 1 s:** grzeje MG90S i zwiększa ryzyko przytrzaśnięcia palca (OA, OB).

**Sieć, czujniki, dostęp:**
- **„Oczy patrzą na telefon”:** ESP nie zna położenia telefonu (OA).
- **Rozpoznawanie syna albo konkretnego dziecka radarem:** LD2450 nie podaje tożsamości (OB, AS).
- **Radar jako sędzia mrugania lub kierunku wzroku:** nie widzi twarzy (AS).
- **Ciepło–zimno z siły sygnału Wi-Fi:** RSSI za bardzo skacze (OB).
- **Dwie sieci, biała lista MAC, konta dla każdego dziecka:** jeden interfejs AP, prywatne adresy MAC w iOS, przesada na kilka dni (OA, OB).
- **Otwarty AP dla całej szkoły, kilkanaście telefonów, kilku sterujących naraz:** limit klientów i szarpanie okiem w dwie strony (GR, KI, AR, OB).
- **Joystick dla każdego obcego dziecka:** kręcenie okiem w kółko grzeje serwa (OB).
- **Dziecko wpisuje µs albo wyłącza PWM:** zablokowane serwo albo zgaśnięcie powerbanku (GR).
- **Push, NTP, ranking online, sterowanie z domu:** brak internetu (OA, OB, AS, GR).
- **Przycisk serwisowy na BOOT:** to GPIO9 = SCL (OA).
- **Walka palca z radarem:** dwa źródła celu dają drganie (GR).
- **Taniec na każde uderzenie dowolnej muzyki:** tempo przekracza mechanikę (AS).

**Odrzucone tylko przez jednego uczestnika, a proponowane przez innych (spór, nie zamknięte):**
- **OTA:** KI odrzuca; OA i OB proponują z cofaniem wersji.
- **Długa choreografia zapisana w NVS:** GR odrzuca; OA i OB trzymają 1–3 sloty w ESP.
- **Skakanie wzroku między osobami:** KI odrzuca; OA, OB i AR proponują.
- **Automatyczny sędzia Baby Jagi:** AS odrzuca; OA, OB i AR proponują.

---

## 6. Decyzje dla użytkownika

1. **Małe oczy a radar (decyzja 18.10).** Czterech uczestników proponuje, żeby małe oczy reagowały na osobę z radaru (kaskada co 20–40 s, „wszyscy na ciebie”, sztafeta, „Wataha”). To przeczy decyzji „małe oczy zawsze chaotyczne, bez czujnika” – zmieniasz ją?
   **Rekomendacja:** decyzję utrzymać na tę Halloween i doprecyzować, że efekty małych oczu wywoływane ręcznie ze strony (palec, fala, ręczne „Bu!”) jej nie naruszają, tak jak piszą AS, GR i OB. Warianty radarowe małych oczu dopiero później, po mapie oczu.

2. **Kto łączy się z siecią dyni i ilu klientów.** Do wyboru:
   - (a) sieć ukryta, hasło zna tylko rodzina, a syn pożycza telefon koledze w trybie gościa (OB, z Dostępem z przewodnikiem iOS);
   - (b) hasło albo karta QR dla gości, kolejka pilota, do 4 telefonów (OA, GR);
   - (c) 1–2 klientów (AR).

   **Rekomendacja:** (a), z `max_connection` = 3–4, żeby zmieściły się telefon syna, rodzica i drugi telefon do gier na dwa telefony. Gość bez komendy „stop” (OB proponuje stop dla każdego; OA, GR i KI są przeciw). Po zmianie liczby klientów trzeba powtórzyć test podtrzymania powerbanku, bo szkice testowe mają dziś 1 klienta.

3. **HTTPS teraz czy później.** HTTPS odblokowałby przechył, mikrofon i Wake Lock, ale wymaga własnego certyfikatu zaufanego ręcznie na iPhonie (iOS 18 ma z tym znany błąd) i ok. 40 KB RAM na połączenie TLS.
   **Rekomendacja:** nie teraz. Strona bazowa po http, wszystkie zabawy na dotyku i dźwięku. HTTPS najwyżej później, jako osobny eksperyment tylko na telefonie syna – tak zgodnie piszą wszyscy uczestnicy.

4. **Czy wolno zdejmować impuls PWM** w uśpieniu, przy stopie, w nocy albo z małych oczu stojących bez ruchu? Za są KI, AR i OB (oszczędność, mniej grzania). Przeciw są OA i GR: pobór może spaść poniżej progu podtrzymania powerbanku, a AS dodaje, że po wznowieniu oko skoczy z nieznanej pozycji.
   **Rekomendacja:** na razie PWM tylko przy „Parkuj” i dla wyłączonego, uszkodzonego oka. W pozostałych sytuacjach oczy stoją z impulsem, dopóki `test-powerbank-wifi` nie pokaże, że sam AP bez serw trzyma Baseusa.

5. **Gdzie trzymać nagrania syna** (nagrywarka, 6/6 uczestników): w ESP (OA, OB) czy w telefonie (GR, AR)?
   **Rekomendacja:** w ESP, 1–3 sloty zapisywane po zakończeniu nagrania, z opcją „graj w pokazie automatycznym”. Tylko wtedy taniec syna leci na wystawie bez jego telefonu, a localStorage w Safari może zostać skasowany po 7 dniach (OB).
