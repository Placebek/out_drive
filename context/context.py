import hashlib

from datetime import datetime, timedelta
from typing import Optional
from fastapi import HTTPException, Request
from jose import jwt

from core.config import settings

def hash_password(plain_password: str) -> str:
    return hashlib.sha256(plain_password.encode('utf-8')).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> str:
    return hash_password(plain_password) == hashed_password

async def validate_access_token(access_token: str) -> str:
    payload = jwt.decode(
            access_token,
            settings.TOKEN_SECRET_KEY,
            algorithms=[settings.TOKEN_ALGORITHM]
        )
        
    tg_id = payload.get("sub") 
    if tg_id is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    exp = payload.get("exp")
    if exp and exp < datetime.utcnow().timestamp():
        raise HTTPException(status_code=401, detail="Token has expired")
    
    return tg_id

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> tuple:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(settings.TOKEN_EXPIRE_MiNUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.TOKEN_SECRET_KEY, algorithm=settings.TOKEN_ALGORITHM)
    return encoded_jwt, expire.isoformat()


async def validate_access_token(access_token: str) -> str:
    payload = jwt.decode(
            access_token,
            settings.TOKEN_SECRET_KEY,
            algorithms=[settings.TOKEN_ALGORITHM]
        )
        
    username = payload.get("sub") 
    if username is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    exp = payload.get("exp")
    if exp and exp < datetime.utcnow().timestamp():
        raise HTTPException(status_code=401, detail="Token has expired")
    
    return username

async def get_access_token(request: Request) -> str:
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Authorization header is missing")
    
    parts = auth_header.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid Authorization header format")
    
    return parts[1]