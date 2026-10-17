# Mocowanie modułu małego oka w dyni

## Wymagania

- Małe oko = **samodzielny moduł**: piłeczka + serwo SG90 + obudowa, z wyprowadzonym kablem serwa.
- Rodzic: drukuje moduł i **wierci otwór** w dyni.
- Syn: **sam wkłada moduł i go przykręca**. Bez narzędzi albo co najwyżej jedno proste narzędzie, bez precyzji, bez możliwości złego złożenia.
- Wolimy części drukowane od rzemiosła (drut, klej, gwoździe).

## Warianty

### A. Tuleja z gwintem + pierścień-oprawa (rekomendowany)
Sprawdzony układ: [68percentwater – rurka z gałką z przodu i serwem z tyłu](../10-inspiracje/arduino-servo-pumpkin-eyes-68percentwater.md). U nich moduły trzymał klej na gorąco, u nas trzyma gwint.

Moduł to drukowana **tuleja z kołnierzem**. Wkłada się ją **od środka** dyni w otwór, a kołnierz opiera się o wewnętrzną ściankę. **Od zewnątrz** syn nakręca ręcznie **duży pierścień z gwintem**, który jest jednocześnie ozdobną oprawą oka i dociska ściankę dyni między kołnierzem a pierścieniem.

- **Plusy:** bez narzędzi. Przykręcanie od zewnątrz jest wygodne i dobrze widać, co się robi. Duży, gruby gwint drukowany (np. trapezowy, skok 3–4 mm) łatwo nakręcić, a trudno go zniszczyć. Długość gwintu pokrywa różne grubości ścianki. Oprawę można stylizować (powieka, „brwi”, kolor).
- **Minusy:** przez otwór przechodzi tuleja z piłeczką. Jeśli serwo siedzi z tyłu tulei (jak u 68percentwater), otwór to ~Ø 46–51 mm; serwo obok piłeczki go powiększa (do potwierdzenia w CAD).
- **Na co uważać:**
  - **Obrót modułu przy dokręcaniu.** Oś oka musi zostać pionowa, więc na kołnierzu dajemy ząbki lub kolce wbijające się w ściankę oraz strzałkę „GÓRA” do ustawienia.
  - **Miękka ścianka prawdziwej dyni.** Szeroki kołnierz i pierścień rozkładają nacisk, żeby nie zgnieść miąższu.

### B. Bagnet (wsuń i przekręć)
Rodzic na stałe osadza w otworze **pierścień bazowy**: przykręca go albo dociska jak w wariancie A. Syn wkłada moduł i **przekręca o ~30°**, aż kliknie.

- **Plusy:** najszybszy montaż i demontaż. Moduły można wymieniać między otworami, a pozycja (oś pionowa) jest wymuszona zatrzaskiem.
- **Minusy:** dwie części do zaprojektowania zamiast jednej, a zatrzask musi być dobrze dopasowany do druku. Pierścień bazowy i tak trzeba jakoś zamocować.

### C. Kołnierz przykręcany wkrętami do ścianki
Tuleja z kołnierzem i 2–3 otworami, którą syn przykręca wkrętami do drewna od środka.

- **Plusy:** najprostszy w projekcie.
- **Minusy:** potrzebny wkrętak. W prawdziwej dyni wkręty trzymają słabo i luzują się, gdy miąższ mięknie.

### D. Wcisk na zatrzaskach (sprężyste łapki)
- Prosty montaż, ale trzymanie zależy od grubości ścianki i jest niepewne w miękkiej dyni. Odpada jako główne rozwiązanie.

### E. Tuleja wkręcana w miąższ + moduł z bagnetem (nowy faworyt, 2026-10-17)
Wynika z [celu wizualnego](2026-10-17-modul-malego-oka-wymiary.md#cel-wizualny-punkt-wejścia-od-użytkownika): z zewnątrz ma być widać tylko miąższ i gałkę.

1. **Tuleja-gniazdo** z grubym gwintem „ślimakowym” (jak korkociąg albo kołek do ziemi), drukowana w **kolorze dyni**. Wkręca się ją **od środka** w otwór Ø ~54 mm, a żebra gwintu same wcinają się w miąższ. Tuleja jest okrągła, więc to, w jakiej pozycji skończy się wkręcanie, nie ma znaczenia.
2. **Moduł oka** (gałka, jarzmo, serwo) wsuwa się w tuleję od środka i blokuje **bagnetem z kluczem**: wchodzi tylko w jednej pozycji, więc oś oka zawsze jest pionowa. Przekręcenie o ~30° i klik.

- **Plusy:** z zewnątrz brak elementów montażowych, efekt jak na filmie. Oba kroki wykonuje syn od środka, bez narzędzi. Moduły można wyjmować i zamieniać.
- **Minusy:** dwie części do zaprojektowania. Trzeba przetestować, jak gwint trzyma w prawdziwym miąższu (wydruk testowy + kawałek dyni).
- **Ryzyko:** wkręcanie od środka w małej dyni (25–27 cm) wymaga miejsca na rękę, więc otwór z pokrywką musi być wystarczająco duży.

## Wspólne elementy modułu (niezależnie od wariantu)

- **Złącze:** standardowa wtyczka 3-pin serwa, a w dyni czekają przedłużacze z PCA9685. Syn tylko wpina wtyczkę. Kable i moduły **numerujemy** (kanał PCA9685 ↔ moduł).
- **Szablon do wiercenia:** wydruk przykładany do dyni, który wyznacza środek i średnicę otworu.
- **Otwór pod standardową otwornicę**, żeby nie ciąć nożem na oko. Typowe średnice otwornic: 51, 54, 57, 60, 64, 68 mm.

## Ustalone

- **Małe oczy bez powiek** (2026-10-17): sama gałka na 1 serwie, czyli najprostszy mechanizm, który na pewno się uda. Wersja z powieką zostaje jako pomysł na później.
- **Dynia prawdziwa** (2026-10-17). Konsekwencje: ścianka 2–5 cm, miękka i wilgotna, więc w wariancie A potrzebny jest **długi gwint** (zakres ~20–50 mm) i **szeroki kołnierz oraz pierścień**, żeby nie zgnieść miąższu. Wkręty (wariant C) odpadają. Elektronika (Nano, PCA9685) poza wilgotnym wnętrzem albo w zamkniętej puszce.

## Wersja z powieką (odłożona)

Inspiracja: [Kent Harris – Pumpkin Eyes](../10-inspiracje/pumpkin-eyes-kent-harris.md). Małe oko z jedną pomarańczową powieką (2 serwa na oko). Jeśli idziemy w tę stronę, moduł musi to przewidzieć od początku:
- powieka i jej oś są **przed** ścianką dyni, więc wystają na zewnątrz,
- serwo powieki z boku poszerza moduł, przez co rośnie otwór albo serwo trzeba przenieść za ściankę z napędem przez popychacz,
- budżet serw: 18 × SG90 = np. 9 oczu z powieką albo mieszanka.

## Do ustalenia

1. Jakie otwornice są w warsztacie (średnice)?
2. Ile oka ma wystawać poza dynię? Piłeczka może być schowana w oprawie albo wypukła.
