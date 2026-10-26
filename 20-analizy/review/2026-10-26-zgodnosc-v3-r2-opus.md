# Review zgodności dużego oka v3, runda 2: Opus 5.5

26.10.2026. Brief: `2026-10-26-zgodnosc-v3-r2-brief.md`, commit `d7a6dae` (zmiany `ca3b376..d7a6dae`). Pracowałem tylko na odczyt. Raportu `*-r2-astra.md` nie czytałem.

**Jak mierzyłem.** Siatki 3MF z `40-cad/3mf/Duze oko v3/` czytałem własnym skryptem (`python3 -I`, numpy): obrys, liczbę brył, światło otworów, przekroje poziome w orientacji druku. Kinematykę zaczepów napisałem od nowa według parametrów SCAD, z krokiem 1°. Luz prętów do gałki liczyłem jako odległość punkt–trójkąt na siatce `Galka.3mf`, na siatce 15 × 11 położeń, w dwóch wariantach: noga „Z” sztywno wzdłuż osi otworu (jak u projektanta) oraz noga przechylona tak, jak wymaga kierunek pręta. Odstępy serw policzyłem z parametrów SCAD i obwiedni MG90S tak jak w skrypcie przemiatania.

## 1. Uwagi KRYTYCZNE i WAŻNE z rundy 1 oraz z decyzji o oczku

| Uwaga | Stan | Dowód |
|---|---|---|
| K1 (oba): serwo L–P przecina serwo powieki górnej | **ZAMKNIĘTA** | `PG_wal` z = −95, `pl_zT` = −105. Przód korpusu PG z = −95 + 6,25 = −88,75, tylne ucho L–P z = −66 + 5,5 − 22,8 − 4,5 = −87,8, czyli 0,95. Przemiatanie: `SerwoLP–SerwoPG 0,95`. |
| Przemiatanie bez par nieruchomych (moje K1/§4, Astra W3) | **ZAMKNIĘTA** | Skrypt liczy serwo–serwo, serwo–płyta (−0,05), serwo–tuby i płyta–tuby. Serwa mają uszy, wieżyczkę i wałek. Wynik: 0 z 139. Gałka–powieki liczone we wszystkich 165 położeniach, tuby 30 i 40 osobno. Pominięcia są wypisane w montażu §6. |
| Astra W3: zakończenia „Z” w przemiataniu | **ZAMKNIĘTA z ograniczeniem** | Noga „Z” jest sztywna wzdłuż osi otworu, a przechył liczy osobno kinematyka. Mój rachunek z nogą przechyloną: pręt L–P do gałki 0,93, pręt G–D 1,30. Z nogą sztywną: 0,74 i 0,82 (projektant: 0,79 i 0,82). Wszystkie wartości ≥ 0,5. |
| W2 (moja): wcisk osi Ø2 w słupek Ø1,9 | **ZAMKNIĘTA** | `sl_otw` = 2,4, wielokąt 32-boczny opisany. Na siatce płyty odległość ścianek od osi wynosi 1,20, czyli światło Ø2,40. Drut wchodzi bez siły, CA od zewnątrz (krok 7). |
| Osie powiek ≥ Ø2,4 (Astra D1, moja D4) | **ZAMKNIĘTA** | W uszach obu powiek otwór ma na siatce światło Ø2,40. |
| Astra W1, moja D1: droga wkrętaka PD nad korpusem L–P (1,0) | **ZAMKNIĘTA** | L–P wkłada się dopiero w kroku 9. W kroku 8 wkręt PD (y −9,5, z −76) idzie przez puste gniazdo, a korpus PG kończy się na z −88,75. Wkręt PG (z −95) od −x ma ≥ 12,75 do korpusu PD. Wkręt L–P wkręca się z góry na x 32,8, z −66 i nad nim nic nie ma. |
| W1 (moja): kabel G–D przygnieciony płytą | **ZAMKNIĘTA w modelu** | Na siatce jest przejście x −33,7…−25,5, z −64…−56. Spód korpusu G–D leży na x −33, więc przejście obejmuje 0–7,5 mm od spodu na środku szerokości korpusu. Miejsce wyjścia kabla w posiadanym MG90S pozostaje do sprawdzenia (montaż §7). |
| W3 (moja): moduł nie jest wyśrodkowany w tubie | **ZAMKNIĘTA instrukcją** | Krok 11: czoło słupków 2 mm za rantem, równy pierścień 8,15, dwie osoby, opcjonalne paski 0,9. |
| Astra W2: niepodparte końce języczków przy druku | **ZAMKNIĘTA** | Montaż §1: podpora pod końcem języczka L–P (7,2 mm wysięgu) i pod spodem słupka G–D. |
| Astra W4, moja D7: kołki przedłużeń | **ZAMKNIĘTA** | Na siatce przedłużenia nie ma otworów w punktach 5,5 i 17,5. Montaż: „Żadnych M3, kołków ani innych dodatków”. |
| Moja D2: przedłużenie PD w szczelinie płyty | **ZAMKNIĘTA** | Szczelina sięga x +1,5, a przedłużenie leży na x −3…−0,5. `OrczykD–Plyta 0,75`. |
| Oczko, KRYTYCZNE (oba): przechył „Z” 6,7° wobec potrzebnych 40,9° | **ZAMKNIĘTA** | Szczegóły w §2. |
| Oczko, WAŻNE: przemiatanie obróconego zaczepu G–D | **ZAMKNIĘTA** | Patrz wiersz Astra W3 wyżej. Do tylnej piasty kardana zostaje 2,34. |
| Oczko, WAŻNE: luz drutu w otworze (martwy ruch ok. 4–5°) | **OTWARTA, do testu** | Do zmierzenia na `Probka zaczepu galki` (montaż §1 i §7). Geometria tego nie rozstrzygnie. |

