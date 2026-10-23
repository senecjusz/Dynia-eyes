# Review briefu E6.1 (Fable, 22.10.2026): koncepcja dużego oka 2c

Recenzent: Fable, tylko do odczytu. Brief recenzji: `20-analizy/review/brief-review-e6-brief-koncepcji.md`. Oceniany plik: `30-projekt/brief-e6-duze-oko-koncepcja.md` (62 linie, niezacommitowany). Każda uwaga ma wagę (KRYTYCZNE / WAŻNE / DROBNE), miejsce w briefie, scenariusz porażki, konkretną poprawkę tekstu i pewność.

## Co sprawdziłem

- Brief wobec cytatów użytkownika z 22.10 (brief recenzji) i „Zasad współpracy” z `30-projekt/przekazanie-2026-10-21.md`.
- Repo: `AGENTS.md`, `30-projekt/decyzje.md`, `opis.md`, `teraz.md`, `stan-projektu.md`, `plan-realizacji.md`, `50-elektronika/sprzet.md`, `polaczenia.md`, `70-budowa/dziennik.md`, `20-analizy/2026-10-18-duze-oko-jedna-noc.md`, `2026-10-18-prezentacja-w-szkole.md`, `2026-10-17-pudelko-elektroniki.md`, `2026-10-17-mocowanie-malego-oka.md`, `2026-10-17-modul-malego-oka-wymiary.md`, `2026-10-17-mocowanie-pileczki-sruby.md`, `2026-10-17-mechanizm-oka/README.md` i `whitepaper.md`, `2026-10-22-powerbank-a/b`, `10-inspiracje/*.md`.
- Rachunki własne (niżej): łańcuch promieni gałka → powieki → rura → otwór Ø80; masy; momenty na serwach; kinematyka cięgien z analizy 18.10; statyka bez zasilania.

## Rachunki pomocnicze

**R1. Czy Ø60 + powieki mieszczą się w Ø80** (powieki wewnątrz rury, jak w analizie 18.10; luz powieka–gałka 1,2 i rant powieki 3,5 z researchu 2.3; luz powieka–rura 0,5 z tabeli `AGENTS.md`; ścianka rury 2,0; łeb osi powieki ISO 7380 M3 1,65):

| Gałka | Powieka wewn. | Rant powieki | + luz 0,5 | + ścianka rury | Ø rury | Ø z łbami osi | Luz na stronę w Ø80 (z łbami) |
|---|---|---|---|---|---|---|---|
| Ø55 | 28,7 | 32,2 | 32,7 | 34,7 | 69,4 | 72,7 | 3,65 |
| **Ø60** | 31,2 | 34,7 | 35,2 | 37,2 | **74,4** | **77,7** | **1,15** |
| Ø62 | 32,2 | 35,7 | 36,2 | 38,2 | 76,4 | 79,7 | 0,15 |
| Ø65 | 33,7 | 37,2 | 37,7 | 39,7 | 79,4 | 82,7 | −1,35 |

Wniosek: Ø60 jest praktyczną górną granicą dla układu „powieki w rurze”; Ø62 już nie przechodzi z łbami. Analiza 18.10 ma rurę wewn. Ø70 (R35) przy rancie powieki R34,7, czyli luz 0,3 < 0,5 z tabeli.

**R2. Masy** (PLA 1,24 g/cm³): gałka czasza 210°, R30, ścianka 2: 13,3 cm³ = **16,5 g**; powieka ≈ ¼ sfery R32,3 × 2,2: 7,2 cm³ = **9 g** (×2); rura Ø76 × 45 mm: ścianka 2 → 26 g, ścianka 3 → 38 g; płyta serw ~15 g; 3 × MG90S 40 g. Całość **ok. 130–150 g** z serwami. To punkt odniesienia dla „lekko”.

