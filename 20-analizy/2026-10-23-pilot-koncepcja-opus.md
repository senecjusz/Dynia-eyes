# Pilot dyni na ESP32-C6-LCD-1.47: koncepcja (Opus, 23.10)

Odpowiedź na brief `30-projekt/brief-e7.3-pilot-koncepcja.md`, z uzupełnieniem orkiestratora o zestaw micro:bit. Praca tylko do odczytu: bez płytki, bez git, bez zmian w repo.

Oznaczenia: **[F]** fakt ze źródła (link albo plik w repo), **[O]** obliczenie z faktów, **[Z]** założenie albo szacunek do sprawdzenia.

---

## 1. Płytka: fakty

### 1.1 Co jest na płytce

Źródła: wiki Waveshare [W1], schemat [W2], strona Arduino [W3], FAQ [W4]. Schemat przejrzałem jako obraz, bo sam tekst z PDF jest nieczytelny.

| Element | Fakt | Źródło |
|---|---|---|
| SoC | ESP32-C6FH4 (4 MB flash w układzie), RISC-V 160 MHz, Wi-Fi 6 2,4 GHz, BLE 5, 802.15.4; antena ceramiczna | [F] W1 |
| Ekran | 1,47", 172 × 320, **ST7789**, SPI, IPS, 262 tys. kolorów | [F] W1, W2 |
| Piny ekranu | MOSI **GPIO6**, SCLK **GPIO7**, CS **GPIO14**, DC **GPIO15**, RST **GPIO21**, podświetlenie **GPIO22** | [F] W1, W2 |
| Podświetlenie | GPIO22 → R9 1 kΩ → bramka MOSFET-a SI2302 (klucz od strony masy, LEDK), R6 10 Ω szeregowo. PWM daje regulację jasności | [F] W2 |
| Karta TF | CS **GPIO4**, MISO **GPIO5**, MOSI/SCLK wspólne z ekranem (GPIO6/7); D1 i D2 niepodłączone. Na liniach karty rezystory **10 kΩ do 3V3** (R15–R20) | [F] W1, W2 |
| Dioda RGB | **WS2812B-0807** (adresowalna) na **GPIO8**, z R2 10 kΩ do 3V3 | [F] W2 |
| Przyciski | RESET (EN) i **BOOT = GPIO9** (Key2 do masy, R5 10 kΩ do 3V3). Po starcie BOOT działa jak zwykły przycisk | [F] W2 |
| USB | USB-C, wbudowany USB-Serial/JTAG układu (GPIO12 D−, GPIO13 D+); CC1/CC2 z 5,1 kΩ (zasilanie z ładowarek USB-C działa) | [F] W2 |
| Zasilanie | **VBUS z USB-C jest połączone wprost z VCC_5V** (bez diody). VCC_5V → LDO **ME6217C33M5G** (800 mA) → 3V3 | [F] W2, W1 |
| Ładowarka Li-Po | **Brak.** Na schemacie nie ma układu ładowania, złącza akumulatora ani dzielnika do pomiaru napięcia | [F] W2 |
| Zalecenie producenta | Jasność ekranu **≤ 50 %**, bez długiej pracy na pełnej jasności (cienie u dołu ekranu od ciepła). Ekranu nie odklejać od płytki | [F] W3, W4 |

### 1.2 Wyprowadzone piny

Złącze U2 ma 2 × 9 pinów [F] W2:

| Pin | Sygnał | | Pin | Sygnał |
|---|---|---|---|---|
| 1 | BOOT (GPIO9) | | 18 | GPIO5 (SD_MISO, 10 k do 3V3) |
| 2 | GPIO18 | | 17 | GPIO4 (SD_CS, 10 k do 3V3) |
| 3 | GPIO19 | | 16 | GPIO3 |
| 4 | GPIO20 | | 15 | GPIO2 |
| 5 | GPIO23 | | 14 | GPIO1 |
| 6 | USB_N (GPIO12) | | 13 | GPIO0 |
| 7 | USB_P (GPIO13) | | 12 | 3V3 |
| 8 | RXD (GPIO17) | | 11 | GND |
| 9 | TXD (GPIO16) | | 10 | VCC_5V |

**Wolne piny po ekranie, karcie i diodzie** [O]:

| Grupa | Piny | Uwagi |
|---|---|---|
| ADC (ADC1_CH0–3), bez rezystorów na płytce | **GPIO0, 1, 2, 3** | C6 ma tylko ADC1, kanały 0–6 na GPIO0–6 [F] datasheet D1. ADC1 działa przy włączonym Wi-Fi (C6 nie ma ADC2) [F] D1. GPIO0–7 to też LP_GPIO0–7 [F] D1: mogą budzić z deep sleep |
| ADC lub cyfrowe, z 10 kΩ do 3V3 | GPIO4, GPIO5 | Tylko **bez karty w gnieździe**: CS karty to GPIO4, a SCLK jest wspólny z ekranem. Przy GPIO4 w stanie niskim karta odbierałaby dane ekranu i mogłaby sterować GPIO5 [O]. Rezystory 10 kΩ nadają się na podciągnięcie magistrali I²C, ale przeszkadzają potencjometrom. GPIO4/5 to piny startowe MTMS/MTDI, które mają znaczenie tylko przy ustawionym efuse JTAG [Z] |
| Cyfrowe | **GPIO18, 19, 20, 23** | bez ograniczeń |
| Cyfrowe, UART0 | GPIO16 (TX), GPIO17 (RX) | przy `CDCOnBoot=cdc` UART0 jest wolny, ale ROM wypisuje na TX log startowy [Z]. Dobre na UART1 do micro:bita |
| Przycisk na płytce | GPIO9 (BOOT) | pin startowy: wciśnięty przy resecie wchodzi w tryb wgrywania [F] D1. Nadaje się na ukryte menu serwisowe |
| Zajęte | GPIO6, 7, 8, 12, 13, 14, 15, 21, 22 | ekran, RGB, USB |

Piny startowe C6 to GPIO4, 5, 8, 9 i 15 [F] D1 (ESP32-C6 Datasheet v1.5). Na przyciski użytkownika nie biorę żadnego z nich.

### 1.3 Arduino (rdzeń esp32 3.3.12 jest zainstalowany)

