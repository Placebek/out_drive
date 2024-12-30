from pydantic import BaseModel

class CityResponse(BaseModel):
    id: int
    city_name: str

    class Config:
        from_orm=True
        from_attributes=True

class StatusResponse(BaseModel):
    status_code: int
    status_msg: str
