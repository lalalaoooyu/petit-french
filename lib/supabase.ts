"use client";

import { createClient } from "@supabase/supabase-js";

// the publishable key is meant to ship to the browser; row level security guards the data.
// implicit flow so an email link still works when opened in a different browser than the one
// that requested it (PKCE keeps its verifier in the requesting browser only)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  { auth: { flowType: "implicit", detectSessionInUrl: true, persistSession: true } },
);
