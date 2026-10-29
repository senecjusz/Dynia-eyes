# PRD – Dynia z ruchomymi oczami (Halloween 2026)

Wersja 0.3, 28.10.2026. Dokument opisuje, co ma powstać i jaki jest stan. Historia ustaleń, z datami i uzasadnieniem, jest w `30-projekt/decyzje.md`.

**Funkcję zmienia tylko użytkownik.** Jeśli zmiana techniczna zmienia funkcję, decyduje użytkownik. Ten plik ma pierwszeństwo przed briefami i koncepcjami.

## 1. Cel i termin

- Prawdziwa dynia z ruchomymi oczami, robiona z synem, na wystawę w szkole.
- Dynia ma być w szkole **w czwartek 29.10 rano**. Stoi tam kilka dni, także 31.10.
- **Na szkołę: 4 małe oczy w ruchu** (lewa skrętka, kanały 0–3), czujnik ruchu PIR i przycisk blokady (decyzja użytkownika 29.10 w nocy: „Zostaną tylko cztery. Nie dam rady zrobić to”). Pozostałe oczy i duże oko po terminie. **Duże oko nie będzie gotowe na czwartek** (użytkownik 28.10); zostaje do dokończenia po terminie. Strona w telefonie też po terminie.
- **Zasada na finiszu:** nie drukujemy ponownie dużych części (płyty dużego oka, gałki, tacki elektroniki, elementów podstawki). Problemy rozwiązujemy na tym, co już jest wydrukowane, albo małą częścią, która drukuje się szybko.

## 2. Skład

- 8 małych oczu: 4 po lewej stronie, 3 po prawej, rozłożone niesymetrycznie także na boki dyni, i 1 na środku frontu. Rozmieszczenie: `20-analizy/2026-10-28-rozstaw-oczu.md`.
- Duże oko po terminie trafi na środek frontu w miejsce środkowego małego oka (otwór rozwiercony na Ø80); odstępy w rozmieszczeniu to przewidują.
- Drewniana podstawka pod dynią, a w niej powerbank i elektronika.

## 3. Małe oczy (gotowe)

- Moduł v2.8: oko z piłeczki pingpongowej porusza się w lewo i w prawo o ±25°. Instrukcja: `70-budowa/montaz-v2.8.md`.
- Złożonych i skalibrowanych jest 8 modułów; wszystkie trafiają do dyni. Mają wspólne ustawienia serwa: środek 1500 µs, skrajne prawo 1100 µs, skrajne lewo 1800 µs. Ustawienia są zapisane w pamięci ESP i w `50-elektronika/kalibracja-oczu.md`.
- Zostaje montaż modułów w dyni i podłączenie.

## 4. Duże oko

### Wymagania

| Funkcja | Wymaganie |
|---|---|
| Gałka | kula Ø60, biała, gładka; tęczówkę rysuje syn; źrenica najwyżej Ø20; gałka wystaje 24 mm przed rant tuby; czasza sięga ok. 111° od przodu |
| Ruch lewo–prawo | cel ±35°, minimum ±30° |
| Ruch góra–dół | cel ±25°, minimum ±20° |
| Ruch po skosie | gdy obie osie wychylają się naraz, zakres może być mniejszy |
| Powieki | górna i dolna, każda na własnym serwie, niezależne; od pełnego zamknięcia do pełnego otwarcia; otwarte nie zasłaniają źrenicy |
| Serwa | 4 × MG90S: lewo–prawo, góra–dół, powieka górna, powieka dolna |
| Otwór w dyni | najwyżej Ø80; maskownica wystaje najwyżej 2 mm poza otwór |
| Mocowanie w dyni | moduł wkładany od środka dyni w tubę i podparty od dołu dwoma wspornikami przyklejonymi do tuby; tuba ma kołnierz z 8 łapami przykręcony od środka wkrętami do drewna; od zewnątrz maskownica zakrywa krawędź otworu |
| Kolory | mechanizm pomarańczowy, gałka biała |
| Prostota | wzorem jest mechanizm The Face (maker101, PCBWay); nic ponad niego bez zgody użytkownika (§9) |

### Jak jest zbudowane

Model: `40-cad/openscad/duze-oko-v3.scad`. Pliki do druku: `40-cad/3mf/Duze oko v3/`. Instrukcja montażu z obrazkami: `40-cad/openscad/duze-oko-v3-montaz.md` i `.html`.

- **Płyta** trzyma 4 serwa. Z przodu ma słupek, na którym siedzi gałka, i dwa ramiona z zawiasem powiek.
- **Gałka** obraca się na metalowym przegubie krzyżakowym (kardan 5/5), który siedzi w środku kuli.
  - Kardan ma z obu stron gładki otwór Ø5,05–5,1 o głębokości 7 mm (wykorzystujemy 6 mm). Trzpień w otworze dociska boczny wkręt bez łba.
  - Trzpienie kardana to małe części drukowane z kołnierzem, wklejone w gniazda gałki i słupka. W środku każdego jest stalowa śruba M3 × 10 z łbem grzybkowym, która usztywnia trzpień.
