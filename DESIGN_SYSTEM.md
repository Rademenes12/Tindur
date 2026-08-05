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

> Żadna wartość nie używa koloru jako jedynego przekazu (WCAG 1.4.1).

### 1.2 Motyw Light

```css
:root {
  --background: #ffffff;
  --foreground: #0F172A;
  --muted:            #F7F8FA;
  --muted-foreground: #47648B;
  --card: #ffffff;
  --card-foreground: #0F172A;
  --popover: #ffffff;
  --popover-foreground: #0F172A;

  /* PRIMARY — ice */
  --primary: #0E7490;
  --primary-foreground: #ffffff;
  --primary-hover: #155E75;
  --primary-ring: #38BDF0;

  /* SECONDARY */
  --secondary: #EDF0F4;
  --secondary-foreground: #0F172A;

  /* ACCENT — aurora */
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
  --background: #0A0F1A;
  --foreground: #EDF0F4;
  --muted: #111827;
  --muted-foreground: #A3ADBD;
  --card: #0F172A;
  --card-foreground: #F1F5F9;
  --popover: #0F172A;
  --popover-foreground: #F1F5F9;

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
islandzkiego (é, í, ó, ö, á, þ, æ, ð) — patrz i18n.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### 2.1 Type scale (moduł 1.25)

| Token | Size | Line-height | Tracking | Użycie |
|---|---|---|---|---|
| `text-h1` | 40px / 2.5rem | 1.1 | -0.03em | Hero / page title |
| `text-h2` | 30px / 1.875rem | 1.2 | -0.02em | Sekcje, dashboard |
| `text-h3` | 24px / 1.5rem | 1.25 | -0.02em | Card / modal title |
| `text-h4` | 20px / 1.25rem | 1.3 | -0.01em | Panel header |
| `text-subtitle` | 16px / 1rem | 1.5 | 0 | Lead / intro |
| `text-body` | 16px / 1rem | 1.6 | 0 | Domyślny tekst |
| `text-md` | 14px / 0.875rem | 1.5 | 0 | Input, table, caption |
| `text-xs` | 12px / 0.75rem | 1.5 | 0 | Footnote, metadata |
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
}
```

| Waga | Zastosowanie |
|---|---|
| 400 | body, opisy, table |
| 500 | buttons, nav, labels |
| 600 | button label, card title |
| 700 | headings, CTA |

**Zasady:**
- Nagłówki 600–700; display (Sora) tylko do hero / sekcji marketingowych (do 800).
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
- Używać wyłącznie `space-*`; zakaz magic numbers (5px, 11px).
- target interaktywne ≥ **44×44 px**.
- Grid: **12 kolumn ≥ 1024 px; mniejszy na mobile.

---

## 4. Shadows, borders, radius

### 4.1 Elevation (Linear)

```css
@theme inline {
  --shadow-xs:   0 1px 2px 0 rgb(15 23 42 / 0.05);
  --shadow-sm:   0 1px 3px 0 rgb(15 23 42 / 0.10);
  --shadow-md:   0 8px 16px -2px rgb(15 23 42 / 0.12);
  --shadow-lg:   0 16px 32px -6px rgb(15 23 42 / 0.16);
  --shadow-xl:   0 24px 48px -8px rgb(15 23 42 / 0.20);
  --shadow-ring:   0 0 0 3px rgb(56 189 248 / 0.35);
}
```

- `xs` → brak dna, `sm` → hover kart, `lg` → popover/modal, `xl` → focus.

### 4.2 Borders

```css
--border-hairline: 1px solid var(--border);
--border-card:     1px solid var(--card-border);
--border-strong:   1px solid var(--card-border-strong);
```

### 4.3 Radius

```css
:root { --radius: 0.5rem; }
--radius-xs: 0.25rem;
--radius-sm: 0.375rem;
--radius-md: var(--radius);
--radius-lg: 0.75rem;
--radius-xl: 1rem;
--radius-full: 9999px;
```

---

## 5. Motion

