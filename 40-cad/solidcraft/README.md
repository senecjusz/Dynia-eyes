# SolidCraft: Oko F v2.4 (do review)

Model budowany **na żywo w aplikacji** SolidCraft 0.15.0 (Windows i Linux), sterowanej przez `solidcraft.exe --control 7878` i `solidcraft-cli mcp --connect 127.0.0.1:7878`. Onshape zostaje jako zapas.

| Plik | Co to |
|---|---|
| `oko-f-v2.4.solidcraft` | **aktualny model**, otwierać w SolidCraft (File → Open) |
| `oko-f-v2.3.solidcraft` | poprzednia wersja (review v2.3), bez zmian |
| `../3mf/Oko F v2.4/` | 19 plików 3MF do druku (po naprawie i kontroli siatek) |
| `../narzedzia/` | `sprawdz_siatki.js`, `napraw_siatki.js` (Node.js, bez bibliotek) |
| `png/` | zrzuty v2.4: `zlozenie-tyl`, `zlozenie-przod`, `przekroj`, `kaseta-gora` |

Układ jak w Onshape: oś modułu Z (+Z na zewnątrz dyni, z = 0 to wierzch rantu), oś oka Y (+Y = GÓRA).

## Części (19 plików 3MF)

Gniazdo, Nakretka, Kaseta, Jarzmo z miska, Ciegno, Ramie orczyka, Tulejka przegubu korby, Tulejka przegubu ramienia, Sanki serwa, Pokrywa tylna, Przyrzad do wklejania pileczki, Przyrzad centrowania orczyka, **Widelec do zaczepow**, Probka gwintu - gniazdo, Probka gwintu - nakretka luz 0.45, Probka gwintu - nakretka luz 0.6, PODGLAD pileczka 40.5, PODGLAD SG90, PODGLAD orczyk SG90. Każda część to osobny komponent. Pliki są w pozycji złożonej (próbki i przyrządy obok).

## Zasady budowy w SolidCraft 0.15 (wnioski z v2.3)

1. Każde cięcie zaczyna się **0,1 mm przed ścianą** (`start_offset` albo płaszczyzna szkicu poza bryłą). Cięcie od samej ściany zostawia błonę zerowej grubości.
2. Każda suma **nachodzi ≥ 0,1 mm**, nigdy na styk. Żadnych wspólnych ścian walcowych ani krawędzi stykających się w jednym punkcie.
3. Żadnych biegunów obrotu na ścianach: pas miski to obrót wokół osi pasa, wnęka przyrządu to walec + stożek z wyciągnięcia z pochyleniem.
4. **Gwint (`Thread`, ISO) zawsze na końcu.** Po gwincie bryła staje się siatkowa i kolejne operacje zostawiają szczeliny. Przed gwintem wolno robić sumy i proste cięcia, ale nie cięcia obrotowe w pobliżu (przerwy między ząbkami, radełko z czołem stożkowym), bo wtedy gwint się nie liczy.
5. Ściany walcowe z obrotu dzielą się na 3 łaty po 120°. Ścianę wskazywać punktem z dala od szwu (np. 30°).
6. Kolejność cięć ma znaczenie: w zaczepie szczelina skośna musi iść **po** pocienieniu ramienia.
7. Po każdej części: eksport → naprawa → kontrola siatki (niżej).

## Szczelność siatek (powtarzać przy każdej wersji)

```bash
node ../narzedzia/napraw_siatki.js "<eksport z SolidCraft>.3mf" "../3mf/Oko F v2.4/Oko F v2.4 - <czesc>.3mf"
node ../narzedzia/sprawdz_siatki.js "../3mf/Oko F v2.4"
```