- **Pręty** popychają gałkę od serw lewo–prawo i góra–dół. Są z drutu sprężynowego Ø1, z końcami zagiętymi w kształt „Z” kombinerkami: odcinek środkowy ok. 7 mm, końcówka ok. 2 mm.
- **Powieki** to dwie czasze na wspólnej osi. Oś to wkręt M2 × 6, wkręcony w powiekę dolną; przez słupek i powiekę górną przechodzi luźno.
  - Każdą powiekę ciągnie drut Ø1 z własnego serwa. Drut jest zaczepiony w uszku na tylnej krawędzi powieki, a jego końcówka przy uszku jest zagięta w stronę serwa.
  - Na orczyki serw powiek nakłada się drukowane przedłużenie z rowkiem na ramię orczyka.
- **Kable serw** wychodzą po tej samej stronie co wałek. Przy serwach powiek kable przechodzą przez dwie wnęki 4 × 8 mm, wycięte ręcznie w krawędzi płyty.
- **Tuba** wchodzi w otwór w dyni. Jest w trzech długościach (30, 40 i 50 mm); drukuje się tę, która pasuje do grubości ściany dyni. Kołnierz ma 8 łap co 45° (łapę, która w czymś przeszkadza, można pominąć). W tylnym końcu tuby ścianka zamyka dół otworu.
- **Wsporniki płyty** (2 sztuki, w kształcie L, w tej samej długości co tuba) są przyklejone na gorąco do ścianki i kołnierza tuby. Płyta leży na ich półkach i jest do nich przyklejona. Tak cały moduł ma podparcie od dołu, a nie wisi na samych ramionach.

### Stan (28.10)

- Wydrukowane: płyta, gałka, trzpienie kardana, maskownica.
- Do druku: obie powieki z powiększonymi uszkami, przedłużenia orczyków, jedna tuba z 8 łapami i para wsporników w tej samej długości.
- Gałka chodzi na sprzęcie w obu osiach. Ruch lewo–prawo lekko ściąga gałkę w pionie. Program ma to wyrównywać, a wielkość poprawki trzeba ustalić na sprzęcie.
- Powieki zostaną skalibrowane po montażu.

## 5. Elektronika i zasilanie

### Podstawka

- Drewniana podstawka pod dynią. Mieści powerbank w szufladce i elektronikę na stałe. W dyni nie ma żadnego pudełka i żadne kable nie wychodzą na zewnątrz.
- **Wymiary wykonane** (pomiar użytkownika, mają pierwszeństwo przed modelem):
  - szerokość wnętrza 216 mm, wysokość wnętrza 40 mm;
  - dno 9 mm, płyta górna 18 mm;
  - głębokość całkowita 226 mm, wysokość całkowita ok. 69 mm;
  - w środku płyty górnej otwór Ø60–61 na kable.
- **Szufladka** otwiera się do przodu, bo z tyłu stoją inne dynie. Mieści tylko powerbank: Baseus 20 000 mAh (160 × 70 × 32 mm), zapasowy Manta. Wtyk USB-C wpina się ręcznie. Front jest przykręcony do korpusu szufladki, ma małą rączkę i jest blokowany śrubą M4 wkręcaną w płytę górną (przed dziećmi).
- **Mocowanie dyni do podstawki:** tuleja z gwintem, przykręcona kołnierzem do płyty górnej nad otworem na kable. Wchodzi przez otwór w dnie dyni, a od środka dyni dokręca się nakrętkę. Przez tuleję idą skrętki do oczu.
  - Pliki: `40-cad/3mf/Podstawka v2/Tuleja z gwintem.3mf` i `Nakretka.3mf`.
  - **Otwór w dnie dyni: otwornica 60**, tak jak w płycie. Tuleja ma gwint Ø59, czyli 0,5 mm luzu na stronę: wchodzi ręką, bez dużego luzu. Nakrętka ma 0,20 mm luzu gwintu. Ścianka pod gwintem 3 mm, przelot na kable Ø49 (wtyki RJ45 przeciąga się pojedynczo), wysokość 78 mm, gwint na całej wysokości.

### Elektronika

- ESP32-C3 i sterownik serw PCA9685 na tacce w podstawce. Instrukcja montażu: `50-elektronika/montaz-elektroniki.md`.
- Na tacce:
  - ESP stoi na słupkach podniesionych o 7 mm doklejonymi podkładkami, żeby zmieściły się pod nim wtyki Dupont;
  - rezystor 47 Ω / 3 W, który obciąża powerbank, żeby się nie wyłączał, siedzi wysoko na dwóch słupkach, z dala od plastiku, żeby mógł się chłodzić. Program włącza go tranzystorem IRLZ44N na 1 s co 10 s (tranzystor zamówiony przez użytkownika);
  - kondensator 470 µF leży poziomo.
