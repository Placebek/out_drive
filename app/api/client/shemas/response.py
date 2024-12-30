from pydantic import BaseModel

class CityResponse(BaseModel):
    city_id: int
    city_name: str

class StatusResponse(BaseModel):
    status_code: int
    status_msg: str
