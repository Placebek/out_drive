from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class StatusResponse(BaseModel):
    status_code: int
    status_msg: str


class RequestBase(BaseModel):
    summ: int
    a_point: float
    b_point: float
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    id: int
    first_name: str
    last_name: str
    phone_number: str
    location: str

    class Config:
        orm_mode = True


class RequestWithuser(RequestBase):
    user: Optional[UserBase]


