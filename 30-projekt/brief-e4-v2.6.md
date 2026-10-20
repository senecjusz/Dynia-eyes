# Brief E4: v2.6 – poprawki po montażu v2.5 (Onshape)

Wykonawca CAD. Obowiązuje cały `AGENTS.md` („Modelowanie w Onshape”, „Praca z API Onshape”, „Luzy montażowe”, „Zasady projektowe”). Model: dokument „Oko F v2.5”, Part Studio „Oko F v2.5”, zbudowany przez ciebie w E2.1/E2.1c; nazwy zmiennych i geometria: `40-cad/onshape/e2.1-plan.md`, `40-cad/onshape/e2.1-specyfikacja.md`.

Brief powstał z rozmowy z użytkownikiem 20.10 (wyciąg: `20-analizy/review/2026-10-20-e4-rozmowa.md`) i z analiz Fable i Astry (`20-analizy/review/2026-10-20-e4-fable.md`, `…-astra.md`). W analizie Fable są pomiary siatek v2.5, na których opierają się liczby niżej – przeczytaj ją przed planem. Jeśli liczba w briefie nie zgadza się z modelem, zatrzymaj się i napisz do orkiestratora; nie wybieraj sam.

## Po co

Użytkownik wydrukował i złożył moduł v2.5 (`70-budowa/dziennik.md`, wpis z 20.10). Wyszły problemy, przez które modułu nie da się złożyć ani zamontować w dyni:

1. wkładki M3 rozdęły piasty Cięgna i Cięgno nie wsuwa się nad Ramię i korbę,
2. rant Gniazda wystaje za bardzo, a ząbki pod nim muszą się przesunąć,
3. łby śrub osi oka wystają ponad Kasetę i Kaseta nie wchodzi w Gniazdo,
4. Sanek serwa nic nie trzyma: wpadają do środka Kasety; otwory na wkręty uszu wychodzą ok. 1 mm,
5. ucha Pokrywy wystają poza obrys Kasety,
6. instrukcja każe łączyć przeguby w środku rury, co jest niewykonalne (to poprawi orkiestrator w instrukcji, nie ty).

Cel v2.6: wszystkie części do jednego wydruku wieczorem 20.10 – **Gniazdo, Cięgno, Kaseta, Klamra H (nowa), Pokrywa**. Przed wydrukiem będzie review (Fable + Astra). Pracujesz w ciągu dnia; użytkownik jest w pracy, plany drzewa zatwierdza orkiestrator.

## Jak części działają razem