- **Kanały PCA9685:**
  - małe oczy po lewej: 0–3; po prawej: 4–6; środkowe: 7 (czwarte serwo prawej skrętki, więc obie skrętki mają po 4 serwa);
  - duże oko: 12 lewo–prawo, 13 góra–dół, 14 powieka górna, 15 powieka dolna.
  - Pinout: `50-elektronika/polaczenia.md`.
- **Okablowanie:** skrętki Ethernet rozłączane w dyni na gniazdach keystone RJ45: lewa strona (4 serwa) i prawa strona z okiem środkowym (4 serwa); trzecia skrętka do dużego oka dojdzie po terminie. Po stronie PCA żyły są przylutowane do wtyczek odciętych z serw, po stronie oczu do przewodów serw.
- **PIR HC-SR501** jest we froncie szufladki, po prawej stronie. Przewód ma zapas ok. 150 mm, żeby szufladka mogła się wysunąć.
- **Przycisk:** jeden, chwilowy, PBS-33B, wklejony w otwór Ø12 w prawym boku podstawki, blisko tyłu.
  - Przytrzymanie przez 5 s blokuje dynię: duże oko staje na środku, powieki się otwierają, wszystkie serwa stoją. To jest tryb do rysowania tęczówek.
  - Ponowne przytrzymanie przez 5 s przywraca pracę.
  - Po włączeniu prądu dynia zawsze startuje w zwykłej pracy.
  - Całkowite wyłączenie: wypięcie USB-C w szufladce.

## 6. Software

Program: `50-elektronika/dynia-v2`.

- **Spoczynek:** duże oko zamknięte, co ok. 5 s rusza się jedno małe oko.
- **Ktoś podchodzi (PIR):** rusza się więcej oczu, najwyżej 2 małe naraz; duże oko się otwiera i rozgląda.
- **Ruch naturalny:** płynne przyspieszanie i hamowanie, szybkie skoki spojrzenia na przemian ze spokojnym rozglądaniem, mruganie, powieka górna podąża za spojrzeniem.
- Program steruje 8 małymi oczami. Gałka dużego oka jest w programie, powieki zostaną dodane po kalibracji.
- Po terminie: strona w telefonie do efektów i kalibracji, pilot.

## 7. Części

- **Używamy tylko części, które użytkownik ma.** Niczego nie zamawiamy i nie kupujemy w sklepie.
- **Pełna lista wszystkiego do złożenia jest w `30-projekt/lista-hardware.md`.** Użytkownik zaznacza w kolumnie „Mam?”, co ma. Każda śruba, drut i część w instrukcji musi być na tej liście potwierdzona, zanim część pójdzie do druku.
- Śruby potwierdzone: M5 × 16 stożkowe, M4 × 12 stożkowe, M4 × 8 z łbem walcowym, M3 × 10 z łbem grzybkowym, M2 × 5, M2 × 6.
- Inne posiadane części: MG90S × 4, kardany 5/5 × 2 i 2/2 × 2, drut sprężynowy Ø1 i Ø1,2, łożyska 608-2RS i 6802-2RS.
- Dozwolone są klej i śruby. Szczegółowe zasady konstrukcyjne są w `AGENTS.md`. To, co mówi ten plik, ma przed nimi pierwszeństwo.

## 8. Poza zakresem

- Zabezpieczenia przed dziećmi ponad blokadę szufladki: bez ograniczników, osłon i wzmocnień „na wszelki wypadek”.
- Światło i dźwięk.
- Trwałość dłuższa niż czas wystawy.
- Pilot w pierwszym terminie.
- Wyjmowanie dużego oka z dyni: mile widziane, ale nie kosztem prostoty.

## 9. Sposób pracy

- **Użytkownik rozmawia bezpośrednio z sesjami obszarów:** duże oko, montaż, elektronika, kalibracja. Kto co robi i na której gałęzi, opisuje `30-projekt/sesje.md`.
- **PM jest koordynatorem.** Nie wydaje sesjom poleceń. Zbiera ustalenia do tego pliku, do `decyzje.md`, planu i listy części, a użytkownikowi zgłasza sprzeczności i braki.
- **Stan projektu zawsze jest w gicie, wypchnięty na GitHuba.** Po zmianie konta Claude historia rozmów znika, więc z repo musi dać się wznowić pracę.
- **Prostota:**
  - każdy dodatkowy przegub albo część ponad wzór (The Face) najpierw omawiamy z użytkownikiem;
  - wszystko da się złożyć rękami: palce i narzędzie mają dostęp do każdego miejsca, w którym coś się wkłada albo przykręca;
  - części nie mijają się „na milimetr”.
- Zmiany pokazujemy użytkownikowi przed commitem. Commit dopiero po jego „ok”.

## 10. Otwarte

- Jak długo powerbank ma działać między wymianami.