**R3. Momenty.** Mrugnięcie powieki 9 g o 75° w 0,12 s: I ≈ m·R² = 9,4·10⁻⁶ kg·m², α ≈ 4θ/t² = 364 rad/s² → **3,4·10⁻³ N·m**; MG90S 2,2 kg·cm = 0,216 N·m (zapas ~60×). Grawitacja na gałce bez zasilania: środek masy czaszy 210° leży 11,1 mm przed środkiem kuli; przy pochyleniu 15° moment **4,7·10⁻⁴ N·m**, przy 25° 7,6·10⁻⁴ – dużo poniżej tarcia przekładni serwa bez impulsu.

**R4. Cięgna z analizy 18.10 („punkt X na osi poziomej, punkt Y na pionowej, zwykłe śruby w luźnym otworze, bez przegubów kulowych”).** Punkt X nie przesuwa się przy pochylaniu, ale śruba w nim obraca się razem z gałką: przy pochyleniu 15° oś śruby odchyla się o 15° od osi oczka cięgna. Na oczku grubości 3 mm to mimośród 3·sin 15° = **0,78 mm** (10°: 0,52; 20°: 1,03) wobec luzu Ø3,3 − 3,0 = **0,3 mm**. Cięgno nie może tego skompensować obrotem wokół własnej osi (oś śruby po stronie gałki leży w płaszczyźnie y–z, oś oczka cięgna w płaszczyźnie x–y), ani przechyłem (wtedy ten sam mimośród pojawia się przy orczyku). Układ **zakleszcza się** poza ~±5°. Cogley w EyeMech używa tu przegubów kulowych, a w „Simplified” kołyski (serwo X jedzie na pochylanej podstawie).

## KRYTYCZNE

**K1. „Znane błędy analizy 18.10” nie zawierają błędu kinematycznego cięgien (R4), a brief wskazuje 18.10 jako punkt wyjścia.** Miejsce: „Przeczytaj najpierw” pkt 2 i sekcja „Znane błędy i luki analizy z 18.10”. Scenariusz: realizator przejmuje „2 cięgna wzdłużne na zwykłych śrubach” jako „zasadę Cogleya” (tak pisze 18.10), recenzenci dostają koncepcję, w której mechanizm zacina się przy pochyleniu > 5°, albo wychodzi to dopiero na wydruku. Wymóg „sprawdzone mechanizmy” nie chroni, bo 18.10 fałszywie przypisuje ten pomysł Cogleyowi. Poprawka, dopisać do listy błędów: „Cięgna gałki: punkt na osi jednego obrotu nie znosi obrotu śruby w drugiej osi – przy ±15° mimośród na oczku 3 mm to 0,78 mm wobec luzu 0,3; cięgno z dwoma zwykłymi śrubami się zakleszcza. Potrzebny przegub o 2 stopniach swobody na co najmniej jednym końcu każdego cięgna (przegub kulowy jak u Cogleya, drukowane widełki + sworzeń poprzeczny, oczko w podłużnym rowku) albo architektura kołyski (Cogley V2 Simplified: serwo lewo–prawo pochyla się razem z gałką). Podaj, co z tego bierzesz i policz kąt skosu w całym zakresie.” Pewność: wysoka co do geometrii, średnia co do tego, czy realizator by to skopiował.

## WAŻNE

**W1. „Lekko i cienko” bez miary.** Miejsce: twarde wymaganie 2. Użytkownik powiedział „nie tak ciężkiego mechanizmu … lżejsze (cieńsze)”, czyli mówił o zewnętrznym mocowaniu i kasecie, nie o gramach. Brief przerabia to na „podaj masę każdej części”, ale nie daje ani progu, ani definicji. Scenariusz: realizator mierzy „lekkość” gramami, tnie ścianki do 1,2–1,6 mm (tabela researchu dla małych oczu) i łamie decyzję 18.10 „ścianki ≥ 2–2,4 mm, cienkie elementy niedopuszczalne”, której brief nigdzie nie powtarza; albo odwrotnie: zostawia nakrętkę, bo „masa i tak mała”. Poprawka: „Lekko = bez gwintu, Nakrętki i Kasety wsuwanej w gniazdo; mocowanie z co najwyżej 2 części drukowanych; wszystko, co trzyma oko w dyni, ma grubość ≤ 3 mm poza rantem. Masa to liczba do porównania wariantów, nie cel: orientacyjnie całość z 3 serwami ok. 130–150 g (rachunek: gałka 16 g, powieki 2 × 9 g, rura 26 g, płyta 15 g, serwa 40 g). Ścianki części nośnych ≥ 2,0 mm, powiek 2,2–2,4 mm z rantem 3,5 (decyzja 18.10, research 2.3); cieńsze nie przechodzą.” Pewność: wysoka.

