from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class StatusResponse(BaseModel):
    status_code: int
    status_msg: str

# class RequestResponse(BaseModel):
#     id: int
#     summ: float
#     a_point_lat: str
#     a_point_lon: str
#     b_point_lat: str
#     b_point_lon: str
#     user_id: int
#     first_name: str
#     last_name: str
#     phone_number: str
#     # created_at: datetime
    
#     class Config:
#         from_attributes=True

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
    a_point_lat: str
    a_point_lon: str
    b_point_lat: str
    b_point_lon: str
    user_id: int
    created_at: datetime
    user: Optional[UserInfo]  
    
    class Config:
        from_attributes = True


class DriverCoords(BaseModel):
    id: int
    driver_id: int
    latitude: str
    longitude: str
    
    class Config:
        from_attributes = True


class DriverLocation(BaseModel):
    latitude: str
    longitude: str
    
    class Config:
        from_attributes = True

