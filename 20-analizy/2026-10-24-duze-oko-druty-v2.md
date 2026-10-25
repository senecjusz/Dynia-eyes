# Duże oko v2: druty gięte ręcznie z poprawką długości (koncepcja v2)

Status: koncepcja do review (Opus + Astra). Zastępuje `2026-10-24-duze-oko-polaczenia-ciegien.md`, która nie przeszła review (raporty `20-analizy/review/2026-10-24-polaczenia-ciegien-{astra,opus}.md`). Model SCAD bez zmian do przyjęcia koncepcji.

## Słownik (terminy tego projektu)

| Termin | Znaczenie |
|---|---|
| gałka | kula oka Ø60, obracana w dwóch osiach na kardanie |
| S1, S2, S3 | serwa: S1 lewo–prawo, S2 góra–dół, S3 obie powieki naraz |
| drut S1 / S2 / PG / PD | drut sprężynowy Ø1,0 od orczyka serwa do: gałki (S1, S2), dźwigni powieki górnej (PG), dolnej (PD) |
| ucho | płaska blaszka 2 mm w gałce z otworem na koniec drutu |
| klepsydra | otwór w uchu rozszerzony stożkami 45° po obu stronach, żeby drut mógł się w nim przechylać |
| zagięcie Z | koniec drutu: dwa zagięcia, środek przechodzi przez otwór, drut nie wypada (standard RC) |
| przegięcie regulacyjne | V w środku drutu (dwa ramiona po 5 mm); ściśnięcie skraca drut, rozgięcie wydłuża |
| zero | ustawienie serwa w kalibracji ESP32, przy którym gałka patrzy prosto / powieki domknięte |

## 1. Założenie (użytkownik, 24.10)

- Druty gięte kombinerkami: położenie zagięcia **±2 mm**, kąt **±10°**. Użytkownik zgadza się, że po przyłożeniu drut można **doginać drugi raz**.
- Model ma to wybaczać: drut krzywy o 2 mm nie może niczego dotknąć, a długość poprawia się na drucie, nie na wydruku.
- Nic nie kupujemy. Obie powieki zostają ruchome na jednym S3 (decyzja użytkownika: nie zmieniamy konstrukcji, żeby ominąć problem drutu).

## 2. Praktyka (źródła)

