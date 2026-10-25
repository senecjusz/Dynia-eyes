# Review: druty gięte ręcznie, koncepcja v2 (krytyk Opus, runda 2)

24.10.2026, tylko odczyt. Oceniane: `20-analizy/2026-10-24-duze-oko-druty-v2.md` i `40-cad/druty/druty-v2-giecie-reczne.svg` wobec `40-cad/openscad/duze-oko-v2.scad` (parametry = `duze-oko-v2-parametry.json`).

Oznaczenia: **[P]** wynik skryptu z repo, **[O]** obliczenie z wymiarów SCAD, **[Z]** założenie.
Stałe: drut sprężynowy Ø1,0, E = 200 GPa → EI = 9800 N·mm², granica plastyczności ok. 1800 MPa [Z]; moment zablokowania MG90S ok. 176 N·mm [Z: 1,8 kg·cm].

## W skrócie

- Kierunek jest dobry: Z z długim środkiem, kąty dobrane do kierunku drutu, długość poprawiana na drucie, zero w kalibracji.
- **Jedna przeszkoda krytyczna:** Z ze środkiem 5 ± 2 mm nie mieści się przy dźwigni **górnej** powieki (za dźwignią jest gałka). Przy dolnej się mieści, jeśli korpus drutu pójdzie po zewnętrznej stronie.
- V jest sztywne i mocne (liczby niżej). W S1/S2 jest zbędne, bo ±2 mm przyjmuje kalibracja – można je usunąć i oszczędzić miejsce.
- Luz Z daje histerezę tylko tam, gdzie kąt ≠ 90° (S2: 105°).

## KRYTYCZNE

**K1. Z ze środkiem 5 ± 2 mm nie mieści się przy dźwigni górnej powieki.** [O]
- Miejsce: dźwignia górnej powieki, x −33,8…−32,3, otwór na promieniu ρ = 7 od osi powiek (y 6,3, z 3,0).
- Korpus drutu musi być po zewnętrznej stronie (od środka jest czasza i gałka), więc środek Z idzie do środka (+x), a ogon leży po wewnętrznej stronie dźwigni.
- Do środka na ρ = 7: czasza górnej powieki od x −31,94 (bez kieszeni zostaje 0,36 mm), gałka R 30 od x −29,17.
- Z kieszenią w czaszy (v1 K3) środek Z (między osiami zagięć, od osi korpusu x ≈ −34,3) może mieć najwyżej **≈ 3,6 mm** (do gałki −29,17, minus 0,5 luzu, minus 0,5 promienia drutu). Przy 5 ± 2 ogon wchodzi w gałkę już od 4,1 mm.
- Gałka obraca się wokół swojego środka, więc odległość od środka gałki do punktu ogona jest stała: √(x² + 7² + 3²). Dla x −29,3 (środek 5 mm) to 30,1 → ogon Ø1 przecina sferę R 30 i ociera się o gałkę w każdym położeniu.
- Dolna dźwignia (x −35,5…−34,0, strona −y): korpus na zewnątrz (x ≈ −36, promień od osi tuby √(36² + 7²) = 36,7, do tuby 37,9 → 0,7 mm), środek Z do środka do −31 przy 5 mm. Gałka zaczyna się od −29,2, a ramię dolnej powieki jest 1,7 mm obok kątowo. **Mieści się przy środku ≤ 5,8 mm.**
- Scenariusz porażki: użytkownik gnie Z 5–7 mm, ogon trze o gałkę albo nie daje się włożyć; skrócenie do ≤ 3,6 mm wraca do precyzji, której miało nie być.
- **Poprawka (technika, nie funkcja), do wyboru przez projektanta:**
  1. Dźwignia górna dłuższa (ρ 10–12), z otworem poza zasięgiem sfery gałki: na ρ 12 miejsce do gałki rośnie do 4,3 mm. Wymaga przeliczenia skoku i promienia orczyka S3, a czasza górnej (sektor do 73,5°) też tam jest – do policzenia.
  2. Zabezpieczenie bez ogona: noga L ≥ 3 mm do środka + 2–3 mm izolacji z przewodu nasunięte na nogę (praktyka RC, bez zakupów, jeśli są przewody [Z]). Potrzeba ok. 2,6 mm za dźwignią, czyli kieszeni w czaszy.
  3. Krótki Z tylko przy tej jednej dźwigni, ze środkiem 3 ± 0,5 mm, gięty na **wydrukowanej próbce dźwigni** (iteracyjnie: gnij, przyłóż, popraw). Najmniej zmian w modelu, ale to jedyne miejsce z precyzją ±0,5.
