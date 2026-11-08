import os


class Settings:
    """Application configuration sourced from environment variables.

    Defaults are tuned for local development so the demo runs without any
    mandatory configuration. Persistence uses SQLite by default, but the
    DATABASE_URL can point at PostgreSQL without code changes.
    """

    def __init__(self) -> None:
        self.database_url = os.getenv("DATABASE_URL", "sqlite:///./duolink.db")
        self.frontend_base_url = os.getenv(
            "FRONTEND_BASE_URL", "http://localhost:3000"
        ).rstrip("/")
        self.cors_origins = [
            origin.strip()
            for origin in os.getenv(
                "CORS_ORIGINS",
                "http://localhost:3000,http://127.0.0.1:3000",
            ).split(",")
            if origin.strip()
        ]


settings = Settings()
