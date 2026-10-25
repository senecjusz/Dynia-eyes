# Szufladka v2 — pełne review Astry, 25.10.2026

Zakres: działanie, montaż i druk korpusu, frontu, rączki, blokady i PIR wobec wykonanej podstawki. Podstawa: PRD 0.2 §5, §7–8, brief i aktualny `podstawka.scad`. Bez git, zmian modelu i zapisu do Munina; eksporty i obliczenia wyłącznie w `/tmp/szuflada-astra-bprxgn/`.

**Wynik: brak potwierdzonych uwag KRYTYCZNYCH; 3 WAŻNE i 1 DROBNA. Geometria nominalna nadaje się do próby montażowej, lecz kontrole brył nie potwierdzają rzeczywistych pasowań PIR ani ruchu kabli.**

## Sprawdzone liczbowo

Współrzędne globalne: x od lewego boku podstawki, y od frontu w głąb, z od stołu. Wymiary w mm.

| Obszar | Wynik |
|---|---|
| Stan wykonany i rysunek | Model i obejrzany `podstawka-ciecie.png`: **252 × 226 × 67**, wnętrze **216 × 40**, dno **9**, płyta/boki **18**. Płyta z=49…67; otwór Ø60 w (126,113), zgodny z pomiarem Ø60–61. Wkręty w (9/243,20/206). Tył 18 pozostaje założeniem. Zgodność z briefem i PRD; starsze opisy dna 6 nie są podstawą tego review. |
| Korpus i pełne wsuwanie | **215 × 102 × 32**, dno/ścianki **2**; x=18,5…233,5: **0,5/stronę**. Dno leży na sklejce, bez luzu pionowego; góra korpusu z=41, więc **8** do płyty. Kaseta zaczyna się przy y=107: **5** za korpusem. Niezależne ciągłe przemiatanie 0…105, obejmujące również zamontowane łączniki poza wykręconą blokadą: **brak kolizji**. Po wysunięciu 102 korpus traci podparcie dna — trzymać go w ręku; nie modelowano opuszczania na stół. |
| Powerbank i USB-C | Powerbank x=21,5…181,5, y=29…99, z=11…43: **6** pod płytą, **1** od przegrody i tylnej ściany, **1** do lewego boku i prawych ograniczników. Od portu do prawej ściany wewnętrznej dokładnie **50** — zachowano decyzję użytkownika. Wycięcie kablowe x=214,1…226,1, y=100…102, z=21…41, szerokość **12**; oś **220,1**, taka sama jak gniazda kasety. Gniazdo przy y=155, czyli **53** za tyłem korpusu: dla strefy 50 zostają **3**. Gniazdo/obudowy wtyków i przewody nie są pełnymi bryłami kontrolnymi; zgodność osi nie dowodzi przejścia kabla — W3. |
| Front | **244 × 65**, płyta **4**, ze słupkami grubość **6,5**. x=4…248, z=1…66: zakładki **14** na boki, **8** na dno i **17** na płytę; **1** nad stołem i **1** poniżej wierzchu płyty. Lico na stole: płaska baza, otwory pionowe, słupki rosną od płyty — bez podpór. Na X1C pozostaje **12** zapasu szerokości. |
| Front–korpus | M4: osie x=111/181, z=26; podkładki Ø14, nakrętki kończą się przy y=6, śruby **M4×35** przy y=7 (**1** wystaje); ×40 przy y=12. Stos pod łbem = **34**, a nie 33,8 z komentarza. M3×10: osie x=28,5/223,5, z=17; stos front+korpus+nakrętka **8,4**, wystaje ok. **1,6**. Dostęp od góry przez kieszeń y=2…26, bez powerbanku; za M4×35 do przegrody **19**, od końca śruby do powerbanku **22**. Najbliższa podkładka M4 zaczyna się przy x=104, obwiednia PIR kończy przy x=76: **28** odstępu. CGAL łączników: pusto. |
| Rączka | **86 × 14 × 28**, rozstaw **70**, wolne miejsce na palce **54 × 20**. Gniazda **Ø8 × 4,5**, dla przyjętego łba **Ø7 × 4** szczelina radialna **0,5**, pod łbem **0,5** przy ustawieniu równo z licem; przez stopę Ø4,5. Druk pałąkiem na stole; mały uskok nad gniazdem łba to most pierścieniowy szerokości **1,75**. Rączka nie zasłania osi PIR; konserwatywny promień od środka płytki do najbliższego przedniego naroża daje początek przesłaniania ok. **52° w prawo**, nie gwarantowane 55°. To oszacowanie geometrii, nie pomiar pola detekcji soczewki. |
| Blokada | Oś **x=126, z=58**, dokładnie w połowie grubości płyty 18. M4×25 przez front 4: **21** w drewnie, pilot **Ø3,3 × 22** daje **1** zapasu. Oś **9** od obu powierzchni płyty. Łeb Ø7 ma **4,5** do górnej krawędzi frontu. Do osi najbliższego wkręta płyty **117** w poziomie; koniec pilota y=22 leży **31** przed obrysem kołnierza tulei (od y=53), bez kolizji. Łeb dociska front i uniemożliwia wysunięcie przy trzymającym gwincie w sklejce. Nawiercać przez dopasowany front, głębokość liczyć od drewna; po wyjęciu i ponownym wkręceniu sprawdzić, czy gwint nadal trzyma. |
| PIR | Gniazdo **23,5 × 23,5 × 0,5**: kołnierz 23 × 23 × 3 ma **0,25/stronę**, płytka zaczyna się **2,5** za frontem. Luty 2 mają **0,5** do frontu. Kopułka Ø23 w Ø24: **0,5 promieniowo**; jej modelowy wysięg przed licem wynosi **7,5**, nie ok. 10 z opisu modelu. Słupki **Ø4,5 × 2,5**, rozstaw **28,5**, pilot **Ø1,7 × 5**; M2×6 przez PCB 1,5 wchodzi **4,5**, zostawia **0,5** do końca pilota i **2** plastiku do lica. Okno **36 × 28** wobec obwiedni rogów **35 × 27**: **0,5/stronę** przy wkładaniu. Za PCB do przegrody **22**, za elementami 8 — **14**, za obwiednią Dupont 20 — **2**. Nominalny PIR i jego wkładanie nie kolidują. |