## 2. Zaczepy „Z” przy gałce

Na siatce gałki oba otwory, L–P i G–D, mają gardziel o świetle Ø2,00 i długości 1,0 oraz wylot Ø3,0. Mostek do końca języczka (r 12,8) ma 0,99. Słupek G–D kończy się na z −7, czyli 1,0 pod wylotem.

| Zakres | L–P: wymagany | G–D: wymagany | Dopuszczalny (Ø2,0 × 1,0, drut Ø1,0) | Zapas |
|---|---|---|---|---|
| Cel ±35° / ±25°, osie osobno | 30,1° | 29,8° | 36,9° | 6,8° |
| Cel, z narożnikami | 30,1° | 29,8° | 36,9° | 6,8° |
| Minimum ±30° / ±20° | 24,9° | 24,3° | 36,9° | 12,0° |
| Koniec przy orczyku | 5,1° | 5,2° | ok. 8,2° (Ø1,3 w ramieniu 2 mm, założenie) | 3° |

- Liczby projektanta (30,1 / 29,8 / 36,9) potwierdzam. Największy przechył wypada na osi (θ ±25), a nie w narożniku.
- **Zapas zależy od tego, jak wydrukuje się gardziel.** Gardziel Ø1,9 daje 34,5° (zapas 4,4°), a Ø1,8 tylko 31,9° (zapas 1,8°). Kryterium próbki „≥ 33°” odpowiada gardzieli ok. Ø1,86, więc próbka sprawdza właściwą rzecz. Przy celu PRD zapas jest wystarczający pod warunkiem, że próbka przejdzie. Przy minimum PRD zapas jest wystarczający bez warunku.
- Pręt G–D ma otwór w gałce wzdłuż y, a w orczyku wzdłuż x. Jego dwa zagięcia „Z” muszą więc leżeć w płaszczyznach prostopadłych. Liczyłem sztywny drut z takim skręceniem. Niedopasowanie obrotu sięga 17,9° w narożniku, ale największy przechył nadal wynosi 29,8°. Instrukcja nie mówi jednak, jak giąć ten pręt (D2).
- **Słupek G–D jest zmianą kształtu jednego z dwóch dopuszczonych języczków, a nie nową częścią.** Jest integralny z gałką, ma tę samą funkcję i jeden otwór. Nie przybywa śruba, część ani przegub. Zmienia się jednak sposób mocowania. Języczek był płytką promieniową, opartą o czaszę i podpartą pod 45° do krawędzi. Słupek ma 6,5 × 2 mm i wisi na przedniej czaszy: na siatce łączy się z nią dopiero od z ≈ +22, czyli 27–29 mm nad otworem (W1).

