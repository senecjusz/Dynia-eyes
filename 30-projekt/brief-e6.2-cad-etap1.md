# Brief E6.2 – CAD dużego oka, etap 1 (23.10)

**Rola: jesteś wykonawcą CAD.** Pracujesz według tego briefu w swoim worktree i commitujesz na swoją gałąź (`claude/heuristic-brattain-6e5ce2`), nigdy na `main`. Decyzje techniczne podejmuje orkiestrator (sesja Dyregent3), nie użytkownik – użytkownik śpi i przekazał orkiestratorowi pełny nadzór. Plan drzewa każdej części wysyłasz orkiestratorowi przed pierwszym zapisem tej części i czekasz na „zatwierdzone”. Każde odstępstwo od koncepcji zgłaszasz przed zapisem. `AGENTS.md` obowiązuje w całości (sekcje „Modelowanie w Onshape”, „Praca z API Onshape”, „Luzy montażowe”, „Eksport i kontrola po eksporcie”). Bez prognoz czasu.

Ten brief **zastępuje** `30-projekt/brief-e6-duze-oko.md` (22.10) i Twój plan `40-cad/onshape/e6-plan.md` – oba oparte na analizie 18.10, której architektura odpadła po trzech rundach review (zakleszczanie cięgien, kolizje napędu powiek, otwór 83 > otwornica 80, Rura z gwintem).

## Podstawa

- **Koncepcja:** `20-analizy/2026-10-23-duze-oko-2c-koncepcja-v3.md` (na `main`; zrób `git merge main` w swoim worktree, żeby ją mieć) – źródło prawdy o geometrii etapu 1: pkt 2 (wymiary i miejsce), 3.1 (kardan i Słupek), 3.4 (wycięcia czaszy i powieki), 5 (powieki, ucha i osie), 8 (montaż), 10 (części), 11 (zmienne i K9).
- **Weryfikacja v3:** `20-analizy/review/2026-10-23-e6-koncepcja-v3-fable.md` i `…-v3-astra.md` – poprawki z nich wpisane niżej.
- **Dane wejściowe:** `30-projekt/e6-pomiary.md` (kardan: wkręt M4 równoległy do sworznia; MG90S z rysunku).
- **Decyzje:** `30-projekt/decyzje.md`, wiersze 22–23.10 (4 × MG90S, otwór ≤ 80, lekko, 2c, części posiadane, rozruch).
- Skrypty przemiatania: `40-cad/narzedzia/e6-przemiatanie/`.

## Zakres etapu 1 – części niezależne od brakujących pomiarów

Brakują pomiary przegubów kulowych (B1), ucha i kabla MG90S (B4) i głębokości w dyni (B5). Etap 1 obejmuje tylko części, których one nie zmieniają (lista Fable v3):

1. **Variable Studio „Zmienne duże oko”** – komplet zmiennych z koncepcji v3 pkt 11 i v2 pkt 8, **także** tych zależnych od B1/B4/B5 (z wartościami przyjętymi w koncepcji: `kulkaM5H` 4, `srubaUcha` 2,5, `glebokoscSrodka` …), żeby późniejsza zmiana była edycją zmiennej. Zmienne wysyłasz raz, zbiorczo.
2. **Szkic layoutu** na górze drzewa: osie gałki (x lewo–prawo, y, z w głąb), środek kuli, płaszczyzny podziału, oś powiek (wspólna z osią góra–dół), okręgi bazowe R30 / R31,2 / R33,4 / R37,75 / R39,75, płaszczyzna rantu.
3. **Rama** (rant Ø84 ≤ 2 mm poza otwór, rura Ø79,5/75,5, boki osi z gniazdami stożkowymi, 3 ucha wewnętrzne 100°/200°/310° – szyk kołowy nie przejdzie przy nierównych kątach, więc 3 operacje albo jeden szkic z trzema profilami; uzasadnij w planie). Rant ma wynikać ze zmiennej `glebokoscSrodka`. Druk tyłem w dół (Fable v2 W9: rant na łuku R150 nie jest płaski).
4. **Gałka** (czasza R28–30, krawędź 115° z wycięciami `rimX` 104 / `rimY` 106 jako zmienne, 2 nadlewy M3 na φ 210°/330°, front gładki – bez rowków, wkładek, szwów; tęczówkę rysuje syn).
5. **Powieka górna** i **Powieka dolna** (czasze R31,2–33,4, rant 3,5, zakresy 99,5° / 79°, wycięcie górnej `wyciecieG` 83,5 w pasie x −2…+24 jako zmienne, ucha 2,4, zaczepy drutu z otworem Ø1,6 (`otworDrutu`), przycięcie kącików pkt 5.3). Luz powieka–gałka 1,0–1,2 promieniowo jako zmienna (`luzCzasza`), luz osiowy powiek 0,2–0,3. Podpory od strony wklęsłej opisane w README.
6. **Słupek** (R7,65, kieszeń kardana Ø11,3 od z −12,75, otwór M4 Ø4,2 na **±x** – pas styku okna jest na z −10,2…−13,8, otwór M4 ma do niego ≥ 1,25 mm; kieszeń nakrętki M5, spłaszczenie u dołu).
7. **Obejma** (koncepcja v2, PETG, M3×25).
8. **Przyrządy:** zera gałki i do gięcia drutów Ø1,2 (koncepcja v3 pkt 5.1 i 8).

