# Audyt dokumentacji sesji orkiestratora 19–21.10

Audytor: agent Claude, tylko do odczytu repo (poza tym plikiem i `30-projekt/przekazanie-2026-10-21.md`), 21.10 wieczorem.
Materiał: cały wątek orkiestratora (sesja `eb2cdf70`, 19.10 22:11 – 21.10 22:47 czasu lokalnego), czyli tekst wiadomości użytkownika (także wysłanych w trakcie odpowiedzi) i odpowiedzi orkiestratora, bez wyników narzędzi. Do tego stan repo na `c128aa6` (main = origin/main) i drzewo robocze.
Godziny w raporcie są czasem lokalnym (UTC+2).

Wagi jak w review: **KRYTYCZNE** (następny krok pójdzie źle albo test nic nie wykaże), **WAŻNE** (brak albo sprzeczność w dokumencie, który agent czyta przy starcie), **DROBNE**.

## Podsumowanie

| Waga | Liczba | Pozycje |
|---|---|---|
| KRYTYCZNE | 1 | I1 |
| WAŻNE | 13 | D1, D2, J1, T1, T2, T3, T4, T5, E1, E2, E3, P1, G1 |
| DROBNE | 21 | D3–D6, J2, J3, T6–T9, I2–I6, I8, E4–E7, P2 |

Co jest zapisane dobrze (sprawdzone): decyzje 20.10 o `wkladkaD`, rancie i ząbkach, Sankach i Klamrze H, Jarzmie od przodu, Cięgnie na nakrętkach; decyzje 21.10 o dźwigience przy 1500 µs, M3 w uszach SG90, Pokrywie w plastik, piłeczce na śrubach i v2.8 bez testu w dyni. Dziennik ma test elektroniki 19.10, montaż v2.5 (wkładki, piłeczka, Sanki) i montaż oraz kalibrację 21.10. W Parkingu są: wygasanie sesji Onshape, eksport całego zestawu jednym 3MF i koncepcja firmware z zasilaniem. `stan-api.json` ma sumę wywołań w roku (558) i uwagę o zmianie microversion bez zmian modelu (`e5.uwaga`). Instrukcja v2.8 jest zgodna z decyzjami co do M3×10 w uszach, M3×8 w plastik, piłeczki na M3×10, środka 1500 µs, zakresu ±25° i położenia „otwarte V”.

---

## KRYTYCZNE

### I1. Instrukcja, Krok 4: środek serwa „z testera albo `test-serwa`, potem odłącz zasilanie”

- **Co ustalono:** 21.10, 21:06–21:17. Po pierwszym złożeniu środek uciekł (oko na lewym oporze przy 1500 µs). Naprawa polegała na tym, że Ramię z dźwigienką nasadzono na wałek **przy serwie trzymającym 1500 µs** (program `kalibracja`, komenda `1500`), w położeniu „otwarte V”. Decyzja 21.10 w `decyzje.md`: „Dźwigienkę nasadza się na wałek przy serwie na 1500 µs”.
- **Gdzie jest sprzeczność:** `70-budowa/montaz-v2.8.md` (i v2.7), Krok 4, pkt 1: „Ustaw serwo na środek: 1500 µs (tester albo `test-serwa`), potem odłącz zasilanie”. Ramka „Ważne” niżej mówi „przy serwie zasilonym impulsem 1500 µs”. Do tego `test-serwa` trzyma 1500 µs tylko przez 5 s, a potem jedzie ±30° w pętli. Kto nasadzi dźwigienkę przy tym programie, nasadzi ją na ruchomym wałku. To ten sam błąd co 21.10.
- **Skutek w najbliższym kroku:** drugi moduł jest składany do testu 24 h. `test-24h.ino` ma środek 1500 µs na sztywno dla obu kanałów (`srodekUs = 1500`). Komenda `k1 <µs>` działa tylko do restartu, a test liczy restarty. Źle nasadzona dźwigienka oznacza 24 h dociskania oka do ogranicznika.
- **Proponowany tekst (Krok 4, pkt 1, v2.8):**
  > 1. Podłącz serwo do kanału PCA9685, wgraj `50-elektronika/kalibracja` (z `KANAL` ustawionym na ten kanał) i wyślij `1500`. Serwo trzyma środek, dopóki program działa. **Nie używaj `test-serwa`**: po 5 s zaczyna ruch ±30°.
  >
  > 2. Przy zasilonym serwie nasadź dźwigienkę (albo Ramię z dźwigienką) w położeniu „otwarte V” …
