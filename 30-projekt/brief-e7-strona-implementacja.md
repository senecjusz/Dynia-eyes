# Brief E7.2: firmware i strona dyni – implementacja (23.10)

Dla: **realizatora (Opus)**. Potem kod sprawdzą Fable i Astra. Piszesz po polsku (komentarze w kodzie też, jak w istniejących szkicach `50-elektronika/*`). Tylko pliki wskazane niżej; bez `git pull`, commitów i pushy.

## Cel

Kompletny firmware ESP32-C3, który steruje oczami dyni i serwuje **stronę na iPhone'a** (Safari, starszy model – projektuj od **320 × 568 px**, bez przewijania w poziomie). Telefon łączy się z Wi-Fi dyni, strona otwiera się sama (captive portal), bez internetu i bez aplikacji. Użytkownik (konstruktor, elektronik) robi dynię z synem (8 lat); dynia stoi kilka dni na wystawie w szkole, przy niej dzieci. Wybór użytkownika 23.10: **proste, zabawne efekty, które małym dzieciom wystarczą**; **bez** dźwięku z telefonu, nagrywania ruchów i śledzenia radarem.

Przeczytaj: `50-elektronika/strona-efekty.md` (lista efektów z liczbą serw i poborem), `20-analizy/2026-10-23-strona-funkcje-zestawienie.md` (fakty, fundament, spory), `50-elektronika/oczy-ruch/oczy-ruch.ino` (obecny silnik ruchu: sakady z rozpędem, fiksacje – **na nim bazuj**), `50-elektronika/test-24h/test-24h.ino` (dziennik NVS, Wi-Fi podtrzymujące), `50-elektronika/test-powerbank-wifi/test-powerbank-wifi.ino` (start bez skoku, przyczyna restartu), `50-elektronika/polaczenia.md`, `30-projekt/decyzje.md` (wiersze 18–21.10), `AGENTS.md` (ogólne zasady).

## Sprzęt

- ESP32-C3 SuperMini (SDA 8, SCL 9) + PCA9685 0x40, 50 Hz. Kompilacja: `arduino-cli compile -b esp32:esp32:esp32c3:CDCOnBoot=cdc <szkic>` (rdzeń esp32 3.3.12, `~/.local/bin/arduino-cli`). Biblioteki: tylko wbudowane w rdzeń (`WiFi`, `WebServer`, `DNSServer`, `Preferences`, `Wire`) + zainstalowana `Adafruit_PWMServoDriver`. Bez dodatkowych bibliotek (nie ma ESPAsyncWebServer ani WebSocketów) – sterowanie przez zwykłe zapytania HTTP (`fetch`).
- **Małe oczy:** `N_MALYCH` (domyślnie 10) na kanałach 0…N−1, tylko lewo–prawo, zakres ±25° (±278 µs, 2000/180 µs na stopień), środki z kalibracji w NVS (domyślnie 1500). Mapa: kąt położenia każdego oka na obwodzie dyni (azymut, domyślnie równo w łuku −100°…+100° od przodu) – do kolejności Fali i do „Wszyscy tam!” (oko patrzy w kierunek celu obcięty do ±25°).
- **Duże oko (jeszcze nie zbudowane):** flaga `DUZE_OKO` (domyślnie `false`), kanały 13 (lewo–prawo ±25°), 14 (góra–dół ±15°), 15 (powieki: µs zamknięte / otwarte z kalibracji). Przy `false` efekty dużego oka mają wersję uproszczoną na małych oczach albo są wyszarzone na stronie (każdy efekt określ). Uwaga: koncepcja dużego oka może przewidywać korektę sprzężenia osi w firmware – zostaw na to miejsce (funkcja mapująca kąt → µs).
- **Zasilanie:** powerbank 5 V. Wspólny limit serw w ruchu dla całej dyni `MAX_W_RUCHU` (domyślnie 4); efekt, który chce więcej, idzie kaskadą. Punkt dostępu Wi-Fi włączony stale (podtrzymuje powerbank – test 22.10).

## Zasady bezpieczeństwa ruchu (twarde)

- SG90/MG90S nie znają pozycji. **Start bez skoku:** ostatni zadany cel każdego serwa w NVS; po włączeniu najpierw ten impuls, potem płynnie do środka. Zapisuj **cel ruchu przy jego rozpoczęciu** (nie co 100 ms – zużycie flash przy 13 serwach), a po zakończeniu ruchu pozycję końcową.
- Każdy ruch płynny (profil z rozpędem i hamowaniem jak w `oczy-ruch`), limit prędkości; żadnych skoków impulsu.
- Strona nigdy nie wysyła surowych µs (poza panelem kalibracji rodzica z twardym ograniczeniem).
- Twarde ograniczenie zakresu przed każdym zapisem do PCA9685.
- **Heartbeat:** gdy przez ok. 20 s nie przychodzi żadne zapytanie ze strony, dynia płynnie wraca do pokazu automatycznego (tryb spoczynku z `oczy-ruch`).
- Efekty długie i męczące (hipnoza, rozbiegane) mają twardy limit czasu; „Bu!” ma przerwę ochronną (np. 10 s).

