# backend/app/api/v1/cart.py
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.models.models import User
from app.schemas.schemas import Cart, CartItemCreate
from app.core.security import get_current_active_user
from app.db.session import get_db

router = APIRouter()

@router.get("/", response_model=Cart)
async def get_cart(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """
    Get the current user's shopping cart.
    """
    cart = await crud.get_cart_by_user(db, user_id=current_user.id)
    return cart

@router.post("/items", response_model=Cart)
async def add_item_to_cart(item: CartItemCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """
    Add an item to the shopping cart.
    """
    cart = await crud.add_item_to_cart(db, user_id=current_user.id, item=item)
    return cart

@router.put("/items/{item_id}", response_model=Cart)
async def update_cart_item(item_id: UUID, item: CartItemCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """
    Update an item's quantity in the shopping cart.
    """
    cart = await crud.update_cart_item(db, item_id=item_id, quantity=item.quantity, user_id=current_user.id)
    if cart is None:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return cart

@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_cart_item(item_id: UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """
    Remove an item from the shopping cart.
    """
    await crud.remove_cart_item(db, item_id=item_id, user_id=current_user.id)
    return
