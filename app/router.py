from fastapi import APIRouter

from app.api.auth.auth_client import router as auth_client_router
from app.api.auth.auth_driver import router as auth_driver_router
from app.api.client.client import router as client_router
from app.api.driver.driver import router as driver_router


route = APIRouter()

route.include_router(auth_client_router, prefix="/auth/client", tags=["ClientAuthentication"])
route.include_router(auth_driver_router, prefix="/auth/driver", tags=["DriverAuthentication"])
route.include_router(client_router, prefix="/client", tags=["Client"])
route.include_router(driver_router, prefix="/driver", tags=["Driver"])
