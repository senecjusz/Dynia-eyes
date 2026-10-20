# E4: weryfikacja v2.6 (K1–K11, pomiary, luzy)

20.10.2026, wykonawca CAD.
- **Dokument i workspace:** „Oko F v2.5” (did `21ca65b874071b352b43ebad`), workspace Main.
- **Wersja przed zmianami:** „v2.5” (id `bb09244e0f82f3195ab3952e`), stan wydrukowany 19.10.
- **Brief:** `30-projekt/brief-e4-v2.6.md`.
- **Plany:** `e4-plan-1-gniazdo-ciegno.md`, `e4-plan-2-kaseta-klamra-pokrywa-sanki.md` (zatwierdzone, D1–D3 tak).
- **Stan:** `stan-api.json` → `e4`.

**API:** 62 wywołania (budżet 120), `GET /features` 1 (budżet 4). Suma w roku 443 + 62 = 505. Bez 429/402, bez wywołań poza bramką. Zmienne dopisywane dwuetapowo, usuwane jednym zapisem.

## Status części

| Część | Status | V [mm³] v2.5 → v2.6 | Zmiany |
|---|---|---|---|
| Gniazdo | **gotowe do eksportu** | 32576,96 → 28958,71 | rant Ø67,5, ząbki przy ściance przodu, strzałka GÓRA od `rantD`, bruzdy pod łby (para Mirror) |
| Cięgno | **gotowe do eksportu** | 599,30 → 575,02 | `wkladkaD` 4,4 |
| Kaseta | **gotowe do eksportu** | 35048,59 → 35042,78 | blok przedni, kanał i otwór wkrętu, okno montażowe, ucha wewnątrz (±X), wkładki Ø4,4 |
| Klamra H | **gotowe do eksportu** (nowa) | – → 1134,48 | nowa część, folder „Klamra H” |
| Pokrywa tylna | **gotowe do eksportu** | 7963,33 → 6947,17 | dysk R27,25 × 3 z dwoma otworami Ø3,3 |
| Sanki serwa | usunięte | 1052,11 → – | 8 operacji, 18 zmiennych, folder |
| Nakrętka, Jarzmo, Ramię, Tulejki | bez zmian | 7383,37 / 1822,63 / 793,76 / 76,78 ×2 | – |

## Pomiary (bodydetails)

### Gniazdo

- **Rant:** krawędź R33,75 od z −1 do −3,846. Spód to sfera R150 (412,09 mm², z −3,846…−3,399), fazka 1 × 45° od r 32,75.
- **Ząbki:** 8 szt. R31,5…33,0 na k·45° (ściany R33 na −179,2 … 135,8°), dół z −4,699, góra na spodzie rantu (z −3,675 przy r 33).
- **Strzałka GÓRA:** dno z −0,5, pole 8,36 mm², czyli cały trójkąt 4,4 × 3,8 / 2. Zakres y 28,2…32,0, x ±2,2; wierzchołek 0,75 przed fazką.
- **Bruzdy, zmierzone osobno:**
  - dwie ściany R28,55, +Y i −Y, każda 271,57 mm²;
  - boki x ±3,65, 4 ściany po 39,11 mm²;
  - końce płaskie z −8,6, 2 ściany po 7,687 mm²;
  - zasięg z −45,7 (otwarty koniec) do −8,6.
- **Kąty bruzd:**
  - przy r 27,5: 82,4–97,6° i 262,4–277,6°;
  - okienka 40–54° / 220–234°: brak kolizji;
  - żebro 131–139°: brak kolizji;
  - ząbek na 90° (z −3,7…−4,7) i strzałka (z 0…−0,5): brak kolizji, bruzda zaczyna się na z −8,6.
- **Ścianka pod bruzdą** (R28,55 do rdzenia R29,45): **0,90** w strefie za gwintem (z −36,7…−45,7) i między zwojami. W strefie przodu (z −8,6…−15) ścianka do R31,5 ma 2,95.

### Cięgno

