# Mocowanie modułu małego oka w dyni

## Wymagania

- Małe oko = **samodzielny moduł**: piłeczka + serwo SG90 + obudowa, z wyprowadzonym kablem serwa.
- Rodzic: drukuje moduł i **wierci otwór** w dyni.
- Syn: **sam wkłada moduł i go przykręca**. Bez narzędzi albo co najwyżej jedno proste narzędzie, bez precyzji, bez możliwości złego złożenia.
- Wolimy części drukowane od rzemiosła (drut, klej, gwoździe).

## Warianty

### A. Tuleja z gwintem + pierścień-oprawa (rekomendowany)
Moduł to drukowana **tuleja z kołnierzem**. Wkłada się ją **od środka** dyni w otwór, a kołnierz opiera się o wewnętrzną ściankę. **Od zewnątrz** syn nakręca ręcznie **duży pierścień z gwintem**, który jest jednocześnie ozdobną oprawą oka i dociska ściankę dyni między kołnierzem a pierścieniem.

- **Plusy:** bez narzędzi. Przykręcanie od zewnątrz jest wygodne i dobrze widać, co się robi. Duży, gruby gwint drukowany (np. trapezowy, skok 3–4 mm) łatwo nakręcić, a trudno go zniszczyć. Długość gwintu pokrywa różne grubości ścianki. Oprawę można stylizować (powieka, „brwi”, kolor).
- **Minusy:** przez otwór musi przejść cała tuleja z piłeczką, więc otwór jest stosunkowo duży (szacunkowo Ø 55–60 mm, do potwierdzenia w CAD).
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

## Wspólne elementy modułu (niezależnie od wariantu)

- **Złącze:** standardowa wtyczka 3-pin serwa, a w dyni czekają przedłużacze z PCA9685. Syn tylko wpina wtyczkę. Kable i moduły **numerujemy** (kanał PCA9685 ↔ moduł).
- **Szablon do wiercenia:** wydruk przykładany do dyni, który wyznacza środek i średnicę otworu.
- **Otwór pod standardową otwornicę**, żeby nie ciąć nożem na oko. Typowe średnice otwornic: 51, 54, 57, 60, 64, 68 mm.

## Do ustalenia

1. **Dynia prawdziwa czy sztuczna (piankowa)?** To zmienia wszystko:
   - prawdziwa ma ściankę 2–5 cm, miękką i mokrą, więc potrzebny jest długi gwint i szeroki docisk,
   - sztuczna ma ściankę ~1 cm i jest sztywna, więc wystarczy krótka tuleja; wariant C też by działał.
2. Jakie otwornice są w warsztacie (średnice)?
3. Ile oka ma wystawać poza dynię? Piłeczka może być schowana w oprawie albo wypukła.
