# Duże oko v3: wytrzymałość słupków płyty

Wynik `narzedzia/duze-oko-v3-slupki.py` na siatce `Plyta` (eksport-v3.sh); metoda, obciążenia i założenia [Z] w nagłówku skryptu.
PLA [Z]: E = 3500 MPa, X = 50 MPa wzdłuż warstw, Y = 20 MPa w poprzek, S = 20 MPa; naprężenie pod kątem 45° do warstw: R = 28,3 MPa (Tsai–Hill). Zapas = R / σ zastępcze.

## Podsumowanie

Kontekst: decyzja użytkownika 26.10. Nasady słupków są pogrubione skosami albo żebrami po płycie. Płytę drukuje się pod 45° z projektowaną podporą (`Plyta + podpora (druk 45)`), z wypełnieniem 100 % (albo ≥ 5 ścianek). Poprawki po recenzji Opusa i Astry (`20-analizy/review/2026-10-26-slupki-{opus,astra}.md`).

**Nasady (`duze-oko-v3.scad`, bez nowych części):**
- **Słupki zawiasu:** żebro po wewnętrznej stronie ramienia, x 30…34,7.
  - Nad płytą sięga od y −20 do +5.
  - Przed płytą schodzi do spodu płyty, ale tylko w promieniu r ≤ 37,2, czyli 0,95 do tuby, tyle co ramię.
  - Do z = −38 ma pełną wysokość. Dalej skos zwęża się w sposób ciągły do zera na ramieniu na z = −12, więc nie ma uskoku przekroju (wcześniej spadek z 40,9 do 23,9 mm² na z = −20).
- **Słupek kardana:**
  - klocek do z = −40;
  - skosy 45° po płycie do x ±14;
  - żebro 5 mm pod słupkiem do z = −31.

**Obciążenia z kinematyki:** F = T / |e·(r × u)|, T = 216 N·mm. Wychodzi: L–P 18,6 N, G–D 21,1 N, powieka górna 11,1 N, dolna 10,7 N.
- **Kardan:** osiowo do 53,9 N, poprzecznie do 16,6 N. Obie siły prętów działają naraz, z siłą oparcia zablokowanej gałki; bez oparcia osiowo jest 39,4 N.
- **Słupek zawiasu:** siła drutu powieki działa głównie wzdłuż ramienia (z).
  - Obwiednia skrajna to przypadek D: powieka zablokowana oparciem na krawędzi, a cała siła przechodzi na jeden słupek. Daje to 22,0 N (y 13,5, z 21,7).
  - Rozdział na dwa słupki dźwignią (A) daje 10,8 N.

**Najmniejsze zapasy** (zginanie dwukierunkowe policzone dla każdego wektora siły osobno, przekroje co 0,5 mm):

| Słupek | druk płasko | druk 45° (Tsai–Hill, 28,3 MPa) | druk 45°, dolna granica (20 MPa) | druk 45°, ≥ 5 ścianek bez wypełnienia |
|---|---|---|---|---|
| Zawias, przypadek A (realny rozdział) | 15,6 | 22,1 | 15,6 | 22,1 |
| Zawias, przypadek D (obwiednia skrajna) | 2,7 | 3,8 | 2,7 | 3,8 |
| Kardan | 6,3 | 7,0 | 4,9 | 6,0 |

- **Najsłabsze miejsca:** zawias w przekroju y = −14,9 tuż nad płytą (żebro), kardan na z ≈ −19 (ścianka gniazda łba M5).
- **Druk pod 45° wobec druku na płasko:**
  - Przy nasadach zawiasu druk pod 45° jest korzystniejszy, bo przekroje poziome przy druku na płasko pracują w poprzek warstw.
  - W ramieniu i w słupku kardana jest gorszy: zamiast wzdłuż warstw (50 MPa) pracują pod 45° (28,3 MPa, dolna granica 20).
  - Przy dolnej granicy najmniejszy zapas wynosi 2,7 dla zawiasu i 4,9 dla kardana.
