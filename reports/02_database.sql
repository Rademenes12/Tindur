[0m
> build · gpt-5-codex
[0m
**Schemat Supabase**
- Kompletny skrypt SQL: rozszerzenia, typy enum, tabele, klucze obce i indeksy dla calej domeny bookingowej Tindur.
- Funkcje pomocnicze, triggery aktualizacji/audytu oraz spójny zestaw polityk RLS zgodnych z rolami (tourist, guide, org_admin, super_admin, service_role).
- Sekcja danych przykładowych (łącznie z tworzeniem kont auth) z `ON CONFLICT`, gotowa do uruchomienia w środowisku developerskim Supabase.
- Komentarze po polsku ułatwiają konfigurację i dalsze rozszerzenia.

```sql
-- SCHEMAT BAZY DANYCH "Tindur" dla Supabase
-- Uruchom jako rola service_role / supabase_admin, aby ominąć ograniczenia RLS podczas inicjalizacji.

-- ===========================================
-- 1. Rozszerzenia wymagane przez schemat
-- ===========================================
create extension if not exists pgcrypto;
create extension if not exists "citext";

-- ===========================================
-- 2. Typy enumerowane
-- ===========================================
create type public.user_role as enum ('tourist','org_admin','guide','super_admin');
create type public.resource_type as enum ('accommodation','vehicle','vessel','guide','equipment','other');
create type public.schedule_status as enum ('draft','published','cancelled','sold_out','archived');
create type public.pricing_strategy as enum ('base','seasonal','early_bird','last_minute','custom');
create type public.booking_status as enum ('pending','awaiting_payment','confirmed','cancelled','completed','expired');
create type public.payment_status as enum ('requires_action','authorized','succeeded','failed','refunded');
create type public.checkin_status as enum ('scheduled','in_progress','completed','no_show');
create type public.blog_status as enum ('draft','review','scheduled','published','archived');
create type public.audit_action as enum ('insert','update','delete');

-- ===========================================
-- 3. Tabele domenowe
-- ===========================================
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  website text,
  contact_email citext,
  contact_phone text,
  billing_address jsonb not null default '{}'::jsonb,
  timezone text not null default 'UTC',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint organizations_slug_format check (slug ~ '^[a-z0-9\-]+$')
);

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete set null,
  role public.user_role not null default 'tourist',
  email citext not null unique,
  first_name text not null,
  last_name text not null,
  phone text,
  language_code text not null default 'pl',
  profile_photo_url text,
  invited_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_login_at timestamptz,
  constraint users_org_role_check check (
    (role in ('tourist','super_admin') and organization_id is null)
    or (role in ('org_admin','guide') and organization_id is not null)
  )
);

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  resource_type public.resource_type not null,
  description text,
  capacity integer check (capacity is null or capacity >= 0),
  availability jsonb not null default '{}'::jsonb,
  location jsonb,
  contact_email citext,
  contact_phone text,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  slug text not null unique,
  summary text,
  description text,
  duration_minutes integer check (duration_minutes is null or duration_minutes > 0),
  base_price numeric(12,2) not null check (base_price >= 0),
  currency char(3) not null default 'PLN',
  tags text[] not null default array[]::text[],
  difficulty text,
  min_participants integer not null default 1 check (min_participants > 0),
  max_participants integer check (max_participants is null or max_participants >= min_participants),
  meeting_point jsonb,
  includes text[] not null default array[]::text[],
  excludes text[] not null default array[]::text[],
  is_featured boolean not null default false,
  is_published boolean not null default false,
  thumbnail_url text,
  gallery_urls text[] not null default array[]::text[],
  created_by uuid references public.users(id),
  updated_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.schedules (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.experiences(id) on delete cascade,
  resource_id uuid references public.resources(id) on delete set null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  timezone text not null default 'UTC',
  capacity_total integer not null check (capacity_total >= 0),
  capacity_reserved integer not null default 0 check (capacity_reserved >= 0),
  status public.schedule_status not null default 'draft',
  meeting_point text,
  notes text,
  price_override numeric(12,2) check (price_override is null or price_override >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint schedules_capacity_check check (capacity_reserved <= capacity_total),
  constraint schedules_time_check check (end_at > start_at)
);

create table public.pricing (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.experiences(id) on delete cascade,
  name text not null,
  strategy public.pricing_strategy not null default 'base',
  currency char(3) not null default 'PLN',
  price numeric(12,2) not null check (price >= 0),
  start_date date,
  end_date date,
  weekday_mask smallint[] not null default array[]::smallint[],
  min_participants integer,
  max_participants integer,
  min_days_notice integer not null default 0 check (min_days_notice >= 0),
  max_days_notice integer,
  promo_code text,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pricing_dates_check check (
    end_date is null or start_date is null or end_date >= start_date
  ),
  constraint pricing_weekday_range check (
    weekday_mask <@ array[0,1,2,3,4,5,6]::smallint[]
  ),
  constraint pricing_participants_range check (
    max_participants is null or min_participants is null or max_participants >= min_participants
  )
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  public_id text not null default ('BKG-' || upper(left(replace(gen_random_uuid()::text, '-', ''), 10))) unique,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  experience_id uuid not null references public.experiences(id),
  schedule_id uuid references public.schedules(id),
  pricing_id uuid references public.pricing(id),
  customer_id uuid not null references public.users(id),
  status public.booking_status not null default 'pending',
  participants_count integer not null default 1 check (participants_count > 0),
  total_amount numeric(12,2) not null check (total_amount >= 0),
  currency char(3) not null default 'PLN',
  discount_amount numeric(12,2) not null default 0 check (discount_amount >= 0),
  notes text,
  special_requirements text,
  source text not null default 'online',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  confirmed_at timestamptz,
  cancelled_at timestamptz,
  completed_at timestamptz,
  constraint bookings_discount_check check (discount_amount <= total_amount)
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  provider text not null default 'stripe',
  provider_payment_id text not null unique,
  status public.payment_status not null default 'requires_action',
  amount numeric(12,2) not null check (amount >= 0),
  currency char(3) not null default 'PLN',
  fee_amount numeric(12,2) not null default 0 check (fee_amount >= 0),
  receipt_url text,
  paid_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.checkins (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  guide_id uuid not null references public.users(id),
  status public.checkin_status not null default 'scheduled',
  latitude numeric(9,6),
  longitude numeric(9,6),
  notes text,
  photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  checked_at timestamptz,
  constraint checkins_location_check check (
    (latitude is null and longitude is null)
    or (latitude between -90 and 90 and longitude between -180 and 180)
  )
);

create table public.photos (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid references public.experiences(id) on delete cascade,
  booking_id uuid references public.bookings(id) on delete set null,
  uploaded_by uuid not null references public.users(id),
  url text not null,
  caption text,
  taken_at timestamptz,
  is_public boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint photos_experience_or_booking check (
    experience_id is not null or booking_id is not null
  )
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  experience_id uuid not null references public.experiences(id) on delete cascade,
  user_id uuid not null references public.users(id),
  rating smallint not null check (rating between 1 and 5),
  title text,
  comment text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  published_at timestamptz,
  constraint reviews_unique_reviewer_per_experience unique (experience_id, user_id)
);

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.users(id),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  status public.blog_status not null default 'draft',
  cover_image_url text,
  tags text[] not null default array[]::text[],
  seo jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.api_keys (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  key_prefix text not null,
  key_hash text not null unique,
  scopes text[] not null default array['bookings:read','bookings:write'],
  created_by uuid not null references public.users(id),
  created_at timestamptz not null default now(),
  last_used_at timestamptz,
  expires_at timestamptz,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  constraint api_keys_prefix_format check (char_length(key_prefix) = 8)
);

create table public.audit_log (
  id bigint generated always as identity primary key,
  occurred_at timestamptz not null default now(),
  actor_id uuid references public.users(id) on delete set null,
  actor_role public.user_role,
  organization_id uuid references public.organizations(id) on delete set null,
  table_name text not null,
  record_id uuid,
  action public.audit_action not null,
  description text,
  payload jsonb not null default '{}'::jsonb
);

-- ===========================================
-- 4. Indeksy dodatkowe
-- ===========================================
create index if not exists idx_organizations_active on public.organizations (is_active);
create index if not exists idx_users_org_role on public.users (organization_id, role);
create index if not exists idx_users_email_lower on public.users (lower(email));
create index if not exists idx_resources_org_type on public.resources (organization_id, resource_type);
create index if not exists idx_experiences_org_published on public.experiences (organization_id, is_published);
create index if not exists idx_schedules_experience_start on public.schedules (experience_id, start_at);
create index if not exists idx_pricing_experience_active on public.pricing (experience_id) where is_active;
create index if not exists idx_bookings_customer_status on public.bookings (customer_id, status);
create index if not exists idx_bookings_schedule on public.bookings (schedule_id);
create index if not exists idx_payments_booking on public.payments (booking_id);
create index if not exists idx_checkins_booking on public.checkins (booking_id);
create index if not exists idx_photos_experience_public on public.photos (experience_id) where is_public;
create index if not exists idx_reviews_experience on public.reviews (experience_id);
create index if not exists idx_blog_posts_status on public.blog_posts (status, published_at desc) where status = 'published';
create index if not exists idx_api_keys_org_active on public.api_keys (organization_id) where is_active;
create index if not exists idx_audit_log_table on public.audit_log (table_name);
create index if not exists idx_audit_log_occurred_at on public.audit_log (occurred_at desc);

-- ===========================================
-- 5. Funkcje pomocnicze (RLS, trigery)
-- ===========================================
create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users
    where id = auth.uid()
      and role = 'super_admin'
  );
$$;

create or replace function public.is_org_admin(target_org uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users
    where id = auth.uid()
      and (
        role = 'super_admin'
        or (target_org is not null and role = 'org_admin' and organization_id = target_org)
      )
  );
$$;

create or replace function public.is_org_staff(target_org uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users
    where id = auth.uid()
      and (
        role = 'super_admin'
        or (
          target_org is not null
          and role in ('org_admin','guide')
          and organization_id = target_org
        )
      )
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.log_audit_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor uuid := auth.uid();
  v_role public.user_role;
  v_org uuid;
  v_record uuid;
  v_payload jsonb;
  v_booking_id uuid;
begin
  if TG_OP = 'DELETE' then
    v_payload := to_jsonb(old);
    v_record := coalesce(old.id, old.booking_id);
  elsif TG_OP = 'INSERT' then
    v_payload := to_jsonb(new);
    v_record := coalesce(new.id, new.booking_id);
  else
    v_payload := jsonb_build_object('old', to_jsonb(old), 'new', to_jsonb(new));
    v_record := coalesce(coalesce(new.id, new.booking_id), old.booking_id);
  end if;

  select role, organization_id into v_role, v_org
  from public.users
  where id = v_actor;

  if TG_TABLE_NAME = 'bookings' then
    if TG_OP = 'DELETE' then
      v_org := coalesce(v_org, old.organization_id);
    else
      v_org := coalesce(v_org, new.organization_id);
    end if;
  elsif TG_TABLE_NAME = 'api_keys' then
    v_org := coalesce(v_org, case when TG_OP = 'DELETE' then old.organization_id else new.organization_id end);
  elsif TG_TABLE_NAME in ('payments','checkins') then
    v_booking_id := coalesce(coalesce(new.booking_id, old.booking_id), v_record);
    if v_booking_id is not null then
      select organization_id into v_org
      from public.bookings
      where id = v_booking_id
      limit 1;
    end if;
  end if;

  insert into public.audit_log (
    actor_id,
    actor_role,
    organization_id,
    table_name,
    record_id,
    action,
    description,
    payload
  )
  values (
    v_actor,
    v_role,
    v_org,
    TG_TABLE_SCHEMA || '.' || TG_TABLE_NAME,
    v_record,
    case TG_OP when 'INSERT' then 'insert' when 'UPDATE' then 'update' else 'delete' end,
    format('Akcja %s na tabeli %s (rekord %s)', TG_OP, TG_TABLE_NAME, coalesce(v_record::text, 'brak')),
    v_payload
  );

  if TG_OP = 'DELETE' then
    return old;
  end if;
  return new;
exception
  when others then
    if TG_OP = 'DELETE' then
      return old;
    else
      return new;
    end if;
end;
$$;

-- ===========================================
-- 6. Triggery aktualizacji znacznika czasu
-- ===========================================
create trigger organizations_set_updated_at
before update on public.organizations
for each row execute function public.set_updated_at();

create trigger users_set_updated_at
before update on public.users
for each row execute function public.set_updated_at();

create trigger resources_set_updated_at
before update on public.resources
for each row execute function public.set_updated_at();

create trigger experiences_set_updated_at
before update on public.experiences
for each row execute function public.set_updated_at();

create trigger schedules_set_updated_at
before update on public.schedules
for each row execute function public.set_updated_at();

create trigger pricing_set_updated_at
before update on public.pricing
for each row execute function public.set_updated_at();

create trigger bookings_set_updated_at
before update on public.bookings
for each row execute function public.set_updated_at();

create trigger payments_set_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

create trigger checkins_set_updated_at
before update on public.checkins
for each row execute function public.set_updated_at();

create trigger blog_posts_set_updated_at
before update on public.blog_posts
for each row execute function public.set_updated_at();

create trigger api_keys_set_updated_at
before update on public.api_keys
for each row execute function public.set_updated_at();

-- ===========================================
-- 7. Triggery audytowe (INSERT/UPDATE/DELETE)
-- ===========================================
create trigger bookings_audit
after insert or update or delete on public.bookings
for each row execute function public.log_audit_event();

create trigger payments_audit
after insert or update or delete on public.payments
for each row execute function public.log_audit_event();

create trigger checkins_audit
after insert or update or delete on public.checkins
for each row execute function public.log_audit_event();

create trigger api_keys_audit
after insert or update or delete on public.api_keys
for each row execute function public.log_audit_event();

-- ===========================================
-- 8. RLS: włączenie oraz polityki
-- ===========================================
alter table public.organizations enable row level security;
alter table public.users enable row level security;
alter table public.resources enable row level security;
alter table public.experiences enable row level security;
alter table public.schedules enable row level security;
alter table public.pricing enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;
alter table public.checkins enable row level security;
alter table public.photos enable row level security;
alter table public.reviews enable row level security;
alter table public.blog_posts enable row level security;
alter table public.api_keys enable row level security;
alter table public.audit_log enable row level security;

-- Polityki dla organizations
create policy organizations_service_role_all
on public.organizations
for all
using (coalesce(auth.role(), '') = 'service_role')
with check (coalesce(auth.role(), '') = 'service_role');

create policy organizations_super_admin_all
on public.organizations
for all
using (public.is_super_admin())
with check (public.is_super_admin());

create policy organizations_staff_read
on public.organizations
for select
using (public.is_org_staff(id));

create policy organizations_admin_update
on public.organizations
for update
using (public.is_org_admin(id))
with check (public.is_org_admin(id));

-- Polityki dla users
create policy users_service_role_all
on public.users
for all
using (coalesce(auth.role(), '') = 'service_role')
with check (coalesce(auth.role(), '') = 'service_role');

create policy users_super_admin_all
on public.users
for all
using (public.is_super_admin())
with check (public.is_super_admin());

create policy users_self_select
on public.users
for select
using (id = auth.uid());

create policy users_self_update
on public.users
for update
using (id = auth.uid())
with check (id = auth.uid());

create policy users_org_admin_select
on public.users
for select
using (public.is_org_admin(organization_id));

create policy users_org_admin_manage_staff
on public.users
for insert
with check (
  public.is_org_admin(organization_id)
  and role in ('guide','org_admin')
);

create policy users_org_admin_update_staff
on public.users
for update
using (public.is_org_admin(organization_id))
with check (
  public.is_org_admin(organization_id)
  and role in ('guide','org_admin')
);

-- Polityki dla resources
create policy resources_service_role_all
on public.resources
for all
using (coalesce(auth.role(), '') = 'service_role')
with check (coalesce(auth.role(), '') = 'service_role');

create policy resources_staff_access
on public.resources
for all
using (public.is_org_staff(organization_id) or public.is_super_admin())
with check (public.is_org_staff(organization_id) or public.is_super_admin());

-- Polityki dla experiences
create policy experiences_service_role_all
on public.experiences
for all
using (coalesce(auth.role(), '') = 'service_role')
with check (coalesce(auth.role(), '') = 'service_role');

create policy experiences_public_read
on public.experiences
for select
using (
  is_published
  or public.is_org_staff(organization_id)
  or public.is_super_admin()
);

create policy experiences_staff_write
on public.experiences
for insert
with check (public.is_org_admin(organization_id) or public.is_super_admin());

create policy experiences_staff_update
on public.experiences
for update
using (public.is_org_admin(organization_id) or public.is_super_admin())
with check (public.is_org_admin(organization_id) or public.is_super_admin());

create policy experiences_super_delete
on public.experiences
for delete
using (public.is_super_admin());

-- Polityki dla schedules
create policy schedules_service_role_all
on public.schedules
for all
using (coalesce(auth.role(), '') = 'service_role')
with check (coalesce(auth.role(), '') = 'service_role');

create policy schedules_public_select
on public.schedules
for select
using (
  status in ('published','sold_out')
  or public.is_org_staff((select organization_id from public.experiences e where e.id = schedules.experience_id))
  or public.is_super_admin()
);

create policy schedules_staff_write
on public.schedules
for all
using (
  public.is_org_admin((select organization_id from public.experiences e where e.id = schedules.experience_id))
  or public.is_super_admin()
)
with check (
  public.is_org_admin((select organization_id from public.experiences e where e.id = schedules.experience_id))
  or public.is_super_admin()
);

-- Polityki dla pricing
create policy pricing_service_role_all
on public.pricing
for all
using (coalesce(auth.role(), '') = 'service_role')
with check (coalesce(auth.role(), '') = 'service_role');

create policy pricing_staff_access
on public.pricing
for all
using (
  public.is_org_staff((select organization_id from public.experiences e where e.id = pricing.experience_id))
  or public.is_super_admin()
)
with check (
  public.is_org_admin((select organization_id from public.experiences e where e.id = pricing.experience_id))
  or public.is_super_admin()
);

-- Polityki dla bookings
create policy bookings_service_role_all
on public.bookings
for all
using (coalesce(auth.role(), '') = 'service_role')
with check (coalesce(auth.role(), '') = 'service_role');

create policy bookings_customer_read
on public.bookings
for select
using (
  customer_id = auth.uid()
  or public.is_org_staff(organization_id)
  or public.is_super_admin()
);

create policy bookings_customer_create
on public.bookings
for insert
with check (
  customer_id = auth.uid()
  or public.is_org_staff(organization_id)
  or public.is_super_admin()
);

create policy bookings_customer_update
on public.bookings
for update
using (customer_id = auth.uid())
with check (
  customer_id = auth.uid()
  and status in ('pending','cancelled')
);

create policy bookings_staff_manage
on public.bookings
for update
using (public.is_org_staff(organization_id) or public.is_super_admin())
with check (public.is_org_staff(organization_id) or public.is_super_admin());

create policy bookings_super_delete
on public.bookings
for delete
using (public.is_super_admin());

-- Polityki dla payments
create policy payments_service_role_all
on public.payments
for all
using (coalesce(auth.role(), '') = 'service_role')
with check (coalesce(auth.role(), '') = 'service_role');

create policy payments_related_access
on public.payments
for select
using (
  exists (
    select 1
    from public.bookings b
    where b.id = payments.booking_id
      and (
        b.customer_id = auth.uid()
        or public.is_org_staff(b.organization_id)
        or public.is_super_admin()
      )
  )
);

create policy payments_staff_write
on public.payments
for all
using (
  exists (
    select 1
    from public.bookings b
    where b.id = payments.booking_id
      and (
        public.is_org_admin(b.organization_id)
        or public.is_super_admin()
      )
  )
)
with check (
  exists (
    select 1
    from public.bookings b
    where b.id = payments.booking_id
      and (
        public.is_org_admin(b.organization_id)
        or public.is_super_admin()
      )
  )
);

-- Polityki dla checkins
create policy checkins_service_role_all
on public.checkins
for all
using (coalesce(auth.role(), '') = 'service_role')
with check (coalesce(auth.role(), '') = 'service_role');

create policy checkins_guide_access
on public.checkins
for all
using (
  guide_id = auth.uid()
  or exists (
    select 1
    from public.bookings b
    where b.id = checkins.booking_id
      and (
        public.is_org_staff(b.organization_id)
        or public.is_super_admin()
      )
  )
)
with check (
  guide_id = auth.uid()
  or public.is_super_admin()
);

-- Polityki dla photos
create policy photos_service_role_all
on public.photos
for all
using (coalesce(auth.role(), '') = 'service_role')
with check (coalesce(auth.role(), '') = 'service_role');

create policy photos_public_view
on public.photos
for select
using (
  is_public
  or uploaded_by = auth.uid()
  or public.is_super_admin()
  or exists (
    select 1
    from public.bookings b
    where b.id = photos.booking_id
      and (
        b.customer_id = auth.uid()
        or public.is_org_staff(b.organization_id)
      )
  )
  or exists (
    select 1
    from public.experiences e
    where e.id = photos.experience_id
      and public.is_org_staff(e.organization_id)
  )
);

create policy photos_uploader_manage
on public.photos
for all
using (uploaded_by = auth.uid() or public.is_super_admin())
with check (uploaded_by = auth.uid() or public.is_super_admin());

-- Polityki dla reviews
create policy reviews_service_role_all
on public.reviews
for all
using (coalesce(auth.role(), '') = 'service_role')
with check (coalesce(auth.role(), '') = 'service_role');

create policy reviews_public_read
on public.reviews
for select
using (
  is_published
  or user_id = auth.uid()
  or public.is_super_admin()
  or exists (
    select 1
    from public.bookings b
    where b.id = reviews.booking_id
      and public.is_org_staff(b.organization_id)
  )
);

create policy reviews_customer_write
on public.reviews
for insert
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.bookings b
    where b.id = reviews.booking_id
      and b.customer_id = auth.uid()
      and b.status in ('confirmed','completed')
  )
);

create policy reviews_customer_update
on public.reviews
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy reviews_staff_moderate
on public.reviews
for update
using (
  public.is_super_admin()
  or exists (
    select 1
    from public.bookings b
    where b.id = reviews.booking_id
      and public.is_org_admin(b.organization_id)
  )
)
with check (
  public.is_super_admin()
  or exists (
    select 1
    from public.bookings b
    where b.id = reviews.booking_id
      and public.is_org_admin(b.organization_id)
  )
);

-- Polityki dla blog_posts
create policy blog_posts_service_role_all
on public.blog_posts
for all
using (coalesce(auth.role(), '') = 'service_role')
with check (coalesce(auth.role(), '') = 'service_role');

create policy blog_posts_public_read
on public.blog_posts
for select
using (
  status = 'published'
  or public.is_super_admin()
  or author_id = auth.uid()
  or exists (
    select 1
    from public.users u
    where u.id = auth.uid()
      and u.role = 'org_admin'
  )
);

create policy blog_posts_author_manage
on public.blog_posts
for update
using (author_id = auth.uid())
with check (author_id = auth.uid());

create policy blog_posts_admin_manage
on public.blog_posts
for all
using (public.is_super_admin())
with check (public.is_super_admin());

-- Polityki dla api_keys
create policy api_keys_service_role_all
on public.api_keys
for all
using (coalesce(auth.role(), '') = 'service_role')
with check (coalesce(auth.role(), '') = 'service_role');

create policy api_keys_super_admin_all
on public.api_keys
for all
using (public.is_super_admin())
with check (public.is_super_admin());

create policy api_keys_org_admin_manage
on public.api_keys
for all
using (public.is_org_admin(organization_id))
with check (public.is_org_admin(organization_id));

-- Polityki dla audit_log
create policy audit_log_service_role
on public.audit_log
for select
using (coalesce(auth.role(), '') = 'service_role');

create policy audit_log_super_admin
on public.audit_log
for select
using (public.is_super_admin());

-- ===========================================
-- 9. Dane przykładowe (uruchamiaj po utworzeniu struktur)
-- ===========================================
-- Uwaga: funkcje auth_admin.create_user wymagają klucza serwisowego.
do $$
begin
  if not exists (select 1 from auth.users where id = '11111111-1111-1111-1111-111111111111') then
    perform auth_admin.create_user(
      user_id => '11111111-1111-1111-1111-111111111111'::uuid,
      email => 'super@tindur.com',
      password => 'Sup3rStrong!',
      email_confirm => true
    );
  end if;
  if not exists (select 1 from auth.users where id = '22222222-2222-2222-2222-222222222222') then
    perform auth_admin.create_user(
      user_id => '22222222-2222-2222-2222-222222222222'::uuid,
      email => 'adam@nordic-adventures.pl',
      password => 'Admin123!',
      email_confirm => true
    );
  end if;
  if not exists (select 1 from auth.users where id = '33333333-3333-3333-3333-333333333333') then
    perform auth_admin.create_user(
      user_id => '33333333-3333-3333-3333-333333333333'::uuid,
      email => 'marta.guide@nordic-adventures.pl',
      password => 'Guide123!',
      email_confirm => true
    );
  end if;
  if not exists (select 1 from auth.users where id = '44444444-4444-4444-4444-444444444444') then
    perform auth_admin.create_user(
      user_id => '44444444-4444-4444-4444-444444444444'::uuid,
      email => 'piotr.turysta@example.com',
      password => 'Tourist123!',
      email_confirm => true
    );
  end if;
end;
$$;

insert into public.organizations (id, name, slug, description, website, contact
