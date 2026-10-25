# Uproszczenie mechanizmu dużego oka – analiza krytyczna (Opus)

25.10.2026, analityk Opus, tylko odczyt. Brief: `2026-10-25-uproszczenie-mechanizmu-brief.md`. Oznaczenia: **[F]** fakt (plik repo albo źródło WWW), **[O]** moje obliczenie, **[Z]** założenie.

## Streszczenie

Pierścień nie jest głównym winowajcą: pełni trzy prawdziwe funkcje (mocowanie w otworze, osie powiek, oparcie maskownicy), choć dałoby się go zastąpić dwoma bocznymi ramionami. Kaskadę trudności wywołał wariant A, czyli obie powieki na jednym serwie, z osiami powiek w tunelu Ø80. Przy jednym serwie różnicy długości dwóch drutów nie skoryguje kalibracja, a krótka dźwignia 7 mm daje 8,4° powieki na 1 mm drutu. Stąd regulacyjne V, gięcie w parze, koszulki, kieszeń w czaszy i przyrząd do gięcia.

Rekomendacja: **wariant B, który użytkownik zatwierdził z góry 24.10:** dolna powieka nieruchoma, górna na jednym drucie. W obecnym modelu B usuwa problem dopasowania: błąd długości jedynego drutu powieki kasuje kalibracja zera S3 w ESP32. Odpadają drut PD, oba V, wspólny otwór Ø2,4, gięcie w parze i przyrząd. Zostają gałka, kardan, Uchwyt serw, Pierścień i maskownica.

Główne ryzyko B: górna powieka musi przejść ok. 73° zamiast 51,5°. Jej tył wchodzi wtedy w strefę drutu S2 nad gałką (szacunkowo ok. 0,7 mm luzu), więc przed drukiem trzeba to przemieść. Jeśli użytkownik chce dwóch ruchomych powiek, prostsza od A jest opcja C (4. serwo, każda powieka kalibrowana osobno); C wymaga jego zgody. Przebudowę bez Pierścienia (rama z bocznymi ramionami, długa dźwignia powieki) proponuję dopiero w następnej wersji.

## Słownik

| Termin | Znaczenie |
|---|---|
| gałka | biała kula oka Ø60, obraca się na kardanie |
| kardan 5/5 | metalowy przegub krzyżowy z warsztatu w środku gałki; piasta przednia w gałce, tylna na słupku Uchwytu |
| S1, S2, S3 | serwa MG90S: S1 lewo–prawo, S2 góra–dół, S3 powieki |
| orczyk | ramię na wałku serwa z otworami na drut |
| Pierścień | tuba Ø79 wsunięta od środka w otwór dyni, z kołnierzem i łapami pod wkręty; w niej osie powiek |
| maskownica | płaski pierścień Ø84 × 2 nasunięty z zewnątrz na koniec tuby, zakrywa krawędź cięcia |
| czasza | powieka w kształcie wycinka kuli, współśrodkowa z gałką |
| ucho / widełki | miejsce w gałce, gdzie mocuje się drut S1 albo S2: dwa policzki, między nimi oczko drutu na sworzniu z drutu Ø1 |
| Z, L, V | zagięcia drutu: Z = dwa zagięcia, środek w otworze orczyka; L = noga przez dźwignię; V = przegięcie do regulacji długości |
| koszulka | kawałek izolacji z przewodu nasunięty na koniec drutu, żeby nie wypadł |
| rowek T | kanał w gałce na łeb śruby M5, która jest czopem przedniej piasty kardana |
| okno słupka | otwór w słupku Uchwytu na łeb M5 czopa tylnej piasty |
| tunel | otwór w dyni: Ø80, długość = ścianka 28–50 mm |

## 1. Inwentarz

Kolumny: **Ref** – czy element ma The Face maker101; **PRD** – czy wymaga go PRD; **Ocena** – czy uzasadnienie jest pierwotne (wynika z wymagań) czy wtórne (naprawia skutek wcześniejszej decyzji projektanta).

