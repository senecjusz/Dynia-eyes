// DYNIA: firmware oczu dyni + strona w telefonie (E7.2).
// ESP32-C3 SuperMini + PCA9685 (0x40, 50 Hz): małe oczy na kanałach 0..N-1 (lewo–prawo ±25°),
// duże oko (flaga, domyślnie wyłączone) na kanałach 13 (ψ), 14 (θ), 15 (powieki).
// Punkt dostępu Wi-Fi „Dynia” (hasło w dynia.h) jest włączony stale: podtrzymuje powerbank (test 22.10)
// i serwuje stronę (captive portal: iPhone sam otwiera okno z naszą stroną; pełna wersja: Safari → 192.168.4.1).
// Tryby: automat (spoczynek z oczy-ruch, domyślny), efekt, sterowanie ręczne, kalibracja, park.
// Ruch liczy osobne zadanie FreeRTOS co 20 ms (wyższy priorytet niż loop), więc wolne zapytanie HTTP
// nie zatrzymuje profili ani heartbeatu; stan chroni rekurencyjny mutex (Blokada w dynia.h).
// Bez zapytań ze strony przez 20 s dynia płynnie wraca do automatu (heartbeat).
// Pliki: dynia.h (stałe), ruch.cpp (silnik ruchu, NVS), efekty.cpp (automat, efekty), serwer.cpp (Wi-Fi, API),
// strona/index.html (źródło strony) → zrob_strone.py → strona_html.h (gzip w pamięci flash).
//
// Komendy (port szeregowy, 115200): l = dziennik i kanały, z = wyzeruj dziennik, k<kanał> <µs> = środek
// oka (zapis w NVS, np. "k0 1520"), c = parkuj (płynnie na środek i stop), r = wznów / automat,
// a / s = automat aktywny / spoczynek, e <efekt> [w] [k] = uruchom efekt (np. "e fala 2", "e tam 0 -60"),
// ? = pomoc.
// Kompilacja: arduino-cli compile -b esp32:esp32:esp32c3:CDCOnBoot=cdc 50-elektronika/dynia

#include "dynia.h"
#include <esp_system.h>

Preferences nvs;
uint32_t startyLicznik = 0;
static SemaphoreHandle_t mutexRuchu = nullptr;

void zablokuj() { if (mutexRuchu) xSemaphoreTakeRecursive(mutexRuchu, portMAX_DELAY); }
void odblokuj() { if (mutexRuchu) xSemaphoreGiveRecursive(mutexRuchu); }
static uint32_t czasPrzed = 0, tZero = 0, tOstZapisDziennika = 0;
static int przyczynaKod = 0;

const char *przyczynaStartu() {
  switch ((esp_reset_reason_t)przyczynaKod) {
    case ESP_RST_POWERON:  return "zasilanie";
    case ESP_RST_BROWNOUT: return "spadek napiecia";
    case ESP_RST_PANIC:    return "blad programu";
    case ESP_RST_INT_WDT: case ESP_RST_TASK_WDT: case ESP_RST_WDT: return "watchdog";
    case ESP_RST_SW:       return "restart programowy";
    case ESP_RST_USB:      return "USB";
    case ESP_RST_EXT:      return "reset zewnetrzny";
    default:               return "inna";
  }
}

uint32_t czasPracy() { return czasPrzed + (millis() - tZero) / 1000; }

void zapiszDziennik() {
  nvs.putUInt("czas", czasPracy());
  nvs.putUInt("ruchy", licznikRuchow);
}

void zerujDziennik() {                             // kasuje tylko dziennik; kalibracje i pozycje zostają
  nvs.remove("czas"); nvs.remove("ruchy");
  licznikRuchow = 0; czasPrzed = 0; tZero = millis(); startyLicznik = 1; nvs.putUInt("starty", 1);
  zapiszDziennik();
}

String tekstDziennika() {
  uint32_t t = czasPracy();
  char buf[200];
  snprintf(buf, sizeof buf, "czas pracy %lu s (%.2f h), ruchy %lu, starty %lu, ostatni start: %s, zapisy NVS od startu %lu, wolna pamiec %lu B",
           (unsigned long)t, t / 3600.0, (unsigned long)licznikRuchow, (unsigned long)startyLicznik, przyczynaStartu(),
           (unsigned long)zapisyNvs, (unsigned long)ESP.getFreeHeap());
  return String(buf);
}

static void pomoc() {
  Serial.println("komendy: l, z, k<kanal> <us>, c (parkuj), r (wznow), a / s, e <efekt> [w] [k], ?");
  Serial.println("efekty: fala tam zez rozbiegane mucha buntownik klotnia bu zdziwienie przewracanie zasypianie");
  Serial.println("        budzenie hipnoza szef tak nie niewiem mrug refleks babajaga patrze awaria pokaz automat");
}

