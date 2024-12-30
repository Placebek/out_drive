from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class CityResponse(BaseModel):
    id: int
    city_name: str

    class Config:
        from_attributes=True

class StatusResponse(BaseModel):
    status_code: int
    status_msg: str

        
class UserInfo(BaseModel):
    id: int
    first_name: str
    last_name: str
    phone_number: str

    class Config:
        from_attributes = True

class RequestWithUser(BaseModel):
    id: int
    summ: int
    a_point: str
    b_point: str
    user_id: int
    created_at: datetime
    user: Optional[UserInfo]  
    
    class Config:
        from_attributes = True


class CarInfo(BaseModel):
    id: int
    mark_name: str
    color: str
    number_car: str

    class Config:
        from_attributes = True


class TaxiDriverRespone(BaseModel):
    id: int
    photo: str
    user: Optional[UserInfo] 
    car: Optional[CarInfo]

    class Config:
        from_attributes = True
    

class OrderResponse(BaseModel):
    id: int
    request: Optional[RequestWithUser]
    taxi_driver: Optional[TaxiDriverRespone]

    class Config:
        from_attributes = True

