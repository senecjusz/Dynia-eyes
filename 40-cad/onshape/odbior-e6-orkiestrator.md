# E6.2 – odbiór orkiestratora (niezależny K1–K4)

## Rama (baza), Gałka, Próbka P6 – 23.10, ok. 07:40

Dane: `40-cad/onshape/odbior-e6/features-rama-galka.json` (gałąź wykonawcy, commit 7923c8b; GET /features z encjami, 22 operacje, mv 0d2be676…), `znaczniki-rama-galka.json`, `variable-studio.json`. Skrypt: `40-cad/narzedzia/odbior_k1_k4.py`.

```
K1 featureStatus != OK: brak
K2 szkice w JSON: 6 | wiersze w drzewie: 6 | niedookreślone: brak
K3 wyrażenia ze stałymi spoza listy: 0
K4 Layout: przekrój: encji 14, więzów 42, FIX 0, encje bez więzów: brak
K4 Layout: czoło: encji 10, więzów 30, FIX 0, encje bez więzów: brak
K4 Rama: przekrój: encji 8, więzów 25, FIX 0, encje bez więzów: brak
K4 Rama: bok osi: encji 1, więzów 2, FIX 0, encje bez więzów: brak
K4 Rama: punkt otworu osi: encji 1, więzów 1, FIX 0, encje bez więzów: brak
K4 Gałka: przekrój: encji 5, więzów 17, FIX 0, encje bez więzów: brak
```

- K3: 65 wyrażeń, poza `#zmiennymi` tylko `90 deg` i `360 deg` (lista dozwolonych).
- K5: para boków osi ±x jako dwa Mirror (podkładka FEATURE, otwór FACE – Mirror FEATURE nie odbija Hole), zaakceptowane.
- Wymiary z odczytów wykonawcy (bodydetails, bbox) zgodne z planem. Kolejność Chamfer przed Mirror otworu – bez wpływu.
- K10: wyciągnięcie „Rama: bok osi” → „Rama: podkładka boku osi” (zgoda, przy następnej sekcji).
- **Wynik: Rama (baza), Gałka (baza) i Próbka P6 przyjęte.** Elementy zależne od B1/B2/B5 (ucha Ramy, wycięcia i nadlewy Gałki) – po koncepcji v3.1.

## Powieka górna i Powieka dolna (baza) – 23.10, ok. 07:55

Dane: `odbior-e6/features-powieki.json` (commit wykonawcy 20f638b; 46 operacji), `znaczniki-powieki.json`, `variable-studio.json` (189 zmiennych).

```
K1 featureStatus != OK: brak
K2 szkice w JSON: 13 | wiersze w drzewie: 13 | niedookreślone: brak
K3 wyrażenia ze stałymi spoza listy: 0
K4 Layout: przekrój: encji 14, więzów 42, FIX 0, encje bez więzów: brak
K4 Layout: czoło: encji 10, więzów 30, FIX 0, encje bez więzów: brak
K4 Rama: przekrój: encji 8, więzów 25, FIX 0, encje bez więzów: brak
K4 Rama: bok osi: encji 1, więzów 2, FIX 0, encje bez więzów: brak
K4 Rama: punkt otworu osi: encji 1, więzów 1, FIX 0, encje bez więzów: brak
K4 Gałka: przekrój: encji 5, więzów 17, FIX 0, encje bez więzów: brak
K4 Powieka górna: przekrój: encji 7, więzów 20, FIX 0, encje bez więzów: brak
K4 Powieka górna: mostek: encji 4, więzów 12, FIX 0, encje bez więzów: brak
K4 Powieka górna: ucho: encji 1, więzów 2, FIX 0, encje bez więzów: brak
K4 Powieka górna: punkt osi: encji 1, więzów 1, FIX 0, encje bez więzów: brak
K4 Powieka dolna: przekrój: encji 7, więzów 20, FIX 0, encje bez więzów: brak
K4 Powieka dolna: ucho: encji 1, więzów 2, FIX 0, encje bez więzów: brak
K4 Powieka dolna: punkt osi: encji 1, więzów 1, FIX 0, encje bez więzów: brak
```

