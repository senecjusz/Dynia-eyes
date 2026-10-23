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
