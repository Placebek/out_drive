from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session
from app.api.driver.commands.driver_crud import update_request
from app.api.driver.shemas.response import StatusResponse, RequestWithuser
from app.api.driver.shemas.create import RequestCreate
from app.api.driver.commands.driver_crud import validate_user_from_token
from context.context import get_access_token
from database.db import get_db, async_session_factory
from model.model import *
from sqlalchemy import select


router = APIRouter()

def get_db():
    db = async_session_factory()
    try:
        yield db
    finally:
        db.close()

@router.post(
    "/request",
    summary="Create a new request",
    response_model=StatusResponse
)
async def create_request(request: RequestCreate,access_token: str = Depends(get_access_token),db: AsyncSession = Depends(get_db),):
    user = await validate_user_from_token(access_token=access_token, db=db)
    new_request = Request(
        a_point=request.a_point,
        b_point=request.b_point,
        summ=request.summ,
    )
    db.add(new_request)
    await db.commit()
    await db.refresh(new_request)

    return StatusResponse(status_code=201, status_msg="Request created successfully")

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
