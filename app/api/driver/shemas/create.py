from pydantic import BaseModel

class RequestBase(BaseModel):
    request_id: int
    