// Kalibracja kanałów dyni. Źródło: 50-elektronika/kalibracja-oczu.md (program kalibracja/, komenda t).
// Impulsy w µs przy PCA9685 27 MHz, 50 Hz, prescale 131 – tak samo jak w kalibracja/.
// Po zmianie wartości w kalibracja-oczu.md przepisz je tutaj i wgraj program ponownie.
#pragma once
#include <stdint.h>

struct Kal { uint8_t ch; int16_t mn, sr, mx; };       // kanał, impuls min, środek, max
struct KalPow { uint8_t ch; int16_t zamk, otw; };      // powieka: impuls zamknięta, otwarta

// Małe oczy: kanały 0–3 strona lewa, 4–7 strona prawa (patrząc od przodu). Test 25.10: wspólne wartości.
const Kal MALE[8] = {
  {0, 1100, 1500, 1800}, {1, 1100, 1500, 1800}, {2, 1100, 1500, 1800}, {3, 1100, 1500, 1800},
  {4, 1100, 1500, 1800}, {5, 1100, 1500, 1800}, {6, 1100, 1500, 1800}, {7, 1100, 1500, 1800},
};

// Duże oko, kanały 12–15 (PRD: 12 = lewo–prawo, 13 = góra–dół, 14 powieka górna, 15 powieka dolna).
// Gałka (28.10, test-galka/, kalibracja-oczu.md „Duże oko”): orczyki nasadzone przy 1500 µs; zakresy sprawdzone tylko
// na krótszej stronie kinematyki v3 (L–P ±284, G–D ±239 µs), dlatego symetrycznie. Dłuższe strony (+88 / +57 µs) niesprawdzone.
constexpr bool GALKA_GOTOWA = true;
const Kal GALKA_X = {12, 1216, 1500, 1784};   // lewo–prawo
const Kal GALKA_Y = {13, 1261, 1500, 1739};   // góra–dół

// Sprzężenie osi (duze-oko-v3-montaz.md §4): ruch L–P ściąga gałkę w pionie; przy L–P ±35° serwo G–D musi dodać +4,4°
// (ok. 49 µs), rośnie z kwadratem wychylenia. Program dodaje do impulsu G–D: SPRZ × (wychylenie L–P / zakres)².
// Osobno dla strony min i max L–P, bo kinematyka jest niesymetryczna. Znak i wielkość: na sprzęcie, komendy g i z.
const int16_t SPRZ_GY_PRZY_X_MIN = 0;   // µs impulsu G–D przy L–P = GALKA_X.mn
const int16_t SPRZ_GY_PRZY_X_MAX = 0;   // µs impulsu G–D przy L–P = GALKA_X.mx

// Powieki: NIESKALIBROWANE – dopóki POWIEKI_GOTOWE = false, kanały 14–15 nie dostają impulsu.
constexpr bool POWIEKI_GOTOWE = false;
const KalPow POW_G = {14, 1500, 1500};        // powieka górna: zamknięta, otwarta (do kalibracji)
const KalPow POW_D = {15, 1500, 1500};        // powieka dolna: zamknięta, otwarta (do kalibracji)
