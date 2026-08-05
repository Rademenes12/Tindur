#!/bin/bash
# Tindur Masterplan - Agenci delegowani
# Uruchamia 10 agentów w tle, każdy pracuje nad swoją sekcją raportu

set -e
cd /root/projects/Tindur
mkdir -p reports
echo "[$(date)] Start agentów Tindur Masterplan"

# 1. CTO - architektura systemu
(
  source /root/.opencode_env
  export PATH=/root/.opencode/bin:$PATH
  cd /root/projects/Tindur
  opencode run --model opencode/gemini-3.1-pro \
    "Jestes CTO platformy bookingowej Tindur (Islandia + Nordyki). Zaprojektuj ARCHITEKTURE SYSTEMU w markdown. \
     Uwzglednij: Next.js 15 + Supabase + Stripe + Flutter. Podaj: \
     1. Diagram warstw (frontend, backend, db, payments, mobile) \
     2. Decyzje architektoniczne (3-5 kluczowych z uzasadnieniem) \
     3. Schemat bazy danych (tabele + relacje) \
     4. API endpoints (lista najwazniejszych 20) \
     5. Auth flow (kto, jak, JWT/RLS) \
     6. Payment flow (Stripe Connect, webhooks) \
     7. Real-time (WebSockets, co kiedy push) \
     8. Skalowalnosc (jak udzwignac 1M bookings/rok) \
     Pisz konkretnie, technicznie, po polsku." \
    > reports/01_architecture.md 2>&1
  echo "[$(date)] CTO DONE" >> reports/progress.log
) &

# 2. Backend - Supabase schema (SQL)
(
  source /root/.opencode_env
  export PATH=/root/.opencode/bin:$PATH
  opencode run --model opencode/gpt-5-codex \
    "Zaprojektuj SCHEMAT BAZY DANYCH Supabase dla Tindur (platforma bookingowa). \
     Zwroc GOTOWY SQL do skopiowania do Supabase. Tabele: \
     - organizations (operatorzy/B2B clients) \
     - users (turyści + org_admin + guide + super_admin) \
     - resources (hotele, auta, lodzie, przewodnicy) \
     - experiences (produkty/wycieczki z opisem, ceną, zdjęciami) \
     - schedules (terminy, dostępność) \
     - pricing (reguły cenowe, sezony) \
     - bookings (rezerwacje ze statusami) \
     - payments (Stripe transactions) \
     - checkins (guide check-in mobile) \
     - photos (zdjecia z wycieczek) \
     - reviews (opinie 1-5 gwiazdek) \
     - blog_posts (CMS) \
     - api_keys (dla partnerow) \
     - audit_log (wszystkie akcje) \
     Dodaj: indeksy, RLS policies, triggery, sample data. \
     Pisz po polsku, z komentarzami." \
    > reports/02_database.sql 2>&1
  echo "[$(date)] BACKEND DONE" >> reports/progress.log
) &

# 3. Designer - design system
(
  source /root/.opencode_env
  export PATH=/root/.opencode/bin:$PATH
  opencode run --model opencode/gemini-3.1-pro \
    "Zaprojektuj DESIGN SYSTEM dla Tindur (platforma bookingowa, rynek islandzki). \
     Zwroc markdown + gotowe tokeny (JSON/JS) + opis komponentow. Sekcje: \
     1. Kolory (primary, secondary, accent, semantic - 6x6 paleta) \
     2. Typografia (font, scale, weights) \
     3. Spacing (4-pt grid) \
     4. Shadows, borders, radius \
     5. Motion (transitions, easings) \
     6. Komponenty (Button, Card, Input, Modal, Badge, Toast) \
     7. Layout (container, grid, breakpoints) \
     8. Accessibility (WCAG 2.2 AA compliance) \
     9. i18n (islandzki, polski, angielski, niemiecki - przygotuj tlumaczenia kluczowych fraz) \
     10. Tone of voice (jak komunikowac sie z klientami) \
     Inspiruj sie: Airbnb, Stripe, Linear, Notion. \
     Pisz po polsku, konkretnie, z kodem." \
    > reports/03_design.md 2>&1
  echo "[$(date)] DESIGNER DONE" >> reports/progress.log
) &

