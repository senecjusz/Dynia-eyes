# Manifest zdjęć

Opis każdego zdjęcia w `70-budowa/zdjecia/`. **Najpierw czytaj manifest, zdjęcie otwieraj tylko wtedy, gdy opis nie wystarcza** (oglądanie zdjęć zużywa dużo kontekstu).

## Zasady

- Jeden podfolder na temat: `RRRR-MM-DD-temat/` (np. `2026-10-25-pir/`); pliki `temat-NN.jpg|png`, zmniejszone (dłuższy bok ≤ 1600 px).
- Surowe zdjęcia i filmy: `70-budowa/raw/` (poza Gitem).
- Kto dodaje zdjęcie, dopisuje od razu wiersz poniżej. Zdjęcie bez wiersza = niedokończone.
- **Wymiary:** liczba, jednostka, dokładność i skąd skala (linijka obok, suwmiarka, proporcja do znanego wymiaru). Pomiar ze zdjęcia oddzielaj od pomiaru suwmiarką.
- **Użyte w:** plik, w który wymiar trafił (PRD, model, analiza), żeby było widać, co z tego wynika.

## Zdjęcia

| Plik | Data | Co pokazuje | Odczytane wymiary (dokładność, źródło skali) | Użyte w |
|---|---|---|---|---|
| `2026-10-25-kardan-5-5/kardan-01.png` | 2026-10-25 | Kardan 5/5 zgięty do oporu, widok z góry, linijka cm pod spodem (nie w płaszczyźnie osi) | zgięcie do oporu ok. 90° (±15°, ocena ze zdjęcia, oś piasty częściowo w skrócie perspektywicznym); obrys zgiętego ok. 23 × 17 mm (skala z linijki, ok. 52 px/cm, ±1 mm); A i B nieczytelne w tym ułożeniu | `20-analizy/2026-10-25-referencja-face-maker101-synteza.md` (przegub gałki) |
| `2026-10-25-kardan-5-5/kardan-02.png` | 2026-10-25 | Kardan 5/5 wyprostowany, z boku, na krawędzi linijki cm; widoczny łeb sworznia krzyżaka | długość ok. 26 mm (zgodna z 25,5 z suwmiarki); **A: czoło piasty → oś sworznia ok. 13 mm z obu stron** (krzyżak w połowie długości); **B: widełki przy krzyżaku Ø11 jak piasty (użytkownik: „szerokość to zawsze 11 mm”)**; dokładność ±1 mm (linijka ok. 44 px/cm, perspektywa) | `30-projekt/e6-pomiary.md`, synteza referencji |
