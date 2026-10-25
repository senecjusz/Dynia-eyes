# Synteza: The Face maker101 jako wzór dużego oka

25.10.2026, PM. Brief: `30-projekt/brief-analiza-referencji-face-maker101.md`. Raporty: `2026-10-25-referencja-face-maker101-{fable,opus,astra}.md`.

Fable i Opus obejrzeli stronę, zdjęcia i film. Astra miała tylko stronę i zdjęcia, bo film był dla niej niedostępny, więc większość jej wniosków jest warunkowa. Nikt nie pobrał plików STL.

## 1. Co jest w referencji (zgodne u wszystkich trzech)

- **Płyta:** jedna płaska płyta z gniazdami na 5 × MG90S (2 na oko, 1 wspólne dla obu powiek) i słupkami. Bez ramek i bez wsporników. Serwa wkłada się od góry, zanim pojawią się gałki.
- **Gałka:** jeden drukowany przegub uniwersalny na gałkę, osadzony między słupkami. Gałka ma ok. Ø35, to szacunek ze zdjęć.
- **Pręty:** prostowane spinacze, końce zagięte w otwory orczyków i zaczepy gałki. **Zero przegubów w prętach.**
- **Powieki:** jedna czasza na oko, napędzana drutem od wspólnego serwa.
- **Mocowanie:** płyta przyklejona na gorąco do listew w masce.
- **Montaż:** na otwartym stole, kombinerkami, wkrętakiem i klejem.
- **Zakres ruchu:** strona nie podaje kątów. Opus odczytał z kodu w filmie ±15–20° w poziomie. Fable z kadrów filmu ocenił ±10–20°. Astra nie miała danych.
- **Pliki do pobrania:** `eyeball.stl`, `joint_v1.stl`, `center-joint_v1.stl`, `eye_holder_main.stl`, `eyelid.stl` i kod `.ino`.

## 2. Gdzie analitycy się różnią

| Temat | Fable | Opus 5.5 | Astra |
|---|---|---|---|
| Gdzie leży oś przegubu w referencji | **za gałką** [Z, ze zdjęć] | **w środku kuli** | nieustalone |
| Kardan 5/5 | potrzebny w środku gałki: oś za gałką mieści w otworze Ø80 tylko ±19,5° | zamiana drukowanego przegubu na 5/5 (nadal 1 przegub), bo geometria drukowanego jest nieznana bez STL, a obciążenie rośnie ok. 5 razy | nie proponuje go bez dowodu. Jej warunek: oś najwyżej 17 mm za środkiem gałki, inaczej ±35° nie mieści się w Ø80 |
| Zakres w adaptacji | ±37,6° / ±28,5° (orczyk 17,5 / 13,5, zaczepy r 20) | ±35° / ±25° (orczyk 13,5, zaczepy 16,6 / 22,6) | rachunek warunkowy: serwo ±41° / ±29°, nic nie przeczy |
| Pręty | drut Ø1,0 | Ø1,2 | Ø1,0 jako pierwszy kandydat |
| Kształt gałki | półkula plus pierścień z uszkami | czasza głębsza niż półkula (do 125°), bo przy ±35° w otworze widać krawędź półkuli | – |

**Najważniejsza rozbieżność:** gdzie w referencji leży oś przegubu. Od tego zależy, czy kardan jest potrzebny. Fable i Astra liczą to samo: oś dalej niż ok. 17–20 mm za środkiem gałki nie mieści ±30–35° w otworze Ø80. Rozstrzygnie to plik `center-joint_v1.stl` i `eyeball.stl`.

## 3. Wspólny obraz adaptacji

- **Płyta:** jedna, 4 × MG90S, serwa poza obrysem gałki, orczyki dostępne z boku.
- **Gałka:** jeden przegub, w środku gałki, jeśli oś z referencji nie mieści się w Ø80.
- **Pręty:** 4 druty bez oczek i bez przegubów, końce w „Z” jak spinacz.
- **Zakres:** pełny zakres PRD wychodzi bez nowych części, wystarczy wybór otworu orczyka i położenia zaczepów (Fable, Opus).
- **Powieki:** dwie, według PRD.
- **Mocowanie:** tuba, kołnierz z łapami i maskownica według PRD.
- **Werdykt:** Fable i Opus uważają adaptację za prostszą od v9 i możliwą do złożenia rękami. Astra mówi, że jest prostsza, ale montowalności nie da się jeszcze potwierdzić.

