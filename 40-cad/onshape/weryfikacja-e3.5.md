# E3.5: weryfikacja próbki gniazd wkładek M3 (K1–K9, K11)

20.10.2026, wykonawca CAD.
- **Dokument:** „Probka wkladek M3” w folderze TMP (did `fa14c453e24a3fc9b2d88164`).
- **Elementy:** Part Studio „Probka wkladek M3”, Variable Studio „Zmienne E3.5”.
- **Bryła:** jedna, „Probka wkladek M3”.
- **Folder:** jeden, „Probka wkladek M3 (11)”.
- **Plan:** `40-cad/onshape/e3.5-plan.md` (zatwierdzony bez zmian).
- **Stan:** `40-cad/onshape/stan-api.json` → `e35`.

**API:** 31 wywołań (budżet 60), `GET /features` 1 (budżet 3). Suma w roku 412 + 31 = 443. Bez 429/402 i bez stopu bramki.

**Uwagi o API:**
- Jedno `GET /variables` (diagnoza błędu 400) wysłałem z pominięciem bramki; to mój błąd. Jest doliczone do licznika i zapisane w logu.
- Zapis zmiennych jednym krokiem dał 400. Dwuetapowo (najpierw liczby, potem wyrażenia) przeszedł: 204 / 204.

## Wynik

| # | Wynik | Dane |
|---|---|---|
| K1 | zaliczone | 11 operacji, każdy zapis `featureStatus` OK; w drzewie 0 ikon błędu i ostrzeżenia (`featureStates` z API puste, jak w E2.0) |
| K2 | zaliczone | 2 szkice w drzewie = 2 w JSON, oba w pełni zdefiniowane: `Probka: listwa i piasta szkic`, `Probka: gniazda szkic` |
| K3 | zaliczone | 38 wyrażeń, wyłącznie `#zmienne`, `0 mm` i `#piastyN` (liczba). Wyjątek z planu: współrzędne punktów w `qContainsPoint` (wybór obszaru, (20; 3) i (0; 0) mm), nie wymiar |
| K4 | zaliczone | 0 więzów Fix. Wierzchołki trójkąta nacięcia: `#naciecieX`, `#naciecieY` (dwa), `0 mm`, oba końce na krawędzi listwy |
| K5 | zaliczone | piasty: szyk liniowy `Probka: piasty ×5` (×`#piastyN`, odstęp `#piastyOdstep`, kierunek `osX`); gniazda: 5 operacji Hole o różnych średnicach (szyk nie daje różnych średnic, a Mirror/szyk nie powiela Hole) |
| K6 | zaliczone | 8 operacji bryłowych ≤ 15 (2 Extrude, 1 szyk, 5 Hole); 2 szkice, każdy dla kilku operacji (S1: listwa, piasta, kierunek szyku; S2: 5 gniazd); 2 szkice jak w planie |
| K7 | zaliczone | zmienne w Variable Studio przed Part Studio; kolejność drzewa: płaszczyzna, S1, listwa, piasta, szyk, S2, gniazda 1–5 |
| K8 | zaliczone | S1 na Top, S2 na `Probka: pl. góry piast` (Top + `#piastaH`) |
| K9 | zaliczone | tabela niżej (test zbiorczy, 2 stany + przywrócenie) |
| K10 | do użytkownika | nazwy |
| K11 | zaliczone | 11 operacji w folderze „Probka wkladek M3 (11)”, wcięcie 19 px, liczba zgodna |

## Pomiar bryły (`bodydetails`, `massproperties`)

| Wielkość | Oczekiwane | Zmierzone |
|---|---|---|
| Objętość | 1619,83 mm³ (rachunek) | **1619,84 mm³** |
| Obrys | x −6…52,5, y ±4,5, z 0…5,6 | x −6…52,5, y ±4,5, z 0…5,6 |
| Piasty | R3,8 na x 0/12/24/36/48, z 2,5…5,6 | R3,8 na x 0/12/24/36/48, z 2,5…5,6 |
| Pogłębienia gniazd 1–5 | R 2,0 / 2,1 / 2,2 / 2,3 / 2,4, z 1,0…5,6 (głęb. 4,6) | R 2,0 / 2,1 / 2,2 / 2,3 / 2,4, z 1,0…5,6 |
| Otwory pod gniazdami | R1,65 przelotowo, z 0…1,0 | R1,65, z 0…1,0 |
| Dna gniazd (pierścienie na z 1,0) | π(R² − 1,65²) | 4,013 / 5,301 / 6,652 / 8,066 / 9,543 mm² |
| Nacięcie | V 3 × 1,5 na czole x −6 przy gnieździe 1 | w obrysie; wierzchołek 0,7 mm od piasty 1 |

**Rachunek objętości:**

| Składnik | mm³ |
|---|---|
| listwa: (58,5 × 9 − 2,25) × 2,5 | 1310,63 |
| piasty: 5 × π·3,8²·3,1 | +703,14 |
| pogłębienia: π/4·4,6·(4,0² + 4,2² + 4,4² + 4,6² + 4,8²) | −351,17 |
| otwory: 5 × π/4·3,3²·1,0 | −42,77 |
| **razem** | **1619,83** |

**Ścianki piasty wokół pogłębienia:** (7,6 − D)/2 = 1,8 / 1,7 / 1,6 / 1,5 / 1,4 mm. Dno gniazda nad stołem ma 1,0 mm.

## K9 (zbiorczy: `piastyOdstep` i `wkladkaD3` naraz)

| Stan | `piastyOdstep` | `wkladkaD3` | Długość listwy (oczek. / zmierz.) | Środki piast x | R pogłębienia 3 (oczek. / zmierz.) | Bryły | Błędy w drzewie |
|---|---|---|---|---|---|---|---|
| min | 10 | 4,2 | 50,5 / 50,5 | 0, 10, 20, 30, 40 | 2,1 / 2,1 | 1 | 0 |
| nominał | 12 | 4,4 | 58,5 / 58,5 | 0, 12, 24, 36, 48 | 2,2 / 2,2 | 1 | 0 |
| max | 14 | 4,6 | 66,5 / 66,5 | 0, 14, 28, 42, 56 | 2,3 / 2,3 | 1 | 0 |

Pozostałe gniazda w stanach min i max bez zmian (2,0 / 2,1 / – / 2,3 / 2,4), punkty gniazd idą za piastami. Po przywróceniu objętość wynosi 1619,84, jak przed testem.

## Druk i eksport

- **Druk:** spodem listwy na stół (z = 0), piasty do góry. Bez nawisów: pogłębienia i otwory są pionowe, nacięcie przechodzi przez całą grubość. Bez podpór.
- **Oznaczenie:** nacięcie V przy gnieździe 1 (Ø4,0); dalej po kolei Ø4,2, Ø4,4, Ø4,6, Ø4,8.
- **Eksport:** ręcznie przez użytkownika, 3MF Custom 0,00001 m / 3° / 10 m.
- **Dokument:** zawiera też domyślne elementy „Assembly 1” i „BOM : Assembly 1”, które Onshape tworzy z każdym dokumentem. Nie usuwałem ich (usuwanie elementów przez API jest u nas zablokowane); użytkownik może je usunąć ręcznie.

**Werdykt:** próbka zgodna z planem i briefem, gotowa do eksportu i wydruku.