## Efekty (wybór orkiestratora z sześciu raportów i listy użytkownika)

Małe oczy (działają bez dużego oka):
1. **Fala** – spojrzenie obiega dynię w kolejności azymutu; warianty: w prawo, w lewo, tam i z powrotem.
2. **Wszyscy tam!** – stuknięcie w kierunek na rysunku dyni (półkole), oczy kaskadą parami patrzą w tę stronę; po kilku s powrót do automatu.
3. **Zez** – oczy zbiegają się do osi dyni, chwila, powrót.
4. **Rozbiegane / spłoszenie** – krótkie nerwowe sakady, potem rozbiegnięcie na boki; twardy limit czasu.
5. **Mucha** – wyimaginowana mucha leci wokół dyni; oczy po kolei ją śledzą i odwracają się, gdy minie.
6. **Znajdź buntownika** – wszystkie patrzą w jedną stronę, jedno losowe w drugą (łypie); strona po chwili może pokazać, które (dla syna).
7. **Kłótnia sąsiadów** – para sąsiednich oczu zerka ku sobie i odwraca się obrażona.
8. **Pianino oczu** – rysunek dyni z oczami; dotyk oka obraca je (tam i z powrotem), przeciągnięcie po łuku wychyla kolejne.

Duże oko jako postać (z wersją uproszczoną bez dużego oka, gdzie się da):
9. **Pacynka** – pad 2D prowadzi duże oko (ostatni cel wygrywa, ok. 10 zapytań/s), stuknięcie = mrugnięcie, suwak powiek. Bez dużego oka: pad X steruje wszystkimi małymi oczami (kaskada, lider i stado).
10. **„Bu!”** – dynia udaje uśpioną, potem duże oko otwiera się szeroko na wprost, po 0,2–0,3 s małe kaskadą na wprost; bez dużego oka: małe nagle (kaskadą) na wprost i drżenie.
11. **Zdziwienie** – oko mija cel, wraca, dwa mrugnięcia, pełne otwarcie; małe kaskadą.
12. **Przewracanie oczami** – łuk pod półprzymkniętą powieką; bez dużego oka: wszystkie małe wolno na skraj i z powrotem.
13. **Zasypianie i budzenie** – powieki opadają skokami, małe po kolei na środek i bezruch; budzenie z „jeszcze 5 minut” (jedno oko zerka i zasypia), potem zryw.
14. **Emocje** – przyciski: senny, ciekawski, podejrzliwy (wolny skan spod przymkniętej powieki), przestraszony, znudzony; każda emocja = zestaw parametrów automatu (rozwarcie, częstość i zakres sakad, fiksacja, mruganie) na ok. 30–60 s albo do zmiany.
15. **Hipnoza** – duże oko wolne koła, małe w zezie; limit czasu.
16. **Szef ucisza bunt** – małe rozrabiają, duże nagle otwiera się groźnie, małe stają na baczność (środek).

Gry i sztuczki:
17. **Wyrocznia tak / nie** – trzy duże, nieopisane wprost przyciski (syn wie, który jest który): kiwnięcie (tak), kręcenie (nie), przewracanie oczami (nie wiem). Bez dużego oka: tak = małe kaskadą w dół?… nie da się (tylko lewo–prawo) – wtedy tak = „wszyscy patrzą na pytającego” (na wprost) i mrugnięcie zastąpione drżeniem, nie = fala w obie strony.
18. **Tryb magika** – ekran udaje coś niewinnego (np. czarny ekran z zegarem albo „kalkulator”), dziewięć ukrytych stref 3×3 wywołuje: lewo, prawo, wprost, „Bu!”, zez, fala, mrugnij, zasypianie, budzenie. Wyjście: przytrzymanie rogu przez 2 s.
19. **Refleks** – duże oko (albo małe kaskadą) „otwiera się” w losowej chwili 2–8 s; strona mierzy czas stuknięcia; wynik i rekord dnia.
20. **Baba Jaga (ręcznie)** – oko zamknięte / małe na środku i nieruchome; przycisk „Patrzę!” odpala gwałtowne (ale w limicie prędkości) spojrzenie w losową stronę.
21. **Tryb trolla** – przełącznik: sterowanie odwrócone (lewo↔prawo) w Pacynce i Pianinie; przycisk „awaria” = wytrzeszcz + rozbiegane.

