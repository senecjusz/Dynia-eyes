# Brief E5.5: powerbank się wyłącza – co z tym zrobić (22.10, 01:20)

Dla dwóch agentów badawczych uruchomionych przez orkiestratora na prośbę użytkownika („odpal agentów, co z tym można zrobić, może trzeba zwiększyć pobór mocy?”). Agenci pracują tylko do odczytu w repo, piszą wyłącznie swój raport. Po polsku.

## Projekt w skrócie

Dynia na Halloween z ruchomymi oczami, robiona przez użytkownika (doświadczony konstruktor, elektronik, drukarz 3D – nie tłumaczyć podstaw, podawać liczby) z synem (8 lat). Docelowo ok. 10 małych oczu (każde 1 × SG90) + duże oko (2–3 serwa), sterowanie ESP32-C3 SuperMini + PCA9685 (I²C 0x40). Wystawa: kilka dni po ok. 8 h, zasilanie ma się dać wymienić bez narzędzi. Szczegóły: `50-elektronika/sprzet.md`, `50-elektronika/polaczenia.md`, `20-analizy/2026-10-17-zasilanie-powerbank.md`, decyzja o zasilaniu w `30-projekt/decyzje.md` (wiersz 2026-10-20 „Zasilanie: powerbank…”).

- Zasilanie dziś: powerbank przez USB → gniazdo USB-C ESP32-C3 SuperMini; V+ PCA9685 z pinu 5V ESP, VCC PCA z 3,3 V. Docelowo gniazdo USB-C (breakout z 5,1 kΩ na CC) do V+ PCA i 5V ESP.
- 12 V odrzucone przez użytkownika (bezpieczeństwo dziecka). NiMH odradzał wcześniej orkiestrator – **użytkownik od początku chciał baterię i miał rację co do ryzyka powerbanku**; nie powtarzać pewności bez danych.
- Powerbanki użytkownika: **Baseus Airpow PPAP20K** 20 000 mAh, 20 W, 3 porty (2 × USB-A, USB-C), oraz **Manta MPB2001S Sunny** 20 000 mAh (zapas, jeszcze nietestowany).
- Firmware wystawowy (koncepcja): spoczynek – co ok. 5 s rusza się jedno małe oko; przy osobie bliżej ok. 1 m – do 3 serw naraz. Szacunek poboru: średnio 0,3–0,4 A przy pełnym zestawie, chwilowo do ok. 1 A (szacunek, niezmierzony).

## Pomiary z 21/22.10 (fakty)

Program `50-elektronika/test-powerbank/test-powerbank.ino` (przeczytaj go). Zestaw: ESP32-C3 + PCA9685 + 1 złożony moduł oka (SG90 z mechanizmem), kabel USB-A–C (ten sam kabel działa bez problemu z komputerem). Zapis w NVS co 1–5 s, od trzeciego przebiegu także przyczyna startu z `esp_reset_reason()`.

1. **Przebieg A (ok. 00:05):** przez błąd programu płytka stała w pętli odczytu: tylko ESP, Wi-Fi wyłączone, PCA zasilone, ale niezainicjowane, serwo bez impulsu. Baseus trzymał **ponad 5 min** (obserwacja użytkownika, czasu nie zapisano), potem diody zgasły i same się zapaliły, potem „całkiem często” znowu. Przycisku Baseusa nikt nie wciskał.
2. **Przebieg B (00:22–00:34), port USB-A nr 1:** serwo trzyma 1500 µs, potem fazy z ruchem płynnym 10° (2 s) co 10/20/30/60 s. **34 restarty w ok. 10 min, każdy przebieg żył ok. 11–17 s** od startu programu (start programu ok. 3,5 s po włączeniu zasilania).
3. **Przebieg C (00:47–00:54), port USB-A nr 1:** ruch płynny 10° co 5 s od startu. **24 restarty, każdy przebieg zginął 7–12 s po starcie programu, po pierwszym ruchu.**
4. **Przebieg D (ok. 01:00), port USB-A nr 1, z przyczyną startu:** 12 przebiegów, każdy ok. 11–12 s, **przyczyna każdego startu: `ESP_RST_POWERON`** (zanik zasilania, nie brownout ESP).
5. **Przebieg E (ok. 01:10), port USB-A nr 2:** 2 przebiegi po 11–12 s (`POWERON`), potem **Baseus wyłączył się na stałe** i sam już nie włączył.

Między przebiegami płytka była podłączana do komputera (odczyt) i z powrotem do tego samego Baseusa; przycisku Baseusa nie wciskano ani razu. Prądu nie mierzono (nie wiemy, czy użytkownik ma miernik USB – zapytać, jeśli potrzebne).

## Interpretacja orkiestratora (niesprawdzona)

Baseus wyłącza się przy zbyt małym poborze (ESP ok. 20–30 mA + SG90 trzymające pozycję + krótkie ruchy 10°). Po wyłączeniu jest w trybie ponownego wykrywania: co jakiś czas włącza wyjście, ok. 15 s mierzy prąd i znowu wyłącza – stąd stały cykl ~15 s niezależnie od ruchu. Wszystkie przebiegi B–E zaczynały się w tym trybie (nikt nie wcisnął przycisku), więc nie znamy czasu do **pierwszego** wyłączenia przy świeżo włączonym Baseusie. Wcześniejsza hipoteza „to serwo powoduje zanik” jest słabsza, bo przebieg A też zaczął cyklować bez serwa. Sprawdź tę interpretację krytycznie – może być błędna.

Szukanie w sieci (orkiestrator, 01:15): o PPAP20K brak informacji o trybie małego prądu i progu wyłączenia; sklepy podają tylko „Auto Shut-Off”.

## Zasady

- Fakt (pomiar, źródło z linkiem) oddzielaj od interpretacji i założenia. Liczby z rachunku albo ze źródła.
- Zakupy: najpierw sprawdź w `50-elektronika/sprzet.md`, co użytkownik ma; nie proponuj zbędnych zakupów, ale nie odradzaj potrzebnych na wyrost. Zakup należy do użytkownika.
- Serwo: SG90 nie zna pozycji – rozwiązanie nie może powodować skoków serwa ani resetów ESP w trakcie pracy.
- Bezpieczeństwo dziecka: bez 12 V, bez gołych ogniw Li-ion bez ochrony w zasięgu dziecka.
- Raport: do 1 strony A4 na pytanie, na końcu rekomendacja jednym zdaniem i **najtańszy test**, który ją potwierdzi lub obali (ile minut, co użytkownik robi, czego potrzeba). Testy mają nie wymagać pilnowania przez użytkownika (płytka sama zapisuje wynik w NVS).
