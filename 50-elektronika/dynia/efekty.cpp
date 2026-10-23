// Tryby dyni (automat, efekt, sterowanie ręczne, kalibracja, park), automat z oczy-ruch, emocje i efekty.
// Efekt układa kroki w kolejkach napędów (ruch, postój, czekaj do chwili); limit serw w ruchu
// i kolejność startów pilnuje ruch.cpp, więc „wszystkie naraz” samo zamienia się w kaskadę.
// Efekty z dużym okiem mają wersję na samych małych oczach (opis w README, tabela efektów).
// Konwencja kątów: azymut oka na obwodzie dyni od przodu, dodatni w prawo patrząc na dynię;
// kąt oka dodatni = spojrzenie w prawo (patrząc na dynię). Oko patrzy w kierunek φ: kąt = φ − azymut (±25°).

#include "dynia.h"

Tryb tryb = TR_ROZRUCH;

// ---------- nastroje automatu (emocje) ----------

struct Nastroj {
  const char *nazwa;
  uint8_t rozG, rozD;         // rozwarcie powieki górnej i dolnej dużego oka, % (0 = zamknięta)
  uint16_t fiksMin, fiksMax;  // fiksacja po sakadzie, ms
  uint8_t zakres;             // zakres losowych celów, °
  float tempo;                // mnożnik czasu sakady (> 1 = wolniej)
  uint16_t mrugMin, mrugMax;  // odstęp mrugnięć, ms
  uint16_t odstep;            // najmniejszy odstęp między ruchami małych oczu (0 = bez limitu poza serwami)
  bool skan;                  // wolny skan z boku na bok (podejrzliwy)
  bool grupa;                 // czasem wszystkie w tę samą stronę
  bool bezpieczny;            // dostępny w trybie wystawowym
};

static const Nastroj NASTROJE[] = {
  {"spoczynek",      75,  75, 1500, 6000, 25, 1.0f, 3000,  7000, 5000, false, false, true},   // oczy-ruch SPOCZYNEK
  {"aktywny",        85,  85,  400, 1800, 25, 1.0f, 2500,  5000,    0, false, true,  true},   // oczy-ruch AKTYWNY
  {"senny",          30,  85, 3000, 8000, 10, 2.0f, 1500,  3500, 6000, false, false, true},   // górna nisko
  {"ciekawski",      95,  95,  500, 1500, 25, 1.0f, 3000,  6000, 1500, false, true,  true},
  {"podejrzliwy",    50,  40, 1200, 2500, 20, 3.5f, 6000, 10000, 2500, true,  false, true},   // dolna wyżej, wolny skan
  {"przestraszony", 100, 100,  300,  800, 15, 0.8f, 1500,  3000,  400, false, false, false},
  {"znudzony",       50,  80, 2500, 6000,  8, 1.8f, 2500,  5000, 4000, false, false, true},
  {"zlosliwy",       70,  30,  800, 2000, 20, 1.2f, 4000,  8000, 1500, false, true,  true},   // przymrużenie: dolna wysoko
};
constexpr int N_NASTROJOW = sizeof(NASTROJE) / sizeof(NASTROJE[0]);
constexpr int PIERWSZA_EMOCJA = 2;

static bool bazaAktywna = false;           // komenda a/s z portu
static int emocja = -1;
static uint32_t tKoniecEmocji = 0, tOstSpocz = 0, tOstGrupa = 0, tMrug = 0;

static const Nastroj &nastroj() { return emocja >= 0 ? NASTROJE[emocja] : NASTROJE[bazaAktywna ? 1 : 0]; }

// ---------- efekty ----------

enum IdEfektu {
  E_BRAK = -1, E_FALA, E_TAM, E_ZEZ, E_ROZBIEGANE, E_MUCHA, E_BUNT, E_KLOTNIA, E_PIANINO, E_PACYNKA,
  E_BU, E_ZDZIWIENIE, E_PRZEWRACANIE, E_ZASYPIANIE, E_BUDZENIE, E_HIPNOZA, E_SZEF,
  E_TAK, E_NIE, E_NIEWIEM, E_MRUG, E_REFLEKS, E_BABAJAGA, E_AWARIA, E_ILE
};

struct OpisEfektu { const char *nazwa; bool bezpieczny; };
static const OpisEfektu EFEKTY[E_ILE] = {
  {"fala", true}, {"tam", true}, {"zez", true}, {"rozbiegane", false}, {"mucha", true}, {"buntownik", true},
  {"klotnia", true}, {"pianino", true}, {"pacynka", false}, {"bu", true}, {"zdziwienie", true},
  {"przewracanie", true}, {"zasypianie", false}, {"budzenie", true}, {"hipnoza", false}, {"szef", true},
  {"tak", true}, {"nie", true}, {"niewiem", true}, {"mrug", true}, {"refleks", true}, {"babajaga", false},
  {"awaria", false},
};

static struct Ef {
  int id = E_BRAK;
  uint8_t faza = 0;
  int w = 0;
  float k = 0;
  uint32_t t0 = 0, tFazy = 0, tMax = 0, tNast = 0;
  int a = -1, b = -1;
  float f = 0, fCel = 0, fV = 0, kier = 1;
  int licznik = 0;
  bool pokaz = false;
} ef;

static uint32_t tOstEfektu = 0, tBuKoniec = 0, tOstReczny = 0, tHbObsl = 0;
static int ostBunt = -1;
static bool buntJawny = false;
static uint32_t tOtwarcia = 0;
static int rekordRefleks = 0;
static bool trollOn = false;

// uczestnicy efektu: aktywne małe oczy + gałka dużego oka (azymut AZYMUT_DO), posortowane po azymucie
static int uczN = 0, ucz[NAPEDOW], ord[NAPEDOW];
static float uczAz[NAPEDOW];

static float sgn(float v) { return v > 0 ? 1 : (v < 0 ? -1 : 0); }
static float ogr(float v, float lo, float hi) { return v < lo ? lo : (v > hi ? hi : v); }
static bool jestDuze() { return aktywny(N_GALKA); }
static bool jestPowieki() { return aktywny(N_POW_G) || aktywny(N_POW_D); }
static bool powWolne() { return wolny(N_POW_G) && wolny(N_POW_D); }

static float doKierunku(float az, float phi) {
  float r = phi - az;
  while (r > 180) r -= 360;
  while (r < -180) r += 360;
  return ogr(r, -ZAKRES_MALE, ZAKRES_MALE);
}

