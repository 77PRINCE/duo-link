# Minimal Supabase OAuth Sign-In (Next.js)

A minimalist, premium sign-in page built with Next.js App Router, TypeScript, and Tailwind CSS. Users sign in via **Google** or **GitHub** OAuth only (no email/password), powered by Supabase Auth with `@supabase/ssr`.

## Project structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Landing / sign-in page
│   │   ├── globals.css
│   │   ├── auth/callback/route.ts  # OAuth code -> session exchange
│   │   └── dashboard/page.tsx      # Post-login (proves auth)
│   ├── components/
│   │   ├── AuthCard.tsx            # "use client" — OAuth buttons
│   │   ├── AnimatedBackground.tsx  # "use client" — floating ambient icons
│   │   └── SignOutButton.tsx       # "use client" — sign out
│   ├── lib/supabase/
│   │   ├── client.ts               # Browser client (createBrowserClient)
│   │   ├── server.ts               # Server client (createServerClient + cookies)
│   │   └── middleware.ts           # Session refresh helper
│   └── middleware.ts               # Runs session refresh on every request
├── .env.local.example
└── README.md
```

## External setup (required)

Complete these steps outside the codebase before the OAuth flow will work.

### A. Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/) and create/select a project.
2. **APIs & Services → OAuth consent screen**: configure the app (User type, app name, support email). Add scopes: `openid`, `email`, `profile`.
3. **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID** (Application type: **Web application**).
4. Add **Authorized redirect URI**:
   ```
   https://<your-supabase-project-ref>.supabase.co/auth/v1/callback
   ```
5. Copy the **Client ID** and **Client Secret**.

### B. GitHub Developer Settings

1. Go to **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Set **Authorization callback URL** (Supabase is the OAuth broker):
   ```
   https://<your-supabase-project-ref>.supabase.co/auth/v1/callback
   ```
3. Copy the **Client ID** and generate/copy a **Client Secret**.

### C. Supabase Dashboard

1. **Authentication → Providers**: enable **Google** and **GitHub**, paste the respective Client ID/Secret from above.
2. **Authentication → URL Configuration**:
   - **Site URL**: `http://localhost:3000` (dev) or your production domain.
   - **Redirect URLs** (allow list): add
     - `http://localhost:3000/auth/callback`
     - `https://your-domain.com/auth/callback` (production)
3. **Project Settings → API**: copy **Project URL** and **anon public** key into `.env.local`.

### D. Local run & GitHub push

```bash
cp .env.local.example .env.local   # fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Then initialize/push to GitHub:

```bash
git init
git add .
git commit -m "feat: minimal supabase oauth sign-in"
git remote add origin <your-repo-url>
git push -u origin main
```

`.env.local` is ignored by git (see `.gitignore`); never commit secrets.

### E. Important clarification (common misconfiguration)

> **The redirect URI registered in Google and GitHub consoles is the Supabase callback:**
> `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`
> **— not your app URL.**
>
> Your app’s `/auth/callback` route only needs to be listed in **Supabase → Authentication → URL Configuration → Redirect URLs**. Registering your app URL directly in Google/GitHub (instead of Supabase’s callback) is the #1 cause of broken OAuth.

## Design notes

- **Fitts's Law:** two dominant, full-width 48px+ buttons centered in the viewport with clear hover/active/focus states (WCAG AA contrast).
- **Hick's Law:** exactly two choices, no extra nav/links/fields.
- **Gestalt (proximity & common region):** buttons grouped inside a single glassmorphism card with tight spacing, separated from brand/background by whitespace.
- **Motion:** transform/opacity-only floating ambient symbols with randomized duration/delay, `prefers-reduced-motion` respected.

## Auth flow

1. User clicks provider in `AuthCard` → `supabase.auth.signInWithOAuth({ provider, options: { redirectTo: \`${origin}/auth/callback\` } })`.
2. Provider authenticates → Supabase redirects to `/auth/callback?code=...`.
3. Route handler exchanges code via `supabase.auth.exchangeCodeForSession(code)` and redirects to `/dashboard`.
4. `middleware.ts` refreshes the session cookie on each request to keep users signed in.
