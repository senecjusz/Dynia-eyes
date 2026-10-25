# Brief: review powiek v3 (każda powieka na swoim serwie) – duże oko, runda 1 z 2

Jesteś recenzentem, tylko do odczytu, bez commitów i `git pull`. Piszesz po polsku.

## Zasady użytkownika dla review (25.10)

- Każdą uwagę klasyfikujesz: **PSUJE** (produkt nie działa według PRD) albo **BRZEGOWA** (przypadek brzegowy, nie rozwiązujemy).
- Najwyżej 2 rundy review. To runda 1.
- Liczby zamiast opinii, przy każdej uwadze miejsce i poprawka.
- Werdykt jednym zdaniem.

## Decyzje użytkownika (25.10), przyjmij jako fakt

- Tuba zostaje.
- Każda powieka ma swoje serwo (4 × MG90S: S1, S2, SG, SD).
- Drut powieki zaczepiony daleko od osi: uszko na tylnej krawędzi czaszy, otwór 34 mm od osi powiek.
- Wariant A: drukowane przedłużenie orczyka do 25 mm, pełne otwarcie 51,5°.
- Drut powieki z zagięciem L na obu końcach, gięty na oko. Długość kasuje zero serwa w kalibracji.

## Materiał

- **Model:** `40-cad/openscad/duze-oko-v2.scad` (stan roboczy):
  - moduły `uszkoPow`, `PrzedluzenieOrczyka`, `UchwytSerw` (ramki serw powiek);
  - funkcje `uszkoP`, `orczP`, `alfaP`;
  - zmienne `rZaczP`, `katZaczP`, `rOrczP`, `yWalP`, `przesOrczP`.
- **Przemiatanie:** `40-cad/narzedzia/duze-oko-powieki-v3-kolizje.js`, wynik w `40-cad/openscad/kolizje-powieki-v3.txt`:
  - każda powieka osobno, 9 × 9 par kątów;
  - gałka θ ±35°, φ ±25°, krok 10°;
  - wyłączone 1,5 mm drutu przy uszku (drut przechodzi przez otwór uszka).
- **Rendery:**
  - `40-cad/druty/powieki-v3-wariant-A.png` – z boku i z tyłu, zamknięte i otwarte;
  - `40-cad/druty/powieki-v3-wariant-B.png` – odrzucony wariant B, do porównania.
- **Kontekst:** `20-analizy/review/2026-10-25-uproszczenie-synteza.md`, `30-projekt/PRD.md`.
- **Nie oceniasz** połączenia drutów S1/S2 z gałką (widełki, oczko, sworzeń): to osobny temat, w rozmowie z użytkownikiem.

## Pytania

1. **Kinematyka powieki:**
   - czy kąt serwa +36° / −31° jest daleko od martwego punktu w całym skoku;
   - czy błąd długości drutu ±2 mm mieści się w zakresie serwa i kalibracji;
   - ile wynosi czułość w stopniach powieki na 1 mm.
2. **Uszko:**
   - wytrzymałość (siła z serwa MG90S ok. 1,8 kg·cm na ramieniu 25 mm);
   - druk razem z powieką w obecnej orientacji (`druk()`), nawisy;
   - czy zagięcie L drutu da się włożyć i czy nie wypada.
3. **Przedłużenie orczyka:**
   - mocowanie na fabrycznym orczyku (rowek od spodu, wkręt orczyka przez środek) i ryzyko obrotu lub pęknięcia;
   - przyjęte wymiary orczyka (szerokość końca 5,5, piasta Ø7) to założenie.
4. **Kolizje:**
   - przemiatanie: wnikania i odstępy poniżej 0,5 mm, każda z klasyfikacją PSUJE / BRZEGOWA;
   - orczyki powiek wobec słupka (oś serwa powieki 14,2 mm od osi, słupek Ø16);
   - druty powiek wobec drutów S1/S2 i gałki.
5. **Widoczność:** czy uszka albo druty powiek są widoczne z przodu dyni (PRD: gałka biała, gładka; rant ≤ 2 mm). Klasyfikuj.
6. **Montaż:** kolejność i dostęp. Co użytkownik musi zrobić ręcznie, w punktach.

## Raport

- Astra → `20-analizy/review/2026-10-25-powieki-v3-astra.md` (odpowiedź końcowa).
- Opus → `20-analizy/review/2026-10-25-powieki-v3-opus.md`.

Nie czytaj raportu drugiego recenzenta. Na początku streszczenie: najwyżej 3 akapity po 3 zdania.

## Uwagi do wyniku

- Ramię uchwytu przesunięte z 270° na 285°, bo orczyk SD wchodził w nie na −0,67 mm w pierwszym przebiegu. Po zmianie przebieg samych powiek (`TYLKO_POWIEKI=1`) jest czysty.
- Część gałki w pliku pochodzi z pierwszego przebiegu, sprzed tej zmiany.
- −0,89 mm „drut – własna powieka” to drut wewnątrz własnego uszka: promień oczka uszka 2,6 mm, a wyłączone jest tylko 1,5 mm.
