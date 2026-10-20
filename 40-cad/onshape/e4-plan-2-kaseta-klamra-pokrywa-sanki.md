# E4 (v2.6): plan drzewa 2/6–6/6 – Kaseta (5a, 5b, 6), Klamra H (5c), Pokrywa (6), Sanki (5d)

Wykonawca CAD, 20.10.2026. Brief: `30-projekt/brief-e4-v2.6.md`. Do zatwierdzenia. Trzy punkty wymagają decyzji (oznaczone **D1–D3**).

**Układ:** z 0 = wierzch rantu, Kaseta z −1,5…−77,5, ścianka r 24,25–27,25, +Y = góra, szczelina SG90 w dolnej ściance x ±6,6 od z −49,2 do końca.

**Druk Kasety:** czołem (z −1,5) na stole. Wysokość druku rośnie w −z, więc ściana skierowana w +z jest nawisem.

## Zmienne (nowe i zmienione; zapis dwuetapowy, nowe na końcu listy)

| Zmienna | Wyrażenie | Wartość | Do czego |
|---|---|---|---|
| `siedziskoUszuY` | 17,6 mm | 17,6 | siedzisko uszu SG90 (y −17,6), dotąd liczone ze zmiennych Sanek |
| `serwoUchoZ1` | 46,75 mm | 46,75 | przednie ucho (dotąd `sankiOtwor1Z`) |
| `serwoUchoZ2` | `#serwoUchoZ1 + #sg90UchaRozstaw` | 74,55 | tylne ucho |
| `wkretSerwaD` | 2 mm | 2,0 | otwór pod wkręt ucha (brief: start 2,0) |
| `wkretSerwaGl` | 6 mm | 6,0 | głębokość otworu od siedziska (wkręt 5–6; dno wynika z bryły, ≥ 0,6) |
| `wkretKanalSzer` | 2,4 mm | 2,4 | kanał na końcówkę wkrętu (Ø2 + 0,2/str.) |
| `wkretKanalGl` | 4 mm | 4,0 | końcówka wystaje 2,5–3,5 pod ucho, + 0,5 |
| `blokPolSzer` | 2,75 mm | 2,75 | **D1** |
| `blokZ1` | 45,2 mm | 45,2 | czoło bloku na siedzisku (brief: ≤ −45,2) |
| `blokZ2` | 49,2 mm | 49,2 | tył bloku (korpus SG90 od −49,4) |
| `blokY2` | `#kasetaIDR + #kasetaT / 2` | 25,75 | dół bloku w ściance (zakładka) |
| `blokZ0` | `#blokZ1 - (#blokY2 - #siedziskoUszuY)` | 37,05 | początek skosu 45° przy ściance |
| `otworGornyZ3` | `#serwoUchoZ1` | 46,75 | trzeci łuk otworu górnego (oś przedniego wkrętu) |
| `uchoScianka` | 1,6 mm | 1,6 | ścianka wokół wkładki |
| `uchoKat` | 40 deg → **0 deg** | 0 | ucha na ±X (płaszczyzna `#uchoKatPl` = 180°, Mirror Right bez zmian) |
| `uchoSzer` | 8 mm → `#wkladkaD + 2 * #uchoScianka` | 7,6 | szerokość ucha (styczna) |
| `uchoR1` | 26,5 → `#kasetaIDR - #uchoSzer` | 16,65 | wierzchołek ucha w środku Kasety |
| `uchoR2` | 33,5 → `#blokY2` | 25,75 | zakładka w ściankę |
| `uchoR` | 29,5 → `#kasetaIDR - #uchoSzer / 2` | 20,45 | oś wkładki (`uchoX` 20,45, `uchoY` 0) |
| `uchoDno` | 1,6 mm → `#wkladkaZapas` | 0,6 | otwór wkładki = `wkladkaL + uchoDno` = 4,6 (= wkładka + zapas) |
| `uchoDnoMin` | 0,6 mm | 0,6 | dno za otworem |
| `uchoL` | `#wkladkaL + #wkladkaZapas + #uchoDnoMin` | 5,2 | długość ucha na wierzchołku |
| `uchoZ2` | 71 → `#kasetaTylZ - #uchoL` | 72,3 | czoło ucha na r `uchoR1` |
| `uchoZ1` | 64,7 → `#uchoZ2 - (#uchoR2 - #uchoR1)` | 63,2 | koniec skosu 45° na r `uchoR2` |
| `klamraZ1` | 72,1 mm | 72,1 | przód Klamry (korpus do −71,9) |
| `klamraL` | `#kasetaTylZ - #klamraZ1` | 5,4 | długość Klamry |
| `klamraPolSzer` | 9,6 mm | 9,6 | ramiona x ±9,6 |
| `lacznikPolSzer` | `#szczelinaSerwaPolSzer - #luzSanki` | 6,35 | łącznik 12,7 w szczelinie 13,2 |
| `klamraWewR` | `#kasetaIDR - #luzSanki` | 24,0 | ramię wewnętrzne, luz 0,25 do ścianki |
| `klamraZewR1` | `#kasetaODR + #luzSanki` | 27,5 | ramię zewnętrzne od środka (luz 0,25) |
| `klamraZewT` | 3 mm | 3,0 | grubość ramienia zewnętrznego (≤ 3,5; kabel na y −31,4) |
| `klamraZewR2` | `#klamraZewR1 + #klamraZewT` | 30,5 | |
| `klamraFazka` | 0,4 mm | 0,4 | fazki wejściowe |

