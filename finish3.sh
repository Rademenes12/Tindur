#!/bin/bash
cd /root/projects/Tindur
source /root/.opencode_env
export PATH="/root/.opencode/bin:$PATH"

echo "=== START $(date) ===" >> reports/finish3.log

# 1. Architecture (darmowy model)
echo "Architecture START $(date)" >> reports/finish3.log
opencode run --model opencode/deepseek-v4-flash-free "Jestes CTO platformy bookingowej Tindur (Islandia, Next.js 15 + Supabase + Stripe + Flutter). Zaprojektuj ARCHITEKTURE SYSTEMU w markdown. Sekcje: 1. Diagram warstw (frontend, backend, db, payments, mobile), 2. Decyzje architektoniczne (3-5 kluczowych z uzasadnieniem), 3. Schemat bazy danych (tabele + relacje), 4. API endpoints (lista najwazniejszych 20), 5. Auth flow (JWT/RLS), 6. Payment flow (Stripe Connect, webhooks), 7. Real-time (WebSockets), 8. Skalowalnosc (1M bookings/rok). Konkretnie, technicznie, po polsku." > reports/01_architecture.md 2>&1
echo "Architecture DONE $(date)" >> reports/finish3.log
sleep 30

# 2. Design
echo "Design START $(date)" >> reports/finish3.log
opencode run --model opencode/deepseek-v4-flash-free "Zaprojektuj DESIGN SYSTEM dla Tindur. Sekcje: 1. Kolory (primary, secondary, accent, semantic - 6x6 paleta z kodami hex), 2. Typografia (font, scale, weights), 3. Spacing (4-pt grid), 4. Shadows, borders, radius, 5. Motion, 6. Komponenty (Button, Card, Input, Modal, Badge, Toast), 7. Layout, 8. Accessibility (WCAG 2.2 AA), 9. i18n (is/pl/en/de - przykladowe tlumaczenia), 10. Tone of voice. Inspiruj sie: Airbnb, Stripe, Linear. Po polsku, z kodem." > reports/03_design.md 2>&1
echo "Design DONE $(date)" >> reports/finish3.log
sleep 30

# 3. Competitors
echo "Competitors START $(date)" >> reports/finish3.log
opencode run --model opencode/deepseek-v4-flash-free "Przeanalizuj KONKURENCJE platform bookingowych: GetYourGuide, Viator, Booking.com Experiences, Peek, Airbnb Experiences, Klook, Tiqets, Withlocals. Dla kazdego: 1. Model biznesowy (take rate, subscription), 2. Glowny rynek, 3. Mocne strony, 4. Slabe strony, 5. Specyfika islandzka, 6. Pricing, 7. UX patterns. Na koncu: CO TINDUR POWINIEN ZROBIC INACZEJ (5-7 punktow). Po polsku, z tabelami." > reports/04_competitors.md 2>&1
echo "Competitors DONE $(date)" >> reports/finish3.log
sleep 30

# 4. Content
echo "Content START $(date)" >> reports/finish3.log
opencode run --model opencode/deepseek-v4-flash-free "Przygotuj CONTENT PLAN dla Tindur. Sekcje: 1. 30 TEMATOW BLOGA (tytul + opis + keywordy SEO + dlugosc), 2. KATEGORIE ATRAKCJI (10 glownych, 30 podkategorii - opis), 3. MIEJSCA (top 30 w Islandii - nazwa, opis, najlepszy sezon), 4. SEZONOWOSC (tabela miesiecy), 5. GRUPY ODBIORCOW (5 personas), 6. SAFETY (10 artykulow o bezpieczenstwie), 7. KULTURA (8 artykulow), 8. FAQ (15 pytan z odpowiedziami). Po polsku, zachecajaco." > reports/07_content.md 2>&1
echo "Content DONE $(date)" >> reports/finish3.log
sleep 30

# 5. SEO
echo "SEO START $(date)" >> reports/finish3.log
opencode run --model opencode/deepseek-v4-flash-free "Przygotuj STRATEGIE SEO dla Tindur. Sekcje: 1. KEYWORDS (30 fraz z intencja - informational/transactional), 2. STRUKTURA STRONY (silkowa - URL, title, H1, schema.org), 3. TECHNICAL SEO (Core Web Vitals, mobile-first), 4. CONTENT SEO (pillars, clusters, internal linking), 5. LOCAL SEO, 6. LINK BUILDING, 7. ASO, 8. ANALITYKA (GTM, GA4), 9. ROADMAP (3 miesiace). Po polsku, konkretnie, z liczbami." > reports/08_seo.md 2>&1
echo "SEO DONE $(date)" >> reports/finish3.log

echo "=== ALL DONE $(date) ===" >> reports/finish3.log