| Biblioteka | Stan na C6 | Źródło |
|---|---|---|
| Rdzeń esp32 ≥ 3.0.0 | wymagany. W `~/.arduino15` jest 3.3.12 z płytką `esp32:esp32:esp32c6` (menu `CDCOnBoot`) | [F] W3, lokalny `boards.txt` |
| **Arduino_GFX** (moononournation) | ma gotową definicję **`WAVESHARE_ESP32_C6_LCD_1_47`**: `Arduino_HWSPI(15 DC, 14 CS, 7 SCK, 6 MOSI, 5 MISO)`, `Arduino_ST7789(bus, 21 RST, 0, true IPS, 172, 320, 34, 0, 34, 0)`, BL = 22. **Przesunięcie kolumn 34** | [F] W5 (`Arduino_GFX_dev_device.h`) |
| LVGL | Waveshare używa w przykładach **LVGL 8.3.10** + PNGdec 1.0.2 i ostrzega przed mieszaniem wersji (v9 nie przyjmie sterowników z v8) | [F] W3 |
| TFT_eSPI | **na C6 nie kompiluje się** z rdzeniem 3.x (błąd `VSPI was not declared`, brak potwierdzonej poprawki) | [F] W6, W7 |
| LovyanGFX | nie znalazłem potwierdzenia obsługi C6 | [Z] |
| ArduinoJson | niezależna od układu; w `~/Arduino/libraries` jej nie ma (są tylko Adafruit_BusIO i Adafruit PWM) | [F] lokalnie |

Przykład Waveshare podaje w instrukcji „ESP32S3 Dev Module”, a w ESP-IDF „ESP32C6”. To błąd w dokumentacji [F] W1. Właściwa płytka to `esp32:esp32:esp32c6:CDCOnBoot=cdc`.

### 1.4 Klon zamiast oryginału

Płytka z Amazonu to klon. Spotpear sprzedaje podobną płytkę 1,47" z dotykiem i sterownikiem **JD9853** zamiast ST7789 [F] W8. **Przed projektowaniem obudowy:** zdjęcie sitodruku obu stron, porównanie ze złączem U2 powyżej i test `HelloWorld` z Arduino_GFX (definicja `WAVESHARE_ESP32_C6_LCD_1_47`). Krzywy obraz albo przesunięcie o 34 px oznaczają inny panel lub inne przesunięcie.

---

## 2. Wejścia

### 2.1 Trzy układy

**Wariant A: „gamepad”, czyli joystick + 3 przyciski (rekomendowany)**

Wszystkie wejścia mają własne piny, bez drabinki rezystorów.

| Wejście | Pin | Podłączenie |
|---|---|---|
| Joystick X (VRx) | GPIO0 (ADC1_CH0) | moduł KY-023 zasilany z **3V3, nie z 5 V** |
| Joystick Y (VRy) | GPIO1 (ADC1_CH1) | jw. |
| Wciśnięcie joysticka = „Mrug” | GPIO18 | do GND, `INPUT_PULLUP` |
| A „OK” (zielony) | **GPIO2** | do GND, `INPUT_PULLUP`; LP_GPIO budzi z deep sleep |
| B „Wstecz” (żółty) | GPIO19 | do GND, `INPUT_PULLUP` |
| **„Bu!”** (duży czerwony, 30 mm) | GPIO20 | do GND, `INPUT_PULLUP`; skrót globalny na każdym ekranie |
| Pomiar akumulatora | GPIO3 (ADC1_CH3) | dzielnik 100 k / 100 k + 100 nF do GND |
| Zapas: silniczek wibracyjny albo brzęczyk | GPIO23 | przez tranzystor N (np. 2N7000 / BC547) |
| Menu serwisowe | GPIO9 (BOOT) | przytrzymanie 3 s po starcie |
| Rezerwa | GPIO4/5 (I²C z gotowymi 10 kΩ, bez karty TF), GPIO16/17 (UART1) | IMU albo micro:bit później |

```
            KY-023                 przyciski (każdy osobno do GND)
   3V3 ──── +5V(!)                 GPIO2  ──[A]──┐
   GND ──── GND                    GPIO19 ──[B]──┤
   GPIO0 ── VRx                    GPIO20 ──[BU]─┤
   GPIO1 ── VRy                    GPIO18 ──[SW joysticka]─┤
   GPIO18 ─ SW                                   GND
   VBAT ──100k──┬──100k── GND
                └── GPIO3 (+100 nF do GND)
```

- **Ergonomia:** układ jak w konsoli. Joystick pod lewym kciukiem, ekran w środku, przyciski pod prawym. 8-latek zna go z gier. Pacynka działa analogowo, a w menu joystick służy jako krzyżak.
- **Odporność:** KY-023 ma plastikowe potencjometry i drążek, który łatwo urwać. Dlatego: drążek wystaje najwyżej 8–10 mm ponad obudowę, wokół osłona-kołnierz, nakładka z TPU. Przyciski arcade 24/30 mm z mikroprzełącznikiem są praktycznie niezniszczalne [Z]. Kalibracja środka przy starcie i martwa strefa 8–10 % kompensują dryf taniego joysticka.

**Wariant B: enkoder + joystick + „Bu!”**

- Enkoder EC11 z przyciskiem (GPIO18/19 = A/B, GPIO20 = SW) do menu, joystick (GPIO0/1) tylko do Pacynki, „Bu!” na GPIO2.
- **Za:** w długiej liście efektów kręcenie gałką jest szybsze niż joystick.
- **Przeciw:** więcej części i większa obudowa. Dwa różne sposoby wyboru mylą dziecko. EC11 ma luźną oś i odpada przy upadku na gałkę.
- **Ocena:** słabszy od A; sens tylko wtedy, gdy joysticka w warsztacie nie ma.

**Wariant C: micro:bit (uzupełnienie od użytkownika)**

Micro:bit pracuje w logice 3,3 V, tak jak C6 [F] W9. Złącze krawędziowe i duże pady 0/1/2/3V/GND łączy się wprost, bez konwertera poziomów, ze wspólną masą. Przy zasilaniu z baterii 2 × AAA micro:bit ma ok. 3 V; to nadal poprawny stan wysoki dla C6 [Z].

