# Review: połączenia cięgien dużego oka (krytyk Opus)

24.10.2026, tylko odczyt. Oceniane: `20-analizy/2026-10-24-duze-oko-polaczenia-ciegien.md` i `40-cad/druty/polaczenia-ciegien-hobby.svg` wobec `40-cad/openscad/duze-oko-v2.scad` (stan roboczy, parametry identyczne z `duze-oko-v2-parametry.json`).

Oznaczenia: **[P]** pomiar na siatkach / wynik skryptu, **[O]** obliczenie z wymiarów SCAD, **[Z]** założenie.
Skrypty pomocnicze (scratchpad, poza repo): kąt L przy uchu, odstęp drutu od rantu gałki, warianty długości ±2 mm w `duze-oko-kinematyka.js` i `duze-oko-kolizje.js` (siatki wyeksportowane z bieżącego SCAD, krok 10°).

## Najważniejsze w trzech zdaniach

1. S1/S2 z drutem i zerem w kalibracji to dobry kierunek: ±2 mm długości mieści się w zakresie serwa.
2. Ale „L 90°” nie zadziała dla S2 (potrzeba ~105° przy uchu i przy orczyku), a P-A dla powiek nie mieści się w modelu.
3. Najprostsze, co spełnia W1–W4: **Z z długim środkiem (≥ 5 mm) gięte na stole**, zamiast L z zabezpieczeniem doginanym na miejscu; powieki: dwa jednakowe druty gięte **razem w parze** albo zatwierdzony już wariant B.

## KRYTYCZNE

**K1. S2: L 90° przy uchu gałki zakleszcza się przy θ = ±35°.** [P]
- Kąt wewnętrzny między nogą a korpusem (do serwa) potrzebny w całym zakresie: S2 **66,7…143,0°** (noga w −x, korpus po stronie +x, tak jak przychodzi od orczyka x = 11). Środek 104,9°, połowa zakresu ±38,1°.
- Przy L = 90° klepsydra musi dać przechył **53°** (θ = +35°, φ = −5°). Klepsydra 45° daje ok. 45° przy talii Ø1,7 (po rozwierceniu), ok. 42° przy talii z druku [O].
- S1: 51,6…117,5° (noga −y) albo 62,5…128,4° (noga +y), środek 85/95°, połowa ±32,9°. L 90° daje 38,4° – mieści się, przy ±10° gięcia 43–48° – na granicy.
- Rysunek D i tekst „L 90° ±10°” są dla S2 błędne. Stare przyrządy miały 75,1° (= 180 − 104,9) właśnie z tego powodu.
- **Poprawka:** S2 przy uchu kąt wewnętrzny 105° (rozwarty), S1 90°. Po włożeniu test ręką: gałka w 4 narożniki; gdzie się zacina, dogiąć kąt w tę stronę. Pewność: wysoka.

**K2. Powieki P-A: łączniki 3 mm nie mieszczą się w modelu.** [O]
- Dźwignie górnej i dolnej powieki stoją w x = −33,05 i −34,75: **1,7 mm** między osiami płaszczyzn.
- Oba łączniki zbiegają się w jednym otworze orczyka S3; przy szerokości 4 mm nakładają się w rzucie przez ostatnie **~14 mm** przed orczykiem, więc muszą leżeć jeden nad drugim: potrzeba ≥ 3,2 mm odstępu w x, jest 1,7.
- Łącznik na zewnątrz dolnej dźwigni: x −35,5…−38,5, promień od osi tuby √(38,5² + 7²) = **39,1 > 37,9** (wnętrze tuby) → kolizja z Pierścieniem.
- Łącznik od wewnątrz górnej dźwigni: wchodzi w czaszę własnej powieki (niżej K3) i w gałkę.
- Dziś druty mają odstępy: drut–drut 0,57, drut–własna powieka 0,69–0,73, druty–Pierścień 1,90 (`kolizje-v2.txt`). Łącznik 3 mm zamiast drutu Ø1 zjada +1 mm na stronę – wszystkie przechodzą na kolizję.
- **Poprawka:** odrzucić P-A w tej geometrii. Zamiast niej W4. Pewność: wysoka.

