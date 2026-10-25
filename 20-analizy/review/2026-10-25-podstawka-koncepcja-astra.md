Zadanie: pełne review koncepcji podstawki v2. **Układ jest wykonalny, ale przed akceptacją wymaga korekt poniżej.** Obliczenia dotyczą koncepcji, nie pomiarów CAD.

1. **WAŻNE — szuflada, zgodność z zapasową Mantą.** Zaprojektowano wyłącznie obrys Baseusa. Komora 72 mm przy luzie 0,3 mm na stronę przyjmie powerbank szerokości najwyżej **71,4 mm**. Wymiana na Mantę pozostaje niepotwierdzona. **Poprawka:** uwzględnić obrys obu posiadanych powerbanków oraz położenie ich portów; sprawdzić wyjmowanie przy nieruchomej szufladzie. **Pewność: wysoka co do braku weryfikacji.**

2. **WAŻNE — SVG, łączniki RJ45 przed PCA9685.** Tył łączników wypada na `y≈156,4`, początek PCA na `y=165`: zostaje **8,6 mm**. Brakuje wtyków po wewnętrznej stronie łączników. Wtyk wystający około 17 mm, jak narysowany po stronie przedniej, nachodziłby na PCA o około **8 mm**, jeszcze przed zagięciem kabla. **Poprawka:** przesunąć PCA do tyłu i narysować oba końce łączników z przewodami. **Pewność: wysoka dla rysunku; rzeczywisty występ do pomiaru.**

3. **WAŻNE — M1, długość wkrętów.** Wzór pomija podkładkę grubości 4 mm. Przy docelowym zagłębieniu 15 mm powinno być **`L=t_lokalne + szczelina + 4 + 15`**. Dla `t=40`, bez szczeliny, potrzeba 59 mm; wkręt 55 daje 11 mm zagłębienia. Przy `t=55` nie dochodzi do sklejki. **Poprawka:** uwzględnić podkładkę w formule i opisanym już wybieraniu gniazd; przy wkręcie 55 uzyskać `t_lokalne + szczelina ≤36 mm`. **Pewność: wysoka.**

4. **WAŻNE — M1, założony kontakt dyni na Ø140.** Średnica dyni nie wyznacza jej powierzchni podparcia. Dla przykładowego dna kulistego Ø350–400 szczelina przy promieniu 70 wynosi **12,6–14,6 mm**. Wkręt dobrany bez tej szczeliny może nie złapać sklejki albo zgniatać miąższ. Ponadto `t` przy przesuniętym otworze nie oznacza grubości przy trzech wkrętach. **Poprawka:** Ø140 traktować orientacyjnie; dobrać trzy miejsca po ustawieniu dyni, według lokalnego kontaktu i grubości. **Pewność: wysoka dla zależności, średnia dla rzeczywistego kształtu dyni.**

5. **WAŻNE — uchwyt PIR, mocowanie i wysuwanie.** Kołnierz szerokości 50 nad przerwą 40 zachodzi na sklejkę tylko **5 mm na stronę**. Centralny wkręt Ø3 zostawia około **1 mm materiału** między otworem a krawędzią zarówno kołnierza, jak i sklejki. SVG pokazuje też korpus szerokości dokładnie 40 w przerwie 40: luz zerowy. **Poprawka:** poszerzyć kołnierz, np. do 64 mm, i zapewnić korpusowi luz 0,25–0,3 mm na stronę, również w pionie. **Pewność: wysoka.**

