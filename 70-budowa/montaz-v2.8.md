# Montaż modułu małego oka v2.8

Instrukcja do składania we dwóch: rodzic i syn. Oko to piłeczka pingpongowa, którą serwo obraca w lewo i w prawo. Cały mechanizm siedzi w jednej obudowie (Kasecie), którą wpina się od środka w otwór w dyni.

**Co nowego w v2.8 wobec v2.7** (po montażu 21.10):
- uszy serwa przykręcasz **śrubami M3×10** (zamiast M2), bez wkręcania wstępnego – śrubę wkładasz pęsetą i dokręcasz przez okno,
- Pokrywę przykręcasz **M3×8 wprost w plastik** – w Kasecie nie ma już wkładek, nie potrzebujesz lutownicy,
- piłeczka siedzi na **dwóch śrubach M3×10 w nawierconych biegunach** + cyjanoakryl z primerem.

Obrazki pochodzą z v2.7; różnice (otwór zamiast kanału w bloku, ucha bez wkładek) są małe i opisane w tekście.

**Stan 25.10 – seria (M1):** moduły składasz z **Jarzmem obróconym o 180°** względem obrazków v2.7: korba i przegub H po przeciwnej stronie, Ramię w lewo (decyzja 24.10 przy kalibracji z programistą, `30-projekt/decyzje.md`). Kroki 4–6 i „Pozycja zero” są niżej opisane już w tym ułożeniu; obrazki 04–07 i rysunek pozycji zero pokazują ułożenie dawne – czytaj je w lustrze lewo–prawo. *Do potwierdzenia przez użytkownika:* decyzja mówi „Ramię w lewo” bez punktu patrzenia; instrukcja przyjmuje „patrząc od tyłu Kasety” (korba z prawej, H z lewej) – porównaj z modułami 1–3. Wszystkie małe oczy mają wspólną kalibrację **1500 / 1100 / 1800 µs** (`50-elektronika/kalibracja-oczu.md`). Lista kontrolna na całą serię: „Seria modułów” na końcu.

**Co nowego wobec v2.5** (po montażu 20.10, `70-budowa/dziennik.md`):
- serwo trzyma blok w Kasecie (wkręt przez okno) i nowa **Klamra H** z tyłu – **Sanek już nie ma**,
- Cięgno bez wkładek: przeguby na **śrubie M3×12, podkładce i nakrętce samohamującej**,
- **napęd skręcasz na stole** i wsuwasz od przodu Kasety, w rurze tylko nasadzasz Ramię,
- Gniazdo z mniejszym rantem (Ø67,5) i bruzdami na łby śrub osi oka,
- ucha Pokrywy są w środku Kasety, Pokrywa to płaski krążek z dwoma otworami.

## Części

### Do druku

![Części drukowane](montaz-v2.7/galeria_drukowane.png)

Plik: `40-cad/3mf/Oko F v2.8/Oko F v2.8 - FullProject.3mf` – cały zestaw w jednym pliku. **Importuj go w Bambu Studio jako geometrię**; pojedyncze 3MF z archiwum Onshape wieszają Bambu. Części są w pozycji złożonej, obróć je tak jak w kolumnie „Na stół”. Wszystko bez podpór.

| Nazwa | Szt. | Na stół | Zmiana wobec v2.5 |
|---|---|---|---|
| Gniazdo | 1 | rantem (strzałka GÓRA na stole) | rant Ø67,5, ząbki przy ściance, bruzdy na łby |
| Nakrętka | 1 | tyłem (wycięcia na klucz) | bez zmian |
| Kaseta | 1 | czołem (rura pionowo) | blok i okno na wkręt serwa, ucha Pokrywy w środku |
| Klamra H | 1 | profilem H, tylną płaską stroną | nowa |
| Jarzmo z miską | 1 | płaskim bokiem miski bez korby, z brimem | bez zmian |
| Ramię orczyka | 1 | wierzchem (kieszeń na dźwigienkę do góry) | bez zmian |
| Cięgno | 1 | płytą, **nie odwracać** | bez piast, przelotowe otwory Ø3,3 |
| Tulejka korby, Tulejka ramienia | 1 + 1 | kołnierzem | bez zmian |
| Pokrywa tylna | 1 | płasko | krążek z 2 otworami |
| Przyrząd do klejenia (v2.4) | 1 na komplet | dnem z okienkiem | bez zmian (`40-cad/3mf/Oko F v2.4/`) |

