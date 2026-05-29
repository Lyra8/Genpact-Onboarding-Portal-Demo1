from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from app.database import get_session
from app.models.course import Course
from app.schemas.course import CourseListResponse, CourseRead

router = APIRouter(prefix="/api/courses", tags=["courses"])


@router.get("", response_model=CourseListResponse)
def list_courses(
    week: int | None = Query(default=None, description="Filter by week number"),
    category: str | None = Query(default=None, description="Filter by category"),
    session: Session = Depends(get_session),
) -> CourseListResponse:
    statement = select(Course).order_by(Course.display_order, Course.title)
    if week is not None:
        statement = statement.where(Course.week_number == week)
    if category:
        statement = statement.where(Course.category == category)
    results = session.exec(statement).all()
    return CourseListResponse(
        data=[CourseRead.model_validate(c) for c in results],
        count=len(results),
    )


@router.get("/{course_id}", response_model=CourseRead)
def get_course(
    course_id: uuid.UUID,
    session: Session = Depends(get_session),
) -> Course:
    course = session.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course