- **Ręka w x (kierunek słaby ramienia):** ramię pęka przy sile na osi zawiasu 37,9 N przy druku na płasko oraz 21,4 N przy druku pod 45° (dolna granica 15,1 N, z = −12). Przed poprawką było to 12,6–17,6 N. Przy montażu nie wolno zginać ramion na boki ani odchylać ścianek podpory pod nimi (instrukcja odłamywania w montaz.md §1).
- **Ugięcie:**
  - oś zawiasu 0,076 mm/N w x, czyli 0,33 mm od 4,3 N; to więcej niż luz osiowy ucha (0,3);
  - środek kuli 0,07 mm w y i 0,10 mm w x.
- **Klej w tubie** podpiera ramię na z = −24 / −34 / −44. Zmniejsza moment przy nasadzie, ale nie w przekrojach ramienia przed klejem, więc najsłabszego przekroju nie zmienia (Opus W3). Wcześniejsze procenty 24/35/45 % dotyczyły tylko nasady i zostały usunięte.
- **Wypełnienie:** wszystkie zapasy w tabeli dotyczą przekroju pełnego, czyli wypełnienia 100 %. Ostatnia kolumna to dolna granica dla 5 ścianek bez wypełnienia. Przy 2 ściankach i 15 % słupek kardana traci ok. 55 % I (Opus W4).

## Obciążenia z kinematyki

- Największa siła w drucie przy zablokowanym serwie (T = 216 N·mm): pręt L–P 18,6 N, pręt G–D 21,1 N, drut powieki górnej 11,1 N, dolnej 10,7 N.
- Kardan (obie siły prętów naraz, w środku kuli): osiowo (z) do 53,9 N, w x do 16,5 N, w y do 16,1 N (z siłą oparcia gałki), poprzecznie do 16,6 N; skręcanie do 36 N·mm.
- Prawy słupek zawiasu, przypadek A (rozdział dźwignią na dwa słupki): |F| do 10,8 N (x 0,5, y 2,3, z 10,7 N).
- Prawy słupek zawiasu, przypadek B (cała siła jednej powieki): |F| do 11,1 N (x 0,6, y 2,6, z 10,7 N).
- Prawy słupek zawiasu, przypadek C (obie powieki całą siłą): |F| do 21,6 N (x 1,0, y 4,4, z 21,5 N).
- Prawy słupek zawiasu, przypadek D (powieka zablokowana oparciem, całość na jeden słupek): |F| do 22,0 N (x 0,6, y 13,5, z 21,7 N).

## Słupek zawiasu powiek (prawy, lewy symetryczny)

Przypadki obciążeń A–D jak wyżej, na osi zawiasu (x = 36, z = 0). „45°, 5 ścianek”: druk pod 45°, ≥ 5 ścianek bez wypełnienia; pozostałe kolumny dla wypełnienia 100 %.

### Przekroje poziome przy nasadzie (nad płytą)

