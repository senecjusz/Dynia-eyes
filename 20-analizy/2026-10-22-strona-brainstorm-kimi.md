• Próbuję trzech osobnych subagentów zamiast swarm.

• Subagenci skończyli. Teraz sprawdzam fakty o Safari (kontekst bezpieczny, mikrofon, żyroskop) — to kluczowe dla ograniczeń.

• Poniżej gotowy raport do zapisania jako `20-analizy/2026-10-22-strona-brainstorm-kimi.md`.

  ---

  # Burza mózgów E7.1 – co ma umieć strona sterująca oczami dyni (uczestnik: Kimi, 22.10)

  Raport łączy trzy niezależne tory (trzej subagenci): **dzieci/syn**, **choreografia/postać**, **rodzic/wystawa/niezawodność**. Duplikaty połączono. Oceny: wow = efekt dla 8-latka (1–5), trudność (1–5).

  ## 1. Lista pomysłów po połączeniu

  ### Sterowanie i zabawa (tor: dzieci)

  | # | Nazwa | Co robi | Dla kogo | Wow | Trudność | Sprzęt | Ryzyko |
  |---|---|---|---|---|---|---|---|
  | 1 | **Kieruj okiem palcem** | Pad dotykowy na stronie: palec ustawia, dokąd patrzy duże oko (X/Y) + przycisk mrugnięcia; małe oczy podążają „stadnie" z opóźnieniem | syn, dzieci | 5 | 3 | nic | niskie – ruch przez kolejkę i limity kąta w firmware |
  | 2 | **Dynia goni telefon (żyroskop)** | Przechylanie iPhone'a kieruje dużym okiem | syn | 5 | 3 | nic | **blokada techniczna – patrz rozdz. 4** (wymaga potwierdzenia na http) |
  | 3 | **„Boo!" – straszenie krzykiem** | Strona mierzy głośność mikrofonem; głośny krzyk = przestraszony skok oczu i zmrużenie | dzieci | 5 | 4 | nic | **blokada techniczna – mikrofon wymaga kontekstu bezpiecznego** (rozdz. 4); dodatkowo w tłumie wyzwalałby się non stop (blokada 30 s) |
  | 4 | **Nagraj swój pokaz** | Dziecko ustawia oko palcem, „zapisz krok" (max ~10 kroków), „odtwórz"; sekwencje w RAM, znikają po restarcie | syn | 5 | 4 | nic | niskie; pilnować tempa odtwarzania |
  | 5 | **Koło fortuny / „Zaskocz mnie"** | Jeden wielki przycisk losuje mini-pokaz (mrugnięcia, przewracanie oczami, drzemka z nagłym przebudzeniem) | dzieci | 4 | 2 | nic | niskie |
  | 6 | **Wywiad z dynią (syn jako operator)** | Syn ma ekran operatora: przyciski „tak" (kiwnięcie), „nie" (lewo-prawo), „śmiech" (szybkie mrugnięcia); dźwięk leci z głośnika jego telefonu – dynia „rozmawia" z kolegami | syn + koledzy | 5 | 3 | nic | brak; zero dodatkowego sprzętu |
  | 7 | **Dźwięk z telefonu, nie z dyni** | Strona odtwarza odgłosy (mruczenie, „łup" przy mrugnięciu) na głośniku telefonu sterującego | syn, dzieci | 4 | 1 | nic | brak (w Safari dźwięk wymaga wcześniejszego dotknięcia – fakt, patrz rozdz. 4) |
  | 8 | **Polowanie na oczy (mini-gra)** | Celownik: traf wszystkimi oczami w jeden punkt w 20 s (oczy rozrzucone na start), licznik trafień | dzieci | 4 | 3 | nic | średnie: ciągły ruch serw 20 s; pauza „oczy odpoczywają" po kilku grach |
  | 9 | **Licznik straszeń** | Strona pokazuje liczbę wywołanych reakcji dnia (zapis do NVS rzadko, np. co godzinę); rywalizacja dzieci | dzieci | 3 | 1 | nic | brak |

  ### Choreografia i postać (tor: oczy jako charakter)

  | # | Nazwa | Co robi | Dla kogo | Wow | Trudność | Sprzęt | Ryzyko |
  |---|---|---|---|---|---|---|---|
  | 10 | **„Wszyscy patrzą tu"** | Dotknięcie punktu na siatce = wszystkie oczy skręcają w ten kierunek (każde na swojej osi) | dzieci | 5 | 2 | nic | pik prądu: start rozłożyć w czasie (co ~150 ms), nie 10 serw naraz |
  | 11 | **Fala po oczach** | Skręt przechodzi przez oczy z opóźnieniem 80–150 ms między sąsiadami, jak na stadionie; na bokach „okrąża" dynię | dzieci | 4 | 2 | nic | żadne – w ruchu 1–2 serwa, obniża pik prądu |
  | 12 | **Zez radosny** | Połowa oczu w lewo, połowa w prawo, z lekkim drżeniem, 1,5–3 s | dzieci | 5 | 1 | nic | nie trzymać serw na skraju zakresu dłużej niż 2–3 s |
  | 13 | **Przewracanie oczami** | Duże oko: źrenica przesadnie w górę + powieki na pół; małe oczy falą w przeciwną stronę | rodzic, syn, dzieci | 4 | 1 | nic | brak |
  | 14 | **Zasypianie i budzenie (scenka)** | Powieki zamykają się 3–4 s, małe oczy „padają" jedno po drugim; budzenie odwrotnie; po scence PWM off = najoszczędniejszy tryb | syn, obsługa | 4 | 2 | nic | brak; po scence serwa bez sygnału (oszczędność) |
  | 15 | **Skórki emocji dużego oka** | Przyciski: ciekawskie / gniewne (wąska szczelina + twarde spojrzenie) / przestraszone (otwarcie na max + drżenie) / senne | syn, dzieci | 5 | 3 | nic | brak; max 3 serwa w ruchu |
  | 16 | **Mruganie z charakterem** | Nie rytm co 3–5 s, lecz losowy wzorzec: pojedyncze, podwójne, czasem długie przymknięcie | wszyscy | 3 | 1 | nic | brak |
  | 17 | **„Zdziwienie na nową osobę"** | Gdy telefon łączy się z AP albo radar widzi nowego spokojnego widza: scenka 3 s (przymknięcie → gwałtowne otwarcie → skan lewo-prawo) | dzieci | 5 | 2–3 | nic / radar | brak |
  | 18 | **Tryb „strażnik" z radaru** | Nikogo nie ma → oko śpi; ktoś wchodzi → przebudzenie i śledzenie najbliższej osoby (kąt → X, odległość → Y: bliżej = patrzy w dół na dziecko); cel znika → szuka 2 s i zasypia | wystawa bez obsługi | 5 | 4 | radar (planowany) | tłum = ciągłe wybudzanie; histereza i minimalna przerwa między scenkami |
  | 19 | **„Znajdź łypiące oko"** | Jedno losowe oko łypie w rytm; dziecko zgaduje na stronie, które; trafienie = fala radości, pudło = zez | dzieci | 4 | 2 | nic | brak (1 serwo w ruchu) |
  | 20 | **Biblioteka scenek 5–8 s** | Siatka dużych przycisków: „Potwór się budzi", „Kichnięcie" (narastające drżenie oczu → zamknięcie → „achoo!" z telefonu → fala), „Pożegnanie" | syn tworzy, dzieci klikają | 5 | 3 | nic | sekwencer pilnuje globalnego limitu 3–4 serw naraz |
  | 21 | **Idle-show „dynia żyje sama"** | Co 20–40 s duże oko otwiera się na 3/4, skanuje scenę dwoma łukami, małe oczy patrzą za nim, powrót do spoczynku (bez radaru i bez telefonu) | wystawa | 4 | 1 | nic | częstotliwość ograniczona, żeby nie mielić serwami 3 dni |
  | 22 | **„Wkurzona dynia" (antyspam z charakterem)** | Za dużo komend → dynia na 20 s przewraca oczami, zamyka powieki i nie reaguje; uczy dzieci kulturowego klikania i chroni mechanikę | obsługa, dzieci | 3 | 1 | nic | brak – redukuje zużycie |

  ### Rodzic, wystawa, niezawodność

  | # | Nazwa | Co robi | Dla kogo | Wow | Trudność | Sprzęt | Ryzyko |
  |---|---|---|---|---|---|---|---|
  | 23 | **Tryb pokazu z PIN-em rodzica (kiosk)** | Dzieci widzą tylko kilka dużych bezpiecznych przycisków; kalibracja, limity i tryby za PIN-em | wszyscy | 3 | 2 | nic | brak; to podstawowe zabezpieczenie |
  | 24 | **Dynia autonomiczna po starcie** | Domyślnie dynia żyje sama (sakady, fiksacje, reakcje) identycznie, gdy nikt nie jest połączony; strona tylko nadzoruje | dzieci | 4 | 1 | nic | brak; firmware już to prawie ma |
  | 25 | **Harmonogram dzień/noc** | Rodzic ustawia godziny pracy; poza nimi dynia śpi (PWM off, oko zamknięte, AP działa dalej, bo podtrzymuje powerbank); bez RTC – czas „od włączenia" | rodzic | 2 | 2 | nic | obniża pobór prądu |
  | 26 | **Licznik pracy serw + profil oszczędny** | Sekundy ruchu na kanał; profil oszczędny: rzadsze, wolniejsze ruchy, pauzy co 10 min | rodzic | 1 | 2 | nic | brak – ochrona 13 serw na kilka dni |
  | 27 | **Karta „Zdrowie dyni"** | Napięcie 5 V (dzielnik na ADC), czas od startu, liczba restartów z powodem (`esp_reset_reason`), temperatura, liczba klientów Wi-Fi | rodzic | 2 | 3 | 2 rezystory | brak |
  | 28 | **Detekcja zablokowania serwa** | Ruch trwa podejrzanie długo → przerwać PWM i zgłosić „oko 7 może być zablokowane" (dzieci będą wciskać palce w gałki) | rodzic | 1 | 3 | nic | heurystyka po czasie (pozycji nie znamy); fałszywe alarmy do wystrojenia |
  | 29 | **Twarde limity zakresów w stronie** | Strona fizycznie nie wyśle wartości poza limit kanału (NVS); „test końca zakresu" jedzie powoli | rodzic | 1 | 2 | nic | brak – zabezpieczenie |
  | 30 | **Przycisk „PARKUJ OCZY"** | Wszystkie serwa łagodnie na środki, potem PWM off – do transportu i końca dnia | rodzic | 2 | 1 | nic | brak |
  | 31 | **Jedna sesja sterująca** | Tylko jeden telefon naraz steruje (token); reszta widzi „dynia jest zajęta" / podgląd | dzieci, rodzic | 1 | 3 | nic | brak; chroni przed szarpaniem okiem w dwie strony |
  | 32 | **Rejestr zdarzeń (black box) w NVS** | Ostatnie ~50 zdarzeń: starty, restarty z powodem, blokady, wejścia w tryby; bufor cykliczny | rodzic | 1 | 2 | nic | pilnować zużycia flash (zapis tylko zdarzeń) |
  | 33 | **Alarm baterii dynią, nie stroną** | Napięcie poniżej progu → dynia przechodzi w wyraźny „sen" (czytelny znak „zmień powerbank" bez telefonu) | rodzic | 3 | 2 | 2 rezystory | próg do wystrojenia pod konkretny powerbank (testy w repo) |
  | 34 | **Sesja kalibracyjna z samozamknięciem** | Kalibracja za PIN-em, wygasa po 5 min bezczynności i wraca do pokazu | rodzic | 1 | 2 | nic | brak |
  | 35 | **Podgląd radaru dla rodzica** | Ekran diagnostyczny: pozycje X/Y wykrytych osób i aktualny kąt dużego oka – do strojenia w szkole | rodzic (i syn: „dynia widzi ludzi") | 3 | 3 | radar | brak |

  ## 2. Top 10

  Kolejność wg stosunku wow/trudność i znaczenia dla wystawy.

  **Na tę Halloween:**
  1. **Dynia autonomiczna po starcie (24)** – dynia musi żyć sama cały dzień bez telefonu; to fundament, prawie gotowy w firmware.
  2. **Tryb pokazu z PIN-em + jedna sesja sterująca (23, 31)** – bez tego obce dzieci rozregulują lub zablokują mechanikę; warunek puszczenia strony na wystawie.
  3. **Kieruj okiem palcem (1)** – najprostsze i najmocniejsze „wow": dynia patrzy tam, gdzie palec.
  4. **Koło fortuny + biblioteka scenek (5, 20)** – jeden przycisk = pokaz; małe trudności, duży efekt; scenki składane z ruchów już istniejących.
  5. **„Wszyscy patrzą tu" + fala + zez (10, 11, 12)** – pakiet choreografii grupowych na istniejącej rutynie `wszystkieWStrone`; trudność 1–2, wow 4–5.
  6. **Skórki emocji dużego oka + mruganie z charakterem (15, 16)** – zamienia mechanizm w postać; 3 serwa, zero sprzętu.
  7. **Wywiad z dynią – syn jako operator (6)** – najbardziej „skustomizowane dla synka": on robi show kolegom, a dźwięk z jego telefonu omija cały problem audio na ESP32.
  8. **PARKUJ OCZY + twarde limity + alarm baterii dynią (30, 29, 33)** – tanie zabezpieczenia na transport i kilka dni pracy.
  9. **Zasypianie/budzenie jako scenka i tryb nocny (14, 25)** – jeden mechanizm robi i „geg", i oszczędność prądu.
  10. **Karta „Zdrowie dyni" + rejestr zdarzeń (27, 32)** – rodzic diagnozuje dynię na wystawie bez otwierania jej.

  **Później (po Halloween / gdy radar ruszy):**
  - Tryb „strażnik" z radaru + podgląd radaru (18, 35) – zależne od montażu LD2450.
  - Nagraj swój pokaz (4) – wymaga porządnego sekwencera i zapisu.
  - Polowanie na oczy, „znajdź łypiące oko", licznik straszeń (8, 19, 9) – gry, gdy rdzeń sterowania będzie stabilny.
  - Dynia goni telefon, „Boo!" (2, 3) – zawieszone na weryfikacji ograniczeń Safari (rozdz. 4); możliwe zastępstwo: ekranowy joystick zamiast żyroskopu.

  ## 3. Pomysły odrzucone (żeby nie wracały)

  - **Kamera / streaming wideo z dyni:** ESP32-C3 nie ma mocy ani RAM na wideo obok AP Wi-Fi.
  - **Głośnik w dyni sterowany ze strony:** C3 bez I2S/DAC i pamięci na sample nie pociągnie przyzwoitego audio; DFPlayer = dodatkowy sprzęt i zasilanie. Efekt „głosu dyni" daje dźwięk z telefonu (pomysł 7) za darmo.
  - **OTA (aktualizacja firmware przez stronę):** SuperMini ma 4 MB flash; dwie partycje OTA pochłaniają prawie całość, a ryzyko uceglenia dyni na wystawie przewyższa zysk.
  - **Captive portal z automatycznym oknem na iPhonie:** okno CNA iOS jest okrojone (problemy z localStorage i API); pewniejsza instrukcja „otwórz 192.168.4.1".
  - **Procent baterii powerbanka:** powerbanki USB nie raportują stanu; z napięcia 5 V da się wykryć tylko próg „prawie pusto" (pomysł 33), nie procenty.
  - **Awatar/3D oka renderowany na stronie na żywo:** dodatkowy ruch WebSocket obciąża ten sam rdzeń co serwa; zysk czysto dekoracyjny.
  - **Skakanie wzroku między wieloma osobami z radaru:** wygląda nerwowo i mieli serwami; lepsza histereza na najbliższym celu.
  - **Multi-touch: wiele oczu na wielu suwakach naraz / dwa telefony sterujące (13 z toru 2):** flood komend na jednym rdzeniu = szarpanie; zastąpione jedną sesją sterującą (31).

  ## 4. Ograniczenia techniczne

  **Safari na iPhonie (strona z AP dyni, http://192.168.4.1, bez internetu):**

  - **Kontekst bezpieczny (kluczowe):** strona z AP jest czystym HTTP po adresie IP. Mikrofon (`getUserMedia`) wymaga kontekstu bezpiecznego – **nie zadziała** (fakt, [MDN](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)). `DeviceOrientationEvent` też jest oznaczony jako secure-context – **żyroskop najpewniej nie zadziała** (fakt wg MDN, [link](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent); na 100 % do potwierdzenia testem na docelowym iPhonie, bo Safari bywa tu niespójne). Wniosek: pomysły 2 i 3 trzeba zastąpić ekranowym padem/joystickiem, chyba że test wykaże inaczej. Nawet gdyby działał, iOS 13+ wymaga `DeviceMotionEvent.requestPermission()` wywołanego z gestu użytkownika (fakt, MDN).
  - **Wibracje:** Vibration API nie jest wspierane w Safari na iOS (fakt, [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate)).
  - **Dźwięk:** odtwarzanie audio wymaga wcześniejszego gestu użytkownika (autoplay policy, fakt) – pierwszy przycisk „włącz dźwięk" to obejmuje.
  - **Pełny ekran:** Fullscreen API nie działa na iPhonie dla stron; obejście to „Dodaj do ekranu głównego" (PWA – fakt).
  - **Bez internetu:** strona musi być w 100 % self-contained (żadnych CDN, fontów zewnętrznych); całość w pamięci ESP32 (LittleFS/PROGMEM) – przy SPA to kilkadziesiąt–kilkaset KB, realne.

  **ESP32-C3 jako serwer:**

  - WebSocket na C3 to sprawdzony wzorzec (biblioteki Arduino); realnie kilku–kilkunastu klientów, ale dla spokoju projektować na **1–2 aktywnych klientów sterujących + kilku podglądających** (założenie, do testu).
  - Opóźnienie lokalnego AP: rzędu dziesiątek ms (założenie) – wystarczy do śledzenia palca przy przesyle celu co ~50 ms i interpolacji po stronie firmware.
  - Jeden rdzeń: serwer HTTP/WebSocket i pętla serw (50 Hz) dzielą CPU; firmware musi być w pełni nieblokujący (obecny `oczy-ruch.ino` już taki jest), a limity „max 3–4 serwa naraz" i throttling komend egzekwować po stronie ESP, nie strony.
  - AP ESP32 domyślnie ogranicza liczbę stacji (typowo 4–10 zależnie od konfiguracji) – na wystawie z większą liczbą telefonów zadziała mechanizm „dynia zajęta" (pomysł 31), ale trzeba to sprawdzić przed wystawą (założenie do testu).

  ---

  **Uwaga dla orkiestratora:** pliku nie zapisałem (praca tylko do odczytu) – powyższa treść jest gotowa do zapisania jako `20-analizy/2026-10-22-strona-brainstorm-kimi.md`. Tor 2 (choreografia) skonfrontowałem z koncepcją dużego oka 2c: powieki mają tylko rozwarcie (bez skosu), więc „gniew" realizowany jako wąska szczelina; łącznie ~13 serw, pik prądu ~1,45 A przy powerbanku 3 A (dane z repo).

