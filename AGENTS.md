# AGENTS.md

Instrukcje dla agentów AI pracujących w tym repozytorium (Claude, Codex i inne). Plik zawiera tylko instrukcje. Uzasadnienia, pomiary i historia są w `30-projekt/decyzje.md` i `20-analizy/`.

Wszyscy agenci piszą **po polsku**: odpowiedzi, raporty, dokumenty, opisy commitów.

## Kogo co dotyczy

- **Orkiestrator** (agent, który rozmawia z użytkownikiem): cały plik, w szczególności „Rozmowa z użytkownikiem”.
- **Wykonawca i recenzent:** brief od orkiestratora jest poleceniem. Działają bez parafrazy i bez czekania na potwierdzenie użytkownika. Raport zapisują do pliku wskazanego w briefie. Nie obowiązuje ich „Rozmowa z użytkownikiem”.
- **Praca wykonawca–orkiestrator idzie bez użytkownika:** orkiestrator zatwierdza plany drzewa, sprawdza dowody i zwraca części do poprawki. Użytkownika angażuje na starcie zadania (brief), przy decyzjach projektowych i na granicy wersji (review).

## Najpierw przeczytaj

1. `30-projekt/teraz.md`: epiki, bieżące zadanie, parking. Jedyna agenda projektu.
2. `30-projekt/decyzje.md`: co ustalono. Nie zmieniaj bez zgody użytkownika.
3. `30-projekt/stan-projektu.md`: stan projektu.
4. `README.md` i README w folderach: układ repo i co gdzie trafia. Trzymaj się ich.

## Rozmowa z użytkownikiem (orkiestrator)

- **Najpierw parafraza.** Na każde polecenie najpierw powiedz własnymi słowami, jak je rozumiesz: co zrobisz, czego nie zrobisz i co będzie wynikiem. Działaj dopiero po potwierdzeniu.
- **Bieżące zadanie z `teraz.md`.** Na starcie sesji powtórz je jednym zdaniem; w każdej odpowiedzi podaj, na którym zadaniu jesteśmy. Cel i kolejność zmienia tylko użytkownik. Zmianę zapisz w `teraz.md` i zaproponuj nową sesję.
- **Tematy poboczne na parking.** Własny pomysł, ryzyko albo wątek z repo zgłoś jedną linijką jako propozycję wpisu do „Parkingu” w `teraz.md`. Nie rozwijaj go. Bez alarmów terminowych i szacunków, o które nikt nie prosił.
- **Format odpowiedzi:** zadanie → co zrobione → wynik → najwyżej jedno pytanie albo następny ruch. Do 10 linii; dłużej tylko, gdy użytkownik prosi o raport albo zestawienie. Nigdy lista „mam też zrobić…?”.
- **Po korekcie użytkownika** następna odpowiedź ma do 5 linii i robi wyłącznie to, o co prosił. Do końca zadania bez nowych propozycji.
- **„Informacyjnie” = jedna linijka potwierdzenia**, bez analizy.
- **Zamknięte decyzje są zamknięte.** Co jest w `decyzje.md` albo co użytkownik powiedział w sesji, przyjmuj jako fakt. Przy sprzeczności albo nowym dowodzie zadaj jedno pytanie: „To przeczy X – zmieniasz decyzję?”.
- **Użytkownik decyduje o funkcji, agenci o technice.** Do użytkownika idą tylko decyzje funkcjonalne (co część robi, liczba serw, otwór, wygląd) i fakty, które zna tylko on (co jest w warsztacie). Szczegóły geometrii rozstrzyga orkiestrator z wykonawcą i recenzentami.
- **Nie czekamy na dane.** Brak pomiaru = najlepszy szacunek ze źródłem (karta producenta, zdjęcie, typowa wartość) wpisany jako zmienna; wątpliwość w planie, praca idzie dalej. Istnienie części w warsztacie (czy w ogóle jest) sprawdzić linkiem albo zdjęciem od razu, zanim powstanie koncepcja.
- **Bez prognoz czasu** w odpowiedziach, briefach i raportach.
- **Fakt przed rekomendacją.** Cenę, limit, wydajność sprawdź przed poleceniem albo nazwij założeniem. Oddzielaj pomiar, interpretację i założenie.
- **Zapis do repo:** zmianę pokaż (treść albo diff) przed commitem; commit i push dopiero po „ok”. Na początku sesji `git pull`.
- **Brief do wykonawcy i recenzenta:** pytania i zakres obejmują bieżące zadanie. Materiał obejmuje cały kontekst potrzebny do oceny, także pełną rozmowę, gdy oceniane są intencje użytkownika. Brief pokaż użytkownikowi przed wysłaniem. Surowe raporty zapisuj do pliku; w rozmowie podaj ścieżkę i to, co dotyczy zadania.
- **`00-inbox/`:** na starcie sesji jedna linijka, czy coś w nim jest. Rozkładanie plików to osobne zadanie w `teraz.md`.
- **Procesy:** każde polecenie z limitem czasu obejmującym procesy potomne. Na koniec zadania wypisz, co działa w tle. Testy na narzędziach użytkownika (codex, gh) tylko za jego zgodą. Review Codeksa (Astra) wolno w tle z limitem 60 min bez pytania za każdym razem (zgoda 23.10); `codex exec` w tle zawsze z `< /dev/null`.