- **Do `test-24h.ino` przed startem:** środki z kalibracji wpisać w kodzie dla każdego kanału, np. `oczy[1].srodekUs`, albo potwierdzić, że oba moduły złożono przy 1500 µs.

---

## Decyzje (`30-projekt/decyzje.md`)

### D1. WAŻNE: zasilanie z powerbanku przez USB-C; akumulator 12 V i NiMH odrzucone

- **Co ustalono:**
  - 20.10, 10:43, użytkownik o akumulatorze 12 V: „boję się … dziecko osiem lat … zwarcie akumulatora 12 V wydaje mi się niebezpieczne, a więc raczej nie chciałbym wykorzystywać”.
  - 10:49, wymagania: prezentacja przez kilka dni, zasilanie na kilka dni albo łatwa wymiana i ładowanie; złącze USB-C „mało skomplikowane i całkiem fajne”.
  - 13:01–13:02: orkiestrator odradził ogniwa EBL C 5000 mAh (koszyk, ładowarka, ok. 190 zł, ok. 24 Wh wobec 74 Wh Baseusa); użytkownik: „ok”.
  - Wniosek orkiestratora z 10:49: zakup NiMH nie jest potrzebny, a zapasu szukamy dopiero wtedy, gdy powerbank nie przejdzie testu.
- **Gdzie powinno być:** `decyzje.md`. **Czy jest:** nie. Jest tylko opis w Parkingu (koncepcja firmware).
- **Proponowany wiersz:**
  > | 2026-10-20 | Zasilanie: powerbank (Baseus 20 000 mAh, zapas Manta) przez gniazdo USB-C na obudowie (breakout z 5,1 kΩ na CC) do V+ PCA9685 i 5V ESP, masa wspólna; bez akumulatora 12 V i bez zakupu pakietów NiMH; zapasu szukamy dopiero, gdy powerbank nie przejdzie testu podtrzymania | Wystawa trwa kilka dni, więc źródło trzeba łatwo wymienić; Baseus ma ok. 74 Wh (szacunek 30–40 h przy 0,3–0,4 A), NiMH 2400–5000 mAh daje ok. 1 dzień; 12 V odrzucony przez użytkownika ze względów bezpieczeństwa (dziecko 8 lat) |

### D2. WAŻNE: wiersz o bruzdach mówi 6,8 × 1,05, a w modelu jest 8,3

- **Co ustalono:**
  - 20.10, 11:27 „tak” na poprawki 1–4 po review: kanał wkrętu 1,5 z fazką, `uchoDno` 1,6, luz korpusu SG90 0,7, bruzdy 7,8.
  - 13:42: „Nie chcę drukować na raty, daj mi poprawiony set”. Po tym bruzdy 8,3 i kanał 2,8 po review siatek.
  - Wynik: bruzdy 8,3 mm (x ±4,15), dno walcowe R28,55, z −8,6…−45,7, ścianka ok. 0,90, łeb Ø6,2 z luzem 1,05 na bok.
- **Gdzie powinno być:** `decyzje.md`. **Czy jest:** wiersz 20.10 podaje „bruzdy 6,8 × 1,05” i nie ma kolejnego. Pozostałe wartości są w `weryfikacja-v2.6.md` i `stan-api.json`, ale nie w decyzjach.
- **Proponowany wiersz:**
  > | 2026-10-20 | v2.6 po dwóch review (projekt i siatki), zgoda użytkownika: bruzdy Gniazda 8,3 × 1,05 z dnem walcowym R28,55 (z −8,6…−45,7, ścianka 0,90), `uchoDno` 1,6 (M3×8 nie dobija do dna), luz korpusu SG90 0,7 z przodu i z tyłu; kanał wkrętu 2,8 × 1,5 (usunięty w v2.8) | Review Fable/Astra 20.10: przy przesunięciu i skręcie Kasety łeb ocierał o bok bruzdy 7,3; wkręt M2×6 nie sięgał pełnego otworu; klony SG90 dłuższe niż model. Użytkownik chciał jeden kompletny zestaw do druku |

### D3. DROBNE: v2.8, luz korpusu 0,4 zamiast 0,7

