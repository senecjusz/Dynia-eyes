# Duże oko z powieką w jedną noc (poziom 2b, gotowe na 2c)

Cel: **jedna droga, która działa za pierwszym razem**: projekt w Onshape → druk na X1C → montaż → kalibracja przez telefon. Liczby to wartości startowe do Variable Studio, nie pewniki.
Podstawy: [mechanizm oka](2026-10-17-mechanizm-oka/README.md), [wariant F](2026-10-17-mocowanie-malego-oka.md), [śruby](2026-10-17-mocowanie-pileczki-sruby.md), [wykrywanie ruchu](2026-10-18-wykrywanie-ruchu.md).

## 1. Gałka: Ø 60 mm, drukowana

| Opcja | Otwór w dyni | Ocena |
|---|---|---|
| Ø 45 (jak gotowe projekty) | ~68 mm | prawie jak małe oko (40) – nie robi wrażenia „dużego” |
| **Ø 60** | **~83 mm**, rant ~Ø 96 | **wybór:** 1,5 × małe oko, mieści się w pasie ~14 cm frontu dyni 25–27 cm, z boków zostaje miejsce na małe oczy |
| Ø 70–80 (research) | ~95–105 mm, rant ~110 | zajmuje cały front; z przodu zostają 2–4 małe oczy, za mało miejsca na mechanizm w środku obok wieży |

- **Materiał:** druk PLA biały, czasza 210° (15° za równik, tył otwarty Ø ~54), ścianka 2 mm, źrenicą do góry. Tęczówka/źrenica kolorem z AMS albo farbą. Gotowa kula (bombka akrylowa) odpada: trzeba w niej wiercić i kleić mocowania.
- Średnica jako zmienna `#kulaD` – zmiana na 55 albo 65 mm to edycja jednej liczby. **Przed CAD:** przyłożyć do dyni kartonowe kółko Ø 96 (rant) i Ø 72 (rant małego oka).

## 2. Architektura 2b → 2c (bez przeprojektowania)

| Element | Rozwiązanie | Dlaczego |
|---|---|---|
| Podparcie gałki | **Kardan w środku kuli** na nieruchomym **Słupku** z tyłu: oś pozioma (góra–dół) + oś pionowa (lewo–prawo). Gotowy metalowy przegub kardana 5 mm z warsztatu albo drukowany **Krzyżak** na 2 × 2 śruby M3 | Zasada Cogleya (Simplified Eye / EyeMech) – sprawdzona w tysiącach wydruków |
| Napęd gałki | 2 **cięgna wzdłużne** (przód–tył) z serw z tyłu do 2 punktów **Uchwytu gałki**: punkt X leży na osi poziomej kardana, punkt Y na osi pionowej (r ≈ 20 mm) | Punkt na osi jednego ruchu nie przesuwa się w drugim ruchu, więc osie się nie mieszają i wystarczą zwykłe śruby z luźnym otworem, bez przegubów kulowych |
| Powieki | Obie na **tej samej poziomej osi przez środek kuli**: 2 × M3 przez ścianę Rury (ciasno), powieki luźno. Ucha napędowe obu powiek **po jednej stronie** (górna na zewnątrz, dolna pod nią) | Koncentryczne czasze nie ocierają przy żadnej pozycji gałki |
| **2b** | Dolna powieka zablokowana śrubą **Ustalacz** (M3 przez Rurę w jej ucho) | Ta sama część co w 2c |
| **2c** | Wykręcić Ustalacz, dołożyć **Cięgno powieki dolnej** na przeciwne ramię orczyka podwójnego (promień 8–10 mm vs 14–16 mm górnej) | Tylko 1 nowa część drukowana, zero zmian w Rurze i Płycie |

| MG90S | Rola | Kanał PCA9685 (propozycja) |
|---|---|---|
| #1 | lewo–prawo (±25°) | 13 |
| #2 | góra–dół (±15°) | 14 |
| #3 | powieka górna (w 2c: obie) | 15 |
| #4 | zapas (wymiana w szkole) | – |

Kanały 0–12 zostają dla małych oczu (max 13 na jednym PCA9685).

## 3. Mocowanie w dyni: F przeskalowany i scalony z ramą, bez bagnetu

- **Rura z rantem i gwintem = gniazdo F** (te same operacje: Helix + Sweep, nowe zmienne). W Rurze siedzą osie powiek, z tyłu przykręcona **Płyta serw** ze Słupkiem.
- **Cały moduł wkłada rodzic od zewnątrz**, od środka nakręca **Nakrętkę** (tym samym kluczem-grzechotką, jeśli średnica pozwala; inaczej skrzydełka). Wszystko za rantem mieści się w obrysie Ø 76, więc przechodzi przez otwór, a Nakrętka (otwór ~Ø 80) przechodzi nad serwami.
- **Bez bagnetu:** duże oko montuje się raz, a bagnet w skali Ø 80 to kolejne dopasowanie zatrzasku – na jedną noc za dużo ryzyka.

