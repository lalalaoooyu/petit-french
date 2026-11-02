"use client";

import { createClient } from "@supabase/supabase-js";

// the publishable key is meant to ship to the browser; row level security guards the data
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  { auth: { flowType: "pkce", detectSessionInUrl: true, persistSession: true } },
);
