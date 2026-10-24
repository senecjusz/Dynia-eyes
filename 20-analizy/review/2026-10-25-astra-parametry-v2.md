Zadanie E6: parametryczność i spójność dużego oka v2. **Przebudowa poprawiła zależności modelu, ale weryfikacja nadal nie dowodzi poprawności całego mechanizmu po zmianie parametrów.**

Ponownie sprawdziłam bazowe 3MF: zero otwartych krawędzi, krawędzi nierozmaitościowych i trójkątów zdegenerowanych; każda część ma jedną bryłę, zbiorczy siedem. Warianty zginania oceniam na podstawie zapisanych wyników — nie wykonywałam ponownego eksportu.

**KRYTYCZNE**

**K1. Test dopuszcza rozpad części i nadal kończy wariant jako „gotowy”.**  
**Miejsce:** [wyniki zginania](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/40-cad/openscad/zginanie-v2.txt), `zginanie.sh`, raport nocny, wiersze 70–80.  
**Scenariusz porażki:** przy `Rg=31` dolna powieka ma **trzy bryły**. Kontrola kolizji obraca je razem jak jedną sztywną część, dlatego „0 przenikań” i osiągalna kinematyka nie ujawniają utraty połączenia ramion z czaszą. Eksport faktycznie się przeliczył, ale mechanizm nie zachował swojej struktury. Granica konstrukcji jest dopuszczalna; ten wariant musi jednak otrzymać wynik **niezaliczony / poza zakresem**.  
**Poprawka:** wymagać jednej bryły na część, kontrolować połączenie ramie–czasza oraz jawnie określić dopuszczalny zakres `Rg`. Naruszenie warunku powinno przerywać test z błędem. Samo wydrukowanie liczby brył tego nie zapewnia.  
**Pewność:** wysoka.

**WAŻNE**

**W1. Skrypty tylko częściowo korzystają z geometrii modelu.**  
**Miejsce:** [kinematyka, wiersze 6–13](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/40-cad/narzedzia/duze-oko-kinematyka.js:6), [kolizje, od wiersza 106](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/40-cad/narzedzia/duze-oko-kolizje.js:106).  
**Scenariusz porażki:**

- Kinematyka przy podaniu `parametry.json` przyjmuje położenia z modelu, ale bez argumentu używa starej geometrii. Potwierdziłam różnicę: **`s3.xs=-42` zamiast −41,4 mm**; długości drutów powiek **44,58/44,55 zamiast 44,56/44,56 mm**.
- Kolizje obowiązkowo czytają JSON, lecz promień wszystkich drutów pozostaje **0,5 mm**, mimo eksportowania `dDrut`. Zmiana drutu na posiadany Ø1,2 nie zwiększy jego obwiedni w kontroli.
- Własne liczby geometrii pozostają również dla wieżyczki serwa (**r=6**), orczyków (**2,5; 3,5; 1,5; przesunięcia 1 i 2 mm**) i końca tylnej piasty (**z=−2**).

**Poprawka:** wymagać kompletnego pliku parametrów i usunąć nieaktualny wariant domyślny. Eksportować także wymiary brył zastępczych; promień drutu wyprowadzać z `dDrut/2`.  
**Pewność:** wysoka.

**W2. Skok powiek i sposób rozwiązania kinematyki nie są wspólne dla obu skryptów.**  
**Miejsce:** kolizje, wiersze 92–101, 132 i 154; kinematyka, wiersze 30–47.  
**Scenariusz porażki:** `PAR.lev.skok` steruje położeniem dźwigni, ale kolizje nadal badają powieki do wpisanego **51,5°**, również przy tworzeniu siatek pozycji otwartej. Po zmianie `skok` badane położenie może nie odpowiadać modelowi. Dla kontroli gałka–dolna powieka otwarcie nadal wynosi dokładnie **−51,5°**, zamiast wynikać z solvera dolnej powieki. Ponadto kinematyka śledzi rozwiązanie od środka, a kolizje wybierają pierwiastek blisko `a0` osobno dla każdej pozycji. Po zmianie geometrii mogą wybrać różne gałęzie.  
**Poprawka:** współdzielić parametry zakresów i funkcje kinematyki; wszystkie położenia obu powiek wyliczać tym samym solverem.  
**Pewność:** wysoka.

**W3. Test zginania dowodzi częściowego przeliczenia, ale zestaw kontroli jest niewystarczający.**  
**Miejsce:** [raport nocny, sekcja testu](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/30-projekt/raport-nocny-2026-10-25.md:58), `zginanie.sh`.  
**Scenariusz porażki:** istnieją pozytywne dowody: dla `Rg=29/31` zmieniają się siatki i długości cięgien; dla `scianka=28/50` przesuwa się kołnierz; dla `luzObr=0,3` rosną zmierzone luzy osiowe. Brakuje jednak pomiarów oczekiwanych wymiarów brył i pełnych wyników kontroli. Skrypt zachowuje tylko pierwsze **16 wierszy** kolizji, nie wymusza warunków zaliczenia i nie propaguje niezawodnie błędów potoków.

Siatka kątowa **5×4** nie zawiera `φ=0`, a bazowa **8×6** pomija zero obu osi. Zagęszczenie obejmuje tylko okolice minimum drut–gałka znalezionego na tej siatce. Nadal brakuje końcówek Z, pełnego kardana, kabli i testu przecięć trójkątów. Wynik S1 **0,42 mm**, a przy `Rg=29` także S2 **0,44 mm**, nie spełnia nominalnego minimum **0,5 mm**.