**K3. Przy dźwigniach powiek nie ma miejsca na zabezpieczenie doginane „gdziekolwiek ≥ 5 mm”.** [O]
- Górna dźwignia (x −33,8…−32,3): czasza górnej powieki (R 31,5–32,7, sektor −1,5…73,5°) na promieniu 7 od osi zaczyna się w x = −31,94. Za dźwignią jest **0,36 mm**. Noga nie może wystawać do środka.
- Dolna dźwignia (x −35,5…−34,0), noga na zewnątrz: zagięcie (≥ 1,5 mm za płytką) sięga x ≈ −37, promień √(37² + 7²) = 37,66 wobec 37,9 wnętrza tuby → **0,24 mm**, poniżej 0,5.
- Dolna dźwignia od środka: wolne ok. 4 mm do gałki, ale ramię dolnej powieki (sektor do 50°) jest 1,7 mm obok otworu (otwór w 64°).
- Stary Z (ogon 2 mm równoległy do korpusu) mieścił się tylko dlatego, że ogon od razu wychodzi z sektora czaszy; `kolizje-v2` wyłącza 4 mm drutu przy dźwigni, więc tego nie sprawdza.
- **Poprawka (zmiana modelu, nie funkcji):** w górnej powiece kieszeń w czaszy za otworem dźwigni (ok. 6 × 6 mm, x od −32,3 do ok. −28, kąty 55–75°); dolny drut korpusem na zewnątrz, nogą do środka (odwrotnie niż w `duze-oko-v2-montaz.md` p. 2). Kierunek ogona podać na rysunku, nie „gdziekolwiek”. Sprawdzić przemiataniem bez wyłączania 4 mm. Pewność: wysoka co do braku miejsca, średnia co do kieszeni.

**K4. Ucho gałki: pod klepsydrą zostaje 0,35 mm materiału.** [O] (dotyczy każdej wersji, także obecnej)
- Środek otworu 1,2 mm nad dolną krawędzią blaszki (`uchoDol` = 1,2, krawędź z = −5,2). Talia Ø1,7 → **0,35 mm** pod talią, a stożki 45° (promień na ściance 1,7 mm) przecinają dolną krawędź na obu ściankach.
- 0,35 mm to mniej niż jedna ścieżka (0,42), więc praktycznie otwór jest otwarty od dołu.
- Siła z drutu działa wzdłuż korpusu, czyli w −z, prosto w tę krawędź (drut S1 idzie z z = −4 do z = −46). Przy ciągnięciu drut wyrwie się z ucha. Doginanie zabezpieczenia na miejscu (L + keeper) opiera ok. 150–300 N o tę krawędź [O: moment uplastycznienia drutu 1 mm ≈ 180–300 N·mm na ramieniu 1–2 mm].
- **Poprawka:** `uchoDol` ≥ 2,6 (1,7 promienia stożka na ściance + 0,9 = 2 ścieżki), dolna krawędź z ≈ −6,6, nadal nad rantem −8. Sprawdzić na `ProbkaDrutu` przed gałką. Pewność: wysoka.

## WAŻNE

