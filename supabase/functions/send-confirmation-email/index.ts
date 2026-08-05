import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// --- TYPES ---
type EmailType = 'confirmation' | 'eminder' | 'cancellation';

interface EmailPayload {
  booking_id: string;
  type: EmailType;
}

interface TemplateData {
  title: string;
  date?: string;
  time?: string;
  participants?: number;
  total?: number;
  guide_name?: string;
  refund_amount?: number;
}

// --- CONSTANTS & TEMPLATES ---
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const EMAIL_FROM = "onboarding@resend.dev"; // Zmień na swój zweryfikowany domain w Resend

const TEMPLATES: Record<EmailType, (data: TemplateData) => string> = {
  confirmation: ({ title, date, time, participants, total }) => 
    `Twoja rezerwacja jest potwierdzona! ${title} - ${date} ${time} - ${participants} osob - ${total} ISK`,
  
  reminder: ({ title, time, guide_name }) => 
    `Przypomnienie: ${title} jutro o ${time}. ${guide_name} bedzie Twoim przewodnikiem.`,
  
  cancellation: ({ title, date, refund_amount }) => 
    `Twoja rezerwacja ${title} - ${date} zostala anulowana. Refund: ${refund_amount} ISK.`
};

// --- CORS HEADERS ---
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-requested-with, content-type, accept, origin, x-supabase-user-role, x-supabase-client-metadata, x-supabase-cache-context',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Parse Body
    const { booking_id, type }: EmailPayload = await req.json();

    if (!booking_id ||!type) {
      throw new Error("Missing booking_id or type");
    }

    // 2. Initialize Supabase Client (Service Role to bypass RLS for audit log/joins)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')?? ''
    );

    // 3. Query Data (Joins)
    // Zakładamy strukturę: bookings -> experiences -> schedules & bookings -> customers
    const { data: booking, error: fetchError } = await supabase
      from('bookings')
      select(`
        id,
        total_amount,
        refund_amount,
        status,
        customers (email, full_name),
        experiences (title),
        schedules (start_time, guide_id),
        guides (full_name)
      )
      eq('id', booking_id)
      single();

    if (fetchError ||!booking) {
      throw new Error(`Booking not found: ${fetchError?.message}`);
    }

    const customerEmail = booking.customers?.email;
    const customerName = booking.customers?.full_name;
    const experienceTitle = booking.experiences?.title;
    const guideName = booking.guides?.full_name;
    
    // Formatowanie daty (uproszczone)
    const dateStr = booking.schedules?.start_time 
       new Date(booking.schedules.start_time).toLocaleDateString('pl-PL') 
      : '';
    const timeStr = booking.schedules?.start_time 
       new Date(booking.schedules.start_time).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }) 
      : '';

    // 4. Prepare Template Data
    const templateData: TemplateData = {
      title: experienceTitle || 'Rezerwacja',
      date: dateStr,
      time: timeStr,
      participants: booking.participants || 0, // zakłada kolumnę w bookings
      total: booking.total_amount,
      guide_name: guideName,
      refund_amount: booking.refund_amount
    };

    const emailContent = TEMPLATES[type](templateData);

    // 5. Send Email via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: customerEmail,
        subject: `Informacja o rezerwacji: ${type}`,
        text: emailContent,
      }),
    });

    if (!resendResponse.ok) {
      const resendErr = await resendResponse.json();
      throw new Error(`Resend error: ${JSON.stringify(resendErr)}`);
    }

    // 6. Log to audit_log
    await supabase.from('audit_log').insert({
      event_type: `email_${type}`,
      entity_id: booking_id,
      metadata: { 
        to: customerEmail, 
        content_preview: emailContent.substring(0, 50) 
      },
      created_at: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({ message: `Email ${type} sent successfully to ${customerEmail}` }),
      { headers: {...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error(`Error: ${error.message}`);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: {...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