static void zbierz() {
  uczN = 0;
  for (int i = 0; i < ust.n; i++) if (aktywny(i)) { ucz[uczN] = i; uczAz[uczN] = ust.azymut[i]; uczN++; }
  if (jestDuze()) { ucz[uczN] = N_GALKA; uczAz[uczN] = AZYMUT_DO; uczN++; }
  for (int r = 1; r < uczN; r++)                               // sortowanie po azymucie
    for (int q = r; q > 0 && uczAz[q] < uczAz[q - 1]; q--) {
      int ti = ucz[q]; ucz[q] = ucz[q - 1]; ucz[q - 1] = ti;
      float ta = uczAz[q]; uczAz[q] = uczAz[q - 1]; uczAz[q - 1] = ta;
    }
}

void przeliczKolejnosc() { zbierz(); }

// ord[] = indeksy uczestników posortowane rosnąco według klucza
static float kOdl(float az, float a) { return fabsf(az - a); }
static float kZewn(float az, float) { return -fabsf(az); }
static float kAz(float az, float) { return az; }
static float kLos(float, float) { return random(1000); }
static void uloz(float (*f)(float, float), float arg) {
  float key[NAPEDOW];
  for (int r = 0; r < uczN; r++) { ord[r] = r; key[r] = f(uczAz[r], arg); }
  for (int r = 1; r < uczN; r++)
    for (int q = r; q > 0 && key[ord[q]] < key[ord[q - 1]]; q--) { int t = ord[q]; ord[q] = ord[q - 1]; ord[q - 1] = t; }
}

static int ileMalych() { int m = 0; for (int r = 0; r < uczN; r++) if (ucz[r] != N_GALKA) m++; return m; }

static bool maleWolne() {
  for (int i = 0; i < ust.n; i++) if (!wolny(i)) return false;
  return true;
}

static bool ktosCzeka() {
  for (int i = 0; i < NAPEDOW; i++) if (nap[i].uzywany && nap[i].czeka) return true;
  return false;
}

static void gal(float psi, float th, float tempo, bool przelot = false) {
  if (!jestDuze()) return;
  Naped &n = nap[N_GALKA];
  ruch(N_GALKA, psi, th, czasSakady(N_GALKA, psi - n.ost[0], th - n.ost[1], tempo), przelot);
}

static void powR(float g, float d, uint32_t ms) {     // powieki: górna g, dolna d (% rozwarcia)
  if (aktywny(N_POW_G)) ruch(N_POW_G, g, 0, ms);
  if (aktywny(N_POW_D)) ruch(N_POW_D, d, 0, ms);
}
static void powR(float r, uint32_t ms) { powR(r, r, ms); }
static void powSpocz(uint32_t ms) { powR(nastroj().rozG, nastroj().rozD, ms); }
static void powPostoj(uint32_t ms) { postoj(N_POW_G, ms); postoj(N_POW_D, ms); }
static void powCzekajDo(uint32_t t) { czekajDo(N_POW_G, t); czekajDo(N_POW_D, t); }

static void powNatychmiast(float r) { natychmiast(N_POW_G, r, 0, 0.5f); natychmiast(N_POW_D, r, 0, 0.5f); }

static float odwrocony(float az) { return fabsf(az) < 8 ? (random(2) ? 20 : -20) : sgn(az) * 20; }   // patrzy w bok, „nie patrzy”

// małe oczy kaskadą parami w kolejności ord[]: kąt z funkcji, potem postój i powrót na środek
static void kaskadaMalych(float (*kat)(float az, float arg), float arg, uint32_t poczatek, uint32_t odstepPary,
                          float tempo, bool drzyj, uint32_t trzymaj, float tempoPowrotu) {
  int p = 0;
  for (int r = 0; r < uczN; r++) {
    int n = ucz[ord[r]];
    if (n == N_GALKA) continue;
    postoj(n, poczatek + (p / 2) * odstepPary);
    ruchKat(n, kat(uczAz[ord[r]], arg), tempo);
    if (drzyj) drzenie(n);
    if (trzymaj) { postoj(n, trzymaj); ruchKat(n, 0, tempoPowrotu); }
    p++;
  }
}
static float katKierunek(float az, float phi) { return doKierunku(az, phi); }
static float katZero(float, float) { return 0; }
static float katZez(float az, float) { return fabsf(az) < 8 ? 0 : -sgn(az) * 22; }
static float katRozbiegane(float az, float) { return fabsf(az) < 8 ? (random(2) ? 25 : -25) : sgn(az) * 25; }

static void zakonczEfekt(bool wymus) {
  uint32_t t = millis();
  if (wymus) {
    wyczyscWszystko();
    for (int i = 0; i < NAPEDOW; i++)
      if (aktywny(i)) natychmiast(i, i == N_POW_G ? nastroj().rozG : (i == N_POW_D ? nastroj().rozD : 0), 0, 1.5f);
  }
  ef.id = E_BRAK;
  tryb = TR_AUTOMAT;
  for (int i = 0; i < NAPEDOW; i++) nap[i].tNastepny = t + random(1000, 3000);
  tMrug = t + 2000;
}

static bool uspiona() { return ef.id == E_ZASYPIANIE && ef.faza == 1; }

// ---------- początki efektów ----------

static void startFala(int w, uint32_t t0) {
  float A = (w == 1) ? -20 : 20;
  uint32_t dt = 140;
  int M = uczN;
  for (int r = 0; r < M; r++) {
    int idx = (A > 0) ? r : M - 1 - r;              // w prawo: od lewego oka do prawego
    int n = ucz[idx];
    postoj(n, r * dt);
    ruchKat(n, A, 1); postoj(n, 250); ruchKat(n, 0, 1);
    if (w == 2) {                                    // tam i z powrotem: druga fala w przeciwną stronę
      czekajDo(n, t0 + M * dt + 900 + (M - 1 - r) * dt);
      ruchKat(n, -A, 1); postoj(n, 250); ruchKat(n, 0, 1);
    }
  }
  ef.tMax = 15000;
}

static void startPrzewracanie() {
  if (jestDuze()) {
    powR(50, 80, 300);                               // górna przymknięta
    gal(-18, 2, 1.5f);
    ruch(N_GALKA, -13, 11, 260, true);
    ruch(N_GALKA, 0, 15, 260, true);
    ruch(N_GALKA, 13, 11, 260, true);
    ruch(N_GALKA, 18, 2, 260);
    postoj(N_GALKA, 300);
    gal(0, 0, 1.5f);
    powPostoj(1700);
    powR(35, 60, 600);                               // „westchnienie”
    powSpocz(500);
  } else {
    uloz(kAz, 0);
    for (int r = 0; r < uczN; r++) {
      int n = ucz[ord[r]];
      postoj(n, r * 100);
      ruchKat(n, 25, 3); postoj(n, 600); ruchKat(n, 0, 2.5f);
    }
  }
  ef.tMax = 10000;
}