**W1. Przy orczyku też nie 90°, a tolerancja ±10° przekracza luz otworu.** [P] [O]
- Odchylenie drutu od płaszczyzny orczyka: S1 −10…−1° (środek −5,5), S2 **−18…−12°** (środek −15). Koncepcja pisze „tylko 6–9°” – to jest zakres zmiany, nie odchylenie.
- Otwór Ø1,4 w orczyku 2 mm pozwala na przechył ok. atan(0,4/2) = 11° całkowicie.
- L 90° przy S2: 12–18° wobec 11° → drut się wygina. Przy błędzie gięcia 10° koniec drutu odjeżdża o 42 × sin 10° ≈ 7 mm od ucha; sprężyście to ok. 2,8 N bocznie i 1200 MPa w drucie [O: EI = 9800 N·mm², belka utwierdzona–przegubowa]. Drut wytrzyma, otwór w orczyku będzie się owalizował.
- **Poprawka:** kąt wewnętrzny przy orczyku S1 ~95°, S2 ~105°. Test w warsztacie (zamiast mierzenia kąta): drut włożony w orczyk, **wolny koniec ma trafić w otwór ucha bez naciągania (±1 mm)** przy gałce na wprost; jeśli nie, dogiąć przy narożu.

**W2. S1, S2: kształt przestrzenny, nie płaski – rysunek tego nie mówi.** [O]
- S1: noga przy uchu ∥ y, noga przy orczyku ∥ x → nogi **prostopadłe**, drut skręcony o ~90° wokół korpusu.
- S2: obie nogi ∥ x, w przeciwnych kierunkach → płaski kształt „Z” z kątami ~105°/105°.
- Powieki: noga przy dźwigni ∥ x, przy orczyku S3 ∥ y → też prostopadłe.
- Użytkownik z rysunku D zrobi płaskie L–L. Drut S1 zgięty płasko trzeba by skręcić o 90° – nie wejdzie bez naprężenia.
- **Poprawka:** na rysunku dla każdego drutu: widok w dwóch rzutach, kąty wewnętrzne, „nogi do siebie prostopadłe / równoległe”, strona wejścia.

**W3. Doginanie zabezpieczenia na miejscu – zastąpić Z z długim środkiem.** [O]
- Problem starego Z był w tym, że środek musiał mieć 2–2,5 mm (= grubość blaszki + 0,5), bo za otworem nie było miejsca.
- Za uchem gałki (wnętrze gałki, ok. 19 mm do skorupy w kierunku y) i pod orczykiem S1/S2 (12,2 mm do korpusu serwa w modelu) miejsca jest dużo. Z o **środku 5 ± 2 mm i ogonie ≥ 5 mm** wkłada się klasycznie, przekręcając drut przez otwór.
- Zalety: wszystkie zagięcia na stole kombinerkami, zero siły na wydrukowanym uchu (K4), brak narzędzi w gałce.
- Koszt: luz osiowy nogi = środek − grubość (ok. 3 mm). Przy uchu daje to przy φ = ±25° ok. ±1,3 mm w z → ok. ±1,9° błędu θ [O]. Akceptowalne; jeśli nie, wkładka z izolacji kabla na nogę (niżej).
- Alternatywa bez gięcia za otworem: 3–4 mm izolacji z dowolnego przewodu 0,5 mm² (śr. wewn. ~0,9 mm [Z]) nasunięte na nogę jako zabezpieczenie (praktyka RC). Brak zakupów, jeśli są przewody w warsztacie.
- Dla dźwigni powiek Z z długim środkiem wymaga kieszeni z K3.

**W4. Powieki: prostsze niż P-A – dwa jednakowe druty gięte razem.** [O]
- PG i PD są tym samym kształtem (`duze-oko-v2-montaz.md`: dolny = górny obrócony o 180° wokół osi gałki). Dwa proste odcinki trzymane razem w szczękach, osią zagięcia przez oba, gięte jednocześnie, dają tę samą długość z dokładnością ok. 0,3 mm [Z] → ok. 2,5° różnicy powiek.
- Zakładka zamkniętych powiek ma 3°; czasze są współśrodkowe (R 31,5–32,7 i 33,4–34,6), więc przejazd jednej powieki o kilka stopni nie daje kontaktu. Kalibrację S3 ustawić tak, by domknęła się ta, która się spóźnia.
- Korekta po złożeniu: lekkie ściśnięcie V w dłuższym drucie (V o ramionach 4 mm i głębokości 3 mm skraca o 2 mm) – tylko tam, gdzie jest miejsce; obecne odstępy drutów powiek to 0,57–0,9 mm, więc V raczej poza ostatnimi 15 mm przy orczyku. Do sprawdzenia w CAD.
- Rachunek **8,4°/mm jest poprawny** [P]: dźwignia r 7 → 1/7 rad = 8,2° przy drucie ⟂ dźwigni; skrypt daje 8,4° w środku skoku, na krańcach skoku (±25,75°) ok. 9,1°/mm [O].

