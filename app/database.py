from __future__ import annotations

from typing import Generator

from sqlalchemy import Engine, text
from sqlmodel import Session, SQLModel, create_engine

from app.config import get_settings

_engine: Engine | None = None


def _get_engine() -> Engine:
    global _engine
    if _engine is None:
        _settings = get_settings()
        _engine = create_engine(
            _settings.database_url,
            echo=_settings.database_echo,
            pool_size=10,
            max_overflow=5,
            pool_pre_ping=True,
        )
    return _engine


def get_session() -> Generator[Session, None, None]:
    with Session(_get_engine()) as session:
        yield session


def init_db() -> None:
    SQLModel.metadata.create_all(_get_engine())
    _ensure_auth_schema()


def _ensure_auth_schema() -> None:
    engine = _get_engine()
    with engine.begin() as connection:
        connection.execute(
            text(
                """
                ALTER TABLE users
                ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES users(id) ON DELETE SET NULL
                """
            )
        )
        connection.execute(
            text(
                """
                UPDATE users
                SET manager_id = (SELECT id FROM users WHERE role = 'Manager' ORDER BY email LIMIT 1)
                WHERE role = 'Intern' AND manager_id IS NULL
                """
            )
        )