static void startDrzenieMalych() {
  uloz(kAz, 0);
  for (int r = 0; r < uczN; r++) { int n = ucz[ord[r]]; if (n == N_GALKA) continue; postoj(n, r * 60); drzenie(n); }
}

static void startEfektu(int id, int w, float k) {
  uint32_t t = millis();
  bool spala = uspiona();                             // przed wyczyszczeniem stanu efektu
  wyczyscWszystko();
  ef = Ef();
  ef.id = id; ef.w = w; ef.k = k; ef.t0 = ef.tFazy = t; ef.tMax = 15000;
  tryb = (id == E_PIANINO || id == E_PACYNKA) ? TR_RECZNY : TR_EFEKT;
  if (tryb == TR_RECZNY) ef.tMax = 0;                // ręczne: tylko bezczynność i heartbeat
  emocja = -1;
  zbierz();

  switch (id) {
    case E_FALA: startFala(w, t); break;

    case E_TAM: {                                     // „Wszyscy tam!”: lider (duże oko), potem pary od najbliższych
      float phi = ogr(k, -180, 180);
      uloz(kOdl, phi);
      bool d = jestDuze();
      if (d) { gal(ogr(phi - AZYMUT_DO, -ZAKRES_DO_X, ZAKRES_DO_X), 0, 0.9f); postoj(N_GALKA, 3000); gal(0, 0, 1.5f); }
      powR(95, 200); powPostoj(3000); powSpocz(400);
      kaskadaMalych(katKierunek, phi, d ? 250 : 0, 120, 0.9f, false, 3000, 1.5f);
      ef.tMax = 10000;
      break;
    }

    case E_ZEZ: {
      uloz(kZewn, 0);
      int M = ileMalych();
      powR(100, 200);
      gal(0, 0, 1);
      int p = 0;
      for (int r = 0; r < uczN; r++) {
        int n = ucz[ord[r]];
        if (n == N_GALKA) continue;
        postoj(n, (p / 2) * 120);
        ruchKat(n, katZez(uczAz[ord[r]], 0), 1);
        czekajDo(n, t + 1800 + (M / 2) * 120);
        ruchKat(n, 0, 1.2f);
        p++;
      }
      powPostoj(2000); powSpocz(400);
      ef.tMax = 8000;
      break;
    }

    case E_ROZBIEGANE:
    case E_AWARIA:
      powR(100, 150);                                 // wytrzeszcz
      ef.tMax = ROZBIEGANE_MAX_MS;
      break;

    case E_MUCHA:
      ef.kier = random(2) ? 1 : -1;
      ef.f = -150 * ef.kier;                          // mucha nadlatuje zza dyni
      ef.fCel = random(-60, 61);
      ef.fV = 70;
      ef.licznik = 5;
      ef.tMax = 15000;
      break;

    case E_BUNT: {                                    // wszystkie w jedną stronę, jedno losowe w drugą
      int m = ileMalych();
      if (m < 2) break;
      float dir = random(2) ? 1 : -1;
      int nr = random(m), q = 0;
      for (int r = 0; r < uczN; r++) if (ucz[r] != N_GALKA && q++ == nr) ef.a = ucz[r];
      ef.kier = dir;
      ostBunt = ef.a; buntJawny = false;
      uloz(kOdl, dir * 100);
      int p = 0;
      for (int r = 0; r < uczN; r++) {
        int n = ucz[ord[r]];
        if (n == N_GALKA) { gal(dir * 20, 0, 1); continue; }
        postoj(n, (p / 2) * 120);
        ruchKat(n, (n == ef.a ? -dir : dir) * 20, 1);
        p++;
      }
      ef.tNast = t + 2500;
      ef.tMax = BUNT_MAX_MS + 6000;
      break;
    }

    case E_KLOTNIA: {                                 // para sąsiadów zerka ku sobie i obraża się
      int s[N_MALYCH_MAX], m = 0;
      for (int r = 0; r < uczN; r++) if (ucz[r] != N_GALKA) s[m++] = ucz[r];
      if (m < 2) break;
      int q = random(m - 1);
      int i = s[q], j = s[q + 1];                     // i po lewej, j po prawej
      for (int z = 0; z < 2; z++) {
        int n = z ? j : i;
        float d = z ? -1 : 1;                         // ku sąsiadowi
        if (z) postoj(n, 150);
        ruchKat(n, 22 * d, 1); postoj(n, 700);
        ruchKat(n, 12 * d, 1); postoj(n, 200);
        ruchKat(n, 22 * d, 1); postoj(n, 600);
        ruchKat(n, -25 * d, 0.8f); postoj(n, 2000);   // obrażone
        ruchKat(n, 0, 2);
      }
      float azPary = (ust.azymut[i] + ust.azymut[j]) / 2;
      if (jestDuze()) { czekajDo(N_GALKA, t + 2600); gal(ogr(azPary, -ZAKRES_DO_X, ZAKRES_DO_X), 0, 1); postoj(N_GALKA, 1500); gal(0, 0, 1.5f); }
      if (jestPowieki()) { powCzekajDo(t + 3000); powR(0, 110); powSpocz(200); }   // duże oko przyłapuje
      ef.tMax = 10000;
      break;
    }

    case E_PIANINO:
    case E_PACYNKA:
      tOstReczny = t;
      break;

    case E_BU:
      if (w == 0 && !spala) {                     // dynia udaje uśpioną: powieki w dół, małe odwrócone
        powR(0, 800);
        gal(0, -8, 2);
        for (int r = 0; r < uczN; r++) if (ucz[r] != N_GALKA) ruchKat(ucz[r], odwrocony(uczAz[r]), 2);
        ef.faza = 0;
      } else ef.faza = 1;
      ef.tMax = 15000;
      break;

    case E_ZDZIWIENIE: {                              // zerknięcie, odwrócenie, szybki powrót wzroku
      bool d = jestDuze();
      if (d) {
        gal(-20, 0, 0.8f); gal(12, 0, 0.9f); gal(0, 0, 1);
        powPostoj(900);
        powR(0, 110); powR(80, 200); powPostoj(120); powR(0, 110); powR(80, 200);
        powR(100, 200); powPostoj(1000); powSpocz(500);
      }
      uloz(kOdl, 0);
      int p = 0;
      for (int r = 0; r < uczN; r++) {
        int n = ucz[ord[r]];
        if (n == N_GALKA) continue;
        float przod = doKierunku(uczAz[ord[r]], 0);
        float obok = fabsf(przod) < 3 ? (random(2) ? 20 : -20) : przod - sgn(przod) * 20;
        postoj(n, (d ? 1300 : 0) + (p / 2) * 120);
        ruchKat(n, przod, 1.2f); postoj(n, 250);
        ruchKat(n, obok, 1); postoj(n, 200);
        ruchKat(n, przod, 0.7f);
        if (!d) drzenie(n);
        postoj(n, 1500); ruchKat(n, 0, 1.5f);
        p++;
      }
      ef.tMax = 12000;
      break;
    }

    case E_PRZEWRACANIE:
    case E_NIEWIEM:
      startPrzewracanie();
      break;

    case E_ZASYPIANIE: {                              // powieki opadają skokami, małe po kolei na środek
      {                                               // górna opada skokami, dolna podnosi się wolniej
        const float G[] = {45, 55, 25, 32, 8, 0}, D[] = {65, 70, 45, 50, 15, 0};
        const uint16_t MS[] = {600, 200, 700, 200, 800, 600}, PAUZA[] = {700, 400, 900, 600, 500, 0};
        for (int j = 0; j < 6; j++) {
          ruch(N_POW_G, G[j], 0, MS[j]); ruch(N_POW_D, D[j], 0, MS[j]);
          if (PAUZA[j]) powPostoj(PAUZA[j]);
        }
      }
      gal(0, -10, 3);
      uloz(kAz, 0);
      for (int r = 0; r < uczN; r++) { int n = ucz[ord[r]]; if (n == N_GALKA) continue; postoj(n, r * 600); ruchKat(n, 0, 2.5f); }
      ef.tMax = SEN_MAX_MS + 30000;
      break;
    }

    case E_BUDZENIE: {                                // „jeszcze 5 minut”: jedno oko zerka i zasypia, potem zryw
      int m = ileMalych();
      if (m > 0) {
        int nr = random(m), q = 0;
        for (int r = 0; r < uczN; r++) if (ucz[r] != N_GALKA && q++ == nr) ef.a = ucz[r];
        ruchKat(ef.a, random(2) ? 15 : -15, 2); postoj(ef.a, 800); ruchKat(ef.a, 0, 3);
      }
      powR(30, 500); powPostoj(800); powR(0, 700);
      ef.tMax = 15000;
      break;
    }

    case E_HIPNOZA:
      powR(75, 90, 300);
      uloz(kZewn, 0);
      kaskadaMalych(katZez, 0, 0, 150, 2.5f, false, 0, 1);
      if (jestDuze()) gal(18, 0, 1.5f);
      ef.tMax = HIPNOZA_MAX_MS + 5000;
      break;

    case E_SZEF:
      powR(0, 600);
      gal(0, 0, 1.5f);
      ef.tMax = 15000;
      break;

    case E_TAK:
      if (jestDuze()) {                               // kiwnięcie
        powR(90, 200);
        ruch(N_GALKA, 0, 10, 240, true); ruch(N_GALKA, 0, -8, 220, true);
        ruch(N_GALKA, 0, 10, 220, true); ruch(N_GALKA, 0, -8, 220, true); ruch(N_GALKA, 0, 0, 220);
        powPostoj(1300); powSpocz(400);
      } else {                                        // wszyscy patrzą na pytającego + drżenie
        uloz(kOdl, 0);
        kaskadaMalych(katKierunek, 0, 0, 100, 0.9f, true, 1500, 1.5f);
      }
      ef.tMax = 8000;
      break;

    case E_NIE:
      if (jestDuze()) {                               // kręcenie
        ruch(N_GALKA, 18, 0, 260, true); ruch(N_GALKA, -18, 0, 230, true);
        ruch(N_GALKA, 18, 0, 230, true); ruch(N_GALKA, -18, 0, 230, true); ruch(N_GALKA, 0, 0, 230);
      } else startFala(2, t);                         // fala w obie strony
      ef.tMax = 15000;
      break;

    case E_MRUG:
      if (jestPowieki()) mrugnij(1); else startDrzenieMalych();
      ef.tMax = 4000;
      break;

    case E_REFLEKS:
      powR(0, 500);
      gal(0, 0, 1.5f);
      for (int r = 0; r < uczN; r++) if (ucz[r] != N_GALKA) ruchKat(ucz[r], odwrocony(uczAz[r]), 2);
      tOtwarcia = 0;
      ef.tMax = 25000;
      break;

    case E_BABAJAGA:
      powR(0, 600);
      gal(0, 0, 1.5f);
      for (int r = 0; r < uczN; r++) if (ucz[r] != N_GALKA) ruchKat(ucz[r], 0, 2);
      ef.tMax = BABAJAGA_MAX_MS;
      break;
  }
}

