# Mechanizm oka – research (Gemini, 2026-10-17)

Pełny dokument: [whitepaper.md](whitepaper.md), obrazki w `img/`. Źródła z linkami: [10-inspiracje/mechanizmy-oka-zrodla.md](../../10-inspiracje/mechanizmy-oka-zrodla.md).

> Research przygotowany przez AI na podstawie filmów i opisów projektów. Wymiary i parametry traktujemy jako punkt wyjścia do weryfikacji w Onshape i na wydrukach testowych, nie jako pewnik.

## Wnioski dla naszych poziomów

### Poziom 1 – małe oczy z piłeczek
- **Kandydat: metoda Kosmo (2C).** Drukowane widełki w kształcie C, przykręcone do orczyka SG90, trzymają piłeczkę dwiema śrubami M3 po bokach. Serwo obraca oko bezpośrednio: bez popychaczy, drutów i kalibracji dźwigni. Jedno SG90 na oko w zupełności wystarcza, bo piłeczka waży 2,7 g.
- Praktycznie: zamiast drukować wielowypust pod wał serwa, lepiej przykręcić do widełek orczyk z zestawu SG90 (drukowany wielowypust rzadko dobrze trzyma).
- Oś obrotu wyznaczamy szwem piłeczki (metoda z gumką recepturką).
- Pierwsza część do zaprojektowania w Onshape: **widełki C + uchwyt SG90**, wydruk testowy z jedną piłeczką.

### Poziom 2 – duże oko z powieką
- Duże oko 70–80 mm: **pełna półsfera odsłania krawędź przy skręcie w bok** – czasza powinna wychodzić ~10 mm za równik albo powieki muszą zachodzić na kąciki.
- **Uwaga na SG90:** research ocenia, że przy oku 70–80 mm i powiece plastikowe przekładnie SG90 mogą nie wytrzymać szybkiego mrugania; zaleca **MG90S** (metalowe przekładnie, ten sam rozmiar). Opcje:
  1. dokupić 3–4 × MG90S do dużego oka (tanie, ten sam wymiar i sterowanie),
  2. zmniejszyć duże oko (np. 50–60 mm) i drukować lekko (cienka ścianka), zostając przy SG90,
  3. wolniejsze mruganie w programie (mniejsze obciążenie przekładni).
- Najprostsza powieka: **jedna ruchoma górna + nieruchoma dolna** = 1 serwo. Razem duże oko: 3 serwa (lewo–prawo, góra–dół, powieka).
- Budżet serw przy 8 × SG90: **5 małych oczu + duże oko na 3 serwach.**

### Wspólne dla wszystkich mechanizmów
- **Przed założeniem orczyków ustawić serwa na 90°** (impuls 1500 µs), dopiero wtedy montować dźwignie i potem ustalić programowe limity ruchu, żeby serwo nie napierało na ramę (buczenie, prąd 0,8–1,2 A). To będzie pierwszy program w `60-firmware/`.
- Otwory w wydrukach: ciasny pod wkręcenie i luźny pod obrót (tabela M2/M3/M4 w sekcji 4.2 whitepapera).

## Do decyzji
- [ ] Metoda Kosmo dla małych oczu – akceptujemy?
- [ ] Duże oko: średnica i serwa (MG90S vs SG90).
