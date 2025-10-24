# backend/app/db/base.py
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# Import all models here so they are registered with Base
from app.models.models import *  # noqa