**W2. Nie powiedziano, co wolno robić w dyni.** Miejsce: twarde wymaganie 1 („resztę wkłada się od środka dyni … albo montuje od środka”) i „Montaż na stole, nie w rurze”. Te dwa zdania czyta się sprzecznie. Scenariusz A: realizator bierze „montaż na stole” dosłownie, cały moduł z serwami przechodzi przez Ø80 od zewnątrz, i musi coś od środka trzymać oko bez nakrętki – tu brakuje mu informacji o dostępie (otwór wieczka ≥ 110 mm wg `pudelko-elektroniki.md`, ręka dorosłego, ciemno i mokro). Scenariusz B: realizator dzieli moduł na dwie części łączone w dyni i wraca do tego, co użytkownik uznał za niewykonalne 20.10 (skręcanie w rurze). Poprawka: „W dyni wolno: wsunąć moduł przez otwór Ø80 od zewnątrz i od środka zabezpieczyć go ≤ 3 ruchami (zacisk, klin, śruba do dokręcenia wkrętakiem) przez otwór wieczka ≥ 110 mm, bez patrzenia na to, co się robi. W dyni nie wolno: łączyć przegubów, nasadzać orczyków, wpinać cięgien, kalibrować. Jeśli serwa nie przechodzą przez Ø80 razem z gałką, płytę serw przykręca się od środka ≤ 3 śrubami M3 do rury i to jest jedyne dopuszczalne łączenie w dyni; cięgna muszą być wtedy już wpięte albo wpinane bez narzędzi jednym ruchem.” Pewność: wysoka.

**W3. Brak horyzontu czasowego.** Miejsce: cały brief. W repo: Halloween 31.10 (`plan-realizacji.md`), wiercenie dyni 27.10 (plan z 17.10, nieaktualizowany), 18.10 „duże oko próbujemy w tym roku”, 21.10 „użytkownik nie ma dyni i na razie nie planuje testu w dyni”, data prezentacji w szkole nieznana. Dziś 22.10, a przed CAD stoją jeszcze: koncepcja → 2 review → brief CAD → budowa → review → próbki → wydruk → montaż. Scenariusz: realizator planuje 3 rundy próbek i 7 h druku, a użytkownik chce oko na 31.10; albo odwrotnie, realizator upraszcza na siłę, a oko miało być „pierwszą iteracją” bez terminu. Poprawka (po jednym pytaniu do użytkownika): „Termin: [31.10 / bez terminu – pierwsza iteracja może wyjść po Halloween]. Jeśli 31.10: koncepcja ma dać się wydrukować w jednej płycie X1C (≤ 8 h) po jednej rundzie próbek; wszystko, co wymaga drugiej iteracji, oznacz jako „wersja 2”.” Pewność: wysoka co do braku, średnia co do tego, czego chce użytkownik.

