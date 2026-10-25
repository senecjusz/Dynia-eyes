# Brief: review połączenia drutów S1/S2 z gałką na kardanach 2/2 (duże oko, wersja v8) – runda 1 z 2

Jesteś recenzentem, tylko do odczytu, bez commitów i `git pull`. Piszesz po polsku.

## Zasady użytkownika

- Każdą uwagę klasyfikujesz: **PSUJE** (produkt nie działa według PRD) albo **BRZEGOWA** (nie rozwiązujemy).
- Najwyżej 2 rundy review. To runda 1.
- Liczby zamiast opinii.
- Werdykt jednym zdaniem.

## Decyzje użytkownika (przyjmij jako fakt)

- Kardany 2/2 z warsztatu (Ø9 × 23,5, otwory Ø2, wkręty M3). Zginają się do ok. 90°, co potwierdza zdjęcie użytkownika z 25.10.
- Wcześniejsze rozwiązania (Z w uchu, oczko na sworzniu) odpadły.

## Co jest w modelu (`40-cad/openscad/duze-oko-v2.scad`, stan roboczy)

- **Kardan:**
  - środek przegubu leży w punkcie ucha `[rUcha, 0, zUcho]` (S1) i `[0, rUcha, zUcho]` (S2);
  - zmienione: `rUcha` 17 zamiast 20, `tylRant` 4 zamiast 8 (krawędź gałki wyżej), `zUcho` 0;
  - S2 przesunięte (`przesS2` 4), bo jego wieża zbliżała się do orczyka S1.
- **Kostka** (`kostkaKardana`):
  - w gałce, na osi „ucho → otwór orczyka w zerze”, po stronie gałki;
  - kołek z drutu ocynkowanego Ø2 wklejony w ślepy otwór Ø2,2, długość 8 mm (klejenie dozwolone przy połączeniach nieruchomych, użytkownik 25.10);
  - żebro do skorupy, przycięte do kuli Rg − tg/2;
  - wycięcie na piastę 1.
- **Piasta 2** zaciska pręt Ø2 (drut ocynkowany) do orczyka S1/S2. Na końcu pręta zagięcie L w otworze orczyka rozwierconym do Ø2,2. Długość ustawia się przesuwem pręta w piaście, zero w ESP32.
- **Rowek T łba M5:** przycięty do kuli Rg − 0,8. Wcześniej przebijał skorupę na froncie (półksiężyc).
- **ProbkaDrutu:** próbka kostki, otwory Ø2,2 i Ø2,3.

## Dowody

- Przemiatanie kardanów: `40-cad/narzedzia/duze-oko-kardany-kolizje.js`, wynik `40-cad/openscad/kolizje-kardany-v8.txt` (krok 5°, θ ±35°, φ ±25°).
- Przemiatanie powiek v8: `40-cad/openscad/kolizje-powieki-v8.txt`.
- Kąty zgięcia kardana: S1 ≤ ok. 56°, S2 ≤ ok. 51°. Policzone dla środka w punkcie ucha przy rUcha 20; przy 17 policz sam.
- Makieta: `40-cad/openscad/makieta-galka-kardan.scad`. Rendery kardanów są w rozmowie, w repo ich nie ma.

## Pytania

1. **Kinematyka:**
   - kąt zgięcia kardana w całym zakresie (przy `rUcha` 17);
   - zakres serw S1/S2 i odległość od martwego punktu orczyka;
   - wpływ zmiany `rUcha` i `zUcho` na zakres ±35° / ±25°.
2. **Kolizje:**
   - piasty, pręty i kostki w całym zakresie;
   - klasyfikacja wyników poniżej 0,5 mm.
3. **Wykonanie:**
   - druk kostek w gałce drukowanej rantem na stole: nawisy, żebro, klejenie kołka Ø2;
   - montaż: kolejność, dostęp kluczem do wkrętów M3 piast;
   - zagięcie L pręta Ø2 w orczyku MG90S: otwór Ø2,2 w orczyku z otworami co 2 mm.
4. **Luz:** luz kardana i jego wpływ na kąt gałki (wartość założona).
5. **Wygląd:**
   - czy po zmianie `tylRant` na 4 krawędź gałki albo kardany są widoczne z przodu w zakresie ruchu;
   - czy półksiężyc zniknął.
6. **Lista rzeczy, które użytkownik musi zrobić ręcznie**, w punktach.

## Raport

- Astra → `20-analizy/review/2026-10-25-kardany-astra.md` (odpowiedź końcowa).
- Opus → `20-analizy/review/2026-10-25-kardany-opus.md`.

Nie czytaj raportu drugiego recenzenta. Na początku streszczenie: najwyżej 3 akapity po 3 zdania.
- Wynik powiek v8 pojawi się w `40-cad/openscad/kolizje-powieki-v8.txt` w trakcie review (liczy się). STL v8 i parametry.json: `C:/Users/Karol/AppData/Local/Temp/v8/stl`.
