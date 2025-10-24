# backend/app/schemas/schemas.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Any
from uuid import UUID
from datetime import datetime

# ===================================================================
# Base & Generic Schemas
# ===================================================================

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# ===================================================================
# User Schemas
# ===================================================================

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    password: Optional[str] = None

class User(UserBase):
    id: UUID
    is_active: bool
    is_staff: bool
    created_at: datetime

    class Config:
        from_attributes = True

# ===================================================================
# Product Schemas
# ===================================================================

class Category(BaseModel):
    id: UUID
    name: str
    slug: str

    class Config:
        from_attributes = True

class ProductVariant(BaseModel):
    id: UUID
    sku: str
    price: float
    stock: int
    attributes: Optional[dict]

    class Config:
        from_attributes = True

class Product(BaseModel):
    id: UUID
    title: str
    slug: str
    description: Optional[str]
    category: Optional[Category]
    variants: List[ProductVariant] = []

    class Config:
        from_attributes = True

# ===================================================================
# Cart Schemas
# ===================================================================

class CartItemBase(BaseModel):
    variant_id: UUID
    quantity: int = Field(..., gt=0)

class CartItemCreate(CartItemBase):
    pass

class CartItem(CartItemBase):
    id: UUID
    price_at_add: float
    variant: ProductVariant

    class Config:
        from_attributes = True

class Cart(BaseModel):
    id: UUID
    items: List[CartItem] = []
    # Add other fields like total amount if calculated on the fly
    
    class Config:
        from_attributes = True

# ===================================================================
# Order Schemas
# ===================================================================

class OrderItem(BaseModel):
    id: UUID
    quantity: int
    unit_price: float
    variant: ProductVariant

    class Config:
        from_attributes = True

class Order(BaseModel):
    id: UUID
    status: str
    total_amount: float
    items: List[OrderItem] = []
    created_at: datetime

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    # Typically created from a cart, so might not need a complex body
    pass

# ===================================================================
# Admin Schemas
# ===================================================================

class ProductCreate(BaseModel):
    title: str
    description: Optional[str]
    category_id: UUID
    # Simplified for now

class ProductUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    category_id: Optional[UUID]