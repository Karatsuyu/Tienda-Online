# backend/app/api/v1/admin.py
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.schemas.schemas import Product, ProductCreate, ProductUpdate, Order
from app.core.security import get_current_staff_user
from app.db.session import get_db

router = APIRouter()

@router.post("/products", response_model=Product, dependencies=[Depends(get_current_staff_user)])
async def create_product(product: ProductCreate, db: AsyncSession = Depends(get_db)):
    """
    Create a new product (Admin only).
    """
    return await crud.create_product(db=db, product=product)

@router.put("/products/{product_id}", response_model=Product, dependencies=[Depends(get_current_staff_user)])
async def update_product(product_id: UUID, product: ProductUpdate, db: AsyncSession = Depends(get_db)):
    """
    Update an existing product (Admin only).
    """
    db_product = await crud.get_product(db, product_id=product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return await crud.update_product(db, product_id=product_id, product_in=product)

@router.get("/orders", response_model=List[Order], dependencies=[Depends(get_current_staff_user)])
async def list_all_orders(db: AsyncSession = Depends(get_db)):
    """
    List all orders in the system (Admin only).
    """
    return await crud.get_all_orders(db)
