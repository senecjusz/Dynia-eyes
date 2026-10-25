# Brief: krytyczne review wariantów połączenia drutu z gałką (Z przez blaszkę / oczko M3)

Jesteś recenzentem, tylko do odczytu, bez commitów i bez `git pull`. Piszesz po polsku.

Kontekst: duże oko na Halloween, składane hobbystycznie. Druty gięte ręcznie z dokładnością ±2 mm i ±10°. Nic nie kupujemy. W warsztacie są śruby M3, M4 i M5 (8–50 mm) z nakrętkami.

Materiał:
- warianty: `20-analizy/2026-10-24-duze-oko-ucho-oczko-m3.md`;
- model: `40-cad/openscad/duze-oko-v2.scad` (stan roboczy: Galka, `uchoDol`, `katOsiS2`);
- przemiatanie: `40-cad/narzedzia/duze-oko-druty-v2-kolizje.js`;
- kąty: `40-cad/narzedzia/duze-oko-katy-przegubow.js`, parametry `40-cad/narzedzia/duze-oko-v2-parametry.json` (stare; nowe tworzy echo SCAD).

Pytania:
1. Czy wniosek „Z przez blaszkę nie przejdzie przez cały zakres przy żadnej stronie korpusu” jest poprawny? Podaj liczby.
2. Przechył oczka Ø5 i Ø6 na trzpieniu M3: sprawdź wzór i wynik. Uwzględnij gwint (Ø zewn. 3, rdzeń ~2,4), spłaszczenie i niedokładność oczka zwijanego ręcznie.
3. Miejsce w gałce na łeb M3, oczko i luz w całym zakresie ruchu (kardan, rowek T, drugie ucho, skorupa, Pierścień, powieki, drut drugiej osi). Długość śruby, mocowanie: wkręt w otwór ciasny Ø2,6 czy nakrętka w kieszeni. Dostęp przy montażu.
4. Czy oczko na sworzniu przy luzie osiowym 0,5–1 mm daje histerezę lub zmianę zera? Ile w stopniach gałki?
5. Porównanie wariantów A/B/C: zysk, koszt pracy, ryzyko. Czy jest prostszy wariant przy tych samych warunkach?

Zasady:
- Nie dopisuj funkcji.
- Wagi: KRYTYCZNE, WAŻNE, DROBNE. Każda uwaga: miejsce, scenariusz porażki, poprawka albo test, pewność.
- Liczby zamiast opinii. Oddzielaj pomiar, obliczenie i założenie.
- Werdykt jednym zdaniem: który wariant do modelu.
- Raport: Astra → `20-analizy/review/2026-10-24-ucho-oczko-astra.md` (odpowiedź końcowa), Opus → `20-analizy/review/2026-10-24-ucho-oczko-opus.md`. Nie czytaj raportu drugiego recenzenta.