Fundament:
- Kolejka ruchu z `MAX_W_RUCHU`, priorytet efektu nad automatem, „ostatni wygrywa” dla padów.
- Tryby: **automat** (spoczynek z `oczy-ruch`, domyślny), **efekt**, **sterowanie ręczne**.
- **Role:** każdy z hasłem Wi-Fi ma stronę zabawy; **panel rodzica** za PIN (domyślny 4-cyfrowy w stałej): kalibracja środka każdego oka (płynne `g`-podobne przesuwanie, zapis w NVS), wyłączenie uszkodzonego oka, liczba małych oczu, `MAX_W_RUCHU`, flaga dużego oka (jeśli da się w runtime, inaczej stała), „Parkuj” (wszystkie płynnie na środek i stop), restart, dziennik (czas pracy, liczba startów i przyczyna ostatniego, liczba ruchów – jak `test-24h`).
- **Tryb wystawowy** (przełącznik w panelu rodzica): ukrywa na stronie gości wszystko poza bezpiecznymi efektami; „Parkuj”/stop tylko rodzic.
- **Wi-Fi:** punkt dostępu widoczny, SSID `Dynia`, hasło w stałej (domyślnie `dynia2026`), kanał 1, `max_connection` 4; captive portal (DNSServer odpowiada adresem ESP, przekierowania `/generate_204`, `/hotspot-detect.html` itp. na stronę główną, żeby iOS sam otworzył okno logowania z naszą stroną).
- `/api/stan` (JSON): tryb, bieżący efekt, pozycje wszystkich oczu (stopnie), rozwarcie powiek, liczba klientów, czas pracy – strona rysuje na tej podstawie **podgląd dyni z oczami na żywo** (to też frajda dla dziecka).
- Port szeregowy: komendy jak w `oczy-ruch`/`test-24h` (`l`, `z`, `k<nr> <us>`, `c`, `a`/`s`) do diagnostyki.

## Strona

- Jeden plik HTML z CSS i JS w środku, bez zewnętrznych zasobów (bez internetu), rozmiar rozsądny dla flash (cel < 60 KB; możesz trzymać skompresowany gzip w PROGMEM, jeśli Ci to pomaga – opisz).
- Mobile-first od 320 px szerokości, duże przyciski (≥ 44 px), wysoki kontrast, czytelne bez okularów; ikonki emoji zamiast obrazków; motyw Halloween (ciemne tło, pomarańcz), ale bez przesady w animacjach (stary iPhone).
- Zakładki u dołu: **Efekty**, **Pacynka**, **Magik**, **Gry**, **Rodzic**. Na górze mały podgląd dyni z oczami na żywo.
- Działa w Safari na iOS 15+ (bez API wymagających HTTPS: bez żyroskopu, mikrofonu, wibracji). Dotyk: `pointer`/`touch` bez opóźnień 300 ms, bez przypadkowego powiększania (`touch-action`, viewport bez skalowania).
- **Tryb symulacji:** po otwarciu pliku lokalnie (`file:`) albo z `?symulacja=1` strona działa bez ESP: symuluje odpowiedzi API i animuje podgląd oczu w JS – orkiestrator zrobi z niego zrzuty ekranu dla użytkownika.
- Źródło strony trzymaj jako osobny plik `.html` w szkicu, a do firmware wkładaj przez prosty skrypt Pythona generujący nagłówek (opisz w README szkicu, jak przebudować).

## Pliki

- `50-elektronika/dynia/dynia.ino` (+ ewentualnie kilka plików `.h`/`.cpp` w tym samym katalogu: ruch, efekty, serwer),
- `50-elektronika/dynia/strona/index.html`,
- `50-elektronika/dynia/zrob_strone.py` (generuje `strona_html.h`),
- `50-elektronika/dynia/README.md` (co to jest, jak skompilować, jak wgrać, ustawienia, API, jak dodać efekt).

## Gotowe, gdy

- Kompiluje się bez błędów i ostrzeżeń własnego kodu (podaj wynik `arduino-cli compile` i zajętość flash/RAM).
- Strona w trybie symulacji działa lokalnie (sprawdź składnię JS, np. `node --check` na wyciętym skrypcie; jeśli masz przeglądarkę – zrzut).
- Każdy efekt z listy ma implementację po stronie ESP i przycisk na stronie, z wersją bez dużego oka.
- W README: tabela efektów (nazwa, co robi, serwa naraz, wersja bez dużego oka), lista stałych do ustawienia, znane ograniczenia i co trzeba sprawdzić na sprzęcie.
- Bez prognoz czasu.
