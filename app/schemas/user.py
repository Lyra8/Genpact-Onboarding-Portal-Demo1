from __future__ import annotations

import uuid

from pydantic import BaseModel, Field, model_validator

from app.models.user import UserRole


class UserRead(BaseModel):
    id: uuid.UUID
    email: str | None = None
    role: UserRole
    manager_id: uuid.UUID | None = None

    model_config = {"from_attributes": True}


class UserListResponse(BaseModel):
    data: list[UserRead]
    count: int


class UserRoleUpdate(BaseModel):
    role: UserRole


class UserManagerUpdate(BaseModel):
    manager_id: uuid.UUID | None


class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8)
    confirm_new_password: str

    @model_validator(mode="after")
    def passwords_match(self) -> "PasswordChangeRequest":
        if self.new_password != self.confirm_new_password:
            raise ValueError("New passwords do not match")
        return self


class MessageResponse(BaseModel):
    message: str