**W4. Dzieci dotykają: brak wymagania wytrzymałości na rękę dziecka.** Miejsce: „Wnioski z małego oka” (jest tylko skok serwa). `prezentacja-w-szkole.md`: tłum dzieci, wkładanie palców, kręcenie gałką; małe oko dostało ograniczniki ±33°, żeby wymuszony obrót szedł na tuleję, nie na serwo (decyzja 18.10). Gałka Ø60 wystająca 22 mm z dwiema powiekami to najbardziej kuszący element dyni. Moment z palców dziecka na kuli Ø60 to rząd 0,3–0,5 N·m, więcej niż 0,216 N·m MG90S. Poprawka: „Mechanizm ma przeżyć rękę dziecka: wymuszony obrót gałki w obu osiach i naciśnięcie powieki trafiają na twarde ograniczniki w ramie, nie na przekładnię serwa; nacisk 20 N na gałkę od przodu przenosi słupek kardana, nie cięgna; wyrwanie powieki palcem – podaj, co pęka pierwsze i czy to część za 15 min druku. Z zewnątrz żadnych wystających śrub ani ostrych krawędzi (`prezentacja-w-szkole.md`).” Pewność: wysoka.

**W5. Luz powieka–gałka nie ma wiersza w tabeli `AGENTS.md`, a brief każe brać luzy z tabeli.** Miejsce: „Wnioski” ostatni punkt. Tabela ma „ruchome części obok siebie ≥ 0,5”; research 2.3 dla czasz Ø70–80 podaje 1,0–1,5 promieniowo z uzasadnieniem (owalizacja FDM, malowanie), 18.10 przyjął 1,2. Scenariusz: realizator bierze 0,5, powieka ociera po pierwszym malowaniu tęczówki. Poprawka: „Para powieka–gałka (koncentryczne czasze): 1,0–1,2 mm promieniowo (research 2.3, tabela 2.3; nie z tabeli `AGENTS.md`), jako zmienna; po wydruku do korekty. Powieka górna–dolna na wspólnej osi: luz osiowy 0,2–0,3 jak obrotowe.” Pewność: wysoka.

**W6. Rant z zewnątrz: brief nie przekazuje preferencji użytkownika z 20.10.** Miejsce: „Czego oczekuję” pkt 3. Decyzja 20.10: rant Gniazda 74 → 67,5, „najwyżej 2 mm poza otwór, ma tylko nie wpaść do środka”; cel wizualny z 17.10: z zewnątrz miąższ i gałka. 18.10 ma rant Ø96 na otwór 83 (6,5 mm/str.). Scenariusz: realizator projektuje szeroki rant jako główny element nośny (bo lekko = bez nakrętki), użytkownik go odrzuca, albo przeciwnie: wąski rant plus brak nakrętki daje moduł, którego nic nie trzyma od zewnątrz. Poprawka: „Rant z zewnątrz jak w małym oku: ≤ 2 mm poza otwór (Ø ≤ 84) albo wcale – jeśli któryś wariant mocowania potrzebuje szerszego, podaj to jako pytanie otwarte z liczbą. Dopasowanie rantu do dyni R150 jak w Gnieździe v2.6.” Pewność: wysoka co do decyzji 20.10, średnia co do tego, czy użytkownik przeniesie ją na duże oko (stąd pytanie).

**W7. MG90S są „w drodze”, nie „w warsztacie”.** Miejsce: „Przeczytaj najpierw” pkt 5 („co jest w warsztacie (MG90S × 4 …)”). `sprzet.md`: MG90S w sekcji „Zamówione (w drodze)”; dziennik ani `teraz.md` nie odnotowują dostawy. Scenariusz: pkt 10 (pomiary MG90S przed CAD) i próbka kieszeni (pkt 9) czekają na paczkę; realizator nie wie, czy projektować pod SG90 jako zapas. Poprawka: „MG90S × 4 zamówione (`sprzet.md`, „w drodze”) – potwierdzić, czy dotarły. Kieszeń serwa projektuj na wspólną obwiednię SG90/MG90S (nominalnie 22,8 × 12,2 × 28,5, rozstaw uszu 27,8–28; różnice między klonami do 0,8 mm – `luzKorpusSerwa` 0,4/str. jak w v2.8) tak, żeby pierwszy wydruk działał z SG90, jeśli MG90S nie przyjdą.” Pewność: wysoka co do stanu `sprzet.md`, średnia co do dostawy.

