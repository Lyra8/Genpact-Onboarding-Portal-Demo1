from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, Query
from sqlmodel import Session, select

from app.database import get_session
from app.models.tool import Tool
from app.schemas.tool import ToolListResponse, ToolRead

router = APIRouter(prefix="/api/tools", tags=["tools"])


@router.get("", response_model=ToolListResponse)
def list_tools(
    category: str | None = Query(default=None, description="Filter by category"),
    session: Session = Depends(get_session),
) -> ToolListResponse:
    statement = select(Tool).order_by(Tool.display_order, Tool.name)
    if category:
        statement = statement.where(Tool.category == category)
    results = session.exec(statement).all()
    return ToolListResponse(
        data=[ToolRead.model_validate(t) for t in results],
        count=len(results),
    )


@router.get("/{tool_id}", response_model=ToolRead)
def get_tool(
    tool_id: uuid.UUID,
    session: Session = Depends(get_session),
) -> Tool:
    tool = session.get(Tool, tool_id)
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    return tool
