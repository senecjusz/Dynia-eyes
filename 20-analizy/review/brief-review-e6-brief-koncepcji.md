# Review briefu E6.1 (koncepcja dużego oka 2c) – przed wysłaniem do realizatora (22.10)

Jesteś recenzentem. Dwóch recenzentów (Fable – Anthropic, Astra – OpenAI Codex) dostaje ten sam materiał i pracuje niezależnie. Tylko do odczytu: bez `git pull`, commitów, pushy i porządków w repo. Zapisujesz wyłącznie swój raport. Piszesz po polsku.

## Co oceniasz

**Brief, nie koncepcję.** Plik: `30-projekt/brief-e6-duze-oko-koncepcja.md`. To zlecenie dla realizatora (Opus), który na jego podstawie napisze koncepcję mechanizmu dużego oka 2c (dwie powieki, ruch gałki w dwóch płaszczyznach). Koncepcja potem przejdzie osobne review, a z niej orkiestrator napisze brief dla wykonawcy CAD (Onshape). Użytkownik 22.10: „najpierw wyślij do review Astry i Fable i dopiero jak dadzą zielone światło, wyślij do realizatora”.

Pytanie główne: **czy realizator, mając tylko ten brief i repo, napisze koncepcję, która spełni intencje użytkownika i da się zbudować bez kolejnej rundy pytań?**

Sprawdź w szczególności:
1. **Zgodność z intencjami użytkownika** (cytaty z rozmowy 22.10 niżej) – czy niczego nie pominięto, nie przekręcono, nie dodano wbrew niemu.
2. **Zgodność z repo:** `AGENTS.md` (zasady projektowe, luzy, modelowanie w Onshape, DFAM), `30-projekt/decyzje.md`, `30-projekt/opis.md`, `50-elektronika/sprzet.md`, `70-budowa/dziennik.md` (20–21.10), `20-analizy/2026-10-18-duze-oko-jedna-noc.md`, research `20-analizy/2026-10-17-mechanizm-oka/`, `10-inspiracje/`. Sprzeczności, nieaktualne założenia, fakty podane źle (np. liczby, nazwy, wyposażenie).
3. **Braki w wymaganiach**, które zemszczą się później: np. ograniczenia montażu w dyni (wieża w środku, grubość ścianki, otwór w wieczku), rozmieszczenie względem małych oczu, zasilanie (powerbank – patrz `20-analizy/2026-10-22-powerbank-*.md`), bezpieczeństwo dziecka, waga na ściance dyni, demontaż po Halloween, czas druku, termin (dynia 27.10 według analizy 18.10 – sprawdź w repo, czy aktualne).
4. **Sprzeczności wewnątrz briefu** i wymagania, których nie da się spełnić naraz (np. otwór ≤ 80 vs gałka + powieki + kardan; „lekko” vs trzymanie serw w każdym kierunku).
5. **Czy zakres jest wykonalny** w jednym raporcie i czy oczekiwany wynik (punkty 1–11) jest wystarczający dla briefu CAD – czego brakuje, co jest zbędne.
6. **Czy wymóg „sprawdzone mechanizmy z researchu”** jest sformułowany tak, że realizator nie wymyśli własnego mechanizmu, a jednocześnie dopasuje skalę (otwór ≤ 80, M3).

## Kontekst z rozmowy z użytkownikiem (22.10, dosłownie lub prawie)

- „Teraz chciałbym, abyś przygotował te bardziej skomplikowane mechanizm oko z powiekami i ruszające się w dwóch płaszczyznach i zlecimy pierwszą iterację.”
- „Myślę, że od razu 2c. Czy przeanalizowałeś rozwiązania? Czy masz już pomysł, jak to zrobić, który można przepuścić przez krytyczną analizę? Czy zlecisz to do Opusa i puścisz potem analizę Fable'em i Astrą?”
- „Czy zwróciłeś uwagę, że jesteśmy ograniczeni otwornicą 80? I nie robiłbym tym razem tak ciężkiego mechanizmu jak zewnętrznego mocowania i wkładania kasety. To musi być lżejsze (cieńsze).”
- Przegub z warsztatu: „połączenie krzyżowe” (kardan; w `sprzet.md` „Przegub 3 mm i 5 mm”).
- „Bazować na sprawdzonych mechanizmach z researchu.”
- Z wcześniejszych sesji (przekazanie `30-projekt/przekazanie-2026-10-21.md`, sekcja „Zasady współpracy”): komplet do druku, nie na raty; preferowane części drukowane i śruby M3, bez rozwiązań „craftowych”; bez absurdalnych napraw; najpierw specyfikacja, potem pytania; bezpieczeństwo dziecka; serwo bez gwałtownych skoków.

## Raport

- Wagi: **KRYTYCZNE** (realizator zrobi coś bezużytecznego albo sprzecznego z użytkownikiem), **WAŻNE**, **DROBNE**.
- Dla każdej uwagi: miejsce w briefie, scenariusz porażki, **konkretna poprawka tekstu briefu** (zdanie do dopisania lub zmiany), pewność.
- Liczby zamiast opinii, gdy da się policzyć (np. czy Ø60 + powieki + luzy mieszczą się w Ø80).
- Na końcu **werdykt jednym zdaniem: ZIELONE ŚWIATŁO / ZIELONE PO POPRAWKACH (wymień które) / CZERWONE**.
- Plik raportu: Fable → `20-analizy/review/2026-10-22-brief-e6-fable.md`, Astra → `20-analizy/review/2026-10-22-brief-e6-astra.md`.