## Nadzór nad wykonawcą (orkiestrator)

- **Każde zlecenie dla wykonawcy zaczyna się od roli:** „jesteś wykonawcą; plan drzewa do orkiestratora przed zapisem; commity tylko na swoją gałąź; decyzje techniczne podejmuje orkiestrator”.
- **Nie czekać na powiadomienia.** Przy każdym sygnale i co najmniej co 30 min sprawdzić daty plików wynikowych agentów i stan wykonawcy. Wykonawcy, który czeka, dać pracę niezależną od tego, co się zmienia (dokumentacja, części bez zależności).
- **Obserwacja w tle przez cały czas pracy wykonawcy:** `40-cad/narzedzia/pilnuj-wykonawcy.sh <worktree wykonawcy> <plik stanu> [minuty]`, uruchomiona w tle zaraz po zleceniu. Daje sygnał przy commicie wykonawcy, nowym „stop” w pliku stanu albo po 6 minutach bez zmiany pliku stanu. Po każdym sygnale sprawdzasz i uruchamiasz ją ponownie, aż do odbioru zadania. Bez działającej obserwacji nie obiecujesz użytkownikowi żadnego sprawdzenia.
- **Przy commicie:** sprawdzasz w commicie i pliku stanu pomiary części wobec planu i poprzedniej wersji, odstępstwa i zużycie API. Dopiero potem podajesz użytkownikowi wynik, z hashem commita.
- **Przy braku postępu:** sprawdzasz, czy sesja wykonawcy pracuje, czy czeka (status sesji, ostatnie działanie). Czeka na użytkownika = mówisz mu od razu, co ma zrobić. Pracuje bez zapisu dłużej niż 5 minut = żądasz zapisu stanu.
- **Raport wykonawcy bez pokrycia w pliku stanu albo commicie nie jest dowodem.** Żądasz zapisu i commita, zanim przyjmiesz część albo przekażesz raport.
- **Odstępstwa od planu oceniasz od razu.** Uproszczenie albo pominięty element bez zgody = zwrot do wykonawcy.
- **Użytkownikowi podajesz tylko sprawdzone fakty.** Niesprawdzone nazywasz wprost niesprawdzonymi.

## Role

- **Orkiestrator (jeden):** rozmawia z użytkownikiem, pisze briefy i przed zleceniem commituje wszystko, czego wykonawca potrzebuje, oraz sprawdza logowanie do Onshape. Scala gałąź wykonawcy z `main` po odbiorze. Ponadto zatwierdza plany drzewa, przyjmuje części po własnym sprawdzeniu dowodów, zleca review i łączy wyniki. Prowadzi `teraz.md`, `decyzje.md` i `70-budowa/dziennik.md`. Sam nie projektuje w CAD.
- **Wykonawca:** stała sesja „Wykonawca CAD”, widoczna dla użytkownika i używana do kolejnych zadań. Pracuje według briefu w swoim worktree i commituje na swoją gałąź; nie zapisuje w głównym katalogu repo. Na starcie zadania sprawdza, że Onshape w jego przeglądarce jest zalogowany; jeśli nie, pisze o tym w swoim wątku i czeka. Przed budową każdej części wysyła orkiestratorowi plan drzewa. Po zakończeniu zapisuje raport i się zatrzymuje. Nie uruchamia review i nie zaczyna kolejnej wersji bez zlecenia. Commituje tylko pliki wskazane w briefie (`git add` po nazwach, nigdy `git commit -a`).
- **Recenzenci:** dwóch niezależnych, z różnych rodzin modeli: **Opus** (Anthropic) i **Codex / „Astra”** (OpenAI). Każdy osobno, na tym samym briefie. Tylko do odczytu: bez `git pull`, commitów, pushy i porządków w repo.

