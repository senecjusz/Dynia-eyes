# Duże oko v3: wytrzymałość słupków płyty

Wynik `narzedzia/duze-oko-v3-slupki.py` na siatce `Plyta` (eksport-v3.sh); metoda, obciążenia i założenia [Z] w nagłówku skryptu.
PLA [Z]: E = 3500 MPa, wytrzymałość wzdłuż warstw 50 MPa, w poprzek 20 MPa. Zapas = wytrzymałość / naprężenie.

## Podsumowanie

Kontekst: decyzja użytkownika 26,10 – nasady słupków pogrubione skosami albo żebrami 45° po płycie; płytę drukuje się pod kątem ok. 45° z projektowaną podporą (`Plyta + podpora (druk 45)`).

**Nasady (`duze-oko-v3.scad`, bez nowych części):**
- **Słupki zawiasu:** żebro po wewnętrznej stronie ramienia, x 30…34,7.
  - Nad płytą pełna wysokość y −20…+5.
  - Przed płytą w dół do spodu płyty w promieniu r ≤ 37,6. Do światła tuby i do kołnierza tuby 50 zostaje 0,55; ramię nadal ma 0,95.
  - Pełne do z = −38, dalej zwęża się skosem do ramienia na z = −20.
- **Słupek kardana:**
  - klocek wydłużony do z = −40;
  - skosy 45° po płycie do x ±14;
  - żebro 5 mm pod słupkiem: od płyty skosem do z = −31, czyli wspornik ze słupka wynosi 17 mm zamiast 37.

**Wynik (szczegóły niżej):**

| Słupek | Najmniejszy zapas w poprzek warstw, druk na płasko | Najmniejszy zapas, druk pod kątem (wytrzymałość w poprzek warstw jako dolna granica) | Ugięcie |
|---|---|---|---|
| Zawias (8,6 N z zablokowanego serwa powieki) | 6,3 (przekrój tuż nad płytą) | 2,9 (ramię z = −14, siła 4,3 N w x od ręki); od sił drutu ≥ 6,3 | 0,09 mm w y; 0,46 mm w x od 4,3 N |
| Kardan (19 N poprzecznie, 31 N osiowo) | 8,1 | 2,9 (z = −36, koniec żebra; ostrożne łączenie osi) | 0,08 mm w y, 0,12 mm w x w środku kuli |

- **Słupki zawiasu wklejone w tubę:** moment przy nasadzie spada do 24 % (tuba 30), 35 % (40) albo 45 % (50) wartości bez kleju.
- **Ciężar gałki** (0,5 N) i **skręcanie od pracy kardana** (ok. 60 N·mm) są pomijalne (< 0,5 MPa).
- **Ugięcie w x 0,46 mm** od siły ręki przekracza luz osiowy ucho–słupek (0,3). Przy montażu nie dociskać ramion na boki; po wklejeniu w tubę słupki trzyma ścianka.

## Słupek zawiasu powiek (prawy, lewy symetryczny)

Obciążenie: 8,6 N na osi zawiasu (z = 0) w y albo w z, 4,3 N w x (ręka przy montażu).

### Przekroje poziome (warstwy przy druku na płasko): naprężenie w poprzek warstw

| y przekroju | pole [mm²] | długość w z [mm] | σ od 8,6 N w y | σ od 8,6 N w z | σ od 4,3 N w x | zapas (w poprzek) |
|---|---|---|---|---|---|---|
| -14,9 | 70 | 15,2 | 2,4 | 0,8 | 3,2 | 6,3 |
| -13,0 | 73 | 15,1 | 2,4 | 0,6 | 2,9 | 6,8 |
| -11,0 | 84 | 17,8 | 1,7 | 0,4 | 2,4 | 8,3 |
| -9,0 | 104 | 23,7 | 1,1 | 0,2 | 1,8 | 10,9 |
| -7,0 | 119 | 30,3 | 0,8 | 0,1 | 1,5 | 13,7 |
| -5,5 | 128 | 35,7 | 0,7 | 0,1 | 1,3 | 15,9 |