# 4. Researcher - analiza konkurencji
(
  source /root/.opencode_env
  export PATH=/root/.opencode/bin:$PATH
  opencode run --model opencode/gemini-3.1-pro \
    "Przeanalizuj KONKURENCJE platform bookingowych dla Tindur. \
     Wez pod uwage: GetYourGuide, Viator, Booking.com Experiences, Peek, \
     Airbnb Experiences, Klook, Tiqets, Withlocals, Headout. \
     Dla kazdego podaj: \
     1. Model biznesowy (take rate, fee, subscription) \
     2. Głowny rynek i nisze \
     3. Mocne strony (co robia dobrze) \
     4. Slabe strony (co mozemy zrobic lepiej) \
     5. Specyficzne dla rynku islandzkiego \
     6. Pricing (ile pobieraja) \
     7. UX patterns (godne skopiowania) \
     Na koncu: CO TINDUR POWINIEN ZROBIC INACZEJ. \
     Pisz po polsku, z tabelami." \
    > reports/04_competitors.md 2>&1
  echo "[$(date)] RESEARCHER DONE" >> reports/progress.log
) &

# 5. Prawnik - regulaminy
(
  source /root/.opencode_env
  export PATH=/root/.opencode/bin:$PATH
  opencode run --model opencode/claude-opus-4-6 \
    "Jestes prawnikiem specjalizujacym sie w prawie IT i ochronie danych. \
     Przygotuj 4 dokumenty prawne dla Tindur (platforma bookingowa z siedziba w Islandii, \
     obslugujaca turystow z UE). Pisz formalnie, po polsku: \
     \
     1. REGULAMIN SERWISU (Terms of Service) - 20 paragrafow \
     2. POLITYKA PRYWATNOSCI (Privacy Policy) - zgodna z RODO/GDPR \
     3. POLITYKA COOKIES (Cookie Policy) - lista cookies, zgody \
     4. REGULAMIN REKLAMACJI I ZWROTOW - warunki cancelacji, refundacji \
     \
     Uwzglednij: \
     - Prawo islandzkie (Consumer Protection Act) \
     - GDPR (dane mieszkancow UE) \
     - Pakiet Turystyczny (UE 2015/2302) \
     - Strong Customer Authentication (PSD2) \
     - Alternative Dispute Resolution \
     Pisz konkretnie, z paragrafami, gotowe do wdrozenia." \
    > reports/05_legal.md 2>&1
  echo "[$(date)] LEGAL DONE" >> reports/progress.log
) &

# 6. Ksiegowosc - model cenowy
(
  source /root/.opencode_env
  export PATH=/root/.opencode/bin:$PATH
  opencode run --model opencode/claude-opus-4-6 \
    "Jestes doradca podatkowym. Zaprojektuj MODEL CENOWY i STRUKTURE FINANSOWA \
     dla Tindur (platforma bookingowa, siedziba Islandia, rynek UE). \
     Sekcje: \
     1. Subskrypcje (Free, Starter, Pro, Enterprise) - ceny, features, limity \
     2. Take rate od transakcji (jaka stawka, kto placa) \
     3. Stripe Connect - jak podzielic paymenty z operatorami \
     4. Faktury - co, kiedy, jak (ISK, EUR, USD, PLN) \
     5. Podatki - VAT w UE, OSS/IOSS, reverse charge, \
        obowiazki islandzkie (VSK 24%) \
     6. Refundacje - warunki, prowizje, terminy \
     7. Raportowanie finansowe (monthly, quarterly) \
     8. Kalkulacje przykladowe (3 scenariusze: 10k, 100k, 1M bookings/rok) \
     9. Koszty infrastruktury i prognozy \
     10. Break-even analysis (kiedy Tindur zaczyna zarabiac) \
     Pisz po polsku, z tabelami, konkretnymi liczbami." \
    > reports/06_finance.md 2>&1
  echo "[$(date)] FINANCE DONE" >> reports/progress.log
) &

# 7. Local Expert - Islandia content
(
  source /root/.opencode_env
  export PATH=/root/.opencode/bin:$PATH
  opencode run --model opencode/gemini-3.1-pro \
    "Jestes ekspertem od Islandii. Przygotuj CONTENT PLAN dla platformy bookingowej Tindur. \
     Zwroc liste tematow bloga, kategorii przewodnikow, atrakcji. \
     Sekcje: \
     1. 30 TEMATOW BLOGA (SEO-optimized) - tytul + opis + keywordy + dlugosc \
     2. KATEGORIE ATRAKCJI (10 glownych, 30 podkategorii) - opis \
     3. MIEJSCA (top 50 w Islandii) - nazwa, opis, dlugosc pobytu, najlepszy sezon \
     4. SEZONOWOSC (kiedy jechac, co kiedy) - tabela miesiecy \
     5. GRUPY ODBIORCOW (5 personas) - co kazda lubi \
     6. SAFETY (bezpieczenstwo, pogoda, woda, drogi F-roads) - 10 artykulow \
     7. KULTURA (tradycje, swieta, jezyk, kuchnia) - 8 artykulow \
     8. FAQ (20 najczesciej zadawanych pytan) - z odpowiedziami \
     Pisz po polsku, zachecajaco, konkretnie." \
    > reports/07_content.md 2>&1
  echo "[$(date)] LOCAL EXPERT DONE" >> reports/progress.log
) &

