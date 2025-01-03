from pydantic import BaseModel

class RequestBase(BaseModel):
    request_id: int
    latitude: str
    longitude: str


class LocationDataSchema(BaseModel):
    latitude: str
    longitude: str
    


class OrderBase(BaseModel):
    order_id: int   




class RequestCreate(BaseModel):
    summ: int
    a_point: str
    b_point: str

    class Config:
        from_attributes = True