## 3. Co doszło od rundy 1

| Zmiana | Ocena | Liczba, która ją wymusza |
|---|---|---|
| Otwory dwustożkowe Ø2,0 × 1,0, języczek gr. 2,0, `zacz_r` 15,3, noga „Z” 4,0 | **NIEZBĘDNE** | Wymagane 30,1° wobec 6,7° przy Ø1,3. Przy r 14 wylot Ø3 nachodziłby na koniec języczka (r 12,8). |
| Słupek G–D zamiast języczka promieniowego | **NIEZBĘDNE co do zasady** (zmiana kształtu) | Wynika z obrotu otworu na oś y, który przyjęła decyzja PM. Słupek kończy się nad drogą pręta. Ryzyko opisuje W1. |
| `Probka zaczepu galki` (otwory A i B) | **NIEZBĘDNE** | Zapas 6,8° topnieje do 1,8° przy gardzieli Ø1,8 z druku. To próbka, nie część mechanizmu. |
| Krawędź czaszy z = −11,5 (ok. 113°) | **NIEZBĘDNE**, w granicach ustalenia 3 | Według projektanta przy −12 zostawało 0,36. Wygląd: otwór zewnętrznie Ø55,4. Na siatce światło przy krawędzi ma Ø51,0. Trzeba to pokazać użytkownikowi razem z P4 i P5. |
| PG z = −95, płyta wydłużona do 109 | **NIEZBĘDNE** | K1. Płyta mieści się w 180. |
| L–P x = 32,8 | **NIEZBĘDNE** | Orczyk 17,5 sięga do zaczepu na r 15,3. |
| Przedłużenia na zewnętrznej stronie ramion (x ±1,75), `pG_psi0` 25 | **NIEZBĘDNE** | Wynikają z usunięcia kołków i z D2. |
| Szczelina PD do x +1,5, przejście kabla G–D | **NIEZBĘDNE** | D2 i W1 z rundy 1. |
| Wycięcie krawędzi powieki 10 mm, do z +2,6 | **NIEZBĘDNE** | Noga „Z” 2,5 przy uszku. Skutek dla druku opisuje W2. |
| Otwory jako wielokąty opisane (32 boki) | **NIEZBĘDNE** | Światło Ø2,40 zamiast 2,36. |
| Paski papieru 0,9 przy klejeniu w tubie | **NADMIAROWE** (opcja w instrukcji) | Pomoc przy montażu, nie część. Nie wpływa na model. |

Poza tym nie znalazłem nowych śrub, części ani przegubów. Rendery i pliki `.blend` nie dotyczą geometrii.

## 4. Miejsca „na milimetr” przy montażu