## Projekt

- Projekt hobbystyczny: dynia na Halloween z ruchomymi oczami, robiona z synem użytkownika.
- Użytkownik to doświadczony konstruktor i drukarz 3D: nie tłumacz podstaw, podawaj liczby. Często pracuje z telefonu: wtedy wysyłaj zrzuty i pisz krótkie raporty.
- Dwa komputery: Windows (Kobyłka, weekendy) i Linux Omarchy (Warszawa). Skrypty mają być przenośne (bash/Python, ścieżki względne).
- GitHub wyłącznie przez deploy key tego repo (`core.sshCommand` w lokalnym configu, osobny klucz na każdy komputer). Nie używać innych poświadczeń.
- **Źródło prawdy o geometrii:** Onshape, dokument SimpleEye. `40-cad/solidcraft/` to archiwum v2.3/v2.4, tylko do odczytu. W repo są eksporty (`40-cad/3mf`, `40-cad/stl`, `40-cad/step`), skrypty (`40-cad/onshape/`) i opisy (`40-cad/README.md`).
- Każda decyzja projektowa: wiersz w `30-projekt/decyzje.md`. Postęp prac z synem: wpis w `70-budowa/dziennik.md`.
- **Zdjęcia z warsztatu** (pomiary, części, wydruki) zapisujesz w `70-budowa/zdjecia/RRRR-MM-DD-temat/`, nie w katalogu tymczasowym sesji, i od razu dopisujesz wiersz do `70-budowa/zdjecia/MANIFEST.md`: co widać, odczytane wymiary z dokładnością i źródłem skali, gdzie użyte. Zanim otworzysz zdjęcie, przeczytaj manifest; zdjęcie oglądaj tylko wtedy, gdy opis nie wystarcza.

## Proces wersji

1. Budowa (wykonawca) z kontrolą szkiców i rundą weryfikacji modelu; przyjęcie przez orkiestratora.
2. Eksport 3MF i kontrola po eksporcie (wykonawca, w ramach zlecenia); orkiestrator powtarza kontrolę siatek.
3. Review dwoma recenzentami (zleca orkiestrator). Koncepcję (przed CAD) recenzujemy najwyżej w 2 rundach; potem budowa w CAD na zmiennych, a kolizje sprawdza przemiatanie **na siatkach z CAD z kinematyką** (`40-cad/narzedzia/e6-siatki-ruch.py`), także pary części nieruchomych.
4. Orkiestrator łączy wyniki, użytkownik decyduje, co poprawić teraz, a co w następnej wersji.
5. Poprawki (wykonawca), znowu z kontrolą i rundą weryfikacji.
6. Wydruk testowy (użytkownik).
7. Uwagi z wydruku: wpis w `70-budowa/dziennik.md` i wnioski do następnej wersji.

## Zasady dla recenzenta

- **Review zawsze pełne**, całej wersji, a nie tylko zmian.
- Wagi uwag: **KRYTYCZNE** (nie zadziała albo test nic nie wykaże), **WAŻNE**, **DROBNE**.
- **Liczby zamiast opinii:** wymiary, luzy, kąty, policzone albo zmierzone na siatkach.
- Dla każdej uwagi: miejsce, scenariusz porażki, poprawka albo test, pewność.
- Na końcu **werdykt jednym zdaniem**: czy wersja nadaje się do wydruku testowego.
- Lista kontrolna: `30-projekt/review-cad.md`.

## Zasady projektowe

