// Wi-Fi dyni: punkt dostępu „Dynia”, captive portal (DNS odpowiada adresem ESP, testy łączności
// iOS/Androida przekierowane na stronę), strona z pamięci flash (gzip) i API JSON na zwykłych zapytaniach GET.
// Strona nigdy nie wysyła impulsów µs; wyjątek to panel rodzica (kalibracja) z twardym ograniczeniem w ruch.cpp.
// Obsługa HTTP działa w zadaniu loop(), ruch w osobnym zadaniu: każdy handler zmienia stan pod Blokadą
// i zwalnia ją PRZED wysłaniem odpowiedzi (powolny klient nie zatrzymuje ruchu).
// Parametry liczbowe: ścisłe parsowanie (cała wartość, liczba skończona, zakres), inaczej HTTP 400 bez zmiany stanu.

#include "dynia.h"
#include <WiFi.h>
#include <WebServer.h>
#include <DNSServer.h>
#include "strona_html.h"

uint32_t tOstZapytania = 0;

static WebServer www(80);
static DNSServer dns;
static const IPAddress IP_AP(192, 168, 4, 1);
static uint32_t tokenRodzica = 0, tRodzica = 0, tBlokadaPin = 0, tRestart = 0, tOstAP = 0;
static int bledyPin = 0, restartFaza = 0;

static void zap() {                                    // wołane pod Blokadą
  tOstZapytania = millis();
}

static void wyslijJson(int kod, const String &s) {
  www.sendHeader("Cache-Control", "no-store");
  www.send(kod, "application/json", s);
}

static String tekstOdp(int kod, const String &powod) {
  if (kod == 200) return "{\"ok\":true}";
  String s = "{\"ok\":false,\"powod\":\"";
  s += powod;
  s += "\"}";
  return s;
}

static void odpowiedz(int kod, const String &powod) { wyslijJson(kod, tekstOdp(kod, powod)); }

static bool rodzic() {
  if (!tokenRodzica || !www.hasArg("t")) return false;
  if (millis() - tRodzica > SESJA_RODZICA_MS) { tokenRodzica = 0; return false; }
  if ((uint32_t)strtoul(www.arg("t").c_str(), nullptr, 16) != tokenRodzica) return false;
  tRodzica = millis();
  return true;
}

// Parametr liczbowy: brak → dom; obecny i poprawny → wartość; zły (NaN, śmieci, poza zakresem) → false.
static bool liczba(const char *n, float dom, float lo, float hi, float &v) {
  if (!www.hasArg(n)) { v = dom; return true; }
  String a = www.arg(n);
  const char *c = a.c_str();
  char *e = nullptr;
  v = strtof(c, &e);
  return e != c && *e == 0 && isfinite(v) && v >= lo && v <= hi;
}

static bool zlyParametr() { odpowiedz(400, "zły parametr"); return true; }

// ---------- strona i captive portal ----------

static void strona() {
  { Blokada b; zap(); }
  www.sendHeader("Content-Encoding", "gzip");
  www.sendHeader("Cache-Control", "no-cache");
  www.send_P(200, "text/html; charset=utf-8", (const char *)STRONA_GZ, STRONA_GZ_LEN);
}

static void doStrony() {                               // przekierowanie na stronę dyni (okno logowania iOS)
  www.sendHeader("Location", "http://192.168.4.1/?cna=1", true);
  www.send(302, "text/plain", "");
}

static void testLacznosci() {
  { Blokada b; zap(); }
  if (CAPTIVE_PORTAL) { doStrony(); return; }
  String u = www.uri();                                // bez captive: odpowiedzi „jest internet”
  if (u == "/generate_204" || u == "/gen_204") www.send(204);
  else if (u == "/connecttest.txt") www.send(200, "text/plain", "Microsoft Connect Test");
  else if (u == "/ncsi.txt") www.send(200, "text/plain", "Microsoft NCSI");
  else if (u == "/success.txt") www.send(200, "text/plain", "success\n");
  else www.send(200, "text/html", "<HTML><HEAD><TITLE>Success</TITLE></HEAD><BODY>Success</BODY></HTML>");
}

static void nieZnaleziono() {
  { Blokada b; zap(); }
  String h = www.hostHeader();
  if (CAPTIVE_PORTAL && h.length() && h != "192.168.4.1") { doStrony(); return; }
  www.send(404, "text/plain", "brak");
}

// ---------- API zabawy ----------