**W8. Kolejność montażu na stole i pozycja zero nie są na liście oczekiwanych wyników.** Miejsce: „Czego oczekuję” 1–11 wobec „Wnioski” (montaż na stole, jednoznaczne złożenie, orczyk przy 1500 µs). Użytkownik 21.10: „niepokoi mnie” (kalibracja początkowa, Parking w `teraz.md`). Recenzenci sprawdzają listę wyników; czego na niej nie ma, realizator pominie albo zbędzie zdaniem. Poprawka, nowy punkt: „12. Kolejność montażu na stole krok po kroku (co, czym, w jakiej pozycji serw), moment nasadzenia każdego orczyka przy 1500 µs, znak pozycji zero na częściach i kształt, który uniemożliwia złożenie w drugim położeniu (czworobok małego oka składał się na dwa sposoby); dla każdego serwa: twardy ogranicznik czy zakres bez kolizji przy skoku z dowolnej pozycji.” Pewność: wysoka.

**W9. Zakres i precyzja oczekiwanych liczb nieokreślone: 11 punktów z masą, czasem druku i długością każdej śruby przed CAD.** Miejsce: „Czego oczekuję” 4–5 i „Liczby policz; nie pisz „powinno się zmieścić””. Scenariusz: realizator wymyśla precyzję (M3×14, 38 min druku), recenzenci „obalają” liczby, które i tak zmieni CAD; raport puchnie, a sedno (R1, R4, mocowanie) tonie. Poprawka: „Precyzja: wymiary główne ±1 mm, masy ±20 % z prostych brył, czas druku z reguły ok. 15–20 g/h PLA 0,2 na X1C; długości śrub tylko tam, gdzie wynikają z łańcucha grubości (podaj łańcuch). Liczby, których nie da się policzyć bez CAD, oznacz „do CAD” zamiast zgadywać. Objętość: nie więcej niż ~6 stron; rachunki w załączniku na końcu.” Pewność: średnia (to ocena ryzyka, nie błąd).

## DROBNE

**D1. Fakt: działający moduł to v2.6 + Cięgno v2.7, nie v2.8.** Miejsce: „Po co” („w wersji v2.8”). `przekazanie-2026-10-21.md`: v2.8 to model, „wydruk niepotwierdzony”. Poprawka: „działa moduł z części v2.6/v2.7; v2.8 (M3 w uszach serwa, Pokrywa w plastik) jest zaprojektowana, wydruk niepotwierdzony”. Pewność: wysoka.

**D2. Wymiary dyni nie są w briefie.** Miejsce: „Czego oczekuję” pkt 1. Realizator potrzebuje R150 / 25–27 cm (decyzje 18.10, `modul-malego-oka-wymiary.md`) do rantu, głębokości i rozmieszczenia; użytkownik dyni jeszcze nie ma, więc to założenie. Poprawka: „Dynia: założenie 25–27 cm, R ≈ 150 mm, ścianka 15–35 mm, front na osi symetrii; wszystko jako zmienne.” Pewność: wysoka.

**D3. Rozmieszczenie względem małych oczu.** Miejsce: pkt 1. Decyzje: rozstaw małych oczu ≥ 125 poziomo / ≥ 145 pionowo (Gniazdo Ø67,5, Kaseta z Klamrą H). 18.10 zakładał „środki ≥ 100 mm od dużego oka” bez rachunku. Poprawka do pkt 1: „minimalny rozstaw środek dużego oka – środek małego (Gniazdo v2.6 Ø67,5, Kaseta Ø~61 + Klamra H, kabel) z obrysu modułu w dyni R150; ile małych oczu zostaje z przodu.” Pewność: wysoka.

**D4. „Kanały 0–12 zajęte przez małe oczy” to propozycja z 18.10, nie fakt.** Miejsce: pkt 7. Dziś zajęte są kanały 0 i 1 (`polaczenia.md`); planowanych małych oczu ~10 (brief E5.5), SG90 będzie 18, więc możliwy drugi PCA9685. Poprawka: „kanały dużego oka: propozycja 13–15 (18.10), ostatecznie z tabeli E5.4; przy > 13 małych oczach drugi PCA9685 (A0).” Pewność: wysoka.

