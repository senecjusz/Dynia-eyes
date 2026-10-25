# Raport wykonawcy – montaż i budowa

Gałąź `wykonawca-montaz` (worktree `.claude/worktrees/montaz`), scalony lokalny `main` z PRD 0.2 (`548f970`). Aktualizowany przy każdym kamieniu.

## Stan zadań

| Zadanie | Stan | Uwagi |
|---|---|---|
| **Szufladka v2 (P4/P5/P6 wg PRD 0.2)** | zrobione: model, eksport, kontrole, review (1 runda), poprawki | brief PM 25.10 wieczorem; czeka na scalenie przez PM i próbki u użytkownika |
| M1 – instrukcja małych oczu v2.8 | w toku, wstrzymane | niezacommitowana poprawka `70-budowa/montaz-v2.8.md` (wiertło Ø3,2, Jarzmo obrócone o 180°, lista serii) – czeka na akceptację zakresu |
| O6 – montaż dużego oka na stole | wstrzymane | czeka na akceptację zakresu; Uchwyt serw w analizie (O2) |
| P8–P12 – podstawka i elektronika | wstrzymane | kolejność montażu po wydruku szufladki v2; pinout skrętek ustala elektronika |
| K2–K5 – kompletacja w dyni | wstrzymane | czeka na akceptację zakresu |

## Szufladka v2 – stan

Model: `40-cad/openscad/podstawka.scad`. Opis, kolejność montażu, śruby i dowody: `20-analizy/2026-10-25-podstawka-model.md`, sekcja „v2”. Pliki do druku: `40-cad/3mf/Podstawka v2/`.

- **Zmienne bazowe według pomiarów:** wnętrze 216, dno 9, głębokość 226, wkręty płyty 20 od frontu i tyłu, otwór Ø60.
- **Korpus 215,0** (ścianki 2,0, wtyk USB-C 50 zostaje): **luz 0,5 na stronę** w podstawce.
- **Front** osobno, 244 × 65 × 4, druk licem. Do korpusu przykręcony 2 × M4 rączki (nakrętki w przedniej kieszeni korpusu, 23 mm przed powerbankiem) i 2 × M3 przy dolnych rogach.
- **Rączka:** kształt i wielkość według decyzji użytkownika (25.10, po review) – mały, niski, zaokrąglony, ścięty ostrosłup. Przy froncie 40 × 10, na zewnątrz 46 × 16, wysięg 10 mm, krawędzie R2, na środku frontu. Łby 2 × M4 × 20 wklejone epoksydem, rozstaw 26.
- **Blokada:** M4 × 25 na środku górnej części frontu (otwór we froncie Ø5), w krawędź płyty górnej, 58 mm nad stołem. Otwór pilotowy Ø3,3 × 22 wierci się przez front; jest też na rysunku płyty.
- **PIR we froncie, po prawej** (decyzja użytkownika 25.10): otwór Ø24, gniazdo 23,5 × 23,5 × 0,5, 2 × M2 w słupki; za płytką 22 mm. Przewód idzie prosto do tyłu pasem wtyku USB-C, nie w poprzek nad powerbankiem.
- **Kaseta elektroniki v1 bez zmian:** te same wierzchołki z dokładnością 0,001 mm. Tuleja i nakrętka bez zmian.
- **Stara blokada usunięta:** prawy kołnierz czoła i otwór w prawej ściance. Połówki A1 mini i osłonka PIR v1 wypadają z eksportu.

### Wyniki kontroli

| Kontrola | Wynik |
|---|---|
| Siatki | 9 części (z próbką gniazda PIR): 0 błędów, 1 bryła; gwinty po naprawie zdegenerowanych trójkątów (jak v1) |
| Wymiary wobec parametrów | OK |
| Kolizje: zamknięta, wsuwanie 0/30/60/90, PIR we froncie, wkładanie PIR, śruby | pusto (przed review i po poprawkach) |
| Czułość kontroli | okno PIR bez zapasu → kolizja wykryta |
| Test zginania | przed review 6 wariantów, po poprawkach 5 (w tym zmienne nowej rączki): wymiary zgodne z oczekiwanymi, siatki OK, kolizje OK |

