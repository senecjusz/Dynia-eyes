# SolidCraft: Oko F v2.3 (pilotaż, etap 1)

Model budowany **na żywo w aplikacji** SolidCraft 0.15.0 (Windows i Linux), sterowanej przez `solidcraft.exe --control 7878` i `solidcraft-cli mcp --connect 127.0.0.1:7878`. Onshape zostaje jako zapas.

| Plik | Co to |
|---|---|
| `oko-f-v2.3.solidcraft` | model: **źródło prawdy**, otwierać w SolidCraft (File → Open) |
| `png/` | zrzuty: `iso`, `tyl`, `przekroj` (płaszczyzna YZ przez oś) |

Układ jak w Onshape: oś modułu Z (+Z na zewnątrz dyni, z = 0 to wierzch rantu), oś oka Y (+Y = GÓRA).

## Co jest w etapie 1

- **Parametry** (Parameters, 42): łańcuch średnic jak w v2.2, ale `luzKaseta` 0,25. Daje to gniazdo Ø55,0, rdzeń Ø59,0, gwint Ø63,0 (luz 0,25/str. w otworze Ø63,5) i nakrętkę Ø59,6. Nowe parametry: `luzSanki` 0,25, `fazkaWej` 0,8, `zaczepyL` 9, `gniazdoKoniec` 45,7, `dyniaR` 150.
- **Komponent Gniazdo**:
  - korpus to jeden obrót profilu, a jego szkic jest związany wymiarami z parametrami (rantD, otworD, gwintD, gwintRdzen, gniazdoID, kolnierzykD, przodL, gniazdoKoniec, rantT, krzywizna dyni z dyniaR),
  - fazka rantu, ząbek × szyk 8, strzałka GÓRA,
  - żebro 135° z fazką promieniową 0,8 i fazkami bocznymi (v2.3),
  - okienka 52° i 232° (v2.3: −7°), pasek za nimi 3,5 mm,
  - zwój gwintu jako **osobna bryła** „Gniazdo - zwoj” (patrz niżej).
- **Komponent Kaseta**:
  - rura, występy osi, szczeliny ogranicznika, kanały kołków, pogłębienia i otwory M3,
  - szczelina serwa, otwory dolne C i H, otwór górny (Slot),
  - wybrania C i H (v2.3: H płytkie + głębokie), pogrubienie H od z −45,9,
  - rowek z fazkami wejściowymi (v2.3),
  - zaczepy 38° i 218° z haczykami 52° i 232° (v2.3),
  - ucha z otworami wkładek na r 29,5 i skosem wyżej o 1 mm: ścianka 2,0 mm do brzegu i 2,05 mm do skosu (v2.3; w v2.2 było 1,34).
- Oś czasu: foldery według części (Gniazdo, Kaseta z podfolderami), nazwy operacji po polsku. 0 błędów.

## Ograniczenia SolidCraft 0.15 (wyniki pilotażu)

- **Gwint:** brak zwoju o własnym zarysie. Zwój da się zrobić przez sweep trapezu 45° po helisie (krzywa 3D), co trwa 1 s i daje 6 ścian. **Żadna operacja logiczna z powierzchnią śrubową się nie kończy** (suma, cięcie, natywny `coil`: ponad 4 minuty, raz zawiesiło okno). Dlatego zwój to osobna bryła wpuszczona 0,5 mm w rdzeń: w Bambu Studio wczytuje się ją z gniazdem jako jeden obiekt z częściami. Brak fazy początku zwoju. **Nakrętki tak nie zrobimy** (gwint wewnętrzny wymaga cięcia).
- **Sumy brył o wspólnych ścianach walcowych** (np. rant Ø74 + dopasowanie Ø74) kończą się błędem, więc korpus gniazda jest jednym obrotem profilu.
- **Kruche operacje logiczne przy wąskich szczelinach** (zaczepy 0,8 mm): jądro odrzuca wynik („would remove part of the body away from the tool”) zależnie od kolejności operacji. Ucha trzeba było wstawić przed zaczepy, a w zaczepie 218 wyciąć koniec przed szczelinami. Szyk kołowy zaczepu nie przeszedł.
- **Łuki w szkicu:** koniec łuku liczony z kąta nie trafia w koniec linii. Linie trzeba dołączać do końców łuków przez odwołanie (`a1.end`).
- **Brak eksportu historii** (`solidcraft-cli script`) dla modelu z komponentami (SolidCraft #886). Historię widać tylko w aplikacji.
- **Eksport 3MF:** bez ustawienia dokładności. Domyślna siatka ma krok ok. 3°, odchyłkę cięciwy ok. 0,01 mm na Ø54,5, czyli wystarczająco.
- **Działa dobrze:** parametry z wyrażeniami, wymiary szkicu z parametrów, szyk kołowy prostych operacji, fazki (`chamfer`) na krawędzi wskazanej punktem, przekrój (`inspect.section`), zrzuty, foldery osi czasu, zapis i odczyt. Są też jointy, `motion.study` i `inspect.clearance` (do sprawdzenia w etapie 2).