**Zasady:** szybko (150–250 ms), easing `cubic-bezier`, nigdy nie blokuje (zero przy
`prefers-reduced-motion`). GPU-safe transform/opacity.

```css
:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --dur-fast: 120ms;
  --dur-base: 220ms;
  --dur-slow: 400ms;
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Keyframes (Tailwind v4 `--animate-*`):**

```css
@theme {
  --animate-fade-in:  fade-in 180ms var(--ease-in-out);
  --animate-scale-in: scale-in 200ms var(--ease-out);
  --animate-slide-up: slide-up 260ms var(--ease-out);
  --animate-shimmer:  shimmer 1.6s linear infinite;
  --animate-spinner:  spin 700ms linear infinite;
}
@keyframes fade-in  { from {opacity: 0} to {opacity: 1} }
@keyframes scale-in { from {opacity: 0; transform: scale(.96)} to {opacity:1; transform: none} }
@keyframes slide-up { from {opacity: 0; transform: translateY(8px)} to {opacity: 1; transform: none} }
```

**Wytyczne:**
- Hover/active ≤150 ms, modal 220–260 ms, dropdown 180 ms.
- Nigdy nie zmieniać layout-property — użycie transform/opacity.
- Stagger list 60 ms (max 4 elem.).

---

## 6. Komponenty

Stack: **shadcn/ui** (Radix). Komponenty zgodne z Tokenami (`@theme`).

### 6.1 Button

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:   "bg-primary text-primary-foreground hover:bg-primary-hover",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border",
        accent:    "bg-accent text-accent-foreground hover:bg-accent-hover",
        outline:   "border border-border-strong bg-transparent hover:bg-muted",
        ghost:     "hover:bg-muted hover:text-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        sm:  "h-9 px-3 text-sm",
        md:  "h-10 px-4 text-md",
        lg:  "h-11 px-6 text-base",
        icon:"h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);
```

- Focus ring 2px `--ring` + offset 2px. Disabled opacity 50. Min click 44×44 na mobile.
- `type` zawsze explicite. Loading = spinner + `aria-busy`.

### 6.2 Card

```tsx
<Card className="rounded-xl border border-card bg-card shadow-sm hover:shadow-md transition-shadow">
  <CardHeader>
    <CardTitle className="text-h3">Northern Lights Expedition</CardTitle>
    <CardDescription className="text-body text-muted-foreground">
      4 h · Reykjavík · ISK 18 900
    </CardDescription>
  </CardHeader>
  <CardContent className="p-6 space-y-4">
    <Image ... alt="Zorza nad Kirkjufell" />
    <Badge variant="outline">Guaranteed departure</Badge>
  </CardContent>
  <CardFooter className="mt-4 flex justify-between items-center">
    <div className="text-sm text-muted-foreground">From <span className="font-semibold text-foreground">ISK 18 900</span></div>
    <Button variant="accent" size="sm">Book now →</Button>
  </CardFooter>
</Card>
```

- Obraz: `aspect-[4/3]`, `object-cover`, hover `scale-[1.02]`. Hover `shadow-md` + `border-strong`.

### 6.3 Input

```tsx
<Label htmlFor="email">Email address</Label>
<input id="email" className="
  h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
  placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring
  disabled:opacity-50" type="email" required aria-describedby="email-hint" />
<p id="email-hint" className="text-xs text-destructive" role="alert">{error?.message}</p>
```

- Error: `aria-describedby` hint + `border-destructive` + `aria-invalid`.
- Label zawsze `htmlFor`. Ikony `aria-hidden`.

### 6.4 Modal (Dialog)

```tsx
<Dialog>
  <DialogTrigger asChild><Button>Choose date</Button></DialogTrigger>
  <DialogContent className="
    fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2
    rounded-lg bg-card p-6 shadow-lg [animation:scale-in_220ms]"
    aria-describedby="dialog-desc">
    <DialogTitle>Select your date</DialogTitle>
    <DialogDescription id="dialog-desc">Free cancellation up to 24 h.</DialogDescription>
    {/* content */}
    <DialogFooter>...</DialogFooter>
  </DialogContent>
</Dialog>
```

