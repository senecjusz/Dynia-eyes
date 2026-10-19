# Onshape: klucze API zamiast sesji przeglądarki (plan Free)

Data: 2026-10-19. Oznaczenia: [F] fakt ze źródła, [I] interpretacja.

## Wnioski dla projektu

1. Najważniejsze: wywołania z sesji przeglądarki (cookie + XSRF) **nie liczą się** do rocznego limitu API, a wywołania z kluczem API się liczą [F]. Obecna metoda jest więc „darmowa” limitowo, a przejście na klucze uruchamia licznik.
2. Plan Free ma 2 500 wywołań rocznie na użytkownika [F]. Budowa jednego modelu to łatwo 50–300 wywołań (cechy, odczyty, poprawki), czyli kilkanaście–kilkadziesiąt modeli rocznie [I]. Po wyczerpaniu: HTTP 402 do końca cyklu [F].
3. Liczą się tylko odpowiedzi 2xx/3xx, błędy 4xx/5xx nie [F]. Mimo to program powinien ograniczać odczyty kontrolne [I].
4. Klucze da się utworzyć samodzielnie w My account → Developer. Dokumentacja nie wiąże ich z planem płatnym, a tabela limitów wymienia Free [I: Free może używać kluczy].
5. Zmiany z API będą widoczne na żywo w otwartym dokumencie, bo Onshape pokazuje zmiany współpracowników w tym samym workspace w czasie rzeczywistym [F dla współpracy, I dla API].
6. Rekomendacja [I]: zostać przy sesji przeglądarki jako głównej ścieżce. Klucze (2 z uprawnieniami Read+Write, z TTL) traktować jako zapas, np. do pracy bez otwartej karty.

## 1. Tworzenie kluczy, zakresy, liczba