static String jsonStanu() {                            // pod Blokadą
  String s;
  s.reserve(1000);
  s = "{\"tryb\":\""; s += nazwaTrybu();
  s += "\",\"efekt\":\""; s += nazwaEfektu();
  s += "\",\"emocja\":\""; s += nazwaEmocji();
  s += "\",\"n\":"; s += ust.n;
  s += ",\"duze\":"; s += ust.duze ? "true" : "false";
  s += ",\"oczy\":[";
  for (int i = 0; i < ust.n; i++) { if (i) s += ","; s += String(nap[i].p[0], 1); }
  s += "],\"wyl\":[";
  for (int i = 0; i < ust.n; i++) { if (i) s += ","; s += nap[i].wylaczony ? 1 : 0; }
  s += "],\"az\":[";
  for (int i = 0; i < ust.n; i++) { if (i) s += ","; s += String(ust.azymut[i], 1); }
  s += "]";
  if (ust.duze) {
    s += ",\"do\":{\"x\":"; s += String(nap[N_GALKA].p[0], 1);
    s += ",\"y\":"; s += String(nap[N_GALKA].p[1], 1);
    s += ",\"powG\":"; s += String(nap[N_POW_G].p[0], 0);
    s += ",\"powD\":"; s += String(nap[N_POW_D].p[0], 0);
    s += ",\"wyl\":"; s += nap[N_GALKA].wylaczony ? "true" : "false";
    s += ",\"wylG\":"; s += nap[N_POW_G].wylaczony ? "true" : "false";
    s += ",\"wylD\":"; s += nap[N_POW_D].wylaczony ? "true" : "false";
    s += "}";
  } else s += ",\"do\":null";
  s += ",\"klienci\":"; s += WiFi.softAPgetStationNum();
  s += ",\"czas\":"; s += millis() / 1000;
  s += ",\"troll\":"; s += troll() ? "true" : "false";
  s += ",\"wystawa\":"; s += ust.wystawa ? "true" : "false";
  s += ",\"wRuchu\":"; s += wRuchuSerw();
  s += ",\"max\":"; s += ust.maxWRuchu;
  jsonEfektu(s);
  s += "}";
  return s;
}

static void apiStan() {
  String s;
  { Blokada b; zap(); s = jsonStanu(); }
  wyslijJson(200, s);
}

static void apiKonfig() {
  String s = "{\"wersja\":\"" WERSJA_FW "\",";
  { Blokada b; zap(); jsonListyEfektow(s, rodzic()); }
  s += "}";
  wyslijJson(200, s);
}

static void apiEfekt() {
  float w, k;
  if (!liczba("w", 0, 0, 9, w) || !liczba("k", 0, -180, 180, k)) { zlyParametr(); return; }
  String odp; int kod;
  { Blokada b; zap(); kod = uruchomEfekt(www.arg("n"), (int)w, k, rodzic(), odp); }
  odpowiedz(kod, odp);
}

static void apiEmocja() {
  String odp; int kod;
  { Blokada b; zap(); kod = ustawEmocje(www.arg("n"), rodzic(), odp); }
  odpowiedz(kod, odp);
}

static bool pacynkaZabroniona() { return ust.wystawa && !rodzic(); }

static void apiPad() {
  float x, y;
  if (!liczba("x", 0, -100, 100, x) || !liczba("y", 0, -100, 100, y)) { zlyParametr(); return; }
  int kod = 200;
  { Blokada b; zap(); if (pacynkaZabroniona()) kod = 403; else pad(x / 100.0f, y / 100.0f); }
  odpowiedz(kod, "niedostępne w trybie wystawowym");
}

static void apiOko() {
  float nr, k;
  if (!liczba("nr", 0, -1, N_MALYCH_MAX - 1, nr) || !liczba("k", 1, -1, 1, k)) { zlyParametr(); return; }
  int kod = 200;
  { Blokada b; zap(); if ((int)nr >= ust.n) kod = 400; else klawisz((int)nr, k < 0 ? -1 : 1); }
  odpowiedz(kod, "nr oka");
}

static void apiMrug() { { Blokada b; zap(); mrugnijZeStrony(); } odpowiedz(200, ""); }

static void apiPowieki() {                             // r = obie; g, d = osobno (0–100)
  float r, g, d;
  if (!liczba("r", 75, 0, 100, r) || !liczba("g", r, 0, 100, g) || !liczba("d", r, 0, 100, d)) { zlyParametr(); return; }
  int kod = 200;
  { Blokada b; zap(); if (pacynkaZabroniona()) kod = 403; else ustawPowieki(g, d); }
  odpowiedz(kod, "niedostępne w trybie wystawowym");
}

