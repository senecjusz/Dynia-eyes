Uruchomiłem trzy niezależne tory burzy mózgów (subagenci dla Toru 1: Syn 8 lat i koledzy, Toru 2: Choreografia oczu i duże oko jako postać, Toru 3: Rodzic, wystawa i niezawodność). Czekam na ich wyniki, po czym połączę je w pełny raport końcowy.
Odebrałem raport z Toru 2 (Choreografia oczu i duże oko jako postać). Czekam na zakończenie pracy przez subagentów z Toru 1 i Toru 3.
Odebrałem raport z Toru 1 (Syn 8 lat i jego koledzy). Czekam jeszcze na zakończenie pracy przez subagenta z Toru 3 (Rodzic, wystawa i niezawodność).
# Raport z burzy mózgów (E7.1): Co ma umieć strona sterująca oczami dyni – uczestnik „Argon”

Oznaczenia w tekście: **[F]** – sprawdzony fakt (z plików repozytorium lub dokumentacji technicznej Safari / ESP32), **[Z]** – założenie projektowe lub szacunek wymagający weryfikacji na docelowym sprzęcie. Raport nie zawiera prognoz czasu pracy ani terminów.

Raport powstał z połączenia trzech niezależnych torów prowadzonych przez osobnych subagentów:
- **Tor 1:** Syn (8 lat) i jego koledzy na wystawie w szkole (gry, żarty z ukrycia, sterowanie palcem, dźwięk),
- **Tor 2:** Choreografia oczu i duże oko jako postać (ekspresja powiek i kardana, relacje Szef–podwładni, mikro-scenki, kaskady prądowe),
- **Tor 3:** Rodzic, wystawa w szkole i niezawodność (kalibracja NVS bez komputera, kwarantanna uszkodzonego serwa, ochrona przed tłumem, zasilanie i transport).

---

## 1. Lista pomysłów (po połączeniu trzech torów i usunięciu duplikatów)

Wszystkie propozycje uwzględniają architekturę układu **[F]**: sterownik ESP32-C3 SuperMini + PCA9685 (`50-elektronika/sprzet.md`), ok. 10 małych oczu Ø40 mm poruszanych wyłącznie lewo–prawo ±25° na SG90 bez powiek (`50-elektronika/oczy-ruch/oczy-ruch.ino`), duże oko Ø60 mm (koncepcja 2c: ruch lewo–prawo ψ ±25° i góra–dół θ ±15° na 2 × MG90S oraz dwie powieki sprzężone mechanicznie na jednym wspólnym serwie MG90S, dające 1 stopień swobody otwarcia od zamkniętych −9°/−11° do wytrzeszczu +42°/−38° – `20-analizy/2026-10-22-duze-oko-2c-koncepcja.md`) oraz limit **maks. 3–4 serw w ruchu jednocześnie** (`20-analizy/2026-10-18-prezentacja-w-szkole.md`).

---

### Kategoria A: Sterowanie na żywo, żarty („pranki”) i zabawy dla syna (Tor 1 + Tor 2)

#### 1. „Kieszonkowy Snajper” (Touchpad do sterowania na ślepo z kieszeni)
- **Co robi:** Zamienia cały ekran iPhone'a w jedną powierzchnię dotykową bez małych przycisków: ruch kciukiem lewo–prawo/góra–dół płynnie obraca duże oko (a z opóźnieniem małe oczy), natomiast podwójne stuknięcie w dowolnym miejscu wyzwala mrugnięcie lub wytrzeszcz. Syn trzyma rękę na telefonie w kieszeni bluzy, stoi obok kolegów i steruje dynią bez patrzenia na ekran, jakby dynia czytała w myślach.
- **Dla kogo:** syn (prankuje dzieci na wystawie)
- **„Wow” dla 8-latka:** 5/5
- **Trudność wykonania:** 2/5
- **Dodatkowy sprzęt:** nic
- **Ryzyko dla mechaniki lub zasilania:** Niskie – za palcem w czasie rzeczywistym podąża tylko duże oko (2 serwa MG90S), a małe oczy dociągają do kąta kaskadowo po 2–3 sztuki co 100 ms po zatrzymaniu palca, zawsze z profilem `smoothstep`.

#### 2. „Udawany Trupek / Przyłapanie Intruza” (Jump-Scare)
- **Co robi:** Dynia udaje wyłączoną (powieki dużego oka zamknięte, małe oczy rozbieżne na boki i nieruchome). Na kliknięcie syna z ukrycia (lub automatycznie, gdy radar LD2450 wykryje podejście bliżej niż 0,8 m) duże oko błyskawicznie otwiera powieki na 100% i wbija wzrok w twarz widza, a ułamek sekundy później wszystkie małe oczy kaskadowo zatrzaskują spojrzenie na tej samej osobie.
- **Dla kogo:** syn / dzieci na wystawie
- **„Wow” dla 8-latka:** 5/5
- **Trudność wykonania:** 2/5 (ręcznie z telefonu) / 3/5 (z radarem)
- **Dodatkowy sprzęt:** nic (opcjonalnie radar HLK-LD2450 lub głośnik BT)
- **Ryzyko dla mechaniki lub zasilania:** Średnie przy błędnej implementacji (pokusa ruszenia 13 serwami naraz). Rozwiązanie: twardy rozdział faz – w `t = 0 ms` startuje wyłącznie duże oko (3 × MG90S), a małe oczy ruszają w 3 falach po 3–4 sztuki w `t = 180 ms`, `320 ms` i `460 ms`.

#### 3. „Mapa Sali: Patrz Tam!” (Wirtualny półokrąg ze zbieżnością wzroku)
- **Co robi:** Wyświetla rzut z góry na dynię i półokrąg korytarza przed nią; przyłożenie palca w dowolnym punkcie półokręgu `(X, Y)` wylicza trygonometrycznie kąty tak, by wszystkie oczy spojrzały dokładnie w ten punkt w przestrzeni (palec blisko dyni = komiczny zez zbieżny do środka; palec daleko = osie oczu równoległe). Z radarem LD2450 na tym samym półokręgu widać na żywo do 3 wykrytych osób jako pulsujące kropki (styl *Aliens*), a stuknięcie w kropkę każe dyni uparcie śledzić wybranego kolegę.
- **Dla kogo:** syn / dzieci na wystawie
- **„Wow” dla 8-latka:** 5/5
- **Trudność wykonania:** 3/5
- **Dodatkowy sprzęt:** nic (z radarem HLK-LD2450 dochodzi podgląd celów na żywo)
- **Ryzyko dla mechaniki lub zasilania:** Niskie przy zastosowaniu ogranicznika prędkości kątowej na ESP32-C3 i kolejki `MAX_RUCHOW = 3..4`.

#### 4. „Detektor Kłamstw” (Tajny Sędzia: Prawda / Fałsz)
- **Co robi:** Syn zadaje koledze pytanie przed dynią („Kto zjadł ostatniego cukierka?”, „Odrobiłeś lekcje?”) i wciska na telefonie jeden z dwóch ukrytych przycisków: **PRAWDA** (duże oko mruga łagodnie i kiwa gałką góra–dół) albo **KŁAMSTWO!** (powieki przymrużają się podejrzliwie do 35%, wszystkie oczy zjeżdżają na kolegę, a z telefonu/głośnika odtwarzany jest dźwięk alarmu).
- **Dla kogo:** syn i koledzy
- **„Wow” dla 8-latka:** 5/5
- **Trudność wykonania:** 2/5
- **Dodatkowy sprzęt:** nic (opcjonalnie głośnik BT)
- **Ryzyko dla mechaniki lub zasilania:** Bardzo niskie – ruch podejrzliwego namierzania jest powolny (~600 ms) i sekwencyjny.

