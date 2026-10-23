// Silnik ruchu dyni: napędy, kolejki kroków, wspólny limit serw w ruchu, wyjście na PCA9685, pozycje w NVS.
// Bazuje na oczy-ruch: sakada = profil z rozpędem i hamowaniem (smoothstep), czas 120 + 6·|Δ°| ms.
// Uogólnienie: profil Hermite'a – przy zerowych stycznych to dokładnie smoothstep; przy zmianie celu
// w trakcie ruchu („ostatni wygrywa”, pad) nowy odcinek startuje z bieżącą prędkością, więc nie ma szarpnięcia.
// Bezpieczeństwo:
// - cel obcięty do zakresu kalibracji (usDla), szczyt prędkości profilu ≤ V_MAX liczony dokładnie;
// - na wyjściu zmiana impulsu ≤ US_KROK_MAX na krok (kalibracja i rozruch: US_KROK_WOLNO) i granica
//   bezpieczeństwa US_MIN_ABS…US_MAX_ABS przed każdym zapisem; zmiana kalibracji nie skraca drogi impulsu;
// - napęd jest „w ruchu” (limit serw, zapis położenia, park) aż impulsy wszystkich jego kanałów dojdą do celu.
// Start bez skoku: ostatni impuls każdego kanału jest w NVS; po włączeniu PCA9685 najpierw wyłącza wszystkie
// wyjścia (także po restarcie samego ESP), potem kanał po kanale (co 150 ms) zapisany impuls i płynnie do środka.
// Zapisy NVS: cel przy starcie ruchu i położenie po końcu, ale najwyżej co 2 s na napęd i co 0,5 s w całej dyni.
// PCA9685 obsługiwany bezpośrednio przez Wire (bez begin() biblioteki, które ustawia 1000 Hz przy starych rejestrach).
// Małe oko: trzy impulsy z kalibracji – kraniec lewy (−25°), środek (0°), kraniec prawy (+25°), liniowo w każdej
// połówce. „Lewo/prawo” = jak widzi obserwator stojący przed dynią. W kalibracji wyjście kanału może iść za impulsem
// ustawionym strzałkami (usRecz), zawsze z krokiem US_KROK_WOLNO; poza trybem kalibracji usRecz znika sam.

#include "dynia.h"
#include <Wire.h>

Naped nap[NAPEDOW];
Kanal kan[16];
Ustawienia ust;
uint32_t licznikRuchow = 0, zapisyNvs = 0, odrzuconeKroki = 0;

static Preferences nvsPoz;                 // przestrzeń „dyniapoz”: ostatni impuls każdego kanału
static float usNaTick = 4.889f;            // µs na jednostkę PCA9685 (z prescale, 50 Hz)
static uint32_t seqLicznik = 0, tOstStart = 0, tOstKroku = 0, tOstZapisu = 0;
static bool parkowanie = false, zaparkowano = false;
static int8_t kanNap[NAPEDOW][2];          // kanały napędu (-1 = brak)

static float ogr(float v, float lo, float hi) { return v < lo ? lo : (v > hi ? hi : v); }

bool aktywny(int n) { return n >= 0 && n < NAPEDOW && nap[n].uzywany && !nap[n].wylaczony; }

// ---------- PCA9685 ----------

constexpr uint8_t PCA_ADR = 0x40, PCA_MODE1 = 0x00, PCA_LED0 = 0x06, PCA_ALL_OFF_H = 0xFD, PCA_PRESCALE = 0xFE;

static void pcaRejestr(uint8_t reg, uint8_t v) {
  Wire.beginTransmission(PCA_ADR); Wire.write(reg); Wire.write(v); Wire.endTransmission();
}

static uint8_t pcaCzytaj(uint8_t reg) {
  Wire.beginTransmission(PCA_ADR); Wire.write(reg); Wire.endTransmission();
  Wire.requestFrom((int)PCA_ADR, 1);
  return Wire.available() ? Wire.read() : 0x11;
}

static void pcaKanal(uint8_t ch, uint16_t off) {   // impuls od 0 do off; off = 4096 → wyjście wyłączone
  Wire.beginTransmission(PCA_ADR);
  Wire.write(PCA_LED0 + 4 * ch);
  Wire.write(0); Wire.write(0);
  Wire.write(off & 0xFF); Wire.write(off >> 8);
  Wire.endTransmission();
}

static void pcaStart() {
  pcaRejestr(PCA_ALL_OFF_H, 0x10);                 // najpierw wszystkie 16 wyjść wyłączone (także stare rejestry po restarcie ESP)
  uint8_t m = pcaCzytaj(PCA_MODE1);
  pcaRejestr(PCA_MODE1, (m & 0x6F) | 0x10);        // uśpienie: tylko wtedy wolno zmienić dzielnik
  uint8_t pre = (uint8_t)(lroundf(27000000.0f / (4096.0f * 50)) - 1);   // 131 → ok. 50 Hz (oscylator jak w szkicach: 27 MHz)
  pcaRejestr(PCA_PRESCALE, pre);
  pcaRejestr(PCA_MODE1, (m & 0x6F) | 0x20);        // pobudka, auto-inkrementacja rejestrów
  delay(1);
  pcaRejestr(PCA_MODE1, (m & 0x6F) | 0xA0);
  usNaTick = (pre + 1) * 1e6f / 27000000.0f;
}

// ---------- mapowanie ----------

static void ograniczCel(const Naped &n, float *c) {
  if (!isfinite(c[0])) c[0] = n.p[0];
  if (!isfinite(c[1])) c[1] = n.p[1];
  if (n.typ == T_MALE) { c[0] = ogr(c[0], -ZAKRES_MALE, ZAKRES_MALE); c[1] = 0; }
  else if (n.typ == T_GALKA) { c[0] = ogr(c[0], -ZAKRES_DO_X, ZAKRES_DO_X); c[1] = ogr(c[1], -ZAKRES_DO_Y, ZAKRES_DO_Y); }
  else { c[0] = ogr(c[0], 0, 100); c[1] = 0; }
}

