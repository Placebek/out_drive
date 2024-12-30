from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.driver.commands.driver_crud import all_requests, post_request
from app.api.driver.shemas.response import StatusResponse
from app.api.driver.shemas.create import RequestBase


from context.context import get_access_token
from database.db import get_db
from decorators.decorators import is_driver

router = APIRouter()

@router.post(
    '/request',
    summary="",
    response_model=StatusResponse
)
@is_driver
async def request(request: RequestBase, access_token: str = Depends(get_access_token), db: AsyncSession = Depends(get_db)):
    return await post_request(request=request, access_token=access_token, db=db)

@router.get(
    '/request',
    summary="",
    response_model=StatusResponse
)
@is_driver
async def request(access_token: str = Depends(get_access_token), db: AsyncSession = Depends(get_db)):
    return await all_requests(access_token=access_token, db=db)
