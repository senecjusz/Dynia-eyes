# Review: model połączeń drutów v3 / v6 (krytyk Opus)

24.10.2026, tylko odczyt, review pełne. Oceniane: `40-cad/openscad/duze-oko-v2.scad` (stan roboczy v6: widełki S1/S2, `katOczka` 50, `ePodSw` 0,9, `xSkosS1` 5,5, kieszeń w czaszy PG, `rDzwKoniec` 2,2, S3 r 9,5), przemiatanie drutów `40-cad/openscad/kolizje-druty-v6.txt`, parametry `…/druty-v2/stl6/parametry.json`.
Oznaczenia: **[P]** wynik przemiatania (projektant lub mój), **[O]** obliczenie z wymiarów SCAD, **[Z]** założenie.

## W skrócie

- Kinematycznie model działa. Przechył oczka i szczelina mają zapas, a w przemiataniu drutów jest jedno wnikanie (−0,03 mm, model orczyka z ostrym rogiem).
- **Druk gałki nie przejdzie bez zmian:** widełki S2 wiszą w powietrzu (spód 2,4 mm nad stołem, nic pod nimi). Widełki S1 mają płaski spód 7 mm bez podparcia z jednej strony, a materiał pod otworem sworznia (0,9 mm) leży właśnie w tym zwisie.
- **Luz spojrzenia:** oczko Ø3 na sworzniu Ø1 w otworach Ø1,4 i w szczelinie 5,8 daje **ok. 6,7° histerezy przy gałce na wprost i do ok. 11° w pozycjach skośnych**. Koncepcja tego nie podaje.
- Przemiatanie nie obejmuje: końców sworzni (zagięcia), pierścienia oczka wobec gałki i kardana, błędu płaszczyzny oczka (±10°).

## KRYTYCZNE

**K1. Widełki S2: spód policzków to wyspa w powietrzu (druk rantem na stole).** [O]
- `profS2`: policzki od z_lok +5 (góra mostka, `zMost` 3 + `tMost` 2) do −1,6 (`hPodSw`). Świat: z −5,6…+1, stół (rant) z −8.
- Policzki trzymają się gałki tylko mostkiem na górze (z −1…+1). Spód (płaski 3 mm × 2,5 mm na z −5,6) i fazki 45° rosnące w górę zaczynają się 2,4 mm nad stołem, bez niczego pod spodem → pierwsze warstwy policzków drukują się w powietrzu.
- Pod spodem nie można postawić słupka z modelu: przy przechyle oczka korpus S2 wychodzi pod policzki (±y).
- **Poprawka:** podpora drzewiasta malowana tylko pod widełkami S2 (jak dziś pod stożkiem), opisana w README. Dostęp do usunięcia przez otwór tylny. Albo widełki S2 obrócone o 180° wokół osi sworznia (mostek pod spodem, do rantu), jeśli przemiatanie korpusu S2 na to pozwala – do sprawdzenia. Pewność: wysoka.

**K2. Widełki S1: płaski spód 7 mm podparty z jednej strony, otwór sworznia nad zwisem.** [O]
- `profS1`: spód policzka na z_lok −1,6 od x_lok −1,5 do +5,5 (7,0 mm). Z prawej (x 5,5) dochodzi fazka 45° od stołu, z lewej fazka idzie w górę (zwis 45°).
- Pierwsza warstwa spodu to wspornik 7 mm × 2,5 mm na jednym końcu, nie most. Otwór sworznia (x_lok 0) jest 5,5 mm od podparcia, a pod nim tylko 0,9 mm materiału (`ePodSw`), czyli ok. 2 ścieżki ułożone na opadającym zwisie.
- Scenariusz porażki: ugięty, porowaty spód pod otworem. Ciągnięcie drutu (siła w −z, prosto w ten materiał) wyrywa sworzeń w dół.
- Siły [O]: przy pracy < 2 N naprężenie w mostku pod otworem ok. 1 MPa (zginanie, L 1,4, przekrój 2,5 × 0,9). Przy zablokowanym S1 (10 N) ok. 5 MPa. Pełny materiał to wytrzymuje, zwis z opadającymi ścieżkami – niepewne.
- **Poprawka:** podpora drzewiasta pod spodem policzków S1 (jak K1) albo `ePodSw` ≥ 1,5 i test na `ProbkaDrutu` drukowanej **w tej samej orientacji co gałka** (spód policzka w powietrzu, nie na płytce). Dziś `ProbkaDrutu` ma płytkę pod widełkami, więc tego nie sprawdza. Pewność: wysoka co do zwisu, średnia co do skutku.

