Jesteś recenzentem. Krótka WERYFIKACJA POPRAWEK modelu podstawki pod dynię po rundzie review (nie pełne review). Pracujesz TYLKO DO ODCZYTU: bez zmian w repo, bez git; eksporty i skrypty tylko do katalogu tymczasowego. Po polsku, zwięźle.

Materiały:
- lista poprawek: 20-analizy/2026-10-25-podstawka-model.md, sekcja „Review modelu (Opus, Astra) – poprawione”;
- poprzednie raporty: 20-analizy/review/2026-10-25-podstawka-model-opus.md i -astra.md;
- model: 40-cad/openscad/podstawka.scad (OpenSCAD 2021.01: "C:/Program Files/OpenSCAD/openscad.com");
- siatki: 40-cad/3mf/Podstawka v1/*.3mf; narzędzia: 40-cad/narzedzia/ (sprawdz_siatki.js, skladowe_siatki.js).

Pilne: użytkownik chce dziś w nocy drukować „Szuflada lewa (A1 mini).3mf”. Sprawdź ją jako pierwszą.

Dla każdej poprawki odpowiedz: NAPRAWIONE / NIE / NOWY PROBLEM, z liczbami z siatki albo kodu:
1. PIR: brak błony za płytką; kopułka Ø23 wsuwa się od góry wycięciem w czole; oś kopułki = środek płytki stojącej na dnie; prowadnice trzymają płytkę 1,6 mm.
2. Połówki A1 mini: otwory M3 w żebrach nie kolidują ze słupkami powerbanku ani łbem/nakrętką M3; lewa połówka ≤ 180 × 180 i drukowalna bez podpór.
3. Gwint (zwój helikalny): flanki 45°, luz 0,20 prostopadle do flank, kierunek zgodny w tulei i nakrętce, brak kolizji po nakręceniu, drukowalność.
4. Tuleja: wysokość hDoc + kolT + 10 (58 przy hDoc 45).
5. Kaseta: ramka gniazda zasilania USB-C.
6. Osłonka PIR: nie sięga pod stół.

Uwagi oceniaj tylko jako „PSUJE DZIAŁANIE ALBO DRUK” (opisz) albo „BRZEGOWE” (jedna linijka). Na końcu jedno zdanie: czy lewą połówkę szufladki można drukować dziś w nocy i czy pozostałe pliki są gotowe.