**W5. Odstęp drutu S1 od rantu gałki maleje, gdy korpus odsunie się zagięciem.** [P] [O]
- Korpus L/Z startuje nie ze środka otworu, tylko ~2 mm obok (pół blaszki + promień gięcia + pół drutu).
- Model uproszczony (sama skorupa, bez uszu) [O]: S1 przy korpusie po stronie −y spada o ok. 0,3 mm, po stronie +y rośnie o 0,2 mm. Na siatkach dziś 0,42 mm (`kolizje-v2.txt`), czyli korpus po −y dałby ok. 0,1 mm.
- **Korekta po przemiataniu [P]:** korpus S1 po stronie +y **przecina blaszkę ucha** (−0,07 mm przy uchu, punkt gałki (21,9; −0,1; −5,1)). Orczyk S1 jest zawsze po stronie −y (y otworu −1,1…−5,5 w całym zakresie), więc korpus z +y musi przejść przez płaszczyznę blaszki pod otworem. S1 może mieć korpus tylko po −y; wtedy najbliżej jest własna blaszka ucha pod otworem, 0,16–0,31 mm (rant gałki nie jest już minimum).
- **Poprawka:** S1 korpus po −y; S2 korpus po +x (noga w −x, zgodnie z K1). Przy S1 sprawdzić na próbce ucha, czy korpus nie trze o blaszkę przy θ 35°, φ ±25°; jeśli trze, skrócić blaszkę pod otworem po stronie −y (fazka) – nie dotyczy to dolnego materiału z K4, tylko ściany bocznej. Wynik: sekcja „Kolizje”.

**W6. Luz w powiekach przy P-A i przy otworze Ø2,4 orczyka S3.** [O]
- Otwór orczyka S3 Ø2,4 jest na dwa druty. Z jednym sworzniem P-A luz 1,4 mm; razem z oczkami Ø1,4 (0,4 na każdym) łańcuch ok. 2,6 mm → ±11° chybotania powieki.
- Druty w parze w Ø2,4 opierają się o siebie: luz ok. 0,4 + 0,4 (dźwignia) → ±3,4°.
- Oczko dźwigni: piasta Ø4 z otworem Ø1,4 → ścianka 1,3 mm < 1,5 (W2). Drobna zmiana `rDzwKoniec` 2 → 2,2.

**W7. Krok montażu 3 („koniec zagiąć za uchem”) w gałce.** [O]
- Dostęp jest (ucho 4 mm przed rantem, otwór tylny r ≈ 26,8), ale jedną parą kombinerek dźwignią jest blaszka (K4). Trzeba dwóch kombinerek: jedne trzymają nogę przy blaszce, drugie gną. To przy W3 odpada.

## DROBNE

