# Brief E4.4: Cięgno v2.6b – przeguby na nakrętkach samohamujących zamiast wkładek (Onshape)

Wykonawca CAD. Obowiązuje `AGENTS.md`. Model: dokument „Oko F v2.5”, Part Studio „Oko F v2.5”, stan v2.6 (commit `98142c9`). Zmieniasz **tylko Cięgno**.

## Po co

W v2.5 przeguby C i H to śruby M3×8 od spodu przez tulejki z kołnierzem (trzon Ø5,6 w otworach Ø6,0 korby Jarzma i Ramienia), wkręcone we wkładki wtopione w piasty Cięgna. Wtapianie rozdęło piasty, a w v2.6 powiększyliśmy gniazda do Ø4,4, ale ryzyko deformacji (dno 1,0, luz 0,2 do Ramienia i korby) zostaje. Decyzja użytkownika 20.10: **bez wkładek, śruba przechodzi przez Cięgno i jest skręcona nakrętką samohamującą M3** (DIN 985, wysokość ok. 4, klucz 5,5) **z jedną albo dwiema podkładkami M3** (DIN 125, Ø7 × 0,5 każda) między nakrętką a piastą – druga podkładka wyrównuje długość śruby z kompletu – rozkłada docisk na plastiku i chroni piastę przed wyciskaniem przez nakrętkę. Pod łbem śruby podkładki nie ma: łeb opiera się o kołnierz tulejki Ø8. Mniej pracy, bez lutownicy, nakrętka nie odkręca się przy ruchu wahadłowym. Napęd użytkownik skręca na stole, więc nakrętkę przytrzyma kluczem.

Kaseta (wkładki w uchach Pokrywy) i Pokrywa zostają bez zmian – tam wkładki weszły czysto.

## Zmiana

- Gniazda wkładek w piastach Cięgna zastąp otworem przelotowym Ø`m3Luzny` (3,3) przez całą wysokość w C i H.
- Piasta jest oparciem dla podkładki i nakrętki: dobierz jej wysokość tak, żeby podkładka Ø7 leżała w całości na piaście (dziś Ø7,6 – wystarczy; nakrętka po przekątnej 6,35) i żeby śruba z kompletu użytkownika (M3 od 8 do 50 mm co typowy krok; podaj długość) wystawała nad nakrętką 1–2 zwoje. Jeśli niższa piasta lub sama płyta daje krótszą śrubę bez straty sztywności, zaproponuj to w planie z liczbami.
- Zachowaj odstęp 0,2 między płytą Cięgna a Ramieniem i korbą oraz położenie płyty (y −0,3…2,2) – kinematyka bez zmian.
- Usuń zmienne używane tylko przez gniazda wkładek Cięgna (jeśli nie są używane w Kasecie).

## Sprawdź

- Nakrętka i wystająca śruba na całym ruchu oka ±33° (serwo +27,3° / −34,2°) wobec Kasety, Jarzma, Ramienia, bloku serwa i otworu górnego – podaj najmniejszy odstęp (Fable: nad piastami nic nie ma na ≥ 14 mm).
- Długość śruby: łeb pod kołnierzem tulejki, przez tulejkę, Cięgno, 1 lub 2 podkładki (0,5 / 1,0) i nakrętkę 4 – rachunek w raporcie dla obu wariantów, z wybraną długością śruby; nakrętka z wystającą śrubą sprawdzona w ruchu dla wyższego stosu.
- K1–K11 dla Cięgna, objętość, `featureStates`.

## Proces

1. Krótki plan (operacje, zmienne, długość śruby) do orkiestratora przed zapisem.
2. Zmiana, kontrola, dopisek w `40-cad/onshape/weryfikacja-v2.6.md` (sekcja „v2.6b Cięgno”), commit, wiadomość z hashem.
3. **Przed startem sprawdź logowanie Onshape**; jeśli wygasło, napisz od razu.

Budżet: ≤ 15 wywołań, `GET /features` – w E4 limit 4 jest wyczerpany, więc bez odczytu drzewa; stan bierz z odpowiedzi zapisów i z `odbior-v2.6/features.json`.
