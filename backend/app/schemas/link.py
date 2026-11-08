import re
from datetime import datetime
from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field, HttpUrl, field_validator

SLUG_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def normalize_slug(value: str) -> str:
    slug = value.strip().lower()
    if not (3 <= len(slug) <= 60):
        raise ValueError("Slug must be between 3 and 60 characters.")
    if not SLUG_PATTERN.fullmatch(slug):
        raise ValueError(
            "Slug may only contain lowercase letters, numbers and single hyphens, "
            "and cannot start or end with a hyphen."
        )
    return slug


class LinkCreate(BaseModel):
    app_name: Annotated[str, Field(min_length=1, max_length=120)]
    android_url: HttpUrl
    ios_url: HttpUrl
    slug: Annotated[str, Field(min_length=3, max_length=60)]

    @field_validator("app_name")
    @classmethod
    def validate_app_name(cls, value: str) -> str:
        name = value.strip()
        if not name:
            raise ValueError("Application name cannot be empty.")
        return name

    @field_validator("slug")
    @classmethod
    def validate_slug(cls, value: str) -> str:
        return normalize_slug(value)


class LinkUpdate(BaseModel):
    app_name: Annotated[str, Field(min_length=1, max_length=120)] | None = None
    android_url: HttpUrl | None = None
    ios_url: HttpUrl | None = None
    slug: Annotated[str, Field(min_length=3, max_length=60)] | None = None

    @field_validator("app_name")
    @classmethod
    def validate_app_name(cls, value: str | None) -> str | None:
        if value is None:
            return value
        name = value.strip()
        if not name:
            raise ValueError("Application name cannot be empty.")
        return name

    @field_validator("slug")
    @classmethod
    def validate_slug(cls, value: str | None) -> str | None:
        if value is None:
            return value
        return normalize_slug(value)


class LinkRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    app_name: str
    android_url: str
    ios_url: str
    slug: str
    smart_url: str
    created_at: datetime
    updated_at: datetime


class LinkResolve(BaseModel):
    app_name: str
    slug: str
    platform: Literal["android", "ios", "other"]
    target_url: str | None
    android_url: str
    ios_url: str
