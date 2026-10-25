# Krytyczne review koncepcji połączeń cięgien — Astra

**Zadanie:** duże oko v2, połączenia możliwe do złożenia ręcznie przy W1–W4.  
**Wynik:** rekomendacja z punktu 6 wymaga zmian przed przeprojektowaniem modelu. Największe problemy to zakres przegubu S2, niezgodne osie połączeń P-A oraz zabezpieczenia drutu wymagające znacznie większych długości i luzów, niż uwzględniono.

## Zakres i dowody

Przeczytałem koncepcję, SVG, model SCAD, parametry, skrypty, instrukcję montażu, kalibrację, PRD i pomiary E6. Uruchomiłem `duze-oko-katy-przegubow.js` oraz `duze-oko-kinematyka.js`. Niezależnie przeliczyłem równanie stałej długości cięgna na siatce θ/φ co 1°, także dla błędów długości ±2 i ±4 mm.

**Pomiary fizyczne:** brak nowych. Wymiary poniżej pochodzą z modelu i dokumentacji.  
**Obliczenia:** idealna geometria sztywnego drutu Ø1,0, bez odkształceń i tarcia.  
**Niesprawdzone:** pełne kolizje proponowanych zakończeń i łączników na siatkach — tych elementów jeszcze nie zamodelowano. Istniejący skrypt kolizji ich nie reprezentuje.

Repozytorium pozostało bez zmian; nie wykonałem `git pull`, commitów ani zapisu raportu. Obliczenia zakończone, bez uruchomionych przeze mnie zadań w tle.

## 1. KRYTYCZNE — S2 nie uzyskuje wymaganego zakresu w obecnej klepsydrze

**Miejsce:** koncepcja, punkty 4–6; SCAD: `Galka()`, `klepsydra()`.

Z modelu:

- średnica talii: 1,7 mm;
- długość talii: 0,3 mm;
- grubość ucha: 2 mm;
- stożki: 45°;
- drut: Ø1,0.

Dla wycentrowanego, prostego sworznia granica przechyłu wynika z warunku przejścia przez talię:

\[
0{,}5/\cos\beta+0{,}15\tan\beta\leq0{,}85
\]

Daje to **β ≈ 44,6°**. Na powierzchni ucha ograniczenie stożka daje około 44,8°. Są to wartości idealne, bez zapasu na wydruk, zadziory i wielokątny przekrój otworu.

Dla zagięcia L dokładnie 90° policzyłem **najmniejszy możliwy** przechył nogi względem osi otworu. Zakładam przy tym swobodny dobór obrotu drutu, więc rzeczywisty mechanizm może potrzebować więcej.

| Połączenie | Wymagany przechył, długość nominalna | Przy długości ±2 mm |
|---|---:|---:|
| S1, ucho gałki | do 38,4° | do 39,5° |
| S2, ucho gałki | do 53,1° | do 54,0° |

Problem S2 występuje również przy drugiej osi ustawionej w środku:

| θ | φ | Minimalny przechył nogi S2 |
|---:|---:|---:|
| +30° | 0° | 47,6° |
| +35° | 0° | 53,0° |

**Nie jest to wyłącznie problem narożników. Obecne ucho nie zapewnia nawet minimum PRD +30° dla L 90°.**

Zapis „przegub kulisty ±~40°” pomija istotną asymetrię S2. Obrót nogi w otworze daje dodatkową swobodę, ale nie usuwa ograniczenia jej przechyłu. Połączenie z długą, przesuwającą się nogą nie jest też równoważne przegubowi kulowemu o stałym środku.

**Scenariusz porażki:** noga opiera się o talię; dalszy ruch wygina drut, obciąża serwo albo wyłamuje ucho.

**Poprawka/test:** zmienić orientację lub geometrię ucha i zakończenia. Weryfikować cały zakres z błędem gięcia ±10°, a nie tylko idealne 90°. S1 również nie ma wystarczającego zapasu: 38,4° + 10° przekracza obecne 44,6°.

