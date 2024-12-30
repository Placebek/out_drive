from fastapi import HTTPException
from jose import JWTError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.client.shemas.response import CityResponse, StatusResponse
from app.api.client.shemas.create import RequestCreate
from context.context import validate_access_token
from model.model import User, City, Request


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
    

async def all_cities(access_token: str, db:AsyncSession):
    await validate_user_from_token(access_token=access_token, db=db)

    stmt = await db.execute(
        select(City.city_name)
    )
    cities = stmt.all()

    return [CityResponse.from_orm(city) for city in cities]


async def request_create(request: RequestCreate, access_token: str, db:AsyncSession):
    user = await validate_user_from_token(access_token=access_token, db=db)

    db_request = Request(
        user_id=user.id,
        a_point=request.a_point,
        b_point=request.b_point,
        summ=request.summ,
    )

    db.add(db_request)
    await db.commit()
    await db.refresh(db_request)

    return StatusResponse(status_code=201, status_msg=f"Reques saved successfully your request")
