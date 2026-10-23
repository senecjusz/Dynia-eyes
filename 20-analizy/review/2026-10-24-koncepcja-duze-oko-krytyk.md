# Krytyka: duże oko – wstępna koncepcja (krok 1)

24.10.2026, krytyk (Opus), tylko do odczytu. Oceniane: `20-analizy/2026-10-24-duze-oko-koncepcja-wstepna.md` + `.svg` (fd3852d). Wymagania: `30-projekt/PRD.md` v0.1. Dane: `30-projekt/e6-pomiary.md`. Rachunki ręczne (bez CAD), układ: x w prawo, y w górę, z do przodu, środek gałki = 0. Kardan: świat = R_x(φ, góra–dół, oś stała) · R_y(θ, lewo–prawo, oś w krzyżaku).

**Ocena ogólna:** kierunek jest dobry i prosty. Żebra na x = 22 i y = 22 leżą prawie na osiach obrotu drugiej osi, więc sprzężenie osi jest małe: ok. 1–4° w narożniku, do skompensowania w kalibracji. Powieki na wspólnej osi i ze wspólnym punktem ciągu są kinematycznie symetryczne. Są jednak dwa błędy rachunkowe/kinematyczne do poprawy przed CAD.

## KRYTYCZNE

**K1. Końcówki Z po stronie gałki muszą przyjąć przechył 25° i 35°, a otwór Ø1,2 daje ok. 6°.**
Otwór w żebrze gałki obraca się z gałką. Drut S1 (lewo–prawo) ma oś otworu ∥ y gałki, a przy pochyleniu φ = 25° ta oś przechyla się o 25° względem drutu, który leży poziomo (orczyk S1 z osią otworu ∥ y świata). Drut S2 (góra–dół) ma oś otworu ∥ x gałki, a przy θ = 35° ta oś obraca się o 35° względem drutu. Żadna stała oś otworu tego nie usuwa, bo rozkład daje min. 25°. Luz Ø1,2/Ø1,0 przy żebrze 2 mm pozwala na atan(0,2/2) ≈ 6°. Resztę musiałby przejąć drut: przy 0,5 rad niedopasowania na 45 mm moment ≈ 330 N·mm, czyli σ ≈ 3300 MPa, ponad granicę plastyczności drutu sprężynowego. Skutek: zakleszczanie albo trwałe skrzywienie drutu w narożnikach i przy pełnym wychyleniu drugiej osi.
*Poprawka (bez nowych części):* w żebrach gałki otwór klepsydrowy: przewężenie Ø1,2 × 0,4 mm i stożki po 40° z obu stron (wylot ok. Ø2,4 przy żebrze 2 mm). Otwór 1,2 mm od krawędzi żebra z fazką i ogon Z ≤ 2 mm, żeby korpus drutu nie oparł się o ściankę żebra przy przechyle. Przed gałką wydrukować **próbkę** (wycinek żebra + drut Z, ok. 20 min) i sprawdzić ±35° ręką.

**K2. Lewo–prawo: orczyk r 12 nie da ±12,6 mm.**
Maksymalny skok czubka orczyka to ±r, czyli ±12 przy 90°. „±63° serwa” w koncepcji jest więc błędne. Na realnym otworze 11,5 (otwory 5,5–17,5 co 2) i przy α ≤ 70° gałka obróci się najwyżej o **±29,4°**, poniżej minimum PRD ±30°.
*Poprawka:* otwór **15,5** (α = ±54,5°) albo **17,5** (±46,1°). Przeliczyć zasięg orczyka przy S1 „w narożniku r 38”.

## WAŻNE

**W1. Góra–dół: orczyk r 10 (realnie 9,5) wymaga ±78°.** Taki kąt leży blisko punktu martwego: ramię efektywne r·cos α ≈ 2 mm, ruch silnie nieliniowy, a przy serwach z zakresem ±80–85° nie ma zapasu. *Poprawka:* otwór **13,5**, wtedy ±43,5°.

