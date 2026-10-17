# Plan realizacji – krzywa „minimum najpierw”

**Termin: Halloween, sobota 31.10.2026 – albo wcześniej, jeśli wcześniej jest prezentacja w szkole (do ustalenia, patrz [prezentacja w szkole](../20-analizy/2026-10-18-prezentacja-w-szkole.md)).** Dziś jest 17.10, więc zostały **2 weekendy w Kobyłce** (17–18.10 i 24–25.10) plus wieczory w Warszawie na druk i kod.

**Zasada:** najpierw budujemy **minimum, które samo w sobie jest gotową dynią**. Każde rozszerzenie dokładamy osobno i tylko wtedy, gdy minimum już działa. Jeśli czegoś nie zdążymy, po prostu tego nie ma, a dynia i tak działa.

## Etap 0 – próba na biurku (weekend 17–18.10)

| Zadanie | Gotowe, gdy |
|---|---|
| Nano + PCA9685 + 1 serwo, program „losowe rozglądanie się” | Serwo rusza się losowo z płynnymi pauzami |
| Centrowanie serw na 90° (program pomocniczy) | Wszystkie serwa ustawione przed montażem orczyków |
| Test powerbanku: układ w spoczynku przez 5 min | Wiemy, czy powerbank gaśnie (jeśli tak, dodajemy impuls podtrzymujący) |
| Wydruk testowy: gniazdo + moduł oka v1 + klucz | Piłeczka obraca się bez zahaczania, bagnet klika, gwint kręci się palcami |

## Etap 1 – MINIMUM: gotowa dynia (do 25.10)

| Element | Wersja minimum |
|---|---|
| Oczy | **4–8 małych oczu** (wariant F), losowy ruch |
| Elektronika | **Pudełko-wieża w środku dyni**: Nano, PCA9685, kondensator, powerbank |
| Okablowanie | **Gotowe przedłużacze serw** z PCA9685 do modułów, ponumerowane |
| Włączanie | Wpięcie kabla USB w powerbank (bez osobnego włącznika) |
| Ładowanie | Zdjęcie pokrywki dyni i wyjęcie powerbanku |

**Uwaga, prawdziwa dynia:** wycięta dynia wytrzymuje ~5–10 dni. **Wiercimy ją jak najpóźniej**, ok. 25–27.10. Wcześniej wszystko testujemy na tekturze albo kawałku dyni.

## Etap 2 – rozszerzenia (każde niezależne, w kolejności opłacalności)

| # | Rozszerzenie | Koszt | Wartość | Jeśli nie zdążymy |
|---|---|---|---|---|
| 2.1 | ~~„Gapienie się” małych oczu~~ – odpada: małe oczy zawsze ruszają się chaotycznie ([analiza](../20-analizy/2026-10-18-wykrywanie-ruchu.md)) | mały (czujnik jest, kilka linijek kodu) | duża: efekt „ożywa” + oszczędność baterii | oczy ruszają się cały czas |
| 2.2 | **Więcej oczu** (do 16 na jednym PCA9685) | średni (druk + wiercenie) | średnia | zostaje 4–8 oczu |
| 2.3 | **Powerbank i włącznik na podstawce** pod dynią, kabel przez dno | średni (podstawka + przepust) | wygoda ładowania bez otwierania | ładowanie przez pokrywkę |
| 2.4 | **Zbiorcze złącza / skrętka** zamiast pojedynczych przedłużaczy | średni | szybszy montaż i demontaż | pojedyncze wtyczki |
| 2.5 | **Duże oko 2a → 2b** (powieka, lewo–prawo, góra–dół); zamknięte, gdy nikogo nie ma | średni (projekt w CAD, druk próbny na X1C w tygodniu, MG90S) | duża | **próbujemy w tym roku**; jeśli nie zdążymy, dynia ma same małe oczy |
| 2.6 | Duże oko 2c (dwie powieki z jednego serwa) | średni | średnia | jeśli starczy czasu |
| 2.7 | **Śledzenie radarem LD2450** przez duże oko (otwarcie + kierunek) | **mały, gdy jest duże oko**: radar + ~50 linijek kodu (zakładając, że firmware od początku jest na ESP32) | duża | zależy tylko od tego, czy będzie duże oko |

**Realna ocena (zaktualizowana 18.10):** pewne są etap 0 i etap 1. Duże oko 2a/2b próbujemy równolegle (druk próbny na X1C w tygodniu). Śledzenie (2.7) to jeden wieczór, gdy duże oko działa.

## Punkty kontrolne

- **18.10 wieczór:** działa serwo z programem losowym, jest wydruk testowy modułu. Jeśli nie, upraszczamy moduł (np. bez bagnetu).
- **25.10 wieczór:** minimum (etap 1) działa na stole, na makiecie. Jeśli nie, na Halloween idą tylko 4 oczy.
- **27.10:** wiercenie dyni i montaż z synem.
- **28–30.10:** bufor na poprawki i ewentualnie rozszerzenia 2.1–2.2.
