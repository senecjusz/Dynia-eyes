# e6-siatki-ruch – kolizje na siatkach z CAD dużego oka, z ruchem

Narzędzie sprawdza luzy i przenikanie między częściami dużego oka **na siatkach wyeksportowanych z Onshape**. Liczy w całym zakresie ruchu gałki i powiek. Jest uzupełnieniem modelu kontrolnego z `e6-przemiatanie/`, który liczy na bryłach analitycznych, a nie na siatkach z CAD. Wymaga tylko Pythona 3 i numpy.

## Użycie

```
cd 40-cad/narzedzia
python3 e6-siatki-ruch.py --test                         # testy jąder i przypadków kostek
python3 e6-siatki-ruch.py e6-siatki-ruch.json            # pełny przebieg → e6-siatki-ruch-wynik-etap1.{txt,json}
python3 e6-siatki-ruch.py e6-siatki-ruch.json --pary 3,5 --wynik /tmp/proba   # wybrane pary
```

- Opcje: `--siatki <katalog STL>` (zamiast `katalog_siatek` z JSON), `--procesy N` (domyślnie liczba rdzeni − 1).
- Pełny przebieg etapu 1 trwa ok. 75 minut na 12 rdzeniach (11 procesów); Gałka–Rama w trybie dalekim zajmuje z tego ok. 19 minut. Prawie cały czas zajmują pary Gałka–Powieka, czyli współśrodkowe czasze z luzem 1,2 na całej powierzchni.

## Wejście (`e6-siatki-ruch.json`)

| Klucz | Znaczenie |
|---|---|
| `katalog_siatek` | katalog STL, względem pliku JSON; STL binarny albo ASCII, w mm, układ koncepcji v3.1 |
| `czesci` | `plik`, `ruch` (`stala`, `galka`, `z_galka`, `powieka` z `zmienna` i `kat_modelu`, `pret_ik`), `pomin` (część wczytana i opisana, bez par) |
| `zmienne` | ψ, θ, G, D: kotwica kraty = położenie, w którym część jest w STL |
| `zakresy` | pudełka zmiennych; `podazanie` dodaje warunek z koncepcji pkt 6; `zakres_siatki` wskazuje zakres, na którym leży krata (największy) |
| `siatka` | `krok_deg` (sprawdzany wobec `krok_mm_max` na `R_ref`), `zageszczenie_mm`, `odciecie_mm`, `rejestr_miejsc_mm`, `odcinek_krawedzi_mm`, `komorka_mm`, `krok_zgrubny_daleko` |
| `strefy` | styki zamierzone (np. luz osiowy uch na osi M3): walec wokół osi, `os_abs_min`, `rho_max`, `kierunek_osiowy_min`, własny `wymagany` |
| `pary` | `a`, `b`, `wymagany`, opcjonalnie `strefy`; część A jest przenoszona do układu części B |
| `weryfikacja_geometrii` | kontrole położenia: `promienie`, `kat_krawedzi`, `kat_biegunowy_max`, `os` (dopasowanie okręgu wokół osi) |
| `kontrole` | przypadki kontrolne: przesunięcie części, stany, oczekiwane minimum, kolizja albo głębokość |

**Kinematyka:**
- Gałka: R = Rx(−θ)·Ry(ψ) wokół początku; ψ+ to spojrzenie w prawo, θ+ w górę (koncepcja v3.1, układ współrzędnych).
- Powieki: obrót wokół osi X. G i D to kąt krawędzi przedniej od +z ku +y, tak jak `zamkG`, `otwG`, `zamkD`, `otwD`. Obrót R = Rx(−(kąt − `kat_modelu`)).
- Siatki etapu 1 są w położeniu zamkniętym: G −8,5°, D −11,5°.

## Metoda

**Odległość siatka–siatka jest dokładna, bez próbkowania.**
- Dla dwóch rozłącznych powierzchni trójkątnych minimum leży w jednej z trzech par:
  - wierzchołek A – trójkąt B;
  - wierzchołek B – trójkąt A;
  - krawędź – krawędź z punktami wewnątrz obu krawędzi.
- Punkt–trójkąt liczy algorytm Ericsona 5.1.5, odcinek–odcinek Ericsona 5.1.9, wektorowo w blokach do 1,5 mln par.
- Rodzina krawędź–krawędź jest ograniczona do krawędzi **wypukłych** obu siatek. Wnętrze krawędzi wklęsłej albo płaskiej nie może być najbliższym punktem dla punktu spoza bryły: jej zewnętrzny obszar Woronoja jest pusty, a przy krawędzi płaskiej to samo minimum osiąga ściana. Wewnętrzne powierzchnie czasz, zwrócone do gałki, są wklęsłe, więc ta zasada usuwa prawie wszystkie pary.
- Krawędzie są pocięte na odcinki ≤ 0,5 mm wyłącznie dla zwartości indeksu; odległość odcinków jest dokładna.