**Bez zmian:** `luzSanki` i `szczelinaSG90` / `sg90Szer` zostają, bo z nich liczy się okno SG90 w Kasecie (`szczelinaSerwaPolSzer`) i łącznik Klamry.

## Kaseta

### 5a – blok przedni (nowe: płaszczyzna, 2 szkice, 3 operacje bryłowe)

| # | Typ | Nazwa | Wejście |
|---|---|---|---|
| – | Plane LINE_ANGLE | `Kaseta: pl. bloku serwa` | osZ, Front, `90 deg` (szkic: x = +Y, y = Z) |
| S-B1 | Szkic | `Kaseta: blok serwa szkic` | profil y–z: (−17,6; −45,2) → (−17,6; −49,2) → (−25,75; −49,2) → (−25,75; −37,05) → zamknięcie skosem 45° |
| E-B1 | Extrude ADD sym. | `Kaseta: blok serwa` | S-B1, szerokość 2 × `#blokPolSzer`, zakres Kaseta |
| – | Plane offset | `Kaseta: pl. siedziska serwa` | Front, `#siedziskoUszuY` (y −17,6) |
| S-B2 | Szkic | `Kaseta: wkręty serwa szkic` | punkty pP (0; −46,75) i pT (0; −74,55); prostokąt kanału x ±1,2 od z −46,75 do −49,2 − `zapas` |
| E-B2 | Extrude REMOVE | `Kaseta: kanał wkrętu` | prostokąt S-B2, głębokość `#wkretKanalGl` w −Y, zakres Kaseta |
| H-B | Hole SIMPLE (FLAT) | `Kaseta: otwór wkrętu przedniego` | pP, Ø`#wkretSerwaD`, głębokość `#wkretSerwaGl`, zakres Kaseta |

**D1 – szerokość bloku.** Brief: „szerokość jak słupek (x ±9,6)” i „przednia ściana to nawis – fazka 45° albo skos od ścianki”.
- Pełny skos 45° od ścianki do czoła na siedzisku ma 8,15 mm wysokości. Przy x ±9,6 sięgnąłby do z −37,05 i wszedłby w drogę śruby i tulejki C (otwór Ø8,7 w x 7,38, z −36,15 sięga x 3,03) oraz H (x −4,89).
- Sama fazka 45° na krawędzi przy ±9,6 zostawi nawis ok. 6,65 mm w środku.
- **Proponuję blok x ±2,75** (`blokPolSzer`): skos 45° na całej wysokości, bez nawisu i bez podpór. Odstęp od drogi C wynosi 0,28, od H 2,1.
- Siedzisko ucha ma 5,5 mm szerokości, a wkręt dociska ucho do bloku.
- Do decyzji: ±2,75 ze skosem (rekomendacja) albo ±9,6 z nawisem i podporą.