**D5. Zasilanie i spoczynek.** Miejsce: pkt 7. Brief nie mówi o powerbanku (Baseus wyłącza się przy małym poborze – `2026-10-22-powerbank-a.md`, niezacommitowane) ani o trybie spoczynku z wyłączonym PWM. Mechanicznie: moment grawitacji na gałce 4,7·10⁻⁴ N·m przy 15°, na powiece rzędu 10⁻³ N·m – przekładnia bez impulsu to utrzyma, ale ułożenie „oko zamknięte, serwa bez impulsu przez godziny” trzeba nazwać. Poprawka: „Zasilanie 5 V z jednego portu USB 3 A (powerbank, decyzja 20.10; auto-wyłączanie w trakcie testów E5.5); w ruchu naraz ≤ 3–4 serwa w całej dyni; podaj szczyt prądu dużego oka (2 serwa gałki + powieka). Spoczynek: oko zamknięte, PWM wyłączony – pokaż, że gałka i powieki nie opadają (rachunek momentów od ciężaru vs tarcie przekładni) i że pierwszy impuls po włączeniu nie startuje z kolizji.” Pewność: wysoka co do braku, średnia co do wagi.

**D6. Przegub z warsztatu: liczba sztuk i typ nieustalone.** Miejsce: twarde wymaganie 5 i pkt 10. `sprzet.md`: „do doprecyzowania: przegub kulowy czy kardan, osobne sztuki czy jeden 3→5 mm”. Brief już zakłada kardan (słowa użytkownika „połączenie krzyżowe” to potwierdzają), ale nie liczbę. Poprawka do pkt 10: „ile sztuk, czy 3 mm i 5 mm to dwa osobne przeguby, zdjęcie z suwmiarką; wymiary: Ø i długość widełek, rozstaw i Ø sworzni krzyżaka, Ø otworów, czy jest wkręt ustalający; luz kątowy (kiwanie) – kardan RC ma luz, który przełoży się na drganie gałki”. Pewność: wysoka.

**D7. „Sprawdzone” niezdefiniowane.** Miejsce: twarde wymaganie 4. Poprawka: „sprawdzone = zbudowany egzemplarz z filmem albo zdjęciami działania (nie sam plik STL ani render); dla mocowania w dyni sprawdzonych rozwiązań poza klejem na gorąco (68percentwater) nie ma – oznacz jako własne i daj próbkę”. Formuła „bierzesz / zmieniasz / dlaczego” jest dobra i wystarcza, żeby realizator nie wymyślał od zera. Pewność: wysoka.

**D8. Łby śrub użytkownika.** Miejsce: „Wnioski” (śruby M3). Łby M3 użytkownika zmierzono 20.10: wystają 0,75 mm ponad Kasetę przy pogłębieniu 1,7, czyli łeb ≈ 2,45 mm, krzyżakowe (Parking); ISO 7380 (1,65) nie ma. W R1 łeb osi powieki decyduje o 1,15 vs 0,35 mm/str. luzu w otworze. Poprawka: „Śruby M3 użytkownika: łeb Ø~5,5–6 × 2,45, krzyżak; niskie łby ISO 7380 tylko jeśli użytkownik dokupi – podaj, gdzie łeb 2,45 się nie mieści.” Pewność: wysoka co do pomiaru, średnia co do typu łba.

**D9. Demontaż i transport.** Miejsce: pkt 3. `prezentacja-w-szkole.md`: moduły wyjąć na transport, wieża zabezpieczona; dynia żyje 5–10 dni. Poprawka: „moduł da się wyjąć z dyni bez niszczenia (transport do szkoły, przełożenie do nowej dyni), kable serw z wtyczkami 3-pin do wnętrza dyni, przedłużacze do PCA.” Pewność: wysoka.