// Kinematyka dużego oka: (ψ, θ) w stopniach → impulsy serw X i Y.
// TU MIEJSCE na kinematykę odwrotną prętów S–S (koncepcja v3.1, pkt 3.2: α = atan2(B, A) − acos(...))
// i korektę sprzężenia osi (bez kompensacji serwo Y +5,4° przy ψ +25). Dziś liniowo: środek ± kąt.
// Przy zmianie na IK trzeba też zmienić odwrotnosc() (rozruch z zapisanego impulsu).
static void ikGalki(float psi, float theta, float &usX, float &usY) {
  psi = ogr(psi, -ZAKRES_DO_X, ZAKRES_DO_X);
  theta = ogr(theta, -ZAKRES_DO_Y, ZAKRES_DO_Y);
  usX = kan[KANAL_DO_X].a + kan[KANAL_DO_X].znak * psi * US_NA_STOPIEN;
  usY = kan[KANAL_DO_Y].a + kan[KANAL_DO_Y].znak * theta * US_NA_STOPIEN;
}

// Okno impulsu z kalibracji i zakresu ruchu – ogranicza CEL; wyjście dochodzi do niego z limitem przyrostu.
static void granice(int ch, float &lo, float &hi) {
  const Kanal &k = kan[ch];
  const Naped &n = nap[k.naped];
  if (n.typ == T_POWIEKI) { lo = min(k.a, k.b); hi = max(k.a, k.b); }
  else if (n.typ == T_MALE) { lo = min(k.kl, k.kp); hi = max(k.kl, k.kp); }
  else {
    float r = (n.typ == T_GALKA ? (k.os ? ZAKRES_DO_Y : ZAKRES_DO_X) : ZAKRES_MALE) * US_NA_STOPIEN;
    lo = k.a - r; hi = k.a + r;
  }
  lo = max(lo, (float)US_MIN_ABS); hi = min(hi, (float)US_MAX_ABS);
}

// Położenie napędu → impuls kanału. Jedyna funkcja mapująca kąt na µs.
static int usDla(int ch, const float *p) {
  const Kanal &k = kan[ch];
  const Naped &n = nap[k.naped];
  float us;
  if (n.typ == T_MALE) {                            // asymetrycznie: lewa połówka do krańca lewego, prawa do prawego
    float q = ogr(p[0], -ZAKRES_MALE, ZAKRES_MALE) / ZAKRES_MALE;
    us = q < 0 ? k.a + (k.kl - k.a) * -q : k.a + (k.kp - k.a) * q;
  }
  else if (n.typ == T_GALKA) { float x, y; ikGalki(p[0], p[1], x, y); us = k.os ? y : x; }
  else us = k.a + (k.b - k.a) * ogr(p[0], 0, 100) / 100.0f;
  float lo, hi; granice(ch, lo, hi);
  if (!isfinite(us)) us = k.usWy > 0 ? k.usWy : (lo + hi) / 2;
  return (int)lroundf(ogr(us, lo, hi));
}

int usKanalu(int ch) { return kan[ch].naped < 0 ? -1 : usDla(ch, nap[kan[ch].naped].p); }

// Impuls → położenie napędu (rozruch z zapisanego impulsu).
static float odwrotnosc(int ch, int us) {
  const Kanal &k = kan[ch];
  const Naped &n = nap[k.naped];
  if (n.typ == T_POWIEKI) return k.b == k.a ? 50 : ogr((us - k.a) * 100.0f / (k.b - k.a), 0, 100);
  if (n.typ == T_MALE) {
    int d = us - k.a;
    if (d == 0) return 0;
    bool wLewo = (d < 0) == (k.kl < k.a);
    int kr = wLewo ? k.kl : k.kp;
    if (kr == k.a) return 0;
    return ogr((wLewo ? -1 : 1) * ZAKRES_MALE * d / (float)(kr - k.a), -ZAKRES_MALE, ZAKRES_MALE);
  }
  float zak = n.typ == T_GALKA ? (k.os ? ZAKRES_DO_Y : ZAKRES_DO_X) : ZAKRES_MALE;
  return ogr((us - k.a) / (k.znak * US_NA_STOPIEN), -zak, zak);
}

float katPrzezPolozenie(int n, int os) { return nap[n].p[os]; }

static void wyslij(int ch, int us) {
  us = constrain(us, US_MIN_ABS, US_MAX_ABS);        // granica bezpieczeństwa przed każdym zapisem
  pcaKanal(ch, (uint16_t)lroundf(us / usNaTick));
  kan[ch].usWy = us;
}

static void bezImpulsu(int ch) {
  pcaKanal(ch, 4096);
  kan[ch].pwm = false;
}

// cel wyjścia kanału: impuls ustawiony strzałkami w kalibracji albo położenie napędu z profilu
static int celKanalu(int ch) { return kan[ch].usRecz >= 0 ? kan[ch].usRecz : usDla(ch, nap[kan[ch].naped].p); }

// impulsy wszystkich kanałów napędu doszły do celu (kanał bez impulsu – nie czeka)
static bool wyjscieDoszlo(int i) {
  for (int j = 0; j < 2; j++) {
    int ch = kanNap[i][j];
    if (ch >= 0 && kan[ch].pwm && kan[ch].usWy != celKanalu(ch)) return false;
  }
  return true;
}

// ---------- NVS ----------

static void zapiszUs(int ch, int us) {
  Kanal &k = kan[ch];
  if (abs(us - k.usZap) <= 2) return;
  char key[6];
  snprintf(key, sizeof key, "u%d", ch);
  if (nvsPoz.putShort(key, (int16_t)us) > 0) { k.usZap = us; zapisyNvs++; }
}

static void zapiszNaped(int i, uint32_t t) {          // cel, gdy w ruchu; położenie, gdy stoi
  Naped &n = nap[i];
  const float *v = n.wRuchu ? n.c : n.p;
  for (int j = 0; j < 2; j++) if (kanNap[i][j] >= 0) zapiszUs(kanNap[i][j], usDla(kanNap[i][j], v));
  n.tZapisu = t; n.doZapisu = false;
  tOstZapisu = t;
}

void zapiszPozycjeTeraz() {
  for (int i = 0; i < NAPEDOW; i++) {
    if (!nap[i].uzywany) continue;
    for (int j = 0; j < 2; j++) {
      int ch = kanNap[i][j];
      if (ch >= 0 && kan[ch].usWy > 0) zapiszUs(ch, kan[ch].usWy);   // faktycznie wysłany impuls
    }
    nap[i].doZapisu = false;
  }
}

// ---------- profil ----------

