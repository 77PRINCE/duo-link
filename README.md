# Duo Link

**One link. The right destination.**

Duo Link is a smart link-routing platform for mobile app distribution. A
developer supplies an Android (Google Play) URL and an iOS (App Store) URL,
then shares a single smart URL. Visitors see a branded intermediate download
page tailored to their operating system.

## Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Python, FastAPI, Uvicorn, SQLAlchemy
- **Database:** SQLite locally (set `DATABASE_URL` to a PostgreSQL URL later)

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

API runs at `http://127.0.0.1:8000` (docs at `/docs`). Copy `.env.example` to
`.env` only if you need to override defaults.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local   # optional; defaults already target 127.0.0.1:8000
npm run dev
```

App runs at `http://localhost:3000`.

## API

| Method | Path                            | Purpose                     |
| ------ | ------------------------------- | --------------------------- |
| GET    | `/health`                       | Health check                |
| POST   | `/api/v1/links`                 | Create a smart link         |
| GET    | `/api/v1/links`                 | List links                  |
| GET    | `/api/v1/links/{id}`            | Retrieve one link           |
| PATCH  | `/api/v1/links/{id}`            | Update a link               |
| DELETE | `/api/v1/links/{id}`            | Delete a link               |
| GET    | `/api/v1/links/resolve/{slug}`  | Resolve a public link       |

The resolve endpoint reads the visitor's `User-Agent` and returns the detected
platform (`android`, `ios`, or `other`) with the matching `target_url`.

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

- This is a local MVP demo. Authentication is an interface demonstration only.
- Platform detection uses the User-Agent. It does not detect installed apps and
  does not perform automatic app opening (Universal Links / App Links are out of
  scope for the MVP).
- SQLite is used for zero-config local persistence. Because data access goes
  through SQLAlchemy, switching to PostgreSQL only requires changing
  `DATABASE_URL`.
