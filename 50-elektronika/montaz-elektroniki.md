# Montaż elektroniki dyni – instrukcja krok po kroku

Stan 28.10. Pinout i rysunki: `polaczenia.md`, sekcja „Dynia: połączenia docelowe”. Program: `dynia-v2/`. Tacka: wydrukowana tacka v2 (bez przedruku; użytkownik 28.10).

Wymiary wtyków i listew to wartości typowe (obudowa Dupont 14 mm, plastik listwy pinów 2,5 mm). Przed klejeniem ESP sprawdź jedną wtyczką (krok 2).

Obrazki wygenerowano z modelu `montaz-elektroniki/elementy.scad` (tacka z commita 8a07059; render: `montaz-elektroniki/render.py`; schematy lutowania 07d i 07e: `montaz-elektroniki/schematy.py`), wymiary kupnych części są typowe; kontrola kolizji (`eksport.sh`): wtyki, ESP, kondensator, przycisk i PCA bez kolizji z tacką, przewody i elementy poniżej spodu płyty, kolizja tylko rezystora z tylnym pasem.

![Całość na tacce](montaz-elektroniki/img/krok00-calosc.png)

## 1. Co przygotować

| Co | Ile | Uwagi |
|---|---|---|
| Żeńskie końce Dupont | 17 + zapas | z przeciętych kabli Dupont męsko-żeńskich 20 cm (żeńska połówka + lut + koszulka): 8 na piny ESP, 9 na pozostałe końce (tabela przewodów) |
| Wtyczki odcięte od serw | 12 | 8 SG90 + 4 MG90S, ok. 5 cm przewodu przy wtyczce; po stronie PCA na skrętki (rozdział 5) |
| Kabel DFRobot (Dupont 3-pin + wtyczka czujnika) | 1 | do PIR: wtyczka czujnika odcięta |
| Przewód jednożyłowy/linka ok. 0,2–0,35 mm² | ok. 3 m | kolory: czerwony 5 V, czarny masa, inne sygnały |
| Koszulka termokurczliwa | ok. 70 kawałków | luty: wtyczki serw na skrętkach, serwa na krótkich skrętkach, żeńskie połówki, przycisk |
| Wtyk RJ45 do zaciśnięcia | 3 + zapas | zaciskarka |
| Keystone RJ45 | 3 | narzędzie LSA, jeśli keystone nie jest beznarzędziowy |
| Skrętka | 3 długie odcinki ok. 450 mm + 3 krótkie (długość z dyni) | długość długich: niżej |
| Kondensator 470 µF / 10 V | 1 | z zestawu |
| 2 podkładki pod ESP, 7 mm | 2 | `40-cad/3mf/Podstawka v2/Tacka - podkladki ESP (2 szt).3mf` (montaż, commit 8a07059 na `wykonawca-montaz`); fartuch od strony środka płytki |
| Opaski ≤ 4 mm | 7 | uchwyty na tacce |
| Wkręty M3 × 8 | 4 | PCA na słupkach (otwór 2,6 – wkręt wkręca się w plastik) |

## 2. Przewody na tacce (policzone z modelu tacki, z zapasem)

