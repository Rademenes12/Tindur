-- TINDUR PLATFORM - PRODUCTION SCHEMA
-- Location: Iceland
-- Description: Complete booking system schema with RLS, Triggers, and Functions.

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- 1. ENUMS & CUSTOM TYPES
-- ==========================================

CREATE TYPE user_role AS ENUM ('tourist', 'guide', 'org_admin', 'uper_admin');
CREATE TYPE org_status AS ENUM ('active', 'uspended', 'trial');
CREATE TYPE experience_status AS ENUM ('draft', 'active', 'paused', 'archived');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE payment_status AS ENUM ('pending', 'ucceeded', 'failed', 'efunded');
CREATE TYPE payout_status AS ENUM ('pending', 'in_transit', 'paid', 'failed');
CREATE TYPE difficulty_level AS ENUM ('easy', 'edium', 'hard');
CREATE TYPE cancellation_policy AS ENUM ('flexible', 'oderate', 'trict');

-- ==========================================
-- 2. TABLES
-- ==========================================

-- 2.1 Organizations
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    address TEXT,
    default_locale TEXT NOT NULL DEFAULT 'en', -- pl, en, is
    default_currency TEXT NOT NULL DEFAULT 'ISK', -- ISK, EUR, USD, PLN
    timezone TEXT NOT NULL DEFAULT 'UTC',
    stripe_account_id TEXT,
    stripe_connected BOOLEAN DEFAULT FALSE,
    settings JSONB DEFAULT '{}', -- {colors, fonts, custom_domain}
    status org_status DEFAULT 'trial',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTZ NOT NULL DEFAULT NOW()
);

-- 2.2 Users
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'tourist',
    locale TEXT NOT NULL DEFAULT 'en',
    org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTZ NOT NULL DEFAULT NOW()
);

-- 2.3 Experiences
CREATE TABLE experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title_i18n JSONB NOT NULL, -- {pl: "...", en: "...", is: "..."}
    description_i18n JSONB NOT NULL,
    category TEXT NOT NULL,
    price_cents BIGINT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'ISK',
    duration_minutes INTEGER NOT NULL,
    max_participants INTEGER NOT NULL,
    difficulty difficulty_level NOT NULL,
    location TEXT,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    included TEXT[],
    not_included TEXT[],
    cancellation_policy cancellation_policy DEFAULT 'oderate',
    images TEXT[],
    status experience_status DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTZ NOT NULL DEFAULT NOW()
);

-- 2.4 Schedules
CREATE TABLE schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experience_id UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    available_slots INTEGER NOT NULL,
    booked_slots INTEGER NOT NULL DEFAULT 0,
    blocked BOOLEAN DEFAULT FALSE,
    guide_id UUID REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE(experience_id, date, start_time)
);

-- 2.5 Bookings
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experience_id UUID NOT NULL REFERENCES experiences(id),
    schedule_id UUID NOT NULL REFERENCES schedules(id),
    customer_id UUID NOT NULL REFERENCES users(id),
    guide_id UUID REFERENCES users(id),
    participants INTEGER NOT NULL DEFAULT 1,
    total_cents BIGINT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'ISK',
    status booking_status DEFAULT 'pending',
    stripe_payment_intent_id TEXT,
    stripe_charge_id TEXT,
    special_requests TEXT,
    cancellation_reason TEXT,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTZ NOT NULL DEFAULT NOW()
);

-- 2.6 Payments
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    amount_cents BIGINT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'ISK',
    application_fee_cents BIGINT NOT NULL, -- 3% take rate
    status payment_status DEFAULT 'pending',
    stripe_charge_id TEXT,
    stripe_transfer_id TEXT,
    stripe_refund_id TEXT,
    commission_cents BIGINT NOT NULL,
    payout_id UUID, -- Circular reference handled via ALTER
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTZ NOT NULL DEFAULT NOW()
);