static void apiTroll() {
  float on;
  if (!liczba("on", 0, 0, 1, on)) { zlyParametr(); return; }
  int kod = 200;
  { Blokada b; zap(); if (ust.wystawa && !rodzic()) kod = 403; else ustawTroll(on != 0); }
  odpowiedz(kod, "niedostępne w trybie wystawowym");
}

static void apiRefleks() {
  float ms;
  if (!liczba("ms", 0, 0, 100000, ms)) { zlyParametr(); return; }
  int r;
  { Blokada b; zap(); r = raportRefleks((int)ms); }
  wyslijJson(200, String("{\"ok\":true,\"rekord\":") + r + "}");
}

// ---------- API rodzica ----------

static void apiPin() {
  { Blokada b; zap(); }
  uint32_t t = millis();
  if (tBlokadaPin && t - tBlokadaPin < PIN_BLOKADA_MS) {
    odpowiedz(429, String("blokada, ") + ((PIN_BLOKADA_MS - (t - tBlokadaPin)) / 1000 + 1) + " s");
    return;
  }
  if (www.arg("pin") != PIN_RODZICA) {
    if (++bledyPin >= 5) { bledyPin = 0; tBlokadaPin = t; }
    odpowiedz(403, "zły PIN");
    return;
  }
  bledyPin = 0; tBlokadaPin = 0;
  if (!tokenRodzica) tokenRodzica = esp_random() | 1;
  tRodzica = t;
  char buf[48];
  snprintf(buf, sizeof buf, "{\"ok\":true,\"t\":\"%08lx\"}", (unsigned long)tokenRodzica);
  wyslijJson(200, buf);
}

static bool wymagajRodzica() {
  { Blokada b; zap(); }
  if (rodzic()) return true;
  odpowiedz(401, "wymagany PIN rodzica");
  return false;
}

static const char *typKanalu(int ch) {
  const Kanal &k = kan[ch];
  if (nap[k.naped].typ == T_MALE) return "oko";
  if (nap[k.naped].typ == T_GALKA) return k.os ? "doY" : "doX";
  return k.naped == N_POW_G ? "powG" : "powD";
}

static void apiRodzicStan() {
  if (!wymagajRodzica()) return;
  String s;
  s.reserve(2400);
  {
    Blokada b;
    s = "{\"ok\":true,\"wersja\":\"" WERSJA_FW "\",\"czasPracy\":"; s += czasPracy();
    s += ",\"odStartu\":"; s += millis() / 1000;
    s += ",\"starty\":"; s += startyLicznik;
    s += ",\"przyczyna\":\""; s += przyczynaStartu();
    s += "\",\"ruchy\":"; s += licznikRuchow;
    s += ",\"zapisy\":"; s += zapisyNvs;
    s += ",\"odrzucone\":"; s += odrzuconeKroki;
    s += ",\"heap\":"; s += ESP.getFreeHeap();
    s += ",\"heapMin\":"; s += ESP.getMinFreeHeap();
    s += ",\"klienci\":"; s += WiFi.softAPgetStationNum();
    s += ",\"tryb\":\""; s += nazwaTrybu();
    s += "\",\"ust\":{\"n\":"; s += ust.n;
    s += ",\"max\":"; s += ust.maxWRuchu;
    s += ",\"maxMin\":"; s += najwiekszyKoszt();
    s += ",\"duze\":"; s += ust.duze ? "true" : "false";
    s += ",\"duzeNvs\":"; s += nvs.getBool("duze", DUZE_OKO) ? "true" : "false";
    s += ",\"nNvs\":"; s += nvs.getInt("n", N_MALYCH);
    s += ",\"wystawa\":"; s += ust.wystawa ? "true" : "false";
    s += "},\"kan\":[";
    bool pierwszy = true;
    for (int ch = 0; ch < 16; ch++) {
      const Kanal &k = kan[ch];
      if (k.naped < 0) continue;
      if (!pierwszy) s += ",";
      pierwszy = false;
      s += "{\"ch\":"; s += ch;
      s += ",\"nap\":"; s += k.naped;
      s += ",\"typ\":\""; s += typKanalu(ch);
      s += "\",\"a\":"; s += k.a;
      s += ",\"b\":"; s += k.b;
      s += ",\"l\":"; s += k.kl;
      s += ",\"r\":"; s += k.kp;
      s += ",\"cel\":"; s += k.usRecz;
      s += ",\"z\":"; s += k.znak;
      s += ",\"us\":"; s += k.usWy;
      s += ",\"wyl\":"; s += nap[k.naped].wylaczony ? "true" : "false";
      if (nap[k.naped].typ == T_MALE) { s += ",\"az\":"; s += String(ust.azymut[k.naped], 1); }
      s += "}";
    }
    s += "]}";
  }
  wyslijJson(200, s);
}

