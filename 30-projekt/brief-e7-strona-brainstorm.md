# Brief E7.1: burza mózgów – co ma umieć strona sterująca oczami dyni (22.10)

Dla czterech niezależnych uczestników: **Opus A**, **Opus B**, **Astra (Codex, OpenAI)**, **Grok (xAI)**. Każdy pracuje osobno, na tym samym briefie, i nie widzi pozostałych. Każdy prowadzi u siebie **trzy niezależne tory pomysłów** (trzech subagentów, jeśli narzędzie to umożliwia, a jeśli nie – trzy osobne podejścia z różnych perspektyw, opisane niżej), a potem sam łączy je w jedną listę. Tylko do odczytu w repo: bez `git pull`, commitów, pushy i zmian w plikach. Piszesz po polsku.

## Po co

Dynia na Halloween z ruchomymi oczami, robiona przez użytkownika (doświadczony konstruktor, elektronik, drukarz 3D) z synem (8 lat). Dynia stanie na wystawie w szkole na kilka dni, przy niej będą dzieci. Użytkownik chce **strony internetowej serwowanej przez sam układ**: telefon łączy się z Wi-Fi dyni i otwiera stronę, z której można sterować małymi oczami i dużym okiem, odpalać efekty i „bawić się” dynią. Syn ma iPhone'a, więc **strona w Safari, nie aplikacja**.

Użytkownik 22.10: „Zakładam, że ta strona może w jakiś sposób sterować tymi małymi oczkami oraz tym dużym okiem. […] jakieś customowe efekty albo jakieś dodatkowe rzeczy sterowania tym dużym okiem […], żeby można by się tym trochę więcej pobawić. […] coś fajnego, skustomizowanego dla synka. Oddzielnym elementem jest projektowanie samego interfejsu, natomiast najpierw trzeba wiedzieć, co chcemy tam pokazać.”

**Twoje zadanie: co strona ma umieć** – funkcje, tryby, efekty ruchu oczu, zabawy. **Nie projektujesz wyglądu interfejsu** (to osobny etap) ani kodu.

## Sprzęt i ograniczenia (fakty z repo)

Przeczytaj: `30-projekt/opis.md`, `30-projekt/decyzje.md`, `50-elektronika/README.md`, `50-elektronika/sprzet.md`, `50-elektronika/polaczenia.md`, `50-elektronika/oczy-ruch/oczy-ruch.ino` (obecny program ruchu: sakady, fiksacje, tryby spoczynek/aktywny, ruchy grupowe), `20-analizy/2026-10-18-wykrywanie-ruchu.md`, `20-analizy/2026-10-18-prezentacja-w-szkole.md`, `20-analizy/2026-10-22-duze-oko-2c-koncepcja.md` (duże oko – koncepcja w trakcie review, może się zmienić).

- **Sterownik:** ESP32-C3 SuperMini (jeden rdzeń RISC-V 160 MHz, ok. 400 KB RAM, Wi-Fi 2,4 GHz, bez Bluetooth Classic) + PCA9685 (16 kanałów PWM, I²C).
- **Małe oczy:** ok. 10 modułów, każdy = piłeczka 40 mm na 1 × SG90, **tylko lewo–prawo** (±25°), bez powiek. Rozmieszczone na dyni (przód i boki).
- **Duże oko** (projekt w toku): gałka Ø60, **lewo–prawo i góra–dół**, **dwie powieki z jednego serwa** (otwieranie/zamykanie razem), 3 × MG90S.
- **Czujnik (planowany):** radar HLK-LD2450 – podaje położenie osób (kąt, odległość); decyzja: duże oko śledzi ludzi, otwiera się, gdy ktoś podejdzie.
- **Wi-Fi:** ESP działa jako punkt dostępu (bez internetu, bez routera szkoły). Od 22.10 punkt dostępu jest włączony stale, bo podtrzymuje powerbank (bez Wi-Fi powerbank się wyłączał).
- **Zasilanie:** powerbank 5 V przez USB; w ruchu naraz najwyżej ok. 3–4 serwa w całej dyni.
- **Serwa SG90/MG90S nie znają pozycji:** żadnych gwałtownych skoków; ruch płynny, start łagodny. Zakres małych oczu ±25° (ograniczniki mechaniczne ±33°).
- **Wystawa:** kilka dni, dzieci dotykają dyni; strona nie może pozwolić obcym dzieciom zepsuć mechanizmu ani wyłączyć dyni (np. hasło dla rodzica, tryb pokazowy).

## Trzy tory pomysłów (każdy uczestnik prowadzi wszystkie trzy)

1. **Syn 8 lat i jego koledzy:** co będzie dla nich najfajniejsze – gry, żarty, „straszenie”, sterowanie palcem, nagrywanie własnych sekwencji, dźwięk z telefonu, reakcje na głos/ruch telefonu (żyroskop w Safari), rywalizacja, efekt „wow” przy innych dzieciach.
2. **Choreografia oczu i duże oko jako postać:** efekty ruchu (wszystkie oczy patrzą w jedno miejsce, fala, zez, „przewracanie oczami”, mruganie, zasypianie, zdziwienie, śledzenie palca na ekranie, śledzenie osoby z radaru), emocje i charakter dużego oka, scenki na kilka sekund.
3. **Rodzic, wystawa i niezawodność:** tryby (pokaz automatyczny, sterowanie ręczne, kalibracja, diagnostyka: bateria, restarty, stan serw), bezpieczeństwo (kto może sterować), co się dzieje, gdy nikt nie steruje, ustawienia na kilka dni wystawy.

## Czego oczekuję

Plik raportu (ścieżka niżej), w nim:

1. **Lista pomysłów** z wszystkich trzech torów, po połączeniu duplikatów. Dla każdego: nazwa, co robi (1–2 zdania), dla kogo (syn / dzieci na wystawie / rodzic), „wow” dla 8-latka (1–5), trudność wykonania (1–5), czy potrzebuje dodatkowego sprzętu (radar, głośnik, nic), ryzyko dla mechaniki lub zasilania (np. zbyt wiele serw naraz, szarpanie).
2. **Top 10** z uzasadnieniem i podziałem: „na tę Halloween” vs „później”.
3. **Pomysły odrzucone** (np. niewykonalne na ESP32-C3 albo w Safari) z jednym zdaniem dlaczego – żeby nie wracały.
4. **Ograniczenia techniczne**, które wpływają na funkcje: co Safari na iPhonie pozwala (dostęp do żyroskopu, mikrofonu, wibracji, pełny ekran, strona z punktu dostępu bez internetu), co udźwignie ESP32-C3 (WebSocket, liczba klientów, opóźnienie).

Bez prognoz czasu pracy i terminów. Fakty (źródło, link) oddzielaj od założeń.

## Plik raportu

- Opus A → `20-analizy/2026-10-22-strona-brainstorm-opus-a.md`
- Opus B → `20-analizy/2026-10-22-strona-brainstorm-opus-b.md`
- Astra → `20-analizy/2026-10-22-strona-brainstorm-astra.md` (Astra pracuje w sandboksie tylko do odczytu: raport podaje jako odpowiedź, orkiestrator zapisuje plik)
- Grok → `20-analizy/2026-10-22-strona-brainstorm-grok.md` (jak Astra)

Orkiestrator połączy cztery raporty w jedną listę do wyboru przez użytkownika; projekt interfejsu jest następnym, osobnym krokiem.
