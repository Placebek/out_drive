from fastapi import HTTPException
from jose import JWTError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.driver.shemas.create import RequestBase
from app.api.driver.shemas.response import StatusResponse, RequestResponse
from decorators.decorators import validate_user_from_token
from model.model import Order, User, Request, TaxiDriver


async def update_request(request: RequestBase, access_token: str, db:AsyncSession):
    taxi_driver = await validate_user_from_token(access_token=access_token, db=db)

    stmt = await db.execute(
        select(Request)
        .filter(
            Request.id==request.request_id
        )
    )

    request = stmt.scalars().first()

    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    new_order = Order(
        request_id=request.request_id,
        taxi_id=taxi_driver.id,
    )

    db.add(new_order)
    await db.commit()
    await db.refresh(new_order)

    return StatusResponse(status_code=201, status_msg="Upgrade order")


async def all_requests(access_token: str, db:AsyncSession):
    stmt = await db.execute(
        select(
            Request.id,
            Request.summ,
            Request.a_point,
            Request.b_point,
            User.id,
            User.first_name,
            User.last_name,
            User.phone_number,
        )
        .join(User, User.id==Request.user_id)
    )
    requests = stmt.all()

    return [RequestResponse.from_orm(request) for request in requests]


