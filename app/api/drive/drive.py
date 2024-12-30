from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.drive.commands.drive_crud import all_cities, request_create
from app.api.drive.shemas.response import CityResponse, StatusResponse
from app.api.drive.shemas.create import RequestCreate

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
async def cities(access_token: str = Depends(get_access_token), db: AsyncSession = Depends(get_db)):
    return await all_cities(access_token=access_token, db=db)
