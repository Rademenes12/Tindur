# Tindur - Model Cenowy i Struktura Finansowa

> **Wersja:** 1.0 | **Data:** 2026-08-05  
> **Siedziba:** Islandia (Reykjavik) | **Rynek docelowy:** Islandia + UE  
> **Forma prawna:** ehf. (islandzka spolka z o.o.)  
> **Waluta bazowa:** ISK | **Waluty operacyjne:** ISK, EUR, USD, PLN  
> **Status:** Pre-revenue, planowanie MVP (target: marzec 2027)

---

## Spis tresci

1. [Subskrypcje](#1-subskrypcje)
2. [Take Rate od transakcji](#2-take-rate-od-transakcji)
3. [Stripe Connect - podzial paymentow](#3-stripe-connect---podzial-paymentow)
4. [Faktury](#4-faktury)
5. [Podatki](#5-podatki)
6. [Refundacje](#6-refundacje)
7. [Raportowanie finansowe](#7-raportowanie-finansowe)
8. [Kalkulacje przykladowe](#8-kalkulacje-przykladowe)
9. [Koszty infrastruktury i prognozy](#9-koszty-infrastruktury-i-prognozy)
10. [Break-even analysis](#10-break-even-analysis)

---

## 1. Subskrypcje

### 1.1 Filozofia cenowa

Tindur stosuje model **"freemium + transakcyjny"** -- darmowy plan przyciaga operatorow, prowizja od transakcji generuje glowny przychod, a plany platne odblokowuja zaawansowane funkcje. Jest to model dominujacy w branzy booking SaaS (por. Rezdy, Bokun, FareHarbor).

### 1.2 Tabela planow

| Cecha | Free | Starter | Pro | Enterprise |
|---|---|---|---|---|
| **Cena miesieczna** | 0 | 29 EUR | 99 EUR | od 499 EUR (custom) |
| **Cena roczna (rabat 20%)** | 0 | 279 EUR/rok | 949 EUR/rok | negocjowana |
| **Take rate (prowizja od bookingu)** | 5,0% | 3,5% | 2,0% | 0,5-1,5% (negocj.) |
| **Liczba experiences** | 5 | 25 | bez limitu | bez limitu |
| **Liczba zasobow (resources)** | 10 | 50 | 500 | bez limitu |
| **Liczba uzytkownikow (org)** | 2 | 5 | 20 | bez limitu |
| **Booking Widget** | tak (z branding Tindur) | tak (customizable) | tak (white-label) | tak (white-label + SDK) |
| **Aplikacja mobilna (guide)** | 1 guide | 5 guides | 20 guides | bez limitu |
| **Check-in / zdjecia** | tak | tak | tak + bulk upload | tak + API |
| **API access** | brak | read-only | full CRUD | full + webhooks |
| **Waluty** | ISK | ISK, EUR | ISK, EUR, USD, PLN | dowolne |
| **Raporty** | podstawowe | zaawansowane | custom + export | BI integration |
| **Multi-language** | IS, EN | IS, EN, DE | IS, EN, DE, FR, ES | dowolne |
| **Wsparcie** | community/FAQ | email (48h SLA) | priorytet (8h SLA) | dedicated CSM |
| **SLA uptime** | brak | 99,0% | 99,5% | 99,9% |
| **SSO / SAML** | nie | nie | nie | tak |
| **Audyt log*[0m← [0mWrite reports/06_finance.md
Wrote file successfully.
[0m
[0m# [0mTodos
[✓] Zaprojektowac kompletny model cenowy Tindur z 10 sekcjami
[✓] Sekcja 1: Subskrypcje (Free, Starter, Pro, Enterprise)
[✓] Sekcja 2: Take rate od transakcji
[✓] Sekcja 3: Stripe Connect - podzial paymentow
[✓] Sekcja 4: Faktury - waluty, terminy
[✓] Sekcja 5: Podatki - VAT, OSS, VSK
[✓] Sekcja 6: Refundacje
[✓] Sekcja 7: Raportowanie finansowe
[✓] Sekcja 8: Kalkulacje przykladowe (3 scenariusze)
[✓] Sekcja 9: Koszty infrastruktury i prognozy
[✓] Sekcja 10: Break-even analysis
[✓] Zapisac dokument do reports/06_finance.md
[0m
Dokument zapisany do `/root/projects/Tindur/reports/06_finance.md`. Oto podsumowanie:

---

## Kompletny model cenowy Tindur -- co zawiera dokument

**10 sekcji, ~550 linii, z tabelami i konkretnymi liczbami:**

### 1. Subskrypcje
4 plany: Free (0 EUR), Starter (29 EUR/mies.), Pro (99 EUR/mies.), Enterprise (499+ EUR). Kazdy plan ma inny take rate (5% -> 0,5%), limity experiences, zasobow, API access, SLA.

### 2. Take rate
Prowizja 0,5-5% od GMV, pobierana automatycznie przez Stripe Connect. Benchmarki branzowe: OTA biora 15-30%, Tindur jest 3-5x tanszy.

### 3. Stripe Connect
Destination charges z Express accounts. Pelen flow: Checkout Session -> webhook -> payout. Koszty EEA: 1,5% + 0,25 EUR (nizsze niz US). Harmonogram payoutow: T+1 do T+7 w zaleznosci od planu.

### 4. Faktury
4 typy dokumentow, 4 waluty (ISK, EUR, USD, PLN). Wymagania islandzkie + EU Directive 2006/112. Cykl fakturowania miesiec z gory (subskrypcje) + zbiorcza prowizja.

### 5. Podatki
- **Islandzki VSK:** 24% standard, 11% turystyka. Deklaracje co 2 miesiace.
- **EU:** Reverse charge dla B2B, Non-Union OSS dla B2C. Islandia NIE jest w UE VAT territory, wiec nie moze korzystac z Union OSS.
- **DAC7:** obowiazkowe raportowanie platform cyfrowych od 2025.
- Tabela stawek VAT dla 10 kluczowych rynkow.

### 6. Refundacje
3 szablony polityk (Flexible/Moderate/Strict) + custom. Stripe nie zwraca processing fee. Tindur zwraca take rate proporcjonalnie.

### 7. Raportowanie
Raporty miesieczne (5 typow), kwartalne (4 typy), roczne (4 typy). 12 KPI finansowych z celami.

### 8. Kalkulacje (3 scenariusze)
| Scenariusz | Bookings/rok | GMV | Revenue Tindur | Wynik |
|---|---|---|---|---|
| A (Startup) | 10K | 1M EUR | 43K EUR | **-15K EUR** |
| B (Growth) | 100K | 10M EUR | 411K EUR | **+102K EUR** |
| C (Scale) | 1M | 100M EUR | 3.7M EUR | **+1.8M EUR** |

### 9. Koszty infrastruktury
Infra od ~200 USD/mies. (MVP) do ~8 000 USD/mies. (Scale). Projekcja 5-letnia kosztow osobowych: 0 (founder) -> 900K EUR/rok (15 osob).

### 10. Break-even
**Break-even w Q2-Q3 roku 3 (~pazdziernik 2029)** przy ~120K bookingów/rok. Sensitivity analysis dla 5 kluczowych parametrow. Lista 6 ryzyk finansowych z mitygacja.
laci | 100,00 EUR | -- |
| Stripe processing fee (2,9% + 0,30) | -3,20 EUR | Stripe |
| Tindur take rate (5%) | -5,00 EUR | Tindur |
| Payout do operatora | **91,80 EUR** | Operator |

### 2.4 Model alternatywny: Guest fee (rozszerzenie przyszle)

W przyszlosci Tindur moze wprowadzic opcje **"guest service fee"** (3-5% doliczane do ceny dla turysty), co obniza koszt dla operatora. Model ten stosuja Airbnb i Vrbo. Decyzja powinna byc podjeta po zebraniu feedbacku z beta.

---

## 3. Stripe Connect - Podzial Paymentow

### 3.1 Architektura platnosci

Tindur uzywa **Stripe Connect** w modelu **destination charges** z Express accounts dla operatorow.

```
Turysta --> [Stripe Checkout] --> Tindur Platform Account
                                         |
                              +-----------+-----------+
                              |                       |
                      Application Fee           Transfer
                      (Tindur take rate)    (do Connected Account
                                             operatora)
```

### 3.2 Dlaczego destination charges?

| Model | Zalety | Wady | Dla Tindur? |
|---|---|---|---|
| **Direct charges** | Operator kontroluje dispute | Tindur nie widzi platnosci | NIE |
| **Destination charges** | Tindur kontroluje UX, refundy, dispute | Wiecej odpowiedzialnosci | TAK (wybor) |
| **Separate charges + transfers** | Pelna elastycznosc | Zlozonosc | NIE (na MVP) |

### 3.3 Flow platnosci krok po kroku

1. **Turysta** wybiera experience, wypelnia dane, klika "Zarezerwuj"
2. **Booking Widget** tworzy `Stripe Checkout Session` z:
   - `payment_intent_data.application_fee_amount` = take rate Tindur
   - `payment_intent_data.transfer_data.destination` = Stripe Connected Account operatora
3. **Stripe** przetwarza platnosc (3DS/SCA jesli wymagane przez PSD2)
4. **Webhook** `checkout.session.completed` -> Supabase Edge Function:
   - Aktualizuje status bookingu na `confirmed`
   - Zapisuje `payment` w bazie
5. **Stripe** automatycznie:
   - Pobiera processing fee (2,9% + 0,30 EUR)
   - Pobiera application fee (take rate Tindur)
   - Transferuje reszte do Connected Account operatora
6. **Payout do operatora** wg harmonogramu (domyslnie T+2 business days)

### 3.4 Onboarding operatora (Stripe Express)

| Krok | Opis | Czas |
|---|---|---|
| 1. Rejestracja | Operator tworzy konto w Tindur Dashboard | 5 min |
| 2. Stripe Onboarding | Redirect do Stripe Connect Onboarding (KYC, bank) | 10-15 min |
| 3. Weryfikacja | Stripe weryfikuje tozsamosc + dane bankowe | 1-3 dni |
| 4. Aktywacja | Operator moze przyjmowac platnosci | natychmiast po weryfikacji |

### 3.5 Koszty Stripe Connect

| Pozycja | Stawka | Kto placi |
|---|---|---|
| Card processing (EEA) | 1,5% + 0,25 EUR | odliczane od platnosci (de facto operator) |
| Card processing (UK) | 2,5% + 0,25 EUR | j.w. |
| Card processing (miedzynarodowe) | 3,25% + 0,25 EUR | j.w. |
| Currency conversion | +1% jesli przewalutowanie | j.w. |
| Payout fee (Express) | 0,25% + 0,25 EUR (capped at 25 EUR) | Tindur |
| Dispute/chargeback | 15 EUR za dispute | Tindur (odzyskiwane jesli wygrana) |
| Stripe Connect monthly | 0 EUR (platforma) | -- |
| Onboarding | 0 EUR | -- |

> **UWAGA:** Stawki EEA sa nizsze niz US (1,5% vs 2,9%). Wiekszosc transakcji Tindur bedzie kartami europejskimi = nizsze koszty.

### 3.6 Harmonogram payoutow

| Plan operatora | Harmonogram | Opis |
|---|---|---|
| Free | T+7 | Payout co tydzien (poniedzialek) |
| Starter | T+3 | Payout co 3 dni robocze |
| Pro | T+2 | Payout co 2 dni robocze |
| Enterprise | T+1 lub daily | Negocjowany, mozliwy instant payout* |

*Instant payouts: dodatkowe 1% od kwoty payoutu (pokrywa operator lub Tindur w ramach Enterprise).

---

## 4. Faktury

### 4.1 Rodzaje dokumentow

| Dokument | Wystawiany przez | Dla kogo | Kiedy |
|---|---|---|---|
| **Faktura za subskrypcje** | Tindur | Operator (B2B) | 1-go kazdego miesiaca |
| **Faktura za prowizje (take rate)** | Tindur | Operator (B2B) | koniec miesiaca (zbiorcza) |
| **Potwierdzenie rezerwacji** | Operator (via Tindur) | Turysta (B2C) | natychmiast po bookingu |
| **Faktura self-billing** | Tindur (w imieniu operatora) | Turysta (B2C) | na zadanie |

### 4.2 Obsluga walut

| Waluta | Zastosowanie | Kurs | System |
|---|---|---|---|
| **ISK** | Faktury dla islandzkich operatorow, VSK | kurs Sedlabanki (CBi) | domyslny |
| **EUR** | Faktury dla operatorow UE, bookings | kurs ECB (daily fix) | wymagany dla OSS |
| **USD** | Bookings od turystow spoza UE | kurs Stripe (real-time) | opcjonalny |
| **PLN** | Faktury dla polskich operatorow | kurs ECB | opcjonalny |

### 4.3 Wymagania faktury (islandzkie + UE)

Kazda faktura musi zawierac:

| Pole | Wymagane | Podstawa prawna |
|---|---|---|
| Numer faktury (sekwencyjny) | tak | VSK Act, EU Dir. 2006/112 |
| Data wystawienia | tak | j.w. |
| Dane sprzedawcy (Tindur ehf., kennitala, VSK nr) | tak | j.w. |
| Dane nabywcy (nazwa, adres, VAT ID) | tak | j.w. |
| Opis uslugi | tak | j.w. |
| Kwota netto | tak | j.w. |
| Stawka i kwota VAT/VSK | tak | j.w. |
| Kwota brutto | tak | j.w. |
| Waluta | tak | j.w. |
| Numer referencyjny platnosci | tak | j.w. |
| Adnotacja reverse charge (jesli dotyczy) | warunkowo | Art. 196 Dir. 2006/112 |

### 4.4 Cykl fakturowania

```
1-go miesiaca: Wystawienie faktury za subskrypcje (przedplata na nastepny miesiac)
~5-go miesiaca: Wystawienie zbiorczej faktury za prowizje z poprzedniego miesiaca
15-go miesiaca: Termin platnosci subskrypcji
20-go miesiaca: Termin platnosci prowizji (jesli nie auto-potraceenie)
```

> **Uwaga:** W praktyce prowizje sa automatycznie potracane przez Stripe Connect, wiec faktura prowizji jest dokumentem rozliczeniowym, a nie wezwaniem do zaplaty.

---

## 5. Podatki

### 5.1 Status podatkowy Tindur

| Parametr | Wartosc |
|---|---|
| Siedziba | Islandia (nie jest czlonkiem UE, ale nalezy do EOG/EEA) |
| Rejestracja VSK (islandzki VAT) | wymagana po przekroczeniu 2 000 000 ISK obrotu |
| Nr VSK | format: VSK + 5-6 cyfr |
| Standardowa stawka VSK | 24% |
| Obnizona stawka VSK | 11% (zakwaterowanie, transport pasazerski, uslugi touroperatorow w Islandii) |
| CIT (podatek dochodowy) | 20% |
| EU VAT | **NIE** -- Islandia nie jest w UE VAT territory |
| EU OSS | **NIE DOTYCZY** -- Tindur NIE moze rejestrowac sie w OSS (system tylko dla UE) |
| EU Non-Union OSS | MOZLIWE -- dla uslug B2C swiadczonych konsumentom w UE |

### 5.2 Schemat podatkowy wedlug typu transakcji

#### A) Subskrypcja SaaS (Tindur -> Operator)

| Scenariusz | Nabywca | VAT | Podstawa |
|---|---|---|---|
| Operator w Islandii | islandzki biznes | +24% VSK | islandzkie prawo VSK |
| Operator w UE (B2B, ma VAT ID) | biznes UE | 0% (reverse charge) | Art. 196 Dir. 2006/112 |
| Operator w UE (B2C, brak VAT ID) | konsument UE | VAT kraju nabywcy (via Non-Union OSS*) | Art. 58 Dir. 2006/112 |
| Operator poza UE/Islandia | biznes zagraniczny | 0% (usluga eksportowa) | VSK Act |

> *Tindur powinien rozwazyc rejestracje w Non-Union OSS (w jednym kraju UE) jesli swiadczy uslugi B2C w UE. Jednak glownym modelem jest B2B (operator = biznes), wiec reverse charge jest dominujacy.

#### B) Booking (Turysta -> Operator via Tindur)

Tindur jest **posrednikiem technicznym** (payment facilitator), nie sprzedawca uslugi turystycznej. Usluge turystyczna swiadczy operator. Konsekwencje:

| Element | Kto rozlicza VAT | Stawka | Uwagi |
|---|---|---|---|
| Usluga turystyczna | **Operator** | 11% VSK (jesli w Islandii) | Operator jest podatnikiem |
| Prowizja Tindur (take rate) | **Tindur** | 24% VSK (od islandzkiego operatora) lub 0% (reverse charge od operatora UE) | Tindur swiadczy usluge posrednictwa |
| Oplata Stripe | Stripe | brak (usluga finansowa zwolniona z VAT) | -- |

#### C) Prowizja od operatora UE (reverse charge)

Gdy Tindur pobiera prowizje od operatora zarejestrowanego w UE:
- Faktura Tindur **bez VAT** (0%)
- Adnotacja: "VAT reverse charge applies. The recipient is liable for VAT under Article 196 of Council Directive 2006/112/EC."
- Operator rozlicza VAT w swoim kraju (samo-obliczenie)

### 5.3 Islandzki VSK -- obowiazki Tindur

| Obowiazek | Czestotliwosc | Termin |
|---|---|---|
| Rejestracja VSK | jednorazowo | po przekroczeniu 2M ISK |
| Deklaracja VSK | co 2 miesiace (6x/rok) | 5-go dnia 2. miesiaca po zakonczeniu okresu |
| Zaplata VSK | co 2 miesiace | j.w. |
| Roczna deklaracja podatkowa (CIT) | rocznie | do 31 maja nastepnego roku |
| Raportowanie platform cyfrowych (DAC7/OECD) | rocznie | do 20 stycznia nastepnego roku |

### 5.4 Specjalne reguly dla platform cyfrowych

Od 1 stycznia 2025 Islandia wdrozyla **Digital Platform Reporting Rules** (zgodne z OECD Model Rules i EU DAC7):
- Tindur musi zbierac i raportowac dane sprzedawcow (operatorow): TIN, VAT ID, adresy, obroty
- Raport roczny do Skatturinn (islandzki urzad skarbowy) do 20 stycznia
- **Brak progu minimalnego** -- dotyczy platform kazdej wielkosci

### 5.5 EU Non-Union OSS -- kiedy ma zastosowanie

Tindur, jako firma spoza UE swiadczaca uslugi cyfrowe (SaaS) konsumentom w UE, **moze** byc zobowiazany do rejestracji w Non-Union OSS jesli:
- Swiadczy uslugi B2C osobom fizycznym w UE (np. turysta kupuje bezposrednio)
- Obroty B2C w UE przekrocza progi

**W praktyce:** Glownym modelem Tindur jest B2B (usluga dla operatorow). Bookings sa w imieniu operatora. Ryzyko B2C jest niskie na poczatku, ale nalezy monitorowac.

**Rekomendacja:** Zarejestruj sie w Non-Union OSS profilaktycznie w jednym kraju UE (np. Irlandia -- angielskojezyczny, niski CIT). Deklaracje kwartalne, nawet zerowe.

### 5.6 Tabela stawek VAT w glownych rynkach

| Kraj | Stawka standardowa | Stawka na turystyke/nocleg | Uwagi |
|---|---|---|---|
| Islandia | 24% VSK | 11% (zakwaterowanie, transport, touroperatorzy) | Nie UE |
| Niemcy | 19% | 7% (zakwaterowanie) | UE |
| Francja | 20% | 10% (zakwaterowanie) | UE |
| Hiszpania | 21% | 10% (zakwaterowanie) | UE |
| Wlochy | 22% | 10% (zakwaterowanie) | UE |
| Polska | 23% | 8% (zakwaterowanie) | UE |
| Wielka Brytania | 20% | 0-20% (kompleksowe reguly) | Nie UE (post-Brexit) |
| Norwegia | 25% | 12% (zakwaterowanie) | Nie UE, EOG |
| Dania | 25% | 25% (brak obnizki) | UE |
| Szwecja | 25% | 12% (zakwaterowanie) | UE |

---

## 6. Refundacje

### 6.1 Polityka refundacji (Cancellation Policy)

Tindur umozliwia operatorom ustawienie **wlasnych polityk anulacji**. Platforma oferuje 3 predefiniowane szablony + custom:

| Szablon | Warunki | Zwrot |
|---|---|---|
| **Elastyczny (Flexible)** | Anulacja do 24h przed doswiadczeniem | 100% zwrot |
| **Umiarkowany (Moderate)** | Anulacja do 72h (3 dni) przed | 100% zwrot |
| | Anulacja 24-72h przed | 50% zwrot |
| | Anulacja <24h | brak zwrotu |
| **Scisly (Strict)** | Anulacja do 7 dni przed | 100% zwrot |
| | Anulacja 3-7 dni przed | 50% zwrot |
| | Anulacja <3 dni | brak zwrotu |
| **Custom** | Operator definiuje wlasne reguly | dowolne |

### 6.2 Kto ponosi koszty refundacji?

| Koszt | Kto placi | Uwagi |
|---|---|---|
| Kwota zwrotu (np. 100 EUR) | **Operator** (z payoutu) | Stripe odwraca transfer |
| Stripe processing fee | **NIE podlega zwrotowi** | Stripe nie zwraca 2,9% + 0,30 |
| Tindur take rate | **Proporcjonalny zwrot** | Tindur zwraca swoja prowizje proporcjonalnie |
| Stripe refund fee | 0 EUR (Stripe nie pobiera dodatkowej oplaty za refund) | -- |

### 6.3 Flow refundacji

```
1. Turysta zglosza anulacje (widget lub email)
2. System sprawdza politykke anulacji operatora
3a. Auto-refund: jesli w terminie pelnego zwrotu -> automatyczny Stripe refund
3b. Partial refund: system oblicza % zwrotu
3c. No refund: system odmawia zwrotu, wysyla powiadomienie
4. Stripe przetwarza refund (1-5 dni roboczych do karty turysty)
5. Tindur aktualizuje booking status na 'cancelled' lub 'partially_refunded'
6. Faktura korygujaca (jesli wystawiono fakture)
```

### 6.4 Kalkulacja przykladowa -- refundacja

Booking 100 EUR, plan Free (5% take rate), anulacja 100%:

| Pozycja | Kwota | Uwagi |
|---|---|---|
| Poczatkowa platnosc | 100,00 EUR | |
| Stripe fee (nie zwrotne) | 2,75 EUR | operator traci te kwote |
| Refund do turysty | 100,00 EUR | pelny zwrot |
| Tindur zwraca take rate | 5,00 EUR | prowizja wraca do operatora |
| **Strata netto operatora** | **2,75 EUR** | = Stripe processing fee |

### 6.5 Limity i ochrona przed naduzyciem

- Max refund window: 90 dni od bookingu (wymog Stripe)
- Dispute/chargeback window: 120 dni (visa/mastercard)
- Anti-fraud: monitor repeat refund rate per operator; flag jesli >15% bookingów konczy sie refundem
- Force majeure: operator moze anulowac masowo z dashboardu (np. pogoda, erupcja wulkanu -- Islandia!)

---

## 7. Raportowanie finansowe

### 7.1 Raporty miesieczne (Monthly)

| Raport | Zawartosc | Odbiorca | Termin |
|---|---|---|---|
| **Revenue Report** | GMV, przychod Tindur (subskrypcje + prowizje), trend M/M | Zarzad Tindur | do 5-go nastepnego mies. |
| **Operator Settlement** | Podsumowanie bookingów, prowizji, payoutow per operator | Kazdy operator | do 5-go nastepnego mies. |
| **VSK/VAT Report** | Nalezny VSK, naliczony VSK, do zaplaty/zwrotu | Ksiegowosc Tindur | do 5-go nastepnego mies. |
| **Refund Report** | Liczba refundow, % refund rate, koszty | Zarzad Tindur | do 5-go nastepnego mies. |
| **Stripe Reconciliation** | Porownanie Stripe payouts vs. baza Tindur | Finanse Tindur | do 5-go nastepnego mies. |

### 7.2 Raporty kwartalne (Quarterly)

| Raport | Zawartosc | Odbiorca | Termin |
|---|---|---|---|
| **P&L (Rachunek wynikow)** | Przychody, COGS (Stripe + infra), SG&A, EBIT | Zarzad, inwestorzy | do 15-go nastepnego mies. po Q |
| **Cash Flow Statement** | Wplywy, wydatki, saldo | Zarzad | do 15-go po Q |
| **KPI Dashboard** | GMV, take rate effective, ARPU, churn, LTV, CAC | Zarzad | do 10-go po Q |
| **VAT/OSS Return** | Deklaracja Non-Union OSS (jesli zarejestrowany) | Urzad skarbowy (UE) | do konca mies. po Q |

### 7.3 Raporty roczne

| Raport | Zawartosc | Odbiorca | Termin |
|---|---|---|---|
| **Roczne sprawozdanie finansowe** | Bilans, P&L, cash flow, noty | Skatturinn, rejestr spolkowy | do 31 maja |
| **Deklaracja CIT** | Podatek dochodowy 20% | Skatturinn | do 31 maja |
| **DAC7 / Platform reporting** | Dane operatorow (obroty, TIN, adresy) | Skatturinn | do 20 stycznia |
| **Annual Review** | Podsumowanie biznesowe, prognozy | Inwestorzy, board | Q1 |

### 7.4 KPI finansowe do sledzenia

| KPI | Definicja | Cel (rok 1) | Cel (rok 3) |
|---|---|---|---|
| **GMV** | Laczna wartosc bookingów | 500K EUR | 10M EUR |
| **Net Revenue** | Subskrypcje + prowizje | 35K EUR | 500K EUR |
| **Take Rate (effective)** | Net Revenue / GMV | 4,0% | 3,5% |
| **ARPU** | Net Revenue / liczba operatorow | 50 EUR/mies. | 150 EUR/mies. |
| **Churn Rate** | % operatorow odchodzacych/mies. | <5% | <3% |
| **LTV** | ARPU / Churn Rate | 1 000 EUR | 5 000 EUR |
| **CAC** | Koszt pozyskania operatora | <200 EUR | <300 EUR |
| **LTV/CAC** | | >5x | >10x |
| **Refund Rate** | % bookingów anulowanych | <10% | <8% |
| **Net Dollar Retention** | | >105% | >120% |

---

## 8. Kalkulacje przykladowe

### 8.1 Zalozenia wspolne

| Parametr | Wartosc |
|---|---|
| Srednia wartosc bookingu (AOV) | 100 EUR (~14 000 ISK) |
| Mix planow (Free/Starter/Pro/Enterprise) | 50%/30%/15%/5% operatorow |
| Sredni wazony take rate | 3,8% (wynik z mixu planow) |
| Stripe EEA processing fee | 1,5% + 0,25 EUR |
| Refund rate | 8% |
| Sezonowosc | 60% bookingów w czerwcu-sierpniu (islandzki sezon) |

### 8.2 Scenariusz A: 10 000 bookingów/rok (Startup)

**Profil:** Rok 1, ~30 operatorow, glownie Islandia

| Pozycja | Kalkulacja | Kwota roczna |
|---|---|---|
| **GMV** | 10 000 x 100 EUR | **1 000 000 EUR** |
| **Przychod Tindur (take rate)** | 1M x 3,8% | **38 000 EUR** |
| **Przychod subskrypcji** | 5 x Starter(29) + 3 x Pro(99) x 12 mies. | **5 304 EUR** |
| **Laczny przychod Tindur** | | **43 304 EUR** |
| --- | --- | --- |
| **Koszty Stripe (platform side)** | payout fee ~0,25% x 1M | -2 500 EUR |
| **Koszty infrastruktury** (patrz sekcja 9) | | -8 400 EUR |
| **Koszty osobowe** (1 developer, part-time) | | -36 000 EUR |
| **Marketing / sprzedaz** | | -6 000 EUR |
| **Prawne / ksiegowosc** | | -4 800 EUR |
| **Laczne koszty** | | **-57 700 EUR** |
| --- | --- | --- |
| **Wynik netto** | | **-14 396 EUR** |
| **Marza operacyjna** | | **-33,2%** |

### 8.3 Scenariusz B: 100 000 bookingów/rok (Growth)

**Profil:** Rok 2-3, ~200 operatorow, Islandia + Skandynawia

| Pozycja | Kalkulacja | Kwota roczna |
|---|---|---|
| **GMV** | 100 000 x 100 EUR | **10 000 000 EUR** |
| **Przychod Tindur (take rate)** | 10M x 3,5% (nizszy mix bo wiecej Pro) | **350 000 EUR** |
| **Przychod subskrypcji** | 50 x Starter + 25 x Pro + 5 x Enterprise x 12 | **60 840 EUR** |
| **Laczny przychod Tindur** | | **410 840 EUR** |
| --- | --- | --- |
| **Koszty Stripe** | | -25 000 EUR |
| **Koszty infrastruktury** | (skalowane) | -24 000 EUR |
| **Koszty osobowe** (3 osoby) | | -180 000 EUR |
| **Marketing / sprzedaz** | | -50 000 EUR |
| **Prawne / ksiegowosc / compliance** | | -18 000 EUR |
| **Biuro / inne** | | -12 000 EUR |
| **Laczne koszty** | | **-309 000 EUR** |
| --- | --- | --- |
| **Wynik netto** | | **+101 840 EUR** |
| **Marza operacyjna** | | **+24,8%** |

### 8.4 Scenariusz C: 1 000 000 bookingów/rok (Scale)

**Profil:** Rok 4-5, ~1000 operatorow, cala UE

| Pozycja | Kalkulacja | Kwota roczna |
|---|---|---|
| **GMV** | 1 000 000 x 100 EUR | **100 000 000 EUR** |
| **Przychod Tindur (take rate)** | 100M x 3,0% (duzo Enterprise) | **3 000 000 EUR** |
| **Przychod subskrypcji** | 200 x Starter + 150 x Pro + 50 x Enterprise x 12 | **695 400 EUR** |
| **Laczny przychod Tindur** | | **3 695 400 EUR** |
| --- | --- | --- |
| **Koszty Stripe** | | -250 000 EUR |
| **Koszty infrastruktury** | | -96 000 EUR |
| **Koszty osobowe** (15 osob) | | -900 000 EUR |
| **Marketing / sprzedaz** | | -350 000 EUR |
| **Prawne / compliance / VAT** | | -80 000 EUR |
| **Biuro / podroze / inne** | | -60 000 EUR |
| **Customer success** | | -120 000 EUR |
| **Laczne koszty** | | **-1 856 000 EUR** |
| --- | --- | --- |
| **Wynik netto (pre-tax)** | | **+1 839 400 EUR** |
| **Marza operacyjna** | | **+49,8%** |
| **CIT Islandia (20%)** | | -367 880 EUR |
| **Wynik netto (post-tax)** | | **+1 471 520 EUR** |

### 8.5 Podsumowanie scenariuszy

| Metryka | A (10K) | B (100K) | C (1M) |
|---|---|---|---|
| GMV | 1M EUR | 10M EUR | 100M EUR |
| Revenue Tindur | 43K EUR | 411K EUR | 3 695K EUR |
| Koszty | 58K EUR | 309K EUR | 1 856K EUR |
| Wynik netto | -15K EUR | +102K EUR | +1 840K EUR |
| Marza operacyjna | -33% | +25% | +50% |
| Revenue / booking | 4,33 EUR | 4,11 EUR | 3,70 EUR |

---

## 9. Koszty infrastruktury i prognozy

### 9.1 Stack kosztowy

| Usluga | Plan | Koszt miesieczny | Koszt roczny | Uwagi |
|---|---|---|---|---|
| **Supabase** (DB, auth, storage, realtime) | Pro | 25 USD | 300 USD | +usage: ~50 USD/mies. na poczatku |
| **Vercel** (hosting Next.js) | Pro | 20 USD/seat | 240 USD | 1 developer; +bandwidth |
| **Stripe** | Standard | 0 USD (stala) | 0 USD | oplaty transakcyjne (patrz sekcja 3) |
| **Cloudflare** (DNS, WAF, DDoS) | Free/Pro | 0-20 USD | 0-240 USD | Free wystarczy na start |
| **Sentry** (error monitoring) | Team | 26 USD | 312 USD | |
| **Plausible Analytics** | Growth | 9 EUR | 108 EUR | self-hosted lub SaaS |
| **Email (transakcyjny)** | Resend/Postmark | 0-20 USD | 0-240 USD | 10K emails/mies. free |
| **Domena** | tindur.is + tindur.com | ~100 USD | 100 USD | roczna oplata |
| **Apple Developer** | | 99 USD | 99 USD | dla iOS guide app |
| **Google Play Developer** | | 25 USD (jednorazowo) | 25 USD (rok 1) | |
| **GitHub** | Team | 4 USD/seat | 48 USD | 1 developer |
| **UptimeRobot / BetterStack** | Free/Starter | 0-29 USD | 0-348 USD | monitoring |
| **RAZEM (start)** | | **~200-350 USD** | **~1 600-2 200 USD** | |

### 9.2 Skalowanie kosztow infra

| Faza | Bookings/rok | Supabase | Vercel | Inne | Lacznie/mies. | Lacznie/rok |
|---|---|---|---|---|---|---|
| **MVP** (rok 1) | 0-10K | 75 USD | 20 USD | 100 USD | ~200 USD | ~2 400 USD |
| **Early Growth** (rok 2) | 10K-100K | 200 USD | 60 USD | 200 USD | ~500 USD | ~6 000 USD |
| **Growth** (rok 3) | 100K-500K | 599 USD (Team) | 100 USD | 400 USD | ~1 100 USD | ~13 200 USD |
| **Scale** (rok 4-5) | 500K-1M | 2 000 USD (Enterprise) | 500 USD | 1 000 USD | ~3 500 USD | ~42 000 USD |
| **Mature** (rok 5+) | 1M+ | 5 000 USD+ | 1 500 USD | 2 000 USD | ~8 000 USD | ~96 000 USD |

### 9.3 Koszty osobowe (projekcja)

| Rok | Headcount | Rolex | Koszt roczny (brutto) | Uwagi |
|---|---|---|---|---|
| 1 | 1 | Founder/developer (full-stack) | 0 EUR (equity) | bootstrapped |
| 1 | 0,5 | Freelancer (design/mobile) | 18 000 EUR | part-time |
| 2 | 3 | +1 developer, +1 sales/marketing | 180 000 EUR | |
| 3 | 6 | +2 developers, +1 CS | 360 000 EUR | |
| 4 | 10 | +2 developers, +1 sales, +1 ops | 600 000 EUR | |
| 5 | 15 | pelny zespol | 900 000 EUR | |

> Islandia ma wysokie koszty zycia. Srednia pensja developera w Reykjaviku: ~600-700K ISK/mies. (~4 000-5 000 EUR brutto). Mozliwe zatrudnianie remote (Europa Wschodnia) w celu obnizenia kosztow.

### 9.4 Projekcja calkowitych kosztow (5 lat)

| Rok | Infra | Osobowe | Marketing | Prawne/inne | RAZEM |
|---|---|---|---|---|---|
| 1 | 2 400 EUR | 18 000 EUR | 6 000 EUR | 4 800 EUR | **31 200 EUR** |
| 2 | 6 000 EUR | 180 000 EUR | 50 000 EUR | 18 000 EUR | **254 000 EUR** |
| 3 | 13 200 EUR | 360 000 EUR | 120 000 EUR | 30 000 EUR | **523 200 EUR** |
| 4 | 42 000 EUR | 600 000 EUR | 250 000 EUR | 50 000 EUR | **942 000 EUR** |
| 5 | 96 000 EUR | 900 000 EUR | 350 000 EUR | 80 000 EUR | **1 426 000 EUR** |

---

## 10. Break-Even Analysis

### 10.1 Definicja break-even

Break-even = punkt, w ktorym **laczne przychody Tindur** (subskrypcje + prowizje) **pokrywaja laczne koszty operacyjne** (infra + osobowe + marketing + prawne).

### 10.2 Model uproszczony

Zalozenia:
- AOV = 100 EUR
- Effective take rate = 3,8%
- Sredni przychod z subskrypcji na booking = 0,5 EUR (estymata)
- **Revenue per booking = 4,30 EUR**
- Stale koszty miesieczne: patrz nizej

### 10.3 Break-even wedlug fazy

| Faza | Stale koszty/mies. | Break-even bookings/mies. | Break-even bookings/rok | Kiedy (estymata) |
|---|---|---|---|---|
| **Solo founder** (bootstrapped) | 2 600 EUR | 605 | 7 256 | mies. 12-18 (od launchu) |
| **Maly zespol** (3 osoby) | 21 167 EUR | 4 924 | 59 085 | mies. 24-30 |
| **Growth team** (6 osob) | 43 600 EUR | 10 140 | 121 674 | mies. 30-36 |
| **Scale team** (10 osob) | 78 500 EUR | 18 256 | 219 070 | mies. 36-42 |

### 10.4 Scenariusz realistyczny: kiedy Tindur zaczyna zarabiac?

```
Rok 1 (H2 2027 - H1 2028):
- MVP launch marzec 2027
- 6 miesiecy beta z 10-20 operatorami (Islandia)
- ~3 000 bookingów (polowa sezonu letniego)
- Przychod: ~13 000 EUR
- Koszty: ~31 200 EUR
- STRATA: ~18 200 EUR

Rok 2 (H2 2028 - H1 2029):
- 100-200 operatorow (Islandia + Skandynawia)
- ~40 000 bookingów
- Przychod: ~175 000 EUR
- Koszty: ~254 000 EUR
- STRATA: ~79 000 EUR

Rok 3 (H2 2029 - H1 2030):
- 300-500 operatorow (+ rynek DACH, UK)
- ~120 000 bookingów
--> BREAK-EVEN w Q2-Q3 roku 3 (okolo pazdziernik 2029)
- Przychod: ~520 000 EUR
- Koszty: ~523 200 EUR
- WYNIK: ~-3 200 EUR (prawie zero)

Rok 4 (2030-2031):
- 500-800 operatorow
- ~350 000 bookingów
- ZYSK: ~500K EUR pre-tax

Rok 5 (2031-2032):
- 800-1200 operatorow
- ~800 000 bookingów
- ZYSK: ~1.5M EUR pre-tax
```

### 10.5 Wykres break-even (ASCII)

```
Revenue & Costs (EUR '000)
    ^
3500|                                                    /  Revenue
    |                                                   /
3000|                                                  /
    |                                                 /
2500|                                                /
    |                                               /
2000|                                              /
    |                                            /   Costs
1500|                                     ____/--------
    |                              __----/
1000|                        __---/ /
    |                  __---/     /
 500|           __---/     ___--/
    |     __---/     ___--/
   0|----/-----___--/---------------------------------------> Rok
    |   Y1    Y2    Y3    Y4    Y5
    |
    |         ^
    |    Break-even (Y3 Q2-Q3)
```

### 10.6 Wrazliwosc (sensitivity analysis)

Co jesli zmienia sie kluczowe parametry?

| Parametr | Base case | Optymistyczny | Pesymistyczny | Wplyw na break-even |
|---|---|---|---|---|
| AOV | 100 EUR | 150 EUR | 70 EUR | -6 mies. / +12 mies. |
| Take rate | 3,8% | 4,5% | 3,0% | -4 mies. / +8 mies. |
| Wzrost bookingów (r/r) | 3x | 5x | 2x | -12 mies. / +18 mies. |
| Churn rate | 4%/mies. | 2%/mies. | 8%/mies. | -3 mies. / +12 mies. |
| Koszt osobowy | 60K EUR/os | 45K EUR/os (remote) | 75K EUR/os (Reykjavik) | -6 mies. / +6 mies. |

### 10.7 Kluczowe ryzyka finansowe

| Ryzyko | Prawdopodobienstwo | Wplyw | Mitygacja |
|---|---|---|---|
| Sezonowosc (60% bookingów w 3 mies.) | wysokie | cashflow gap w zimie | rezerwa 3 mies. kosztow, rynki caloroczne |
| Erupcja wulkanu / COVID | niskie | masowe anulacje, utrata GMV | fundusz rezerwowy, ubezpieczenie, polityka force majeure |
| Konkurencja (Bokun, FareHarbor) | srednie | presja cenowa na take rate | roznicowanie produktem (guide app, realtime) |
| Stripe rate increase | niskie | wzrost COGS | negocjacje volume-based, alternatywne PSP |
| Regulacje (DAC7, PSD3) | srednie | koszty compliance | proaktywna rejestracja, automatyzacja |
| Kurs ISK/EUR | srednie | wahania przychodow | pricing w EUR, hedging |

---

## Podsumowanie i rekomendacje

### Kluczowe decyzje do podjecia przed launchem:

1. **Rejestracja VSK** w Islandii -- natychmiast po pierwszej sprzedazy testowej
2. **Rejestracja Non-Union OSS** w kraju UE (rekomendacja: Irlandia) -- profilaktycznie
3. **Stripe Connect Express** -- skonfiguruj srodowisko testowe i produkcyjne
4. **Polityka refundacji** -- domyslnie "Moderate" (72h), operator moze zmienic
5. **Pricing page** -- od dnia 1 na tindur.is; komunikacja "5x tanszy niz OTA"
6. **Ksiegowosc** -- zatrudnij islandzkiego ksiegowego (endurskodun) znajacego VSK + miedzynarodowe transakcje
7. **DAC7 compliance** -- zbuduj eksport danych operatorow do raportowania od dnia 1

### Najwazniejsze metryki do osiagniecia w roku 1:

| Metryka | Target |
|---|---|
| Operatorzy zrejestrowani | 50 |
| Operatorzy aktywni (>=1 booking/mies.) | 30 |
| Bookings | 5 000-10 000 |
| GMV | 500K-1M EUR |
| Net Revenue | 25K-45K EUR |
| Burn rate | <3 000 EUR/mies. (bootstrapped) |

---

> **Disclaimer:** Niniejszy dokument ma charakter planistyczny i doradczy. Nie stanowi wiazacej porady podatkowej ani prawnej. Przed implementacja nalezy skonsultowac:
> - Islandzki doradca podatkowy (endurskodun) w zakresie VSK i CIT
> - Doradca VAT UE w zakresie Non-Union OSS i reverse charge
> - Prawnik w zakresie regulacji platform cyfrowych (DAC7, PSD2/PSD3)
> - Stripe account manager w zakresie Connect pricing i volume discounts