static void hermite(const Naped &n, float u, float *poz, float *v) {
  float u2 = u * u, u3 = u2 * u;
  float h00 = 2 * u3 - 3 * u2 + 1, h10 = u3 - 2 * u2 + u, h01 = -2 * u3 + 3 * u2, h11 = u3 - u2;
  for (int k = 0; k < 2; k++) {
    if (poz) poz[k] = h00 * n.s[k] + h10 * n.m0[k] + h01 * n.c[k] + h11 * n.m1[k];
    if (v) v[k] = ((6 * u2 - 6 * u) * n.s[k] + (3 * u2 - 4 * u + 1) * n.m0[k] +
                   (-6 * u2 + 6 * u) * n.c[k] + (3 * u2 - 2 * u) * n.m1[k]) / n.czas;   // jednostki na ms
  }
}

// największa prędkość napędu w jednostkach na sekundę (powieka: z µs/s i jej kalibracji)
static float vmaxNapedu(int i) {
  if (nap[i].typ != T_POWIEKI) return V_MAX_OKO;
  int ch = kanNap[i][0];
  float zakres = ch >= 0 ? fabsf((float)(kan[ch].b - kan[ch].a)) : 300;
  if (zakres < 50) zakres = 50;
  return V_MAX_POW_US * 100.0f / zakres;
}

uint32_t czasSakady(int i, float d0, float d1, float tempo) {
  float d = max(fabsf(d0), fabsf(d1));
  if (!isfinite(d)) d = 0;
  float t = (nap[i].typ == T_POWIEKI ? (80 + 2 * d) : (120 + 6 * d)) * tempo;
  float tmin = 1.5f * d / vmaxNapedu(i) * 1000;       // smoothstep: szczyt = 1,5·Δ/T
  return (uint32_t)max(max(t, tmin), 60.0f);
}

// dokładny szczyt |v(u)| na [0, 1]; v(u) = (6u²−6u)(s−c)/T + (3u²−4u+1)·v0 + (3u²−2u)·v1, kwadratowa w u
static float szczytProfilu(const float *s, const float *c, const float *v0, const float *v1, float T) {
  float best = 0;
  for (int k = 0; k < 2; k++) {
    float D = (s[k] - c[k]) / T;
    float A = 6 * D + 3 * v0[k] + 3 * v1[k], B = -6 * D - 4 * v0[k] - 2 * v1[k], C = v0[k];
    best = max(best, max(fabsf(C), fabsf(A + B + C)));
    if (fabsf(A) > 1e-9f) {
      float u = -B / (2 * A);
      if (u > 0 && u < 1) best = max(best, fabsf((A * u + B) * u + C));
    }
  }
  return best;
}

static void startRuchu(int i, const float *c, uint32_t czas, const float *v0in, const float *v1in, uint32_t t) {
  Naped &n = nap[i];
  float vm = vmaxNapedu(i) / 1000.0f;                  // jednostki na ms
  float v0[2], v1[2];
  for (int k = 0; k < 2; k++) {
    v0[k] = isfinite(v0in[k]) ? ogr(v0in[k], -vm, vm) : 0;
    v1[k] = isfinite(v1in[k]) ? ogr(v1in[k], -vm, vm) : 0;
    n.s[k] = n.p[k]; n.c[k] = c[k];
  }
  float T = max((float)czas, 1.0f);
  for (int it = 0; it < 40 && szczytProfilu(n.s, n.c, v0, v1, T) > vm * 1.001f; it++) T *= 1.1f;   // twardy limit prędkości
  for (int k = 0; k < 2; k++) { n.m0[k] = v0[k] * T; n.m1[k] = v1[k] * T; }
  n.tStart = t; n.czas = (uint32_t)ceilf(T); n.wRuchu = true;
}

// Styczna na końcu odcinka z przelotem: Catmull-Rom z następnego kroku w kolejce.
static void stycznaKonca(const Naped &n, uint32_t ms, bool przelot, float *v1) {
  v1[0] = v1[1] = 0;
  if (!przelot || n.qn == 0) return;
  const Krok &k = n.q[n.qh];
  if (k.typ != K_RUCH) return;
  for (int j = 0; j < 2; j++) v1[j] = (k.c[j] - n.p[j]) / (float)(ms + k.ms);
}

// ---------- kolejka ----------

static bool wstaw(int i, const Krok &k) {
  Naped &n = nap[i];
  if (n.qn >= KOLEJKA) { odrzuconeKroki++; return false; }
  n.q[(n.qh + n.qn) % KOLEJKA] = k;
  n.qn++;
  return true;
}

static Krok zdejmij(Naped &n) {
  Krok k = n.q[n.qh];
  n.qh = (n.qh + 1) % KOLEJKA; n.qn--;
  return k;
}

void ruch(int i, float c0, float c1, uint32_t ms, bool przelot) {
  if (!aktywny(i) || !isfinite(c0) || !isfinite(c1)) return;
  Krok k; k.typ = K_RUCH; k.przelot = przelot; k.c[0] = c0; k.c[1] = c1; k.ms = ms;
  ograniczCel(nap[i], k.c);
  if (wstaw(i, k)) { nap[i].ost[0] = k.c[0]; nap[i].ost[1] = k.c[1]; }
}

void ruchKat(int i, float kat, float tempo, bool przelot) {
  if (!aktywny(i)) return;
  Naped &n = nap[i];
  float c1 = n.typ == T_GALKA ? n.ost[1] : 0;
  ruch(i, kat, c1, czasSakady(i, kat - n.ost[0], 0, tempo), przelot);
}

void postoj(int i, uint32_t ms) {
  if (!aktywny(i)) return;
  Krok k; k.typ = K_CZEKAJ; k.przelot = false; k.c[0] = k.c[1] = 0; k.ms = ms;
  wstaw(i, k);
}

void czekajDo(int i, uint32_t t) {
  if (!aktywny(i)) return;
  Krok k; k.typ = K_CZEKAJ_DO; k.przelot = false; k.c[0] = k.c[1] = 0; k.ms = t;
  wstaw(i, k);
}

static void ustawCzekanie(int i, const float *c, uint32_t ms, bool przelot) {
  Naped &n = nap[i];
  if (!n.czeka) n.seq = ++seqLicznik;            // zachowaj miejsce w kolejce, jeśli już czekał
  n.czeka = true; n.cc[0] = c[0]; n.cc[1] = c[1]; n.czasC = ms; n.przelotC = przelot;
}

void wyczysc(int i) {
  Naped &n = nap[i];
  n.qn = 0; n.qh = 0; n.tCzekajDo = 0; n.czeka = false;
  n.ost[0] = n.wRuchu ? n.c[0] : n.p[0];
  n.ost[1] = n.wRuchu ? n.c[1] : n.p[1];
}

