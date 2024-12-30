from fastapi import Request, HTTPException, status
from functools import wraps
from context.context import get_access_token, validate_access_token
from model.model import TaxiDriver, User
from sqlalchemy import insert, select
from database.db import get_db, async_session_factory

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