# Uchwyt serw dużego oka – do analizy i decyzji (stan 25.10)

Status: **otwarte, bez decyzji**. Użytkownik nie odpowiada teraz. Najpierw analiza, potem decyzja. Uchwytu w obecnej postaci nie drukować. `40-cad/3mf/Duze oko v2/Uchwyt serw.3mf` to nadal v9 z błędem.

## Wątpliwość użytkownika (25.10)

Ustaliliśmy punkty mocowania serw i poprowadziliśmy je od płyty mocującej najprostszą drogą (wieże i ramki wyrastające z płyty), bez sprawdzenia, czy to dobre rozwiązanie. Najpierw trzeba to przeanalizować, a dopiero potem zdecydować. Przykład innego podejścia: ramki zamontować najpierw na serwach i dopiero wtedy przykręcić je do płyty. Są też inne możliwe rozwiązania.

## Co wiemy (fakty z modelu i review)

- **Układ obecny:** jedna drukowana bryła złożona z płyty, słupka Ø16 na trzpień M5, 3 wież M3 do pierścienia i 4 ramek serw (S1, S2 dla gałki oraz SG, SD dla powiek). Ramki stoją pionowo na płycie, a serwa wsuwa się w okna wzdłuż osi wałka (luz okna 0,3 mm).
- **Druk v9 u użytkownika:** ramki SG/SD nie wydrukowały się w całości. Słupki ramek miały ok. 2 mm.
  - W v12–v13 słupki mają 4 mm.
  - Dodane ścianki: słupek–wieża 2, wieża 1–ramki S1/S2, ściana łącząca ramki SG/SD z trójkątnymi żebrami, niskie żebro do ramki S2, skośne podstawy wież.
- **S2 nie da się włożyć** (błąd jest już w v9; Opus i Astra potwierdzili w 2 rundach). Przy wsuwaniu góra serwa wchodzi w środkowy słupek od ok. 5–6 mm z 18 mm drogi.
  - Wariant naprawy: ramka S2 przed uszami (x 23,5–27,5), serwo wsuwane od +x. Jest w `40-cad/openscad/duze-oko-v2.scad` za przełącznikiem `ramkaS2Zewn = false`.
  - W pozycji zamontowanej wariant nie ma kolizji: luz okien 0,30 mm, najmniej 1,39 mm do orczyka S1.
  - Przy wsuwaniu potrzebne są dwie poprawki z review. W wariancie są już: przycięty skos podstawy wieży 1 i luz okna od góry 0,6 mm. Wsuwania nowego wariantu nikt jeszcze nie sprawdził na siatce.
- **SD:** dolne ucho serwa schodzi do z −65,8, czyli tuż nad płytę (z −66). Zahaczało o niską ściankę słupek–wieża 3, więc ścianka została usunięta. Po usunięciu wsuwania SD nie sprawdzono ponownie na siatce.
- **Przyczyna obu problemów:** ramki stoją na płycie, a serwa wchodzą osiowo przez ciasne okna. Każda nowa ścianka albo żebro może więc zablokować drogę wsuwania któregoś serwa. Przemiatanie kolizji w ruchu tego nie wykrywa. Potrzebna jest osobna symulacja wsuwania.
- **Raporty:**
  - `20-analizy/review/2026-10-25-uchwyt-scianki-{opus,astra}{,-r2}.md`;
  - kolizje `40-cad/openscad/kolizje-{kardany,powieki}-v12.txt` (wyliczone na v13).

## Kierunki do przeanalizowania (bez rekomendacji)

1. **Jak dziś, z poprawkami:** monolit, wariant S2 włączony, symulacja wsuwania 4 serw.
2. **Ramki osobno, przykręcane do płyty** (pomysł użytkownika): serwo przykręcone do swojej ramki na stole, potem ramka przykręcona do płyty M3.
   - Do sprawdzenia: druk ramki na płasko (mocniejsze warstwy, koniec problemu cienkich słupków), brak drogi wsuwania przez sąsiednie elementy, pozycjonowanie (kołki albo wpusty), dostęp do wkrętów, liczba śrub.
3. **Ramki otwarte (U):** serwo wkładane bokiem albo od góry zamiast osiowo, docisk wkrętami uszu.
4. **Inny układ serw:** położenie i kierunek serw wobec słupka i wież. Wymaga ponownej kinematyki kardanów i powiek.

Dla każdego kierunku policzyć: druk (orientacja, podpory, najcieńsza ścianka), montaż (kolejność, dostęp narzędziem, droga wsuwania), sztywność (lewa strona w poprzek), kolizje w ruchu (skrypty `40-cad/narzedzia/duze-oko-*-kolizje.js`) i zmiany w innych częściach.

## Pytanie pomocnicze do użytkownika

Czy w wydrukowanym v9 serwo S2 dało się włożyć w ramkę?
