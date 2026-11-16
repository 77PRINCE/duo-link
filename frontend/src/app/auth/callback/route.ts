import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * OAuth callback: exchanges the provider code for a Supabase session,
 * sets auth cookies, and redirects to the app.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    // Exchange the one-time OAuth code for a persisted session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth failed or code missing — return to sign-in with error
  return NextResponse.redirect(`${origin}/?error=auth_callback_failed`);
}
