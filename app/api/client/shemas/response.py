from pydantic import BaseModel

class CityResponse(BaseModel):
    id: int
    city_name: str

    class Config:
        from_orm=True
        from_attributes=True

class StatusResponse(BaseModel):
    status_code: int
    status_msg: str

class OrderResponse(BaseModel):
    request_id: int
    taxi_id: int
    summ: int
    a_point: str
    b_point: str
    photo: str
    user_id: int
    car_id: int
    first_name: str
    last_name: str
    phone_number: str
    mark_name: str
    color: str
    number_car: str

    class Config:
        from_orm=True
        from_attributes=True
