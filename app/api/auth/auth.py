from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.auth.shemas.create import UserBase, UserCreate
from app.api.auth.shemas.response import StatusResponse, TokenResponse

from app.api.auth.commands.auth_crud import user_register
from database.db import get_db

router = APIRouter()

@router.post(
    '/register',
    summary="",
    response_model=StatusResponse
)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    return await user_register(user=user, db=db)

# @router.post(
#     '/login',
#     summary="",
#     response_model=TokenResponse
# )
# async def login(user: UserBase, db: AsyncSession = Depends(get_db)):
#     return await user_login(user=user, db=db)
