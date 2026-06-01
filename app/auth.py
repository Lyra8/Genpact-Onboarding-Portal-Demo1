from __future__ import annotations

import uuid
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlmodel import Session, select

from app.config import get_settings
from app.database import get_session
from app.models.user import User, UserRole

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")


@dataclass
class AuthenticatedUser:
    id: uuid.UUID
    email: str | None
    hashed_password: str
    role: UserRole
    manager_id: uuid.UUID | None = None


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return False


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(subject: str) -> str:
    settings = get_settings()
    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    payload = {"sub": subject, "exp": expires_at}
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def authenticate_user(session: Session, username: str, password: str) -> AuthenticatedUser | None:
    statement = select(User.id, User.email, User.hashed_password, User.role).where(
        User.email == username
    )
    row = session.exec(statement).first()
    if not row:
        return None

    user = AuthenticatedUser(
        id=row[0],
        email=row[1],
        hashed_password=row[2],
        role=row[3],
    )
    if not verify_password(password, user.hashed_password):
        return None
    return user


def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    session: Annotated[Session, Depends(get_session)],
) -> User:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token,
            get_settings().jwt_secret_key,
            algorithms=[get_settings().jwt_algorithm],
        )
        subject = payload.get("sub")
        if subject is None:
            raise credentials_error
        user_id = uuid.UUID(subject)
    except (JWTError, ValueError) as exc:
        raise credentials_error from exc

    user = session.get(User, user_id)
    if user is None:
        raise credentials_error
    return user


def get_current_manager(current_user: Annotated[User, Depends(get_current_user)]) -> User:
    if current_user.role != UserRole.MANAGER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Manager access required",
        )
    return current_user

