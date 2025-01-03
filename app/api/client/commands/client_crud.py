from fastapi import HTTPException
from jose import JWTError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import json

from app.api.client.shemas.response import CityResponse, StatusResponse, OrderResponse
from app.api.client.shemas.create import RequestCreate
from context.context import validate_access_token
from decorators.decorators import validate_user_from_token
from model.model import Car, Order, TaxiDriver, User, City, Request
from websocket import manager
from app.api.driver.driver import get_all_requests



async def all_cities(db: AsyncSession):
    stmt = await db.execute(
        select(
            City.id, City.city_name
        )
    )
    cities = stmt.all()

    return [CityResponse.from_orm(city) for city in cities]



async def request_create(request: RequestCreate, access_token: str, db: AsyncSession):
    user = await validate_user_from_token(access_token=access_token, db=db)

    db_request = Request(
        user_id=user.id,
        a_point_lat=request.a_point_lat,  
        a_point_lon=request.a_point_lon,  
        b_point_lat=request.b_point_lat,  
        b_point_lon=request.b_point_lon,  
        summ=request.summ,
    )

    db.add(db_request)
    await db.commit()
    await db.refresh(db_request)
    
    
    updated_request = await get_all_requests(access_token=access_token, db=db, limit=100, skip=0)
    new_orders = []
    for item in updated_request:
        new_date = dict(item)
        new_date['created_at'] = str(dict(item)['created_at'])
        new_date['user'] = dict(item.user)
        new_orders.append(new_date)

    await manager.broadcast(new_orders)


    return StatusResponse(status_code=201, status_msg="Request saved successfully.")



async def get_all_orders(access_token: str, db: AsyncSession):
    await validate_user_from_token(access_token=access_token, db=db)

    try:
        result = await db.execute(
            select(Order)
            .options(
                select(Order.request), 
                select(Order.taxi_driver)
            )
        )
        orders = result.scalars().all()

        if not orders:
            raise HTTPException(status_code=404, detail="No orders found")

        return orders

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    