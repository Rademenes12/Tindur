# Architektura Systemu — Tindur Booking Platform

> Islandia · SaaS B2B dla touroperatorów · Next.js 15 + Supabase + Stripe Connect + Flutter
> Status: v0.1 (MVP) · Cel wydajnościowy: 1M bookingów/rok

---

## 1. Diagram warstw

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              KLIENCI (klient)                              │
│  ┌──────────────────┐  ┌──────────────────────┐  ┌────────────────────────┐│
│  │  Booking Widget  │  │  Org Dashboard  │  │  Flutter Mobile (iOS+Android) │
│  │  embeddable iframe │  │  (org_admin,  │  │  guides · supabase-dart+riverpod│
│  │  + SDK · Next.js 15 │  │  guides)      │  │  check-in + zdjęcia             │
│  └────────┬─────────┘  └──────────┬───┘  └───────────┬────────────────────┘│
└───────────┼───────────────────────┼────────────────────┼────────────────────┘
            │ supabase-js (RLS/JWT) │ supabase-js+Edge   │ supabase-dart
            ▼                       ▼                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│            EDGE / CONTENT (Vercel CDN + Vercel Edge)                        │
│  Next.js 15: /widget /org /admin · ISR treści publicznych · Edge auth      │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │ HTTP / WebSocket
┌───────────────────────────────────▼─────────────────────────────────────────┐
│                          BACKEND (Supabase Platform)                        │
│  ┌──────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────────┐ │
│  │ Postgres 15  │ │ Edge Functions│ │ Realtime      │ │ Storage (fotki)   │ │
│  │ + RLS (zero- │ │ (Deno)        │ │ (WS push)     │ │ S3 + CDN          │ │
│  │ trust)       │ │ webhook handle│ │ presence/CDC  │ └───────────────────┘ │
│  └──────────────┘ └───────────────┘ └───────────────┘                     │
│                            │                  ▲                             │
│                 ┌──────────▼──────────────────┴──────────┐                  │
│                 │  Auth: GoTrue (Supabase Auth) · JWT     │                 │
│                 │  RS256 · MFA · Magic Link · OAuth       │                 │
│                 └─────────────────────────────────────────┘                 │
└───────────────────────────────┬──────────────────────────────────────────────┘
                                │ HTTPS / Webhooks (Stripe-Signature)
                      ┌─────────▼──────────┐        ┌─────────────────────────┐
                      │      Stripe       │        │   Partner API (REST)     │
                      │ Checkout Sessions │        │   API keys + scopes       │
                      │ PaymentIntents   │        └─────────────────────────┘
                      │ Connect transfers │
                      │ Webhooks          │
                      └───────────────────┘
