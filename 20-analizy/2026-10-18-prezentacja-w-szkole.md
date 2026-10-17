# Prezentacja w szkole – co to zmienia

Dynia będzie pokazywana **w szkole**: dużo dzieci naraz, ciągły ruch, dotykanie. To zmienia kilka założeń.

## 1. Czujniki w tłumie

- **PIR jako budzik traci sens:** w tłumie jest wyzwolony cały czas, więc oczy po prostu ciągle się ruszają. Tyle że to minimum i tak już robi.
- **Radar LD2450** widzi do 3 osób i w tłumie będzie przeskakiwał między nimi. **Odczyt trzeba mocno filtrować**, inaczej oczy będą drgać nerwowo i męczyć serwa.

## 2. Filtrowanie odczytu (LD2450) – propozycja

| Krok | Co robi | Wartość startowa |
|---|---|---|
| 1. Strefa | ignoruj cele za blisko, za daleko i z boku | 0,3–2,5 m, ±50° |
| 2. Wybór celu | najbliższy cel w strefie | — |
| 3. **Przyklejenie** | trzymaj wybrany cel co najmniej przez określony czas; zmiana tylko, gdy obecny zniknie albo nowy jest wyraźnie bliżej | min. **3–5 s**; zniknięcie > 1 s; „wyraźnie bliżej” = o 0,5 m |
| 4. Wygładzanie kąta | filtr wykładniczy | α ≈ 0,2 przy 10 odczytach/s |
| 5. Martwa strefa | nie ruszaj okiem przy małych zmianach | ±5° |
| 6. Limit prędkości oka | płynny ruch zamiast skoków | ~120°/s |

Wszystkie wartości jako stałe na górze programu, do strojenia na miejscu.

## 3. Ochrona serw i powerbanku (niezależnie od czujnika)

- **Maks. 4 serwa w ruchu jednocześnie**: kolejka ruchów w programie. Ogranicza szczyty prądu (brak resetów Nano) i grzanie.
- **Programowe limity kąta** każdego oka (np. 50–130°), żeby serwo nigdy nie napierało na mechanizm.
- **Tryb tłumu:** jeśli przez > 30 s cały czas ktoś jest w strefie, oczy rozglądają się losowo w spokojniejszym tempie. Co jakiś czas (np. co 20–40 s) **wszystkie oczy naraz patrzą na najbliższą osobę** (efekt „wow”) i znowu się rozbiegają.
- **Czas pracy:** dzień w szkole (6–8 h ciągłej pracy) przy ~0,5–0,8 A to 4–6 Ah. Powerbank 20 000 mAh (~12,5 Ah przy 5 V) **wystarczy na cały dzień z zapasem**.

## 4. Dzieci dotykają

- **Wkładanie palców i kręcenie gałką:** plastikowe przekładnie SG90 mogą się zniszczyć przy wymuszonym obrocie.
  - Gałka cofnięta w kołnierzyku (wariant F) utrudnia jej złapanie, więc to już działa na naszą korzyść.
  - **Moduły na bagnet są wymienne**, więc zabieramy **2–3 zapasowe moduły** i wymieniamy na miejscu w 30 s.
  - Opcjonalnie: ponieważ ruszamy oczami tylko w zakresie ±40°, dodajemy **mechaniczne ograniczniki obrotu jarzma** w tulei. Wymuszony obrót oprze się na ogranicznikach, a nie na przekładni serwa.
- **Bezpieczeństwo:** brak dostępnych przewodów i ostrych krawędzi z zewnątrz. Powerbank w pudełku w środku. **Wkręty i kolce rantu nie mogą wystawać.**

## 5. Transport

- Dynię trzeba przewieźć. **Moduły na czas transportu wyjąć** (bagnet), gniazda zostają w dyni.
- Wieża z elektroniką: wyjmowana albo zabezpieczona przed przewróceniem w dyni.

## 6. W pomieszczeniu

- Pod dachem, więc deszcz odpada. Wilgoć tylko z samej dyni.

## Do ustalenia
1. **Kiedy jest prezentacja w szkole?** Jeśli przed 31.10, to ona jest terminem i trzeba przesunąć punkty kontrolne w [planie](../30-projekt/plan-realizacji.md).
2. Ile godzin dynia ma działać tego dnia?
3. Czy dynia stoi na stole na wysokości dzieci (wtedy ±50° w poziomie i niska strefa radaru)?
