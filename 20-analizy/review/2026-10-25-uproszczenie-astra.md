**Pierścień nie jest potrzebny do trzymania gałki oka.** W obecnym modelu gałkę podtrzymuje kardan, czyli przegub pozwalający obracać ją w dwóch osiach, zamocowany na słupku uchwytu serw. Pierścień służy do osadzenia mechanizmu w dyni i podparcia powiek; połączenie tych funkcji w jednej ciasnej tubie jest głównym źródłem komplikacji.

**Najbardziej ponad potrzebę są: podporządkowanie osi powiek tubie Ø79, dźwignie długości 7 mm oraz późniejsze poprawki ich połączeń.** Dodatkowo przyjęto otwieranie powiek tak szeroko, aby odsłaniały całą tęczówkę, chociaż PRD — dokument wymagań produktu — wymaga odsłonięcia źrenicy. Nie ma podstaw do przypisywania projektantowi działania „tylko żeby coś zrobić”; widać natomiast kolejne lokalne poprawki zamiast ponownego rozpatrzenia układu.

**Rekomenduję otwartą ramę podtrzymującą kardan i powieki, trzy serwa oraz drukowane łączniki powiek zamiast dwóch regulowanych drutów.** Pełną tubę można usunąć, zachowując cienką maskownicę krawędzi otworu. To koncepcja do sprawdzenia geometrycznego, nie gotowy zamiennik do druku: długie dźwignie i osie M3 wymagają miejsca, którego samo usunięcie ścianki tuby nie zapewni.

**Zadanie E6: raport Astry — krytyczna analiza uproszczenia dużego oka.**

Pracowałem wyłącznie do odczytu. Nie czytałem raportów pozostałych analityków tej rundy. Podstawą są aktualny model SCAD, instrukcja montażu, PRD, decyzje, koncepcja, raport nocny i wskazana historia problemów. Liczby opisane jako obliczenia dotyczą geometrii; nie są pomiarami działającego wydruku.

**1. Co rzeczywiście jest w mechanizmie**

W [modelu SCAD](C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/40-cad/openscad/duze-oko-v2.scad:209) jest **sześć części użytkowych do druku**: gałka, dwie powieki, pierścień, maskownica i uchwyt serw. Próbka połączeń oraz przyrząd do gięcia zwiększają zestaw do ośmiu obiektów, ale nie pracują w mechanizmie.

W tabeli „referencja” oznacza to, co można potwierdzić w opisie autora The Face. „Niepotwierdzone” nie oznacza dowodu nieobecności danego szczegółu.

