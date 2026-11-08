from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.link import LinkCreate, LinkRead, LinkResolve, LinkUpdate
from app.services import link_service
from app.services.link_service import LinkNotFoundError, SlugAlreadyExistsError

router = APIRouter(prefix="/links", tags=["links"])


@router.post("", response_model=LinkRead, status_code=status.HTTP_201_CREATED)
def create_link(payload: LinkCreate, db: Session = Depends(get_db)) -> LinkRead:
    try:
        return link_service.create_link(db, payload)
    except SlugAlreadyExistsError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A link with this slug already exists.",
        ) from exc


@router.get("", response_model=list[LinkRead])
def list_links(db: Session = Depends(get_db)) -> list[LinkRead]:
    return link_service.list_links(db)


@router.get("/resolve/{slug}", response_model=LinkResolve)
def resolve_link(
    slug: str,
    user_agent: str | None = Header(default=None, alias="User-Agent"),
    db: Session = Depends(get_db),
) -> LinkResolve:
    try:
        return link_service.resolve_link(db, slug, user_agent)
    except LinkNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Link not found.",
        ) from exc


@router.get("/{link_id}", response_model=LinkRead)
def get_link(link_id: int, db: Session = Depends(get_db)) -> LinkRead:
    try:
        return link_service.get_link(db, link_id)
    except LinkNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Link not found.",
        ) from exc


@router.patch("/{link_id}", response_model=LinkRead)
def update_link(
    link_id: int, payload: LinkUpdate, db: Session = Depends(get_db)
) -> LinkRead:
    try:
        return link_service.update_link(db, link_id, payload)
    except LinkNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Link not found.",
        ) from exc
    except SlugAlreadyExistsError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A link with this slug already exists.",
        ) from exc


@router.delete("/{link_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_link(link_id: int, db: Session = Depends(get_db)) -> None:
    try:
        link_service.delete_link(db, link_id)
    except LinkNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Link not found.",
        ) from exc
