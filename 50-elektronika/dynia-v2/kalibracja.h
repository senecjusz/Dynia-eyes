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

// Duże oko, kanały 12–15. NIESKALIBROWANE: dopóki DUZE_OKO_GOTOWE = false, kanały 12–15 nie dostają impulsu.
// Po kalibracji (kalibracja/, k 12..15) wpisz wartości i ustaw true.
constexpr bool DUZE_OKO_GOTOWE = false;
const Kal GALKA_X = {12, 1300, 1500, 1700};   // lewo–prawo (założenie ±200 µs, do kalibracji)
const Kal GALKA_Y = {13, 1350, 1500, 1650};   // góra–dół (założenie ±150 µs, do kalibracji)
const KalPow POW_G = {14, 1500, 1500};        // powieka górna: zamknięta, otwarta (do kalibracji)
const KalPow POW_D = {15, 1500, 1500};        // powieka dolna: zamknięta, otwarta (do kalibracji)
