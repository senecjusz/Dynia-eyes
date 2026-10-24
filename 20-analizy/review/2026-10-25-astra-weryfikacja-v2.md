Zadanie E6: weryfikacja poprawek siatek v2. Niezależna kontrola 3MF: **0 błędów szczelności i degeneracji; każda część ma jedną bryłę, zbiorczy siedem.**

| Uwaga | Status | Wynik weryfikacji |
|---|---|---|
| K1 | **Zamknięta** | Na siatce lico podkładki x=35,7, dno otworu x=38,1: podparcie M2 **2,4 mm**, luz osiowy **0,2 mm**. |
| K2 | **Zamknięta geometrycznie** | Podłoga **5,50 mm**, wsunięcie M5 **6,50 mm**, zapas do dna piasty **0,50 mm**. Skuteczność docisku i tarcia wymaga próby ręcznej. |
| W1 | **Niezamknięta** | Nadal tylko **48 pozycji gałki i 7 powiek**; zagęszczenie nie działa. Pominięte pierwsze **3 mm** drutów S1/S2, końcówki Z, pełny kardan i kable; brak testu przecięć trójkątów. Transformację S3 i ruch dolnej powieki poprawiono. |
| W2 | **Niezamknięta** | Znalazłam odstęp **0,426 mm** przy θ=35°, φ=−14°, już poza wyłączonym początkiem drutu. Nadal poniżej wymaganego nominalnego **0,5 mm**. |
| W3 | **Zamknięta** | Instrukcja odpowiada solverowi: S1/S2 **−6°**, S3 zero przy **25,75°**, zamknięcie **+23,2°**, otwarcie **−24,6°**. |
| W4 | **Zamknięta wymiarowo** | Po rozwierceniu: Ø1,4 dla drutu Ø1 daje **0,20 mm/stronę**; Ø2,4 dla pary Ø1 daje **0,20 mm** do obwiedni pary. Zachowanie Z pozostaje do próby. |
| W5 | **Zamknięta dokumentacyjnie** | Opisano mosty **13,1 i 10,5 mm** oraz usunięcie zwisu przekraczającego **0,3 mm**. |
| D1 | **Zamknięta** | Obie siatki mają zmin=0; płaskie powierzchnie oparcia wynoszą **21,14 i 13,43 mm²**. |
| D2 | **Zamknięta** | Raport i SVG: **41,9/42,9 mm**; obliczenie: **41,856/42,890 mm**. Powieki **44,58/44,55 mm**, zaokrąglone do 44,6. |

Dodatkowe problemy poprawek — oba **WAŻNE**, pewność wysoka:

- [Kontrola kolizji, linia 180](/C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/40-cad/narzedzia/duze-oko-kolizje.js:180): wzorzec `[d.]` zamiast `[\d.]` pomija całe zagęszczenie. Raport może przeoczyć minimum między pozycjami. **Poprawić wzorzec, sprawdzić liczbę wykonanych pozycji i przeliczyć wynik.**
- [Próbka, linia 216](/C:/Users/Karol/Documents/_AI-projects/Dynia-eyes/40-cad/openscad/duze-oko-v2.scad:216): trójkątne okno nie odwzorowuje płaskiego podcięcia ucha. **2 mm od osi** próbka ma materiał aż **3,2 mm pod otworem**, gałka tylko **1,2 mm**. Może klinować drut i fałszywie odrzucić pasowanie. **Odwzorować płaski odcinek 4,5 mm oraz rzeczywiste skosy ucha.**

Bez zapisu plików i git; brak procesów pozostawionych w tle.

**Werdykt: wersja nie nadaje się jeszcze do sekwencji „próbka drutu → części”; najpierw poprawić reprezentatywność próbki, zapewnić luz S1 ≥0,5 mm i powtórzyć działającą kontrolę zagęszczoną.**