from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from context.context import create_access_token, hash_password, verify_password
from app.api.auth.shemas.create import UserCreate
from app.api.auth.shemas.response import StatusResponse, TokenResponse
from model.model import User, City

async def user_register(user: UserCreate, db: AsyncSession):
    # Проверка на существование пользователя с таким же номером телефона
    stmt = await db.execute(
        select(User)
        .filter(
            User.phone_number == user.phone_number,
        )
    )
    existing_user = stmt.scalar_one_or_none()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    # Хэшируем пароль перед сохранением
    hashed_password = hash_password(user.password)

    # Ищем город по имени
    city = await db.execute(
        select(City.id)
        .filter(
            City.city_name == user.city_name
        )
    )
    city_id = city.scalar_one_or_none()
    if not city_id:
        raise HTTPException(status_code=400, detail="City not found")

    # Создание нового пользователя
    new_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        hashed_password=hashed_password,  # Используем хэшированный пароль
        phone_number=user.phone_number,
        city_id=city_id,
    )

    # Добавляем нового пользователя в базу данных
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    # Создаем access token для нового пользователя
    access_token, expire_time = create_access_token(data={"sub": new_user.id})

    # Возвращаем статус и токен, добавляем status_code и status_msg
    return TokenResponse(
        status_code=201,  # Добавлено поле status_code
        access_token=access_token,
        access_token_expire_time=expire_time,
        status_msg="User registered successfully"  # добавлено поле status_msg
    )
