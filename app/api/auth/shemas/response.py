from datetime import datetime
from pydantic import BaseModel

class StatusResponse(BaseModel):
    roles: str
    status_code: int
    status_msg: str
    
class TokenResponse(BaseModel):
    roles: str = 'passenger'
    access_token: str
    access_token_expire_time: datetime
    access_token_type: str = 'Bearer'

class TokenResponseLogin(BaseModel):
    roles: str
    access_token: str
    access_token_expire_time: datetime
    access_token_type: str = 'Bearer'