| y | pole [mm²] | σ A [MPa] | zapas płasko | zapas 45° | zapas 45° dolna granica | zapas 45°, 5 ścianek | σ B [MPa] | zapas płasko | zapas 45° | zapas 45° dolna granica | zapas 45°, 5 ścianek | σ C [MPa] | zapas płasko | zapas 45° | zapas 45° dolna granica | zapas 45°, 5 ścianek | σ D [MPa] | zapas płasko | zapas 45° | zapas 45° dolna granica | zapas 45°, 5 ścianek |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| -14,9 | 66 | 1,3 | 15,6 | 22,1 | 15,6 | 22,1 | 1,9 | 10,3 | 14,6 | 10,3 | 14,6 | 2,7 | 7,3 | 10,4 | 7,3 | 10,4 | 7,4 | 2,7 | 3,8 | 2,7 | 3,8 |
| -13,0 | 73 | 0,9 | 21,1 | 29,8 | 21,1 | 28,7 | 1,5 | 13,0 | 18,4 | 13,0 | 17,7 | 2,0 | 9,8 | 13,8 | 9,8 | 13,4 | 6,1 | 3,3 | 4,6 | 3,3 | 4,5 |
| -11,0 | 89 | 0,6 | 34,1 | 48,3 | 34,1 | 46,2 | 1,0 | 20,0 | 28,2 | 20,0 | 26,9 | 1,3 | 15,7 | 22,2 | 15,7 | 21,3 | 3,7 | 5,4 | 7,7 | 5,4 | 7,5 |
| -9,0 | 114 | 0,4 | 52,3 | 74,0 | 52,3 | 71,4 | 0,6 | 30,8 | 43,6 | 30,8 | 41,9 | 0,8 | 24,2 | 34,2 | 24,2 | 33,0 | 1,9 | 10,5 | 14,9 | 10,5 | 14,7 |
| -7,0 | 129 | 0,3 | 61,9 | 87,5 | 61,9 | 84,8 | 0,5 | 37,5 | 53,1 | 37,5 | 51,4 | 0,7 | 28,7 | 40,6 | 28,7 | 39,3 | 1,3 | 14,9 | 21,1 | 14,9 | 20,8 |
| -5,5 | 133 | 0,3 | 66,1 | 93,5 | 66,1 | 90,7 | 0,5 | 40,2 | 56,8 | 40,2 | 55,0 | 0,7 | 30,7 | 43,4 | 30,7 | 42,1 | 1,2 | 16,1 | 22,8 | 16,1 | 22,5 |

### Przekroje poprzeczne wzdłuż ramienia (liczone co 0,5 mm, w tabeli co 2 mm)