- **Co ustalono:** 21.10, 21:51. Orkiestrator zatwierdził wariant b wykonawcy: `luzKorpusSerwa` 0,7 → 0,4 (blokZ2 49,0, klamraZ1 72,3), żeby ścianki przy otworach Ø2,6 miały 0,95 zamiast 0,65.
- **Czy jest:** tylko w `weryfikacja-v2.8.md` i w instrukcji („serwo w kieszeni 0,4”).
- **Propozycja:** dopisać do wiersza v2.8 (M3 w uszach): „luz korpusu SG90 0,7 → 0,4 z przodu i z tyłu, żeby ścianka przy otworze Ø2,6 miała 0,95”.

### D4. DROBNE: otwory dolne Kasety zostają

- **Co ustalono:** 20.10, 09:07: „zostawmy te recesowe dziurki, bo one się mogą przydać”.
- **Czy jest:** tylko jako dopisek w E4.3 w `teraz.md` („decyzja użytkownika”).
- **Proponowany wiersz:** „| 2026-10-20 | Otwory dolne Kasety (dostęp do przegubów C i H od spodu) zostają, choć napęd skręca się na stole | Mogą się przydać (użytkownik); Fable: przez otwór H da się dokręcić śrubę po nasadzeniu Ramienia |”.

### D5. DROBNE: kalibracja każdego modułu na stole, przed dynią

- **Co ustalono:** 21.10, 21:49: „kalibrację trzeba będzie robić wcześniej, czyli złożę wszystkie ewentualne mechanizmy i je najpierw skalibrujemy”.
- **Czy jest:** E5.4 w `teraz.md`. Wiersza w decyzjach nie ma; wystarczy, jeśli E5.4 zostanie.

### D6. DROBNE: recenzenci Fable i Astra zamiast Opusa i Astry

- **Co ustalono:** 20.10, 09:35, użytkownik: „wrzuć proszę do analizy Fable’owi oraz Astrze”. Wszystkie review 20.10 robili Fable i Astra.
- **Gdzie jest sprzeczność:** `AGENTS.md`, „Role”: „Opus (Anthropic) i Codex / Astra”.
- **Propozycja:** zadać użytkownikowi pytanie (wpis w Parkingu niżej, T4). Bez jego zgody `AGENTS.md` się nie zmienia.

---

## Dziennik (`70-budowa/dziennik.md`)

### J1. WAŻNE: brak wyniku montażu przedniej śruby serwa (powód v2.8)

- **Co ustalono:**
  - 21.10, 21:27: „problem ze śrubą mocującą serwo z przodu. Ta dziura jest za szeroka. Tam to jest kiepsko zamontowane”.
  - 21:28–21:31: śrubę wkładał pęsetą i dokręcał przez okno, więc kanał na wkręcanie wstępne jest zbędny; M2×10 była „chyba za krótka”; nie ma wkrętów samogwintujących; M3 przeszła przez ucho SG90 bez rozwiercania; M2 użył tylko do uszu serwa, wszędzie indziej są M3.
- **Czy jest:** nie. Powód jest tylko w decyzji v2.8.
- **Proponowany wpis (do sekcji 20/21.10):**
  > - Mocowanie serwa v2.7: przednia śruba M2 w otworze Ø2 z kanałem trzyma słabo (otwór za szeroki, M2×10 za krótka). Kanał na wkręcanie wstępne zbędny – śrubę wkłada się pęsetą przez okno. M3 przechodzi przez ucho SG90 bez rozwiercania; poza uszami serwa wszędzie użyte M3 → v2.8 (E5.1).

### J2. DROBNE: v2.8 nie ma wpisu

- **Co ustalono:** 21.10, 21:57–22:25. v2.8 zbudowana (commit `a56bf7b`), eksport sprawdzony (10 brył), do druku tylko Kaseta i Klamra H.
- **Proponowany wpis:**
  > ## 2026-10-21 – v2.8
  > - v2.8 (E5.1, E5.2): uszy SG90 na M3×10 w otworach Ø2,6 × 8 bez kanału, ucha Pokrywy Ø2,6 × 5,6 pod M3×8 w plastik (bez wkładek), luz korpusu 0,4. Eksport `40-cad/3mf/Oko F v2.8/`. Do druku: Kaseta, Klamra H. [wynik wydruku – do uzupełnienia]

### J3. DROBNE: wyniki montażu, o które prosi instrukcja v2.7, nie są zapisane

