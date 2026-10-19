E1.2 — recenzja zgodności instrukcji z intencjami użytkownika. Przeczytałem wszystkie wskazane materiały. **Kierunek jest właściwy, ale instrukcja nie jest jeszcze gotowa dla wykonawcy:** zawiera blokadę startu API i pozwala uznać niepełną kontrolę za dowód poprawności.

W tabeli „R” oznacza pełną rozmowę; cytuję wypowiedzi użytkownika, nie raporty podagentów. „A” oznacza [obecny AGENTS.md](/home/rkp/Projects/010-Eye-pumpkin/Dynia-eyes/AGENTS.md).

| Intencja użytkownika | Ocena i realizacja |
|---|---|
| „trzymać się sensownego planu”, problemy „tu i teraz” — [R:4][r4] | **Częściowo.** A:13–16: „Jeden cel naraz”, parking, zakaz nowych propozycji po korekcie. Jednocześnie A:112 nakazuje porządkowanie inboxu niezależnie od zadania. |
| „epiki […] rozpisane na zadania i narysowane”; „flow chart musi byc plikiem html” — [R:212][r212], [R:345][r345] | **Częściowo.** [teraz.md:5](/home/rkp/Projects/010-Eye-pumpkin/Dynia-eyes/30-projekt/teraz.md:5): „Podgląd z diagramem: `teraz.html`”; są epiki i zadania. Diagram ma jednak błędną kolejność kontroli i eksportu. |
| „agent referuje je wałsnymi słowami” — [R:230][r230] | **Częściowo.** A:12: „Najpierw parafraza polecenia”. Obowiązkowe oczekiwanie i wyjątek dla drobiazgów dopowiedział orkiestrator. |
| „wpisz wszystkie 1–7 i wariant a” — [R:321][r321] | **Tak treściowo.** A:13–24 zawiera zaakceptowane zabezpieczenia współpracy; A:195–203 zabezpieczenia API. Wykonalność wymaga poprawek poniżej. |
| „z commitem chciałbym poczekać” — [R:380][r380] | **Częściowo.** A:22: „commitem dopiero po «ok»”, ale A:53 bezwarunkowo nakazuje końcowy commit i push. |
| „poszukać […] metodyki”, „runda weryfikacyjna”, lustra i parametry — [R:360][r360] | **Częściowo.** A:138–180 wprowadza kolejność budowy oraz K1–K10. Research powstał, lecz kryteria nie dowodzą jeszcze poprawnych zależności. |
| „sprawdzac po zmianach danego szkicu”; „jak agent udowadnia” — [R:489][r489], [R:536][r536] | **Częściowo.** A:156–158: kontrola w skrypcie, ślad, niezależny odczyt. Brakuje gwarancji aktualności i kompletności odczytu. |
| „wszytko powinno być w agents md”; „plik z unstrukcjami” — [R:519][r519], [R:566][r566] | **Częściowo.** Procedury scalono; A:21 zakazuje historii. Nadal są opisy stanu, uzasadnienia i uogólnione pomiary. |
| „ograniczac liczbą skeczy” — [R:614][r614] | **Tak.** A:148: „Przed założeniem nowego szkicu sprawdź…”; K6 wymaga uzasadnienia. Użytkownik zaakceptował propozycję w R:628. |
| „nie uzależniam pasowania od materiału”; „kilka pierścieni […] etap do dodania” — [R:627][r627] | **Tak.** A:94 mówi „niezależnie od materiału”; teraz.md:55 zawiera E2.0 z próbkami. |
| „całą kontekst […] nie tylko wycinek” i niezależni recenzenci — [R:660][r660] | **Częściowo.** A:61 zapewnia niezależność; A:23 ogranicza brief do zadania, ale nie odróżnia zakresu oceny od potrzebnego kontekstu. |

Dodatki orkiestratora wymagają rozróżnienia. Trzy warstwy dowodu, ograniczanie szkiców oraz pakiet 1–7 **zostały zaakceptowane**. Nie należy przedstawiać ich jako samowoli. Natomiast wyjątek od parafrazy autor jawnie dodał sam ([R:235][r235]); brak odpowiedzi nie dowodzi akceptacji. Wpis do `decyzje.md` sam nazwał działaniem „poza Twoim zleceniem” ([R:338][r338]). Kierunek Onshape odpowiadał zleceniu v2.5, ale tryb zapisu powtórzył problem współpracy.