**D10. Plan B i decyzja „2c od razu”.** Miejsce: twarde wymaganie 3 i „Znane błędy” („2c opisane jako dodatek do 2b”). To nie był błąd 18.10, tylko etapowanie (opis.md 2a/2b/2c, plan 2.5/2.6); użytkownik 22.10 je uchylił – ta zmiana powinna trafić do `decyzje.md` (orkiestrator). Realizator powinien dostać prośbę o plan B: „jeśli coś nie zadziała na wydruku, co da się wyłączyć jedną śrubą (oś góra–dół, dolna powieka), żeby oko działało jako 2b/2a”. Pewność: wysoka.

**D11. Zakres ruchu jako wymaganie.** Miejsce: pkt 1 (realizator „podaje zakres”). Decyzja 18.10: różnica ±25/±30° bez znaczenia dla efektu; 18.10 proponował ±25° / ±15° / powieki 0–75°. Poprawka: „Zakres wystarczający: lewo–prawo ±25°, góra–dół ±15°, powieki zamknięte–otwarte ~70°; większy zakres nie jest celem, jeśli kosztuje miejsce w Ø80.” Pewność: wysoka.

**D12. Luz w otworze Ø80.** Miejsce: twarde wymaganie 1 („z luzem”). Małe oko: Ø63,5 w otwornicy 64 (0,25/str.). Poprawka: „część w otworze ≤ Ø79,5 (0,25/str. jak w małym oku); otwornica 80 w miąższu daje otwór 80–81, poszarpany”. Pewność: wysoka.

**D13. Brief niezacommitowany.** `git status`: `??` dla briefu E6 i obu analiz powerbanku. `AGENTS.md`: orkiestrator commituje wszystko, czego realizator potrzebuje. Jeśli realizator pracuje w osobnej sesji/worktree, nie zobaczy pliku. Pewność: wysoka.

## Zgodność z intencjami użytkownika (22.10 i wcześniej)

| Intencja | W briefie | Ocena |
|---|---|---|
| Oko z powiekami, dwie płaszczyzny, pierwsza iteracja | „Po co”, wym. 3 | jest |
| „Od razu 2c” | wym. 3 | jest; brak planu B (D10) |
| Opus → Fable i Astra | nagłówek | jest |
| Otwornica 80, błąd Ø83 | wym. 1 | jest, z liczbami |
| Nie tak ciężko jak zewn. mocowanie + kaseta, „lżejsze (cieńsze)” | wym. 2 | jest, ale przerobione na gramy bez progu (W1) |
| Połączenie krzyżowe z warsztatu | wym. 5 | jest |
| Sprawdzone mechanizmy z researchu | wym. 4 | jest, dobrze sformułowane (D7) |
| Komplet do druku, nie na raty | brak wprost | dopisać do W3: „jedna płyta, komplet” |
| M3, bez craftu, bez absurdalnych napraw | „Wnioski” | jest |
| Najpierw specyfikacja, potem pytania | pkt 11 (≤ 5 pytań z propozycją) | jest |
| Bezpieczeństwo dziecka | tylko 12 V w tle | brak dla mechaniki (W4) |
| Serwo bez gwałtownych skoków, nie zna pozycji | „Wnioski” | jest |
| Kalibracja początkowa „niepokoi mnie” | „Wnioski” | jest w wymaganiach, nie w wynikach (W8) |

Nic nie dodano wbrew użytkownikowi. Przekręcenia: tylko interpretacja „lekko” (W1).

## Fakty w briefie sprawdzone jako zgodne z repo

Otwornice 45/50/56/62/nastawna 64/80; ścianka dyni 15–35; piłeczka 40, 1 × SG90; M3 ciasno Ø2,6 / luźno Ø3,3; bez wkładek poza częstym rozkręcaniem, Pokrywa M3×8 w plastik (decyzja 21.10); przeguby cięgien M3 + podkładka + nakrętka samohamująca (v2.7); Sanki wpadały do środka, M2 w Ø2 trzymała słabo; luz korpusu 0,4; montaż na stole (dziennik 20.10); czworobok w dwóch położeniach, orczyk przy 1500 µs (decyzja 21.10); SG90 nie zna pozycji; DFAM i drukarki; AMS nieznany; licencja Cogleya nieustalona; syn 8 lat; `AGENTS.md` budżet ≤ 15 operacji.

