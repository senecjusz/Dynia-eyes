**Raport Astry — E6: połączenie drutu z gałką, Z / oczko M3**  
Treść do `20-analizy/review/2026-10-24-ucho-oczko-astra.md`. Bez zapisu plików, commitów i `git pull`; raportu drugiego recenzenta nie czytałem.

**Wynik: C jest najlepszym kandydatem do dalszego modelowania, ale opisane mocowanie wymaga zmian.** Przeszkodami są zatrzymanie oczka pod łbem, miejsce na przechył i dostęp montażowy. Duże oczko wprowadza też istotny luz gałki.

**Podstawa obliczeń**

Użyłem bieżącego SCAD i świeżego echa `PARAMETRY`, bez polegania na starym JSON. SHA256 SCAD: `3c234611d3cfdc4029310b0da547b99151438a1b8b9f8dcd588378840652fa91`; plik nie zmienił się podczas review.

Kinematykę przeliczyłem niezależnie dla θ = ±35°, φ = ±25°, z krokiem 0,5°, zachowując gałąź rozwiązania najbliższą pozycji zerowej. Długości nominalne: S1 **41,856 mm**, S2 **42,890 mm**; oś S2 pochylona o **14,8759°**.

Poniższe wyniki są **obliczeniami geometrii nominalnej**, nie pomiarami wydruku. Próba wygenerowania świeżej siatki Galka zakończyła się limitem procesu; nie przedstawiam jej jako ukończonej kontroli siatek.

**1. KRYTYCZNE — wariant A koliduje po obu stronach blaszki**

**Miejsce:** korpus drutu przy uchu S1/S2, `uchoDol = 2,6`.

Niezależna kontrola analityczna przekroju blaszki, po odjęciu klepsydry, znalazła następujące punkty powierzchni drutu wewnątrz materiału:

| Ucho / strona korpusu | θ / φ | Głębokość punktu wewnątrz blaszki |
|---|---:|---:|
| S1 − | +35° / +25° | około **0,99 mm** |
| S1 + | +35° / −25° | około **1,00 mm** |
| S2 − | +35° / +25° | około **0,89 mm** |
| S2 + | −35° / +25° | około **0,87 mm** |

Sprawdziłem odległości między zagięciami 3,5 i 6,5 mm oraz skrajne położenia luzu przy uchu i orczyku, zgodnie z obecnym skryptem. Przykładowy punkt kolizji S1− w układzie gałki: **[21,677; 0,007; −5,532] mm**.

To potwierdza sens wyników −0,90/−0,91 i −0,67/−0,81 mm z materiału. Różnice wartości wynikają również z próbkowania; nie są niezależnym odtworzeniem tamtego przemiatania siatek.

**Scenariusz porażki:** przy dopuszczonym przesunięciu Z drut trafia w blaszkę przed osiągnięciem skrajnego położenia oka. Sama zmiana strony nie usuwa problemu.

**Ważne ograniczenie wniosku:** poprawne jest zdanie:  
**„Obecny Z, z obecnym luzem osiowym i blaszką, ma kolizje dla obu stron korpusu”.**

Nie udowodniono natomiast niemożliwości *każdego* Z, np. z wymuszonym innym odsunięciem korpusu lub innym profilem ucha. Zmiana znaku składowej kierunku sama w sobie tego nie dowodzi — skończoną blaszkę można ominąć pod krawędzią.

**Poprawka/test:** A w obecnej postaci odrzucić; ewentualną inną geometrię Z oceniać od nowa. Skrypt nie obejmuje rzeczywistych łuków gięcia ani błędów ±10°, a odcina 1,5 mm korpusu przy uchu.  
**Pewność:** wysoka dla kolizji obecnego wariantu; brak podstaw do twierdzenia o wszystkich możliwych Z.

**2. WAŻNE — wzór przechyłu oczka wymaga korekty**

**Miejsce:** obliczenie przechyłu w analizie wariantów.

Dla idealnego, płaskiego oczka z **okrągłego drutu**:

\[
(D+w)\cos\beta-w=d
\]

gdzie D jest średnicą wewnętrzną oczka, w średnicą drutu, a d średnicą sworznia. Średnica okręgu osi drutu wynosi D+w; przekrój okrągłego drutu zachowuje szerokość w w rozpatrywanym rzucie.

Dla w = 1 mm:

| Oczko | Granica na gładkim Ø3 | Wynik przy hipotetycznym Ø2,4 |
|---|---:|---:|
| Ø5 | **48,19°** | 55,48° |
| Ø6 | **55,15°** | 60,94° |