- Test: przemiatanie z ogonem Z jako odcinkiem drutu (dziś `kolizje-v2` wyłącza 4 mm przy dźwigni, więc tego nie widzi). Pewność: wysoka.

## WAŻNE

**W1. Tolerancja łańcucha (pyt. 1).** [P] [O]
- **S1, S2:** ±2 mm długości przesuwa zero orczyka o ±6,6° (S1) i ±9,0° (S2). Zakresy serw: S1 −50,8…+48,9°, S2 −60,0…+54,1° w najgorszym wariancie, 0 pozycji nieosiągalnych (`duze-oko-kinematyka.js` z a0 przesuniętym o ±2 mm). Mieści się w 600–2400 µs. **Wniosek: V w S1/S2 jest niepotrzebne.** Usunięcie V z S1 i S2 zdejmuje 2 z 4 problemów miejsca.
- Długość wyznacza jedno zaznaczenie markerem przy uchu (krok 3), więc błąd się nie sumuje: ±2 mm na drut, nie ±4. Warunek: zaznaczać przy otworze, z orczykiem założonym na serwo w zerze (inaczej położenie orczyka jest dowolne).
- **Powieki:** błąd każdego drutu ±2 mm → różnica PG–PD do **±4 mm** = ±34° powieki (8,4°/mm).
- Zakres jednego V (5 mm ramiona) od 45°: ściśnięcie do 60° −2,1 mm, do 70° −3,7 mm; rozgięcie do 30° +1,6 mm, do prostego +2,9 mm [O]. Jedno V przy procedurze z koncepcji (+1,6/−2,1) **nie pokrywa ±4 mm**. Pokrywa ją, gdy:
  - regulujesz oba V (PG i PD) – razem ok. ±5 mm, albo
  - gniesz PG i PD razem w parze (jednakowy kształt, v1 W4) – różnica ok. 0,3–0,5 mm [Z], V tylko do dokręcenia.
- Rozdzielczość V przy 45°: 0,123 mm na 1° kąta V → ok. 1° powieki na 1° V. Kombinerkami ±3° [Z] → ±3° powieki, przy zakładce zamknięcia 3°. Wystarcza, bo czasze są współśrodkowe (R 31,5–32,7 i 33,4–34,6): przejazd powieki o kilka stopni nie daje kontaktu.
- Kąt ±10°: przy uchu S2 wymagany zakres to 66,7…143,0° (środek 104,9°, ±38,1°) wobec ok. 45° klepsydry → przy błędzie +10° zostaje −3°, więc **kąt przy uchu S2 trzeba sprawdzić próbą w 4 narożnikach**, nie tylko „gałka na wprost” (W4).

**W2. Sztywność i wyboczenie V (pyt. 2).** [O]
- Podatność osiowa V (ramiona 5 mm, 45°, wysokość 3,54): δ = F · 2·a·h² / (3·EI) = **0,0042 mm/N**.
- Siły robocze < 2 N → 0,01 mm. Przy zablokowanym serwie: S1 10 N → 0,04 mm, S2 13 N → 0,06 mm, S3 23,5 N → 0,10 mm (≈ 0,8° powieki). Długość V pod obciążeniem praktycznie się nie zmienia.
- Uplastycznienie V przy F · h = 180 N·mm → **F ≈ 50 N**, ponad 2× siła zablokowanego S3. Bezpieczne.
- Wyboczenie drutu 45 mm: P_kr = π²EI/L² = 47,8 N. Przy 2 N to 4% P_kr, więc mimośród V (3,5 mm) nie powoduje wyboczenia.
- Uwaga: wielokrotne doginanie V w tym samym miejscu (> 3–4 razy o duże kąty) grozi pęknięciem drutu sprężynowego [Z]. Doginać małymi krokami.