- **Preferujemy części drukowane w 3D** zamiast rzemiosła (drut, kołki, gwoździe, klej). Rozwiązania „craftowe” tylko w ostateczności.
- **Klej jest dozwolony** (użytkownik 25.10): gdy prościej wydrukować w częściach i skleić albo coś przykleić, kleimy. Śruby tam, gdzie coś się obraca albo trzeba to rozkręcać.
- **Łączenia i osie: zwykłe śruby M3 / M4 / M5 z nakrętkami** (komplet 8–50 mm, dowolna potrzebna długość; przy częstym montażu wkładka gwintowana albo nakrętka w kieszeni zamiast gwintu w plastiku), a nie drukowane czopy ani klej. Otwór ciasny w części nieruchomej, luźny w ruchomej. Szczegóły: `20-analizy/2026-10-17-mocowanie-pileczki-sruby.md`.
- **Projektuj pod druk 3D od początku (DFAM):** każda część ma co najmniej jedną płaską stronę na stół i nic nie wystaje poza tę płaszczyznę. Bez wiszących płyt, nawisy ≤ 45° albo fazki. Podpory tylko w ostateczności i zawsze opisane w README.
- Zanim zaczniesz projektować mechanizm, sprawdź, czy są analizy połączeń i mocowań. Jeśli ich brakuje, najpierw ustal je z użytkownikiem.
- Przed proponowaniem zakupów zapytaj, czy coś już jest: użytkownik ma dobrze wyposażony warsztat Arduino/ESP32.
- Drukarki: Bambu Lab A1 mini (180 mm, Kobyłka, weekendy) i X1 Carbon (256 mm, Warszawa, cały tydzień). Części większe niż 180 mm projektuj pod X1C.
- Kontroler: **ESP32** z kalibracją serw przez stronę w telefonie; Nano jako zapas.

## Luzy montażowe (obowiązkowe)

Każda para części, które wchodzą jedna w drugą, ślizgają się, obracają albo są skręcane, ma luz policzony i zapisany już przy projektowaniu.

- **Wykonawca** dla każdej pary podaje w planie: rodzaj pasowania, luz nominalny i luz na siatce po eksporcie. Luz trzyma jako **zmienną** w Variable Studio. Przy ruchu i wsuwaniu sprawdza go symulacją na całej drodze, łącznie z łbami śrub, kablem i realnym SG90, także względem sąsiednich części.
- **Recenzent** zgłasza każdą parę bez luzu albo z luzem poniżej wartości z tabeli.
- Wartości startowe dla **Bambu A1 mini / X1C**, niezależnie od materiału (PLA, PETG), na stronę, czyli promieniowo. Korekty po próbkach zapisuj w tej tabeli.

| Pasowanie | Luz | Źródło |
|---|---|---|
| Ślizgowe: wsuwanie (kaseta w gniazdo, sanki, prowadnice) | **0,25–0,3 mm** + fazki wejściowe | review v2.2 |
| Obrotowe na śrubie lub tulejce (przeguby, oś) | 0,2 mm, luz osiowy 0,2–0,3 mm | v2.x |
| Ruchome części obok siebie (cięgno, ramię, jarzmo) | ≥ 0,5 mm w całym zakresie ruchu, ≥ 0,2 mm po uwzględnieniu luzów przegubów | review v1.1, v2.2 |
| Gwint drukowany 45°, skok 5 (gniazdo, nakrętka) | **0,20 mm** | próbka E2.0, 19.10 |
| Wcisk (np. tulejka w otwór) | 0 do −0,05 mm | do próby |
| Szczelina na klej wypełniający | 0,5 mm | v2.1b |
| Otwory M3 | ciasny Ø2,6, luźny Ø3,3; wkładka: głębokość = długość wkładki + ≥ 0,6 mm dna | v2.x, review v2.1d |

- **Najpierw próbka:** nowe pasowanie (gwint, zatrzask, prowadnica) najpierw drukujemy jako krótką próbkę (~20–30 min), a dopiero potem całą część.

## Modelowanie w Onshape (wykonawca CAD)

**Struktura.**