# 8. SEO Specjalista
(
  source /root/.opencode_env
  export PATH=/root/.opencode/bin:$PATH
  opencode run --model opencode/gemini-3.1-pro \
    "Jestes specjalista SEO. Przygotuj STRATEGIE SEO dla Tindur. \
     Sekcje: \
     1. KEYWORDS - 50 fraz z intencja (informational, transactional) \
     2. STRUKTURA STRONY (silkowa) - URL, title, H1, schema.org \
     3. TECHNICAL SEO (Core Web Vitals, mobile-first, crawl) \
     4. CONTENT SEO (pillars, clusters, internal linking) \
     5. LOCAL SEO (Google Business Profile, Bing Places) \
     6. LINK BUILDING (gdzie pozyskac linki) \
     7. ASO (App Store Optimization) - dla Flutter app \
     8. ANALITYKA (GTM, GA4, Search Console) \
     9. KONKURENCJA SEO (co robia) \
     10. ROADMAP (pierwsze 3 miesiace) \
     Pisz po polsku, konkretnie, z liczbami." \
    > reports/08_seo.md 2>&1
  echo "[$(date)] SEO DONE" >> reports/progress.log
) &

# 9. Risk Assessment
(
  source /root/.opencode_env
  export PATH=/root/.opencode/bin:$PATH
  opencode run --model opencode/claude-opus-4-6 \
    "Przygotuj RISK ASSESSMENT dla Tindur (platforma bookingowa, rynek islandzki). \
     Sekcje: \
     1. TOP 20 RYZYK (prawdopodobienstwo x wplyw) - tabela \
     2. RYZYKA TECHNICZNE (downtime, security breach, data loss) \
     3. RYZYKA PRAWNE (RODO, GDPR, regulamin) \
     4. RYZYKA BIZNESOWE (brak klientow, konkurencja, ceny) \
     5. RYZYKA FINANSOWE (cash flow, Stripe, podatki) \
     6. RYZYKA OPERACYJNE (pogoda, sezonowsc, przewodnicy) \
     7. RYZYKA REPUTACYJNE (opinie, social media) \
     8. RYZYKA SEZONOWOSCI (lato vs zima) \
     9. RYZYKA WALUTOWE (ISK, EUR, USD) \
     10. MITIGATION PLAN (kazde ryzyko - co robimy) \
     11. DISASTER RECOVERY (co jak padnie) \
     Pisz po polsku, konkretnie, z prawdopodobienstwami (%)." \
    > reports/09_risks.md 2>&1
  echo "[$(date)] RISK DONE" >> reports/progress.log
) &

# 10. DevOps - setup checklist
(
  source /root/.opencode_env
  export PATH=/root/.opencode/bin:$PATH
  opencode run --model opencode/gpt-5-codex \
    "Jestes DevOpsem. Przygotuj SETUP CHECKLIST dla Tindur (deploy od zera). \
     Sekcje: \
     1. SUPABASE setup (project, schema, RLS, edge functions) \
     2. VERCEL setup (project, env vars, domains) \
     3. STRIPE setup (account, products, webhooks, Connect) \
     4. GITHUB setup (repo, branches, actions, secrets) \
     5. MONITORING (Sentry, Plausible, Uptime) \
     6. CI/CD pipeline (test, build, deploy) \
     7. ENVIRONMENTS (dev, staging, prod) \
     8. DOMENY (tindur.is, tindur.com, *.tindur.is) \
     9. SSL/TLS (Let's Encrypt, Cloudflare) \
     10. BACKUP (DB backup, file backup, retention) \
     11. SECURITY (firewall, DDoS, rate limit) \
     12. SCALING (kiedy upgrade, jak) \
     13. OBSERVABILITY (logs, metrics, traces) \
     Pisz po polsku, krok po kroku, z komendami." \
    > reports/10_devops.md 2>&1
  echo "[$(date)] DEVOPS DONE" >> reports/progress.log
) &

echo "[$(date)] All 10 agents started, PID: $!"
echo "Monitor: tail -f /root/projects/Tindur/reports/progress.log"
echo "Reports: /root/projects/Tindur/reports/"