## WAŻNE

**W1. Histereza oczka na sworzniu (pyt. 4).** [O]
- Wzdłuż korpusu (w płaszczyźnie oczka):
  - luz oczka D − d = 3 − 1 = **2,0 mm**; po zwinięciu na M3 sprężynowanie daje D ≈ 3,2–3,4 [Z], czyli 2,2–2,4;
  - sworzeń w otworach Ø1,4: 0,4·cos T.
- Wzdłuż sworznia (oczko przesuwa się w szczelinie 5,83): wydłużenie = luz osiowy × sin T, gdzie luz osiowy = 5,83 − (2·2·sin T + 1). Maksimum przy T ≈ 37°: **1,46 mm**. Przy T = 0 brak wpływu.
- Ramię ucha od osi obrotu 20,4 mm (S1 i S2):

| Położenie | Luz wzdłuż korpusu | Histereza gałki (pełna) | ± wokół zera |
|---|---|---|---|
| na wprost (T ≈ 0) | 2,0 + 0,4 = 2,4 mm | **6,7°** | ±3,4° |
| skos (T ≈ 37°) | 2,0 + 0,3 + 1,46 = 3,8 mm | **10,6°** | ±5,3° |

- Zmiana zera z kierunkiem ruchu = połowa tej wartości. Gałka na kardanie jest wyważona [Z], więc luz nie jest wybrany – stuk przy sakadach.
- **Poprawki bez zmiany funkcji:**
  - S2 potrzebuje tylko 27° (+10° błędu płaszczyzny = 37°): oczko zwinięte na drucie Ø2 (ocynkowany, jest w warsztacie wg PRD) → D ≈ 2,2. Przechył: cos T ≥ 2/3,2 → 51° (drut okrągły). Luz 1,2 + 0,4 → **4,5°** zamiast 6,7°.
  - Osobna szczelina dla S2 (`katOczka` 37° → 5,0 mm zamiast 5,83) zmniejsza luz osiowy.
  - Otwory sworznia Ø1,2 rozwiercone samym drutem (rozgrzanym lutownicą albo przekręcanym) zamiast Ø1,4.
  - Decyzja, czy ±3–5° jest do przyjęcia, należy do użytkownika (niżej).
- Pewność: średnia (zależy od D po zwinięciu).

**W2. Oczko: zwój z zakładką i błąd płaszczyzny oczka zjadają zapas, a przemiatanie tego nie widzi.** [O] [P]
- Granica 53,2° w skrypcie to wzór D·cos T − d·sin T ≥ d (D = 3, d = 1). Drut okrągły (dwa koła w przekroju): cos T ≥ 2/4 → **60°**. Zwój z zakładką (w miejscu końca grubość 2 drutów): ok. **47°**.
- Wymagane: S1 38,4°, S2 27°. Płaszczyzna oczka gięta ręcznie ±10° względem korpusu (skrypt przyjmuje płaszczyznę idealną) → S1 do 48,4° > 47° przy zakładce.
- Szczelina przy 48°: zapas 2,915 − (2,5·sin 48° + 0,5) = 0,56 mm; z zakładką (+0,5 grubości) ok. 0,06 mm.
- Wiersze „przechył oczka … > 3” w `kolizje-druty-v6.txt` pokazują tylko „≥ 3°” (próg wyświetlania), a nie faktyczny zapas. Podać liczbę.
- **Poprawka:** oczko **otwarte bez zakładki** (ok. 330°, przerwa < 0,8 mm – sworzeń Ø1 nie przejdzie przez przerwę), koniec owinięty na szyjce korpusu, nie na pierścieniu. Wtedy 60° i pełny zapas szczeliny. Na rysunku: „płaszczyzna oczka w płaszczyźnie korpusu, doginać po przymiarce”. Test w 4 narożnikach.

