# PROPOZYCJA: powrót do Onshape i metodyka pracy nad modułem oka

**Status: do review, niezaakceptowana.** Autor: orkiestrator (Warszawa), 2026-10-19.
Do oceny przez dwóch recenzentów z różnych rodzin modeli (Fable, Astra/Codex).

## 1. Problem

Model v2.4 powstał w SolidCrafcie 0.15 i **nie da się w nim pracować**: każda zmiana
przelicza całe drzewo. Zmierzone na tym modelu:

| Pomiar | Wynik |
|---|---|
| Przebudowa v2.4 (200 operacji), headless | **≈ 350 s** |
| To samo z 5 gwintami `modeled: false` | **≈ 291 s** (−17%) |
| Onshape, Oko F v2.2 (**271** operacji), otwarcie dokumentu | **~6 s** |
| Onshape, `GET /features`, 2,5 MB | **221 ms** |

Wyłączenie wszystkich gwintów daje 17%, więc koszt rozkłada się po całym drzewie —
SolidCraft 0.15 nie ma przeliczania przyrostowego. Onshape obsługuje **większe** drzewo
dwa rzędy wielkości szybciej.

## 2. Druga przyczyna: sposób modelowania

Drzewo v2.4 jest spuchnięte, bo powstało jako łańcuch atomowych par:

| Wskaźnik | v2.4 |
|---|---|
| Szkiców z własnym, osobnym wyciągnięciem | **94 z 94** |
| Operacji `mirror` | **0** (przy 23 parach góra/dół) |
| Operacji `pattern` | **1** (przy 8 ząbkach, 2 zaczepach, 2 haczykach, 6 wycięciach) |
| Fazek jako `chamfer` | **2** |
| Operacji w samej Kasecie | **66** |

Dobrze zbudowane to samo drzewo to ~70–90 operacji. To wyjaśnia współczynnik ~2,5,
nie całość — obie przyczyny są niezależne i obie trzeba usunąć.

## 3. Dlaczego Onshape jest dostępny

Porzucono go 18.10 po blokadzie **429 z `Retry-After` ~7 h**, uznając pulę za wyczerpaną.
To był limit **częstotliwości**, nie puli. Zweryfikowane na koncie 19.10, trzy wywołania:

- `GET /users/sessioninfo` → **200**, `X-Rate-Limit-Remaining: 2971`
- `GET /partstudios/.../features` → **200**, `X-Rate-Limit-Remaining: 100`
- wyczerpanie puli rocznej dałoby **402**, nie 429 — nie wystąpiło

Wniosek: `/features` jest jedynym wąskim endpointem (~100 na okno wobec ~3000).
Zasady oszczędnej pracy są już zapisane w `AGENTS.md`.

## 4. Pytanie główne do recenzentów: przenieść czy przebudować?

W Onshape stoi **v2.2**. Zmiany v2.3 i v2.4 powstały w SolidCrafcie, więc w Onshape ich nie ma.

**Wariant A — przenieść różnice v2.2 → v2.4.** Odtworzyć w Onshape: gwint ISO M63×3
zamiast 45°, luz sanek 0,25, fazki wejściowe, zaczepy 33°/213° i haczyki 47°/227°,
wybranie H współosiowe (r 25,25/25,8), pogrubienie H od z −46,5, pasek za okienkami ≥ 3,5,
ucha pod wkładki, nakrętka bez radełka obrócona 24°, otwory dolne ≥ 7,5, widelec do zaczepów,
fazki 0,6 × 45°, trzpień 0,3.
Zaleta: zachowana historia i parametry. Wada: **drzewo v2.2 w Onshape ma 271 operacji
i ten sam atomowy charakter** co v2.4, więc dziedziczymy problem czytelności.

**Wariant B — przebudować moduł w Onshape od zera** według dyscypliny z `AGENTS.md`
(mirror, szyki, `Chamfer`/`Fillet`, jeden szkic wiele profili, `Hole`, ≤ 15 operacji na część),
z geometrią wziętą z v2.4 jako wzorca wymiarowego.
Zaleta: model czytelny i poprawialny, zgodny z wymaganiem użytkownika. Wada: większy nakład,
ryzyko zgubienia detalu, który powstał w pięciu cyklach review.

