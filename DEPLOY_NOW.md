# 🚀 TINDUR - QUICK DEPLOYMENT (12 minut)

## STATUS
✅ Kod kompletny: 103 pliki (~2.3 MB)
✅ GitHub: https://github.com/Rademenes12/Tindur
✅ Stack: Next.js 15 + Supabase + Vercel

## 3 KROKI DO LIVE:

### 1️⃣ SUPABASE (5 min)
https://supabase.com/dashboard
- New Project → "tindur"
- Region: West EU (Ireland)
- SQL Editor → wklej `/supabase/schema.sql`
- Run → 10 tabel utworzonych
- Settings → API → skopiuj ANON_KEY + URL

### 2️⃣ VERCEL (5 min)
https://vercel.com/new
- Import Git → Rademenes12/Tindur
- Root Directory: `www`
- Framework: Next.js (auto)
- Environment Variables:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
  ```
- Deploy → URL: https://tindur-*.vercel.app

### 3️⃣ ACTIVEPIECES (2 min)
http://186.240.149.141:8082
- New Flow
- Trigger: GitHub Push (Rademenes12/Tindur, main)
- Action: Telegram Message
  - Token: 8706700402:AAEGIcjV39eRnILnSi9SUT2KvTI8FdhJWsI
  - Chat: 8949173170
  - Text: "🚀 Deployed! {{trigger.commits[0].message}}"
- Publish

## ✅ DONE!
Tindur LIVE + auto-deploy on push + Telegram notifications

---

**Koszt:** Free tier (Vercel Hobby + Supabase Free = $0)
**Auto-deploy:** Każdy git push → Vercel redeploy
**Notifications:** Telegram przy każdym deployment