- K3: liczby poza `#zmiennymi` tylko `90 deg`, `360 deg`; kąty mostka wymiarem `#mostekR1 * sin(#zamkG + #mostekKat)` (więz ANGLE przez API niedostępny) – zgodne z K3.
- K5: mostek i ucha G ±x – jeden Mirror; ucha D ±x – Mirror; otwór osi jednym Hole THROUGH przez oba ucha.
- Wymiary z odczytów wykonawcy zgodne z planem (`mostekR2` 8, luz do rury 0,63).
- **Wynik: Powieka górna i Powieka dolna (baza) przyjęte.** Wycięcie `wyciecieG`, zaczepy drutu i przycięcie kącików – po koncepcji v3.1.

## Słupek i Obejma – 23.10, ok. 08:10

Dane: `odbior-e6/features-slupek-obejma.json` (commit wykonawcy 8f30bca; 70 operacji), `znaczniki-wszystkie.json` (22 szkice), `variable-studio.json` (199).

```
K1 featureStatus != OK: brak
K2 szkice w JSON: 22 | wiersze w drzewie: 22 | niedookreślone: brak
K3 wyrażenia ze stałymi spoza listy: 0
K4 Layout: przekrój: encji 14, więzów 42, FIX 0, encje bez więzów: brak
K4 Layout: czoło: encji 10, więzów 30, FIX 0, encje bez więzów: brak
K4 Rama: przekrój: encji 8, więzów 25, FIX 0, encje bez więzów: brak
K4 Rama: bok osi: encji 1, więzów 2, FIX 0, encje bez więzów: brak
K4 Rama: punkt otworu osi: encji 1, więzów 1, FIX 0, encje bez więzów: brak
K4 Gałka: przekrój: encji 5, więzów 17, FIX 0, encje bez więzów: brak
K4 Powieka górna: przekrój: encji 7, więzów 20, FIX 0, encje bez więzów: brak
K4 Powieka górna: mostek: encji 4, więzów 12, FIX 0, encje bez więzów: brak
K4 Powieka górna: ucho: encji 1, więzów 2, FIX 0, encje bez więzów: brak
K4 Powieka górna: punkt osi: encji 1, więzów 1, FIX 0, encje bez więzów: brak
K4 Powieka dolna: przekrój: encji 7, więzów 20, FIX 0, encje bez więzów: brak
K4 Powieka dolna: ucho: encji 1, więzów 2, FIX 0, encje bez więzów: brak
K4 Powieka dolna: punkt osi: encji 1, więzów 1, FIX 0, encje bez więzów: brak
K4 Słupek: przekrój: encji 6, więzów 19, FIX 0, encje bez więzów: brak
K4 Słupek: punkt trzpienia: encji 1, więzów 1, FIX 0, encje bez więzów: brak
K4 Słupek: kanał nakrętki M5: encji 5, więzów 15, FIX 0, encje bez więzów: brak
K4 Słupek: punkt M4: encji 1, więzów 2, FIX 0, encje bez więzów: brak
K4 Obejma: przekrój: encji 6, więzów 18, FIX 0, encje bez więzów: brak
K4 Obejma: ucho: encji 4, więzów 12, FIX 0, encje bez więzów: brak
K4 Obejma: szczelina: encji 4, więzów 12, FIX 0, encje bez więzów: brak
K4 Obejma: punkt śruby: encji 1, więzów 2, FIX 0, encje bez więzów: brak
K4 Obejma: kieszeń nakrętki: encji 6, więzów 18, FIX 0, encje bez więzów: brak
```

- K3: liczby poza `#zmiennymi` tylko `/ 2`, `90 deg`, `360 deg`.
- **Wynik: Słupek (bez interfejsu z Płytą) i Obejma przyjęte.** Cały etap 1 (bazy 6 części + Próbka P6) przyjęty przez orkiestratora; dalej runda K1–K11 wykonawcy i eksport.

## E6.3: Rama (ucha, gwinty M3, fazka) i Gałka (nadlewy, wycięcia X/Y) – 23.10, ok. 09:25

Dane: `odbior-e6/features-e6.3-rama-galka.json` (commit wykonawcy 8b3ee9e), `znaczniki-e6.3-rama-galka.json`.

