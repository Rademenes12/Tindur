# TINDUR — RISK ASSESSMENT
## Platforma bookingowa | Rynek islandzki
### Data: Sierpien 2026 | Status projektu: Pre-development (brak kodu)

---

## Kontekst

Tindur to platforma SaaS B2B dla touroperatorow na Islandii. Stack: Next.js 15 + Supabase + Stripe + Flutter. Hosting: Vercel + Supabase Cloud (EU/FRA). Jednoosobowy zespol deweloperski. MVP planowany na marzec 2027. Cel skali: 1M rezerwacji/rok.

**Skala ryzyka:**
- Prawdopodobienstwo (P): 1-5 (1=5%, 2=15%, 3=30%, 4=50%, 5=70%+)
- Wplyw (W): 1-5 (1=minimalny, 2=niski, 3=sredni, 4=wysoki, 5=krytyczny/firma upada)
- Wynik ryzyka = P × W (max 25)

---

## 1. TOP 20 RYZYK (Ranking P × W)

| # | Ryzyko | P (1-5) | W (1-5) | Wynik | Kategoria |
|---|--------|---------|---------|-------|-----------|
| 1 | **Jednoosobowy zespol — bus factor = 1** | 5 (70%) | 5 (krytyczny) | 25 | Operacyjne |
| 2 | **Brak klientow B2B na starcie (cold start)** | 4 (50%) | 5 (krytyczny) | 20 | Biznesowe |
| 3 | **Sezonowosc — 70% przychodow w 4 miesiace (czerwiec-wrzesien)** | 5 (70%) | 4 (wysoki) | 20 | Sezonowosc |
| 4 | **Opoznienie MVP ponad marzec 2027** | 4 (50%) | 4 (wysoki) | 16 | Techniczne |
| 5 | **Wahania kursu ISK/EUR/USD — marza zezona** | 4 (50%) | 4 (wysoki) | 16 | Walutowe |
| 6 | **Narusz[0m← [0mWrite reports/09_risks.md
Wrote file successfully.
[0m
[0m# [0mTodos
[✓] Napisać sekcję TOP 20 RYZYK z tabelą prawdopodobieństwo x wpływ
[✓] Napisać sekcję RYZYKA TECHNICZNE
[✓] Napisać sekcję RYZYKA PRAWNE
[✓] Napisać sekcję RYZYKA BIZNESOWE
[✓] Napisać sekcję RYZYKA FINANSOWE
[✓] Napisać sekcję RYZYKA OPERACYJNE
[✓] Napisać sekcję RYZYKA REPUTACYJNE
[✓] Napisać sekcję RYZYKA SEZONOWOŚCI
[✓] Napisać sekcję RYZYKA WALUTOWE
[✓] Napisać sekcję MITIGATION PLAN
[✓] Napisać sekcję DISASTER RECOVERY
[✓] Zapisać plik do reports/09_risks.md
[0m
Risk Assessment zapisany w `reports/09_risks.md`. Oto podsumowanie co zawiera:

**11 sekcji, ~450 linii, konkretne prawdopodobienstwa procentowe dla kazdego ryzyka.**

### Kluczowe ustalenia:

**TOP 3 ryzyka (najwyzszy wynik P×W):**
1. **Bus factor = 1** (25/25) — jednoosobowy zespol to najwyzsze ryzyko. Jeden wypadek i projekt umiera.
2. **Cold start B2B** (20/25) — 50% szans ze w dniu launchu nie bedzie ani jednego operatora. Rynek islandzki zdominowany przez Bokun (Tripadvisor).
3. **Sezonowosc 70/30** (20/25) — 70% przychodu w 4 miesiace. Jeden zly sezon = katastrofa.

**Specyfika dokumentu:**
- **Ryzyka techniczne** — glowne: Supabase to single point of failure (brak wlasnego backendu), RLS jako jedyna warstwa bezpieczenstwa bez code review
- **Ryzyka prawne** — GDPR wymaga DPA z 6 dostawcami, islandzkie prawo turystyczne moze wymagac licencji posrednika
- **Ryzyka biznesowe** — Bokun (za darmo, Tripadvisor backing) to dominant competitor; rynek 500 operatorow
- **Ryzyka finansowe** — Stripe moze zamrozic srodki (turystyka = high-risk), ISK to zero-decimal currency
- **Ryzyka operacyjne** — erupcje wulkanow co ~12 miesiecy, brak zasiegu LTE w interiorze Islandii
- **Ryzyka walutowe** — ISK jedną z najbardziej zmiennych walut w Europie, macierz ekspozycji 8 strumieni
- **Mitigation plan** — 20 pozycji z konkretnymi akcjami i kosztami
- **Disaster Recovery** — 6 scenariuszy z timeline'ami (Supabase down, security breach, Stripe block, developer unavailable, erupcja wulkanu, data loss), RPO=1h, RTO=4h

**Akcje P0 (natychmiast):**
- Podpisac LOI z operatorami PRZED pisaniem kodu
- Scope cut MVP do widget + panel
- Dokumentacja od dnia 1
- DPA z dostawcami przed launch
 wlasnego backendu = brak mozliwosci cache'owania danych lokalnie. Jesli Supabase padnie, aplikacja jest calkowicie martwa. Brak self-hosted fallbacka.

### 2.2 Security breach

| Scenariusz | P% | Wplyw | Opis |
|-----------|-----|-------|------|
| Wyciek RLS policy — tenant data leaking | 10% | Krytyczny | RLS to jedyna warstwa autoryzacji. Blad w policy = operator A widzi dane operatora B. |
| Kradziez JWT / session hijacking | 8% | Wysoki | Supabase Auth JWT domyslnie wazny 1h. Stolen token = pelny dostep do konta. |
| SQL injection via Supabase client | 5% | Krytyczny | supabase-js uzywa PostgREST — niskie ryzyko, ale custom queries moga byc podatne. |
| Exposed API keys (anon key w frontend) | 15% | Sredni | Supabase anon key jest publiczny z definicji, ale zle skonfigurowane RLS = otwarte drzwi. |
| Stripe webhook spoofing | 5% | Wysoki | Ktos wysyla falszywe webhooks i zmienia status platnosci na "paid". |
| Supply chain attack (npm dependency) | 8% | Wysoki | Next.js + shadcn + stripe + supabase = setki zaleznosci. |

**Specyfika Tindur:** Zero-trust RLS brzmi dobrze w teorii, ale jednoosobowy zespol = brak code review polityk bezpieczenstwa. Jeden blad w RLS policy moze ujawnic dane wszystkich operatorow.

### 2.3 Data loss

| Scenariusz | P% | Wplyw | Opis |
|-----------|-----|-------|------|
| Bledna migracja DB — nadpisanie danych | 15% | Krytyczny | `supabase db push` moze nadpisac schemat. Brak staging = migracja na prod. |
| Brak PITR w planie Free/Pro | 10% | Krytyczny | PITR wymaga Supabase Pro ($25/mies). Jesli nie wlaczony — backup tylko co 24h. |
| Uszkodzenie Storage (zdjecia przewodnikow) | 5% | Sredni | Zdjecia z check-inow — wazne dla dowodow/reklamacji. |
| Accidental DELETE/TRUNCATE | 10% | Krytyczny | Jednoosobowy zespol + brak review = literowka w SQL moze wyczyscic tabele. |
| Ransomware na maszynach deweloperskich | 3% | Wysoki | Jesli local env zawiera dane prod — wyciek + utrata. |

---

## 3. RYZYKA PRAWNE

### 3.1 GDPR / RODO

| Ryzyko | P% | Wplyw | Szczegoly |
|--------|-----|-------|-----------|
| Brak umowy powierzenia danych (DPA) z Supabase | 30% | Wysoki | Supabase przetwarza dane w EU (FRA), ale formalny DPA wymagany. Supabase oferuje DPA — trzeba podpisac. |
| Brak DPA ze Stripe | 20% | Wysoki | Stripe przetwarza dane platnicze. Wymaga osobnego DPA. Stripe ma Standard Contractual Clauses. |
| Niekompletna polityka prywatnosci | 40% | Sredni | Wymagana w 3 jezykach: islandzki, angielski, polski. Musi wymienic wszystkich subprocesorow (Vercel, Supabase, Stripe, Cloudflare, Sentry, Plausible). |
| Brak mechanizmu usuwania danych (Right to Erasure) | 35% | Wysoki | GDPR Art. 17 — uzytkownik zada usuniecia danych. Trzeba usunac z: Supabase DB, Supabase Storage, Stripe, Sentry, logi. |
| Brak DPIA (Data Protection Impact Assessment) | 25% | Sredni | Profilowanie turystow + dane platnicze = wymagany DPIA wg Art. 35 GDPR. |
| Transfer danych poza EOG (Sentry US, Vercel Edge) | 20% | Wysoki | Vercel edge nodes moga byc poza EU. Sentry domyslnie US. Wymaga SCCs lub EU-only setup. |

### 3.2 Islandzkie prawo turystyczne

| Ryzyko | P% | Wplyw | Szczegoly |
|--------|-----|-------|-----------|
| Brak licencji posrednika turystycznego | 20% | Krytyczny | Islandzka ustawa o turystyce (Lög um pakkaferðir og samtengda ferðatilhögun) moze wymagac licencji posrednika. |
| Wymog ubezpieczenia OC | 25% | Wysoki | Operatorzy turystyczni na Islandii musza miec ubezpieczenie. Tindur jako platforma moze tez potrzebowac. |
| Obowiazek informacyjny wg prawa konsumenckiego | 30% | Sredni | Islandzkie prawo konsumenckie (Neytendavernd) wymaga pelnej informacji o turze przed zakupem. |
| Regulamin niezgodny z prawem islandzkim | 25% | Sredni | Regulamin w j. polskim jest niewystarczajacy. Wymagana wersja islandzka i angielska. |

### 3.3 PSD2 / Platnosci

| Ryzyko | P% | Wplyw | Szczegoly |
|--------|-----|-------|-----------|
| Brak 3D Secure (SCA) | 15% | Wysoki | PSD2 wymaga Strong Customer Authentication dla platnosci europejskich. Stripe obsluguje automatycznie, ale trzeba wlaczyc. |
| Bledne naliczanie VAT (virðisaukaskattur) | 25% | Wysoki | Islandzki VAT na uslugi turystyczne: 11% (obnizony). Blad = kary podatkowe. |
| Brak zgodnosci z PCI DSS | 10% | Sredni | Stripe Checkout = PCI compliance przeniesiony na Stripe (SAQ A). Ale custom payment forms = wyzsze wymagania. |

---

## 4. RYZYKA BIZNESOWE

### 4.1 Brak klientow (Cold Start Problem)

| Ryzyko | P% | Wplyw | Szczegoly |
|--------|-----|-------|-----------|
| Zero touroperatorow w dniu launchu | 50% | Krytyczny | Islandia ma ~500 licencjonowanych touroperatorow. Dotarcie do nich z polskiej firmy = bariera kulturowa i jezykowa. |
| Operator testuje ale nie wdraza | 40% | Wysoki | Typowy SaaS churn: operator zaklada konto, nie konfiguruje, odchodzi po 2 tygodniach. |
| Brak turystow na widgetach operatorow | 35% | Wysoki | Nawet jesli operator wdrozy widget — jesli jego strona ma niski ruch, brak rezerwacji = rezygnacja. |
| Dluga sprzedaz B2B (cykl 3-6 miesiecy) | 45% | Sredni | Touroperatorzy to male firmy, decyzje podejmuja wolno, czesto "na koniec sezonu". |

### 4.2 Konkurencja

| Konkurent | Zagrozenie | Przewaga nad Tindur |
|-----------|-----------|---------------------|
| **Bokun (by Tripadvisor)** | Bardzo wysokie | Ugruntowana pozycja na Islandii, integracja z Viator/Tripadvisor, darmowy tier. |
| **Trekksoft** | Wysokie | Szwajcarska firma, 10+ lat na rynku, duza baza operatorow w Europie. |
| **FareHarbor (by Booking.com)** | Wysokie | Za darmo dla operatorow (pobiera od turysty), ogromna dystrybucja. |
| **Peek** | Srednie | Silna w USA, slabsza w Europie. |
| **Bókun (islandzki startup)** | Niskie-Srednie | To jest Bokun — ten sam. Zalozone w Reykjaviku, potem kupione przez TripAdvisor. |
| **Wlasne rozwiazania operatorow** | Wysokie | Wielu operatorow uzywa Google Sheets + telefonu. "Dziala — po co zmieniac?" |

**Krytyczny wniosek:** Rynek islandzki jest maly (370K mieszkancow, 2M turystow/rok) i juz zdominowany przez Bokun. Tindur musi znalezc niche (np. lepszy UX, nizsze ceny, lokalne wsparcie).

### 4.3 Ceny i model biznesowy

| Ryzyko | P% | Wplyw | Szczegoly |
|--------|-----|-------|-----------|
| Pricing za wysoki vs Bokun (ktory ma free tier) | 40% | Wysoki | Bokun oferuje darmowy plan. Tindur musi uzasadnic koszt. |
| Race to bottom — obnizanie prowizji do 0 | 25% | Wysoki | FareHarbor model: 0% dla operatora, prowizja od turysty. Trudno konkurowac ceną. |
| Klienci oczekuja custom features za free | 35% | Sredni | Maly rynek = kazdy operator chce "swoja" funkcjonalnosc. Customizacja = dlugi dev cykl. |

---

## 5. RYZYKA FINANSOWE

### 5.1 Cash flow

| Ryzyko | P% | Wplyw | Szczegoly |
|--------|-----|-------|-----------|
| 6-12 miesiecy burn rate przed pierwszym przychodem | 60% | Wysoki | MVP marzec 2027, potem onboarding klientow, sezon od czerwca. Realny przychod: lipiec-sierpien 2027. |
| Koszty infrastruktury rosna szybciej niz przychody | 30% | Sredni | Supabase Pro: $25/mies, Vercel Pro: $20/mies, Stripe: 2.9%+30c/transakcja, domena .is: ~$100/rok. Laczne: ~$100-200/mies baseline. |
| Brak rezerwy na sezon zimowy | 45% | Wysoki | Jesli cale przychody z lata wydane — zima = zero przychodu, stale koszty. |

### 5.2 Stripe

| Ryzyko | P% | Wplyw | Szczegoly |
|--------|-----|-------|-----------|
| Stripe zamrozi srodki (rolling reserve) | 15% | Krytyczny | Nowe konto Stripe + turystyka = high-risk. Stripe moze wstrzymac 10-25% srodkow na 90-120 dni. |
| Dispute/chargeback rate >1% | 10% | Krytyczny | Turystyka = wysoki chargeback (anulacje z powodu pogody). >1% = Stripe zamknie konto. |
| Stripe nie obsluguje ISK poprawnie | 10% | Wysoki | ISK nie ma centow (jest "zero-decimal currency"). Bledna implementacja = bledne kwoty. |
| Stripe Connect opozniony (payouty do operatorow) | 35% | Sredni | Bez Stripe Connect: Tindur zbiera platnosci i manualnie przelewa operatorom. Ryzyko prawne + operacyjne. |

### 5.3 Podatki

| Ryzyko | P% | Wplyw | Szczegoly |
|--------|-----|-------|-----------|
| Bledna stawka VAT — kara RSK (islandzki urzad skarbowy) | 25% | Wysoki | VAT na Islandii: 24% (standardowy) lub 11% (obnizony na turystyke/hotelarstwo). Bledna kwalifikacja = dopłata + kara. |
| Obowiazek rejestracji VAT na Islandii | 30% | Sredni | Jesli Tindur dziala z Polski ale sprzedaje na Islandii — mozliwy obowiazek rejestracji VAT w Islandii (kraj spoza EU ale EOG). |
| Podwojne opodatkowanie PL-IS | 20% | Sredni | Umowa o unikaniu podwojnego opodatkowania PL-IS istnieje, ale wymaga prawidlowej struktury. |
| Transfer pricing (polska firma, islandzki rynek) | 15% | Sredni | Jesli powstanie spolka islandzka — ceny transferowe miedzy podmiotami. |

---

## 6. RYZYKA OPERACYJNE

### 6.1 Pogoda i sily wyzsze

| Ryzyko | P% | Wplyw | Szczegoly |
|--------|-----|-------|-----------|
| Erupcja wulkanu (np. ponowna aktywnosc Fagradalsfjall/Grindavik) | 25% | Wysoki | Erupcje na Reykjanes od 2021 co ~12 miesiecy. Zamkniecie Blue Lagoon, drog, czasem lotniska. Masowe anulacje. |
| Ekstremalny wiatr/snieg — zamkniecie drog | 40% | Sredni | Ring Road (Droga nr 1) zamykana kilka razy w roku. Tury na polnoc/wschod anulowane. |
| Powodz glacjalna (jökulhlaup) | 5% | Wysoki | Rzadkie ale niszczace. Zamykaja drogi na dni/tygodnie. |
| Pandemia / ograniczenia podrozy | 5% | Krytyczny | COVID pokazal: turystyka islandzka spadla o 76% w 2020. |

### 6.2 Sezonowosc operacyjna

| Ryzyko | P% | Wplyw | Szczegoly |
|--------|-----|-------|-----------|
| Brak przewodnikow w szczycie sezonu | 35% | Wysoki | Islandia ma 370K mieszkancow. Pula przewodnikow jest ograniczona. W lipcu-sierpniu brakuje ludzi. |
| Przewodnicy pracuja na czarno / bez kwalifikacji | 20% | Wysoki | Islandzki Urzad Turystyki wymaga certyfikatow. Tindur jako platforma moze byc wspolodpowiedzialny. |
| Sprzet (samochody, lodzie) niedostepny | 30% | Sredni | Flota na Islandii jest ograniczona. W szczycie sezonu brakuje 4x4 i super jeepa. |
| Operator zamyka dzialalnosc w srodku sezonu | 10% | Wysoki | Male firmy islandzkie — moga zniknac z dnia na dzien. Turysci z oplaconymi rezerwacjami. |

### 6.3 Przewodnicy (Guide App — Flutter)

| Ryzyko | P% | Wplyw | Szczegoly |
|--------|-----|-------|-----------|
| Przewodnicy nie chca uzywac aplikacji | 40% | Wysoki | Wielu przewodnikow to ludzie 40-60 lat. "Dzwonie i mowie ze jest OK". |
| Brak zasiegu w terenie (wnetrze Islandii) | 45% | Sredni | Wyzyna centralna, Landmannalaugar, Askja — brak LTE. Aplikacja musi dzialac offline. |
| Rozladowany telefon w terenie | 30% | Niski | 10-12h tura, mróz -10°C = bateria pada. Brak check-inu. |

---

## 7. RYZYKA REPUTACYJNE

| Ryzyko | P% | Wplyw | Szczegoly |
|--------|-----|-------|-----------|
| Pierwszych 10 opinii negatywnych = smierc platformy | 30% | Krytyczny | Nowa platforma z 2-3 gwiazdkami na Google = nikt nie zaufa. |
| Wyciek danych + media coverage | 10% | Krytyczny | Islandia to maly kraj — wyciek danych turystow = front page Morgunblaðið (glowna gazeta). |
| Operator uzywa Tindur ale daje zly serwis | 35% | Wysoki | Tindur gets blame. "Zarezerwowalam przez Tindur i bylo okropnie." |
| Negatywny TripAdvisor/Google review z wina operatora | 40% | Sredni | Turysci nie rozrozniaja platformy od operatora. |
| Social media shitstorm (TikTok/Instagram) | 15% | Wysoki | Jeden viral post = tysiace wyswietlen. "Ta islandzka firma booking kradnie pieniadze". |
| Brak obslugi klienta w islandzkim | 35% | Sredni | Islandzcy klienci oczekuja wsparcia po islandzku. Polska firma = bariera. |

**Specyfika Islandii:** Kraj 370K ludzi. Wszyscy sie znaja. Jedna zla opinia = cala branża wie. Reputation = everything.

---

## 8. RYZYKA SEZONOWOSCI (Lato vs Zima)

### Rozklad ruchu turystycznego na Islandii:

| Miesiac | % rocznego ruchu | Implikacja dla Tindur |
|---------|------------------|-----------------------|
| Styczen | 3% | Minimalne przychody. Glownie northern lights. |
| Luty | 4% | Lekki wzrost (ferie zimowe EU). |
| Marzec | 5% | Poczatek ice cave season konczy sie. |
| Kwiecien | 5% | Martwy sezon — mud season. |
| Maj | 8% | Poczatek sezonu letniego. |
| Czerwiec | 13% | Pelny sezon. Biale noce. |
| Lipiec | 18% | PEAK. Maksymalne obciazenie systemu. |
| Sierpien | 17% | PEAK. Powrot z wakacji EU. |
| Wrzesien | 12% | Koniec sezonu. Northern lights zaczynaja sie. |
| Pazdziernik | 7% | Spadek. Glownie northern lights + ice caves. |
| Listopad | 4% | Niski sezon. |
| Grudzien | 4% | Swieta + New Year boost. |

### Ryzyka sezonowe:

| Ryzyko | P% | Wplyw | Szczegoly |
|--------|-----|-------|-----------|
| 70% przychodu w 4 miesiace — jeden zly sezon = katastrofa | 70% | Wysoki | Jesli latem pada (erupcja, pandemia, recesja) — nie ma z czego zyc przez 8 miesiecy. |
| Koszty stale przez 12 miesiecy, przychody przez 4 | 70% | Sredni | Supabase, Vercel, domeny, Stripe — placisz caly rok. |
| Skalowanie systemu: z 100 req/min (zima) do 10K req/min (lipiec) | 30% | Wysoki | Infrastruktura musi obsluzyc 100x peak. Supabase free/pro tier moze nie wystarczyc. |
| Operatorzy odchodza po sezonie ("wracamy w maju") | 40% | Sredni | Churn sezonowy: operator aktywny 5 miesiecy, 7 miesiecy nieaktywny. Jak naliczac subskrypcje? |
| Zimowa oferta zbyt slaba by utrzymac platforme | 50% | Sredni | Northern lights, ice caves, snowmobiles — mniejszy rynek, inni operatorzy. |

---

## 9. RYZYKA WALUTOWE (ISK / EUR / USD)

### Kontekst walutowy:

Islandzka krona (ISK) to jedna z najbardziej zmiennych walut w Europie. W 2008 stracila 50% wartosci w 3 miesiace. Srednia roczna zmiennosc ISK/EUR: 5-15%.

| Ryzyko | P% | Wplyw | Szczegoly |
|--------|-----|-------|-----------|
| Deprecjacja ISK o 10-20% — przychody w ISK, koszty w USD/EUR | 30% | Wysoki | Stripe fees w USD, Supabase/Vercel w USD, przychody od operatorow w ISK. Deprecjacja ISK = realne straty. |
| Aprecjacja ISK — tury za drogie dla turystow | 25% | Sredni | Silna ISK = Islandia jeszcze drozsza. Turysci wybieraja Norwegie/Szkocje. Mniej rezerwacji. |
| Stripe conversion fees — podwojna przewalutowanie | 40% | Sredni | Turysta placi EUR → Stripe konwertuje na ISK (lub odwrotnie) → Tindur dostaje w PLN? Kazda konwersja = 1-2% straty. |
| Brak hedgingu walutowego | 50% | Sredni | Mala firma = brak dostepu do forward contracts. Przychod z lipca moze byc warty 10% mniej we wrzesniu. |
| ISK jako "zero-decimal currency" — bledy implementacji | 15% | Wysoki | 1 ISK = 1 ISK (nie ma groszy/centow). Stripe wymaga kwot w pelnych ISK. Blad = kwota x100. |
| Ograniczenia kapitalowe Islandii (historyczne) | 5% | Wysoki | W 2008-2017 Islandia miala capital controls. Moga wrocic w kryzysie. Pieniadze zablokowane na wyspie. |

### Macierz ekspozycji walutowej:

| Strumien | Waluta IN | Waluta OUT | Ryzyko |
|----------|-----------|------------|--------|
| Platnosci turystow (EU) | EUR | — | Niskie |
| Platnosci turystow (US) | USD | — | Niskie |
| Platnosci turystow (Islandia) | ISK | — | Srednie |
| Prowizje operatorow | ISK | — | Wysokie |
| Stripe fees | — | USD | Srednie |
| Supabase/Vercel | — | USD | Srednie |
| Wynagrodzenie dewelopera | — | PLN | Niskie |
| Podatki islandzkie | — | ISK | Srednie |

---

## 10. MITIGATION PLAN

### Dla kazdego ryzyka z TOP 20:

| # | Ryzyko | Mitygacja | Priorytet | Koszt |
|---|--------|-----------|-----------|-------|
| 1 | **Bus factor = 1** | (a) Dokumentacja WSZYSTKIEGO — kazdy komponent, kazda RLS policy, kazdy deploy step. (b) Kod na GitHub z CI/CD — jesli dev zniknie, ktos inny moze przejac. (c) Unikac "clever code" — prosty, czytelny, standardowy stack. (d) Rozwazyc freelancera na code review. | Krytyczny | $200-500/mies (freelancer) |
| 2 | **Cold start B2B** | (a) Podpisac 3-5 LOI (Letter of Intent) PRZED budowa MVP. (b) Zaczac od 1 operatora jako design partner (za darmo / ze znizka). (c) Dojechac na Islandie i spotkac sie osobiscie. (d) Wziac udzial w Iceland Tourism Expo. (e) Cold email w j. angielskim (nie islandzkim). | Krytyczny | $2000-5000 (podroze + targi) |
| 3 | **Sezonowosc 70/30** | (a) Oferowac zimowe produkty: northern lights, ice caves, snowmobiles. (b) Roczne subskrypcje ze znizka (nie miesieczne). (c) Budowac rezerwe finansowa: 50% przychodu z lata = rezerwa na zime. (d) Rozwazyc ekspansje na inne rynki (Wyspy Owcze, Grenlandia). | Wysoki | $0 (strategia) |
| 4 | **Opoznienie MVP** | (a) Scope cut: MVP = booking widget + panel operatora. BEZ Flutter app, BEZ blog CMS, BEZ analytics. (b) 2-tygodniowe sprinty z demo. (c) Uzywac gotowych komponentow (shadcn/ui). (d) Deadline: sezon 2027 zaczyna sie w maju — MVP musi byc gotowy w kwietniu. | Krytyczny | $0 (dyscyplina) |
| 5 | **Wahania ISK** | (a) Ceny w EUR jako bazowa waluta (nie ISK). (b) Stripe multi-currency: turysta placi w swojej walucie. (c) Trzymac przychody w EUR na koncie EUR. (d) Operatorzy fakturuja w EUR lub ISK — ich wybor. (e) Kwartalny przeglad kursow i cen. | Wysoki | $0 (konfiguracja) |
| 6 | **GDPR breach** | (a) Podpisac DPA z Supabase, Stripe, Vercel, Cloudflare, Sentry. (b) Sentry i analytics TYLKO w EU (sentry.io EU region). (c) Minimalizacja danych — nie zbieraj czego nie potrzebujesz. (d) Szyfrowanie at-rest i in-transit (Supabase domyslnie). (e) Polityka prywatnosci w 3 jezykach. (f) Mechanizm Right to Erasure — skrypt do usuwania danych usera. | Krytyczny | $500-1000 (prawnik GDPR) |
| 7 | **Stripe blokada konta** | (a) Dispute rate monitoring — alert na >0.5%. (b) Jasna polityka anulacji: "Darmowa anulacja do 48h przed tura. Potem 50%." (c) Stripe Radar rules: block high-risk transactions. (d) 3D Secure wlaczony obligatoryjnie. (e) Przygotowac backup payment processor (np. Adyen). | Krytyczny | $0 (konfiguracja) |
| 8 | **Downtime Supabase/Vercel** | (a) Health check endpoint + UptimeRobot alert. (b) Status page Tindur (np. Instatus.com, $20/mies). (c) Graceful degradation: jesli Supabase padnie — wyswietl "Prosimy sprobowac za 30 minut" z kontaktem telefonicznym. (d) Rozwazyc cache layer (Redis/Upstash) dla krytycznych danych. | Wysoki | $30-50/mies |
| 9 | **Konkurencja Bokun** | (a) NIE konkuruj na features — Bokun ma 10 lat przewagi. (b) Konkuruj na: UX widgetu (szybszy, ladniejszy), lokalne wsparcie, nizszy pricing. (c) Niche: mali operatorzy (1-5 osob) ktorzy nie potrzebuja enterprise Bokun. (d) Integracja z islandzkimi systemami (Kennitala ID, islandzkie banki). | Wysoki | $0 (strategia) |
| 10 | **Negatywne opinie** | (a) Pierwsi klienci = handpicked, premium obsluga. (b) Proaktywne zbieranie opinii po kazdej rezerwacji. (c) Szybka reakcja na negatyw (<2h). (d) Nigdy nie kasuj negatywnych opinii — odpowiadaj profesjonalnie. | Wysoki | $0 (czas) |
| 11 | **Cash flow gap** | (a) Bootstrapping: minimalne koszty przez 12 miesiecy. (b) Budzet: $3000-5000 na 12 mies infra + marketing. (c) Rozwazyc freelancing rownolegle (50/50 czas). (d) Nie brac kredytu na MVP. | Wysoki | $3000-5000 (rezerwa) |
| 12 | **Islandzkie regulacje** | (a) Konsultacja z islandzkim prawnikiem (1-2h, ~$300). (b) Sprawdzic Ferðamálastofa (Icelandic Tourist Board) wymagania. (c) Rozwazyc rejestracje spolki islandzkiej (ehf). | Sredni | $300-1000 (prawnik) |
| 13 | **Utrata danych** | (a) Supabase PITR wlaczony (Pro plan). (b) Codzienny `supabase db dump` do S3/Backblaze. (c) Testowy restore co kwartal. (d) Nigdy `db push` na prod bez backupu. (e) Supabase Storage backup via rclone. | Krytyczny | $25/mies (Pro plan) |
| 14 | **DDoS / brute-force** | (a) Cloudflare WAF + Rate Limiting. (b) Supabase rate limiting (wbudowany). (c) @upstash/ratelimit na API routes. (d) Fail2ban equivalent na auth (max 5 prob logowania). | Sredni | $0-20/mies (Cloudflare free/pro) |
| 15 | **Pogoda / erupcja** | (a) Automatyczne powiadomienia z Vedur.is (Icelandic Met Office) API. (b) "Force majeure" klauzula w regulaminie. (c) Automatyczny refund workflow dla anulowanych tur. (d) Ubezpieczenie od zywiołow. | Sredni | $0 (integracja API) |
| 16 | **Odejscie przewodnikow** | (a) Guide app musi byc PROSTA — 3 przyciski max. (b) Benefit dla guidow: portfolio, statystyki, referencje. (c) Nie wiazac guidow kontraktem z Tindur — to pracownicy operatora. | Sredni | $0 |
| 17 | **Bledny VAT** | (a) Konsultacja z islandzkim ksiegowym ($200-400). (b) VAT engine: 11% turystyka, 24% standard. (c) Automatyczne raportowanie VAT. (d) Kwartalny przeglad stawek. | Wysoki | $200-400 (ksiegowy) |
| 18 | **Zima — spadek rezerwacji** | (a) Zimowy pakiet: northern lights + ice caves + hot springs. (b) Obnizenie subskrypcji zimowej (lub pause plan). (c) Marketing content: "10 Things to Do in Iceland in Winter". (d) Targetowanie rynkow z feriami zimowymi (Niemcy, Skandynawia). | Sredni | $0 (marketing) |
| 19 | **Social media kryzys** | (a) Google Alerts na "Tindur" + "booking" + "Iceland". (b) Przygotowany template odpowiedzi na kryzysy. (c) Nie reaguj emocjonalnie — fakty + rozwiazanie. (d) Jesli wirus — proaktywny post z wyjasnieniem. | Sredni | $0 |
| 20 | **Zmiana pricingu Supabase/Vercel** | (a) Monitorowac changelogi i blogi obu firm. (b) Architektura umozliwiajaca migracje: Supabase → self-hosted Supabase lub Neon. Vercel → Cloudflare Pages. (c) Nie uzywac Vercel-specific features (Edge Config, KV) bez abstrakcji. | Sredni | $0 (architektura) |

---

## 11. DISASTER RECOVERY PLAN

### Scenariusz 1: Supabase padnie (database + auth + storage)

| Krok | Czas | Akcja |
|------|------|-------|
| 0-5 min | Detekcja | UptimeRobot alert → SMS/email do dewelopera. Sprawdz status.supabase.com. |
| 5-15 min | Komunikacja | Wlacz maintenance page na Vercel (statyczny HTML). Post na statuspage Tindur. Email do aktywnych operatorow. |
| 15-60 min | Monitoring | Sledz Supabase status. Zbieraj tickety od operatorow. |
| 1-6h | Eskalacja | Jesli >1h — rozważ przywrócenie z backupu na alternatywnym Supabase project lub Neon. |
| 6h+ | Failover | Odtworz DB z ostatniego `db dump`. Zmien connection string w Vercel env. Redeploy. |
| Post-mortem | 24h po | Analiza przyczyn. Aktualizacja DR planu. Komunikacja do operatorow. |

**SLA wewnetrzny:** Powrot do dzialania w 6h (business hours) / 12h (noc/weekend).

### Scenariusz 2: Security breach — wyciek danych

| Krok | Czas | Akcja |
|------|------|-------|
| 0 min | Detekcja | Sentry alert, raport uzytkownika, lub monitoring anomalii (nietypowe queries). |
| 0-30 min | Containment | (a) Zablokuj dotkniete konta. (b) Rotuj wszystkie klucze API (Supabase service_role, Stripe keys). (c) Wylacz dotkniete endpointy. |
| 30-60 min | Assessment | (a) Sprawdz audit_log — kto, co, kiedy. (b) Okresl zakres wycieku (ile rekordow, jakie dane). (c) Sprawdz czy dane platnicze naruszane (Stripe = osobny system). |
| 1-24h | Notyfikacja | (a) GDPR Art. 33: zgloszenie do Persónuvernd (islandzki organ ochrony danych) w ciagu 72h. (b) GDPR Art. 34: powiadomienie uzytkownikow jesli wysokie ryzyko. (c) Powiadomienie operatorow. |
| 24-72h | Naprawa | (a) Napraw vulnerability. (b) Code review calej warstwy bezpieczenstwa. (c) Pentest. |
| 1 tydzien | Post-mortem | (a) Pelny raport. (b) Aktualizacja polityk RLS. (c) Rozwazyc zewnetrzny audyt bezpieczenstwa. |

**GDPR timeline:** 72h na zgloszenie do organu nadzorczego. Kara za brak zgloszenia: do 10M EUR lub 2% rocznego obrotu.

### Scenariusz 3: Stripe zablokuje konto

| Krok | Czas | Akcja |
|------|------|-------|
| 0 | Detekcja | Email od Stripe — "Your account has been restricted". |
| 0-2h | Komunikacja | (a) Powiadom operatorow: "Platnosci tymczasowo niedostepne". (b) Widget: wyswietl "Prosimy o kontakt telefoniczny". |
| 2-24h | Odwolanie | (a) Kontakt ze Stripe Support. (b) Przygotuj dokumentacje: business model, chargeback resolution, AML compliance. |
| 24h-7 dni | Plan B | (a) Aktywuj backup processor (Adyen / Mollie / lokalne islandzkie rozwiazanie — Borgun/Valitor). (b) Przekieruj webhooks. |
| 7-30 dni | Rozwiazanie | (a) Stripe przywraca lub nie. (b) Jesli nie — pelna migracja na alternatywny procesor. |

### Scenariusz 4: Developer niedostepny (choroba, wypadek)

| Krok | Czas | Akcja |
|------|------|-------|
| 0-24h | — | System dziala sam (serverless). Brak zmian kodu. |
| 1-7 dni | Monitoring | UptimeRobot/Sentry alerty ida na email. Operatorzy kontaktuja support email. |
| 7-14 dni | Backup dev | (a) Dokumentacja + GitHub repo + CI/CD = ktos inny moze przejac. (b) Lista zaufanych freelancerow z dostepem emergency. |
| 14+ dni | Handover | (a) Freelancer przejmuje maintenance. (b) Operatorzy powiadomieni o zmianie. |

**Krytyczne:** Bez dokumentacji = nikt nie przejmie projektu. Dokumentacja to NIE opcja.

### Scenariusz 5: Erupcja wulkanu / zamkniecie lotniska Keflavik

| Krok | Czas | Akcja |
|------|------|-------|
| 0-1h | Detekcja | Vedur.is alert + media. |
| 1-4h | Automatyzacja | (a) Oznacz dotkniety region w systemie. (b) Automatyczne powiadomienia do turystow z rezerwacjami w regionie. (c) Offer: reschedule lub full refund. |
| 4-24h | Komunikacja | (a) Blog post / status update. (b) Email do wszystkich operatorow w regionie. |
| 1-7 dni | Anulacje | (a) Batch refund process. (b) Stripe: uzyj "merchant-initiated refund" zeby uniknac chargebackow. |
| Post-event | — | (a) Analiza strat. (b) Aktualizacja force majeure policy. |

### Scenariusz 6: Utrata danych (accidental DELETE / corrupted migration)

| Krok | Czas | Akcja |
|------|------|-------|
| 0-5 min | Detekcja | Sentry error spike / operator zgłasza brak danych. |
| 5-15 min | Stop | (a) NATYCHMIAST wstrzymaj wszystkie migracje/deploye. (b) Nie probuj "naprawic" na prod — mozesz pogorszyc. |
| 15-30 min | Diagnoza | (a) Sprawdz co dokladnie utracone (audit_log). (b) Sprawdz Supabase PITR — do jakiego momentu mozna odtworzyc. |
| 30-60 min | Restore | (a) PITR restore do momentu sprzed incydentu. (b) LUB: `db dump` restore na nowy Supabase project → verify → swap connection. |
| 1-4h | Weryfikacja | (a) Sprawdz integralnosc danych. (b) Porownaj z ostatnim backupem. (c) Przetestuj krytyczne flows (booking, payment). |
| Post-mortem | 24h | (a) Dlaczego sie stalo. (b) Dodaj guardrails (np. required --dry-run przed migracja). |

**RPO (Recovery Point Objective):** Max 1h utraty danych (z PITR).
**RTO (Recovery Time Objective):** Max 4h do pelnego przywrocenia.

---

## PODSUMOWANIE KRYTYCZNYCH AKCJI (natychmiast)

| Priorytet | Akcja | Termin |
|-----------|-------|--------|
| P0 | Podpisac 3-5 LOI z islandzkimi operatorami PRZED pisaniem kodu | Przed MVP |
| P0 | Dokumentowac kazdy element systemu od dnia 1 | Ciagle |
| P0 | Supabase Pro plan + PITR od pierwszego dnia prod | Przy deploy |
| P0 | DPA z Supabase, Stripe, Vercel, Sentry | Przed launch |
| P1 | Konsultacja z islandzkim prawnikiem (turystyka + GDPR + VAT) | Przed launch |
| P1 | Scope cut MVP: widget + panel. Nic wiecej. | Teraz |
| P1 | Backup payment processor identified (Adyen/Mollie) | Przed launch |
| P1 | EUR jako bazowa waluta rozliczen | Przy design |
| P2 | Rezerwa finansowa na 8 miesiecy (zima) | Przed launch |
| P2 | Cloudflare WAF + rate limiting | Przy deploy |

---

*Dokument przygotowany: Sierpien 2026*
*Nastepny review: Przed launch MVP (planowo: Q1 2027)*
*Odpowiedzialny: Sole Developer / Founder*