- Instrukcja v2.7 każe zapisać wynik Kroku 3 (wkręt w kanale), Kroku 6 (nasadzenie Ramienia przy napędzie wsuwanym od przodu) i Kroku 11 (łby w bruzdach). Jest tylko zapis o Kroku 3 (J1).
- Nie wiadomo też:
  - czy w Kasecie v2.6 wtopiono wkładki w gniazda Ø4,4 i jak wyszły (orkiestrator pytał w nocy 20/21.10 o 00:01, 00:16 i 00:20 – bez odpowiedzi; to jedyny sprawdzian decyzji `wkladkaD` 4,4);
  - jakim wiertłem nawiercono bieguny piłeczki (instrukcja v2.8 przyjmuje Ø2,5 jako założenie).
- **Propozycja:** trzy pytania do użytkownika przy najbliższym wpisie w dzienniku. Krok 11 czeka na Gniazdo w dyni.

---

## Agenda (`30-projekt/teraz.md`)

### T1. WAŻNE: bieżące zadanie jest nieaktualne

- **Jest:** „Bieżące zadanie: E3.3 – wnioski z pierwszego modułu v2.7 … decyzja o następnym kroku”.
- **Co ustalono:** od 21.10, 21:31 praca idzie w E5. v2.8 jest zrobiona, a 22:34 użytkownik ustalił kolejność: „usuń pliki, zrób instrukcję, wróćmy, a potem test elektroniczny”.
- **Proponowany tekst:**
  > **Bieżące zadanie:** E5 – instrukcja v2.8 (E5.3, do commita), potem test powerbanku (E5.5) i test 24 h na dwóch modułach (E5.6); w tym czasie wydruk Kasety i Klamry H v2.8 i drugi moduł (E5.7).

### T2. WAŻNE: brak zadań na testy zasilania, test 24 h i drugi moduł

- **Co ustalono:**
  - 21.10, 21:51: „kolejna sprawa to naładowanie power banków. Test utrzymywania powerbanku przy życiu, a także test 24 h ciągłego ruchu serwa, czy się nie wywali”.
  - 21:52: „a może najpierw to przegadamy, zanim zapiszesz”.
  - 22:36: „ja obstawiałem mechanikę”. Ustalony plan z dwoma testami: „tak, przygotuj program do testu 24h”.
  - 22:38: „teoretycznie mogę złożyć z komponentów, które mam, drugi mechanizm”.
- **Czy jest:** nie. Są programy (`test-powerbank` w repo, `test-24h` niezacommitowany), ale zadań w agendzie nie ma.
- **Proponowane wpisy w E5:**
  > - [ ] E5.5 Test podtrzymania powerbanku (`50-elektronika/test-powerbank`, ok. 20–25 min z udziałem użytkownika): Baseus naładowany, ESP zasilany z powerbanku przez USB-C, 1 × SG90 na kanale 0; 7 faz po 3 min (sam ESP; Wi-Fi AP; serwo trzyma; ruch co 10/20/30/60 s); po zgaśnięciu przycisk powerbanku, test idzie od następnej fazy; odczyt z NVS przez port. Wynik: najmniejsze obciążenie, przy którym powerbank nie gaśnie. Przed testem 24 h.
  > - [ ] E5.6 Test 24 h mechaniki (`50-elektronika/test-24h`): dwa moduły na kanałach 0 i 1, zasilacz USB (nie powerbank, chyba że E5.5 wykaże, że trzyma), tryb stale aktywny (ostrzej niż na wystawie). Główne ryzyko według użytkownika: mechanika i serwo, nie elektronika. Po teście: dziennik z NVS (`l`: czas, ruchy, starty, przyczyna restartu), luz oka, drganie na postoju, temperatura serwa, nakrętki przegubów.
  > - [ ] E5.7 Drugi moduł: wydruk Kasety i Klamry H v2.8 (reszta z posiadanych części – do potwierdzenia), montaż według `montaz-v2.8.md`, kalibracja na kanale 1 (dźwigienka przy 1500 µs, „otwarte V”, płynny test ±300 µs); wynik w dzienniku i w tabeli E5.4.

### T3. WAŻNE: Parking bez sprawy kalibracji początkowej