- Radix: focus-trap, Escape, scroll-lock, `aria-modal`. Overlay `bg-black/60 backdrop-blur`.

### 6.5 Badge

```tsx
<Badge variant="success">Confirmed</Badge>
<Badge variant="warning">Payment pending</Badge>
<Badge variant="danger">Cancelled</Badge>
<Badge variant="info">Rescheduled</Badge>
<Badge variant="outline">Guide</Badge>
```

```css
.badge-success { background: color-mix(in srgb, var(--success) 15%, transparent); color: var(--success); }
```

- Badge nigdy jako jedyny przekaz walidacji.

### 6.6 Toast

```tsx
toast.success("Booking confirmed — check your inbox", { duration: 4000 });
toast.error("Payment failed. Try again.", { duration: 6000 });
```

- `role="status"` / `aria-live="polite"`; błąd `role="alert"`. Błąd płatniczy → akcja „View”.

---

## 7. Layout

- **Container:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- **Grid kart:** `grid gap-6 md:grid-cols-2 lg:grid-cols-3`; dashboard `lg:grid-cols-12`.
- **Sidebar (Org Dashboard):** ~260 px; content `max-w`.
- **Hero (marketing):** 2-kolumnowy (headline+CTA | zasób) — insp. Airbnb.
- **Responsywne:** 12 col ≥1024, 6 tablet, 4 mobile.

```
Desktop  ≥1024: 12 col · gutter 32 · sidebar 260 + main 1fr
Tablet   ≥768 : 8  col · gutter 24
Mobile   <768 : 4  col · gutter 16 · full-bleed padding
```

Sticky header `h-16` + border-bottom + backdrop-blur.

---

## 8. Accessibility (WCAG 2.2 AA)

### 8.1 Kontrast

| Rola | Tło / tło | Kontrast docelowy |
|---|---|---|
| Tekst na primary bg | fg/bg | **≥ 4.5:1** |
| Muted fg | muted bg | ≥ 4.5:1 |
| Tekst na semantic | — | ≥ 4.5:1 |
| Focus ring | obie | ≥ 3:1 |

### 8.2 Checklist

- **Focus:** `focus-visible` ring 2px + offset 2px (2.4.7, 2.4.11).
- **Label:** `<label htmlFor>` / `aria-label` (2.4.6).
- **Error:** `role="alert"` + `aria-describedby` (3.3.1, 3.3.3) + ikon.
- **Keyboard:** Tab/Enter/Space/Escape; Radix.
- **Reduced motion:** globalny media query (§5).
- **Target size:** ≥44×44 mobile, ≥24 px min-dystans (2.5.8).
- **Landmarks:** `main`/`nav`/`header`/`footer`; jedno `h1`.
- **Imaging:** `alt` opisowy / `aria-hidden`.
- **Modal:** focus-trap + restore (Radix).

### 8.3 Tematyka

- `color-scheme` auto + dark. `data-theme` na `<html>` + `localStorage`.
- Test kontrastu obu tematów w CI (Lighthouse a11y 100).

---

## 9. i18n (is / pl / en / de)

### 9.1 Setup (next-intl)

```
messages/
  is.json, en.json, pl.json, de.json
```

### 9.2 en.json

```json
{
  "nav": { "booking": "Booking", "dashboard": "Dashboard", "guides": "Guides" },
  "common": {
    "book": "Book now", "from": "From", "per_person": "per person",
    "loading": "Loading…", "error": "Something went wrong", "retry": "Retry",
    "cancel": "Cancel", "confirm": "Confirm",
    "search_placeholder": "Search experiences…"
  },
  "booking": {
    "title": "Select a date", "guests": "Number of travelers",
    "total": "Total", "pay_btn": "Pay ISK {{total}}",
    "free_cancel": "Free cancellation up to 24 h before"
  },
  "dashboard": {
    "today": "Today", "upcoming": "Upcoming", "occupancy": "Occupancy",
    "revenue": "Revenue", "payout": "Next payout"
  },
  "status": {
    "confirmed": "Confirmed", "pending": "Pending",
    "cancelled": "Cancelled", "failed": "Payment failed"
  }
}
```

