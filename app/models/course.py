from __future__ import annotations

import uuid
from datetime import datetime, timezone
from enum import StrEnum

from sqlalchemy import Column, Enum as SAEnum
from sqlmodel import Field, SQLModel


class CourseCategory(StrEnum):
    COMPLIANCE = "Compliance"
    TECHNICAL = "Technical"
    HR = "HR"
    SECURITY = "Security"
    CULTURE = "Culture"
    GENERAL = "General"


class Course(SQLModel, table=True):
    __tablename__ = "courses"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(max_length=255)
    description: str = Field(default="")
    category: CourseCategory = Field(
        default=CourseCategory.GENERAL,
        sa_column=Column(
            SAEnum(CourseCategory, native_enum=False, values_callable=lambda x: [e.value for e in x])
        ),
    )
    duration_minutes: int = Field(default=0, ge=0)
    is_mandatory: bool = Field(default=True)
    week_number: int = Field(default=1, ge=1)
    content_url: str | None = Field(default=None, max_length=500)
    display_order: int = Field(default=0)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
