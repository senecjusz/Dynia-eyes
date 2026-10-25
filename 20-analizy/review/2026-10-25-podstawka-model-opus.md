# Review modelu podstawki v1 – Opus (25.10.2026)

Zakres: `podstawka.scad`, 3MF w `40-cad/3mf/Podstawka v1/`, rysunek cięcia, opis `2026-10-25-podstawka-model.md`. Pracowałem tylko do odczytu, a wszystkie eksporty i skrypty szły do `C:/Users/Karol/AppData/Local/Temp/opus-review/`.

**Co sprawdziłem i jest w porządku:**
- `sprawdz_siatki.js` na 9 plikach: otwarte, nierozmaitościowe i zdegenerowane krawędzie 0/0/0. `skladowe_siatki.js` daje 1 bryłę na część, a `podstawka-wymiary.js` zwraca OK.
- Ponowny eksport Szuflady, połówek i Kasety z obecnego SCAD daje te same bboxy i liczby trójkątów, więc siatki są aktualne.
- Każda część ma płaską stronę na stół. Nawisy > 45° to tylko sklepienia otworów: Ø24 kopułki ok. 56 mm², otwory M3 i otwory na wkręty kasety ok. 16 mm².
- Szuflada 234,8 mieści się na X1C, Kaseta 170 i tuleja 120 na A1 mini.
- Gwint tulei i nakrętki jest prawy w obu częściach. Sprawdziłem to na siatce: profil zgadza się z helisą prawą, lewa daje odchyłki ±2 mm.
- Klin uchwytu ma spód dokładnie 45°.
- Czoło zachodzi 8 mm na krawędzie ścianek, z luzem bocznym 1,5.
- Odstępy: szufladka–kaseta 2, kaseta–ścianka tylna 1, powerbank–płyta 6.
- Rysunek cięcia zgadza się z modelem: 254,8 × 222,8 z Ø64, 2 × 222,8 × 40 i 218,8 × 40. Zawiera wszystkie elementy i same prostokąty, więc da się go wyciąć na pile stołowej.

## PSUJE DZIAŁANIE ALBO DRUK

**1. PIR nie da się zamontować w szczelinie** (`szuflada()`, l. 140, 148–153)
- **Membrana 0,2 mm za płytką.** Pierwsza ścianka „przegroda PIR” (`cube([szW, sc, …])` przy y 0…2,4) jest tylko częściowo przecięta szczeliną o głębokości y 0…2,2. Za płytką zostaje błona 0,2 mm (y 2,2–2,4, z 2…32) na całej szerokości okna. Na siatce punkt (40; 2,3; 15) to materiał.
- **Skutek błony.** Elementy z tyłu HC-SR501 (potencjometry, BISS0001, listwa, ok. 5–10 mm) nie mają miejsca. Slicer albo wydrukuje tę ściankę byle jak, albo ją pominie.
- **Płytki nie da się wsunąć od góry.** Szczelina jest dosunięta do czoła (y = 0). Czujnik piroelektryczny TO-5 (ok. 4–5 mm) i soczewka są z przodu płytki, więc przy wsuwaniu od góry trą o czoło nad otworem Ø24.
- **Płytka siedzi za nisko.** Spoczywa na dnie (z = 2), a model zakłada z = 3 (`pirNadDnem` niczego nie podpiera). Kopułka Ø23 wypada wtedy 1 mm niżej niż otwór Ø24 przy luzie 0,5, czyli nachodzi na krawędź o 0,5 mm.
- **Poprawka:**
  - usunąć ściankę y 0…2,4 w oknie płytki, albo całą, bo czoło ją dubluje;
  - płytkę wkładać od tyłu (z kieszeni) czujnikiem w otwór: dolna krawędź w rowku na wysokości `pirNadDnem`, górna dociśnięta jednym zaczepem albo wkrętem przez otwór montażowy płytki.
- **Pewność:** wysoka (sprawdzone na siatce, układ HC-SR501 typowy).

**2. Brak wejścia zasilania w kasecie; USB-C ESP32-C3 patrzy w szufladkę** (`kaseta()`, l. 185–190)
- Opis mówi o kablu „do wejścia zasilania w kasecie”, ale w modelu nie ma żadnego wejścia: ani gniazda USB-C z powerbanku na V+ (`polaczenia.md`: przy więcej niż 2 serwach osobne 5 V), ani zacisku.
- Jeśli kabel trafi do gniazda ESP: ramka ma gniazdo od przodu. Od czoła ESP (y kasety 15,3) do tylnej ścianki szufladki jest 15,3 + 2 = **17,3 mm**, a wtyk ma 50 mm (przyjęte 25.10). Przy zamkniętej szufladce wtyk koliduje z jej tylną ścianką.
- **Poprawka:** obrócić ramkę ESP gniazdem w bok, w prawo (wolny pas x 212–237 za wycięciem kabli), albo dodać w kasecie uchwyt gniazda USB-C/zacisku V+ skierowany w ten pas.
- **Pewność:** wysoka co do geometrii, średnia co do tego, co ma być „wejściem”.