Przyrząd do centrowania z v2.4 **nie pasuje** do v2.7 (otwór przegubu Ramienia jest zajęty przez tulejkę) – środek ustawiasz dźwigienką na wałku (Krok 4).

### Kupne

![Części kupne](montaz-v2.7/galeria_kupne.png)

- serwo SG90 z dźwigienką jednoramienną,
- piłeczka pingpongowa 40 mm,
- klej: **cyjanoakryl z primerem** (sprawdzony 20.10) albo akryl 2K.

### Śruby i drobne części

| Nazwa | Szt. | Do czego |
|---|---|---|
| **M3×12 imbusowa** | 2 | przeguby C i H (od spodu, przez tulejkę) |
| **podkładka M3** (Ø7) | 2 | pod nakrętki przegubów (przy H tylko jedna) |
| **nakrętka samohamująca M3** (z nylonem), klucz 5,5 | 2 | przeguby C i H |
| **M3×8 imbusowa** | 2 | Pokrywa, wkręcana wprost w plastik uch Kasety |
| **M3×10** (łeb najwyżej 2,75 mm) | 2 | oś oka: przez występ Kasety i oczko Jarzma w nawiercony biegun piłeczki |
| **M3×10 imbusowa** | 2 | uszy serwa: tylne do Klamry H, przednie do bloku Kasety |
| **M2×6** krzyżakowy | 2 | dźwigienka do Ramienia, wkręt środkowy w wałek (jedyne M2 w module) |

Wkrętów z torebki serwa nie używaj. Śruby z wysokim walcowym łbem (DIN 912, 3 mm) nie nadają się na oś oka – nie przejdą przez bruzdy Gniazda.

## Uważaj

1. **Śruby M3 w plastik** (uszy serwa, Pokrywa) wkręcaj z wyczuciem, do oporu łba – gwint w plastiku łatwo zerwać.
2. **Pierwsze wkręcenie** w świeży otwór Ø2,6 idzie ciężko: wkręć, wykręć i wkręć ponownie.
3. **Przegub H: jedna podkładka**, nie dwie – inaczej nakrętka zbliża się do ścianki Kasety przy skrajnym ruchu oka.
4. **Cięgno drukuj i montuj płytą do dołu**; nakrętki są na górze Cięgna, łby śrub od spodu.
5. **Nie kręć okiem ręką, gdy serwo jest podłączone.** Gdy serwo pracuje, palce z dala od Ramienia i Cięgna.

## Bezpieczeństwo

- **Klej (Krok 2) – tylko rodzic.** Rękawiczki, otwarte okno.
- **Otwornica w dyni (Krok 9) – tylko rodzic.**

## Zanim zaczniesz

![Kaseta złożona: piłeczka i Jarzmo z przodu, napęd w środku, serwo z Klamrą H na dole, Pokrywa z tyłu](montaz-v2.7/00_kaseta_zlozona.png)

**Kierunki.** „Od tyłu” = od strony Pokrywy (środek dyni). „Od przodu” = od strony piłeczki. „Od spodu” = od strony serwa. „Góra” = strzałka GÓRA i okno w Kasecie.

**Narzędzia:** imbus 2,0 i długi imbus 2,5, klucz płaski 5,5 (nakrętki), wkrętak krzyżakowy PH0/PH1 długi (przez okno Kasety), pęseta, obcinaczki (dźwigienka), ESP32 + PCA9685 z programem `50-elektronika/kalibracja` (środek 1500 µs, Krok 4), **wiertło Ø3,2** do biegunów piłeczki (Krok 2), otwornica 2½", suwmiarka, nożyk, marker (numer modułu).