**Pewność:** wysoka dla braku gwarantowanego zakresu; dokładny początek zakleszczenia rzeczywistego drutu wymaga modelu kolanek i próby.

## 2. KRYTYCZNE — przy orczyku pomylono zmianę kąta z jego wartością

**Miejsce:** koncepcja, punkt 5 „Przy orczyku”; SVG, panel B.

Skrypt podaje:

- S1: odchylenie drutu od płaszczyzny orczyka około −10…−1°;
- S2: około −18…−12°.

**6° dla S2 jest zmianą podczas ruchu, a nie maksymalnym odchyleniem.** Proste L 90° musi przyjąć do około 18°; przy błędzie długości −2 mm — około 19°.

Dla prostego otworu długości 2 mm i drutu Ø1 granica przechyłu wynika z:

\[
0{,}5/\cos\beta+1{,}0\tan\beta\leq D/2
\]

| Średnica otworu | Idealny maksymalny przechył |
|---:|---:|
| 1,3 mm | 8,2° |
| 1,4 mm | 10,8° |
| 1,5 mm | 13,3° |
| 1,7 mm | 18,0° |

Zatem **otwór Ø1,3–1,5 nie wystarcza dla proponowanego L 90° na S2**. Dla nominalnych 18° potrzeba około Ø1,70; dla niekorzystnego błędu gięcia dodatkowych 10° — około Ø2,20.

Dokument `30-projekt/e6-pomiary.md` opisuje otwory orczyka jako **około Ø1**, nie Ø1,3–1,5. Dotychczasowa instrukcja przewidywała ich rozwiercanie.

**Scenariusz porażki:** drut zaciska się w orczyku już podczas składania lub przy ruchu.

**Poprawka/test:** uwzględnić stałe odchylenie, rzeczywistą średnicę otworu i tolerancję gięcia. Samo większe rozwiercenie wymaga sprawdzenia wytrzymałości orczyka — otwory są rozmieszczone co 2 mm.

**Pewność:** wysoka; rzeczywista średnica i grubość fabrycznego orczyka pozostają niezmierzone.

## 3. S1/S2: ±2 mm jest osiągalne kinematycznie, ale sam trym nie wystarcza

**Miejsce:** koncepcja, punkty 3–6.

Poniższe wyniki dotyczą idealnych połączeń o stałych środkach, **bez ograniczeń przegubów i kolizji**. Kąt orczyka ma tę samą definicję co w skryptach.

| Cięgno | Błąd długości | Kąt przy gałce na wprost | Zakres kąta orczyka |
|---|---:|---:|---:|
| S1 | −2 mm | +0,56° | −34,25…+48,93° |
| S1 | 0 | −6,00° | −42,20…+37,82° |
| S1 | +2 mm | −12,61° | −50,87…+29,24° |
| S2 | −2 mm | +2,83° | −33,64…+54,12° |
| S2 | 0 | −6,00° | −45,60…+40,18° |
| S2 | +2 mm | −15,00° | −60,13…+29,33° |

Na siatce 1° nie znalazłem pozycji bez rozwiązania dla ±2 mm.

Przybliżenie 6,5° dla S1 jest trafne. Dla S2 dokładniejszy wynik to **+8,83° / −9,00°**, zamiast ±8,5°.

**Zakres serwa:** przy założeniu użytecznego obrotu około ±90° istnieje zapas. Repo nie zawiera jednak pomiaru rzeczywistego zakresu tych egzemplarzy MG90S, więc nie traktuję go jako potwierdzonego.

### WAŻNE — przesunięcie zera nie odtwarza nominalnej kinematyki

Po dodaniu wyłącznie stałego trymu pozostaje błąd wymaganego kąta serwa:

- S1: do około **4,9°**;
- S2: do około **5,5°**.

**Scenariusz porażki:** oko patrzy prosto po kalibracji, ale krańce i narożniki różnią się od przewidzianych; nominalna tabela sterowania nie opisuje złożonego mechanizmu.