- **C-a. Moduły z zestawu podłączone do C6.**
  - Jeśli w zestawie jest **joystick:bit V2** (ELECFREAKS): X na P1, Y na P2, przyciski C/D/E/F na P12–P15, brzęczyk P0, wibracja P16 [F] W10.
  - To płytka-gniazdo, do której wkłada się micro:bit. Do C6 trzeba by ją podłączyć przez **złącze krawędziowe (breakout)** albo przylutować przewody do padów.
  - Wychodzi gotowy pad z drążkiem i 4 przyciskami w gotowej obudowie, ale kosztem przeróbki i luźnej płytki C6 obok.
  - **Ocena:** sensowne tylko jako tani prototyp wejść na biurku. Docelowo wariant A jest prostszy.
  - Czujniki i moduły na krokodylki: przydatne do testów, nie do zabawki.
- **C-b. Micro:bit jako „ręczny kontroler”.** A/B + **akcelerometr**: przechył steruje okiem.
  - To akcelerometr, nie żyroskop: daje kąt przechyłu względem grawitacji, ale nie obrót wokół pionu. Do Pacynki (X/Y oka = przechył) wystarcza.
  - Micro:bit nie ma Wi-Fi, więc potrzebuje pośrednika. Są trzy możliwości:
    1. **Przewód UART:** micro:bit `serial.redirect(P0, P1, 115200)` ↔ C6 UART1 na GPIO17/16, plus GND. Najprostsze i pewne. Krokodylki z zestawu na duże pady 0/1/GND wystarczą do próby. Docelowo kabel 3-żyłowy, a micro:bit jest „rączką” pilota na kablu.
    2. **BLE:** micro:bit wystawia usługę **Bluetooth UART zgodną z Nordic UART**, pakiety po 20 B [F] W11. W MakeCode trzeba dodać rozszerzenie Bluetooth i włączyć „No Pairing Required”; rozszerzenie Bluetooth wyłącza `radio` [F] W12. Na micro:bicie V1 brakuje pamięci na kilka usług naraz [F] W12. C6 musiałby być centralą BLE i jednocześnie klientem Wi-Fi na jednym radiu (koegzystencja). To daje opóźnienie i drgania [Z], a dla dyni oznacza dwie baterie i parowanie.
    3. **Drugi micro:bit jako mostek radio → UART:** wymaga dwóch micro:bitów.
  - Wariant „micro:bit przez BLE wprost do dyni (bez C6)” odrzucam: flash dyni jest zajęty w 86 %, a BLE na tym samym radiu co punkt dostępu ryzykuje zacięcia telefonu [F] `50-elektronika/dynia/README.md`; [Z] co do koegzystencji.
  - **Ocena:** przechył to świetna zabawa dla 8-latka i nie ma drążka do urwania. Jako **dodatkowy tryb „Przechył”** w pilocie C6, przez przewód UART, ma sens. Jako jedyny pilot nie: nie ma ekranu z menu (5 × 5 LED), a całość to dwa urządzenia i dwa zasilania.
  - To nie przeczy decyzji z 18.10 („syn nie programuje sam, więc micro:bit niepotrzebny”). Tam chodziło o micro:bit jako kontroler dyni. Tu jest tylko czujnikiem, który rodzic programuje raz.
  - **Alternatywa bez micro:bita:** moduł IMU (MPU-6050 / GY-521) w pilocie na I²C GPIO4/5. Rezystory 10 kΩ na płytce wystarczą jako podciągnięcie, ale tylko bez karty TF [O]. Przechył całego pilota daje to samo, w jednym urządzeniu. Do sprawdzenia, czy jest w warsztacie.

### 2.2 Porównanie

| | A: joystick + 3 przyciski | B: enkoder + joystick + Bu | C-b: micro:bit (przechył) |
|---|---|---|---|
| Piny C6 | 2 ADC + 4 cyfrowe (+1 ADC na baterię) | 2 ADC + 4 cyfrowe | 2 (UART) |
| Pacynka | analogowo, drążkiem | analogowo | przechyłem (bardzo intuicyjne) |
| Menu | krzyżak z joysticka | gałka | tylko przyciski pilota |
| Odporność | średnia (drążek), osłona pomaga | słabsza (oś enkodera) | wysoka (bez drążka), ale kabel |
| Złożoność | najmniejsza | średnia | dwa programy, kabel albo BLE |
| Ocena | **rekomendacja** | zapas | tryb dodatkowy, później |

---

## 3. Interfejs: 172 × 320 bez dotyku

### 3.1 Wielkość ekranu

Przekątna 1,47" = 37,3 mm przy proporcji 320:172 daje pole ok. **32,9 × 17,7 mm**, piksel ok. 0,103 mm [O].

- Tekst czytelny dla dziecka z 30–40 cm to litery ok. 2,5 mm, czyli **ok. 24 px** [Z, typowa reguła czytelności]. W poziomie mieszczą się **najwyżej 3 linie tekstu**.
- **Wniosek:** ikona + jedno krótkie słowo, jeden element na raz (karuzela), a nie lista.
- **Orientacja pozioma 320 × 172** pasuje do układu gamepada.
- Polskie znaki: standardowy font Adafruit GFX ich nie ma. Arduino_GFX obsługuje fonty u8g2 z UTF-8 (rodziny `_te` z rozszerzonym Latin) [Z, do sprawdzenia w pierwszym teście].

### 3.2 Nawigacja (stała na wszystkich ekranach)

| Element | Działanie |
|---|---|
| Joystick ◀ ▶ | poprzedni / następny element (próg 60 % z histerezą; autopowtarzanie 400 ms, potem 150 ms) |
| Joystick ▲ ▼ | parametr (kierunek, wariant) albo przewijanie |
| A | wybierz / uruchom |
| B | wstecz (z menu: nic) |
| **Bu!** | zawsze „Bu!” (`/api/efekt?n=bu`); na przycisku na ekranie licznik `buZa` z `/api/stan` |
| Wciśnięcie joysticka | mrugnięcie (`/api/mrug`) na każdym ekranie |
| BOOT 3 s | ekran serwisowy |

### 3.3 Ekrany (poziomo, 320 × 172)

