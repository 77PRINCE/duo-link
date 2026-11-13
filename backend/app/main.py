import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse

from app.api.routes import auth, health, links
from app.core.config import settings
from app.db.database import init_db
from app.services.supabase_auth import close_auth_service

logging.basicConfig(
    level=getattr(logging, settings.log_level, logging.INFO),
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_: FastAPI):
    for warning in settings.validate():
        logger.warning("Configuration: %s", warning)
    logger.info(
        "Starting Duo Link API (env=%s, database=%s, auth=%s)",
        settings.environment,
        settings.safe_database_url,
        "configured" if settings.auth_configured else "disabled",
    )
    init_db()
    try:
        yield
    finally:
        close_auth_service()


app = FastAPI(
    title="Duo Link API",
    description="Smart link-routing platform API",
    version="0.1.0",
    lifespan=lifespan,
)

if settings.allowed_hosts:
    app.add_middleware(
        TrustedHostMiddleware, allowed_hosts=settings.allowed_hosts
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=settings.cors_origin_regex,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "no-referrer")
    response.headers.setdefault(
        "Permissions-Policy", "camera=(), microphone=(), geolocation=()"
    )
    if settings.is_production:
        response.headers.setdefault(
            "Strict-Transport-Security",
            "max-age=31536000; includeSubDomains",
        )
    if request.url.path.startswith("/api/"):
        response.headers.setdefault("Cache-Control", "no-store")
    return response


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception(
        "Unhandled exception for %s %s", request.method, request.url.path
    )
    return JSONResponse(
        status_code=500, content={"detail": "Internal server error."}
    )


app.include_router(health.router)
app.include_router(auth.router, prefix="/api/v1")
app.include_router(links.router, prefix="/api/v1")


@app.get("/")
def home() -> dict[str, str]:
    return {"message": "Welcome to Duo Link API", "status": "running"}
