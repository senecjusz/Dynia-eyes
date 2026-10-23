# E6.2 etap 1 – runda weryfikacji K1–K11 i eksport

Wykonawca CAD, 23.10.2026. Dokument „Duże oko v1” (did `b8cc184e37d6a8dbfb63c30b`), Part Studio „Duże oko v1”, stan `sourceMicroversion` 0f5c55eca4788af83853c0d6 (po przywróceniu zmiennych z K9 geometria taka sama). Brief `30-projekt/brief-e6.2-cad-etap1.md` (3a8dba3).

**Zakres zbudowany (bazy części):** Layout, Rama, Gałka, Próbka P6, Powieka górna, Powieka dolna, Słupek, Obejma – 7 brył, 70 operacji, 22 szkice, 9 folderów. Elementy zależne od v3.1 (wycięcia `rimX`/`rimY`/`wyciecieG`, nadlewy, zaczepy drutu, ucha Ramy, czop i spłaszczenie Słupka) i przyrządy – nie w tym etapie (decyzje orkiestratora).

**API:** etap 1 – 159 wywołań z 170 (n.total 163 łącznie z 4 z 22.10), `GET /features` 5 z 8. Suma w roku 558 + 163 = **721**. Bez 429/402, bez `/featurescript`.

## Surowe dane

- `odbior-e6/features-slupek-obejma.json` – `GET /features` z encjami (stan końcowy, 70 operacji); wcześniejsze: `features-rama-galka.json`, `features-powieki.json`.
- `odbior-e6/znaczniki-wszystkie.json` – odczyt znaczników 22 szkiców z drzewa (foldery rozwinięte, lista przewijana).
- `odbior-e6/variable-studio.json` – 199 zmiennych.
- `odbior-e6/k1-k8.json` – wynik `40-cad/narzedzia/e6-kontrola-k.py` na powyższych.
- `stan-api-e6.json` – log, pomiary `bodydetails`/`boundingboxes` po każdej bryle, wyniki K9 (pole `k9`).

## Wyniki

| # | Kryterium | Wynik | Dane |
|---|---|---|---|
| K1 | każdy `featureStatus` = OK | **TAK** (70/70) | features JSON |
| K2 | szkice w pełni zdefiniowane; wiersze = JSON | **TAK** – 22 w JSON = 22 w drzewie, 0 niedookreślonych | znaczniki |
| K3 | tylko stałe z listy (0, 90/180/360 deg, 2) | **TAK** – 149 wyrażeń, 0 naruszeń (kąty mostka jako `R·sin(…)`, zatwierdzone) | k1-k8.json |
| K4 | 0 Fix; każda encja związana | **TAK** – 0 Fix, 0 encji bez więzu | k1-k8.json |
| K5 | pary przez Mirror | **TAK** – Rama: podkładka (FEATURE) + otwór (FACE, Hole nie odbija się FEATURE); Powieka górna: mostek i ucho; Powieka dolna: ucho; Obejma: ucho. Otwory osi powiek i M3 Obejmy: jeden Hole THROUGH przez oba ucha | k1-k8.json |
| K6 | ≤ 15 operacji bryłowych na część; szkice z uzasadnieniem | **TAK** – Rama 6, Gałka 1, P6 1, Powieka górna 6, Powieka dolna 5, Słupek 4, Obejma 6; szkice: Layout 2, Rama 3, Gałka 1 (wspólny z P6), PG 4, PD 3, Słupek 4, Obejma 5 – każdy wg zatwierdzonego planu (płaszczyzna lub punkt Hole) | k1-k8.json |
| K7 | zmienne i layout przed użyciem | **TAK** – VS przed operacjami; layout na górze; po poprawce mostka G kolejność płaszczyzna → szkic → wyciągnięcie | kolejność w JSON |
| K8 | szkice na płaszczyznach | **TAK** – 22/22 na Right/Top albo na `cPlane` (żaden na ścianie operacji) | k1-k8.json |
| K9 | test zginania | **CZĘŚCIOWO** – patrz niżej (błąd w Powiece dolnej) | stan `k9` |
| K10 | nazwy | do oceny użytkownika; duplikatów nazw brak (wyciągnięcia z dopiskiem „(wyciągnięcie)”, „Rama: podkładka boku osi”) | – |
| K11 | operacje w folderach | **TAK** – Layout (8), Rama (11), Gałka (2), Próbka P6 (1), Powieka górna (14), Powieka dolna (10), Słupek (10), Obejma (14) | drzewo w karcie |

### K9 – test zginania

Każda zmiana: zapis zmiennych, odczyt ikon drzewa (ostrzeżenia/błędy) i `bodydetails` wszystkich brył; na końcu przywrócenie.