6. **WAŻNE — zasilanie, „najgorszy przypadek”.** Limit dwóch poruszanych SG90 nie ogranicza prądu pozostałych serw utrzymujących obciążoną pozycję. Przy własnych założeniach dokumentu: `0,72 + 2,1 + 0,06 + 0,335 ≈ 3,22 A`, wobec **5 V / 3 A** Baseusa. To scenariusz możliwego odcięcia, nie dowód, że wystąpi. Parametry TowerPro nie są pomiarem posiadanych Miuzei. **Poprawka/test:** nazwać prądy założeniami; istniejący test 11 serw wykonać przez kompletną wiązkę, rejestrując spadki i resety. **Pewność: wysoka dla bilansu, średnia dla rzeczywistych prądów.** [Baseus](https://baseus.my/product/baseus-airpow-20w-power-bank-20000mah-fast-charge-powerbank-for-ip-15141312-xiaomi-batterie-externe), [Espressif](https://www.espressif.com/sites/default/files/documentation/esp32-c3_datasheet_en.pdf).

7. **WAŻNE — spadki napięcia, niepełny tor.** Rachunek samej skrętki jest poprawny. Przy założonych prądach spadki wynoszą:

   | Grupa i obciążenie | Cu, 1,5 m | CCA, 1,5 m | Cu, 0,6–0,8 m | CCA, 0,6–0,8 m |
   |---|---:|---:|---:|---:|
   | SG90, 0,50 A | 0,063 V | 0,113 V | 0,025–0,034 V | 0,045–0,060 V |
   | SG90, 0,72 A | 0,091 V | 0,162 V | 0,036–0,048 V | 0,065–0,086 V |
   | MG90S, 0,75 A | 0,079 V | 0,141 V | 0,032–0,042 V | 0,056–0,075 V |
   | MG90S, 2,10 A | 0,221 V | 0,394 V | 0,088–0,118 V | 0,158–0,210 V |

   Jednak odcinek 0,8 m z dwoma ogonami po 0,15 m daje **1,1 m**, czyli dla dużego oka na CCA już **0,289 V** szczytowo — przed stykami, USB i przewodami serw. **Poprawka/test:** liczyć pełną długość i mierzyć napięcie przy najdalszym serwie. Piny V+ przenoszą tu po **1,05 A**; trzeba sprawdzić rzeczywiste styki Dupont i lutowania. V+ jest szyną zasilającą, niezależną od wyjść PWM układu PCA9685. **Pewność: wysoka.** [Adafruit — wyprowadzenia](https://learn.adafruit.com/16-channel-pwm-servo-driver/pinouts).

8. **WAŻNE — RJ45, założenie „zawsze 1:1”.** Istnieją łączniki proste oraz krzyżujące styki, więc sam wygląd gniazdo–gniazdo niczego nie gwarantuje. Błędny łącznik może zamienić zasilanie z sygnałem. **Poprawka/test:** sprawdzić wszystkie używane łączniki i każdą gotową wiązkę od końca do końca. T568B oraz pary zasilające **4–5 i 7–8 są rozpisane poprawnie**. Przywołanie PoE nie potwierdza dopuszczalności posiadanej skrętki CCA i styków. **Pewność: wysoka.** [Katalog producenta L-com](https://www.l-com.com/images/downloadables/product-guide/2020/2020_Master_Catalog.pdf), [TI — prądy PoE](https://www.ti.com/document-viewer/lit/html/SSZT530/GUID-C380D019-4CB4-409D-8526-06DF8E0F00BF).

9. **DROBNE — PIR, osłonka i wysokość.** `atan(14/(L+3))` daje **31,3° i 47,1°**, lecz zakłada punkt obserwacji 3 mm za kołnierzem; dokument jednocześnie wysuwa kopułkę o około 10 mm. Soczewka Fresnela ma rozłożone strefy, więc podanych kątów nie można gwarantować. SVG umieszcza oś około **34 mm nad stołem**, nie 40–60. **Poprawka/test:** oznaczyć kąty jako przybliżenie i sprawdzić wykrywanie przed docelowym stołem; test bez ludzi po rozgrzewce wykonać z aktywnym Wi‑Fi. Odległość ESP–PIR około 20 cm zgadza się z rzutem. **Pewność: wysoka dla niespójności, średnia dla pola detekcji.**

10. **DROBNE — tekst i SVG, niespójne liczby.** Listwa ma w tabeli długość **146 mm**, na SVG **116 mm**. Okręgi dyni odpowiadają **Ø380/350**, mimo podpisu Ø400/350. Dno 2,4 + ścianki 30 daje wysokość szuflady **32,4**, a powerbank z dnem zajmuje **34,4**, pozostawiając **10,6 mm** nad nim. Boczna podkładka Ø30 ma od kołnierza Ø100 około **2,6 mm**, choć oś wkręta rzeczywiście około 17,6 mm. **Poprawka:** ujednolicić wartości i sposób wymiarowania. **Pewność: wysoka.**

11. **DROBNE — tuleja, deklarowany zakres działania.** Długość 40 przy `t=22` kończy się równo ze spodem sklejki 18; przy `t=58` pozostawia **18 mm miąższu bez prowadzenia**. Luźny kołnierz nie zapewnia szczelności na nierównym dnie. **Poprawka:** opisać tuleję jako opcjonalną prowadnicę; usunąć obietnicę zatrzymywania soku albo samą tuleję, jeżeli prowadzenie kabli jej nie wymaga. **Pewność: wysoka.**

12. **DROBNE — druk i zbędne elementy.** Gabaryty wszystkich wymienionych części mieszczą się na A1 mini; szuflada 164 × 150 zostawia **16 × 30 mm** zapasu. Dno szuflady, podkładki i kołnierz tulei zapewniają poprawne powierzchnie startowe. Deklaracja „bez podpór” wymaga jednak otwartych gniazd RJ45 lub odpowiednio ukształtowanych nadproży oraz rowków PIR. **Poprawka:** zapisać te założenia do CAD. Wybrać już opisane lutowanie skrętki bezpośrednio do rozdzielacza: odpadają **3 łączniki, 3 ogony i 6 wtyków**; wariant M2 można usunąć z koncepcji. **Pewność: wysoka dla gabarytów i uproszczenia.**

Pozostałe sprawdzenia wypadają poprawnie na poziomie koncepcji:

- Otwarte tylne czoło umożliwia wymianę Baseusa bez ruszania elektroniki; zewnętrzna pętla USB-C nie blokuje toru wysuwania.
- Łańcuch ścianek jest poprawny: przód `18+102+40+102+18=280`, tył `18+154+90+18=280`. Otwór kończy się na `y=115`, szuflada zaczyna na `y=116`; ogranicznik pozostaje około **13,2 mm** od krawędzi otworu. Rzuty kołnierza i części pod płytą trzeba rozpatrywać na różnych wysokościach.
- Zapas przewodów 200 mm nominalnie pokrywa wysuw 164 mm z marginesem **36 mm**; musi być faktycznie wolną pętlą, także dla PIR.
- Dla 98 N, rozpiętości 244 mm, zastępczego pasa sklejki 100 × 18 i założonego `E=3 GPa` wychodzi około **0,20 mm ugięcia i 1,11 MPa** naprężenia. To szacunek; nie uzasadnia dodawania podpory środkowej. Kąt **31,9°** jest poprawny dla wycentrowanego środka ciężkości na wysokości 225 mm; tę wysokość trzeba pozostawić założeniem.

**Werdykt: koncepcji jeszcze nie przedstawiałbym do akceptacji — minimalnie trzeba uwzględnić Mantę, poprawić układ RJ45–PCA, łańcuch długości i miejsca wkrętów oraz uchwyt PIR, a zasilanie opisać jako założenie wymagające testu kompletnej wiązki.**

**Propozycje (poza zakresem)**

Brak.

Repo pozostało bez zmian; nie uruchomiłem procesów w tle.