static void patrze() {                                // Baba Jaga: gwałtowne (w limicie) spojrzenie w losową stronę
  float phi = random(-90, 91);
  wyczyscWszystko();
  if (jestPowieki()) { powNatychmiast(100); powPostoj(2000); powR(0, 400); }
  if (jestDuze()) { gal(random(-20, 21), random(-8, 9), 0.7f); postoj(N_GALKA, 2000); gal(0, 0, 1.5f); }
  uloz(kOdl, phi);
  kaskadaMalych(katKierunek, phi, 0, 60, 0.7f, false, 2000, 1.5f);
  ef.faza = 1;
}

// ---------- kroki efektów ----------

static void nerwowe(float amp, float tempo, bool zDuzym) {   // pojedyncze szybkie sakady w limicie serw
  if (ktosCzeka() || !budzetWolny(1)) return;
  int r = random(uczN);
  int n = ucz[r];
  if (!wolny(n)) return;
  if (n == N_GALKA) { if (zDuzym) gal(random(-12, 13), random(-8, 9), tempo); return; }
  ruchKat(n, ogr(nap[n].p[0] + random(-(int)amp, (int)amp + 1), -amp, amp), tempo);
}

static void krokEfektu(uint32_t t) {
  uint32_t dt = (int32_t)(t - ef.t0) > 0 ? t - ef.t0 : 0, dtF = (int32_t)(t - ef.tFazy) > 0 ? t - ef.tFazy : 0;   // t0 mogło przyjść z obsługi HTTP
  switch (ef.id) {
    case E_ROZBIEGANE:
    case E_AWARIA:
      if (ef.faza == 0) {
        nerwowe(12, 0.7f, true);
        if (dt > (uint32_t)(ef.id == E_AWARIA ? 3000 : 2500)) {      // rozbiegnięcie na boki
          wyczyscWszystko();
          uloz(kZewn, 0);
          kaskadaMalych(katRozbiegane, 0, 0, 60, 0.8f, false, 1200, 1.5f);
          if (jestDuze()) { gal(random(2) ? 22 : -22, 0, 0.8f); postoj(N_GALKA, 1200); gal(0, 0, 1.5f); }
          powPostoj(1500); powSpocz(400);
          ef.faza = 1;
        }
      } else if (wszystkieWolne()) zakonczEfekt(false);
      break;

    case E_MUCHA: {
      if (ef.faza == 1) { if (wszystkieWolne()) zakonczEfekt(false); break; }
      if ((int32_t)(t - ef.tNast) < 0) break;
      ef.tNast = t + 100;
      float krok = ef.fV * 0.1f;
      if (fabsf(ef.fCel - ef.f) <= krok) {
        ef.f = ef.fCel;
        if (fabsf(ef.f) >= 195) {                       // odleciała
          ef.faza = 1;
          for (int r = 0; r < uczN; r++) natychmiast(ucz[r], 0, 0, 1.5f);
          break;
        }
        if (--ef.licznik <= 0) ef.fCel = ef.f > 0 ? 200 : -200;
        else {
          float c;
          do c = random(-150, 151); while (fabsf(c - ef.f) < 60);
          ef.fCel = c; ef.fV = random(50, 91);
        }
      } else ef.f += sgn(ef.fCel - ef.f) * krok;
      for (int r = 0; r < uczN; r++) {
        int n = ucz[r];
        float rel = ef.f - uczAz[r];
        float cel = fabsf(rel) <= 70 ? ogr(rel, -ZAKRES_MALE, ZAKRES_MALE) : 0;
        float th = n == N_GALKA ? 8 * sinf(t / 300.0f) : 0;
        if (fabsf(cel - nap[n].ost[0]) > 2 || (n == N_GALKA && fabsf(th - nap[n].ost[1]) > 2)) natychmiast(n, cel, th, 1);
      }
      break;
    }

    case E_BUNT:
      if (ef.a < 0) { zakonczEfekt(false); break; }
      if (ef.faza == 0) {
        if ((int32_t)(t - ef.tNast) >= 0 && wolny(ef.a)) {        // buntownik łypie
          ruchKat(ef.a, -ef.kier * 8, 0.8f); postoj(ef.a, 250); ruchKat(ef.a, -ef.kier * 20, 0.8f);
          ef.tNast = t + random(1500, 2500);
        }
        if (ef.pokaz || dt > BUNT_MAX_MS) {                       // pokaż buntownika
          wyczysc(ef.a);
          for (int z = 0; z < 3; z++) { ruchKat(ef.a, ef.kier * 5, 0.8f); ruchKat(ef.a, -ef.kier * 20, 0.8f); }
          postoj(ef.a, 800); ruchKat(ef.a, 0, 1.5f);
          for (int r = 0; r < uczN; r++) {
            int n = ucz[r];
            if (n == ef.a) continue;
            postoj(n, 1500);
            if (n == N_GALKA) gal(0, 0, 1.5f); else ruchKat(n, 0, 1.5f);
          }
          buntJawny = true;
          ef.faza = 1;
        }
      } else if (wszystkieWolne()) zakonczEfekt(false);
      break;

    case E_BU:
      if (ef.faza == 0) {
        if (ef.tNast == 0 && wszystkieWolne()) ef.tNast = t + random(1500, 3001);
        if (ef.tNast && (int32_t)(t - ef.tNast) >= 0) ef.faza = 1;
      } else if (ef.faza == 1) {                                  // BU: powieki szeroko na wprost
        tBuKoniec = t;                                            // przerwa ochronna liczona od straszenia, nawet gdy coś przerwie efekt
        wyczyscWszystko();
        powNatychmiast(100);
        if (jestDuze()) natychmiast(N_GALKA, 0, 0, 0.6f);
        ef.tFazy = t; ef.faza = 2;
      } else if (ef.faza == 2) {
        bool d = jestDuze();
        if (dtF >= (uint32_t)(d ? 250 : 0)) {                     // po 0,25 s małe kaskadą na wprost
          uloz(kOdl, 0);
          kaskadaMalych(katKierunek, 0, 0, 80, 0.6f, !d, 2000, 1.5f);
          powPostoj(1500); powSpocz(500);
          postoj(N_GALKA, 2000);
          ef.faza = 3;
        }
      } else if (wszystkieWolne()) zakonczEfekt(false);
      break;

    case E_ZASYPIANIE:
      if (ef.faza == 0) { if (wszystkieWolne()) { ef.faza = 1; ef.tFazy = t; } }
      else if (dtF >= SEN_MAX_MS) startEfektu(E_BUDZENIE, 0, 0);  // śpi najwyżej 3 min
      break;

    case E_BUDZENIE:
      if (ef.faza == 0) { if (wszystkieWolne()) { ef.tNast = t + 1200; ef.faza = 1; } }
      else if (ef.faza == 1) {
        if ((int32_t)(t - ef.tNast) >= 0) {                       // zryw
          powNatychmiast(100); powPostoj(800); powSpocz(500);
          if (jestDuze()) { gal(random(-15, 16), random(-8, 9), 0.7f); postoj(N_GALKA, 600); gal(0, 0, 1.2f); }
          uloz(kLos, 0);
          int p = 0;
          for (int r = 0; r < uczN; r++) {
            int n = ucz[ord[r]];
            if (n == N_GALKA) continue;
            postoj(n, (p / 2) * 80);
            ruchKat(n, random(-20, 21), 0.7f); postoj(n, 500); ruchKat(n, 0, 1.2f);
            p++;
          }
          ef.faza = 2;
        }
      } else if (wszystkieWolne()) zakonczEfekt(false);
      break;

    case E_HIPNOZA:
      if (ef.faza == 0) {
        if (jestDuze()) {                                         // wolne koła dużego oka (przelot)
          while (nap[N_GALKA].qn < 4) {
            float a = (ef.licznik++) * 0.785398f;
            ruch(N_GALKA, 18 * cosf(a), 11 * sinf(a), 250, true);
          }
        } else if (maleWolne() && dt > 500) {                     // bez dużego oka: wolny zez ↔ rozbieżność
          uloz(kZewn, 0);
          kaskadaMalych((ef.licznik++ % 2) ? katZez : katRozbiegane, 0, 0, 150, 3, false, 0, 1);
          for (int i = 0; i < ust.n; i++) postoj(i, 600);
        }
        if (dt >= HIPNOZA_MAX_MS) {
          wyczyscWszystko();
          for (int r = 0; r < uczN; r++) natychmiast(ucz[r], 0, 0, 2);
          powSpocz(400);
          ef.faza = 1;
        }
      } else if (wszystkieWolne()) zakonczEfekt(false);
      break;

    case E_SZEF:
      if (ef.faza == 0) {
        nerwowe(25, 1.0f, false);                                 // małe rozrabiają
        if (dt > 4000) {
          wyczyscWszystko();
          if (jestDuze()) {                                       // szef otwiera oko groźnie i rozgląda się
            powNatychmiast(100); powR(60, 40, 300);       // groźne przymrużenie
            gal(-15, -3, 2); gal(15, -3, 2); gal(0, 0, 1.5f);
          }
          ef.tFazy = t; ef.faza = 1;
        }
      } else if (ef.faza == 1) {
        if (dtF >= (uint32_t)(jestDuze() ? 300 : 600)) {          // baczność: małe szybko na środek
          uloz(kOdl, 0);
          kaskadaMalych(katZero, 0, 0, 60, 0.7f, false, 0, 1);
          ef.tFazy = t; ef.faza = 2;
        }
      } else if (ef.faza == 2) {
        if (maleWolne() && dtF > 2500) { mrugnij(1); powSpocz(400); ef.faza = 3; }
      } else if (wszystkieWolne()) zakonczEfekt(false);
      break;

    case E_REFLEKS:
      if (ef.faza == 0) { if (wszystkieWolne()) { ef.tNast = t + random(2000, 8001); ef.faza = 1; } }
      else if (ef.faza == 1) {
        if ((int32_t)(t - ef.tNast) >= 0) {                       // otwarcie w losowej chwili
          powNatychmiast(100);
          uloz(kOdl, 0);
          kaskadaMalych(katKierunek, 0, 0, 60, 0.6f, false, 0, 1);
          ef.a = -1;                                              // sygnał gry: powieka w połowie albo oko prowadzące w połowie drogi
          for (int r = 0; r < uczN && ef.a < 0; r++) if (ucz[ord[r]] != N_GALKA) { ef.a = ucz[ord[r]]; ef.f = katKierunek(uczAz[ord[r]], 0); ef.fCel = nap[ef.a].p[0]; }
          tOtwarcia = 0; ef.tFazy = t; ef.faza = 2;
        }
      } else if (ef.faza == 2) {
        if (!tOtwarcia) {
          int pw = aktywny(N_POW_G) ? N_POW_G : (aktywny(N_POW_D) ? N_POW_D : -1);
          bool syg = pw >= 0 ? nap[pw].p[0] >= 50
                   : (ef.a < 0 || fabsf(nap[ef.a].p[0] - ef.fCel) >= 0.5f * fabsf(ef.f - ef.fCel));
          if (syg || dtF > 1500) tOtwarcia = t;
        } else if (t - tOtwarcia > 3000) {
          powSpocz(400);
          for (int r = 0; r < uczN; r++) { if (ucz[r] == N_GALKA) continue; ruchKat(ucz[r], 0, 1.5f); }
          ef.faza = 3;
        }
      } else if (wszystkieWolne()) zakonczEfekt(false);
      break;

    case E_BABAJAGA:
      if (ef.faza == 1 && wszystkieWolne()) ef.faza = 0;          // znowu „śpi”, czeka na „Patrzę!”
      break;

    case E_PIANINO:
    case E_PACYNKA:
      if (minelo(t, tOstReczny, RECZNY_BEZCZYNNOSC_MS)) zakonczEfekt(false);
      break;

    default:                                                      // efekty z samych kolejek
      if (dt > 300 && wszystkieWolne()) zakonczEfekt(false);
      break;
  }
  if (ef.id != E_BRAK && ef.tMax && minelo(t, ef.t0, ef.tMax)) zakonczEfekt(true);   // twardy limit czasu
}

