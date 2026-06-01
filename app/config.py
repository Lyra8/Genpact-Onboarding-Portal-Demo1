from __future__ import annotations

from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "Genpact Onboarding Portal"
    debug: bool = False

    database_url: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/genpact_onboarding"
    database_echo: bool = False

    # CORS origins allowed (comma-separated)
    allowed_origins: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000"

    jwt_secret_key: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    @field_validator("debug", mode="before")
    @classmethod
    def parse_debug_flag(cls, value: object) -> object:
        if isinstance(value, str) and value.lower() in {"release", "prod", "production"}:
            return False
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()
