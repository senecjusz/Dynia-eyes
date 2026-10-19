# Recenzja AGENTS.md: czy realizuje intencje użytkownika

Przeczytałem cały materiał z briefu. Niczego nie zmieniałem.

## 1. Intencje użytkownika

| # | Intencja (miejsce w rozmowie) | Stan | Dowód w pliku |
|---|---|---|---|
| 1 | Agent trzyma plan i tu‑i‑teraz, nie wymyśla tematów (22:55) | tak, zapisane (działanie: p. 3) | „Jeden cel naraz, zapisany w `30-projekt/teraz.md`”, „Tematy poboczne na parking” |
| 2 | Epiki → zadania, narysowane, widoczne dla niego i dla modelu (23:10) | częściowo | `teraz.md` obejmuje tylko małe oko v2.5; cel całości jest jedną linijką w „Epiki później”, poza diagramem |
| 3 | Diagram jako plik HTML (07:14) | tak | `teraz.html`, „agent uruchamia `python3 30-projekt/teraz_html.py`” |
| 4 | Parafraza każdego polecenia, żeby było „common understanding” (23:14) | tak, z dodanym wyjątkiem | „Wyjątek: polecenie jednoznaczne i drobne” |
| 5 | Dopiski 1–7 i wariant (a) (23:21) | tak | w „Sposób współpracy” i w „Twarde zasady” |
| 6 | Commit dopiero po ustaleniu metody; użytkownik ma wątpliwości do metody (07:37) | częściowo | nic nie jest zacommitowane, ale wątpliwości nie zebrano, a `teraz.md` ma „[x] E1.1” bez akceptacji |
| 7 | Metodyka parametryczna z internetu, runda weryfikacji, lustro i obrót (07:35) | tak | „Kolejność budowy części”, K1–K10 |
| 8 | Stan szkicu z interfejsu (07:48), sprawdzany po każdej zmianie szkicu (07:58) | tak | „Po każdym utworzeniu lub edycji szkicu jego stan odczytuje się w drzewie” |
| 9 | Wszystko w `AGENTS.md`, nie w osobnym pliku (08:01) | tak, z luką | `AGENTS.md` każe „trzymać się” README w folderach, a `40-cad/README.md` dalej mówi „źródłem prawdy jest model SolidCraft” |
| 10 | Agent musi udowodnić poprawność szkicu (08:02) | częściowo | „Dowód zamiast deklaracji” jest, ale furtka FIX i ślad pisany przez agenta (p. 4) |
| 11 | W `AGENTS.md` same instrukcje, bez logu (08:04) | częściowo | zostały uzasadnienia (p. 5) |
| 12 | „agents md dalej mówi o solidcraft” (wiadomość boczna) | częściowo | sekcję usunięto, ale „Gwint drukowany ISO 60°” to pozostałość po SolidCrafcie (tam natywny Thread ISO był obejściem błędu) |
| 13 | Pasowanie nie zależy od materiału; profil gwintu wybrać na pierścieniach testowych jako etap planu (08:13) | częściowo | nagłówek „niezależnie od materiału” i zadanie E2.0 są, ale wiersz dalej narzuca „ISO 60° … **0,45 mm** (domyślnie)” |
| 14 | Ograniczać liczbę szkiców (08:08) | tak | „Ograniczaj liczbę szkiców”, K6 |
| 15 | Review z pełnym kontekstem (08:39) | przeinaczone | reguła „Brief … = dokładnie bieżące zadanie” zabrania tego, o co prosił |

## 2. Co orkiestrator dodał od siebie

- **Wyjątek „jednoznaczne i drobne”** przy parafrazie i **„Inne drobiazgi … rób bez pytania”**. Orkiestrator zgłosił wyjątek, użytkownik nie odpowiedział. To jest szkodliwe: to ta sama furtka, przez którą przeszedł błędny commit z poprzedniej sesji.
- **Wiersz w `decyzje.md` i Onshape jako źródło prawdy.** Orkiestrator oznaczył to jako „poza zleceniem”, odpowiedzi nie było. Zgadza się z kierunkiem, ale nie jest zatwierdzone.
- **K1–K10 w całości.** Na pytanie, które kryteria mają wejść (07:46), użytkownik nie odpowiedział.
- **Plan drzewa zatwierdza orkiestrator** (zasada 9). Użytkownik sam mówi, że orkiestrator słabo recenzuje własne pomysły, a konstruktor chce widzieć właśnie plan drzewa.
- **Budżet „≤ 15 operacji”** pochodzi z commita, którego użytkownikowi nie pokazano. Definicja nadal czeka w parkingu.
- **E1.1 oznaczone jako zrobione** bez akceptacji użytkownika.