```
K1 featureStatus != OK: brak
K2 szkice w JSON: 27 | wiersze w drzewie: 27 | niedookreślone: brak
K3 wyrażenia ze stałymi spoza listy: 0
K4 Layout: przekrój: encji 14, więzów 42, FIX 0, encje bez więzów: brak
K4 Layout: czoło: encji 10, więzów 30, FIX 0, encje bez więzów: brak
K4 Rama: przekrój: encji 8, więzów 25, FIX 0, encje bez więzów: brak
K4 Rama: bok osi: encji 1, więzów 2, FIX 0, encje bez więzów: brak
K4 Rama: punkt otworu osi: encji 1, więzów 1, FIX 0, encje bez więzów: brak
K4 Rama: ucha wewnętrzne: encji 3, więzów 9, FIX 0, encje bez więzów: brak
K4 Rama: punkty gwintów uch: encji 3, więzów 6, FIX 0, encje bez więzów: brak
K4 Gałka: przekrój: encji 5, więzów 17, FIX 0, encje bez więzów: brak
K4 Gałka: nadlew: encji 1, więzów 3, FIX 0, encje bez więzów: brak
K4 Gałka: wycięcie X: encji 4, więzów 12, FIX 0, encje bez więzów: brak
K4 Gałka: wycięcie Y: encji 4, więzów 12, FIX 0, encje bez więzów: brak
K4 Powieka górna: przekrój: encji 7, więzów 20, FIX 0, encje bez więzów: brak
K4 Powieka górna: mostek: encji 4, więzów 12, FIX 0, encje bez więzów: brak
K4 Powieka górna: ucho: encji 1, więzów 2, FIX 0, encje bez więzów: brak
K4 Powieka górna: punkt osi: encji 1, więzów 1, FIX 0, encje bez więzów: brak
K4 Powieka dolna: przekrój: encji 7, więzów 20, FIX 0, encje bez więzów: brak
K4 Powieka dolna: ucho: encji 1, więzów 2, FIX 0, encje bez więzów: brak
K4 Powieka dolna: punkt osi: encji 1, więzów 1, FIX 0, encje bez więzów: brak
K4 Słupek: przekrój: encji 6, więzów 19, FIX 0, encje bez więzów: brak
K4 Słupek: punkt trzpienia: encji 1, więzów 1, FIX 0, encje bez więzów: brak
K4 Słupek: kanał nakrętki M5: encji 5, więzów 15, FIX 0, encje bez więzów: brak
K4 Słupek: punkt M4: encji 1, więzów 2, FIX 0, encje bez więzów: brak
K4 Obejma: przekrój: encji 6, więzów 18, FIX 0, encje bez więzów: brak
K4 Obejma: ucho: encji 4, więzów 12, FIX 0, encje bez więzów: brak
K4 Obejma: szczelina: encji 4, więzów 12, FIX 0, encje bez więzów: brak
K4 Obejma: punkt śruby: encji 1, więzów 2, FIX 0, encje bez więzów: brak
K4 Obejma: kieszeń nakrętki: encji 6, więzów 18, FIX 0, encje bez więzów: brak
```

**Wynik: dokończenie Ramy i Gałki przyjęte WARUNKOWO** – K1 nie sprawdzony: `featureStates` w odczycie puste (rollback za Gałką); pełny K1 przy następnym GET z rollbackiem na końcu (27/27 szkiców w pełni zdefiniowanych, 0 Fix, K3 bez stałych spoza listy).

## E6.3: Powieka górna i dolna – dokończenie – 23.10, ok. 09:45

Dane: `odbior-e6/features-e6.3-powieki.json` (commit 6542d15; 114 operacji), `znaczniki-e6.3-powieki.json`.

