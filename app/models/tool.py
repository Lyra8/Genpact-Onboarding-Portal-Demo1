from __future__ import annotations

import uuid
from datetime import datetime, timezone
from enum import StrEnum

from sqlalchemy import Column, Enum as SAEnum
from sqlmodel import Field, SQLModel


class ToolCategory(StrEnum):
    IDE = "IDE"
    COMMUNICATION = "Communication"
    VERSION_CONTROL = "Version Control"
    OFFICE_SUITE = "Office Suite"
    SECURITY = "Security"
    DEVELOPMENT = "Development"
    CLOUD = "Cloud"
    GENERAL = "General"


class Tool(SQLModel, table=True):
    __tablename__ = "tools"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(max_length=255)
    description: str = Field(default="")
    category: ToolCategory = Field(
        default=ToolCategory.GENERAL,
        sa_column=Column(
            SAEnum(ToolCategory, native_enum=False, values_callable=lambda x: [e.value for e in x])
        ),
    )
    download_url: str | None = Field(default=None, max_length=500)
    is_required: bool = Field(default=True)
    display_order: int = Field(default=0)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