- **Gniazdo** siedzi w otworze w ściance dyni (otwornica 2½", otwór Ø63,5). Od zewnątrz opiera się rantem o skórkę; wierzch rantu jest płaski na z 0, spód wyprofilowany po łuku dyni R150 (z −3,40 przy r 31,5, −3,85 przy r 33,75). Część „przód” (R31,5, `przodD`) wchodzi w otwór. Od środka dyni Gniazdo dokręca Nakrętka na gwincie 45°; przez strefę za gwintem (z −36,7…−45,7, rdzeń R29,45) przechodzi otwór Nakrętki R29,65, więc Gniazda nie da się tam pogrubić na zewnątrz. **Ząbki** pod rantem (8 szt. co 45°) wgryzają się w skórkę i nie pozwalają Gniazdu obracać się przy dokręcaniu Nakrętki. Na wierzchu rantu jest wycięta **strzałka GÓRA** (y 31,48…35,2, głębokość 0,5).
- **Kaseta** (rura r 24,25–27,25, z −1,5…−77,5, drukowana czołem na stole, rura pionowo) niesie mechanizm oka i wsuwa się w Gniazdo (otwór R27,5, luz 0,25 na stronę) **osiowo, od środka dyni, bez obrotu**. Pozycję kątową ustala żebro Gniazda (131–139°) w rowku Kasety. Na końcu Kasetę blokują haczyki zaczepów w okienkach Gniazda (okienka 40–54° i 220–234°, z −38,2…−42,2).
- **Oś oka** to dwie śruby M3 w Kasecie, u góry i u dołu (x 0, z −12); na nich obraca się Jarzmo z piłeczką. Pogłębienie pod łeb: Ø`lebD` 6,2, dno na r 25,55, powierzchnia Kasety r 27,25 (głębokość 1,7; operacja liczy się od płaszczyzny y ±28). Model zakłada niski łeb ISO 7380. Użytkownik złożył moduł na śrubach M3×10 z własnego kompletu (łeb ok. 2,45), wkręconych też w nawiercone bieguny piłeczki (klej modelarski piłeczki nie utrzymał; teraz trzyma CA z primerem plus te śruby). Ich łby wystają 0,75 mm ponad Kasetę.
- **Jarzmo** z piłeczką wsuwało się w v2.5 od tyłu Kasety, z kołkami ograniczników jadącymi w kanałach do łukowych szczelin. Użytkownik pokazał, że Jarzmo wchodzi także **od przodu**, bez kanałów (luzu wystarczy, kołki stoją w szczelinach). **W v2.6 Jarzmo i napęd wsuwa się od przodu.** Dzięki temu tył Kasety nie musi być wolny dla Jarzma (po stronie korby, +X, Jarzmo zajmuje przy przejeździe r 21,9–24,8). Kanały kołków zostają bez zmian.
- **Napęd:** korba Jarzma (przegub C) – Cięgno – Ramię orczyka (przegub H) – wałek serwa. Ramię i korba leżą pod Cięgnem (płyta Cięgna y −0,3…2,2, Ramię przy H y −3,0…−0,5, odstęp 0,2); piasty Cięgna Ø7,6 (y 2,2…5,3) są od góry. Przegub to śruba M3×8 od spodu przez tulejkę z kołnierzem (trzon Ø5,6 w otworze Ø6,0) wkręcona we wkładkę w piaście Cięgna. W v2.6 użytkownik skręca napęd na stole, wsuwa go od przodu i w Kasecie tylko nasadza Ramię na wałek (wkręt środkowy przez otwór górny).
- **Serwo SG90** (pomiary z `PODGLAD SG90` v2.4 w pozycji modelu, Fable): uszy y −17,6…−15,1 (grubość 2,5), otwory uszu z −46,75 i −74,55 (rozstaw `sg90UchaRozstaw` 27,8), korpus z −71,9…−49,4, dół korpusu y −33,5 (wystaje przez szczelinę w spodzie Kasety, szerokość szczeliny 13,2, otwarta na tylnym końcu), wałek z −66 (bliżej tyłu), **wyjście kabla z tyłu korpusu**, y −31,4…−32,8, czyli 4,2–5,6 mm pod zewnętrzną powierzchnią Kasety. **Kierunek serwa zostaje jak w modelu** (decyzja użytkownika 20.10): wałek i kabel z tyłu. W v2.5 serwo stało na Sankach (słupki pod uszy, siedzisko uszu y −17,6), które wsuwały się od tyłu.
- **Pokrywa** zamyka tył Kasety (z −77,5), dziś przykręcona M3×8 do dwóch uch z wkładkami na zewnątrz Kasety (40° i 140°, r do 33,7). Ma okno na wtyczkę, zacisk kabla, prowadnice kabla i język 18 × 18, który blokował Sanki.
- **Wkładki M3**: mosiężne, wtapiane lutownicą, M3×4×5 z zestawu użytkownika: długość 4, radełko Ø5, u dołu stopień prowadzący Ø4,0 (pomiar). Są w piastach Cięgna i w uchach Pokrywy na Kasecie.

## Kolejność montażu v2.6 (projektuj pod nią)

1. Na stole: przykręć Klamrę H do tylnego ucha serwa, wkręć wstępnie wkręt w przednie ucho.
2. Wsuń serwo z Klamrą od tyłu Kasety (łącznik Klamry w szczelinę), aż przednie ucho stanie na bloku przednim; dokręć przedni wkręt wkrętakiem przez otwór montażowy w górnej ściance (rura jest jeszcze pusta).
3. Na stole: skręć napęd (Jarzmo z piłeczką, Cięgno, Ramię, tulejki, śruby przegubów).
4. Wsuń napęd od przodu Kasety, wkręć śruby osi oka, nasadź Ramię na wałek i wkręć wkręt środkowy przez otwór górny.
5. Przykręć Pokrywę do wewnętrznych uch.

## Zmiany

### 1. Cięgno (i przy okazji Kaseta): `wkladkaD` 4,0 → 4,4

**Problem:** po wtopieniu wkładek w gniazda Ø4,0 piasty Cięgna rozdęły się i Cięgno nie wsuwa się nad Ramię i korbę ani nie łączy się z nimi. Stopień Ø4,0 nie wchodzi w wydrukowany otwór Ø4,0 (mały otwór drukuje się mniejszy – założenie), więc wkładki nie da się wycentrować przed grzaniem. Szlifowanie piast odpada; Cięgno będzie drukowane od nowa.

**Zmiana:** `wkladkaD` = 4,4, nic więcej w Cięgnie. Stopień Ø4,0 ma nominalnie 0,2 mm luzu na stronę (wchodzi na zimno), radełko Ø5 ma 0,3 mm wcisku na stronę – jak w karcie Ruthex RX-M3x5x4 (radełko 5,0, stopień 4,25, otwór 4,4, ścianka ≥ 1,3). To **analogia**, nie specyfikacja naszych wkładek; wynik potwierdzi wtopienie.

**Sprawdź i podaj:** Ø4,4 w obu piastach Cięgna i w gniazdach wkładek uch Pokrywy; ścianka przed wtopieniem: Cięgno (7,6 − 4,4)/2 = 1,6; dno pod gniazdem 1,0; odstęp Cięgno–Ramię 0,2; **luz wokół piast i nad nimi na całej drodze wsuwania Cięgna nad Ramię i korbę** (ile zapasu jest na wypływkę po wtopieniu).

### 2. Rant Gniazda: `rantD` 74 → 67,5, strzałka GÓRA

**Problem:** rant wystaje 5,25 mm na stronę poza otwór Ø63,5. Decyzja użytkownika: rant ma tylko nie pozwolić Gniazdu wpaść do dyni, „grzybek” najwyżej 2 mm. Powierzchnia oparcia o skórkę spada z ok. 1134 do ok. 411 mm² – **przyjęte ryzyko**, nie poprawiaj go.

**Zmiana:** `rantD` = 63,5 + 2 × 2 = 67,5. Łuk spodu liczy się z `rantD` – sprawdź przeliczenie. Fazka 1 mm zostaje (krawędź ma ok. 3,85 mm wysokości).

**Strzałka GÓRA:** wierzchołek leży na y 35,2, a nowy rant kończy się na r 33,75 (płaski wierzch do r 32,75). Bez zmiany strzałka zostanie obcięta, a operacja pokaże OK. Wyraź jej położenie od `rantD`: wierzchołek `strzalkaY` = `rantD/2 − fazkaRantu − 0,75` (= 32,0), `strzalkaH` bez zmian (podstawa ok. 28,2, nad otworem R27,5). Sprawdź, że strzałka jest cała.

### 3. Ząbki przy ściance przodu

**Problem:** ząbki leżą na r 33,75–35; przy rancie R33,75 byłyby w powietrzu. Decyzja użytkownika: ząbki przylegają do ścianki przodu.

**Zmiana:** zmienne (K3): `zabekR1` = `przodD/2` (31,5); `zabekSzer` = 1,5, `zabekR2` = `zabekR1 + zabekSzer` (33,0); `zabekH` = 1,3 – wysokość od spodu rantu na promieniu `zabekR1` (spód rantu na r 31,5 to z −3,40, dół ząbka ok. z −4,70), dno płaskie. W v2.5 ząbki miały 0,96–1,25 mm. `zabekKat` i szyk ×8 bez zmian. Pas r 31,5–31,75 wypada nad otworem, w skórkę wchodzi ok. 1,25 mm – słabsza antyrotacja akceptowana przez użytkownika. Ząbek na 90° nie koliduje ze strzałką ani z bruzdą.

### 4. Bruzdy w Gnieździe pod łby śrub osi

**Problem:** łby M3×10 wystają 0,75 mm na stronę, luz Kasety w Gnieździe to 0,25 – Kaseta nie wchodzi. Bruzdy mają przyjąć łby wyższe niż ISO 7380; pogłębienia w Kasecie zostają.

**Zmiana:** dwie osiowe bruzdy w ściance otworu Gniazda, u góry i u dołu (środek x 0, y ±), jedna para `Mirror` (K5).
- **Dno walcowe**, współśrodkowe z otworem, na promieniu `gniazdoID/2 + bruzdaGl`, `bruzdaGl` = 1,05 (decyzja użytkownika). Płaskie dno dałoby w narożach ściankę 0,70 – nie rób płaskiego.
- **Szerokość** `bruzdaSzer` = `lebD + 2 × (luzKaseta + luzRowek)` = 7,3 (łeb Ø6,2, luz ślizgowy 0,3 i 0,25 na przesunięcie Kasety w bok).
- **Długość:** od tylnego końca Gniazda (z −45,7, otwarta) do `bruzdaKoniec` = −(12 − `lebD`/2 − `luzRowek`) = −8,6, koniec płaski.

**Rachunek do raportu:** wierzch łba r 28,0, naroża ok. 28,17; przy Kasecie przesuniętej o 0,25 – 28,25 i 28,42; dno 28,55 → luz ≥ 0,3 przy Kasecie w osi, ok. 0,13 w najgorszym narożu (przyjęte). Boki: 0,55 na stronę nominalnie. Ścianka za gwintem pod bruzdą 0,90 (przyjęte), w strefie gwintu i przodu więcej – podaj zmierzone minimum. Łby do ok. 2,75 mm przejdą, DIN 912 (3,0) nie.

**Kolizje:** bruzdy (ok. 82–98°, 262–278°) z okienkami (40–54°, 220–234°), żebrem (131–139°), ząbkami i strzałką – potwierdź pomiarem. **DFAM:** Gniazdo rantem na stole, bruzda to pionowy kanał – bez nawisu.

### 5. Kaseta: osadzenie serwa (zamiast Sanek)

**Problem:** Sanki trzymały serwo tylko osiowo (przód o koniec szczeliny, tył – język Pokrywy). Od ściany do środka nic ich nie trzymało i wpadały do Kasety. Otwory pod wkręty uszu (Ø1,8) wydrukowały się ok. 1 mm. Decyzja użytkownika: **Sanki znikają**, serwo trzymają: przód – wkręt w blok wydrukowany z Kasetą, tył – Klamra H.

**5a. Blok przedni (część Kasety).** Pod przednim uchem serwa (otwór ucha x 0, z −46,75), od wewnętrznej ścianki do siedziska uszu y −17,6 (jak słupek Sanek), szerokość jak słupek (x ±9,6). Otwór pod wkręt M2 w osi ucha. Użytkownik wkręca wkręt wstępnie w ucho na stole, więc jego końcówka (2,5–3,5 mm pod uchem) jedzie razem z serwem: blok potrzebuje **kanału otwartego do tyłu** na końcówkę wkrętu, kończącego się otworem pod wkręt (nie jest to gniazdo blokujące ucho; luz dotyczy wkrętu Ø2). Wymagania:
- otwór pod wkręt: nowa zmienna, start 2,0 (drukowany Ø1,8 wyszedł ok. 1 mm), głębokość z dnem ≥ 0,6 (`dnoWkretu`);
- blok nie może wejść na otwór dolny H (Ø8,7 w x −9,235, z −40,628, sięga z −45,0) ani na drogę kołnierza tulejki H (Sanki miały tu fazkę 1 mm, luz 0,295) – przód bloku z ≤ −45,2 albo fazka, podaj luz;
- **DFAM:** Kaseta drukuje się czołem na stole, więc przednia (dolna przy druku) ściana bloku to nawis – fazka 45° albo skos od ścianki;
- szyny między blokiem a Klamrą tylko wtedy, gdy prowadzą serwo i nie wchodzą w drogę Klamrze; uzasadnij w planie albo pomiń.

**5b. Otwór montażowy.** W górnej ściance Kasety (y +), w osi przedniego wkrętu (x 0, z −46,75): owal szerokości ok. 9 mm (`otworGornySzer` jak dziś), tak żeby przez niego było widać łeb wkrętu i wejść wkrętakiem prosto. Łączy się z istniejącym otworem górnym (z −49,3…−70,5) w jedno okno ok. z −42,25…−70,5 – przedłuż otwór górny zamiast robić drugi. Na ok. 3,5 mm wchodzi pod koniec Gniazda (z −45,7) – nieszkodliwe. Sprawdź kolizje z zaczepami i występami.

**5c. Klamra H (nowa część, osobny Part i folder).** Przekrój jak litera H, nasunięty od tyłu na ścianę Kasety w szczelinie serwa, za korpusem serwa (korpus kończy się na z −71,9):
- **ramię wewnętrzne** po wewnętrznej ściance (profil R24,25), wierzch na siedzisku uszu y −17,6, szerokość większa niż szczelina (np. x ±9,6), z otworem pod wkręt tylnego ucha (x 0, z −74,55, ta sama zmienna co w 5a, dno ≥ 0,6);
- **ramię zewnętrzne** po zewnętrznej ściance (profil R27,25), szersze niż szczelina, grubość ≤ 3,5 – pod nim przechodzi kabel serwa (4,2–5,6 mm pod powierzchnią Kasety, użytkownik potwierdził);
- **łącznik** w szczelinie: szerokość szczelina − 2 × 0,25 (12,7); ściana Kasety (3,0) między ramionami z luzem ślizgowym 0,25 na stronę (odstęp ramion 3,5); fazki wejściowe;
- długość osiowa ok. z −72,1…−77,5 (nie wchodzi na korpus, tył równo z końcem Kasety, żeby Pokrywa domykała);
- Klamra blokuje ruch serwa od ściany do środka i na zewnątrz; osiowo trzyma serwo przedni wkręt;
- druk: profilem H na stole (wszystkie ściany pionowe).

**5d. Usuń Sanki** (ich operacje i zmienne, które nie są używane gdzie indziej); stan v2.5 zachowa wersja Onshape.

**Sprawdź:** siedzisko obu uszu na y −17,6; wsuwanie serwa z Klamrą od tyłu z wkrętem przednim wystającym pod uchem (luz końcówki w kanale bloku); kabel pod Klamrą; łby wkrętów M2 względem Ramienia na ruchu ±33°.

### 6. Pokrywa i ucha Pokrywy

**Problem:** ucha Pokrywy (40°, 140°) wystają poza obrys Kasety. Decyzja użytkownika: ucha wewnątrz Kasety, po bokach, w Pokrywie same otwory; poza obrys wystaje tylko Klamra H.

**Zmiana:**
- **Kaseta:** dwa ucha z wkładkami wewnątrz, po bokach, w okolicy ±X (y ≈ 0), przy tylnym końcu; tam je zaznaczył użytkownik (zdjęcia 20.10, czerwone znaczniki). Gniazdo wkładki od tyłu: Ø`wkladkaD`, głębokość `wkladkaL + wkladkaZapas` + dno ≥ 0,6; ścianka wokół wkładki ≥ 1,6. Promieniowo ucho sięga ok. 7,6 mm od ścianki (do r ok. 16,6). **DFAM:** ucho wisi na pionowej ściance przy druku czołem – od strony przodu skos 45° do ścianki. Stare ucha zewnętrzne usuń.
- **Pokrywa:** otwory M3 luźne (`m3Luzny`) w osiach nowych uch; usuń okno na wtyczkę, zacisk kabla, prowadnice kabla i język 18 × 18 (kabel wychodzi z tyłu korpusu na zewnątrz Kasety, nie przez Pokrywę; serwo trzyma Klamra).
- Kolizji z napędem nie oczekujemy (piasta orczyka na x ≈ 0, z −66, R5,5; ucha na r ≥ 16,6), ale sprawdź na ruchu ±33° i przy wsuwaniu napędu od przodu; sprawdź też, że Klamra H i ucha się nie spotykają.

## Proces

1. Utwórz w dokumencie wersję Onshape **„v2.5”** (stan wydrukowany 19.10), potem pracuj w workspace.
2. **Plan drzewa** do orkiestratora przed pierwszym zapisem, osobno dla każdej zmienianej części, w kolejności: Gniazdo (2–4), Cięgno (1, tylko zmienna), Kaseta (5a, 5b, 6), Klamra H (5c), Pokrywa (6), Sanki (5d). Plan zawiera zmienne, szkice i ich użycie, operacje, Mirror/szyki, DFAM. Kaseta ma już 24 operacje bryłowe (> 15) – uzasadnij nowe. Zatwierdzenie przychodzi w ciągu kilku minut; nie czekaj na użytkownika.
3. Budowa folder po folderze, kontrola każdej operacji i szkicu jak w E2.1c; po każdej części wpis w `stan-api.json` i commit.
4. Runda **K1–K11** dla wszystkich zmienionych części, pomiary z sekcji „Sprawdź”, rachunek luzów bruzdy i Klamry. Raport `40-cad/onshape/weryfikacja-v2.6.md`.
5. Nazwy części jak foldery. Wiadomość do orkiestratora z hashem: „gotowe do eksportu: …” z osobnym statusem każdej części. Eksport 3MF robi użytkownik wieczorem; kontrolę siatek i review zleca orkiestrator.

**Budżet API:** ≤ 120 wywołań łącznie, ≤ 4 odczyty `GET /features`; zmienne dwuetapowo jak w E2.0; każde wywołanie przez `req()`. Jeśli plan wymaga więcej, zgłoś przy planie.

**Stop i pytanie do orkiestratora:** rozbieżność > 0,05 mm z briefem, błąd operacji, liczba w briefie sprzeczna z modelem, potrzeba decyzji projektowej spoza briefu.
