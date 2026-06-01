from __future__ import annotations

import uuid
from enum import StrEnum

from sqlalchemy import Column, Enum as SAEnum, ForeignKey
from sqlmodel import Field, SQLModel


class UserRole(StrEnum):
    MANAGER = "Manager"
    INTERN = "Intern"


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str | None = Field(default=None, max_length=320, index=True)
    hashed_password: str
    role: UserRole = Field(
        sa_column=Column(
            SAEnum(UserRole, native_enum=False, values_callable=lambda x: [e.value for e in x])
        ),
    )
    manager_id: uuid.UUID | None = Field(
        default=None,
        sa_column=Column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
    )

