from __future__ import annotations

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from app.auth import get_current_manager
from app.database import get_session
from app.models.course import Course
from app.models.progress import CourseProgress, ProgressStatus
from app.models.user import User
from app.schemas.progress import (
    ManagerProgressRead,
    ManagerProgressResponse,
    ProgressListResponse,
    ProgressRead,
    ProgressUpdate,
)

router = APIRouter(prefix="/api/progress", tags=["progress"])


@router.get("", response_model=ProgressListResponse)
def list_progress(
    intern_id: uuid.UUID = Query(description="Intern identifier"),
    session: Session = Depends(get_session),
) -> ProgressListResponse:
    statement = select(CourseProgress).where(CourseProgress.intern_id == intern_id)
    results = session.exec(statement).all()
    return ProgressListResponse(
        data=[ProgressRead.model_validate(r) for r in results],
        count=len(results),
    )


@router.get("/manager", response_model=ManagerProgressResponse)
def list_manager_progress(
    manager: User = Depends(get_current_manager),
    session: Session = Depends(get_session),
) -> ManagerProgressResponse:
    statement = (
        select(CourseProgress, User, Course)
        .join(User, User.id == CourseProgress.intern_id)
        .join(Course, Course.id == CourseProgress.course_id)
        .where(User.manager_id == manager.id)
        .order_by(User.email, Course.display_order, Course.title)
    )
    rows = session.exec(statement).all()
    data = [
        ManagerProgressRead(
            intern_id=intern.id,
            intern_name=intern.email or str(intern.id),
            intern_email=intern.email,
            course_id=course.id,
            course_title=course.title,
            status=progress.status,
            updated_at=progress.updated_at,
        )
        for progress, intern, course in rows
    ]
    return ManagerProgressResponse(data=data, count=len(data))


@router.put("/{course_id}", response_model=ProgressRead)
def upsert_progress(
    course_id: uuid.UUID,
    body: ProgressUpdate,
    intern_id: uuid.UUID = Query(description="Intern identifier"),
    session: Session = Depends(get_session),
) -> CourseProgress:
    statement = select(CourseProgress).where(
        CourseProgress.course_id == course_id,
        CourseProgress.intern_id == intern_id,
    )
    progress = session.exec(statement).first()

    if progress:
        progress.status = body.status
        progress.updated_at = datetime.now(timezone.utc)
    else:
        progress = CourseProgress(
            course_id=course_id,
            intern_id=intern_id,
            status=body.status,
        )
        session.add(progress)

    session.commit()
    session.refresh(progress)
    return progress