- Gniazda R2,2 (Ø4,4) w C i H, y 0,7…5,3 (głębokość 4,6), dno 1,0 (płyta od y −0,3).
- Ścianka piasty (7,6 − 4,4)/2 = 1,6; odstęp Cięgno–Ramię/korba 0,2 bez zmian.
- ΔV −24,28 = 2 · π/4 · (4,4² − 4,0²) · 4,6.

### Kaseta

- **Blok przedni:**
  - siedzisko y −17,6, x ±2,75, z −45,2…−49,2 (14,55 mm²);
  - skos 45° (normalna (0; 0,707; 0,707)) od czoła na siedzisku do ścianki na z −37,75 (y −25,05);
  - boki x ±2,75 (47,06 mm²).
- **Kanał końcówki wkrętu:** x ±1,2, dno y −21,6, z −46,75…−49,2, otwarty przez tył bloku.
- **Otwór wkrętu przedniego:** R1,0 w (0; −46,75), y −17,6…−23,6, dno płaskie. Pod dnem zostaje 3,65 do zewnętrznej powierzchni.
- **Okno montażowe:**
  - łuki R4,5 w (0; −66), (0; −46,75), (−4,446; −53,784);
  - jedno okno z **−42,25…−70,5**, szerokość **9,0** w osi wkrętu przedniego (x ±4,5), największy zasięg x −8,95…4,5 przy H′;
  - na r 24–27 kąty 79–108°: zaczepy (16–52° / 196–232°) i występy osi (z −8,1…−15,9) bez kolizji;
  - przez 3,45 mm (z −42,25…−45,7) okno leży pod końcem Gniazda, w zasięgu bruzdy; obie przestrzenie są puste, więc to nieszkodliwe.
- **Ucha Pokrywy, zmierzone osobno** (+X i −X):
  - r 16,65…24,25 (25,75 w ściance), y ±3,8;
  - skos 45° od (16,65; −72,3) do (24,25; −64,7), 80,61 mm² każdy;
  - czoło na stole przy z −77,5.
- **Gniazda wkładek uch:**
  - R2,2 na x ±20,45, y 0, z −77,5…−72,9 (głębokość 4,6), stożek 118° do −71,58;
  - dno do skosu ≥ 2,2 przy wewnętrznej krawędzi otworu, 3,07 na osi;
  - ścianki 1,6: do r 16,65, do ścianki r 24,25 i do boków y ±3,8.

### Klamra H

- **Obrys:** x ±9,6, y −30,5…−17,6, z −77,5…−72,1.
- **Ramię wewnętrzne:** od y −17,6 do R24,0 (grubość 6,4 przy x 0, 4,4 przy x 9,6).
- **Łącznik i ramię zewnętrzne:** łącznik x ±6,35 (R24,0…27,5); ramię zewnętrzne R27,5…30,5, x ±9,6.
- **Fazki wejściowe 0,4:** 6 ścian (łuki R24 ×2, R27,5 ×2, boki łącznika ×2), z −72,1…−72,5.
- **Otwór wkrętu tylnego:** R1,0 w (0; −74,55), y −17,6…−23,6, dno płaskie.

### Pokrywa

Dysk R27,25, z −77,5…−80,5; otwory R1,65 na x −20,45 i +20,45 (y 0), oba zmierzone osobno. Bez uch, okna, zacisku, prowadnic i języka.

## Luzy i rachunki