-- 2.7 Payouts
CREATE TABLE payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    amount_cents BIGINT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'ISK',
    status payout_status DEFAULT 'pending',
    stripe_payout_id TEXT,
    period_start TIMESTAMPTZ,
    period_end TIMESTAMPTZ,
    arrival_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE payments ADD CONSTRAINT fk_payout FOREIGN KEY (payout_id) REFERENCES payouts(id);

-- 2.8 Reviews
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID UNIQUE NOT NULL REFERENCES bookings(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    photos TEXT[],
    is_public BOOLEAN DEFAULT TRUE,
    response TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTZ NOT NULL DEFAULT NOW()
);

-- 2.9 API Keys
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    name TEXT NOT NULL,
    key_hash TEXT UNIQUE NOT NULL,
    key_prefix TEXT NOT NULL,
    scopes TEXT[] NOT NULL,
    rate_limit_per_minute INTEGER DEFAULT 100,
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.10 Audit Log
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES users(id),
    org_id UUID REFERENCES organizations(id),
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID NOT NULL,
    metadata JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- 3. FUNCTIONS
-- ==========================================

-- Function: Calculate availability
CREATE OR REPLACE FUNCTION calculate_availability(exp_id UUID, target_date DATE)
RETURNS INTEGER AS $$
DECLARE
    slots INTEGER;
BEGIN
    SELECT (available_slots - booked_slots) INTO slots
    FROM schedules
    WHERE experience_id = exp_id AND date = target_date
    LIMIT 1;
    RETURN COALESCE(slots, 0);
END;
$$ LANGUAGE plpgsql;

-- Function: Calculate commission (3% take rate)
CREATE OR REPLACE FUNCTION calculate_commission(amount_cents BIGINT)
RETURNS BIGINT AS $$
BEGIN
    RETURN ROUND(amount_cents * 0.03);
END;
$$ LANGUAGE plpgsql;

-- Function: Generate API Key
CREATE OR REPLACE FUNCTION generate_api_key(p_org_id UUID, p_name TEXT, p_scopes TEXT[])
RETURNS TEXT AS $$
DECLARE
    raw_key TEXT;
    hashed_key TEXT;
    prefix TEXT;
BEGIN
    raw_key := encode(gen_random_bytes(32), 'hex');
    prefix := left(raw_key, 8);
    hashed_key := encode(digest(raw_key, 'ha256'), 'hex');
    
    INSERT INTO api_keys (org_id, name, key_hash, key_prefix, scopes)
    VALUES (p_org_id, p_name, hashed_key, prefix, p_scopes);
    
    RETURN prefix || '-' || raw_key;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 4. TRIGGERS
-- ==========================================

-- Trigger: Update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_orgs AFTER UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER tr_update_users AFTER UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER tr_update_exp AFTER UPDATE ON experiences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER tr_update_sched AFTER UPDATE ON schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER tr_update_bookings AFTER UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER tr_update_payments AFTER UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER tr_update_payouts AFTER UPDATE ON payouts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER tr_update_reviews AFTER UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update booked_slots when booking is confirmed
CREATE OR REPLACE FUNCTION on_booking_confirmed()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.status = 'confirmed' AND OLD.status!= 'confirmed') THEN
        UPDATE schedules SET booked_slots = booked_slots + NEW.participants 
        WHERE id = NEW.schedule_id;
    ELSIF (NEW.status = 'cancelled' AND OLD.status = 'confirmed') THEN
        UPDATE schedules SET booked_slots = booked_slots - NEW.participants 
        WHERE id = NEW.schedule_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_on_booking_status_change
AFTER UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION on_booking_confirmed();

-- Trigger: Create payout when payment succeeds
CREATE OR REPLACE FUNCTION on_payment_succeeded()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.status = 'ucceeded' AND OLD.status!= 'ucceeded') THEN
        INSERT INTO payouts (org_id, amount_cents, currency, status)
        SELECT org_id, NEW.amount_cents - NEW.commission_cents, NEW.currency, 'pending'
        FROM bookings b
        JOIN experiences e ON b.experience_id = e.id
        WHERE b.id = NEW.booking_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_on_payment_success
AFTER UPDATE ON payments
FOR EACH ROW EXECUTE FUNCTION on_payment_succeeded();

