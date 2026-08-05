export interface Organization {
  id: string;
  name: string;
  email: string;
  address?: string;
  created_at: string;
}

export interface Experience {
  id: string;
  organization_id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  capacity: number;
  location: string;
  tags?: string[];
}

export interface Schedule {
  id: string;
  experience_id: string;
  start_time: string;
  end_time: string;
  available_slots: number;
}

export interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
}

export interface Booking {
  id: string;
  experience_id: string;
  customer_id: string;
  schedule_id: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_price: number;
  currency: string;
  created_at: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'ucceeded' | 'failed' | 'efunded';
  method: 'card' | 'transfer' | 'wallet';
  created_at: string;
}

export interface Payout {
  id: string;
  amount: number;
  currency: string;
  status: 'processing' | 'completed' | 'failed';
  bank_details?: string;
  created_at: string;
}

export interface ApiKey {
  id: string;
  name: string;
  last_used_at?: string;
  created_at: string;
}

export interface ApiError extends Error {
  status?: number;
  code?: string;
  message?: string;
}