from fastapi import HTTPException
from jose import JWTError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.driver.shemas.create import RequestBase
from app.api.driver.shemas.response import StatusResponse, RequestResponse
from decorators.decorators import validate_user_from_token
from model.model import Order, User, Request, TaxiDriver


async def post_request(request: RequestBase, access_token: str, db:AsyncSession):
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
        request_id=request.id,
        taxi_id=taxi_driver.id,
    )

    db.add(new_order)
    await db.commit()
    await db.refresh(new_order)

    return StatusResponse(status_code=201, status_msg="Upgrade order")


async def get_all_requests(access_token: str, skip: int, limit: int, db: AsyncSession):
    await validate_user_from_token(access_token=access_token, db=db)
    
    result = await db.execute(
        select(Request)
        .offset(skip)
        .limit(limit)
    )
    requests = result.scalars().all()
    
    if not requests:
        raise HTTPException(status_code=404, detail="No requests found")
    for req in requests:
        user_data = await db.execute(select(User).filter(User.id == req.user_id))
        req.user = user_data.scalar_one_or_none()

    return requests