| Zmienna | Zmiana | Oczekiwane | Zmierzone | Wynik |
|---|---|---|---|---|
| `luzCzasza` | 1,2 → 1,0 | sfery obu powiek −0,2 | **Powieka górna** 31,0 / 33,2 / 34,5 ✓; **Powieka dolna bez zmian 31,2 / 33,4 / 34,7** ✗, drzewo bez ostrzeżeń | **BŁĄD** |
| `glebokoscSrodka` | 10 → 12 | środek sfer rantu Ramy +2; czoło Obejmy +2 | sfery R150/152 na z −138 ✓; Obejma z −3 … −13 ✓ | OK |
| `dociskMin` | 15 → 20 | czoło Obejmy −5 | Obejma z −10 … −20 ✓ | OK |
| `rimX`, `wyciecieG` | – | – | elementy jeszcze nie zbudowane (po v3.1) | – |

**Błąd K9 (Powieka dolna):** przekrój dolnej powieki jest przycięty na x = ±`uchoDX1` (31,2), a promień wewnętrzny czaszy to `kulaR` + `luzCzasza` (31,2) – te same liczby z dwóch różnych łańcuchów. Przy `luzCzasza` < 1,2 łuk R1 nie sięga linii przycięcia, szkic nie ma rozwiązania i **zostaje w starej geometrii bez ostrzeżenia w drzewie** (featureStatus OK). To samo stanie się przy `kulaD` < 60.

**Poprawka (proponowana, 3 edycje):** przyciąć czaszę D tak jak G – na x = ±`trimG` (`uchoDX1` − `luzOsiowy`, 30,95), a ucho D wyciągać od płaszczyzny x = `trimG` na głębokość `uchoDX2` − `trimG` (zachodzi na czaszę, łączy się z nią). Warunek poprawności dla obu powiek: `kulaR` + `luzCzasza` > `trimG` (dziś 31,2 > 30,95; przy `luzCzasza` 1,0: 31,0 > 30,95). Po poprawce powtórzyć K9 `luzCzasza`.

**Wniosek do AGENTS.md:** szkic, który traci rozwiązanie po zmianie zmiennej, potrafi zostać w starej geometrii bez ostrzeżenia – K9 musi mierzyć bryły (bodydetails), nie tylko czytać stany.

## Eksport i kontrola siatek

- Jeden 3MF całego Part Studio przez API (zgoda orkiestratora): `POST /translations` (3MF, `distanceTolerance` 0,00001 m, `angularTolerance` 3°, `maximumChordLength` 10 m, mm) → `GET /translations/{id}` = DONE → `GET externaldata` (1 329 812 B, ZIP/3MF). Licznik `POST /translations` po wywołaniu: **10** (jak 19.10) – kolejnego eksportu bramka nie przepuści.
- Plik: `40-cad/3mf/Duze oko v1/Duze oko v1 - FullProject.3mf`.
- Rozdzielenie: `python3 -I 70-budowa/montaz-v2.7/3mf_do_stl.py … --rozdziel` → 7 plików STL (nie commituję – odtwarzalne).
- `node 40-cad/narzedzia/sprawdz_siatki.js` na 7 STL: **7/7 OK** (0 otwartych krawędzi, 0 krawędzi > 2 trójkąty, 0 zdegenerowanych). **Liczba brył w modelu (7) = w 3MF (7).**

| Część | Trójkąty | Bbox z siatki [mm] |
|---|---|---|
| Rama | 6 520 | x ±42, y ±42, z −37 … 7,87 |
| Gałka | 37 070 | ±30, z −12,68 … 30 |
| Próbka P6 | 21 730 | ±28,28, z 10 … 30 |
| Powieka górna | 16 346 | x ±36,25, y −5,99 … 33,39, z −6 … 34,67 |
| Powieka dolna | 13 562 | x ±33,6, y −33,4 … 4, z −4 … 34 |
| Słupek | 1 116 | ±7,65, z −33 … −5,5 |
| Obejma | 1 990 | x ±48, y −48 … 50, z −15 … −5 |

## Druk (do README)

Rama tyłem (z −37) w dół; Gałka krawędzią tylną w dół, front do góry, 0,16, szew z tyłu – najpierw Próbka P6; powieki płaszczyzną krawędzi przedniej na stół, podpory od strony wklęsłej; Słupek pionowo spodem w dół (kanał nakrętki poziomo, sufit S 8,2 mostem); Obejma kołnierzem w dół, **PETG**.

## Werdykt

Bazy części etapu 1 spełniają K1–K8 i K11; K9 wykazał jeden błąd parametryzacji w Powiece dolnej (przycięcie na `uchoDX1`) – do poprawki przed wydrukiem powiek. Siatki szczelne, 7/7.
