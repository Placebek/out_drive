from fastapi import FastAPI
from fastapi.openapi.models import HTTPBearer as HTTPBearerModel
from fastapi.middleware.cors import CORSMiddleware

from app.router import route

app = FastAPI()

origins = [
    "http://localhost:3000",  # Разрешить фронтенд на этом домене
    # "https://your-production-frontend.com",  # Разрешить продакшен-домен
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Разрешить все методы (GET, POST, и т.д.)
    allow_headers=["*"],  # Разрешить все заголовки
)

app.include_router(route)
