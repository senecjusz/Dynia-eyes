# Podstawka – koncepcja v5, review runda 2 (Opus)

25.10.2026. Materiał: `20-analizy/2026-10-25-podstawka-koncepcja.md`, rendery 1–4, `40-cad/narzedzia/podstawka-blender-render.py`, PRD §5/§7/§8, `sprzet.md`, `polaczenia.md`, wnioski z rundy 1. Układ: x w prawo od lewego przedniego narożnika, y do tyłu, z od stołu (jak w skrypcie).

## PSUJE DZIAŁANIE

**1. Skrętka nie ma gdzie się zgiąć przed wtykiem RJ45 (łączniki portem do przodu).**
- Miejsce: kaseta, łączniki x 62–122, wtyki przednie y 114–132, z 7–19; szufladka do y 90; otwór płyty Ø64 = y 78–142.
- Scenariusz: skrętka schodzi pionowo z otworu i musi wejść w wtyk poziomo (+y) na z ≈ 13. Realny wtyk RJ45 z osłoną to ok. 30 mm (w skrypcie 18), więc koniec osłony leży na y ≈ 102. Cat5e Ø5–6 ma minimalny promień gięcia ok. 4 × Ø = 20–24 mm. Przy gięciu 90° skrętka musiałaby schodzić na y ≤ 80, czyli nad szufladką (szczelina między szufladką z ≤ 30 a płytą z = 40 ma 10 mm), a tylna ścianka szufladki (y 90) dociska ją przy każdym wsunięciu. Krzywa w skrypcie omija problem esem o promieniu ok. 7 mm (y 118 → 104 → 114): fizycznie to załamanie trzech skrętek, które wypycha wtyki z łączników. W tej samej szczelinie 28 mm (y 90–118) mają się zmieścić pętla zapasu USB-C 10 cm i przewodu PIR 15 cm.
- Poprawka: w kroku 2 warunek rozkładu: każda skrętka gięta z R ≥ 20 mm, żadna nie wchodzi w y < 92. Dwa warianty: (a) łączniki osią wzdłuż x pod tylną częścią otworu (y 118–142), skrętka schodzi pionowo i gnie się o 90° w bok (wysokość 40 − 13 = 27 mm ≥ R 20 + Ø/2); (b) keystone z zaciskiem LSA zamiast łącznika i krótkiego odcinka (PRD §5 mówi o keystone'ach; jeśli ma je użytkownik, tor skraca się z ok. 98 do ok. 60 mm).
- Pewność: wysoka.

**2. Brak wykonalnej kolejności wpinania skrętek przy zamontowanej dyni.**
- Miejsce: „Montaż” i „Okablowanie”: skrętki 0,5–0,6 m „zapas niepotrzebny”, a jednocześnie „serwis: wysunąć kasetę do tyłu na długość przewodów”.
- Scenariusz: skrętki są wlutowane w rozdzielacze w dyni, więc wtyki RJ45 trafiają pod płytę dopiero po nałożeniu dyni na tuleję i zakręceniu nakrętki. Od góry przez rurę Ø64 o głębokości ok. 110 mm (t + 10 + 58) nie da się wpiąć wtyku poziomo. Od tyłu: kaseta wysunięta o ok. 100 mm wymaga ok. 100–120 mm zapasu każdej skrętki, którego nie ma, a po wsunięciu ten zapas musiałby się zmieścić w szczelinie z uwagi 1. Od przodu: po wyjęciu szufladki trzeba sięgnąć ok. 100 mm w szczelinę 40 mm, a to nadal jest gięcie z uwagi 1. To samo dotyczy zdjęcia dyni po wystawie.
- Poprawka: koncepcja ma opisać kolejność krok po kroku (nałożenie dyni → wpięcie → wsunięcie kasety) i podać zapas skrętki, który z niej wynika, oraz miejsce na ten zapas. Najprościej: łączniki tak blisko otworu, żeby przy wyjętej szufladce dało się je wpiąć ręką od przodu (wariant (a) z uwagi 1).
- Pewność: wysoka.

**3. Wtyk USB-C z gięciem kabla nie mieści się w 31,2 mm.**
- Miejsce: szufladka, wnętrze 196 − 2 × 2,4 = 191,2; powerbank 160 dosunięty do lewej ścianki (luz 0,1 w skrypcie).
- Scenariusz: prosty wtyk USB-C z osłoną odgiętki ma typowo 25–35 mm. Kabel Ø3,5–4,5 przy R ≈ 4 × Ø = 15–18 mm potrzebuje za osłoną ok. 18–20 mm na zgięcie o 90° (w bok albo do góry). Potrzeba 43–55 mm, jest 31,2. Kabel opiera się o prawą ściankę i wywiera boczny nacisk na wtyk. Wtyk wychodzi z gniazda albo niszczy port, a wtedy jest zanik zasilania na wystawie. W skrypcie wtyk ma 24,5 mm, a na zgięcie zostaje 6,6 mm.
- Poprawka: zmierzyć posiadany kabel (już w „Do potwierdzenia”) i wpisać `L_wtyk` + `R_gięcia` jako zmienne. Bez pomiaru przyjąć 45 mm: SZ 236 → ok. 250 (wnętrze szufladki ≥ 205). Połowa przekątnej wzrośnie ze 163 do 167; to nadal pod dynią Ø318. Albo w prawej ściance szufladki zrobić wycięcie na odgiętkę i zostawić kabel w 2 mm szczelinie do sklejki (nie polecam, bo 2 mm < Ø kabla).
- Pewność: średnio-wysoka (zależy od kabla).

**4. Wysokość tulei liczona od grubości korka `t`, a nie od rzeczywistego położenia dna wnętrza.**
- Miejsce: „Mocowanie dyni” pkt 1–2, tuleja = `t` + 10 nad kołnierzem.
- Scenariusz: dno dyni w środku (strona kwiatowa) jest zwykle wklęsłe o 5–15 mm, więc dynia stoi na obrzeżu, a nie na kołnierzu. Dno wnętrza leży wtedy na wysokości 3 + g + t nad płytą. Gwintu nad dnem wnętrza zostaje 10 − g. Przy g ≥ 2 nakrętka 8 mm ma mniej niż pełne zazębienie, a przy g ≥ 10 w ogóle nie sięga gwintu i dynia stoi luźno. Pomiar korka otwornicy tego nie wykrywa.
- Poprawka: mierzyć `h` = odległość od płyty (dynia stoi na płycie) do dna wnętrza przy otworze, linijką przez otwór. Tuleja = `h` + 10 nad płytą. Nakrętka dokręcona do miękkiego dna ściągnie je o kilka mm w dół, co w tej sytuacji pomaga.
- Pewność: średnia (zależy od dyni; wklęsłe dno jest typowe).

**5. PIR: regulacja i złącze po stronie przegródki, w kieszeni ok. 12 mm.**
- Miejsce: czoło szufladki, płytka y0+1…y0+3, przegródka y0+15.
- Scenariusz: w HC-SR501 kopułka jest po jednej stronie płytki, a oba potencjometry, zworka i 3-pinowa listwa po drugiej. Przy kopułce wystającej przez czoło szczeliny potencjometrów patrzą do tyłu, na przegródkę odległą o ok. 12 mm. „Dostępne od góry” nie jest prawdą: wkrętak potrzebuje osi prostopadłej do płytki. Do tego listwa (ok. 8,5 mm) z wtykiem Dupont (ok. 14 mm) i gięciem przewodu potrzebuje ok. 25–30 mm za płytką, a jest ok. 12. Wymaganie użytkownika „z dostępem do regulacji” nie jest spełnione.
- Poprawka: otwory Ø5 w przegródce na osiach obu potencjometrów i zworki, z dostępem wkrętakiem z komory po wyjęciu powerbanku (długość ok. 70 mm). Przewód PIR wlutować albo listwę odgiąć o 90°. Ewentualnie przegródka na y0+30, jeśli `L` szufladki na to pozwala.
- Pewność: wysoka (układ HC-SR501 jest standardowy).

## BRZEGOWE

6. Kaseta wysokości 40 = `H_IN` 40, szerokość 198 we wnętrzu 200: zero luzu w pionie przy tolerancji sklejki; przyjąć 39,4 i 1 mm na stronę (tabela luzów: ślizgowe ≥ 0,25 plus tolerancja sklejki).
7. Powerbank w szufladce bez luzu (0,1 / 0,5 / 0,1 mm w skrypcie) i bez miejsca na palce. W modelu przyjąć luz 0,5 i jedno wycięcie na palec w tylnej ściance albo w dnie.
8. Nakładanie dyni: luz 2 mm promieniowo (Ø76 w Ø80), a poniżej 40 mm otwór jest cięty nożem. Fazka na tulei jest w planie; w razie oporu poszerzyć otwór nożem.
9. Pętle USB-C (10 cm) i PIR (15 cm) leżą na stole w szczelinie 28 mm bez dna i tylna ścianka szufladki może je zgarniać. Spinka pod płytą rozwiązuje problem w kroku 2.
10. Skropliny z wnętrza dyni kapią przez rurę Ø64 prosto na łączniki (y 114–132 leży w rzucie otworu y 78–142). Znika po przesunięciu łączników (uwaga 1).
11. Druk: uchwyt czoła to nawis 8 mm pod kątem 90° (z 26–34), więc potrzebna fazka 45° od spodu; tuleja Ø76 to nowa średnica gwintu 45°/5, więc według AGENTS.md najpierw próbka ok. 10 mm.
12. Sprzeczności: w skrypcie tuleja ma nad kołnierzem `t` + 7 (od Z_PL do dna wnętrza + 10), a dynia nachodzi na kołnierz 3 mm; WYSUW 95 wobec 92 w tekście; kaseta 100 (tekst) wobec 102 (y 118–220 i lista); gniazda USB-C breakout z 5,1 kΩ (`sprzet.md`: „sprawdzić, czy jest”) brak w liście elementów, a bez niego kabel C–C z Baseusa nie poda 5 V.

## Sprawdzone, bez uwag

- Nośność płyty 18: 100 N w środku rozpiętości 200, ugięcie ok. 0,02 mm.
- Stabilność: środek ciężkości 190–220 nad stołem, połowa szerokości 118, przewrócenie przy przechyle ok. 28–30°.
- Sztywność bez dna: przy sile bocznej ok. 50 N moment na złącze ściana–płyta wynosi ok. 1 N·m, co przy 3 wkrętach 3,5 × 40 w krawędzi sklejki daje dużą rezerwę.
- Nakrętka: ciężar dyni idzie na płytę, a nie na gwint. Gwint 1,6 zwoju Ø76 trzyma tylko docisk i podrywanie przy przechyle; ścinanie zwojów jest wielokrotnie powyżej obciążenia. Docisk Ø130 na miąższ ok. 8700 mm², bez problemu.
- Wysunięcie 92: tył powerbanku jest 4,5 mm przed krawędzią płyty, więc wyjęcie od góry jest możliwe. Zapas USB 10 cm na przesuw 92 to tylko 8 mm rezerwy (patrz uwaga 9).
- Druk na X1C (szufladka 206, kaseta 198, tuleja i nakrętka płasko) mieści się bez podpór.

## Propozycje (poza zakresem)

- Keystone z zaciskiem LSA w kasecie zamiast łącznika gniazdo–gniazdo i krótkiego odcinka z Dupontami: mniej o jeden wtyk i jeden styk na żyłę, krótszy tor.

## Werdykt

Koncepcji nie należy jeszcze przyjmować. Najpierw trzeba poprawić prowadzenie skrętek i kolejność ich wpinania (uwagi 1–2), miejsce na wtyk USB-C (3), punkt odniesienia wysokości tulei (4) i dostęp do regulacji PIR (5). Wszystkie poprawki są tanie i mieszczą się w zmiennych kroku 2.