**Nie budujesz w etapie 1:** Płyty (klatki serw, słupki stopu – B4), Uchwytu (piasty M2, okno – B1), Ramion X/Y/PG/PD, Prętów X/Y, przyrządu długości prętów. To etap 2 po pomiarach.

## Poprawki z weryfikacji v3 dotyczące etapu 1

- Gałka: nawis wnętrza > 45° od Ø39,6 – próbka P6 (czasza 20 mm od szczytu) jako osobna bryła w tym samym Part Studio; podpory tylko od środka, jeśli P6 nie przejdzie.
- Wycięcia `rimX`, `rimY`, `wyciecieG` jako zmienne (ryzyko 1–2° do skorygowania po B1).
- **Astra v3 (NIE dla modelu kontrolnego, architektura bez zmian):** przed zamknięciem koncepcji v3.1 buduj najpierw **bazę każdej części**: Rama – rura Ø79,5/75,5 i rant Ø84 (bez uch wewnętrznych i interfejsów z Płytą), Gałka – czasza R28–30 z krawędzią 115°, powieki – czasze R31,2–33,4 z rantem i uchami na osi, Słupek, Obejma. Elementy zależne od B1/B2/B5 (wycięcia `rimX`/`rimY`, `wyciecieG`, nadlewy M3 Gałki, zaczepy drutu, ucha wewnętrzne Ramy) dodaj jako **ostatnie operacje w folderze części** i dopiero po moim „zatwierdzone” dla koncepcji v3.1 – żeby ewentualna korekta była edycją tych operacji, nie przebudową.

## Proces

1. Na starcie: `git merge main`, sprawdź logowanie Onshape i działanie timera podtrzymania, jedno `GET /features` jako stan wyjściowy (porównaj z Twoim stanem z 22.10), odczyt liczników każdego endpointu przy pierwszym wywołaniu.
2. **Plan drzewa** (punkty 1–4 sekcji „Kolejność budowy części” w `AGENTS.md`): lista zmiennych i dozwolonych stałych, szkice z przeznaczeniem i operacjami, które z nich korzystają, Mirror/szyki, luzy każdej pary (pasowanie, luz nominalny), budżet operacji ≤ 15 na część. Najpierw plan Zmiennych + layoutu, potem plan każdej części – do orkiestratora, czekasz na „zatwierdzone”.
3. Budowa: jedna bryła na uruchomienie, folder od razu, kontrola znacznika szkicu, `stan-api-e6.json` po każdej bryle, commit na gałąź po każdej przyjętej części (`git add` po nazwach).
4. **Budżet API etapu 1:** ≤ 80 żądań HTTP łącznie, w tym `GET /features` ≤ 8 (stan wyjściowy, odbiór części, K1–K11). Przed każdą sekcją lista wywołań wobec `remaining − 20`. Bramka, 429/402 = stop i raport.
5. Po etapie 1: runda weryfikacji K1–K11 dla zbudowanych części (`40-cad/onshape/weryfikacja-e6-etap1.md` z surowymi danymi: `features.json` z encjami, znaczniki szkiców, Variable Studio – jak `odbior-v2.6/`), K9 dla `rimX`, `wyciecieG`, `luzCzasza`, `glebokoscSrodka`.
6. **Eksport** (użytkownik autoryzował orkiestratora i wykonawcę 23.10): 3MF każdej części etapu 1 do `40-cad/3mf/Duze oko v1/` (kąt 3°, odchyłka 0,01 mm); jeśli licznik eksportu na to nie pozwala, zgłoś to przed eksportem. Potem `40-cad/narzedzia/sprawdz_siatki.js` – szczelność, orientacja, liczba brył.
7. Raport: plik stanu + `weryfikacja-e6-etap1.md` + commit; potem stop i wiadomość do orkiestratora z hashem commita.
