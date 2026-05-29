from __future__ import annotations

from typing import Generator

from sqlalchemy import Engine
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
