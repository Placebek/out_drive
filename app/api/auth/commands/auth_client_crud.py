from fastapi import HTTPException
from jose import JWTError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from context.context import create_access_token, hash_password, verify_password
from app.api.auth.shemas.create import UserBase, UserCreate
from app.api.auth.shemas.response import StatusResponse, TokenResponse
from model.model import User, City


async def user_register(user: UserCreate, db: AsyncSession):
    stmt = await db.execute(
        select(User)
        .filter(
            User.phone_number==user.phone_number,
        )
    )
    existing_user = stmt.scalar_one_or_none()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    hashed_password = hash_password(user.password)
    city = await db.execute(
        select(City.id)
        .filter(
            City.city_name==user.city_name
        )
    )

    city_id = city.scalar_one_or_none()

    new_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        hashed_password=hashed_password,
        phone_number=user.phone_number,
        city_id=city_id,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return StatusResponse(status_code=201, status_msg="Great")
    

async def user_login(user: UserBase, db: AsyncSession):
    try:
        result = await db.execute(
            select(User)
            .filter(User.phone_number == user.phone_number)
        )
        db_user = result.scalar_one_or_none()

        if not db_user or not verify_password(user.password, db_user.hashed_password):
            raise HTTPException(
                status_code=401,
                detail="Invalid username or password"
            )

        access_token, expire_time = create_access_token(data={"sub": str(db_user.id)})

        return TokenResponse(
            access_token=access_token,
            access_token_expire_time=expire_time
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred during login: {str(e)}"
        )