void wyczyscWszystko() { for (int i = 0; i < NAPEDOW; i++) if (nap[i].uzywany) wyczysc(i); }

void natychmiast(int i, float c0, float c1, float tempo) {
  if (!aktywny(i) || !isfinite(c0) || !isfinite(c1)) return;
  Naped &n = nap[i];
  n.qn = 0; n.qh = 0; n.tCzekajDo = 0;
  float c[2] = {c0, c1};
  ograniczCel(n, c);
  n.ost[0] = c[0]; n.ost[1] = c[1];
  uint32_t ms = czasSakady(i, c[0] - n.p[0], c[1] - n.p[1], tempo);
  if (n.wRuchu) {                                 // zmiana celu w biegu: start z bieżącą prędkością
    float v[2], z[2] = {0, 0};
    float u = ogr((float)(int32_t)(tOstKroku - n.tStart) / n.czas, 0, 1);
    hermite(n, u, nullptr, v);
    startRuchu(i, c, ms, v, z, tOstKroku);
    n.doZapisu = true;
  } else ustawCzekanie(i, c, ms, false);
}

bool wolny(int i) {
  const Naped &n = nap[i];
  return !n.uzywany || (!n.wRuchu && !n.czeka && n.qn == 0 && n.tCzekajDo == 0 && wyjscieDoszlo(i));
}

bool wszystkieWolne() {
  for (int i = 0; i < NAPEDOW; i++) if (!wolny(i)) return false;
  return true;
}

int wRuchuSerw() {
  int w = 0;
  for (int i = 0; i < NAPEDOW; i++) if (nap[i].wRuchu) w += nap[i].koszt;
  return w;
}

int najwiekszyKoszt() {
  int k = 1;
  for (int i = 0; i < NAPEDOW; i++) if (nap[i].uzywany) k = max(k, (int)nap[i].koszt);
  return k;
}

bool budzetWolny(int koszt) { return wRuchuSerw() + koszt <= ust.maxWRuchu; }   // bez wyjątków (maxWRuchu ≥ największy koszt)

// ---------- prymitywy ----------

void mrugnij(int ile) {                           // obie powieki razem: zamknięcie i powrót każdej do jej położenia
  int pw[2] = {N_POW_G, N_POW_D};
  for (int z = 0; z < 2; z++) {
    int i = pw[z];
    if (!aktywny(i)) continue;
    float r = nap[i].ost[0];
    wyczysc(i);
    if (r < 30) r = 75;
    for (int j = 0; j < ile; j++) {
      ruch(i, 0, 0, 110);                         // zamykanie ok. 0,1 s (dłużej przy szerokiej kalibracji)
      ruch(i, r, 0, 200);                         // otwieranie ok. 0,2 s
      if (j + 1 < ile) postoj(i, 120);
    }
  }
}

void drzenie(int i) {                               // krótkie drżenie ±4° (zamiast mrugnięcia bez dużego oka)
  if (!aktywny(i)) return;
  float b = nap[i].ost[0], b1 = nap[i].typ == T_GALKA ? nap[i].ost[1] : 0;
  ruch(i, b + 4, b1, 140, true); ruch(i, b - 4, b1, 160, true); ruch(i, b, b1, 140);
}

// ---------- krok ----------

static void zakonczOdcinek(int i, uint32_t t) {
  Naped &n = nap[i];
  n.p[0] = n.c[0]; n.p[1] = n.c[1];
  n.wRuchu = false;
  n.vK[0] = n.m1[0] / n.czas; n.vK[1] = n.m1[1] / n.czas;
  n.tKonca = t;
  licznikRuchow++;
  if (n.qn > 0 && n.q[n.qh].typ == K_RUCH) {      // kontynuacja: napęd zostaje w limicie, przy przelocie z prędkością końca
    Krok k = zdejmij(n);
    float v1[2]; stycznaKonca(n, k.ms, k.przelot, v1);
    startRuchu(i, k.c, k.ms, n.vK, v1, t);
  }
  n.doZapisu = true;
}

static void startCzekajacego(int i, uint32_t t) {
  Naped &n = nap[i];
  n.czeka = false;
  float v0[2] = {0, 0}, v1[2];
  stycznaKonca(n, n.czasC, n.przelotC, v1);
  startRuchu(i, n.cc, n.czasC, v0, v1, t);
  n.doZapisu = true;                               // cel ruchu do NVS (z limitem częstości)
}

