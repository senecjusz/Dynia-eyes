# Brief E7.3: koncepcja pilota dyni na ESP32-C6-LCD-1.47 (23.10)

Dla dwóch niezależnych uczestników (Opus, Astra/Codex), ten sam brief. Tylko do odczytu w repo: bez `git pull`, commitów, pushy, bez zmian w plikach, bez dotykania płytki (`/dev/ttyACM0`). Piszesz po polsku. Bez prognoz czasu pracy i terminów.

## Po co

Dynia z ruchomymi oczami (użytkownik – doświadczony konstruktor, elektronik, drukarz 3D – robi ją z synem, 8 lat). Firmware dyni (`50-elektronika/dynia/`, ESP32-C3 + PCA9685) jest punktem dostępu Wi-Fi „Dynia” i ma **API HTTP (GET, JSON)** opisane w `50-elektronika/dynia/README.md` (sekcja API): `/api/konfig` (lista efektów i emocji), `/api/efekt`, `/api/emocja`, `/api/pad`, `/api/mrug`, `/api/powieki`, `/api/oko`, `/api/stan` (pozycje oczu, tryb, efekt). Dziś steruje się ze strony w telefonie. Użytkownik 23.10: „Jak już ustawimy wszystko na telefonie, to później najlepiej byłoby bawić się z ESP” – **pilot na płytce ESP32 z ekranem** jako klient tego API. Autoryzacja później; zakładamy, że poza pilotem nie ma innych klientów.

**Płytka wybrana przez użytkownika:** ESP32-C6-LCD-1.47 (klon Waveshare, Amazon: „ESP32-C6 płyta programistyczna ekranu 1,4 cala, 172 × 320”), ESP32-C6 (RISC-V 160 MHz, 512 KB SRAM, 4 MB flash, Wi-Fi 6 2,4 GHz, BLE 5), ekran 1,47" 172 × 320 (sterownik do ustalenia, prawdopodobnie ST7789), gniazdo karty TF, dioda RGB, USB-C. **Bez dotyku**, z przycisków tylko BOOT i RESET. Użytkownik ma „coś tam” w warsztacie (joysticki, przyciski – nieustalone; zobacz `50-elektronika/sprzet.md`).

## Twoje zadanie: koncepcja pilota

1. **Płytka – fakty:** wyprowadzone piny (które wolne po ekranie, karcie TF i diodzie), sterownik ekranu, zasilanie (czy ma ładowarkę Li-Po?), obsługa w Arduino (rdzeń esp32 3.3.12 w `~/.arduino15`; jakie biblioteki ekranu działają z C6 – np. Arduino_GFX, TFT_eSPI, LVGL – i czego brak). Źródła z linkami (wiki Waveshare dla ESP32-C6-LCD-1.47, schemat).
2. **Wejścia:** dla 8-latka – joystick analogowy (Pacynka), kilka przycisków (wybór/wstecz/„Bu!”), ewentualnie enkoder. Porównaj 2–3 układy wejść; przy każdym: piny ADC/GPIO na tej płytce, podłączenie (rysunek lub tabela), ergonomia dla dziecka, odporność.
3. **Interfejs na 172 × 320 bez dotyku:** ekrany (menu efektów z `/api/konfig`, Pacynka z joystickiem, emocje, podgląd oczu z `/api/stan`, ekran „szybkie straszaki”), nawigacja przyciskami, czytelność dla dziecka. Szkic ekranów (ASCII albo opis).
4. **Komunikacja z dynią:** łączenie z siecią „Dynia”, częstość zapytań (pad ok. 10 Hz, stan 2–4 Hz), heartbeat dyni (20 s – sprawdź w `50-elektronika/dynia/` czy odpytywanie `/api/stan` go odświeża), zachowanie przy utracie sieci, opóźnienia. Czy potrzebne zmiany w API dyni (np. jedno zapytanie zbiorcze, krótsze odpowiedzi) – wypisz, nie zmieniaj.
5. **Zasilanie i obudowa:** akumulator Li-Po / 18650 / powerbank USB, ładowanie, czas pracy (rachunek poboru C6 z Wi-Fi i ekranu, oznacz źródła); drukowana obudowa pod joystick i przyciski, odporna na upadek z ręki dziecka (DFAM jak w `AGENTS.md`, śruby M3).
6. **Architektura firmware pilota:** moduły, biblioteki, struktura katalogu `50-elektronika/pilot/`, jak testować bez dyni (symulacja API).
7. **Lista zakupów** tylko tego, czego prawdopodobnie brakuje (z ceną orientacyjną), oznaczona „do potwierdzenia, czy jest w warsztacie”.
8. **Rekomendacja** jednego wariantu, top 5 ryzyk i **pytania do użytkownika** (najwyżej 5, z propozycją odpowiedzi).

Fakty (źródło, link, plik w repo) oddzielaj od założeń.

## Plik raportu

- Opus → `20-analizy/2026-10-23-pilot-koncepcja-opus.md`
- Astra → raport jako odpowiedź końcowa (sandbox tylko do odczytu); orkiestrator zapisze `20-analizy/2026-10-23-pilot-koncepcja-astra.md`.
