# Review Astra: „oczko zamiast Z” na języczkach gałki

26.10.2026. Zakres: trzy pytania z `2026-10-26-oczko-brief.md`, nie odbiór całego modelu v3. Stan źródeł: `871090f2f06171ecabe3bd29d25f2771d87b59e0` (HEAD zgodny z briefem). Nie czytałem raportów `*-opus.md`. Nie zmieniałem modelu, eksportów ani wymagań.

**Ocena (a): NADMIAROWE jako odstępstwo uzasadniane niezbędnością.** Problem obecnego zaczepu jest rzeczywisty, ale nie wykazano konieczności zastąpienia „Z” oczkiem. Otwór z odpowiednio krótką gardzielą pozwala na kołysanie poprzeczki „Z”; trzeba także zmienić odsadzenie i sprawdzić cały sztywny drut. To nie jest zgoda na druk obecnego zaczepu ani potwierdzenie gotowości alternatywy po samym rachunku otworu.

## 1. Własne obliczenie wychyleń

### Dane i metoda

Źródło wymiarów: `40-cad/openscad/duze-oko-v3.scad`, parametry i moduł `zaczep_galki()`. Sprawdziłem również `duze_oko_v3_kinematyka.py` i `duze-oko-v3-przemiatanie.py`; obliczenia poniżej wykonałem własnym rozwiązaniem analitycznym, bez wywoływania ich solvera.

- Obrót gałki: `R = Ry(ψ) Rx(−θ)`; ψ = L–P, θ = G–D.
- Zaczep L–P: `j0=(14,0,−4,5)`, normalna języczka `n0=(0,1,0)`; zaczep G–D: `j0=(0,14,−4,5)`, normalna `n0=(1,0,0)`. Znak normalnej nie wpływa na wartość bezwzględną kąta.
- Otwór orczyka L–P: `h(α)=(31,5−17,5 cos α, 0, −66+17,5 sin α)`.
- Otwór orczyka G–D: `h(α)=(0, 2,3+11,5 cos α, −60+11,5 sin α)`.
- Długości między środkami otworów, wyznaczone w pozycji zero: L–P `61,500000 mm`, G–D `55,500360 mm`.

Dla każdego położenia rozwiązuję `|h(α)−Rj0|²=L²`, wybierając gałąź serwa najbliższą zeru. Następnie `u=(h−Rj0)/L`, `n=Rn0`, a kąt wyjścia pręta **z płaszczyzny języczka** wynosi `β=asin(|u·n|)`. To kąt prostego odcinka między środkami otworów; nie deklaracja, że dowolnie wygięty fizyczny drut ma już zapewnione wszystkie stopnie swobody.

Przemiatano ruchy każdej osi osobno co 0,1° oraz prostokąty obu zakresów co 0,2°. Ekstrema w tabeli leżą również w jawnie przeliczonych położeniach granicznych. Nie jest to ciągła kontrola kolizji siatek.

| Zakres gałki | Zaczep | Maks. β przy drugiej osi w zerze | Przykładowe położenie (ψ, θ) | Maks. β w całym prostokącie |
|---|---|---:|---|---:|
| Cel ±35° / ±25° | L–P | **26,772056°** | (0°, +25°) | 26,772056° |
| Cel ±35° / ±25° | G–D | **37,665186°** | (+35°, 0°) | **40,883875°**, (+35°, +25°) |
| Minimum ±30° / ±20° | L–P | **21,434026°** | (0°, +20°) | 21,434026° |
| Minimum ±30° / ±20° | G–D | **32,323161°** | (+30°, 0°) | **34,641892°**, (+30°, +20°) |

**Problem istnieje także bez narożników i przy minimum PRD.** PRD §4 wymaga pełnych wychyleń każdej osi przy drugiej w środku; pozwala ograniczyć narożniki. Dlatego 40,88° nie wolno traktować jako bezwzględnego wymagania, ale już 32,32° wyklucza zaczep o rzeczywistej zdolności kołysania tylko ±20°.