void krokRuchu(uint32_t t) {
  tOstKroku = t;
  // 1. położenia z profili
  for (int i = 0; i < NAPEDOW; i++) {
    Naped &n = nap[i];
    if (!n.uzywany || !n.wRuchu) continue;
    float u = (float)(int32_t)(t - n.tStart) / n.czas;
    if (u >= 1) { n.p[0] = n.c[0]; n.p[1] = n.c[1]; continue; }
    if (u < 0) u = 0;
    float poz[2]; hermite(n, u, poz, nullptr);
    n.p[0] = poz[0]; n.p[1] = poz[1];
    ograniczCel(n, n.p);
  }

  // 2. wyjście: twardy limit zmiany impulsu na krok, zapis tylko zmienionych kanałów
  for (int ch = 0; ch < 16; ch++) {
    Kanal &k = kan[ch];
    if (k.naped < 0 || !k.pwm) continue;
    if (k.usRecz >= 0 && tryb != TR_KALIBRACJA) { k.usRecz = -1; k.wolno = true; }   // po kalibracji powoli do ruchu napędu
    int cel = celKanalu(ch);
    int lim = (k.wolno || k.usRecz >= 0) ? US_KROK_WOLNO : US_KROK_MAX;
    int d = cel - k.usWy;
    if (d > lim) d = lim; else if (d < -lim) d = -lim;
    else k.wolno = false;
    if (d) wyslij(ch, k.usWy + d);
  }

  // 3. koniec odcinka dopiero po końcu profilu i dojściu impulsów
  for (int i = 0; i < NAPEDOW; i++) {
    Naped &n = nap[i];
    if (n.uzywany && n.wRuchu && (int32_t)(t - n.tStart) >= (int32_t)n.czas && wyjscieDoszlo(i)) zakonczOdcinek(i, t);
  }

  // 4. kolejki napędów bez ruchu
  for (int i = 0; i < NAPEDOW; i++) {
    Naped &n = nap[i];
    if (!n.uzywany || n.wRuchu || n.czeka) continue;
    while (true) {
      if (n.tCzekajDo) { if ((int32_t)(t - n.tCzekajDo) < 0) break; n.tCzekajDo = 0; }
      if (n.qn == 0) break;
      Krok k = zdejmij(n);
      if (k.typ == K_RUCH) { ustawCzekanie(i, k.c, k.ms, k.przelot); break; }
      n.tCzekajDo = (k.typ == K_CZEKAJ ? t + k.ms : k.ms) | 1;
    }
  }

  // 5. start oczekujących: kolejność zgłoszeń, limit serw w ruchu, rozsunięte starty; para powiek razem
  if (t - tOstStart >= ODSTEP_STARTOW_MS) {
    int best = -1;
    for (int i = 0; i < NAPEDOW; i++)
      if (nap[i].uzywany && nap[i].czeka && (best < 0 || (int32_t)(nap[i].seq - nap[best].seq) < 0)) best = i;
    if (best >= 0) {
      int pr = nap[best].para;
      bool razem = pr >= 0 && nap[pr].uzywany && nap[pr].czeka && !nap[pr].wRuchu &&
                   (nap[pr].seq == nap[best].seq + 1 || nap[pr].seq + 1 == nap[best].seq);
      int koszt = nap[best].koszt + (razem ? nap[pr].koszt : 0);
      if (budzetWolny(koszt)) {
        startCzekajacego(best, t);
        if (razem) startCzekajacego(pr, t);
        tOstStart = t;
      } else if (razem && budzetWolny(nap[best].koszt) && wRuchuSerw() == 0) {
        startCzekajacego(best, t);                 // limit mniejszy niż para: po jednej
        tOstStart = t;
      }
    }
  }

  // 6. wyłączanie oka i koniec parkowania
  for (int i = 0; i < NAPEDOW; i++) {
    Naped &n = nap[i];
    if (n.doWylaczenia && wolny(i)) {
      zapiszNaped(i, t);
      for (int j = 0; j < 2; j++) if (kanNap[i][j] >= 0) bezImpulsu(kanNap[i][j]);
      n.doWylaczenia = false;
    }
  }
  if (parkowanie && wszystkieWolne()) {
    parkowanie = false; zaparkowano = true;
    zapiszPozycjeTeraz();                          // osiągnięte położenie, zanim zniknie impuls
    if (PARK_BEZ_PWM) for (int ch = 0; ch < 16; ch++) if (kan[ch].naped >= 0 && kan[ch].pwm) bezImpulsu(ch);
  }

  // 7. zapisy położeń do NVS: stojący napęd z impulsem innym niż zapisany (np. po kalibracji) też do zapisu;
  //    najwyżej jeden zapis na ZAPIS_ODSTEP_MS, napęd najwyżej co ZAPIS_PONOWNY_MS, najstarszy pierwszy
  for (int i = 0; i < NAPEDOW; i++) {
    Naped &n = nap[i];
    if (!n.uzywany || n.wRuchu || n.doZapisu || !wyjscieDoszlo(i)) continue;
    for (int j = 0; j < 2; j++) {
      int ch = kanNap[i][j];
      if (ch >= 0 && kan[ch].pwm && abs(kan[ch].usWy - kan[ch].usZap) > 2) n.doZapisu = true;
    }
  }
  if (t - tOstZapisu >= ZAPIS_ODSTEP_MS) {
    int best = -1;
    for (int i = 0; i < NAPEDOW; i++) {
      const Naped &n = nap[i];
      if (!n.uzywany || !n.doZapisu || (n.tZapisu && t - n.tZapisu < ZAPIS_PONOWNY_MS)) continue;
      if (best < 0 || (int32_t)(n.tZapisu - nap[best].tZapisu) < 0) best = i;
    }
    if (best >= 0) zapiszNaped(best, t);
  }
}

// ---------- parkowanie, wyłączanie, kalibracja ----------

void parkuj() {
  wyczyscWszystko();
  for (int i = 0; i < NAPEDOW; i++)
    if (aktywny(i)) natychmiast(i, nap[i].typ == T_POWIEKI ? PARK_POWIEKI : 0, 0, 2.0f);
  parkowanie = true; zaparkowano = false;
}

bool zaparkowana() { return zaparkowano; }

void wznowPoParkowaniu() {
  parkowanie = false; zaparkowano = false;
  for (int ch = 0; ch < 16; ch++) {
    Kanal &k = kan[ch];
    if (k.naped < 0 || k.pwm || nap[k.naped].wylaczony) continue;
    wyslij(ch, k.usWy >= 0 ? k.usWy : usDla(ch, nap[k.naped].p));   // tam, gdzie oko stoi
    k.pwm = true; k.wolno = true;
  }
}

void ustawWylaczenie(int i, bool wyl) {
  if (i < 0 || i >= NAPEDOW || !nap[i].uzywany) return;
  Naped &n = nap[i];
  char key[6]; snprintf(key, sizeof key, "w%d", i);
  nvs.putBool(key, wyl);
  if (wyl && !n.wylaczony) {
    natychmiast(i, n.typ == T_POWIEKI ? PARK_POWIEKI : 0, 0, 2.0f);   // najpierw płynnie na środek
    n.wylaczony = true; n.doWylaczenia = true;
  } else if (!wyl && n.wylaczony) {
    n.wylaczony = false; n.doWylaczenia = false;
    for (int j = 0; j < 2; j++) {
      int ch = kanNap[i][j];
      if (ch < 0 || kan[ch].pwm) continue;
      wyslij(ch, kan[ch].usWy >= 0 ? kan[ch].usWy : usDla(ch, n.p));
      kan[ch].pwm = true; kan[ch].wolno = true;
    }
  }
}

static void bezRecznego(int pomin) {                // inne kanały wracają powoli do ruchu napędu
  for (int c = 0; c < 16; c++) if (c != pomin && kan[c].usRecz >= 0) { kan[c].usRecz = -1; kan[c].wolno = true; }
}

void kalibrujWybierz(int ch, char param) {          // rusza tylko napęd wybranego kanału
  if (ch < 0 || ch > 15 || kan[ch].naped < 0) return;
  int i = kan[ch].naped;
  bezRecznego(-1);
  wyczyscWszystko();
  if (nap[i].typ == T_POWIEKI) natychmiast(i, param == 'b' ? 100 : 0, 0, 2.0f);
  else natychmiast(i, 0, 0, 2.0f);
}

