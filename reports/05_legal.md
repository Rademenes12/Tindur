[0m
> build · claude-opus-4-6
[0m
I'll create these four legal documents for Tindur. Let me plan this out and work on them in parallel.
[0m# [0mTodos
[ ] Create Regulamin Serwisu (Terms of Service) - 20 paragraphs
[ ] Create Polityka Prywatności (Privacy Policy) - GDPR compliant
[ ] Create Polityka Cookies (Cookie Policy)
[ ] Create Regulamin Reklamacji i Zwrotów
[0m
Let me first check the project structure to understand where to place legal documents.
[0m→ [0mRead .
[0m→ [0mRead BRIEF.md
Good, I have the project context. Now I'll create a `legal/` directory and write all four documents. Let me work on them in parallel.
[0m
[0m# [0mTodos
[•] Create Regulamin Serwisu (Terms of Service) - 20 paragraphs
[ ] Create Polityka Prywatności (Privacy Policy) - GDPR compliant
[ ] Create Polityka Cookies (Cookie Policy)
[ ] Create Regulamin Reklamacji i Zwrotów
[0m
[0m$ [0mmkdir -p /root/projects/Tindur/legal
(no output)
[0m
Now I'll create all four documents in parallel:
[0m← [0mWrite legal/01_regulamin_serwisu.md
Wrote file successfully.
[0m
[0m← [0mWrite legal/02_polityka_prywatnosci.md
Wrote file successfully.
[0m
[0m← [0mWrite legal/03_polityka_cookies.md
Wrote file successfully.
[0m
[0m← [0mWrite legal/04_regulamin_reklamacji_i_zwrotow.md
Wrote file successfully.
[0m
[0m# [0mTodos
[✓] Create Regulamin Serwisu (Terms of Service) - 20 paragraphs
[✓] Create Polityka Prywatności (Privacy Policy) - GDPR compliant
[✓] Create Polityka Cookies (Cookie Policy)
[✓] Create Regulamin Reklamacji i Zwrotów
[0m
Wszystkie 4 dokumenty prawne zostaly utworzone w katalogu `legal/`. Podsumowanie:

### Struktura plikow

```
legal/
  01_regulamin_serwisu.md          -- Regulamin Serwisu (Terms of Service)
  02_polityka_prywatnosci.md       -- Polityka Prywatnosci (Privacy Policy)
  03_polityka_cookies.md           -- Polityka Cookies (Cookie Policy)
  04_regulamin_reklamacji_i_zwrotow.md -- Regulamin Reklamacji i Zwrotow
```

### Co zawieraja dokumenty

**1. Regulamin Serwisu** (20 paragrafoow) -- `01_regulamin_serwisu.md`
- Definicje (Turysta, Organizator, Przewodnik, Booking Widget, Org Dashboard)
- Rola Operatora jako posrednika technologicznego (nie strona umowy turystycznej)
- Proces rezerwacji przez Booking Widget z integracaja Stripe
- Ceny w ISK, SCA/3D Secure (PSD2), brak przechowywania danych kart
- Prawa Turysty zgodne z Dyrektywa (UE) 2015/2302
- Warunki anulacji z odniesieniem do nadzwyczajnych okolicznosci
- ADR/ODR (Neytendastofa, platforma ODR UE)
- Jurysdykcja: prawo islandzkie + Bruksela I bis dla konsumentow UE

**2. Polityka Prywatnosci** (17 paragrafow) -- `02_polityka_prywatnosci.md`
- Pelna zgodnosc z GDPR/RODO + islandzka ustawa nr 90/2018
- Tabela celow i podstaw prawnych przetwarzania (art. 6 GDPR)
- Kategorie danych dla kazdego typu uzytkownika
- Odbiorcy danych: Stripe, Supabase, Vercel -- z podstawami transferu do USA (SCC, DPF)
- Transfer Impact Assessment (TIA)
- Tabela okresow przechowywania danych
- Prawa podmiotow danych (art. 15-22 GDPR)
- DPO wyznaczony, organ nadzorczy: Personuvernd

**3. Polityka Cookies** (11 paragrafow) -- `03_polityka_cookies.md`
- Tabele cookies z podzialem na 4 kategorie (niezbedne, funkcjonalne, analityczne, marketingowe)
- Konkretne nazwy cookies: `sb-access-token`, `__stripe_mid`, `tindur_consent`, `_ga` itd.
- Mechanizm CMP (Consent Management Platform)
- Cookies w kontekscie iframe (Booking Widget) -- CHIPS, SameSite=None
- Local Storage / Session Storage
- Brak cookie walls -- zgodnosc z wytycznymi EDPB 05/2020

**4. Regulamin Reklamacji i Zwrotow** (22 paragrafy) -- `04_regulamin_reklamacji_i_zwrotow.md`
- Standardowe progi anulacyjne (14d/7d/48h) z minimalnymi zwrotami
- Pelna implementacja Dyrektywy (UE) 2015/2302 (imprezy turystyczne, nadzwyczajne okolicznosci, obnizka ceny)
- Procedura zwrotu przez Stripe (SCA/PSD2)
- Formularz reklamacyjny, terminy rozpatrywania (14/30 dni)
- Vouchery/kredyty -- dobrowolnosc, 12-miesiezna waznosc
- ADR/ODR z konkretnymi organami (Neytendastofa, Kaerunefnd)
- Zabezpieczenie od niewyplacalnosci Organizatora
- Roznice kursowe ISK

### Placeholdery do uzupelnienia

Wszystkie dokumenty zawieraja placeholdery `[DATA]`, `[NR]`, `[ADRES]` -- do uzupelnienia przed wdrozeniem konkretnymi danymi Tindur ehf.