| Element | Referencja The Face | Czy wymaga go PRD? | Ocena uzasadnienia |
|---|---|---|---|
| Gałka Ø60 | Gałki są | Tak | Konieczna. |
| Kardan w środku gałki | Przeguby uniwersalne są | Tak, wskazana zasada działania | Zasadny sposób podparcia; eliminuje potrzebę obejmowania gałki pierścieniem. |
| Słupek kardana i uchwyt trzech serw | Uchwyt serw jest | Funkcja konieczna | Zasadne. Konkretna forma może być prostsza. |
| Dwa połączenia serw z gałką | Druciane popychacze są | Tak, napęd dwóch osi | Konieczne przy nieruchomych serwach. Ich końcówki nie muszą mieć obecnej postaci. |
| Dwie kuliste powieki, czyli fragmenty powierzchni kuli | Powieki są; szczegóły górna–dolna niepotwierdzone | Dwie powieki tak; ten kształt nie jest jedyną możliwością | Kulisty kształt jest sensowny dla wyglądu i omijania obracającej się gałki. |
| Pierścień z pełną tubą | Niepotwierdzone | **Tak, obecny zapis z 24.10** | Mocowanie ma prawdziwą funkcję. Łączenie go z precyzyjnymi osiami powiek jest wyborem projektowym. |
| Kołnierz i łapy mocowania od środka | Niepotwierdzone | Tak, obecny zapis | Funkcja zasadna. Pełny kołnierz nie jest jedynym sposobem jej realizacji. |
| Maskownica Ø84 | Niepotwierdzone | **Tak, życzenie użytkownika** | Zakrywa cięcie. Nie należy uznawać jej za samowolny dodatek. |
| „Podkładki” osi powiek | Niepotwierdzone | Nie w tej postaci | To drukowane podpory osi wewnątrz tuby, nie zwykłe podkładki. Potrzebne obecnemu układowi, zbędne przy osobnej ramie. |
| Osie powiek M2, wkręcane w plastik | Niepotwierdzone | Nie | Rozwiązanie wtórne: dobrane dlatego, że pakiet M3 nie mieścił się przy tubie. Nie spełnia podanego w tym briefie zestawu M3/M4/M5. |
| Dźwignie powiek r = 7 mm | Szczegół niepotwierdzony | Nie | Najbardziej kosztowny kompromis. Oszczędza miejsce, zwiększa wpływ każdego luzu i błędu długości. |
| Rowek T w gałce | Niepotwierdzone | Nie | Bocznie dostępne gniazdo łba M5 umożliwia montaż bez otworu przez biały front. Ma prawdziwą funkcję, choć nie jest jedyną możliwością. |
| Okno w słupku pod łeb M5 | Niepotwierdzone | Nie | Dostęp montażowy do tylnego czopa kardana. Prostsza otwarta podpora mogłaby go zastąpić. |
| Ucha, następnie widełki w gałce | Połączenie z gałką jest; wykonanie niepotwierdzone | Potrzebny punkt zaczepienia, nie obecna forma | Widełki powstały jako odpowiedź na zakleszczanie wcześniejszych końcówek. Uzasadnienie prawdziwe, lecz wtórne. |
| Zagięcia Z drutu | Autor stosuje gięty drut; geometria niepotwierdzona | Dopuszczone warunkowo | Proste w przestronnym mechanizmie. Tutaj ich przechył i przesuw wymagają szczegółowego dopasowania. |
| Zagięcia V drutów powiek | Niepotwierdzone | Nie | Ręczna regulacja długości dwóch połączeń napędzanych jednym serwem. Naprawia problem dokładności, ale dodaje podatność i kolejną czynność regulacji. |
| Koszulki z izolacji przewodu | Niepotwierdzone | Nie | Zabezpieczenie drutu przed wysunięciem. Potrzebne wybranym zakończeniom L i sworzniom, nie samej funkcji oka. |
| Próbka połączeń i przyrząd do gięcia | Niepotwierdzone | Próbka nowego połączenia jest zasadna | Nie są zbędnym wyposażeniem obecnego projektu. Są jednak kosztem wyboru trudnych połączeń. |

**Wniosek:** nie usuwałbym dowolnych drobiazgów pojedynczo. Usunąłbym przyczynę, która wymusza podkładki osi, M2, krótkie dźwignie, ciasne zakończenia i regulację dwóch drutów.

**2. Co można naprawdę zaczerpnąć z referencji**

