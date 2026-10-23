// Wspólne stałe, typy i deklaracje firmware dyni (dynia.ino, ruch.cpp, efekty.cpp, serwer.cpp).
// Stałe z sekcji „DO USTAWIENIA” są wartościami domyślnymi; część z nich zmienia panel rodzica (NVS).
#pragma once
#include <Arduino.h>
#include <Preferences.h>

#define WERSJA_FW "E7.2d (23.10)"

// ===== DO USTAWIENIA =====
constexpr int PIN_SDA = 8, PIN_SCL = 9;
constexpr int N_MALYCH = 1;               // NA CZAS PRÓB: jedno oko na kanale 0; zwiększ w panelu rodzica, gdy przybędzie oczu (NVS, po restarcie)
constexpr int N_MALYCH_MAX = 16;          // bez dużego oka 0..15; z dużym okiem ucinane do 12 (kanały 0..11)
constexpr bool DUZE_OKO = false;          // domyślnie; panel rodzica zmienia flagę w NVS, działa po restarcie
// Duże oko: 4 × MG90S (decyzja 22.10, koncepcja v3.1 pkt 14), każda powieka niezależnie
constexpr int KANAL_DO_X = 12;            // lewo–prawo (ψ)
constexpr int KANAL_DO_Y = 13;            // góra–dół (θ)
constexpr int KANAL_POW_G = 14;           // powieka górna
constexpr int KANAL_POW_D = 15;           // powieka dolna
constexpr int MAX_W_RUCHU = 4;            // domyślny wspólny limit serw w ruchu (panel rodzica, od razu; z dużym okiem ≥ 2)
constexpr const char *AP_SSID = "Dynia";
constexpr const char *AP_HASLO = "dynia2026";
constexpr int AP_KANAL = 1, AP_MAX_KLIENTOW = 4;
constexpr const char *PIN_RODZICA = "2610";   // ZMIEŃ przed wystawą (README); strona go nie zna
constexpr bool CAPTIVE_PORTAL = true;     // true = iPhone sam otwiera okno z naszą stroną; false = odpowiedź „Success”
constexpr int PARK_POWIEKI = 100;         // rozwarcie powiek przy „Parkuj” (100 = otwarte, nic nie przytnie palca)
constexpr bool PARK_BEZ_PWM = true;       // po zaparkowaniu zdejmij impulsy (decyzja z zestawienia 23.10, pkt 6.4)

constexpr int POW_ZAMK_US = 1350, POW_OTW_US = 1650;   // powieki przed kalibracją: wąsko (±150 µs), kalibracja ustawia pełny zakres
constexpr uint32_t I2C_HZ = 100000;       // jak w szkicach testowych

// ===== Ruch =====
constexpr float US_NA_STOPIEN = 2000.0f / 180.0f;
constexpr float ZAKRES_MALE = 25;         // ±25° serwa = ±278 µs
constexpr float ZAKRES_DO_X = 25, ZAKRES_DO_Y = 15;
constexpr float AZYMUT_DO = 0;            // duże oko na środku frontu (decyzja 22.10)
constexpr float V_MAX_OKO = 200;          // °/s – twardy szczyt profilu oka (liczony dokładnie, bez tolerancji)
constexpr float V_MAX_POW_US = 3500;      // µs/s – szczyt profilu powieki, niezależnie od jej kalibracji (ok. 315°/s)
constexpr int US_MIN_ABS = 900, US_MAX_ABS = 2100;   // granica bezpieczeństwa impulsu każdego kanału (niezależna od kalibracji)
constexpr int US_KROK_MAX = 80;           // twardy limit zmiany impulsu na krok ≥ 20 ms (ok. 360°/s)
constexpr int US_KROK_WOLNO = 4;          // rozruch i kalibracja: 4 µs na krok = 200 µs/s (ok. 18°/s)
constexpr uint32_t KROK_MS = 20;          // 50 Hz aktualizacji (osobne zadanie FreeRTOS)
constexpr uint32_t ODSTEP_STARTOW_MS = 40;   // rozsunięte starty serw (szczyt prądu)
constexpr uint32_t ROZRUCH_KANAL_MS = 150;   // rozruch: pierwszy impuls co 150 ms na kanał
constexpr uint32_t ZAPIS_PONOWNY_MS = 2000;  // NVS: zapis położenia najwyżej co 2 s na napęd
constexpr uint32_t ZAPIS_ODSTEP_MS = 500;    // NVS: najwyżej jeden zapis położenia na 0,5 s w całej dyni
constexpr int NVS_WERSJA = 2;                // 2 = kanały dużego oka 12–15, osobne napędy powiek
constexpr int KRANIEC_DOM_US = 278;          // domyślny kraniec małego oka: środek ± 278 µs (±25°)
constexpr int KRANIEC_MIN_US = 30, KRANIEC_MAX_US = 700;   // odległość krańca od środka
constexpr int NOWE_SERWO_US = 1500;          // „Nowe serwo”: impuls od razu (jedyny dopuszczony skok, serwo bez dźwigienki)