### Co ogranicza obecny otwór

Dla prostego cylindrycznego odcinka drutu Ød przechylanego o γ względem osi cylindrycznego otworu, przy wycentrowaniu w połowie grubości t, konieczny wymiar w kierunku przechyłu to:

`D_wym = d / cos γ + t · tan γ`.

Pierwszy składnik jest szerokością eliptycznego przekroju drutu, drugi przesunięciem osi między powierzchniami. Dla klasycznego „Z” z poprzeczką prostopadłą do głównego ramienia najmniejszy możliwy γ na zaczepie wynosi β. Nie uwzględnia to jeszcze kolizji zagięć i końcówki zabezpieczającej.

| Otwór / gardziel, drut Ø1 | Granica γ bez zapasu na druk |
|---|---:|
| Ø1,3, t=2,5 mm — obecny model, idealnie okrągły otwór | **6,687930°** |
| Ø1,6, t=2,5 mm — tylko rozwiercenie | **12,930605°** |
| Ø1,6, t=1,25 mm | **22,495232°** |
| Ø1,6, t=0,50 mm | **36,022769°** |
| Ø1,6, t=0,40 mm | **38,638495°** |

Obecny otwór jest faktycznie 16-kątem wpisanym w Ø1,3, o najmniejszym świetle `1,3 cos(π/16)=1,275021 mm`, więc idealny okrąg daje wynik optymistyczny. Już porównanie 6,69° z 32,32° wystarcza do odrzucenia obecnego ciasnego „Z”, bez polegania na wartościach przenikania projektanta.

## 2. Czy oczko jest niezbędne i co z wariantem (b)

**„Ø1,6 z fazkami daje najwyżej ±20°” nie wynika z samej średnicy.** Brakuje głębokości i kąta fazek oraz długości pozostawionej gardzieli. Płytki otwór dwustożkowy i długi otwór walcowy to różne ograniczenia kinematyczne.

Dla dwustronnych fazek 45° w języczku 2,5 mm, pozostawiających gardziel Ø1,6 długości 0,5 mm, fazka ma po 1,0 mm głębokości, a wylot Ø3,6. Przy γ<45° obwiednia drutu rozszerza się wolniej niż fazka; o przejściu decyduje gardziel.

- Minimum PRD, G–D przy ruchu jednej osi: wymagane **Ø1,499738**, wobec Ø1,6 zostaje **0,050131 mm na stronę** w krytycznym przekroju.
- Minimum z pełnymi narożnikami: wymagane **Ø1,560946**, zapas **0,019527 mm na stronę**.
- Cel przy ruchu jednej osi: wymagane **Ø1,649231** — gardziel Ø1,6 / 0,5 **nie przechodzi**.
- Cel z narożnikami: wymagane **Ø1,755553** — również nie przechodzi.

**Odpowiedź o (b):** wariant rzeczywiście ograniczony do ±20° nie spełnia minimum; wariant „Ø1,6 z fazkami” bez ich wymiarów jest nierozstrzygnięty; po pozostawieniu gardzieli 0,5 mm spełnia nominalny warunek kątowy minimum, lecz zbyt mały zapas nie uprawnia do przyjęcia wydruku. Nie utożsamiam tego rachunku z działającym połączeniem. Dochodzą grubość materiału przy otworze, zagięcia, tarcie i luz po wydruku.

### Rozwiązanie zachowujące ustalenie „końce w Z”

Nie trzeba dodawać części ani rezygnować z „Z”, aby usunąć samą przeszkodę kątową. Można ukształtować otwór dwustożkowo, poszerzyć koniec istniejącego języczka i zwiększyć odsadzenie drutu. Przykład liczbowy do dalszej weryfikacji, **nie gotowy projekt**:

- nadal ten sam drut Ø1,0, bez dodatkowego przegubu składanego;
- języczek grubości 2,5 mm, gardziel o **rzeczywistym świetle Ø2,3**, długość **0,6 mm**;
- fazki 45° po **0,95 mm**, wyloty Ø4,2;
- dla **γ=42°** wymagane światło gardzieli **1,885875 mm**, zapas **0,207062 mm na stronę** w krytycznym przekroju; obejmuje również obliczone narożniki;
- powiększenie końca tego samego języczka: przykładowo wysokość 6,5 mm i wewnętrzna krawędź przy r=10,9, przy zachowaniu środka otworu r=14; do krawędzi od wylotu fazki zostaje odpowiednio **1,15 i 1,0 mm**. To zmiana kształtu istniejącej części, nie nowa część;
- odsunięcie osi głównego ramienia drutu od środka otworu trzeba zwiększyć względem obecnych 1,75 mm. W przekroju przechyłu dla języczka 2,5 × 6,5 i γ=42° warunek odstępu powierzchni drutu 0,5 mm od narożnika wynosi `H ≥ 1,25 cos γ + 3,25 sin γ + 0,5 + 0,5 = 4,103606 mm`. **H=4,3 mm** przechodzi ten lokalny warunek. Jest to odległość do osi głównego ramienia, nie całkowita długość poprzeczki „Z”. Końcówka po drugiej stronie potrzebuje analogicznej kontroli.

Tak duży otwór oznacza większy luz i wymaga próby; jego średnica nie jest rekomendacją ostatecznego pasowania. Przykład wykazuje, że nie ma geometrycznego zakazu zachowania „Z”. Nie dowodzi jeszcze braku kolizji większego zaczepu i drutu z kardanem, czaszą, powiekami oraz orczykami ani wygodnego przełożenia gotowego zagięcia przez otwór. Te kontrole są konieczne tak samo jak dla proponowanego oczka.

Sprawdziłem dodatkowo orientację sztywnego drutu z równoległymi poprzeczkami obu „Z”: dla kierunku pręta u wybrałem `q = normalize(n_serwa − (n_serwa·u)u)`. Poprzeczki są wtedy prostopadłe do pręta, a odchylenie przy serwie minimalne. Maksymalne kąty poprzeczki względem osi otworu w pełnym prostokącie celu wynoszą:

| Pręt | Przy gałce | Przy serwie |
|---|---:|---:|
| L–P | 26,772056° | 1,772056° |
| G–D | **40,923553°** | **5,928954°** |

Dla minimum G–D są to 34,657363° i 4,659430°. Oba końce mają zatem możliwą orientację bez zmiennego kąta gięcia drutu; przyjęcie 42° w przykładzie obejmuje także ten warunek. Dla jednakowych odsunięć H na obu końcach punkty początku i końca głównego ramienia to `j+Hq` oraz `h+Hq`, więc jego długość pozostaje L. To konstrukcja kinematyczna; fizyczny promień gięcia i montaż nadal wymagają kontroli.

**Wniosek:** do spełnienia PRD potrzebna jest korekta geometrii połączenia, ale materiał nie uzasadnia wyłączności oczka. Przy regule „odstępstwo tylko gdy obaj uznają je za niezbędne” nie udzielam takiej zgody. Zmniejszenie zakresu do wartości poniżej ±30° / ±20° byłoby zmianą funkcji; dopuszczone w PRD ograniczenie narożników nią nie jest.

## 3. Czy przemiatanie dowodzi niemożliwości „Z”

**Nie. Dowodzi problemu konkretnego modelowania drutu i geometrii v3, nie wszystkich zakończeń „Z”.**

`drut_Z()` w `duze-oko-v3-przemiatanie.py` narzuca poprzeczkę dokładnie wzdłuż aktualnej normalnej każdego otworu i odsadzenie `ODS=1,75`. Łączy następnie końce poprzeczek odcinkiem głównym. Nie pozwala poprzeczce kołysać się w otworze. Nie modeluje też pełnej końcowej odgiętki zabezpieczającej ani promieni gięcia.

Przy takim tworzeniu łamanej długość jej głównego odcinka zmienia się wraz z położeniem, mimo stałej odległości między środkami otworów:

| Pręt | Długość w zerze | Min.–maks. długości głównego odcinka `drut_Z()` w siatce celu |
|---|---:|---:|
| L–P | 61,500000 mm | **60,766129–62,234438 mm** |
| G–D | 55,500360 mm | **54,492640–56,509712 mm** |

Zatem „rzeczywisty kształt Z” w opisie jest zbyt mocnym określeniem: skrypt deformuje łamaną. Ponadto wyłącza z kontroli własny otwór i pierwsze 2,5 mm przy zagięciu. Nie ma w nim warunku przejścia pochylonej poprzeczki przez gardziel.

Wartości **−1,33 / −0,99 mm** występują w zapisanym `przemiatanie-v3.txt`; nie przedstawiam ich jako własnego ponownego pomiaru siatek. Niezależnie potwierdzam wadę obecnego otworu rachunkiem kątowym powyżej. Do porównania poprawek potrzebny jest model jednego sztywnego drutu o stałych długościach, stałych kątach zagięć i rzeczywistych promieniach, z dozwolonym kołysaniem w otworach.

## 4. Oczko: część, przegub i ryzyka

### Interpretacja PRD §9

Oczko wykonane z tego samego odcinka drutu **nie dodaje części do zestawienia ani kolejnego połączenia szeregowo w pręcie**. Mechanicznie kontakt oczko–języczek jest ruchomą parą, czyli połączeniem przegubowym, ale „Z” w otworze też już tworzy ruchomą parę. Nie jest to dodatkowy kardan ani kupna końcówka kulowa; jest to zamiana geometrii istniejącego zakończenia i jego sposobu artykulacji.

Nie należy jednak na tej podstawie uznawać (a) za automatycznie zgodne z ustaleniem 1: **„końce zagięte w Z” zostaje zmienione na „oczko”**. PRD §9 i brief wymagają pokazania odstępstwa, jego montażu i uzasadnienia. Nazywanie oczka tylko „zakończeniem” nie zastępuje tej procedury. Sama liczba części nie jest argumentem za jego niezbędnością.

### Uwagi recenzenckie