**D2 – kanał kołka.**
- Dolny kanał kołka Jarzma (x ±1,6, y −23,45…−25,05, z −17,9…−78,5) zostaje „bez zmian”, ale blok wypełni go na z −37,05…−49,2.
- Przy wsuwaniu Jarzma od przodu kanał nie pracuje: kołek stoi w szczelinie łukowej na z −18,7, poza blokiem.
- Do decyzji: akceptacja (rekomendacja) albo wycięcie kanału także w bloku (+1 operacja).

**Kanał na końcówkę wkrętu:**
- 2,4 × 4,0 od siedziska, otwarty do tyłu (z −46,75 → −50,2, przez tył bloku);
- pod nim otwór Ø2,0 do głębokości 6,0;
- gwint wkręt robi w ściankach kanału i w otworze poniżej.

**Szyn nie robię.** Korpus prowadzi szczelina (12,2 w 13,2), a od ścianki do środka trzymają blok i Klamra. Szyny weszłyby w drogę Klamrze (x ±9,6 na y −17,6…−24).

**Luzy:**
- do kołnierza tulejki H (R4 wokół x −9,235, z −40,628): najbliżej narożnik bloku (−2,75; −37,05…−45,2), odległość ≥ 6,5;
- do drogi C: 0,28.

### 5b – otwór montażowy (edycja 1 szkicu, bez nowych operacji)

- `Kaseta: otwór górny szkic`: obecny owal o1 (0; −66) – o2 (H′) dostaje trzeci łuk o3 R`#otworGornyR` w (0; −`#otworGornyZ3`). Kontur wypukły: o1, prosta x = +4,5 do o3, o3, styczna o3–o2, o2, styczna o2–o1.
- Jedno okno z −42,25…−70,5; extrude `Kaseta: otwór górny` bez zmian (jeden obszar).
- Kolizje do sprawdzenia: zaczepy 16–52° / 196–232°, występy osi z −8,1…−15,9.

### 6 – ucha wewnątrz (edycja 1 szkicu + zmienne)

- `Kaseta: ucho szkic` przepisany: profil r–z (r 16,65 … 25,75, z −77,5 … −72,3 na wierzchołku, skos 45° do (25,75; −63,2)), 4 odcinki.
- Płaszczyzna `pl. ucha` na 0° (`uchoKat` 0), Extrude sym. `#uchoSzer` 7,6, Mirror Right → ucho na 180°; bez nowych operacji.
- Otwory wkładek (Hole, `Kaseta: wkładki szkic`, punkty `#uchoX`/`#uchoY`) przenoszą się na (±20,45; 0); Ø`#wkladkaD` 4,4, głębokość 4,6, dno 0,6, ścianka 1,6.
- **Kolizje (wartości robocze, potwierdzę pomiarem):**
  - Ramię x ≥ −14,23 wobec ucha od x −16,65: 2,4;
  - Klamra |x| ≤ 9,6;
  - SG90 |x| ≤ 6,1;
  - Jarzmo z ≥ −41,15 wobec ucha od −63,2.

**Operacje bryłowe Kasety:** 24 + 3 (E-B1, E-B2, H-B) = 27 > 15.
- Uzasadnienie: blok to nowa funkcja (bryła, kanał na wkręt, otwór).
- Ucha i otwór montażowy nie dodają operacji.
- Kaseta ma już 9 funkcji, a podział na części nie wchodzi w grę.

## Klamra H (nowa część, folder „Klamra H”)

| # | Typ | Nazwa | Wejście |
|---|---|---|---|
| S-K | Szkic | `Klamra H: profil szkic` | na `Kaseta: pl. tyłu` (z −77,5); kontur H: góra y −17,6 (x ±9,6), łuki R24,0 / R27,5 / R30,5 i pionowe ±9,6 / ±6,35 (12 elementów, 53 więzy = 53 stopnie swobody) |
| E-K | Extrude NEW | `Klamra H` | S-K, `#klamraL` w +Z (do z −72,1) |
| H-K | Hole SIMPLE (FLAT) | `Klamra H: otwór wkrętu tylnego` | pT z S-B2, Ø`#wkretSerwaD`, głębokość `#wkretSerwaGl`, zakres Klamra |
| C-K | Chamfer | `Klamra H: fazki wejściowe` | 6 krawędzi przedniego czoła (z −72,1): łuki R24,0 i R27,5, boki łącznika; `#klamraFazka` |

