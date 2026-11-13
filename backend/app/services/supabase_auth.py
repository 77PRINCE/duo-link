import threading
import time
from functools import lru_cache
from typing import Any

import httpx

from app.core.config import settings
from app.schemas.auth import AuthSession, AuthUser


class AuthServiceError(Exception):
    """Raised when Supabase Auth rejects a request."""

    def __init__(self, message: str, status_code: int = 400) -> None:
        super().__init__(message)
        self.message = message
        self.status_code = status_code


def _error_message(response: httpx.Response) -> str:
    try:
        data = response.json()
    except ValueError:
        return "Authentication request failed."

    if isinstance(data, dict):
        for key in ("msg", "message", "error_description", "error"):
            value = data.get(key)
            if isinstance(value, str) and value:
                return value
    return "Authentication request failed."


class SupabaseAuthService:
    """Thin server-side wrapper around the Supabase Auth (GoTrue) REST API.

    Only the public anon key is used. Access tokens are validated against
    Supabase, and successful validations are cached briefly to avoid an extra
    network round-trip on every protected request.
    """

    def __init__(
        self,
        base_url: str,
        api_key: str,
        client: httpx.Client | None = None,
        cache_ttl_seconds: int | None = None,
    ) -> None:
        self._base_url = base_url.rstrip("/")
        self.base_url = f"{self._base_url}/auth/v1"
        self.api_key = api_key
        self._owns_client = client is None
        self._client = client or httpx.Client(
            timeout=httpx.Timeout(settings.supabase_timeout_seconds),
            limits=httpx.Limits(max_connections=20, max_keepalive_connections=10),
        )
        self._cache_ttl = (
            settings.auth_cache_ttl_seconds
            if cache_ttl_seconds is None
            else cache_ttl_seconds
        )
        self._user_cache: dict[str, tuple[float, AuthUser]] = {}
        self._cache_lock = threading.Lock()

    @property
    def configured(self) -> bool:
        return bool(self._base_url and self.api_key)

    def close(self) -> None:
        if self._owns_client:
            self._client.close()

    def _request(
        self,
        method: str,
        path: str,
        *,
        json: dict[str, Any] | None = None,
        params: dict[str, str] | None = None,
        token: str | None = None,
    ) -> httpx.Response:
        headers = {"apikey": self.api_key, "Content-Type": "application/json"}
        if token:
            headers["Authorization"] = f"Bearer {token}"

        try:
            return self._client.request(
                method,
                f"{self.base_url}{path}",
                headers=headers,
                json=json,
                params=params,
            )
        except httpx.HTTPError as exc:
            raise AuthServiceError(
                "Could not reach the authentication service.", 503
            ) from exc

    def _cache_user(self, access_token: str, user: AuthUser) -> None:
        if self._cache_ttl <= 0:
            return
        with self._cache_lock:
            if len(self._user_cache) > 2048:
                self._user_cache.clear()
            self._user_cache[access_token] = (
                time.monotonic() + self._cache_ttl,
                user,
            )

    def _cached_user(self, access_token: str) -> AuthUser | None:
        if self._cache_ttl <= 0:
            return None
        now = time.monotonic()
        with self._cache_lock:
            cached = self._user_cache.get(access_token)
            if cached is None:
                return None
            expires_at, user = cached
            if expires_at <= now:
                self._user_cache.pop(access_token, None)
                return None
            return user.model_copy()

    @staticmethod
    def _session_from_payload(data: dict[str, Any]) -> AuthSession | None:
        session_data = data.get("session")
        payload = session_data if isinstance(session_data, dict) else data

        access_token = payload.get("access_token")
        refresh_token = payload.get("refresh_token")
        if not access_token or not refresh_token:
            return None

        user_data = payload.get("user") or data.get("user") or {}
        if not isinstance(user_data, dict) or not user_data.get("id"):
            raise AuthServiceError("Authentication response was incomplete.", 502)

        expires_in = int(payload.get("expires_in") or 3600)
        expires_at = int(payload.get("expires_at") or (time.time() + expires_in))

        return AuthSession(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type=payload.get("token_type") or "bearer",
            expires_in=expires_in,
            expires_at=expires_at,
            user=AuthUser(
                id=str(user_data["id"]),
                email=user_data.get("email"),
            ),
        )

    def sign_up(
        self, email: str, password: str, name: str | None = None
    ) -> AuthSession | None:
        body: dict[str, Any] = {"email": email, "password": password}
        if name:
            body["data"] = {"full_name": name}

        response = self._request("POST", "/signup", json=body)
        if response.status_code >= 400:
            message = _error_message(response)
            lowered = message.lower()
            status_code = 400
            if (
                response.status_code == 409
                or "already registered" in lowered
                or "already exists" in lowered
            ):
                status_code = 409
            raise AuthServiceError(message, status_code)

        data = response.json()
        return self._session_from_payload(data if isinstance(data, dict) else {})

    def login(self, email: str, password: str) -> AuthSession:
        response = self._request(
            "POST",
            "/token",
            params={"grant_type": "password"},
            json={"email": email, "password": password},
        )
        if response.status_code >= 400:
            if response.status_code >= 500:
                raise AuthServiceError(
                    "Authentication service is unavailable.", 503
                )
            raise AuthServiceError("Invalid email or password.", 401)

        data = response.json()
        session = self._session_from_payload(data if isinstance(data, dict) else {})
        if session is None:
            raise AuthServiceError("Authentication response was incomplete.", 502)
        return session

    def refresh(self, refresh_token: str) -> AuthSession:
        response = self._request(
            "POST",
            "/token",
            params={"grant_type": "refresh_token"},
            json={"refresh_token": refresh_token},
        )
        if response.status_code >= 400:
            if response.status_code >= 500:
                raise AuthServiceError(
                    "Authentication service is unavailable.", 503
                )
            raise AuthServiceError(
                "Your session has expired. Please sign in again.", 401
            )

        data = response.json()
        session = self._session_from_payload(data if isinstance(data, dict) else {})
        if session is None:
            raise AuthServiceError("Authentication response was incomplete.", 502)
        return session

    def get_user(self, access_token: str) -> AuthUser:
        cached = self._cached_user(access_token)
        if cached is not None:
            return cached

        response = self._request("GET", "/user", token=access_token)
        if response.status_code >= 400:
            raise AuthServiceError("Invalid or expired session.", 401)

        data = response.json()
        if not isinstance(data, dict) or not data.get("id"):
            raise AuthServiceError("Authentication response was incomplete.", 502)
        user = AuthUser(id=str(data["id"]), email=data.get("email"))
        self._cache_user(access_token, user)
        return user

    def logout(self, access_token: str) -> None:
        with self._cache_lock:
            self._user_cache.pop(access_token, None)
        try:
            self._request("POST", "/logout", token=access_token)
        except AuthServiceError:
            return


@lru_cache(maxsize=1)
def get_auth_service() -> SupabaseAuthService:
    return SupabaseAuthService(
        base_url=settings.supabase_url,
        api_key=settings.supabase_anon_key,
    )


def close_auth_service() -> None:
    if get_auth_service.cache_info().currsize == 0:
        return
    get_auth_service().close()
    get_auth_service.cache_clear()