**W3. Przemiatanie niekompletne (pyt. 3).** [O]
- Brak:
  - (a) **końców sworzni** (S1 oba, S2 wewnętrzny) zagiętych kombinerkami;
  - (b) **pierścienia oczka** wobec gałki, kardana i drugiego drutu – jest tylko zapas w szczelinie i korpus „od brzegu oczka”;
  - (c) błędu płaszczyzny oczka (W2).
- Ryzyko (a): koniec sworznia S2 od strony środka (y ≈ 14,6) zagięty w −y sięga y ≈ 9. Piasta tylna kardana w układzie gałki przy przechyle 43° (narożnik) ma oś przesuniętą na z −4 o 4·tg 43° = 3,7 mm, więc sięga ρ ≈ 9,2 → **możliwa kolizja**. Kierunek zagięcia końców sworzni podać na rysunku (wzdłuż ±x albo +z, nie do środka) i dodać do przemiatania.
- Dowód części (pyt. 3): `czesci-v4.txt` jest pusty (proces doszedł do θ 35°, φ 25° i nie zapisał wyniku). Mój przebieg na `stl6`: sekcja „Przemiatanie części” niżej.

**W4. Koszulka przy dźwigni: rozmiar przewodu i długość nogi L.** [O] [Z]
- Przewody do Arduino (zworki) to AWG 22–24: żyła 0,5–0,65 mm, więc izolacja ma Ø wewn. ok. 0,6–0,7 [Z]. Na drut sprężynowy Ø1,0 wchodzi z trudem albo pęka.
- Pasuje izolacja z przewodu o żyle 0,8–1,0 mm (AWG 20–18, np. zasilający), ale ma Ø zewn. ok. 1,8–2,2 [Z] wobec przyjętych 1,6. Kieszeń Ø2,6 → luz 0,2–0,4 zamiast 0,5.
- **Poprawka:** `dKoszulki` 2,2, kieszeń Ø3,2 i przeliczyć odstępy. W instrukcji: „izolacja z przewodu o żyle ~1 mm, wsuwa się na drut z oporem”.
- Noga L: dźwignia 1,5 + koszulka 1,5 → noga ok. 3 mm. Koniec nogi najwyżej do x ≈ −29,7 (gałka na ρ 7 od −29,17, plus 0,5). Od zewnętrznej ściany dźwigni (−33,8) noga może mieć **3,0–4,1 mm** – to wymiar ±0,5, ucinany obcinaczkami **przed** włożeniem (w kieszeni Ø2,6 nie da się już uciąć). Podać na rysunku: „nogę uciąć na 3,5 mm”.
- Montaż koszulki: przez otwór kieszeni od środka powieki, przed włożeniem gałki (`duze-oko-v2-montaz.md` p. 2 → p. 6). Pęsetą – wykonalne [Z].

**W5. Wcisk Ø1,0 w policzku S2.** [O] [Z]
- Otwór poziomy Ø1,0 w policzku (oś ∥ y, warstwy ⟂ z) wychodzi z druku ok. Ø0,7–0,8 [Z]. Wciskanie drutu Ø1 rozpycha otwór w poprzek warstw → rozwarstwienie policzka 2,5 mm.
- **Poprawka:** oba otwory Ø1,4 i zagięcie obu końców (jak S1), albo wcisk przez wtopienie drutu lutownicą (drut nagrzany, wsunięty – bez naprężeń). Do sprawdzenia na próbce.

## DROBNE

- **D1.** Montaż sworznia S1: zaginanie końca jedną parą kombinerek opiera ok. 180–300 N·mm [O: moment plastyczny drutu Ø1] o policzek 2,5 mm. Trzymać sworzeń drugą parą przy policzku albo zagiąć jeden koniec przed włożeniem (L), a drugi po włożeniu. Dostęp: widełki 4 mm przed rantem, od tyłu gałki przez otwór Ø53 – jest.
- **D2.** Odstępy poniżej 0,5 [P]: drut PG/PD – orczyk S3 0,15, S2 – orczyk 0,21, S1 – orczyk −0,03 (model z ostrym rogiem), S1 – gałka 0,23 (punkt (22,3; −2,8; −5,8) = ściana szczeliny widełek, styk z własnym policzkiem przy θ 35°, φ −25°), PD – Pierścień 0,44.
  - Druty przy własnym orczyku: drut obraca się względem ramienia o kąt korby – tarcie o krawędź, bez blokady. Do przyjęcia, sprawdzić przy montażu.
  - S1 – policzek 0,23: styk z własnymi widełkami tylko w narożniku, do przyjęcia.
