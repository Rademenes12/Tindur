import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'tripe';
import { z } from 'zod';

// Inicjalizacja Stripe (klucze najlepiej z env)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Supabase client (używamy service_role dla operacji backendowych jeśli wymagane)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Walidacja Body
const bookingSchema = z.object({
  experience_id: z.string().uuid(),
  date: z.string().datetime(), // ISO format
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/), // HH:MM
  participants: z.number().int().min(1).max(10),
  customer: z.object({
    email: z.string().email(),
    name: z.string().min(2),
    phone: z.string(),
  }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Walidacja Zod
    const validation = bookingSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const { experience_id, date, time, participants, customer } = validation.data;

    // 2. Pobranie danych doświadczenia (cena, waluta)
    const { data: experience, error: expError } = await supabase
      from('experiences')
      select('price, currency, organization_id')
      eq('id', experience_id)
      single();

    if (expError ||!experience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    // 3. Sprawdzenie dostępności (Conflict Check)
    // Sprawdzamy czy w tym samym czasie/dniu nie ma już zajętych slotów
    const { data: existingBookings, error: conflictError } = await supabase
      from('bookings')
      select('id')
      eq('experience_id', experience_id)
      eq('date', date)
      eq('time', time)
      eq('status', 'confirmed'); // Sprawdzamy tylko potwierdzone

    if (existingBookings && existingBookings.length > 0) {
      return NextResponse.json({ error: 'Time slot already booked' }, { status: 409 });
    }

    // 4. Obliczenia
    const totalAmountCents = Math.round(experience.price * participants * 100);
    const currency = experience.currency; // np. 'usd'

    // 5. Utworzenie Booking w Supabase
    const { data: newBooking, error: bookingError } = await supabase
      from('bookings')
        insert({
          experience_id,
          date,
          time,
          participants,
          customer_email: customer.email,
          customer_name: customer.name,
          customer_phone: customer.phone,
          total_amount: totalAmountCents,
          currency: currency,
          status: 'pending',
        })
        select()
        single();

    if (bookingError) throw bookingError;

    // 6. Utworzenie Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmountCents,
      currency: currency.toLowerCase(),
      metadata: {
        booking_id: newBooking.id,
        experience_id: experience_id,
      },
      // Opcjonalnie: automatic_payment_methods: { enabled: true },
    });

    // 7. Odpowiedź sukces
    return NextResponse.json({
      booking_id: newBooking.id,
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
    }, { status: 201 });

  } catch (error: any) {
    console.error('[BOOKING_API_ERROR]', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' }, 
      { status: error.status || 500 }
    );
  }
}