- **Co ustalono:** 21.10, 21:45, użytkownik: „niepokoi mnie trochę kalibracja początkowa”. Orkiestrator wskazał trzy przyczyny z 21.10 i trzy kierunki naprawy. Użytkownik odpowiedział stanowiskiem kalibracji (E5.4); pozostałe kierunki nie zostały nigdzie zapisane.
- **Proponowany wpis w Parkingu:**
  > - Kalibracja początkowa (21.10, poza E5.4): (1) znak „pozycji zero” na Kasecie i Jarzmie do nasadzania dźwigienki; (2) kształt części, który nie pozwala złożyć czworoboku w drugim położeniu (przegub H złożony), albo przynajmniej kontrola na rysunku; (3) firmware: zapisany środek każdego oka (NVS / tabela E5.4) i łagodny rozruch – dziś `oczy-ruch` i `test-24h` po włączeniu skaczą od razu na środek, a SG90 nie zna swojej pozycji.

### T4. WAŻNE: wnioski procesowe z 20–21.10 nie są w Parkingu

Każdy z nich zmienia `AGENTS.md` albo przeczy mu, więc potrzebna jest zgoda użytkownika. Dziś są tylko w rozmowie albo w `stan-api.json`.

- **Proponowany wpis w Parkingu:**
  > - `AGENTS.md` (wnioski 20–21.10, do zatwierdzenia):
  >   (a) microversion zmienia się bez zmian modelu (rozwijanie folderów, Show/Hide, eksport użytkownika) – zadanie wykonawcy zaczyna od jednego `GET /features` jako stanu wyjściowego i porównania z ostatnim odbiorem, w budżecie (`stan-api.json` → `e5.uwaga`); dziś zasada „inna rozbieżność = cudza edycja, stop” zatrzymała wykonawcę 2 razy bez zmiany modelu (20.10 E4.4, 21.10 E5);
  >   (b) przeglądarki sesji nie dzielą profilu – Onshape zalogowany u wykonawcy nie jest zalogowany u orkiestratora; odbiór K2–K4 orkiestrator robi na surowych danych wykonawcy (`odbior-v2.6/`: `features.json` z encjami, `znaczniki-szkicow.json`, `variable-studio.json`);
  >   (c) review Codeksa (Astra) na siatkach trwa > 10 min, więc musi iść w tle, a `AGENTS.md` mówi „codex … nigdy w tle”;
  >   (d) recenzent „Fable” zamiast „Opus” (użytkownik 20.10);
  >   (e) „Źródło prawdy: dokument SimpleEye” → dokument „Oko F v2.5” (zawiera dziś v2.8);
  >   (f) eksport 3MF robi użytkownik ręcznie, całe Part Studio jednym plikiem do `40-cad/`, a kontrola siatek rozdziela bryły (`3mf_do_stl.py --rozdziel`); `AGENTS.md` mówi „eksport przez API, jeden plik na część”.

### T5. WAŻNE: nie zmierzono SG90 od obu dostawców

- **Co ustalono:** 20.10, 11:13 (review Fable, uwaga 3): kieszeń korpusu jest liczona na egzemplarz z modelu, a klony SG90 mają inną długość korpusu i rozstaw uszu. Orkiestrator: „Wieczorem możesz zmierzyć swoje serwo i doprecyzujemy”. Pomiaru nie było. W v2.8 luz spadł do 0,4 (D3), a serwa są od dwóch dostawców (`sprzet.md`) i 10 kolejnych jest w drodze.
- **Proponowany wpis w Parkingu:**
  > - Przed serią modułów zmierzyć SG90 każdego dostawcy (MicroChip, OMEGA_ZONE, nowa dostawa): długość korpusu, odległość oś otworu ucha → czoło korpusu z obu stron, grubość ucha. Kieszeń v2.8 ma 0,4 z każdej strony (`luzKorpusSerwa`).

### T6. DROBNE: nieaktualne statusy i diagram

- Diagram mermaid pokazuje E2.1 jako bieżące i nie ma w nim E4 ani E5. Fable zgłosił to już 20.10 (uwaga 2.4), poprawki nie było.
- E3.1 (instrukcja v2.5) jest nieodhaczone, choć zastąpiła ją instrukcja v2.7/v2.8.
- E3.5: tekst mówi „commit `c7e0350` na gałęzi wykonawcy”, a gałąź jest scalona (`134eba8`). Od v2.8 nie ma żadnych wkładek, więc próbka jest bezprzedmiotowa – do zamknięcia jako „niepotrzebna”.
- E3.3 do zamknięcia albo do połączenia z E5.
- Po zmianie: `python3 30-projekt/teraz_html.py`.

### T7. DROBNE: drobne sprawy bez wpisu w Parkingu

