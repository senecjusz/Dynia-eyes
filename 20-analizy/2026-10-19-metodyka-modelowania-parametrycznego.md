# Metodyka modelowania parametrycznego dla agentów w Onshape

Data: 2026-10-19. Research w internecie. Oznaczenia: **[F]** fakt ze źródła (link obok), **[I]** moja interpretacja.

## Co z tego wynika dla projektu

1. [F] Onshape i społeczność zgodnie zalecają: szkic layoutu (master sketch) na górze drzewa, multi-part Part Studio dla części o silnych relacjach, zmienne `#nazwa` zdefiniowane przed operacją, która ich używa, w pełni zdefiniowane szkice, odwołania do płaszczyzn i szkiców zamiast do ścian, które zmieniają się w kolejnych operacjach.
2. [F] API Onshape nie ma udokumentowanego pola, które zwraca stan zdefiniowania szkicu (fully/under-defined, DOF). Znacznik „Sketch is not fully defined” istnieje tylko w interfejsie, od września 2024. `featureStates` w udokumentowanym przykładzie pokazuje tylko `OK`, a według forum oznacza błąd jako `ERROR`.
3. [I] Zdefiniowanie szkicu trzeba więc sprawdzać inaczej: własnym liczeniem DOF z JSON szkicu (tak robi cadkit-mcp, offline), testem zginania modelu (zmień zmienną, zmierz geometrię) albo ręcznie: człowiek ogląda znaczniki w drzewie w przeglądarce. Wywołania z przeglądarki nie zużywają limitu API.
4. [F] Plan Free ma 2500 udanych wywołań API rocznie na użytkownika. [I] Runda weryfikacji musi być tania: jedno `GET /features` i jedno wywołanie FeatureScript na każdy pomiar, analiza JSON lokalnie.
5. [I] Problem v2.2 (współrzędne liczone w JS, tylko więzy coincident) to dokładnie to, przed czym ostrzegają źródła: solver bez wymiarów nie wie, co ma się przesunąć. Generowanie skryptem może zostać, ale skrypt musi emitować wymiary z wyrażeniami `#zmienna` i więzy geometryczne, a nie gotowe współrzędne.
6. [I] Źródła nie uzasadniają zmiany narzędzia. Uzasadniają zmianę kontraktu: najpierw zmienne i layout, potem szkice zwymiarowane do layoutu, potem operacje z mirror/pattern.

## Metody

