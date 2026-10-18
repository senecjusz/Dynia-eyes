# AGENTS.md

Instrukcje dla agentów AI pracujących w tym repozytorium (Claude, Codex i inne).

## Komunikacja

- **Zawsze po polsku**: odpowiedzi, dokumenty, opisy commitów, komentarze w plikach `.md`.
- Krótko i konkretnie. Bez zbędnego kontekstu i powtarzania tego, co jest w repo.

## Projekt

- Projekt hobbystyczny: dynia na Halloween z ruchomymi oczami, robiona z synem użytkownika.
- Dwa komputery: Windows (Kobyłka, weekendy) i Linux Omarchy (Warszawa). Wszystko, co ma działać na obu, musi być przenośne (skrypty bash/Python zamiast PowerShella, ścieżki względne).
- Dostęp do GitHuba wyłącznie przez deploy key tego repo (`core.sshCommand` w lokalnym configu). Nie używać innych poświadczeń.

## Preferencje użytkownika

Pamięć agenta jest lokalna na każdym komputerze, więc najważniejsze preferencje są zapisane tutaj:
- Doświadczony konstruktor i drukarz 3D. Nie tłumacz podstaw, podawaj liczby.
- **Krótko, bez zbędnych informacji.** Brief dla agenta zawiera tylko to, co dotyczy zadania.
- **Najpierw rozmowa, potem zapis:** decyzje zapisuj do repo dopiero po zgodzie, a agentów i review uruchamiaj dopiero na gotową pracę.
- Model w CAD ma być czytelny i poprawialny: osobne części, nazwane operacje, parametry.
- Dostęp do GitHuba tylko przez deploy key tego repo (osobny klucz na każdy komputer).
- Często pracuje zdalnie, z telefonu (Remote Control). Wtedy wysyłaj zrzuty i pisz krótkie raporty.

## Najpierw przeczytaj

- `30-projekt/stan-projektu.md`: aktualny stan, aktywne sesje, następne kroki.

- `README.md` i README w folderach: układ repo i co gdzie trafia.
- `30-projekt/decyzje.md`: co już ustalono. Nie zmieniaj tego bez zgody użytkownika.

## Zasady pracy

- **Najpierw rozmowa, potem zapis:** przy decyzjach projektowych proponuj w rozmowie, a do repo zapisuj dopiero to, na co użytkownik się zgodził.
- **Commituj tylko własne pliki** (`git add` po nazwach, nigdy `git commit -a`). W repo pracuje równolegle kilka sesji.
- Na początku `git pull`, na końcu commit + `git push`.
- Recenzent (review) pracuje tylko do odczytu i niczego nie zmienia w repo.
- W razie niepewności: pytaj, zamiast zgadywać.

## Podział ról

- **Orkiestrator (jeden):** rozmawia z użytkownikiem, zleca pracę wykonawcom, uruchamia review, łączy wyniki i przekazuje wykonawcy uwagi zatwierdzone przez użytkownika. Pilnuje dokumentacji: decyzje, dziennik, plan. Sam nie projektuje w CAD.
- **Wykonawcy:** jeden na zadanie (np. moduł oka w Onshape). Pracują według briefu, przed budową pokazują plan, po zakończeniu się zatrzymują i zgłaszają gotowość do review. Nie uruchamiają review sami i nie zaczynają kolejnej wersji bez zlecenia.
- **Recenzenci:** dwóch niezależnych, z **różnych rodzin modeli**: **Opus** (Anthropic) i **Codex / „Astra”** (OpenAI). Pracują tylko do odczytu, każdy osobno, na tym samym briefie review.

## Gdzie jest prawda o modelu

- **SolidCraft** (`40-cad/solidcraft/*.solidcraft`, od v2.3) to źródło prawdy o geometrii. Onshape (dokument SimpleEye, wersje do v2.2) jest w zapasie.
- W repo są tylko eksporty (`40-cad/stl`, `40-cad/3mf`, `40-cad/step`), skrypty budujące i opisy (`40-cad/README.md`, `30-projekt/plan-*.md`).

## Proces wersji

1. Projekt (wykonawca), potem zgłoszenie „gotowe do review”.
2. Review dwoma recenzentami (zleca orkiestrator).
3. Orkiestrator łączy wyniki, a użytkownik decyduje, co poprawić teraz, a co w następnej wersji.
4. Poprawki (wykonawca).
5. Wydruk testowy (użytkownik).
6. Uwagi z wydruku → **zawsze wpis w `70-budowa/dziennik.md`** i wnioski do następnej wersji.

Każdy etap kończy się zapisem w repo (dziennik, decyzje albo plan).

## Zasady dla recenzenta

