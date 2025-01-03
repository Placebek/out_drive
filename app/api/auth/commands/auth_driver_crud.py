from fastapi import HTTPException
from sqlalchemy import insert, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.auth.shemas.create import DriverCreate
from decorators.decorators import validate_user_from_token
from model.model import User, TaxiDriver, Car


async def driver_register(driver_data: DriverCreate, access_token: str, db: AsyncSession):
    user = await validate_user_from_token(access_token=access_token, db=db)

    stmt = await db.execute(
        select(TaxiDriver)
        .join(User, TaxiDriver.user_id == user.id)
    )
    existing_user = stmt.first()

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    car_db = await db.execute(
        select(Car)
        .filter(
            Car.mark_name == driver_data.mark_name,
            Car.color == driver_data.color,
            Car.number_car == driver_data.number_car,
        )
    )
    car = car_db.scalar_one_or_none()

    if not car:
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
    else:
        car_id = car.id
    
    await db.execute(
        update(User)
        .where(User.id == user.id)
        .values(roles="driver")
)

    new_texi_driver = TaxiDriver(
        photo=driver_data.photo,
        user_id=user.id,
        car_id=car_id,
    )
    db.add(new_texi_driver)
    await db.commit()
    await db.refresh(new_texi_driver)

    updated_user_stmt = await db.execute(
        select(User.roles).where(User.id == user.id)
    )
    updated_user = updated_user_stmt.scalar_one()

    return {"status_code":201, "status_msg":"Great", "roles": updated_user}
