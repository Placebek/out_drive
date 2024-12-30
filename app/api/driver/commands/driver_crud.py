from fastapi import HTTPException
from jose import JWTError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.driver.shemas.response import StatusResponse
from context.context import validate_access_token
from model.model import Order, User, Request


async def validate_user_from_token(access_token: str, db: AsyncSession) -> User:
    try:
        user_id = await validate_access_token(access_token=access_token)

        stmt = await db.execute(
            select(User)
            .filter(User.id == user_id)
        )
        user = stmt.scalar_one_or_none()
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        
        return user

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def update_request(request_id: int, access_token: str, db:AsyncSession):
    taxi_driver = await validate_user_from_token(access_token=access_token, db=db)

    stmt = await db.execute(
        select(Request)
        .filter(Request.id==request_id)
    )

    request = stmt.scalars().first()

    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    new_order = Order(
        request_id=request.id,
        taxi_id=taxi_driver.id,
    )

    db.add(new_order)
    await db.commit()
    await db.refresh(new_order)

    return StatusResponse(status_code=201, status_msg="Upgrade order")

