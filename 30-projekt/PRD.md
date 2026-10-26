# PRD – Dynia z ruchomymi oczami (Halloween 2026)

Wersja 0.2, 25.10.2026 (0.1: 23.10; 0.2: podstawka wykonana i szufladka v2). Źródło: rozmowa użytkownika z PM (Claude). **Funkcję zmienia tylko użytkownik.** Zmiana techniczna, która zmienia funkcję, wraca do użytkownika do decyzji. Ten plik ma pierwszeństwo przed briefami i koncepcjami z 18–23.10.

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
| Napęd powiek | **Każda powieka na własnym serwie (wariant C, decyzja użytkownika 25.10)** – obie ruchome i niezależne; drut zaczepiony w uszku na tylnej krawędzi czaszy, ok. 34 mm od osi; drukowane przedłużenie orczyka 25 mm, pełne otwarcie ok. 51,5° |
| Serwa | **4 × MG90S**: lewo–prawo, góra–dół, powieka górna, powieka dolna |
| Otwór w dyni | ≤ Ø80; z zewnątrz prosty rant ≤ 2 mm poza otwór |
| Montaż | skręcane i kalibrowane na stole; **moduł wkładany od środka dyni** (tuba w otworze, kołnierz z łapami od środka, wkręty do drewna 4 × 30–40 w miąższ), z zewnątrz **maskownica** krawędzi otworu ≤ 2 mm poza otwór (zmiana użytkownika 24.10, zastępuje wcisk od zewnątrz); nic ponad to bez uzasadnienia |
| Wyjmowanie | mile widziane, nie wymagane – odpada, jeśli komplikuje (zastosowanie praktycznie jednorazowe) |
| Kolor | mechanizm pomarańczowy, gałka biała |
| Druk | do niedzieli wieczorem tylko A1 mini – każda część ≤ 180 mm |