#### 5. „Tryb Trolla” (Fałszywie zepsuty interfejs dla kolegi)
- **Co robi:** Zanim syn poda telefon koledze („Masz, posteruj chwilę!”), stuka 3 razy w róg ekranu. Telefon odwraca sterowanie lewo↔prawo, a po 5 sekundach wyświetla komunikat: *„AWARIA DYNIO-RDZENIA! Podejdź i dmuchnij w duże oko, aby zresetować”* – gdy kolega nachyla się do dyni, duże oko robi mu wytrzeszcz prosto w nos.
- **Dla kogo:** syn i koledzy
- **„Wow” dla 8-latka:** 5/5
- **Trudność wykonania:** 2/5
- **Dodatkowy sprzęt:** nic
- **Ryzyko dla mechaniki lub zasilania:** Zerowe (standardowe, bezpieczne ruchy z kolejki).

#### 6. „Studio Reżysera” (Nagrywanie ruchu palcem i własnych scenek)
- **Co robi:** Po wciśnięciu przycisku `REC` strona przez 10 sekund próbkuje ruch palca syna po padzie 2D oraz kliknięcia mrugnięć co 100 ms (100 próbek = ok. 300 bajtów). Syn może odtworzyć nagraną sekwencję w pętli i zapisać ją pod własną nazwą w pamięci iPhone'a (`localStorage`) lub przesłać do RAM/NVS ESP32.
- **Dla kogo:** syn
- **„Wow” dla 8-latka:** 4/5
- **Trudność wykonania:** 3/5
- **Dodatkowy sprzęt:** nic
- **Ryzyko dla mechaniki lub zasilania:** Niskie – odtwarzacz w ESP32 przepuszcza zapisane klatki przez ten sam planer `smoothstep` i budżet 3–4 serw naraz.

