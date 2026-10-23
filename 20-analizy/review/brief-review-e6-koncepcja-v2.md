# Review koncepcji dużego oka 2c, wersja 2 (E6.1b) – 23.10

Jesteś recenzentem. Trzech recenzentów (Fable i Opus – Anthropic, Astra – OpenAI Codex) dostaje ten sam materiał i pracuje niezależnie: **nie czytaj raportów innych recenzentów tej rundy** (`…-v2-*.md`) przed zapisaniem własnego. Tylko do odczytu: bez `git pull`, commitów, pushy i porządków w repo. Zapisujesz wyłącznie swój raport. Piszesz po polsku. Zasady recenzenta: `AGENTS.md`, „Zasady dla recenzenta” – review pełne, wagi KRYTYCZNE / WAŻNE / DROBNE, liczby zamiast opinii, dla każdej uwagi miejsce, scenariusz porażki, poprawka albo test, pewność. Bez prognoz czasu.

## Co oceniasz

**Koncepcję v2:** `20-analizy/2026-10-22-duze-oko-2c-koncepcja-v2.md` (realizator: Opus), napisaną według `30-projekt/brief-e6-duze-oko-koncepcja-v2.md` (i briefu v1 `30-projekt/brief-e6-duze-oko-koncepcja.md`) po pierwszej rundzie review: `20-analizy/review/2026-10-22-e6-koncepcja-astra.md`, `…-fable.md`, `…-opus.md` (wszystkie trzy: NIE dla v1). Z v2 orkiestrator napisze brief dla wykonawcy CAD (Onshape) – to ostatnia kontrola przed CAD.

Pytanie główne: **czy ten mechanizm zadziała po wydrukowaniu i złożeniu z tego, co użytkownik ma w warsztacie, i czy da się z niego od razu napisać brief CAD?**

## Decyzje użytkownika (fakty, nie oceniasz ich)

- 2c od razu; **4 × MG90S** – osobne serwo na każdą powiekę; gałka Ø60 (wkręty bez łba M3 są); otwór w dyni ≤ Ø80 (otwornica 80); lekko: bez Rury z gwintem, Nakrętki i kasety.
- Rozruch jak w małym oku: ostatni impuls w NVS i płynny powrót; skok akceptowany tylko po zaniku prądu w trakcie ruchu albo ręcznym przestawieniu – mechanizm ma go przeżyć bez kolizji.
- **Bez zakupów modelarskich** (przeguby, końcówki, popychacze, łożyska) – tylko to, co jest: przeguby kulowe RC 2 × M2 i 2 × M5, kardan 5/5 (pomiary w koncepcji), druty Ø1,0 i Ø1,2 sprężynowe, Ø2,0 ocynkowany, łożyska 608-2RS i 6802-2RS, MG90S Miuzei × 4. Śruby, nakrętki, podkładki dowolne (użytkownik dokupi albo skróci).
- Montaż w dyni razem z synem (narzędzia obsługuje ojciec); gałka biała, gładki front, tęczówkę rysuje syn.

## Sprawdź w szczególności (licz, nie oceniaj na oko)

1. **Czy każda uwaga KRYTYCZNA i WAŻNA z pierwszej rundy jest naprawdę zamknięta** – tabela „uwaga → co zrobiono” w v2; sprawdź liczbami, nie deklaracją.
2. **Nowy napęd powiek:** dwa płaskie czworoboki (dźwignia na powiece, łącznik z drutu sprężynowego Ø1,2 z zagięciami Z, ramię orczyka), oś powiek wspólna z osią góra–dół (Cogley Simplified). Kąty, kąt nacisku, martwe punkty, kolizje w całym zakresie gałki i obu powiek niezależnie; zaczepy drutu (jak trzyma się drut w dźwigni i orczyku, luz, wypadanie, zużycie); siła przycięcia palca.
3. **Napęd gałki:** pręt drukowany z przegubem M2 przy gałce i M5 przy orczyku – czy mieszanie rozmiarów nie psuje kinematyki i obrysu; gwinty M2/M5 w druku (czy trzymają, jak wkręcane); ograniczniki w oknie Uchwytu wokół Słupka (zapas ≥ 0,5 w zakresie pracy, droga siły z pominięciem prętów i serw).
4. **Przemiatanie kolizji realizatora** (najciaśniej 0,52 mm drut–rura, 0,82 mm pręt–czasza; model uproszczony): czy uproszczenie nie ukrywa kolizji (łby, nakrętki, przeguby kulowe, kable MG90S, wycięcia czasz).
5. **Ochrona przekładni MG90S przed ręką dziecka** (realizator: do 0,64 N·m = 3,6 × moment zablokowania, ochrony z posiadanych części nie znalazł): zaproponuj rozwiązanie z tego, co jest (np. podatność drutu, sprzęgło cierne na orczyku, element zrywalny drukowany), z liczbami – albo potwierdź, że go nie ma, i oceń ryzyko.
6. **Masa ok. 225 g** (cel orientacyjny 130–150 g) i **głębokość 67 mm** za ścianką 15 mm (szacunek wolnego miejsca ok. 65 mm): czy mocowanie (Obejma) to utrzyma w mokrym miąższu z ręką dziecka; czy da się odchudzić bez cięcia ścianek < 2 mm.
7. **Obrys i montaż:** Ø79,5 przez Ø80, rant ≤ 2 mm poza otwór, kolejność montażu na stole, kroki w dyni (≤ 3 ruchy, bez łączenia przegubów), kroki syna.
8. **Luzy** (tabela `AGENTS.md`, powieka–gałka 1,0–1,2), **DFAM** (płasko na stole, nawisy, podpory; co mieści się na A1 mini 180 mm), **prąd 4 serw** i zachowanie bez PWM, kanały PCA9685.
9. **Gotowość do CAD:** schemat złożenia, tabela współrzędnych przegubów, znaki serw, zmienne, połączenia, stosy śrub – czy wykonawca narysuje bez zgadywania. Czy pytania blokujące (B1: wymiary przegubów kulowych M2/M5; B4: otwór ucha MG90S) są kompletne i czy koncepcja ma przedziały i warunki odrzucenia.
10. **Źródła:** czy linki pokazują to, na co się powołuje v2 (Cogley Simplified – wspólna oś powiek i góra–dół; EyeMech ε3.2 – osobne serwa powiek; „on the Cheap” – druty z haczykami). Oznacz, co sprawdziłeś w źródle, a czego nie.

## Raport

- Na końcu **werdykt jednym zdaniem:** TAK (gotowe do briefu CAD) / TAK PO POPRAWKACH – których (takie, które orkiestrator może wpisać wprost do briefu CAD) / NIE – co zmienić w architekturze.
- Plik: Fable → `20-analizy/review/2026-10-23-e6-koncepcja-v2-fable.md`, Astra → `…-v2-astra.md`, Opus → `…-v2-opus.md`.
