# backend/app/api/v1/products.py
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.schemas.schemas import Product, Category
from app.db.session import get_db

router = APIRouter()

@router.get("/", response_model=List[Product])
async def read_products(db: AsyncSession = Depends(get_db), skip: int = 0, limit: int = 100):
    """
    Retrieve a list of products with pagination.
    """
    products = await crud.get_products(db, skip=skip, limit=limit)
    return products

@router.get("/{slug}", response_model=Product)
async def read_product(slug: str, db: AsyncSession = Depends(get_db)):
    """
    Retrieve a single product by its slug.
    """
    db_product = await crud.get_product_by_slug(db, slug=slug)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.get("/categories", response_model=List[Category])
async def read_categories(db: AsyncSession = Depends(get_db)):
    """
    Retrieve a list of all product categories.
    """
    categories = await crud.get_categories(db)
    return categories