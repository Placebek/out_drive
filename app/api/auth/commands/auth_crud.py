from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.auth.commands.context import hash_password
from app.api.auth.shemas.create import UserCreate


async def user_register(user: UserCreate, db: AsyncSession):
    stmt = await db.execute(
        select(User)
        .filter(
            phone_number=user.phone_number,
        )
    )
    existing_user = stmt.scalar_one_or_none()

    if not existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    hashed_password = hash_password(user.password)

    new_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        password=user.password,
        phone_number=user.phone_number,
        city_name=user.city_name,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return
    