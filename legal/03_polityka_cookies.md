# POLITYKA COOKIES SERWISU TINDUR

**Wersja:** 1.0  
**Data wejscia w zycie:** [DATA]  
**Operator:** Tindur ehf., z siedziba w Reykjaviku, Islandia  
**Kontakt:** privacy@tindur.is  

---

## &sect; 1. Czym sa pliki cookies

1. Pliki cookies (ciasteczka) to male pliki tekstowe zapisywane na urzadzeniu koncowym Uzytkownika (komputer, tablet, smartfon) przez przegladarke internetowa podczas odwiedzania stron internetowych.
2. Podobne technologie obejmuja: local storage, session storage, pixel tags (web beacons), fingerprinting przegladarki.
3. W niniejszej Polityce termin "cookies" obejmuje rowniez powyzsze technologie, o ile nie wskazano inaczej.

---

## &sect; 2. Podstawa prawna

1. Stosowanie plikow cookies przez Serwis Tindur odbywa sie zgodnie z:
   a) Dyrektywa 2002/58/WE Parlamentu Europejskiego i Rady (Dyrektywa ePrivacy), zmieniona Dyrektywa 2009/136/WE;
   b) GDPR/RODO (Rozporzadzenie (UE) 2016/679) -- w zakresie, w jakim cookies stanowia dane osobowe;
   c) islandzkim Act on Electronic Communications (rafraeðislög, nr 70/2022), transponujacym Dyrektywe ePrivacy;
   d) wytycznymi EDPB dotyczacymi zgody (Wytyczne 05/2020).
2. Cookies scisle niezbedne do dzialania Serwisu nie wymagaja zgody Uzytkownika (art. 5 ust. 3 Dyrektywy ePrivacy -- wyjatek techniczny).
3. Wszystkie pozostale cookies wymagaja uprzedniej, dobrowolnej, swiadomej i jednoznacznej zgody Uzytkownika.

---

## &sect; 3. Mechanizm zarzadzania zgodami (Consent Management)

1. Przy pierwszej wizycie w Serwisie Uzytkownikowi wyswietlany jest baner cookies (Consent Management Platform -- CMP) umozliwiajacy:
   a) zaakceptowanie wszystkich cookies;
   b) odrzucenie wszystkich cookies opcjonalnych (z pozostawieniem scisle niezbednych);
   c) indywidualny wybor kategorii cookies;
   d) zapoznanie sie z niniejsza Polityka Cookies.
2. Zgoda jest rejestrowana i przechowywana jako dowod spelnienia wymagan GDPR. Identyfikator zgody (consent ID) jest przechowywany w localStorage przegladarki.
3. Uzytkownik moze w kazdej chwili zmienic lub wycofac swoja zgode za posrednictwem:
   a) ikony ustawien cookies dostepnej w stopce Serwisu;
   b) ustawien przegladarki internetowej.
4. Wycofanie zgody nie wplywa na zgodnosc z prawem przetwarzania dokonanego przed wycofaniem.
5. Serwis nie uzywa tzw. "cookie walls" -- dostep do Serwisu nie jest uzalezniony od akceptacji cookies opcjonalnych.
6. Brak interakcji z banerem cookies (zamkniecie baneru bez wyboru) jest traktowany jako brak zgody na cookies opcjonalne.

---

## &sect; 4. Kategorie plikow cookies

Serwis Tindur wykorzystuje nastepujace kategorie plikow cookies:

### 4.1. Cookies scisle niezbedne (Strictly Necessary)

Cookies te sa niezbedne do prawidlowego dzialania Serwisu. Nie wymagaja zgody Uzytkownika.

