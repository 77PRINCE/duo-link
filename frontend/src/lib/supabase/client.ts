import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client for Client Components.
 * Uses the public anon key; safe to run in the browser.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Set them in your hosting environment variables and redeploy."
    );
  }

  return createBrowserClient(url, key);
}