### Review (Fable, Astra) – rozstrzygnięcia

Raporty: `20-analizy/review/2026-10-25-szuflada-v2-{fable,astra}.md`, jedna runda. Żaden z recenzentów nie zgłosił uwag KRYTYCZNYCH. Fable zgłosił 4 WAŻNE i 8 DROBNYCH, Astra 3 WAŻNE i 1 DROBNĄ. Pełna tabela rozstrzygnięć jest w `20-analizy/2026-10-25-podstawka-model.md`, sekcja v2.

- **Poprawione w modelu:**
  - próbka gniazda PIR do przymiarki przed frontem;
  - otwór blokady we froncie Ø5, pilot wiercony przez front;
  - wycięcie 12 × 8 w przegrodzie na przewody z wtyków Dupont;
  - okno PIR otwarte do górnej krawędzi, bez mostu;
  - fazki wejściowe korpusu.
- **Przeniesione do montażu i próby u użytkownika:** długości i trasa przewodów PIR i USB-C przy wysuwaniu, imbus do blokady pod dynią.
- **Bez zmian:** nakrętki dostępne tylko z góry.

**Wynik:** do druku są korpus, rączka i próbka gniazda PIR. Front drukować dopiero po przymiarce PIR w próbce.

### Review runda 2 (26.10, na prośbę użytkownika)

Wersja końcowa (PIR po prawej, mała rączka). Astra: 0 uwag. Fable: 0 krytycznych, 1 ważna, 3 drobne. Wprowadzone poprawki:
- okno PIR w korpusie 38 × 30;
- skrypt kolizji wykrywa nieudane asserty;
- lico rączki płaskie.

Szczegóły: `20-analizy/2026-10-25-podstawka-model.md`, sekcja „Review runda 2”. Werdykt bez zmian: korpus, rączka i próbka do druku, front po przymiarce PIR.

### Próbka gniazda PIR – wynik (26.10)

Wydrukowana i przymierzona przez użytkownika (zdjęcia `70-budowa/zdjecia/2026-10-26-probka-pir/`, opis w `MANIFEST.md`). Kopułka przechodzi przez otwór, płytka przykręcona 2 × M2 bez gięcia, rozstaw 28,5 potwierdzony. **Front można drukować.** Do wyjaśnienia z użytkownikiem: linia i plamka przy krawędzi otworu (rysa czy ślad druku).

### Założenia do sprawdzenia przez użytkownika

- Ścianka tylna podstawki 18 mm.
- Przednie krawędzie dna, ścianek i płyty są w jednej płaszczyźnie.
- PIR: przymiarka w wydrukowanej próbce gniazda. Jeśli nie pasuje, zmierzyć suwmiarką rozstaw otworów (model 28,5 mm), kołnierz (23 mm) i kopułkę (Ø23 mm).
- W warsztacie: 2 × M2 × 6 i 2 × M4 × 20 imbus (pod łbem potrzeba ≥ 16 mm; M4 × 20 wystaje 4 mm za nakrętką). Łeb musi się zmieścić w gnieździe rączki Ø8 × 4,5 – model zakłada Ø7 × 4.
- Kołnierz soczewki PIR zmierzony suwmiarką: 22,97 (zgodny z gniazdem 23,5). Rozstaw otworów 28,5 według użytkownika; sprawdzi próbka.
- Przewody: ok. 350 mm przewodu do PIR. Kabel USB-C ma mieć ≥ 100 mm luzu przy zamkniętej szufladce. Sprawdzić próbą kilku wysunięć przy założonej płycie.
- Blokada: czy po postawieniu dyni imbus dosięga łba blokady.
- Wysokość podstawki: z wymiarów wychodzi 67 mm, a użytkownik podał 69. Na szufladkę nie wpływa.

## Blokady

Brak w zadaniu szufladki v2.