**Poprawka/test:** ponownie ustalić krańce i mapowanie obu osi po montażu. Podany katalog `50-elektronika/kalibracja/` zawiera ręczne ustawianie impulsów oraz zapis środka i krańców; nie dowodzi automatycznej kompensacji zmienionej geometrii.

**Pewność:** wysoka.

### WAŻNE — W3 nie gwarantuje błędu długości ±2 mm

Jeżeli **każde z dwóch miejsc gięcia** ma błąd ±2 mm, ich odległość może mieć błąd **±4 mm**. Dla długości skróconej o 4 mm obliczenia wykazały pozycje bez rozwiązania: 47 próbek S1 i 22 próbki S2 z 3621. Nie oznacza to automatycznie naruszenia PRD, które dopuszcza ograniczenie narożników, ale wymaga ponownego wyznaczenia obwiedni ruchu.

**Poprawka/test:** rozróżnić tolerancję miejsca pojedynczego gięcia od tolerancji odległości między zagięciami.

**Pewność:** wysoka.

**Kolizje:** niepotwierdzone. `duze-oko-kolizje.js` wyznacza nominalne długości z pozycji neutralnej, przedstawia cięgna jako proste walce i pomija fragmenty przy połączeniach. Nie zawiera długich nóg, zabezpieczeń ani drukowanych łączników P-A. Wynik starego modelu nie wystarczy do przyjęcia nowej koncepcji.

## 4. KRYTYCZNE — płaski łącznik P-A nie pasuje do osi połączeń

**Miejsce:** punkt 5, P-A; SVG, panel C; SCAD: powieki i S3.

W modelu:

- otwory dźwigni powiek mają osie **X**;
- otwór orczyka S3 ma oś **Y**.

Osie są prostopadłe. Płaski łącznik z dwoma zwykłymi oczkami ma otwory równoległe. Panel C pokazuje właśnie taki układ.

**Małe odchylenie kierunku cięgna od płaszczyzny nie dowodzi zgodności osi sworzni.**

**Scenariusz porażki:** jednego ze sworzni nie da się przełożyć albo listwa musi zostać skręcona i pracuje sprężyście zamiast przegubowo.

**Poprawka/test:** zaprojektować końce o odpowiednich orientacjach i wymaganej swobodzie kątowej albo zmienić adapter na orczyku. Sam skręt końcówek nie zastępuje kontroli przestrzennej kinematyki.

**Pewność:** wysoka dla niezgodności przedstawionego płaskiego łącznika.

### WAŻNE — P-A nie spełnia jeszcze W2 w obecnym modelu

| Fragment | Wynik |
|---|---:|
| Oczko Ø5 z otworem Ø1,4 | ścianka promieniowa 1,8 mm — spełnia W2 |
| Obecny koniec dźwigni Ø4 z otworem Ø1,4 | ścianka 1,3 mm — poniżej W2 |
| Otwór Ø1,4 poprzecznie w grubości 3 mm | ścianka 0,8 mm — poniżej W2 |
| Szczelina między sąsiednimi płytkami dźwigni | 0,2 mm — nie pomieści listwy 3 mm |

Rozstaw środkowych płaszczyzn dźwigni wynosi 1,7 mm. Łączniki trzeba rozmieścić po świadomie wybranych stronach, z nowymi przesunięciami i kontrolą kolizji.

Dla otworu Ø1,4 i ścianki 1,5 minimalny zewnętrzny wymiar oczka wynosi **4,4 mm**. Promień dźwigni 7 mm sam w sobie nie wyklucza takiego oczka; obecna końcówka Ø4 jest po prostu za mała według W2.

Dodatkowo dwa niezależne sworznie Ø1 nie przejdą przez wspólny fabryczny otwór Ø1,3–1,5. Dotychczasowy model przewidywał dla dwóch drutów otwór **Ø2,4**.