**Mechanizm referencyjny:** [The Face maker101 (PCBWay)](https://www.pcbway.com/project/shareproject/The_Face_maker101_c4124445.html) – gałka na kardanie, nieruchome MG90S za okiem, pręty pchające gałkę. Projektant bierze z niego zasadę i przenosi ją na gałkę Ø60 i otwór Ø80, **bez dodatków**. Każdy element spoza referencji wymaga uzasadnienia.

**Wzór (26.10):** model v3: `40-cad/openscad/duze-oko-v3.scad`, pliki `40-cad/3mf/Duze oko v3/`; źrenica ≤ Ø20, gałka 24 mm przed rantem, czasza ok. 111° (użytkownik 26.10). Wcześniejsze ustalenie – adaptacja referencji, synteza `20-analizy/2026-10-25-referencja-face-maker101-synteza.md`: jedna płyta serw, **jeden przegub gałki – kardan 5/5 w środku kuli**, pręty z drutu bez przegubów, zawias powiek na słupkach płyty. Gałka od tyłu głębsza niż w referencji, do ok. 120° od przodu (otwór tylny ok. Ø52, kardan przy ±35° potrzebuje ok. Ø48), żeby przy wychyleniu w otworze nie było widać krawędzi czaszy; jeśli zaczepy prętów się nie zmieszczą – kształt jak w referencji (użytkownik 26.10). Model v9 (kardany 2/2 przy gałce, ramki serw) jest nieaktualny. **Tuba z kołnierzem drukowana z góry w 3 długościach** pokrywających ścianę dyni 28–50 mm (np. 30 / 40 / 50), żeby przy składaniu wybrać pasującą bez czekania na wydruk (użytkownik 26.10).

**Pręty:** drut Ø2 albo drukowane, najprostsze, co działa; bez przyrządów do gięcia, bez własnych drukowanych mini-kardanów na śrubach M2.

## 5. Elektronika i zasilanie

- ESP32-C3 + PCA9685: do 8 małych oczu + 4 serwa dużego oka (≤ 12 kanałów).
- **Tylko powerbank** (w szkole nie ma gniazdka): Baseus 20 000 mAh przez USB-C, zapas Manta. Wymiana albo podładowanie powerbanku bez wyjmowania elektroniki.
- **Podstawka pod dynią** (zmiana użytkownika 24.10, zastępuje pudełko w środku dyni): w niej powerbank i elektronika, kable do dyni przez otwór w dnie dyni, dynia (ok. 10 kg) przymocowana do podstawki od środka. **Powerbank wymieniany szufladką otwieraną do przodu (z tyłu stoją inne dynie), bez podnoszenia dyni; w szufladce tylko powerbank, USB-C wpinany ręcznie. Szufladka zabezpieczona śrubą przed otwarciem przez dzieci (użytkownik 25.10).** Elektronika (ESP32-C3, PCA9685) na stałe w podstawce, nie w szufladzie; **w dyni nie ma żadnego pudełka** – całe „pudełko” to podstawka; żadne kable nie wychodzą na zewnątrz. **Stan 25.10: dynia kupiona, podstawka z drewna wykonana** – dno sklejone ze ściankami, elektronika mocowana do dna, na końcu płyta górna 18 mm przykręcona 4 śrubami do dołu (wymiary wykonane niżej); dynia mocowana tuleją przez otwór Ø80 w środku dna (przykręcona do płyty, nakrętka od środka dyni), przez tuleję idą skrętki (zmiany użytkownika 25.10). Podstawa może być ze sklejki 18 lub 12 mm (użytkownik ma piłę stołową), druk tam, gdzie upraszcza. Powerbank Baseus 160 × 70 × 32 mm, na środku krótszej ścianki USB-C, obok 2 × USB-A. Szufladka i uchwyty elektroniki drukowane 3D; korpus podstawki może być ze sklejki.
- **Okablowanie skrętką Ethernet** (użytkownik ma kabel i zaciskarkę RJ45): jedna skrętka na grupę 3–4 małych oczu po jednej stronie, druga na drugą stronę, trzecia na duże oko. Rozłączne na łącznikach RJ45 gniazdo–gniazdo w dyni.
- **Podstawka – wymiary wykonane (pomiary użytkownika 25.10, mają pierwszeństwo przed modelem):** szerokość wnętrza **216 mm** (zmierzona przy froncie i z tyłu), wysokość wnętrza 40 mm, dno 9 mm, głębokość całkowita 226 mm, wysokość całkowita 69 mm (z sumy dno + wnętrze + płyta wychodzi 67; bez wpływu na szufladkę), wkręty płyty górnej 20 mm od frontu i od tyłu, otwór w płycie Ø60–61.
- **Szufladka v2 (użytkownik 25.10, zastępuje szufladkę jednoczęściową):**
  - korpus i front osobno, skręcane (2 × M4 rączki + 2 × M4 × 12 stożkowe przy dolnych rogach, łby równo z licem – użytkownik 26.10); korpus ≤ 215 mm szerokości;
  - rączka na froncie na wklejonych śrubach M4 (łeb okrągły, epoksyd, imbus), nakrętki od środka, z dala od powerbanku; kształt niski i nienachalny: ścięty ostrosłup z zaokrąglonymi krawędziami, na środku frontu; mała, bo używana raz–dwa razy (użytkownik 25.10);
  - blokada: śruba M4 na środku górnej krawędzi frontu, wkręcana w przednią krawędź płyty górnej (zastępuje M4 w prawym kołnierzu i prawej ściance);
  - PIR we froncie (niżej).
- Czujnik obecności: **PIR HC-SR501** (kupiony), we froncie szufladki po prawej stronie, nad pasem kabla USB-C (użytkownik 25.10): otwór Ø24 na kopułkę, od tyłu gniazdo 23,5 × 23,5 mm na kołnierz soczewki; płytka na 2 podkładkach 4 × 8 wys. 3,5 (szersze i wyższe po przymiarce, użytkownik 26.10), przykręcona 2 × M2 w rozstawie 28,5 (potwierdzone próbką); za płytką ≥ 10 mm miejsca (z przewodem wlutowanym; z wtykami Dupont ok. 20 mm). Potencjometry i zworkę ustawić przed montażem. Wymiary płytki (pomiar ze zdjęć 25.10): 32 × 24 × 1,5, kołnierz 22,97 (suwmiarka) × 3, kopułka 14 mm od płytki, otwory Ø2 w rozstawie ok. 28–29 mm.

## 6. Software

- **Spoczynek:** duże oko zamknięte, co ok. 5 s rusza się jedno małe oko.
- **Ktoś podchodzi (PIR):** rusza się więcej oczu, najwyżej 2 małe naraz; duże oko się otwiera i rozgląda.
- **Ruch „plastyczny”:** płynne przyspieszanie i hamowanie, sakady przeplatane spokojnym rozglądaniem, mruganie, przymykanie powiek zależnie od nastroju, powieka górna podąża za spojrzeniem.
- Strona w telefonie: efekty i kalibracja (jest).
- Duże oko na 4 serwach: powieki niezależne (decyzja 25.10, wraca do stanu ze starego firmware'u).
- Pilot później, jeśli starczy czasu (sam software).

## 7. Części i zasady

- **Tylko posiadane części:** MG90S × 4; kardany 5/5 × 2 (wkręty M4) i 2/2 × 2 (wkręty M3) – środek gałki 5/5, a jeśli za duży, 2/2 (wybiera projektant, z uzasadnieniem); śruby M3/M4/M5 8–50 mm z nakrętkami; druty sprężynowe Ø1,0 i Ø1,2, ocynkowany Ø2,0; łożyska 608-2RS i 6802-2RS. Bez zakupów modelarskich.
- Zasady z `AGENTS.md`: śruby z nakrętkami, DFAM, luzy z tabeli. **To, co PRD mówi wprost (4 serwa, drut, klej dozwolony, praca bez orkiestratora), ma pierwszeństwo przed ogólnymi zasadami `AGENTS.md`.**

## 8. Poza zakresem

- **Odporność na dzieci:** bez ograniczników na rękę, ochrony przekładni i wzmocnień „na wszelki wypadek”. Jak zepsują, to zepsują.
- Światło i dźwięk.
- Trwałość ponad czas wystawy; demontowalność kosztem złożoności.
- Pilot w pierwszym terminie.
- **„Duże oko v1”** (Onshape, 22–23.10, koncepcje v1–v3.2): porzucone, nic nie wydrukowano; tylko do wglądu. Zostają pomiary kardana 5/5, MG90S i orczyka (`30-projekt/e6-pomiary.md`).

## 9. Sposób pracy

- PM (Claude w rozmowie) prowadzi PRD i pilnuje zakresu. Bez orkiestratora i rund review wieloma agentami, chyba że użytkownik poprosi.
- **Prostota przed zakresem (użytkownik 25.10, po trzech iteracjach rozbudowy dużego oka):**
  - **Każdy dodatkowy przegub projektant omawia z użytkownikiem, zanim trafi do koncepcji.**
  - Referencja to górna granica złożoności. Każdy element ponad nią (przegub, dodatkowa część, śruba, ramka) projektant pokazuje użytkownikowi w koncepcji, ze szkicem, że się mieści. Bez akceptacji nie trafia do CAD.
  - Montaż rękami: każde miejsce, w którym coś się wkłada albo przykręca, ma dostęp dla palców i narzędzia (wkrętak, imbus po prostej). W koncepcji projektant opisuje kolejność montażu i drogę narzędzia.
  - Części montowane nie przechodzą obok siebie „na milimetr”. Konstrukcja, która działa tylko przy luzach rzędu 1 mm w ciasnym wnętrzu, jest za skomplikowana i wraca do uproszczenia.
- **Projektant pracuje w dwóch krokach:**
  1. **Wstępna koncepcja** (szkic albo prosta makieta, bez dopracowanych szczegółów): układ gałki, kardana, serw i powiek, co czym się rusza, lista części (drukowane i posiadane), główne wymiary i przyjęte założenia (np. wielkość źrenicy). Użytkownik akceptuje albo zawraca.
  2. **Dopiero po akceptacji** szczegóły i CAD.
- Otwarte: jak długo powerbank ma działać między wymianami.
