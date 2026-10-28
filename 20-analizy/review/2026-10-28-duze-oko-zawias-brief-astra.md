Jesteś recenzentem ADWERSARYJNYM (Astra). Robisz review dużego oka v3 (OpenSCAD) po zmianach z montażu 27–28.10. Przeczytaj AGENTS.md (zasady dla recenzenta, luzy, zasady projektowe). Pracujesz TYLKO DO ODCZYTU: nie zmieniaj repo, nic nie commituj; skrypty i eksporty uruchamiaj w katalogu tymczasowym (np. /tmp/astra-zawias). Odpowiadaj po polsku, zwięźle, liczbami.

## Kontekst: dzisiejsza rozmowa z użytkownikiem (streszczenie agenta, cytaty dosłowne)

Użytkownik składał moduł na ławce. Płyta, gałka i trzpienie kardana są wydrukowane; **płyty i gałki nie będzie przedrukowywał** („plyty i galki nie bede ruszal”). Powieki i tuby przedrukuje („I tak muszę wydrukować jeszcze raz powieki … I mogę jeszcze raz wydrukować potencjalnie tuby”). Składa rano 28.10.

Kolejne problemy wyszły przy montażu, każdy zauważył użytkownik, nie projekt:
1. **Przedłużenie orczyka powieki** miało się kleić CA na zewnętrzną stronę ramienia orczyka MG90S, „położenie ustala otwór na piastę”. Prawdziwy orczyk po tej stronie jest płaski (pierścień piasty wystaje tylko 0,4), więc nic nie ustala położenia: „po drugiej stronie orczyk nie wystaje nic, w co można byłoby włożyć przedłużenie … nie ma nic, co trzyma ramię”. Pomiar użytkownika: ramię 6 przy piaście, 4 na końcu, grubość 2,3 → 2, ramię 14,48 od brzegu piasty, piasta 4,8 wysokości, pierścień 0,4 po płaskiej stronie. Poprawka agenta: rowek z dwiema ściankami 1,2 (luz 0,15 na stronę), otwarty na końcu, i otwory na kołki z drutu Ø1 na 13,5 i 17,5 (jak w v2).
2. **Oś powiek**: w v3 drut Ø2 × 5,6, „w słupku kropla CA”. Użytkownik nie ma drutu Ø2 (lista posiadanych z 24.10: M2 × 6 ×6, M3 × 16 + nakrętka „osie powiek”, M3 × 12, M5 × 16). Agent po kolei proponował: odcięcie łba nierdzewnej M2 × 6 (niewykonalne ręcznie), gwóźdź 2 mm ze sklepu o 23:30, filament 1,75 × 5,6, drut 7 mm (błąd: 0,2 do gałki), 6,5 z klejem. Użytkownik odrzucił zasadę: „montowanie czegokolwiek na krótkim odcinku druta, który ma 6 mm, jest po prostu błędem, jeżeli on nie będzie w żaden sposób zabezpieczony przed wypadaniem z jednej lub drugiej strony”; „Miało być w założeniu, że da się go zmontować ręcznie na ławce, a potem wsadzić w tubę … drut w żaden sposób nie jest blokowany i dopiero będzie blokowany wtedy, kiedy się zablokuje w dyni. To nie jest coś, na co żeśmy się umawiali.” Pyta, czemu nie śruba M2 × 5/6 jako element mocujący.
3. Wcześniej tego dnia: trzpień kardana z rdzeniem M3 × 10 ISO 7380 (zamiast M5 × 8, którego użytkownik nie miał); wydrukowany, wkręty wkręcone, pasowanie na wcisk „trzyma se dosyc mocno”.

Wymagania użytkownika do oceny: moduł kompletny i zablokowany na ławce, przed tubą; nic nie trzyma się tylko na kleju albo na tubie; części, które użytkownik ma (sprawdzić z listą), czynności wykonalne rękami z tolerancją, jaką daje ręka.

## Stan do review (niezacommitowany, worktree tej gałęzi)

