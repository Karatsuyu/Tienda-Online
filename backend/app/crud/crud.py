# backend/app/crud/crud.py
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from typing import List, Optional
from uuid import UUID

from app.models import models
from app.schemas import schemas
from app.core.security import get_password_hash, verify_password

# ===================================================================
# User CRUD
# ===================================================================

async def get_user_by_email(db: AsyncSession, email: str) -> Optional[models.User]:
    result = await db.execute(select(models.User).filter(models.User.email == email))
    return result.scalars().first()

async def create_user(db: AsyncSession, user: schemas.UserCreate) -> models.User:
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        full_name=user.full_name,
        password_hash=hashed_password,
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

async def authenticate_user(db: AsyncSession, email: str, password: str) -> Optional[models.User]:
    user = await get_user_by_email(db, email=email)
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user

# ===================================================================
# Product CRUD
# ===================================================================

async def get_products(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[models.Product]:
    result = await db.execute(
        select(models.Product)
        .options(selectinload(models.Product.variants))
        .offset(skip).limit(limit)
    )
    return result.scalars().all()

async def get_product_by_slug(db: AsyncSession, slug: str) -> Optional[models.Product]:
    result = await db.execute(
        select(models.Product)
        .options(selectinload(models.Product.variants), selectinload(models.Product.category))
        .filter(models.Product.slug == slug)
    )
    return result.scalars().first()

async def get_categories(db: AsyncSession) -> List[models.Category]:
    result = await db.execute(select(models.Category))
    return result.scalars().all()


# ===================================================================
# Cart CRUD (Simplified - assumes one cart per user)
# ===================================================================

async def get_cart_by_user(db: AsyncSession, user_id: UUID) -> Optional[models.Cart]:
    result = await db.execute(
        select(models.Cart)
        .options(selectinload(models.Cart.items).selectinload(models.CartItem.variant))
        .filter(models.Cart.user_id == user_id)
    )
    cart = result.scalars().first()
    if not cart:
        # Create a cart if it doesn't exist
        cart = models.Cart(user_id=user_id)
        db.add(cart)
        await db.commit()
        await db.refresh(cart)
    return cart

async def add_item_to_cart(db: AsyncSession, user_id: UUID, item: schemas.CartItemCreate) -> models.Cart:
    cart = await get_cart_by_user(db, user_id)
    # Check if item already in cart
    existing_item = None
    for cart_item in cart.items:
        if cart_item.variant_id == item.variant_id:
            existing_item = cart_item
            break
    
    if existing_item:
        existing_item.quantity += item.quantity
    else:
        # Fetch the price from the product variant
        variant_result = await db.execute(
            select(models.ProductVariant).filter(models.ProductVariant.id == item.variant_id)
        )
        variant = variant_result.scalars().first()
        if not variant:
            raise ValueError("Product variant not found")
        
        new_item = models.CartItem(
            cart_id=cart.id,
            variant_id=item.variant_id,
            quantity=item.quantity,
            price_at_add=variant.price
        )
        db.add(new_item)
    
    await db.commit()
    await db.refresh(cart)
    return cart

async def update_cart_item(db: AsyncSession, item_id: UUID, quantity: int, user_id: UUID) -> Optional[models.Cart]:
    # Get the cart item and verify it belongs to the user
    result = await db.execute(
        select(models.CartItem)
        .join(models.Cart)
        .filter(models.CartItem.id == item_id)
        .filter(models.Cart.user_id == user_id)
    )
    cart_item = result.scalars().first()
    
    if not cart_item:
        return None
    
    if quantity <= 0:
        await db.delete(cart_item)
    else:
        cart_item.quantity = quantity
    
    await db.commit()
    
    # Return the updated cart
    return await get_cart_by_user(db, user_id)

async def remove_cart_item(db: AsyncSession, item_id: UUID, user_id: UUID) -> bool:
    # Get the cart item and verify it belongs to the user
    result = await db.execute(
        select(models.CartItem)
        .join(models.Cart)
        .filter(models.CartItem.id == item_id)
        .filter(models.Cart.user_id == user_id)
    )
    cart_item = result.scalars().first()
    
    if not cart_item:
        return False
    
    await db.delete(cart_item)
    await db.commit()
    return True

# ===================================================================
# Order CRUD
# ===================================================================

async def get_orders_by_user(db: AsyncSession, user_id: UUID) -> List[models.Order]:
    result = await db.execute(
        select(models.Order)
        .filter(models.Order.user_id == user_id)
        .order_by(models.Order.created_at.desc())
    )
    return result.scalars().all()

async def create_order_from_cart(db: AsyncSession, user_id: UUID) -> Optional[models.Order]:
    # Get the user's cart with items
    cart = await get_cart_by_user(db, user_id)
    if not cart or not cart.items:
        return None
    
    # Calculate total amount
    total_amount = 0.0
    for item in cart.items:
        total_amount += float(item.price_at_add) * item.quantity
    
    # Create the order
    db_order = models.Order(
        user_id=user_id,
        status="pending",
        total_amount=total_amount,
        currency="USD"
    )
    db.add(db_order)
    await db.flush()  # Get the order ID
    
    # Create order items from cart items
    for cart_item in cart.items:
        order_item = models.OrderItem(
            order_id=db_order.id,
            variant_id=cart_item.variant_id,
            quantity=cart_item.quantity,
            unit_price=cart_item.price_at_add,
            total_price=float(cart_item.price_at_add) * cart_item.quantity
        )
        db.add(order_item)
    
    # Clear the cart
    for item in cart.items:
        await db.delete(item)
    
    await db.commit()
    await db.refresh(db_order)
    return db_order

async def get_order(db: AsyncSession, order_id: UUID, user_id: UUID) -> Optional[models.Order]:
    result = await db.execute(
        select(models.Order)
        .options(
            selectinload(models.Order.items).selectinload(models.OrderItem.variant)
        )
        .filter(models.Order.id == order_id)
        .filter(models.Order.user_id == user_id)
    )
    return result.scalars().first()

async def get_all_orders(db: AsyncSession) -> List[models.Order]:
    result = await db.execute(
        select(models.Order)
        .options(
            selectinload(models.Order.items).selectinload(models.OrderItem.variant),
            selectinload(models.Order.user)
        )
        .order_by(models.Order.created_at.desc())
    )
    return result.scalars().all()

# ===================================================================
# Admin CRUD
# ===================================================================

async def get_product(db: AsyncSession, product_id: UUID) -> Optional[models.Product]:
    result = await db.execute(
        select(models.Product)
        .options(
            selectinload(models.Product.variants),
            selectinload(models.Product.category)
        )
        .filter(models.Product.id == product_id)
    )
    return result.scalars().first()

async def create_product(db: AsyncSession, product: schemas.ProductCreate) -> models.Product:
    # Simplified slug generation
    slug = product.title.lower().replace(" ", "-").strip()
    db_product = models.Product(
        title=product.title,
        slug=slug,
        description=product.description,
        category_id=product.category_id
    )
    db.add(db_product)
    await db.commit()
    await db.refresh(db_product)
    return db_product

async def update_product(db: AsyncSession, product_id: UUID, product_in: schemas.ProductUpdate) -> Optional[models.Product]:
    db_product = await get_product(db, product_id)
    if not db_product:
        return None
    
    update_data = product_in.dict(exclude_unset=True)
    
    # Update slug if title is being updated
    if "title" in update_data:
        update_data["slug"] = update_data["title"].lower().replace(" ", "-").strip()
    
    for field, value in update_data.items():
        setattr(db_product, field, value)
    
    await db.commit()
    await db.refresh(db_product)
    return db_product