| # | Element | Ref | PRD | Ocena |
|---|---|---|---|---|
| 1 | Gałka Ø60 na kardanie w środku | tak (gałka na przegubie krzyżowym) [F] | tak | pierwotne |
| 2 | 3 serwa nieruchome za okiem | tak (2 na oko + 1 na powieki) [F] | tak | pierwotne |
| 3 | Rowek T i podłoga w gałce, łeb M5 jako czop | nie (referencja: drukowany przegub, klej na gorąco [F]) | pośrednio (śruby zamiast klejenia, AGENTS) | **pierwotne**: piasta kardana ma otwór Ø5 i musi siedzieć w zamkniętej kuli z gładkim frontem; łeb nie wejdzie inaczej niż bokiem. Koszt to geometria w druku, nie praca przy montażu. Zostaje |
| 4 | Okno słupka (łeb M5 tylnej piasty) | nie | pośrednio | pierwotne, z tego samego powodu. Zostaje |
| 5 | **Pierścień z tubą** | nie (referencja nie ma otworu w dyni) | tak: „tuba w otworze, kołnierz z łapami” (zmiana użytkownika 24.10) [F] | pierwotne, ale tuba robi też drugą rzecz: niesie osie powiek (pkt 6). Szczegóły w pkt 1.1 |
| 6 | Osie powiek M2 w podkładkach przy tubie | referencja: powieki na „uchwycie oka i serw” (szczegółów nie widać) [F] | nie (PRD wymaga powiek, nie miejsca osi) | **wtórne.** Osie są w tunelu, bo tam jest środek gałki; w szczelinie 7,9 mm między gałką a tubą [O: 37,9 − 30] mieszczą się tylko M2 bez nakrętki w ślepym otworze (raport nocny) |
| 7 | Podkładki osi (kwadrat z dołem V) | nie | nie | wtórne do 6; konieczne przy osiach na tubie |
| 8 | Maskownica | nie | tak (zmiana użytkownika 24.10) | pierwotne. Prosta część, nie jest problemem |
| 9 | Powieki jako czasze współśrodkowe z gałką | referencja: powieki są, kształtu nie widać | tak: górna i dolna, gałka wystaje, powieki ją okrywają (24.10) | pierwotne; przy gałce wystającej z tunelu czasza współśrodkowa to najprostszy kształt |
| 10 | **Obie powieki na jednym serwie (A)** | tak: „jedno serwo na powieki” [F]; jak rusza obiema, nie wiadomo (PRD to przyznaje) | A preferowane, **B (dolna nieruchoma) zatwierdzone z góry 24.10** [F] | wybór A przy B dostępnym bez pytania to **pierwsza decyzja kaskady** (pkt 3) |
| 11 | **Krótkie dźwignie powiek r 7** | nie | nie | **wtórne:** drut biegnie do tyłu między gałką a tubą, dźwignia musi być do niego prostopadła, czyli promieniowa, a promieniowo w tunelu nie ma miejsca; dwa ucha (G i D) zjadają jeszcze 3,4 mm osi x [F: SCAD `xUchoG`…`xPad`] |
| 12 | Dwa druty powiek do jednego otworu orczyka Ø2,4 | nie | nie | wtórne do 10 |
| 13 | **V w drutach powiek, gięcie w parze** | nie | nie | wtórne do 10 + 11: różnicy PG–PD nie skoryguje kalibracja jednego serwa (wnioski druty v2, pkt 3) |
| 14 | Koszulki na dźwigni górnej i kieszeń w czaszy | nie | nie | wtórne do 11: za dźwignią jest gałka, Z się nie mieści (review Opus v2 K1) |
| 15 | Widełki S1/S2 w gałce, oczko, sworzeń z drutu, koszulki na sworzniu | nie: referencja ma drut ze zgięciem w luźnym otworze [F: „paperclip wires, shaped into linkage rods”] | PRD dopuszcza „luźny otwór z kołkiem” | **wtórne:** Z przez blaszkę kolidował (−0,9 mm), bo ucho siedzi w zamkniętej skorupie na r 20, z −4, a drut musi się przechylać do ~38° w obu kierunkach (analiza ucho-oczko). Widełki wymagają podpór w gałce (review v3 K1, K2) i dają ok. ±3,4…±5,3° luzu spojrzenia (review v3 W1) |
| 16 | Druty S1/S2 z Z przy orczyku | tak (spinacz zgięty w pręt) [F] | dopuszczone, „jeśli wyraźnie upraszcza” | pierwotne. Błąd długości ±2 mm kasuje kalibracja zera (wnioski druty v2, pkt 1) |
| 17 | Przyrząd do gięcia drutów | nie | PRD: „rysunek 1:1 albo przyrząd” | wtórne. Długość S1/S2 i tak kasuje kalibracja; przyrząd jest potrzebny tylko przez dopasowanie PG–PD (pkt 13) |
| 18 | Próbka drutu | nie | nie | rozsądne zabezpieczenie widełek; przy prostszym połączeniu zbędne |
| 19 | Długość tuby i ramion zależna od ścianki dyni (druk po pomiarze) | nie | pośrednio (montaż od środka) | pierwotne przy tubie; przy ramie bez tuby też zostaje (głębokość tunelu) |
| 20 | Solver, przemiatanie, asercje, test zginania | nie | nie | proces, nie mechanizm. Potrzebny dlatego, że luzy są ułamkowe (0,15–0,44 mm) |

