# Tindur

Platforma bookingowa B2B dla touroperatorow (Islandia + Nordyki).

## Quick Links

- **Panel Agent Zero:** https://agent-zero-sa57.srv1881228.hstgr.cloud
- **Documentation:** `/root/projects/Tindur/reports/`
- **Legal:** `/root/projects/Tindur/legal/`

## Stack

- **Frontend:** Next.js 15 + TypeScript + Tailwind v4 + shadcn/ui
- **Backend:** Supabase (Postgres + RLS + Edge Functions + Realtime)
- **Auth:** Supabase GoTrue + JWT
- **Payments:** Stripe + Stripe Connect
- **Mobile:** Flutter 3.x + supabase-dart + riverpod
- **Hosting:** Vercel + Supabase Cloud
- **Currency:** ISK (native), EUR, USD, PLN

## Project Structure

```
/root/projects/Tindur/
├── architecture.html          # Diagram architektury
├── BRIEF.md                   # Krotki opis projektu
├── reports/                   # Raporty od agentow
│   ├── 02_database.sql        # Schemat Supabase
│   ├── 05_legal.md            # Dokumenty prawne
│   ├── 06_finance.md          # Model cenowy
│   ├── 09_risks.md            # Risk assessment
│   ├── 10_devops.md           # Setup checklist
│   └── ...
├── legal/                     # Regulaminy, RODO, Cookies
└── deploy_agents.sh           # Skrypt do uruchamiania agentow
```

## Setup

1. **SSH to VPS:**
   ```bash
   ssh root@186.240.149.141
   ```

2. **Open Agent Zero panel:**
   https://agent-zero-sa57.srv1881228.hstgr.cloud (azero / CzaryMary66!)

3. **Project files:**
   `/a0/usr/projects/Tindur/` (in Agent Zero container)

## Roadmap

- [ ] MVP: Booking Widget + Org Dashboard
- [ ] Mobile app (Flutter) for guides
- [ ] API for partners
- [ ] Multi-country (Norway, Sweden, Denmark)
- [ ] White-label for operators
