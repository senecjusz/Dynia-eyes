# Przekazanie dla nowej sesji orkiestratora (21.10.2026, wieczór)

Dla orkiestratora, który przejmuje projekt po sesji 19–21.10. Poprzednia sesja skończyła się na ok. 90% kontekstu. Zasady pracy: `AGENTS.md` (obowiązuje w całości). Braki w dokumentacji z tej sesji: `20-analizy/2026-10-21-audyt-dokumentacji-sesji.md`.

## Pierwsze kroki

1. `git pull`; przeczytaj `AGENTS.md`, `30-projekt/teraz.md`, `30-projekt/decyzje.md` (wiersze 20–21.10), ten plik i audyt.
2. **Uwaga:** `30-projekt/stan-projektu.md` jest z 18.10 i jest nieaktualny (audyt P1). Ważniejszy jest ten plik.
3. Pokaż użytkownikowi listę braków z audytu i diff poprawek. Commit dopiero po „ok”. Najpierw I1: Krok 4 instrukcji i środki w `test-24h`, zanim użytkownik złoży i skalibruje drugi moduł.
4. Wszystko jest w repo: `montaz-v2.8.md` i `test-24h/` z poprawkami audytu weszły w commit `6b25e06` (21.10).
5. Munin: ostatni zapis (punkt zapisu) to 19.10, 22:54 (zgłoszenie `2026-10-19-pcl-mefisto-claude-eb2cdf70-dynia-electronics-test`, Charon `0b4832a`). Dni 20 i 21.10 nie są zapisane w Muninie. Na 19.10 `done-for-today` czekało na zgodę, której nie było. Użytkownik nie chce jeszcze projektu dyni w Muninie (rozważa obszar prywatny – to nie decyzja).

## Stan projektu

### Wersje modułu małego oka

Wszystkie wersje od v2.5 są w jednym dokumencie Onshape **„Oko F v2.5”** (folder Halloween). Dziś zawiera on stan v2.8. Nazwana wersja Onshape „v2.5” (20.10) zachowuje stan z 19.10. Dla v2.6–v2.8 nazwanych wersji nie ma, a przynajmniej `stan-api.json` ich nie odnotowuje. Eksporty: `40-cad/3mf/Oko F v2.x/`, do druku zawsze plik `… - FullProject.3mf`.

| Wersja | Co zmieniła | Stan |
|---|---|---|
| v2.5 (19.10) | 10 części, Sanki serwa, wkładki M3 w Cięgnie i uchach Pokrywy | wydrukowana i złożona 19/20.10; montaż wykazał wady (dziennik 20.10) |
| v2.6 (20.10) | Gniazdo: rant Ø67,5, ząbki przy ściance, bruzdy 8,3 pod łby osi; Kaseta: blok przedni + okno zamiast Sanek, ucha Pokrywy w środku; nowa Klamra H; Pokrywa-krążek; `wkladkaD` 4,4 | wydrukowana 20.10 (Gniazdo, Kaseta, Klamra H, Pokrywa) |
| v2.7 (20.10) | Cięgno bez piast: przeguby C i H na M3×12 + 1 podkładka + nakrętka samohamująca | Cięgno dodrukowane; **pierwszy moduł złożony 21.10 z v2.6 + Cięgno v2.7 + Jarzmo, Ramię, tulejki i Nakrętka z v2.5** |
| v2.8 (21.10) | uszy SG90 na M3×10 w Ø2,6 × 8 bez kanału (blok Kasety, Klamra H); ucha Pokrywy Ø2,6 × 5,6 pod M3×8 w plastik, bez wkładek; luz korpusu SG90 0,4 | model `a56bf7b`, eksport sprawdzony (10 brył), w repo (`c128aa6`); **do druku tylko Kaseta i Klamra H – wydruk niepotwierdzony** |

- **API Onshape:** w roku zużyte 558 wywołań (`40-cad/onshape/stan-api.json`). E5 zużyło 17 z 30.
- **Odbiór:** K2–K4 dla v2.6 policzone przez orkiestratora na surowych danych (`40-cad/onshape/odbior-v2.6/`). Dla v2.7 i v2.8 orkiestrator sprawdzał objętości rachunkiem, K2–K4 tylko według raportów wykonawcy (`weryfikacja-v2.6.md`, sekcja v2.6b, oraz `weryfikacja-v2.8.md`). K9 nie wykonano ani dla v2.7, ani dla v2.8 (budżet).

