from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.driver.commands.driver_crud import update_request
from app.api.driver.shemas.response import StatusResponse

from context.context import get_access_token
from database.db import get_db

router = APIRouter()

@router.put(
    '/request',
    summary="",
    response_model=StatusResponse
)
async def request(request_id: int, access_token: str = Depends(get_access_token), db: AsyncSession = Depends(get_db)):
    return await update_request(request_id=request_id, access_token=access_token, db=db)

