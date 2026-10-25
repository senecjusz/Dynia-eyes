# Szufladka v2 — Astra, pełne review, runda 2

**Wynik: brak nowych uwag KRYTYCZNYCH, WAŻNYCH i DROBNYCH dotyczących działania, montażu lub druku. Poprawki geometrii po rundzie 1 działają; zmniejszenie rączki i przeniesienie PIR nie wprowadziły wykrytych kolizji.** Front drukować po pozytywnej przymiarce wykonywanej już próbki PIR. Próba rzeczywistych przewodów pozostaje warunkiem odbioru montażu, zgodnie z rozstrzygnięciem rundy 1.

Podstawa: pliki wskazane w briefie dla `4cfe031`, PRD 0.2 §5, §7–8, manifest PIR i pomiar kołnierza 22,97. Bez git — przypisania plików do commita nie weryfikowano. Badany `podstawka.scad`: SHA-256 `0bcb22e3bc380637e75fe9ac8ce72d026d01a7d52fbff18f3fb55930076f97ea`. Zdjęć PIR nie otwierano. Wszystkie wymiary poniżej w mm; współrzędne globalne od lewego przedniego narożnika podstawki na stole, chyba że wskazano inaczej.

## Kontrola funkcji, montażu i druku

| Obszar | Sprawdzenie i wynik |
|---|---|
| **1. Stan wykonany, PRD, rysunek** | Model i obejrzany `podstawka-ciecie.png`: **252 × 226 × 67**, wnętrze **216 × 40**, dno **9**, boki/płyta **18**. Płyta z=49…67; otwór Ø60 w (126;113), zgodny z podanym Ø60–61. Wkręty w (9/243;20/206). Pilot blokady pokazany poziomo: **Ø3,3 × 22**, 126 od boku i 9 pod wierzchem. Tył 18 jest założeniem. Zgodność z aktualnym briefem; starsza informacja o dnie 6 nie była podstawą oceny. |
| **2. Korpus i wsuwanie** | **215 × 102 × 32**, dno i ścianki **2**. x=18,5…233,5: **0,5 luzu/stronę**; spód opiera się na dnie, góra z=41 daje **8** do płyty. Kaseta zaczyna się przy y=107: **5** za korpusem. Niezależne ciągłe przemiatanie **0…105**, z łącznikami po wyjęciu blokady, nie koliduje z drewnem ani kasetą. Przy wysunięciu ≥102 korpus wychodzi poza podparcie dna — wymiana z podtrzymaniem ręką. Fazki tylnych naroży **2 × 45°** są w modelu i siatce. |
| **Powerbank i USB-C** | Powerbank x=21,5…181,5, y=29…99, z=11…43: **6** pod płytą, **1** od przegrody, tylnej ściany, lewego boku i prawych ograniczników. Od czoła portu do prawej ściany wewnętrznej dokładnie **50**, zgodnie z decyzją. Wycięcie kablowe x=214,1…226,1, z=21…41: **12** szerokości, oś **220,1**, zgodna z gniazdem kasety. Przód gniazda y=155: **53** za korpusem, czyli strefa wtyku 50 + **3**. Obudowy rzeczywistych wtyków i kable nie są pełnymi bryłami kontrolnymi; sam ten wynik nie zastępuje ustalonej próby przewodów. |
| **3. Front** | **244 × 65 × 4**, ze słupkami **6,5**; x=4…248, z=1…66. Zakładki: boki **14**, dno **8**, płyta **17**; **1** nad stołem i **1** pod wierzchem płyty. Lico płaskie na stole, otwory pionowe, słupki do góry — bez podpór. Szerokość zostawia **12** na stole X1C; brim trzeba zmieścić w tym zapasie. Sztywność: patrz oszacowanie niżej. |
| **4. Front–korpus** | M4 rączki: osie **x=113/139, z=26**, rozstaw **26**. Przy modelowym łbie Ø7 × 4 stos pod łbem **16**; **M4×20** kończy się przy y=10, nakrętka przy y=6: **4** wystaje. Osadzenie łba na dnie gniazda przesuwa koniec o 0,5 dalej: nadal **18,5** przed powerbankiem i **15,5** przed przegrodą. M3×10: osie x=28,5/223,5, z=17; stos **8,4**, wystaje **1,6**. Nakrętki dostępne od góry kieszeni y=2…26, klucz 7/5,5. Najbliższa podkładka M4 Ø14 ma **30** odstępu w x od obwiedni PIR, prawa nakrętka M3 ok. **9,3**. Kontrola CGAL łączników: pusto. |
| **5. Rączka** | Zgodna z ostatnim rozmiarem: przy froncie **40 × 10**, lico **46 × 16**, wysięg **10**, R2. To chwyt szczypcowy z poszerzeniem **3/stronę**, bez przelotowego prześwitu na palce dawnego pałąka; nie zmieniam zaakceptowanego kształtu. Gniazda **Ø8 × 4,5**, otwory Ø4,5; dla łba Ø7 szczelina radialna **0,5**, pod łbem 4 mm ustawionym równo z licem **0,5** na klej. Druk większym licem na stole; bryła zwęża się ku górze. Nad gniazdami łbów lokalny most pierścieniowy **1,75**, bez potrzeby podpór. Rączka kończy się przy x≈149, oś PIR x=193,5: **44,5** bocznego odstępu. Konserwatywna obwiednia widziana ze środka PCB zaczyna zasłaniać dopiero od ok. **69,7°** od osi; nie zasłania kierunku na wprost. To geometria, nie pomiar charakterystyki detekcji. |
| **6. Blokada** | Oś **(126; z=58)**, środek krawędzi płyty 18, **9** od obu powierzchni. M4×25 przez front 4 wchodzi **21** w drewno; pilot 22 daje **1** zapasu. Front Ø5 daje **0,5** luzu promieniowego śruby, łeb Ø7 ma **1** szerokości oparcia i **4,5** do górnej krawędzi frontu. Od osi wkrętów płyty **117** w x; koniec pilota y=22 jest **31** przed kołnierzem tulei, zaczynającym się od y=53. Po wkręceniu łeb zatrzymuje wysuw frontu; nośność gwintu zależy od rzeczywistej sklejki. Wiercenie przez wsunięty, wycentrowany front pozostaje właściwą kolejnością montażu. |
| **7. PIR i przewód** | Oś **x=193,5, z=26**, czyli **40 od prawego boku korpusu**. Gniazdo **23,5 × 23,5 × 0,5** na kołnierz 3: dla pomiaru **22,97** luz **0,265/stronę**. Kopułka modelowa Ø23 w Ø24: **0,5 promieniowo**. PCB zaczyna się **2,5** za frontem; luty 2 mają **0,5** luzu. Słupki **Ø4,5 × 2,5**, rozstaw **28,5**, piloty **Ø1,7 × 5**; M2×6 przez PCB 1,5 wchodzi **4,5**, zostawia **0,5** do dna pilota i **2** do lica. Okno korpusu w jego układzie x=157…193, z=3…32, otwarte górą; obwiednia kondensatorów x=157,5…192,5, z=3,5…30,5: minimum **0,5** przy nasuwaniu. Za PCB **22** do przegrody; za elementami 8 pozostaje **14**, za Dupont 20 — **2**. Wycięcie przegrody x=169…181, z=24…32 obejmuje wtyki x=171…179, z=26…29: przewód może wyjść prosto przez wycięcie, bez poprzedniego ostrego skrętu nad pełną ścianką. Jego pas leży na prawo od powerbanku (do x=163) i ograniczników (do x=168). |