### Co działa (sprawdzone na sprzęcie)

- **Elektronika (19.10, E3.4):**
  - ESP32-C3 SuperMini + PCA9685 (0x40) + SG90 na kanale 0;
  - SDA 8, SCL 9, VCC 3,3 V, V+ z pinu 5V;
  - arduino-cli w `~/.local/bin`, rdzeń esp32 3.3.12;
  - wgrywanie przez `newgrp uucp` (komendy `sg` nie ma w systemie).
- **Pierwszy moduł (21.10):**
  - złożony w całości, bez Gniazda w dyni (użytkownik nie ma dyni i na razie nie planuje testu w dyni);
  - skalibrowany: środek **1500 µs** po ponownym nasadzeniu dźwigienki w położeniu „otwarte V, przegub H po prawej, patrząc od tyłu”; płynny ruch w ±300 µs;
  - program `oczy-ruch` (±25° serwa = ±278 µs) działa; użytkownik: „fajnie to wygląda”.
- **Piłeczka:** cyjanoakryl z primerem + 2 × M3×10 w nawierconych biegunach. Trzyma; decyzja 21.10: rozwiązanie docelowe.

### Czego nie sprawdzono

- Gniazdo v2.6 w dyni (rant 2 mm, ząbki przy ściance, łby w bruzdach). Decyzja 21.10: v2.8 bez czekania na ten test.
- v2.8 na wydruku: M3 w Ø2,6 w uszach SG90 i w uchach Pokrywy.
- Powerbank (auto-wyłączenie) i praca ciągła.
- Średnica wiertła do biegunów piłeczki (instrukcja przyjmuje Ø2,5 – zapytać).
- Czy w Kasecie v2.6 wtopiono wkładki Ø4,4 i jak wyszły.

## Bieżące zadanie i kolejka

W `teraz.md` jako bieżące zadanie stoi wciąż E3.3; trzeba je zmienić (audyt T1). Rzeczywista kolejka, ustalona przez użytkownika 21.10 o 22:34 („usuń pliki, zrób instrukcję, wróćmy, a potem test elektroniczny”):

1. **E5.3 – instrukcja v2.8:** zrobiona w `70-budowa/montaz-v2.8.md` i zacommitowana (`6b25e06`) z poprawkami audytu I1–I6, w tym Krok 4: dźwigienka przy serwie trzymającym 1500 µs programem `kalibracja`, nie `test-serwa`.
2. **Test powerbanku** (do dopisania jako E5.5): program `50-elektronika/test-powerbank` gotowy.
   - Przebieg: 7 faz po 3 min, ok. 20–25 min, z udziałem użytkownika (po zgaśnięciu wciska przycisk powerbanku).
   - Warunki: Baseus naładowany do pełna, a do niego potem ewentualnie Manta; najpierw skasować NVS (`r`).
   - Kolejność: zrobić **przed** testem 24 h. Jeśli powerbank trzyma przy ruchu, test 24 h może iść na nim.
3. **Test 24 h mechaniki** (do dopisania jako E5.6): program `test-24h` gotowy (środki oczu w NVS, komendy `k0`/`k1`, `z`, `l`), w repo.
   - Warunki: dwa moduły na kanałach 0 i 1, zasilacz USB, tryb stale aktywny; przed startem `z`, po teście `l`.
   - Po teście sprawdzić: luz oka, drganie na postoju, temperaturę serwa, nakrętki.
   - Użytkownik uważa, że największe ryzyko to mechanika, nie elektronika: „ja obstawiałem mechanikę”.
   - Uwaga: środki obu kanałów są w kodzie na 1500 µs (audyt I1).
4. **Drugi moduł** (do dopisania jako E5.7): użytkownik 21.10 o 22:38: „teoretycznie mogę złożyć z komponentów, które mam, drugi mechanizm”.
   - Niepotwierdzone, z których wersji ma części. Potrzebne będą Kaseta i Klamra H v2.8.
   - Kalibracja jak dla pierwszego modułu, w programie `kalibracja` z `KANAL` = 1.