| Nazwa cookie | Dostawca | Cel | Czas wygasniecia | Typ |
|---|---|---|---|---|
| `sb-access-token` | Supabase (first-party) | Token uwierzytelniania sesji JWT -- logowanie Organizatorow i Przewodnikow | Sesja / 1 godzina | Niezbedny |
| `sb-refresh-token` | Supabase (first-party) | Odswiezenie tokenu sesji JWT | 7 dni | Niezbedny |
| `__stripe_mid` | Stripe | Identyfikator urzadzenia do zapobiegania oszustwom platniczym | 1 rok | Niezbedny |
| `__stripe_sid` | Stripe | Identyfikator sesji platniczej | 30 minut | Niezbedny |
| `tindur_consent` | Tindur (first-party) | Przechowywanie preferencji zgody na cookies | 12 miesiecy | Niezbedny |
| `tindur_csrf` | Tindur (first-party) | Token CSRF -- ochrona przed atakami Cross-Site Request Forgery | Sesja | Niezbedny |
| `tindur_session` | Tindur (first-party) | Identyfikator sesji Uzytkownika | Sesja | Niezbedny |

### 4.2. Cookies funkcjonalne (Functional)

Cookies te umozliwiaja zaawansowane funkcje i personalizacje. Wymagaja zgody.

| Nazwa cookie | Dostawca | Cel | Czas wygasniecia | Typ |
|---|---|---|---|---|
| `tindur_lang` | Tindur (first-party) | Zapamietanie wybranego jezyka interfejsu | 12 miesiecy | Funkcjonalny |
| `tindur_currency` | Tindur (first-party) | Zapamietanie wybranej waluty wyswietlania cen | 12 miesiecy | Funkcjonalny |
| `tindur_recent` | Tindur (first-party) | Ostatnio przegladane oferty (localStorage) | 30 dni | Funkcjonalny |
| `tindur_widget_pref` | Tindur (first-party) | Preferencje wyswietlania Booking Widget | 30 dni | Funkcjonalny |

### 4.3. Cookies analityczne (Analytics)

Cookies te sluza do analizy sposobu korzystania z Serwisu i doskonalenia jego dzialania. Wymagaja zgody.

| Nazwa cookie | Dostawca | Cel | Czas wygasniecia | Typ |
|---|---|---|---|---|
| `_ga` | Google Analytics (opcjonalnie) | Rozroznianie unikalnych Uzytkownikow | 2 lata | Analityczny |
| `_ga_[ID]` | Google Analytics (opcjonalnie) | Utrzymywanie stanu sesji | 2 lata | Analityczny |
| `_gid` | Google Analytics (opcjonalnie) | Rozroznianie unikalnych Uzytkownikow (24h) | 24 godziny | Analityczny |
| `tindur_analytics` | Tindur (first-party, Plausible/Umami*) | Anonimowa analityka ruchu -- bez cookies* | Nie dotyczy | Analityczny |

*Uwaga: Operator rozważa wdrozenie narzedzia analitycznego niewymagajacego cookies (np. Plausible Analytics, Umami), ktore nie zapisuje danych na urzadzeniu Uzytkownika i nie wymaga zgody. W takim przypadku wiersz `_ga`, `_ga_[ID]`, `_gid` bedzie mial zastosowanie wylacznie, jesli Operator zdecyduje sie na uzycie Google Analytics.*

### 4.4. Cookies marketingowe / reklamowe (Marketing)

Na dzien wejscia w zycie niniejszej Polityki Serwis **nie wykorzystuje** cookies marketingowych ani reklamowych. W przypadku ich wprowadzenia w przyszlosci, niniejsza Polityka zostanie zaktualizowana, a Uzytkownik zostanie poproszony o odrebna zgode.

---

## &sect; 5. Cookies osob trzecich (Third-Party Cookies)

1. Serwis moze ladowac zasoby od nastepujacych dostawcow zewnetrznych, ktorzy moga ustawiac wlasne cookies:

   | Dostawca | Cel | Polityka prywatnosci |
   |---|---|---|
   | Stripe, Inc. | Obsluga platnosci, zapobieganie oszustwom | https://stripe.com/privacy |
   | Supabase, Inc. | Uwierzytelnianie, hosting danych | https://supabase.com/privacy |
   | Vercel, Inc. | Hosting, Edge Network | https://vercel.com/legal/privacy-policy |
   | Google (opcjonalnie) | Analityka (Google Analytics) | https://policies.google.com/privacy |

2. Operator nie kontroluje cookies osob trzecich. Zalecamy zapoznanie sie z politykami prywatnosci powyzszych dostawcow.
3. W przypadku cookies osob trzecich wymagajacych zgody, sa one ladowane dopiero po uzyskaniu zgody Uzytkownika za posrednictwem CMP.

