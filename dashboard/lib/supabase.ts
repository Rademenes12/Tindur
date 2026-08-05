import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Klient dla komponentów Client-side
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Uwaga: W Next.js 15 używamy dedykowanych metod 
 * dla Server Components (createServerComponentClient)
 * z biblioteki @supabase/auth-helpers-nextjs
 */