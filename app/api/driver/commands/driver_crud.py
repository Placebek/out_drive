from fastapi import HTTPException
from jose import JWTError
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.api.driver.shemas.create import RequestBase, LocationDataSchema
from app.api.driver.shemas.response import StatusResponse, RequestWithUser
from decorators.decorators import validate_user_from_token, validate_driver_from_token
from model.model import Order, User, Request, TaxiDriver, TaxiDriverLocation
from websocket import manager, manager_orders



async def post_request(request: RequestBase, access_token: str, db:AsyncSession):
    taxi_driver = await validate_driver_from_token(access_token=access_token, db=db)
    stmt = await db.execute(
        select(Request)
        .filter(
            Request.id==request.request_id
        )
    )

    this_request = stmt.scalars().first()
    if not this_request:
        raise HTTPException(status_code=404, detail="Request not found")
    await create_driver_location(location=request,access_token=access_token, db=db)


    location = await db.execute(select(TaxiDriverLocation.id).where(TaxiDriverLocation.driver_id == taxi_driver.id))
    location_id = location.first()

    new_order = Order(
        request_id=request.request_id,
        taxi_id=taxi_driver.id,
        taxi_drivers_location_id=location_id.id
    )

    db.add(new_order)
    await db.commit()
    await db.refresh(new_order)

    updated_request = await get_all_requests(access_token=access_token, db=db, limit=100, skip=0)
    new_orders = []
    for item in updated_request:
        new_date = dict(item)
        new_date['created_at'] = str(dict(item)['created_at'])
        new_date['user'] = dict(item.user)
        new_orders.append(new_date)

    await manager.broadcast(new_orders)

    return StatusResponse(status_code=201, status_msg="Upgrade order")




async def get_all_requests(access_token: str, skip: int, limit: int, db: AsyncSession):
    await validate_user_from_token(access_token=access_token, db=db)
    result = await db.execute(
        select(Request)
        .join(User, User.id == Request.user_id) 
        .outerjoin(Order, Order.request_id == Request.id)
        .filter(Order.request_id.is_(None))
        .offset(skip)
        .limit(limit)
        .options(selectinload(Request.user))  
    )

    requests = result.all()

    if not requests:
        raise HTTPException(status_code=404, detail="No requests found")

    request_list = []
    for req in requests:
        
        request_data = req[0].__dict__  
        user_data = req[0].user  
        
        if user_data:
            request_data['user'] = {
                'id': user_data.id,
                'first_name': user_data.first_name,
                'last_name': user_data.last_name,
                'phone_number': user_data.phone_number
            }
        else:
            request_data['user'] = None

        request_list.append(RequestWithUser(**request_data)) 
    return request_list



async def delete_order(order_id: int, access_token: str, db: AsyncSession):
    await validate_user_from_token(access_token=access_token, db=db)
    stmt = await db.execute(
        select(Order).filter(Order.id == order_id)
    )
    order = stmt.scalars().first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    await db.delete(order)
    await db.commit()
    return StatusResponse(status_code=200, status_msg="Order deleted successfully")




async def get_driver_location(driver_id: int, access_token: str, db: AsyncSession):
    await validate_user_from_token(access_token=access_token, db=db)

    stmt = select(
        TaxiDriverLocation.driver_id,
        TaxiDriverLocation.latitude,
        TaxiDriverLocation.longitude,
        ).where(TaxiDriverLocation.driver_id == driver_id)
    
    result = await db.execute(stmt)
    driver_location = result.first()
    if not driver_location:
        raise HTTPException(status_code=404, detail="Driver location not found")
 
    return LocationDataSchema(
        driver_id=driver_id,
        latitude=driver_location.latitude,
        longitude=driver_location.longitude
    )


async def create_driver_location(location: LocationDataSchema ,access_token: str, db: AsyncSession):
    driver_data = await validate_driver_from_token(access_token=access_token, db=db)

    stmt = select(TaxiDriverLocation).where(TaxiDriverLocation.driver_id == driver_data.id)
    result = await db.execute(stmt)
    existing_location = result.scalar()

    if existing_location:
        return await update_location(location, access_token, db)

    db_location = TaxiDriverLocation(
        driver_id=driver_data.id,
        latitude=location.latitude,
        longitude=location.longitude,  
    )

    db.add(db_location)
    await db.commit()
    await db.refresh(db_location)

    return StatusResponse(status_code=201, status_msg="Request saved successfully.")



async def update_location(location_data: LocationDataSchema, access_token: str, db: AsyncSession):
    driver_data = await validate_driver_from_token(access_token=access_token, db=db)

    stmt = select(TaxiDriverLocation).where(TaxiDriverLocation.driver_id == driver_data.id)
    result = await db.execute(stmt)
    driver_location = result.first()

    if not driver_location:
        raise HTTPException(status_code=404, detail="Driver location not found")

    await db.execute(
        update(TaxiDriverLocation)
        .where(TaxiDriverLocation.driver_id == driver_data.id)
        .values(
            latitude=location_data.latitude,
            longitude=location_data.longitude,
        )
    )
    await db.commit()

    updated_locate = await get_driver_location(driver_id=driver_data.id, access_token=access_token, db=db)
    data = {
        'latitude':updated_locate.latitude,
        'longitude':updated_locate.longitude,
    }

    try:
        await manager_orders.send_to_pair(client_id=driver_data.user_id, data=data)
        print(f"Data sent to client {driver_data.user_id}: {data}")
    except Exception as e:
        print(f"Error sending data to client {driver_data.user_id}: {e}")

    return StatusResponse(status_code=200, status_msg="Driver location updated successfully")

