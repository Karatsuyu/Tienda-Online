# backend/app/core/config.py
from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    # Core settings
    PROJECT_NAME: str = "MiTienda API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str  # Must be set in .env

    # Database
    DATABASE_URL: str  # Must be set in .env

    # JWT
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days

    # External services
    REDIS_URL: str = "redis://redis:6379/0"
    ELASTIC_URL: str = "http://elastic:9200"

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()