Rekomendacja autora: **B dla Kasety i Gniazda** (66 i 15 operacji, najgorsze przypadki),
**A dla drobnych części** (tulejki, cięgno, ramię, pokrywa — po 6–8 operacji, nie ma czego
upraszczać). Do rozstrzygnięcia przez recenzentów.

## 5. Kontrola wyjścia modułu (propozycja procesu)

Dotychczas błędy mechaniczne wychodziły dopiero w pełnym review (30–45 min, dwa modele):
v2.3 nieszczelne siatki, v2.4 eksport zgubił bryłę „Sanki serwa (2)", v2.4 parametr sterował
tylko pierwszym otworem z pary, luz tulejek 0,20 przy wymaganych 0,25. Wszystkie cztery są
sprawdzalne maszynowo.

**Poziom 1 — po każdym module, automatycznie, wykonuje wykonawca**, wynik jako plik:

1. zero błędów i ostrzeżeń w drzewie (`featureStates` z odpowiedzi `/features`, 0 dodatkowych wywołań),
2. liczba brył w modelu = liczba brył w eksporcie,
3. każdy parametr steruje tym, co deklaruje — odwołanie do zmiennej, nie liczba, i w **obu** elementach pary,
4. każda para z tabeli luzów ma zmierzony luz ≥ wartości z tabeli,
5. siatki: szczelność i orientacja trójkątów,
6. budżet operacji na część nieprzekroczony.

**Poziom 2 — na granicy wersji**: pełne review dwoma niezależnymi recenzentami, jak dziś.

Niezależność na poziomie 1 nie jest potrzebna (to pomiary, nie opinie), ale raport musi być
plikiem, a nie zdaniem w rozmowie — orkiestrator weryfikuje go przed przyjęciem modułu.

## 6. Zmiana materiału: PETG

Użytkownik przechodzi z PLA na **PETG**. Cała tabela luzów w `AGENTS.md` jest podpisana
„wartości startowe dla PLA", a luz gwintu 0,45 pochodzi z próbki PLA i z review v2.4.
PETG daje ciaśniejsze otwory i pasowania. Drukowane teraz próbki gwintu 0,3 / 0,45 / 0,6
zmierzą **PETG** i stają się nowym punktem odniesienia. Tabelę trzeba przepisać po próbkach.

## 7. Ryzyka

| # | Ryzyko | Ograniczenie |
|---|---|---|
| 1 | Pula roczna Onshape (2 500/rok, niewidoczna, ujawnia się dopiero 402) | drzewo raz na sesję, mapa `featureId` lokalnie, `noSketchGeometry` (−58% payloadu), ciężkie liczenie FeatureScriptem (poza pulą) |
| 2 | Przy przebudowie (wariant B) zgubienie detalu z pięciu cykli review | `20-analizy/review/` jako lista kontrolna; wymóg, by review v2.5 sprawdziło każdą pozycję z review v2.2–v2.4 |
| 3 | Dwie sesje edytujące ten sam dokument | `sourceMicroversion` + `rejectMicroversionSkew` przy każdym zapisie |
| 4 | Powrót do atomowego modelowania | budżet ≤ 15 operacji na część jako warunek przyjęcia modułu |
| 5 | Luzy z PLA zastosowane do PETG | nie drukować serii przed pomiarem próbek PETG |

## 8. Czego oczekujemy od recenzenta

1. Rozstrzygnięcie pytania z punktu 4: A, B, czy mieszane — z uzasadnieniem liczbowym.
2. Czy kontrola wyjścia z punktu 5 wyłapałaby cztery wymienione błędy? Czego w niej brakuje?
3. Czy budżet ≤ 15 operacji na część jest realny dla Kasety i Gniazda, czy wymusi FeatureScript?
4. Czy jest trzecia droga, której nie rozważyłem.
5. Co w tym planie jest założeniem podanym jako fakt.