// Krańce małego oka: po przeciwnych stronach środka, KRANIEC_MIN_US…KRANIEC_MAX_US od niego.
static bool krancePoprawne(int a, int kl, int kp) {
  int dl = kl - a, dp = kp - a;
  return (dl < 0) != (dp < 0) && abs(dl) >= KRANIEC_MIN_US && abs(dp) >= KRANIEC_MIN_US &&
         abs(dl) <= KRANIEC_MAX_US && abs(dp) <= KRANIEC_MAX_US &&
         min(kl, kp) >= US_MIN_ABS && max(kl, kp) <= US_MAX_ABS;
}

const char *kalibrujUstaw(int ch, char param, int v) {
  if (ch < 0 || ch > 15 || kan[ch].naped < 0) return "kanał";
  Kanal &k = kan[ch];
  TypNapedu typ = nap[k.naped].typ;
  if (typ == T_MALE) {
    int a = k.a, kl = k.kl, kp = k.kp;
    if (param == 'a') { if (v < 1200 || v > 1800) return "środek poza 1200–1800 µs"; a = v; }
    else if (param == 'l') kl = v;
    else if (param == 'r') kp = v;
    else if (param == 'z') { kl = k.kp; kp = k.kl; }          // odwróć kierunek: zamiana krańców
    else return "parametr";
    if (!krancePoprawne(a, kl, kp)) return "środek musi leżeć między krańcami (30–700 µs od każdego)";
    k.a = a; k.kl = kl; k.kp = kp;
  } else {
    bool pow = typ == T_POWIEKI;
    if (param == 'a') k.a = pow ? constrain(v, 1000, 2000) : constrain(v, 1200, 1800);
    else if (param == 'b' && pow) k.b = constrain(v, 1000, 2000);
    else if (param == 'z') k.znak = v < 0 ? -1 : 1;
    else return "parametr";
  }
  k.wolno = true;                                  // impuls dochodzi do nowego okna powoli (ok. 18°/s), bez skoku
  return nullptr;
}

const char *kalibrujStrzalka(int ch, int dUs) {
  if (ch < 0 || ch > 15 || kan[ch].naped < 0 || nap[kan[ch].naped].typ != T_MALE) return "strzałki tylko dla małych oczu";
  Kanal &k = kan[ch];
  if (!k.pwm) return "kanał bez impulsu (wyłączony albo zaparkowany)";
  bezRecznego(ch);
  int wPrawo = k.kp > k.a ? 1 : -1;               // kierunek „w prawo” z bieżącej kalibracji
  int start = k.usRecz >= 0 ? k.usRecz : usDla(ch, nap[k.naped].ost);   // pierwsza strzałka: od celu napędu (po wyborze oka – środek)
  k.usRecz = constrain(start + wPrawo * constrain(dUs, -50, 50), US_MIN_ABS, US_MAX_ABS);
  return nullptr;
}

// ---------- kreator kalibracji małego oka (strona: kroki 1–5) ----------
// Użytkownik nie musi wiedzieć, co jest lewo/prawo: ◀ ▶ zmieniają sam impuls (µs), zapisuje środek, kraniec 1
// i kraniec 2 (po przeciwnych stronach środka), a w kroku 4 mówi, w którą stronę – patrząc od przodu – patrzy
// piłka na krańcu 1. Stąd kraniec lewy (−25°) i prawy (+25°), a więc kierunek wszystkich efektów.
static int16_t kreatorK1[16], kreatorK2[16];
static bool kreatorStart = false;

static int pozycjaRecznaUs(int ch) {
  const Kanal &k = kan[ch];
  return k.usRecz >= 0 ? k.usRecz : usDla(ch, nap[k.naped].ost);
}

const char *kalibrujImpuls(int ch, int dUs) {      // ◀ = mniej µs, ▶ = więcej µs (bez lewo/prawo)
  if (ch < 0 || ch > 15 || kan[ch].naped < 0 || nap[kan[ch].naped].typ != T_MALE) return "tylko dla małych oczu";
  Kanal &k = kan[ch];
  if (!k.pwm) return "kanał bez impulsu (wyłączony albo zaparkowany)";
  bezRecznego(ch);
  k.usRecz = constrain(pozycjaRecznaUs(ch) + constrain(dUs, -50, 50), US_MIN_ABS, US_MAX_ABS);
  return nullptr;
}

const char *kreatorKrok(int ch, char krok, int lewa, int &us) {
  if (!kreatorStart) { for (int c = 0; c < 16; c++) kreatorK1[c] = kreatorK2[c] = -1; kreatorStart = true; }
  if (ch < 0 || ch > 15 || kan[ch].naped < 0 || nap[kan[ch].naped].typ != T_MALE) return "tylko dla małych oczu";
  Kanal &k = kan[ch];
  us = pozycjaRecznaUs(ch);
  switch (krok) {
    case 's': {                                    // krok 1: środek; krańce tymczasowo ±278 µs
      if (us < 1200 || us > 1800) return "Środek musi być między 1200 a 1800 µs – ustaw piłkę bliżej środka";
      k.a = us; k.kl = us - KRANIEC_DOM_US; k.kp = us + KRANIEC_DOM_US; k.wolno = true;
      kreatorK1[ch] = kreatorK2[ch] = -1;
      return nullptr;
    }
    case '1': {                                    // krok 2: kraniec 1 (dowolna strona)
      int d = abs(us - k.a);
      if (d < KRANIEC_MIN_US) return "Za blisko środka – obróć piłkę dalej, aż do oporu, i cofnij o mały krok";
      if (d > KRANIEC_MAX_US) return "Za daleko od środka (ponad 700 µs) – cofnij";
      kreatorK1[ch] = us; kreatorK2[ch] = -1;
      return nullptr;
    }
    case '2': {                                    // krok 3: kraniec 2 po drugiej stronie środka
      if (kreatorK1[ch] < 0) return "Najpierw zapisz kraniec 1";
      if ((us < k.a) == (kreatorK1[ch] < k.a))
        return "Kraniec 2 jest po tej samej stronie co kraniec 1 – obróć piłkę w DRUGĄ stronę, za środek";
      int d = abs(us - k.a);
      if (d < KRANIEC_MIN_US) return "Za blisko środka – obróć piłkę dalej, aż do oporu, i cofnij o mały krok";
      if (d > KRANIEC_MAX_US) return "Za daleko od środka (ponad 700 µs) – cofnij";
      kreatorK2[ch] = us;
      return nullptr;
    }
    case 'p':                                      // krok 4: piłka płynnie (4 µs / 20 ms) na kraniec 1
      if (kreatorK1[ch] < 0 || kreatorK2[ch] < 0) return "Najpierw zapisz oba krańce";
      bezRecznego(ch);
      k.usRecz = kreatorK1[ch]; us = k.usRecz;
      return nullptr;
    case 'k': {                                    // krok 4: odpowiedź – kraniec 1 widziany w lewo czy w prawo
      if (kreatorK1[ch] < 0 || kreatorK2[ch] < 0) return "Najpierw zapisz oba krańce";
      int kl = lewa ? kreatorK1[ch] : kreatorK2[ch], kp = lewa ? kreatorK2[ch] : kreatorK1[ch];
      if (!krancePoprawne(k.a, kl, kp)) return "Krańce niepoprawne – zacznij od nowa";
      k.kl = kl; k.kp = kp; k.znak = kp > k.a ? 1 : -1; k.wolno = true;
      bezRecznego(ch);
      k.usRecz = k.a; us = k.a;                    // wraca płynnie na środek
      return nullptr;
    }
  }
  return "nieznany krok";
}