**Poprawka:** zapisywać pełne wyniki i kody zakończenia, mierzyć oczekiwane zmiany wymiarów oraz wymuszać progi luzów i liczbę brył. Do istniejących wariantów dodać zmianę `dDrut`, `skok` i wymiaru serwa; sprawdzić również kombinację parametrów blisko granicy konstrukcji. Siatki ruchu muszą zawierać środek i minima wymagające zagęszczenia.  
**Pewność:** wysoka.

**W4. `luzObr` nie steruje wszystkimi pasowaniami obrotowymi.**  
**Miejsce:** [SCAD, zmienne bazowe i pochodne](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/40-cad/openscad/duze-oko-v2.scad:29).  
**Scenariusz porażki:** `dOsM2=2.4` jest niezależną liczbą. Przy zmianie `luzObr` z 0,2 na 0,3 mm luz promieniowy otworu na trzpieniu Ø2 pozostaje **0,2 mm**, chociaż rosną luzy osiowe i otwory drutów. Raport potwierdza więc przeniesienie wybranych luzów, nie całego parametru.  
**Poprawka:** rozdzielić średnicę trzpienia od luzu i wyliczać średnicę otworu; jeżeli pasowania mają różne luzy, nadać im osobne zmienne oraz osobne pomiary.  
**Pewność:** wysoka.

**W5. Sekcja 7 nie wystarcza jako jednoznaczny plan przeniesienia do Onshape.**  
**Miejsce:** [plan, sekcja 7](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/40-cad/onshape/duze-oko-v2-plan.md:94).  
**Scenariusz porażki:** plan przenosi nazwy i zależności, ale zawiera różnicę geometrii: szerokość kieszeni łba M5 ma wynosić **`dLebM5+4*luzLebR` = 10,5 mm**, podczas gdy SCAD używa **`dLebM5+2*luzLebR` = 10,0 mm**. Nie określa też wspólnego layoutu, więzów zapewniających pełne zdefiniowanie szkiców, jednoznacznych kierunków wszystkich operacji ani testów zginania z oczekiwanymi pomiarami. Kopiowanie listy zmiennych nie zapewnia K2–K9.

**Poprawka:** uzgodnić plan z aktualnym SCAD; uzupełnić layout, płaszczyzny, więzy, kierunki i granice operacji, użycie szkiców, budżet operacji oraz testy wymiarowe min/max. Przed odbiorem porównać bryły i luzy z bazowymi siatkami.  
**Pewność:** wysoka.

**DROBNE**

**D1. W BAZOWYCH pozostały bezpośrednie współrzędne rozmieszczenia próbki.**  
**Miejsce:** SCAD, wiersz 71.  
Pełna lista współrzędnych kartezjańskich:

| Zmienna | Bezpośrednio zadane położenie |
|---|---|
| `pXucha=3` | początek profilu ucha na płytce |
| `pZebroB=[24,5.25]` | położenie żebra B w XY |
| `pOtw2=[21,9.5]` | środek otworu na dwa druty |

Dodatkowo **`rUcha=20` bezpośrednio ustala `xUcha`**, a **`tylRant=8` ustala `zRant=-8`** — są niezależnymi decyzjami położenia względem środka gałki. `katyRamion` i `katyWkretow` są bezwzględnymi kierunkami kątowymi, dopuszczonymi przez deklarację zmiennych bazowych. Nie wynikają z dopasowania do sąsiednich części.

**Scenariusz porażki:** zmiana rozmiaru płytki lub profilu ucha nie zachowuje automatycznie odstępów między elementami próbki.  
**Poprawka:** położenia próbki wyprowadzić z jej krawędzi, wymiarów elementów i jawnych odstępów; niezależne położenia projektowe oznaczyć jako takie.  
**Pewność:** wysoka.

**D2. Deklaracja „w modułach tylko dozwolone liczby” nie jest dosłownie spełniona.**  
**Miejsce:** SCAD, moduły od wiersza 137.  
Pełny wykaz niedozwolonych wartości liczbowych w geometrii modułów:

- **`2` jako mnożnik**: wiersze **140, 146, 170, 193, 210, 217, 219, 222, 226, 243, 255, 256, 257, 269, 281, 301**. To głównie algebraiczne podwojenia, a nie ukryte wymiary.
- **`2` jako promień w `sphere(2)`**: wiersze **273–275**, sześć wystąpień — rzeczywisty, stały wymiar podglądu orczyków.
- **`8` jako `$fn`**: wiersz **262**, dwa wystąpienia — stała rozdzielczość podglądu drutów.

Indeksy `[2]` i dzielenie przez `2`, realizujące dozwolone `1/2`, nie są ukrytymi wymiarami. Ponadto `sphere(d=1)` w wierszu 262 wpisuje średnicę drutu na stałe: jedynka pełni tu rolę wymiaru, nie znaku.

**Scenariusz porażki:** zmiana `dDrut` nie zmienia podglądu, a wymiary podglądu orczyków nie mają wspólnego źródła z kontrolą kolizji.  
**Poprawka:** użyć zmiennych dla wymiarów i rozdzielczości podglądu; dopuścić jawnie algebraiczny mnożnik 2.  
**Pewność:** wysoka.

Bez zapisu plików i bez git; nie pozostawiłam procesów w tle.

**Werdykt: duże oko v2 wykazuje rzeczywiste zależności parametryczne, lecz nie ma jeszcze wystarczających dowodów spójności po zmianie parametrów ani kompletnego planu wiernego przeniesienia do Onshape.**