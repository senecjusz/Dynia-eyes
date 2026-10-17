# Kontekst projektu dla Claude

- Projekt hobbystyczny: dynia na Halloween z ruchomymi oczami, robiona z synem użytkownika. Komunikacja po polsku.
- Dwa komputery: Windows (Kobyłka, weekendy) i Linux Omarchy (Warszawa). Wszystko, co ma działać na obu, musi być przenośne (skrypty bash/Python zamiast PowerShella, ścieżki względne).
- Na początku każdej sesji: `git pull`; na końcu: commit + `git push`.
- Dostęp do GitHuba wyłącznie przez deploy key tego repo (`core.sshCommand` w lokalnym configu). Nie używać innych poświadczeń.

## Organizacja

- Układ folderów i ich przeznaczenie: `README.md` oraz `README.md` w każdym folderze – trzymać się ich.
- **`00-inbox/`**: na początku sesji sprawdzić, czy coś jest. Jeśli tak – przejrzeć i rozłożyć (inspiracje → `10-inspiracje/` z notatką `.md`, analizy → `20-analizy/` itd.), potem poinformować użytkownika, co gdzie trafiło.
- Każda istotna decyzja → wiersz w `30-projekt/decyzje.md`.
- Postęp prac z synem → wpis w `70-budowa/dziennik.md`.
- Modele 3D powstają w Onshape (w przeglądarce). W repo eksporty w `40-cad/` i linki w `40-cad/README.md`.

## Zasady projektowe

- **Preferujemy części drukowane w 3D** zamiast rzemiosła (drut, kołki, gwoździe, klej). Rozwiązania „craftowe” z researchu traktujemy jako ostateczność.
- Użytkownik ma dobrze wyposażony warsztat Arduino/ESP32 z wieloma modułami – przed proponowaniem zakupów pytać, czy coś już jest.
