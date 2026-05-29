from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel

from app.models.contact import ContactRole


class ContactRead(BaseModel):
    id: uuid.UUID
    name: str
    role: ContactRole
    department: str
    email: str
    phone: str | None
    is_primary: bool
    display_order: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ContactListResponse(BaseModel):
    data: list[ContactRead]
    count: int