**Scenariusz porażki:** brak miejsca, cienka ścianka albo niemożliwy montaż obu połączeń przy S3.

**Poprawka/test:** pełny przekrój złożenia obu łączników, sworzni i orczyka; osobno kontrola grubości, luzów i przejścia podczas montażu.

**Pewność:** wysoka dla wymiarów; końcowe kolizje zależą od nowego rozmieszczenia.

## 5. Powieki: 8,4°/mm jest poprawne lokalnie, lecz bilans błędów jest niepełny

**Miejsce:** punkt 4 i uzasadnienie P-A.

Dla górnej powieki obliczyłem:

| Pozycja nominalna | Lokalna czułość | Efekt wydłużenia o 1 mm |
|---|---:|---:|
| Zamknięta | −9,87°/mm | −10,50° |
| Połowa skoku | −8,29°/mm | −8,41° |
| Całkowicie otwarta | −8,59°/mm | −8,42° |

**8,4° dla +1 mm w połowie skoku jest poprawne.** Przy domykaniu wpływ jest większy, a dla ±2 mm nieliniowość staje się istotna.

### WAŻNE — ±0,2 mm wydruku nie oznacza ±1,7° całego mechanizmu

Jeżeli jeden łącznik ma +0,2 mm, a drugi −0,2 mm, różnica wynosi 0,4 mm. Po ustawieniu serwa tak, aby górna powieka była zamknięta, dolna wypada około:

- **+3,68°** dla górnego łącznika +0,2 i dolnego −0,2;
- **−4,31°** przy przeciwnych błędach.

To wynik idealnych połączeń, przed dodaniem luzów. Już nominalny model ma niewielką asymetrię: około −0,25° dolnej powieki przy zamknięciu górnej.

Otwór Ø1,4 na drucie Ø1 daje luz promieniowy 0,2 mm. Dwa końce pojedynczego łącznika mogą zmienić efektywną odległość pod obciążeniem o około ±0,4 mm, czyli około **±3,3° w środku skoku**. Odwrócenie kierunku obciążenia może dać większą martwą strefę. To oszacowanie graniczne, nie przewidywanie typowego zachowania.

**Scenariusz porażki:** jedna powieka zostaje uchylona albo druga jest dociskana przez serwo mimo poprawnych długości wydruku.

**Poprawka/test:** uwzględnić różnicę długości, luzy i oba kierunki obciążenia; przewidzieć regulację jednej powieki lub wykazać domknięcie bez przeciążenia na złożonej próbce.

**Pewność:** wysoka dla obliczeń; rzeczywisty rozrzut wydruku nie został zmierzony.

## 6. Wykonalność kroków montażu z punktu 7

| Krok | Ocena przy ±2 mm / ±10° |
|---|---|
| **1. Wydrukować łączniki** | Wykonalne po poprawieniu geometrii. Obecna koncepcja nie rozwiązuje osi sworzni i cienkich ścianek. |
| **2. Uciąć druty i zagiąć L** | Samo gięcie długiej nogi jest wykonalne. Zapas 15 mm jest za mały dla opisanych zabezpieczeń. Brakuje też nowego rysunku 1:1. |
| **3. Przełożyć przez ucho i dogiąć koniec** | Możliwe warunkowo na osobnej gałce, przed kardanem. Dostęp szczękami, podparcie i tor gięcia nie zostały pokazane. Ucho nie może służyć jako opór przy gięciu sprężynowego drutu. |
| **4. Połączyć z orczykiem** | Dogięcie najlepiej wykonać na zdjętym orczyku. Przejście Ø1 i zakres przechyłu nie są zapewnione; S2 wymaga zmiany. |
| **5. Założyć łączniki powiek i sworznie** | W obecnym P-A niewykonalne zgodnie z rysunkiem: osie X/Y, wspólny otwór S3 i brak geometrii zabezpieczeń. |
| **6. Skalibrować** | Zero S1/S2 można ustawić, ale trzeba też ustalić krańce i sprzężenie osi. Jedno serwo nie skasuje różnicy między powiekami. |