**W2. S3: dwa druty Z nie wejdą w jeden otwór orczyka ~Ø1.** Dwie nogi Z obok siebie potrzebują ≥ Ø2,1. *Poprawka:* rozwiercić ten jeden otwór orczyka na Ø2,1 (ramię ma ~4–5 mm szerokości, zostaje ok. 1–1,5 mm na stronę), druty wchodzą z przeciwnych stron. Symetria zostaje, bo oba druty mają ten sam punkt.

**W3. Oś powiek leży w tubie, więc Ø79 jest tu twardym limitem.** Przy ściance dyni 30–50 mm tuba sięga od z = +26 do z = −6…−26, a ucha osi powiek są na z = 0, czyli wewnątrz otworu. Łeb ani nakrętka nie mogą wystawać poza OD tuby (luz do otworu 0,5 mm). Między gałką (x = 30) a wewnętrzną ścianką tuby (37,5 przy ściance 2 mm) jest **7,5 mm** na: łeb lub nakrętkę, ucho powieki górnej, ucho powieki dolnej, ucho pierścienia i luzy. Z łbem DIN 912 (3,0 mm) stos ma ok. 40 mm promienia, czyli się nie mieści. Mieści się tak: luz 0,5 | łeb niski ISO 7380 (1,65) | ucho 1,5 | 0,2 | ucho 1,5 | 0,2 | ścianka pogrubiona lokalnie (pad Ø10) do 3,75 z kieszenią nakrętki od strony OD, nakrętka równo z OD. Daje to 30,5 → 39,5. Czubek dźwigni r 10 na x ≈ 35,5 ma promień 36,9 wobec ID 37,5, czyli luz 0,6. *Poprawka:* w kroku 2 tabela stosu w osi x jako zmienne; dźwignie r 8 zamiast 10 (skok 6,8 mm, orczyk S3 r 7,5 → ±27°). Do sprawdzenia u użytkownika: czy ma M3 z łbem niskim/soczewkowym. Jeśli nie ma, zostaje tylko pogrubiona ścianka i łeb DIN 912 po stronie gałki, a wtedy nie ma miejsca na 2 ucha (zob. P1).

**W4. Gałka „kopułą do góry, bez podpór” – słupek z czopem wisi.** Słupek schodzi od sklepienia (z ≈ 28) do piasty (z ≈ 12,75), więc jego dolny koniec jest w powietrzu 21 mm nad stołem. *Poprawka:* zamiast słupka dwa skrzyżowane żebra pionowe o dolnej krawędzi w kształcie V 45°: od ścianki na z ≈ 25 (r ≈ 12,4) do piasty na z = 12,75. Samonośne, bez nowej części. Żebra pod druty (x = 22, y = 22, z = −4) stawiać jako płytki pionowe stojące na stole (krawędź z = −8), wtedy są w porządku.

**W5. Montaż piasty przedniej w gałce.** Wkręt M4 piasty jest równoległy do sworznia jej widełek (e6, B2), czyli do osi y gałki. Po włożeniu do gałki jest nieosiągalny przez tylny otwór. *Poprawka (kolejność, bez części):* na stole M5 w piastę, dokręcić M4, nakrętkę skontrować pod łbem (sześciokąt blokuje obrót), potem łeb z nakrętką wsunąć bokiem w gniazdo T w żebrach gałki od tyłu. Przesuw ok. 6–8 mm, miejsca jest dość (r ≈ 26). Tylny wkręt M4 (oś ∥ x) dokręcać przed przykręceniem pierścienia, przy gałce wychylonej w bok.

**W6. Słupek L uchwytu.** Dolny punkt tylnej krawędzi gałki przy φ = 25° jest w (y −22,8; z −19,5). Pionowa noga L musi więc zejść za sferą: z ≤ −31 (R 30 + 0,5 + pół grubości). Przy uchwycie drukowanym tyłem na stole ta noga jest poziomą belką długości ok. 35 mm. *Poprawka:* noga jako zastrzał ≤ 45°. W CAD sprawdzić ją wobec korpusu S1.