| # | Skąd | Dokąd | Kolor | Długość | Końcówki |
|---|---|---|---|---|---|
| 1 | gniazdo USB-C czerwony | zacisk V+ | czerwony | przewód gniazda; ≥ 130 mm, krótszy – przedłużyć lutem | goła końcówka pod śrubę |
| 2 | gniazdo USB-C czarny | zacisk GND | czarny | jw. | jw. |
| 3 | ESP 5V | kanał 9 V+ | czerwony | 130 | Dupont / Dupont |
| 4 | ESP G | kanał 9 GND | czarny | 130 | Dupont / Dupont |
| 5 | ESP 3V3 | lewa listwa VCC | dowolny | 110 | Dupont / Dupont |
| 6 | ESP 8 | lewa listwa SDA | dowolny | 110 | Dupont / Dupont |
| 7 | ESP 9 | lewa listwa SCL | dowolny | 110 | Dupont / Dupont |
| 8 | PIR VCC | kanał 10 V+ | czerwony | 400, przyciąć na miejscu | kabel DFRobot na PIR (środkowy przewód = OUT – sprawdź) / lut + żeńska połówka |
| 9 | PIR GND | kanał 10 GND | czarny | 400, przyciąć | kabel DFRobot na PIR (środkowy przewód = OUT – sprawdź) / lut + żeńska połówka |
| 10 | PIR OUT | ESP 10 | żółty | 450, przyciąć | kabel DFRobot na PIR (środkowy przewód = OUT – sprawdź) / lut + żeńska połówka |
| 11 | przycisk (obie nóżki) | ESP piny 5–6–7, rząd prawy (od PCA), pozycje 1–3 od USB | gotowy przewód użytkownika | min. ok. 200 (trasa w modelu ok. 185) – sprawdź, czy sięga | przylutowany / wtyczka 3-pin na skrajnych pozycjach, środek pusty; strona wtyczki obojętna |
| 13 | ESP 3 | – (zapas) | dowolny | 200 | Dupont / koniec zaizolowany |
| 14 | ESP 4 | – (zapas) | dowolny | 200 | Dupont / koniec zaizolowany |

PIR: od płytki w szufladce przez korpus do uchwytu opaski na tacce (przedni prawy róg), z pętlą zapasu ok. 150 mm zwiniętą w pasie wtyku USB-C w korpusie.

## 3. Wysokości (policzone, sufit = spód płyty 40 mm nad dnem kasety)

| Element | Wysokość | Wniosek |
|---|---|---|
| ESP: wtyk pod pinem (2,5 + 14) + zgięcie przewodu ok. 6 | potrzeba ok. 23 | słupki mają 16 → podkładki ok. 7 mm, spód ESP 23, wierzch ok. 29 |
| PCA: wierzch płytki 9 + plastik 2,5 + wtyk 14 + zgięcie 6 | ok. 31,5 | 8,5 mm zapasu do płyty |
| Kondensator stojący na wtyku kanału 8 | ok. 39,5 | **kłaść poziomo** do przodu, w wolne 25 mm przed PCA |
| Rezystor 47 Ω / 3 W | – | tylny słupek 1,5 mm od tylnego pasa – sposób montażu ustala montaż z użytkownikiem; potrzebny tylko, gdy powerbank gaśnie |

![Wysokości całości, widok od przodu w przekroju](montaz-elektroniki/img/krok08-wysokosci.png)

## 4. Kolejność na tacce (test po każdym kroku)

1. **PCA:** przykręć 4 wkrętami M3 × 8, listwa kanałów do przodu, zacisk do tyłu.

   ![PCA na słupkach](montaz-elektroniki/img/krok01-pca.png)
2. **ESP – wtyki przed klejeniem:** nałóż 8 pojedynczych wtyków (5V, G, 3V3, 4, 8, 9, 10, 3) i wtyczkę przycisku 3-pin na piny 5–6–7 (przycisk z przewodem wisi luzem do kroku 6) (piny z rysunku w `polaczenia.md`; napisy na płytce mają pierwszeństwo). Opisz końce taśmą. Zmierz od spodu płytki do miejsca, gdzie przewód da się zgiąć – to wysokość podkładek + 16. Podkładki przyklej na słupki, ESP na podkładki, USB do przodu.

   Piny ESP – widok z góry: układ scalony do góry, USB do przodu tacki (do Ciebie, na dole). Pozycja liczona od USB. Wtyk = Dupont żeński na pinie:

   | Poz. od USB | Rząd LEWY (od ściany tacki) | wtyk → dokąd | Rząd PRAWY (od PCA) | wtyk → dokąd |
   |---|---|---|---|---|
   | 1 | 5V | **tak** → kanał 9 V+ | 5 | **wtyczka przycisku** (masa przycisku – program ustawia LOW) |
   | 2 | G | **tak** → kanał 9 GND | 6 | środek wtyczki przycisku – pusty |
   | 3 | 3V3 | **tak** → lewa listwa VCC | 7 | **wtyczka przycisku** (odczyt) |
   | 4 | 4 | **tak** – zapas, koniec zaizolowany | 8 | **tak** → lewa listwa SDA |
   | 5 | 3 | **tak** – zapas, koniec zaizolowany | 9 | **tak** → lewa listwa SCL |
   | 6 | 2 | – | 10 | **tak** → PIR OUT |
   | 7 | 1 | – | 20 | – |
   | 8 | 0 | – | 21 | – |

   Układ według pinoutu ESP32-C3 SuperMini (Random Nerd Tutorials; tam płytka pokazana od spodu, USB u góry) i obserwacji użytkownika 28.10 (USB do siebie, 5V, G, 3V3 po lewej). Napisy na płytce mają pierwszeństwo. Wtyki zabezpiecz klejem na gorąco dopiero po testach (krok 9): kropla łączy obudowy w rzędzie z plastikiem listwy, nie na elementy płytki i nie na gniazdo USB.

   ![ESP: wtyki, podkładki, ESP na słupkach](montaz-elektroniki/img/krok02-esp.png)

   ![Piny ESP, widok z góry, USB do Ciebie: dokąd idzie każdy pin](montaz-elektroniki/img/krok02a-esp-piny.png)

   ![Wysokości przy ESP](montaz-elektroniki/img/krok02b-esp-wysokosci.png)