static void komendy() {
  static String linia;
  while (Serial.available()) {
    char c = Serial.read();
    if (c != '\n' && c != '\r') { if (linia.length() < 60) linia += c; continue; }
    linia.trim();
    if (!linia.length()) continue;
    Blokada b;
    if (linia == "l") { Serial.println(tekstDziennika()); wypiszKanaly(); }
    else if (linia == "z") { zerujDziennik(); Serial.println("dziennik wyzerowany"); }
    else if (linia == "c") { ustawTryb(TR_PARK); parkuj(); Serial.println("parkowanie"); }
    else if (linia == "r") { doAutomatu(); if (tryb == TR_KALIBRACJA) ustawTryb(TR_AUTOMAT); }
    else if (linia == "a") ustawAktywny(true);
    else if (linia == "s") ustawAktywny(false);
    else if (linia == "?") pomoc();
    else if (linia.startsWith("k")) {
      int sp = linia.indexOf(' ');
      int ch = sp > 1 ? linia.substring(1, sp).toInt() : -1, us = sp > 1 ? linia.substring(sp + 1).toInt() : 0;
      if (ch >= 0 && ch < 16 && kan[ch].naped >= 0 && us > 1000 && us < 2000) {
        const char *e = kalibrujUstaw(ch, 'a', us);
        if (e) Serial.printf("blad: %s\n", e);
        else {
          zapiszKalibracje();
          Serial.printf("kanal %d: a = %d us (srodek oka / zamkniete powieki), zapisane w NVS\n", ch, kan[ch].a);
        }
      } else Serial.println("blad: k<kanal> <us>, kanal uzywany, us 1001..1999");
    }
    else if (linia.startsWith("e ")) {
      String reszta = linia.substring(2);
      reszta.trim();
      int sp = reszta.indexOf(' ');
      String nazwa = sp > 0 ? reszta.substring(0, sp) : reszta;
      int w = 0; float k = 0;
      if (sp > 0) {
        String r2 = reszta.substring(sp + 1);
        int sp2 = r2.indexOf(' ');
        w = r2.toInt();
        if (sp2 > 0) k = r2.substring(sp2 + 1).toFloat();
      }
      String odp;
      int kod = uruchomEfekt(nazwa, w, k, true, odp);
      Serial.printf("efekt %s: %d %s\n", nazwa.c_str(), kod, odp.c_str());
    }
    else Serial.println("nieznana komenda, ? = pomoc");
    Serial.printf("tryb %s %s %s, w ruchu %d/%d\n", nazwaTrybu(), nazwaEfektu(), nazwaEmocji(), wRuchuSerw(), ust.maxWRuchu);
    linia = "";
  }
}

static void zadanieRuchu(void *) {                 // krok ruchu co KROK_MS, czas brany PO zajęciu blokady
  TickType_t ost = xTaskGetTickCount();
  for (;;) {
    vTaskDelayUntil(&ost, pdMS_TO_TICKS(KROK_MS));
    Blokada b;
    uint32_t t = millis();
    krokRuchu(t);
    krokEfektow(t);
  }
}

void setup() {
  przyczynaKod = (int)esp_reset_reason();
  Serial.begin(115200);
  Serial.setTxTimeoutMs(0);
  randomSeed(esp_random());
  nvs.begin("dynia", false);
  czasPrzed = nvs.getUInt("czas", 0);
  licznikRuchow = nvs.getUInt("ruchy", 0);
  startyLicznik = nvs.getUInt("starty", 0) + 1;
  nvs.putUInt("starty", startyLicznik);
  nvs.putInt("przyczyna", przyczynaKod);
  tZero = millis();

  serwerStart();                                   // najpierw Wi-Fi: podtrzymanie powerbanku
  ruchStart();                                     // rozruch bez skoku (ok. 150 ms na kanał)
  efektyStart();
  mutexRuchu = xSemaphoreCreateRecursiveMutex();
  xTaskCreate(zadanieRuchu, "ruch", 6144, nullptr, 2, nullptr);   // priorytet 2 > loop (1)
  Serial.printf("dynia %s: %d malych oczu, duze oko %s, start: %s\n", WERSJA_FW, ust.n, ust.duze ? "tak" : "nie", przyczynaStartu());
}

void loop() {
  komendy();
  krokSerwera(millis());
  uint32_t t = millis();
  if (t - tOstZapisDziennika >= 60000) { tOstZapisDziennika = t; zapiszDziennik(); }
}