**W7. Pierścień nie ma płaskiej strony.** Tuba wystaje przed kołnierz, a 3 ramiona do uchwytu za kołnierz. *Poprawka:* ramiona przenieść na uchwyt serw. Pierścień drukuje się wtedy kołnierzem na stole, a uchwyt tyłem na stole, z ramionami do góry. Liczba śrub bez zmian.

## DROBNE

- **D1.** Promienie orczyka: istniejące otwory to 5,5 / 7,5 / … / 17,5. Otwory r 12 i r 10 nie istnieją. „Bez rozwiercania” jest niepewne: drut Ø1,0 w otworze „ok. Ø1” może wejść ciasno. W razie potrzeby wiertło Ø1,1.
- **D2.** Ruch powiek: 50° na dźwigni r 10 to skok 8,45 mm. Przy S3 z wałkiem poziomym punkt ciągu schodzi z płaszczyzny symetrii o 1,0 mm (r 9,5), co daje asymetrię ok. ±1°, mniejszą niż zakładka 3°. Dźwignie ustawić prostopadle do drutu w połowie skoku (25°). Wałek S3 pionowy dałby symetrię dokładną, ale nie jest wymagany.
- **D3.** Luz między powiekami: przy R 31,5–33 górna (ok. 31,5–32,7) i dolna od 33,0 dają szczelinę 0,3 mm. Tabela wymaga ≥ 0,5, więc dolna powinna mieć wewnętrzny promień ≥ 33,2.
- **D4.** Źrenica przy otwartych powiekach: przy φ = 25°, θ = 0 górna krawędź tęczówki ma 48,6° wobec krawędzi powieki 50°, czyli zapas 1,4°. W narożniku (θ = 35°) tęczówka zajmuje ±29,3° w kącie wzniesienia, więc góra tęczówki ma 54° i jest przykryta o ok. 4°. Źrenica jest odkryta, a PRD mówi o źrenicy, więc wymaganie jest spełnione. Warto to powiedzieć synowi przy rysowaniu.
- **D5.** Kardan w narożniku: 42,1° między piastami. Deklarowane „> 90°” to zapewne ±45°, więc zapas jest ok. 3°. Sprawdzić ręką na posiadanym kardanie.
- **D6.** Drut S1 przy θ = +35° przechodzi ok. 3 mm od tylnej krawędzi gałki (krawędź w x 19,1 / z −23,1, drut x ≈ 16). Górny drut powieki przechodzi blisko spodu S2 („S3 pod S2”). Oba miejsca sprawdzić w CAD (≥ 0,5 mm).
- **D7.** Wyboczenie: 47,8 N wobec ≤ 18 N, a realne obciążenie jest < 1 N. Nie jest problemem i nie trzeba go dalej liczyć.
- **D8.** Maskownica płaska na krzywej skórce: strzałka na Ø84 przy promieniu dyni 150 mm wynosi ok. 6 mm. Najprościej zestrugać nożem płaskie gniazdo Ø86 wokół otworu, bez zmiany części.
- **D9.** Otwory Ø1,2 drukowane wyjdą mniejsze. Rozwiercić po druku, co dotyczy też klepsydry z K1.

## Uproszczenia

Koncepcja jest blisko minimum: 5 części drukowanych, 4 druty, 1 kardan, 5 śrub M3/M5. Realne uproszczenia to ramiona na uchwycie (W7) oraz montaż czopów kardana całkowicie na stole bez narzędzia w gałce (W5). Dalszego zmniejszania liczby części nie widzę bez zmiany funkcji.

## PROPOZYCJE dla użytkownika (zmiana funkcji – decyzja użytkownika)

- **P1.** Jeśli stos w osi powiek (W3) się nie zmieści: wariant **B** z PRD (dolna powieka nieruchoma, przyklejona albo wydrukowana z pierścieniem). Odpada jedno ucho, jeden drut i otwór Ø2,1 w orczyku. Tylko za zgodą użytkownika.

## Werdykt

Koncepcja nadaje się do kroku 2 pod warunkiem, że od razu zostaną poprawione K1 (otwór klepsydrowy w żebrach, z próbką) i K2/W1 (orczyki 15,5–17,5 i 13,5), a w CAD najpierw zostanie zamknięty stos w osi powiek (W3).