3. **Zasilanie:** gniazdo USB-C w ściankę (nakrętka od tyłu), przewody 1–2 przez uchwyt opaski do zacisku (V+ i GND według napisu przy zacisku). **Test:** powerbank, miernik na pinach V+/GND kanału 9: ok. 5 V.

   ![Zasilanie: gniazdo USB-C do zacisku](montaz-elektroniki/img/krok03-zasilanie.png)
4. **ESP do PCA:** przewody 3–4 (kanał 9), 5–7 (lewa listwa). **Program:** wyjmij przewód 3 (5V) z kanału 9, podłącz ESP do komputera, wgraj `dynia-v2`, w monitorze `?` → „PCA OK”. Odłącz komputer, przewód 3 z powrotem.

   ![ESP do PCA](montaz-elektroniki/img/krok04-esp-pca.png)

   ![Lewa listwa PCA: VCC, SDA, SCL](montaz-elektroniki/img/krok04b-lewa-listwa.png)

   ![Kanał 9: 5V i G z ESP](montaz-elektroniki/img/krok04c-kanal9.png)
5. **Kondensator:** nóżki skrócone i zagięte, wtyki na kanał 8: pasek (−) na GND (rząd przy krawędzi płytki), druga na V+. Korpus leży poziomo do przodu; przewody 5V i G do kanału 9 poprowadź obok korpusu, nie przez niego (w modelu trasa ociera o kondensator).

   ![Kondensator na kanale 8](montaz-elektroniki/img/krok05-kondensator.png)
6. **PIR i przycisk:** przewody 8–10; przycisk (wtyczka już na ESP od kroku 2) wklejasz w otwór w prawej ściance, przewód wzdłuż lewej ściany tacki do tyłu. **Test:** komputer jak w kroku 4 albo powerbank + komputer bez przewodu 3; `?` pokazuje PIR (po 60 s od startu) i przycisk (1 przy wciśnięciu).

   ![PIR i przycisk](montaz-elektroniki/img/krok06-pir-przycisk.png)

   ![Kanał 10: PIR VCC / GND](montaz-elektroniki/img/krok06b-kanal10-przycisk.png)
7. **Skrętki** (rozdział 5), po jednej: lewa → test oczu 0–3, prawa → 4–7, duże oko → 12–15 + ustalenie sprzężenia (`dynia-v2/README.md`).

   ![Skrętki do oczu](montaz-elektroniki/img/krok07-skretki.png)

   ![Skrętki na listwie kanałów](montaz-elektroniki/img/krok07b-skretki-listwa.png)
8. **Powerbank 30 min** w trybie aktywnym. Gaśnie → rezystor.

   ![Rezystor: przekrój na wysokości nóżek](montaz-elektroniki/img/krok09-rezystor.png)

   ![Rezystor: koniec nóżki za tylną ścianką](montaz-elektroniki/img/krok09b-rezystor-z-tylu.png)
