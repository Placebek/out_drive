from pydantic import BaseModel

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    password: str
    phone_number: str
    city_name: str

class UserBase(BaseModel):
    phone_number: str
    password: str
