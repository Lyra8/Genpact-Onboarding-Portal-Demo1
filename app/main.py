from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import init_db
from app.routers import announcements, auth, contacts, courses, progress, tools, users

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

origins = [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(tools.router)
app.include_router(courses.router)
app.include_router(contacts.router)
app.include_router(progress.router)
app.include_router(auth.router)
app.include_router(announcements.router)
app.include_router(users.router)


@app.get("/api/health", tags=["system"])
async def health_check() -> dict[str, str]:
    return {"status": "ok"}