```
[0] ŁĄCZENIE                      [1] MENU (karuzela)
┌──────────────────────────────┐  ┌──────────────────────────────┐
│ ▂▄▆ Wi-Fi          ▮▮▮▯ bat  │  │ ●dynia            ▮▮▮▯       │
│      (dynia mruga, anim.)    │  │  ◀   ┌──────────┐   ▶        │
│      Szukam dyni…            │  │      │  ikona   │            │
│                              │  │      │  96 px   │            │
│   B: tryb bez dyni (demo)    │  │      └──────────┘            │
└──────────────────────────────┘  │       PACYNKA   ○●○○○        │
                                  └──────────────────────────────┘
Kafle menu: Pacynka · Straszaki · Efekty · Emocje · Oczy (podgląd)

[2] PACYNKA                       [3] STRASZAKI (szybkie)
┌──────────────────────────────┐  ┌──────────────────────────────┐
│      ╭────────╮   powieki    │  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ │
│     │   ◉→   │   ▮▮▮▮▯       │  │  │ BU!│ │ZEZ │ │FALA│ │MRUG│ │
│      ╰────────╯   A: ▲ szerzej│  │  │ 7s │ │    │ │    │ │    │ │
│  ○ = cel joysticka           │  │  └────┘ └────┘ └────┘ └────┘ │
│  ◉ = oko wg /api/stan        │  │ ◀▶ wybór  A start  B wstecz  │
└──────────────────────────────┘  └──────────────────────────────┘
A/B w Pacynce: powieki szerzej / węziej (presety 100/75/50/30 przez /api/powieki)

[4] EFEKTY                        [5] EMOCJE
┌──────────────────────────────┐  ┌──────────────────────────────┐
│  ◀  [ikona] WSZYSCY TAM!  ▶  │  │  ◀   ╭──╮  ZŁOŚLIWY   ▶      │
│        kierunek: ←  ↑  →     │  │      │▔▔│  (powieki 70/30)    │
│        (joystick ▲▼ / ◀▶)    │  │      ╰▁▁╯                    │
│   A: start   B: wstecz       │  │   A: ustaw   B: wstecz       │
│   „chwileczkę…” (429)        │  │   45 s ▮▮▮▮▯ (emocjaZa)      │
└──────────────────────────────┘  └──────────────────────────────┘

[6] OCZY (podgląd z /api/stan, 2–4 Hz)
┌──────────────────────────────┐
│        · · · · ·             │  dynia z góry: małe oczy na azymutach `az`,
│      ·   ╭───╮   ·           │  kreska = kierunek `oczy[i]`; duże oko w środku
│     ·    │ ◉ │    ·          │  (x, y, powG, powD); szare = `wyl`
│      ·   ╰───╯   ·           │  pasek: tryb / efekt / emocja
│  automat · mucha             │
└──────────────────────────────┘
```

- **Efekty:**
  - Lista pochodzi z `/api/konfig`; przy `wystawa: true` i pilocie bez uprawnień rodzica pokazuje tylko `b: 1`.
  - Polskie nazwy i ikony są w tabeli pilota, bo API podaje tylko klucze. Nieznany klucz pokazuje się surowo, więc nowy efekt w dyni nie psuje pilota.
  - Parametry: `fala` → `w` (◀ / ▶ / ◀▶), `tam` → `k` (strzałka joystickiem, −120…120°), `buntownik` → po starcie A = „Pokaż” (`n=pokaz`), `babajaga` → A = „Patrzę!” (`n=patrze`).
- **Kody błędów jako stan dyni, nie błąd:** 429 = „chwileczkę” albo „dynia łapie oddech, 7 s”, 409 = „dynia zajęta”, 403 = kłódka. Zgodnie z pomysłem „obrażonej dyni” z zestawienia.
- **Jasność:** domyślnie 40 %, najwyżej 50 % (zalecenie Waveshare). Po 60 s bezczynności 10 %, potem wygaszenie.

---

## 4. Komunikacja z dynią

### 4.1 Fakty z firmware dyni

- Dynia to punkt dostępu `Dynia` / `dynia2026`, kanał 1, **najwyżej 4 klientów**, IP 192.168.4.1 [F] `dynia.h`, `serwer.cpp:402`. Pilot zajmuje jedno miejsce.
- **Heartbeat:** każde zapytanie API, także `/api/stan` i `/api/konfig`, woła `zap()`, które ustawia `tOstZapytania` [F] `serwer.cpp:22, 131, 137`. `krokEfektow()` wraca do automatu po `HEARTBEAT_MS` = 20 s ciszy [F] `efekty.cpp:765–768`. **Odpytywanie `/api/stan` odświeża heartbeat.**
  - Skutek: włączony pilot nie pozwala heartbeatowi zadziałać. Tak samo jest dziś ze stroną.
  - Efekty i tak kończą się same (`tMax`), a Pacynka i Pianino po 15 s bez polecenia (`RECZNY_BEZCZYNNOSC_MS`, `tOstReczny` odświeża tylko `pad`/`klawisz`/…) [F] `efekty.cpp:686, 865`.
  - Gdy pilot się wyłączy albo wyjdzie z zasięgu, dynia po 20 s wraca do automatu. Tego właśnie chcemy.
- **`/api/pad` przy każdym wywołaniu przedłuża tryb ręczny** (`tOstReczny = millis()`) [F] `efekty.cpp:865`. Pilot **nie może wysyłać `x=0,y=0` w kółko**, bo inaczej Pacynka nie skończy się nigdy. Pad wysyłamy tylko przy wychyleniu poza martwą strefę albo przy zmianie, plus jedno zero po puszczeniu.
- **Serwer:** `WebServer` obsługuje jedno połączenie naraz i zawsze odpowiada `Connection: close` [F] rdzeń 3.3.12 `WebServer.cpp:672`, README „Znane ograniczenia”. Każde zapytanie to nowe połączenie TCP.
- **Antyspam:** gość może uruchomić efekt najwcześniej po 1,2 s (`EFEKT_ODSTEP_MS`); „Bu!” ma przerwę 10 s, a w stanie jest licznik `buZa` [F] `dynia.h:51`, `efekty.cpp:829–836`.
- **Tryb wystawowy:** `pad` i `powieki` zwracają 403 bez tokenu rodzica, tak samo efekty z `b: 0` [F] `serwer.cpp:156–181`, `efekty.cpp:828`. **Token rodzica jest jeden** (`tokenRodzica`) [F] `serwer.cpp:39–45`. Jeśli pilot zaloguje się PIN-em, a telefon rodzica potem też, pilot traci token, i odwrotnie [O].

