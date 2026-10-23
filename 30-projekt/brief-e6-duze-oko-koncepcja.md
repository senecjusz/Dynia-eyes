# Brief E6.1: koncepcja dużego oka 2c, wersja 2 (22.10, po review briefu)

Dla: **Opus** (koncepcja, krok 1). Potem Twoja koncepcja idzie do krytycznej analizy przez **Fable** i **Astrę (Codex)**, niezależnie. Na końcu użytkownik decyduje, a orkiestrator pisze brief dla wykonawcy CAD (Onshape). Piszesz po polsku. Pracujesz tylko do odczytu w repo: bez `git pull`, commitów i pushy, bez zmian w innych plikach. Zapisujesz jeden plik: `20-analizy/2026-10-22-duze-oko-2c-koncepcja.md`.

Wersja 2 briefu uwzględnia review briefu: `20-analizy/review/2026-10-22-brief-e6-fable.md` i `…-astra.md`. Przeczytaj oba – zawierają rachunki (R1 obrys w Ø80, R2 masy, R3 momenty, R4 zakleszczanie cięgien), z których masz korzystać.

## Po co

Dynia na Halloween z ruchomymi oczami, robiona przez użytkownika z synem (8 lat). Użytkownik to doświadczony konstruktor i drukarz 3D: nie tłumacz podstaw, podawaj liczby. Działa pierwszy moduł małego oka (piłeczka 40 mm, 1 × SG90, lewo–prawo) z części v2.6/v2.7 i wcześniejszych; v2.8 ma gotowy model i sprawdzony eksport, wydruk i montaż niepotwierdzone. Teraz **duże oko**: gałka z **dwiema powiekami** i ruchem **w dwóch płaszczyznach** (lewo–prawo i góra–dół). Użytkownik 22.10: „od razu 2c” – od pierwszej iteracji obie powieki i 2 osie ruchu gałki. To uchyla etapowanie 2a/2b/2c z `opis.md` i `plan-realizacji.md`.

Twoje zadanie: **jedna koncepcja do zbudowania w Onshape**, dość konkretna, żeby recenzenci mogli ją policzyć i obalić, a orkiestrator napisać z niej brief dla wykonawcy CAD. Nie projektujesz w CAD.

**Komplet do druku, nie na raty**, po jednej rundzie próbek. Duże oko nie może blokować małych oczu (minimum projektu).

## Przeczytaj najpierw