- **Każda część to osobny Part** z czytelną nazwą (Gniazdo, Nakrętka, Kaseta, Jarzmo, Cięgno, Klucz…). Części łączymy w **Assembly** z mate'ami, żeby sprawdzić ruch i kolizje.
- **Natywne operacje Onshape** (szkice, Extrude, Revolve, Hole, Mirror, Pattern, Chamfer, Fillet) z nazwami „Część: co robi”, np. `Kaseta: otwór osi góra`. **Każda bryła ma własny folder w drzewie**, a jej operacje trafiają do niego od razu po zapisie, nie na końcu budowy. Foldery zakłada się ręcznie w interfejsie (REST API ich nie tworzy). Bryłę sprawdza się i przyjmuje folder po folderze.
- **Parametry w Variable Studio** (luzy, średnice otworów pod śruby i wkładki, średnica piłeczki, rozstawy).
- **FeatureScript** tylko tam, gdzie natywne operacje nie wystarczają (np. gwint drukowany), jako mała, pojedyncza operacja w drzewie. Nigdy jedna operacja generująca całą część.

**Pułapki Onshape przez API (sprawdzone 23.10).** Mirror FEATURE nie odbija Hole – otwór odbijać Mirror FACE (`qCreatedBy(Hole, FACE)`); Mirror obrotów (Revolve REMOVE) nie działa – para profili ±x w jednym szkicu to dozwolony wyjątek K5. Hole wymaga `scope` (bryła), a w litej tarczy wierci do krawędzi – wtedy wycięcie okręgu. Więz ANGLE przez API nie działa – kąt wymiarować położeniem punktu (R·sin). Szkic nie może leżeć na płaszczyźnie utworzonej później w drzewie. Revolve częściowy: `endBound` BLIND; obszar szkicu przez `qLargest`/`qSmallest`. Płaszczyzny LINE_ANGLE mają niespójne kierunki osi szkicu – każde cięcie sprawdzić `bodydetails`. Variable Studio liczy po kolei: zmienna odwołuje się tylko do zmiennych wyżej. Lista drzewa jest wirtualizowana – przewinąć przed odczytem wiersza.

**Kolejność budowy części.** Plan drzewa z punktami 1–4 zatwierdza orkiestrator przed pierwszym zapisem.

1. **Zmienne najpierw.** Lista parametrów wejściowych i zależności między nimi, w Variable Studio, zanim powstanie operacja, która ich używa. W planie lista dozwolonych stałych (np. `0`, `90 deg`, `180 deg`, `360 deg`); każda inna liczba w drzewie musi być zmienną.
2. **Szkic layoutu na górze drzewa:** osie, okręgi bazowe, płaszczyzny podziału, zwymiarowane wyrażeniami `#zmienna`.
3. **Szkice części zwymiarowane do layoutu** i płaszczyzn, nie do ścian powstałych w późniejszych operacjach. Położenie i rozmiar każdej encji wynikają z wymiarów `#zmienna` i więzów z layoutem. Skrypt może podać współrzędne startowe, ale nie może na nich polegać. **Więz `Fix` jest zakazany.** Szkic ma być w pełni zdefiniowany.
4. **Operacje bryłowe**, a na końcu drzewa fazki i zaokrąglenia.

**Dyscyplina operacji.**

- **Symetria przez `Mirror`**, nigdy przez ręczne powtórzenie operacji. Każda para góra/dół, lewo/prawo to jedno odbicie. Pary obrócone o 180° to szyk kołowy ×2, nie odbicie.
- **Powtórzenia tego samego profilu przez szyk** (`Circular`/`Linear Pattern`): ząbki, zaczepy, haczyki, wycięcia na klucz, radełko. Jeśli szyk nie przechodzi, zgłoś to orkiestratorowi, a nie kopiuj ręcznie.
- **Fazki i zaokrąglenia jako `Chamfer` / `Fillet` na krawędziach**, nie jako dodatkowe cięcia.
- **Ograniczaj liczbę szkiców.** Z jednego szkicu można wyciągać różne obszary w kilku operacjach. Przed założeniem nowego szkicu sprawdź, czy profil da się dodać do istniejącego szkicu na tej płaszczyźnie albo do szkicu layoutu. Nowy szkic tylko na nowej płaszczyźnie albo dla profilu, którego nie da się dodać do istniejącego. W planie drzewa każdy szkic ma podane, do czego służy i które operacje z niego korzystają.
- **`Hole` do otworów** pod śruby i wkładki, nie okrąg plus wyciągnięcie; `Hole` ma pierwszeństwo przed grupowaniem profili.
- **Budżet: ≤ 15 operacji bryłowych na część** (szkiców nie liczymy, pilnuje ich K6). Przekroczenie wymaga uzasadnienia w planie drzewa i zgody orkiestratora.

