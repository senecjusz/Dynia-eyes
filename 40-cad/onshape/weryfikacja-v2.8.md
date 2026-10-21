# E5: weryfikacja v2.8 (śruby M3 w plastik w uszach serwa i w uchach Pokrywy)

21.10.2026, wykonawca CAD.
- **Brief:** `30-projekt/brief-e5-v2.8.md`.
- **Plan:** zatwierdzony przez orkiestratora z wariantem b: `luzKorpusSerwa` 0,7 → 0,4, ścianki przy otworach 0,95.
- **Dokument:** „Oko F v2.5”, Part Studio „Oko F v2.5”.
- **Stan:** `stan-api.json` → `e5`.

**Stan wyjściowy:**
- Microversion b6b8da2d różniła się od mojej ostatniej (580c339a, po E4.4), więc zatrzymałem się (stop).
- Orkiestrator dał +1 GET /features. Pobrane drzewo jest w `odbior-v2.8/features-b6b8da2d.json`.
- Wobec `odbior-v2.6/features-c301a06e.json` różnią się tylko znane zmiany E4.4: 3 usunięte operacje piasty Cięgna oraz nowa nazwa i parametry płaszczyzny, szkicu i Hole Cięgna.
- Variable Studio ma skrót SHA-256 zgodny ze stanem oczekiwanym po E4.4.
- Model był więc bez zmian. Prawdopodobnie zmieniła się widoczność (Gniazdo i Pokrywa są ukryte w karcie) albo zwinięcie folderów.

**API:** 17 wywołań (budżet 30), `GET /features` 2 (budżet 1 + 1). Suma w roku 541 + 17 = 558. Bez 429/402, bez blokad bramki.

## Zmiany

**Zmienne** (dwa zapisy: liczby, potem wyrażenia; trzeci zapis usuwa zmienne):

| Zmienna | Było | Jest | Wartość |
|---|---|---|---|
| `uchoSg90T` | – | nowa | 2,5 |
| `srubaUchaL` | – | nowa (M3×10) | 10 |
| `srubaUchaZapas` | – | nowa | 0,5 |
| `wkretSerwaD` | 2 mm | `#m3Ciasny` | 2,6 |
| `wkretSerwaGl` | 6 mm | `#srubaUchaL - #uchoSg90T + #srubaUchaZapas` | 8,0 |
| `luzKorpusSerwa` | 0,7 mm | 0,4 mm | `blokZ2` 49,0, `szczelinaSerwaZ` 49,0, `klamraZ1` 72,3 |
| `pokrywaSrubaL` | – | nowa (M3×8) | 8 |
| `pokrywaSrubaZapas` | – | nowa | 0,6 |
| `uchoSzer` | `#wkladkaD + 2 * #uchoScianka` | 7,6 mm | 7,6 (bez zmiany geometrii) |
| `uchoL` | `#wkladkaL + #wkladkaZapas + #uchoDnoMin` | 5,2 mm | 5,2 (bez zmiany geometrii) |

- **Usunięte zmienne:** `wkretKanalSzer`, `wkretKanalPolSzer`, `wkretKanalGl`, `wkretKanalFazka`, `wkretKanalZ2`, `wkladkaD`, `wkladkaL`, `wkladkaZapas`, `uchoDno`, `uchoDnoMin`.
- Variable Studio ma teraz 373 zmienne. Żadna operacja ani zmienna nie odwołuje się do usuniętych (sprawdzone w JSON drzewa po zmianach).

**Operacje:**

| Operacja | Zmiana |
|---|---|
| `Kaseta: fazka kanału wkrętu`, `Kaseta: kanał wkrętu` | usunięte (2 × DELETE) |
| `Kaseta: wkręty serwa szkic` | prostokąt kanału usunięty (k1–k4, 12 więzów); zostały punkty pP (z −`#serwoUchoZ1`) i pT (z −`#serwoUchoZ2`) na `osZ` |
| `Kaseta: otwór wkrętu przedniego`, `Klamra H: otwór wkrętu tylnego` | bez edycji; Hole biorą wspólne `#wkretSerwaD`, `#wkretSerwaGl` |
| `Kaseta: otwory wkładek` → **`Kaseta: otwory śrub Pokrywy`** | Hole SIMPLE Ø`#m3Ciasny`, głębokość `#pokrywaSrubaL - #pokrywaT + #pokrywaSrubaZapas` |
| `Klamra H: fazki wejściowe` | punkty krawędzi z −72,6 → −72,3 (nowe czoło Klamry) |

## Pomiary (bodydetails, massproperties)

### Blok przedni Kasety

- **Otwór:** R1,3 (Ø2,6) w (0; −46,75), y −17,6…−25,6, czyli **głębokość 8,0**, dno płaskie.
- **Kanał i fazka:** brak żadnej ściany kanału ani fazki w obszarze bloku.
- **Siedzisko:** y −17,6, x ±2,75, z −45,2…−49,0 (15,59 mm²).
- **Czoło bloku i koniec szczeliny SG90:** jedna płaszczyzna z **−49,0** (x ±6,6, y −27,25…−17,6, 76,34 mm²). Na z −48,7 nie ma już ściany.
- **Ścianki wokół otworu:**

  | Strona | Ścianka | Rachunek |
  |---|---|---|
  | tył (do korpusu serwa i szczeliny) | **0,95** | 49,0 − 48,05 |
  | boki x | **1,45** | 2,75 − 1,3 |
  | przód przy siedzisku | 0,25, rośnie 1:1 po skosie 45°; 1,2 już 0,95 pod siedziskiem | 45,45 − 45,2 |
  | dno do zewnętrznej powierzchni (x 0) | **1,65** | 27,25 − 25,6; od siedziska do zewnątrz jest 9,65 |