### 1.1 Czy Pierścień jest potrzebny

- **Funkcje [F]:** (a) trzyma moduł w otworze: kołnierz i 3 wkręty w miąższ; (b) niesie osie obu powiek; (c) jest oparciem maskownicy; (d) łączy się z Uchwytem 3 ramionami M3.
- **Zamiennik:** dwa boczne ramiona (widły) wystające z Uchwytu do przodu na x ≈ ±34…38 (jak u Cogleya: powieki i oś góra–dół na śrubach bazy [F, Make:]). Kołnierz z łapami przechodzi na Uchwyt. Maskownica dostaje własny krótki kołnierz wciskany w otwór.
- **Zysk [O]:** 1 część drukowana mniej (z 6 na 5) i 3 śruby M3 mniej. **Precyzji nie poprawia:** ramię stoi w tej samej szczelinie 7,9 mm co tuba, więc dźwignie i osie powiek nie dostają więcej miejsca.
- **Wniosek:** Pierścień nie jest dodatkiem „żeby coś zrobić”. Wymiana na ramę to kosmetyka; prawdziwy zysk daje zmiana napędu powiek (pkt 4).

## 2. Referencja

### The Face maker101 (PCBWay) [F]
- Gałki na przegubach krzyżowych („universal joints”), każda gałka ma 2 MG90S (lewo–prawo i góra–dół).
- Serwa łączą się z gałkami **spinaczami biurowymi wygiętymi w pręty** („paperclip wires, shaped into linkage rods”). Nie ma przegubów, oczek ani regulacji.
- **Jedno MG90S na powieki** („the final servo will control the eyelids”), tym samym sposobem: drutem.
- Części: maska, 2 gałki, 2 powieki, uchwyt 5 serw, przegub krzyżowy, 2 listwy podporowe, płyta tylna. Montaż na klej na gorąco, PLA.
- **Strona nie pokazuje, czy powieki to jedna część, czy górna i dolna ruszają się osobno** (PRD ma tę samą uwagę). W opisie są „two eyelids” na dwie gałki, więc najpewniej jedna powieka na oko albo powieki sztywno połączone [Z].

### Will Cogley, Simplified Eye (Make:, Instructables) [F]
- Gałka na widełkach dwuosiowych. **Oś góra–dół gałki i oś powiek to te same śruby M3 w bazie.** Powieki wiszą na ramie z boku, nie na pierścieniu wokół oka.
- 6 × SG90: 2 na gałkę (wspólne dla dwóch oczu), **4 na powieki** (każda powieka osobno). Pręty drukowane, przeguby na śrubach M2/M3; w wersji V4 zatrzaski zamiast 45 śrub, montaż z ok. 30 do ok. 6 min.

### Co przenieść wprost
1. **Tolerancja jak w referencji:** drut ze zgięciem w luźnym otworze, długość dobrana kalibracją. Referencja nie ma żadnego elementu, który wymaga dopasowania dwóch drutów do siebie.
2. **Powieki na ramie, oś współśrodkowa z osią góra–dół** (Cogley): to już jest, osie powiek leżą na osi poziomej przez środek gałki.
3. **Jedno serwo = jedna wielkość do skalibrowania.** Cogley przy dwóch powiekach daje dwa serwa. Referencja ma jedno serwo, ale najpewniej też jedną ruchomą część [Z]. Nikt w źródłach nie sprzęga dwóch przeciwbieżnych powiek jednym serwem przez dwa gięte druty.

## 3. Łańcuch przyczyn