- **0,95 między tylnym uchem L–P a przodem PG.** Ucho L–P zjeżdża równolegle do ściany PG na ostatnich ok. 20 mm, a od chwili wejścia korpusu w gniazdo (luz 0,2) prowadzi je gniazdo. Gdy luzy obu gniazd (po 0,2) i tolerancje korpusów wypadną niekorzystnie, zostaje ok. 0,5. **Geometrycznie wkładaniu to nie przeszkadza.** Przeszkodzi klej na gorąco z kroku 3, jeśli zostanie na przodzie PG albo na płycie przed nim (z −88,75…−87,8, y −15…−13), bo tam ląduje ucho L–P (D1).
- Pozostałe drogi narzędzi mają ≥ 10 mm, z wyjątkiem pierścienia przy słupku G–D na „Z” kombinerkami (ok. 8 mm między piastą kardana a słupkiem). Luzy 0,2 i 0,3 w zawiasie to pasowania, nie przejścia.
- Innych miejsc poniżej 1 mm nie znalazłem.

## 5. Otwarte uwagi

**KRYTYCZNE:** brak.

**WAŻNE**

- **W1. Słupek G–D jest długim wspornikiem.** Ma 2 × 6,5 mm i łączy się z czaszą 27–29 mm nad otworem.
  - Druk: od z_druk 4,5 do ok. 33 słupek rośnie jako wolnostojąca ścianka na małej podporze.
  - Sztywność boczna (w y) wynosi ok. 0,4 mm/N.
  - Obciążenie boczne to F·sin β, do ok. 0,5 F. Gdy serwo G–D zablokuje się na krańcu (ok. 19 N), naprężenie przy nasadzie wynosi ok. 59 MPa w poprzek warstw.
  - Scenariusz: słupek drukuje się krzywo albo pęka przy nasadzie, a oś G–D przestaje działać, więc gałkę trzeba drukować od nowa.
  - Test na wydruku testowym: obejrzeć słupek, ręcznie sprawdzić jego ugięcie przy pręcie i nie dociskać serwa G–D do krańca.
  - Pewność: średnia. Siłę zablokowania przyjąłem z danych MG90S, ramię 11,5.
- **W2. Uszka drutów powiek drukują się w powietrzu.** Na przekrojach siatek obu powiek uszko (x 4…6 lub −6…−4) zaczyna się na z_druk 3,0 i aż do z_druk 5,6 jest odosobnionym prostokątem 2 × 2,7 mm. Pod nim nie ma nic, a z czaszą łączy się dopiero mostek nad wycięciem. W rundzie 1 uszko stało na mostku. Montaż §1 nie przewiduje tu podpory. Scenariusz: uszko z otworem drutu nie wydrukuje się albo wyjdzie zdeformowane. Poprawka w instrukcji: podpora pod każdym uszkiem (3 mm od stołu). Pewność: wysoka (siatka).

**DROBNE**

- **D1.** W kroku 3 dopisać: PG kleić od tyłu i z boków; przód korpusu i płyta przed nim mają zostać bez kleju; L–P przymierzyć na sucho.
- **D2.** Pręt G–D: oba zagięcia „Z” w płaszczyznach prostopadłych (noga przy gałce wzdłuż y, przy orczyku wzdłuż x). Dopisać w kroku 6.
- **D3.** Rozbieżności w opisach:
  - nagłówek przemiatania podaje „zacz_ods (3,5)”, a parametr ma 4,0;
  - montaż §6 podaje „9 brył w zbiorczym”, a jest ich 10, razem z próbką;
  - montaż §3 opisuje słupek G–D „od krawędzi czaszy”, a w modelu zaczyna się na z −7;
  - montaż §4 podaje „na orczykach do 5,9°”, a mój rachunek daje 5,2°.
- **D4.** Luz drutu w otworze i martwy ruch gałki trzeba zmierzyć na próbce (otwór A wobec B).

## Werdykt

v3 (`d7a6dae`) zamyka wszystkie uwagi krytyczne i ważne z rundy 1 oraz sprawę zaczepów „Z” (wymagane 30,1° wobec dopuszczalnych 36,9°) i nadaje się do wydruku testowego, pod warunkiem dopisania podpór pod uszkami drutów powiek (W2) i najpierw wydrukowania próbki zaczepu; słupek G–D (W1) trzeba obejrzeć na tym wydruku.