// ---------- automat (oczy-ruch) ----------

static float losowyCel(int i, const Nastroj &n) {
  float z = n.zakres;
  float p = nap[i].p[0];
  if (n.skan) return -sgn(p == 0 ? (random(2) ? 1 : -1) : p) * random((int)(z / 2), (int)z + 1);
  if (random(100) < 25) return ogr(p + random(-6, 7), -z, z);       // mała poprawka
  return random(-(int)z, (int)z + 1);
}

static void krokAutomatu(uint32_t t) {
  if (emocja >= 0 && (int32_t)(t - tKoniecEmocji) >= 0) emocja = -1;
  const Nastroj &n = nastroj();

  if (n.grupa && ust.n > 1 && t - tOstGrupa > 8000 && random(1000) < 5) {   // wszystkie kolejno w tę samą stronę
    tOstGrupa = t;
    float kat = random(-(int)n.zakres, (int)n.zakres + 1);
    for (int i = 0; i < ust.n; i++) {
      if (!aktywny(i) || !wolny(i)) continue;
      float c = ogr(kat + random(-3, 4), -ZAKRES_MALE, ZAKRES_MALE);
      uint32_t ms = czasSakady(i, c - nap[i].p[0], 0, n.tempo);
      ruch(i, c, 0, ms);
      nap[i].tNastepny = t + ms + random(n.fiksMin, n.fiksMax);
    }
  }

  if (n.odstep == 0 || t - tOstSpocz >= n.odstep) {                 // małe oczy: sakada + fiksacja
    for (int k = 0; k < ust.n; k++) {
      if (ktosCzeka() || !budzetWolny(1)) break;
      int i = random(ust.n);                                        // losowa kolejność, nie 0→N
      if (!aktywny(i) || !wolny(i) || (int32_t)(t - nap[i].tNastepny) < 0) continue;
      float c = losowyCel(i, n);
      uint32_t ms = czasSakady(i, c - nap[i].p[0], 0, n.tempo);
      ruch(i, c, 0, ms);
      nap[i].tNastepny = t + ms + random(n.fiksMin, n.fiksMax);
      if (n.odstep) { tOstSpocz = t; break; }                       // spoczynek: najwyżej jedno oko na odstęp
    }
  }

  if (jestDuze() && wolny(N_GALKA) && (int32_t)(t - nap[N_GALKA].tNastepny) >= 0 && !ktosCzeka() && budzetWolny(2)) {
    Naped &g = nap[N_GALKA];
    float z = min((float)n.zakres, ZAKRES_DO_X), zy = min((float)n.zakres * 0.6f, ZAKRES_DO_Y);
    float psi, th;
    if (n.skan) { psi = -sgn(g.p[0] == 0 ? 1 : g.p[0]) * random((int)(z / 2), (int)z + 1); th = random(-3, 4); }
    else if (random(100) < 25) { psi = ogr(g.p[0] + random(-5, 6), -z, z); th = ogr(g.p[1] + random(-3, 4), -zy, zy); }
    else { psi = random(-(int)z, (int)z + 1); th = random(-(int)zy, (int)zy + 1); }
    uint32_t ms = czasSakady(N_GALKA, psi - g.p[0], th - g.p[1], n.tempo);
    if (fabsf(psi - g.p[0]) > 15 && random(100) < 60 && powWolne()) { mrugnij(1); tMrug = t + random(n.mrugMin, n.mrugMax); }
    ruch(N_GALKA, psi, th, ms);
    g.tNastepny = t + ms + random(n.fiksMin * 7 / 10, n.fiksMax * 7 / 10);
  }

  if (jestPowieki() && powWolne()) {
    if ((int32_t)(t - tMrug) >= 0) { mrugnij(1); tMrug = t + random(n.mrugMin, n.mrugMax); }
    else {
      if (aktywny(N_POW_G) && fabsf(nap[N_POW_G].ost[0] - n.rozG) > 1) ruch(N_POW_G, n.rozG, 0, 500);
      if (aktywny(N_POW_D) && fabsf(nap[N_POW_D].ost[0] - n.rozD) > 1) ruch(N_POW_D, n.rozD, 0, 500);
    }
  }
}