Próg 20, wszystkie liczby jako zmienne i K10 wykonywane przez użytkownika są rozwiązaniami autorów instrukcji, nie dosłownymi wymaganiami użytkownika. Limit 15 operacji jest odziedziczony. Szkodliwe jest uznawanie jego przekroczenia za dowód złego modelowania, szczególnie gdy definicję liczenia odłożono na parking.

Technicznie REST i DOM mogą obsłużyć proponowaną kontrolę, lecz obecny tekst jej nie zapewnia. [Stary skrypt:85](/home/rkp/Projects/010-Eye-pumpkin/Dynia-eyes/40-cad/onshape/oko-f-v2.2-build.js:85) już potrafił nadawać średnicy `#zmienna`, pozostawiając środek okręgu we współrzędnych. Sam znak `#` nie wystarcza. Podobnie w pełni unieruchomiona geometria nie musi reagować właściwie na zmianę parametrów.

Proponowane poprawki, według ważności:

1. **KRYTYCZNE — A:191–195, start API.** Bramka zabrania pierwszego żądania, które miałoby dostarczyć licznik. Dopisać: „Plan inicjalizacji wskazuje pojedynczy odczyt startowy i sposób ustalenia licznika każdego używanego endpointu. Brak zatwierdzonej inicjalizacji blokuje zapisy”. Nie zakładać wspólnej puli na podstawie podobnych wartości.

2. **KRYTYCZNE — A:154–173, dowód DOM.** Obecny fragment zwraca tylko znalezione błędy; pusta lista może oznaczać niewczytane drzewo. Zastąpić warunek zaliczenia: „Dla każdego oczekiwanego `featureId` odczytaj jednoznacznie dopasowany wiersz po zakończeniu aktualizacji interfejsu. Zapisz również wynik pozytywny. Niepełne pokrycie, nieaktualny stan lub niejednoznaczność blokują odbiór”. Uwzględnić przewijanie i rozwijanie folderów.

3. **KRYTYCZNE — A:174–180, parametryczność.** Dopisać: „K3 sprawdza zależności, nie obecność znaku `#`; K4 sprawdza sposób ustalenia całej geometrii. `Fix` nie zastępuje zależności projektowych. K9 ma zadane wartości wejściowe, oczekiwane wymiary, tolerancje, pomiary i dowód przywrócenia”. Wyjątki wymagają zatwierdzenia, nie samego wypisania.

4. **WAŻNE — A:168,178,207–208, komplet danych.** „Dopuszczaj odczyt początkowy i odbiorczy aktualnej wersji, osobno wykonawcy i orkiestratora; ujmuj je w budżecie. Dane kontrolne muszą zawierać encje, więzy i zależności Variable Studio”. Jedno drzewo Part Studio nie dowodzi zawartości osobnego Variable Studio; ograniczenie geometrii wymaga sprawdzenia kompletności. K9 wymaga obsługi interfejsu albo udziału użytkownika, nie samego odczytu DOM. Określić też przekazanie wyników z przeglądarki do pliku przez narzędzie agenta.

5. **WAŻNE — A:14,22,44,53,112.** „Najpierw czytaj `teraz.md`. Parking przedstawiaj jako proponowany diff; zapisuj po zgodzie. Recenzenta nie obowiązują pull, porządkowanie inboxu, commit ani push. Porządki wykonuj tylko w zakresie zadania”. To usuwa konkretne sprzeczności.

6. **WAŻNE — teraz.md:29,60–62.** Zmienić kolejność na „budowa → eksport → kontrola siatek → review → zatwierdzone poprawki → ponowna kontrola”. Obecnie kontrola 3MF poprzedza jego eksport.

7. **WAŻNE — A:150 i teraz.md:77.** „Przed budową uzgodnij sposób liczenia operacji, w tym szkiców i elementów wspólnych; przekroczenie 15 wymaga uzasadnienia i zatwierdzenia”. Nie odkładać definicji obowiązującej bramki na parking.