1. **Gałka siedzi w tunelu** (wystaje 6 mm, ścianka 40, środek gałki 22 mm za skórką) [F: SCAD `zSkorka` 22]. Wszystko, co jest przy środku gałki, mieści się więc w Ø79: między gałką a tubą zostaje **7,9 mm** promieniowo [O].
2. **Wariant A:** dwa ucha powiek na osi x, jedno za drugim. Stos na osi x [F: SCAD]: luz 0,5 + łeb M2 1,6 + 0,2 + ucho G 1,5 + 0,2 + ucho D 1,5 + 0,2 + podkładka 2,2 = 7,9 mm, czyli zero zapasu. Skutki: M2 zamiast M3, ślepy otwór „wkręcić do dna”, asercja Rg ≤ 30,4 (zapas 0,4 mm na promieniu gałki).
3. **Drut powieki biegnie do tyłu w tej szczelinie.** Dźwignia musi być do niego prostopadła, czyli skierowana promieniowo; promieniowo do tuby jest ok. 16,7 mm [O: √(37,9² − 34²)], minus ogon Z i luzy. Wyszło **r 7**, czyli **8,4°/mm** [F].
4. **Jedno serwo na dwie powieki:** różnica długości PG–PD nie da się skorygować w ESP32. Przy ±2 mm gięcia rozjazd sięga ±17° [F: analiza połączeń]. Stąd V w obu drutach, gięcie w parze, przyrząd, a zero S3 ustawiane w dwóch krokach.
5. **Drut przy dźwigni górnej:** z tyłu dźwigni jest gałka (0,5 mm), Z się nie mieści, więc L z koszulką i kieszeń w czaszy.
6. **Niezależnie od powiek:** ucha S1/S2 w zamkniętej skorupie przy rancie gałki. Z przez blaszkę koliduje → widełki, oczko, sworzeń, koszulki, podpory w druku gałki, histereza ±3–5°.
7. **Luzy w ułamkach mm** (druty – części 0,15–0,44 mm [F: review v3]) wymagają solvera, przemiatania i 6+ rund review. To jest koszt godzin, o którym mówi użytkownik.

**Decyzje, które otworzyły kaskadę:** (2)+(4), czyli A zamiast B, oraz (6), czyli ucha w skorupie zamiast z tyłu gałki. Drut zamiast drukowanych prętów przyjęto jako uproszczenie, a stał się najbardziej precyzyjnym elementem projektu, bo pkt 4 wymaga dopasowania dwóch drutów.

## 4. Prostsze architektury

Wspólne dla wszystkich wariantów:
- gałka, kardan 5/5, rowek T, S1/S2 z drutem i kalibracją, Uchwyt serw, maskownica i montaż od środka bez zmian;
- **źrenica Ø10 (założenie z raportu nocnego) zmniejsza wymagane otwarcie** [O]: połowa źrenicy = asin(5/30) = 9,6°, więc krawędź otwartej powieki musi być na ≥ 25 + 9,6 = **34,6°** od poziomu, a nie na 50° (tę wartość policzono dla tęczówki Ø24). PRD mówi o źrenicy, nie o tęczówce. Wynik wymaga akceptacji użytkownika (wielkość źrenicy to jego założenie do akceptacji).

### W1. B w obecnym modelu (dolna nieruchoma) – rekomendowany