5. **E5.4 – stanowisko kalibracji i tabela modułów** `50-elektronika/kalibracja-oczu.md`: plik jeszcze nie istnieje. Każdy moduł dostaje numer, środek i krańce. Firmware czyta z tabeli.
6. Dalej (bez decyzji): seria ~10 modułów, firmware (koncepcja zachowania w Parkingu), duże oko, pudełko elektroniki, kalibracja z telefonu.

## Wykonawca

- Sesja **„Wykonawca CAD”**: worktree `.claude/worktrees/heuristic-brattain-6e5ce2`, gałąź `claude/heuristic-brattain-6e5ce2` na `a56bf7b`, **scalona z `main`**, drzewo czyste. Jest bezczynna od zakończenia v2.8 (21.10 ok. 22:00) i nie ma zlecenia.
- **Remote Control** dla tej sesji jest włączone od 20.10, na prośbę użytkownika („zrób mu /rc, abym go widział”).
- Orkiestrator nie umie założyć nowej sesji. Umie pisać do istniejących i włączać w nich Remote Control. Nową sesję zakłada użytkownik.
- **Obserwacja:** `40-cad/narzedzia/pilnuj-wykonawcy.sh <worktree> <plik stanu> [minuty]` w tle po każdym zleceniu; po sygnale sprawdzić i uruchomić ponownie. Dziś w tle nic nie działa.
- **Onshape:**
  - sesja logowania wygasa po kilkudziesięciu minutach bezczynności, a otwarta karta jej nie podtrzymuje;
  - przeglądarki sesji **nie dzielą profilu**: logowanie u wykonawcy nie loguje orkiestratora (19/20.10 orkiestrator najpierw twierdził inaczej i się mylił);
  - przed każdym zleceniem sprawdzić logowanie u wykonawcy; zalogować może się tylko użytkownik – lokalnie albo zdalnie przez `wayvnc` i tunel SSH (Tailscale), w panelu przeglądarki sesji wykonawcy.
- **Stan wyjściowy zlecenia:** microversion dokumentu zmienia się też bez zmian modelu (rozwijanie folderów, Show/Hide, eksport). Ustalenie z 21.10 (`stan-api.json` → `e5.uwaga`): zadanie zaczyna od jednego `GET /features`, które porównuje się z ostatnim odbiorem, w budżecie zadania.

## Otwarte sprawy (bez decyzji albo czekające na zgodę)

- Wnioski procesowe do `AGENTS.md`: z 19.10 (już w Parkingu) i z 20–21.10 (audyt T4: microversion, osobne profile i odbiór na surowych danych, Codex w tle, Fable zamiast Opusa, „SimpleEye” → „Oko F v2.5”, eksport ręczny całym zestawem). **Nie zmieniać `AGENTS.md` bez zgody.**
- Kalibracja początkowa (użytkownik 21.10: „niepokoi mnie”): znak pozycji zero, kształt uniemożliwiający złożenie czworoboku odwrotnie, łagodny rozruch i zapisany środek w firmware (audyt T3).
- Pomiar SG90 od obu dostawców przed serią (kieszeń korpusu ma 0,4 z każdej strony) – audyt T5.
- Gniazdo USB-C (breakout z 5,1 kΩ): czy jest w warsztacie – pytanie z 20.10 bez odpowiedzi.
- Decyzja o zasilaniu (powerbank przez USB-C, bez 12 V i NiMH) – w rozmowie zapadła, w `decyzje.md` jej nie ma (audyt D1).
- Poszerzenie wybrania H w Kasecie (wariant A z E4.4) odłożone. Ocieranie 21.10 wynikało ze złego położenia czworoboku, nie z geometrii. Przy ±30° oka luz nakrętki H do ścianki wynosi 0,79, przy ograniczniku ±33° – 0,27.
- E2.2 (porządki w modelu, K6: 53 szkice) i E2.3 (Assembly) – otwarte, bez terminu.
- Ręczne porządki w Onshape i drobiazgi – audyt T7.

## Zasady współpracy, których użytkownik pilnuje (z tej sesji)

Pełne zasady są w `AGENTS.md`. Poniżej to, co użytkownik w tej sesji egzekwował wprost, z przykładami.

