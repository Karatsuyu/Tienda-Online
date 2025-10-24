# backend/app/utils/seed.py
import asyncio
from app.db.session import AsyncSessionLocal
from app.models.models import Category, Product
import uuid

async def seed():
    async with AsyncSessionLocal() as session:
        c = Category(id=str(uuid.uuid4()), name="Electrónica", slug="electronica")
        session.add(c)
        await session.commit()

if __name__ == "__main__":
    asyncio.run(seed())
