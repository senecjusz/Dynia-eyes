# Wnioski z pracy 22–23.10: sposób pracy orkiestratora i wykonawcy CAD

Zebrane z pracy nad E6 (duże oko): plik stanu wykonawcy (`40-cad/onshape/stan-api-e6.json` → `wnioskiDoAGENTS`), Parking w `teraz.md` (wnioski g–i) i obserwacje orkiestratora. **To propozycje zmian w `AGENTS.md` – do decyzji użytkownika; `AGENTS.md` nie jest zmieniony.** Każdy punkt: co się stało → proponowana zasada.

## A. Rozmowa z użytkownikiem i podział decyzji

1. **Użytkownik decyduje o funkcji, agenci o technice.** Wykonawca zadawał użytkownikowi pytania o geometrię, których ten nie mógł ocenić („3 mm w jedną czy drugą stronę – nie jestem w stanie sobie tego wyobrazić”). → Do użytkownika idą tylko decyzje funkcjonalne (co oko robi, liczba serw, otwór, wygląd) i fakty, które zna tylko on (co jest w warsztacie). Rozstrzygnięcia techniczne podejmuje orkiestrator z wykonawcą i recenzentami.
2. **Nie czekać na dane.** W nocy wykonawca stał godzinami, bo brakowało pomiarów. → Brak pomiaru = najlepszy szacunek ze źródłem (karta produktu, zdjęcie, typowa wartość) wpisany jako **zmienna**; wątpliwość w planie, praca idzie dalej. Wymiary części brać ze specyfikacji producenta, nie prosić użytkownika o pomiar.
3. **Bez prognoz czasu** w briefach i raportach (były błędne o rząd wielkości).
4. **Bez zakupów modelarskich** przy krótkim terminie; śruby i nakrętki wolno zakładać.
5. **Fakt, którego nie da się oszacować, sprawdzić wprost.** Koncepcja przez kilka rund zakładała końcówki kulowe RC, których użytkownik nie miał (miał kardany). → Gdy założenie dotyczy istnienia części w warsztacie, poprosić o link albo zdjęcie od razu, zanim powstanie koncepcja.

## B. Orkiestrator

6. **Każde zlecenie dla wykonawcy zaczyna się od roli** („jesteś wykonawcą; plan do orkiestratora; nie commitujesz na `main`”). Bez tego wykonawca zaczął działać jak orkiestrator (commity na `main`, decyzje z rozmowy z użytkownikiem).
7. **Nie czekać na powiadomienie – sprawdzać pliki wynikowe.** 23.10 między 11:20 a 15:30 nic się nie działo, bo orkiestrator czekał na powiadomienie, a koncepcja była gotowa w pliku od 14:33. → Przy każdym sygnale i co najmniej co 30 min sprawdzić daty plików wynikowych agentów i stan wykonawcy; wykonawcy w oczekiwaniu dać pracę niezależną (dokumentacja, części niezależne od zmian).
8. **Limit rund analizy.** Koncepcja napędu gałki przeszła 4 rundy (v1 → v3.2) i każda runda Astry znajdowała nowe braki modelu analitycznego. → Najwyżej 2 rundy review koncepcji; potem budowa w CAD na zmiennych, a ostateczna kontrola kolizji **na siatkach z CAD z kinematyką** (`40-cad/narzedzia/e6-siatki-ruch.py`), która od razu znalazła realną kolizję (powieka–kołnierz 1,13 mm).
9. **Przemiatanie obejmuje też pary stała–stała** (słupki stopu kolidowały z korpusem serwa i wieżyczkami – wykryte dopiero przy budowie).
10. **Codex (Astra) w tle** z limitem 60 min bez pytania za każdym razem (zgoda 23.10); `codex exec` w tle zawsze z `< /dev/null`, inaczej czeka na wejście i nic nie robi.
11. **Odbiór K1 tylko z kompletnych danych:** skrypt odbioru zgłasza operacje bez stanu (`40-cad/narzedzia/odbior_k1_k4.py`); „0 błędów” przy pustych `featureStates` to nie zaliczenie.

## C. Wykonawca CAD – Onshape i API

12. **Encje pomocnicze nie liczą się do znacznika niedookreślenia.** Szkic z samymi encjami pomocniczymi nie pokazuje ikony. → Szkice kontrolowane znacznikiem (layout) z encjami zwykłymi; encje pomocnicze w szkicach części wymiarować zawsze; K4 z JSON przy odbiorze.
13. **`document.visibilityState` w panelu przeglądarki aplikacji bywa „hidden” przy widocznym panelu** – nie jest wskaźnikiem; o widoczności mówi układ okien.
14. **Timer podtrzymania (HEAD /documents) trzyma ciasteczko, ale nie połączenie edytora** („session has timed out … reconnect”); po przeładowaniu `window.G` ginie – stan trzymać w pliku, skrypt wstrzykiwać ponownie. Logowanie i tak wygasa – zalogować może tylko użytkownik.
15. **Mirror FEATURE nie odbija Hole** (także z `fullFeaturePattern`) → otwór odbijać Mirror FACE (`qCreatedBy(Hole, FACE)`); para z otworem = dwa Mirror. Mirror obrotów (Revolve REMOVE) też nie działa → para profili ±x w jednym szkicu jako zatwierdzony wyjątek K5.
16. **Hole przez API wymaga `scope`** (bryła), inaczej ERROR „Error regenerating”. Hole w litej tarczy wierci do krawędzi – wtedy wycięcie okręgu.
17. **Więz ANGLE przez API daje „constraints not applicable”** → kąty wymiarować położeniem punktu (np. R·sin(kąt)).
18. **Szkic nie może leżeć na płaszczyźnie utworzonej później w drzewie** – przy poprawce usuwać i tworzyć w kolejności.
19. **Revolve częściowy:** `endBound` BLIND; obszar szkicu wybierać przez `qLargest`/`qSmallest` (`qContainsPoint` nie działa).
20. **Lista drzewa jest wirtualizowana** – przed odczytem wiersza przewinąć na dół.
21. **`featureStatus` OK nie dowodzi, że szkic się przeliczył:** szkic bez rozwiązania po zmianie zmiennej zostaje w starej geometrii bez ostrzeżenia. → K9 mierzy bryły (`bodydetails`), nie tylko stany (K9 wykrył tak błąd przycięcia powieki dolnej i oderwanie klatek od tarczy).
22. **`GET /features` z `includeGeometryIds=false` zwraca puste `featureStates`** – do K1 wołać bez tego parametru.
23. **Variable Studio liczy po kolei** – zmienna może odwoływać się tylko do zmiennych wyżej na liście.
24. **Płaszczyzny LINE_ANGLE mają niespójne kierunki osi szkicu** – każde cięcie na takiej płaszczyźnie sprawdzić `bodydetails`.
25. **Eksport przez API ma niski licznik** (`POST /translations` 10 po jednym eksporcie) – eksport ręczny przez użytkownika, całe Part Studio jednym 3MF, rozdzielenie brył skryptem.

## D. Co działało dobrze (zostawić)

- Plan drzewa do orkiestratora przed zapisem i szybkie zatwierdzanie; wykonawca sam wyłapywał błędy koncepcji (słupki stopu, nadlew w wycięciu, przebicie czoła rantu, zła wysokość oparcia przyrządu zera).
- Niezależny odbiór K1–K4 przez orkiestratora na surowych danych (`odbior-e6-orkiestrator.md`).
- Commit i push na bieżąco z upoważnienia użytkownika (23.10).
