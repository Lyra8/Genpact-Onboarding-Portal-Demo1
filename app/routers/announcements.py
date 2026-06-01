from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.auth import get_current_manager, get_current_user
from app.database import get_session
from app.models.announcement import Announcement
from app.models.user import User, UserRole
from app.schemas.announcement import AnnouncementCreate, AnnouncementRead

router = APIRouter(prefix="/api/announcements", tags=["announcements"])


@router.get("/manager", response_model=list[AnnouncementRead])
def list_manager_announcements(
    manager: Annotated[User, Depends(get_current_manager)],
    session: Annotated[Session, Depends(get_session)],
) -> list[Announcement]:
    statement = (
        select(Announcement)
        .where(Announcement.manager_id == manager.id)
        .order_by(Announcement.posted_at.desc())
    )
    return list(session.exec(statement).all())


@router.get("/intern", response_model=list[AnnouncementRead])
def list_intern_announcements(
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
) -> list[Announcement]:
    if current_user.role != UserRole.INTERN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Intern access required")
    if current_user.manager_id is None:
        return []

    statement = (
        select(Announcement)
        .where(Announcement.manager_id == current_user.manager_id)
        .order_by(Announcement.posted_at.desc())
    )
    return list(session.exec(statement).all())


@router.post("", response_model=AnnouncementRead, status_code=201)
def create_announcement(
    body: AnnouncementCreate,
    manager: Annotated[User, Depends(get_current_manager)],
    session: Annotated[Session, Depends(get_session)],
) -> Announcement:
    message = body.message.strip()
    if not message:
        raise HTTPException(status_code=422, detail="Announcement message is required")

    announcement = Announcement(manager_id=manager.id, title="Reminder", content=message)
    session.add(announcement)
    session.commit()
    session.refresh(announcement)
    return announcement