Sam wzór z briefu, `D cosβ − w sinβ = d`, daje dla Ø5 **42,65°**, nie 41,5°; dla Ø6 daje 50,99°. Nie jest jednak właściwym modelem idealnego oczka z okrągłego drutu.

Wymagania z kinematyki:

| Przypadek | S1 | S2 |
|---|---:|---:|
| Długość nominalna | **38,36°** | **38,18°** |
| Najgorszy wynik dla długości nominalnej ±2 mm | **39,49°** | **39,10°** |

Po doliczeniu błędu orientacji oczka ±10° należy sprawdzać około **50°**, nie tylko 38°.

**Gwint:** do gwarantowania przejścia przyjmować **Ø3 po wierzchołkach**. Wyniku dla rdzenia Ø2,4 nie można zaliczyć jako zapasu: oczko nie ominie wszystkich wierzchołków gwintu. Gwint może dodatkowo powodować tarcie i ruch skokowy.

**Ręczne wykonanie:** dla minimalnego wymiaru otworu 4,5 mm granica wynosi tylko **43,34°**; dla 5,5 mm — **52,02°**. Zatem „Ø5 ±0,5 bez znaczenia” jest nieprawdziwe. Owalizacja oczka obniża zapas według jego najmniejszego prześwitu.

Spłaszczenie przekroju drutu może zmienić wynik korzystnie, ale wymaga rzeczywistych wymiarów. Niespłaszczony przestrzennie zwój pogarsza natomiast wymagania osiowe.

**Scenariusz porażki:** B działa nominalnie, lecz klinuje się po ręcznym skręceniu lub spłaszczeniu oczka.

**Poprawka/test:** dla C sprawdzić rzeczywiste oczko na rzeczywistej śrubie do **50°**. Przy wymaganym zapasie promieniowym 0,2 mm minimalny prześwit oczka powinien wynosić około **5,85 mm**.  
**Pewność:** wysoka dla geometrii idealnej; średnia dla ręcznie zwiniętego drutu.

**3. KRYTYCZNE — Ø6 nie jest zatrzymane przez łeb Ø5,5**

**Miejsce:** koniec śruby od strony oczka.

Przy wymiarach przyjętych w briefie oczko Ø6 przechodzi przez łeb Ø5,5. B ma tylko **0,25 mm nominalnego zakrycia promieniowego**; przy oczku Ø5,5 zakrycie znika.

**Scenariusz porażki:** oczko zsuwa się ze śruby podczas ruchu lub montażu.

**Poprawka/test:** C potrzebuje szerszego elementu zatrzymującego, np. drukowanej podkładki **Ø8**, o założonej grubości **1,5 mm**. Dla otworu oczka Ø6,5 daje to 0,75 mm zakrycia na stronę. Podkładka musi pozostać sztywna i nie zaciskać oczka.

Nie zakładam dostępności metalowej podkładki — nie wymieniono jej w briefie.  
**Pewność:** wysoka.

**4. KRYTYCZNE — luz osiowy 0,5–1 mm nie zapewnia przechyłu**

**Miejsce:** przestrzeń między podporą a płaszczyzną zatrzymującą oczko.

Pełna osiowa grubość idealnego przechylonego oczka wynosi:

\[
W(\beta)=w+(D+w)\sin\beta
\]

| Oczko | Przy 38° | Przy 50° |
|---|---:|---:|
| Ø5 | **4,69 mm** | **5,60 mm** |
| Ø6 | **5,31 mm** | **6,36 mm** |

Jeśli oczko Ø6 z drutu Ø1 ma w zerze 0,5–1 mm luzu, odległość między płaszczyznami wynosi 1,5–2 mm. W takim mocowaniu przechył kończy się już przy około **4,1–8,2°**.

Dla oczka Ø6,5 przy 50° potrzeba **6,75 mm**, jeszcze przed dodaniem luzu i wystającego końca zwoju. Pełny ręczny zwój może mieć lokalnie dwie warstwy drutu.

**Scenariusz porażki:** otwór oczka nadal mieści trzpień, ale oczko opiera się o łeb albo podporę i blokuje ruch.

**Poprawka/test:** przy szerokich, płaskich powierzchniach zatrzymujących przyjąć do sprawdzenia przestrzeń rzędu **8 mm**, następnie zmierzyć faktyczny zwój. Alternatywne wybrania podpory wymagają osobnej kontroli kontaktu.

To oznacza też większy luz osiowy w zerze; nie można jednocześnie zadeklarować stałego luzu 0,5–1 mm i wymaganego przechyłu w takim prostym mocowaniu.  
**Pewność:** wysoka.