**Dowód zamiast deklaracji.** Zdanie wykonawcy „sprawdziłem” nie jest dowodem. Dowodem jest wynik odczytu zapisany przez kod i powtórzony przez orkiestratora. Bez dowodu część nie jest przyjęta.

**Praca etapami: jedna bryła na raz.** Użytkownik obserwuje dokument w trakcie budowy. Skrypt w otwartej karcie buduje jedną bryłę (jeden folder) na uruchomienie, operacja po operacji. Po każdej operacji, zanim wyśle następną, sam ją sprawdza: stan operacji z odpowiedzi zapisu = `OK`, a dla szkicu dodatkowo znacznik w drzewie (niżej). Pierwszy błąd = stop skryptu; poprawiasz tę operację, nie budujesz dalej. Skrypt nie czyta drzewa (`GET /features`) po każdej operacji: stan bierze z odpowiedzi zapisu. Po każdej bryle: folder w interfejsie, zrzut ekranu, wpis w pliku stanu, dopiero potem następna bryła. Nie wysyłaj kilku brył jednym uruchomieniem. Jeśli przez 5 minut nie ma widocznego postępu, zapisz w pliku stanu, co robisz i dlaczego.

**Kontrola szkicu na bieżąco.** Po każdym utworzeniu lub edycji szkicu jego stan odczytuje się w drzewie operacji, w otwartej karcie Onshape, bez wywołań API.

0. **Encje pomocnicze (construction) nie liczą się do znacznika:** szkic z samymi encjami pomocniczymi nie pokazuje ikony, choć jest niedookreślony. Szkice kontrolowane znacznikiem (layout) mają encje zwykłe; encje pomocnicze w szkicach części zawsze wymiarujemy. `document.visibilityState` w panelu przeglądarki aplikacji bywa „hidden” przy widocznym panelu – nie świadczy o widoczności.
0. **Test znacznika przed budową.** Na jednym szkicu zapisanym przez API wykonawca sprawdza, że znacznik pojawia się przy szkicu niedookreślonym i znika po dodaniu wymiaru, i mierzy czas odświeżenia drzewa po zapisie. Wynik i czas zapisuje w pliku stanu. Bez tego testu nie wolno opierać się na znaczniku.
1. **Sprawdzenie w skrypcie.** Funkcja, która tworzy albo edytuje szkic, zaraz po zapisie odpytuje drzewo, aż pojawi się wiersz tego szkicu w aktualnym stanie (limit czasu z testu w punkcie 0; to nie jest pauza z zasady 7 API). Wiersz dopasowuje po identyfikatorze (`data-id`), nie po nazwie. Szkic niedookreślony, brak wiersza albo przekroczony limit czasu = wyjątek i stop budowy. Nie ma ścieżki do kolejnej operacji, która omija ten krok.
2. **Ślad w pliku.** Każde sprawdzenie, także z wynikiem pozytywnym, zapisuje się w `40-cad/onshape/stan-api.json`: nazwa szkicu, `featureId`, `data-id`, dosłowna podpowiedź z drzewa, czas i `sourceMicroversion`. Szkic bez wpisu albo z wpisem „not fully defined” = część nieprzyjęta.
3. **Niezależne sprawdzenie orkiestratora.** Przed przyjęciem części orkiestrator sam odczytuje znaczniki na całym drzewie (K2) i sam liczy z JSON drzewa K3 i K4. Porównuje wynik z plikiem stanu. Rozbieżność = zwrot do wykonawcy.

**Jak odczytać znacznik.** Wiersz szkicu w drzewie to `.os-list-item-label`. Szkic niedookreślony ma w nim ikonę `svg-icon-list-underdefined-overlay` (niebieskie kółko z minusem) i podpowiedź kończącą się na „is not fully defined”. Odczyt w konsoli strony, wszystkie szkice z wynikiem:

```js
[...document.querySelectorAll('.os-list-item-label')]
  .filter(r => r.querySelector('use[*|href*="sketch-button"]'))
  .map(r => ({ id: r.dataset.id, tytul: r.getAttribute('data-bs-original-title'),
               niedookreslony: !!r.querySelector('use[*|href*="underdefined"]') }))
```

**Runda weryfikacji modelu** przed zgłoszeniem „gotowe do review”. Wynik to plik `40-cad/onshape/weryfikacja-<wersja>.md` z wynikiem każdego punktu i surowymi danymi, z których go policzono. Orkiestrator powtarza K1–K8 na własnym odczycie i porównuje z raportem. Dane: odczyt drzewa i zmiennych Variable Studio przez API (w budżecie) oraz odczyt drzewa w karcie.

| # | Kryterium | Jak sprawdzić |
|---|---|---|
| K1 | Każdy `featureStatus` = `OK`; każda operacja ma stan | `featureStates` z `GET /features` **bez** `includeGeometryIds=false` (ten parametr zeruje `featureStates`); puste stany = K1 niezaliczony |
| K2 | Żaden szkic nie jest niedookreślony; liczba wierszy szkiców w drzewie = liczba szkiców w JSON | znacznik w drzewie, całe drzewo (przewinąć, rozwinąć foldery) |
| K3 | Po usunięciu nazw `#zmiennych` z każdego wyrażenia w operacjach i wymiarach szkiców zostają tylko stałe z listy dozwolonych (`#a + 4.7 mm` nie przechodzi) | JSON drzewa i Variable Studio; każdy wyjątek zatwierdzony w planie |
| K4 | Zero więzów `Fix`; każda encja szkicu związana wymiarem `#zmienna` albo więzem z layoutem | `constraints` w JSON szkiców |
| K5 | Każda para i powtórzenie z planu to `Mirror` albo szyk; część z parami i bez nich jest odrzucona | JSON drzewa wobec planu |
| K6 | Operacje bryłowe na część wobec budżetu; wypisane szkice użyte przez jedną operację, każdy z uzasadnieniem w planie, inaczej zwrot | JSON drzewa wobec planu |
| K7 | Zmienne i layout stoją przed operacjami, które ich używają | kolejność w JSON drzewa |
| K8 | Szkice leżą na płaszczyznach, szkicach albo wczesnych operacjach, nie na ścianach z późnych operacji | `sketchPlane` w JSON; każdy wyjątek zatwierdzony w planie |
| K9 | Test zginania: plan podaje dla 3–5 kluczowych zmiennych wartości min i max i oczekiwany efekt (który wymiar, o ile). Wykonawca zmienia każdą zmienną, sprawdza `featureStates` = `OK` i **mierzy wymiary brył** (szkic bez rozwiązania zostaje w starej geometrii przy `featureStatus` OK – sam stan niczego nie dowodzi) i porównuje z oczekiwanym, potem przywraca wartości | Variable Studio, `featureStates`, `boundingboxes` przez API, w budżecie; bez endpointu FeatureScript |
| K10 | Nazwy operacji i zmiennych mówią, co robią | użytkownik |
| K11 | Operacje każdej bryły leżą w jej folderze | drzewo w karcie |

## Praca z API Onshape (plan Free)

**Dostęp.** Tylko sesja przeglądarki (cookie + `X-XSRF-TOKEN`), zwykły `fetch` z kontekstu strony `cad.onshape.com`. Bez kluczy API i bez OAuth.

**Limity.**

- Każda odpowiedź niesie nagłówek `X-Rate-Limit-Remaining`: stan licznika danego endpointu po tym wywołaniu. `/features` ma najniższy licznik.
- 429 oznacza blokadę endpointu na wiele godzin (`Retry-After` 7–20 h). 402 oznacza wyczerpanie puli rocznej planu Free.
- Nie wiadomo, czy `/features/featureid/{fid}` i `/features` w Assembly dzielą licznik z `/features` Part Studio: wykonawca odczytuje licznik przy pierwszym wywołaniu każdego z nich i zapisuje wynik w pliku stanu.

**Twarde zasady dla wykonawcy.**

