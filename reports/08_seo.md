# Strategia SEO dla Tindur

**Wersja:** 1.0 | **Data:** 2026-08-05

**Produkt:** B2B booking SaaS dla touroperatorow (Islandia -> Nordyki). Wartosci: 0% prowizji od rezerwacji bezposrednich, white-label widget, aplikacja dla przewodnikow z check-in i funkcjami bezpieczenstwa.

**Cel na 12 miesiecy:** 10 000 sesji organicznych/mies. 80% to ruch transakcyjny operatorow (dol lejka), 20% to ruch informacyjny B2B. Ruch B2C (turysta) buduje obecnosc i linki.

---

## 1. KEYWORDS — 30 fraz z intencja

Trzy strumienie: A (operator kupuje), B (operator researchuje), C (turysta, cel backlinki).

### Strumien A — operator w fazie zakupu (10 fraz, cele /pricing i /product)

| Lp | Fraza (PL + EN) | Intencja | Trudnosc | URL cel |
|---|---|---|---|---|
| 1 | oprogramowanie booking dla touroperatorow | Transactional | 40 | /pricing |
| 2 | system rezerwacji dla touroperatorow | Transactional | 45 | /pricing |
| 3 | platforma do rezerwacji wycieczek | Transactional | 40 | / |
| 4 | alternatywa dla Viator | Transactional | 25 | /comparisons/getyourguide |
| 5 | booking engine for tour operators | Transactional | 40 | /product |
| 6 | tour operator software | Transactional | 48 | /product |
| 7 | darmowe booking software dla turystyki | Transactional | 30 | /pricing |
| 8 | Iceland tour operator software | Transactional | 20 | /islandlanding |
| 9 | white label tour booking widget | Transactional | 28 | /product |
| 10 | GetYourGuide commission rate | Transactional | 22 | /comparisons/getyourguide |

### Strumien B — operator w fazie research (10 fraz)

| Lp | Fraza | Typ |
|---|---|---|
| 11 | prowizja GetYourGuide i Viator | informational |
| 12 | sprzedaz przez hotele i concierge (reseller) | informational |
| 13 | force majeure w turystyce | informational |
| 14 | bezposrednie rezerwacje bez prowizji | informational |
| 15 | booking software kontra arkusze | informational |
| 16 | aplikacja przewodnika check-in GPS | informational |
| 17 | problemy z Viator (long-tail) | informational |
| 18 | wycieczki zalezne od pogody Islandia | informational |
| 19 | channel manager OTA | informational |
| 20 | dane klientow turystyka RODO | informational |

### Strumien C — turysta (10 fraz, backlinki i E-E-A-T)

| Lp | Fraza | Typ |
|---|---|---|
| 21 | zorza polarna Islandia kiedy i gdzie | informational B2C |
| 22 | najlepsze wycieczki dzienne Islandia | informational B2C |
| 23 | jak zalczyc firme turystyczna na Islandii | informational |
| 24 | bezpieczenstwo zimowych wycieczek | informational B2C |
| 25 | Reykjavik day tours booking | informational B2C |
| 26 | porownanie software booking dla operatorow | informational B2B |
| 27 | licencje tour operator Islandia | informational B2B |
| 28 | pogoda a planowanie wycieczek Islandia | informational B2C |
| 29 | white label booking plugin | informational B2B |
| 30 | jak rozwijac biznes turystyczny na Islandii | informational B2B |

Zasada: dominuja frazy dlugiego ogona o niskiej konkurencji (TD 25-48). Content B2C nie walczy o wyniki transakcyjne, tylko tworzy obecnosc i linki.

---

## 2. STRUKTURA STRONY (silo)

### Drzewo (silo: SaaS, B2B-guide, B2C-tours)

```
/
├── /product                        booking engine + guide app + channel manager
├── /features/                      silo funkcji
│   ├── /features/force-majeure
│   ├── /features/guide-app
│   ├── /features/reseller-links
│   └── /features/isk-pricing
├── /islandlanding                  pillar regionalny (operatorzy Islandii)
├── /pricing                        kalkulator (0% direct, subskrypcja)
├── /comparisons/                   cluster B2B
│   ├── /comparisons/getyourguide
│   └── /comparisons/viator
├── /blog/                          pillar "direct booking" + cluster
└── /faq  /legal                    (zaufanie i SERP)
```