**3. Wariant A1 mini: słupek powerbanku zasłania otwór M3 i siedzisko łba** (`zebra()` / słupki, l. 150, 160–162)
- Lewe żebro ma x 166,4–169,4, a słupki x 164,4–168,4 (y 28,4–36,4 i 91,4–99,4).
- Otwór przy y 37,4 (Ø3,3, czyli y 35,75–39,05) jest zasłonięty przez słupek do y 36,4, o 0,65 mm. Na siatce punkt (167,5; 36,0; 6) to materiał, więc śruba M3 nie przejdzie.
- Łeb Ø5,5 albo nakrętka (6,35) po lewej stronie nachodzi na słupek o 1,75 mm przy otworze y 37,4 i o 0,75 mm (łeb) albo 1,2 mm (nakrętka) przy y 89,4.
- **Poprawka:** otwory żeber przesunąć do y ≥ 41 i ≤ 85, z dala od słupków o promień łba i 0,5, albo `zebroOdKrawedzi` = 14.
- **Pewność:** wysoka (sprawdzone na siatce).

**4. Gwint: luz na siatce to nie 0,20, tylko −0,12…+0,46** (`gwint()`, l. 105–108)
- `twist` przy `gwWarstwy` 24 obraca przekrój o 15° na warstwę. Wierzchołki idą cięciwą, więc powierzchnia ucieka do środka o r(1−cos 7,5°) = do 0,33 mm.
- **Pomiar na próbkach (siatka):**
  - tuleja ma promień mniejszy od idealnego o 0,075–0,31;
  - otwór nakrętki ma promień mniejszy od idealnego+0,20 o 0,16–0,31.
- **Złożenie nakrętki na śrubie, 5 położeń w obrębie warstwy:** luz promieniowy min −0,113 / +0,075 / +0,104 / −0,002 / −0,122, średnio 0,20, max 0,46.
- Miejscami jest więc wcisk 0,12, a miejscami 0,46. Okres bicia z warstwami 0,2 mm wynosi dokładnie 5 mm (1 skok), więc nakrętka 8 mm trafi na ciasne miejsce. Próbka nie odtworzy pasowania E2.0 (SolidCraft, 0,20, czyli ok. 0,5 luzu poprzecznego).
- **Poprawka:** `gwWarstwy` = 360 / `gwKrok` = 120 (3° na warstwę, odchyłka ok. 0,013), dopiero potem próbka. Czas CGAL wzrośnie.
- **Pewność:** wysoka co do liczb, średnia co do skutku (zacinanie albo luz).

**5. Wysokość tulei pomija kołnierz: nakrętka zazębia ok. 4–5 mm pełnego gwintu zamiast 8** (l. 94, 114; opis „tuleja = hDoc + 10”)
- `hDoc` mierzy się, gdy dynia stoi na płycie. Po montażu dynia stoi na kołnierzu o grubości 3 mm, więc dno wnętrza jest na `hDoc` + 3.
- Tuleja kończy się na `hDoc` + 10, czyli 7 mm nad dnem. Górne 2 mm to fazka (gwint ścięty do rdzenia), a dolna fazka nakrętki ma 1 mm. Pełne zazębienie to ok. 4–5 mm, ok. 1 zwój.
- Błąd pomiaru `hDoc` o +3 mm (nierówne dno dyni) zostawia nakrętce tylko fazkę.
- **Poprawka:** `tulH` = `hDoc` + `kolT` + `nadDnem`, czyli 58.
- **Pewność:** średnio-wysoka.

**6. Osłonka PIR (opcja) wystaje 7 mm pod stół** (`oslonka()`, l. 62, 203–207)
- Kołnierz ma Ø44 (`oslKolR` 22), a oś otworu jest 15 nad stołem. Przyklejony współosiowo do czoła kołnierz sięga do z = −7.
- Szufladka jedzie po stole, więc osłonki nie da się przykleić.
- **Poprawka:** `oslKolR` ≤ `pirZ` − 1 (np. 14, kołnierz Ø28 jak rurka + ścianka) albo ściąć kołnierz płasko na z = 0.
- **Pewność:** wysoka.

## BRZEGOWE

7. Potencjometry HC-SR501 mają oś poziomą do tyłu, a kieszeń ma ok. 22,8 mm głębokości, więc wkrętak od góry ich nie złapie. Regulacja wymaga wyjęcia płytki (po poprawce z punktu 1 to łatwe).
8. Lewa połówka 178,9 mm na stole 180 mm A1 mini: zapas 0,55 mm na stronę, bez brimu.
9. Otwór Ø64 w płycie wchodzi 22,4 mm nad szufladkę (y 79,4–101,8). Skrętki trzeba prowadzić tylną krawędzią otworu, bo nad powerbankiem jest tylko 6 mm i wysuwana szufladka ciągnie leżący kabel.
10. Wkręty kasety: wkrętak ≥ 210 mm przez otwór szufladki. Oś lewego wkrętu (x 77,4) wypada na krawędzi ramki ESP (do x 77,5) i na trasie kabla.
11. Opis podaje prawą połówkę jako 55,9 × 112,8, a siatka ma 55,9 × 104,8 (bez uchwytu). „Nastawna otwornica 64”: koncepcja wymienia tylko otwornicę 80, więc trzeba sprawdzić, czy jest 64.
12. Zapas kabla 10 cm przy wysunięciu 100 mm: powerbank wychodzi spod płyty tylko o 1,6 mm, a kabel jest napięty do końca.

## Propozycje (poza zakresem)

- Brak.

**Werdykt:** jeszcze nie. Sklejkę można ciąć według rysunku, ale szufladkę (mocowanie PIR, w wariancie A1 mini też otwory żeber), kasetę (zasilanie), tuleję (wysokość) i próbkę gwintu (rozdzielczość) trzeba poprawić przed drukiem.