**Czynności nadal wymagające precyzji albo dodatkowego narzędzia:** sprawdzenie/obróbka otworów, ustalenie rzeczywistego rozstawu przegubów oraz kontrola pasowania. Dotychczasowa instrukcja wymaga rozwiercania Ø1,4/1,7/2,4; nie są to czynności wykonywane samymi kombinerkami.

## 7. WAŻNE — długie zabezpieczenia tworzą duży luz i nieznaną obwiednię

**Miejsce:** punkt 5; SVG A–C.

Noga o długości „grubość 2 mm + co najmniej 5 mm za uchem”, z drugim zagięciem dopiero na końcu, pozostawia około **5 mm możliwego przesuwu osiowego**. To wielokrotnie więcej niż wymagane 0,2–0,3 mm.

W S2 rzut takiego przesunięcia na kierunek cięgna może osiągać kilka milimetrów. Założenie stałego środka przegubu i stałej długości roboczej przestaje obowiązywać.

**Scenariusz porażki:** po zmianie kierunku obciążenia drut przesuwa się do drugiego oporu; zero i luzy zależą od kierunku ruchu. Dogięcie zabezpieczenia bliżej usuwa luz, ale przywraca problem precyzyjnego gięcia przy plastiku.

**Poprawka/test:** zaprojektować utrzymanie osiowe oddzielnie od miejsca chwytu kombinerkami. Zweryfikować skrajne położenia osiowe, nie tylko położenie centralne.

**Pewność:** wysoka dla braku kontroli luzu; jego dokładna wartość zależy od wykonania.

Dodatkowe luki:

- **Wypadanie — WAŻNE:** „koniec zagięty gdziekolwiek” nie definiuje długości poprzecznego zabezpieczenia ani toru, po którym może przejść przez otwór. Potrzebny jest określony minimalny kształt i test wyciągania przy skrajnych przechyłach. Pewność: wysoka co do braku definicji.
- **Ucho gałki — WAŻNE:** pod otworem na poziomie talii zostaje tylko **1,2 − 0,85 = 0,35 mm** materiału. Przy powierzchniach ucha rozszerzenie klepsydry wychodzi poza dolny obrys. To nie odpowiada W2. Potrzebne powiększenie ucha i próbka. Pewność: wysoka z geometrii SCAD.
- **Zużycie — WAŻNE:** stalowy sworzeń pracuje na PLA, miejscami na wąskiej krawędzi. Brak podstaw do liczbowej prognozy trwałości. Sprawdzić zmianę luzu i domknięcia podczas testu odpowiadającego pracy wystawowej. Pewność: wysoka co do braku dowodu trwałości.
- **Sprężynowanie — WAŻNE:** ±10° musi być tolerancją po zwolnieniu szczęk. Nie można jednocześnie zakładać tej tolerancji i wymagać trafienia w korzystny kąt odciążający S2. Pewność: wysoka.
- **Dostęp — WAŻNE:** brak przeprowadzonej próby dwóch chwytów szczękami około 5 mm w gałce. Weryfikować na osobnej skorupie, przed montażem kardana. Pewność: średnia; nie stwierdzam, że dostęp na pewno jest niemożliwy.

