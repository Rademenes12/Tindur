export type Role = 'tourist' | 'guide' | 'org_admin' | 'super_admin';
export type Locale = 'pl' | 'en' | 'is';
export type Currency = 'ISK' | 'EUR' | 'USD' | 'PLN';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type CancellationPolicy = 'flexible' | 'moderate' | 'strict';
export type ExperienceStatus = 'draft' | 'active' | 'paused' | 'archived';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';

export interface I18nText {
  pl: string;
  en: string;
  is: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  org_id: string;
  title_i18n: I18nText;
  description_i18n: I18nText;
  category: string;
  price_cents: number;
  currency: Currency;
  duration_minutes: number;
  max_participants: number;
  difficulty: Difficulty;
  location: string;
  included: string[];
  not_included: string[];
  cancellation_policy: CancellationPolicy;
  images: string[];
  status: ExperienceStatus;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  experience_id: string;
  customer_id: string;
  guide_id?: string | null;
  date: string;
  time: string;
  participants: number;
  status: BookingStatus;
  total_cents: number;
  currency: Currency;
  stripe_payment_intent_id?: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  amount_cents: number;
  currency: Currency;
  status: PaymentStatus;
  stripe_transfer_id?: string | null;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  role: Role;
  locale: Locale;
  full_name: string | null;
  created_at: string;
}

export interface Schedule {
  id: string;
  experience_id: string;
  date: string;
  start_time: string;
  end_time: string;
  available_slots: number;
  blocked: boolean;
}

export interface Review {
  id: string;
  booking_id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string | null;
  created_at: string;
}