| z | pole [mm²] | σ A [MPa] | zapas płasko | zapas 45° | zapas 45° dolna granica | zapas 45°, 5 ścianek | σ B [MPa] | zapas płasko | zapas 45° | zapas 45° dolna granica | zapas 45°, 5 ścianek | σ C [MPa] | zapas płasko | zapas 45° | zapas 45° dolna granica | zapas 45°, 5 ścianek | σ D [MPa] | zapas płasko | zapas 45° | zapas 45° dolna granica | zapas 45°, 5 ścianek |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| -48,5 | 131 | 0,4 | 111,9 | 63,3 | 44,7 | 59,9 | 0,7 | 75,3 | 42,6 | 30,1 | 40,4 | 0,9 | 52,8 | 29,9 | 21,1 | 28,3 | 1,7 | 28,9 | 16,3 | 11,6 | 14,6 |
| -46,5 | 131 | 0,4 | 112,9 | 63,9 | 45,2 | 60,3 | 0,7 | 76,9 | 43,5 | 30,7 | 41,2 | 0,9 | 53,4 | 30,2 | 21,4 | 28,6 | 1,7 | 30,0 | 17,0 | 12,0 | 15,1 |
| -44,5 | 131 | 0,4 | 113,9 | 64,4 | 45,6 | 60,8 | 0,6 | 78,5 | 44,4 | 31,4 | 41,9 | 0,9 | 54,0 | 30,5 | 21,6 | 28,8 | 1,6 | 31,2 | 17,7 | 12,5 | 15,8 |
| -42,5 | 131 | 0,4 | 115,0 | 65,0 | 46,0 | 61,2 | 0,6 | 80,2 | 45,4 | 32,1 | 42,5 | 0,9 | 54,6 | 30,9 | 21,8 | 29,1 | 1,5 | 32,5 | 18,4 | 13,0 | 16,4 |
| -40,5 | 131 | 0,4 | 116,0 | 65,6 | 46,4 | 61,7 | 0,6 | 82,0 | 46,4 | 32,8 | 43,2 | 0,9 | 55,2 | 31,2 | 22,1 | 29,4 | 1,5 | 33,9 | 19,2 | 13,6 | 17,2 |
| -38,5 | 131 | 0,4 | 117,1 | 66,3 | 46,9 | 62,2 | 0,6 | 83,8 | 47,4 | 33,5 | 43,9 | 0,9 | 55,9 | 31,6 | 22,3 | 29,7 | 1,4 | 35,5 | 20,1 | 14,2 | 18,0 |
| -36,5 | 98 | 0,6 | 84,6 | 47,9 | 33,8 | 45,9 | 0,7 | 67,5 | 38,2 | 27,0 | 36,4 | 1,2 | 41,9 | 23,7 | 16,8 | 22,7 | 2,6 | 19,2 | 10,9 | 7,7 | 10,4 |
| -34,5 | 89 | 0,6 | 79,6 | 45,0 | 31,8 | 43,7 | 0,8 | 62,0 | 35,1 | 24,8 | 33,7 | 1,3 | 38,8 | 22,0 | 15,5 | 21,1 | 2,8 | 17,9 | 10,1 | 7,2 | 9,8 |
| -32,5 | 81 | 0,7 | 73,1 | 41,3 | 29,2 | 39,9 | 0,9 | 56,7 | 32,0 | 22,7 | 31,0 | 1,4 | 35,3 | 20,0 | 14,1 | 19,3 | 3,0 | 16,6 | 9,4 | 6,6 | 9,1 |
| -30,5 | 74 | 0,7 | 67,2 | 38,0 | 26,9 | 36,9 | 1,0 | 52,3 | 29,6 | 20,9 | 28,8 | 1,5 | 32,5 | 18,4 | 13,0 | 17,8 | 3,2 | 15,5 | 8,8 | 6,2 | 8,6 |
| -28,5 | 67 | 0,8 | 61,6 | 34,8 | 24,6 | 34,0 | 1,0 | 48,3 | 27,3 | 19,3 | 26,7 | 1,7 | 29,8 | 16,9 | 11,9 | 16,4 | 3,5 | 14,5 | 8,2 | 5,8 | 8,0 |
| -26,5 | 60 | 0,9 | 56,3 | 31,8 | 22,5 | 31,2 | 1,1 | 44,4 | 25,1 | 17,8 | 24,7 | 1,8 | 27,3 | 15,4 | 10,9 | 15,1 | 3,7 | 13,5 | 7,7 | 5,4 | 7,5 |
| -24,5 | 54 | 1,0 | 51,3 | 29,0 | 20,5 | 28,7 | 1,2 | 40,8 | 23,1 | 16,3 | 22,8 | 2,0 | 24,9 | 14,1 | 10,0 | 13,9 | 4,0 | 12,6 | 7,1 | 5,0 | 7,1 |
| -22,5 | 48 | 1,0 | 47,7 | 27,0 | 19,1 | 26,9 | 1,3 | 38,0 | 21,5 | 15,2 | 21,5 | 2,2 | 23,1 | 13,1 | 9,3 | 13,0 | 4,2 | 11,9 | 6,7 | 4,8 | 6,7 |
| -20,5 | 43 | 1,1 | 44,7 | 25,3 | 17,9 | 25,3 | 1,4 | 35,8 | 20,3 | 14,3 | 20,3 | 2,3 | 21,7 | 12,3 | 8,7 | 12,3 | 4,4 | 11,3 | 6,4 | 4,5 | 6,4 |
| -18,5 | 38 | 1,2 | 42,0 | 23,8 | 16,8 | 23,8 | 1,5 | 33,9 | 19,2 | 13,6 | 19,2 | 2,4 | 20,4 | 11,6 | 8,2 | 11,6 | 4,7 | 10,7 | 6,1 | 4,3 | 6,1 |
| -16,5 | 33 | 1,2 | 40,2 | 22,7 | 16,1 | 22,7 | 1,5 | 32,3 | 18,3 | 12,9 | 18,3 | 2,6 | 19,5 | 11,0 | 7,8 | 11,0 | 4,8 | 10,3 | 5,8 | 4,1 | 5,8 |
| -14,5 | 29 | 1,3 | 39,7 | 22,4 | 15,9 | 22,4 | 1,6 | 31,5 | 17,8 | 12,6 | 17,8 | 2,6 | 19,2 | 10,9 | 7,7 | 10,9 | 5,0 | 10,0 | 5,6 | 4,0 | 5,6 |
| -12,5 | 25 | 1,2 | 40,2 | 22,8 | 16,1 | 22,8 | 1,6 | 31,2 | 17,7 | 12,5 | 17,7 | 2,6 | 19,5 | 11,0 | 7,8 | 11,0 | 5,1 | 9,8 | 5,6 | 3,9 | 5,6 |
| -10,5 | 24 | 1,1 | 43,9 | 24,9 | 17,6 | 24,9 | 1,5 | 33,8 | 19,1 | 13,5 | 19,1 | 2,4 | 21,3 | 12,0 | 8,5 | 12,0 | 4,5 | 11,2 | 6,3 | 4,5 | 6,3 |
| -8,5 | 24 | 1,0 | 48,9 | 27,7 | 19,6 | 27,7 | 1,3 | 39,0 | 22,0 | 15,6 | 22,0 | 2,1 | 23,8 | 13,4 | 9,5 | 13,4 | 3,7 | 13,5 | 7,7 | 5,4 | 7,7 |
| -6,5 | 24 | 0,9 | 55,3 | 31,3 | 22,1 | 31,3 | 1,1 | 45,4 | 25,7 | 18,2 | 25,7 | 1,9 | 27,0 | 15,3 | 10,8 | 15,3 | 2,9 | 17,1 | 9,7 | 6,8 | 9,7 |
| -4,5 | 24 | 0,8 | 63,4 | 35,9 | 25,4 | 35,9 | 0,9 | 54,4 | 30,8 | 21,8 | 30,8 | 1,6 | 31,1 | 17,6 | 12,4 | 17,6 | 2,2 | 23,1 | 13,1 | 9,3 | 13,1 |
| -2,5 | 24 | 0,7 | 74,2 | 42,0 | 29,7 | 42,0 | 0,7 | 67,7 | 38,3 | 27,1 | 38,3 | 1,4 | 36,7 | 20,8 | 14,7 | 20,8 | 1,5 | 32,7 | 18,5 | 13,1 | 18,5 |
| -0,5 | 18 | 0,8 | 63,8 | 36,1 | 25,5 | 36,1 | 0,8 | 61,0 | 34,5 | 24,4 | 34,5 | 1,6 | 31,7 | 17,9 | 12,7 | 17,9 | 1,6 | 32,1 | 18,1 | 12,8 | 18,1 |

