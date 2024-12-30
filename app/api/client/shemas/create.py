from pydantic import BaseModel

class RequestCreate(BaseModel):
    a_point: str
    b_point: str
    summ: int
    