**Sztywność i szarpnięcie — oszacowanie, nie certyfikacja wydruku.** Przy założonych 50 N i E=2 GPa, zastępcza belka rączki między śrubami (26, przekrój 10 × 5,5) daje ok. **6,4 MPa i 0,07 ugięcia**. Nacisk łba Ø7 na pierścień Ø4,5 przy równym podziale siły wynosi ok. **1,1 MPa**. Przy normalnym otwieraniu M4 przenoszą siłę bezpośrednio na korpus; epoksyd zabezpiecza łby przed obrotem. Dla ciągnięcia przy wkręconej blokadzie przybliżenie frontu pasem szerokości 40, grubości 4 i ramieniem 32 daje **15 MPa / 1,28 ugięcia** przy 50 N. Nie uwzględnia koncentracji naprężeń, parametrów druku ani jakości klejenia: nie jest dowodem odporności na siłowe otwieranie, której PRD nie wymaga. Po związaniu kleju sprawdzić zwykłe otwieranie bez pękania i luzowania śrub.

## Poprawki rundy 1 — odbiór

- **Próbka PIR:** eksport jest rzeczywistym wycinkiem bieżącego frontu **60 × 40 × 6,5**, zawiera ten sam otwór, gniazdo i oba słupki. Wymóg przymiarki przed frontem jest zachowany; wynik fizycznej przymiarki nie został dostarczony. To ustalony punkt odbioru, nie ponowiona uwaga W1.
- **Blokada Ø5, wycięcie przegrody, okno otwarte górą, fazki korpusu:** obecne i geometrycznie poprawne. Nie ma już mostu 36 × 2 × 1 nad PIR. Test czułości z `oknoPIRzap=0` wykrył kolizję wkładania: **128 trójkątów**, obwiednia x=157,5…192,5, y=0…2, z=3,5…30,5 w układzie korpusu; konfiguracja docelowa jest pusta.
- **Kable:** przeniesienie PIR na prawo usuwa prowadzenie przez szerokość powerbanku. Opisana trasa od końca Dupont przez przegrodę i tylne wycięcie do okolicy ESP ma orientacyjnie **220 przy zamknięciu / 270 przy wysunięciu 105** (łamana bez zapasu na łuki). Przewód ok. **350** jest sensownym punktem startowym; należy wykonać już ustalone cykle 0…105 z płytą i rzeczywistym USB-C. Nie uznaję tej próby za zaliczoną na podstawie pustych kolizji brył.