| Parametr | Wartość |
|---|---|
| Powieka: wewn. / zewn. | R 31,2 / R 33,4 (luz 1,2, ścianka 2,2; przedni rant pogrubiony do 3,5) |
| Rura wewn. / zewn. | Ø 70 / Ø 76 (łby śrub osi powiek: niskie, w szczelinie między Rurą a miąższem) |
| Gwint (tylko tylny odcinek) / **otwór w dyni** | Ø ~79 / **Ø 83** (otwornica albo nóż wg drukowanego Szablonu) |
| Rant zewn. / kołnierzyk | Ø ~96 / Ø 66 (wewnętrzny brzeg = „oczodół”) |
| Środek kuli pod powierzchnią rantu | 8 mm (gałka wystaje ~22 mm) |
| Docisk ścianki | 15–35 mm, jak w F |
| **Gdzie** | front, na osi symetrii, środek oka ~55–60 % wysokości dyni (nad „równikiem”); poniżej miejsce na radar/PIR jako „nos” lub w ustach |
| Małe oczy | środki ≥ 100 mm od środka dużego oka → po 2–3 z każdej strony, reszta na bokach |
| Wieża w środku | wolne ~65 mm za wewnętrzną ścianką; moduł zajmuje **≤ 55 mm** → wieża węższym bokiem do oka, sprawdzić w Assembly z bryłą PODGLAD wieży |

## 4. Party (Onshape), połączenia, druk na X1C

| Part | Połączenia (ciasno = część stoi, luźno = część się obraca) | Druk X1C (PLA 0,2) |
|---|---|---|
| **Rura** (rant + kołnierzyk + gwint) | osie powiek 2 × M3×8 ciasno Ø 2,6; Ustalacz M3×8; Płyta serw 3 × M3 we **wkładkach** (rozkręcamy) | rantem do stołu, ~2 h |
| **Nakrętka** | – | płasko, ~40 min |
| **Płyta serw** + **Słupek** (jedna część) | 3 × MG90S wkrętami z kompletu / M2 do wkładek M2; Słupek: oś kardana M3 ciasno albo M5 jako czop pod gotowy przegub | ~1,5 h |
| **Krzyżak** (jeśli bez gotowego kardana) | 4 × M3 luźno Ø 3,3 | ~10 min |
| **Uchwyt gałki** | oś kardana M3 ciasno; do Gałki 2 × M3 do wkładek; punkty X/Y: M3 ciasno | ~20 min |
| **Gałka** | 2 wkładki M3 w żebrach | źrenicą w górę, 0,16, ~1,2 h |
| **Powieka górna**, **Powieka dolna** | ucha luźno Ø 3,3 na osiach; ucho napędowe M3 ciasno | pionowo, 4 obrysy, ~40 + 35 min |
| **Cięgno X**, **Cięgno Y**, **Cięgno powieki** (2c: **Cięgno powieki dolnej**) | luźno Ø 3,3 na obu końcach; orczyk: otwór rozwiercony do 2,5 + M3 albo M2 z nakrętką | płasko, 50 % wypełnienia, ~20 min razem |
| **Ustalacz** (śruba, nie Part), **Szablon otworu** | – | Szablon ~15 min |
| PODGLAD: MG90S ×3, orczyk, wieża | tylko do kolizji | nie drukować |

**Razem ~7 h** → jedna płyta na noc. Najpierw **kupon testowy** (~20 min): otwory M3 ciasny/luźny, otwór wkładki M3 i M2, kieszeń MG90S, kawałek gwintu.

## 5. Plan jednej nocy

