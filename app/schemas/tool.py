from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel

from app.models.tool import ToolCategory


class ToolRead(BaseModel):
    id: uuid.UUID
    name: str
    description: str
    category: ToolCategory
    download_url: str | None
    is_required: bool
    display_order: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ToolListResponse(BaseModel):
    data: list[ToolRead]
    count: int
