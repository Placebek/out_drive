from pydantic import BaseModel

class RequestCreate(BaseModel):
    A_point: str
    B_point: str
    summ: int
