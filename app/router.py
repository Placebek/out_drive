from fastapi import APIRouter

from app.api.auth.auth import router as auth_router
from app.api.client.client import router as client_router
from app.api.driver.driver import router as driver_router


route = APIRouter()

route.include_router(auth_router, prefix="/auth", tags=["Authentication"])
route.include_router(client_router, prefix="/client", tags=["Client"])
route.include_router(driver_router, prefix="/driver", tags=["Driver"])