// ===== Strona i bezpieczeństwo =====
constexpr uint32_t HEARTBEAT_MS = 20000;          // cisza ze strony → powrót do automatu
constexpr uint32_t RECZNY_BEZCZYNNOSC_MS = 15000; // pad / pianino bez polecenia → automat
constexpr uint32_t EFEKT_ODSTEP_MS = 1200;        // najmniejszy odstęp między startami efektów (antyspam)
constexpr uint32_t BU_PRZERWA_MS = 10000;         // przerwa ochronna „Bu!” (od chwili straszenia)
constexpr uint32_t ROZBIEGANE_MAX_MS = 7000;
constexpr uint32_t HIPNOZA_MAX_MS = 20000;
constexpr uint32_t SEN_MAX_MS = 180000;           // dynia śpi najwyżej 3 min, potem budzi się sama
constexpr uint32_t BABAJAGA_MAX_MS = 180000;
constexpr uint32_t BUNT_MAX_MS = 15000;
constexpr uint32_t EMOCJA_MS = 45000;             // emocja trwa 45 s albo do zmiany
constexpr uint32_t PIN_BLOKADA_MS = 60000;        // po 5 błędnych PIN-ach
constexpr uint32_t SESJA_RODZICA_MS = 1800000;    // 30 min bez zapytań rodzica → wylogowanie
constexpr uint32_t RESTART_PARK_MS = 5000;        // restart z panelu: najpierw parkowanie (najwyżej 5 s)

// ===== Napędy =====
// Napęd = jedna logiczna oś ruchu: małe oko (stopnie), gałka dużego oka (ψ, θ w stopniach, 2 serwa),
// powieka górna albo dolna (rozwarcie 0–100 %, 1 serwo). Koszt napędu = liczba serw w limicie MAX_W_RUCHU.
enum TypNapedu : uint8_t { T_MALE, T_GALKA, T_POWIEKI };
enum TypKroku : uint8_t { K_RUCH, K_CZEKAJ, K_CZEKAJ_DO };

constexpr int N_GALKA = N_MALYCH_MAX;         // indeks napędu gałki
constexpr int N_POW_G = N_MALYCH_MAX + 1;     // powieka górna
constexpr int N_POW_D = N_MALYCH_MAX + 2;     // powieka dolna
constexpr int NAPEDOW = N_MALYCH_MAX + 3;
constexpr int KOLEJKA = 12;

struct Krok {
  TypKroku typ;
  bool przelot;          // ruch bez zatrzymania na końcu (łuki, kiwanie); styczna z następnego kroku
  float c[2];
  uint32_t ms;           // czas ruchu albo postoju; dla K_CZEKAJ_DO – czas bezwzględny
};

struct Naped {
  TypNapedu typ = T_MALE;
  uint8_t koszt = 1;
  int8_t para = -1;                          // napęd startujący razem (powieki przy mrugnięciu)
  bool uzywany = false, wylaczony = false, doWylaczenia = false;
  float p[2] = {0, 0};                       // bieżące położenie (z profilu)
  float s[2], c[2], m0[2], m1[2];            // profil Hermite'a: start, cel, styczne (smoothstep, gdy styczne = 0)
  uint32_t tStart = 0, czas = 1;
  bool wRuchu = false;                       // do końca profilu ORAZ dojścia impulsów wszystkich kanałów
  bool czeka = false;                        // ruch czeka na miejsce w limicie serw
  float cc[2]; uint32_t czasC = 0, seq = 0; bool przelotC = false;
  Krok q[KOLEJKA]; uint8_t qh = 0, qn = 0;   // kolejka kroków efektu
  uint32_t tCzekajDo = 0;
  float ost[2] = {0, 0};                     // ostatni zadany cel (po całej kolejce)
  float vK[2] = {0, 0}; uint32_t tKonca = 0; // prędkość na końcu ostatniego odcinka (przelot)
  uint32_t tNastepny = 0;                    // automat: koniec fiksacji
  uint32_t tZapisu = 0; bool doZapisu = false;
};

struct Kanal {
  int8_t naped = -1;       // -1 = kanał nieużywany
  uint8_t os = 0;          // gałka: 0 = X (ψ), 1 = Y (θ)
  int16_t a = 1500, b = 1500;   // kalibracja: oczy a = środek; powieka a = zamknięta, b = otwarta
  int16_t kl = 1222, kp = 1778; // małe oko: impuls krańca lewego (−25°) i prawego (+25°), patrząc na dynię od przodu
  int16_t usRecz = -1;     // kalibracja: impuls ustawiony ręcznie strzałkami (−1 = brak, wyjście idzie za ruchem napędu)
  int8_t znak = 1;         // kierunek serwa (+1 / −1); małe oko: kierunek wynika z krańców
  int16_t usWy = -1;       // ostatnio wysłany impuls; -1 = bez impulsu
  int16_t usZap = -1;      // impuls zapisany w NVS
  bool pwm = false, wolno = false;
};

