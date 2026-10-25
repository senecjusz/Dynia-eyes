# Brief: krytyczne review modelu połączeń drutów v3 (duże oko v2)

Jesteś recenzentem, tylko do odczytu, bez commitów i `git pull`. Piszesz po polsku. Review jest pełne: obejmuje wszystkie połączenia drutów i części, które się zmieniły.

## Ustalenia (użytkownik, 24.10)

- Druty gięte ręcznie, dokładność ±2 mm i ±10°, można doginać. Nic nie kupujemy. Żadnych drobnych, kruchych wydruków.
- Obie powieki ruchome na jednym S3.
- Ucha gałki: widełki drukowane razem z gałką, z jednej strony masywniejsze. Drut kończy się **oczkiem**, oczko siedzi na **sworzniu z drutu Ø1** (wariant B, wybrany przez użytkownika). Śruba M3 odpadła, bo nie da się jej dokręcić: od łba do skorupy jest ok. 9 mm.
- Gałka biała i gładka (PRD): nic nie może wystawać na zewnątrz ani być widoczne.

## Co się zmieniło (model `40-cad/openscad/duze-oko-v2.scad`, stan roboczy)

1. **Galka:** ucha S1 i S2 to widełki (`widelec`, `profS1`, `profS2`, mostek S2).
   - Sworzeń ∥ y.
   - Szczelina `szczWid` 5,2; policzki 2,5.
   - Otwory: S1 przelotowe Ø1,4; S2 wewnętrzny Ø1,4, zewnętrzny Ø1,0 na wcisk.
   - Oczko Ø3 wewnętrzne (zwijane na trzpieniu M3).
2. **PowiekaGorna:** kieszeń w czaszy za dźwignią na nogę L drutu PG z koszulką.
3. **Dźwignie:** `rDzwKoniec` 2,2.
4. **ProbkaDrutu:** widełki S1 1:1 do wydruku testowego.
5. **Druty:**
   - S1, S2: oczko przy gałce, Z przy orczyku (środek 5 ± 1,5), bez V, kalibracja zera w ESP32.
   - PG, PD: L z koszulką (izolacja z przewodu Arduino) przy dźwigni, Z przy orczyku S3. PG wchodzi od +y, PD od −y. V w części tylnej do regulacji długości.
6. **Po przemiataniu v3 (poprawki v4):**
   - skos policzka S1 przesunięty (`xSkosS1` 4,5), bo korpus S1 wchodził w policzek na −0,80;
   - orczyk S3: otwór r 9,5 zamiast 7,5, bo ogon PG trafiał w wieżę S3 na −0,27.
   - Solver (`duze-oko-kinematyka.js`, parametry v4): S3 α zamknięcie +18,1°, otwarcie −19,3° (zakres 37,4°, wcześniej ok. 48°). Górna powieka 0 → 51,5°, dolna −0,21 → 51,32°. Pełny skok zachowany. S1 α −42…+37,8°, S2 α −45,5…+40,2° bez zmian.
7. **Wnioski z poprzednich rund:** `20-analizy/review/2026-10-24-druty-v2-wnioski.md`, `20-analizy/review/2026-10-24-ucho-oczko-{opus,astra}.md`.

## Dowody do sprawdzenia i powtórzenia

- Przemiatanie drutów: `40-cad/narzedzia/duze-oko-druty-v2-kolizje.js`. Wynik w pliku podanym w wiadomości od projektanta. STL i `parametry.json` są w tym samym katalogu.
- Przemiatanie części: `40-cad/narzedzia/duze-oko-kolizje.js`.
- Kąty: `40-cad/narzedzia/duze-oko-katy-przegubow.js`.

## Pytania

1. **Widełki:**
   - Czy przechył oczka (wymagany 38,4° S1, 27° S2) i szczelina wystarczają w całym zakresie?
   - Wytrzymałość policzków i materiał pod otworem.
   - Druk: gałka drukowana rantem na stole. Sprawdź nawisy, mostek S2 i płaskie dno policzka.
2. **Montaż:**
   - Kolejność: oczko na drucie, sworzeń przez policzki, zaginanie końców kombinerkami od tyłu gałki.
   - Wcisk Ø1,0 w S2.
   - Czy wszystko da się zrobić ręcznie z dokładnością ±2 mm?
3. **Kolizje i luzy:**
   - Czy przemiatanie jest kompletne (oczko, sworzeń z zagiętymi końcami, koszulki, V, ogony Z)?
   - Najmniejsze odstępy i miejsca poniżej 0,5 mm.
4. **Luz i histereza** oczka na sworzniu Ø1 (oczko Ø3) w stopniach gałki.
5. **Powieki:** czy rozwiązania przy dźwigniach (koszulka) i przy S3 są wykonalne i czy kolizje są usunięte?
6. **Lista zmian modelu, które nadal są potrzebne przed wydrukiem testowym.**

## Zasady

- Nie dopisuj funkcji.
- Wagi: KRYTYCZNE, WAŻNE, DROBNE. Każda uwaga: miejsce, scenariusz porażki, poprawka albo test, pewność.
- Liczby zamiast opinii.
- Werdykt jednym zdaniem.
- Raport: Astra → `20-analizy/review/2026-10-24-druty-v3-model-astra.md` (odpowiedź końcowa), Opus → `20-analizy/review/2026-10-24-druty-v3-model-opus.md`. Nie czytaj raportu drugiego recenzenta.

## Wyniki do oceny (wersja v6)

- **Zmiany w v6:** widełki S1 `xSkosS1` 5,5; `katOczka` 50 (szczelina 5,8); `ePodSw` 0,9 (dno policzka 1,6 pod osią); S3 r 9,5. Ogon Z drutu PG przy orczyku skierowany w dół (z ogonem w górę PG–PD −1,05).
- **Przemiatanie drutów:** `40-cad/openscad/kolizje-druty-v6.txt`. STL złożenia i `parametry.json` są w `C:/Users/Karol/AppData/Local/Temp/druty-v2/stl6`; parametry także w `40-cad/narzedzia/duze-oko-v2-parametry.json`.
- **Wnikania przy wybranym wariancie:** tylko drut S1 – własny orczyk −0,03. Model orczyka to prostopadłościan z ostrym rogiem.
- **Odstępy poniżej 0,5 mm:**
  - drut przy własnej powiece 0,00–0,01 (koszulka dosunięta do dźwigni, styk zamierzony);
  - druty powiek – orczyk S3 0,15;
  - S2 – własny orczyk 0,21;
  - S1 – gałka 0,23;
  - PD – Pierścień 0,44.
- **Oczko:** zapas w szczelinie 0,86 / 1,28 mm, przechył w granicy 53,2°.
- **Przemiatanie części** (`duze-oko-kolizje.js`, STL v4: różnią się od v6 tylko widełkami w gałce) liczy się. Wynik trafi do `C:/Users/Karol/AppData/Local/Temp/druty-v2/czesci-v4.txt`. Jeśli plik jest pusty, uruchom: `node 40-cad/narzedzia/duze-oko-kolizje.js C:/Users/Karol/AppData/Local/Temp/druty-v2/stl6 10` (ok. 25 min).