## Części i ich miejsca

![Kaseta od tyłu](montaz-v2.7/czesc_kaseta_tyl.png)

![Kaseta w środku: blok na przednie ucho serwa](montaz-v2.7/czesc_kaseta_blok.png)

![Kaseta od spodu](montaz-v2.7/czesc_kaseta_spod.png)

![Klamra H](montaz-v2.7/czesc_klamra.png)

![Serwo i dźwigienka](montaz-v2.7/czesc_serwo.png)

![Jarzmo](montaz-v2.7/czesc_jarzmo.png)

![Ramię](montaz-v2.7/czesc_ramie.png)

![Cięgno](montaz-v2.7/czesc_ciegno.png)

![Tulejka](montaz-v2.7/czesc_tulejka.png)

![Pokrywa](montaz-v2.7/czesc_pokrywa.png)

![Gniazdo](montaz-v2.7/czesc_gniazdo.png)

![Nakrętka](montaz-v2.7/czesc_nakretka.png)

![Przyrząd do klejenia](montaz-v2.7/czesc_przyrzad_klejenia.png)

![Widelec](montaz-v2.7/czesc_widelec.png)

## Krok 1. Nagwintuj otwory w Kasecie i Klamrze (rodzic)

1. Wkręć na sucho M3×8 w oba ucha Pokrywy w środku Kasety (od tyłu) i wykręć.
2. Wkręć na sucho M3×10 w otwór bloku przedniego (od góry, przez okno) i w otwór Klamry H, i wykręć.

**Sprawdź:** śruby wchodzą prosto, plastik wokół otworów nie pęka.

## Krok 2. Wklej piłeczkę w Jarzmo (rodzic)

![Klejenie piłeczki](montaz-v2.7/02_klejenie_pileczki.png)

Jak w v2.5: źrenica, piłeczka w przyrządzie, klej na pas miski z dala od oczek i otworów osi, Jarzmo oczkami na słupki przyrządu, śruby M3×10 przyrządu. **Klej:** cyjanoakryl z primerem (20.10 trzymał; klej modelarski nie trzymał). Po związaniu kleju **nawierć bieguny piłeczki wiertłem Ø3,2** przez otwory oczek Jarzma (oczka Ø3,3 prowadzą wiertło). Wierć ręcznie albo wkrętarką na najniższych obrotach, tylko przez ściankę piłeczki (ok. 0,4 mm), bez docisku – nie wbijaj wiertła w głąb piłeczki. W te otwory pójdą końce śrub osi oka M3×10 (Krok 6).

> **Skąd Ø3,2:** śruba osi wkręca się w występ Kasety (Ø2,6), a w oczku Jarzma i w piłeczce pracuje jako czop (oczko Ø3,3 – luźny otwór M3 z tabeli luzów w `AGENTS.md`). Ścianka piłeczki ma ok. 0,4 mm i gwint w niej nie trzyma (`20-analizy/2026-10-17-mocowanie-pileczki-sruby.md`, wariant P1: otwory Ø3,2 na biegunach). Piłeczkę trzyma klej w misce, nie śruby. Mniejsze wiertło (np. Ø2,5) sprawi, że M3 wcina się w celuloid i może go pęknąć. Moduły już nawiercone mniejszym wiertłem, które działają, zostaw bez zmian.

**Sprawdź:** oczka przylegają do słupków, kołki i otwory osi czyste.

## Krok 3. Serwo z Klamrą H do Kasety (może zrobić syn)

![Serwo z Klamrą H wsuwane od tyłu](montaz-v2.7/03_serwo_klamra.png)

