import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

// --- TYPES ---

interface CreateBookingRequest {
  experience_id: string;
  schedule_id: string;
  customer: {
    email: string;
    name: string;
    phone: string;
  };
  participants: number;
  special_requests?: string;
}

interface CreateBookingResponse {
  booking_id: string;
  client_secret: string;
  payment_intent_id: string;
  total_cents: number;
  currency: string;
}

interface ErrorResponse {
  error: string;
}

// --- CONSTANTS & CONFIG ---

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, x-supabase-client-info, x-requested-with",
};

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// --- UTILS ---

const validateRequest = (body: any): CreateBookingRequest => {
  if (!body.experience_id ||!body.schedule_id ||!body.customer ||!body.participants) {
    throw new Error("Missing required fields");
  }
  if (typeof body.participants!== "number" || body.participants <= 0) {
    throw new Error("Participants must be a positive number");
  }
  if (!body.customer.email ||!body.customer.name) {
    throw new Error("Invalid customer details");
  }
  return body as CreateBookingRequest;
};

// --- MAIN FUNCTION ---

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  try {
    // 1. Auth Check (RLS context via JWT)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: {...CORS_HEADERS, "Content-Type": "application/json" } });
    }

    // Initialize Supabase (Service Role for DB writes, but we use Auth header for validation if needed)
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const supabaseUser = createClient(SUPABASE_URL, authHeader.replace("Bearer ", ""), {
      global: { headers: { Authorization: authHeader } },
    });

    // 2. Parse and Validate Body
    const body = await req.json();
    const { experience_id, schedule_id, customer, participants, special_requests } = validateRequest(body);

    // 3. Fetch Experience and Schedule Data
    const { data: experience, error: expError } = await supabaseAdmin
      from("experiences")
      select("price_cents, currency")
      eq("id", experience_id)
      single();

    const { data: schedule, error: schError } = await supabaseAdmin
      from("schedules")
      select("id, booked_slots, capacity")
      eq("id", schedule_id)
      single();

    if (expError ||!experience) throw new Error("Experience not found");
    if (schError ||!schedule) throw new Error("Schedule not found");

    // 4. Check Availability
    if (schedule.booked_slots + participants > schedule.capacity) {
      return new Response(JSON.stringify({ error: "Not enough slots available" }), { status: 409, headers: {...CORS_HEADERS, "Content-Type": "application/json" } });
    }

    // 5. Calculate Total
    const total_cents = experience.price_cents * participants;
    const currency = experience.currency || "usd";

    // 6. Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total_cents,
      currency: currency,
      metadata: { experience_id, schedule_id, customer_email: customer.email },
    });

    // 7. Create Booking in Database
    const { data: booking, error: bookingError } = await supabaseAdmin
      from("transactions")
      insert({
        experience_id,
        schedule_id,
        customer_details: customer,
        participants,
        total_cents,
        currency,
        stripe_payment_intent_id: paymentIntent.id,
        status: "pending",
        special_requests,
      })
      select()
      single();

    if (bookingError) throw bookingError;

    // 8. Update Schedule (Manual fallback for booked_slots)
    const { error: updateError } = await supabaseAdmin
      rpc("increment_booked_slots", { row_id: schedule_id, increment_by: participants });
    
    if (updateError) console.error("Failed to update schedule slots:", updateError);

    // 9. Trigger Confirmation Email (Async call to another function)
    const emailResponse = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-confirmation-email`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}", "Content-Type": "application/json" },
      body: JSON.stringify({ booking_id: booking.id, email: customer.email }),
    }).catch(err => console.error("Email trigger failed", err));

    // 10. Return Success
    const response: CreateBookingResponse = {
      booking_id: booking.id,
      client_secret: paymentIntent.client_secret!,
      payment_intent_id: paymentIntent.id,
      total_cents,
      currency,
    };

    return new Response(JSON.stringify(response), {
      status: 201,
      headers: {...CORS_HEADERS, "Content-Type": "application/json" },
    });

  } catch (err: any) {
    console.error(`[Error]: ${err.message}`);
    
    let status = 500;
    if (err.message.includes("not found")) status = 404;
    if (err.message.includes("Unauthorized")) status = 401;
    if (err.message.includes("Missing") || err.message.includes("Invalid")) status = 400;
    if (err.message.includes("slots")) status = 409;

    return new Response(JSON.stringify({ error: err.message }), {
      status,
      headers: {...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});