# Dziennik budowy

## 2026-10-17
- Start projektu: repo, opis poziomów, lista sprzętu.
- Research Gemini o mechanizmach oka przeniesiony do `20-analizy/2026-10-17-mechanizm-oka/`, źródła w `10-inspiracje/`.
- Pierwsza wersja modelu małego oka (wariant F) w Onshape, dokument **SimpleEye** → Part Studio „Oko F v1”: gniazdo z rantem i gwintem, nakrętka ze skrzydełkami, tuleja modułu z bagnetem i zatrzaskiem, jarzmo C, 2 czopy, cięgno. Eksporty do druku testowego w `40-cad/stl/` (opis w `40-cad/README.md`).
- **TODO:** skopiować pełny research Gemini (`C:\Users\Karol\.gemini\antigravity\brain\22c1b0e0-97e8-478d-af28-db231550d0a4`, ~488 MB klatek) na dysk sieciowy, gdy serwer wróci (modem wyłączony).

## 2026-10-18
- v1 małego oka → review (Opus + Codex) → v1.1 (napęd bez martwego punktu, piłeczka 39,5–40,5, dokładne STL) → review → wydruk testowy v1.1 (bez cięgna, które jest uszkodzone w STL).
- Brief v2 ze śrubami gotowy, v2 zlecona nowej sesji.

## 2026-10-18 – wydruk testowy v1.1 (uwagi użytkownika)
- **Jarzmo** nie miało płaskiej strony na stół. Wymagało podpór i **pękało przy ich odrywaniu**, bo było za cienkie.
- **Nakrętka za ciasna**, praktycznie bez luzu: w modelu 0,3 mm, a na siatce ~0,29 mm. Prawdziwy wydruk zjada więcej.
- **Kabel SG90 wychodzi u dołu krótszego boku korpusu, od strony wałka.** W v1/v1.1 serwo by się przez niego nie zmieściło.
- Wnioski przekazane do v2.1c: jarzmo bez podpór, ścianki ≥ 2–2,4 mm, `luzGwint` 0,5 + próbka gwintu, kanał na kabel.

## 2026-10-18 – review v2.1d i próbka gwintu
- Review v2.1d (Opus + Codex): modułu nie da się złożyć (słupek SG90 i występy pokrywy blokują piłeczkę), wtyczka nie przechodzi przez pokrywę, montaż w dyni niewykonalny narzędziem.
- Próbka gwintu v2.1 (luz 0,5): za luźna, ~1,3 mm luzu całkowitego.
- Decyzja: v2.2 = gniazdo + kaseta na zaczepy (zlecone sesji v2).

## 2026-10-18 – próbka gwintu v2.2 i review v2.2
- Próbka gwintu v2.2 (luz 0,3, flanki 45°, pogłębiony zarys): **luz na wydruku OK**.
- Review v2.2 (Opus + Codex): pierwsza wersja, którą da się złożyć; do poprawy luz sanek, fazki, zaczepy (kolizja z otworem H, cienki pasek), ucha pod wkładki. Zlecone jako v2.3.
- Do sprawdzenia po wydruku modułu: napęd symetryczny (pomysł użytkownika), widelec do wyjmowania kasety, zacisk kabla, orczyk.

## 2026-10-18 – review v2.3 (SolidCraft)
- Opus + Codex: przeniesienie geometrii z Onshape poprawne (< 0,1 mm), kinematyka i ruch OK; do poprawy: klin w otworze H, błona w przyrządzie, nieszczelne siatki z eksportu SolidCraft, cienkie ścianki przy H, brak fazek. Zlecone jako v2.4.

## 2026-10-18 – review v2.4 i przekazanie
- Review v2.4 (Opus + Codex): do wydruku testowego po drobnych poprawkach (v2.5: prowadnica sanek w eksporcie, naroże sanek vs tulejka H, otwory dolne Ø8,7, domyślna nakrętka 0,45, parametry, orientacja siatek, dokumenty). Ramię przy stopie 0,26 zaakceptowane, firmware ≤ ±30°.
- Orkiestracja przeniesiona do Warszawy (Omarchy). Stan: `30-projekt/stan-projektu.md`.

