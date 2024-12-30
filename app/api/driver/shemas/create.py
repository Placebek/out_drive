from pydantic import BaseModel

class PutRequest(BaseModel):
    request_id: int
    
class RequestCreate(BaseModel):
    summ: int
    a_point: float
    b_point: float

    class Config:
        orm_mode = True