**W3. Gdzie V ma miejsce (pyt. 2).** [O] (do potwierdzenia przemiataniem)
- **S1, S2: bez V** (W1).
- **PG, PD:** V w tylnej części drutu, między kołnierzem (z = −22) a orczykiem S3 (z = −44), ok. z −28…−38. Tam jest dostęp kombinerkami z boku po złożeniu; w tubie (z > −18) nie ma ani miejsca, ani dostępu. Wierzchołek V w stronę −x (od osi oka, w stronę ramki S3 nie dalej niż do x ≈ −40) – do sprawdzenia, bo w −x stoi serwo S3 (wałek x −41,4).
- Przednia część drutu (z > −18) ma dziś odstępy 0,57–0,9 mm: V 3,5–4,7 mm wysokości tam się nie zmieści.
- Drut PG–PD: odstęp 0,57 w `kolizje-v2` wynika z modelu obu drutów od środka jednego otworu. Z wchodzące z przeciwnych stron orczyka (PG korpus po +y, PD po −y, nogi wzdłuż y) rozsuwa korpusy przy orczyku o ok. 2 × (1 + 0,5 + 0,5) ≈ 4 mm [O]. **Drugi otwór w orczyku jest niepotrzebny**, a otwór na innym promieniu (5,5 zamiast 7,5) dałby powiekom różny skok (stosunek 0,73). Ogony Z przy orczyku S3 do tyłu (−z), żeby ogon PD nie leżał przy korpusie PG.

**W4. Luz Z (pyt. 3).** [O]
- Środek 5 ± 2 mm w blaszce 2 mm → luz osiowy 1–5 mm (nie stałe 3).
- Przesuw nogi zmienia długość drutu o luz · |cos β| (β = kąt nogi do korpusu): β 90° → 0; 95° → 0,26; 98° → 0,42; **105° → 0,78 mm** przy luzie 3 mm. Przy zmianie kierunku siły (pchanie/ciągnięcie) noga przeskakuje na drugi koniec luzu → histereza.
  - S2 (105° przy uchu i przy orczyku): ok. 1,6 mm → **ok. 4,5° histerezy φ** (ramię ucha 20 mm). Widoczne jako „spóźnienie” przy zmianie kierunku góra–dół.
  - S1 (90°/95°): ok. 0,26 mm → 0,7° θ, plus przesunięcie boczne ±1,5 mm przy uchu → ±1,9° przy φ = ±25° (v1).
  - Powieki (lewar ~90°, orczyk ~98°): ok. 0,42 mm → ±1,8° na powiekę.
- **Poprawka:** środek Z tak krótki, jak pozwala chwyt kombinerek: 4 ± 1 mm (luz 1–3) zamiast 5 ± 2. Dla S2 rozważyć zmianę modelu tak, żeby drut był ⟂ do osi otworu ucha (oś klepsydry obrócona o 15° w gałce – część drukowana, bez kosztu): wtedy Z przy uchu S2 ma 90° i histereza znika z tej strony. Przy orczyku 105° zostaje.
- Stuk: gałka na kardanie praktycznie wyważona, więc bez obciążenia stałego luz nie jest wybrany – spodziewany cichy stuk przy sakadach [Z].
- Próba „wolny koniec trafia w otwór” ustawia kąt przy orczyku dobrze (±1 mm na 42 mm = ±1,4°). Kąta przy uchu nie ustawia – ten trzeba sprawdzić ruchem gałki w 4 narożniki: przy zacięciu dogiąć w stronę narożnika, w którym się zacina.

**W5. Cel ≥ 2 mm (pyt. 4).** [O] [P]
- Luz Z przesuwa korpus w bok o ±(luz/2) przy β ≈ 90° (S1: wzdłuż y gałki przy uchu). Cel 2 mm powinien być liczony od drutu w skrajnym położeniu luzu, albo luz wliczony w cel: 2 mm = 1,5 luz + 0,5 tabela, a nie „2 mm na krzywy drut”.
- Drut S1–gałka (0,42 dziś): **korpus po +y nie wchodzi w grę** – przemiatanie [P] pokazuje, że przecina blaszkę ucha (−0,07 mm), bo orczyk S1 jest zawsze po −y. Korpus po −y [P]: najbliżej jest własna blaszka ucha pod otworem, 0,16–0,31 mm przy θ 35°, φ ±25° i ±2 mm długości; S2 z korpusem po +x: 0,52–1,03 mm (tabela w `2026-10-24-polaczenia-ciegien-opus.md`, „Kolizje”). Do 2 mm przy uchu nie dojdzie się – drut jest tam z definicji przy blaszce; cel 2 mm ma sens dopiero kilka mm od ucha. Realny cel przy uchu: ≥ 0,5 mm, sprawdzony na próbce ucha. Tabela 3.3 („przesunąć na +y, Opus W5”) jest do poprawienia – ta rekomendacja z v1 była błędna.
- Druty powiek – własna powieka / S3 / Pierścień: kieszeń w czaszy (K1) pomaga tylko przy górnej dźwigni. Przy orczyku S3 rozsunięcie daje samo Z (W3). Przy Pierścieniu (1,9 dziś) korpus PD po zewnątrz dolnej dźwigni ma ok. 0,7 mm (K1) – **2 mm tam nie będzie** bez zmiany x-stosu (tuba Ø79 jest twardym limitem).
- Tabela 3.3 nie ma wierszy dla ogonów Z i wierzchołków V – to nowe elementy, które dziś nie są w przemiataniu. Muszą wejść do `duze-oko-kolizje.js` jako odcinki drutu.