Analogia RC nie rozstrzyga tych luk: producent Du-Bro opisuje L 90° zabezpieczane **osobnym zatrzaskowym elementem E/Z Link**, a nie dowolnie odległym drugim zagięciem drutu. [Opis producenta](https://www.dubro.com/products/mini-e-z-link-for-062)

## 8. Drut już zgięty na Z: odzysk i minimalna długość

**Miejsce:** punkt 7.2; istniejąca instrukcja gięcia.

Do oszacowania przyjmuję uproszczoną receptę: roboczy prosty korpus, na każdym końcu przejście przez 2 mm plastiku, 5 mm za plastikiem i ogon 5 mm do chwytu. Pomijam promienie kolanek oraz przesunięcia środka przegubu — nie jest to gotowa długość cięcia.

\[
L_\text{drutu}\approx L_\text{korpusu}+2(2+5+5)=L_\text{korpusu}+24\text{ mm}
\]

| Cięgno | Dla nominalnego korpusu | Dla korpusu krótszego o dopuszczone 2 mm |
|---|---:|---:|
| S1 | 65,9 mm | 63,9 mm |
| S2 | 66,9 mm | 64,9 mm |

**Zapas 15 mm nie wystarcza dla tej recepty.** Docelowa długość wymaga ponownego obliczenia po określeniu rzeczywistych zakończeń.

Stara instrukcja przewidywała odcinki około 54 mm dla S1 i 55 mm dla S2. Po odcięciu obu Z pozostanie jeszcze mniej — około długości samego korpusu, zależnie od miejsca cięcia.

**Wniosek:** odcięcie obu Z i wykonanie nowych L z długimi zabezpieczeniami nie pozwoli zachować wymaganej długości S1/S2. Noga Z 2,5 mm również nie spełnia W4.

Odzysk na sworznie P-A jest możliwy długościowo, lecz pokazuje skalę problemu. Dla dwóch swobodnie dostępnych zagięć:

- dźwignia 1,5 + łącznik 3 + przyjęty luz osiowy 0,4 + dwa odcinki po 5 + dwa ogony po 5: **24,9 mm**;
- orczyk 2 + łącznik 3 + 0,4 + 20: **25,4 mm**.

To oszacowanie dla opisanej metody, nie rekomendacja takich sworzni. Jeden odzyskany prosty odcinek około 42 mm wystarczy na jeden taki sworzeń, nie na dwa.

**Pewność:** wysoka dla niewystarczającej długości; dokładny odzysk konkretnego drutu wymaga jego pomiaru.

## 9. Porównanie opcji przy W1–W4

| Opcja | Ocena |
|---|---|
| **P-A, obecna postać** | Dobre źródło powtarzalnej długości, lecz błędne osie końców, niepełny bilans luzów i kłopotliwe sworznie. Nieprzyjęta. |
| **P-B, otwory co 1 mm na r 7** | Słaba regulacja: skala około 8–10° na 1 mm. Otwory Ø1,4 co 1 mm nachodzą na siebie. Odrzucenie tej odmiany jest zasadne. |
| **P-B, regulacja w korpusie cięgna** | Warta dalszego opracowania. Regulacja nie musi leżeć na dźwigni r 7. Może usunąć wymóg dokładnego gięcia i różnicę domknięcia bez dodatkowego serwa. |
| **P-C, osobne serwa** | Usuwa wspólną kalibrację powiek, lecz nie naprawia połączeń. Zmienia liczbę serw; wyłącznie decyzja użytkownika. |
| **Drukowane przeguby kulowe** | Przy wymaganiach S2 trzeba zapewnić co najmniej około 53°, a dla L z błędem ±10° jeszcze więcej. Mały zatrzask Ø5 nie ma tu dowiedzionej geometrii ani ścianek ≥1,5. Nie uznaję za prostszą opcję zgodną z W2. |
| **Drukowane pręty z oczkami M3** | Potencjalnie wygodniejsze montażowo dla powiek po przeprojektowaniu końców. Oczko pod Ø3,3 ze ścianką 1,5 wymaga zewnętrznie co najmniej Ø6,3. Dla S1/S2 zwykła śruba nadal nie zapewnia wymaganego przegubu przestrzennego. |

**Najbardziej obiecująca poprawka bez zakupów i bez zmiany liczby serw:** ciągła regulacja jednego cięgna powiek **w jego korpusie**, zaciskana posiadaną śrubą M3.

Przykładowa skala do sprawdzenia:

- dla błędu długości każdego cięgna ±2 mm potrzebna korekta ich różnicy do ±4 mm;
- zakres przesuwu 8 mm oznacza fasolkę długości około **11,3 mm** przy szerokości 3,3;
- korpus szerokości 10 mm pozostawia po bokach fasolki około 3,35 mm materiału.

To omija zarzut „na r 7 nie ma miejsca na regulację”. **Nie jest jeszcze rozwiązaniem całego połączenia:** nadal trzeba poprawić końcówki, osie i rozmieścić elementy. Jeśli ±2 mm dotyczy każdego zagięcia oddzielnie, wymagany zakres regulacji będzie większy.

Dla S1/S2 nie znajduję w przedstawionym materiale gotowego, dowiedzionego rozwiązania spełniającego jednocześnie W1–W4. Nie należy zastępować tej luki deklaracją, że „luz przyjmie”.

## 10. Rysunki dla użytkownika wymagają poprawy

**Miejsce:** `40-cad/druty/polaczenia-ciegien-hobby.svg`. Ocena na podstawie geometrii i opisów SVG.

### KRYTYCZNE — rysunki utrwalają błędne założenia

- **A:** deklaruje ±45° i „ucho bez zmian”, mimo niewystarczającego zakresu S2. Nie pokazuje kontrolowanego luzu osiowego.
- **B:** podpis „tylko 6–9°” powtarza pomylenie zmiany kąta z jego wartością. Widok boczny nie pokazuje czytelnie pierwszego L: drut przechodzący przez orczyk narysowano w jednej prostej.
- **C:** pokazuje równoległe sworznie, podczas gdy model wymaga osi X/Y. Pokazuje tylko jeden łącznik; brakuje drugiego i wspólnego połączenia przy S3.
- **C:** podpis „w modelu ~Ø6” nie odpowiada końcówce dźwigni: model ma tam Ø4.

**Scenariusz porażki:** użytkownik składa według ilustracji połączenie, którego geometria nie odpowiada mechanizmowi.

**Poprawka/test:** nowy rysunek z obiema powiekami, osiami X/Y/Z, stronami montażu, luzami i rzeczywistymi zakończeniami.

**Pewność:** wysoka.

### WAŻNE — brakuje aktualnego szablonu i jednoznacznych wymiarów

W panelu C rozstaw otworów wynosi 244 jednostki SVG. Przy zadeklarowanym przybliżeniu 6 px/mm daje **40,7 mm**, choć podpis mówi 44,6 mm. Rysunek może być schematyczny, ale nie może służyć do odmierzania.

Istniejący `duze-oko-v2-druty-1do1.svg` nadal przedstawia odrzucone Z i kąty starej koncepcji. Nie jest szablonem nowych L.

**Poprawka/test:** oddzielić schemat montażowy od nowego szablonu 1:1; podać rozstaw osi, długość całkowitą, minimalne ogony i odcinek kontrolny skali.

**Pewność:** wysoka.

## Warunki przyjęcia poprawionej koncepcji

1. Wykazać zakres S1/S2 z tolerancją gięcia ±10°, rzeczywistymi otworami i kontrolowanym luzem osiowym.
2. Poprawić P-A albo opracować regulowane cięgno powiek, uwzględniając prostopadłe osie połączeń i jednoczesne domknięcie.
3. Pokazać wykonalny chwyt kombinerkami oraz dostateczną długość każdego odzyskiwanego odcinka.
4. Przemieść pełne modele końców, zabezpieczeń i łączników przez zakres ruchu oraz montażu; uwzględnić krańce luzów.
5. Zastąpić rysunki instrukcją zgodną z tą geometrią.

**Decyzja funkcjonalna poza zakresem review:** P-C, czyli czwarte serwo, wymaga zgody użytkownika; nie przyjmuję go jako obejścia problemów.

**Werdykt: koncepcja wymaga zmian przed przeprojektowaniem modelu — przede wszystkim poprawienia przegubu S2 i połączeń przy orczykach, zastąpienia płaskiego P-A geometrią zgodną z osiami X/Y oraz rozwiązania zabezpieczeń i regulacji bez precyzyjnego gięcia przy plastiku.**