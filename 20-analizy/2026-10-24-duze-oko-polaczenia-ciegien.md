# Duże oko v2: połączenia cięgien do złożenia w warsztacie

Status: **koncepcja do review** (Astra + krytyk Opus). Nic nie jest przeprojektowane. Model w `40-cad/openscad/duze-oko-v2.scad` zostaje bez zmian do decyzji użytkownika.

## 1. Problem

Obecny projekt zakłada drut Ø1,0 z zagięciami Z na obu końcach:
- odcinki między zagięciami 2–2,5 mm;
- długość drutu, od której zależy położenie zera, trzeba trafić co do ułamka milimetra.

Kombinerkami tego się nie zrobi. Przyrząd do gięcia (wersje 1–3) próbował obejść ten problem i nie zadziałał w praktyce. Użytkownik odrzucił tę koncepcję.

## 2. Warunki (od użytkownika, 24.10)

| # | Warunek |
|---|---|
| W1 | Nic nie kupujemy. Do dyspozycji: drut sprężynowy Ø1,0 (już gięty), śruby M3/M4/M5 8–50 mm z nakrętkami, drukarka, kombinerki, obcinaczki. |
| W2 | Żadnych drobnych drukowanych mechanizmów (zatrzaski kulowe, ścianki < ~1,5 mm, elementy wielkości milimetrów), bo wydruk się nie uda. |
| W3 | Dokładność ręczna: **±2 mm** na położeniu zagięcia i **±10°** na kącie zagięcia. Bez przyrządów i mierzenia ułamków. |
| W4 | Każde zagięcie robi się kombinerkami: odcinek ≥ szerokość szczęk (~5 mm). |

## 3. Jak to się robi w modelarstwie (fakty)

