from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.auth.shemas.create import DriverBase, DriverCreate
from app.api.auth.shemas.response import StatusResponse, TokenResponse

from app.api.auth.commands.auth_driver_crud import driver_register
from context.context import get_access_token
from database.db import get_db

router = APIRouter()

@router.post(
    '/register',
    summary="",
    response_model=StatusResponse
)
async def register(driver_data: DriverCreate, access_token: str = Depends(get_access_token), db: AsyncSession = Depends(get_db)):
    return await driver_register(driver_data=driver_data, access_token=access_token, db=db)
