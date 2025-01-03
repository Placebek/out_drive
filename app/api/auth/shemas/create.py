from pydantic import BaseModel

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    password: str
    phone_number: str
    city_name: str
    roles: str

class UserBase(BaseModel):
    phone_number: str
    password: str


class DriverCreate(BaseModel):
    photo: str 
    mark_name: str
    color: str
    number_car: str

class DriverBase(BaseModel):
    phone_number: str
    password: str
