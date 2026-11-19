"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Provider = "google" | "github";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.45c-.24 1.25-.95 2.31-2.02 3.02l3.27 2.54c1.9-1.75 3-4.33 3-7.39 0-.71-.06-1.4-.18-2.07H12Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.97-.9 6.63-2.43l-3.27-2.54c-.9.6-2.05.96-3.36.96-2.58 0-4.77-1.74-5.55-4.08H3.07v2.57A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#4A90E2"
        d="M6.45 13.91A6.01 6.01 0 0 1 6.13 12c0-.66.11-1.31.32-1.91V7.52H3.07A10 10 0 0 0 2 12c0 1.61.39 3.14 1.07 4.48l3.38-2.57Z"
      />
      <path
        fill="#FBBC05"
        d="M12 5.98c1.47 0 2.79.51 3.83 1.5l2.87-2.87C16.96 3.03 14.7 2 12 2A10 10 0 0 0 3.07 7.52l3.38 2.57c.78-2.34 2.97-4.11 5.55-4.11Z"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
      <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.31-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.53.12-3.18 0 0 1-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.65 1.65.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.62-2.81 5.63-5.49 5.93.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.58A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin text-current"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z" />
    </svg>
  );
}

export function AuthCard() {
  const [loading, setLoading] = useState<Provider | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const callbackError = searchParams.get("error");

  const handleOAuth = async (provider: Provider) => {
    setLocalError(null);
    setLoading(provider);

    try {
      const supabase = createClient();

      // Initiate Supabase OAuth: Supabase brokers the provider flow and
      // redirects back to our app callback with a one-time code. We handle the
      // navigation ourselves so failures surface instead of spinning forever.
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        throw error;
      }
      if (!data.url) {
        throw new Error("Supabase did not return an OAuth redirect URL.");
      }

      window.location.assign(data.url);
    } catch (error) {
      setLocalError(
        error instanceof Error
          ? error.message
          : "Sign-in could not be started. Please try again.",
      );
      setLoading(null);
    }
  };

  const errorMessage =
    localError ||
    (callbackError ? "Sign-in could not be completed. Please try again." : null);

  return (
    <section
      className="w-full max-w-sm rounded-2xl border border-white/15 bg-slate-950/55 p-5 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-6"
      aria-label="Sign in"
    >
      <div className="mb-5 text-center">
        <h2 className="text-base font-semibold text-white">Create your free account</h2>
        <p className="mt-1 text-sm text-white/65">
          Start sharing one link for both app stores.
        </p>
      </div>

      {/* Hick's Law: exactly two choices. Fitts's Law: large, full-width targets. */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => handleOAuth("google")}
          disabled={loading !== null}
          className="group inline-flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-white/20 bg-white text-sm font-semibold text-gray-900 transition hover:shadow-[0_0_0_3px_rgba(255,255,255,0.15),0_8px_30px_rgba(255,255,255,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading === "google" ? <Spinner /> : <GoogleIcon />}
          <span>Continue with Google</span>
        </button>

        <button
          type="button"
          onClick={() => handleOAuth("github")}
          disabled={loading !== null}
          className="group inline-flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-white/20 bg-[#171515] text-sm font-semibold text-white transition hover:shadow-[0_0_0_3px_rgba(255,255,255,0.12),0_8px_30px_rgba(0,0,0,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading === "github" ? <Spinner /> : <GitHubIcon />}
          <span>Continue with GitHub</span>
        </button>
      </div>

      {errorMessage && (
        <p role="alert" className="mt-4 text-center text-sm text-red-300">
          {errorMessage}
        </p>
      )}
    </section>
  );
}
