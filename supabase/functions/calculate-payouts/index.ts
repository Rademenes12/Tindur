import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno";

// --- TYPY ---
interface PayoutRecord {
  id: string;
  organization_id: string;
  amount_cents: number;
  commission_cents: number;
  status: 'pending' | 'completed' | 'failed';
  period_start: string;
  period_end: string;
  arrival_date: string;
  stripe_transfer_id?: string;
}

// --- HELPERS ---

/**
 * Dodaje dni robocze do daty (pomija soboty i niedziele)
 */
function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) {
      added++;
    }
  }
  return result;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// --- MAIN HANDLER ---

serve(async (req) => {
  // Obsługa CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Inicjalizacja klientów
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const stripe = new Stripe(stripeSecretKey, {
      httpClient: Stripe.createFetchHttpClient(),
    });

    // 2. Definicja okresu (ostatnie 7 dni)
    const now = new Date();
    const periodEnd = new Date(now);
    const periodStart = new Date(now);
    periodStart.setDate(now.getDate() - 7);

    console.log(`Starting payouts for period: ${periodStart.toISOString()} to ${periodEnd.toISOString()}`);

    // 3. Pobierz organizacje z aktywnym Stripe Connect
    const { data: organizations, error: orgError } = await supabase
      .from("organizations")
      .select("id, stripe_account_id")
      .not("stripe_account_id", "is", null);

    if (orgError) throw orgError;

    const results = [];

    for (const org of organizations) {
      // 4. Query successful payments w tym okresie dla danej org
      // Zakładamy tabelę 'payments' z kolumnami: organization_id, amount_cents, status, payout_id
      const { data: payments, error: payError } = await supabase
        .from("payments")
        .select("id, amount_cents")
        .eq("organization_id", org.id)
        .eq("status", "succeeded")
        .gte("created_at", periodStart.toISOString())
        .lt("created_at", periodEnd.toISOString())
        .is("payout_id", null); // Tylko nieprzypisane

      if (payError) {
        console.error(`Error fetching payments for org ${org.id}:`, payError);
        continue;
      }

      if (payments.length === 0) continue;

      // 5. Obliczenia
      const totalGrossCents = payments.reduce((sum, p) => sum + p.amount_cents, 0);
      const commissionRate = 0.03;
      const commissionCents = Math.round(totalGrossCents * commissionRate);
      const payoutAmountCents = totalGrossCents - commissionCents;

      if (payoutAmountCents <= 0) {
        console.warn(`Insufficient amount for payout for org ${org.id}`);
        continue;
      }

      // 6. Oblicz datę przybycia (+2 dni robocze)
      const arrivalDate = addBusinessDays(new Date(), 2);

      // 7. Tworzenie rekordu Payout w Supabase (status: pending)
      const { data: payout, error: payoutError } = await supabase
        .from("payouts")
        .insert({
          organization_id: org.id,
          amount_cents: payoutAmountCents,
          commission_cents: commissionCents,
          status: "pending",
          period_start: periodStart.toISOString(),
          period_end: periodEnd.toISOString(),
          arrival_date: arrivalDate.toISOString(),
        })
        .select()
        .single();

      if (payoutError) {
        console.error(`Error creating payout record for org ${org.id}:`, payoutError);
        continue;
      }

      // 8. Stripe: Create Transfer (Stripe Connect)
      // Przesyłamy środki z platformy do Connected Account
      try {
        const transfer = await stripe.transfers.create({
          amount: payoutAmountCents,
          currency: "usd", // lub pobrane z config org
          destination: org.stripe_account_id,
        });

        // 9. Update payout z ID transferu ze Stripe
        await supabase
          .from("payouts")
          .update({ stripe_transfer_id: transfer.id })
          .eq("id", payout.id);

        // 10. Mark payments z tym payout_id
        const paymentIds = payments.map((p) => p.id);
        await supabase
          .from("payments")
          .update({ payout_id: payout.id })
          .in("id", paymentIds);

        results.push({ org_id: org.id, payout_id: payout.id, status: "success" });
      } catch (stripeErr) {
        console.error(`Stripe transfer failed for org ${org.id}:`, stripeErr);
        await supabase
          .from("payouts")
          .update({ status: "failed" })
          .eq("id", payout.id);
      }
    }

    return new Response(JSON.stringify({ processed: results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (err) {
    console.error("Global error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
