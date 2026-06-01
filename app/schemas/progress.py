from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel

from app.models.progress import ProgressStatus


class ProgressRead(BaseModel):
    id: uuid.UUID
    course_id: uuid.UUID
    intern_id: uuid.UUID
    status: ProgressStatus
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ProgressUpdate(BaseModel):
    status: ProgressStatus


class ProgressListResponse(BaseModel):
    data: list[ProgressRead]
    count: int


class ManagerProgressRead(BaseModel):
    intern_id: uuid.UUID
    intern_name: str
    intern_email: str | None = None
    course_id: uuid.UUID
    course_title: str
    status: ProgressStatus
    updated_at: datetime


class ManagerProgressResponse(BaseModel):
    data: list[ManagerProgressRead]
    count: int