| Waga | Miejsce | Scenariusz porażki i liczby | Poprawka albo test | Pewność |
|---|---|---|---|---|
| **KRYTYCZNE** | Obecny języczek i „Z”, `zacz_gr=2,5`, `zacz_otw=1,3` | Kołysanie poprzeczki ograniczone do ≤6,69°, a minimum PRD wymaga ≥32,32° na G–D. Wymuszanie ruchem serwa obciąży drut i języczek zamiast zapewnić zakładany ruch swobodny. | Zmiana otworu i zakończenia „Z” albo zatwierdzone inne zakończenie; próba ręczna obu osi przed napędem. | Wysoka dla konfliktu geometrii; nie wyznaczano siły uszkodzenia. |
| **KRYTYCZNE dla (a) zastosowanego bez zmiany języczka** | Ø2,4 w obecnym końcu języka | Środek otworu r=14, krawędź r=12,8: mostek `14−12,8−2,4/2 = 0 mm`. Otwór styka się z krawędzią; nie ma mostka o dodatnim przekroju utrzymującego ogniwo. Tolerancja druku lub obciążenie otworzy zaczep. | Przesunąć krawędź lub otwór, jawnie zaprojektować mostek i sprawdzić jego wydruk oraz obciążenie. Samo zwiększenie Ø1,3→Ø2,4 jest niedopuszczalne. | Wysoka, wprost z modelu. |
| **WAŻNE** | Uzasadnienie granicy wariantu (b) | Brak wymiarów fazek; założenie „najwyżej 20°” pomija gardziel. Ø1,6/0,5 nominalnie dopuszcza 36,02°, ale przy minimum zapas jest tylko 0,050 mm/stronę. | Wymiarować otwór jako profil, podać światło po eksporcie i po druku; krótka próbka z rzeczywistym drutem. | Wysoka dla rachunku, wynik wydruku nieznany. |
| **WAŻNE** | Model drutu w przemiataniu | Zmienne długości odcinka i brak przechyłu poprzeczki nie rozstrzygają wykonalności stałego „Z”; pomijane są strefy, które decydują o zacinaniu. | Przemiatanie sztywnego drutu, z pełnymi końcówkami i otworami, dla wybranej poprawki; sprawdzić także drogę wkładania. | Wysoka, odczyt kodu i własny rachunek długości. |
| **WAŻNE** | Oczko Ø1 przez otwór Ø2,4 | Nominalny luz promieniowy prostego fragmentu to **0,7 mm**, a możliwy przesuw między przeciwnymi ściankami **1,4 mm**. Skala martwego ruchu na ramieniu 14 mm to około `1,4/14 = 0,100 rad = 5,73°`; to oszacowanie bez uwzględnienia krzywizny oczka, nie pomiar gotowego układu. Zmiana znaku siły może dać opóźnienie i stuk. | Podać średnicę wewnętrzną oczka, jego orientację i długość roboczą; zmierzyć martwy ruch przy zmianie kierunku. Także większy otwór pod „Z” wymaga tej kontroli. | Wysoka dla luzu prostego fragmentu; średnia dla przełożenia na rzeczywisty ruch oczka. |
| **WAŻNE** | Zamknięcie i gięcie oczka | Niedomknięte oczko może się odhaczyć przy kołysaniu. Zbyt ciasne oczko zakleszczy język; zbyt duże zwiększy obwiednię i luz. Drut jest sprężynowy Ø1,0; brak gatunku, promienia gięcia i próby nie pozwala potwierdzić jego doginania bez pęknięcia lub sprężynowania. | Określić promień, położenie styku/zakładki końców, zabezpieczenie przed rozwarciem i próbę pchania/ciągnięcia w skrajnych położeniach. Nie opierać cyklu ruchu na powtarzalnym doginaniu drutu. | Wysoka dla braków specyfikacji; zachowanie materiału niezmierzone. |
| **WAŻNE** | Montaż oczka palcami, PRD §9 | Zamknięte pojedyncze ogniwo nie daje się przewlec przez zamknięty języczek bez otwarcia lub uformowania po przewleczeniu. Tylny otwór gałki Ø50 nie dowodzi dostępu szczęk kombinerek po osadzeniu kardana i powiek. Nie potwierdzono montażu samymi palcami. | Przewlec i domknąć drut w samej gałce przed osadzeniem na kardanie; sprawdzić dostęp narzędzia, potem możliwość założenia drugiego końca „Z” i orczyka. Pokazać kolejność na próbce; narzędzie obsługuje ojciec. | Wysoka dla konieczności otwarcia/uformowania, dostęp narzędzia wymaga próby. |

## 5. Co rzeczywiście dowodzi referencja

W `the_face_code.ino` odczytałem zadawane kąty serw oka: kanał 1 **65/75/85°**, kanał 2 **75/87/105°**, kanał 4 **65/85/105°**, kanał 5 **75/85/105°**. To odpowiednio −10/+10°, −12/+18°, ±20° i −10/+20° względem zapisanych środków.

Drugi plik, `servo_motor_code.ino`, ma większe wychylenia: kanał 1 **60/75/90°**, 5 **70/90/110°**, 2 **70/95/110°**, 4 **60/80/110°** — do **−25/+15°** i **−20/+30°** na dwóch kanałach. Stwierdzenie „kod referencji ma tylko ±10–20°” nie obejmuje zatem obu dostarczonych programów.

Są to **komendy serw, nie zmierzone kąty gałki ani kąty kołysania zaczepu**. Bez przełożenia i wymiarów połączenia nie dowodzą ani ograniczenia gałki do 20°, ani zdolności przeniesienia zakresu obecnego PRD.

## 6. Odtworzenie kluczowego rachunku

