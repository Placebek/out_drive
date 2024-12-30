from fastapi import HTTPException
from jose import JWTError
from sqlalchemy import insert, select
from sqlalchemy.ext.asyncio import AsyncSession
from context.context import create_access_token, validate_access_token, verify_password
from app.api.auth.shemas.create import UserBase, DriverCreate
from app.api.auth.shemas.response import StatusResponse, TokenResponse
from model.model import User, TaxiDriver, Car


async def validate_user_from_token(access_token: str, db: AsyncSession) -> User:
    try:
        user_id = await validate_access_token(access_token=access_token)

        stmt = await db.execute(
            select(User)
            .filter(User.id == user_id)
        )
        user = stmt.scalar_one_or_none()
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        
        return user

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    

async def driver_register(driver_data: DriverCreate, access_token: str, db: AsyncSession):
    user = await validate_user_from_token(access_token=access_token, db=db)

    stmt = await db.execute(
        select(TaxiDriver)
        .join(
            User, User.id == user.id
        )
    )
    existing_user = stmt.scalar_one_or_none()

    if not existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    db_car = await db.execute(
        insert(Car)
        .values(
            mark_name=driver_data.mark_name,
            color=driver_data.color,
            number_car=driver_data.number_car,
        )
        .returning(Car.id)
    )
    await db.commit()
    car_id = db_car.fetchone()[0]

    new_texi_driver = TaxiDriver(
        photo=driver_data.photo,
        user_id=user.id,
        car_id=car_id,
    )
    db.add(new_texi_driver)
    await db.commit()
    await db.refresh(new_texi_driver)

    return StatusResponse(status_code=201, status_msg="Great")
    

async def user_login(user: UserBase, db: AsyncSession):
    try:
        result = await db.execute(
            select(TaxiDriver, User)
            .join(
                User, User.phone_number==user.phone_number
            )
        )
        db_user = result.scalar_one_or_none()

        if not db_user[0] or not verify_password(user.password, db_user[1].hashed_password):
            raise HTTPException(
                status_code=401,
                detail="Invalid username or password"
            )

        access_token, expire_time = create_access_token(data={"sub": db_user[1].id, "role": "driver"})

        return TokenResponse(
            access_token=access_token,
            access_token_expire_time=expire_time
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred during login: {str(e)}"
        )
