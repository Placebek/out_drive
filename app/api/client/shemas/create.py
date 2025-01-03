from pydantic import BaseModel

class RequestCreate(BaseModel):
    a_point_lat: str  
    a_point_lon: str  
    b_point_lat: str  
    b_point_lon: str
    summ: int