- **Parafraza przed działaniem, krótko, jedno pytanie na końcu.** Na start: bieżące zadanie jednym zdaniem.
- **Krok po kroku, bez wyprzedzania.** 19.10: „za szybko i za daleko idziesz. Najpierw sprawdźmy, czy uda nam się zrobić miganie diodą”. Najpierw najprostszy test, potem następny.
- **Schemat zamiast opisu przy podłączaniu.** 19.10: „jaja sobie robisz – schemat/rysunek przygotuj, aby ograniczyć ryzyko pomyłki”. Rysunek pokazuje moduły tak, jak leżą; etykiety pinów trzeba porównać z nadrukiem.
- **Przed zapisem podsumuj, co zmieniamy i dlaczego.** 20.10: „podsumuj, co zmieniamy i dlaczego, zanim to zapiszesz”. Także 21.10: „a może najpierw to przegadamy, zanim zapiszesz”. Diff przed każdym commitem, commit i push po „ok”.
- **Briefy z pełnym kontekstem i uzasadnieniem, nie równoważniki zdań.** 20.10: „bez konceptu, bez kontekstu … jeżeli przekażesz to w ten sposób modelowi, to on to spierdoli”. Przed briefem zebrać **wszystkie** uwagi użytkownika z rozmowy („przepatrz feedback od początku”).
- **Najpierw specyfikacja, potem pytania.** 20.10: „masz specyfikację, możesz sobie to sprawdzić” (Kaseta wsuwa się osiowo, nie obraca się). Nie teoretyzować, gdy odpowiedź jest w repo.
- **Bez absurdalnych napraw.** 20.10: „jak mam tak mały element zeszlifować dookoła, aby się zmieściło centralnie” – małej części nie da się obrobić współosiowo.
- **Pilnowanie wersji.** 20.10 orkiestrator pomylił, co jest wydrukowane („chrzanisz … brakuje ci wersji 2.6”). Przed listą „co drukować” sprawdź tabelę wersji powyżej.
- **Komplet do druku, nie na raty.** 20.10: „Nie chcę drukować na raty, daj mi poprawiony set”.
- **Orkiestrator odpowiada za wykonawcę pod nieobecność użytkownika.** 20.10: „Pamiętaj, mnie tam nie ma, ty odpowiadasz za monitoring wykonawcy”. Decyzje techniczne wykonawcy (stop bramki, wybór wariantu) podejmuje orkiestrator i nie odsyła wykonawcy do użytkownika. Zmiany projektu pozostają decyzją użytkownika.
- **Ostrożność przy serwie.** 21.10: „pierdzielnęło w lewo na maksa … powinieneś bardzo spokojnie przełączać”.
  - SG90 nie podaje pozycji, więc żadnych skoków: program startuje bez impulsu, a ruch idzie płynnie (`g <cel> <ms>`).
  - Ruchy mają być wolne i wyraźne, żeby użytkownik zdążył je zobaczyć („czy ty musisz zmieniać pozycję tak szybko”).
  - Gdy zdalne prowadzenie nie działa, oddać użytkownikowi sterowanie z terminala (`arduino-cli monitor`).
  - Pytać jednym słowem („prosto / lewo / prawo”), z ustalonymi kierunkami (serwo na dole, patrzymy od przodu).
- **Nie obiecywać bez sprawdzenia; fakt oddzielony od założenia.**
  - 19.10: szacunek 300–400 MB na arduino-cli okazał się 7,7 GB.
  - 20.10: „profil przeglądarki jest wspólny” okazało się nieprawdą.
  - Stan wykonawcy podawać tylko sprawdzony.
- **Bezpieczeństwo dziecka.** 12 V odrzucony; przy kleju i otwornicy pracuje tylko rodzic.
- **Zakupy:** najpierw sprawdzić, co jest w warsztacie, i odradzać zbędne zakupy (NiMH, ogniwa C). Wyszukiwanie w Amazon.pl działa przez przeglądarkę w aplikacji na komputerze użytkownika. Zakup należy do użytkownika.
- **Hasła:** agent nie wpisuje haseł i nie kopiuje ciasteczek sesji, nawet za zgodą użytkownika. Użytkownika to frustruje („żadne z tych rozwiązań nie rozwiązuje problemów”), więc nie proponować obejść, tylko zdalny pulpit.
- **Eksport i pliki:**
  - użytkownik eksportuje z Onshape do `40-cad/` w repo („przecież zawsze ściągam do CAD”), a nie do `~/Downloads`;
  - plik całego zestawu `… - FullProject.3mf` ma wejść do commita;
  - ustawienia eksportu 3MF: odchyłka 0,00001 m, kąt 3°, cięciwa 10 m.