### 4.2 Plan zapytań pilota

| Co | Kiedy | Częstość | Limit czasu |
|---|---|---|---|
| `/api/konfig` | po połączeniu i po wykryciu restartu dyni (`czas` w stanie maleje) | raz | 1 s |
| `/api/pad?x=&y=` | Pacynka, wychylenie poza martwą strefę albo zmiana o ≥ 3 jednostki | **≤ 10 Hz**, zawsze najnowsza wartość, starsze porzucane | 300 ms |
| `/api/stan` | ekran Oczy i Pacynka: 4 Hz; Menu i Efekty: 1 Hz (licznik `buZa`, `emocjaZa`, stan połączenia); wygaszony ekran: 0,2 Hz | 0,2–4 Hz | 500 ms |
| `/api/efekt`, `/emocja`, `/mrug`, `/powieki` | na przycisk | zdarzenia | 1 s |

- **Jedno zapytanie w locie**, w osobnym zadaniu FreeRTOS. Kolejka z priorytetami: akcja przycisku > pad > stan. Interfejs nigdy nie czeka na sieć.
- **Wi-Fi bez oszczędzania** (`WiFi.setSleep(false)`) na ekranach aktywnych. W trybie modem-sleep klient budzi się na beacony (DTIM), co doda kilkadziesiąt do kilkuset ms opóźnienia padu [Z]. Arduino włącza modem-sleep domyślnie [Z, do sprawdzenia].
- **Opóźnienie [Z]:** zapytanie w sieci AP to kilka–kilkadziesiąt ms. Do tego najwyżej 20 ms kroku ruchu dyni i dojazd profilu. Pacynka powinna reagować w ok. 50–100 ms; zmierzyć znacznikami czasu w logu pilota.
- **Utrata sieci:**
  - `WiFi.setAutoReconnect(true)` i ekran „Szukam dyni…” z animacją;
  - przyciski działają lokalnie (menu), akcje sieciowe są wyszarzone, pad porzucany;
  - 3 kolejne przekroczenia limitu czasu = stan „brak dyni”;
  - po powrocie sieci ponownie `/api/konfig`.
- **Odporność:** odpowiedź bez wymaganych pól = błąd połączenia, tak jak na stronie (README „Strona”).

### 4.3 Propozycje zmian w API dyni (tylko lista, nic nie zmieniam)

1. **Klucz pilota** (stała w `dynia.h`, parametr `p=`). Daje prawa rodzica do Pacynki i efektów w trybie wystawowym i nie zabiera tokenu telefonu rodzica. Bez tego pilot w trybie wystawowym działa jak gość. Brief odkłada autoryzację na później, ale bez tej decyzji pilot nie ma Pacynki na wystawie.
2. **`/api/pad` z krótkim stanem w odpowiedzi** (`x, y, powG, powD, tryb`). W Pacynce znika osobne odpytywanie stanu i zostaje jedno zapytanie zamiast dwóch.
3. **`/api/stan?krotki=1`**: tryb, efekt, emocja, `do`, `buZa`, `emocjaZa`, `czas`, bez tablic `az`, `wyl`. Dziś przy 10 oczach odpowiedź ma kilkaset bajtów [Z, z `jsonStanu()`].
4. **`/api/konfig` z polskimi etykietami i parametrami efektów** (`w`, `k`). Dziś leżą w `NAZWY` strony, więc pilot i strona utrzymywałyby dwie kopie. Opcjonalne: pilot i tak potrzebuje własnych ikon.
5. **Identyfikacja klienta** (`c=pilot`) w dzienniku rodzica: odróżnienie zapytań pilota od telefonu przy diagnozie zacięć.

---

## 5. Zasilanie i obudowa

### 5.1 Pobór prądu

| Odbiornik | Prąd | Podstawa |
|---|---|---|
| C6, Wi-Fi odbiór (RX 802.11n HT20) | 78 mA szczyt | [F] D1, tab. 5-7 |
| C6, nadawanie (802.11n MCS7) | 280 mA szczyt, krótkie impulsy | [F] D1, tab. 5-7 |
| C6, modem-sleep 160 MHz, CPU pracuje | 27–38 mA | [F] D1, tab. 5-10 |
| Średnio C6 przy Wi-Fi bez oszczędzania i ok. 14 zapytaniach/s | **ok. 85–100 mA** | [Z] RX przez większość czasu + CPU + krótkie TX |
| Podświetlenie przy 40–50 % | **ok. 10–15 mA** | [O/Z] R6 10 Ω przy 3,3 V i Vf diody ok. 3 V daje ≤ 30 mA na 100 % |
| ST7789, WS2812B (wygaszona), LDO | ok. 3–6 mA | [Z] |
| **Razem przy zabawie** | **ok. 100–120 mA** z linii VCC_5V (LDO przepuszcza prąd 1:1) | [O] |
| Menu, modem-sleep, ekran 10 % | ok. 40–60 mA | [Z] |

### 5.2 Warianty zasilania

