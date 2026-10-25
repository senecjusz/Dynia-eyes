**Astra — review Uchwytu v13, runda 2/2.**  
Treść raportu `20-analizy/review/2026-10-25-uchwyt-scianki-astra-r2.md`.

Sprawdziłem rzeczywistą siatkę Uchwytu v13, a serwa jako bryły z parametrów eksportu, **łącznie z uszami**. Podane odsunięcie liczę od pozycji zamontowanej; montaż przebiega od 18 do 0 mm.

| Serwo | Wynik pełnej drogi wsuwania |
|---|---|
| S1, od −x | Wolna droga. |
| S2, od −x | Wieża koliduje ze słupkiem przy odsunięciu **≥5,09 mm**; przy 18 mm koliduje również korpus. |
| SG, od +x | Wolna droga przy przesunięciu **0,20 mm w +y**, mieszczącym się w luzie okna; następnie wycentrowanie. |
| SD, od +x | Dolne ucho koliduje z obniżoną ścianką słupek–wieża 3. Przy przesunięciu 0,20 mm w −y blokada zaczyna się przy odsunięciu **17,36 mm**. |

**PSUJE 1 — montaż S2 przy słupku.**

- Potwierdzam uwagę Opusa. Przykładowy punkt wspólny wieży i słupka przy odsunięciu 18 mm: **[0; 5; −44] mm**.
- Przeniesienie ramki na drugą stronę uszu oznacza zakres **x=23,5…27,5 mm**, zamiast 29,5…33,5 mm.
- Ten wariant **również nie przechodzi osiowo**: dolne ucho trafia w skos podstawy wieży 1 przy odsunięciu **≥6,64 mm**. Wieża serwa dodatkowo wystaje **0,20 mm** ponad górę okna.
- **Poprawka:** przeniesiona ramka wymaga wybrania w skosie pod drogę dolnego ucha oraz podniesienia góry okna do **z=−37,7 mm**, zapewniającego 0,30 mm luzu.

**PSUJE 2 — dolne ucho SD przy obniżonej ściance.**

- Ścianka kończy się na **z=−62,51 mm**, natomiast dolne ucho zajmuje **z=−65,8…−61,3 mm**.
- Punkt przenikania przy odsunięciu 18 mm: **[1,3; −9; −64] mm**. Przesunięcie poprzeczne w granicach luzu ±0,30 mm nie usuwa blokady osiowego wsuwania.
- **Poprawka:** lokalne wybranie pod pełną obwiednię dolnego ucha z luzem 0,30 mm; samo obniżenie ścianki pod korpus nie wystarcza.

**Przedłużenie orczyka SD:** rzeczywista siatka 3MF przechodzi cały ruch powieki 0…51,5° bez kolizji. Najmniejszy odstęp do słupka wynosi około **0,59 mm**. Uwaga Astry z rundy 1 usunięta.

**Werdykt: Uchwyt v13 nie może iść do druku przed usunięciem blokad montażu S2 i osiowego wsuwania dolnego ucha SD.**

Plików nie zmieniałem. Procesy uruchomione przeze mnie w tle: brak.