---

## &sect; 6. Cookies w Booking Widget (iframe)

1. Booking Widget jest osadzany jako iframe na stronach internetowych Organizatorow.
2. W kontekscie iframe przegladarki moga blokowac cookies osob trzecich (third-party context). Serwis wykorzystuje w zwiazku z tym:
   a) atrybut `SameSite=None; Secure` dla cookies sesyjnych w kontekscie iframe;
   b) Partitioned cookies (CHIPS -- Cookies Having Independent Partitioned State) dla przegladarek obslugujacych ten standard;
   c) alternatywne mechanizmy uwierzytelniania oparte na tokenach w naglowkach HTTP (Bearer token), gdy cookies sa zablokowane.
3. Booking Widget nie ustawia cookies analitycznych ani marketingowych.

---

## &sect; 7. Zarzadzanie cookies w przegladarce

1. Niezaleznie od CMP, Uzytkownik moze zarzadzac cookies za pomoca ustawien swojej przegladarki:
   a) **Google Chrome:** Ustawienia > Prywatnosc i bezpieczenstwo > Pliki cookie i inne dane witryn;
   b) **Mozilla Firefox:** Ustawienia > Prywatnosc i bezpieczenstwo > Cookies i dane stron;
   c) **Safari:** Preferencje > Prywatnosc > Zarzadzanie danymi stron;
   d) **Microsoft Edge:** Ustawienia > Prywatnosc, wyszukiwanie i uslugi > Pliki cookie.
2. Usunięcie lub zablokowanie cookies moze spowodowac ograniczenie funkcjonalnosci Serwisu, w szczegolnosci:
   a) niemoznosc zalogowania sie do Org Dashboard;
   b) utrate preferencji jezykowych i walutowych;
   c) koniecznosc ponownego wyrazenia zgody na cookies.

---

## &sect; 8. Local Storage i Session Storage

1. Serwis wykorzystuje rowniez nastepujace dane przechowywane w Local Storage i Session Storage przegladarki:

   | Klucz | Typ | Cel | Czas przechowywania |
   |---|---|---|---|
   | `supabase.auth.token` | Local Storage | Token uwierzytelniania (JWT) | Do wylogowania |
   | `tindur.consent` | Local Storage | Preferencje zgody (consent ID, timestamp, wybory) | 12 miesiecy |
   | `tindur.cart` | Session Storage | Dane koszyka rezerwacji w Booking Widget | Sesja |
   | `tindur.widget.state` | Session Storage | Stan interfejsu Booking Widget | Sesja |

2. Local Storage i Session Storage podlegaja tym samym zasadom zgody co cookies, w zakresie, w jakim sluza celom innym niz scisle niezbedne.

---

## &sect; 9. Okres waznosci cookies

1. Cookies sesyjne -- wygasaja po zamknieciu przegladarki lub zakonczeniu sesji.
2. Cookies trwale -- wygasaja po uplywie okresu podanego w tabelach w &sect; 4.
3. Zgoda Uzytkownika na cookies jest wazna przez 12 miesiecy. Po uplywie tego okresu Uzytkownik jest ponownie proszony o wyrazenie zgody.
4. Operator okresowo (co najmniej raz na 12 miesiecy) dokonuje przegladu listy cookies i aktualizuje niniejsza Polityke.

---

## &sect; 10. Zmiany Polityki Cookies

1. Operator zastrzega sobie prawo do zmiany niniejszej Polityki Cookies, w szczegolnosci w przypadku:
   a) wprowadzenia nowych cookies;
   b) zmiany dostawcow technologii;
   c) zmiany przepisow prawa.
2. O istotnych zmianach Uzytkownik zostanie poinformowany poprzez ponowne wyswietlenie baneru cookies.
3. Aktualna wersja Polityki Cookies jest zawsze dostepna w Serwisie.

---

## &sect; 11. Kontakt

W sprawach dotyczacych plikow cookies prosimy o kontakt:

- **E-mail:** privacy@tindur.is
- **Adres:** Tindur ehf., [ADRES], Reykjavik, Islandia

---

**Tindur ehf.**  
Reykjavik, Islandia  
