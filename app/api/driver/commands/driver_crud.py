from fastapi import HTTPException
from jose import JWTError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.driver.shemas.create import PutRequest
from app.api.driver.shemas.response import StatusResponse
from context.context import validate_access_token
from model.model import Order, User, Request, TaxiDriver


async def validate_user_from_token(access_token: str, db: AsyncSession) -> dict:
    try:
        data = await validate_access_token(access_token=access_token)

        stmt = await db.execute(
            select(User)
            .filter(User.id == data.get('user_id'))
        )
        user = stmt.scalar_one_or_none()

        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        elif driver and data.get('role') == 'driver':
            stmt = await db.execute(
                select(TaxiDriver)
                .join(User, User.id==user.id)
            )
            driver = stmt.scalar_one_or_none()

            return {"user": user, "role": driver}
        
        return {"user": user}

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


async def update_request(request: PutRequest, access_token: str, db:AsyncSession):
    # taxi_driver = await validate_user_from_token(access_token=access_token, db=db)

    stmt = await db.execute(
        select(Request)
        .filter(Request.id==request.request_id)
    )

    request = stmt.scalars().first()

    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    new_order = Order(
        request_id=request.id,
        taxi_id=taxi_driver.get('user').id,
    )

    db.add(new_order)
    await db.commit()
    await db.refresh(new_order)

    return StatusResponse(status_code=201, status_msg="Upgrade order")