- **Gałka i powieki:** jak dziś. PowiekaDolna zostaje tą samą częścią na tych samych osiach M2, ale **zablokowana** w położeniu z krawędzią na −35°: np. M3 przez dawną dźwignię w otwór Ø2,6 w podkładce tuby [Z, do zaprojektowania]. Albo dolna drukowana razem z Pierścieniem, ale czasza nad stołem to nawis, więc nie polecam.
- **Górna:** zamyka się do krawędzi dolnej: od +35° do −35° plus zakładka, czyli **skok ok. 73°** [O] (dziś 51,5°). Czasza ok. 110° szerokości zamiast 75°.
- **Napęd:** S3, jeden drut PG: L z koszulką przy dźwigni (jak dziś), Z przy orczyku. **Bez V, bez gięcia w parze, bez przyrządu.** Orczyk S3: ok. ±27° dla 73° powieki przy r 9,5 i dźwigni 7 [O, przybliżenie liniowe, do sprawdzenia solverem].
- **Części:** 6 drukowanych jak dziś (bez Przyrządu; próbka tylko dla widełek). Drutów 3 zamiast 4, zagięć ok. 12 zamiast ok. 21 [O: S1 5, S2 4, PG 3 wobec dziś S1 5, S2 4, PG 6, PD 6]. Koszulek 3 zamiast 5.
- **Kroki montażu:** dziś ma 8 kroków i 5 kroków gięcia PG/PD. W1 usuwa „gięcie w parze”, „V” i „zero S3 w dwóch krokach”; dochodzi 1 krok (blokada dolnej). Razem ok. 4 kroki mniej [O].
- **Czas [Z]:** zmiana modelu to 3 zmienne (skok, szerokość czaszy, blokada) plus solver i przemiatanie; montaż drutów powiek bez iteracji V. Szacunek oszczędności: ok. 1–2 h przy stole.
- **Wrażliwość na ±2 mm:** długość drutu PG → **0°** (kasuje kalibracja zera S3). Luz otworów 0,4 mm → ±1,7° powieki [O: 0,2 × 8,4]. Ruch zostaje krótki i sztywny.
- **Ryzyko główne:** tył górnej czaszy przy pełnym otwarciu sięga ok. 133–146° od przodu, czyli z −22…−27, y 18–24 [O, zależnie od przycięcia czaszy]. **Tam biegnie drut S2** (ucho y 20, z −4, orczyk y ≈ 22, z −44). Mój punktowy rachunek: drut ok. r 30,8 od środka, czasza od r 31,5, czyli **ok. 0,7 mm** [O, szacunek]. Przed drukiem przemiatanie; jeśli nie przejdzie, przyciąć górny brzeg czaszy (dziś zamknięta górna kryje do +73,5°) albo przesunąć ucho S2.
- **Ryzyko drugie:** PRD chce „przymykania zależnie od nastroju” i „górnej podążającej za spojrzeniem”. Obie rzeczy robi sama górna. Mruganie wygląda inaczej niż przy dwóch powiekach, ale tę różnicę użytkownik zaakceptował z góry (B).

### W2. Rama z bocznymi ramionami zamiast Pierścienia + B + długa dźwignia (następna wersja)

- **Trzymanie:** Uchwyt serw dostaje kołnierz z łapami (wkręty w miąższ) i dwa ramiona do przodu na x ≈ ±34…38, w płaszczyźnie y = 0, do z = 0. Na ramionach oś górnej powieki: **M3 z nakrętką**, bo przy jednej ruchomej powiece stos na osi x ma 1,7 mm więcej [O]. Dolna powieka przykręcona do ramion na sztywno. Maskownica z krótkim kołnierzem Ø79 × 6 wciskana w otwór od zewnątrz, niezależna od modułu.
- **Dźwignia górnej skierowana do tyłu, r ≈ 20** (od osi na z 0 do z ≈ −18): za rantem gałki (z < −8) nie ma skorupy, więc ramię mieści się przy x ≈ −33 [O: koniec przy y ±8,7, r 34,1 < 37,9]. Drut idzie prostopadle do niej, czyli pionowo, do S3 stojącego z boku za ścianką.
- **Części:** 5 drukowanych (Gałka, Powieka górna, Powieka dolna, Rama, Maskownica), 3 druty, bez 3 × M3 Pierścień–Uchwyt, bez podkładek i ślepych otworów M2.
- **Wrażliwość:** **2,9°/mm** [O: 1/20 rad]; luz otworów ±0,6°; długość kasuje kalibracja.
- **Czas [Z]:** nowa geometria tyłu (ramiona, położenie S3, droga drutu), pełne przemiatanie. To przeprojektowanie, nie poprawka.
- **Ryzyko główne:** droga drutu S3 przez strefę kołnierza i sztywność ramion wspornikowych ok. 25–45 mm (przekrój ok. 4 × 10 [Z]). Głębokość tunelu nadal ustala długość ramion, więc druk po pomiarze ścianki zostaje.

### W3. C: każda powieka na swoim serwie (wymaga zgody użytkownika)

- **Trzymanie:** jak dziś (Pierścień, osie M2, dźwignie r 7).
- **Napęd:** S3 → PG, S4 → PD, każdy swój otwór orczyka. **Bez V, bez gięcia w parze, bez przyrządu**; obie długości kasuje kalibracja. Użytkownik ma 4 × MG90S [F]. Dochodzi 4. ramka w Uchwycie i 4. kanał PCA9685 (jest zapas do 12 [F]).
- **Części:** 6 drukowanych (Uchwyt z 4. ramką), 4 druty, zagięć ok. 15 [O].
- **Wrażliwość:** długość → 0°; luz ±1,7° na powiekę.
- **Ryzyko główne:** miejsce na 4. serwo i drugi drut w strefie, gdzie dziś PD–Pierścień ma 0,44 mm, a druty powiek – orczyk 0,15 mm [F: review v3]. Z tego powodu wróciło 23.10 do 3 serw (decyzja użytkownika: prościej w mechanice i sterowaniu).

