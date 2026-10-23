# Review kodu E7.2: firmware i strona dyni (23.10)

Jesteś recenzentem. Dwóch recenzentów (Fable – Anthropic, Astra – OpenAI Codex) dostaje ten sam materiał i pracuje niezależnie. Tylko do odczytu: bez `git pull`, commitów, pushy, bez zmian w repo i bez wgrywania na płytkę (nie dotykaj `/dev/ttyACM0`). Możesz kompilować w katalogu tymczasowym poza repo i uruchamiać skrypty/`node` na kopiach. Piszesz po polsku. Wagi: KRYTYCZNE / WAŻNE / DROBNE; dla każdej uwagi: plik i linia, scenariusz porażki, poprawka, pewność.

## Co oceniasz

Katalog `50-elektronika/dynia/` (firmware ESP32-C3 + strona `strona/index.html` + generator `zrob_strone.py` + README), napisany według briefu `30-projekt/brief-e7-strona-implementacja.md` – przeczytaj go najpierw, wraz z plikami, które wskazuje (`50-elektronika/strona-efekty.md`, `50-elektronika/oczy-ruch/oczy-ruch.ino`, `test-24h`, `test-powerbank-wifi`).

Kontekst: dynia z ok. 10 małymi oczami (SG90, lewo–prawo) i przyszłym dużym okiem (3 × MG90S); dzieci na wystawie w szkole; telefon syna to **iPhone 7 (Safari, iOS 15.8, 375 × 667)**, zapasowo Android/Chrome; powerbank 5 V podtrzymywany przez stale włączony punkt dostępu Wi-Fi (test 22/23.10: 7,9 h bez restartu).

**Ważna zmiana po napisaniu briefu implementacji:** `30-projekt/decyzje.md` (22.10): duże oko ma **4 × MG90S** – lewo–prawo, góra–dół i **osobne serwo na każdą powiekę** (nie sprzężenie jednym serwem); koncepcja v3.1 (`20-analizy/`, E6) przypisuje kanały 12 = X, 13 = Y, 14 = powieka górna, 15 = dolna. Kod ma dziś 13/14/15 i jedną powiekę (`KANAL_POW_D = -1`). Oceń, co trzeba zmienić w kodzie i stronie, żeby obsłużyć dwie niezależne powieki (np. mrugnięcie, zez powiek, „podejrzliwy” = dolna wyżej) i małe oczy na kanałach 0–11.

## Sprawdź w szczególności

1. **Bezpieczeństwo serw (najważniejsze):** czy jest jakakolwiek ścieżka do skoku impulsu (start, restart, zmiana efektu w trakcie ruchu, przerwanie przez pad, heartbeat, kalibracja z panelu, zmiana liczby oczu, wyłączenie oka); twarde ograniczenie zakresu przed każdym zapisem do PCA9685; limit prędkości; start od zapisanego celu; zużycie flash przez zapisy NVS (ile zapisów na godzinę przy typowym ruchu i przy padzie 10 Hz).
2. **Limit `MAX_W_RUCHU`:** czy żaden efekt ani kombinacja (efekt + pad + automat + drugi telefon) nie przekracza limitu serw w ruchu.
3. **Serwer i sieć:** `WebServer` jednowątkowy – czy pętla ruchu nie zacina się przy zapytaniach (blokujące `delay`, długie odpowiedzi), zachowanie przy 2–4 klientach, captive portal na iOS 15 (czy okno logowania naprawdę pokaże stronę i czy `fetch` w nim działa), heartbeat, odporność na złe parametry w URL, PIN rodzica (czy da się go ominąć, czy panel nie jest dostępny bez PIN-u).
4. **Strona na iPhone 7 / Safari 15:** funkcje JS/CSS niedostępne w Safari 15, układ przy 375 × 667 i 320 px, dotyk (opóźnienia, przypadkowe powiększanie, przewijanie przy padzie), częstość zapytań (pad, podgląd `/api/stan`), zachowanie po utracie połączenia, tryb symulacji.
5. **Efekty:** czy każdy z 21 efektów briefu jest zaimplementowany po stronie ESP i ma przycisk; czy wersje bez dużego oka mają sens przy oczach tylko lewo–prawo; czy efekty mają limity czasu tam, gdzie brief wymaga.
6. **Pamięć i stabilność ESP32-C3:** RAM (String, sterta, fragmentacja przy wielogodzinnej pracy), rozmiar strony w flash, watchdog, przepełnienia `millis()`.
7. **Czytelność i utrzymanie:** jak dodać efekt, stałe konfiguracyjne, README zgodne z kodem.

## Raport

Na końcu **werdykt jednym zdaniem:** czy można wgrać na płytkę do pierwszej próby z jednym okiem (TAK / TAK PO POPRAWKACH – których / NIE).

Plik: Fable → `20-analizy/review/2026-10-23-e7-kod-fable.md`; Astra pracuje w sandboksie tylko do odczytu – raport podaje jako odpowiedź, orkiestrator zapisze `20-analizy/review/2026-10-23-e7-kod-astra.md`.