- **Śruba M3×10:** ucho 2,5, w plastiku 7,5 (y −17,6…−25,1), 0,5 do dna otworu.

### Klamra H

- **Czoło:** z **−72,3** (204,88 mm² po fazkach), tył −77,5 (213,91 mm²).
- **Otwór:** R1,3 w z −74,55 (z −73,25…−75,85), y −17,6…−25,6, czyli **głębokość 8,0**. Klamra przy x 0 jest pełna do y −30,5.
- **Ścianki:** przód **0,95** (73,25 − 72,3), tył 1,65 (77,5 − 75,85).

### Ucha Pokrywy (+X i −X zmierzone osobno)

- **Otwory:** R1,3 (Ø2,6) na x ±20,45, z −77,5…−71,9, czyli **głębokość 5,6**, stożek 118° do −71,12. Oba takie same.
- **Dno do skosu ucha** (skos z = −72,3 + (x − 16,65)):
  - przy wewnętrznej krawędzi otworu (x 19,15) skos jest na z −69,8, czyli 2,1 nad dnem w pionie i **1,48 prostopadle** (było 0,85);
  - na osi 1,85.
- **Ścianki ucha wokół otworu:** (7,6 − 2,6)/2 = **2,5**.
- **M3×8 przez Pokrywę 3:** końcówka na z −72,5, do dna 0,6.

### Serwo

- **Kieszeń korpusu:** z −49,0…−72,3 (23,3). Korpus SG90 (z −49,4…−71,9) ma **0,4 z przodu i 0,4 z tyłu**, także na końcu szczeliny.
- **Wsuwanie od tyłu:** pod przednim uchem nic nie wystaje, bo śrubę M3×10 wkłada się przez okno po wsunięciu. Ucho jedzie po siedzisku y −17,6, a czoło bloku i koniec szczeliny są na z −49,0.

### Objętości 10 brył (mm³)

| Część | v2.7 | v2.8 | Δ | rachunek |
|---|---|---|---|---|
| Kaseta | 34984,42 | 35112,19 | **+127,77** | ucha: 2 × (Ø4,4 × 5,6 + stożek 91,8 → Ø2,6 × 5,6 + stożek 31,1) = +121,5; kanał z fazką ≈ +7,1; czoło bloku i szczelina 0,3 dalej ≈ +21,3; otwór przedni Ø2 × 6 → Ø2,6 × 8 = −23,6; razem ≈ +126 |
| Klamra H | 1027,53 | 1068,07 | **+40,54** | 0,3 × przekrój 213,9 = +64,2; otwór Ø2 × 6 → Ø2,6 × 8 = −23,6; razem +40,6 |
| Gniazdo | 28880,39 | 28880,39 | 0 | |
| Nakrętka | 7383,37 | 7383,37 | 0 | |
| Jarzmo z miską | 1822,63 | 1822,63 | 0 | |
| Ramię orczyka | 793,76 | 793,76 | 0 | |
| Cięgno | 407,99 | 407,99 | 0 | |
| Tulejki ×2 | 76,78 / 76,78 | 76,78 / 76,78 | 0 | |
| Pokrywa tylna | 6947,17 | 6947,17 | 0 | |

partId części za Kasetą zmieniły się po usunięciu operacji, nazwy zostały.

## K1–K11 (Kaseta, Klamra H)

| # | Wynik | Dane |
|---|---|---|
| K1 | zaliczone | 3 edycje OK, 2 × DELETE 200; `GET /features` po zmianach: 154 operacje, `featureStates` puste; w drzewie 0 ikon błędu i ostrzeżenia; 10 brył |
| K2 | zaliczone | edytowany `Kaseta: wkręty serwa szkic` w pełni zdefiniowany (znacznik w drzewie, data-id Mw4jXvvYzngP7JfYK) |
| K3 | zaliczone | nowe wyrażenia tylko ze zmiennych; w szkicu zostały wymiary `#serwoUchoZ1`, `#serwoUchoZ2` |
| K4 | zaliczone | 0 Fix; punkty pP, pT na `osZ` z wymiarem pionowym od początku układu |
| K5 | zaliczone | ucha: Mirror (oba otwory zmierzone osobno); otwory uszu serwa: wspólne zmienne, dwie Hole w dwóch częściach |
| K6 | zaliczone | Kaseta 28 → 26 operacji bryłowych (−kanał, −fazka); Klamra 3 bez zmian |
| K7 | zaliczone | nowe zmienne przed użyciem (VS kolejno) |
| K8 | zaliczone | szkic na `Kaseta: pl. siedziska serwa` bez zmian |
| K9 | nie wykonane | w budżecie E5 nie było na to wywołań; zależności są proste (`wkretSerwaGl`, `luzKorpusSerwa` sprawdzone pomiarem) |
| K10 | do użytkownika | nowa nazwa: `Kaseta: otwory śrub Pokrywy`; nazwy zmiennych w tabeli wyżej |
| K11 | zaliczone | foldery Kaseta (64), Klamra H (4) |

## Druk

- **Kaseta czołem na stole:** otwór Ø2,6 w bloku leży poziomo (oś Y). Jego „sufit” to strona z −48,05, ze ścianką 0,95. Mały okrągły otwór drukuje się bez podpór, zwis rzędu 0,1, a śruba M3 wcina się w niego i tak.
- **Ucha:** otwory Ø2,6 są pionowe (oś Z), bez nawisu.
- **Klamra H profilem na stole:** otwór w osi Y, czyli poziomo; tak samo bez podpór.

**Werdykt:** v2.8 zgodne z briefem i zatwierdzonym planem (wariant b). Gotowe do eksportu: Kaseta, Klamra H.
