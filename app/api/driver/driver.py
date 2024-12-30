from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.driver.commands.driver_crud import get_all_requests, post_request
from app.api.driver.shemas.response import StatusResponse, RequestWithUser
from app.api.driver.shemas.create import RequestBase
from context.context import get_access_token
from database.db import get_db
from decorators.decorators import is_driver
from model.model import *


router = APIRouter()

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
@is_driver
async def get_requests(
    access_token: str = Depends(get_access_token), 
    skip: int = 0, 
    limit: int = 10, 
    db: AsyncSession = Depends(get_db)
):
    return await get_all_requests(access_token=access_token, skip=skip, limit=limit, db=db)