1. **Jedna bramka na wszystkie żądania.** Każde wywołanie przechodzi przez jedną funkcję `req()`. Pierwsze wywołanie każdego endpointu w sesji to odczyt startowy, który ustala licznik. Dalej bramka przed wysłaniem sprawdza ostatni odczyt licznika dla tego endpointu; przy `remaining ≤ 20` albo braku nagłówka w poprzedniej odpowiedzi rzuca wyjątek i nie wysyła. Test przed budową: próg ustawiony na bieżący `remaining` musi rzucić wyjątek.
2. **Jedno żądanie naraz**, bez równoległości.
3. **429, 402 albo wyjątek bramki = stop całej pracy** i raport do orkiestratora. Bez ponawiania i bez czekania w skrypcie.
4. **Zakaz endpointu `/featurescript`.** FeatureScript wolno tylko jako operację w drzewie, gdy natywne operacje nie wystarczają.
5. **Budżet w żądaniach HTTP, nie w operacjach.** Plan wersji podaje budżet wywołań; jego wyczerpanie = stop i raport. Przed każdą sekcją lista wywołań porównana z `remaining − 20`. Szkic to jeden POST: nie tworzyć pustego szkicu po to, żeby odczytać macierz płaszczyzny; transformację liczyć lokalnie. W budżecie także odczyty kontrolne, test zginania i usuwanie błędnych operacji.
6. **Nie wysyłać ponownie operacji, które się nie zmieniły.** Poprawka to edycja jednej operacji (`.../features/featureid/{fid}`), nie ponowne uruchomienie sekcji.
7. **Bez pauz na wyczucie** (`sleep`); tempo wyznacza licznik.
8. **Stan w pliku w repo, nie w `localStorage`:** `40-cad/onshape/stan-api.json` po każdej sekcji: log wywołań, odczyty liczników, mapa `nazwa operacji → featureId`, wyniki kontroli szkiców i suma wywołań w roku. Orkiestrator podaje tę sumę użytkownikowi przy każdym review.
9. **Plan drzewa każdej części** (lista operacji: typ, nazwa, użyte zmienne, szkice i ich użycie, Mirror i szyki) zatwierdza orkiestrator przed pierwszym zapisem tej części.

**Oszczędne wzorce wywołań.**

- **Drzewo pobieraj na początku sesji i przy odbiorze części**, mapę `nazwa operacji → featureId` trzymaj w pliku stanu. Własne zapisy też zmieniają `sourceMicroversion`: aktualizuj ją z odpowiedzi zapisu. Inna rozbieżność oznacza cudzą edycję: stop i pytanie do orkiestratora.
- **Obcinaj payload:** `?noSketchGeometry=true&includeGeometryIds=false`, chyba że potrzebne są encje szkiców (K4, K6).
- **Zmiana pojedynczej operacji:** `POST /api/v12/partstudios/d/{did}/w/{wid}/e/{eid}/features/featureid/{fid}`. W ciele musi być `featureId` identyczny z tym w URL oraz `featureType` i `name`; bez tych dwóch nazwa i typ staną się pustym łańcuchem.
- **Przy każdym zapisie** wysyłaj `sourceMicroversion` i `rejectMicroversionSkew`.
- **Nie powtarzaj odczytów tych samych danych**; trzymaj je w cache, używaj odczytów zbiorczych tam, gdzie endpoint je obsługuje. Zmienne wysyłaj raz, nie przyrostowo po jednej.

## Eksport i kontrola po eksporcie

- **Eksport** robi wykonawca w ramach zlecenia, przez API, do `40-cad/3mf/<wersja>/`, jeden plik na część, nazwa pliku = nazwa części: 3MF, kąt 3°, odchyłka 0,01 mm (jeśli API nie daje 3MF, STL binarny z tymi samymi tolerancjami). Części mają nazwy jak ich foldery, zanim powstanie eksport.
- **Po każdym eksporcie** wykonawca uruchamia `40-cad/narzedzia/sprawdz_siatki.js`: szczelność, orientacja trójkątów, **liczba brył w modelu = w 3MF**, 0 błędów. Przy błędach `napraw_siatki.js` i ponowne sprawdzenie. Do tego symulacja wsuwania wszystkich wkładanych części (tulejki, śruby, trzpienie) także względem sąsiednich części.