**Indeks przestrzenny.**
- Krata komórek 0,75 mm w układzie części B (i osobna w układzie A, dla drugiego kierunku).
- Element trafia do komórki, gdy środek komórki leży nie dalej niż odcięcie + ½ przekątnej komórki od elementu (dokładny test punkt–trójkąt albo punkt–odcinek).
- Każda para o odległości < odcięcia `c` (1,5 mm) jest więc znaleziona.
- Pary krawędź–krawędź są dodatkowo przycinane progiem max(rejestr miejsc, bieżące minimum stanu). Ich wynik nie może zmienić ani minimum, ani rejestru.

**Tryb daleki** działa, gdy w żadnym węźle pełnej kraty nie ma odległości < `c`.
- Pełna krata jest wtedy dowodem, że d ≥ c wszędzie.
- Wartość liczą gałęzie i granice po klastrach 4 mm (dokładnie, bez odcięcia) na kracie zgrubnej co 2°, a potem zagęszczenie.

**Przenikanie.**
1. Przecięcie powierzchni: test odcinek–trójkąt (Möller–Trumbore) dla wszystkich odcinków krawędzi A wobec trójkątów B i odwrotnie. Wąska krata o zapasie ½ odcinka.
2. Zawieranie bez przecięcia: test parzystości promienia z jednego wierzchołka każdej składowej spójnej, 3 kierunki, większość głosów. Uruchamiany tylko wtedy, gdy obwiednia jednej części mieści się w obwiedni drugiej.
3. Głębokość: największa odległość wierzchołka, który leży w drugiej bryle, od jej powierzchni. Znak daje pseudonormalna najbliższego elementu (ściana, krawędź albo wierzchołek, ważona kątami; Bærentzen–Aanæs). Kolizja jest w wyniku odległością ujemną, −głębokość.
- W trybie dalekim osobny test przecięcia nie jest potrzebny. Krawędź przebijająca trójkąt ma do jego brzegu ≤ promień wpisany trójkąta. Jeśli więc d > największy promień wpisany obu siatek (≤ 1,57 mm w etapie 1), przecięcia nie ma.

**Stany.**
- Każda para jest liczona na rzucie pełnego iloczynu ψ × θ × G × D na zmienne, od których zależy. Pozostałe zmienne nie zmieniają pary, więc to jest dokładnie równoważne pełnemu iloczynowi.
- Krata co 0,5° (0,288 mm na R33) ma kotwice w położeniu modelu. Krata zakresu mechanicznego zawiera węzły zakresów pracy, których brzegi leżą na kracie.
- Brzegi zakresu mechanicznego poza kratą są pokryte z dokładnością ≤ ½ kroku i liczone dokładnie w narożnikach.
- Stany o tej samej pozie względnej A→B liczy się raz (klucz z zaokrąglonej macierzy). Przykład: Gałka – Powieka zależy tylko od ψ i θ − ΔG, więc 940 tys. węzłów daje 21 tys. póz.

**Zagęszczenie.**
- Przeszukiwanie wzorcem, sąsiedzi 3^k − 1, od 3 najlepszych, rozłącznych węzłów każdego zakresu (osobno dla minimum ogólnego i „poza strefami”), plus narożniki zakresu.
- Krok spada od ½ kroku kraty do 0,0625° (0,036 mm na R33).

**Ograniczenie dolne w ciągłym zakresie** = minimum węzłów − Σ L_v·½ kroku.
- L_v to przemieszczenie punktu A w układzie B na 1 rad. Przy obrotach wokół początku L_v = max |p_A| razy liczba części pary, które zależą od v.
- To zgrubna, ale ścisła granica dla stanów między węzłami.

**Rejestr miejsc.**
- Wszystkie odległości < 1,0 mm są grupowane w wokselach 1 mm (środek odcinka najbliższych punktów, w układzie B), a woksele łączone w skupiska.
- Każde skupisko ma minimum, stan, punkty, kierunek szczeliny i klasyfikację strefy.
- Strefa zamierzona to obszar walca wokół osi plus szczelina skierowana wzdłuż osi (|cos| ≥ 0,9). Styk przy osi, ale w poprzek osi, nie jest więc chowany.