8. **DROBNE — porządek instrukcji.** Usunąć wstęp o pamięci (A:34), przenieść stan „v2.5 powstaje” (A:65), pomiary „trzydzieści razy” i „ponad połowę” do analiz. Kolumnę źródeł luzów użytkownik zaakceptował przy czyszczeniu — jej obecność nie jest samowolą. Archiwalny SolidCraft i wspólne wartości PLA/PETG są zgodne z rozmową. A:23 uzupełnić: „Brief ogranicza zadanie, ale zawiera pełny kontekst potrzebny do jego oceny”.

Nic nie zmieniłem; nie uruchamiałem agentów ani procesów w tle.

**Werdykt: AGENTS.md sensownie odzwierciedla intencje użytkownika, ale przed przekazaniem wykonawcy wymaga usunięcia blokady startu API oraz uszczelnienia dowodów kontroli i parametryczności.**

[r4]: /tmp/claude-1000/-home-rkp-Projects-010-Eye-pumpkin/f867d36e-d547-4c58-a797-2266b3ecacce/scratchpad/sesja-f867d36e-tekst.md:4
[r212]: /tmp/claude-1000/-home-rkp-Projects-010-Eye-pumpkin/f867d36e-d547-4c58-a797-2266b3ecacce/scratchpad/sesja-f867d36e-tekst.md:212
[r230]: /tmp/claude-1000/-home-rkp-Projects-010-Eye-pumpkin/f867d36e-d547-4c58-a797-2266b3ecacce/scratchpad/sesja-f867d36e-tekst.md:230
[r235]: /tmp/claude-1000/-home-rkp-Projects-010-Eye-pumpkin/f867d36e-d547-4c58-a797-2266b3ecacce/scratchpad/sesja-f867d36e-tekst.md:235
[r321]: /tmp/claude-1000/-home-rkp-Projects-010-Eye-pumpkin/f867d36e-d547-4c58-a797-2266b3ecacce/scratchpad/sesja-f867d36e-tekst.md:321
[r338]: /tmp/claude-1000/-home-rkp-Projects-010-Eye-pumpkin/f867d36e-d547-4c58-a797-2266b3ecacce/scratchpad/sesja-f867d36e-tekst.md:338
[r345]: /tmp/claude-1000/-home-rkp-Projects-010-Eye-pumpkin/f867d36e-d547-4c58-a797-2266b3ecacce/scratchpad/sesja-f867d36e-tekst.md:345
[r360]: /tmp/claude-1000/-home-rkp-Projects-010-Eye-pumpkin/f867d36e-d547-4c58-a797-2266b3ecacce/scratchpad/sesja-f867d36e-tekst.md:360
[r380]: /tmp/claude-1000/-home-rkp-Projects-010-Eye-pumpkin/f867d36e-d547-4c58-a797-2266b3ecacce/scratchpad/sesja-f867d36e-tekst.md:380
[r489]: /tmp/claude-1000/-home-rkp-Projects-010-Eye-pumpkin/f867d36e-d547-4c58-a797-2266b3ecacce/scratchpad/sesja-f867d36e-tekst.md:489
[r519]: /tmp/claude-1000/-home-rkp-Projects-010-Eye-pumpkin/f867d36e-d547-4c58-a797-2266b3ecacce/scratchpad/sesja-f867d36e-tekst.md:519
[r536]: /tmp/claude-1000/-home-rkp-Projects-010-Eye-pumpkin/f867d36e-d547-4c58-a797-2266b3ecacce/scratchpad/sesja-f867d36e-tekst.md:536
[r566]: /tmp/claude-1000/-home-rkp-Projects-010-Eye-pumpkin/f867d36e-d547-4c58-a797-2266b3ecacce/scratchpad/sesja-f867d36e-tekst.md:566
[r614]: /tmp/claude-1000/-home-rkp-Projects-010-Eye-pumpkin/f867d36e-d547-4c58-a797-2266b3ecacce/scratchpad/sesja-f867d36e-tekst.md:614
[r627]: /tmp/claude-1000/-home-rkp-Projects-010-Eye-pumpkin/f867d36e-d547-4c58-a797-2266b3ecacce/scratchpad/sesja-f867d36e-tekst.md:627
[r660]: /tmp/claude-1000/-home-rkp-Projects-010-Eye-pumpkin/f867d36e-d547-4c58-a797-2266b3ecacce/scratchpad/sesja-f867d36e-tekst.md:660