- [F] dev-portal.onshape.com przekierowuje (301) na cad.onshape.com/appstore/dev-portal. Klucze osobiste zarządza się w **My account → Developer → API keys**.
- [F] Kroki: ikona konta → My account → Developer → API keys → Create new API key → nazwa → uprawnienia → opcjonalnie „Enable TTL” (data wygaśnięcia, e-mail przed wygaśnięciem) → Create API key → skopiować access i secret key. Sekretu nie da się później odczytać.
- [F] Zakresy: OAuth2ReadPII, OAuth2Read, OAuth2Write, OAuth2Delete, OAuth2Purchase, OAuth2Share. Klucz działa wyłącznie w imieniu użytkownika, który go utworzył.
- [F] Konto indywidualne: maks. **2 klucze**.
- [I] Do budowy modeli wystarczą Read + Write. Bez Delete, Purchase i Share.
- [F] Brak wzmianki o ograniczeniu planowym. Wprost „Free może tworzyć klucze” nie znalazłem.
- Źródła: [My Account – Developer](https://cad.onshape.com/help/Content/Plans/my_account_developer.htm), [API Keys](https://onshape-public.github.io/docs/auth/apikeys/)

## 2. Limity

- [F] Roczny limit: Free, Standard i EDU Student mają 2 500 na użytkownika. Professional ma 5 000, Enterprise 10 000 na pełnego użytkownika. Przekroczenie daje **402**.
- [F] Liczą się wywołania z kluczami API, z OAuth2 prywatnych aplikacji i z API Explorera uwierzytelnionego kluczem/OAuth. **Nie liczą się** wywołania z przeglądarki, aplikacji mobilnej i API Explorera na sesji Onshape, a także webhooki i odpowiedzi 4xx/5xx.
- [F] Limity częstotliwości są per endpoint, a ich wartości nie są publikowane. Przekroczenie daje **429** z nagłówkiem `Retry-After` (sekundy). Każda odpowiedź ma `X-Rate-Limit-Remaining` (pozostałe wywołania danego endpointu).
- [F] Zużycie widać w My account → Developer → „View your API usage”. Powiadomienia przychodzą przy 25/50/75/100%.
- [I] Czy 429 per endpoint dotyczy też sesji przeglądarki, źródła nie mówią.
- Źródła: [API Limits](https://onshape-public.github.io/docs/auth/limits/), [Response codes](https://onshape-public.github.io/docs/api-adv/errors/)

## 3. Uwierzytelnianie i biblioteki

- [F] Basic auth (`Authorization: Basic base64(ACCESS:SECRET)`) to najniższy poziom bezpieczeństwa, „tylko do lokalnych testów”. Podpis HMAC-SHA256 (`Date` ±5 min, `On-Nonce` ≥16 znaków, `Authorization: On <key>:HmacSHA256:<sig>`) jest przeznaczony do testów i użytku wewnętrznego. OAuth2 jest wymagany dla aplikacji w App Store.
- [F] Przy przekierowaniach 307 trzeba podpisać nowy URL.
- [I] Dla lokalnego programu agenta wystarczy HMAC, a Basic auth tylko na pierwsze próby.
- [F] `onshape-public/onshape-clients` (m.in. Python `onshape-client`) jest **zarchiwizowane od 9.03.2023**. Ostatnie wydanie na PyPI pochodzi z 2020 r.
- [F] Aktywne są przykłady Node.js/Python z HMAC w `onshape-public/apikey`. Istnieją też nieoficjalne pakiety, np. `onshape-rest-api-client`.
- [I] Najprościej: własny cienki wrapper na `requests`/`fetch` z HMAC według `apikey`.
- Źródła: [API Keys](https://onshape-public.github.io/docs/auth/apikeys/), [onshape-clients](https://github.com/onshape-public/onshape-clients), [apikey](https://github.com/onshape-public/apikey), [onshape-client (libraries.io)](https://libraries.io/pypi/onshape-client)

## 4. Widoczność na żywo

- [F] Wszystkie dodane cechy i zmiany są wyświetlane w czasie rzeczywistym wszystkim współpracownikom w tym samym workspace. Użytkownik tylko z prawem podglądu też widzi zmiany na żywo. Jest też Follow Mode.
- [I] Zapis przez API trafia do tego samego workspace, więc otwarta karta i telefon powinny pokazać zmianę bez odświeżania. Oficjalnego zdania konkretnie o zmianach z REST API nie znalazłem; warto to sprawdzić jednym testem.
- Źródło: [Sharing and Collaboration](https://cad.onshape.com/help/Content/Collaboration/sharing_and_collaboration.htm), [Tech tip: simultaneous editing](https://www.onshape.com/en/resource-center/tech-tips/tech-tip-simultaneous-editing-sharing-and-real-time-collaboration-in-onshape)

## 5. Bezpieczeństwo

- [F] Klucze traktować jak login i hasło. Nie udostępniać ich i nie wpisywać na stałe w kod. Trzymać je w osobnym pliku konfiguracyjnym lub w zmiennych środowiskowych.
- [F] Odwołanie: ikona X przy kluczu → Delete (nieodwracalne). Można ustawić TTL. Klucz działa tylko na stacku, na którym go utworzono.
- [I] Lokalnie: plik poza repozytorium (np. `~/.config/onshape/creds`, `chmod 600`) albo menedżer sekretów. Agent nie powinien wypisywać kluczy w logach.
- [I] Ryzyko: klucz z Write/Delete daje pełny dostęp do wszystkich dokumentów konta, nie tylko projektu. Wyciek może też zużyć roczną pulę i wtedy przychodzi 402.

## 6. Free a dokumenty publiczne

- [F] Plan Free jest przeznaczony dla niekomercyjnych projektów publikowanych publicznie. Moderator forum potwierdza, że plan Free jest „public only”, a dokumentów prywatnych nie można na nim tworzyć ani edytować (zmiana z 2016 r.).
- [I] Dokument utworzony przez API na Free będzie publiczny: albo API wymusi publiczność, albo odrzuci próbę utworzenia prywatnego. Oficjalnego opisu zachowania `POST /documents` na Free **nie znalazłem**.
- [I] Konsekwencja: każdy może podejrzeć i skopiować model. Nie umieszczać w nim danych osobowych.
- Źródła: [Onshape Free](https://www.onshape.com/en/products/free), [forum: Free plan public only](https://forum.onshape.com/discussion/comment/93182/) (znalezione w wynikach wyszukiwania; forum wymaga logowania, więc wątku nie otwierałem), [Fabbaloo 2018](https://www.fabbaloo.com/blog/2018/8/15/onshape-tightens-licensing-for-free-users)
