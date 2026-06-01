from __future__ import annotations

import uuid
from datetime import datetime, timezone
from enum import StrEnum

from sqlalchemy import Column, Enum as SAEnum, ForeignKey
from sqlmodel import Field, SQLModel


class ProgressStatus(StrEnum):
    NOT_STARTED = "Not Started"
    IN_PROGRESS = "In Progress"
    DONE = "Done"


class CourseProgress(SQLModel, table=True):
    __tablename__ = "course_progress"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    course_id: uuid.UUID = Field(
        sa_column=Column(ForeignKey("courses.id", ondelete="CASCADE")),
    )
    intern_id: uuid.UUID = Field()
    status: ProgressStatus = Field(
        default=ProgressStatus.NOT_STARTED,
        sa_column=Column(
            SAEnum(ProgressStatus, native_enum=False, values_callable=lambda x: [e.value for e in x])
        ),
    )
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