// ---------- interfejs ----------

void efektyStart() {
  zbierz();
  tMrug = millis() + 3000;
}

void krokEfektow(uint32_t t) {
  // heartbeat: cisza ze strony przez HEARTBEAT_MS → płynny powrót do automatu
  if (tryb != TR_AUTOMAT && tryb != TR_PARK && tryb != TR_ROZRUCH &&
      minelo(t, tOstZapytania, HEARTBEAT_MS) && tHbObsl != tOstZapytania) {   // ze znakiem: czas zapytania bywa nowszy niż t
    tHbObsl = tOstZapytania;
    wybudzOdHeartbeat(t);
  }
  switch (tryb) {
    case TR_ROZRUCH: if (wszystkieWolne()) { tryb = TR_AUTOMAT; zakonczEfekt(false); } break;
    case TR_AUTOMAT: krokAutomatu(t); break;
    case TR_EFEKT:
    case TR_RECZNY: krokEfektu(t); break;
    default: break;
  }
}

void wybudzOdHeartbeat(uint32_t) {
  if (uspiona()) { startEfektu(E_BUDZENIE, 0, 0); return; }
  if (tryb == TR_EFEKT || tryb == TR_RECZNY) zakonczEfekt(true);
  else if (tryb == TR_KALIBRACJA) { tryb = TR_AUTOMAT; zakonczEfekt(true); }
}