- **Review zawsze pełne**, całej wersji, a nie tylko zmian. Review jest tanie w porównaniu z błędnym wydrukiem.
- Wagi uwag: **KRYTYCZNE** (nie zadziała albo test nic nie wykaże), **WAŻNE**, **DROBNE**.
- **Liczby zamiast opinii:** wymiary, luzy, kąty, policzone albo zmierzone na siatkach.
- Dla każdej uwagi podaj: miejsce, scenariusz porażki, poprawkę albo test i pewność.
- Na końcu **werdykt jednym zdaniem:** czy wersja nadaje się do wydruku testowego.
- Lista kontrolna: `30-projekt/review-cad.md`.

## Projektowanie: luzy montażowe (obowiązkowe)

Każda para części, które wchodzą jedna w drugą, ślizgają się, obracają albo są skręcane, **musi mieć luz policzony i zapisany już przy projektowaniu**, a nie odkryty dopiero w review albo na wydruku.

- **Wykonawca** dla każdej pary podaje w planie: rodzaj pasowania, luz nominalny i luz na siatce po eksporcie. Luz trzyma jako **zmienną** w Variable Studio. Przy ruchu i wsuwaniu sprawdza go symulacją na całej drodze, łącznie z łbami śrub, kablem i realnym SG90.
- **Recenzent** sprawdza tabelę luzów i zgłasza każdą parę bez luzu albo z luzem poniżej wartości z tabeli.
- Wartości startowe dla **PLA na Bambu A1 mini / X1C** (na stronę, czyli promieniowo). Korygować po próbkach i zapisywać korekty w tej tabeli:

| Pasowanie | Luz | Źródło |
|---|---|---|
| Ślizgowe: wsuwanie (kaseta w gniazdo, sanki, prowadnice) | **0,25–0,3 mm** + fazki wejściowe | review v2.2 (0,06 mm = zacięcie) |
| Obrotowe na śrubie lub tulejce (przeguby, oś) | 0,2 mm, luz osiowy 0,2–0,3 mm | v2.x |
| Ruchome części obok siebie (cięgno, ramię, jarzmo) | ≥ 0,5 mm w całym zakresie ruchu, ≥ 0,2 mm po uwzględnieniu luzów przegubów | review v1.1, v2.2 |
| Gwint drukowany ISO 60° (M63×3, zazębienie ~1,2–1,3 mm) | **0,45 mm** (domyślnie; 0,3 i 0,6 jako próbki) | review v2.4: 0,3 przy 60° ≈ ciasny jak v1.1; 45°/0,3 (v2.2) było OK; 0,5 przy 45° za luźno |
| Wcisk (np. tulejka w otwór) | 0 do −0,05 mm | do próby |
| Szczelina na klej wypełniający | 0,5 mm | v2.1b |
| Otwory M3 | ciasny Ø2,6, luźny Ø3,3; wkładka: głębokość = długość wkładki + ≥ 0,6 mm dna | v2.x, review v2.1d |

- **Najpierw próbka:** nowe pasowanie (gwint, zatrzask, prowadnica) najpierw drukujemy jako krótką próbkę (~20–30 min), a dopiero potem całą część.
- **Eksport do pomiaru luzów:** 3MF z dokładną siatką (Custom, kąt 3°, odchyłka 0,01 mm). Zgrubna siatka zjada luzy.

## Organizacja

- Układ folderów i ich przeznaczenie: `README.md` oraz `README.md` w każdym folderze – trzymać się ich.
- **`00-inbox/`**: na początku sesji sprawdzić, czy coś jest. Jeśli tak – przejrzeć i rozłożyć (inspiracje → `10-inspiracje/` z notatką `.md`, analizy → `20-analizy/` itd.), potem poinformować użytkownika, co gdzie trafiło.
- Każda istotna decyzja → wiersz w `30-projekt/decyzje.md`.
- Postęp prac z synem → wpis w `70-budowa/dziennik.md`.
- **Modele 3D powstają w SolidCraft** (od 18.10, `C:\Program Files\SolidCraft`, praca agenta przez `solidcraft-cli`; skrypty i plik `.solidcraft` w `40-cad/solidcraft/`). Onshape (dokument SimpleEye) jest w zapasie. Eksporty w `40-cad/3mf/`, opis w `40-cad/README.md`.

## Zasady projektowe