**W6. Kolejność montażu i wkładanie Z (pyt. 6).** [O]
- Z z obu końców wkłada się przez otwór, obracając drut albo część. Gdy jeden koniec jest już w orczyku, obraca się **orczyk zdjęty z serwa** razem z drutem. To trzeba napisać.
- Zaznaczenie drugiego Z (krok 3) wymaga orczyka nałożonego na serwo w zerze i gałki na wprost; potem orczyk zdjąć, drut wyjąć, zgiąć Z, włożyć w ucho, orczyk z powrotem. Na rysunku tego nie ma.
- Ucho jest w gałce 4 mm przed rantem. Po założeniu Pierścienia dostęp jest tylko od tyłu przez tubę. Wkładanie Z w ucho przed założeniem gałki na uchwyt (jak w `duze-oko-v2-montaz.md` p. 4), zaznaczanie długości dopiero po złożeniu → koniec przy orczyku gięty jako drugi, nie pierwszy.

## DROBNE

- **D1. Rysunek (pyt. 6).**
  - Koncepcja mówi „rysunek pokazuje to w dwóch rzutach”; rysunek ma jeden schematyczny widok z drutem płaskim. Skręt 90° (S1, powieki) jest tylko w zdaniu. Potrzebne rzuty z góry i z boku dla S1 i S2 osobno.
  - Brak per drut: długości (S1 41,9, S2 42,9, PG/PD 44,6 między otworami), długości cięcia (65/66/68), strony wkładania (S1 korpus +y, S2 korpus +x, PD korpus na zewnątrz dolnej dźwigni), kierunku ogona.
  - „Kąt zagięcia przy korpusie ~105°” jest niejednoznaczny (wewnętrzny 105° czy 75°). Narysować kąt łukiem na rysunku.
  - Brak kątów dla powiek („do policzenia”): z modelu ok. 90° przy dźwigni (odchylenie 1–2°) i ok. 98° przy orczyku (odchylenie 8–9°) [P].
  - Panel 1 pokazuje V w S1/S2 – po W1 zbędne. Panel 3: „wychodzi ok. 4 mm w bok – miejsce będzie w modelu” – podać kierunek.
  - Krok 2 rysunku („zrób V w środku”) po zaznaczeniu długości: V skraca drut o 2,9 mm. Kolejność ma być: V najpierw (45°), potem zaznaczenie drugiego Z.
- **D2.** Ilość drutu: 4 × L + 23 ≈ 27 cm + próby. PRD wymienia drut Ø1,0 jako posiadany bez ilości – fakt do potwierdzenia u użytkownika przed drukiem.
- **D3.** Ucho gałki `uchoDol` ≥ 2,6 jest w 3.3 – dobrze. Dodać: rozwiercenie talii po druku do Ø1,7 (dziś w instrukcji montażu, nie w koncepcji).
- **D4.** Ścianka oczka dźwigni (Ø4, otwór Ø1,4) 1,3 mm < 1,5 (W2 użytkownika): `rDzwKoniec` 2 → 2,2.

## Decyzje dla użytkownika

Brak nowych. Użytkownik wykluczył wariant B i P-C (24.10). K1 rozwiązuje się techniką (do wyboru przez projektanta i orkiestratora). Jedyny fakt od użytkownika: czy jest ok. 30 cm drutu Ø1,0 (D2) i czy w warsztacie są przewody z izolacją (opcja 2 w K1).

## Werdykt

Koncepcja v2 nadaje się do przeprojektowania modelu po dwóch poprawkach: rozwiązać mocowanie drutu przy dźwigni górnej powieki (K1: Z 5 ± 2 mm tam nie mieści się, bo za dźwignią jest gałka) oraz usunąć V z S1/S2 i dać powiekom regulację obu V albo gięcie w parze (W1, W3); reszta to doprecyzowanie rysunku i przemiatanie z ogonami Z i V.
