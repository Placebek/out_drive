from datetime import datetime
from pydantic import BaseModel

class StatusResponse(BaseModel):
    status_code: int
    access_token: str
    status_msg: str
    
class TokenResponse(BaseModel):
    status_code: int  # Обязательно
    access_token: str
    access_token_expire_time: datetime
    access_token_type: str = "Bearer"
    status_msg: str  # Обязательно