| Para | Luz | Rachunek |
|---|---|---|
| Łeb M3 użytkownika (2,45) w bruździe, Kaseta w osi | 0,55 (środek) / 0,38 (naroże) | wierzch łba r 25,55 + 2,45 = 28,0, naroże √(28,0² + 3,1²) = 28,17; dno 28,55 |
| j.w., Kaseta przesunięta o 0,25 | 0,30 / 0,13 (przyjęte w briefie) | 28,25 / 28,42 |
| Łeb w bruździe – boki | 0,55 | 3,65 − 3,1 |
| Największy łeb, który przejdzie | ≈ 2,75 | 28,55 − 0,25 − 25,55 |
| Blok – otwór dolny C (krawędź x 3,032) | **0,28** | 7,382 − 4,35 − 2,75 |
| Blok – kołnierz tulejki C (Ø8 w x 7,382) | **0,63** | 7,382 − 4,0 − 2,75 |
| Blok – otwór dolny H / kołnierz H | 2,14 / 2,49 | 9,235 − 4,35 − 2,75; 9,235 − 4,0 − 2,75 |
| Końcówka wkrętu M2 (Ø2, do 3,5 pod uchem) w kanale | 0,2 na stronę, 0,5 pod końcówką | kanał 2,4; dno y −21,6 wobec −17,6 − 3,5 |
| Klamra: ramię wewnętrzne – ścianka | 0,25 | R24,0 wobec 24,25 |
| Klamra: ramię zewnętrzne – ścianka | 0,25 | R27,5 wobec 27,25 |
| Klamra: łącznik – szczelina | 0,25 na stronę | 6,35 wobec 6,6 |
| Klamra – kabel SG90 (y −31,4…−32,8) | 0,9 | ramię zewnętrzne do y −30,5 (x 0) |
| Klamra – korpus SG90 (koniec z −71,9) | 0,2 osiowo | przód Klamry z −72,1 |
| Ucha – Ramię na ±33° | ≥ 11 | przy z −64,7…−77,5 Ramię ma tylko piastę R5,5 wokół (0; −66); koniec H przy +33° ma z ≥ −49,75 |
| Ucha – Jarzmo (także przy wsuwaniu od przodu) | brak przecięcia | Jarzmo z ≥ −41,15, ucha z ≤ −64,7 |
| Ucha – Klamra H | 13,8 | Klamra y ≤ −17,6, ucha \|y\| ≤ 3,8 |
| Łby M2 uszu – Ramię na ±33° | ≈ 9,3 | łeb do y −17,6 + 2,5 + 1,3 = −13,8; Ramię y ≥ −4,5 |
| Siedzisko obu uszu | y −17,6 | blok i Klamra mają wierzch na `#siedziskoUszuY` |

**Wypływka po wtopieniu wkładek w Cięgnie:**
- Objętość wypychana na wkładkę spada z 28,3 mm³ (Ø4,0) do 17,7 mm³ (Ø4,4), licząc π/4 · (5² − D²) · 4.
- Nad piastami Cięgna (y > 5,3) w modelu nic nie ma, więc wał plastiku u góry nie koliduje i można go zdjąć nożykiem.
- Pod piastą jest dno 1,0 i otwór Ø3,3. Luz 0,2 między płytą a Ramieniem i korbą to miejsce, które może zająć wybrzuszone dno. Tego nie da się sprawdzić bez wtopienia.

**DFAM (druk Kasety czołem na stole, wysokość w −z):**
- skos bloku i skosy uch to 45° (normalne ±0,707 w z), bez nawisu ponad 45°;
- Klamra drukowana profilem H na stole: wszystkie ściany pionowe, fazki na górze wydruku;
- bruzdy Gniazda (druk rantem na stole) to pionowe kanały z podłogą na z −8,6;
- Pokrywa: płaski dysk.

## K1–K11