- RC: długość drutu poprawia się po zgięciu przegięciem w środku. Przegięcie ściska się, żeby skrócić drut, albo rozgina, żeby go wydłużyć. Źródła: [Flite Test – adjustable wire push rods](https://www.flitetest.com/articles/adjustable-wire-push-rods), [Model Airplane News – perfect Z-bends](https://www.modelairplanenews.com/tips-tricks-perfect-bends-august-2012/).
- Za krótkie zagięcie poprawia się, „przetaczając” je kombinerkami dalej w drut (to samo źródło MAN). Gięcie jest iteracyjne: gnij, przyłóż, popraw.

## 3. Rozwiązanie

### 3.1 Końce drutów: Z z długim środkiem (z review Opus W3)

- Środek Z **5 ± 2 mm** (dziś 2–2,5), ogon ≥ 5 mm. Wszystkie zagięcia na stole. Drut wkłada się w otwór, obracając go (klasycznie RC).
- Luz osiowy w otworze ok. 3 mm: przy uchu ok. ±1,9° błędu gałki (obliczenie Opus W3). Akceptowane.
- Kąty Z dobrane do kierunku drutu, nie 90° (Opus K1, W1):
  - S1: przy uchu ~90°, przy orczyku ~95°;
  - S2: przy uchu i przy orczyku ~**105°**;
  - powieki: wg modelu, do policzenia.
- Kąt sprawdza się próbą, a nie kątomierzem: drut włożony w orczyk przy gałce na wprost ma trafić w otwór ucha bez naciągania. Jeśli nie trafia, doginasz.
- Kształt jest przestrzenny (Opus W2): w S1 i powiekach nogi przy obu końcach są do siebie **prostopadłe**, w S2 równoległe. Rysunek pokazuje to w dwóch rzutach.

### 3.2 Długość: przegięcie regulacyjne

- Każdy drut (S1, S2, PG, PD) ma w środkowej części V z ramion 5 mm. Nominalnie ramiona pod 45°: skraca to drut o 2,9 mm, a wierzchołek V wychodzi 3,5 mm w bok.
- Ściśnięcie do 60° skraca drut o kolejne **2,1 mm**, rozgięcie do 30° wydłuża o **1,6 mm**. To pokrywa błąd gięcia ±2 mm jednego zagięcia (obliczenie: ramiona 2 × 5 mm, długość w rzucie 10·cos α).
- Powieki: PG i PD regulowane każdy swoim V. Najpierw przez S3 ustawia się zero, przy którym zamyka się jedna powieka, potem V w drugim drucie, aż obie zamkną się razem.
- S1, S2: V daje zgrubną długość, a resztę ustawia zero w kalibracji ESP32.
- Wierzchołek V ma wychodzić w stronę wolnej przestrzeni. Do sprawdzenia w modelu: miejsce i kierunek V dla każdego drutu.

### 3.3 Miejsce wokół drutów (zmiany modelu po przyjęciu koncepcji)

- Cel: **≥ 2 mm** od osi drutu nominalnego (z V) do każdej części w całym zakresie ruchu. To daje miejsce na krzywy drut ±2 mm. Dziś (`40-cad/openscad/kolizje-v2.txt`):

| Para | Dziś | Do zrobienia |
|---|---|---|
| drut S1 – gałka | 0,42 | przesunąć S1 / korpus drutu na stronę +y (Opus W5), sprawdzić |
| drut S2 – gałka | 0,90 | jw. |
| drut PG – drut PD | 0,57 | rozsunąć przy orczyku S3 (np. dwa otwory w orczyku zamiast jednego Ø2,4) |
| druty powiek – własna powieka | 0,69–0,73 | kieszeń w czaszy za dźwignią (Opus K3) |
| druty powiek – S3 | 0,90 | jw. |
| druty powiek – Pierścień | 1,90 | jw. |

- Tam, gdzie 2 mm się nie zmieści, podać wartość i powód. Nie zgłaszać „mieści się” bez przemiatania.
- Ucho gałki: materiał pod otworem ≥ 2 ścieżki (`uchoDol` ≥ 2,6; Opus K5, Astra p. 7).

### 3.4 Drut

- Długość na drut: L + 2 × (5 + 5) + ok. 3 (V) ≈ L + 23: S1 ~65, S2 ~66, PG/PD ~68 mm, razem ~27 cm + zapas na próby. Drut zgięty dotąd przez użytkownika: tylko na próby.

## 4. Montaż (dla użytkownika, na rysunku)

1. Zagięcie Z na jednym końcu, ze środkiem 5 mm.
2. Ten koniec włożyć w orczyk (orczyk zdjęty z serwa).
3. Przyłożyć drut do ucha i zaznaczyć markerem drugie zagięcie. Zgiąć Z, włożyć.
4. Gałka na wprost: jeśli drut ciągnie w bok, dogiąć kąt Z. Jeśli długość nie pasuje, ścisnąć lub rozgiąć V.
5. Kalibracja ESP32: zero S1 i S2. Powieki: zero S3 na jedną powiekę, potem V drugiego drutu.

## 5. Ryzyka do review

- V wychodzi 3,5–4,3 mm w bok: czy jest gdzie, zwłaszcza przy drutach powiek?
- Czy V w drucie przenosi pchanie bez wyboczenia: drut sprężynowy, 42 mm, siła mała; do sprawdzenia rachunkiem.
- Czy próba „wolny koniec trafia w otwór” wystarcza do ustawienia kątów 105° przy S2.