| Metoda | Na czym polega | Źródło |
|---|---|---|
| Szkic w pełni zdefiniowany | Brak dowolności położenia i rozmiaru. Chroni przed zmianami „współpracowników i przyszłego siebie”. Kolory: niebieski to niedookreślony, czarny to zdefiniowany, czerwony to przedefiniowany | [Primer Onshape](https://cad.onshape.com/help/Content/Primer/defining_constraining.htm), [P. Chastell, forum](https://forum.onshape.com/discussion/25451/fully-defined-sketches-what-are-they-and-why-care) |
| Solver bez historii | Solver przesuwa jak najmniej, częściej zmienia mniej zdefiniowaną geometrię. Intencję trzeba zapisać wymiarem lub więzem. `Use` nie zmienia typu krzywej, więc łatwo się psuje | [Under the Hood: Onshape Sketches](https://www.onshape.com/en/blog/under-the-hood-onshape-sketches) |
| Layout/master sketch, top-down | Jeden szkic na górze drzewa steruje wieloma częściami, a potem trafia do innych Part Studio przez Derived. Ostrzeżenie: większość Part Studio powinna mieć jedną część | [Blog Onshape: elastyczne modele](https://www.onshape.com/en/blog/build-flexible-parametric-cad-models-adapt-change), [forum: in-context](https://forum.onshape.com/discussion/8458/best-practices-for-in-context-editing), [kurs multi-part](https://learn.onshape.com/courses/fundamentals-multi-part-part-studios) |
| Zmienne, Variable Studio, konfiguracje | `#nazwa` w każdym polu liczbowym. Zmienna jest operacją, więc musi stać przed operacją, która jej używa. Variable Studio udostępnia zmienne całemu dokumentowi | [Variable](https://cad.onshape.com/help/Content/variable.htm), [Variable Studio](https://cad.onshape.com/help/Content/variable_studio.htm) |
| Stabilne odwołania | Odwołuj się do szkiców, płaszczyzn i wcześnie powstałych operacji, nie do ścian zmienianych później. Nie wymiaruj do zaokrągleń | [forum: best practices](https://forum.onshape.com/discussion/19938/looking-for-general-best-practice-suggestions-as-i-improve-my-skills) |
| Kolejność operacji | Wykończenia (zaokrąglenia, fazy) na końcu. Mirror po wszystkich operacjach, które ma objąć | [Pomoc Onshape: wydajność](https://cad.onshape.com/help/Content/Home/performance_considerations.htm), [Javelin: Mirror](https://www.javelin-tech.com/blog/2021/08/working-with-the-solidworks-mirror-feature/), [build123d tips](https://build123d.readthedocs.io/en/latest/tips.html) |
| Mirror/pattern | Wzór operacji powtarza całe operacje. Przykład: okrąg otworów to jeden otwór na okręgu konstrukcyjnym zwymiarowanym do `#bcd`, a potem szyk kołowy. „Reapply features” tylko gdy trzeba | [cadkit-mcp](https://github.com/saltyeg/cadkit-mcp), [Blog Onshape](https://www.onshape.com/en/blog/build-flexible-parametric-cad-models-adapt-change) |
| Kontrola jakości w innych CAD | SolidWorks Design Checker sprawdza „Fully Defined Sketch” i „Feature Error/Warnings”. Creo ModelCHECK sprawdza `WEAK_SKETCHER_DIMS` i `REGEN_ERRS` | [SW Design Checker](https://help.solidworks.com/2016/English/SolidWorks/solidworks_design_checker/r_feature_checks_overview.htm), [Creo WEAK_SKETCHER_DIMS](https://support.ptc.com/help/creo/creo_plus/usascii/model_analysis/modelcheck/WEAK_SKETCHER_DIMS.html) |

VDA 4955: znalazłem tylko opisy narzędzi, które go wdrażają ([SF GEOCHECK](https://www.sf.com/en/ptc-creo-design-automation/cad-data-quality-check/)), bez treści normy. Nie wiem, czy wymaga zdefiniowanych szkiców.

## Kryteria rundy weryfikacji jakości modelu

Źródło danych do automatycznego sprawdzenia to jedno `GET .../partstudios/.../features`. [F] Odpowiedź zawiera `features` (szkice jako `BTMSketch-151` z `entities` i `constraints`), `featureStates` oraz parametry `BTMParameterQuantity-147` z polem `expression` ([Feature access](https://onshape-public.github.io/docs/api-adv/featureaccess/)). Pomiar geometrii daje endpoint FeatureScript (`evBox3d`, tylko lambda) ([Evaluate FeatureScript](https://onshape-public.github.io/docs/api-adv/fs/)).

| # | Kryterium | Jak sprawdzić | Źródło / status |
|---|---|---|---|
| K1 | Wszystkie `featureStatus` = `OK`, zero ERROR i WARNING | Automatycznie, `featureStates` | [forum](https://forum.onshape.com/discussion/21479/reading-feature-related-infromation). Lista wartości enum nie jest udokumentowana |
| K2 | Każdy szkic w pełni zdefiniowany | (a) Ręcznie: znacznik w drzewie, bez zużycia limitu API. (b) Automatycznie: własny bilans DOF z `entities` i `constraints` (np. punkt 2, odcinek 4, okrąg 3), tak jak `cad_sketch_analyze` w cadkit. (c) Jednorazowy eksperyment: czy `featureStatus` szkicu niedookreślonego różni się od zdefiniowanego | Brak pola w API: [primer](https://cad.onshape.com/help/Content/Primer/defining_constraining.htm), [cadkit](https://github.com/saltyeg/cadkit-mcp). Liczenie DOF to [I], do zweryfikowania |
| K3 | Wymiary główne wpisane jako `#zmienna` | Automatycznie: udział `expression` zawierających `#` w szkicach i operacjach. Próg ustala operator. Literały dopuszczalne dla wartości jednorazowych | [cadkit, zasady](https://github.com/saltyeg/cadkit-mcp), [Variable](https://cad.onshape.com/help/Content/variable.htm) |
| K4 | Szkice zwymiarowane, nie tylko złożone z coincident | Automatycznie: liczba więzów wymiarowych w `constraints` na szkic > 0 i proporcjonalna do liczby encji | [I] na podstawie [Under the Hood](https://www.onshape.com/en/blog/under-the-hood-onshape-sketches) |
| K5 | Powtórzenia przez mirror/pattern | Automatycznie: liczba operacji mirror i pattern, wykrywanie szkiców o tym samym kształcie (ten sam zestaw encji z przesunięciem) | [I]. Wzorzec: [cadkit](https://github.com/saltyeg/cadkit-mcp) |
| K6 | Gęstość drzewa | Automatycznie: operacje i szkice na część, encje na szkic. Wiele szkiców z jedną encją to sygnał modelowania atomowego | [I], [forum: fewer features](https://forum.onshape.com/discussion/19938/looking-for-general-best-practice-suggestions-as-i-improve-my-skills) |
| K7 | Layout na górze, zmienne przed użyciem | Automatycznie: kolejność w `features` | [Variable](https://cad.onshape.com/help/Content/variable.htm) |
| K8 | Stabilne odwołania | Automatycznie: typy zapytań w `sketchPlane` i odwołaniach (płaszczyzna lub szkic albo ściana). Ręcznie: ocena, które ściany przetrwają zmianę | [forum](https://forum.onshape.com/discussion/19938/looking-for-general-best-practice-suggestions-as-i-improve-my-skills) |
| K9 | Test zginania | Automatycznie: dla 3–5 kluczowych zmiennych ustaw wartość min i max, potem K1 i pomiar `evBox3d`. Geometria ma się zmienić w oczekiwany sposób i nic nie może się wysypać. Koszt to około 3 wywołania na wariant | [F] Podobne testy: perturbacje rodzin parametrów w [CADEngBench](https://arxiv.org/abs/2608.09296), metryki edycji w [HistCAD](https://arxiv.org/abs/2602.19171) |
| K10 | Nazwy operacji i zmiennych mówią o intencji | Ręcznie, człowiek | [Blog Onshape](https://www.onshape.com/en/blog/build-flexible-parametric-cad-models-adapt-change) |

[F] Limit Free: 2500 udanych wywołań na rok, odpowiedzi 4xx i 5xx się nie liczą ([API limits](https://onshape-public.github.io/docs/auth/limits/)).

## Projekty agentów CAD

| Projekt | Link | Co warto przejąć |
|---|---|---|
| cadkit-mcp (Onshape) | [github](https://github.com/saltyeg/cadkit-mcp) | [F] `cad_sketch_close(require_well_formed=true)` odmawia wysłania niedookreślonego szkicu. `cad_sketch_analyze` liczy DOF offline. Wymiary przyjmują `#var`. Selekcja ścian i krawędzi po geometrii, nie po ID. Licznik wywołań API. Pomiar zbiera bbox, objętość i zmienne w jednym wywołaniu FeatureScript. To najbliższy gotowy wzorzec dla tego projektu |
| hedless/onshape-mcp | [github](https://github.com/hedless/onshape-mcp) | [F] Zmienne dla wymiarów prostokąta i głębokości. Więzy szkicu nie są jeszcze zaimplementowane, mirror nie ma. [I] Przykład tego, czego unikać |
| Onshape FeatureScript MCP (Labs) | [blog 1](https://www.onshape.com/en/blog/featurescript-mcp-server-use-cases-text-code-cad), [blog 2](https://www.onshape.com/en/blog/get-started-featurescript-mcp-server) | [F] LLM pisze własne operacje FeatureScript („fully parametric”) i może skonsolidować fragment drzewa w jedną operację. Zaleca walidację „design intent” jak pierwszego szkicu nowego kolegi. Nie znalazłem informacji, czy działa na planie Free |
| Zoo Zookeeper (KCL) | [KCL](https://docs.zoo.dev/research/introducing-kcl), [Zookeeper](https://docs.zoo.dev/research/zookeeper) | [F] Agent często uruchamia model i ogląda zrzuty z kilku widoków |
| Parametric CAD Bench | [cadbench.ai](https://cadbench.ai/) | [F] Według [opisu wtórnego](https://hodgesj.substack.com/p/benchmarks-for-ai-models-and-agents) ma bramkę edytowalności dla modeli FreeCAD. Definicji bramki nie znalazłem |
| LLM4CAD-Editor | [arXiv](https://arxiv.org/abs/2606.20607) | [F] Odwołania przez nazwy operacji zamiast współrzędnych dają bardziej niezawodne edycje |
| CADEngBench, HistCAD | linki w K9 | [F] Edycja ma być testowana zmianą parametru i pomiarem, a nie wyglądem |
| „Wrong Design Intent Is Worse Than None” | [arXiv](https://arxiv.org/html/2607.23191v1) | [F] Metryka intencji liczona etykietami generatora może być cykliczna. [I] Test zginania mierz geometrią |

Gotowego rubryka ani promptu weryfikacyjnego dla agentów CAD typu „sprawdź jakość drzewa” nie znalazłem. Najbliżej są zasady projektowe cadkit i kryteria benchmarków.

## Kod czy natywne drzewo

- [F] Za kodem: Zoo argumentuje przejrzystością i diffami ([KCL](https://docs.zoo.dev/research/introducing-kcl)). Wiele prac generuje CadQuery ([CAD-Coder](https://arxiv.org/html/2505.19713v3)). FeatureScript MCP to oficjalny kierunek Onshape.
- [F] Przeciw albo ograniczenia: selektory build123d działają na współrzędnych globalnych i sortowanie bywa losowe ([tips](https://build123d.readthedocs.io/en/latest/tips.html)). Kod ma trudność z zaokrągleniami i fazami, które wymagają odwołań do B-Rep ([FutureCAD](https://arxiv.org/html/2603.11831v2)). LLM4CAD-Editor raportuje lepszą odporność edycji niż skrypty Python.
- [I] Kod nie daje parametryczności automatycznie. Obecny problem to właśnie kod JS z wyliczonymi współrzędnymi. Źródła nie uzasadniają zmiany narzędzia. Rozsądne jest zostawić Onshape i wymusić kontrakt K1–K9. FeatureScript można rozważyć tylko dla powtarzalnych detali (gniazdo, żebra), jeśli plan na to pozwala.