- **`sprawdz_siatki.js`** liczy w każdym pliku: otwarte krawędzie (1 trójkąt), krawędzie z więcej niż 2 trójkątami i trójkąty zdegenerowane, po scaleniu wierzchołków co 0,0001 mm. Opcja `--gdzie` podaje miejsca. Kod wyjścia 1, gdy coś nie jest zerem.
- **`napraw_siatki.js`** nie zmienia kształtu. Kolejno:
  - scala wierzchołki,
  - usuwa trójkąty zdegenerowane i „drzazgi” (wysokość < 0,005 mm) przy krawędziach z więcej niż 2 trójkątami,
  - dzieli trójkąty przy T-połączeniach,
  - łata małe zamknięte otwory (obwód < 15 mm) wachlarzem trójkątów zgodnie z orientacją sąsiadów,
  - powtarza to do 3 rund.

  Zapisuje czysty 3MF (jeden obiekt, mm).
- Stan v2.4: **19/19 plików: 0 otwartych, 0 krawędzi > 2, 0 zdegenerowanych.** Naprawy wymagały tylko luki siatkowania płaskich ścian z otworami (czoło kasety z otworami wkładek, jarzmo, próbka gwintu, nakrętka po obrocie). Wady bryły (błony, drzazgi, zakładki) usunąłem w modelu.

## Parametry (Parameters)

**Sterują geometrią:**
- średnice i długości korpusów gniazda i kasety (wymiary szkiców): `rantD`, `otworD`, `gwintD`, `gwintRdzen` (rura za gwintem), `gniazdoID`, `kasetaOD`, `modulID`, `kolnierzykD`, `przodL`, `gniazdoL`, `gniazdoKoniec`, `rantT`, `modulL`, `dyniaR`,
- fazki: `fazkaCzola`, `fazaZwoju`,
- `luzOsiowy`: płaszczyzny występów osi kasety (wyrażenie `kulaDmax/2 + klej + oczkoT + luzOsiowy`),
- `luzSanki`: płaszczyzna spodu sanek,
- otwory i luzy: `m3Ciasny`, `m3Luzny`, `lebD`, `lebH`, `wkladkaD/L/Zapas`, `uchoDno`, `otworDolnyD`, `tulejkaD`, `luzPrzegub`, `kolnierzD/H`, `plytaT`, `m2Otwor`, `serwoWkret`, `dnoWkretu`, `luzTrzpien`, `kulaDmax`, `klej`, `oczkoT`.

**Nie sterują (liczby w szkicach, zmiana wymaga poprawki szkicu):**
- `fazkaWej` (0,8: skosy żebra i rowka),
- `luzGwint`: oznaczenie gwintu nakrętki to tekst (`M63.6x3` = `gwintD` + 2 × `luzGwint`), otwór nakrętki jest wyliczany, ale zarys trzeba przepisać ręcznie,
- wymiary SG90 (11,8 × 22,7, uszy, wałek) i położenia przegubów (kinematyka),
- zaczepy (33° / 213°, haczyki 47° / 227°), okienka, ucha, wybrania C i H,
- otwór w dyni i krzywizna dla ząbków.

## Ograniczenia SolidCraft 0.15

- Gwint tylko ISO (flanki 60°), patrz zasady 4–5. Nakrętka **bez radełka** (radełko + czoło stożkowe psują gwint wewnętrzny), bez faz otworu. Chwyt dają 6 wycięć na klucz, a wejście faza zwoju gniazda.
- Cięcie bywa pominięte z ostrzeżeniem, a nie błędem („that part is ignored”). Po każdej zmianie sprawdzać ostrzeżenia i luzy.
- `face.delete` nie usuwa błon („not implemented”).
- `motion.interference` z kasetą przekracza budżet obliczeń. `inspect.clearance` nie mierzy pary jarzmo–kaseta. Te pary liczone są na siatkach STL (odległość punkt–trójkąt i test wnętrza dwoma promieniami).
- Brak eksportu historii (`solidcraft-cli script`) dla modelu z komponentami (#886).
- Działa dobrze: parametry z wyrażeniami i płaszczyzny konstrukcyjne z wyrażeniem, wymiary szkicu z parametrów, szyki, jointy „as built” z limitami, `joint.drive`, `inspect.clearance` (szybkie), przekroje, zrzuty, eksport 3MF (krok ok. 3°, cięciwa ok. 0,01 mm).
