import logging
import os
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit

try:
    from dotenv import load_dotenv
except ImportError:  # pragma: no cover - dependency is declared in requirements
    load_dotenv = None

if load_dotenv is not None:
    # backend/.env (config.py lives at backend/app/core/config.py)
    load_dotenv(Path(__file__).resolve().parents[2] / ".env")

logger = logging.getLogger(__name__)

_DEPLOYMENT_ENV_VARS = (
    "RENDER",
    "RAILWAY_ENVIRONMENT",
    "FLY_APP_NAME",
    "VERCEL",
)


def _env_int(name: str, default: int, minimum: int = 0) -> int:
    raw = os.getenv(name)
    if raw is None or not raw.strip():
        return default
    try:
        value = int(raw)
    except ValueError:
        logger.warning("Invalid %s=%r; using %s", name, raw, default)
        return default
    if value < minimum:
        logger.warning("%s=%s is below %s; using %s", name, value, minimum, default)
        return default
    return value


def _env_list(name: str, default: str) -> list[str]:
    raw = os.getenv(name, default)
    return list(
        dict.fromkeys(
            origin.strip().rstrip("/")
            for origin in raw.split(",")
            if origin.strip()
        )
    )


class Settings:
    """Application configuration sourced from environment variables.

    Defaults are tuned for local development so the demo runs without any
    mandatory configuration. Persistence uses SQLite by default, but the
    DATABASE_URL can point at PostgreSQL (including Supabase) without code
    changes. Authentication is only enabled when Supabase values are present.
    """

    def __init__(self) -> None:
        environment = os.getenv("ENVIRONMENT", "").strip().lower()
        if not environment:
            deployed = any(os.getenv(name) for name in _DEPLOYMENT_ENV_VARS)
            environment = "production" if deployed else "development"
        self.environment = environment
        self.is_production = environment == "production"

        self.log_level = os.getenv("LOG_LEVEL", "INFO").strip().upper()

        self.database_url = os.getenv("DATABASE_URL", "sqlite:///./duolink.db")
        self.db_pool_size = _env_int("DB_POOL_SIZE", 5, minimum=1)
        self.db_max_overflow = _env_int("DB_MAX_OVERFLOW", 5, minimum=0)
        self.db_pool_timeout = _env_int("DB_POOL_TIMEOUT", 30, minimum=1)
        self.db_pool_recycle = _env_int("DB_POOL_RECYCLE", 300, minimum=1)

        self.frontend_base_url = os.getenv(
            "FRONTEND_BASE_URL", "http://localhost:3000"
        ).rstrip("/")
        self.cors_origins = _env_list(
            "CORS_ORIGINS",
            "http://localhost:3000,http://127.0.0.1:3000",
        )
        self.cors_origin_regex = (
            os.getenv("CORS_ORIGIN_REGEX", "").strip() or None
        )
        self.cors_allow_credentials = "*" not in self.cors_origins
        self.allowed_hosts = _env_list("ALLOWED_HOSTS", "")

        self.supabase_url = os.getenv("SUPABASE_URL", "").rstrip("/")
        self.supabase_anon_key = os.getenv("SUPABASE_ANON_KEY", "")
        # Reserved for future admin-only operations. Never expose to clients.
        self.supabase_service_role_key = os.getenv(
            "SUPABASE_SERVICE_ROLE_KEY", ""
        )
        self.supabase_timeout_seconds = _env_int(
            "SUPABASE_TIMEOUT_SECONDS", 10, minimum=1
        )
        self.auth_cache_ttl_seconds = _env_int(
            "AUTH_CACHE_TTL_SECONDS", 30, minimum=0
        )

    @property
    def auth_configured(self) -> bool:
        return bool(self.supabase_url and self.supabase_anon_key)

    @property
    def safe_database_url(self) -> str:
        """Database URL with the password masked, safe for logs."""

        try:
            parts = urlsplit(self.database_url)
        except ValueError:
            return "<configured database>"
        if not parts.netloc or "@" not in parts.netloc:
            return self.database_url
        userinfo, host = parts.netloc.rsplit("@", 1)
        user = userinfo.split(":", 1)[0]
        return urlunsplit(parts._replace(netloc=f"{user}:***@{host}"))

    def validate(self) -> list[str]:
        """Fail fast on unsafe production settings, return non-fatal warnings."""

        warnings: list[str] = []
        if not self.is_production:
            return warnings

        if self.database_url.startswith("sqlite"):
            raise RuntimeError(
                "DATABASE_URL must point to PostgreSQL in production. "
                "SQLite files do not persist on most hosting platforms."
            )

        if not self.auth_configured:
            warnings.append(
                "SUPABASE_URL/SUPABASE_ANON_KEY are not set; "
                "authenticated features will return 503."
            )
        if (
            "localhost" in self.frontend_base_url
            or "127.0.0.1" in self.frontend_base_url
        ):
            warnings.append(
                "FRONTEND_BASE_URL still points to localhost; "
                "generated smart URLs will be wrong."
            )
        if any(
            "localhost" in origin or "127.0.0.1" in origin
            for origin in self.cors_origins
        ):
            warnings.append(
                "CORS_ORIGINS contains a localhost origin; "
                "add your deployed frontend URL."
            )
        if "*" in self.cors_origins:
            warnings.append(
                "CORS_ORIGINS contains '*'; credentialed CORS is disabled."
            )
        return warnings


settings = Settings()