## 2026-10-19 – próbka gwintu ISO 60° w PETG
- Próbka ISO M63×3 (v2.4, model z SolidCrafta) wydrukowana w PETG: gwint wyszedł kiepsko. Nie wiadomo, czy winny jest profil 60°, czy model z SolidCrafta.
- Decyzja użytkownika: nowy zestaw próbek 45°, skok 5, luzy 0,2 / 0,25 / 0,3 / 0,35 / 0,4, zaprojektowany w Onshape (zadanie E2.0, zarazem pilotaż nowych zasad pracy w Onshape).

## 2026-10-19 – wydruk próbki gwintu 45° (E2.0)
- Trzpień + nakrętki 45°, skok 5, wydruk na X1C. Luz poprzeczny suwmiarką (skrajne dociśnięcie w obie strony, błąd pomiaru ±0,15–0,20 mm): nakrętka 0,20 → ok. 0,5 mm, pasuje dobrze; nakrętka 0,25 → ok. 1,15 mm, za luźna. Nakrętek 0,30–0,40 nie mierzono.
- Decyzja: `luzGwint` = 0,20 dla gniazda i nakrętki v2.5.

## 2026-10-19 – v2.5 w Onshape i pierwsza partia druku
- Model v2.5 zbudowany od nowa w Onshape (wykonawca CAD w osobnej sesji), review Opus + Codex, poprawki E2.1c, eksport 10 części.
- Wydrukowane: gniazdo, nakrętka, ramię, cięgno, 2 tulejki, pokrywa. Do druku: kaseta, jarzmo z miską, sanki serwa, przyrządy.
- ESP32-C3 SuperMini przylutowany do listew.

## 2026-10-19 – test elektroniki (E3.4)
- ESP32-C3 SuperMini + PCA9685 + 1 × SG90 na płytce stykowej, zasilanie z USB. Blink, skan I²C (PCA9685 pod 0x40) i ruch serwa ±30° w pętli działają. Połączenia i szkice: `50-elektronika/polaczenia.md`.
- Pierwsze podłączenie USB: błąd enumeracji (-71); po ponownym podłączeniu płytka wstała.

## 2026-10-20 – montaż v2.5: wkładki i piłeczka
- Wkładki M3×4×5 (Ø5, zestaw 360 szt.) wtopione: w Kasecie dobrze; w Cięgnie (gniazdo Ø4,0) rozdęły piasty i Ramię nie wchodzi na Cięgno. Stopień prowadzący wkładki ma Ø4,0 i nie wchodzi w wydrukowany Ø4,0. Decyzja: `wkladkaD` 4,4 (E4.1); próbka gniazd Ø4,0–4,8 (E3.5) zbudowana, wydruk opcjonalny. Grot przy pierwszej wkładce 238 °C – za gorąco dla PLA, kolejne niżej.
- Piłeczka (TK Gruppe, 40 mm, do ping-ponga; materiał nieznany) wklejona w Miskę klejem modelarskim: klej słabo przylgnął, całość łatwo odpadła. Druga próba: cyjanoakryl z primerem trzyma; dodatkowo oś oka na śrubach M3×10 wkręconych w nawiercone bieguny piłeczki. Na razie trzyma. Łby tych śrub wystają 0,75 mm na stronę ponad Kasetę i Kaseta nie wchodzi w Gniazdo → bruzdy w Gnieździe (E4.1). Decyzji o mocowaniu piłeczki brak.
- Gniazdo: rant Ø74 wystaje za bardzo (5,25 mm poza otwór) → Ø67,5, ząbki przy ściance przodu (E4.1).
- Sanki serwa: otwory na wkręty uszu wychodzą ok. 1 mm; okno Sanek nie ma miejsca na wyjście kabla (serwo trzeba wkładać ukośnie); Sanek nic nie trzyma od ściany do środka i wpadają do Kasety → osadzenie serwa na szynach z przednim wkrętem i klamrą H z tyłu (E4.2). Użytkownik złożył serwo wałkiem do przodu (model zakłada wałek z tyłu); w takim złożeniu kabel wychodzi z przodu, na zewnątrz Kasety, i okno w Pokrywie jest zbędne.
- Ucha Pokrywy wystają poza obrys Kasety → do środka (E4.2b).
- Instrukcja montażu: łączenie przegubów w środku rury jest niewykonalne; napęd skręcać na stole (E4.3).