> - Onshape, do ręcznego usunięcia przez użytkownika: „Assembly 1” i BOM w dokumencie „Probka wkladek M3”; „Part Studio 1” w „Probka gwintu 45” (`stan-api.json` → `etap2`).
> - `40-cad/onshape/oko-f-v2.5-build.js` nie zawiera zmian E4/E4.4/E5 (Fable 20.10, uwaga 12).
> - Strzałka GÓRA w Gnieździe 0,5 mm drukuje się jako sufit nad stołem; w następnej wersji 0,8 (Fable, review siatek, uwaga 3).
> - `~/.arduino15` zajmuje 7,7 GB (rdzeń esp32 3.x z toolchainami dla wszystkich układów); odchudzenie z toolchainów Xtensa (19.10).

### T8. DROBNE: zdalne logowanie do Onshape

- **Co ustalono:** 20.10, 12:02–12:37. Agent nie wpisze hasła ani nie skopiuje ciasteczka sesji. Użytkownik zainstalował `wayvnc` i loguje się przez VNC po tunelu SSH (przez Tailscale) do pulpitu, w panelu przeglądarki sesji wykonawcy.
- **Propozycja:** jedna linia w Parkingu przy wpisie o wygasaniu sesji: „Logowanie zdalne: `wayvnc 127.0.0.1 5900` na pulpicie + tunel SSH przez Tailscale, klient VNC na `localhost:5900`; logować się w panelu przeglądarki sesji wykonawcy” (port SSH i adres nie do repo).

### T9. DROBNE: wymagania wystawy w Parkingu

- **Co ustalono:** 20.10, 10:49 (wystawa przez kilka dni, wymiana albo ładowanie bez narzędzi) i 11:03–11:05 (Wi-Fi AP ok. 80–100 mA, sterowanie dużym okiem z telefonu „dla frajdy”, radar „abstrakcyjny”).
- **Czy jest:** w Parkingu jest koncepcja, nie ma wymagania „kilka dni”.
- **Propozycja:** dopisać do wpisu o firmware „wystawa kilka dni po ok. 8 h – zasilanie wymienne bez narzędzi (USB-C)”.

---

## Instrukcje montażu

### I2. DROBNE: `montaz-v2.8.md`, Krok 3 ma numerację 1, 3, 5, 6

Po usunięciu wkręcania wstępnego zostały numery 1, 3, 5, 6. Poprawić na 1–4.

### I3. DROBNE: `montaz-v2.8.md`, „Narzędzia”

- Lista wymienia „lutownica z grotem do wkładek”, a v2.8 nie ma wkładek.
- Lista wymienia „tester serw albo ESP32 z programem `test-serwa`”; powinien być program `kalibracja` (I1).

### I4. DROBNE: `montaz-v2.8.md`, Krok 2, wiertło Ø2,5

Średnica jest założeniem orkiestratora z 21.10, 22:35 („podaj, jakiej użyłeś”). Odpowiedzi nie było. Zapytać użytkownika.

### I5. DROBNE: `montaz-v2.8.md`, „Kluczowe luzy v2.7”

Akapit zawiera już wartości v2.8. Zmienić nagłówek na „v2.8”.

### I6. DROBNE: `montaz-v2.8.md`, „Pozycja zero i kalibracja”, pkt 4

„Środek każdego oka zapisz (`k<nr> <µs>` w `oczy-ruch`)” – komenda działa tylko do restartu. Dopisać: „trwale: tabela `50-elektronika/kalibracja-oczu.md` (E5.4) i stała w programie”.

### I8. DROBNE: `70-budowa/README.md` nie wymienia instrukcji

Brak `montaz-v2.5.md`, `montaz-v2.7.md` (z renderami w `montaz-v2.7/`) i `montaz-v2.8.md` (obrazki z v2.7).

---

## Elektronika (`50-elektronika/`)

### E1. WAŻNE: brak opisu czterech programów i stanowisk testowych