static int kanalZArg() {
  float ch;
  if (!www.hasArg("ch") || !liczba("ch", -1, 0, 15, ch)) return -1;
  return kan[(int)ch].naped >= 0 ? (int)ch : -1;
}

static char parametrKal() { return www.hasArg("p") && www.arg("p").length() ? www.arg("p")[0] : 'a'; }

static void apiWybierz() {                            // trzymaj napęd w położeniu kalibracji
  if (!wymagajRodzica()) return;
  int ch = kanalZArg();
  if (ch < 0) { odpowiedz(400, "kanał"); return; }
  int kod = 200;
  {
    Blokada b;
    if (tryb == TR_PARK) kod = 409;
    else { ustawTryb(TR_KALIBRACJA); kalibrujWybierz(ch, parametrKal()); }
  }
  odpowiedz(kod, "zaparkowana – najpierw Wznów");
}

// zmiana kalibracji: v = wartość albo d = zmiana, najwyżej ±50 µs na raz.
// p: a = środek / powieka zamknięta, b = powieka otwarta, l / r = kraniec lewy / prawy małego oka,
//    z = odwróć kierunek, q = azymut, j = strzałka (d: + w prawo, − w lewo, patrząc na dynię)
static void apiKal() {
  if (!wymagajRodzica()) return;
  int ch = kanalZArg();
  char p = parametrKal();
  float v, d;
  if (ch < 0 || !liczba("v", NAN, -2100, 2100, v) || !liczba("d", 0, -50, 50, d)) { odpowiedz(400, "kanał albo wartość"); return; }
  int kod = 200; const char *powod = "";
  {
    Blokada b;
    int n = kan[ch].naped;
    if (p == 'q') {                                   // azymut małego oka
      if (nap[n].typ != T_MALE) { kod = 400; powod = "azymut tylko dla małych oczu"; }
      else { ust.azymut[n] = constrain(isfinite(v) ? v : ust.azymut[n] + d, -180.0f, 180.0f); przeliczKolejnosc(); }
    } else if (tryb == TR_PARK) { kod = 409; powod = "zaparkowana – najpierw Wznów"; }
    else {
      if (tryb != TR_KALIBRACJA) { ustawTryb(TR_KALIBRACJA); kalibrujWybierz(ch, p == 'b' ? 'b' : 'a'); }
      const Kanal &k = kan[ch];
      const char *blad;
      if (p == 'j') blad = kalibrujStrzalka(ch, (int)d);
      else if (p == 'u') blad = kalibrujImpuls(ch, (int)d);   // kreator: surowy impuls, d > 0 = więcej µs
      else {
        int teraz = p == 'b' ? k.b : (p == 'l' ? k.kl : (p == 'r' ? k.kp : (p == 'z' ? k.znak : k.a)));
        int nowa = isfinite(v) ? (p == 'z' ? (int)v : constrain((int)v, teraz - 50, teraz + 50)) : teraz + (int)d;
        blad = kalibrujUstaw(ch, p, nowa);
      }
      if (blad) { kod = 409; powod = blad; }
    }
  }
  odpowiedz(kod, powod);
}

static void apiTest() {                               // wolny test zakresu
  if (!wymagajRodzica()) return;
  int ch = kanalZArg();
  if (ch < 0) { odpowiedz(400, "kanał"); return; }
  int kod = 200;
  {
    Blokada b;
    int n = kan[ch].naped;
    (void)n;
    if (tryb == TR_PARK) kod = 409;
    else { ustawTryb(TR_KALIBRACJA); kalibrujTest(ch); }  // małe oko: środek → lewy → prawy → środek, wolno
  }
  odpowiedz(kod, "zaparkowana – najpierw Wznów");
}