1. `AGENTS.md` – w całości: „Zasady projektowe”, „Luzy montażowe” (tabela obowiązkowa), „Modelowanie w Onshape” (plan drzewa, zmienne, Mirror/szyki, budżet ≤ 15 operacji bryłowych na część, Hole, DFAM).
2. `20-analizy/2026-10-18-duze-oko-jedna-noc.md` – dotychczasowa koncepcja 2b→2c. **Punkt wyjścia, nie wyrok.** Ma poważne błędy (niżej), w tym kinematyczny.
3. `20-analizy/2026-10-17-mechanizm-oka/README.md` i `whitepaper.md`, `10-inspiracje/mechanizmy-oka-zrodla.md` – research mechanizmów (Will Cogley EyeMech, EyeMech E31, Paul's Bots i inne). **Uwaga: research przygotowało AI** – to indeks źródeł, nie dowód działania.
4. `20-analizy/2026-10-17-mocowanie-pileczki-sruby.md` – zasady śrub M3 (ciasny/luźny).
5. `50-elektronika/sprzet.md` – wyposażenie (przeguby krzyżowe, śruby M3 8–50, nakrętki, otwornice). **MG90S × 4 są w warsztacie** (użytkownik 22.10; `sprzet.md` jeszcze podaje „w drodze”).
6. `70-budowa/dziennik.md` (wpisy 20–21.10) i `30-projekt/decyzje.md` (wiersze 18–21.10) – wnioski z małego oka.
7. `30-projekt/opis.md` (poziom 3 – śledzenie radarem LD2450), `20-analizy/2026-10-18-wykrywanie-ruchu.md`, `20-analizy/2026-10-18-prezentacja-w-szkole.md` (dzieci przy dyni), `20-analizy/2026-10-17-pudelko-elektroniki.md` (wieża, otwór wieczka), `20-analizy/2026-10-17-modul-malego-oka-wymiary.md`.
8. Zasilanie: `30-projekt/brief-e5.5-powerbank-agenci.md`, `20-analizy/2026-10-22-powerbank-a-obciazenie.md`, `20-analizy/2026-10-22-powerbank-b-alternatywy.md` (Baseus wyłącza się przy małym poborze; przyczyna nierozstrzygnięta).

## Twarde wymagania od użytkownika (22.10)

1. **Otwór w dyni ≤ Ø80 mm** – największa otwornica to 80 mm (inne: 45, 50, 56, 62, nastawna do 64). Analiza z 18.10 zakładała Ø83 – błąd. Część w otworze ≤ Ø79,5 (0,25/str. jak w małym oku; otwór z otwornicy w miąższu wychodzi 80–81, poszarpany). Punkt odniesienia z review (Fable R1): Ø60 + powieki (luz 1,2, rant 3,5) + luz 0,5 + ścianka 2 = Ø74,4, z łbami osi powiek ok. Ø77,7 – **Ø60 to praktyczna granica**; większa gałka wymaga dowodu.
2. **Lekko i cienko** = bez gwintu, Nakrętki i Kasety wsuwanej w gniazdo; mocowanie w dyni z najwyżej 2 części drukowanych. Użytkownik: „nie robiłbym tym razem tak ciężkiego mechanizmu jak zewnętrzne mocowanie i wkładanie kasety; to musi być lżejsze (cieńsze)”. **Nie** tniemy ścianek: części nośne ≥ 2,0 mm, powieki 2,2–2,4 mm z rantem 3,5 (decyzja 18.10, research 2.3). Masa to liczba do porównania wariantów, nie cel: orientacyjnie całość z 3 serwami ok. 130–150 g (Fable R2). Masę wydruku licz z objętości ścian i żeber plus wypełnienia wnętrza, nie „cała objętość × %”; dolicz serwa, kardan, śruby, przewody.
3. **2c od razu:** obie powieki ruchome, ruch gałki lewo–prawo i góra–dół. Wariant podstawowy: powieki sprzężone **jednym serwem**, razem 3 serwa dużego oka. Jeśli nie potrafisz uzasadnić takiego wariantu w pozostałych ograniczeniach, pokaż konkretną przeszkodę i konsekwencje alternatywy (np. 4. serwo – MG90S są 4); zmiana liczby serw wymaga decyzji użytkownika, bez redukcji funkcji 2c. Nie przejmuj planu awaryjnego 2a/2b z 18.10 jako celu; możesz wskazać, co da się wyłączyć jedną śrubą, gdy coś nie zadziała na wydruku.
4. **Sprawdzone mechanizmy z researchu jako baza** (użytkownik: „bazować na sprawdzonych mechanizmach z researchu”). **Sprawdzone = zbudowany egzemplarz z filmem albo zdjęciami działania** (nie sam STL ani render). Każdy podzespół (podparcie i napęd gałki, napęd i sprzężenie powiek, mocowanie serw, mocowanie w dyni) opieraj na takim mechanizmie (Cogley EyeMech / Simplified Eye, EyeMech E31, Paul's Bots i inne; możesz szukać dalej w sieci). Dla każdego podzespołu podaj konkretną wersję projektu i materiał potwierdzający działanie (link, fragment instrukcji, znacznik czasu filmu), co bierzesz, co zmieniasz i dlaczego (skala, Ø80, M3, lekkość). Oddziel rozwiązanie ze źródła od własnej adaptacji. **Zmiana liczby serw, typu przegubów albo sposobu sprzężenia to nie skalowanie** – wymaga ponownego rachunku kinematyki. Własny pomysł tylko tam, gdzie sprawdzonego nie ma (np. mocowanie w dyni – poza klejem na gorąco z 68percentwater takich nie znamy) – oznacz go jako niesprawdzony i daj próbkę. Licencje: bierzemy zasadę działania, Party rysujemy sami.
5. **Przegub:** użytkownik ma **przeguby krzyżowe (kardana)** „3 mm i 5 mm” – liczba sztuk i wymiary nieznane. Użyj go jako środka gałki albo uzasadnij, czemu nie. Luz kątowy kardana RC przełoży się na drganie gałki – uwzględnij.

## Co wolno robić w dyni

- Moduł składa się, kalibruje i sprawdza **na stole** (skręcanie przegubów w ciasnej rurze okazało się niewykonalne, dziennik 20.10).
- W dyni wolno: wsunąć gotowy moduł przez otwór Ø80 od zewnątrz i od środka zabezpieczyć go **≤ 3 ruchami** (zacisk, klin, śruba wkrętakiem) przez otwór wieczka (≥ 110 mm według `pudelko-elektroniki.md` – do potwierdzenia), ręką dorosłego, po omacku, w mokrym; podłączyć wtyczki serw.
- W dyni **nie wolno**: łączyć przegubów, nasadzać orczyków, wpinać cięgien, kalibrować.
- Jeśli serwa nie przechodzą przez Ø80 razem z gałką, jedynym dopuszczalnym łączeniem w dyni jest przykręcenie płyty serw od środka ≤ 3 śrubami M3; cięgna muszą być wtedy już wpięte albo wpinane bez narzędzi jednym ruchem.
- Moduł da się wyjąć bez niszczenia (transport do szkoły, przełożenie do nowej dyni, demontaż po Halloween, wymiana serwa).
- **Rant z zewnątrz jak w małym oku:** ≤ 2 mm poza otwór albo wcale (decyzja 20.10 dla Gniazda: „ma tylko nie wpaść do środka”). Jeśli wariant mocowania potrzebuje szerszego, podaj to jako pytanie z liczbą.

## Wnioski z małego oka (v2.5–v2.8), które koncepcja musi uwzględnić

- **Śruby M3** wszędzie, gdzie się da (uszy serwa: M3 przechodzi przez ucho SG90; dla MG90S sprawdź), otwór ciasny Ø2,6, luźny Ø3,3. **Bez wkładek gwintowanych**, chyba że coś się często rozkręca (Pokrywa małego oka: M3×8 wprost w plastik). M2 tylko tam, gdzie wymusza to serwo (wkręt orczyka). Śruby M3 użytkownika mają łby krzyżakowe ok. Ø5,5–6 × 2,45 (pomiar 20.10); niskich ISO 7380 nie ma – pokaż, gdzie łeb 2,45 się nie mieści.
- **Przeguby obrotowe płaskich cięgien: śruba M3 + podkładka + nakrętka samohamująca** (v2.7), nie drukowane piasty ani wkładki.
- **Serwo trzymane w każdym kierunku** – Sanki w v2.5 wpadały do środka; wkręt M2 w Ø2 z kanałem trzymał słabo. W v2.8 luz korpusu SG90 wynosi 0,4 mm z przodu i z tyłu; kieszeń MG90S wyznacz z pomiarów (lista w pkt 10).
- **Pozycja zero i jednoznaczny montaż:** czworobok małego oka składa się w dwóch położeniach; w złym serwo blokuje mechanizm. Koncepcja ma uniemożliwiać złe złożenie kształtem albo mieć znak pozycji zero. Orczyk nasadza się przy serwie trzymającym 1500 µs.
- **Bezpieczny rozruch, nie tylko przeżycie skoku.** SG90/MG90S nie zna pozycji; pierwszy impuls ściąga serwo pełną prędkością. Zapis ostatniego impulsu w NVS i rampa nie gwarantują łagodnego ruchu, gdy pozycja rzeczywista jest inna (zanik prądu w trakcie ruchu, ręczne przestawienie oka). Opisz zachowanie przy pierwszym uruchomieniu, restarcie po zaniku zasilania i po ręcznym przestawieniu. **Ograniczniki nie mogą być normalnym punktem dojazdu pod prądem.**
- **DFAM:** każda część ma płaską stronę na stół, nawisy ≤ 45° albo fazki, podpory tylko w ostateczności i opisane. Drukarki: Bambu X1C (256 mm) i A1 mini (180 mm). AMS przy X1C – nie wiadomo (tęczówka: wariant bez AMS).
- **Luzy z tabeli `AGENTS.md`** dla każdej pary; ruchome części obok siebie ≥ 0,5 mm w całym zakresie ruchu (łącznie z łbami śrub, nakrętkami, kablami serw). **Para powieka–gałka (koncentryczne czasze) nie ma wiersza w tabeli:** 1,0–1,2 mm promieniowo (research 2.3), jako zmienna. Powieki na wspólnej osi: luz osiowy 0,2–0,3 jak przy obrotowych.

## Dzieci przy dyni

`prezentacja-w-szkole.md`: tłum dzieci, palce, kręcenie gałką. Moment z palców na kuli Ø60 to rząd 0,3–0,5 N·m, więcej niż MG90S (ok. 0,22 N·m) (Fable W4). Mechanizm ma **przeżyć rękę dziecka**: wymuszony obrót gałki w obu osiach i naciśnięcie powieki idą na twarde ograniczniki w ramie, nie na przekładnię serwa; nacisk 20 N na gałkę od przodu przenosi podparcie kardana, nie cięgna; przy wyrwaniu powieki pęka najpierw mała, tania w druku część. Wskaż miejsca przycięcia palca (powieki!) i jak je ograniczasz. Z zewnątrz żadnych wystających śrub ani ostrych krawędzi.

## Znane błędy i luki analizy z 18.10

- **Kinematyka cięgien gałki (KRYTYCZNE, oba review).** 18.10 zakłada, że „punkt na osi jednego ruchu nie przesuwa się w drugim ruchu”, więc wystarczą zwykłe śruby w luźnym otworze, i przypisuje to Cogleyowi. To fałsz: śruba w punkcie X obraca się razem z gałką; przy pochyleniu 15° mimośród na oczku 3 mm to 0,78 mm wobec luzu 0,3 (Fable R4), a przy złożeniu obrotów 25°/15° składowa poprzeczna przesunięcia punktu r = 20 mm to ok. 2,2 mm (Astra A1) – układ się zakleszcza. Cogley używa przegubów kulowych (EyeMech) albo kołyski (Simplified: serwo lewo–prawo pochyla się z gałką). **Wymagane:** przegub o 2 stopniach swobody na co najmniej jednym końcu każdego cięgna albo architektura kołyski; podaj układ współrzędnych, kolejność osi kardana, punkty zaczepienia, dozwolone ruchy każdego przegubu i policz napęd w całym zakresie obu osi, także po przekątnej (wychylenia przegubów, sprzężenia osi, martwe punkty, kolizje). Luz otworu M3 nie zastępuje przegubu przestrzennego.
- Otwór Ø83 > otwornica 80.
- Ciężka Rura z gwintem i Nakrętką – użytkownik jej nie chce.
- Wkładki gwintowane, M2 do serw – sprzeczne z v2.8.
- Kanały 0–12 „zajęte przez małe oczy” to propozycja, nie fakt (dziś zajęte 0 i 1).
- Nikt jej krytycznie nie sprawdził.

## Czego oczekuję w koncepcji

Precyzja: wymiary główne ±1 mm, masy ±20 % z prostych brył; długości śrub tylko tam, gdzie wynikają z łańcucha grubości (podaj łańcuch). Liczby, których nie da się policzyć bez CAD, oznacz „do CAD”. Objętość: do ok. 6 stron, rachunki w załączniku na końcu.

1. **Wymiary i miejsce:** średnica gałki (Ø60 – patrz wymaganie 1). Zakres wystarczający: lewo–prawo ±25°, góra–dół ±15°, powieki zamknięte–otwarte ok. 70°; większy nie jest celem, jeśli kosztuje miejsce w Ø80. Rozdziel: obwiednię pracy, obwiednię przejścia przez otwór Ø80, drogę wniesienia i obrotu modułu przez wieczko (jeśli dotyczy). Dynia: założenie 25–27 cm, R ≈ 150 mm, ścianka 15–35 mm (zakres regulacji mocowania), front na osi symetrii – wszystko jako zmienne. Wieża w środku: wolne ok. 65 mm za ścianką to szacunek; gabaryty wieży w `pudelko-elektroniki.md` są niespójne (95 × 45 i 105 × 60) – nazwij założenie. Minimalny rozstaw środka dużego oka do środka małego licz z obrysów (Gniazdo v2.6 Ø67,5, Kaseta z Klamrą H), nie przejmuj „100 mm” z 18.10.
2. **Mechanizm:** podparcie i napęd gałki (z rachunkiem z sekcji „Znane błędy”), sprzężenie powiek z jednego serwa z rachunkiem kątów obu powiek w całym zakresie, zachowanie powiek przy ruchu gałki (sprzężenie z góra–dół w firmware?), położenie serw i przebieg cięgien. Kryteria otwarcia i zamknięcia powiek: dopuszczalna szczelina bez wzajemnego docisku, brak odsłonięcia wnętrza gałki w zakresie patrzenia.
3. **Mocowanie w dyni – 2–3 lekkie warianty** zgodne z „Co wolno robić w dyni”: masa, środek ciężkości i moment względem ścianki, powierzchnia docisku, sposób montażu przez rodzica (narzędzia, kolejność), co trzyma oko w osi i przed wypadnięciem, próbka utrzymania w mokrym miąższu; rekomendacja jednego.
4. **Lista części** (nazwy jak przyszłe Party w Onshape): funkcja, wymiary orientacyjne, masa, orientacja druku, na którą drukarkę się mieści (X1C 256 mm / A1 mini 180 mm); komplet i osobno próbki i przyrządy.
5. **Lista połączeń** (każda para): typ pasowania, luz, śruba (typ i długość z kompletu 8–50 mm), co ciasne, co luźne.
6. **Zwymiarowany schemat złożenia** (widok z przodu, z boku, przekrój; może być ASCII lub opis współrzędnych): osie, punkty zaczepienia, ramiona, długości cięgien, promienie czasz, stosy uszu, podkładek, łbów i nakrętek.
7. **Zmienne do Variable Studio** (główne parametry i zależności) – pod plan drzewa wykonawcy.
8. **Napędy, prąd i firmware – tylko to, co wpływa na mechanikę:** wymagany moment każdego napędu w najgorszym położeniu i zapas względem MG90S (moment roboczy, nie zablokowania); budżet prądu dużego oka i całej dyni (spoczynek, praca, rozruch, zablokowanie; pomiar vs szacunek); zachowanie po wyłączeniu PWM i zaniku zasilania (czy gałka i powieki nie opadają – Fable R3); kanały PCA9685: propozycja 13–15 dla dużego oka, 0–12 jako maksymalna pula małych oczu, ewentualny kanał podtrzymania powerbanku (wtedy drugi PCA9685 przy > 12 małych oczach). Nie wybieraj źródła zasilania – podaj wymagania i zależność od E5.5.
9. **Montaż na stole krok po kroku i kalibracja:** co, czym, w jakiej pozycji serw; moment nasadzenia każdego orczyka przy 1500 µs; znak pozycji zero na częściach i kształt uniemożliwiający złożenie w drugim położeniu; dla każdego serwa: zakres bez kolizji i gdzie są ograniczniki.
10. **Ryzyka – top 5** z miejscem, scenariuszem porażki i testem.
11. **Próbki przed pełnym drukiem** (małe, jedna runda): kardan w gnieździe, kieszeń MG90S, oś powiek, przegub 2-DOF cięgna, mocowanie w miąższu.
12. **Pomiary do zrobienia przez użytkownika przed CAD** (suwmiarka), z opisem, co mierzyć: kardan (ile sztuk, czy 3 i 5 mm to dwa osobne; Ø i długość widełek, rozstaw i Ø sworzni krzyżaka, Ø otworów, wkręt ustalający, luz kątowy), MG90S (korpus, uszy, rozstaw i Ø otworów uszu, wysokość wałka, orczyki), łby śrub M3. Dla każdego brakującego pomiaru: przyjęty przedział, wpływ na koncepcję i warunek jej odrzucenia.
13. **Pytania do użytkownika** – zebrane w jednym pakiecie, każde z Twoją propozycją odpowiedzi; pytania blokujące oznacz.

Oddzielaj fakt (źródło, pomiar, plik w repo) od interpretacji i założenia. Liczby policz; nie pisz „powinno się zmieścić”. Na końcu: **werdykt jednym zdaniem** – czy koncepcja jest gotowa do krytycznej analizy, i co jest jej najsłabszym punktem.