- **D1.** Długość ±2 mm: przy dwóch zagięciach mierzonych osobno od końca błędy się sumują (do ±4). Drugie zagięcie mierzyć **od pierwszego naroża**, nie od końca drutu.
- **D2.** Sprężynowanie drutu sprężynowego 5–10° – przy kątach 105° gnij do ok. 110–115° i sprawdź testem z W1.
- **D3.** Zużycie: PLA na drucie Ø1 przy obciążeniu < 2 N i kilku godzinach pracy dziennie – pomijalne w sezonie [Z]. Większe ryzyko to owalizacja fabrycznego orczyka przy naprężeniu z W1.
- **D4.** Rysunek C: „oczka Ø5 (w modelu ~Ø6)” – w modelu nie ma łącznika; sprzeczne. Rysunek A: „±45°” sugeruje zapas, którego dla S2 nie ma. Rysunek B: „odchyla się tylko o 6–9°” (zob. W1). Rysunek D odwołuje się do „rysunku 1:1”, którego dla nowych drutów nie ma (`duze-oko-v2-druty-1do1.svg` jest dla Z). Skala SVG „~6 px/mm” – nie 1:1.
- **D5.** Otwory orczyków: `duze-oko-v2-montaz.md` każe rozwiercić do Ø1,4, koncepcja zakłada „Ø1,3–1,5 do zmierzenia” – ujednolicić (Ø1,4 i wiertło lub drut jako rozwiertak, jeśli nie ma Ø1,4).

## Pytanie 5: zgięty już drut

- Po odcięciu obu Z zostaje prosty odcinek ok. L − 3 mm: S1 ≈ 39, S2 ≈ 40, PG/PD ≈ 41,5 mm [O: Rgiecia 2,1 na naroże].
- Potrzeba (W3, Z z długim środkiem 5 i ogonem 5 na obu końcach): **L + 20 mm**: S1 62, S2 63, PG/PD po 65 mm. Z L + zabezpieczeniem z izolacji: L + ~10 mm (≥ 52 mm).
- Zachowanie jednego starego Z przy orczyku (pasuje do orczyka 2 mm) i nowe zagięcie przy uchu: od naroża starego Z zostaje ok. 41 mm, potrzeba L + 10 = 52 → **brakuje ok. 11 mm**.
- **Wniosek:** stare druty nie nadają się na S1, S2, PG, PD. Nadają się na próby gięcia i na sworznie. Nowego drutu Ø1,0 potrzeba ok. **26 cm** (4 druty + zapas). PRD wymienia drut Ø1,0 jako posiadany, ilość nieznana – fakt do potwierdzenia u użytkownika.

## Pytanie 6: porównanie

| Opcja | Mieści się | Precyzja wykonania | Ocena |
|---|---|---|---|
| S1/S2: Z z długim środkiem + kalibracja | tak (sprawdzić W5) | ±2 mm, kąt dogięty testem W1 | **najlepsza** |
| S1/S2: L + zabezpieczenie na miejscu | tak | ±2 mm, ale siła na ucho (K4), dwie pary kombinerek | gorsza od Z |
| S1/S2: przeguby kulowe drukowane | ±40° wymaga kulki ≥ Ø6 w gnieździe z zatrzaskiem – W2 | — | odpada |
| S1/S2: pręty drukowane z oczkami M3 | przegub tylko w jednej płaszczyźnie; przy uchu potrzeba ±33–38° w dwóch | — | odpada |
| Powieki P-A | **nie** (K2) | ±0,2 mm | odpada |
| Powieki: dwa druty gięte w parze (W4) | tak, jak dziś + kieszeń z K3 | ~0,3 mm → ~2,5° | **najlepsza w wariancie A** |
| Powieki P-B: rząd otworów co 1 mm na r 7 | nie (ścianki < 1,5) | — | odpada |
| Powieki wariant B (dolna nieruchoma) | tak, prościej | jedna powieka → kalibracja kasuje błąd | prostsza; PRD: zatwierdzona z góry „jeśli A się nie mieści” |
| Powieki P-C (4. serwo) | trzeba nowej ramki | kalibracja każdej osobno | zmiana funkcji |

## Kolizje i zakres serw przy ±2 mm

[P] `duze-oko-kinematyka.js` z a0 przesuniętym tak, żeby długość zmieniła się o ±2 mm:

