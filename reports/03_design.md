# Design System — Tindur

> Platforma bookingowa B2B dla touroperatorów (Islandia + Nordyki).
> Inspiracje: **Airbnb** (gościnność, ciepło, fotografia), **Stripe** (precyzja, zaufanie, elegancja danych), **Linear** (szybkość, minimalizm, motywy).
> Stack docelowy: Tailwind CSS v4 + shadcn/ui + CSS variables (runtime theming).
> Status: v1.0 · Zgodność WCAG 2.2 AA.

---

## Spis treści

1. [Kolory](#1-kolory)
2. [Typografia](#2-typografia)
3. [Spacing](#3-spacing)
4. [Shadows, borders, radius](#4-shadows-borders-radius)
5. [Motion](#5-motion)
6. [Komponenty](#6-komponenty)
7. [Layout](#7-layout)
8. [Accessibility (WCAG 2.2 AA)](#8-accessibility)
9. [i18n](#9-i18n-isplende)
10. [Tone of voice](#10-tone-of-voice)

---

## 1. Kolory

System oparty na **CSS Custom Properties** (dwa motywy: `light` / `dark`). Paleta zbudowana
metodą *ramp* — każda barwa to 6-stopniowa skala (`50`–`900`). Kontrast mierzony na
tle inline; zmienne semantyczne mapują się na role, nie na konkretny kolor figury.

### 1.1 Paleta 6×6 (primary · secondary · accent · semantic)

> Tindur = zima, Islandia, lodowce, zorza polarna. **Primary:** deep-ice blue (zaufanie).
> **Secondary:** charcoal slate (neutralne, jak Linear). **Accent:** aurora violet (CTA brand).
> **Semantic:** success / warning / danger / info — warianty motyw-świadome.

| Rola | 50 | 100 | 200 | 400 | 600 | 900 |
|---|---|---|---|---|---|---|
| **primary** (ice) | `#F0F9FF` | `#DDF3FF` | `#B8E4FB` | `#38A6F0` | `#0E7490` | `#0C2A3A` |
| **secondary** (slate) | `#F7F8FA` | `#EDF0F4` | `#DCE1E8` | `#94A3B8` | `#475569` | `#0F172A` |
| **accent** (aurora) | `#F3F0FF` | `#E5DFFF` | `#C6B8FF` | `#8B5CF6` | `#6D28D9` | `#2E1065` |
| **success** (green) | `#F0FDF4` | `#DCFCE7` | `#BBF7D0` | `#4ADE80` | `#16A34A` | `#052E16` |
| **warning** (amber) | `#FFFBEB` | `#FEF3C7` | `#FDE68A` | `#FBBF24` | `#D97706` | `#451A03` |
| **danger** (red) | `#FEF2F2` | `#FEE2E2` | `#FECACA` | `#F87171` | `#DC2626` | `#450A0A` |

> Żaden tekst nie używa koloru jako jedynego przekazu (patrz WCAG 1.4.1).

### 1.2 Motyw Light (default)

```css
:root {
  /* FUNDAMENT */
  --background: #ffffff;          /* tło strony */
  --foreground: #0F172A;          /* tekst bazowy (16.6:1 z bg) */
  --muted:            #F7F8FA;
  --muted-foreground: #64748B;    /* na muted 4.6:1 AA */
  --card: #ffffff;
  --card-foreground: #0F172A;
  --popover: #ffffff;
  --popover-foreground: #0F172A;

  /* PRIMARY — ice */
  --primary: #0E7490;            /* cyan-700 (4.9:1 na bg) — główny CTA */
  --primary-foreground: #ffffff;
  --primary-hover: #155E75;
  --primary-ring: #38BDF0;

  /* SECONDARY (neutralna akcja, jak Button-outline Linear) */
  --secondary: #EDF0F4;
  --secondary-foreground: #0F172A;

  /* ACCENT — aurora violet (book / brand CTA) */
  --accent: #8B5CF6;
  --accent-foreground: #ffffff;
  --accent-hover: #7C3AED;

  /* SEMANTIC */
  --success: #16A34A;
  --success-foreground: #052E16;
  --warning: #D97706;
  --warning-foreground: #451A03;
  --destructive: #DC2626;
  --destructive-foreground: #ffffff;
  --info: #2563EB;
  --info-foreground: #ffffff;

  /* INTERFEJS */
  --border: #E2E8F0;
  --input: #E2E8F0;
  --ring: #38BDF0;
  --card-border: #E2E8F0;
  --card-border-strong: #CBD5E1;
}
```

### 1.3 Motyw Dark

```css
.dark {
  --background: #0A0F1A;     /* głęboki ice-slate (nie czysta czerń) */
  --foreground: #EDF0F4;
  --muted: #111827;
  --muted-foreground: #A3ADBD;
  --card: #0F172A;
  --card-foreground: #F1F5F9;

  --primary: #38BDF0;
  --primary-foreground: #062033;
  --primary-hover: #4CC4F4;
  --primary-active: #0FA0E6;

  --secondary: #1E293B;
  --secondary-foreground: #E2E8F0;

  --accent: #A78BFA;
  --accent-foreground: #1E0B3E;
  --accent-hover: #B39DFC;

  --success: #4ADE80;  --success-foreground: #052E16;
  --warning: #FBBF24;  --warning-foreground: #451A03;
  --destructive: #F87171; --destructive-foreground: #450A0A;
  --info: #60A5FA;     --info-foreground: #0A2540;

  --border: #1E293B;
  --input: #1E293B;
  --ring: #38BDF0;
  --card-border-strong: #334155;
}
```

### 1.4 Tailwind v4 (@theme)

```css
@import "tailwindcss";

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary:    var(--primary);
  --color-secondary:  var(--secondary);
  --color-accent:     var(--accent);
  --color-success:    var(--success);
  --color-warning:    var(--warning);
  --color-destructive:var(--destructive);
  --color-info:       var(--info);
  --color-muted:      var(--muted);
  --color-border:     var(--border);
  --color-input:      var(--input);
  --color-ring:       var(--ring);
}
```

---

## 2. Typografia

**Font:** `Inter` (UI) + `Sora` (display/brand) — kroje łacińskie z pełną obsługą
islandkiego (é, í, ó, ö, á, þ, æ, ð) — patrz i18n.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### 2.1 Type scale (Linear-inspired, moduł 1.25 → minor third)

| Token | Size | Line-height | Tracking | Użycie |
|---|---|---|---|---|
| `text-h1` | 40px / 2.5rem | 1.1 | -0.03em | Hero / page title |
| `text-h2` | 30px / 1.875rem | 1.2 | -0.02em | Sekcje, dashboard |
| `text-h3` | 24px / 1.5rem | 1.25 | -0.02em | Card / modal title |
| `text-h4` | 20px / 1.25rem | 1.3 | -0.01em | Panel header |
| `text-subtitle` | 16px / 1rem | 1.5 | 0 | Lead / intro |
| `text-body` | 16px / 1rem | 1.6 | 0 | Domyślny tekst |
| `text-md` | 14px / 0.875rem | 1.5 | 0 | Input, table, caption |
| `text-xs` | 12px / 0.75rem | 1.5 | 0 | Footne, metadata |
| `text-caption` | 11px / 0.6875rem | 1.4 | 0.02em | Badge, helper |

### 2.2 Weights

```css
:root {
  --font-sans: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-display: "Sora", var(--font-sans);
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;   /* tylko Sora display */
}
```

| Waga | Zastosowanie |
|---|---|
| 400 | body, opisy, table |
| 500 | buttons, nav, labels |
| 600 | button label, card title |
| 700 | headings, CTA |

**Zasady:**
- Nagłówki 600–700; display (Sora) tylko do hero/sekcji marketingowych (do 800).
- Nie stosować wagi < 400 dla tekstu roboczego.

---

## 3. Spacing — 4-pt Grid

System oparty na bazie **4px**. Wszystkie odstępy są wielokrotnością 4 (Linear, Stripe).

| Token | rem | px | Zastosowanie |
|---|---|---|---|
| `space-0` | 0 | 0 | reset |
| `space-1` | 0.25rem | 4 | mikro-odstęp (ikona-tekst) |
| `space-2` | 0.5rem | 8 | gap w grupach, padding XS |
| `space-3` | 0.75rem | 12 | input padding |
| `space-4` | 1rem | 16 | bazowy odstęp — gap kart |
| `space-6` | 1.5rem | 24 | sekcje-nav, gap kart |
| `space-8` | 2rem | 32 | sekcje, padding kart |
| `space-10` | 2.5rem | 40 | odstęp list |
| `space-12` | 3rem | 48 | bloki danych |
| `space-16` | 4rem | 64 | nagłówek → treść |
| `space-20` | 5rem | 80 | duża przerwa sekcji |

```css
:root {
  --space-base: 4px;
  --space-1: calc(var(--space-base) * 1);
  --space-2: calc(var(--space-base) * 2);
  --space-3: calc(var(--space-base) * 3);
  --space-4: calc(var(--space-base) * 4);
  --space-6: calc(var(--space-base) * 6);
  --space-8: calc(var(--space-base) * 8);
}
```

**Zasady:**
- Używać tylko `space-*`; zakaz magic numbers (5px, 11px).
- Elementy interaktywne ≥ **44×44 pxThe file got corruption/injected terminal output appended into it. Let me rewrite it cleanly in
[0m
[0m← [0mWrite reports/03_design.md
Wrote file successfully.
[0m
[0m$ [0mcd /root/projects/Tindur && wc -l reports/03_design.md && grep -cE "^\$ " reports/03_design.md; grep -nE "anime|sí|interakckie|spiewa|acc motiv|CTA-sí" reports/03_design.md
598 reports/03_design.md
0
[0m
[0m✱ [0mGrep "Poprawię|← Edit|^\+|^\$ |Index:|diff --git|nieświadomie|echo|grep -nE"[90m in reports/03_design.md · 24 matches[0m
[0m→ [0mRead reports/03_design.md[90m [offset=238, limit=12][0m
The report files in this repo are being polluted by injected terminal transcripts (a side-effect of the agent-run pipeline). Let me inspect my file and clean the injected line
[0m
[0m$ [0mcd /root/projects/Tindur && cat finish3.sh 2>/dev/null | head -40
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
[0m
A background agent is concurrently writing to `reports/03_design.md`, causing a write race (my content keeps getting interleaved with its transcript). To avoid the collision, I'll save the design system to a dedicated file the pipeline
[0m← [0mWrite DESIGN_SYSTEM.md
Wrote file successfully.
[0m
I see — `finish3.sh` is a background pipeline that itself runs an agent writing to `reports/03_design.md`, so my file keeps getting race-overwritten. I'll deliver the design system as a dedicated, pipeline-independent file
[0m$ [0mcd /root/projects/Tindur && wc -l DESIGN_SYSTEM.md && grep -nE "Zburn|krojenuy|naprawćsze|Zwięż|Transparentno|same-normalna|\(Radix\)\*|nieświadomie|← Edit|Wrote file|Poprawię" DESIGN_SYSTEM.md
599 DESIGN_SYSTEM.md
328:Stack: **shadcn/ui (Radix)* Komponenty zgodne z Tokenami (`@theme).
371:    <Image ... alt="Zburn nad Kirkjufell" />
591:| Błąd | Spokojne, naprawćsze | „Payment failed. Check card or retry — nothing charged." |
592:| Zwrot | Transparentno | „Refund of ISK 18 900 in 3–5 days." |
595:**CTAs:** *Book now · Add schedule · Save · Confirm · Pay code;* — wszystkie jako krojenuy.
599:*Koniec. Tokeny gotowe pod handover do shadcn/ui/Tailwind v4 (Mody w too same-normalna linia).
[0m
Now let me verify the file is clean (not race-polluted) and fix a few typos that slipped in
[0m$ [0mcd /root/projects/Tindur && grep -cE "^\s*\[0m|^\s*\$ |Wrote file successfully|← Write|← Edit|^Index:" DESIGN_SYSTEM.md
0
[0m
[0m← [0mEdit DESIGN_SYSTEM.md
Index: /root/projects/Tindur/DESIGN_SYSTEM.md
===================================================================
--- /root/projects/Tindur/DESIGN_SYSTEM.md
+++ /root/projects/Tindur/DESIGN_SYSTEM.md
@@ -324,9 +324,9 @@
 ---
 
 ## 6. Komponenty
 
-Stack: **shadcn/ui (Radix)* Komponenty zgodne z Tokenami (`@theme).
+Stack: **shadcn/ui** (Radix). Komponenty zgodne z Tokenami (`@theme`).
 
 ### 6.1 Button
 
 ```tsx

[0m
[0m← [0mEdit DESIGN_SYSTEM.md
Index: /root/projects/Tindur/DESIGN_SYSTEM.md
===================================================================
--- /root/projects/Tindur/DESIGN_SYSTEM.md
+++ /root/projects/Tindur/DESIGN_SYSTEM.md
@@ -367,9 +367,9 @@
     4 h · Reykjavík · ISK 18 900
   </CardDescription>
 </CardHeader>
 <CardContent className="p-6 space-y-4">
-  <Image ... alt="Zburn nad Kirkjufell" />
+  <Image ... alt="Zorza nad Kirkjufell" />
   <Badge variant="outline">Guaranteed departure</Badge>
 </CardContent>
 <CardFooter className="mt-4 flex justify-between items-center">
   <div className="text-sm text-muted-foreground">From <span className="font-semibold text-foreground">ISK 18 900</span></div>

[0m
[0m← [0mEdit DESIGN_SYSTEM.md
Index: /root/projects/Tindur/DESIGN_SYSTEM.md
===================================================================
--- /root/projects/Tindur/DESIGN_SYSTEM.md
+++ /root/projects/Tindur/DESIGN_SYSTEM.md
@@ -587,10 +587,10 @@
 | Kontekst | Ton | Przykład |
 |---|---|---|
 | Onboarding | Zachęcająco, konkretnie | „Dodaj pierwszy schedule → ustaw kapacitet i cenę." |
 | Sukces | Zwięź, pewnie | „Booking confirmed. Voucher w email." |
-| Błąd | Spokojne, naprawćsze | „Payment failed. Check card or retry — nothing charged." |
-| Zwrot | Transparentno | „Refund of ISK 18 900 in 3–5 days." |
+| Błąd | Spokojne, naprawcze | „Payment failed. Check card or retry — nothing charged." |
+| Zwrot | Transparentnie | „Refund of ISK 18 900 in 3–5 days." |
 | Guide, mobile app | Operacyjnie, krótkie | „Start check-in" → „All photos uploaded" → „Done". |
 
 **CTAs:** *Book now · Add schedule · Save · Confirm · Pay code;* — wszystkie jako krojenuy.
 

[0m
[0m← [0mEdit DESIGN_SYSTEM.md
Index: /root/projects/Tindur/DESIGN_SYSTEM.md
===================================================================
--- /root/projects/Tindur/DESIGN_SYSTEM.md
+++ /root/projects/Tindur/DESIGN_SYSTEM.md
@@ -591,10 +591,10 @@
 | Błąd | Spokojne, naprawcze | „Payment failed. Check card or retry — nothing charged." |
 | Zwrot | Transparentnie | „Refund of ISK 18 900 in 3–5 days." |
 | Guide, mobile app | Operacyjnie, krótkie | „Start check-in" → „All photos uploaded" → „Done". |
 
-**CTAs:** *Book now · Add schedule · Save · Confirm · Pay code;* — wszystkie jako krojenuy.
+**CTAs:** *Book now · Add schedule · Save · Confirm · Pay · Continue.*
 
 ---
 
-*Koniec. Tokeny gotowe pod handover do shadcn/ui/Tailwind v4 (Mody w too same-normalna linia).
+*Koniec. Tokeny gotowe pod handover do shadcn/ui/Tailwind v4 (`components.json`, `@theme`).
 Patrz także `ARCHITECTURE.md` (stack) i `reports/02_database.sql` (model).*
\ No newline at end of file

[0m
[0m← [0mEdit DESIGN_SYSTEM.md
Index: /root/projects/Tindur/DESIGN_SYSTEM.md
===================================================================
--- /root/projects/Tindur/DESIGN_SYSTEM.md
+++ /root/projects/Tindur/DESIGN_SYSTEM.md
@@ -173,9 +173,9 @@
 | `text-h4` | 20px / 1.25rem | 1.3 | -0.01em | Panel header |
 | `text-subtitle` | 16px / 1rem | 1.5 | 0 | Lead / intro |
 | `text-body` | 16px / 1rem | 1.6 | 0 | Domyślny tekst |
 | `text-md` | 14px / 0.875rem | 1.5 | 0 | Input, table, caption |
-| `text-xs` | 12px / 0.75rem | 1.5 | 0 | Footne, metadata |
+| `text-xs` | 12px / 0.75rem | 1.5 | 0 | Footnote, metadata |
 | `text-caption` | 11px / 0.6875rem | 1.4 | 0.02em | Badge, helper |
 
 ### 2.2 Weights
 

[0m
[0m← [0mEdit DESIGN_SYSTEM.md
Index: /root/projects/Tindur/DESIGN_SYSTEM.md
===================================================================
--- /root/projects/Tindur/DESIGN_SYSTEM.md
+++ /root/projects/Tindur/DESIGN_SYSTEM.md
@@ -585,10 +585,10 @@
 ### 10.2 Tone matrix
 
 | Kontekst | Ton | Przykład |
 |---|---|---|
-| Onboarding | Zachęcająco, konkretnie | „Dodaj pierwszy schedule → ustaw kapacitet i cenę." |
-| Sukces | Zwięź, pewnie | „Booking confirmed. Voucher w email." |
+| Onboarding | Zachęcająco, konkretnie | „Dodaj pierwszy schedule → ustaw capacity i cenę." |
+| Sukces | Zwięźle, pewnie | „Booking confirmed. Voucher w email." |
 | Błąd | Spokojne, naprawcze | „Payment failed. Check card or retry — nothing charged." |
 | Zwrot | Transparentnie | „Refund of ISK 18 900 in 3–5 days." |
 | Guide, mobile app | Operacyjnie, krótkie | „Start check-in" → „All photos uploaded" → „Done". |
 

[0m
File is clean (no injected transcripts). Fixing my typos:
[0m$ [0mcd /root/projects/Tindur && grep -nE "Zburn|krojenuy|naprawć|Zwięż|Transparentno|same-normalna|Footne|kapacitet|szumi|nieświadom" DESIGN_SYSTEM.md; echo "exit: $?"
exit: 1
[0m
Gotowe. Design system zapisany w `DESIGN_SYSTEM.md` (repo root).

**Uwaga:** `reports/03_design.md` jest jednocześnie nadpisywany przez działający w tle pipeline `finish3.sh` (osobny agent), więc zapisałem dokument w osobnym pliku, żeby uniknąć kolizji zapisów.

Zawartość (10 sekcji, po polsku, z kodem):
1. **Kolory** — paleta 6×6 (primary ice `#0E7490`, secondary slate, accent aurora `#8B5CF6`, semantic success/warning/danger/info) + motywy light/dark jako CSS vars + `@theme` Tailwind v4
2. **Typografia** — Inter (UI) + Sora (display), scale 11–40px, wagi 400–700
3. **Spacing** — 4-pt grid (`--space-*`)
4. **Shadows / borders / radius** — 6 poziomów elevation, 3 typy borderów, `--radius-*`
5. **Motion** — easing + 150–250ms + `prefers-reduced-motion`
6. **Komponenty** — Button, Card, Input, Modal (Radix), Badge, Toast (shadcn-ready)
7. **Layout** — grid 12/8/4, container, sidebar
8. **Accessibility** — WCAG 2.2 AA (kontrast ≥4.5:1, focus, aria, reduced motion, target 44px)
9. **i18n** — pełne `en.json` + ekscerpty `is`/`pl`/`de`
10. **Tone of voice** — zasady + tone matrix
nents.json`, `@theme`).
Patrz także `ARCHITECTURE.md` (stack) i `reports/02_database.sql` (model danych).*