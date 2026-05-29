from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from app.database import get_session
from app.models.contact import Contact
from app.schemas.contact import ContactListResponse, ContactRead

router = APIRouter(prefix="/api/contacts", tags=["contacts"])


@router.get("", response_model=ContactListResponse)
def list_contacts(
    role: str | None = Query(default=None, description="Filter by role"),
    session: Session = Depends(get_session),
) -> ContactListResponse:
    statement = select(Contact).order_by(Contact.display_order, Contact.name)
    if role:
        statement = statement.where(Contact.role == role)
    results = session.exec(statement).all()
    return ContactListResponse(
        data=[ContactRead.model_validate(c) for c in results],
        count=len(results),
    )


@router.get("/{contact_id}", response_model=ContactRead)
def get_contact(
    contact_id: uuid.UUID,
    session: Session = Depends(get_session),
) -> Contact:
    contact = session.get(Contact, contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact
