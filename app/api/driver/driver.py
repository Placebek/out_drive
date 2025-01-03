from typing import List
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
import json
from app.api.driver.commands.driver_crud import get_all_requests, post_request, delete_order, get_driver_location, update_location, create_driver_location
from app.api.driver.shemas.response import StatusResponse, RequestWithUser, DriverCoords, DriverLocation
from app.api.driver.shemas.create import RequestBase, OrderBase, LocationDataSchema
from context.context import get_access_token
from database.db import get_db
from decorators.decorators import is_driver, validate_user_from_token, validate_driver_from_token
from model.model import *
from websocket import manager
from websocket import manager_orders


router = APIRouter()

@router.websocket("/ws/requests")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print(f"Received data: {data}")
    except WebSocketDisconnect:
        print(f"Disconnecting: {websocket}")
        manager.disconnect(websocket)
    except Exception as e:
        print(f"Error: {e}")




@router.websocket("/ws/location")
async def websocket_location_endpoint(websocket: WebSocket, db: AsyncSession = Depends(get_db)):
    """WebSocket для обмена координатами водителя."""
    await websocket.accept()  

    try:
        data = await websocket.receive_text()
        message = json.loads(data)
        token = message.get("token")
        if not token:
            await websocket.close(code=4001, reason="Token is missing")
            return
        
        driver_id = await validate_user_from_token(access_token=token, db=db)
        data_user = {
            "id": driver_id.id,
            "userType" : "driver"
        }
        await manager_orders.connect(websocket, data_user)

        await manager_orders.pair_client_and_driver(client_id=message.get('client_id'), driver_id=driver_id.id)

        while True:
            data = await websocket.receive_text()
            print(f"Client {driver_id} sent: {data}")
    except Exception as e:
        print(f"Error with client WebSocket: {e}")
        manager_orders.disconnect(websocket)



@router.websocket("/ws/client/")
async def websocket_client(websocket: WebSocket, db: AsyncSession = Depends(get_db)):
    await websocket.accept()  # Подтверждаем соединение
    try:
        data = await websocket.receive_text()
        message = json.loads(data)
        token = message.get("token")
        if not token:
            await websocket.close(code=4001, reason="Token is missing")
            return

        client_id = await validate_user_from_token(access_token=token, db=db)

        data_user = {
            "id": client_id.id,
            "userType" : "client"
        }
        await manager_orders.connect(websocket, data_user)
        
        while True:
            data = await websocket.receive_text()
            print(f"Client {client_id} sent: {data}")
    except Exception as e:
        print(f"Error with client WebSocket: {e}")
        manager_orders.disconnect(websocket)




@router.post(
    "/request",
    summary="Create a new request",
    response_model=StatusResponse
)
@is_driver
async def request(request: RequestBase, access_token: str = Depends(get_access_token), db: AsyncSession = Depends(get_db)):
    return await post_request(request=request, access_token=access_token, db=db)



@router.get(
    "/request/list",
    summary="Get a list of requests",
    response_model=List[RequestWithUser]
)
async def get_requests(
    access_token: str = Depends(get_access_token), 
    skip: int = 0, 
    limit: int = 100, 
    db: AsyncSession = Depends(get_db)
):
    return await get_all_requests(access_token=access_token, skip=skip, limit=limit, db=db)

@router.delete(
    "/delete/{id}",
    summary="Delete an order",
    response_model=StatusResponse
)
@is_driver 
async def delete_order_route(id: int, access_token: str = Depends(get_access_token), db: AsyncSession = Depends(get_db)):
    return await delete_order(order_id=id, access_token=access_token, db=db)



@router.get(
    "/coords/{id}", 
    response_model=DriverCoords
)
async def get_driver_coords(id: int, access_token: str = Depends(get_access_token), db: AsyncSession = Depends(get_db)):
    return await get_driver_location(driver_id=id, access_token=access_token, db=db)


@router.post(
    "/coords", 
    response_model=DriverCoords
)
async def create_driver_coords(data: LocationDataSchema, access_token: str = Depends(get_access_token), db: AsyncSession = Depends(get_db)):
    return await create_driver_location(location=data, access_token=access_token, db=db)



@router.patch(
    "/coords/update", 
    response_model=StatusResponse
)
async def update_driver_coords(data: LocationDataSchema, access_token: str = Depends(get_access_token), db: AsyncSession = Depends(get_db)):
    return await update_location(location_data=data, access_token=access_token, db=db)