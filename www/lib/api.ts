import { createClient } from '@supabase/supabase-js';
import { Organization, Experience, Availability, Customer } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getOrganization(orgId: string): Promise<Organization | null> {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', orgId)
    .single();

  if (error) {
    console.error('Error fetching organization:', error);
    return null;
  }

  return data;
}

export async function getExperiences(orgId: string): Promise<Experience[]> {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('organization_id', orgId)
    .eq('is_active', true)
    .order('title');

  if (error) {
    console.error('Error fetching experiences:', error);
    return [];
  }

  return data || [];
}

export async function getAvailability(
  experienceId: string,
  startDate: string,
  endDate: string
): Promise<Availability[]> {
  const { data, error } = await supabase
    .from('availability')
    .select('*')
    .eq('experience_id', experienceId)
    .gte('date', startDate)
    .lte('date', endDate)
    .gt('available_spots', 0)
    .order('date')
    .order('time');

  if (error) {
    console.error('Error fetching availability:', error);
    return [];
  }

  return data || [];
}

export async function createBooking(
  experienceId: string,
  availabilityId: string,
  adults: number,
  children: number,
  customer: Customer,
  paymentMethod: 'stripe' | 'onsite'
): Promise<{ bookingId: string; clientSecret?: string } | null> {
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      experience_id: experienceId,
      availability_id: availabilityId,
      adults,
      children,
      customer_first_name: customer.firstName,
      customer_last_name: customer.lastName,
      customer_email: customer.email,
      customer_phone: customer.phone,
      customer_country: customer.country,
      special_requests: customer.specialRequests,
      payment_method: paymentMethod,
      status: paymentMethod === 'stripe' ? 'pending_payment' : 'confirmed',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating booking:', error);
    return null;
  }

  if (paymentMethod === 'stripe') {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId: data.id }),
    });

    const { clientSecret } = await response.json();
    return { bookingId: data.id, clientSecret };
  }

  return { bookingId: data.id };
}

export async function updateBookingStatus(
  bookingId: string,
  status: string
): Promise<boolean> {
  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId);

  if (error) {
    console.error('Error updating booking:', error);
    return false;
  }

  return true;
}