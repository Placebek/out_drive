from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class StatusResponse(BaseModel):
    status_code: int
    status_msg: str

class RequestResponse(BaseModel):
    id: int
    summ: float
    a_point: float
    b_point: float
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

    class Config:
        orm_mode = True

class RequestWithUser(BaseModel):
    id: int
    summ: int
    a_point: float
    b_point: float
    user_id: int
    created_at: datetime
    user: Optional[UserInfo]  
    
    class Config:
        orm_mode = True