struct Ustawienia {
  int n = N_MALYCH;
  int maxWRuchu = MAX_W_RUCHU;
  bool duze = DUZE_OKO;
  bool wystawa = false;
  float azymut[N_MALYCH_MAX];
};

enum Tryb : uint8_t { TR_ROZRUCH, TR_AUTOMAT, TR_EFEKT, TR_RECZNY, TR_KALIBRACJA, TR_PARK };

extern Naped nap[NAPEDOW];
extern Kanal kan[16];
extern Ustawienia ust;
extern Tryb tryb;
extern uint32_t licznikRuchow, zapisyNvs, odrzuconeKroki;
extern uint32_t tOstZapytania;

// Blokada stanu ruchu: zadanie ruchu (co 20 ms) i obsługa HTTP / portu działają w osobnych zadaniach.
void zablokuj();
void odblokuj();
struct Blokada { Blokada() { zablokuj(); } ~Blokada() { odblokuj(); } };
inline bool minelo(uint32_t t, uint32_t od, uint32_t ms) { return (int32_t)(t - od) > (int32_t)ms; }   // odporne na „przyszłe” od

// ruch.cpp
void ruchStart();                           // PCA9685, kalibracje i pozycje z NVS, rozruch bez skoku
void krokRuchu(uint32_t t);
void ruch(int n, float c0, float c1, uint32_t ms, bool przelot = false);
void ruchKat(int n, float kat, float tempo, bool przelot = false);   // małe oko albo gałka (ψ)
void postoj(int n, uint32_t ms);
void czekajDo(int n, uint32_t t);
void natychmiast(int n, float c0, float c1, float tempo);           // „ostatni wygrywa”
void wyczysc(int n);
void wyczyscWszystko();
bool wolny(int n);
bool wszystkieWolne();
int wRuchuSerw();
int najwiekszyKoszt();
bool budzetWolny(int koszt);
uint32_t czasSakady(int n, float d0, float d1, float tempo);
bool aktywny(int n);                       // napęd używany i nie wyłączony
void mrugnij(int ile = 1);
void drzenie(int n);
void parkuj();
void wznowPoParkowaniu();
bool zaparkowana();
void zapiszPozycjeTeraz();                 // przed restartem: wszystkie położenia do NVS bez limitu
void ustawWylaczenie(int n, bool wyl);
const char *kalibrujUstaw(int ch, char param, int wartosc);   // 'a' środek / zamknięta, 'b' otwarta, 'l'/'r' krańce, 'z' kierunek; nullptr = OK
void kalibrujWybierz(int ch, char param);              // trzymaj napęd w położeniu kalibracji
const char *kalibrujStrzalka(int ch, int dUs);         // ręczny impuls: + = w prawo (patrząc na dynię), − = w lewo
const char *kalibrujOznacz(int ch, char param);        // bieżący impuls ręczny staje się środkiem / krańcem
const char *kalibrujNoweSerwo(int ch);                 // od razu NOWE_SERWO_US i kalibracja domyślna
const char *kalibrujImpuls(int ch, int dUs);           // kreator: ◀ = mniej µs, ▶ = więcej µs
const char *kreatorKrok(int ch, char krok, int lewa, int &us);   // 's' środek, '1'/'2' krańce, 'p' pokaż kraniec 1, 'k' kierunek
void kalibrujTest(int ch);                             // wolno: środek → lewy → prawy → środek
void zapiszKalibracje();
void zapiszUstawienia();                   // tylko ustawienia działające od razu (max, wystawa)
int usKanalu(int ch);
float katPrzezPolozenie(int n, int os);
void wypiszKanaly();

// efekty.cpp
void efektyStart();
void krokEfektow(uint32_t t);
int uruchomEfekt(const String &nazwa, int w, float k, bool rodzic, String &odp);
int ustawEmocje(const String &nazwa, bool rodzic, String &odp);
void pad(float x, float y);
void klawisz(int nr, int kier);
void ustawPowieki(float g, float d);
void mrugnijZeStrony();
void doAutomatu();
void wybudzOdHeartbeat(uint32_t t);
void ustawAktywny(bool a);
void ustawTryb(Tryb t);
const char *nazwaTrybu();
const char *nazwaEfektu();
const char *nazwaEmocji();
void jsonEfektu(String &s);                // dodatkowe pola efektu do /api/stan
void jsonListyEfektow(String &s, bool rodzic);
bool troll();
void ustawTroll(bool on);
int raportRefleks(int ms);
void przeliczKolejnosc();

// serwer.cpp
void serwerStart();
void krokSerwera(uint32_t t);

// dynia.ino
extern Preferences nvs;                    // przestrzeń „dynia”: ustawienia, kalibracja, dziennik
void zapiszDziennik();
void zerujDziennik();
String tekstDziennika();
const char *przyczynaStartu();
uint32_t czasPracy();
extern uint32_t startyLicznik;
