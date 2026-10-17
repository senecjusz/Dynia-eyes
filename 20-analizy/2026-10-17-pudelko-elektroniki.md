# Pudełko na powerbank i elektronikę

Pomysł użytkownika: drukowane pudełko na powerbank i elektronikę, z **szczelnymi przepustami kablowymi** (są w warsztacie).

## Zawartość

| Element | Wymiary |
|---|---|
| Powerbank Baseus PPAP20K | 153,5 × 69 × 29,6 mm |
| (zapas: Manta MPB2001S) | do zmierzenia; pudełko projektujemy pod większy z dwóch albo z wkładką dystansową |
| Arduino Nano | ~45 × 18 mm |
| PCA9685 | ~62 × 25 mm, plus złącza serw wystające do góry ~12 mm |
| Kondensator 1000 µF, kable USB | — |

Wnętrze pudełka szacunkowo: **~175 × 95 × 60 mm**, do potwierdzenia w CAD.

## Gdzie je postawić – ustalone: **w środku dyni**

Decyzja użytkownika: pudełko z Nano, PCA9685 i powerbankiem jest **w środku dyni**. Wyprowadzenie powerbanku i włącznika na podstawkę pod dynią to **rozszerzenie opcjonalne** (patrz [plan realizacji](../30-projekt/plan-realizacji.md)).

**Czy się zmieści?** Dynia 25–27 cm ma wnętrze o promieniu ~12 cm. Moduły oczu wchodzą do środka na ~5 cm, więc wolny środek ma promień ~7 cm. Pudełko leżące (~18 cm) się nie zmieści, ale **postawione pionowo** jak wieża (podstawa ~95 × 45 mm, wysokość ~175 mm) zajmuje promień ~5 cm i mieści się na dnie dyni pośrodku. Otwór z pokrywką musi mieć **≥ 11 cm**, żeby pudełko przeszło.

**Wymiana powerbanku:** zdjąć pokrywkę dyni, otworzyć górną klapę wieży i wysunąć powerbank. Wtyczki serw zostają na miejscu.

**Wilgoć:** przy 1–2 tygodniach wystarczy zamknięte pudełko z jednym otworem na kable od dołu, osłoniętym kapturkiem, albo jeden przepust z gumową przelotką na całą wiązkę. Wtyczek serw nie przeciśniemy przez małe dławiki, więc wtyczki zostają **w środku pudełka**, wpięte w PCA9685, a na zewnątrz wychodzą tylko przewody przedłużaczy.

## Okablowanie – minimum

- **Przedłużacze serw 3-pin** (30–50 cm) bezpośrednio z PCA9685 do każdego modułu. Są gotowe, tanie i nie trzeba lutować. Do sprawdzenia, ile ich jest w warsztacie.
- Numeracja: kanał PCA9685 = numer modułu (naklejka na wtyczce i na module).
- **Skrętka i zbiorcze złącza** to rozszerzenie opcjonalne. RJ45 ma 8 żył, czyli starczy na 2 serwa na kabel, ale cienkie żyły słabo nadają się do zasilania serw. Ma to sens dopiero przy wielu oczach i wielokrotnym montażu.

## Przepusty

- 1 × wiązka kabli serw do dyni (przedłużacze serw z PCA9685),
- 1 × kabel PIR (czujnik w dyni albo na froncie podstawy),
- ewentualnie 1 × USB do ładowania bez otwierania.

## Do ustalenia

1. **Rozmiar stołu drukarki.** Pudełko ~185 × 105 mm plus ścianki mieści się w typowym stole 220 × 220.
2. **Rozmiar przepustów** (np. PG7 / PG9 / M12 / M16).
3. **Gdzie stoi dynia:** na zewnątrz (deszcz) czy pod dachem / w środku?
4. Ile przedłużaczy serw jest w warsztacie?
