# Duo Link

**One link. The right destination.**

Duo Link is a smart link-routing platform for mobile app distribution. A
developer supplies an Android (Google Play) URL and an iOS (App Store) URL,
then shares a single smart URL. Visitors see a branded intermediate download
page tailored to their operating system.

## Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Python, FastAPI, Uvicorn, SQLAlchemy
- **Database:** SQLite locally; Supabase PostgreSQL when configured
- **Authentication:** Supabase Auth, mediated by FastAPI (tokens never expose
  server secrets to the browser)

## Project structure

```
duo-link/
├── backend/
│   ├── app/
│   │   ├── api/routes/      # HTTP routes (links, health)
│   │   ├── core/            # settings
│   │   ├── db/              # SQLAlchemy engine, models
│   │   ├── schemas/         # Pydantic request/response models
│   │   ├── services/        # business logic + platform detection
│   │   └── main.py
│   ├── tests/
│   ├── requirements.txt
│   └── requirements-dev.txt
├── frontend/
│   └── src/
│       ├── app/             # routes (/, /dashboard, /login, /register, /r/[slug])
│       ├── components/
│       └── lib/api.ts       # API client
└── instructions.md
```

## Running locally

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
uvicorn app.main:app --reload
```

API runs at `http://127.0.0.1:8000` (docs at `/docs`). The backend loads
`backend/.env` automatically; copy `.env.example` to `.env` and fill in the
Supabase values below to enable auth and Postgres.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local   # optional; defaults already target 127.0.0.1:8000
npm run dev
```

App runs at `http://localhost:3000`.

## Connecting Supabase (Postgres + Auth)

All secrets live in **server-side env files** that are gitignored. The frontend
never receives a Supabase key.

### Where to put values

**`backend/.env`** (create it from `backend/.env.example`):

```dotenv
DATABASE_URL=postgresql://postgres.<project-ref>:<password>@<region>.pooler.supabase.com:5432/postgres?sslmode=require
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_ANON_KEY=<anon-public-key>
FRONTEND_BASE_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

- Use the **Session pooler** connection string from
  *Supabase → Project Settings → Database → Connection string*. Direct
  connections are IPv6-only by default and often fail locally.
- If you see `Network is unreachable` for `db.<ref>.supabase.co`, your network
  has no IPv6 route. The session pooler host is IPv4-compatible; use it.
- `SUPABASE_SERVICE_ROLE_KEY` is optional and reserved for future admin tasks.
  Do not add it unless needed, and never expose it to the frontend.

**`frontend/.env.local`** (only the API URL; no Supabase keys):

```dotenv
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

### Supabase dashboard

1. **Authentication → Providers → Email**: enable it.
2. For instant local sign-in, disable **Confirm email**. If you keep it on, the
   app shows a "check your email" message after registration.
3. Run this once in the **SQL Editor** to keep the table private from the public
   anon key (the backend connects as the DB owner and is unaffected):

```sql
alter table public.links enable row level security;
```

The backend also attempts this automatically on startup.

### How auth works

1. The frontend posts credentials to FastAPI (`/api/v1/auth/*`).
2. FastAPI calls Supabase Auth using the anon key and returns the session.
3. The frontend sends `Authorization: Bearer <access_token>` to protected APIs.
4. FastAPI validates the token against Supabase on every protected request.
5. Links are scoped to the authenticated Supabase user id.

## API

Protected routes require `Authorization: Bearer <access_token>`.

| Method | Path                            | Auth | Purpose                     |
| ------ | ------------------------------- | ---- | --------------------------- |
| GET    | `/health`                       | No   | Liveness check              |
| GET    | `/health/ready`                 | No   | Readiness check (database)  |
| POST   | `/api/v1/auth/register`         | No   | Create account              |
| POST   | `/api/v1/auth/login`            | No   | Sign in                     |
| POST   | `/api/v1/auth/refresh`          | No   | Refresh session             |
| POST   | `/api/v1/auth/logout`           | Yes  | Revoke session              |
| GET    | `/api/v1/auth/me`               | Yes  | Current user                |
| POST   | `/api/v1/links`                 | Yes  | Create a smart link         |
| GET    | `/api/v1/links`                 | Yes  | List your links             |
| GET    | `/api/v1/links/{id}`            | Yes  | Retrieve one link           |
| PATCH  | `/api/v1/links/{id}`            | Yes  | Update a link               |
| DELETE | `/api/v1/links/{id}`            | Yes  | Delete a link               |
| GET    | `/api/v1/links/resolve/{slug}`  | No   | Resolve a public link       |

The resolve endpoint reads the visitor's `User-Agent` and returns the detected
platform (`android`, `ios`, or `other`) with the matching `target_url`.

## Deploying the backend

The backend ships with a Dockerfile and a Render blueprint (`render.yaml`).

### Render

1. Push the repo to GitHub.
2. Create a new **Blueprint** on Render and point it at this repo. Render reads
   `render.yaml`, builds `backend/Dockerfile`, and runs the API.
3. Set the secret env vars when prompted:
   - `DATABASE_URL` — Supabase **session pooler** URL with `?sslmode=require`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `FRONTEND_BASE_URL` — your Vercel URL, e.g. `https://duo-link.vercel.app`
   - `CORS_ORIGINS` — the same Vercel origin
4. After deploy, set the frontend's `NEXT_PUBLIC_API_BASE_URL` and
   `API_BASE_URL` to the Render service URL.

### Docker / Railway / Fly.io

```bash
cd backend
docker build -t duo-link-api .
docker run --env-file .env -p 8000:8000 duo-link-api
```

`PORT` and `WEB_CONCURRENCY` are respected if your platform sets them.

In production (`ENVIRONMENT=production`) the app refuses to start with SQLite,
so always set `DATABASE_URL` to PostgreSQL. Use `/health` for liveness and
`/health/ready` for a database-aware readiness probe.

## Testing

```bash
cd backend
source .venv/bin/activate
python -m pytest
```

```bash
cd frontend
npm run lint
npm run build
```

## Notes

- Authentication is real Supabase Auth, brokered by FastAPI.
- Sessions are kept in browser storage and refreshed automatically. For a
  production deployment, move tokens to httpOnly cookies served over HTTPS.
- Platform detection uses the User-Agent. It does not detect installed apps and
  does not perform automatic app opening (Universal Links / App Links are out of
  scope for the MVP).
- SQLite is used for zero-config local persistence. Setting `DATABASE_URL` to a
  Supabase/PostgreSQL URL switches the database without code changes.
- Keep `.env` and `.env.local` out of Git. Rotate the database password and keys
  immediately if they are ever exposed.
