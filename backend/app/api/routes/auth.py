from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials

from app.api.deps import bearer_scheme, get_current_user
from app.schemas.auth import (
    AuthSession,
    AuthUser,
    LoginRequest,
    RefreshRequest,
    RegisterRequest,
    RegisterResponse,
)
from app.services.supabase_auth import AuthServiceError, get_auth_service

router = APIRouter(prefix="/auth", tags=["auth"])


def _service():
    service = get_auth_service()
    if not service.configured:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication is not configured on the server.",
        )
    return service


@router.post(
    "/register",
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(payload: RegisterRequest) -> RegisterResponse:
    service = _service()
    try:
        session = service.sign_up(
            email=str(payload.email),
            password=payload.password,
            name=payload.name,
        )
    except AuthServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc

    return RegisterResponse(
        needs_confirmation=session is None,
        session=session,
    )


@router.post("/login", response_model=AuthSession)
def login(payload: LoginRequest) -> AuthSession:
    service = _service()
    try:
        return service.login(email=str(payload.email), password=payload.password)
    except AuthServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc


@router.post("/refresh", response_model=AuthSession)
def refresh(payload: RefreshRequest) -> AuthSession:
    service = _service()
    try:
        return service.refresh(payload.refresh_token)
    except AuthServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> None:
    if credentials is not None and credentials.credentials:
        service = get_auth_service()
        if service.configured:
            service.logout(credentials.credentials)


@router.get("/me", response_model=AuthUser)
def me(current_user: AuthUser = Depends(get_current_user)) -> AuthUser:
    return current_user
