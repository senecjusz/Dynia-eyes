# Strona dyni: efekty i pobór prądu (szkic, 23.10)

Lista efektów do strony sterującej oczami (E7). Źródło pomysłów: zestawienie sześciu raportów `20-analizy/2026-10-23-strona-funkcje-zestawienie.md` i wybór użytkownika z 23.10. Wygląd interfejsu to osobny krok.

**Wybór użytkownika 23.10:** proste efekty, które małym dzieciom wystarczą. **Odpadają:** dźwięk z telefonu, nagrywanie ruchów syna (także klocki sekwencji), śledzenie osób radarem. Efekty, które zwiększają pobór prądu, nie są odrzucane z góry: gdy któryś okaże się za drogi, decydujemy wtedy – uprościć, zaakceptować większy pobór albo zmienić efekt.

## Jak czytać kolumny

- **Serwa naraz** – ile serw jest jednocześnie w ruchu w najgorszej chwili efektu. Firmware pilnuje jednego wspólnego limitu dla całej dyni (dziś 3–4 serwa, decyzja z analizy zasilania); efekt, który chciałby więcej, idzie kaskadą.
- **Pobór** – klasa obciążenia powerbanku:
  - **N** (niski) – krótkie ruchy 1–2 serw, długie postoje;
  - **Ś** (średni) – 2–3 serwa naraz, krótko, albo 1 serwo ciągle;
  - **W** (wysoki) – 3–4 serwa naraz albo ciągły ruch 2–3 MG90S dużego oka.
- **Liczby orientacyjne (szacunki ze źródeł, niezmierzone):** SG90 w ruchu ok. 100–250 mA, na postoju kilka mA; MG90S w ruchu ok. 150–300 mA; ESP z Wi-Fi ok. 100 mA. Pod obciążeniem złożonego mechanizmu prąd będzie wyższy – liczby do korekty po pomiarze na wydrukowanym oku. Szczyt prądu = suma serw w ruchu; o czasie pracy powerbanku decyduje średnia.
- **DO** – wymaga dużego oka; bez niego efekt działa w wersji uproszczonej na małych oczach albo wcale.

## Sterowanie palcem

| Efekt | Co robi | Serwa naraz | Pobór | DO |
|---|---|---|---|---|
| Pacynka | Palec na padzie prowadzi duże oko, stuknięcie = mrugnięcie, suwak = rozwarcie powiek | 2–3 | Ś (W przy ciągłym kręceniu) | tak |
| „Wszyscy tam!” | Stuknięcie w kierunek na rysunku dyni: oczy kolejno, parami, patrzą w tę stronę (każde w granicy ±25°) | ≤ 4, kaskada | Ś | nie (lepiej z DO jako liderem) |
| Lider i stado | Styl ruchu grupowego: duże oko rusza pierwsze, małe dochodzą parami od najbliższych | ≤ 4, kaskada | Ś | lepiej tak |
| Pianino oczu (bez dźwięku) | Każde oko to klawisz na rysunku dyni; dotyk obraca to oko, przeciągnięcie palcem po łuku wychyla kolejne | 1–3 | N–Ś | nie |
| Rysowanie trasy | Syn rysuje kółko albo ósemkę, duże oko jedzie po wygładzonej trasie | 2 ciągle | Ś–W | tak |
| Tryb magika | Ekran wygląda niewinnie, ukryte strefy wywołują lewo / prawo / mrugnij / „Bu!” – syn „rozkazuje dyni myślą” | jak wywołany efekt | jak efekt | lepiej tak |

## Efekty małych oczu

| Efekt | Co robi | Serwa naraz | Pobór | DO |
|---|---|---|---|---|
| Fala | Spojrzenie obiega dynię od oka do oka; warianty: tam i z powrotem, od środka, domino; kierunek i tempo palcem | 1–3 | N–Ś | nie |
| „Latające” oczy | Małe: fala dookoła dyni (spojrzenie „przelatuje”); duże: łuk z lewa przez dół do góry, patrzenie w dół, krążenie dookoła | małe 1–3, duże 2 ciągle | Ś (W gdy duże krąży długo) | duże tak |
| Zez | Oczy zbiegają się do osi dyni | 2–4, kaskada | N (krótko) | nie |
| Rozbiegane / spłoszenie | Oczy rozbiegają się na boki „jakby coś wybuchło”, krótkie nerwowe sakady z twardym limitem czasu | ≤ 4 | Ś–W (krótko) | nie |
| Kłótnia sąsiadów, plotka | Para zerka ku sobie i odwraca się obrażona; „szept” wędruje po obwodzie; duże oko przyłapuje | 1–2 | N | lepiej tak |
| Mecz tenisa / mucha | Wyimaginowana piłka albo mucha: oczy odwracają się, gdy minie ich kierunek | 1–3 | Ś | lepiej tak |
| Znajdź buntownika | Jedno oko patrzy w drugą stronę albo łypie, dzieci zgadują które; „ile oczu spojrzało w lewo?” | 1–4, grupami | N | nie |

## Duże oko jako postać