- **Operacje bryłowe:** 3 ≤ 15.
- **Druk:** profilem H na stole (czoło z −77,5 w dół), wszystkie ściany pionowe; fazki na górze wydruku.
- **Wymiary:**
  - ramię wewnętrzne y −17,6 do R24,0 (4,4–6,4 mm);
  - łącznik 12,7 w szczelinie 13,2 (0,25/str.);
  - ścianka Kasety 3,0 między ramionami 3,5 (0,25/str.);
  - ramię zewnętrzne R27,5–30,5 (y do −30,5 w x 0), nad kablem na y −31,4: 0,9 luzu.

## Pokrywa (edycja 1 szkicu + usunięcie 5 operacji)

- `Pokrywa: płyta szkic` przepisany: tylko okrąg R`#kasetaODR`, bez uch i języka.
- **Usuwam:**
  - `Pokrywa: okno wtyczki szkic` i `Pokrywa: okno wtyczki z zaciskiem`;
  - `Pokrywa: pl. prowadnic kabla`, `Pokrywa: prowadnice kabla szkic`, `Pokrywa: prowadnice kabla`.
- `Pokrywa: otwory śrub` bez zmian: punkty z `Kaseta: wkładki szkic` przechodzą na (±20,45; 0), Ø`#m3Luzny`.
- **Operacje bryłowe:** 4 → 2.

## Sanki (usunięcie)

- 8 operacji z folderu „Sanki serwa” (DELETE featureid ×8, od końca) i sam folder, który zniknie w interfejsie.
- **Zmienne usuwane:** `sankiOparcieY`, `sankiSpodY`, `slupkiH`, `prowadnicaH`, `sankiPolSzer`, `sankiZ1–Z4`, `sankiProwZ1/Z2`, `prowadnicaWewX`, `fazkaSanek`, `sankiGoraY`, `sankiOtwor1Z/2Z`, `serwoWkret`, `sankiOtworGl`; najpierw sprawdzam, że nic ich nie używa.
- **Zmienne zostają:** `luzSanki`, `szczelinaSG90`, `sg90Szer`, `sg90UchaRozstaw`, `dnoWkretu`.

**D3 – kolejność.** Brief każe usunąć Sanki na końcu. Usunę je przed Kasetą 5a, bo blok i Klamra zajmują miejsce Sanek (inaczej powstanie przenikanie dwóch brył i pomiary luzów będą fałszywe). Proszę o zgodę na kolejność: Gniazdo, Cięgno, Sanki, Kaseta, Klamra H, Pokrywa.

## Pomiary (raport `weryfikacja-v2.6.md`)

- **Serwo:** siedzisko obu uszu y −17,6 (blok i Klamra); otwory Ø2,0 w (0; −46,75) i (0; −74,55).
- **Kanał wkrętu:** luz końcówki 0,2/str.
- **Klamra:** luzy do ścianki 0,25 (oba ramiona) i do szczeliny 0,25; nad kablem 0,9.
- **Wkręty M2 a Ramię na ±33°:** łby na y −17,6 + 2,5 (ucho) + łeb ok. 1,3 = do y −13,8; Ramię y ≥ −4,5. Odstęp > 9, policzę z położeń.
- **Ucha:** Ø4,4, ścianka 1,6, dno 0,6; kolizje z napędem przy ±33° i przy wsuwaniu od przodu; Klamra i ucha się nie spotykają.
- **Okno montażowe:** z −42,25…−70,5, kolizje z zaczepami i występami.

## Budżet API (etapy 2–6)

| Pozycja | Wywołania |
|---|---|
| VS (2 zapisy) + microversion | 3 |
| Sanki: DELETE ×8 | 8 |
| Kaseta: zapisy (płaszczyzny, szkice, operacje, edycje) | ok. 10 |
| Klamra: zapisy + nazwa części | ok. 6 |
| Pokrywa: edycja + DELETE ×5 | 6 |
| pomiary | ok. 6 |
| K1–K8 (`GET /features` ×2) i K9 (ok. 5) | 7 |
| rezerwa | 10 |
| **razem** | **ok. 56**; z Gniazdem (12) ok. 70 z 120, `GET /features` 2–3 z 4 |