| Wariant | Jak | Czas pracy [O] | Za / przeciw |
|---|---|---|---|
| **Li-Po 1S 1200–2000 mAh + ładowarka TP4056 (USB-C, z zabezpieczeniem DW01) + dioda Schottky + wyłącznik → pin VCC_5V** (rekomendacja) | Akumulator 3,0–4,2 V przez SS14/1N5819 na VCC_5V. LDO ME6217 przy niższym napięciu wchodzi w dropout (180 mV przy 300 mA [F] W13), a 3V3 schodzi łagodnie. C6 pracuje od 3,0 V [F] D1, tab. 5-2 „Recommended Operating Conditions”, 3,0–3,6 V. Praktycznie do ok. 3,4–3,5 V na akumulatorze, czyli ok. 85–90 % pojemności [Z] | 1200 mAh × 0,85 / 0,11 A ≈ **9 h**; 2000 mAh ≈ **15 h** | Najprostszy i najdłuższy czas pracy. **Dioda jest obowiązkowa:** VBUS z USB-C płytki jest zwarte z VCC_5V, więc kabel USB włożony przy włączonym akumulatorze bez diody pompuje 5 V w Li-Po [F] W2 + [O]. Ładowanie tylko przez gniazdo TP4056 |
| 18650 (z zabezpieczeniem) w uchwycie zamkniętym pokrywą + TP4056 | jw. | 2500–3000 mAh ≈ 20 h | Bardziej odporny mechanicznie niż woreczek Li-Po; grubszy (Ø18,5); w uchwycie sprężynowym ogniwo może wyskoczyć przy upadku, więc potrzebna pokrywa na śruby |
| Mały powerbank USB-C wpięty w gniazdo płytki | bez lutowania | zależnie od powerbanku | Wiele powerbanków samo się wyłącza przy małym prądzie [Z]; 100–120 mA to granica. Duży i luźny kabel. Na start / testy przy biurku tak, docelowo nie |
| Moduł ładowarka + przetwornica 5 V | 3,7 V → 5 V → LDO 3,3 V | ok. 60 % czasu z wariantu 1 | Podwójna konwersja; zbędne |

- **Pomiar akumulatora:** dzielnik 100 k / 100 k na GPIO3. Ikona baterii na ekranie i ostrzeżenie przy < 3,5 V.
- **Uśpienie:** po 10 min bez dotyku deep sleep. Budzenie przyciskiem A na GPIO2 (LP_GPIO, EXT1) [F] D1 LP_GPIO0–7 = GPIO0–7; [Z] konfiguracja EXT1 w IDF. Pobór w deep sleep: 7 µA układu [F] D1, ale LDO i dzielnik dokładają swoje. Na długie przechowywanie służy wyłącznik.

### 5.3 Obudowa (DFAM wg `AGENTS.md`)

- **Kształt:** poziomy gamepad ok. 130 × 60 × 28 mm [Z], dwie skorupy. Każda drukowana na płaskiej ścianie zewnętrznej, bez podpór. Otwory na przyciski prostopadle do stołu, fazki 45° na krawędziach otworów.
- **Materiał:** **PETG** (mniej kruchy przy upadku niż PLA), ścianki 2,4–3 mm, zaokrąglone narożniki R ≥ 5 mm. Opcjonalnie zderzaki z TPU na narożnikach.
- **Ekran:** płytka wsunięta w kołyskę z żeberkami, z luzem ślizgowym 0,25–0,3 mm na stronę wg tabeli luzów. Ekran **0,8–1,5 mm poniżej** powierzchni ramki, żeby przy upadku na twarz uderzała ramka, nie szkło. Opcjonalnie szybka z 1 mm PETG albo akrylu. Ekranu nie kleić (zalecenie Waveshare). Płytka nie ma otworów montażowych [Z, ze zdjęć], dlatego trzyma ją docisk drugiej skorupy przez podkładkę z pianki.
- **Joystick KY-023:** 4 otwory montażowe w module [Z: Ø ok. 3 mm, zmierzyć]. Słupki z otworem ciasnym Ø2,6 pod wkręt M3 albo M2,5 wg pomiaru. Kołnierz-osłona wokół drążka, drążek ≤ 10 mm ponad kołnierz.
- **Przyciski:** „Bu!” arcade 30 mm, A/B 24 mm (zatrzask w otworze; grubość ścianki pod zatrzask zmierzyć z próbki). Alternatywa: mikroprzełączniki 12 × 12 z drukowanymi nakładkami prowadzonymi w tulejkach (luz 0,25–0,3 mm).
- **Akumulator:** osobna kieszeń z przegrodą, przekładka z pianki, żadnych ostrych krawędzi ani łbów śrub przy woreczku Li-Po.
- **Złącza:**
  - gniazdo USB-C ładowarki TP4056 w ściance, na zewnątrz;
  - USB-C płytki do programowania za zaślepką albo dostępne po zdjęciu jednej skorupy;
  - wyłącznik suwakowy wpuszczony w obudowę, żeby nie przesunął się przypadkiem.
- **Skręcanie:** 4 × M3 od spodu we **wkładki gwintowane M3** w górnej skorupie (obudowa będzie otwierana: programowanie, wymiana przycisku). Otwory luźne Ø3,3 w dolnej skorupie.
- **Smycz na nadgarstek:** ucho na smycz w obudowie. Najtańsza ochrona przed upadkiem.
- **Najpierw próbka:** ramka ekranu i kołyska płytki (ok. 20–30 min wydruku) przed całą obudową, zgodnie z zasadą „najpierw próbka”.

---

## 6. Architektura firmware pilota

### 6.1 Biblioteki

- Rdzeń esp32 3.3.12: `WiFi`, `HTTPClient` albo `NetworkClient`, `Preferences`.
- **Arduino_GFX** z gotową definicją płytki i `Arduino_Canvas` jako bufor ramki. 172 × 320 × 2 B = 110 KB, mieści się w 512 KB SRAM obok Wi-Fi [Z]. Rysowanie bez migotania; pełna ramka przy SPI 40 MHz to ok. 22 ms [O].
- **ArduinoJson 7** do parsowania (do instalacji).
- **Bez LVGL:** kilka prostych ekranów z ikonami nie potrzebuje widżetów. LVGL to większy kod i pułapka wersji 8/9 [F] W3. **Bez TFT_eSPI** (nie kompiluje się na C6 [F] W6).

### 6.2 Katalog `50-elektronika/pilot/`

```
50-elektronika/pilot/
├── README.md            # podłączenie, kompilacja (esp32:esp32:esp32c6:CDCOnBoot=cdc), test
├── pilot.ino            # setup/loop, maszyna stanów ekranów
├── pilot.h              # STAŁE: piny, SSID/hasło/IP dyni, częstości, progi, jasność
├── wejscia.cpp          # ADC joysticka (uśrednianie, środek przy starcie, martwa strefa), przyciski (debounce, długie, powtórz) → zdarzenia
├── siec.cpp             # Wi-Fi STA, zadanie FreeRTOS z kolejką priorytetową, limity czasu, stan połączenia
├── api.cpp              # budowa zapytań, parsowanie JSON → struktury Stan / Konfig
├── ekrany.cpp           # Łączenie, Menu, Pacynka, Straszaki, Efekty, Emocje, Oczy, Serwis
├── grafika.cpp          # inicjalizacja Arduino_GFX, canvas, fonty u8g2 z polskimi znakami, jasność PWM
├── etykiety.h           # klucz efektu → polska nazwa + ikona + parametry (w, k)
├── ikony.h              # generowany, nie edytować
├── zasilanie.cpp        # pomiar akumulatora, wygaszanie, deep sleep
├── zrob_ikony.py        # PNG → ikony.h (jak zrob_strone.py)
└── test/
    ├── atrapa_dyni.py   # serwer HTTP z tym samym API i kształtem JSON (Python, http.server)
    └── README.md
```

