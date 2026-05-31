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