### Porównanie

| | Dziś (A) | W1 (B) | W2 (rama + B) | W3 (C) |
|---|---|---|---|---|
| Części drukowane | 6 + próbka + przyrząd | 6 + próbka | 5 + próbka | 6 + próbka |
| Druty / zagięcia | 4 / ~21 | 3 / ~12 | 3 / ~12 | 4 / ~15 |
| Regulacja mechaniczna długości | V × 2, gięcie w parze | brak | brak | brak |
| Powieka: błąd ±2 mm drutu | ±17° rozjazdu bez V | 0° (kalibracja) | 0° | 0° |
| Powieka: °/mm (luz) | 8,4 | 8,4 | 2,9 | 8,4 |
| Zmiana modelu | – | mała | duża | średnia |
| Decyzja użytkownika | – | zatwierdzona 24.10 | nie trzeba (B) | potrzebna |

## 5. Rekomendacja

1. **W1 teraz.** Usuwa przyczynę nr 4 łańcucha (dopasowanie dwóch drutów), a z nią V, gięcie w parze, przyrząd, wspólny otwór i drugą koszulkę. Funkcja jest zatwierdzona z góry. Zmiana modelu jest mała. Warunek: przemiatanie górnej czaszy o skoku ok. 73° wobec drutu S2.
2. **Zakres otwarcia z założenia o źrenicy:** krawędź ok. 35° zamiast 50° (pkt 4). Do akceptacji użytkownika, bo dotyczy założenia o źrenicy. Zmniejsza skok w każdym wariancie.
3. **S1/S2 bez zmian w tej wersji.** Długość kasuje kalibracja, widełki przeszły review; zostaje druk z podporami (review v3 K1, K2) i luz ±3–5°. W następnej wersji warto sprawdzić ucha wysunięte za rant gałki (z < −8), gdzie Z w luźnym otworze nie ma skorupy na drodze – jak w referencji.
4. **Z obecnego modelu zostaje:** Gałka (z rowkiem T i widełkami), kardan i czopy M5, Uchwyt serw, Pierścień, Maskownica, PowiekaGorna (szersza czasza, większy skok), PowiekaDolna (blokada zamiast drutu), druty S1/S2, solver i skrypty kolizji. **Odpada:** drut PD, V, przyrząd do gięcia (jeśli S1/S2 gięte ręcznie na długość z kalibracją), otwór Ø2,4.
5. **W2** jako kierunek następnej wersji (dźwignia 2,9°/mm, bez Pierścienia), **W3** tylko na życzenie użytkownika, jeśli dwie ruchome powieki są dla niego ważniejsze niż prostota.

**Decyzje dla użytkownika (funkcja):** (a) potwierdzić B dla tej wersji (zatwierdzone z góry 24.10); (b) źrenica Ø10, więc otwarcie do ok. 35°; (c) C tylko, jeśli chce dwóch ruchomych powiek.

## Źródła

- [The Face maker101 – PCBWay](https://www.pcbway.com/project/shareproject/The_Face_maker101_c4124445.html)
- [Simple Animatronic Eyes – Make: (Will Cogley)](https://makezine.com/projects/simple-animatronic-eyes/)
- [Screwless Eyeballs – Hackaday (Cogley V4, montaż 30 → 6 min)](https://hackaday.com/tag/toolless/)
- Repo: `30-projekt/PRD.md`, `30-projekt/decyzje.md`, `40-cad/openscad/duze-oko-v2.scad`, `40-cad/openscad/duze-oko-v2-montaz.md`, `30-projekt/raport-nocny-2026-10-25.md`, `20-analizy/2026-10-24-duze-oko-druty-v2.md`, `20-analizy/2026-10-24-duze-oko-ucho-oczko-m3.md`, `20-analizy/review/2026-10-24-druty-v2-wnioski.md`, `20-analizy/review/2026-10-24-druty-v3-model-opus.md`, `20-analizy/review/2026-10-24-polaczenia-ciegien-opus.md`.