1. Na stole przykręć **Klamrę H** do **tylnego ucha** serwa (strona wałka i kabla) śrubą **M3×10**. Wewnętrzne ramię Klamry leży pod tylnym uchem (w środku Kasety). Zewnętrzne obejmuje ściankę Kasety od spodu, za korpusem serwa; kabel serwa przechodzi pod nim.
2. Wsuń serwo od tyłu Kasety: korpus w szczelinę w spodzie, łącznik Klamry w tę samą szczelinę, ściana Kasety między ramionami Klamry. Wałek i kabel z tyłu, kabel wychodzi pod Klamrą na zewnątrz.
3. Pchaj, aż przednie ucho oprze się na bloku, a tył Klamry zrówna się z tylną krawędzią Kasety.
4. Włóż pęsetą śrubę **M3×10** przez okno w górnej ściance w przednie ucho i dokręć ją długim imbusem prosto w dół (rura jest jeszcze pusta).

![Przedni wkręt przez okno](montaz-v2.7/03b_wkret_przedni.png)

**Sprawdź:** serwo nie kiwa się do środka ani na zewnątrz, Klamra nie wystaje za tył Kasety.

## Krok 4. Dźwigienka na wałek, środek serwa (rodzic)

![Dźwigienka na wałek, wkręt środkowy](montaz-v2.7/04_dzwigienka.png)

1. Podłącz serwo do kanału PCA9685 (ESP32 + PCA9685 jak w `50-elektronika/polaczenia.md`), wgraj `50-elektronika/kalibracja` z `KANAL` ustawionym na ten kanał, otwórz monitor portu i wyślij `1500`. Serwo trzyma 1500 µs, dopóki program działa. **Nie odłączaj zasilania i nie wysyłaj `off` przez cały czas nasadzania**, aż do końca Kroku 7 (dźwigienka i Ramię przykręcone). **Nie używaj `test-serwa`**: trzyma środek tylko 5 s, potem jedzie ±30° w pętli.
2. Dźwigienkę przyłóż do kieszeni od spodu Ramienia; jeśli dłuższa niż kieszeń, przytnij obcinaczkami.
3. Przy serwie trzymającym 1500 µs nasadź dźwigienkę na **goły wałek** tak, żeby wskazywała **do przodu, ok. 20° w lewo** (patrząc od tyłu Kasety) – w stronę, gdzie stanie przegub H Ramienia. To daje położenie „otwarte V, przegub H po lewej, patrząc od tyłu” (rysunek w „Pozycja zero i kalibracja” w lustrze). Wałka nie obracaj ręką.
4. Wkręć wkręt środkowy M2×6 przez okno w wałek. Serwo dalej trzyma 1500 µs.

**Sprawdź:** dźwigienka siedzi bez luzu i wskazuje do przodu, ok. 20° w lewo; mały błąd środka poprawi później kalibracja w ESP32.

> **Ważne (montaż 21.10):** dźwigienkę (a przy ponownym nasadzaniu Ramię z dźwigienką) nasadzaj na **goły wałek przy serwie trzymającym 1500 µs z programu `kalibracja`** (komenda `1500`, zasilanie przez cały czas nasadzania), w położeniu z „Pozycja zero i kalibracja”: otwarte „V” Ramienia i Cięgna z przegubem H po lewej (patrząc od tyłu; rysunek w lustrze). Czworobok da się złożyć na dwa sposoby; w drugim przegub H się składa, Ramię kładzie się na Cięgnie i serwo blokuje mechanizm. Jeśli po złożeniu środek wypada daleko od 1500 µs albo ruch w jedną stronę jest krótki – wyślij `1500`, zdejmij Ramię z wałka (wkręt środkowy przez okno) i nasadź ponownie według tej zasady.

## Krok 5. Skręć napęd na stole (może zrobić syn, nakrętki rodzic)

![Napęd skręcany na stole: śruby z tulejkami od spodu, Cięgno, podkładki i nakrętki od góry](montaz-v2.7/05_naped_na_stole.png)