```
K1 featureStatus != OK: brak | operacji bez stanu: 114 (K1 NIEZALICZONY – brak danych)
K2 szkice w JSON: 38 | wiersze w drzewie: 38 | niedookreślone: brak
K3 wyrażenia ze stałymi spoza listy: 0
K4 Layout: przekrój: encji 14, więzów 42, FIX 0, encje bez więzów: brak
K4 Layout: czoło: encji 10, więzów 30, FIX 0, encje bez więzów: brak
K4 Rama: przekrój: encji 8, więzów 25, FIX 0, encje bez więzów: brak
K4 Rama: bok osi: encji 1, więzów 2, FIX 0, encje bez więzów: brak
K4 Rama: punkt otworu osi: encji 1, więzów 1, FIX 0, encje bez więzów: brak
K4 Rama: ucha wewnętrzne: encji 3, więzów 9, FIX 0, encje bez więzów: brak
K4 Rama: punkty gwintów uch: encji 3, więzów 6, FIX 0, encje bez więzów: brak
K4 Gałka: przekrój: encji 5, więzów 17, FIX 0, encje bez więzów: brak
K4 Gałka: nadlew: encji 1, więzów 3, FIX 0, encje bez więzów: brak
K4 Gałka: wycięcie X: encji 4, więzów 12, FIX 0, encje bez więzów: brak
K4 Gałka: wycięcie Y: encji 4, więzów 12, FIX 0, encje bez więzów: brak
K4 Powieka górna: przekrój: encji 7, więzów 20, FIX 0, encje bez więzów: brak
K4 Powieka górna: mostek: encji 4, więzów 12, FIX 0, encje bez więzów: brak
K4 Powieka górna: ucho: encji 1, więzów 2, FIX 0, encje bez więzów: brak
K4 Powieka górna: punkt osi: encji 1, więzów 1, FIX 0, encje bez więzów: brak
K4 Powieka górna: wycięcie: encji 4, więzów 12, FIX 0, encje bez więzów: brak
K4 Powieka górna: przycięcie przy zaczepie: encji 4, więzów 12, FIX 0, encje bez więzów: brak
K4 Powieka górna: zaczep: encji 6, więzów 17, FIX 0, encje bez więzów: brak
K4 Powieka górna: kącik 1: encji 8, więzów 24, FIX 0, encje bez więzów: brak
K4 Powieka górna: kącik 2: encji 8, więzów 24, FIX 0, encje bez więzów: brak
K4 Powieka górna: kącik 3: encji 8, więzów 24, FIX 0, encje bez więzów: brak
K4 Powieka dolna: przekrój: encji 7, więzów 20, FIX 0, encje bez więzów: brak
K4 Powieka dolna: ucho: encji 1, więzów 2, FIX 0, encje bez więzów: brak
K4 Powieka dolna: punkt osi: encji 1, więzów 1, FIX 0, encje bez więzów: brak
K4 Powieka dolna: przycięcie przy zaczepie: encji 4, więzów 12, FIX 0, encje bez więzów: brak
K4 Powieka dolna: zaczep: encji 6, więzów 17, FIX 0, encje bez więzów: brak
K4 Powieka dolna: kącik 1: encji 8, więzów 24, FIX 0, encje bez więzów: brak
K4 Powieka dolna: kącik 2: encji 8, więzów 24, FIX 0, encje bez więzów: brak
K4 Powieka dolna: kącik 3: encji 8, więzów 24, FIX 0, encje bez więzów: brak
K4 Słupek: przekrój: encji 6, więzów 19, FIX 0, encje bez więzów: brak
K4 Słupek: punkt trzpienia: encji 1, więzów 1, FIX 0, encje bez więzów: brak
K4 Słupek: kanał nakrętki M5: encji 5, więzów 15, FIX 0, encje bez więzów: brak
K4 Słupek: punkt M4: encji 1, więzów 2, FIX 0, encje bez więzów: brak
K4 Obejma: przekrój: encji 6, więzów 18, FIX 0, encje bez więzów: brak
K4 Obejma: ucho: encji 4, więzów 12, FIX 0, encje bez więzów: brak
K4 Obejma: szczelina: encji 4, więzów 12, FIX 0, encje bez więzów: brak
K4 Obejma: punkt śruby: encji 1, więzów 2, FIX 0, encje bez więzów: brak
K4 Obejma: kieszeń nakrętki: encji 6, więzów 18, FIX 0, encje bez więzów: brak
```

- K1: `featureStates` puste w odczycie; przyjęte warunkowo na podstawie odpowiedzi zapisu (wszystkie OK) i skanu drzewa wykonawcy (128 wierszy, 0 ikon błędu/ostrzeżenia). Do zamknięcia pełnym odczytem.
- K5: kąciki powiek – para profili ±x w jednym szkicu z tych samych zmiennych i jeden obrót na pasmo (Mirror FEATURE/FACE dla tych obrotów nie działa w Onshape) – wyjątek zaakceptowany przez orkiestratora.
- **Wynik: dokończenie powiek przyjęte warunkowo (K1).**

## E6.3: pełny K1 i zmiana nadlewów Gałki – 23.10, ok. 10:05

Dane: `odbior-e6/k1-e6.3.json` (commit wykonawcy 37d46d3; GET /features bez `includeGeometryIds=false` – ten parametr zerował `featureStates`). Wynik skryptu: **K1 0 operacji z błędem, 0 operacji bez stanu (114 operacji, 118 stanów)**, K2 38/38, K3 0.