### 6.3 Testy bez dyni

1. **Atrapa na PC:** `test/atrapa_dyni.py` odpowiada na `/api/*` tymi samymi polami co `jsonStanu()` i `jsonListyEfektow()`. Symuluje 429 (antyspam, `buZa`), 403 (wystawa), 409 (park), opóźnienia i zerwania. Pilot łączy się wtedy z siecią domową, a w `pilot.h` zmienia się `DYNIA_SSID/IP` (przełącznik kompilacji `ATRAPA`). Kształt JSON brać z `serwer.cpp`, a nie przepisywać ręcznie z README.
2. **Prawdziwy firmware dyni na zapasowym ESP32-C3 bez PCA9685:** kod nie sprawdza wyniku `endTransmission()` [F] `ruch.cpp:38–52`, więc powinien działać bez sterownika serw [Z: do sprawdzenia, czy NACK nie spowalnia pętli 20 ms]. Ten test najwierniej sprawdza sieć, AP, heartbeat i 4 klientów.
3. **Tryb demo w pilocie** (B na ekranie łączenia): interfejs bez sieci, do pracy nad ekranami i dla syna, gdy dynia jest wyłączona.
4. **Test długi:** pilot w Pacynce przez 1 h (ok. 14 zapytań/s) z prawdziwą dynią. Licznik błędów i limitów czasu pilota, minimum wolnej pamięci dyni w panelu rodzica. `Connection: close` daje tysiące połączeń TCP na godzinę [O].

---

## 7. Lista zakupów (wszystko „do potwierdzenia, czy jest w warsztacie”)

Ceny orientacyjne Allegro/AliExpress, październik 2026 [Z].

| Część | Ilość | Cena orient. | Do czego |
|---|---|---|---|
| Moduł joysticka KY-023 (typ PS2) | 1 (+1 zapas) | 5–12 zł/szt. | Pacynka, krzyżak menu |
| Przycisk arcade 30 mm czerwony („Bu!”) | 1 | 5–10 zł | Bu! |
| Przyciski arcade 24 mm (zielony, żółty) albo mikroprzełączniki 12 × 12 z nakładkami | 2 | 4–8 zł/szt. (12 × 12: ok. 1 zł) | A, B |
| Akumulator Li-Po 1S 1200–2000 mAh z zabezpieczeniem i JST-PH 2,0 (np. 103450) | 1 | 25–45 zł | zasilanie |
| Moduł ładowarki TP4056 USB-C z zabezpieczeniem (DW01 + 8205) | 1 (paczka 5 szt.) | 3–5 zł/szt., 15–20 zł/5 | ładowanie |
| Dioda Schottky SS14 / 1N5819 | 1 | < 1 zł | ochrona przed zasilaniem zwrotnym z USB |
| Wyłącznik suwakowy (SS12F15 lub mały kołyskowy) | 1 | 1–3 zł | odcięcie akumulatora |
| Rezystory 2 × 100 kΩ, kondensator 100 nF | – | grosze | pomiar akumulatora |
| *Opcjonalnie:* silniczek wibracyjny 10 mm + 2N7000 | 1 | 3–5 zł | odczucie „Bu!” w dłoni |
| *Opcjonalnie:* MPU-6050 (GY-521) | 1 | 10–15 zł | tryb „Przechył” bez micro:bita |
| *Opcjonalnie:* breakout złącza krawędziowego micro:bit | 1 | 15–30 zł | tylko przy wariancie C-a albo stałym kablu UART do micro:bita |

Śruby M3, wkładki M3, przewody i filament PETG są w warsztacie [F] `50-elektronika/sprzet.md`.

---

## 8. Rekomendacja, ryzyka, pytania

### 8.1 Rekomendacja

**Wariant A, „gamepad”:**

- ESP32-C6-LCD-1.47 poziomo w środku, joystick KY-023 pod lewym kciukiem (GPIO0/1, wciśnięcie = mrugnięcie na GPIO18), A/B pod prawym (GPIO2/GPIO19) i duży czerwony „Bu!” (GPIO20) jako skrót na każdym ekranie;
- zasilanie z Li-Po 1S przez ładowarkę TP4056 USB-C, diodę Schottky i wyłącznik na pin VCC_5V, pomiar napięcia na GPIO3;
- firmware na Arduino_GFX (gotowa definicja płytki) + ArduinoJson, sieć w osobnym zadaniu z jednym zapytaniem w locie; pad ≤ 10 Hz tylko przy wychyleniu, stan 1–4 Hz zależnie od ekranu;
- interfejs ikonowy z karuzelą, bo ekran ma tylko ok. 33 × 18 mm;
- obudowa z PETG z wpuszczonym ekranem, osłoną drążka i smyczą;
- micro:bit (przechył przez przewód UART na GPIO16/17) albo MPU-6050 jako dodatkowy tryb „Przechył” w drugim kroku, gdy podstawowy pilot działa.

### 8.2 Top 5 ryzyk

