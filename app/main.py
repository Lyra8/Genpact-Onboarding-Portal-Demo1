from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import init_db
from app.routers import contacts, courses, progress, tools

_settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):  # pragma: no cover
    init_db()
    yield


app = FastAPI(
    title=_settings.app_name,
    version="0.1.0",
    description="Sprint 1 MVP — Intern Onboarding Portal",
    lifespan=lifespan,
)

origins = [o.strip() for o in _settings.allowed_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "PUT", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(tools.router)
app.include_router(courses.router)
app.include_router(contacts.router)
app.include_router(progress.router)


@app.get("/api/health", tags=["system"])
async def health_check() -> dict[str, str]:
    return {"status": "ok"}