```

**Przepływ danych (skrót):** odczyty klient wykonuje głównie przez `supabase-js` + RLS.
Wszystkie operacje weryfikowalne (rezerwacja, płatność, zwroty, split pay-out do
operatorów, wysyłka maili, generowanie dokumentów) robią **Edge Functions** lub
**Stripe Webhook Handlers** z `service_role` — nigdy publiczny klient.

---

## 2. Decyzje architektoniczne (4 kluczowe)

### 2.1 Zero-trust: RLS jako pierwsza i jedyna brama dostępu
**Decyzja:** wszystkie dane dostępne przez `supabase-js` są objęte Row-Level Security
(szczegóły w `reports/02_database.sql`). Żadna tabela nie ma otwartego SELECT/INSERT.
Dostęp definiują funkcje `security definer`: `is_super_admin()`, `is_org_admin(org)`,
`is_org_staff(org)`.
**Uzasadnienie:** eliminuje klasę błędów "zapomniałem `where org_id`", skraca backend
(mało ręcznych endpointów), pasuje do zero-trust. Koszt: dyscyplina w testowaniu polityk.

### 2.2 Rozdział odczytu i zapisu: klient-RLS vs serwer-weryfikacja
**Decyzja:** odczyty – przez `supabase-js`+RLS. Zapis o znaczeniu finansowym/rezerwacyjnym
(utworzenie rezerwacji, kapacytacja, PaymentIntent, zmiana statusu) – tylko funkcje
Postgres `SECURITY DEFINER` lub Edge Functions.
**Uzasadnienie:** jedna wersja prawdy cen/kapacytetu, integralność `capacity_reserved`,
brak możliwości obejścia logiki po stronie klienta. Klient dostaje ograniczone `INSERT`
tylko tam, gdzie to bezpieczne (np. `bookings` z `customer_id = auth.uid()`).

### 2.3 Stripe Connect (destination charges) jako model pieniężny
**Decyzja:** konto platformowe przejmuje transakcję; każdy touroperator ma własne konto
Connect (Express), po opłacie wykonujemy `Transfer`/`TransferGroup` w podziale:
`platform fee + guide fee + operator payout`.
**Uzasadnienie:** KYC i wypłaty per-operator (ISK/SEK itd.), jedna integracja, możliwość
scentralizowanej kontroli refundów i wywołań webhooków. ISK traktowany native (bez
przeliczeń w transakcji).

### 2.4 Realtime przez CDC Postgre, nie przez osobny broker
**Decyzja:** Supabase Realtime (WS) + `postgres_changes` na `bookings`, `payments`,
`checkins`, `schedules`; bez osobnego brokera na etap MVP.
**Uzasadnienie:** naturalne dziedziczenie RLS (klient widzi tylko wiersze, do których ma prawa):
prawda = baza danych, brak dodatkowej infrastruktury; bezpieczna granica do dojścia
w replik i broker zewnętrznych (Ably/Soketi) gdy przekroczymy ~50k jednoczesnych kanałów.

---

## 3. Schemat bazy danych (tabele + relacje)

Pełny wykonywalny SQL: `reports/02_database.sql`. Poniżej mapa relacji.

```
auth.users ──1──N── users  (role: tourist/org_admin/guide/super_admin)
                         │
                 ┌───────┴────────────┐
                 │                    │
       organizations ──1:N── resources
             │            └──1:N── experiences ──N:1── (resource optional)
             │                          │
             │                     schedules ──N:1── experience
             │                      └──1:N── bookings ──N:1── customer (users)
             │                                ├──N:1── pricing ──N:1── experience
             │                                ├──1:1── payments (stripe)
             │                                ├──N:1── checkins (guide)
             │                                └──0:1── reviews
             └── api_keys   (REST partnerów)
                  audit_log (global, tylko service/super)