- **Preferujemy części drukowane w 3D** zamiast rzemiosła (drut, kołki, gwoździe, klej). Rozwiązania „craftowe” z researchu traktujemy jako ostateczność.
- **Łączenia i osie: zwykłe śruby M3 / M4 / M5 z nakrętkami** (komplet 8–50 mm, można zakładać dowolną potrzebną; przy częstym montażu wkładka gwintowana do wtapiania albo nakrętka w kieszeni zamiast gwintu w plastiku), a nie drukowane czopy ani klej. Otwory: ciasny w części nieruchomej, luźny w ruchomej. Szczegóły w `20-analizy/2026-10-17-mocowanie-pileczki-sruby.md`.
- **Projektuj pod druk 3D od początku (DFAM):** każda część ma co najmniej jedną płaską stronę na stół, a żaden element (oczko, kołek, korba) nie wystaje poza tę płaszczyznę. Przykład: jarzmo ma tę samą szerokość co oczka i leży płasko jedną stroną. Bez wiszących płyt, nawisy ≤ 45° albo fazki. Podpory tylko w ostateczności i zawsze opisane w README.
- Zanim zaczniesz projektować mechanizm w CAD, sprawdź, czy są analizy połączeń i mocowań. Jeśli ich brakuje, najpierw je ustal z użytkownikiem.
- Użytkownik ma dobrze wyposażony warsztat Arduino/ESP32 z wieloma modułami – przed proponowaniem zakupów pytać, czy coś już jest.
- Drukarki: Bambu Lab A1 mini (180 mm, w Kobyłce – weekendy) i X1 Carbon (256 mm, w Warszawie – dostępna cały tydzień). Części większe niż 180 mm projektować pod X1C.
- Kontroler: **ESP32** (od 18.10), z kalibracją serw przez stronę w telefonie; Nano jako zapas.

## Struktura projektu w Onshape (wymaganie użytkownika)

- **Każda część to osobny Part** z czytelną nazwą (Gniazdo, Nakrętka, Tuleja modułu, Jarzmo, Cięgno, Klucz…). Części łączymy w **Assembly** z mate'ami, żeby sprawdzić ruch i kolizje.
- **Drzewo operacji ma być czytelne:** natywne operacje Onshape (szkice, Extrude, Revolve, Hole…) z nazwami mówiącymi, co robią, pogrupowane w **foldery według części**. Nie jedna wielka operacja FeatureScript, która generuje wszystko, bo takiego modelu nie da się przeanalizować ani poprawić ręcznie.
- **Parametry w Variable Studio** (luzy, średnice otworów pod śruby i wkładki, średnica piłeczki), do których odwołują się szkice i operacje.
- FeatureScript tylko tam, gdzie natywne narzędzia nie wystarczają (np. gwint drukowany), jako mała, pojedyncza operacja.

## Praca w SolidCraft (główne CAD od 18.10)

- Wersja 0.15.0 jest na Windows (Kobyłka, `C:\Program Files\SolidCraft`) i jako Linux AppImage (Warszawa). Model źródłowy to `40-cad/solidcraft/*.solidcraft`.
- Agent pracuje na żywo w aplikacji: `solidcraft.exe --control 7878` i `solidcraft-cli mcp --connect 127.0.0.1:7878`. Bez GUI zostaje `solidcraft-cli run/eval/snapshot/exec`.
- **Znane problemy:**
  - **Własna helisa (gwint) zawiesza program**, więc używamy natywnego Thread (ISO).
  - **Eksport 3MF potrafi dać nieszczelne siatki**: otwarte krawędzie, krawędzie z więcej niż 2 trójkątami.
  - **Cięcia stykające się dokładnie na ścianie zostawiają błony.** Cięcie zaczynać z zakładką 0,1 mm.
- **Po każdym eksporcie obowiązkowo:** automatyczne sprawdzenie siatek (szczelność, orientacja trójkątów, **liczba brył w modelu = w 3MF** – v2.4 zgubił bryłę) i symulacja wsuwania wszystkich wkładanych części (tulejki, śruby, trzpienie) **także względem sąsiednich części**, nie tylko obudowy.
- Parametry muszą być podpięte do operacji, a nie wpisane liczbą obok.

## Praca z API Onshape (plan Free)

- Tylko sesja przeglądarki (cookie + X-XSRF-TOKEN). **Bez kluczy API ani OAuth**, bo te zużywają roczny limit 2 500 wywołań.
- Drobne zmiany zamiast przebudowy całości, najwyżej jedna sekcja naraz. `GET /features` raz, trzymać w pamięci.
- **Drzewo operacji (`GET …/features`) pobierać raz na sesję**, odświeżać tylko po błędzie. 18.10 zbyt częste pobieranie drzewa (~270 operacji) skończyło się blokadą 429 z `Retry-After` ~7 h.
- Przerwa 300–500 ms po każdym zapytaniu. Przy 429: odczekać `Retry-After`, ponowić najwyżej 3 razy. Przy 402: stop i informacja dla użytkownika.
- Eksporty (3MF, STL, STEP) robi użytkownik ręcznie: 3MF, rozdzielczość Custom, kąt 3°, odchyłka 0,01 mm.
- Po każdej sekcji zapis postępu (log, mapa nazwa operacji → featureId).
