# PRD – Dynia z ruchomymi oczami (Halloween 2026)

Wersja 0.1, 23.10.2026. Źródło: rozmowa użytkownika z PM (Claude). **Funkcję zmienia tylko użytkownik.** Zmiana techniczna, która zmienia funkcję, wraca do użytkownika do decyzji. Ten plik ma pierwszeństwo przed briefami i koncepcjami z 18–23.10.

## 1. Cel i termin

- Prawdziwa dynia z ruchomymi oczami na wystawę **w szkole**, robiona z synem.
- **Dynia w szkole w środę 28.10**, stoi kilka dni (także 31.10). Większość gotowa do niedzieli 25.10.

## 2. Skład

- Duże oko na środku frontu, małe oczy po bokach.
- Małych oczu wydrukowanych 8; ile trafi do dyni, użytkownik decyduje po zakupie dyni.

## 3. Małe oko (gotowe)

- Konstrukcja v2.7/v2.8 bez zmian, ruch lewo–prawo ±25°.
- Zostaje złożenie i kalibracja pozostałych sztuk.

## 4. Duże oko (projekt od nowa)

| Funkcja | Wymaganie |
|---|---|
| Gałka | Ø60, biała, gładka; tęczówkę rysuje syn; dopuszczalne wgłębienie zera Ø3 |
| Lewo–prawo | cel ±35°, minimum ±30° |
| Góra–dół | cel ±25°, minimum ±20° |
| Narożniki | pełny zakres każdej osi przy drugiej w środku; w narożnikach (obie osie naraz) zakres elastyczny, mniejszy dopuszczalny |
| Powieki | od pełnego zamknięcia do pełnego otwarcia; **całkowicie otwarte** nie zasłaniają źrenicy w zakresie ruchu (nie dotyczy mrugania i przymykania); wielkość źrenicy projektant przyjmuje jako założenie do akceptacji użytkownika |
| Napęd powiek | **A: obie powieki na jednym serwie.** Jeśli A się nie mieści – **B (dolna nieruchoma, rusza się tylko górna)**, zatwierdzone przez użytkownika z góry 24.10. C (osobne serwo na powiekę) tylko za zgodą użytkownika |
| Serwa | MG90S: 3 (A, B) albo 4 (C) |
| Otwór w dyni | ≤ Ø80; z zewnątrz prosty rant ≤ 2 mm poza otwór |
| Montaż | skręcane i kalibrowane na stole; **moduł wkładany od środka dyni** (tuba w otworze, kołnierz z łapami od środka, wkręty do drewna 4 × 30–40 w miąższ), z zewnątrz **maskownica** krawędzi otworu ≤ 2 mm poza otwór (zmiana użytkownika 24.10, zastępuje wcisk od zewnątrz); nic ponad to bez uzasadnienia |
| Wyjmowanie | mile widziane, nie wymagane – odpada, jeśli komplikuje (zastosowanie praktycznie jednorazowe) |
| Kolor | mechanizm pomarańczowy, gałka biała |
| Druk | do niedzieli wieczorem tylko A1 mini – każda część ≤ 180 mm |