static void apiOznacz() {                             // „To jest ŚRODEK / LEWY / PRAWY KRANIEC”: p = a / l / r
  if (!wymagajRodzica()) return;
  int ch = kanalZArg();
  char p = parametrKal();
  if (ch < 0 || (p != 'a' && p != 'l' && p != 'r')) { odpowiedz(400, "kanał albo parametr"); return; }
  int kod = 200; const char *powod = "";
  {
    Blokada b;
    if (tryb != TR_KALIBRACJA) { kod = 409; powod = "najpierw wybierz oko w kalibracji"; }
    else { const char *e = kalibrujOznacz(ch, p); if (e) { kod = 409; powod = e; } }
  }
  odpowiedz(kod, powod);
}

static void apiKreator() {                            // krok = s (środek), 1, 2 (krańce), p (pokaż kraniec 1), k (kierunek, lewa=1/0)
  if (!wymagajRodzica()) return;
  int ch = kanalZArg();
  String kr = www.arg("krok");
  float lewa;
  if (ch < 0 || kr.length() != 1 || !liczba("lewa", 0, 0, 1, lewa)) { odpowiedz(400, "kanał albo krok"); return; }
  int kod = 200, us = -1; const char *powod = "";
  {
    Blokada b;
    if (tryb == TR_PARK) { kod = 409; powod = "zaparkowana – najpierw Wznów"; }
    else {
      if (tryb != TR_KALIBRACJA) { ustawTryb(TR_KALIBRACJA); kalibrujWybierz(ch, 'a'); }
      const char *e = kreatorKrok(ch, kr[0], lewa != 0, us);
      if (e) { kod = 409; powod = e; }
    }
  }
  if (kod == 200) wyslijJson(200, String("{\"ok\":true,\"us\":") + us + "}");
  else odpowiedz(kod, powod);
}

static void apiNoweSerwo() {                          // świeże serwo bez dźwigienki: od razu 1500 µs i kalibracja domyślna
  if (!wymagajRodzica()) return;
  int ch = kanalZArg();
  if (ch < 0) { odpowiedz(400, "kanał"); return; }
  int kod = 200; const char *powod = "";
  {
    Blokada b;
    if (tryb == TR_PARK) { kod = 409; powod = "zaparkowana – najpierw Wznów"; }
    else { ustawTryb(TR_KALIBRACJA); const char *e = kalibrujNoweSerwo(ch); if (e) { kod = 409; powod = e; } }
  }
  odpowiedz(kod, powod);
}

static void apiZapisz() { if (!wymagajRodzica()) return; { Blokada b; zapiszKalibracje(); } odpowiedz(200, ""); }

static void apiWylacz() {
  if (!wymagajRodzica()) return;
  float n, v;
  if (!www.hasArg("nr") || !liczba("nr", -1, 0, NAPEDOW - 1, n) || !liczba("v", 1, 0, 1, v)) { odpowiedz(400, "nr"); return; }
  int kod = 200;
  { Blokada b; if (!nap[(int)n].uzywany) kod = 400; else ustawWylaczenie((int)n, v != 0); }
  odpowiedz(kod, "nr");
}

static void apiUstaw() {                              // zapisuje tylko przekazane pola
  if (!wymagajRodzica()) return;
  float mx, wy, n, du;
  if (!liczba("max", 0, 1, 8, mx) || !liczba("wystawa", 0, 0, 1, wy) || !liczba("n", 0, 1, N_MALYCH_MAX, n) || !liczba("duze", 0, 0, 1, du)) {
    odpowiedz(400, "zły parametr"); return;
  }
  {
    Blokada b;
    if (www.hasArg("max")) ust.maxWRuchu = max((int)mx, najwiekszyKoszt());   // nie mniej niż najdroższy napęd (gałka = 2)
    if (www.hasArg("wystawa")) ust.wystawa = wy != 0;
    if (www.hasArg("max") || www.hasArg("wystawa")) zapiszUstawienia();
    if (www.hasArg("n")) nvs.putInt("n", (int)n);             // po restarcie
    if (www.hasArg("duze")) nvs.putBool("duze", du != 0);     // po restarcie
  }
  odpowiedz(200, "");
}

static void apiParkuj() { if (!wymagajRodzica()) return; { Blokada b; ustawTryb(TR_PARK); parkuj(); } odpowiedz(200, ""); }

static void apiWznow() {
  if (!wymagajRodzica()) return;
  { Blokada b; doAutomatu(); if (tryb == TR_KALIBRACJA) { ustawTryb(TR_AUTOMAT); doAutomatu(); } }
  odpowiedz(200, "");
}

static void apiRestart() { if (!wymagajRodzica()) return; restartFaza = 1; odpowiedz(200, ""); }