1. Weź Jarzmo z piłeczką, Cięgno, Ramię i obie tulejki.
2. **Przegub C (korba):** M3×12 od spodu → Tulejka korby kołnierzem do łba → otwór korby Jarzma → otwór C w Cięgnie (płytą do korby) → podkładka → nakrętka samohamująca.
3. **Przegub H (Ramię):** tak samo, M3×12 → Tulejka ramienia → otwór H Ramienia (kieszeń dźwigienki do dołu, od strony serwa) → otwór H w Cięgnie → **jedna** podkładka → nakrętka.
4. Dokręć obie nakrętki kluczem 5,5, trzymając łeb imbusem 2,5, do oporu: tulejka zaciska się na Cięgnie.

**Sprawdź:** korba i Ramię obracają się lekko na tulejkach, Cięgno jest płaskie (nie wygina się), śruba wystaje nad nakrętką 1–1,5 mm.

## Krok 6. Wsuń napęd od przodu Kasety (rodzic)

![Napęd wsuwany od przodu, śruby osi oka](montaz-v2.7/06_naped_do_kasety.png)

1. Oko na wprost: źrenica do przodu, oczka u góry i u dołu, korba do tyłu. Patrząc w tył Kasety, korba i pas miski są **po prawej** (Jarzmo obrócone o 180° wobec obrazka 06; decyzja 24.10).
2. Wsuń Jarzmo od przodu Kasety, lekko przechylone, aż kołki ograniczników wejdą w łukowe szczeliny wokół osi oka. Ramię i Cięgno jadą przodem w głąb rury.
3. Przy końcu opuść Ramię **kieszenią na dźwigienkę** na wałku (serwo wciąż trzyma 1500 µs z Kroku 4). Mechanizm w położeniu „otwarte V”, przegub H po lewej (patrząc od tyłu); dźwigienki nie obracaj.
4. Wkręć śruby osi oka M3×10 od góry i od dołu, przez występy i oczka w nawiercone bieguny piłeczki, łby w zagłębieniach; bez dociągania.

> **Niesprawdzone:** czy skręcony napęd daje się unieść o ok. 1,6 mm, żeby kieszeń Ramienia weszła na dźwigienkę (Fable szacuje ok. 1,7 mm z luzów przegubów). Jeśli nie wchodzi, poluzuj nakrętkę przegubu H o pół obrotu, nasadź Ramię i dokręć. Wynik zapisz w dzienniku.

**Sprawdź:** oko obraca się ręką lekko do oporu w obie strony (±33°), łby osi nie wystają ponad Kasetę więcej niż 2,75 mm.

## Krok 7. Ramię do dźwigienki (rodzic)

![Wkręt Ramienia przez okno](montaz-v2.7/07_wkret_ramienia.png)

1. Przez okno w górnej ściance wkręć M2×6 przez otwór w Ramieniu (13 mm od wałka) w dźwigienkę.

**Sprawdź:** Ramię siedzi na dźwigience bez luzu; przy płynnym ruchu z programu `kalibracja` (`g 1350 4000`, `g 1650 6000`, `g 1500 4000`) przeguby się nie zacinają, nakrętki nie ocierają o Kasetę.

## Krok 8. Pokrywa (może zrobić syn)

![Pokrywa](montaz-v2.7/08_pokrywa.png)

1. Przyłóż Pokrywę od tyłu (obojętnie którą stroną – jest symetryczna), otworami nad uchami w Kasecie.
2. Przykręć 2 × M3×8 imbusem 2,5 wprost w plastik uch, z wyczuciem.

**Sprawdź:** Pokrywa przylega do Kasety i Klamry, kabel serwa wychodzi pod Klamrą na zewnątrz, nic się nie zgniata.

## Krok 9. Otwór w dyni i Gniazdo (rodzic, raz)

![Gniazdo w dyni](montaz-v2.7/09_gniazdo_w_dyni.png)