## 4. Ciasne miejsca wskazane przez analityków

- **Powieki w tubie Ø80:** zostaje 1 mm między słupkiem zawiasu a tubą (Fable) albo 0,8 mm przy powiekach koncentrycznych (Opus). To jest konstrukcja „na milimetr” z PRD §9.
- **Wejście modułu do dyni:** płyta ok. 110 × 90 nie przejdzie przez otwór Ø80 (Fable D9). Wchodzi tylko od góry, przez wieczko.
- **Mocowanie gałki do piasty kardana:** dostęp imbusem (Opus P3).

## 5. Pytania do użytkownika (połączone z 3 raportów)

1. **Pobranie STL z PCBWay:** `eyeball.stl`, `center-joint_v1.stl`, `joint_v1.stl`, `eye_holder_main.stl`, `eyelid.stl`. Rozstrzygnie, gdzie leży oś przegubu i jakie są wymiary, zamiast szacunków ze zdjęć.
2. **Kardan 5/5 w środku gałki:** jedyna dozwolona modyfikacja. Zależy od pytania 1. Dwóch analityków na trzech go proponuje.
3. **Powieki przy tubie:** zostaje 1 mm. Możliwości: zawias w ściance tuby, cieńsza tuba albo bez tuby (gałkę prowadzi otwór w dyni, jak maska w referencji).
4. **Wejście modułu do dyni:** przez otwór wieczka u góry? Od tego zależy wielkość płyty.
5. **Gałka:** półkula jak w referencji (przy ±35° w otworze widać jej krawędź) czy czasza głębsza?
6. **Grubość ściany dyni przy otworze:** pomiar.

Rozstrzyga PM z projektantem, bez pytań do użytkownika: drut Ø1,0 jak spinacz (2 z 3 analityków), serwa w gniazdach na klej jak w referencji (PRD dopuszcza klej), oś powiek i dobór otworów orczyka.

## 6. Pomiar plików referencji (PM, 25.10 wieczorem)

Pliki pobrał użytkownik, leżą w `00-inbox/face-maker101/`: STL i kod `.ino`. Pomiar: obwiednie i przekroje siatek skryptem.

- **Gałka `eyeball.stl`:** czasza Ø28 (R14), ścianka 1 mm, otwarta z tyłu. Sięga 4,5 mm za środek kuli, czyli jest nieco głębsza niż półkula (otwór tylny ok. Ø26). Od środka przodu zwisa czop Ø2,8 do 6,6 mm przed środkiem kuli.
- **Przegub:**
  - `center-joint_v1.stl`: kostka 4 × 4 × 4 z otworem Ø1 na sworzeń z drutu;
  - `joint_v1.stl`: widełki 7,5 × 7,5 × 14,2 z otworami ok. Ø3.

  **Oś obrotu leży wewnątrz kuli**, ok. 3–7 mm przed jej środkiem, a nie za gałką. W skali Ø60 (×2,14) daje to 6–14 mm, czyli mniej niż granica 17 mm z warunku Astry. Zakres ±35° mieści się w otworze Ø80 bez przenoszenia osi. Założenie Fable (oś za gałką, ±19,5°) się nie potwierdza.
- **Kod `the_face_code.ino`:** serwa gałek ruszają się o ±10–20° wokół środka (np. 75 → 65/85, 87 → 75/105), a powieki o 30° (50 → 80). Mały zakres w referencji to ustawienie programu, a nie ograniczenie mechanizmu.
- **Wniosek dla pytania 2 z §5:** kardan 5/5 nie jest potrzebny ze względu na geometrię. Jeden przegub w środku kuli da się zrobić na dwa sposoby:
  - **(a)** przegub drukowany jak w referencji, w skali ×2,14: kostka ok. 8,6 mm, widełki ok. 16 × 30, sworznie z drutu Ø2 z warsztatu;
  - **(b)** posiadany kardan 5/5 w tym samym miejscu, który jest pewniejszy pod gałkę Ø60 z powiekami.

  Oba to jeden przegub. Wybór należy do użytkownika.