### Przekroje pionowe wzdłuż ramienia: naprężenie wzdłuż warstw (druk na płasko)

| z przekroju | pole [mm²] | σ od 8,6 N w y | σ od 4,3 N w x | zapas (wzdłuż) | zapas (w poprzek, druk pod kątem) |
|---|---|---|---|---|---|
| -48 | 119 | 1,2 | 2,0 | 24,8 | 9,9 |
| -42 | 110 | 1,3 | 1,8 | 27,3 | 10,9 |
| -36 | 93 | 1,5 | 1,8 | 27,3 | 10,9 |
| -28 | 65 | 2,1 | 2,3 | 21,7 | 8,7 |
| -20 | 42 | 2,6 | 3,2 | 15,8 | 6,3 |
| -14 | 24 | 3,2 | 7,0 | 7,2 | 2,9 |
| -8 | 24 | 1,7 | 3,6 | 13,9 | 5,6 |
| -2 | 24 | 0,3 | 0,7 | 69,5 | 27,8 |

Ugięcie osi zawiasu (wspornik od przodu płyty, bez kleju w tubie): 0,09 mm od 8,6 N w y, 0,46 mm od 4,3 N w x.

**Wklejone w tubę** (klej przy tylnym brzegu tuby, podparcie przegubowe): moment przy nasadzie M = F·a/2.

| Tuba | klej na z | wysięg a | moment przy nasadzie / bez kleju |
|---|---|---|---|
| 30 | -24 | 24 | 12 / 49 mm·F → 24 % |
| 40 | -34 | 34 | 17 / 49 mm·F → 35 % |
| 50 | -44 | 44 | 22 / 49 mm·F → 45 % |

## Słupek kardana

Obciążenie w środku kuli (z = 0): 19 N poprzecznie (w y albo w x), osiowo 31 N, skręcanie 60 N·mm, ciężar gałki 0,5 N w y.

### Przekroje poziome (warstwy przy druku na płasko): naprężenie w poprzek warstw

| y przekroju | pole [mm²] | długość w z × szerokość w x [mm] | σ od 19 N w y | σ od 19 N w x | σ od 31 N osiowo | zapas (w poprzek) |
|---|---|---|---|---|---|---|
| -14,9 | 322 | 16,6 × 27,8 | 2,0 | 1,1 | 1,0 | 10,2 |
| -13,0 | 286 | 18,5 × 24,0 | 2,2 | 1,2 | 1,0 | 9,3 |
| -11,0 | 248 | 20,3 × 20,0 | 2,3 | 1,3 | 0,9 | 8,8 |
| -9,0 | 210 | 21,7 × 16,0 | 2,3 | 1,6 | 0,7 | 8,6 |
| -7,0 | 172 | 22,6 × 11,9 | 2,3 | 2,5 | 0,6 | 8,1 |

### Przekroje pionowe wzdłuż słupka: naprężenie wzdłuż warstw (druk na płasko)

| z przekroju | pole [mm²] | σ od 19 N (y lub x) | σ osiowe + skręcanie | zapas (wzdłuż) | zapas (w poprzek, druk pod kątem) |
|---|---|---|---|---|---|
| -48 | 300 | 1,7 | 0,2 | 27,4 | 10,9 |
| -44 | 301 | 1,5 | 0,2 | 29,7 | 11,9 |
| -40 | 300 | 1,4 | 0,2 | 32,2 | 12,9 |
| -36 | 148 | 6,5 | 0,4 | 7,2 | 2,9 |
| -32 | 115 | 3,6 | 0,5 | 12,2 | 4,9 |
| -26 | 113 | 2,8 | 0,5 | 14,9 | 6,0 |
| -20 | 113 | 2,3 | 0,5 | 17,9 | 7,2 |
| -16 | 42 | 2,9 | 1,3 | 12,0 | 4,8 |

Ugięcie środka kuli od 19 N (słupek do z = −14,25, dalej kardan sztywny): 0,082 mm w y, 0,120 mm w x.