### Szablon strony + schema.org

| Wzor URL | Title (max 60) | H1 | Schema.org |
|---|---|---|---|
| / | Rezerwacja bez prowizji dla touroperatorow | Booking software dla turystyki | Organization + SoftwareApplication |
| /pricing | Cena od 0 EUR + 0% direct | Przejrzysty cennik | SoftwareApplication (hasOfferCatalog) |
| /product | Booking engine + app przewodnika | Co robi Tindur | Product |
| /features/guide-app | App check-in dla przewodnikow | Bezpieczenstwo przewodnika | Product |
| /islandlanding | Booking software dla operatorow Islandii | Rozwiazanie dla Islandii | Product + GeoCoordinates |
| /comparisons/getyourguide | GetYourGuide alternatywa | 0% prowizji od direct | Article + FAQ |
| /faq | FAQ operatora | Czesco zadawane pytania | FAQPage + HowTo |

Schema: Organization + logo + sameAs (nawiazanie do legal). Product/SoftwareApplication z aggregateRating TYLKO z prawdziwych recenzji. BreadcrumbList na calosci, Article z author i dateModified, landing z GeoCoordinates (Reykjavik).

---

## 3. TECHNICAL SEO (Core Web Vitals, mobile-first)

Metryki do spelnienia:

- LCP ponizej 2.5 s (mobile).
- INP ponizej 200 ms.
- CLS ponizej 0.1.

Realizacja w buildzie (Next.js 15 + Vercel):

- SSG/ISR dla stron publicznych (/pricing, /product) — brak blokujacego JS.
- Hero w AVIF/WebP z srcset, srednio max 500 KB na strone.
- Fonty self-hosted z font-display swap, tylko uzyte podzbiory.
- Brak wczytania ciezszych bibliotek po stronie klienta do TTI.

Mobile-first:

- Breakpoint 320 px, czcionki w formularzach min 16 px, przyciski min 44 px.
- Widget rezerwacyjny embedowany w iframe: lekki CSS (max 40 KB), load lazy, bez blokowania main draw strony operatora.
- Stripe i realtime (Supabase) ladowane dopiero po interakcji, nie po załadowaniu strony.

Monitoring: PageSpeed Insights, CrUX, Google Search Console (Coverage, CWV).

---

## 4. CONTENT SEO (pillars, clusters, internal linking)

Uklad pilary + klastery (topical authority):

- Pillar A (B2B "direct booking") /blog/direct-booking -> korzysci bez prowizji, RODO, channel manager, reseller, cenniki.
- Pillar B (B2B "Islandia operacyjnie") /guides -> force majeure, pogoda, sezon zorzy, licencje, safety app.
- Pillar C (B2C "plan Iceland") /destinations -> zorza, wycieczki, bezpieczenstwo. To zrodlo linkow.

Rytm publikacji: 30-40 wpisow w 3 miesiacach (10/mies.), pozniej 4-5/mies. Do roku ok. 120 wpisow.

Linkowanie wewnetrzne (regula 3):

- Kazda strona ma do 3 linkow wytycznych: do pillara, do clustera, do strony transakcyjnej (/pricing lub /product).
- /pricing linkowane z kazdego artykulu B2B.
- Anchor text zroznicowany: brand + fraza + opis.
- Max glebokosc 3 klikniecia do strony transakcyjnej.

E-E-A-T:

- Realni autorzy (menedzer produktu, prawnik), dateModified na kazdym artykule.
- Cytowanie zrodel branzowych (Icelandic Tourist Board).
- Case studies od prawdziwych operatorow.
- Strona about + historia firmy.

---

## 5. LOCAL SEO

- Google Business Profile dla oddzialu w Reykjaviku, kategoria Software Company.
- NAP (nazwa, adres, telefon) identyczny na wszystkich stronach + schema LocalBusiness w stopce.
- Recenzje GBP 8-12 na miesiac, odpowiedzi w ciagu 24 h.
- Wspolpraca lokalna: Icelandic Tourist Board, pensjonaty, concierge, BSÍ (co-citation).
- Landpage dla glownego miasta (np. Reykjavik day tours).
- Yelp, Facebook, Instagram — spójne dane.

