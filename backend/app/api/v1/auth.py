# backend/app/api/v1/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.core import security
from app.core.config import settings
from app.db.session import get_db
from app.models.models import User
from app.schemas.schemas import User as UserSchema, UserCreate, Token

router = APIRouter()

@router.post("/register", response_model=UserSchema, status_code=status.HTTP_201_CREATED)
async def register_user(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    """
    Create a new user.
    """
    db_user = await crud.get_user_by_email(db, email=user_in.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = await crud.create_user(db=db, user=user_in)
    return user

@router.post("/login", response_model=Token)
async def login_for_access_token(db: AsyncSession = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Authenticate user and return a JWT access token.
    """
    user = await crud.authenticate_user(db, email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserSchema)
async def read_users_me(current_user: User = Depends(security.get_current_active_user)):
    """
    Get the current logged-in user.
    """
    return current_user