| Wariant | Zero orczyka | Zakres serwa |
|---|---|---|
| S1 nominalnie (41,86) | −6° | −42,0…+37,8° |
| S1 −2 mm | +0,6° (+6,6°) | −34,0…+48,9° |
| S1 +2 mm | −12,6° (−6,6°) | −50,8…+29,1° |
| S2 nominalnie (42,89) | −6° | −45,5…+40,2° |
| S2 −2 mm | +2,8° (+8,8°) | −33,6…+54,1° |
| S2 +2 mm | −15,0° (−9,0°) | **−60,0…+29,3°** |

- Wszystko w zakresie impulsów 600–2400 µs (`kalibracja.ino`, ok. ±80–90° [Z: MG90S ~10 µs/°]). Nieosiągalnych pozycji: 0.
- Przemiatanie na siatkach [P]: `duze-oko-kolizje.js` (kopia w scratchpadzie z przesunięciem początku korpusu przez zmienne środowiska), siatki z bieżącego SCAD, krok 10° plus zagęszczenie co 1°. Korpus S2 przesunięty o +2 mm w x (strona +x). Pary S1/S2 poniżej, reszta bez zmian wobec `kolizje-v2.txt`.

| Wariant długości | S1 korpus +y: drut S1–gałka | S1 korpus −y: drut S1–gałka | drut S2–gałka | orczyk S1–S2 | drut S1–S2 |
|---|---|---|---|---|---|
| nominalnie | **−0,07** (blaszka ucha) | 0,23 | 0,83 | 2,43 | > 3 (−y) / 2,72 (+y) |
| +2 mm | **−0,08** | 0,31 | 1,03 | 2,44 | > 3 / 2,95 |
| −2 mm | **−0,07** | 0,16 | 0,52 | 2,37 | > 3 / 2,34 |

- Najmniejszy odstęp S1 (dla obu stron) jest przy **własnej blaszce ucha**, tuż pod otworem (punkt gałki ok. (22; −0,4; −5,4), θ 35°, φ ±25°), a nie przy rancie. Przy korpusie po −y to 0,16–0,31 mm: korpus biegnie wzdłuż ściany blaszki, a skrypt traktuje go jako prosty odcinek od punktu przesuniętego o 2 mm. W rzeczywistości kąt w klepsydrze się dopasowuje. Do sprawdzenia na `ProbkaDrutu` ręką, nie da się tego rozstrzygnąć przemiataniem prostym odcinkiem.
- ±2 mm długości zmienia odstępy S1/S2 o ≤ 0,3 mm i nie tworzy nowych kolizji z uchwytem, pierścieniem ani serwami (te pary > 3 mm we wszystkich wariantach). S2–gałka spada do 0,52 przy −2 mm: na granicy 0,5.
- Nie sprawdzono: ogonów Z/L i zagiętych zabezpieczeń jako brył (skrypt ich nie ma).

## Decyzje dla użytkownika (zmiana funkcji)

- **Powieki wariant B** (dolna nieruchoma): usuwa problem równej długości całkowicie. PRD dopuszcza go z góry, jeśli A się nie mieści – K2/K3 pokazują, że P-A się nie mieści, a A z drutami wymaga zmiany modelu (kieszeń). Decyzja: A z drutami w parze czy B.
- **P-C (4 serwa):** MG90S × 4 są w warsztacie, ale to zmiana funkcji i nowa ramka w uchwycie. Nie rekomenduję – W4 albo B są prostsze.

## Werdykt

Koncepcja wymaga zmian przed przeprojektowaniem modelu: S1/S2 zostają na drucie z zerem w kalibracji, ale jako Z z długim środkiem i z kątami ~105° dla S2 (przy uchu i orczyku) zamiast „L 90°”, ucho gałki z grubszym dołem (`uchoDol` ≥ 2,6), a powieki – zamiast niemieszczących się łączników P-A – dwa druty gięte w parze z kieszenią w górnej powiece albo wariant B.
