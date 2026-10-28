# dynia-v2 – program docelowy dyni, etap 1

Zakres (PM 27.10, słowa użytkownika: „minimum to 8 oczu małych, ruch oczu, PIR i przycisk. Bez strony w telefonie”):

- **Spoczynek:** duże oko zamknięte, co 4–6 s rusza się jedno małe oko (spokojnie, ±60 % zakresu).
- **Aktywny (PIR):** małe oczy rozglądają się, najwyżej 2 naraz, fiksacje 0,4–1,8 s; duże oko otwiera się i rozgląda (cel w elipsie zakresów, bez rogów). 30 s bez ruchu = spoczynek. Pierwsze 60 s po starcie PIR jest ignorowany.
- **Blokada:** przycisk przytrzymany 5 s – wszystkie oczy na środek (małe po 2 naraz), powieki otwarte, ruch stop; ponowne 5 s = praca. Po włączeniu prądu zawsze praca.
- **Ruch płynny** (smoothstep), najwyżej 80 µs zmiany impulsu na 20 ms. Po dojściu do celu impuls kanału wyłączany po 0,4 s (serwo nie buczy).
- **Start bez skoku:** pozycja każdego kanału w NVS (`dyniav2`, klucze `p<kanał>`), zapis po końcu ruchu, najwyżej co 2 s na kanał i 0,5 s ogólnie. Po starcie: wszystkie kanały bez impulsu → kanał po kanale impuls z NVS co 150 ms → wolny dojazd na środek (1,5 s, po 2 oczy) → powieki zamknięte. Brak wpisu albo wartość spoza [min, max] = start od środka (skok jednego serwa).
- **Podtrzymanie powerbanku:** ukryty punkt dostępu Wi-Fi `dynia` włączony stale, bez strony i serwera.

Poza zakresem: strona w telefonie, efekty, nastroje, mruganie.

## Kalibracja

Wartości w `kalibracja.h`, przepisane z `../kalibracja-oczu.md`.

- **Gałka dużego oka włączona** (`GALKA_GOTOWA = true`): kanał 12 = lewo–prawo 1500 ±284 µs, 13 = góra–dół 1500 ±239 µs (sprawdzona krótsza strona kinematyki, 28.10). Na stole L–P był na kanale 11, a G–D na 12 – przed testem przełożyć: G–D na 13, L–P na 12.
- **Powieki wyłączone** (`POWIEKI_GOTOWE = false`): kanały 14–15 bez impulsu. Po kalibracji wpisz impulsy „zamknięta” i „otwarta” i ustaw `true`.
- **Sprzężenie osi** (`SPRZ_GY_PRZY_X_MIN`, `SPRZ_GY_PRZY_X_MAX`): ruch L–P ściąga gałkę w pionie; program dodaje do impulsu G–D poprawkę rosnącą z kwadratem wychylenia L–P, osobno dla obu stron. Kinematyka: ok. 49 µs przy L–P 35°. Znak nieznany, w kodzie 0.

### Ustalenie sprzężenia na sprzęcie

1. Monitor (115200), komendy z Enter. `g 0 0` – gałka na środek (dynia przechodzi w blokadę).
2. `g -100 0` – gałka w bok na stronę min L–P. Patrz, czy gałka uciekła w górę albo w dół względem `g 0 0`.
3. `z -50 0`, potem `z 50 0` (pierwsza liczba = strona min) – zostaw ten znak, przy którym gałka przy `g -100 0` patrzy poziomo; dobierz wielkość co 10 µs.
4. To samo dla strony max: `g 100 0`, `z <min> -50` / `z <min> 50`.
5. Wartości z `?` (linia „sprzężenie G–D”) wpisz do `kalibracja.h` i wgraj program. `z` działa tylko do restartu.

## Połączenia

`../polaczenia.md`, sekcja „Dynia: połączenia docelowe”: PIR na GPIO10, przycisk na GPIO7, masa przycisku GPIO5 (wyjście LOW), I²C GPIO8/9.

## Kompilacja i wgranie

```bash
arduino-cli compile -b esp32:esp32:esp32c3:CDCOnBoot=cdc 50-elektronika/dynia-v2
arduino-cli upload -p /dev/ttyACM0 -b esp32:esp32:esp32c3:CDCOnBoot=cdc 50-elektronika/dynia-v2
```

Port szeregowy 115200, komenda + Enter: `a` tryb aktywny, `s` spoczynek, `b` blokada wł./wył., `?` stan kanałów, `g <x> <y>` gałka w punkt (−100…100 % zakresu, przechodzi w blokadę), `z <min> <max>` sprzężenie osi w µs do restartu.

## Do sprawdzenia na stole (użytkownik)

1. Start z 8 oczami: brak szarpnięcia przy drugim i kolejnych startach (pierwszy start bez wpisów NVS może skoczyć).
2. Spoczynek: jedno oko co ok. 5 s.
3. PIR: po 60 s od startu machnięcie ręką → oczy się rozglądają, najwyżej 2 naraz; po 30 s spokoju powrót.
4. Przycisk 5 s → oczy na środek i stop; znowu 5 s → praca.
5. Powerbank Baseus ≥ 30 min w trybie aktywnym (`a` co jakiś czas albo ruch przed PIR) bez odcięcia.
6. Gałka: w trybie aktywnym rozgląda się (elipsa, bez rogów), w spoczynku i blokadzie na środku; sprzężenie według „Ustalenie sprzężenia”. Czy gałka bez impulsu trzyma pozycję.
7. Po kalibracji powiek: otwieranie, rozglądanie, zamykanie; czy powieki bez impulsu trzymają pozycję (jeśli opadają, wyłączyć ciszę dla kanałów 14–15).
