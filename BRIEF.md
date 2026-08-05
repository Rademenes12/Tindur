# Tindur - Platforma Bookingowa dla Touroperatorow

## Opis
Tindur to platforma SaaS dla organizatorow turystyki (glownie Islandia). 
System umozliwia touroperatorom zarzadzanie zasobami, przewodnikom (guides) 
check-in przez aplikacje mobilna, a turystom rezerwacje przez widget.

## Uzytkownicy
- **Tourist** - rezerwuje przez Booking Widget (embeddable iframe)
- **Org Admin** - zarzadza organizacja przez Web Dashboard
- **Guide** - check-in/zdjecia przez Flutter Mobile App
- **Super Admin** - administracja platformy Tindur Admin Panel

## Stos technologiczny

### Frontend
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui
- supabase-js (client-side RLS)
- @stripe/react-stripe-js + Elements
- Hosted on Vercel (Edge + Serverless)

### Backend & Database
- Supabase Postgres (managed, auto-backup)
- Row-Level Security - zero-trust
- Supabase Edge Functions (Deno)
- Supabase Realtime - WebSocket push
- Supabase Auth (GoTrue + JWT)
- Supabase Storage (guide photos)

### Payments & Mobile
- Stripe Checkout Sessions (redirect)
- Stripe PaymentIntents (server-side)
- Stripe Webhooks -> Edge Functions
- ISK (islandzka krona) native support
- Flutter 3.x (iOS + Android)
- supabase-dart + riverpod

## Glowne komponenty
1. Booking Widget (/widget/:org_id) - embedowalny iframe/SDK
2. Org Dashboard - Next.js App Router
3. Flutter Mobile - check-in/photo dla guide'ow
4. Tindur Admin Panel - super admin

## Status: BRAK KODU
W /root/projects/Tindur/ jest tylko architecture.html.
Trzeba zbudowac od zera.

## Kolejne kroki (do zaprogramowania)
1. Inicjalizacja Next.js 15 + TypeScript
2. Setup Tailwind v4 + shadcn/ui
3. Konfiguracja Supabase (schema, RLS, auth)
4. Implementacja Booking Widget
5. Implementacja Org Dashboard
6. Integracja Stripe
7. Setup Flutter app
8. Deploy na Vercel