1. Ścianka dyni 15–25 mm (gwint Nakrętki i okienka zaczepów; przy grubszej ściance zestrugaj miąższ od środka wokół otworu na Ø ok. 90, do 20–25 mm); kilka oczu: środki co najmniej 125 mm obok siebie, 145 mm jeden nad drugim. Rozmieszczenie i kolejność w dyni: `70-budowa/kompletacja-dyni.md`.
2. Otwornica 2½" (63,5 mm), prostopadle do skórki; otwór 63–64 mm.
3. Włóż Gniazdo od zewnątrz, strzałką GÓRA pionowo do góry. Rant wystaje tylko 2 mm poza otwór.

## Krok 10. Nakrętka od środka (może zrobić syn)

![Nakrętka](montaz-v2.7/10_nakretka.png)

1. Od środka dyni nakręć Nakrętkę zgodnie z ruchem wskazówek zegara (patrząc od środka), czołem zaokrąglonym do ścianki.
2. Dokręć ręką, aż ząbki przy krawędzi otworu złapią skórkę. Ząbki są teraz przy samej ściance – trzymaj Gniazdo strzałką do góry, gdy dokręcasz.

## Krok 11. Kaseta do Gniazda (może zrobić syn)

![Kaseta do Gniazda](montaz-v2.7/11_kaseta_do_gniazda.png)

1. Kaseta serwem na dole, oknem do góry.
2. Nasuń Kasetę rowkiem na żebro Gniazda (od środka dyni: u góry po prawej, skośnie). Łby śrub osi wchodzą w bruzdy Gniazda u góry i u dołu.
3. Wsuń prosto, bez obracania, aż czoło Kasety oprze się w Gnieździe i oba zaczepy klikną.
4. Wepnij wtyczkę serwa.

**Sprawdź:** haczyki zaczepów widać w okienkach Gniazda; Kaseta ma mały, wyczuwalny luz kątowy; nie wychodzi, gdy pociągniesz za Pokrywę.

## Wyjmowanie Kasety

Wciśnij oba haczyki przez okienka Gniazda i wyciągnij Kasetę do tyłu (albo Widelcem z v2.4).

## Pozycja zero i kalibracja

![Pozycja zero mechanizmu – widok z góry](montaz-v2.7/pozycja_zero.svg)

*Rysunek pokazuje ułożenie z v2.7. W serii (Jarzmo obrócone o 180°) wszystko jest w lustrze, patrząc od tyłu: Ramię od wałka do przodu i lekko w lewo, przegub H ok. 9 mm na lewo od środka, Cięgno z H w prawo do przegubu C na korbie Jarzma. „V” Ramienia i Cięgna otwarte, wierzchołek w lewo.*

Kalibracja programem `50-elektronika/kalibracja` (port szeregowy 115200; po włączeniu serwo jest bez impulsu i się nie rusza):

1. Nie przesuwaj oka ręką przy zasilonym serwie i nie używaj `off` w trakcie – serwo nie zna swojej pozycji, więc następny impuls skoczy.
2. Pierwsza komenda: `1500` (przy dźwigience nasadzonej jak w Kroku 4 oko stoi na wprost).
3. Ruch sprawdzaj płynnie: `g 1350 4000`, `g 1650 6000`, `g 1500 4000`, potem szerzej `g 1200 5000`, `g 1800 8000`.
4. Krańce: wspólne dla wszystkich małych oczu **1500 / 1100 / 1800 µs** (środek / min / max, test 25.10, `50-elektronika/kalibracja-oczu.md`). Sprawdź nowy moduł: `g 1100 6000`, `g 1800 6000`, `g 1500 4000` – oko dochodzi do obu krańców bez buczenia i bez oporu. Jeśli moduł buczy albo chodzi ciężko na kraniec, nie zmieniaj wspólnych wartości: wpisz w kolumnie „Uwagi” tabeli, przy którym impulsie zaczyna się opór, i zgłoś programiście.

## Sprawdzenie na koniec

- Zakres pracy w programie ESP32: ±25° serwa (±278 µs) wokół środka, najwyżej **±30°** oka (przy ±33° oko stoi na ograniczniku, a nakrętka przegubu H ma tylko 0,27 mm do ścianki).
- Oko chodzi płynnie, przeguby się nie zacinają, nakrętki nie ocierają.
- Serwo nie kiwa się w Kasecie.
- Kaseta trzyma się w Gnieździe na obu zaczepach.

