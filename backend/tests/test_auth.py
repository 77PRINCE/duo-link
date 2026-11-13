import httpx
import pytest

from app.services.supabase_auth import AuthServiceError, SupabaseAuthService

TOKEN_PAYLOAD = {
    "access_token": "access-token",
    "refresh_token": "refresh-token",
    "token_type": "bearer",
    "expires_in": 3600,
    "user": {"id": "user-1", "email": "user@example.com"},
}


def make_service(handler) -> SupabaseAuthService:
    client = httpx.Client(transport=httpx.MockTransport(handler))
    return SupabaseAuthService("https://demo.supabase.co", "anon-key", client=client)


def test_login_returns_session():
    def handler(request: httpx.Request) -> httpx.Response:
        assert request.url.path == "/auth/v1/token"
        assert request.url.params["grant_type"] == "password"
        assert request.headers["apikey"] == "anon-key"
        return httpx.Response(200, json=TOKEN_PAYLOAD)

    session = make_service(handler).login("user@example.com", "password123")

    assert session.access_token == "access-token"
    assert session.refresh_token == "refresh-token"
    assert session.expires_in == 3600
    assert session.user.id == "user-1"


def test_login_invalid_credentials_maps_to_401():
    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(
            400,
            json={
                "error": "invalid_grant",
                "error_description": "Invalid login credentials",
            },
        )

    with pytest.raises(AuthServiceError) as exc:
        make_service(handler).login("user@example.com", "wrong-password")

    assert exc.value.status_code == 401


def test_sign_up_without_session_requires_confirmation():
    def handler(request: httpx.Request) -> httpx.Response:
        assert request.url.path == "/auth/v1/signup"
        return httpx.Response(
            200, json={"id": "user-1", "email": "user@example.com"}
        )

    assert make_service(handler).sign_up("user@example.com", "password123") is None


def test_sign_up_with_session_returns_tokens():
    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(200, json=TOKEN_PAYLOAD)

    session = make_service(handler).sign_up(
        "user@example.com", "password123", name="Ada"
    )

    assert session is not None
    assert session.access_token == "access-token"


def test_refresh_returns_new_session():
    def handler(request: httpx.Request) -> httpx.Response:
        assert request.url.params["grant_type"] == "refresh_token"
        return httpx.Response(200, json=TOKEN_PAYLOAD)

    session = make_service(handler).refresh("refresh-token")

    assert session.refresh_token == "refresh-token"


def test_get_user_sends_bearer_token():
    def handler(request: httpx.Request) -> httpx.Response:
        assert request.url.path == "/auth/v1/user"
        assert request.headers["Authorization"] == "Bearer access-token"
        return httpx.Response(
            200, json={"id": "user-1", "email": "user@example.com"}
        )

    user = make_service(handler).get_user("access-token")

    assert user.id == "user-1"
    assert user.email == "user@example.com"


def test_get_user_caches_repeated_tokens():
    calls = 0

    def handler(request: httpx.Request) -> httpx.Response:
        nonlocal calls
        calls += 1
        return httpx.Response(
            200, json={"id": "user-1", "email": "user@example.com"}
        )

    service = make_service(handler)

    assert service.get_user("access-token").id == "user-1"
    assert service.get_user("access-token").id == "user-1"
    assert calls == 1


def test_logout_invalidates_cached_user():
    calls = 0

    def handler(request: httpx.Request) -> httpx.Response:
        nonlocal calls
        calls += 1
        return httpx.Response(
            200, json={"id": "user-1", "email": "user@example.com"}
        )

    service = make_service(handler)

    service.get_user("access-token")
    service.logout("access-token")
    service.get_user("access-token")

    assert calls == 3


def test_get_user_invalid_token_maps_to_401():
    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(401, json={"msg": "invalid token"})

    with pytest.raises(AuthServiceError) as exc:
        make_service(handler).get_user("bad-token")

    assert exc.value.status_code == 401


def test_unreachable_service_maps_to_503():
    def handler(request: httpx.Request) -> httpx.Response:
        raise httpx.ConnectError("boom", request=request)

    with pytest.raises(AuthServiceError) as exc:
        make_service(handler).login("user@example.com", "password123")

    assert exc.value.status_code == 503
