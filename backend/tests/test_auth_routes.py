import pytest
from fastapi.testclient import TestClient

from app.db.database import Base, engine
from app.main import app
from app.schemas.auth import AuthSession, AuthUser
from app.services.supabase_auth import AuthServiceError


def build_session() -> AuthSession:
    return AuthSession(
        access_token="access-token",
        refresh_token="refresh-token",
        token_type="bearer",
        expires_in=3600,
        expires_at=9999999999,
        user=AuthUser(id="user-1", email="user@example.com"),
    )


class FakeAuthService:
    configured = True

    def sign_up(self, email: str, password: str, name: str | None = None):
        return build_session()

    def login(self, email: str, password: str):
        if password == "wrong-password":
            raise AuthServiceError("Invalid email or password.", 401)
        return build_session()

    def refresh(self, refresh_token: str):
        return build_session()

    def logout(self, access_token: str) -> None:
        return None

    def get_user(self, access_token: str) -> AuthUser:
        return AuthUser(id="user-1", email="user@example.com")


class UnavailableAuthService(FakeAuthService):
    def get_user(self, access_token: str) -> AuthUser:
        raise AuthServiceError("Authentication service is unavailable.", 503)


@pytest.fixture()
def auth_client(monkeypatch):
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    app.dependency_overrides.clear()
    monkeypatch.setattr(
        "app.api.routes.auth.get_auth_service", lambda: FakeAuthService()
    )
    monkeypatch.setattr(
        "app.api.deps.get_auth_service", lambda: FakeAuthService()
    )
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def test_register_returns_session(auth_client):
    response = auth_client.post(
        "/api/v1/auth/register",
        json={"email": "user@example.com", "password": "password123"},
    )
    assert response.status_code == 201
    body = response.json()
    assert body["needs_confirmation"] is False
    assert body["session"]["access_token"] == "access-token"


def test_login_returns_session(auth_client):
    response = auth_client.post(
        "/api/v1/auth/login",
        json={"email": "user@example.com", "password": "password123"},
    )
    assert response.status_code == 200
    assert response.json()["user"]["id"] == "user-1"


def test_login_invalid_credentials_returns_401(auth_client):
    response = auth_client.post(
        "/api/v1/auth/login",
        json={"email": "user@example.com", "password": "wrong-password"},
    )
    assert response.status_code == 401


def test_protected_route_accepts_valid_bearer_token(auth_client):
    response = auth_client.get(
        "/api/v1/links", headers={"Authorization": "Bearer access-token"}
    )
    assert response.status_code == 200
    assert response.json() == []


def test_protected_route_rejects_missing_token(auth_client):
    assert auth_client.get("/api/v1/links").status_code == 401


def test_protected_route_reports_upstream_outage(auth_client, monkeypatch):
    monkeypatch.setattr(
        "app.api.deps.get_auth_service", lambda: UnavailableAuthService()
    )

    response = auth_client.get(
        "/api/v1/links", headers={"Authorization": "Bearer access-token"}
    )

    assert response.status_code == 503
