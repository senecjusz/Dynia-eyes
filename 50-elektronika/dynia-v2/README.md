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

Wartości w `kalibracja.h`, przepisane z `../kalibracja-oczu.md`. **Duże oko jest wyłączone** (`DUZE_OKO_GOTOWE = false`), dopóki kanały 12–15 nie mają kalibracji: wtedy kanały 12–15 nie dostają żadnego impulsu. Po kalibracji (`kalibracja/`, `k 12` … `k 15`) wpisz środek, min i max gałki oraz impulsy „zamknięta” i „otwarta” obu powiek i ustaw `true`.

## Połączenia

`../polaczenia.md`, sekcja „Dynia: połączenia docelowe”: PIR na GPIO10, przycisk GPIO4–GND, I²C GPIO8/9.

## Kompilacja i wgranie

```bash
arduino-cli compile -b esp32:esp32:esp32c3:CDCOnBoot=cdc 50-elektronika/dynia-v2
arduino-cli upload -p /dev/ttyACM0 -b esp32:esp32:esp32c3:CDCOnBoot=cdc 50-elektronika/dynia-v2
```

Port szeregowy 115200: `a` tryb aktywny, `s` spoczynek, `b` blokada wł./wył., `?` stan kanałów.

## Do sprawdzenia na stole (użytkownik)

1. Start z 8 oczami: brak szarpnięcia przy drugim i kolejnych startach (pierwszy start bez wpisów NVS może skoczyć).
2. Spoczynek: jedno oko co ok. 5 s.
3. PIR: po 60 s od startu machnięcie ręką → oczy się rozglądają, najwyżej 2 naraz; po 30 s spokoju powrót.
4. Przycisk 5 s → oczy na środek i stop; znowu 5 s → praca.
5. Powerbank Baseus ≥ 30 min w trybie aktywnym (`a` co jakiś czas albo ruch przed PIR) bez odcięcia.
6. Po kalibracji dużego oka: otwieranie, rozglądanie, zamykanie; czy powieki bez impulsu trzymają pozycję (jeśli opadają, wyłączyć ciszę dla kanałów 14–15).
