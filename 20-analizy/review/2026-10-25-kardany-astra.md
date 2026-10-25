**Review Astry — v8, runda 1/2**  
Treść raportu `20-analizy/review/2026-10-25-kardany-astra.md`, bez zapisu do repo.

Kinematyka dla `rUcha=17`, `zUcho=0` pozwala osiągnąć ±35°/±25° bez zbliżania się do martwego punktu. Maksymalne zgięcia kardanów wynoszą **50,16° dla S1 i 42,51° dla S2**, czyli mieszczą się w potwierdzonym zakresie około 90°.

Znalazłem dwie uwagi **PSUJE**: zerowy odstęp orczyka S1 od wieży S2 oraz niezgodność zwykłego zagięcia L 90° z geometrią połączenia S2 przez otwór Ø2,2. Kostki wymagają podpór — ich dolne powierzchnie mają nawisy do 77,9° od pionu.

Półksiężyc został zamknięty geometrycznie, ale skrócona gałka pokazuje krawędź przy wychyleniu. Przy końcowym sprawdzeniu `kolizje-powieki-v8.txt` nadal nie istniał, a plik tymczasowy `v8/p.txt` miał 0 bajtów, więc nie przypisuję temu przemiatan iu pozytywnego wyniku.

**1. PSUJE — orczyk S1 dotyka wieży S2**

- **Miejsce:** geometria orczyka S1 i wieży S2 przy `przesS2=4`.
- **Dowód:** dla αS1=0° punkt `[18; 1,5; −44]` leży jednocześnie na powierzchni orczyka i wieży S2. Odległość punkt–siatka obu brył wynosi **0 mm**.
- **Położenie oka:** θ≈**−6,18°**, φ=0°. Problem występuje wewnątrz wymaganego zakresu, także poza narożnikami.
- **Skutek:** model nie zapewnia luzu ruchowego; odchyłka rzeczywistego serwa albo orczyka może powodować ocieranie.
- **Poprawka:** zwiększyć odstęp tej pary do ≥0,5 mm i powtórzyć sprawdzenie. W obecnej geometrii zastępczej wymaga to co najmniej dodatkowych **0,5 mm przesunięcia S2**; po zmianie trzeba ponownie policzyć kinematykę i pozostałe kolizje.
- **Pewność:** wysoka dla modelu zastępczego. Promień wieży **6 mm jest założeniem modelu**, nie moim pomiarem rzeczywistego MG90S.

Ta para nie jest sprawdzana w `duze-oko-kardany-kolizje.js`. Zwykłe próbkowanie powierzchni pokazało około 0,109 mm; sprawdzenie konkretnego punktu wykazało rzeczywisty styk.

**2. PSUJE — zagięcie L 90° S2 nie mieści się swobodnie w Ø2,2**

W obecnej geometrii kierunek pręta S2 jest odchylony od płaszczyzny orczyka o **13,57°**, niezależnie od położenia oka. Przy zagięciu dokładnie 90° nóżka przechodząca przez orczyk musi więc być pochylona względem osi otworu o co najmniej tyle samo.

Dla drutu Ø2 i grubości orczyka 2 mm wymagana średnica otworu wynosi:

`D ≥ 2/cos(13,57°) + 2·tan(13,57°) ≈ 2,54 mm`

Otwór Ø2,2 pozwala w tych warunkach na około **5,45°** pochylenia.

- **Skutek:** zagięcie 90° wymusza odkształcenie pręta, orczyka albo zmianę geometrii połączenia; samo przemiatanie odcinka o stałej długości tego nie sprawdza.
- **Poprawka:** określić zagięcie S2 jako **76,43° albo 103,57°**, zależnie od strony nóżki, zamiast 90°. Następnie sprawdzić cały ruch z rzeczywistym kardanem i jego ustawieniem obrotowym.
- **Pewność:** wysoka przy wymiarach Ø2/Ø2,2 i grubości 2 mm.