**Dowód działania (`--test` i `kontrole` w JSON):**
- testy jąder punkt–trójkąt i odcinek–odcinek wobec gęstego próbkowania;
- kostki:
  - ściana–ściana 0,3;
  - krawędź–krawędź 0,4 (krzyżujące się grzbiety, wykrywa to tylko rodzina krawędź–krawędź);
  - krawędzie wchodzące na 0,4 bez wierzchołka w środku (przecięcie);
  - kostka w kostce (zawieranie);
  - ściany wchodzące na 0,3 (głębokość 0,300);
  - zgodność trybu bliskiego i dalekiego;
- na siatkach etapu 1:
  - Powieka górna przesunięta o −0,7 mm w y daje 0,49 (oczekiwane 0,5);
  - o −1,5 mm daje przenikanie 0,31 (oczekiwane 0,3);
  - Słupek przesunięty o +33 mm w z: przenikanie 0,548 (rachunek 0,544 + strzałka siatki);
  - Powieka dolna za ogranicznikiem: przenikanie.

## Ograniczenia

- Wynik dotyczy siatek z eksportu (tolerancja cięciwy ok. 0,01 mm), a nie brył CAD. Szczelina współśrodkowa 1,2 wychodzi 1,19.
- Dokładna wartość tylko poniżej odcięcia `c`. Powyżej `c` pełna krata daje tylko „≥ c”, a wartość pochodzi z kraty zgrubnej 2° z zagęszczeniem.
- Zagęszczenie jest lokalne (od 3 najlepszych węzłów), a nie pełną kratą 0,05 mm. Stany między węzłami pokrywa tylko granica Lipschitza, ścisła, ale zgrubna: ½ kroku to 0,15–0,39 mm zależnie od pary.
- Na rancie powieki R34,7 krok 0,5° to 0,303 mm (na R33: 0,288).
- Zakresy:
  - „praca” to pełny iloczyn, nadzbiór pracy z podążaniem;
  - „praca_podazanie” stosuje warunek podążania;
  - zakres mechaniczny gałki to prostokąt ψ ±28,05 × θ ±18,12, nadzbiór rzeczywistego okna.
- Przenikanie wymaga siatek zamkniętych i zgodnie zorientowanych; narzędzie to sprawdza i wypisuje.
  - Głębokość większa niż `c` jest obcięta do `c`.
  - Styk współpłaszczyznowy daje odległość 0, ale może nie dać flagi przecięcia.
  - Test parzystości jest narażony na promień styczny (stąd 3 kierunki).
- Strefy są klasyfikowane po położeniu środka odcinka najbliższych punktów. Minimum „poza strefami” jest dokładne, gdy jest < 1,0 mm, inaczej podawane jako ≥ 1,0.
- Śruby, kable, serwa, Płyta i części etapu 2 nie są w modelu.

## Etap 2: napęd gałki U–R–U (koncepcja v3.2 pkt 3.2–3.5)

Konfiguracja: `e6-siatki-ruch-etap2.json`. Uruchomienie:

```
python3 e6-siatki-ruch.py e6-siatki-ruch-etap2.json [--zastepcze KATALOG]   # → e6-siatki-ruch-wynik-etap2-zastepcze.{txt,json}
```

### Kinematyka (`stan_napedu`, `kinematyka_pretow`)

Dla stanu (ψ, θ) i napędu k ∈ {X, Y} (stałe w sekcji `naped` JSON, z `e6model`/`kinematyka.py` v3.2):
- P = Rx(−θ)·Ry(ψ)·P0 – środek krzyżaka przy gałce;
- α – kąt serwa z IK (wzór zamknięty pkt 3.4, gałąź „−”, L = |P0 − C − w|);
- H = C + Rx(α)·w – środek krzyżaka przy orczyku; e = (H − P)/|H − P|;
- przy gałce: sworzeń a1g = R·a1_galka_b (stały w Uchwycie), sworzeń pręta a2g = e × a1g (⊥ a1g i ⊥ e);
- przy orczyku: a1o = Rx(α)·a1_orczyk0 (stały w Ramieniu), a2o = e × a1o.

**Obrót pręta wokół własnej osi wyznacza przegub przy gałce**: pręt ma ramę [e, a2g, e × a2g]. Obrotnica przenosi różnicę na widełki pręta przy orczyku, które mają ramę [e, a2o, e × a2o].

Człony (`"ruch": {"typ": "pret_ik", "naped": "X", "czlon": …}`); każda siatka jest w położeniu zerowym:

| `czlon` | Co | Rama / środek obrotu |
|---|---|---|
| `ramie` | Ramię z widełkami orczyka i sworzniem a1 | Rx(α) wokół osi wałka przez C |
| `krzyzak_orczyka` | krzyżak przy orczyku | [a1o, a2o, a1o × a2o], H |
| `widelki_preta_orczyka` | widełki pręta za obrotnicą, łby sworzni a2 | [e, a2o, e × a2o], H |
| `pret` | pręt z widełkami przy gałce, tulejka obrotnicy, wkręt M3 | [e, a2g, e × a2g], P |
| `krzyzak_galki` | krzyżak przy gałce | [a1g, a2g, a1g × a2g], P |

Uchwyt (widełki stałe, sworznie a1 przy gałce) ma `"typ": "z_galka"`. Poza członu to R = F(q)·F(0)ᵀ, t = c(q) − R·c(0).

**Test kinematyki** (przy każdym biegu, w wyniku `test_kinematyki`):
- kąty serw w 8 położeniach wobec tabeli pkt 3.4 (±0,1°);
- zgięcia przegubów wobec `kinematyka.json` (gałka X 19,4/23,6°, orczyk X 7,6/8,9°, Y 17,8/21,4° i 8,5/12,0°);
- więzy U–R–U: |H − P| = L do 1e-9, a2 ⊥ a1, a2 ⊥ e;
- poza zerowa każdego członu = tożsamość.

Raport podaje też zakres obrotnicy względem zera (X ok. ±13,6°, Y −4,3…+7,5°).

### Pary i strefy

- `grupy_par` rozwija pary:
  - człony napędu × Gałka, powieki, Rama, Słupek, Płyta;
  - Uchwyt × powieki, Rama, Słupek, Płyta;
  - wszystkie człony i Uchwyt wzajemnie.
  Razem 120 par. `pary_wykluczone`: Uchwyt–Gałka (skręcone na sztywno).
- **Pary wewnętrzne przegubów** liczy się jak każdą inną parę: krzyżak–widełki, policzki wobec policzków, łby sworzni, tulejka – podstawa widełek. Styki zamierzone odfiltrowują `strefy_par`:
  - **luz osiowy a1/a2** przy gałce i przy orczyku: oś sworznia przez P albo H, szczelina wzdłuż osi (|cos| ≥ 0,9), ρ ≤ 3, wymagane 0,2 (tabela AGENTS);
  - **obrotnica**: oś e przez H, wymagane 0,05 (luz osiowy 0,1 z pkt 3.3);
  - **osadzenie Ramienia** na wieżyczce własnego serwa: oś x przez C, wymagane 0,2.
- Osie stref w JSON to symbole położenia zerowego (`P_X`, `H_X`, `C_X`, `e_X`, `a1g_X`, `a2g_X`, `a1o_X`, `a2o_X`, `x/y/z`) albo liczby. Strefa leży w układzie części B pary, a te osie są stałe w obu częściach pary.
- Szczelina w poprzek osi sworznia, nawet przy samym przegubie, nie jest chowana: idzie do minimum „poza strefami” z wymaganiem 0,5.

### Przeszukiwanie stanów (`"strategia": "bnb"`)

Pręty nie dają powtarzalnych póz względnych. Pełna krata 3D (ψ × θ × G: 2,3 mln węzłów) jest więc za droga. Zamiast niej:
- **gałęzie i granice po kracie:** poziomy co 16, 8, 4, 2, 1 kroków 0,5°, zakotwiczone w zerze, wspólne dla zakresów;
- **węzeł o kroku S** ma ograniczenie dolne d − Σ L_v·(S/2)·krok. Pudełko jest dzielone, dopóki to ograniczenie < `bnb_prog_mm` (1,0 mm);
- L_v jest numeryczne (`lipschitz_num`): różnice skończone 0,25° na siatce 4^k stanów, największe przemieszczenie punktu A w układzie B, × 1,25. To nie jest dowód, ale dla obrotów wokół początku daje dokładnie max |p| × 1,25;
- **ocena stanu** w trybie `oba`: indeks do odcięcia c = 1,5 mm (z testem przecięcia), a gdy nic nie ma bliżej, dokładna odległość z klastrów;
- **każdy stan, który może mieć < 1,0 mm, jest policzony na pełnej kracie 0,5°.** Dla par dalszych podawany jest najlepszy węzeł zgrubny + zagęszczenie wzorcem (wartość dokładna w znalezionym stanie) i ograniczenie dolne w ciągłym zakresie.