| # | Wynik | Dane |
|---|---|---|
| K1 | zaliczone | każdy zapis `featureStatus` OK (18 operacji nowych i edytowanych); w drzewie 0 ikon błędu i ostrzeżenia (także `list-warning-inside` na folderach) po każdym etapie i po K9 |
| K2 | zaliczone | 10 szkiców nowych i edytowanych, wszystkie w pełni zdefiniowane: bruzda, ucho, otwór górny, blok, wkręty, profil Klamry, płyta Pokrywy (+ ząbek i profil Gniazda przez zmienne) |
| K3 | zaliczone | w 18 nowych i zmienionych operacjach tylko `#zmienne` i stałe dozwolone (`0`, `90 deg`, `360 deg`, `2` w parach); `GET /features` |
| K4 | zaliczone | 0 więzów Fix w nowych i edytowanych szkicach |
| K5 | zaliczone | bruzdy: Mirror Front (powielenie potwierdzone pomiarem obu ścian); ucha: Mirror Right (oba zmierzone osobno); otwory wkładek i Pokrywy: Hole z 2 punktami |
| K6 | zaliczone (z odstępstwem) | Gniazdo 12 ≤ 15; Kaseta 27 > 15 (zatwierdzone w planie: +3 za blok); Klamra 3; Pokrywa 2; Cięgno bez zmian |
| K7 | zaliczone | nowe zmienne w VS przed użyciem (dwuetapowo); płaszczyzny przed szkicami |
| K8 | zaliczone | szkice na płaszczyznach: pl. końca bruzdy, pl. bloku serwa (LINE_ANGLE 90°), pl. siedziska serwa, Kaseta: pl. tyłu, pl. ucha, pl. otworów osi |
| K9 | zaliczone (zbiorczo, 2 stany) | tabela niżej |
| K10 | do użytkownika | nowe nazwy: „Gniazdo: bruzda (dół)”, „Kaseta: blok serwa”, „Kaseta: kanał wkrętu”, „Kaseta: otwór wkrętu przedniego”, „Klamra H…” |
| K11 | zaliczone | foldery: Gniazdo 27 (+4), Kaseta 65 (+7), Klamra H 4 (nowy), Pokrywa tylna 3 (−5), Sanki serwa usunięty; nazwy części zachowane (partId części za przeniesionymi operacjami się zmieniły) |

### K9 (zbiorczy: cztery zmienne naraz)

| Zmienna | Min / nominał / max | Wymiar | Oczekiwane min / max | Zmierzone min / max |
|---|---|---|---|---|
| `bruzdaGl` | 0,95 / 1,05 / 1,15 | dno bruzdy R | 28,45 / 28,65 | 28,45 / 28,65 |
| `blokPolSzer` | 2,5 / 2,75 / 3,0 | boki bloku x | ±2,5 / ±3,0 | ±2,5 / ±3,0 |
| `klamraZewT` | 2,5 / 3,0 / 3,5 | dół Klamry y (x 0) | −30,0 / −31,0 | −30,0 / −31,0 |
| `uchoScianka` | 1,4 / 1,6 / 1,8 | boki ucha y; wierzchołek r; oś wkładki x | ±3,6, 17,05, ±20,65 / ±4,0, 16,25, ±20,25 | ±3,6, 17,05, ±20,65 / ±4,0, 16,25, ±20,25 |

Stany min i max: 10 brył, 0 błędów w drzewie. Po przywróceniu objętości wszystkich 10 brył są identyczne jak przed testem.

## Uwagi

1. **Lista operacji zwiniętego folderu jest niewidoczna także w filtrze drzewa.**
   - Kontrola wiersza po edycji szkicu w zwiniętym folderze Kasety stanęła na „brak wiersza”. Szkic był w pełni zdefiniowany.
   - Rozwiązanie: przed edycją rozwijać folder części. Wtedy filtr pokazuje wiersz.
2. **Przeniesienie operacji do folderu w środku drzewa zmienia partId części za nim.** Nazwy (metadata) zostają. Eksport i review identyfikują części po nazwach.
3. **Skrypt `oko-f-v2.5-build.js` nie jest zaktualizowany o E4.** Operacje E4 są opisane w planach, w tym raporcie i w `stan-api.json`. Aktualizacja skryptu to osobna praca.
4. **Eksport 3MF** robi użytkownik: Gniazdo, Cięgno, Kaseta, Klamra H, Pokrywa tylna; Custom 0,00001 m / 3° / 10 m.

**Werdykt:** v2.6 zgodne z briefem i zatwierdzonymi planami, wszystkie pomiary w granicach. Pięć części jest gotowych do eksportu i review.
