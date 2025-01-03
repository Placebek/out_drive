from typing import List
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.client.commands.client_crud import all_cities, request_create, get_all_orders
from app.api.client.shemas.response import CityResponse, StatusResponse, OrderResponse
from app.api.client.shemas.create import RequestCreate
from context.context import get_access_token
from database.db import get_db
from websocket import manager


router = APIRouter()

@router.websocket("/ws")
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

@router.post(
    '/request',
    summary="",
    response_model=StatusResponse
)
async def request(request: RequestCreate, access_token: str = Depends(get_access_token), db: AsyncSession = Depends(get_db)):
    return await request_create(request=request, access_token=access_token, db=db)


@router.get(
    '/cities',
    summary="",
    response_model=List[CityResponse]
)
async def cities(db: AsyncSession = Depends(get_db)):
    return await all_cities(db=db)


@router.get(
    "/orders/list", 
    response_model=List[OrderResponse]
)
async def get_orders(access_token: str = Depends(get_access_token), db: AsyncSession = Depends(get_db)):
    return await get_all_orders(access_token=access_token, db=db)

