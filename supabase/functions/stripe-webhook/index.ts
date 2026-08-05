import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno";

// --- Types ---
type WebhookEvent = Stripe.Event;

// --- Constants & Config ---
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2022-11-15",
});

// --- CORS Headers ---
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, x-stripe-signature",
};

// --- Helpers ---

/**
 * Sprawdza czy event został już przetworzony (Idempotency)
 */
async function isEventProcessed(supabase: any, eventId: string): Promise<boolean> {
  const { data } = await supabase
    from("audit_log")
    select("id")
    eq("event_id", eventId)
    eq("type", "stripe_webhook")
    single();
  return!!data;
}

/**
 * Loguje przetworzone eventy w celu zapewnienia idempotencji
 */
async function logEvent(supabase: any, eventId: string, type: string) {
  await supabase.from("audit_log").insert({
    event_id: eventId,
    type: type,
    metadata: { processed_at: new Date().toISOString() },
  });
}

/**
 * Główna logika biznesowa dla poszczególnych typów eventów
 */
async function handleEvent(supabase: any, event: WebhookEvent) {
  const session = supabase.auth.admin; // Jeśli potrzebne do innych zadań

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const metadata = paymentIntent.metadata;

      // 1. Update payment status
      await supabase
        from("payments")
        update({ status: "succeeded", stripe_payment_intent_id: paymentIntent.id })
        eq("order_id", metadata.order_id);

      // 2. Create payout record
      await supabase.from("payouts").insert({
        order_id: metadata.order_id,
        amount: paymentIntent.amount,
        status: "pending",
        stripe_payout_id: paymentIntent.id,
      });
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await supabase
        from("payments")
        update({ status: "failed" })
        eq("stripe_payment_intent_id", paymentIntent.id);
      
      // Tutaj można dodać logikę wysyłki maila przez Supabase Edge Functions/Resend
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      await supabase
        from("payments")
        update({ status: "refunded" })
        eq("stripe_payment_intent_id", charge.payment_intent as string);
      break;
    }

    case "transfer.created": {
      const transfer = event.data.object as Stripe.Transfer;
      await supabase
        from("payouts")
        update({ status: "transferred" })
        eq("stripe_transfer_id", transfer.id);
      break;
    }

    case "payout.paid": {
      const payout = event.data.object as Stripe.Payout;
      await supabase
        from("payouts")
        update({ status: "paid" })
        eq("stripe_payout_id", payout.id);
      break;
    }

    case "account.updated": {
      const account = event.data.object as Stripe.Account;
      await supabase
        from("organizations")
        update({ stripe_connected: account.id })
        eq("stripe_account_id", account.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

// --- Main Handler ---

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return new Response(JSON.stringify({ error: "No signature" }), { status: 400, headers: {...corsHeaders, "Content-Type": "application/json" } });
    }

    const body = await req.text();
    let event: WebhookEvent;

    // 1. Verify Signature
    try {
      event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error(`❌ Signature verification failed: ${err.message}`);
      return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400, headers: {...corsHeaders, "Content-Type": "application/json" } });
    }

    // 2. Initialize Supabase Client (Service Role for admin access)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 3. Idempotency Check
    const alreadyProcessed = await isEventProcessed(supabase, event.id);
    if (alreadyProcessed) {
      console.log(`ℹ️ Event ${event.id} already processed. Skipping.`);
      return new Response(JSON.stringify({ received: true, status: "already_processed" }), { status: 200, headers: {...corsHeaders, "Content-Type": "application/json" } });
    }

    // 4. Process Event
    await handleEvent(supabase, event);

    // 5. Log success
    await logEvent(supabase, event.id, event.type);

    return new Response(JSON.stringify({ received: true }), { 
      status: 200, 
      headers: {...corsHeaders, "Content-Type": "application/json" } 
    });

  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500, 
      headers: {...corsHeaders, "Content-Type": "application/json" } 
    });
  }
});
