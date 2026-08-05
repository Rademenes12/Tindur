[0m
> build · gpt-5-codex
[0m
**Supabase**
- Utwórz projekt w panelu Supabase (`Region: EU`, `Pricing: Pro`) i pobierz `anon`, `service_role`, `database_url`.
- Zainicjuj lokalnie repo schem (`supabase init --project-ref <ref>`), ustaw `env` w `.env.local` i `.env`.
- Migruj schemat (`supabase db push`), dodaj polityki RLS (`supabase db reset --schema public`) i przetestuj `auth` oraz `storage`.
- Utwórz edge function `notifications` (`supabase functions new notifications`) i wdroż (`supabase functions deploy notifications --project-ref <ref>`).
- Skonfiguruj cron/timers i logi w panelu Observability → Log Drains (kieruj do Sentry/Logflare).

**Vercel**
- Stwórz projekt w Vercel (`vercel init`, `vercel link`) i ustaw framework Next.js (jeśli dotyczy).
- Dodaj zmienne środowiskowe (`vercel env add SUPABASE_URL`, `SUPABASE_ANON_KEY`, `STRIPE_SECRET_KEY`, itp. dla dev/staging/prod).
- Skonfiguruj domeny (`vercel domains add tindur.is`, `tindur.com`) i ustaw rewrit-y/podstrony.
- Wymuś ochranę gałęzi produkcyjnej (`Production Branch: main`) oraz ustaw preview na `staging`.
- Włącz Vercel Analytics/Speed Insights i log drains do zewnętrznych narzędzi.

**Stripe**
- Utwórz konto Stripe (Production + Test), zweryfikuj dane firmy oraz aktywuj Connect (Standard/Express według potrzeb).
- Zdefiniuj produkty i ceny (`stripe products create --name "Premium"`; `stripe prices create --unit-amount 9900 --currency isk --product <id>`).
- Skonfiguruj webhooki (`stripe listen --forward-to https://api.tindur.is/api/stripe/webhook`), dodaj `STRIPE_WEBHOOK_SECRET`.
- Utwórz konto Connect i testowe subkonta, zweryfikuj payout schedule.
- Włącz Radar rules, 3DS i monitoruj dispute dashboard.

**GitHub**
- Utwórz repo prywatne `tindur/tindur` i ustaw branch default `main`, protect `main`.
- Skonfiguruj branch `develop` i konwencję PR (require reviews, status checks).
- Dodaj GitHub Actions secrets (`SUPABASE_SERVICE_KEY`, `STRIPE_SECRET_KEY`, `VERCEL_TOKEN`, `SENTRY_AUTH_TOKEN`).
- Włącz Actions workflow permissions (`Read repo, Write packages`) i Dependabot alerts.
- Stwórz CODEOWNERS i branch protection rules (statusy test, lint, build).

**Monitoring**
- Utwórz projekt Sentry (`sentry-cli projects create tindur-web`), dodaj DSN do Vercel env.
- Skonfiguruj Plausible self-host (`docker compose up -d plausible`) lub SaaS, dodaj domeny `tindur.is`, `tindur.com`.
- Dodaj UptimeRobot/BetterStack check (`https` + cron) dla `www`, `api`, `supabase`.
- Włącz alerty mail/slack i testuj wywołania (`curl -I https://tindur.is/healthz`).
- Dokumentuj procedury eskalacji i kontakty on-call.

**CI/CD pipeline**
- Utwórz workflow `.github/workflows/ci.yml` z jobami `lint`, `test`, `build`, `deploy`.
- Dodaj cache zależności (`actions/setup-node`, `pnpm install`, `pnpm test`, `pnpm build`).
- Wdróż staging (`vercel deploy --prebuilt --env=staging`) po merge do `develop`.
- Produkcja: manualny approval lub tag release (`workflow_dispatch`, `vercel deploy --prod`).
- Raportuj status do Slack/Teams poprzez `actions/github-script` lub webhook.

**Environments**
- Zdefiniuj zestawy env: `dev` (local + Supabase lokalny), `staging` (Supabase projekt test, Vercel preview), `prod`.
- Stosuj `.env.local`, `.env.staging`, `.env.production` z minimalnym zbiorem sekretów.
- Automatycznie propaguj Secret Manager (Vercel Env Sync lub Doppler).
- Dla Supabase uruchom oddzielne instancje `Project-Staging`, `Project-Prod`.
- W dokumentacji opisz przepływ migracji i procedurę rollback.

**Domeny**
- Zarejestruj `tindur.is`, `tindur.com` (Icelandic NIC + standard registrar), skonfiguruj DNS w Cloudflare.
- Dodaj `*.tindur.is` wildcard (CNAME → Vercel) i rekordy `api.tindur.is` (A/AAAA → reverse proxy).
- Ustaw rekordy `MX`, `SPF`, `DKIM`, `DMARC` dla poczty.
- Monitoruj propagację (`dig +short tindur.is`, `nslookup api.tindur.is`).
- Dokumentuj właścicieli domen i odnowienie (auto-renew).

**SSL/TLS**
- Włącz Universal SSL w Cloudflare oraz auto-issuer (Let's Encrypt + Google Trust Services).
- Dla niestandardowych hostów użyj `certbot certonly --dns-cloudflare -d *.tindur.is`.
- Upewnij się, że Vercel ma certyfikaty dla domen (`vercel certs ls`).
- Wymuś HSTS (`Strict-Transport-Security` header) i TLS 1.2+.
- Testuj SSL Labs (`https://www.ssllabs.com/ssltest/analyze.html?d=tindur.is`).

**Backup**
- Skonfiguruj Supabase PITR (`Point-in-time Recovery`) oraz `supabase db dump --project-ref <ref> --password`.
- Automatyczne backupy (cron) do S3/Backblaze z szyfrowaniem (`aws s3 cp backup.sql s3://tindur-backups/`).
- Archiwizuj pliki userów (Supabase storage → `rclone sync` do cold storage).
- Zdefiniuj retencję: daily (7 dni), weekly (4 tyg), monthly (6 mies).
- Testuj odtwarzanie raz na kwartał (`supabase db restore --source backup.sql`).

**Security**
- Włącz Cloudflare WAF (`Managed Ruleset`, `Rate Limiting`) i firewall allowlist dla admin panelu.
- Ustaw DDoS protection (Cloudflare Advanced DDoS) i monitoruj ataki.
- Implementuj rate limiting w API (`@upstash/ratelimit`, `redis`).
- Wymuś MFA dla zespołu (Supabase, Vercel, Stripe, GitHub).
- Przeprowadź pentest checklist i rejestr incydentów.

**Scaling**
- Zdefiniuj metryki skalowania (CPU, pamięć, RPS) dla Supabase bez serverless limitów.
- Określ progi upgrade: `Supabase Tier → Launch`, `Vercel Plan → Pro`, `Stripe Radar → Advanced`.
- Przygotuj plan horyzontalny (edge cache, CDN, dedykowane DB read replicas).
- Wdróż queue workers (Supabase Edge + Vercel Cron) przy wzroście zadań async.
- Dokumentuj procedurę load test (`k6 run loadtest.js`) i analizę wyników.

**Observability**
- Skonfiguruj log shipping (Supabase → Logflare/Splunk, Vercel → Log drains).
- Ustaw metrics stack (Grafana Cloud/Prometheus via Cloudflare Workers logs).
- Włącz tracing (OpenTelemetry `@vercel/otel` lub `Sentry Performance`) i instrumentuj kluczowe flow.
- Definiuj dashboardy KPI (aktywni użytkownicy, conversion, error rate).
- Ustaw alerty (PagerDuty/Slack) z progami dla błędów, czasów odpowiedzi, płatności.
