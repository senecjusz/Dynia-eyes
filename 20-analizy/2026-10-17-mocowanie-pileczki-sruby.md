# Mocowanie piłeczki i połączenia ruchome – na śruby M3/M4

**Założenie użytkownika (2026-10-17):** części drukowane + **zwykłe śruby M3 i M4** (są w warsztacie w różnych długościach). Bez kleju, drutu i drukowanych czopów jako osi. Śruby skręca rodzic przy montażu modułu, syn ich nie dotyka.

## Zasada otworów (z researchu, sekcja 4.2 whitepapera)

| Śruba | Otwór „ciasny” (śruba się wkręca, element stoi) | Otwór „luźny” (element obraca się na śrubie) |
|---|---|---|
| M3 | Ø 2,5–2,8 mm | Ø 3,2–3,3 mm |
| M4 | Ø 3,5–3,7 mm | Ø 4,2–4,3 mm |

Każde połączenie obrotowe to para: **ciasno w części nieruchomej, luźno w ruchomej**. Bez nakrętek na przegubach (odkręcają się). Ewentualnie nakrętka zabezpieczająca w kieszeni w nieruchomej części, jeśli wkręt w plastiku nie trzyma.

## Połączenia w module małego oka

| Połączenie | Rozwiązanie | Śruba |
|---|---|---|
| **Oś oka (pionowa): jarzmo ↔ tuleja** | 2 śruby od góry i od dołu przez tuleję: ciasno w tulei, luźno w jarzmie. Łeb schowany w pogłębieniu (tuleja wchodzi w gniazdo) | 2 × M3 (długość = ścianka tulei + oczko jarzma, np. M3×8–10) |
| **Piłeczka ↔ jarzmo** | Patrz niżej, wariant P1 (zalecany) | M3 |
| **Korba jarzma ↔ cięgno** | Śruba ciasno w korbie, luźno w cięgnie | M3 × 6–8 |
| **Cięgno ↔ orczyk SG90** | Orczyk ma otwory ~Ø 1,5 mm. Rozwiercić skrajny do Ø 2,5 i wkręcić M3, albo użyć wkrętu M2 | M3 (lub M2) |
| **Serwo ↔ tuleja** | Uszy SG90 na 2 wkręty z zestawu serwa albo M2 / M2,5 w ciasne otwory | z zestawu |

## Piłeczka ↔ jarzmo – warianty

Ścianka piłeczki ma ~0,4 mm, więc **gwint w niej nie trzyma**, a śruba może co najwyżej przechodzić przez otwór.

### P1. Śruby-osie przez bieguny piłeczki (zalecany)
- W piłeczce 2 otwory Ø 3,2 na biegunach (góra i dół), wiercone w **drukowanym przyrządzie** (kołyska na piłeczkę z tulejkami prowadzącymi), żeby były dokładnie naprzeciw siebie.
- Śruby z P1 to **te same 2 × M3, które tworzą oś oka**: przechodzą przez tuleję, wkręcają się ciasno w jarzmo i wchodzą swoimi końcami w otwory piłeczki. Jarzmo i piłeczka obracają się razem, a tuleja jest nieruchoma. Wtedy **jarzmo ciasno, tuleja luźno**, czyli odwrotnie niż w tabeli wyżej, i obrót dzieje się na śrubie w tulei.
- Piłeczka siedzi na końcówkach śrub, a jarzmo zapewnia napęd. Ścianka piłeczki nie przenosi momentu, bo moment idzie przez jarzmo i śruby, a piłeczka jest tylko „nawleczona”.
- **Blokada obrotu piłeczki względem jarzma:** dwa punkty podparcia na osi nie blokują obrotu kuli wokół tej osi, więc potrzebny jest trzeci punkt. Wystarczy drukowany kołek z jarzma w otwór Ø 3 z tyłu piłeczki, albo trzecia śruba M3 od tyłu przez jarzmo w otwór piłeczki.

### P2. Piłeczka zaciśnięta w dzielonym jarzmie
- Jarzmo z 2 połówek skręcanych 2 × M3, z gniazdami sferycznymi R20 obejmującymi piłeczkę na biegunach. Tarcie przenosi moment.
- Bez wiercenia piłeczki, ale ryzyko poślizgu i zgniecenia piłeczki przy mocnym dokręceniu.

### P3. Kosmo (widełki na wale serwa, śruby M3 w boki piłeczki)
- Wymaga serwa na osi oka, czyli w środku tulei nad lub pod piłeczką. Tuleja byłaby większa, a otwór w dyni rósłby. **Odpada** przy układzie „serwo z tyłu”.

## Do sprawdzenia na wydruku
1. Gdzie wystarczy M3 wkręcone ciasno w plastik, a gdzie dać **wkładkę do wtapiania** (są w warsztacie): wszędzie tam, gdzie moduł będzie rozkręcany.
2. Luz piłeczki na końcówkach śrub, czyli brak bicia przy ruchu.
3. Przyrząd do wiercenia piłeczki: powtarzalność otworów.
