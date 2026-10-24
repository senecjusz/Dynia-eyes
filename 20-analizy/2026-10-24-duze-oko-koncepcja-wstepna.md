# Duże oko – wstępna koncepcja (krok 1)

24.10.2026, projektant. Wymagania: `30-projekt/PRD.md` v0.1. Rysunek: [2026-10-24-duze-oko-koncepcja-wstepna.svg](2026-10-24-duze-oko-koncepcja-wstepna.svg). Bez CAD, wymiary orientacyjne. Wersja 2 uwzględnia odpowiedzi użytkownika z 24.10 (punkt 7).

## 1. Układ (rysunek)

Oś z biegnie do przodu, środek gałki to z = 0. Moduł **wkładamy od środka dyni**: tuba Ø79 wchodzi w otwór Ø80, a kołnierz z 3 łapami opiera się o wewnętrzną ściankę. Z zewnątrz widać tylko maskownicę Ø84, czyli rant 2 mm. Głębokość modułu wynosi ok. 90 mm.

- **Gałka Ø60.** Kardan 5/5 ma środek krzyżaka w środku gałki. Gałka wystaje 6 mm przed maskownicę.
- **Powieki:** dwie kuliste czasze R 31,5–33, współśrodkowe z gałką. Wystają razem z nią, ok. 9 mm przed maskownicę. Obracają się na osi poziomej przez środek gałki, czyli na stałej osi kardana.
- **Serwa:** 3 × MG90S w jednym pasie z = −38…−61. Przy montażu od środka obrys Ø79 nie jest już limitem, ale układ i tak się w nim mieści.
- **Pręty:** 4 druty, każdy ok. 40–45 mm.

## 2. Jak to działa

- **Kardan 5/5.** Piasta przednia jest przykręcona w gałce, tylna na słupku uchwytu. Oś widełek tylnej piasty ustawiamy poziomo i ona jest osią góra–dół. Ta sama oś przechodzi przez obie śruby osi powiek, więc powieki zawsze są współśrodkowe z gałką. Oś lewo–prawo leży w krzyżaku i przechyla się razem z gałką.
- **Lewo–prawo:** serwo S1 ma wałek pionowy. Drut łączy orczyk (r 12) z żebrem w gałce na x = 22, z = −4. Ruch ±35° to ±12,6 mm drogi, czyli ok. ±63° serwa.
- **Góra–dół:** serwo S2 ma wałek poziomy. Drut łączy orczyk (r 10) z żebrem w gałce na y = 22. Ruch ±25° to ±9,3 mm, czyli ok. ±68° serwa.
- **Obie powieki na jednym serwie (wariant A).** Każda powieka ma po lewej stronie (x ≈ −36) ucho z dźwignią r 10: górna wystaje w górę, dolna w dół. Oba druty idą do **tego samego otworu orczyka S3**. Orczyk ciągnie do tyłu, więc obie dźwignie idą do tyłu. Górna dźwignia jest nad osią, więc górna powieka obraca się w górę. Dolna jest pod osią, więc dolna obraca się w dół. Pchnięcie do przodu zamyka obie naraz. Ruch jest symetryczny, a do tego wystarczą jeden orczyk i dwa druty, bez przekładni.

## 3. Części

**Drukowane** (pomarańczowe, gałka biała), wszystkie ≤ 180 mm:

| Część | Funkcja | Gabaryt ok. |
|---|---|---|
| Gałka | biała czasza Ø60 do z = −8. W środku słupek z czopem M5 pod piastę kardana i 2 żebra z otworem Ø1,2 na drut. Drukowana kopułą do góry, bez podpór | Ø60 × 38 |
| Powieka górna, Powieka dolna | kuliste czasze 75° z uszami na osi M3 i dźwignią r 10 | 70 × 45 × 25 |
| Pierścień | tuba Ø79 o długości równej grubości ścianki + 2 mm, kołnierz wewnętrzny z 3 łapami pod wkręty, uszy osi powiek, 3 ramiona do uchwytu. Długość tuby to jedna zmienna, ustawiana po zakupie dyni. *Spoza referencji: PRD wymaga mocowania w otworze.* | Ø120 × 60 |
| Maskownica | płaski pierścień Ø84 / Ø79 × 2, nasuwany z zewnątrz na wysunięty koniec tuby (wcisk). Zakrywa krawędź cięcia. *Spoza referencji: na życzenie użytkownika 24.10.* | Ø84 × 4 |
| Uchwyt serw | gniazda 3 × MG90S (M2 × 6 przez ucha serwa w otwór Ø1,7) i słupek w kształcie L pod tylną piastę kardana (słupek schodzi dołem, żeby ominąć orczyki) | Ø79 × 35 |

