Jesteś recenzentem ADWERSARYJNYM. Robisz PEŁNE review wstępnej koncepcji v2 (bez CAD) podstawki pod prawdziwą dynię na Halloween. Pracujesz TYLKO DO ODCZYTU: nie zmieniasz repo, bez git pull, commitów i porządków. Odpowiadasz po polsku, zwięźle.

Materiały:
- 20-analizy/2026-10-25-podstawka-koncepcja.md (koncepcja v2) i 20-analizy/2026-10-25-podstawka-koncepcja.svg (rysunek: widok z boku i z góry),
- 30-projekt/PRD.md – JEDYNE źródło wymagań (§5 podstawka, szuflada drukowana, skrętki Ethernet; §7 części; §8 poza zakresem),
- AGENTS.md (zasady projektowe: DFAM, śruby, tabela luzów, druk A1 mini ≤ 180 mm),
- 50-elektronika/sprzet.md, 50-elektronika/polaczenia.md, 50-elektronika/dynia-v2-plan.md, 20-analizy/2026-10-22-powerbank-a-obciazenie.md (elektronika, zasilanie, prądy serw, PIR).

Kontekst i decyzje użytkownika (przekazane przez PM 24–25.10, traktuj jak wymagania): dynia prawdziwa ok. 10 kg, niekupiona (szacunek Ø350–400), stoi kilka dni w szkole na powerbanku. Powerbank wymieniany z tyłu bez podnoszenia dyni; dynia przymocowana do podstawki od środka; kable przez otwór w dnie dyni. Korpus ze sklejki 18/12 mm (piła stołowa). Szuflada z powerbankiem, ESP32-C3 SuperMini i PCA9685 – drukowana. PIR HC-SR501 w podstawce z przodu, kopułka przez otwór w przedniej ściance, dostęp do 2 potencjometrów i zworki, opcjonalna drukowana osłonka zawężająca pole widzenia. Okablowanie: 3 skrętki (grupa 3–4 małych oczu lewa, prawa, duże oko 3 × MG90S); użytkownik ma ok. 10 łączników RJ45 gniazdo–gniazdo, kabel sieciowy i zaciskarkę; firmware rusza najwyżej 2 małe oczy naraz.

ZASADA: NIE dopisuj funkcji ani zabezpieczeń (odporność na dzieci, osłony, zamki, „na wszelki wypadek” – poza zakresem, PRD §8). Oceniasz, czy koncepcja SPEŁNIA te wymagania najprościej i czy ZADZIAŁA. Pomysły wykraczające poza nie wypisz osobno na końcu w sekcji „Propozycje (poza zakresem)”, bez wagi.

Sprawdź liczbowo:
1. Spełnienie wymagań: wymiana powerbanku z tyłu bez podnoszenia dyni i bez wyjmowania elektroniki; mocowanie od środka; kable przez dno; szuflada drukowana z elektroniką; PIR z dostępem do regulacji.
2. Szuflada: wymiary wobec stołu A1 mini (180 × 180), druk bez podpór, rozmieszczenie powerbanku, PCA9685, ESP32-C3, 3 łączników RJ45 (szacunek 38 × 16 × 20), wysunięcie powerbanku przez otwarte czoło, kabel USB-C (pętla na zewnątrz), wysokość wobec wnętrza 45 i luzu pod płytą (wkręty dyni nad szufladą).
3. Łańcuch wymiarów w rzucie z góry: ścianki, listwa, ogranicznik, otwór Ø80 przesunięty 65 mm do przodu, kołnierz tulei, wkręty na okręgu Ø140, uchwyt PIR – kolizje i odstępy; zgodność tabeli cięcia z rysunkiem.
4. Mocowanie dyni: wkręty od środka przez dno (długość t + 15, dno 25–55), podkładki, tuleja z kołnierzem (czy potrzebna, czy działa przy t 22–58), czy wkręty na Ø140 trafiają tam, gdzie dynia leży na płycie, otwór w dnie poza środkiem dyni.
5. Nośność i stabilność: 10 kg na płycie 18 mm 280 × 280 na ściankach obwodowych (nad szufladą bez podparcia w środku); przewracanie.
6. Okablowanie: tor PCA9685 → łącznik → skrętka → łącznik → rozdzielacz; przypisanie żył T568B (czy łącznik gniazdo–gniazdo zawsze łączy 1:1); prądy na żyłę i spadki napięcia (sprawdź rachunek: 24 AWG, Cu i CCA, 1,5 m i 0,6–0,8 m, SG90 i MG90S); czy żyły 5 V/masa w parach; podłączenie do listew PCA9685 (prąd przez piny V+ listew); długości i zapas na wysunięcie szuflady.
7. PIR: uchwyt wyjmowany do przodu, kopułka Ø23 w otworze Ø24, osłonka (wzór na kąt), wysokość nad stołem, zakłócenia od ESP32.
8. Druk każdej części: płaska strona na stół, nawisy, ≤ 180 mm.
9. Sprzeczności między tekstem, tabelami i rysunkiem.
10. Co jest przekomplikowane – co można usunąć bez utraty wymagań.

Format: każda uwaga – waga (KRYTYCZNE = nie zadziała / WAŻNE / DROBNE), miejsce, scenariusz z liczbami, poprawka albo test, pewność. Posortuj od najpoważniejszego, maks. 15 uwag. Na końcu werdykt jednym zdaniem: czy koncepcję można pokazać użytkownikowi do akceptacji, a jeśli nie, co MINIMALNIE poprawić. Potem osobno „Propozycje (poza zakresem)”.
