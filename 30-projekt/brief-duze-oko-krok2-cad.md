# Zlecenie: duże oko – krok 2, szczegóły i CAD (noc 24/25.10)

**Rola:** projektant dużego oka (ten sam co w kroku 1). Wymagania **tylko** z `30-projekt/PRD.md`. Nie dopisujesz funkcji.

**Podstawa:** Twoja koncepcja `20-analizy/2026-10-24-duze-oko-koncepcja-wstepna.md` (zaakceptowana: moduł od środka, łapy pod wkręty, maskownica) i raport krytyka `20-analizy/review/2026-10-24-koncepcja-duze-oko-krytyk.md`.

## Praca nocna – użytkownik śpi (zasady od użytkownika 24.10)

- **Praca nie staje.** Nie kończysz tury, żeby czekać na użytkownika. Rano użytkownik ma dostać gotowy wynik, a nie pytania o wymiary.
- **Brak danych = najlepszy szacunek jako zmienna** (źródło: karta, zdjęcie, typowa wartość), zapisany na liście założeń. Pracujesz dalej.
- **Każdy nowy pomysł i każda wątpliwość co do funkcji → PM** (sesja, od której dostałeś to zlecenie; odpowiadasz na adres `from` jego wiadomości przez SendMessage). Wysyłasz i pracujesz dalej nad tym, co od odpowiedzi nie zależy.
- **Astra (Codex) = krytyczny architekt.** Review robisz przez Astrę, nie przez sesje Claude: `timeout 3600 codex exec --sandbox read-only -C . -o <raport.md> "$(cat <brief.md>)" < /dev/null` w tle. Brief dla Astry krótki: PRD, co ocenia, zasada „nie dopisuj funkcji, propozycje osobno”, format KRYTYCZNE/WAŻNE/DROBNE z liczbami. Uwagi techniczne rozstrzygasz z Astrą; spór albo zmiana funkcji → PM.
- **Decyzje uprzednio zatwierdzone przez użytkownika:**
  - jeśli wariant A (obie powieki ruchome na jednym serwie) się nie mieści → **wariant B: dolna powieka nieruchoma** (część Pierścienia albo przykręcana), nadal 3 serwa. Wariantu C (4 serwa) nie wybierasz;
  - wkręty do drewna 4 × 30–40 są – łapy pod nie;
  - MG90S mają fabryczne wkręty do uszu – mocowanie serw nimi;
  - **niskich M3 (ISO 7380) nie ma**; M3 użytkownika mają łby krzyżakowe ok. Ø5,5–6 × 2,45.
- Inne zmiany funkcji: nie wprowadzasz. Zapisujesz w raporcie nocnym jako „do decyzji rano” i idziesz wariantem najbliższym PRD.
- **Commit i push na `main` po każdym kamieniu milowym** (zgoda użytkownika na noc), `git add` po nazwach plików, `git pull` przed commitem.

## Sesja Onshape

- Użytkownik loguje Cię przed snem w panelu przeglądarki Twojej sesji.
- **Podtrzymujesz sesję:** co ok. 10 min akcja w interfejsie karty Onshape (kliknięcie w drzewo, przewinięcie, przełączenie zakładki) – **bez wywołań REST**, żeby nie zużywać limitów. Także wtedy, gdy czekasz na Astrę.
- Jeśli sesja mimo to wygaśnie: zapisz to w raporcie nocnym, rób dalej wszystko, co nie wymaga Onshape (rysunek drutów, instrukcja, plan części), i daj znać PM.
- Limity API z `AGENTS.md` („Praca z API Onshape”) obowiązują w całości: jedno żądanie naraz, `GET /features` raz na sesję, przy 429 / 402 stop pracy w Onshape.

## Poprawki krytyka (obowiązkowe)

- **K1:** otwór klepsydrowy w żebrach gałki (przewężenie Ø1,2 × 0,4, stożki po 40°, ogon Z ≤ 2 mm).
- **K2, W1:** orczyki – lewo–prawo na otworze 15,5 albo 17,5, góra–dół na 13,5; przelicz kąty.
- **W2:** otwór orczyka powiek Ø2,1 na oba druty.
- **W3:** stos w osi powiek jako zmienne, z łbami, które użytkownik ma. Nie mieści się A → wariant B (wyżej).
- **W4:** w Gałce żebra V 45° zamiast wiszącego słupka. **W5:** piasta kardana montowana na stole, gniazdo T. **W6:** noga słupka Uchwytu jako zastrzał ≤ 45°. **W7:** ramiona na Uchwycie serw, Pierścień płasko.
- **D1–D9** według raportu (m.in. luz między powiekami ≥ 0,5, otwory na drut rozwiercane po druku).
- Długość tuby Pierścienia jako jedna zmienna (dyni jeszcze nie ma) – domyślnie pod ściankę 40 mm.

## Kolejność i kamienie milowe

1. **Próbka końcówki drutu** (wycinek żebra z otworem klepsydrowym + fragment orczyka, ok. 20 min druku) – w CAD jako pierwsza część, w eksporcie osobno. Użytkownik sprawdzi ją rano; dalej idziesz bez czekania.
2. **Przed CAD:** krótki plan szczegółów (stos osi powiek, orczyki, kąty, główne zmienne) → **Astra**, poprawki.
3. **CAD w Onshape**, nowy dokument „Duże oko v2” w folderze Halloween („Duże oko v1” nie ruszasz). Każda część osobnym Part z czytelną nazwą (Gałka, Powieka górna, Powieka dolna, Pierścień, Uchwyt serw, Maskownica, Próbka drutu), natywne operacje „Część: co robi”, parametry w Variable Studio. Bez rund K1–K11 i przemiatania; kolizje w zakresie ruchu sprawdzasz sam (Assembly albo siatki) i podajesz najmniejsze odstępy. Części ≤ 180 mm (A1 mini), płaska strona na stół, podpory tylko opisane.
4. **Eksport 3MF** do `40-cad/3mf/Duze oko v2/` (użytkownik zgodził się 23.10 na eksport przez agenta; jeśli API nie pozwala – instrukcja jednego kliknięcia na rano) i `40-cad/narzedzia/sprawdz_siatki.js` (szczelność, liczba brył = model).
5. **Astra – review na siatkach** (kolizje, druk, montaż). Poprawki, ponowny eksport.
6. **Druty:** średnica, długości, kąty + **rysunek 1:1 do druku** (SVG/PDF) do gięcia w imadle.
7. **Instrukcja montażu i kalibracji** (krótko: kolejność, orczyki przy 1500 µs, druty, wkładanie do dyni) + README druku (orientacja, podpory, co drukować najpierw).

## Raport nocny

`30-projekt/raport-nocny-2026-10-25.md`, aktualizowany przy każdym kamieniu: co zrobione (z commitami), założenia przyjęte bez użytkownika, rozstrzygnięcia z Astrą, „do decyzji rano” (najwyżej kilka punktów, każdy z Twoją propozycją), co wydrukować najpierw.
