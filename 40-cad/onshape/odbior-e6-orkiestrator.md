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
