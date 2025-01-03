from fastapi import Request, HTTPException, status
from functools import wraps
from sqlalchemy.ext.asyncio import AsyncSession
from jose import JWTError

from context.context import validate_access_token
from model.model import TaxiDriver, User
from sqlalchemy import select
from database.db import async_session_factory


async def validate_user_from_token(access_token: str, db: AsyncSession) -> User:
    try:
        user_id = (await validate_access_token(access_token=access_token)).get('user_id')

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



async def validate_driver_from_token(access_token: str, db: AsyncSession) -> TaxiDriver:
    try:
        user_id = (await validate_access_token(access_token=access_token)).get('user_id')

        stmt = await db.execute(
            select(TaxiDriver).filter(TaxiDriver.user_id == user_id)
        )
        taxi_driver = stmt.scalar_one()

        if not taxi_driver:
            raise HTTPException(status_code=404, detail="Taxi driver not found")

        return taxi_driver

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")




def is_driver(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        access_token = kwargs.get('access_token') or args[0]
        user_dict = await validate_access_token(access_token)
        
        async with async_session_factory() as session:
            result = await session.execute(
                select(TaxiDriver).join(User, User.id == user_dict.get("user_id"))
            )
            
            taxi_driver = result.scalars().first() 
            
            if not taxi_driver:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="User is not a driver"
                )
            
        return await func(*args, **kwargs) 

    return wrapper