- **Stan:** `README.md` i `polaczenia.md` opisują tylko `blink`, `skan-i2c` i `test-serwa`. Nie ma w nich `kalibracja` (21.10), `oczy-ruch` (21.10), `test-powerbank` (20.10) ani `test-24h` (21.10, niezacommitowany).
- **Proponowany tekst do `polaczenia.md`, sekcja „Szkice”:**
  > - `kalibracja/`: kanał w stałej `KANAL` (0 = pierwszy moduł; dla drugiego zmienić na 1). Po włączeniu serwo **bez impulsu**. Komendy (115200): liczba = impuls w µs, `+`/`-` ±10, `++`/`--` ±50, `g <cel> <ms>` płynny ruch, `?` stan, `off` bez impulsu. Po `off` albo ręcznym przesunięciu oka następny `g` startuje od ostatniego zadanego impulsu, więc serwo skacze. Sterowanie z terminala: `newgrp uucp`, potem `arduino-cli monitor -p /dev/ttyACM0 -c baudrate=115200`. Monitor zajmuje port – przed wgrywaniem zamknij go (Ctrl+C).
  > - `oczy-ruch/`: ruch oczu (sakada ze smoothstep, fiksacja 0,4–1,8 s aktywnie / 1,5–6 s w spoczynku, najwyżej 2 naraz), zakres ±25° serwa (±278 µs) wokół `srodekUs` 1500; `N_OCZU` 1; czujnik na `PIN_CZUJNIK` (−1 = brak). Komendy: `a` aktywny, `s` spoczynek, `c` stop na środku, `r` wznów, `k<nr> <µs>` środek oka (do restartu).
  > - `test-powerbank/`: 7 faz po 3 min, zapis w NVS co 5 s; po zaniku zasilania następne włączenie zaczyna od następnej fazy. Przed testem: podłącz do komputera, w ciągu 3 s otwórz monitor, `r` + Enter kasuje stare przebiegi. Test: ESP zasilany z powerbanku kablem USB-C, serwo na kanale 0 (V+ z pinu 5V). Odczyt: monitor w ciągu 3 s od podłączenia do komputera; bez monitora płytka zacznie nowy przebieg, ale stare zapisy zostają.
  > - `test-24h/`: `oczy-ruch` stale aktywny na kanałach 0 i 1, dziennik w NVS co 60 s (czas pracy, ruchy, starty, przyczyna restartu: 1 zasilanie, 9 brownout, 4–7 watchdog/panika). Przed startem `z`, po teście `l`. Środki obu kanałów to 1500 µs w kodzie (patrz audyt I1). Zawieszenie bez restartu widać jako czas pracy krótszy niż czas testu (watchdog nie jest włączony).
- **Do `README.md`:** dopisać te cztery katalogi.

### E2. WAŻNE: `polaczenia.md` mówi „V+ z 5V tylko przy jednym serwie”, a test 24 h ma dwa serwa

- **Co ustalono:** 20.10, 10:47, orkiestrator: z pinu 5V „jedno lub dwa serwa: tak”, kilkanaście – nie. Test 24 h (21.10) idzie na dwóch serwach z zasilacza USB.
- **Propozycja:** w tabeli przewód 5 zmienić na „zasilanie serw z USB płytki – najwyżej 2 × SG90; więcej serw: osobne 5 V na V+ (gniazdo USB-C z powerbanku), masa wspólna, kondensator 470–1000 µF przy PCA9685; nie zasilać ESP jednocześnie z USB komputera i z pinu 5V”.

### E3. WAŻNE: `sprzet.md` nie zna decyzji o zasilaniu

- **Co ustalono:** 20.10, 10:49: gniazdo USB-C (breakout) z rezystorami 5,1 kΩ na CC – „bez nich powerbank z USB-C może nie podać napięcia”. Pytanie „Masz w warsztacie gniazda USB-C breakout?” zostało bez odpowiedzi.
- **Stan:** w „Brakuje” jest „Kabel USB → zaciski … port 1 → Nano, port 2 → serwa” (Nano już nie jest kontrolerem).
- **Propozycja:** zamienić ten wiersz na
  > | Gniazdo USB-C (breakout) z 5,1 kΩ na CC1/CC2 + przewody do V+ i 5V | Zasilanie z powerbanku, wymiana bez narzędzi (decyzja 20.10) – **sprawdzić, czy jest w warsztacie** | 1 |
  
  i dopisać przy powerbankach „przed wystawą: test podtrzymania (E5.5)”.

### E4. DROBNE: `sprzet.md`, inne nieaktualne wiersze

- Wkładki: „M3×4×5 w modelu: gniazdo `wkladkaD` 4,4” – od v2.8 model nie ma żadnych wkładek.
- PCA9685: „Nano wysyła tylko komendy” → ESP32-C3.
- Brak drobnicy, której instrukcja v2.8 wymaga: wkręty M2×6 (dźwigienka, wkręt środkowy), nakrętki samohamujące M3 i podkładki M3 (użyte 21.10, więc są w warsztacie).
- Serwa SG90 są od dwóch dostawców – odesłanie do pomiaru (T5).