**Sztywność — oszacowanie, nie próba wytrzymałościowa.** Dla przykładowego szarpnięcia 50 N w środku pałąka, przekroju pełnego 14 × 8, rozpiętości 70 i założonego E=2 GPa: naprężenie ok. **5,9 MPa**, ugięcie **0,30 mm**. Nie uwzględnia to wad druku, koncentracji przy stopach i jakości epoksydu. Front 4 ma cztery punkty skręcenia; siła normalnego otwierania trafia z rączki przez M4 do korpusu. Przy ciągnięciu za zamkniętą blokadę orientacyjny model pasa frontu szerokości 70 i ramienia 32 daje przy 50 N ok. **8,6 MPa / 0,73 mm**. Nie wynika z tego potrzeba pogrubienia; po związaniu kleju sprawdzić jedno umiarkowane szarpnięcie, bez pękania i luzowania łbów. To nie jest wymaganie odporności na dzieci.

## Uwagi

**W1 — WAŻNE: pasowanie rzeczywistego PIR do frontu** (`podstawka.scad:61–70, 299–309`). Rozstaw słupków 28,5 pochodzi z odczytu **28–29**, a otwory płytki **Ø2** i śruby M2 nie zapewniają nominalnego zapasu na błąd rozstawu. Przy rzeczywistych 28 lub 29 rozminięcie wynosi **0,25 na śrubę**; kołnierz dodatkowo ustala płytkę. Scenariusz: nie da się wkręcić obu M2 bez wyginania PCB/słupków. **Test/poprawka:** przed pełnym frontem krótka próbka samego gniazda ze słupkami, na rzeczywistym PIR i M2; skorygować `pirOtwRozst` po dopasowaniu. Sprawdzić też swobodne wejście kołnierza i brak dotykania lutów. **Pewność: wysoka co do braku zapasu; średnia co do wystąpienia, bo wymiar rzeczywistej płytki nie jest potwierdzony.**

**W2 — WAŻNE: most nad oknem PIR w korpusie** (`podstawka.scad:282–295`). Nad otworem pozostaje belka **36 × 2 × 1**, drukowana na wysokości z=31 bez podpory. To rzeczywisty poziomy most; opis „bez podpór” nie usuwa ryzyka jego zwisu. Do górnych kondensatorów podczas nasuwania frontu zostaje **0,5**. Scenariusz: zwis/strzępy ponad 0,5 blokują wkładanie zmontowanego PIR. **Test/poprawka:** próbka tego mostu z docelowym profilem druku i rzeczywistym PIR; uzyskać czyste przejście. Jeśli nie przechodzi, otworzyć okno do górnej krawędzi (usunąć belkę 1 mm) albo zastosować lokalną podporę i oczyścić otwór. **Pewność: wysoka dla geometrii, średnia dla awarii druku.**