### 9.3 pl.json (ekscerpt)

```json
{
  "common": { "book": "Zarezerwuj teraz", "cancel": "Anuluj", "confirm": "Potwierdź",
    "search_placeholder": "Szukaj doświadczeń…" },
  "booking": { "pay_btn": "Zapłać {{total}}", "guests": "Liczba gości" },
  "dashboard": { "today": "Dziś", "occupancy": "Obłożenie", "revenue": "Przychód" },
  "status": { "confirmed": "Potwierdzona", "pending": "Oczekująca", "cancelled": "Anulowana" }
}
```

### 9.4 is.json (ekscerpt)

```json
{
  "common": { "book": "Bóka nú", "from": "Frá", "per_person": "per persónu",
    "retry": "Reyna aftur", "search_placeholder": "Leita að upplifunum…" },
  "booking": { "title": "Veldu dagsetningu", "guests": "Fjöldi gesta",
    "pay_btn": "Borga {{total}}", "free_cancel": "Gjaldfrjáls afpöntun fram að 24 klst." },
  "status": { "confirmed": "Staðfest", "pending": "Í bið", "cancelled": "Hætt við" }
}
```

### 9.5 de.json (ekscerpt)

```json
{
  "common": { "book": "Jetzt buchen", "from": "Ab", "cancel": "Abbrechen",
    "confirm": "Bestätigen", "search_placeholder": "Erlebnisse suchen…" },
  "booking": { "title": "Datum wählen", "guests": "Anzahl der Gäste",
    "pay_btn": "Jetzt bezahlen ({{total}})" },
  "status": { "confirmed": "Bestätigt", "cancelled": "Storniert" }
}
```

**Zasady i18n:**
- Nigdy nie literałować stringów w kodzie — zawsze klucze w `messages/*.json`.
- Liczby/placówki przez `Intl.PluralRules` (is i pl: form o 2. i 4.). Format `Intl.NumberFormat` ISK.
- Strefa czasu `Europe/Reykjavik`, `Intl.DateTimeFormat`.
- `<html lang>` odpowiednio; wszystkie LTR.

---

## 10. Tone of voice

**Osoba marki:** profesjonalny, zaufany partner — precyzyjny jak Stripe, ciepły jak Airbnb.
Zero żargonu, konkret, pewność, transparentność.

### 10.1 Zasady

1. **Jasno i konkretnie** — „Anulowanie do 24 h przed startem jest bezpłatne".
2. **Zaufanie** — podawaj ISK, daty, godziny; nigdy nie ukrywaj ceny.
3. **Krótko** — zdania ≤20 słów; CTA to czasowniki („Book now", „Add", „Save").
4. **Ciepło i oszczędnie** — nie przesadzać z entuzjazmem.
5. **Lokalnie** — waluty i formy osobowe (nieformalnie do usera).
6. **Nigdy nie obwiniaj użytkownika** — błąd = „coś się nie udało, spróbuj ponownie".

### 10.2 Tone matrix

| Kontekst | Ton | Przykład |
|---|---|---|
| Onboarding | Zachęcająco, konkretnie | „Dodaj pierwszy schedule → ustaw capacity i cenę." |
| Sukces | Zwięźle, pewnie | „Booking confirmed. Voucher w email." |
| Błąd | Spokojne, naprawcze | „Payment failed. Check card or retry — nothing charged." |
| Zwrot | Transparentnie | „Refund of ISK 18 900 in 3–5 days." |
| Guide, mobile app | Operacyjnie, krótkie | „Start check-in" → „All photos uploaded" → „Done". |

**CTAs:** *Book now · Add schedule · Save · Confirm · Pay · Continue.*

---

*Koniec. Tokeny gotowe pod handover do shadcn/ui/Tailwind v4 (`components.json`, `@theme`).
Patrz także `ARCHITECTURE.md` (stack) i `reports/02_database.sql` (model).*