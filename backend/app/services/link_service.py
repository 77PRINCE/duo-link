from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.models import Link
from app.schemas.link import LinkCreate, LinkRead, LinkResolve, LinkUpdate
from app.services.platform import detect_platform


class SlugAlreadyExistsError(Exception):
    """Raised when a link is created or renamed to an existing slug."""


class LinkNotFoundError(Exception):
    """Raised when a link cannot be found by id or slug for a user."""


def serialize_link(link: Link) -> LinkRead:
    return LinkRead(
        id=link.id,
        app_name=link.app_name,
        android_url=link.android_url,
        ios_url=link.ios_url,
        slug=link.slug,
        smart_url=f"{settings.frontend_base_url}/r/{link.slug}",
        created_at=link.created_at,
        updated_at=link.updated_at,
    )


def list_links(db: Session, user_id: str) -> list[LinkRead]:
    links = db.scalars(
        select(Link)
        .where(Link.user_id == user_id)
        .order_by(Link.created_at.desc())
    ).all()
    return [serialize_link(link) for link in links]


def create_link(db: Session, payload: LinkCreate, user_id: str) -> LinkRead:
    link = Link(
        user_id=user_id,
        app_name=payload.app_name,
        android_url=str(payload.android_url),
        ios_url=str(payload.ios_url),
        slug=payload.slug,
    )
    db.add(link)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise SlugAlreadyExistsError from exc
    db.refresh(link)
    return serialize_link(link)


def _get_owned_link(db: Session, link_id: int, user_id: str) -> Link:
    link = db.scalar(
        select(Link).where(Link.id == link_id, Link.user_id == user_id)
    )
    if link is None:
        raise LinkNotFoundError
    return link


def get_link(db: Session, link_id: int, user_id: str) -> LinkRead:
    return serialize_link(_get_owned_link(db, link_id, user_id))


def update_link(
    db: Session, link_id: int, user_id: str, payload: LinkUpdate
) -> LinkRead:
    link = _get_owned_link(db, link_id, user_id)

    changes = payload.model_dump(exclude_unset=True)
    for field, value in changes.items():
        if value is None:
            continue
        setattr(link, field, str(value) if field.endswith("_url") else value)

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise SlugAlreadyExistsError from exc
    db.refresh(link)
    return serialize_link(link)


def delete_link(db: Session, link_id: int, user_id: str) -> None:
    link = _get_owned_link(db, link_id, user_id)
    db.delete(link)
    db.commit()


def resolve_link(db: Session, slug: str, user_agent: str | None) -> LinkResolve:
    link = db.scalar(select(Link).where(Link.slug == slug))
    if link is None:
        raise LinkNotFoundError

    platform = detect_platform(user_agent)
    if platform == "android":
        target_url: str | None = link.android_url
    elif platform == "ios":
        target_url = link.ios_url
    else:
        target_url = None

    return LinkResolve(
        app_name=link.app_name,
        slug=link.slug,
        platform=platform,
        target_url=target_url,
        android_url=link.android_url,
        ios_url=link.ios_url,
    )