**W3 — WAŻNE: niezweryfikowana droga przewodów przy ruchu** (`pirPrym()`, `szufladaRuch()`, `kolizja*()`; opis montażu v2). Kontrole zawierają zastępczą bryłę Dupont, ale nie przewód PIR, kabel USB-C ani rzeczywiste wtyki. Za obwiednią Dupont są tylko **2** do przegrody, nad przegrodą **8**, nad powerbankiem **6**. Scenariusz: przewód wychodzący do tyłu nie skręci nad przegrodą, pętla zakleszczy się pod płytą albo wysunięcie wypnie PIR/USB-C. Trasa PIR przez prawe wycięcie do okolicy ESP wymaga orientacyjnie **≥330 mm po zamknięciu i ≥380 mm przy wysunięciu 105**, jeszcze bez pełnego zapasu na łuki; to oszacowanie trasy, nie wymóg konkretnej długości. **Test/poprawka:** próbnie ułożyć posiadane przewody przy zamontowanej płycie, wykonać kilka cykli 0…105 bez napinania złączy i przycinania kabli. Dobrać długość oraz położenie pętli; jeśli Dupont nie skręca w dostępnej przestrzeni, użyć przewodu wlutowanego, dopuszczonego w PRD. Zachować strefę USB-C **50** i kasetę v1. **Pewność: wysoka co do luki w dowodzie; średnia co do faktycznej kolizji.**

**D1 — DROBNA: ostre krawędzie wejściowe korpusu** (`korpus()`). Luz **0,5/stronę** spełnia minimum, ale brakuje faz wejściowych wymaganych dla wsuwania. Dla prostokąta 215 × 102 skręcenie w poziomie o ok. **0,57°** zużywa cały 1 mm zapasu szerokości. Scenariusz: zahaczanie o krawędź sklejki przy wkładaniu pod kątem. **Poprawka/test:** lekko sfazować tylne naroża wchodzące jako pierwsze i usunąć stopę słonia; sprawdzić swobodne wsuwanie na rzeczywistym dnie. **Pewność: wysoka.**

Przy montażu rączki sprawdzić rzeczywisty łeb M4: obliczenia zakładają **Ø7 × 4**, czego sama nazwa „okrągły, imbus” nie gwarantuje. Gniazdo Ø8 zachowuje szczelinę 0,5 wyłącznie dla Ø7; wymaganą długość liczyć jako **38 − wysokość łba**. Dla przyjętych 4 mm M4×35 wystarcza, a ×40 również omija powerbank i PIR.

## Dowody kontroli siatek i ruchu

Niezależnie uruchomiono OpenSCAD **2021.01**, eksport do katalogu tymczasowego, trzy wskazane narzędzia kontroli oraz dodatkowy odczyt XML 3MF: orientacja krawędzi i dodatnia objętość. Wszystkie **8 plików**: **0 otwartych / 0 nierozmaitościowych / 0 zdegenerowanych / 0 błędów orientacji**, **1 bryła** na część.

| Część | Wymiary eksportu w orientacji druku | Trójkąty |
|---|---|---:|
| Korpus | 215 × 102 × 32 | 576 |
| Front | 244 × 65 × 6,5 | 1428 |
| Rączka | 86 × 14 × 28 | 700 |
| Kaseta | 170 × 100 × 25 | 2212 |
| Tuleja | 120 × 120 × 58 | 18548 |
| Nakrętka | 130 × 112,583 × 8 | 3974 |
| Próbka tulei | 90 × 90 × 15 | 5574 |
| Próbka nakrętki | 90 × 77,942 × 8 | 3974 |

Wszystkie minima z=0. Regeneracja korpusu, frontu, rączki i kasety zgadza się z repo: te same zbiory wierzchołków i trójkątów przy porównaniu do 0,001. **Kaseta v1/v2: 1092 wierzchołki, 2212 trójkątów; zbiory współrzędnych identyczne (maksymalna odległość 0), trójkąty identyczne do 0,001.** Różnica sum kontrolnych archiwów 3MF nie oznacza zmiany geometrii.

Pięć kontroli `podstawka-kolizje.sh`: każda pusta. Dodatkowo ciągłe przemiatanie konserwatywnych obwiedni części 0…105: puste; płytę frontu i słupki rozdzielono, aby otoczka wypukła nie tworzyła fikcyjnych klinów za frontem. Styk z dnem/frontem odsunięty o 0,01, jak w kontroli źródłowej. Test czułości: `oknoPIRzap=0` wykrywa kolizję wkładania PIR, obwiednia **x=22,5…57,5, y=0…2, z=3,5…30,5** w układzie korpusu. Przemiatanie dotyczy geometrii nominalnej, bez przewodów, ugięć i nierówności drewna.

Identyfikacja źródła: SHA-256 `podstawka.scad` = `559d4b04789a74996af5a6503a4c0c44b97f45778b3868340475c0b36c3bb02d`. Procesy obliczeniowe zakończone; nic uruchomionego przeze mnie nie pozostaje w tle.

**Werdykt: korpus, front i rączkę v2 można drukować do próby montażowej, po krótkich próbkach pasowania PIR i mostu; gotowość do użytkowania wymaga zaliczenia próby przewodów W3.**