void doAutomatu() {
  if (tryb == TR_PARK) { wznowPoParkowaniu(); tryb = TR_AUTOMAT; zakonczEfekt(false); return; }
  if (tryb == TR_ROZRUCH) return;
  zakonczEfekt(tryb != TR_AUTOMAT);
}

void ustawAktywny(bool a) { bazaAktywna = a; }

void ustawTryb(Tryb tr) {                             // serwis: kalibracja, park (bez efektu i emocji)
  ef = Ef();
  emocja = -1;
  tryb = tr;
}

static int znajdzEfekt(const String &nazwa) {
  for (int i = 0; i < E_ILE; i++) if (nazwa == EFEKTY[i].nazwa) return i;
  return E_BRAK;
}

int uruchomEfekt(const String &nazwaIn, int w, float k, bool rodzic, String &odp) {
  uint32_t t = millis();
  String nazwa = nazwaIn;
  if (tryb == TR_PARK) { odp = "zaparkowana"; return 409; }
  if (tryb == TR_ROZRUCH) { odp = "rozruch, chwileczkę"; return 409; }
  if (tryb == TR_KALIBRACJA && !rodzic) { odp = "trwa kalibracja"; return 409; }
  if (nazwa == "automat") { doAutomatu(); return 200; }
  if (nazwa == "pokaz") {                                    // buntownik: pokaż, które
    if (ef.id == E_BUNT) ef.pokaz = true; else buntJawny = true;
    return 200;
  }
  if (nazwa == "patrze") {
    if (ef.id == E_BABAJAGA) {
      if (ef.faza == 1) { odp = "jeszcze patrzy"; return 429; }
      patrze(); return 200;
    }
    nazwa = "babajaga";
  }
  if (nazwa == "lewo") { nazwa = "tam"; k = -90; }
  else if (nazwa == "prawo") { nazwa = "tam"; k = 90; }
  else if (nazwa == "wprost") { nazwa = "tam"; k = 0; }
  int id = znajdzEfekt(nazwa);
  if (id == E_BRAK) { odp = "nieznany efekt"; return 404; }
  if (ust.wystawa && !EFEKTY[id].bezpieczny && !rodzic) { odp = "niedostępne w trybie wystawowym"; return 403; }
  if (id == E_BU) {
    if (ef.id == E_BU) { odp = "już straszy"; return 429; }
    if (tBuKoniec && t - tBuKoniec < BU_PRZERWA_MS) {
      odp = String("dynia łapie oddech, ") + ((BU_PRZERWA_MS - (t - tBuKoniec)) / 1000 + 1) + " s";
      return 429;
    }
  }
  if (!rodzic && tOstEfektu && t - tOstEfektu < EFEKT_ODSTEP_MS) { odp = "chwileczkę"; return 429; }
  zbierz();
  if ((id == E_KLOTNIA || id == E_BUNT) && ileMalych() < 2) { odp = "za mało oczu"; return 409; }
  startEfektu(id, w, k);
  tOstEfektu = t;
  return 200;
}

int ustawEmocje(const String &nazwa, bool rodzic, String &odp) {
  if (tryb == TR_PARK || tryb == TR_ROZRUCH || tryb == TR_KALIBRACJA) { odp = "dynia zajęta"; return 409; }
  if (nazwa == "brak") { emocja = -1; return 200; }
  for (int i = PIERWSZA_EMOCJA; i < N_NASTROJOW; i++) {
    if (nazwa != NASTROJE[i].nazwa) continue;
    if (ust.wystawa && !NASTROJE[i].bezpieczny && !rodzic) { odp = "niedostępne w trybie wystawowym"; return 403; }
    if (tryb != TR_AUTOMAT) zakonczEfekt(false);
    emocja = i;
    uint32_t t = millis();
    tKoniecEmocji = t + EMOCJA_MS;
    for (int j = 0; j < NAPEDOW; j++) nap[j].tNastepny = t + random(0, 800);
    tOstSpocz = 0;
    return 200;
  }
  odp = "nieznana emocja";
  return 404;
}

