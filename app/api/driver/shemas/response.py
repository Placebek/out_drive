from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class StatusResponse(BaseModel):
    status_code: int
    status_msg: str

class RequestResponse(BaseModel):
    id: int
    summ: float
    a_point: str
    b_point: str
    user_id: int
    first_name: str
    last_name: str
    phone_number: str

    class Config:
        from_orm=True
        from_attributes=True
        
class UserInfo(BaseModel):
    id: int
    first_name: str
    last_name: str
    phone_number: str

    class Config:
        orm_mode = True

class RequestWithUser(BaseModel):
    id: int
    summ: int
    a_point: str
    b_point: str
    user_id: int
    created_at: datetime
    user: Optional[UserInfo]  
    
    class Config:
        orm_mode = True


class CarInfo(BaseModel):
    id: int
    mark_name: str
    color: str
    number_car: str

    class Config:
        orm_mode = True


class TaxiDriverRespone(BaseModel):
    id: int
    photo: str
    user: Optional[UserInfo] 
    car: Optional[CarInfo]

    class Config:
        orm_mode = True
    

class OrderResponse(BaseModel):
    id: int
    request: Optional[RequestWithUser]
    taxi_driver: Optional[TaxiDriverRespone]

    class Config:
        orm_mode = True