| Krok | Czas | Gotowe, gdy | STOP, jeśli… |
|---|---|---|---|
| 0. Pomiary: MG90S, orczyki, wkładki, gotowy kardan; karton na dyni | 20 min | liczby w Variable Studio | rant Ø 96 wygląda źle na dyni → `#kulaD` 55 |
| 1. CAD: zmienne → Gałka, Powieki, Rura (skopiowane foldery F) | 1,5 h | czasze koncentryczne, osie przez środek kuli | – |
| 2. CAD: Słupek, kardan, Uchwyt, Płyta serw, cięgna; Assembly z mate'ami | 1,5 h | ±25° / ±15° / powieka 0–75° bez kolizji | o 21:30 brak ruchu bez kolizji → **2a**: oś pozioma kardana zablokowana śrubą, serwo #2 nie montowane |
| 3. Kupon testowy | 20 min | śruby trzymają, wkładki wchodzą | złe pasowania → poprawić zmienne, nie szkice |
| 4. Druk całości (noc) | ~7 h | – | odklejenie Rury → najpierw wydrukować mechanizm, Rurę osobno |
| 5. ESP32: serwa na 90° przed założeniem orczyków | 15 min | orczyki prostopadle do cięgien | – |
| 6. Montaż na stole (bez dyni) | 1–1,5 h | ruch ręką lekki, bez luzu kardana, powieka nie ociera | powieka ociera → zwiększyć `#luzPowieka` i drukować tylko powieki (~1 h) |
| 7. Kalibracja przez telefon | 30 min | zapisane limity i pozycje | serwo buczy na końcu → zawęzić limit, nie dociskać |
| 8. Dynia (27.10, rodzic) | 30 min | Szablon → otwór → moduł → Nakrętka | – |

## 6. Firmware i strona kalibracji

| Element | Co musi być |
|---|---|
| Na każde serwo | min / środek / max w µs, odwrócenie kierunku; zapis w NVS (`Preferences`); twarde ograniczenie przed każdym zapisem do PCA9685 |
| Powieka | pozycje **zamknięta** i **otwarta** (osobno, nie z limitów); w 2c jedna wartość serwa = obie powieki |
| Mruganie | zamknięcie ~120 ms, otwarcie ~200 ms, losowo co 3–8 s, czasem podwójne; przycisk „test mrugnięcia” |
| Sprzężenie z góra–dół | otwarcie powieki = `otwarta + k · pitch` (patrzy w górę → powieka wyżej, w dół → niżej), `k` i obcięcie do zakresu na stronie |
| Ruch | limit prędkości ~120°/s, max 4 serwa naraz, wygładzanie; martwa strefa ±5° przy radarze |
| Stany | brak ludzi → oko na wprost, powieka zamknięta, PWM wyłączony po 2 s (cisza, mniej prądu); ktoś jest → otwarcie, rozglądanie (później radar LD2450) |
| Start | po włączeniu najpierw pozycja „zamknięta / na wprost” i powolne dojście (serwo skacze do pierwszego impulsu) |
| Strona | suwaki na żywo dla #1–#3, przyciski „zapisz min / środek / max / zamknięta / otwarta”, „test sekwencji”, eksport ustawień jako tekst do repo |

## 7. Top 5 ryzyk

| # | Ryzyko | Jak ograniczyć |
|---|---|---|
| 1 | Kolizje cięgien z tylną krawędzią gałki i serw w obrysie Ø 76 | Assembly z mate'ami i PODGLAD MG90S **przed** drukiem; cięgna przez otwór Ø 54, punkty r ≈ 20 |
| 2 | Powieka napędzana z jednego boku przekosza się i ociera | luz 1,2–1,5, pogrubiony rant 3,5 mm, ucho napędowe przy osi; test ręczny przed podłączeniem serwa |
| 3 | Brak miejsca: front dyni i wieża w środku | karton Ø 96 na dyni, bryła wieży w Assembly, `#kulaD` jako jedna zmienna |
| 4 | Szarpnięcia i spadki napięcia (MG90S zablokowane ~0,7–1 A) | miękki start, limity programowe, kondensator przy PCA9685, PWM off w spoczynku |
| 5 | Jedna iteracja druku | kupon testowy, wszystko na zmiennych, plan B **2a** (blokada osi góra–dół), zapasowe powieki |

## Inspiracja (bez kopiowania plików)

Will Cogley – [EyeMech / Simple Eye Mechanism](https://willcogley.notion.site/EyeMech-1-0-983e6cad7059410d9cb958e8c1c5b700) (kardan + cięgna, MG90S). **Licencji nie udało się potwierdzić** (strona się nie wczytała) – projekty Cogleya są zwykle na licencji niekomercyjnej. Bierzemy tylko zasadę działania i rysujemy własne Party w skali Ø 60, więc licencja nas nie ogranicza. Pliki gotowe (Ø ~30–45, dwoje oczu) nie pasują do naszej skali ani do mocowania w dyni.

## Do potwierdzenia z użytkownikiem

1. Ø 60 mm (otwór 83, rant 96) – zgoda po przyłożeniu kartonu do dyni?
2. „Przegub 3 mm i 5 mm” z warsztatu – to kardan (krzyżak)? Jeśli tak, służy jako środek gałki.
3. Czy X1C ma AMS (tęczówka w kolorze z druku)?
4. Ile realnie małych oczu z przodu przy dużym oku: 4–6 z przodu + reszta na bokach – OK?
