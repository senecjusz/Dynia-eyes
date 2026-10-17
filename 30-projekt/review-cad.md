# Review projektu CAD – lista kontrolna

Każdy projekt mechanizmu (FeatureScript / Onshape / STL) przechodzi **ostre review przed pierwszym wydrukiem**. Review robi ktoś, kto nie projektował: inna sesja albo subagent, zawsze z wnioskami na piśmie.

## 1. Zgodność z ustaleniami
- [ ] Wymiary z `20-analizy/` (otwór Ø 64, rant Ø 72, kołnierzyk Ø 43, tuleja modułu ~53,3, gniazdo ~54,5, gwint, zakres docisku 15–35 mm).
- [ ] Wariant F: gniazdo z rantem + nakrętka (rodzic), moduł na bagnet z kluczem (syn), znacznik GÓRA, ząbki.
- [ ] **Osie i połączenia na śruby M3/M4/M5**, bez drukowanych czopów i kleju. Otwory: ciasny w części nieruchomej, luźny w ruchomej. Wkładki do wtapiania tam, gdzie część będzie rozkręcana.
- [ ] Klucz nasadowy 3/8" (otwór ~9,8 mm, faza, rowek pod kulkę).
- [ ] Mocowanie piłeczki zgodne z wariantem P1 z [analizy śrub](../20-analizy/2026-10-17-mocowanie-pileczki-sruby.md).

## 2. Mechanika
- [ ] Piłeczka obraca się w pełnym zakresie (±40°) bez kolizji z tuleją, kołnierzykiem, cięgnem.
- [ ] Cięgno i korba: brak martwego punktu w zakresie ruchu serwa, a kąt serwa mieści się w 0–180° z zapasem.
- [ ] Serwo SG90 pasuje (wymiary z karty, uszy montażowe, wyjście kabla).
- [ ] Bagnet: wchodzi tylko w jednej pozycji, ma wyraźny klik i nie wypada przy ruchu oka.
- [ ] Moduły sąsiadujące w dyni: czy ramiona serw mają gdzie się mieścić (orientacja serwa).

## 3. Druk (Bambu A1 mini / X1C)
- [ ] Każda część ma płaską stronę na stół, a nawisy mają ≤ 45° albo przewidziane podpory.
- [ ] Ścianki ≥ 1,2 mm (3 obrysy 0,4), a cienkie elementy sprężyste wydrukowane we właściwym kierunku warstw.
- [ ] Luzy jako zmienne (nie wpisane na sztywno), z wartościami startowymi do kalibracji.
- [ ] Gwinty drukowane: profil przyjazny dla FDM (trapezowy, skok ≥ 3 mm).

## 4. Montaż przez dziecko
- [ ] Syn wykonuje tylko: włożenie modułu, przekręcenie bagnetu, wpięcie wtyczki. Nic nie da się zrobić źle.
- [ ] Brak ostrych krawędzi i małych luźnych części po stronie syna.

## 5. Repo
- [ ] Parametry jako zmienne, link do dokumentu Onshape w `40-cad/README.md`, STL w `40-cad/stl/` z wersją w nazwie.
- [ ] Wpis w `70-budowa/dziennik.md` i decyzje w `30-projekt/decyzje.md`.

Wynik review: lista uwag (krytyczne / ważne / kosmetyczne) zapisana w `20-analizy/` z datą.
