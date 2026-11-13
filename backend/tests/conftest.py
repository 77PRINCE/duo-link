import os
import tempfile
from pathlib import Path

_temp_dir = tempfile.TemporaryDirectory()
os.environ["ENVIRONMENT"] = "test"
os.environ["DATABASE_URL"] = f"sqlite:///{Path(_temp_dir.name) / 'test.db'}"
os.environ["FRONTEND_BASE_URL"] = "http://localhost:3000"
# Keep tests hermetic: non-empty env vars prevent backend/.env from enabling
# Supabase during the test run.
os.environ["SUPABASE_URL"] = ""
os.environ["SUPABASE_ANON_KEY"] = ""

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from app.api.deps import get_current_user  # noqa: E402
from app.db.database import Base, engine  # noqa: E402
from app.main import app  # noqa: E402
from app.schemas.auth import AuthUser  # noqa: E402

DEFAULT_USER = AuthUser(id="test-user", email="test@example.com")


@pytest.fixture()
def auth_user():
    return {"current": DEFAULT_USER}


@pytest.fixture()
def client(auth_user):
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    app.dependency_overrides[get_current_user] = lambda: auth_user["current"]
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture()
def anon_client():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    app.dependency_overrides.pop(get_current_user, None)
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture()
def link_payload():
    return {
        "app_name": "Example App",
        "android_url": "https://play.google.com/store/apps/details?id=com.example",
        "ios_url": "https://apps.apple.com/app/example/id123456789",
        "slug": "example-app",
    }