```

**Kluczowe relacje i semantyka:**

| Tabela | Kluczowe FKs | Rola | Uwagi |
|---|---|---|---|
| `organizations` | — | tenancy root | `slug` unique, `billing_address jsonb` |
| `users` | `organizations.id`, `auth.users.id` | role+organizacja | kontrola `users_org_role_check` |
| `resources` | `organizations.id` | zasoby (bus/vessel/guide/przew.) | `capacity`, `availability jsonb` |
| `experiences` | `organizations.id` | produkt | `slug` unique, `currency char(3)` |
| `schedules` | `experience_id`, `resource_id` | dostępność | `capacity_reserved≤capacity_total`, `end_at>start_at` |
| `pricing` | `experience_id` | reguły cen | strategia (`base/seasonal/early_bird/...`), date range |
| `bookings` | `schedule_id`, `pricing_id`, `customer_id` | rezerwacja | `public_id 'BKG-…'`, statusy, `source` |
| `payments` | `booking_id` | striki | `provider_payment_id unique`, statusy |
| `checkins` | `booking_id`, `guide_id` | mobilny guide | geo + zdjęcie |
| `photos` | `experience_id`/`booking_id` | Storage URL | check: experience XOR booking |
| `reviews` | `booking_id` unique, `experience_id` | 1:1 z booking | unique (experience, user) |
| `api_keys` | `organization_id` | REST partner | `key_hash` (nie plaintext) |
| `audit_log` | global | audyt | tylko `service_role`/`super_admin` |

Integralność: triggery `set_updated_at`, audyt (`log_audit_event`) na bookings/payments/
checkins/api_keys. Indeksy hotspotowe: `idx_schedules_experience_start`,
`idx_bookings_schedule`, `idx_payments_booking`, `idx_bookings_customer_status`.

---

## 4. Najważniejsze 20 endpointów API

Konwencja: publiczne pod Next.js Route Handlers `/api/*`, lub Edge Functions. Auth
wstpock-dup: anonimowy (public), JWT (GoTrue), `service_role` (wewn headle).

| # | Metoda | Ścieżka | Opis | Auth |
|---|---|---|---|---|
| 1 | GET | `/api/public/experiences?org=:slug` | Lista wystawionych experiences (ISR) | public |
| 2 | GET | `/api/public/experiences/:id` | detal + schedules + pricing | public |
| 3 | POST | `/api/web/availability` | zapytanie wolny termin pracy (schedules) | public (limit) |
| 4 | POST | `/api/checkout/session` | Utwórz Stripe Checkout (booking pending) | JWT |
| 5 | POST | `/api/webhooks/stripe` | Payment/Checkout/refund/payout webhook | `Stripe-Signature` |
| 6 | GET | `/api/bookings/:public_id` | Szczegóły bookingów (dashboard/mail) | JWT |
| 7 | POST | `/api/bookings/:public_id/cancel` | Anuluj + refund (Edge) | JWT |
| 8 | GET | `/api/org/:id/bookings?from&to&status` | Paginowane bookingi operatora | JWT (staff) |
| 9 | GET | `/api/org/:id/experiences` | Katalog experiences (CRUD list) | JWT (org_admin) |
|10 | POST | `/api/org/:id/experiences` | Utwórz experience | JWT (org_admin) |
|11 | POST | `/api/org/:id/experiences/:eid/schedules` | Utwórz schedule | JWT (org_admin) |
|12 | PATCH | `/api/org/:id/.../schedules/:sid` | Zmiana capacity/price | JWT (org_admin) |
|13 | GET | `/api/org/:id/guides` | Lista przewodników | JWT (org_admin) |
|14 | POST | `/api/org/:id/guides/invite` | Zaproś usera (rola guide) | JWT (org_admin) |
|15 | POST | `/api/org/:id/connect/onboarding` | Rozpocznij onboarding Stripe Connect | JWT (org_admin) |
|16 | GET | `/api/mobile/today` | Guide: dzisiejsze schedules+bookings+checkins | JWT (guide) |
|17 | POST | `/api/mobile/checkins/:bid/start` | Start check-in (status→in_progress) | JWT (guide) |
|18 | POST | `/api/mobile/checkins/:bid/photo` | Upload zdjęcia (Storage+link) | JWT (guide) |
|19 | POST | `/api/partner/v1/bookings` | REST dla partnerów (API key+scope) | API key |
|20 | GET | `/api/admin/orgs/metrics` | Super Admin: KPIs/payouts/fraud | JWT (super_admin) |

Operacje zmieniające stan płatności/kapacytetu to **Edge Functions** z `service_role`
(nie `supabase-js` insert) — z samodzielną kontrolą tenant/org.

---

## 5. Auth flow (JWT / RLS)

1. **Uwierzytelnienie (GoTrue):** Tourist/Org Admin — email+hasło (bcrypt) lub Magic
   Link/OAuth (Google). Guide — `POST /api/org/:id/guides/invite` tworzy `auth.users`,
   wysyła link z resetem hasła, nadaje rolę `guide`.
2. **Sesja:** `sb-access-token` (JWT RS256, ~1h) + refresh token. Access token w
   pamięci; refresh w `httpOnly` cookie (ograniczenie XSS).
3. **RLS:** przy każdym SELECT/INSERT/UPDATE Postgres czyta `auth.uid()` i funkcje
   ról. Klient nigdy nie dostaje `service_role`.
4. **Weryfikowalny zapis (Edge/service_role):** RLS pominięty → **samodzielna kontrola**
   org/roli w kodzie każdej funkcji.
5. **MFA:** opcjonalny TOTP dla `super_admin`/`org_admin`.

```
supabase-js (JWT) ──query──▶ Postgres RLS
   SELECT: is_org_staff(org_id)   → tylko wiersze swojego tenant
   INSERT booking: customer_id = auth.uid()
Niebanalny write (payment/status) ──▶ Edge fn (service_role) ──▶ walidacja org/role
```

---

## 6. Payment flow (Stripe Connect + webhooks)

Model: **Stripe Connect, destination charges** (płatność scentralizowana na platformę;

```
1. org_admin → POST /api/org/:id/connect/onboarding
   → Stripe account (Express) → link redirect → status complete
   → zapis `stripe_connect_id` (organizations.metadata)
2. Tourist → pricing → POST /api/checkout/session (service_role)
   • tworzy Booking status='pending' + Payments row
   • Checkout Session: amount+currency (ISK native), customer,
     metadata {org_id, booking_public_id, schedule_id}
3. Stripe webhook `checkout.session.completed`:
   • weryfikacja `Stripe-Signature` (HMAC)
   • booking → 'confirmed'; capacity_reserved++ (w tej transakcji);
   • payload: status 'succeeded'; DLQ/logik przy błędach (dedup po provider_payment_id)
4. Podział (opcjonalnie payment_intent.captured...): Transfer w grupie operatorowi.
5. Zwrot: POST /api/bookings/:id/cancel (Edge) → Refund → `refund.created` → booking 'cancelled'
```

**Idempotencja:** deduplikacja przez unique FK `provider_payment_id`, retry Stripe →
sprawdzenie statusu przed aktualizacją. Obsługiwane eventy: `checkout.session.completed`,
`payment_intent.succeeded/failed`, `refund.created`, `payout.paid`, `account.updated`.
`application_fee_amount` dla części platformy; operator dostaje resztę.

Waluta: **ISK natywna** (bez konwersji w transakcji); EUR/USD/PLN — przelicznik parsowany
w Edge na fee (kurs at booking-time, przechowywany w bookings).

---

## 7. Real-time (WebSockets)

Dostawca: **Supabase Realtime** (WS, port 54321 `/v1/realtime` w prod – standardowy).

```ts
const ch = supabase.channel('booking-live')
  .on('postgres_changes',
      { event: '*', schema: 'public', table: 'bookings',
        filter: `organization_id=eq.${orgId}` },
      (p) => router.refresh() / updateState)
  .subscribe()
```

- **Bezpieczeństwo:** każda zmiana jest **nadawana przez RLS** — klient otrzymuje
  tylko wiersze, do których ma prawo. Zero custom sockets/globalnych kanałów.
- **Zastosowania:**
  - Mobile (guide): status bookingów/schedules na żywo, „today”, no-we booking
    na przypisany schedule.
  - Widget (customer): po checkout (edge) → status → `...`→`confirmed`.
  - Dashboard (org): zdjęcia check-in i occupancy na żywo.
- **Presence:** teams/reference dla guide (zastępstwa) przez `postgres_changes` na
  `users` (status online).
- MVP: kanały na `bookings`, `payments`, `checkins`. Dalsza skala: replikacja do
  Ably/Soketi przy >50k jednoczesnych kanałów/subców.

---

## 8. Skalowalność (cel: 1M bookingów / rok)

- **Rachunek:** 1M/rok ≈ 3,3k/dzień ≈ 274/godz ≈ **~5/s średnie**; szczyt (ferie/
  Islandia, ~×15–20) → **~100/s ekstrema**. Rozmiar: `bookings` ~2,7GB/rok,
  `audit_log` ~10M rzędów/rok → **partycjonowanie** (miesięczne) i archiwizacja `audit_log`
  w Ázko daty / partitioning.
- **Łatwe punky gorąca:** odczyty publiczne przez ISR/CDN (0 hits DB); Realtime tylko
  zmiany.

| Warstwa | Mechanizm skalowania |
|---|---|
| **Edge/content** | Vercel CDN + ISR dla public experiences/schedules → 0 DB na read |
| **Edge Functions** | stateless, cold-start per request, mnożenie po SUPABASE |
| **DB reads** | indeksy, read-replica (II faz) |
| **DB writes** | transakcyjne per-tenant; `capacity_reserved` w row-lock; partition history |
| **HTTP** | webhook cursor webhook idempotent (DLQ + backoff) |
| **Realtime** | Ably/Soketi above ~50k channels; Supabase do tego limitu |
| **Cron/jobs** | Edge+ cron: expiry, release zarezerwowanej capacity (min/hour) |

- **Multi-region:** primary Postgres w europe-west / eu-north (Islandia/nordic), read‑
  replica dla read; zapis do primary. Skala 10M/yr → sharding po `organization_id`.
- **Rate limiting:** per API-key + anonim scope (Redis/edge); safety anti-abuse.
- **Backup/DR:** PITR 7d (`wal-g`); regularny test restore; testy odzysku comiesięczne.

---

### Dalsze referencje
- Schemat SQL: `reports/02_database.sql`
- Model finansowy / split cen, Stripe Connect: `reports/06_finance.md`
- Checklist deploy: `reports/10_devops.md`
- Diagram HTML: `tindur-architecture.html`