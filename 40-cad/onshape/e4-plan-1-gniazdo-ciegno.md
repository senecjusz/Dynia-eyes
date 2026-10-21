# E4 (v2.6): plan drzewa 1/6 – Gniazdo (zm. 2–4) i Cięgno (zm. 1)

Wykonawca CAD, 20.10.2026. Brief: `30-projekt/brief-e4-v2.6.md`. Model: „Oko F v2.5” (E2.1/E2.1c). Do zatwierdzenia przez orkiestratora.

**Przed zapisem:**
- odczyt zmiennych Variable Studio (`GET /variables`), żeby pracować na żywych wartościach (np. `luzGwint` 0,20 w VS, w skrypcie 0,3);
- wersja „v2.5” (`POST /versions`).

**Zmienne zapisuję dwuetapowo, jak w E2.0:** krok 1 z liczbami, krok 2 z wyrażeniami. Nowe zmienne dopisuję na końcu listy, bo VS liczy kolejno, a `lebD` i `luzRowek` są w części Kasety.

## Gniazdo

### Zmienne

| Zmienna | Było | Będzie | Wartość |
|---|---|---|---|
| `rantD` | 74 mm | **67,5 mm** | 67,5 (`rantR` 33,75) |
| `zabekR1` | 33,75 mm | `#przodD / 2` | 31,5 |
| `zabekSzer` | – | **1,5 mm** (nowa) | 1,5 |
| `zabekR2` | 35 mm | `#zabekR1 + #zabekSzer` | 33,0 |
| `zabekH` | – | **1,3 mm** (nowa; od spodu rantu na r `zabekR1`) | 1,3 |
| `zabekZ` | 5,1 mm | `#rantSag2 + #zabekH` | 4,699 |
| `strzalkaOdstep` | – | **0,75 mm** (nowa) | 0,75 |
| `strzalkaY` | 35,2 mm | `#rantR - #fazkaRantu - #strzalkaOdstep` | 32,0 (podstawa `strzalkaY2` 28,2) |
| `bruzdaGl` | – | **1,05 mm** (nowa) | 1,05 |
| `bruzdaR` | – | `#gniazdoIDR + #bruzdaGl` | 28,55 (dno walcowe) |
| `bruzdaRw` | – | `#gniazdoIDR - #zapas` | 26,5 (łuk wewnętrzny profilu, w otworze) |
| `bruzdaSzer` | – | `#lebD + 2 * (#luzKaseta + #luzRowek)` | 7,3 |
| `bruzdaPolSzer` | – | `#bruzdaSzer / 2` | 3,65 |
| `bruzdaKoniec` | – | `#oczkoZ - #lebD / 2 - #luzRowek` | 8,6 (koniec bruzdy z −8,6) |

**Spód ząbka:** `zabekZ` = `rantSag2 + zabekH`, czyli spód rantu na r ≤ `otworR` plus `zabekH`. Na r 31,5…31,75 spód rantu jest płaski (z −3,399, krawędź g5 profilu), więc to dokładnie „1,3 od spodu rantu na r `zabekR1`”. Warunek: `zabekR1` ≤ `otworR`.

**Bez edycji operacji:**
- **profil Gniazda** (`Gniazdo: profil`) liczy się już ze zmiennych:
  - fazka: g2 od `rantR − fazkaRantu`;
  - krawędź: g3 na `rantR`;
  - spód rantu: łuk R `#dyniaR` ze środkiem na osi, więc spód przelicza się sam (r 33,75 → z −3,846);
- **ząbek** (`Gniazdo: ząbek` szkic, wymiary `#zabekR1`, `#zabekR2`, `#zabekZ`, `#rantT`) i szyk ×8 bez zmian;
- **strzałka** (`#strzalkaY`, `#strzalkaY2`) bez zmian.

### Nowe operacje (bruzdy pod łby)