- **Warunkowe odbiory E6.3 (Rama, Gałka, powieki) – zamknięte, przyjęte.**
- Nadlewy Gałki (zmiana B): `nadlewR` 23,5, spód na płaszczyźnie krawędzi z −12,68, wysokość `nadlewH` 6 – zmiana tylko zmiennych.

## E6.3: Płyta (bez słupków stopu) – 23.10, ok. 10:35

Dane: `odbior-e6/k1-plyta.json` (commit wykonawcy 2ea8d62; noSketchGeometry), `znaczniki-plyta.json`. Wynik skryptu: K1 0 błędów, 0 bez stanu (197 operacji); K2 64/64 bez niedookreślenia; K3 (operacje) 0. K3/K4 szkiców – przy ostatnim odczycie z encjami. K6: Płyta 38 operacji (wyjątek D4 – jedna część drukowana). Odstępstwa 1–4 (klatka do spodu ucha, przegroda 0,7, kieszenie nakrętek 0,15 od korpusu, otwory M2 S_PD wycięciem) zaakceptowane.

**Wynik: Płyta przyjęta warunkowo (K3/K4 szkiców).**

## E6.3 – odbiór końcowy etapu 2a – 23.10, ok. 10:55

Dane: `odbior-e6/features-e6.3-koniec.json` (commit wykonawcy 9ff7fa4; 219 operacji, 11 brył), `znaczniki-e6.3-koniec.json` (71 szkiców), raport wykonawcy `weryfikacja-e6-etap2a.md`.

```
K1 featureStatus != OK: brak | operacji bez stanu: 0 
K2 szkice w JSON: 71 | wiersze w drzewie: 71 | niedookreślone: brak
K3 wyrażenia ze stałymi spoza listy: 0
(71 szkiców: FIX 0, wszystkie encje związane)
```

- K9 (wykonawca): `luzKorpusSerwa`, `zSerw` (wykrył oderwanie klatek od tarczy – poprawione), `wyciecieG`, `ramiePGb` – OK.
- **Wynik: etap 2a przyjęty** (Rama, Gałka, Powieka górna i dolna, Słupek, Obejma, Płyta bez słupków stopu, Ramię PG, Ramię PD, przyrząd gięcia, Próbka P6). Poza zakresem: słupki stopu (v3.2), przyrząd zera (wgłębienie – zgoda użytkownika 23.10), napęd gałki (v3.2).

## E6.4: wgłębienie zera Gałki i Przyrząd zera – 23.10, ok. 11:05

Dane: `odbior-e6/features-e6.4.json` (commit 135f0ad; 224 operacje), `znaczniki-e6.4.json`. Skrypt: K1 0 błędów, 0 bez stanu; K2 73/73; K3 0; K4 0 Fix. Pomiary wykonawcy: wgłębienie R1,6 × 1,0 (dno z 29,0), trzpień Ø3,0 do z 29,1, oparcie czapki na sferze R152 (to samo co czoło rantu), fartuch na Ø84 z luzem 0,2.

**Wynik: przyjęte.**

## E6.5: kolizja Powieki górnej z kołnierzem Ramy – 23.10, ok. 11:20

Źródło: przemiatanie siatek CAD (`40-cad/narzedzia/e6-siatki-ruch-wynik-etap1.txt`): przenikanie do 1,13 mm (mostek i ucho G w kołnierz R35,2 od z 6). Wybranie w Ramie odrzucone (przebiłoby czoło rantu – widoczne wycięcia 6–7,6 mm przy oczach). Poprawka w Powiece górnej zmiennymi: `mostekKat1` 56, `mostekKat2` 95, `uchoGR` 5,5 (commity wykonawcy e57c6ef, 6818571). Pomiar: maks. z ucha G 5,50 (luz 0,50), mostka 5,40 (luz 0,60); Powieka górna jedna bryła; K1 224/228 OK. Do potwierdzenia przemiataniem po nowym eksporcie.

## E6.6: Próbka P4 i zmiany C2–C5 – 23.10, ok. 16:40

Dane: `odbior-e6/features-e6.6-p4-c.json` (commit adfb700), `znaczniki-e6.6-p4-c.json`. Skrypt: K1 0 błędów, 0 bez stanu; K2 79/79; K3 0; K4 0 Fix. C3: nadlewy Gałki za wycięciami X/Y – całe; nadlew 330° łączy się ze ścianką na łuku 70° (z −12,68), przyjęte z testem 30 N po druku (README).

**Wynik: P4 i C2–C5 przyjęte.**
