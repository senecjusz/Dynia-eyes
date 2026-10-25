Jesteś recenzentem ADWERSARYJNYM. Robisz PEŁNE review wstępnej koncepcji v5 (bez CAD) podstawki pod prawdziwą dynię na Halloween – runda 2 (ostatnia). Pracujesz TYLKO DO ODCZYTU: nie zmieniasz repo, bez git pull, commitów i porządków. Odpowiadasz po polsku, zwięźle.

Materiały:
- 20-analizy/2026-10-25-podstawka-koncepcja.md (koncepcja v5 – na górze lista decyzji użytkownika z 25.10, traktuj je jako wymagania),
- rendery 20-analizy/2026-10-25-podstawka-render/1–4 *.png i skrypt geometrii 40-cad/narzedzia/podstawka-blender-render.py (wymiary brył),
- 30-projekt/PRD.md (§5, §7, §8), AGENTS.md (DFAM, tabela luzów, druk), 50-elektronika/sprzet.md, polaczenia.md, dynia-v2-plan.md,
- runda 1: 20-analizy/review/2026-10-25-podstawka-koncepcja-wnioski.md (co poprawiono, co uznano za brzegowe).

Dynia użytkownika: obwód 100 cm (Ø318), 10 kg. Koncepcja zmieniła się od rundy 1: podstawka bez dna 236 × 220 × 58; szufladka z samym powerbankiem w poprzek wysuwana do przodu, PIR w jej czole; elektronika w kasecie wsuwanej od tyłu, na stałe; dynia mocowana tuleją z gwintem w środku dna i nakrętką od środka.

ZASADY (PM, 25.10):
- Każdą uwagę klasyfikuj jako „PSUJE DZIAŁANIE” (produkt nie zadziała według wymagań) albo „BRZEGOWE” (zdarzy się rzadko, da się obejść, test i tak jest w planie). Brzegowych nie rozwijaj – jedna linijka.
- NIE dopisuj funkcji ani zabezpieczeń (odporność na dzieci, zamki, osłony – poza zakresem). Najprostsze, co działa; najmniejszy wysiłek użytkownika.
- Pomysły spoza wymagań osobno na końcu w „Propozycje (poza zakresem)”.

Sprawdź liczbowo:
1. Wymiana powerbanku: wysunięcie 92 mm, wtyk USB-C prosty w szufladce (160 + 30 w 191,2 wnętrza), kabel do kasety z zapasem, nic na zewnątrz.
2. Mocowanie dyni: tuleja Ø76 z gwintem 45°/skok 5/luz 0,20 przez otwór Ø80, wysokość t + 10, nakrętka 8 mm (ok. 1,6 zwoju) – czy trzyma 10 kg dyni i docisk na miękkim miąższu; nakładanie dyni na tuleję; wysokość nad dnem wnętrza ok. 10 mm.
3. Podstawka bez dna: sztywność (2 ścianki boczne + płyta + kaseta z tylną ścianką), nośność płyty 18 nad szufladką, stabilność.
4. Kaseta elektroniki: czy mieszczą się 3 łączniki RJ45 z wtykami, PCA9685 z wtykami Dupont, ESP32-C3, kondensator w 198 × 100 × 40 pod płytą; prowadzenie skrętek z tulei.
5. PIR w czole szufladki: wysokość ok. 20 mm nad stołem, dostęp do potencjometrów, przewód ruchomy.
6. Druk: szufladka 206 i kaseta 198 (X1C albo 2 części sklejone CA), tuleja, nakrętka – płaska strona, nawisy.
7. Sprzeczności między tekstem, rysunkami i skryptem.

Format: każda uwaga – klasa (PSUJE DZIAŁANIE / BRZEGOWE), miejsce, scenariusz z liczbami, poprawka albo test, pewność. Najpierw PSUJE DZIAŁANIE. Maks. 12 uwag. Na końcu werdykt jednym zdaniem: czy koncepcję można przyjąć i przejść do modelu (krok 2).
