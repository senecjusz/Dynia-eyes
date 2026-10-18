# Kontekst projektu dla Claude

- Projekt hobbystyczny: dynia na Halloween z ruchomymi oczami, robiona z synem użytkownika. Komunikacja po polsku. Instrukcje wspólne dla wszystkich agentów (także Codex): `AGENTS.md`.
- Dwa komputery: Windows (Kobyłka, weekendy) i Linux Omarchy (Warszawa). Wszystko, co ma działać na obu, musi być przenośne (skrypty bash/Python zamiast PowerShella, ścieżki względne).
- Na początku każdej sesji: `git pull`; na końcu: commit + `git push`.
- Dostęp do GitHuba wyłącznie przez deploy key tego repo (`core.sshCommand` w lokalnym configu). Nie używać innych poświadczeń.

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

## Praca z API Onshape (plan Free)

- Tylko sesja przeglądarki (cookie + X-XSRF-TOKEN). **Bez kluczy API ani OAuth**, bo te zużywają roczny limit 2 500 wywołań.
- Drobne zmiany zamiast przebudowy całości, najwyżej jedna sekcja naraz. `GET /features` raz, trzymać w pamięci.
- Przerwa 300–500 ms po każdym zapytaniu. Przy 429: odczekać `Retry-After`, ponowić najwyżej 3 razy. Przy 402: stop i informacja dla użytkownika.
- Eksporty (3MF, STL, STEP) robi użytkownik ręcznie: 3MF, rozdzielczość Custom, kąt 3°, odchyłka 0,01 mm.
- Po każdej sekcji zapis postępu (log, mapa nazwa operacji → featureId).