Wyniki zapisz w `70-budowa/dziennik.md` – zwłaszcza Krok 3 (śruby M3 w uszach serwa), Krok 6 (nasadzenie Ramienia) i Krok 11 (łby w bruzdach).

---

## Dla dociekliwych

- **Rendery:** `bash 70-budowa/montaz-v2.7/renderuj.sh` (`--szybko` podgląd; potok jak w v2.5, siatki z `Oko F v2.7 - FullProject.3mf` rozdzielane przez `3mf_do_stl.py --rozdziel`, podglądy SG90, piłeczki, orczyka, przyrządu i widelca z v2.4).
- **Źródła:** brief `30-projekt/brief-e4-v2.6.md` i `brief-e4.4-ciegno-nakretki.md`, raport `40-cad/onshape/weryfikacja-v2.6.md` (wykonawca), review `20-analizy/review/2026-10-20-v2.6-*.md`, decyzje z 20.10 w `30-projekt/decyzje.md`. Wymiary i luzy części bez zmian – `montaz-v2.5.md`, „Dla dociekliwych”.
- **Kluczowe luzy v2.8:** Kaseta–Gniazdo 0,25/str.; łeb osi w bruździe 1,05 z boku, 0,3 promieniowo (łeb ≤ 2,75); serwo w kieszeni 0,4 z przodu i z tyłu; otwory uszu Ø2,6 × 8 (M3×10), ścianki ≥ 0,95; otwory Pokrywy Ø2,6 × 5,6 (M3×8); Klamra–Kaseta 0,25; Klamra–kabel 0,9; nakrętka H–Kaseta 0,79 przy ±30°, 0,27 przy ±33°; M3×8 Pokrywy 0,6 do dna otworu (v2.8, `40-cad/onshape/weryfikacja-v2.8.md`).
- **Śruba przegubu M3×12:** łeb na kołnierzu tulejki, tulejka 3,5 + Cięgno 2,5 + podkładka 0,5 + nakrętka 4 → wystaje 1,5 (przy 2 podkładkach 1,0); M3×10 za krótka.

## Seria modułów (M1, stan 25.10)

Moduły 1–3 skalibrowane i działają; „8” buczy, ostatni chodzi ciężko (`30-projekt/otwarte-2026-10-25.md`). Każdy kolejny moduł:

| # | Krok | Sprawdź |
|---|---|---|
| 1 | Kroki 1–3: gwinty na sucho, piłeczka wklejona, bieguny Ø3,2, serwo z Klamrą H | serwo nie kiwa się |
| 2 | Kroki 4–7 z Jarzmem obróconym o 180°: dźwigienka przy 1500 µs, ok. 20° w lewo od tyłu | „V” otwarte, H po lewej (od tyłu) |
| 3 | Test na stole: `g 1100 6000`, `g 1800 6000`, `g 1500 4000` | oko na wprost przy 1500, bez buczenia na krańcach |
| 4 | Krok 8: Pokrywa | kabel pod Klamrą |
| 5 | Numer modułu markerem na Pokrywie i na wtyczce serwa = kanał PCA9685, wiersz w `50-elektronika/kalibracja-oczu.md` | numer czytelny od tyłu |

**Moduł, który buczy albo chodzi ciężko:** najpierw zdejmij Ramię (wkręt przez okno), wyślij `1500` i nasadź ponownie (Krok 4, „Ważne”). Jeśli dalej ciężko: poluzuj nakrętki przegubów C i H o ćwierć obrotu (Krok 5: obracają się lekko na tulejkach) i sprawdź, czy łby osi oka nie są dociągnięte (Krok 6: „bez dociągania”). Wynik wpisz w dzienniku.

Wynik każdego modułu (numer, test 1100/1800, uwagi) zapisz w `70-budowa/dziennik.md`.