const char *kalibrujOznacz(int ch, char param) {
  if (ch < 0 || ch > 15 || kan[ch].naped < 0 || nap[kan[ch].naped].typ != T_MALE) return "tylko dla małych oczu";
  Kanal &k = kan[ch];
  int us = k.usRecz >= 0 ? k.usRecz : k.usWy;
  if (us < 0) return "brak impulsu";
  if (param == 'a') {                              // nowy środek: krańce przesuwają się razem z nim, jeśli trzeba
    int dl = k.kl - k.a, dp = k.kp - k.a;
    if (us < 1200 || us > 1800) return "środek poza 1200–1800 µs";
    if (krancePoprawne(us, k.kl, k.kp)) return kalibrujUstaw(ch, 'a', us);
    if (!krancePoprawne(us, us + dl, us + dp)) return "środek poza zakresem";
    k.a = us; k.kl = us + dl; k.kp = us + dp; k.wolno = true;
    return nullptr;
  }
  return kalibrujUstaw(ch, param, us);
}

const char *kalibrujNoweSerwo(int ch) {
  if (ch < 0 || ch > 15 || kan[ch].naped < 0 || nap[kan[ch].naped].typ != T_MALE) return "tylko dla małych oczu";
  Kanal &k = kan[ch];
  Naped &n = nap[k.naped];
  if (n.wylaczony) return "oko wyłączone – najpierw włącz";
  bezRecznego(ch);
  wyczysc(k.naped);
  n.wRuchu = false; n.czeka = false; n.p[0] = n.p[1] = 0; n.ost[0] = n.ost[1] = 0;
  k.a = NOWE_SERWO_US; k.kl = NOWE_SERWO_US - KRANIEC_DOM_US; k.kp = NOWE_SERWO_US + KRANIEC_DOM_US; k.znak = 1;
  k.usRecz = NOWE_SERWO_US;
  wyslij(ch, NOWE_SERWO_US);                       // jedyny zamierzony skok: świeże serwo bez dźwigienki
  k.pwm = true; k.wolno = false;
  return nullptr;
}

void kalibrujTest(int ch) {                        // wolny test: środek → lewy → prawy → środek
  if (ch < 0 || ch > 15 || kan[ch].naped < 0) return;
  int n = kan[ch].naped;
  bezRecznego(-1);
  wyczyscWszystko();
  if (nap[n].typ == T_POWIEKI) { ruch(n, 0, 0, 1200); postoj(n, 500); ruch(n, 100, 0, 1200); postoj(n, 500); ruch(n, 75, 0, 800); }
  else if (nap[n].typ == T_GALKA) {
    ruch(n, -ZAKRES_DO_X, 0, 1500); ruch(n, ZAKRES_DO_X, 0, 2500); ruch(n, 0, 0, 1500);
    ruch(n, 0, -ZAKRES_DO_Y, 1200); ruch(n, 0, ZAKRES_DO_Y, 2000); ruch(n, 0, 0, 1200);
  } else {
    ruch(n, 0, 0, 1500); postoj(n, 600);
    ruch(n, -ZAKRES_MALE, 0, 2000); postoj(n, 800);
    ruch(n, ZAKRES_MALE, 0, 3000); postoj(n, 800);
    ruch(n, 0, 0, 2000);
  }
}

void zapiszKalibracje() {
  char key[6];
  for (int ch = 0; ch < 16; ch++) {
    if (kan[ch].naped < 0) continue;
    snprintf(key, sizeof key, "a%d", ch); nvs.putShort(key, kan[ch].a);
    snprintf(key, sizeof key, "b%d", ch); nvs.putShort(key, kan[ch].b);
    snprintf(key, sizeof key, "z%d", ch); nvs.putChar(key, kan[ch].znak);
    if (nap[kan[ch].naped].typ == T_MALE) {
      snprintf(key, sizeof key, "l%d", ch); nvs.putShort(key, kan[ch].kl);
      snprintf(key, sizeof key, "r%d", ch); nvs.putShort(key, kan[ch].kp);
    }
  }
  for (int i = 0; i < N_MALYCH_MAX; i++) {
    snprintf(key, sizeof key, "az%d", i);
    nvs.putShort(key, (int16_t)lroundf(ust.azymut[i] * 10));
  }
}

void zapiszUstawienia() {                           // n i duże oko zapisuje tylko /api/rodzic/ustaw (działają po restarcie)
  nvs.putInt("max", ust.maxWRuchu);
  nvs.putBool("wyst", ust.wystawa);
}

void wypiszKanaly() {
  for (int ch = 0; ch < 16; ch++) {
    const Kanal &k = kan[ch];
    if (k.naped < 0) continue;
    Serial.printf("kanal %2d: naped %2d%s a=%d b=%d lewy=%d prawy=%d znak=%d impuls=%d nvs=%d%s\n", ch, k.naped,
                  nap[k.naped].wylaczony ? " (wylaczony)" : "", k.a, k.b, k.kl, k.kp, k.znak, k.usWy, k.usZap, k.pwm ? "" : " bez PWM");
  }
}

// ---------- start ----------

static void przypiszKanal(int ch, int naped, int os) {
  if (ch < 0 || ch > 15) return;
  kan[ch].naped = naped; kan[ch].os = os;
  kanNap[naped][os] = ch;
}