### E5. DROBNE: analiza zasilania z 17.10 bez uzupełnienia z 20.10

`20-analizy/2026-10-17-zasilanie-powerbank.md` liczy dla Nano i 10 000 mAh. Proponowana sekcja „Uzupełnienie 20.10”:
- ESP32-C3 ok. 20 mA bez Wi-Fi, 80–100 mA w trybie AP (dane katalogowe, nie pomiar);
- 1 serwo prawie stale w ruchu daje ok. 0,3–0,4 A;
- Baseus 20 000 mAh (ok. 74 Wh) wystarcza na ok. 30–40 h (szacunek);
- auto-wyłączenie powerbanku poniżej ok. 50–100 mA sprawdza test E5.5;
- gniazdo USB-C wymaga 5,1 kΩ na CC;
- porównanie z NiMH 4,8 V 2400 mAh (ok. 1 dzień) i 4 × C 5000 mAh (ok. 24 Wh, koszyk i ładowarka, ok. 190 zł);
- 12 V odrzucony.
Wniosek → wiersz D1.

### E6. DROBNE: `10-inspiracje/README.md` nie wymienia `servo-pumpkin-pythoncader*`

Analizę kodu ServoPumpkin dodano 21.10. Dopisać linię.

### E7. DROBNE: start programów ruchu bez łagodnego rozruchu

`oczy-ruch` i `test-24h` w `setup()` od razu wysyłają środek (`ustaw(i)`). Przy module złożonym przy 1500 µs to mały skok, przy źle złożonym – szarpnięcie, które użytkownik skrytykował 21.10 o 20:21. Na teraz bez zmiany kodu; kierunek jest w T3 (3).

---

## Stan projektu i README

### P1. WAŻNE: `30-projekt/stan-projektu.md` jest z 18.10

`AGENTS.md` każe go czytać na starcie („Najpierw przeczytaj”, pkt 3). Plik opisuje v2.5 „do zrobienia”, SolidCraft, sesje z Kobyłki i SimpleEye jako źródło prawdy. Nowy orkiestrator dostanie fałszywy obraz.
- **Propozycja:** zastąpić treść krótkim stanem na 21.10 (wersje v2.5–v2.8, co wydrukowane, co działa, wykonawca) albo odesłaniem do `przekazanie-2026-10-21.md`. Zaktualizować opis w `30-projekt/README.md`.

### P2. DROBNE: `40-cad/README.md` nie opisuje eksportów v2.5–v2.8

Brakuje opisu `3mf/Oko F v2.5…v2.8/`, plików `… - FullProject.3mf` (do druku, import jako geometria) i pojedynczych plików (do kontroli siatek). Brakuje też informacji, że dokument Onshape „Oko F v2.5” zawiera dziś stan v2.8 (nazwana wersja Onshape „v2.5” = stan z 19.10).

---

## Niezacommitowane (`git status`)

### G1. WAŻNE: dwa pliki poza repo

| Plik | Co to | Do repo? |
|---|---|---|
| `70-budowa/montaz-v2.8.md` | instrukcja v2.8 (E5.3), napisana 21.10 o 22:35 | tak, po poprawkach I1–I6 |
| `50-elektronika/test-24h/test-24h.ino` | program testu 24 h (E5.6), kompiluje się | tak, razem z opisem E1 |

Poza tym:
- `main` = `origin/main` (`c128aa6`);
- worktree wykonawcy jest czysty, a gałąź `claude/heuristic-brattain-6e5ce2` (`a56bf7b`) jest scalona z `main`;
- cztery luźne eksporty z `40-cad/` zostały 21.10 przeniesione do kosza, nie usunięte na stałe – zostają do decyzji użytkownika;
- `00-inbox/` ma tylko README.

---

## Kolejność poprawek (propozycja)

1. I1 (Krok 4 i środki w `test-24h`) – przed złożeniem drugiego modułu.
2. G1 + E1 + E2 + I2–I6 – jeden commit „E5.3 instrukcja v2.8, test 24 h, opis programów”.
3. T1, T2, T3, T4, T5, T6 (+ `teraz_html.py`), D1, D2, D3, J1, J2 – drugi commit „agenda, decyzje, dziennik po 19–21.10”.
4. P1, E3–E6, P2, I8, T7–T9, D4 – porządki, mogą iść z punktem 3.