Rozwiązanie osi wprowadzone przez agenta (`40-cad/openscad/duze-oko-v3.scad`, parametry `os_wkret_otw`, `os_leb`, `os_szczel_luz`; `powieka(...)`, `tuba(L)`):
- wkręt M2 × 6 z łbem od zewnątrz słupka; luźno w słupku i uchu powieki górnej (Ø2,4); gwint wkręcony w powiekę dolną (otwór Ø1,6 w uchu i czaszy, x 31,0…33,0, ok. 2 mm gwintu); wkręt obraca się z powieką dolną, łeb ślizga się po słupku; koniec 1,2 przed gałką R30;
- tuba 30/40/50: szczeliny 4,6 przez ściankę po x±, od tylnego końca do z = +2,3, na przejście łbów (założony łeb ≤ Ø4 × 2; między słupkiem a tubą 0,95);
- przedłużenie orczyka z rowkiem i kołkami;
- przekrój: `40-cad/openscad/podglad/duze-oko-v3/montaz/zawias-przekroj.png` (+ .scad);
- instrukcja: `40-cad/openscad/duze-oko-v3-montaz.md` (§1, §2, §5 krok 2 i 7), `duze-oko-v3-montaz.html`;
- 3MF: `40-cad/3mf/Duze oko v3/` (Powieka dolna, Tuba 30/40/50, Przedluzenie orczyka, Trzpien kardana M3 …).
Diff: `git diff` w tym worktree. Przemiatanie kolizji po zmianach NIE było uruchamiane (`40-cad/narzedzia/duze-oko-v3-przemiatanie.py`, wyniki poprzednie `przemiatanie-v3.txt`).

## Sprawdź liczbowo

1. **Zawias powiek z M2 × 6**: czy rzeczywiście blokuje oś w obie strony na ławce; luz osiowy obu powiek; czy wkręt obracający się z powieką dolną nie odkręca się / nie zakleszcza powiek (ćwierć obrotu w tył, skok 0,4); wytrzymałość gwintu M2 w ~2 mm PLA (warstwy, kierunek druku powieki krawędzią na stole); ucho górnej obracające się na gwincie. Kolizje: koniec wkrętu–gałka w całym ruchu, łeb–tuba–szczelina przy wsuwaniu i w położeniu pracy, łeb–płyta/żebra słupka, łeb przy obrocie powieki dolnej 0–51,5°.
2. **Szczeliny tuby**: wytrzymałość tuby (ścianka 1,6, szczelina 4,6 na całej długości tylnej części, kołnierz i łapy przecięte?), druk (mostki, nawisy), czy łeb trafia w szczelinę przy wsuwaniu modułu od środka dyni i czy moduł nadal centruje się w tubie.
3. **Alternatywy przy stałej płycie i gałce** (przedrukować wolno powieki i tuby): czy jest rozwiązanie lepsze niż powyższe, z częściami z listy posiadanych (M2 × 6, M3 × 16/12 + nakrętki, M5 × 16, drut sprężynowy Ø1), wykonalne rękami.
4. **Przedłużenie orczyka**: pasowanie rowka wobec pomiaru, kołki Ø1 w otworach orczyka (~0,8), wytrzymałość, czy płaszczyzna otworu drutu (25) i ścianki rowka nie kolidują (szczelina w płycie dla dolnej, serwo, wieżyczka).
5. **Trzpień kardana M3**: zasięg stali, ścianka wokół gwintu, kołnierz w gnieździe.
6. **Instrukcja**: czy kroki 1–9 są wykonalne w tej kolejności rękami, jakie części są wymagane, a których użytkownik nie ma; sprzeczności między md, html, modelem i 3MF.
7. Siatki: sprawdź sam (`40-cad/narzedzia/sprawdz_siatki.js`, `skladowe_siatki.js`).

Format: dla każdej uwagi waga (KRYTYCZNE / WAŻNE / DROBNE), miejsce, scenariusz z liczbami, poprawka albo test, pewność. Posortuj od najpoważniejszego, maks. 15 uwag. Na końcu werdykt jednym zdaniem: czy powieki i tubę można drukować na rano, a jeśli nie, co MINIMALNIE poprawić.
