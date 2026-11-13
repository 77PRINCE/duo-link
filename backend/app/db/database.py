import logging
from collections.abc import Generator

from sqlalchemy import Connection, create_engine, inspect, text
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import settings

logger = logging.getLogger(__name__)

# Serializes schema setup across multiple workers/instances on PostgreSQL.
_INIT_LOCK_KEY = 7_312_005


def normalize_database_url(url: str) -> str:
    """Ensure PostgreSQL URLs use the psycopg (v3) SQLAlchemy driver."""

    if url.startswith("postgres://"):
        return "postgresql+psycopg://" + url[len("postgres://") :]
    if url.startswith("postgresql://"):
        return "postgresql+psycopg://" + url[len("postgresql://") :]
    return url


DATABASE_URL = normalize_database_url(settings.database_url)
IS_SQLITE = DATABASE_URL.startswith("sqlite")

engine_kwargs: dict[str, object] = {"pool_pre_ping": not IS_SQLITE}
if IS_SQLITE:
    engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    engine_kwargs.update(
        pool_size=settings.db_pool_size,
        max_overflow=settings.db_max_overflow,
        pool_timeout=settings.db_pool_timeout,
        pool_recycle=settings.db_pool_recycle,
    )

engine = create_engine(DATABASE_URL, **engine_kwargs)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _initialize_schema(connection: Connection) -> None:
    from app.db import models  # noqa: F401  (register models before create_all)

    Base.metadata.create_all(bind=connection)

    inspector = inspect(connection)
    if "links" not in inspector.get_table_names():
        return

    columns = {column["name"] for column in inspector.get_columns("links")}
    if "user_id" not in columns:
        connection.execute(text("ALTER TABLE links ADD COLUMN user_id VARCHAR(36)"))
        logger.info("Added user_id column to links table")

    connection.execute(
        text("CREATE INDEX IF NOT EXISTS ix_links_user_id ON links (user_id)")
    )

    if connection.dialect.name == "postgresql":
        # RLS closes the public PostgREST surface. The backend connects as the
        # database owner, which bypasses RLS, so application access is intact.
        try:
            with connection.begin_nested():
                connection.execute(
                    text("ALTER TABLE links ENABLE ROW LEVEL SECURITY")
                )
        except Exception:  # pragma: no cover - depends on DB privileges
            logger.warning(
                "Could not enable RLS on links table", exc_info=True
            )


def init_db() -> None:
    with engine.begin() as connection:
        if connection.dialect.name == "postgresql":
            connection.execute(
                text("SELECT pg_advisory_xact_lock(:key)"),
                {"key": _INIT_LOCK_KEY},
            )
        _initialize_schema(connection)