**5. WAŻNE — miejsce jest prawdopodobne, lecz B/C nie mają jeszcze sprawdzonego złożenia**

**Miejsce:** wnętrze Galka i sąsiednie części.

Sprawdziłem pomocniczy pakiet C, zachowujący obecne środki mocowań i osie:

- przestrzeń na oczko 8 mm;
- podkładka Ø8 × 1,5;
- łeb Ø5,5 × 3 — założenie z briefu;
- podpora z kieszenią nakrętki, obwiednia około Ø10,1;
- śruba M3×18, z uwzględnieniem końcówki.

To **obwiednie do oceny wykonalności**, nie gotowy model podpory.

| Sąsiad | Wynik dla tych obwiedni |
|---|---|
| Skorupa, wewnętrzne R28 | najmniejszy zapas około **0,51 mm S1 / 0,91 mm S2** |
| Rowek T | rozdzielenie w z co najmniej **9,18 mm** |
| Oba pakiety mocowań między sobą | konserwatywny zapas ponad **3 mm** |
| Pierścień, także podkładki osi | zapas ponad **8 mm** |
| Materiał powiek | zapas około **4 mm lub większy**, dzięki ich wycięciom sferycznym |
| Tylna piasta jako nieruchomy walec Ø11 | zapas ponad **2,0 mm S1 / 3,6 mm S2**, po uwzględnieniu kroku próbkowania |

Ostatni wynik obejmuje model walcowy; nie zastępuje kontroli rzeczywistych widełek kardana i wystających elementów M4.

Dla nominalnego prostego drutu drugiej osi najmniejsza odległość od środka mocowania do powierzchni drutu wynosi **15,66 mm przy S1** i **23,43 mm przy S2**. To zachęcający wynik, ale rzeczywisty drut wychodzi ze stycznej oczka, a nie z jego środka. Zmienia to położenie początku korpusu o kilka milimetrów.

**Scenariusz porażki:** mocowanie mieści się, ale rzeczywisty zwój, jego ogon lub przesunięty korpus drutu zahacza przy ruchu. Zapas 0,51 mm przy skorupie nie zapewnia tolerancji ±2 mm dla dowolnego odkształcenia drutu.

**Poprawka/test:** przemiatanie kompletnego C, z rzeczywistą styczną wyjścia drutu, końcem zwoju, łbem, podkładką i nakrętką. Kontrolować również pośrednie pozycje powiek.  
**Pewność:** średnia dla wykonalności pakietu; brak potwierdzenia kompletnego wariantu B/C.

**6. KRYTYCZNE — proponowany dostęp wkrętakiem nie działa**

**Miejsce:** śruba S1 w osi y przy z = −4 oraz śruba S2 pochylona o 14,8759°.

- **S1:** przedłużenie osi śruby biegnie przy stałym z = −4 i przecina skorupę. Nie wychodzi przez tylny otwór kończący się na z = −8.
- **S2:** sama oś wychodzi przez tylny otwór w punkcie około **[−15,06; 20; −8] mm**. Jednak najmniejsza odległość tej osi od wewnętrznej krawędzi rantu to tylko **0,70 mm**. Współosiowy trzonek grubszy niż około **Ø1,40** zahacza o rant.

**Scenariusz porażki:** śrubę można włożyć, lecz nie można jej dokręcić zakładanym wkrętakiem.

**Poprawka/test:** przed przyjęciem modelu wykazać dostęp narzędziem o jawnie podanej średnicy. Sam montaż „przed założeniem Pierścienia” nie usuwa kolizji ze skorupą Galka.  
**Pewność:** wysoka dla prostego, współosiowego narzędzia.

**7. WAŻNE — nakrętka daje pewniejsze mocowanie, długość śruby zależy od całego pakietu**

**Miejsce:** podpora sworznia M3.

Otwór Ø2,6 z wkręconą M3 oszczędza miejsce. Jeśli jednak śruba pozostaje niedokręcona dla ustawienia luzu, ruch oczka może zmieniać jej położenie; ponowny montaż odtwarza luz niedokładnie.

