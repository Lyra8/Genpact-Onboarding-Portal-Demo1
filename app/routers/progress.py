from __future__ import annotations

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from app.database import get_session
from app.models.progress import CourseProgress, ProgressStatus
from app.schemas.progress import ProgressListResponse, ProgressRead, ProgressUpdate

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
