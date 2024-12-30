from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session
from app.api.driver.commands.driver_crud import update_request
from app.api.driver.shemas.response import StatusResponse, RequestWithuser
from database.db import async_session_factory
from context.context import get_access_token
from database.db import get_db
from model.model import *
from sqlalchemy.future import select
from app.api.driver.commands.driver_crud import validate_user_from_token


router = APIRouter()

def get_db():
    db = async_session_factory()
    try:
        yield db
    finally:
        db.close()

@router.post(
    '/request',
    summary="",
    response_model=StatusResponse
)
async def request(request_id: int, access_token: str = Depends(get_access_token), db: AsyncSession = Depends(get_db)):
    return await update_request(request_id=request_id, access_token=access_token, db=db)


@router.get(
    "/request/list",
    summary="",
    response_model=List[RequestWithuser])
async def get_requests(access_token: str = Depends(get_access_token), skip: int = 0,limit: int = 10,db: AsyncSession = Depends(get_db)):
    user = await validate_user_from_token(access_token=access_token, db=db)
    result = await db.execute(select(Request).offset(skip).limit(limit))
    requests = result.scalars().all()
    if not requests:
        raise HTTPException(status_code=404, detail="No requests found")
    return requests