| # | Typ | Nazwa | Wejście |
|---|---|---|---|
| – | Plane (offset) | `Gniazdo: pl. końca bruzdy` | Top, `#bruzdaKoniec`, w −Z (z −8,6) |
| S | Szkic | `Gniazdo: bruzda szkic` | na płaszczyźnie wyżej, profil górnej bruzdy (+Y), opis niżej |
| B1 | Extrude REMOVE | `Gniazdo: bruzda` | obszar szkicu, THROUGH_ALL w −Z (od z −8,6 przez koniec Gniazda z −45,7, który jest otwarty), zakres: Gniazdo |
| B2 | Mirror (FEATURE, `fullFeaturePattern`) | `Gniazdo: bruzda dół` | B1 względem Front (y 0), czyli bruzda −Y |

**Profil szkicu:**
- łuk zewnętrzny R `#bruzdaR` (dno walcowe, współśrodkowe z otworem);
- łuk wewnętrzny R `#bruzdaRw` (w powietrzu otworu);
- dwie pionowe linie x = ±`#bruzdaPolSzer`;
- środki obu łuków w początku układu.

Szkic jest w pełni zdefiniowany (18 stopni swobody, 18 więzów, bez Fix). Szkic nie może iść na istniejącą płaszczyznę: na z −8,6 nie ma żadnej.

**Operacje bryłowe Gniazda:** 10 → 12 ≤ 15.

**DFAM:** Gniazdo drukuje się rantem na stole (z 0 na stole, z −45,7 na górze wydruku). Bruzda to pionowy kanał: ściany boczne i dno walcowe są pionowe. Zamknięty koniec przy z −8,6 jest **podłogą** kanału (bliżej stołu), a kanał jest otwarty ku górze wydruku (z −45,7). Brak nawisu i mostu.

### Pomiary po budowie (bodydetails, massproperties)

- **Rant:** krawędź R33,75, fazka do r 32,75; spód na r 33,75 z −3,846 (z łuku R150).
- **Ząbki:** 8 szt. na k·45°, r 31,5…33,0, dół z −4,699.
- **Strzałka:** wierzchołek y 32,0, podstawa 28,2, cała w płaskim wierzchu rantu (r ≤ 32,75).
- **Bruzdy:**
  - dno R28,55, szerokość 7,3 (zakres kątowy 82,4–97,6° i 262,4–277,6° na r 27,5), z −8,6 do −45,7;
  - minimalna ścianka: za gwintem 29,45 − 28,55 = 0,90 (mierzona w narożu, przy dnie walcowym taka sama), w strefie gwintu i przodu więcej (podam zmierzone);
  - rachunek luzów do łba (brief): wierzch łba r 28,0, naroża ok. 28,17, boki 0,55.
- **Kolizje:** okienka 40–54°/220–234°, żebro 131–139°, ząbek na 90° (z −3,4…−4,7, bruzda zaczyna się na −8,6), strzałka (z 0…−0,5) – z pomiarem kątów ścian.

## Cięgno

- **Zmiana:** zmienna `wkladkaD` 4,0 → 4,4. Operacji nie ruszam.
- **Wpływ na inne części:** `Cięgno: otwory i wkładki` (C_BORE `#wkladkaD`) oraz `Kaseta: otwory wkładek` (stare ucha; znikną w zm. 6).
- **Pomiary:** walce Ø4,4 w obu piastach (z 5,4 w dół na 4,6), ścianka (7,6 − 4,4)/2 = 1,6, dno pod gniazdem 1,0, odstęp Cięgno–Ramię 0,2.
- **Luz wokół piast na drodze wsuwania:** rachunek z położeń, bo nie ma Assembly. Piasty Ø7,6 nad płytą (y 2,2…5,3) wobec korby, oczka Jarzma i Ramienia.

## Budżet API dla tego etapu

| Pozycja | Wywołania |
|---|---|
| wersja v2.5 | 1 |
| `GET /variables` | 1 |
| microversion | 1 |
| featurespecs (enumy) | 1 |
| VS: 2 zapisy | 2 |
| zapisy operacji: płaszczyzna, szkic, B1, B2 | 4 |
| pomiar (`bodydetails`, `massproperties`) | 2 |
| **razem** | **ok. 12** z 120 (`GET /features` 0) |