- **RC:** przy serwie Z-bend albo L z zabezpieczeniem, gięte szczypcami. Długość reguluje się na drugim końcu (łącznik ze śrubą, widełki na gwincie) albo **sub-trimem** w aparaturze. Źródła: [flyrc – połączenia popychaczy](https://flyrc.com/?p=1257), [DuBro E/Z connector](https://www.readymaderc.com/products/details/dubro-e-z-connector-for-rod-or-cable-number-121-2pcs).
- **Oczy animatroniczne:** gałka na kardanie porusza się w 3D, więc przy gałce potrzebny jest przegub kulisty. Używa się kulek z gwintem M2 albo prostych drutów, np. spinaczy. Źródła: [Adafruit](https://blog.adafruit.com/2019/12/23/diy-compact-3d-printed-animatronic-eye-mechanism/), [the-diy-life](https://the-diy-life.com/3d-printed-wireless-joystick-controlled-animatronic-eyes/).
- **Wniosek dla nas:** długość nie musi wychodzić z gięcia. Odpowiednikiem sub-trimu RC jest kalibracja zera serw w ESP32, która już jest w projekcie (`50-elektronika/kalibracja/`).

## 4. Czego wymaga każde połączenie (policzone z modelu)

Dane z echa `PARAMETRY` w SCAD i skryptu `40-cad/narzedzia/duze-oko-katy-przegubow.js` (parametry: `40-cad/narzedzia/duze-oko-v2-parametry.json`). Zakres ruchu gałki: θ ±35°, φ ±25°.

| Cięgno | Długość | Przy orczyku: odchylenie drutu od płaszczyzny obrotu | Przy gałce/dźwigni: zakres kierunku drutu względem ucha |
|---|---|---|---|
| S1 (lewo–prawo) | 41,9 | −10…−1° (zakres 9°) | x −45…+32°, y −28…+38° → **przegub kulisty ±~40°** |
| S2 (góra–dół) | 42,9 | −18…−12° (zakres 6°) | x −53…+23°, y −27…+25° → **przegub kulisty ±~40°** |
| PG (powieka górna) | 44,6 | 8…9° (stałe) | 1…2° → zwykły sworzeń |
| PD (powieka dolna) | 44,6 | −9…−8° (stałe) | 0…1° → zwykły sworzeń |

Czułość zera na błąd długości (interpretacja: przybliżenie δα ≈ δL / r przy ramieniu orczyka ~prostopadłym do drutu):
- **S1:** r 17,5 mm, 2 mm błędu → ~6,5° przesunięcia zera serwa. Kalibracja ESP32 to kasuje, bo S1 ma własne serwo.
- **S2:** r 13,5 mm, 2 mm błędu → ~8,5°. Kalibracja to kasuje.
- **Powieki:** 1 mm błędu → **8,4°** kąta powieki (policzone). Obie powieki są na **jednym** serwie, więc kalibracja nie wyrówna różnicy między nimi. Przy W3 (±2 mm) rozjazd może sięgnąć **±17° na 51,5° skoku**: jedna powieka się nie domknie albo druga będzie się opierać. **To jest główny problem precyzji, a nie S1/S2.**

## 5. Opcje

### S1, S2: drut z jednym zagięciem L, długość w kalibracji

Przy orczyku:
- L wsunięte w fabryczny otwór orczyka MG90S;
- koniec za otworem zagięty kombinerkami ≥ 5 mm dalej, w dowolnym miejscu, jako zabezpieczenie, jak RC „L-bend + keeper”;
- drut odchyla się od płaszczyzny tylko o 6–9°, a luz w otworze orczyka to przyjmuje (standard RC).

Przy gałce:
- ucho bez zmian: blaszka 2 mm w płaszczyźnie (x, z), otwór z klepsydrą wzdłuż y (S1) / x (S2), czyli już prostopadle do drutu idącego od serwa;
- noga L wsunięta w otwór; dziś ma 2,5 mm (Z), teraz dłuższa: blaszka 2 mm + ≥ 5 mm pod szczęki, koniec za blaszką zagięty w dowolnym miejscu (zabezpieczenie);
- klepsydra (stożki 45°) daje przechył nogi ±45°, obrót wokół nogi daje drugi stopień swobody → przegub kulisty z tabeli w p. 4;
- do sprawdzenia: czy dłuższa noga (~8 mm wzdłuż y/x od ucha) i zagięty koniec mieszczą się w gałce obok kardanu i drugiego ucha.

Rysunki: `40-cad/druty/polaczenia-ciegien-hobby.svg` (A – ucho gałki, B – orczyk, C – łącznik powieki, D – gięcie na oko).

Długość:
- zagięcie L w miejscu zaznaczonym markerem z rysunku 1:1, ±2 mm;
- zero gałki ustawia kalibracja.

Do sprawdzenia przez recenzentów:
- czy noga L w klepsydrze nie zakleszcza się przy θ, φ skrajnych;
- czy przesunięcie zera orczyka o ±8,5° nie powoduje kolizji orczyka lub drutu z Uchwytem serw i Pierścieniem (`duze-oko-kolizje.js` z L ± 2 mm);
- czy noga L z zagiętym końcem mieści się w gałce bez kolizji z kardanem.

### Powieki

**P-A: drukowane łączniki o stałej długości, sworznie z odcinków drutu.**
- Łącznik płaski ~44,6 × 4 × 3 mm, drukowany na płasko, oczka Ø5 z otworem Ø1,4 na obu końcach.
- Sworzeń: kawałek drutu Ø1,0 przez oczko łącznika i otwór dźwigni lub orczyka, końce zagięte gdziekolwiek ≥ 5 mm za otworem.
- Długość daje wydruk, ±0,2 mm → ±1,7° na powiece. Ruch jest prawie płaski (p. 4), więc sworzeń wystarczy.
- Do sprawdzenia:
  - czy dźwignia powieki r 7 ma miejsce na oczko i otwór Ø1,4 ze ścianką ≥ 1,5 mm;
  - czy fabryczny otwór orczyka przyjmie drut Ø1,0 (założenie: Ø1,3–1,5, zmierzyć suwmiarką);
  - czy łączniki nie kolidują ze sobą i z korpusem.

**P-B: drut L jak w S1/S2, z regulacją jednej powieki.**
- Na przykład dźwignia PD z kilkoma otworami co ~1 mm albo łącznik z owalnym otworem i śrubą M3.
- Wada: na r 7 nie ma miejsca na rząd otworów ani na śrubę M3 (W2), więc to raczej odpada. Zostaje do porównania.

**P-C: osobne serwo dla każdej powieki.**
- Każdą powiekę kalibruje się osobno, więc drut L może mieć ±2 mm.
- **Zmiana funkcji:** 4 serwa zamiast 3. Decyzja użytkownika i PM, poza zakresem projektanta.

## 6. Rekomendacja projektanta (do weryfikacji)

- S1, S2: drut z jednym L na każdym końcu i zagiętym zabezpieczeniem, ucho gałki bez zmian (dłuższa noga L), zero w kalibracji ESP32.
- Powieki: P-A, drukowane łączniki o stałej długości na sworzniach z drutu.
- Przyrząd do gięcia i zagięcia Z odpadają.

## 7. Montaż w ręku (dla rekomendacji)

1. Wydrukować łączniki powiek.
2. Drut S1 i S2: uciąć z zapasem ~15 mm. Zaznaczyć markerem miejsce zagięcia z rysunku 1:1 i zagiąć L kombinerkami.
3. Nogę L przełożyć przez ucho gałki i koniec zagiąć za uchem.
4. Drugi koniec: L w otwór orczyka, koniec zagiąć. Orczyk założyć na serwo.
5. Powieki: łącznik na dźwignię i orczyk, sworznie z drutu, końce zagiąć.
6. ESP32, strona kalibracji: ustawić zero S1 i S2 tak, żeby gałka patrzyła prosto, a S3 tak, żeby powieki domykały się razem.
