from __future__ import annotations

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.auth import get_current_user, get_password_hash, verify_password
from app.database import get_session
from app.models.user import User, UserRole
from app.schemas.user import (
    MessageResponse,
    PasswordChangeRequest,
    UserListResponse,
    UserManagerUpdate,
    UserRead,
    UserRoleUpdate,
)

router = APIRouter(prefix="/api/users", tags=["users"])


def require_role_manager(current_user: User) -> None:
    if current_user.role != UserRole.MANAGER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Manager access required",
        )


@router.get("", response_model=UserListResponse)
def list_users(
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
) -> UserListResponse:
    require_role_manager(current_user)
    users = session.exec(select(User).order_by(User.email)).all()
    return UserListResponse(
        data=[UserRead.model_validate(user) for user in users],
        count=len(users),
    )


@router.get("/me", response_model=UserRead)
def read_my_profile(current_user: Annotated[User, Depends(get_current_user)]) -> User:
    require_role_manager(current_user)
    return current_user


@router.patch("/me/password", response_model=MessageResponse)
def change_my_password(
    body: PasswordChangeRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
) -> MessageResponse:
    require_role_manager(current_user)
    if not verify_password(body.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    current_user.hashed_password = get_password_hash(body.new_password)
    session.add(current_user)
    session.commit()
    return MessageResponse(message="Password updated successfully")


@router.patch("/{user_id}/role", response_model=UserRead)
def update_user_role(
    user_id: uuid.UUID,
    body: UserRoleUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
) -> User:
    require_role_manager(current_user)
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.role = body.role
    if body.role == UserRole.MANAGER:
        user.manager_id = None
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@router.patch("/{user_id}/manager", response_model=UserRead)
def update_user_manager(
    user_id: uuid.UUID,
    body: UserManagerUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
) -> User:
    require_role_manager(current_user)
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.role != UserRole.INTERN:
        raise HTTPException(status_code=400, detail="Only interns can be assigned a manager")

    if body.manager_id is not None:
        manager = session.get(User, body.manager_id)
        if not manager or manager.role != UserRole.MANAGER:
            raise HTTPException(status_code=400, detail="Manager not found")

    user.manager_id = body.manager_id
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