- **Podagenci:** zlecenia dla agentów jako osobne, widoczne sesje; zapytać, zanim uruchomisz podagenta. Review uruchamiać tylko na wyraźną prośbę – 20.10 użytkownik sam kazał „wrzuć do analizy Fable’owi oraz Astrze”.

## Pułapki z tej sesji

1. **`test-serwa` nie trzyma środka:** po 5 s jedzie ±30° w pętli. Do nasadzania dźwigienki służy `kalibracja` i komenda `1500`.
2. **Czworobok składa się na dwa sposoby.** W złym położeniu przegub H się składa, Ramię kładzie się na Cięgnie i serwo blokuje mechanizm. Poprawne jest „otwarte V” z H po prawej (patrząc od tyłu) – rysunek `70-budowa/montaz-v2.7/pozycja_zero.svg`.
3. **Kalibracja:** po `off` albo ręcznym przesunięciu oka następny `g` startuje od ostatniego zadanego impulsu, nie od faktycznej pozycji. `k<nr> <µs>` w `oczy-ruch` działa tylko do restartu.
4. **Port zajęty:** gdy użytkownik ma otwarty `arduino-cli monitor`, orkiestrator nie wgra programu ani nie odczyta portu. Trzeba go poprosić o Ctrl+C.
5. **ESP32-C3:**
   - bez `Serial.setTxTimeoutMs(0)` pętla zwalnia, gdy nikt nie czyta portu;
   - GPIO8 to jednocześnie SDA i niebieska dioda;
   - pierwsze podłączenie USB dało błąd -71, ponowne podłączenie pomogło.
6. **Bramka API:** odpowiedź bez nagłówka `X-Rate-Limit-Remaining` (np. 404 pod złym adresem) zatrzymuje wykonawcę. Stop zdejmuje orkiestrator po sprawdzeniu przyczyny. W E4 limit 4 odczytów drzewa wyczerpał się przed poprawkami; budżet `GET /features` trzeba planować z zapasem na kontrolę stanu wyjściowego.
7. **Kontrola siatek:** `sprawdz_siatki.js` na pliku FullProject zgłasza ok. 350 krawędzi wspólnych więcej niż 2 trójkątom – to styk brył w pozycji złożenia, nie błąd. Bryły rozdziela się przez `70-budowa/montaz-v2.7/3mf_do_stl.py --rozdziel`. Nakrętka ma 2 zdegenerowane trójkąty od v2.5 – bez znaczenia.
8. **Bambu Studio:** pojedyncze 3MF z archiwum zip z Onshape wieszają import; działa jeden plik całego zestawu zaimportowany jako geometria. Archiwum zip z Onshape ma w nazwie „Oko F v2.5” także dla nowszych wersji.
9. **Review Codeksa (Astra) na siatkach** trwa ponad 10 min. Na pierwszym planie przekroczyło limit, więc uruchomiono je w tle z limitem 40 min. To przeczy zasadzie z `AGENTS.md` („nigdy w tle”), dlatego następnym razem trzeba zapytać użytkownika (audyt T4 c).
10. **Wykonawca potrafi stać:** czeka na wynik własnego sprawdzenia, choć jego sesja jest bezczynna (20.10, 6 min). Po sygnale „brak zmian” sprawdzić status sesji i ponaglić.
11. **Linki do plików na gałęzi wykonawcy przed scaleniem** prowadzą do worktree – po scaleniu podawać ścieżki z `main`.
12. **Ustalenia odłożone „na następną wersję” giną, jeśli nie trafią od razu do Parkingu.** 20.10 użytkownik zaproponował Pokrywę na M3 wprost w plastik; zrobiono wtedy tylko Cięgno, a Pokrywa nigdzie nie została zapisana. 21.10 użytkownik sam to wyłapał („nie masz zmiany usunięcia wkładek w pokrywce”). Przed planem nowej wersji przejrzyj Parking i rozmowę.