## 3. Czy zasady działają w praktyce

- **Brak zakresu ról (KRYTYCZNE).** „Sposób współpracy” jest napisany dla orkiestratora, a `AGENTS.md` czyta każdy agent. Wykonawca dostanie brief, zrobi parafrazę i będzie czekał na potwierdzenie, którego nikt nie da. Recenzent przytnie raport do ~10 linii.
- **Sprzeczności:**
  - „Na początku `git pull`, na końcu commit + `git push`” kontra „commitem dopiero po «ok»”.
  - Reguła `00-inbox/` („na początku sesji … rozłożyć”) wymusza temat poboczny i zapis bez pokazania na starcie każdej sesji.
  - „Najpierw przeczytaj” nie wymienia `teraz.md`, a o `stan-projektu.md` mówi „następne kroki”.
- **Stare ogólniki zostały obok nowych:** „Krótko” dwa razy, „Najpierw rozmowa, potem zapis” dwa razy, „pytaj, zamiast zgadywać”, deploy key dwa razy. To dokładnie te zasady, które już raz nie zadziałały.
- **Zasad nie da się sprawdzić:**
  - „Domyślnie do ~10 linii”: słowa „domyślnie” i „~” to furtka.
  - „Przeprosiny … się nie liczą” nie jest instrukcją.
  - „Niejednoznaczne słowo”: agent nie wie, że słowo jest niejednoznaczne. Ten problem rozwiązuje dopiero parafraza.
- **Autor sam nie trzyma tych zasad.** Odpowiedzi z 07:46, 07:59 i 08:05 mają kilkanaście do dwudziestu linii, a bieżące zadanie podaje tylko jedna (08:14). W praktyce sprawdzalne są cztery zasady: parafraza, `teraz.md`, jedno pytanie i diff przed commitem.

## 4. Wykonawca CAD

API i odczyt DOM dają się wykonać, ale są luki:

- **Więz `FIX` (KRYTYCZNE).** Szkic na współrzędnych, jak w v2.2, z FIX na każdej encji przestaje być oznaczany jako niedookreślony. K3 tego nie złapie, bo nie ma wyrażeń, a w K4 wystarcza jeden wymiar.
- **Znacznik sprawdzono tylko na modelu zrobionym ręcznie (KRYTYCZNE).** Nikt nie sprawdził, czy po zapisie przez REST drzewo w otwartej karcie się odświeża i ile to trwa. Warstwa 1 musi czekać na wiersz szkicu, a reguła 7 zakazuje `sleep`. Skutek: fałszywe zatrzymania albo łamanie reguły.
- **K3 przepuszcza ukryte liczby (WAŻNE).** Warunek „zawiera `#`” przepuszcza `#a + 4.7 mm`; skrypt v2.2 ma dokładnie `#dociskMax + #nakretkaH + 4.7 mm`.
- **Brak wzorca więzu do layoutu przez API (WAŻNE).** E2.2 łata wydajność skryptu v2.2, ale klasa `Sk` w tym skrypcie emituje współrzędne i więzy coincident. Potrzebny jest nowy generator szkiców, nie łatki.
- **Bramka `req()` (WAŻNE).** Przy „braku odczytu” blokuje pierwsze wywołanie każdego endpointu. Nie ma też instrukcji, co robić po wyjątku bramki.
- **Pula roczna (WAŻNE).** Plik tylko loguje sumę wywołań, a research podaje 2500 wywołań na rok. Bez progu i budżetu na wersję wraca zarzut Fable, że licznik jest „tylko logowany”.
- **K9 (WAŻNE).** Nie wiadomo, kto robi test (zapis „w interfejsie”), a „zgodnie z planem” nie ma oczekiwanego efektu zapisanego w planie. Test da się zrobić bez `/featurescript`: zmienne, `featureStates` i `boundingboxes`.
- **K2 na długim drzewie (WAŻNE).** Odczyt nie jest sprawdzony, a lista w drzewie może być wirtualizowana.
- **Drobne:**
  - Podpowiedź przy wierszu ma dopisek „(Hidden)”, więc dopasowanie po samej nazwie nie zadziała.
  - Atrybut `data-bs-original-title` może się pojawić dopiero po najechaniu na wiersz.
  - Nie wiadomo, czy `noSketchGeometry=true` zostawia `entities` potrzebne do K6.
  - Skrypt w konsoli nie zapisze pliku w repo, więc warstwę 2 pisze agent. Faktycznym dowodem jest tylko warstwa 3.