**Siła ręki w x (kierunek słaby ramienia), która niszczy najsłabszy przekrój:** druk na płasko 37,9 N (z = -12,0), pod 45° 21,4 N (Tsai–Hill), dolna granica 15,1 N (z = -12,0).

Podatność osi zawiasu (wspornik od przodu płyty, bez kleju w tubie): 0,008 mm/N w y, 0,076 mm/N w x; w przypadku A: 0,02 mm w y, 0,04 mm w x; od 4,3 N ręki w x 0,33 mm.

**Klej w tubie** podpiera ramię dopiero na z = −24 / −34 / −44 (tuba 30 / 40 / 50): zmniejsza moment przy nasadzie, ale nie w przekrojach ramienia przed miejscem kleju, więc nie zmienia najsłabszego przekroju.

## Słupek kardana

Obciążenie: wszystkie wektory sił prętów gałki (obie naraz, oba znaki) z siłą oparcia gałki, w środku kuli, i skręcanie z momentu prętów.

### Przekroje poziome przy nasadzie (nad płytą)

| y | pole [mm²] | σ kardan [MPa] | zapas płasko | zapas 45° | zapas 45° dolna granica | zapas 45°, 5 ścianek |
|---|---|---|---|---|---|---|
| -14,9 | 322 | 2,6 | 7,8 | 11,0 | 7,8 | 8,8 |
| -13,0 | 286 | 2,7 | 7,5 | 10,6 | 7,5 | 9,0 |
| -11,0 | 248 | 2,6 | 7,6 | 10,7 | 7,6 | 9,2 |
| -9,0 | 210 | 2,5 | 7,9 | 11,2 | 7,9 | 8,4 |
| -7,0 | 172 | 3,1 | 6,3 | 9,0 | 6,3 | 6,0 |