Poniższy niezależny kod używa tylko biblioteki standardowej Pythona; uruchomiony przez stdin z `python3 -B` nie zapisuje plików. Wymiary są przepisane z badanego SCAD, a nie pobrane z raportu projektanta.

```python
from math import sin, cos, radians, degrees, sqrt, asin, acos, atan2, pi

def dot(a, b): return sum(x*y for x, y in zip(a, b))
def sub(a, b): return tuple(x-y for x, y in zip(a, b))
def norm(v): return sqrt(dot(v, v))
def rot(v, psi, theta):
    p, t = radians(psi), radians(theta)
    x, y, z = v
    y, z = cos(t)*y + sin(t)*z, -sin(t)*y + cos(t)*z
    return cos(p)*x + sin(p)*z, y, -sin(p)*x + cos(p)*z

def stan(psi, theta, axis):
    if axis == 'LP':
        j0, c = (14, 0, -4.5), (31.5, 0, -66)
        e, f, n0, L = (-17.5, 0, 0), (0, 0, 17.5), (0, 1, 0), 61.5
    else:
        j0, c = (0, 14, -4.5), (0, 2.3, -60)
        e, f, n0 = (0, 11.5, 0), (0, 0, 11.5), (-1, 0, 0)
        L = sqrt(55.5**2 + .2**2)
    j, n = rot(j0, psi, theta), rot(n0, psi, theta)
    v = sub(c, j)
    A, B = 2*dot(v, e), 2*dot(v, f)
    C = L*L - dot(v, v) - dot(e, e)
    phase, delta = atan2(B, A), acos(C/sqrt(A*A+B*B))
    roots = [(phase+s*delta+pi) % (2*pi)-pi for s in (-1, 1)]
    a = min(roots, key=abs)
    h = tuple(c[i]+e[i]*cos(a)+f[i]*sin(a) for i in range(3))
    u = tuple(x/L for x in sub(h, j))
    beta = degrees(asin(min(1, abs(dot(u, n)))))
    q = sub(n0, tuple(dot(n0, u)*x for x in u))
    q = tuple(x/norm(q) for x in q)
    gamma = degrees(acos(min(1, abs(dot(q, n)))))
    servo = degrees(acos(min(1, abs(dot(q, n0)))))
    # Odsunięcia stosowane przez istniejące drut_Z(), nie sztywny drut:
    main = tuple(h[i]+1.75*n0[i]-j[i]-1.75*n[i] for i in range(3))
    return beta, gamma, servo, norm(main)

for P, T in ((35, 25), (30, 20)):
    axes = ([(i/10, 0) for i in range(-10*P, 10*P+1)] +
            [(0, i/10) for i in range(-10*T, 10*T+1)])
    for axis in ('LP', 'GD'):
        print(P, T, axis, 'osie', max((stan(p,t,axis)[0],p,t)
                                    for p,t in axes))
        rows = [(stan(i/5,j/5,axis), i/5, j/5)
                for i in range(-5*P, 5*P+1)
                for j in range(-5*T, 5*T+1)]
        for k, label in enumerate(('beta', 'gamma', 'serwo')):
            print(label, max((s[k],p,t) for s,p,t in rows))
        print('dlugosc', min(s[3] for s,p,t in rows),
                         max(s[3] for s,p,t in rows))
```

Nie wykonano fizycznej próby drutu, wydruku ani ponownego przemiatania kompletnych siatek. Źródła poza wymienionymi wyżej: PRD §4/§7/§9, ustalenie 1 briefu koncepcji, §8 instrukcji montażu v3 oraz bieżące instrukcje repozytorium. Procesy uruchomione na potrzeby review zakończone; żaden nie pozostał w tle.

**Werdykt: NADMIAROWE — oczko (a) nie jest wykazane jako niezbędne, bo odpowiednio ukształtowany otwór i sztywne zakończenie „Z” mają geometryczną możliwość obsługi minimum PRD, a nawet celu; obecny zaczep oraz samo rozwiercenie go do Ø2,4 nie nadają się do wydruku testowego bez poprawki.**