## Siatki i dowody

Własne uruchomienia: OpenSCAD **2021.01**, `podstawka-eksport.sh` z `OUT3MF` w `/tmp`, trzy narzędzia kontroli siatek/wymiarów, odczyt XML 3MF z kontrolą orientacji i objętości, porównanie trójkątów oraz `podstawka-kolizje.sh`.

| Część | Wymiary siatki w druku | Trójkąty |
|---|---|---:|
| Korpus | 215 × 102 × 32 | 596 |
| Front | 244 × 65 × 6,5 | 1428 |
| Rączka | 45,981 × 15,981 × 9,990 | 1612 |
| Próbka PIR | 60 × 40 × 6,5 | 884 |
| Kaseta | 170 × 100 × 25 | 2212 |
| Tuleja | 120 × 120 × 58 | 18548 |
| Nakrętka | 130 × 112,583 × 8 | 3974 |
| Próbka tulei | 90 × 90 × 15 | 5574 |
| Próbka nakrętki | 90 × 77,942 × 8 | 3974 |

**Wszystkie 9 plików:** 0 otwartych/nierozmaitościowych krawędzi, 0 zdegenerowanych trójkątów, 0 błędów orientacji, dodatnia objętość, **1 bryła na część**. Wymiary zgodne z parametrami. Zmin=0 poza rączką **0,0096** z aproksymacji R2 — w slicerze położyć na stole. Własny ponowny eksport korpusu, frontu, rączki, próbki PIR i kasety ma identyczne skierowane trójkąty jak repo przy zaokrągleniu do **0,001**. **Kaseta v1/v2: identyczne 2212 trójkątów**, bez zmiany geometrii.

Pięć kontroli CGAL: **pusto**. Dodatkowe ciągłe przemiatanie konserwatywnych obwiedni 0…105: **pusto**, obejmuje drewno, kasetę, powerbank, PIR i łączniki poza wyjętą blokadą; styk z dnem/frontem odsunięty o 0,01. Nie obejmuje ugięć, przewodów ani nierówności drewna. Testy zginania: `rD=12` → wysięg siatki 11,990; `WIN=218` → front 246; `kieszenPIR=28` → głębokość korpusu 104; wszystkie wymiary, siatki i liczby brył poprawne.

Pliki robocze i logi: `/tmp/szuflada-astra-r2-bRYIiN/`. Jedyny zapis w repo: ten raport. Bez git i zapisu do Munina. Wszystkie uruchomione przeze mnie procesy zakończone; nic nie pozostało w tle.

**Werdykt: korpus, rączkę i próbkę gniazda PIR v2 można drukować, a front po pozytywnej przymiarce tej próbki; gotowość złożonej szufladki wymaga zaliczenia ustalonej próby przewodów.**
