from pydantic import BaseModel

class PutRequest(BaseModel):
    request_id: int
    