---

## 6. LINK BUILDING

Zasada: zero linkow kupowanych. Linki wynikaja z wartosci produktu i tresci.

Priorytety:

1. Digital PR oparty o dane: ankieta o prowizjach OTA i raport "tourism data Iceland 2026" -> media branzowe (Skift, PhocusWire, World Travel Awards) -> linki DA 90+.
2. Zasoby do pobrania: checklist "booking guide Iceland", raport PDF -> linki z domen .edu i .gov.
3. Guest posty 2-3 na miesiac na blogach i portalach islandzkich.
4. Katalogi SaaS: G2, Capterra, Product Hunt, AlternativesTo.
5. Case studies od operatorow jako material linkable.
6. Lokalni partnerzy: Tourist Board, hotele, concierge, stowarzyszenie przewodnikow.

KPI: 10-15 domen odnoszacych po 6 miesiacach, 2 mocne linki (np. edukacja) w ciagu roku. Podniesienie DA o 6-10 punktow.

---

## 7. ASO

Dotyczy aplikacji mobilnej (Flutter) dla przewodnikow (check-in, zdjecia).

- Nazwa: "Tindur - Booking check-in", z podtytulem opisujacym funkcje.
- Slowa kluczowe: 30 znakow w App Store, 5 fraz w Google Play.
- Opis w sklepach faktograficzny, z podpunktami funkcji.
- Screeny 6+ i wideo z uzyciem aplikacji.
- Ocena min 4.6, zbierana od poczatku.
- Jezyki: EN (podstawa), pozniej IS i DE.

---

## 8. ANALITYKA (GTM + GA4)

- Jeden kontener GTM -> tag GA4.
- Standardowe eventy GA4 + wlasne z dataLayer.
- Konwersje w GA4: rezerwacja, begin_checkout, rejestracja, zapis na demo, formularz kontaktowy, klik "pricing".

Pomiar widgetu:

- Event z widgetu idzie przez GTM do dataLayer (nazwa operatora, wartosc).
- UTM na linkach do widgetu i stron operatorow (kanal, kampania).
- Segmentacja B2B vs B2C po zrodle ruchu.

Dodatkowe:

- CAPI (server-side, Supabase Edge Functions) dla kampanii platnych.
- Wykluczenie botow i ruchu wewnetrznego.
- Raportowanie w panelu: organic, CWV, konwersje.

---

## 9. ROADMAP (3 miesiace)

### Miesiac 1 — fundament technical

- PageSpeed min 90 na mobile.
- On-page SEO: tytuly, meta, H1, schema, linking wewnetrzny.
- GA4 + GTM + cele konwersji.
- GBP + pierwsze recenzje (5-8).
- Landingi /pricing i /product.
- 10 artykulow (6 B2B, 2 B2C, 2 guide).

### Miesiac 2 — tresci i lokalna

- Silo /features i /islandlanding.
- Pillar A "direct booking" + 8 artykulow.
- Strona /comparisons/getyourguide.
- NAP spójny, recenzje GBP, landpage Reykjavik.
- Lead magnets (dane "Iceland booking 2026").

### Miesiac 3 — link building i raport

- Guest posty 2-3.
- Zgloszenia do G2, Capterra, Product Hunt.
- Strona /faq.
- Pierwszy raport wynikow: rankingi, impresje, klikniecia.

KPI po 3 miesiacach:

- Ruch organiczny: ok. 2 000 sesji/mies.
- Seria 30-40 artykulow opublikowanych.
- 8-12 domen odnoszacych (linki).
- Strona w top 20 na frazy B2B z trudnoscia 25-40.

---

## Podsumowanie

Tindur ma nisze: 0% prowizji od direct i islandzkie workflow (force majeure, pogoda, ISK). SEO budujemy w kolejnosci: fundament techniczny, content B2B bottom-funnel, content B2C jako zrodlo linkow, lokalna obecnosc w Islandii. Efekt po 3 miesiacach to pierwsze 2 000 sesji i rozpoznawalnosc w srodowisku operatorow.