## 5. Co nie jest instrukcją albo jest nieaktualne

- **Zdania‑uzasadnienia:** „Pamięć agenta jest lokalna…, więc”, „Review jest tanie…”, „Zgrubna siatka zjada luzy”, „Zmniejsza odpowiedź o ponad połowę”, „przy działającej bramce 429 oznacza błąd w procedurze”.
- **Historia w tabeli luzów:** kolumna „Źródło” (np. „review v2.2 (0,06 mm = zacięcie)”) i cały wiersz gwintu.
- **Geometria v2.4 jako przykład:** „zaczepy 33°/213°, haczyki 47°/227°”.
- **Nieaktualne odwołania:**
  - `30-projekt/plan-*.md` obejmuje odrzucony `plan-powrot-do-onshape.md`.
  - `40-cad/README.md` mówi o SolidCrafcie i ma nagłówki z PLA.
- **Duplikaty i braki:** parametry eksportu 3MF są dwa razy. `decyzje.md` wymaga `napraw_siatki.js`, a `AGENTS.md` o nim nie wspomina.

## 6. Proponowane poprawki

1. **KRYTYCZNE.** Na początku „Sposób współpracy” dopisać: „Dotyczy agenta rozmawiającego z użytkownikiem. Wykonawca i recenzent: brief jest poleceniem, bez czekania na potwierdzenie, raport do pliku.”
2. **KRYTYCZNE.** W „Kontrola szkicu” dopisać: „Więz `FIX` zakazany.” K4 zmienić na: „zero FIX; każda encja związana wymiarem `#zmienna` albo więzem z layoutem”.
3. **KRYTYCZNE.** Pierwszy krok E2.2: „test na jednym szkicu przez REST: znacznik pojawia się po POST i znika po dodaniu wymiaru; zmierzony czas odświeżenia drzewa”. W warstwie 1: „czekaj na wiersz, odpytując DOM do N s (to nie jest pauza z reguły 7)”.
4. **WAŻNE.** W „Zasady pracy” zmienić na „commit i push po «ok»”. Usunąć duplikaty starych ogólników.
5. **WAŻNE.** Reguła `00-inbox/`: „na starcie tylko jedna linijka o zawartości; rozkładanie to zadanie w `teraz.md`”.
6. **WAŻNE.** „Najpierw przeczytaj”: `teraz.md` na pierwszym miejscu.
7. **WAŻNE.** K3: „po usunięciu `#nazw` w wyrażeniu zostają tylko stałe z listy dozwolonych”.
8. **WAŻNE.** Bramka: „pierwsze wywołanie endpointu w sesji dozwolone; wyjątek bramki = stop i raport jak przy 429”. Dodać próg puli rocznej i budżet na wersję.
9. **WAŻNE.** Budżet ≤ 15 zdefiniować przed E2.3 albo usunąć.
10. **WAŻNE.** K9: przypisać wykonawcę testu i wymagać w planie oczekiwanego efektu każdej zmiennej.
11. **WAŻNE.** K2: „liczba wierszy szkiców w DOM = liczba szkiców w JSON, inaczej błąd”.
12. **WAŻNE.** Reguła o briefie: „pytania = bieżące zadanie; materiał = tyle kontekstu, ile trzeba do oceny, łącznie z pełną rozmową”.
13. **WAŻNE.** Wiersz gwintu: „profil i luz według E2.0”, bez wartości domyślnej do tego czasu.
14. **WAŻNE.** Plan drzewa (zasada 9) pokazywać też użytkownikowi.
15. **DROBNE.**
    - Usunąć wyjątki o „drobiazgach” albo wymienić je z nazwy.
    - Wyciąć uzasadnienia z punktu 5.
    - Kolumnę „Źródło” zamienić na „Status”.
    - Scalić opis eksportu 3MF.
    - Odznaczyć E1.1 do czasu akceptacji.
    - Poprawić `40-cad/README.md`.

**Werdykt:** kierunek zgadza się z intencjami użytkownika: jeden plik agendy, parafraza, diff przed commitem i dowód zamiast deklaracji. Plik jednak jeszcze nie działa: nie mówi, kogo dotyczą zasady, ma sprzeczności ze starymi regułami i zostawia wykonawcy furtkę FIX i niesprawdzony znacznik szkicu. Po poprawkach 1–3 nadaje się do użytku.