## Sprzeczności wewnątrz briefu i wykonalność naraz

- Otwór ≤ 80 vs gałka + powieki + kardan: **wykonalne przy Ø60** (R1: 1,15 mm/str. z łbami, 2,8 mm/str. bez łbów), nie przy Ø62+. Brief słusznie każe uzasadnić Ø60; warto wpisać R1 jako punkt odniesienia, żeby realizator nie zaczynał od Ø65.
- „Lekko” vs „serwo trzymane w każdym kierunku”: niesprzeczne; blok + klamra z v2.6 ważą kilka gramów. Sprzeczność jest tylko pozorna, dopóki „lekko” znaczy „bez nakrętki i kasety” (W1).
- „Wszystko przez Ø80” vs „montaż na stole” vs „resztę montuje się od środka”: do rozstrzygnięcia jednym akapitem (W2).
- Zakres 11 punktów jest wykonalny w jednym raporcie, jeśli ograniczyć precyzję (W9) i dodać pkt 12 (W8). Zbędne nic; do briefu CAD brakuje tylko kolejności montażu i pozycji zero (W8) oraz jawnego rachunku R1/R4.

## Zestawienie

| Waga | # | Jedno zdanie |
|---|---|---|
| KRYTYCZNE | K1 | Lista błędów 18.10 pomija zakleszczające się cięgna na zwykłych śrubach (0,78 mm mimośrodu przy 15° wobec luzu 0,3); dopisać i wymagać przegubu 2-DOF albo kołyski |
| WAŻNE | W1 | „Lekko” bez miary i bez minimalnej grubości ścianek ≥ 2 mm |
| WAŻNE | W2 | Nie określono, co wolno robić w dyni (wsunąć + ≤ 3 ruchy od środka, zero przegubów) |
| WAŻNE | W3 | Brak horyzontu czasowego (31.10 czy pierwsza iteracja bez terminu) |
| WAŻNE | W4 | Brak wymagania „przeżyje rękę dziecka” (ograniczniki, 20 N na gałkę, nic nie wystaje) |
| WAŻNE | W5 | Luz powieka–gałka 1,0–1,2 nie wynika z tabeli `AGENTS.md` |
| WAŻNE | W6 | Rant ≤ 2 mm poza otwór (decyzja 20.10) nieprzekazany |
| WAŻNE | W7 | MG90S są zamówione, nie w warsztacie; kieszeń na wspólną obwiednię SG90/MG90S |
| WAŻNE | W8 | Kolejność montażu i pozycja zero nie są na liście wyników |
| WAŻNE | W9 | Precyzja liczb przed CAD nieokreślona; raport urośnie i zgubi sedno |
| DROBNE | D1–D13 | v2.8 niewydrukowana; wymiary dyni; rozstaw od małych oczu; kanały jako propozycja; zasilanie i PWM off; liczba przegubów; definicja „sprawdzone”; łby 2,45; demontaż; plan B i wiersz w decyzjach; zakres ruchu jako wymaganie; luz 0,25 w otworze; brief niezacommitowany |

## Werdykt

**ZIELONE PO POPRAWKACH:** obowiązkowo K1 (błąd kinematyczny 18.10 na liście znanych błędów), W1 (definicja „lekko” + ścianki ≥ 2 mm), W2 (co wolno w dyni), W4 (ręka dziecka) i W8 (pkt 12: montaż i pozycja zero); W3, W6 i W7 wymagają po jednym pytaniu do użytkownika (termin, rant, dostawa MG90S); W5, W9 i D1–D13 to jednozdaniowe dopiski.