| Efekt | Co robi | Serwa naraz | Pobór | DO |
|---|---|---|---|---|
| „Bu!” / zasadzka | Dynia udaje uśpioną, po chwili duże oko otwiera się szeroko na wprost, po 0,2–0,3 s małe kaskadą; przerwa ochronna między „Bu!” | 3 (DO), potem 2–3 małe | W (krótko) | tak (bez DO: same małe kaskadą) |
| Zdziwienie (double-take) | Oko mija cel, wraca, dwa mrugnięcia, pełne otwarcie, potem małe kaskadą | 3, potem małe | Ś–W (krótko) | tak |
| Przewracanie oczami | Łuk pod półprzymkniętą powieką, potem „westchnienie” | 2–3 | Ś | tak |
| Zasypianie i budzenie | Powieki opadają skokami, oko w dół, małe po kolei na środek; budzenie „jeszcze 5 minut” albo zryw | 1–3, wolno | N | tak (małe: część bez DO) |
| Emocje na przycisk | Senny, ciekawski, podejrzliwy (wolny skan spod przymkniętej powieki), przestraszony, złośliwy, znudzony – zestawy parametrów: rozwarcie, sakady, fiksacja, mruganie | 1–3 | N–Ś | tak |
| Charakter dnia i imię | Syn nadaje dyni imię i osobowość na dzień (nieśmiała, wścibska, śpiąca…) – inne parametry tego samego ruchu | jak tryb automatyczny | N–Ś | tak |
| Hipnoza | Duże oko kręci wolne koła albo elipsę, małe w zezie | 2–3 ciągle | W | tak |
| „Szef ucisza bunt” | Duże oko śpi, małe rozrabiają; nagle duże otwiera się groźnie i małe stają na baczność | etapami ≤ 4 | Ś–W | tak |
| Podglądanie | Gdy nikt nie steruje, co jakiś czas powieki uchylają się i oko skanuje | 1–2 | N | tak |
| Mrugnięcia i mikroruchy | Mrugnięcia losowe, przy dużej sakadzie, podwójne, senne; drobne ruchy ±2–3° | 1 | N | tak |
| Kichnięcie, sakada kreskówkowa | Krótkie gagi: oko „kicha” (zamknięcie + szarpnięcie), sakada z przelotem i cofnięciem | 1–3 | Ś (krótko) | tak |
| „Obrażona dynia” | Gdy firmware odmawia (za dużo naraz), dynia odwraca wzrok i mruży oko zamiast błędu | 1–2 | N (zmniejsza pobór) | lepiej tak |

## Gry i sztuczki

| Efekt | Co robi | Serwa naraz | Pobór | DO |
|---|---|---|---|---|
| Wyrocznia tak / nie | Dzieci pytają, syn po cichu wybiera: kiwnięcie, kręcenie albo przewracanie oczami; bez DO kaskada małych | 2–3 | N–Ś | lepiej tak |
| Simon | Dynia pokazuje sekwencję ruchów oczu, dziecko powtarza na rysunku dyni; z rundą dłuższa | 1–2 | N | nie |
| Refleks / pojedynek spojrzeń | Duże oko otwiera się w losowej chwili, wygrywa, kto pierwszy stuknie; albo „kto pierwszy mrugnie” | 1 | N | tak |
| Baba Jaga (ręcznie) | Oko zamknięte, dzieci się skradają; syn odpala otwarcie i „przyłapanie” | 1–3 | N–Ś | tak |
| Powitanie właściciela | Telefon syna albo sekretny gest wywołuje autorskie powitanie: fala i kocie mrugnięcie | ≤ 4, kaskada | Ś (krótko) | lepiej tak |
| Tryb trolla | Przed podaniem telefonu koledze syn odwraca sterowanie; po chwili „awaria, dmuchnij w oko” i wytrzeszcz | jak sterowanie | jak sterowanie | tak |
| Przeciąganie liny wzrokiem | Dwa telefony stukają, oczy przechylają się ku szybszemu | ≤ 4 | Ś–W | nie (2 telefony) |
| Sekretne efekty | Część efektów odblokowuje się sekretną kombinacją albo wynikiem w grze | – | – | – |
| Fotka z odliczaniem | Odliczanie na ekranie, w chwili zdjęcia wszystkie oczy w jedną pozę | ≤ 4, kaskada | Ś (krótko) | lepiej tak |
| Liczniki dyni | „Dynia zrobiła dziś 48 213 ruchów”, rekord straszeń | 0 | – | nie |

## Fundament (pod wszystkie efekty, z zestawienia)

- Jedna kolejka ruchu w ESP ze wspólnym limitem serw i prędkości; strona wysyła „co zrobić”, nigdy surowe impulsy.
- Bez sygnału z telefonu oczy płynnie wracają do pokazu automatycznego (heartbeat).
- Role i dostęp: syn / gość / rodzic (PIN), tryb wystawowy; punkt dostępu z limitem 3–4 klientów (dziś testy mają 1 – do zmiany, potem powtórzyć test podtrzymania powerbanku).
- Serwis: kalibracja środków, wyłączenie uszkodzonego oka, start bez skoku, „Parkuj”.

## Otwarte

- Pomiar prądu na wydrukowanym, złożonym oku (pod obciążeniem), potem korekta klas poboru.
- Pozostałe decyzje z zestawienia (kto się łączy i ilu klientów, HTTPS później, zdejmowanie PWM w uśpieniu).
