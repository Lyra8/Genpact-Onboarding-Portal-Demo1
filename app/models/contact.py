from __future__ import annotations

import uuid
from datetime import datetime, timezone
from enum import StrEnum

from sqlalchemy import Column, Enum as SAEnum
from sqlmodel import Field, SQLModel


class ContactRole(StrEnum):
    MENTOR = "Mentor"
    HR_SUPPORT = "HR Support"
    IT_SUPPORT = "IT Support"
    MANAGER = "Manager"
    BUDDY = "Buddy"
    ADMIN = "Admin"
    OTHER = "Other"


class Contact(SQLModel, table=True):
    __tablename__ = "contacts"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(max_length=255)
    role: ContactRole = Field(
        sa_column=Column(
            SAEnum(ContactRole, native_enum=False, values_callable=lambda x: [e.value for e in x])
        ),
    )
    department: str = Field(default="", max_length=255)
    email: str = Field(max_length=320)
    phone: str | None = Field(default=None, max_length=50)
    is_primary: bool = Field(default=False)
    display_order: int = Field(default=0)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
