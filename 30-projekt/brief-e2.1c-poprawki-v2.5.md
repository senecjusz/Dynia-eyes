# Brief E2.1c: poprawki v2.5 po review

Wykonawca CAD. Obowiązuje `AGENTS.md`. Dokument „Oko F v2.5”, Part Studio „Oko F v2.5”. Review: `20-analizy/review/2026-10-19-v2.5-opus.md`, `20-analizy/review/2026-10-19-v2.5-codex.md`. Mierz czas każdej poprawki (start–koniec) i zapisz w stanie.

## Poprawki (tylko te trzy)

1. **Kaseta, zaczep 213°:** szyk `Kaseta: zaczep 213` nie wycina skośnej szczeliny (w bryle jej nie ma, choć status OK). Napraw tak, żeby kopia wycinała szczelinę. Test: zaczep 33° obrócony o 180° pokrywa się z zaczepem 213° (odchyłka < 0,03 mm na siatce).
2. **Jarzmo, piasta korby C:** wchodzi w szczelinę klejową (luz do piłeczki Ø40,5 = 0,007 mm). Obetnij jarzmo kulą o promieniu `kulaDmax/2 + klej` (jak w v2.4). Test: najmniejszy promień jarzma od środka oka ≥ 20,74 mm.
3. **Sanki, naroże przy tulejce H:** luz do kołnierza Ø8 tulejki H = 0,023 mm. Cofnij czoło sanek o 0,3 mm (do ok. z −44,9) albo zwiększ fazkę do ok. 2 mm; wybór uzasadnij. Test: luz ≥ 0,25 mm na całej drodze wsuwania tulejki od spodu.

Każda poprawka parametrycznie (zmienne, bez liczb w drzewie), kontrola operacji, szkicu i pomiar jak w E2.1. Bez innych zmian w modelu.

## Po poprawkach

- Commit stanu i krótki raport `40-cad/onshape/e2.1c-poprawki.md` (poprawka, operacje zmienione, test, wynik, czas).
- Wiadomość do orkiestratora z hashem. Eksport 3MF trzech części (Kaseta, Jarzmo z miską, Sanki serwa) robi użytkownik; po nim kontrola siatek i oba testy na siatkach.

Budżet: **≤ 40 wywołań łącznie, ≤ 2 odczyty `GET /features`**.