- **D3.** Ogon Z drutu PG przy orczyku S3 **w dół** – przy ogonie w górę jest −1,05 z PD. To ma być na rysunku jako warunek, nie wybór.
- **D4.** S3 r 9,5: zakres α 37,4° (było ok. 48°). Rozdzielczość: MG90S ok. 0,5° martwej strefy [Z] → ok. 0,7° powieki. Otwór Ø2,4 na dwa druty w ramieniu orczyka na r 9,5 (szerokość ok. 5,5 [Z]) → ścianka ok. 1,5. OK.
- **D5.** `ProbkaDrutu` ma tylko widełki S1. Dodać widełki S2 z mostkiem i wciskiem (K1, W5), drukowane jak w gałce.
- **D6.** Komentarz w SCAD przy `szczWid` „5,2” nieaktualny (jest 5,83), przy `hPodSw` „1,9” (jest 1,6).

## Przemiatanie części (mój przebieg)

[P] `node 40-cad/narzedzia/duze-oko-kolizje.js …/druty-v2/stl6 10`, 1500 s, siatki v6 (z widełkami), wynik w scratchpadzie (proces odłączony; przebieg z narzędzia przerywa się po ok. 17–25 min, co wyjaśnia pusty `czesci-v4.txt`).
- Zakresy: S1 α −42…37,8°, S2 α −45,5…40,2°, S3 α +18,1…−19,3° – jak w briefie.
- Gałka z widełkami wobec Pierścienia, Uchwytu, piasty tylnej, powieki dolnej: > 3 mm; wobec powieki górnej 1,40; wobec łba M2 0,50. **Widełki nie dają nowych kolizji części.**
- Poniżej 0,5 mm (bez zmian wobec `kolizje-v2.txt`, nie dotyczą drutów v3): powieka górna – łeb M2 0,18; powieka dolna – Pierścień 0,20; powieka górna – powieka dolna 0,20 (stos osi powiek, x-stos z W3 review koncepcji). Drut S1 – gałka 0,39 (drut prosty od środka, model starego typu).
- Pary stałe 0,00 (Pierścień–Uchwyt, serwa–Uchwyt) to styki montażowe, nie kolizje.

## Zmiany modelu potrzebne przed wydrukiem testowym (pyt. 6)

1. Druk widełek S2 (K1) i spodu widełek S1 (K2): podpory drzewiaste opisane w README albo zmiana kształtu; `ProbkaDrutu` w orientacji gałki z widełkami S1 i S2 (D5).
2. Wcisk w S2 → Ø1,4 i zagięcie albo wtopienie (W5).
3. Koszulka: `dKoszulki` 2,2, kieszeń Ø3,2, noga 3,5 mm na rysunku (W4).
4. Przemiatanie: końce sworzni, pierścień oczka, płaszczyzna oczka ±10°, faktyczny zapas przechyłu zamiast „> 3” (W2, W3).
5. Zmniejszenie luzu S2 (oczko na Ø2, szczelina S2 osobno) – jeśli użytkownik nie przyjmie histerezy z W1.

## Decyzja dla użytkownika

- **Histereza spojrzenia** ±3,4° na wprost, do ±5,3° w skosach (W1). Po poprawkach S2 ok. ±2,3° na S2, S1 bez zmian (S1 potrzebuje dużego oczka). Czy to do przyjęcia na wydruk testowy?

## Werdykt

Model nadaje się do wydruku testowego dopiero po rozwiązaniu druku widełek (K1: widełki S2 wiszą w powietrzu, K2: spód widełek S1 i materiał pod otworem w zwisie) i po wydrukowaniu próbki widełek w orientacji gałki. Pozostałe uwagi (wcisk S2, koszulka, przemiatanie końców sworzni) można zamknąć przed drukiem gałki bez zmiany koncepcji.