## 2026-10-20/21 – v2.6, v2.7 i pierwszy działający moduł
- v2.6 (E4: Gniazdo z bruzdami i mniejszym rantem, Kaseta z blokiem serwa i oknem, Klamra H, Pokrywa krążek, wkładki Ø4,4) zbudowana przez wykonawcę, dwa review (projekt i siatki, Fable + Astra), poprawki, wydrukowana 20.10. v2.7 = v2.6 + Cięgno na nakrętkach samohamujących M3 z podkładką (E4.4), dodrukowane Cięgno.
- Montaż 21.10: pierwszy moduł złożony w całości (bez Gniazda w dyni). Instrukcja `70-budowa/montaz-v2.7.md` z renderami.
- Kalibracja: po pierwszym złożeniu przy 1500 µs oko stało na lewym oporze, a ruch w prawo składał przegub H (Ramię kładło się na Cięgnie) – czworobok był w drugim położeniu, a dźwigienka nasadzona przy nieustalonym położeniu serwa. Po zdjęciu Ramienia, ustawieniu serwa na 1500 µs i nasadzeniu w położeniu „otwarte V, H po prawej” środek = 1500 µs, ruch płynny w ±300 µs. Ocieranie o ściankę Kasety wynikało ze złego położenia mechanizmu, nie z geometrii.
- Program `50-elektronika/oczy-ruch` (sakady, fiksacje, tryby spoczynek/aktywny, limit jednoczesnych ruchów; wzorowany na ServoPumpkin, `10-inspiracje/servo-pumpkin-pythoncader.md`) na pierwszym module: „fajnie to wygląda”. Zakres ±25° serwa.
- Mocowanie serwa v2.7: przednia śruba M2 w otworze Ø2 z kanałem trzyma słabo (otwór za szeroki, M2×10 za krótka). Kanał na wkręcanie wstępne zbędny – śrubę wkłada się pęsetą przez okno. M3 przechodzi przez ucho SG90 bez rozwiercania; poza uszami serwa wszędzie użyte M3 → v2.8 (E5.1).
- Wnioski: przy kalibracji serwo startuje bez impulsu i rusza się płynnie (komenda `g`); SG90 nie zna swojej pozycji, więc nie przesuwać oka ręką przy zasilonym serwie.
- Do uzupełnienia (pytania do użytkownika, instrukcja v2.7 prosi o te wyniki): Krok 6 – czy Ramię weszło na dźwigienkę przy napędzie wsuwanym od przodu (trzeba było luzować nakrętkę H?); czy w Kasecie v2.6 wtopiono wkładki w gniazda Ø4,4 i jak wyszły (jedyny sprawdzian `wkladkaD` 4,4); jakim wiertłem nawiercono bieguny piłeczki (instrukcja v2.8 przyjmuje Ø2,5). Krok 11 (łby w bruzdach) czeka na Gniazdo w dyni.

## 2026-10-21 – v2.8
- v2.8 (E5.1, E5.2): uszy SG90 na M3×10 w otworach Ø2,6 × 8 bez kanału, ucha Pokrywy Ø2,6 × 5,6 pod M3×8 w plastik (bez wkładek), luz korpusu 0,4. Model `a56bf7b`, eksport `40-cad/3mf/Oko F v2.8/` (10 brył sprawdzone, `c128aa6`). Do druku: Kaseta, Klamra H. [wynik wydruku – do uzupełnienia]
- Instrukcja `70-budowa/montaz-v2.8.md` (E5.3). Krok 4 poprawiony po audycie dokumentacji 21.10 (także w v2.7): dźwigienkę nasadza się przy serwie trzymającym 1500 µs z programu `kalibracja`, zasilanie przez cały czas nasadzania; `test-serwa` się do tego nie nadaje (po 5 s rusza).

## 2026-10-26 – próbka gniazda PIR (szufladka v2)
- Wydrukowana próbka gniazda PIR (wycinek frontu 60 × 40). PIR HC-SR501 pasuje: kopułka wychodzi przez otwór Ø24 na środku, kołnierz soczewki (22,97 suwmiarką) w gnieździe 23,5, płytka przykręcona 2 × M2 w słupki bez gięcia – rozstaw 28,5 potwierdzony. Zdjęcia: `zdjecia/2026-10-26-probka-pir/`.
- Do wyjaśnienia: cienka linia i biała plamka przy krawędzi otworu od lica (rysa czy ślad druku). Listwa 3-pin płytki ma być u góry (nad nią wycięcie w przegrodzie korpusu).
- Wniosek: front szufladki v2 można drukować (X1C, licem, brim).