**Posiadane:**
- kardan 5/5 (1 szt.) i 3 × MG90S z orczykami;
- M2 × 6 × 6 (serwa);
- M5 × 16 + nakrętka × 2: czopy kardana, łeb wsunięty bokiem w gniazdo i kontrowany nakrętką;
- M3 × 16 + nakrętka × 2 (osie powiek) i M3 × 12 + nakrętka × 3 (pierścień–uchwyt);
- drut sprężynowy Ø1,0: 4 kawałki po ok. 55 mm przed gięciem;
- wkręty do drewna 4 × 30–40, 3 szt. (łapy).

**Kardan 5/5, a nie 2/2:** mieści się w gałce Ø60 (25,5 × Ø11), zgina się ponad 90° przy potrzebnych ±35° i jest sztywniejszy. Nie ma powodu brać mniejszego.

## 4. Końcówki prętów: drut Ø1,0 z zagięciem Z (jak w referencji, przyjęte 24.10)

Drut wyraźnie upraszcza konstrukcję:
- wchodzi wprost w otwory orczyka Ø1 bez rozwiercania;
- zagięcie Z w luźnym otworze samo przyjmuje przechylenie, więc nie są potrzebne przeguby ani śruby;
- odpada 8 połączeń śrubowych M3 i 4 drukowane pręty z oczkami.

Wyboczenie przy 45 mm (Euler, przeguby) wynosi ok. 48 N, a MG90S na r 12 daje ok. 18 N. W kroku 2 będą długości, kąty i rysunek 1:1 do gięcia.

## 5. Mocowanie w dyni (od środka)

1. Moduł skręcasz i kalibrujesz na stole.
2. Wkładasz go przez górny otwór dyni i wsuwasz tubę od środka w otwór Ø80 (luz ok. 0,5 mm na promieniu).
3. Przykręcasz 3 łapy kołnierza wkrętami do drewna w miąższ wewnętrznej ścianki. To one przenoszą masę modułu (ok. 130 g) i moment od środka ciężkości.
4. Z zewnątrz nasuwasz maskownicę na koniec tuby, który wystaje 2 mm ponad skórkę.

Ścianka dyni jest od środka wklęsła, więc płaski kołnierz dotyka jej głównie łapami, a wkręty dociągają je do miąższu. Wyjęcie modułu: zdjąć maskownicę i wykręcić 3 wkręty.

## 6. Założenia do akceptacji

1. **Tęczówka Ø24** (źrenicę w środku rysuje syn), opcjonalne wgłębienie zera Ø3.
2. **Powieki całkowicie otwarte** mają krawędź pod kątem 50° od poziomu (25° ruchu + 23,6° połowy tęczówki), czyli każda obraca się o 50°. Zamknięte stykają się w poziomie, z zakładką ok. 3°.
3. **Gałka wystaje 6 mm, a powieki ok. 9 mm przed maskownicę.**
4. **Ścianka dyni 30–50 mm.** Za nią potrzeba ok. 60 mm wolnego miejsca na moduł i kabel. Górny otwór dyni musi przepuścić kołnierz Ø120.
5. Sprzężenie osi (przy wychyleniu w obu osiach naraz pozycja gałki trochę odbiega od zadanej) kompensujemy w kalibracji programowej. PRD dopuszcza mniejszy zakres w narożnikach.

## 7. Odpowiedzi użytkownika (24.10) i otwarte pytania

- Moduł wkładamy **od środka**, z łapami przykręcanymi od środka i drukowaną maskownicą krawędzi otworu.
- Gałka może wystawać; kuliste powieki ją okrywają i wystają razem z nią.
- **Drut sprężynowy przyjęty**, bo upraszcza konstrukcję.
- Serwa mocujemy śrubami **M2 × 6** z warsztatu, bo w pudełkach nie ma wkrętów.
- **Otwarte:** czy są wkręty do drewna ok. 4 × 30–40?