static void migracjaNvs() {                         // wersja 1: duże oko na 13–15, inne indeksy napędów → kasuj
  if (nvs.getInt("wer", 1) == NVS_WERSJA) return;
  char key[6];
  for (int ch = 12; ch < 16; ch++) {
    snprintf(key, sizeof key, "a%d", ch); nvs.remove(key);
    snprintf(key, sizeof key, "b%d", ch); nvs.remove(key);
    snprintf(key, sizeof key, "z%d", ch); nvs.remove(key);
    snprintf(key, sizeof key, "u%d", ch); nvsPoz.remove(key);
  }
  for (int i = 12; i < NAPEDOW; i++) { snprintf(key, sizeof key, "w%d", i); nvs.remove(key); }
  nvs.putInt("wer", NVS_WERSJA);
}

void ruchStart() {
  nvsPoz.begin("dyniapoz", false);
  migracjaNvs();
  ust.n = constrain(nvs.getInt("n", N_MALYCH), 1, N_MALYCH_MAX);
  ust.duze = nvs.getBool("duze", DUZE_OKO);
  ust.wystawa = nvs.getBool("wyst", false);
  if (ust.duze) ust.n = min(ust.n, min(min(KANAL_DO_X, KANAL_DO_Y), min(KANAL_POW_G, KANAL_POW_D)));
  ust.maxWRuchu = constrain(nvs.getInt("max", MAX_W_RUCHU), ust.duze ? 2 : 1, 8);
  char key[6];
  for (int i = 0; i < N_MALYCH_MAX; i++) {
    float dom = ust.n <= 1 ? 0 : -100 + 200.0f * i / (ust.n - 1);   // równo w łuku −100°…+100°
    snprintf(key, sizeof key, "az%d", i);
    ust.azymut[i] = nvs.getShort(key, (int16_t)lroundf(dom * 10)) / 10.0f;
  }

  for (int i = 0; i < NAPEDOW; i++) kanNap[i][0] = kanNap[i][1] = -1;
  for (int i = 0; i < ust.n; i++) {
    nap[i].typ = T_MALE; nap[i].koszt = 1; nap[i].uzywany = true;
    przypiszKanal(i, i, 0);
  }
  if (ust.duze) {
    nap[N_GALKA].typ = T_GALKA; nap[N_GALKA].koszt = 2; nap[N_GALKA].uzywany = true;
    przypiszKanal(KANAL_DO_X, N_GALKA, 0);
    przypiszKanal(KANAL_DO_Y, N_GALKA, 1);
    int pw[2] = {N_POW_G, N_POW_D}, kn[2] = {KANAL_POW_G, KANAL_POW_D};
    for (int z = 0; z < 2; z++) {
      Naped &n = nap[pw[z]];
      n.typ = T_POWIEKI; n.koszt = 1; n.uzywany = true; n.para = pw[1 - z];
      przypiszKanal(kn[z], pw[z], 0);
    }
  }
  for (int ch = 0; ch < 16; ch++) {
    Kanal &k = kan[ch];
    if (k.naped < 0) continue;
    bool pow = nap[k.naped].typ == T_POWIEKI;
    snprintf(key, sizeof key, "a%d", ch); k.a = nvs.getShort(key, pow ? POW_ZAMK_US : 1500);
    snprintf(key, sizeof key, "b%d", ch); k.b = nvs.getShort(key, pow ? POW_OTW_US : 1500);
    snprintf(key, sizeof key, "z%d", ch); k.znak = nvs.getChar(key, 1) < 0 ? -1 : 1;
    if (nap[k.naped].typ == T_MALE) {             // krańce; bez zapisu (stara wersja) z dotychczasowego środka i znaku: ±278 µs
      int dl = k.a - k.znak * KRANIEC_DOM_US, dp = k.a + k.znak * KRANIEC_DOM_US;
      snprintf(key, sizeof key, "l%d", ch); int kl = nvs.getShort(key, dl);
      snprintf(key, sizeof key, "r%d", ch); int kp = nvs.getShort(key, dp);
      if (!krancePoprawne(k.a, kl, kp)) { kl = dl; kp = dp; }
      k.kl = kl; k.kp = kp;
    }
  }
  for (int i = 0; i < NAPEDOW; i++) {
    if (!nap[i].uzywany) continue;
    snprintf(key, sizeof key, "w%d", i);
    nap[i].wylaczony = nvs.getBool(key, false);
  }

  Wire.begin(PIN_SDA, PIN_SCL);
  Wire.setClock(I2C_HZ);
  pcaStart();                                      // wszystkie wyjścia wyłączone, 50 Hz

  // Rozruch: kanał po kanale najpierw ostatni zapisany impuls (tam oko stoi), potem płynnie do środka.
  // Bez zapisu: położenie spoczynkowe (środek, powieki PARK_POWIEKI) – wtedy możliwy skok.
  for (int i = 0; i < NAPEDOW; i++) {
    Naped &n = nap[i];
    if (!n.uzywany) continue;
    n.p[0] = n.typ == T_POWIEKI ? PARK_POWIEKI : 0; n.p[1] = 0;
    for (int j = 0; j < 2; j++) {
      int ch = kanNap[i][j];
      if (ch < 0) continue;
      snprintf(key, sizeof key, "u%d", ch);
      bool jest = nvsPoz.isKey(key);
      int us = jest ? nvsPoz.getShort(key, 1500) : usDla(ch, n.p);
      float lo, hi; granice(ch, lo, hi);
      us = (int)ogr(us, lo, hi);
      kan[ch].usZap = jest ? nvsPoz.getShort(key, -1) : -1;
      kan[ch].usWy = us;
      n.p[n.typ == T_GALKA ? j : 0] = odwrotnosc(ch, us);
    }
    n.ost[0] = n.p[0]; n.ost[1] = n.p[1];
  }
  for (int ch = 0; ch < 16; ch++) {
    Kanal &k = kan[ch];
    if (k.naped < 0 || nap[k.naped].wylaczony) continue;   // wyłączone oko: bez impulsu
    wyslij(ch, k.usWy);
    k.pwm = true; k.wolno = true;
    Serial.printf("rozruch: kanal %d od %d us\n", ch, k.usWy);
    delay(ROZRUCH_KANAL_MS);
  }
  for (int i = 0; i < NAPEDOW; i++) {
    if (!aktywny(i)) continue;
    float c0 = nap[i].typ == T_POWIEKI ? 75 : 0;
    ruch(i, c0, 0, czasSakady(i, c0 - nap[i].p[0], nap[i].p[1], 2.5f));
  }
}