| # | Ryzyko | Skutek | Co zrobić |
|---|---|---|---|
| 1 | **Klon ≠ Waveshare** (inny sterownik, np. JD9853, inne przesunięcie albo piny) | czarny lub przesunięty ekran, obudowa pod złe wymiary | zdjęcie płytki + test HelloWorld z Arduino_GFX **przed** CAD |
| 2 | **VBUS zwarte z VCC_5V, brak ładowarki** | kabel USB przy włączonym Li-Po bez diody = ładowanie akumulatora bez kontroli | dioda Schottky w torze akumulatora obowiązkowa, ładowanie tylko przez TP4056; Li-Po w zamkniętej kieszeni |
| 3 | **Tryb wystawowy i jeden token rodzica** | pilot jako gość dostaje 403 na Pacynkę; logowanie PIN-em wyrzuca telefon rodzica | decyzja o kluczu pilota (pkt 4.3.1) przed implementacją |
| 4 | **Opóźnienia i zacięcia sieci** (jedno połączenie naraz, `Connection: close`, modem-sleep, telefon i pilot jednocześnie) | Pacynka „pływa”, akcje giną | `setSleep(false)`, jedno zapytanie w locie, porzucanie starego padu, test długi 1 h; ewentualnie zmiana 4.3.2 |
| 5 | **Czytelność i trwałość dla 8-latka** (pole 33 × 18 mm, drążek KY-023) | dziecko nie czyta menu albo urywa drążek | ikony zamiast tekstu, test z synem na makiecie ekranów w trybie demo; osłona drążka, nakładka TPU, zapasowy joystick |

Do tego mniejsze: Pacynka nie kończy się, jeśli pilot wysyła zero w kółko (rozwiązane w pkt 4.2). Ciągłe kręcenie okiem grzeje serwa (zestawienie stron, uwaga OB); limit robi firmware dyni.

### 8.3 Pytania do użytkownika

1. **Co jest w zestawie micro:bit?** Wersja płytki (V1/V2), nakładki (joystick:bit, game:bit, breakout krawędziowy), moduły, krokodylki, koszyk baterii. *Propozycja:* zdjęcie zawartości. Jeśli jest V2, tryb „Przechył” przez przewód UART w drugim kroku. Joystick:bit tylko do prób na biurku.
2. **Co z wejść i zasilania już jest w warsztacie?** Joystick KY-023, przyciski arcade lub 12 × 12, Li-Po 1S albo 18650, TP4056, MPU-6050. Do tego zdjęcie płytki C6 z obu stron (weryfikacja klonu). *Propozycja:* KY-023 + 3 przyciski + Li-Po 1S z TP4056; kupić tylko brakujące pozycje z pkt 7.
3. **Kształt pilota:** poziomy „gamepad” na dwie ręce czy pionowy „pilot TV” na jedną rękę? *Propozycja:* poziomy, bo daje joystick i „Bu!” jednocześnie i jest naturalny dla dziecka.
4. **Uprawnienia pilota w trybie wystawowym:** pełne (Pacynka i wszystkie efekty, zmiana API dyni: klucz pilota) czy jak gość? *Propozycja:* stały klucz pilota w `dynia.h` jako osobne zadanie w API dyni. Pilot to zabawka syna, więc ma pełne prawa, a goście dostają telefon.
5. **Czy przy zabawie pilotem telefon też będzie podłączony?** *Propozycja:* pilot jest jedynym klientem w czasie zabawy, a telefon służy do kalibracji i panelu rodzica. Wtedy limit 4 klientów i jedno połączenie naraz nie przeszkadzają.

---

## Źródła

- [W1] Waveshare wiki ESP32-C6-LCD-1.47: https://www.waveshare.com/wiki/ESP32-C6-LCD-1.47 (także https://docs.waveshare.com/ESP32-C6-LCD-1.47)
- [W2] Schemat: https://files.waveshare.com/wiki/ESP32-C6-LCD-1.47/ESP32-C6-LCD-1.47_schemetics.pdf (odczytane z obrazu: złącze U2, tabela GPIO, zasilanie, przyciski, podświetlenie)
- [W3] Waveshare Arduino: https://docs.waveshare.net/ESP32-C6-LCD-1.47/Arduino
- [W4] Waveshare FAQ: https://docs.waveshare.net/ESP32-C6-LCD-1.47/FAQ
- [W5] Arduino_GFX, definicja `WAVESHARE_ESP32_C6_LCD_1_47`: https://github.com/moononournation/Arduino_GFX (plik `examples/PDQgraphicstest/Arduino_GFX_dev_device.h`)
- [W6] TFT_eSPI na C6, błąd VSPI: https://community.platformio.org/t/cannot-compile-tft-espi-for-esp32-c6-persistent-vspi-was-not-declared-error/52786
- [W7] TFT_eSPI na C6, forum Arduino: https://forum.arduino.cc/t/sketches-using-tft-espi-library-cannot-compile-for-esp32-c6-board/1378348
- [W8] Spotpear ESP32-C6 1.47 z dotykiem (JD9853): https://spotpear.com/index.php/wiki/ESP32-C6-LCD-1.47-inch-LCD-Display-TouchScreen-LVGL-SD-AXS5106L-JD9853.html
- [W9] micro:bit, złącze krawędziowe: https://tech.microbit.org/hardware/edgeconnector/ [Z: logika 3,3 V z ogólnej wiedzy o płytce, strony nie pobierałem]
- [W10] ELECFREAKS Joystick:bit V2: https://wiki.elecfreaks.com/en/microbit/expansion-board/joystick-bit-v2
- [W11] micro:bit Bluetooth UART (zgodny z Nordic UART, 20 B): https://support.microbit.org/solution/articles/19000062330
- [W12] MakeCode Bluetooth i UART bez parowania: https://makecode.microbit.org/reference/bluetooth/start-uart-service, https://www.espruino.com/MicroBit+Text, https://kaspersmicrobit.readthedocs.io/en/stable/makecode-bluetooth/create-a-makecode-project-with-pairing/
- [W13] ME6217C33M5G (800 mA, dropout 180 mV przy 300 mA, wejście 2–6,5 V): https://www.lcsc.com/product-detail/C81592.html, https://www.flux.ai/lcsc/me6217c33m5g.md
- [D1] ESP32-C6 Series Datasheet v1.5: https://documentation.espressif.com/esp32-c6_datasheet_en.pdf (tab. 5-7, 5-10, 5-11; zasilanie 3,0–3,6 V; ADC1_CH0–6 = GPIO0–6; LP_GPIO0–7; piny startowe)
- Repo: `50-elektronika/dynia/README.md`, `dynia.h`, `serwer.cpp`, `efekty.cpp`, `ruch.cpp`; `50-elektronika/sprzet.md`; `30-projekt/decyzje.md` (18.10, micro:bit); `20-analizy/2026-10-23-strona-funkcje-zestawienie.md`.
