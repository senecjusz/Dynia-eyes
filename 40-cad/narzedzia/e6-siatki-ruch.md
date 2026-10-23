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

## Etap 2: jak dodać części

1. **Eksport:** STL każdej części w układzie koncepcji, w położeniu zerowym (ψ = θ = 0, serwa w zerze), do `katalog_siatek`.
2. **Uchwyt i inne bryły sztywno z gałką:** `"ruch": {"typ": "z_galka"}`. Zmienne ψ, θ i deduplikacja działają od razu.
3. **Pręty X/Y i Ramiona X/Y:** `"ruch": {"typ": "pret_ik", "pret": "X"}` (przykład w `_etap2_przyklad` w JSON). Trzeba wypełnić funkcję `kinematyka_pretow(czesc, stany)` w skrypcie. Ma zwrócić `R (n,3,3)` i `t (n,3)` dla każdego stanu (ψ, θ):
   - środek kulki M2 P = Rx(−θ)·Ry(ψ)·P0 (P0 z tabeli pkt 3.2);
   - kąt serwa α z IK: wzór zamknięty z pkt 3.2, gałąź „−”, C, w, L z tabeli dla `kulkaM5H`;
   - Ramię: obrót Rx(α) wokół osi wałka przez C;
   - środek kulki M5: Q = C + Rx(α)·w;
   - pręt: oś z Q do P (|P − Q| = L), obrót własny z najmniejszego obrotu od pozy zerowej. Pręt i obudowy są prawie obrotowe, więc obrót własny nie zmienia wyniku.
   - Do raportu część podaje `"lipschitz_mm_na_rad": {"psi": …, "theta": …}`. To największe przemieszczenie punktu części na 1 rad, policzone numerycznie z różnic skończonych na siatce stanów, z zapasem.
4. **Pary:** dopisać do `pary`, według macierzy z koncepcji pkt 10:
   - pręty × gałka, Uchwyt, Słupek, powieki, Rama;
   - pręt X × pręt Y;
   - Ramię × własny pręt.
   Styki zamierzone (przegub, czop w gnieździe, okno–Słupek) opisać jako `strefy` albo pominąć parę, jak w „Wykluczone z definicji”. Okno–Słupek jest stykiem zamierzonym na granicy zakresu mechanicznego: zakres mechaniczny gałki trzeba wtedy wziąć z granicy okna (lista punktów), a nie z prostokąta.
5. **Czas:** pary rosną z liczbą zmiennych pary. Deduplikacja nie działa, gdy pozy względne się nie powtarzają (pręty), więc 2D ψ × θ to ok. 8 tys. stanów na parę.