Autor The Face opisuje pięć MG90S dla dwóch oczu: po dwa na kierunek patrzenia i jedno wspólne na powieki. Gałki korzystają z przegubów uniwersalnych, napęd przenoszą gięte druty, a uchwyt serw jest mocowany do listew za maską. To potwierdza zasadę **podparcie od tyłu + nieruchome serwa + popychacze**, bez konieczności otaczania gałki tubą. [Opis autora The Face](https://www.pcbway.com/project/shareproject/The_Face_maker101_c4124445.html)

**Nie potwierdziłem, że The Face porusza górną i dolną powieką jednego oka przeciwnie jednym serwem.** Autor wymienia dwie gałki i dwie powieki; opis wspólnego serwa nie wyjaśnia takiego sprzężenia. Nie udało się obejrzeć zdjęć w dostępnych narzędziach, więc nie przedstawiam sposobu osadzenia ich osi jako sprawdzonego faktu. To luka referencji przyjętej w PRD, a nie dowód, że obecna konstrukcja skopiowała rozwiązany mechanizm.

W instrukcji Cogleya ε3.2 powieki są osadzane na podporach przegubów w podstawie; górne mają krótkie ramiona, dolne długie. Sterowanie rozdziela górną i dolną powiekę każdego oka na osobne kanały. To przydatny przykład podparcia w ramie, ale nie dowód na prosty wspólny napęd obu powiek. [Instrukcja autora EyeMech](https://github.com/will-cogley/EyeMech_Epsilon/blob/main/README.md)

Dla V2 Simplified odnalazłem film autora, ale nie uzyskałem dostępnej instrukcji pozwalającej niezależnie sprawdzić szczegóły. Nie przypisuję mu rozwiązań tylko na podstawie opisu w repo.

Do przeniesienia są zatem przede wszystkim:

- podparcie gałki i powiek przez wspólną ramę;
- dostęp do połączeń od tyłu i z boków;
- drukowane połączenia tam, gdzie ręczna długość decyduje o domknięciu;
- kalibracja przy montażu ramion serw.

**3. Łańcuchy przyczyn obecnych trudności**

**A. Mocowanie w dyni stało się obudową precyzyjnego mechanizmu**

Tuba Ø79 → wewnętrzny promień tylko **37,9 mm** → dwie powieki i ich osie trzeba zmieścić między gałką a tubą → M3 zastąpione M2 → krótkie dźwignie → duża czułość na długość połączeń → regulacyjne V, koszulki, kieszenie i kolejne próby.

Ważne: **montaż od środka sam nie wymaga ograniczenia serw i tylnej ramy do Ø80.** Koncepcja z 24.10 nawet to zauważa. Ograniczenie pozostaje jednak rzeczywiste dla części przechodzących przez ściankę dyni.

**B. Nadmiernie szerokie otwarcie powiek**

PRD wymaga niezasłaniania **źrenicy**. Koncepcja dobrała otwarcie także pod całą tęczówkę Ø24.

Przy założeniu źrenicy Ø10 na gałce Ø60:

- połowa kąta źrenicy: `asin(5/30)` = **9,6°**;
- spojrzenie w górę: **25°**;
- minimalny kąt krawędzi powieki bez zapasu: około **34,6°**.

Krawędź otwarta do **40°** dawałaby około **5,4° zapasu** w tym uproszczonym przekroju. Obecnie przyjęto 50°, czyli skok powieki 51,5° zamiast potencjalnych 41,5° — **około 19% więcej ruchu**.

To obliczenie koncepcyjne, wymagające kontroli całej geometrii i przyjęcia średnicy źrenicy. Pokazuje jednak, że część wymaganego miejsca wynika z dodatkowego założenia projektanta.

**C. Drut zastąpił części, lecz nie usunął pracy**

Drut zamiast drukowanego łącznika → ręczna długość i orientacja końcówek → większe otwory zapewniające przechył → większe luzy → zmiana końcówki na oczko → widełki i sworzeń → zabezpieczenia koszulkami → trudniejsze podpory druku.

Początkowe uzasadnienie „odpada osiem połączeń śrubowych” było prawdziwe. Obecny bilans powinien jednak uwzględniać również gięcie, dopasowanie, zabezpieczenia i sprawdzanie ruchu.

**D. Jedno serwo zostało obciążone regulacją dwóch niezależnych długości**

Jedno serwo ustawia wspólne położenie. **Nie skasuje różnicy długości dwóch drutów.** Dlatego instrukcja nakazuje domknąć jedną powiekę, a drugą dostroić przez doginanie V.

To nie jest wada samego wymagania trzech serw. To argument za dokładnymi drukowanymi łącznikami albo jednym mechanicznym nastawnikiem długości.

**4. Ile naprawdę kosztuje dźwignia 7 mm**

Dla połączenia działającego stycznie:

`zmiana kąta ≈ 57,3 / długość dźwigni [°/mm]`.

| Dźwignia | Czułość przy korzystnym kierunku siły | Przy kierunku pogarszającym przełożenie o 20% |
|---|---:|---:|
| 7 mm | **8,2°/mm** | **10,2°/mm** |
| 10 mm | 5,7°/mm | 7,2°/mm |
| 18 mm | 3,2°/mm | 4,0°/mm |
| 20 mm | **2,9°/mm** | **3,6°/mm** |

Wcześniejsza analiza obecnego mechanizmu podaje około **8,3–9,9°/mm** zależnie od położenia. Jest to zgodne ze skalą powyższego rachunku.

Przy r = 20 mm błąd długości ±2 mm nadal oznacza około **±6–7°**. Dwa druty wykonane przeciwnie mogą różnić się o 4 mm. **Wydłużenie dźwigni pomaga, ale nie zastępuje regulacji lub dokładnego drukowanego połączenia.**

Również luzu nie usuwa program. Oczko Ø3 na sworzniu Ø1 ma **2 mm całkowitego luzu średnicowego**; przy ramieniu około 20 mm odpowiada to skali około **5,7°** ruchu gałki. Kalibracja poprawia stałe przesunięcie, nie ruch zależny od kierunku obciążenia.

**5. Dwa prostsze układy**

Poniższe warianty zachowują gałkę Ø60, dwie ruchome powieki, kardan 5/5, trzy MG90S i otwór Ø80. Oba wymagają zmiany obecnego sposobu montażu: przednia część z osiami powiek jest zakładana od zewnątrz, a serwa od środka.

**Dlaczego taka zmiana:** usunięcie tuby odzyskuje tylko **1,6 mm na promieniu**. Nie daje automatycznie miejsca na dźwignie 20 mm i osie M3 z nakrętkami. Część tych elementów trzeba umieścić przed powierzchnią dyni; większe wysunięcie oka jest rzeczywistym kosztem uproszczenia.

**Wariant A — tuba pozostaje wyłącznie osłoną otworu**

- Gałkę trzyma kardan na tylnej podstawie serw.
- Powieki podtrzymują dwa boczne wsporniki z osiami M3, umieszczonymi przed ścianką dyni.
- Tuba nie przenosi obciążeń osi powiek.
- Dźwignie powiek: docelowo **18–20 mm**.
- Serwo powiek ustawione osią równolegle do osi powiek. Dwa drukowane łączniki pracują w równoległych płaszczyznach; odpadają ich V, L i koszulki.
- Jedno połączenie ma regulację długości na śrubie M3. Przy błędzie każdego połączenia ±2 mm potrzebny zakres względnej korekty wynosi **8 mm**, czyli ±4 mm.

**Bilans koncepcyjny:** 12–13 drukowanych części: tylna podstawa, dwa wsporniki, gałka, dwie powieki, tuba, maskownica, dwa łączniki, adapter ramienia serwa, pokrywa mocowania kardana i ewentualny osobny suwak regulacji.

**Ryzyko:** pozostaje uzależnienie tuby od grubości dyni, a przedni mechanizm jest bardziej widoczny. Pełny montaż wymaga połączenia dwóch podzespołów.

**Wariant B — bez tuby, otwarta rama**

- Gałkę i powieki podtrzymuje ta sama rama co w A.
- Dwa boczne wsporniki przechodzą przez otwór; z tyłu łączą się z podstawą serw.
- Cienka maskownica Ø84 zakrywa cięcie, ale nie jest precyzyjną podporą ruchomych części.
- Głębokość osadzenia ustawia się na połączeniu wsporników z podstawą, zamiast przedrukowywać tubę i uchwyt.
- Napęd powiek jak w A: trzy serwa, długie dźwignie, drukowane łączniki i jeden nastawnik.

**Bilans koncepcyjny:** **11–12 drukowanych części**, czyli o jedną mniej niż w A.

**Ryzyko:** sztywność i zamocowanie ramy w miąższu oraz większe wysunięcie oka. Wszystko, co pozostaje w grubości ścianki dyni, nadal musi zmieścić się w Ø80 — rama nie znosi tego ograniczenia.

W obu wariantach połączenia dwóch serw z gałką są osobnym punktem do rozwiązania. Można pozostawić drut, ale trzeba pogrubić i udostępnić jego mocowania; samo otwarcie ramy nie usuwa wymaganego przechyłu końcówek. Nie uznaję obecnych widełek z **0,9 mm materiału pod otworem** za rozwiązanie zgodne z warunkiem „bez drobnych kruchych wydruków”.

| Porównanie | Obecny model | A: tuba bez osi | B: otwarta rama |
|---|---|---|---|
| Części użytkowe do druku | **6** | 12–13, założenie | 11–12, założenie |
| Ręcznie formowane połączenia powiek | 2 | 0 | 0 |
| Czułość powiek | około 8–10°/mm | cel 3–4°/mm | cel 3–4°/mm |
| Dopasowanie do ścianki 28–50 mm | zmiana dwóch wydruków według instrukcji | nadal tuba zależna od ścianki | regulacja położenia podstawy |
| Przygotowanie i montaż | dużo iteracyjnego gięcia | więcej śrub, mniej doginania | jak A, bez dopasowywania tuby |

**Czas przygotowania — wyłącznie założenie porównawcze:** przy gotowych, pasujących wydrukach przyjąłbym dla A/B **12–16 głównych czynności po 2–4 minuty**, czyli około **25–65 minut pracy ręcznej**, plus kalibrację i sprawdzenie ruchu. To nie obejmuje CAD, druku ani poprawek pierwszego prototypu; bez sprawdzonego modelu i danych ze slicera podawanie łącznej liczby godzin byłoby pozorne. Obecne osiem numerowanych kroków instrukcji zawiera wiele osobnych operacji gięcia i dopasowania, więc nie oznacza ośmiu porównywalnych czynności.

Czwarte serwo pozwoliłoby osobno ustawić domknięcie obu powiek i usunąć wspólną regulację ich długości. **Nie naprawiłoby krótkich dźwigni ani złych przegubów**, dlatego nie jest moją pierwszą rekomendacją; wymaga też zgody użytkownika.

**6. Co zachować, co zmienić**

**Zachować:**

- kardan 5/5 i podparcie gałki od tyłu;
- białą powierzchnię gałki Ø60;
- kuliste powierzchnie powiek, z przebudowanymi mocowaniami;
- trzy MG90S i kalibrację ESP32;
- maskownicę Ø84;
- rowek T, jeżeli jego montaż i blokowanie obrotu przejdą próbę — jego usunięcie nie jest warunkiem uproszczenia.

**Zmienić w pierwszej kolejności:**

1. Oddzielić mocowanie w dyni od podparcia osi powiek.
2. Sprawdzić otwarcie do **40° zamiast 50°**, przy jawnie przyjętej źrenicy Ø10.
3. Zastąpić dwa gięte połączenia powiek drukowanymi łącznikami.
4. Ustawić serwo powiek tak, aby ich połączenia pracowały w zgodnych płaszczyznach.
5. Zapewnić osie M3 z nakrętkami i dostęp do narzędzia.
6. Dopiero potem dobrać długość dźwigni do sprawdzonej przestrzeni.

**Rekomendacja: wariant B, otwarta rama, jako kierunek nowej koncepcji.** Nie dlatego, że ma najmniej wydruków — ma ich więcej niż obecny model — lecz dlatego, że zastępuje ręczne kształtowanie i dopasowywanie połączeń zwykłym montażem. Pierwsza makieta powinna sprawdzić tylko ramę, dwie powieki i ich wspólny napęd, wraz z rzeczywistymi M3 oraz ścianką zastępczą grubości 50 mm.

**Werdykt:** obecny mechanizm jest nadmiernie podporządkowany ciasnej tubie; największe uproszczenie da przebudowa podparcia i napędu powiek, a nie dalsze poprawianie zagięć drutu. Nie pozostawiłem własnych procesów w tle.