Dla S1 odchylenie pręta od płaszczyzny orczyka wynosi **1,25–5,10°**. Przy 5,10° potrzebna średnica to około **2,186 mm**, więc Ø2,2 zostawia tylko **0,014 mm zapasu średnicowego** w idealnym ustawieniu.

**3. Kinematyka — niezależne obliczenie**

Rozwiązałem równanie stałej odległości środek kardana–otwór orczyka na siatce co **0,25°**, dla θ±35° i φ±25°.

| Wielkość | S1 | S2 |
|---|---:|---:|
| Odległość środek kardana–otwór orczyka w zerze | 45,853 mm | 46,889 mm |
| Kąt orczyka α | −39,76…27,97° | −40,13…25,47° |
| Ruch względem α₀=−6° | −33,76…33,97° | −34,13…31,47° |
| Maksymalne zgięcie kardana | **50,16°** | **42,51°** |
| Najmniejszy zapas do martwego punktu¹ | **53,25°** | **45,15°** |
| Nieosiągalne pozycje w obliczeniu | 0 | 0 |

¹ Liczony jako `asin(|u·t|)`, gdzie `u` oznacza kierunek pręta, a `t` jednostkową styczną ruchu otworu orczyka; wartość 0° oznacza martwy punkt.

Zmniejszenie `rUcha` z 20 do 17, przy pozostawieniu `zUcho=0` i `przesS2=4`, zmniejsza potrzebny skok:

| `rUcha` | S1 α | S2 α |
|---|---:|---:|
| 20 mm | −46,63…35,30° | −47,86…31,42° |
| 17 mm | −39,76…27,97° | −40,13…25,47° |

Przy `rUcha=17`, ale `zUcho=−4`, maksymalne zgięcia wynoszą **53,95°/46,76°**. Przeniesienie zaczepów na `zUcho=0` pomaga i usuwa zależność położenia zaczepu S2 od θ w przyjętej kolejności obrotów.

Podane długości są odległościami między punktami kinematycznymi, **nie długościami drutów do odcięcia**.

**4. Kolizje i luzy poniżej 0,5 mm**

| Para | Wynik | Ocena |
|---|---:|---|
| Piasta 1 S1/S2–gałka | 0,49 mm | **BRZEGOWA** — elementy związane z gałką; szczelina nie zamyka się wskutek jej obrotu |
| Piasta 2 S1–gałka | 0,98 mm | Brak uwagi; niezależne zagęszczenie co 0,5°, minimum przy θ35°, φ21,5° |
| Piasta 2 S2–gałka | 1,53 mm | Brak uwagi |
| Pręt S1–serwo S2 | 1,66 mm | Brak uwagi w dostarczonym przemiatan iu |
| Piasta 2 S1–uchwyt | 1,75 mm | Brak uwagi w dostarczonym przemiatan iu |
| Orczyk S1–wieża S2 | **0 mm** | **PSUJE**, opisane wyżej |

Wyniki kardanów dotyczą walców zastępujących piasty i prostych prętów. Nie obejmują wkrętów M3, kolanek L ani pełnej geometrii widełek; powieki sprawdzono tam tylko w trzech położeniach.

**BRZEGOWA — ograniczona dokładność dowodu:** krok 5° i próbkowanie powierzchni nie dowodzą dokładnego minimum pomiędzy próbkami. Nie znalazłem przenikania piast z gałką w dodatkowo zagęszczonym obszarze.

**5. Druk, kostki i montaż**

**PSUJE przy druku bez podpór — żebra nie mają dolnych powierzchni pod 45°.** W STL v8 zmierzyłem pod kostkami:

| Kostka | Maksymalny nawis od pionu |
|---|---:|
| S1 | **77,87°** |
| S2 | **74,00°** |

Gałka drukowana rantem na stole wymaga lokalnych podpór pod tymi powierzchniami. Nie jest konieczna zmiana sposobu mocowania kardana, ale podpory muszą być uwzględnione w przygotowaniu wydruku.

