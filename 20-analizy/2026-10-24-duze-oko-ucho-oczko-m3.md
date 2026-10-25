# Duże oko v2: połączenie drutu S1/S2 z gałką – warianty (Z przez blaszkę / oczko na M3)

Status: do review (Astra + Opus). Model bez zmian w tym zakresie.

## Problem (liczba)

- Przemiatanie `40-cad/narzedzia/duze-oko-druty-v2-kolizje.js` (krok 35°, Galka z bieżącego SCAD, `uchoDol` 2,6). Wynik: korpus drutu S1 wnika w blaszkę ucha na **−0,90 / −0,91 mm** (korpus po −y / +y), a S2 na **−0,67 / −0,81 mm**.
- Przyczyna: kierunek drutu względem gałki ma składową wzdłuż osi otworu po obu stronach. S1: od −0,62 do +0,45 (`duze-oko-katy-przegubow.js`: y od −28 do +38°). Korpus Z musi więc przejść przez płaszczyznę blaszki raz w jedną, raz w drugą stronę.
- Przy `uchoDol` 1,2 korpus mija dno blaszki o 0,16 mm (Opus). Wtedy pod otworem zostaje 0,35 mm materiału (v1 K5). Grubsze dno i przejście korpusu się wykluczają. Potwierdził to Opus (wiadomość 24.10).

## Warianty

| | A. Z przez blaszkę (dziś) | B. Oczko Ø5 na M3 | C. Oczko Ø6 na M3 |
|---|---|---|---|
| Połączenie | drut z zagięciem Z w otworze z klepsydrą | drut kończy się oczkiem (pełny zwój) na trzpieniu śruby M3 wkręconej w gałkę | jw., oczko większe |
| Obrót wokół osi sworznia | ograniczony blaszką | dowolny | dowolny |
| Przechył w drugiej osi (obliczenie, niżej) | — (blaszka) | **≈ 41°** | **≈ 51°** |
| Wymagany przechył | 38° (S1), 38° (S2 z osią pochyloną o 14,9°) | jw. | jw. |
| Zapas | kolizja −0,9 mm | ≈ 3° | ≈ 13° |
| Jak zrobić oczko | – | owinąć drut wokół trzpienia śruby M5 (Ø5) | owinąć wokół wiertła Ø6 (albo innego pręta Ø6) |
| Części | – | 2 × śruba M3 (długość do ustalenia) + ewentualnie nakrętka | jw. |
| Dokładność | – | średnica oczka ±0,5 bez znaczenia; położenie oczka na drucie = długość ±2 mm (kalibracja) | jw. |
| Praca | – | nowy wydruk gałki (ucha → oczka pod M3) | jw. |

**Przechył oczka na sworzniu (obliczenie):** oczko o średnicy wewnętrznej D z drutu Ø1 (d_w) na trzpieniu Ø3 (d) przechyla się, dopóki rzut otworu oczka mieści trzpień: D·cos θ − d_w·sin θ ≥ d.
- D = 5: θ ≈ 41,5°.
- D = 6: θ ≈ 51°.

Pominięto spłaszczenie oczka i zwój. **Do weryfikacji.**

## Szkic geometrii (do sprawdzenia w modelu)

- **S1:**
  - sworzeń wzdłuż y w miejscu dzisiejszego ucha (x 20, z −4);
  - śruba M3 wkręcana od −y w otwór ciasny Ø2,6 w kostce przy skorupie albo przelotowa z nakrętką w kieszeni (do wyboru wg miejsca);
  - oczko między kostką a łbem śruby, luz osiowy ok. 0,5–1 mm.
- **S2:**
  - sworzeń wzdłuż osi pochylonej o 14,9° (jak dziś otwór), w miejscu ucha (y 20, z −4);
  - pochylenie centruje wymagany przechył (−53…+23° → ok. ±38°).
- **Ryzyka:**
  - łeb M3 (Ø5,5 × 3) i oczko w gałce: miejsce przy kardanie (Ø11 w osi), przy rowku T, przy drugim uchu;
  - dostęp śrubokrętem przez otwór tylny gałki;
  - kolizje oczka i łba z Pierścieniem, powiekami i drutem drugiej osi.
