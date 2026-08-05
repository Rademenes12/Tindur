#!/bin/bash
cd /root/projects/Tindur
source /root/.opencode_env
export PATH="/root/.opencode/bin:$PATH"

# 1. Architecture - gpt-5-codex
(
  opencode run --model opencode/gpt-5-codex "Jestes CTO platformy bookingowej Tindur (Islandia, Next.js 15 + Supabase + Stripe + Flutter). Zaprojektuj ARCHITEKTURE SYSTEMU w markdown. Sekcje: 1. Diagram warstw (frontend, backend, db, payments, mobile), 2. Decyzje architektoniczne (3-5 kluczowych z uzasadnieniem), 3. Schemat bazy danych (tabele + relacje), 4. API endpoints (lista najwazniejszych 20), 5. Auth flow (JWT/RLS), 6. Payment flow (Stripe Connect, webhooks), 7. Real-time (WebSockets), 8. Skalowalnosc (1M bookings/rok). Konkretnie, technicznie, po polsku." > reports/01_architecture.md 2>&1
  echo "$(date) ARCHITECTURE DONE" >> reports/progress.log
) &

# 2. Design System - claude-sonnet-4-6
(
  opencode run --model opencode/claude-sonnet-4-6 "Zaprojektuj DESIGN SYSTEM dla Tindur. Sekcje: 1. Kolory (primary, secondary, accent, semantic - 6x6 paleta z kodami hex), 2. Typografia (font, scale, weights), 3. Spacing (4-pt grid), 4. Shadows, borders, radius, 5. Motion (transitions, easings), 6. Komponenty (Button, Card, Input, Modal, Badge, Toast - kazdy z props), 7. Layout (container, grid, breakpoints), 8. Accessibility (WCAG 2.2 AA), 9. i18n (is/pl/en/de - przykladowe tlumaczenia), 10. Tone of voice. Inspiruj sie: Airbnb, Stripe, Linear. Po polsku, z kodem CSS/JSON." > reports/03_design.md 2>&1
  echo "$(date) DESIGN DONE" >> reports/progress.log
) &

# 3. Competitors - claude-sonnet-4-6
(
  opencode run --model opencode/claude-sonnet-4-6 "Przeanalizuj KONKURENCJE platform bookingowych: GetYourGuide, Viator, Booking.com Experiences, Peek, Airbnb Experiences, Klook, Tiqets, Withlocals, Headout. Dla kazdego: 1. Model biznesowy (take rate, subscription), 2. Glowny rynek, 3. Mocne strony, 4. Slabe strony, 5. Specyfika islandzka, 6. Pricing, 7. UX patterns. Na koncu: CO TINDUR POWINIEN ZROBIC INACZEJ (5-7 punktow). Po polsku, z tabelami." > reports/04_competitors.md 2>&1
  echo "$(date) COMPETITORS DONE" >> reports/progress.log
) &

# 4. Content - claude-sonnet-4-6
(
  opencode run --model opencode/claude-sonnet-4-6 "Przygotuj CONTENT PLAN dla Tindur (platforma bookingowa, rynek islandzki). Sekcje: 1. 30 TEMATOW BLOGA (tytul + opis + keywordy SEO + dlugosc), 2. KATEGORIE ATRAKCJI (10 glownych, 30 podkategorii - opis), 3. MIEJSCA (top 50 w Islandii - nazwa, opis, najlepszy sezon), 4. SEZONOWOSC (tabela miesiecy co kiedy), 5. GRUPY ODBIORCOW (5 personas), 6. SAFETY (10 artykulow o bezpieczenstwie), 7. KULTURA (8 artykulow), 8. FAQ (20 pytan z odpowiedziami). Po polsku, zachecajaco." > reports/07_content.md 2>&1
  echo "$(date) CONTENT DONE" >> reports/progress.log
) &

# 5. SEO - gemini-3.6-flash
(
  opencode run --model opencode/gemini-3.6-flash "Przygotuj STRATEGIE SEO dla Tindur. Sekcje: 1. KEYWORDS (50 fraz z intencja - informational/transactional), 2. STRUKTURA STRONY (silkowa - URL, title, H1, schema.org), 3. TECHNICAL SEO (Core Web Vitals, mobile-first), 4. CONTENT SEO (pillars, clusters, internal linking), 5. LOCAL SEO (Google Business, Bing Places), 6. LINK BUILDING, 7. ASO (App Store), 8. ANALITYKA (GTM, GA4, Search Console), 9. KONKURENCJA SEO, 10. ROADMAP (3 miesiace). Po polsku, konkretnie, z liczbami." > reports/08_seo.md 2>&1
  echo "$(date) SEO DONE" >> reports/progress.log
) &

echo "All 5 agents started"