**Mechanizm referencyjny:** [The Face maker101 (PCBWay)](https://www.pcbway.com/project/shareproject/The_Face_maker101_c4124445.html) – gałka na kardanie, nieruchome MG90S za okiem (lewo–prawo, góra–dół), pręty pchające gałkę, **jedno serwo na powieki**; części: gałka, powieka, uchwyt oka i serw, kardan, listwy. Projektant bierze z niego zasadę (kardan, nieruchome serwa, pręty) i przenosi ją na gałkę Ø60, kardan użytkownika i otwór Ø80, **bez dodatków**; z opisu referencji nie widać, jak jedno serwo rusza górną i dolną powiekę – projektant pokazuje to na koncepcji. Każdy element spoza referencji wymaga uzasadnienia.

**Pręty:**
- domyślnie **drukowane** (dokładna długość z modelu);
- końcówki muszą pozwolić na lekkie przechylenie (punkt na gałce nie porusza się w jednej płaszczyźnie): luźny otwór z kołkiem lub śrubą z luzem, drukowany przegub kulowy albo krótki odcinek drutu na końcówce – najprostsze, co działa;
- **drut dopuszczony, jeśli wyraźnie upraszcza model** (projektant mówi, co oszczędza). Wtedy dokładna specyfikacja: średnica, długości, kąty gięcia i rysunek 1:1 albo przyrząd do gięcia. Użytkownik gnie w warsztacie (imadło, kowadło);
- **bez własnych drukowanych mini-kardanów na śrubach M2.**

## 5. Elektronika i zasilanie

- ESP32-C3 + PCA9685: do 8 małych oczu + 3–4 serwa dużego oka (≤ 12 kanałów).
- **Tylko powerbank** (w szkole nie ma gniazdka): Baseus 20 000 mAh przez USB-C, zapas Manta. Wymiana albo podładowanie powerbanku bez wyjmowania elektroniki.
- **Podstawka pod dynią** (zmiana użytkownika 24.10, zastępuje pudełko w środku dyni): w niej powerbank i elektronika, kable do dyni przez otwór w dnie dyni, dynia (ok. 10 kg) przymocowana do podstawki od środka. **Powerbank wymieniany szufladką z tyłu, bez podnoszenia dyni.** Podstawa może być ze sklejki 18 lub 12 mm (użytkownik ma piłę stołową), druk tam, gdzie upraszcza. Powerbank Baseus 160 × 70 × 32 mm, na środku krótszej ścianki USB-C, obok 2 × USB-A.
- Czujnik obecności: **PIR** (użytkownik sprawdzi, czy jest w warsztacie).

## 6. Software

- **Spoczynek:** duże oko zamknięte, co ok. 5 s rusza się jedno małe oko.
- **Ktoś podchodzi (PIR):** rusza się więcej oczu, najwyżej 2 małe naraz; duże oko się otwiera i rozgląda.
- **Ruch „plastyczny”:** płynne przyspieszanie i hamowanie, sakady przeplatane spokojnym rozglądaniem, mruganie, przymykanie powiek zależnie od nastroju, powieka górna podąża za spojrzeniem.
- Strona w telefonie: efekty i kalibracja (jest).
- **Do zmiany:** duże oko z 4 niezależnych serw na wariant A (powieki na jednym serwie).
- Pilot później, jeśli starczy czasu (sam software).

## 7. Części i zasady

- **Tylko posiadane części:** MG90S × 4; kardany 5/5 × 2 (wkręty M4) i 2/2 × 2 (wkręty M3) – środek gałki 5/5, a jeśli za duży, 2/2 (wybiera projektant, z uzasadnieniem); śruby M3/M4/M5 8–50 mm z nakrętkami; druty sprężynowe Ø1,0 i Ø1,2, ocynkowany Ø2,0; łożyska 608-2RS i 6802-2RS. Bez zakupów modelarskich.
- Zasady z `AGENTS.md`: śruby z nakrętkami, DFAM, luzy z tabeli. **To, co PRD mówi wprost (3 serwa, drut, praca bez orkiestratora), ma pierwszeństwo przed ogólnymi zasadami `AGENTS.md`.**

## 8. Poza zakresem

- **Odporność na dzieci:** bez ograniczników na rękę, ochrony przekładni i wzmocnień „na wszelki wypadek”. Jak zepsują, to zepsują.
- Światło i dźwięk.
- Trwałość ponad czas wystawy; demontowalność kosztem złożoności.
- Pilot w pierwszym terminie.
- **„Duże oko v1”** (Onshape, 22–23.10, koncepcje v1–v3.2): porzucone, nic nie wydrukowano; tylko do wglądu. Zostają pomiary kardana 5/5, MG90S i orczyka (`30-projekt/e6-pomiary.md`).

## 9. Sposób pracy

- PM (Claude w rozmowie) prowadzi PRD i pilnuje zakresu. Bez orkiestratora i rund review wieloma agentami, chyba że użytkownik poprosi.
- **Projektant pracuje w dwóch krokach:**
  1. **Wstępna koncepcja** (szkic albo prosta makieta, bez dopracowanych szczegółów): układ gałki, kardana, serw i powiek, co czym się rusza, lista części (drukowane i posiadane), główne wymiary i przyjęte założenia (np. wielkość źrenicy). Użytkownik akceptuje albo zawraca.
  2. **Dopiero po akceptacji** szczegóły i CAD.
- Otwarte (nie blokuje koncepcji dużego oka): jak długo powerbank ma działać między wymianami; czy PIR jest w warsztacie.