Nakrętka M3 ma szerokość pod klucz do **5,5 mm** i wysokość do **2,4 mm**. Kieszeń z luzem 0,3 mm na stronę ma 6,1 mm między płaskimi; z ścianką 1,5 mm potrzebuje obwiedni około **Ø10,1 mm**. [Karta Böllhoff ISO 4032](https://eshop.boellhoff.de/out/media/pdf/ISO_4032_Stahl_8___en.pdf).

Dla przykładowego pakietu:

- w plastik: 8 mm przestrzeni + 1,5 mm podkładki + 5 mm osadzenia = **14,5 mm** → kandydat M3×16;
- przelotowo: 8 + 1,5 + 4 mm podpory + 2,4 mm nakrętki + 0,5 mm wystawania = **16,4 mm** → kandydat M3×18.

**Scenariusz porażki:** za krótka śruba ma niedostateczne osadzenie; mocowanie regulowane odkręceniem zmienia luz i zero.

**Poprawka/test:** preferuję nakrętkę w kieszeni, ale z konstrukcyjnym ustaleniem odstępu i sprawdzonym dostępem. Wersję Ø2,6 można rozważyć do rzadkiego montażu, po próbie utrzymania ustawienia.  
**Pewność:** wysoka dla wymiarów pakietu; średnia dla trwałości gwintu w wydruku.

**8. WAŻNE — histereza występuje; większy problem stanowi luz promieniowy**

**Miejsce:** oczko swobodnie poruszające się na trzpieniu M3.

Dla samego całkowitego luzu osiowego 0,5–1 mm obliczenie lokalnej czułości obu cięgien daje:

| Położenie | S1: pełna różnica kąta | S2: pełna różnica kąta |
|---|---:|---:|
| Przy zerze | około **0,04–0,08°** | efekt pierwszego rzędu bliski zeru |
| Najgorsza pozycja w badanym zakresie | około **1,81–3,61°** | około **1,25–2,50°** |

To liniowe przybliżenie zmiany między skrajnymi położeniami luzu, z uwzględnieniem sprzężenia obu cięgien. Kalibracja może skasować stałe przesunięcie, ale nie różnicę zależną od kierunku obciążenia.

Przy zerze oczko Ø5 na M3 ma około **2 mm**, a Ø6 około **3 mm** całkowitego luzu wzdłuż kierunku cięgna. Wynikający z niego pełny luz gałki wynosi w przybliżeniu:

| Oczko | S1 | S2 |
|---|---:|---:|
| Ø5 na M3 | **5,8°** | **6,0°** |
| Ø6 na M3 | **8,6°** | **9,0°** |

To pełne szerokości luzu, nie wartości ±. Przy krańcach lokalna czułość rośnie; dla C oszacowanie może przekraczać **kilkanaście stopni**. Dokładny wynik wymaga modelu kontaktu i rzeczywistego wyjścia drutu z oczka.

Ponadto przestrzeń osiowa 8 mm daje w zerze płaskiego oczka około **7 mm swobody**, a nie 0,5–1 mm.

**Scenariusz porażki:** po zmianie kierunku serwo przemieszcza oczko względem śruby, zanim zacznie obracać gałkę; zero zależy od kierunku dojazdu.

**Poprawka/test:** zablokować orczyki i zmierzyć ręcznie pełny luz gałki w zerze oraz przy krańcach, następnie sprawdzić powtarzalność zera po dojeździe z obu stron.  
**Pewność:** wysoka dla występowania luzu i jego skali przy zerze; średnia dla wartości krańcowych.

**9. Porównanie A/B/C**

| Wariant | Zysk | Koszt pracy | Główne ryzyko |
|---|---|---|---|
| A — obecny Z | Najmniej nowych części | Brak prostego sposobu naprawy samą zmianą strony | Potwierdzona blokada o blaszkę |
| B — Ø5 na M3 | Oczko można formować na posiadanej M5; mniejsze gabaryty i luz | Nowa Galka, retencja, rozwiązanie dostępu | Za mały zapas na ±10° i owalizację |
| C — Ø6 na M3 | Największy zapas przechyłu | Nowa Galka, szerszy element zatrzymujący, większa przestrzeń osiowa i rozwiązanie dostępu | Większa histereza; sam łeb nie zatrzymuje oczka |

**Prostszy wariant:** w podanych warunkach nie wykazałem prostszego rozwiązania, które zachowuje cały badany zakres i tolerancję ręcznego gięcia. Powrót do obecnego Z lub zmniejszenie oczka nie usuwa wykazanych problemów. Wiertło Ø6 nie jest potwierdzonym wyposażeniem briefu; C musi być wykonalne i sprawdzalne także bez założenia jego dostępności.

Nie zmieniałem repozytorium i nie pozostawiłem własnych procesów w tle.

**Werdykt: do modelu wybrałbym C, po dodaniu pewnego zatrzymania oczka, zapewnieniu przestrzeni na przechył i wykazaniu dostępu montażowego; żaden z trzech wariantów w obecnie opisanej postaci nie jest gotowy do wydruku testowego.**