9. **Opaski** na uchwytach, klej na gorąco na wtyki dopiero po wszystkich testach.

## 5. Skrętki (3 sztuki: lewa n = 0, prawa n = 4, duże oko n = 12)

Sposób użytkownika (28.10): wtyczki odcięte od serw idą na skrętki po stronie PCA, a serwa lutuje się wprost do krótkiego odcinka skrętki – bez listew goldpin i bez osobnych końcówek Dupont. Wtyczka serwa (brązowy, czerwony, pomarańczowy = GND, V+, sygnał) pasuje kolejnością do listwy kanału PCA (od krawędzi: GND, V+, sygnał). Wtyk RJ45 się zaciska, keystone zarabia (LSA). Wszystko T568B.

Wtyczkę odcinasz ok. 5 cm od obudowy (przewody przy wtyczce do lutowania), resztę przewodu zostawiasz przy serwie. Serwo po odcięciu działa tylko przez skrętkę – odcinaj po kalibracji.

**Długi odcinek (tacka → keystone w dyni), ok. 450 mm:** od listwy PCA po tacce do otworu Ø60 (ok. 90), do płyty i przez płytę (ok. 35), tuleja do dna wnętrza dyni (ok. 45), keystone 100–150 nad dnem, plus ok. 100 zapasu na zarabianie i wyjmowanie. Dokładnie: zmierz na złożonej podstawce i dyni.

1. Strona tacki: zdejmij płaszcz na ok. 80 mm. Do żył przylutuj 4 wtyczki odcięte od serw (każdy lut w koszulce), opisz wtyczki A–D:
   - wtyczka A: brązowy ← żyła 5, czerwony ← żyła 4, pomarańczowy ← żyła 1;
   - wtyczka B: pomarańczowy ← żyła 2; brązowy i czerwony obcięte i zaizolowane;
   - wtyczka C: brązowy ← żyła 8, czerwony ← żyła 7, pomarańczowy ← żyła 3;
   - wtyczka D: pomarańczowy ← żyła 6; brązowy i czerwony obcięte i zaizolowane.

   ![Strona tacki: żyły skrętki do wtyczek A–D](montaz-elektroniki/img/krok07d-lutowanie-wtyczek.png)
2. Wpięcie: A na kanał n, B na n+1, C na n+2, D na n+3 – brązowy przewód od krawędzi płytki (GND). Wynik jak w tabeli w `polaczenia.md`: żyły 1, 2, 3, 6 – sygnały n…n+3; 4 / 5 – V+ / GND kanału n; 7 / 8 – V+ / GND kanału n+2.

   ![Żyły lewej skrętki na kanałach 0–3](montaz-elektroniki/img/krok07c-zyly-kanaly0-3.png)
3. Drugi koniec: przez otwór w płycie i tuleję, keystone zarobić według oznaczeń „B” na keystonie.

**Krótki odcinek (keystone → oczy):** długość od keystone'a do grupy oczu na dyni + zapas; kable serw SG90 mają swoje ok. 250 mm.

1. Wtyk RJ45 zaciśnięty T568B.
2. Drugi koniec: serwa A, B, C, D lutowane wprost do żył (każdy lut w koszulce):
   - pomarańczowy: A ← żyła 1, B ← 2, C ← 3, D ← 6;
   - A i B: oba czerwone razem ← żyła 4, oba brązowe razem ← żyła 5;
   - C i D: oba czerwone ← żyła 7, oba brązowe ← żyła 8.
   - serwo opisz literą i numerem kanału.
3. **Test przed lutowaniem serw:** długi odcinek wpięty w PCA i w keystone, krótki z wtykiem w keystone, zasilanie włączone: miernik między żyłą 4 i 5 oraz 7 i 8 na wolnym końcu krótkiego odcinka – ok. 5 V. Dopiero potem lutujesz serwa.

   ![Krótki odcinek: serwa A–D lutowane do żył](montaz-elektroniki/img/krok07e-serwa-strona-oczu.png)

Duże oko: A = L–P (12), B = G–D (13), C = powieka górna (14), D = powieka dolna (15).