#### 7. „Brzuchomówca: Soundboard zsynchronizowany z oczami”
- **Co robi:** Panel 9 przycisków dźwiękowych na stronie (złowieszczy śmiech, ziewnięcie, skrzypienie drzwi, ryk potwora, chrapanie) generowanych przez Web Audio API lub odtwarzanych z pamięci iPhone'a. iPhone łączy się po Wi-Fi z dynią i jednocześnie po **systemowym Bluetooth Audio iOS** z małym głośnikiem BT włożonym do środka dyni **[F]**, a każde kliknięcie dźwięku odpala idealnie zsynchronizowany ruch powiek i oczu (np. ziewnięcie = przymknięcie powiek i ucieczka oka w górę).
- **Dla kogo:** syn / dzieci na wystawie
- **„Wow” dla 8-latka:** 5/5
- **Trudność wykonania:** 2/5
- **Dodatkowy sprzęt:** mały głośnik Bluetooth włożony do dyni (działa też z głośnika samego iPhone'a)
- **Ryzyko dla mechaniki lub zasilania:** Zerowe dla zasilania dyni – dźwięk miksuje iPhone, a głośnik BT ma własny akumulator.

---

### Kategoria B: Gry towarzyskie wokół dyni (Tor 1 + Tor 2)

#### 8. Gra „Baba Jaga Patrzy!” (Czerwone–Zielone z dynią jako strażnikiem)
- **Co robi:** Duże oko zamyka powieki, a małe oczy odwracają się na skrajne boki – dzieci mogą podchodzić do dyni. Po losowym czasie (2–5 s) lub na kliknięcie syna powieki dużego oka otwierają się szeroko i wszystkie oczy patrzą na środek: kto w tym momencie się poruszy (wskazany przez syna lub wykryty przez radar LD2450 jako zmiana odległości/kąta), na tego wszystkie oczy celują i odpada z rundy.
- **Dla kogo:** syn i dzieci na wystawie
- **„Wow” dla 8-latka:** 5/5
- **Trudność wykonania:** 2/5 (sędziuje syn z telefonu) / 4/5 (automatyczny sędzia z radarem LD2450)
- **Dodatkowy sprzęt:** nic (lub radar HLK-LD2450)
- **Ryzyko dla mechaniki lub zasilania:** Niskie przy zachowaniu opóźnienia 180 ms między otwarciem dużego oka a kaskadą małych oczu.

#### 9. Gra „Pojedynek na Wzrok: Kto pierwszy mrugnie?”
- **Co robi:** Kolega staje naprzeciw dużego oka Ø60 mm i nie może mrugnąć ani się zaśmiać. Powieki dużego oka otwierają się szeroko i nieruchomieją, a pojedyncze małe oczy wykonują co chwilę komiczne, rozpraszające ruchy (zez, podrygiwanie); na ekranie telefonu biegnie stoper, a po 20 sekundach dynia „poddaje się”, mruga i spuszcza wzrok w dół.
- **Dla kogo:** dzieci na wystawie / koledzy
- **„Wow” dla 8-latka:** 4/5
- **Trudność wykonania:** 1/5
- **Dodatkowy sprzęt:** nic
- **Ryzyko dla mechaniki lub zasilania:** Minimalne – w trakcie pojedynku rusza się tylko 1–2 małe oczy naraz.

#### 10. Gra „Policz Zezowate Oczy” (Refleks i spostrzegawczość)
- **Co robi:** Duże oko zamyka powieki, a 10 małych oczu w krótkiej kaskadzie ustawia się w losowej kombinacji (np. 6 w lewo, 4 w prawo) na 2 sekundy, po czym wraca na wprost (`0°`). Na ekranie telefonu gracze muszą jak najszybciej kliknąć odpowiedź: *„Ile małych oczu spojrzało w LEWO?”*.
- **Dla kogo:** syn i koledzy
- **„Wow” dla 8-latka:** 4/5
- **Trudność wykonania:** 2/5
- **Dodatkowy sprzęt:** nic
- **Ryzyko dla mechaniki lub zasilania:** Niskie – ustawienie 10 oczu odbywa się w 3 krokach po 3–4 serwa w ciągu 350 ms, a potem serwa stoją.

#### 11. Gra „Unikaj Spojrzenia Strażnika” (Skradanka z radarem)
- **Co robi:** Duże oko bardzo powoli skanuje korytarz od −25° do +25° jak reflektor strażniczy. Zadaniem dziecka jest przekraść się przed dynią tak, by jego kąt odczytany przez radar LD2450 nie pokrył się z aktualnym kątem patrzenia dużego oka (±8°); wejście w „snop wzroku” uruchamia alarm i obrót małych oczu na intruza.
- **Dla kogo:** dzieci na wystawie / koledzy
- **„Wow” dla 8-latka:** 5/5
- **Trudność wykonania:** 4/5
- **Dodatkowy sprzęt:** radar HLK-LD2450
- **Ryzyko dla mechaniki lub zasilania:** Bardzo niskie – podczas skanowania pracuje tylko 1 serwo (oś X dużego oka) z małą prędkością.

---

### Kategoria C: Choreografia oczu, emocje dużego oka i mikro-scenki (Tor 2 + Tor 1)

#### 12. Efekt „Double-Take” (Niedowierzanie: „Czy ja dobrze widzę?!”)
- **Co robi:** Małe oczy zamierają. Duże oko leniwie mija cel w poziomie, nagle zatrzymuje się, cofa szybką sakadą do punktu `(ψ, θ)`, wykonuje dwa szybkie mrugnięcia i wytrzeszcza powieki na 100% (`+42°/−38°`) na 2 s, po czym małe oczy kaskadowo (po 3 szt. co 100 ms) obracają się w ten sam punkt.
- **Dla kogo:** syn / dzieci na wystawie
- **„Wow” dla 8-latka:** 5/5
- **Trudność wykonania:** 2/5
- **Dodatkowy sprzęt:** nic
- **Ryzyko dla mechaniki lub zasilania:** Niskie – mrugnięcia powiek odbywają się w postoju osi X/Y (1 serwo MG90S), a małe oczy ruszają dopiero po zatrzymaniu dużego oka.

#### 13. Efekt „Clint Eastwood” (Podejrzliwy skan szeryfa)
- **Co robi:** Powieki dużego oka przymykają się do wąskiej szparki (~35% otwarcia), a gałka przy lekkim pochyleniu w dół (`θ = −5°`) bardzo powoli (przez 4 s) skanuje horyzont od −25° do +25°. Wszystkie 10 małych oczu stoi w tym czasie nieruchomo na baczność (`0°`).
- **Dla kogo:** syn / dzieci na wystawie / rodzic
- **„Wow” dla 8-latka:** 4/5
- **Trudność wykonania:** 1/5
- **Dodatkowy sprzęt:** nic
- **Ryzyko dla mechaniki lub zasilania:** Znikome – w trakcie skanowania pracuje wyłącznie 1 serwo MG90S.

#### 14. Efekt „Przewracanie oczami” (Reakcja na czerstwy żart)
- **Co robi:** Na jedno kliknięcie z telefonu duże oko przymyka powieki do połowy (50%), dźwiga gałkę maksymalnie w górę (`θ = +15°`) i zatacza powolny łuk pod górną powieką od −20° do +20°, po czym opada z „westchnieniem” do `θ = −10°` i wraca na środek.
- **Dla kogo:** syn / rodzic
- **„Wow” dla 8-latka:** 5/5
- **Trudność wykonania:** 2/5
- **Dodatkowy sprzęt:** nic
- **Ryzyko dla mechaniki lub zasilania:** Niskie – pracują tylko 2 serwa dużego oka (X i Y ze wzorem kompensacji kardana z `20-analizy/2026-10-22-duze-oko-2c-koncepcja.md`), małe oczy stoją.

#### 15. Efekt „Walka ze snem” (Narkolepsja dyni)
- **Co robi:** Powieki dużego oka powoli, ciężko opadają przez 3 s (z drobnymi podrygami o +5°), gałka zjeżdża w dół (`θ = −15°`), a małe oczy pojedynczo „odpływają” na boki. Po sekundzie bezruchu powieki strzelają na 100% otwarcia, duże oko wraca na `(0°, 0°)`, a małe oczy falami po 3 sztuki stają na baczność.
- **Dla kogo:** dzieci na wystawie / syn
- **„Wow” dla 8-latka:** 4/5
- **Trudność wykonania:** 2/5
- **Dodatkowy sprzęt:** nic
- **Ryzyko dla mechaniki lub zasilania:** Niskie – zryw ze snu rozdzielony w czasie (0–180 ms duże oko, od 200 ms fale małych oczu).

#### 16. Efekt „Zawroty głowy / Nokaut”
- **Co robi:** Duże oko kręci po elipsie (`ψ = 25°·sin(t)`, `θ = 15°·cos(t)`) przy półprzymkniętych powiekach przez 3 s, podczas gdy małe oczy stoją nieruchomo. Gdy duże oko zatrzyma się w „zezie” (`θ = +12°, ψ = −15°`), małe oczy wykonują kaskadę w losowe strony (po 3 w ruchu).
- **Dla kogo:** syn / dzieci na wystawie
- **„Wow” dla 8-latka:** 5/5
- **Trudność wykonania:** 3/5
- **Dodatkowy sprzęt:** nic
- **Ryzyko dla mechaniki lub zasilania:** Średnie – ciągły ruch harmoniczny 3 serw MG90S wymaga całkowitego zablokowania ruchu małych oczu na czas tych 3 sekund.

#### 17. Scenka „Szef ucisza bunt” (Relacja Duże Oko – Małe Oczy)
- **Co robi:** Duże oko śpi (powieki zamknięte), a małe oczy „rozrabiają” – trójkami szybko skaczą lewo–prawo co 250 ms. Nagle małe oczy zamierają, duże oko gwałtownie otwiera powieki na 100%, patrzy groźnie w dół na boki (`−25°` → `+25°`), a małe oczy kaskadowo (od najbliższych dużemu oku do skrajnych) karnie ustawiają się na `0°`.
- **Dla kogo:** syn / dzieci na wystawie / rodzic
- **„Wow” dla 8-latka:** 5/5
- **Trudność wykonania:** 3/5
- **Dodatkowy sprzęt:** nic
- **Ryzyko dla mechaniki lub zasilania:** Bardzo niskie – scenka naturalnie rozdziela ruchy w czasie (etap 1: maks. 3 SG90, etap 2: 2–3 MG90S, etap 3: fala po 2–3 SG90).

#### 18. Scenka „Plotka / Głuchy telefon”
- **Co robi:** Skrajne małe oko z lewej obraca się w stronę sąsiada; po 150 ms sąsiad odwraca się do niego, po chwili oba patrzą na kolejne oko – „szept” wędruje po obwodzie dyni (zawsze tylko 2 serwa w ruchu). Gdy fala dociera do dużego oka, to otwiera szeroko powieki w szoku („Serio?!”) i patrzy na widza.
- **Dla kogo:** dzieci na wystawie / syn
- **„Wow” dla 8-latka:** 4/5
- **Trudność wykonania:** 3/5
- **Dodatkowy sprzęt:** nic
- **Ryzyko dla mechaniki lub zasilania:** Minimalne – w każdej chwili pracują najwyżej 2 serwa.

#### 19. Efekt „Zbiórka na rozkaz! (Zbiorowy Zez vs Rozbiegnięcie)”
- **Co robi:** Dwa przyciski symetrii: **Zez do środka** (duże oko patrzy na czubek „nosa” `ψ = 0°, θ = −15°`, a małe oczy parami lewe+prawe co 120 ms obracają się maksymalnie do osi symetrii dyni: lewe na `+25°`, prawe na `−25°`) oraz **Wystraszone stado / Rozbiegnięcie** (duże oko zatrzaskuje powieki, a małe oczy uciekają źrenicami w zewnętrzne kąciki gniazd: lewe na `−25°`, prawe na `+25°`).
- **Dla kogo:** syn / dzieci na wystawie
- **„Wow” dla 8-latka:** 5/5
- **Trudność wykonania:** 2/5
- **Dodatkowy sprzęt:** nic
- **Ryzyko dla mechaniki lub zasilania:** Niskie – parowanie symetryczne uruchamia dokładnie 2 serwa SG90 co 120 ms, co wygląda dla ludzkiego oka jak ruch jednoczesny.

#### 20. „Meksykańska Fala i Pianino Oczu”
- **Co robi:** Wszystkie oczy ustawiają się w lewo (`−25°`), po czym od lewego boku do prawego biegnie fala przejścia na `+25°` z krokiem fazowym 130 ms między kolejnymi oczami; w szczycie fali duże oko unosi wzrok łukiem górą (`θ = +12°`) i szeroko otwiera powieki. Dodatkowo na ekranie jest łuk 10 ikon oczu („Pianino”) – przeciągnięcie po nim palcem wychyla kolejne oczy w tempie ruchu palca.
- **Dla kogo:** syn / dzieci na wystawie
- **„Wow” dla 8-latka:** 5/5
- **Trudność wykonania:** 3/5
- **Dodatkowy sprzęt:** nic
- **Ryzyko dla mechaniki lub zasilania:** Niskie pod warunkiem kroku fazowego ≥ 130 ms (czas ruchu o 50° to `120 + 50×6 = 420 ms` **[F]** z `oczy-ruch.ino`, więc przy kroku 130 ms w ruchu są jednocześnie dokładnie 3–4 serwa).

#### 21. Scenka „Mecz Ping-Ponga” (Synchroniczni kibice)
- **Co robi:** Oczy śledzą wyimaginowaną piłeczkę odbijaną przed dynią z lewej na prawą (okres 1,2 s przyspieszający do 0,7 s): duże oko prowadzi ruch po łuku, a małe oczy podążają za nim w 3 podgrupach z opóźnieniem 80 ms (efekt „spóźnionych kibiców na trybunach”). Na finał piłeczka „wypada w górę” – duże oko patrzy na `+15°`, a małe oczy rozjeżdżają się na boki.
- **Dla kogo:** syn / dzieci na wystawie
- **„Wow” dla 8-latka:** 5/5
- **Trudność wykonania:** 3/5
- **Dodatkowy sprzęt:** nic
- **Ryzyko dla mechaniki lub zasilania:** Niskie – opóźnienie grupowe 80 ms rozkłada szczyt prądowy przy zwrotach kierunku.

#### 22. Przełącznik charakteru tła: „Wataha” vs „Kameleon (Hipnoza)”
- **Co robi:** Zmienia zachowanie 10 małych oczu podczas zwykłego działania: w trybie **Wataha** małe oczy kaskadowo kopiują kąt poziomy dużego oka (cała dynia patrzy na tę samą osobę); w trybie **Kameleon** duże oko śledzi widza, a małe oczy żyją własnym życiem (losowe sakady z `oczy-ruch.ino` albo powolny sinusoidalny dryf w przeciwfazie).
- **Dla kogo:** syn / dzieci na wystawie / rodzic
- **„Wow” dla 8-latka:** 4/5
- **Trudność wykonania:** 2/5
- **Dodatkowy sprzęt:** nic
- **Ryzyko dla mechaniki lub zasilania:** Bardzo niskie.

#### 23. Choreografia radarowa „Kogo wybrać?” i „Fokus na najniższego”
- **Co robi:** Gdy radar LD2450 widzi 2–3 osoby, w trybie **„Kogo wybrać?”** duże oko patrzy 1,5 s na osobę A, mruga, przeszywa wzrokiem osobę B, a lewa i prawa połowa małych oczu dzielą się celami. W trybie **„Fokus na najniższego”** duże oko ignoruje stojących dalej dorosłych i wybiera cel najbliższy dyni (dziecko), zjeżdżając spojrzeniem w dół (`θ = −12°`).
- **Dla kogo:** dzieci na wystawie / syn
- **„Wow” dla 8-latka:** 5/5
- **Trudność wykonania:** 4/5
- **Dodatkowy sprzęt:** radar HLK-LD2450
- **Ryzyko dla mechaniki lub zasilania:** Niskie przy filtrowaniu EMA i martwej strefie kąta (`±5°` z `20-analizy/2026-10-18-prezentacja-w-szkole.md`).

---

### Kategoria D: Rodzic, wystawa w szkole, kalibracja i niezawodność (Tor 3)

#### 24. Trzypoziomowy Dostęp: Kiosk dla Kolegów / Kokpit Syna (Tajny Gest) / Warsztat Rodzica (PIN)
- **Co robi:** Domyślny widok to bezpieczny **Kiosk** (kafelki emocji z cooldownem 400 ms, brak możliwości zepsucia czegokolwiek, gdyby syn dał telefon koledze). Tajny gest na rysunku dyni (np. lewe oko → prawe oko → 2× duże oko) odblokowuje **Kokpit Syna** (pranki, touchpad kieszeniowy, studio reżysera), a 4-cyfrowy **PIN** otwiera **Warsztat Rodzica** (kalibracja µs w NVS, kwarantanna serw, diagnostyka).
- **Dla kogo:** rodzic / syn / dzieci na wystawie
- **„Wow” dla 8-latka:** 5/5 (posiadanie „tajnego kodu konstruktora” przy kolegach!)
- **Trudność wykonania:** 2/5
- **Dodatkowy sprzęt:** nic
- **Ryzyko dla mechaniki lub zasilania:** **Krytycznie obniża ryzyko** rozkalibrowania limitów dużego oka i przegrzania serw przez dzieci klikające bez przerwy.

#### 25. Watchdog Kieszeniowy (Auto-powrót do autonomii po bezczynności)
- **Co robi:** Jeśli syn steruje dynią ręcznie i schowa telefon do kieszeni albo wyjdzie z zasięgu Wi-Fi, po upływie ustawionego czasu bez komend (domyślnie `30 s`, regulowane `15–120 s`) ESP32 automatycznie i płynnie przywraca tryb autonomiczny / radarowy.
- **Dla kogo:** rodzic / syn / wystawa
- **„Wow” dla 8-latka:** 2/5
- **Trudność wykonania:** 1/5
- **Dodatkowy sprzęt:** nic
- **Ryzyko dla mechaniki lub zasilania:** Chroni przed pozostawieniem serw w skrajnym wychyleniu na wiele godzin.

#### 26. Kwarantanna Kanału („Odłącz Uszkodzone Oko” – Per-Servo Kill Switch)
- **Co robi:** Lista 13 przełączników (`Kanał 0..12` + `X, Y, Powieki`) zapisywana jako maska bitowa w NVS. Jeśli na wystawie dziecko wciśnie gałkę i wyłamie zębatkę lub zablokuje jedno małe oko, rodzic w 5 sekund z telefonu wyłącza ten jeden kanał (`pca.setPWM(ch, 0, 4096)` – brak impulsów PWM), a pozostałe oczy pracują dalej bez zmian.
- **Dla kogo:** rodzic / wystawa
- **„Wow” dla 8-latka:** 2/5
- **Trudność wykonania:** 1/5
- **Dodatkowy sprzęt:** nic
- **Ryzyko dla mechaniki lub zasilania:** **Ratuje zasilanie i serwo przed spaleniem** – zablokowane SG90 pobiera w zwarciu do ~700 mA **[F]** (`20-analizy/2026-10-17-zasilanie-powerbank.md`), co bez odcięcia kanału stopiłoby kasetę PLA i szybko rozładowało powerbank.

#### 27. Kalibracja Na Żywo w NVS + Tryb Montażowy „1500 µs” + Kopia JSON
- **Co robi:** Zastępuje terminal szeregowy (`kalibracja.ino` i `E5.4`): dla każdego oka pozwala suwakiem ustawić środek (`1200–1800 µs`), limity kątowe (`min/max`) i rewers (podczas ruchu suwaka zmiana idzie tylko do RAM, a przycisk „Zapisz” utrwala ją w NVS). Zawiera przycisk **„1500 µs – Nasadzanie orczyka”** oraz **„Kopiuj/Wklej JSON kalibracji”** do notatnika w telefonie (backup na wypadek wymiany płytki ESP32-C3).
- **Dla kogo:** rodzic
- **„Wow” dla 8-latka:** 3/5
- **Trudność wykonania:** 2/5
- **Dodatkowy sprzęt:** nic
- **Ryzyko dla mechaniki lub zasilania:** Chroni mechanikę przed uderzaniem w ograniczniki (±33° w małym oku, ±27°/±17° w dużym oku) i oszczędza pamięć Flash NVS.

#### 28. Procedura „Zaparkuj do Transportu / Wymiany Powerbanku”
- **Co robi:** Jeden przycisk, który: (1) ustawia małe oczy i duże oko na wprost (`0°`), (2) powoli zamyka powieki dużego oka (chroniąc gałkę Ø60 mm przed porysowaniem w transporcie), (3) zapisuje bieżące liczniki dziennika do NVS, a po `600 ms` (4) wyłącza PWM na wszystkich kanałach PCA9685 i wyświetla komunikat: *„Oczy zaparkowane i luźne – możesz odpiąć USB-C”*.
- **Dla kogo:** rodzic / syn
- **„Wow” dla 8-latka:** 4/5 (dynia posłusznie zamyka oko i „idzie spać” na rozkaz)
- **Trudność wykonania:** 1/5
- **Dodatkowy sprzęt:** nic
- **Ryzyko dla mechaniki lub zasilania:** **Eliminuje szarpnięcie przy kolejnym włączeniu zasilania** (serwa startują z pozycji parkowania `0°` **[F]** z `20-analizy/2026-10-22-duze-oko-2c-koncepcja.md` pkt 8) i chroni NVS przed odcięciem zasilania w trakcie zapisu.

#### 29. Sekwencyjny Tester Poranny („Przegląd 0 → 12 w 20 sekund”)
- **Co robi:** Przycisk, który przed lekcjami porusza po kolei każdym okiem z osobna (po jednym na 1,5 s: środek → −20° → +20° → środek), wyświetlając na ekranie wielki numer i nazwę aktualnie testowanego modułu. Rodzic i syn w 20 sekund widzą i słyszą, czy któreś oko nie zostało poprzedniego dnia przestawione przez dzieci.
- **Dla kogo:** rodzic / syn
- **„Wow” dla 8-latka:** 4/5 (jak procedura przedstartowa rakiety)
- **Trudność wykonania:** 2/5
- **Dodatkowy sprzęt:** nic
- **Ryzyko dla mechaniki lub zasilania:** Minimalne (zawsze tylko 1 serwo w ruchu).

#### 30. Tryb „Cisza na Lekcji vs Przerwa” (Kaganiec akustyczny i prądowy)
- **Co robi:** Przełącznik na górnym pasku strony: w trybie **„Lekcja”** obniża maksymalną prędkość serw o 60%, ogranicza liczbę serw w ruchu do 1–2 i wydłuża fiksacje (oczy poruszają się powoli i niemal bezgłośnie, nie przeszkadzając nauczycielom za ścianą). W trybie **„Przerwa”** przywraca pełną dynamikę i scenki.
- **Dla kogo:** rodzic / wystawa w szkole
- **„Wow” dla 8-latka:** 3/5
- **Trudność wykonania:** 2/5
- **Dodatkowy sprzęt:** nic
- **Ryzyko dla mechaniki lub zasilania:** Obniża średni pobór prądu i zużycie przekładni o ok. połowę **[Z]** w skali dnia szkolnego.

#### 31. Czarna Skrzynka NVS + Wirtualny Licznik Energii Powerbanku (mAh)
- **Co robi:** Wyświetla na stronie dane z NVS, które już zbiera `test-24h.ino` **[F]**: czas pracy (`czas`), liczbę ruchów (`ruchy`), liczbę uruchomień (`starty`), kod ostatniego resetu (`esp_reset_reason()`) oraz osobny licznik resetów od spadku napięcia (`9 = brownout`). Dodatkowo zlicza szacowane zużycie ładunku z modelu prądowego (`I_baza × czas + k × suma(|Δkąt|)`) z przyciskiem *„Wymieniłem powerbank na pełny – zeruj mAh”*.
- **Dla kogo:** rodzic / syn
- **„Wow” dla 8-latka:** 3/5 („Dynia zrobiła już 50 000 ruchów oczami!”)
- **Trudność wykonania:** 2/5
- **Dodatkowy sprzęt:** nic
- **Ryzyko dla mechaniki lub zasilania:** Pozwala wykryć przysiady napięcia (brownouty) i przewidzieć wymianę powerbanku Baseus na zapasową Mantę, zanim ten odetnie 5 V.

#### 32. Strojownia Radaru LD2450 i Wirtualne Kurtyny Korytarza
- **Co robi:** Pozwala na miejscu w szkole ustawić suwakami parametry filtru z `20-analizy/2026-10-18-prezentacja-w-szkole.md` **[F]**: zasięg min/max (`0,3–2,5 m`), czas przyklejenia wzroku do jednego dziecka (`3–5 s`), próg „trybu tłumu” oraz **wirtualne kurtyny boczne** (`X_min`, `X_max` w metrach), żeby wyciąć z pola widzenia radaru ścianę, drzwi klasy lub krzesło nauczyciela dyżurnego.
- **Dla kogo:** rodzic / wystawa
- **„Wow” dla 8-latka:** 3/5
- **Trudność wykonania:** 3/5
- **Dodatkowy sprzęt:** radar HLK-LD2450
- **Ryzyko dla mechaniki lub zasilania:** Chroni serwa dużego oka przed ciągłym drganiem w tłumie i bezcelowym patrzeniem w przeszkodę.

#### 33. Programowy Bezpiecznik Anty-Stall („Miękki Odpust 1°”)
- **Co robi:** Po osiągnięciu skrajnego położenia (szczególnie przy zamknięciu lub pełnym otwarciu powiek dużego oka) po `300 ms` sterownik automatycznie cofa zadany impuls o `1°` (`~11 µs`), a na małych oczach stojących bez ruchu dłużej niż `5 s` może zdejmować impulsy PWM aż do kolejnej sakady (o ile Wi-Fi AP utrzymuje powerbank **[F]**).
- **Dla kogo:** rodzic / wystawa
- **„Wow” dla 8-latka:** 1/5
- **Trudność wykonania:** 2/5
- **Dodatkowy sprzęt:** nic
- **Ryzyko dla mechaniki lub zasilania:** Eliminuje ciągłe bzyczenie i grzanie się serw napierających na elastyczny opór cięgna lub powieki.

---

### Zbiorcza tabela wszystkich 33 pomysłów

| # | Nazwa | Dla kogo | Wow (1–5) | Trudność (1–5) | Dodatkowy sprzęt | Wpływ na mechanikę / zasilanie |
|---|---|---|:---:|:---:|---|---|
| 1 | Kieszonkowy Snajper (touchpad z kieszeni) | syn | 5 | 2 | nic | Niskie ryzyko (duże oko na żywo, małe falą) |
| 2 | Udawany Trupek / Przyłapanie Intruza | syn / wystawa | 5 | 2 | nic / radar | Faza 0 ms duże oko, 180 ms+ fale małych oczu |
| 3 | Mapa Sali „Patrz Tam!” + Radar *Aliens* | syn / wystawa | 5 | 3 | nic / radar | Zbieżność liczona w ESP, limit 3–4 serw |
| 4 | Detektor Kłamstw (Prawda / Fałsz) | syn + koledzy | 5 | 2 | nic / głośnik BT | Bardzo niskie (wolny ruch podejrzliwy) |
| 5 | Tryb Trolla (blef dla kolegi) | syn + koledzy | 5 | 2 | nic | Zerowe ryzyko |
| 6 | Studio Reżysera (nagrywanie palcem 10 s) | syn | 4 | 3 | nic | Odtwarzane przez bezpieczny planer `smoothstep` |
| 7 | Brzuchomówca: Soundboard + głośnik BT | syn / wystawa | 5 | 2 | głośnik BT | Zerowe (audio idzie z iPhone'a po BT) |
| 8 | Gra „Baba Jaga Patrzy!” | syn + koledzy | 5 | 2–4 | nic / radar | Kaskadowy obrót z opóźnieniem 180 ms |
| 9 | Gra „Pojedynek na Wzrok” (stoper) | dzieci / syn | 4 | 1 | nic | Minimalne (1–2 serwa rozpraszające) |
| 10 | Gra „Policz Zezowate Oczy” | syn + koledzy | 4 | 2 | nic | 3 fale po 3–4 serwa, potem 2 s postoju |
| 11 | Gra „Unikaj Spojrzenia Strażnika” | dzieci / syn | 5 | 4 | radar LD2450 | Minimalne (1 serwo wolnego skanu) |
| 12 | Efekt „Double-Take” (Niedowierzanie) | syn / wystawa | 5 | 2 | nic | Mrugnięcie w postoju osi X/Y, małe oczy po dużym |
| 13 | Efekt „Clint Eastwood” (Przymrużony skan) | syn / wystawa | 4 | 1 | nic | Pracuje tylko 1 serwo w trakcie skanu |
| 14 | Efekt „Przewracanie oczami” | syn / rodzic | 5 | 2 | nic | Tylko 2 serwa dużego oka z kompensacją kardana |
| 15 | Efekt „Walka ze snem” (Narkolepsja) | wystawa / syn | 4 | 2 | nic | Rozdzielone fazy opadania i nagłego wybudzenia |
| 16 | Efekt „Zawroty głowy / Nokaut” | syn / wystawa | 5 | 3 | nic | Małe oczy zamrożone podczas kręcenia dużym |
| 17 | Scenka „Szef ucisza bunt” | syn / wystawa | 5 | 3 | nic | Naturalny podział czasu: małe → duże → małe |
| 18 | Scenka „Plotka / Głuchy telefon” | wystawa / syn | 4 | 3 | nic | Tylko 2 sąsiednie serwa w ruchu naraz |
| 19 | Efekt „Zbiórka na rozkaz! (Zez / Panika)” | syn / wystawa | 5 | 2 | nic | Symetryczne pary po 2 serwa co 120 ms |
| 20 | Meksykańska Fala i Pianino Oczu | syn / wystawa | 5 | 3 | nic | Krok fazowy ≥ 130 ms utrzymuje ≤ 3–4 serwa |
| 21 | Scenka „Mecz Ping-Ponga” | syn / wystawa | 5 | 3 | nic | 3 podgrupy kibiców z opóźnieniem 80 ms |
| 22 | Przełącznik „Wataha” vs „Kameleon” | syn / rodzic | 4 | 2 | nic | Bezpieczna kolejka ruchów |
| 23 | Radar: „Kogo wybrać?” / „Najniższy” | wystawa / syn | 5 | 4 | radar LD2450 | Filtr EMA + martwa strefa ±5° |
| 24 | Dostęp 3-poziomowy (Kiosk / Gest / PIN) | rodzic / syn | 5 | 2 | nic | Chroni przed dziećmi i rozkalibrowaniem |
| 25 | Watchdog Kieszeniowy (auto-powrót) | rodzic / syn | 2 | 1 | nic | Chroni przed zawieszeniem w skrajnym kącie |
| 26 | Kwarantanna Kanału (odłącz zepsute oko) | rodzic | 2 | 1 | nic | **Chroni przed zwarciem (~0,7 A) i stopieniem PLA** |
| 27 | Kalibracja Na Żywo w NVS + 1500 µs + JSON | rodzic | 3 | 2 | nic | Chroni ograniczniki mechaniczne i Flash NVS |
| 28 | „Zaparkuj do Transportu / Wymiany Baterii” | rodzic / syn | 4 | 1 | nic | **Eliminuje skok przy starcie**, chroni gałkę i NVS |
| 29 | Sekwencyjny Tester Poranny (0 → 12) | rodzic / syn | 4 | 2 | nic | Tylko 1 serwo naraz, szybka diagnoza |
| 30 | Tryb „Cisza na Lekcji vs Przerwa” | rodzic / szkoła | 3 | 2 | nic | Oszczędza ~50% prądu i wycisza przekładnie |
| 31 | Czarna Skrzynka NVS + Licznik mAh | rodzic / syn | 3 | 2 | nic | Wykrywa brownouty i pozwala zaplanować zmianę baterii |
| 32 | Strojownia Radaru i Wirtualne Kurtyny | rodzic | 3 | 3 | radar LD2450 | Eliminuje drgania w tłumie i patrzenie w ścianę |
| 33 | Bezpiecznik Anty-Stall (odpust 1°) | rodzic | 1 | 2 | nic | Obniża prąd spoczynkowy i temperaturę serw |

---

## 2. Top 10 – rekomendacja z uzasadnieniem i podziałem

Poniższa dziesiątka daje kompletny system: maksimum radości i dumy dla 8-letniego syna w szkole, pełną ekspresję dużego i małych oczu oraz pełne bezpieczeństwo serwisowe dla rodzica – bez przekraczania możliwości ESP32-C3 i Safari po HTTP.

### Na tę Halloween (Top 1–7: rdzeń zabawy, choreografii i niezawodności – bez konieczności posiadania radaru)

1. **Kalibracja Na Żywo w NVS + Tryb „1500 µs” + Kwarantanna Kanału (#27 + #26)**
   - *Uzasadnienie:* Fundament techniczny projektu zapisany w decyzjach (`30-projekt/decyzje.md`, 18.10). Pozwala skalibrować środki i krańce 10 małych oczu oraz 3 serw dużego oka z telefonu na stole i w dyni, a w szkole w 5 sekund wyłączyć pojedyncze uszkodzone przez dzieci oko bez wyjmowania elektroniki.
2. **Pad Emocji i Mikro-Scenek: „Double-Take”, „Clint Eastwood”, „Przewracanie oczami”, „Szef ucisza bunt”, „Zez” (#12, #13, #14, #17, #19)**
   - *Uzasadnienie:* Wykorzystuje największy atut konstrukcyjny dużego oka 2c (sprzężone powieki jako nośnik emocji: przymrużenie = podejrzliwość, 100% otwarcia = szok, półprzymknięcie + góra = przewracanie oczami) oraz kontrast między „Szefem” (dużym okiem) a „podwładnymi” (10 małymi oczami). Daje natychmiastowy efekt teatralny jednym dotknięciem.
3. **„Kieszonkowy Snajper” + Mapa „Patrz Tam!” ze zbieżnością wzroku (#1 + #3)**
   - *Uzasadnienie:* Spełnia główne marzenie 8-latka: płynne wodzenie wzrokiem całej dyni za palcem (ze zbieżnością małych oczu na bliski lub daleki punkt) oraz możliwość robienia żartów kolegom z ręką schowaną w kieszeni bluzy, bez patrzenia na ekran iPhone'a.
4. **„Meksykańska Fala i Pianino Oczu” + Przełącznik „Wataha vs Kameleon” (#20 + #22)**
   - *Uzasadnienie:* Najlepszy sposób na wyciśnięcie efektu „wow” z samych ~10 małych oczu rozłożonych po łuku dyni. Kaskada z przesunięciem 130 ms wygląda organicznie, a przy tym naturalnie utrzymuje pobór prądu w limicie ≤ 3–4 serw naraz.
5. **„Udawany Trupek / Przyłapanie Intruza” + „Detektor Kłamstw” (#2 + #4)**
   - *Uzasadnienie:* Dwie najlepsze zabawy sytuacyjne dla syna stojącego z kolegami przy dyni w szkole – nie wymagają trudnego kodu (bazują na gotowych stanach powiek i kaskadowym fokusie), a generują najwięcej śmiechu i emocji.
6. **Trzypoziomowy Dostęp (Kiosk / Tajny Gest Syna / PIN Rodzica) + Watchdog Kieszeniowy (#24 + #25)**
   - *Uzasadnienie:* Rozwiązuje problem bezpieczeństwa na wystawie: syn ma „tajny kod właściciela”, koledzy mogą bezpiecznie klikać w trybie Kiosku bez ryzyka zepsucia mechanizmu, a gdy syn odejdzie od dyni i zapomni wyłączyć sterowanie ręczne, po 30 s dynia sama wraca do trybu autonomicznego.
7. **„Zaparkuj do Transportu / Wymiany Powerbanku” + Czarna Skrzynka NVS i Tryb „Cisza na Lekcji” (#28 + #30 + #31)**
   - *Uzasadnienie:* Ponieważ serwa SG90/MG90S nie znają pozycji po włączeniu zasilania **[F]**, zaparkowanie oczu na `0°` i zamknięcie powiek przed odpięciem USB-C eliminuje gwałtowny skok przy starcie i chroni gałkę w transporcie, a tryb „Lekcja” wycisza dynię w godzinach zajęć i oszczędza powerbank.

### Później / Rozszerzenia (Top 8–10: gdy dojdzie radar HLK-LD2450 lub zostanie zapas po wdrożeniu bazy)

8. **Radar *Aliens* na żywo z ręcznym namierzaniem kolegi + Strojownia Radaru i Kurtyny (#3 + #23 + #32)**
   - *Uzasadnienie:* Zależy od dostawy i montażu radaru HLK-LD2450. Gdy radar będzie w dyni, podgląd 3 celów na ekranie iPhone'a i suwaki wycinające ściany korytarza pozwolą nastroić śledzenie w szkole w 2 minuty.
9. **Gry z kolegami: „Baba Jaga Patrzy!” i „Pojedynek na Wzrok” (#8 + #9)**
   - *Uzasadnienie:* Świetna warstwa grywalizacji na przerwę międzylekcyjną (wersję ręczną „Baby Jagi” i „Pojedynku” można dodać bardzo łatwo jako nakładkę na gotowe stany oczu, a wersję automatyczną po podłączeniu radaru).
10. **„Brzuchomówca” (Soundboard Web Audio + głośnik BT w dyni) oraz „Studio Reżysera” (#7 + #6)**
    - *Uzasadnienie:* Dźwięk wydobywający się z wnętrza dyni (z małego głośnika BT sparowanego z iPhonem syna) zsynchronizowany z otwieraniem powiek podnosi efekt o poziom wyżej, ale jest niezależnym dodatkiem, który nie blokuje uruchomienia samej mechaniki i sterowania.

---

## 3. Pomysły odrzucone (i dlaczego – żeby nie wracały)

1. **Sterowanie pochyleniem iPhone'a (żyroskop / akcelerometr – `DeviceOrientationEvent`):** Odrzucone, ponieważ Safari na iOS od wersji 13 bezwzględnie wymaga bezpiecznego kontekstu HTTPS (*Secure Context*) do wywołania `DeviceOrientationEvent.requestPermission()` **[F]**, a lokalny punkt dostępu ESP32 (`http://192.168.4.1`) działa po czystym HTTP bez zaufanego certyfikatu.
2. **Reakcja na krzyk, klaskanie lub komendy głosowe przez mikrofon iPhone'a (`getUserMedia` / `Web Speech API`):** Odrzucone, ponieważ w niezabezpieczonym kontekście HTTP na iOS obiekt `navigator.mediaDevices` jest całkowicie zablokowany (`undefined`) **[F]**, a rozpoznawanie mowy Apple wymaga dodatkowo połączenia z internetem, którego AP dyni nie posiada.
3. **Wibracje telefonu przy „straszeniu” (`navigator.vibrate`):** Odrzucone, ponieważ przeglądarka Safari na iOS w ogóle nie implementuje standardu Web Vibration API na żadnej wersji iPhone'a (nawet po HTTPS) **[F]**.
4. **Śledzenie twarzy kamerą iPhone'a (WebRTC + modele ML w przeglądarce):** Odrzucone, ponieważ kamera również wymaga HTTPS (`getUserMedia`) **[F]**, a wagi modelu wizyjnego (kilka–kilkanaście MB) nie zmieszczą się w pamięci Flash ESP32-C3 i nie zostaną pobrane z internetu.
5. **„Puszczenie oczka” jedną powieką lub asymetryczny grymas powiek dużego oka:** Odrzucone z przyczyn mechanicznych – w koncepcji 2c górna i dolna powieka są napędzane jednym wspólnym serwem MG90S przez podwójne ramię (`20-analizy/2026-10-22-duze-oko-2c-koncepcja.md` pkt 2.3) **[F]**, więc zawsze otwierają się i zamykają razem.
6. **Ruch góra–dół, kręcenie kółek lub mruganie małymi oczami:** Odrzucone z przyczyn mechanicznych – małe oczy (Ø40 mm) mają wyłącznie 1 serwo SG90 o pionowej osi obrotu (ruch tylko lewo–prawo ±25°) i nie mają powiek (`30-projekt/decyzje.md`) **[F]**.
7. **Jednoczesny skok wszystkich 11 oczu (13 serw) w tej samej milisekundzie lub szybka „trzęsawka” (>8 Hz):** Odrzucone z przyczyn prądowych i wytrzymałościowych – jednoczesny rozruch 10 × SG90 + 3 × MG90S pobrałby w szczycie 4–6 A **[Z]**, powodując odcięcie portu 3 A powerbanku lub *brownout* ESP32-C3, a oscylacje bez wyhamowania zmieliłyby przekładnie.
8. **Pomiar procentu naładowania powerbanku przez dzielnik napięcia ADC na linii 5 V:** Odrzucone, ponieważ powerbanki (Baseus, Manta) mają wewnętrzną przetwornicę utrzymującą stabilne `5,0 V` aż do momentu odcięcia ogniwa **[F]** – pomiar napięcia 5 V pokazywałby „100%” na sekundę przed wyłączeniem.
9. **Wyłączanie Wi-Fi (`WiFi.mode(WIFI_OFF)`) w celu oszczędzania energii w nocy lub na lekcji:** Odrzucone, ponieważ testy z 22.10 wykazały, że bez poboru prądu przez włączone Wi-Fi SoftAP (~80–100 mA) powerbank Baseus wyłącza się samoczynnie po ok. 15 sekundach (`50-elektronika/test-24h/test-24h.ino`, wiersz 17–18) **[F]**.
10. **Otwarty punkt dostępu dla wszystkich dzieci w szkole naraz (wieloosobowa zabawa z 10 telefonów) i Captive Portal DNS:** Odrzucone, ponieważ ESP32-C3 w trybie SoftAP obsługuje stabilnie maks. 1–4 klientów **[F]**, a fałszywy DNS Captive Portalu otwiera na iPhonie okrojone okienko *Captive Network Assistant*, które blokuje WebSockety i rozłącza Wi-Fi po wygaszeniu ekranu **[F]**.

---

## 4. Ograniczenia techniczne wpływające na funkcje strony

### A. Co pozwala, a czego blokuje Safari na iPhonie (sieć lokalna AP `http://192.168.4.1` bez internetu)

1. **Brak HTTPS (*Non-Secure Context*) [F]:**
   - Dla adresu `http://192.168.4.1` (oraz `http://dynia.local`) w Safari zachodzi `window.isSecureContext === false`.
   - Samopodpisany certyfikat SSL na ESP32-C3 jest niepraktyczny: wywołuje w Safari pełnoekranowe ostrzeżenie o niebezpieczeństwie, często blokuje połączenia WebSocket (`wss://`) na iOS i obciąża pojedynczy rdzeń RISC-V kryptografią TLS.
   - **Skutek dla funkcji:** Niedostępne są API wymagające HTTPS: **żyroskop/akcelerometr** (`DeviceOrientationEvent`), **mikrofon i kamera** (`navigator.mediaDevices.getUserMedia`) oraz oficjalne **Screen Wake Lock API** (`navigator.wakeLock`). Wszystkie interakcje należy oprzeć na zdarzeniach dotyku (`TouchEvent` / `PointerEvent`), które działają po HTTP bez żadnych ograniczeń i z minimalnym opóźnieniem.
2. **Dźwięk z telefonu (`Web Audio API`) i głośnik Bluetooth [F]:**
   - `Web Audio API` (syntezator dźwięków w JS oraz odtwarzanie buforów audio) **działa po czystym HTTP**.
   - **Dwa ograniczenia iOS [F]:** (a) kontekst audio startuje jako `suspended` i wymaga wywołania `audioCtx.resume()` wewnątrz pierwszego dotknięcia ekranu przez użytkownika (np. przycisk *„POŁĄCZ Z DYNIĄ”*); (b) fizyczny przełącznik wyciszenia (*Silent Mode*) na boku iPhone'a wycisza Web Audio API na głośniku telefonu – chyba że iPhone jest jednocześnie sparowany z zewnętrznym głośnikiem Bluetooth włożonym do dyni (iOS potrafi utrzymywać jednocześnie Wi-Fi z ESP32 oraz strumień audio A2DP po Bluetooth do głośnika **[F]**).
3. **Zachowanie iOS przy Wi-Fi bez internetu i pełny ekran (PWA) [F]:**
   - **Zakaz Captive Portalu (DNS Hijacking):** Jeżeli ESP32 odpowie własnym adresem IP na zapytanie `captive.apple.com`, iOS otworzy systemowy mini-browser *Captive Network Assistant (CNA)*, który nie ma pełnego silnika Safari i zrywa połączenie Wi-Fi zaraz po zablokowaniu ekranu. Zamiast tego ESP32 nie powinno uruchamiać fałszywego DNS: przy pierwszym połączeniu na iPhonie wybiera się *„Użyj bez internetu” (Use Without Internet)*.
   - **Pełny ekran w Safari:** Dodanie w nagłówku HTML tagu `<meta name="apple-mobile-web-app-capable" content="yes">` pozwala raz kliknąć w Safari *„Udostępnij → Dodaj do ekranu początkowego”*. Strona uruchamia się wtedy z ikony na pulpicie iPhone'a w **trybie pełnoekranowym** (bez pasków adresu i nawigacji Safari) i jest pamiętana w cache.

### B. Co udźwignie ESP32-C3 SuperMini (1 rdzeń RISC-V 160 MHz, ~400 KB SRAM)

1. **Współdzielenie jednego rdzenia między Wi-Fi a pętlę serw 50 Hz [F]:**
   - ESP32-C3 ma **jeden rdzeń RISC-V 160 MHz** (w przeciwieństwie do dwurdzeniowego ESP32 Xtensa) **[F]**. Stos Wi-Fi, serwer HTTP/WebSocket, odbiór UART z radaru LD2450 (256 000 bodów **[F]** z `20-analizy/2026-10-18-wykrywanie-ruchu.md`) oraz pętla ruchu oczu (co 20 ms **[F]** z `oczy-ruch.ino`) wykonują się na tym samym rdzeniu.
   - Ponieważ przebieg PWM 50 Hz generuje sprzętowo układ **PCA9685** z własnego oscylatora **[F]**, chwilowe zajęcie procesora przez pakiet Wi-Fi (np. 3–8 ms) **nie powoduje drgania (jitteru) serw** – orczyk stoi stabilnie, a jedynie kolejna klatka interpolacji `smoothstep` spóźni się o kilka milisekund.
   - **Optymalizacja I²C [Z]:** Domyślny zegar I²C 100 kHz przy 13 wywołaniach `pca.writeMicroseconds()` zajmuje ok. 6–8 ms w każdym cyklu 20 ms. Przestawienie I²C na `400 kHz` (`Wire.setClock(400000)`) oraz wysyłanie komend I²C wyłącznie dla tych oczu, które są aktualnie w ruchu (`wRuchu == true`, czyli maks. 3–4 serwa naraz), skraca czas transmisji I²C do `< 0,6 ms` na cykl.
2. **Liczba klientów Wi-Fi i architektura komunikacji (WebSocket vs HTTP) [F/Z]:**
   - W zatłoczonym szkolnym korytarzu `WiFi.softAP` powinien mieć ustawiony limit **`max_connection = 1` (maks. 2)**, tak jak zrobiono w `50-elektronika/test-24h/test-24h.ino` (`WiFi.softAP("dynia-test", "dynia-test-2026", 1, 1, 1)`) **[F]**. Chroni to stos `lwIP` i ~400 KB RAM przed próbami połączeń z obcych telefonów.
   - Cała strona (HTML + CSS + JS z grafiką wektorową SVG) powinna być serwowana jako **jeden skompresowany lub zminifikowany plik z pamięci `PROGMEM`** (ok. 15–30 KB **[Z]**) jednym żądaniem `GET /`.
   - Do sterowania w czasie rzeczywistym (wirtualny joystick / touchpad) wystarczy **1 połączenie WebSocket** (lub lekki endpoint `fetch` na `keep-alive`) z **throttlingiem po stronie JavaScriptu w Safari do 15–20 pakietów/s** (co 50–65 ms). Pakiety z telefonu nie mogą wywoływać `pca.writeMicroseconds()` bezpośrednio w przerwaniu sieciowym – powinny jedynie nadpisywać docelowy kąt `(celPsi, celTheta)` w RAM, a pętla `loop()` co 20 ms płynnie dociąga serwa przez istniejący algorytm `smoothstep` i kolejkę `MAX_RUCHOW = 3..4`.
3. **Zapisy do pamięci Flash NVS (`Preferences`) [F]:**
   - Zapis do Flash NVS na ESP32-C3 chwilowo wstrzymuje wykonywanie kodu z pamięci Flash (XIP) **[F]**. Dlatego suwaki kalibracji na stronie muszą podczas przesuwania palcem zmieniać wartości wyłącznie w pamięci RAM (podgląd na żywo bez przycięć), a fizyczny zapis `nvs.putInt(...)` powinien następować dopiero po kliknięciu przycisku *„Zapisz kalibrację”* lub podczas procedury *„Zaparkuj do transportu”*.
