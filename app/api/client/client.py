from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.client.commands.client_crud import all_cities, request_create, all_orders
from app.api.client.shemas.response import CityResponse, StatusResponse, OrderResponse
from app.api.client.shemas.create import RequestCreate
from context.context import get_access_token
from database.db import get_db

router = APIRouter()

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
