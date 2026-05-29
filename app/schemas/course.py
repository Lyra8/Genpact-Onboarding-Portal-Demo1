from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel

from app.models.course import CourseCategory


class CourseRead(BaseModel):
    id: uuid.UUID
    title: str
    description: str
    category: CourseCategory
    duration_minutes: int
    is_mandatory: bool
    week_number: int
    content_url: str | None
    display_order: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class CourseListResponse(BaseModel):
    data: list[CourseRead]
    count: int
