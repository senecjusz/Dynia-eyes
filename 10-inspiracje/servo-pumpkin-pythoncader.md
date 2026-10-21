# ServoPumpkin – pythoncader (dynia z 8 oczami na PCA9685)

- **Kod:** [ServoPumpkin](https://github.com/pythoncader/ServoPumpkin) (CC0) i rozszerzenie z rutynami [Arduino-Servo-Class](https://github.com/pythoncader/Arduino-Servo-Class) (MIT). Kopie: `servo-pumpkin-pythoncader/`.
- **Opis:** [Instructables „Animatronic Pumpkin”](https://www.instructables.com/Animatronic-Pumpkin), film budowy w README repozytorium.
- **Sprzęt:** Arduino + PCA9685 (adres 0x40), 8 serw na kanałach 0–7. Ten sam układ co u nas (ESP32-C3 + PCA9685).

## Jak działa ruch (analiza kodu)

**ServoPumpkin.ino (wersja pierwsza):**
- Każde oko ma ręcznie wpisany zakres kątów (`minN`/`maxN`, np. 35–82°), żeby serwo nie uderzało w ogranicznik.
- `loop()` przechodzi po kolei przez 8 kanałów: każdemu losuje kąt z jego zakresu, ustawia go **od razu** (`setPWM`, bez rozpędzania) i czeka losowo 0–300 ms przed następnym okiem.
- Efekt: oczy przeskakują jedno po drugim z maksymalną prędkością serwa, w stałej kolejności 0→7, bez przerw na „patrzenie”. Wszystkie 8 serw jest w ruchu w każdej sekundzie.
- PWM 60 Hz i mapowanie 0–180° na 125–575 tików (ok. 0,5–2,3 ms) – bez kalibracji środka.

**Arduino-Servo-Class.ino (rutyny):**
- `glide_angle` – płynny ruch krokami co 1° z `delay` między krokami (stała prędkość, bez przyspieszania i hamowania).
- Rutyny dla całej dyni: `random_eyes` (jak wyżej, przez zadany czas), `min_max` / `min_max_glide` (wszystkie oczy skrajnie w jedną, potem w drugą stronę), `half_half`, `columns`, `rows`, `lookdirections` (grupy oczu patrzą razem w jedną stronę), `ladders`, `vibrate`.
- Wszystko **blokujące** (`delay`): w czasie ruchu jednego oka program nie robi nic innego, nie czyta czujnika, a grupowe „płynne” ruchy wykonują się oko po oku.

## Co bierzemy

- Zakres i środek **osobno dla każdego oka** (kalibracja – u nas przez stronę w telefonie).
- Pomysł rutyn grupowych: „wszystkie patrzą w tę samą stronę”, „połowa w lewo, połowa w prawo” – dobrze wyglądają przy wielu oczach.
- Losowe przerwy między ruchami.

## Co robimy inaczej

- **Bez blokowania:** każde oko ma własny stan i czas (`millis()`), program w każdej chwili czyta czujnik zbliżenia i przełącza tryb.
- **Ruch jak oko, nie jak wskaźnik:** szybki ruch (sakada) z przyspieszeniem i hamowaniem, potem fiksacja 0,6–3 s; czasem drobne poprawki o kilka stopni.
- **Limit jednoczesnych ruchów** (u nas 2 małe oczy naraz) – mniejsze szczyty prądu z powerbanku; u pythoncadera ruszają się wszystkie.
- Tryby: spoczynek (co ok. 5 s jedno oko) i aktywny (ktoś bliżej niż ok. 1 m: więcej ruchu, czasem wszystkie oczy patrzą w tę samą stronę).
- Zakres pracy ±30° wokół skalibrowanego środka (ograniczniki mechaniczne ±33°).

Nasz program: `50-elektronika/oczy-ruch/oczy-ruch.ino`.
