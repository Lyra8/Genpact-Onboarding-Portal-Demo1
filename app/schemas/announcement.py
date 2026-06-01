from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class AnnouncementCreate(BaseModel):
    message: str = Field(min_length=1, max_length=500)


class AnnouncementRead(BaseModel):
    id: uuid.UUID
    manager_id: uuid.UUID
    title: str
    content: str
    posted_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

