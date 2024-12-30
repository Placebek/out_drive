from pydantic import BaseModel

class RequestCreate(BaseModel):
    a_point: float
    b_point: float
    summ: int
    