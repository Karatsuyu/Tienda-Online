# backend/app/api/v1/orders.py
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.models.models import User
from app.schemas.schemas import Order
from app.core.security import get_current_active_user
from app.db.session import get_db

router = APIRouter()

@router.post("/checkout", response_model=Order, status_code=status.HTTP_201_CREATED)
async def checkout(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """
    Create an order from the user's current cart.
    """
    order = await crud.create_order_from_cart(db, user_id=current_user.id)
    if not order:
        raise HTTPException(status_code=400, detail="Cart is empty or invalid")
    return order

@router.get("/", response_model=List[Order])
async def list_orders(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """
    List all orders for the current user.
    """
    orders = await crud.get_orders_by_user(db, user_id=current_user.id)
    return orders

@router.get("/{order_id}", response_model=Order)
async def get_order(order_id: UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """
    Get details for a specific order.
    """
    order = await crud.get_order(db, order_id=order_id, user_id=current_user.id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
