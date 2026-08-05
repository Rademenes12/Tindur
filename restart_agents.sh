#!/bin/bash
cd /root/projects/Tindur
mkdir -p reports

# 1. CTO - architektura
(
  source /root/.opencode_env
  export PATH=/root/.opencode/bin:$PATH
  opencode run --model opencode/gemini-3.1-pro     "Jestes CTO platformy bookingowej Tindur (Islandia + Nordyki). Zaprojektuj ARCHITEKTURE SYSTEMU w markdown. Uwzglednij: Next.js 15 + Supabase + Stripe + Flutter. Podaj: 1. Diagram warstw, 2. Decyzje architektoniczne, 3. Schemat bazy, 4. API endpoints (top 20), 5. Auth flow, 6. Payment flow, 7. Real-time, 8. Skalowalnosc. Pisz konkretnie, technicznie, po polsku."     > reports/01_architecture.md 2>&1
  echo "$(date) CTO DONE" >> reports/progress.log
) &

# 3. Designer
(
  source /root/.opencode_env
  export PATH=/root/.opencode/bin:$PATH
  opencode run --model opencode/gemini-3.1-pro     "Zaprojektuj DESIGN SYSTEM dla Tindur. Sekcje: 1. Kolory, 2. Typografia, 3. Spacing, 4. Shadows/Radius, 5. Motion, 6. Komponenty, 7. Layout, 8. Accessibility WCAG 2.2, 9. i18n (is/pl/en/de), 10. Tone of voice. Zwroc markdown + tokeny. Inspiruj sie: Airbnb, Stripe, Linear. Po polsku, z kodem."     > reports/03_design.md 2>&1
  echo "$(date) DESIGNER DONE" >> reports/progress.log
) &

# 4. Researcher - konkurencja
(
  source /root/.opencode_env
  export PATH=/root/.opencode/bin:$PATH
  opencode run --model opencode/gemini-3.1-pro     "Przeanalizuj KONKURENCJE platform bookingowych: GetYourGuide, Viator, Booking.com Experiences, Peek, Airbnb Experiences, Klook, Tiqets. Dla kazdego: 1. Model biznesowy, 2. Rynek, 3. Mocne strony, 4. Slabe strony, 5. Specyfika islandzka, 6. Pricing, 7. UX patterns. Na koncu: CO TINDUR POWINIEN ZROBIC INACZEJ. Po polsku, z tabelami."     > reports/04_competitors.md 2>&1
  echo "$(date) RESEARCHER DONE" >> reports/progress.log
) &

# 7. Local Expert
(
  source /root/.opencode_env
  export PATH=/root/.opencode/bin:$PATH
  opencode run --model opencode/gemini-3.1-pro     "Przygotuj CONTENT PLAN dla Tindur (platforma bookingowa, rynek islandzki). Sekcje: 1. 30 TEMATOW BLOGA (SEO), 2. KATEGORIE ATRAKCJI (10+30), 3. MIEJSCA (top 50 w Islandii), 4. SEZONOWOSC (tabela miesiecy), 5. GRUPY ODBIORCOW (5 personas), 6. SAFETY (10 art), 7. KULTURA (8 art), 8. FAQ (20 pytan). Po polsku, zachecajaco."     > reports/07_content.md 2>&1
  echo "$(date) LOCAL EXPERT DONE" >> reports/progress.log
) &

# 8. SEO
(
  source /root/.opencode_env
  export PATH=/root/.opencode/bin:$PATH
  opencode run --model opencode/gemini-3.1-pro     "Przygotuj STRATEGIE SEO dla Tindur. Sekcje: 1. KEYWORDS (50 fraz), 2. STRUKTURA STRONY (silkowa), 3. TECHNICAL SEO (Core Web Vitals), 4. CONTENT SEO (pillars, clusters), 5. LOCAL SEO, 6. LINK BUILDING, 7. ASO, 8. ANALITYKA, 9. KONKURENCJA SEO, 10. ROADMAP. Po polsku, konkretnie."     > reports/08_seo.md 2>&1
  echo "$(date) SEO DONE" >> reports/progress.log
) &

echo "Restarted 5 agents"