### Siatki zastępcze (do czasu eksportu etapu 2b)

Części z `"zastepcza": true` generuje narzędzie przy każdym biegu (`generuj_zastepcze`). Domyślnie trafiają do katalogu tymczasowego, z `--zastepcze KAT` do wskazanego. Powstają w położeniu zerowym, z osi z sekcji `naped` i z wymiarów:
- przeguby, pręt, Ramię, Uchwyt: `zastepcze.wymiary` w JSON, zamrożone na v3.2 (zgodne z osiami `naped`);
- Płyta: `e6model.fixed_prims()` z bieżącego `e6-przemiatanie/e6model.py`.

Bryły siatek zastępczych:
- **krzyżaki:** krążki Do × Hr wzdłuż pręta;
- **widełki:** dwa policzki (prostopadłościan + walec końca R rP/rS wokół sworznia) w odległości Do/2 + luzOs od środka, z podstawą;
- **widełki Ramienia:** obrócone o `katWidelek`, ze stopą do Ramienia;
- **pręt:** Ø4,5 z tulejką Ø7 × 6, luz osiowy obrotnicy 0,1;
- **Ramię:** płytka 6 × 8 i piasta Ø14;
- **Uchwyt:** widełki stałe X/Y, wsporniki 4 × 4, łączniki, tuleja przednia (bez płyty okna, żebra i łap);
- **Płyta:** serwa (korpus, klatka, ucho, łby, kable, wieżyczka skrócona o 0,25), wspornik, słupki Płyty, tarcza bez okien, słupki stopu.

Bryły jednej części mogą się nakładać. Odległości to nie zmienia: wewnętrzne ściany nie są bliżej żadnego punktu z zewnątrz. Zawodzi tylko test parzystości dla zawierania (ograniczenie).

**Sworznie nie są w siatkach zastępczych:** krążek nie ma otworów. Para sworzeń–otwór krążka (c ≈ 0,03–0,05) pojawi się dopiero na siatkach z CAD. Trzeba ją wtedy dopisać jako strefę „sworzeń w otworze”: oś sworznia, kierunek `promieniowy`, `rho_max` ≈ promień otworu + 0,3, wymagane według decyzji B9.

**Wymiary zastępcze są w JSON, nie w `e6model.py`.** `e6model.py` był w trakcie zmian (luzOs 0,125, Do 5,75, a1 = −y), co rozjeżdżało wymiary z osiami v3.2. Wynik zapisuje skrót sha256 `e6model.py` użytego do Płyty (`parametry_zastepcze`). Kontrole K0/K1 mają wartości oczekiwane jako wyrażenia z tych wymiarów (np. `"0.6 - uOrcz.luzOs"`).

### Jak podłączyć siatki z eksportu etapu 2b

1. **Eksport z Onshape:** STL każdej części osobno, w mm, w **położeniu zerowym** napędu (ψ = θ = 0, α = 0, czyli Ramiona w +y, środki krzyżaków P0/H0 z tabeli `naped`). Krzyżaki, widełki pręta przy orczyku, pręty i Ramiona to osobne części, zgodnie z tabelą członów. Sworznie M2 eksportować razem z częścią, w którą są wkręcone: sworzeń a1 przy gałce z Uchwytem, a2 przy gałce z prętem, a1 przy orczyku z Ramieniem, a2 przy orczyku z widełkami pręta. Wkręt M3 obrotnicy eksportować z prętem.
2. **W `e6-siatki-ruch-etap2.json`** przy każdej takiej części: usunąć `"zastepcza": true`, dodać `"plik": "<nazwa STL>"`. Wszystkie STL w `katalog_siatek`, albo osobny katalog przez `--siatki`.
3. **Stałe `naped`** (P0, C, w, a1_galka_b, a1_orczyk0, r, h) muszą odpowiadać CAD. Sprawdzić je w `weryfikacja_geometrii`, np. typ `os` dla otworów sworzni w krzyżakach i promień krążka. Przy zmianie wymiarów przepisać je z `e6model` (snippet w historii: `M.Horn`, `M.uu_frames`, rzut a1 ⊥ e0).
4. **Dopisać strefy „sworzeń w otworze”** (punkt 3 wyżej) i ewentualnie zakres mechaniczny z granicy okna, jeśli okno i Słupek mają być w parach.
5. **Uruchomić i sprawdzić:** najpierw `test_kinematyki` i kontrole, potem tabela par. Kontrolę K1 (przesunięte Ramię) zostawić z wartością oczekiwaną liczbową z CAD.
