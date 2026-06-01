from __future__ import annotations

import uuid

from pydantic import BaseModel, EmailStr, Field, model_validator

from app.models.user import UserRole


class UserRead(BaseModel):
    id: uuid.UUID
    email: str | None = None
    role: UserRole
    manager_id: uuid.UUID | None = None

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: UserRole
    user_id: uuid.UUID


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    confirm_password: str | None = None

    @model_validator(mode="after")
    def passwords_match(self) -> "RegisterRequest":
        if self.confirm_password is not None and self.password != self.confirm_password:
            raise ValueError("Passwords do not match")
        return self

