# Brief: moduł małego oka v2 (ze śrubami)


## Zadanie

Zrób **v2 modułu małego oka**: ta sama koncepcja co v1.1 (`40-cad/`, `40-cad/README.md`), ale **złożona na śrubach M3** i z poprawkami poniżej. Zacznij od `git pull` i `CLAUDE.md`.

## Bez zmian względem v1.1

- Mocowanie wariant F: gniazdo z rantem Ø 68 × 1,5 + nakrętka, moduł wpinany na bagnet.
- Piłeczka 39,5–40,5 mm: luzy od 40,5, trzymanie łapie 39,5.
- Ruch oka ±30°, oś pionowa.
- Napęd: korba 22, cięgno 16, drukowane ramię orczyka 22 mm (otwór orczyka 13 mm).
- PLA.

## Zmiany w v2

1. **Oś oka na 2 × M3 zamiast drukowanych czopów.** Wybierz łeb i jego osadzenie. Ścianka tulei 2,4 mm jest za cienka na łeb i gwint, więc pogrub ją lokalnie albo zrób rowek na łby w gnieździe. Jedna zasada: co ciasno, co luźno. Luz osiowy, żeby dokręcenie nie blokowało obrotu.
2. **Przeguby napędu na M3:** pewny luz i brak odkręcania przy ruchu wahadłowym.
3. **Wkładki do wtapiania** tam, gdzie moduł się rozkręca. Wymiary otworu jako zmienne.
4. **Bagnet ze sprężystym językiem** w ściance tulei, garb 0,5–0,8 mm, najazdy, strzałki kierunku i znacznik ZAMKNIĘTE.
5. **Gałka wystaje ~8 mm** (było 13) i **ograniczniki obrotu jarzma** w tulei, żeby wymuszony obrót ręką szedł na ogranicznik, a nie na serwo.
6. **Tylny zaczep piłeczki szerzej rozkłada nacisk** na ściankę 0,4 mm.
7. **Krótsze gniazdo** (ścianka dyni + nakrętka). Dwa sąsiednie moduły w rozstawie 105–115 mm po powierzchni dyni nie mogą kolidować w środku.
8. **Rant i nakrętka dopasowane do krzywizny dyni**, ząbki dalej od krawędzi otworu.
9. **Druk:**
   - **zasada: każda część ma płaską stronę na stół, nic nie wystaje poza nią** (patrz CLAUDE.md, DFAM),
   - bez nawisów słupków serwa i chwytu,
   - flanki gwintu ≤ 45° i fazowany początek zwoju,
   - jarzmo leży płasko,
   - korba zrośnięta z jarzmem.
10. **Przyrządy:** do wiercenia otworów w piłeczce i do centrowania orczyka (moduły wymienne bez ponownej kalibracji).
11. **Odciążenie kabla serwa** przy tulei.
12. **Z review v1.1:**
    - **Cięgno:** jeden zamknięty kontur. W v1.1 STL ma pustkę przy otworze i szczelinę przez całą grubość. Zabezpieczenie przed zsunięciem z kołków. Większe okno montażowe, żeby dało się je założyć.
    - **Wycięcie na kabel SG90** w słupku serwa. Wysokość orczyka (`hornTop`) według zmierzonego serwa.
    - **Ramię orczyka:** kieszeń w kształcie orczyka i osobny wkręt M2, bez polegania wyłącznie na tarciu.
    - **Kinematyka z zapasem:** kąt przenoszenia ≥ 35–40° na obu końcach ±30°, także przy luzach przegubów 0,2 mm. Rozważ korbę 20 mm. Napęd nie może dać się złożyć w drugiej, błędnej pozycji.
    - **Zmienne mają naprawdę sterować geometrią** (luz gwintu, kulaDmin).
    - **Ząbki pod rantem** ≥ 1 mm od krawędzi otworu. Fazki na zaczepach gniazda i chwycie tulei. Słupki serwa bez wiszących płyt.

## Pomiary – zapytaj użytkownika na starcie

- SG90 z orczykiem: od spodu uszu do wierzchu orczyka (model zakłada 30,5 mm od dna) i strona wyjścia kabla,
- otwornica (średnica, głębokość cięcia) i grubość ścianki dyni, jeśli już znane,
- wybrane śruby osi i wkładki (Ø, długość),
- uwagi z wydruku testowego v1.1 (użytkownik właśnie drukuje).

Czego nie wiadomo: przyjmij rozsądną wartość jako zmienną i zapisz to w podsumowaniu.

## Jak pracujesz

- Onshape: wymagania struktury i zasady API są w `CLAUDE.md`. **Ten sam dokument (SimpleEye), nowa gałąź „v2” od wersji v1.1**, a v1 i v1.1 zostają nietknięte w historii.
- **Najpierw plan dla użytkownika:** lista Partów i sposób łączenia każdej pary części. Budujesz dopiero po akceptacji.
- Assembly z ruchem ±30° i podglądem prawdziwego SG90 (korpus, uszy, kabel, orczyk), bez kolizji.
- Eksport 3MF robi użytkownik. Ty mierzysz na nim luzy.
- Commit tylko własnych plików, STL z sufiksem `-v2`.
- **Stop po v2:** napisz, że gotowe do review, i wypisz, czego nie jesteś pewien.