-- Trigger: Update experience rating when review is created
CREATE OR REPLACE FUNCTION on_review_created()
RETURNS TRIGGER AS $$
BEGIN
    -- In a real app, you'd recalculate the average rating here
    -- For this schema, we assume the rating is stored in experiences (omitted for brevity or handled via view)
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- 5.1 Organizations Policies
CREATE POLICY pol_org_public ON organizations FOR SELECT USING (status = 'active');
CREATE POLICY pol_org_admin ON organizations FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'org_admin' AND org_id = organizations.id)
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'uper_admin')
);

-- 5.2 Users Policies
CREATE POLICY pol_user_self ON users FOR SELECT USING (id = auth.uid());
CREATE POLICY pol_user_admin ON users FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'org_admin' AND org_id = users.org_id)
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'uper_admin')
);

-- 5.3 Experiences Policies
CREATE POLICY pol_exp_public ON experiences FOR SELECT USING (status = 'active');
CREATE POLICY pol_exp_admin ON experiences FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'org_admin' AND org_id = experiences.org_id)
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'uper_admin')
);

-- 5.4 Schedules Policies
CREATE POLICY pol_sched_public ON schedules FOR SELECT USING (
    EXISTS (SELECT 1 FROM experiences WHERE id = schedules.experience_id AND status = 'active')
);
CREATE POLICY pol_sched_admin ON schedules FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'org_admin' AND org_id = experiences.org_id)
);

-- 5.5 Bookings Policies
CREATE POLICY pol_book_customer ON bookings FOR SELECT USING (customer_id = auth.uid());
CREATE POLICY pol_book_guide ON bookings FOR SELECT USING (guide_id = auth.uid());
CREATE POLICY pol_book_admin ON bookings FOR ALL USING (
    EXISTS (SELECT 1 FROM users u JOIN experiences e ON e.org_id = u.org_id WHERE u.id = auth.uid() AND u.role = 'org_admin' AND e.id = bookings.experience_id)
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'uper_admin')
);

-- 5.6 Payments & Payouts (Strict)
CREATE POLICY pol_pay_admin ON payments FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('org_admin', 'uper_admin'))
);
CREATE POLICY pol_payout_admin ON payouts FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('org_admin', 'uper_admin'))
);

-- 5.7 Reviews
CREATE POLICY pol_rev_public ON reviews FOR SELECT USING (is_public = TRUE);
CREATE POLICY pol_rev_admin ON reviews FOR ALL USING (
    EXISTS (SELECT 1 FROM bookings b JOIN experiences e ON e.org_id = users.org_id 
            JOIN users ON users.id = auth.uid() 
            WHERE b.id = reviews.booking_id AND users.role = 'org_admin')
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'uper_admin')
);

-- 5.8 API Keys
CREATE POLICY pol_api_admin ON api_keys FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'org_admin' AND org_id = api_keys.org_id)
);

-- 5.9 Audit Log
CREATE POLICY pol_audit_super ON audit_log FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'uper_admin')
);

-- ==========================================
-- 6. INDICES
-- ==========================================

CREATE UNIQUE INDEX idx_org_slug ON organizations(slug);
CREATE UNIQUE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_org_id ON users(org_id);
CREATE INDEX idx_exp_org_status ON experiences(org_id, status);
CREATE INDEX idx_exp_title_gin ON experiences USING GIN (title_i18n);
CREATE INDEX idx_sched_exp_date ON schedules(experience_id, date);
CREATE INDEX idx_book_cust_date ON bookings(customer_id, created_at DESC);
CREATE INDEX idx_book_exp_status ON bookings(experience_id, status);
CREATE INDEX idx_pay_booking ON payments(booking_id);
CREATE INDEX idx_payout_org_status ON payouts(org_id, status, period_end DESC);
CREATE UNIQUE INDEX idx_rev_booking ON reviews(booking_id);
CREATE UNIQUE INDEX idx_api_key_hash ON api_keys(key_hash);
CREATE INDEX idx_audit_created ON audit_log(created_at DESC);