### Przekroje poprzeczne wzdłuż słupka (liczone co 0,5 mm, w tabeli co 2 mm)

| z | pole [mm²] | σ kardan [MPa] | zapas płasko | zapas 45° | zapas 45° dolna granica | zapas 45°, 5 ścianek |
|---|---|---|---|---|---|---|
| -48,5 | 440 | 0,8 | 59,9 | 33,9 | 24,0 | 19,2 |
| -46,5 | 440 | 0,8 | 61,3 | 34,7 | 24,5 | 19,6 |
| -44,5 | 440 | 0,8 | 62,8 | 35,5 | 25,1 | 20,1 |
| -42,5 | 440 | 0,8 | 64,3 | 36,4 | 25,7 | 20,5 |
| -40,5 | 440 | 0,8 | 65,9 | 37,3 | 26,4 | 21,0 |
| -38,5 | 172 | 3,7 | 13,7 | 7,7 | 5,5 | 6,5 |
| -36,5 | 156 | 3,6 | 14,0 | 7,9 | 5,6 | 6,6 |
| -34,5 | 140 | 3,5 | 14,4 | 8,1 | 5,7 | 6,8 |
| -32,5 | 124 | 3,4 | 14,6 | 8,3 | 5,9 | 6,9 |
| -30,5 | 113 | 3,3 | 14,9 | 8,5 | 6,0 | 7,0 |
| -28,5 | 113 | 3,1 | 15,9 | 9,0 | 6,4 | 7,4 |
| -26,5 | 113 | 3,0 | 16,9 | 9,6 | 6,8 | 7,8 |
| -24,5 | 113 | 2,8 | 18,1 | 10,3 | 7,2 | 8,4 |
| -22,5 | 113 | 2,6 | 19,5 | 11,0 | 7,8 | 9,0 |
| -20,5 | 113 | 2,4 | 21,1 | 11,9 | 8,4 | 9,7 |
| -18,5 | 42 | 4,0 | 12,6 | 7,1 | 5,0 | 7,1 |
| -16,5 | 42 | 3,6 | 13,7 | 7,8 | 5,5 | 7,8 |
| -14,5 | 42 | 3,3 | 15,0 | 8,5 | 6,0 | 8,5 |

Ugięcie środka kuli (słupek do z = −14,25, dalej kardan sztywny): 0,066 mm w y, 0,099 mm w x.

## Najmniejsze zapasy

| Słupek, przypadek | druk płasko | druk 45° (Tsai–Hill) | druk 45°, dolna granica | druk 45°, ≥ 5 ścianek |
|---|---|---|---|---|
| zawias A | 15,6 (y = -14,9) | 22,1 (y = -14,9) | 15,6 (y = -14,9) | 22,1 (y = -14,9) |
| zawias B | 10,3 (y = -14,9) | 14,6 (y = -14,9) | 10,3 (y = -14,9) | 14,6 (y = -14,9) |
| zawias C | 7,3 (y = -14,9) | 10,4 (y = -14,9) | 7,3 (y = -14,9) | 10,4 (y = -14,9) |
| zawias D | 2,7 (y = -14,9) | 3,8 (y = -14,9) | 2,7 (y = -14,9) | 3,8 (y = -14,9) |
| kardan | 6,3 (y = -7,0) | 7,0 (z = -19,0) | 4,9 (z = -19,0) | 6,0 (y = -7,0) |