**BRZEGOWA — rzeczywista długość klejenia jest mniejsza niż 8 mm.** Wybranie na piastę 1 jest kapsułą Ø10 z zaokrąglonym końcem. Usuwa około **4,5 mm** początku nominalnego odcinka otworu 8 mm, pozostawiając około **3,5–3,6 mm cylindrycznej ścianki** oraz zaokrąglone dno; bez próby nie przesądzam o niewystarczającej nośności.

**BRZEGOWA — próbka nie odwzorowuje tego osadzenia.** `ProbkaDrutu` ma rzeczywiście Ø2,2/Ø2,3, ale otwory są przelotowe. Sprawdza średnicę, a nie ślepe dno, skrócone klejenie ani podparcie żebra.

Dostępu kluczem do M3 w kompletnym module **nie potwierdzam**: brakuje położeń wkrętów i ich kierunków. Montaż należy wykonać na stole, zaciskając piasty przy otwartym tyle gałki przed założeniem elementów utrudniających dostęp; sam brak takiej kontroli klasyfikuję jako **BRZEGOWĄ**, bez twierdzenia, że klucz się nie zmieści.

Przy rozwierceniu jednego otworu orczyka do Ø2,2, obok fabrycznego Ø1 w rozstawie 2 mm pozostaje **0,40 mm mostka**. To **BRZEGOWA** uwaga wykonawcza; rozwiercenie obu sąsiednich otworów do Ø2,2 połączyłoby je ze sobą.

**6. Luz kardana i wygląd**

**BRZEGOWA — luz:** przyjąłem zastępczo **±0,10 mm błędu długości każdego cięgna**, łącznie od połączeń danego cięgna. Z odwrotnej macierzy kinematyki wychodzi maksymalnie około **±0,75° lewo–prawo i ±0,39° góra–dół**, także przy jednoczesnym niekorzystnym luzie obu cięgien; luz rzeczywistych kardanów nie został zmierzony.

**BRZEGOWA — widoczna krawędź:** przy θ35°, φ0° granica skróconej czaszy wypada w rzucie około **26,65 mm od osi**, wobec promienia gałki 30 mm. Powstaje boczny ubytek białego obrysu około **3,35 mm**; promienie przez STL dla x=−27…−29 mm, y=0 nie trafiają już w gałkę.

Dla metalowych piast i prętów nie znalazłem odsłoniętych próbek przy patrzeniu dokładnie od przodu, na siatce ruchu co 1°. **Półksiężyc zniknął geometrycznie:** wybranie M5 jest ograniczone do R29,2 przy zewnętrznym R30, co pozostawia nominalnie **0,8 mm skorupy**.

**7. Rzeczy do wykonania ręcznie**

- Wydrukować próbkę Ø2,2/Ø2,3 i sprawdzić rzeczywisty drut Ø2.
- Przygotować gałkę z podporami pod kostkami i żebrami.
- Dopasować kołki do rzeczywistej głębokości piast; sprawdzić osadzenie na sucho, następnie wkleić.
- Rozwiercić wyłącznie wybrane otwory orczyków, usunąć zadziory.
- Wykonać końce prętów z uwzględnieniem kąta S2; nie przyjmować automatycznie 90° dla obu.
- Ustawić długości przesuwem w piastach przy oku na wprost i α₀=−6°; dokręcić M3 przy dostępnym tyle gałki.
- Przed zasileniem przeprowadzić cały ruch ręką, szczególnie przejście orczyka S1 przez α=0°.
- Po poprawieniu styku skalibrować środki i krańce w ESP32, a następnie sprawdzić niezależny ruch obu powiek.

Praca była tylko do odczytu; nie zmieniałem plików, nie wykonywałem `git pull` i nie czytałem raportu Opusa.

**Werdykt: v8 nie jest gotowa do wydruku testowego kompletnego mechanizmu, dopóki nie zostanie usunięty styk orczyka S1 z wieżą S2 i rozstrzygnięta geometria zagięcia S2; kostki wymagają podpór.**