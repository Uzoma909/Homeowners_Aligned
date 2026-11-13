import { createBrowserClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cookie-aware browser client. Only the admin dashboard (/command) uses this,
 * because it needs the signed-in admin's session.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

let publicClient: ReturnType<typeof createSupabaseClient> | null = null;

/**
 * Anonymous, read-only browser client for public pages (search typeahead).
 * It never reads or writes a session, so it sets no cookies and stores nothing
 * in the visitor's browser. What it can read is decided by row-level security.
 */
export function createPublicClient() {
  if (!publicClient) {
    publicClient = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    );
  }
  return publicClient;
}