static void apiZeruj() { if (!wymagajRodzica()) return; { Blokada b; zerujDziennik(); } odpowiedz(200, ""); }

static void apiWyloguj() {
  if (!wymagajRodzica()) return;
  { Blokada b; if (tryb == TR_KALIBRACJA) { ustawTryb(TR_AUTOMAT); doAutomatu(); } }
  tokenRodzica = 0;
  odpowiedz(200, "");
}

// ---------- start i krok ----------

static void startAP() {
  WiFi.mode(WIFI_AP);
  WiFi.softAP(AP_SSID, AP_HASLO, AP_KANAL, 0, AP_MAX_KLIENTOW);   // sieć widoczna, kanał 1, do 4 telefonów
  WiFi.softAPConfig(IP_AP, IP_AP, IPAddress(255, 255, 255, 0));   // 192.168.4.1 (domyślny adres, jawnie)
}

void serwerStart() {
  startAP();
  dns.setErrorReplyCode(DNSReplyCode::NoError);
  dns.start(53, "*", IP_AP);                           // każda nazwa → ESP (captive portal)

  www.on("/", HTTP_GET, strona);
  www.on("/index.html", HTTP_GET, strona);
  const char *testy[] = {"/generate_204", "/gen_204", "/hotspot-detect.html", "/library/test/success.html",
                         "/connecttest.txt", "/ncsi.txt", "/redirect", "/canonical.html", "/success.txt", "/fwlink"};
  for (const char *u : testy) www.on(u, HTTP_GET, testLacznosci);
  www.on("/api/stan", HTTP_GET, apiStan);
  www.on("/api/konfig", HTTP_GET, apiKonfig);
  www.on("/api/efekt", HTTP_GET, apiEfekt);
  www.on("/api/emocja", HTTP_GET, apiEmocja);
  www.on("/api/pad", HTTP_GET, apiPad);
  www.on("/api/oko", HTTP_GET, apiOko);
  www.on("/api/mrug", HTTP_GET, apiMrug);
  www.on("/api/powieki", HTTP_GET, apiPowieki);
  www.on("/api/troll", HTTP_GET, apiTroll);
  www.on("/api/refleks", HTTP_GET, apiRefleks);
  www.on("/api/rodzic/pin", HTTP_GET, apiPin);
  www.on("/api/rodzic/stan", HTTP_GET, apiRodzicStan);
  www.on("/api/rodzic/wybierz", HTTP_GET, apiWybierz);
  www.on("/api/rodzic/kal", HTTP_GET, apiKal);
  www.on("/api/rodzic/test", HTTP_GET, apiTest);
  www.on("/api/rodzic/zapisz", HTTP_GET, apiZapisz);
  www.on("/api/rodzic/oznacz", HTTP_GET, apiOznacz);
  www.on("/api/rodzic/nowe", HTTP_GET, apiNoweSerwo);
  www.on("/api/rodzic/kreator", HTTP_GET, apiKreator);
  www.on("/api/rodzic/wylacz", HTTP_GET, apiWylacz);
  www.on("/api/rodzic/ustaw", HTTP_GET, apiUstaw);
  www.on("/api/rodzic/parkuj", HTTP_GET, apiParkuj);
  www.on("/api/rodzic/wznow", HTTP_GET, apiWznow);
  www.on("/api/rodzic/restart", HTTP_GET, apiRestart);
  www.on("/api/rodzic/zeruj", HTTP_GET, apiZeruj);
  www.on("/api/rodzic/wyloguj", HTTP_GET, apiWyloguj);
  www.onNotFound(nieZnaleziono);
  www.begin();
}

void krokSerwera(uint32_t) {
  www.handleClient();
  uint32_t t = millis();                               // świeży czas po obsłudze zapytań
  if (restartFaza == 1) {                              // restart z panelu: najpierw parkowanie i zapis osiągniętych impulsów
    { Blokada b; ustawTryb(TR_PARK); parkuj(); }
    tRestart = t; restartFaza = 2;
  } else if (restartFaza == 2) {
    bool gotowe;
    { Blokada b; gotowe = zaparkowana() || minelo(t, tRestart, RESTART_PARK_MS); if (gotowe) zapiszPozycjeTeraz(); }
    if (gotowe) { zapiszDziennik(); delay(50); ESP.restart(); }
  }
  if (t - tOstAP > 30000) {                            // strażnik punktu dostępu
    tOstAP = t;
    if (WiFi.getMode() != WIFI_AP) startAP();
  }
}
