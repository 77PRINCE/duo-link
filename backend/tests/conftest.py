import os
import tempfile
from pathlib import Path

_temp_dir = tempfile.TemporaryDirectory()
os.environ["DATABASE_URL"] = f"sqlite:///{Path(_temp_dir.name) / 'test.db'}"
os.environ["FRONTEND_BASE_URL"] = "http://localhost:3000"

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from app.db.database import Base, engine  # noqa: E402
from app.main import app  # noqa: E402


@pytest.fixture()
def client():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture()
def link_payload():
    return {
        "app_name": "Example App",
        "android_url": "https://play.google.com/store/apps/details?id=com.example",
        "ios_url": "https://apps.apple.com/app/example/id123456789",
        "slug": "example-app",
    }