void pad(float x, float y) {
  if (tryb == TR_PARK || tryb == TR_ROZRUCH || tryb == TR_KALIBRACJA) return;
  if (ef.id != E_PACYNKA) startEfektu(E_PACYNKA, 0, 0);
  tOstReczny = millis();
  x = ogr(x, -1, 1); y = ogr(y, -1, 1);
  if (trollOn) x = -x;                                       // tryb trolla: lewo ↔ prawo
  if (jestDuze()) {
    float psi = x * ZAKRES_DO_X, th = y * ZAKRES_DO_Y;
    Naped &g = nap[N_GALKA];
    if (fabsf(psi - g.ost[0]) > 1 || fabsf(th - g.ost[1]) > 1) natychmiast(N_GALKA, psi, th, 1);
    return;
  }
  float kat = x * ZAKRES_MALE;                               // bez dużego oka: lider i stado (od przodu na boki)
  uloz(kOdl, 0);
  for (int r = 0; r < uczN; r++) {
    int n = ucz[ord[r]];
    if (fabsf(kat - nap[n].ost[0]) > 3) natychmiast(n, kat, 0, 1);
  }
}

void klawisz(int nr, int kier) {
  if (tryb == TR_PARK || tryb == TR_ROZRUCH || tryb == TR_KALIBRACJA) return;
  if (!aktywny(nr < 0 ? N_GALKA : nr)) return;              // nie przerywaj efektu dla nieistniejącego oka
  if (ef.id != E_PIANINO) startEfektu(E_PIANINO, 0, 0);
  tOstReczny = millis();
  kier = kier < 0 ? -1 : 1;
  int n = nr < 0 ? N_GALKA : nr;
  if (trollOn) {                                             // tryb trolla: oko lustrzane i odwrócony kierunek
    kier = -kier;
    if (n != N_GALKA && n < ust.n) {
      float cel = -ust.azymut[n], best = 1e9;
      for (int i = 0; i < ust.n; i++) if (aktywny(i) && fabsf(ust.azymut[i] - cel) < best) { best = fabsf(ust.azymut[i] - cel); n = i; }
    }
  }
  if (!aktywny(n)) return;
  wyczysc(n);
  if (n == N_GALKA) { gal(kier * 20, 0, 0.8f); postoj(n, 150); gal(0, 0, 1.2f); }
  else { ruchKat(n, kier * 20, 0.8f); postoj(n, 150); ruchKat(n, 0, 1.2f); }
}

void ustawPowieki(float g, float d) {
  if (!jestPowieki() || tryb == TR_PARK || tryb == TR_ROZRUCH || tryb == TR_KALIBRACJA) return;
  if (ef.id != E_PACYNKA) startEfektu(E_PACYNKA, 0, 0);
  tOstReczny = millis();
  natychmiast(N_POW_G, g, 0, 1);
  natychmiast(N_POW_D, d, 0, 1);
}

void mrugnijZeStrony() {
  if (tryb == TR_PARK || tryb == TR_ROZRUCH || tryb == TR_KALIBRACJA) return;
  if (tryb == TR_RECZNY) {
    tOstReczny = millis();
    zbierz();
    if (jestPowieki()) mrugnij(1); else startDrzenieMalych();
  } else startEfektu(E_MRUG, 0, 0);
}

bool troll() { return trollOn; }
void ustawTroll(bool on) { trollOn = on; }

int raportRefleks(int ms) {
  if (ms >= 80 && ms < 5000 && (rekordRefleks == 0 || ms < rekordRefleks)) rekordRefleks = ms;
  return rekordRefleks;
}

const char *nazwaTrybu() {
  switch (tryb) {
    case TR_ROZRUCH: return "rozruch";
    case TR_AUTOMAT: return "automat";
    case TR_EFEKT: return uspiona() ? "sen" : "efekt";
    case TR_RECZNY: return "reczny";
    case TR_KALIBRACJA: return "kalibracja";
    case TR_PARK: return zaparkowana() ? "zaparkowana" : "parkowanie";
  }
  return "?";
}

const char *nazwaEfektu() { return ef.id == E_BRAK ? "" : EFEKTY[ef.id].nazwa; }
const char *nazwaEmocji() { return emocja >= 0 ? NASTROJE[emocja].nazwa : ""; }

void jsonEfektu(String &s) {
  uint32_t t = millis();
  s += ",\"bunt\":"; s += ostBunt;
  s += ",\"buntJawny\":"; s += buntJawny ? "true" : "false";
  s += ",\"buZa\":";
  s += (tBuKoniec && t - tBuKoniec < BU_PRZERWA_MS) ? (int)((BU_PRZERWA_MS - (t - tBuKoniec)) / 1000 + 1) : 0;
  s += ",\"emocjaZa\":";
  s += emocja >= 0 ? (int)((tKoniecEmocji - t) / 1000) : 0;
  s += ",\"refleks\":{\"faza\":";
  s += ef.id == E_REFLEKS ? ef.faza : -1;
  s += ",\"za\":";
  s += (ef.id == E_REFLEKS && ef.faza == 1) ? (int32_t)(ef.tNast - t) + (jestPowieki() ? 120 : 200) : -1;   // + oczekiwane opóźnienie sygnału
  s += ",\"od\":";
  s += (ef.id == E_REFLEKS && ef.faza >= 2 && tOtwarcia) ? (int32_t)(t - tOtwarcia) : -1;
  s += ",\"rekord\":"; s += rekordRefleks;
  s += "}";
  s += ",\"babaPatrzy\":"; s += (ef.id == E_BABAJAGA && ef.faza == 1) ? "true" : "false";
}

void jsonListyEfektow(String &s, bool) {
  s += "\"efekty\":[";
  for (int i = 0; i < E_ILE; i++) {
    if (i) s += ",";
    s += "{\"n\":\""; s += EFEKTY[i].nazwa; s += "\",\"b\":"; s += EFEKTY[i].bezpieczny ? 1 : 0; s += "}";
  }
  s += "],\"emocje\":[";
  for (int i = PIERWSZA_EMOCJA; i < N_NASTROJOW; i++) {
    if (i > PIERWSZA_EMOCJA) s += ",";
    s += "{\"n\":\""; s += NASTROJE[i].nazwa; s += "\",\"b\":"; s += NASTROJE[i].bezpieczny ? 1 : 0; s += "}";
  }
  s += "]";
}
