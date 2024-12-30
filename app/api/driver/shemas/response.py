from pydantic import BaseModel

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
        