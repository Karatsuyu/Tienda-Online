# backend/app/db/init_db.py
import asyncio
from sqlalchemy.exc import OperationalError
from app.db.session import engine
from app.db.base import Base

async def init_db():
    max_retries = 5
    for attempt in range(max_retries):
        try:
            async with engine.begin() as conn:
                # Use this to drop and re-create tables
                # await conn.run_sync(Base.metadata.drop_all)
                await conn.run_sync(Base.metadata.create_all)
            break
        except (OperationalError, ConnectionResetError, OSError) as e:
            if attempt < max_retries - 1:
                print(f"Database connection attempt {attempt + 1} failed: {e}")
                print("Retrying in 2 seconds...")
                await asyncio.sleep(2)
            else:
                print(f"Failed to connect to database after {max_retries} attempts")
                raise

if __name__ == "__main__":
    print("Initializing the database...")
    asyncio.run(init_db())
    print("Database initialized.")
